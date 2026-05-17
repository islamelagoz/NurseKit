/* ============================================================
   İntraop Modern Görev Paneli — Preop pariteli
   ------------------------------------------------------------
   Preop'taki nk135 task-card tasarımını intraop'a taşır:
     • Section'lar: Safety (kırmızı), Care (teal), Closure (amber)
     • Modern .preop-task-card düzeni (stateMark + name + task + pills + substep dots)
     • Intraop'a özel: clinical-key veya gcklNode varsa popup açar (MSV/count panel
       kanalı), yoksa completeTask çağırır
   ============================================================ */
(function nkIntraopModernTasksPatch() {
    try {
        if (typeof window === 'undefined') return;

        const SAFETY = 'Zorunlu Güvenlik Görevleri';
        const CARE = 'İntraoperatif Bakım / Risk Yönetimi Görevleri';
        const CLOSURE = 'Kapanış / Sign-out Görevleri';

        // Closure section için ek stil (preop-task-section.safety/care zaten var)
        function injectClosureStyles() {
            if (document.getElementById('nk-intraop-closure-style')) return;
            const st = document.createElement('style');
            st.id = 'nk-intraop-closure-style';
            st.textContent =
                '.preop-task-section.closure{border-color:rgba(224,165,88,.30);background:linear-gradient(180deg,rgba(224,165,88,.045),rgba(255,255,255,.018))}'
              + '.preop-task-card.closure-pending{border-color:rgba(224,165,88,.30)}'
              + '.preop-pill.closure{background:rgba(224,165,88,.14);color:#f0d29a;border-color:rgba(224,165,88,.30)}';
            document.head.appendChild(st);
        }

        function splitLabel(label) {
            const parts = String(label || '').split('·');
            const name = (parts[0] || label || '').trim();
            const task = (parts.slice(1).join('·') || '').trim();
            return { name, task: task || 'Görevi tamamla' };
        }

        function taskGroup(t) {
            if (t.group) return t.group;
            const id = String(t.id || '').toLowerCase();
            if (/signout|closure|final_count|count_close|count_discrepancy/.test(id)) return CLOSURE;
            if (t.critical) return SAFETY;
            return CARE;
        }

        function taskProgress(t) {
            const done = window.App && Array.isArray(App.completedTasks) && App.completedTasks.includes(t.id);
            // Multi-source / evidence-based substep ilerlemesi (varsa)
            let total = Array.isArray(t.substeps) ? t.substeps.length : 1;
            let completed = done ? total : 0;
            if (!done && window.IntraopGCKL && (t.linkedNode || t.gcklNode)) {
                try {
                    const node = IntraopGCKL.getNode(t.linkedNode || t.gcklNode);
                    if (node && Array.isArray(node.requiredEvidence) && node.evidenceCollected) {
                        const reqTotal = node.requiredEvidence.length;
                        const reqDone = node.requiredEvidence.filter(k => !!node.evidenceCollected[k]).length;
                        if (reqTotal > 0) {
                            total = reqTotal;
                            completed = reqDone;
                        }
                    }
                } catch(e) {}
            }
            return {
                total,
                completed,
                partial: completed > 0 && completed < total,
                done: completed >= total && (done || total > 0)
            };
        }

        function makeTaskCard(t) {
            const done = window.App && Array.isArray(App.completedTasks) && App.completedTasks.includes(t.id);
            const progress = taskProgress(t);
            const isCare = taskGroup(t) === CARE;
            const isClosure = taskGroup(t) === CLOSURE;
            const split = splitLabel(t.label);

            const item = document.createElement('div');
            const stateClass = done ? 'done'
                              : (isCare ? 'support-pending'
                              : (isClosure ? 'closure-pending' : 'critical-pending'));
            item.className = 'preop-task-card ' + stateClass;

            const stateMark = done ? '✓' : (progress.partial ? '•' : (t.critical ? '!' : '•'));
            const checkClass = done ? 'state-done' : (t.critical ? 'state-critical' : 'state-pending');
            const statusLabel = done ? 'Tamamlandı' : (progress.partial ? 'Kısmi' : 'Bekliyor');

            const role = (typeof getTaskRoleInfo === 'function') ? getTaskRoleInfo(t, App.currentRoom) : null;

            const badges = [];
            if (role?.name) badges.push('<span class="preop-pill">' + role.name + '</span>');
            if (isClosure) badges.push('<span class="preop-pill closure">Kapanış</span>');
            else if (isCare) badges.push('<span class="preop-pill care">Bakım / risk</span>');
            else badges.push('<span class="preop-pill crit">Kritik güvenlik</span>');
            badges.push('<span class="preop-pill ' + (done ? 'done' : (progress.partial ? 'partial' : 'wait')) + '">' + statusLabel + '</span>');
            if (progress.total > 1) {
                badges.push('<span class="preop-pill">' + progress.completed + '/' + progress.total + ' adım</span>');
            }
            // Hard-stop / WHO SSC vurgulamaları
            if (window.IntraopGCKL && (t.linkedNode || t.gcklNode)) {
                try {
                    const node = IntraopGCKL.getNode(t.linkedNode || t.gcklNode);
                    if (node && node.hardStop && !done) {
                        badges.push('<span class="preop-pill crit">Hard-stop</span>');
                    }
                } catch(e) {}
            }
            if (t.guideline === 'who_ssc') badges.push('<span class="preop-pill">WHO SSC</span>');

            // Substep ilerleme noktaları (1 nokta = 1 substep / evidence)
            const dotCount = Math.max(1, progress.total);
            const dots = Array.from({ length: dotCount }).map((_, i) => {
                const filled = progress.completed > i;
                return '<span class="preop-substep-dot"><i style="width:' + (filled ? '100' : '0') + '%"></i></span>';
            }).join('');

            item.innerHTML =
                '<div class="check ' + checkClass + '" title="' + statusLabel + '" aria-label="' + statusLabel + '">' + stateMark + '</div>'
              + '<div class="task-main">'
              +   '<div class="preop-card-name">' + split.name + '</div>'
              +   '<div class="preop-card-task">' + split.task + '</div>'
              +   '<div class="preop-card-badges">' + badges.join('') + '</div>'
              +   '<div class="preop-substeps" aria-label="Alt adım ilerlemesi">' + dots + '</div>'
              + '</div>';

            // Click: intraop'a özel — evidence popup veya completeTask
            item.onclick = function(ev) {
                try {
                    if (typeof openIntraopTaskEvidencePopup === 'function'
                        && (t.gcklNode || t.linkedNode || t.gcklMapId || t.linkedClinicalKey)) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if (openIntraopTaskEvidencePopup(t, item, ev)) return;
                    }
                } catch(e) {}
                if (typeof completeTask === 'function') completeTask(t.id);
            };

            return item;
        }

        function renderIntraopModernPanel() {
            if (!window.App || App.currentRoom !== 'intraop' || !App.currentPatient?.intraop) return;
            const list = document.getElementById('task-list');
            if (!list) return;

            injectClosureStyles();
            // Preop stilleri zaten yüklü (nk135InjectStyles) — burada da kullanılacak.
            // Eğer preop yüklenmemişse, ona güvenmeyelim ve manuel inject edelim.
            // (nk135's stil bloğu task-list panel yüklendiğinde zaten enjekte ediliyor;
            // intraop ilk açılırsa preop hiç açılmamış olabilir. Idempotent yükleyici:)
            if (!document.getElementById('nk135-preop-task-styles')) {
                try { if (typeof nk135InjectStyles === 'function') nk135InjectStyles(); } catch(e) {}
            }

            const phase = App.currentPatient.intraop;
            const tasks = Array.isArray(phase.tasks) ? phase.tasks : [];

            // Korumak istediğimiz UI elemanları: role kartı, role-focus kartı, GCKL map (igm9)
            const keep = [];
            list.querySelectorAll('.phase-role-card, #intra-role-focus-card, #igm9-map-panel, #gckl-count-panel').forEach(n => keep.push(n));

            // Gruplara böl
            const groupOrder = [SAFETY, CARE, CLOSURE];
            const grouped = {};
            for (const t of tasks) {
                const g = taskGroup(t);
                if (!grouped[g]) grouped[g] = [];
                grouped[g].push(t);
            }

            // task-list'i temizle (sadece task-item ve preop-task-section'ları)
            const survivors = new Set(keep);
            [...list.children].forEach(child => {
                if (!survivors.has(child)) child.remove();
            });

            // role/role-focus/igm9 sırayla zaten list'te; tasks'ları onlardan SONRA ekle
            groupOrder.forEach(groupName => {
                const grp = grouped[groupName];
                if (!grp || !grp.length) return;
                const doneCount = grp.filter(t => App.completedTasks.includes(t.id)).length;
                const section = document.createElement('div');
                const cls = groupName === SAFETY ? 'safety'
                          : groupName === CLOSURE ? 'closure' : 'care';
                section.className = 'preop-task-section ' + cls;
                const head = document.createElement('div');
                head.className = 'preop-task-section-head';
                head.innerHTML = '<div class="preop-task-section-title">' + groupName + '</div>'
                               + '<div class="preop-task-section-count">' + doneCount + '/' + grp.length + '</div>';
                section.appendChild(head);
                grp.forEach(t => section.appendChild(makeTaskCard(t)));
                list.appendChild(section);
            });

            // Other tasks (without matched group) — fallback
            const other = tasks.filter(t => !groupOrder.includes(taskGroup(t)));
            if (other.length) {
                const section = document.createElement('div');
                section.className = 'preop-task-section care';
                const head = document.createElement('div');
                head.className = 'preop-task-section-head';
                head.innerHTML = '<div class="preop-task-section-title">Diğer Görevler</div>'
                               + '<div class="preop-task-section-count">'
                               + other.filter(t => App.completedTasks.includes(t.id)).length
                               + '/' + other.length + '</div>';
                section.appendChild(head);
                other.forEach(t => section.appendChild(makeTaskCard(t)));
                list.appendChild(section);
            }
        }

        // renderRightPanel'i sar — preop wrapper'ından sonra zincirlenecek.
        const orig = window.renderRightPanel || (typeof renderRightPanel === 'function' ? renderRightPanel : null);
        if (typeof orig === 'function' && !orig.__nkIntraopModernPanel) {
            const wrapped = function() {
                const r = orig.apply(this, arguments);
                try { renderIntraopModernPanel(); } catch(e) { console.warn('İntraop modern panel hatası', e); }
                return r;
            };
            wrapped.__nkIntraopModernPanel = true;
            window.renderRightPanel = wrapped;
            try { renderRightPanel = wrapped; } catch(e) {}
        }

        window.addEventListener('load', () => setTimeout(renderIntraopModernPanel, 350));
    } catch (err) {
        console.warn('İntraop modern görev paneli patch yüklenemedi', err);
    }
})();
