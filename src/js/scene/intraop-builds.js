/* ============================================================
   scene/intraop-builds.js — İntraop Sahne Profili & CABG/Ortho/Lap/Trauma
   ------------------------------------------------------------
   Bu modül intraoperatif sahnenin "strangler fig" dispatcher'ını
   ve profile-spesifik sahne kurucularını içerir:

     • Profil seçici:
         surgicalSceneProfile(patient) → 'cabg' | 'ortho' | 'lap' | 'trauma'

     • Ortak çekirdek (29 obje):
         buildIntraopCommonCore — tüm intraop sahnelere temel donanım

     • V2 premium ekipmanlar (CABG profili için):
         buildAirwayCartV2, buildCPBMachineV2, buildAnaesthesiaWorkstationV2
         buildAnesthesiaPendantV1, buildCPBPhaseBoardV1
         cabgTempTriggerSeverity
         buildCABGAnaesthesiaDepthPanelV1, buildCABGTemperatureTriggerPanelV1
         buildCellSaverV1, buildCABGDeviceAuditPanelV1

     • Profile sahneleri:
         buildIntraopCABG    — KPB, perfüzyon konsolu, greft masası vb.
         buildIntraopOrtho   — ortopedi (C-arm + radyasyon seti)
         buildIntraopLap     — laparoskopik kolesistektomi
         buildIntraopTrauma  — acil nörotrauma

     • Dispatcher wrapper:
         __nk_original_buildIntraop = buildIntraop;
         buildIntraop = function() { ... profile'a göre yönlendir ... };

   Bağımlılıklar:
     - THREE                              (global)
     - var three, var App                 (scene/engine.js)
     - mat, box, cyl, sphere, prepMesh    (scene/engine.js)
     - groupAt, addObj, addDecor          (scene/engine.js)
     - statusMarker, taskByKeywords       (scene/markers.js — function declarations
                                            are hoisted globally; çağrı zamanında
                                            mevcut olacak)
     - buildIntraop                       (scene/equipment.js — fallback monolit;
                                            wrapper bu sembolü parse anında
                                            yakalar, bu yüzden equipment.js'TEN
                                            SONRA yüklenmelidir)
     - buildBed, buildMonitor, buildOpTable, vb. (scene/patient-body.js + equipment.js)

   Yükleme sırası:
     scene/engine.js → scene/patient-body.js → scene/equipment.js
     → scene/intraop-builds.js → core/main-app.js → scene/markers.js
   ============================================================ */

        /* ===================== İO-1: surgicalSceneProfile + Intraop dispatcher iskeleti =====================
         * Hedef: vakanın specialty alanından bir cerrahi sahne profili türet ve buildIntraop'u strangler-fig
         * deseniyle sarmala. Profile başına özel sahne fonksiyonu varsa onu çağır, yoksa orijinal monolite
         * fallback. CABG İO-2'de devreye alındı; ortho/lap/trauma henüz orijinal sahneye düşer.
         */
        function surgicalSceneProfile(patient) {
            if (!patient || !patient.specialty) return 'cabg';
            const map = { cardio: 'cabg', ortho: 'ortho', general: 'lap', trauma: 'trauma' };
            return map[patient.specialty] || 'cabg';
        }

        /* ===================== İO-2: buildIntraopCommonCore + buildIntraopCABG =====================
         * Hedef: 35 obje monoliti, common-core (29) + CABG-özel (6) olarak ayır. Orijinal buildIntraop
         * GÖVDESİ DEĞİŞMEDİ (line ~14935-15018) — ortho/lap/trauma hâlâ ona düşer. Sadece CABG yeni
         * zincire geçer.
         *
         * CABG-özel 6 obje (clinicalKey):
         *   assistant-scrub-nurse-3d, cpb-machine, perfusion-console, perfusionist,
         *   blood-warmer, graft-prep-table
         *
         * CABG'de OLMAYACAK 2 obje (orijinalde vardı, ortho profiline taşınacak — şimdi sadece atla):
         *   portable-carm, radiation-safety
         *
         * Doğrulama:
         *   App.currentPatient = CASES.cabg_main; App.currentRoom = 'intraop'; buildSceneForRoom();
         *   -> sahne kurulmalı, skopi (C-arm) ve radyasyon seti GÖRÜNMEMELI
         *   App.currentPatient = CASES.ortho_main; buildSceneForRoom();
         *   -> sahne kurulmalı, skopi ve radyasyon seti hâlâ GÖRÜNMELI (orijinal buildIntraop'a düşer)
         */
        function buildIntraopCommonCore(options = {}) {
            // options.skipMainTable: true → CABG branch'i kendi entegre masa+hasta
            // objesini ekleyeceği için bu fonksiyon eski genel masa/hasta objesini
            // ve onun '01 · Hasta/Masa' / '02 · Lamba' marker çiftini atlasın.
            // (Diğer 28 obje + marker aynen eklenir.)
            const signIn = taskByKeywords(['sign-in', 'alerji', 'anestezi']);
            const timeout = taskByKeywords(['time-out', 'ekip tanıtımı', 'kimlik/işlem']);
            const sterile = taskByKeywords(['steril', 'antibiyotik']);
            const count = taskByKeywords(['sayım', 'spanç', 'iğne', 'alet']);
            const specimen = taskByKeywords(['numune', 'etiket']);
            const warming = taskByKeywords(['ısıtma', 'basınç', 'koruma']);
            const criticalAlarm = !taskDone(signIn) || !taskDone(timeout);

            addDecor(buildIntraopZoneGuides());

            // OR altyapısı — steril çekirdek girişi ve periferik atık akışı
            addDecor((function(){ const _gate = buildSterileBoundaryGate(3.90, 0, 2.05); _gate.rotation.y = -Math.PI / 3; return _gate; })());
            addObj((function(){ const _iv = buildIV(-2.25, 0, -1.05); _iv.rotation.y = Math.PI / 10; return _iv; })(), 'A2 · IV Pompa ve Sıvı Standı', 'Baş uçta anestezi alanına bağlı IV pompa ve sıvı standı; ilaç/sıvı akışı anestezi ekibi tarafından erişilebilir ama dolaşım hattını kapatmayacak periferik hatta tutulur.', { taskId: signIn?.id, clinicalKey: 'iv-pump-intraop' });
            addObj((function(){ const _ws = buildWasteStationV151(8.08, 0, 0.45); _ws.rotation.y = -Math.PI / 2; return _ws; })(), 'C4 · Atık ve Kesici-Delici İstasyonu', 'Sirküle hattında konumlanan dört renkli tekerlekli atık ayrıştırma istasyonu; kırmızı tıbbi atık, yeşil genel/destek atığı, sarı kesici-delici ve mavi temiz/geri dönüşüm destek akışı tek sırada okunur. Steril çekirdeğin hemen dışında, erişilebilir ama dolaşımı bozmayacak konumda tutulur.', { taskId: count?.id, clinicalKey: 'waste-station' });

            // --- Ana masa + hasta (CABG branch'inde atlanır; CABG kendi obj'ini ekler) ---
            if (!options.skipMainTable) {
                addObj(buildHybridOpTableV151(0.10, 0, 0.00), 'H1 · Ameliyat Masası ve Hasta', 'Ameliyat masası merkezi aksa yerleştirildi. Baş uç anesteziye açık, göğüs çevresi steril çekirdek, lateral alanlar ise dolaşım ve perfüzyon için ayrıldı. Hasta üzerinde alt vücut forced-air ısıtma battaniyesi ayrı ısıtma ünitesinden beslenir; basınç yaralanması koruma pedleri (topuk, dirsek, sakrum) masaya entegre edilmiştir. Görevler: time-out, normotermi (>36°C) sürdürülmesi, basınç noktalarının her 30 dk değerlendirilmesi.', { taskId: timeout?.id, clinicalKey: 'time-out', severity: 'danger' });
            }
            addObj(buildSurgicalLight(0.10, 0, 0.00), 'H2 · Cerrahi Lamba', 'Cerrahi lamba sternotomi sahasının tam üstünde tutulur; time-out tamamlanmadan kesi akışı başlatılmaz.', { taskId: timeout?.id, clinicalKey: 'light-timeout' });
            addObj(buildAnaesthesiaWorkstationV2(-3.85, 0, -0.10), 'A1 · Anestezi İstasyonu', 'Üst düzey entegre anestezi platformu — GE Aisys CS²/Dräger Perseus A500/Mindray A9 referanslı premium ünite. Anestezi cihazı + entegre hasta monitörü tek mobil platform; sağ yanda monitör boom direği ve hareketli kol uzanır, ucunda büyük hemodinami ekranı + sağ yan modül yer alır. 3 vaporizör (Sevo/Des/Iso renkli LED), çift ekran (vaporizör/akış ölçer + ventilatör grafiği), gaz silindirleri (O₂ yeşil tepelik), solunum devresi ve 3 katmanlı ilaç çekmeceleri içerir. İki ayrı etikette gösterilir.', { taskId: signIn?.id, clinicalKey: 'signin', severity: 'danger' });
                        if (!options.cabgLayout) {
                addObj(buildDoctorCharacter3D(0.34, 0, 0.82, 0x5a8f68), 'S1 · Cerrah', 'Cerrah operatif saha hizasında.', { taskId: timeout?.id, clinicalKey: 'surgeon' });
                addObj(buildNurseCharacter3D(-0.18, 0, -0.52), 'S2 · Scrub Hemşiresi', 'Premium scrub hemşiresi.', { taskId: count?.id, clinicalKey: 'scrub-nurse-3d' });
                addObj(buildMayoStandV151(0.42, 0, -1.02), 'S3 · Mayo Masası', 'Premium over-table Mayo stand.', { taskId: sterile?.id, clinicalKey: 'mayo-stand', severity: 'danger' });
            }
            addObj(buildHuman(...(options.cabgLayout ? [-1.45, 0, 0.30, 'anaesthesia', 0x6f9fd8] : [-1.72, 0, 0.82, 'anaesthesia', 0x6f9fd8])), 'A5 · Anestezi Ekibi', 'Anestezi ekibi baş uçta ön tarafta — cihaz, monitör ve hasta görüş üçgeninin merkezinde; havayolu yönetimi + sürekli izlem için optimum konum.', { taskId: signIn?.id, clinicalKey: 'anaesthesia-team' });
            addObj(buildHuman(7.10, 0, 1.65, 'circulating', 0x9b89c4), 'C1 · Sirküle Hemşire', 'Sirküle hemşire steril çekirdeğin dışında, sayım panosu, numune hattı ve atık akışını aynı anda görebilecek merkezi bir periferik akış noktasına alındı.', { taskId: count?.id, clinicalKey: 'circulating-nurse' });
            addObj((function(){ const _cb = buildCountBoard(6.20, 0, 5.05); _cb.rotation.y = (340 * Math.PI / 180); return _cb; })(), 'C2 · Sayım Panosu', 'Sayım panosu — AORN üçlü doğrulama protokolü: (1) Sirküle hemşire spanç-iğne-alet sayar ve panoya/kayda geçirir, (2) Scrub hemşire steril alanda görsel-sözel doğrulama yapar, (3) Cerrah kavite kapatma öncesi sayım uygunluğunu teyit eder ve kapatma izni ister. Sayım uyumsuzluğunda kavite kapatılmaz; sahada arama, ek sayım, gerekirse intraoperatif radyografi yapılır.', { taskId: count?.id, clinicalKey: 'count-board', severity: 'danger' });
            addObj(buildESUCartV2(2.05, 0, 1.45), 'E1 · Elektrokoter (ESU) ve Hasta Plakası', 'Valleylab™ FT10 Energy Platform (Medtronic) — 2025 piyasa altın standardı elektrokoter. 3 dokunmatik ekran (Cut/Coag/Bipolar+LigaSure), Smart Connector LED reader 5 portu (M1/M2/BP/LS/NE), TissueFect sensing, REM hasta plakası yeşil aktif LED, aktif elektrod kalemi (mavi gövde + krom uç), 2 pedallı ayak kontrolü (sarı CUT + mavi COAG) ve acil durma mantar butonu. Yangın üçgeni uyarısı: oksijen + yanıcı antiseptik + koter — birlikte risk oluşturur.', { taskId: timeout?.id, clinicalKey: 'esu-unit' });
            addObj(buildSuctionSmokeUnitV2(2.55, 0, -0.60), 'E2 · Aspirasyon (Kapalı Sistem)', 'Stryker Neptune 3 Rover (en gelişmiş cerrahi aspirasyon) — closed waste system, 30L atık haznesi (BIOHAZARD etiketli), HIGH-VAC + LOW-VAC çift mod ekranı, 4 mode butonu (Suction/Smoke/Auto/Standby), 6 segment hacim sensorü LED skala, 2 yan bypass kavanozu (kırmızı sıvı seviyesi), Smart Docking Station (turkuaz LED halka), kalın gri vakum hortumu ve acil durma butonu. Stryker sarı brand strip + AORN/OSHA compliant.', { taskId: timeout?.id, clinicalKey: 'suction-smoke' });
            addObj(buildSmokeEvacUnit(2.55, 0, 0.85), 'E3 · Cerrahi Duman Tahliye', 'Megadyne Mega Vac Plus (Ethicon) — koter dumanı tahliye sistemi. ULPA filtre %99.999 efficiency (şeffaf cam pencereden filtre durumu görünür — yeşil LED temiz/sarı orta/kırmızı değiştirme), 3 mode (Auto/Manual/Standby), AUTO mode da ESU ile sync (mor SYNC LED + sarı şimşek), 10 segment fan hız bar (Low to High), mor 7/8 inç smoke tahliye hortumu ve ayak pedalı kontrol kablosu, arka 5 slat hava çıkış ızgarası, alt yeşil power LED. Ethicon mor brand strip. AORN cerrahi duman güvenliği standartları + OSHA uyumlu.', { taskId: timeout?.id, clinicalKey: 'smoke-evac' });
            addObj(buildAirwayCartV151(-5.20, 0, 1.22), 'A3 · Anestezi Airway/İlaç Modülü', 'Entegre airway ve kan/sıvı ısıtıcı platformu — sol modül: 3 katmanlı ilaç çekmeceleri (renk kodlu LED — kırmızı acil/sarı kontrol/yeşil ek), laringoskop bıçağı, endotrakeal tüpler, ambu/BVM. Sağ modül menteşe ile bağlı kan/sıvı ısıtıcı (38°C aktif gösterge, kan torbası + SF torbası, 2 IV hattı). İki ayrı etikette gösterilir; menteşe LED yeşil = aktif bağlantı.', { taskId: signIn?.id, clinicalKey: 'airway-cart' });
            addObj((function(){ const _sp = buildSpecimenStationV151(7.90, 0, 1.65); _sp.rotation.y = -Math.PI/2; return _sp; })(), 'C3 · Numune Bölümü', 'Modern numune işleme istasyonu — 4 farklı tipte numune kabı (formalin/frozen/kültür/sitoloji), etiket basım modülü, hasta-örnek doğrulama LED panosu, soğuk transport kutusu ve biohazard atık kovacığı tek tezgahta toplandı. AORN/CDC numune güvenliği prensiplerine uygun olarak hasta-doğru örnek-doğru etiket eşleştirmesi tek noktadan yönetilir; tehlike izolasyon halkası steril akışı korur.', { taskId: specimen?.id, clinicalKey: 'specimen', severity: 'danger' });
            addObj((function(){ const _ps = buildPositioningSetV151(-7.90, 0, 2.50); _ps.rotation.y = Math.PI/2; return _ps; })(), 'C5 · Pozisyonlama ve Basınç Destekleri', 'Modern 4 raflı dikey destek istasyonu — baş/oksipital jel halkalar, topuk koruma foamları, kol/dirsek tahtaları + sinir koruma pedleri, lateral pozisyon kemerleri ve Braden risk skalası referans paneli (kırmızı/sarı/yeşil LED) tek dikey gövdede toplandı. Anestezi alanı ile duvar arasındaki müsait alana taşınarak sahne kalabalığı azaltıldı; basınç yaralanması önleme akışı tek noktadan yönetilir.', { taskId: warming?.id, clinicalKey: 'positioning-set' });
            addObj(buildChecklistBoard(-6.90, 0, 5.05), 'R1 · GCKL Panosu', 'Güvenli Cerrahi Kontrol Listesi panosu; sol ön güvenlik lideri olarak sign-in, time-out ve sign-out adımlarını görünür kılar. Profilaksi, sayım ve numune güvenliği bu panodaki toplu GCKL görevleri içinde izlenir.', { taskId: timeout?.id, clinicalKey: 'ssc-board-intraop' });

            // --- 29 ortak statusMarker ---
            statusMarker(-3.00, 1.90, -0.05, signIn,  'Sign-in',     { role:'anaesthesia', priority:'critical', clinicalKey:'signin', shortLabel:'Sign-in' });
            statusMarker(0.10, 1.78, 0.00,   timeout, 'Time-out',    { role:'team',        priority:'critical', clinicalKey:'time-out', shortLabel:'Time-out' });
            statusMarker(0.42, 1.42, -1.20,  sterile, 'Mayo', { role:'scrub',       priority:'critical', clinicalKey:'mayo-stand', shortLabel:'Steril Alet' });
            statusMarker(0.10, 1.30, 0.00, timeout, 'Hasta/Masa', { role:'team', priority:'critical', clinicalKey:'time-out', shortLabel:'Hasta/Masa' });
            statusMarker(0.10, 3.20, 0.00, timeout, 'Lamba', { role:'team', priority:'active', clinicalKey:'light-timeout', shortLabel:'Lamba' });
            statusMarker(-3.85, 1.68, -0.10, signIn, 'Anestezi Cihazı', { role:'anaesthesia', priority:'active', clinicalKey:'signin', shortLabel:'Anestezi' });
                        statusMarker(0.34, 1.70, 0.82, timeout, 'S1 · Cerrah', { role:'team', priority:'active', clinicalKey:'surgeon', shortLabel:'Cerrah' });
            statusMarker(-0.18, 1.70, -0.52, count, 'Scrub', { role:'scrub', priority:'active', clinicalKey:'scrub-nurse-3d', shortLabel:'Scrub' });
            statusMarker(7.10, 1.58, 1.65, count, 'Sirküle', { role:'circulating', priority:'active', clinicalKey:'circulating-nurse', shortLabel:'Sirküle' });
            statusMarker(2.05, 1.30, 1.45, timeout, 'Koter (ESU)', { role:'team', priority:'active', clinicalKey:'esu-unit', shortLabel:'Koter' });
            statusMarker(2.55, 1.55, -0.60, timeout, 'Aspirasyon', { role:'team', priority:'active', clinicalKey:'suction-smoke', shortLabel:'Aspirasyon' });
            statusMarker(2.55, 1.10, 0.85, timeout, 'Duman Tahliye', { role:'team', priority:'active', clinicalKey:'smoke-evac', shortLabel:'Duman' });
            statusMarker(-5.52, 1.28, 1.22, signIn, 'Airway/İlaç', { role:'anaesthesia', priority:'active', clinicalKey:'airway-cart', shortLabel:'Airway' });
            statusMarker(-4.88, 1.28, 1.22, signIn, 'Kan/Sıvı Isıtıcı', { role:'anaesthesia', priority:'active', clinicalKey:'blood-warmer', shortLabel:'Kan Isıt.' });
            statusMarker(-7.90, 1.56, 2.50, warming, 'Pozisyon', { role:'team', priority:'active', clinicalKey:'positioning-set', shortLabel:'Pozisyon' });
            statusMarker(-6.90, 1.54, 5.05,  timeout, 'GCKL', { role:'team', priority:'critical', clinicalKey:'ssc-board-intraop', shortLabel:'GCKL' });
            statusMarker(6.20, 1.66, 5.05,  count,   'Sayım',       { role:'team', priority:'critical', clinicalKey:'count-board', shortLabel:'Sayım' });
            statusMarker(7.90, 1.62, 1.65,   specimen,'Numune Bölümü',      { role:'circulating', priority:'critical',   clinicalKey:'specimen', shortLabel:'Numune' });
            statusMarker(-2.25, 1.50, -1.05, signIn, 'IV Pompa', { role:'anaesthesia', priority:'active', clinicalKey:'iv-pump-intraop', shortLabel:'IV' });
            statusMarker(8.08, 1.50, 0.45, count, 'Atık/Sharps', { role:'circulating', priority:'active', clinicalKey:'waste-station', shortLabel:'Atık' });
        }

        function buildAirwayCartV2(x, y, z) {
            // ============================================================
            // ULTRA-PREMIUM AIRWAY/DRUG + BLOOD WARMER MODULE v2.0
            // ESU V2 + Anestezi V2 + KPB V2 ile aynı premium materyal dilini kullanır.
            // İki modüllü entegre platform:
            //   - SOL MODÜL: İlaç dolabı (4 katmanlı renk kodlu LED çekmeceler)
            //                + airway aletleri (laringoskop, ETT, ambu — üst raf)
            //   - SAĞ MODÜL: Kan/sıvı ısıtıcı (38°C aktif, 2 IV hat, kan + SF torbaları)
            // ============================================================
            const g = groupAt(x, y, z);
            const anodGray = 0x3a4754;
            const anodDark = 0x222a33;
            const brushAlu = 0xb6bfc8;
            const accentTeal = 0x2dd4bf;
            const accentBlue = 0x4d9ef0;
            const accentRed = 0xe04646;
            const accentYellow = 0xfbbf24;
            const accentGreen = 0x4cb88a;
            const accentPurple = 0x9c5cd9;
            const screenDark = 0x0a0e14;
            const glassClear = 0xc7dbe6;

            // ============================================================
            // 4 PREMIUM TEKERLEK + ALT TABAN
            // ============================================================
            [-0.40, 0.40].forEach(xx => [-0.24, 0.24].forEach(zz => {
                const wh = cyl(0.046, 0.046, 0.034, 0x12161c, xx, 0.046, zz,
                    { seg: 18, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                const hub = cyl(0.022, 0.022, 0.038, brushAlu, xx, 0.046, zz,
                    { seg: 14, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
                g.add(cyl(0.008, 0.008, 0.010, accentGreen, xx, 0.046,
                    zz + (zz > 0 ? 0.050 : -0.050),
                    { seg: 10, emissive: accentGreen, emissiveIntensity: 0.65 }));
            }));

            // Ana taban (anodize koyu)
            g.add(box(0.96, 0.080, 0.56, anodDark, 0, 0.040, 0,
                { metalness: 0.55, roughness: 0.32 }));
            // Üst LED accent şeridi (turkuaz, perimetric)
            g.add(box(0.92, 0.005, 0.54, accentTeal, 0, 0.085, 0,
                { emissive: accentTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // SOL MODÜL — İLAÇ DOLABI (anodize alu kasa, 4 çekmece)
            // ============================================================
            // Ana kasa (sol yarı)
            g.add(box(0.46, 0.78, 0.50, anodGray, -0.24, 0.47, 0,
                { metalness: 0.55, roughness: 0.30 }));
            // Ön panel brushed alu
            g.add(box(0.44, 0.76, 0.005, brushAlu, -0.24, 0.47, 0.253,
                { metalness: 0.70, roughness: 0.22 }));
            // Yan ventilasyon (sol kenar, 3 ince çizgi)
            for (let i = 0; i < 3; i++) {
                g.add(box(0.001, 0.14, 0.005, anodDark, -0.466, 0.50 - i * 0.08, 0,
                    { metalness: 0.30, roughness: 0.50 }));
            }
            // Yan turkuaz LED status şeridi
            g.add(box(0.001, 0.40, 0.008, accentTeal, -0.465, 0.47, 0.10,
                { emissive: accentTeal, emissiveIntensity: 0.65,
                  transparent: true, opacity: 0.85 }));

            // 4 İLAÇ ÇEKMECESİ — renk kodlu LED handle'lar
            [
                { y: 0.18, c: accentRed,    label: 'A' },  // ACİL
                { y: 0.32, c: accentYellow, label: 'B' },  // KONTROL
                { y: 0.46, c: accentGreen,  label: 'C' },  // RUTİN
                { y: 0.60, c: accentBlue,   label: 'D' }   // EK
            ].forEach(d => {
                // Çekmece ön yüzü brushed alu
                g.add(box(0.40, 0.085, 0.012, brushAlu, -0.24, d.y, 0.260,
                    { metalness: 0.70, roughness: 0.22 }));
                // Üst kenar siyah accent
                g.add(box(0.40, 0.005, 0.014, anodDark, -0.24, d.y + 0.045, 0.262,
                    { metalness: 0.55, roughness: 0.30 }));
                // Renk kodlu LED handle
                g.add(box(0.10, 0.020, 0.008, d.c, -0.24, d.y, 0.267,
                    { emissive: d.c, emissiveIntensity: 0.75,
                      transparent: true, opacity: 0.90 }));
                // Sol yan etiket
                g.add(box(0.025, 0.025, 0.006, d.c, -0.43, d.y, 0.265,
                    { emissive: d.c, emissiveIntensity: 0.85 }));
                // Çekmece kilit göstergesi (mini LED — sağ alt)
                g.add(cyl(0.005, 0.005, 0.004, accentGreen, -0.06, d.y, 0.265,
                    { seg: 8, emissive: accentGreen, emissiveIntensity: 0.85 }));
            });

            // Üst raf (airway aletleri için cam koruyucu)
            g.add(box(0.44, 0.020, 0.50, anodDark, -0.24, 0.870, 0,
                { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.42, 0.005, 0.48, accentTeal, -0.24, 0.882, 0,
                { emissive: accentTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // === Üst raf üzerinde airway aletleri (görsel temsil) ===
            // Laringoskop sapı (krom)
            g.add(cyl(0.020, 0.020, 0.14, brushAlu, -0.36, 0.96, 0.10,
                { seg: 14, metalness: 0.78, roughness: 0.16 }));
            g.add(box(0.040, 0.020, 0.08, anodDark, -0.36, 1.05, 0.08,
                { metalness: 0.55, roughness: 0.30 }));
            // Laringoskop bıçağı LED (yeşil — Mac 3 simülasyonu)
            g.add(box(0.014, 0.005, 0.06, accentGreen, -0.36, 1.060, 0.090,
                { emissive: accentGreen, emissiveIntensity: 0.85 }));
            // ETT tüpler (3 farklı boy — turkuaz silikon)
            [-0.18, -0.10, -0.02].forEach((xx, i) => {
                const lengths = [0.16, 0.18, 0.20];
                g.add(cyl(0.007, 0.007, lengths[i], glassClear, -0.30 + xx, 0.96, 0,
                    { seg: 12, emissive: 0x88c9e0, emissiveIntensity: 0.10,
                      metalness: 0.04, roughness: 0.30,
                      transparent: true, opacity: 0.65 }));
                g.add(cy(0.009, 0.009, 0.012, brushAlu, -0.30 + xx, 0.96 + lengths[i] / 2 + 0.006, 0,
                    14, 0, 0, 0));
            });
            // Ambu / BVM (sağ üst — siyah balon + maske)
            g.add(sphere(0.040, anodDark, -0.10, 0.96, 0.10,
                { roughness: 0.60, metalness: 0.04 }));
            g.add(cyl(0.022, 0.030, 0.020, glassClear, -0.10, 0.96, 0.150,
                { seg: 14, emissive: 0x88c9e0, emissiveIntensity: 0.10,
                  metalness: 0.04, roughness: 0.20,
                  transparent: true, opacity: 0.55 }));

            // ============================================================
            // ARA MENTEŞE (sol modül + sağ modül bağlantısı, lambada stilinde)
            // ============================================================
            g.add(cyl(0.024, 0.024, 0.40, brushAlu, 0.00, 0.55, -0.20,
                { seg: 14, metalness: 0.78, roughness: 0.14 }));
            // Mafsal topu üst
            g.add(sphere(0.028, anodGray, 0.00, 0.76, -0.20,
                { metalness: 0.62, roughness: 0.30 }));
            // Mafsal accent halka
            const _mfRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.026, 0.0024, 8, 18),
                mat(accentTeal, { emissive: accentTeal, emissiveIntensity: 0.55 })
            );
            _mfRing.position.set(0.00, 0.74, -0.20);
            _mfRing.rotation.x = Math.PI / 2;
            g.add(_mfRing);
            // Mafsal topu alt
            g.add(sphere(0.028, anodGray, 0.00, 0.34, -0.20,
                { metalness: 0.62, roughness: 0.30 }));
            const _mfRing2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.026, 0.0024, 8, 18),
                mat(accentTeal, { emissive: accentTeal, emissiveIntensity: 0.55 })
            );
            _mfRing2.position.set(0.00, 0.32, -0.20);
            _mfRing2.rotation.x = Math.PI / 2;
            g.add(_mfRing2);

            // ============================================================
            // SAĞ MODÜL — KAN/SIVI ISITICI (Belmont/Level-1 referansı)
            // ============================================================
            // Ana kasa (sağ yarı)
            g.add(box(0.46, 0.78, 0.50, anodGray, 0.24, 0.47, 0,
                { metalness: 0.55, roughness: 0.30 }));
            // Ön panel brushed alu
            g.add(box(0.44, 0.76, 0.005, brushAlu, 0.24, 0.47, 0.253,
                { metalness: 0.70, roughness: 0.22 }));
            // Yan ventilasyon (sağ kenar)
            for (let i = 0; i < 3; i++) {
                g.add(box(0.001, 0.14, 0.005, anodDark, 0.466, 0.50 - i * 0.08, 0,
                    { metalness: 0.30, roughness: 0.50 }));
            }
            // Yan kırmızı LED status (kan ısıtıcı — aktif gösterge)
            g.add(box(0.001, 0.40, 0.008, accentRed, 0.465, 0.47, 0.10,
                { emissive: accentRed, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // === DİJİTAL SICAKLIK EKRANI (üst — büyük cam) ===
            g.add(box(0.36, 0.18, 0.012, screenDark, 0.24, 0.74, 0.260,
                { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.32, 0.14, 0.001, 0x0d1820, 0.24, 0.74, 0.267,
                { emissive: 0x103040, emissiveIntensity: 0.50 }));
            // "38.0°C" rakam alanı — büyük kırmızı LED
            g.add(box(0.20, 0.06, 0.0015, accentRed, 0.24, 0.74, 0.269,
                { emissive: accentRed, emissiveIntensity: 0.95 }));
            // Set point altında (mavi)
            g.add(box(0.10, 0.020, 0.0015, accentBlue, 0.24, 0.700, 0.269,
                { emissive: accentBlue, emissiveIntensity: 0.65 }));
            // Üst başlık (turkuaz)
            g.add(box(0.16, 0.014, 0.0015, accentTeal, 0.24, 0.795, 0.269,
                { emissive: accentTeal, emissiveIntensity: 0.85 }));

            // === ISITMA UNİTESİ — alt-orta bölme (cam panel + kırmızı glow) ===
            g.add(box(0.32, 0.20, 0.012, screenDark, 0.24, 0.50, 0.260,
                { metalness: 0.20, roughness: 0.10 }));
            // İçinde ısıtma elemanı (kırmızı emissive — sıcak aktif gösterge)
            g.add(box(0.26, 0.14, 0.005, accentRed, 0.24, 0.50, 0.268,
                { emissive: accentRed, emissiveIntensity: 0.85,
                  transparent: true, opacity: 0.70 }));
            // Cross-pattern ısı çubukları (3 yatay)
            [-0.05, 0, 0.05].forEach(dy => {
                g.add(box(0.22, 0.006, 0.001, accentYellow, 0.24, 0.50 + dy, 0.272,
                    { emissive: accentYellow, emissiveIntensity: 0.95 }));
            });

            // === 2 IV TORBASI ASKILARI (üst) ===
            // Direk
            g.add(cyl(0.012, 0.012, 0.42, brushAlu, 0.40, 1.06, 0.10,
                { seg: 14, metalness: 0.78, roughness: 0.16 }));
            // Üst yatay askı
            g.add(cyl(0.012, 0.012, 0.20, brushAlu, 0.30, 1.27, 0.10,
                { seg: 14, metalness: 0.78, roughness: 0.16 }));
            // Sol kanca: KAN torbası (kırmızı — paketleme şekli)
            g.add(box(0.060, 0.10, 0.020, accentRed, 0.20, 1.18, 0.10,
                { metalness: 0.10, roughness: 0.45,
                  emissive: accentRed, emissiveIntensity: 0.40,
                  transparent: true, opacity: 0.85 }));
            // Etiket beyaz şerit
            g.add(box(0.040, 0.014, 0.005, 0xfafdff, 0.20, 1.20, 0.115,
                { emissive: 0xfafdff, emissiveIntensity: 0.65 }));
            // Kanca
            g.add(cyl(0.005, 0.005, 0.020, brushAlu, 0.20, 1.245, 0.10,
                { seg: 8, metalness: 0.78, roughness: 0.16 }));
            // Sağ kanca: SF/Plazma torbası (saydam)
            g.add(box(0.060, 0.10, 0.020, glassClear, 0.40, 1.18, 0.10,
                { metalness: 0.04, roughness: 0.30,
                  emissive: 0x88c9e0, emissiveIntensity: 0.20,
                  transparent: true, opacity: 0.55 }));
            g.add(box(0.040, 0.014, 0.005, accentBlue, 0.40, 1.20, 0.115,
                { emissive: accentBlue, emissiveIntensity: 0.65 }));
            g.add(cyl(0.005, 0.005, 0.020, brushAlu, 0.40, 1.245, 0.10,
                { seg: 8, metalness: 0.78, roughness: 0.16 }));

            // === 2 IV HAT (torbalardan ısıtıcı modülüne — renk kodlu) ===
            // Sol IV hat (kan — kırmızı)
            const _ivLeft = new THREE.Mesh(
                new THREE.TubeGeometry(
                    new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0.20, 1.13, 0.10),
                        new THREE.Vector3(0.18, 1.00, 0.18),
                        new THREE.Vector3(0.16, 0.85, 0.22),
                        new THREE.Vector3(0.18, 0.70, 0.27),
                        new THREE.Vector3(0.22, 0.55, 0.27)
                    ]),
                    32, 0.005, 8, false
                ),
                mat(accentRed, { emissive: accentRed, emissiveIntensity: 0.40,
                                 metalness: 0.10, roughness: 0.45 })
            );
            _ivLeft.castShadow = true; _ivLeft.receiveShadow = true;
            g.add(_ivLeft);
            // Sağ IV hat (saydam — SF)
            const _ivRight = new THREE.Mesh(
                new THREE.TubeGeometry(
                    new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0.40, 1.13, 0.10),
                        new THREE.Vector3(0.40, 1.00, 0.16),
                        new THREE.Vector3(0.38, 0.85, 0.20),
                        new THREE.Vector3(0.34, 0.70, 0.25),
                        new THREE.Vector3(0.30, 0.55, 0.27)
                    ]),
                    32, 0.005, 8, false
                ),
                new THREE.MeshStandardMaterial({
                    color: glassClear, metalness: 0.04, roughness: 0.30,
                    emissive: 0x88c9e0, emissiveIntensity: 0.20,
                    transparent: true, opacity: 0.65
                })
            );
            _ivRight.castShadow = true; _ivRight.receiveShadow = true;
            g.add(_ivRight);

            // === ÇIKIŞ HATTI (ısıtıcıdan hastaya — birleşik kavisli ===)
            const _outflow = new THREE.Mesh(
                new THREE.TubeGeometry(
                    new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0.24, 0.40, 0.27),
                        new THREE.Vector3(0.24, 0.30, 0.30),
                        new THREE.Vector3(0.30, 0.20, 0.34),
                        new THREE.Vector3(0.40, 0.12, 0.38)
                    ]),
                    24, 0.006, 8, false
                ),
                mat(accentBlue, { emissive: accentBlue, emissiveIntensity: 0.30,
                                   metalness: 0.10, roughness: 0.45 })
            );
            _outflow.castShadow = true; _outflow.receiveShadow = true;
            g.add(_outflow);

            // === KONTROL PANELİ (alt — fizik buton + LED'ler) ===
            g.add(box(0.34, 0.10, 0.012, screenDark, 0.24, 0.30, 0.260,
                { metalness: 0.20, roughness: 0.10 }));
            // 3 buton LED (yeşil/sarı/kırmızı — start/setup/alarm)
            [-0.10, -0.04, 0.02].forEach((dx, i) => {
                const colors = [accentGreen, accentYellow, accentRed];
                g.add(cyl(0.014, 0.014, 0.012, anodGray, 0.24 + dx, 0.30, 0.265,
                    { seg: 12, metalness: 0.55, roughness: 0.30 }));
                g.add(cyl(0.010, 0.010, 0.014, colors[i], 0.24 + dx, 0.30, 0.270,
                    { seg: 10, emissive: colors[i], emissiveIntensity: 0.85 }));
            });
            // Encoder döner buton (sağda)
            g.add(cyl(0.024, 0.024, 0.016, brushAlu, 0.34, 0.30, 0.265,
                { seg: 18, metalness: 0.62, roughness: 0.22 }));
            g.add(cyl(0.018, 0.018, 0.020, anodDark, 0.34, 0.30, 0.272,
                { seg: 16, metalness: 0.45, roughness: 0.40 }));

            // ============================================================
            // ÜST TUTAMAK (manevra çubuğu) + ALARM TOWER
            // ============================================================
            // Tutamak (sol modül üstünde — push handle)
            g.add(cyl(0.014, 0.014, 0.40, brushAlu, -0.24, 1.04, 0.10,
                { seg: 14, metalness: 0.78, roughness: 0.14 }));
            g.add(cyl(0.020, 0.020, 0.024, anodGray, -0.42, 1.04, 0.10,
                { seg: 16, metalness: 0.55, roughness: 0.25 }));
            g.add(cyl(0.020, 0.020, 0.024, anodGray, -0.06, 1.04, 0.10,
                { seg: 16, metalness: 0.55, roughness: 0.25 }));
            // Silikon kavrama
            g.add(cyl(0.018, 0.018, 0.34, anodDark, -0.24, 1.04, 0.10,
                { seg: 14, roughness: 0.80, metalness: 0.04 }));

            // === ALARM TOWER (sağ üst köşe — 3 katlı LED) ===
            g.add(cyl(0.012, 0.012, 0.018, screenDark, 0.42, 0.92, -0.16,
                { seg: 16, roughness: 0.40 }));
            g.add(cyl(0.018, 0.018, 0.020, accentGreen, 0.42, 0.943, -0.16,
                { seg: 18, emissive: accentGreen, emissiveIntensity: 0.85 }));
            g.add(cyl(0.018, 0.018, 0.020, accentYellow, 0.42, 0.965, -0.16,
                { seg: 18, emissive: accentYellow, emissiveIntensity: 0.30 }));
            g.add(cyl(0.018, 0.018, 0.020, accentRed, 0.42, 0.987, -0.16,
                { seg: 18, emissive: accentRed, emissiveIntensity: 0.20 }));

            return g;
        }

        function buildCPBMachineV2(x, y, z) {
            // ============================================================
            // LIVANOVA ESSENZ™ PERFUSION SYSTEM V3 (2023+)
            // FDA 510(k) onaylı yeni nesil KPB — S5'in üstüne kurulmuş
            // 
            // Karakteristik özellikler:
            // - MAST-MOUNTED ROLLER PUMPS (dikey direk üzerinde, yatay platform DEĞİL)
            // - Cockpit-style merkez dashboard (tek büyük dokunmatik)
            // - Essenz Patient Monitor (entegre sensor display)
            // - In-Line Blood Monitor (ILBM) — B-Capta sensor rack
            // - Beyaz/açık gri tasarım (modern Avrupa premium)
            // - Advanced cable management (gizli kablo rotaları)
            // - Mast-mounted disposables (optimum priming volume)
            // - GDP (Goal-Directed Perfusion) algorithm support
            // ============================================================
            const g = groupAt(x, y, z);

            // === LivaNova Essenz tasarım paleti (beyaz-gri Avrupa premium) ===
            const _essenzWhite = 0xeef2f5;   // Ana beyaz/açık gri kasa
            const _essenzGray  = 0xb5bdc4;   // Orta gri accent
            const _essenzDark  = 0x2a3744;   // Koyu kontrast (panel kenarlar, tutamaklar)
            const _chrome      = 0xc8ced4;   // Krom kenar
            const _ledTeal     = 0x14b8a6;   // Essenz aktif teal
            const _ledBlue     = 0x4d9ef0;
            const _ledGreen    = 0x4cb88a;
            const _ledRed      = 0xe04646;
            const _ledYellow   = 0xfbbf24;
            const _ledPurple   = 0x9c5cd9;
            const _screen      = 0x0a0e14;
            const _glassClear  = 0xc7dbe6;

            // ============================================================
            // 4 PREMIUM TEKERLEK + ALT BAZ (compact, low-profile)
            // ============================================================
            [-0.42, 0.42].forEach(xx => [-0.26, 0.26].forEach(zz => {
                const wh = cyl(0.054, 0.054, 0.036, 0x12161c, xx, 0.054, zz,
                    { seg: 18, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                const hub = cyl(0.026, 0.026, 0.040, _chrome, xx, 0.054, zz,
                    { seg: 14, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
                // Frenli yeşil LED
                g.add(cyl(0.005, 0.005, 0.004, _ledGreen, xx, 0.054, zz + (zz > 0 ? 0.054 : -0.054),
                    { seg: 8, emissive: _ledGreen, emissiveIntensity: 0.85 }));
            }));

            // Ana baz — beyaz/açık gri (Essenz hijyenik clean design)
            g.add(box(1.00, 0.10, 0.62, _essenzWhite, 0, 0.12, 0,
                { metalness: 0.20, roughness: 0.42 }));
            // Üst krom kenar
            g.add(box(1.00, 0.005, 0.62, _chrome, 0, 0.176, 0,
                { metalness: 0.78, roughness: 0.18 }));
            // Üst LED accent (turkuaz — perimetric)
            g.add(box(0.96, 0.003, 0.58, _ledTeal, 0, 0.180, 0,
                { emissive: _ledTeal, emissiveIntensity: 0.65,
                  transparent: true, opacity: 0.85 }));
            // LivaNova brand strip (alt-ön — kırmızı LED accent)
            g.add(box(0.18, 0.014, 0.005, _ledRed, 0, 0.16, 0.314,
                { emissive: _ledRed, emissiveIntensity: 0.85 }));

            // ============================================================
            // ALT GÖVDE — Cockpit kasası (compact, low-profile)
            // ============================================================
            g.add(box(0.96, 0.36, 0.58, _essenzWhite, 0, 0.36, 0,
                { metalness: 0.25, roughness: 0.34 }));
            // Yan krom kenarlar (clean lines)
            [-0.482, 0.482].forEach(side => {
                g.add(box(0.005, 0.32, 0.56, _chrome, side, 0.36, 0,
                    { metalness: 0.78, roughness: 0.18 }));
            });
            // Cable management cover (sol-arka — kabloları gizler)
            g.add(box(0.30, 0.34, 0.018, _essenzDark, -0.30, 0.36, -0.30,
                { metalness: 0.45, roughness: 0.32 }));
            // Cable LED accent strip
            g.add(box(0.26, 0.005, 0.020, _ledTeal, -0.30, 0.51, -0.291,
                { emissive: _ledTeal, emissiveIntensity: 0.55 }));

            // ============================================================
            // COCKPIT — MERKEZ DOKUNMATİK DASHBOARD (Essenz iconic)
            // Tek büyük yatay panel — tüm parametreler ortak görünüm
            // ============================================================
            // Cockpit kasası (anodize koyu)
            g.add(box(0.94, 0.32, 0.06, _essenzDark, 0, 0.70, 0.26,
                { metalness: 0.45, roughness: 0.30 }));
            // Üst krom kenar
            g.add(box(0.94, 0.005, 0.06, _chrome, 0, 0.864, 0.26,
                { metalness: 0.78, roughness: 0.18 }));
            // Cam dokunmatik ekran (iconic)
            g.add(box(0.88, 0.28, 0.012, _screen, 0, 0.70, 0.293,
                { metalness: 0.20, roughness: 0.10 }));
            // Aktif ekran arka plan (Essenz "soothing background with white numbers")
            g.add(box(0.86, 0.26, 0.001, 0x0d1820, 0, 0.70, 0.300,
                { emissive: 0x103040, emissiveIntensity: 0.55 }));

            // === COCKPIT İÇERİĞİ — central control + tüm perfüzyon parametreleri ===
            // Üst başlık şeridi (turkuaz aktif "ESSENZ PERFUSION")
            g.add(box(0.80, 0.026, 0.0015, _ledTeal, 0, 0.820, 0.302,
                { emissive: _ledTeal, emissiveIntensity: 0.95 }));
            // Sol başlık (beyaz)
            g.add(box(0.20, 0.014, 0.0015, 0xfafdff, -0.30, 0.820, 0.304,
                { emissive: 0xfafdff, emissiveIntensity: 0.85 }));
            // Sağ saat (beyaz)
            g.add(box(0.10, 0.014, 0.0015, 0xfafdff, 0.34, 0.820, 0.304,
                { emissive: 0xfafdff, emissiveIntensity: 0.85 }));

            // === SOL: 4 mini pompa hız/akış göstergesi (4 roller pump status) ===
            const pumpDisplays = [
                { c: _ledRed,    l: 'ART'  },
                { c: _ledBlue,   l: 'VEN'  },
                { c: _ledGreen,  l: 'CARD' },
                { c: _ledYellow, l: 'SUC'  }
            ];
            pumpDisplays.forEach((p, i) => {
                const dx = -0.36 + i * 0.10;
                // Mini kart arka plan
                g.add(box(0.090, 0.10, 0.0015, 0x081820, dx, 0.74, 0.302,
                    { emissive: 0x081820, emissiveIntensity: 0.40 }));
                // Sol accent çubuk
                g.add(box(0.005, 0.080, 0.0015, p.c, dx - 0.040, 0.74, 0.304,
                    { emissive: p.c, emissiveIntensity: 0.95 }));
                // Büyük rakam (pompa hızı RPM)
                g.add(box(0.060, 0.020, 0.0015, p.c, dx, 0.755, 0.304,
                    { emissive: p.c, emissiveIntensity: 0.95 }));
                // Mini hız bar (akış göstergesi)
                g.add(box(0.060, 0.006, 0.0015, p.c, dx, 0.725, 0.304,
                    { emissive: p.c, emissiveIntensity: 0.75 }));
            });

            // === SAĞ: Hemodinami dalga formu (3 hat — ART/VEN/CO2) ===
            const cockpitWaves = [
                { y: 0.770, c: _ledRed,   freq: 5 },   // ART
                { y: 0.730, c: _ledBlue,  freq: 4 },   // VEN
                { y: 0.690, c: _ledGreen, freq: 2 }    // CO2
            ];
            cockpitWaves.forEach(w => {
                g.add(box(0.30, 0.030, 0.0015, 0x040810, 0.18, w.y, 0.302,
                    { emissive: 0x081020, emissiveIntensity: 0.30 }));
                g.add(box(0.014, 0.020, 0.0015, w.c, 0.040, w.y, 0.304,
                    { emissive: w.c, emissiveIntensity: 0.95 }));
                for (let i = 0; i < 10; i++) {
                    const t = i / 10;
                    const dx = 0.06 + t * 0.22;
                    const dy = Math.sin(t * Math.PI * 2 * w.freq) * 0.012;
                    g.add(box(0.005, 0.005, 0.0015, w.c, dx, w.y + dy, 0.304,
                        { emissive: w.c, emissiveIntensity: 0.95 }));
                }
            });

            // === ALT: GDP (Goal-Directed Perfusion) durumu — Essenz iconic ===
            g.add(box(0.80, 0.024, 0.0015, _ledTeal, 0, 0.595, 0.302,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));
            // GDP target göstergesi (yeşil onay)
            g.add(box(0.06, 0.014, 0.0015, _ledGreen, -0.30, 0.595, 0.304,
                { emissive: _ledGreen, emissiveIntensity: 0.95 }));
            g.add(box(0.06, 0.014, 0.0015, _ledGreen, 0.30, 0.595, 0.304,
                { emissive: _ledGreen, emissiveIntensity: 0.95 }));

            // ============================================================
            // ROTARY ENCODER (cockpit altında — Essenz characteristic)
            // ============================================================
            g.add(cyl(0.034, 0.034, 0.022, _chrome, 0.40, 0.92, 0.290,
                { seg: 22, metalness: 0.78, roughness: 0.18 }));
            g.add(cyl(0.024, 0.024, 0.026, _essenzDark, 0.40, 0.92, 0.300,
                { seg: 18, metalness: 0.45, roughness: 0.40 }));

            // ============================================================
            // E-STOP (cockpit sağ üst köşe — kırmızı mantar)
            // ============================================================
            g.add(cyl(0.034, 0.034, 0.008, _ledYellow, 0.40, 0.92, -0.20,
                { seg: 22, emissive: _ledYellow, emissiveIntensity: 0.65 }));
            g.add(cyl(0.026, 0.026, 0.022, _ledRed, 0.40, 0.94, -0.20,
                { seg: 18, emissive: _ledRed, emissiveIntensity: 0.85,
                  metalness: 0.20, roughness: 0.40 }));

            // ============================================================
            // === MAST (dikey direk — Essenz signature) ===
            // Pompalar burada dikey sıralı asılı (yatay platform DEĞİL)
            // ============================================================
            // Ana mast direği (kalın krom + anodize iç)
            g.add(cyl(0.044, 0.044, 1.50, _essenzDark, 0.20, 1.30, -0.16,
                { seg: 22, metalness: 0.55, roughness: 0.30 }));
            // Krom dış kabuk
            g.add(cyl(0.050, 0.050, 1.50, _chrome, 0.20, 1.30, -0.16,
                { seg: 22, metalness: 0.78, roughness: 0.18,
                  transparent: true, opacity: 0.30 }));
            // Mast üst kapak (krom)
            g.add(cyl(0.058, 0.058, 0.018, _chrome, 0.20, 2.060, -0.16,
                { seg: 22, metalness: 0.78, roughness: 0.16 }));
            // Mast yan LED accent (turkuaz dikey şerit — durum göstergesi)
            g.add(box(0.005, 1.40, 0.005, _ledTeal, 0.252, 1.30, -0.16,
                { emissive: _ledTeal, emissiveIntensity: 0.65,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // 4 MAST-MOUNTED ROLLER PUMPS (dikey sıralı, dönen rotor)
            // Essenz signature feature
            // ============================================================
            const mastPumps = [
                { y: 1.85, c: _ledRed,    l: 'ART',  speed: 1.8 },
                { y: 1.55, c: _ledBlue,   l: 'VEN',  speed: 1.4 },
                { y: 1.25, c: _ledGreen,  l: 'CARD', speed: 0.9 },
                { y: 0.95, c: _ledYellow, l: 'SUC',  speed: 0.6 }
            ];
            
            mastPumps.forEach((p, i) => {
                const py = p.y;
                const px = 0.20;     // mast x
                const pz = -0.16;    // mast z
                const R = 0.064;     // pompa kasası yarıçapı
                
                // Mast kelepçe (krom — pompayı mast'e bağlar)
                g.add(box(0.10, 0.026, 0.024, _chrome, px - 0.012, py, pz,
                    { metalness: 0.78, roughness: 0.18 }));
                // Pompa kasası — silindirik, +x yönünde sarkar (mast'ten dışarı)
                const _pumpCase = new THREE.Mesh(
                    new THREE.CylinderGeometry(R, R, 0.05, 24),
                    mat(_essenzWhite, { metalness: 0.20, roughness: 0.34 })
                );
                _pumpCase.position.set(px + 0.12, py, pz);
                _pumpCase.rotation.x = Math.PI / 2;
                _pumpCase.castShadow = true; _pumpCase.receiveShadow = true;
                g.add(_pumpCase);
                
                // Arka kapak (anodize)
                const _pumpBack = new THREE.Mesh(
                    new THREE.CylinderGeometry(R + 0.004, R + 0.004, 0.008, 24),
                    mat(_essenzDark, { metalness: 0.45, roughness: 0.34 })
                );
                _pumpBack.position.set(px + 0.12, py, pz - 0.030);
                _pumpBack.rotation.x = Math.PI / 2;
                g.add(_pumpBack);
                
                // Şeffaf ön cam kapak
                const _pumpGlass = new THREE.Mesh(
                    new THREE.CylinderGeometry(R - 0.002, R - 0.002, 0.004, 28),
                    new THREE.MeshStandardMaterial({
                        color: _glassClear, metalness: 0.04, roughness: 0.10,
                        emissive: 0x88c9e0, emissiveIntensity: 0.10,
                        transparent: true, opacity: 0.40
                    })
                );
                _pumpGlass.position.set(px + 0.12, py, pz + 0.031);
                _pumpGlass.rotation.x = Math.PI / 2;
                g.add(_pumpGlass);
                
                // Hortum yarım daire (renk kodlu)
                const _hose = new THREE.Mesh(
                    new THREE.TorusGeometry(R - 0.010, 0.008, 8, 22, Math.PI),
                    mat(p.c, { metalness: 0.10, roughness: 0.45,
                                emissive: p.c, emissiveIntensity: 0.40 })
                );
                _hose.position.set(px + 0.12, py, pz + 0.015);
                _hose.rotation.x = Math.PI / 2;
                _hose.rotation.z = -Math.PI / 2;
                g.add(_hose);
                
                // === DÖNEN MODERN ROTOR (Essenz Smartline pump head referansı) ===
                // Anatomi: renk kodlu ana disk + 3 büyük krom KÜRE (120° aralıklı) +
                // merkez aktif LED göbek + spiral akış göstergesi
                const _rotorGrp = new THREE.Group();
                _rotorGrp.position.set(px + 0.12, py, pz + 0.015);
                _rotorGrp.rotation.x = Math.PI / 2;
                g.add(_rotorGrp);
                
                // Ana disk (renk kodlu — parlak emissive)
                const _rotorDisk = new THREE.Mesh(
                    new THREE.CylinderGeometry(R - 0.012, R - 0.012, 0.010, 28),
                    mat(p.c, { metalness: 0.55, roughness: 0.22,
                                emissive: p.c, emissiveIntensity: 0.55 })
                );
                _rotorGrp.add(_rotorDisk);
                
                // Spiral akış desen halkası (alt — disk yüzeyine entegre)
                const _spiralRing = new THREE.Mesh(
                    new THREE.TorusGeometry(R - 0.022, 0.0030, 6, 28),
                    mat(0xfafdff, { emissive: 0xfafdff, emissiveIntensity: 0.85 })
                );
                _spiralRing.rotation.x = Math.PI / 2;
                _spiralRing.position.set(0, 0.008, 0);
                _rotorGrp.add(_spiralRing);
                
                // İç krom halka (orta — disk decorative accent)
                const _innerRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.020, 0.0025, 6, 18),
                    mat(_chrome, { metalness: 0.78, roughness: 0.18 })
                );
                _innerRing.rotation.x = Math.PI / 2;
                _innerRing.position.set(0, 0.008, 0);
                _rotorGrp.add(_innerRing);
                
                // Merkez krom göbek (büyük, premium)
                const _rotorHub = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.014, 0.014, 0.020, 18),
                    mat(_chrome, { metalness: 0.82, roughness: 0.14 })
                );
                _rotorHub.position.set(0, 0.010, 0);
                _rotorGrp.add(_rotorHub);
                
                // Aktif merkez LED (turkuaz glow — pompa çalışıyor sinyali)
                const _hubLed = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.008, 0.008, 0.022, 14),
                    mat(_ledTeal, { emissive: _ledTeal, emissiveIntensity: 0.95,
                                     transparent: true, opacity: 0.85 })
                );
                _hubLed.position.set(0, 0.012, 0);
                _rotorGrp.add(_hubLed);
                
                // === 3 BÜYÜK KÜRE (toplar) — 120° aralıklı ===
                // Gerçek roller pump head: krom toplar tubing'i sıkıştırıp itiyor
                const ballR = 0.013;       // Top yarıçapı (büyük, görünür)
                const orbitR = R - 0.022;  // Yörünge yarıçapı
                for (let i = 0; i < 3; i++) {
                    const angle = (i * 2 * Math.PI) / 3;
                    const _ball = new THREE.Mesh(
                        new THREE.SphereGeometry(ballR, 18, 14),
                        mat(_chrome, { metalness: 0.85, roughness: 0.12 })
                    );
                    _ball.position.set(
                        Math.cos(angle) * orbitR,
                        0.010,
                        Math.sin(angle) * orbitR
                    );
                    _rotorGrp.add(_ball);
                    
                    // Her topun altında küçük accent LED (renk kodlu — akış yönü)
                    const _ballLed = new THREE.Mesh(
                        new THREE.SphereGeometry(0.0040, 8, 6),
                        mat(p.c, { emissive: p.c, emissiveIntensity: 0.95 })
                    );
                    _ballLed.position.set(
                        Math.cos(angle) * orbitR,
                        -0.001,
                        Math.sin(angle) * orbitR
                    );
                    _rotorGrp.add(_ballLed);
                }
                
                // === Akış yönü oku (renkli LED ok — disk üstünde) ===
                // Modern roller pump'ta sıkça görülür — saat yönü veya tersi göstergesi
                for (let j = 0; j < 6; j++) {
                    const ang = (j * Math.PI / 3);
                    const _arc = new THREE.Mesh(
                        new THREE.BoxGeometry(0.005, 0.0018, 0.005),
                        mat(p.c, { emissive: p.c, emissiveIntensity: 0.85 })
                    );
                    _arc.position.set(
                        Math.cos(ang) * (R - 0.034),
                        0.010,
                        Math.sin(ang) * (R - 0.034)
                    );
                    _rotorGrp.add(_arc);
                }
                
                // Spin animasyonu (rotor + 3 top + arc'lar birlikte döner)
                if (window.three && three.animated) {
                    three.animated.push({
                        type: 'spin', obj: _rotorGrp,
                        axis: 'y', speed: p.speed * 1.5
                    });
                }
                
                // Pompa altında dijital hız ekranı (renk kodlu LED)
                g.add(box(0.060, 0.020, 0.005, _screen, px + 0.12, py - R - 0.025, pz + 0.031,
                    { metalness: 0.20, roughness: 0.10 }));
                g.add(box(0.046, 0.012, 0.0015, p.c, px + 0.12, py - R - 0.025, pz + 0.034,
                    { emissive: p.c, emissiveIntensity: 0.95 }));
                // Pompa etiket plakası (mini)
                g.add(box(0.040, 0.014, 0.005, p.c, px + 0.12, py + R + 0.020, pz + 0.030,
                    { emissive: p.c, emissiveIntensity: 0.85 }));
                // Aktif yeşil LED (pompa çalışıyor)
                g.add(cyl(0.005, 0.005, 0.004, _ledGreen, px + 0.12, py, pz + 0.040,
                    { seg: 8, emissive: _ledGreen, emissiveIntensity: 0.95 }));
            });

            // ============================================================
            // ESSENZ PATIENT MONITOR — entegre, mast üstünde
            // (Ayrı dashboard — perfüzyonist ana parametre görünümü)
            // ============================================================
            // Kasası (büyük yatay tablet)
            g.add(box(0.46, 0.30, 0.04, _essenzDark, 0.20, 2.30, -0.16,
                { metalness: 0.45, roughness: 0.30 }));
            // Üst krom kenar
            g.add(box(0.46, 0.005, 0.04, _chrome, 0, 2.452, 0,
                { metalness: 0.78, roughness: 0.18 }));
            // Cam ekran (öne bakar)
            g.add(box(0.42, 0.26, 0.012, _screen, 0.20, 2.30, -0.138,
                { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.40, 0.24, 0.001, 0x0d1820, 0.20, 2.30, -0.130,
                { emissive: 0x103040, emissiveIntensity: 0.55 }));
            // Üst LED status bar (turkuaz "PATIENT MONITOR")
            g.add(box(0.36, 0.020, 0.0015, _ledTeal, 0.20, 2.405, -0.128,
                { emissive: _ledTeal, emissiveIntensity: 0.95 }));
            // 4 büyük rakam (Hb / SvO2 / Temp / Flow — B-Capta sensor data)
            const monParams = [
                { dx: -0.10, dy:  0.04, c: _ledRed   },   // Hb
                { dx:  0.10, dy:  0.04, c: _ledBlue  },   // SvO2
                { dx: -0.10, dy: -0.06, c: _ledYellow},   // Temp
                { dx:  0.10, dy: -0.06, c: _ledGreen }    // Flow
            ];
            monParams.forEach(m => {
                g.add(box(0.080, 0.060, 0.001, 0x081820, 0.20 + m.dx, 2.30 + m.dy, -0.128,
                    { emissive: 0x081820, emissiveIntensity: 0.50 }));
                g.add(box(0.060, 0.030, 0.0015, m.c, 0.20 + m.dx, 2.30 + m.dy, -0.126,
                    { emissive: m.c, emissiveIntensity: 0.95 }));
            });

            // ============================================================
            // MAST-MOUNTED OXYGENATOR (sağ yan — şeffaf cam)
            // ============================================================
            // Oxygenator kasa (cam, dikey yerleşim)
            g.add(box(0.18, 0.34, 0.18, _glassClear, 0.50, 1.70, -0.10,
                { metalness: 0.04, roughness: 0.20,
                  emissive: 0x88c9e0, emissiveIntensity: 0.10,
                  transparent: true, opacity: 0.45 }));
            // İç membran (turkuaz simülasyon)
            g.add(box(0.14, 0.28, 0.14, _ledTeal, 0.50, 1.70, -0.10,
                { emissive: _ledTeal, emissiveIntensity: 0.30,
                  transparent: true, opacity: 0.40 }));
            // Üst+alt kapak (krom)
            g.add(box(0.18, 0.014, 0.18, _chrome, 0.50, 1.880, -0.10,
                { metalness: 0.78, roughness: 0.16 }));
            g.add(box(0.18, 0.014, 0.18, _chrome, 0.50, 1.520, -0.10,
                { metalness: 0.78, roughness: 0.16 }));
            // O2 girişi (yeşil)
            g.add(cyl(0.012, 0.012, 0.040, _ledGreen, 0.50, 1.910, -0.04,
                { seg: 14, emissive: _ledGreen, emissiveIntensity: 0.85 }));
            // Etiket (turkuaz)
            g.add(box(0.06, 0.014, 0.005, _ledTeal, 0.50, 1.480, 0.000,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));

            // ============================================================
            // VENÖZ REZERVUAR (sol yan — sert kabuk)
            // ============================================================
            // Şeffaf cam silindir
            g.add(cyl(0.064, 0.064, 0.30, _glassClear, -0.20, 1.50, -0.10,
                { seg: 22, metalness: 0.04, roughness: 0.20,
                  emissive: 0x88c9e0, emissiveIntensity: 0.06,
                  transparent: true, opacity: 0.55 }));
            // İç kan sıvısı (kırmızı, %60 dolu)
            g.add(cyl(0.058, 0.058, 0.18, _ledRed, -0.20, 1.44, -0.10,
                { seg: 20, emissive: _ledRed, emissiveIntensity: 0.30,
                  metalness: 0.10, roughness: 0.30 }));
            // Üst kapak (krom)
            g.add(cyl(0.068, 0.068, 0.018, _chrome, -0.20, 1.660, -0.10,
                { seg: 22, metalness: 0.78, roughness: 0.16 }));
            // Hacim sensor (yan — turkuaz LED)
            g.add(box(0.005, 0.16, 0.005, _ledTeal, -0.140, 1.50, -0.10,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));
            // Etiket
            g.add(box(0.06, 0.014, 0.005, _ledBlue, -0.20, 1.32, -0.040,
                { emissive: _ledBlue, emissiveIntensity: 0.85 }));

            // ============================================================
            // ISI DEĞİŞTİRİCİ (sol-alt, mast'ten ayrı)
            // ============================================================
            g.add(cyl(0.054, 0.054, 0.20, _essenzWhite, -0.20, 1.10, -0.10,
                { seg: 22, metalness: 0.20, roughness: 0.34 }));
            g.add(cyl(0.060, 0.060, 0.014, _chrome, -0.20, 1.207, -0.10,
                { seg: 22, metalness: 0.78, roughness: 0.16 }));
            // Sıcak/soğuk LED ringler
            const _hotR = new THREE.Mesh(
                new THREE.TorusGeometry(0.024, 0.0030, 8, 18),
                mat(_ledRed, { emissive: _ledRed, emissiveIntensity: 0.85 })
            );
            _hotR.position.set(-0.20, 1.18, -0.054);
            _hotR.rotation.y = Math.PI / 2;
            g.add(_hotR);
            const _coldR = new THREE.Mesh(
                new THREE.TorusGeometry(0.024, 0.0030, 8, 18),
                mat(_ledBlue, { emissive: _ledBlue, emissiveIntensity: 0.85 })
            );
            _coldR.position.set(-0.20, 1.04, -0.054);
            _coldR.rotation.y = Math.PI / 2;
            g.add(_coldR);

            // ============================================================
            // IN-LINE BLOOD MONITOR (ILBM) — B-Capta sensor rack
            // Essenz signature feature: arteriyel + venöz hattan gerçek zamanlı
            // ============================================================
            // Sensor rack kasası (mast üzerinde — küçük kompakt modül)
            g.add(box(0.10, 0.20, 0.10, _essenzDark, 0.20, 0.60, -0.16,
                { metalness: 0.45, roughness: 0.30 }));
            // Cam dokunmatik mini ekran
            g.add(box(0.080, 0.16, 0.008, _screen, 0.252, 0.60, -0.16,
                { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.060, 0.14, 0.001, 0x0d1820, 0.256, 0.60, -0.16,
                { emissive: 0x103040, emissiveIntensity: 0.50 }));
            // 4 sensor LED (arteriyel/venöz/Hct/Temp — B-Capta parametreler)
            [0.05, 0.02, -0.01, -0.04].forEach((dy, i) => {
                const cs = [_ledRed, _ledBlue, _ledPurple, _ledYellow];
                g.add(box(0.040, 0.012, 0.0015, cs[i], 0.258, 0.60 + dy, -0.16,
                    { emissive: cs[i], emissiveIntensity: 0.95 }));
            });
            // ILBM marker LED (turkuaz — aktif sensing)
            g.add(cyl(0.005, 0.005, 0.004, _ledTeal, 0.258, 0.69, -0.16,
                { seg: 8, emissive: _ledTeal, emissiveIntensity: 0.95 }));

            // ============================================================
            // ÇIKIŞ HORTUMLARI — alt port paneli (5 renk kodlu)
            // ============================================================
            const cpbPorts = [
                { c: _ledRed,    l: 'ART'  },
                { c: _ledBlue,   l: 'VEN'  },
                { c: _ledGreen,  l: 'CARD' },
                { c: _ledYellow, l: 'O2'   },
                { c: _ledPurple, l: 'SMP'  }
            ];
            cpbPorts.forEach((p, i) => {
                const dx = -0.32 + i * 0.16;
                g.add(cyl(0.022, 0.022, 0.012, _chrome, dx, 0.260, 0.295,
                    { seg: 18, metalness: 0.78, roughness: 0.16 }));
                g.add(cyl(0.016, 0.016, 0.010, p.c, dx, 0.260, 0.301,
                    { seg: 14, emissive: p.c, emissiveIntensity: 0.85 }));
                g.add(box(0.030, 0.012, 0.005, p.c, dx, 0.220, 0.295,
                    { emissive: p.c, emissiveIntensity: 0.85 }));
            });

            // ============================================================
            // PUSH HANDLE (üst tepelik — manevra)
            // ============================================================
            g.add(cyl(0.018, 0.018, 0.50, _chrome, -0.10, 0.95, 0.34,
                { seg: 16, metalness: 0.78, roughness: 0.14 }));
            g.add(cyl(0.022, 0.022, 0.024, _essenzDark, -0.34, 0.95, 0.34,
                { seg: 18, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.022, 0.022, 0.024, _essenzDark, 0.14, 0.95, 0.34,
                { seg: 18, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.020, 0.020, 0.42, _essenzDark, -0.10, 0.95, 0.34,
                { seg: 14, roughness: 0.80, metalness: 0.04 }));

            return g;
        }

        function buildAnaesthesiaWorkstationV2(x, y, z) {
            // ============================================================
            // DRÄGER PERSEUS A500 — iF + red dot ödüllü tasarım referansı
            // Sade, kavisli, "clean lines" üst yüzey · gizli gas silindiri
            // 15.3" tek dokunmatik ekran · Vapor 2000/3000 vaporizör yuvası
            // Geniş dokümantasyon alanı · Pull-out yazı tablası
            // Antrasit + krom + beyaz accent — modern minimal hospital design
            // ============================================================
            const g = groupAt(x, y, z);
            g.rotation.y = Math.PI / 3;   // hasta tarafına +60° (orijinal davranış)

            // Perseus renk paleti — gerçek cihaza yakın
            const _antrasit   = 0x33424f;   // Ana antrasit gövde (Dräger karakteristik)
            const _antrasitDk = 0x1c2530;   // Daha koyu — alt baz
            const _accent     = 0xeaeef2;   // Beyaz/açık gri kontrast (üst yüzey)
            const _chrome     = 0xc8ced4;   // Krom kenar
            const _chromeDk   = 0x6f7a85;   // Mat krom (alt detaylar)
            const _ledTeal    = 0x2dd4bf;   // Status LED
            const _ledBlue    = 0x4d9ef0;
            const _ledGreen   = 0x4cb88a;
            const _ledRed     = 0xe04646;
            const _ledYellow  = 0xfbbf24;
            const _screen     = 0x0a0e14;

            // ============================================================
            // ALT TABAN — 4 büyük tekerlek + cable deflector
            // ============================================================
            [-0.46, 0.46].forEach(xx => [-0.30, 0.30].forEach(zz => {
                // Büyük tekerlek (Perseus karakteristik 125mm castor)
                const wh = cyl(0.072, 0.072, 0.046, 0x12161c, xx, 0.072, zz,
                    { seg: 22, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                // Krom hub
                const hub = cyl(0.034, 0.034, 0.050, _chrome, xx, 0.072, zz,
                    { seg: 16, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
                // Castor cable deflector (Perseus özel detay — küçük plastik koruyucu)
                g.add(box(0.040, 0.020, 0.020, _antrasitDk, xx, 0.114, zz + (zz > 0 ? 0.060 : -0.060),
                    { metalness: 0.20, roughness: 0.55 }));
            }));
            // Merkez fren pedalı (Perseus karakteristik — uzun yatay bar)
            g.add(box(0.36, 0.014, 0.05, _antrasit, 0, 0.040, 0.36,
                { metalness: 0.45, roughness: 0.40 }));
            g.add(box(0.10, 0.018, 0.05, _ledRed, 0, 0.058, 0.36,
                { emissive: _ledRed, emissiveIntensity: 0.65 }));

            // Ana taban (geniş antrasit platform)
            g.add(box(1.04, 0.080, 0.66, _antrasitDk, 0, 0.146, 0,
                { metalness: 0.50, roughness: 0.32 }));
            // Üst LED accent şeridi (turkuaz — perimetric)
            g.add(box(1.00, 0.004, 0.62, _ledTeal, 0, 0.188, 0,
                { emissive: _ledTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // ALT GÖVDE — ÇEKMECE BÖLÜMÜ (4 katlı, ergonomik kulp)
            // Perseus geniş çekmece sistemi — "ample storage room"
            // ============================================================
            // Ana çekmece kasası (antrasit, geniş)
            g.add(box(1.00, 0.78, 0.62, _antrasit, 0, 0.58, 0,
                { metalness: 0.45, roughness: 0.30 }));

            // 4 yatay çekmece (üstten alta — ön yüz)
            [
                { y: 0.86, h: 0.14 },
                { y: 0.70, h: 0.14 },
                { y: 0.54, h: 0.14 },
                { y: 0.34, h: 0.18 }   // En alttaki en büyük (ana ekipman)
            ].forEach(d => {
                // Çekmece ön yüzü
                g.add(box(0.96, d.h - 0.014, 0.008, _antrasit, 0, d.y, 0.314,
                    { metalness: 0.45, roughness: 0.32 }));
                // Üst krom çizgi (çekmece sınırı — Perseus minimal kenar accent)
                g.add(box(0.96, 0.003, 0.010, _chrome, 0, d.y + (d.h - 0.014)/2, 0.317,
                    { metalness: 0.78, roughness: 0.18 }));
                // Çekmece kulp barı (uzun yatay krom — Perseus ergonomik)
                g.add(box(0.84, 0.010, 0.014, _chrome, 0, d.y, 0.322,
                    { metalness: 0.78, roughness: 0.16 }));
                g.add(box(0.84, 0.003, 0.005, _ledTeal, 0, d.y + 0.005, 0.327,
                    { emissive: _ledTeal, emissiveIntensity: 0.30,
                      transparent: true, opacity: 0.75 }));
            });

            // ============================================================
            // PULL-OUT YAZI TABLASI (Perseus karakteristik özellik)
            // Ergonomik dokümantasyon alanı — alt çekmece üstü
            // ============================================================
            g.add(box(0.94, 0.012, 0.18, _accent, 0, 0.992, 0.32,
                { metalness: 0.20, roughness: 0.40 }));
            // Yan krom rails
            g.add(box(0.94, 0.005, 0.005, _chrome, 0, 1.000, 0.408,
                { metalness: 0.78, roughness: 0.18 }));

            // ============================================================
            // ÜST GÖVDE — VAPORIZÖR + EKRAN BLOĞU
            // Perseus dik üst gövde + sade kavisli üst yüzey
            // ============================================================
            // Vaporizör platformu (ön — Vapor 2000/3000 yuvası)
            g.add(box(1.00, 0.20, 0.42, _antrasit, 0, 1.108, -0.10,
                { metalness: 0.45, roughness: 0.30 }));
            // Üst krom kenar
            g.add(box(1.00, 0.005, 0.42, _chrome, 0, 1.211, -0.10,
                { metalness: 0.78, roughness: 0.18 }));

            // ============================================================
            // 3 VAPORIZÖR (Vapor 2000 — Sevoflurane / Desflurane / Isoflurane)
            // ============================================================
            const vapors = [
                { x: -0.32, c: _ledYellow, l: 'SEVO' },
                { x:  0.00, c: _ledBlue,   l: 'DES'  },
                { x:  0.32, c: _ledRed,    l: 'ISO'  }
            ];
            vapors.forEach(v => {
                // Vaporizör gövdesi (silindirik, dikey)
                g.add(box(0.20, 0.24, 0.20, _antrasitDk, v.x, 1.34, -0.10,
                    { metalness: 0.50, roughness: 0.30 }));
                // Üst krom kapak (selektör knob için)
                g.add(box(0.22, 0.012, 0.22, _chrome, v.x, 1.466, -0.10,
                    { metalness: 0.78, roughness: 0.18 }));
                // Selektör knob (krom döner)
                g.add(cyl(0.044, 0.044, 0.026, _chrome, v.x, 1.486, -0.10,
                    { seg: 22, metalness: 0.78, roughness: 0.16 }));
                g.add(cyl(0.030, 0.030, 0.030, _antrasitDk, v.x, 1.495, -0.10,
                    { seg: 18, metalness: 0.45, roughness: 0.40 }));
                // Renk kodlu LED bandı (üst — agent identification)
                g.add(box(0.16, 0.005, 0.005, v.c, v.x, 1.434, -0.020,
                    { emissive: v.c, emissiveIntensity: 0.85 }));
                // Renk kodlu sıvı seviye penceresi (yan)
                g.add(box(0.014, 0.14, 0.030, _screen, v.x, 1.32, 0.005,
                    { metalness: 0.20, roughness: 0.10 }));
                g.add(box(0.010, 0.10, 0.001, v.c, v.x, 1.32, 0.012,
                    { emissive: v.c, emissiveIntensity: 0.65 }));
                // Etiket altta
                g.add(box(0.06, 0.014, 0.005, v.c, v.x, 1.236, 0.005,
                    { emissive: v.c, emissiveIntensity: 0.65 }));
            });

            // ============================================================
            // ÜST KASA — 15.3" DOKUNMATİK EKRAN GÖVDESİ
            // Perseus karakteristik kavisli üst (no protrusions)
            // ============================================================
            // Ana ekran kasası (yatay, sade)
            g.add(box(0.94, 0.46, 0.10, _antrasit, 0, 1.74, -0.10,
                { metalness: 0.45, roughness: 0.30 }));
            // Üst-üst sade kavisli kabuk (Perseus iconic clean top)
            g.add(box(0.96, 0.06, 0.46, _antrasit, 0, 2.000, -0.16,
                { metalness: 0.45, roughness: 0.30 }));
            // Üst beyaz/açık gri accent (Perseus karakteristik kontrast)
            g.add(box(0.92, 0.005, 0.42, _accent, 0, 2.034, -0.16,
                { metalness: 0.20, roughness: 0.40 }));
            // Üst LED accent (turkuaz status bar — modern Dräger UI sinyali)
            g.add(box(0.86, 0.003, 0.005, _ledTeal, 0, 2.040, 0.058,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));

            // ============================================================
            // 15.3" CAM DOKUNMATİK EKRAN (Dräger UI)
            // ============================================================
            g.add(box(0.84, 0.42, 0.012, _screen, 0, 1.74, -0.044,
                { metalness: 0.20, roughness: 0.10 }));
            // Aktif ekran arka plan
            g.add(box(0.82, 0.40, 0.001, 0x081018, 0, 1.74, -0.036,
                { emissive: 0x103040, emissiveIntensity: 0.55 }));

            // === EKRAN İÇERİĞİ — Dräger UI mimic ===
            // ÜST BAR — başlık + sayaç + alarm durumu (turkuaz aktif)
            g.add(box(0.78, 0.030, 0.0015, _ledTeal, 0, 1.910, -0.034,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));
            // Sol başlık (beyaz)
            g.add(box(0.20, 0.018, 0.0015, 0xfafdff, -0.28, 1.910, -0.032,
                { emissive: 0xfafdff, emissiveIntensity: 0.85 }));
            // Sağ saat (beyaz)
            g.add(box(0.10, 0.018, 0.0015, 0xfafdff, 0.32, 1.910, -0.032,
                { emissive: 0xfafdff, emissiveIntensity: 0.85 }));

            // === SOL ALAN: 3 dalga formu (CO2/Pressure/Flow — Perseus standart) ===
            const waves = [
                { y: 1.83, c: _ledYellow, freq: 2 },   // CO2
                { y: 1.76, c: _ledGreen,  freq: 3 },   // Pressure
                { y: 1.69, c: _ledBlue,   freq: 5 }    // Flow
            ];
            waves.forEach(w => {
                // Kanal arka plan
                g.add(box(0.50, 0.058, 0.0015, 0x040810, -0.18, w.y, -0.034,
                    { emissive: 0x081020, emissiveIntensity: 0.30 }));
                // Sol kanal etiketi
                g.add(box(0.020, 0.030, 0.0015, w.c, -0.40, w.y, -0.032,
                    { emissive: w.c, emissiveIntensity: 0.95 }));
                // Dalga örnekleme (12 nokta)
                for (let i = 0; i < 12; i++) {
                    const t = i / 12;
                    const dx = -0.36 + t * 0.32;
                    const dy = Math.sin(t * Math.PI * 2 * w.freq) * 0.020;
                    g.add(box(0.005, 0.005, 0.0015, w.c, dx, w.y + dy, -0.032,
                        { emissive: w.c, emissiveIntensity: 0.95 }));
                }
            });

            // === SAĞ ALAN: VENTİLATÖR & GAZ DEĞER KUTULARI ===
            // 3 büyük değer kutusu (VT/PEEP/MV) — Dräger karakteristik mosaik
            const vparams = [
                { y: 1.83, c: _ledGreen,  bg: 0x0a2818 },
                { y: 1.76, c: _ledTeal,   bg: 0x082828 },
                { y: 1.69, c: _ledBlue,   bg: 0x0a1828 }
            ];
            vparams.forEach(p => {
                g.add(box(0.16, 0.058, 0.0015, p.bg, 0.28, p.y, -0.034,
                    { emissive: p.bg, emissiveIntensity: 0.55 }));
                // Sol accent çubuk
                g.add(box(0.005, 0.05, 0.0015, p.c, 0.205, p.y, -0.032,
                    { emissive: p.c, emissiveIntensity: 0.95 }));
                // Büyük rakam alanı
                g.add(box(0.10, 0.030, 0.0015, p.c, 0.27, p.y, -0.032,
                    { emissive: p.c, emissiveIntensity: 0.95 }));
            });

            // === ALT ALAN: gas mixer + virtual flow tubes ===
            // 3 dikey flow tube (O2/AIR/N2O — Dräger "virtual flow tubes")
            [-0.30, -0.20, -0.10].forEach((xx, i) => {
                const colors = [_ledGreen, _ledYellow, _ledBlue];
                // Tüp arka plan
                g.add(box(0.022, 0.10, 0.0015, 0x040810, xx, 1.59, -0.034,
                    { emissive: 0x081020, emissiveIntensity: 0.40 }));
                // İçinde flow level (renk kodlu — yarı dolu)
                g.add(box(0.014, 0.060, 0.0015, colors[i], xx, 1.575, -0.032,
                    { emissive: colors[i], emissiveIntensity: 0.95 }));
            });

            // === Alt menü şeridi (5 mini dokunmatik buton) ===
            [-0.20, -0.10, 0.00, 0.10, 0.20].forEach((dx, i) => {
                const cs = [_ledGreen, _ledTeal, _ledBlue, _ledYellow, _ledRed];
                g.add(box(0.060, 0.030, 0.0015, 0x182838, 0.10 + dx, 1.57, -0.034,
                    { emissive: 0x182838, emissiveIntensity: 0.50 }));
                g.add(box(0.012, 0.012, 0.0015, cs[i], 0.10 + dx, 1.57, -0.032,
                    { emissive: cs[i], emissiveIntensity: 0.95 }));
            });

            // ============================================================
            // ALT FİZİK BUTON ŞERİDİ + DRÄGER ROTARY KNOB (karakteristik)
            // ============================================================
            // Krom çerçeve (ekran altı)
            g.add(box(0.84, 0.020, 0.014, _chrome, 0, 1.514, -0.040,
                { metalness: 0.78, roughness: 0.18 }));
            // 5 fizik buton
            [-0.30, -0.18, -0.06, 0.06, 0.18].forEach((dx, i) => {
                const cs = [_ledGreen, _ledTeal, _ledBlue, _ledYellow, _ledRed];
                g.add(cyl(0.014, 0.014, 0.012, _antrasitDk, dx, 1.484, -0.040,
                    { seg: 14, metalness: 0.45, roughness: 0.40 }));
                g.add(cyl(0.010, 0.010, 0.014, cs[i], dx, 1.484, -0.034,
                    { seg: 12, emissive: cs[i], emissiveIntensity: 0.85 }));
            });
            // DRÄGER ROTARY KNOB (sağda — büyük krom döner buton — iconic)
            g.add(cyl(0.040, 0.040, 0.024, _chrome, 0.34, 1.484, -0.040,
                { seg: 24, metalness: 0.78, roughness: 0.18 }));
            g.add(cyl(0.028, 0.028, 0.030, _antrasitDk, 0.34, 1.484, -0.030,
                { seg: 20, metalness: 0.45, roughness: 0.40 }));
            // Knob center mark (turkuaz LED — pozisyon işareti)
            g.add(cyl(0.005, 0.005, 0.004, _ledTeal, 0.34, 1.484, -0.014,
                { seg: 8, emissive: _ledTeal, emissiveIntensity: 0.95 }));

            // ============================================================
            // BREATHING SYSTEM — sağ alt yan modül (CO2 absorber + Y-piece)
            // Perseus integrated breathing system, "tool-free disassembly"
            // ============================================================
            // CO2 absorber kanister (saydam silindir, beyaz sodalime içinde)
            g.add(cyl(0.058, 0.058, 0.18, 0xc7dbe6, 0.42, 1.20, 0.18,
                { seg: 22, metalness: 0.04, roughness: 0.20,
                  emissive: 0x88c9e0, emissiveIntensity: 0.06,
                  transparent: true, opacity: 0.65 }));
            g.add(cyl(0.052, 0.052, 0.13, 0xfafdff, 0.42, 1.18, 0.18,
                { seg: 20, roughness: 0.55, metalness: 0.04 }));
            // Üst krom kapak
            g.add(cyl(0.062, 0.062, 0.014, _chrome, 0.42, 1.296, 0.18,
                { seg: 22, metalness: 0.78, roughness: 0.16 }));
            // İnsp/exp valfler (2 saydam silindir üstte)
            [-0.020, 0.020].forEach(dx => {
                g.add(cyl(0.018, 0.018, 0.040, 0xc7dbe6, 0.42 + dx, 1.336, 0.18,
                    { seg: 14, transparent: true, opacity: 0.55,
                      emissive: 0x88c9e0, emissiveIntensity: 0.08 }));
            });

            // ============================================================
            // YAN MOUNT RAILS (Perseus karakteristik — accessory mounting)
            // ============================================================
            // Sol rail
            g.add(box(0.018, 0.60, 0.040, _chrome, -0.51, 1.20, -0.18,
                { metalness: 0.78, roughness: 0.16 }));
            // Sağ rail
            g.add(box(0.018, 0.60, 0.040, _chrome, 0.51, 1.20, -0.18,
                { metalness: 0.78, roughness: 0.16 }));

            // ============================================================
            // ALT-ÖN PORT PANELİ (5 renk kodlu hasta bağlantı portu)
            // ============================================================
            // Panel arka plaka
            g.add(box(0.46, 0.040, 0.005, _antrasitDk, 0, 0.220, 0.314,
                { metalness: 0.45, roughness: 0.32 }));
            const ports = [
                { c: _ledGreen,  l: 'O2'   },
                { c: _ledYellow, l: 'AIR'  },
                { c: _ledBlue,   l: 'N2O'  },
                { c: _ledRed,    l: 'VAC'  },
                { c: _chrome,    l: 'EVAC' }
            ];
            ports.forEach((p, i) => {
                const dx = -0.18 + i * 0.09;
                g.add(cyl(0.014, 0.014, 0.014, _chrome, dx, 0.220, 0.318,
                    { seg: 14, metalness: 0.78, roughness: 0.16 }));
                g.add(cyl(0.010, 0.010, 0.012, p.c, dx, 0.220, 0.323,
                    { seg: 12, emissive: p.c, emissiveIntensity: 0.85 }));
            });

            // ============================================================
            // E-STOP / EMERGENCY OXYGEN FLUSH (Perseus alt-sağ köşe)
            // ============================================================
            // Yuvarlak kırmızı flush butonu (oksijen flush)
            g.add(cyl(0.026, 0.026, 0.014, _ledRed, 0.40, 0.92, 0.318,
                { seg: 18, emissive: _ledRed, emissiveIntensity: 0.85,
                  metalness: 0.20, roughness: 0.40 }));
            g.add(cyl(0.022, 0.022, 0.018, 0xfafdff, 0.40, 0.93, 0.323,
                { seg: 16, emissive: 0xfafdff, emissiveIntensity: 0.40 }));

            return g;
        }



        function buildAnesthesiaPendantV1(x, y, z) {
            const root = new THREE.Group();
            root.name = 'AnesthesiaPendantV1';
            root.position.set(x, y, z);

            function makeMat(color, opts = {}) {
                return new THREE.MeshStandardMaterial({
                    color,
                    roughness: opts.roughness ?? 0.42,
                    metalness: opts.metalness ?? 0.22,
                    emissive: opts.emissive ?? 0x000000,
                    emissiveIntensity: opts.emissiveIntensity ?? 0
                });
            }

            const mat = {
                white: makeMat(0xf2f5f8, { roughness: 0.46, metalness: 0.16 }),
                lightGrey: makeMat(0xd5dbe1, { roughness: 0.42, metalness: 0.24 }),
                steel: makeMat(0xb8c1c9, { roughness: 0.24, metalness: 0.72 }),
                brushed: makeMat(0xdce2e8, { roughness: 0.26, metalness: 0.64 }),
                dark: makeMat(0x5d6976, { roughness: 0.44, metalness: 0.32 }),
                darkSoft: makeMat(0x2e3944, { roughness: 0.56, metalness: 0.10 }),
                black: makeMat(0x161b22, { roughness: 0.60, metalness: 0.10 }),
                led: makeMat(0xe8f6ff, { roughness: 0.18, metalness: 0.04, emissive: 0xc9ecff, emissiveIntensity: 0.28 }),
                glass: makeMat(0xc7dbe6, { roughness: 0.20, metalness: 0.02, emissive: 0x88c9e0, emissiveIntensity: 0.04 }),
                green: makeMat(0x41a85f, { roughness: 0.46, metalness: 0.06 }),
                blue: makeMat(0x2870c8, { roughness: 0.46, metalness: 0.06 }),
                yellow: makeMat(0xd2a51f, { roughness: 0.46, metalness: 0.06 }),
                purple: makeMat(0x7b58a6, { roughness: 0.46, metalness: 0.06 }),
                cableDark: makeMat(0x404d58, { roughness: 0.64, metalness: 0.04 }),
                cableGreen: makeMat(0x3d9f63, { roughness: 0.64, metalness: 0.04 }),
                cableBlue: makeMat(0x2f72be, { roughness: 0.64, metalness: 0.04 }),
                cableYellow: makeMat(0xd0a423, { roughness: 0.64, metalness: 0.04 }),
                cablePurple: makeMat(0x7653a0, { roughness: 0.64, metalness: 0.04 })
            };

            function meshP(geometry, material, px, py, pz, rx = 0, ry = 0, rz = 0) {
                const m = new THREE.Mesh(geometry, material);
                m.position.set(px, py, pz);
                m.rotation.set(rx, ry, rz);
                m.castShadow = true; m.receiveShadow = true;
                return m;
            }
            function bx(w, h, d, material, px, py, pz, rx = 0, ry = 0, rz = 0) {
                return meshP(new THREE.BoxGeometry(w, h, d), material, px, py, pz, rx, ry, rz);
            }
            function cy(r1, r2, h, material, px, py, pz, rx = 0, ry = 0, rz = 0, seg = 24) {
                return meshP(new THREE.CylinderGeometry(r1, r2, h, seg), material, px, py, pz, rx, ry, rz);
            }
            function sp(r, material, px, py, pz, seg = 20) {
                return meshP(new THREE.SphereGeometry(r, seg, seg), material, px, py, pz);
            }
            function rodBetween(a, b, radius, material, seg = 16) {
                const dir = new THREE.Vector3().subVectors(b, a);
                const len = dir.length();
                const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, seg), material);
                rod.position.copy(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5));
                rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
                rod.castShadow = true; rod.receiveShadow = true;
                return rod;
            }
            function tube(points, radius, material, tSeg = 28, rSeg = 10) {
                const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
                const geo = new THREE.TubeGeometry(curve, tSeg, radius, rSeg, false);
                const t = new THREE.Mesh(geo, material);
                t.castShadow = true; t.receiveShadow = true;
                return t;
            }

            // ===========================================================
            // PENDANT v2.0 — PREMIUM (cerrahi lamba kalitesinde)
            // Tavan kolonu, yatay kol ve dikey iniş kollarında lambada kullanılan
            // menteşe stili (küre eklem + accent halka). Utility head premium kasa.
            // ===========================================================
            
            // ----- TAVAN BAĞLANTI (üst flanş + RGB ring) -----
            root.add(cy(0.30, 0.34, 0.08, mat.white, 0.00, 4.16, 0.00));      // tavan flanşı
            root.add(cy(0.24, 0.28, 0.10, mat.white, 0.00, 4.06, 0.00));      // üst plaka
            // Premium turkuaz LED accent halka (tavan flanş etrafında)
            const _ceilingRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.27, 0.005, 8, 32),
                new THREE.MeshStandardMaterial({ color: 0x4cd6c4, emissive: 0x4cd6c4, emissiveIntensity: 0.55 })
            );
            _ceilingRing.position.set(0, 4.01, 0);
            _ceilingRing.castShadow = true; _ceilingRing.receiveShadow = true;
            root.add(_ceilingRing);
            
            // ----- TAVAN KOLONU + ÜST MAFSAL (lambada stil) -----
            root.add(cy(0.10, 0.12, 0.62, mat.lightGrey, 0.00, 3.70, 0.00));  // tavan kolonu
            // ÜST MAFSAL — yatay kol pivot
            root.add(sp(0.078, mat.brushed, 0.00, 3.34, 0.00, 24));            // mafsal topu (krom)
            const _hingeRingTop = new THREE.Mesh(
                new THREE.TorusGeometry(0.072, 0.0040, 10, 28),
                new THREE.MeshStandardMaterial({ color: 0xc7d3dc, metalness: 0.78, roughness: 0.16 })
            );
            _hingeRingTop.position.set(0, 3.34, 0);
            _hingeRingTop.rotation.x = Math.PI / 2;
            _hingeRingTop.castShadow = true; _hingeRingTop.receiveShadow = true;
            root.add(_hingeRingTop);
            // İkincil halka (premium detay, hafif ofset)
            const _hingeRingTop2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.080, 0.0028, 8, 24),
                new THREE.MeshStandardMaterial({ color: 0x6f8798, metalness: 0.55, roughness: 0.32 })
            );
            _hingeRingTop2.position.set(0, 3.30, 0);
            _hingeRingTop2.rotation.x = Math.PI / 2;
            _hingeRingTop2.castShadow = true; _hingeRingTop2.receiveShadow = true;
            root.add(_hingeRingTop2);
            
            // ----- YATAY KOL (brushed metal, premium accent) -----
            root.add(bx(0.82, 0.10, 0.18, mat.white, 0.36, 3.30, 0.00));
            // Üstte ince LED accent şerit (turkuaz, glow)
            root.add(bx(0.78, 0.008, 0.014, mat.led, 0.36, 3.358, 0.10, 0, 0, 0));
            // Brushed metal alt accent
            const _armBrushed = bx(0.82, 0.008, 0.018, mat.brushed, 0.36, 3.244, 0.092);
            root.add(_armBrushed);
            
            // ----- ORTA MAFSAL (yatay → dikey iniş, lambada stil) -----
            root.add(sp(0.072, mat.brushed, 0.74, 3.30, 0.00, 24));
            const _hingeRingMid = new THREE.Mesh(
                new THREE.TorusGeometry(0.066, 0.0036, 10, 26),
                new THREE.MeshStandardMaterial({ color: 0xc7d3dc, metalness: 0.78, roughness: 0.16 })
            );
            _hingeRingMid.position.set(0.74, 3.30, 0);
            _hingeRingMid.rotation.x = Math.PI / 2;
            _hingeRingMid.castShadow = true; _hingeRingMid.receiveShadow = true;
            root.add(_hingeRingMid);
            
            // ----- DİKEY İNİŞ KOLONU (premium silindirik, LED accent) -----
            root.add(cy(0.05, 0.05, 1.38, mat.lightGrey, 0.74, 2.57, 0.00));
            // Boyunca dikey LED accent şerit (turkuaz)
            root.add(bx(0.012, 1.32, 0.012, mat.led, 0.795, 2.57, 0.00));
            // Yükseklik ayar göstergesi (krom kelepçe, orta nokta)
            root.add(cy(0.062, 0.062, 0.040, mat.brushed, 0.74, 2.10, 0.00, 0, 0, 0, 22));
            
            // ----- ALT MAFSAL (utility head'e bağlantı) -----
            root.add(cy(0.08, 0.10, 0.14, mat.white, 0.74, 1.83, 0.00));
            // Mafsal accent halka
            const _hingeRingBot = new THREE.Mesh(
                new THREE.TorusGeometry(0.106, 0.0030, 8, 24),
                new THREE.MeshStandardMaterial({ color: 0x4cd6c4, emissive: 0x4cd6c4, emissiveIntensity: 0.50 })
            );
            _hingeRingBot.position.set(0.74, 1.94, 0);
            _hingeRingBot.rotation.x = Math.PI / 2;
            _hingeRingBot.castShadow = true; _hingeRingBot.receiveShadow = true;
            root.add(_hingeRingBot);
            
            // ===========================================================
            // UTILITY HEAD v2 — premium kasa (brushed alu + LED + dokunmatik)
            // ===========================================================
            // Ana gövde
            root.add(bx(1.10, 0.48, 0.30, mat.white, 0.74, 1.60, 0.00));
            // ÜST FRONTAL LED ŞERİT (eski LED'i değiştir, daha premium)
            root.add(bx(1.06, 0.012, 0.024, mat.led, 0.74, 1.836, 0.144));
            // ÜST ARKA LED accent (dual-LED, premium görünüm)
            root.add(bx(1.06, 0.008, 0.014, mat.led, 0.74, 1.840, -0.144));
            // YAN LED ŞERITLER (sol-sağ kenarlar, vertical glow)
            root.add(bx(0.012, 0.42, 0.014, mat.led, 0.187, 1.60, 0.146));
            root.add(bx(0.012, 0.42, 0.014, mat.led, 1.293, 1.60, 0.146));
            // BRUSHED METAL ÖN PANEL ACCENT (orta dekoratif şerit)
            root.add(bx(0.94, 0.025, 0.005, mat.brushed, 0.74, 1.74, 0.151));
            
            // ----- ALT TABAN (utility shelf + premium kenar) -----
            root.add(bx(1.10, 0.05, 0.30, mat.lightGrey, 0.74, 1.38, 0.00));
            // Alt LED accent (perimetric — modern dokunulmamış lambada görünüm)
            root.add(bx(1.06, 0.006, 0.014, mat.led, 0.74, 1.357, 0.146));
            
            // ----- YAN ASKILARI (premium krom, modern eğri) -----
            root.add(rodBetween(new THREE.Vector3(0.18, 1.57, 0.15), new THREE.Vector3(0.06, 1.45, 0.18), 0.014, mat.brushed));
            root.add(rodBetween(new THREE.Vector3(1.30, 1.57, 0.15), new THREE.Vector3(1.42, 1.45, 0.18), 0.014, mat.brushed));
            // Askı uçlarında küçük topuz
            root.add(sp(0.018, mat.steel, 0.06, 1.45, 0.18, 14));
            root.add(sp(0.018, mat.steel, 1.42, 1.45, 0.18, 14));
            
            // ----- PREMIUM RAF (yan plaka destek + krom korkuluk) -----
            root.add(bx(0.32, 0.040, 0.22, mat.brushed, 0.44, 1.18, 0.02));
            // Korkuluk dikmeleri
            root.add(cy(0.012, 0.012, 0.18, mat.steel, 0.30, 1.11, 0.02, 0, 0, 0, 14));
            root.add(cy(0.012, 0.012, 0.18, mat.steel, 0.58, 1.11, 0.02, 0, 0, 0, 14));
            // Korkuluk üst rayı
            root.add(rodBetween(new THREE.Vector3(0.30, 1.20, 0.02), new THREE.Vector3(0.58, 1.20, 0.02), 0.008, mat.steel));
            
            // Aksesuar rayı (alt, modern brushed metal)
            root.add(bx(0.96, 0.030, 0.06, mat.brushed, 0.74, 1.18, 0.00));
            // Ray boyunca LED accent
            root.add(bx(0.92, 0.006, 0.010, mat.led, 0.74, 1.197, 0.030));

            // ===========================================================
            // GAZ OUTLET'LERİ v2 — premium renk kodlu LED port'lar
            // ===========================================================
            const outletY = 1.56, outletZ = 0.155;
            [
                { x: 0.34, c: 0x41a85f, label: 'O₂' },     // yeşil
                { x: 0.52, c: 0x2870c8, label: 'AIR' },    // mavi
                { x: 0.70, c: 0xd2a51f, label: 'VAC' },    // sarı
                { x: 0.88, c: 0x7b58a6, label: 'AGSS' }    // mor
            ].forEach(item => {
                // Etiket plakası (LED'li)
                root.add(bx(0.10, 0.080, 0.012, makeMat(item.c, { emissive: item.c, emissiveIntensity: 0.40 }),
                    item.x, 1.66, outletZ));
                // Outlet konnektör halkası (krom kasa)
                root.add(cy(0.040, 0.040, 0.024, mat.brushed, item.x, outletY, outletZ, Math.PI / 2, 0, 0));
                // İç port halkası (renk kodlu LED)
                root.add(cy(0.030, 0.030, 0.020, makeMat(item.c, { emissive: item.c, emissiveIntensity: 0.55 }),
                    item.x, outletY, outletZ + 0.005, Math.PI / 2, 0, 0));
                // İç delik (koyu)
                root.add(cy(0.018, 0.018, 0.026, mat.darkSoft, item.x, outletY, outletZ + 0.012, Math.PI / 2, 0, 0));
                // Status LED (port üstünde küçük yeşil aktif göstergesi)
                root.add(cy(0.004, 0.004, 0.004, makeMat(0x4cb88a, { emissive: 0x4cb88a, emissiveIntensity: 0.85 }),
                    item.x, 1.62, outletZ + 0.010, Math.PI / 2, 0, 0, 10));
            });
            // Aşağıya doğru iniş tüpleri (krom)
            [0.34, 0.52, 0.70, 0.88].forEach(xx => {
                root.add(cy(0.010, 0.010, 0.30, mat.steel, xx, 1.38, 0.03));
            });

            // ===========================================================
            // POWER + DATA PANELİ v2 — modern USB-C + ethernet
            // ===========================================================
            // Ana panel kasası (brushed metal)
            root.add(bx(0.46, 0.16, 0.018, mat.brushed, 1.22, 1.57, 0.155));
            // 3 yuvarlak power priz (Avrupa standart)
            [1.08, 1.22, 1.36].forEach(xx => {
                // Priz kasası
                root.add(cy(0.034, 0.034, 0.014, mat.darkSoft, xx, 1.58, 0.165, Math.PI / 2, 0, 0, 18));
                // Priz iç halka (ground)
                root.add(cy(0.028, 0.028, 0.006, mat.dark, xx, 1.58, 0.169, Math.PI / 2, 0, 0, 18));
                // Aktif LED (yeşil — power active)
                root.add(cy(0.0035, 0.0035, 0.004, makeMat(0x4cb88a, { emissive: 0x4cb88a, emissiveIntensity: 0.85 }),
                    xx, 1.61, 0.172, Math.PI / 2, 0, 0, 10));
            });
            // USB-C port grubu (sağda, 3 port modern)
            [-0.014, 0, 0.014].forEach(dy => {
                root.add(bx(0.018, 0.005, 0.008, mat.dark, 1.52, 1.58 + dy, 0.165));
                root.add(bx(0.014, 0.003, 0.005, makeMat(0x4cd6c4, { emissive: 0x4cd6c4, emissiveIntensity: 0.55 }),
                    1.52, 1.58 + dy, 0.169));
            });
            // Ethernet RJ45 (sağ üst)
            root.add(bx(0.024, 0.018, 0.010, mat.dark, 1.55, 1.62, 0.165));
            root.add(bx(0.020, 0.014, 0.005, makeMat(0xe0a558, { emissive: 0xe0a558, emissiveIntensity: 0.60 }),
                1.55, 1.62, 0.171));

            // ===========================================================
            // DOKUNMATIK KONTROL EKRANI (utility head ön orta — modern)
            // ===========================================================
            // Çerçeve
            root.add(bx(0.20, 0.14, 0.012, mat.darkSoft, 0.74, 1.50, 0.156));
            // Ekran (turkuaz aktif)
            root.add(bx(0.18, 0.12, 0.008, makeMat(0x103040, { emissive: 0x4cd6c4, emissiveIntensity: 0.40 }),
                0.74, 1.50, 0.162));
            // Üstte mini status göstergeleri (3 LED — yeşil/sarı/mavi)
            [-0.06, 0, 0.06].forEach((dx, i) => {
                const colors = [0x4cb88a, 0xe0a558, 0x6f9fd8];
                root.add(cy(0.0040, 0.0040, 0.004, makeMat(colors[i], { emissive: colors[i], emissiveIntensity: 0.85 }),
                    0.74 + dx, 1.555, 0.166, Math.PI / 2, 0, 0, 10));
            });
            // Alt dokunmatik şerit (etkileşim alanı)
            root.add(bx(0.16, 0.020, 0.005, makeMat(0x2aaec1, { emissive: 0x4cd6c4, emissiveIntensity: 0.55 }),
                0.74, 1.450, 0.166));
            
            // ===========================================================
            // E-STOP + IDENTIFICATION (sağ üst köşe, kırmızı mantar buton)
            // ===========================================================
            // E-stop sarı uyarı halkası
            root.add(cy(0.034, 0.034, 0.005, makeMat(0xe0a558, { emissive: 0xe0a558, emissiveIntensity: 0.55 }),
                1.30, 1.71, 0.158, Math.PI / 2, 0, 0, 22));
            // E-stop kırmızı mantar
            root.add(cy(0.026, 0.026, 0.022, makeMat(0xd96371, { emissive: 0xd96371, emissiveIntensity: 0.50 }),
                1.30, 1.72, 0.165, Math.PI / 2, 0, 0, 18));
            // Marka şeridi (sol üst, brushed + turkuaz)
            root.add(bx(0.20, 0.018, 0.008, mat.brushed, 0.34, 1.78, 0.158));
            root.add(bx(0.10, 0.010, 0.005, makeMat(0x4cd6c4, { emissive: 0x4cd6c4, emissiveIntensity: 0.65 }),
                0.34, 1.78, 0.162));

            // Flowmeter tubes (orijinal — premium glass görünümü korunur)
            root.add(cy(0.018, 0.018, 0.34, mat.glass, 0.40, 1.25, -0.05));
            root.add(cy(0.018, 0.018, 0.34, mat.glass, 0.58, 1.25, -0.05));
            root.add(bx(0.05, 0.03, 0.05, mat.white, 0.40, 1.06, -0.05));
            root.add(bx(0.05, 0.03, 0.05, mat.white, 0.58, 1.06, -0.05));

            // Hoses to anesthesia machine — DÜZELTILDI: cihaz +60° döndü, arka inlet
            // konumu world (-3.56, 0.30, -0.27) civarına geldi. Pendant 0.92 ölçekli;
            // pendant local hedefi yaklaşık (-0.01, 0.33, 1.01).
            // Kablolar pendant utility headinden çıkıp cihazın arka panelindeki yardımcı
            // konektör paneline iniyor (yere doğru kavisli yol).
            // Pendant world (-3.55, 0, -1.20) → cihaz arka inlet world (-3.56, 0.30, -0.27).
            // O2 (yeşil)
            root.add(tube([
                [0.34, 1.30, -0.14], [0.20, 1.00, 0.10], [0.05, 0.70, 0.40],
                [-0.05, 0.50, 0.70], [-0.02, 0.36, 0.95], [-0.01, 0.33, 1.01]
            ], 0.011, mat.cableGreen, 32, 12));
            // Air (mavi)
            root.add(tube([
                [0.52, 1.30, -0.14], [0.32, 1.00, 0.10], [0.12, 0.70, 0.42],
                [0.02, 0.50, 0.72], [0.02, 0.36, 0.96], [0.02, 0.34, 1.02]
            ], 0.011, mat.cableBlue, 32, 12));
            // Vacuum (sarı)
            root.add(tube([
                [0.70, 1.30, -0.14], [0.45, 1.00, 0.10], [0.20, 0.70, 0.44],
                [0.08, 0.50, 0.74], [0.05, 0.36, 0.96], [0.05, 0.34, 1.02]
            ], 0.011, mat.cableYellow, 32, 12));
            // AGSS / scavenging (mor)
            root.add(tube([
                [0.88, 1.30, -0.14], [0.55, 1.00, 0.10], [0.26, 0.70, 0.46],
                [0.12, 0.50, 0.76], [0.08, 0.36, 0.97], [0.08, 0.34, 1.03]
            ], 0.011, mat.cablePurple, 32, 12));
            // Power bundle (koyu gri)
            root.add(tube([
                [1.10, 1.42, -0.12], [0.65, 1.10, 0.10], [0.30, 0.78, 0.46],
                [0.14, 0.55, 0.78], [-0.04, 0.38, 0.98], [-0.04, 0.34, 1.03]
            ], 0.009, mat.cableDark, 32, 10));
            // Data bundle (koyu gri ince)
            root.add(tube([
                [1.36, 1.42, -0.12], [0.78, 1.10, 0.10], [0.36, 0.78, 0.48],
                [0.16, 0.55, 0.80], [-0.06, 0.38, 0.99], [-0.06, 0.34, 1.04]
            ], 0.007, mat.cableDark, 32, 10));

            root.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
            return root;
        }



        function buildCPBPhaseBoardV1(x, y, z) {
            const g = groupAt(x, y, z);
            const bg = 0x10243a;
            const edge = 0x5cc4d6;
            const amber = 0xe0a558;
            const green = 0x4cb88a;
            const red = 0xd96371;
            g.name = 'CPBPhaseBoardV1';
            g.add(box(1.22, 0.72, 0.045, bg, 0, 1.05, 0, { roughness: 0.52, metalness: 0.18 }));
            g.add(box(1.25, 0.035, 0.052, edge, 0, 1.43, 0.004, { emissive: edge, emissiveIntensity: 0.18, roughness: 0.38 }));
            const steps = [
                { label:'1 PRE-KPB', color: amber, x:-0.46, y:1.25 },
                { label:'2 ACT/HEP/PRIME', color: edge, x:0.00, y:1.25 },
                { label:'3 PUMP ON', color: green, x:0.46, y:1.25 },
                { label:'4 WEAN', color: amber, x:-0.24, y:0.92 },
                { label:'5 PROT/COAG', color: red, x:0.28, y:0.92 }
            ];
            steps.forEach((s, i) => {
                g.add(box(0.34, 0.12, 0.018, s.color, s.x, s.y, 0.04, { emissive: s.color, emissiveIntensity: 0.10, roughness: 0.46 }));
                g.add(box(0.028, 0.028, 0.022, 0xffffff, s.x - 0.135, s.y + 0.002, 0.058, { transparent: true, opacity: 0.78, roughness: 0.34 }));
                if (typeof makeTextSprite === 'function') {
                    const spr = makeTextSprite(s.label, { fontsize: 34, color: '#e8eef5', backgroundColor: 'rgba(0,0,0,0)' });
                    spr.scale.set(0.42, 0.12, 1);
                    spr.position.set(s.x + 0.025, s.y + 0.002, 0.075);
                    g.add(spr);
                }
            });
            g.add(box(0.92, 0.014, 0.018, 0xffffff, 0, 1.075, 0.06, { transparent: true, opacity: 0.28, roughness: 0.40 }));
            g.add(cyl(0.025, 0.025, 0.16, green, -0.56, 0.72, 0, { seg: 14, emissive: green, emissiveIntensity: 0.25, roughness: 0.34 }));
            g.add(cyl(0.025, 0.025, 0.16, red, 0.56, 0.72, 0, { seg: 14, emissive: red, emissiveIntensity: 0.18, roughness: 0.34 }));
            return g;
        }


        function cabgTempTriggerSeverity(tempC) {
            const t = Number(tempC);
            if (!Number.isFinite(t)) return 'unknown';
            if (t < 35) return 'red';
            if (t < 36) return 'amber';
            return 'green';
        }

        function buildCABGAnaesthesiaDepthPanelV1(x, y, z) {
            const g = groupAt(x, y, z);
            const dark = 0x102033, panel = 0x1d3550, rail = 0x8da4b8;
            const green = 0x4cb88a, amber = 0xe0a558, red = 0xd96371, blue = 0x5cc4d6, violet = 0x9b89c4;
            g.name = 'CABGAnaesthesiaDepthPanelV1';
            // mobile anaesthesia safety panel
            g.add(box(0.88, 0.86, 0.070, dark, 0, 0.78, 0, { roughness: 0.40, metalness: 0.18 }));
            g.add(box(0.78, 0.10, 0.080, panel, 0, 1.16, 0.010, { emissive: 0x0f2438, emissiveIntensity: 0.10 }));
            // A-line waveform strip
            g.add(box(0.72, 0.18, 0.084, 0x06111f, 0, 0.99, 0.020, { roughness: 0.36, metalness: 0.12 }));
            const wavePts = [];
            for (let i = 0; i < 9; i++) {
                const xx = -0.32 + i * 0.08;
                const yy = 1.00 + (i % 3 === 1 ? 0.055 : (i % 3 === 2 ? -0.020 : 0.010));
                wavePts.push(new THREE.Vector3(xx, yy, 0.075));
            }
            const wave = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wavePts), 42, 0.004, 6, false), mat(green, { emissive: green, emissiveIntensity: 0.35, roughness: 0.35 }));
            prepMesh(wave); g.add(wave);
            // EBL/TXA/Blood product rows
            const rows = [
                [-0.25, 0.78, red, 'EBL'],
                [ 0.00, 0.78, violet, 'TXA'],
                [ 0.25, 0.78, amber, 'KAN'],
                [-0.25, 0.56, blue, 'A-line'],
                [ 0.00, 0.56, green, 'Zero'],
                [ 0.25, 0.56, red, 'Cross']
            ];
            rows.forEach(([xx, yy, cc]) => {
                g.add(box(0.18, 0.070, 0.084, 0x223c58, xx, yy, 0.018, { roughness: 0.38, metalness: 0.10 }));
                g.add(box(0.044, 0.044, 0.096, cc, xx - 0.055, yy, 0.033, { emissive: cc, emissiveIntensity: 0.40, roughness: 0.32 }));
                g.add(box(0.070, 0.010, 0.098, rail, xx + 0.035, yy, 0.034, { metalness: 0.36, roughness: 0.22 }));
            });
            // TXA ampoule + syringe visual
            g.add(cyl(0.018, 0.018, 0.115, violet, -0.40, 0.43, 0.025, { seg: 16, transparent: true, opacity: 0.72, emissive: violet, emissiveIntensity: 0.14, roughness: 0.28 }));
            const syr = cyl(0.010, 0.010, 0.16, 0xeef4f8, 0.36, 0.42, 0.025, { seg: 12, transparent: true, opacity: 0.62, roughness: 0.22 });
            syr.rotation.z = Math.PI / 2.8; g.add(syr);
            // feet
            g.add(box(0.94, 0.035, 0.080, rail, 0, 0.26, 0.004, { metalness: 0.52, roughness: 0.22 }));
            g.add(cyl(0.030, 0.030, 0.030, dark, -0.36, 0.20, 0, { seg: 14 }));
            g.add(cyl(0.030, 0.030, 0.030, dark,  0.36, 0.20, 0, { seg: 14 }));
            return g;
        }

        function buildCABGTemperatureTriggerPanelV1(x, y, z) {
            const g = groupAt(x, y, z);
            const dark = 0x102033, rail = 0x8da4b8;
            const green = 0x4cb88a, amber = 0xe0a558, red = 0xd96371, blue = 0x5cc4d6;
            g.name = 'CABGTemperatureTriggerPanelV1';
            g.add(box(0.74, 0.72, 0.070, dark, 0, 0.70, 0, { roughness: 0.42, metalness: 0.16 }));
            g.add(box(0.66, 0.09, 0.080, 0x1b3550, 0, 1.00, 0.012, { emissive: blue, emissiveIntensity: 0.10 }));
            // three threshold bars: green, amber, red
            const bars = [
                { y:0.84, c:green, w:0.52 },
                { y:0.68, c:amber, w:0.52 },
                { y:0.52, c:red, w:0.52 }
            ];
            bars.forEach((b, i) => {
                g.add(box(0.58, 0.085, 0.080, 0x223c58, 0, b.y, 0.018, { roughness: 0.38 }));
                g.add(box(b.w, 0.035, 0.096, b.c, 0, b.y, 0.034, { emissive: b.c, emissiveIntensity: i === 0 ? 0.20 : 0.48, roughness: 0.30 }));
                g.add(cyl(0.020, 0.020, 0.020, b.c, -0.33, b.y, 0.040, { seg: 14, emissive: b.c, emissiveIntensity: 0.58 }));
            });
            // thermometer probe line
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.30,0.92,0.04),
                new THREE.Vector3(0.36,0.74,0.05),
                new THREE.Vector3(0.32,0.46,0.04),
                new THREE.Vector3(0.40,0.34,0.02)
            ]);
            const probe = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.006, 8, false), mat(blue, { emissive: blue, emissiveIntensity: 0.18, roughness: 0.36 }));
            prepMesh(probe); g.add(probe);
            g.add(box(0.78, 0.030, 0.080, rail, 0, 0.25, 0.004, { metalness: 0.52, roughness: 0.22 }));
            return g;
        }


        function buildCellSaverV1(x, y, z) {
            const g = groupAt(x, y, z);
            const white = 0xeef3f7;
            const graphite = 0x1b2635;
            const steel = 0xc8ced4;
            const red = 0xd96371;
            const blue = 0x5cc4d6;
            const green = 0x4cb88a;
            const amber = 0xe0a558;
            g.name = 'CellSaverV1';
            // wheeled base
            g.add(box(0.62, 0.08, 0.46, graphite, 0, 0.08, 0, { roughness: 0.42, metalness: 0.20 }));
            [-0.24, 0.24].forEach(xx => [-0.18, 0.18].forEach(zz => {
                const wheel = cyl(0.035, 0.035, 0.025, 0x111827, xx, 0.045, zz, { seg: 14, roughness: 0.55 });
                wheel.rotation.z = Math.PI / 2;
                g.add(wheel);
            }));
            // tower body
            g.add(box(0.46, 0.78, 0.34, white, 0, 0.52, 0, { roughness: 0.22, metalness: 0.16 }));
            g.add(box(0.40, 0.18, 0.026, 0x0b1e38, 0, 0.83, 0.181, { roughness: 0.24, metalness: 0.18 }));
            g.add(box(0.30, 0.06, 0.028, blue, 0, 0.85, 0.198, { emissive: blue, emissiveIntensity: 0.35, roughness: 0.34 }));
            // centrifuge bowl / processing chamber
            g.add(cyl(0.135, 0.135, 0.11, steel, -0.05, 0.56, 0.19, { seg: 32, transparent: true, opacity: 0.70, roughness: 0.22, metalness: 0.30 }));
            g.add(cyl(0.095, 0.095, 0.106, red, -0.05, 0.56, 0.195, { seg: 32, transparent: true, opacity: 0.45, emissive: red, emissiveIntensity: 0.10, roughness: 0.30 }));
            // reservoir bag
            g.add(box(0.16, 0.24, 0.04, red, 0.20, 0.56, 0.18, { transparent: true, opacity: 0.46, roughness: 0.30 }));
            g.add(box(0.13, 0.06, 0.022, amber, 0.20, 0.69, 0.19, { emissive: amber, emissiveIntensity: 0.10, roughness: 0.38 }));
            // tubing routes
            const mkTube = (pts, color, radius=0.010) => {
                const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2])));
                const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 8, false), mat(color, { roughness: 0.40, transparent: true, opacity: 0.82 }));
                prepMesh(mesh); g.add(mesh); return mesh;
            };
            mkTube([[0.20,0.68,0.20],[0.06,0.72,0.24],[-0.05,0.64,0.22]], red, 0.008);
            mkTube([[-0.05,0.49,0.22],[-0.18,0.38,0.20],[-0.30,0.32,0.12]], blue, 0.008);
            mkTube([[0.12,0.34,0.18],[0.26,0.29,0.12],[0.34,0.24,0.02]], green, 0.007);
            // labeled safety strip
            g.add(box(0.38, 0.035, 0.020, green, 0, 0.22, 0.19, { emissive: green, emissiveIntensity: 0.22, roughness: 0.42 }));
            g.add(box(0.38, 0.026, 0.018, red, 0, 0.18, 0.19, { emissive: red, emissiveIntensity: 0.12, roughness: 0.42 }));
            return g;
        }

        function buildCABGDeviceAuditPanelV1(x, y, z) {
            const g = groupAt(x, y, z);
            const dark = 0x102033;
            const panel = 0x1b3550;
            const rail = 0x8da4b8;
            const green = 0x4cb88a;
            const amber = 0xe0a558;
            const red = 0xd96371;
            g.add(box(1.18, 1.02, 0.075, dark, 0, 0.82, 0, { metalness: 0.18, roughness: 0.44 }));
            g.add(box(1.06, 0.12, 0.082, panel, 0, 1.27, 0.006, { emissive: 0x0f2438, emissiveIntensity: 0.08 }));
            g.add(box(1.04, 0.030, 0.090, 0x5cc4d6, 0, 1.19, 0.014, { emissive: 0x5cc4d6, emissiveIntensity: 0.32 }));
            const rows = [
                [-0.36, 1.02, green], [-0.12, 1.02, green], [0.12, 1.02, amber], [0.36, 1.02, green],
                [-0.36, 0.78, green], [-0.12, 0.78, amber], [0.12, 0.78, green], [0.36, 0.78, red],
                [-0.36, 0.54, green], [-0.12, 0.54, green], [0.12, 0.54, green], [0.36, 0.54, amber]
            ];
            rows.forEach(([xx, yy, cc], i) => {
                g.add(box(0.18, 0.070, 0.088, 0x223c58, xx, yy, 0.018, { metalness: 0.10, roughness: 0.38 }));
                g.add(box(0.052, 0.052, 0.096, cc, xx - 0.046, yy, 0.032, { emissive: cc, emissiveIntensity: 0.46 }));
                g.add(box(0.082, 0.012, 0.098, rail, xx + 0.042, yy, 0.033, { metalness: 0.42, roughness: 0.22 }));
            });
            g.add(box(1.22, 0.035, 0.090, rail, 0, 0.31, 0.010, { metalness: 0.55, roughness: 0.20 }));
            g.add(box(0.08, 0.64, 0.090, rail, -0.62, 0.70, 0.006, { metalness: 0.55, roughness: 0.20 }));
            g.add(box(0.08, 0.64, 0.090, rail, 0.62, 0.70, 0.006, { metalness: 0.55, roughness: 0.20 }));
            g.name = 'CABGDeviceAuditPanelV1';
            return g;
        }

        function buildIntraopCABG() {
            // 1) Ortak çekirdek — CABG kendi entegre masa+hasta objesini ekleyecek,
            //    bu yüzden ortak 'H1 · Ameliyat Masası ve Hasta' atlanır.
            buildIntraopCommonCore({ skipMainTable: true, cabgLayout: true });

            // Anestezi servis pendantı (tavandan inen gaz/elektrik/data altyapısı)
            // Konum: cihazın duvar/arka tarafı, utility head cihazın üzerine düşer.
            const _anesPendant = buildAnesthesiaPendantV1(-3.55, 0, -1.20);
            _anesPendant.scale.set(0.92, 0.92, 0.92);
            addDecor(_anesPendant);

            // ============================================================
            // HASTA ↔ ANESTEZI CIHAZI BAĞLANTI HORTUMLARI (alttan)
            // Hortumlar hasta baş ucundan (ETT) çıkıp masa kenarından aşağı
            // sarkar, yer seviyesinden cihazın ALT-ARKA inlet panelinin
            // ALT kısmına girer. Cerrahi alanı ve görüş hattını kapatmaz.
            // Hasta başı world ≈ (-1.17, 1.00, 0.10).
            // Anestezi cihazı world ≈ (-3.85, 0, -0.10) — alt-arka inlet z≈+0.20.
            // ============================================================
            (function buildPatientToAnesthesiaConnections() {
                const tubeGrp = new THREE.Group();
                tubeGrp.name = 'PatientAnesthesiaConnections';

                function makeMat(color, opts = {}) {
                    return new THREE.MeshStandardMaterial({
                        color,
                        roughness: opts.roughness ?? 0.55,
                        metalness: opts.metalness ?? 0.05,
                        emissive: opts.emissive ?? 0x000000,
                        emissiveIntensity: opts.emissiveIntensity ?? 0
                    });
                }

                const matInsp  = makeMat(0xc8d4dc, { roughness: 0.42, metalness: 0.06 }); // şeffafımsı insp.
                const matExp   = makeMat(0x6f8794, { roughness: 0.46, metalness: 0.08 }); // koyu exp. limb
                const matSpO2  = makeMat(0x2870c8, { roughness: 0.55, metalness: 0.04 }); // SpO₂ kablosu (mavi)
                const matCuff  = makeMat(0x2e3944, { roughness: 0.62, metalness: 0.04 }); // NIBP hortumu (siyah)
                const matRing  = makeMat(0x4a5560, { roughness: 0.48, metalness: 0.20 }); // spiral halka

                function tube(points, radius, material, tSeg = 48, rSeg = 12) {
                    const curve = new THREE.CatmullRomCurve3(
                        points.map(p => new THREE.Vector3(p[0], p[1], p[2]))
                    );
                    const geo = new THREE.TubeGeometry(curve, tSeg, radius, rSeg, false);
                    const m = new THREE.Mesh(geo, material);
                    m.castShadow = true; m.receiveShadow = true;
                    return m;
                }

                // ---- Inspiratory limb (cihazın ASIL SOL YAN duvarından giriş) ----
                // DÜZELTILDI: panel cihazın gerçek sol duvarına (local x=-0.52) çekildi.
                // +60° rotasyon sonrası inlet world (-4.11, 0.22, -0.55) civarı.
                const inspPath = [
                    [-1.17, 1.00, -0.08],   // hasta ağzı (ETT)
                    [-1.32, 0.92, -0.18],
                    [-1.55, 0.55, -0.30],
                    [-1.85, 0.18, -0.40],
                    [-2.40, 0.10, -0.48],
                    [-3.10, 0.10, -0.52],
                    [-3.70, 0.16, -0.54],
                    [-4.05, 0.20, -0.55],   // duvar yüzeyi yaklaşımı
                    [-4.16, 0.22, -0.56]    // CİHAZ İÇİNE girer
                ];
                tubeGrp.add(tube(inspPath, 0.022, matInsp, 64, 14));

                // ---- Expiratory limb (paralel, ofset) ----
                const expPath = [
                    [-1.17, 1.00,  0.02],
                    [-1.32, 0.92, -0.08],
                    [-1.55, 0.55, -0.20],
                    [-1.85, 0.18, -0.30],
                    [-2.40, 0.10, -0.40],
                    [-3.10, 0.10, -0.46],
                    [-3.70, 0.18, -0.50],
                    [-4.05, 0.24, -0.51],
                    [-4.18, 0.26, -0.52]    // CİHAZ İÇİNE girer (offset üst)
                ];
                tubeGrp.add(tube(expPath, 0.022, matExp, 64, 14));

                // ---- Spiral halka detayları (yeni kısa rotaya göre, insp boyunca) ----
                [
                    [-1.40, 0.85, -0.24],
                    [-1.65, 0.50, -0.34],
                    [-1.95, 0.18, -0.42],
                    [-2.40, 0.10, -0.48],
                    [-2.85, 0.10, -0.51],
                    [-3.30, 0.12, -0.53],
                    [-3.75, 0.18, -0.54]
                ].forEach(p => {
                    const ring = new THREE.Mesh(
                        new THREE.TorusGeometry(0.024, 0.003, 6, 14),
                        matRing
                    );
                    ring.position.set(p[0], p[1], p[2]);
                    ring.rotation.y = Math.PI / 2;
                    ring.castShadow = true; ring.receiveShadow = true;
                    tubeGrp.add(ring);
                });
                // Exp boyunca paralel halkalar (hafif ofset)
                [
                    [-1.40, 0.85, -0.14],
                    [-1.65, 0.50, -0.24],
                    [-1.95, 0.18, -0.32],
                    [-2.40, 0.10, -0.40],
                    [-2.85, 0.10, -0.45],
                    [-3.30, 0.14, -0.48],
                    [-3.75, 0.22, -0.50]
                ].forEach(p => {
                    const ring = new THREE.Mesh(
                        new THREE.TorusGeometry(0.024, 0.003, 6, 14),
                        matRing
                    );
                    ring.position.set(p[0], p[1], p[2]);
                    ring.rotation.y = Math.PI / 2;
                    ring.castShadow = true; ring.receiveShadow = true;
                    tubeGrp.add(ring);
                });

                // ---- SpO₂ kablosu (sağ parmak → ASIL SOL YAN duvar inlet) ----
                const spo2Path = [
                    [ 0.08, 0.96,  0.95],   // sağ parmak
                    [-0.10, 0.55,  0.92],
                    [-0.40, 0.20,  0.60],
                    [-0.80, 0.10,  0.20],
                    [-1.20, 0.08, -0.20],
                    [-1.80, 0.08, -0.40],
                    [-2.50, 0.08, -0.50],
                    [-3.30, 0.10, -0.54],
                    [-3.90, 0.18, -0.55],
                    [-4.16, 0.22, -0.55]    // CİHAZ İÇİNE girer
                ];
                tubeGrp.add(tube(spo2Path, 0.008, matSpO2, 56, 10));

                // ---- NIBP hortumu (sağ kol manşeti → ASIL SOL YAN duvar inlet) ----
                const cuffPath = [
                    [-0.30, 1.00,  0.85],
                    [-0.55, 0.55,  0.78],
                    [-0.85, 0.20,  0.50],
                    [-1.20, 0.10,  0.10],
                    [-1.60, 0.08, -0.30],
                    [-2.20, 0.08, -0.45],
                    [-2.90, 0.10, -0.52],
                    [-3.70, 0.18, -0.54],
                    [-4.10, 0.24, -0.54],
                    [-4.18, 0.26, -0.54]    // CİHAZ İÇİNE girer
                ];
                tubeGrp.add(tube(cuffPath, 0.012, matCuff, 56, 10));

                // ---- EKG kabloları — final güvenlik revizyonu ----
                // Üç ayrı uzun renkli kablo yerine: kısa renkli lead'ler + tek ince trunk bundle.
                // Böylece hasta başı kablo yumağı azalır, monitoring bağlantısı yine klinik olarak okunur.
                const matEkgRed   = makeMat(0xc2424f, { roughness: 0.54 });
                const matEkgYell  = makeMat(0xd9b04a, { roughness: 0.54 });
                const matEkgGreen = makeMat(0x4cb88a, { roughness: 0.54 });
                const matEkgBundle = makeMat(0x2b333d, { roughness: 0.66, metalness: 0.03 });
                const ekgJunction = [-0.62, 0.72, -0.22];

                [
                    { from: [-0.30, 1.08,  0.42], mat: matEkgRed   },
                    { from: [-0.30, 1.08, -0.42], mat: matEkgYell  },
                    { from: [ 0.10, 1.06, -0.38], mat: matEkgGreen }
                ].forEach(item => {
                    tubeGrp.add(tube([
                        item.from,
                        [-0.44, 0.92, item.from[2] * 0.55],
                        ekgJunction
                    ], 0.0048, item.mat, 24, 8));
                });

                const junctionMesh = new THREE.Mesh(
                    new THREE.BoxGeometry(0.060, 0.030, 0.045),
                    makeMat(0x414b55, { roughness: 0.56, metalness: 0.18 })
                );
                junctionMesh.position.set(ekgJunction[0], ekgJunction[1], ekgJunction[2]);
                junctionMesh.castShadow = true; junctionMesh.receiveShadow = true;
                tubeGrp.add(junctionMesh);

                tubeGrp.add(tube([
                    ekgJunction,
                    [-0.86, 0.32, -0.36],
                    [-1.25, 0.10, -0.46],
                    [-1.95, 0.070, -0.52],
                    [-2.80, 0.070, -0.54],
                    [-3.55, 0.120, -0.55],
                    [-4.16, 0.220, -0.56]    // CİHAZ İÇİNE girer
                ], 0.0068, matEkgBundle, 56, 8));

                // ---- Sıcaklık probu (özofageal/aksiller → cihaz inlet) ----
                const matTemp = makeMat(0xeae8df, { roughness: 0.55 });
                tubeGrp.add(tube([
                    [-1.05, 1.04,  0.04],   // hasta ağzı yakını (özofageal sensör)
                    [-1.20, 0.65, -0.10],
                    [-1.30, 0.20, -0.30],
                    [-1.45, 0.10, -0.40],
                    [-2.00, 0.08, -0.48],
                    [-2.70, 0.08, -0.52],
                    [-3.40, 0.10, -0.54],
                    [-4.00, 0.16, -0.55],
                    [-4.16, 0.20, -0.57]    // CİHAZ İÇİNE girer
                ], 0.005, matTemp, 56, 8));

                // ---- Yer toplama bandı (yeni kısa rotaya göre klempler) ----
                [
                    [-2.10, 0.045, -0.48],
                    [-3.00, 0.045, -0.54],
                    [-3.88, 0.045, -0.56]
                ].forEach(p => {
                    const clip = new THREE.Mesh(
                        new THREE.BoxGeometry(0.045, 0.018, 0.24),
                        makeMat(0x3a4450, { roughness: 0.64 })
                    );
                    clip.position.set(p[0], p[1], p[2]);
                    clip.castShadow = true; clip.receiveShadow = true;
                    tubeGrp.add(clip);
                });

                addDecor(tubeGrp);
            })();

            // 2) CABG-özel objeler
            const signIn = taskByKeywords(['sign-in', 'alerji', 'anestezi']);
            const timeout = taskByKeywords(['time-out', 'ekip tanıtımı', 'kimlik/işlem']);
            const sterile = taskByKeywords(['steril', 'antibiyotik']);
            const count = taskByKeywords(['sayım', 'spanç', 'iğne', 'alet']);
            const warming = taskByKeywords(['ısıtma', 'basınç', 'koruma']);

            const anesDepthTask = taskByKeywords(['anestezi derinlik', 'A-line', 'TXA', 'kan kaybı']);
            const tempTriggerTask = taskByKeywords(['Sıcaklık tetikleme', 'amber', 'kırmızı']);

            // FAZ 2: CABG anestezi derinlik paneli — kan kaybı + A-line + TXA
            const cabgAnaDepthPanel = buildCABGAnaesthesiaDepthPanelV1(-3.15, 0, -0.70);
            cabgAnaDepthPanel.rotation.y = Math.PI / 18;
            addObj(cabgAnaDepthPanel, 'A6 · CABG Anestezi Derinlik Paneli', 'CABG anestezi güvenliği paneli; tahmini kan kaybı, invaziv arter basıncı (A-line) sıfırlama/dalga formu, TXA order-doz-zamanlaması, crossmatch/kan ürünleri ve cell saver hazırlığını tek güvenlik hattında görünür kılar. GCKL/görev puanlamasına bağlıdır; ayrı OSCE değildir.', { taskId: anesDepthTask?.id || signIn?.id, clinicalKey: 'cabg-anaesthesia-module', severity: 'danger' });
            statusMarker(-3.15, 1.35, -0.70, anesDepthTask || signIn, 'A-line/TXA', { role:'anaesthesia', priority:'critical', clinicalKey:'cabg-anaesthesia-module', shortLabel:'A-line/TXA' });

            // FAZ 2: Sıcaklık tetik paneli — T <36 amber, T <35 kırmızı
            const cabgTempTriggerPanel = buildCABGTemperatureTriggerPanelV1(-2.05, 0, -0.62);
            cabgTempTriggerPanel.rotation.y = -Math.PI / 16;
            addObj(cabgTempTriggerPanel, 'A7 · Sıcaklık Tetik Paneli', 'CABG hipotermi eşik paneli; fiziksel ısıtma cihazı değildir. T <36°C olduğunda amber erken yanıt, T <35°C olduğunda kırmızı kritik eskalasyon başlatır. Aktif ısıtma cihazı sahayı kalabalıklaştırmamak için hasta ayak ucu dış hattına taşındı; bu panel yalnızca karar/uyarı göstergesi olarak GCKL puanlamasına bağlıdır.', { taskId: tempTriggerTask?.id || warming?.id, clinicalKey: 'cabg-temp-trigger', severity: 'danger' });
            statusMarker(-2.05, 1.24, -0.62, tempTriggerTask || warming, 'Isı Eşik', { role:'circulating', priority:'critical', clinicalKey:'cabg-temp-trigger', shortLabel:'Isı Eşik' });

            // CABG'ye özel entegre masa + hasta + drape + sternotomi alanı.
            // 'Hasta/Masa' markeri (clinicalKey:'time-out') common-core'da hâlâ
            // konumlandırılıyor; bu obje aynı clinicalKey ile o markera bağlanır.
            // CABG-özel premium cerrah & scrub & mayo (boy +%15 ölçeklendi)
            const cabgSurgeon = buildDoctorCharacter3D(-0.33, 0, -1.10, 0x5a8f68);
            cabgSurgeon.scale.set(1.08, 1.18, 1.08);
            cabgSurgeon.rotation.y = Math.PI / 2; // hasta sahasına bakacak
            addObj(cabgSurgeon, 'S1 · Cerrah', 'CABG cerrahı hasta sağ yanında, sternotomi sahasına dönük; premium model + uzatılmış boy.', { taskId: timeout?.id, clinicalKey: 'surgeon' });

            const cabgScrub = buildNurseCharacter3D(-0.33, 0, 1.10);
            cabgScrub.scale.set(1.06, 1.16, 1.06);
            cabgScrub.rotation.y = -Math.PI / 2; // hasta sahasına bakacak
            addObj(cabgScrub, 'S2 · Scrub Hemşiresi', 'Scrub hemşiresi cerrahın karşı yanında, Mayo masasının önünde; premium + uzatılmış.', { taskId: count?.id, clinicalKey: 'scrub-nurse-3d' });

            const cabgMayo = buildMayoStandV151(0.20, 0, 1.40);
            cabgMayo.rotation.y = -Math.PI / 2;
            addObj(cabgMayo, 'S3 · Mayo Masası', 'Mayo masası scrub hemşiresinin elinin altında, hasta sol-üst kuadrantında.', { taskId: sterile?.id, clinicalKey: 'mayo-stand', severity: 'danger' });

            // GRAFT HAZIRLAMA MASASI — Mayo ile ESU arası (saphen ven prep istasyonu)
            const cabgGraftTable = buildGraftPrepTableV1(1.10, 0, 1.45);
            cabgGraftTable.rotation.y = -Math.PI / 2;
            addObj(cabgGraftTable, 'S4 · Back Table + IMA/Safen Diseksiyon Alanı', 'CABG için back-table greft hazırlama istasyonu — IMA pedikülü ve safen ven kondüiti ayrı görünür diseksiyon zonlarında tutulur. Yedek steril setler, sutür rack, soğuk salin tası, distansiyon şırıngası, heparin, bulldog klempler ve kalibrasyon probları ayrı zonlarda düzenlendi. Eğitim görevi: heparinli salin, keskin/nötr alan, sayım güvenliği ve kondüit kalitesi (orientasyon, atraumatik hazırlık, yan dal bütünlüğü, pedikül korunumu) aynı GCKL görev puanlaması içinde doğrulanmalıdır.', { taskId: sterile?.id, clinicalKey: 'graft-prep-table' });
            statusMarker(1.10, 1.22, 1.45, sterile, 'Back Table', { role:'scrub', priority:'active', clinicalKey:'graft-prep-table', shortLabel:'Back Table' });

            // AKTİF ISITMA CİHAZI — steril çekirdek dışında, hasta ayak ucu dış hattı
            const cabgForcedWarmer = buildForcedAirWarmer(-2.85, 0, 1.95);
            addObj(cabgForcedWarmer, 'A4 · Aktif Isıtma Cihazı', 'Forced-air ısıtma ünitesi A7 sıcaklık tetik panelinden ayrıldı ve hasta ayak ucu dış hattına taşındı. Cihaz steril çekirdeğe girmez; hortum alt vücut ısıtma battaniyesine düşük profilli periferik hat üzerinden ulaşır. Mayo, greft hazırlık masası, ESU, KPB ve sirküle geçiş yolunu kapatmadan T <36°C amber erken yanıt ve T <35°C kırmızı kritik eskalasyonla ilişkilidir.', { taskId: warming?.id, clinicalKey: 'forced-air-warmer', severity: 'danger' });
            statusMarker(-2.85, 1.30, 1.95, warming, 'Aktif Isıtma', { role:'circulating', priority:'critical', clinicalKey:'forced-air-warmer', shortLabel:'Isıtma' });


            // ESU FOOTSWITCH (PEDAL) — Cerrahın sağ ayağı yanında
            // Premium çift pedal (cut/coag) + yer kablosu ESU'ya
            const cabgEsuPedal = (function() {
                const ped = new THREE.Group();
                ped.name = 'CABGEsuFootswitch';
                ped.position.set(-0.10, 0, -1.30);

                // Pedal taban (graphite, eğimli)
                ped.add(box(0.32, 0.030, 0.22, 0x2a3540, 0, 0.020, 0, { roughness: 0.50 }));
                // Anti-slip kauçuk taban
                ped.add(box(0.34, 0.008, 0.24, 0x12161c, 0, 0.005, 0, { roughness: 0.85 }));
                // Sol pedal (cut — sarı/mavi)
                const leftPedal = box(0.13, 0.040, 0.16, 0x4a7c8a, -0.080, 0.055, 0, { roughness: 0.45, metalness: 0.20 });
                leftPedal.rotation.x = -0.10;
                ped.add(leftPedal);
                // Sol pedal label (mavi LED şerit)
                ped.add(box(0.080, 0.004, 0.020, 0x4ec0e0, -0.080, 0.078, -0.060, {
                    emissive: 0x4ec0e0, emissiveIntensity: 0.45
                }));
                // Sağ pedal (coag — sarı)
                const rightPedal = box(0.13, 0.040, 0.16, 0xc89a4a, 0.080, 0.055, 0, { roughness: 0.45, metalness: 0.20 });
                rightPedal.rotation.x = -0.10;
                ped.add(rightPedal);
                // Sağ pedal label (sarı LED)
                ped.add(box(0.080, 0.004, 0.020, 0xf2c050, 0.080, 0.078, -0.060, {
                    emissive: 0xf2c050, emissiveIntensity: 0.45
                }));
                // Pedal koruma çıtası (üstte)
                ped.add(box(0.32, 0.014, 0.020, 0x4a5560, 0, 0.090, 0.090, { roughness: 0.40 }));
                // Pedal etiketleri (CUT / COAG küçük yazı arka planı)
                ped.add(box(0.024, 0.001, 0.012, 0xeef4f8, -0.080, 0.076, 0.060, { roughness: 0.50 }));
                ped.add(box(0.024, 0.001, 0.012, 0xeef4f8, 0.080, 0.076, 0.060, { roughness: 0.50 }));

                // Pedal kablo çıkış konektörü (arka)
                ped.add(cyl(0.012, 0.012, 0.020, 0x4a5560, 0, 0.030, -0.115, { seg: 12, metalness: 0.50, roughness: 0.30 }));
                ped.add(cyl(0.014, 0.014, 0.008, 0x12161c, 0, 0.030, -0.130, { seg: 12, roughness: 0.55 }));

                return ped;
            })();
            addObj(cabgEsuPedal, 'S5 · ESU Footswitch (Pedal)', 'Cerrahın sağ ayağı yanında çift pedal (cut + coag) — kablo periferik zeminden ESU\'ya kontrollü şekilde bağlanır.', { clinicalKey: 'esu-footswitch' });

            // ESU PEDAL KABLOSU — revize edildi
            // Çift pedal artık ESU kartına zeminden giden ince, kontrollü bir kablo ile bağlanır.
            // Hat steril çekirdeği kesmez; hasta ayak ucundan dış periferik hat boyunca dolaşır.
            (function addCabgEsuPedalCable(){
                const esuPedalPts = [
                    [-0.10, 0.024, -1.42],  // ESU pedal çıkışı
                    [0.32, 0.022, -1.58],
                    [0.92, 0.022, -1.62],
                    [1.48, 0.022, -1.56],
                    [1.92, 0.022, -1.22],
                    [2.18, 0.024, -0.50],
                    [2.20, 0.026, 0.34],
                    [2.10, 0.080, 1.05],
                    [1.98, 0.205, 1.34]    // ESU cihaz pedalı portuna fiziksel giriş
                ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
                const esuPedalCurve = new THREE.CatmullRomCurve3(esuPedalPts, false, 'catmullrom', 0.22);
                const esuPedalCable = new THREE.Mesh(
                    new THREE.TubeGeometry(esuPedalCurve, 96, 0.006, 8, false),
                    mat(0x2a3038, { roughness: 0.68, metalness: 0.04 })
                );
                esuPedalCable.castShadow = true; esuPedalCable.receiveShadow = true;
                esuPedalCable.name = 'CABG_ESU_Footswitch_Cable';
                addDecor(esuPedalCable);

                const esuPedalConn = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.014, 0.014, 0.035, 12),
                    mat(0x95a2ad, { metalness: 0.70, roughness: 0.20 })
                );
                esuPedalConn.position.set(1.98, 0.205, 1.34);
                esuPedalConn.rotation.z = Math.PI / 2;
                esuPedalConn.castShadow = true; esuPedalConn.receiveShadow = true;
                addDecor(esuPedalConn);

                // Düşük profilli kablo köprüsü: ESU hattı steril çekirdeği değil periferik zemini takip eder.
                [
                    [0.92, 0.032, -1.62, 0.34],
                    [2.18, 0.034, -0.50, 0.30]
                ].forEach(([cx, cy, cz, w]) => {
                    const bridge = new THREE.Mesh(
                        new THREE.BoxGeometry(w, 0.016, 0.070),
                        mat(0x343c45, { roughness: 0.70, metalness: 0.06 })
                    );
                    bridge.position.set(cx, cy, cz);
                    bridge.castShadow = true; bridge.receiveShadow = true;
                    addDecor(bridge);
                });
            })();

            // SUCTION + SMOKE EVAC HORTUMLARI — cerrahi sahadan suction tower'a (2.55, 0, -0.20)
            (function addSuctionSmokeHoses() {
                // Suction hortumu (şeffaf-beyaz, ince) — saha → tower üst giriş
                const suctionPts = [
                    [0.30, 1.090, -0.10],   // Yankauer ucu (sahada, scrub elinde)
                    [0.45, 1.060, -0.05],
                    [0.70, 1.000, 0.15],    // hastadan ayrıl
                    [1.10, 0.920, 0.05],
                    [1.60, 0.860, -0.05],
                    [2.10, 0.820, -0.12],
                    [2.45, 0.840, -0.18],
                    [2.55, 0.910, -0.20]    // tower üst giriş
                ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
                const sCurve = new THREE.CatmullRomCurve3(suctionPts);
                const sGeo = new THREE.TubeGeometry(sCurve, 80, 0.014, 10, false);
                const sHose = new THREE.Mesh(sGeo, mat(0xdce6ec, {
                    transparent: true, opacity: 0.78, roughness: 0.35, metalness: 0.08
                }));
                sHose.castShadow = true; sHose.receiveShadow = true;
                sHose.name = 'CABG_SuctionHose';
                addDecor(sHose);
                // Suction hortum spiral halkaları — azaltıldı; hortum artık kablo yumağı gibi görünmez.
                for (let i = 0; i < 6; i++) {
                    const t = 0.14 + i * 0.135;
                    const pt = sCurve.getPoint(t);
                    const ring = new THREE.Mesh(
                        new THREE.TorusGeometry(0.016, 0.0018, 6, 14),
                        mat(0x9aa6b2, { metalness: 0.40, roughness: 0.40 })
                    );
                    ring.position.copy(pt);
                    const tan = sCurve.getTangent(t);
                    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
                    ring.castShadow = true; ring.receiveShadow = true;
                    addDecor(ring);
                }
                // Suction konnektör (Yankauer ucu — krom, sahada)
                const sConn = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.018, 0.014, 0.040, 14),
                    mat(0xc7d0d8, { metalness: 0.65, roughness: 0.22 })
                );
                sConn.position.set(0.28, 1.090, -0.10);
                sConn.rotation.z = Math.PI / 2;
                sConn.castShadow = true; sConn.receiveShadow = true;
                addDecor(sConn);

                // Smoke evacuation hortumu — Mega Vac Plus → zemin hattı → hasta/cerrahi alan
                // Düzeltilmiş sürüm: hat cihaz portundan temiz çıkar, hemen zemine iner,
                // masa kenarından tek parça ilerler ve hasta/steril saha kenarında kısa bir
                // yükselişle sonlanır. Aspirasyon kulesine giden ikinci/yanlış smoke hattı yoktur.
                const smokeFloorPts = [
                    [2.68, 0.920, 1.016],   // Mega Vac üst portu: fiziksel temas noktası
                    [2.70, 0.520, 1.020],   // cihaz gövdesi boyunca kontrollü iniş
                    [2.70, 0.070, 1.020],   // zemin teması: cihaz önünde değil yanında
                    [2.38, 0.034, 0.820],
                    [1.92, 0.030, 0.600],
                    [1.38, 0.030, 0.410],
                    [0.82, 0.030, 0.270],
                    [0.28, 0.030, 0.180],
                    [-0.22, 0.034, 0.125],  // masa altı/yanı: steril alanı kesmeden ilerler
                    [-0.48, 0.220, 0.075],  // hasta kenarında kısa yükseliş başlangıcı
                    [-0.46, 0.720, 0.030],
                    [-0.36, 0.990, -0.015]  // duman kalemi/steril alan kenarı yakın ucu
                ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
                const smCurve = new THREE.CatmullRomCurve3(smokeFloorPts, false, 'catmullrom', 0.30);
                const smGeo = new THREE.TubeGeometry(smCurve, 112, 0.019, 12, false);
                const smHose = new THREE.Mesh(smGeo, mat(0x7653a0, {
                    roughness: 0.72, metalness: 0.03
                }));
                smHose.castShadow = true; smHose.receiveShadow = true;
                smHose.name = 'CABG_SmokeEvac_CleanFloorRoute';
                addDecor(smHose);

                // Hortum üzerindeki halkalar azaltıldı: önceki görünüm zeminde kopuk parça/kablo
                // hissi veriyordu. Sadece cihaz çıkışı, zemin başlangıcı ve hasta ucu işaretlenir.
                [0.04, 0.24, 0.48, 0.72, 0.90].forEach(t => {
                    const pt = smCurve.getPoint(t);
                    const ring = new THREE.Mesh(
                        new THREE.TorusGeometry(0.022, 0.0018, 6, 14),
                        mat(0xa78ccc, { metalness: 0.12, roughness: 0.66 })
                    );
                    ring.position.copy(pt);
                    const tan = smCurve.getTangent(t);
                    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
                    ring.castShadow = true; ring.receiveShadow = true;
                    addDecor(ring);
                });

                // Ayak pedalı kontrol kablosu — duman tahliye hortumunun yanında zeminden ilerler
                // ve scrub hemşiresinin ayağına yakın ama yürüyüş hattı dışında kalan aktif pedal ile sonlanır. İnce tutuldu;
                // hortumla karışmaz, steril alanı kesmez, zeminde boşta kopuk kablo bırakmaz.
                const pedalCablePts = [
                    [2.63, 0.100, 0.955],   // Mega Vac alt kontrol/foot switch portu
                    [2.62, 0.028, 1.045],   // cihaz dibinden zemine iniş
                    [2.22, 0.022, 1.230],
                    [1.68, 0.022, 1.420],
                    [1.06, 0.022, 1.545],
                    [0.46, 0.022, 1.600],
                    [-0.10, 0.022, 1.570],
                    [-0.38, 0.024, 1.475]   // scrub hemşire ayağına yakın pedal bağlantısı
                ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
                const pedalCableCurve = new THREE.CatmullRomCurve3(pedalCablePts, false, 'catmullrom', 0.26);
                const pedalCableGeo = new THREE.TubeGeometry(pedalCableCurve, 96, 0.0065, 8, false);
                const pedalCable = new THREE.Mesh(pedalCableGeo, mat(0x4f2b72, {
                    roughness: 0.62, metalness: 0.04,
                    emissive: 0x2d1045, emissiveIntensity: 0.10
                }));
                pedalCable.castShadow = true; pedalCable.receiveShadow = true;
                pedalCable.name = 'CABG_SmokeEvac_FootPedalCable';
                addDecor(pedalCable);

                // Düşük profilli smoke pedal kablo tutucuları: scrub ayağı çevresinde takılma riskini azaltır.
                [
                    [1.12, 0.030, 1.545, 0.30],
                    [0.12, 0.030, 1.580, 0.28]
                ].forEach(([cx, cy, cz, w]) => {
                    const holder = new THREE.Mesh(
                        new THREE.BoxGeometry(w, 0.014, 0.060),
                        mat(0x3b2a4b, { roughness: 0.72, metalness: 0.04 })
                    );
                    holder.position.set(cx, cy, cz);
                    holder.castShadow = true; holder.receiveShadow = true;
                    addDecor(holder);
                });

                // Duman tahliye ayak pedalı — basılı pozisyonda tasarlandı; mor LED aktif çekişi gösterir.
                const smokePedal = new THREE.Group();
                smokePedal.name = 'CABG_SmokeEvac_FootPedal_Active';
                smokePedal.position.set(-0.42, 0.034, 1.365);
                smokePedal.rotation.y = 0.20;
                const pedalBase = box(0.30, 0.040, 0.19, 0x252b31, 0, 0.020, 0, {
                    metalness: 0.35, roughness: 0.42
                });
                smokePedal.add(pedalBase);
                const pedalPlate = box(0.255, 0.026, 0.145, 0x7e55b7, 0, 0.060, -0.010, {
                    metalness: 0.18, roughness: 0.44,
                    emissive: 0x3e1e5f, emissiveIntensity: 0.22
                });
                pedalPlate.rotation.x = -0.24; // basılı pedal eğimi
                smokePedal.add(pedalPlate);
                const pedalHinge = cyl(0.014, 0.014, 0.28, 0x9aa7b3, 0, 0.052, 0.085, {
                    seg: 16, metalness: 0.66, roughness: 0.22
                });
                pedalHinge.rotation.z = Math.PI / 2;
                smokePedal.add(pedalHinge);
                const pedalLed = new THREE.Mesh(
                    new THREE.SphereGeometry(0.018, 16, 10),
                    mat(0xb05cff, { emissive: 0xb05cff, emissiveIntensity: 0.55, roughness: 0.28 })
                );
                pedalLed.position.set(0.105, 0.082, -0.035);
                pedalLed.castShadow = true; pedalLed.receiveShadow = true;
                smokePedal.add(pedalLed);
                const pedalCableSocket = cyl(0.010, 0.010, 0.045, 0xc5cbd2, -0.025, 0.042, 0.102, {
                    seg: 12, metalness: 0.70, roughness: 0.20
                });
                pedalCableSocket.rotation.x = Math.PI / 2;
                smokePedal.add(pedalCableSocket);
                addDecor(smokePedal);

                // Pedal kablosunun pedala fiziksel temasını güçlendiren kısa strain-relief parçası.
                const pedalStrainPts = [
                    [-0.38, 0.024, 1.475],
                    [-0.40, 0.030, 1.430],
                    [-0.42, 0.044, 1.455]
                ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
                const pedalStrainCurve = new THREE.CatmullRomCurve3(pedalStrainPts, false, 'catmullrom', 0.20);
                const pedalStrain = new THREE.Mesh(
                    new THREE.TubeGeometry(pedalStrainCurve, 24, 0.0075, 8, false),
                    mat(0x3a214f, { roughness: 0.60, metalness: 0.03 })
                );
                pedalStrain.castShadow = true; pedalStrain.receiveShadow = true;
                pedalStrain.name = 'CABG_SmokeEvac_FootPedalStrainRelief';
                addDecor(pedalStrain);

                // Cihaz portu: hortumun gerçekten Mega Vac çıkışına bağlı olduğunu gösterir.
                const smDeviceConn = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.034, 0.028, 0.050, 18),
                    mat(0xc7d0d8, { metalness: 0.70, roughness: 0.18 })
                );
                smDeviceConn.position.set(2.68, 0.920, 1.016);
                smDeviceConn.rotation.z = Math.PI / 2;
                smDeviceConn.castShadow = true; smDeviceConn.receiveShadow = true;
                addDecor(smDeviceConn);

                // Hasta/steril saha ucu: zeminden gelen hat kısa bir bağlantı nozulu ile biter;
                // yatak üzerine boş kablo gibi taşmaz.
                const smPatientConn = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.024, 0.017, 0.070, 16),
                    mat(0xc9d2d8, { metalness: 0.45, roughness: 0.36 })
                );
                smPatientConn.position.set(-0.36, 0.990, -0.015);
                smPatientConn.rotation.z = Math.PI / 2;
                smPatientConn.castShadow = true; smPatientConn.receiveShadow = true;
                addDecor(smPatientConn);

                // Mor aktiflik halkası cihaz ucunda tutuldu; hasta tarafında fazladan parça yok.
                const smActiveLed = new THREE.Mesh(
                    new THREE.SphereGeometry(0.014, 14, 10),
                    mat(0x8b00ff, { emissive: 0x8b00ff, emissiveIntensity: 0.80, roughness: 0.32 })
                );
                smActiveLed.position.set(2.68, 0.955, 1.018);
                smActiveLed.castShadow = true; smActiveLed.receiveShadow = true;
                addDecor(smActiveLed);
            })();

            addObj(buildCABGOpTablePatientV2(0.10, 0, 0.00), 'H1 · CABG Ameliyat Masası ve Hasta', 'CABG için özel entegre merkez kompozisyon: hibrit ameliyat masası, supin hasta, steril drape, sternotomi penceresi, düşük profilli sternal ekartör, KPB hatları, anestezi airway bağlantısı ve instrument surface tek model olarak yapılandırıldı. Eğitim görevi: time-out tamamlanmadan kesi başlatılmaz; normotermi >36°C, aktif alt vücut ısıtması, basınç noktası koruması, hat/dren güvenliği ve doğru prosedür teyidi birlikte değerlendirilir.', { taskId: timeout?.id, clinicalKey: 'time-out', severity: 'danger' });

            addObj(buildCPBMachineV2(4.08, 0, -0.30), 'K1 · Kalp-Akciğer Platformu (KPB)', 'Modern entegre KPB platformu — pompa modülü, oksjenatör, rezervuar, ısı değiştirici ve perfüzyonist konsolu (çift ekran + operatör paneli) tek compact gövdede toplandı. Hibrit OR\'larda yer kazandırır, perfüzyonistin tüm parametrelere ve acil durma butonuna tek noktadan erişimini sağlar.', { taskId: timeout?.id, clinicalKey: 'cpb-machine' });
            addObj(buildHuman(5.20, 0, 0.55, 'perfusion', 0x6f9fd8), 'K2 · Perfüzyonist', 'Perfüzyonist KPB makinesi ve konsol hattında, cerrahi ekibe yakın ama steril çekirdeğin dışında; ekran ve pompa başlarına aynı anda hakim olacak şekilde konumlandırıldı.', { taskId: timeout?.id, clinicalKey: 'perfusionist' });
            
            // 3) CABG-özel 6 statusMarker
            statusMarker(4.08, 1.42, 0.22, timeout, 'KPB', { role:'team', priority:'active', clinicalKey:'cpb-machine', shortLabel:'KPB' });
            statusMarker(5.20, 1.58, 0.55, timeout, 'K2 · Perfüzyonist', { role:'team', priority:'active', clinicalKey:'perfusionist', shortLabel:'Perfüzyonist' });
            
            // CABG'de OLMAYANLAR (ortho profilinde geri gelecek):
            //   #16 portable-carm (Skopi/C-arm) — buildPortableCArm
            //   #17 radiation-safety (Radyasyon Güvenliği Seti) — buildRadiationSafetySet
        }
        /* ===================== /İO-2 ===================== */

        /* ===================== İO-3: buildIntraopOrtho (Yol A — minimal) =====================
         * Hedef: Ortopedi vakaları için doğru sahne. CABG-grubu (KPB, perfüzyon konsolu, perfüzyonist,
         * greft masası, kan ısıtıcı + hızlı infüzyon, asistan scrub) GÖRÜNMEYECEK; bunun yerine
         * skopi (C-arm) ve radyasyon güvenliği seti EKLENECEK.
         *
         * Yol A kapsamı: yalnızca common-core + skopi + radyasyon. Ortopediye özgü ek nesneler
         * (turnike, ekstremite traksiyon masası, kol/bacak destekleri) ileride İO-3.5'te ayrı bir
         * iş paketinde modellenip eklenecek.
         *
         * Doğrulama:
         *   App.currentPatient = CASES.ortho_main; App.currentRoom = 'intraop'; buildSceneForRoom();
         *   -> sahnede SKOPI ve RADYASYON SETİ GÖRÜNMELİ
         *   -> sahnede KPB, PERFÜZYON KONSOLU, PERFÜZYONIST GÖRÜNMEMELİ
         *   -> ASISTAN SCRUB ve GREFT MASASI GÖRÜNMEMELİ
         */
        function buildIntraopOrtho() {
            // 1) Önce ortak çekirdek
            buildIntraopCommonCore();

            // 2) Ortho-özel objeler (mevcut build fonksiyonları kullanılıyor, yeni model yok)
            const timeout = taskByKeywords(['time-out', 'ekip tanıtımı', 'kimlik/işlem']);

            addObj(buildPortableCArm(-4.10, 0, -2.85), '16 · Skopi / Portable Röntgen Cihazı', 'Portable skopi (C-kol) ameliyat sahasına gerektiğinde görüntüleme desteği verecek şekilde, ancak ana dolaşım yolunu ve steril çekirdeği kapatmayacak kenar hatta park edilmiştir.', { taskId: timeout?.id, clinicalKey: 'portable-carm' });
            addObj(buildRadiationSafetySet(-4.95, 0, -2.70), '17 · Radyasyon Güvenliği Seti', 'Kurşun önlük, tiroid koruyucu ve radyasyon uyarı alanı portable skopi ile birlikte konumlandırıldı; görüntüleme sırasında personel korunmasını öğretir.', { taskId: timeout?.id, clinicalKey: 'radiation-safety' });

            // 3) Ortho-özel statusMarker'lar
            statusMarker(-4.10, 1.45, -2.85, timeout, 'Skopi', { role:'team', priority:'active', clinicalKey:'portable-carm', shortLabel:'Skopi' });
            statusMarker(-4.95, 1.05, -2.70, timeout, 'Radyasyon', { role:'team', priority:'active', clinicalKey:'radiation-safety', shortLabel:'Radyasyon' });

            // İO-3.5'te eklenecek (henüz build fonksiyonları yok):
            //   - Pnömatik turnike (ekstremite kanama kontrolü)
            //   - Ekstremite traksiyon / fiksatör masası
            //   - Bacak askısı / kol tahtası pozisyonlama destekleri
        }
        /* ===================== /İO-3 ===================== */

        /* ===================== İO-4: buildIntraopLap =====================
         * Hedef: Laparoskopik kolesistektomi vakaları için doğru sahne. CABG-grubu (KPB,
         * perfüzyon konsolu, perfüzyonist, greft masası, kan ısıtıcı + hızlı infüzyon,
         * asistan scrub) GÖRÜNMEYECEK; ortho-grubu (skopi, radyasyon seti) de
         * GÖRÜNMEYECEK. Bunların yerine lap-özgü 3 obje EKLENECEK:
         *   - Laparoskopi kulesi (kamera + ışık + insüflator + DVR + üstte primer monitör)
         *   - CO₂ tüpü (insüflasyon gazı)
         *   - Sekonder monitör (head-end yakını, anestezi/asistan görüş hattı)
         *
         * Klinik konum prensibi: Kule, cerrahın KARŞI tarafına (sol omuz hattı) konumlandırılır
         * çünkü laparoskopik cerrahide cerrah ekranı karşıdan izler. CO₂ tüpü kule yanı duvar
         * dibine; sekonder monitör head-end (anestezi tarafı) yakınına.
         *
         * #22 kan/sıvı ısıtıcı: lap kolesistektomi <90 dk vakalarda kritik değil; aktif ısıtma
         * battaniyesi (mevcut common-core içinde) yeterli kabul edildi. İO-4.5'te basit ısıtıcı
         * eklenebilir.
         *
         * Doğrulama:
         *   App.currentPatient = CASES.lap_main; App.currentRoom = 'intraop'; buildSceneForRoom();
         *   -> sahnede LAP KULESİ, CO₂ TÜPÜ, SEKONDER MONİTÖR görünmeli
         *   -> KPB, PERFÜZYON KONSOLU, PERFÜZYONIST, GREFT MASASI, ASISTAN SCRUB görünmemeli
         *   -> SKOPI ve RADYASYON SETİ görünmemeli
         */
        function buildIntraopLap() {
            // 1) Önce ortak çekirdek
            buildIntraopCommonCore();

            // 2) Lap-özel objeler
            const timeout = taskByKeywords(['time-out', 'ekip tanıtımı', 'kimlik/işlem']);
            const signIn  = taskByKeywords(['sign-in', 'alerji', 'anestezi']);

            addObj(buildLaparoscopicTower(2.40, 0, -1.60), '36 · Laparoskopi Kulesi', 'Laparoskopi kulesi cerrahın karşı omuz hattına yerleştirildi. Kamera kontrol ünitesi, ışık kaynağı, CO₂ insüflatörü, kayıt cihazı ve üstte primer cerrah monitörü tek bir kule üzerinde toplandı; cerrah kesi sırasında ekrana karşıdan bakar.', { taskId: timeout?.id, clinicalKey: 'lap-tower' });
            addObj(buildCO2Tank(2.95, 0, -2.10), '37 · CO₂ Tüpü ve Regülatör', 'CO₂ tüpü laparoskopi kulesinin yanına, dolaşım hattını engellemeyecek şekilde duvar dibine yerleştirildi; regülatör ve manometre sürekli izlenebilir, hortum kuleye direkt bağlıdır.', { taskId: signIn?.id, clinicalKey: 'co2-tank' });
            addObj(buildSecondaryLapMonitor(-1.80, 1.55, -1.60), '38 · Sekonder Lap Monitör', 'İkinci monitör head-end tarafına yerleştirildi; anestezi ekibi ve asistan cerrah ana kuleye bakmadan da operatif sahayı izleyebilir. Ekip iletişimi ve durumsal farkındalık artar.', { taskId: timeout?.id, clinicalKey: 'lap-monitor-2' });

            // 3) Lap-özel statusMarker'lar
            statusMarker(2.40, 1.70, -1.60, timeout, 'Lap Kule', { role:'team', priority:'critical', clinicalKey:'lap-tower', shortLabel:'Lap Kule' });
            statusMarker(2.95, 1.42, -2.10, signIn,  'CO₂',      { role:'anaesthesia', priority:'critical', clinicalKey:'co2-tank', shortLabel:'CO₂' });
            statusMarker(-1.80, 1.78, -1.60, timeout, '2. Mon',  { role:'team', priority:'active', clinicalKey:'lap-monitor-2', shortLabel:'2. Mon' });

            // İO-4.5'te eklenebilir:
            //   - Trokar / Veress iğne tepsisi (steril aletlere ek)
            //   - Lap-uyumlu enerji platformu (advanced bipolar / ultrasonik) — mevcut ESU kalır
            //   - Basit kan/sıvı ısıtıcı (uzun lap vakaları için)
        }
        /* ===================== /İO-4 ===================== */

        /* ===================== İO-5: buildIntraopTrauma =====================
         * Hedef: Acil nörotrauma vakaları için doğru sahne. CABG-grubu (KPB, perfüzyon konsolu,
         * perfüzyonist, greft masası, kan ısıtıcı + hızlı infüzyon, asistan scrub), ortho-grubu
         * (skopi, radyasyon) ve lap-grubu (laparoskop kulesi, CO₂ tüpü, sekonder lap monitör)
         * GÖRÜNMEYECEK. Bunların yerine trauma+nöro-özel 5 obje EKLENECEK:
         *   - Cerrahi mikroskop (boom kollu, çift okülerli) — kraniyotomi sırasında zorunlu
         *   - Kraniyotom kartı ve yüksek hızlı tur — kemik flep kaldırma
         *   - Nöronavigasyon kulesi (optik kameralı) — sterotaktik rehber
         *   - Hızlı kan/sıvı transfüzörü (Belmont/Level-1 tipi) — trauma resüsitasyonu
         *   - RSI ilaç tepsisi — hızlı sekansiyel intübasyon (etomidat, rocuronium, fentanyl,
         *     atropin)
         *
         * Klinik konum prensibi:
         *   - Mikroskop: hasta başı üstünde, boom tavandan sallanır (head-end yakını)
         *   - Kraniyotom kartı: scrub/cerrah hattında, mayo masasına yakın
         *   - Nöronavigasyon: cerrahın görüş hattında, hastanın sol-arka köşesi
         *   - Hızlı transfüzör: anestezi tarafı, kan ürünü hattında
         *   - RSI tepsisi: anestezi cihazı yakını, hızlı erişim
         *
         * Acil GCKL yorumu: sign-in kısaltılmış (alerji bilinmiyor → "bilinmiyor"); time-out
         * 60 saniyede; sayım acilde bile yapılır (AORN); sign-out post-YBÜ teslim ile birleşir.
         *
         * Doğrulama:
         *   App.currentPatient = CASES.trauma_main; App.currentRoom = 'intraop'; buildSceneForRoom();
         *   -> sahnede MİKROSKOP, KRANİYOTOM, NÖRONAVİGASYON, HIZLI TRANSFÜZÖR, RSI TEPSİSİ görünmeli
         *   -> KPB, perfüzyonist, greft masası, asistan scrub görünmemeli
         *   -> skopi, radyasyon seti görünmemeli
         *   -> laparoskop kulesi, CO₂ tüpü, sekonder lap monitör görünmemeli
         */
        function buildIntraopTrauma() {
            // 1) Önce ortak çekirdek
            buildIntraopCommonCore();

            // 2) Trauma + nöro-özel objeler
            const timeout = taskByKeywords(['time-out', 'ekip tanıtımı', 'kimlik/işlem']);
            const signIn  = taskByKeywords(['sign-in', 'alerji', 'anestezi']);
            const sterile = taskByKeywords(['steril', 'antibiyotik']);

            // Mikroskop — head-end yakını, hasta başı üstünde (tavandan sallanır)
            addObj(buildSurgicalMicroscope(0.10, 0, -0.85), '39 · Cerrahi Mikroskop',
                   'Cerrahi mikroskop hasta başı üstünde, tavandan sallanan boom kolu üzerinde konumlandırıldı. Kraniyotomi sırasında dural ve kortikal anatominin yüksek büyütmede güvenle değerlendirilmesini sağlar; çift okülerli baş + asistan tüpü ekip eğitimine de izin verir.',
                   { taskId: timeout?.id, clinicalKey: 'surgical-microscope' });

            // Kraniyotom kartı — scrub/cerrah hattında, mayo yakını
            addObj(buildCraniotomeDrill(1.95, 0, -0.92), '40 · Kraniyotom / Yüksek Hızlı Tur',
                   'Kraniyotom kartı cerrah ve scrub hemşire arasındaki steril hatta yerleştirildi. Yüksek hızlı tur ve perforator kemik flep kaldırma için sırayla kullanılır; el aletleri kart üstünde hazır vaziyette.',
                   { taskId: sterile?.id, clinicalKey: 'craniotome-drill' });

            // Nöronavigasyon — cerrahın görüş hattında, sol-arka köşe
            addObj(buildNeuronavigationSystem(-3.10, 0, -2.40), '41 · Nöronavigasyon Sistemi',
                   'Nöronavigasyon kulesi cerrahın görüş hattında, hastanın sol-arka köşesinde konumlandırıldı. Optik kamera direği steril alana doğru bakar; preoperatif görüntü ve anatomik harita sterotaktik rehberliği sağlar.',
                   { taskId: timeout?.id, clinicalKey: 'neuronavigation' });

            // Hızlı transfüzör — anestezi tarafı, kan ürünü hattı
            addObj(buildRapidTransfuser(-5.10, 0, -1.20), '42 · Hızlı Kan/Sıvı Transfüzörü',
                   'Belmont/Level-1 tipi hızlı transfüzör anestezi zonunun arka hattında, kan ürünü buzdolabına yakın konumlandırıldı. Trauma resüsitasyonunda 1:1:1 ürün oranı ve aktif ısıtma eş zamanlı uygulanır; trauma triadı (hipotermi-asidoz-koagülopati) bu üniteyle yönetilir.',
                   { taskId: signIn?.id, clinicalKey: 'rapid-transfuser' });

            // RSI tepsisi — anestezi cihazı yakını
            addObj(buildRSIMedicationTray(-3.40, 1.05, -0.80), '43 · RSI İlaç Tepsisi',
                   'Hızlı sekansiyel intübasyon ilaç tepsisi anestezi cihazı yanında, çekilebilir bir tezgah üzerinde hazır vaziyette. Renk kodlu şırıngalar: etomidat (sarı, indüksiyon), rocuronium (turuncu, kas gevşetici — kritik renk kod), fentanyl (mavi, opioid), atropin (kırmızı, vagolitik). Acil hava yolu güvenliği için saniyeler kritiktir.',
                   { taskId: signIn?.id, clinicalKey: 'rsi-tray' });

            // 3) Trauma-özel statusMarker'lar
            statusMarker(0.10, 1.85, -0.85, timeout, 'Mikroskop',
                        { role:'team', priority:'critical', clinicalKey:'surgical-microscope', shortLabel:'Mikroskop' });
            statusMarker(1.95, 0.78, -0.92, sterile, 'Kraniyotom',
                        { role:'scrub', priority:'critical', clinicalKey:'craniotome-drill', shortLabel:'Kraniyotom' });
            statusMarker(-3.10, 1.62, -2.40, timeout, 'Nöro Nav.',
                        { role:'team', priority:'critical', clinicalKey:'neuronavigation', shortLabel:'Nöro Nav.' });
            statusMarker(-5.10, 1.45, -1.20, signIn, 'Hızlı Trans.',
                        { role:'anaesthesia', priority:'critical', clinicalKey:'rapid-transfuser', shortLabel:'Hızlı Trans.' });
            statusMarker(-3.40, 1.32, -0.80, signIn, 'RSI',
                        { role:'anaesthesia', priority:'critical', clinicalKey:'rsi-tray', shortLabel:'RSI' });

            // İO-5.5'te eklenebilir:
            //   - ICP monitör (intrakraniyal basınç probu sistemi)
            //   - Kan ürünü buzdolabı (kan bankası mini-ünitesi)
            //   - Trauma görüntüleme istasyonu (BT/MR ekran kopyası)
            //   - Sterotaktik referans çerçevesi (hasta başına bağlanan)
        }
        /* ===================== /İO-5 ===================== */

        const __nk_original_buildIntraop = buildIntraop;
        buildIntraop = function() {
            const profile = surgicalSceneProfile(App.currentPatient);
            if (window.NK_DEBUG_DISPATCHER) {
                const pid = (App.currentPatient && App.currentPatient.id) ? App.currentPatient.id : 'none';
                console.log('[NK] surgicalSceneProfile=' + profile + ' (patient=' + pid + ')');
            }
            // İO-2: CABG branch aktif
            if (profile === 'cabg') return buildIntraopCABG();
            // İO-3: ortho branch aktif
            if (profile === 'ortho') return buildIntraopOrtho();
            // İO-4: lap branch aktif
            if (profile === 'lap') return buildIntraopLap();
            // İO-5: trauma branch aktif
            if (profile === 'trauma') return buildIntraopTrauma();
            return __nk_original_buildIntraop.apply(this, arguments);
        };

        // Konsol test erişimi (strict mode'da otomatik global olmaz):
        window.surgicalSceneProfile = surgicalSceneProfile;
        window.buildIntraopCommonCore = buildIntraopCommonCore;
        window.buildIntraopCABG = buildIntraopCABG;
        window.buildIntraopOrtho = buildIntraopOrtho;
        window.buildIntraopLap = buildIntraopLap;
        window.buildIntraopTrauma = buildIntraopTrauma;
        /* ===================== /İO-1 ===================== */

