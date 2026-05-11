(function nkCollapseGCKL10TaskListPatch(){
    try {
        // GCKL-10 artık GCKL_TASK_DEFS'te tek alt-görev olarak tanımlı.
        // Bu patch tarihsel olarak 3 ayrı kartı birleştirmek için yazılmıştı;
        // şimdi tek kart üretildiği için patch DEVRE DIŞI bırakıldı.
        // Eski referans bütünlüğü için ID listesi korundu.
        const GCKL10_TASK_IDS = ['gckl_10_patient_verify'];
        function nkCompleted(id){ return !!(window.App && Array.isArray(App.completedTasks) && App.completedTasks.includes(id)); }
        // Patch artık DOM müdahalesi yapmıyor — GCKL_TASK_DEFS doğrudan tek kart üretiyor.
        function nkCollapseGCKL10VisibleTasks(){ /* no-op since GCKL-10 is now single task */ }
        window.nkCollapseGCKL10VisibleTasks = nkCollapseGCKL10VisibleTasks;
    } catch(err) { console.warn('GCKL-10 collapse patch (now no-op) error', err); }
})();




(() => {
    try {
        const SAFETY_GROUP = 'Zorunlu Güvenlik Görevleri';
        const CARE_GROUP = 'Bakım ve Risk Değerlendirme Görevleri';

        function nk135InjectStyles() {
            if (document.getElementById('nk135-preop-task-styles')) return;
            const st = document.createElement('style');
            st.id = 'nk135-preop-task-styles';
            st.textContent = `
                .preop-task-section{margin:10px 0 12px;padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.025)}
                .preop-task-section.safety{border-color:rgba(217,99,113,.24);background:linear-gradient(180deg,rgba(217,99,113,.045),rgba(255,255,255,.018))}
                .preop-task-section.care{border-color:rgba(92,196,214,.18);background:linear-gradient(180deg,rgba(92,196,214,.035),rgba(255,255,255,.015))}
                .preop-task-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 8px}
                .preop-task-section-title{font-size:12px;font-weight:850;letter-spacing:.01em;color:var(--ink)}
                .preop-task-section-count{font-size:10px;font-weight:750;color:var(--ink-mute);padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.07)}
                .preop-task-card{border-radius:14px;margin:7px 0;padding:10px 11px;border:1px solid rgba(255,255,255,.08);background:rgba(12,22,32,.38);display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:flex-start;cursor:pointer;transition:transform .15s ease, border-color .15s ease, background .15s ease}
                .preop-task-card:hover{transform:translateY(-1px);border-color:rgba(92,196,214,.30);background:rgba(12,22,32,.50)}
                .preop-task-card.done{border-color:rgba(76,184,138,.30);background:rgba(76,184,138,.055)}
                .preop-task-card.critical-pending{border-color:rgba(217,99,113,.30)}
                .preop-task-card.support-pending{border-color:rgba(92,196,214,.16)}
                .preop-task-card .preop-card-name{font-size:13px;font-weight:850;color:var(--ink);line-height:1.2;margin-bottom:3px}
                .preop-task-card .preop-card-task{font-size:11px;line-height:1.28;color:var(--ink-mute);margin-bottom:7px}
                .preop-task-card .preop-card-badges{display:flex;flex-wrap:wrap;gap:5px}
                .preop-pill{font-size:10px;font-weight:750;padding:4px 7px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.045);color:var(--ink-mute)}
                .preop-pill.crit{background:rgba(217,99,113,.12);color:var(--red);border-color:rgba(217,99,113,.22)}
                .preop-pill.care{background:rgba(92,196,214,.10);color:var(--teal);border-color:rgba(92,196,214,.18)}
                .preop-pill.done{background:rgba(76,184,138,.12);color:var(--green);border-color:rgba(76,184,138,.22)}
                .preop-pill.wait{background:rgba(217,99,113,.10);color:var(--red);border-color:rgba(217,99,113,.20)}
                .preop-pill.partial{background:rgba(224,165,88,.11);color:var(--amber);border-color:rgba(224,165,88,.20)}
                .preop-substeps{margin-top:7px;display:flex;gap:4px;align-items:center}
                .preop-substep-dot{height:4px;flex:1;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden}
                .preop-substep-dot i{display:block;height:100%;width:0;background:var(--green)}
                .preop-task-card.done .preop-substep-dot i{width:100%}
            `;
            document.head.appendChild(st);
        }

        function nk135SplitLabel(label) {
            const parts = String(label || '').split('·');
            const card = (parts[0] || label || '').trim();
            const task = (parts.slice(1).join('·') || '').trim();
            return { card, task: task || 'Görevi tamamla' };
        }

        function nk135TaskProgress(t, done) {
            const total = Array.isArray(t.substeps) && t.substeps.length ? t.substeps.length : 1;
            const completed = done ? total : 0;
            return { total, completed, partial: completed > 0 && completed < total };
        }

        function nk135MakeTaskCard(t) {
            const done = App.completedTasks.includes(t.id);
            const progress = nk135TaskProgress(t, done);
            const partial = progress.partial;
            const group = t.group || (t.critical ? SAFETY_GROUP : CARE_GROUP);
            const isCare = group === CARE_GROUP;
            const split = nk135SplitLabel(t.label);
            const item = document.createElement('div');
            item.className = 'preop-task-card ' + (done ? 'done' : (isCare ? 'support-pending' : 'critical-pending'));
            const stateMark = done ? '✓' : (partial ? '•' : (t.critical ? '!' : '•'));
            const checkClass = done ? 'state-done' : (t.critical ? 'state-critical' : 'state-pending');
            const statusLabel = done ? 'Tamamlandı' : (partial ? 'Kısmi' : 'Bekliyor');
            const role = (typeof getTaskRoleInfo === 'function') ? getTaskRoleInfo(t, App.currentRoom) : null;
            const badges = [];
            if (role?.name) badges.push(`<span class="preop-pill">${role.name}</span>`);
            badges.push(`<span class="preop-pill ${isCare ? 'care' : 'crit'}">${isCare ? 'Bakım / risk' : 'Kritik güvenlik'}</span>`);
            badges.push(`<span class="preop-pill ${done ? 'done' : (partial ? 'partial' : 'wait')}">${statusLabel}</span>`);
            badges.push(`<span class="preop-pill">${progress.completed}/${progress.total} adım</span>`);
            const dots = Array.from({length: Math.max(1, progress.total)}).map((_, i) => `<span class="preop-substep-dot"><i style="width:${done || i < progress.completed ? '100' : '0'}%"></i></span>`).join('');
            item.innerHTML = `
                <div class="check ${checkClass}" title="${statusLabel}" aria-label="${statusLabel}">${stateMark}</div>
                <div class="task-main">
                    <div class="preop-card-name">${split.card}</div>
                    <div class="preop-card-task">${split.task}</div>
                    <div class="preop-card-badges">${badges.join('')}</div>
                    <div class="preop-substeps" aria-label="Alt adım ilerlemesi">${dots}</div>
                </div>
            `;
            item.onclick = () => completeTask(t.id);
            return item;
        }

        function nk135RenderPreopTaskPanel() {
            if (!window.App || App.currentRoom !== 'preop' || !App.currentPatient?.preop) return;
            const list = document.getElementById('task-list');
            if (!list) return;
            nk135InjectStyles();
            const phase = App.currentPatient.preop;
            const keep = [];
            const roleCard = list.querySelector('.phase-role-card');
            if (roleCard) keep.push(roleCard.cloneNode(true));
            list.innerHTML = '';
            keep.forEach(n => list.appendChild(n));

            const groups = [SAFETY_GROUP, CARE_GROUP];
            groups.forEach(groupName => {
                const tasks = (phase.tasks || []).filter(t => (t.group || (t.critical ? SAFETY_GROUP : CARE_GROUP)) === groupName);
                if (!tasks.length) return;
                const doneCount = tasks.filter(t => App.completedTasks.includes(t.id)).length;
                const section = document.createElement('div');
                section.className = 'preop-task-section ' + (groupName === SAFETY_GROUP ? 'safety' : 'care');
                const head = document.createElement('div');
                head.className = 'preop-task-section-head';
                head.innerHTML = `<div class="preop-task-section-title">${groupName}</div><div class="preop-task-section-count">${doneCount}/${tasks.length}</div>`;
                section.appendChild(head);
                tasks.forEach(t => section.appendChild(nk135MakeTaskCard(t)));
                list.appendChild(section);
            });
        }

        const __nk135_renderRightPanel = window.renderRightPanel || (typeof renderRightPanel === 'function' ? renderRightPanel : null);
        if (typeof __nk135_renderRightPanel === 'function' && !__nk135_renderRightPanel.__nk135PreopPanel) {
            const wrapped = function() {
                const r = __nk135_renderRightPanel.apply(this, arguments);
                try { nk135RenderPreopTaskPanel(); } catch(e) { console.warn('Preop görev paneli sadeleştirilemedi', e); }
                return r;
            };
            wrapped.__nk135PreopPanel = true;
            window.renderRightPanel = wrapped;
            try { renderRightPanel = wrapped; } catch(e) {}
        }
        window.addEventListener('load', () => setTimeout(nk135RenderPreopTaskPanel, 300));
    } catch(err) { console.warn('v5.135 preop görev paneli patch uygulanamadı', err); }
})();


/* v5.136 — Preop kart içerikleri, doğrulama kilidi ve görev bağlantıları */
(() => {
    try {
        const NK136_SAFETY = 'Zorunlu Güvenlik Görevleri';
        const NK136_CARE = 'Bakım ve Risk Değerlendirme Görevleri';

        const NK136_TASKS = {
            verify: {
                match: ['identity','consent-site','preop-site-marker','consent'],
                cardKey: 'identity-consent-site',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'Kimlik / Onam / Taraf · Cerrahi doğrulamayı tamamla',
                taskTitle: 'Kimlik / Onam / Taraf',
                taskText: 'Cerrahi doğrulamayı tamamla',
                categories: ['patientSafety','checklistPerformance','communication'],
                substeps: ['Kimliği hastadan doğrula','Cerrahi onamı kontrol et','Ameliyat bölgesi/tarafı doğrula','Mikro karar sorusunu doğru yanıtla']
            },
            allergy: {
                match: ['preop-allergy'],
                cardKey: 'preop-allergy',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'Alerji · Alerji riskini doğrula',
                taskTitle: 'Alerji',
                taskText: 'Alerji riskini doğrula',
                categories: ['patientSafety','checklistPerformance','clinicalAssessment'],
                substeps: ['Alerji öyküsünü hastadan sorgula','Alerji bilgisini dosya/kayıt ile doğrula','Mikro karar sorusunu doğru yanıtla']
            },
            npo: {
                match: ['npo-labs'],
                cardKey: 'npo-labs',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'NPO · Açlık ve tetkik uygunluğunu doğrula',
                taskTitle: 'NPO',
                taskText: 'Açlık ve tetkik uygunluğunu doğrula',
                categories: ['patientSafety','clinicalAssessment','surgicalNursingKnowledge'],
                substeps: ['Son oral alım zamanını hastadan doğrula','NPO durumunu dosya ile kontrol et','Gerekli tetkiklerin tamamlandığını kontrol et','Mikro karar sorusunu doğru yanıtla']
            },
            blood: {
                match: ['preop-crossmatch'],
                cardKey: 'preop-crossmatch',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'KAN · Kan hazırlığını doğrula',
                taskTitle: 'KAN',
                taskText: 'Kan hazırlığını doğrula',
                categories: ['patientSafety','checklistPerformance','surgicalNursingKnowledge'],
                substeps: ['Kan grubu / crossmatch kaydını kontrol et','Gerekli kan ürünü hazırlığını doğrula','Hasta kimliği ile dosya/kayıt eşleşmesini kontrol et','Mikro karar sorusunu doğru yanıtla']
            },
            med: {
                match: ['preop-medrec'],
                cardKey: 'preop-medrec',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'İlaç · İlaç öyküsünü doğrula',
                taskTitle: 'İlaç',
                taskText: 'İlaç öyküsünü doğrula',
                categories: ['patientSafety','clinicalAssessment','surgicalNursingKnowledge'],
                substeps: ['Sürekli kullanılan ilaçları sorgula','Antikoagülan / antiagregan / insülin gibi riskli ilaçları değerlendir','Dosya/kayıt ile karşılaştır','Mikro karar sorusunu doğru yanıtla']
            },
            iv: {
                match: ['iv-access'],
                cardKey: 'iv-access',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'IV · Damar yolu hazırlığını kontrol et',
                taskTitle: 'IV',
                taskText: 'Damar yolu hazırlığını kontrol et',
                categories: ['patientSafety','clinicalAssessment'],
                substeps: ['IV erişimi fiziksel olarak kontrol et','Damar yolunun kullanıma uygunluğunu doğrula','Tedavi planı/dosya ile karşılaştır','Mikro karar sorusunu doğru yanıtla']
            },
            transfer: {
                match: ['preop-transfer'],
                cardKey: 'preop-transfer',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'Transfer · Güvenli transfer hazırlığını tamamla',
                taskTitle: 'Transfer',
                taskText: 'Güvenli transfer hazırlığını tamamla',
                categories: ['patientSafety','communication','checklistPerformance'],
                substeps: ['Hasta ve dosya bilgisini kontrol et','Damar yolu ve hazırlık durumunu kontrol et','Güvenli teslim hazırlığını tamamla','Mikro karar sorusunu doğru yanıtla']
            },
            vte: {
                match: ['preop-vte'],
                cardKey: 'preop-vte',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'VTE · Profilaksi gereksinimini gözden geçir',
                taskTitle: 'VTE',
                taskText: 'Profilaksi gereksinimini gözden geçir',
                categories: ['clinicalAssessment','surgicalNursingKnowledge','patientSafety'],
                substeps: ['VTE riskini değerlendir','Profilaksi planını kontrol et','Hazırlanan ekipmanı doğrula','Mikro karar sorusunu doğru yanıtla']
            },
            skin: {
                match: ['preop-clipper'],
                cardKey: 'preop-clipper',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'Cilt Hazırlığı · Cerrahi alan hazırlığını doğrula',
                taskTitle: 'Cilt Hazırlığı',
                taskText: 'Cerrahi alan hazırlığını doğrula',
                categories: ['surgicalNursingKnowledge','patientSafety'],
                substeps: ['Cerrahi alan hazırlığı gereksinimini kontrol et','Clipper gereksinimini değerlendir','Uygunsuz tıraş/cilt hasarı riskini önle','Mikro karar sorusunu doğru yanıtla']
            },
            prep: {
                match: ['prep'],
                cardKey: 'prep',
                group: NK136_SAFETY,
                critical: true,
                gckl: true,
                taskLabel: 'Hazırlık · Hasta hazırlığını tamamla',
                taskTitle: 'Hazırlık',
                taskText: 'Hasta hazırlığını tamamla',
                categories: ['patientSafety','surgicalNursingKnowledge'],
                substeps: ['Takı / protez / oje / makyaj kontrolünü yap','Kıyafet ve kişisel eşya kontrolünü tamamla','Mikro karar sorusunu doğru yanıtla']
            },
            delirium: {
                match: ['preop-delirium'],
                cardKey: 'preop-delirium',
                group: NK136_CARE,
                critical: false,
                gckl: false,
                taskLabel: 'Deliryum · Kognitif riski değerlendir',
                taskTitle: 'Deliryum',
                taskText: 'Kognitif riski değerlendir',
                categories: ['clinicalAssessment','patientCentredCare','clinicalReasoning'],
                substeps: ['Oryantasyon ve bilişsel risk belirtilerini değerlendir','Duyusal destek gereksinimini belirle','Önceki deliryum / ileri yaş / uyku bozulması gibi riskleri sorgula']
            },
            anxiety: {
                match: ['preop-anxiety'],
                cardKey: 'preop-anxiety',
                group: NK136_CARE,
                critical: false,
                gckl: false,
                taskLabel: 'Anksiyete · Preop kaygıyı değerlendir',
                taskTitle: 'Anksiyete',
                taskText: 'Preop kaygıyı değerlendir',
                categories: ['communication','patientCentredCare','clinicalAssessment'],
                substeps: ['Kaygı düzeyini sorgula','Bilgilendirme ve destek gereksinimini belirle']
            }
        };

        const NK136_POPUPS = {
            identity: {
                task:'verify', title:'KİMLİK DOĞRULAMA', chips:['Kimlik','Preop güvenlik'],
                desc:'Hasta kimliği doğrudan hastadan alınan bilgi ve dosya/kayıt ile doğrulanır.',
                role:'Preop hemşiresi hasta kimliğini aktif biçimde sorar; bileklik, dosya ve kayıtla çapraz kontrol eder.',
                warning:'Kimlik doğrulaması yapılmazsa yanlış hasta/yanlış işlem riski oluşur.',
                buttons:['Kimliği hastadan doğrula','Dosya/kayıt ile karşılaştır'],
                stepMap:[0,0]
            },
            'consent-site': {
                task:'verify', title:'ONAM / DOSYA PANELİ', chips:['Onam','Dosya'],
                desc:'Cerrahi onam ve dosya uyumu hasta gönderilmeden önce kontrol edilir.',
                role:'Preop hemşiresi cerrahi onam, işlem adı ve dosya bilgisini kontrol eder; eksiklikte transferi durdurur.',
                warning:'Onam doğrulanmazsa etik, hukuki ve hasta güvenliği riski oluşur.',
                buttons:['Hastaya sor / onamı doğrula','Dosya/onam formunu kontrol et'],
                stepMap:[1,1]
            },
            'preop-site-marker': {
                task:'verify', title:'CERRAHİ BÖLGE / TARAF İŞARETİ', chips:['Taraf','WHO SSC'],
                desc:'Planlanan ameliyat bölgesi hasta, onam ve dosya bilgisiyle uyumlu olmalıdır.',
                role:'Preop hemşiresi taraf/bölge bilgisini hasta ve kayıtlarla doğrular; işaretleme eksikse ekibi uyarır.',
                warning:'Taraf/bölge doğrulaması atlanırsa yanlış taraf cerrahisi riski oluşur.',
                buttons:['Hastaya sor / tarafı doğrula','Taraf işareti ve dosya uyumunu kontrol et'],
                stepMap:[2,2]
            },
            'preop-allergy': {
                task:'allergy', title:'ALERJİ / RİSK BİLEKLİĞİ', chips:['Alerji','Risk'],
                desc:'Bilinen ilaç, lateks veya madde alerjisi hastadan ve kayıttan doğrulanır.',
                role:'Preop hemşiresi alerji öyküsünü sorgular, bileklik ve dosya bilgisini kontrol eder.',
                warning:'Alerji bilgisi atlanırsa ilaç, lateks veya materyal reaksiyonu gelişebilir.',
                buttons:['Hastaya sor / alerjiyi doğrula','Dosya/kayıt ile doğrula'],
                stepMap:[0,1]
            },
            'npo-labs': {
                task:'npo', title:'NPO VE TETKİK FORMU', chips:['NPO','Tetkik'],
                desc:'Açlık süresi ve gerekli tetkikler hasta ve dosya üzerinden kontrol edilir.',
                role:'Preop hemşiresi son oral alım zamanını hastadan öğrenir; NPO ve tetkik durumunu dosya ile karşılaştırır.',
                warning:'NPO veya tetkik eksikliği aspirasyon, gecikme ve hazırlık hatası riski oluşturur.',
                buttons:['Hastaya sor / son oral alımı doğrula','NPO durumunu dosya ile kontrol et','Tetkikleri kontrol et'],
                stepMap:[0,1,2]
            },
            'preop-crossmatch': {
                task:'blood', title:'KAN HAZIRLIĞI / CROSSMATCH ETİKETİ', chips:['KAN','Crossmatch'],
                desc:'Kan grubu, crossmatch ve gerekli kan ürünü hazırlığı dosya ve ekip doğrulamasıyla kontrol edilir.',
                role:'Preop hemşiresi hasta dosyası, istem ve kan hazırlığı kayıtlarını kontrol eder; gerekli durumda ekip ile doğrular.',
                warning:'Kan hazırlığı doğrulanmazsa acil durumda gecikme, yanlış ürün eşleşmesi veya transfüzyon güvenliği riski oluşabilir.',
                buttons:['Hasta kimliği ile dosyayı eşleştir','Crossmatch kaydını kontrol et','Kan ürünü hazırlığını doğrula'],
                stepMap:[2,0,1]
            },
            'preop-medrec': {
                task:'med', title:'İLAÇ UZLAŞTIRMA KARTI', chips:['İlaç','Riskli ilaç'],
                desc:'Sürekli kullanılan ilaçlar ve cerrahi öncesi riskli ilaçlar hastadan ve kayıttan doğrulanır.',
                role:'Preop hemşiresi ilaç öyküsünü hastadan alır; antikoagülan, antiagregan ve insülin gibi riskli ilaçları dosya ile karşılaştırır.',
                warning:'İlaç öyküsü doğrulanmazsa kanama, hipoglisemi, hipertansiyon veya ilaç etkileşimi riski artar.',
                buttons:['Hastaya sor / ilaç öyküsünü doğrula','Riskli ilaçları değerlendir','Dosya/kayıt ile karşılaştır'],
                stepMap:[0,1,2]
            },
            'iv-access': {
                task:'iv', title:'IV / DAMAR YOLU HAZIRLIĞI', chips:['IV','Erişim'],
                desc:'Damar yolu açıklığı, güvenliği ve tedavi planına uygunluğu kontrol edilir.',
                role:'Preop hemşiresi IV erişimi fiziksel olarak değerlendirir; tedavi planı ve transfer gereksinimiyle uyumunu kontrol eder.',
                warning:'IV erişim doğrulanmazsa sıvı, ilaç veya acil müdahalede gecikme yaşanabilir.',
                buttons:['IV erişimi fiziksel kontrol et','Kullanıma uygunluğunu doğrula','Tedavi planı ile karşılaştır'],
                stepMap:[0,1,2]
            },
            'preop-transfer': {
                task:'transfer', title:'TRANSFER GÜVENLİK KARTI', chips:['Transfer','Devir'],
                desc:'Hasta ameliyathaneye gönderilmeden önce hasta, dosya, IV ve teslim hazırlığı kontrol edilir.',
                role:'Preop hemşiresi güvenli transfer için hasta kimliği, dosya, damar yolu ve teslim bilgisini koordine eder.',
                warning:'Transfer kontrolü eksik olursa hasta, dosya veya tedavi bilgisinde kopukluk oluşabilir.',
                buttons:['Hastaya sor / transfer bilgisini doğrula','Dosya ve IV hazırlığını kontrol et','Teslim hazırlığını tamamla'],
                stepMap:[0,1,2]
            },
            'preop-delirium': {
                task:'delirium', title:'DELİRYUM / KOGNİTİF RİSK KARTI', chips:['Deliryum','Kognitif risk'],
                desc:'Deliryum riski, oryantasyon, duyusal destek ve önceki risk faktörleri üzerinden değerlendirilir.',
                role:'Preop hemşiresi hastanın oryantasyonunu ve kognitif risklerini değerlendirir; gerekli önleyici bakım gereksinimlerini belirler.',
                warning:'Kognitif risk atlanırsa postoperatif deliryum önleme fırsatı kaçabilir.',
                buttons:['Hastaya sor / oryantasyonu değerlendir','Duyusal destek gereksinimini belirle','Risk faktörlerini sorgula'],
                stepMap:[0,1,2]
            },
            'preop-anxiety': {
                task:'anxiety', title:'PREOP ANKSİYETE KARTI', chips:['Anksiyete','Hasta desteği'],
                desc:'Hastanın ameliyat öncesi kaygısı ve bilgi gereksinimi kısa görüşmeyle değerlendirilir.',
                role:'Preop hemşiresi hastanın kaygı düzeyini sorgular ve uygun bilgilendirme/destek gereksinimini belirler.',
                warning:'Kaygı değerlendirilmezse hasta iş birliği, uyku, ağrı ve iyileşme süreci olumsuz etkilenebilir.',
                buttons:['Hastaya sor / kaygıyı değerlendir','Bilgilendirme ve destek gereksinimini belirle'],
                stepMap:[0,1]
            },
            'preop-vte': {
                task:'vte', title:'VTE PROFİLAKSİ SETİ', chips:['VTE','Profilaksi'],
                desc:'VTE riski, profilaksi planı ve hazırlanan ekipman birlikte kontrol edilir.',
                role:'Preop hemşiresi VTE riskini ve profilaksi planını değerlendirir; hazırlanan ekipmanı doğrular.',
                warning:'VTE profilaksisi gözden kaçarsa tromboemboli riski artabilir.',
                buttons:['Risk / profilaksi planını doğrula','Profilaksi planını kontrol et','Hazırlanan ekipmanı doğrula'],
                stepMap:[0,1,2]
            },
            'preop-clipper': {
                task:'skin', title:'CİLT HAZIRLIĞI / CLIPPER SETİ', chips:['Cilt','Clipper'],
                desc:'Cerrahi alan hazırlığı ve gerekiyorsa clipper kullanımı güvenli yöntemle planlanır.',
                role:'Preop hemşiresi cerrahi alan hazırlığı gereksinimini değerlendirir; uygunsuz tıraş ve cilt hasarı riskini önler.',
                warning:'Uygunsuz tıraş veya cilt hazırlığı cerrahi alan enfeksiyonu ve cilt hasarı riskini artırabilir.',
                buttons:['Hastaya sor / alan hazırlığını doğrula','Clipper gereksinimini değerlendir','Cilt hasarı riskini önle'],
                stepMap:[0,1,2]
            },
            prep: {
                task:'prep', title:'HASTA HAZIRLIK KUTUSU', chips:['Hazırlık','Kişisel eşya'],
                desc:'Takı, protez, oje/makyaj, kıyafet ve kişisel eşya kontrolü ameliyathaneye transfer öncesi tamamlanır.',
                role:'Preop hemşiresi hastaya hazırlık sorularını sorar; kişisel eşya ve güvenlik kontrollerini tamamlar.',
                warning:'Hasta hazırlığı eksikse yanık, bası, kayıp eşya, enfeksiyon veya transfer gecikmesi riski oluşabilir.',
                buttons:['Hastaya sor / hazırlığı kontrol et','Takı-protez-oje-makyaj kontrolünü yap','Kıyafet ve kişisel eşya kontrolünü tamamla'],
                stepMap:[0,0,1]
            }
        };


        const NK138_SCENARIOS = {
            identity: {
                task:'verify', required:true,
                title:'Kimlik doğrulama kararı',
                scenarioText:'Hasta kimliğini sözlü doğrularken dosyadaki doğum tarihi ile hastanın söylediği tarih uyuşmuyor.',
                questionText:'Bu durumda en güvenli yaklaşım nedir?',
                options:[
                    'Hastanın adını doğruladığım için süreci devam ettiririm.',
                    'Uyuşmazlığı görmezden gelmeden bileklik, dosya ve ekip ile kimliği yeniden doğrularım.',
                    'Yakınına sorup yeterli kabul ederim.',
                    'Sadece hemşire notuna yazarım.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Kimlik uyuşmazlığı çözülmeden preop hazırlık ve transfer ilerletilmemelidir.',
                wrongFeedback:'Yanlış. Sözlü beyan veya yakın bilgisi tek başına yeterli değildir; bileklik, dosya ve ekip doğrulaması gerekir.',
                scoreCategories:['patientSafety','communication','checklistPerformance']
            },
            'consent-site': {
                task:'verify', required:true,
                title:'Onam/dosya kararı',
                scenarioText:'Cerrahi onam formunda işlem adı eksik görünüyor; hasta ameliyathaneye alınmak üzere.',
                questionText:'Bu durumda ne yapmalısın?',
                options:[
                    'Eksiklik küçük olduğu için transferi başlatırım.',
                    'Onam ve işlem bilgisi netleşmeden transferi durdurur, sorumlu ekip ile doğrularım.',
                    'Hastaya imza attırıp süreci tamamlarım.',
                    'Sadece ameliyathane ekibine sözlü bilgi veririm.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Onam ve işlem bilgisi net değilse hasta güvenliği ve hukuki güvenlik açısından süreç durdurulmalıdır.',
                wrongFeedback:'Yanlış. Onam eksikliği sözlü bilgiyle geçiştirilemez; kayıt ve ekip doğrulaması gerekir.',
                scoreCategories:['patientSafety','checklistPerformance','communication']
            },
            'preop-site-marker': {
                task:'verify', required:true,
                title:'Taraf/bölge doğrulama kararı',
                scenarioText:'Hasta sağ taraf ameliyatı olacağını söylüyor; dosyada ise sol taraf yazıyor.',
                questionText:'En güvenli yaklaşım nedir?',
                options:[
                    'Hastanın söylediğini esas alıp sağ tarafı işaretlerim.',
                    'Dosyayı esas alıp sol tarafı işaretlerim.',
                    'Uyuşmazlığı fark eder, cerrah/anestezi ekibi ve kayıtlarla netleştirilmeden süreci ilerletmem.',
                    'Taraf bilgisini ameliyathanede tekrar sorarım.'
                ],
                correctOptionIndex:2,
                correctFeedback:'Doğru. Taraf uyuşmazlığı çözülmeden işaretleme ve transfer yapılmamalıdır.',
                wrongFeedback:'Yanlış. Hasta beyanı veya dosya tek başına yeterli değildir; uyuşmazlık ekip ile çözülmelidir.',
                scoreCategories:['patientSafety','checklistPerformance','clinicalReasoning']
            },
            'preop-allergy': {
                task:'allergy', required:true,
                title:'Alerji güvenliği kararı',
                scenarioText:'Hasta lateks alerjisi olduğunu söylüyor; dosyada alerji bilgisi boş görünüyor.',
                questionText:'Ne yapmalısın?',
                options:[
                    'Dosyada yazmadığı için alerji yok kabul ederim.',
                    'Hastanın beyanını kayda geçirir, bileklik/dosya güncellemesini ve ekip bilgilendirmesini sağlarım.',
                    'Sadece hastaya dikkatli olmasını söylerim.',
                    'Ameliyathaneye gidince kontrol edilir diye beklerim.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Alerji beyanı güvenlik bilgisidir; kayıt ve ekip iletişimiyle görünür hâle getirilmelidir.',
                wrongFeedback:'Yanlış. Alerji bilgisi hasta beyanı ile başlar ama kayıt ve ekip doğrulamasıyla güvenceye alınır.',
                scoreCategories:['patientSafety','clinicalAssessment','communication']
            },
            'npo-labs': {
                task:'npo', required:true,
                title:'NPO/tetkik kararı',
                scenarioText:'Hasta sabah az miktarda su içtiğini söylüyor; dosyada NPO bilgisi net görünmüyor.',
                questionText:'İlk güvenli yaklaşım nedir?',
                options:[
                    'Az su içmişse sorun olmaz, transferi başlatırım.',
                    'Son oral alımı hastadan netleştirir, dosya/anestezi ekibiyle doğrular ve uygunluk netleşmeden transferi başlatmam.',
                    'Sadece dosyaya “su içti” diye not düşerim.',
                    'Hastaya bir daha içmemesini söylerim.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. NPO belirsizliği aspirasyon riskiyle ilişkilidir; hasta beyanı ve dosya/anestezi doğrulaması gerekir.',
                wrongFeedback:'Yanlış. NPO belirsizliği netleşmeden transfer başlatılamaz.',
                scoreCategories:['patientSafety','clinicalAssessment','surgicalNursingKnowledge']
            },
            'preop-crossmatch': {
                task:'blood', required:true,
                title:'Kan hazırlığı kararı',
                scenarioText:'Hasta ameliyathaneye transfer edilmek üzere; ancak dosyada crossmatch sonucunun doğrulandığı görünmüyor.',
                questionText:'Bu durumda en güvenli yaklaşım nedir?',
                options:[
                    'Transferi başlatırım; kan gerekirse ameliyathanede kontrol edilir.',
                    'Hastaya kan grubunu sorar ve yeterli kabul ederim.',
                    'Crossmatch ve kan hazırlığı doğrulanmadan transferi başlatmam; ekibi bilgilendiririm.',
                    'Sadece hemşire gözlem formuna not düşerim.'
                ],
                correctOptionIndex:2,
                correctFeedback:'Doğru. Kan hazırlığı doğrulanmadan transfer başlatmak acil durumda gecikme ve transfüzyon güvenliği riski oluşturabilir.',
                wrongFeedback:'Yanlış. Hastanın beyanı veya not düşmek tek başına yeterli değildir; crossmatch ve kayıt doğrulaması gerekir.',
                scoreCategories:['patientSafety','checklistPerformance','surgicalNursingKnowledge']
            },
            'preop-medrec': {
                task:'med', required:true,
                title:'İlaç öyküsü kararı',
                scenarioText:'Hasta kan sulandırıcı kullandığını söylüyor ancak ilaç listesinde net görünmüyor.',
                questionText:'En güvenli yaklaşım nedir?',
                options:[
                    'Hasta hatırlıyor olabilir, ama önemli değil diyerek süreci ilerletirim.',
                    'İlaç öyküsünü hastadan alır, dosya/kayıt ile karşılaştırır ve cerrahi/anestezi ekibini bilgilendiririm.',
                    'Sadece ameliyat sonrası tekrar sorgularım.',
                    'Hastaya ilacı bugün almamasını söyleyip dosyayı kontrol etmem.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Riskli ilaçlar hasta beyanı, kayıt ve ekip iletişimiyle doğrulanmalıdır.',
                wrongFeedback:'Yanlış. Riskli ilaç öyküsü kayıtla karşılaştırılmadan güvenli karar verilemez.',
                scoreCategories:['patientSafety','clinicalAssessment','surgicalNursingKnowledge']
            },
            'iv-access': {
                task:'iv', required:true,
                title:'IV erişim kararı',
                scenarioText:'Hastanın IV kateteri var ancak giriş yeri kızarık ve sıvı akışı yavaş.',
                questionText:'Ne yapmalısın?',
                options:[
                    'Kateter takılı olduğu için yeterli kabul ederim.',
                    'IV erişimi fiziksel değerlendirir, kullanılabilirliğini doğrular ve gerekirse yeni erişim/ekip bildirimi sağlarım.',
                    'Transferden sonra ameliyathanede bakılmasını beklerim.',
                    'Sadece sıvı hızını artırırım.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. IV erişim “var” olmakla yetmez; güvenli ve kullanılabilir olmalıdır.',
                wrongFeedback:'Yanlış. IV erişim sorunu acil ilaç/sıvı uygulamasında gecikmeye yol açabilir.',
                scoreCategories:['patientSafety','clinicalAssessment']
            },
            'preop-transfer': {
                task:'transfer', required:true,
                title:'Transfer güvenliği kararı',
                scenarioText:'Hasta transfer için hazır görünüyor; ancak dosya ve IV bilgisi son kez eşleştirilmemiş.',
                questionText:'Ne yapmalısın?',
                options:[
                    'Zaman kaybetmemek için transferi başlatırım.',
                    'Hasta, dosya, damar yolu ve teslim bilgilerini son kez kontrol eder; eksik varsa transferi başlatmam.',
                    'Sadece taşıma personeline teslim ederim.',
                    'Ameliyathane ekibi kontrol eder diye beklerim.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Güvenli transfer, hasta-dosya-IV ve teslim bilgisinin birlikte kontrol edilmesini gerektirir.',
                wrongFeedback:'Yanlış. Transfer öncesi son kontrol yapılmazsa bilgi kopukluğu ve güvenlik hatası oluşabilir.',
                scoreCategories:['patientSafety','communication','checklistPerformance']
            },
            'preop-vte': {
                task:'vte', required:true,
                title:'VTE profilaksi kararı',
                scenarioText:'Hastada ileri yaş ve mobilite kısıtlılığı var; profilaksi planı net görünmüyor.',
                questionText:'En güvenli yaklaşım nedir?',
                options:[
                    'Risk yüksek olsa da ameliyat sonrası değerlendirilir.',
                    'VTE riskini değerlendirir, profilaksi planını kontrol eder ve hazırlanan ekipmanı doğrularım.',
                    'Sadece antiembolik çorabı hastaya veririm.',
                    'Hastaya yürürse yeterli olacağını söylerim.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. VTE profilaksisi risk, plan ve ekipman uygunluğu birlikte değerlendirilerek güvenceye alınır.',
                wrongFeedback:'Yanlış. VTE riski yalnızca ekipman vermekle yönetilemez; plan ve uygunluk kontrolü gerekir.',
                scoreCategories:['clinicalAssessment','surgicalNursingKnowledge','patientSafety']
            },
            'preop-clipper': {
                task:'skin', required:true,
                title:'Cilt hazırlığı kararı',
                scenarioText:'Hasta ameliyat alanını evde jiletle tıraş ettiğini söylüyor; ciltte küçük tahriş alanları var.',
                questionText:'Ne yapmalısın?',
                options:[
                    'Evde tıraş yapıldığı için cilt hazırlığını tamamlanmış kabul ederim.',
                    'Cildi değerlendirir, uygun hazırlık planını ve clipper gereksinimini ekip ile doğrularım.',
                    'Tahrişi görmezden gelirim.',
                    'Hastaya tekrar jiletle düzeltmesini söylerim.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Uygunsuz tıraş ve cilt hasarı cerrahi alan enfeksiyonu açısından dikkate alınmalıdır.',
                wrongFeedback:'Yanlış. Jilet/tahriş bilgisi cilt hazırlığı kararını değiştirebilir; ekip ile doğrulama gerekir.',
                scoreCategories:['surgicalNursingKnowledge','patientSafety','clinicalAssessment']
            },
            prep: {
                task:'prep', required:true,
                title:'Hasta hazırlığı kararı',
                scenarioText:'Hasta protez dişini çıkarmadığını ve alyansını çıkaramadığını söylüyor.',
                questionText:'Ne yapmalısın?',
                options:[
                    'Sorun olmaz diyerek transferi başlatırım.',
                    'Takı/protez/kişisel eşya kontrolünü tamamlar, çıkarılamayan materyali kayıt ve ekip iletişimiyle güvenceye alırım.',
                    'Sadece hasta yakınına teslim etmesini söylerim.',
                    'Ameliyat sonrası kontrol ederim.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Hasta hazırlığı eksikliği yanık, aspirasyon, bası, kayıp eşya ve transfer gecikmesi riskini artırabilir.',
                wrongFeedback:'Yanlış. Kişisel eşya/protez bilgisi güvenli hazırlık ve kayıt gerektirir.',
                scoreCategories:['patientSafety','surgicalNursingKnowledge']
            },
            'preop-delirium': {
                task:'delirium', required:false,
                title:'Deliryum riski kararı',
                scenarioText:'Yaşlı hasta gece uyuyamadığını ve nerede olduğunu zaman zaman karıştırdığını söylüyor.',
                questionText:'En doğru hemşirelik yaklaşımı nedir?',
                options:[
                    'Bunu normal kabul eder ve kayıt altına almam.',
                    'Kognitif risk ve oryantasyon durumunu değerlendirir; duyusal destek, aile desteği ve güvenlik önlemlerini planlarım.',
                    'Sadece sakinleştirici istemi beklerim.',
                    'Hastayı daha az konuştururum.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Deliryum önleme risk tanıma, oryantasyon, duyusal destek ve güvenlik planıyla başlar.',
                wrongFeedback:'Yanlış. Konfüzyon/uyku bozulması deliryum riski açısından değerlendirilmelidir.',
                scoreCategories:['clinicalAssessment','patientCentredCare','clinicalReasoning']
            },
            'preop-anxiety': {
                task:'anxiety', required:false,
                title:'Anksiyete kararı',
                scenarioText:'Hasta ameliyattan çok korktuğunu ve ne olacağını bilmediğini söylüyor.',
                questionText:'En doğru yaklaşım nedir?',
                options:[
                    'Korkmasının normal olduğunu söyleyip ayrılırım.',
                    'Kaygıyı değerlendirir, açık bilgi verir, soru sormasına fırsat tanır ve destek gereksinimini belirlerim.',
                    'Konuyu değiştirmesini isterim.',
                    'Sadece ailesiyle konuşmasını öneririm.'
                ],
                correctOptionIndex:1,
                correctFeedback:'Doğru. Anksiyete yönetimi açık bilgi, aktif dinleme ve destek gereksinimini belirleme ile yürütülür.',
                wrongFeedback:'Yanlış. Kaygı ifadesi hasta merkezli bakım ve iletişim gerektirir.',
                scoreCategories:['communication','patientCentredCare','clinicalAssessment']
            }
        };

        function nk138InjectStyles() {
            if (document.getElementById('nk138-micro-scenario-styles')) return;
            const st = document.createElement('style');
            st.id = 'nk138-micro-scenario-styles';
            st.textContent = `
                .nk138-modal-backdrop{position:fixed;inset:0;background:rgba(3,8,14,.62);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px}
                .nk138-modal{width:min(560px,calc(100vw - 36px));max-height:82vh;overflow:auto;border-radius:20px;background:linear-gradient(180deg,rgba(10,24,38,.98),rgba(12,27,42,.98));border:1px solid rgba(92,196,214,.42);box-shadow:0 30px 80px rgba(0,0,0,.42);padding:20px}
                .nk138-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
                .nk138-title{font-size:17px;line-height:1.2;font-weight:850;color:var(--teal);letter-spacing:.035em;text-transform:uppercase}
                .nk138-close{border:0;background:transparent;color:var(--ink-mute);font-size:24px;cursor:pointer;line-height:1}
                .nk138-card{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);border-radius:14px;padding:12px;margin:10px 0;color:var(--ink);font-size:13px;line-height:1.45}
                .nk138-card b{color:var(--ink)}
                .nk138-options{display:grid;gap:8px;margin-top:12px}
                .nk138-option{display:flex;gap:9px;align-items:flex-start;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.045);border-radius:13px;padding:10px 12px;color:var(--ink);font-size:12.5px;line-height:1.35;cursor:pointer;text-align:left}
                .nk138-option:hover{border-color:rgba(92,196,214,.32);background:rgba(92,196,214,.08)}
                .nk138-option.selected{border-color:rgba(92,196,214,.55);background:rgba(92,196,214,.14)}
                .nk138-feedback{display:none;margin-top:12px;border-radius:13px;padding:10px 12px;font-size:12.5px;line-height:1.42}
                .nk138-feedback.ok{display:block;border:1px solid rgba(76,184,138,.34);background:rgba(76,184,138,.12);color:var(--green)}
                .nk138-feedback.bad{display:block;border:1px solid rgba(217,99,113,.34);background:rgba(217,99,113,.12);color:#ffd7df}
                .nk138-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
                .nk138-submit{border:1px solid rgba(92,196,214,.42);background:rgba(92,196,214,.13);color:var(--teal);border-radius:12px;padding:10px 13px;font-weight:850;cursor:pointer}
                .nk138-submit:disabled{opacity:.55;cursor:not-allowed}
                .nk138-secondary{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.045);color:var(--ink-mute);border-radius:12px;padding:10px 13px;font-weight:750;cursor:pointer}
            `;
            document.head.appendChild(st);
        }
        function nk136InjectStyles() {
            if (document.getElementById('nk136-preop-card-styles')) return;
            const st = document.createElement('style');
            st.id = 'nk136-preop-card-styles';
            st.textContent = `
                #obj-popup.nk136-popup-mode{width:min(500px,calc(100vw - 30px));max-height:min(72dvh,640px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:14px 12px 13px 14px;border-radius:16px;border:1px solid rgba(92,196,214,.42);box-shadow:0 20px 58px rgba(0,0,0,.36);background:linear-gradient(180deg,rgba(10,24,38,.98),rgba(12,27,42,.98));scrollbar-width:thin;scrollbar-color:rgba(92,196,214,.55) rgba(255,255,255,.06)}
                #obj-popup.nk136-popup-mode::-webkit-scrollbar{width:8px}
                #obj-popup.nk136-popup-mode::-webkit-scrollbar-track{background:rgba(255,255,255,.045);border-radius:999px}
                #obj-popup.nk136-popup-mode::-webkit-scrollbar-thumb{background:rgba(92,196,214,.46);border-radius:999px;border:2px solid rgba(10,24,38,.95)}
                #obj-popup.nk136-popup-mode::-webkit-scrollbar-thumb:hover{background:rgba(92,196,214,.70)}
                #obj-popup.nk136-popup-mode .nk136-card{padding-right:2px}
                @media (max-width:920px){#obj-popup.nk136-popup-mode{max-height:min(74dvh,calc(100dvh - 96px));width:auto;left:12px!important;right:12px!important;bottom:12px!important;padding-right:10px}}

                #obj-popup.nk136-popup-mode .oclose{position:absolute;right:12px;top:10px;font-size:18px;color:var(--ink-mute);cursor:pointer}
                #obj-popup.nk136-popup-mode .oclose:hover{color:var(--ink)}
                #obj-popup .nk136-card{display:block;font-size:12px;color:var(--ink);line-height:1.36;font-weight:500}
                #obj-popup .nk136-title{display:block;font-size:15px;line-height:1.18;letter-spacing:.035em;color:var(--teal);font-weight:820;margin:0 24px 8px 0;text-transform:uppercase}
                #obj-popup .nk136-desc{display:block;font-size:12px;line-height:1.40;color:var(--ink);margin:0 0 9px;font-weight:600}
                #obj-popup .nk136-chips{display:flex!important;flex-wrap:wrap;gap:5px;margin:7px 0 9px!important;align-items:center}
                #obj-popup .nk136-chip{display:inline-flex!important;align-items:center;gap:4px;border:1px solid rgba(92,196,214,.24);background:rgba(92,196,214,.10);color:var(--teal);font-size:10px;font-weight:720;border-radius:999px;padding:4px 8px;line-height:1;white-space:nowrap}
                #obj-popup .nk136-note{display:block;border-radius:12px;border:1px solid rgba(92,196,214,.20);background:rgba(92,196,214,.07);padding:8px 10px;margin:8px 0;line-height:1.36;color:var(--ink);font-size:11.5px}
                #obj-popup .nk136-note.warn{border-color:rgba(224,165,88,.30);background:rgba(224,165,88,.08)}
                #obj-popup .nk136-note .h{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.075em;color:var(--ink-mute);font-weight:820;margin-bottom:4px}
                #obj-popup .nk136-note.warn b{color:var(--amber)}
                #obj-popup .nk136-actions{display:grid!important;grid-template-columns:1fr;gap:7px;margin:10px 0}
                #obj-popup .nk136-btn{display:block;width:100%;border:1px solid rgba(92,196,214,.35);background:rgba(92,196,214,.11);color:var(--teal);border-radius:11px;padding:8px 10px;text-align:left;font-size:12px;font-weight:760;cursor:pointer;line-height:1.24;transition:background .15s ease,border-color .15s ease,transform .15s ease}
                #obj-popup .nk136-btn:hover{transform:translateY(-1px);background:rgba(92,196,214,.16)}
                #obj-popup .nk136-btn.primary{border-color:rgba(217,99,113,.70);background:rgba(217,99,113,.18);color:#ffd7df}
                #obj-popup .nk136-btn.primary:hover{background:rgba(217,99,113,.24)}
                #obj-popup .nk136-btn.done{border-color:rgba(76,184,138,.50);background:rgba(76,184,138,.14);color:var(--green)}
                #obj-popup .nk136-progress{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0 7px}
                #obj-popup .nk136-progress span{font-size:10px;color:var(--ink-mute);font-weight:720;white-space:nowrap}
                #obj-popup .nk136-bar{display:block;height:5px;flex:1;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden}
                #obj-popup .nk136-bar i{display:block;height:100%;background:var(--green);width:0}
                #obj-popup .nk136-substeps{display:grid;gap:4px;margin-top:7px;padding:7px 9px;border-radius:11px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}
                #obj-popup .nk136-substep{font-size:10px;color:var(--ink-mute);display:flex;gap:6px;align-items:flex-start;line-height:1.28}
                #obj-popup .nk136-substep.done{color:var(--green)}
                #obj-popup.nk136-popup-mode .scene-note-card{font-size:11.5px;line-height:1.35;padding:8px 10px;border-radius:11px;margin-top:7px}
                #obj-popup.nk136-popup-mode .scene-note-card .scene-note-title{font-size:10px;letter-spacing:.07em;margin-bottom:4px}
                #obj-popup.nk136-popup-mode .scene-action-btn{font-size:12px;line-height:1.25;padding:8px 10px;border-radius:11px;margin-top:7px}
                .nk136-task-card .nk-step-list{display:grid;gap:4px;margin-top:8px}
                .nk136-task-card .nk-step{font-size:10.5px;color:var(--ink-mute);display:flex;gap:6px;align-items:flex-start}
                .nk136-task-card .nk-step.done{color:var(--green)}
                .nk136-task-card .preop-card-badges{margin-top:6px}
            `;
            document.head.appendChild(st);
        }

        function nk136Normalize(s) { return String(s || '').toLocaleLowerCase('tr-TR'); }
        function nk136TaskDefByKey(key) { return NK136_TASKS[key] || null; }
        function nk136TaskDefForClinicalKey(ck) {
            ck = String(ck || '');
            const pop = NK136_POPUPS[ck];
            return pop ? nk136TaskDefByKey(pop.task) : Object.values(NK136_TASKS).find(d => (d.match || []).includes(ck)) || null;
        }
        function nk136FindTask(def, phaseName = 'preop') {
            const phase = App?.currentPatient?.[phaseName];
            const tasks = phase?.tasks || [];
            if (!def) return null;
            return tasks.find(t => t.cardKey === def.cardKey)
                || tasks.find(t => nk136Normalize(t.label).startsWith(nk136Normalize(def.taskTitle)))
                || tasks.find(t => (def.match || []).some(k => nk136Normalize((t.label || '') + ' ' + (t.keywords || []).join(' ')).includes(nk136Normalize(k))));
        }
        function nk136GetEvidence() {
            if (!App.preopCardEvidence) App.preopCardEvidence = {};
            return App.preopCardEvidence;
        }
        function nk136TaskEvidence(task) {
            const ev = nk136GetEvidence();
            if (!task?.id) return {};
            if (!ev[task.id]) ev[task.id] = {};
            return ev[task.id];
        }
        function nk136TaskProgress(task, def) {
            const total = Math.max(1, (def?.substeps || task?.substeps || []).length || 1);
            const ev = nk136TaskEvidence(task);
            const completed = Array.from({length: total}).filter((_, i) => !!ev[i]).length;
            return { total, completed, pct: Math.round((completed / total) * 100), done: completed >= total, partial: completed > 0 && completed < total, ev };
        }
        function nk136ApplyToPhase(phaseObj) {
            if (!phaseObj || !Array.isArray(phaseObj.tasks)) return;
            Object.values(NK136_TASKS).forEach(def => {
                const t = phaseObj.tasks.find(x => x.cardKey === def.cardKey)
                    || phaseObj.tasks.find(x => nk136Normalize(x.label).startsWith(nk136Normalize(def.taskTitle)))
                    || phaseObj.tasks.find(x => (def.match || []).some(k => nk136Normalize((x.label || '') + ' ' + (x.keywords || []).join(' ')).includes(nk136Normalize(k))));
                if (!t) return;
                t.label = def.taskLabel;
                t.group = def.group;
                t.critical = !!def.critical;
                t.cardKey = def.cardKey;
                t.keywords = Array.from(new Set([...(t.keywords || []), ...def.match, def.taskTitle, def.taskText]));
                t.substeps = def.substeps.slice();
                t.categories = def.categories.slice();
            });
        }
        function nk136ApplyAllTasks() {
            try { if (typeof CASES !== 'undefined') CASES.forEach(c => nk136ApplyToPhase(c?.preop)); } catch(e) {}
            try { if (App?.currentPatient?.preop) nk136ApplyToPhase(App.currentPatient.preop); } catch(e) {}
        }
        nk136ApplyAllTasks();

        const __nk136_completeTask = typeof completeTask === 'function' ? completeTask : null;
        if (__nk136_completeTask && !__nk136_completeTask.__nk136Locked) {
            const wrappedCompleteTask = function(taskId, obj) {
                const task = App?.currentPatient?.[App.currentRoom]?.tasks?.find(t => t.id === taskId);
                if (App?.currentRoom === 'preop' && task) {
                    const def = Object.values(NK136_TASKS).find(d => d.cardKey === task.cardKey || nk136Normalize(task.label).startsWith(nk136Normalize(d.taskTitle)));
                    if (def && !App.__nk136AllowComplete) {
                        const prog = nk136TaskProgress(task, def);
                        if (!prog.done) {
                            try { showSceneReaction?.(`${def.taskTitle}: önce ilgili kart içindeki doğrulama adımlarını tamamlayın (${prog.completed}/${prog.total}).`, 'warn'); } catch(e) {}
                            try { toast?.('warn','Görev kilitli',`${def.taskTitle} kartındaki doğrulama adımları tamamlanmadan görev listesi ilerlemez.`); } catch(e) {}
                            try { renderRightPanel?.(); } catch(e) {}
                            return false;
                        }
                    }
                }
                return __nk136_completeTask.apply(this, arguments);
            };
            wrappedCompleteTask.__nk136Locked = true;
            try { completeTask = wrappedCompleteTask; } catch(e) {}
            try { window.completeTask = wrappedCompleteTask; } catch(e) {}
        }

        function nk136MaybeComplete(task, obj) {
            if (!task || App.completedTasks.includes(task.id)) return;
            const def = Object.values(NK136_TASKS).find(d => d.cardKey === task.cardKey || nk136Normalize(task.label).startsWith(nk136Normalize(d.taskTitle)));
            if (!def) return;
            const prog = nk136TaskProgress(task, def);
            if (!prog.done) return;
            try {
                App.__nk136AllowComplete = true;
                completeTask(task.id, obj);
            } finally {
                App.__nk136AllowComplete = false;
            }
        }

        function nk136RecordStep(task, def, idx, obj) {
            if (!task || idx == null) return;
            const ev = nk136TaskEvidence(task);
            ev[idx] = true;
            nk136MaybeComplete(task, obj);
            try { renderRightPanel?.(); updateProgressBar?.(); updateScoreStrip?.(); gcklBoardSyncMarkerState?.(); } catch(e) {}
        }

        function nk138ScenarioStepIndex(def, scenario) {
            if (!scenario || scenario.required === false) return null;
            return Math.max(0, (def?.substeps || []).length - 1);
        }

        function nk138ScenarioKeyForTask(task, clinicalKey) {
            return `${task?.id || 'preop'}::${clinicalKey || 'scenario'}`;
        }

        function nk138ScenarioSolved(task, clinicalKey) {
            if (!App.preopMicroScenarioEvidence) App.preopMicroScenarioEvidence = {};
            return !!App.preopMicroScenarioEvidence[nk138ScenarioKeyForTask(task, clinicalKey)];
        }

        function nk138SetScenarioSolved(task, clinicalKey) {
            if (!App.preopMicroScenarioEvidence) App.preopMicroScenarioEvidence = {};
            App.preopMicroScenarioEvidence[nk138ScenarioKeyForTask(task, clinicalKey)] = true;
        }

        function nk138OpenMicroScenario(obj, task, def, scenario, refreshPopup) {
            if (!scenario || !task || !def) return;
            nk138InjectStyles();
            const old = document.getElementById('nk138-micro-scenario-modal');
            if (old) old.remove();

            let selected = null;
            const backdrop = document.createElement('div');
            backdrop.id = 'nk138-micro-scenario-modal';
            backdrop.className = 'nk138-modal-backdrop';
            backdrop.innerHTML = `
                <div class="nk138-modal" role="dialog" aria-modal="true">
                    <div class="nk138-head">
                        <div>
                            <div class="nk138-title">Mikro karar · ${scenario.title}</div>
                            <div style="font-size:11px;color:var(--ink-mute);margin-top:4px">${scenario.required === false ? 'Opsiyonel puanlı karar sorusu' : 'Görev ilerlemesi için zorunlu karar sorusu'}</div>
                        </div>
                        <button class="nk138-close" type="button" aria-label="Kapat">×</button>
                    </div>
                    <div class="nk138-card"><b>Senaryo:</b><br>${scenario.scenarioText}</div>
                    <div class="nk138-card"><b>Soru:</b><br>${scenario.questionText}</div>
                    <div class="nk138-options">
                        ${(scenario.options || []).map((o,i) => `<button type="button" class="nk138-option" data-index="${i}"><b>${String.fromCharCode(65+i)})</b><span>${o}</span></button>`).join('')}
                    </div>
                    <div class="nk138-feedback" aria-live="polite"></div>
                    <div class="nk138-actions">
                        <button type="button" class="nk138-secondary">Kapat</button>
                        <button type="button" class="nk138-submit" disabled>Yanıtı değerlendir</button>
                    </div>
                </div>
            `;
            document.body.appendChild(backdrop);

            const close = () => { backdrop.remove(); try { refreshPopup?.(); } catch(e) {} };
            backdrop.querySelector('.nk138-close').onclick = close;
            backdrop.querySelector('.nk138-secondary').onclick = close;
            backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) close(); });

            const submit = backdrop.querySelector('.nk138-submit');
            const feedback = backdrop.querySelector('.nk138-feedback');
            backdrop.querySelectorAll('.nk138-option').forEach(btn => {
                btn.onclick = () => {
                    selected = Number(btn.dataset.index);
                    backdrop.querySelectorAll('.nk138-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    submit.disabled = false;
                };
            });

            submit.onclick = () => {
                if (selected == null) return;
                const ok = selected === scenario.correctOptionIndex;
                feedback.className = 'nk138-feedback ' + (ok ? 'ok' : 'bad');
                feedback.textContent = ok ? scenario.correctFeedback : scenario.wrongFeedback;
                if (ok) {
                    nk138SetScenarioSolved(task, obj?.opts?.clinicalKey || scenario.task);
                    const stepIdx = nk138ScenarioStepIndex(def, scenario);
                    if (stepIdx != null) nk136RecordStep(task, def, stepIdx, obj);
                    try { addScore?.(scenario.scoreCategories || def.categories || [], 4, 0); addPhaseScore?.('preop', 4, 0); } catch(e) {}
                    try { showSceneReaction?.(`${scenario.title}: doğru karar kaydedildi.`, 'ok'); } catch(e) {}
                    submit.disabled = true;
                    setTimeout(close, 900);
                } else {
                    try { addScore?.(scenario.scoreCategories || def.categories || [], -2, 0); addPhaseScore?.('preop', -2, 0); updateScoreStrip?.(); } catch(e) {}
                    try { showSceneReaction?.(`${scenario.title}: kararınızı tekrar değerlendirin.`, 'warn'); } catch(e) {}
                }
            };
        }

        function nk136PopupHtml(pop, task, def) {
            const prog = nk136TaskProgress(task, def);
            const steps = (def.substeps || []).map((s,i) => `<div class="nk136-substep ${prog.ev[i] ? 'done' : ''}"><span>${prog.ev[i] ? '✓' : '○'}</span><span>${s}</span></div>`).join('');
            return `
                <span class="oclose">×</span>
                <div class="nk136-card">
                    <div class="nk136-title">${pop.title}</div>
                    <div class="nk136-desc">${pop.desc}</div>
                    <div class="nk136-chips">${(pop.chips || []).map(c => `<span class="nk136-chip">${c}</span>`).join('')}<span class="nk136-chip">${prog.done ? 'Tamamlandı' : (prog.partial ? 'Kısmi' : 'Bekliyor')}</span></div>
                    <div class="nk136-progress"><div class="nk136-bar"><i style="width:${prog.pct}%"></i></div><span>${prog.completed}/${prog.total} adım</span></div>
                    <div class="nk136-note"><div class="h">Rol / görev sorumluluğu</div>${pop.role}</div>
                    <div class="nk136-note"><div class="h">Bağlı öğrenme görevi</div>${def.taskLabel}</div>
                    <div class="nk136-note warn"><div class="h">Kritik hata</div><b>Dikkat:</b> ${pop.warning}</div>
                    <div class="nk136-actions"></div>
                    <div class="nk136-substeps">${steps}</div>
                </div>
            `;
        }

        const __nk136_showObjPopup = typeof showObjPopup === 'function' ? showObjPopup : null;
        if (__nk136_showObjPopup && !__nk136_showObjPopup.__nk136Popup) {
            const wrappedShowObjPopup = function(obj, x, y) {
                const ck = String(obj?.opts?.clinicalKey || '');
                const pop = NK136_POPUPS[ck];
                if (!pop || App?.currentRoom !== 'preop') {
                    try { document.getElementById('obj-popup')?.classList.remove('nk136-popup-mode'); } catch(e) {}
                    return __nk136_showObjPopup.apply(this, arguments);
                }

                const r = __nk136_showObjPopup.apply(this, arguments);
                try {
                    nk136InjectStyles();
                    nk136ApplyAllTasks();
                    const def = nk136TaskDefByKey(pop.task);
                    const task = nk136FindTask(def, 'preop') || (obj?.opts?.taskId ? (App.currentPatient?.preop?.tasks || []).find(t => t.id === obj.opts.taskId) : null);
                    const p = document.getElementById('obj-popup');
                    if (!p || !task || !def) return r;
                    p.classList.add('nk136-popup-mode');
                    p.innerHTML = nk136PopupHtml(pop, task, def);
                    const close = p.querySelector('.oclose');
                    if (close) close.onclick = () => p.classList.remove('visible');
                    const actionBox = p.querySelector('.nk136-actions');
                    const prog = nk136TaskProgress(task, def);
                    (pop.buttons || []).forEach((label, i) => {
                        const stepIdx = (pop.stepMap || [])[i] ?? i;
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'nk136-btn ' + (i === 0 ? 'primary ' : '') + (prog.ev[stepIdx] ? 'done' : '');
                        btn.textContent = (prog.ev[stepIdx] ? '✓ ' : '') + label;
                        btn.onclick = (ev) => {
                            ev.preventDefault(); ev.stopPropagation();
                            nk136RecordStep(task, def, stepIdx, obj);
                            try { showSceneReaction?.(`${pop.title}: ${label} kaydedildi.`, 'ok'); } catch(e) {}
                            wrappedShowObjPopup(obj, x, y);
                        };
                        actionBox.appendChild(btn);
                    });

                    const microScenario = NK138_SCENARIOS[ck];
                    if (microScenario) {
                        const mbtn = document.createElement('button');
                        mbtn.type = 'button';
                        const microStep = nk138ScenarioStepIndex(def, microScenario);
                        const microDone = microScenario.required === false ? nk138ScenarioSolved(task, ck) : !!nk136TaskEvidence(task)[microStep];
                        mbtn.className = 'nk136-btn ' + (microDone ? 'done' : '');
                        mbtn.textContent = (microDone ? '✓ ' : '🎭 ') + 'Mikro senaryo + karar sorusu';
                        mbtn.onclick = (ev) => {
                            ev.preventDefault(); ev.stopPropagation();
                            nk138OpenMicroScenario(obj, task, def, microScenario, () => wrappedShowObjPopup(obj, x, y));
                        };
                        actionBox.appendChild(mbtn);
                    }
                    if (App?.aiMode && typeof callGeminiAPI === 'function') {
                        const aiBtn = document.createElement('button');
                        const aiRes = document.createElement('div');
                        aiBtn.type = 'button'; aiBtn.className = 'nk136-btn'; aiBtn.textContent = '✨ Hastaya özel klinik ipucu al';
                        aiRes.style.fontSize = '11px'; aiRes.style.marginTop = '8px'; aiRes.style.color = 'var(--violet)';
                        aiBtn.onclick = async () => {
                            aiBtn.textContent = '✨ Analiz ediliyor...'; aiBtn.disabled = true;
                            const pat = App.currentPatient;
                            const prompt = `Hasta: ${pat.name} (${pat.surgery}). Faz: ${App.currentRoom}. Klinik kart: ${pop.title}. Bu kart için cerrahi güvenlik açısından 1-2 kısa klinik ipucu yaz.`;
                            const res = await callGeminiAPI(prompt);
                            aiRes.innerHTML = `<b>✨ İpucu:</b> ${res}`; aiBtn.style.display = 'none';
                        };
                        actionBox.appendChild(aiBtn); p.querySelector('.nk136-card')?.appendChild(aiRes);
                    }
                } catch(e) { console.warn('v5.136 preop kart popup düzenlenemedi', e); }
                return r;
            };
            wrappedShowObjPopup.__nk136Popup = true;
            try { showObjPopup = wrappedShowObjPopup; } catch(e) {}
            try { window.showObjPopup = wrappedShowObjPopup; } catch(e) {}
        }

        const __nk136_getCurrentGcklBoardGroups = typeof getCurrentGcklBoardGroups === 'function' ? getCurrentGcklBoardGroups : null;
        if (__nk136_getCurrentGcklBoardGroups && !__nk136_getCurrentGcklBoardGroups.__nk136Gckl) {
            const gcklWrapped = function(phaseName = App.currentRoom) {
                if (phaseName === 'preop') {
                    return Object.entries(NK136_TASKS)
                        .filter(([_,d]) => d.gckl)
                        .map(([key,d]) => ({
                            key:'preop-gckl-' + key,
                            title:d.taskTitle,
                            short:d.taskTitle,
                            taskKeywords:[d.taskLabel, d.taskTitle, d.cardKey, ...(d.match || [])],
                            fullText:d.taskText
                        }));
                }
                return __nk136_getCurrentGcklBoardGroups.apply(this, arguments);
            };
            gcklWrapped.__nk136Gckl = true;
            try { getCurrentGcklBoardGroups = gcklWrapped; } catch(e) {}
            try { window.getCurrentGcklBoardGroups = gcklWrapped; } catch(e) {}
        }

        function nk136TaskCard(t) {
            const def = Object.values(NK136_TASKS).find(d => d.cardKey === t.cardKey || nk136Normalize(t.label).startsWith(nk136Normalize(d.taskTitle)));
            if (!def) return null;
            const done = App.completedTasks.includes(t.id);
            const prog = nk136TaskProgress(t, def);
            const isCare = def.group === NK136_CARE;
            const item = document.createElement('div');
            item.className = 'preop-task-card nk136-task-card ' + (done ? 'done' : (isCare ? 'support-pending' : 'critical-pending'));
            const stateMark = done ? '✓' : (prog.partial ? '•' : '!');
            const statusLabel = done ? 'Tamamlandı' : (prog.partial ? 'Kısmi' : 'Bekliyor');
            const checkClass = done ? 'state-done' : (prog.partial ? 'state-pending' : (def.critical ? 'state-critical' : 'state-pending'));
            const stepList = (def.substeps || []).map((s,i) => `<div class="nk-step ${prog.ev[i] ? 'done' : ''}"><span>${prog.ev[i] ? '✓' : '○'}</span><span>${s}</span></div>`).join('');
            item.innerHTML = `
                <div class="check ${checkClass}" title="${statusLabel}">${stateMark}</div>
                <div class="task-main">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                        <div>
                            <div class="preop-card-name">${def.taskTitle}</div>
                            <div class="preop-card-task">${def.taskText}</div>
                        </div>
                        <span class="preop-pill ${done ? 'done' : (prog.partial ? 'partial' : 'wait')}">${statusLabel}</span>
                    </div>
                    <div class="preop-card-badges">
                        <span class="preop-pill ${isCare ? 'care' : 'crit'}">${isCare ? 'Bakım / risk' : 'Güvenlik'}</span>
                        <span class="preop-pill">${prog.completed}/${prog.total} adım</span>
                    </div>
                    <div class="preop-substeps"><span class="preop-substep-dot"><i style="width:${prog.pct}%"></i></span></div>
                    <div class="nk-step-list">${stepList}</div>
                </div>
            `;
            item.onclick = () => {
                try { showSceneReaction?.(`${def.taskTitle}: ilgili sahne kartını açıp doğrulama adımlarını tamamlayın.`, 'info'); } catch(e) {}
            };
            return item;
        }

        function nk136RenderPreopTaskPanel() {
            if (!window.App || App.currentRoom !== 'preop' || !App.currentPatient?.preop) return;
            nk136ApplyAllTasks();
            nk136InjectStyles();
            const list = document.getElementById('task-list');
            if (!list) return;
            const phase = App.currentPatient.preop;
            const roleCard = list.querySelector('.phase-role-card')?.cloneNode(true);
            list.innerHTML = '';
            if (roleCard) list.appendChild(roleCard);

            [NK136_SAFETY, NK136_CARE].forEach(groupName => {
                const tasks = (phase.tasks || []).filter(t => (t.group || (t.critical ? NK136_SAFETY : NK136_CARE)) === groupName);
                if (!tasks.length) return;
                const doneCount = tasks.filter(t => App.completedTasks.includes(t.id)).length;
                const section = document.createElement('div');
                section.className = 'preop-task-section ' + (groupName === NK136_SAFETY ? 'safety' : 'care');
                const head = document.createElement('div');
                head.className = 'preop-task-section-head';
                head.innerHTML = `<div class="preop-task-section-title">${groupName}</div><div class="preop-task-section-count">${doneCount}/${tasks.length}</div>`;
                section.appendChild(head);
                tasks.forEach(t => section.appendChild(nk136TaskCard(t) || document.createTextNode('')));
                list.appendChild(section);
            });
        }

        const __nk136_renderRightPanel = window.renderRightPanel || (typeof renderRightPanel === 'function' ? renderRightPanel : null);
        if (typeof __nk136_renderRightPanel === 'function' && !__nk136_renderRightPanel.__nk136Panel) {
            const wrappedRender = function() {
                const r = __nk136_renderRightPanel.apply(this, arguments);
                try { nk136RenderPreopTaskPanel(); } catch(e) { console.warn('v5.136 preop görev paneli düzenlenemedi', e); }
                return r;
            };
            wrappedRender.__nk136Panel = true;
            try { renderRightPanel = wrappedRender; } catch(e) {}
            try { window.renderRightPanel = wrappedRender; } catch(e) {}
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                try { nk136ApplyAllTasks(); nk136RenderPreopTaskPanel(); gcklBoardSyncMarkerState?.(); } catch(e) {}
            }, 350);
        });
    } catch(err) {
        console.warn('v5.136 patch uygulanamadı', err);
    }
})();



/* v5.139 — GCKL-01 kritik doğrulamaları Preop hemşiresine bağlandı
   Kullanıcı isteği: En az iki tanımlayıcı, ameliyat bölgesi doğrulama ve hastaya taraf/bölge sorma
   görevleri Preop hemşiresi üzerinden doğrulanabilir ve tamamlanabilir olmalı. */
(() => {
    try {
        const NK139_GCKL01_TASKS = [
            ['gckl_1_identity_check', 'En az iki tanımlayıcı ile kimlik doğrula'],
            ['gckl_1_consent_check', 'Ameliyat adını dosyayla eşleştir'],
            ['gckl_1_site_check', 'Hastaya ameliyat bölgesi/tarafını sor']
        ];

        function nk139PushTaskDef(itemId, taskId, label) {
            if (!window.GCKL_TASK_DEFS && typeof GCKL_TASK_DEFS === 'undefined') return;
            const defs = GCKL_TASK_DEFS;
            if (!defs[itemId]) defs[itemId] = [];
            if (!defs[itemId].some(x => x[0] === taskId)) defs[itemId].push([taskId, label]);
        }

        function nk139EnsureTaskRules() {
            if (typeof TASK_RULE_ENGINE === 'undefined') return;
            TASK_RULE_ENGINE.tasks = TASK_RULE_ENGINE.tasks || {};
            NK139_GCKL01_TASKS.forEach(([taskId]) => {
                TASK_RULE_ENGINE.tasks[taskId] = {
                    ...(TASK_RULE_ENGINE.tasks[taskId] || {}),
                    phase: 'preop',
                    freeComplete: true,
                    requiresPatientTalk: false,
                    blocksPhaseAdvance: true,
                    talkKey: 'identitySite',
                    role: 'Preop hemşiresi',
                    guidelineTag: 'WHO SSC'
                };
            });

            TASK_RULE_ENGINE.objectTalkRules = TASK_RULE_ENGINE.objectTalkRules || {};
            TASK_RULE_ENGINE.objectTalkRules.preop = TASK_RULE_ENGINE.objectTalkRules.preop || {};
            TASK_RULE_ENGINE.objectTalkRules.preop.identitySite = TASK_RULE_ENGINE.objectTalkRules.preop.identitySite || {};
            const r = TASK_RULE_ENGINE.objectTalkRules.preop.identitySite;
            r.freeCompleteForTasks = Array.from(new Set([...(r.freeCompleteForTasks || []), ...NK139_GCKL01_TASKS.map(x => x[0])]));
            r.freeCompleteForCards = Array.from(new Set([...(r.freeCompleteForCards || []), 'identity-consent-site', 'preop-site-marker']));

            // Görev etiketinden yakalama: doğrudan id bulunamazsa da GCKL-01 görevleri Preop hemşiresi rolüne düşsün.
            TASK_RULE_ENGINE.labelRules = TASK_RULE_ENGINE.labelRules || [];
            const exists = TASK_RULE_ENGINE.labelRules.some(rule => String(rule?.match || '') === String(/^GCKL-01\s*·\s*(En az iki tanımlayıcı|Ameliyat bölgesini|Hastaya ameliyat bölgesi\/tarafını)/i));
            if (!exists) {
                TASK_RULE_ENGINE.labelRules.push({
                    phase: 'preop',
                    match: /^GCKL-01\s*·\s*(En az iki tanımlayıcı|Ameliyat bölgesini|Hastaya ameliyat bölgesi\/tarafını)/i,
                    config: {
                        freeComplete: true,
                        requiresPatientTalk: false,
                        blocksPhaseAdvance: true,
                        talkKey: 'identitySite',
                        role: 'Preop hemşiresi',
                        guidelineTag: 'WHO SSC'
                    }
                });
            }
        }

        function nk139EnsureObjectMapping() {
            if (typeof CRITICAL_OBJECT_TO_KEY !== 'undefined') {
                CRITICAL_OBJECT_TO_KEY['preop-nurse-3d'] = 'identitySite';
            }
        }

        function nk139EnsureGCKL01Tasks(patient) {
            if (!patient || !patient.preop) return;
            patient.preop.tasks = patient.preop.tasks || [];
            NK139_GCKL01_TASKS.forEach(([taskId, label], idx) => {
                nk139PushTaskDef('GCKL-1', taskId, label);
                let t = patient.preop.tasks.find(x => x.id === taskId);
                if (!t) {
                    if (typeof gcklMakeTask === 'function') t = gcklMakeTask('GCKL-1', [taskId, label], idx);
                    else {
                        t = {
                            id: taskId,
                            label: 'GCKL-01 · ' + label,
                            critical: true,
                            score: 4,
                            categories: ['patientSafety','checklistPerformance','surgicalNursingKnowledge'],
                            guideline: 'who_ssc',
                            gcklItem: 'GCKL-1',
                            gcklTaskIndex: idx
                        };
                    }
                    patient.preop.tasks.push(t);
                }
                t.label = 'GCKL-01 · ' + label;
                t.critical = true;
                t.guideline = 'who_ssc';
                t.gcklItem = 'GCKL-1';
                t.role = 'Preop hemşiresi';
                t.requiresPatientTalk = false;
                t.freeComplete = true;
            });
        }

        function nk139TaskById(taskId) {
            return App?.currentPatient?.preop?.tasks?.find(t => t.id === taskId) || null;
        }

        function nk139CompleteTask(taskId, sourceObj) {
            const t = nk139TaskById(taskId);
            if (!t || App.completedTasks?.includes(taskId)) return false;
            try {
                App.__nk136AllowComplete = true;
                completeTask(taskId, sourceObj || { label:'Preop Hemşiresi 3D', opts:{ clinicalKey:'preop-nurse-3d' } });
            } finally {
                App.__nk136AllowComplete = false;
            }
            return true;
        }

        function nk139CompleteNurseVerification(sourceObj = null, selectedOnly = null) {
            if (!App || App.currentRoom !== 'preop') return;
            nk139EnsureTaskRules();
            nk139EnsureObjectMapping();
            nk139EnsureGCKL01Tasks(App.currentPatient);

            try {
                const bucket = getCommunicationBucket?.('preop');
                if (bucket) bucket.identitySite = true;
            } catch(e) {}

            const list = selectedOnly ? NK139_GCKL01_TASKS.filter(x => x[0] === selectedOnly) : NK139_GCKL01_TASKS;
            list.forEach(([taskId]) => nk139CompleteTask(taskId, sourceObj));

            try { gcklBoardSyncMarkerState?.(); } catch(e) {}
            try { syncGCKLPatientSafetyScore?.(); } catch(e) {}
            try { renderRightPanel?.(); } catch(e) {}
            try { updateProgressBar?.(); } catch(e) {}
            try { updateScoreStrip?.(); } catch(e) {}
        }

        // Hasta diyaloğu üzerinden doğrulama yapıldığında da üç GCKL-01 alt görevi kapanır.
        if (typeof markCriticalCommunication === 'function' && !markCriticalCommunication.__nk139Gckl01) {
            const prevMarkCriticalCommunication = markCriticalCommunication;
            const wrappedMarkCriticalCommunication = function(key, source = '') {
                const r = prevMarkCriticalCommunication.apply(this, arguments);
                try {
                    if (key === 'identitySite' && App?.currentRoom === 'preop') {
                        nk139CompleteNurseVerification({ label: source || 'Preop hemşiresi doğrulaması', opts:{ clinicalKey:'preop-nurse-3d' } });
                    }
                } catch(e) { console.warn('v5.139 GCKL-01 iletişim bağlama hatası', e); }
                return r;
            };
            wrappedMarkCriticalCommunication.__nk139Gckl01 = true;
            try { markCriticalCommunication = wrappedMarkCriticalCommunication; } catch(e) {}
            try { window.markCriticalCommunication = wrappedMarkCriticalCommunication; } catch(e) {}
        }

        function nk139RenderNursePopup(obj, x, y, originalResult) {
            const p = document.getElementById('obj-popup');
            if (!p) return originalResult;
            nk139EnsureGCKL01Tasks(App.currentPatient);
            const rows = NK139_GCKL01_TASKS.map(([taskId, label]) => {
                const done = App.completedTasks?.includes(taskId);
                return `<button type="button" class="scene-action-btn ${done ? 'done' : 'critical-talk'}" data-nk139-task="${taskId}">${done ? '✓ ' : ''}${label}</button>`;
            }).join('');
            const doneCount = NK139_GCKL01_TASKS.filter(([id]) => App.completedTasks?.includes(id)).length;
            p.classList.remove('nk136-popup-mode');
            p.innerHTML = `
                <span class="oclose">×</span>
                <div class="otitle-row">
                    <div class="otitle">Preop Hemşiresi · GCKL-01 Doğrulama</div>
                    <span class="scene-risk-chip danger">Kritik</span>
                    <span class="scene-risk-chip ok">WHO SSC</span>
                    <span class="scene-risk-chip">${doneCount}/3 tamamlandı</span>
                </div>
                <div>Bu doğrulamalar sahnedeki Preop hemşiresi tarafından hasta/hasta yakını ve dosya ile çapraz kontrol edilerek tamamlanır.</div>
                <div class="scene-note-card role-note" style="margin-top:8px">
                    <div class="scene-note-title">Rol / görev sorumluluğu</div>
                    Preop hemşiresi; en az iki tanımlayıcı ile kimlik doğrulama, ameliyat bölgesi/taraf bilgisini hastaya sorma ve dosya/onam/cerrahi planla eşleştirme görevlerini yürütür.
                </div>
                <div class="scene-action-row" style="margin-top:10px;display:grid;gap:8px">
                    ${rows}
                    <button type="button" class="scene-action-btn primary" id="nk139-complete-all">GCKL-01 doğrulama zincirini hemşire ile tamamla</button>
                </div>
            `;
            const close = p.querySelector('.oclose');
            if (close) close.onclick = () => p.classList.remove('visible');
            p.querySelectorAll('[data-nk139-task]').forEach(btn => {
                btn.onclick = (ev) => {
                    ev.preventDefault(); ev.stopPropagation();
                    const taskId = btn.getAttribute('data-nk139-task');
                    nk139CompleteNurseVerification(obj, taskId);
                    try { showSceneReaction?.(`Preop hemşiresi: ${btn.textContent.replace(/^✓\s*/, '')} doğrulandı.`, 'ok'); } catch(e) {}
                    nk139RenderNursePopup(obj, x, y, originalResult);
                };
            });
            const allBtn = p.querySelector('#nk139-complete-all');
            if (allBtn) allBtn.onclick = (ev) => {
                ev.preventDefault(); ev.stopPropagation();
                nk139CompleteNurseVerification(obj, null);
                try { showSceneReaction?.('Preop hemşiresi GCKL-01 kimlik ve taraf/bölge doğrulama zincirini tamamladı.', 'ok'); } catch(e) {}
                nk139RenderNursePopup(obj, x, y, originalResult);
            };
            return originalResult;
        }

        if (typeof showObjPopup === 'function' && !showObjPopup.__nk139Gckl01NursePopup) {
            const prevShowObjPopup = showObjPopup;
            const wrappedShowObjPopup = function(obj, x, y) {
                const r = prevShowObjPopup.apply(this, arguments);
                try {
                    const ck = String(obj?.opts?.clinicalKey || '');
                    const label = String(obj?.label || '').toLocaleLowerCase('tr-TR');
                    if (App?.currentRoom === 'preop' && (ck === 'preop-nurse-3d' || label.includes('preop hemşiresi'))) {
                        return nk139RenderNursePopup(obj, x, y, r);
                    }
                } catch(e) { console.warn('v5.139 Preop hemşiresi popup hatası', e); }
                return r;
            };
            wrappedShowObjPopup.__nk139Gckl01NursePopup = true;
            try { showObjPopup = wrappedShowObjPopup; } catch(e) {}
            try { window.showObjPopup = wrappedShowObjPopup; } catch(e) {}
        }

        nk139PushTaskDef('GCKL-1', 'gckl_1_identity_check', 'En az iki tanımlayıcı ile kimlik doğrula');
        nk139PushTaskDef('GCKL-1', 'gckl_1_consent_check', 'Ameliyat adını dosyayla eşleştir');
        nk139PushTaskDef('GCKL-1', 'gckl_1_site_check', 'Hastaya ameliyat bölgesi/tarafını sor');
        nk139EnsureTaskRules();
        nk139EnsureObjectMapping();
        try { if (App?.currentPatient) nk139EnsureGCKL01Tasks(App.currentPatient); } catch(e) {}
        window.addEventListener('load', () => setTimeout(() => {
            try {
                nk139EnsureTaskRules();
                nk139EnsureObjectMapping();
                nk139EnsureGCKL01Tasks(App?.currentPatient);
                renderRightPanel?.();
                gcklBoardSyncMarkerState?.();
            } catch(e) {}
        }, 420));
    } catch(err) {
        console.warn('v5.139 GCKL-01 Preop hemşiresi bağlama patch uygulanamadı', err);
    }
})();



/* v5.140 — GCKL-01 hemşire doğrulamasında Onam/Taraf marker ve kart kanıt senkronu
   Sorun: Preop hemşiresi üzerinden GCKL-01 alt görevleri tamamlansa bile eski
   Kimlik / Onam / Taraf kartının onam kanıtı ve consent-site marker'ı kırmızı kalabiliyordu. */
(() => {
    try {
        const NK140_GCKL01_IDS = ['gckl_1_identity_check', 'gckl_1_consent_check', 'gckl_1_site_check', 'gckl_1_identity_verify'];

        function nk140Norm(s) { return String(s || '').toLocaleLowerCase('tr-TR'); }

        function nk140FindVerifyTask() {
            const tasks = App?.currentPatient?.preop?.tasks || [];
            return tasks.find(t => t.cardKey === 'identity-consent-site')
                || tasks.find(t => t.id === 't_id')
                || tasks.find(t => /kimlik\s*\/\s*onam\s*\/\s*taraf/i.test(t.label || ''))
                || tasks.find(t => {
                    const txt = nk140Norm([t.label, t.id, t.cardKey, (t.keywords || []).join(' '), (t.substeps || []).join(' ')].filter(Boolean).join(' '));
                    return txt.includes('cerrahi onamı kontrol et') ||
                           txt.includes('kimlik, cerrahi onam') ||
                           txt.includes('cerrahi doğrulamayı tamamla');
                });
        }

        function nk140EvidenceFor(task) {
            if (!task?.id || !window.App) return null;
            App.preopCardEvidence = App.preopCardEvidence || {};
            App.preopCardEvidence[task.id] = App.preopCardEvidence[task.id] || {};
            return App.preopCardEvidence[task.id];
        }

        function nk140MarkMarkers(which = 'all') {
            const keys = which === 'identity'
                ? ['identity']
                : which === 'site'
                    ? ['preop-site-marker']
                    : which === 'consent'
                        ? ['consent-site', 'consent']
                        : ['identity', 'consent-site', 'consent', 'preop-site-marker', 'identitySite'];
            keys.forEach(k => {
                try { setMarkerKeyDone?.(k, true); } catch(e) {}
                try { completeMarkerBySourceKey?.(k, true); } catch(e) {}
            });
        }

        function nk140SyncOnamFromGckl01(taskId = null, sourceObj = null) {
            if (!window.App || App.currentRoom !== 'preop') return;
            const completed = id => App.completedTasks?.includes(id);
            // Yeni 3 substep ID'si — her biri ev'in farklı bir indeksini doldurur
            const idCheckDone   = completed('gckl_1_identity_check') || taskId === 'gckl_1_identity_check';
            const consentDone   = completed('gckl_1_consent_check')  || taskId === 'gckl_1_consent_check';
            const siteCheckDone = completed('gckl_1_site_check')     || taskId === 'gckl_1_site_check';
            // Eski birleşik alias (geriye dönük uyumluluk için)
            const verifyAliasDone = completed('gckl_1_identity_verify') || taskId === 'gckl_1_identity_verify';

            if (!(idCheckDone || consentDone || siteCheckDone || verifyAliasDone)) return;

            const verifyTask = nk140FindVerifyTask();
            const ev = nk140EvidenceFor(verifyTask);

            // GCKL-1 üç bağımsız substep:
            //   ev[0] Kimlik       ← gckl_1_identity_check
            //   ev[1] Onam/işlem   ← gckl_1_consent_check
            //   ev[2] Taraf/Bölge  ← gckl_1_site_check
            // ev[3] mikro karar sorusudur ve bağımsız öğrenme adımı olarak kalır.
            if (ev) {
                if (idCheckDone)   ev[0] = true;
                if (consentDone)   ev[1] = true;
                if (siteCheckDone) ev[2] = true;
                // Eski alias varsa (örn. eski kod yolu), tüm üçü de tamamlanmış sayılır
                if (verifyAliasDone) { ev[0] = true; ev[1] = true; ev[2] = true; }
            }

            // Marker'lar substep bazlı set edilir — sadece ilgili substep tamamlandıysa
            const markerTargets = [];
            if (idCheckDone   || verifyAliasDone) markerTargets.push('identity');
            if (consentDone   || verifyAliasDone) markerTargets.push('consent-site', 'consent');
            if (siteCheckDone || verifyAliasDone) markerTargets.push('preop-site-marker');
            markerTargets.forEach(k => {
                try { setMarkerKeyDone?.(k, true); } catch(e) {}
                try { completeMarkerBySourceKey?.(k, true); } catch(e) {}
            });

            try {
                if (typeof MARKER_COMPLETION_ALIASES !== 'undefined') {
                    MARKER_COMPLETION_ALIASES.identitySite = Array.from(new Set([...(MARKER_COMPLETION_ALIASES.identitySite || []), 'identity', 'consent-site', 'consent', 'preop-site-marker']));
                    MARKER_COMPLETION_ALIASES['preop-nurse-3d'] = Array.from(new Set([...(MARKER_COMPLETION_ALIASES['preop-nurse-3d'] || []), 'identity', 'consent-site', 'consent', 'preop-site-marker']));
                }
            } catch(e) {}

            try { gcklBoardSyncMarkerState?.(); } catch(e) {}
            try { renderRightPanel?.(); } catch(e) {}
            try { updateProgressBar?.(); } catch(e) {}
            try { updateScoreStrip?.(); } catch(e) {}
            try {
                const p = document.getElementById('obj-popup');
                const po = App.__currentObjPopupObj;
                if (p?.classList?.contains('visible') && po) showObjPopup?.(po);
            } catch(e) {}
        }

        if (typeof completeTask === 'function' && !completeTask.__nk140OnamSync) {
            const prevCompleteTask = completeTask;
            const wrappedCompleteTask = function(taskId, sourceObj = null) {
                const r = prevCompleteTask.apply(this, arguments);
                try {
                    if (NK140_GCKL01_IDS.includes(taskId)) nk140SyncOnamFromGckl01(taskId, sourceObj);
                } catch(e) { console.warn('v5.140 Onam senkron hatası', e); }
                return r;
            };
            wrappedCompleteTask.__nk140OnamSync = true;
            try { completeTask = wrappedCompleteTask; } catch(e) {}
            try { window.completeTask = wrappedCompleteTask; } catch(e) {}
        }

        window.nk140SyncOnamFromGckl01 = nk140SyncOnamFromGckl01;
        window.addEventListener('load', () => setTimeout(() => {
            try { nk140SyncOnamFromGckl01(null, { label:'Preop hemşiresi doğrulaması', opts:{ clinicalKey:'preop-nurse-3d' } }); } catch(e) {}
        }, 650));
    } catch(err) {
        console.warn('v5.140 Onam/GCKL-01 marker senkron patch uygulanamadı', err);
    }
})();



/* v5.141 — Onam/Kimlik/Taraf marker otomatik senkronu
   Sorun: Onam / Dosya Paneli içinde adımlar 4/4 tamamlandığı halde sahnedeki "Onam!" etiketi
   bazen ancak sağ görev listesine tıklanınca yeşile dönüyordu. Bu patch kanıt adımı yazıldığı anda
   ilgili marker store + görsel etiketleri doğrudan günceller ve görevi görev listesine bağlı tutar. */
(() => {
    try {
        const NK141_GCKL01_IDS = ['gckl_1_identity_check', 'gckl_1_consent_check', 'gckl_1_site_check', 'gckl_1_identity_verify'];
        const NK141_VERIFY_MARKERS = ['identity', 'consent-site', 'consent', 'preop-site-marker'];

        function nk141Norm(s) { return String(s || '').toLocaleLowerCase('tr-TR'); }

        function nk141FindVerifyTask() {
            const tasks = App?.currentPatient?.preop?.tasks || [];
            return tasks.find(t => t.cardKey === 'identity-consent-site')
                || tasks.find(t => t.id === 't_id')
                || tasks.find(t => /kimlik\s*\/\s*onam\s*\/\s*taraf/i.test(t.label || ''))
                || tasks.find(t => {
                    const txt = nk141Norm([t.label, t.id, t.cardKey, (t.keywords || []).join(' '), (t.substeps || []).join(' ')].filter(Boolean).join(' '));
                    return txt.includes('cerrahi doğrulamayı tamamla') || txt.includes('cerrahi onamı kontrol et');
                });
        }

        function nk141Evidence(task) {
            if (!task?.id || !window.App) return null;
            App.preopCardEvidence = App.preopCardEvidence || {};
            App.preopCardEvidence[task.id] = App.preopCardEvidence[task.id] || {};
            return App.preopCardEvidence[task.id];
        }

        function nk141Completed(id) {
            return !!App?.completedTasks?.includes(id);
        }

        function nk141EnsureAliases() {
            try {
                if (typeof MARKER_COMPLETION_ALIASES !== 'undefined') {
                    MARKER_COMPLETION_ALIASES.identitySite = Array.from(new Set([...(MARKER_COMPLETION_ALIASES.identitySite || []), ...NK141_VERIFY_MARKERS]));
                    MARKER_COMPLETION_ALIASES['preop-nurse-3d'] = Array.from(new Set([...(MARKER_COMPLETION_ALIASES['preop-nurse-3d'] || []), ...NK141_VERIFY_MARKERS]));
                    MARKER_COMPLETION_ALIASES['identity-consent-site'] = Array.from(new Set([...(MARKER_COMPLETION_ALIASES['identity-consent-site'] || []), ...NK141_VERIFY_MARKERS]));
                    MARKER_COMPLETION_ALIASES['consent-site'] = Array.from(new Set([...(MARKER_COMPLETION_ALIASES['consent-site'] || []), 'consent']));
                }
            } catch(e) {}
        }

        function nk141MarkKeys(keys) {
            const unique = Array.from(new Set((keys || []).filter(Boolean)));
            if (!unique.length) return;
            try { nk141EnsureAliases(); } catch(e) {}
            unique.forEach(k => {
                try { setMarkerKeyDone?.(k, true); } catch(e) {}
                try { completeMarkerBySourceKey?.(k, false); } catch(e) {}
            });
            try {
                if (window.three && Array.isArray(three.markers)) {
                    three.markers.forEach(m => {
                        const mk = m?.group?.userData?.markerClinicalKey || m?.clinicalKey || null;
                        if (mk && unique.includes(mk)) {
                            m.visualDone = true;
                            m.pulseActive = false;
                            if (m.group) m.group.visible = true;
                        }
                    });
                }
            } catch(e) {}
            try { updateMarkerColors?.(); } catch(e) {}
            try { applyMarkerVisibility?.(); } catch(e) {}
        }

        function nk141SyncEvidenceFromGckl(ev) {
            if (!ev) return;
            // GCKL-1 üç bağımsız substep — her biri ev'in farklı bir indeksini doldurur
            if (nk141Completed('gckl_1_identity_check')) ev[0] = true;
            if (nk141Completed('gckl_1_consent_check'))  ev[1] = true;
            if (nk141Completed('gckl_1_site_check'))     ev[2] = true;
            // Eski birleşik alias (geriye dönük uyumluluk)
            if (nk141Completed('gckl_1_identity_verify')) {
                ev[0] = true; ev[1] = true; ev[2] = true;
            }
        }

        function nk141VerifyEvidenceDone(task, ev) {
            const total = Math.max(1, Array.isArray(task?.substeps) && task.substeps.length ? task.substeps.length : 4);
            return Array.from({ length: total }).every((_, i) => !!ev?.[i]);
        }

        function nk141SyncVerifyMarkers(source = 'auto') {
            if (!window.App || App.currentRoom !== 'preop') return false;
            const task = nk141FindVerifyTask();
            if (!task) return false;
            const ev = nk141Evidence(task);
            if (!ev) return false;

            nk141SyncEvidenceFromGckl(ev);

            const keys = [];
            if (ev[0]) keys.push('identity');
            if (ev[1]) keys.push('consent-site', 'consent');
            if (ev[2]) keys.push('preop-site-marker');

            const allGckl01Done = NK141_GCKL01_IDS.every(nk141Completed);
            const verifyTaskDone = nk141Completed(task.id);
            const clinicalStepsDone = !!ev[0] && !!ev[1] && !!ev[2];
            const allEvidenceDone = nk141VerifyEvidenceDone(task, ev);

            if (allGckl01Done || verifyTaskDone || clinicalStepsDone || allEvidenceDone) {
                keys.push(...NK141_VERIFY_MARKERS, 'identitySite', 'identity-consent-site', 'preop-nurse-3d');
            }

            if (keys.length) nk141MarkKeys(keys);

            // Kanıt adımları tamamlandıysa ana görev de görev listesinde tamamlandı görünmeli.
            // Guard: completeTask wrapper'ı ile sonsuz döngü oluşmasın.
            if (allEvidenceDone && !verifyTaskDone && !App.__nk141CompletingVerify) {
                try {
                    App.__nk141CompletingVerify = true;
                    App.__nk136AllowComplete = true;
                    completeTask?.(task.id, { label:'Kimlik / Onam / Taraf doğrulaması', opts:{ clinicalKey:'identity-consent-site' } });
                } catch(e) {
                    console.warn('v5.141 verify görev tamamlama senkron hatası', e);
                } finally {
                    App.__nk136AllowComplete = false;
                    App.__nk141CompletingVerify = false;
                }
            }

            try { gcklBoardSyncMarkerState?.(); } catch(e) {}
            try { syncGCKLPatientSafetyScore?.(); } catch(e) {}
            try { updateProgressBar?.(); } catch(e) {}
            try { updateScoreStrip?.(); } catch(e) {}
            try { renderTopbar?.(); } catch(e) {}
            return true;
        }

        window.nk141SyncVerifyMarkers = nk141SyncVerifyMarkers;
        nk141EnsureAliases();

        if (typeof completeTask === 'function' && !completeTask.__nk141AutoMarkerSync) {
            const prevCompleteTask = completeTask;
            const wrappedCompleteTask = function(taskId, sourceObj = null) {
                const r = prevCompleteTask.apply(this, arguments);
                try { nk141SyncVerifyMarkers('completeTask:' + taskId); } catch(e) { console.warn('v5.141 completeTask sonrası marker senkron hatası', e); }
                return r;
            };
            wrappedCompleteTask.__nk141AutoMarkerSync = true;
            try { completeTask = wrappedCompleteTask; } catch(e) {}
            try { window.completeTask = wrappedCompleteTask; } catch(e) {}
        }

        if (typeof showObjPopup === 'function' && !showObjPopup.__nk141AutoMarkerSync) {
            const prevShowObjPopup = showObjPopup;
            const wrappedShowObjPopup = function(obj, x, y) {
                const r = prevShowObjPopup.apply(this, arguments);
                try { setTimeout(() => nk141SyncVerifyMarkers('showObjPopup'), 0); } catch(e) {}
                return r;
            };
            wrappedShowObjPopup.__nk141AutoMarkerSync = true;
            try { showObjPopup = wrappedShowObjPopup; } catch(e) {}
            try { window.showObjPopup = wrappedShowObjPopup; } catch(e) {}
        }

        // Popup içindeki butonlardan biri kanıt adımı yazdığında, görev listesine tıklamayı beklemeden marker güncellenir.
        document.addEventListener('click', () => {
            try { setTimeout(() => nk141SyncVerifyMarkers('click'), 0); } catch(e) {}
        }, true);

        window.addEventListener('load', () => {
            setTimeout(() => { try { nk141SyncVerifyMarkers('load'); } catch(e) {} }, 500);
            setTimeout(() => { try { nk141SyncVerifyMarkers('load-late'); } catch(e) {} }, 1200);
        });
    } catch(err) {
        console.warn('v5.141 Onam otomatik marker/görev senkron patch uygulanamadı', err);
    }
})();

/* ============================================================
   İP-3 MULTI-SOURCE VERIFICATION
   Kritik GCKL maddelerinin substep'leri tıklandığında
   modal açılır ve birden fazla kaynaktan doğrulama istenir.
   ============================================================ */
(function() {
    'use strict';

    // Modal state — açık olan modal için bağlam
    let __msvCurrentTaskId = null;
    let __msvCurrentSourceObj = null;

    // Modal DOM elementleri (sayfa yüklendikten sonra bağlanacak)
    let msvModal, msvTitle, msvSources, msvConflict, msvConfirm, msvCancel, msvClose;

    function bindModalDOM() {
        msvModal    = document.getElementById('msv-modal');
        msvTitle    = document.getElementById('msv-title');
        msvSources  = document.getElementById('msv-sources');
        msvConflict = document.getElementById('msv-conflict');
        msvConfirm  = document.getElementById('msv-confirm');
        msvCancel   = document.getElementById('msv-cancel');
        msvClose    = document.getElementById('msv-close');

        if (!msvModal) {
            console.warn('[İP-3] MSV modal DOM bulunamadı');
            return false;
        }

        msvCancel.onclick = closeMSVModal;
        msvClose.onclick  = closeMSVModal;
        msvConfirm.onclick = onMSVConfirm;
        return true;
    }

    function openMSVModal(taskId, sourceObj) {
        if (!msvModal && !bindModalDOM()) return false;

        const config = NurseKitSM.getMultiSourceConfig(taskId);
        if (!config) {
            console.warn('[İP-3] Config yok:', taskId);
            return false;
        }

        __msvCurrentTaskId = taskId;
        __msvCurrentSourceObj = sourceObj;

        msvTitle.textContent = config.title;
        msvConflict.checked = false;

        // Kaynak checkbox'larını oluştur
        msvSources.innerHTML = config.sources.map((src, idx) => `
            <label style="display:flex; align-items:flex-start; gap:10px; padding:10px; background: var(--navy-2, #1a2332); border:1px solid var(--teal-3, #2a4055); border-radius:6px; cursor:pointer;">
                <input type="checkbox" class="msv-src-check" data-src-key="${src.key}" style="margin-top:3px;">
                <span>
                    <b>${src.label}</b>
                    ${src.hint ? `<br><span style="font-size:11px; color: var(--ink-mute, #8aa);">${src.hint}</span>` : ''}
                </span>
            </label>
        `).join('');

        msvModal.classList.add('visible');
        return true;
    }

    function closeMSVModal() {
        if (msvModal) msvModal.classList.remove('visible');
        __msvCurrentTaskId = null;
        __msvCurrentSourceObj = null;
    }

    function onMSVConfirm() {
        if (!__msvCurrentTaskId) return closeMSVModal();

        const taskId = __msvCurrentTaskId;
        const sourceObj = __msvCurrentSourceObj;

        // Hangi kaynaklar onaylandı?
        const sources = {};
        msvSources.querySelectorAll('.msv-src-check').forEach(cb => {
            sources[cb.dataset.srcKey] = cb.checked;
        });
        const conflict = msvConflict.checked;

        // State machine'e kaydet
        const result = NurseKitSM.recordMultiSourceVerification(taskId, sources, conflict);

        if (!result) {
            closeMSVModal();
            // Fallback: normal completeTask çağır
            return __nk_msv_orig_completeTask(taskId, sourceObj);
        }

        // Sonuca göre davran
        if (result.status === 'completed') {
            closeMSVModal();
            // Asıl completeTask'ı çağır (puan + UI senkron)
            try { recordAction('msv-complete', { taskId, sources, conflict: false }); } catch(e) {}
            return __nk_msv_orig_completeTask(taskId, sourceObj);
        }

        if (result.status === 'unsafe') {
            closeMSVModal();
            try { recordAction('msv-unsafe', { taskId, sources, conflict, reason: result.reason }); } catch(e) {}

            if (conflict) {
                // Çakışma raporlandı → cerrah çağırma + uyarı
                try {
                    toast('error', '⚠ Güvensiz Durum',
                        'Kaynaklar arasında uyumsuzluk raporlandı. Cerrah/ekip uyarısı gerekiyor; faz geçişi engellenecektir.');
                } catch(e) {}
            } else {
                // Never-event'te eksik kaynak → unsafe
                try {
                    toast('error', '⚠ Eksik Doğrulama',
                        'Bu kritik madde için tüm kaynakların doğrulanması zorunludur.');
                } catch(e) {}
            }
            return; // completeTask çağırma — görev unsafe kaldı
        }

        if (result.status === 'partial') {
            closeMSVModal();
            try { recordAction('msv-partial', { taskId, sources }); } catch(e) {}
            try {
                toast('warning', 'Kısmi Doğrulama',
                    'Bazı kaynaklar henüz doğrulanmadı. Görev kısmi durumda kaldı; daha sonra tamamlanabilir.');
            } catch(e) {}
            return; // completeTask çağırma
        }

        closeMSVModal();
    }

    // completeTask wrapper — son sıradaki versiyonu kapsar
    let __nk_msv_orig_completeTask = null;

    function installMSVWrapper() {
        if (typeof completeTask !== 'function') {
            console.warn('[İP-3] completeTask henüz tanımlı değil');
            return false;
        }
        if (completeTask.__msv_wrapped) return true;

        __nk_msv_orig_completeTask = completeTask;
        const wrapped = function(taskId, sourceObj = null) {
            try {
                // Multi-source gerektiren görev mi?
                if (NurseKitSM && NurseKitSM.hasMultiSource && NurseKitSM.hasMultiSource(taskId)) {
                    // Eğer zaten completed ise modal açma — eski davranış
                    if (App.completedTasks && App.completedTasks.includes(taskId)) {
                        return __nk_msv_orig_completeTask(taskId, sourceObj);
                    }
                    // Eğer zaten unsafe ise — bypass: tekrar açıp düzeltme şansı tanı
                    // Modal aç
                    const opened = openMSVModal(taskId, sourceObj);
                    if (opened) return; // modal kontrolü devraldı
                    // Modal açılamadıysa fallback
                }
            } catch(e) {
                console.warn('[İP-3] MSV check hatası:', e);
            }
            return __nk_msv_orig_completeTask(taskId, sourceObj);
        };
        wrapped.__msv_wrapped = true;
        completeTask = wrapped;
        try { window.completeTask = wrapped; } catch(e) {}
        return true;
    }

    // Sayfa yüklendikten sonra modal'ı bağla ve wrapper'ı kur
    function init() {
        if (!bindModalDOM()) {
            console.warn('[İP-3] Modal DOM hazır değil, retry...');
            setTimeout(init, 500);
            return;
        }
        if (!installMSVWrapper()) {
            console.warn('[İP-3] completeTask hazır değil, retry...');
            setTimeout(init, 500);
            return;
        }
        console.log('[İP-3] Multi-Source Verification kuruldu — 12 kritik GCKL maddesi için aktif');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Debug helper
    window.NurseKitMSV = {
        openModal: openMSVModal,
        closeModal: closeMSVModal,
        config: () => NurseKitSM.MULTI_SOURCE_CONFIG,
        listCovered: () => Object.keys(NurseKitSM.MULTI_SOURCE_CONFIG)
    };
})();

/* ============================================================
   İP-4 UI SYNC WATCHDOG
   Görev tamamlandığında listede yeşile dönmediği bilinen
   senkron sorununu yakalamak için. Periyodik olarak
   completedTasks ile DOM'daki render edilmiş durumu
   karşılaştırır; uyuşmazlık varsa render tetikler.

   Bu defensive bir mekanizmadır — kök neden çözüldükçe
   müdahalesi azalır. Konsolda telemetri tutar.
   ============================================================ */
(function() {
    'use strict';

    let lastCompletedSnapshot = '';
    let mismatchCount = 0;
    let watchdogInterval = null;
    const stats = { rendered: 0, mismatched: 0, recovered: 0 };

    function getCompletedSnapshot() {
        return (App && App.completedTasks) ? App.completedTasks.slice().sort().join('|') : '';
    }

    function getRenderedDoneIds() {
        // DOM'da .task-item.done sınıfı olan elementlerin task ID'lerini topla
        const items = document.querySelectorAll('.task-item.done');
        // task-item'larda data-task-id veya benzeri yoksa label eşleşmesi gerekir;
        // şu an basitçe count'a bakıyoruz
        return items.length;
    }

    function checkSync() {
        if (!App || !Array.isArray(App.completedTasks)) return;
        if (!App.currentPatient || !App.currentRoom) return;

        const phase = App.currentPatient[App.currentRoom];
        if (!phase || !Array.isArray(phase.tasks)) return;

        // Bu fazda kaç görev tamamlandı (state'e göre)
        const phaseTaskIds = phase.tasks.map(t => t.id);
        const phaseDoneInState = phaseTaskIds.filter(id => App.completedTasks.includes(id)).length;

        // DOM'da kaç tane .task-item.done var (sadece görünür task list'te)
        const taskList = document.getElementById('task-list');
        if (!taskList) return;
        const renderedDone = taskList.querySelectorAll('.task-item.done').length;

        // Snapshot değişti mi?
        const currentSnapshot = getCompletedSnapshot();
        if (currentSnapshot === lastCompletedSnapshot && phaseDoneInState === renderedDone) {
            return; // Her şey senkron, yapacak bir şey yok
        }

        // Uyuşmazlık varsa veya snapshot değiştiyse render tetikle
        if (phaseDoneInState !== renderedDone) {
            mismatchCount++;
            stats.mismatched++;
            console.debug(`[İP-4 Watchdog] Senkron uyuşmazlığı: state=${phaseDoneInState}, DOM=${renderedDone}. Render tetikleniyor.`);
            try {
                if (typeof renderRightPanel === 'function') {
                    renderRightPanel();
                    stats.recovered++;
                }
            } catch(e) {
                console.warn('[İP-4 Watchdog] Render hatası:', e);
            }
        }

        lastCompletedSnapshot = currentSnapshot;
        stats.rendered++;
    }

    function startWatchdog() {
        if (watchdogInterval) return;
        // 1.5 saniyede bir kontrol — UI hassasiyeti ile performans dengesi
        watchdogInterval = setInterval(checkSync, 1500);
        console.log('[İP-4 Watchdog] UI senkron izleyicisi başladı (1.5s aralıklı)');
    }

    function stopWatchdog() {
        if (watchdogInterval) {
            clearInterval(watchdogInterval);
            watchdogInterval = null;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startWatchdog);
    } else {
        // Hemen başlat
        setTimeout(startWatchdog, 1000);  // ilk render fırsatı bırak
    }

    // Debug helper
    window.NurseKitWatchdog = {
        stats: () => ({ ...stats, mismatchCount }),
        forceCheck: checkSync,
        forceRender: () => {
            try {
                if (typeof renderRightPanel === 'function') renderRightPanel();
                console.log('[İP-4 Watchdog] Manuel render tetiklendi');
            } catch(e) { console.warn(e); }
        },
        stop: stopWatchdog,
        start: startWatchdog
    };
})();


/* ===================== NurseKit v9.55: Preop GCKL Haritalama Uygulaması =====================
   Amaç: Preoperatif dönemde GCKL maddesi → görev → 3D nesne → gerekçelendirme sorusu → kanıt/puanlama
   zincirini görünür ve uygulanabilir hale getirmek. OSCE eklenmez; mevcut GCKL/görev puanlaması korunur.
*/
(function nurseKitPreopGcklMappingV955(){
    try {
        const MAP = [
            {
                key:'verify', order:1, section:'GCKL Kritik Bariyerleri',
                title:'Kimlik / Onam / Taraf', taskText:'Cerrahi doğrulamayı tamamla',
                cardKey:'identity-consent-site', objectKeys:['identity','consent-site','consent','preop-site-marker','preop-nurse-3d'],
                gckl:['GCKL-1','GCKL-2','GCKL-10','GCKL-11'],
                evidence:['Hastadan iki tanımlayıcı alınır','Onam ve işlem adı dosyada kontrol edilir','Cerrahi taraf/bölge hasta–dosya–işaret ile eşleştirilir'],
                reasoning:'Hasta beyanı, bileklik, dosya ve taraf işareti arasında uyumsuzluk varsa transfer durdurulmalıdır.',
                stopRule:'Kimlik, onam veya taraf belirsizliği çözülmeden transfer yok.'
            },
            {
                key:'allergy', order:2, section:'GCKL Kritik Bariyerleri',
                title:'Alerji / Risk Bilekliği', taskText:'Alerji riskini doğrula',
                cardKey:'preop-allergy', objectKeys:['preop-allergy'],
                gckl:['GCKL-14'],
                evidence:['Alerji hastadan sorulur','Bileklik/dosya/kayıt ile doğrulanır','Lateks/ilaç/antiseptik riski ekibe aktarılır'],
                reasoning:'Hasta beyanı dosyada görünmese bile güvenlik bilgisi kabul edilir ve kayda geçirilir.',
                stopRule:'Alerji belirsizliği çözülmeden antibiyotik, antiseptik veya lateks maruziyeti yok.'
            },
            {
                key:'npoLabsImaging', order:3, section:'GCKL Kritik Bariyerleri',
                title:'NPO / Tetkik / Görüntüleme', taskText:'Açlık, laboratuvar ve CABG sonuçlarını doğrula',
                cardKey:'npo-labs', objectKeys:['npo-labs'],
                gckl:['GCKL-3','GCKL-9','GCKL-15'],
                evidence:['Son oral alım hasta ve dosyadan netleştirilir','Hb/INR/Kreatinin/glisemi gibi kritik laboratuvarlar kontrol edilir','EKG, anjiyo/eko ve gerekli görüntüleme sonuçlarının görünürlüğü doğrulanır'],
                reasoning:'NPO belirsizliği aspirasyon riskidir; CABG’de tetkik/görüntüleme eksikliği ameliyat planını doğrudan bozar.',
                stopRule:'NPO veya kritik tetkik belirsizse anestezi/cerrahi ekibi bilgilendirilmeden transfer yok.'
            },
            {
                key:'blood', order:4, section:'GCKL Kritik Bariyerleri',
                title:'Kan Hazırlığı / Crossmatch', taskText:'Kan hazırlığını ve major kan kaybı riskini doğrula',
                cardKey:'preop-crossmatch', objectKeys:['preop-crossmatch'],
                gckl:['GCKL-8','GCKL-16'],
                evidence:['Kan grubu ve crossmatch hasta kimliğiyle eşleştirilir','CABG için kan ürünü hazırlığı doğrulanır','Major kan kaybı riski ve damar yolu gereksinimi ekibe aktarılır'],
                reasoning:'CABG yüksek kan kaybı riski taşır; crossmatch doğrulanmadan transfer güvenli değildir.',
                stopRule:'Crossmatch/kan hazırlığı belirsizse transfer durdurulur.'
            },
            {
                key:'med', order:5, section:'GCKL Kritik Bariyerleri',
                title:'İlaç Uzlaştırma', taskText:'Antikoagülan, antiagregan, insülin ve kritik ilaçları doğrula',
                cardKey:'preop-medrec', objectKeys:['preop-medrec'],
                gckl:['GCKL-16','GCKL-24'],
                evidence:['Hasta ilaç öyküsü alınır','Antikoagülan/antiagregan/insülin sorgulanır','Dosya ve ekip kararıyla karşılaştırılır'],
                reasoning:'Riskli ilaç öyküsü kanama, hipoglisemi veya hemodinamik bozulma riskini değiştirir.',
                stopRule:'Riskli ilaç belirsizliği ekip ile netleşmeden ilerleme yok.'
            },
            {
                key:'ivVitals', order:6, section:'GCKL Kritik Bariyerleri',
                title:'IV / Monitör / Anestezi Hazır Oluş', taskText:'Damar yolu, pulse oksimetre ve bazal vital güvenliğini doğrula',
                cardKey:'iv-access', objectKeys:['iv-access','baseline-vitals','headwall'],
                gckl:['GCKL-12','GCKL-13','GCKL-16'],
                evidence:['IV erişim açıklığı ve giriş yeri kontrol edilir','Pulse oksimetre/monitör çalışır durumda doğrulanır','BP, HR, SpO₂, sıcaklık ve glisemi transfer kararıyla ilişkilendirilir'],
                reasoning:'Monitör/IV “var” olmakla yetmez; çalışır ve kullanılabilir olmalıdır.',
                stopRule:'Kullanılamayan IV veya izlem belirsizliğiyle anestezi alanına geçiş yok.'
            },
            {
                key:'prep', order:7, section:'GCKL Klinik Hazırlık',
                title:'Hasta Hazırlığı', taskText:'Takı, protez, oje/makyaj, önlük ve bone kontrolünü tamamla',
                cardKey:'prep', objectKeys:['prep','prep-storage'],
                gckl:['GCKL-5','GCKL-6'],
                evidence:['Takı/protez/oje/makyaj kontrol edilir','Kıyafet, önlük ve bone uygunluğu doğrulanır','Çıkarılamayan materyal kayıt ve ekip iletişimiyle güvenceye alınır'],
                reasoning:'Hazırlık eksikliği yanık, aspirasyon, SpO₂ ölçüm hatası, bası ve kayıp eşya riskini artırır.',
                stopRule:'Çıkarılamayan materyal kayda alınmadan transfer yok.'
            },
            {
                key:'skin', order:8, section:'GCKL Klinik Hazırlık',
                title:'Cilt Hazırlığı / Clipper', taskText:'Cerrahi alan hazırlığını ve uygun tıraş yöntemini doğrula',
                cardKey:'preop-clipper', objectKeys:['preop-clipper','hand-hygiene'],
                gckl:['GCKL-4'],
                evidence:['Cilt bütünlüğü değerlendirilir','Jilet/tahriş bilgisi sorgulanır','Gerekiyorsa clipper ve uygun cilt hazırlığı planı doğrulanır'],
                reasoning:'Jilet ve cilt tahrişi cerrahi alan enfeksiyonu riskini artırır.',
                stopRule:'Cilt hasarı veya uygunsuz tıraş bilgisi ekibe bildirilmeden ilerleme yok.'
            },
            {
                key:'vteSpecial', order:9, section:'GCKL Klinik Hazırlık',
                title:'Özel Hazırlık / VTE', taskText:'CABG’ye özgü özel hazırlık ve VTE profilaksisini değerlendir',
                cardKey:'preop-vte', objectKeys:['preop-vte'],
                gckl:['GCKL-7','GCKL-25'],
                evidence:['VTE riski değerlendirilir','Mekanik/farmakolojik profilaksi planı kontrol edilir','Hazırlanan ekipmanın uygunluğu doğrulanır'],
                reasoning:'İleri yaş, kardiyak cerrahi ve immobilizasyon VTE riskini artırır; profilaksi görünür olmalıdır.',
                stopRule:'Profilaksi planı belirsizse transfer öncesi ekip teyidi gerekir.'
            },
            {
                key:'delirium', order:10, section:'Hasta Merkezli Hazırlık',
                title:'Deliryum / Kognitif Risk', taskText:'Kognitif riski ve duyusal destek gereksinimini değerlendir',
                cardKey:'preop-delirium', objectKeys:['preop-delirium'],
                gckl:['Destekleyici bakım'],
                evidence:['Oryantasyon ve bilişsel risk sorgulanır','Gözlük/işitme cihazı/uyku ve aile desteği değerlendirilir','Postop deliryum önleme planına aktarılır'],
                reasoning:'CABG ve ileri yaş deliryum riskini artırır; preop risk tanıma postop önlem fırsatıdır.',
                stopRule:'Ağır konfüzyon veya ciddi oryantasyon bozukluğu ekibe bildirilmelidir.'
            },
            {
                key:'anxietyEdu', order:11, section:'Hasta Merkezli Hazırlık',
                title:'Anksiyete / Eğitim', taskText:'Kaygı, solunum egzersizi ve postop beklentileri yapılandır',
                cardKey:'preop-anxiety', objectKeys:['preop-anxiety','preop-nurse-3d','family-relative-3d'],
                gckl:['ERAS / hasta eğitimi'],
                evidence:['Kaygı düzeyi sorgulanır','Solunum egzersizi ve erken mobilizasyon anlatılır','Hasta/yakın teach-back ile geri bildirim alınır'],
                reasoning:'Preop eğitim yalnız bilgi verme değildir; hasta postoperatif katılımı anlayabilmelidir.',
                stopRule:'Aşırı kaygı ve yanlış anlama düzeltilmeden eğitim tamamlanmış sayılmaz.'
            },
            {
                key:'transferGate', order:12, section:'Transfer Öncesi Kapanış',
                title:'Transfer Güvenliği', taskText:'Hasta–dosya–IV–GCKL uyumunu son kez kapat',
                cardKey:'preop-transfer', objectKeys:['preop-transfer','ssc-board-preop'],
                gckl:['GCKL-1–16 kapanış'],
                evidence:['Hasta ve dosya son kez eşleştirilir','IV, kan hazırlığı, alerji ve NPO açıkları kontrol edilir','Eksik varsa transfer başlatılmaz'],
                reasoning:'Transfer, preop güvenlik bariyerlerinin kapanış noktasıdır; eksik kontrol ameliyathaneye taşınmamalıdır.',
                stopRule:'Kritik açık varsa transfer yok; önce ekip teyidi ve kayıt düzeltmesi.'
            }
        ];
        window.NK955_PREOP_GCKL_MAP = MAP;

        function esc(v){ return String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
        function norm(v){ return String(v || '').toLocaleLowerCase('tr-TR'); }
        function getTaskList(){ return App?.currentPatient?.preop?.tasks || []; }
        function findTask(map){
            const tasks = getTaskList();
            const keys = [map.cardKey, ...(map.objectKeys || []), map.title, map.taskText].map(norm);
            return tasks.find(t => keys.some(k => k && (norm(t.cardKey).includes(k) || norm(t.label).includes(k) || (t.keywords || []).some(x => norm(x).includes(k))))) || null;
        }
        function preopMapTaskDone(map){
            const t = findTask(map);
            if (!t) return false;
            return !!(App?.completedTasks || []).includes(t.id);
        }
        function mapForObjectKey(ck){
            const key = norm(ck);
            if (!key) return null;
            return MAP.find(m => (m.objectKeys || []).map(norm).includes(key) || norm(m.cardKey) === key) || null;
        }
        function currentMapPct(){
            const done = MAP.filter(preopMapTaskDone).length;
            return { done, total: MAP.length, pct: MAP.length ? Math.round(done / MAP.length * 100) : 0 };
        }
        function injectStyles(){
            if (document.getElementById('nk955-preop-map-styles')) return;
            const st = document.createElement('style');
            st.id = 'nk955-preop-map-styles';
            st.textContent = `
                .nk955-preop-map{border:1px solid rgba(92,196,214,.22);background:linear-gradient(180deg,rgba(10,28,48,.96),rgba(8,22,40,.94));border-radius:18px;padding:12px 12px 13px;margin-bottom:12px;box-shadow:0 12px 28px rgba(0,0,0,.16)}
                .nk955-map-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}
                .nk955-map-title{font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--teal)}
                .nk955-map-sub{font-size:11px;color:var(--ink-mute);line-height:1.35;margin-top:3px}
                .nk955-map-progress{font-family:var(--font-mono);font-size:11px;color:var(--ink);border:1px solid rgba(255,255,255,.10);border-radius:999px;padding:5px 8px;background:rgba(255,255,255,.035);white-space:nowrap}
                .nk955-section-title{font-size:10px;color:var(--ink-dim);letter-spacing:.08em;text-transform:uppercase;font-weight:850;margin:9px 0 6px}
                .nk955-map-grid{display:grid;gap:6px}
                .nk955-row{border:1px solid rgba(255,255,255,.075);background:rgba(255,255,255,.035);border-radius:12px;padding:8px 9px;display:grid;grid-template-columns:24px 1fr;gap:8px;cursor:pointer;transition:.16s ease}
                .nk955-row:hover{border-color:rgba(92,196,214,.30);background:rgba(92,196,214,.065);transform:translateY(-1px)}
                .nk955-row.done{border-color:rgba(76,184,138,.30);background:rgba(76,184,138,.08)}
                .nk955-num{width:22px;height:22px;border-radius:999px;display:grid;place-items:center;font-family:var(--font-mono);font-size:10px;font-weight:900;background:rgba(92,196,214,.12);color:var(--teal);border:1px solid rgba(92,196,214,.26)}
                .nk955-row.done .nk955-num{background:rgba(76,184,138,.15);color:var(--green);border-color:rgba(76,184,138,.30)}
                .nk955-row-title{font-size:12px;font-weight:850;color:var(--ink);line-height:1.22}
                .nk955-row-task{font-size:10.8px;color:var(--ink-mute);line-height:1.3;margin-top:2px}
                .nk955-chipline{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
                .nk955-chip{font-size:9.5px;border:1px solid rgba(92,196,214,.22);border-radius:999px;padding:3px 6px;color:var(--teal);background:rgba(92,196,214,.08);line-height:1}
                .nk955-chip.warn{color:var(--amber);border-color:rgba(224,165,88,.24);background:rgba(224,165,88,.08)}
                .nk955-popup-box{border:1px solid rgba(92,196,214,.22);background:rgba(92,196,214,.07);border-radius:14px;padding:10px 12px;margin:10px 0;color:var(--ink);font-size:12px;line-height:1.42}
                .nk955-popup-box .h{display:block;color:var(--teal);font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}
                .nk955-popup-box ul{margin:6px 0 0 16px;padding:0}.nk955-popup-box li{margin:3px 0;color:var(--ink-mute)}
                .nk955-board{display:grid;gap:8px}.nk955-board-row{border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.035);padding:8px 10px}.nk955-board-row b{color:var(--teal)}
            `;
            document.head.appendChild(st);
        }
        function applyTaskMetadata(){
            const apply = phase => {
                if (!phase || !Array.isArray(phase.tasks)) return;
                MAP.forEach(m => {
                    const t = phase.tasks.find(x => norm(x.cardKey) === norm(m.cardKey) || (m.objectKeys || []).some(k => norm(x.cardKey) === norm(k)) || norm(x.label).includes(norm(m.title.split('/')[0])));
                    if (!t) return;
                    t.gcklItems = m.gckl.slice();
                    t.mappedObjectKeys = m.objectKeys.slice();
                    t.reasoningFocus = m.reasoning;
                    t.evidenceRule = m.evidence.slice();
                    t.stopRule = m.stopRule;
                    t.preopMapOrder = m.order;
                    t.preopMapSection = m.section;
                });
            };
            try { if (typeof CASES !== 'undefined') CASES.forEach(c => apply(c?.preop)); } catch(e) {}
            try { apply(App?.currentPatient?.preop); } catch(e) {}
        }
        function renderPreopMapPanel(){
            if (App?.currentRoom !== 'preop') return;
            const list = document.getElementById('task-list');
            if (!list) return;
            injectStyles(); applyTaskMetadata();
            const old = document.getElementById('nk955-preop-map-panel');
            if (old) old.remove();
            const prog = currentMapPct();
            const panel = document.createElement('div');
            panel.id = 'nk955-preop-map-panel';
            panel.className = 'nk955-preop-map';
            const sections = [...new Set(MAP.map(m => m.section))];
            panel.innerHTML = `<div class="nk955-map-head"><div><div class="nk955-map-title">Preop GCKL Haritası</div><div class="nk955-map-sub">GCKL maddesi → görev → 3D nesne → gerekçe sorusu → kanıt zinciri.</div></div><div class="nk955-map-progress">${prog.done}/${prog.total} · %${prog.pct}</div></div>`;
            sections.forEach(sec => {
                const title = document.createElement('div');
                title.className = 'nk955-section-title';
                title.textContent = sec;
                panel.appendChild(title);
                const grid = document.createElement('div');
                grid.className = 'nk955-map-grid';
                MAP.filter(m => m.section === sec).forEach(m => {
                    const done = preopMapTaskDone(m);
                    const row = document.createElement('div');
                    row.className = 'nk955-row ' + (done ? 'done' : '');
                    row.innerHTML = `<div class="nk955-num">${done ? '✓' : m.order}</div><div><div class="nk955-row-title">${esc(m.title)}</div><div class="nk955-row-task">${esc(m.taskText)}</div><div class="nk955-chipline"><span class="nk955-chip">${esc((m.gckl || []).join(' · '))}</span><span class="nk955-chip warn">${esc((m.objectKeys || []).slice(0,3).join(' / '))}</span></div></div>`;
                    row.onclick = () => { try { showSceneReaction?.(`${m.title}: ${m.reasoning}`, done ? 'ok' : 'info'); } catch(e) {} };
                    grid.appendChild(row);
                });
                panel.appendChild(grid);
            });
            const roleCard = list.querySelector('.phase-role-card');
            if (roleCard && roleCard.parentNode === list) roleCard.insertAdjacentElement('afterend', panel);
            else list.insertBefore(panel, list.firstChild);
        }
        function buildPopupHtmlForMap(m){
            return `<div class="nk955-popup-box"><span class="h">GCKL Haritalama</span><b>${esc(m.title)}</b><br>${esc(m.taskText)}<br><br><b>GCKL:</b> ${esc((m.gckl || []).join(' · '))}<br><b>Gerekçe:</b> ${esc(m.reasoning)}<br><b>Durdurma kuralı:</b> ${esc(m.stopRule)}<ul>${(m.evidence || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
        }
        function popupBoardHtml(){
            const prog = currentMapPct();
            return `<span class="oclose">×</span><div class="otitle-row"><div class="otitle">Preop GCKL Haritalama Panosu</div></div><div class="nk955-popup-box"><span class="h">Uygulama Mantığı</span>Bu pano preoperatif dönemde her güvenlik davranışını GCKL maddesine, 3D nesneye, gerekçelendirme sorusuna ve puanlama kanıtına bağlar. Durum: <b>${prog.done}/${prog.total}</b> harita halkası tamamlandı.</div><div class="nk955-board">${MAP.map(m => `<div class="nk955-board-row"><b>${m.order}. ${esc(m.title)}</b><br><span style="color:var(--ink-mute)">${esc((m.gckl || []).join(' · '))} · ${esc(m.taskText)}</span></div>`).join('')}</div>`;
        }
        function enhancePopup(obj){
            const ck = obj?.opts?.clinicalKey || obj?.clinicalKey || '';
            const p = document.getElementById('obj-popup');
            if (!p || !p.classList.contains('visible')) return;
            if (ck === 'preop-mapping-board') {
                p.classList.add('nk136-popup-mode');
                p.innerHTML = popupBoardHtml();
                const close = p.querySelector('.oclose');
                if (close) close.onclick = () => p.classList.remove('visible');
                return;
            }
            const m = mapForObjectKey(ck);
            if (!m) return;
            if (p.querySelector('.nk955-popup-box')) return;
            const target = p.querySelector('.nk136-card') || p;
            const tmp = document.createElement('div');
            tmp.innerHTML = buildPopupHtmlForMap(m);
            target.appendChild(tmp.firstElementChild);
        }
        function installPopupWrapper(){
            const prev = window.showObjPopup || (typeof showObjPopup === 'function' ? showObjPopup : null);
            if (typeof prev !== 'function' || prev.__nk955MapPopup) return;
            const wrapped = function(obj, x, y){
                const r = prev.apply(this, arguments);
                setTimeout(() => { try { enhancePopup(obj); } catch(e) { console.warn('nk955 popup enhancement failed', e); } }, 0);
                return r;
            };
            wrapped.__nk955MapPopup = true;
            try { showObjPopup = wrapped; } catch(e) {}
            try { window.showObjPopup = wrapped; } catch(e) {}
        }
        function installRenderWrapper(){
            const prev = window.renderRightPanel || (typeof renderRightPanel === 'function' ? renderRightPanel : null);
            if (typeof prev !== 'function' || prev.__nk955PreopMap) return;
            const wrapped = function(){
                const r = prev.apply(this, arguments);
                try { renderPreopMapPanel(); } catch(e) { console.warn('nk955 preop map panel failed', e); }
                return r;
            };
            wrapped.__nk955PreopMap = true;
            try { renderRightPanel = wrapped; } catch(e) {}
            try { window.renderRightPanel = wrapped; } catch(e) {}
        }
        function installBuildWrapper(){
            const prev = window.buildPreop || (typeof buildPreop === 'function' ? buildPreop : null);
            if (typeof prev !== 'function' || prev.__nk955MapBoard) return;
            const wrapped = function(){
                const r = prev.apply(this, arguments);
                try {
                    if (typeof addObj === 'function') {
                        const task = getTaskList().find(t => norm(t.cardKey).includes('preop-transfer')) || getTaskList()[0];
                        const board = (typeof buildModernPatientCardStand === 'function')
                            ? buildModernPatientCardStand(-4.85, 0, -4.35, 0x5cc4d6, 0xe8edf2, 0xe0a558)
                            : (typeof buildChecklistBoard === 'function' ? buildChecklistBoard(-4.85, 0, -4.35) : null);
                        if (board) {
                            addObj(board, 'Preop GCKL Haritalama Panosu', 'Preop dönemindeki GCKL maddelerini görev listesi, 3D nesne, mikro karar sorusu ve kanıt/puanlama mantığıyla eşleştiren eğitici pano.', { taskId: task?.id, clinicalKey:'preop-mapping-board', severity:'warn' });
                            if (typeof statusMarker === 'function') statusMarker(-4.85, 1.34, -4.35, task, 'Harita', { role:'preop', priority:'active', clinicalKey:'preop-mapping-board', shortLabel:'Harita', showLabel:true });
                        }
                    }
                } catch(e) { console.warn('nk955 preop mapping board could not be added', e); }
                return r;
            };
            wrapped.__nk955MapBoard = true;
            try { buildPreop = wrapped; } catch(e) {}
            try { window.buildPreop = wrapped; } catch(e) {}
        }
        function addQuestions(){
            try {
                if (typeof GCKL_QUESTIONS === 'undefined' || !Array.isArray(GCKL_QUESTIONS)) return;
                const add = q => { if (!GCKL_QUESTIONS.some(x => x.id === q.id)) GCKL_QUESTIONS.push(q); };
                add({ id:'GCKL-Q-PRE-MAP-01', section:'I', linkedChecklistItem:'GCKL-1', type:'multiple_choice', correctOption:'C',
                    context:'Hasta adını doğru söylüyor; ancak bileklik protokol numarası dosyadaki numarayla uyuşmuyor.',
                    question:'Preop hemşiresinin doğru davranışı nedir?',
                    options:{ A:'Ad soyad doğruysa transferi başlatmak.', B:'Sadece hasta yakınına sormak.', C:'Transferi durdurup bileklik, dosya, ameliyat listesi ve ekip ile kimliği yeniden doğrulamak.', D:'Bilekliği dosyaya göre elle düzeltmek.' },
                    explanation:'Kimlik zincirinde uyumsuzluk durdurucu bulgudur.', feedbackIfWrong:'Kimlik uyuşmazlığı çözülmeden cerrahi süreç ilerletilemez.' });
                add({ id:'GCKL-Q-PRE-MAP-02', section:'I', linkedChecklistItem:'GCKL-9', type:'multiple_choice', correctOption:'D',
                    context:'CABG hastasında laboratuvar sonuçları görünür; ancak eko/anjiyo raporu ve son EKG dosyada bulunamıyor.',
                    question:'En güvenli yaklaşım hangisidir?',
                    options:{ A:'Sadece laboratuvarlar tam olduğu için transfer etmek.', B:'Eksik görüntülemeyi intraop ekibe bırakmak.', C:'Hastaya sonuçları olup olmadığını sormak ve yeterli kabul etmek.', D:'Görüntüleme/rapor görünürlüğü netleşene kadar cerrahi/anestezi ekibiyle doğrulama yapmak.' },
                    explanation:'CABG’de görüntüleme ve kardiyak sonuçlar ameliyat planını etkiler.', feedbackIfWrong:'Laboratuvar tek başına yeterli değildir; gerekli görüntüleme ve raporlar görünür olmalıdır.' });
                add({ id:'GCKL-Q-PRE-MAP-03', section:'II', linkedChecklistItem:'GCKL-16', type:'multiple_choice', correctOption:'B',
                    context:'CABG hastasında crossmatch sonucu sisteme düşmemiş, ancak hasta kan grubunu bildiğini söylüyor.',
                    question:'Bu bilgi nasıl yönetilmelidir?',
                    options:{ A:'Hastanın beyanını yeterli kabul etmek.', B:'Crossmatch ve kan ürünü hazırlığını hasta kimliğiyle resmi kayıttan doğrulamadan transferi başlatmamak.', C:'Kan gerekirse ameliyathanede istenir demek.', D:'Sadece kan grubunu hemşire notuna yazmak.' },
                    explanation:'Major kan kaybı riski olan CABG hastasında kan hazırlığı resmi kayıtla doğrulanmalıdır.', feedbackIfWrong:'Hasta beyanı transfüzyon güvenliği için yeterli kanıt değildir.' });
                add({ id:'GCKL-Q-PRE-MAP-04', section:'II', linkedChecklistItem:'GCKL-13', type:'multiple_choice', correctOption:'A',
                    context:'Preop monitörde SpO₂ probu takılı görünüyor fakat dalga formu yok ve değer sabit kalıyor.',
                    question:'Doğru yaklaşım nedir?',
                    options:{ A:'Prob yerleşimini ve monitör çalışmasını doğrulamak; güvenilir ölçüm olmadan hazır kabul etmemek.', B:'Ekranda sayı olduğu için yeterli kabul etmek.', C:'Pulse oksimetreyi yalnız anestezi alanında kontrol etmek.', D:'SpO₂ ölçümünü gereksiz saymak.' },
                    explanation:'Pulse oksimetre yalnız takılı değil, çalışır ve güvenilir durumda olmalıdır.', feedbackIfWrong:'Monitör varlığı değil, güvenilir izlem kanıtı gerekir.' });
            } catch(e) { console.warn('nk955 GCKL soruları eklenemedi', e); }
        }
        injectStyles(); applyTaskMetadata(); addQuestions(); installPopupWrapper(); installRenderWrapper(); installBuildWrapper();
        window.addEventListener('load', () => setTimeout(() => { try { applyTaskMetadata(); renderPreopMapPanel(); } catch(e){} }, 450));
    } catch(err) { console.warn('NurseKit v9.55 preop mapping patch failed', err); }
})();
