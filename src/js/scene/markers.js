/* ============================================================
   scene/markers.js — 3D Marker, Görev İpuçları ve Rol Odağı
   ------------------------------------------------------------
   Bu modül 3D sahnedeki klinik marker (etiket) sistemini yönetir:
     • Görev ipuçları: taskByKeywords, taskDone, taskStatusClass, taskStatusLabel
     • Marker tamamlama deposu: MARKER_COMPLETION_ALIASES, markerKeyDone,
       getMarkerTargetKeys, setMarkerKeyDone, completeMarkerBySourceKey
     • GCKL pano senkronu: gcklBoardPhaseFromKey, gcklBoardSyncMarkerState,
       getGcklBoardMeta, gcklBoardGroupState, gcklBoardProgressForPhase
     • Marker etiket görselleştirme: drawRoundedRect, renderMarkerLabelCanvas,
       createMarkerLabelSprite, updateMarkerLabelSprite, markerLabelPalette
     • Sahnedeki marker objesi: statusMarker (sprite + halka + ışık)
     • Görünürlük & rol odağı: applyMarkerVisibility, updateMarkerColors,
       getCurrentRoleFocus, setCurrentRoleFocus, markerMatchesRoleFocus
     • Tamamlama animasyonu: pulseMarkerComplete

   Bağımlılıklar:
     - THREE                          (global)
     - var three, var App             (scene/engine.js + core/main-app.js)
     - getObjectCriticalTalkKey       (core/main-app.js)
     - GCKL_ITEMS, gcklItemsByPhase   (core/main-app.js)
     - PRE_GCKL_NETWORK / INTRAOP_GCKL_NETWORK (faz modülleri)

   Yükleme sırası: scene/engine.js → core/main-app.js → scene/markers.js
   (engine ve main-app fonksiyon decl'larını expose ettikten sonra)
   ============================================================ */

        function taskByKeywords(keys) {
            const phase = App.currentPatient?.[App.currentRoom]; if (!phase) return null;
            const norm = s => (s || '').toLocaleLowerCase('tr-TR');
            for (const t of phase.tasks || []) {
                const label = norm([
                    t.label, t.id, t.group, t.cardKey,
                    (t.keywords || []).join(' '),
                    (t.substeps || []).join(' ')
                ].filter(Boolean).join(' '));
                if (keys.some(k => label.includes(norm(k)))) return t;
            }
            return null;
        }
        function getTaskByKeywordsForPhase(phaseName, keys) {
            const phase = App.currentPatient?.[phaseName]; if (!phase) return null;
            const norm = s => (s || '').toLocaleLowerCase('tr-TR');
            for (const t of phase.tasks || []) {
                const label = norm([
                    t.label, t.id, t.group, t.cardKey,
                    (t.keywords || []).join(' '),
                    (t.substeps || []).join(' ')
                ].filter(Boolean).join(' '));
                if (keys.some(k => label.includes(norm(k)))) return t;
            }
            return null;
        }
        function taskDone(task) { return task && App.completedTasks.includes(task.id); }
        function taskStatusClass(task) { return !task ? 'warn' : (taskDone(task) ? 'ok' : (task.critical ? 'danger' : 'warn')); }
        function taskStatusLabel(task) { return !task ? 'Görev bağlantısı yok' : (taskDone(task) ? 'Tamamlandı' : (task.critical ? 'Kritik görev bekliyor' : 'Görev bekliyor')); }

        // Marker etiketleri görev ID'sine göre topluca değil, objeye göre tamamlanır.
        // Aynı görev ID'sine bağlı birden fazla kritik etiket varsa yalnızca işlem yapılan obje yeşile döner.
        const MARKER_COMPLETION_ALIASES = {
            'consent-site': ['consent'],
            'identity': ['identity'],
            'preop-allergy': ['preop-allergy'],
            'preop-site-marker': ['preop-site-marker'],
            'npo-labs': ['npo-labs'],
            'oxygen': ['pacu-airway'],
            'postop-drain-card': ['bleeding'],
            'handoff': ['handoff'],
            'mayo-stand': ['mayo-stand', 'sterile-table'],   // v6.0: Mayo+Arka Masa entegrasyonu
            'time-out': ['time-out', 'warming-pressure'],     // v6.7: Isı görevleri masaya entegre
            'warming-pressure': ['time-out', 'warming-pressure'], // ters yön
            'sterile-table': ['mayo-stand', 'sterile-table'], // ters yönde de geçerli
            'esu-unit': ['esu-unit', 'suction-smoke'],        // v6.0: ESU+Aspirasyon entegrasyonu
            'suction-smoke': ['esu-unit', 'suction-smoke'],   // ters yönde de geçerli
            'cpb-machine': ['cpb-machine', 'perfusion-console', 'cpb-phase-board'], // v5.175: KPB+Perfüzyon entegrasyonu
            'cpb-phase-board': ['cpb-machine', 'perfusion-console', 'cpb-phase-board'],
            'cell-saver': ['cell-saver'],
            'postop-bleed-coag': ['postop-bleed-coag', 'bleeding'],
            'perfusion-console': ['cpb-machine', 'perfusion-console', 'cpb-phase-board'], // ters yönde de geçerli
            'antibiotic': ['antibiotic'],
            'count-board': ['count-board'],
            'signin': ['signin'],
            'time-out': ['time-out'],
            // kritik iletişim anahtarları → görünür kısa etiketler
            'identitySite': ['identity'],
            'allergy': ['preop-allergy'],
            'npo': ['npo-labs'],
            'drain': ['bleeding'],
            'pain': ['postop-pain-score'],
            'fallMobility': ['fall'],
            'bloodCrossmatch': ['preop-crossmatch']
        };
        function getCompletedMarkerStore() {
            App.completedMarkerKeys = App.completedMarkerKeys || {};
            return App.completedMarkerKeys;
        }
        function markerKeyDone(markerKey) {
            if (!markerKey) return false;
            return !!getCompletedMarkerStore()[markerKey];
        }
        function markerVisualDone(marker) {
            const mk = marker?.group?.userData?.markerClinicalKey || marker?.clinicalKey || null;
            return !!marker?.visualDone || markerKeyDone(mk);
        }
        function getMarkerCompletionKeyFromObject(sourceObj) {
            return sourceObj?.opts?.clinicalKey || getObjectCriticalTalkKey(sourceObj) || null;
        }
        function getMarkerTargetKeys(sourceKey) {
            if (!sourceKey) return [];
            const keys = new Set([sourceKey]);
            const aliases = MARKER_COMPLETION_ALIASES[sourceKey] || [];
            aliases.forEach(k => keys.add(k));
            return Array.from(keys);
        }
        function setMarkerKeyDone(sourceKey, done = true) {
            const keys = getMarkerTargetKeys(sourceKey);
            if (!keys.length) return;
            const store = getCompletedMarkerStore();
            keys.forEach(k => { store[k] = done; });
        }
        function markerMatchesCompletionKey(marker, sourceKey) {
            if (!marker || !sourceKey) return false;
            const mk = marker.group?.userData?.markerClinicalKey || marker.clinicalKey || null;
            if (!mk) return false;
            const targets = getMarkerTargetKeys(sourceKey);
            return targets.includes(mk);
        }
        function gcklBoardPhaseFromKey(key, fallback = App.currentRoom) {
            const k = String(key || '');
            if (k.includes('preop')) return 'preop';
            if (k.includes('intraop')) return 'intraop';
            if (k.includes('postop')) return 'postop';
            return fallback || 'preop';
        }
        function gcklBoardMarkerKey(phaseName = App.currentRoom) {
            return `ssc-board-${phaseName}`;
        }
        const GCKL_COMPACT_LABELS = {
            'GCKL-1':  'Kimlik / ameliyat / taraf doğrulama',
            'GCKL-2':  'Cerrahi onam / rıza teyidi',
            'GCKL-3':  'NPO / açlık kontrolü',
            'GCKL-4':  'Bölge hazırlığı / tıraş',
            'GCKL-5':  'Protez / makyaj / değerli eşya',
            'GCKL-6':  'Önlük / bone hazırlığı',
            'GCKL-7':  'Özel işlem gereksinimi',
            'GCKL-8':  'Kan / implant / özel malzeme',
            'GCKL-9':  'Laboratuvar / radyoloji tetkikleri',
            'GCKL-10': 'Kimlik / onam / taraf doğrulama',
            'GCKL-11': 'Taraf işaretleme kontrolü',
            'GCKL-12': 'Anestezi güvenlik kontrolü',
            'GCKL-13': 'Pulse oksimetre kontrolü',
            'GCKL-14': 'Alerji doğrulama',
            'GCKL-15': 'Görüntüleme hazırlığı',
            'GCKL-16': 'Kan kaybı riski',
            'GCKL-17': 'Ekip tanıtımı',
            'GCKL-18': 'Hasta / işlem / taraf teyidi',
            'GCKL-19': 'Kritik olay paylaşımı',
            'GCKL-20': 'Antibiyotik profilaksisi',
            'GCKL-21': 'Görüntüleme ve ekipman hazırlığı',
            'GCKL-22': 'Sterilite / malzeme güvenliği',
            'GCKL-23': 'Anestezi risk paylaşımı',
            'GCKL-24': 'Hemşirelik ekip hazırlığı',
            'GCKL-25': 'İmplant / özel malzeme teyidi',
            'GCKL-26': 'Hasta devri / SBAR',
            'GCKL-27': 'Sayım güvenliği',
            'GCKL-28': 'Numune güvenliği',
            'GCKL-29': 'Postop plan / ekip paylaşımı',
            'GCKL-30': 'Hasta güvenli çıkış / izlem'
        };
        function gcklCompactLabel(item) {
            if (!item) return '';
            return GCKL_COMPACT_LABELS[item.id] || String(item.text || '').replace(/\?\s*$/, '');
        }
        function getCurrentGcklBoardGroups(phaseName = App.currentRoom) {
            try {
                if (phaseName === 'preop') {
                    // Preop GCKL yalnızca çekirdek güvenlik görevlerini izler.
                    // Destekleyici bakım/risk kartları (Deliryum, Anksiyete, VTE, Cilt, Hazırlık)
                    // GCKL ilerlemesine dahil edilmez.
                    return [
                        { key:'preop-gckl-identity', title:'Kimlik', short:'Kimlik', taskKeywords:['kimlik / onam / taraf', 'cerrahi doğrulamayı tamamla', 'kimliği hastadan doğrula'], fullText:'Kimlik doğrulaması' },
                        { key:'preop-gckl-consent', title:'Onam', short:'Onam', taskKeywords:['kimlik / onam / taraf', 'cerrahi onamı kontrol et'], fullText:'Cerrahi onam kontrolü' },
                        { key:'preop-gckl-site', title:'Taraf', short:'Taraf', taskKeywords:['kimlik / onam / taraf', 'ameliyat bölgesi/tarafı doğrula', 'taraf'], fullText:'Taraf/bölge doğrulaması' },
                        { key:'preop-gckl-allergy', title:'Alerji', short:'Alerji', taskKeywords:['alerji ·', 'alerji riskini doğrula'], fullText:'Alerji risk doğrulaması' },
                        { key:'preop-gckl-npo', title:'NPO', short:'NPO', taskKeywords:['npo ·', 'açlık ve tetkik'], fullText:'Açlık ve tetkik uygunluğu' },
                        { key:'preop-gckl-blood', title:'KAN', short:'KAN', taskKeywords:['kan ·', 'kan hazırlığını doğrula', 'crossmatch'], fullText:'Kan hazırlığı / crossmatch' },
                        { key:'preop-gckl-med', title:'İlaç', short:'İlaç', taskKeywords:['ilaç ·', 'ilaç öyküsünü doğrula'], fullText:'İlaç öyküsü / riskli ilaçlar' },
                        { key:'preop-gckl-iv', title:'IV', short:'IV', taskKeywords:['iv ·', 'damar yolu hazırlığını kontrol et'], fullText:'Damar yolu hazırlığı' },
                        { key:'preop-gckl-transfer', title:'Transfer', short:'Transfer', taskKeywords:['transfer ·', 'güvenli transfer hazırlığını tamamla'], fullText:'Güvenli transfer hazırlığı' }
                    ];
                }
                return GCKL_ITEMS
                    .filter(item => gcklPhaseForItem(item.id) === phaseName)
                    .filter(item => (GCKL_TASK_DEFS[item.id] || []).length)
                    .map(item => ({
                        itemId: item.id,
                        title: gcklCompactLabel(item),
                        short: gcklCompactLabel(item),
                        fullText: item.text
                    }));
            } catch(e) {
                return [];
            }
        }
        function gcklBoardProgressForPhase(phaseName = App.currentRoom) {
            const groups = getCurrentGcklBoardGroups(phaseName);
            const states = groups.map(group => gcklBoardGroupState(group, phaseName));
            const total = states.reduce((sum, st) => sum + (st.required ? st.required.length : 0), 0);
            const done = states.reduce((sum, st) => sum + (st.completed ? st.completed.length : 0), 0);
            const pct = total ? Math.round((done / total) * 100) : 0;
            return { groups, states, total, done, pct };
        }
        function gcklBoardAllDone(phaseName = App.currentRoom) {
            const p = gcklBoardProgressForPhase(phaseName);
            return p.total > 0 && p.done >= p.total;
        }
        function getGcklBoardMeta(phaseName = App.currentRoom) {
            const map = {
                preop: {
                    title: 'GCKL Panosu',
                    phaseLabel: 'Preoperatif hazırlık',
                    team: 'Preop ekip',
                    scope: 'WHO SSC',
                    keyLabel: 'Preop GCKL',
                    caption: ''
                },
                intraop: {
                    title: 'İntraop GCKL Panosu',
                    phaseLabel: 'İntraoperatif güvenlik',
                    team: 'Tüm ekip',
                    scope: 'WHO SSC',
                    keyLabel: 'İntraop GCKL',
                    caption: 'Ekip tanıtımı, time-out, profilaksi, sterilite, sayım ve numune güvenliği faz görev listesiyle izlenir.'
                },
                postop: {
                    title: 'Postop GCKL Panosu',
                    phaseLabel: 'Postoperatif güvenli devir',
                    team: 'PACU ekip',
                    scope: 'Güvenli devir',
                    keyLabel: 'Postop GCKL',
                    caption: 'SBAR teslim, solunum, ağrı, kanama-dren, bilinç ve mobilizasyon güvenliği faz görev listesiyle izlenir.'
                }
            };
            return map[phaseName] || map.preop;
        }
        function gcklBoardGroupState(groupOrId, phaseName = App.currentRoom) {
            const group = typeof groupOrId === 'string'
                ? (getCurrentGcklBoardGroups(phaseName).find(g => g.itemId === groupOrId || g.key === groupOrId) || null)
                : groupOrId;
            if (!group) return { code:0, required:[], completed:[], missing:[], title:'', short:'' };
            if (group.itemId) {
                const rc = typeof gcklRequiredCompleted === 'function' ? gcklRequiredCompleted(group.itemId) : { required:[], completed:[], missing:[] };
                const code = typeof gcklCodeForItem === 'function' ? gcklCodeForItem(group.itemId) : 0;
                const item = typeof gcklGetItem === 'function' ? gcklGetItem(group.itemId) : null;
                return { ...group, itemId: group.itemId, item, code, required: rc.required || [], completed: rc.completed || [], missing: rc.missing || [] };
            }
            const task = group.taskKeywords ? getTaskByKeywordsForPhase(phaseName, group.taskKeywords) : null;
            const required = task ? [task.id] : [];
            const completed = task && App.completedTasks.includes(task.id) ? [task.id] : [];
            const missing = task && !App.completedTasks.includes(task.id) ? [task.id] : [];
            const code = !task ? 0 : (completed.length ? 2 : 0);
            return { ...group, task, code, required, completed, missing };
        }
        function gcklBoardSyncMarkerState() {
            try {
                ['preop','intraop','postop'].forEach(ph => {
                    setMarkerKeyDone(gcklBoardMarkerKey(ph), !!gcklBoardAllDone(ph));
                });
            } catch(e) {}
            try { applyMarkerVisibility?.(); } catch(e) {}
        }
        function objectMarkerDone(obj) {
            const ck = String(obj?.opts?.clinicalKey || '');
            if (ck.startsWith('ssc-board')) return gcklBoardAllDone(gcklBoardPhaseFromKey(ck));
            const sourceKey = getMarkerCompletionKeyFromObject(obj);
            if (!sourceKey) return false;
            return getMarkerTargetKeys(sourceKey).some(markerKeyDone);
        }
        function getObjectActionText(obj) {
            const ck = String(obj?.opts?.clinicalKey || '');
            const map = {
                'preop-site-marker': 'Taraf/bölge doğrulamasını yap',
                'consent-site': 'Onam ve dosya uyumunu doğrula',
                'preop-allergy': 'Alerji bilgisini doğrula',
                'npo-labs': 'NPO ve tetkik bilgisini doğrula',
                'signin': 'Sign-in doğrulamasını yap',
                'time-out': 'Time-out doğrulamasını yap',
                'ssc-board': 'GCKL görevlerini sırayla tamamla',
                'ssc-board-preop': 'Preop GCKL ilerlemesini izle',
                'ssc-board-intraop': 'İntraop GCKL ilerlemesini izle',
                'ssc-board-postop': 'Postop GCKL ilerlemesini izle',
                'count-board': 'Sayım teyidini yap',
                'handoff': 'SBAR devrini tamamla',
                'postop-drain-card': 'Kanama/dren izlemini değerlendir',
                'cpb-machine': 'KPB 5 faz kontrolünü yap',
                'cpb-phase-board': 'KPB fazlarını doğrula',
                'cell-saver': 'Hücre koruyucu güvenliğini doğrula',
                'postop-bleed-coag': 'Kanama/koagülopati eskalasyonu yap',
                'perfusionist': 'Perfüzyon iletişimini doğrula',
                'graft-prep-table': 'IMA/safen kondüit kalitesini doğrula',
                'esu-unit': 'ESU ve hasta plakasını doğrula',
                'smoke-evac': 'Duman tahliye hattını doğrula',
                'suction-smoke': 'Aspirasyon hattını doğrula',
                'waste-station': 'Atık ayrımını doğrula',
                'positioning-set': 'Pozisyon/bası korumasını doğrula',
                'light-timeout': 'Lamba + time-out güvenliğini doğrula',
                'cabg-device-audit': 'CABG cihaz denetimini tamamla',
                'cabg-anaesthesia-module': 'Kan kaybı + A-line + TXA planını doğrula',
                'cabg-temp-trigger': 'Sıcaklık eşiklerini doğrula'
            };
            return map[ck] || null;
        }
        function completeMarkerBySourceKey(sourceKey, pulse = false) {
            if (!sourceKey) return;
            const targetKeys = getMarkerTargetKeys(sourceKey);
            if (!targetKeys.length) return;
            setMarkerKeyDone(sourceKey, true);
            if (!three.markers) return;
            three.markers.forEach(m => {
                const mk = m.group?.userData?.markerClinicalKey || m.clinicalKey || null;
                if (!mk || !targetKeys.includes(mk)) return;
                m.visualDone = true;
                m.group.visible = true;
                if (pulse) {
                    m.pulseActive = true;
                    m.pulseStart = performance.now() * 0.001;
                    const idx = three.animated.findIndex(a => a.obj === m.group);
                    const pulseEntry = { obj: m.group, type: 'complete-pulse', start: m.pulseStart, duration: 1.2, halo: m.halo, core: m.core, baseY: m.baseY, marker: m };
                    if (idx >= 0) three.animated[idx] = pulseEntry;
                    else three.animated.push(pulseEntry);
                }
                updateMarkerLabelSprite(m, 1.0);
            });
            applyMarkerVisibility?.();
        }

        function markerShortLabel(clinicalKey, fallback) {
            const map = {
                'consent-site': 'Kimlik',
                'npo-labs': 'NPO',
                'preop-temp': 'Isı',
                'signin': 'Sign-in',
                'time-out': 'Time-out',
                'mayo-stand': 'Steril',
                'count-board': 'Sayım',
                'specimen': 'Numune',
                'handoff': 'SBAR',
                'pacu-airway': 'O₂',
                'postop-pain-score': 'Ağrı',
                'drain': 'Dren',
                'allergy': 'Alerji',
                'identity': 'Kimlik',
                'site': 'Taraf',
                'consent': 'Onam',
                'ssc-board': 'GCKL',
                'ssc-board-preop': 'GCKL',
                'ssc-board-intraop': 'GCKL',
                'ssc-board-postop': 'GCKL',
                'hypothermia': 'Isı',
                'bleeding': 'Kanama',
                'fall': 'Düşme',
                'education': 'Eğitim',
                'mobility': 'Mobil',
                'preop-allergy': 'Alerji',
                'preop-site-marker': 'Taraf',
                'preop-medrec': 'İlaç',
                'preop-crossmatch': 'KAN',
                'preop-vte': 'VTE',
                'preop-anxiety': 'Anksiyete',
                'preop-delirium': 'Deliryum',
                'preop-clipper': 'Clipper',
                'preop-transfer': 'Transfer',
                'prep': 'Hazırlık',
                'prep-storage': 'Dolap',
                'hand-hygiene': 'El',
                'baseline-vitals': 'Monitör',
                'iv-access': 'IV',
                'preop-nurse-3d': 'Hemşire',
                'family-relative-3d': 'Yakın',
                'family-area': 'Refakatçi',
                'headwall': 'Panel',
                'light-timeout': 'Lamba',
                'intraop-monitor': 'Monitör',
                'surgeon': 'Cerrah',
                'scrub-nurse-3d': 'Scrub',
                'assistant-scrub-nurse-3d': '2. Scrub',
                'sterile-table': 'Arka Masa',
                'cpb-machine': 'KPB',
                'cpb-phase-board': 'KPB Faz',
                'cell-saver': 'CellSaver',
                'postop-bleed-coag': 'Koagülasyon',
                'perfusion-console': 'Konsol',
                'perfusionist': 'Perfüzyonist',
                'anaesthesia-team': 'Anestezi',
                'circulating-nurse': 'Sirküle',
                'portable-carm': 'Skopi',
                'radiation-safety': 'Radyasyon',
                'esu-unit': 'ESU',
                'suction-smoke': 'Aspirasyon',
                'sharps-tray': 'Kesici',
                'airway-cart': 'Airway',
                'blood-warmer': 'Kan Isıtıcı',
                'warming-pressure': 'Isı',
                'positioning-set': 'Pozisyon',
                'fire-risk': 'Yangın',
                'or-hand-hygiene': 'El',
                'traffic-control': 'Trafik',
                'waste-flow': 'Atık',
                'pacu-monitor': 'Monitör',
                'oxygen': 'O₂',
                'postop-drain-card': 'Kanama',
                'postop-pca': 'Analjezi',
                'postop-spirometer': 'Solunum',
                'postop-orientation': 'Deliryum',
                'iv-pump-intraop': 'IV',
                'smoke-evac': 'Duman',
                'waste-station': 'Atık',
                'graft-prep-table': 'IMA/Safen',
                'cabg-device-audit': 'Cihaz',
                'cabg-anaesthesia-module': 'A-line/TXA',
                'cabg-temp-trigger': 'Isı Eşik',
                'light-timeout': 'Lamba'
            };
            const key = clinicalKey || '';
            if (map[key]) return map[key];
            const raw = (fallback || '').toString().trim();
            if (!raw) return 'Kontrol';
            const cleaned = raw
                .replace(/Görev:\s*/gi, '')
                .replace(/Kontrol:\s*/gi, '')
                .replace(/\s*\/\s*/g, '/')
                .trim();
            if (cleaned.length <= 10) return cleaned;
            return cleaned.split(/[\s\/·-]+/).filter(Boolean)[0].slice(0, 12) || 'Kontrol';
        }

        function markerVisibleText(baseText, priority, done) {
            const base = (baseText || 'Kontrol').toString().trim();
            // Modern etiket dili: vurgu renk ve accent ile verilir, metin bağırmaz.
            // Yalnızca tamamlanan etiketlerde küçük bir onay işareti korunur.
            if (done) return `${base} ✓`;
            return base;
        }

        function markerLabelPalette(priority, done) {
            const room = App?.currentRoom || 'intraop';
            const warmRoom = room === 'preop' || room === 'intraop';

            // Faz bazlı modern renk dili:
            // preop  = sıcak/kırmızı-bordo aile
            // intraop = preop ile aynı sıcak/kırmızı-bordo aile
            // postop = yeşil-emerald aile
            // completed = tüm fazlarda yeşil kalır ama ton oda karakterine göre hafif değişir

            if (done) {
                if (warmRoom) {
                    return {
                        bgTop: 'rgba(26, 54, 39, 0.90)',
                        bgBottom: 'rgba(17, 38, 28, 0.86)',
                        border: 'rgba(92, 201, 136, 0.74)',
                        text: '#ebfff2',
                        accent: '#5cc988',
                        glow: 'rgba(92, 201, 136, 0.22)'
                    };
                }
                if (room === 'postop') {
                    return {
                        bgTop: 'rgba(18, 60, 43, 0.90)',
                        bgBottom: 'rgba(12, 42, 31, 0.86)',
                        border: 'rgba(76, 184, 138, 0.74)',
                        text: '#e9fff1',
                        accent: '#4cb88a',
                        glow: 'rgba(76, 184, 138, 0.22)'
                    };
                }
                return {
                    bgTop: 'rgba(18, 44, 38, 0.88)',
                    bgBottom: 'rgba(14, 34, 30, 0.84)',
                    border: 'rgba(76,184,138,0.72)',
                    text: '#eafff1',
                    accent: '#4cb88a',
                    glow: 'rgba(76,184,138,0.20)'
                };
            }

            if (priority === 'critical') {
                if (warmRoom) {
                    return {
                        bgTop: 'rgba(59, 26, 35, 0.92)',
                        bgBottom: 'rgba(40, 17, 24, 0.88)',
                        border: 'rgba(230, 94, 113, 0.72)',
                        text: '#fff0f3',
                        accent: '#e65e71',
                        glow: 'rgba(230, 94, 113, 0.22)'
                    };
                }
                if (room === 'postop') {
                    return {
                        bgTop: 'rgba(53, 43, 19, 0.92)',
                        bgBottom: 'rgba(36, 28, 12, 0.88)',
                        border: 'rgba(225, 172, 92, 0.70)',
                        text: '#fff7e7',
                        accent: '#e1ac5c',
                        glow: 'rgba(225, 172, 92, 0.20)'
                    };
                }
                return {
                    bgTop: 'rgba(28, 33, 41, 0.92)',
                    bgBottom: 'rgba(19, 24, 31, 0.88)',
                    border: 'rgba(217,99,113,0.66)',
                    text: '#f6f8fb',
                    accent: '#d96371',
                    glow: 'rgba(217,99,113,0.18)'
                };
            }

            if (priority === 'passive') {
                if (warmRoom) {
                    return {
                        bgTop: 'rgba(56, 40, 47, 0.84)',
                        bgBottom: 'rgba(39, 28, 33, 0.82)',
                        border: 'rgba(178, 132, 145, 0.54)',
                        text: '#f1e5ea',
                        accent: '#b28491',
                        glow: 'rgba(178, 132, 145, 0.14)'
                    };
                }
                if (room === 'postop') {
                    return {
                        bgTop: 'rgba(38, 49, 42, 0.84)',
                        bgBottom: 'rgba(28, 36, 31, 0.82)',
                        border: 'rgba(122, 151, 133, 0.54)',
                        text: '#e5eee8',
                        accent: '#7a9785',
                        glow: 'rgba(122, 151, 133, 0.14)'
                    };
                }
                return {
                    bgTop: 'rgba(33, 43, 55, 0.84)',
                    bgBottom: 'rgba(24, 32, 42, 0.82)',
                    border: 'rgba(111,129,151,0.56)',
                    text: '#dde6ef',
                    accent: '#7e93a8',
                    glow: 'rgba(111,129,151,0.14)'
                };
            }

            // active markers
            if (room === 'preop') {
                return {
                    bgTop: 'rgba(74, 30, 40, 0.88)',
                    bgBottom: 'rgba(52, 22, 29, 0.84)',
                    border: 'rgba(205, 108, 124, 0.60)',
                    text: '#fff1f4',
                    accent: '#cd6c7c',
                    glow: 'rgba(205, 108, 124, 0.18)'
                };
            }
            if (room === 'postop') {
                return {
                    bgTop: 'rgba(24, 63, 46, 0.88)',
                    bgBottom: 'rgba(15, 43, 32, 0.84)',
                    border: 'rgba(97, 193, 142, 0.60)',
                    text: '#edfdf4',
                    accent: '#61c18e',
                    glow: 'rgba(97, 193, 142, 0.18)'
                };
            }
            return {
                bgTop: 'rgba(74, 30, 40, 0.88)',
                bgBottom: 'rgba(52, 22, 29, 0.84)',
                border: 'rgba(205, 108, 124, 0.60)',
                text: '#fff1f4',
                accent: '#cd6c7c',
                glow: 'rgba(205, 108, 124, 0.18)'
            };
        }

        function drawRoundedRect(ctx, x, y, w, h, r) {
            const rr = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + rr, y);
            ctx.lineTo(x + w - rr, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
            ctx.lineTo(x + w, y + h - rr);
            ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
            ctx.lineTo(x + rr, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
            ctx.lineTo(x, y + rr);
            ctx.quadraticCurveTo(x, y, x + rr, y);
            ctx.closePath();
        }

        function renderMarkerLabelCanvas(canvas, text, priority, done) {
            const ctx = canvas.getContext('2d');
            const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
            const fontPx = priority === 'critical' ? 25 : 22;
            ctx.font = `700 ${fontPx * dpr}px Inter, Arial, sans-serif`;
            const measure = ctx.measureText(text);
            const padLeft = 34 * dpr;
            const padRight = 18 * dpr;
            const padY = 8 * dpr;
            const w = Math.ceil(Math.max(124 * dpr, measure.width + padLeft + padRight));
            const h = Math.ceil((fontPx * dpr) + padY * 2 + 2 * dpr);
            canvas.width = Math.min(512 * dpr, w);
            canvas.height = h;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const p = markerLabelPalette(priority, done);
            const x = 3 * dpr;
            const y = 3 * dpr;
            const ww = canvas.width - 6 * dpr;
            const hh = canvas.height - 6 * dpr;
            const rr = 16 * dpr;
            // outer glow
            ctx.shadowColor = p.glow;
            ctx.shadowBlur = 14 * dpr;
            drawRoundedRect(ctx, x, y, ww, hh, rr);
            const grad = ctx.createLinearGradient(0, y, 0, y + hh);
            grad.addColorStop(0, p.bgTop);
            grad.addColorStop(1, p.bgBottom);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.shadowBlur = 0;
            // border
            ctx.lineWidth = 1.4 * dpr;
            ctx.strokeStyle = p.border;
            ctx.stroke();
            // subtle highlight line
            ctx.beginPath();
            ctx.moveTo(x + rr, y + 2 * dpr);
            ctx.lineTo(x + ww - rr, y + 2 * dpr);
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1.1 * dpr;
            ctx.stroke();
            // left accent bar
            drawRoundedRect(ctx, x + 8 * dpr, y + 8 * dpr, 10 * dpr, hh - 16 * dpr, 5 * dpr);
            ctx.fillStyle = p.accent;
            ctx.fill();
            // accent status dot
            ctx.beginPath();
            ctx.arc(x + 25 * dpr, y + hh / 2, 4.5 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = p.accent;
            ctx.fill();
            // text
            ctx.font = `700 ${fontPx * dpr}px Inter, Arial, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = p.text;
            ctx.fillText(text, x + 36 * dpr, y + hh / 2 + 1 * dpr);
        }

        function createMarkerLabelSprite(baseText, priority, done) {
            const canvas = document.createElement('canvas');
            const text = markerVisibleText(baseText, priority, done);
            renderMarkerLabelCanvas(canvas, text, priority, done);
            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: priority === 'passive' ? 0.58 : (priority === 'critical' ? 0.94 : 0.82),
                depthTest: false,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(material);
            const aspect = canvas.width / Math.max(1, canvas.height);
            const height = priority === 'critical' ? 0.162 : 0.146;
            sprite.scale.set(Math.min(0.98, height * aspect), height, 1);
            sprite.position.set(0, priority === 'critical' ? 0.23 : 0.195, 0);
            sprite.renderOrder = 1000;
            sprite.userData.markerLabelBase = baseText;
            sprite.userData.markerLabelText = text;
            sprite.userData.markerLabelCanvas = canvas;
            return sprite;
        }

        function updateMarkerLabelSprite(marker, opacityFactor = 1) {
            if (!marker || !marker.labelSprite) return;
            const done = markerVisualDone(marker);
            const priority = marker.priority || 'active';
            const text = markerVisibleText(marker.labelBaseText, priority, done);
            const sprite = marker.labelSprite;
            if (sprite.userData.markerLabelText !== text) {
                const canvas = sprite.userData.markerLabelCanvas || document.createElement('canvas');
                renderMarkerLabelCanvas(canvas, text, priority, done);
                if (sprite.material?.map) sprite.material.map.dispose?.();
                const texture = new THREE.CanvasTexture(canvas);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.needsUpdate = true;
                sprite.material.map = texture;
                sprite.material.needsUpdate = true;
                const aspect = canvas.width / Math.max(1, canvas.height);
                const height = priority === 'critical' ? 0.162 : 0.146;
                sprite.scale.set(Math.min(0.98, height * aspect), height, 1);
                sprite.userData.markerLabelCanvas = canvas;
                sprite.userData.markerLabelText = text;
            }
            if (sprite.material) {
                sprite.material.opacity = (priority === 'passive' ? 0.58 : (priority === 'critical' ? 0.94 : 0.82)) * opacityFactor;
                sprite.material.transparent = true;
            }
        }

        function statusMarker(x, y, z, task, label, opts = {}) {
            // opts: { role:'scrub'|'circulating'|'anaesthesia'|'pacu'|'preop'|'team', priority:'critical'|'active'|'passive', clinicalKey:string }
            const done = markerKeyDone(opts.clinicalKey || null);
            const isCritical = task && task.critical;
            const priority = opts.priority || (isCritical ? 'critical' : 'active');
            const role = opts.role || 'team';
            const forcePreopShortLabel = role === 'preop' && priority === 'active';
            // Eğitimsel netlik için intraoperatif odada obje etiketleri geri getirildi.
            // Öğrenci neyin ne olduğunu görmeli; tamamlandığında da etiket yeşile dönerek geri bildirim vermeli.
            const forceIntraopLabel = App.currentRoom === 'intraop';
            const showLabel = forceIntraopLabel || (priority === 'critical') || opts.showLabel === true || forcePreopShortLabel;
            const visibleLabel = opts.shortLabel || markerShortLabel(opts.clinicalKey, label);
            const g = groupAt(x, y, z);
            // Görsel karmaşayı azaltmak için halka/küre işaretleri kaldırıldı.
            // Marker artık yalnızca kısa klinik etiketle gösterilir; preop aktif destek etiketleri daha sakin görünür.
            const halo = null;
            const core = null;
            const labelSprite = showLabel ? createMarkerLabelSprite(visibleLabel, priority, done) : null;
            if (labelSprite) g.add(labelSprite);
            g.userData.markerTaskId = task?.id || null;
            g.userData.markerLabel = label;
            g.userData.markerVisibleLabel = visibleLabel;
            g.userData.markerPriority = priority;
            g.userData.markerRole = role;
            g.userData.markerClinicalKey = opts.clinicalKey || null;
            g.userData.markerShowLabel = showLabel;
            g.userData.markerBaseY = y;
            // Animation: etiketler hafifçe yüzer; kritikler ise çok hafif nabız verir.
            let animType, animOpts;
            if (done) {
                animType = 'float'; animOpts = { baseY: y, amp: 0.008, speed: 0.65 };
            } else if (priority === 'critical') {
                animType = 'float'; animOpts = { baseY: y, amp: 0.010, speed: 0.85 };
            } else if (priority === 'active') {
                animType = 'float'; animOpts = { baseY: y, amp: 0.008, speed: 0.70 };
            } else {
                animType = 'float'; animOpts = { baseY: y, amp: 0.012, speed: 0.7 };
            }
            addAnimated(g, animType, animOpts);
            three.markers.push({ group: g, task, halo, core, labelSprite, labelBaseText: visibleLabel, role, priority, showLabel, baseHaloOpacity: 0, baseEmissiveK: 0, baseY: y, labelOnly: true });
            addDecor(g);
            return g;
        }

        /* ============================================================
           Marker visibility / focus mode / role focus controller
           ============================================================ */
        function getCurrentRoleFocus() {
            const room = App.currentRoom;
            if (room === 'preop') return App.preopRoleFocus || 'all';
            if (room === 'postop') return App.postopRoleFocus || 'all';
            return App.intraopRoleFocus || 'all';
        }
        function setCurrentRoleFocus(value) {
            const room = App.currentRoom;
            if (room === 'preop') App.preopRoleFocus = value;
            else if (room === 'postop') App.postopRoleFocus = value;
            else App.intraopRoleFocus = value;
        }
        function markerMatchesRoleFocus(markerRole, focus) {
            if (!focus || focus === 'all') return true;
            if (!markerRole) return true;
            if (markerRole === 'team') return true; // team markers always relevant
            return markerRole === focus;
        }
        function applyMarkerVisibility() {
            if (!three.markers || !three.markers.length) return;
            const focusMode = App.focusMode || 'task';
            const roleFocus = getCurrentRoleFocus();
            three.markers.forEach(m => {
                const done = markerVisualDone(m);
                const priority = m.priority || 'active';
                let visible = true;
                let opacityFactor = 1;
                // 1. Tamamlanan markerlar görünür kalır.
                // Yalnızca biten görevin etiketi yeşile döner ve sahnede kalır.
                if (done && !m.pulseActive) {
                    // Tamamlanan etiketler görünür kalmalı; öğrenci yaptığı işlemi yeşil etiket ile fark etmeli.
                    visible = true;
                    opacityFactor = priority === 'critical' ? 0.94 : 0.88;
                }
                // 2. Focus mode filtering
                if (!done) {
                    if (focusMode === 'safety') {
                        // Sadece kritik görünsün
                        if (priority !== 'critical') visible = false;
                    } else if (focusMode === 'task') {
                        // Kritik + aktif görünsün, pasif gizlensin
                        if (priority === 'passive') visible = false;
                    } else if (focusMode === 'free') {
                        // Hepsi görünsün, pasifler soluk
                        if (priority === 'passive') opacityFactor = 0.55;
                    }
                }
                // 3. Role focus filtering (overrides visibility into "soft")
                if (visible && !done && roleFocus && roleFocus !== 'all') {
                    if (!markerMatchesRoleFocus(m.role, roleFocus)) {
                        // Hide entirely instead of soft-fade — keeps cognitive load low
                        visible = false;
                    }
                }
                // Apply
                m.group.visible = visible;
                if (visible) {
                    if (m.halo && m.halo.material) {
                        m.halo.material.opacity = (m.baseHaloOpacity || 0.85) * opacityFactor;
                    }
                    if (m.core && m.core.material) {
                        m.core.material.opacity = opacityFactor;
                        m.core.material.transparent = opacityFactor < 1;
                    }
                    updateMarkerLabelSprite(m, opacityFactor);
                }
            });
            // Update marker colors to current state (was previously inline elsewhere)
            updateMarkerColors();
        }
        function updateMarkerColors() {
            if (!three.markers) return;
            three.markers.forEach(m => {
                const done = markerVisualDone(m);
                const priority = m.priority || 'active';
                let c;
                if (done) c = 0x4cb88a;
                else if (priority === 'critical') c = 0xd96371;
                else if (priority === 'active') c = 0x5cc4d6;
                else c = 0x6f8197;
                if (m.halo && m.halo.material) {
                    m.halo.material.color.setHex(c);
                    if (m.halo.material.emissive) m.halo.material.emissive.setHex(c);
                }
                if (m.core && m.core.material) {
                    m.core.material.color.setHex(c);
                    if (m.core.material.emissive) m.core.material.emissive.setHex(c);
                }
                updateMarkerLabelSprite(m, m.group.visible ? 1 : 0);
            });
        }
        /* Trigger 2-second green pulse on a marker, then it fades out */
        function pulseMarkerComplete(taskId, sourceKey = null) {
            if (!three.markers || !taskId) return;
            const candidates = three.markers.filter(mm => mm.task && mm.task.id === taskId);
            if (!candidates.length) return;
            let m = null;
            if (sourceKey) {
                m = candidates.find(mm => markerMatchesCompletionKey(mm, sourceKey));
            }
            // Eğer kaynak obje yoksa veya eşleşme bulunamazsa toplu yeşile dönme yok:
            // yalnızca tek aday varsa onu; birden çok aday varsa görünür ve henüz tamamlanmamış ilk etiketi işaretle.
            if (!m) {
                if (candidates.length === 1) m = candidates[0];
                else m = candidates.find(mm => mm.group?.visible && !markerVisualDone(mm)) || null;
            }
            if (!m) return;
            const markerKey = m.group?.userData?.markerClinicalKey || null;
            if (markerKey) setMarkerKeyDone(markerKey, true);
            m.visualDone = true;
            m.pulseActive = true;
            m.pulseStart = performance.now() * 0.001;
            m.group.visible = true;
            // Replace any existing animation entry with a complete-pulse type
            const idx = three.animated.findIndex(a => a.obj === m.group);
            const pulseEntry = { obj: m.group, type: 'complete-pulse', start: m.pulseStart, duration: 1.4, halo: m.halo, core: m.core, baseY: m.baseY, marker: m };
            if (idx >= 0) three.animated[idx] = pulseEntry;
            else three.animated.push(pulseEntry);
            updateMarkerLabelSprite(m, 1.0);
        }

