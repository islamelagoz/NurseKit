        'use strict';

        /* ============================================================
           OSCE-PHDYÖ — Perioperatif Hemşirelik Dinamik Yetkinlik
           Ölçeği (v1.2) — Güvenli Cerrahi entegrasyonu
           37 madde / 100 puan
           Pre-op (PRE-1..13) = 35p
           Intra-op (INT-1..13) = 35p
           Post-op (POST-1..11) = 30p
           ============================================================ */
        const OSCE_PHDYO = {
            version: '1.2',
            phaseMax: { preop: 35, intraop: 35, postop: 30 },
            // Kritik hata cap'leri — birden fazla aktifse en düşüğü uygulanır
            criticalCaps: {
                identityMissed: 70,
                surgeryVerificationMissed: 65,
                siteVerificationMissed: 65,
                consentMissed: 70,
                allergyMissed: 75,
                npoMissed: 80,
                timeOutMissed: 70,
                antibioticCheckMissed: 80,
                countMissed: 70,
                signOutMissed: 70,
                pacuHandoverMissed: 80,
                majorRiskMissed: 75
            },
            // 5'li Likert çapaları
            likert: [
                { v: 0, label: '0 — Yapmadı / Hatalı' },
                { v: 1, label: '1 — Eksik / Yanlış sıralama' },
                { v: 2, label: '2 — Kısmen doğru' },
                { v: 3, label: '3 — Doğru ama gerekçesiz' },
                { v: 4, label: '4 — Tam ve gerekçeli' }
            ],
            items: [
                /* ============== PRE-OP (35 puan) ============== */
                { id: 'PRE-1',  phase: 'preop', max: 3, criticalKey: null,
                  title: 'Hasta karşılama ve tanışma',
                  criterion: 'Hastayı uygun şekilde karşılar, kendini tanıtır, güven verir.',
                  rq: { id: 'RQ-PRE-1', q: 'Hastayla ilk temasta hangi 3 unsuru aktarmak ön plana çıkmalıdır?',
                        expected: ['kimlik','rol','süreç','gizlilik','onam'], weight: 1 } },
                { id: 'PRE-2',  phase: 'preop', max: 4, criticalKey: 'identityMissed',
                  title: 'Kimlik doğrulama (2 belirteç + bileklik)',
                  criterion: 'Ad-soyad ve doğum tarihi/protokol no ile çift doğrulama yapar; bilekliği kontrol eder.',
                  rq: { id: 'RQ-PRE-2', q: 'Kimlik doğrulamada hangi iki belirteç zorunludur ve neden?',
                        expected: ['ad soyad','doğum tarihi','protokol','bileklik'], weight: 2 } },
                { id: 'PRE-3',  phase: 'preop', max: 3, criticalKey: 'surgeryVerificationMissed',
                  title: 'Yapılacak ameliyatın doğrulanması',
                  criterion: 'Hastadan ve onamdan ameliyat türünü teyit eder.',
                  rq: { id: 'RQ-PRE-3', q: 'Hastadan alınan ameliyat tanımı onamla çelişirse ne yaparsınız?',
                        expected: ['durdur','cerrah','onam','yenile'], weight: 1 } },
                { id: 'PRE-4',  phase: 'preop', max: 3, criticalKey: 'siteVerificationMissed',
                  title: 'Ameliyat tarafı/bölgesi işaretleme doğrulaması',
                  criterion: 'Cerrahın işaretlemesini hasta uyanıkken doğrular.',
                  rq: { id: 'RQ-PRE-4', q: 'Bölge işaretlemesi yoksa veya yanlışsa adımlar nelerdir?',
                        expected: ['durdur','cerrah','time-out','işaretleme'], weight: 1 } },
                { id: 'PRE-5',  phase: 'preop', max: 3, criticalKey: 'consentMissed',
                  title: 'Aydınlatılmış onamın varlığı ve geçerliliği',
                  criterion: 'Onam belgesinin doğru hastaya, doğru ameliyat için, imzalı ve tarihli olduğunu doğrular.',
                  rq: { id: 'RQ-PRE-5', q: 'Onam eksik/uyumsuz ise hangi adım izlenir?',
                        expected: ['durdur','cerrah','onam yenile','etik'], weight: 1 } },
                { id: 'PRE-6',  phase: 'preop', max: 3, criticalKey: 'allergyMissed',
                  title: 'Alerji ve ilaç hassasiyeti sorgusu',
                  criterion: 'İlaç, lateks ve gıda alerjilerini sorgular, kayda geçer, kırmızı bileklikle işaretler.',
                  rq: { id: 'RQ-PRE-6', q: 'Lateks alerjisi tespit edilirse intra-op için hangi 2 önlem alınır?',
                        expected: ['lateks-free','setup','iletişim','tabela'], weight: 1 } },
                { id: 'PRE-7',  phase: 'preop', max: 3, criticalKey: 'npoMissed',
                  title: 'NPO (açlık) durumunun doğrulanması',
                  criterion: 'Son katı/sıvı alım saatini sorgular ve protokole uygunluğunu değerlendirir.',
                  rq: { id: 'RQ-PRE-7', q: 'NPO ihlali varsa risk ve yönetim nedir?',
                        expected: ['aspirasyon','erteleme','anestezi','iletişim'], weight: 1 } },
                { id: 'PRE-8',  phase: 'preop', max: 3, criticalKey: null,
                  title: 'Vital bulgu ve baseline değerlendirme',
                  criterion: 'KB, nabız, SpO₂, ateş, solunum ölçer; sapmaları bildirir.',
                  rq: { id: 'RQ-PRE-8', q: 'Hangi vital sapma ameliyatın ertelenmesini gerektirir?',
                        expected: ['hipertansiyon','ateş','desatürasyon','aritmi'], weight: 1 } },
                { id: 'PRE-9',  phase: 'preop', max: 2, criticalKey: null,
                  title: 'Premedikasyon ve profilaktik antibiyotik hazırlığı',
                  criterion: 'Order edilen premedikasyonu doğrular; antibiyotik zamanlamasını planlar.',
                  rq: { id: 'RQ-PRE-9', q: 'Profilaktik antibiyotik insizyondan kaç dk önce verilmelidir?',
                        expected: ['60','30-60','insizyon','vankomisin 120'], weight: 1 } },
                { id: 'PRE-10', phase: 'preop', max: 2, criticalKey: null,
                  title: 'Cerrahi tıraş, banyo ve cilt hazırlığı kontrolü',
                  criterion: 'Cilt bütünlüğünü değerlendirir, gerekirse uygun yöntemle tıraş planlar.',
                  rq: { id: 'RQ-PRE-10', q: 'Jilet yerine klipper tercih edilmesinin gerekçesi?',
                        expected: ['mikroçatlak','enfeksiyon','SSI'], weight: 1 } },
                { id: 'PRE-11', phase: 'preop', max: 2, criticalKey: null,
                  title: 'Protez/takı/lens/diş çıkarımı kontrolü',
                  criterion: 'Hareketli protez, takı, lens, diş, peruğu çıkartır ve teslim alır.',
                  rq: { id: 'RQ-PRE-11', q: 'Çıkarılmayan metal takının riski nedir?',
                        expected: ['koter','yanık','MR','elektrik'], weight: 1 } },
                { id: 'PRE-12', phase: 'preop', max: 2, criticalKey: 'majorRiskMissed',
                  title: 'VTE / kanama / düşme risk değerlendirmesi',
                  criterion: 'Caprini/Padua veya kurum protokolüne göre risk skorlar; önlem planlar.',
                  rq: { id: 'RQ-PRE-12', q: 'Yüksek VTE riskinde 2 mekanik önlem nedir?',
                        expected: ['kompresyon','çorap','pnömatik','mobilizasyon'], weight: 1 } },
                { id: 'PRE-13', phase: 'preop', max: 2, criticalKey: null,
                  title: 'Sign-In: Anestezi öncesi kontrol listesi',
                  criterion: 'WHO Sign-In maddelerini hasta uyanıkken tamamlar.',
                  rq: { id: 'RQ-PRE-13', q: 'Sign-In hangi 4 zorunlu maddeyi kapsar?',
                        expected: ['kimlik','bölge','onam','alerji','airway','kanama'], weight: 1 } },

                /* ============== INTRA-OP (35 puan) ============== */
                { id: 'INT-1',  phase: 'intraop', max: 4, criticalKey: 'timeOutMissed',
                  title: 'Time-Out (insizyon öncesi duraklama)',
                  criterion: 'Tüm ekip durur; doğru hasta/işlem/bölge ekipçe sözel olarak teyit edilir.',
                  rq: { id: 'RQ-INT-1', q: 'Time-Out kim tarafından başlatılır ve hangi 5 madde teyit edilir?',
                        expected: ['hemşire','cerrah','doğru hasta','işlem','bölge','antibiyotik','görüntü'], weight: 2 } },
                { id: 'INT-2',  phase: 'intraop', max: 3, criticalKey: 'antibioticCheckMissed',
                  title: 'Profilaktik antibiyotik uygulama doğrulaması',
                  criterion: 'Time-Out sırasında antibiyotik verildiğini ve zamanlamayı sözel olarak doğrular.',
                  rq: { id: 'RQ-INT-2', q: 'Antibiyotik insizyondan >60 dk önce verildiyse ne yapılır?',
                        expected: ['tekrar','redoz','iletişim'], weight: 1 } },
                { id: 'INT-3',  phase: 'intraop', max: 3, criticalKey: null,
                  title: 'Hasta pozisyonu ve baskı bölgesi koruması',
                  criterion: 'Sinir, eklem, periferik nabız korunarak pozisyon verir; ped uygular.',
                  rq: { id: 'RQ-INT-3', q: 'Litotomi pozisyonunda en sık zedelenen sinir hangisidir?',
                        expected: ['peroneal','siyatik','femoral','obtirator'], weight: 1 } },
                { id: 'INT-4',  phase: 'intraop', max: 3, criticalKey: null,
                  title: 'Steril alan kurulumu ve asepsi',
                  criterion: 'Sahanın sterilliğini sürdürür; ihlali tespit eder ve düzeltir.',
                  rq: { id: 'RQ-INT-4', q: 'Steril ihlali olduğunda hemşire önce ne yapar?',
                        expected: ['durdur','iletişim','değiştir','bildir'], weight: 1 } },
                { id: 'INT-5',  phase: 'intraop', max: 3, criticalKey: 'countMissed',
                  title: 'Açılış kompres/iğne/alet sayımı',
                  criterion: 'İnsizyondan önce skrub ile birlikte sayım yapar ve kayıt altına alır.',
                  rq: { id: 'RQ-INT-5', q: 'Sayımda fark çıkarsa adımlar nelerdir?',
                        expected: ['durdur','tekrar say','görüntüleme','rapor'], weight: 1 } },
                { id: 'INT-6',  phase: 'intraop', max: 2, criticalKey: null,
                  title: 'Cilt antisepsisi ve drape',
                  criterion: 'Uygun antiseptiği seçer, sürer, kuruma süresine uyar.',
                  rq: { id: 'RQ-INT-6', q: 'Klorheksidin-alkol kuruma süresi nedir, neden önemlidir?',
                        expected: ['3','dk','yangın','koter'], weight: 1 } },
                { id: 'INT-7',  phase: 'intraop', max: 2, criticalKey: null,
                  title: 'Normotermi ve sıcaklık yönetimi',
                  criterion: 'Vücut ısısını izler, aktif ısıtma uygular.',
                  rq: { id: 'RQ-INT-7', q: 'Hipotermi (<36 °C) hangi 2 komplikasyonla ilişkilidir?',
                        expected: ['SSI','koagülopati','kardiyak','kanama'], weight: 1 } },
                { id: 'INT-8',  phase: 'intraop', max: 3, criticalKey: null,
                  title: 'Sıvı dengesi, kanama ve hemodinami izlemi',
                  criterion: 'Aldığı-çıkardığı, kan kaybı, idrar çıkışını izler ve raporlar.',
                  rq: { id: 'RQ-INT-8', q: 'Beklenmeyen kanamada ilk 3 hemşirelik girişimi?',
                        expected: ['cerraha bildir','kan iste','damar yolu','vital'], weight: 1 } },
                { id: 'INT-9',  phase: 'intraop', max: 2, criticalKey: null,
                  title: 'Anestezi desteği (entübasyon, hava yolu, ilaç çekme)',
                  criterion: 'Anestezi ekibine güvenli destek verir, ilaç yüksek-risk önlemlerini uygular.',
                  rq: { id: 'RQ-INT-9', q: 'Yüksek-riskli ilaçlarda “double-check” neden zorunludur?',
                        expected: ['hata','iki imza','güvenlik'], weight: 1 } },
                { id: 'INT-10', phase: 'intraop', max: 2, criticalKey: null,
                  title: 'Ekipman, koter, turnike güvenliği',
                  criterion: 'Koter plak yerleşimi, turnike basınç/süresini takip eder.',
                  rq: { id: 'RQ-INT-10', q: 'Turnike süresi >2 saatte hangi komplikasyon riski artar?',
                        expected: ['iskemi','sinir hasarı','rabdomiyoliz'], weight: 1 } },
                { id: 'INT-11', phase: 'intraop', max: 2, criticalKey: null,
                  title: 'Spesimen yönetimi ve etiketleme',
                  criterion: 'Spesimeni doğru etiketler, kayıt eder, transferi sağlar.',
                  rq: { id: 'RQ-INT-11', q: 'Spesimen yanlış etiketlenirse hasta için risk nedir?',
                        expected: ['yanlış tanı','tekrar ameliyat','medikolegal'], weight: 1 } },
                { id: 'INT-12', phase: 'intraop', max: 3, criticalKey: 'countMissed',
                  title: 'Kapanış sayımı',
                  criterion: 'Kapanış öncesi tam sayım yapar; uyumsuzluğu rapor eder.',
                  rq: { id: 'RQ-INT-12', q: 'Sayım uyuşmazlığında neden görüntüleme önerilir?',
                        expected: ['retained','RFB','radyolojik','ihmal'], weight: 1 } },
                { id: 'INT-13', phase: 'intraop', max: 3, criticalKey: 'signOutMissed',
                  title: 'Sign-Out (kapanış sözel teyidi)',
                  criterion: 'İşlem adı, sayım, spesimen, ekipman sorunları ekipçe teyit edilir.',
                  rq: { id: 'RQ-INT-13', q: 'Sign-Out hangi 4 maddeyi içerir?',
                        expected: ['işlem adı','sayım','spesimen','ekipman','dikkat'], weight: 1 } },

                /* ============== POST-OP (30 puan) ============== */
                { id: 'POST-1', phase: 'postop', max: 4, criticalKey: 'pacuHandoverMissed',
                  title: 'PACU teslim — SBAR ile yapılandırılmış devir',
                  criterion: 'Anestezi+cerrah+hemşire ile SBAR formatında teslim alır.',
                  rq: { id: 'RQ-POST-1', q: 'SBAR’ın 4 bileşenini ve neden standart olduğunu açıklayın.',
                        expected: ['situation','background','assessment','recommendation','iletişim'], weight: 2 } },
                { id: 'POST-2', phase: 'postop', max: 3, criticalKey: null,
                  title: 'Hava yolu açıklığı ve solunum değerlendirmesi',
                  criterion: 'Solunum sayısı, SpO₂, hava yolu refleksleri kontrol edilir.',
                  rq: { id: 'RQ-POST-2', q: 'Postop laringospazm ilk yönetiminde 2 girişim?',
                        expected: ['pozitif basınç','jaw thrust','oksijen','iletişim'], weight: 1 } },
                { id: 'POST-3', phase: 'postop', max: 3, criticalKey: null,
                  title: 'Hemodinami ve perfüzyon izlemi',
                  criterion: 'KB, nabız, perfüzyon, idrar çıkışını izler; sapmaları yönetir.',
                  rq: { id: 'RQ-POST-3', q: 'Hipotansiyonda ilk 3 hemşirelik girişimi?',
                        expected: ['pozisyon','sıvı','iletişim','vital'], weight: 1 } },
                { id: 'POST-4', phase: 'postop', max: 3, criticalKey: null,
                  title: 'Ağrı yönetimi ve analjezi',
                  criterion: 'Ağrıyı doğru ölçekle değerlendirir, çok modlu analjeziyi uygular.',
                  rq: { id: 'RQ-POST-4', q: 'Postop opioid sonrası en kritik izlem nedir?',
                        expected: ['solunum','sedasyon','SpO₂'], weight: 1 } },
                { id: 'POST-5', phase: 'postop', max: 3, criticalKey: null,
                  title: 'Bulantı-kusma (PONV) yönetimi',
                  criterion: 'PONV riskini Apfel ile skorlar; profilaktik tedavi uygular.',
                  rq: { id: 'RQ-POST-5', q: 'Apfel skorunda 4 risk faktörü nedir?',
                        expected: ['kadın','non-smoker','PONV öyküsü','opioid'], weight: 1 } },
                { id: 'POST-6', phase: 'postop', max: 3, criticalKey: null,
                  title: 'Sıvı, kan ürünü ve elektrolit yönetimi',
                  criterion: 'Aldığı-çıkardığı takibi yapar; kan ürünü protokolüne uyar.',
                  rq: { id: 'RQ-POST-6', q: 'Transfüzyon reaksiyonu şüphesinde ilk 3 adım?',
                        expected: ['durdur','vital','iletişim','örnek'], weight: 1 } },
                { id: 'POST-7', phase: 'postop', max: 3, criticalKey: null,
                  title: 'Yara, dren ve insizyon değerlendirmesi',
                  criterion: 'İnsizyon, dren içeriği ve miktarı, kanamayı izler.',
                  rq: { id: 'RQ-POST-7', q: 'Dren içeriğinde ani artışta ne yaparsınız?',
                        expected: ['cerraha bildir','vital','kanama','laboratuvar'], weight: 1 } },
                { id: 'POST-8', phase: 'postop', max: 3, criticalKey: null,
                  title: 'Termoregülasyon ve titreme yönetimi',
                  criterion: 'Aktif ısıtma uygular; titremeyi yönetir.',
                  rq: { id: 'RQ-POST-8', q: 'Postop titreme ile O₂ tüketimi arasındaki ilişki?',
                        expected: ['artar','iskemi','oksijen'], weight: 1 } },
                { id: 'POST-9', phase: 'postop', max: 3, criticalKey: null,
                  title: 'VTE profilaksisi ve erken mobilizasyon',
                  criterion: 'Mekanik/farmakolojik profilaksi planı; erken mobilizasyon teşviki.',
                  rq: { id: 'RQ-POST-9', q: 'Erken mobilizasyon hangi 2 komplikasyonu azaltır?',
                        expected: ['VTE','atelektazi','ileus','pnömoni'], weight: 1 } },
                { id: 'POST-10',phase: 'postop', max: 1, criticalKey: null,
                  title: 'Hasta ve aile eğitimi (taburculuk için)',
                  criterion: 'Yara bakımı, ilaç, alarm bulguları konusunda eğitim verir.',
                  rq: { id: 'RQ-POST-10', q: 'Taburculuk eğitiminde 3 zorunlu başlık?',
                        expected: ['ilaç','yara','alarm','randevu','aktivite'], weight: 1 } },
                { id: 'POST-11',phase: 'postop', max: 1, criticalKey: null,
                  title: 'Servise/yoğun bakıma transfer kriterleri ve teslim',
                  criterion: 'Aldrete/PADSS skoruyla transfer uygunluğunu değerlendirir; teslim yapar.',
                  rq: { id: 'RQ-POST-11', q: 'Aldrete skor eşiği ve değerlendirilen 5 parametre?',
                        expected: ['9','aktivite','solunum','dolaşım','bilinç','renk','SpO₂'], weight: 1 } }
            ],

            // Soyut OSCE tag'leri ↔ vakalardaki gerçek task id eşlemesi
            // Her vakada bu mapping bir kez tanımlanır; eksik olanlar otomatik atlanır.
            taskMap: {
                // Bu nesne her vakanın osceTaskMap alanı tarafından override edilir.
                // Burada genel/varsayılan eşleme tutulur.
                't_id': ['t_id','oti_id','ltp_id','vag_id','rad_id','ose_id'],
                't_consent': ['t_consent','oti_consent','ltp_consent','vag_consent','rad_consent','ose_consent'],
                't_surgery_verify': ['t_surgery_verify','oti_surgery_verify','ltp_surgery_verify'],
                't_site_mark': ['t_site_mark','oti_site_mark','ltp_site_mark'],
                't_allergy': ['t_allergy','oti_allergy','ltp_allergy','vag_allergy','rad_allergy','ose_allergy'],
                't_npo': ['t_npo','oti_npo','ltp_npo','vag_npo','rad_npo','ose_npo'],
                't_vitals': ['t_vitals','oti_vitals','ltp_vitals','vag_vitals','rad_vitals','ose_vitals'],
                't_premed': ['t_premed','oti_premed','ltp_premed'],
                't_skin_prep': ['t_skin_prep','oti_skin_prep','ltp_skin_prep'],
                't_remove_items': ['t_remove_items','oti_remove_items','ltp_remove_items'],
                't_risk_assessment': ['t_risk_assessment','oti_risk_assessment','ltp_risk_assessment'],
                't_signin': ['t_signin','oti_signin','ltp_signin'],
                't_timeout': ['t_timeout','oti_timeout','ltp_timeout','vag_timeout','rad_timeout','ose_timeout'],
                't_antibiotic': ['t_antibiotic','oti_antibiotic','ltp_antibiotic'],
                't_position': ['t_position','oti_position','ltp_position'],
                't_sterile': ['t_sterile','oti_sterile','ltp_sterile'],
                't_count_initial': ['t_count_initial','oti_count_initial','ltp_count_initial'],
                't_count_final': ['t_count_final','oti_count_final','ltp_count_final'],
                't_antiseptic': ['t_antiseptic','oti_antiseptic','ltp_antiseptic'],
                't_temp': ['t_temp','oti_temp','ltp_temp'],
                't_fluid_blood': ['t_fluid_blood','oti_fluid_blood','ltp_fluid_blood'],
                't_anesthesia_assist': ['t_anesthesia_assist','oti_anesthesia_assist','ltp_anesthesia_assist'],
                't_equipment': ['t_equipment','oti_equipment','ltp_equipment'],
                't_specimen': ['t_specimen','oti_specimen','ltp_specimen'],
                't_signout': ['t_signout','oti_signout','ltp_signout'],
                't_pacu_handover': ['t_pacu_handover','oti_pacu_handover','ltp_pacu_handover','t_sbar','oti_sbar','ltp_sbar'],
                't_airway': ['t_airway','oti_airway','ltp_airway'],
                't_hemodynamic': ['t_hemodynamic','oti_hemodynamic','ltp_hemodynamic'],
                't_pain': ['t_pain','oti_pain','ltp_pain'],
                't_ponv': ['t_ponv','oti_ponv','ltp_ponv'],
                't_postop_fluid': ['t_postop_fluid','oti_postop_fluid','ltp_postop_fluid'],
                't_wound_drain': ['t_wound_drain','oti_wound_drain','ltp_wound_drain'],
                't_thermo_post': ['t_thermo_post','oti_thermo_post','ltp_thermo_post'],
                't_vte_mob': ['t_vte_mob','oti_vte_mob','ltp_vte_mob'],
                't_discharge_edu': ['t_discharge_edu','oti_discharge_edu','ltp_discharge_edu'],
                't_transfer': ['t_transfer','oti_transfer','ltp_transfer']
            },
            // Madde id ↔ soyut task tag eşlemesi (otomatik puanlama için)
            itemTaskTags: {
                'PRE-2': 't_id',
                'PRE-3': 't_surgery_verify',
                'PRE-4': 't_site_mark',
                'PRE-5': 't_consent',
                'PRE-6': 't_allergy',
                'PRE-7': 't_npo',
                'PRE-8': 't_vitals',
                'PRE-9': 't_premed',
                'PRE-10': 't_skin_prep',
                'PRE-11': 't_remove_items',
                'PRE-12': 't_risk_assessment',
                'PRE-13': 't_signin',
                'INT-1': 't_timeout',
                'INT-2': 't_antibiotic',
                'INT-3': 't_position',
                'INT-4': 't_sterile',
                'INT-5': 't_count_initial',
                'INT-6': 't_antiseptic',
                'INT-7': 't_temp',
                'INT-8': 't_fluid_blood',
                'INT-9': 't_anesthesia_assist',
                'INT-10': 't_equipment',
                'INT-11': 't_specimen',
                'INT-12': 't_count_final',
                'INT-13': 't_signout',
                'POST-1': 't_pacu_handover',
                'POST-2': 't_airway',
                'POST-3': 't_hemodynamic',
                'POST-4': 't_pain',
                'POST-5': 't_ponv',
                'POST-6': 't_postop_fluid',
                'POST-7': 't_wound_drain',
                'POST-8': 't_thermo_post',
                'POST-9': 't_vte_mob',
                'POST-10': 't_discharge_edu',
                'POST-11': 't_transfer'
            }
        };

        // Tag → gerçek task id'leri (vaka düzeyinde override edilebilir)
        function osceResolveTaskIds(tag, patient) {
            const overrides = (patient && patient.osceTaskMap) ? patient.osceTaskMap : {};
            if (overrides[tag]) return Array.isArray(overrides[tag]) ? overrides[tag] : [overrides[tag]];
            return OSCE_PHDYO.taskMap[tag] || [];
        }

        function osceGetItem(id) { return OSCE_PHDYO.items.find(i => i.id === id); }
        function osceItemsByPhase(phase) { return OSCE_PHDYO.items.filter(i => i.phase === phase); }

        /* ============================================================
           OSCE-PHDYÖ — KANIT KÖPRÜ MATRİSİ (v1.3)
           Her madde için açık kanıt kaynakları:
             - tasks: zorunlu görev tag'leri (OSCE_PHDYO.taskMap üzerinden)
             - rationaleRequired: gerekçe yanıtı zorunlu mu?
             - criticalIfMissing: zorunlu görev yapılmamışsa bayrak
             - mustOccurBefore: zamanlama kuralı (bu task'lerden önce olmalı)
             - diagnoses: kanıt sayılan tanı id desenleri (regex/substring)
             - symptoms: kanıt sayılan semptom anahtar kelimeleri
             - phaseGate: madde fazı (semptom/tanı kanıtı yalnızca bu fazdan)
             - scoringRule: 0/1/2 davranış kodu açıklamaları
           Eşleme sadece bu tablo üzerinden yapılır; kanıt yoksa puan null.
           ============================================================ */
        const OSCE_EVIDENCE_BRIDGES = (function () {
            const B = {};
            // Helper: kısa tanım üretici
            const def = (id, cfg) => { B[id] = Object.assign({ itemId: id }, cfg); };

            /* ===================== PRE-OP ===================== */
            def('PRE-1', {
                phase: 'preop', requiredTaskTags: [], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_id','t_signin'],
                diagnoses: [/anksiyet/i, /bilgi eksikli/i, /korku/i],
                symptoms: ['anksiyete','korku','endişe','tanışma','bilgi'],
                scoringRule: { 0:'Hasta karşılanmadı / kendini tanıtmadı.', 1:'Karşılama yapıldı ama eksik veya geç.', 2:'Karşılama, tanışma ve süreç bilgisi tam ve uygun.' }
            });
            def('PRE-2', {
                phase: 'preop', requiredTaskTags: ['t_id'], rationaleRequired: true,
                criticalIfMissing: 'identityMissed', mustOccurBefore: ['t_transfer','t_signin'],
                diagnoses: [/güvenli/i, /yanlış/i],
                symptoms: ['kimlik','bileklik','protokol'],
                scoringRule: { 0:'Kimlik doğrulanmadı veya yanlış yapıldı (kritik).', 1:'Tek belirteç / bileklik atlandı / geç yapıldı.', 2:'İki belirteç + bileklik, zamanında ve gerekçeli.' }
            });
            def('PRE-3', {
                phase: 'preop', requiredTaskTags: ['t_surgery_verify'], rationaleRequired: true,
                criticalIfMissing: 'surgeryVerificationMissed', mustOccurBefore: ['t_transfer','t_signin'],
                diagnoses: [/yanlış işlem/i, /güvenli cerrahi/i],
                symptoms: ['ameliyat','işlem','onam çelişki'],
                scoringRule: { 0:'Ameliyat türü teyit edilmedi.', 1:'Teyit kısmi / yalnızca dosya üzerinden.', 2:'Hasta + onam + cerrah ile çapraz teyit yapıldı.' }
            });
            def('PRE-4', {
                phase: 'preop', requiredTaskTags: ['t_site_mark'], rationaleRequired: true,
                criticalIfMissing: 'siteVerificationMissed', mustOccurBefore: ['t_transfer','t_signin'],
                diagnoses: [/yanlış taraf/i, /güvenli cerrahi/i],
                symptoms: ['işaretleme','taraf','bölge'],
                scoringRule: { 0:'İşaretleme doğrulanmadı.', 1:'Hasta uyanıkken doğrulanmadı / belirsiz.', 2:'İşaretleme hasta uyanıkken cerrahla doğrulandı.' }
            });
            def('PRE-5', {
                phase: 'preop', requiredTaskTags: ['t_consent'], rationaleRequired: true,
                criticalIfMissing: 'consentMissed', mustOccurBefore: ['t_transfer','t_signin'],
                diagnoses: [/onam/i, /etik/i],
                symptoms: ['onam','imza','aydınlatılmış'],
                scoringRule: { 0:'Onam kontrol edilmedi / eksikti.', 1:'Onam var ama imza/tarih/uyum eksik kontrol.', 2:'Onam doğru hasta / işlem / imza / tarih ile teyit edildi.' }
            });
            def('PRE-6', {
                phase: 'preop', requiredTaskTags: ['t_allergy'], rationaleRequired: true,
                criticalIfMissing: 'allergyMissed', mustOccurBefore: ['t_premed','t_antibiotic'],
                diagnoses: [/alerji/i, /lateks/i, /anafilaksi/i],
                symptoms: ['alerji','lateks','ilaç hassasiyeti'],
                scoringRule: { 0:'Alerji sorgulanmadı.', 1:'Sorgulandı ama belge/işaret eksik.', 2:'Sorgu + kayıt + (varsa) kırmızı bileklik tam.' }
            });
            def('PRE-7', {
                phase: 'preop', requiredTaskTags: ['t_npo'], rationaleRequired: true,
                criticalIfMissing: 'npoMissed', mustOccurBefore: ['t_transfer','t_signin'],
                diagnoses: [/aspirasyon/i, /açlık/i],
                symptoms: ['npo','açlık','aspirasyon'],
                scoringRule: { 0:'NPO durumu sorgulanmadı.', 1:'Sorgulandı ama saat/protokol eksik.', 2:'Son alım saati ve protokol uyumu netleşti.' }
            });
            def('PRE-8', {
                phase: 'preop', requiredTaskTags: ['t_vitals'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_signin','t_transfer'],
                diagnoses: [/anksiyet/i, /ağrı/i, /vital/i, /perfüz/i, /risk.*hipoksi/i],
                symptoms: ['kan basıncı','nabız','spo2','ateş','solunum','vital','ağrı','anksiyete'],
                scoringRule: { 0:'Vital ölçülmedi.', 1:'Eksik parametre / sapma yok sayıldı.', 2:'Tüm vitaller alındı, sapmalar yorumlandı.' }
            });
            def('PRE-9', {
                phase: 'preop', requiredTaskTags: ['t_premed','t_antibiotic'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: ['t_timeout'],
                diagnoses: [/enfeksiyon riski/i, /ilaç/i],
                symptoms: ['premedikasyon','antibiyotik','profilaksi'],
                scoringRule: { 0:'Premedikasyon/antibiyotik planlanmadı.', 1:'Order var, zamanlama belirsiz.', 2:'Order doğrulandı, zamanlama planlandı.' }
            });
            def('PRE-10', {
                phase: 'preop', requiredTaskTags: ['t_skin_prep'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_antiseptic'],
                diagnoses: [/cilt bütünl/i, /enfeksiyon/i],
                symptoms: ['tıraş','klipper','cilt','banyo'],
                scoringRule: { 0:'Cilt hazırlığı kontrol edilmedi.', 1:'Yapıldı ama yöntem/cilt bütünlüğü eksik.', 2:'Cilt değerlendirildi, uygun yöntem planlandı.' }
            });
            def('PRE-11', {
                phase: 'preop', requiredTaskTags: ['t_remove_items'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/yaralanma riski/i],
                symptoms: ['protez','takı','lens','diş'],
                scoringRule: { 0:'Çıkarımlar atlandı.', 1:'Bazı kalemler atlandı / teslim alınmadı.', 2:'Tümü çıkarıldı ve teslim alındı.' }
            });
            def('PRE-12', {
                phase: 'preop', requiredTaskTags: ['t_risk_assessment'], rationaleRequired: true,
                criticalIfMissing: 'majorRiskMissed', mustOccurBefore: ['t_transfer'],
                diagnoses: [/vte/i, /kanama riski/i, /düşme/i, /trombo/i],
                symptoms: ['vte','caprini','padua','düşme','kanama'],
                scoringRule: { 0:'Risk skorlama yapılmadı.', 1:'Skor verildi, önlem yok.', 2:'Skor + mekanik/farmakolojik önlem planlandı.' }
            });
            def('PRE-13', {
                phase: 'preop', requiredTaskTags: ['t_signin'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer','t_timeout'],
                diagnoses: [/güvenli cerrahi/i],
                symptoms: ['sign-in','sign in','airway','kanama'],
                scoringRule: { 0:'Sign-In yapılmadı.', 1:'Madde eksik / hasta uyanıkken değil.', 2:'WHO Sign-In tüm maddeler hasta uyanıkken tamam.' }
            });

            /* ===================== INTRA-OP ===================== */
            def('INT-1', {
                phase: 'intraop', requiredTaskTags: ['t_timeout'], rationaleRequired: true,
                criticalIfMissing: 'timeOutMissed', mustOccurBefore: ['oti_incision','t_incision','ltp_incision'],
                diagnoses: [/güvenli cerrahi/i, /yanlış işlem/i],
                symptoms: ['time-out','time out','ekip duraklama'],
                scoringRule: { 0:'Time-Out yapılmadı.', 1:'Yapıldı ama eksik madde / sözel teyit yok.', 2:'Tüm ekip durdu, 5 madde ekipçe sözel teyit edildi.' }
            });
            def('INT-2', {
                phase: 'intraop', requiredTaskTags: ['t_antibiotic'], rationaleRequired: true,
                criticalIfMissing: 'antibioticCheckMissed', mustOccurBefore: ['oti_incision','t_incision','ltp_incision'],
                diagnoses: [/enfeksiyon riski/i],
                symptoms: ['antibiyotik','redoz','profilaksi'],
                scoringRule: { 0:'Antibiyotik teyit edilmedi.', 1:'Teyit edildi, zamanlama tartışmalı.', 2:'Time-Out içinde uygulama + zaman teyit.' }
            });
            def('INT-3', {
                phase: 'intraop', requiredTaskTags: ['t_position'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: ['oti_incision','t_incision','ltp_incision'],
                diagnoses: [/pozisyon/i, /basınç yaralanm/i, /periferik nörovask/i, /sinir.*yaralan/i],
                symptoms: ['pozisyon','peroneal','sinir','baskı','ped'],
                scoringRule: { 0:'Pozisyon güvenliği gözardı.', 1:'Pozisyon verildi ama ped/baskı kontrol eksik.', 2:'Sinir/eklem/nabız korumalı, pedli pozisyon.' }
            });
            def('INT-4', {
                phase: 'intraop', requiredTaskTags: ['t_sterile'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: ['oti_incision','t_incision','ltp_incision'],
                diagnoses: [/enfeksiyon riski/i, /sterilite/i, /asepsi/i],
                symptoms: ['steril','asepsi','kontaminasyon'],
                scoringRule: { 0:'Sterilite ihlali fark edilmedi.', 1:'Fark edildi, düzeltme kısmi.', 2:'İhlal tespit + iletişim + düzeltme tam.' }
            });
            def('INT-5', {
                phase: 'intraop', requiredTaskTags: ['t_count_initial'], rationaleRequired: true,
                criticalIfMissing: 'countMissed', mustOccurBefore: ['oti_incision','t_incision','ltp_incision'],
                diagnoses: [/yabancı cisim/i, /retained/i],
                symptoms: ['sayım','kompres','iğne','alet'],
                scoringRule: { 0:'Açılış sayımı yapılmadı.', 1:'Sayım yapıldı, kayıt eksik.', 2:'Skrub + dolaşan birlikte saydı, kayıt tam.' }
            });
            def('INT-6', {
                phase: 'intraop', requiredTaskTags: ['t_antiseptic'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['oti_incision','t_incision','ltp_incision'],
                diagnoses: [/enfeksiyon riski/i, /yangın/i, /yanık/i],
                symptoms: ['klorheksidin','povidon','antiseptik','kuruma'],
                scoringRule: { 0:'Antisepsi atlandı / yanlış ajan.', 1:'Uygulandı ama kuruma süresi beklenmedi.', 2:'Uygun ajan + kuruma süresi + drape doğru.' }
            });
            def('INT-7', {
                phase: 'intraop', requiredTaskTags: ['t_temp'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: [],
                diagnoses: [/hipotermi/i, /termoregül/i],
                symptoms: ['hipotermi','ısıtma','battaniye','ısı'],
                scoringRule: { 0:'Isı izlemi yapılmadı.', 1:'İzlem var, aktif ısıtma yok.', 2:'İzlem + aktif ısıtma uygulandı.' }
            });
            def('INT-8', {
                phase: 'intraop', requiredTaskTags: ['t_fluid_blood'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: [],
                diagnoses: [/sıvı volüm/i, /kanama/i, /hemodinami/i, /perfüz/i],
                symptoms: ['kan kaybı','idrar','aldığı','çıkardığı','hemodinami'],
                scoringRule: { 0:'Sıvı/kan takibi yapılmadı.', 1:'Takip kısmi / raporlama eksik.', 2:'A/Ç + kan + idrar takip + raporlama tam.' }
            });
            def('INT-9', {
                phase: 'intraop', requiredTaskTags: ['t_anesthesia_assist'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: [],
                diagnoses: [/hava yolu/i, /aspirasyon/i, /ilaç güvenliği/i],
                symptoms: ['entübasyon','hava yolu','double-check','yüksek riskli'],
                scoringRule: { 0:'Anestezi desteği yetersiz.', 1:'Destek var, double-check eksik.', 2:'Güvenli destek + double-check uygulandı.' }
            });
            def('INT-10', {
                phase: 'intraop', requiredTaskTags: ['t_equipment'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: [],
                diagnoses: [/yanık/i, /iskemi/i, /sinir.*yaralan/i],
                symptoms: ['koter','plak','turnike','elektrik'],
                scoringRule: { 0:'Ekipman güvenliği denetlenmedi.', 1:'Kısmi denetim / süre takibi yok.', 2:'Plak yerleşimi + turnike basınç/süresi takip.' }
            });
            def('INT-11', {
                phase: 'intraop', requiredTaskTags: ['t_specimen'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_signout'],
                diagnoses: [/medikolegal/i, /yanlış tanı/i],
                symptoms: ['spesimen','etiket','patoloji'],
                scoringRule: { 0:'Spesimen etiketlenmedi / kayıp.', 1:'Etiketleme eksik bilgi.', 2:'Doğru etiket + kayıt + transfer.' }
            });
            def('INT-12', {
                phase: 'intraop', requiredTaskTags: ['t_count_final'], rationaleRequired: true,
                criticalIfMissing: 'countMissed', mustOccurBefore: ['t_signout','oti_close','t_close','ltp_close'],
                diagnoses: [/yabancı cisim/i, /retained/i],
                symptoms: ['kapanış sayımı','tam sayım','görüntüleme'],
                scoringRule: { 0:'Kapanış sayımı yapılmadı.', 1:'Sayım yapıldı, uyumsuzluk yönetimi eksik.', 2:'Tam sayım + uyumsuzluk için protokol tetiklendi.' }
            });
            def('INT-13', {
                phase: 'intraop', requiredTaskTags: ['t_signout'], rationaleRequired: true,
                criticalIfMissing: 'signOutMissed', mustOccurBefore: ['t_pacu_handover'],
                diagnoses: [/güvenli cerrahi/i],
                symptoms: ['sign-out','sign out','kapanış','ekipman sorunu'],
                scoringRule: { 0:'Sign-Out yapılmadı.', 1:'Yapıldı ama madde eksik.', 2:'4 madde (işlem/sayım/spesimen/ekipman) ekipçe teyit.' }
            });

            /* ===================== POST-OP ===================== */
            def('POST-1', {
                phase: 'postop', requiredTaskTags: ['t_pacu_handover'], rationaleRequired: true,
                criticalIfMissing: 'pacuHandoverMissed', mustOccurBefore: ['t_transfer'],
                diagnoses: [/iletişim/i, /devir/i],
                symptoms: ['sbar','teslim','devir','pacu'],
                scoringRule: { 0:'Teslim yapılmadı / yapılandırılmamış.', 1:'Teslim yapıldı, SBAR eksik.', 2:'SBAR formatında ekiple teslim.' }
            });
            def('POST-2', {
                phase: 'postop', requiredTaskTags: ['t_airway'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/hava yolu/i, /solunum/i, /aspirasyon/i],
                symptoms: ['hava yolu','spo2','solunum','laringospazm'],
                scoringRule: { 0:'Hava yolu değerlendirilmedi.', 1:'Kısmi değerlendirme.', 2:'Solunum + SpO₂ + refleks tam değerlendirildi.' }
            });
            def('POST-3', {
                phase: 'postop', requiredTaskTags: ['t_hemodynamic'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/kanama/i, /hemodinami/i, /perfüz/i, /sıvı volüm/i],
                symptoms: ['kan basıncı','nabız','idrar','perfüzyon'],
                scoringRule: { 0:'Hemodinami izlenmedi.', 1:'İzlem kısmi.', 2:'KB + nabız + perfüzyon + idrar tam izlendi.' }
            });
            def('POST-4', {
                phase: 'postop', requiredTaskTags: ['t_pain'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/akut ağrı/i, /ağrı/i],
                symptoms: ['ağrı','vas','nrs','analjezi'],
                scoringRule: { 0:'Ağrı değerlendirilmedi.', 1:'Skor alındı, çok modlu yok.', 2:'Doğru skala + çok modlu analjezi.' }
            });
            def('POST-5', {
                phase: 'postop', requiredTaskTags: ['t_ponv'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/bulantı/i, /kusma/i, /ponv/i],
                symptoms: ['bulantı','kusma','apfel','ponv'],
                scoringRule: { 0:'PONV gözardı.', 1:'Skorsuz tedavi.', 2:'Apfel skor + profilaktik tedavi.' }
            });
            def('POST-6', {
                phase: 'postop', requiredTaskTags: ['t_postop_fluid'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/sıvı volüm/i, /elektrolit/i, /transfüz/i],
                symptoms: ['sıvı','transfüzyon','elektrolit','aldığı'],
                scoringRule: { 0:'Sıvı/kan takibi yok.', 1:'Takip kısmi.', 2:'A/Ç + kan ürünü protokolü uygulandı.' }
            });
            def('POST-7', {
                phase: 'postop', requiredTaskTags: ['t_wound_drain'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/kanama riski/i, /enfeksiyon/i, /yara/i, /dren/i],
                symptoms: ['yara','dren','insizyon','kanama'],
                scoringRule: { 0:'Yara/dren değerlendirilmedi.', 1:'Görsel kontrol var, miktar yok.', 2:'İnsizyon + dren miktar + içerik raporlandı.' }
            });
            def('POST-8', {
                phase: 'postop', requiredTaskTags: ['t_thermo_post'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/hipotermi/i, /titreme/i, /termoregül/i],
                symptoms: ['titreme','ısıtma','hipotermi','battaniye'],
                scoringRule: { 0:'Isı yönetimi yok.', 1:'Aktif ısıtma yok.', 2:'Aktif ısıtma + titreme yönetimi.' }
            });
            def('POST-9', {
                phase: 'postop', requiredTaskTags: ['t_vte_mob'], rationaleRequired: true,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/vte/i, /trombo/i, /mobilizasyon/i, /atelektazi/i],
                symptoms: ['vte','mobilizasyon','kompresyon','çorap'],
                scoringRule: { 0:'VTE planı yok.', 1:'Yalnızca mekanik veya yalnızca mobilizasyon.', 2:'Mekanik/farmakolojik + erken mobilizasyon.' }
            });
            def('POST-10', {
                phase: 'postop', requiredTaskTags: ['t_discharge_edu'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: ['t_transfer'],
                diagnoses: [/bilgi eksikli/i, /öz bakım/i],
                symptoms: ['eğitim','taburculuk','ilaç','yara bakımı','alarm'],
                scoringRule: { 0:'Eğitim verilmedi.', 1:'Eğitim eksik başlık.', 2:'İlaç + yara + alarm + randevu kapsayan eğitim.' }
            });
            def('POST-11', {
                phase: 'postop', requiredTaskTags: ['t_transfer'], rationaleRequired: false,
                criticalIfMissing: null, mustOccurBefore: [],
                diagnoses: [/transfer/i, /aldrete/i],
                symptoms: ['aldrete','padss','transfer','servis'],
                scoringRule: { 0:'Transfer kriterleri uygulanmadı.', 1:'Kısmi skor / teslim eksik.', 2:'Aldrete/PADSS skor + teslim tam.' }
            });

            return B;
        })();

        // Aksiyon sırası — task id zaman damgalı kayıttan al
        function osceTaskOccurredBefore(taskId, beforeTaskIds) {
            const seq = (App.actionSequence || []).filter(a => a.kind === 'auto-task' || a.kind === 'task-complete');
            const idxA = seq.findIndex(a => (a.payload && a.payload.taskId) === taskId);
            if (idxA < 0) return null; // taskId hiç yapılmadı
            for (const ref of beforeTaskIds) {
                const idxB = seq.findIndex(a => (a.payload && a.payload.taskId) === ref);
                if (idxB >= 0 && idxA > idxB) return ref; // sonra yapıldı → geç
            }
            return false; // zamanında
        }

        // Bridge tabanlı kanıt değerlendirmesi
        function evaluateOSCEItemFromBridge(itemId) {
            const item = osceGetItem(itemId);
            const bridge = OSCE_EVIDENCE_BRIDGES[itemId];
            const rec = App.osce && App.osce.items[itemId];
            if (!item || !bridge || !rec) return null;
            const evidence = [];
            const negativeEvidence = [];
            const missingEvidence = [];
            let timingStatus = 'n/a';

            // A. Görev kanıtı
            const completed = (App.completedTasks || []);
            const phasePatient = App.currentPatient;
            const taskHits = [];
            (bridge.requiredTaskTags || []).forEach(tag => {
                const ids = osceResolveTaskIds(tag, phasePatient);
                const hit = ids.find(tid => completed.includes(tid));
                if (hit) { taskHits.push(hit); evidence.push(`task:${hit}`); }
                else missingEvidence.push(`task:${tag}`);
            });
            const allTasksDone = (bridge.requiredTaskTags || []).length === 0 || taskHits.length === (bridge.requiredTaskTags || []).length;

            // B. Semptom kanıtı (faz uygunsa)
            const phaseRoom = bridge.phase;
            const symConfirmed = App.symptomsConfirmed && App.symptomsConfirmed[phaseRoom];
            if (symConfirmed) {
                const selSym = (App.selectedSymptoms && App.selectedSymptoms[phaseRoom]) || [];
                const corr = (phasePatient && phasePatient[phaseRoom] && phasePatient[phaseRoom].correctSymptoms) || [];
                const symBlob = selSym.join(' ').toLocaleLowerCase('tr-TR');
                (bridge.symptoms || []).forEach(kw => {
                    if (symBlob.includes(kw.toLocaleLowerCase('tr-TR'))) evidence.push(`symptom:${kw}`);
                });
                // doğru semptom oranı zayıfsa negatif
                const right = selSym.filter(s => corr.includes(s)).length;
                const wrong = selSym.filter(s => !corr.includes(s)).length;
                if (wrong > 0) negativeEvidence.push(`symptom:wrong=${wrong}`);
                if (corr.length > 0 && right < Math.ceil(corr.length * 0.5)) negativeEvidence.push('symptom:weak-coverage');
            }

            // C. Tanı kanıtı (faz uygunsa)
            const dxConfirmed = App.diagnosesConfirmed && App.diagnosesConfirmed[phaseRoom];
            if (dxConfirmed) {
                const sel = (App.selectedDiagnoses && App.selectedDiagnoses[phaseRoom]) || [];
                const phaseDef = phasePatient && phasePatient[phaseRoom];
                const diagDefs = (phaseDef && phaseDef.diagnoses) || [];
                sel.forEach(id => {
                    const d = diagDefs.find(x => x.id === id);
                    if (!d) return;
                    const blob = (d.title + ' ' + (d.factors||[]).join(' ') + ' ' + (d.evidence||[]).join(' ')).toLocaleLowerCase('tr-TR');
                    (bridge.diagnoses || []).forEach(rx => {
                        if (rx.test(blob) && d.relevance === 'correct') evidence.push(`diagnosis:${d.id}`);
                    });
                });
                // alakasız tanı kaydı varsa negatif
                const irr = (App.osce.irrelevantDiagnoses && App.osce.irrelevantDiagnoses[phaseRoom]) || [];
                if (irr.length) negativeEvidence.push(`diagnosis:irrelevant=${irr.length}`);
            }

            // D. Klasik/açık uçlu gerekçe kanıtı öğrenci akışından çıkarıldı.
            // Bu nedenle OSCE köprü puanı artık açık uçlu gerekçe yokluğu nedeniyle düşürülmez.
            // GCKL karar bilgisini çoktan seçmeli ve doğru/yanlış sorular puanlar.
            const ratOk = true;
            if (rec.rationale) {
                if (rec.rationaleOk) evidence.push('rationale:ok');
                else evidence.push('rationale:answered-classical-disabled');
            }

            // E. Zamanlama kuralı
            const primaryTag = (bridge.requiredTaskTags || [])[0];
            if (primaryTag && (bridge.mustOccurBefore || []).length) {
                const ids = osceResolveTaskIds(primaryTag, phasePatient);
                const beforeIds = (bridge.mustOccurBefore || []).flatMap(t => osceResolveTaskIds(t, phasePatient));
                let lateRef = null;
                for (const tid of ids) {
                    const r = osceTaskOccurredBefore(tid, beforeIds);
                    if (r) { lateRef = r; break; }
                }
                if (lateRef) { timingStatus = 'late'; negativeEvidence.push(`timing:after_${lateRef}`); }
                else if (taskHits.length) timingStatus = 'on_time';
            }

            // F. Negatif: kritik hata aktif mi?
            if (bridge.criticalIfMissing && !allTasksDone) {
                negativeEvidence.push(`critical:${bridge.criticalIfMissing}`);
            }

            // === Performans Kodu ===
            // Kanıt yok → null (observer gerekir)
            const hasAnyEvidence = evidence.length > 0;
            let performanceCode = null;
            let performanceLabel = '';
            let systemScore = null;

            if (!hasAnyEvidence && !rec.behaviorOk && taskHits.length === 0 && !rec.rationale) {
                // Tamamen kanıtsız
                performanceCode = null;
                performanceLabel = 'Otomatik kanıt yok; observer değerlendirmesi gerekir.';
                systemScore = null;
            } else if (allTasksDone === false && (bridge.requiredTaskTags || []).length > 0) {
                // Zorunlu görev eksik → 0
                performanceCode = 0;
                performanceLabel = bridge.scoringRule[0];
                systemScore = 0;
            } else {
                const partial = (timingStatus === 'late') || (bridge.rationaleRequired && !ratOk) || negativeEvidence.length > 0;
                if (!partial && (!bridge.rationaleRequired || ratOk)) {
                    performanceCode = 2;
                    performanceLabel = bridge.scoringRule[2];
                    systemScore = item.max;
                } else {
                    performanceCode = 1;
                    performanceLabel = bridge.scoringRule[1];
                    // kısmi: gerekçe yoksa taban %50, varsa oranla
                    let frac = 0.5;
                    if (rec.rationale && rec.rationale.ratio) frac = 0.5 + 0.4 * Math.max(0, Math.min(1, rec.rationale.ratio));
                    systemScore = Math.round(item.max * frac);
                }
            }

            return {
                evidence, negativeEvidence, missingEvidence,
                timingStatus, performanceCode, performanceLabel,
                systemScore, criticalKey: bridge.criticalIfMissing,
                taskHits, requiresObserver: (systemScore === null)
            };
        }

        // Kapsam doğrulayıcı: 37 madde × kanıt zinciri kontrolü
        function validateOSCEEvidenceCoverage() {
            const itemsCovered = [];
            const itemsObserverOnly = [];
            const criticalsCovered = [];
            const criticalsAll = Object.keys(OSCE_PHDYO.criticalCaps);
            const mappedTaskTags = new Set();
            OSCE_PHDYO.items.forEach(it => {
                const b = OSCE_EVIDENCE_BRIDGES[it.id];
                if (!b) return;
                const hasTask = (b.requiredTaskTags || []).length > 0;
                const hasSym = (b.symptoms || []).length > 0;
                const hasDx = (b.diagnoses || []).length > 0;
                const hasRq = !!(it.rq && it.rq.id);
                if (hasTask || hasSym || hasDx || hasRq) itemsCovered.push(it.id);
                else itemsObserverOnly.push(it.id);
                if (b.criticalIfMissing) criticalsCovered.push(b.criticalIfMissing);
                (b.requiredTaskTags || []).forEach(t => mappedTaskTags.add(t));
            });
            const allTaskTags = Object.keys(OSCE_PHDYO.taskMap);
            const unmappedTaskTags = allTaskTags.filter(t => !mappedTaskTags.has(t));
            const report = {
                schemaVersion: 'OSCE-PHDYO-1.3',
                itemsCovered: itemsCovered.length,
                itemsTotal: OSCE_PHDYO.items.length,
                itemsObserverOnly,
                criticalsCovered: Array.from(new Set(criticalsCovered)),
                criticalsMissing: criticalsAll.filter(c => !criticalsCovered.includes(c)),
                taskTagsMapped: mappedTaskTags.size,
                taskTagsTotal: allTaskTags.length,
                unmappedTaskTags
            };
            try {
                console.group('%cOSCE Evidence Coverage', 'color:#5cc4d6;font-weight:bold');
                console.log(`Items covered: ${report.itemsCovered} / ${report.itemsTotal}`);
                console.log(`Critical items covered: ${report.criticalsCovered.length} / ${criticalsAll.length}`);
                console.log(`Tasks mapped: ${report.taskTagsMapped} / ${report.taskTagsTotal}`);
                if (report.unmappedTaskTags.length) console.warn('Unmapped tasks:', report.unmappedTaskTags);
                if (report.itemsObserverOnly.length) console.warn('Items requiring observer only:', report.itemsObserverOnly);
                if (report.criticalsMissing.length) console.warn('Criticals missing in bridge:', report.criticalsMissing);
                console.groupEnd();
            } catch(e){}
            return report;
        }
        // Sayfa yüklendiğinde otomatik kapsam raporu
        try { window.addEventListener('load', () => { try { validateOSCEEvidenceCoverage(); } catch(e){} }); } catch(e){}

        /* ============================================================
           GÜVENLİ CERRAHİ KONTROL LİSTESİ ÖĞRENME SİMÜLATÖRÜ
           (GCKL Öğrenme Modülü) — v1.0
           ----------------------------------------------------------------
           - 30 madde / 4 bölüm
           - Kod 0/1/2 öğrenme durumu
           - Görev, konuşma, semptom, tanı ve sayım kanıtları
           - Sayım Güvenliği Panosu
           - Bileklik / Kimlik doğrulama senaryoları
           ============================================================ */
        const GCKL_PHASES = {
            'I':   { code: 'I',   title: 'Klinikten Ayrılmadan Önce',   responsible: 'Klinik Hemşiresi' },
            'II':  { code: 'II',  title: 'Anestezi Verilmeden Önce',    responsible: 'Anestezi Hemşiresi' },
            'III': { code: 'III', title: 'Ameliyat Kesisinden Önce',    responsible: 'Sirküle Hemşire' },
            'IV':  { code: 'IV',  title: 'Ameliyattan Çıkmadan Önce',   responsible: 'Sirküle Hemşire' }
        };
        const GCKL_NOTE_TOP = 'Her bölüm, ilgili sorumlular tarafından sesli olarak kontrol edilerek işaretleme yapılmalıdır.';
        const GCKL_NOTE_PHASE = 'Bu bölüm sesli olarak ekip/hasta ile doğrulanmalı ve ilgili sorumlu tarafından tamamlanmalıdır.';

        const GCKL_ITEMS = [
            // I. KLİNİKTEN AYRILMADAN ÖNCE
            { id: 'GCKL-1',  phase: 'I',   text: 'Hastanın kimlik bilgileri, ameliyatı ve ameliyat bölgesi doğrulandı mı?',
              sub: ['Kimlik bilgileri doğrulandı.','Ameliyat doğrulandı.','Ameliyat bölgesi doğrulandı.'],
              codeRule: { 0:'Hiç doğrulama yapılmadı.', 1:'Sadece kimlik veya sadece ameliyat doğrulandı; bölge eksik kaldı.', 2:'Kimlik, ameliyat ve ameliyat bölgesi birlikte doğrulandı.' },
              criticalKey: 'identityMissed', osceAlias: ['PRE-2','PRE-3','PRE-4'] },
            { id: 'GCKL-2',  phase: 'I',   text: 'Hasta ameliyata yönelik rızasını teyit etti mi?',
              codeRule: { 0:'Onam/rıza kontrol edilmedi.', 1:'Dosya kontrol edildi ama hastadan teyit alınmadı veya tersi.', 2:'Dosya ve hasta teyidi birlikte yapıldı.' },
              criticalKey: 'consentMissed', osceAlias: ['PRE-5'] },
            { id: 'GCKL-3',  phase: 'I',   text: 'Hasta aç mı?',
              codeRule: { 0:'Açlık durumu sorgulanmadı.', 1:'Sorgulandı ama kayıtla karşılaştırılmadı veya uygunsuzluk yönetilmedi.', 2:'Açlık durumu sorgulandı, kayıtla kontrol edildi ve uygunsuzluk varsa bildirildi.' },
              criticalKey: 'npoMissed', osceAlias: ['PRE-7'] },
            { id: 'GCKL-4',  phase: 'I',   text: 'Ameliyat bölgesi tıraşı yapıldı mı?',
              codeRule: { 0:'Bölge hazırlığı sorgulanmadı.', 1:'Sorgulandı ama gereklilik/yöntem değerlendirilmedi.', 2:'Tıraş durumu ve gereklilik doğru değerlendirildi.' },
              osceAlias: ['PRE-10'] },
            { id: 'GCKL-5',  phase: 'I',   text: 'Hastada makyaj/oje, protez, değerli eşya var mı?',
              codeRule: { 0:'Kontrol yapılmadı.', 1:'Sadece bazı unsurlar kontrol edildi.', 2:'Makyaj/oje, protez ve değerli eşya kontrolü eksiksiz yapıldı.' },
              osceAlias: ['PRE-11'] },
            { id: 'GCKL-6',  phase: 'I',   text: 'Hastanın kıyafetleri tümüyle çıkarılıp ameliyat önlüğü ve bonesi giydirildi mi?',
              codeRule: { 0:'Kıyafet/önlük/bone kontrol edilmedi.', 1:'Kısmi kontrol yapıldı.', 2:'Kıyafetler, ameliyat önlüğü ve bone uygun şekilde kontrol edildi.' },
              osceAlias: ['PRE-11'] },
            { id: 'GCKL-7',  phase: 'I',   text: 'Ameliyat öncesi gerekli özel işlem var mı?',
              options: ['Lavman','Mesane Kateterizasyonu','Varis Çorabı','Özel Tedavi Protokolü','Diğer','Hayır'],
              codeRule: { 0:'Özel işlem gereksinimi hiç sorgulanmadı.', 1:'Bir kısmı sorgulandı ama eksik kaldı.', 2:'Vaka için gerekli tüm özel hazırlıklar doğru değerlendirildi.' },
              osceAlias: ['PRE-12'] },
            { id: 'GCKL-8',  phase: 'I',   text: 'Ameliyat için gerekli olacak özel malzeme, implant, kan veya kan ürünü hazırlığı teyit edildi mi?',
              codeRule: { 0:'Malzeme/implant/kan hazırlığı kontrol edilmedi.', 1:'Kısmi kontrol yapıldı.', 2:'Özel malzeme, implant, kan/kan ürünü hazırlığı eksiksiz teyit edildi.' },
              osceAlias: ['PRE-9'] },
            { id: 'GCKL-9',  phase: 'I',   text: 'Hastanın gerekli laboratuvar ve radyoloji tetkikleri mevcut mu?',
              codeRule: { 0:'Tetkikler kontrol edilmedi.', 1:'Sadece laboratuvar veya sadece radyoloji kontrol edildi.', 2:'Laboratuvar ve radyoloji birlikte kontrol edildi.' },
              osceAlias: ['PRE-8'] },

            // II. ANESTEZİ VERİLMEDEN ÖNCE
            { id: 'GCKL-10', phase: 'II',  text: 'Hastanın kendisinden kimlik bilgileri, ameliyatı, ameliyat bölgesi ve ameliyatı ile ilgili rızası doğrulandı mı?',
              codeRule: { 0:'Hiç doğrulama yapılmadı.', 1:'Bazı doğrulamalar yapıldı ama biri veya daha fazlası eksik.', 2:'Kimlik, ameliyat, ameliyat bölgesi ve rıza birlikte doğrulandı.' },
              criticalKey: 'identityMissed', osceAlias: ['PRE-13'] },
            { id: 'GCKL-11', phase: 'II',  text: 'Ameliyat bölgesinde işaretleme var mı?',
              options: ['Var','İşaretleme yok','Uygulanamaz'],
              codeRule: { 0:'İşaretleme kontrol edilmedi.', 1:'Kontrol edildi ama uygunsuzluk yönetilmedi.', 2:'İşaretleme durumu doğru değerlendirildi ve gerekiyorsa işlem başlatıldı.' },
              criticalKey: 'siteVerificationMissed', osceAlias: ['PRE-4'] },
            { id: 'GCKL-12', phase: 'II',  text: 'Anestezi Güvenlik Kontrol Listesi tamamlandı mı?',
              codeRule: { 0:'Kontrol edilmedi.', 1:'Sorgulandı ama doğrulanmadı.', 2:'Anestezi güvenlik kontrol listesi doğrulandı.' },
              osceAlias: ['PRE-13'] },
            { id: 'GCKL-13', phase: 'II',  text: 'Pulse oksimetre hasta üzerinde ve çalışıyor mu?',
              codeRule: { 0:'Kontrol edilmedi.', 1:'Takılı olduğu görüldü ama çalışması doğrulanmadı.', 2:'Pulse oksimetre hastada ve çalışır durumda doğrulandı.' },
              osceAlias: ['PRE-8'] },
            { id: 'GCKL-14', phase: 'II',  text: 'Hastanın bilinen bir alerjisi var mı?',
              codeRule: { 0:'Alerji sorgulanmadı.', 1:'Sorgulandı ama dosya/bileklik veya ekip bildirimi eksik.', 2:'Alerji hasta, bileklik ve dosya üzerinden doğrulandı; varsa ekibe bildirildi.' },
              criticalKey: 'allergyMissed', osceAlias: ['PRE-6'] },
            { id: 'GCKL-15', phase: 'II',  text: 'Gerekli görüntüleme cihazları var mı?',
              codeRule: { 0:'Görüntüleme gereksinimi kontrol edilmedi.', 1:'Kısmi kontrol yapıldı.', 2:'Görüntüleme gereksinimi doğru değerlendirildi ve hazır olduğu teyit edildi.' },
              osceAlias: ['INT-10'] },
            { id: 'GCKL-16', phase: 'II',  text: 'Hastada kan kaybı riski var mı?',
              codeRule: { 0:'Kan kaybı riski değerlendirilmedi.', 1:'Risk fark edildi ama damar yolu/sıvı planı eksik kaldı.', 2:'Kan kaybı riski, damar yolu ve sıvı/kan planı birlikte değerlendirildi.' },
              criticalKey: 'majorRiskMissed', osceAlias: ['PRE-12','INT-8'] },

            // III. AMELİYAT KESİSİNDEN ÖNCE
            { id: 'GCKL-17', phase: 'III', text: 'Ekipteki kişiler kendilerini ad, soyad ve görevleri ile tanıttı mı?',
              codeRule: { 0:'Ekip tanıtımı yapılmadı.', 1:'Kısmi ekip tanıtımı yapıldı.', 2:'Ekip üyeleri ad, soyad ve görevleriyle tanıtıldı.' },
              osceAlias: ['INT-1'] },
            { id: 'GCKL-18', phase: 'III', text: 'Ekipten bir kişi sesli olarak hastanın kimliğini, yapılan ameliyatı ve ameliyat bölgesini teyit etti mi?',
              codeRule: { 0:'Sesli doğrulama yapılmadı.', 1:'Bir veya iki bileşen doğrulandı ama eksik kaldı.', 2:'Kimlik, ameliyat ve ameliyat bölgesi sesli olarak teyit edildi.' },
              criticalKey: 'timeOutMissed', osceAlias: ['INT-1'] },
            { id: 'GCKL-19', phase: 'III', text: 'Kritik olaylar gözden geçirildi mi?',
              sub: ['Tahmini ameliyat süresi','Beklenen kan kaybı','Ameliyat sırasında gerçekleşebilecek beklenmedik olaylar','Olası anestezi riskleri','Hastanın pozisyonu'],
              codeRule: { 0:'Kritik olaylar gözden geçirilmedi.', 1:'Bazı kritik olaylar konuşuldu ama eksik kaldı.', 2:'Tüm kritik olaylar ekip içinde gözden geçirildi.' },
              osceAlias: ['INT-1','INT-3'] },
            { id: 'GCKL-20', phase: 'III', text: 'Profilaktik antibiyotik sorgulandı mı?',
              options: ['Kesiden önceki son 60 dakika içerisinde uygulandı','Kullanılmaz'],
              codeRule: { 0:'Antibiyotik sorgulanmadı.', 1:'Sorgulandı ama zamanlama veya gereklilik net değil.', 2:'Profilaksi gerekliliği ve 60 dakika zamanlaması doğru değerlendirildi.' },
              criticalKey: 'antibioticCheckMissed', osceAlias: ['INT-2'] },
            { id: 'GCKL-21', phase: 'III', text: 'Kullanılacak malzemeler hazır mı?',
              codeRule: { 0:'Malzemeler kontrol edilmedi.', 1:'Kısmi kontrol yapıldı.', 2:'Malzemeler hazır olarak doğrulandı.' },
              osceAlias: ['INT-10'] },
            { id: 'GCKL-22', phase: 'III', text: 'Malzemelerin sterilizasyonu uygun mu?',
              codeRule: { 0:'Sterilizasyon kontrol edilmedi.', 1:'Kısmi kontrol yapıldı.', 2:'Sterilizasyon uygunluğu doğrulandı.' },
              osceAlias: ['INT-4','INT-6'] },
            { id: 'GCKL-23', phase: 'III', text: 'Kan şekeri kontrolü gerekli mi?',
              codeRule: { 0:'Kan şekeri gereksinimi değerlendirilmedi.', 1:'Gereksinim fark edildi ama ölçüm/izlem eksik.', 2:'Kan şekeri gereksinimi doğru değerlendirildi ve kontrol edildi.' },
              osceAlias: ['PRE-8'] },
            { id: 'GCKL-24', phase: 'III', text: 'Antikoagülan kullanımı var mı?',
              codeRule: { 0:'Antikoagülan kullanımı sorgulanmadı.', 1:'Sorgulandı ama son doz/kanama riski ilişkilendirilmedi.', 2:'Antikoagülan kullanımı, son doz ve kanama riski birlikte değerlendirildi.' },
              osceAlias: ['PRE-12'] },
            { id: 'GCKL-25', phase: 'III', text: 'Derin Ven Trombozu profilaksisi gerekli mi?',
              codeRule: { 0:'DVT profilaksisi değerlendirilmedi.', 1:'Risk fark edildi ama profilaksi planı eksik.', 2:'DVT profilaksi gereksinimi doğru değerlendirildi.' },
              osceAlias: ['PRE-12','POST-9'] },

            // IV. AMELİYATTAN ÇIKMADAN ÖNCE
            { id: 'GCKL-26', phase: 'IV',  text: 'Gerçekleştirilen ameliyat için sözlü olarak hasta, yapılan ameliyat ve ameliyat bölgesi teyit edildi mi?',
              codeRule: { 0:'Teyit yapılmadı.', 1:'Bazı bileşenler teyit edildi ama eksik kaldı.', 2:'Hasta, yapılan ameliyat ve ameliyat bölgesi sözlü olarak teyit edildi.' },
              criticalKey: 'signOutMissed', osceAlias: ['INT-13'] },
            { id: 'GCKL-27', phase: 'IV',  text: 'Alet, spanç/kompres ve iğne sayımları yapıldı mı?',
              options: ['Evet / Tam','Hayır','Sayım uygulanmaz'],
              codeRule: { 0:'Sayım yapılmadı veya doğrulanmadı.', 1:'Kısmi sayım yapıldı veya uyuşmazlık yönetimi eksik.', 2:'Alet, spanç/kompres ve iğne sayımı doğru tamamlandı.' },
              criticalKey: 'countMissed', osceAlias: ['INT-12'] },
            { id: 'GCKL-28', phase: 'IV',  text: 'Hastadan alınan numune etiketinde doğru bilgiler var mı?',
              sub: ['Hastanın adı doğru yazılı','Numunenin alındığı bölge yazılı'],
              codeRule: { 0:'Numune etiketi kontrol edilmedi.', 1:'Sadece hasta adı veya sadece bölge kontrol edildi.', 2:'Hasta adı ve numune bölgesi doğru kontrol edildi.' },
              osceAlias: ['INT-11'] },
            { id: 'GCKL-29', phase: 'IV',  text: 'Ameliyat sonrası kritik gereksinimler gözden geçirildi mi?',
              sub: ['Anestezistin önerileri','Cerrahın önerileri'],
              codeRule: { 0:'Kritik gereksinimler gözden geçirilmedi.', 1:'Sadece cerrah veya sadece anestezi önerisi alındı.', 2:'Cerrah ve anestezi önerileri birlikte alındı ve teslim planına aktarıldı.' },
              osceAlias: ['POST-1'] },
            { id: 'GCKL-30', phase: 'IV',  text: 'Hastanın ameliyat sonrası gideceği bölüm teyit edildi mi?',
              codeRule: { 0:'Gidilecek bölüm teyit edilmedi.', 1:'Bölüm söylendi ama teslim planıyla ilişkilendirilmedi.', 2:'Gidilecek bölüm doğrulandı ve teslim buna göre yapılandırıldı.' },
              criticalKey: 'pacuHandoverMissed', osceAlias: ['POST-1','POST-11'] }
        ];

        function gcklGetItem(id) { return GCKL_ITEMS.find(i => i.id === id); }
        function gcklItemsByPhase(phase) { return GCKL_ITEMS.filter(i => i.phase === phase); }

        /* ============================================================
           19 ÇOKTAN SEÇMELİ GEREKÇELİ SORU BANKASI
           Doğru seçenek dağılımı: A:5 / B:5 / C:5 / D:4
           ============================================================ */
        const GCKL_QUESTIONS = [
            // ===== Sayım Güvenliği =====
            { id: 'GCKL-Q-COUNT-01', section: 'III', linkedChecklistItem: 'GCKL-27',
              type: 'multiple_choice', correctOption: 'C',
              context: 'Başlangıç sayımı: Alet 24, Spanç/Kompres 20, İğne 8. Eklenen: Spanç/Kompres +5, İğne +2. Final sayımı: Alet 24, Spanç/Kompres 25, İğne 10.',
              question: 'Final sayımı değerlendirdiğinizde en güvenli karar hangisidir?',
              options: {
                A: 'Sayım eksik olmasına rağmen ekibin tecrübesine güvenip kapatma onayı verilebilir.',
                B: 'Final sayımı kayıt altına almak yeterlidir; sözlü doğrulama gerekmez.',
                C: 'Sayım beklenen değerlerle uyumludur; sözlü olarak doğrulanıp kayıt altına alınmalıdır.',
                D: 'Cerrahın istediği şekilde sayım atlanabilir.'
              },
              explanation: 'Başlangıç sayımı ve eklenen materyaller dikkate alındığında beklenen final sayım alet 24, spanç/kompres 25 ve iğne 10\'dur. Final sayım bu değerlerle uyumludur.',
              feedbackIfWrong: 'Beklenen final = başlangıç + eklenen. 24/25/10 değerleriyle uyumludur ve kayıt + sözlü doğrulama gerekir.' },

            { id: 'GCKL-Q-COUNT-02', section: 'III', linkedChecklistItem: 'GCKL-27',
              type: 'multiple_choice', correctOption: 'A',
              context: 'Başlangıç sayımı: Alet 24, Spanç/Kompres 20, İğne 8. Eklenen: Spanç/Kompres +5, İğne +2. Final sayımı: Alet 24, Spanç/Kompres 24, İğne 10.',
              question: 'Bu durumda en güvenli hemşirelik yaklaşımı hangisidir?',
              options: {
                A: 'Spanç sayımı beklenen değerden eksik olduğu için ekip bilgilendirilmeli, tekrar sayım ve alan kontrolü yapılmalıdır.',
                B: 'Tek spanç eksikliği klinik açıdan önemsizdir; sayım tam kabul edilebilir.',
                C: 'Spanç sayısı kayda olduğu gibi yazılmalı, fark sonradan değerlendirilmelidir.',
                D: 'Cerrahın hızlı kapatma talebine uyularak süreç tamamlanmalıdır.'
              },
              explanation: 'Beklenen spanç/kompres sayısı 25\'tir; final sayımı 24 olduğu için uyuşmazlık vardır.',
              feedbackIfWrong: 'Sayım uyuşmazlığı varsa süreç durdurulmalı, tekrar sayım ve alan kontrolü yapılmalıdır.' },

            { id: 'GCKL-Q-COUNT-03', section: 'III', linkedChecklistItem: 'GCKL-27',
              type: 'multiple_choice', correctOption: 'D',
              context: 'Başlangıç sayımı: Alet 18, Spanç/Kompres 15, İğne 6. Eklenen: İğne +3. Final sayımı: Alet 18, Spanç/Kompres 15, İğne 8.',
              question: 'Bu durumda beklenen final iğne sayısı kaç olmalıdır ve ne yapılmalıdır?',
              options: {
                A: 'Beklenen iğne sayısı 8\'dir; sayım tam kabul edilir.',
                B: 'Beklenen iğne sayısı 7\'dir; bir iğne fazla olduğu için kayıt yeterli.',
                C: 'Beklenen iğne sayısı 6\'dır; eklenen iğne sayılmaz.',
                D: 'Beklenen iğne sayısı 9\'dur; bir iğne eksik olduğu için sayım uyuşmazlığı protokolü başlatılmalıdır.'
              },
              explanation: 'Başlangıç iğne sayısı 6, eklenen iğne sayısı 3\'tür. Beklenen final sayı 9\'dur. Finalde 8 bildirilmişse bir iğne eksiktir.',
              feedbackIfWrong: 'Beklenen iğne sayısı 6+3=9. Eksiklik durumunda sayım uyuşmazlığı protokolü başlatılır.' },

            { id: 'GCKL-Q-COUNT-04', section: 'III', linkedChecklistItem: 'GCKL-27',
              type: 'multiple_choice', correctOption: 'B',
              question: 'Final spanç sayımında bir eksik vardır. Cerrah "zaman kaybetmeyelim, kapatalım" demektedir. En güvenli yaklaşım hangisidir?',
              options: {
                A: 'Cerrahın klinik kararına uyup hızlı kapatmaya geçmek.',
                B: 'Sayım uyuşmazlığını açıkça ifade etmek, tekrar sayım ve alan kontrolü istemek, çözülmeden süreci tamamlamamak.',
                C: 'Sayım kaydını "tam" olarak yazıp süreci kapatmak.',
                D: 'Eksik spancı sonradan saymak üzere not alıp ameliyatı bitirmek.'
              },
              explanation: 'Sayım uyuşmazlığı hasta güvenliği açısından kritik bir durumdur. Unutulmuş cerrahi materyal riskini dışlamadan süreç tamamlanmamalıdır.',
              feedbackIfWrong: 'Retained surgical item riski nedeniyle uyuşmazlık çözülmeden süreç tamamlanmamalıdır.' },

            { id: 'GCKL-Q-COUNT-05', section: 'III', linkedChecklistItem: 'GCKL-27',
              type: 'multiple_choice', correctOption: 'C',
              question: '"Sayım uygulanmaz" seçeneği hangi durumda güvenli kabul edilebilir?',
              options: {
                A: 'Süre kısıtlı olduğunda hızlı geçmek için.',
                B: 'Cerrah istemediğinde her durumda.',
                C: 'Yalnızca işlem türü ve kurum protokolü sayım gerektirmediğinde ve bu karar gerekçeli olarak doğrulandığında.',
                D: 'Sirküle hemşire deneyimsizse alışkanlık olarak.'
              },
              explanation: 'Sayım uygulanmaz seçeneği alışkanlıkla veya kolaylık için seçilmez. İşlem türü ve kurum protokolüyle uyumlu olmalıdır.',
              feedbackIfWrong: '"Sayım uygulanmaz" yalnızca protokolle uyumlu işlemlerde, gerekçeli doğrulamayla seçilebilir.' },

            // ===== Kimlik / Bileklik =====
            { id: 'GCKL-Q-ID-01', section: 'I', linkedChecklistItem: 'GCKL-1',
              type: 'multiple_choice', correctOption: 'B',
              context: 'Hasta bilekliğinde MRN: MR-3344120 yazıyor. Hasta dosyasında MRN: MR-3344210 yazıyor. Ameliyat listesinde hasta adı doğru görünüyor.',
              question: 'Bu durumda en güvenli yaklaşım hangisidir?',
              options: {
                A: 'Ameliyat listesi doğru olduğundan farklılığı görmezden gelmek.',
                B: 'İşlemi durdurmak, hasta kimliğini bileklik, dosya, ameliyat listesi ve ekip ile yeniden doğrulamak.',
                C: 'Bilekliği sökmek, dosyadaki MRN\'yi yeni bilekliğe yazıp süreci hızlandırmak.',
                D: 'Sözel beyan yeterli olduğu için doğrulamayı atlamak.'
              },
              explanation: 'MRN/protokol numarası uyumsuzluğu yanlış hasta veya yanlış işlem riskidir.',
              feedbackIfWrong: 'MRN uyumsuzluğu durdurucu bir bulgudur; çoklu kaynaktan yeniden doğrulama yapılmalıdır.' },

            { id: 'GCKL-Q-ID-02', section: 'I', linkedChecklistItem: 'GCKL-1',
              type: 'multiple_choice', correctOption: 'D',
              question: 'Cerrahi hastada kimlik doğrulaması için en güvenli yöntem hangisidir?',
              options: {
                A: 'Yatak numarasına bakmak.',
                B: 'Hastanın adını söylemesini istemek ve yeterli saymak.',
                C: 'Yalnızca ameliyat listesine güvenmek.',
                D: 'En az iki tanımlayıcı kullanmak; örneğin ad-soyad ve MRN/protokol numarası.'
              },
              explanation: 'Oda veya yatak numarası güvenilir hasta tanımlayıcısı değildir. En az iki hasta tanımlayıcısı kullanılmalıdır.',
              feedbackIfWrong: 'Güvenli kimlik doğrulamada en az iki tanımlayıcı (örn. ad-soyad + MRN) kullanılır.' },

            { id: 'GCKL-Q-ID-03', section: 'II', linkedChecklistItem: 'GCKL-10',
              type: 'multiple_choice', correctOption: 'A',
              context: 'Hasta sedatize olduğu için adını söyleyemiyor.',
              question: 'Kimlik doğrulaması nasıl yapılmalıdır?',
              options: {
                A: 'Bileklik, hasta dosyası, ameliyat listesi ve ekip doğrulaması kullanılarak en az iki tanımlayıcı üzerinden doğrulama yapılmalıdır.',
                B: 'Hasta yanıt veremediği için kimlik doğrulaması atlanır.',
                C: 'Yalnızca ameliyat listesine bakmak yeterlidir.',
                D: 'Refakatçinin sözlü beyanı tek başına yeterlidir.'
              },
              explanation: 'Hasta sözel doğrulama yapamıyorsa alternatif güvenilir kaynaklarla kimlik doğrulaması yapılmalıdır.',
              feedbackIfWrong: 'Sözel teyit alınamıyorsa bileklik+dosya+liste+ekip ile çapraz doğrulama yapılır.' },

            { id: 'GCKL-Q-ID-04', section: 'II', linkedChecklistItem: 'GCKL-14',
              type: 'multiple_choice', correctOption: 'C',
              context: 'Hasta dosyasında "penisilin alerjisi" yazıyor; ancak hastanın bilekliğinde veya görünür uyarı sisteminde alerji bilgisi yok.',
              question: 'Bu durumda en güvenli yaklaşım hangisidir?',
              options: {
                A: 'Bileklik bilgisi yoksa alerji yok kabul edilir.',
                B: 'Anestezi ekibine yalnızca sorulduğunda bildirmek.',
                C: 'Alerji bilgisini kritik güvenlik bilgisi olarak kabul edip ekibe bildirmek ve görünür uyarının düzeltilmesini sağlamak.',
                D: 'Profilaktik antibiyotiği planlanan şekilde uygulamak.'
              },
              explanation: 'Alerji bilgisinin görünür olmaması ilaç, antibiyotik, lateks veya anestezi ajanı hatalarına yol açabilir.',
              feedbackIfWrong: 'Alerji görünür uyarısı eksikse durdurucu bulgudur; ekibe bildirilip uyarı tamamlanır.' },

            { id: 'GCKL-Q-ID-05', section: 'I', linkedChecklistItem: 'GCKL-1',
              type: 'multiple_choice', correctOption: 'B',
              question: 'Aşağıdakilerden hangisi güvenilir hasta tanımlayıcısı değildir?',
              options: {
                A: 'Ad-soyad.',
                B: 'Oda/yatak numarası.',
                C: 'MRN/protokol numarası.',
                D: 'Doğum tarihi.'
              },
              explanation: 'Oda veya yatak numarası hastaya özgü sabit tanımlayıcı değildir; hasta değişebilir veya yatak değişikliği olabilir.',
              feedbackIfWrong: 'Yatak/oda numarası dinamik olduğu için güvenilir tanımlayıcı değildir.' },

            // ===== Antibiyotik =====
            { id: 'GCKL-Q-ABX-01', section: 'III', linkedChecklistItem: 'GCKL-20',
              type: 'multiple_choice', correctOption: 'D',
              context: 'Profilaktik antibiyotik 2 saat önce uygulanmış. Cerrahi kesi yapılmak üzere.',
              question: 'En uygun güvenli yaklaşım hangisidir?',
              options: {
                A: 'Antibiyotik uygulanmış olduğu için ek değerlendirme gerekmez.',
                B: 'Kesi yapıldıktan sonra redoz planlamak.',
                C: 'Antibiyotiği kayıttan silip yeniden başlatmak.',
                D: 'Antibiyotik zamanlamasının uygun olmadığını ekip içinde belirtmek ve yeniden değerlendirme istemek.'
              },
              explanation: 'Profilaktik antibiyotik cerrahi kesiden önce uygun zaman aralığında uygulanmalıdır.',
              feedbackIfWrong: 'Profilaktik antibiyotik kesi öncesi son 60 dk içinde olmalıdır; 2 saat önce uygulanan doz yeniden değerlendirilir.' },

            // ===== Sterilizasyon =====
            { id: 'GCKL-Q-STER-01', section: 'III', linkedChecklistItem: 'GCKL-22',
              type: 'multiple_choice', correctOption: 'A',
              question: 'Steril paket üzerindeki kimyasal gösterge uygun değilse ne yapılmalıdır?',
              options: {
                A: 'Malzeme kullanılmamalı ve uygun steril malzeme temin edilmelidir.',
                B: 'Acele bir durum varsa malzeme kullanılabilir.',
                C: 'Paket dışı görünüm sağlamsa kullanılabilir.',
                D: 'Cerrahın onayıyla kullanılabilir.'
              },
              explanation: 'Sterilizasyon göstergesi uygun değilse malzemenin steril olduğu kabul edilemez.',
              feedbackIfWrong: 'Kimyasal gösterge uygun değilse malzeme steril sayılmaz; kullanılmamalıdır.' },

            // ===== Time Out =====
            { id: 'GCKL-Q-TIMEOUT-01', section: 'III', linkedChecklistItem: 'GCKL-18',
              type: 'multiple_choice', correctOption: 'C',
              question: 'Time Out sırasında hangi doğrulama mutlaka sesli yapılmalıdır?',
              options: {
                A: 'Yalnızca cerrahın deneyim yılı.',
                B: 'Yalnızca anestezi tipi.',
                C: 'Hasta kimliği, yapılacak ameliyat ve ameliyat bölgesi.',
                D: 'Yalnızca kullanılacak malzeme listesi.'
              },
              explanation: 'Time Out, cerrahi kesi öncesinde hasta, işlem ve bölge doğrulamasının ekip içinde sesli yapıldığı kritik güvenlik adımıdır.',
              feedbackIfWrong: 'Time Out\'un çekirdeği: hasta, işlem ve bölgenin sesli teyididir.' },

            { id: 'GCKL-Q-TIMEOUT-02', section: 'III', linkedChecklistItem: 'GCKL-19',
              type: 'multiple_choice', correctOption: 'B',
              question: 'Time Out sırasında kritik olayların gözden geçirilmesinin temel amacı nedir?',
              options: {
                A: 'Ameliyatı hızlandırmak.',
                B: 'Ekip olarak kan kaybı, süre, anestezi riski, pozisyon ve beklenmedik olaylara hazırlıklı olmak.',
                C: 'Cerrahın tek başına karar vermesini sağlamak.',
                D: 'Sayım kayıtlarını tamamlamak.'
              },
              explanation: 'Kritik olayların konuşulması ekip farkındalığını ve risklere hazırlığı artırır.',
              feedbackIfWrong: 'Kritik olay gözden geçirme; süre, kanama, anestezi, pozisyon ve beklenmedik olaylara ekip hazırlığını sağlar.' },

            // ===== Specimen =====
            { id: 'GCKL-Q-SPEC-01', section: 'IV', linkedChecklistItem: 'GCKL-28',
              type: 'multiple_choice', correctOption: 'D',
              context: 'Numune kabında hasta adı doğru yazıyor; ancak numunenin alındığı bölge yazılmamış.',
              question: 'En güvenli yaklaşım hangisidir?',
              options: {
                A: 'Patolojiye göndermek; bölge bilgisi sonradan eklenebilir.',
                B: 'Yalnızca hasta adı yeterli kabul edilir.',
                C: 'Cerrahın hatırladığı bölgeyi sözlü iletmek yeterlidir.',
                D: 'Numune gönderilmeden önce alınan bölgenin doğru şekilde etikete yazılmasını sağlamak.'
              },
              explanation: 'Eksik specimen etiketi yanlış tanı, yanlış tedavi ve numune karışıklığı riskini artırır.',
              feedbackIfWrong: 'Numune etiketi gönderim öncesi tam (hasta adı + bölge) olmalıdır.' },

            { id: 'GCKL-Q-SPEC-02', section: 'IV', linkedChecklistItem: 'GCKL-28',
              type: 'multiple_choice', correctOption: 'C',
              question: 'Specimen etiketinde yanlış hasta adı fark edildiğinde ne yapılmalıdır?',
              options: {
                A: 'Numune doğru sayılır; etiket sonradan düzeltilir.',
                B: 'Patolojiye gönderildikten sonra düzeltme istenir.',
                C: 'Numune gönderimi durdurulmalı, kimlik ve numune bilgileri ekip ile yeniden doğrulanmalıdır.',
                D: 'Hasta adı önemli değil, bölge yeterlidir.'
              },
              explanation: 'Yanlış hasta adı ciddi hasta güvenliği olayıdır; gönderim öncesi doğrulama yapılmalıdır.',
              feedbackIfWrong: 'Yanlış hasta adı etiketi durdurucu bulgudur; yeniden doğrulama gerektirir.' },

            // ===== DVT =====
            { id: 'GCKL-Q-DVT-01', section: 'III', linkedChecklistItem: 'GCKL-25',
              type: 'multiple_choice', correctOption: 'B',
              context: 'Uzun sürecek cerrahi planlanıyor; hasta obez ve postoperatif immobilizasyon riski yüksek. DVT profilaksisi konuşulmamış.',
              question: 'En güvenli yaklaşım hangisidir?',
              options: {
                A: 'DVT profilaksisi rutin değildir, atlanabilir.',
                B: 'DVT riskini ekip içinde gündeme getirmek ve mekanik/farmakolojik profilaksi gereksinimini sorgulamak.',
                C: 'Yalnızca postop dönemde mobilizasyon yeterlidir.',
                D: 'Cerrah belirtmediyse riski değerlendirmeye gerek yoktur.'
              },
              explanation: 'Uzun cerrahi, obezite ve immobilizasyon DVT riskini artırır; profilaksi gereksinimi cerrahi süreçte değerlendirilmelidir.',
              feedbackIfWrong: 'DVT riski yüksek vakada profilaksi gereksinimi (mekanik/farmakolojik) ekipçe sorgulanmalıdır.' },

            // ===== Glukoz =====
            { id: 'GCKL-Q-GLU-01', section: 'III', linkedChecklistItem: 'GCKL-23',
              type: 'multiple_choice', correctOption: 'A',
              question: 'Kan şekeri kontrolü hangi durumda özellikle önemlidir?',
              options: {
                A: 'Diyabeti, hiperglisemisi veya enfeksiyon riski yüksek cerrahi hastalarda.',
                B: 'Yalnızca pediatrik vakalarda.',
                C: 'Yalnızca acil cerrahide.',
                D: 'Yalnızca minör girişimlerde.'
              },
              explanation: 'Hiperglisemi enfeksiyon ve yara iyileşmesi sorunlarıyla ilişkilidir; riskli hastalarda kontrol edilmelidir.',
              feedbackIfWrong: 'DM, hiperglisemi veya enfeksiyon riski yüksek hastalarda kan şekeri kontrolü kritiktir.' },

            // ===== Antikoagülan =====
            { id: 'GCKL-Q-ANTICOAG-01', section: 'III', linkedChecklistItem: 'GCKL-24',
              type: 'multiple_choice', correctOption: 'D',
              question: 'Antikoagülan/antiagregan kullanımını sorgulamanın temel gerekçesi nedir?',
              options: {
                A: 'Hastanın diyetini düzenlemek.',
                B: 'Yalnızca eczane kayıtları için.',
                C: 'Kan şekerini öngörmek.',
                D: 'Kanama riski, cerrahi planlama ve anestezi güvenliği açısından önemlidir.'
              },
              explanation: 'Antikoagülan/antiagregan kullanımı kanama riskini ve perioperatif planlamayı doğrudan etkiler.',
              feedbackIfWrong: 'Antikoagülan sorgusu kanama riski, cerrahi ve anestezi planlaması için kritiktir.' }
        ];

        function gcklGetQuestion(id) { return GCKL_QUESTIONS.find(q => q.id === id); }
        function gcklQuestionsForItem(itemId) { return GCKL_QUESTIONS.filter(q => q.linkedChecklistItem === itemId); }

        // Doğru seçenek dağılımı doğrulayıcı (geliştirme amaçlı)
        function validateGCKLAnswerDistribution() {
            const dist = { A:0, B:0, C:0, D:0 };
            GCKL_QUESTIONS.forEach(q => { if (dist[q.correctOption] !== undefined) dist[q.correctOption]++; });
            try {
                console.group('%cGCKL Question Distribution', 'color:#9bc4a8;font-weight:bold');
                console.log(`Toplam soru: ${GCKL_QUESTIONS.length}`);
                console.log(`A:${dist.A} | B:${dist.B} | C:${dist.C} | D:${dist.D}`);
                if (dist.A === GCKL_QUESTIONS.length) console.warn('Tüm doğru cevaplar A — dengesiz!');
                console.groupEnd();
            } catch(e){}
            return dist;
        }
        try { window.addEventListener('load', () => { try { validateGCKLAnswerDistribution(); } catch(e){} }); } catch(e){}

        /* ============================================================
           SAYIM GÜVENLİĞİ — VAKA VERİSİ ŞABLONU
           Vakanın kendi surgicalCountData alanı override eder.
           ============================================================ */
        const GCKL_DEFAULT_COUNT = {
            initial:           { instruments: 24, sponges: 20, needles: 8 },
            addedDuringSurgery:{ instruments: 0,  sponges: 5,  needles: 2 },
            finalReported:     { instruments: 24, sponges: 25, needles: 10 },
            discrepancyScenario: false,
            missingItem: null,
            expectedFinal:     { instruments: 24, sponges: 25, needles: 10 }
        };

        function gcklComputeExpectedFinal(data) {
            const i = data.initial || {};
            const a = data.addedDuringSurgery || {};
            return {
                instruments: (i.instruments || 0) + (a.instruments || 0),
                sponges:     (i.sponges     || 0) + (a.sponges     || 0),
                needles:     (i.needles     || 0) + (a.needles     || 0)
            };
        }

        function gcklEvaluateCount(data) {
            const exp = data.expectedFinal || gcklComputeExpectedFinal(data);
            const fin = data.finalReported || {};
            const diff = {
                instruments: (fin.instruments || 0) - exp.instruments,
                sponges:     (fin.sponges     || 0) - exp.sponges,
                needles:     (fin.needles     || 0) - exp.needles
            };
            const hasDiscrepancy = diff.instruments !== 0 || diff.sponges !== 0 || diff.needles !== 0;
            return { expected: exp, reported: fin, diff, hasDiscrepancy };
        }

        /* ============================================================
           BİLEKLİK / KİMLİK SENARYOLARI
           ============================================================ */
        const GCKL_WRISTBAND_SCENARIOS = [
            { id: 'WB-1', label: 'Bileklik doğru, dosya doğru, hasta sözel olarak doğruluyor', mismatch: false, type: 'normal' },
            { id: 'WB-2', label: 'Bileklik var ama ameliyat listesinde soyadı farklı yazılmış', mismatch: true,  type: 'list_mismatch' },
            { id: 'WB-3', label: 'Hasta sedasyon nedeniyle yanıt veremiyor',                     mismatch: false, type: 'patient_unable' },
            { id: 'WB-4', label: 'Alerji bilgisi dosyada var ama bileklikte alerji uyarısı yok', mismatch: true,  type: 'allergy_mismatch' },
            { id: 'WB-5', label: 'Bileklik yok',                                                 mismatch: true,  type: 'no_wristband' }
        ];

        // ===================== GEMINI API BOILERPLATE =====================
        // API anahtarı: önce sessionStorage (kullanıcı girdiği), yoksa
        // host environment tarafından enjekte edilen değer (boş kalabilir).
        function getApiKey() {
            try {
                const k = sessionStorage.getItem('NK_GEMINI_KEY');
                if (k && k.trim()) return k.trim();
            } catch (e) { /* storage kapalı olabilir */ }
            return ""; // host-injected
        }
        const apiKey = ""; // legacy — bazı eski çağrılar için tutulur

        // m0192: AI modu açık ama API key yoksa Gemini'a boşuna istek atılmasın.
        // Bu flag senderlere (getPatientReply, sembol analizleri vb.) hızlı fallback yolu açar.
        function hasGeminiKey() {
            return !!getApiKey();
        }

        async function callGeminiAPI(prompt) {
            const key = getApiKey() || apiKey;
            if (!key) {
                // Anahtar yok → fallback için sinyal döndür (boş string).
                // Çağıran taraf bu durumu kontrol edip kural-tabanlı yanıta düşmeli.
                console.warn('[Gemini] API anahtarı yok; kural-tabanlı yanıta düşülüyor.');
                return "";
            }
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`;
            const payload = {
                contents: [{ parts: [{ text: prompt }] }]
            };
            
            // Exponential backoff mechanism (1s, 2s, 4s, 8s, 16s)
            const delays = [1000, 2000, 4000, 8000, 16000];
            for (let i = 0; i < delays.length + 1; i++) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    
                    const data = await response.json();
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";
                    
                } catch (err) {
                    if (i === delays.length) {
                        console.error("Gemini API Error after retries:", err);
                        return "Yapay zeka servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.";
                    }
                    // Wait before retrying (exponential backoff)
                    await new Promise(r => setTimeout(r, delays[i]));
                }
            }
        }

        async function callGeminiJSON(prompt, schema) {
            const key = getApiKey() || apiKey;
            if (!key) {
                console.warn('[Gemini JSON] API anahtarı yok; fallback için null döndü.');
                return null;
            }
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`;
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            };
            const delays = [1000, 2000, 4000, 8000];
            for (let i = 0; i < delays.length + 1; i++) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    return text ? JSON.parse(text) : null;
                } catch (err) {
                    if (i === delays.length) return null;
                    await new Promise(r => setTimeout(r, delays[i]));
                }
            }
        }

        async function playTTS(text, gender) {
            const cleanText = text.replace(/[*#_]/g, '');
            const voiceName = gender === 'Kadın' ? 'Aoede' : 'Fenrir';
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{ parts: [{ text: cleanText }] }],
                generationConfig: { 
                    responseModalities: ["AUDIO"], 
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } } } 
                }
            };
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
                
                if(inlineData && inlineData.data) {
                    const rateMatch = inlineData.mimeType.match(/rate=(\d+)/);
                    const sampleRate = rateMatch ? parseInt(rateMatch[1]) : 24000;
                    
                    const binaryString = atob(inlineData.data);
                    const pcmBytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        pcmBytes[i] = binaryString.charCodeAt(i);
                    }
                    
                    const wavHeader = new ArrayBuffer(44);
                    const view = new DataView(wavHeader);
                    const writeString = (offset, string) => {
                        for (let i = 0; i < string.length; i++) {
                            view.setUint8(offset + i, string.charCodeAt(i));
                        }
                    };
                    
                    writeString(0, 'RIFF');
                    view.setUint32(4, 36 + pcmBytes.length, true);
                    writeString(8, 'WAVE');
                    writeString(12, 'fmt ');
                    view.setUint32(16, 16, true);
                    view.setUint16(20, 1, true); // PCM
                    view.setUint16(22, 1, true); // Mono
                    view.setUint32(24, sampleRate, true);
                    view.setUint32(28, sampleRate * 2, true); // Byte rate
                    view.setUint16(32, 2, true); // Block align
                    view.setUint16(34, 16, true); // Bits per sample
                    writeString(36, 'data');
                    view.setUint32(40, pcmBytes.length, true);
                    
                    const wavBlob = new Blob([wavHeader, pcmBytes], { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(wavBlob);
                    const audio = new Audio(audioUrl);
                    audio.play();
                }
            } catch(e) {
                console.error("TTS Error", e);
            }
        }
        // ==================================================================

        const GUIDELINE_THEMES = {
            who_ssc: { tag: 'WHO SSC', name: 'WHO Surgical Safety Checklist', color: '#5b9bd5' },
            who_ssi: { tag: 'WHO SSI', name: 'WHO SSI Önleme Kılavuzu', color: '#7fb069' },
            nice_hypo: { tag: 'NICE', name: 'NICE Perioperatif Hipotermi', color: '#f0a040' },
            eras: { tag: 'ERAS', name: 'ERAS İlkeleri', color: '#9c89b8' },
            npiap: { tag: 'NPIAP', name: 'Basınç Yaralanması Önleme', color: '#f4978e' },
            padis: { tag: 'PADIS', name: 'PADIS Ağrı/Deliryum', color: '#22a8d8' },
            aorn: { tag: 'AORN', name: 'AORN Perioperatif İlkeleri', color: '#56cfe1' },
            nanda: { tag: 'NANDA-I', name: 'NANDA-I Hemşirelik Tanıları', color: '#e0b0ff' }
        };
        const GUIDELINE_FEEDBACK = {
            who_ssc: 'Bu uygulama güvenli cerrahi sürecinin temel adımlarındandır; yanlış hasta ve yanlış cerrahi riskini azaltmayı hedefler.',
            who_ssi: 'Aseptik teknik ve antibiyotik profilaksisi cerrahi alan enfeksiyonu riskini azaltır.',
            nice_hypo: 'Perioperatif hipotermi kanama, SSI ve titreme bağlı oksijen tüketimini artırır; ısı izlemi ve aktif ısıtma önerilir.',
            eras: 'Erken iyileşme ilkeleri preop eğitim, multimodal analjezi, PONV önleme ve erken mobilizasyona dayanır.',
            npiap: 'Uzun süreli pozisyon ve hareketsizlik basınç yaralanması riskini artırır; basınç noktalarının korunması esastır.',
            padis: 'Ağrı, deliryum ve sedasyon birlikte değerlendirilir; ağrı kontrolü mobilizasyon ve bilinç için gereklidir.',
            aorn: 'Steril alan, pozisyonlama, sayım güvenliği ve ekip iletişimi perioperatif hasta güvenliğinin temelidir.',
            nanda: 'Hemşirelik tanıları; ilişkili faktörler, belirti-bulgular, beklenen sonuçlar ve girişimler ile yapılandırılır.'
        };
        const SPECIALTIES = [{ id: 'all', name: 'Tüm Branşlar' }, { id: 'cardio', name: 'Kalp ve Damar Cerrahisi' },
            { id: 'ortho', name: 'Ortopedi ve Travmatoloji' }, { id: 'general', name: 'Genel Cerrahi' }, { id: 'neuro',
                name: 'Beyin ve Sinir Cerrahisi' }, { id: 'uro', name: 'Üroloji' }, { id: 'gyn', name: 'Kadın Hast. ve Doğum Cerrahisi' },
            { id: 'thoracic', name: 'Göğüs Cerrahisi' }, { id: 'plastic', name: 'Plastik ve Rekonstrüktif Cerrahi' }, { id: 'ent',
                name: 'KBB Cerrahisi' }, { id: 'ophth', name: 'Göz Cerrahisi' }
        ];
        const DIALOG_QUESTIONS = [
            { group: 'Kimlik ve güvenlik', id: 'q_id', label: 'Lütfen adınızı ve doğum tarihinizi söyler misiniz?' }, 
            { group: 'Kimlik ve güvenlik', id: 'q_proc', label: 'Bugün hangi ameliyat olacağınızı biliyor musunuz?' }, 
            { group: 'Alerji ve ilaçlar', id: 'q_allergy', label: 'Bilinen herhangi bir alerjiniz var mı?' }, 
            { group: 'Alerji ve ilaçlar', id: 'q_meds', label: 'Düzenli kullandığınız ilaçlar nelerdir?' }, 
            { group: 'Ameliyat Hazırlığı', id: 'q_prosthesis', label: 'Üzerinizde herhangi bir takı, metal eşya veya hareketli diş protezi var mı?' },
            { group: 'Ameliyat Hazırlığı', id: 'q_fasting', label: 'En son ne zaman su içtiniz veya yemek yediniz?' },
            { group: 'Ağrı ve anksiyete', id: 'q_pain', label: 'Şu anda ağrınız var mı? Şiddeti nasıl?' }, 
            { group: 'Ağrı ve anksiyete', id: 'q_anx', label: 'Cerrahi süreçle ilgili endişeleriniz var mı?' }, 
            { group: 'Cerrahi bilgi', id: 'q_info', label: 'Cerrahi sonrasında ne olacağı hakkında bilgi aldınız mı?' }, 
            { group: 'Postoperatif eğitim', id: 'q_mob', label: 'Erken mobilizasyon ve solunum egzersizi öğretildi mi?' } 
        ];

        const SCORE_CATEGORIES = {
            clinicalAssessment: { label: 'Klinik Değerlendirme', desc: 'Semptom seçimi, vital bulgu değerlendirmesi, ağrı/solunum/kanama/drenaj izlemi ve klinik bulgu farkındalığına göre hesaplandı.' },
            patientSafety: { label: 'Güvenli Cerrahi Kontrol Listesi Uyum Durumu', desc: '30 maddelik Güvenli Cerrahi Kontrol Listesi maddelerinden hangilerinin tam, kısmi veya eksik yapıldığına göre hesaplandı.' },
            communication: { label: 'İletişim', desc: 'Hasta ile kurulan diyalog, hasta/aile eğitimi, terapötik iletişim ve ekip iletişimi görevlerine göre hesaplandı.' },
            prioritisation: { label: 'Önceliklendirme', desc: 'Öncelikli semptomları, kritik hemşirelik tanılarını, acil klinik olayları ve güvenli müdahale sırasını doğru belirleme durumuna göre hesaplandı.' },
            surgicalNursingKnowledge: { label: 'Cerrahi Hemşireliği Bilgisi', desc: 'Cerrahi sürece özgü bakım görevleri, komplikasyon bilgisi, faza uygun girişimler ve kılavuz temelli güvenlik ilkelerine göre hesaplandı.' },
            nursingDiagnosisPerformance: { label: 'Hemşirelik Tanısı Performansı', desc: 'Her fazda seçilen hemşirelik tanılarının vaka ile ilişkisi, öncelik düzeyi ve kritik tanıları kapsama durumuna göre hesaplandı.' },
            clinicalReasoning: { label: 'Klinik Akıl Yürütme', desc: 'Gerekçelendirme sorularına verilen yanıtlar, kararın klinik nedeni, önlenen risk ve uygun güvenlik ilkesiyle ilişkilendirme durumuna göre hesaplandı.' },
            checklistPerformance: { label: 'Checklist Performansı', desc: 'Güvenli cerrahi kontrol listesi maddelerinin doğru, eksiksiz ve faza uygun tamamlanmasına göre hesaplandı.' },
            countingSafety: { label: 'Sayım Güvenliği', desc: 'Alet, spanç ve iğne sayımı senaryolarındaki doğru kararlar ve sayım uyuşmazlığına verilen güvenli yanıtlar üzerinden hesaplandı.' },
            patientCentredCare: { label: 'Hasta Merkezli Bakım', desc: 'Hastanın kaygısı, mahremiyeti, ağrısı, aile bilgilendirme sınırları, kültürel ihtiyaçları ve hasta eğitimine yönelik seçimlere göre hesaplandı.' }
        };

        const GENERIC_SYMPTOMS = ['Halsizlik', 'Baş dönmesi', 'Titreme', 'Terleme', 'Çarpıntı', 'Kaşıntı', 'Öksürük', 'İştahsızlık', 'Uykusuzluk', 'Ajitasyon', 'Görme bulanıklığı', 'Solunum sıkıntısı'];
        const GENERIC_DIAGNOSES = [
            { title: 'Bozulmuş Uyku Düzeni', priority: 'low', relevance: 'incorrect', factors: ['Hastaneye yatış'], evidence: ['Uykusuzluk'], expectedOutcomes: ['Normal uyku süresi'], interventions: ['Çevreyi sessizleştir'], rationale: 'Cerrahi faza ait doğrudan bir öncelik değil.' },
            { title: 'Sıvı Volüm Eksikliği Riski', priority: 'medium', relevance: 'low', factors: ['Açlık', 'Cerrahi sıvı kaybı'], evidence: ['Mukozal kuruluk'], expectedOutcomes: ['Normovolemi'], interventions: ['Sıvı izlemi, idrar takibi'], rationale: 'Olası cerrahi komplikasyon.' },
            { title: 'Düşme Riski', priority: 'medium', relevance: 'low', factors: ['Anestezi', 'Bozulmuş mobilite'], evidence: ['Ayakta duramama'], expectedOutcomes: ['Düşme olmaz'], interventions: ['Yatak kenarlıkları, destekli mobilizasyon'], rationale: 'Güvenlik önlemi.' },
            { title: 'Bozulmuş Fiziksel Mobilite', priority: 'low', relevance: 'incorrect', factors: ['Ağrı'], evidence: ['Hareket etmede isteksizlik'], expectedOutcomes: ['Bağımsız hareket'], interventions: ['Mobilizasyon desteği'], rationale: 'Acil perioperatif sorunları takiben düşünülür.' },
            { title: 'Travma Riski', priority: 'medium', relevance: 'incorrect', factors: ['Çevre'], evidence: ['Bilinç bulanıklığı'], expectedOutcomes: ['Travma gelişmez'], interventions: ['Güvenlik önlemleri'], rationale: 'Daha spesifik riskler (pozisyon vb.) tercih edilmeli.' },
            { title: 'Konstipasyon Riski', priority: 'low', relevance: 'incorrect', factors: ['İlaçlar', 'Hareketsizlik'], evidence: ['Barsak seslerinde azalma'], expectedOutcomes: ['Normal defekasyon'], interventions: ['Sıvı ve lif alımı'], rationale: 'Postop geç dönem sorunudur.' },
            { title: 'Gönülsüzlük', priority: 'low', relevance: 'incorrect', factors: ['Stres'], evidence: ['İçe kapanma'], expectedOutcomes: ['Tedaviye uyum'], interventions: ['İletişim'], rationale: 'Akut cerrahi bakımından ziyade psikososyal alandır.' }
        ];


        function nk132CloneTaskBase(oldTask, fallbackId, label, opts = {}) {
            const base = oldTask ? { ...oldTask } : {};
            return {
                ...base,
                id: base.id || fallbackId,
                label,
                critical: !!opts.critical,
                score: opts.score ?? base.score ?? 6,
                guideline: opts.guideline || base.guideline || 'who_ssc',
                group: opts.group || 'Zorunlu Güvenlik Görevleri',
                cardKey: opts.cardKey || fallbackId,
                substeps: opts.substeps || [],
                keywords: opts.keywords || [],
                categories: opts.categories || base.categories || []
            };
        }

        function nk132FindTask(tasks, keys, used = new Set()) {
            const norm = s => String(s || '').toLocaleLowerCase('tr-TR');
            return (tasks || []).find(t => {
                if (!t || used.has(t.id)) return false;
                const hay = norm((t.label || '') + ' ' + (t.id || '') + ' ' + ((t.keywords || []).join(' ')));
                return keys.some(k => hay.includes(norm(k)));
            }) || null;
        }

        function applyPreopTaskArchitecture(caseObj, phaseObj) {
            if (!caseObj || !phaseObj || !Array.isArray(phaseObj.tasks)) return phaseObj;
            if (phaseObj.__nk132PreopTaskArchitectureApplied) return phaseObj;

            const oldTasks = phaseObj.tasks || [];
            const used = new Set();
            const take = (keys) => {
                const t = nk132FindTask(oldTasks, keys, used);
                if (t?.id) used.add(t.id);
                return t;
            };
            const prefix = (caseObj.id || 'case') + '_preop';

            const verifyOld = take(['kimlik', 'onam', 'bölge', 'taraf']);
            const allergyOld = take(['alerji']);
            const npoOld = take(['npo', 'açlık', 'tetkik', 'laboratuvar']);
            const bloodOld = take(['kan', 'crossmatch']);
            const medOld = take(['ilaç', 'antikoagülan']);
            const ivOld = take(['iv', 'damar yolu']);
            const transferOld = take(['transfer', 'teslim']);
            const deliriumOld = take(['deliryum', 'kognitif']);
            const anxietyOld = take(['anksiyete', 'kaygı']);
            const vteOld = take(['vte', 'trombo', 'profilaksi']);
            const skinOld = take(['cilt', 'clipper', 'tıraş', 'tiras']);
            const prepOld = take(['protez', 'değerli', 'makyaj', 'önlük', 'hazırlık']);

            const safety = 'Zorunlu Güvenlik Görevleri';
            const care = 'Bakım ve Risk Değerlendirme Görevleri';

            phaseObj.tasks = [
                nk132CloneTaskBase(verifyOld, prefix + '_verify', 'Kimlik / Onam / Taraf · Cerrahi doğrulamayı tamamla', {
                    critical: true, score: 12, guideline: 'who_ssc', group: safety, cardKey: 'identity-consent-site',
                    keywords: ['kimlik','onam','taraf','bölge','ameliyat','doğrulama'],
                    substeps: ['Kimliği hastadan doğrula', 'Cerrahi onamı kontrol et', 'Ameliyat bölgesi/tarafı doğrula'],
                    categories: ['patientSafety','checklistPerformance','communication']
                }),
                nk132CloneTaskBase(allergyOld, prefix + '_allergy', 'Alerji · Alerji riskini doğrula', {
                    critical: true, score: 8, guideline: 'who_ssc', group: safety, cardKey: 'preop-allergy',
                    keywords: ['alerji','lateks','ilaç hassasiyeti','risk'],
                    substeps: ['Alerji öyküsünü sorgula', 'Kayıt/dosya ile doğrula'],
                    categories: ['patientSafety','checklistPerformance','clinicalAssessment']
                }),
                nk132CloneTaskBase(npoOld, prefix + '_npo', 'NPO · Açlık ve tetkik uygunluğunu doğrula', {
                    critical: true, score: 8, guideline: 'eras', group: safety, cardKey: 'npo-labs',
                    keywords: ['npo','açlık','tetkik','laboratuvar','kan hazırlığı'],
                    substeps: ['NPO durumunu kontrol et', 'Gerekli tetkikleri kontrol et'],
                    categories: ['patientSafety','clinicalAssessment','surgicalNursingKnowledge']
                }),
                nk132CloneTaskBase(bloodOld, prefix + '_blood', 'KAN · Kan hazırlığını doğrula', {
                    critical: true, score: 9, guideline: 'who_ssc', group: safety, cardKey: 'preop-crossmatch',
                    keywords: ['kan','crossmatch','kan grubu','kan hazırlığı'],
                    substeps: ['Kan grubu/crossmatch kontrol et', 'Gerekli kan hazırlığını doğrula'],
                    categories: ['patientSafety','checklistPerformance','surgicalNursingKnowledge']
                }),
                nk132CloneTaskBase(medOld, prefix + '_medrec', 'İlaç · İlaç öyküsünü doğrula', {
                    critical: true, score: 8, guideline: 'who_ssc', group: safety, cardKey: 'preop-medrec',
                    keywords: ['ilaç','antikoagülan','insülin','antihipertansif','ilaç uzlaştırma'],
                    substeps: ['Sürekli kullanılan ilaçları sorgula', 'Antikoagülan / riskli ilaçları değerlendir'],
                    categories: ['patientSafety','clinicalAssessment','surgicalNursingKnowledge']
                }),
                nk132CloneTaskBase(ivOld, prefix + '_iv', 'IV · Damar yolu hazırlığını kontrol et', {
                    critical: true, score: 7, guideline: 'who_ssc', group: safety, cardKey: 'iv-access',
                    keywords: ['iv','damar yolu','erişim','sıvı'],
                    substeps: ['IV erişimi kontrol et', 'Kullanıma uygunluğunu doğrula'],
                    categories: ['patientSafety','clinicalAssessment']
                }),
                nk132CloneTaskBase(transferOld, prefix + '_transfer', 'Transfer · Güvenli transfer hazırlığını tamamla', {
                    critical: true, score: 8, guideline: 'who_ssc', group: safety, cardKey: 'preop-transfer',
                    keywords: ['transfer','teslim','dosya','hasta','damar yolu'],
                    substeps: ['Dosya / hasta / damar yolu kontrolünü yap', 'Güvenli teslim hazırlığını tamamla'],
                    categories: ['patientSafety','communication','checklistPerformance']
                }),
                nk132CloneTaskBase(deliriumOld, prefix + '_delirium', 'Deliryum · Kognitif riski değerlendir', {
                    critical: false, score: 6, guideline: 'padis', group: care, cardKey: 'preop-delirium',
                    keywords: ['deliryum','kognitif','oryantasyon','duyusal destek'],
                    substeps: ['Deliryum risk faktörlerini sorgula', 'Oryantasyon / duyusal destek gereksinimini belirle'],
                    categories: ['clinicalAssessment','patientCentredCare','clinicalReasoning']
                }),
                nk132CloneTaskBase(anxietyOld, prefix + '_anxiety', 'Anksiyete · Preop kaygıyı değerlendir', {
                    critical: false, score: 6, guideline: 'eras', group: care, cardKey: 'preop-anxiety',
                    keywords: ['anksiyete','kaygı','bilgilendirme','destek'],
                    substeps: ['Kaygı düzeyini sorgula', 'Bilgilendirme / destek gereksinimini belirle'],
                    categories: ['communication','patientCentredCare','clinicalAssessment']
                }),
                nk132CloneTaskBase(vteOld, prefix + '_vte', 'VTE · Profilaksi gereksinimini gözden geçir', {
                    critical: false, score: 6, guideline: 'eras', group: care, cardKey: 'preop-vte',
                    keywords: ['vte','tromboemboli','profilaksi','antiembolik'],
                    substeps: ['VTE riskini değerlendir', 'Profilaksi hazırlığını kontrol et'],
                    categories: ['clinicalAssessment','surgicalNursingKnowledge']
                }),
                nk132CloneTaskBase(skinOld, prefix + '_skin', 'Cilt Hazırlığı · Cerrahi alan hazırlığını doğrula', {
                    critical: false, score: 6, guideline: 'who_ssi', group: care, cardKey: 'preop-clipper',
                    keywords: ['cilt','clipper','tıraş','tiras','cerrahi alan'],
                    substeps: ['Cilt hazırlığı uygunluğunu kontrol et', 'Clipper gereksinimini değerlendir'],
                    categories: ['surgicalNursingKnowledge','patientSafety']
                }),
                nk132CloneTaskBase(prepOld, prefix + '_prep', 'Hazırlık · Hasta hazırlığını tamamla (takı / protez / oje / önlük)', {
                    critical: false, score: 6, guideline: 'who_ssc', group: care, cardKey: 'prep',
                    keywords: ['hazırlık','takı','protez','oje','makyaj','önlük','değerli eşya'],
                    substeps: ['Takı / protez / oje / makyaj kontrolünü yap', 'Kıyafet ve kişisel eşya kontrolünü tamamla'],
                    categories: ['patientSafety','surgicalNursingKnowledge']
                })
            ];
            phaseObj.__nk132PreopTaskArchitectureApplied = true;
            return phaseObj;
        }

        /* =========================================================
           INTRAOP TASK ARCHITECTURE — Aşama 1.1 (WHO SSC hizalı)
           
           Yapı: 4 görev kartı, WHO Surgical Safety Checklist
           omurgasıyla birebir hizalı. GCKL maddeleri her karta
           dağıtılmıştır. Pedagojik amaç: öğrenci ekrana baktığında
           cerrahi güvenliğin üç sözel teyit anını (Sign-In,
           Time-Out, Sign-Out) ve aralarındaki sürekli izlem
           sorumluluğunu doğal olarak görür.
           
           İNT-1 · Sign-In Devri      → WHO SSC Phase II / GCKL II
           İNT-2 · Time-Out          → WHO SSC Phase III / GCKL III
           İNT-3 · İntraoperatif İzlem → klinik süreç (sürekli)
           İNT-4 · Sign-Out          → WHO SSC Phase IV / GCKL IV
           
           Veri modeli preop ile aynı: id, label, critical, score,
           guideline, group, cardKey, substeps, keywords, categories.
           
           Geriye dönük uyumluluk: eski görev ID'leri (ti_warm,
           oti2_count vb.) korunur — mevcut event/RQ tetikleyicileri
           kırılmaz. completedTasks ve NurseKitSM altyapısı
           etkilenmez.
           ========================================================= */

        // INT görev → GCKL madde köprüsü
        // WHO SSC fazlarına göre dağıtılmış 14 GCKL maddesi
        const INT_TO_GCKL = {
            // İNT-1 Sign-In Devri (GCKL Phase II - Anestezi öncesi son kontrol)
            'INT-1': ['GCKL-10','GCKL-11','GCKL-12','GCKL-13','GCKL-14','GCKL-15','GCKL-16'],
            // İNT-2 Time-Out (GCKL Phase III - İnsizyon öncesi)
            'INT-2': ['GCKL-17','GCKL-18','GCKL-19','GCKL-20','GCKL-21','GCKL-22','GCKL-23','GCKL-24','GCKL-25'],
            // İNT-3 İntraoperatif İzlem (sürekli süreç - GCKL'de doğrudan karşılığı yok ama klinik gerçek)
            // GCKL-27 (sayım) hem burada (açılış+ara) hem İNT-4'te (kapanış)
            'INT-3': ['GCKL-27'],
            // İNT-4 Sign-Out (GCKL Phase IV - Kapanış)
            'INT-4': ['GCKL-26','GCKL-27','GCKL-28','GCKL-29','GCKL-30']
        };
        
        // Ters köprü (GCKL → INT)
        const GCKL_TO_INT = (function buildReverseMap() {
            const m = {};
            Object.entries(INT_TO_GCKL).forEach(([intId, gcklIds]) => {
                gcklIds.forEach(g => {
                    if (!m[g]) m[g] = [];
                    m[g].push(intId);
                });
            });
            return m;
        })();
        function getGcklItemsForIntTask(intId) { return INT_TO_GCKL[intId] || []; }
        function getIntTasksForGcklItem(gcklId) { return GCKL_TO_INT[gcklId] || []; }

        function applyIntraopTaskArchitecture(caseObj, phaseObj) {
            if (!caseObj || !phaseObj || !Array.isArray(phaseObj.tasks)) return phaseObj;
            if (phaseObj.__nk132IntraopTaskArchitectureApplied) return phaseObj;

            const oldTasks = phaseObj.tasks || [];
            const used = new Set();
            const take = (keys) => {
                const t = nk132FindTask(oldTasks, keys, used);
                if (t?.id) used.add(t.id);
                return t;
            };
            const prefix = (caseObj.id || 'case') + '_intraop';

            // 4 WHO SSC fazına göre eski görevleri yakala
            // En spesifik anahtarlar önce, çakışma azaltma
            
            // İNT-2 Time-Out önce (en spesifik anahtar)
            const timeoutOld = take([
                'time-out','time out','timeout','ekip tan',
                'antibiyot','profilakt','abx',
                'pozisyon','litotomi','prone','lateral','baskı','bası','ped',
                'steril','asepsi','kontamin','antisepsi','klorheksidin','povidon','drape','örtü'
            ]);
            
            // İNT-4 Sign-Out / kapanış (sayım+spesimen+postop devir)
            const signoutOld = take([
                'kapanış sayım','final sayım','sayım kapanış','closing count',
                'sign-out','sign out','kapanış teyit','postop plan','pacu teyid',
                'spesimen','numune','patoloji','etiket'
            ]);
            
            // İNT-1 Sign-In Devri (preop'tan teslim alma anı)
            const signinOld = take([
                'sign-in','sign in','signin','teslim','devir',
                'kimlik','onam','alerji','kan kayb','kan kaybı',
                'pulse oksimetre','spo2','anestezi güvenlik'
            ]);
            
            // İNT-3 İntraoperatif İzlem (sürekli süreç + açılış sayımı)
            const monitorOld = take([
                'açılış sayım','başlangıç sayım','open count',
                'sayım teyidi','spanç sayım','iğne sayım','alet sayım',
                'ısıt','normoterm','hipoterm','warm','sıcaklık','battaniye',
                'hemodinami','volüm','idrar','aldığı','çıkardığı',
                'hava yolu','entübasyon','ilaç çek','double-check',
                'koter','turnike','ekipman','elektrik','plak'
            ]);

            const safety  = 'Zorunlu Güvenlik Görevleri';
            const monitor = 'İzlem ve Klinik Yönetim';
            const closure = 'Kapanış ve Devir';

            phaseObj.tasks = [
                // ---- İNT-1: Sign-In Devri (GCKL II — anestezi öncesi son kontrol)
                nk132CloneTaskBase(signinOld, prefix + '_signin', 'Sign-In Devri · Preop ekibinden hasta güvenlik bilgilerini teslim al', {
                    critical: true, score: 5, guideline: 'who_ssc', group: safety, cardKey: 'intraop-signin',
                    keywords: ['sign-in','teslim','devir','kimlik','onam','alerji','kan kaybı','anestezi güvenlik','pulse oksimetre','hava yolu'],
                    substeps: [
                        'Hasta kimliği ve cerrahi onam teslim alındı',
                        'Ameliyat bölgesi işaretlemesi doğrulandı',
                        'Anestezi güvenlik kontrolü tamamlandı',
                        'Pulse oksimetre çalışıyor ve okuma alıyor',
                        'Alerji bilgisi (özellikle antibiyotik) teyit edildi',
                        'Kan kaybı/transfüzyon hazırlığı doğrulandı',
                        'Hava yolu/aspirasyon riski değerlendirildi',
                        'Görüntüleme/implant gereksinimi kontrol edildi'
                    ],
                    categories: ['patientSafety','communication','checklistPerformance']
                }),
                
                // ---- İNT-2: Time-Out (GCKL III — insizyon öncesi duraklama)
                nk132CloneTaskBase(timeoutOld, prefix + '_timeout', 'Time-Out · İnsizyon öncesi ekip duraklaması ve cerrahi hazırlık', {
                    critical: true, score: 8, guideline: 'who_ssc', group: safety, cardKey: 'intraop-timeout',
                    keywords: ['time-out','ekip','tanıtım','sözel','antibiyotik','profilaktik','pozisyon','steril','antisepsi','dvt','glisemi','antikoagülan'],
                    substeps: [
                        'Tüm ekip durdu ve dolaşıcı hemşire başlattı',
                        'Ekip üyeleri ad/soyad/rol ile tanıtıldı',
                        'Hasta/işlem/taraf sözel olarak teyit edildi',
                        'Cerrah kritik olayları gözden geçirdi',
                        'Anestezi kritik olayları gözden geçirdi',
                        'Hemşire sterilizasyon ve malzeme teyidini yaptı',
                        'Profilaktik antibiyotik uygulama zamanı doğrulandı (≤60 dk)',
                        'Glisemi/antikoagülan/DVT profilaksisi planlandı',
                        'Cerrahi pozisyon ve baskı bölgeleri korundu',
                        'Cilt antisepsisi uygulandı, kuruma süresi tamamlandı',
                        'Steril alan kuruldu, drape bütünlüğü doğrulandı'
                    ],
                    categories: ['patientSafety','communication','checklistPerformance','surgicalNursingKnowledge']
                }),
                
                // ---- İNT-3: İntraoperatif İzlem (sürekli süreç)
                nk132CloneTaskBase(monitorOld, prefix + '_monitoring', 'İntraoperatif İzlem · Açılış sayımı, normotermi, hemodinami ve ekipman güvenliği', {
                    critical: false, score: 6, guideline: 'aorn', group: monitor, cardKey: 'intraop-monitoring',
                    keywords: ['açılış sayım','spanç','iğne','alet','normotermi','hipotermi','sıcaklık','hemodinami','kanama','idrar','double-check','koter','turnike','plak'],
                    substeps: [
                        'Açılış sayımı yapıldı (alet/spanç/iğne) ve panoya işlendi',
                        'Eklenen materyaller anlık olarak sayıma dahil edildi',
                        'Bazal vücut ısısı ölçüldü, aktif ısıtma uygulandı',
                        'Hipotermi yanıtı tetiklendi (<36°C ise)',
                        'Kan kaybı tahmin edildi ve raporlandı',
                        'Sıvı dengesi ve idrar çıkışı izlendi',
                        'Yüksek-riskli ilaç double-check uygulandı',
                        'Koter plağı yerleşimi ve cilt bütünlüğü kontrol edildi',
                        'Turnike basıncı/süresi izlendi (varsa)',
                        'Steril alan ihlali yönetildi (varsa)',
                        'Ekipman arızası raporlandı (varsa)'
                    ],
                    categories: ['clinicalAssessment','prioritisation','surgicalNursingKnowledge']
                }),
                
                // ---- İNT-4: Sign-Out (GCKL IV — kapanış sözel teyidi)
                nk132CloneTaskBase(signoutOld, prefix + '_signout', 'Sign-Out · Kapanış sayımı, spesimen, ekipman ve postop devir teyidi', {
                    critical: true, score: 8, guideline: 'who_ssc', group: closure, cardKey: 'intraop-signout',
                    keywords: ['sign-out','kapanış sayım','final sayım','spesimen','numune','etiket','ekipman sorun','postop plan','pacu','retained','görüntüleme'],
                    substeps: [
                        'İşlem adı sözel olarak teyit edildi',
                        'Kapanış sayımı yapıldı (alet/spanç/iğne)',
                        'Sayım uyumsuzluğu çözüldü (varsa görüntüleme istendi)',
                        'Spesimen etiketleri ekipçe doğrulandı (hasta/bölge/taraf)',
                        'Ekipman sorunları paylaşıldı',
                        'Postoperatif kritik gereksinimler belirlendi',
                        'PACU/varış noktası teyit edildi',
                        'Cerrah, anestezi ve hemşire ekipçe teyit etti',
                        'Sign-Out kayıt altına alındı'
                    ],
                    categories: ['patientSafety','communication','checklistPerformance']
                })
            ];

            // Eski → yeni id eşleme tablosu (multi-source verification ve eski kod bağlantıları için)
            // 4 yeni karta düşen eski ID'ler:
            phaseObj.__nk132IntraopOldIdMap = {
                signin: signinOld?.id || null,
                timeout: timeoutOld?.id || null,
                monitoring: monitorOld?.id || null,
                signout: signoutOld?.id || null
            };
            // Birleştirme sırasında "yakalanmayan" eski ID'leri de kaydet.
            // Bunlar artık görev kartı olarak görünmüyor ama eski kod
            // (events, reasoning questions) bunlara referans veriyor olabilir.
            // Aşama 2'de evidence redirect için kullanılacak.
            phaseObj.__nk132IntraopOrphanIds = oldTasks
                .filter(t => !used.has(t.id))
                .map(t => t.id);
            // Yetim ID → yeni hangi karta yönlendirilmeli (klinik içerik bazlı tahmin)
            phaseObj.__nk132IntraopOrphanRedirect = {};
            const norm = s => String(s || '').toLocaleLowerCase('tr-TR');
            (phaseObj.__nk132IntraopOrphanIds || []).forEach(orphanId => {
                const orphan = oldTasks.find(t => t.id === orphanId);
                if (!orphan) return;
                const text = norm((orphan.label || '') + ' ' + (orphan.id || ''));
                // Klinik içeriğe göre uygun yeni karta yönlendir
                if (/sign.in|teslim|kimlik|onam|alerji|kan kayb/.test(text)) {
                    phaseObj.__nk132IntraopOrphanRedirect[orphanId] = phaseObj.tasks[0]?.id; // INT-1
                } else if (/time.out|ekip|antibiyot|profilakt|pozisyon|steril|asepsi|antisepsi|drape/.test(text)) {
                    phaseObj.__nk132IntraopOrphanRedirect[orphanId] = phaseObj.tasks[1]?.id; // INT-2
                } else if (/sayım|spanç|iğne|alet|ısıt|sıcaklık|hemodinami|koter|turnike|ekipman|ilaç|hava yolu/.test(text)) {
                    phaseObj.__nk132IntraopOrphanRedirect[orphanId] = phaseObj.tasks[2]?.id; // INT-3
                } else if (/sign.out|kapanış|spesimen|numune|etiket|pacu|postop/.test(text)) {
                    phaseObj.__nk132IntraopOrphanRedirect[orphanId] = phaseObj.tasks[3]?.id; // INT-4
                }
            });

            phaseObj.__nk132IntraopTaskArchitectureApplied = true;
            return phaseObj;
        }

        function augmentCaseData(caseObj) {
            ['preop', 'intraop', 'postop'].forEach(ph => {
                let p = caseObj[ph];
                if (!p) return;
                if (ph === 'preop') applyPreopTaskArchitecture(caseObj, p);
                if (ph === 'intraop') applyIntraopTaskArchitecture(caseObj, p);
                
                // Augment symptoms
                p.correctSymptoms = p.correctSymptoms || [];
                p.symptoms = p.symptoms || [...p.correctSymptoms];
                while (p.symptoms.length < 8) {
                    let rs = GENERIC_SYMPTOMS[Math.floor(Math.random() * GENERIC_SYMPTOMS.length)];
                    if (!p.symptoms.includes(rs)) p.symptoms.push(rs);
                }
                p.symptoms = shuffle(p.symptoms);
                
                // Augment diagnoses
                if (p.diagnoses) {
                    p.diagnoses.forEach(d => {
                        d.relevance = d.relevance || 'correct';
                        d.expectedOutcomes = d.expectedOutcomes || [d.outcome || 'Belirtilmedi'];
                        d.phase = ph;
                    });

                    let targetCount = ph === 'postop' ? 10 : 8;
                    let pool = shuffle(GENERIC_DIAGNOSES);
                    let i = 0;
                    while (p.diagnoses.length < targetCount && i < pool.length) {
                        let gd = JSON.parse(JSON.stringify(pool[i]));
                        gd.id = caseObj.id + '_' + ph + '_g' + i;
                        gd.phase = ph;
                        gd.guidelines = ['nanda'];
                        p.diagnoses.push(gd);
                        i++;
                    }
                    p.diagnoses = shuffle(p.diagnoses);
                }

                // Auto-map task categories based on keywords
                if (p.tasks) {
                    p.tasks.forEach(t => {
                        t.categories = [];
                        let lbl = t.label.toLowerCase();
                        
                        if(t.critical) t.categories.push('patientSafety');
                        
                        // Mapping WHO SSC and Checklist logic
                        if(t.guideline === 'who_ssc' || lbl.includes('kimlik') || lbl.includes('onam') || lbl.includes('sign') || lbl.includes('time-out')) {
                            if (!t.categories.includes('checklistPerformance')) t.categories.push('checklistPerformance');
                            if (!t.categories.includes('patientSafety')) t.categories.push('patientSafety');
                        }
                        
                        if(t.guideline === 'aorn' || lbl.includes('sayım') || lbl.includes('numune')) {
                            if (!t.categories.includes('countingSafety')) t.categories.push('countingSafety');
                            if (!t.categories.includes('surgicalNursingKnowledge')) t.categories.push('surgicalNursingKnowledge');
                        }
                        
                        if(lbl.includes('sbar')) {
                            if (!t.categories.includes('communication')) t.categories.push('communication');
                            if (!t.categories.includes('patientSafety')) t.categories.push('patientSafety');
                        }
                        
                        if(lbl.includes('eğitim')) {
                            if (!t.categories.includes('communication')) t.categories.push('communication');
                            if (!t.categories.includes('patientCentredCare')) t.categories.push('patientCentredCare');
                        }
                        
                        if(t.categories.length === 0) {
                            t.categories.push('clinicalAssessment', 'surgicalNursingKnowledge');
                        }
                    });
                }
            });
            return caseObj;
        }

        function makeFullCase(id, spec, specName, name, age, gender, surgery, shortSurgery, riskTags, identity, history, allergy, vitals, labs, risks, educationContent, preop, intraop, postop) {
            let c = { id, status: 'full', difficulty: 3, estMin: 25, specialty: spec, specialtyLabel: specName, name, age, gender, surgery, shortSurgery, riskTags, identity, history, allergy, vitals, labs, risks, educationContent, preop, intraop, postop };
            return augmentCaseData(c);
        }

        function makeDemoCase(id, spec, specName, name, age, gender, surgery, shortSurgery, riskTags, difficulty) {
            const d = { id, status: 'demo', difficulty, estMin: 8, specialty: spec, specialtyLabel: specName, name, age, gender,
                surgery, shortSurgery, riskTags, identity: { mrn: 'MR-DEMO-' + id, dob: '—', blood: '—' }, history: [
                    'Demo vaka — kısa simülasyon akışı'
                ], allergy: '—', vitals: { bp: '120/78', hr: 80, rr: 16, spo2: 98, temp: 36.6 }, labs: ['—'],
                risks: riskTags, educationContent: { learningObjectives: ['Genel perioperatif güvenlik adımlarını uygulayabilme'],
                    keyConcepts: ['Güvenli cerrahi', 'Aseptik teknik', 'Postop izlem'], guidelineLinks: ['who_ssc', 'who_ssi',
                        'eras'
                    ], safetyPriorities: ['Kimlik', 'Alerji', 'Onam'] },
                preop: buildDemoPhase('preop', id, ['Anksiyete', 'Enfeksiyon Riski', 'Bilgi Eksikliği']),
                intraop: buildDemoPhase('intraop', id, ['SSI Riski', 'Pozisyon Yaralanması Riski', 'Hipotermi Riski']),
                postop: buildDemoPhase('postop', id, ['Akut Ağrı', 'Bulantı-Kusma', 'Erken Mobilizasyon']) };
            return augmentCaseData(d);
        }

        function buildDemoPhase(phase, id, diagNames) {
            const diags = diagNames.map((n, i) => ({ id: id + '_' + phase + '_d' + (i + 1), title: n, priority: i === 0 ? 'high' : i ===
                    1 ? 'medium' : 'low', relevance: 'correct', factors: ['—'], evidence: ['—'], expectedOutcomes: ['—'], interventions: ['—'], rationale: '—',
                    guidelines: ['nanda'] }));
            
            // Integrating Safe Surgery Checklist items into Demo Phase
            let tasks = [];
            if (phase === 'preop') {
                tasks = [
                    { id: id + '_t1', label: '1. Kimlik, ameliyat ve bölge doğrulaması', critical: true, score: 10, guideline: 'who_ssc' },
                    { id: id + '_t2', label: '2. Aydınlatılmış onam (rıza) kontrolü', critical: true, score: 10, guideline: 'who_ssc' },
                    { id: id + '_t3', label: '3. Açlık (NPO) ve tetkik kontrolü', critical: false, score: 6, guideline: 'eras' },
                    { id: id + '_t4', label: '4. Protez, değerli eşya çıkarma ve önlük giydirme', critical: false, score: 8, guideline: 'who_ssc' }
                ];
            } else if (phase === 'intraop') {
                tasks = [
                    { id: id + '_t1', label: 'Sign-in: Alerji ve kan kaybı riski doğrulaması', critical: true, score: 10, guideline: 'who_ssc' },
                    { id: id + '_t2', label: 'Time-out: Ekip tanıtımı, kimlik ve bölge teyidi', critical: true, score: 12, guideline: 'who_ssc' },
                    { id: id + '_t3', label: 'Malzeme sterilizasyonu ve profilaktik antibiyotik', critical: true, score: 10, guideline: 'who_ssc' },
                    { id: id + '_t4', label: 'Sign-out: Alet, spanç ve iğne sayımı teyidi', critical: true, score: 12, guideline: 'aorn' }
                ];
            } else {
                tasks = [
                    { id: id + '_t1', label: 'PACU teslim alma (SBAR formatında)', critical: true, score: 10, guideline: 'who_ssc' },
                    { id: id + '_t2', label: 'Yaşam bulguları ve ağrı izlemi', critical: true, score: 10, guideline: 'padis' },
                    { id: id + '_t3', label: 'Ameliyat sonrası kritik gereksinimlerin gözden geçirilmesi', critical: true, score: 10, guideline: 'who_ssc' }
                ];
            }

            let reasonings = [{ id: id + '_' + phase + '_r1', after: id + '_' + phase + '_t1', kind: 'mcq',
                    question: 'Bu uygulamanın temel gerekçesi nedir?', options: ['Aileyi bilgilendirmek',
                        'Mobilizasyonu hızlandırmak', 'Yanlış hasta riskini önlemek', 'Beslenmeyi düzenlemek'
                    ], correct: 2, guideline: 'who_ssc', rationale: 'WHO SSC güvenlik ilkesidir.' }];

            if (phase === 'intraop') {
                reasonings.push({ id: id + '_' + phase + '_r2', after: id + '_' + phase + '_t4', kind: 'mcq',
                    question: 'Sign-out aşamasında alet/spanç sayımının teyit edilmesinin nedeni nedir?', 
                    options: ['Ameliyatın bittiğini belgelemek', 'Yabancı cisim unutulmasını önlemek', 'Bir sonraki vaka için hazırlık yapmak', 'Maliyet hesabı yapmak'], 
                    correct: 1, guideline: 'aorn', rationale: 'Alet ve spanç sayımı hasta güvenliği için kritiktir, yabancı cisim unutulmasını (gossypiboma) engeller.' });
            }

            return { 
                label: phase === 'preop' ? 'Preoperatif Oda' : phase === 'intraop' ? 'İntraoperatif Alan' : 'Postoperatif Bakım',
                diagnoses: diags, 
                correctDiagnoses: diags.map(d => d.id), 
                tasks: tasks,
                reasoning: reasonings, 
                symptoms: ['Anksiyete', 'Ağrı', 'Enfeksiyon belirtisi'], 
                correctSymptoms: ['Anksiyete', 'Enfeksiyon belirtisi'] 
            };
        }

        const CASES = {
            cabg_main: makeFullCase('cabg_main', 'cardio', 'Kalp ve Damar Cerrahisi', 'Mehmet Yıldız', 67, 'Erkek',
                'Koroner Arter Bypass Greftleme (CABG ×3)', 'CABG ×3', ['Yüksek risk', 'Kardiyak', 'Hipotermi', 'Deliryum'], { mrn: 'MR-7834521',
                    dob: '12.04.1958', blood: 'A Rh(+)' }, ['Hipertansiyon (12 yıl)', 'Tip 2 Diyabet (8 yıl)',
                    'Hiperlipidemi', '40 paket-yıl sigara öyküsü'
                ], 'Penisilin → döküntü', { bp: '148/86', hr: 88, rr: 18, spo2: 96, temp: 36.4 }, ['Hb 12.8 g/dL',
                    'Kreatinin 1.1', 'INR 1.0', 'HbA1c 7.6%', 'EF %48'
                ], ['Kanama riski', 'Hipotermi riski', 'Postop deliryum', 'Solunum yetmezliği', 'Sternal enfeksiyon'], {
                    learningObjectives: ['CABG hastasında preoperatif hasta güvenliği kontrollerini uygulayabilme',
                        'İntraoperatif hipotermi, kanama ve basınç yaralanması risklerini tanımlayabilme',
                        'KPB sürecini beş klinik alt-fazda izleyebilme: KPB öncesi, ACT/heparin/prime, pompa açık, çıkış hazırlığı ve protamin/koagülasyon',
                        'CABG anestezi güvenliğinde kan kaybı, A-line ve TXA doğrulamasını açıklayabilme',
                        'Postoperatif ağrı, solunum, drenaj, koagülopati ve deliryum riskini değerlendirebilme'
                    ], keyConcepts: ['Güvenli cerrahi kontrol listesi', 'KPB alt-faz güvenliği', 'ACT/heparin/prime/protamin doğrulama', 'A-line ve TXA anestezi güvenliği', 'Hipotermi önleme', 'Deliryum riski', 'Kanama ve koagülopati izlemi',
                        'Hasta ve aile eğitimi'
                    ], guidelineLinks: ['who_ssc', 'who_ssi', 'nice_hypo', 'eras', 'padis', 'npiap', 'nanda'],
                    safetyPriorities: ['Kimlik ve cerrahi doğrulama', 'Kanama izlemi', 'Solunum değerlendirmesi', 'Deliryum riski',
                        'Hipotermi önleme', 'KPB ve protamin güvenliği', 'CABG kan kaybı / A-line / TXA planı'
                    ]
                }, {
                    label: 'Preoperatif Oda',
                    diagnoses: [{ id: 'd_anx', title: 'Anksiyete', priority: 'high', relevance: 'correct',
                        factors: ['Cerrahi süreç bilinmezliği', 'Mortalite endişesi'], evidence: ['Hasta gergin, sözel ifade',
                            'BP 148/86, HR 88'
                        ], expectedOutcomes: ['Hasta cerrahi süreci ifade edebilir, anksiyete azalır'],
                        interventions: ['Yapılandırılmış preop eğitim', 'Açık bilgi verme, soru fırsatı', 'Yakın katılımı'],
                        rationale: 'CABG öncesi yüksek anksiyete, postoperatif deliryum ve ağrı algısını artırır.',
                        guidelines: ['eras', 'padis'] }, { id: 'd_know', title: 'Bilgi Eksikliği', priority: 'high', relevance: 'correct',
                        factors: ['Yeni cerrahi süreç', 'Eğitim almamış olma'], evidence: ['Hasta süreci yanlış yorumluyor'],
                        expectedOutcomes: ['Hasta preop dönemi, anestezi sürecini ve postop beklentileri açıklayabilir'],
                        interventions: ['Görsel eğitim materyali', 'Solunum egzersizi öğretimi', 'Erken mobilizasyon planı'],
                        rationale: 'ERAS ilkeleri, preop yapılandırılmış eğitimi öğrenme hedefi olarak tanımlar.',
                        guidelines: ['eras'] }, { id: 'd_inf', title: 'Enfeksiyon Riski', priority: 'medium', relevance: 'correct',
                        factors: ['Cerrahi insizyon', 'Diyabet', 'İmmün durum'], evidence: ['HbA1c 7.6%', 'Yaş 67'],
                        expectedOutcomes: ['Cerrahi alan enfeksiyonu gelişmez'],
                        interventions: ['Antibiyotik profilaksisi zamanlaması', 'Antiseptik banyo', 'Nazal taşıyıcılık değerlendirmesi'],
                        rationale: 'WHO SSI önleme ilkeleri, glisemi kontrolü ve doğru antibiyotik zamanlamasını vurgular.',
                        guidelines: ['who_ssi'] }, ],
                    correctDiagnoses: ['d_anx', 'd_know', 'd_inf'],
                    tasks: [
                        { id: 't_id', label: '1. Kimlik, cerrahi onam ve ameliyat bölgesi doğrulama', critical: true, score: 10, guideline: 'who_ssc' }, 
                        { id: 't_site_mark', label: '2. Cerrahi taraf/bölge işaretini hasta-dosya-ameliyat planı ile doğrulama', critical: true, score: 8, guideline: 'who_ssc' },
                        { id: 't_npo', label: '3. Açlık (NPO) sorgusu ve laboratuvar/tetkik kontrolü', critical: false, score: 6, guideline: 'eras' }, 
                        { id: 't_labs_imaging', label: '4. CABG için EKG, anjiyo/eko, laboratuvar ve görüntüleme sonuçlarının hazır olduğunu doğrulama', critical: true, score: 8, guideline: 'who_ssc' },
                        { id: 't_prep', label: '5. Protez, değerli eşya, makyaj kontrolü ve önlük giydirme', critical: true, score: 8, guideline: 'who_ssc' },
                        { id: 't_blood', label: '6. Özel malzeme, kan hazırlığı, crossmatch ve güvenli tıraş kontrolü', critical: true, score: 10, guideline: 'who_ssc' },
                        { id: 't_temp', label: '7. Bazal vücut ısısı ölçümü ve aktif ısıtma planı', critical: true, score: 8, guideline: 'nice_hypo' }, 
                        { id: 't_edu', label: '8. Solunum egzersizi ve erken mobilizasyon eğitimi', critical: false, score: 6, guideline: 'eras' }
                    ],
                    reasoning: [{ id: 'r_id', after: 't_id', kind: 'mcq',
                        question: 'Hastanın kimlik doğrulamasını yaptınız. Bu uygulama hangi riski azaltmayı hedefler?',
                        options: ['Yanlış hasta / yanlış cerrahi', 'Postoperatif bulantı', 'Düşme riski', 'Uyku bozukluğu'],
                        correct: 0, guideline: 'who_ssc',
                        rationale: 'Kimlik doğrulama, WHO Surgical Safety Checklist\'in temel adımıdır.' }, { id: 'r_allergy',
                        after: 't_prep', kind: 'mcq',
                        question: 'Hasta üzerinde oje, hareketli protez veya takı bırakılmamasının temel nedeni nedir?',
                        options: ['Taburculuğu kolaylaştırmak', 'Oksijen probu okumasını engellememesi ve hava yolu/koter yanığı risklerini önlemek',
                            'Mobilizasyonu hızlandırmak', 'Hastanın konforunu artırmak'
                        ], correct: 1, guideline: 'who_ssc',
                        rationale: 'Oje saturasyon ölçümünü bozar, metal takılar koter yanığına yol açabilir, protez diş entübasyonda hava yolunu tıkayabilir.' },
                        { id: 'r_temp', after: 't_temp', kind: 'mcq',
                            question: 'Preoperatif vücut ısısı ölçümü en çok hangi kılavuz teması ile ilişkilidir?',
                            options: ['PADIS Deliryum', 'ERAS Mobilizasyon', 'NICE Perioperatif Hipotermi',
                                'NPIAP Basınç Yaralanması'
                            ], correct: 2, guideline: 'nice_hypo',
                            rationale: 'NICE perioperatif hipotermi kılavuzu bazal sıcaklık ölçümü ve aktif ısıtma planını önerir.' },
                    ],
                    symptoms: ['Anksiyete', 'Ağrı', 'Alerji öyküsü', 'Hipertansiyon', 'Hiperglisemi'],
                    correctSymptoms: ['Anksiyete', 'Hipertansiyon', 'Hiperglisemi']
                }, {
                    label: 'İntraoperatif Alan / Ameliyathane',
                    diagnoses: [{ id: 'di_hypo', title: 'Hipotermi Riski', priority: 'high', relevance: 'correct', factors: ['Uzun cerrahi süresi',
                            'Açık göğüs', 'Soğuk irigasyon'
                        ], evidence: ['Bazal ısı 36.4°C'], expectedOutcomes: ['İntraop ısı 36°C üzerinde tutulur'],
                        interventions: ['Aktif zorlanmış hava ısıtıcı', 'IV sıvıların ısıtılması', 'Sürekli ısı izlemi'],
                        rationale: 'NICE perioperatif hipotermi kılavuzu intraop ısı hedefini ≥36°C olarak tanımlar.',
                        guidelines: ['nice_hypo'] }, { id: 'di_skin', title: 'Basınç Yaralanması Riski', priority: 'high', relevance: 'correct',
                        factors: ['Uzun süreli pozisyon', 'Düşük perfüzyon'], evidence: ['Sırt üstü pozisyon, >3 saat'],
                        expectedOutcomes: ['Cilt bütünlüğü korunur'],
                        interventions: ['Basınç noktalarına jel ped', 'Pozisyon kontrolü', 'Topuk koruması'],
                        rationale: 'NPIAP, ameliyat masasında uzun süre kalan hastalarda basınç yaralanması riskinin arttığını belirtir.',
                        guidelines: ['npiap'] }, { id: 'di_inf', title: 'Cerrahi Alan Enfeksiyonu Riski', priority: 'high', relevance: 'correct',
                        factors: ['Sternotomi', 'DM', 'Uzun cerrahi'], evidence: ['HbA1c 7.6%'],
                        expectedOutcomes: ['Aseptik teknik sürdürülür, SSI gelişmez'],
                        interventions: ['Steril alan denetimi', 'Antibiyotik profilaksisi zamanlaması',
                            'Hava akımı ve trafik kontrolü'
                        ], rationale: 'WHO SSI önleme ilkeleri ve AORN steril alan ilkeleri esas alınır.',
                        guidelines: ['who_ssi', 'aorn'] }, ],
                    correctDiagnoses: ['di_hypo', 'di_skin', 'di_inf'],
                    tasks: [
                        { id: 'ti_signin', label: 'Sign-in: Hasta kimliği, işlem, bölge, rıza, alerji ve kan kaybı riskini hasta uyanıkken doğrula', critical: true, score: 12, guideline: 'who_ssc' }, 
                        { id: 'ti_pulseox_imaging', label: 'Sign-in: Pulse oksimetre, A-line bazal dalga formu ve gerekli görüntüleme/sonuç görünürlüğünü doğrula', critical: true, score: 8, guideline: 'who_ssc' },
                        { id: 'ti_anes_depth', label: 'CABG anestezi derinlik kontrolü: kan kaybı tahmini, A-line ve TXA planı', critical: true, score: 10, guideline: 'who_ssc' },
                        { id: 'ti_timeout', label: 'Time-out: Ekip tanıtımı, kimlik/işlem/bölge, kritik olaylar ve profilaksi teyidi', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'ti_glucose_anticoag_vte', label: 'Time-out: Glisemi, antikoagülan kullanımı, VTE profilaksisi ve CABG kan yönetimini teyit et', critical: true, score: 8, guideline: 'who_ssc' },
                        { id: 'ti_cpb_pre', label: 'KPB Faz 1: KPB öncesi hazırlık ve ekip hazır oluş teyidi', critical: true, score: 8, guideline: 'who_ssc' },
                        { id: 'ti_cpb_act', label: 'KPB Faz 2: ACT, heparinizasyon ve prime doğrulaması', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'ti_cpb_on', label: 'KPB Faz 3: Pompa açıkken akım, venöz dönüş, oksijenatör ve ısı izlemi', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'ti_cpb_wean', label: 'KPB Faz 4: Çıkış hazırlığı; ısıtma, ritim, ventilasyon ve hemodinami teyidi', critical: true, score: 10, guideline: 'who_ssc' },
                        { id: 'ti_cpb_protamine', label: 'KPB Faz 5: Protamin uygulaması, ACT dönüşü ve koagülasyon kontrolü', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'ti_cellsaver', label: 'Hücre koruyucu: aspirasyon hattı, rezervuar ve geri verme güvenliği', critical: true, score: 8, guideline: 'aorn' },
                        { id: 'ti_steril', label: 'Malzeme sterilizasyon doğrulaması ve profilaktik antibiyotik', critical: true, score: 10, guideline: 'who_ssi' },
                        { id: 'ti_count', label: 'Sign-out: Alet, spanç ve iğne sayımı teyidi', critical: true, score: 10, guideline: 'aorn' },
                        { id: 'ti_numune', label: 'Sign-out: Hastadan alınan numunenin doğru etiketlenmesi', critical: true, score: 10, guideline: 'who_ssc' },
                        { id: 'ti_signout_full', label: 'Sign-out: Yapılan işlem, sayım/numune, ekipman sorunu ve PACU/ICU kritik gereksinimlerini sözel teyit et', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'ti_warm', label: 'Aktif ısıtma sistemi ve basınç noktası koruması', critical: true, score: 10, guideline: 'nice_hypo' },
                        { id: 'ti_temp_trigger', label: 'Sıcaklık tetikleme: T <36°C amber, T <35°C kırmızı eskalasyon', critical: true, score: 8, guideline: 'nice_hypo' }
                    ],
                    events: [{ id: 'ev_temp', trigger: 'ti_warm', title: 'Klinik Olay: Vücut ısısı 35.6°C\'ye düştü — amber tetik',
                        desc: 'Cerrahinin 90. dakikasında özefagial ısı probu 35.6°C ölçtü. Sistem T <36°C eşiğinde ısıtıcıyı amber uyarıya almalıdır.',
                        options: [{ label: 'Cerrahi bitene kadar bekle', correct: false, delta: -6,
                            feedback: 'Güvenli değil. Hipotermi kanama, SSI ve kardiyak komplikasyon riskini artırır.' },
                        { label: 'Aktif ısıtmayı yükselt, IV sıvıları ısıt, anestezistle paylaş; T <35°C olursa kırmızı eskalasyona geç', correct: true,
                            delta: 8, feedback: 'Doğru. T <36°C amber erken yanıt, T <35°C kırmızı kritik eskalasyon gerektirir.' },
                        { label: 'Yalnızca battaniye ekle', correct: false, delta: -3,
                            feedback: 'Pasif örtü tek başına yeterli değildir; aktif ısıtma önerilir.' }] }],
                    reasoning: [{ id: 'ri_warm', after: 'ti_warm', kind: 'mcq',
                        question: 'İntraoperatif aktif ısıtma hangi komplikasyon riskini azaltır?',
                        options: ['Postop bulantı', 'Kanama, SSI ve titreme bağlı oksijen tüketimi', 'Düşme',
                            'Uyku bozukluğu'], correct: 1, guideline: 'nice_hypo',
                        rationale: 'Hipotermi pıhtılaşma bozukluğu, SSI ve titreme ile artmış O₂ tüketimine neden olur.' }, 
                        { id: 'ri_count', after: 'ti_count', kind: 'mcq',
                        question: 'Ameliyat sonunda alet, spanç ve iğne sayımının (Sign-out) teyit edilmesinin temel amacı nedir?',
                        options: ['Ameliyat süresini hesaplamak', 'Hasta içinde yabancı cisim unutulmasını önlemek', 'Maliyet kontrolü sağlamak', 'Sonraki vaka hazırlığını hızlandırmak'], 
                        correct: 1, guideline: 'aorn',
                        rationale: 'AORN ilkelerine göre cerrahi alan kapatılmadan önce yapılan sayım, yabancı cisim unutulma (gossypiboma) riskini ortadan kaldırır.' },
                        { id: 'ri_numune', after: 'ti_numune', kind: 'mcq',
                        question: 'Alınan numunenin ameliyathaneden çıkmadan önce etiketlenmesinin ve teyit edilmesinin nedeni nedir?',
                        options: ['Laboratuvar çalışanlarının iş yükünü azaltmak', 'Hasta kimliği ve materyal karışıklığını önleyerek yanlış teşhisi engellemek', 'Numunenin taşıma sürecini hızlandırmak', 'Ameliyatın bitiş saatini belgelemek'], 
                        correct: 1, guideline: 'who_ssc',
                        rationale: 'WHO Güvenli Cerrahi Kontrol Listesine göre, numunelerin (hasta adı ve içerik) sesli teyidi karışıklıkları ve yanlış teşhisi önler.' },
                        { id: 'ri_anes_depth', after: 'ti_anes_depth', kind: 'mcq',
                        question: 'CABG anestezi güvenliğinde A-line, kan kaybı ve TXA neden birlikte doğrulanır?',
                        options: ['Yalnız monitör ekranını kalabalıklaştırmak için', 'İnvaziv basınç trendi, tahmini kan kaybı, kan ürün hazırlığı ve antifibrinolitik planı aynı hemodinamik güvenlik hattına bağlamak için', 'Steril sayımı kaldırmak için', 'Postop mobilizasyonu hızlandırmak için'],
                        correct: 1, guideline: 'who_ssc',
                        rationale: 'CABG’de kan kaybı, invaziv basınç izlemi ve TXA/kan yönetimi ekipçe doğrulanmalıdır.' },
                        { id: 'ri_cpb_act', after: 'ti_cpb_act', kind: 'mcq',
                        question: 'CABG’de KPB başlatılmadan önce ekipçe özellikle hangi güvenlik bilgisi teyit edilmelidir?',
                        options: ['Yalnız ameliyat masasının yüksekliği', 'ACT/heparinizasyon, prime, kanülasyon ve hava embolisi riski', 'Hastanın taburculuk randevusu', 'Refakatçinin bekleme alanı'],
                        correct: 1, guideline: 'who_ssc',
                        rationale: 'KPB öncesi ACT/heparinizasyon, prime, kanülasyon ve hava embolisi riski ekipçe paylaşılmalıdır.' },
                        { id: 'ri_cpb_on', after: 'ti_cpb_on', kind: 'mcq',
                        question: 'Pompa açıkken hemşirelik açısından ekip iletişiminde hangi bilgi birlikte izlenmelidir?',
                        options: ['Yalnız ameliyat süresi', 'Pompa akımı, venöz dönüş, oksijenatör/rezervuar seviyesi, hasta ısısı ve perfüzyon trendleri', 'Yalnız cerrahın alet tercihi', 'Yalnız oda sıcaklığı'],
                        correct: 1, guideline: 'who_ssc',
                        rationale: 'Pompa açık fazı tek cihaz izleminden ibaret değildir; perfüzyonist, anestezi ve cerrahi ekip kapalı döngü iletişim kurmalıdır.' },
                        { id: 'ri_protamine', after: 'ti_cpb_protamine', kind: 'mcq',
                        question: 'KPB çıkışı sonrası protamin uygulamasında hangi güvenlik kontrolü önceliklidir?',
                        options: ['Yalnız pansuman malzemesi sayısı', 'ACT dönüşü, protamin reaksiyonu, yaygın sızıntı kanaması ve koagülasyon sonuçları', 'Yalnız hasta yakınının bilgilendirilmesi', 'Yalnız dren torbasının rengi'],
                        correct: 1, guideline: 'who_ssc',
                        rationale: 'Protamin sonrası ACT dönüşü ve koagülopati erken değerlendirilmezse postop kanama gecikmeli fark edilir.' },
                        { id: 'ri_cellsaver', after: 'ti_cellsaver', kind: 'mcq',
                        question: 'Hücre koruyucu cihazı CABG sırasında hangi güvenlik amacıyla izlenir?',
                        options: ['Oda ışığını artırmak', 'Kan kaybını yönetmek, aspirasyon/antikoagülasyon hattını izlemek ve uygun geri verme sürecini desteklemek', 'Steril sayımı gereksiz kılmak', 'Drenaj takibini ortadan kaldırmak'],
                        correct: 1, guideline: 'aorn',
                        rationale: 'Cell saver kan yönetimine katkı sağlar; ancak aspirasyon, rezervuar, antikoagülasyon ve geri verme güvenliği izlenmelidir.' },
                        { id: 'ri_temp_trigger', after: 'ti_temp_trigger', kind: 'mcq',
                        question: 'CABG sırasında sıcaklık 35.8°C olduğunda sistem hangi güvenlik düzeyine geçmelidir?',
                        options: ['Normal yeşil izlem', 'Amber: aktif ısıtmayı artır, ısıtılmış sıvı/kan hattını doğrula ve anesteziyle kapalı döngü iletişim kur', 'Kırmızı: ameliyatı hemen iptal et', 'Herhangi bir işlem gerekmez'],
                        correct: 1, guideline: 'nice_hypo',
                        rationale: 'T <36°C amber erken müdahale eşiğidir; T <35°C kırmızı kritik eskalasyon olarak yönetilir.' },
                        { id: 'ri_fire_smoke', after: 'ti_timeout', kind: 'mcq',
                        question: 'Koter kullanılmadan önce hangi cihaz güvenliği birlikte kontrol edilmelidir?',
                        options: ['ESU hasta plakası, prep kuruluğu, oksijen riski ve duman tahliye hattı', 'Yalnız odanın ışık şiddeti', 'Yalnız cerrahın tercih ettiği müzik', 'Yalnız numune kabı sayısı'],
                        correct: 0, guideline: 'who_ssc',
                        rationale: 'Cerrahi yangın ve duman maruziyeti ESU, oksijen/prep ve smoke evacuation hattının birlikte yönetilmesini gerektirir.' }
                    ],
                    symptoms: ['Hipotermi', 'Taşikardi', 'Steril alan ihlali', 'Basınç noktalarında risk', 'Sayım uyuşmazlığı', 'KPB güvenlik doğrulaması eksik', 'Protamin/koagülasyon riski', 'A-line/TXA/kan kaybı planı eksik'],
                    correctSymptoms: ['Hipotermi', 'Basınç noktalarında risk', 'Sayım uyuşmazlığı', 'KPB güvenlik doğrulaması eksik', 'Protamin/koagülasyon riski', 'A-line/TXA/kan kaybı planı eksik']
                }, {
                    label: 'Postoperatif Bakım / PACU',
                    diagnoses: [{ id: 'dp_pain', title: 'Akut Ağrı', priority: 'high', relevance: 'correct', factors: ['Sternotomi insizyonu',
                            'Göğüs tüpü'
                        ], evidence: ['NRS 7/10', 'Yüzeyel solunum'], expectedOutcomes: ['NRS ≤4 düzeyine iner'],
                        interventions: ['Multimodal analjezi', 'Pozisyonla destek', 'Solunum egzersizi koordinasyonu'],
                        rationale: 'PADIS ilkeleri ağrı kontrolünü deliryum ve mobilizasyonun ön koşulu olarak tanımlar.',
                        guidelines: ['padis', 'eras'] }, { id: 'dp_resp', title: 'Bozulmuş Gaz Değişimi', priority: 'high', relevance: 'correct',
                        factors: ['Genel anestezi', 'Sternotomi', 'Sigara öyküsü'], evidence: ['SpO₂ %92', 'RR 22'],
                        expectedOutcomes: ['SpO₂ ≥%94 ve düzenli solunum'], interventions: ['O₂ desteği', 'Spirometri',
                            'Pozisyon değişimi'], rationale: 'Erken postop hipoksi en sık komplikasyondur.',
                        guidelines: ['eras', 'nanda'] }, { id: 'dp_del', title: 'Akut Konfüzyon (Deliryum) Riski',
                        priority: 'high', relevance: 'correct', factors: ['Yaş', 'Kardiyak cerrahi', 'Yoğun bakım ortamı'],
                        evidence: ['CAM-ICU pozitif olabilir'], expectedOutcomes: ['Bilinç ve dikkat normal sürdürülür'],
                        interventions: ['Oryantasyon', 'Uyku-uyanıklık döngüsü', 'Ağrı kontrolü', 'Aile katılımı'],
                        rationale: 'PADIS, kardiyak cerrahi sonrası deliryum riskinin yüksek olduğunu belirtir.',
                        guidelines: ['padis'] }, { id: 'dp_bleed', title: 'Kanama / Koagülopati Riski',
                        priority: 'high', relevance: 'correct', factors: ['KPB sonrası heparin-protamin dengesi', 'Göğüs tüpü drenajı', 'Hipotermi'],
                        evidence: ['Drenaj artışı gelişebilir', 'KPB sonrası koagülasyon değişkenliği'], expectedOutcomes: ['Drenaj, hemodinami ve koagülasyon erken stabilize edilir'],
                        interventions: ['Saatlik drenaj izlemi', 'Hb/koagülasyon/ACT değerlendirmesi', 'SBAR ile cerrahi-anestezi ekibine eskalasyon'],
                        rationale: 'CABG sonrası kanama yalnız dren miktarı değil, koagülopati ve protamin/ACT dönüşüyle birlikte değerlendirilmelidir.',
                        guidelines: ['nanda', 'who_ssc'] }, ],
                    correctDiagnoses: ['dp_pain', 'dp_resp', 'dp_del', 'dp_bleed'],
                    tasks: [
                        { id: 'tp_handover', label: 'Ameliyat sonrası kritik gereksinimlerin ve gideceği bölümün teyidi (SBAR)', critical: true, score: 10, guideline: 'who_ssc' }, 
                        { id: 'tp_vitals', label: 'Yaşam bulguları ve SpO₂ izlemi', critical: true, score: 8, guideline: 'eras' }, 
                        { id: 'tp_pain', label: 'Ağrı değerlendirmesi (NRS) ve müdahale', critical: true, score: 10, guideline: 'padis' }, 
                        { id: 'tp_drain', label: 'Göğüs tüpü drenaj miktarı ve karakteri izlemi', critical: true, score: 10, guideline: 'nanda' }, 
                        { id: 'tp_bleed_escalation', label: 'Postop kanama/koagülopati eskalasyonu: drenaj + hemodinami + Hb/ACT/koagülasyon', critical: true, score: 12, guideline: 'nanda' },
                        { id: 'tp_delirium', label: 'Deliryum tarama (CAM-ICU)', critical: false, score: 8, guideline: 'padis' }
                    ],
                    events: [{ id: 'ev_drain', trigger: 'tp_drain', title: 'Klinik Olay: Drenaj 220 mL/saat',
                        desc: 'Postoperatif 2. saatte göğüs tüpü drenajı 220 mL/saat ölçüldü, BP 92/58 mmHg.',
                        options: [{ label: 'Cerrahi ekibi bilgilendir, Hb/koagülasyon iste, sıvı resüsitasyonu', correct: true,
                            delta: 10, feedback: 'Doğru. Aşırı drenaj reoperasyon endikasyonu olabilir.' }, { label: 'Drenaj torbasını boşalt ve takibi sürdür',
                            correct: false, delta: -6, feedback: 'Yetersiz. Hemodinamik bozulma erken müdahale gerektirir.' },
                        { label: 'Hasta ağrısı için ek opioid uygula', correct: false, delta: -8,
                            feedback: 'Tehlikeli. Hipotansif hastada opioid hipotansiyonu derinleştirir.' }] },
                        { id: 'ev_coagulopathy', trigger: 'tp_bleed_escalation', title: 'Klinik Olay: Kanama + koagülopati şüphesi',
                        desc: 'Drenaj 220 mL/saat, BP 92/58 mmHg, hasta soğuk ve taşikardik. KPB sonrası koagülopati/protamin etkisi düşünülmeli.',
                        options: [{ label: 'SBAR ile cerrahi ve anestezi ekibini çağır; Hb, ACT, PT/aPTT, fibrinojen/trombosit ve ısıyı birlikte değerlendir', correct: true,
                            delta: 12, feedback: 'Doğru. CABG sonrası kanama eskalasyonu drenaj, hemodinami, ısı ve koagülasyon verilerini birlikte gerektirir.' },
                        { label: 'Yalnız dren torbasını boşaltıp bir saat sonra tekrar bak', correct: false, delta: -8,
                            feedback: 'Gecikme riski yüksek. Hemodinamik bozulma varken aktif eskalasyon gerekir.' },
                        { label: 'Hasta ağrılı görünüyor diye öncelikle opioid dozu artır', correct: false, delta: -8,
                            feedback: 'Bu yaklaşım hipotansiyonu derinleştirir ve kanama/koagülopatiyi geciktirir.' }] }],
                    reasoning: [{ id: 'rp_pain', after: 'tp_pain', kind: 'mcq',
                        question: 'Kardiyak cerrahi sonrası ağrı kontrolü neden önceliklidir?',
                        options: ['Solunum, mobilizasyon ve deliryum riskini etkiler', 'Yalnızca konfor sağlar',
                            'Drenajı azaltır', 'Sıvı dengesini düzeltir'], correct: 0, guideline: 'padis',
                        rationale: 'Kontrolsüz ağrı yüzeyel solunuma, hareketsizliğe ve deliryum riskinin artmasına yol açar.' },
                        { id: 'rp_bleed_coag', after: 'tp_bleed_escalation', kind: 'mcq',
                        question: 'CABG sonrası drenaj artışı ve hipotansiyonda hangi veri seti birlikte eskale edilmelidir?',
                        options: ['Yalnız drenaj torbası hacmi', 'Drenaj miktarı/rengi, vital bulgular, Hb, ACT, PT/aPTT, fibrinojen/trombosit, vücut ısısı ve protamin bilgisi', 'Yalnız ağrı skoru', 'Yalnız mobilizasyon toleransı'],
                        correct: 1, guideline: 'nanda',
                        rationale: 'CABG sonrası kanama değerlendirmesi drenajla sınırlı değildir; KPB/protamin sonrası koagülopati ve hipotermiyle birlikte eskale edilmelidir.' }, ],
                    symptoms: ['Şiddetli ağrı', 'SpO₂ düşüklüğü', 'Konfüzyon', 'Drenaj artışı', 'Deliryum riski'],
                    correctSymptoms: ['Şiddetli ağrı', 'SpO₂ düşüklüğü', 'Deliryum riski', 'Drenaj artışı']
                }),
            ortho_main: makeFullCase('ortho_main', 'ortho', 'Ortopedi ve Travmatoloji', 'Ayşe Demir', 42, 'Kadın',
                'Tibia Açık Kırığı – Eksternal Fiksatör', 'Eksternal Fiksatör', ['Travma', 'Enfeksiyon', 'Pin bakımı'], { mrn: 'MR-9921044',
                    dob: '05.07.1983', blood: '0 Rh(+)' }, ['Trafik kazası (bugün)', 'Kronik hastalık yok'],
                'Bilinen alerji yok', { bp: '128/76', hr: 96, rr: 18, spo2: 98, temp: 36.8 }, ['Hb 11.4', 'Kreatinin 0.8',
                    'INR 1.0', 'CRP 18'
                ], ['Enfeksiyon riski', 'Nörovasküler hasar', 'Akut ağrı', 'Yağ embolisi'], { learningObjectives: [
                    'Açık kırıkta enfeksiyon önleme ilkelerini uygulayabilme', 'Pin bakımı ve nörovasküler izlem yapabilme',
                    'Postop ağrı yönetimini planlayabilme'], keyConcepts: ['Açık yara yönetimi', 'Pin bakımı',
                    'Nörovasküler izlem', 'Tetanoz profilaksisi'], guidelineLinks: ['who_ssc', 'who_ssi', 'eras', 'padis',
                    'nanda'], safetyPriorities: ['Yara temizliği', 'Nörovasküler izlem', 'Ağrı kontrolü',
                    'Enfeksiyon önleme'] }, {
                    label: 'Preoperatif Oda',
                    diagnoses: [{ id: 'od_pain', title: 'Akut Ağrı', priority: 'high', relevance: 'correct', factors: ['Açık kırık', 'Hareket'],
                        evidence: ['NRS 8/10'], expectedOutcomes: ['NRS ≤4'], interventions: ['Multimodal analjezi', 'İmmobilizasyon'],
                        rationale: 'Açık kırıkta ağrı yoğundur.', guidelines: ['padis'] }, { id: 'od_inf',
                        title: 'Enfeksiyon Riski', priority: 'high', relevance: 'correct', factors: ['Açık yara', 'Çevre kontaminasyonu'],
                        evidence: ['CRP 18'], expectedOutcomes: ['Yara enfeksiyonu gelişmez'],
                        interventions: ['Sterilita', 'Antibiyotik profilaksisi', 'Tetanoz'],
                        rationale: 'WHO SSI ilkeleri açık kırıkta erken müdahaleyi vurgular.', guidelines: ['who_ssi'] }, {
                        id: 'od_nv', title: 'Nörovasküler Bozulma Riski', priority: 'high', relevance: 'correct', factors: ['Travma', 'Şişlik'],
                        evidence: ['Distal nabız zayıf'], expectedOutcomes: ['Distal nabız ve duyu korunur'],
                        interventions: ['NV izlem her 1 saat', 'Yükseltme'],
                        rationale: 'Kompartman sendromu erken tanı gerektirir.', guidelines: ['nanda'] }, ],
                    correctDiagnoses: ['od_pain', 'od_inf', 'od_nv'],
                    tasks: [
                        { id: 'oti_id', label: '1. Kimlik, cerrahi onam ve ameliyat bölgesi doğrulama', critical: true, score: 10, guideline: 'who_ssc' }, 
                        { id: 'oti_tet', label: '2. Tetanoz sorgusu ve malzeme/implant hazırlığı kontrolü', critical: true, score: 8, guideline: 'who_ssi' }, 
                        { id: 'oti_nv', label: '3. Nörovasküler değerlendirme (5P)', critical: true, score: 10, guideline: 'nanda' }, 
                        { id: 'oti_prep', label: '4. Protez, değerli eşya çıkarma ve önlük giydirme', critical: true, score: 8, guideline: 'who_ssc' }
                    ],
                    reasoning: [{ id: 'oR_nv', after: 'oti_nv', kind: 'mcq',
                        question: '5P değerlendirmesi en çok hangi komplikasyon riski içindir?',
                        options: ['Kompartman sendromu', 'Hipotermi', 'Deliryum', 'SSI'], correct: 0, guideline: 'nanda',
                        rationale: '5P (pain, pallor, pulselessness, paresthesia, paralysis) kompartman sendromunu izler.' }, ],
                    symptoms: ['Anksiyete', 'Ağrı', 'Enfeksiyon belirtisi', 'Solunum sıkıntısı', 'Hipertansiyon'],
                    correctSymptoms: ['Ağrı', 'Enfeksiyon belirtisi', 'Anksiyete']
                }, {
                    label: 'İntraoperatif Alan / Ameliyathane',
                    diagnoses: [{ id: 'oi_inf', title: 'Cerrahi Alan Enfeksiyonu Riski', priority: 'high', relevance: 'correct', factors: [
                            'Açık yara'], evidence: ['Yara kontaminasyonu'], expectedOutcomes: ['Aseptik teknik sürdürülür'],
                        interventions: ['Sterilita', 'İrigasyon', 'Antibiyotik'], rationale: 'WHO SSI ilkeleri.',
                        guidelines: ['who_ssi'] }, { id: 'oi_pos', title: 'Pozisyona Bağlı Yaralanma Riski',
                        priority: 'medium', relevance: 'correct', factors: ['Sırt üstü', 'Bacak çekiş'], evidence: ['Çekiş masası'],
                        expectedOutcomes: ['NV bütünlük korunur'], interventions: ['Pad', 'NV kontrol'],
                        rationale: 'AORN pozisyonlama ilkeleri.', guidelines: ['aorn', 'npiap'] }, { id: 'oi_count',
                        title: 'Yabancı Cisim Riski', priority: 'medium', relevance: 'correct', factors: ['Çoklu alet'],
                        evidence: ['Vidalar, fiksatör'], expectedOutcomes: ['Sayım eksiksiz'], interventions: ['Sayım protokolü'],
                        rationale: 'AORN sayım güvenliği.', guidelines: ['aorn'] }, ],
                    correctDiagnoses: ['oi_inf', 'oi_pos', 'oi_count'],
                    tasks: [
                        { id: 'oti2_to', label: 'Time-out: Ekip tanıtımı ve cerrahi alan teyidi', critical: true, score: 10, guideline: 'who_ssc' }, 
                        { id: 'oti2_pos', label: 'Pozisyonlama ve profilaktik antibiyotik kontrolü', critical: true, score: 8, guideline: 'aorn' }, 
                        { id: 'oti2_irr', label: 'Malzeme sterilizasyon doğrulaması ve yara irigasyonu', critical: true, score: 10, guideline: 'who_ssi' }, 
                        { id: 'oti2_count', label: 'Sign-out: Vida, alet ve spanç sayımı teyidi', critical: true, score: 10, guideline: 'aorn' }
                    ],
                    events: [{ id: 'ev_count', trigger: 'oti2_count', title: 'Sayım Uyuşmazlığı',
                        desc: 'Kapatma öncesi spanç sayımı 1 eksik. Ne yaparsınız?',
                        options: [{ label: 'Cerrahi ekibi bilgilendir, alanı yeniden kontrol et, sayımı tekrarla',
                            correct: true, delta: 10, feedback: 'Doğru. Eksik spanç hasta güvenliği için kritik risktir.' },
                        { label: 'Sayımı tamamlandı olarak işaretle', correct: false, delta: -8,
                            feedback: 'Güvenli değil. Unutulmuş cerrahi malzeme asla olmamalıdır.' }, { label: 'Sadece dosyaya not düş',
                            correct: false, delta: -4, feedback: 'Pasif dokümantasyon yetersizdir, aktif arama şarttır.' }] }],
                    reasoning: [{ id: 'oR2_count', after: 'oti2_count', kind: 'mcq',
                        question: 'Sayım güvenliği kim tarafından doğrulanır?',
                        options: ['Dolaşıcı + scrub hemşire çift kontrol', 'Yalnızca cerrah', 'Yalnızca anestezist',
                            'Hasta yakını'], correct: 0, guideline: 'aorn',
                        rationale: 'AORN çift hemşire sayım doğrulamasını önerir.' }, ],
                    symptoms: ['Hipotermi', 'Steril alan ihlali', 'Kanama bulgusu', 'Sayım uyuşmazlığı', 'Pozisyon ilişkili risk'],
                    correctSymptoms: ['Steril alan ihlali', 'Sayım uyuşmazlığı', 'Pozisyon ilişkili risk']
                }, {
                    label: 'Postoperatif Bakım',
                    diagnoses: [{ id: 'op_pin', title: 'Pin Yeri Enfeksiyonu Riski', priority: 'high', relevance: 'correct', factors: [
                            'Pin giriş yerleri'], evidence: ['4 pin yeri'], expectedOutcomes: ['Pin yerleri temiz kalır'],
                        interventions: ['Pin bakımı', 'Aseptik pansuman', 'Eğitim'],
                        rationale: 'WHO SSI ve hasta eğitimi.', guidelines: ['who_ssi', 'eras'] }, { id: 'op_pain',
                        title: 'Akut Ağrı', priority: 'high', relevance: 'correct', factors: ['Travma', 'Cerrahi'], evidence: ['NRS 6/10'],
                        expectedOutcomes: ['NRS ≤4'], interventions: ['Multimodal analjezi'], rationale: 'PADIS ilkeleri.',
                        guidelines: ['padis'] }, { id: 'op_nv', title: 'Nörovasküler Bozulma Riski', priority: 'high', relevance: 'correct',
                        factors: ['Şişlik', 'Fiksatör'], evidence: ['Distal duyu izlemi'], expectedOutcomes: ['NV bütünlük korunur'],
                        interventions: ['Saatlik NV izlem'], rationale: 'Postop kompartman sendromu izlemi.',
                        guidelines: ['nanda'] }, ],
                    correctDiagnoses: ['op_pin', 'op_pain', 'op_nv'],
                    tasks: [
                        { id: 'otp_handover', label: 'Kritik gereksinimlerin ve gideceği bölümün teyidi (SBAR)', critical: true, score: 8, guideline: 'who_ssc' }, 
                        { id: 'otp_pin', label: 'Pin bakımı uygulama ve eğitim', critical: true, score: 10, guideline: 'who_ssi' }, 
                        { id: 'otp_nv', label: 'NV değerlendirme (saatlik)', critical: true, score: 10, guideline: 'nanda' }, 
                        { id: 'otp_pain', label: 'Ağrı izlemi ve analjezi', critical: true, score: 8, guideline: 'padis' }
                    ],
                    reasoning: [{ id: 'oR3_pin', after: 'otp_pin', kind: 'mcq',
                        question: 'Pin bakımının temel hedefi?', options: ['Pin yeri enfeksiyonunu önlemek',
                            'Ağrıyı artırmak', 'Mobilizasyonu kısıtlamak', 'Drenajı artırmak'], correct: 0,
                        guideline: 'who_ssi', rationale: 'Pin yeri enfeksiyonu osteomyelite ilerleyebilir.' }, ],
                    symptoms: ['Şiddetli ağrı', 'Drenaj artışı', 'Mobilizasyon güçlüğü', 'Düşme riski', 'Yara yeri enfeksiyonu riski'],
                    correctSymptoms: ['Şiddetli ağrı', 'Mobilizasyon güçlüğü', 'Yara yeri enfeksiyonu riski']
                }),
            lap_main: makeFullCase('lap_main', 'general', 'Genel Cerrahi', 'Fatma Kaya', 51, 'Kadın',
                'Laparoskopik Kolesistektomi', 'Lap. Kolesistektomi', ['Düşük-orta risk', 'PONV', 'ERAS uygun'], { mrn: 'MR-3344120',
                    dob: '18.11.1974', blood: 'B Rh(+)' }, ['Safra taşı (3 yıl)', 'Hipotiroidi'], 'Sülfonamid → kaşıntı',
                { bp: '124/78', hr: 78, rr: 16, spo2: 98, temp: 36.6 }, ['Hb 13.1', 'Kreatinin 0.8', 'ALT 28', 'TSH 1.8'],
                ['Bulantı-kusma', 'Omuz ağrısı', 'Safra kaçağı', 'Yara enfeksiyonu'], { learningObjectives: [
                    'ERAS prensiplerine uygun preop eğitim', 'Postop bulantı-kusma yönetimi',
                    'Erken mobilizasyon ve taburculuk eğitimi'], keyConcepts: ['ERAS', 'PONV', 'Erken mobilizasyon',
                    'Hasta eğitimi'], guidelineLinks: ['who_ssc', 'who_ssi', 'eras', 'padis', 'nanda'],
                safetyPriorities: ['Kimlik/onam', 'Alerji', 'PONV önleme', 'Mobilizasyon'] }, {
                    label: 'Preoperatif Oda',
                    diagnoses: [{ id: 'lp_anx', title: 'Anksiyete', priority: 'medium', relevance: 'correct', factors: ['Cerrahi süreç'],
                        evidence: ['Hasta gergin'], expectedOutcomes: ['Anksiyete azalır'],
                        interventions: ['Eğitim', 'Aile katılımı'], rationale: 'ERAS preop eğitimi.',
                        guidelines: ['eras'] }, { id: 'lp_know', title: 'Bilgi Eksikliği', priority: 'high', relevance: 'correct',
                        factors: ['Yeni süreç'], evidence: ['Soruları var'], expectedOutcomes: ['Süreci açıklar'],
                        interventions: ['Yapılandırılmış eğitim'], rationale: 'ERAS eğitim ilkeleri.',
                        guidelines: ['eras'] }, { id: 'lp_ponv', title: 'Bulantı-Kusma Riski', priority: 'high', relevance: 'correct',
                        factors: ['Kadın', 'Anestezi', 'Lap. cerrahi'], evidence: ['PONV risk skoru yüksek'],
                        expectedOutcomes: ['PONV önlenir'], interventions: ['Profilaktik antiemetik', 'Hidrasyon'],
                        rationale: 'ERAS PONV profilaksisi önerir.', guidelines: ['eras'] }, ],
                    correctDiagnoses: ['lp_know', 'lp_ponv', 'lp_anx'],
                    tasks: [
                        { id: 'ltp_id', label: '1. Kimlik, onam ve ameliyat bölgesi doğrulama', critical: true, score: 10, guideline: 'who_ssc' }, 
                        { id: 'ltp_allergy', label: '2. Alerji doğrulaması (Sülfonamid)', critical: true, score: 8, guideline: 'who_ssc' }, 
                        { id: 'ltp_prep', label: '3. Protez/oje kontrolü ve önlük giydirilmesi', critical: true, score: 8, guideline: 'who_ssc' },
                        { id: 'ltp_edu', label: '4. ERAS eğitimi (mobilizasyon, beslenme, ağrı)', critical: false, score: 8, guideline: 'eras' }
                    ],
                    reasoning: [{ id: 'lR_allergy', after: 'ltp_allergy', kind: 'mcq',
                        question: 'Sülfonamid alerjisi neden anestezi ekibiyle paylaşılır?',
                        options: ['Antibiyotik seçimi etkilenir', 'Mobilizasyon hızlanır', 'Drenaj azalır',
                            'Uyku düzenlenir'], correct: 0, guideline: 'who_ssc',
                        rationale: 'Antibiyotik profilaksisi seçiminde kritiktir.' }, ],
                    symptoms: ['Anksiyete', 'Ağrı', 'Bulantı', 'Alerji öyküsü', 'Dehidratasyon riski'],
                    correctSymptoms: ['Anksiyete', 'Bulantı', 'Alerji öyküsü']
                }, {
                    label: 'İntraoperatif Alan',
                    diagnoses: [{ id: 'li_inf', title: 'SSI Riski', priority: 'medium', relevance: 'correct', factors: ['İnsizyon'],
                        evidence: ['Steril alan'], expectedOutcomes: ['Aseptik korunur'], interventions: ['Antibiyotik', 'Aseptik teknik'],
                        rationale: 'WHO SSI.', guidelines: ['who_ssi'] }, { id: 'li_temp', title: 'Hipotermi Riski',
                        priority: 'medium', relevance: 'correct', factors: ['CO₂ insuflasyon'], evidence: ['Bazal 36.6'], expectedOutcomes: ['Isı ≥36°C'],
                        interventions: ['Aktif ısıtma'], rationale: 'NICE.', guidelines: ['nice_hypo'] }, { id: 'li_count',
                        title: 'Yabancı Cisim Riski', priority: 'low', relevance: 'correct', factors: ['Trokar, klips'],
                        evidence: ['Çoklu malzeme'], expectedOutcomes: ['Sayım eksiksiz'], interventions: ['Sayım protokolü'],
                        rationale: 'AORN.', guidelines: ['aorn'] }, ],
                    correctDiagnoses: ['li_inf', 'li_temp', 'li_count'],
                    tasks: [
                        { id: 'lti_signin', label: 'Sign-in: Alerji ve anestezi riskleri', critical: true, score: 10, guideline: 'who_ssc' },
                        { id: 'lti_to', label: 'Time-out: Ekip tanıtımı, bölge teyidi ve profilaksi', critical: true, score: 10, guideline: 'who_ssc' }, 
                        { id: 'lti_steril', label: 'Aseptik teknik ve malzeme sterilizasyonu', critical: true, score: 10, guideline: 'who_ssi' }, 
                        { id: 'lti_count', label: 'Sign-out: Sayım ve numune etiketleme teyidi', critical: true, score: 10, guideline: 'who_ssc' }
                    ],
                    reasoning: [{ id: 'lR2_warm', after: 'lti_signin', kind: 'mcq',
                        question: 'Lap. cerrahide hipotermi nedeni nedir?',
                        options: ['Aktif ısıtma', 'Steril örtü', 'Soğuk CO₂ insuflasyonu ve uzun süre', 'Hasta hareketi'], 
                        correct: 2, guideline: 'nice_hypo', rationale: 'Soğuk CO₂ vücut ısısını düşürebilir.' }, 
                        { id: 'lR2_count', after: 'lti_count', kind: 'mcq',
                        question: 'Sign-out aşamasında numune etiketlemesi ve malzeme sayımının yapılmasının birincil amacı nedir?',
                        options: ['Maliyetleri düşürmek', 'Cerrahi süreyi kısaltmak', 'Yabancı cisim unutulmasını ve patolojik teşhis hatalarını önlemek', 'Ameliyathane temizliğini başlatmak'], 
                        correct: 2, guideline: 'who_ssc', rationale: 'Sayım yabancı cismi, etiketleme ise yanlış tanıyı önler.' }
                    ],
                    symptoms: ['Hipotermi', 'Steril alan ihlali', 'Sayım uyuşmazlığı', 'Taşikardi', 'Hipotansiyon'],
                    correctSymptoms: ['Hipotermi', 'Steril alan ihlali', 'Sayım uyuşmazlığı']
                }, {
                    label: 'Postoperatif Bakım',
                    diagnoses: [{ id: 'lpp_ponv', title: 'Bulantı-Kusma', priority: 'high', relevance: 'correct', factors: ['Lap. anestezi', 'Kadın'],
                        evidence: ['Hasta bulantı tariflemiş'], expectedOutcomes: ['PONV kontrol altına alınır'],
                        interventions: ['Antiemetik', 'Hidrasyon'], rationale: 'ERAS PONV.', guidelines: ['eras'] }, {
                        id: 'lpp_pain', title: 'Akut Ağrı', priority: 'high', relevance: 'correct', factors: ['İnsizyon', 'Omuz refer ağrısı'],
                        evidence: ['NRS 5/10'], expectedOutcomes: ['NRS ≤3'], interventions: ['Multimodal analjezi'],
                        rationale: 'PADIS.', guidelines: ['padis', 'eras'] }, { id: 'lpp_mob',
                        title: 'Bozulmuş Mobilite', priority: 'medium', relevance: 'correct', factors: ['Anestezi sonrası'],
                        evidence: ['Hasta yatakta'], expectedOutcomes: ['Erken mobilizasyon'], interventions: ['Yardımlı yürütme'],
                        rationale: 'ERAS.', guidelines: ['eras'] }, ],
                    correctDiagnoses: ['lpp_ponv', 'lpp_pain', 'lpp_mob'],
                    tasks: [
                        { id: 'ltp2_h', label: 'Kritik gereksinimlerin ve PACU teslimi (SBAR)', critical: true, score: 8, guideline: 'who_ssc' }, 
                        { id: 'ltp2_ponv', label: 'PONV değerlendirme ve antiemetik', critical: true, score: 10, guideline: 'eras' }, 
                        { id: 'ltp2_pain', label: 'Ağrı izlemi ve müdahale', critical: true, score: 8, guideline: 'padis' }, 
                        { id: 'ltp2_mob', label: 'Erken mobilizasyon', critical: false, score: 6, guideline: 'eras' }
                    ],
                    reasoning: [{ id: 'lR3_ponv', after: 'ltp2_ponv', kind: 'mcq',
                        question: 'Bu hastada PONV riski neden yüksek?',
                        options: ['Kadın, lap. cerrahi, anestezi', 'Yalnızca yaş', 'Yalnızca cerrahi süresi',
                            'Yalnızca açlık'], correct: 0, guideline: 'eras',
                        rationale: 'Apfel skorunda kadın cinsiyet, lap. cerrahi PONV riskini artırır.' }, ],
                    symptoms: ['Bulantı-kusma', 'Şiddetli ağrı', 'Mobilizasyon güçlüğü', 'Kanama', 'Hipotermi'],
                    correctSymptoms: ['Bulantı-kusma', 'Şiddetli ağrı', 'Mobilizasyon güçlüğü']
                }),
            trauma_main: makeFullCase('trauma_main', 'trauma', 'Acil Beyin Cerrahisi', 'Selim Aydın', 28, 'Erkek',
                'Acil Dekompresif Kraniyotomi (Akut Subdural Hematom)', 'Acil Kraniyotomi',
                ['Acil', 'Yüksek risk', 'Nörolojik aciliyet', 'Hemodinamik instabilite', 'Hipotermi'],
                { mrn: 'MR-TR-2026-0117', dob: '14.03.1998', blood: '0 Rh(+)' },
                ['Motosiklet kazası — yüksek hız, kasksız (bugün, 2 saat önce)',
                 'Bilinen kronik hastalık yok',
                 'Düzenli ilaç kullanımı yok',
                 'Sigara: 5 paket-yıl, alkol: sosyal'],
                'Bilinen alerji yok (acil sorgulama; aile ulaşılamadı)',
                { bp: '92/58', hr: 124, rr: 22, spo2: 94, temp: 35.6 },
                ['Hb 10.4 g/dL', 'Trombosit 198 K/μL', 'INR 1.2', 'Glukoz 168 mg/dL',
                 'Laktat 3.4 mmol/L', 'BT: Sol fronto-temporal akut subdural hematom (~1.2 cm), midline shift 8 mm',
                 'GKS 9 → 7 (E1V2M4) — düşmekte', 'Pupiller: sol 4 mm sluggish, sağ 3 mm reaktif'],
                ['İntrakraniyal basınç artışı / herniasyon riski', 'Sekonder beyin hasarı (hipotansiyon/hipoksi)',
                 'Hemodinamik instabilite ve kanama', 'Hipotermi (acil resüsitasyon)',
                 'Aspirasyon riski (azalmış bilinç)', 'Beklenmeyen pıhtılaşma bozukluğu',
                 'Postop nörolojik kötüleşme', 'Acil onam (hasta bilinci kapalı)'],
                {
                    learningObjectives: [
                        'Acil/trauma cerrahisinde GCKL\'nin kısaltılmış protokolünü uygulayabilme',
                        'Akut nörolojik aciliyette altın saat ve sekonder beyin hasarı önleme prensiplerini açıklayabilme',
                        'İki hekim onayı ve acil onam mekanizmasını klinik gerekçesiyle yorumlayabilme',
                        'Hızlı transfüzyon protokolü (1:1:1) ve aktif ısıtmanın eş zamanlı yönetimini planlayabilme',
                        'Postoperatif nörolojik izlemi (GKS, pupil, motor) sistematik raporlayabilme'
                    ],
                    keyConcepts: ['Acil GCKL kısaltma protokolü', 'Sekonder beyin hasarı önleme',
                                  'Hızlı transfüzyon ve hipotermi paradoksu', 'İki hekim acil onamı',
                                  'Nörolojik altın saat', 'CPP ve MAP hedefleri', 'RSI ve hava yolu güvenliği'],
                    guidelineLinks: ['who_ssc', 'who_ssi', 'nice_hypo', 'aorn', 'padis', 'nanda', 'eras'],
                    safetyPriorities: ['Hava yolu ve hemodinami', 'İki hekim acil onamı', 'Hızlı transfüzyon hazırlığı',
                                       'Aktif ısıtma', 'Sayım ve numune (intraop sürdürülür)', 'Nörolojik izlem']
                },
                {
                    label: 'Acil Servis / Preop',
                    diagnoses: [
                        { id: 'tdp_icp', title: 'İntrakraniyal Basınç Artışı / Herniasyon Riski', priority: 'high', relevance: 'correct',
                          factors: ['Akut subdural hematom', 'Midline shift 8 mm', 'GKS düşmekte'],
                          evidence: ['Sol pupil 4 mm sluggish', 'GKS 9 → 7', 'BT bulgusu'],
                          expectedOutcomes: ['Cerrahi dekompresyona kadar GKS ve pupil korunur'],
                          interventions: ['Baş elevasyonu 30°', 'Normokapni hedefi', 'Hipertonik salin/mannitol hazırlığı', 'Hemodinami stabilizasyonu'],
                          rationale: 'Subdural hematomda hızlı dekompresyon prognozu doğrudan belirler; sekonder beyin hasarı önlenir.',
                          guidelines: ['nanda'] },
                        { id: 'tdp_consent', title: 'Acil Onam Süreci (Bilinç Kapalı)', priority: 'high', relevance: 'correct',
                          factors: ['Hasta bilinci yetersiz', 'Aile ulaşılamadı', 'Hayati aciliyet'],
                          evidence: ['GKS 7', 'Aile telefonla aranıyor'],
                          expectedOutcomes: ['İki hekim acil onamı belgelenir; aile ulaşıldığında bilgilendirme yapılır'],
                          interventions: ['İki hekim onam formu', 'Aileye sürekli iletişim girişimi', 'Nöbetçi başhekim bilgilendirilmesi'],
                          rationale: 'Hasta bilinci kapalı ve aile ulaşılamayan acil durumlarda, hayat kurtarıcı girişim için iki hekim onamı klinik ve hukuki standarttır.',
                          guidelines: ['who_ssc'] },
                        { id: 'tdp_hemo', title: 'Hemodinamik İnstabilite Riski', priority: 'high', relevance: 'correct',
                          factors: ['Multipl travma şüphesi', 'BP 92/58', 'Laktat 3.4'],
                          evidence: ['HR 124', 'SpO₂ 94%', 'Hb 10.4'],
                          expectedOutcomes: ['MAP ≥80 mmHg, perfüzyon korunur'],
                          interventions: ['İki büyük damar yolu', 'Kan ürünü hazırlığı (1:1:1)', 'Aktif ısıtma', 'Arteryel monitörizasyon'],
                          rationale: 'Nörotrauma hastasında hipotansiyon mortalite ile doğrusal ilişkilidir; MAP hedefi standart anestezi protokollerinden yüksektir.',
                          guidelines: ['nice_hypo'] }
                    ],
                    correctDiagnoses: ['tdp_icp', 'tdp_consent', 'tdp_hemo'],
                    tasks: [
                        { id: 'tdp_id_em', label: '1. Acil kimlik doğrulama (bileklik + MR no, hasta bilinci kapalı)', critical: true, score: 10, guideline: 'who_ssc' },
                        { id: 'tdp_consent_em', label: '2. İki hekim acil onamı imza ve belgeleme', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'tdp_iv', label: '3. İki büyük damar yolu (16-18G) ve kan grubu/cross-match örneği', critical: true, score: 10, guideline: 'nanda' },
                        { id: 'tdp_warm_pre', label: '4. Aktif ısıtma başlatma (sevk öncesi)', critical: true, score: 8, guideline: 'nice_hypo' },
                        { id: 'tdp_neuro', label: '5. Bazal nörolojik kayıt (GKS, pupil, motor) ve sevk hazırlığı', critical: true, score: 10, guideline: 'nanda' },
                        { id: 'tdp_blood', label: '6. Acil kan ürünü talebi (4Ü ES, 4Ü TDP, 1 havuz trombosit hazır)', critical: true, score: 10, guideline: 'aorn' }
                    ],
                    events: [{ id: 'tev_pupil', trigger: 'tdp_neuro', title: 'Klinik Olay: Sol pupil dilatasyonu — 5 mm fixed',
                        desc: 'Sevk hazırlığı sırasında sol pupil 5 mm\'ye dilate oldu, ışık refleksi kayboldu. GKS 7 → 5.',
                        options: [
                            { label: 'Ekibi acil bilgilendir, baş yükselt, mannitol/hipertonik salin doğrula, ameliyathaneyi acilen aç', correct: true, delta: 12, feedback: 'Doğru. Anizokori + GKS düşüşü herniasyon habercisidir; her dakika kritik.' },
                            { label: 'Önce nörocerrahi konsültasyonu bekle, sonra hareket et', correct: false, delta: -10, feedback: 'Tehlikeli. Herniasyon bulgusunda gecikme nörolojik prognozu kötüleştirir.' },
                            { label: 'Sedatif ekleyerek hastayı sakinleştir', correct: false, delta: -15, feedback: 'Çok tehlikeli. Sedasyon nörolojik değerlendirmeyi engeller, ICP artırabilir.' }
                        ] }],
                    reasoning: [
                        { id: 'tdp_r_consent', after: 'tdp_consent_em', kind: 'mcq',
                          question: 'Bilinci kapalı acil hastada iki hekim onamının hukuki ve klinik temeli nedir?',
                          options: ['Hastane masraflarını paylaşmak', 'Hayati aciliyetlerde, hasta ve yakını onam veremediğinde girişimin gecikmesini önlemek',
                                   'Anestezi ekibinin onayını formalize etmek', 'Sigorta kayıtlarını tamamlamak'],
                          correct: 1, guideline: 'who_ssc',
                          rationale: 'Hayati aciliyetlerde (örn. herniasyon riski), bilinci kapalı ve aile ulaşılamayan hastada iki hekim onamı klinik ve hukuki bir köprüdür.' },
                        { id: 'tdp_r_neuro', after: 'tdp_neuro', kind: 'mcq',
                          question: 'Sevk öncesi bazal GKS, pupil ve motor kaydının kritik amacı nedir?',
                          options: ['Sevk süresini hesaplamak', 'İntraop ve postop nörolojik değişimin referans noktasını oluşturmak',
                                   'Anestezi dozajını ayarlamak', 'Aileye bilgi vermek'],
                          correct: 1, guideline: 'nanda',
                          rationale: 'Bazal nörolojik kayıt olmadan postoperatif kötüleşme objektif olarak değerlendirilemez.' }
                    ],
                    symptoms: ['Bilinç bulanıklığı', 'Anizokori', 'Hipotansiyon', 'Taşikardi', 'Hipotermi', 'Yüksek laktat'],
                    correctSymptoms: ['Bilinç bulanıklığı', 'Anizokori', 'Hipotansiyon', 'Hipotermi']
                },
                {
                    label: 'İntraoperatif Alan / Acil Ameliyathane',
                    diagnoses: [
                        { id: 'tdi_2nd', title: 'Sekonder Beyin Hasarı Riski', priority: 'high', relevance: 'correct',
                          factors: ['İntraoperatif hipotansiyon', 'Hipoksi', 'Hipertermi/hipotermi'],
                          evidence: ['Bazal MAP 69', 'SpO₂ 94', 'Temp 35.6'],
                          expectedOutcomes: ['MAP ≥80, SpO₂ ≥95, Temp 36-37°C korunur'],
                          interventions: ['Sürekli arteryel monitörizasyon', 'Aktif ısıtma + IV sıvı ısıtma', 'Hızlı transfüzyon protokolü'],
                          rationale: 'Nörotrauma cerrahisinde tek bir hipotansiyon atağı (SBP <90, ≥5 dk) mortaliteyi 2 katına çıkarır.',
                          guidelines: ['nice_hypo'] },
                        { id: 'tdi_hypo_acute', title: 'Hipotermi Riski (Acil Resüsitasyon)', priority: 'high', relevance: 'correct',
                          factors: ['Bazal 35.6°C', 'Hızlı IV sıvı', 'Açık kraniyal saha'],
                          evidence: ['Acil servisten gelirken 35.6°C', 'Soğuk kan ürünleri'],
                          expectedOutcomes: ['İntraop ısı ≥36°C tutulur'],
                          interventions: ['Forced-air warming (vücut alt kısmı)', 'Kan/sıvı ısıtıcısı (Belmont)', 'Oda ısısı 24°C'],
                          rationale: 'Trauma triadında (asidoz-hipotermi-koagülopati), hipotermi koagülopati ve aritmi riskini artırır.',
                          guidelines: ['nice_hypo', 'nanda'] },
                        { id: 'tdi_count_em', title: 'Acil Sayım Sorumluluğu', priority: 'high', relevance: 'correct',
                          factors: ['Hızlı set açma', 'Çoklu ekip değişimi', 'Acil senaryoda sayım atlama riski'],
                          evidence: ['AORN: acil cerrahide bile sayım zorunlu, dökümante edilir'],
                          expectedOutcomes: ['Açılış-kapanış sayımı tam, dökümante edilir'],
                          interventions: ['Açılış sayımı (kısaltılmış) yapılır', 'Kapanış sayımı tam', 'Uyumsuzlukta X-ray'],
                          rationale: 'AORN: "Acil cerrahi sayımdan muaf değildir; acil olduğunda dahi minimum açılış sayımı yapılır ve belgelenir."',
                          guidelines: ['aorn'] }
                    ],
                    correctDiagnoses: ['tdi_2nd', 'tdi_hypo_acute', 'tdi_count_em'],
                    tasks: [
                        { id: 'tdi_signin_em', label: 'Sign-in: Kısaltılmış (alerji bilinmiyor → "bilinmiyor" işaretle, kan ürünü hazır)', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'tdi_timeout_em', label: 'Time-out: Cerrah, anestezist, scrub, sirküle — 60 saniyede', critical: true, score: 12, guideline: 'who_ssc' },
                        { id: 'tdi_steril_em', label: 'Acil set sterilizasyon doğrulaması ve antibiyotik (cefazolin)', critical: true, score: 10, guideline: 'who_ssi' },
                        { id: 'tdi_warm_int', label: 'Aktif ısıtma + IV sıvı ısıtma + Belmont kan ürünü ısıtıcı', critical: true, score: 10, guideline: 'nice_hypo' },
                        { id: 'tdi_count_int', label: 'Açılış sayımı (kısaltılmış) ve kapanış sayımı (tam)', critical: true, score: 12, guideline: 'aorn' },
                        { id: 'tdi_signout_em', label: 'Sign-out: Sayım, numune, ekipman bütünlüğü, postop hedef YBÜ', critical: true, score: 10, guideline: 'who_ssc' }
                    ],
                    events: [{ id: 'tev_bp', trigger: 'tdi_warm_int', title: 'Klinik Olay: SBP 78 mmHg, MAP 56 — kraniyotomi sırasında',
                        desc: 'Kemik flep kaldırıldıktan sonra hasta SBP 78, MAP 56. Hb 8.2 g/dL. Cerrah aktif kanama bildiriyor.',
                        options: [
                            { label: 'Hızlı transfüzyon protokolü (1:1:1), vazopresör, anestezist + cerrah eş zamanlı', correct: true, delta: 12, feedback: 'Doğru. Trauma triadına müdahale + CPP koruma + cerrahi hemostaz birlikte yürür.' },
                            { label: 'Yalnızca kristalloid bolus ver', correct: false, delta: -8, feedback: 'Yetersiz. Aktif kanama varken kristalloid hemodilüsyonu artırır, koagülopatiyi kötüleştirir.' },
                            { label: 'Cerrahiyi durdurmasını iste', correct: false, delta: -10, feedback: 'Yanlış. Aktif kanama varken cerrahi durdurmak değil, hızlı hemostaz + transfüzyon ekiplerinin paralel çalışması doğrudur.' }
                        ] }],
                    reasoning: [
                        { id: 'tdi_r_signin', after: 'tdi_signin_em', kind: 'mcq',
                          question: 'Acil cerrahide sign-in tamamen atlanabilir mi?',
                          options: ['Evet, acilde formaliteler değildir', 'Hayır; kısaltılır ama atlanmaz, bilinmeyen alanlar "bilinmiyor" olarak işaretlenir',
                                   'Yalnızca kanama varsa yapılır', 'Yalnızca cerrah karar verir'],
                          correct: 1, guideline: 'who_ssc',
                          rationale: 'WHO acil cerrahide sign-in\'in kısaltılmış halinde yapılması, bilinmeyen alanların "bilinmiyor" olarak belgelenmesini önerir.' },
                        { id: 'tdi_r_count', after: 'tdi_count_int', kind: 'mcq',
                          question: 'Acil cerrahide sayım — hangisi doğru?',
                          options: ['Sayım sadece elektif cerrahide gerekir', 'Acil cerrahide minimum açılış sayımı + tam kapanış sayımı yapılır ve dökümante edilir',
                                   'Acil cerrahide sayım yerine sadece X-ray kullanılır', 'Sayım tamamen atlanır'],
                          correct: 1, guideline: 'aorn',
                          rationale: 'AORN: "Acil cerrahi sayımdan muaf değildir." Açılış sayımı kısaltılır ama kapanış sayımı tam yapılır; uyumsuzlukta intraoperatif X-ray çekilir.' }
                    ],
                    symptoms: ['Hipotansiyon', 'Hipotermi', 'Aktif kanama', 'Anizokori', 'Hızlı sıvı ihtiyacı', 'Sayım uyuşmazlığı'],
                    correctSymptoms: ['Hipotansiyon', 'Hipotermi', 'Aktif kanama', 'Anizokori']
                },
                {
                    label: 'Postoperatif Bakım / Nöro YBÜ',
                    diagnoses: [
                        { id: 'tdpost_neuro', title: 'Nörolojik Kötüleşme Riski', priority: 'high', relevance: 'correct',
                          factors: ['Postop kanama riski', 'Beyin ödemi', 'Hipotansiyon riski'],
                          evidence: ['Postop GKS 9T (intübe)', 'Pupiller eşit 3 mm reaktif'],
                          expectedOutcomes: ['Saatlik nörolojik izlem; kötüleşmede acil BT'],
                          interventions: ['GKS, pupil, motor saatlik kayıt', 'CPP ≥60 hedefi', 'Sedasyon penceresi'],
                          rationale: 'Postop ilk 6 saatte rebleed riski en yüksektir; saatlik izlem standarttır.',
                          guidelines: ['padis', 'nanda'] },
                        { id: 'tdpost_pain', title: 'Akut Ağrı (Bilinç İletişimi Sınırlı)', priority: 'high', relevance: 'correct',
                          factors: ['Kraniyotomi insizyonu', 'Sedasyon', 'İntübasyon'],
                          evidence: ['BPS/CPOT skorları kullanılacak'],
                          expectedOutcomes: ['CPOT ≤2'],
                          interventions: ['Multimodal analjezi (parasetamol + opioid titre)', 'Sedasyon-analjezi ayrımı', 'Çevresel uyaran azaltma'],
                          rationale: 'PADIS: bilinç iletişimi sınırlı hastada davranışsal ağrı skorları (BPS/CPOT) kullanılır.',
                          guidelines: ['padis'] },
                        { id: 'tdpost_inf', title: 'SSI / Menenjit Riski', priority: 'high', relevance: 'correct',
                          factors: ['Açık kraniyotomi', 'Acil cerrahi', 'Multipl manipülasyon'],
                          evidence: ['Postop drenler', 'Antibiyotik profilaksisi'],
                          expectedOutcomes: ['Ateş <38°C, BOS sızıntısı yok'],
                          interventions: ['Drenaj izlemi (miktar, renk)', 'Pansuman bütünlüğü', 'Ateş takibi'],
                          rationale: 'Acil kraniyotomide SSI ve menenjit riski elektifin 2-3 katıdır.',
                          guidelines: ['who_ssi'] }
                    ],
                    correctDiagnoses: ['tdpost_neuro', 'tdpost_pain', 'tdpost_inf'],
                    tasks: [
                        { id: 'tdpost_handover', label: 'PACU/YBÜ teslim (SBAR + nörolojik referans)', critical: true, score: 10, guideline: 'who_ssc' },
                        { id: 'tdpost_neuro_t', label: 'Saatlik GKS, pupil, motor değerlendirme', critical: true, score: 12, guideline: 'nanda' },
                        { id: 'tdpost_pain_t', label: 'CPOT ile ağrı değerlendirmesi', critical: true, score: 8, guideline: 'padis' },
                        { id: 'tdpost_drain_t', label: 'Drenaj izlemi (miktar/renk/BOS sızıntısı)', critical: true, score: 10, guideline: 'nanda' },
                        { id: 'tdpost_temp', label: 'Sıkı normotermi (hipertermi → ICP↑)', critical: true, score: 8, guideline: 'nice_hypo' },
                        { id: 'tdpost_family', label: 'Aile bilgilendirme ve psikososyal destek', critical: false, score: 6, guideline: 'eras' }
                    ],
                    events: [{ id: 'tev_gks', trigger: 'tdpost_neuro_t', title: 'Klinik Olay: GKS 9T → 7T, pupil sol 4 mm sluggish',
                        desc: 'Postop 3. saatte saatlik nörolojik kontrolde GKS 2 puan düştü, sol pupil yeniden büyüdü.',
                        options: [
                            { label: 'Acil nörocerrahi + acil BT, MAP/CPP doğrula, mannitol/hipertonik salin hazırla', correct: true, delta: 12, feedback: 'Doğru. Postop kötüleşme = rebleed varsayımı, acil görüntüleme zorunlu.' },
                            { label: 'Sedasyonu artır, gözlem sürdür', correct: false, delta: -12, feedback: 'Tehlikeli. Sedasyon nörolojik değerlendirmeyi maskeler, rebleed atlanabilir.' },
                            { label: 'Sabaha kadar bekle, vizit zamanı bildir', correct: false, delta: -15, feedback: 'Çok tehlikeli. Postop nörolojik kötüleşme acil komplikasyondur.' }
                        ] }],
                    reasoning: [
                        { id: 'tdpost_r_neuro', after: 'tdpost_neuro_t', kind: 'mcq',
                          question: 'Postoperatif kraniyotomi hastasında saatlik nörolojik izlemin temel klinik gerekçesi nedir?',
                          options: ['Hemşire iş yükünü dağıtmak', 'İlk 6 saatte rebleed/ödem riski en yüksek olduğundan erken müdahale penceresini korumak',
                                   'Aileye saatlik bilgi vermek', 'Vital izlemini formalize etmek'],
                          correct: 1, guideline: 'padis',
                          rationale: 'Postop ilk saatlerde rebleed ve ödem riski yüksek; saatlik nörolojik izlem geri dönüşü olabilen kötüleşmeyi yakalar.' },
                        { id: 'tdpost_r_temp', after: 'tdpost_temp', kind: 'mcq',
                          question: 'Postop nörotrauma hastasında neden sıkı normotermi (hipertermiden kaçınma) önerilir?',
                          options: ['Hasta konforu için', 'Hipertermi serebral metabolik talebi ve ICP\'yi artırır',
                                   'Antibiyotik etkinliği için', 'Drenaj rengi için'],
                          correct: 1, guideline: 'nice_hypo',
                          rationale: 'Hipertermi serebral O₂ tüketimini ve ICP\'yi artırır; nörotrauma postop bakımında normotermi standarttır.' }
                    ],
                    symptoms: ['Bilinç değişikliği', 'Pupil değişikliği', 'Hipertermi', 'BOS sızıntısı', 'Drenaj artışı', 'Ailede kaygı'],
                    correctSymptoms: ['Bilinç değişikliği', 'Pupil değişikliği', 'Drenaj artışı']
                }),
        };

        const PATIENT_EDUCATION_PLANS = {
            cabg_main: {
                preop: {
                    title: 'CABG Öncesi Preoperatif Hasta Eğitimi',
                    summary: 'CABG öncesi kimlik/onam, solunum egzersizi, ağrı yönetimi, yoğun bakım süreci ve aile desteği açıklanır.',
                    intro: 'Bu eğitim, Mehmet Yıldız’ın CABG ×3 ameliyatına hazırlanırken kaygısını azaltmak, cerrahi güvenlik kontrollerini anlamasını sağlamak ve postoperatif döneme aktif katılımını başlatmak için verilir.',
                    keyPoints: ['Kimlik, alerji, kan hazırlığı, ameliyat tarafı/işlemi ve aydınlatılmış onam birlikte doğrulanır.', 'Ameliyat sonrası yoğun bakımda monitör, dren, idrar sondası ve oksijen desteği görebileceği önceden açıklanır.', 'Derin solunum, öksürme ve spirometre kullanımı ağrı kontrolü ile birlikte öğretilir.', 'Sternum korunması için göğsü destekleyerek öksürme ve ani kol-gövde zorlamalarından kaçınma anlatılır.', 'Diyabet, sigara öyküsü ve yaş nedeniyle enfeksiyon, solunum ve deliryum riskleri sade dille açıklanır.'],
                    nurseScript: ['“Ameliyattan sonra tüpler ve monitörler sizi izlemek için olacak; bunlar beklenen güvenlik uygulamalarıdır.”', '“Öksürürken göğsünüzü yastıkla desteklemeniz ağrıyı ve sternum zorlanmasını azaltır.”', '“Ağrınızı saklamayın; ağrı kontrolü iyi olursa daha rahat nefes alır ve daha erken hareket edersiniz.”'],
                    expected: ['İlk günlerde yorgunluk, kesi hassasiyeti, göğüs ve omuz bölgesinde ağrı beklenebilir.', 'Yoğun bakımda kısa süreli uyku bölünmesi ve çevreye yabancılık olabilir.', 'Erken mobilizasyon önce yatak içi hareket, sonra oturma ve kısa yürüyüşle ilerler.'],
                    redFlags: ['Göğüs ağrısı, nefes darlığı, çarpıntı veya bayılma hissi.', 'Kesi yerinde kızarıklık, kötü kokulu akıntı, ateş veya açılma.', 'Bacakta ani şişlik/ağrı, nörolojik değişiklik veya belirgin konfüzyon.'],
                    teachBack: ['Ameliyat sonrası öksürürken göğsünüzü nasıl destekleyeceksiniz?', 'Ağrınız arttığında hemşireye ne zaman haber vereceksiniz?', 'Yoğun bakımda görebileceğiniz monitör ve drenlerin amacı nedir?'],
                    documentation: ['Eğitim verilen başlıklar, hastanın kaygı düzeyi, hasta/yakın soruları ve teach-back yanıtları kaydedilir.', 'Alerji, kan hazırlığı, onam ve cerrahi doğrulama belgelenir.']
                },
                postop: {
                    title: 'CABG Sonrası Postoperatif Eğitim',
                    summary: 'Ağrı, solunum egzersizi, dren/kanama izlemi, deliryum önleme ve erken mobilizasyon hasta düzeyinde açıklanır.',
                    intro: 'Postoperatif eğitim, hastanın güvenli iyileşmeye katılması ve erken komplikasyonları bildirebilmesi için PACU/servis sürecinde tekrarlanır.',
                    keyPoints: ['Ağrı NRS ile değerlendirilir; ağrı kontrolü solunum egzersizi ve mobilizasyonun ön koşuludur.', 'Derin solunum, öksürme ve spirometre uygulaması düzenli aralıklarla yapılır.', 'Göğüs tüpü/dren miktarı, kesi yeri ve kanama bulguları izlenir.', 'Saat, yer, gün ve ameliyat süreci hatırlatılarak oryantasyon desteklenir; uyku-uyanıklık döngüsü korunur.', 'İlk mobilizasyon hemşire gözetiminde yapılır; baş dönmesi, nefes darlığı veya göğüs ağrısı olursa durulur.'],
                    nurseScript: ['“Ağrınızı 0 ile 10 arasında söylemeniz tedaviyi ayarlamamızı sağlar.”', '“Nefes egzersizlerini kısa ama sık yapmanız akciğer komplikasyonlarını azaltmaya yardım eder.”', '“Kafanız karışırsa veya nerede olduğunuzu bilemezseniz hemen bize söyleyin; bu durum ameliyat sonrası görülebilir ve izlenmelidir.”'],
                    expected: ['Yorgunluk, kesi ağrısı, kısa süreli iştahsızlık ve uyku bölünmesi beklenebilir.', 'Mobilizasyon aşamalı ve gözetimli ilerler.', 'Drenler ve monitörizasyon klinik karara göre azaltılır.'],
                    redFlags: ['SpO₂ düşüklüğü, artan nefes darlığı veya balgam çıkaramama.', 'Drenajda ani artış, parlak kırmızı kanama veya hipotansiyon bulguları.', 'Yeni gelişen konfüzyon, ajitasyon, uykuya eğilim veya halüsinasyon.'],
                    teachBack: ['Ağrınızı nasıl bildireceksiniz?', 'Nefes egzersizlerini neden yapmanız gerekiyor?', 'Hangi kanama veya bilinç değişikliği bulgusunda haber vereceksiniz?'],
                    documentation: ['Ağrı skoru, solunum egzersizi toleransı, mobilizasyon düzeyi, dren bulguları ve eğitim yanıtı kaydedilir.']
                },
                discharge: {
                    title: 'CABG Taburculuk Eğitimi',
                    summary: 'Sternum koruma, yara bakımı, ilaç uyumu, kardiyak rehabilitasyon ve acil başvuru bulguları anlatılır.',
                    intro: 'Taburculuk eğitimi, evde güvenli iyileşme, greft açıklığını destekleyen ilaç uyumu ve yaşam tarzı değişiklikleri üzerine yapılandırılır.',
                    keyPoints: ['İlaçlar hekim istemi dışında kesilmez; antiagregan/antikoagülan varsa kanama bulguları öğretilir.', 'Kesi yeri her gün kızarıklık, şişlik, akıntı, açılma ve ısı artışı açısından kontrol edilir.', 'Sternum korunur: ağır kaldırma, ani itme-çekme ve tek taraflı kol zorlamalarından kaçınılır.', 'Yürüyüş kademeli artırılır; kardiyak rehabilitasyon randevusu ve kontrol tarihleri vurgulanır.', 'Sigara bırakma, diyabet/kan basıncı kontrolü, kalp sağlığına uygun beslenme ve uyku düzeni konuşulur.'],
                    nurseScript: ['“İlaçlarınızı kendinizi iyi hissetseniz bile hekime danışmadan bırakmayın.”', '“Yaranızda akıntı, ateş veya açılma olursa beklemeyin.”', '“Yürüyüşü yavaş artıracağız; göğüs ağrısı veya nefes darlığında egzersizi bırakıp sağlık ekibini arayın.”'],
                    expected: ['Tam iyileşme haftalar alabilir; yorgunluk ve kesi hassasiyeti giderek azalır.', 'Kontrollü yürüyüş çoğu hastada iyileşmenin ana parçasıdır.'],
                    redFlags: ['Göğüs ağrısı, ani nefes darlığı, bayılma, çarpıntı.', 'Ateş, yara akıntısı, yara açılması veya bacakta ani şişlik.', 'Siyah dışkı, idrarda kan, burun/diş eti kanaması veya olağan dışı morarma.'],
                    teachBack: ['Evde hangi yara bulgularında hastaneyi arayacaksınız?', 'İlaçlarınızı ne zaman ve nasıl kullanacağınızı anlatır mısınız?', 'Sternumu korumak için nelerden kaçınacaksınız?'],
                    documentation: ['İlaç, yara, aktivite, kontrol randevusu, acil başvuru bulguları ve hasta/yakın anlayışı kaydedilir.']
                }
            },
            ortho_main: {
                preop: {
                    title: 'Eksternal Fiksatör Öncesi Preoperatif Eğitim',
                    summary: 'Açık kırıkta enfeksiyon önleme, 5P nörovasküler izlem, ağrı kontrolü ve fiksatör beklentisi anlatılır.',
                    intro: 'Ayşe Demir’in açık tibia kırığı nedeniyle fiksatör sürecine hazırlanmasında eğitim; enfeksiyon, nörovasküler bozulma ve ağrı yönetimine odaklanır.',
                    keyPoints: ['Cerrahi alan, implant/fiksatör hazırlığı, tetanoz durumu, alerji ve onam doğrulanır.', '5P değerlendirmesi öğretilir: pain/ağrı, pallor/solukluk, pulselessness/nabızsızlık, paresthesia/uyuşma, paralysis/hareket kaybı.', 'Fiksatörün kemiği hizalamak ve sabit tutmak için kullanılacağı açıklanır.', 'Pin yerlerinin enfeksiyon için giriş kapısı olabileceği, bakımın düzenli yapılacağı anlatılır.', 'Ağrı bildirme, ekstremiteyi koruma ve izinsiz ağırlık vermeme vurgulanır.'],
                    nurseScript: ['“Ayağınızda uyuşma, morarma, soğukluk veya artan ağrı olursa hemen haber vermeniz gerekiyor.”', '“Fiksatör kemiği sabit tutmak için var; vidalarla oynamayacağız ve üzerine izinsiz yük vermeyeceğiz.”', '“Pin yerlerinin temiz kalması enfeksiyonu önlemede temel adımdır.”'],
                    expected: ['Fiksatör görünümü hastada kaygı yaratabilir; bu normaldir ve bilgi verilerek azaltılır.', 'Ağrı ve şişlik ilk dönemde beklenebilir ancak artış dikkatle izlenir.'],
                    redFlags: ['Artan ve analjeziye rağmen geçmeyen ağrı.', 'Ayakta soğukluk, morarma, uyuşma, hareket kaybı veya nabız alınamaması.', 'Ateş, kötü kokulu akıntı veya yara/pin çevresinde hızla artan kızarıklık.'],
                    teachBack: ['5P bulgularından üçünü söyleyebilir misiniz?', 'Fiksatörle ilgili hangi durumda hemşireye haber vereceksiniz?', 'Neden pin yerlerinin temiz tutulması gerekiyor?'],
                    documentation: ['Nörovasküler eğitim, pin bakımı ön bilgisi, ağrı düzeyi, hasta kaygısı ve teach-back yanıtları kaydedilir.']
                },
                postop: {
                    title: 'Eksternal Fiksatör Sonrası Postoperatif Eğitim',
                    summary: 'Pin bakımı, nörovasküler izlem, ağrı kontrolü, güvenli mobilizasyon ve düşme önleme öğretilir.',
                    intro: 'Postoperatif eğitim, fiksatörle yaşamın ilk güvenlik adımlarını ve komplikasyonların erken fark edilmesini hedefler.',
                    keyPoints: ['Pin çevresi kızarıklık, ısı artışı, şişlik, akıntı ve kötü koku açısından izlenir.', 'El hijyeni yapılmadan pin bakımına başlanmaz; pansuman/temizlik kurum protokolüne göre uygulanır.', 'Ekstremite hekim istemine göre elevasyonda tutulur; yük verme durumu netleştirilir.', 'Nörovasküler bulgular düzenli izlenir ve hasta bunları bildirmeyi öğrenir.', 'Mobilizasyon yürüteç/koltuk değneği ile, düşme riskine karşı hemşire/fizyoterapist gözetiminde başlatılır.'],
                    nurseScript: ['“Pin çevresinde az miktarda hassasiyet olabilir; ama artan kızarıklık, akıntı veya kötü koku normal değildir.”', '“Ayağınızda uyuşma, renk değişikliği veya hareket kaybı olursa beklemeden haber verin.”', '“Fiksatöre asılmayın, vidaları sıkmayın veya gevşetmeyin.”'],
                    expected: ['İlk günlerde ağrı, şişlik ve hareket kısıtlılığı beklenebilir.', 'Mobilizasyon aşamalı ilerler ve yük verme sınırı cerrahi ekibin kararına bağlıdır.'],
                    redFlags: ['Pin yerinde irin/kötü koku, ateş veya yayılan kızarıklık.', 'Şiddetlenen ağrı, uyuşma, morarma, soğukluk veya nabız azalması.', 'Fiksatörde gevşeme, kırılma veya travma.'],
                    teachBack: ['Pin yerinde hangi bulgular enfeksiyon düşündürür?', 'Ayağınızda hangi değişikliklerde hemen haber vereceksiniz?', 'Fiksatörle yürürken nelere dikkat edeceksiniz?'],
                    documentation: ['Pin yeri görünümü, pansuman eğitimi, nörovasküler bulgular, mobilizasyon düzeyi ve hasta anlayışı kaydedilir.']
                },
                discharge: {
                    title: 'Eksternal Fiksatör Taburculuk Eğitimi',
                    summary: 'Evde pin bakımı, enfeksiyon belirtileri, güvenli mobilizasyon, yük verme sınırı ve kontrol randevuları anlatılır.',
                    intro: 'Taburculuk eğitimi, hastanın evde fiksatörle güvenli yaşamasını, pin yeri enfeksiyonunu erken tanımasını ve nörovasküler riski fark etmesini sağlar.',
                    keyPoints: ['Pin bakım sıklığı ve yöntemi kurum/cerrah protokolüne göre yazılı verilir.', 'Her bakım öncesi el hijyeni yapılır; pin yerleri temiz, kuru ve gözlenebilir tutulur.', 'Yük verme, banyo/duş, pansuman ve egzersiz sınırları cerrahi ekibin talimatına göre anlatılır.', 'Fiksatöre darbe almaktan kaçınılır; cihaz parçalarıyla oynanmaz.', 'Kontrol randevuları, antibiyotik/analjezik kullanımı ve acil başvuru yolları netleştirilir.'],
                    nurseScript: ['“Evde pin yerlerini her gün aynı ışıkta kontrol edin; kızarıklık yayılıyor veya akıntı artıyorsa sağlık ekibini arayın.”', '“Hekim izin vermeden bacağınıza tam yük vermeyin.”', '“Fiksatör gevşerse veya düşerseniz beklemeden başvurun.”'],
                    expected: ['Fiksatör haftalar/aylar sürebilir; görünüm ve günlük yaşam değişikliği psikolojik zorlanma yaratabilir.', 'Ağrı ve şişlik zamanla azalmalı; artış değerlendirilmelidir.'],
                    redFlags: ['Ateş, pin yerinde irin/kötü koku, hızla artan kızarıklık.', 'Yeni uyuşma, hareket kaybı, soğukluk, morarma veya dayanılmaz ağrı.', 'Fiksatörde gevşeme/kırılma, düşme veya yeni travma.'],
                    teachBack: ['Evde pin bakımını hangi sırayla yapacağınızı anlatır mısınız?', 'Hangi durumda acile başvuracaksınız?', 'Yük verme sınırınız nedir?'],
                    documentation: ['Yazılı pin bakım planı, yük verme talimatı, ilaçlar, kontrol tarihi ve hasta/yakın teach-back sonucu kaydedilir.']
                }
            },
            lap_main: {
                preop: {
                    title: 'Laparoskopik Kolesistektomi Öncesi Preoperatif Eğitim',
                    summary: 'ERAS uyumlu açlık, erken beslenme/mobilizasyon, PONV riski, ağrı ve alerji bilgisi açıklanır.',
                    intro: 'Fatma Kaya’nın laparoskopik kolesistektomi öncesi eğitimi; kısa yatış, PONV önleme, ağrı kontrolü ve güvenli taburculuk beklentisi üzerine kuruludur.',
                    keyPoints: ['Kimlik, onam, alerji ve ameliyat doğrulaması yapılır; sülfonamid alerjisi ekibe iletilir.', 'Laparoskopik girişimde küçük kesiler ve CO₂ gazına bağlı omuz ağrısı olabileceği açıklanır.', 'PONV riski nedeniyle bulantı öyküsü, açlık, hidrasyon ve antiemetik planı konuşulur.', 'Erken mobilizasyon, ağrı kontrolü ve ağızdan alıma geçişin iyileşmeyi hızlandırdığı anlatılır.', 'Hasta eve aynı gün/erken taburculuk olasılığına hazırlanır.'],
                    nurseScript: ['“Ameliyattan sonra omuzda gaz ağrısı olabilir; bu genellikle geçicidir.”', '“Bulantınız olursa beklemeyin, erken bildirmeniz tedaviyi kolaylaştırır.”', '“Ağrı kontrolü ve yürüyüş iyileşmenin parçasıdır.”'],
                    expected: ['Kısa süreli boğaz kuruluğu, omuz ağrısı, hafif kesi ağrısı ve bulantı olabilir.', 'Erken beslenme ve mobilizasyon hastanın toleransına göre başlatılır.'],
                    redFlags: ['Alerji bulguları, nefes darlığı, yaygın döküntü veya yüzde/dilde şişme.', 'Şiddetli karın ağrısı, kontrolsüz kusma veya ateş.', 'Safra kaçağı şüphesi yaratabilecek sarılık veya artan karın hassasiyeti.'],
                    teachBack: ['Omuz ağrısı neden olabilir?', 'Bulantı olursa ne yapacaksınız?', 'Sülfonamid alerjinizi kime ve ne zaman söylemelisiniz?'],
                    documentation: ['Alerji, PONV riski, ERAS eğitimi, hasta soruları ve teach-back yanıtı kaydedilir.']
                },
                postop: {
                    title: 'Laparoskopik Kolesistektomi Sonrası Postoperatif Eğitim',
                    summary: 'PONV kontrolü, omuz ağrısı, yara takibi, erken mobilizasyon ve beslenmeye geçiş anlatılır.',
                    intro: 'Postoperatif eğitim, hastanın hızlı ama güvenli iyileşmesini ve safra/yara komplikasyonlarını erken bildirmesini hedefler.',
                    keyPoints: ['Bulantı-kusma erken bildirilir; antiemetik ve sıvı desteği geciktirilmez.', 'Omuz ağrısının CO₂ gazına bağlı olabileceği, yürüyüş ve pozisyon değişikliğiyle azalabileceği açıklanır.', 'Kesi yerleri kanama, kızarıklık, şişlik, akıntı ve açılma açısından izlenir.', 'Ağızdan alım küçük ve hafif gıdalarla başlatılır; yağlı/ağır yiyecekler erken dönemde sınırlanır.', 'Erken mobilizasyon düşme riski değerlendirilerek başlatılır.'],
                    nurseScript: ['“Bulantınız artarsa ya da kusarsanız hemen bildirin.”', '“Omuz ağrısı çoğu zaman verilen gazla ilişkilidir; kısa yürüyüşler rahatlatabilir.”', '“Kesi yerinizde akıntı veya artan kızarıklık olursa bunu normal kabul etmeyin.”'],
                    expected: ['Hafif karın/omuz ağrısı, yorgunluk ve kısa süreli bulantı görülebilir.', 'Çoğu hasta kısa sürede ayağa kalkar ve sıvı-gıda alımına geçer.'],
                    redFlags: ['Kontrolsüz kusma, şiddetlenen karın ağrısı, ateş.', 'Sarılık, koyu idrar, açık renk dışkı veya yaygın kaşıntı.', 'Kesi yerinde akıntı, kötü koku, açılma veya kanama.'],
                    teachBack: ['Bulantı artarsa ne yapacaksınız?', 'Kesi yerinde hangi bulgular risklidir?', 'Evde beslenmeyi nasıl başlatacaksınız?'],
                    documentation: ['PONV skoru, ağrı düzeyi, oral alım, mobilizasyon ve yara eğitimi kaydedilir.']
                },
                discharge: {
                    title: 'Laparoskopik Kolesistektomi Taburculuk Eğitimi',
                    summary: 'Kesi bakımı, banyo/aktivite, beslenme, ağrı kesici kullanımı ve başvuru gerektiren bulgular anlatılır.',
                    intro: 'Taburculuk eğitimi kısa yatışlı laparoskopik cerrahide kritik güvenlik aşamasıdır; hasta evde normal iyileşme ile alarm bulgusunu ayırt etmelidir.',
                    keyPoints: ['Pansuman/duş talimatı kurum protokolüne göre yazılı verilir; kesi yerleri temiz ve kuru tutulur.', 'Ağrı kesiciler önerildiği şekilde kullanılır; araç kullanma ve işe dönüş sedasyon/ağrı durumuna göre planlanır.', 'İlk günlerde hafif ve küçük öğünler tercih edilir; yağlı yemekler tolere edildikçe artırılır.', 'Ağır kaldırma ve yoğun egzersizden önerilen süre boyunca kaçınılır; yürüyüş artırılır.', 'Kontrol randevusu, patoloji sonucu takibi ve acil başvuru bulguları açıklanır.'],
                    nurseScript: ['“Küçük kesiler hızlı iyileşir ama kızarıklık, akıntı ve ateş olursa beklemeyin.”', '“Yağlı yiyecekleri ilk günlerde azaltın; vücudunuzun toleransına göre ilerleyin.”', '“Şiddetlenen karın ağrısı, sarılık veya sürekli kusma normal değildir.”'],
                    expected: ['Hafif yorgunluk, kesi hassasiyeti ve gaz/omuz ağrısı kısa sürebilir.', 'Günlük aktiviteye dönüş çoğu hastada kademeli olur.'],
                    redFlags: ['Ateş, şiddetli/artan karın ağrısı, sürekli kusma.', 'Sarılık, koyu idrar, açık renk dışkı veya yaygın kaşıntı.', 'Yara akıntısı, kötü koku, kızarıklık artışı veya kanama.'],
                    teachBack: ['Evde hangi belirtilerde hastaneyi arayacaksınız?', 'Yara bakımını nasıl yapacağınızı anlatır mısınız?', 'Beslenmeye nasıl başlayacaksınız?'],
                    documentation: ['Yara bakımı, ilaç, beslenme, aktivite, kontrol randevusu ve alarm bulguları öğretildi olarak kaydedilir.']
                }
            },
            trauma_main: {
                preop: {
                    title: 'Acil Kraniyotomi Öncesi Aile Bilgilendirmesi',
                    summary: 'Hasta bilinci kapalı; preoperatif eğitim aileye verilir. İki hekim acil onamı, cerrahi aciliyeti, beklenen komplikasyonlar ve YBÜ süreci açıklanır.',
                    intro: 'Selim Aydın bilinç düzeyi azalmış halde acil servise getirildi; akut subdural hematom için acil dekompresif kraniyotomi planlandı. Hasta onam veremediği için iki hekim acil onamı uygulanır; aile ulaşıldığında bu süreç şeffaflıkla anlatılır.',
                    keyPoints: ['Hayati aciliyet nedeniyle iki hekim onamı ile cerrahiye geçildiği, hasta yararı temel alınarak hareket edildiği açıklanır.',
                                'Subdural hematomun ne olduğu (beyin yüzeyi ile sert zar arasında biriken kan) ve dekompresif kraniyotominin neden gerektiği sade dille anlatılır.',
                                'Cerrahi sonrası hastanın yoğun bakımda izleneceği, intübe ve sedatize olabileceği önceden bildirilir.',
                                'Nörolojik prognozun ameliyat öncesi bilinç düzeyi ve kanın boşaltılma hızıyla doğrudan ilişkili olduğu açıklanır.',
                                'Aile destek personeli (sosyal hizmet, manevi destek) yönlendirmeleri yapılır.'],
                    nurseScript: ['“Selim Bey acil olarak ameliyata alınıyor; kafa içinde basınç yapan kanın boşaltılması gerekiyor.”',
                                  '“Bilinci kapalı olduğu için acil onamı iki hekim birlikte verdi; bu hayati aciliyetlerde standart bir uygulamadır.”',
                                  '“Ameliyat sonrası yoğun bakımda izlenecek; tüpler, monitörler ve ilaçlar süreç gereği olacak.”'],
                    expected: ['Cerrahi 2-3 saat sürebilir; sonrasında en az 24-48 saat yoğun bakım izlemi planlanır.',
                               'Hasta intübe ve sedatize gelebilir; bu, beyin için koruyucu bir tedavi yaklaşımıdır.',
                               'Nörolojik iyileşme yavaş ve kademeli olabilir; günler-haftalar içinde değerlendirilir.'],
                    redFlags: ['Ameliyat sırasında ekiple sürekli iletişimde olunduğu; ailenin endişesini hemşireye bildirebileceği vurgulanır.',
                               'Aile için bekleme alanı, iletişim noktası ve tahmini sürenin paylaşımı önemlidir.',
                               'Aileye “bilgilenmek ve sorular sormak” açıkça izinlendirilir.'],
                    teachBack: ['İki hekim onamı ne demek?',
                                'Ameliyat sonrası yoğun bakımda hangi durumları görebileceksiniz?',
                                'Hangi sorularınızı kime ne zaman iletebilirsiniz?'],
                    documentation: ['İki hekim acil onamı, aile ulaşım süreci, verilen bilgi başlıkları ve aile teach-back yanıtları kaydedilir.',
                                    'Sosyal hizmet/manevi destek yönlendirmesi belgelenir.']
                },
                postop: {
                    title: 'Postoperatif Nöro YBÜ Bakım Eğitimi (Aile + Ekip)',
                    summary: 'Postop nörolojik izlem, sedasyon penceresi, drenaj/ICP yönetimi, normotermi, ağrı (CPOT) ve aile katılımı anlatılır.',
                    intro: 'Postoperatif eğitim hem yatak başı bakım ekibine hem aileye yönelik iki katmanlıdır; ilk 6 saat rebleed/ödem riski açısından kritiktir.',
                    keyPoints: ['Saatlik GKS, pupil ve motor değerlendirme yapılır; herhangi bir kötüleşme acil bildirim gerektirir.',
                                'Sedasyon nörolojik değerlendirmeyi maskelememeli; düzenli sedasyon penceresi planlanır.',
                                'Sıkı normotermi (36-37°C) hedeflenir; hipertermi serebral metabolik talebi ve ICP\'yi artırır.',
                                'Drenaj miktar ve karakteri (özellikle BOS sızıntısı) izlenir; renk değişikliği veya artış cerrahi konsültasyon gerektirir.',
                                'Aileye kısa ziyaret pencereleri tanımlanır; tanıdık ses ve dokunma nörolojik uyarana destek olabilir.',
                                'Bilinç iletişimi sınırlı hastada CPOT/BPS skorlarıyla ağrı değerlendirilir.'],
                    nurseScript: ['“Selim Bey saatte bir kısa nörolojik kontrolden geçecek; gözlerine bakacağız, komutları takip ediyor mu sorgulayacağız.”',
                                  '“Sedatif ilaç kullanıyoruz ama düzenli aralıklarla bilinç kontrolü için azaltıyoruz.”',
                                  '“Ateşi yüksek olmasın diye normalden daha sıkı takip ediyoruz; bu beyin için koruyucu.”'],
                    expected: ['İlk 24 saat sedatize/intübe izlem genellikle planlanır.',
                               'Drenajdan ölçülü miktarda kanlı sıvı gelebilir; ekip bunu zaten beklemektedir.',
                               'Nörolojik iyileşme dalgalı seyredebilir; küçük geri-ileri hareketler beklenebilir.'],
                    redFlags: ['GKS\'de iki puan veya üzeri düşüş — acil bildirim ve görüntüleme gerektirir.',
                               'Pupil değişikliği (anizokori, ışık refleksi kaybı) — acil müdahale.',
                               'BOS sızıntısı (berrak/saman renginde, glikoz pozitif sıvı) — cerrahi.',
                               'Ateş >38°C — kültür ve enfeksiyon değerlendirmesi.'],
                    teachBack: ['Nörolojik izlemin saatlik yapılmasının nedeni nedir?',
                                'Sedasyon penceresi nedir, neden gereklidir?',
                                'Aile olarak hangi gözlemlerinizi ekibe bildirmelisiniz?'],
                    documentation: ['Saatlik GKS/pupil/motor, CPOT skoru, drenaj miktarı/karakteri, ısı, sedasyon dozu ve aile bilgilendirme kaydedilir.',
                                    'Nörolojik kötüleşme bulguları gerçek zamanlı belgelenir.']
                },
                discharge: {
                    title: 'Nöro YBÜ\'den Servise / Eve Geçiş Eğitimi',
                    summary: 'Kraniyotomi sonrası geç dönem yara bakımı, nörolojik takip, nöbet riski, kognitif rehabilitasyon ve aile desteği açıklanır.',
                    intro: 'Bu eğitim hastanın yoğun bakımdan servise veya eve geçişinde verilir; nörotrauma sonrası geç komplikasyonlar elektif cerrahiye göre farklıdır.',
                    keyPoints: ['Kafa derisi insizyon bakımı (örtülmüş/açık) kurum protokolüne göre anlatılır; kesi yerinde anormal şişlik veya akıntı bildirilir.',
                                'Nöbet riski ilk 6 ayda artmıştır; profilaktik antikonvülzan (genelde levetirasetam) kullanımı sürdürülebilir.',
                                'Bilişsel iyileşme aylar sürebilir — dikkat, hafıza, ruh hali değişikliği beklenebilir; nöropsikolojik değerlendirme planlanır.',
                                'Erken mobilizasyon, fizyoterapi ve mesleki rehabilitasyon planlanır.',
                                'Araç kullanımı, ağır iş, alkol ve havuz/banyo gibi konularda sınırlamalar net olarak yazılı verilir.',
                                'Aile evde gözleyeceği nörolojik değişiklikleri (uyuklama, konfüzyon, baş ağrısı artışı, kusma) bilir.'],
                    nurseScript: ['“İlk haftalarda yorgunluk ve baş ağrısı beklenebilir; ama uyuklama veya konfüzyon artarsa hemen başvurun.”',
                                  '“Nöbet riskine karşı verilen ilacı doktor söylemeden bırakmayın.”',
                                  '“Kafanızda her zaman olduğundan farklı bir şey hissederseniz — şişlik, akıntı, ateş — hemen arayın.”'],
                    expected: ['Yorgunluk, hafif baş ağrısı, dikkat ve konsantrasyon güçlüğü haftalar sürebilir.',
                               'Kafa derisinde geçici his değişiklikleri normaldir.',
                               'Mesleki ve sosyal rollere dönüş kademeli olur.'],
                    redFlags: ['Yeni baş ağrısı + kusma, uyuklama, konfüzyon — acil görüntüleme gerektirir.',
                               'Yeni nöbet aktivitesi.',
                               'Kafa derisi insizyonunda kötü koku, akıntı, açılma, kızarıklık.',
                               'Ani konuşma/anlama bozukluğu, motor güçsüzlük.'],
                    teachBack: ['Hangi belirtilerde acil hastaneye başvuracaksınız?',
                                'Antikonvülzan ilacı ne zaman ve nasıl alacaksınız?',
                                'Kafa derisi insizyon bakımını nasıl yapacaksınız?'],
                    documentation: ['Yara bakımı, ilaç, nöbet bildirimi, aktivite kısıtlamaları, kontrol randevuları, nöropsikolojik takip kaydedilir.',
                                    'Aile teach-back yanıtları ve sosyal destek planı belgelenir.']
                }
            }
        };

        Object.entries(PATIENT_EDUCATION_PLANS).forEach(([id, plan]) => {
            if (CASES[id]) CASES[id].educationContent = { ...(CASES[id].educationContent || {}), patientEducation: plan };
        });

        const DEMO_SPECS = [
            ['demo_apx', 'general', 'Genel Cerrahi', 'Hasan Aydın', 34, 'Erkek', 'Apendektomi', 'Apendektomi', ['Akut karın', 'SSI'], 1],
            ['demo_thy', 'general', 'Genel Cerrahi', 'Selin Korkmaz', 46, 'Kadın', 'Tiroidektomi', 'Tiroidektomi', ['Hava yolu', 'Hipokalsemi'], 2],
            ['demo_col', 'general', 'Genel Cerrahi', 'Kemal Sönmez', 62, 'Erkek', 'Kolorektal Cerrahi', 'Kolorektal', ['SSI', 'Anastomoz kaçağı'], 3],
            ['demo_kne', 'ortho', 'Ortopedi ve Travmatoloji', 'Ali Vural', 61, 'Erkek', 'Total Diz Protezi', 'Diz Protezi', ['DVT', 'Kanama'], 2],
            ['demo_hip', 'ortho', 'Ortopedi ve Travmatoloji', 'Hatice Erdem', 74, 'Kadın', 'Kalça Kırığı – Hemiartroplasti', 'Kalça Hemi', ['Yaşlı', 'Deliryum', 'DVT'], 3],
            ['demo_spine', 'ortho', 'Ortopedi ve Travmatoloji', 'Burak Aslan', 49, 'Erkek', 'Omurga Stabilizasyon Cerrahisi', 'Omurga Stabil.', ['Nörolojik', 'Pozisyon'], 3],
            ['demo_avr', 'cardio', 'Kalp ve Damar Cerrahisi', 'İbrahim Doğan', 71, 'Erkek', 'Aort Kapak Replasmanı', 'AVR', ['Antikoagülasyon', 'Deliryum'], 3],
            ['demo_car', 'cardio', 'Kalp ve Damar Cerrahisi', 'Sevgi Polat', 64, 'Kadın', 'Karotis Endarterektomi', 'Karotis', ['Nörolojik', 'Hemodinami'], 2],
            ['demo_aaa', 'cardio', 'Kalp ve Damar Cerrahisi', 'Osman Koç', 70, 'Erkek', 'Abdominal Aort Anevrizması Cerrahisi', 'AAA Cerrahisi', ['Rüptür riski', 'Kanama'], 3],
            ['demo_lam', 'neuro', 'Beyin ve Sinir Cerrahisi', 'Murat Çelik', 49, 'Erkek', 'Lomber Laminektomi', 'Laminektomi', ['Nörolojik izlem', 'Pozisyon'], 2],
            ['demo_cra', 'neuro', 'Beyin ve Sinir Cerrahisi', 'Zeynep Çelik', 57, 'Kadın', 'Kraniyotomi', 'Kraniyotomi', ['ICP', 'Nörolojik'], 3],
            ['demo_spine_t', 'neuro', 'Beyin ve Sinir Cerrahisi', 'Can Demir', 44, 'Erkek', 'Spinal Tümör Cerrahisi', 'Spinal Tümör', ['Nörolojik', 'Mobilizasyon'], 3],
            ['demo_turp', 'uro', 'Üroloji', 'Mustafa Şahin', 69, 'Erkek', 'TURP', 'TURP', ['TURP sendromu', 'Kanama'], 2],
            ['demo_neph', 'uro', 'Üroloji', 'Hülya Aksoy', 55, 'Kadın', 'Nefrektomi', 'Nefrektomi', ['Kanama', 'Sıvı dengesi'], 2],
            ['demo_ureter', 'uro', 'Üroloji', 'Ahmet Yıldız', 38, 'Erkek', 'Üreter Taşı Cerrahisi', 'Üreter Taşı', ['Obstrüksiyon', 'Enfeksiyon'], 1],
            ['demo_cs', 'gyn', 'Kadın Hast. ve Doğum Cerrahisi', 'Elif Yılmaz', 31, 'Kadın', 'Sezaryen', 'Sezaryen', ['Anne-bebek', 'PPH'], 2],
            ['demo_hys', 'gyn', 'Kadın Hast. ve Doğum Cerrahisi', 'Gülşen Akar', 52, 'Kadın', 'Histerektomi', 'Histerektomi', ['Kanama', 'PONV'], 2],
            ['demo_ovary', 'gyn', 'Kadın Hast. ve Doğum Cerrahisi', 'Nurten Öz', 36, 'Kadın', 'Over Kisti Cerrahisi', 'Over Kisti', ['Kanama', 'Enfeksiyon'], 1],
            ['demo_lob', 'thoracic', 'Göğüs Cerrahisi', 'Recep Kılıç', 62, 'Erkek', 'Lobektomi', 'Lobektomi', ['Solunum', 'Göğüs tüpü'], 3],
            ['demo_thr', 'thoracic', 'Göğüs Cerrahisi', 'Nuray Özkan', 47, 'Kadın', 'VATS Plevra', 'VATS', ['Hava kaçağı', 'Ağrı'], 2],
            ['demo_pnx', 'thoracic', 'Göğüs Cerrahisi', 'Kemal Yurt', 29, 'Erkek', 'Pnömotoraks Cerrahisi', 'Pnömotoraks', ['Solunum', 'Tansiyon'], 2],
            ['demo_burn', 'plastic', 'Plastik ve Rekonstrüktif Cerrahi', 'Derya Solmaz', 28, 'Kadın', 'Yanık Debridmanı', 'Yanık Debridmanı', ['Enfeksiyon', 'Sıvı'], 2],
            ['demo_graft', 'plastic', 'Plastik ve Rekonstrüktif Cerrahi', 'Aylin Kurt', 45, 'Kadın', 'Deri Grefti', 'Deri Grefti', ['Greft kaybı', 'Enfeksiyon'], 2],
            ['demo_breast', 'plastic', 'Plastik ve Rekonstrüktif Cerrahi', 'Sibel Can', 53, 'Kadın', 'Meme Rekonstrüksiyonu', 'Meme Rekonst.', ['Doku nekrozu', 'Enfeksiyon'], 3],
            ['demo_tons', 'ent', 'KBB Cerrahisi', 'Ali Rıza', 22, 'Erkek', 'Tonsillektomi', 'Tonsillektomi', ['Kanama', 'Hava yolu'], 1],
            ['demo_sep', 'ent', 'KBB Cerrahisi', 'Gizem Akar', 30, 'Kadın', 'Septoplasti', 'Septoplasti', ['Kanama', 'Nazal obstruksiyon'], 1],
            ['demo_thy_kbb', 'ent', 'KBB Cerrahisi', 'Filiz Özdemir', 48, 'Kadın', 'Tiroidektomi (KBB)', 'Tiroidektomi (KBB)', ['Hava yolu', 'Hipokalsemi'], 2],
            ['demo_cat', 'ophth', 'Göz Cerrahisi', 'Mehmet Göz', 72, 'Erkek', 'Katarakt Cerrahisi', 'Katarakt', ['Göz içi basınç', 'Düşme'], 1],
            ['demo_ret', 'ophth', 'Göz Cerrahisi', 'Ayten Parlak', 58, 'Kadın', 'Retina Cerrahisi', 'Retina', ['Pozisyon', 'Enfeksiyon'], 2],
            ['demo_glau', 'ophth', 'Göz Cerrahisi', 'Süleyman Bakır', 66, 'Erkek', 'Glokom Cerrahisi', 'Glokom', ['GİB', 'Görme kaybı'], 2],
        ];

        DEMO_SPECS.forEach(([id, spec, specName, name, age, gender, surgery, shortSurgery, riskTags, difficulty]) => {
            CASES[id] = makeDemoCase(id, spec, specName, name, age, gender, surgery, shortSurgery, riskTags, difficulty);
        });

        const ALL_CASES = Object.values(CASES);

        /* ===================== APP STATE ===================== */
        var App = {
            mode: 'tutor', // tek akış: Eğitim Modu
            role: 'student', // 'student' | 'observer'
            aiMode: true,
            currentPatient: null,
            currentRoom: 'preop',
            intraopRoleFocus: 'all',
            preopRoleFocus: 'all',
            postopRoleFocus: 'all',
            focusMode: 'task', // 'task' | 'safety' | 'free'
            cameraFocus: 'phase',
            microDecisionResults: {},
            unlockedRooms: { preop: true, intraop: true, postop: true },
            tempIntraopUnlock: true,
            tempPostopUnlock: true,
            completedTasks: [],
            // === v6 State Machine — Sprint 1.1 Aşama A ===
            // Her görev için zengin durum nesnesi. completedTasks ile paralel çalışır.
            // Şema: { taskId: { status, substeps:{}, evidence:[], startedAt, completedAt, errorCount, unsafeReason } }
            // status: 'pending' | 'partial' | 'completed' | 'unsafe'
            taskStates: {},
            selectedDiagnoses: { preop: [], intraop: [], postop: [] },
            diagnosesConfirmed: { preop: false, intraop: false, postop: false },
            selectedSymptoms: { preop: [], intraop: [], postop: [] },
            symptomsConfirmed: { preop: false, intraop: false, postop: false },
            eventHandled: {},
            reasoningAnswered: {},
            askedQuestions: [],
            doctorChatHistory: [],
            familyChatHistory: [],
            debriefChatHistory: [],
            phaseDebriefSeen: {},
            phaseDebriefLog: {},
            scores: {},
            phaseScores: { preop: { earned: 0, max: 0 }, intraop: { earned: 0, max: 0 }, postop: { earned: 0, max: 0 } },
            feedbackEntries: [],
            leftTab: 'patient',
            // --- Zamanlayıcı State'i ---
            timerInterval: null,
            totalSeconds: 0,
            phaseSeconds: { preop: 0, intraop: 0, postop: 0 },

            // ============ OSCE-PHDYÖ akademik state ============
            osce: {
                // Madde başına: { earned, max, system, observer1, observer2, source, rationale, criticalErrors:[], notes }
                items: {},
                criticalErrors: {},     // { identityMissed: true, ... }
                phaseScores: { preop: { earned: 0, max: 35 }, intraop: { earned: 0, max: 35 }, postop: { earned: 0, max: 30 } },
                rawTotal: 0,
                finalTotal: 0,
                appliedCap: null,
                rqAnswers: {},          // RQ-XXX -> { text, score, keywords, hits, total, ts }
                geminiFeedback: {},     // itemId -> { text, ts } (yalnızca eğitsel)
                irrelevantDiagnoses: { preop: [], intraop: [], postop: [] }, // alakasız tanı seçimleri
                observerNotes: { observer1: '', observer2: '' },
                activeObserver: 'observer1'
            },
            actionSequence: [],         // her aksiyon: { t, phase, kind, tag, payload, ok }
            patientCommunication: { preop: {}, intraop: {}, postop: {} },
            criticalSafetyEvents: [],
            studyMeta: {
                studentId: '',
                group: 'intervention',  // tek akış: Eğitim Modu
                timePoint: 'pre',       // 'pre' | 'post' | 'retention'
                site: '',
                consent: false,
                startedAt: null,
                completedAt: null
            }
        };

        /* ============================================================
           A.5 STRANGLER FIG — OSCE DEPRECATION GUARD
           OSCE skor sistemi GCKL'ye geçiş için devre dışı bırakıldı.
           Geri açmak için console'da: window.OSCE_LEGACY_ON = true
           Veya body'ye class="osce-legacy-on" ekleyin.
           ============================================================ */
        window.OSCE_DEPRECATED = true;
        window.OSCE_LEGACY_ON = false; // false ise tüm OSCE fonksiyonları no-op

        // OSCE fonksiyonlarının başına eklenecek guard
        function __osceDeprecatedGuard(fnName) {
            if (window.OSCE_LEGACY_ON) return false;
            if (!window.__osceWarnings) window.__osceWarnings = new Set();
            if (!window.__osceWarnings.has(fnName)) {
                window.__osceWarnings.add(fnName);
                console.debug(`[OSCE deprecated] ${fnName} no-op (GCKL geçişi)`);
            }
            return true; // true = guard tetiklendi, fonksiyon hiçbir şey yapmasın
        }

        // OSCE durum kontrolü — konsoldan: NurseKitOSCE.status()
        window.NurseKitOSCE = {
            status: function() {
                console.group('[A.5 OSCE Strangler Fig — Durum]');
                console.log('OSCE_DEPRECATED:', window.OSCE_DEPRECATED);
                console.log('OSCE_LEGACY_ON:', window.OSCE_LEGACY_ON);
                console.log('Çağrılan ama no-op olan fonksiyonlar:',
                    window.__osceWarnings ? [...window.__osceWarnings] : []);
                console.log('App.osce.items eleman sayısı:',
                    App.osce && App.osce.items ? Object.keys(App.osce.items).length : 0);
                console.log('App.osce.rawTotal:', App.osce ? App.osce.rawTotal : 'N/A');
                console.log('App.osce.finalTotal:', App.osce ? App.osce.finalTotal : 'N/A');
                console.log('UI gizli mi:', !document.body.classList.contains('osce-legacy-on'));
                console.groupEnd();
                return {
                    deprecated: window.OSCE_DEPRECATED,
                    legacyOn: window.OSCE_LEGACY_ON,
                    noOpFunctions: window.__osceWarnings ? [...window.__osceWarnings] : [],
                    osceItemsCount: App.osce && App.osce.items ? Object.keys(App.osce.items).length : 0,
                    uiHidden: !document.body.classList.contains('osce-legacy-on')
                };
            },
            enable: function() {
                window.OSCE_LEGACY_ON = true;
                document.body.classList.add('osce-legacy-on');
                console.warn('[OSCE] Legacy mod AÇILDI — sayfayı yenileyin');
            },
            disable: function() {
                window.OSCE_LEGACY_ON = false;
                document.body.classList.remove('osce-legacy-on');
                console.log('[OSCE] Legacy mod KAPATILDI');
            }
        };

        /* ============================================================
           v6 STATE MACHINE — Sprint 1.1 Aşama A + İP-1 (GCKL-aware)
           Strangler fig pattern: mevcut completedTasks ile paralel çalışır.

           İP-1 değişiklikleri:
           - SUBSTEP_DEFINITIONS artık GCKL_TASK_DEFS'ten dinamik türetiliyor
           - Görev ID'leri gckl_X_Y formatında (PRE-X yerine)
           - Eşik mantığı GCKL_ITEMS criticalKey alanına göre belirleniyor
           - Never-event maddeleri için partial yok (allowPartial: false)
           ============================================================ */
        const NurseKitSM = (function() {

            const VALID_STATUSES = ['pending', 'partial', 'completed', 'unsafe'];

            // Klinik mantığa göre never-event GCKL maddeleri:
            // partial kabul edilmez, ya tam doğrulanmıştır ya unsafe
            const NEVER_EVENT_ITEMS = new Set([
                'GCKL-11',  // Ameliyat bölgesi işaretleme (wrong-site surgery)
                'GCKL-18',  // Time-Out sesli teyit (wrong-patient/wrong-procedure)
                'GCKL-26',  // Sign-Out sesli teyit
                'GCKL-27',  // Alet/spanç/iğne sayımı (retained foreign object)
                'GCKL-28',  // Numune etiketleme (wrong-specimen)
            ]);

            // İP-3: Multi-Source Verification konfigürasyonu
            // 12 kritik GCKL maddesi için klinik açıdan anlamlı kaynak listeleri
            // Her source: { key, label, hint }
            // Sources arasında uyumsuzluk → unsafe
            const MULTI_SOURCE_CONFIG = {
                'GCKL-1': {
                    title: 'Kimlik / Ameliyat / Bölge Doğrulaması',
                    sources: [
                        { key: 'wristband',    label: 'Hasta bilekliğindeki bilgileri kontrol ettim',          hint: 'Ad-soyad ve protokol no/doğum tarihi' },
                        { key: 'patient_oral', label: 'Hastadan sözel olarak teyit aldım',                     hint: 'Hasta uyanık ve kooperatif iken' },
                        { key: 'file_record',  label: 'Hasta dosyasındaki bilgileri karşılaştırdım',           hint: 'Ameliyat türü ve tarafı dahil' }
                    ]
                },
                'GCKL-2': {
                    title: 'Cerrahi Onam Doğrulaması',
                    sources: [
                        { key: 'consent_signed',    label: 'Onam belgesinde imzalar tam (hasta + hekim)', hint: 'Tarih ≤30 gün' },
                        { key: 'patient_oral',      label: 'Hastadan rıza beyanını aldım',                hint: 'Hangi ameliyat olduğunu bilmesi' },
                        { key: 'procedure_match',   label: 'Onam metni planlanan ameliyatla eşleşiyor',    hint: 'Taraf, prosedür adı' }
                    ]
                },
                'GCKL-3': {
                    title: 'NPO / Açlık Doğrulaması',
                    sources: [
                        { key: 'patient_oral',  label: 'Hastadan son katı/sıvı alım saatini sorguladım', hint: 'Genel anestezi: 6-8 saat katı, 2 saat berrak sıvı' },
                        { key: 'file_record',   label: 'Klinik dosyasında NPO talimatı kayıtlı',         hint: 'Hemşire takip notları' }
                    ]
                },
                'GCKL-10': {
                    title: 'Hastadan Doğrulama (Anestezi Öncesi)',
                    sources: [
                        { key: 'patient_oral',  label: 'Hastadan kimlik, ameliyat ve bölgesini tekrar ettim', hint: 'Premedikasyon öncesi' },
                        { key: 'wristband',     label: 'Bilekliği tekrar kontrol ettim',                       hint: 'Ameliyathane içinde' },
                        { key: 'team_confirm',  label: 'Anestezi ekibiyle karşılıklı teyit ettim',             hint: 'Anestezist hazır iken' }
                    ]
                },
                'GCKL-11': {
                    title: 'Cerrahi Taraf İşaretleme (NEVER-EVENT)',
                    sources: [
                        { key: 'visual_mark',   label: 'İşaretlemeyi kendi gözümle gördüm',                  hint: 'Daire içine alınmış, silinmez kalemle' },
                        { key: 'patient_oral',  label: 'Hasta hangi tarafı söylediğini doğruladım',          hint: 'Hasta uyanık iken' },
                        { key: 'consent_match', label: 'İşaretleme onam ve dosyayla eşleşiyor',              hint: 'Sağ/sol parmak/seviye dahil' }
                    ]
                },
                'GCKL-14': {
                    title: 'Alerji Doğrulaması',
                    sources: [
                        { key: 'patient_oral',  label: 'Hastadan ilaç, lateks ve gıda alerjisi sorguladım',  hint: 'Spesifik isimler ve reaksiyon türü' },
                        { key: 'wristband',     label: 'Alerji bilekliğini kontrol ettim',                   hint: 'Kırmızı bileklik varsa' },
                        { key: 'file_record',   label: 'Dosyada alerji kaydı/uyumu doğruladım',              hint: 'Çelişki varsa not alın' },
                        { key: 'team_inform',   label: 'Anestezi/cerrahi ekibe bildirdim',                   hint: 'Alerji varsa' }
                    ]
                },
                'GCKL-16': {
                    title: 'Kan Kaybı Riski Değerlendirmesi',
                    sources: [
                        { key: 'risk_assessed', label: 'Beklenen kan kaybı miktarını anestezistle teyit ettim', hint: '>500 mL erişkin / >7 mL/kg çocuk' },
                        { key: 'iv_access',     label: 'Yeterli damar yolu erişimi mevcut',                     hint: '2 büyük çap veya santral' },
                        { key: 'fluid_blood',   label: 'Sıvı/kan ürünü hazır',                                  hint: 'Crossmatch tamamlandı' }
                    ]
                },
                'GCKL-18': {
                    title: 'Time-Out Sesli Teyit (NEVER-EVENT)',
                    sources: [
                        { key: 'verbal_id',         label: 'Hasta kimliği sesli olarak teyit edildi',         hint: 'Ekipten biri yüksek sesle' },
                        { key: 'verbal_procedure',  label: 'Yapılan ameliyat sesli teyit edildi',             hint: 'Onam metniyle eşleşmeli' },
                        { key: 'verbal_site',       label: 'Ameliyat bölgesi sesli teyit edildi',             hint: 'İşaretleme görsel kontrol dahil' },
                        { key: 'team_present',      label: 'Tüm ekip dinliyor ve hareketsiz',                 hint: 'Cerrah, anestezi, scrub, sirküle' }
                    ]
                },
                'GCKL-20': {
                    title: 'Profilaktik Antibiyotik Doğrulaması',
                    sources: [
                        { key: 'abx_indicated', label: 'Profilaksi gerekliliği kontrol edildi',           hint: 'Temiz/temiz-kontamine cerrahi' },
                        { key: 'abx_timing',    label: 'Kesi öncesi 60 dk içinde uygulandı',              hint: 'Vankomisin/florokinolon ise 120 dk' },
                        { key: 'abx_allergy',   label: 'Alerji ile uyumlu ilaç seçildi',                  hint: 'Penisilin alerjisi → klindamisin/vanko' }
                    ]
                },
                'GCKL-26': {
                    title: 'Sign-Out Sesli Teyit (NEVER-EVENT)',
                    sources: [
                        { key: 'verbal_procedure',  label: 'Yapılan ameliyat sesli olarak söylendi', hint: 'Cerrah veya hemşire tarafından' },
                        { key: 'verbal_site',       label: 'Ameliyat bölgesi sesli teyit',           hint: 'Final kontrol' },
                        { key: 'team_acknowledge',  label: 'Ekip teyidini sözel ifade etti',         hint: 'Anestezist ve cerrah dahil' }
                    ]
                },
                'GCKL-27': {
                    title: 'Alet/Spanç/İğne Sayımı (NEVER-EVENT)',
                    sources: [
                        { key: 'instrument_count',  label: 'Alet sayımı yapıldı ve doğrulandı',       hint: 'Başlangıç sayısı = bitiş sayısı' },
                        { key: 'sponge_count',      label: 'Spanç/kompres sayımı doğrulandı',         hint: 'Tüm renkler ve boyutlar' },
                        { key: 'needle_count',      label: 'İğne sayımı doğrulandı',                  hint: 'Kırık iğne dahil' },
                        { key: 'verbal_confirm',    label: 'Scrub ve sirküle sesli teyit etti',       hint: 'Kapatmadan önce' }
                    ]
                },
                'GCKL-28': {
                    title: 'Numune Etiketleme (NEVER-EVENT)',
                    sources: [
                        { key: 'patient_id',     label: 'Numune etiketinde hasta adı doğru',         hint: 'Cerrahla sesli teyit' },
                        { key: 'specimen_site',  label: 'Alındığı bölge etikete yazıldı',            hint: 'Anatomik kesinlik' },
                        { key: 'readback',       label: 'Cerrahın söylediğini sesli tekrar ettim',   hint: 'Closed-loop iletişim' }
                    ]
                }
            };

            // gckl_X_Y formatındaki task ID'sinden GCKL madde ID'sini çıkar
            // Örn: 'gckl_14_allergy_check' → 'GCKL-14'
            function gcklItemIdFromTaskId(taskId) {
                if (typeof taskId !== 'string') return null;
                const m = taskId.match(/^gckl_(\d+)_/);
                return m ? `GCKL-${m[1]}` : null;
            }

            // GCKL_TASK_DEFS'ten substep tanımı türet
            function getDefinition(taskId) {
                // Eğer taskId zaten bir GCKL madde ID'siyse (GCKL-1) doğrudan
                let gcklId = taskId;
                if (taskId && taskId.startsWith('gckl_')) {
                    gcklId = gcklItemIdFromTaskId(taskId);
                }
                if (!gcklId || !gcklId.startsWith('GCKL-')) return null;

                // Lazy resolution: GCKL_TASK_DEFS runtime'da erişilebilir
                if (typeof GCKL_TASK_DEFS === 'undefined' || !GCKL_TASK_DEFS[gcklId]) return null;

                const taskDefs = GCKL_TASK_DEFS[gcklId];
                const substepIds = taskDefs.map(td => td[0]);
                const isNeverEvent = NEVER_EVENT_ITEMS.has(gcklId);

                // Klinik label: GCKL_ITEMS'tan al (varsa)
                let label = gcklId;
                try {
                    if (typeof GCKL_ITEMS !== 'undefined') {
                        const item = GCKL_ITEMS.find(i => i.id === gcklId);
                        if (item) label = item.text;
                    }
                } catch (e) { /* sessiz */ }

                return {
                    gcklId: gcklId,
                    label: label,
                    substeps: substepIds,
                    minForCompleted: substepIds.length,        // tüm substep'ler tam = completed
                    minForPartial: isNeverEvent ? null : 1,    // never-event'te partial yok
                    allowPartial: !isNeverEvent,
                    isNeverEvent: isNeverEvent
                };
            }

            function hasDefinition(taskId) {
                return !!getDefinition(taskId);
            }

            // Bir GCKL maddesinin tüm substep ID'lerini döner
            function getSubstepIds(gcklId) {
                if (typeof GCKL_TASK_DEFS === 'undefined' || !GCKL_TASK_DEFS[gcklId]) return [];
                return GCKL_TASK_DEFS[gcklId].map(td => td[0]);
            }

            // Bir GCKL maddesinin agregat durumunu hesapla (substep'lerine bakarak)
            function computeAggregateStatus(gcklId) {
                const def = getDefinition(gcklId);
                if (!def) return 'pending';

                const substepStates = def.substeps.map(sid => getStatus(sid));
                const completedCount = substepStates.filter(s => s === 'completed').length;
                const unsafeCount = substepStates.filter(s => s === 'unsafe').length;

                if (unsafeCount > 0) return 'unsafe';
                if (completedCount === 0) return 'pending';
                if (completedCount >= def.minForCompleted) return 'completed';
                if (def.allowPartial && completedCount >= (def.minForPartial || 1)) return 'partial';
                if (def.isNeverEvent && completedCount < def.minForCompleted) return 'unsafe';
                return 'partial';
            }

            function ensureState(taskId) {
                if (!App.taskStates[taskId]) {
                    App.taskStates[taskId] = {
                        status: 'pending',
                        substeps: {},
                        evidence: [],
                        startedAt: null,
                        completedAt: null,
                        errorCount: 0,
                        unsafeReason: null,
                        gcklItemId: gcklItemIdFromTaskId(taskId)  // İP-1: GCKL madde referansı
                    };
                }
                return App.taskStates[taskId];
            }

            function getState(taskId) {
                return App.taskStates[taskId] || null;
            }

            function getStatus(taskId) {
                const s = App.taskStates[taskId];
                return s ? s.status : 'pending';
            }

            function setStatus(taskId, status, reason = null) {
                if (!VALID_STATUSES.includes(status)) {
                    console.warn('[NurseKitSM] geçersiz status:', status);
                    return;
                }
                const s = ensureState(taskId);
                const prev = s.status;
                s.status = status;
                if (status === 'unsafe') s.unsafeReason = reason;
                if (status === 'completed' && !s.completedAt) s.completedAt = Date.now();
                if (status !== 'pending' && !s.startedAt) s.startedAt = Date.now();
                if (prev !== status) {
                    console.debug(`[NurseKitSM] ${taskId}: ${prev} → ${status}`, reason ? `(${reason})` : '');
                }
            }

            function addEvidence(taskId, interaction, objectId = null) {
                const s = ensureState(taskId);
                s.evidence.push({
                    interaction: interaction,
                    objectId: objectId,
                    timestamp: Date.now()
                });
            }

            function recordSubstep(taskId, substepKey, value, source) {
                const s = ensureState(taskId);
                s.substeps[substepKey] = {
                    done: true,
                    value: value,
                    source: source,
                    timestamp: Date.now()
                };
                if (!s.startedAt) s.startedAt = Date.now();
                if (s.status === 'pending') s.status = 'partial';
            }

            function incrementError(taskId) {
                const s = ensureState(taskId);
                s.errorCount++;
                return s.errorCount;
            }

            // === Shadow mode: eski completedTasks tamamlamalarını yansıt ===
            // executeTaskCompletion içinden çağrılır
            function shadowComplete(taskId, sourceObj = null) {
                const s = ensureState(taskId);
                s.status = 'completed';
                if (!s.startedAt) s.startedAt = Date.now();
                s.completedAt = Date.now();
                addEvidence(taskId, 'legacy_complete', sourceObj?.opts?.clinicalKey || null);
            }

            // === Debug helpers — console'dan çağrılabilir ===
            function _debug() {
                console.group('[NurseKitSM] Debug Snapshot');
                console.log('completedTasks (legacy):', App.completedTasks);
                console.log('taskStates (v6):', App.taskStates);
                console.table(Object.entries(App.taskStates).map(([id, s]) => ({
                    taskId: id,
                    gcklItem: s.gcklItemId || '-',
                    status: s.status,
                    substeps: Object.keys(s.substeps).length,
                    evidence: s.evidence.length,
                    errors: s.errorCount
                })));
                console.groupEnd();
            }

            function _consistency() {
                const legacy = new Set(App.completedTasks || []);
                const v6Completed = new Set(
                    Object.entries(App.taskStates)
                        .filter(([, s]) => s.status === 'completed')
                        .map(([id]) => id)
                );
                const onlyLegacy = [...legacy].filter(id => !v6Completed.has(id));
                const onlyV6 = [...v6Completed].filter(id => !legacy.has(id));
                const consistent = onlyLegacy.length === 0 && onlyV6.length === 0;
                console.group('[NurseKitSM] Tutarlılık kontrolü');
                console.log('Sadece legacy completedTasks:', onlyLegacy);
                console.log('Sadece v6 taskStates:', onlyV6);
                console.log(consistent ? '✓ TUTARLI' : '✗ TUTARLI DEĞİL');
                console.groupEnd();
                return { onlyLegacy, onlyV6, consistent };
            }

            // İP-1: GCKL agregat durumunu görme
            function _gcklStatus(gcklId = null) {
                if (typeof GCKL_ITEMS === 'undefined') {
                    console.warn('[NurseKitSM] GCKL_ITEMS henüz tanımlı değil');
                    return null;
                }
                const items = gcklId ? [GCKL_ITEMS.find(i => i.id === gcklId)].filter(Boolean) : GCKL_ITEMS;
                console.group(`[NurseKitSM] GCKL Agregat Durumu${gcklId ? ' — ' + gcklId : ' — Tüm Maddeler'}`);
                const rows = items.map(item => {
                    const def = getDefinition(item.id);
                    const status = computeAggregateStatus(item.id);
                    const substepsDone = def ? def.substeps.filter(sid => getStatus(sid) === 'completed').length : 0;
                    const substepsTotal = def ? def.substeps.length : 0;
                    return {
                        gcklId: item.id,
                        phase: item.phase,
                        critical: item.criticalKey ? '⚠' : '',
                        neverEvent: NEVER_EVENT_ITEMS.has(item.id) ? '🚫' : '',
                        status: status,
                        substeps: `${substepsDone}/${substepsTotal}`
                    };
                });
                console.table(rows);
                console.groupEnd();
                return rows;
            }

            // İP-1: Geçerlilik kontrolü — GCKL_TASK_DEFS ile uyumlu mu?
            function _validate() {
                console.group('[NurseKitSM] İP-1 Validation');
                if (typeof GCKL_TASK_DEFS === 'undefined') {
                    console.error('GCKL_TASK_DEFS tanımlı değil');
                    console.groupEnd();
                    return false;
                }
                const gcklIds = Object.keys(GCKL_TASK_DEFS);
                console.log(`GCKL_TASK_DEFS içinde ${gcklIds.length} madde tanımlı`);
                let allOk = true;
                gcklIds.forEach(gid => {
                    const def = getDefinition(gid);
                    if (!def) {
                        console.error(`✗ ${gid}: getDefinition null döndürdü`);
                        allOk = false;
                        return;
                    }
                    if (def.substeps.length === 0) {
                        console.warn(`⚠ ${gid}: substep yok`);
                    }
                });
                // Bir gerçek task ID üzerinden test
                const sampleTask = 'gckl_14_allergy_check';
                const sampleDef = getDefinition(sampleTask);
                if (sampleDef && sampleDef.gcklId === 'GCKL-14') {
                    console.log(`✓ Task ID resolution çalışıyor: ${sampleTask} → GCKL-14`);
                } else {
                    console.error(`✗ Task ID resolution bozuk: ${sampleTask}`);
                    allOk = false;
                }
                console.log(allOk ? '✓ İP-1 başarılı' : '✗ İP-1 sorunlu');
                console.groupEnd();
                return allOk;
            }

            // İP-3: Multi-source verification helper'ları
            function hasMultiSource(taskId) {
                const def = getDefinition(taskId);
                if (!def) return false;
                return !!MULTI_SOURCE_CONFIG[def.gcklId];
            }

            function getMultiSourceConfig(taskId) {
                const def = getDefinition(taskId);
                if (!def) return null;
                return MULTI_SOURCE_CONFIG[def.gcklId] || null;
            }

            // Bir GCKL maddesinin multi-source verification durumunu kaydet
            // sources: { sourceKey: true|false }, conflict: bool
            function recordMultiSourceVerification(taskId, sources, conflict) {
                const def = getDefinition(taskId);
                if (!def) return null;
                const config = MULTI_SOURCE_CONFIG[def.gcklId];
                if (!config) return null;

                const s = ensureState(taskId);
                s.multiSource = {
                    gcklId: def.gcklId,
                    sources: sources,
                    conflict: conflict,
                    timestamp: Date.now()
                };

                // Çakışma raporlandı → unsafe
                if (conflict) {
                    setStatus(taskId, 'unsafe', 'Multi-source uyumsuzluk raporlandı');
                    return { status: 'unsafe', reason: 'conflict' };
                }

                // Tüm kaynaklar onaylandı → completed
                const allOk = config.sources.every(src => sources[src.key] === true);
                if (allOk) {
                    setStatus(taskId, 'completed');
                    return { status: 'completed' };
                }

                // Bazı kaynaklar eksik
                const def2 = getDefinition(taskId);
                if (def2.isNeverEvent) {
                    // Never-event'te eksik kaynak = unsafe
                    setStatus(taskId, 'unsafe', 'Never-event maddesinde eksik doğrulama kaynağı');
                    return { status: 'unsafe', reason: 'incomplete_never_event' };
                }
                setStatus(taskId, 'partial');
                return { status: 'partial' };
            }

            return {
                ensureState, getState, getStatus, setStatus,
                addEvidence, recordSubstep, incrementError,
                getDefinition, hasDefinition, getSubstepIds,
                computeAggregateStatus, gcklItemIdFromTaskId,
                shadowComplete,
                hasMultiSource, getMultiSourceConfig, recordMultiSourceVerification,
                _debug, _consistency, _gcklStatus, _validate,
                NEVER_EVENT_ITEMS, VALID_STATUSES, MULTI_SOURCE_CONFIG
            };
        })();

        // Window'a expose — console testi için
        if (typeof window !== 'undefined') window.NurseKitSM = NurseKitSM;

        // Aksiyon sıralayıcısı — tüm puanlanan / etkileşilen olayları zaman damgalı kayıt
        function recordAction(kind, payload) {
            try {
                App.actionSequence.push({
                    t: Date.now(),
                    elapsed: App.totalSeconds,
                    phase: App.currentRoom,
                    kind: kind,
                    payload: payload || {}
                });
            } catch (e) { /* sessizce yut */ }
        }

        /* ============================================================
           OSCE-PHDYÖ SKOR MOTORU
           - initOSCEPHDYOScore: vaka başlangıcında state hazırla
           - scoreOSCEItem: bir maddeye puan ata (öğrenci aksiyonu / observer / AI)
           - autoScoreOSCEFrom*: öğrenci aksiyonu → ilgili madde puanı
           - applyOSCECriticalError: kritik hata bayrağı
           - determineOSCECriticalCap: aktif cap'lerden en düşüğü
           - calculateOSCEPhaseScores / calculateFinalOSCEPHDYOScore
           - scoreOSCERationale: gerekçelendirme yanıtı keyword skoru
           ============================================================ */
        function initOSCEPHDYOScore() {
            if (__osceDeprecatedGuard("initOSCEPHDYOScore")) return;
            const items = {};
            OSCE_PHDYO.items.forEach(it => {
                items[it.id] = {
                    id: it.id, phase: it.phase, max: it.max,
                    // Akademik puan kaynakları — birbirinden bağımsız saklanır:
                    system: null,        // kural tabanlı otomatik puan (kanıt yoksa null)
                    observer1: null,
                    observer2: null,
                    earned: 0,
                    source: null,
                    rationale: null,
                    rationaleOk: false,
                    behaviorOk: false,
                    // Kanıt zinciri (köprü matrisinden):
                    evidence: [],
                    negativeEvidence: [],
                    missingEvidence: [],
                    timingStatus: 'n/a',
                    performanceCode: null,
                    performanceLabel: '',
                    requiresObserver: false,
                    criticalErrors: [],
                    notes: ''
                };
            });
            App.osce = {
                items: items,
                criticalErrors: {},
                phaseScores: {
                    preop:   { earned: 0, max: OSCE_PHDYO.phaseMax.preop },
                    intraop: { earned: 0, max: OSCE_PHDYO.phaseMax.intraop },
                    postop:  { earned: 0, max: OSCE_PHDYO.phaseMax.postop }
                },
                rawTotal: 0, finalTotal: 0, appliedCap: null,
                rqAnswers: {},
                geminiFeedback: {},
                irrelevantDiagnoses: { preop: [], intraop: [], postop: [] },
                observerNotes: { observer1: '', observer2: '' },
                activeObserver: 'observer1'
            };
            App.actionSequence = [];
        }

        function osceClampScore(v, max) {
            v = Number(v) || 0;
            if (v < 0) v = 0;
            if (v > max) v = max;
            return v;
        }

        function scoreOSCEItem(itemId, score, opts) {
            if (__osceDeprecatedGuard("scoreOSCEItem")) return;
            const def = osceGetItem(itemId);
            if (!def || !App.osce.items[itemId]) return;
            const rec = App.osce.items[itemId];
            const o = opts || {};
            const newScore = osceClampScore(score, def.max);
            const src = o.source || 'system';
            // AI hiçbir koşulda akademik puan kaynağı olamaz — sessizce yok say.
            if (src === 'ai') return;
            // Her kaynağı BAĞIMSIZ alanında sakla; diğerlerini ezme.
            if (src === 'system')    rec.system    = newScore;
            if (src === 'observer1') rec.observer1 = newScore;
            if (src === 'observer2') rec.observer2 = newScore;
            // Raporlama için birleşik 'earned' — öncelik: observer1 → observer2 → system
            // (gözlemci puanı sistemi silmez; sadece raporlamada öne geçer)
            if (rec.observer1 !== null) { rec.earned = rec.observer1; rec.source = 'observer1'; }
            else if (rec.observer2 !== null) { rec.earned = rec.observer2; rec.source = 'observer2'; }
            else if (rec.system !== null) { rec.earned = rec.system; rec.source = 'system'; }
            if (o.note) rec.notes = o.note;
            recordAction('osce-score', { itemId, score: newScore, source: src });
            recalcOSCETotals();
        }

        function applyOSCECriticalError(key, on, payload) {
            if (__osceDeprecatedGuard("applyOSCECriticalError")) return;
            if (on) {
                App.osce.criticalErrors[key] = true;
                recordAction('osce-critical', { key, payload: payload || null });
            } else {
                delete App.osce.criticalErrors[key];
            }
            recalcOSCETotals();
        }

        function determineOSCECriticalCap() {
            const active = Object.keys(App.osce.criticalErrors).filter(k => App.osce.criticalErrors[k]);
            if (active.length === 0) return null;
            let lowest = 100, which = null;
            active.forEach(k => {
                const cap = OSCE_PHDYO.criticalCaps[k];
                if (cap !== undefined && cap < lowest) { lowest = cap; which = k; }
            });
            return which ? { cap: lowest, key: which, all: active } : null;
        }

        function calculateOSCEPhaseScores() {
            if (__osceDeprecatedGuard("calculateOSCEPhaseScores")) return;
            ['preop','intraop','postop'].forEach(ph => {
                let sum = 0;
                osceItemsByPhase(ph).forEach(it => { sum += App.osce.items[it.id].earned; });
                if (sum < 0) sum = 0; // alt boyut sıfırın altına düşmesin
                App.osce.phaseScores[ph].earned = sum;
            });
        }

        function calculateFinalOSCEPHDYOScore() {
            if (__osceDeprecatedGuard("calculateFinalOSCEPHDYOScore")) return { raw: 0, final: 0, cap: null };
            calculateOSCEPhaseScores();
            const raw = App.osce.phaseScores.preop.earned
                      + App.osce.phaseScores.intraop.earned
                      + App.osce.phaseScores.postop.earned;
            const capInfo = determineOSCECriticalCap();
            let final = raw;
            if (capInfo && raw > capInfo.cap) final = capInfo.cap;
            App.osce.rawTotal = raw;
            App.osce.appliedCap = capInfo;
            App.osce.finalTotal = final;
            return { raw, final, cap: capInfo };
        }

        function recalcOSCETotals() { return calculateFinalOSCEPHDYOScore(); }

        /* ============================================================
           OSCE-PHDYÖ — UI: Rationale modal, Observer paneli,
           Study/API ayarları, Role/Observer toggle
           ============================================================ */
        let _osceRatCurrent = null; // şu an açık olan rationale madde id
        function maybePromptRationaleForTask(taskId) {
            // Klasik/açık uçlu gerekçe soruları öğrenci akışından çıkarıldı.
            // GCKL öğrenme kanıtı artık çoktan seçmeli ve doğru/yanlış sorularla toplanır.
            try { recordAction('classical-rationale-disabled', { taskId }); } catch(e) {}
            return;
        }

        function openOSCERationale(itemId) {
            if (__osceDeprecatedGuard("openOSCERationale")) return;
            const item = osceGetItem(itemId);
            if (!item || !item.rq) return;
            _osceRatCurrent = itemId;
            $('#osce-rat-title').textContent = item.title;
            $('#osce-rat-itemid').textContent = item.id + ' · ' + item.phase.toUpperCase();
            $('#osce-rat-criterion').textContent = item.criterion;
            $('#osce-rat-question').textContent = item.rq.q;
            $('#osce-rat-input').value = '';
            $('#osce-rat-feedback').style.display = 'none';
            $('#osce-rat-feedback').innerHTML = '';
            $('#osce-rationale-modal').classList.add('visible');
            setTimeout(() => $('#osce-rat-input').focus(), 100);
        }

        function closeOSCERationale() {
            $('#osce-rationale-modal').classList.remove('visible');
            _osceRatCurrent = null;
        }

        async function submitOSCERationale() {
            if (__osceDeprecatedGuard("submitOSCERationale")) return;
            if (!_osceRatCurrent) return;
            const itemId = _osceRatCurrent;
            const text = $('#osce-rat-input').value.trim();
            if (!text) { toast('warning', 'Eksik', 'Lütfen kısa bir gerekçe yazın.'); return; }
            const item = osceGetItem(itemId);
            const result = scoreOSCERationale(itemId, text);
            const fb = $('#osce-rat-feedback');
            const kwHtml = result.hits.map(k => `<span class="kw">${k}</span>`).join(' ');
            const status = result.ok
                ? '<b style="color:var(--teal)">Gerekçe yeterli.</b> Davranış da doğru ise madde tam puan alır.'
                : '<b style="color:var(--amber)">Gerekçe eksik.</b> Madde kısmi puanda kalacak.';
            fb.innerHTML = `${status} <span class="osce-hint">(${result.hits.length}/${result.total} anahtar kavram)</span>
                <div style="margin-top:6px">${kwHtml || '<span class="osce-hint">Anahtar kavram yakalanamadı; observer manuel skorlayabilir.</span>'}</div>`;
            fb.style.display = 'block';
            // Eğitim modunda kısa AI yorumu — yalnızca eğitsel; akademik puanı ETKİLEMEZ.
            if (App.mode === 'tutor' && App.aiMode && getApiKey()) {
                fb.innerHTML += `<div data-ai-slot="1" style="margin-top:8px;color:var(--violet)">✨ AI yorumu yükleniyor…</div>`;
                try {
                    const prompt = `Sen bir cerrahi hemşireliği eğitmenisin. Madde: "${item.title}". Beklenen kriter: "${item.criterion}". Soru: "${item.rq.q}". Öğrenci yanıtı: "${text}". 1-2 cümle yapıcı geri bildirim ver; eksik kalan tek bir kavramı söyle. Bu yalnızca eğitsel açıklamadır, puanlama değildir.`;
                    const ai = await callGeminiAPI(prompt);
                    // gemini_feedback alanına sakla — raporda ayrı alanda gösterilir.
                    if (App.osce && App.osce.geminiFeedback) {
                        App.osce.geminiFeedback[itemId] = { text: ai, ts: Date.now() };
                    }
                    const slot = fb.querySelector('[data-ai-slot]');
                    if (slot) slot.innerHTML = `✨ ${ai} <div class="osce-hint" style="margin-top:4px">(yalnızca eğitsel; akademik puanı etkilemez)</div>`;
                } catch(e){}
            }
            updateScoreStrip && updateScoreStrip();
            // 1.8 sn sonra otomatik kapan (observer akışı engellemesin)
            setTimeout(() => { closeOSCERationale(); }, 1800);
        }

        /* --- Observer panel --- */
        function toggleObserverPanel(force) {
            const p = $('#osce-observer-panel');
            const willOpen = (typeof force === 'boolean') ? force : !p.classList.contains('visible');
            if (willOpen) {
                App.role = 'observer';
                renderObserverPanel();
                p.classList.add('visible');
            } else {
                App.role = 'student';
                p.classList.remove('visible');
            }
            renderTopbar && renderTopbar();
        }

        function renderObserverPanel() {
            // Summary
            calculateFinalOSCEPHDYOScore();
            const s = App.osce;
            const capInfo = s.appliedCap;
            const activeObs = s.activeObserver || 'observer1';
            $('#osce-obs-summary').innerHTML = `
                <div class="row"><span>Pre-op</span><b>${s.phaseScores.preop.earned} / ${s.phaseScores.preop.max}</b></div>
                <div class="row"><span>Intra-op</span><b>${s.phaseScores.intraop.earned} / ${s.phaseScores.intraop.max}</b></div>
                <div class="row"><span>Post-op</span><b>${s.phaseScores.postop.earned} / ${s.phaseScores.postop.max}</b></div>
                <div class="row" style="border-top:1px solid var(--teal-3); padding-top:6px; margin-top:6px">
                    <span>Toplam</span>
                    <span class="total">${s.finalTotal} / 100${s.rawTotal !== s.finalTotal ? ' <span class="cap">(cap: '+s.finalTotal+')</span>' : ''}</span>
                </div>
                ${capInfo ? `<div style="margin-top:6px;color:#ff9090;font-size:11px">Aktif tavan: <b>${capInfo.key}</b> (≤${capInfo.cap})</div>` : ''}
                <div class="osce-hint" style="margin-top:6px; line-height:1.4">Şu an aktif kaynak: <b>${activeObs}</b>. Sistem (kural-tabanlı) puanı, observer1 ve observer2 puanları ayrı saklanır; raporda yan yana gösterilir. AI yorumları yalnızca eğitseldir, akademik puanı etkilemez.</div>
            `;
            // Body — fazlara bölünmüş 37 madde
            const body = $('#osce-obs-body');
            body.innerHTML = '';
            ['preop','intraop','postop'].forEach(ph => {
                const block = el('div', 'osce-phase-block');
                block.appendChild(el('div', 'osce-phase-h', `${ph.toUpperCase()} <span class="pp">${App.osce.phaseScores[ph].earned}/${App.osce.phaseScores[ph].max}</span>`));
                osceItemsByPhase(ph).forEach(item => {
                    const rec = App.osce.items[item.id];
                    const row = el('div', 'osce-item-row');
                    const isCrit = item.criticalKey && App.osce.criticalErrors[item.criticalKey];
                    // Aktif observer'ın puanı (yoksa null), select varsayılanı olarak gösterilir
                    const obsActive = App.osce.activeObserver || 'observer1';
                    const obsVal = rec[obsActive];
                    const sysVal = rec.system;
                    const showVal = (obsVal !== null && obsVal !== undefined) ? obsVal : (rec.earned || 0);
                    const sourceLabel = rec.source ? rec.source : 'henüz';
                    row.innerHTML = `
                        <div class="ih">
                            <span class="id">${item.id}</span>
                            <div class="tt">
                                ${item.title}
                                ${item.criticalKey ? `<div class="ck">⚠ kritik: ${item.criticalKey} (≤${OSCE_PHDYO.criticalCaps[item.criticalKey]})</div>` : ''}
                                <div class="osce-hint" style="font-size:10px; margin-top:2px">
                                    sys: <b>${sysVal===null?'–':sysVal}</b> · obs1: <b>${rec.observer1===null?'–':rec.observer1}</b> · obs2: <b>${rec.observer2===null?'–':rec.observer2}</b>
                                </div>
                            </div>
                        </div>
                        <div class="ctrl">
                            <select data-osce-score="${item.id}">
                                ${Array.from({length: item.max+1}, (_,i)=>`<option value="${i}" ${showVal===i?'selected':''}>${i} / ${item.max}</option>`).join('')}
                            </select>
                            <span class="src ${rec.source||''}">${sourceLabel}</span>
                            ${item.criticalKey ? `<button class="crit-toggle ${isCrit?'active':''}" data-osce-crit="${item.criticalKey}" data-osce-item="${item.id}">${isCrit?'KRİTİK ✓':'kritik?'}</button>` : ''}
                        </div>
                        <textarea class="note" data-osce-note="${item.id}" placeholder="Gözlem notu (opsiyonel)…">${rec.notes||''}</textarea>
                    `;
                    block.appendChild(row);
                });
                body.appendChild(block);
            });
            // Bind events
            body.querySelectorAll('select[data-osce-score]').forEach(sel => {
                sel.onchange = (e) => {
                    const id = e.target.getAttribute('data-osce-score');
                    const obs = App.osce.activeObserver || 'observer1';
                    scoreOSCEItem(id, parseInt(e.target.value, 10), { source: obs });
                    renderObserverPanel();
                };
            });
            body.querySelectorAll('button[data-osce-crit]').forEach(b => {
                b.onclick = (e) => {
                    const key = e.target.getAttribute('data-osce-crit');
                    applyOSCECriticalError(key, !App.osce.criticalErrors[key]);
                    renderObserverPanel();
                };
            });
            body.querySelectorAll('textarea[data-osce-note]').forEach(t => {
                t.oninput = (e) => {
                    const id = e.target.getAttribute('data-osce-note');
                    if (App.osce.items[id]) App.osce.items[id].notes = e.target.value;
                };
            });
        }

        /* --- Study meta / API key --- */
        function openSettingsModal() {
            $('#sm-studentId').value = App.studyMeta.studentId || '';
            $('#sm-group').value = App.studyMeta.group || 'intervention';
            $('#sm-timePoint').value = App.studyMeta.timePoint || 'pre';
            $('#sm-site').value = App.studyMeta.site || '';
            $('#sm-consent').checked = !!App.studyMeta.consent;
            try { $('#sm-apikey').value = sessionStorage.getItem('NK_GEMINI_KEY') || ''; } catch(e){}
            $('#osce-settings-modal').classList.add('visible');
        }
        function saveSettingsModal() {
            App.studyMeta.studentId = $('#sm-studentId').value.trim();
            App.studyMeta.group = 'intervention';
            App.studyMeta.timePoint = $('#sm-timePoint').value;
            App.studyMeta.site = $('#sm-site').value.trim();
            App.studyMeta.consent = $('#sm-consent').checked;
            try {
                const k = $('#sm-apikey').value.trim();
                if (k) sessionStorage.setItem('NK_GEMINI_KEY', k);
                else sessionStorage.removeItem('NK_GEMINI_KEY');
            } catch(e){}
            App.mode = 'tutor';
            $('#osce-settings-modal').classList.remove('visible');
            toast('success', 'Kaydedildi', 'Çalışma ayarları güncellendi.');
            renderTopbar && renderTopbar();
        }

        /* --- Listener bootstrap (DOM ready'de bağlanır) --- */
        function bindOSCEUIHandlers() {
            if (__osceDeprecatedGuard("bindOSCEUIHandlers")) return;
            $('#osce-rat-close').onclick = closeOSCERationale;
            $('#osce-rat-skip').onclick = closeOSCERationale;
            $('#osce-rat-submit').onclick = submitOSCERationale;
            $('#osce-obs-close').onclick = () => toggleObserverPanel(false);
            $('#osce-obs-reset').onclick = () => {
                if (!confirm('Tüm akademik skorlar sıfırlansın mı?')) return;
                initOSCEPHDYOScore();
                renderObserverPanel();
                toast('info', 'Sıfırlandı', 'GCKL kontrol listesi skorları yeniden başlatıldı.');
            };
            $('#osce-obs-finalize').onclick = () => {
                calculateFinalOSCEPHDYOScore();
                App.studyMeta.completedAt = Date.now();
                toast('success', 'Kilitlendi', 'Akademik skor: ' + App.osce.finalTotal + '/100');
                renderObserverPanel();
            };
            $('.osce-obs-tabs').addEventListener('click', (e) => {
                const t = e.target.closest('.osce-obs-tab'); if (!t) return;
                $all('.osce-obs-tab').forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                App.osce.activeObserver = t.getAttribute('data-obs');
            });
            $('#osce-settings-close').onclick = () => $('#osce-settings-modal').classList.remove('visible');
            $('#osce-settings-save').onclick = saveSettingsModal;
            // Ctrl/Cmd+, → settings
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd+, → settings
                if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                    e.preventDefault();
                    openSettingsModal();
                }
            });
        }

        // --- Otomatik puanlama köprüleri (öğrenci aksiyonu → sistem puanı) ---
        // Kural:
        //   davranış doğru + gerekçe yeterli → madde tam puan
        //   davranış doğru + gerekçe eksik → kısmi puan (taban %60, gerekçe oranıyla %100'e açılır)
        //   davranış yok → 0 puan + (varsa) kritik hata bayrağı
        // Sistem puanı gözlemci puanını ezmez; ayrı kaynaklarda saklanır.
        function recomputeSystemScoreForItem(itemId) {
            const item = osceGetItem(itemId);
            const rec = App.osce.items[itemId];
            if (!item || !rec) return;
            // KÖPRÜ TABANLI değerlendirme — kanıt yoksa sistem puanı null kalır.
            const ev = evaluateOSCEItemFromBridge(itemId);
            if (ev) {
                rec.evidence = ev.evidence;
                rec.negativeEvidence = ev.negativeEvidence;
                rec.missingEvidence = ev.missingEvidence;
                rec.timingStatus = ev.timingStatus;
                rec.performanceCode = ev.performanceCode;
                rec.performanceLabel = ev.performanceLabel;
                rec.requiresObserver = ev.requiresObserver;
                if (ev.systemScore === null) {
                    rec.system = null;
                    // earned'ı observer kaynağı varsa o belirler; yoksa 0 kalsın
                    if (rec.observer1 !== null) { rec.earned = rec.observer1; rec.source = 'observer1'; }
                    else if (rec.observer2 !== null) { rec.earned = rec.observer2; rec.source = 'observer2'; }
                    else { rec.earned = 0; rec.source = null; }
                    recalcOSCETotals();
                    return;
                }
                scoreOSCEItem(itemId, ev.systemScore, { source: 'system', note: 'bridge-evidence' });
                return;
            }
            // Köprü yoksa: eski davranış (geriye uyum)
            let sys = 0;
            if (rec.behaviorOk) {
                if (rec.rationaleOk) sys = item.max;
                else if (rec.rationale) sys = Math.round(item.max * (0.60 + 0.40 * Math.max(0, Math.min(1, rec.rationale.ratio || 0))));
                else sys = Math.round(item.max * 0.60);
            }
            scoreOSCEItem(itemId, sys, { source: 'system', note: 'fallback' });
        }

        // Kanıt değişikliklerinde tüm maddeleri yeniden hesapla (semptom/tanı onayı vb.)
        function recomputeAllOSCEItems() {
            if (__osceDeprecatedGuard("recomputeAllOSCEItems")) return;
            if (!App.osce || !App.osce.items) return;
            Object.keys(App.osce.items).forEach(id => {
                try { recomputeSystemScoreForItem(id); } catch(e) {}
            });
        }

        function autoScoreOSCEFromTask(taskId, ok, meta) {
            if (__osceDeprecatedGuard("autoScoreOSCEFromTask")) return;
            // taskId hangi soyut tag'a karşılık? itemTaskTags'tan ters arama
            const item = OSCE_PHDYO.items.find(it => {
                const tag = OSCE_PHDYO.itemTaskTags[it.id];
                if (!tag) return false;
                const ids = osceResolveTaskIds(tag, App.currentPatient);
                return ids.includes(taskId);
            });
            if (!item) return;
            const rec = App.osce.items[item.id];
            if (!rec) return;
            rec.behaviorOk = !!ok;
            if (!ok && item.criticalKey) applyOSCECriticalError(item.criticalKey, true, { taskId });
            recomputeSystemScoreForItem(item.id);
            recordAction('auto-task', { taskId, itemId: item.id, ok, meta: meta || null });
        }

        function autoScoreOSCEFromSymptom(phase, ok, meta) {
            if (__osceDeprecatedGuard("autoScoreOSCEFromSymptom")) return;
            // Vital/baseline maddesi (PRE-8, INT-8/POST-3) için referans
            const map = { preop: 'PRE-8', intraop: 'INT-8', postop: 'POST-3' };
            const itemId = map[phase];
            if (!itemId || !App.osce.items[itemId]) return;
            const rec = App.osce.items[itemId];
            rec.behaviorOk = !!ok;
            recomputeSystemScoreForItem(itemId);
            recordAction('auto-symptom', { phase, ok, itemId, meta: meta || null });
        }

        function autoScoreOSCEFromDiagnosis(phase, ok, meta) {
            if (__osceDeprecatedGuard("autoScoreOSCEFromDiagnosis")) return;
            // Tanı seçimi: doğrudan bir maddeye eşlemek yerine reasoning olarak
            // aksiyon kaydı bırakılır; observer gözlem için kullanır.
            recordAction('auto-diagnosis', { phase, ok, meta: meta || null });
        }

        function autoScoreOSCEFromReasoning(qid, correct, meta) {
            if (__osceDeprecatedGuard("autoScoreOSCEFromReasoning")) return;
            // Reasoning sorusu: ölçeğin RQ'larıyla doğrudan eşleşmiyor olabilir;
            // aksiyon kaydı + observer'a ipucu olarak bırakılır.
            recordAction('auto-reasoning', { qid, correct, meta: meta || null });
        }

        // --- Rationale (gerekçelendirme): kanıt / gating; bonus DEĞİLDİR ---
        // Yanıt anahtar kavramları yeterince karşılarsa rationaleOk=true → madde tam puana çıkabilir.
        // Eksikse rationaleOk=false → madde kısmi puanda kalır.
        function scoreOSCERationale(itemId, text) {
            const item = osceGetItem(itemId);
            if (!item || !item.rq) return { hits: [], total: 0, ratio: 0, ok: false };
            const t = (text || '').toLocaleLowerCase('tr-TR');
            const hits = [];
            (item.rq.expected || []).forEach(kw => {
                const k = kw.toLocaleLowerCase('tr-TR');
                if (k && t.includes(k)) hits.push(kw);
            });
            const total = (item.rq.expected || []).length || 1;
            const ratio = hits.length / total;
            // Yeterlilik eşiği: anahtarların en az %60'ı yakalandıysa gerekçe yeterli.
            const ok = ratio >= 0.60;
            const rec = App.osce.items[itemId];
            if (rec) {
                rec.rationale = { text: text || '', hits, total, ratio, ts: Date.now() };
                rec.rationaleOk = ok;
                recomputeSystemScoreForItem(itemId);
            }
            App.osce.rqAnswers[item.rq.id] = { itemId, text: text || '', hits, total, ratio, ok, ts: Date.now() };
            recordAction('rationale', { itemId, hits, ratio, ok });
            return { hits, total, ratio, ok };
        }

        /* ===================== UTIL ===================== */
        function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
        function $(sel) { return document.querySelector(sel); }
        function $all(sel) { return Array.from(document.querySelectorAll(sel)); }
        function showScreen(id) { $all('.screen').forEach(s => s.classList.remove('active')); $('#' + id).classList.add('active'); }
        
        let toastTimer = null;
        function toast(kind, title, msg) { 
            const t = $('#toast');
            t.className = 'toast visible ' + kind;
            t.innerHTML = `<div class="tt">${title}</div><div>${msg}</div>`;
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => t.classList.remove('visible'), 3800); 
        }

        function shuffle(arr) {
            if (!arr) return [];
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        // --- Zamanlayıcı Fonksiyonları ---
        function formatTime(seconds) {
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        function startTimer() {
            clearInterval(App.timerInterval);
            App.timerInterval = setInterval(() => {
                App.totalSeconds++;
                if (App.currentRoom && App.phaseSeconds[App.currentRoom] !== undefined) {
                    App.phaseSeconds[App.currentRoom]++;
                }
                const timerEl = document.getElementById('tb-timer');
                if(timerEl) timerEl.textContent = formatTime(App.totalSeconds);
            }, 1000);
        }

        function stopTimer() {
            clearInterval(App.timerInterval);
        }
        // ---------------------------------------

        /* ===================== HOME ===================== */
        function setMode(m) {
            App.mode = 'tutor';
            const tutorBtn = $('#home-mode-tutor');
            if (tutorBtn) tutorBtn.classList.add('active');
        }

        /* ===================== CASE SELECT ===================== */
        function openCaseSelect() { showScreen('case-select-screen'); renderCases(); }

        function renderCases() {
            const q = ($('#cs-search').value || '').toLowerCase().trim();
            const spec = $('#cs-spec').value;
            const diff = $('#cs-diff').value;
            const status = $('#cs-status').value;
            const filtered = ALL_CASES.filter(c => {
                if (spec !== 'all' && c.specialty !== spec) return false;
                if (diff !== 'all' && String(c.difficulty) !== diff) return false;
                if (status !== 'all' && c.status !== status) return false;
                if (q) {
                    const hay = (c.name + ' ' + c.surgery + ' ' + c.specialtyLabel + ' ' + c.riskTags.join(' ')).toLowerCase();
                    if (!hay.includes(q)) return false;
                }
                return true;
            });
            const fullCases = filtered.filter(c => c.status === 'full');
            const demoCases = filtered.filter(c => c.status === 'demo');
            const body = $('#cs-body');
            const state = $('#cs-filter-state');
            body.innerHTML = '';
            const parts = [];
            if (spec && spec !== 'all') {
                const specObj = SPECIALTIES.find(s => s.id === spec);
                if (specObj) parts.push(specObj.name);
            }
            if (diff !== 'all') parts.push('Zorluk ' + '★'.repeat(parseInt(diff, 10)));
            if (status === 'full') parts.push('Tam kapsamlı');
            else if (status === 'demo') parts.push('Demo');
            if (q) parts.push('Arama: ' + q);
            state.textContent = filtered.length + ' vaka · ' + (parts.length ? parts.join(' · ') : 'Tüm filtreler');
            if (filtered.length === 0) {
                body.appendChild(el('div', 'empty-state', 'Bu kriterlere uygun aktif vaka bulunmamaktadır. Filtreleri gevşetip yeniden deneyin.'));
                return;
            }
            if (fullCases.length) {
                const sec = el('div');
                sec.appendChild(el('div', 'cs-section-title', `Tam Kapsamlı Ana Vakalar <span class="count">${fullCases.length}</span>`));
                const grid = el('div', 'case-grid');
                fullCases.forEach(c => grid.appendChild(buildCaseCard(c)));
                sec.appendChild(grid);
                body.appendChild(sec);
            }
            if (demoCases.length) {
                const sec = el('div');
                sec.appendChild(el('div', 'cs-section-title', `Demo Vakalar <span class="count">${demoCases.length}</span>`));
                const grid = el('div', 'case-grid');
                demoCases.forEach(c => grid.appendChild(buildCaseCard(c)));
                sec.appendChild(grid);
                body.appendChild(sec);
            }
        }

        function buildCaseCard(c) {
            const card = el('div', 'case-card ' + c.status);
            if (c.status === 'full') card.appendChild(el('div', 'badge-full', 'TAM KAPSAMLI'));

            const top = el('div', 'case-card-top');
            const badges = el('div', 'badge-row');
            badges.appendChild(el('span', 'tag t-spec', c.specialtyLabel));
            badges.appendChild(el('span', `tag t-diff-${c.difficulty}`, 'Zorluk ' + '★'.repeat(c.difficulty)));
            top.appendChild(badges);
            card.appendChild(top);

            card.appendChild(el('div', 'case-name', c.name));
            card.appendChild(el('div', 'case-meta', `${c.age} yaş · ${c.gender}`));
            card.appendChild(el('div', 'case-surgery', c.surgery));

            const statusLine = el('div', 'case-status-line');
            statusLine.appendChild(el('span', 'case-mini', c.status === 'full' ? 'Tam vaka akışı' : 'Kısa demo akışı'));
            statusLine.appendChild(el('span', 'case-mini', `${c.estMin} dk tahmini süre`));
            card.appendChild(statusLine);

            const tags = el('div', 'case-tags');
            c.riskTags.slice(0, 4).forEach(t => tags.appendChild(el('span', 'tag t-risk', t)));
            card.appendChild(tags);

            const foot = el('div', 'case-foot');
            foot.appendChild(el('span', '', `${c.status === 'full' ? 'Üç fazlı tam kapsamlı vaka' : 'Hızlı eğitim demosu'}`));
            foot.appendChild(el('span', 'launch', '↗ Başlat'));
            card.appendChild(foot);

            card.onclick = () => selectPatient(c.id);
            return card;
        }

        function resetScoreTracker() {
            App.scores = {};
            Object.keys(SCORE_CATEGORIES).forEach(k => {
                App.scores[k] = { earned: 0, max: 0 };
            });
            App.phaseScores = { preop: { earned: 0, max: 0 }, intraop: { earned: 0, max: 0 }, postop: { earned: 0, max: 0 } };
        }

        function calculateCaseMaximums(patient) {
            resetScoreTracker();
            
            ['preop', 'intraop', 'postop'].forEach(room => {
                const phase = patient[room];
                if (!phase) return;

                // 1. Symptoms (Correct symptoms count * 5)
                const sympMax = (phase.correctSymptoms || []).length * 5;
                if (sympMax > 0) {
                    ['clinicalAssessment', 'prioritisation', 'surgicalNursingKnowledge'].forEach(cat => {
                        App.scores[cat].max += sympMax;
                    });
                    App.phaseScores[room].max += sympMax;
                }

                // 2. Diagnoses (Max 29)
                if (phase.diagnoses && phase.diagnoses.length > 0) {
                    ['nursingDiagnosisPerformance', 'prioritisation', 'surgicalNursingKnowledge', 'clinicalReasoning'].forEach(cat => {
                        App.scores[cat].max += 29;
                    });
                    App.phaseScores[room].max += 29;
                }

                // 3. Tasks
                (phase.tasks || []).forEach(t => {
                    (t.categories || []).forEach(cat => {
                        App.scores[cat].max += t.score;
                    });
                    App.phaseScores[room].max += t.score;
                });

                // 4. GCKL karar soruları dinamik puanlanır.
                // Çoktan seçmeli ve doğru/yanlış sorular yanıtlandıkça klinik akıl yürütme, checklist ve cerrahi bilgi puanına eklenir.

                // 5. Normal Events
                (phase.events || []).forEach(e => {
                    ['prioritisation', 'patientSafety'].forEach(cat => {
                        App.scores[cat].max += 12;
                    });
                    App.phaseScores[room].max += 12;
                });
                
                App.phaseScores[room].max += 10; // SOAP
                App.phaseScores[room].max += 5; // Doc chat
                App.phaseScores[room].max += (DIALOG_QUESTIONS.length * 4) / 3; // Split dialogue evenly
            });

            // 6. Dialogue (9 questions total * 4 points)
            ['communication', 'patientCentredCare'].forEach(cat => {
                App.scores[cat].max += (DIALOG_QUESTIONS.length * 4);
            });

            // 7. AI Features (Discharge, SOAP, Doctor Chat)
            ['communication', 'patientCentredCare'].forEach(cat => {
                App.scores[cat].max += 5; // Discharge
            });
            ['communication', 'clinicalAssessment'].forEach(cat => {
                App.scores[cat].max += 30; // 3 phases * 10 pts for SOAP
            });
            ['communication', 'patientSafety'].forEach(cat => {
                App.scores[cat].max += 15; // 3 phases * 5 pts for Doctor Chat
            });
            
            App.phaseScores['postop'].max += 5; // Discharge
        }

        function addScore(categories, earnedPoints, maxPointsToAdd = 0) {
            categories.forEach(cat => {
                if(App.scores[cat]) {
                    App.scores[cat].earned += earnedPoints;
                    if (App.scores[cat].earned < 0) App.scores[cat].earned = 0;
                    App.scores[cat].max += maxPointsToAdd;
                }
            });
        }
        
        function addPhaseScore(phase, earned, maxToAdd = 0) {
            if (App.phaseScores[phase]) {
                App.phaseScores[phase].earned += earned;
                if (App.phaseScores[phase].earned < 0) App.phaseScores[phase].earned = 0;
                App.phaseScores[phase].max += maxToAdd;
            }
        }

        function selectPatient(pid) {
            App.currentPatient = CASES[pid];
            App.currentRoom = 'preop';
            // Eğitmen/düzenleme ayarı: intraoperatif ve postoperatif faz kilidi açık.
            // Postop alanı geliştirme/düzenleme için doğrudan erişilebilir; GCKL/görev puanlama yapısı korunur.
            App.tempPostopUnlock = true;
            App.unlockedRooms = { preop: true, intraop: true, postop: true };
            App.completedTasks = [];
            App.taskStates = {};  // v6 state machine — yeni vakada sıfırla
            App.selectedDiagnoses = { preop: [], intraop: [], postop: [] };
            App.diagnosesConfirmed = { preop: false, intraop: false, postop: false };
            App.selectedSymptoms = { preop: [], intraop: [], postop: [] };
            App.symptomsConfirmed = { preop: false, intraop: false, postop: false };
            App.eventHandled = {};
            App.reasoningAnswered = {};
            App.askedQuestions = [];
            App.doctorChatHistory = [];
            App.familyChatHistory = []; // YENİ
            App.debriefChatHistory = []; // YENİ
            App.phaseDebriefSeen = {};
            App.phaseDebriefLog = {};
            App.feedbackEntries = [];
            App.patientCommunication = { preop: {}, intraop: {}, postop: {} };
            App.microDecisionResults = {};
            App.intraopRoleFocus = 'all';
            App.preopRoleFocus = 'all';
            App.postopRoleFocus = 'all';
            App.focusMode = 'task';
            App.cameraFocus = 'phase';
            App.criticalSafetyEvents = [];
            App.criticalPenaltyApplied = {};
            App.leftTab = 'patient';
            
            // --- Timer reset ---
            stopTimer();
            App.totalSeconds = 0;
            App.phaseSeconds = { preop: 0, intraop: 0, postop: 0 };
            const timerEl = document.getElementById('tb-timer');
            if(timerEl) timerEl.textContent = "00:00";
            // -------------------------

            calculateCaseMaximums(App.currentPatient);
            initOSCEPHDYOScore();
            App.studyMeta.startedAt = Date.now();
            recordAction('case-start', { caseId: pid, mode: 'tutor', role: App.role });
            
            showScreen('sim-screen');
            renderTopbar();
            renderPhaseTabs();
            renderLeftPanel();
            renderRightPanel();
            renderDialogue();
            initThree();
            startTimer(); // Timer başlat
        }

        /* ===================== TOPBAR ===================== */
        function renderTopbar() {
            const modeLabel = 'EĞİTİM MODU';
            $('#tb-mode').textContent = modeLabel;
            $('#tb-ai').textContent = App.aiMode ? 'AÇIK (GEMINI)' : 'KAPALI';
            $('#tb-ai').className = 'v tag-ai ' + (App.aiMode ? 'on' : 'off');
            $('#tb-toggle-ai').textContent = App.aiMode ? '✨ AI Hasta (AÇIK)' : 'AI Hasta (KAPALI)';
            $('#tb-patient').textContent = App.currentPatient.name + ' · ' + App.currentPatient.shortSurgery;
            const phaseMap = { preop: 'PREOPERATİF', intraop: 'İNTRAOPERATİF', postop: 'POSTOPERATİF' };
            $('#tb-phase').textContent = phaseMap[App.currentRoom];
            const total = computeTotalScore();
            $('#tb-score').textContent = total.percent + '%';
        }



        /* ===================== PHASE-END DEBRIEFING ENGINE ===================== */
        function getPhaseLabelTR(phase) {
            return ({ preop:'Preoperatif', intraop:'İntraoperatif', postop:'Postoperatif / PACU', report:'Rapor' })[phase] || phase;
        }
        function getNextPhaseFocus(phase) {
            const profile = getPatientProfileKey();
            const rows = {
                preop: ['Kimlik-onam-bölge doğrulamasını kapatmadan ameliyathaneye geçme.', 'NPO ve tetkik/kan hazırlığını ekiple netleştir.', 'Ekip iletişimini kısa, açık ve kayıtla uyumlu tut.'],
                intraop: ['Time-out ekip doğrulamasını tamamla.', 'Steril alan, sayım ve rol ayrımını birlikte düşün.', 'Anestezi-monitörizasyon ve cerrahi alanı aynı klinik tablo içinde izle.'],
                postop: ['Erken bozulma bulgularını ağrı, dren, solunum ve vital bulgularla ilişkilendir.', 'Hasta/aile eğitimini teach-back ile doğrula.', 'Taburculuk kararı öncesi profil alarm bulgularını açıkça kapat.']
            };
            const profileFocus = {
                cabg: 'CABG odağı: sternum koruma, göğüs tüpü drenajı, deliryum, hipotermi ve ritim/hemodinami.',
                ortho: 'Ortopedi odağı: nörovasküler takip, pin bakımı, enfeksiyon, kompartman riski ve güvenli mobilizasyon.',
                chole: 'Kolesistektomi odağı: PONV, omuz ağrısı, yara bakımı, ERAS/beslenme ve safra kaçağı alarm bulguları.'
            }[profile] || 'Profil odağı: cerrahi güvenlik, ağrı, mobilizasyon ve taburculuk eğitimi.';
            return [profileFocus].concat(rows[phase] || []);
        }
        function getPhaseDebriefData(phase) {
            const p = App.currentPatient || {};
            const tasks = p[phase]?.tasks || [];
            const completed = new Set(App.completedTasks || []);
            const done = tasks.filter(t => completed.has(t.id));
            const missedCritical = tasks.filter(t => t.critical && !completed.has(t.id));
            const phaseScore = App.phaseScores?.[phase] || { earned:0, max:0 };
            const pct = phaseScore.max ? Math.max(0, Math.min(100, Math.round((phaseScore.earned / phaseScore.max) * 100))) : 0;
            const decisions = Object.keys(App.microDecisionResults || {})
                .filter(k => k.includes(`:${phase}:`))
                .map(k => App.microDecisionResults[k]);
            const correctDecisions = decisions.filter(d => d.correct).length;
            const criticalEvents = (App.criticalSafetyEvents || []).filter(e => e.phase === phase);
            const good = [];
            done.filter(t => t.critical).slice(0,4).forEach(t => good.push(t.label));
            if (correctDecisions) good.push(`Seçimli klinik karar: ${correctDecisions}/${decisions.length} doğru`);
            if (!criticalEvents.length && done.length) good.push('Bu fazda kayıtlı kritik güvenlik uyarısı oluşmadı.');
            const missed = [];
            missedCritical.slice(0,5).forEach(t => missed.push(t.label));
            criticalEvents.slice(-4).forEach(e => missed.push(e.error || e.title));
            if (!missed.length) missed.push('Kritik eksik görünmüyor; sonraki fazda aynı disiplini koru.');
            const decisionLines = decisions.length ? decisions.slice(-5).map(d => `${d.correct ? 'Doğru' : 'Yanlış'} seçim: ${d.selected}`) : ['Bu fazda seçimli mikro karar kaydı yok. Nesne senaryolarını kullanarak karar verme verisi üret.'];
            return { phase, pct, totalTasks: tasks.length, doneCount: done.length, missedCritical, decisions, correctDecisions, criticalEvents, good, missed, decisionLines, next: getNextPhaseFocus(phase) };
        }
        function shouldShowPhaseDebrief(phase, target) {
            if (!App.currentPatient) return false;
            const key = `${App.currentPatient.id}:${phase}:${target || 'next'}`;
            return !App.phaseDebriefSeen?.[key];
        }
        function markPhaseDebriefSeen(phase, target, data) {
            App.phaseDebriefSeen = App.phaseDebriefSeen || {};
            App.phaseDebriefLog = App.phaseDebriefLog || {};
            const key = `${App.currentPatient.id}:${phase}:${target || 'next'}`;
            App.phaseDebriefSeen[key] = true;
            App.phaseDebriefLog[phase] = data || getPhaseDebriefData(phase);
        }
        function openPhaseDebriefModal(phase, target) {
            const m = document.getElementById('phase-debrief-modal');
            if (!m) return false;
            const data = getPhaseDebriefData(phase);
            $('#phase-debrief-title').textContent = `${getPhaseLabelTR(phase)} faz sonu değerlendirmesi`;
            $('#phase-debrief-sub').textContent = target === 'report'
                ? 'Rapor öncesi son güvenlik, karar verme ve profil odağı kontrolü.'
                : `${getPhaseLabelTR(target)} fazına geçmeden önce eksikleri gör ve klinik odağı netleştir.`;
            $('#phase-debrief-metrics').innerHTML = [
                ['%', data.pct, 'Faz puanı'],
                [`${data.doneCount}/${data.totalTasks}`, '', 'Görev'],
                [`${data.missedCritical.length}`, '', 'Eksik kritik'],
                [`${data.correctDecisions}/${data.decisions.length || 0}`, '', 'Karar']
            ].map(([n, extra, l]) => `<div class="phase-debrief-metric"><div class="n">${n}${extra || ''}</div><div class="l">${l}</div></div>`).join('');
            $('#phase-debrief-good').innerHTML = data.good.map(x => `<li>${microSafe(x)}</li>`).join('');
            $('#phase-debrief-missed').innerHTML = data.missed.map(x => `<li class="${/kritik|hata|eksik|uyarı/i.test(x) ? 'miss' : 'warn'}">${microSafe(x)}</li>`).join('');
            $('#phase-debrief-decisions').innerHTML = data.decisionLines.map(x => `<li>${microSafe(x)}</li>`).join('');
            $('#phase-debrief-next').innerHTML = data.next.map(x => `<li>${microSafe(x)}</li>`).join('');
            $('#phase-debrief-close').onclick = () => m.classList.remove('visible');
            $('#phase-debrief-stay').onclick = () => m.classList.remove('visible');
            $('#phase-debrief-continue').onclick = () => {
                markPhaseDebriefSeen(phase, target, data);
                m.classList.remove('visible');
                if (target === 'report') showReport();
                else switchRoom(target, { skipDebrief:true });
            };
            m.classList.add('visible');
            return true;
        }
        function renderPhaseDebriefReportSummary() {
            const box = $('#rd-phase-debrief');
            if (!box) return;
            const phases = ['preop','intraop','postop'];
            box.innerHTML = `<div class="phase-report-grid">${phases.map(ph => {
                const data = App.phaseDebriefLog?.[ph] || getPhaseDebriefData(ph);
                const miss = data.missedCritical.length;
                const dec = `${data.correctDecisions}/${data.decisions.length || 0}`;
                return `<div class="phase-report-card"><b>${getPhaseLabelTR(ph)}</b>Faz puanı: ${data.pct}%<br>Görev: ${data.doneCount}/${data.totalTasks}<br>Eksik kritik: ${miss}<br>Seçimli karar: ${dec}<br><span style="display:block;margin-top:6px;color:#6f8197;">Odak: ${microSafe(data.next[0] || '')}</span></div>`;
            }).join('')}</div>`;
        }

        /* ===================== PHASE TABS ===================== */
        function renderPhaseTabs() {
            const c = $('#phase-tabs');
            c.innerHTML = '';
            [
                { id: 'preop', num: '01', label: 'Preoperatif Oda', copy: 'Hazırlık ve doğrulama' },
                { id: 'intraop', num: '02', label: 'İntraoperatif Alan', copy: 'Ekip ve steril güvenlik' },
                { id: 'postop', num: '03', label: 'Postoperatif / PACU', copy: 'İzlem ve güvenli devir' }
            ].forEach(t => {
                const isUnlocked = App.unlockedRooms?.[t.id] !== false;
                const btn = el('button', 'phase-tab' + (App.currentRoom === t.id ? ' active' : '') + (!isUnlocked ? ' locked' : ''));
                const copy = (t.id === 'postop' && App.tempPostopUnlock) ? 'İzlem ve güvenli devir · düzenlemeye açık' : t.copy;
                btn.innerHTML = `<span class="phase-main"><span class="num">${t.num}</span><span>${t.label}</span></span><span class="phase-copy">${copy}</span>`;
                btn.onclick = () => { switchRoom(t.id); };
                c.appendChild(btn);
            });
        }

        function switchRoom(rid, opts = {}) { 
            const order = { preop: 0, intraop: 1, postop: 2 };
            const leaving = App.currentRoom;
            const tempUnlockPreopToIntraop = !!App.tempIntraopUnlock && leaving === 'preop' && rid === 'intraop';
            const tempUnlockToPostop = !!App.tempPostopUnlock && rid === 'postop';
            const roomUnlocked = App.unlockedRooms?.[rid] !== false || tempUnlockToPostop;
            if (!roomUnlocked) {
                showSceneReaction('Bu faz kilitli. Önce önceki fazın kritik GCKL/görevlerini tamamla.', 'warn');
                return;
            }
            if (rid !== App.currentRoom && (order[rid] ?? 0) > (order[App.currentRoom] ?? 0)) {
                const blocker = (tempUnlockPreopToIntraop || tempUnlockToPostop) ? null : getPhaseCriticalBlocker(App.currentRoom);
                if (blocker) {
                    showCriticalSafetyError(blocker);
                    return;
                }
                if (!tempUnlockToPostop && !opts.skipDebrief && shouldShowPhaseDebrief(leaving, rid)) {
                    openPhaseDebriefModal(leaving, rid);
                    return;
                }
            }
            App.currentRoom = rid;
            App.cameraFocus = 'phase';
            App.askedQuestions = [];
            renderTopbar();
            renderPhaseTabs();
            renderLeftPanel();
            renderRightPanel();
            renderDialogue();
            buildSceneForRoom(); 
        }

        /* ===================== LEFT PANEL ===================== */
        function renderLeftPanel() {
            const head = $('#left-tabs');
            head.innerHTML = '';
            ['patient', 'symptoms', 'diag'].forEach(t => {
                const labels = { patient: 'Hasta Dosyası', symptoms: 'Semptomlar', diag: 'Hemşirelik Tanıları' };
                const b = el('button', 'tab-btn' + (App.leftTab === t ? ' active' : ''), labels[t]);
                b.onclick = () => { App.leftTab = t; renderLeftPanel(); };
                head.appendChild(b);
            });
            const body = $('#left-body');
            body.innerHTML = '';
            if (App.leftTab === 'patient') body.appendChild(buildPatientCard(App.currentPatient));
            else if (App.leftTab === 'symptoms') body.appendChild(buildSymptomPanel());
            else body.appendChild(buildDiagnosisPanel());
        }

        function buildPatientCard(p) {
            const w = el('div');
            const id = el('div', 'id-card');
            id.innerHTML = `<div class="row"><span class="k">Ad</span><span class="v">${p.name}</span></div><div class="row"><span class="k">Yaş / Cinsiyet</span><span class="v">${p.age} · ${p.gender}</span></div><div class="row"><span class="k">MRN</span><span class="v">${p.identity.mrn}</span></div><div class="row"><span class="k">Kan Grubu</span><span class="v">${p.identity.blood}</span></div>`;
            w.appendChild(id);
            w.appendChild(el('div', 'section-title-sm', 'Cerrahi'));
            const surg = el('div', 'id-card');
            surg.innerHTML = `<div class="row"><span class="k">Branş</span><span class="v">${p.specialtyLabel}</span></div><div class="row"><span class="k">Planlanan</span><span class="v">${p.surgery}</span></div>`;
            w.appendChild(surg);
            w.appendChild(el('div', 'section-title-sm', 'Tıbbi Öykü'));
            const hx = el('ul', 'list-clean');
            p.history.forEach(h => hx.appendChild(el('li', '', h)));
            w.appendChild(hx);
            w.appendChild(el('div', 'section-title-sm', 'Alerji'));
            const al = el('ul', 'list-clean');
            al.appendChild(el('li', 'allergy', p.allergy || '—'));
            w.appendChild(al);
            w.appendChild(el('div', 'section-title-sm', 'Yaşam Bulguları'));
            const vg = el('div', 'vital-grid');
            const v = p.vitals;
            vg.appendChild(buildVital('TA', v.bp, 'mmHg'));
            vg.appendChild(buildVital('NB', v.hr, 'atım/dk'));
            vg.appendChild(buildVital('SS', v.rr, '/dk'));
            vg.appendChild(buildVital('SpO₂', v.spo2 + '%', ''));
            vg.appendChild(buildVital('T', v.temp + '°', 'C'));
            w.appendChild(vg);
            w.appendChild(el('div', 'section-title-sm', 'Laboratuvar'));
            const lab = el('ul', 'list-clean');
            p.labs.forEach(l => lab.appendChild(el('li', '', l)));
            w.appendChild(lab);
            w.appendChild(el('div', 'section-title-sm', 'Hemşirelik Riskleri'));
            const r = el('ul', 'list-clean');
            p.risks.forEach(rr => r.appendChild(el('li', 'risk', rr)));
            w.appendChild(r);
            w.appendChild(el('div', 'section-title-sm', 'Hemşire Eğitim Planı'));
            w.appendChild(buildEducationSection(p));
            
            // --- AI Lab & Risk Analizi ---
            const aiContainer = el('div');
            aiContainer.style.marginTop = '16px';
            aiContainer.style.borderTop = '1px dashed var(--line-soft)';
            aiContainer.style.paddingTop = '16px';
            
            const aiLabBtn = el('button', 'rd-action ai-action', '✨ AI Lab & Risk Analizi');
            aiLabBtn.style.width = '100%';
            aiLabBtn.style.display = App.aiMode ? 'block' : 'none';
            
            const aiLabRes = el('div', 'ai-result-box');
            
            aiLabBtn.onclick = async () => {
                aiLabBtn.textContent = '✨ Analiz ediliyor...';
                aiLabBtn.disabled = true;
                const prompt = `Sen uzman bir cerrahi hemşiresisin. Hasta: ${p.name}, Yaş: ${p.age}, Cerrahi: ${p.surgery}. Özgeçmiş: ${p.history.join(', ')}. Lab: ${p.labs.join(', ')}. Yaşam Bulguları: TA ${p.vitals.bp}, Nabız ${p.vitals.hr}, Ateş ${p.vitals.temp}. Bu hastanın laboratuvar ve klinik durumuna göre ameliyatı için en büyük 2 hemşirelik riskini ve dikkat edilmesi gerekenleri kısa ve öz şekilde (maks 3 cümle) açıkla.`;
                const res = await callGeminiAPI(prompt);
                aiLabRes.innerHTML = `<b style="color:var(--violet)">✨ AI Klinik Analiz:</b><br><div style="margin-top:6px; line-height:1.5">${res.replace(/\n/g, '<br>')}</div>`;
                aiLabRes.style.display = 'block';
                aiLabBtn.style.display = 'none';
            };
            
            aiContainer.appendChild(aiLabBtn);
            aiContainer.appendChild(aiLabRes);
            w.appendChild(aiContainer);

            // --- ✨ AI İlaç & Etkileşim Kontrolü ---
            if (App.aiMode) {
                const aiDrugBtn = el('button', 'rd-action ai-action', '✨ AI İlaç & Etkileşim Kontrolü');
                aiDrugBtn.style.width = '100%';
                aiDrugBtn.style.marginTop = '8px';
                const aiDrugRes = el('div', 'ai-result-box');
                
                aiDrugBtn.onclick = async () => {
                    aiDrugBtn.textContent = '✨ Kontrol ediliyor...';
                    aiDrugBtn.disabled = true;
                    const prompt = `Sen kıdemli bir klinik farmakolog ve cerrahi hemşiresisin. Hasta: ${p.name}, Yaş: ${p.age}, Cerrahi: ${p.surgery}. Özgeçmiş/İlaçlar: ${p.history.join(', ')}. Alerji: ${p.allergy}. Perioperatif süreçte kullanılacak muhtemel ilaçlar (anestezikler, analjezikler, profilaktik antibiyotikler) ile hastanın mevcut durumu ve alerjisi arasında ne gibi kontrendikasyonlar veya etkileşim riskleri olabilir? Madde imleri ile çok kısa ve hayati uyarılar yaz.`;
                    const res = await callGeminiAPI(prompt);
                    aiDrugRes.innerHTML = `<b style="color:var(--violet)">✨ AI İlaç Etkileşim Uyarısı:</b><br><div style="margin-top:6px; line-height:1.5">${res.replace(/\n/g, '<br>')}</div>`;
                    aiDrugRes.style.display = 'block';
                    aiDrugBtn.style.display = 'none';
                };
                aiContainer.appendChild(aiDrugBtn);
                aiContainer.appendChild(aiDrugRes);
            }

            // --- ✨ AI Ameliyat Raporu Analizi ---
            if (App.aiMode && (App.currentRoom === 'intraop' || App.currentRoom === 'postop')) {
                const opNoteBtn = el('button', 'rd-action ai-action', '✨ AI Ameliyat Raporu (Cerrahi Not) İste');
                opNoteBtn.style.width = '100%';
                opNoteBtn.style.marginTop = '8px';
                const opNoteRes = el('div', 'ai-result-box');
                
                opNoteBtn.onclick = async () => {
                    opNoteBtn.textContent = '✨ Rapor Yazılıyor...';
                    opNoteBtn.disabled = true;
                    const prompt = `Sen uzman bir cerrahsın. ${p.name} isimli hastanın "${p.surgery}" ameliyatını yeni bitirdin veya yapıyorsun. Bu ameliyat için kısa, gerçekçi bir cerrahi operasyon notu (Operative Note) yaz. Ardından, postoperatif bakım yapacak hemşireye yönelik "Kritik Hemşirelik Uyarıları" başlığı altında, bu spesifik ameliyatta yaşananlara dair 3 önemli takip kriteri belirt.`;
                    const res = await callGeminiAPI(prompt);
                    opNoteRes.innerHTML = `<b style="color:var(--violet)">✨ AI Ameliyat Raporu:</b><br><div style="margin-top:6px; line-height:1.5">${res.replace(/\n/g, '<br>')}</div>`;
                    opNoteRes.style.display = 'block';
                    opNoteBtn.style.display = 'none';
                };
                aiContainer.appendChild(opNoteBtn);
                aiContainer.appendChild(opNoteRes);
            }

            return w;
        }

                function eduEscape(v) {
            return String(v ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
        }
        function buildEducationSection(p) {
            const plan = p.educationContent?.patientEducation;
            const wrap = el('div', 'education-plan');
            if (!plan) {
                const empty = el('div', 'edu-card');
                empty.innerHTML = '<div class="eh">Bu vaka için yapılandırılmış hasta eğitimi henüz eklenmemiştir.</div>';
                wrap.appendChild(empty);
                return wrap;
            }
            const defs = [
                ['preop', 'Preoperatif Eğitim'],
                ['postop', 'Postoperatif Eğitim'],
                ['discharge', 'Taburculuk Eğitimi']
            ];
            defs.forEach(([key, label]) => {
                const item = plan[key];
                if (!item) return;
                const btn = el('button', 'edu-card');
                btn.innerHTML = `<div class="edu-card-top"><div class="et">${label}</div><div class="edu-card-arrow">↗</div></div><div class="eh">${eduEscape(item.summary || item.title || '')}</div><div class="em">Öğretim notu · alarm bulguları · teach-back · dokümantasyon</div>`;
                btn.onclick = () => openEducationPlan(key);
                wrap.appendChild(btn);
            });
            return wrap;
        }
        function renderEducationPlanHTML(planItem) {
            if (!planItem) return '<p>Bu eğitim başlığı için içerik bulunamadı.</p>';
            const block = (title, items, icon, extraClass='') => {
                if (!items || !items.length) return '';
                return `<section class="edu-modal-section ${extraClass}"><div class="edu-sec-head"><span class="edu-sec-icon">${icon}</span><h3>${eduEscape(title)}</h3></div><ul>${items.map(i => `<li>${eduEscape(i)}</li>`).join('')}</ul></section>`;
            };
            const counts = [planItem.keyPoints, planItem.nurseScript, planItem.expected, planItem.redFlags, planItem.teachBack, planItem.documentation].filter(x => Array.isArray(x) && x.length).length;
            const introText = eduEscape(planItem.intro || planItem.summary || '');
            return `
                <div class="edu-modal-shell">
                    <section class="edu-modal-hero">
                        <div class="edu-modal-kicker">Yapılandırılmış hasta eğitimi</div>
                        <h2>${eduEscape(planItem.title || 'Hasta Eğitimi')}</h2>
                        <p>${introText}</p>
                        <div class="edu-modal-stats">
                            <span class="edu-stat"><b>${counts}</b> içerik bloğu</span>
                            <span class="edu-stat"><b>${(planItem.teachBack || []).length || 0}</b> teach-back sorusu</span>
                            <span class="edu-stat"><b>${(planItem.redFlags || []).length || 0}</b> alarm bulgusu</span>
                        </div>
                    </section>
                    <div class="edu-modal-grid"> 
                        ${block('Hemşirenin anlatacağı temel başlıklar', planItem.keyPoints, '◎')}
                        ${block('Hastaya verilecek kısa cümleler', planItem.nurseScript, '💬')}
                        ${block('Normal / öngörülen durumlar', planItem.expected, '◌')}
                        ${block('Alarm bulguları · gecikmeden bildirilir', planItem.redFlags, '⚠')}
                        ${block('Teach-back soruları', planItem.teachBack, '✓', 'edu-teachback')}
                        ${block('Hemşire dokümantasyonu', planItem.documentation, '▣')}
                    </div>
                </div>`;
        }
        function getObjEducationKey(obj) {
            const ck = String(obj?.opts?.clinicalKey || '').toLocaleLowerCase('tr-TR');
            const label = String(obj?.label || '').toLocaleLowerCase('tr-TR');
            const room = App.currentRoom;
            const plan = App.currentPatient?.educationContent?.patientEducation || {};
            if (!plan) return null;
            if (ck === 'preop-nurse-3d' || (room === 'preop' && label.includes('hemşire'))) return plan.preop ? 'preop' : null;
            if (ck === 'pacu-nurse-3d' || (room === 'postop' && label.includes('hemşire'))) return plan.postop ? 'postop' : null;
            return null;
        }
        function getObjCallNurseKey(obj) {
            const ck = String(obj?.opts?.clinicalKey || '').toLocaleLowerCase('tr-TR');
            if (ck !== 'family-relative-3d') return null;
            if (App.currentRoom === 'preop') return 'preop-nurse-3d';
            if (App.currentRoom === 'postop') return 'pacu-nurse-3d';
            return null;
        }

        function getPatientProfileKey() {
            const p = App.currentPatient || {};
            const s = `${p.specialty || ''} ${p.specialtyLabel || ''} ${p.surgery || ''} ${p.shortSurgery || ''}`.toLocaleLowerCase('tr-TR');
            if (s.includes('cabg') || s.includes('bypass') || s.includes('kardiyak') || s.includes('kalp')) return 'cabg';
            if (s.includes('ortopedi') || s.includes('tibia') || s.includes('fiksatör') || s.includes('travma')) return 'ortho';
            if (s.includes('kolesistektomi') || s.includes('koles') || s.includes('laparoskopik') || s.includes('safra')) return 'chole';
            return 'general';
        }
        function getPatientProfileLabel() {
            const k = getPatientProfileKey();
            return k === 'cabg' ? 'CABG / kardiyak cerrahi' : (k === 'ortho' ? 'Ortopedi / eksternal fiksatör' : (k === 'chole' ? 'Laparoskopik kolesistektomi' : 'Genel cerrahi'));
        }
        function getProfileObjectContent(obj) {
            const key = String(obj?.opts?.clinicalKey || '').toLocaleLowerCase('tr-TR');
            const label = String(obj?.label || '').toLocaleLowerCase('tr-TR');
            const profile = getPatientProfileKey();
            const isMonitor = key.includes('monitor') || label.includes('monitör') || label.includes('monitor') || label.includes('yaşam bulg');
            const isDrain = key.includes('drain') || key.includes('dren') || label.includes('dren');
            const isPain = key.includes('pain') || label.includes('ağrı') || key.includes('pca') || label.includes('pca');
            const isResp = key.includes('spirometer') || label.includes('spirometre') || label.includes('solunum');
            const isMob = key.includes('walker') || key.includes('mobil') || key.includes('fall') || label.includes('mobilizasyon') || label.includes('düşme');
            const isDischarge = key.includes('discharge') || label.includes('taburculuk');
            const isPONV = key.includes('ponv') || label.includes('ponv') || label.includes('kusma') || label.includes('bulant');
            const isOrientation = key.includes('orientation') || key.includes('delirium') || key.includes('neuro') || label.includes('deliryum') || label.includes('oryantasyon') || label.includes('bilinç');
            const byProfile = {
                cabg: {
                    monitor: ['Ritim/hemodinami izlemi', 'CABG hastasında monitör; aritmi, hipotansiyon, taşikardi, SpO₂ düşüşü ve hipotermiyle ilişkili erken bozulmayı yakalamak için kritik karar noktasıdır.', 'Özellikle ritim değişikliği, drenaj artışıyla birlikte hipotansiyon ve taşikardi varsa kanama/tamponad açısından düşün.'],
                    drain: ['Göğüs tüpü drenajı', 'Bu hastada drenaj sadece sıvı miktarı değildir; parlak kırmızı drenaj, ani artış ve pıhtılaşma kalp cerrahisi sonrası kanama/tamponad riski açısından değerlendirilmelidir.', 'Drenaj artışı fark edilmeden mobilizasyon başlatılamaz.'],
                    pain: ['Sternum korumalı ağrı yönetimi', 'CABG hastasında ağrı kontrolü, öksürük/derin solunum ve erken mobilizasyonu doğrudan etkiler; PCA yalnızca hasta tarafından kullanılmalıdır.', 'Yakının PCA düğmesine basmasına izin verme. Sternum koruma eğitimiyle birlikte değerlendir.'],
                    resp: ['Ağrı + solunum egzersizi', 'Sternotomi sonrası splinting, kontrollü öksürük ve incentive spirometre atelektazi riskini azaltır; ağrı yönetimi ile birlikte öğretilmelidir.', 'Ağrı kontrol edilmeden etkili solunum egzersizi bekleme.'],
                    mob: ['Sternum koruma + hemodinamik tolerans', 'CABG hastasında ilk mobilizasyon; ritim, TA, SpO₂, drenler, ağrı ve sternum koruma ilkeleri değerlendirilmeden başlatılmamalıdır.', 'Drenaj artışı veya hemodinamik instabilite varsa mobilizasyonu durdur.'],
                    orientation: ['Deliryum riski', 'Yaş, kardiyak cerrahi, yoğun bakım ortamı, uyku bölünmesi ve ağrı CABG hastasında deliryum riskini yükseltir.', 'Oryantasyon, aile desteği, gözlük/işitme desteği, uyku ve güvenlik önlemlerini birlikte düşün.'],
                    discharge: ['CABG taburculuk eğitimi', 'Sternum koruma, yara izlemi, ilaç uyumu, aktivite kısıtları, solunum egzersizi ve acil başvuru bulguları teach-back ile doğrulanmalıdır.', 'Göğüs ağrısı, dispne, ateş, yara akıntısı ve ritim hissi alarm bulgusudur.']
                },
                ortho: {
                    monitor: ['Ağrı + periferik dolaşım izlemi', 'Ortopedi hastasında vital bulgular; kan kaybı, opioid etkisi, ağrı şiddeti ve kompartman riskiyle birlikte yorumlanmalıdır.', 'Ağrı vital bulgulardan kopuk değerlendirilirse kompartman riski kaçabilir.'],
                    drain: ['Yara/pin çevresi drenajı', 'Eksternal fiksatör hastasında drenaj ve pansuman; pin dibi enfeksiyon, kanama ve doku bütünlüğü açısından değerlendirilmelidir.', 'Kötü koku, kızarıklık, ısı artışı veya pürülan akıntı enfeksiyon alarmıdır.'],
                    pain: ['Kompartman sendromu açısından ağrı', 'Ortopedi hastasında beklenenden fazla, analjeziye dirençli ağrı; parestezi ve motor kayıpla birlikte kompartman sendromu açısından ciddiye alınmalıdır.', 'Sadece analjezi vermek yeterli değildir; nörovasküler değerlendirme şarttır.'],
                    resp: ['Opioid ve immobilite ilişkili solunum riski', 'Travma/ortopedi hastasında solunum izlemi; opioid sedasyonu, immobilite ve ağrı nedeniyle yüzeyel solunumu yakalamak için önemlidir.', 'Solunum depresyonu ve sedasyon birlikte izlenmelidir.'],
                    mob: ['Fiksatör güvenliği + düşme riski', 'Mobilizasyon; ağırlık verme durumu, cihaz stabilitesi, ağrı, denge ve düşme riski değerlendirilerek planlanmalıdır.', 'Hasta yalnız kaldırılırsa düşme ve pin/fiksatör travması riski artar.'],
                    orientation: ['Nörovasküler takip', 'Renk, ısı, kapiller dolum, duyu, hareket ve distal nabız düzenli değerlendirilmelidir.', 'Nörovasküler bozulma ekstremite güvenliğini tehdit eder.'],
                    discharge: ['Pin bakımı ve enfeksiyon eğitimi', 'Pin bakımı, enfeksiyon bulguları, mobilizasyon kuralları, ağrı yönetimi ve kontrol randevusu hasta/aileye teach-back ile anlatılmalıdır.', 'Kızarıklık, akıntı, kötü koku, ateş ve artan ağrı alarm bulgusudur.']
                },
                chole: {
                    monitor: ['PONV + solunum/analjezi toleransı', 'Kolesistektomi hastasında monitör; PONV, opioid etkisi, ağrı, laparoskopiye bağlı omuz ağrısı ve erken mobilizasyon toleransı ile birlikte yorumlanmalıdır.', 'Kontrolsüz bulantı-kusma varken oral alım ilerletilmez.'],
                    drain: ['Safra kaçağı alarm bulguları', 'Safra benzeri drenaj, artan karın ağrısı, ateş, sarılık veya kötüleşen vital bulgular safra kaçağı açısından değerlendirilmelidir.', 'Safra benzeri drenaj görülürse taburculuk hazırlığı durdurulur.'],
                    pain: ['Omuz ağrısı + insizyon ağrısı', 'Laparoskopi sonrası omuz ağrısı sık olabilir; ancak şiddetli karın ağrısı, ateş ve kötüleşen vital bulgular alarmdır.', 'Ağrı sadece konfor sorunu değildir; komplikasyon sinyali olabilir.'],
                    resp: ['PONV ve erken mobilizasyon ilişkisi', 'Solunum ve mobilizasyon; bulantı-kusma kontrolü, ağrı ve opioid sedasyonu ile birlikte planlanmalıdır.', 'Aspirasyon riski varsa pozisyon ve antiemetik yönetimini öncele.'],
                    mob: ['ERAS erken mobilizasyon', 'Kolesistektomi sonrası erken mobilizasyon ERAS için değerlidir; ancak baş dönmesi, kontrolsüz ağrı ve PONV değerlendirilmeden başlatılmamalıdır.', 'Mobilizasyon toleransı ve oral alım birlikte izlenir.'],
                    ponv: ['PONV / aspirasyon riski', 'Bulantı-kusma; aspirasyon, yara gerilimi, oral alım gecikmesi ve hasta konforu açısından erken yönetilmelidir.', 'Kontrolsüz PONV varken oral alım ilerletme.'],
                    discharge: ['ERAS + safra kaçağı alarm bulguları', 'Beslenmeye geçiş, yara bakımı, aktivite, ağrı yönetimi ve alarm bulguları teach-back ile doğrulanmalıdır.', 'Ateş, sarılık, artan karın ağrısı, safra benzeri akıntı ve inatçı kusma alarmdır.']
                }
            };
            const data = byProfile[profile] || {};
            let row = null;
            if (isPONV && data.ponv) row = data.ponv;
            else if (isMonitor && data.monitor) row = data.monitor;
            else if (isDrain && data.drain) row = data.drain;
            else if (isPain && data.pain) row = data.pain;
            else if (isResp && data.resp) row = data.resp;
            else if (isMob && data.mob) row = data.mob;
            else if (isOrientation && data.orientation) row = data.orientation;
            else if (isDischarge && data.discharge) row = data.discharge;
            if (!row) return null;
            return { title: `${getPatientProfileLabel()} odak noktası: ${row[0]}`, desc: row[1], alarm: row[2] };
        }
        const CRITICAL_TASK_RULES = {
            t_id: { key:'identitySite', title:'Kimlik / onam / cerrahi bölge doğrulaması', error:'Kritik güvenlik hatası: Cerrahi kimlik, onam ve bölge doğrulaması yapılmadan süreç ilerletilemez.', rationale:'Yanlış hasta, yanlış işlem veya yanlış taraf cerrahisi doğrudan hasta güvenliğini tehdit eder.', fix:'Hastaya kimlik bilgisi ve planlanan işlemi sor; dosya, bileklik, onam ve cerrahi plan ile çapraz doğrula.', penalty:{ patientSafety:25, communication:10, clinicalAssessment:10 } },
            oti_id: { key:'identitySite', title:'Kimlik / onam / cerrahi bölge doğrulaması', error:'Kritik güvenlik hatası: Cerrahi kimlik, onam ve bölge doğrulaması yapılmadan süreç ilerletilemez.', rationale:'Yanlış hasta, yanlış işlem veya yanlış taraf cerrahisi doğrudan hasta güvenliğini tehdit eder.', fix:'Hastaya kimlik bilgisi ve planlanan işlemi sor; dosya, bileklik, onam ve cerrahi plan ile çapraz doğrula.', penalty:{ patientSafety:25, communication:10, clinicalAssessment:10 } },
            ltp_id: { key:'identitySite', title:'Kimlik / onam / cerrahi bölge doğrulaması', error:'Kritik güvenlik hatası: Cerrahi kimlik, onam ve bölge doğrulaması yapılmadan süreç ilerletilemez.', rationale:'Yanlış hasta, yanlış işlem veya yanlış taraf cerrahisi doğrudan hasta güvenliğini tehdit eder.', fix:'Hastaya kimlik bilgisi ve planlanan işlemi sor; dosya, bileklik, onam ve cerrahi plan ile çapraz doğrula.', penalty:{ patientSafety:25, communication:10, clinicalAssessment:10 } },
            t_npo: { key:'npo', title:'NPO doğrulaması', error:'Hasta ile konuşulmadı: Açlık-susuzluk durumu hasta/hasta yakını ve dosya üzerinden doğrulanmadan anestezi hazırlığına geçilemez.', rationale:'NPO belirsizliği aspirasyon riskini artırır ve anestezi güvenliğini bozar.', fix:'Son katı/sıvı alım saatini hastadan sor; dosya ve anestezi planı ile doğrula.', penalty:{ patientSafety:20, communication:10, prioritisation:10 } },
            ltp_allergy: { key:'allergy', title:'Alerji doğrulaması', error:'Kritik güvenlik hatası: Alerji doğrulaması yapılmadan süreç ilerletilemez.', rationale:'Alerji bilgisinin doğrulanmaması ilaç, lateks, antiseptik veya antibiyotik ilişkili ciddi reaksiyonlara yol açabilir.', fix:'Hastaya ilaç, lateks, antiseptik, bant ve besin alerjilerini sor; bileklik ve dosya ile doğrula.', penalty:{ patientSafety:25, communication:10, clinicalAssessment:10 } },
            t_blood: { key:'bloodCrossmatch', title:'Kan hazırlığı / crossmatch', error:'Kritik güvenlik hatası: Kan hazırlığı ve crossmatch doğrulanmadan yüksek riskli cerrahi güvenli kabul edilemez.', rationale:'Kanama durumunda gecikme veya yanlış kan ürünü eşleşmesi ciddi zarara yol açabilir.', fix:'Kan grubu, crossmatch ve hazır kan ürününü hasta dosyası ile doğrula.', penalty:{ patientSafety:20, clinicalAssessment:10, prioritisation:10 } },
            tp_drain: { key:'drain', title:'Göğüs tüpü drenajı', error:'Kritik güvenlik hatası: Göğüs tüpü drenajındaki artış fark edilmeden hasta mobilize edilemez veya bakım tamamlanamaz.', rationale:'Ani artış, parlak kırmızı drenaj veya pıhtılaşma kanama/tamponad açısından kritik bulgudur.', fix:'Dren miktarı, rengi, saatlik değişimi ve hemodinami ile ilişkisini değerlendir.', penalty:{ patientSafety:25, clinicalAssessment:15, prioritisation:10 } },
            tp_pain: { key:'pain', title:'Ağrı değerlendirmesi', error:'Hasta ile konuşulmadı: Ağrı skoru alınmadan analjezi, solunum egzersizi veya mobilizasyon planlanamaz.', rationale:'Ağrı düzeyi, solunum, mobilizasyon ve hemodinamik yanıtı etkiler.', fix:'Hastadan NRS/VAS ağrı skorunu al; müdahale sonrası yeniden değerlendir.', penalty:{ clinicalAssessment:15, communication:10, prioritisation:10 } },
            otp_pain: { key:'pain', title:'Ağrı değerlendirmesi', error:'Hasta ile konuşulmadı: Ağrı skoru alınmadan analjezi veya mobilizasyon planlanamaz.', rationale:'Ortopedi hastasında analjeziye dirençli ağrı kompartman sendromu belirtisi olabilir.', fix:'Ağrıyı skorla, beklenen ağrıdan fazla ise nörovasküler değerlendirme yap.', penalty:{ clinicalAssessment:15, communication:10, prioritisation:10 } },
            ltp2_pain: { key:'pain', title:'Ağrı değerlendirmesi', error:'Hasta ile konuşulmadı: Ağrı skoru alınmadan analjezi veya taburculuk hazırlığı yapılamaz.', rationale:'Kolesistektomi sonrası şiddetli karın ağrısı komplikasyon belirtisi olabilir.', fix:'Ağrıyı skorla; omuz ağrısı ile alarm bulgularını ayır.', penalty:{ clinicalAssessment:15, communication:10, prioritisation:10 } },
            tp_delirium: { key:'orientation', title:'Deliryum / oryantasyon izlemi', error:'Kritik güvenlik hatası: Deliryum riski olan hastada oryantasyon ve güvenlik önlemleri alınmadan bakım tamamlanamaz.', rationale:'Hipoaktif deliryum sessiz seyredebilir; ajitasyon ise düşme ve cihaz çekme riskini artırır.', fix:'Oryantasyon, bilinç, duyusal destek ve çevresel güvenlik önlemlerini değerlendir.', penalty:{ patientSafety:20, clinicalAssessment:15, prioritisation:10 } },
            otp_nv: { key:'neurovascular', title:'Nörovasküler takip', error:'Kritik güvenlik hatası: Nörovasküler değerlendirme yapılmadan ekstremite güvenli kabul edilemez.', rationale:'Duyu, hareket, renk, ısı, kapiller dolum ve nabız bozulması ekstremiteyi tehdit edebilir.', fix:'5P/NV değerlendirmesini yap; artan ağrı ve paresteziyi kompartman açısından değerlendir.', penalty:{ patientSafety:25, clinicalAssessment:15, prioritisation:10 } },
            otp_pin: { key:'pinCare', title:'Pin bakımı', error:'Kritik güvenlik hatası: Pin dibi enfeksiyon bulguları fark edilmeden bakım tamamlanamaz.', rationale:'Kızarıklık, akıntı, kötü koku ve ısı artışı enfeksiyon açısından alarmdır.', fix:'Pin giriş yerini değerlendir, bakım ve hasta eğitimini tamamla.', penalty:{ patientSafety:20, clinicalAssessment:10, surgicalNursingKnowledge:10 } },
            ltp2_ponv: { key:'ponv', title:'PONV / aspirasyon riski', error:'Kritik güvenlik hatası: Kontrolsüz bulantı-kusma varken oral alım ilerletilemez.', rationale:'PONV aspirasyon, yara gerilimi ve ERAS sürecinin gecikmesine yol açabilir.', fix:'Bulantı-kusma riskini değerlendir, güvenli pozisyonu sağla ve antiemetik planını kontrol et.', penalty:{ patientSafety:20, clinicalAssessment:10, prioritisation:10 } },
            ltp2_mob: { key:'fallMobility', title:'Erken mobilizasyon / düşme riski', error:'Kritik güvenlik hatası: Düşme riski değerlendirilmeden hasta mobilize edilmemelidir.', rationale:'Sedasyon, hipotansiyon, ağrı ve dren/hatlar düşme ve yaralanma riskini artırır.', fix:'TA, ağrı, baş dönmesi, hat/dren güvenliği ve yardım ihtiyacını değerlendir.', penalty:{ patientSafety:25, prioritisation:10, communication:5 } }
        };
        const CRITICAL_OBJECT_TO_KEY = {
            'preop-allergy':'allergy',
            'npo-labs':'npo',
            'consent-site':'identitySite',
            'preop-site-marker':'identitySite',
            'preop-crossmatch':'bloodCrossmatch',
            'postop-drain-card':'drain',
            'postop-pain-score':'pain',
            'postop-pca':'pain',
            'postop-orientation':'orientation',
            'postop-fall-risk':'fallMobility',
            'postop-walker':'fallMobility',
            'postop-ponv':'ponv',
            'postop-urine':'urine',
            'postop-spirometer':'respEducation',
            'neuro':'orientation',
            'drain':'drain',
            'mobilisation':'fallMobility'
        };
        /*
           Merkezi Görev Kural Motoru
           ------------------------------------------------------------
           Serbest tamamlama, hasta/ekip iletişimi, faz kilidi ve kritik
           hata davranışı artık tek merkezden okunur. Eski liste tabanlı
           yamalar geriye uyumlu sarmalayıcılara indirildi.
        */
        const TASK_RULE_ENGINE = {
            defaults: {
                freeComplete: false,
                requiresPatientTalk: false,
                requiresTeamTalk: false,
                blocksPhaseAdvance: true,
                criticalRuleId: null,
                criticalErrorKey: null,
                talkKey: null,
                role: null,
                guideline: null,
                guidelineTag: null,
                patientProfileFocus: null
            },
            tasks: {
                // PREOP — yalnızca kullanıcının belirttiği bağlı görevler serbest
                t_id: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'identitySite',
                    criticalRuleId:'t_id',
                    role:'Preop hemşiresi',
                    guidelineTag:'WHO SSC'
                },
                t_npo: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'npo',
                    criticalRuleId:'t_npo',
                    role:'Preop hemşiresi',
                    guidelineTag:'ERAS'
                },
                t_blood: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'bloodCrossmatch',
                    criticalRuleId:'t_blood',
                    role:'Preop hemşiresi',
                    guidelineTag:'WHO SSC'
                },

                // GCKL-02 — onam grubu
                gckl_2_consent_file: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'identitySite',
                    role:'Preop hemşiresi',
                    guidelineTag:'WHO SSC'
                },
                gckl_2_patient_consent: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'identitySite',
                    role:'Preop hemşiresi',
                    guidelineTag:'WHO SSC'
                },
                gckl_2_ask_consent: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'identitySite',
                    role:'Preop hemşiresi',
                    guidelineTag:'WHO SSC'
                },

                // GCKL-03 — NPO grubu
                gckl_3_npo_ask: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'npo',
                    role:'Preop hemşiresi',
                    guidelineTag:'ERAS'
                },
                gckl_3_npo_record: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'npo',
                    role:'Preop hemşiresi',
                    guidelineTag:'ERAS'
                },
                gckl_3_npo_escalate: {
                    phase:'preop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    blocksPhaseAdvance:true,
                    talkKey:'npo',
                    role:'Preop hemşiresi',
                    guidelineTag:'ERAS'
                },

                // INTRAOP — yalnızca kullanıcının belirttiği Time-out görevi serbest
                ti_timeout: {
                    phase:'intraop',
                    freeComplete:true,
                    requiresPatientTalk:false,
                    requiresTeamTalk:true,
                    blocksPhaseAdvance:true,
                    talkKey:'teamTimeOut',
                    criticalRuleId:'ti_timeout',
                    role:'Tüm ekip',
                    guidelineTag:'WHO SSC'
                }
            },
            labelRules: [
                {
                    // INTRAOP — tüm Time-out görev varyantları aynı ekip doğrulama kuralına bağlandı.
                    // Önceki sürümde yalnızca ti_timeout tanınıyordu; lti_to / oti2_to gibi vakaya özgü
                    // Time-out görevleri bu yüzden tamamlanamıyordu.
                    phase:'intraop',
                    match: /time[-\s]?out/i,
                    config: {
                        freeComplete:true,
                        requiresPatientTalk:false,
                        requiresTeamTalk:true,
                        blocksPhaseAdvance:true,
                        talkKey:'teamTimeOut',
                        role:'Tüm ekip',
                        guidelineTag:'WHO SSC'
                    }
                },
                {
                    phase:'preop',
                    match: /^GCKL-02\s*·/i,
                    config: {
                        freeComplete:true,
                        requiresPatientTalk:false,
                        blocksPhaseAdvance:true,
                        talkKey:'identitySite',
                        role:'Preop hemşiresi',
                        guidelineTag:'WHO SSC'
                    }
                },
                {
                    phase:'preop',
                    match: /^GCKL-03\s*·/i,
                    config: {
                        freeComplete:true,
                        requiresPatientTalk:false,
                        blocksPhaseAdvance:true,
                        talkKey:'npo',
                        role:'Preop hemşiresi',
                        guidelineTag:'ERAS'
                    }
                }
            ],
            objectTalkRules: {
                preop: {
                    identitySite: { freeCompleteForTasks:['t_id','gckl_2_consent_verify','gckl_2_consent_verify','gckl_2_consent_verify'], freeCompleteForCards:['identity-consent-site'] },
                    npo: { freeCompleteForTasks:['t_npo','gckl_3_npo_check','gckl_3_npo_check','gckl_3_npo_check'], freeCompleteForCards:['npo-labs'] },
                    bloodCrossmatch: { freeCompleteForTasks:['t_blood'], freeCompleteForCards:['preop-crossmatch','preop-medrec','iv-access'] }
                },
                intraop: {
                    teamTimeOut: {
                        freeCompleteForTasks:[
                            'ti_timeout', 'oti2_to', 'lti_to',
                            't_timeout', 'oti_timeout', 'ltp_timeout', 'vag_timeout', 'rad_timeout', 'ose_timeout'
                        ]
                    }
                }
            }
        };


        function getTaskPatientProfileFocus(task, phaseName = App.currentRoom) {
            const profile = getPatientProfileKey();
            const label = String(task?.label || '').toLocaleLowerCase('tr-TR');
            const map = {
                cabg: [
                    ['sternum', /sternum|mobilizasyon|transfer|solunum|öksürük|spirometre/],
                    ['göğüs tüpü drenajı', /dren|göğüs tüp|kanama/],
                    ['deliryum riski', /deliryum|oryantasyon|bilinç|kognitif/],
                    ['hipotermi', /hipotermi|ısı|sıcaklık/],
                    ['ritim-hemodinami', /monitör|ritim|hemodinami|ta|nabız|spo/]
                ],
                ortho: [
                    ['nörovasküler takip', /nörovasküler|kapiller|duyu|hareket|nabız|ekstremite/],
                    ['pin bakımı', /pin|fiksatör|pansuman/],
                    ['enfeksiyon', /enfeksiyon|ateş|akıntı|kızarıklık/],
                    ['kompartman riski', /kompartman|parestezi|ağrı/],
                    ['mobilizasyon', /mobilizasyon|walker|düşme|transfer/]
                ],
                chole: [
                    ['PONV', /ponv|bulant|kusma|aspirasyon/],
                    ['omuz ağrısı', /omuz|ağrı/],
                    ['yara bakımı', /yara|pansuman|enfeksiyon/],
                    ['ERAS-beslenme', /eras|beslen|oral|mobilizasyon/],
                    ['safra kaçağı alarmı', /safra|sarılık|dren|karın/]
                ]
            };
            const rows = map[profile] || [];
            const hit = rows.find(([, re]) => re.test(label));
            if (hit) return hit[0];
            if (phaseName === 'preop') return 'preoperatif güvenlik doğrulaması';
            if (phaseName === 'intraop') return 'ekip doğrulaması ve steril süreç';
            if (phaseName === 'postop') return 'erken postoperatif güvenlik izlemi';
            return 'cerrahi hasta güvenliği';
        }

        function getTaskRuleConfig(task, phaseName = App.currentRoom) {
            if (!task) return { ...TASK_RULE_ENGINE.defaults };
            const base = {
                ...TASK_RULE_ENGINE.defaults,
                id: task.id,
                label: task.label,
                phase: phaseName,
                critical: !!task.critical,
                guideline: task.guideline || null,
                guidelineTag: task.guideline && GUIDELINE_THEMES?.[task.guideline] ? GUIDELINE_THEMES[task.guideline].tag : null,
                patientProfileFocus: null
            };
            let cfg = { ...base };
            const direct = TASK_RULE_ENGINE.tasks[task.id];
            if (direct && (!direct.phase || direct.phase === phaseName)) cfg = { ...cfg, ...direct };
            const label = String(task.label || '');
            (TASK_RULE_ENGINE.labelRules || []).forEach(rule => {
                if ((!rule.phase || rule.phase === phaseName) && rule.match && rule.match.test(label)) {
                    cfg = { ...cfg, ...(rule.config || {}) };
                }
            });
            cfg.requiresPatientTalk = !!cfg.requiresPatientTalk;
            cfg.requiresTeamTalk = !!cfg.requiresTeamTalk;
            cfg.freeComplete = !!cfg.freeComplete;
            if (!cfg.criticalErrorKey && cfg.criticalRuleId) cfg.criticalErrorKey = cfg.criticalRuleId;
            if (!cfg.criticalRuleId && cfg.criticalErrorKey) cfg.criticalRuleId = cfg.criticalErrorKey;
            if (!cfg.guideline && cfg.guidelineTag) cfg.guideline = cfg.guidelineTag;
            cfg.patientProfileFocus = cfg.patientProfileFocus || getTaskPatientProfileFocus(task, phaseName);
            return cfg;
        }

        function isTaskFreeComplete(task, phaseName = App.currentRoom) {
            return !!getTaskRuleConfig(task, phaseName).freeComplete;
        }

        function getObjectRuleConfig(sourceKey, task, phaseName = App.currentRoom) {
            const cfg = getTaskRuleConfig(task, phaseName);
            if (!sourceKey) return { freeComplete: !!cfg.freeComplete, sourceKey:null };
            const phaseRules = TASK_RULE_ENGINE.objectTalkRules?.[phaseName] || {};
            const objectRule = phaseRules[sourceKey] || null;
            const freeByObject = !!objectRule && (
                (Array.isArray(objectRule.freeCompleteForTasks) && objectRule.freeCompleteForTasks.includes(task?.id)) ||
                (Array.isArray(objectRule.freeCompleteForCards) && objectRule.freeCompleteForCards.includes(task?.cardKey))
            );
            return {
                sourceKey,
                freeComplete: !!cfg.freeComplete || freeByObject,
                requiresPatientTalk: cfg.requiresPatientTalk,
                requiresTeamTalk: cfg.requiresTeamTalk
            };
        }

        // Geriye uyumlu sarmalayıcılar: eski adlar kalsın, karar merkezi motordan gelsin.
        function isPreopLinkedFreeTask(task, phaseName = App.currentRoom) {
            return isTaskFreeComplete(task, phaseName);
        }
        function isPreopLinkedFreeObjectKey(key, task, phaseName = App.currentRoom) {
            return !!getObjectRuleConfig(key, task, phaseName).freeComplete;
        }
        function getCriticalRuleForTask(task, phaseName = App.currentRoom) {
            if (!task) return null;
            const cfg = getTaskRuleConfig(task, phaseName);
            if (cfg.freeComplete) return null;
            let ruleKey = cfg.criticalErrorKey || cfg.criticalRuleId;
            let rule = ruleKey ? CRITICAL_TASK_RULES[ruleKey] : null;
            if (!rule) rule = CRITICAL_TASK_RULES[task.id] || null;
            if (!rule && task.critical && /kimlik|onam|bölge|taraf/i.test(task.label || '')) rule = CRITICAL_TASK_RULES.t_id;
            if (!rule && /npo|açlık/i.test(task.label || '')) rule = CRITICAL_TASK_RULES.t_npo;
            return rule;
        }
        function getCommunicationBucket(phase = App.currentRoom) {
            App.patientCommunication = App.patientCommunication || { preop: {}, intraop: {}, postop: {} };
            App.patientCommunication[phase] = App.patientCommunication[phase] || {};
            return App.patientCommunication[phase];
        }
        function isCriticalCommunicationDone(key, phase = App.currentRoom) {
            return !!getCommunicationBucket(phase)[key];
        }
        function markCriticalCommunication(key, source = '') {
            if (!key) return;
            const bucket = getCommunicationBucket(App.currentRoom);
            bucket[key] = true;
            App.actionSequence = App.actionSequence || [];
            App.actionSequence.push({ t: Date.now(), phase: App.currentRoom, kind: 'patient_communication', tag: key, payload: source, ok: true });
            try { completeMarkerBySourceKey(key, true); } catch(e) {}
            toast('success', 'Hasta ile iletişim doğrulandı', source || key);
        }
        function applyCriticalPenalty(rule) {
            if (!rule || !rule.penalty) return;
            App.criticalPenaltyApplied = App.criticalPenaltyApplied || {};
            const penaltyKey = `${App.currentPatient?.id || 'case'}:${App.currentRoom}:${rule.key}`;
            if (App.criticalPenaltyApplied[penaltyKey]) return;
            Object.entries(rule.penalty).forEach(([cat, pts]) => addScore([cat], -Math.abs(pts), 0));
            addPhaseScore(App.currentRoom, -10, 0);
            App.criticalPenaltyApplied[penaltyKey] = true;
        }
        function showCriticalSafetyError(rule) {
            if (!rule) return;
            App.criticalSafetyEvents = App.criticalSafetyEvents || [];
            const rec = { id: 'crit_' + Date.now(), phase: App.currentRoom, key: rule.key, title: rule.title, error: rule.error, ts: Date.now() };
            App.criticalSafetyEvents.push(rec);
            App.feedbackEntries.push({ ok:false, label: rule.title, kind:'critical_safety_error', guideline:'patient_safety', phase: App.currentRoom, desc: rule.error });
            try { App.osce.criticalErrors[rule.key] = true; } catch(e){}
            applyCriticalPenalty(rule);
            let box = document.getElementById('critical-safety-alert');
            if (!box) {
                box = document.createElement('div');
                box.id = 'critical-safety-alert';
                box.className = 'critical-safety-alert';
                document.body.appendChild(box);
            }
            box.innerHTML = `<button class="csa-close" aria-label="Kapat">×</button><div class="csa-title">Hasta Güvenliği İkazı</div><div class="csa-main">${rule.error}</div><div class="csa-body"><b>Gerekçe:</b> ${rule.rationale}</div><div class="csa-fix"><b>Düzeltme görevi:</b> ${rule.fix}</div>`;
            box.classList.add('visible');
            const btn = box.querySelector('.csa-close');
            if (btn) btn.onclick = () => box.classList.remove('visible');
            clearTimeout(box._timer);
            box._timer = setTimeout(() => box.classList.remove('visible'), 8200);
            showSceneReaction(rule.error, 'danger');
            toast('error', 'Kritik güvenlik hatası', rule.title);
            renderRightPanel?.();
            renderTopbar?.();
            updateProgressBar?.();
        }
        function getObjectCriticalTalkKey(obj) {
            const ck = String(obj?.opts?.clinicalKey || '');
            return CRITICAL_OBJECT_TO_KEY[ck] || null;
        }
        function getCriticalTalkLabel(obj) {
            const key = getObjectCriticalTalkKey(obj);
            if (!key) return null;
            const objCk = String(obj?.opts?.clinicalKey || '');
            const done = isCriticalCommunicationDone(key);
            if (done) return '✓ Hasta ile doğrulandı';
            if (objCk === 'preop-site-marker') return 'Hastayla taraf/bölgeyi doğrula';
            if (objCk === 'consent-site') return 'Hastayla kimlik ve işlemi doğrula';
            if (objCk === 'preop-allergy') return 'Hastaya alerji sor';
            if (key === 'allergy') return 'Hastaya alerji sor';
            if (key === 'npo') return 'Hastaya NPO sor';
            if (key === 'identitySite') return 'Hastayla kimlik/bölgeyi doğrula';
            if (key === 'pain') return 'Hastaya ağrı sor';
            if (key === 'fallMobility') return 'Mobilizasyon öncesi hastayı değerlendir';
            if (key === 'drain') return 'Dreni hasta/hemodinamiyle değerlendir';
            if (key === 'orientation') return 'Oryantasyon sor';
            if (key === 'ponv') return 'Bulantı-kusma sor';
            return 'Hastaya sor / doğrula';
        }
        function getRuleForObjectKey(key) {
            const rules = Object.values(CRITICAL_TASK_RULES);
            return rules.find(r => r.key === key) || { key, title:'Hasta iletişimi', error:'Hasta ile konuşulmadı: Bu bilgi hastadan doğrulanmadan işlem sürdürülemez.', rationale:'Hasta beyanı ve dosya doğrulaması birlikte kullanılmalıdır.', fix:'Hastaya ilgili güvenlik sorusunu sor ve dosya ile eşleştir.', penalty:{ communication:5 } };
        }
        function getPhaseCriticalBlocker(phaseName = App.currentRoom) {
            const phase = App.currentPatient?.[phaseName];
            if (!phase || !Array.isArray(phase.tasks)) return null;
            for (const task of phase.tasks) {
                const rule = getCriticalRuleForTask(task, phaseName);
                if (rule && !App.completedTasks.includes(task.id) && !isCriticalCommunicationDone(rule.key, phaseName)) return rule;
            }
            return null;
        }

        /* ============================================================
           İP-2 PHASE GATE — GCKL-aware Critical Blocker
           Bu fonksiyon getPhaseCriticalBlocker'a ek olarak GCKL
           agregat durumunu da kontrol eder. Her fazdaki kritik
           GCKL maddelerinin durumunu hesaplayıp blocker döner.
           ============================================================ */
        function getGCKLPhaseBlocker(phaseName = App.currentRoom) {
            // GCKL_ITEMS henüz yüklü değilse atla
            if (typeof GCKL_ITEMS === 'undefined' || typeof gcklPhaseForItem === 'undefined') return null;

            // Bu fazda olan kritik GCKL maddelerini bul
            const phaseCriticalItems = GCKL_ITEMS.filter(item => {
                if (!item.criticalKey) return false;
                const simPhase = gcklPhaseForItem(item.id);
                return simPhase === phaseName;
            });

            if (!phaseCriticalItems.length) return null;

            // Her birinin agregat durumunu kontrol et
            for (const item of phaseCriticalItems) {
                const aggStatus = NurseKitSM.computeAggregateStatus(item.id);

                // unsafe → her zaman blocker
                if (aggStatus === 'unsafe') {
                    return {
                        gcklId: item.id,
                        kind: 'unsafe',
                        title: `${item.id} GÜVENSİZ DURUM`,
                        description: `${item.text} — Bu kritik madde güvensiz durumda. Faz geçişi engellendi.`,
                        key: item.criticalKey
                    };
                }

                // pending veya partial → kritik maddede tamamlanmamış
                // (never-event olmayan kritik maddelerde partial geçişe izin verilebilir,
                //  ama biz şimdilik tüm kritiklerde tamamı şart koşuyoruz)
                if (aggStatus !== 'completed') {
                    return {
                        gcklId: item.id,
                        kind: 'incomplete_critical',
                        title: `${item.id} EKSİK`,
                        description: `${item.text} — Bu kritik madde tamamlanmadan faz geçişi yapılamaz.`,
                        key: item.criticalKey
                    };
                }
            }

            return null;
        }

        // İP-2: Bir fazın geçilebilir olup olmadığını kapsamlı kontrol eder
        function getPhaseAdvanceBlocker(phaseName = App.currentRoom) {
            // 1) Eski legacy blocker (CRITICAL_TASK_RULES + completedTasks)
            const legacyBlocker = getPhaseCriticalBlocker(phaseName);
            if (legacyBlocker) return { source: 'legacy', rule: legacyBlocker };

            // 2) Yeni GCKL agregat blocker
            const gcklBlocker = getGCKLPhaseBlocker(phaseName);
            if (gcklBlocker) return { source: 'gckl', rule: gcklBlocker };

            return null;
        }

        // İP-2: Bypass mekanizması — eğitmen modu / debug için
        function isPhaseGateBypassed() {
            // URL parametresi: ?bypass_gate=1
            try {
                const url = new URL(window.location.href);
                if (url.searchParams.get('bypass_gate') === '1') return true;
            } catch(e) {}
            // Global flag (console'dan): window.NK_BYPASS_GATE = true
            if (window.NK_BYPASS_GATE === true) return true;
            return false;
        }

        function getObjectTaskNote(obj, task) {
            const ck = String(obj?.opts?.clinicalKey || '');
            const notes = {
                'portable-carm': 'Görev: Skopi gerektiğinde cihazı steril çekirdeği ve ana geçişi kapatmadan güvenli park pozisyonunda doğrula.',
                'radiation-safety': 'Görev: Kurşun önlük, tiroid koruyucu ve radyasyon uyarı alanını görüntüleme öncesi hazır hâle getir.',
                'esu-unit': 'Görev: Cerrahi enerji ve aspirasyon kulesini hazırla — ESU mod (Cut/Coag/Bipolar) seçimini doğrula, hasta plakasını uygun bölgeye yerleştir ve plaka durum LED\'inin yeşil olduğunu teyit et; aspirasyon kavanozlarının vakum hattı, duman tahliye HEPA filtresi ve kablo/hortum güvenliğini ekiple birlikte kontrol et.',
                'suction-smoke': 'Görev: (Cerrahi Enerji ve Aspirasyon Kulesi entegre edildi) — aspirasyon vakum hattını ve duman tahliye HEPA filtresini operatif sahaya açık ve çalışır hâlde tut; hortum yerleşimi cerrahi alanı veya kabloları engellememelidir.',
                'sharps-tray': 'Görev: Kesici-delici güvenlik alanını tanımla; bistüri ve iğnelerin güvenli transferini/sayımını destekle.',
                'airway-cart': 'Görev: Airway / ilaç arabasını baş uçta erişilebilir tut ve kritik ekipmanı eksiksiz kontrol et.',
                'blood-warmer': 'Görev: Kan ürünü / sıvı ısıtıcı ve hızlı infüzyon hattının doğru setle hazır olduğunu doğrula.',
                'warming-pressure': 'Görev: Aktif ısıtma ve basınç noktası korumasını hasta üzerinde uygun şekilde uygula.',
                'positioning-set': 'Görev: Pozisyon desteklerini yerleştir; sinir basısı ve basınç yaralanması riskini azalt.',
                'fire-risk': 'Görev: Cerrahi yangın üçgenini değerlendir ve oksijen–koter–prep ilişkisini ekip ile teyit et.',
                'traffic-control': 'Görev: Sirküle hemşire olarak kapı ve oda trafiğini kontrol et; steril alan giriş-çıkış disiplinini koru.',
                'ssc-board': 'Görev: Bu pano yalnızca GCKL ilerlemesini gösterir. Ekip tanıtımı, kimlik/taraf doğrulaması, profilaksi, sterilite, sayım ve numune güvenliği adımlarını faz görev listesinden tamamla.',
                'ssc-board-preop': 'Görev: Bu pano preop GCKL ilerlemesini gösterir. Kimlik, onam, taraf, alerji, NPO, ilaç, kan hazırlığı, IV ve transfer doğrulamalarını faz görev listesinden tamamla.',
                'ssc-board-intraop': 'Görev: Bu pano intraop GCKL ilerlemesini gösterir. İlgili doğrulamaları faz görev listesinden tamamla.',
                'ssc-board-postop': 'Görev: Bu pano postop GCKL ilerlemesini gösterir. Teslim, solunum, ağrı, kanama/dren ve güvenlik adımlarını faz görev listesinden tamamla.',
                'count-board': 'Görev: Spanç-iğne-alet sayımı üçlü doğrulamayla yapılır — sirküle sayar/kaydeder, scrub steril alanda doğrular, cerrah kapatma öncesi izin verir.',
                'specimen': 'Görev: Sirküle hemşire olarak cerrahın tanımladığı numuneyi hasta/örnek eşleşmesiyle etiketle ve kayda al.',
                'waste-flow': 'Görev: Kirli atık akışını temiz alandan ayır ve uygun atık kutusuna yönlendir.',
                'mayo-stand': 'Görev: Steril Alet İstasyonunu yönet — Mayo platformu üzerinde alet bölgelerini (keskin/temiz/nötr) düzenle, yan destek tezgahında alet setlerini renk koduna göre yerleştir; sayım kanıt LED panosunda Alet/Spanç/İğne sayımının açık tutulmasına dikkat et. Steril sınır halkasının dışına alet konulmaması scrub ve sirküle hattı arasındaki ortak sorumluluktur.',
                'sterile-table': 'Görev: (Steril Alet İstasyonuna entegre edildi) — yan destek tezgahını scrub hemşiresinin erişimine açık, sirküle akışı engellemeyecek hatta tut; CABG setleri ve yedek aletler bu bölgede düzenlenir.',
                'or-hand-hygiene': 'Görev: Steril çekirdeğe girmeden önce el hijyeni davranışını başlat.',
                'signin': 'Görev: Sign-in ve anestezi güvenlik doğrulamalarını tamamla.',
                'intraop-monitor': 'Görev: Monitör alarm ve görünürlük ayarlarını doğrula; güvenli izlem hattını sürdür.',
                'anaesthesia-team': 'Görev: Baş uç ekibiyle hava yolu, ilaç ve hemodinamik planı teyit et.',
                'preop-allergy': 'Görev: Alerji ve risk bilekliğini hasta kimliği ile eşleştirip doğrula.',
                'preop-site-marker': 'Görev: Cerrahi taraf/bölge işaretini hasta ve dosya ile birlikte doğrula.',
                'preop-medrec': 'Görev: İlaç uzlaştırmasını yap; antikoagülan ve kritik ilaç öyküsünü netleştir.',
                'preop-vte': 'Görev: VTE profilaksi hazırlığını değerlendir ve uygun ekipmanı hazırla.',
                'preop-anxiety': 'Görev: Hastanın preoperatif kaygısını değerlendir ve uygun desteği planla.',
                'preop-delirium': 'Görev: Deliryum / kognitif risk ön taramasını tamamla.',
                'preop-clipper': 'Görev: Cilt hazırlığı ve gerekiyorsa güvenli kıl temizliğini doğrula.',
                'preop-belongings': 'Görev: Takı, lens ve protezlerin çıkarıldığını sistematik kontrol et.',
                'preop-crossmatch': 'Görev: Kan hazırlığı ve crossmatch doğrulamasını hasta dosyası ile eşleştir.',
                'preop-transfer': 'Görev: Transfer öncesi son güvenlik kontrolünü tamamla.',
                'postop-drain-card': 'Görev: Dren miktarı ve rengini değerlendirip kayıt döngüsünü başlat.',
                'postop-urine': 'Görev: Saatlik diürez ve sonda akışını değerlendir.',
                'postop-pca': 'Görev: PCA / analjezi pompası ayarlarını ve hasta güvenliğini doğrula.',
                'postop-pain-score': 'Görev: Ağrı skorunu ölç ve analjezi sonrası yeniden değerlendir.',
                'postop-spirometer': 'Görev: Spirometre ile solunum egzersizi eğitimini uygula.',
                'postop-ponv': 'Görev: Bulantı-kusma riskini değerlendir ve aspirasyon önlemini planla.',
                'postop-orientation': 'Görev: Oryantasyon, sedasyon ve deliryum bulgularını değerlendir.',
                'postop-walker': 'Görev: İlk mobilizasyon için güvenli yardımcı ekipmanı hazırla.',
                'postop-fall-risk': 'Görev: Düşme riskini görünür kıl ve mobilizasyon önlemlerini başlat.',
                'postop-discharge': 'Görev: Taburculuk hazırlık materyalini hasta ve aile eğitimiyle ilişkilendir.',
                'light-timeout': 'Görev: Lamba odaklanmadan önce ekip sessizleşir; doğru hasta, işlem ve sternotomi sahası time-out ile teyit edilir.',
                'iv-pump-intraop': 'Görev: IV pompa ve sıvı hattını anestezi planı, kan kaybı beklentisi ve erişim güvenliğiyle birlikte doğrula.',
                'smoke-evac': 'Görev: ESU aktifse duman tahliye hattının açık, filtre durumunun uygun ve hortum ucunun duman kaynağına yakın olduğunu doğrula.',
                'waste-station': 'Görev: Kirli materyali temiz alandan ayır; kırmızı tıbbi atık, sarı kesici-delici, mavi temiz destek ve yeşil genel atık ayrımını uygula.',
                'cpb-machine': 'Görev: KPB cihazını 5 alt-fazda izle: KPB öncesi hazır oluş, ACT/heparin/prime, pompa açık izlem, çıkış hazırlığı ve protamin/koagülasyon doğrulaması.',
                'cpb-phase-board': 'Görev: KPB faz panelinde 5 klinik alt-fazı sırayla doğrula; hiçbir faz yalnız cihaz varlığıyla tamamlanmış sayılmaz.',
                'cell-saver': 'Görev: Hücre koruyucuda aspirasyon hattı, antikoagülasyon, rezervuar ve geri verme güvenliğini kan yönetimiyle ilişkilendir.',
                'cabg-anaesthesia-module': 'Görev: CABG anestezi güvenliğinde kan kaybı tahmini, invaziv arter basıncı (A-line) sıfırlama/dalga formu, TXA order-doz-zamanlaması ve kan ürün hazırlığını Sign-in/Time-out hattına bağla.',
                'cabg-temp-trigger': 'Görev: Sıcaklık tetiklerini izle; T <36°C olduğunda ısıtıcıyı amber uyarıya al, aktif ısıtma ve ısıtılmış sıvı/kan hattını artır; T <35°C olduğunda kırmızı kritik eskalasyon başlat.',
                'postop-bleed-coag': 'Görev: Postop kanama/koagülopati eskalasyonunda drenaj, hemodinami, Hb, ACT, PT/aPTT, fibrinojen/trombosit, ısı ve protamin bilgisini SBAR ile ilet.',
                'perfusionist': 'Görev: Perfüzyonistle pompa akımı, ACT, venöz dönüş, ısı ve acil durdurma erişimini sözel olarak paylaş.',
                'graft-prep-table': 'Görev: Greft hazırlama alanında heparinli salin, bulldog klemp, sutür, keskin/nötr alan ve sayım düzenini koru; back table düzenini operatif alana paralel tut, IMA ve safen diseksiyon zonlarını ayrı görünür alanlarda izleyip kondüit yönü, bütünlüğü, yan dal kontrolü ve travmasız hazırlık kalitesini GCKL görev puanlamasıyla doğrula.',
                'cabg-device-audit': 'Görev: CABG cihaz denetimini ekipçe tamamla; anestezi, KPB/perfüzyon, ESU, duman tahliye, aspirasyon, aktif ısıtma, sayım, numune ve atık hattını tek güvenlik kontrolünde bağla.'
            };
            return notes[ck] || (task ? `Görev: ${task.label}` : null);
        }
        function getObjectWrongUseWarning(obj) {
            const ck = String(obj?.opts?.clinicalKey || '');
            const warnings = {
                'portable-carm': 'Yanlış kullanım uyarısı: C-kolun steril saha içine taşması veya ana geçiş yolunu kapatması kontaminasyon, çarpma ve gecikme riski oluşturur.',
                'radiation-safety': 'Yanlış kullanım uyarısı: Koruyucu ekipman olmadan skopi kullanımı gereksiz radyasyon maruziyeti doğurur.',
                'esu-unit': 'Yanlış kullanım uyarısı: Hasta plakası uygunsuz yerleşirse yanık gelişebilir; oksijen ve yanıcı prep ile birlikte yangın riski artar.',
                'suction-smoke': 'Yanlış kullanım uyarısı: Hortumların sahayı/kabloları karıştırması kontaminasyon ve takılma riskini artırır; duman tahliyesinin kapalı kalması ekip maruziyetine yol açar.',
                'sharps-tray': 'Yanlış kullanım uyarısı: Kesici-delicilerin açıkta bırakılması yaralanma, sayım hatası ve kanla temas riskini artırır.',
                'airway-cart': 'Yanlış kullanım uyarısı: Baş uçtan uzakta veya dağınık airway arabası acil hava yolu müdahalesini geciktirir.',
                'blood-warmer': 'Yanlış kullanım uyarısı: Uygunsuz set, uygunsuz ısı veya kontrolsüz hızlı infüzyon hasta güvenliğini bozar.',
                'cabg-anaesthesia-module': 'Yanlış kullanım uyarısı: A-line sıfırlama/dalga formu, kan kaybı tahmini, TXA order-doz-zamanlaması ve kan ürün hazırlığı birlikte doğrulanmazsa hemodinamik bozulma ve kanama yönetimi gecikir.',
                'cabg-temp-trigger': 'Yanlış kullanım uyarısı: T <36°C amber uyarısı veya T <35°C kırmızı eskalasyon atlanırsa hipotermiye bağlı kanama, SSI, koagülopati ve kardiyak komplikasyon riski artar.',
                'warming-pressure': 'Yanlış kullanım uyarısı: Yetersiz pedleme basınç yaralanması, aşırı ısı ise termal hasar oluşturabilir.',
                'positioning-set': 'Yanlış kullanım uyarısı: Yanlış pozisyonlama sinir basısı, düşme ve basınç yaralanmasına yol açabilir.',
                'fire-risk': 'Yanlış kullanım uyarısı: Oksijen birikimi + elektrokoter + yanıcı antiseptik OR yangını için klasik risk üçgenidir.',
                'traffic-control': 'Yanlış kullanım uyarısı: Gereksiz kapı açılması ve personel trafiği steriliteyi bozar ve dikkat dağınıklığı yaratır.',
                'ssc-board': 'Yanlış kullanım uyarısı: Kontrol listesinin atlanması yanlış hasta, yanlış taraf ve iletişim hataları riskini artırır.',
                'ssc-board-preop': 'Yanlış kullanım uyarısı: Preoperatif kontrol listesinin atlanması yanlış hasta/işlem, eksik hazırlık ve güvenlik riski oluşturur.',
                'ssc-board-intraop': 'Yanlış kullanım uyarısı: İntraoperatif kontrol listesinin atlanması ekip iletişimi ve cerrahi güvenlik hatası riskini artırır.',
                'ssc-board-postop': 'Yanlış kullanım uyarısı: Postoperatif kontrol listesinin atlanması teslim, izlem ve erken bozulmayı fark etmede gecikme riskine yol açar.',
                'count-board': 'Yanlış kullanım uyarısı: Sayımı tek kişinin yapması, scrub doğrulamasının atlanması veya cerrahın izni alınmadan kavitenin kapatılması yabancı cisim unutulması (RSI - retained surgical item) riskini artırır.',
                'specimen': 'Yanlış kullanım uyarısı: Numune etiketi geç veya yanlış düzenlenirse hasta-örnek karışıklığı oluşabilir.',
                'waste-flow': 'Yanlış kullanım uyarısı: Atık akışının temiz alanla karışması kontaminasyon ve yaralanma riskini artırır.',
                'preop-allergy': 'Yanlış kullanım uyarısı: Alerji/risk bilekliğinin atlanması ilaç, lateks ve güvenlik hatalarına yol açabilir.',
                'preop-site-marker': 'Yanlış kullanım uyarısı: Taraf/bölge doğrulaması yapılmazsa yanlış taraf cerrahisi riski oluşur.',
                'preop-medrec': 'Yanlış kullanım uyarısı: İlaç öyküsünün eksik alınması kanama, hipoglisemi veya hemodinamik sorunlara yol açabilir.',
                'preop-vte': 'Yanlış kullanım uyarısı: VTE profilaksisinin gözden kaçması tromboemboli riskini artırır.',
                'preop-anxiety': 'Yanlış kullanım uyarısı: Ciddi kaygının fark edilmemesi hasta iş birliğini ve perioperatif iyilik halini bozar.',
                'preop-delirium': 'Yanlış kullanım uyarısı: Kognitif riskin atlanması postop deliryum önleme fırsatını azaltır.',
                'preop-clipper': 'Yanlış kullanım uyarısı: Uygunsuz tıraş/cilt hazırlığı enfeksiyon ve cilt hasarı riskini artırır.',
                'preop-belongings': 'Yanlış kullanım uyarısı: Takı, lens veya protezlerin unutulması aspirasyon, yanık veya kayıp eşya sorunlarına yol açabilir.',
                'preop-crossmatch': 'Yanlış kullanım uyarısı: Kan hazırlığı doğrulanmazsa acil durumda gecikme ve hasta-ürün eşleşme hatası oluşabilir.',
                'preop-transfer': 'Yanlış kullanım uyarısı: Transfer öncesi son kontrolün atlanması yanlış hasta, hat çekilmesi ve teslim kusuru doğurabilir.',
                'postop-drain-card': 'Yanlış kullanım uyarısı: Drenaj takibi yapılmazsa erken kanama fark edilmeyebilir.',
                'postop-urine': 'Yanlış kullanım uyarısı: Diürez takibinin atlanması hipovolemi ve böbrek perfüzyon bozukluğunu gizleyebilir.',
                'postop-pca': 'Yanlış kullanım uyarısı: Analjezi pompası hatalı yönetilirse yetersiz analjezi veya aşırı sedasyon gelişebilir.',
                'postop-pain-score': 'Yanlış kullanım uyarısı: Ağrı sistematik ölçülmezse müdahale gecikir ve mobilizasyon bozulur.',
                'postop-spirometer': 'Yanlış kullanım uyarısı: Solunum egzersizinin ihmal edilmesi atelektazi ve sekresyon birikimi riskini artırır.',
                'postop-ponv': 'Yanlış kullanım uyarısı: PONV yönetilmezse aspirasyon ve hasta konforsuzluğu artar.',
                'postop-orientation': 'Yanlış kullanım uyarısı: Deliryum/oryantasyon izlemi yapılmazsa sessiz kötüleşme atlanabilir.',
                'postop-walker': 'Yanlış kullanım uyarısı: Güvensiz mobilizasyon düşme ve hat/dren çekilmesi riskini artırır.',
                'postop-fall-risk': 'Yanlış kullanım uyarısı: Düşme riski görünür kılınmazsa sedasyon ve hipotansiyon ilişkili düşmeler artabilir.',
                'postop-discharge': 'Yanlış kullanım uyarısı: Taburculuk eğitimi hazırlıksız verilirse hasta evde bakım adımlarını yanlış uygulayabilir.',
                'light-timeout': 'Yanlış kullanım uyarısı: Lamba ve saha hazır görünse bile time-out tamamlanmadan kesi başlatmak yanlış hasta/işlem ve ekip iletişim hatası riskini artırır.',
                'iv-pump-intraop': 'Yanlış kullanım uyarısı: IV hat ve pompa ayarı doğrulanmazsa ilaç/sıvı gecikmesi, infiltrasyon veya kan ürünü hazırlık kusuru oluşabilir.',
                'smoke-evac': 'Yanlış kullanım uyarısı: ESU kullanılırken duman tahliye kapalıysa ekip cerrahi dumana maruz kalır ve görüş alanı bozulur.',
                'waste-station': 'Yanlış kullanım uyarısı: Kesici-delici veya kontamine atığın yanlış kutuya atılması yaralanma ve çapraz kontaminasyon riskini artırır.',
                'cpb-machine': 'Yanlış kullanım uyarısı: ACT/heparinizasyon, prime, hava embolisi, pompa açık izlem ve protamin/koagülasyon doğrulaması yapılmadan KPB sürecini güvenli kabul etmek kardiyak cerrahide kritik güvenlik ihlalidir.',
                'cpb-phase-board': 'Yanlış kullanım uyarısı: KPB fazlarının tek kontrol gibi işaretlenmesi ACT, prime, pompa açık izlem, çıkış ve protamin güvenliğini görünmez kılar.',
                'cell-saver': 'Yanlış kullanım uyarısı: Hücre koruyucu aspirasyon/rezervuar/antikoagülasyon hattı kontrol edilmezse kontaminasyon, hemoliz, yanlış geri verme veya kan yönetimi hatası gelişebilir.',
                'postop-bleed-coag': 'Yanlış kullanım uyarısı: CABG sonrası kanama yalnız drenajla izlenirse koagülopati, protamin sorunu, hipotermi ve hemodinamik bozulma geç fark edilir.',
                'perfusionist': 'Yanlış kullanım uyarısı: Perfüzyonistle kapalı iletişim kurulmazsa pompa akımı, venöz dönüş, protamin/heparin ve ısı değişimleri geç fark edilir.',
                'graft-prep-table': 'Yanlış kullanım uyarısı: Greft hazırlama alanı sayım ve steril sınırdan koparsa kontaminasyon, yanlış materyal ve kesici-delici yaralanması riski artar; IMA/safen diseksiyon alanlarının karışması, safen venin kuruması, aşırı distansiyonu, yön kaybı, yan dal bütünlüğünün bozulması veya IMA pedikülünün travmatize edilmesi kondüit kalitesini bozar.',
                'cabg-device-audit': 'Yanlış kullanım uyarısı: Cihazlar var diye güvenli kabul etmek hatadır; cihaz–rol–görev eşleşmesi teyit edilmezse simülasyon kritik kararları ölçemez.'
            };
            return warnings[ck] || null;
        }
        function getTaskActionLabel(obj, task) {
            const actionText = getObjectActionText(obj);
            const objDone = objectMarkerDone(obj);
            if (!task) return actionText ? `Bu nesneden: ${actionText}` : 'Bu nesneden bağlı görevi tamamla';
            const ck = String(obj?.opts?.clinicalKey || '');
            const countActors = ['count-board', 'scrub-nurse-3d', 'circulating-nurse', 'surgeon'];
            if (countActors.includes(ck) && !objDone) return `Görevi tamamla: ${actionText || task.label} (sirküle + scrub + cerrah)`;
            if (countActors.includes(ck) && objDone) return `✓ ${actionText || task.label} tamamlandı (sirküle + scrub + cerrah)`;
            if (objDone) return `✓ ${actionText || task.label} tamamlandı`;
            if (taskDone(task)) return `Bu nesneyi de doğrula: ${actionText || task.label}`;
            return `Görevi tamamla: ${actionText || task.label}`;
        }
        function getObjectMicroScenario(obj) {
            const ck = String(obj?.opts?.clinicalKey || '');
            const scenarios = {
                'preop-crossmatch': {
                    banner: 'Kan hazırlığı için kısa klinik diyalog başlatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'Kan grubunuz ve crossmatch doğrulamanız dosyada hazır görünüyor.' },
                        { role: 'patient', text: 'Ameliyat sırasında gerekirse kan hemen ulaşılabilecek mi?' },
                        { role: 'nurse', text: 'Evet, doğrulama bu yüzden yapılıyor; gecikmeyi ve eşleşme hatasını önlüyoruz.' }
                    ]
                },
                'preop-allergy': {
                    banner: 'Alerji ve risk bilekliği için kısa diyalog başlatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'Bilekliğinizde ilaç alerjisi uyarısı var. Daha önce lateks ya da antibiyotik reaksiyonu yaşadınız mı?' },
                        { role: 'patient', text: 'Penisiline döküntü olmuştu, onu söylemiştim.' },
                        { role: 'nurse', text: 'Tamam, ekibi uyarıyorum ve ameliyat güvenliği için dosyayı tekrar işaretliyorum.' }
                    ]
                },
                'preop-medrec': {
                    banner: 'İlaç uzlaştırması için mikro senaryo oynatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'Bu sabah hangi ilaçlarınızı aldığınızı netleştirelim; özellikle kan sulandırıcı önemli.' },
                        { role: 'patient', text: 'Kan sulandırıcıyı doktorun dediği gibi dün bıraktım, tansiyon ilacımı aldım.' },
                        { role: 'nurse', text: 'Güzel, bunu dosyaya işliyorum; ameliyat sabahı ilaç hatasını böyle önlüyoruz.' }
                    ]
                },
                'preop-delirium': {
                    banner: 'Kognitif risk taraması için kısa görüşme başlatıldı.',
                    gesture: 'familyBrief',
                    lines: [
                        { role: 'nurse', text: 'Görme, işitme ya da son günlerde dalgınlık/uyku düzensizliği yaşadınız mı?' },
                        { role: 'patient', text: 'Gözlüğüm olmadan zor görüyorum, biraz da gerginim.' },
                        { role: 'nurse', text: 'Bu bilgiler önemli; ameliyat sonrası deliryum riskini azaltmak için not alıyorum.' }
                    ]
                },
                'preop-site-marker': {
                    banner: 'Taraf/bölge doğrulama diyaloğu başlatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'Ameliyat bölgesini ve dosyadaki planı birlikte doğruluyoruz.' },
                        { role: 'patient', text: 'Evet, işlem kalp ameliyatı için planlandı.' },
                        { role: 'nurse', text: 'İşaretleme ve onam uyumlu; yanlış taraf/yanlış işlem riskini böyle azaltıyoruz.' }
                    ]
                },
                'preop-anxiety': {
                    banner: 'Preoperatif anksiyete için destekleyici mini diyalog başlatıldı.',
                    gesture: 'familyBrief',
                    useRelative: true,
                    lines: [
                        { role: 'nurse', text: 'Şu an sizi en çok kaygılandıran şey nedir, kısaca konuşalım.' },
                        { role: 'patient', text: 'Ameliyat sonrası nasıl olacağımı düşünüp geriliyorum.' },
                        { role: 'nurse', text: 'Bu çok doğal; süreci size ve yakınınıza adım adım anlatacağım.' }
                    ]
                },
                'preop-transfer': {
                    banner: 'Transfer öncesi son güvenlik kontrolü canlandırıldı.',
                    gesture: 'familyBrief',
                    useRelative: true,
                    lines: [
                        { role: 'nurse', text: 'Kimlik, dosya, damar yolu ve ameliyat hazırlıkları tamam; birazdan transfer ediyoruz.' },
                        { role: 'relative', text: 'Bizden bu aşamada istenen başka bir şey var mı?' },
                        { role: 'nurse', text: 'Şimdilik yok; güvenli teslim için tüm son kontrolleri tamamlıyorum.' }
                    ]
                },
                'preop-vte': {
                    banner: 'VTE profilaksi hazırlığı için kısa hatırlatma diyaloğu başlatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'Bacaklara tromboz önleme ekipmanını hazırlıyoruz; bu dolaşımı desteklemek için gerekli.' },
                        { role: 'patient', text: 'Bu ameliyat öncesi mutlaka gerekli mi?' },
                        { role: 'nurse', text: 'Risk durumuna göre evet; pıhtı oluşumunu önlemeye yardımcı olur.' }
                    ]
                },
                'preop-clipper': {
                    banner: 'Cilt hazırlığı için mikro senaryo başlatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'Cerrahi alan hazırlığında gerekiyorsa jilet değil, güvenli clipper kullanıyoruz.' },
                        { role: 'patient', text: 'Neden özellikle buna dikkat ediyorsunuz?' },
                        { role: 'nurse', text: 'Çünkü uygunsuz tıraş cilt hasarı ve enfeksiyon riskini artırabilir.' }
                    ]
                },
                'postop-drain-card': {
                    banner: 'Dren izlemi için kısa klinik diyalog başlatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'Drenaj miktarınızı ve rengini saatli olarak izliyorum.' },
                        { role: 'patient', text: 'Bu tüplerin biraz canımı sıkması normal mi?' },
                        { role: 'nurse', text: 'Hafif rahatsızlık olabilir; ama ani artış ya da koyu renk olursa hemen değerlendiririz.' }
                    ]
                },
                'postop-urine': {
                    banner: 'Saatlik diürez izlemi için mikro senaryo başlatıldı.',
                    gesture: 'checkWrist',
                    lines: [
                        { role: 'nurse', text: 'İdrar miktarınızı saatlik takip ediyorum; dolaşım ve böbrek perfüzyonu için önemli.' },
                        { role: 'patient', text: 'Torbanın dolması neden bu kadar önemli?' },
                        { role: 'nurse', text: 'Çünkü sıvı dengesi ve erken bozulma bulguları buradan anlaşılabilir.' }
                    ]
                },
                'postop-pca': {
                    banner: 'Analjezi pompası için kısa diyalog başlatıldı.',
                    gesture: 'familyBrief',
                    lines: [
                        { role: 'nurse', text: 'Ağrınız olduğunda bu düğmeye siz basacaksınız; cihaz güvenli doz sınırında çalışır.' },
                        { role: 'patient', text: 'Yakınım benim yerime basabilir mi?' },
                        { role: 'nurse', text: 'Hayır, sadece siz kullanmalısınız; aşırı sedasyonu önlemek için bu önemli.' }
                    ]
                },
                'postop-pain-score': {
                    banner: 'Ağrı değerlendirmesi için mini diyalog başlatıldı.',
                    gesture: 'familyBrief',
                    lines: [
                        { role: 'nurse', text: 'Ağrınızı 0 ile 10 arasında puanlar mısınız?' },
                        { role: 'patient', text: 'Yaklaşık 6 gibi; özellikle hareket ederken artıyor.' },
                        { role: 'nurse', text: 'Tamam, müdahaleden sonra yeniden değerlendireceğim; sadece ilaç vermek yetmez.' }
                    ]
                },
                'postop-spirometer': {
                    banner: 'Solunum egzersizi eğitimi başlatıldı.',
                    gesture: 'familyBrief',
                    lines: [
                        { role: 'nurse', text: 'Bu cihazla derin nefes alıp yavaşça kaldıracağız; akciğerlerinizi açık tutmaya yardım eder.' },
                        { role: 'patient', text: 'Öksürünce ağrı oluyor, yine de yapmalı mıyım?' },
                        { role: 'nurse', text: 'Evet, kontrollü yapacağız; atelektazi ve sekresyon birikimini önlemek için önemli.' }
                    ]
                },
                'postop-ponv': {
                    banner: 'PONV / aspirasyon önleme mikro senaryosu başlatıldı.',
                    gesture: 'familyBrief',
                    lines: [
                        { role: 'nurse', text: 'Mideniz bulanırsa hemen haber verin; baş pozisyonunu ve kusma setini buna göre ayarlıyorum.' },
                        { role: 'patient', text: 'Biraz bulantım var, dönecek gibi hissediyorum.' },
                        { role: 'nurse', text: 'Tamam, sizi güvenli pozisyona alıp aspirasyon riskini azaltacağım.' }
                    ]
                },
                'postop-orientation': {
                    banner: 'Oryantasyon ve deliryum izlemi için kısa görüşme başlatıldı.',
                    gesture: 'familyBrief',
                    lines: [
                        { role: 'nurse', text: 'Şu an neredesiniz ve hangi ameliyattan çıktığınızı hatırlıyor musunuz?' },
                        { role: 'patient', text: 'Hastanedeyim... ama biraz sersem gibiyim.' },
                        { role: 'nurse', text: 'Bu bilgileri izliyorum; erken dönemde oryantasyon ve deliryum bulguları bizim için önemli.' }
                    ]
                },
                'postop-walker': {
                    banner: 'Erken mobilizasyon için kısa diyalog başlatıldı.',
                    gesture: 'familyBrief',
                    lines: [
                        { role: 'nurse', text: 'Ayağa kalkmadan önce ağrı, tansiyon ve hat güvenliğini kontrol ediyoruz.' },
                        { role: 'patient', text: 'Biraz başım döner gibi olursa ne yapacağım?' },
                        { role: 'nurse', text: 'Hemen duracağız; walker ve destekle kontrollü mobilizasyon yapacağız.' }
                    ]
                },
                'postop-fall-risk': {
                    banner: 'Düşme riski farkındalık diyaloğu başlatıldı.',
                    gesture: 'familyBrief',
                    useRelative: true,
                    lines: [
                        { role: 'nurse', text: 'Ameliyat sonrası dönemde düşme riski arttığı için hastayı yalnız kaldırmıyoruz.' },
                        { role: 'relative', text: 'Tuvalete gitmek isterse ben tek başıma yardımcı olmayayım mı?' },
                        { role: 'nurse', text: 'Hayır, lütfen bizi çağırın; sedasyon ve hipotansiyon düşmeye yol açabilir.' }
                    ]
                },
                'postop-discharge': {
                    banner: 'Taburculuk hazırlık diyaloğu başlatıldı.',
                    gesture: 'familyBrief',
                    useRelative: true,
                    lines: [
                        { role: 'nurse', text: 'Eve giderken yara bakımı, ilaçlar ve alarm bulgularını birlikte tekrar edeceğiz.' },
                        { role: 'relative', text: 'Ateş, kızarıklık ya da nefes darlığında ne yapacağımızı da yazabilir misiniz?' },
                        { role: 'nurse', text: 'Evet, hepsini size açıklayıp teach-back ile anladığınızı doğrulayacağım.' }
                    ]
                }
            };
            return scenarios[ck] || null;
        }

        function microSafe(value) {
            return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
        }
        function getMicroDecisionBank() {
            return {
                'cabg-device-audit': {
                    title: 'CABG cihaz denetimi kararı',
                    caseText: 'CABG vakasında anestezi, KPB, ESU, duman tahliye, aspirasyon, ısıtma, sayım, numune ve atık istasyonları sahada görünüyor; ekip kesiye hazırlanıyor.',
                    question: 'Cihaz denetiminde en güvenli yaklaşım hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation','communication'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'Cihazlar sahada bulunduğu için güvenli kabul eder.', rationale: 'Varlık güvenlik anlamına gelmez; cihaz–rol–görev eşleşmesi doğrulanmalıdır.', critical: true },
                        { text: 'Her cihazı ilgili rol, görev ve riskle eşleştirerek ekipçe sözlü doğrular.', rationale: 'Doğru. CABG güvenliği cihaz kontrolünü ekip iletişimi ve time-out ile bağlar.' },
                        { text: 'Yalnızca cerrahi lamba ve masa hazırsa kesiye izin verir.', rationale: 'CABG’de KPB, anestezi, ESU, ısı, sayım ve kanama hazırlığı birlikte kontrol edilmelidir.', critical: true }
                    ]
                },
                'cpb-machine': {
                    title: 'KPB 5 alt-faz güvenliği',
                    caseText: 'KPB platformu beş klinik alt-fazla izleniyor: KPB öncesi hazır oluş, ACT/heparin/prime, pompa açık, çıkış hazırlığı ve protamin/koagülasyon. ACT ve prime teyidi henüz sesli paylaşılmadı.',
                    question: 'En güvenli ekip kararı nedir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','communication','prioritisation'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'Makine çalışır görünüyorsa KPB’ye geçilebilir.', rationale: 'Görsel hazır oluş ACT, prime, hava embolisi ve pompa güvenliğini doğrulamaz.', critical: true },
                        { text: 'ACT/heparinizasyon, prime, oksijenatör, rezervuar, ısı değiştirici ve hava embolisi riskini perfüzyonistle sesli doğrular.', rationale: 'Doğru. CABG’de KPB güvenliği ekip teyidi gerektirir.' },
                        { text: 'Bu kontrol yalnızca perfüzyonistin sorumluluğudur; diğer ekip dinlemez.', rationale: 'KPB tüm ekibin kritik güvenlik bilgisidir.', critical: true }
                    ]
                },
                'cpb-phase-board': {
                    title: 'KPB beş klinik alt-faz kontrolü',
                    caseText: 'Faz panelinde KPB öncesi, ACT/heparin/prime, pompa açık, çıkış hazırlığı ve protamin/koagülasyon adımları görünüyor.',
                    question: 'Bu panel GCKL puanlamasına nasıl bağlanmalıdır?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','communication','prioritisation'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'KPB cihazı sahadaysa tüm fazları tamamlanmış kabul eder.', rationale: 'Cihaz varlığı faz güvenliği anlamına gelmez.', critical: true },
                        { text: 'Her fazı ayrı ekip teyidiyle yürütür; ACT/heparin/prime, pompa açık izlem, çıkış ve protamin kontrolünü GCKL görevlerine bağlar.', rationale: 'Doğru. Faz paneli GCKL puanlamasını klinik sıraya bağlar.' },
                        { text: 'Pompa açık fazından sonra diğer kontrolleri postop döneme bırakır.', rationale: 'KPB çıkışı ve protamin intraoperatif kritik güvenlik fazıdır.', critical: true }
                    ]
                },
                'cell-saver': {
                    title: 'Hücre koruyucu güvenliği',
                    caseText: 'CABG sırasında kan kaybı bekleniyor; hücre koruyucu rezervuar ve aspirasyon hattı hazır görünüyor.',
                    question: 'En güvenli cihaz kontrolü hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','surgicalNursingKnowledge'],
                    criticalKey: 'bleeding',
                    options: [
                        { text: 'Normal aspirasyonla aynı kabul eder.', rationale: 'Cell saver kan yönetimi cihazıdır; aspirasyon hattı, antikoagülasyon ve geri verme güvenliği ayrı doğrulanır.', critical: true },
                        { text: 'Aspirasyon hattı, antikoagülasyon, rezervuar seviyesi, filtre ve geri verme etiket/kayıt güvenliğini doğrular.', rationale: 'Doğru. Hücre koruyucu cihazı kan kaybı yönetimine bağlı güvenlik objesidir.' },
                        { text: 'Cihaz yalnız perfüzyoniste ait olduğu için hemşirelik izlemi gerektirmez.', rationale: 'Sirküle hemşire kan yönetimi, kayıt ve güvenli akışa katkı verir.', critical: true }
                    ]
                },
                'postop-bleed-coag': {
                    title: 'Postop kanama/koagülopati eskalasyonu',
                    caseText: 'Göğüs tüpü drenajı artmış, hasta hipotansif ve KPB sonrası protamin uygulanmış.',
                    question: 'En doğru eskalasyon davranışı nedir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation','communication'],
                    criticalKey: 'bleeding',
                    options: [
                        { text: 'Dren torbasını boşaltır ve yalnız kayıt tutar.', rationale: 'Hemodinamik bozulma ve koagülopati riski aktif eskalasyon gerektirir.', critical: true },
                        { text: 'SBAR ile cerrahi/anestezi ekibini bilgilendirir; drenaj, vital bulgular, Hb, ACT, PT/aPTT, fibrinojen/trombosit, ısı ve protamin bilgisini birlikte aktarır.', rationale: 'Doğru. CABG sonrası kanama ve koagülopati birlikte yönetilir.' },
                        { text: 'Önceliği ağrı kesiciye verir ve drenajı sonra değerlendirir.', rationale: 'Hipotansif ve kanamalı hastada bu gecikme yaratır.', critical: true }
                    ]
                },
                'perfusionist': {
                    title: 'Perfüzyonist iletişimi',
                    caseText: 'Pompa akımı ve hasta ısısı değişiyor; cerrahi ve anestezi ekipleri farklı ekranlara odaklanmış.',
                    question: 'En güvenli iletişim davranışı hangisidir?',
                    correct: 1,
                    categories: ['communication','patientSafety','clinicalAssessment'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'Perfüzyonistin ekranı takip ettiğini varsayar.', rationale: 'Varsayım kardiyak cerrahide güvenli değildir.', critical: true },
                        { text: 'Pompa akımı, venöz dönüş, ACT, ısı ve rezervuar seviyesini kapalı döngü iletişimle paylaşır.', rationale: 'Doğru. KPB süreci kapalı döngü ekip iletişimi gerektirir.' },
                        { text: 'Sadece kan basıncı düşerse perfüzyoniste döner.', rationale: 'Geç tepki; trend ve erken sapma izlenmelidir.', critical: true }
                    ]
                },
                'esu-unit': {
                    title: 'ESU / cerrahi yangın kararı',
                    caseText: 'Alkol bazlı cilt antiseptiği yeni uygulanmış, oksijen kullanımı var ve elektrokoter hazırlanıyor.',
                    question: 'Doğru güvenlik kararı nedir?',
                    correct: 1,
                    categories: ['patientSafety','prioritisation','clinicalAssessment'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'Koter düşük moddaysa hemen kullanılabilir.', rationale: 'Antiseptik kurumadan ve oksijen riski değerlendirilmeden koter kullanmak yangın riski doğurur.', critical: true },
                        { text: 'Prep kuruluğunu, oksijen birikimini, hasta plakasını ve duman tahliyeyi teyit eder; gerekirse kesiyi bekletir.', rationale: 'Doğru. Yangın üçgeni ekipçe yönetilmelidir.' },
                        { text: 'Yangın riski sadece anestezi ekibinin sorunudur.', rationale: 'Cerrahi yangın tüm ekibin ortak sorumluluğudur.', critical: true }
                    ]
                },
                'smoke-evac': {
                    title: 'Cerrahi duman tahliye kararı',
                    caseText: 'Koter aktif kullanılacak; duman tahliye hortumu sahadan uzakta ve filtre göstergesi sarı seviyede.',
                    question: 'Öğrenci ne yapmalıdır?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'Kısa süreli koterde duman tahliye gerekmez.', rationale: 'Cerrahi duman maruziyeti kısa kullanımda da oluşur.', critical: true },
                        { text: 'Filtre durumunu ve çekişi kontrol eder; hortumu duman kaynağına yakın konumlandırır.', rationale: 'Doğru. Duman tahliye ESU güvenliğinin parçasıdır.' },
                        { text: 'Sadece oda havalandırmasına güvenir.', rationale: 'Lokal duman tahliye yerine geçmez.', critical: true }
                    ]
                },
                'suction-smoke': {
                    title: 'Aspirasyon ve kapalı sistem kararı',
                    caseText: 'Cerrahi sahada sıvı birikiyor; aspirasyon hattı mevcut ama vakum ayarı ve kavanoz bağlantısı kontrol edilmedi.',
                    question: 'En güvenli yaklaşım hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'Hattı gördüğü için çalışır kabul eder.', rationale: 'Aspirasyon hattının varlığı vakum ve kapalı sistem güvenliğini kanıtlamaz.', critical: true },
                        { text: 'Vakum gücünü, kapalı hazneyi, hortum rotasını ve kontaminasyon riskini kontrol eder.', rationale: 'Doğru. Aspirasyon güvenliği sıvı/kan takibiyle birlikte değerlendirilir.' },
                        { text: 'Sıvı artarsa sadece spançla yönetir.', rationale: 'Görüş ve kan kaybı izlemi için güvenli aspirasyon gerekir.', critical: true }
                    ]
                },
                'positioning-set': {
                    title: 'CABG pozisyonlama kararı',
                    caseText: 'Hasta uzun sürecek CABG için supin pozisyonda; diyabet ve hipotermi riski var.',
                    question: 'Pozisyonlama açısından en doğru karar nedir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation'],
                    criticalKey: 'timeOut',
                    options: [
                        { text: 'Supin pozisyon güvenlidir; ek ped kontrolü gereksizdir.', rationale: 'Uzun cerrahi, diyabet ve hipotermi basınç yaralanması riskini artırır.', critical: true },
                        { text: 'Topuk, sakrum, dirsek ve kol tahtası desteğini kontrol eder; sinir basısı ve ısı yönetimini birlikte izler.', rationale: 'Doğru. CABG pozisyonlama aktif risk yönetimidir.' },
                        { text: 'Pozisyonu yalnızca cerrah isterse değerlendirir.', rationale: 'Hemşirelik güvenlik sorumluluğu ertelenemez.', critical: true }
                    ]
                },
                'graft-prep-table': {
                    title: 'Safen greft hazırlığı / GCKL kararı',
                    caseText: 'Back table operatif alana paralel kuruldu; safen ven segmenti heparinli salin ve kalite kontrol zonunda hazırlanıyor. Bu bölüm ayrı OSCE değildir; GCKL görev puanlamasına bağlı bir güvenli cerrahi kontrolüdür.',
                    question: 'Safen greft hazırlığında en güvenli düzenleme hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','surgicalNursingKnowledge','clinicalAssessment','communication'],
                    criticalKey: 'sterility',
                    options: [
                        { text: 'Safen veni hızlı erişim için keskin aletlerle aynı düzensiz alanda tutar.', rationale: 'Keskin/nötr alan ayrımı bozulur; kondüit travması, kontaminasyon ve sayım hatası riski artar.', critical: true },
                        { text: 'Safen veni görünür kalite zonunda tutar; heparinli solüsyon, orientasyon, nazik distansiyon, yan dal klipsleri, duvar bütünlüğü ve sayım bağlantısını GCKL kapsamında doğrular.', rationale: 'Doğru. Safen greft hazırlığı steril alan, sayım ve kondüit kalitesiyle birlikte yürüyen GCKL puanlı bir güvenlik davranışıdır.' },
                        { text: 'Safen greft kalitesi yalnızca cerrahın sorunudur; scrub hemşiresi sadece masanın steril kalmasına bakar.', rationale: 'Scrub hemşiresi safen görünürlüğü, solüsyon güvenliği, alan ayrımı ve ekip iletişimine aktif katkı verir.', critical: true }
                    ]
                },
                'waste-station': {
                    title: 'Atık ve kesici-delici ayrımı',
                    caseText: 'Kullanılmış bistüri ucu ve kanlı spançlar aynı tepsi üzerinde bekliyor.',
                    question: 'Doğru güvenlik davranışı nedir?',
                    correct: 1,
                    categories: ['patientSafety','prioritisation','surgicalNursingKnowledge'],
                    criticalKey: 'sharpSafety',
                    options: [
                        { text: 'Vaka bitince topluca ayrıştırır.', rationale: 'Açık kesici-delici bekletmek yaralanma ve kontaminasyon riski yaratır.', critical: true },
                        { text: 'Kesici-deliciyi sarı kutuya, kontamine materyali tıbbi atığa; temiz destek materyalini ayrı akışa yönlendirir.', rationale: 'Doğru. Atık güvenliği sirküle hattında anlık yönetilir.' },
                        { text: 'Steril alana yakın bir geçici atık yığını oluşturur.', rationale: 'Steril çekirdek ve kirli akış karışır.', critical: true }
                    ]
                },
                'preop-crossmatch': {
                    title: 'Kan hazırlığı / crossmatch kararı',
                    caseText: 'Dosyada kan hazırlığı alanı var; hasta, ameliyat sırasında kan gerekirse gecikme olup olmayacağını soruyor.',
                    question: 'Öğrenci hemşirenin en güvenli yaklaşımı hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation'],
                    criticalKey: 'bloodCrossmatch',
                    options: [
                        { text: 'Kan hazırlığını varsayarak hastayı transfer eder.', rationale: 'Varsayım güvenli değildir; kan hazırlığı dosya ve crossmatch ile doğrulanmalıdır.', critical: true },
                        { text: 'Kan grubu, crossmatch ve hazır ürün durumunu dosya ile doğrular; eksikse ekibe bildirir.', rationale: 'Doğru. Kanama riski olan cerrahilerde gecikme ve eşleşme hatasını önler.' },
                        { text: 'Kanama olursa o zaman crossmatch yapılmasını bekler.', rationale: 'Geç kalınmış olur; yüksek riskli cerrahide hazırlık önceden doğrulanmalıdır.', critical: true }
                    ]
                },
                'preop-allergy': {
                    title: 'Alerji doğrulama kararı',
                    caseText: 'Hasta penisilin alerjisi olduğunu söylüyor; bileklik ve dosya bilgisi net görünmüyor.',
                    question: 'Bu durumda doğru hemşirelik kararı nedir?',
                    correct: 1,
                    categories: ['patientSafety','communication','clinicalAssessment'],
                    criticalKey: 'allergy',
                    options: [
                        { text: 'Dosyada görünmüyorsa alerji yok kabul eder.', rationale: 'Hasta beyanı göz ardı edilemez; bu kritik güvenlik hatasıdır.', critical: true },
                        { text: 'Hastadan alerji ayrıntısını alır; bileklik, dosya ve anestezi/cerrahi ekip ile doğrular.', rationale: 'Doğru. Alerji doğrulaması çok kaynaklı yapılmalı ve ekip bilgilendirilmelidir.' },
                        { text: 'Rutin antibiyotik profilaksisini geciktirmeden uygulatır.', rationale: 'Alerji netleşmeden ilaç sürecine geçmek ciddi reaksiyon riski doğurur.', critical: true }
                    ]
                },
                'preop-medrec': {
                    title: 'İlaç uzlaştırma kararı',
                    caseText: 'Hasta kan sulandırıcıyı dün bıraktığını, tansiyon ilacını ise sabah aldığını söylüyor.',
                    question: 'En güvenli yaklaşım hangisidir?',
                    correct: 1,
                    categories: ['clinicalAssessment','patientSafety','prioritisation'],
                    criticalKey: 'medication',
                    options: [
                        { text: 'Hastanın beyanını yeterli kabul edip kayıt yapmadan ilerler.', rationale: 'Sadece sözlü beyan yeterli değildir; kayıt ve ekip doğrulaması gerekir.', critical: true },
                        { text: 'Son doz zamanını, ilaç adını ve cerrahi/anestezi planıyla uyumunu doğrular.', rationale: 'Doğru. Kanama, hipotansiyon ve ilaç etkileşimi riskini azaltır.' },
                        { text: 'Tüm ilaçların zaten hekim tarafından kontrol edildiğini varsayar.', rationale: 'Varsayım ilaç güvenliği için zayıf ve riskli bir yaklaşımdır.', critical: true }
                    ]
                },
                'preop-delirium': {
                    title: 'Deliryum / kognitif risk kararı',
                    caseText: 'Hasta gözlüğü olmadan zor gördüğünü ve gece uyuyamadığını söylüyor.',
                    question: 'Öğrenci hemşire neyi öncelemelidir?',
                    correct: 1,
                    categories: ['clinicalAssessment','communication','patientSafety'],
                    criticalKey: 'orientation',
                    options: [
                        { text: 'Bu bilgileri cerrahiyle ilgisiz görüp atlar.', rationale: 'Duyusal kayıp ve uyku bozukluğu deliryum riskini artırır.', critical: true },
                        { text: 'Duyusal destekleri, oryantasyon ihtiyacını ve aile desteğini bakım planına ekler.', rationale: 'Doğru. Deliryum önleme cerrahi öncesi risk tanıma ile başlar.' },
                        { text: 'Sadece postop dönemde bilinç değişikliği olursa ilgilenir.', rationale: 'Geç yaklaşım. Risk faktörleri önceden belirlenmelidir.', critical: true }
                    ]
                },
                'preop-site-marker': {
                    title: 'Cerrahi bölge/taraf doğrulama kararı',
                    caseText: 'Onam, hasta ifadesi ve işaretleme arasında küçük bir uyumsuzluk fark ediliyor.',
                    question: 'Doğru karar hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','prioritisation','communication'],
                    criticalKey: 'identitySite',
                    options: [
                        { text: 'Uyumsuzluğu küçük ayrıntı kabul ederek transferi sürdürür.', rationale: 'Yanlış taraf/işlem riski nedeniyle süreç durdurulmalıdır.', critical: true },
                        { text: 'Süreci durdurur; hasta, dosya, onam ve cerrahi ekiple doğrulama yapar.', rationale: 'Doğru. WHO güvenli cerrahi yaklaşımı bunu gerektirir.' },
                        { text: 'Ameliyathanede ekip fark eder diye not almadan ilerler.', rationale: 'Güvenlik doğrulaması ertelenemez; fark edilen uyumsuzluk hemen çözülmelidir.', critical: true }
                    ]
                },
                'preop-anxiety': {
                    title: 'Preoperatif anksiyete kararı',
                    caseText: 'Hasta ameliyat sonrası uyanamama korkusunu dile getiriyor; yakını da endişeli.',
                    question: 'En uygun hemşirelik yaklaşımı hangisidir?',
                    correct: 1,
                    categories: ['communication','patientCentredCare','clinicalAssessment'],
                    criticalKey: 'anxiety',
                    options: [
                        { text: 'Korkunun normal olduğunu söyleyip konuyu kapatır.', rationale: 'Geçiştirme terapötik değildir; kaygı bakım planına alınmalıdır.' },
                        { text: 'Kaygıyı değerlendirir, kısa açıklama yapar, soru sormaya izin verir ve destek planlar.', rationale: 'Doğru. Hasta-aile merkezli yaklaşım ve iletişim kalitesini artırır.' },
                        { text: 'Sadece hekim konuşursa hastanın rahatlayacağını söyler.', rationale: 'Hemşire eğitimi ve terapötik iletişim devredilemez.' }
                    ]
                },
                'preop-transfer': {
                    title: 'Transfer güvenliği kararı',
                    caseText: 'Transfer öncesi dosyada bir tetkik sonucu ve damar yolu bilgisi net değil.',
                    question: 'Ne yapılmalıdır?',
                    correct: 1,
                    categories: ['patientSafety','prioritisation','clinicalAssessment'],
                    criticalKey: 'transfer',
                    options: [
                        { text: 'Ameliyathanede tamamlanır düşüncesiyle transferi başlatır.', rationale: 'Eksik teslim ve gecikme riski doğurur.', critical: true },
                        { text: 'Transferi durdurur; dosya, damar yolu ve eksik tetkik bilgisini netleştirir.', rationale: 'Doğru. Güvenli transfer eksiksiz teslimle başlar.' },
                        { text: 'Sadece hasta yakınına bilgi vererek transfer eder.', rationale: 'Hasta yakını bilgilendirmesi yeterli değildir; klinik doğrulama gerekir.', critical: true }
                    ]
                },
                'preop-vte': {
                    title: 'VTE profilaksi kararı',
                    caseText: 'Hasta alt ekstremitede ağrı olduğunu söylüyor; mekanik profilaksi seti hazır.',
                    question: 'En güvenli karar nedir?',
                    correct: 1,
                    categories: ['clinicalAssessment','patientSafety','prioritisation'],
                    criticalKey: 'vte',
                    options: [
                        { text: 'Profilaksi setini doğrudan uygular.', rationale: 'Kontrendikasyon ve ekstremite durumu değerlendirilmeden uygulanmamalıdır.' },
                        { text: 'VTE riskini, ekstremite durumunu ve kontrendikasyonları değerlendirir; uygun ekipmanı hazırlar.', rationale: 'Doğru. Profilaksi bireysel risk ve güvenlik kontrolüyle planlanır.' },
                        { text: 'Sadece mobilizasyonu önerir, mekanik profilaksiyi değerlendirmez.', rationale: 'VTE önleme çok bileşenlidir; risk değerlendirmesi gerekir.' }
                    ]
                },
                'preop-clipper': {
                    title: 'Cilt hazırlığı / clipper kararı',
                    caseText: 'Hasta cerrahi alanı evde jiletle temizleyip temizlememesi gerektiğini soruyor.',
                    question: 'Doğru yanıt hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','surgicalNursingKnowledge','communication'],
                    criticalKey: 'skinPrep',
                    options: [
                        { text: 'Evde jiletle temizleyebileceğini söyler.', rationale: 'Jilet cilt bütünlüğünü bozabilir ve enfeksiyon riskini artırabilir.', critical: true },
                        { text: 'Gerekliyse uygun zamanda clipper kullanılacağını ve cilt bütünlüğünün korunacağını açıklar.', rationale: 'Doğru. Cilt hazırlığı güvenli yöntemle yapılmalıdır.' },
                        { text: 'Kıl temizliği her hastada mutlaka yapılır der.', rationale: 'Kıl temizliği rutin değil, gereklilik durumuna göre yapılır.' }
                    ]
                },
                'postop-drain-card': {
                    title: 'Drenaj artışı kararı',
                    caseText: 'Drenaj miktarı son saatte belirgin arttı ve renk parlak kırmızıya döndü.',
                    question: 'Öğrenci hemşirenin kararı ne olmalıdır?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation'],
                    criticalKey: 'drain',
                    options: [
                        { text: 'Normal postop drenaj diyerek kayda geçmeden izler.', rationale: 'Ani artış ve parlak kırmızı drenaj kanama açısından kritik olabilir.', critical: true },
                        { text: 'Hastanın vital bulgularını değerlendirir, drenajı saatli kaydeder ve ekibi bilgilendirir.', rationale: 'Doğru. Drenaj hemodinamiyle birlikte yorumlanmalıdır.' },
                        { text: 'Hastayı erken mobilize ederek drenajın azalmasını bekler.', rationale: 'Drenaj artışı varken mobilizasyon güvenli değildir.', critical: true }
                    ]
                },
                'postop-urine': {
                    title: 'Saatlik diürez kararı',
                    caseText: 'Postop saatlik idrar çıkışı beklenenden düşük; hasta hafif halsiz.',
                    question: 'En doğru yaklaşım hangisidir?',
                    correct: 1,
                    categories: ['clinicalAssessment','patientSafety','prioritisation'],
                    criticalKey: 'urineOutput',
                    options: [
                        { text: 'Hasta susuz kalmıştır diyerek sadece su içirmeyi planlar.', rationale: 'Postop oral alım ve sıvı dengesi klinik planla değerlendirilmelidir.' },
                        { text: 'Diürezi, sıvı dengesini, vital bulguları ve sonda akışını değerlendirir; gerekiyorsa ekibe bildirir.', rationale: 'Doğru. Diürez perfüzyon ve sıvı dengesinin erken göstergesidir.' },
                        { text: 'Sonda takılı olduğu için ölçümün güvenilir olmadığını varsayar.', rationale: 'Sonda ölçümü değerlidir; sistem ve akış kontrol edilmelidir.' }
                    ]
                },
                'postop-pca': {
                    title: 'PCA güvenliği kararı',
                    caseText: 'Hasta yakını, “Ağrısı olunca ben butona basabilir miyim?” diye soruyor.',
                    question: 'Öğrenci hemşire ne demelidir?',
                    correct: 1,
                    categories: ['patientSafety','communication','surgicalNursingKnowledge'],
                    criticalKey: 'pca',
                    options: [
                        { text: 'Evet, ağrısı varsa siz de basabilirsiniz.', rationale: 'PCA butonuna hasta yakınının basması aşırı sedasyon ve solunum depresyonu riski doğurur.', critical: true },
                        { text: 'Hayır, PCA butonuna yalnızca hasta basmalıdır; cihaz güvenli doz aralığında çalışır.', rationale: 'Doğru. PCA güvenliği hastanın kendi ağrı algısına göre kullanımına dayanır.' },
                        { text: 'Hemşire görmediği sürece basılabilir.', rationale: 'Bu açık bir güvenlik ihlalidir.', critical: true }
                    ]
                },
                'postop-pain-score': {
                    title: 'Ağrı skoru kararı',
                    caseText: 'Hasta ağrısını 6/10 bildiriyor; mobilizasyon ve solunum egzersizi planlanıyor.',
                    question: 'En doğru karar nedir?',
                    correct: 1,
                    categories: ['clinicalAssessment','prioritisation','communication'],
                    criticalKey: 'pain',
                    options: [
                        { text: 'Ağrı skoru yüksek olsa da mobilizasyona geçer.', rationale: 'Kontrolsüz ağrı solunum, mobilizasyon ve hemodinamiyi bozar.' },
                        { text: 'Ağrıyı yönetir, müdahale sonrası yeniden değerlendirir ve sonra mobilizasyon/egzersize geçer.', rationale: 'Doğru. Ağrı değerlendirme-müdahale-yeniden değerlendirme döngüsü gerekir.' },
                        { text: 'Ağrı subjektif olduğu için yalnızca vital bulgulara bakar.', rationale: 'Ağrı hastanın beyanıyla değerlendirilir; vital bulgular tek başına yeterli değildir.' }
                    ]
                },
                'postop-spirometer': {
                    title: 'Solunum egzersizi kararı',
                    caseText: 'Hasta öksürürken ağrı olduğunu ve spirometreyi kullanmak istemediğini söylüyor.',
                    question: 'En uygun hemşirelik yaklaşımı hangisidir?',
                    correct: 1,
                    categories: ['surgicalNursingKnowledge','communication','clinicalAssessment'],
                    criticalKey: 'respiratoryExercise',
                    options: [
                        { text: 'Ağrı varsa solunum egzersizini tamamen erteler.', rationale: 'Ertelenirse atelektazi ve sekresyon birikimi riski artar.' },
                        { text: 'Ağrı kontrolü, splinting ve doğru teknikle spirometre/öksürük egzersizini öğretir.', rationale: 'Doğru. Ağrı yönetimi solunum egzersizi ile birlikte yürütülmelidir.' },
                        { text: 'Cihazı bırakır; hasta isterse kendi kendine kullanır.', rationale: 'Eğitim ve teknik gözlem olmadan etkinlik düşer.' }
                    ]
                },
                'postop-ponv': {
                    title: 'PONV / aspirasyon kararı',
                    caseText: 'Hasta bulantısı olduğunu ve kusacak gibi hissettiğini söylüyor; oral alım planı var.',
                    question: 'Doğru karar nedir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation'],
                    criticalKey: 'ponv',
                    options: [
                        { text: 'Oral alımı başlatır; bulantı geçmezse sonra değerlendirir.', rationale: 'Kontrolsüz PONV aspirasyon ve yara gerilimi riskini artırır.', critical: true },
                        { text: 'Güvenli pozisyon verir, PONV riskini değerlendirir, antiemetik planını kontrol eder ve oral alımı bekletir.', rationale: 'Doğru. Öncelik aspirasyon riskini azaltmaktır.' },
                        { text: 'Hastaya kusma kabını verir ve tek başına bırakır.', rationale: 'Yalnız bırakmak aspirasyon ve güvenlik açısından yetersizdir.', critical: true }
                    ]
                },
                'postop-orientation': {
                    title: 'Oryantasyon / deliryum kararı',
                    caseText: 'Hasta sersem olduğunu söylüyor; zaman ve yer yanıtları gecikmeli.',
                    question: 'Doğru hemşirelik kararı nedir?',
                    correct: 1,
                    categories: ['patientSafety','clinicalAssessment','prioritisation'],
                    criticalKey: 'orientation',
                    options: [
                        { text: 'Anesteziden yeni çıktı diyerek değerlendirmeyi erteler.', rationale: 'Hipoaktif deliryum sessiz seyredebilir; erken izlem gerekir.', critical: true },
                        { text: 'Bilinç, oryantasyon, sedasyon ve deliryum bulgularını sistematik değerlendirir; güvenlik önlemi alır.', rationale: 'Doğru. Deliryum ve sedasyon ayrımı hasta güvenliği için kritiktir.' },
                        { text: 'Sadece ajitasyon gelişirse deliryumu düşünür.', rationale: 'Hipoaktif deliryum atlanabilir.', critical: true }
                    ]
                },
                'postop-walker': {
                    title: 'İlk mobilizasyon kararı',
                    caseText: 'Hasta ilk kez ayağa kalkacak; dren, IV hat ve hafif baş dönmesi var.',
                    question: 'En güvenli karar hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','prioritisation','clinicalAssessment'],
                    criticalKey: 'fallMobility',
                    options: [
                        { text: 'Walker olduğu için hastayı tek başına kaldırır.', rationale: 'İlk mobilizasyon yardım, vital bulgu ve hat/dren güvenliği gerektirir.', critical: true },
                        { text: 'Vital bulguları, ağrıyı, baş dönmesini, hat/dren güvenliğini ve yardım ihtiyacını değerlendirir.', rationale: 'Doğru. İlk mobilizasyon planlı ve güvenli yapılmalıdır.' },
                        { text: 'Baş dönmesi geçene kadar mobilizasyonu tamamen iptal eder.', rationale: 'Tam iptal yerine neden değerlendirilir ve uygun zamanda güvenli plan yapılır.' }
                    ]
                },
                'postop-fall-risk': {
                    title: 'Düşme riski kararı',
                    caseText: 'Hasta yakını, “Tuvalete gitmek isterse ben kaldırayım mı?” diye soruyor.',
                    question: 'En doğru cevap hangisidir?',
                    correct: 1,
                    categories: ['patientSafety','communication','prioritisation'],
                    criticalKey: 'fallMobility',
                    options: [
                        { text: 'Evet, siz destek olursanız yeterli olur.', rationale: 'Postop düşme riski profesyonel değerlendirme ve yardım gerektirir.', critical: true },
                        { text: 'Hayır, lütfen hemşireyi çağırın; sedasyon, hipotansiyon ve hat/drenler nedeniyle yalnız kaldırılmamalıdır.', rationale: 'Doğru. Hasta yakını güvenli mobilizasyon ekibinin yerine geçmez.' },
                        { text: 'Yatak korkuluğu inikse kendisi kalkabilir.', rationale: 'Bu ciddi düşme riski oluşturur.', critical: true }
                    ]
                },
                'postop-discharge': {
                    title: 'Taburculuk eğitimi kararı',
                    caseText: 'Hasta yakını, eve gidince hangi bulgularda hastaneye başvuracağını soruyor.',
                    question: 'Doğru yaklaşım hangisidir?',
                    correct: 1,
                    categories: ['communication','patientCentredCare','surgicalNursingKnowledge'],
                    criticalKey: 'discharge',
                    options: [
                        { text: 'Rutin kontrol randevusunu beklemelerini söyler.', rationale: 'Alarm bulguları olursa kontrol beklenmez; başvuru gerekir.', critical: true },
                        { text: 'Yara, ateş, ağrı, solunum, akıntı ve cerrahiye özgü alarm bulgularını anlatır; teach-back uygular.', rationale: 'Doğru. Taburculuk eğitimi anlaşılmayı doğrulamalıdır.' },
                        { text: 'Sadece yazılı form verir; sözlü tekrar gerekmez.', rationale: 'Yazılı materyal tek başına yeterli değildir; anlama doğrulanmalıdır.' }
                    ]
                }
            };
        }
        function getMicroScenarioDecision(obj, sc) {
            const ck = String(obj?.opts?.clinicalKey || '');
            const bank = getMicroDecisionBank();
            if (bank[ck]) return { ...bank[ck], key: ck };
            const talkKey = getObjectCriticalTalkKey(obj) || 'genericDecision';
            return {
                key: ck || talkKey,
                title: `${obj?.label || 'Klinik nesne'} kararı`,
                caseText: 'Bu nesne ile ilgili klinik karar hastadan alınan bilgi, dosya doğrulaması ve ekip iletişimiyle birlikte verilmelidir.',
                question: 'En güvenli yaklaşım hangisidir?',
                correct: 1,
                categories: ['clinicalReasoning','patientSafety','communication'],
                criticalKey: talkKey,
                options: [
                    { text: 'Varsayım yaparak ilerlerim.', rationale: 'Varsayıma dayalı karar hasta güvenliği açısından zayıftır.', critical: true },
                    { text: 'Hastadan bilgi alır, dosyayla doğrular ve gerekiyorsa ekibe bildiririm.', rationale: 'Doğru. Klinik karar hasta beyanı, kayıt ve ekip doğrulamasıyla güvenli olur.' },
                    { text: 'Sadece nesnenin varlığını yeterli kabul ederim.', rationale: 'Nesnenin varlığı bakımın güvenli yürütüldüğünü göstermez.', critical: true }
                ]
            };
        }
        function ensureMicroDecisionModal() {
            let modal = document.getElementById('micro-decision-modal');
            if (modal) return modal;
            modal = document.createElement('div');
            modal.id = 'micro-decision-modal';
            modal.className = 'micro-decision-backdrop';
            modal.innerHTML = `
                <div class="micro-decision-card" role="dialog" aria-modal="true">
                    <div class="micro-decision-head">
                        <div>
                            <div class="micro-decision-tag">Seçimli klinik karar</div>
                            <div class="micro-decision-title" id="micro-decision-title">Karar</div>
                        </div>
                        <button class="micro-decision-close" id="micro-decision-close" aria-label="Kapat">×</button>
                    </div>
                    <div class="micro-decision-case" id="micro-decision-case"></div>
                    <div class="micro-decision-question" id="micro-decision-question"></div>
                    <div class="micro-decision-options" id="micro-decision-options"></div>
                    <div class="micro-decision-result" id="micro-decision-result"></div>
                    <div class="micro-decision-actions">
                        <button id="micro-decision-retry">Tekrar dene</button>
                        <button class="primary" id="micro-decision-done">Kapat</button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            modal.querySelector('#micro-decision-close').onclick = () => modal.classList.remove('visible');
            modal.querySelector('#micro-decision-done').onclick = () => modal.classList.remove('visible');
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('visible'); });
            return modal;
        }
        function getMicroDecisionRule(decision, option, obj) {
            const baseKey = decision.criticalKey || getObjectCriticalTalkKey(obj) || decision.key || 'microDecision';
            const baseRule = getRuleForObjectKey(baseKey);
            return {
                key: `micro:${App.currentPatient?.id || 'case'}:${App.currentRoom}:${decision.key}:${option.text.slice(0,18)}`,
                title: `Yanlış klinik karar: ${decision.title}`,
                error: `Kritik karar hatası: ${option.text}`,
                rationale: option.rationale || baseRule.rationale || 'Bu seçim hasta güvenliğini zayıflatır.',
                fix: baseRule.fix || 'Hastaya ilgili güvenlik sorusunu sor, dosya ve ekip ile doğrula.',
                penalty: option.critical ? { patientSafety:15, clinicalAssessment:8, prioritisation:8, communication:5 } : { clinicalAssessment:6, communication:3 }
            };
        }
        function getTaskByIdLocal(taskId, phaseName = App.currentRoom) {
            return App.currentPatient?.[phaseName]?.tasks?.find(t => t.id === taskId) || null;
        }
        function markMicroDecisionResult(decision, option, correct, obj) {
            App.microDecisionResults = App.microDecisionResults || {};
            App.microDecisionResults[`${App.currentPatient?.id || 'case'}:${App.currentRoom}:${decision.key}`] = { correct, selected: option.text, ts: Date.now() };
            App.actionSequence = App.actionSequence || [];
            App.actionSequence.push({ t: Date.now(), phase: App.currentRoom, kind: 'micro_decision', tag: decision.key, payload: option.text, ok: correct });
            if (correct) {
                const talkKey = getObjectCriticalTalkKey(obj) || decision.criticalKey;
                if (talkKey) markCriticalCommunication(talkKey, obj?.label || decision.title);
                addScore(decision.categories || ['clinicalReasoning'], 6, 0);
                addPhaseScore(App.currentRoom, 3, 0);
                App.feedbackEntries.push({ ok:true, label: decision.title, kind:'micro_decision', guideline:'clinical_reasoning', phase:App.currentRoom, desc: option.rationale });
                const taskId = obj?.opts?.taskId;
                const task = taskId ? getTaskByIdLocal(taskId) : null;
                if (task && !App.completedTasks.includes(task.id)) completeTask(task.id, obj);
                showSceneReaction(`Doğru klinik karar: ${decision.title}`, 'ok');
            } else {
                const rule = getMicroDecisionRule(decision, option, obj);
                showCriticalSafetyError(rule);
                App.feedbackEntries.push({ ok:false, label: decision.title, kind:'micro_decision_error', guideline:'patient_safety', phase:App.currentRoom, desc: option.rationale });
                showSceneReaction(`Yanlış karar: ${decision.title}. Kritik uyarı oluşturuldu.`, 'warn');
            }
            updateProgress?.();
            renderTasks?.();
        }
        function showMicroDecisionModal(obj, sc) {
            const decision = getMicroScenarioDecision(obj, sc);
            const modal = ensureMicroDecisionModal();
            const title = modal.querySelector('#micro-decision-title');
            const caseBox = modal.querySelector('#micro-decision-case');
            const question = modal.querySelector('#micro-decision-question');
            const opts = modal.querySelector('#micro-decision-options');
            const result = modal.querySelector('#micro-decision-result');
            const retry = modal.querySelector('#micro-decision-retry');
            title.textContent = decision.title;
            caseBox.textContent = decision.caseText;
            question.textContent = decision.question;
            result.className = 'micro-decision-result';
            result.innerHTML = '';
            opts.innerHTML = '';
            const codes = ['A', 'B', 'C', 'D'];
            let answered = false;
            decision.options.forEach((option, idx) => {
                const btn = document.createElement('button');
                btn.className = 'micro-decision-option';
                btn.innerHTML = `<span class="opt-code">${codes[idx] || (idx+1)}</span><span class="opt-text">${microSafe(option.text)}</span>`;
                btn.onclick = () => {
                    if (answered) return;
                    answered = true;
                    const correct = idx === decision.correct;
                    [...opts.children].forEach((child, cidx) => {
                        child.disabled = true;
                        if (cidx === decision.correct) child.classList.add('correct');
                    });
                    if (!correct) btn.classList.add('wrong');
                    result.className = 'micro-decision-result visible ' + (correct ? 'ok' : 'bad');
                    result.innerHTML = `<b>${correct ? 'Doğru karar.' : 'Yanlış karar.'}</b><br>${microSafe(option.rationale || '')}`;
                    markMicroDecisionResult(decision, option, correct, obj);
                };
                opts.appendChild(btn);
            });
            retry.onclick = () => showMicroDecisionModal(obj, sc);
            modal.classList.add('visible');
        }
        function playObjectMicroScenario(obj) {
            const sc = getObjectMicroScenario(obj);
            if (!sc) return showSceneReaction('Bu nesne için henüz mikro senaryo tanımlanmadı.', 'warn');
            stopClinicalMotions();
            const room = App.currentRoom;
            const nurseKey = room === 'preop' ? 'preop-nurse-3d' : (room === 'postop' ? 'pacu-nurse-3d' : null);
            const nurse = nurseKey ? getActor(nurseKey) : null;
            const relative = getActor('family-relative-3d');
            const ox = obj?.mesh?.position?.x || 0;
            const oz = obj?.mesh?.position?.z || 0;
            const target = [ox, 1.0, oz];
            if (nurse) {
                const nx = ox + (room === 'preop' ? -0.55 : -0.70);
                const nz = oz + (room === 'preop' ? -0.55 : 0.35);
                pathMove(nurse, [[nurse.mesh.position.x, 0, nurse.mesh.position.z], [nx, 0, nz]], 0.05, 2.55, 'Mikro senaryo');
                scheduleMotion({ type:'faceAt', actor:nurse, delay:2.7, duration:0.1, target: vec(ox, 1.0, oz) });
                gesture(nurse, sc.gesture || 'familyBrief', 2.85, 2.55, target);
            }
            if (sc.useRelative && relative) {
                scheduleMotion({ type:'faceAt', actor:relative, delay:2.75, duration:0.1, target: vec(ox, 1.0, oz) });
                gesture(relative, 'familyBrief', 2.95, 2.20, target);
            }
            const roleColor = { nurse: 0x5cc4d6, patient: 0xe0a558, relative: 0xd1c4e9 };
            const labelPos = (role) => {
                if (role === 'nurse' && nurse) return { x: nurse.mesh.position.x - 0.15, y: 2.35, z: nurse.mesh.position.z + 0.05 };
                if (role === 'relative' && relative) return { x: relative.mesh.position.x - 0.10, y: 2.20, z: relative.mesh.position.z + 0.15 };
                return { x: ox + 0.25, y: 2.05, z: oz + (role === 'patient' ? 0.15 : 0.35) };
            };
            let delay = 3.0;
            (sc.lines || []).forEach((line) => {
                const pos = labelPos(line.role || 'patient');
                const prefix = line.role === 'nurse' ? 'Hemşire' : (line.role === 'relative' ? 'Hasta yakını' : 'Hasta');
                floatingLabel(`${prefix}: ${line.text}`, pos.x, pos.y, pos.z, delay, 3.15, roleColor[line.role || 'patient'] || 0x5cc4d6);
                delay += 0.78;
            });
            const prof = getProfileObjectContent(obj);
            if (prof) {
                floatingLabel(`Profil uyarısı: ${prof.alarm}`, ox + 0.28, 2.34, oz + 0.45, delay + 0.15, 3.6, 0xff4d5d);
            }
            showSceneReaction(sc.banner || `${obj.label} için mikro senaryo başlatıldı.`, 'info');
            const decisionDelay = Math.min(6200, Math.max(1800, (sc.lines?.length || 3) * 850 + 900));
            setTimeout(() => showMicroDecisionModal(obj, sc), decisionDelay);
        }
        function callNurseToRelative(nurseKey) {
            const nurse = getActor(nurseKey);
            const relative = getActor('family-relative-3d');
            if (!nurse || !relative) return showSceneReaction('Aile yakını veya hemşire sahnede bulunamadı.', 'warn');
            stopClinicalMotions();
            const room = App.currentRoom;
            const rx = relative.mesh.position.x;
            const rz = relative.mesh.position.z;
            if (warmRoom) {
                const meet = [rx - 0.72, 0, rz - 0.02];
                pathMove(nurse, [[nurse.mesh.position.x, 0, nurse.mesh.position.z], [rx - 1.45, 0, rz - 0.65], meet], 0.05, 3.4, 'Aile yakınına git');
                scheduleMotion({ type:'faceAt', actor:nurse, delay:3.55, duration:0.1, target: vec(rx, 1.0, rz) });
                scheduleMotion({ type:'faceAt', actor:relative, delay:3.55, duration:0.1, target: vec(meet[0], 1.0, meet[2]) });
                gesture(nurse, 'familyBrief', 3.65, 3.6, [rx,1.0,rz]);
                gesture(relative, 'familyBrief', 3.85, 3.0, [meet[0],1.0,meet[2]]);
                floatingLabel('Hemşire: Hazırlık sürecini ve bekleme adımlarını sizinle paylaşayım.', rx - 0.95, 2.45, rz - 0.30, 3.75, 3.5, 0x9b89c4);
                floatingLabel('Hasta yakını: Ameliyat öncesi özellikle dikkat etmem gereken bir durum var mı?', rx - 0.10, 2.10, rz + 0.35, 4.05, 3.0, 0xd1c4e9);
                showSceneReaction('Hemşire aile yakınının yanına gidip preoperatif bilgilendirmeyi başlattı.', 'info');
            } else if (room === 'postop') {
                const meet = [rx - 0.78, 0, rz - 0.06];
                pathMove(nurse, [[nurse.mesh.position.x, 0, nurse.mesh.position.z], [rx - 2.20, 0, rz + 0.20], [rx - 1.25, 0, rz + 0.05], meet], 0.05, 4.0, 'Aile yakınına git');
                scheduleMotion({ type:'faceAt', actor:nurse, delay:4.15, duration:0.1, target: vec(rx, 1.0, rz) });
                scheduleMotion({ type:'faceAt', actor:relative, delay:4.15, duration:0.1, target: vec(meet[0], 1.0, meet[2]) });
                gesture(nurse, 'familyBrief', 4.25, 3.7, [rx,1.0,rz]);
                gesture(relative, 'familyBrief', 4.45, 3.1, [meet[0],1.0,meet[2]]);
                floatingLabel('Hemşire: Hastanızın şu anki durumu stabil; izlem ve bir sonraki adımları açıklayayım.', rx - 1.20, 2.45, rz - 0.05, 4.35, 3.6, 0x9b89c4);
                floatingLabel('Hasta yakını: Ağrı, bilinç veya solunum açısından evde neye dikkat etmeliyim?', rx - 0.15, 2.10, rz + 0.45, 4.70, 3.0, 0xd1c4e9);
                showSceneReaction('Hemşire aile yakınının yanına gidip postop bilgilendirmeyi başlattı.', 'info');
            } else {
                showSceneReaction('Hemşire çağırma diyaloğu bu faz için tanımlı değil.', 'warn');
            }
        }
        function openEducationPlan(key) {
            const p = App.currentPatient;
            const plan = p.educationContent?.patientEducation?.[key];
            const labels = { preop: 'Preoperatif Eğitim', postop: 'Postoperatif Eğitim', discharge: 'Taburculuk Eğitimi' };
            $('#education-tag').textContent = `${p.shortSurgery} · ${labels[key] || 'Hasta Eğitimi'}`;
            $('#education-title').textContent = plan?.title || labels[key] || 'Hasta Eğitimi';
            $('#education-body').innerHTML = renderEducationPlanHTML(plan);
            $('#education-modal').classList.add('visible');
        }
        function copyEducationModalText() {
            const txt = $('#education-body')?.innerText || '';
            if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => showToast('Eğitim metni kopyalandı.', 'success'));
            else showToast('Kopyalama bu tarayıcıda desteklenmedi.', 'warning');
        }

        function getVitalMeta(k, raw) {
            const meta = {
                'TA': { range: 'Normal: 90–139 / 60–89 mmHg' },
                'NB': { range: 'Normal: 60–100 atım/dk' },
                'SS': { range: 'Normal: 12–20 /dk' },
                'SpO₂': { range: 'Normal: 95–100%' },
                'T': { range: 'Normal: 36.0–37.5°C' }
            }[k] || { range: '' };

            let status = 'vital-normal';
            if (k === 'TA') {
                const m = String(raw).match(/(\d+)\s*\/\s*(\d+)/);
                const sys = m ? Number(m[1]) : NaN;
                const dia = m ? Number(m[2]) : NaN;
                if (!Number.isNaN(sys) && !Number.isNaN(dia)) {
                    if (sys < 80 || dia < 50 || sys >= 180 || dia >= 120) status = 'vital-critical';
                    else if (sys < 90 || dia < 60 || sys >= 140 || dia >= 90) status = 'vital-high';
                }
            } else if (k === 'NB') {
                const n = Number(raw);
                if (!Number.isNaN(n)) {
                    if (n < 40 || n > 130) status = 'vital-critical';
                    else if (n < 60 || n > 100) status = 'vital-high';
                }
            } else if (k === 'SS') {
                const n = Number(raw);
                if (!Number.isNaN(n)) {
                    if (n < 8 || n > 30) status = 'vital-critical';
                    else if (n < 12 || n > 20) status = 'vital-high';
                }
            } else if (k === 'SpO₂') {
                const n = Number(String(raw).replace('%',''));
                if (!Number.isNaN(n)) {
                    if (n < 90) status = 'vital-critical';
                    else if (n < 95) status = 'vital-low';
                }
            } else if (k === 'T') {
                const n = Number(String(raw).replace('°','').replace(',', '.'));
                if (!Number.isNaN(n)) {
                    if (n < 35.0 || n >= 39.0) status = 'vital-critical';
                    else if (n < 36.0 || n > 37.5) status = 'vital-high';
                }
            }
            return { status, range: meta.range };
        }
        function buildVital(k, v, u) {
            const info = getVitalMeta(k, v);
            const x = el('div', 'vital ' + info.status);
            x.innerHTML = `<div class="vk">${k}</div><div class="vv">${v}</div><div class="vu">${u}</div><div class="vr">${info.range}</div>`;
            return x;
        }

        function buildSymptomPanel() {
            const w = el('div', 'selection-shell');
            const phase = App.currentPatient[App.currentRoom];
            const selectedCount = App.selectedSymptoms[App.currentRoom].length;
            const totalCount = (phase.symptoms || []).length;
            const confirmed = App.symptomsConfirmed[App.currentRoom];
            const banner = el('div', 'diag-task-banner');
            banner.innerHTML = `
                <div class="selection-banner-head">
                    <div>
                        <div class="selection-kicker">Semptom değerlendirmesi</div>
                        <div class="selection-title">Bu faz için hastada görülebilecek klinik bulguları seçin.</div>
                    </div>
                    <div class="selection-state ${confirmed ? 'done' : 'active'}">${confirmed ? 'Tamamlandı' : 'Aktif görev'}</div>
                </div>
                <div class="selection-banner-copy">${confirmed ? 'Seçimleriniz kaydedildi. İsterseniz mevcut seçimi inceleyebilirsiniz.' : 'Sınır yok. İlgili bulgular puan kazandırır; faz dışı ya da alakasız seçimler puan kaybettirir.'}</div>
                <div class="selection-stats"><span class="selection-pill"><b>${selectedCount}</b> seçili</span><span class="selection-pill"><b>${totalCount}</b> olası bulgu</span><span class="selection-pill"><b>${App.currentRoom.toUpperCase()}</b> fazı</span></div>`;
            w.appendChild(banner);
            const grid = el('div', 'symptom-grid');
            (phase.symptoms || []).forEach(s => {
                const sel = App.selectedSymptoms[App.currentRoom].includes(s);
                const chip = el('button', 'symptom-chip' + (sel ? ' selected' : ''), `<span class="symptom-chip-dot"></span><span class="symptom-chip-text">${s}</span>`);
                chip.type = 'button';
                chip.onclick = () => {
                    if (App.symptomsConfirmed[App.currentRoom]) return;
                    if (sel) App.selectedSymptoms[App.currentRoom] = App.selectedSymptoms[App.currentRoom].filter(x => x !== s);
                    else App.selectedSymptoms[App.currentRoom].push(s);
                    renderLeftPanel();
                };
                grid.appendChild(chip);
            });
            w.appendChild(grid);
            const btn = el('button', 'btn-confirm-diag', confirmed ? 'Semptom Seçimi Kaydedildi' : 'Semptom Seçimini Onayla');
            btn.disabled = selectedCount === 0 || confirmed;
            btn.onclick = confirmSymptomSelection;
            w.appendChild(btn);
            return w;
        }

        function confirmSymptomSelection() {
            const room = App.currentRoom;
            const phase = App.currentPatient[room];
            const correctList = phase.correctSymptoms || [];
            const selected = App.selectedSymptoms[room];
            
            let earned = 0;
            const matched = [];
            const wrong = [];

            selected.forEach(s => {
                if(correctList.includes(s)) {
                    earned += 5;
                    matched.push(s);
                } else {
                    earned -= 2;
                    wrong.push(s);
                }
            });
            
            const missing = correctList.filter(s => !selected.includes(s));
            
            addScore(['clinicalAssessment', 'prioritisation', 'surgicalNursingKnowledge'], earned, 0); // Max is precalculated
            addPhaseScore(room, earned, 0);

            App.symptomsConfirmed[room] = true;
            App.feedbackEntries.push({ ok: earned > 0 && matched.length >= correctList.length * 0.5, label: `Semptom seçimi`, kind: 'symptom', phase: room, detail: { matched, wrong, missing } });
            autoScoreOSCEFromSymptom(room, earned > 0 && matched.length >= correctList.length * 0.5, { matched: matched.length, wrong: wrong.length, missing: missing.length });
            recomputeAllOSCEItems(); // semptom kanıtı tüm maddelere yansısın
            toast(earned > 0 ? 'success' : 'warning', 'Seçim Kaydedildi', `Doğru: ${matched.length}, Yanlış: ${wrong.length}, Eksik: ${missing.length}`);
            
            renderLeftPanel();
            renderRightPanel();
            updateScoreStrip();
        }

        function buildDiagnosisPanel() {
            const w = el('div', 'selection-shell');
            const phase = App.currentPatient[App.currentRoom];
            const selectedCount = App.selectedDiagnoses[App.currentRoom].length;
            const totalCount = (phase.diagnoses || []).length;
            const confirmed = App.diagnosesConfirmed[App.currentRoom];
            const highCount = (phase.diagnoses || []).filter(d => d.priority === 'high').length;
            const banner = el('div', 'diag-task-banner');
            banner.innerHTML = `
                <div class="selection-banner-head">
                    <div>
                        <div class="selection-kicker">Hemşirelik tanısı</div>
                        <div class="selection-title">Bu faz için klinik açıdan öncelikli tanıları seçin.</div>
                    </div>
                    <div class="selection-state ${confirmed ? 'done' : 'active'}">${confirmed ? 'Tamamlandı' : 'Aktif görev'}</div>
                </div>
                <div class="selection-banner-copy">${confirmed ? 'Tanı seçimleriniz kaydedildi. Kartları genişletip gerekçe ve girişimleri inceleyebilirsiniz.' : 'Sınır yok. Uygun tanılar puan kazandırır; alakasız seçimler puan kaybettirir. Sağ tık ile ayrıntıyı açabilirsiniz.'}</div>
                <div class="selection-stats"><span class="selection-pill"><b>${selectedCount}</b> seçili</span><span class="selection-pill"><b>${totalCount}</b> tanı kartı</span><span class="selection-pill"><b>${highCount}</b> yüksek öncelik</span></div>`;
            w.appendChild(banner);
            const list = el('div', 'diag-list');
            phase.diagnoses.forEach(d => list.appendChild(buildDiagCard(d)));
            w.appendChild(list);
            const btn = el('button', 'btn-confirm-diag', confirmed ? 'Tanı Seçimi Kaydedildi' : 'Tanı Seçimini Onayla');
            btn.disabled = App.selectedDiagnoses[App.currentRoom].length < 1 || confirmed;
            btn.onclick = confirmDiagnosisSelection;
            w.appendChild(btn);

            if (App.diagnosesConfirmed[App.currentRoom] && App.aiMode) {
                const aiPlanBtn = el('button', 'rd-action ai-action', '✨ AI Bakım Planı Taslağı Oluştur');
                aiPlanBtn.style.width = '100%';
                aiPlanBtn.style.marginTop = '12px';
                const aiPlanRes = el('div', 'ai-result-box');
                aiPlanBtn.onclick = async () => {
                    aiPlanBtn.textContent = '✨ Plan oluşturuluyor...';
                    aiPlanBtn.disabled = true;
                    const p = App.currentPatient;
                    const selectedTitles = App.selectedDiagnoses[App.currentRoom].map(id => phase.diagnoses.find(d => d.id === id).title);
                    const prompt = `Sen uzman bir cerrahi hemşireliği eğitmenisin. Hasta: ${p.name}, Yaş: ${p.age}, Cerrahi: ${p.surgery}. Öğrenci şu hemşirelik tanılarını seçti: ${selectedTitles.join(', ')}. Bu tanılara yönelik kanıta dayalı (NANDA/NIC/NOC formatından ilham alan) çok kısa ve öz bir bakım planı oluştur. Her tanı için 1 beklenen sonuç ve 2 kritik hemşirelik girişimi yaz. Markdown formatında madde imleri kullan, ancak çok kısa tut.`;
                    const planText = await callGeminiAPI(prompt);
                    aiPlanRes.innerHTML = `<b style="color:var(--violet)">✨ AI Bakım Planı:</b><br><div style="margin-top:6px; line-height:1.5">${planText.replace(/\n/g, '<br>')}</div>`;
                    aiPlanRes.style.display = 'block';
                    aiPlanBtn.style.display = 'none';
                };
                w.appendChild(aiPlanBtn);
                w.appendChild(aiPlanRes);
            }
            return w;
        }

        function buildDiagCard(d) {
            const room = App.currentRoom;
            const sel = App.selectedDiagnoses[room].includes(d.id);
            const card = el('div', `diag-card ${d.priority}` + (sel ? ' selected' : ''));
            const prio = { high: 'YÜKSEK', medium: 'ORTA', low: 'DÜŞÜK' } [d.priority] || 'DÜŞÜK';
            const interventions = d.interventions || [];
            card.innerHTML = `<div class="dh"><div class="dh-left"><div class="check">✓</div><div class="dh-title">${d.title}</div></div><span class="dh-prio">${prio}</span></div><div class="db"><div class="row"><b>İlişkili Faktörler</b>${(d.factors||[]).join(' · ')}</div><div class="row"><b>Belirti / Kanıtlar</b>${(d.evidence||[]).join(' · ')}</div><div class="row"><b>Beklenen Sonuç</b>${(d.expectedOutcomes||[]).join(' · ')}</div><div class="row"><b>Hemşirelik Girişimleri</b>${interventions.map(i=>'· '+i).join('<br>')}</div><div class="row"><b>Klinik Gerekçe</b>${d.rationale||''}</div><div class="gline-tags">${(d.guidelines||[]).map(g=>`<span class="gline-tag">${GUIDELINE_THEMES[g]?.tag||g}</span>`).join('')}</div></div>`;
            card.querySelector('.dh').onclick = (e) => { 
                if (App.diagnosesConfirmed[room]) { card.classList.toggle('expanded'); return; } 
                if (sel) { App.selectedDiagnoses[room] = App.selectedDiagnoses[room].filter(x => x !== d.id); } 
                else { 
                    App.selectedDiagnoses[room].push(d.id); 
                }
                renderLeftPanel(); 
            };
            card.querySelector('.dh').oncontextmenu = (e) => { e.preventDefault(); card.classList.toggle('expanded'); };
            return card;
        }

        function confirmDiagnosisSelection() {
            const room = App.currentRoom;
            const phase = App.currentPatient[room];
            const selectedIds = App.selectedDiagnoses[room];
            
            let earned = 0;
            let highCount = 0, mediumCount = 0, lowCount = 0;
            const matched = [];      // doğru, yüksek öncelikli
            const partial = [];      // ilgili ama düşük/orta öncelikli
            const irrelevant = [];   // alakasız / faz dışı / kanıtı olmayan

            selectedIds.forEach(id => {
                const diag = phase.diagnoses.find(d => d.id === id);
                if (!diag) return;
                // Öncelik bazlı puanlama — sayı sınırı yok.
                if (diag.relevance === 'correct') {
                    if (diag.priority === 'high')      { earned += 8; highCount++;   matched.push(diag.title); }
                    else if (diag.priority === 'medium'){ earned += 4; mediumCount++; partial.push(diag.title); }
                    else                                { earned += 2; lowCount++;    partial.push(diag.title); }
                } else if (diag.relevance === 'low') {
                    earned += 1; lowCount++; partial.push(diag.title);
                } else {
                    // Alakasız / faz dışı / kanıtı yok → ceza + irrelevantDiagnoses kaydı
                    earned -= 5;
                    irrelevant.push({ id: diag.id, title: diag.title, priority: diag.priority || null, relevance: diag.relevance || 'incorrect' });
                }
            });

            // Hiç doğru öncelikli tanı yakalanamadıysa küçük ek ceza (kritik tanı atlama sinyali).
            if (highCount === 0) earned -= 3;

            // irrelevantDiagnoses kaydını OSCE state’ine gömle (rapor için)
            if (App.osce && App.osce.irrelevantDiagnoses) {
                App.osce.irrelevantDiagnoses[room] = irrelevant.slice();
            }

            addScore(['nursingDiagnosisPerformance', 'prioritisation', 'surgicalNursingKnowledge', 'clinicalReasoning'], earned, 0); // Max precalculated
            addPhaseScore(room, earned, 0);

            App.diagnosesConfirmed[room] = true;
            const performanceOk = highCount >= 1 && irrelevant.length === 0;
            App.feedbackEntries.push({ ok: performanceOk, label: `Hemşirelik tanı seçimi`, kind: 'diagnosis', phase: room, detail: { matched, partial, irrelevant, highCount, mediumCount, lowCount } });
            autoScoreOSCEFromDiagnosis(room, performanceOk, { highCount, mediumCount, lowCount, matched: matched.length, irrelevant: irrelevant.length });
            recomputeAllOSCEItems(); // tanı kanıtı tüm maddelere yansısın
            recordAction('diagnosis-confirm', { room, selected: selectedIds.length, highCount, mediumCount, lowCount, irrelevant: irrelevant.length });
            const tone = (highCount >= 1 && irrelevant.length === 0) ? 'success' : (highCount >= 1 ? 'info' : (irrelevant.length > 0 ? 'error' : 'warning'));
            toast(tone, 'Kayıt', `Yüksek: ${highCount} · Orta/Düşük: ${mediumCount + lowCount} · Alakasız: ${irrelevant.length}`);
            
            renderLeftPanel();
            renderRightPanel();
            updateScoreStrip();
        }



function buildPostop() {
            // v9.56 fix: postop sahnede phase referansı tanımlı değildi; bu yüzden buildPostop runtime hatası verip 3D render'ı durdurabiliyordu.
            const phase = App.currentPatient?.postop || App.currentPatient?.[App.currentRoom] || { tasks: [] };
            const handoff = taskByKeywords(['sbar', 'teslim', 'pacu']);
            const pain = taskByKeywords(['ağrı']);
            const resp = taskByKeywords(['solunum', 'oksijen', 'spo2', 'hava yolu']);
            const drain = taskByKeywords(['dren', 'kanama']);
            const neuro = taskByKeywords(['bilinç', 'deliryum', 'nörolojik']);
            const mob = taskByKeywords(['mobilizasyon']);
            const alarm = !taskDone(resp) && !taskDone(pain);

            // Guideline-based PACU layout: head-end monitoring and oxygen support, nurse access from left/front, family zone outside immediate care zone.
            // m0275: Preop pariteli yerleşim — yatak başı dönük (paralel), karşı ve yan erişim açık.
            addObj((function(){ const _bed = buildBed(2.20, 0, -2.10, 0x235544); _bed.rotation.y = -Math.PI/2; return _bed; })(), 'PACU Yatağı ve Hasta', 'PACU yatağı preop yerleşimi ile uyumlu konumda; yan korkuluk, hava yolu açıklığı, ağrı, bilinç ve kanama izlemi postoperatif güvenliğin temelidir.', { taskId: handoff?.id, clinicalKey: 'pacu-bed' });

            // m0309: HASTA MODERNİZASYON PAKETİ — yatakta CABG postop hastası için tıbbi aksesuarlar
            (function patientModernAccessories(){
                const pad = { metalness:0.10, roughness:0.30 };
                const skin = 0xf5d3a0;
                const wire = 0x222a33;
                // 4 EKG elektrodu (göğüste — LA, RA, LL, RL pozisyonları)
                addDecor(cyl(0.018, 0.018, 0.005, 0xffffff, 2.10, 0.96, -2.50, Object.assign({seg:14}, pad))); // RA (sağ üst)
                addDecor(cyl(0.018, 0.018, 0.005, 0xffffff, 2.30, 0.96, -2.50, Object.assign({seg:14}, pad))); // LA (sol üst)
                addDecor(cyl(0.018, 0.018, 0.005, 0xffffff, 2.10, 0.96, -2.00, Object.assign({seg:14}, pad))); // RL (sağ alt)
                addDecor(cyl(0.018, 0.018, 0.005, 0xffffff, 2.30, 0.96, -2.00, Object.assign({seg:14}, pad))); // LL (sol alt)
                // EKG kabloları (4 renkli: beyaz/siyah/kırmızı/yeşil — AHA standart)
                addDecor(cyl(0.003, 0.003, 0.35, 0xffffff, 2.10, 0.98, -2.68, { seg:6, metalness:0.30, roughness:0.50 })); // beyaz RA
                addDecor(cyl(0.003, 0.003, 0.35, 0x222a33, 2.30, 0.98, -2.68, { seg:6, metalness:0.30, roughness:0.50 })); // siyah LA
                addDecor(cyl(0.003, 0.003, 0.35, 0xe04646, 2.10, 0.98, -1.80, { seg:6, metalness:0.30, roughness:0.50 })); // kırmızı RL
                addDecor(cyl(0.003, 0.003, 0.35, 0x4cb88a, 2.30, 0.98, -1.80, { seg:6, metalness:0.30, roughness:0.50 })); // yeşil LL

                // Pulse oksimetre klip (sağ işaret parmağı — yatağın sağ alt köşesi)
                addDecor(box(0.018, 0.012, 0.022, 0xe04646, 3.00, 0.85, -1.50, { emissive: 0xe04646, emissiveIntensity: 0.65 }));
                addDecor(cyl(0.003, 0.003, 0.30, 0xe04646, 3.05, 0.86, -1.65, { seg:6, metalness:0.30, roughness:0.50 }));

                // Sternal pansuman — göğüs ortası (CABG sternotomi sonrası, beyaz steril şerit)
                addDecor(box(0.05, 0.005, 0.42, 0xfbfdff, 2.20, 0.97, -2.30, { metalness:0.05, roughness:0.40, emissive:0xfbfdff, emissiveIntensity:0.10 }));
                // Pansuman ortasında kan izi (klinik gerçeklik — drenajla yönetilen sızıntı)
                addDecor(box(0.02, 0.002, 0.06, 0x8a2030, 2.20, 0.973, -2.25, { metalness:0.05, roughness:0.40 }));

                // Endotrakeal (ET) tüp — ağızdan çıkan, ventilatöre giden saydam tüp
                addDecor(cyl(0.012, 0.012, 0.20, 0xc7dbe6, 2.20, 1.05, -3.05, { seg:12, transparent:true, opacity:0.65, emissive:0x88c9e0, emissiveIntensity:0.25 }));
                // ET tüpü sabitleme bandı (beyaz)
                addDecor(box(0.10, 0.012, 0.012, 0xfbfdff, 2.20, 0.97, -3.00, { metalness:0.05, roughness:0.40 }));

                // NG tüpü — burundan çıkan ince saydam tüp
                addDecor(cyl(0.005, 0.005, 0.18, 0xc7dbe6, 2.15, 1.02, -3.05, { seg:8, transparent:true, opacity:0.55, emissive:0x88c9e0, emissiveIntensity:0.18 }));

                // Arteriyel hat (sol bilek — kırmızı turkuaz şerit + klip)
                addDecor(cyl(0.005, 0.005, 0.16, 0xe04646, 1.40, 0.92, -1.85, { seg:8, transparent:true, opacity:0.60, emissive:0xe04646, emissiveIntensity:0.30 }));
                addDecor(box(0.018, 0.008, 0.022, 0x222a33, 1.42, 0.92, -1.80, pad));

                // Anti-emboli çorabı (TED) — beyaz parlak, iki bacak
                addDecor(cyl(0.060, 0.055, 0.40, 0xfbfdff, 2.10, 0.85, -1.30, { seg:14, metalness:0.10, roughness:0.40, emissive:0xfbfdff, emissiveIntensity:0.08 }));
                addDecor(cyl(0.060, 0.055, 0.40, 0xfbfdff, 2.30, 0.85, -1.30, { seg:14, metalness:0.10, roughness:0.40, emissive:0xfbfdff, emissiveIntensity:0.08 }));

                // Pneumatic compression (IPC) çorabı LED accent — DVT profilaksisi
                addDecor(box(0.060, 0.008, 0.18, 0x2dd4bf, 2.10, 0.95, -1.30, { emissive:0x2dd4bf, emissiveIntensity:0.85 }));
                addDecor(box(0.060, 0.008, 0.18, 0x2dd4bf, 2.30, 0.95, -1.30, { emissive:0x2dd4bf, emissiveIntensity:0.85 }));

                // Hasta yüz: kapalı göz simülasyonu (iki ince koyu çizgi)
                addDecor(box(0.024, 0.003, 0.005, 0x222a33, 2.16, 0.98, -3.18, { roughness:0.30 }));
                addDecor(box(0.024, 0.003, 0.005, 0x222a33, 2.24, 0.98, -3.18, { roughness:0.30 }));
            })();
            addObj(buildHeadwallUnit(2.15, 0, -4.65, 'postop'), 'Başucu Medikal Paneli', 'Başucu paneli yatağın baş ucuna hizalanmıştır; oksijen, vakum, prizler ve monitör bağlantıları bu aks üzerindedir. Hava yolu ve oksijen desteği bu bölgede yönetilir.', { taskId: resp?.id || handoff?.id, clinicalKey: 'headwall' });
            addObj(buildMonitor(4.55, 0, -2.55, 'PACU Monitör', { alarm }), 'PACU Monitör', alarm ? 'SpO₂/ağrı/bilinç izlemi gecikirse monitor alarmı ve hasta konforsuzluğu artar.' : 'Sürekli monitorizasyon baş uca yakın görünür noktadadır.', { taskId: resp?.id, clinicalKey: 'baseline-vitals' });
            addObj(buildIV(0.15, 0, -2.15), 'IV Pompa ve Sıvı/Analjezi', 'IV ekipmanı yatağın karşı tarafında, transferi engellemeyecek biçimde konumlandırılmıştır.', { taskId: pain?.id, clinicalKey: 'analgesia' });
            addObj(buildDrain(2.95, 0, -2.40), 'Dren Sistemi', 'CABG sonrası mediastinal dren yatak sağ kenarında, hasta göğüs hizasında konumlandırılmıştır; miktar ve renk hemşire tarafından saatlik izlenir.', { taskId: drain?.id, clinicalKey: 'drain', severity: 'danger' });

            // m0306: Hasta bağlantı hortumları — aksesuarlardan hasta vücuduna ince saydam tüpler
            addObj(box(0.22, 0.10, 0.18, 0x88cc88, 2.20, 1.04, -3.50, { transparent: true, opacity: .82, emissive: 0x4cb88a, emissiveIntensity: .22, roughness:.30, metalness:.10 }), 'Oksijen Maskesi', 'SpO₂ düşüklüğü, sedasyon veya solunum sıkıntısında oksijen desteği baş uca yakın hazır tutulur.', { taskId: resp?.id, clinicalKey: 'oxygen' });
            addObj(buildHandHygieneStation(-5.15, 0, -3.35), 'El Hijyeni İstasyonu', 'PACU alanına girişte ve hasta teması öncesi el hijyeni için görünür konumdadır.', { taskId: handoff?.id, clinicalKey: 'pacu-hand-hygiene' });

            const board = groupAt(-4.70, 0, -1.40);
            board.add(box(0.07, 0.96, 1.18, 0xf5f0e0, 0, 0.96, 0, { roughness: 0.62 }));
            board.add(box(0.08, 0.15, 0.88, 0x5cc4d6, 0.055, 1.24, 0, { emissive: 0x5cc4d6, emissiveIntensity: .18 }));
            board.add(box(0.08, 0.12, 0.72, 0xe0a558, 0.06, 0.96, 0, { emissive: 0xe0a558, emissiveIntensity: .08 }));
            addObj(board, 'SBAR Teslim Panosu', 'Cerrahi, anestezi, kanama/dren, ağrı, vital bulgu ve özel riskler hasta yatağından uzaklaşmadan önce yapılandırılmış biçimde devredilir.', { taskId: handoff?.id, clinicalKey: 'handoff', severity: 'danger' });

            addObj(buildNurseCharacter3D(3.35, 0, -1.15), 'PACU Hemşiresi 3D', 'Hemşire yatağın sol/ön tarafında; teslim, ilk değerlendirme ve erken bozulmayı fark etme için uygun konumdadır.', { taskId: handoff?.id, clinicalKey: 'pacu-nurse-3d' });
            addObj(buildRelativeCharacter3D(5.10, 0, 0.70), 'Hasta Yakını 3D', 'Hasta yakınını temsil eden 3D karakter; postop bilgilendirme ve empatik iletişim için bakım alanı dışında konumlandırılmıştır.', { taskId: handoff?.id, clinicalKey: 'family-relative-3d' });
            if (mob) addObj(box(0.95, 0.04, 0.30, 0x4cb88a, 2.90, 0.05, 2.45, { emissive:0x4cb88a, emissiveIntensity:.05 }), 'Mobilizasyon Alanı', 'Erken mobilizasyon için hasta çevresinde güvenli boş alan bırakılmıştır.', { taskId: mob.id, clinicalKey: 'mobilisation' });
            addObj(buildModernPatientCardStand(-3.00, 0, 2.35, 0xd96371, 0xe8edf2, 0xe0a558), 'Dren İzlem Kartı', 'Drenaj miktarı, rengi ve ani artışın kaydedildiği kart dren sisteminin hemen yanında görünür tutulur.', { taskId: drain?.id, clinicalKey: 'postop-drain-card' });
            statusMarker(-3.00, 1.18, 2.35, drain, 'Dren', { role:'pacu', priority:'critical', clinicalKey:'postop-drain-card', shortLabel:'Dren', showLabel:true });
            const bleedCoag = ((phase && phase.tasks) || []).find(t => t.id === 'tp_bleed_escalation' || /kanama|koagülopati|eskalasyon/i.test(t.label || '')) || drain || handoff;
            addObj(buildModernPatientCardStand(-1.50, 0, 2.35, 0xe0a558, 0xe8edf2, 0xd96371), 'Kanama / Koagülopati Eskalasyon Kartı', 'CABG sonrası drenaj artışı tek başına izlenmez; vital bulgular, Hb, ACT, PT/aPTT, fibrinojen/trombosit, ısı ve protamin bilgisi SBAR ile cerrahi-anestezi ekibine eskale edilir.', { taskId: bleedCoag?.id, clinicalKey: 'postop-bleed-coag', severity: 'danger' });
            statusMarker(-1.50, 1.18, 2.35, bleedCoag, 'Koagülasyon', { role:'pacu', priority:'critical', clinicalKey:'postop-bleed-coag', shortLabel:'Koagülasyon' });
            addObj(buildUrineBag(3.20, 0, -2.50), 'İdrar Sondası / Saatlik Diürez', 'Saatlik idrar takibi için torba ve diürez izlemi yatağın sol alt tarafında, hatları çaprazlamayacak biçimde konumlandırıldı.', { taskId: handoff?.id, clinicalKey: 'postop-urine' });
            addObj(buildPCADevice(1.30, 0.78, -1.40), 'PCA / Analjezi Pompası', 'Hasta kontrollü analjezi pompası IV yönetim hattına komşu ve hemşire erişimine açık bir konuma yerleştirildi.', { taskId: pain?.id, clinicalKey: 'postop-pca' });
            addObj(buildModernPatientCardStand(0.00, 0, 2.35, 0xe0a558, 0xe8edf2, 0x5cc4d6), 'Ağrı Skoru Kartı', 'Ağrı değerlendirme kartı hasta başında kolay görülebilir tutulur; yeniden değerlendirme döngüsünü destekler.', { taskId: pain?.id, clinicalKey: 'postop-pain-score' });
            statusMarker(0.00, 1.18, 2.35, pain, 'Ağrı', { role:'pacu', priority:'critical', clinicalKey:'postop-pain-score', shortLabel:'Ağrı', showLabel:true });
            addObj(buildSpirometer(1.30, 0, -2.50), 'İncentive Spirometre', 'Derin solunum ve öksürük egzersizi eğitimi için spirometre komodin hattında, hasta uzanırken erişilebilir konumlandırıldı.', { taskId: resp?.id, clinicalKey: 'postop-spirometer' });
            addObj(buildPONVSet(1.30, 0, -3.20), 'PONV / Kusma Seti', 'Bulantı-kusma ve aspirasyon önlemine yönelik böbrek küveti ve ilgili malzeme yatak başına yakın tutulur.', { taskId: resp?.id, clinicalKey: 'postop-ponv' });
            addObj(buildModernPatientCardStand(-4.20, 0, 2.35, 0x9b89c4, 0xe8edf2, 0x4cb88a), 'Deliryum / Oryantasyon Kartı', 'Oryantasyon, sedasyon ve deliryum izlemi için kısa değerlendirme kartı başuca yakın görünür bir noktaya eklendi.', { taskId: neuro?.id, clinicalKey: 'postop-orientation' });
            statusMarker(-4.20, 1.18, 2.35, neuro, 'Deliryum', { role:'pacu', priority:'critical', clinicalKey:'postop-delirium-card', shortLabel:'Deliryum', showLabel:true });
            addObj(buildWalkerAid(3.10, 0, -1.20), 'Mobilizasyon Yardımcı Seti', 'Drive Medical Nitro Euro Style tarzı premium 4-tekerli rollator; hasta yatağının sağ tarafına, ilk mobilizasyonda hemen kavranabilecek mesafede yerleştirildi.', { taskId: mob?.id, clinicalKey: 'postop-walker' });
            addObj(buildModernPatientCardStand(-5.40, 0, 2.35, 0xd96371, 0xe8edf2, 0x5cc4d6), 'Düşme Riski İşareti', 'Postop düşme riskini görünür kılan işaret yatak çevresi ve mobilizasyon hattı arasında konumlandırıldı.', { taskId: mob?.id, clinicalKey: 'postop-fall-risk' });
            statusMarker(-5.40, 1.18, 2.35, mob, 'Düşme', { role:'pacu', priority:'critical', clinicalKey:'postop-fall-risk', shortLabel:'Düşme', showLabel:true });

            addObj(buildChecklistBoard(4.50, 0, 3.20), 'Taburculuk Hazırlık Paketi', 'Yara bakımı, ilaç, aktivite ve alarm bulgularına ilişkin taburculuk materyali GCKL paneli stilinde sergilenir; aile bilgilendirme alanına yakın hazır tutulur.', { taskId: handoff?.id, clinicalKey: 'discharge-prep-tray' });
            addObj(buildChecklistBoard(-5.95, 0, 3.55), 'GCKL Panosu', 'Postoperatif GCKL panosu; sol ön güvenlik lideri olarak SBAR teslim, solunum/oksijen, ağrı, kanama/dren, nörolojik durum ve mobilizasyon-güvenlik adımlarının ilerlemesini gösterir. Görevler faz listesinden tamamlandıkça bu pano entegre biçimde güncellenir.', { taskId: handoff?.id, clinicalKey: 'ssc-board-postop' });

            statusMarker(-4.70, 1.42, -1.40, handoff, 'SBAR',     { role:'pacu', priority:'critical', clinicalKey:'handoff' });
            if (resp)  statusMarker(2.20, 1.30, -3.50, resp, 'O₂', { role:'pacu', priority:'critical', clinicalKey:'pacu-airway' });
            if (pain)  statusMarker(1.30, 1.30, -1.40, pain, 'PCA',       { role:'pacu', priority:'active',   clinicalKey:'postop-pain-score' });
            if (drain) statusMarker(3.20, 1.10, -2.50, drain, 'İdrar',       { role:'pacu', priority:'active',   clinicalKey:'drain' });
            statusMarker(-5.95, 1.54, 3.55, handoff, 'GCKL',     { role:'pacu', priority:'critical', clinicalKey:'ssc-board-postop', shortLabel:'GCKL' });
        }

        function onCanvasClick(e) { 
            if (!three.scene || three.dragging) return;
            const rect = e.target.getBoundingClientRect();
            const m = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
            const rc = new THREE.Raycaster();
            rc.setFromCamera(m, three.camera);
            const hits = rc.intersectObjects(three.objects.map(o => o.mesh), true); 
            if (hits.length) { 
                let target = hits[0].object.userData?.parentInteractive || null;
                if (!target) {
                    for (const o of three.objects) { 
                        if (o.mesh === hits[0].object || (hits[0].object.parent && (o.mesh === hits[0].object.parent || o.mesh === hits[0].object.parent.parent))) { target = o; break; } 
                    }
                }
                if (target) { 
                    if (three.placement?.enabled) { selectPlacementObject(target); return; }
                    if (typeof handleDirectSceneObjectAction === 'function' && handleDirectSceneObjectAction(target)) { highlightObject(target); return; }
                    highlightObject(target); showObjPopup(target, e.clientX, e.clientY); 
                }
            } 
        }

        function highlightObject(obj) {
            // FIX v9.22: Aynı paylaşılan materyalin birden fazla mesh tarafından
            // kullanılması (özellikle premium lambada/masada) durumunda her mesh
            // traverse'inde "orijinal" değer ÜST ÜSTE yazılıyordu. Sonuç: restore
            // sırasında orijinal değer yerine highlight rengi kalıyordu.
            // Çözüm:
            // 1) Set ile her materyali sadece BİR KEZ kaydet
            // 2) Önceki highlight hâlâ aktifse (timeout dolmamışsa) önce
            //    eski highlight'ı GERİ AL, sonra yeniyi uygula
            
            // 1) Önceki kalan highlight varsa hemen geri al
            if (three._activeHighlight) {
                const prev = three._activeHighlight;
                if (prev.timer) clearTimeout(prev.timer);
                prev.entries.forEach(x => {
                    try {
                        x.m.emissive.setHex(x.emissive);
                        x.m.emissiveIntensity = x.intensity;
                    } catch (e) {}
                });
                three._activeHighlight = null;
            }

            // 2) Materyalleri TEKİL olarak topla (paylaşılan mat tek kez)
            const seen = new Set();
            const entries = [];
            obj.mesh.traverse?.(child => {
                if (child.material && child.material.emissive && !seen.has(child.material)) {
                    seen.add(child.material);
                    entries.push({
                        m: child.material,
                        intensity: child.material.emissiveIntensity || 0,
                        emissive: child.material.emissive.getHex()
                    });
                }
            });

            // 3) Highlight uygula
            entries.forEach(x => {
                x.m.emissive.setHex(0x5cc4d6);
                x.m.emissiveIntensity = Math.max(x.intensity, 0.48);
            });

            // 4) 520ms sonra geri al — global referansı kayıt et
            const timer = setTimeout(() => {
                entries.forEach(x => {
                    try {
                        x.m.emissive.setHex(x.emissive);
                        x.m.emissiveIntensity = x.intensity;
                    } catch (e) {}
                });
                if (three._activeHighlight && three._activeHighlight.timer === timer) {
                    three._activeHighlight = null;
                }
            }, 520);
            three._activeHighlight = { entries, timer };
        }

        /* ============================================================
         * positionPopupNearPoint — Preop/Intraop ortak popup konumlandırıcı
         * Preop showObjPopup ve intraop v2 (renderIntraProtocolCard) bu helper'ı
         * kullanır. Scene-shell local koordinatına çevirir, sağ/sol açılım kararı
         * verir ve viewport sınırlarına clamp eder.
         *  - host: konumlandırılacak element (ör. #obj-popup)
         *  - x, y: TIKLAMA viewport koordinatı (event.clientX / clientY)
         *  - preferredWidth: kart genişliği px (default 380)
         * Mobil breakpoint (≤920px) altında left/top sıfırlanır; CSS fixed-bottom
         * davranışı devreye girer.
         * Dönüş: { localX, localY, side: 'right'|'left' }
         * ============================================================ */
        function positionPopupNearPoint(host, x, y, preferredWidth) {
            if (!host) return null;
            host.classList.remove('side-right', 'side-left');
            const shellEl = document.getElementById('scene-shell');
            if (!shellEl || window.innerWidth <= 920) {
                host.style.left = '';
                host.style.top = '';
                return null;
            }
            const sh = shellEl.getBoundingClientRect();
            const popupW = preferredWidth || 380;
            const pad = 12;
            const gap = 14;
            const localX = x - sh.left;
            const localY = y - sh.top;
            let openRight = true;
            let left = localX + gap;
            let top = localY - 12;
            if (left + popupW > sh.width - pad) {
                left = localX - popupW - gap;
                openRight = false;
            }
            if (left < pad) {
                left = Math.max(pad, Math.min(sh.width - popupW - pad, localX + gap));
                openRight = left >= localX;
            }
            const estH = Math.min(560, Math.max(210, host.scrollHeight || 260));
            if (top + estH > sh.height - pad) top = sh.height - estH - pad;
            if (top < pad) top = pad;
            host.style.left = left + 'px';
            host.style.top = top + 'px';
            host.classList.add(openRight ? 'side-right' : 'side-left');
            return { localX, localY, side: openRight ? 'right' : 'left' };
        }

        /* clearIntraopV2PopupState — #obj-popup üzerinde intraop v2 popup'tan
         * kalan class / data-attr / inline stil kalıntılarını temizler.
         * Preop popup'ına geçilirken ipv2-host width/maxWidth/overflow inline
         * stilleri sızmasın diye showObjPopup başında çağrılır. Intraop v2 popup
         * kapatıldığında da çağrılır. */
        function clearIntraopV2PopupState(host) {
            if (!host) return;
            host.classList.remove('ipv2-host', 'intraop-node-host');
            host.removeAttribute('data-intra-popups-v2');
            host.style.width = '';
            host.style.maxWidth = '';
            host.style.overflow = '';
        }

        try { window.positionPopupNearPoint = positionPopupNearPoint; } catch (e) {}
        try { window.clearIntraopV2PopupState = clearIntraopV2PopupState; } catch (e) {}

        function showObjPopup(obj, x, y) { 
            App.__currentObjPopupObj = obj || null;
            const p = $('#obj-popup');
            // Preop/legacy popup'a geçerken intraop v2 stil kalıntılarını temizle
            clearIntraopV2PopupState(p);
            const task = obj.opts?.taskId ? (App.currentPatient[App.currentRoom].tasks || []).find(t => t.id === obj.opts.taskId) : null;
            const cls = taskStatusClass(task);
            const status = taskStatusLabel(task);
            const chips = [`<span class="scene-risk-chip ${cls}">${status}</span>`];
            if (obj.opts?.clinicalKey) chips.push(`<span class="scene-risk-chip">${obj.opts.clinicalKey}</span>`);
            if (task?.guideline && GUIDELINE_THEMES[task.guideline]) chips.push(`<span class="scene-risk-chip ok">${GUIDELINE_THEMES[task.guideline].tag}</span>`);
            const monitorKey = String(obj?.opts?.clinicalKey || '').toLocaleLowerCase('tr-TR');
            const monitorLabel = String(obj?.label || '').toLocaleLowerCase('tr-TR');
            const showMonitorMini = monitorKey.includes('monitor') || monitorLabel.includes('monitör') || monitorLabel.includes('monitor');
            const monitorOn = !(ClinicalAudio && ClinicalAudio.monitorSound === false);
            const monitorMini = showMonitorMini ? `<button id="popup-monitor-sound-mini" class="popup-monitor-sound-mini ${monitorOn ? 'on' : 'off'}" type="button" title="Monitör sesini aç/kapat" aria-label="Monitör sesini aç/kapat">${monitorOn ? '🔊' : '🔇'}</button>` : '';
            const eduKey = getObjEducationKey(obj);
            const eduMini = eduKey ? `<button id="popup-edu-mini" class="popup-edu-mini" type="button" title="İlgili hasta eğitimini aç" aria-label="İlgili hasta eğitimini aç">Eğitim</button>` : '';
            const callNurseKey = getObjCallNurseKey(obj);
            const callMini = callNurseKey ? `<button id="popup-call-mini" class="popup-call-mini" type="button" title="Hemşireyi çağır" aria-label="Hemşireyi çağır">Hemşire</button>` : '';
            const taskNote = getObjectTaskNote(obj, task);
            const wrongUseWarning = getObjectWrongUseWarning(obj);
            const profileNote = getProfileObjectContent(obj);
            const roleNote = getObjectRoleNote(obj, task);
            if (roleNote?.chip) chips.push(`<span class="scene-risk-chip ok">${roleNote.chip}</span>`);
            const criticalTalkKey = getObjectCriticalTalkKey(obj);
            const taskNoteHtml = taskNote ? `<div class="scene-note-card task-note"><div class="scene-note-title">Bağlı öğrenme görevi</div>${taskNote}</div>` : '';
            const profileNoteHtml = profileNote ? `<div class="scene-note-card profile-note"><div class="scene-note-title">${profileNote.title}</div>${profileNote.desc}<br><strong>Alarm:</strong> ${profileNote.alarm}</div>` : '';
            const roleNoteHtml = roleNote ? `<div class="scene-note-card role-note"><div class="scene-note-title">${roleNote.title}</div>${roleNote.desc}</div>` : '';
            const warningHtml = wrongUseWarning ? `<div class="scene-note-card warn-note"><div class="scene-note-title">Yanlış kullanım uyarısı</div><strong>Dikkat:</strong> ${wrongUseWarning.replace(/^Yanlış kullanım uyarısı:\s*/, '')}</div>` : '';
            p.innerHTML = `<span class="oclose">×</span><div class="otitle-row"><div class="otitle">${obj.label}</div>${callMini}${eduMini}${monitorMini}</div><div>${obj.desc}</div><div style="margin-top:7px;">${chips.join('')}</div>${profileNoteHtml}${roleNoteHtml}${taskNoteHtml}${warningHtml}`;

            const boardKey = String(obj?.opts?.clinicalKey || '');
            if (boardKey.startsWith('ssc-board')) {
                const boardPhase = gcklBoardPhaseFromKey(boardKey);
                const progress = gcklBoardProgressForPhase(boardPhase);
                const boardStates = progress.groups.map(group => ({ group, st: gcklBoardGroupState(group, boardPhase) }));
                const totalSteps = progress.total;
                const doneSteps = progress.done;
                const pct = progress.pct;

                // GCKL panosu kompakt kalır; ancak hangi faza ve ekibe ait olduğu kısa etiketlerle görünür.
                const meta = getGcklBoardMeta(boardPhase);
                const gcklFinished = totalSteps > 0 && doneSteps >= totalSteps;
                const statusText = gcklFinished ? 'GCKL tamamlandı' : (doneSteps > 0 ? 'GCKL ilerliyor' : 'Kritik görev bekliyor');
                const statusCls = gcklFinished ? 'ok' : (doneSteps > 0 ? 'warn' : 'danger');
                p.innerHTML = `<span class="oclose">×</span><div class="otitle-row"><div class="otitle">${meta.title}</div><span class="gckl-title-badge">İlerleme ${doneSteps}/${totalSteps}</span></div>`;

                const metaRow = el('div', 'gckl-board-meta');
                metaRow.innerHTML = `<span class="scene-risk-chip ${statusCls}">${statusText}</span><span class="scene-risk-chip ok">${meta.scope}</span><span class="scene-risk-chip ok">${meta.team}</span><span class="scene-risk-chip">${meta.keyLabel}</span>`;
                p.appendChild(metaRow);
                if (meta.caption) {
                    const caption = el('div', 'gckl-board-caption');
                    caption.textContent = meta.caption;
                    p.appendChild(caption);
                }

                const wrap = el('div', 'gckl-progress-wrap');
                const head = el('div', 'gckl-progress-head');
                head.innerHTML = `<div class="gckl-progress-bar"><i style="width:${pct}%"></i></div>`;
                wrap.appendChild(head);

                const listBox = el('div', 'gckl-board-list');
                boardStates.forEach(({ group, st }) => {
                    const done = st.code === 2;
                    const partial = st.code === 1;
                    const item = el('div', 'task-item' + (done ? ' done' : (partial ? ' pending' : ' pending critical-pending')));
                    const stateMark = done ? '✓' : (partial ? '•' : '!');
                    const checkClass = done ? 'state-done' : (partial ? 'state-pending' : 'state-critical');
                    const statusLabel = done ? 'Tamamlandı' : (partial ? 'İlerliyor' : 'Bekliyor');
                    item.innerHTML = `
                        <div class="check ${checkClass}" title="${statusLabel}" aria-label="${statusLabel}">${stateMark}</div>
                        <div class="task-main">
                            <div class="task-head">
                                <div class="lbl">${group.title}</div>
                                <div class="badges">
                                    <span class="role-mini team">GCKL</span>
                                    <span class="badge ${done ? 'state-done' : (partial ? 'free' : 'state-critical')}">${statusLabel}</span>
                                    <span class="badge gline">${st.completed.length}/${Math.max(1, st.required.length)} adım</span>
                                </div>
                            </div>
                        </div>
                    `;
                    item.style.cursor = 'default';
                    item.title = done
                        ? 'Tamamlandı: bu ilerleme faz görev listesinden geldi.'
                        : 'Bu kart bilgilendiricidir; görevleri faz görev listesinden tamamlayın.';
                    listBox.appendChild(item);
                });
                wrap.appendChild(listBox);
                p.appendChild(wrap);
            }
            const miniBtn = p.querySelector('#popup-monitor-sound-mini');
            if (miniBtn) {
                miniBtn.onclick = (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    ClinicalAudio.toggleMonitorSound?.();
                    const on = !(ClinicalAudio && ClinicalAudio.monitorSound === false);
                    miniBtn.textContent = on ? '🔊' : '🔇';
                    miniBtn.classList.toggle('off', !on);
                    miniBtn.classList.toggle('on', on);
                    miniBtn.title = on ? 'Monitör sesi açık' : 'Monitör sesi kapalı';
                    miniBtn.setAttribute('aria-label', miniBtn.title);
                };
            }
            const eduBtn = p.querySelector('#popup-edu-mini');
            if (eduBtn && eduKey) {
                eduBtn.onclick = (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    p.classList.remove('visible');
                    openEducationPlan(eduKey);
                };
            }
            const callBtn = p.querySelector('#popup-call-mini');
            if (callBtn && callNurseKey) {
                callBtn.onclick = (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    p.classList.remove('visible');
                    callNurseToRelative(callNurseKey);
                };
            }

            const microScenario = getObjectMicroScenario(obj);
            let actionRow = null;
            if (task && !boardKey.startsWith('ssc-board')) {
                actionRow = el('div', 'scene-action-row');
                const objDone = objectMarkerDone(obj);
                const b = el('button', 'scene-action-btn' + (objDone ? ' done' : ''), getTaskActionLabel(obj, task));
                b.onclick = () => { 
                    if (!objDone) { 
                        p.classList.remove('visible'); 
                        const ok = completeTask(task.id, obj); 
                        if (ok !== false) showSceneReaction(`${obj.label}: ${getObjectActionText(obj) || task.label} kaydedildi.`, 'ok'); 
                    } 
                };
                actionRow.appendChild(b);
                p.appendChild(actionRow);
            }
            if (criticalTalkKey) {
                actionRow = actionRow || el('div', 'scene-action-row');
                const talkBtn = el('button', 'scene-action-btn critical-talk', getCriticalTalkLabel(obj));
                if (isCriticalCommunicationDone(criticalTalkKey)) talkBtn.classList.add('done');
                talkBtn.onclick = (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    markCriticalCommunication(criticalTalkKey, obj.label);
                    if (microScenario) {
                        p.classList.remove('visible');
                        playObjectMicroScenario(obj);
                    } else {
                        showSceneReaction(`${obj.label}: hasta ile doğrulandı.`, 'info');
                        talkBtn.textContent = '✓ Hasta ile doğrulandı';
                        talkBtn.classList.add('done');
                    }
                };
                actionRow.appendChild(talkBtn);
                if (!actionRow.parentNode) p.appendChild(actionRow);
            }
            if (microScenario) {
                actionRow = actionRow || el('div', 'scene-action-row');
                const sbtn = el('button', 'scene-action-btn', '🎭 Mikro senaryo + karar sorusu');
                sbtn.onclick = (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    p.classList.remove('visible');
                    playObjectMicroScenario(obj);
                };
                actionRow.appendChild(sbtn);
                if (!actionRow.parentNode) p.appendChild(actionRow);
            }
            if(App.aiMode) {
                const aiBtn = el('button', 'scene-action-btn', '✨ Hastaya özel klinik ipucu al');
                const aiRes = el('div');
                aiRes.style.fontSize = '11px'; aiRes.style.marginTop = '8px'; aiRes.style.color = 'var(--violet)';
                aiBtn.onclick = async () => {
                    aiBtn.textContent = '✨ Analiz ediliyor...'; aiBtn.disabled = true;
                    const pat = App.currentPatient;
                    const prompt = `Hasta: ${pat.name} (${pat.surgery}). Tıbbi geçmiş: ${pat.history.join(', ')}. Faz: ${App.currentRoom}. Klinik nesne: ${obj.label}. Bu nesnenin bu hastanın cerrahi güvenliği açısından kritik kullanımını 1-2 kısa cümlede, öğrenci hemşireye yönelik yaz.`;
                    const res = await callGeminiAPI(prompt);
                    aiRes.innerHTML = `<b>✨ İpucu:</b> ${res}`; aiBtn.style.display = 'none';
                };
                const row = p.querySelector('.scene-action-row') || el('div','scene-action-row');
                row.appendChild(aiBtn); if (!row.parentNode) p.appendChild(row); p.appendChild(aiRes);
            }
            // Konumlandırma: ortak positionPopupNearPoint helper'ı kullan
            positionPopupNearPoint(p, x, y, 380);
            p.classList.add('visible');
            p.querySelector('.oclose').onclick = () => p.classList.remove('visible'); 
        }

        function getSceneState() {
            const phase = App.currentPatient?.[App.currentRoom];
            if (!phase) return { done:0, total:0, pct:0, criticalMissing:[], criticalDone:0, criticalTotal:0, diag:false, symp:false, safety:0 };
            const tasks = phase.tasks || [];
            const done = tasks.filter(t => App.completedTasks.includes(t.id)).length;
            const total = tasks.length;
            const critical = tasks.filter(t => t.critical);
            const criticalMissing = critical.filter(t => !App.completedTasks.includes(t.id));
            const criticalDone = critical.length - criticalMissing.length;
            const diag = !!App.diagnosesConfirmed[App.currentRoom];
            const symp = !!App.symptomsConfirmed[App.currentRoom];
            const pct = total ? Math.round(done/total*100) : 0;
            const safety = critical.length ? Math.round(criticalDone/critical.length*100) : pct;
            return { done,total,pct,criticalMissing,criticalDone,criticalTotal: critical.length, diag, symp, safety };
        }

        function updateSceneStatusPanel() { return; }

        function refreshSceneReactivity() {
            updateSceneStatusPanel();
            const st = getSceneState();
            const signature = `${App.currentRoom}|${st.done}|${st.criticalMissing.map(t=>t.id).join(',')}|${st.diag}|${st.symp}`;
            if (signature !== three.lastSignature) {
                if (three.lastSignature) {
                    if (st.criticalMissing.length === 0 && st.criticalTotal > 0) showSceneReaction('Kritik güvenlik adımları tamamlandı. Sahne güvenli akışa geçti.', 'ok');
                    else if (st.done > 0 && st.criticalMissing.length > 0) showSceneReaction(`Sahne uyarısı: ${st.criticalMissing.length} kritik güvenlik adımı bekliyor.`, st.criticalMissing.length > 2 ? 'danger' : 'warn');
                }
                three.lastSignature = signature;
            }
            // Marker görünürlük + renk güncellemesi (yeni sistem)
            applyMarkerVisibility();
        }

        function showSceneReaction(text, level = 'info') {
            const b = $('#scene-reaction-banner'); if (!b) return;
            b.textContent = text;
            b.className = 'scene-reaction-banner visible ' + (level === 'danger' ? 'danger' : (level === 'warn' ? 'warn' : ''));
            clearTimeout(b._timer);
            b._timer = setTimeout(() => b.classList.remove('visible'), 3600);
        }

        function updateProgressBar() { 
            const phase = App.currentPatient?.[App.currentRoom];
            if (!phase) return;
            const tot = phase.tasks.length;
            const done = phase.tasks.filter(t => App.completedTasks.includes(t.id)).length;
            const pct = tot ? Math.round(done / tot * 100) : 0;
            const progressText = $('#progress-text');
            const progressBar = $('#progress-bar');
            const taskProgressDone = $('#task-progress-done');
            const taskProgressTotal = $('#task-progress-total');
            const taskProgressBar = $('#task-progress-bar');
            if (progressText) progressText.textContent = `${done}/${tot} görev`;
            if (progressBar) progressBar.style.width = pct + '%';
            if (taskProgressDone) taskProgressDone.textContent = `${done}`;
            if (taskProgressTotal) taskProgressTotal.textContent = `${tot}`;
            if (taskProgressBar) taskProgressBar.style.width = pct + '%';
            refreshSceneReactivity();
        }

        function getPhaseRoleModel(room = App.currentRoom) {
            if (room === 'preop') return {
                title: 'Öğrenci aktif rolü: Preop hemşiresi',
                actors: [
                    { name:'Preop hemşiresi', cls:'preop', desc:'güvenlik doğrulama, hasta eğitimi, hazırlık koordinasyonu' },
                    { name:'Hasta', cls:'team', desc:'kimlik, alerji, NPO, ağrı/kaygı bilgisi kaynağı' },
                    { name:'Hasta yakını', cls:'team', desc:'bilgilendirme ve destekleyici doğrulama' }
                ]
            };
            if (room === 'intraop') return {
                title: 'Öğrenci rolünü seçerek düşün: Scrub / Sirküle / Anestezi ekibi / Cerrah',
                actors: [
                    { name:'Scrub hemşiresi', cls:'scrub', desc:'steril alan, Mayo masası, alet verme, sayımın steril tarafı' },
                    { name:'Sirküle hemşire', cls:'circulating', desc:'steril alan dışı akış, kayıt, numune, oda trafiği, sayımın kayıt tarafı' },
                    { name:'Anestezi ekibi', cls:'anaesthesia', desc:'hava yolu, ilaç, monitörizasyon, hemodinami' },
                    { name:'Cerrah', cls:'surgeon', desc:'cerrahi karar, işlem ve time-out katılımı' }
                ]
            };
            return {
                title: 'Öğrenci aktif rolü: PACU hemşiresi',
                actors: [
                    { name:'PACU hemşiresi', cls:'pacu', desc:'hava yolu, vital bulgu, ağrı, dren, bilinç, güvenli mobilizasyon' },
                    { name:'Hasta', cls:'team', desc:'ağrı, bulantı, oryantasyon ve semptom bilgisi kaynağı' },
                    { name:'Hasta yakını', cls:'team', desc:'taburculuk eğitimi ve güvenlik desteği' }
                ]
            };
        }
        function getTaskRoleInfo(task, room = App.currentRoom) {
            const id = String(task?.id || '').toLocaleLowerCase('tr-TR');
            const label = String(task?.label || '').toLocaleLowerCase('tr-TR');
            if (room === 'preop') return { name:'Preop hemşiresi', cls:'preop', detail:'Hasta/hasta yakını ve dosya ile doğrular; hazırlığı koordine eder.' };
            if (room === 'postop') return { name:'PACU hemşiresi', cls:'pacu', detail:'Hasta değerlendirmesi, güvenlik izlemi ve eğitimden sorumludur.' };
            if (label.includes('sayım') || id.includes('count')) return { name:'Sirküle + Scrub + Cerrah', cls:'team', detail:'Sirküle sayar ve kaydeder; scrub steril alanda doğrular; cerrah kavite kapatma öncesi uygunluğu teyit eder.' };
            if (label.includes('mayo') || label.includes('steril') || label.includes('malzeme sterilizasyon') || id.includes('steril')) return { name:'Scrub hemşiresi', cls:'scrub', detail:'Steril alan, Mayo masası ve alet düzeni scrub hemşiresinin sorumluluğudur.' };
            if (label.includes('numune') || id.includes('numune') || label.includes('oda trafiği') || label.includes('sign-out')) return { name:'Sirküle hemşire', cls:'circulating', detail:'Steril alan dışı akış, kayıt, numune ve ekip koordinasyonunu yönetir.' };
            if (label.includes('sign-in') || label.includes('anestezi') || label.includes('hemodinami') || label.includes('ısıtma') || label.includes('pozisyon')) return { name:'Anestezi + Sirküle', cls:'anaesthesia', detail:'Anestezi ekibi klinik stabiliteyi yönetir; sirküle hemşire güvenlik ve akışı destekler.' };
            if (label.includes('time-out') || label.includes('time out')) return { name:'Tüm ekip', cls:'team', detail:'Cerrah, anestezi ekibi, scrub ve sirküle hemşire birlikte durup doğrulama yapar.' };
            return { name:'Sirküle hemşire', cls:'circulating', detail:'Steril alan dışı güvenlik akışını ve ekip iletişimini yönetir.' };
        }
        function getObjectRoleNote(obj, task) {
            const ck = String(obj?.opts?.clinicalKey || '');
            const roleMap = {
                'count-board': { chip:'Sirküle → Scrub → Cerrah', title:'Üçlü Sayım Doğrulaması', desc:'Sayım üçlü doğrulama ile yürütülür: sirküle hemşire sayar ve kaydeder, scrub hemşiresi steril alanda görsel-sözel doğrulama yapar, cerrah kavite kapatma öncesi sayım uygunluğunu teyit eder. Tek kişi sayımı yeterli değildir.' },
                'forced-air-warmer': { chip:'Sirküle + Anestezi', title:'Hipotermi Önleme', desc:'Forced-air ısıtma battaniyesi alt vücuda yerleştirilir; hedef intraop ≥36°C. T <36°C amber erken yanıt, T <35°C kırmızı kritik eskalasyon olarak izlenir.' },
                'cabg-temp-trigger': { chip:'Sirküle + Anestezi', title:'Sıcaklık eşikleri', desc:'Sıcaklık tetik paneli T <36°C durumunda aktif ısıtma ve ısıtılmış sıvı/kan hattı için amber uyarı, T <35°C durumunda kırmızı kritik eskalasyon davranışını öğretir.' },
                'cabg-anaesthesia-module': { chip:'Anestezi + Sirküle', title:'CABG anestezi derinliği', desc:'Bu modül A-line sıfırlama/dalga formu, tahmini kan kaybı, TXA order-doz-zamanlaması, crossmatch/kan ürün hazırlığı ve cell saver bilgisini Sign-in/Time-out hattına bağlar.' },
                'mayo-stand': { chip:'Scrub', title:'Rol ayrımı: Mayo masası', desc:'Mayo masasını scrub hemşiresi yönetir. Steril alet düzeni, cerraha alet verme ve steril alan bütünlüğü scrub rolünün merkezindedir.' },
                'sterile-table': { chip:'Scrub', title:'Rol ayrımı: Steril masa', desc:'Arka steril masa ve steril alet düzeni scrub hemşiresinin sorumluluğundadır. Sirküle hemşire yalnızca steril alan dışından destek sağlar.' },
                'graft-prep-table': { chip:'Scrub + Cerrah', title:'Rol ayrımı: Safen greft hazırlığı', desc:'Greft hazırlık alanında scrub hemşiresi steril zonu, heparinli solüsyonu, keskin/nötr alan ayrımını, sayım bağlantısını ve safen ven görünürlüğünü korur; cerrah kondüitin kullanılabilirliğini değerlendirir. Eğitim odağı, back table düzeninin operatif alana paralel kurulması ve safen venin yön, bütünlük, yan dal kontrolü ve travmasız hazırlık açısından izlenmesidir. Bu alan ayrı OSCE değil, GCKL görev puanlamasına bağlıdır.' },
                'scrub-nurse-3d': { chip:'Scrub', title:'Rol ayrımı: Scrub hemşiresi', desc:'Scrub hemşiresi steril alanda çalışır; Mayo/arka masa, alet verme ve sayımın steril tarafını yürütür.' },
                'assistant-scrub-nurse-3d': { chip:'Scrub', title:'Rol ayrımı: İkinci scrub hemşiresi', desc:'İkinci scrub hemşiresi steril alanı ve alet akışını destekler; sayımda scrub tarafındaki doğrulamaya katılır.' },
                'circulating-nurse': { chip:'Sirküle', title:'Rol ayrımı: Sirküle hemşire', desc:'Sirküle hemşire steril alan dışındaki akışı yönetir: oda trafiği, kayıt, malzeme, numune, ekip iletişimi ve sayımın kayıt/pano tarafı. Mayo masasını yönetmez.' },
                'traffic-control': { chip:'Sirküle', title:'Rol ayrımı: Oda trafiği', desc:'Steril alan dışı akış ve oda trafiği sirküle hemşirenin sorumluluğundadır. Gereksiz giriş-çıkış kontaminasyon ve dikkat dağınıklığı riskidir.' },
                'specimen': { chip:'Sirküle', title:'Rol ayrımı: Numune', desc:'Cerrah numuneyi tanımlar; sirküle hemşire hasta-örnek eşleşmesini, etiketlemeyi, kayıt ve transfer zincirini yönetir.' },
                'waste-flow': { chip:'Sirküle', title:'Rol ayrımı: Atık akışı', desc:'Kirli-temiz alan ayrımı ve atık akışı sirküle hemşirenin steril alan dışı güvenlik sorumluluğudur.' },
                'ssc-board': { chip:'Tüm ekip', title:'Rol ayrımı: GCKL', desc:'Bu pano GCKL için ana kontrol noktasıdır. Ekip tanıtımı, kimlik/taraf doğrulaması, profilaksi, sterilite, sayım ve numune güvenliği burada yalnızca izlenir. Tamamlama faz görev listesinden yapılır; tüm alt görevler bitince GCKL etiketi entegre biçimde yeşile döner.' },
                'ssc-board-preop': { chip:'Preop ekip', title:'Rol ayrımı: Preop GCKL', desc:'Bu pano preoperatif GCKL ilerlemesini izler. Kimlik, onam, taraf, alerji, NPO, ilaç, kan hazırlığı, IV ve transfer doğrulamaları faz görev listesinden tamamlanır.' },
                'ssc-board-intraop': { chip:'Tüm ekip', title:'Rol ayrımı: İntraop GCKL', desc:'Bu pano intraoperatif GCKL ilerlemesini izler. Doğrulamalar faz görev listesinden tamamlanır; pano yalnızca ilerlemeyi gösterir.' },
                'ssc-board-postop': { chip:'PACU ekip', title:'Rol ayrımı: Postop GCKL', desc:'Bu pano postoperatif GCKL ilerlemesini izler. Teslim, solunum, ağrı, kanama/dren, nörolojik durum ve mobilizasyon/güvenlik adımları faz görev listesinden tamamlanır.' },
                'signin': { chip:'Anestezi + Sirküle', title:'Rol ayrımı: Sign-in', desc:'Sign-in anestezi güvenliğiyle doğrudan ilişkilidir. Anestezi ekibi hava yolu/ilaç/hemodinamiyi yönetir; sirküle hemşire kimlik, onam ve ekip iletişimini doğrular.' },
                'anaesthesia-team': { chip:'Anestezi', title:'Rol ayrımı: Anestezi ekibi', desc:'Anestezi ekibi hava yolu, ilaçlar, monitörizasyon ve hemodinamiden sorumludur. Hemşire bu akışta güvenlik doğrulamasını ve ekip iletişimini destekler.' },
                'cpb-machine': { chip:'Perfüzyon + Tüm ekip', title:'Rol ayrımı: KPB 5 alt-faz', desc:'KPB güvenliği tek cihaz kontrolü değildir. KPB öncesi hazır oluş, ACT/heparin/prime, pompa açık izlem, çıkış hazırlığı ve protamin/koagülasyon fazları perfüzyonist, cerrah, anestezi ve hemşirelik ekibi arasında kapalı döngü iletişimle doğrulanır.' },
                'cpb-phase-board': { chip:'Perfüzyon + Tüm ekip', title:'Rol ayrımı: KPB faz paneli', desc:'Panel, GCKL puanlamasını KPB sürecinin klinik sırasına bağlar. Öğrenci her fazı ekip teyidi ve hasta güvenliği çıktısıyla ilişkilendirir.' },
                'cell-saver': { chip:'Sirküle + Perfüzyon', title:'Rol ayrımı: Hücre koruyucu', desc:'Hücre koruyucu cihazı kan yönetimi için kullanılır. Sirküle hemşire cihazın doğru konumunu, kayıt/etiket güvenliğini ve aspirasyon akışını destekler; perfüzyon/anestezi ekibi klinik geri verme güvenliğini yönetir.' },
                'postop-bleed-coag': { chip:'PACU + Cerrahi/Anestezi', title:'Rol ayrımı: Kanama/koagülopati eskalasyonu', desc:'PACU hemşiresi drenaj, vital bulgular, ısı ve laboratuvar bulgularını SBAR ile cerrahi ve anestezi ekibine aktarır. Bu görev yalnız kayıt değil, aktif eskalasyondur.' },
                'intraop-monitor': { chip:'Anestezi', title:'Rol ayrımı: Monitörizasyon', desc:'Monitörizasyonun klinik yorumu anestezi ekibindedir; sirküle hemşire alarm farkındalığı, ekip iletişimi ve güvenli akışa katkı verir.' },
                'airway-cart': { chip:'Anestezi', title:'Rol ayrımı: Airway arabası', desc:'Airway arabası anestezi ekibinin baş ucu güvenlik ekipmanıdır; erişilebilirlik ve oda düzeni sirküle hemşire tarafından desteklenir.' },
                'blood-warmer': { chip:'Anestezi + Sirküle', title:'Rol ayrımı: Isıtılmış sıvı/kan', desc:'Sıvı ve kan ürünü uygulamasında anestezi ekibi hemodinamiyi yönetir; sirküle hemşire doğru ekipman, kayıt ve ürün güvenliğini destekler.' },
                'warming-pressure': { chip:'Sirküle + Anestezi', title:'Rol ayrımı: Isıtma ve basınç koruması', desc:'Aktif ısıtma ve basınç noktası koruması sirküle hemşire ile anestezi ekibinin ortak hasta güvenliği sorumluluğudur.' },
                'positioning-set': { chip:'Tüm ekip', title:'Rol ayrımı: Pozisyonlama', desc:'Pozisyonlama ekip işidir; cerrahi gereklilik, anestezi güvenliği ve hemşirelik basınç/sinir koruması birlikte düşünülmelidir.' }
            };
            const mapped = roleMap[ck];
            if (mapped) return mapped;
            if (task) {
                const info = getTaskRoleInfo(task, App.currentRoom);
                return { chip: info.name, title:'Rol ayrımı: Görev sorumluluğu', desc:`Bu görevde ana öğrenci rolü <strong>${info.name}</strong>. ${info.detail}` };
            }
            return null;
        }


        function getRoleFocusOptions() {
            return [
                { id:'all', label:'Tüm ekip', hint:'Görevler gizlenmez; tüm akış görünür.' },
                { id:'scrub', label:'Scrub hemşiresi', hint:'Mayo masası, steril masa ve sayım odağı.' },
                { id:'circulating', label:'Sirküle hemşire', hint:'Steril alan dışı akış, kayıt, numune ve oda trafiği odağı.' },
                { id:'anaesthesia', label:'Anestezi ekibi', hint:'Monitörizasyon, hava yolu ve hemodinami odağı.' }
            ];
        }
        function isTaskInRoleFocus(role, focus = App.intraopRoleFocus || 'all') {
            if (!role || focus === 'all') return true;
            const cls = String(role.cls || '').toLowerCase();
            const name = String(role.name || '').toLocaleLowerCase('tr-TR');
            if (cls === 'team' || name.includes('tüm ekip')) return true;
            if (focus === 'scrub') return cls.includes('scrub') || name.includes('scrub');
            if (focus === 'circulating') return cls.includes('circulating') || name.includes('sirküle');
            if (focus === 'anaesthesia') return cls.includes('anaesthesia') || name.includes('anestezi');
            return true;
        }
        function buildRoleFocusCard() {
            const box = el('div', 'role-focus-card');
            const current = App.intraopRoleFocus || 'all';
            const options = getRoleFocusOptions();
            const activeHint = options.find(o => o.id === current)?.hint || options[0].hint;
            box.innerHTML = `<div class="rft"><strong>Rol odağı</strong><br>${activeHint}</div><div class="role-focus-options">${options.map(o => `<button class="role-focus-btn ${o.id === current ? 'active' : ''}" data-role-focus="${o.id}">${o.label}</button>`).join('')}</div>`;
            box.querySelectorAll('[data-role-focus]').forEach(btn => {
                btn.onclick = (ev) => {
                    ev.preventDefault(); ev.stopPropagation();
                    setCurrentRoleFocus(btn.getAttribute('data-role-focus') || 'all');
                    renderRightPanel();
                    applyMarkerVisibility();
                    showSceneReaction(`Rol odağı: ${btn.textContent}. İlgisiz işaretler 3D sahnede gizlendi; görev listesinde vurgulandı.`, 'info');
                };
            });
            return box;
        }

        function openIntraopTaskEvidencePopup(task, item, event) {
            if (!task || App.currentRoom !== 'intraop') return false;
            const mapEntry = window.IntraopGCKL?.getMapEntryByTask?.(task.id) || null;
            const nodeId = task.linkedNode || task.gcklNode || mapEntry?.nodeId || null;
            const clinicalKey = task.linkedClinicalKey
                || (Array.isArray(task.linkedObjects) && task.linkedObjects[0])
                || (Array.isArray(mapEntry?.linkedObjects) && mapEntry.linkedObjects[0])
                || null;
            if (!nodeId && !clinicalKey) return false;

            const rect = item?.getBoundingClientRect?.();
            const x = typeof event?.clientX === 'number' ? event.clientX : (rect ? rect.left + 18 : 24);
            const y = typeof event?.clientY === 'number' ? event.clientY : (rect ? rect.top + 18 : 120);
            const fakeObj = {
                label: task.taskTitle || task.label,
                clinicalKey,
                opts: {
                    clinicalKey,
                    taskId: task.id,
                    nodeId,
                    requiredEvidence: mapEntry?.requiredEvidence || task.requiredEvidence || []
                }
            };

            try {
                if (clinicalKey && typeof window.showObjPopup === 'function') {
                    window.showObjPopup(fakeObj, x, y);
                    return true;
                }
                if (nodeId && typeof window.renderIntraopGcklNodePopup === 'function') {
                    return !!window.renderIntraopGcklNodePopup(nodeId, fakeObj, x, y);
                }
            } catch(e) {
                console.warn('[INTRAOP TASK POPUP] popup acilamadi', e);
            }
            return false;
        }

        /* ===================== RIGHT PANEL ===================== */
        function renderRightPanel() { 
            const phase = App.currentPatient[App.currentRoom];
            const list = $('#task-list');
            list.innerHTML = '';
            const roleModel = getPhaseRoleModel(App.currentRoom);
            const roleCard = el('div', 'phase-role-card');
            roleCard.innerHTML = `<div class="phase-role-title"><strong>${roleModel.title}</strong><span>${App.currentRoom.toUpperCase()}</span></div><div class="phase-role-grid">${roleModel.actors.map(a => `<span class="role-mini ${a.cls}" title="${a.desc}">${a.name}</span>`).join('')}</div>`;
            list.appendChild(roleCard);
            if (App.currentRoom === 'intraop') list.appendChild(buildRoleFocusCard());
            let lastTaskGroup = '';
            phase.tasks.forEach(t => { 
                if (App.currentRoom === 'intraop' && t.group && t.group !== lastTaskGroup) {
                    const gh = el('div', 'task-group-title', t.group);
                    gh.style.cssText = 'margin:10px 0 5px;font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-mute,#7aabb8);';
                    list.appendChild(gh);
                    lastTaskGroup = t.group;
                }
                let substepHtml = '';
                let intraopEvidenceDone = null;
                if (App.currentRoom === 'intraop' && Array.isArray(t.substeps) && t.substeps.length && window.IntraopGCKL) {
                    try {
                        // BUG: cross-cutting görevlerin (Sign-In Devri, Time-Out) substepleri
                        // plain string'dir ve tek bir GCKL node'a bağlı değildir.
                        // s.id undefined → evidence[undefined] → daima 0/N "evidence" gösterir.
                        // Çözüm: yalnız substep'ler GERÇEK evidence key'lerine sahip object'lerse
                        // ve task'ın linkedNode/gcklNode'u varsa progress badge'ini göster.
                        const linkedId = t.linkedNode || t.gcklNode;
                        const n = linkedId ? window.IntraopGCKL.getNode(linkedId) : null;
                        const hasEvidenceShapedSubsteps = n && t.substeps.some(s => s && typeof s === 'object' && s.id);
                        if (hasEvidenceShapedSubsteps) {
                            const evidence = n.evidenceCollected || {};
                            const doneSteps = t.substeps.filter(s => evidence[s.id]).length;
                            intraopEvidenceDone = doneSteps === t.substeps.length;
                            substepHtml = `<div class="task-substep-progress">${doneSteps}/${t.substeps.length} evidence</div>`;
                        }
                        // Cross-cutting görevler için: substep listesi (injectIntraopSubsteps)
                        // her substep'i ✓/○ olarak gösteriyor; ayrı bir badge'e gerek yok.
                    } catch(e) {}
                }
                const done = intraopEvidenceDone == null ? App.completedTasks.includes(t.id) : intraopEvidenceDone;
                const statusClass = done ? ' done' : (t.critical ? ' pending critical-pending' : ' pending');
                const item = el('div', 'task-item' + statusClass);
                const badges = []; 
                const ruleCfg = getTaskRuleConfig(t, App.currentRoom);
                const role = getTaskRoleInfo(t, App.currentRoom);
                if (role?.name) badges.push(`<span class="role-mini ${role.cls}">${role.name}</span>`);
                if (t.critical) badges.push(`<span class="badge crit">Kritik</span>`); 
                if (!done && t.critical) badges.push(`<span class="badge state-critical">Bekliyor</span>`);
                if (done) badges.push(`<span class="badge state-done">Tamamlandı</span>`);
                if (ruleCfg.freeComplete) badges.push(`<span class="badge free">Serbest</span>`);
                if (ruleCfg.guidelineTag || (t.guideline && GUIDELINE_THEMES[t.guideline])) badges.push(`<span class="badge gline">${ruleCfg.guidelineTag || GUIDELINE_THEMES[t.guideline].tag}</span>`);
                if (App.currentRoom === 'intraop' && App.intraopRoleFocus && App.intraopRoleFocus !== 'all') {
                    if (isTaskInRoleFocus(role, App.intraopRoleFocus)) item.classList.add('role-emphasis');
                    else item.classList.add('role-soft');
                }
                const stateMark = done ? '✓' : (t.critical ? '!' : '•');
                const stateTitle = done ? 'Görev tamamlandı' : (t.critical ? 'Kritik görev bekliyor' : 'Görev bekliyor');
                const checkClass = done ? 'state-done' : (t.critical ? 'state-critical' : 'state-pending');
                item.innerHTML = `<div class="check ${checkClass}" title="${stateTitle}" aria-label="${stateTitle}">${stateMark}</div><div class="task-main"><div class="task-head"><div class="lbl">${t.taskTitle || t.label}</div><div class="badges">${badges.join('')}</div></div><div class="task-roleline">${t.taskText || role.detail}</div>${substepHtml}</div>`;
                item.onclick = (ev) => {
                    if (App.currentRoom === 'intraop' && (t.gcklNode || t.linkedNode || t.gcklMapId || t.linkedClinicalKey)) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if (openIntraopTaskEvidencePopup(t, item, ev)) return;
                    }
                    completeTask(t.id);
                };
                list.appendChild(item); 
            }); 
            const evArea = $('#event-card-area');
            evArea.classList.remove('visible');
            evArea.innerHTML = '';
            const allDone = phase.tasks.filter(t => t.critical).every(t => App.completedTasks.includes(t.id));
            const diagDone = App.diagnosesConfirmed[App.currentRoom];
            const sympDone = App.symptomsConfirmed[App.currentRoom];
            const advance = $('#advance-btn');
            advance.disabled = !(allDone && diagDone && sympDone);
            advance.textContent = App.currentRoom === 'postop' ? 'Vakayı Tamamla → Rapor' : 'Sonraki Faza Geç →';
            
            // --- AI Kriz Senaryosu Üretici ---
            const oldAiBtn = document.getElementById('ai-crisis-btn');
            if(oldAiBtn) oldAiBtn.remove();
            const oldDischargeBtn = document.getElementById('ai-discharge-btn');
            if(oldDischargeBtn) oldDischargeBtn.remove();
            const oldSoapBtn = document.getElementById('ai-soap-btn');
            if(oldSoapBtn) oldSoapBtn.remove();
            const oldDocBtn = document.getElementById('ai-doc-btn');
            if(oldDocBtn) oldDocBtn.remove();
            
            if (App.aiMode) {
                const crisisBtn = el('button', 'rd-action ai-action', '✨ AI Kriz Başlat (Rastgele)');
                crisisBtn.id = 'ai-crisis-btn';
                crisisBtn.style.width = '100%';
                crisisBtn.style.marginTop = '8px';
                crisisBtn.onclick = triggerAICrisis;
                advance.parentNode.insertBefore(crisisBtn, advance.nextSibling);
                
                const soapBtn = el('button', 'rd-action ai-action', '✨ AI Gözlem Notu (SOAP) Yaz');
                soapBtn.id = 'ai-soap-btn';
                soapBtn.style.width = '100%';
                soapBtn.style.marginTop = '8px';
                soapBtn.onclick = () => openSOAPModal();
                advance.parentNode.insertBefore(soapBtn, advance.nextSibling);

                const docBtn = el('button', 'rd-action ai-action', '✨ AI Nöbetçi Hekime Danış');
                docBtn.id = 'ai-doc-btn';
                docBtn.style.width = '100%';
                docBtn.style.marginTop = '8px';
                docBtn.onclick = () => openDoctorModal();
                advance.parentNode.insertBefore(docBtn, advance.nextSibling);

                // YENİ: Hasta Yakını Butonu
                const oldFamilyBtn = document.getElementById('ai-family-btn');
                if(oldFamilyBtn) oldFamilyBtn.remove();
                
                const familyBtn = el('button', 'rd-action ai-action', '✨ AI Hasta Yakını ile Görüş');
                familyBtn.id = 'ai-family-btn';
                familyBtn.style.width = '100%';
                familyBtn.style.marginTop = '8px';
                familyBtn.style.background = 'rgba(92, 196, 214, 0.1)';
                familyBtn.style.color = 'var(--teal)';
                familyBtn.style.borderColor = 'var(--teal-2)';
                familyBtn.onclick = () => openFamilyModal();
                advance.parentNode.insertBefore(familyBtn, advance.nextSibling);

                // --- ✨ AI Taburculuk Eğitim Broşürü ---
                if (App.currentRoom === 'postop') {
                    const dischargeBtn = el('button', 'rd-action ai-action', '✨ AI Taburculuk Broşürü Üret');
                    dischargeBtn.id = 'ai-discharge-btn';
                    dischargeBtn.style.width = '100%';
                    dischargeBtn.style.marginTop = '8px';
                    dischargeBtn.onclick = async () => {
                        dischargeBtn.disabled = true;
                        dischargeBtn.textContent = '✨ Broşür Hazırlanıyor...';
                        const p = App.currentPatient;
                        const prompt = `Sen uzman bir eğitim hemşiresisin. ${p.age} yaşındaki ${p.gender} hastamız ${p.name}, "${p.surgery}" ameliyatı geçirdi ve taburcu oluyor. Özgeçmişi: ${p.history.join(', ')}. Hastanın evde anlayabileceği, şefkatli, tıbbi jargon içermeyen, kişiselleştirilmiş bir taburculuk eğitim broşürü hazırla. Başlıklar: Yara Bakımı, İlaçlar ve Ağrı Yönetimi, Beslenme ve Hareket, Ne Zaman Doktora Başvurmalı. Yanıtı sadece <h3>, <ul>, <li>, <p>, <b> etiketleri kullanarak temiz bir HTML formatında ver (markdown kullanma, kod bloğu içine alma).`;
                        const res = await callGeminiAPI(prompt);
                        
                        let cleanHtml = res.replace(/```html/g, '').replace(/```/g, '');
                        
                        $('#discharge-body').innerHTML = cleanHtml;
                        $('#discharge-modal').classList.add('visible');
                        
                        dischargeBtn.disabled = false;
                        dischargeBtn.textContent = '✨ AI Taburculuk Broşürü Üret';
                        addScore(['communication', 'patientCentredCare'], 5, 0); // Max is precalculated
                        addPhaseScore('postop', 5, 0);
                        updateScoreStrip();
                    };
                    advance.parentNode.insertBefore(dischargeBtn, advance.nextSibling);
                }
            }
            
            updateScoreStrip(); 
        }

        function openDoctorModal() {
            const m = $('#doctor-modal');
            const chatHist = $('#doctor-chat-history');
            const input = $('#doctor-input');
            const submit = $('#doctor-submit');
            
            const updateChatUI = () => {
                chatHist.innerHTML = App.doctorChatHistory.map(msg => 
                    `<div style="margin-bottom:8px; padding:8px; border-radius:4px; background:${msg.role==='user'?'var(--panel)':'var(--teal-soft)'}; color:${msg.role==='user'?'var(--ink)':'#08111f'}; border: 1px solid ${msg.role==='user'?'var(--line)':'var(--teal-2)'}">
                        <strong style="font-size:10px; text-transform:uppercase;">${msg.role==='user'?'Hemşire (Siz)':'Nöbetçi Hekim'}</strong><br>${msg.text.replace(/\n/g, '<br>')}
                    </div>`
                ).join('');
                chatHist.scrollTop = chatHist.scrollHeight;
            };
            
            updateChatUI();
            input.value = '';
            submit.disabled = false;
            submit.textContent = '✨ Mesajı Gönder';
            
            submit.onclick = async () => {
                const text = input.value.trim();
                if(!text) return;
                
                App.doctorChatHistory.push({ role: 'user', text });
                updateChatUI();
                input.value = '';
                
                submit.disabled = true;
                submit.textContent = '✨ Hekim Yazıyor...';
                
                const p = App.currentPatient;
                let conv = App.doctorChatHistory.map(m => `${m.role === 'user' ? 'Hemşire' : 'Hekim'}: ${m.text}`).join('\n');
                
                const prompt = `Sen ${p.surgery} ameliyatını gerçekleştiren veya nöbetçi olan uzman doktorsun. 
Hasta: ${p.name}, Yaş: ${p.age}. Özgeçmiş: ${p.history.join(', ')}. Faz: ${App.currentRoom}.
Bir klinik hemşiresi sana mesaj atıyor. Lütfen bir hekim profesyonelliğinde (kısa, net ve direktif veren bir dille) cevap ver. 
Hemşirenin aktardığı duruma göre eğer acil bir müdahale (örn. sıvı replasmanı, kan tetkiki, EKG) gerekiyorsa bunu order et.
İşte aranızdaki konuşma geçmişi:
${conv}
Hekim olarak son mesaja yanıtın:`;

                const reply = await callGeminiAPI(prompt);
                App.doctorChatHistory.push({ role: 'doctor', text: reply });
                updateChatUI();
                
                submit.disabled = false;
                submit.textContent = '✨ Mesajı Gönder';
                
                addScore(['communication', 'patientSafety'], 5, 0); // Max is precalculated
                addPhaseScore(App.currentRoom, 5, 0);
                updateScoreStrip();
            };
            
            m.classList.add('visible');
        }

        async function triggerAICrisis() {
            const btn = $('#ai-crisis-btn');
            btn.disabled = true;
            btn.textContent = '✨ Senaryo Kurgulanıyor...';
            
            const p = App.currentPatient;
            const prompt = `Sen bir klinik simülasyon eğitmenisin. Hasta ${p.name}, ${p.age} yaşında, ${p.surgery} ameliyatı oluyor. Şu an ${App.currentRoom} (preop/intraop/postop) fazındayız. Hastanın geçmişi: ${p.history.join(', ')}. 
Bu faza ve hastanın spesifik cerrahisine uygun, ACİL müdahale gerektiren gerçekçi bir klinik olay/kriz senaryosu üret (Örn: Ani kanama, taşikardi, allerjik reaksiyon, kompartman sendromu vs).
Öğrencinin seçmesi için 3 müdahale seçeneği üret: Sadece 1 tanesi hayat kurtarıcı ve doğru olsun (correct: true), diğer 2'si ise yanlış veya eksik olsun (correct: false).`;
            
            const schema = { 
                type: "OBJECT", 
                properties: {
                    title: { type: "STRING", description: "Olayın kısa başlığı (örn: Ani Tansiyon Düşüklüğü)" },
                    desc: { type: "STRING", description: "Olayın detaylı tanımı ve yaşamsal bulgular" },
                    options: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                label: { type: "STRING", description: "Müdahale seçeneği eylemi" },
                                correct: { type: "BOOLEAN", description: "Bu eylem güvenli ve doğru mu?" },
                                feedback: { type: "STRING", description: "Bu seçenek seçildiğinde öğrenciye verilecek akademik geri bildirim" }
                            }
                        }
                    }
                } 
            };
            
            try {
                const result = await callGeminiJSON(prompt, schema);
                if(result) {
                    const ev = {
                        id: 'ai_crisis_' + Date.now(),
                        title: '✨ ' + result.title,
                        desc: result.desc,
                        options: shuffle(result.options)
                    };
                    showEventCard(ev);
                } else {
                    toast('error', 'Hata', 'Kriz senaryosu üretilemedi.');
                }
            } catch(e) {
                console.error(e);
                toast('error', 'Hata', 'Kriz üretilirken bir hata oluştu.');
            }
            
            btn.disabled = false;
            btn.textContent = '✨ AI Kriz Başlat (Rastgele)';
        }

        function completeTask(taskId, sourceObj = null) { 
            const markerSourceKey = getMarkerCompletionKeyFromObject(sourceObj);
            App.__lastMarkerSourceKey = markerSourceKey || null;
            if (App.completedTasks.includes(taskId)) {
                // v6 SM tutarlılık: legacy'de var ama v6'da yoksa shadow'la senkronize et
                try {
                    if (NurseKitSM.getStatus(taskId) !== 'completed') {
                        NurseKitSM.shadowComplete(taskId, sourceObj);
                    }
                } catch(e) {}
                try { if (markerSourceKey) completeMarkerBySourceKey(markerSourceKey, true); } catch(e) {}
                try { pulseMarkerComplete(taskId, markerSourceKey || null); } catch(e) {}
                try { gcklBoardSyncMarkerState(); } catch(e) {}
                try {
                    const p = $('#obj-popup');
                    const po = App.__currentObjPopupObj;
                    if (p?.classList?.contains('visible') && String(po?.opts?.clinicalKey || '').startsWith('ssc-board')) showObjPopup(po);
                } catch(e) {}
                return true;
            }
            const phase = App.currentPatient[App.currentRoom];
            const t = phase.tasks.find(x => x.id === taskId); if (!t) return false;
            const ruleCfg = getTaskRuleConfig(t, App.currentRoom);
            const sourceKey = sourceObj ? getObjectCriticalTalkKey(sourceObj) : null;
            const objectCfg = getObjectRuleConfig(sourceKey, t, App.currentRoom);

            if (sourceKey && !objectCfg.freeComplete && !isCriticalCommunicationDone(sourceKey, App.currentRoom)) {
                showCriticalSafetyError(getRuleForObjectKey(sourceKey));
                return false;
            }

            const criticalRule = getCriticalRuleForTask(t, App.currentRoom);
            const talkKey = ruleCfg.talkKey || criticalRule?.key || null;
            const requiresTalk = !!criticalRule || !!ruleCfg.requiresPatientTalk;
            if (!ruleCfg.freeComplete && requiresTalk && talkKey && !isCriticalCommunicationDone(talkKey, App.currentRoom)) {
                showCriticalSafetyError(criticalRule || getRuleForObjectKey(talkKey));
                return false;
            }

            // --- AI SBAR Intercept ---
            if (App.aiMode && t.label.toLowerCase().includes('sbar')) {
                openSBARModal(t, phase);
                return true;
            }

            executeTaskCompletion(t, phase);
            App.__lastMarkerSourceKey = null;
            return true;
        }

        function executeTaskCompletion(t, phase) {
            App.completedTasks.push(t.id);

            // === v6 SM Shadow Mode: yeni state'e de yaz ===
            try { NurseKitSM.shadowComplete(t.id, App.__lastMarkerSourceObj || null); } catch(e) { console.warn('[NurseKitSM] shadow hatası:', e); }

            // Yalnızca ilgili nesnenin etiketi tamamlandı olarak işaretlenir.
            try { if (App.__lastMarkerSourceKey) completeMarkerBySourceKey(App.__lastMarkerSourceKey, false); } catch (e) {}
            // 3D marker — ilgili etikete kısa yeşil ödül parlaması
            try { pulseMarkerComplete(t.id, App.__lastMarkerSourceKey || null); } catch (e) {}
            try { gcklBoardSyncMarkerState(); } catch (e) {}

            const earned = t.score;
            addScore(t.categories, earned, 0); // Max is precalculated
            addPhaseScore(App.currentRoom, earned, 0);

            App.feedbackEntries.push({ ok: true, label: t.label, kind: 'task', guideline: t.guideline, phase: App.currentRoom });
            // OSCE-PHDYÖ otomatik puanlama
            autoScoreOSCEFromTask(t.id, true, { label: t.label, phase: App.currentRoom });
            toast('success', '✓ Görev Tamamlandı', t.label + (App.mode === 'tutor' && t.guideline ? ' · ' + GUIDELINE_FEEDBACK[t.guideline] : ''));
            // Eğitim modunda gerekçe modalı tetikle (madde eşleşmesi varsa)
            try { if (App.mode === 'tutor') maybePromptRationaleForTask(t.id); } catch(e){}
            
            const rq = (phase.reasoning || []).find(r => r.after === t.id && !App.reasoningAnswered[r.id]); 
            if (rq) askReasoning(rq);
            
            const ev = (phase.events || []).find(e => e.trigger === t.id); 
            if (ev && !App.eventHandled[App.currentRoom + '_' + ev.id]) showEventCard(ev);
            
            renderRightPanel();
            renderTopbar();
            updateProgressBar(); 
            try {
                const p = $('#obj-popup');
                const po = App.__currentObjPopupObj;
                if (p?.classList?.contains('visible') && String(po?.opts?.clinicalKey || '').startsWith('ssc-board')) showObjPopup(po);
            } catch(e) {}
        }

        function openSBARModal(task, phase) {
            const m = $('#sbar-modal');
            $('#sbar-title').textContent = task.label;
            $('#sbar-input').value = '';
            $('#sbar-result').style.display = 'none';
            $('#sbar-continue').style.display = 'none';
            $('#sbar-submit').style.display = 'block';
            $('#sbar-submit').disabled = false;
            $('#sbar-submit').textContent = '✨ AI SBAR Değerlendir & Tamamla';
            
            $('#sbar-submit').onclick = async () => {
                const text = $('#sbar-input').value.trim();
                if(!text) { toast('warning', 'Eksik Giriş', 'Lütfen teslim notunuzu yazın.'); return; }
                
                $('#sbar-submit').disabled = true;
                $('#sbar-submit').textContent = '✨ Gemini Değerlendiriyor...';
                
                const p = App.currentPatient;
                const prompt = `Sen kıdemli bir klinik eğitmensin. Öğrenci hemşire, ${p.name} (${p.age}, ${p.surgery}) isimli hastanın SBAR (Situation, Background, Assessment, Recommendation) formatında devir teslimini (handover) yapıyor. 
Öğrencinin yazdığı not: "${text}".
Hastanın özgeçmişi: ${p.history.join(', ')}. Hayati bulgular: TA ${p.vitals.bp}. 
Lütfen bu SBAR teslimini S, B, A, R başlıklarına uygunluğu ve klinik doğruluğu açısından kısa, yapıcı ve teşvik edici bir dille değerlendir. Sonunda öğrenciye 10 üzerinden bir not ver.`;

                const feedback = await callGeminiAPI(prompt);
                
                $('#sbar-result').innerHTML = `<b style="color:var(--violet)">✨ AI Eğitmen Değerlendirmesi:</b><br><div style="margin-top:6px; line-height:1.5">${feedback.replace(/\n/g, '<br>')}</div>`;
                $('#sbar-result').style.display = 'block';
                $('#sbar-submit').style.display = 'none';
                $('#sbar-continue').style.display = 'block';
                
                $('#sbar-continue').onclick = () => {
                    m.classList.remove('visible');
                    executeTaskCompletion(task, phase);
                };
            };
            
            m.classList.add('visible');
        }

        function openSOAPModal() {
            const m = $('#soap-modal');
            $('#soap-input').value = '';
            $('#soap-result').style.display = 'none';
            $('#soap-submit').style.display = 'block';
            $('#soap-submit').disabled = false;
            $('#soap-submit').textContent = '✨ AI Notu Değerlendir';
            
            $('#soap-submit').onclick = async () => {
                const text = $('#soap-input').value.trim();
                if(!text) { toast('warning', 'Eksik Giriş', 'Lütfen gözlem notunuzu yazın.'); return; }
                
                $('#soap-submit').disabled = true;
                $('#soap-submit').textContent = '✨ Gemini Değerlendiriyor...';
                
                const p = App.currentPatient;
                const prompt = `Sen kıdemli bir klinik eğitmensin. Öğrenci hemşire, ${p.name} (${p.age}, ${p.surgery}) isimli hastanın ${App.currentRoom} fazı için aşağıdaki Gözlem Notunu (SOAP formatında) yazdı. 
Öğrencinin notu: "${text}".
Lütfen bu notu akademik ve klinik açıdan değerlendir. S(Subjektif), O(Objektif), A(Değerlendirme), P(Plan) yapısına uygun mu? Eksik olan klinik bulgular var mı? Kısa, yapıcı bir geri bildirim ver ve en sonda örnek ideal bir SOAP notu yaz.`;

                const feedback = await callGeminiAPI(prompt);
                
                $('#soap-result').innerHTML = `<b style="color:var(--violet)">✨ AI Eğitmen Değerlendirmesi:</b><br><div style="margin-top:6px; line-height:1.5">${feedback.replace(/\n/g, '<br>')}</div>`;
                $('#soap-result').style.display = 'block';
                $('#soap-submit').style.display = 'none';
                
                addScore(['communication', 'clinicalAssessment'], 10, 0); // Max is precalculated
                addPhaseScore(App.currentRoom, 10, 0);
                updateScoreStrip();
            };
            
            m.classList.add('visible');
        }

        function showEventCard(ev) { 
            const area = $('#event-card-area');
            area.classList.add('visible');
            area.innerHTML = `<div class="event-card visible"><div class="et">⚠ Klinik Olay</div><div class="eh">${ev.title}</div><div class="ed">${ev.desc}</div><div class="opts"></div></div>`;
            const opts = area.querySelector('.opts');
            ev.options.forEach((o, i) => { 
                const b = el('button', 'opt', o.label);
                b.onclick = () => handleEventOption(ev, i);
                opts.appendChild(b); 
            }); 
        }

        function handleEventOption(ev, idx) { 
            const o = ev.options[idx];
            App.eventHandled[App.currentRoom + '_' + ev.id] = true;
            const isAICrisis = ev.id.startsWith('ai_crisis_');
            const maxToAdd = isAICrisis ? 12 : 0; // Precalculated maxes don't include dynamic AI crises
            
            if (o.correct) { 
                addScore(['prioritisation', 'patientSafety'], 12, maxToAdd);
                addPhaseScore(App.currentRoom, 12, maxToAdd);
                toast('success', '✓ Doğru Karar', o.feedback); 
            } else { 
                addScore(['prioritisation', 'patientSafety'], -5, maxToAdd);
                addPhaseScore(App.currentRoom, -5, maxToAdd);
                toast('error', '⚠ Güvenli Değil', o.feedback); 
            }
            App.feedbackEntries.push({ ok: o.correct, label: ev.title, kind: 'event', phase: App.currentRoom, detail: o.feedback });
            $('#event-card-area').innerHTML = '';
            $('#event-card-area').classList.remove('visible');
            renderTopbar();
            updateScoreStrip(); 
        }

        function advancePhase() {
            // İP-2: Tüm faz geçişlerinde blocker kontrolü
            const bypass = isPhaseGateBypassed();
            const tempPreopToIntraopBypass = !!App.tempIntraopUnlock && App.currentRoom === 'preop';

            if (App.currentRoom === 'preop') {
                if (!bypass && !tempPreopToIntraopBypass) {
                    const blocker = getPhaseAdvanceBlocker('preop');
                    if (blocker) {
                        // Faz geçişi engellendi; ekrana göster
                        if (blocker.source === 'legacy') {
                            showCriticalSafetyError(blocker.rule);
                        } else {
                            // GCKL agregat blocker — özel mesaj
                            showGCKLBlockerError(blocker.rule);
                        }
                        // Geçişi engelle ve log'a yaz
                        try { recordAction('phase-gate-blocked', { phase: 'preop', blocker: blocker }); } catch(e) {}
                        return;
                    }
                }
                App.unlockedRooms.intraop = true;
                try { recordAction('phase-advance', { from: 'preop', to: 'intraop', bypassed: (bypass || tempPreopToIntraopBypass) }); } catch(e) {}
                switchRoom('intraop');
            } else if (App.currentRoom === 'intraop') {
                const tempPostopBypass = !!App.tempPostopUnlock;
                if (!bypass && !tempPostopBypass) {
                    const blocker = getPhaseAdvanceBlocker('intraop');
                    if (blocker) {
                        if (blocker.source === 'legacy') {
                            showCriticalSafetyError(blocker.rule);
                        } else {
                            showGCKLBlockerError(blocker.rule);
                        }
                        try { recordAction('phase-gate-blocked', { phase: 'intraop', blocker: blocker }); } catch(e) {}
                        return;
                    }
                }
                App.unlockedRooms.postop = true;
                try { recordAction('phase-advance', { from: 'intraop', to: 'postop', bypassed: (bypass || !!App.tempPostopUnlock) }); } catch(e) {}
                switchRoom('postop');
            } else {
                // postop → report (eski mantık korundu)
                const blocker = getPhaseCriticalBlocker(App.currentRoom);
                if (blocker && !bypass) { showCriticalSafetyError(blocker); return; }
                if (shouldShowPhaseDebrief('postop', 'report')) { openPhaseDebriefModal('postop', 'report'); return; }
                showReport();
            }
        }

        // İP-2: GCKL blocker mesajını göster
        function showGCKLBlockerError(blockerRule) {
            // Mevcut showCriticalSafetyError uyumlu bir rule objesi bekliyor
            // GCKL blocker için sahte rule objesi kuralım
            const adapted = {
                key: blockerRule.key || 'gckl_blocker',
                title: blockerRule.title || 'GCKL Faz Geçiş Kontrolü',
                description: blockerRule.description || 'Bir GCKL kritik maddesi tamamlanmadı.',
                items: [{
                    label: blockerRule.gcklId || 'GCKL',
                    text: blockerRule.description || ''
                }]
            };
            // Mevcut handler'a yönlendir; sistem ona alışkın
            try {
                showCriticalSafetyError(adapted);
            } catch(e) {
                // Fallback: toast göster
                try { toast('error', adapted.title, adapted.description); } catch(e2) {}
                console.warn('[İP-2 Phase Gate] Blocker:', adapted);
            }
        }

        /* ===================== REASONING & AI TUTOR ===================== */
        function askReasoning(q) { 
            const m = $('#reason-modal');
            const body = $('#reason-body');
            body.innerHTML = '';
            const tag = q.kind === 'priority' ? 'Önceliklendirme Sorusu' : 'Klinik Akıl Yürütme';
            $('#reason-tag').textContent = tag;
            $('#reason-title').textContent = 'Karar Gerekçesi';
            body.appendChild(el('div', 'reason-q', q.question));
            const opts = el('div', 'reason-opts');
            q.options.forEach((o, i) => { 
                const b = el('button', 'reason-opt');
                b.innerHTML = `<span class="ix">${String.fromCharCode(65+i)}</span><span>${o}</span>`;
                b.onclick = () => answerReasoning(q, i);
                opts.appendChild(b); 
            });
            body.appendChild(opts);
            m.classList.add('visible'); 
        }

        function answerReasoning(q, idx) { 
            const m = $('#reason-modal');
            const opts = m.querySelectorAll('.reason-opt');
            const correct = idx === q.correct;
            App.reasoningAnswered[q.id] = { correct, idx };
            opts[idx].classList.add(correct ? 'correct' : 'wrong'); 
            if (!correct) opts[q.correct].classList.add('correct');
            opts.forEach(b => b.disabled = true);
            
            addScore(['clinicalReasoning', 'surgicalNursingKnowledge'], correct ? 10 : -3, 0); // Max is precalculated
            addPhaseScore(App.currentRoom, correct ? 10 : -3, 0);

            App.feedbackEntries.push({ ok: correct, label: q.question, kind: 'reasoning', phase: App.currentRoom, guideline: q.guideline, detail: q.rationale });
            autoScoreOSCEFromReasoning(q.id, correct, { phase: App.currentRoom, guideline: q.guideline });
            
            const r = el('div', 'reason-rationale');
            const gtag = q.guideline ? ` <span class="gline-tag">${GUIDELINE_THEMES[q.guideline]?.tag||q.guideline}</span>` : '';
            r.innerHTML = App.mode === 'tutor' ? `<b>Klinik gerekçe.</b> ${q.rationale}${gtag}` : '<b>Yanıt kaydedildi.</b> Detaylı gerekçe son raporda görüntülenecektir.';
            $('#reason-body').appendChild(r);
            
            // --- AI TUTOR INTEGRATION ---
            if (App.mode === 'tutor' && App.aiMode) {
                const aiBtn = el('button', 'rd-action ai-action', '✨ AI Klinik Danışman (Detaylı Açıkla)');
                aiBtn.style.marginTop = '12px';
                aiBtn.style.marginRight = '10px';
                aiBtn.onclick = async () => {
                    aiBtn.textContent = '✨ Gemini Yanıtı Bekleniyor...';
                    aiBtn.disabled = true;
                    
                    const prompt = `Sen uzman bir cerrahi hemşireliği akademisyenisin. Öğrenciye şu soruyu sorduk: "${q.question}". Seçenekler: ${q.options.join(', ')}. Öğrenci "${q.options[idx]}" seçeneğini seçti (Doğru mu: ${correct ? 'Evet' : 'Hayır'}). Öğrenciye empatik, akademik ve öğretici bir dille neden doğru seçeneğin ("${q.options[q.correct]}") perioperatif hemşirelik açısından en uygun müdahale olduğunu açıkla (Kılavuz referansı: ${q.guideline || 'Genel pratik'}). Kısa, net ve 2-3 cümlelik bir geri bildirim yaz.`;
                    
                    const aiText = await callGeminiAPI(prompt);
                    
                    const aiDiv = el('div', 'reason-rationale');
                    aiDiv.style.borderColor = 'var(--violet)';
                    aiDiv.style.backgroundColor = 'rgba(155, 137, 196, 0.1)';
                    aiDiv.innerHTML = `<b style="color:var(--violet)">✨ AI Danışman:</b> ${aiText}`;
                    
                    $('#reason-body').insertBefore(aiDiv, closeWrap);
                    aiBtn.remove();
                };
                $('#reason-body').appendChild(aiBtn);
            }

            const closeWrap = el('div');
            const closeBtn = el('button', 'rd-action', 'Devam');
            closeBtn.style.marginTop = '14px';
            closeBtn.onclick = () => { 
                m.classList.remove('visible');
                renderRightPanel();
                renderTopbar();
                updateScoreStrip(); 
            };
            closeWrap.appendChild(closeBtn);
            $('#reason-body').appendChild(closeWrap); 
        }

        /* ===================== DIALOGUE & AI PATIENT ===================== */
        function renderDialogue() { 
            const c = $('#dialogue-questions');
            c.innerHTML = '';
            const helper = el('div', 'dq-helper', 'Soruları sırayla sorarak yapılandırılmış görüşmeyi başlat. Sorulan başlıklar sol listede pasifleşir, yanıtlar sağdaki akışta birikir.');
            c.appendChild(helper);
            const groups = {};
            DIALOG_QUESTIONS.forEach(q => { (groups[q.group] = groups[q.group] || []).push(q); });
            Object.keys(groups).forEach(g => { 
                c.appendChild(el('div', 'dq-group', g));
                groups[g].forEach(q => { 
                    const asked = App.askedQuestions.includes(q.id);
                    const b = el('button', 'dq-btn' + (asked ? ' asked' : ''), q.label); 
                    if (!asked) b.onclick = () => askDialogue(q);
                    c.appendChild(b); 
                }); 
            });
            const stream = $('#dialogue-stream-body');
            const emptyState = stream.querySelector('.dialogue-empty');
            if (emptyState) emptyState.remove();
            const hasMessages = !!stream.querySelector('.chat-msg');
            const empty = stream.querySelector('.dialogue-empty');
            if (!hasMessages) {
                if (!empty) {
                    const state = el('div', 'dialogue-empty');
                    state.innerHTML = '<div class="de-title">Görüşme henüz başlamadı</div><div class="de-copy">Soldaki soru kartlarından birini seçerek hasta ile görüşmeyi başlat. Sistem; iletişim, hasta merkezli bakım ve güvenlik farkındalığını akış boyunca izler.</div>';
                    stream.appendChild(state);
                }
            } else if (empty) {
                empty.remove();
            }
            $('#ai-status').textContent = App.aiMode ? '✨ AI Hasta (Gemini LLM): AÇIK' : 'Kural tabanlı yanıt';
            $('#ai-status').className = 'ai-status ' + (App.aiMode ? 'on' : 'off'); 
        }

        async function askDialogue(q) { 
            if (App.askedQuestions.includes(q.id)) return;
            App.askedQuestions.push(q.id);
            const stream = $('#dialogue-stream-body');
            const emptyState = stream.querySelector('.dialogue-empty');
            if (emptyState) emptyState.remove();
            
            const nm = el('div', 'chat-msg nurse');
            nm.innerHTML = `<div class="who">Hemşire</div>${q.label}`;
            stream.appendChild(nm);
            stream.scrollTop = stream.scrollHeight;
            
            const pm = el('div', 'chat-msg patient');
            pm.innerHTML = `<div class="who">${App.currentPatient.name}</div><span class="typing">Yanıtlıyor...</span>`;
            stream.appendChild(pm);
            stream.scrollTop = stream.scrollHeight;

            const reply = await getPatientReply(q.id, q.label);
            
            pm.innerHTML = `<div class="who">${App.currentPatient.name}${App.aiMode ? ' ✨ 🔊' : ''}</div>${reply.replace(/\n/g, '<br>')}`;
            stream.scrollTop = stream.scrollHeight;
            
            // --- AI TTS ---
            if(App.aiMode) {
                playTTS(reply, App.currentPatient.gender);
            }
            
            addScore(['communication', 'patientCentredCare'], 4, 0); // Max is precalculated
            addPhaseScore(App.currentRoom, 4, 0);

            renderDialogue();
            renderTopbar();
            updateScoreStrip(); 
        }

        async function getPatientReply(qid, qtext) {
            const p = App.currentPatient;
            const phase = App.currentRoom || 'preop';

            // m0192: AI key varsa Gemini'a sor, yoksa kural-tabanlı havuz.
            if (App.aiMode && hasGeminiKey()) {
                const phaseLabels = { preop: 'preop bekleme odasında', intraop: 'ameliyathanede', postop: 'PACU' };
                const sx = p[phase] && p[phase].symptoms ? p[phase].symptoms.join(', ') : 'belirgin semptom yok';
                const prompt = 'Sen ' + p.age + ' yaşında ' + p.gender + ' hastasın. Adın ' + p.name + '. Cerrahi: ' + p.surgery + '. Faz: ' + (phaseLabels[phase] || phase) + '. Semptomlar: ' + sx + '. Öykü: ' + (p.history || '-') + '. Alerji: ' + (p.allergy || 'yok') + '. Hemşire soruyor: ' + qtext + '. Kısa (1-2 cümle), doğal, hasta perspektifinden yanıtla.';
                const aiResp = await callGeminiAPI(prompt);
                if (aiResp) return aiResp;
            }

            await new Promise(r => setTimeout(r, 350));

            // Hasta-bazlı yardımcılar
            const hist = String(p.history || '').toLowerCase();
            const surgery = String(p.surgery || '').toLowerCase();
            const isCABG = /cabg|koroner|bypass|greft/.test(surgery);
            const isOrtho = /ortop|kalça|diz|kemik/.test(surgery);
            const isLap = /laparosk|kolesist|safra/.test(surgery);

            // Ağrı
            let painAns;
            if (phase === 'postop') {
                if (isCABG) painAns = 'Göğsümde basınç gibi bir ağrı var, 6/10 civarında.';
                else if (isOrtho) painAns = 'Ameliyat olduğum yerde 7/10 ağrı, hareket edince artıyor.';
                else if (isLap) painAns = 'Karın bölgesinde basınç ve ağrı, 5/10.';
                else painAns = 'Ameliyat bölgesinde 6/10 civarı ağrı.';
            } else if (phase === 'preop') {
                if (isCABG && hist.includes('anjin')) painAns = 'Bazen göğsümde sıkışma hissediyorum.';
                else if (isOrtho) painAns = 'Bu ağrı yüzünden ameliyat olmaya karar verdim.';
                else painAns = 'Şu an belirgin bir ağrım yok.';
            } else painAns = 'Uyuyorum, yanıt veremem.';

            // İlaçlar
            const meds = [];
            if (isCABG) meds.push('aspirin', 'beta-bloker', 'statin');
            if (hist.includes('diyabet')) meds.push('metformin/insülin');
            if (hist.includes('hipertans')) meds.push('tansiyon ilacı');
            const medsList = meds.length ? meds.join(', ') : 'birkaç düzenli ilaç';

            const map = {
                q_id: 'Adım ' + p.name + ', ' + p.age + ' yaşındayım.',
                q_proc: p.surgery + ' olacağımı söylediler.',
                q_allergy: (p.allergy && p.allergy !== '—' && p.allergy !== 'Bilinen alerji yok')
                    ? 'Evet, alerjim var: ' + p.allergy + '.'
                    : 'Bilinen bir alerjim yok.',
                q_meds: medsList + ' kullanıyorum.',
                q_prosthesis: 'Üzerimde takı/protez/lens yok.',
                q_fasting: 'Gece yarısından beri yemedim, içmedim.',
                q_pain: painAns,
                q_anx: phase === 'postop' ? 'Biraz rahatladım ama hâlâ tedirginim.' : 'Biraz endişeliyim, normal mi?',
                q_info: 'Doktor genel olarak anlattı ama bazı şeyler kafamı karıştırıyor.',
                q_mob: phase === 'postop'
                    ? (isCABG ? 'Derin nefes yapıyorum ama göğüs ağrısı zorlaştırıyor.' : 'Mobilizasyona başladım.')
                    : 'Hayır, henüz detaylı öğretmediler.'
            };
            return map[qid] || 'Anlamadım, tekrar eder misiniz?';
        }
        /* ===================== SCORE ===================== */
        function computeTotalScore() { 
            let pts = 0, max = 0;
            Object.keys(App.scores).forEach(k => { pts += App.scores[k].earned; max += App.scores[k].max; });
            let percent = max > 0 ? Math.round((pts / max) * 100) : 0; 
            percent = Math.max(0, Math.min(100, percent));
            return { points: Math.max(0, pts), max, percent }; 
        }

        function updateScoreStrip() { 
            const bar = $('#score-cats');
            bar.innerHTML = '';
            Object.keys(SCORE_CATEGORIES).forEach((k, i) => { 
                const cat = App.scores[k] || { earned:0, max:0 };
                let pctStr = 'Ölçülmedi';
                let w = 0;
                let barColor = 'var(--teal)';
                if (cat.max > 0) {
                    w = Math.max(0, Math.min(100, Math.round((cat.earned / cat.max) * 100)));
                    pctStr = w + '%';
                    if (w >= 80) barColor = 'var(--green)';
                    else if (w >= 50) barColor = 'var(--amber)';
                    else if (w > 0) barColor = 'var(--red)';
                    else barColor = 'var(--line-soft)';
                }
                const c = el('div', `score-cat k${i+1}`);
                c.innerHTML = `<div class="nm" title="${SCORE_CATEGORIES[k].desc}"><span class="sc-label">${SCORE_CATEGORIES[k].label}</span><span class="sc-val" style="color:${w >= 80 ? 'var(--green)' : (w >= 50 ? 'var(--amber)' : (w > 0 ? '#ffb8a6' : '#8fa2b6'))}">${pctStr}</span></div><div class="br"><i style="width:${w}%; background:${barColor}; transition: width 0.4s ease, background-color 0.4s ease;"></i></div>`;
                bar.appendChild(c); 
            }); 
        }

        /* ===================== AI ===================== */
        function toggleAI() { 
            App.aiMode = !App.aiMode;
            toast('info', App.aiMode ? '✨ AI Hasta: AÇIK' : 'AI Hasta: KAPALI', App.aiMode ? 'Diyaloglar ve analizler artık Gemini LLM tarafından üretilecek.' : 'Kural tabanlı mock yanıtlar gösterilecek.');
            renderTopbar();
            renderDialogue(); 
            renderLeftPanel();
            renderRightPanel();
        }

        /* ===================== NAVIGATION ===================== */
        function goHome() { 
            disposeThree(); 
            stopTimer(); // Ana sayfaya dönünce timer dursun
            showScreen('home-screen'); 
        }
        function restartCase() { if (!App.currentPatient) return goHome(); selectPatient(App.currentPatient.id); }
        function openMethodology() { showScreen('method-screen'); renderMethodology(); }

        function renderMethodology() { 
            const acc = $('#method-acc');
            acc.innerHTML = '';
            ['Öğrenme Hedefleri', 'Vaka Temelli Öğrenme', 'Klinik Akıl Yürütme', 'Hemşirelik Tanıları', 'Kanıta Dayalı İçerik', 'Yapay Zekâ Katmanı', 'Sınırlılık'].forEach((h, i) => { 
                const bodyTexts = [
                    'Her vakada cerrahi hemşireliği bakım pratiklerine yönelik ölçülebilir öğrenme hedefleri tanımlanmıştır.',
                    'Öğrenci aynı hastayı preoperatif, intraoperatif ve postoperatif fazlar boyunca takip eder.',
                    'Öğrenciye yalnızca ne yaptığı değil; neyi, niçin yaptığı ve hangi riski önlemeye çalıştığı sorulur.',
                    'Olası hemşirelik tanıları, aktif faz ve hastanın risk profiline göre yapılandırılmış kartlar olarak sunulur.',
                    'Eğitimsel açıklamalar; küresel cerrahi güvenliği, enfeksiyon önleme, hipotermi önleme, basınç yaralanması önleme, deliryum bakımı ve erken iyileşme ilkeleriyle uyumludur.',
                    'DeepSeek Simülasyon Modu, diyalog ve eğitimsel açıklama dilini zenginleştirebilir; ancak puanlama, güvenlik uyarıları, tanı doğruluğu ve faz ilerlemesi kural tabanlı kalır.',
                    'Bu içerik eğitim amaçlıdır. Gerçek klinik kararların, kurum protokollerinin veya hekim istemlerinin yerine geçmez.'
                ];
                const it = el('div', 'acc-item');
                it.innerHTML = `<div class="acc-h"><span>${h}</span><span class="arr">›</span></div><div class="acc-b">${bodyTexts[i]}</div>`;
                it.querySelector('.acc-h').onclick = () => it.classList.toggle('open');
                acc.appendChild(it); 
            });
            const tbl = $('#guide-tbl-body');
            tbl.innerHTML = '';
            Object.keys(GUIDELINE_THEMES).forEach(k => { 
                const g = GUIDELINE_THEMES[k];
                const items = { 
                    who_ssc: ['Kimlik doğrulama', 'Time-out', 'Sign-out', 'Ekip içi iletişim'],
                    who_ssi: ['Steril alan', 'Antibiyotik profilaksisi', 'Postop yara izlemi'],
                    nice_hypo: ['Preop sıcaklık', 'Aktif ısıtma', 'Postop sıcaklık izlemi'],
                    eras: ['Preop eğitim', 'Multimodal analjezi', 'Erken mobilizasyon'],
                    npiap: ['Basınç risk değerlendirmesi', 'Pozisyonlama', 'Basınç noktalarının korunması'],
                    padis: ['Ağrı değerlendirmesi', 'Deliryum riski', 'Sedasyon ve bilinç'],
                    aorn: ['Steril alan', 'Sayım güvenliği', 'Cerrahi ekip iletişimi'],
                    nanda: ['Olası hemşirelik tanıları', 'İlişkili faktörler', 'Beklenen sonuçlar']
                } [k] || [];
                const tr = el('tr');
                tr.innerHTML = `<td class="tg"><span class="gline-tag">${g.tag}</span><div style="margin-top:4px;font-size:11px;color:var(--ink-mute)">${g.name}</div></td><td>${items.map(x=>'· '+x).join('<br>')}</td>`;
                tbl.appendChild(tr); 
            }); 

            // ========== OSCE-PHDYÖ — 17 başlıklı akademik yöntem ==========
            const osceAcc = $('#osce-method-acc');
            if (osceAcc) {
                osceAcc.innerHTML = '';
                const sections = [
                    ['1. Kontrol Listesinin Amacı', 'GCKL; perioperatif hemşirelik öğrencilerinin Güvenli Cerrahi Kontrol Listesi fazlarıyla (Hasta Odası / Sign-In, Time-Out, Sign-Out, Taburculuk) uyumlu klinik becerileri vaka içinde öğrenmesini ve kendi eksiklerini görmesini desteklemek için yapılandırılmıştır. Bu sürüm yalnızca formatif Eğitim Modu olarak tasarlanmıştır.'],
                    ['2. Kavramsal Çerçeve', 'Kontrol listesi; (i) Dünya Sağlık Örgütü Güvenli Cerrahi Kontrol Listesi, (ii) AORN perioperatif standartları, (iii) NICE hipotermi önleme, (iv) ERAS protokolü, (v) NPIAP basınç yarası önleme ve (vi) NANDA-I hemşirelik tanıları çerçevelerine dayanır.'],
                    ['3. Kontrol Listesi Yapısı', '<b>30 madde</b> — 4 faz: <b>Bölüm I · Hasta Odasında / Sign-In</b> (8 madde), <b>Bölüm II · Time-Out / Cilt Kesisi Öncesi</b> (8 madde), <b>Bölüm III · Sign-Out / Cilt Kapatma Öncesi</b> (7 madde), <b>Bölüm IV · Taburculuk / Postoperatif</b> (7 madde). Her madde <b>Kod 0 / Kod 1 / Kod 2</b> üzerinden değerlendirilir: <b>0</b> = uygulanmadı/eksik, <b>1</b> = kısmen uygulandı, <b>2</b> = tam uygulandı.'],
                    ['4. Madde Geliştirme', 'Maddeler; sistematik literatür taraması ve perioperatif uzman panelinin (n≥7) çoklu Delphi turu ile içerik geçerliliği indeksi (CVI) ≥0,80 eşiği üzerinden onaylanmış davranış göstergelerine dayalı olarak yazılmıştır.'],
                    ['5. Kritik Hata ve Tavan Puan Mantığı', 'Hasta güvenliğini doğrudan tehdit eden kritik hata kodları (bileklik/kimlik atlama, onam atlama, Time-Out atlama, sayım uyuşmazlığı görmezden gelme, ABX zamanlaması atlama, vb.) maddelere gömülmüştür. Bir veya daha fazla kritik hata aktifse <b>tavan puan</b> uygulanır; birden fazla aktif tavan varsa <b>en düşük</b> tavan kullanılır. Ham toplam tavanı aşamaz.'],
                    ['6. Çoktan Seçmeli Gerekçe Soruları (ÇS)', '<b>19 ÇS</b> sorudan oluşan gerekçe bankası 4 boyutu ölçer: <b>(A) Anatomik / Fizyolojik Gerekçe</b> (4 soru), <b>(B) Risk / Komplikasyon Önleme Gerekçesi</b> (5 soru), <b>(C) Hata Tanıma & Acil Eylem Gerekçesi</b> (5 soru), <b>(D) İletişim & Belgeleme Gerekçesi</b> (5 soru). Her soru bağlı olduğu kontrol listesi maddesinin tam puana erişebilmesi için gereken kanıttır; bonus değildir. Davranış doğru + gerekçe doğru ⇒ Kod 2; davranış doğru ama gerekçe yanlış/yapılmadı ⇒ Kod 1; davranış yapılmadı ⇒ Kod 0.'],
                    ['7. Eğitim Modu Kuralları', 'Öğrenciye anlık geri bildirim, gerekçelendirme istemi ve isteğe bağlı yapay zekâ klinik danışmanı sunulur. Yapay zekâ yalnızca eğitsel açıklama / hasta diyaloğu / debriefing için kullanılır; öğrenme puanını tek başına üretmez.'],
                    ['8. Eğitici İzlem ve Öğrenme Kaydı', 'Sistem her öğrenci aksiyonunu ve GCKL maddelerine karşılık gelen öğrenme kanıtlarını kaydeder. Kayıtlar notlandırma amacıyla değil, öğrencinin hangi güvenli cerrahi adımlarında eksik kaldığını göstermek için kullanılır.'],
                    ['9. Otomatik Kod Köprüleri', 'Öğrenci aksiyonu (görev tamamlama, semptom seçimi, tanı seçimi, ÇS gerekçe yanıtı, sayım girişi) ilgili maddeye <b>kural tabanlı otomatik Kod 0/1/2</b> üretir. Davranış doğru + gerekçe doğru ⇒ Kod 2; davranış doğru ama gerekçe yanlış/eksik ⇒ Kod 1; davranış yapılmadı ⇒ Kod 0. Kodlar öğrenme geri bildirimi için kullanılır.'],
                    ['10. Sayım Güvenliği Panosu', 'Bölüm III maddelerinden sayım güvenliği için ayrı bir <b>sayısal doğrulama panosu</b> kullanılır: başlangıç sayımı (kompres, ped, iğne, alet) + intraoperatif eklenen + son raporlanan; sistem <b>beklenen son sayım</b>ı hesaplar ve farkı anlık olarak işaretler. Sayım uyuşmazlığını görmezden gelmek kritik hatadır.'],
                    ['11. Aksiyon Sırası Kaydı', 'Tüm öğrenci aksiyonları zaman damgalı sıralı kayıtla saklanır (caseStart, task, symptom, diagnosis, ÇS-yanıt, gckl-kod, gckl-critical, sayim-girisi). Kayıt; süreç madenciliği ve klinik karar sırası analizleri için JSON dışa aktarımına dahil edilir.'],
                    ['12. Geçerlik Kanıtı (İlk Aşama)', 'Bu aşamada vurgu; (i) uzman görüşü ve içerik geçerliliği indeksleri (I-CVI, S-CVI), (ii) madde anlaşılabilirliği, (iii) pilot uygulama, (iv) tavan/taban etkisi analizleri üzerindedir. Yeterli örneklem ve uygun veri yapısı sağlanırsa <b>ileri aşamada</b> iç yapı kanıtı için faktör analitik yaklaşımlar (örn. CFA) değerlendirilebilir; bu zorunlu bir başlangıç koşulu değildir.'],
                    ['13. Güvenirlik Kanıtı', 'İlk aşamada öncelik; madde anlaşılabilirliği, test–tekrar test, iç tutarlık ve öğretici doğrulaması üzerinden öğrenme aracının tutarlılığını incelemektir. Pilot örneklem büyüdükçe kanıt çerçevesi genişletilir.'],
                    ['14. Veri Yönetimi ve Etik', 'Bilgilendirilmiş onam zorunludur; tüm veriler katılımcı kodu ile anonimleştirilir. JSON ve CSV çıktıları yalnızca onam alınmış katılımcılar için akademik amaçla saklanmalıdır. API anahtarı yalnızca oturumda (sessionStorage) tutulur, kalıcı saklanmaz.'],
                    ['15. Sınırlılıklar', 'Bu kontrol listesi eğitim ve araştırma amaçlıdır; resmi akreditasyon veya yetkilendirme aracı değildir. Yapay zekâ destekli geri bildirimler yalnızca eğitsel açıklamalardır; akademik GCKL kodlamasının kaynağı <b>değildir</b> ve klinik karar / hekim istemi yerine geçmez. Yorum yapılırken kurum protokolleri ve yerel yönergelere uygunluk öğretici tarafından sağlanmalıdır.']
                ];
                sections.forEach(([h, body]) => {
                    const it = el('div', 'acc-item');
                    it.innerHTML = `<div class="acc-h"><span>${h}</span><span class="arr">›</span></div><div class="acc-b">${body}</div>`;
                    it.querySelector('.acc-h').onclick = () => it.classList.toggle('open');
                    osceAcc.appendChild(it);
                });
            }
        }

        /* ===================== REPORT ===================== */
        function showReport() { 
            disposeThree();
            stopTimer(); // Timer'ı durdur
            showScreen('report-screen');
            renderReport(); 
        }

        // CSV Export Fonksiyonu (10 Kategori Puanlamasına Geri Dönüldü)
        function exportResearchCSV() {
            const p = App.currentPatient;
            const total = computeTotalScore();
            
            const data = {
                ogrenci_id: 'ANON_' + Date.now(),
                vaka_id: p.id,
                cerrahi: p.surgery,
                mod: App.mode,
                toplam_sure_sn: App.totalSeconds,
                preop_sure_sn: App.phaseSeconds.preop,
                intraop_sure_sn: App.phaseSeconds.intraop,
                postop_sure_sn: App.phaseSeconds.postop,
                genel_basari_yuzde: total.percent,
                toplam_puan: total.points,
                maks_puan: total.max
            };

            // 10 Kategori Puanlarını Ekle
            Object.keys(SCORE_CATEGORIES).forEach(k => {
                data[k + '_puan'] = App.scores[k] && App.scores[k].max > 0 ? Math.round((App.scores[k].earned / App.scores[k].max) * 100) : 0;
            });

            data.kritik_hata_sayisi = ['preop','intraop','postop'].reduce((acc, ph) => {
                if(!p[ph] || !p[ph].tasks) return acc;
                return acc + p[ph].tasks.filter(t => t.critical && !App.completedTasks.includes(t.id)).length;
            }, 0);
            
            data.dogru_gerekce = Object.values(App.reasoningAnswered).filter(r => r.correct).length;
            data.toplam_gerekce = Object.keys(App.reasoningAnswered).length;
            
            const header = Object.keys(data).join(',');
            const row = Object.values(data).join(',');
            const csv = header + '\n' + row;
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nursekit_veri_${Date.now()}.csv`;
            a.click();
        }

        /* ============================================================
           OSCE-PHDYÖ — Rapor render + JSON/CSV export
           ============================================================ */
        /* ============================================================
           OSCE-PHDYÖ — Madde Bazlı Ölçek Kodlama Raporu
           ============================================================ */
        function getRequiredEvidenceForItem(itemId) {
            const b = OSCE_EVIDENCE_BRIDGES[itemId];
            if (!b) return [];
            const list = [];
            (b.requiredTaskTags || []).forEach(t => list.push({ kind: 'task', tag: t }));
            if (b.rationaleRequired) list.push({ kind: 'rationale' });
            return list;
        }

        function getCompletedEvidenceForItem(itemId) {
            const b = OSCE_EVIDENCE_BRIDGES[itemId];
            const rec = App.osce && App.osce.items[itemId];
            if (!b || !rec) return [];
            const completed = (App.completedTasks || []);
            const phasePatient = App.currentPatient;
            const list = [];
            (b.requiredTaskTags || []).forEach(tag => {
                const ids = osceResolveTaskIds(tag, phasePatient);
                const hit = ids.find(tid => completed.includes(tid));
                if (hit) list.push({ kind: 'task', tag, taskId: hit });
            });
            if (b.rationaleRequired && rec.rationaleOk) list.push({ kind: 'rationale' });
            // Semptom/tanı destekli kanıt say
            (rec.evidence || []).forEach(e => {
                if (typeof e === 'string' && (e.indexOf('symptom:') === 0 || e.indexOf('diagnosis:') === 0)) {
                    list.push({ kind: e.split(':')[0], detail: e });
                }
            });
            return list;
        }

        function deriveOSCEPerformanceCode(itemId) {
            const item = osceGetItem(itemId);
            const bridge = OSCE_EVIDENCE_BRIDGES[itemId];
            const rec = App.osce && App.osce.items[itemId];
            const required = getRequiredEvidenceForItem(itemId);
            const completed = getCompletedEvidenceForItem(itemId);
            const requiredCount = required.length;
            const completedCount = completed.length;

            const isCritical = !!(item.criticalKey && App.osce.criticalErrors[item.criticalKey]);

            if (isCritical) {
                return { code: 0, label: 'Yetersiz',
                    explanation: 'Kritik davranış yapılmadı veya kritik hata oluştu.',
                    requiredCount, completedCount };
            }
            if (completedCount === 0 && requiredCount > 0) {
                return { code: 0, label: 'Yetersiz',
                    explanation: 'Maddeyle ilişkili hiçbir görev veya kanıt tamamlanmadı.',
                    requiredCount, completedCount };
            }
            if (requiredCount > 0 && completedCount < requiredCount) {
                return { code: 1, label: 'Kısmi yeterli',
                    explanation: 'Maddeyle ilişkili en az bir görev/kanıt tamamlandı; ancak tüm gereklilikler tamamlanmadı.',
                    requiredCount, completedCount };
            }
            if (bridge && bridge.rationaleRequired && !rec.rationaleOk) {
                return { code: 1, label: 'Kısmi yeterli',
                    explanation: 'Davranış kanıtları tamamlandı; ancak gerekçelendirme yeterli değil.',
                    requiredCount, completedCount };
            }
            if (rec.timingStatus === 'late' || (rec.negativeEvidence||[]).length > 0) {
                return { code: 1, label: 'Kısmi yeterli',
                    explanation: 'Davranış yapıldı ancak zamanlama/negatif kanıt sebebiyle tam yeterli değil.',
                    requiredCount, completedCount };
            }
            if (requiredCount === 0 && completedCount === 0) {
                return { code: 0, label: 'Yetersiz',
                    explanation: 'Otomatik kanıt yok; observer değerlendirmesi gerekir.',
                    requiredCount, completedCount, requiresObserver: true };
            }
            return { code: 2, label: 'Tam yeterli',
                explanation: 'Maddeyle ilişkili tüm görevler/kanıtlar tamamlandı ve gerekçe yeterli.',
                requiredCount, completedCount };
        }

        function osceCodeColor(c) {
            return c === 2 ? 'var(--teal)' : c === 1 ? 'var(--amber)' : 'var(--red)';
        }

        function renderOSCEItemsReport() {
            if (__osceDeprecatedGuard("renderOSCEItemsReport")) return;
            const box = $('#rd-osce-items');
            if (!box) return;
            const phaseTitles = {
                preop:   'PREOPERATİF / SIGN IN',
                intraop: 'İNTRAOPERATİF / TIME OUT',
                postop:  'POSTOPERATİF / SIGN OUT + PACU'
            };
            const codeOf = (itemId) => {
                const rec = App.osce && App.osce.items && App.osce.items[itemId];
                if (rec && (rec.performanceCode === 0 || rec.performanceCode === 1 || rec.performanceCode === 2)) {
                    return rec.performanceCode;
                }
                try {
                    const ev = deriveOSCEPerformanceCode(itemId);
                    if (ev && (ev.code === 0 || ev.code === 1 || ev.code === 2)) return ev.code;
                } catch(e) {}
                // Fallback: kanıt durumu
                const evList = (rec && rec.evidence) || [];
                const miss   = (rec && rec.missingEvidence) || [];
                if (evList.length === 0) return 0;
                if (miss.length > 0) return 1;
                return 2;
            };
            const codeColor = (c) => c === 2 ? 'var(--teal)' : c === 1 ? 'var(--amber)' : 'var(--red)';

            let html = `<div style="margin-top:18px"><div style="font-size:14px;font-weight:700;color:var(--violet);letter-spacing:.5px;text-transform:uppercase;border-bottom:1px solid var(--teal-3);padding-bottom:6px;margin-bottom:10px">OSCE Maddeleri</div>`;

            ['preop','intraop','postop'].forEach(ph => {
                const items = osceItemsByPhase(ph);
                html += `<div style="margin-top:12px"><div style="font-size:12px;font-weight:700;color:var(--ink-2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">${phaseTitles[ph]}</div>`;
                items.forEach(it => {
                    const c = codeOf(it.id);
                    html += `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:6px 10px;border-bottom:1px solid rgba(95,180,180,0.18);font-size:12.5px;line-height:1.5">
                        <div style="flex:1"><b style="font-family:ui-monospace,monospace;color:var(--violet)">${it.id}.</b> ${it.title}</div>
                        <div style="white-space:nowrap;color:${codeColor(c)};font-weight:700">— Kod: ${c}</div>
                    </div>`;
                });
                html += `</div>`;
            });
            html += `<div style="margin-top:10px;font-size:11px;color:var(--ink-3);background:var(--navy-2);border:1px dashed var(--teal-3);border-radius:4px;padding:6px 10px;line-height:1.5">
                <b>Kodlama mantığı:</b> Kod 0 = maddeye ilişkin hiçbir görev/kanıt yapılmadı veya kritik hata var · Kod 1 = en az bir görev/kanıt yapıldı, tüm gereklilikler tamamlanmadı · Kod 2 = tüm gerekli görevler/kanıtlar tamamlandı.
            </div></div>`;
            box.innerHTML = html;
        }

        function _orphanRemoved_() {
            // (eski fonksiyon kalıntıları temizlendi — renderOSCEItemsReport tek kaynaktır)
            const counts = { preop:{0:0,1:0,2:0}, intraop:{0:0,1:0,2:0}, postop:{0:0,1:0,2:0} };
            const phaseTitles = { preop:'Pre-op', intraop:'Intra-op', postop:'Post-op' };
            void counts; void phaseTitles;
            return;
            // unreachable orphan (kept commented to preserve diff anchors)
            /*
            ['preop','intraop','postop'].forEach(ph => {
                const items = osceItemsByPhase(ph);
                items.forEach(it => {
                    const rec = App.osce.items[it.id];
                    const ev = deriveOSCEPerformanceCode(it.id);
                    counts[ph][ev.code]++;
                    const isCrit = it.criticalKey && App.osce.criticalErrors[it.criticalKey];
                    const sysScore = (rec.system === null) ? (rec.observer1 !== null ? rec.observer1 : (rec.observer2 !== null ? rec.observer2 : 0)) : rec.system;
                    const ratStatus = (rec.rationaleOk ? 'Yeterli' : (rec.rationale ? 'Kısmen yeterli' : (OSCE_EVIDENCE_BRIDGES[it.id] && OSCE_EVIDENCE_BRIDGES[it.id].rationaleRequired ? 'Yok' : 'Gerekli değil')));
                    const teacher = rec.requiresObserver
                        ? 'Otomatik kanıt yok; observer değerlendirmesi gerekir.'
                        : (ev.code === 2
                            ? `Öğrenci, ${it.title.toLowerCase()} maddesinin tüm gereklerini yerine getirdi; gerekçelendirme yeterli, kritik hata yok.`
                            : ev.code === 1
                            ? `Öğrenci ${it.title.toLowerCase()} maddesinde en az bir gereklilik yerine getirdi; ${ev.explanation.toLowerCase()}`
                            : (isCrit
                                ? `Öğrenci ${it.title.toLowerCase()} maddesinde kritik hata yaptı veya kritik davranışı yerine getirmedi.`
                                : `Bu maddeye ilişkin görev veya kanıt bulunmadığı için madde yetersiz olarak kodlandı.`)
                          );

                    html += `<div style="background:var(--navy-2);border:1px solid var(--teal-3);border-left:4px solid ${osceCodeColor(ev.code)};border-radius:6px;padding:10px 12px;margin-bottom:8px">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
                            <div style="flex:1;min-width:280px">
                                <div style="font-family:ui-monospace,monospace;font-size:11px;color:var(--violet);font-weight:700">${it.id} · ${ph.toUpperCase()}</div>
                                <div style="font-size:14px;font-weight:600;color:var(--ink);margin-top:2px">${it.title}</div>
                                <div style="font-size:12px;color:var(--ink-2);margin-top:4px;line-height:1.5">${it.criterion || ''}</div>
                            </div>
                            <div style="text-align:right;min-width:140px">
                                <div style="font-size:11px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.4px">Kod</div>
                                <div style="font-size:22px;font-weight:800;color:${osceCodeColor(ev.code)};line-height:1">${ev.code}</div>
                                <div style="font-size:11px;color:${osceCodeColor(ev.code)};font-weight:600;margin-top:2px">${ev.label}</div>
                                <div style="font-size:11px;color:var(--ink-2);margin-top:6px">Sistem puanı: <b>${sysScore}/${it.max}</b></div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:6px;margin-top:8px;font-size:11px">
                            <div><span style="color:var(--ink-3)">İlgili kanıt:</span> <b>${ev.requiredCount} görev</b></div>
                            <div><span style="color:var(--ink-3)">Tamamlanan:</span> <b>${ev.completedCount}/${ev.requiredCount || '—'}</b></div>
                            <div><span style="color:var(--ink-3)">Eksik:</span> <b>${Math.max(0, ev.requiredCount - ev.completedCount)}</b></div>
                            <div><span style="color:var(--ink-3)">Gerekçe:</span> <b>${ratStatus}</b></div>
                            <div><span style="color:var(--ink-3)">Kritik:</span> <b style="color:${isCrit?'var(--red)':'var(--ink)'}">${isCrit?'⚠ '+it.criticalKey:'Yok'}</b></div>
                            <div><span style="color:var(--ink-3)">Zamanlama:</span> <b>${rec.timingStatus || 'n/a'}</b></div>
                        </div>
                        <div style="margin-top:8px;padding:8px 10px;background:rgba(95,180,180,0.06);border-radius:4px;font-size:11px;color:var(--ink-2);line-height:1.5">
                            <b style="color:var(--teal)">Kod açıklaması:</b> ${ev.explanation}<br>
                            <b style="color:var(--violet)">Öğretmen yorumu:</b> ${teacher}
                        </div>
                    </div>`;
                });
                // Faz özeti
                html += `<div style="margin-top:6px;font-size:11px;color:var(--ink-2);background:var(--navy-2);border:1px dashed var(--teal-3);border-radius:4px;padding:6px 10px">
                    <b>${ph.toUpperCase()} Kod Dağılımı:</b>
                    <span style="color:var(--red)">Kod 0: ${counts[ph][0]}</span> ·
                    <span style="color:var(--amber)">Kod 1: ${counts[ph][1]}</span> ·
                    <span style="color:var(--teal)">Kod 2: ${counts[ph][2]}</span>
                </div></div>`;
            });
            const total = { 0: counts.preop[0]+counts.intraop[0]+counts.postop[0],
                            1: counts.preop[1]+counts.intraop[1]+counts.postop[1],
                            2: counts.preop[2]+counts.intraop[2]+counts.postop[2] };
            html += `<div style="margin-top:10px;font-size:12px;background:rgba(120,90,180,0.10);border:1px solid var(--violet);border-radius:6px;padding:8px 12px">
                <b>Genel Kod Dağılımı (37 madde):</b>
                <span style="color:var(--red)">Kod 0: ${total[0]}</span> ·
                <span style="color:var(--amber)">Kod 1: ${total[1]}</span> ·
                <span style="color:var(--teal)">Kod 2: ${total[2]}</span>
            </div>`;
            box.innerHTML = html;
            */
        }

        function renderOSCEPHDYOReport() {
            if (__osceDeprecatedGuard("renderOSCEPHDYOReport")) return;
            calculateFinalOSCEPHDYOScore();
            const s = App.osce;
            const cap = s.appliedCap;

            // Summary kartları
            const summary = $('#rd-osce-summary'); if (!summary) return;
            summary.innerHTML = `
                <div class="osce-score-grid">
                    <div class="osce-score-card"><div class="v">${s.phaseScores.preop.earned}<span style="font-size:13px;color:var(--ink-3)"> / ${s.phaseScores.preop.max}</span></div><div class="l">Pre-op</div></div>
                    <div class="osce-score-card"><div class="v">${s.phaseScores.intraop.earned}<span style="font-size:13px;color:var(--ink-3)"> / ${s.phaseScores.intraop.max}</span></div><div class="l">Intra-op</div></div>
                    <div class="osce-score-card"><div class="v">${s.phaseScores.postop.earned}<span style="font-size:13px;color:var(--ink-3)"> / ${s.phaseScores.postop.max}</span></div><div class="l">Post-op</div></div>
                    <div class="osce-score-card ${cap?'cap':''}"><div class="v">${s.finalTotal}<span style="font-size:13px;color:var(--ink-3)"> / 100</span></div><div class="l">${cap?'Tavanlı Toplam':'Toplam'}</div></div>
                </div>
                ${cap ? `<div style="background:rgba(220,90,90,0.12); border:1px solid #c06060; border-radius:6px; padding:10px 12px; font-size:12px; color:#c84a55"><b>Kritik hata tavanı uygulandı:</b> ${cap.key} (≤${cap.cap}). Ham toplam ${s.rawTotal} → final ${s.finalTotal}.</div>` : ''}
                <div style="font-size:11px;color:#5b7896;margin-top:8px">Çalışma: ${App.studyMeta.studentId || '—'} · Grup: ${App.studyMeta.group} · Zaman: ${App.studyMeta.timePoint} · Mod: ${App.mode==='tutor'?'Eğitim':'Değerlendirme'}</div>
            `;

            // Güvenli Cerrahi compliance pills
            const compl = $('#rd-osce-compliance');
            const complianceMap = [
                { key: 'identityMissed', label: 'Kimlik' },
                { key: 'surgeryVerificationMissed', label: 'İşlem Teyidi' },
                { key: 'siteVerificationMissed', label: 'Bölge İşaretleme' },
                { key: 'consentMissed', label: 'Onam' },
                { key: 'allergyMissed', label: 'Alerji' },
                { key: 'npoMissed', label: 'NPO' },
                { key: 'timeOutMissed', label: 'Time-Out' },
                { key: 'antibioticCheckMissed', label: 'Profilaksi' },
                { key: 'countMissed', label: 'Sayım' },
                { key: 'signOutMissed', label: 'Sign-Out' },
                { key: 'pacuHandoverMissed', label: 'PACU Teslim' }
            ];
            compl.innerHTML = `
                <div style="font-size:12px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Güvenli Cerrahi · Kontrol Listesi Uyumu</div>
                <div class="compliance-strip">
                    ${complianceMap.map(c => {
                        const missed = !!s.criticalErrors[c.key];
                        return `<span class="compliance-pill ${missed?'miss':'ok'}">${missed?'✗':'✓'} ${c.label}</span>`;
                    }).join('')}
                </div>
            `;

            // Madde Bazlı Ölçek Kodlama Raporu (faz bazlı, tam metin + kod)
            renderOSCEItemsReport();

            // Rationale yanıtları (varsa)
            const ratBox = $('#rd-osce-rationales');
            const rqs = Object.values(s.rqAnswers || {});
            if (rqs.length === 0) {
                ratBox.innerHTML = '<div style="margin-top:10px;font-size:12px;color:var(--ink-3)">Gerekçelendirme yanıtı kaydedilmedi.</div>';
            } else {
                let h = '<div style="margin-top:14px"><div style="font-size:12px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Gerekçelendirme Yanıtları</div>';
                rqs.forEach(r => {
                    const it = osceGetItem(r.itemId);
                    h += `<div style="background:var(--navy-2);border:1px solid var(--teal-3);border-radius:6px;padding:10px;margin-bottom:6px">
                        <div style="font-size:11px;color:var(--violet);font-family:ui-monospace,monospace">${r.itemId} · ${it.rq.id}</div>
                        <div style="font-size:13px;margin-top:2px"><i>${it.rq.q}</i></div>
                        <div style="font-size:13px;margin-top:6px;color:var(--ink)">${r.text}</div>
                        <div style="font-size:11px;margin-top:6px;color:var(--teal)">gerekçe puanı: ${r.score} (${r.rationaleOk?'tam puan eşiği karşılandı':'kısmi'}) · ${(r.keywords||[]).map(k=>`<span class="kw">${k}</span>`).join(' ')||'(anahtar yakalanmadı)'}</div>
                    </div>`;
                });
                h += '</div>';
                ratBox.innerHTML = h;
            }

            // Aksiyon sıralaması (sequence) — gizli, JSON export'a girer
            const seqBox = $('#rd-osce-sequence');
            seqBox.innerHTML = `<pre style="font-size:10px;color:var(--ink-3);max-height:200px;overflow:auto">${App.actionSequence.length} aksiyon kaydedildi</pre>`;
        }

        function osceBuildPayload() {
            calculateFinalOSCEPHDYOScore();
            const p = App.currentPatient;
            return {
                meta: {
                    schemaVersion: 'OSCE-PHDYO-1.3',
                    exportedAt: new Date().toISOString(),
                    caseId: p.id,
                    caseName: p.name,
                    surgery: p.surgery,
                    mode: App.mode,
                    role: App.role,
                    studentId: App.studyMeta.studentId,
                    group: App.studyMeta.group,
                    timePoint: App.studyMeta.timePoint,
                    site: App.studyMeta.site,
                    consent: App.studyMeta.consent,
                    startedAt: App.studyMeta.startedAt ? new Date(App.studyMeta.startedAt).toISOString() : null,
                    completedAt: App.studyMeta.completedAt ? new Date(App.studyMeta.completedAt).toISOString() : null,
                    durationSec: App.totalSeconds,
                    phaseDurations: App.phaseSeconds,
                    activeObserver: App.osce.activeObserver
                },
                exercise: {
                    scores: App.scores,
                    phaseScores: App.phaseScores,
                    completedTasks: App.completedTasks,
                    reasoning: App.reasoningAnswered
                },
                osce: {
                    items: App.osce.items,
                    criticalErrors: App.osce.criticalErrors,
                    phaseScores: App.osce.phaseScores,
                    rawTotal: App.osce.rawTotal,
                    finalTotal: App.osce.finalTotal,
                    appliedCap: App.osce.appliedCap,
                    rqAnswers: App.osce.rqAnswers,
                    observerNotes: App.osce.observerNotes,
                    irrelevantDiagnoses: App.osce.irrelevantDiagnoses || { preop: [], intraop: [], postop: [] },
                    sourceNote: 'Akademik OSCE-PHDYÖ puanı yalnızca system + observer1/observer2 kaynaklarından oluşur. AI geri bildirimi yalnızca eğitseldir; akademik puana girmez.'
                },
                aiEducationalFeedback: {
                    note: 'Bu blok yalnızca eğitsel amaçlıdır; akademik OSCE-PHDYÖ puanına dahil edilmez.',
                    items: App.osce.geminiFeedback || {}
                },
                feedback: App.feedbackEntries,
                sequence: App.actionSequence
            };
        }

        function osceFilenameStem() {
            const p = App.currentPatient;
            const sid = (App.studyMeta.studentId || 'anon').replace(/[^a-z0-9_-]/gi,'_');
            const d = new Date();
            const ts = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;
            return `nursekit_${p.id}_${sid}_${ts}`;
        }

        function downloadBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click();
            setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
        }

        function exportOSCEJSON() {
            const payload = osceBuildPayload();
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
            downloadBlob(blob, osceFilenameStem() + '.json');
            toast('success', 'JSON İndirildi', 'OSCE-PHDYÖ veri seti hazır.');
        }

        function exportOSCECSV() {
            const payload = osceBuildPayload();
            // Madde başına satır + kritik hata özeti + meta
            const lines = [];
            const meta = payload.meta;
            // Header
            lines.push(['caseId','caseName','surgery','mode','role','studentId','group','timePoint','site','consent','durationSec','itemId','phase','title','max','earned','academicSource','systemScore','observer1Score','observer2Score','aiHasFeedback','rationaleScore','rationaleOk','rationaleHits','criticalKey','criticalActive','rawTotal','finalTotal','appliedCap'].join(','));
            const csvEscape = (v) => {
                if (v === null || v === undefined) return '';
                const s = String(v).replace(/"/g, '""');
                return /[",\n]/.test(s) ? `"${s}"` : s;
            };
            OSCE_PHDYO.items.forEach(it => {
                const rec = payload.osce.items[it.id] || {};
                const r = rec.rationale || {};
                const critActive = it.criticalKey && payload.osce.criticalErrors[it.criticalKey] ? '1' : '0';
                const aiHas = (payload.aiEducationalFeedback.items && payload.aiEducationalFeedback.items[it.id]) ? '1' : '0';
                lines.push([
                    meta.caseId, meta.caseName, meta.surgery, meta.mode, meta.role,
                    meta.studentId, meta.group, meta.timePoint, meta.site, meta.consent,
                    meta.durationSec,
                    it.id, it.phase, it.title, it.max, rec.earned||0,
                    rec.source||'',
                    rec.system===null||rec.system===undefined?'':rec.system,
                    rec.observer1===null||rec.observer1===undefined?'':rec.observer1,
                    rec.observer2===null||rec.observer2===undefined?'':rec.observer2,
                    aiHas,
                    r.score||0, rec.rationaleOk?'1':'0', (r.keywords||[]).join('|'),
                    it.criticalKey||'', critActive,
                    payload.osce.rawTotal, payload.osce.finalTotal,
                    payload.osce.appliedCap ? payload.osce.appliedCap.key : ''
                ].map(csvEscape).join(','));
            });
            const csv = lines.join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            downloadBlob(blob, osceFilenameStem() + '_osce.csv');
            toast('success', 'CSV İndirildi', 'GCKL uyum tablosu hazır.');
        }


        function getCompletedTaskTextBank() {
            const p = App.currentPatient || {};
            const completed = new Set(App.completedTasks || []);
            const taskTexts = [];
            ['preop','intraop','postop'].forEach(ph => {
                (p[ph]?.tasks || []).forEach(t => {
                    if (completed.has(t.id)) taskTexts.push(`${ph} ${t.id} ${t.label}`);
                });
            });
            const feedbackTexts = (App.feedbackEntries || []).map(f => `${f.phase || ''} ${f.label || ''} ${typeof f.detail === 'string' ? f.detail : JSON.stringify(f.detail || '')}`);
            const decisionTexts = Object.keys(App.microDecisionResults || {}).filter(k => App.microDecisionResults[k]?.correct).map(k => `micro ${k}`);
            return (taskTexts.concat(feedbackTexts).concat(decisionTexts)).join(' | ').toLocaleLowerCase('tr-TR');
        }
        function getProfileReportBlueprint() {
            const profile = getPatientProfileKey();
            const data = {
                cabg: {
                    title:'CABG / Kardiyak Cerrahi Odaklı Rapor',
                    intro:'Bu rapor CABG hastasında erken güvenlik, kardiyak stabilite, solunum ve deliryum önleme davranışlarına göre üretilir.',
                    items:[
                        { title:'Sternum koruma eğitimi', keys:['sternum','mobilizasyon','walker','transfer','solunum'], why:'Sternotomi sonrası ağrı, öksürük ve mobilizasyon sternum koruma ilkeleriyle birlikte öğretilmelidir.' },
                        { title:'Göğüs tüpü / drenaj değerlendirmesi', keys:['dren','drain','göğüs tüp','kanama'], why:'Ani drenaj artışı, parlak kırmızı drenaj ve hemodinamik bozulma kanama/tamponad açısından kritik kabul edilir.' },
                        { title:'Deliryum riski ve oryantasyon', keys:['deliryum','oryantasyon','kognitif','bilinç'], why:'Kardiyak cerrahi, yaş, ağrı, yoğun bakım ortamı ve uyku bölünmesi deliryum riskini yükseltir.' },
                        { title:'Hipotermi / ısı yönetimi', keys:['hipotermi','ısıtma','temperature','ısı'], why:'CABG sonrası hipotermi koagülasyon, ritim ve iyileşme açısından güvenlik sorunudur.' },
                        { title:'Ağrı + solunum egzersizi bağlantısı', keys:['ağrı','pca','spirometre','solunum','öksürük'], why:'Ağrı kontrolü olmadan etkili öksürük, spirometre ve erken mobilizasyon beklenmez.' }
                    ]
                },
                ortho: {
                    title:'Ortopedi / Eksternal Fiksatör Odaklı Rapor',
                    intro:'Bu rapor travma/eksternal fiksatör hastasında ekstremite güvenliği, enfeksiyon, ağrı ve mobilizasyon davranışlarına göre üretilir.',
                    items:[
                        { title:'Nörovasküler takip', keys:['nörovasküler','kapiller','duyu','hareket','nabız','renk','ısı'], why:'Renk, ısı, duyu, hareket, kapiller dolum ve distal nabız ekstremite güvenliğinin temel göstergeleridir.' },
                        { title:'Pin bakımı ve enfeksiyon izlemi', keys:['pin','enfeksiyon','akıntı','pansuman','yara'], why:'Pin dibi kızarıklık, ısı artışı, kötü koku ve pürülan akıntı erken fark edilmelidir.' },
                        { title:'Kompartman sendromu riski', keys:['kompartman','ağrı','parestezi','analjezi'], why:'Analjeziye dirençli artan ağrı ve parestezi kompartman açısından kritik uyarıdır.' },
                        { title:'Mobilizasyon ve cihaz güvenliği', keys:['mobilizasyon','walker','düşme','fiksatör','transfer'], why:'Ağırlık verme durumu, cihaz stabilitesi ve düşme riski birlikte değerlendirilmelidir.' },
                        { title:'Hasta/aile eğitimi', keys:['taburculuk','eğitim','teach-back','pin'], why:'Evde pin bakımı, alarm bulguları ve kontrol randevusu teach-back ile doğrulanmalıdır.' }
                    ]
                },
                chole: {
                    title:'Laparoskopik Kolesistektomi Odaklı Rapor',
                    intro:'Bu rapor PONV, ERAS, yara bakımı, oral alım ve safra kaçağı alarm bulgularına göre üretilir.',
                    items:[
                        { title:'PONV / aspirasyon yönetimi', keys:['ponv','bulant','kusma','aspirasyon'], why:'Kontrolsüz bulantı-kusma aspirasyon, oral alım gecikmesi ve yara gerilimi açısından risklidir.' },
                        { title:'Omuz ağrısı ve ağrı ayrımı', keys:['omuz','ağrı','pca','analjezi'], why:'Laparoskopi sonrası omuz ağrısı sık olabilir; ancak şiddetli karın ağrısı alarm kabul edilmelidir.' },
                        { title:'Yara bakımı / enfeksiyon izlemi', keys:['yara','pansuman','enfeksiyon','ateş'], why:'Ateş, kızarıklık, akıntı ve artan karın ağrısı komplikasyon açısından izlenmelidir.' },
                        { title:'Beslenmeye geçiş ve ERAS', keys:['eras','beslen','oral','mobilizasyon'], why:'Oral alım ve mobilizasyon PONV, ağrı ve tolerans değerlendirmesiyle ilerletilmelidir.' },
                        { title:'Safra kaçağı alarm bulguları', keys:['safra','sarılık','dren','karın ağrısı'], why:'Safra benzeri drenaj, sarılık, ateş ve kötüleşen vital bulgular taburculuk hazırlığını durdurmalıdır.' }
                    ]
                },
                general: {
                    title:'Hasta Profiline Özgü Genel Rapor',
                    intro:'Bu rapor seçili vakada güvenlik, ağrı, solunum, mobilizasyon ve taburculuk davranışlarına göre üretilir.',
                    items:[
                        { title:'Hasta güvenliği doğrulamaları', keys:['kimlik','onam','time-out','güvenlik'], why:'Kimlik, onam, taraf/işlem ve ekip doğrulaması her cerrahi profil için çekirdek güvenlik davranışıdır.' },
                        { title:'Ağrı ve konfor yönetimi', keys:['ağrı','analjezi','pca'], why:'Ağrı değerlendirme ve yeniden değerlendirme klinik bakım döngüsünün merkezindedir.' },
                        { title:'Solunum ve dolaşım izlemi', keys:['solunum','monitör','spo','vital'], why:'Erken bozulma vital bulgular ve solunum davranışıyla yakalanır.' },
                        { title:'Mobilizasyon / düşme riski', keys:['mobilizasyon','düşme','walker'], why:'Mobilizasyon ağrı, vital bulgu, hat/dren ve yardım ihtiyacıyla birlikte planlanmalıdır.' },
                        { title:'Taburculuk eğitimi', keys:['taburculuk','teach-back','eğitim'], why:'Evde bakım adımları hasta ve aile tarafından geri anlatılmalıdır.' }
                    ]
                }
            };
            return data[profile] || data.general;
        }
        function evaluateProfileReportItem(item, bank) {
            const hits = (item.keys || []).filter(k => bank.includes(String(k).toLocaleLowerCase('tr-TR')));
            const cls = hits.length >= 2 ? 'ok' : (hits.length === 1 ? 'warn' : 'miss');
            const status = cls === 'ok' ? 'Tamamlandı' : (cls === 'warn' ? 'Kısmi' : 'Eksik');
            return { ...item, hits, cls, status };
        }
        function renderProfileSpecificReport() {
            const box = $('#rd-profile-report');
            if (!box) return;
            const bp = getProfileReportBlueprint();
            const bank = getCompletedTaskTextBank();
            const evaluated = bp.items.map(it => evaluateProfileReportItem(it, bank));
            const okCount = evaluated.filter(it => it.cls === 'ok').length;
            box.innerHTML = `<div style="font-size:12px;color:#5b6f86;line-height:1.5;margin-bottom:8px"><b>${bp.title}</b><br>${bp.intro}<br>Profil tamamlanma düzeyi: <b>${okCount}/${evaluated.length}</b></div><div class="profile-report-grid">${evaluated.map(it => `<div class="profile-report-item ${it.cls}"><div class="pri-head"><span>${it.title}</span><span class="pri-status">${it.status}</span></div><div class="pri-body">${it.why}</div><div class="pri-evidence">Kanıt: ${it.hits.length ? it.hits.join(', ') : 'Bu başlıkla ilişkili açık görev/karar kaydı bulunmadı.'}</div></div>`).join('')}</div>`;
        }

        function renderReport() { 
            const p = App.currentPatient;
            const total = computeTotalScore();
            const now = new Date();
            
            $('#rd-patient-meta').innerHTML = `
                <div>${p.name} · ${p.age}/${p.gender}</div>
                <div>${p.surgery}</div>
                <div>MRN: ${p.identity.mrn}</div>
                <div>${now.toLocaleDateString('tr-TR')} · Eğitim Modu</div>
                <div style="margin-top:8px; padding-top:8px; border-top:1px dashed #5b7896; color:#1c2a3d; font-weight:600;">⏱ Toplam Süre: ${formatTime(App.totalSeconds)}</div>
                <div style="font-size:11px; color:#5b7896;">Preop: ${formatTime(App.phaseSeconds.preop)} | İntraop: ${formatTime(App.phaseSeconds.intraop)} | Postop: ${formatTime(App.phaseSeconds.postop)}</div>
            `;
            
            // Genel Performans (Geri Getirildi)
            const totalEl = $('#rd-total');
            if (totalEl) {
                totalEl.innerHTML = `<span style="font-family:var(--font-display);font-size:36px;">${total.percent}%</span> <span style="font-family:var(--font-mono);color:#5b7896;font-size:13px;">${total.points} / ${total.max} puan</span>`;
            }

            // --- GCKL Uyum Kartları ---
            const osceBox = $('#rd-osce');
            if (osceBox) {
                osceBox.innerHTML = '';
                const phaseNames = { preop: 'İstasyon 1: Preoperatif', intraop: 'İstasyon 2: İntraoperatif', postop: 'İstasyon 3: Postop / PACU' };
                let phasesHtml = '';
                
                ['preop', 'intraop', 'postop'].forEach(ph => {
                    const pScore = App.phaseScores[ph];
                    if(!pScore || pScore.max === 0) return;
                    let w = Math.max(0, Math.min(100, Math.round((pScore.earned / pScore.max) * 100)));
                    let bColor = w >= 80 ? '#4cb88a' : (w >= 50 ? '#c98c2e' : '#c84a55');
                    phasesHtml += `
                    <div style="flex:1; min-width:200px; background:var(--panel); border:1px solid var(--line); border-radius:6px; padding:16px;">
                        <div style="font-size:12px; color:var(--ink-mute); text-transform:uppercase; margin-bottom:8px; font-weight:600;">${phaseNames[ph]}</div>
                        <div style="font-size:28px; font-family:var(--font-display); color:${bColor}; margin-bottom:10px;">${w}%</div>
                        <div class="rd-cat-bar" style="background:var(--navy-2); height:6px; margin:0; border-radius:3px; overflow:hidden;">
                            <i style="width:${w}%; background:${bColor}; display:block; height:100%;"></i>
                        </div>
                    </div>`;
                });
                osceBox.innerHTML = phasesHtml;
            }

            renderProfileSpecificReport();
            renderPhaseDebriefReportSummary();

            // 10 Orijinal Kategori Performansına Dönüş
            const cats = $('#rd-cats');
            if (cats) {
                cats.innerHTML = '';
                // Dinamik olarak başlığı düzelt
                if(cats.previousElementSibling && cats.previousElementSibling.tagName === 'H3') {
                    cats.previousElementSibling.textContent = '10 Kategori Performansı';
                }

                Object.keys(SCORE_CATEGORIES).forEach(k => { 
                    const cat = App.scores[k];
                    const max = cat.max;
                    let pctStr = "Bu vakada ölçülmedi";
                    let w = 0;
                    let barColor = '#d4ccb6';
                    if(max > 0) {
                        w = Math.max(0, Math.min(100, Math.round((cat.earned / max) * 100)));
                        pctStr = w + '%';
                        if (w >= 80) barColor = '#4cb88a'; // Green
                        else if (w >= 50) barColor = '#c98c2e'; // Amber
                        else if (w > 0) barColor = '#c84a55'; // Red
                    }
                    const row = el('div');
                    row.innerHTML = `<div class="rd-row"><span class="k" title="${SCORE_CATEGORIES[k].desc}">${SCORE_CATEGORIES[k].label}</span><span class="v" style="color:${w >= 80 ? '#4cb88a' : 'inherit'}">${pctStr}</span></div><div class="rd-cat-bar" style="background:#d4ccb6"><i style="width:${w}%; background:${barColor}"></i></div><div style="font-size:10px; color:var(--ink-dim); margin-bottom:8px;">${SCORE_CATEGORIES[k].desc}</div>`;
                    cats.appendChild(row); 
                });
            }

            const taskList = $('#rd-tasks');
            taskList.innerHTML = '';
            const missed = [];
            ['preop', 'intraop', 'postop'].forEach(ph => { 
                if(!p[ph]) return;
                p[ph].tasks.forEach(t => { 
                    if (App.completedTasks.includes(t.id)) { taskList.appendChild(el('li', 'ok', `[${ph.toUpperCase()}] ${t.label}`)); } 
                    else if (t.critical) { missed.push(`[${ph.toUpperCase()}] ${t.label}`); } 
                }); 
            });

            const missedList = $('#rd-missed');
            missedList.innerHTML = ''; 
            if (missed.length === 0) missedList.appendChild(el('li', 'ok', 'Eksik kritik görev yok.'));
            else missed.forEach(m => missedList.appendChild(el('li', 'miss', m)));

            const dec = $('#rd-decisions');
            dec.innerHTML = '';
            App.feedbackEntries.filter(f => f.kind === 'event').forEach(f => { dec.appendChild(el('li', f.ok ? 'ok' : 'miss', `[${f.phase.toUpperCase()}] ${f.label} — ${f.detail}`)); }); 
            if (!dec.children.length) dec.appendChild(el('li', '', 'Klinik olay tetiklenmedi.'));

            // Semptom ve Tanı Detayları
            const sdList = $('#rd-symp-diag-details');
            sdList.innerHTML = '';
            const sympEnts = App.feedbackEntries.filter(f => f.kind === 'symptom');
            sympEnts.forEach(f => {
                let txt = `[${f.phase.toUpperCase()}] Semptomlar: ${f.detail.matched.length} Doğru`;
                if(f.detail.wrong.length) txt += `, ${f.detail.wrong.length} Yanlış (${f.detail.wrong.join(', ')})`;
                if(f.detail.missing.length) txt += `. Eksik: ${f.detail.missing.join(', ')}`;
                sdList.appendChild(el('li', f.ok ? 'ok' : 'warn', txt));
            });
            const diagEnts = App.feedbackEntries.filter(f => f.kind === 'diagnosis');
            diagEnts.forEach(f => {
                let txt = `[${f.phase.toUpperCase()}] Tanılar: Doğru: ${f.detail.matched.join(', ') || 'Yok'}`;
                if(f.detail.low.length) txt += ` | Düşük Öncelik: ${f.detail.low.join(', ')}`;
                if(f.detail.incorrect.length) txt += ` | Yanlış: ${f.detail.incorrect.join(', ')}`;
                sdList.appendChild(el('li', f.ok ? 'ok' : 'warn', txt));
            });
            if(!sympEnts.length && !diagEnts.length) sdList.appendChild(el('li', '', 'Semptom veya tanı seçimi kaydedilmedi.'));

            const rp = $('#rd-reason');
            rp.innerHTML = '';
            const reasoningEntries = App.feedbackEntries.filter(f => f.kind === 'reasoning');
            const okR = reasoningEntries.filter(f => f.ok).length;
            const totR = reasoningEntries.length;
            rp.innerHTML = `<li class="ok">Doğru gerekçelendirme: ${okR}/${totR}</li>`;
            reasoningEntries.filter(f => !f.ok).slice(0, 4).forEach(f => { rp.innerHTML += `<li class="miss">${f.label} — Doğrusu: ${f.detail}</li>`; });

            const gs = $('#rd-guide');
            gs.innerHTML = '';
            const guideMap = {};
            App.feedbackEntries.forEach(f => { 
                if (f.guideline) { 
                    guideMap[f.guideline] = guideMap[f.guideline] || { ok: 0, total: 0 };
                    guideMap[f.guideline].total += 1; 
                    if (f.ok) guideMap[f.guideline].ok += 1; 
                } 
            });
            Object.keys(guideMap).forEach(k => { 
                const g = guideMap[k];
                gs.appendChild(el('li', g.ok === g.total ? 'ok' : 'warn', `${GUIDELINE_THEMES[k]?.tag||k} — ${GUIDELINE_THEMES[k]?.name||''}: ${g.ok}/${g.total} doğru ilişkilendirme`)); 
            });
            if (!gs.children.length) gs.appendChild(el('li', '', 'Kılavuz ilişkilendirilmiş yeterli görev verisi yok.'));

            const narr = $('#rd-narrative');
            narr.innerHTML = generateNarrative(total.percent, p); 

            // OSCE-PHDYÖ akademik blok (her zaman üretilir; yazdırırken görünür)
            try { renderOSCEPHDYOReport(); } catch(e) { console.warn('GCKL rapor hatası:', e); }

            // --- AI REPORT INTEGRATION ---
            const aiContainer = $('.rd-actions').previousElementSibling; 
            if(App.aiMode) {
                const aiReportBtn = el('button', 'rd-action ai-action', '✨ AI Performans Analizi Al');
                aiReportBtn.id = 'ai-final-report-btn';
                aiReportBtn.style.marginBottom = "10px";
                aiReportBtn.onclick = async () => {
                    aiReportBtn.textContent = '✨ Analiz Üretiliyor...';
                    aiReportBtn.disabled = true;

                    let strengths = [], improve = [];
                    Object.keys(App.scores).forEach(k => { 
                        const max = App.scores[k].max;
                        if(max > 0) {
                            const v = Math.max(0, Math.min(100, Math.round((App.scores[k].earned / max) * 100))); 
                            if (v >= 80) strengths.push(SCORE_CATEGORIES[k].label); 
                            else if (v < 60) improve.push(SCORE_CATEGORIES[k].label); 
                        }
                    });

                    const prompt = `Sen uzman bir cerrahi hemşireliği eğitimcisisin. Bir öğrencinin "${p.surgery}" vakasındaki klinik simülasyon performansını değerlendiriyorsun.
Öğrencinin Başarısı: %${total.percent}.
Güçlü Yönleri: ${strengths.join(', ') || 'Belirgin değil'}.
Geliştirmesi Gereken Yönler: ${improve.join(', ') || 'Belirgin değil'}.
Unuttuğu Kritik Görevler: ${missed.join(', ') || 'Yok'}.
Öğrenciye yönelik, motivasyonunu artırıcı ancak eksiklerini de profesyonelce gösteren, klinik pratikleri içeren akademik bir dille 1 paragraflık (yaklaşık 4-5 cümle) kişiselleştirilmiş değerlendirme metni yaz. Sen bir "AI Eğitim Mentörü"sün.`;

                    const aiText = await callGeminiAPI(prompt);
                    
                    const aiNarrative = el('div', 'rd-narrative');
                    aiNarrative.style.borderLeftColor = 'var(--violet)';
                    aiNarrative.style.backgroundColor = 'rgba(155, 137, 196, 0.1)';
                    aiNarrative.style.marginTop = '0';
                    aiNarrative.innerHTML = `<div class="nt" style="color:var(--violet)">✨ AI EĞİTİM MENTÖRÜ DEĞERLENDİRMESİ</div>${aiText}`;

                    aiContainer.appendChild(aiNarrative);
                    aiReportBtn.remove();
                };
                
                // What-if Scenario feature
                const aiWhatIfBtn = el('button', 'rd-action ai-action', '✨ AI "Ya Şöyle Olsaydı?" Simülasyonu');
                aiWhatIfBtn.id = 'ai-what-if-btn';
                aiWhatIfBtn.style.marginBottom = "10px";
                aiWhatIfBtn.style.marginLeft = "10px";
                
                aiWhatIfBtn.onclick = async () => {
                    const whatIfQ = prompt("Lütfen hastada aniden geliştiğini varsaydığınız bir komplikasyon veya senaryo yazın (Örn: 'Tansiyonu aniden 70/40 mmHg'ye düşseydi ve bilinci kapansaydı ne yapmalıydım?'):");
                    if (!whatIfQ) return;
                    
                    aiWhatIfBtn.textContent = '✨ Senaryo Analiz Ediliyor...';
                    aiWhatIfBtn.disabled = true;
                    
                    const pPrompt = `Sen uzman bir klinik eğitmensin. Hasta ${p.name}, ${p.age} yaşında, ${p.surgery} ameliyatı geçirdi. Özgeçmişi: ${p.history.join(', ')}. 
Öğrenci hemşire şu "Ya şöyle olsaydı?" senaryosunu sordu: "${whatIfQ}"
Bu spesifik hastanın durumuna uygun olarak anlık acil müdahale rehberliğini ve ilk yapılması gereken hemşirelik girişimlerini kısa, net ve akademik bir dille (madde imleri kullanarak) açıkla.`;

                    const aiResponse = await callGeminiAPI(pPrompt);
                    
                    const aiNarrative = el('div', 'rd-narrative');
                    aiNarrative.style.borderLeftColor = 'var(--violet)';
                    aiNarrative.style.backgroundColor = 'rgba(155, 137, 196, 0.1)';
                    aiNarrative.style.marginTop = '10px';
                    aiNarrative.innerHTML = `<div class="nt" style="color:var(--violet)">✨ AI "YA ŞÖYLE OLSAYDI?" ANALİZİ</div>
                    <b>Senaryo:</b> ${whatIfQ}<br><br>${aiResponse.replace(/\n/g, '<br>')}`;

                    aiContainer.appendChild(aiNarrative);
                    aiWhatIfBtn.disabled = false;
                    aiWhatIfBtn.textContent = '✨ Başka Senaryo Sor';
                };

                // YENİ: AI Debriefing Butonu
                const aiDebriefBtn = el('button', 'rd-action ai-action', '✨ AI Eğitmen ile Debriefing (Öz-değerlendirme)');
                aiDebriefBtn.id = 'ai-debrief-btn';
                aiDebriefBtn.style.marginBottom = "10px";
                aiDebriefBtn.style.marginLeft = "10px";
                aiDebriefBtn.style.background = 'var(--teal)';
                aiDebriefBtn.style.color = '#062533';
                
                aiDebriefBtn.onclick = () => openDebriefModal(total, missed);

                if (!document.getElementById('ai-final-report-btn')) {
                    aiContainer.appendChild(aiReportBtn);
                    aiContainer.appendChild(aiWhatIfBtn);
                    aiContainer.appendChild(aiDebriefBtn); // YENİ
                }
            }

            // 4. Kategori Performansı bölümünü 3 boyuta indirge
            if (pct >= 85) txt += `${p.surgery} simülasyonunda yüksek performans gösterdiniz. Hasta güvenliği ve klinik akıl yürütme alanlarında sistematik yaklaşımınız belirgin. `;
            else if (pct >= 70) txt += `${p.surgery} simülasyonunda yeterli performans gösterdiniz. Bazı alanlarda klinik akıl yürütme ve önceliklendirme süreçlerini güçlendirebilirsiniz. `;
            else if (pct >= 55) txt += `${p.surgery} simülasyonunda temel akış tamamlandı; kritik adımlarda gerekçelendirme ve önceliklendirme alanlarında çalışma önerilir. `;
            else txt += 'Simülasyon temel adımlarının tekrar gözden geçirilmesi önerilir. Eğitici Mod ile ilerlemek faydalı olacaktır. ';
            
            if (strengths.length) txt += `<div style="margin-top:8px;"><b>Güçlü yönler:</b> ${strengths.join(' · ')}.</div>`; 
            if (improve.length) txt += `<div style="margin-top:6px;"><b>Geliştirme alanları:</b> ${improve.join(' · ')}.</div>`;
            txt = '<div class="nt">Kural tabanlı değerlendirme özeti</div>' + txt;
            return txt; 
        }


        /* ===================== INIT ===================== */
        function init() {
            resetScoreTracker();
            const homeModeBtn = $('#home-mode-tutor');
            const homeStartBtn = $('#home-start');
            const homeMethodBtn = $('#home-method');
            if (homeModeBtn) homeModeBtn.onclick = () => setMode('tutor');
            if (homeStartBtn) homeStartBtn.onclick = openCaseSelect;
            if (homeMethodBtn) homeMethodBtn.onclick = openMethodology;

            const csBack = $('#cs-back');
            const csSearch = $('#cs-search');
            const csSpec = $('#cs-spec');
            const csDiff = $('#cs-diff');
            const csStatus = $('#cs-status');
            if (csBack) csBack.onclick = goHome;
            if (csSearch) csSearch.oninput = renderCases;
            if (csSpec) csSpec.onchange = renderCases;
            if (csDiff) csDiff.onchange = renderCases;
            if (csStatus) csStatus.onchange = renderCases;

            const ss = $('#cs-spec');
            if (ss) {
                ss.innerHTML = '';
                SPECIALTIES.forEach(s => {
                    const o = document.createElement('option');
                    o.value = s.id;
                    o.textContent = s.name;
                    ss.appendChild(o);
                });
            }

            $('#tb-home').onclick = goHome;
            $('#tb-restart').onclick = restartCase;
            $('#tb-settings').onclick = openSettingsModal;
            $('#tb-toggle-ai').onclick = toggleAI;
            $('#advance-btn').onclick = advancePhase;
            $('#reason-close').onclick = () => $('#reason-modal').classList.remove('visible');

            $('#method-back').onclick = goHome;
            $('#rd-home').onclick = goHome;
            $('#rd-restart').onclick = restartCase;
            $('#rd-print').onclick = () => window.print();
            $('#rd-method').onclick = openMethodology;

            // OSCE-PHDYÖ UI handler'ları
            try { bindOSCEUIHandlers(); } catch(e) { console.warn('OSCE handler bind hatası:', e); }

            setMode('tutor');
            showScreen('home-screen');
        }
        function openFamilyModal() {
            const m = $('#family-modal');
            const chatHist = $('#family-chat-history');
            const input = $('#family-input');
            const submit = $('#family-submit');
            
            const updateChatUI = () => {
                chatHist.innerHTML = App.familyChatHistory.map(msg => 
                    `<div style="margin-bottom:8px; padding:8px; border-radius:4px; background:${msg.role==='user'?'var(--panel)':'rgba(92, 196, 214, 0.1)'}; color:${msg.role==='user'?'var(--ink)':'var(--teal)'}; border: 1px solid ${msg.role==='user'?'var(--line)':'var(--teal-2)'}">
                        <strong style="font-size:10px; text-transform:uppercase;">${msg.role==='user'?'Hemşire (Siz)':'Hasta Yakını'}</strong><br>${msg.text.replace(/\n/g, '<br>')}
                    </div>`
                ).join('');
                chatHist.scrollTop = chatHist.scrollHeight;
            };
            
            updateChatUI();
            input.value = '';
            submit.disabled = false;
            submit.textContent = '✨ Mesajı Gönder';
            
            // Eğer geçmiş boşsa yakından ilk mesajı al
            if(App.familyChatHistory.length === 0) {
                const p = App.currentPatient;
                App.familyChatHistory.push({ role: 'family', text: `Merhaba hemşire hanım/bey, ${p.name} nasıl? Ameliyat süreciyle ilgili çok endişeliyim, biraz bilgi verebilir misiniz?` });
                updateChatUI();
            }
            
            submit.onclick = async () => {
                const text = input.value.trim();
                if(!text) return;
                
                App.familyChatHistory.push({ role: 'user', text });
                updateChatUI();
                input.value = '';
                
                submit.disabled = true;
                submit.textContent = '✨ Yakını Yanıtlıyor...';
                
                const p = App.currentPatient;
                let conv = App.familyChatHistory.map(m => `${m.role === 'user' ? 'Hemşire' : 'Hasta Yakını'}: ${m.text}`).join('\n');
                
                const prompt = `Sen ${p.age} yaşındaki ${p.name} isimli hastanın çok endişeli bir yakınısın (eşi veya çocuğu). Hasta şu an ${App.currentRoom} fazında (ameliyat ${p.surgery}).
Bir klinik hemşiresi seninle konuşuyor. Lütfen tıbbi jargon kullanmadan, stresli, soru soran ve şefkat/empati arayan bir hasta yakını gibi doğal ve kısa (1-2 cümle) yanıt ver.
İşte konuşma geçmişi:
${conv}
Hasta Yakını olarak son mesaja yanıtın:`;

                const reply = await callGeminiAPI(prompt);
                App.familyChatHistory.push({ role: 'family', text: reply });
                updateChatUI();
                
                submit.disabled = false;
                submit.textContent = '✨ Mesajı Gönder';
                
                addScore(['communication', 'patientCentredCare'], 5, 0);
                addPhaseScore(App.currentRoom, 5, 0);
                updateScoreStrip();
            };
            
            m.classList.add('visible');
        }

        // YENİ: Debriefing Modalı
        function openDebriefModal(total, missed) {
            const m = $('#debrief-modal');
            const chatHist = $('#debrief-chat-history');
            const input = $('#debrief-input');
            const submit = $('#debrief-submit');
            
            const updateChatUI = () => {
                chatHist.innerHTML = App.debriefChatHistory.map(msg => 
                    `<div style="margin-bottom:8px; padding:8px; border-radius:4px; background:${msg.role==='user'?'var(--panel)':'var(--teal-soft)'}; color:${msg.role==='user'?'var(--ink)':'#08111f'}; border: 1px solid ${msg.role==='user'?'var(--line)':'var(--teal-2)'}">
                        <strong style="font-size:10px; text-transform:uppercase;">${msg.role==='user'?'Öğrenci Hemşire (Siz)':'Klinik Eğitmen'}</strong><br>${msg.text.replace(/\n/g, '<br>')}
                    </div>`
                ).join('');
                chatHist.scrollTop = chatHist.scrollHeight;
            };
            
            updateChatUI();
            input.value = '';
            submit.disabled = false;
            submit.textContent = '✨ Yanıtla';
            
            if(App.debriefChatHistory.length === 0) {
                App.debriefChatHistory.push({ role: 'tutor', text: `Simülasyonu tamamladın, tebrikler. Genel başarın %${total.percent}. Bu vakada genel olarak kendini nasıl hissettin? Sence en iyi yaptığın şey neydi?` });
                updateChatUI();
            }
            
            submit.onclick = async () => {
                const text = input.value.trim();
                if(!text) return;
                
                App.debriefChatHistory.push({ role: 'user', text });
                updateChatUI();
                input.value = '';
                
                submit.disabled = true;
                submit.textContent = '✨ Eğitmen Değerlendiriyor...';
                
                const p = App.currentPatient;
                let conv = App.debriefChatHistory.map(m => `${m.role === 'user' ? 'Öğrenci' : 'Eğitmen'}: ${m.text}`).join('\n');
                
                const prompt = `Sen bir klinik simülasyon kolaylaştırıcısısın (Facilitator/Debriefer). Öğrenci ${p.surgery} simülasyonunu tamamladı.
Öğrencinin başarısı: %${total.percent}. Kaçırdığı kritik güvenlik adımları: ${missed.join(', ') || 'Yok'}.
Amacın öğrenciyi yargılamak değil, Sokratik yöntemle kendi doğrularını ve hatalarını fark etmesini (öz-düşünüm/self-reflection) sağlamak.
İşte aranızdaki debriefing sohbeti:
${conv}
Eğitmen olarak yapıcı, kısa ve öğrenciyi düşündürmeye sevk eden yeni sorunu veya geri bildirimini yaz (Maksimum 2 cümle):`;

                const reply = await callGeminiAPI(prompt);
                App.debriefChatHistory.push({ role: 'tutor', text: reply });
                updateChatUI();
                
                submit.disabled = false;
                submit.textContent = '✨ Yanıtla';
            };
            
            m.classList.add('visible');
        }



        /* ============================================================
           GCKL ÖĞRENME MODÜLÜ — GÖREV, SAYIM VE RAPOR ENTEGRASYONU
           Bu blok önceki fonksiyonları bozmadan Güvenli Cerrahi Kontrol
           Listesi maddelerini görev paneline ve rapora bağlar.
           ============================================================ */
        const GCKL_SECTION_TO_SIM_PHASE = { I: 'preop', II: 'intraop', III: 'intraop', IV: 'intraop' };
        const GCKL_SECTION_TITLES = {
            I: 'I. Klinikten Ayrılmadan Önce',
            II: 'II. Anestezi Verilmeden Önce',
            III: 'III. Ameliyat Kesisinden Önce',
            IV: 'IV. Ameliyattan Çıkmadan Önce'
        };
        const GCKL_TASK_DEFS = {
            'GCKL-1': [
                ['gckl_1_identity_check', 'Hastanın kimliğini bileklik ve en az iki tanımlayıcıyla doğrula'],
                ['gckl_1_consent_check', 'Aydınlatılmış onamı ve ameliyat adını dosyayla eşleştir'],
                ['gckl_1_site_check', 'Ameliyat bölgesini/tarafını doğrula']
            ],
            'GCKL-2': [
                ['gckl_2_consent_verify', 'Aydınlatılmış onam formunu kontrol et ve hastadan rızasını sözel olarak teyit et']
            ],
            'GCKL-3': [
                ['gckl_3_npo_check', 'NPO süresini sorgula, kayıtla eşleştir; uygunsuzluk varsa anestezi/cerrahi ekibe bildir']
            ],
            'GCKL-4': [
                ['gckl_4_shave_status', 'Ameliyat bölgesi tıraş durumunu doğrula (gerekli değilse işaretle)']
            ],
            'GCKL-5': [
                ['gckl_5_remove_items', 'Oje, makyaj, protez, lens ve takıların çıkarıldığını doğrula'],
                ['gckl_5_valuables_handover', 'Değerli eşyaları güvenli teslim sürecine al']
            ],
            'GCKL-6': [
                ['gckl_6_dressing', 'Ameliyat önlüğü ve bone giydirildi, mahremiyet korundu']
            ],
            'GCKL-7': [
                ['gckl_7_special_prep', 'Vakaya özgü ön hazırlıkları (lavman, kateter, varis çorabı, özel protokol) değerlendir ve uygula']
            ],
            'GCKL-8': [
                ['gckl_8_logistics_ready', 'Özel malzeme, implant ve kan/kan ürünü hazırlığını birlikte teyit et']
            ],
            'GCKL-9': [
                ['gckl_9_results_ready', 'Laboratuvar ve radyoloji/görüntüleme sonuçlarını birlikte kontrol et']
            ],
            'GCKL-10': [
                ['gckl_10_patient_verify', 'Hastadan kimlik, ameliyat ve ameliyat bölgesini birlikte sözel olarak doğrula']
            ],
            'GCKL-11': [
                ['gckl_11_site_marking', 'İşaretlemeyi kontrol et; yoksa süreci durdur ve gerekçelendir']
            ],
            'GCKL-12': [['gckl_12_anesthesia_checklist', 'Anestezi Güvenlik Kontrol Listesi tamamlandı mı doğrula']],
            'GCKL-13': [
                ['gckl_13_pulse_ready', 'Pulse oksimetreyi tak ve çalıştığını doğrula']
            ],
            'GCKL-14': [
                ['gckl_14_allergy_check', 'Alerjiyi hastadan, bileklikten ve dosyadan doğrula; varsa ekibe bildir']
            ],
            'GCKL-15': [['gckl_15_imaging_ready', 'Gerekli görüntüleme cihazları/sonuçları hazır mı kontrol et']],
            'GCKL-16': [
                ['gckl_16_bleeding_assess', 'Kan kaybı riskini değerlendir ve sıvı/kan planını netleştir'],
                ['gckl_16_iv_access', 'Uygun damar yolu erişimini sağla']
            ],
            'GCKL-17': [
                ['gckl_17_team_pause', 'Ekibi durdur, üyeleri ad/rolüyle tanıt ve hazır olduklarını teyit et']
            ],
            'GCKL-18': [
                ['gckl_18_verbal_verify', 'Hasta/ameliyat/taraf sözel teyidini onamla eşleştir; uyumsuzlukta süreci durdur']
            ],
            'GCKL-19': [
                ['gckl_19_surgeon_review', 'Cerrah: süre, beklenen kan kaybı, beklenmedik olaylar ve pozisyonu paylaşır'],
                ['gckl_19_anesthesia_review', 'Anestezi: kritik anestezi risklerini ekibe paylaşır']
            ],
            'GCKL-20': [
                ['gckl_20_abx_verify', 'Profilaktik antibiyotik gerekliliğini, zamanlamasını, alerji uyumunu ve redoz ihtiyacını doğrula']
            ],
            'GCKL-21': [['gckl_21_material_ready', 'Kullanılacak cerrahi malzemeler hazır mı kontrol et']],
            'GCKL-22': [
                ['gckl_22_steril_verify', 'Sterilizasyon göstergesi, paket bütünlüğü ve son kullanma tarihini doğrula'],
                ['gckl_22_steril_breach', 'Steril ihlali varsa alanı yeniden düzenle ve uygunsuz malzemeyi kullanımdan çıkar']
            ],
            'GCKL-23': [['gckl_23_glucose_need', 'Kan şekeri kontrolü gerekli mi değerlendir']],
            'GCKL-24': [
                ['gckl_24_anticoag_check', 'Antikoagülan/antiagregan kullanımını, son dozu ve kanama riskini değerlendir']
            ],
            'GCKL-25': [['gckl_25_dvt_need', 'DVT profilaksisi gerekliliğini değerlendir']],
            'GCKL-26': [['gckl_26_signout_verbal', 'Sign Out sırasında hasta, yapılan ameliyat ve ameliyat bölgesini sözlü doğrula']],
            'GCKL-27': [
                ['gckl_27_count_open', 'Açılış sayımını yap ve panoya işle'],
                ['gckl_27_count_close', 'Kapatma öncesi alet/spanç/iğne kapanış sayımını sesli teyit et'],
                ['gckl_27_count_discrepancy', 'Sayım uyumsuzluğunda ekibi uyar ve güvenli eylemi seç (görüntüleme dahil)']
            ],
            'GCKL-28': [
                ['gckl_28_specimen_verify', 'Numuneyi etiket-hasta-bölge ekipçe sesli teyit et; eksik etikette gönderimi durdur']
            ],
            'GCKL-29': [
                ['gckl_29_handover', 'Cerrah ve anestezi postoperatif önerilerini topla, PACU/servis teslimine aktar']
            ],
            'GCKL-30': [['gckl_30_destination_confirm', 'Hastanın ameliyat sonrası gideceği bölümü teyit et']]
        };

        function gcklPhaseForItem(itemId) {
            const item = gcklGetItem(itemId);
            if (!item) return 'preop';
            if (itemId === 'GCKL-29' || itemId === 'GCKL-30') return 'postop';
            return GCKL_SECTION_TO_SIM_PHASE[item.phase] || 'preop';
        }
        function gcklTaskIdsForItem(itemId) { return (GCKL_TASK_DEFS[itemId] || []).map(x => x[0]); }
        function gcklEnsureLearningState() {
            if (!App.gckl) App.gckl = {};
            if (!App.gckl.answers) App.gckl.answers = {}; // legacy/passive; no longer used for scoring
            if (!App.gckl.countAnswers) App.gckl.countAnswers = null;
            if (!App.gckl.countSubmitted) App.gckl.countSubmitted = false;
            if (!App.gckl.itemEvidence) App.gckl.itemEvidence = {};
            if (!App.gckl.dialogueEvidence) App.gckl.dialogueEvidence = {};
            if (!App.gckl.symptomEvidence) App.gckl.symptomEvidence = {};
            if (!App.gckl.diagnosisEvidence) App.gckl.diagnosisEvidence = {};
        }
        function gcklCaseCountData(patient) {
            if (!patient) return JSON.parse(JSON.stringify(GCKL_DEFAULT_COUNT));
            if (patient.surgicalCountData) return patient.surgicalCountData;
            const base = JSON.parse(JSON.stringify(GCKL_DEFAULT_COUNT));
            const hay = ((patient.id||'') + ' ' + (patient.surgery||'') + ' ' + (patient.shortSurgery||'')).toLowerCase();
            if (hay.includes('fiks') || hay.includes('ortho') || hay.includes('fix')) {
                base.finalReported = { instruments: 24, sponges: 24, needles: 10 };
                base.discrepancyScenario = true;
                base.missingItem = 'sponges';
            }
            patient.surgicalCountData = base;
            return base;
        }
        function gcklMakeTask(itemId, taskDef, idx) {
            const item = gcklGetItem(itemId);
            const taskId = taskDef[0], label = taskDef[1];
            return {
                id: taskId,
                label: `GCKL-${String((item && item.id || itemId).split('-')[1]).padStart(2,'0')} · ${label}`,
                critical: !!(item && item.criticalKey) || ['GCKL-1','GCKL-10','GCKL-11','GCKL-14','GCKL-18','GCKL-20','GCKL-27','GCKL-28'].includes(itemId),
                score: itemId === 'GCKL-27' ? 6 : 4,
                categories: itemId === 'GCKL-27'
                    ? ['patientSafety','checklistPerformance','surgicalNursingKnowledge','countingSafety']
                    : ['patientSafety','checklistPerformance','surgicalNursingKnowledge'],
                guideline: 'who_ssc',
                gcklItem: itemId,
                gcklTaskIndex: idx
            };
        }
        function ensureGCKLTasksForPatient(patient) {
            if (!patient || patient.__gcklTasksInjected) return;
            gcklCaseCountData(patient);
            ['preop','intraop','postop'].forEach(ph => { if (patient[ph] && !Array.isArray(patient[ph].tasks)) patient[ph].tasks = []; });
            GCKL_ITEMS.forEach(item => {
                const simPhase = gcklPhaseForItem(item.id);
                const phase = patient[simPhase];
                if (!phase) return;
                (GCKL_TASK_DEFS[item.id] || []).forEach((td, idx) => {
                    if (!phase.tasks.some(t => t.id === td[0])) phase.tasks.push(gcklMakeTask(item.id, td, idx));
                });
            });
            patient.__gcklTasksInjected = true;
        }
        function validateGCKLTaskCoverage() {
            const unmapped = GCKL_ITEMS.filter(i => !GCKL_TASK_DEFS[i.id] || GCKL_TASK_DEFS[i.id].length === 0).map(i => i.id);
            const mapped = GCKL_ITEMS.length - unmapped.length;
            console.group('%cGCKL Task Coverage', 'color:#5cc4d6;font-weight:bold');
            console.log(`Covered items: ${mapped} / ${GCKL_ITEMS.length}`);
            console.log('Unmapped items:', unmapped);
            console.groupEnd();
            return { mapped, total: GCKL_ITEMS.length, unmapped };
        }
        function gcklRequiredCompleted(itemId) {
            const ids = gcklTaskIdsForItem(itemId);
            const completed = ids.filter(id => App.completedTasks && App.completedTasks.includes(id));
            return { required: ids, completed, missing: ids.filter(id => !completed.includes(id)) };
        }
        function gcklCountEvaluationForStudent() {
            gcklEnsureLearningState();
            const data = gcklCaseCountData(App.currentPatient);
            const ev = gcklEvaluateCount(data);
            const a = App.gckl.countAnswers || {};
            const num = v => Number(String(v ?? '').trim());
            const initialSpongesCorrect = num(a.initialSponges) === ((data.initial || {}).sponges || 0);
            const initialNeedlesCorrect = num(a.initialNeedles) === ((data.initial || {}).needles || 0);
            const initialCorrect = initialSpongesCorrect && initialNeedlesCorrect;
            const expectedCorrect = num(a.expectedInstruments) === ev.expected.instruments && num(a.expectedSponges) === ev.expected.sponges && num(a.expectedNeedles) === ev.expected.needles;
            const reportedCorrect = num(a.reportedInstruments) === ev.reported.instruments && num(a.reportedSponges) === ev.reported.sponges && num(a.reportedNeedles) === ev.reported.needles;
            const statusCorrect = (ev.hasDiscrepancy && a.status === 'discrepancy') || (!ev.hasDiscrepancy && a.status === 'aligned') || (a.status === 'na' && data.countNotApplicable === true);
            const safeActionCorrect = !ev.hasDiscrepancy || ['stop_recount_search','notify_repeat_check','radiology_if_unresolved'].includes(a.safeAction);
            const any = Object.values(a).some(v => String(v ?? '').trim() !== '');
            return { ...ev, answers: a, initialSpongesCorrect, initialNeedlesCorrect, initialCorrect, expectedCorrect, reportedCorrect, statusCorrect, safeActionCorrect, any, allCorrect: !!(App.gckl.countSubmitted && initialCorrect && expectedCorrect && reportedCorrect && statusCorrect && safeActionCorrect) };
        }
        function gcklQuestionCorrectForItem(itemId) {
            gcklEnsureLearningState();
            const qs = gcklQuestionsForItem(itemId);
            const answered = qs.filter(q => App.gckl.answers[q.id]);
            if (!answered.length) return null;
            return answered.some(q => App.gckl.answers[q.id].correct === true);
        }
        // [Adım 1 düzeltmesi] Bu iki global, GCKL v3.9 patch IIFE'sinde üzerine yazılır.
        // Önceden ilk IIFE içinde örtük global olarak tanımlanıyordu; o IIFE temizlenince
        // strict mode'da ReferenceError oluştu. Stub olarak burada deklare ediyoruz ki
        // v3.9 patch çalıştığında atama yapacağı slot mevcut olsun.
        function maybeAskGCKLQuestionForItem(itemId) { /* v3.9 patch tarafından override edilir */ }
        function maybeAskGCKLQuestionForTask(task)   { /* v3.9 patch tarafından override edilir */ }
        function gcklComplianceSummary() {
            const items = GCKL_ITEMS.map(item => ({ item, code: gcklCodeForItem(item.id) }));
            const totalCode = items.reduce((a,b) => a + b.code, 0);
            const maxCode = GCKL_ITEMS.length * 2;
            const pct = maxCode ? Math.round((totalCode / maxCode) * 100) : 0;
            const c0 = items.filter(x => x.code === 0).length, c1 = items.filter(x => x.code === 1).length, c2 = items.filter(x => x.code === 2).length;
            const criticalMissing = items.filter(x => x.code === 0 && x.item.criticalKey).map(x => `${x.item.id}: ${x.item.text}`);
            return { items, totalCode, maxCode, pct, c0, c1, c2, criticalMissing };
        }

        /* ============================================================
           İP-5b: GCKL Knowledge Summary (Klinik Bilgi Boyutu)
           Compliance (davranış/uygulama) ile ayrı bir boyuttur.
           Görev tamamlama ile karıştırılmaz — psikometrik construct
           validity için ayrı metrik tutulur.

           Veri kaynağı: App.gckl.answers (her soru için {correct: bool})
           Metrik: 0-100% knowledge accuracy, soru başına ağırlık = 1
           ============================================================ */
        function gcklKnowledgeSummary() {
            try { gcklEnsureLearningState(); } catch(e) {}
            if (typeof GCKL_QUESTIONS === 'undefined' || !Array.isArray(GCKL_QUESTIONS)) {
                return { totalQuestions: 0, answered: 0, correct: 0, incorrect: 0, pct: 0, perItem: {} };
            }

            const answers = (App.gckl && App.gckl.answers) || {};
            const totalQuestions = GCKL_QUESTIONS.length;
            let answered = 0, correct = 0, incorrect = 0;

            // Her GCKL maddesi başına bilgi durumu
            const perItem = {};
            GCKL_ITEMS.forEach(item => {
                const itemQs = GCKL_QUESTIONS.filter(q => q.linkedChecklistItem === item.id);
                let itemAnswered = 0, itemCorrect = 0;
                itemQs.forEach(q => {
                    if (answers[q.id]) {
                        itemAnswered++;
                        if (answers[q.id].correct === true) itemCorrect++;
                    }
                });
                if (itemQs.length > 0) {
                    perItem[item.id] = {
                        total: itemQs.length,
                        answered: itemAnswered,
                        correct: itemCorrect,
                        pct: itemAnswered > 0 ? Math.round((itemCorrect / itemAnswered) * 100) : null
                    };
                }
            });

            // Genel toplam
            GCKL_QUESTIONS.forEach(q => {
                if (answers[q.id]) {
                    answered++;
                    if (answers[q.id].correct === true) correct++;
                    else incorrect++;
                }
            });

            // Knowledge accuracy: cevaplanan soruların doğruluk oranı
            // (cevaplanmayan sorular skoru düşürmez — eğitsel adillik)
            const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;

            // Coverage: toplam soruların ne kadarı cevaplandı
            const coverage = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;

            return {
                totalQuestions: totalQuestions,
                answered: answered,
                correct: correct,
                incorrect: incorrect,
                pct: pct,            // Knowledge accuracy (cevaplananın doğruluğu)
                coverage: coverage,  // Coverage (cevap verme oranı)
                perItem: perItem
            };
        }

        // Birleşik özet — iki boyut yan yana
        function gcklUnifiedSummary() {
            return {
                compliance: gcklComplianceSummary(),
                knowledge: gcklKnowledgeSummary()
            };
        }

        // Konsoldan test için
        if (typeof window !== 'undefined') {
            window.gcklKnowledgeSummary = gcklKnowledgeSummary;
            window.gcklUnifiedSummary = gcklUnifiedSummary;
        }

        function syncGCKLPatientSafetyScore() {
            if (!App || !App.scores || !App.scores.patientSafety) return;
            const s = gcklComplianceSummary();
            App.scores.patientSafety.earned = s.totalCode;
            App.scores.patientSafety.max = s.maxCode;
        }
        function gcklLabelForCode(c) { return c === 2 ? 'Tam yapıldı' : c === 1 ? 'Kısmen yapıldı' : 'Yapılmadı / yanlış yapıldı'; }
        function gcklClassForCode(c) { return c === 2 ? 'ok' : c === 1 ? 'warn' : 'miss'; }
        function renderGCKLComplianceReport() {
            const box = document.getElementById('rd-osce-items');
            if (!box) return;
            const sum = gcklComplianceSummary();
            let html = `<div class="rd-section"><h3>Güvenli Cerrahi Kontrol Listesi Uyum Durumu</h3>
                <div class="rd-narrative" style="background:#ebe7d8;border-left-color:#1c2a3d;margin-top:8px">
                    <b>Genel uyum:</b> %${sum.pct} &nbsp; · &nbsp; <b>Tam:</b> ${sum.c2} madde &nbsp; · &nbsp; <b>Kısmi:</b> ${sum.c1} madde &nbsp; · &nbsp; <b>Yapılmayan/Yanlış:</b> ${sum.c0} madde<br>
                    <span style="font-size:11px;color:#5b7896">Hesaplama: ${sum.totalCode}/${sum.maxCode} kod puanı. Kod 0 = yapılmadı/yanlış, Kod 1 = kısmen yapıldı, Kod 2 = tam yapıldı.</span>
                </div>`;
            if (sum.criticalMissing.length) html += `<ul class="rd-list" style="margin-top:8px">${sum.criticalMissing.map(x=>`<li class="miss">Kritik eksik: ${x}</li>`).join('')}</ul>`;
            ['I','II','III','IV'].forEach(ph => {
                html += `<h3 style="margin-top:18px">${GCKL_SECTION_TITLES[ph]}</h3><ul class="rd-list">`;
                GCKL_ITEMS.filter(i => i.phase === ph).forEach(item => {
                    const code = gcklCodeForItem(item.id);
                    const no = item.id.split('-')[1];
                    html += `<li class="${gcklClassForCode(code)}"><b>${no}. ${item.text}</b> — <span style="font-family:var(--font-mono);font-weight:700">Kod: ${code}</span> <span style="color:#5b7896">(${gcklLabelForCode(code)})</span></li>`;
                });
                html += '</ul>';
            });
            html += '</div>';
            box.innerHTML = html;
        }
        function renderGCKLCountReport() {
            const box = document.getElementById('rd-osce-compliance');
            if (!box) return;
            const data = gcklCaseCountData(App.currentPatient);
            const ev = gcklCountEvaluationForStudent();
            const a = ev.answers || {};
            const wrongTries = (App.gckl && App.gckl.countWrongAttempts) || 0; // m0158
            const row = (k,v, ok) => `<div class="rd-row"><span class="k">${k}</span><span class="v" style="color:${ok===false?'#c84a55': ok===true?'#4cb88a':'#1c2a3d'}">${v}</span></div>`;
            // m0158: Yanlış sayım denemesi sayısı — kırmızı (≥1) veya yeşil (0)
            const wrongRow = wrongTries > 0
                ? `<div class="rd-row" style="background:rgba(217,99,113,.08);border-radius:8px;padding:6px 10px;margin-top:4px"><span class="k" style="color:#c84a55;font-weight:700">⚠ Yanlış sayım denemesi</span><span class="v" style="color:#c84a55;font-weight:800">${wrongTries} kez · −20 puan</span></div>`
                : `<div class="rd-row" style="background:rgba(76,184,138,.08);border-radius:8px;padding:6px 10px;margin-top:4px"><span class="k" style="color:#4cb88a;font-weight:700">✓ Yanlış sayım denemesi</span><span class="v" style="color:#4cb88a;font-weight:800">Yok</span></div>`;
            box.innerHTML = `<div class="rd-section"><h3>Sayım Güvenliği Panosu</h3>
                ${row('Başlangıç sayımı', `Alet ${data.initial.instruments} · Spanç/Kompres ${data.initial.sponges} · İğne ${data.initial.needles}`)}
                ${row('Öğrencinin giriş spanç/iğne doğrulaması', `Spanç/Kompres ${a.initialSponges ?? '—'} · İğne ${a.initialNeedles ?? '—'}`, ev.initialCorrect)}
                ${row('Eklenen materyal', `Alet +${data.addedDuringSurgery.instruments} · Spanç/Kompres +${data.addedDuringSurgery.sponges} · İğne +${data.addedDuringSurgery.needles}`)}
                ${row('Sistemin beklediği final', `Alet ${ev.expected.instruments} · Spanç/Kompres ${ev.expected.sponges} · İğne ${ev.expected.needles}`)}
                ${row('Bildirilen final', `Alet ${ev.reported.instruments} · Spanç/Kompres ${ev.reported.sponges} · İğne ${ev.reported.needles}`)}
                ${row('Öğrencinin beklenen final yanıtı', `Alet ${a.expectedInstruments ?? '—'} · Spanç/Kompres ${a.expectedSponges ?? '—'} · İğne ${a.expectedNeedles ?? '—'}`, ev.expectedCorrect)}
                ${row('Öğrencinin bildirilen final yanıtı', `Alet ${a.reportedInstruments ?? '—'} · Spanç/Kompres ${a.reportedSponges ?? '—'} · İğne ${a.reportedNeedles ?? '—'}`, ev.reportedCorrect)}
                ${row('Sayım durumu', ev.hasDiscrepancy ? 'Uyuşmazlık var' : 'Uyumlu')}
                ${row('Öğrencinin karar durumu', a.status ? (a.status === 'aligned' ? 'Sayım uyumlu' : a.status === 'discrepancy' ? 'Sayım uyuşmazlığı var' : 'Sayım uygulanmaz') : 'Yanıt yok', ev.statusCorrect)}
                ${wrongRow}
            </div>`;
        }
        function renderGCKLQuestionReport() {
            const box = document.getElementById('rd-osce-rationales');
            if (!box) return;
            gcklEnsureLearningState();
            const entries = Object.values(App.gckl.answers || {});
            let html = `<div class="rd-section"><h3>Güvenli Cerrahi Gerekçeli Çoktan Seçmeli Sorular</h3>`;
            if (!entries.length) html += '<p style="font-size:12px;color:#5b7896">Henüz çoktan seçmeli gerekçeli soru yanıtlanmadı.</p>';
            else {
                html += '<ul class="rd-list">';
                entries.forEach(a => {
                    html += `<li class="${a.correct?'ok':'miss'}"><b>${a.question}</b><br><span style="font-size:12px;color:#5b7896">Öğrenci: ${a.selectedOption} · Doğru: ${a.correctOption} · Durum: ${a.correct?'doğru':'yanlış'}</span><br><span style="font-size:12px">${a.explanation || ''}</span></li>`;
                });
                html += '</ul>';
            }
            html += '</div>';
            box.innerHTML = html;
        }
        function renderGCKLCountPanel() {
            // Sayım Güvenliği Panosu sadece intraop fazında geçerlidir (AORN protokolü).
            // Modernleştirildi (m0128): kompakt stepper kart layout + idempotent stil.
            const existing = document.getElementById('gckl-count-panel');
            if (existing) existing.remove();
            if (!App.currentPatient || App.currentRoom !== 'intraop') return;
            const advance = document.getElementById('advance-btn');
            if (!advance || !advance.parentNode) return;

            if (!document.getElementById('gckl-count-panel-styles')) {
                const st = document.createElement('style');
                st.id = 'gckl-count-panel-styles';
                st.textContent =
                  '#gckl-count-panel{border:1px solid rgba(92,196,214,.28);border-radius:12px;background:linear-gradient(180deg,rgba(10,20,31,.96),rgba(15,28,40,.96));padding:10px 12px;margin:8px 0;box-shadow:0 6px 18px rgba(0,0,0,.16)}'
                + '#gckl-count-panel .gcp-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}'
                + '#gckl-count-panel .gcp-title{font-size:12px;font-weight:800;color:var(--ink,#dbe6f1);letter-spacing:.01em}'
                + '#gckl-count-panel .gcp-sub{font-size:9.5px;color:var(--ink-mute,#7aabb8);margin-top:1px;line-height:1.3}'
                + '#gckl-count-panel .gcp-status{font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;letter-spacing:.02em;white-space:nowrap}'
                + '#gckl-count-panel .gcp-status.ok{background:rgba(76,184,138,.14);color:#7fe2a3;border:1px solid rgba(76,184,138,.40)}'
                + '#gckl-count-panel .gcp-status.warn{background:rgba(224,165,88,.14);color:#f0d29a;border:1px solid rgba(224,165,88,.40)}'
                + '#gckl-count-panel .gcp-status.done{background:rgba(76,184,138,.22);color:#a0f0c4;border:1px solid rgba(76,184,138,.60)}'
                + '#gckl-count-panel .gcp-baseline{border:1px solid rgba(255,255,255,.08);border-radius:9px;background:rgba(255,255,255,.03);padding:6px 8px;margin-bottom:7px}'
                + '#gckl-count-panel .gcp-baseline-title{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-mute,#7aabb8);margin-bottom:4px}'
                + '#gckl-count-panel .gcp-baseline-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px}'
                + '#gckl-count-panel .gcp-baseline-cell{display:flex;align-items:baseline;justify-content:space-between;gap:4px;background:rgba(0,0,0,.18);border-radius:6px;padding:3px 7px}'
                + '#gckl-count-panel .gcp-baseline-cell .lbl{font-size:9.5px;color:var(--ink-mute,#7aabb8);font-weight:600}'
                + '#gckl-count-panel .gcp-baseline-cell .val{font-size:13px;color:var(--ink,#dbe6f1);font-weight:800;font-family:var(--font-mono,monospace)}'
                + '#gckl-count-panel .gcp-baseline.added{border-color:rgba(224,165,88,.25);background:rgba(224,165,88,.06)}'
                + '#gckl-count-panel .gcp-baseline.added .gcp-baseline-title{color:#f0d29a}'
                + '#gckl-count-panel .gcp-baseline.added .gcp-baseline-cell .val{color:#f0d29a}'
                + '#gckl-count-panel .gcp-prompt{font-size:10px;color:var(--teal,#5cc4d6);font-weight:700;margin-bottom:5px;letter-spacing:.02em;padding:0 2px;line-height:1.3}'
                + '#gckl-count-panel .gcp-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:8px}'
                + '#gckl-count-panel .gcp-row{border:1px solid rgba(255,255,255,.08);border-radius:8px;background:rgba(255,255,255,.03);padding:5px 7px;display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center}'
                + '#gckl-count-panel .gcp-row-head{display:contents}'
                + '#gckl-count-panel .gcp-row-name{font-size:10px;font-weight:800;color:var(--ink,#dbe6f1);letter-spacing:.01em;min-width:34px}'
                + '#gckl-count-panel .gcp-row-expected{font-size:8.5px;color:var(--teal,#5cc4d6);font-weight:700;padding:1px 5px;border-radius:999px;background:rgba(92,196,214,.10);border:1px solid rgba(92,196,214,.30);white-space:nowrap;justify-self:end}'
                + '#gckl-count-panel .gcp-stepper{display:flex;align-items:center;gap:2px;background:rgba(0,0,0,.20);border:1px solid rgba(255,255,255,.06);border-radius:6px;padding:1px;grid-column:1/-1;margin-top:3px}'
                + '#gckl-count-panel .gcp-step-btn{width:18px;height:18px;border-radius:4px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05);color:var(--ink,#dbe6f1);font-size:11px;font-weight:700;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;transition:all .12s;flex-shrink:0;padding:0}'
                + '#gckl-count-panel .gcp-step-btn:hover{background:rgba(92,196,214,.15);border-color:rgba(92,196,214,.40);color:var(--teal,#5cc4d6)}'
                + '#gckl-count-panel .gcp-step-input{flex:1;background:transparent;border:none;color:var(--ink,#dbe6f1);font-size:12px;font-weight:800;text-align:center;outline:none;min-width:0;font-family:var(--font-mono,monospace);padding:0;-moz-appearance:textfield;height:18px}'
                + '#gckl-count-panel .gcp-step-input::-webkit-inner-spin-button,#gckl-count-panel .gcp-step-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}'
                + '#gckl-count-panel .gcp-row.match{border-color:rgba(76,184,138,.40);background:rgba(76,184,138,.06)}'
                + '#gckl-count-panel .gcp-row.mismatch{border-color:rgba(224,165,88,.45);background:rgba(224,165,88,.06)}'
                + '#gckl-count-panel .gcp-row-mark{font-size:9px;font-weight:700;letter-spacing:.02em;margin-top:3px;line-height:1.25;grid-column:1/-1}'
                + '#gckl-count-panel .gcp-row.match .gcp-row-mark{color:#7fe2a3}'
                + '#gckl-count-panel .gcp-row.mismatch .gcp-row-mark{color:#f0d29a}'
                + '#gckl-count-panel .gcp-decisions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:9px}'
                + '#gckl-count-panel .gcp-decision{border:1px solid rgba(255,255,255,.08);border-radius:9px;background:rgba(255,255,255,.03);padding:7px 9px}'
                + '#gckl-count-panel .gcp-decision label{font-size:9.5px;color:var(--ink-mute,#7aabb8);font-weight:600;display:block;margin-bottom:4px}'
                + '#gckl-count-panel .gcp-decision select{width:100%;padding:5px 8px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.10);color:var(--ink,#dbe6f1);border-radius:6px;font-size:10.5px;font-weight:600;cursor:pointer}'
                + '#gckl-count-panel .gcp-submit{width:100%;padding:8px 12px;border-radius:8px;border:1px solid rgba(92,196,214,.50);background:rgba(92,196,214,.10);color:var(--teal,#5cc4d6);font-weight:800;font-size:11.5px;cursor:pointer;letter-spacing:.02em;transition:all .15s}'
                + '#gckl-count-panel .gcp-submit:hover{background:rgba(92,196,214,.20);border-color:rgba(92,196,214,.80);color:#a0e6f0}'
                + '#gckl-count-panel .gcp-submit.done{background:rgba(76,184,138,.18);border-color:rgba(76,184,138,.70);color:#a0f0c4}'
                + '#gckl-count-panel .gcp-feedback{font-size:10.5px;margin-top:7px;padding:7px 9px;border-radius:7px;line-height:1.4;display:none}'
                + '#gckl-count-panel .gcp-feedback.visible{display:block}'
                + '#gckl-count-panel .gcp-feedback.ok{background:rgba(76,184,138,.10);color:#a0f0c4;border:1px solid rgba(76,184,138,.30)}'
                + '#gckl-count-panel .gcp-feedback.partial{background:rgba(224,165,88,.10);color:#f0d29a;border:1px solid rgba(224,165,88,.30)}';
                document.head.appendChild(st);
            }

            const data = gcklCaseCountData(App.currentPatient);
            const ev = gcklEvaluateCount(data);
            gcklEnsureLearningState();
            const a = App.gckl.countAnswers || {};

            // Bildirilen değerler — başlangıçta 0; öğrenci kendisi girer.
            // (m0147: beklenen değer ipucu kaldırıldı, başlangıç değeri 0)
            const reportedInst = a.reportedInstruments ?? 0;
            const reportedSp   = a.reportedSponges     ?? 0;
            const reportedNd   = a.reportedNeedles     ?? 0;
            const matchInst = Number(reportedInst) === ev.expected.instruments;
            const matchSp   = Number(reportedSp)   === ev.expected.sponges;
            const matchNd   = Number(reportedNd)   === ev.expected.needles;
            const allMatch = matchInst && matchSp && matchNd;
            const submitted = !!App.gckl.countSubmitted;

            const statusHtml = submitted
                ? (allMatch ? '<span class="gcp-status done">✓ Sayım onaylandı</span>' : '<span class="gcp-status warn">⚠ Uyuşmazlık</span>')
                : (ev.hasDiscrepancy ? '<span class="gcp-status warn">Uyuşmazlık var</span>' : '<span class="gcp-status ok">Beklenen sayım hazır</span>');

            const stepperRow = (key, name, expected, reported, matched) =>
                '<div class="gcp-row ' + (submitted ? (matched ? 'match' : 'mismatch') : '') + '" data-key="' + key + '">'
                + '<div class="gcp-row-head">'
                +   '<span class="gcp-row-name">' + name + '</span>'
                + '</div>'
                + '<div class="gcp-stepper">'
                +   '<button type="button" class="gcp-step-btn" data-step="dec" data-target="' + key + '" aria-label="Azalt">−</button>'
                +   '<input class="gcp-step-input" type="number" min="0" value="' + reported + '" data-target="' + key + '" aria-label="' + name + ' bildirilen sayı">'
                +   '<button type="button" class="gcp-step-btn" data-step="inc" data-target="' + key + '" aria-label="Artır">+</button>'
                + '</div>'
                + (submitted ? '<div class="gcp-row-mark">' + (matched ? '✓ Doğru' : '✗ Yanlış (' + reported + ')') + '</div>' : '')
                + '</div>';

            const panel = document.createElement('div');
            panel.id = 'gckl-count-panel';

            // Açılış sayımı (read-only) — öğrenciye baseline göster
            const baselineHtml =
                '<div class="gcp-baseline">'
                + '<div class="gcp-baseline-title">Açılış sayımı (Scrub + Sirküle çift)</div>'
                + '<div class="gcp-baseline-grid">'
                +   '<div class="gcp-baseline-cell"><span class="lbl">Alet</span><span class="val">' + data.initial.instruments + '</span></div>'
                +   '<div class="gcp-baseline-cell"><span class="lbl">Spanç</span><span class="val">' + data.initial.sponges + '</span></div>'
                +   '<div class="gcp-baseline-cell"><span class="lbl">İğne</span><span class="val">' + data.initial.needles + '</span></div>'
                + '</div></div>';

            // Cerrahi sırasında eklenen (varsa)
            const ai = data.addedDuringSurgery?.instruments || 0;
            const as = data.addedDuringSurgery?.sponges || 0;
            const an = data.addedDuringSurgery?.needles || 0;
            const hasAdded = ai > 0 || as > 0 || an > 0;
            const addedHtml = hasAdded
                ? '<div class="gcp-baseline added">'
                + '<div class="gcp-baseline-title">Cerrahi sırasında eklenen</div>'
                + '<div class="gcp-baseline-grid">'
                +   '<div class="gcp-baseline-cell"><span class="lbl">Alet</span><span class="val">+' + ai + '</span></div>'
                +   '<div class="gcp-baseline-cell"><span class="lbl">Spanç</span><span class="val">+' + as + '</span></div>'
                +   '<div class="gcp-baseline-cell"><span class="lbl">İğne</span><span class="val">+' + an + '</span></div>'
                + '</div></div>'
                : '';

            panel.innerHTML =
                '<div class="gcp-head">'
                + '<div>'
                +   '<div class="gcp-title">Sayım Güvenliği Panosu</div>'
                +   '<div class="gcp-sub">Açılış + ek malzeme = beklenen kapanış sayımı (AORN)</div>'
                + '</div>'
                + statusHtml
                + '</div>'
                + baselineHtml
                + addedHtml
                + '<div class="gcp-prompt">Kapanış sayımını gir — açılış ' + (hasAdded ? '+ ek malzeme ' : '') + 'toplamıyla uyumlu olmalı.</div>'
                + '<div class="gcp-grid">'
                +   stepperRow('inst', 'Alet',  ev.expected.instruments, reportedInst, matchInst)
                +   stepperRow('sp',   'Spanç', ev.expected.sponges,     reportedSp,   matchSp)
                +   stepperRow('nd',   'İğne',  ev.expected.needles,     reportedNd,   matchNd)
                + '</div>'
                + '<div class="gcp-decisions">'
                +   '<div class="gcp-decision">'
                +     '<label>Sayım sonucu</label>'
                +     '<select id="gckl-count-status">'
                +       '<option value="">Seçiniz</option>'
                +       '<option value="aligned">Uyumlu</option>'
                +       '<option value="discrepancy">Uyuşmazlık var</option>'
                +       '<option value="na">Uygulanmaz</option>'
                +     '</select>'
                +   '</div>'
                +   '<div class="gcp-decision">'
                +     '<label>Uyuşmazlık varsa güvenli yaklaşım</label>'
                +     '<select id="gckl-count-action">'
                +       '<option value="">Seçiniz</option>'
                +       '<option value="stop_recount_search">Tekrar sayım + alan/atık kontrolü</option>'
                +       '<option value="radiology_if_unresolved">Çözülmezse görüntüleme</option>'
                +     '</select>'
                +   '</div>'
                + '</div>'
                + '<button class="gcp-submit ' + (submitted && allMatch ? 'done' : '') + '" id="gckl-submit-count">'
                +   (submitted ? (allMatch ? '✓ Sayım kaydedildi · Tekrar gönder' : 'Tekrar gönder') : 'Sayımı doğrula ve kaydet')
                + '</button>'
                + '<div id="gckl-count-feedback" class="gcp-feedback ' + (submitted ? 'visible ' + (allMatch ? 'ok' : 'partial') : '') + '">'
                +   (submitted ? (allMatch
                        ? 'Sayım doğrulandı. GCKL-27 Kod 2 için gerekli sayım kanıtı tamamlandı.'
                        : 'Beklenen final sayıları ve uyuşmazlık kararını tekrar kontrol edin.') : '')
                + '</div>';

            advance.parentNode.insertBefore(panel, advance);
            panel.querySelector('#gckl-count-status').value = a.status || '';
            panel.querySelector('#gckl-count-action').value = a.safeAction || '';

            // Stepper butonları
            panel.querySelectorAll('.gcp-step-btn').forEach(btn => {
                btn.onclick = () => {
                    const target = btn.dataset.target;
                    const input = panel.querySelector('.gcp-step-input[data-target="' + target + '"]');
                    if (!input) return;
                    const cur = parseInt(input.value, 10) || 0;
                    input.value = btn.dataset.step === 'inc' ? cur + 1 : Math.max(0, cur - 1);
                };
            });

            // Submit
            panel.querySelector('#gckl-submit-count').onclick = () => {
                const reportedI = parseInt(panel.querySelector('.gcp-step-input[data-target="inst"]').value, 10) || 0;
                const reportedS = parseInt(panel.querySelector('.gcp-step-input[data-target="sp"]').value, 10)   || 0;
                const reportedN = parseInt(panel.querySelector('.gcp-step-input[data-target="nd"]').value, 10)   || 0;

                App.gckl.countAnswers = {
                    initialSponges: data.initial.sponges,
                    initialNeedles: data.initial.needles,
                    expectedInstruments: ev.expected.instruments,
                    expectedSponges:     ev.expected.sponges,
                    expectedNeedles:     ev.expected.needles,
                    reportedInstruments: reportedI,
                    reportedSponges:     reportedS,
                    reportedNeedles:     reportedN,
                    status:     panel.querySelector('#gckl-count-status').value,
                    safeAction: panel.querySelector('#gckl-count-action').value
                };
                App.gckl.countSubmitted = true;

                // Sayım doğruluk kontrolü
                const matchI = reportedI === ev.expected.instruments;
                const matchS = reportedS === ev.expected.sponges;
                const matchN = reportedN === ev.expected.needles;
                const allMatchNow = matchI && matchS && matchN;

                // m0141: Sayım YANLIŞ ise görev onaylanmasın, ikaz ver.
                if (!allMatchNow) {
                    // m0158: Her yanlış denemeyi say (rapora gidecek).
                    App.gckl.countWrongAttempts = (App.gckl.countWrongAttempts || 0) + 1;

                    // m0143/m0145: Yanlış sayım → -20 puan (kritik: retained foreign object riski).
                    // m0145: Ceza yalnız ilk yanlış denemede uygulanır; tekrar yanlış girilse
                    // bile bir kere düşülür. Doğru girilirse +6 ayrıca eklenir (net -14).
                    if (!App.gckl.countWrongPenaltyApplied) {
                        addScore(['patientSafety','checklistPerformance'], 0, 20);
                        addPhaseScore('intraop', 0, 20);
                        App.gckl.countWrongPenaltyApplied = true;
                    }

                    // Detay: hangi materyal eşleşmiyor
                    const wrong = [];
                    if (!matchI) wrong.push('Alet (' + reportedI + ' ≠ ' + ev.expected.instruments + ')');
                    if (!matchS) wrong.push('Spanç (' + reportedS + ' ≠ ' + ev.expected.sponges + ')');
                    if (!matchN) wrong.push('İğne (' + reportedN + ' ≠ ' + ev.expected.needles + ')');
                    const detail = wrong.join(' · ');
                    const penaltyMsg = App.gckl.countWrongPenaltyApplied && wrong.length > 0
                        ? (App.gckl.countCorrectBonusApplied ? '⚠ Sayım Yanlış (ceza zaten uygulandı)' : '⚠ Sayım Yanlış · −20 puan')
                        : '⚠ Sayım Yanlış';

                    try { if (typeof toast === 'function') toast('error',
                        penaltyMsg,
                        'Bildirilen sayılar beklenenle eşleşmiyor. Ekibi uyarın, tekrar sayım yapın.\n' + detail);
                    } catch(e) {}

                    // Görev tamamlanma listesinden çıkar (eğer önceden eklenmişse)
                    const idx = App.completedTasks.indexOf('gckl_27_count_open');
                    if (idx >= 0) App.completedTasks.splice(idx, 1);

                    updateProgressBar();
                    updateScoreStrip();
                    renderRightPanel();
                    return;
                }

                // Sayım DOĞRU → tam tamamlama
                if (!App.completedTasks.includes('gckl_27_count_open')) {
                    App.completedTasks.push('gckl_27_count_open');
                    try { if (window.NurseKitSM?.shadowComplete) NurseKitSM.shadowComplete('gckl_27_count_open'); } catch(e) {}
                    try { if (typeof pulseMarkerComplete === 'function') pulseMarkerComplete('gckl_27_count_open', null); } catch(e) {}
                    try { if (typeof gcklBoardSyncMarkerState === 'function') gcklBoardSyncMarkerState(); } catch(e) {}
                    try { if (typeof toast === 'function') toast('success',
                        App.gckl.countWrongPenaltyApplied ? '✓ Sayım Düzeltildi · +6 puan' : '✓ Sayım Onaylandı · +6 puan',
                        App.gckl.countWrongPenaltyApplied
                            ? 'Önceki yanlış sayım için −20 puan kırıldı; düzeltme için +6 puan eklendi.'
                            : 'Beklenen ve bildirilen sayılar eşleşiyor.'); } catch(e) {}
                }

                // m0145: Bonus yalnız ilk doğru gönderimde eklenir (spam korunması).
                if (!App.gckl.countCorrectBonusApplied) {
                    addScore(['patientSafety','checklistPerformance','surgicalNursingKnowledge','countingSafety'], 6, 0);
                    addPhaseScore('intraop', 6, 0);
                    App.gckl.countCorrectBonusApplied = true;
                }
                updateProgressBar();
                updateScoreStrip();
                renderRightPanel();
            };
        }

        function askGCKLQuestion(q) {
            gcklEnsureLearningState();
            if (!q || App.gckl.answers[q.id]) return;
            const m = document.getElementById('reason-modal');
            const body = document.getElementById('reason-body');
            if (!m || !body) return;
            document.getElementById('reason-tag').textContent = 'Güvenli Cerrahi Karar Sorusu';
            document.getElementById('reason-title').textContent = q.type === 'true_false' ? 'Doğru/Yanlış Karar Sorusu' : 'Çoktan Seçmeli Karar Sorusu';
            body.innerHTML = '';
            if (q.context) body.appendChild(el('div', 'reason-rationale', `<b>Vaka bilgisi.</b> ${q.context}`));
            body.appendChild(el('div', 'reason-q', q.question));
            const opts = el('div', 'reason-opts');
            Object.keys(q.options).forEach(letter => {
                const b = el('button', 'reason-opt');
                b.innerHTML = `<span class="ix">${letter}</span><span>${q.options[letter]}</span>`;
                b.onclick = () => {
                    const correct = letter === q.correctOption;
                    const qMax = Number(q.score || (q.type === 'true_false' ? 3 : 4));
                    const qEarned = correct ? qMax : 0;
                    App.gckl.answers[q.id] = {
                        id:q.id, type:q.type || 'multiple_choice', linkedChecklistItem:q.linkedChecklistItem, question:q.question,
                        selectedOption: letter, selectedText:q.options[letter], correctOption:q.correctOption, correctText:q.options[q.correctOption],
                        correct, explanation:q.explanation, score:qEarned, maxScore:qMax
                    };
                    addScore(['clinicalReasoning','checklistPerformance','surgicalNursingKnowledge'], qEarned, qMax);
                    addPhaseScore(gcklPhaseForItem(q.linkedChecklistItem), qEarned, qMax);
                    App.feedbackEntries.push({ ok: correct, label: q.question, kind: q.type === 'true_false' ? 'gckl_true_false' : 'gckl_multiple_choice', guideline: 'who_ssc', phase: gcklPhaseForItem(q.linkedChecklistItem), detail: q.explanation });
                    recordAction('gckl-question-answer', { qid:q.id, type:q.type || 'multiple_choice', linkedChecklistItem:q.linkedChecklistItem, selected:letter, correct, score:qEarned, max:qMax });
                    opts.querySelectorAll('button').forEach(btn => btn.disabled = true);
                    if (App.mode === 'tutor') {
                        b.classList.add(correct ? 'correct' : 'wrong');
                        const correctBtn = Array.from(opts.querySelectorAll('button')).find(btn => btn.querySelector('.ix').textContent === q.correctOption);
                        if (correctBtn) correctBtn.classList.add('correct');
                        body.appendChild(el('div', 'reason-rationale', `<b>${correct ? 'Doğru.' : 'Yanlış.'}</b> ${q.explanation}`));
                    } else {
                        body.appendChild(el('div', 'reason-rationale', '<b>Yanıt kaydedildi.</b> Açıklama raporda gösterilecektir.'));
                    }
                    const closeBtn = el('button', 'rd-action', 'Devam');
                    closeBtn.style.marginTop = '14px';
                    closeBtn.onclick = () => { m.classList.remove('visible'); try { syncGCKLPatientSafetyScore(); } catch(e) {} renderRightPanel(); updateScoreStrip(); };
                    body.appendChild(closeBtn);
                };
                opts.appendChild(b);
            });
            body.appendChild(opts);
            m.classList.add('visible');
        }
        function maybeAskGCKLQuestionForTask(task) {
            if (!task || !task.gcklItem) return;
            const qs = gcklQuestionsForItem(task.gcklItem).filter(q => !App.gckl.answers || !App.gckl.answers[q.id]);
            if (!qs.length) return;
            // Faz içinde ilk tamamlanan ilişkili görevden sonra bir soru sorulur; her madde için yinelenmez.
            askGCKLQuestion(qs[0]);
        }


        /* ============================================================
           GCKL DİYALOG–GÖREV–SEMPTOM–TANI KANIT ENTEGRASYONU
           Çoktan seçmeli ve doğru/yanlış sorular puanlamaya dahildir.
           ============================================================ */
        const GCKL_DIALOGUE_BRIDGES = {
            q_id: {
                label: 'Hastaya ad-soyad ve doğum tarihi/MRN bilgisini sorma',
                linkedItems: ['GCKL-1','GCKL-10'],
                markTasks: ['gckl_1_identity_verify','gckl_10_patient_verify'],
                feedback: 'Kimlik doğrulama için hasta beyanı kanıt oluşturdu. Tam güvenlik için bileklik, dosya ve ameliyat listesiyle de karşılaştırılmalıdır.'
            },
            q_proc: {
                label: 'Planlanan ameliyatı hastadan doğrulama',
                linkedItems: ['GCKL-1','GCKL-10','GCKL-18'],
                markTasks: ['gckl_10_patient_verify'],
                feedback: 'Ameliyatın hastadan doğrulanması güvenli cerrahi için kısmi kanıttır; dosya/liste ve ekip doğrulamasıyla tamamlanmalıdır.'
            },
            q_site: {
                label: 'Ameliyat bölgesi/tarafını hastadan doğrulama',
                linkedItems: ['GCKL-1','GCKL-10','GCKL-11','GCKL-18'],
                markTasks: ['gckl_1_identity_verify','gckl_10_patient_verify'],
                feedback: 'Ameliyat bölgesi/taraf sorgulandı. Kod 2 için taraf işaretlemesi ve ekip doğrulaması da gerekir.'
            },
            q_consent: {
                label: 'Ameliyat rızasını/onamını hastadan teyit etme',
                linkedItems: ['GCKL-2','GCKL-10'],
                markTasks: ['gckl_2_consent_verify','gckl_10_patient_verify'],
                feedback: 'Hasta rızası sözlü teyit edildi. Tam güvenlik için onam formu dosyada da kontrol edilmelidir.'
            },
            q_fasting: {
                label: 'Açlık/NPO durumunu sorgulama',
                linkedItems: ['GCKL-3'],
                markTasks: ['gckl_3_npo_check'],
                feedback: 'Açlık/NPO hasta beyanı alındı. Kod 2 için kayıtla karşılaştırma ve uygunsuzluk varsa bildirim gerekir.'
            },
            q_allergy: {
                label: 'Alerji bilgisini hastadan sorgulama',
                linkedItems: ['GCKL-14'],
                markTasks: ['gckl_14_allergy_check'],
                feedback: 'Alerji hastadan sorgulandı. Kod 2 için dosya ve bileklik/uyarı üzerinden doğrulama gerekir.'
            },
            q_prosthesis: {
                label: 'Makyaj/oje, protez, lens, takı ve değerli eşya sorgulama',
                linkedItems: ['GCKL-5'],
                markTasks: ['gckl_5_remove_items','gckl_5_valuables_handover'],
                feedback: 'Protez/takı/değerli eşya sorgusu GCKL-5 için kanıt oluşturdu.'
            },
            q_valuables: {
                label: 'Oje, makyaj ve değerli eşya güvenliğini sorgulama',
                linkedItems: ['GCKL-5'],
                markTasks: ['gckl_5_remove_items','gckl_5_valuables_handover'],
                feedback: 'Oje/makyaj/değerli eşya sorgusu GCKL-5 için kanıt oluşturdu.'
            },
            q_anticoag: {
                label: 'Antikoagülan/antiagregan kullanımını sorgulama',
                linkedItems: ['GCKL-24','GCKL-16'],
                markTasks: ['gckl_24_anticoag_check'],
                feedback: 'Kan sulandırıcı ilaç sorgusu kanama riski ve antikoagülan güvenliği için kanıt oluşturdu.'
            },
            q_bleeding: {
                label: 'Kanama öyküsü veya kan kaybı riskini sorgulama',
                linkedItems: ['GCKL-16','GCKL-24'],
                markTasks: ['gckl_16_bleeding_assess','gckl_24_anticoag_check'],
                feedback: 'Kanama riski sorgulandı; damar yolu ve sıvı/kan planı kontrolüyle tamamlanmalıdır.'
            },
            q_diabetes: {
                label: 'Diyabet/kan şekeri kontrolü gereksinimini sorgulama',
                linkedItems: ['GCKL-23'],
                markTasks: ['gckl_23_glucose_need'],
                feedback: 'Diyabet/kan şekeri gereksinimi sorgusu GCKL-23 için kanıt oluşturdu.'
            },
            q_postop_destination: {
                label: 'Ameliyat sonrası gideceği bölüm/teslim planını doğrulama',
                linkedItems: ['GCKL-30'],
                markTasks: ['gckl_30_destination_confirm'],
                feedback: 'Ameliyat sonrası gideceği bölüm sorgusu güvenli teslim planı için kanıt oluşturdu.'
            },
            q_wristband_confirm: {
                label: 'Bileklik bilgilerini hasta ile birlikte doğrulama',
                linkedItems: ['GCKL-1','GCKL-10','GCKL-14'],
                markTasks: ['gckl_1_identity_verify','gckl_10_patient_verify'],
                feedback: 'Bileklik doğrulaması kimlik ve alerji güvenliği için güçlü kanıttır.'
            },
            q_site_mark: {
                label: 'Cerrahi taraf/alan işaretlemesini kontrol etme',
                linkedItems: ['GCKL-11','GCKL-18'],
                markTasks: ['gckl_11_site_marking'],
                feedback: 'Taraf/alan işaretlemesi kontrol edildi; eksiklik varsa işlem durdurulmalıdır.'
            },
            q_timeout_confirm: {
                label: 'Time Out sırasında kimlik, ameliyat ve bölgeyi sesli doğrulama',
                linkedItems: ['GCKL-17','GCKL-18','GCKL-19'],
                // GCKL kanıtı + vakaya özgü görünür Time-out görevleri birlikte işaretlenir.
                markTasks: ['gckl_17_team_pause','gckl_18_verbal_verify','ti_timeout','oti2_to','lti_to','t_timeout','oti_timeout','ltp_timeout','vag_timeout','rad_timeout','ose_timeout'],
                feedback: 'Time Out sesli doğrulama kanıtı oluştu.'
            },
            q_critical_events: {
                label: 'Kritik olayları ekip içinde gözden geçirme',
                linkedItems: ['GCKL-19','GCKL-16','GCKL-24','GCKL-25'],
                markTasks: ['gckl_19_surgeon_review','gckl_19_surgeon_review','gckl_19_surgeon_review','gckl_19_anesthesia_review','gckl_19_surgeon_review'],
                feedback: 'Kritik olayların ekipçe gözden geçirilmesi GCKL-19 için güçlü kanıttır.'
            },
            q_antibiotic_timing: {
                label: 'Profilaktik antibiyotik zamanlamasını sorgulama',
                linkedItems: ['GCKL-20'],
                markTasks: ['gckl_20_abx_verify','gckl_20_abx_verify','gckl_20_abx_verify'],
                feedback: 'Profilaksi zamanlaması ve alerji uyumu sorgulandı; bu güvenli cerrahinin kritik parçasıdır.'
            },
            q_signout_confirm: {
                label: 'Sign Out sırasında hasta, ameliyat ve bölgeyi sözlü doğrulama',
                linkedItems: ['GCKL-26'],
                markTasks: ['gckl_26_signout_verbal'],
                feedback: 'Sign Out sözlü doğrulama kanıtı oluştu.'
            },
            q_count_verbal: {
                label: 'Alet, spanç/kompres ve iğne sayımını ekip ile sözlü doğrulama',
                linkedItems: ['GCKL-27'],
                markTasks: ['gckl_27_count_open','gckl_27_count_close','gckl_27_count_close','gckl_27_count_close'],
                feedback: 'Sayım sözlü doğrulandı; Kod 2 için sayım panosundaki sayısal doğrulama da tamamlanmalıdır.'
            },
            q_specimen_label: {
                label: 'Numune etiketi üzerinde hasta adı ve alınan bölgeyi doğrulama',
                linkedItems: ['GCKL-28'],
                markTasks: ['gckl_28_specimen_verify','gckl_28_specimen_verify'],
                feedback: 'Numune etiketi doğrulama kanıtı oluştu.'
            },
            q_postop_recommendations: {
                label: 'Cerrah ve anestezistin postoperatif önerilerini alma',
                linkedItems: ['GCKL-29','GCKL-30'],
                markTasks: ['gckl_29_handover','gckl_29_handover','gckl_29_handover'],
                feedback: 'Postoperatif öneriler güvenli teslim için kanıt oluşturdu.'
            }
        };

        function addGCKLEvidence(itemId, evidence) {
            gcklEnsureLearningState();
            if (!App.gckl.itemEvidence[itemId]) App.gckl.itemEvidence[itemId] = [];
            const key = `${evidence.source || 'unknown'}|${evidence.id || evidence.dialogueId || evidence.taskId || evidence.label}`;
            if (!App.gckl.itemEvidence[itemId].some(e => `${e.source || 'unknown'}|${e.id || e.dialogueId || e.taskId || e.label}` === key)) {
                App.gckl.itemEvidence[itemId].push({ ...evidence, ts: Date.now() });
            }
        }

        function completeGCKLTaskFromEvidence(taskId) {
            if (!taskId) return;
            if (!Array.isArray(App.completedTasks)) App.completedTasks = [];
            if (!App.completedTasks.includes(taskId)) {
                App.completedTasks.push(taskId);
                // İP-4: State machine'e de yansıt
                try { NurseKitSM.shadowComplete(taskId, null); } catch(e) {}
                // İP-4: UI senkron — render zincirini tetikle
                try { if (typeof renderRightPanel === 'function') renderRightPanel(); } catch(e) {}
                try { if (typeof updateProgressBar === 'function') updateProgressBar(); } catch(e) {}
                try { if (typeof updateScoreStrip === 'function') updateScoreStrip(); } catch(e) {}
                try { if (typeof gcklBoardSyncMarkerState === 'function') gcklBoardSyncMarkerState(); } catch(e) {}
            }
        }

        function recordGCKLDialogueEvidence(dialogueId) {
            const bridge = GCKL_DIALOGUE_BRIDGES[dialogueId];
            if (!bridge) return;
            gcklEnsureLearningState();
            if (App.gckl.dialogueEvidence[dialogueId]) return;
            App.gckl.dialogueEvidence[dialogueId] = { id: dialogueId, label: bridge.label, linkedItems: bridge.linkedItems.slice(), ts: Date.now() };
            (bridge.markTasks || []).forEach(completeGCKLTaskFromEvidence);
            bridge.linkedItems.forEach(itemId => {
                addGCKLEvidence(itemId, { source: 'dialogue', id: dialogueId, dialogueId, label: bridge.label });
            });
            if (App.mode === 'tutor' && bridge.feedback) toast('info', 'GCKL konuşma kanıtı', bridge.feedback);
            try { syncGCKLPatientSafetyScore(); updateScoreStrip(); renderRightPanel(); } catch(e) {}
        }

        function recordGCKLSymptomEvidence(phase) {
            gcklEnsureLearningState();
            const selected = (App.selectedSymptoms && App.selectedSymptoms[phase]) || [];
            const add = (ids, label) => ids.forEach(id => addGCKLEvidence(id, { source:'symptom', id:`symptom-${phase}-${label}`, label:`Semptom/bulgu: ${label}` }));
            selected.forEach(s0 => {
                const s = String(s0).toLowerCase();
                if (/alerji/.test(s)) add(['GCKL-14'], s0);
                if (/npo|aç|ac|bulant|kus|aspirasyon/.test(s)) add(['GCKL-3','GCKL-12'], s0);
                if (/kanama|hb|hipotansiyon|dren|taşikardi|antikoag/.test(s)) add(['GCKL-8','GCKL-16','GCKL-24'], s0);
                if (/diyabet|glukoz|kan şekeri|hiperglis/.test(s)) add(['GCKL-23'], s0);
                if (/dvt|immobil|obez|tromboz/.test(s)) add(['GCKL-25'], s0);
                if (/steril|asepsi|kontamin/.test(s)) add(['GCKL-22'], s0);
                if (/sayım|spanç|spanc|kompres|iğne|igne|alet/.test(s)) add(['GCKL-27'], s0);
                if (/pozisyon|basınç|nörovasküler|norovaskuler/.test(s)) add(['GCKL-19','GCKL-25'], s0);
            });
        }

        function recordGCKLDiagnosisEvidence(phase) {
            gcklEnsureLearningState();
            const patientPhase = App.currentPatient && App.currentPatient[phase];
            const selectedIds = (App.selectedDiagnoses && App.selectedDiagnoses[phase]) || [];
            const add = (ids, label) => ids.forEach(id => addGCKLEvidence(id, { source:'diagnosis', id:`diagnosis-${phase}-${label}`, label:`Hemşirelik tanısı: ${label}` }));
            selectedIds.forEach(id => {
                const d = patientPhase?.diagnoses?.find(x => x.id === id);
                if (!d) return;
                const title = String(d.title || '').toLowerCase();
                if (/aspirasyon/.test(title)) add(['GCKL-3','GCKL-12','GCKL-13'], d.title);
                if (/enfeksiyon/.test(title)) add(['GCKL-20','GCKL-22','GCKL-28'], d.title);
                if (/kanama/.test(title)) add(['GCKL-8','GCKL-16','GCKL-24'], d.title);
                if (/dvt|tromboz/.test(title)) add(['GCKL-25'], d.title);
                if (/ağrı|agri/.test(title)) add(['GCKL-29'], d.title);
                if (/anksiyete|kaygı|kaygi/.test(title)) add(['GCKL-1','GCKL-2'], d.title);
                if (/hipotermi/.test(title)) add(['GCKL-19'], d.title);
            });
        }

        function gcklEvidenceForItem(itemId) {
            gcklEnsureLearningState();
            return App.gckl.itemEvidence[itemId] || [];
        }

        function gcklMissingEvidenceForItem(itemId) {
            const rc = gcklRequiredCompleted(itemId);
            return rc.missing.map(id => {
                const def = (GCKL_TASK_DEFS[itemId] || []).find(x => x[0] === id);
                return def ? def[1] : id;
            });
        }

        // Güvenli cerrahi karar soruları eğitim akışında açıktır.
        // Klasik/açık uçlu sorular devre dışıdır; çoktan seçmeli ve doğru/yanlış soruları puanlamaya dahildir.
        // Not: gcklQuestionCorrectForItem (line ~17052'de) korundu — knowledge metrics için kullanılır.

        function maybeAskGCKLQuestionForTask(task) { return; }

        // Genel klinik akıl yürütme MCQ modalı korunur; klasik gerekçe modalı kullanılmaz.

        // GCKL kodları tüm kanıt havuzundan üretilir: görev + konuşma + semptom + tanı + sayım.
        function gcklCodeForItem(itemId) {
            if (itemId === 'GCKL-27') {
                const ce = gcklCountEvaluationForStudent();
                const taskEvidence = (App.completedTasks||[]).some(id => gcklTaskIdsForItem(itemId).includes(id));
                const ev = gcklEvidenceForItem(itemId);
                if (ce.allCorrect) return 2;
                if (ce.any || taskEvidence || ev.length) return 1;
                return 0;
            }
            const rc = gcklRequiredCompleted(itemId);
            const ev = gcklEvidenceForItem(itemId);
            const any = rc.completed.length > 0 || ev.length > 0;
            if (!any) return 0;
            if (rc.required.length && rc.completed.length >= rc.required.length) return 2;
            return 1;
        }

        function renderGCKLEvidenceSummaryReport() {
            const box = document.getElementById('rd-osce-rationales');
            if (!box) return;
            const groups = GCKL_ITEMS.map(item => {
                const ev = gcklEvidenceForItem(item.id);
                const missing = gcklMissingEvidenceForItem(item.id);
                const code = gcklCodeForItem(item.id);
                return { item, ev, missing, code };
            }).filter(x => x.ev.length || x.code > 0 || x.item.id === 'GCKL-27');
            let html = `<div class="rd-section"><h3>Güvenli Cerrahi Kanıt Özeti</h3>`;
            html += `<p style="font-size:12px;color:#5b7896;margin-bottom:8px">Bu bölüm görev, konuşma, semptom/bulgu, hemşirelik tanısı, sayım panosu, çoktan seçmeli ve doğru/yanlış sorularından gelen kanıtları gösterir.</p>`;
            if (!groups.length) html += '<p style="font-size:12px;color:#5b7896">Henüz GCKL kanıtı oluşmadı.</p>';
            else {
                html += '<ul class="rd-list">';
                groups.forEach(({item, ev, missing, code}) => {
                    const evidenceText = ev.length ? ev.map(e => `${e.source}: ${e.label}`).join(' · ') : 'Doğrudan kanıt yok';
                    const missingText = missing.length ? `<br><span style="font-size:12px;color:#8a5a00">Eksik: ${missing.slice(0,4).join(' · ')}${missing.length>4?' ...':''}</span>` : '';
                    html += `<li class="${gcklClassForCode(code)}"><b>${item.id} ${item.text}</b> — Kod: ${code}<br><span style="font-size:12px;color:#5b7896">Kanıt: ${evidenceText}</span>${missingText}</li>`;
                });
                html += '</ul>';
            }
            html += '</div>';
            box.innerHTML = html;
        }


        function gcklPhaseComplianceSummary() {
            const phaseMap = {
                preop:  GCKL_ITEMS.filter(i => Number(i.id.split('-')[1]) >= 1  && Number(i.id.split('-')[1]) <= 16),
                intraop:GCKL_ITEMS.filter(i => Number(i.id.split('-')[1]) >= 17 && Number(i.id.split('-')[1]) <= 25),
                postop: GCKL_ITEMS.filter(i => Number(i.id.split('-')[1]) >= 26 && Number(i.id.split('-')[1]) <= 30)
            };
            const calc = arr => {
                const earned = arr.reduce((t,i)=>t+gcklCodeForItem(i.id),0);
                const max = arr.length * 2;
                return { earned, max, pct: max ? Math.round((earned/max)*100) : 0, count: arr.length };
            };
            return { preop: calc(phaseMap.preop), intraop: calc(phaseMap.intraop), postop: calc(phaseMap.postop) };
        }

        function renderGCKLComplianceReport() {
            const box = document.getElementById('rd-osce-items');
            if (!box) return;
            const sum = gcklComplianceSummary();
            const ps = gcklPhaseComplianceSummary();
            const card = (title, obj) => `<div style="background:#ebe7d8;border:1px solid #d4ccb6;border-radius:6px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:700;font-family:var(--font-mono)">%${obj.pct}</div><div style="font-size:11px;color:#5b7896;text-transform:uppercase;letter-spacing:.4px">${title}</div><div style="font-size:11px;color:#5b7896">${obj.earned}/${obj.max} kod puanı</div></div>`;
            let html = `<div class="rd-section"><h3>Güvenli Cerrahi Kontrol Listesi Uyum Durumu</h3>
                <div class="rd-narrative" style="background:#ebe7d8;border-left-color:#1c2a3d;margin-top:8px">
                    <b>Genel uyum:</b> %${sum.pct} &nbsp; · &nbsp; <b>Tam:</b> ${sum.c2} madde &nbsp; · &nbsp; <b>Kısmi:</b> ${sum.c1} madde &nbsp; · &nbsp; <b>Yapılmayan/Yanlış:</b> ${sum.c0} madde<br>
                    <span style="font-size:11px;color:#5b7896">Hesaplama: ${sum.totalCode}/${sum.maxCode} kod puanı. Kod 0 = yapılmadı/yanlış, Kod 1 = kısmen yapıldı, Kod 2 = tam yapıldı.</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px">
                    ${card('Preoperatif', ps.preop)}
                    ${card('İntraoperatif', ps.intraop)}
                    ${card('Postoperatif', ps.postop)}
                    ${card('Genel', {earned:sum.totalCode,max:sum.maxCode,pct:sum.pct})}
                </div>`;
            if (sum.criticalMissing.length) html += `<ul class="rd-list" style="margin-top:8px">${sum.criticalMissing.map(x=>`<li class="miss">Kritik eksik: ${x}</li>`).join('')}</ul>`;
            ['I','II','III','IV'].forEach(ph => {
                html += `<h3 style="margin-top:18px">${GCKL_SECTION_TITLES[ph]}</h3><ul class="rd-list">`;
                GCKL_ITEMS.filter(i => i.phase === ph).forEach(item => {
                    const code = gcklCodeForItem(item.id);
                    const no = item.id.split('-')[1];
                    html += `<li class="${gcklClassForCode(code)}"><b>${no}. ${item.text}</b> — <span style="font-family:var(--font-mono);font-weight:700">Kod: ${code}</span> <span style="color:#5b7896">(${gcklLabelForCode(code)})</span></li>`;
                });
                html += '</ul>';
            });
            html += '</div>';
            box.innerHTML = html;
        }

        // Eski rapor fonksiyon adını koru; içerik artık kanıt özetidir.
        renderGCKLQuestionReport = renderGCKLEvidenceSummaryReport;

        // Diyalog soru havuzunu GCKL ile tamamla; mevcutleri silme.
        (function extendDialogueQuestionsForGCKL(){
            const addQ = (group, id, label) => {
                if (!DIALOG_QUESTIONS.some(q => q.id === id)) DIALOG_QUESTIONS.push({ group, id, label });
            };
            addQ('Kimlik ve güvenlik', 'q_site', 'Ameliyatınız hangi bölgeden veya taraftan yapılacak?');
            addQ('Kimlik ve güvenlik', 'q_consent', 'Ameliyata yönelik onam verdiniz mi?');
            addQ('Kimlik ve güvenlik', 'q_wristband_confirm', 'Bilekliğinizdeki bilgileri birlikte doğrulayabilir miyiz?');
            addQ('Kimlik ve güvenlik', 'q_site_mark', 'Ameliyat bölgesi işaretlemesini kontrol edebilir miyim?');
            addQ('Ameliyat Hazırlığı', 'q_valuables', 'Ojeniz, makyajınız, lensiniz veya değerli eşyanız var mı?');
            addQ('Alerji ve ilaçlar', 'q_anticoag', 'Kan sulandırıcı veya antiagregan ilaç kullanıyor musunuz?');
            addQ('Alerji ve ilaçlar', 'q_bleeding', 'Daha önce kanama sorunu yaşadınız mı?');
            addQ('Alerji ve ilaçlar', 'q_diabetes', 'Diyabetiniz veya kan şekeri takip gereksiniminiz var mı?');
            // m0192: 5 yeni klinik soru
            addQ('Anestezi öyküsü', 'q_anesthesia_history', 'Daha önce anestezi aldınız mı? Herhangi bir sorun yaşadınız mı?');
            addQ('Yaşam tarzı', 'q_smoking_alcohol', 'Sigara veya alkol kullanıyor musunuz?');
            addQ('Postop değerlendirme', 'q_nausea', 'Şu anda bulantı veya kusmanız var mı?');
            addQ('Postop değerlendirme', 'q_breathing', 'Nefes alışınız rahat mı? Göğsünüzde sıkışma var mı?');
            addQ('Postop değerlendirme', 'q_urinary', 'Ameliyattan sonra idrar yaptınız mı? Sondanız varsa idrar çıkışı nasıl?');
            addQ('Time Out ve ekip güvenliği', 'q_timeout_confirm', 'Ekip olarak hastanın kimliğini, ameliyatını ve ameliyat bölgesini sesli doğrulayalım.');
            addQ('Time Out ve ekip güvenliği', 'q_critical_events', 'Beklenen kan kaybı, ameliyat süresi, anestezi riskleri ve pozisyonla ilgili kritik noktaları gözden geçirelim.');
            addQ('Time Out ve ekip güvenliği', 'q_antibiotic_timing', 'Profilaksi son 60 dakika içinde ve alerji bilgisiyle uyumlu uygulandı mı?');
            addQ('Sign Out ve teslim', 'q_signout_confirm', 'Yapılan ameliyatı, ameliyat bölgesini ve hastayı sözlü olarak doğrulayalım.');
            addQ('Sign Out ve teslim', 'q_count_verbal', 'Alet, spanç/kompres ve iğne sayımını birlikte doğrulayalım.');
            addQ('Sign Out ve teslim', 'q_specimen_label', 'Numune etiketi üzerinde hasta adı ve alınan bölge doğru mu?');
            addQ('Sign Out ve teslim', 'q_postop_recommendations', 'Cerrah ve anestezistin postoperatif önerileri nelerdir?');
            addQ('Sign Out ve teslim', 'q_postop_destination', 'Hasta PACU, servis veya yoğun bakımın hangisine devredilecek?');
        })();

        const GCKL_DIALOGUE_RESPONSE_MAP = {
            // m0192: Hasta-bazlı zenginleştirilmiş cevaplar
            q_site: p => {
                const surg = String(p.surgery || '');
                return `${surg} için belirtilen bölgeden ameliyat olacağım; dosyamda ve listede de böyle yazıyor olmalı. İşaretlemeyi de gördüm.`;
            },
            q_consent: p => 'Evet, ameliyat için onam verdim ve formu imzaladım. Hekim her şeyi açıkladıktan sonra imzaladığımı hatırlıyorum.',
            q_wristband_confirm: p => `Bilekliğimde adım ${p.name || ''}; lütfen dosya ve listeyle karşılaştırın. Bilekliğim sağ kolumda.`,
            q_site_mark: p => {
                const hist = String(p.history || '').toLowerCase();
                const surgery = String(p.surgery || '').toLowerCase();
                if (/sağ|right/.test(hist + surgery)) return 'Evet, sağ tarafımda işaretleme var; doktor sabah yaptı.';
                if (/sol|left/.test(hist + surgery)) return 'Evet, sol tarafımda işaretleme var; doktor kontrol etmişti.';
                return 'Evet, ameliyat bölgesi işaretlemesi yapıldı; isterseniz kontrol edebilirsiniz.';
            },
            q_valuables: p => 'Üzerimde değerli eşya kalmadı; yüzüğümü, küpemi çıkardım. Ojem ve kontakt lensim de yok.',
            q_anticoag: p => {
                const hist = String(p.history || '').toLowerCase();
                const surg = String(p.surgery || '').toLowerCase();
                if (hist.includes('warfarin')) return 'Warfarin (Coumadin) kullanıyordum; doktorum 5 gün önce kesmemi söyledi.';
                if (hist.includes('aspirin') || hist.includes('clopidogrel') || /bypass|cabg|koroner/.test(surg))
                    return 'Aspirin kullanıyordum; ameliyat öncesi nasıl yöneteceğimi doktorum söyledi.';
                if (hist.includes('antikoag') || hist.includes('agreg')) return 'Kan sulandırıcı kullanıyorum; planı doktor verdi.';
                return 'Kan sulandırıcı kullanmıyorum, bildiğim kadarıyla yok.';
            },
            q_bleeding: p => {
                const hist = String(p.history || '').toLowerCase();
                if (hist.includes('kanama') || hist.includes('hemofili')) return 'Evet, daha önce kanama sorunu yaşadım; bunu doktora söyledim.';
                if (hist.includes('aspirin') || hist.includes('warfarin')) return 'Belirgin kanama sorunu yaşamadım ama kan sulandırıcı kullandığım için kontrollü olmak istiyorum.';
                return 'Daha önce ciddi kanama sorunu yaşamadım ama ameliyat için kan hazırlığı yapılmasını rica ederim.';
            },
            q_diabetes: p => {
                const hist = String(p.history || '').toLowerCase();
                if (hist.includes('insülin') || hist.includes('insulin')) return 'Evet, insülin kullanıyorum. Sabah ne yapacağımı doktor söyledi.';
                if (hist.includes('diyabet') || hist.includes('dm') || hist.includes('hba1c')) return 'Evet, diyabetim var; metformin kullanıyorum, kan şekerim takip ediliyor.';
                return 'Diyabetim yok diye biliyorum; en son ölçümde normaldi.';
            },

            // m0192: 5 yeni soru için cevaplar
            q_anesthesia_history: p => {
                const hist = String(p.history || '').toLowerCase();
                if (hist.includes('hipertermi') || hist.includes('mh')) return 'Evet, ailemde malign hipertermi öyküsü var; bunu doktora söyledim.';
                if (hist.includes('genel anestezi') || hist.includes('önceki ameliyat')) return 'Daha önce genel anestezi aldım, herhangi bir sorun olmadı; ama bulantım olmuştu.';
                return 'Hayır, daha önce hiç anestezi almadım. İlk kez ameliyat olacağım.';
            },
            q_smoking_alcohol: p => {
                const hist = String(p.history || '').toLowerCase();
                if (hist.includes('sigara') && hist.includes('alkol')) return 'Evet, hem sigara hem ara sıra alkol kullanıyorum. Doktor ameliyat öncesi azaltmamı söyledi.';
                if (hist.includes('sigara') || hist.includes('smok')) return 'Günde yarım paket sigara içiyorum; bırakmaya çalıştım ama tam bırakamadım.';
                if (hist.includes('alkol')) return 'Ara sıra alkol kullanıyorum, sık değil.';
                return 'Sigara veya alkol kullanmıyorum.';
            },
            q_nausea: p => {
                const symptoms = (p.postop?.symptoms || []).join(' ').toLowerCase();
                if (symptoms.includes('bulantı') || symptoms.includes('kusma')) return 'Evet, hafif bulantım var. Midemde rahatsızlık hissediyorum, kusma henüz olmadı.';
                return 'Şu an bulantım yok, sadece biraz halsizim.';
            },
            q_breathing: p => {
                const surg = String(p.surgery || '').toLowerCase();
                if (/cabg|koroner|bypass|greft/.test(surg)) return 'Derin nefes alırken göğsümde rahatsızlık var, sığ nefes alıyorum. Sternum ağrıyor.';
                if (/torak|akciğer|lobectomy/.test(surg)) return 'Nefes almak biraz zor, ama oksijen yardımıyla daha iyi hissediyorum.';
                return 'Nefes alışım rahat, sıkışma hissi yok.';
            },
            q_urinary: p => {
                const symptoms = (p.postop?.symptoms || []).join(' ').toLowerCase();
                if (symptoms.includes('sonda') || symptoms.includes('idrar')) return 'Sondam var, idrarım çıkıyor ama miktarını hemşire takip ediyor.';
                return 'Henüz idrar yapmadım, sondamın olup olmadığını bilmiyorum.';
            },

            // Ekip-side time-out & sign-out yanıtları (hasta uyutulmuş olsa bile metaforik yanıt — eğitim amaçlı)
            q_timeout_confirm: p => 'Ekip doğrulaması için bekliyorum; kimlik, ameliyat ve bölgenin sesli teyit edilmesi gerekiyor.',
            q_critical_events: p => {
                const surg = String(p.surgery || '').toLowerCase();
                if (/cabg|koroner|bypass/.test(surg)) return 'Bu vakada KPB süresi, beklenen 200-400 ml kan kaybı, hipotermi ve heparinizasyon ekipçe gözden geçirilmeli.';
                if (/ortop|kalça|diz/.test(surg)) return 'Ortopedi vakası: pozisyon güvenliği, turnike süresi, beklenen kan kaybı ve implant boyutu ekipçe konuşulmalı.';
                return 'Bu vakada beklenen süre, anestezi riskleri ve pozisyon ekipçe gözden geçirilmeli.';
            },
            q_antibiotic_timing: p => {
                const allergy = String(p.allergy || '').toLowerCase();
                if (allergy.includes('penisilin') || allergy.includes('β-lakt')) return 'Penisilin alerjim var; profilaksi vankomisin/klindamisin olmalı ve kesi öncesi 120 dk içinde başlanmalı.';
                return 'Antibiyotik profilaksisi kesi öncesi son 60 dk içinde uygulanmalı; ekip kayıttan doğrulamalı.';
            },
            q_signout_confirm: p => 'Yapılan ameliyat, bölge ve hasta kimliği ekip içinde sözel olarak doğrulanmalı; cerrah, anestezist ve sirküle birlikte teyit etmeli.',
            q_count_verbal: p => 'Alet, spanç ve iğne sayımının scrub ve sirküle hemşire tarafından sesli olarak birlikte doğrulanması gerekiyor; uyumsuzluk varsa görüntüleme istenmeli.',
            q_specimen_label: p => `Numune etiketinde hastanın adı (${p.name || 'hasta adı'}), MRN, alınan bölge ve tarih doğrulanmalı; cerrahla closed-loop iletişimle teyit edilmeli.`,
            q_postop_recommendations: p => {
                const surg = String(p.surgery || '').toLowerCase();
                if (/cabg|koroner/.test(surg)) return 'CABG postop önerileri: hemodinami izlemi, drenaj takibi, ekstübasyon planı, antikoagülasyon başlama zamanı, ağrı ve sternum izolasyon önlemleri.';
                return 'Postop öneriler: ağrı kontrolü, mobilizasyon planı, kanama/drenaj izlemi, hava yolu güvenliği ve özel monitör gereksinimleri.';
            },
            q_postop_destination: p => {
                const surg = String(p.surgery || '').toLowerCase();
                if (/cabg|koroner|bypass/.test(surg)) return 'CABG hastası kardiyak yoğun bakıma teslim edilmeli; entübe ve mekanik ventilatör desteğiyle.';
                if (/travma|nöro|kafa/.test(surg)) return 'Yoğun bakıma teslim edilmeli; nörolojik izlem ve sıkı hemodinami takibi gerekli.';
                return 'PACU/uyanma odasına teslim edilecek; stabil olduğunda servise transfer planlanır.';
            }
        };

        // Orijinal fonksiyonları güvenli şekilde sar.

        const __nk_original_getPatientReply = getPatientReply;
        getPatientReply = async function(qid, qtext) {
            if (GCKL_DIALOGUE_RESPONSE_MAP[qid]) {
                await new Promise(r => setTimeout(r, 400));
                return GCKL_DIALOGUE_RESPONSE_MAP[qid](App.currentPatient || {});
            }
            return __nk_original_getPatientReply(qid, qtext);
        };
        const __nk_original_askDialogue = askDialogue;
        askDialogue = async function(q) {
            const alreadyAsked = App.askedQuestions && App.askedQuestions.includes(q.id);
            await __nk_original_askDialogue(q);
            if (!alreadyAsked) recordGCKLDialogueEvidence(q.id);
        };
        const __nk_original_confirmSymptomSelection = confirmSymptomSelection;
        confirmSymptomSelection = function() {
            const phase = App.currentRoom;
            __nk_original_confirmSymptomSelection();
            recordGCKLSymptomEvidence(phase);
            syncGCKLPatientSafetyScore();
            try { updateScoreStrip(); renderRightPanel(); } catch(e) {}
        };
        const __nk_original_confirmDiagnosisSelection = confirmDiagnosisSelection;
        confirmDiagnosisSelection = function() {
            const phase = App.currentRoom;
            __nk_original_confirmDiagnosisSelection();
            recordGCKLDiagnosisEvidence(phase);
            syncGCKLPatientSafetyScore();
            try { updateScoreStrip(); renderRightPanel(); } catch(e) {}
        };

        const __nk_original_selectPatient = selectPatient;
        selectPatient = function(pid) {
            App.gckl = { answers: {}, countAnswers: null, countSubmitted: false, itemEvidence: {}, dialogueEvidence: {}, symptomEvidence: {}, diagnosisEvidence: {} };
            const patient = CASES[pid];
            ensureGCKLTasksForPatient(patient);
            __nk_original_selectPatient(pid);
            gcklEnsureLearningState();
            validateGCKLTaskCoverage();
            sanitizeVisibleGCKLText();
        };
        const __nk_original_executeTaskCompletion = executeTaskCompletion;
        executeTaskCompletion = function(t, phase) {
            __nk_original_executeTaskCompletion(t, phase);
            if (t && t.gcklItem) {
                maybeAskGCKLQuestionForTask(t);
                syncGCKLPatientSafetyScore();
            }
            try { gcklBoardSyncMarkerState(); } catch(e) {}
            try {
                const p = $('#obj-popup');
                const po = App.__currentObjPopupObj;
                if (p?.classList?.contains('visible') && String(po?.opts?.clinicalKey || '').startsWith('ssc-board')) showObjPopup(po);
            } catch(e) {}
        };
        const __nk_original_completeTask = completeTask;
        completeTask = function(taskId, sourceObj = null) {
            if (taskId === 'gckl_27_count_open') {
                toast('info', 'Sayım Panosu', 'Bu görev sayım panosundaki tüm sayısal alanlar doldurularak tamamlanır.');
                renderGCKLCountPanel();
                return;
            }
            return __nk_original_completeTask(taskId, sourceObj);
        };
        const __nk_original_renderRightPanel = renderRightPanel;
        renderRightPanel = function() {
            __nk_original_renderRightPanel();
            renderGCKLCountPanel();
            sanitizeVisibleGCKLText();
        };
        const __nk_original_renderReport = renderReport;
        renderReport = function() {
            syncGCKLPatientSafetyScore();
            __nk_original_renderReport();
            renderGCKLCountReport();
            renderGCKLComplianceReport();
            renderGCKLQuestionReport();
            sanitizeVisibleGCKLText();
        };
        // Eski OSCE raporu çağrılırsa GCKL görünümüne yönlendir.
        renderOSCEItemsReport = renderGCKLComplianceReport;
        function sanitizeVisibleGCKLText() {
            try {
                const replacements = [
                    [/OSCE-PHDYÖ/g, 'GCKL Öğrenme Modülü'],
                    [/OSCE Maddeleri/g, 'Güvenli Cerrahi Kontrol Listesi Maddeleri'],
                    [/OSCE Modu/g, 'Eğitim Modu'],
                    [/OSCE Puanı/g, 'Güvenli Cerrahi Uyum Puanı'],
                    [/OSCE/g, 'GCKL'],
                    [/Observer Mode/g, 'Eğitici İzlem'],
                    [/Akademik Performans/g, 'Öğrenme Performansı'],
                    [/Akademik Skor/g, 'Güvenli Cerrahi Verisi']
                ];
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                    acceptNode(node) {
                        const p = node.parentElement;
                        if (!p) return NodeFilter.FILTER_REJECT;
                        if (['SCRIPT','STYLE','TEXTAREA','INPUT'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                });
                let node;
                while ((node = walker.nextNode())) {
                    let txt = node.nodeValue;
                    let nt = txt;
                    replacements.forEach(([a,b]) => { nt = nt.replace(a,b); });
                    if (nt !== txt) node.nodeValue = nt;
                }
            } catch(e) {}
        }
        try { window.addEventListener('load', () => { sanitizeVisibleGCKLText(); validateGCKLTaskCoverage(); }); } catch(e) {}



        /* ============================================================
           GCKL EK DÜZENLEME: HASTA SORULARI + GEREKÇELİ MCQ PUANLAMA
           - Kimlik / onam / ameliyat bölgesi için hasta soruları GCKL kanıtı üretir.
           - Çoktan seçmeli gerekçe soruları yeniden aktiftir ve Kod 2 için kanıt olur.
           ============================================================ */
        (function applyGCKLDialogueAndRationaleScoringPatch(){
            try {
                gcklEnsureLearningState();

                // 1) Kimlik, cerrahi onam ve ameliyat bölgesi doğrulama için üç hasta sorusu görev mantığına bağlanır.
                const pushTask = (itemId, taskId, label) => {
                    if (!GCKL_TASK_DEFS[itemId]) GCKL_TASK_DEFS[itemId] = [];
                    if (!GCKL_TASK_DEFS[itemId].some(x => x[0] === taskId)) GCKL_TASK_DEFS[itemId].push([taskId, label]);
                };
                pushTask('GCKL-1', 'gckl_1_identity_check', 'Hastaya ad-soyad ve doğum tarihi/MRN sor');
                pushTask('GCKL-1', 'gckl_1_consent_check', 'Hastaya hangi ameliyat için geldiğini sor');
                pushTask('GCKL-1', 'gckl_1_site_check', 'Hastaya ameliyat bölgesi/tarafını sor');
                pushTask('GCKL-2', 'gckl_2_consent_verify', 'Hastaya cerrahi onam/rıza teyidi sor');

                const addDialogueQuestion = (group, id, label) => {
                    if (!DIALOG_QUESTIONS.some(q => q.id === id)) DIALOG_QUESTIONS.push({ group, id, label });
                };
                addDialogueQuestion('Kimlik, onam ve bölge doğrulama', 'q_id', 'Adınız, soyadınız ve doğum tarihiniz nedir?');
                addDialogueQuestion('Kimlik, onam ve bölge doğrulama', 'q_proc', 'Hangi ameliyat için geldiniz?');
                addDialogueQuestion('Kimlik, onam ve bölge doğrulama', 'q_site', 'Ameliyatınız hangi bölgeden veya taraftan yapılacak?');
                addDialogueQuestion('Kimlik, onam ve bölge doğrulama', 'q_consent', 'Ameliyata yönelik onam verdiniz mi?');

                // Var olan konuşma köprülerini güçlendir. Silme yok; sadece ek kanıt ve görev bağları.
                if (GCKL_DIALOGUE_BRIDGES.q_id) {
                    GCKL_DIALOGUE_BRIDGES.q_id.markTasks = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_id.markTasks || []), 'gckl_1_identity_check', 'gckl_10_patient_verify']));
                    GCKL_DIALOGUE_BRIDGES.q_id.linkedItems = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_id.linkedItems || []), 'GCKL-1', 'GCKL-10']));
                }
                if (GCKL_DIALOGUE_BRIDGES.q_proc) {
                    GCKL_DIALOGUE_BRIDGES.q_proc.markTasks = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_proc.markTasks || []), 'gckl_1_consent_check', 'gckl_10_patient_verify']));
                    GCKL_DIALOGUE_BRIDGES.q_proc.linkedItems = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_proc.linkedItems || []), 'GCKL-1', 'GCKL-10', 'GCKL-18']));
                }
                if (GCKL_DIALOGUE_BRIDGES.q_site) {
                    GCKL_DIALOGUE_BRIDGES.q_site.markTasks = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_site.markTasks || []), 'gckl_1_site_check', 'gckl_10_patient_verify']));
                    GCKL_DIALOGUE_BRIDGES.q_site.linkedItems = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_site.linkedItems || []), 'GCKL-1', 'GCKL-10', 'GCKL-11', 'GCKL-18']));
                }
                if (GCKL_DIALOGUE_BRIDGES.q_consent) {
                    GCKL_DIALOGUE_BRIDGES.q_consent.markTasks = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_consent.markTasks || []), 'gckl_2_consent_verify', 'gckl_2_consent_verify', 'gckl_10_patient_verify']));
                    GCKL_DIALOGUE_BRIDGES.q_consent.linkedItems = Array.from(new Set([...(GCKL_DIALOGUE_BRIDGES.q_consent.linkedItems || []), 'GCKL-2', 'GCKL-10']));
                }

                // Hasta yanıtları vaka içinde daha öğretici olsun.
                try {
                    GCKL_DIALOGUE_RESPONSE_MAP.q_id = p => `Adım ${p.name}. Doğum tarihim dosyamda yazıyor; lütfen bilekliğim ve dosyamla birlikte kontrol edin.`;
                    GCKL_DIALOGUE_RESPONSE_MAP.q_proc = p => `${p.surgery} için ameliyata alındığımı biliyorum.`;
                    GCKL_DIALOGUE_RESPONSE_MAP.q_site = p => `${p.surgery} için belirtilen ameliyat bölgesinin/tarafının dosya ve ameliyat listesiyle aynı olması gerekir.`;
                    GCKL_DIALOGUE_RESPONSE_MAP.q_consent = p => 'Evet, ameliyat için onam verdiğimi hatırlıyorum; yine de formun dosyamda olduğunu kontrol etmelisiniz.';
                } catch(e) {}

                // 2) Eksik gerekçeli çoktan seçmeli soruları ekle. Var olan soru bankası korunur.
                const addQuestion = (q) => {
                    if (!GCKL_QUESTIONS.some(x => x.id === q.id)) GCKL_QUESTIONS.push(q);
                };
                addQuestion({
                    id: 'GCKL-Q-VERIFY-01', section: 'I', linkedChecklistItem: 'GCKL-1', type: 'multiple_choice', correctOption: 'C',
                    context: 'Klinikten ayrılmadan önce hasta kimliği, planlanan cerrahi işlem ve ameliyat bölgesi doğrulanacaktır.',
                    question: 'Bu adımın güvenli şekilde tamamlanması için en doğru yaklaşım hangisidir?',
                    options: {
                        A: 'Sadece hastanın adını sormak yeterlidir.',
                        B: 'Sadece ameliyat listesine bakmak yeterlidir.',
                        C: 'Hasta beyanı, bileklik, dosya/ameliyat listesi üzerinden kimlik, ameliyat ve ameliyat bölgesini birlikte doğrulamak gerekir.',
                        D: 'Cerrah hastayı tanıyorsa doğrulama yapılmayabilir.'
                    },
                    explanation: 'Yanlış hasta, yanlış işlem ve yanlış bölge cerrahisini önlemek için hasta beyanı, bileklik ve kayıtlar birlikte doğrulanmalıdır.',
                    feedbackIfWrong: 'Bu madde tek kaynakla kapanmaz; kimlik + ameliyat + bölge çoklu kaynakla doğrulanmalıdır.'
                });
                addQuestion({
                    id: 'GCKL-Q-CONSENT-01', section: 'I', linkedChecklistItem: 'GCKL-2', type: 'multiple_choice', correctOption: 'B',
                    context: 'Hasta ameliyata alınmadan önce cerrahi onam/rıza durumu kontrol edilmektedir.',
                    question: 'Cerrahi onamın güvenli doğrulaması için en doğru yaklaşım hangisidir?',
                    options: {
                        A: 'Sadece hastaya onam verip vermediğini sormak yeterlidir.',
                        B: 'Onam formunun dosyada varlığını ve hastanın ameliyata yönelik rızasını birlikte teyit etmek gerekir.',
                        C: 'Hastanın servise yatmış olması onam için yeterli kabul edilir.',
                        D: 'Onam kontrolü yalnızca cerrahın sorumluluğudur; hemşirelik sürecine dahil değildir.'
                    },
                    explanation: 'Dosyada onamın bulunması ve hastanın rızasının teyidi birlikte değerlendirilmelidir.',
                    feedbackIfWrong: 'Onam yalnız sözlü beyan veya yalnız form kontrolüyle tam doğrulanmış sayılmaz.'
                });
                addQuestion({
                    id: 'GCKL-Q-SITE-01', section: 'II', linkedChecklistItem: 'GCKL-11', type: 'multiple_choice', correctOption: 'D',
                    context: 'Ameliyat bölgesi/taraf işaretlemesi anestezi öncesinde kontrol edilmektedir.',
                    question: 'Cerrahi taraf/alan işaretlemesi yoksa en güvenli yaklaşım hangisidir?',
                    options: {
                        A: 'Hastaya sorulduysa işaretleme olmasa da devam edilir.',
                        B: 'İşaretleme ameliyat sonrası kayda eklenebilir.',
                        C: 'Taraflı cerrahilerde bile ekip tecrübeli ise işaretleme zorunlu değildir.',
                        D: 'Süreç durdurulur; cerrah ve ekip bilgilendirilir, taraf/bölge doğrulanmadan ilerlenmez.'
                    },
                    explanation: 'Taraf/alan işaretlemesi yanlış taraf cerrahisini önleyen kritik güvenlik bariyeridir.',
                    feedbackIfWrong: 'İşaretleme eksikliği geçiştirilemez; doğrulama tamamlanmadan süreç ilerlememelidir.'
                });

                // 2b) Doğru/Yanlış karar soruları. Var olan çoktan seçmeli yapı korunur; ek soru tipi puanlamaya dahil edilir.
                const addTrueFalseQuestion = (id, section, linkedChecklistItem, statement, correct, explanation) => {
                    addQuestion({
                        id, section, linkedChecklistItem, type: 'true_false', correctOption: correct ? 'T' : 'F', score: 3,
                        question: statement,
                        options: { T: 'Doğru', F: 'Yanlış' },
                        explanation,
                        feedbackIfWrong: explanation
                    });
                };
                addTrueFalseQuestion('GCKL-TF-ID-01', 'I', 'GCKL-1',
                    'Kimlik doğrulamada oda veya yatak numarası tek başına güvenilir hasta tanımlayıcısıdır.', false,
                    'Oda/yatak numarası hastaya özgü sabit tanımlayıcı değildir; en az iki güvenilir tanımlayıcı ve bileklik/dosya karşılaştırması gerekir.');
                addTrueFalseQuestion('GCKL-TF-CONSENT-01', 'I', 'GCKL-2',
                    'Dosyada onam formu olsa bile hastanın rızası ve doğru işlemle uyumu kontrol edilmelidir.', true,
                    'Onam güvenliği yalnız form varlığıyla kapanmaz; hasta rızası, doğru hasta ve doğru işlem uyumu birlikte doğrulanmalıdır.');
                addTrueFalseQuestion('GCKL-TF-SITE-01', 'II', 'GCKL-11',
                    'Cerrahi taraf/bölge işaretlemesi yoksa ekip deneyimliyse süreç devam edebilir.', false,
                    'İşaretleme eksikliği durdurucu güvenlik bulgusudur; doğrulama tamamlanmadan süreç ilerlememelidir.');
                addTrueFalseQuestion('GCKL-TF-TIMEOUT-01', 'III', 'GCKL-18',
                    'Time Out cerrahi kesiden önce, ekip katılımıyla ve sesli doğrulama şeklinde yapılmalıdır.', true,
                    'Time Out hasta, işlem ve bölgenin kesiden önce ekipçe sesli doğrulandığı kritik güvenlik bariyeridir.');
                addTrueFalseQuestion('GCKL-TF-ABX-01', 'III', 'GCKL-20',
                    'Profilaktik antibiyotik zamanlaması cerrahi kesiden önce doğrulanmalıdır.', true,
                    'Antibiyotik profilaksisinde zamanlama enfeksiyon önleme açısından kritik olduğundan kesi öncesi doğrulanmalıdır.');
                addTrueFalseQuestion('GCKL-TF-STER-01', 'III', 'GCKL-22',
                    'Steril paket göstergesi uygunsuzsa malzeme sağlam görünüyorsa kullanılabilir.', false,
                    'Gösterge uygunsuzsa malzemenin steril olduğu kabul edilemez; kullanılmamalıdır.');
                addTrueFalseQuestion('GCKL-TF-COUNT-01', 'IV', 'GCKL-27',
                    'Kapanış sayımı uyumsuzsa süreç durdurulmalı; tekrar sayım, alan ve atık kontrolü başlatılmalıdır.', true,
                    'Sayım uyuşmazlığı çözülmeden kapatma güvenli değildir; protokol gereği tekrar sayım ve arama başlatılır.');
                addTrueFalseQuestion('GCKL-TF-COUNT-02', 'IV', 'GCKL-27',
                    'Bir spanç eksikliği küçük bir fark olduğu için yalnızca kayıt altına alınarak ameliyat bitirilebilir.', false,
                    'Tek bir spanç eksikliği bile tutulmuş cerrahi materyal riski taşır; süreç durdurulmalı ve protokol uygulanmalıdır.');
                addTrueFalseQuestion('GCKL-TF-SPEC-01', 'IV', 'GCKL-28',
                    'Specimen etiketi hasta adı ve numunenin alındığı bölge bilgisini içermelidir.', true,
                    'Eksik specimen etiketi yanlış tanı, yanlış tedavi ve numune karışıklığı riskini artırır.');
                addTrueFalseQuestion('GCKL-TF-RECOMM-01', 'IV', 'GCKL-29',
                    'Cerrah ve anestezi ekibinin postoperatif bakım önerileri teslim sürecinde aktarılmalıdır.', true,
                    'Postoperatif öneriler PACU/servis tesliminin güvenliğini ve bakım sürekliliğini doğrudan etkiler.');
                addTrueFalseQuestion('GCKL-TF-DVT-01', 'III', 'GCKL-25',
                    'DVT riski yalnızca postoperatif mobilizasyonla ele alınır; intraoperatif ekip değerlendirmesine gerek yoktur.', false,
                    'DVT riski perioperatif süreçte değerlendirilir; mekanik/farmakolojik profilaksi gereksinimi ekipçe ele alınmalıdır.');
                addTrueFalseQuestion('GCKL-TF-DEST-01', 'IV', 'GCKL-30',
                    'Hastanın ameliyat sonrası gideceği bölüm Sign-Out/teslim sürecinde teyit edilmelidir.', true,
                    'Postoperatif hedef bölümün teyidi bakım sürekliliği ve hasta güvenliği için gereklidir.');

                // 3) Çoktan seçmeli gerekçeler yeniden puanlamaya dahil edilir.
                // [Ölü kod kaldırıldı] gcklQuestionCorrectForItem override'ı v3.9 patch'inde yeniden tanımlanıyor.

                function gcklBaseCodeFromEvidence(itemId) {
                    if (itemId === 'GCKL-27') {
                        const ce = gcklCountEvaluationForStudent();
                        const taskEvidence = (App.completedTasks || []).some(id => gcklTaskIdsForItem(itemId).includes(id));
                        const ev = gcklEvidenceForItem(itemId);
                        if (ce.allCorrect) return 2;
                        if (ce.any || taskEvidence || ev.length) return 1;
                        return 0;
                    }
                    const rc = gcklRequiredCompleted(itemId);
                    const ev = gcklEvidenceForItem(itemId);
                    const any = rc.completed.length > 0 || ev.length > 0;
                    if (!any) return 0;
                    if (rc.required.length && rc.completed.length >= rc.required.length) return 2;
                    return 1;
                }

                gcklCodeForItem = function(itemId) {
                    let code = gcklBaseCodeFromEvidence(itemId);
                    const qCorrect = gcklQuestionCorrectForItem(itemId);
                    // Çoktan seçmeli gerekçe yanlışsa veya cevaplanmadıysa Kod 2 verilmez.
                    if (code === 2 && qCorrect === false) code = 1;
                    return code;
                };

                // [Ölü kod kaldırıldı] maybeAskGCKLQuestionForItem ve maybeAskGCKLQuestionForTask
                // override'ları v3.9 patch'inde (random capped flow ile) yeniden tanımlanıyor.

                // Konuşma da ilgili gerekçe sorusunu tetikleyebilir; çünkü öğrenci bazı GCKL kanıtlarını görevden değil diyalogdan üretir.
                const __gckl_prev_recordDialogue = recordGCKLDialogueEvidence;
                recordGCKLDialogueEvidence = function(dialogueId) {
                    const bridge = GCKL_DIALOGUE_BRIDGES[dialogueId];
                    __gckl_prev_recordDialogue(dialogueId);
                    if (bridge && bridge.linkedItems && bridge.linkedItems.length) {
                        // Eğitimsel akışı boğmamak için ilk ilişkili maddeden tek gerekçe sorusu açılır.
                        const itemId = bridge.linkedItems[0];
                        maybeAskGCKLQuestionForItem(itemId);
                    }
                };

                // [Ölü kod kaldırıldı] renderGCKLQuestionReport override'ı v3.9 patch'inde
                // yeniden tanımlanıyor. Bağlı renderGCKLEvidenceSummaryReport aliası da kaldırıldı —
                // alias eski (ölü) versiyona bağlı kalıyordu, v3.9'da __gckl39_prev_renderGCKLQuestionReport
                // mekanizması ile bu zinciri yeniden kuruyor.

            } catch(err) {
                console.error('GCKL rationale scoring patch failed', err);
            }
        })();


        /* ============================================================
           GCKL UYUMU PUANLAMA YAMASI — v3.9
           - Görünen ana puan artık genel simülasyon puanı değil, GCKL uyum yüzdesidir.
           - Sağ panelde 10 kategori yerine GCKL bölüm uyumu gösterilir.
           - Rapor özet kartları GCKL I–IV ve genel uyuma göre hesaplanır.
           - Klinik öğrenme kategorileri korunur; ancak ana başarı göstergesi değildir.
           ============================================================ */
        (function applyGCKLComplianceScoringPatch(){
            try {
                function gcklSafeEnsure() {
                    try { if (typeof gcklEnsureLearningState === 'function') gcklEnsureLearningState(); } catch(e) {}
                }

                function gcklSectionComplianceSummary() {
                    gcklSafeEnsure();
                    const sections = ['I','II','III','IV'];
                    const out = {};
                    sections.forEach(ph => {
                        const arr = (typeof GCKL_ITEMS !== 'undefined' ? GCKL_ITEMS : []).filter(i => i.phase === ph);
                        const earned = arr.reduce((t, i) => t + (typeof gcklCodeForItem === 'function' ? gcklCodeForItem(i.id) : 0), 0);
                        const max = arr.length * 2;
                        const c0 = arr.filter(i => (typeof gcklCodeForItem === 'function' ? gcklCodeForItem(i.id) : 0) === 0).length;
                        const c1 = arr.filter(i => (typeof gcklCodeForItem === 'function' ? gcklCodeForItem(i.id) : 0) === 1).length;
                        const c2 = arr.filter(i => (typeof gcklCodeForItem === 'function' ? gcklCodeForItem(i.id) : 0) === 2).length;
                        out[ph] = { earned, max, pct: max ? Math.round((earned / max) * 100) : 0, c0, c1, c2, count: arr.length };
                    });
                    return out;
                }
                window.gcklSectionComplianceSummary = gcklSectionComplianceSummary;

                computeTotalScore = function() {
                    gcklSafeEnsure();
                    const s = (typeof gcklComplianceSummary === 'function') ? gcklComplianceSummary() : { totalCode: 0, maxCode: 0, pct: 0 };
                    return {
                        points: s.totalCode || 0,
                        max: s.maxCode || 0,
                        percent: s.pct || 0,
                        source: 'gckl'
                    };
                };

                const __gckl_prev_renderTopbar = renderTopbar;
                renderTopbar = function() {
                    __gckl_prev_renderTopbar();
                    try {
                        const scoreLabel = document.querySelector('#tb-score')?.previousElementSibling;
                        if (scoreLabel) scoreLabel.textContent = 'GCKL Uyumu';
                        const s = computeTotalScore();
                        const scoreEl = document.getElementById('tb-score');
                        if (scoreEl) scoreEl.textContent = s.percent + '%';
                    } catch(e) {}
                };

                updateScoreStrip = function() {
                    const bar = document.getElementById('score-cats');
                    if (!bar) return;
                    gcklSafeEnsure();
                    const total = (typeof gcklComplianceSummary === 'function') ? gcklComplianceSummary() : { pct: 0, totalCode: 0, maxCode: 0, c0: 0, c1: 0, c2: 0 };
                    const bySection = gcklSectionComplianceSummary();
                    const labelMap = {
                        I: 'Klinikten ayrılış öncesi',
                        II: 'Anestezi öncesi / Sign-in',
                        III: 'İnsizyon öncesi / Time-out',
                        IV: 'Çıkış öncesi / Sign-out'
                    };
                    const makeRow = (label, pct, detail) => {
                        const w = Math.max(0, Math.min(100, Number(pct) || 0));
                        let barColor = 'var(--line-soft)';
                        if (w >= 80) barColor = 'var(--green)';
                        else if (w >= 50) barColor = 'var(--amber)';
                        else if (w > 0) barColor = 'var(--red)';
                        return `<div class="score-cat"><div class="nm" title="${detail}">${label} · <span style="color:${w >= 80 ? 'var(--green)' : 'inherit'}">${w}%</span></div><div class="br" style="background: var(--navy-3);"><i style="width:${w}%; background:${barColor}; transition: width 0.4s ease, background-color 0.4s ease;"></i></div></div>`;
                    };
                    let html = makeRow('Genel GCKL uyumu', total.pct, `${total.totalCode}/${total.maxCode} kod puanı · Tam ${total.c2}, Kısmi ${total.c1}, Eksik/Yanlış ${total.c0}`);
                    ['I','II','III','IV'].forEach(ph => {
                        const x = bySection[ph] || { pct: 0, earned: 0, max: 0, c2: 0, c1: 0, c0: 0 };
                        html += makeRow(labelMap[ph], x.pct, `${x.earned}/${x.max} kod puanı · Tam ${x.c2}, Kısmi ${x.c1}, Eksik/Yanlış ${x.c0}`);
                    });
                    bar.innerHTML = html;
                    const stripTitle = document.querySelector('.score-strip .sl span:first-child');
                    const stripMeta = document.querySelector('.score-strip .sl .muted');
                    if (stripTitle) stripTitle.textContent = 'Puan kategorileri';
                    if (stripMeta) stripMeta.textContent = '30 madde';
                };

                const __gckl_prev_renderReport = renderReport;
                renderReport = function() {
                    try { if (typeof syncGCKLPatientSafetyScore === 'function') syncGCKLPatientSafetyScore(); } catch(e) {}
                    __gckl_prev_renderReport();
                    try {
                        const total = (typeof gcklComplianceSummary === 'function') ? gcklComplianceSummary() : { pct: 0, totalCode: 0, maxCode: 0, c0: 0, c1: 0, c2: 0 };
                        const bySection = gcklSectionComplianceSummary();
                        const totalEl = document.getElementById('rd-total');
                        if (totalEl) {
                            totalEl.innerHTML = `<span style="font-family:var(--font-display);font-size:36px;">${total.pct}%</span> <span style="font-family:var(--font-mono);color:#5b7896;font-size:13px;">${total.totalCode} / ${total.maxCode} kod puanı</span><div style="font-size:12px;color:#5b7896;margin-top:6px">Tam uyum: ${total.c2} madde · Kısmi uyum: ${total.c1} madde · Eksik/yanlış: ${total.c0} madde</div>`;
                        }
                        const totalH = totalEl?.closest('.rd-section')?.querySelector('h3');
                        if (totalH) totalH.textContent = 'Genel GCKL Uyumu';
                        const osceBox = document.getElementById('rd-osce');
                        if (osceBox) {
                            const labelMap = {
                                I: 'Klinikten ayrılış öncesi',
                                II: 'Anestezi öncesi / Sign-in',
                                III: 'İnsizyon öncesi / Time-out',
                                IV: 'Çıkış öncesi / Sign-out'
                            };
                            osceBox.innerHTML = ['I','II','III','IV'].map(ph => {
                                const x = bySection[ph] || { pct: 0, earned: 0, max: 0, c0: 0, c1: 0, c2: 0 };
                                const w = Math.max(0, Math.min(100, x.pct));
                                const bColor = w >= 80 ? '#4cb88a' : (w >= 50 ? '#c98c2e' : '#c84a55');
                                return `<div style="flex:1; min-width:200px; background:var(--panel); border:1px solid var(--line); border-radius:6px; padding:16px;">
                                    <div style="font-size:12px; color:var(--ink-mute); text-transform:uppercase; margin-bottom:8px; font-weight:600;">${labelMap[ph]}</div>
                                    <div style="font-size:28px; font-family:var(--font-display); color:${bColor}; margin-bottom:6px;">${w}%</div>
                                    <div style="font-size:11px;color:var(--ink-mute);margin-bottom:8px">${x.earned}/${x.max} kod puanı · Tam ${x.c2}, Kısmi ${x.c1}, Eksik/Yanlış ${x.c0}</div>
                                    <div class="rd-cat-bar" style="background:var(--navy-2); height:6px; margin:0; border-radius:3px; overflow:hidden;"><i style="width:${w}%; background:${bColor}; display:block; height:100%;"></i></div>
                                </div>`;
                            }).join('');
                        }
                        const osceH = osceBox?.closest('.rd-section')?.querySelector('h3');
                        if (osceH) osceH.textContent = 'GCKL Uyumu';
                    } catch(e) { console.warn('GCKL rapor uyum kartı güncellenemedi:', e); }
                };

                renderOSCEPHDYOReport = function() {
                    gcklSafeEnsure();
                    const total = (typeof gcklComplianceSummary === 'function') ? gcklComplianceSummary() : { pct: 0, totalCode: 0, maxCode: 0, c0: 0, c1: 0, c2: 0, criticalMissing: [] };
                    const bySection = gcklSectionComplianceSummary();
                    const summary = document.getElementById('rd-osce-summary');
                    if (summary) {
                        const labelMap = { I:'Klinik ayrılış', II:'Sign-in', III:'Time-out', IV:'Sign-out' };
                        summary.innerHTML = `<div class="osce-score-grid">
                            ${['I','II','III','IV'].map(ph => {
                                const x = bySection[ph] || { pct: 0, earned: 0, max: 0 };
                                return `<div class="osce-score-card"><div class="v">${x.pct}<span style="font-size:13px;color:var(--ink-3)">%</span></div><div class="l">${labelMap[ph]}</div><div style="font-size:11px;color:var(--ink-3);margin-top:4px">${x.earned}/${x.max} kod</div></div>`;
                            }).join('')}
                        </div>
                        <div style="background:rgba(95,180,180,0.08); border:1px solid var(--teal-3); border-radius:6px; padding:10px 12px; font-size:12px; color:var(--ink-2)"><b>Genel GCKL uyumu:</b> %${total.pct} · ${total.totalCode}/${total.maxCode} kod puanı · Tam ${total.c2}, kısmi ${total.c1}, eksik/yanlış ${total.c0} madde.</div>`;
                    }
                    const compl = document.getElementById('rd-osce-compliance');
                    if (compl) {
                        compl.innerHTML = `<div style="font-size:12px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">GCKL Kod Dağılımı</div>
                        <div class="compliance-strip">
                            <span class="compliance-pill ok">Kod 2 · Tam: ${total.c2}</span>
                            <span class="compliance-pill">Kod 1 · Kısmi: ${total.c1}</span>
                            <span class="compliance-pill miss">Kod 0 · Eksik/Yanlış: ${total.c0}</span>
                        </div>`;
                    }
                    try { if (typeof renderGCKLComplianceReport === 'function') renderGCKLComplianceReport(); } catch(e) {}
                    try { if (typeof renderGCKLQuestionReport === 'function') renderGCKLQuestionReport(); } catch(e) {}
                    try { if (typeof renderGCKLCountReport === 'function') renderGCKLCountReport(); } catch(e) {}
                    const seqBox = document.getElementById('rd-osce-sequence');
                    if (seqBox) seqBox.innerHTML = `<pre style="font-size:10px;color:var(--ink-3);max-height:200px;overflow:auto">${(App.actionSequence || []).length} aksiyon kaydedildi</pre>`;
                };

                const __gckl_prev_recalc = recalcOSCETotals;
                recalcOSCETotals = function() {
                    const r = __gckl_prev_recalc();
                    try { if (typeof syncGCKLPatientSafetyScore === 'function') syncGCKLPatientSafetyScore(); } catch(e) {}
                    try { const el = document.getElementById('tb-score'); if (el) el.textContent = computeTotalScore().percent + '%'; } catch(e) {}
                    return r;
                };

            } catch(err) {
                console.error('GCKL compliance scoring patch failed', err);
            }
        })();


        /* ============================================================
           GCKL GENİŞ SORU BANKASI VE AKILLI SORU AKIŞI — v3.9
           - Soru bankası 48 maddeye tamamlanır.
           - Her vakada sınırlı sayıda soru gösterilir; simülasyon test ekranına dönmez.
           - Unshown sorular Kod 2'yi düşürmez; yalnız gösterilen/yanıtlanan yanlış sorular düşürür.
           - Kritik güvenlik açığı raporda görünür.
           ============================================================ */
        (function applyGCKLExpandedQuestionBankAndFlowPatch(){
            try {
                const addQuestion = (q) => {
                    if (!GCKL_QUESTIONS.some(x => x.id === q.id)) GCKL_QUESTIONS.push(q);
                };
                const mcq = (id, section, linkedChecklistItem, correctOption, question, options, explanation, context) => {
                    addQuestion({
                        id, section, linkedChecklistItem, type: 'multiple_choice', correctOption, score: 4,
                        context: context || '', question, options, explanation, feedbackIfWrong: explanation
                    });
                };
                const tf = (id, section, linkedChecklistItem, statement, correct, explanation) => {
                    addQuestion({
                        id, section, linkedChecklistItem, type: 'true_false', correctOption: correct ? 'T' : 'F', score: 3,
                        question: statement, options: { T: 'Doğru', F: 'Yanlış' }, explanation, feedbackIfWrong: explanation
                    });
                };

                // 7 yeni çoktan seçmeli karar sorusu
                mcq('GCKL-Q-NPO-01', 'I', 'GCKL-3', 'B',
                    'Hasta açlık durumunu net hatırlamıyor ve “gece biraz su içmiş olabilirim” diyor. En güvenli yaklaşım hangisidir?',
                    {
                        A: 'Su içmek önemsiz olduğu için ameliyata devam edilir.',
                        B: 'NPO durumu netleştirilir, anestezi ekibi bilgilendirilir ve aspirasyon riski açısından karar birlikte verilir.',
                        C: 'Hastanın beyanı dikkate alınmaz; dosyada aç yazıyorsa yeterlidir.',
                        D: 'Sadece cerrah bilgilendirilir; anesteziye gerek yoktur.'
                    },
                    'NPO belirsizliği aspirasyon riski doğurur; anestezi ekibiyle doğrulanmadan süreç ilerlememelidir.',
                    'Preoperatif hazırlıkta hasta açlık durumunu net ifade edemiyor.');

                mcq('GCKL-Q-REMOVE-01', 'I', 'GCKL-5', 'C',
                    'Hasta ameliyathaneye alınmadan önce protez diş, takı, oje ve değerli eşya kontrolünün temel gerekçesi nedir?',
                    {
                        A: 'Yalnızca servis düzenini korumak.',
                        B: 'Hastanın estetik görünümünü düzenlemek.',
                        C: 'Aspirasyon, yanık, bası/yaralanma, kayıp eşya ve izlem hatalarını azaltmak.',
                        D: 'Ameliyat süresini kısaltmak.'
                    },
                    'Takı/protez/oje/değerli eşya kontrolü hasta güvenliği ve izlem doğruluğu için yapılır.');

                mcq('GCKL-Q-SPECIAL-01', 'I', 'GCKL-8', 'D',
                    'Planlanan cerrahi için özel implant ve kan ürünü gerekebilir. En güvenli kontrol hangisidir?',
                    {
                        A: 'İmplant ve kan ürünü gereksinimi yalnız ameliyat sırasında kontrol edilir.',
                        B: 'Cerrahi liste varsa ek doğrulama gerekmez.',
                        C: 'Yalnızca depo görevlisine sormak yeterlidir.',
                        D: 'Özel malzeme/implant, kan-kan ürünü hazırlığı ve ekip bilgilendirmesi ameliyathaneye geçmeden doğrulanır.'
                    },
                    'Özel malzeme ve kan hazırlığı gecikme, iptal ve intraoperatif güvenlik sorunlarını önlemek için preoperatif doğrulanır.');

                mcq('GCKL-Q-LABRAD-01', 'I', 'GCKL-9', 'A',
                    'Laboratuvar sonucu mevcut ancak gerekli görüntüleme sonucu sisteme düşmemiş. GCKL açısından en doğru karar nedir?',
                    {
                        A: 'Eksik tetkik sonucu tamamlanmadan madde tam uyum kabul edilmez; ilgili ekip bilgilendirilir.',
                        B: 'Laboratuvar sonucu varsa radyoloji sonucu önemsizdir.',
                        C: 'Hasta stabilse tetkik kontrolü atlanabilir.',
                        D: 'Eksiklik yalnız rapora yazılır, süreç etkilenmez.'
                    },
                    'Laboratuvar ve radyoloji gereksinimleri birlikte değerlendirilmelidir; eksik tetkik klinik kararı etkileyebilir.');

                mcq('GCKL-Q-PULSEOX-01', 'II', 'GCKL-13', 'B',
                    'Anestezi öncesi pulse oksimetre takılı fakat sinyal alınamıyor. En güvenli yaklaşım hangisidir?',
                    {
                        A: 'Monitör sonradan düzelir düşüncesiyle indüksiyona başlanır.',
                        B: 'Pulse oksimetre yerleşimi ve çalışması düzeltilmeden anestezi indüksiyonuna geçilmez.',
                        C: 'Sadece kan basıncı takibi yeterli kabul edilir.',
                        D: 'Oksimetre sadece postop dönemde gereklidir.'
                    },
                    'Pulse oksimetrenin hasta üzerinde ve çalışır durumda olması Sign-in güvenlik bariyeridir.');

                mcq('GCKL-Q-BLOODLOSS-01', 'II', 'GCKL-16', 'C',
                    'Hastada yüksek kan kaybı riski öngörülüyor. GCKL açısından en güvenli hazırlık hangisidir?',
                    {
                        A: 'Kan kaybı gelişirse o anda kan bankası aranır.',
                        B: 'Risk yalnız cerrahın sorumluluğudur.',
                        C: 'Damar yolu, kan/kan ürünü hazırlığı, ekip farkındalığı ve anestezi planı önceden doğrulanır.',
                        D: 'Risk kayda yazılır ancak ekip bilgilendirilmez.'
                    },
                    'Kan kaybı riski preoperatif ve anestezi öncesi ekipçe öngörülmeli, hazırlık yapılmalıdır.');

                mcq('GCKL-Q-POSTREQ-01', 'IV', 'GCKL-29', 'D',
                    'Cerrah dren takibi isterken anestezi ekibi yakın solunum izlemi öneriyor. Sign-out sırasında en güvenli yaklaşım hangisidir?',
                    {
                        A: 'Yalnız cerrahın önerisi teslim edilir.',
                        B: 'Yalnız anestezi önerisi teslim edilir.',
                        C: 'Öneriler sözlü alınır ama PACU/servis teslimine yazılmaz.',
                        D: 'Cerrah ve anestezi önerileri birlikte netleştirilir ve teslim planına aktarılır.'
                    },
                    'Postoperatif kritik gereksinimler disiplinler arası teslimde birlikte aktarılmalıdır.');

                // 7 yeni doğru/yanlış güvenlik ilkesi sorusu
                tf('GCKL-TF-NPO-02', 'I', 'GCKL-3',
                    'NPO durumu belirsizse aspirasyon riski nedeniyle anestezi ekibi bilgilendirilmeden süreç ilerletilmemelidir.', true,
                    'Açlık belirsizliği hasta güvenliği açısından durdurucu/yeniden değerlendirme gerektiren bir bulgudur.');
                tf('GCKL-TF-REMOVE-02', 'I', 'GCKL-5',
                    'Oje, periferik dolaşım ve oksijenlenme değerlendirmesini etkileyebileceği için ameliyat öncesi kontrol edilmelidir.', true,
                    'Oje/tırnak uygulamaları pulse oksimetre ve periferik değerlendirmeyi etkileyebilir; kontrol edilmelidir.');
                tf('GCKL-TF-LABRAD-02', 'I', 'GCKL-9',
                    'Gerekli laboratuvar veya radyoloji sonuçlarından biri eksikse GCKL maddesi tam uyum kabul edilmelidir.', false,
                    'Gerekli tetkiklerden biri eksikse madde Kod 2 düzeyinde tamamlanmış kabul edilmez.');
                tf('GCKL-TF-PULSEOX-02', 'II', 'GCKL-13',
                    'Pulse oksimetrenin yalnızca takılı olması yeterlidir; çalışıp çalışmadığının doğrulanması gerekmez.', false,
                    'Oksimetrenin hasta üzerinde olması ve çalışır sinyal vermesi birlikte doğrulanmalıdır.');
                tf('GCKL-TF-EQUIP-02', 'III', 'GCKL-21',
                    'Kullanılacak özel cihaz veya malzeme hazır değilse Time-out sırasında ekip bu eksikliği açıkça gündeme getirmelidir.', true,
                    'Time-out, ekipman/malzeme eksiklerini kesiden önce görünür kılan güvenlik bariyeridir.');
                tf('GCKL-TF-GLU-02', 'III', 'GCKL-23',
                    'Diyabeti olan cerrahi hastada kan şekeri kontrolünün yara iyileşmesi ve enfeksiyon riskiyle ilişkisi yoktur.', false,
                    'Hiperglisemi enfeksiyon ve yara iyileşmesi sorunlarıyla ilişkilidir; riskli hastalarda kontrol gereklidir.');
                tf('GCKL-TF-DEST-02', 'IV', 'GCKL-30',
                    'Postoperatif gideceği bölüm teyit edilmeden teslim planı güvenli kabul edilemez.', true,
                    'PACU/servis/yoğun bakım hedefinin netleşmesi bakım sürekliliği için gereklidir.');

                function gcklQuestionSectionForItem(itemId) {
                    const item = gcklGetItem(itemId);
                    return item && item.phase ? item.phase : 'I';
                }
                function gcklEnsureQuestionFlowState() {
                    gcklEnsureLearningState();
                    if (!App.gckl.questionFlow) {
                        App.gckl.questionFlow = {
                            shownIds: [],
                            sectionLimit: { I: 4, II: 4, III: 4, IV: 4 },
                            totalLimit: 16
                        };
                    }
                    if (!Array.isArray(App.gckl.questionFlow.shownIds)) App.gckl.questionFlow.shownIds = [];
                    if (!App.gckl.questionFlow.sectionLimit) App.gckl.questionFlow.sectionLimit = { I: 4, II: 4, III: 4, IV: 4 };
                    if (!App.gckl.questionFlow.totalLimit) App.gckl.questionFlow.totalLimit = 16;
                    return App.gckl.questionFlow;
                }
                function gcklShownCountForSection(section) {
                    const flow = gcklEnsureQuestionFlowState();
                    return flow.shownIds.filter(id => {
                        const q = gcklGetQuestion(id);
                        return q && gcklQuestionSectionForItem(q.linkedChecklistItem) === section;
                    }).length;
                }
                function gcklPickQuestionForItem(itemId) {
                    const flow = gcklEnsureQuestionFlowState();
                    const section = gcklQuestionSectionForItem(itemId);
                    if (flow.shownIds.length >= flow.totalLimit) return null;
                    if (gcklShownCountForSection(section) >= (flow.sectionLimit[section] || 4)) return null;
                    const candidates = gcklQuestionsForItem(itemId).filter(q => {
                        return !(App.gckl.answers && App.gckl.answers[q.id]) && !flow.shownIds.includes(q.id);
                    });
                    if (!candidates.length) return null;
                    return candidates[Math.floor(Math.random() * candidates.length)];
                }

                // Geniş bankada yalnız gösterilen/yanıtlanan sorular Kod 2'yi etkiler.
                gcklQuestionCorrectForItem = function(itemId) {
                    gcklEnsureLearningState();
                    const flow = gcklEnsureQuestionFlowState();
                    const qs = gcklQuestionsForItem(itemId);
                    if (!qs.length) return null;
                    const relevant = qs.filter(q => (App.gckl.answers && App.gckl.answers[q.id]) || flow.shownIds.includes(q.id));
                    if (!relevant.length) return null;
                    if (relevant.some(q => App.gckl.answers && App.gckl.answers[q.id] && App.gckl.answers[q.id].correct === false)) return false;
                    if (relevant.some(q => !(App.gckl.answers && App.gckl.answers[q.id]))) return false;
                    return relevant.some(q => App.gckl.answers && App.gckl.answers[q.id] && App.gckl.answers[q.id].correct === true) ? true : null;
                };

                maybeAskGCKLQuestionForItem = function(itemId) {
                    const q = gcklPickQuestionForItem(itemId);
                    if (!q) return;
                    const flow = gcklEnsureQuestionFlowState();
                    if (!flow.shownIds.includes(q.id)) flow.shownIds.push(q.id);
                    askGCKLQuestion(q);
                };
                maybeAskGCKLQuestionForTask = function(task) {
                    if (!task || !task.gcklItem) return;
                    maybeAskGCKLQuestionForItem(task.gcklItem);
                };

                function gcklCriticalSafetyStatus() {
                    gcklEnsureLearningState();
                    const gaps = [];
                    GCKL_ITEMS.filter(item => item.criticalKey || ['GCKL-1','GCKL-2','GCKL-10','GCKL-11','GCKL-14','GCKL-18','GCKL-20','GCKL-27','GCKL-28','GCKL-30'].includes(item.id)).forEach(item => {
                        const code = gcklCodeForItem(item.id);
                        const wrongQs = gcklQuestionsForItem(item.id).filter(q => App.gckl.answers && App.gckl.answers[q.id] && App.gckl.answers[q.id].correct === false);
                        if (code === 0 || wrongQs.length) gaps.push({ id: item.id, text: item.text, code, wrongQuestionCount: wrongQs.length });
                    });
                    return { hasGap: gaps.length > 0, gaps };
                }
                window.gcklCriticalSafetyStatus = gcklCriticalSafetyStatus;

                const __gckl39_prev_renderReport = renderReport;
                renderReport = function() {
                    __gckl39_prev_renderReport();
                    try {
                        const status = gcklCriticalSafetyStatus();
                        const totalEl = document.getElementById('rd-total');
                        if (totalEl) {
                            let indicator = document.getElementById('gckl-critical-indicator');
                            if (!indicator) {
                                indicator = document.createElement('div');
                                indicator.id = 'gckl-critical-indicator';
                                indicator.style.marginTop = '10px';
                                totalEl.appendChild(indicator);
                            }
                            indicator.innerHTML = status.hasGap
                                ? `<div style="background:#f3dfd8;border-left:3px solid #c84a55;padding:8px 10px;border-radius:4px;font-size:12px;color:#5a1e24"><b>Kritik güvenlik açığı var:</b> ${status.gaps.slice(0,4).map(g => g.id).join(', ')}${status.gaps.length > 4 ? ' ...' : ''}</div>`
                                : `<div style="background:#dfeee5;border-left:3px solid #4cb88a;padding:8px 10px;border-radius:4px;font-size:12px;color:#1f4b35"><b>Kritik güvenlik açığı yok:</b> kritik GCKL maddelerinde Kod 0 veya yanlış karar sorusu saptanmadı.</div>`;
                        }
                    } catch(e) { console.warn('Kritik güvenlik göstergesi eklenemedi:', e); }
                };

                const __gckl39_prev_renderGCKLQuestionReport = renderGCKLQuestionReport;
                renderGCKLQuestionReport = function() {
                    __gckl39_prev_renderGCKLQuestionReport();
                    try {
                        const box = document.getElementById('rd-osce-rationales');
                        if (!box) return;
                        const flow = gcklEnsureQuestionFlowState();
                        const entries = Object.values(App.gckl.answers || {});
                        const correct = entries.filter(a => a.correct).length;
                        const wrong = entries.filter(a => a.correct === false).length;
                        const status = gcklCriticalSafetyStatus();
                        const panel = document.createElement('div');
                        panel.className = 'rd-section';
                        panel.innerHTML = `<h3>Soru Bankası ve Kritik Güvenlik Özeti</h3>
                            <div class="rd-narrative"><div class="nt">GCKL karar sorusu akışı</div>
                            Banka: ${GCKL_QUESTIONS.length} soru · Bu vakada gösterilen: ${flow.shownIds.length}/${flow.totalLimit} · Yanıtlanan: ${entries.length} · Doğru: ${correct} · Yanlış: ${wrong}.<br>
                            Kritik güvenlik durumu: <b>${status.hasGap ? 'Açık var' : 'Açık yok'}</b>${status.hasGap ? ' · ' + status.gaps.slice(0,5).map(g => g.id).join(', ') : ''}.
                            </div>`;
                        box.appendChild(panel);
                    } catch(e) { console.warn('Soru bankası özeti eklenemedi:', e); }
                };

                const __gckl39_prev_updateScoreStrip = updateScoreStrip;
                updateScoreStrip = function() {
                    __gckl39_prev_updateScoreStrip();
                    try {
                        const stripMeta = document.querySelector('.score-strip .sl .muted');
                        if (stripMeta && typeof window.gcklCriticalSafetyStatus === 'function') {
                            const st = window.gcklCriticalSafetyStatus();
                            const flow = gcklEnsureQuestionFlowState();
                            stripMeta.textContent = `30 madde · ${flow.shownIds.length}/${flow.totalLimit} soru · ${st.hasGap ? 'kritik açık var' : 'kritik açık yok'}`;
                        }
                    } catch(e) {}
                };

            } catch(err) {
                console.error('GCKL v3.9 expanded question bank patch failed', err);
            }
        })();



        /* ============================================================
           v4.0 — ANA PUANI ESKİ MANTIĞA DÖNDÜRME
           - Ana skor = genel simülasyon performansı.
           - GCKL uyumu ana skor değil, ayrı alt gösterge.
           - Soru bankası, D/Y soruları, sayım güvenliği ve kritik açık göstergesi korunur.
        ============================================================ */
        (function(){
            try {
                function nkGeneralSimulationScore() {
                    let pts = 0, max = 0;
                    Object.keys(App.scores || {}).forEach(k => {
                        const s = App.scores[k] || { earned: 0, max: 0 };
                        pts += Number(s.earned) || 0;
                        max += Number(s.max) || 0;
                    });
                    let percent = max > 0 ? Math.round((pts / max) * 100) : 0;
                    percent = Math.max(0, Math.min(100, percent));
                    return {
                        points: Math.max(0, Math.round(pts * 10) / 10),
                        max: Math.max(0, Math.round(max * 10) / 10),
                        percent,
                        source: 'general-simulation'
                    };
                }
                window.computeGeneralSimulationScore = nkGeneralSimulationScore;
                computeTotalScore = nkGeneralSimulationScore;

                function nkGCKLSummary() {
                    try {
                        if (typeof gcklComplianceSummary === 'function') return gcklComplianceSummary();
                    } catch(e) {}
                    return { pct: 0, totalCode: 0, maxCode: 0, c0: 0, c1: 0, c2: 0 };
                }

                function nkBarColour(w, cssVars) {
                    if (cssVars) {
                        if (w >= 80) return 'var(--green)';
                        if (w >= 50) return 'var(--amber)';
                        if (w > 0) return 'var(--red)';
                        return 'var(--line-soft)';
                    }
                    if (w >= 80) return '#4cb88a';
                    if (w >= 50) return '#c98c2e';
                    if (w > 0) return '#c84a55';
                    return '#d4ccb6';
                }

                function nkRenderPhasePerformanceCards() {
                    const osceBox = document.getElementById('rd-osce');
                    if (!osceBox) return;
                    const phaseNames = {
                        preop: 'İstasyon 1: Preoperatif',
                        intraop: 'İstasyon 2: İntraoperatif',
                        postop: 'İstasyon 3: Postop / PACU'
                    };
                    let html = '';
                    ['preop', 'intraop', 'postop'].forEach(ph => {
                        const pScore = (App.phaseScores || {})[ph];
                        if (!pScore || !pScore.max) return;
                        const w = Math.max(0, Math.min(100, Math.round((pScore.earned / pScore.max) * 100)));
                        const bColor = nkBarColour(w, false);
                        html += `<div style="flex:1; min-width:200px; background:var(--panel); border:1px solid var(--line); border-radius:6px; padding:16px;">
                            <div style="font-size:12px; color:var(--ink-mute); text-transform:uppercase; margin-bottom:8px; font-weight:600;">${phaseNames[ph]}</div>
                            <div style="font-size:28px; font-family:var(--font-display); color:${bColor}; margin-bottom:6px;">${w}%</div>
                            <div style="font-size:11px;color:var(--ink-mute);margin-bottom:8px">${Math.round(pScore.earned * 10) / 10}/${Math.round(pScore.max * 10) / 10} puan</div>
                            <div class="rd-cat-bar" style="background:var(--navy-2); height:6px; margin:0; border-radius:3px; overflow:hidden;"><i style="width:${w}%; background:${bColor}; display:block; height:100%;"></i></div>
                        </div>`;
                    });
                    osceBox.innerHTML = html;
                    const osceH = osceBox.closest('.rd-section')?.querySelector('h3');
                    if (osceH) osceH.textContent = 'Faz Bazlı Öğrenme Performansı';
                }

                const __nk40_prev_renderTopbar = renderTopbar;
                renderTopbar = function() {
                    try { __nk40_prev_renderTopbar(); } catch(e) {}
                    try {
                        const scoreLabel = document.querySelector('#tb-score')?.previousElementSibling;
                        if (scoreLabel) scoreLabel.textContent = 'Skor';
                        const total = nkGeneralSimulationScore();
                        const scoreEl = document.getElementById('tb-score');
                        if (scoreEl) scoreEl.textContent = total.percent + '%';
                    } catch(e) {}
                };

                updateScoreStrip = function() {
                    const bar = document.getElementById('score-cats');
                    if (!bar) return;
                    bar.innerHTML = '';
                    Object.keys(SCORE_CATEGORIES || {}).forEach((k, i) => {
                        const cat = (App.scores || {})[k] || { earned: 0, max: 0 };
                        let pctStr = 'Ölçülmedi';
                        let w = 0;
                        if (cat.max > 0) {
                            w = Math.max(0, Math.min(100, Math.round((cat.earned / cat.max) * 100)));
                            pctStr = w + '%';
                        }
                        const barColor = nkBarColour(w, true);
                        const c = document.createElement('div');
                        c.className = `score-cat k${i+1}`;
                        c.innerHTML = `<div class="nm" title="${SCORE_CATEGORIES[k].desc}">${SCORE_CATEGORIES[k].label} · <span style="color:${w >= 80 ? 'var(--green)' : 'inherit'}">${pctStr}</span></div>
                            <div class="br" style="background: var(--navy-3);"><i style="width:${w}%; background:${barColor}; transition: width 0.4s ease, background-color 0.4s ease;"></i></div>`;
                        bar.appendChild(c);
                    });

                    const g = nkGCKLSummary();
                    const st = (typeof window.gcklCriticalSafetyStatus === 'function') ? window.gcklCriticalSafetyStatus() : { hasGap: false };
                    const gW = Math.max(0, Math.min(100, Number(g.pct) || 0));
                    const gCard = document.createElement('div');
                    gCard.className = 'score-cat gckl-secondary';
                    gCard.style.borderTop = '1px solid var(--line-soft)';
                    gCard.style.paddingTop = '6px';
                    gCard.innerHTML = `<div class="nm" title="GCKL kodlarına göre hesaplanan ayrı uyum göstergesi">GCKL uyumu · <span style="color:${gW >= 80 ? 'var(--green)' : 'inherit'}">${gW}%</span> <span style="color:var(--ink-dim)">(${g.totalCode || 0}/${g.maxCode || 0} kod)</span></div>
                        <div class="br" style="background: var(--navy-3);"><i style="width:${gW}%; background:${nkBarColour(gW, true)}; transition: width 0.4s ease, background-color 0.4s ease;"></i></div>`;
                    bar.appendChild(gCard);

                    const stripTitle = document.querySelector('.score-strip .sl span:first-child');
                    const stripMeta = document.querySelector('.score-strip .sl .muted');
                    if (stripTitle) stripTitle.textContent = 'Puan kategorileri';
                    if (stripMeta) stripMeta.textContent = `10 kategori · GCKL ${gW}% · ${st.hasGap ? 'kritik açık var' : 'kritik açık yok'}`;
                };

                const __nk40_prev_renderReport = renderReport;
                renderReport = function() {
                    try { __nk40_prev_renderReport(); } catch(e) { console.warn('Önceki rapor oluşturma tamamlanamadı:', e); }
                    try {
                        const total = nkGeneralSimulationScore();
                        const totalEl = document.getElementById('rd-total');
                        if (totalEl) {
                            totalEl.innerHTML = `<span style="font-family:var(--font-display);font-size:36px;">${total.percent}%</span> <span style="font-family:var(--font-mono);color:#5b7896;font-size:13px;">${total.points} / ${total.max} puan</span>`;
                            const h = totalEl.closest('.rd-section')?.querySelector('h3');
                            if (h) h.textContent = 'Genel Simülasyon Performansı';
                            const info = totalEl.nextElementSibling;
                            if (info) info.textContent = 'Bu değer; tamamlanan görevler, semptom ve tanı seçimleri, klinik kararlar, cerrahi hemşireliği bilgisi ve güvenli cerrahi davranışlarına dayanan genel simülasyon-içi öğrenme performansıdır. GCKL uyumu ayrı bir alt gösterge olarak ayrıca raporlanır.';
                        }

                        const g = nkGCKLSummary();
                        const st = (typeof window.gcklCriticalSafetyStatus === 'function') ? window.gcklCriticalSafetyStatus() : { hasGap: false, gaps: [] };
                        const totalSection = totalEl?.closest('.rd-section');
                        let gSection = document.getElementById('gckl-secondary-report');
                        if (!gSection && totalSection) {
                            gSection = document.createElement('div');
                            gSection.id = 'gckl-secondary-report';
                            gSection.className = 'rd-section';
                            gSection.style.marginTop = '14px';
                            totalSection.insertAdjacentElement('afterend', gSection);
                        }
                        if (gSection) {
                            const gw = Math.max(0, Math.min(100, Number(g.pct) || 0));
                            const bColor = nkBarColour(gw, false);
                            gSection.innerHTML = `<h3>GCKL Uyumu</h3>
                                <div class="rd-narrative" style="margin-top:8px; border-left-color:${bColor};">
                                    <div class="nt">Alt gösterge</div>
                                    <b>%${gw}</b> · ${g.totalCode || 0}/${g.maxCode || 0} kod puanı · Kod 2 tam: ${g.c2 || 0}, Kod 1 kısmi: ${g.c1 || 0}, Kod 0 eksik/yanlış: ${g.c0 || 0}.<br>
                                    Kritik güvenlik durumu: <b>${st.hasGap ? 'Açık var' : 'Açık yok'}</b>${st.hasGap ? ' · ' + (st.gaps || []).slice(0,4).map(x => x.id).join(', ') : ''}.
                                </div>`;
                        }
                        nkRenderPhasePerformanceCards();
                    } catch(e) { console.warn('v4.0 genel skor rapor düzeltmesi uygulanamadı:', e); }
                };

                const __nk40_prev_recalc = recalcOSCETotals;
                recalcOSCETotals = function() {
                    const r = __nk40_prev_recalc();
                    try { renderTopbar(); updateScoreStrip(); } catch(e) {}
                    return r;
                };

            } catch(err) {
                console.error('NurseKit v4.0 score restoration patch failed', err);
            }
        })();



        /* ===================== NurseKit v5.6: Öğreten 3D + Klinik Ses Motoru ===================== */
        (function nurseKitClinicalLearningAndAudioPatch(){
            const ClinicalLearningCatalog = {
                identity: {
                    objective: 'Kimlik, cerrahi onam ve ameliyat bölgesi doğrulamasını aynı güvenlik zinciri içinde öğrenir.',
                    why: 'Yanlış hasta, yanlış işlem ve yanlış taraf cerrahisini önleyen temel güvenlik bariyeridir.',
                    wrong: 'Yatak başı doğrulama aksından uzaklaşırsa doğrulama gözden kaçabilir ve kritik güvenlik açığı oluşur.',
                    checklist: 'Kimlik · Onam · Cerrahi taraf/bölge doğrulama', sound: 'identity'
                },
                'baseline-vitals': {
                    objective: 'Preoperatif temel yaşam bulgularını cerrahi hazırlık kararlarıyla ilişkilendirir.',
                    why: 'Hipotansiyon, taşikardi, ateş veya düşük SpO₂ ameliyat öncesi risk değerlendirmesini değiştirir.',
                    wrong: 'Monitör hem hastaya hem hemşireye görünür değilse erken bozulma fark edilmeyebilir.',
                    checklist: 'Vital bulgular · Anesteziye hazır oluş', sound: 'monitor'
                },
                headwall: {
                    objective: 'Başucu oksijen, vakum, elektrik ve monitör bağlantılarının hasta başı güvenliğiyle ilişkisini açıklar.',
                    why: 'Acil oksijen, aspirasyon ve monitör erişimi gecikmemelidir.',
                    wrong: 'Yatak baş ucu panelden uzaklaşırsa acil hava yolu ve izlem erişimi zayıflar.',
                    checklist: 'Oksijen/vakum/monitör hazır oluş', sound: 'equipment'
                },
                'iv-access': {
                    objective: 'IV erişimin transferi engellemeden izlenebilir ve ulaşılabilir kalmasını sağlar.',
                    why: 'Sıvı, antibiyotik, analjezi ve acil ilaç uygulaması için güvenli erişim gerekir.',
                    wrong: 'Geçiş yolunu kapatırsa transfer ve acil müdahale gecikir.',
                    checklist: 'Damar yolu · Sıvı/ilaç hazırlığı', sound: 'equipment'
                },
                'hand-hygiene': {
                    objective: 'Hasta temasından önce el hijyenini görünür ve erişilebilir bir davranışa dönüştürür.',
                    why: 'Cerrahi alan enfeksiyonu ve çapraz bulaş riskini azaltan temel davranıştır.',
                    wrong: 'İstasyon görünür ve erişilebilir değilse öğrenci davranışı atlayabilir.',
                    checklist: 'El hijyeni · Enfeksiyon kontrolü', sound: 'wash'
                },
                'or-hand-hygiene': {
                    objective: 'Ameliyathane giriş-çıkış akışında el hijyeni ve aseptik davranış ilişkisini kurar.',
                    why: 'Steril alan güvenliği yalnızca masa düzeniyle değil, giriş davranışıyla da korunur.',
                    wrong: 'Kirli-temiz akıştan koparsa aseptik davranış görünmez hale gelir.',
                    checklist: 'Aseptik hazırlık · Steril saha davranışı', sound: 'wash'
                },
                'pacu-hand-hygiene': {
                    objective: 'PACU’da sık hasta teması öncesi el hijyenini otomatik davranış haline getirir.',
                    why: 'Dren, IV, hava yolu ve yara alanı teması enfeksiyon riski taşır.',
                    wrong: 'Bakım çekirdeğinden uzaklaşırsa temas öncesi hijyen davranışı zayıflar.',
                    checklist: 'PACU el hijyeni · Temas önlemleri', sound: 'wash'
                },
                'time-out': {
                    objective: 'Tüm ekibin aynı anda durup doğru hasta, doğru işlem ve kritik riskleri yüksek sesle doğrulamasını öğrenir.',
                    why: 'Ekip ortak zihinsel model kurmadan kesi başlamamalıdır.',
                    wrong: 'Operatif çekirdekten uzaklaşırsa time-out ekip davranışı olmaktan çıkar.',
                    checklist: 'WHO Safe Surgery Checklist · Time-out', sound: 'timeout'
                },
                signin: {
                    objective: 'Anestezi öncesi alerji, hava yolu, kanama riski ve ekipman hazır oluşunu sistematikleştirir.',
                    why: 'İndüksiyon öncesi fark edilmeyen riskler geri dönüşü zor olaylara dönüşebilir.',
                    wrong: 'Baş uç anestezi alanından koparsa sign-in eksik kalabilir.',
                    checklist: 'Sign-in · Anestezi güvenliği', sound: 'timeout'
                },
                'mayo-stand': {
                    objective: 'Mayo masasının steril alanda, scrub hemşiresi ve cerraha erişilebilir konumda durmasını öğrenir.',
                    why: 'Alet akışının gecikmesi, steril alanın bozulması ve sayım hatası riskini artırır.',
                    wrong: 'Steril çekirdek dışına çıkarsa aseptik akış ve güvenli alet transferi bozulur.',
                    checklist: 'Steril alan · Alet akışı · Sayım güvenliği', sound: 'sterile'
                },
                'sterile-table': {
                    objective: 'Arka steril masanın scrub hemşiresi erişiminde ve steril çekirdekle uyumlu durmasını sağlar.',
                    why: 'Alet setleri, spançlar ve ek malzemeler kontrollü steril akış içinde tutulur.',
                    wrong: 'Dolaşım yoluna veya kirli alana taşınırsa kontaminasyon riski doğar.',
                    checklist: 'Steril masa · Alet seti kontrolü', sound: 'sterile'
                },
                'cpb-machine': {
                    objective: 'Kalp-akciğer makinesinin perfüzyonist erişimiyle acil dolaşım yolunu birlikte korumasını öğretir.',
                    why: 'KABG’de perfüzyon erişimi ve acil ekip hareketi aynı anda güvenli kalmalıdır.',
                    wrong: 'Ana geçişi kapatırsa acil müdahaleyi, perfüzyon izlemini ve ekip hareketini geciktirir.',
                    checklist: 'KPB hazırlığı · Perfüzyon güvenliği', sound: 'cpb'
                },
                'perfusion-console': {
                    objective: 'Perfüzyon konsolunun KPB makinesiyle aynı çalışma hattında olmasını açıklar.',
                    why: 'Akış, basınç, sıcaklık ve alarm takibi yakın ve kesintisiz olmalıdır.',
                    wrong: 'Makineden uzaklaşırsa perfüzyon izlemi parçalanır.',
                    checklist: 'Perfüzyon izlemi', sound: 'cpb'
                },
                'count-board': {
                    objective: 'Spanç, iğne ve alet sayımının sirküle, scrub ve cerrah arasında üçlü doğrulama ile yürütülmesini sağlar.',
                    why: 'Retained surgical item riskini azaltmak için sayım görünür, kayıtlı ve ekipçe teyit edilmiş olmalıdır.',
                    wrong: 'Tek kişi sayımı, scrub doğrulamasının atlanması veya cerrah onayı olmadan kavite kapatılması kapanış güvenliğini bozar.',
                    checklist: 'Üçlü sayım doğrulaması · RSI önleme', sound: 'count'
                },
                'forced-air-warmer': {
                    objective: 'CABG sırasında hipotermi önleme için forced-air alt vücut ısıtmasının konum ve bağlantısını öğretir.',
                    why: 'Perioperatif hipotermi yara enfeksiyonu, kanama, koagülasyon bozulması ve titremeye bağlı oksijen tüketimini artırır; hedef intraop sıcaklık ≥36°C olmalıdır.',
                    wrong: 'Isıtma cihazı görünür değilse, hortum steril alanı keserse veya battaniye sternotomi sahasına taşarsa hem eğitim mesajı hem saha güvenliği zayıflar.',
                    checklist: 'Hipotermi önleme · Aktif ısıtma · 30 dk sıcaklık izlemi', sound: 'equipment'
                },
                specimen: {
                    objective: 'Numune etiketleme ve transferinin cerrahi saha ile laboratuvar güvenliği arasındaki bağını kurar.',
                    why: 'Yanlış etiketleme tanı, tedavi ve yasal güvenlik hatasıdır.',
                    wrong: 'Steril/kirli akıştan koparsa numune karışması veya kontaminasyon riski artar.',
                    checklist: 'Numune güvenliği', sound: 'label'
                },
                'pacu-bed': {
                    objective: 'PACU yatağında hava yolu, ağrı, bilinç, kanama ve düşme izlemini bütünleştirir.',
                    why: 'Postoperatif erken dönem hızlı bozulma riskinin en yüksek olduğu aralıktır.',
                    wrong: 'Bakım çekirdeğinden saparsa hemşire erişimi ve monitörizasyon zayıflar.',
                    checklist: 'PACU kabul · Erken izlem', sound: 'monitor'
                },
                'pacu-monitor': {
                    objective: 'SpO₂, solunum, hemodinami ve bilinç izlemini hasta güvenliğiyle ilişkilendirir.',
                    why: 'Sedasyon, ağrı, hipoventilasyon ve kanama erken monitör bulgularıyla yakalanır.',
                    wrong: 'Baş uca ve hemşire görüş hattına yakın değilse alarm fark edilmeyebilir.',
                    checklist: 'PACU monitörizasyonu', sound: 'monitor'
                },
                analgesia: {
                    objective: 'Ağrı değerlendirmesi, analjezi uygulaması ve yeniden değerlendirmeyi aynı bakım döngüsüne bağlar.',
                    why: 'Kontrolsüz ağrı solunum, mobilizasyon ve deliryum riskini etkiler.',
                    wrong: 'Hemşire erişiminden uzaklaşırsa ağrı yönetimi gecikir.',
                    checklist: 'Ağrı değerlendirme · Analjezi', sound: 'equipment'
                },
                drain: {
                    objective: 'Dren miktarı, rengi ve ani kanama bulgusunu sistematik izlemeyi öğretir.',
                    why: 'Postoperatif kanama erken fark edilmezse hemodinamik bozulma gelişebilir.',
                    wrong: 'Görüş alanı dışında kalırsa dren izlemi atlanır.',
                    checklist: 'Dren/kanama izlemi', sound: 'alarm'
                },
                oxygen: {
                    objective: 'Oksijen desteğini SpO₂, solunum sayısı ve hava yolu açıklığı ile ilişkilendirir.',
                    why: 'Hipoksemi PACU’da hızlı ve önlenebilir bir güvenlik sorunudur.',
                    wrong: 'Baş uçtan uzaklaşırsa solunum desteği gecikir.',
                    checklist: 'Oksijen · Hava yolu', sound: 'oxygen'
                },
                handoff: {
                    objective: 'SBAR teslimini yapılandırılmış iletişim ve bakım sürekliliği olarak uygular.',
                    why: 'Eksik teslim; ilaç, dren, ağrı, alerji ve komplikasyon bilgisinin kaybına yol açar.',
                    wrong: 'Teslim panosu görünür değilse bilgi aktarımı kişiye bağımlı kalır.',
                    checklist: 'SBAR teslim', sound: 'handoff'
                },
                neuro: {
                    objective: 'Bilinç, oryantasyon ve deliryum belirtilerini erken postoperatif izlemle bağlar.',
                    why: 'Erken deliryum, hasta güvenliği ve bakım yükü açısından kritik bir bulgudur.',
                    wrong: 'Hasta başı izlemden koparsa nörolojik değişim geç fark edilir.',
                    checklist: 'Bilinç · Deliryum izlemi', sound: 'neuro'
                }
            };

            const RoomTeachingMeta = {
                preop: {
                    goal: 'Preoperatif odada amaç; hasta kimliği, cerrahi hazırlık, el hijyeni, aile desteği ve güvenli transfer davranışlarını aynı bakım çekirdeğinde öğretmektir.',
                    zones: [
                        { label: 'Hasta bakım çekirdeği', x: 2.25, z: -2.10, w: 4.6, d: 3.5, color: 0x5cc4d6, text: 'Kimlik, vital bulgu, eğitim ve IV erişim.' },
                        { label: 'El hijyeni / temiz giriş', x: -5.25, z: -3.65, w: 2.2, d: 1.5, color: 0x4cb88a, text: 'Hasta teması öncesi davranış noktası.' },
                        { label: 'Aile destek alanı', x: 4.95, z: 1.35, w: 2.4, d: 2.6, color: 0xe0a558, text: 'Destek var; bakım çekirdeği korunur.' }
                    ]
                },
                intraop: {
                    goal: 'İntraoperatif alanda amaç; baş uç anestezi alanını, sternotomi çevresi steril çekirdeği, perfüzyon hattını ve sirküle akışını birbirine çarptırmadan yönetmeyi öğretmektir.',
                    zones: [
                        { label: 'Steril çekirdek', x: 1.05, z: -0.08, w: 3.1, d: 2.25, color: 0x5cc4d6, text: 'Cerrah, scrub, Mayo ve arka steril masa hastaya daha yakın kompakt çekirdekte.' },
                        { label: 'Anestezi alanı', x: -2.95, z: 0.04, w: 1.8, d: 2.0, color: 0x6f9fd8, text: 'Baş uç hava yolu, monitör ve anestezi cihazı hasta başına daha kompakt yaklaştırıldı.' },
                        { label: 'Perfüzyon alanı', x: 3.95, z: -0.10, w: 2.4, d: 2.6, color: 0x9b89c4, text: 'KPB makinesi, konsol ve perfüzyonist daha kompakt ve okunur bir güvenlik zonunda hizalandı.' },
                        { label: 'Sirkülasyon hattı', x: 7.10, z: 2.50, w: 2.6, d: 4.6, color: 0xe0a558, text: 'Sayım panosu, sirküle hemşiresi ve numune işleme istasyonu sahnenin sağ hattında ortak çalışma alanında konumlandırıldı; sirküle bu alandan steril çekirdek dışındaki tüm trafiği yönetir.' }
                    ]
                },
                postop: {
                    goal: 'PACU’da amaç; hava yolu, SpO₂, ağrı, dren/kanama, bilinç ve SBAR teslimini erken bozulma riski üzerinden öğretmektir.',
                    zones: [
                        { label: 'PACU izlem çekirdeği', x: 0.10, z: -0.35, w: 4.8, d: 3.6, color: 0x5cc4d6, text: 'Hasta, monitör, IV, dren ve hemşire erişimi.' },
                        { label: 'Hava yolu / baş ucu', x: -0.15, z: -3.60, w: 3.3, d: 1.3, color: 0x4cb88a, text: 'Oksijen, aspirasyon ve başucu paneli.' },
                        { label: 'Teslim ve kayıt alanı', x: 4.45, z: 1.10, w: 2.6, d: 2.4, color: 0x6f9fd8, text: 'SBAR ve dokümantasyon.' },
                        { label: 'Aile bilgilendirme alanı', x: 5.20, z: 3.05, w: 2.3, d: 1.5, color: 0xe0a558, text: 'Mahremiyet ve bakım çekirdeği korunur.' }
                    ]
                }
            };

            const ClinicalPlacementRules = {
                preop: {
                    identity: { zone: 'hasta bakım çekirdeği', x: [0.1, 4.5], z: [-3.9, -0.4] },
                    headwall: { zone: 'baş ucu medikal aksı', x: [0.4, 3.8], z: [-5.25, -3.75] },
                    'baseline-vitals': { zone: 'hasta başı görünür monitör alanı', x: [3.2, 5.5], z: [-3.5, -1.0] },
                    'iv-access': { zone: 'yatağın erişilebilir yan alanı', x: [-0.9, 1.2], z: [-3.3, -1.0] },
                    'preop-nurse-3d': { zone: 'hasta yatağı yanında hemşire erişimi', x: [2.2, 4.4], z: [-2.3, -0.1] },
                    'family-relative-3d': { zone: 'bakım çekirdeği dışındaki aile alanı', x: [4.1, 6.3], z: [0.0, 3.0] },
                    'family-area': { zone: 'aile destek alanı', x: [4.0, 6.4], z: [0.4, 3.2] },
                    'hand-hygiene': { zone: 'girişe yakın el hijyeni alanı', x: [-6.3, -4.3], z: [-4.7, -2.7] },
                    'npo-labs': { zone: 'hazırlık/kayıt alanı', x: [-5.9, -2.8], z: [-1.5, 2.8] },
                    prep: { zone: 'hazırlık malzemesi alanı', x: [-5.9, -2.2], z: [-0.8, 3.5] },
                    'prep-storage': { zone: 'temiz malzeme alanı', x: [-5.9, -2.2], z: [-0.8, 3.5] },
                    'consent-site': { zone: 'hasta başı doğrulama alanı', x: [0.4, 4.6], z: [-3.6, -0.2] }
                },
                intraop: {
                    'time-out': { zone: 'operatif çekirdek', x: [-1.2, 2.4], z: [-1.6, 1.5] },
                    'light-timeout': { zone: 'operatif masa üstü', x: [-1.0, 2.2], z: [-1.5, 1.4] },
                    signin: { zone: 'baş uç anestezi alanı', x: [-3.8, -2.1], z: [-1.1, 1.3] },
                    'intraop-monitor': { zone: 'anestezi ekibinin görüş hattı', x: [-3.4, -2.3], z: [-1.3, -0.1] },
                    surgeon: { zone: 'operatif alan', x: [-0.1, 0.4], z: [0.2, 1.0] },
                    'scrub-nurse-3d': { zone: 'Mayo masası ve steril saha hattı', x: [0.9, 1.5], z: [-0.9, -0.1] },
                    'assistant-scrub-nurse-3d': { zone: 'Mayo masasının sol steril hattı', x: [-0.1, 0.5], z: [-0.9, -0.1] },
                    'mayo-stand': { zone: 'steril çekirdek', x: [0.4, 1.0], z: [-0.9, -0.2] },
                    'sterile-table': { zone: 'scrub erişimli arka steril alan', x: [1.7, 2.7], z: [-1.5, -0.4] },
                    'cpb-machine': { zone: 'perfüzyon alanı; kompakt KPB güvenlik hattı', x: [3.6, 4.7], z: [-0.2, 0.8] },
                    'perfusion-console': { zone: 'KPB konsol hattı', x: [3.0, 3.9], z: [-1.2, -0.2] },
                    perfusionist: { zone: 'perfüzyonist çalışma hattı', x: [4.0, 4.9], z: [-1.3, -0.4] },
                    'anaesthesia-team': { zone: 'baş uç anestezi alanı', x: [-2.9, -1.9], z: [-0.1, 1.0] },
                    'circulating-nurse': { zone: 'steril çekirdek dışı sirkülasyon hattı', x: [4.4, 5.3], z: [1.4, 2.4] },
                    'count-board': { zone: 'sirküle hattındaki mobil sayım istasyonu', x: [3.7, 4.6], z: [1.9, 2.6] },
                    specimen: { zone: 'numune etiketleme noktası', x: [6.1, 6.9], z: [1.1, 1.8] },
                    'or-hand-hygiene': { zone: 'ameliyathane giriş temiz alanı', x: [-7.2, -6.1], z: [3.4, 4.3] },
                    'waste-flow': { zone: 'kirli atık akış alanı', x: [6.3, 7.0], z: [2.1, 3.0] }
                },
                postop: {
                    'pacu-bed': { zone: 'PACU izlem çekirdeği', x: [-2.2, 2.4], z: [-2.2, 1.6] },
                    headwall: { zone: 'baş ucu oksijen/vakum hattı', x: [-2.0, 2.0], z: [-4.7, -3.0] },
                    'pacu-monitor': { zone: 'hasta başı görünür monitör hattı', x: [1.2, 3.2], z: [-2.2, 0.1] },
                    analgesia: { zone: 'hemşire erişimli IV/analjezi alanı', x: [-3.0, -0.7], z: [-1.4, 0.9] },
                    drain: { zone: 'yatak kenarı görünür dren alanı', x: [0.4, 2.2], z: [0.1, 1.6] },
                    oxygen: { zone: 'baş ucu hava yolu alanı', x: [-1.5, 1.7], z: [-3.8, -1.7] },
                    'pacu-hand-hygiene': { zone: 'PACU giriş el hijyeni alanı', x: [-6.2, -4.0], z: [-4.3, -2.3] },
                    handoff: { zone: 'SBAR teslim/kayıt alanı', x: [3.2, 5.8], z: [0.1, 2.4] },
                    'pacu-nurse-3d': { zone: 'hasta yatağı yanında PACU hemşire erişimi', x: [-2.7, 0.4], z: [-1.5, 1.3] },
                    documentation: { zone: 'teslim ve kayıt alanı', x: [3.3, 5.9], z: [0.3, 2.7] },
                    'family-area': { zone: 'bakım çekirdeği dışı aile bilgilendirme alanı', x: [4.0, 6.4], z: [2.2, 4.2] },
                    'family-relative-3d': { zone: 'aile bilgilendirme alanı', x: [4.0, 6.4], z: [2.2, 4.2] },
                    neuro: { zone: 'hasta başı bilinç/deliryum gözlem alanı', x: [-1.8, 1.8], z: [-1.8, 1.5] },
                    mobilisation: { zone: 'güvenli mobilizasyon hazırlık hattı', x: [-2.5, 2.5], z: [1.2, 3.6] }
                }
            };

            function escapeClinicalHTML(v) {
                return String(v ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
            }

            function normaliseClinicalKey(label, opts) {
                if (opts && opts.clinicalKey) return opts.clinicalKey;
                const s = String(label || '').toLocaleLowerCase('tr-TR');
                if (s.includes('alerji') || s.includes('lateks') || s.includes('risk bilek')) return 'allergy-risk';
                if (s.includes('bileklik') || s.includes('kimlik')) return 'identity';
                if (s.includes('onam')) return 'consent';
                if (s.includes('cerrahi bölge') || s.includes('taraf') || s.includes('site')) return 'surgical-site';
                if (s.includes('time-out') || s.includes('timeout')) return 'time-out';
                if (s.includes('antibiyotik') || s.includes('profilaksi')) return 'antibiotic-prophylaxis';
                if (s.includes('sayım')) return 'count-board';
                if (s.includes('numune') || s.includes('etiket')) return 'specimen';
                if (s.includes('monitör')) return App.currentRoom === 'postop' ? 'pacu-monitor' : (App.currentRoom === 'intraop' ? 'intraop-monitor' : 'baseline-vitals');
                if (s.includes('mayo')) return 'mayo-stand';
                if (s.includes('kalp') || s.includes('akciğer')) return 'cpb-machine';
                if (s.includes('hijyen')) return App.currentRoom === 'intraop' ? 'or-hand-hygiene' : (App.currentRoom === 'postop' ? 'pacu-hand-hygiene' : 'hand-hygiene');
                if (s.includes('dren')) return 'drain';
                if (s.includes('oksijen')) return 'oxygen';
                if (s.includes('ağrı') || s.includes('analjezi')) return 'analgesia';
                if (s.includes('sbar') || s.includes('teslim')) return 'handoff';
                if (s.includes('ısı') || s.includes('hipotermi') || s.includes('battaniye')) return 'hypothermia';
                return 'generic-clinical-object';
            }

            const CriticalClinicalLearningCatalog = {
                identity: {
                    title: 'Kimlik Doğrulama',
                    objective: 'Öğrenci, cerrahi işlem öncesinde hastayı en az iki tanımlayıcı ile doğrular.',
                    why: 'Yanlış hasta veya yanlış işlem riski cerrahi güvenliğin en kritik ve önlenebilir hatalarındandır.',
                    action: 'Ad-soyad, doğum tarihi/protokol numarası ve bileklik bilgisi hasta dosyası ve sözlü beyanla karşılaştırılır.',
                    critical: 'Kimlik doğrulaması yapılmadan hastanın ameliyathaneye transfer edilmesi veya işleme alınması.',
                    checklist: 'WHO SSC Sign In · Hasta kimliği doğrulama', sound: 'identity'
                },
                'allergy-risk': {
                    title: 'Alerji ve Lateks Riski',
                    objective: 'Öğrenci, ilaç, lateks, antiseptik ve kan ürünü uygulamaları öncesinde alerji bilgisini doğrular.',
                    why: 'Alerji bilgisinin atlanması anafilaksi, ciddi ilaç reaksiyonu veya lateks maruziyeti gibi hasta güvenliği olaylarına yol açabilir.',
                    action: 'Alerji bilekliği, hasta beyanı ve dosya bilgisi karşılaştırılır; risk Time-out sırasında ekibe açıkça bildirilir.',
                    critical: 'Alerji doğrulanmadan antibiyotik, antiseptik, lateks içeren malzeme veya kan ürünü uygulanması.',
                    checklist: 'Alerji doğrulama · İlaç güvenliği · WHO SSC', sound: 'identity'
                },
                consent: {
                    title: 'Cerrahi Onam',
                    objective: 'Öğrenci, cerrahi girişim öncesinde geçerli ve imzalı onamın varlığını kontrol eder.',
                    why: 'Onam eksikliği etik, hukuki ve hasta güvenliği açısından ciddi bir sorundur.',
                    action: 'İşlem adı, taraf/bölge, hasta imzası ve hekim bilgilendirmesi kontrol edilir; uyumsuzluk varsa transfer durdurulur.',
                    critical: 'Onam formu doğrulanmadan hastanın cerrahi sürece alınması.',
                    checklist: 'Preop hazırlık · Cerrahi onam kontrolü', sound: 'identity'
                },
                'surgical-site': {
                    title: 'Cerrahi Taraf/Bölge Doğrulama',
                    objective: 'Öğrenci, doğru taraf ve doğru cerrahi bölgeyi işlem öncesinde doğrular.',
                    why: 'Yanlış taraf cerrahisi önlenebilir fakat yüksek etkili bir güvenlik olayıdır.',
                    action: 'Hasta beyanı, dosya, onam ve cerrahi işaretleme birlikte kontrol edilir; uyumsuzluk varsa süreç başlatılmaz.',
                    critical: 'Taraf/bölge doğrulanmadan hastanın transfer, anestezi veya kesi aşamasına geçirilmesi.',
                    checklist: 'WHO SSC Sign In · Time-out', sound: 'identity'
                },
                'npo-labs': {
                    title: 'NPO ve Laboratuvar Kontrolü',
                    objective: 'Öğrenci, açlık süresi ve gerekli laboratuvar sonuçlarını cerrahi hazırlık kararıyla ilişkilendirir.',
                    why: 'NPO bilgisinin veya kritik laboratuvar değerlerinin atlanması aspirasyon, kanama ve metabolik bozulma riskini artırır.',
                    action: 'Son oral alım zamanı, kan şekeri, hemoglobin, koagülasyon ve gerekli istemler hasta dosyasıyla kontrol edilir.',
                    critical: 'Açlık süresi veya kritik laboratuvar değeri doğrulanmadan hastanın ameliyathaneye gönderilmesi.',
                    checklist: 'Preop hazırlık · NPO · Laboratuvar kontrolü', sound: 'equipment'
                },
                'baseline-vitals': {
                    title: 'Temel Yaşam Bulguları',
                    objective: 'Öğrenci, preoperatif yaşam bulgularını cerrahi risk ve transfer kararı açısından değerlendirir.',
                    why: 'Hipotansiyon, taşikardi, ateş veya düşük SpO₂ ameliyat öncesi klinik planı değiştirebilir.',
                    action: 'Kan basıncı, nabız, solunum, SpO₂, vücut sıcaklığı ve ağrı birlikte değerlendirilir; anormal bulgu ekibe bildirilir.',
                    critical: 'Anormal yaşam bulguları fark edilmeden hastanın cerrahi sürece ilerletilmesi.',
                    checklist: 'Preop vital bulgu · Klinik stabilite', sound: 'monitor'
                },
                'time-out': {
                    title: 'Time-out',
                    objective: 'Öğrenci, ekip duraklamasıyla doğru hasta, doğru işlem, doğru taraf ve kritik riskleri birlikte doğrular.',
                    why: 'Time-out; yanlış işlem, yanlış taraf, profilaksi eksikliği ve ekip iletişimi hatalarını azaltan ana güvenlik bariyeridir.',
                    action: 'Cerrah, anestezi ekibi, scrub ve sirküle hemşire birlikte durur; kimlik, işlem, taraf/bölge, profilaksi, görüntüleme ve özel riskler sesli teyit edilir.',
                    critical: 'Ekip doğrulaması yapılmadan insizyon veya girişime başlanması.',
                    checklist: 'WHO SSC Time-out', sound: 'timeout'
                },
                signin: {
                    title: 'Sign-in / Anestezi Öncesi Kontrol',
                    objective: 'Öğrenci, anestezi öncesi alerji, hava yolu, kanama riski ve ekipman hazır oluşunu sistematik kontrol eder.',
                    why: 'İndüksiyon öncesi fark edilmeyen riskler hızlı ve geri dönüşü zor güvenlik olaylarına dönüşebilir.',
                    action: 'Alerji, hava yolu riski, aspirasyon riski, kan hazırlığı, monitörizasyon ve anestezi ekipmanı doğrulanır.',
                    critical: 'Anestezi öncesi riskler doğrulanmadan indüksiyon aşamasına geçilmesi.',
                    checklist: 'WHO SSC Sign In · Anestezi güvenliği', sound: 'timeout'
                },
                'antibiotic-prophylaxis': {
                    title: 'Antibiyotik Profilaksisi',
                    objective: 'Öğrenci, antibiyotik profilaksisinin doğru ilaç, doğru zaman ve alerji bilgisiyle uyumunu kontrol eder.',
                    why: 'Profilaksinin atlanması veya yanlış zamanlanması cerrahi alan enfeksiyonu riskini artırır; alerji atlanırsa ciddi reaksiyon gelişebilir.',
                    action: 'Alerji, istem, uygulama zamanı ve ekip bildirimi kontrol edilir; kesi öncesi Time-out sırasında doğrulanır.',
                    critical: 'Alerji ve zamanlama kontrolü yapılmadan profilaksi uygulanması veya profilaksinin kesi öncesi doğrulanmaması.',
                    checklist: 'Antibiyotik profilaksisi · Alerji · Time-out', sound: 'timeout'
                },
                'count-board': {
                    title: 'Sayım Güvenliği',
                    objective: 'Öğrenci, spanç, iğne ve alet sayımının sirküle, scrub ve cerrah arasında üçlü doğrulama ile yapılmasını açıklar.',
                    why: 'Eksik veya hatalı sayım, hastada yabancı cisim kalması gibi ciddi ve önlenebilir bir güvenlik olayına yol açabilir.',
                    action: 'Sirküle hemşire sayar ve kaydeder; scrub steril alanda doğrular; cerrah kavite kapatma öncesi sayım uygunluğunu teyit eder.',
                    critical: 'Sayım uyuşmazlığı çözülmeden veya cerrah onayı alınmadan cerrahi alanın kapatılması.',
                    checklist: 'WHO SSC Sign Out · Üçlü sayım doğrulaması', sound: 'count'
                },
                'forced-air-warmer': {
                    title: 'Aktif Isıtma ve Normotermi',
                    objective: 'Öğrenci, CABG sırasında forced-air alt vücut ısıtmasının hipotermi önlemedeki rolünü açıklar.',
                    why: 'Perioperatif hipotermi cerrahi alan enfeksiyonu, kanama, koagülasyon bozulması ve titremeye bağlı oksijen tüketimi riskini artırır.',
                    action: 'Isıtma ünitesi, hortum bağlantısı ve alt vücut battaniyesi kontrol edilir; sıcaklık intraoperatif süreçte düzenli izlenir.',
                    critical: 'Aktif ısıtmanın başlatılmaması, hortumun steril alanı kesmesi veya battaniyenin sternotomi sahasını kapatması.',
                    checklist: 'Normotermi · Forced-air ısıtma · Sıcaklık izlemi', sound: 'equipment'
                },
                specimen: {
                    title: 'Numune Etiketleme',
                    objective: 'Öğrenci, cerrahi numunenin doğru hasta, doğru örnek ve doğru etiketle gönderilmesini sağlar.',
                    why: 'Yanlış etiketleme tanı, tedavi ve hukuki süreçlerde ciddi hatalara neden olabilir.',
                    action: 'Numune adı, hasta kimliği, alınan bölge ve etiket bilgisi ekip ile sesli doğrulanır; kayıt tamamlanır.',
                    critical: 'Numune hasta kimliği veya örnek bilgisi doğrulanmadan laboratuvara gönderilmesi.',
                    checklist: 'WHO SSC Sign Out · Numune güvenliği', sound: 'label'
                },
                'intraop-monitor': {
                    title: 'İntraoperatif Monitörizasyon',
                    objective: 'Öğrenci, anestezi sürecinde monitör alarmı ve hemodinamik değişimleri hasta güvenliğiyle ilişkilendirir.',
                    why: 'Hipotansiyon, hipoksemi, aritmi veya kanama bulguları ameliyathanede hızlı müdahale gerektirir.',
                    action: 'Monitör değerleri anestezi ekibiyle birlikte izlenir; kritik değişiklik sirküle hemşire ve cerrahi ekibe bildirilir.',
                    critical: 'Alarm veya anormal vital bulgunun fark edilmeden cerrahi sürecin devam etmesi.',
                    checklist: 'Anestezi monitörizasyonu · Ekip iletişimi', sound: 'monitor'
                },
                'pacu-monitor': {
                    title: 'PACU Monitörizasyonu',
                    objective: 'Öğrenci, SpO₂, solunum, hemodinami ve bilinç izlemini erken postoperatif güvenlikle ilişkilendirir.',
                    why: 'Sedasyon, hipoventilasyon, ağrı, kanama ve deliryum erken dönemde monitör ve klinik gözlemle yakalanır.',
                    action: 'SpO₂, solunum sayısı, kan basıncı, nabız, bilinç ve ağrı düzenli aralıklarla değerlendirilir; bozulma bildirilir.',
                    critical: 'PACU’da alarm veya klinik kötüleşmenin geç fark edilmesi.',
                    checklist: 'PACU kabul · Erken izlem · Monitörizasyon', sound: 'monitor'
                },
                drain: {
                    title: 'Dren ve Kanama İzlemi',
                    objective: 'Öğrenci, dren miktarı, rengi ve ani artışı postoperatif kanama riski açısından değerlendirir.',
                    why: 'Postoperatif kanama erken fark edilmezse hipovolemi ve hemodinamik bozulma gelişebilir.',
                    action: 'Drenaj miktarı, rengi, pıhtı varlığı ve vital bulgular birlikte izlenir; ani artışta ekip bilgilendirilir.',
                    critical: 'Artan drenaj veya kanama bulgusu fark edilmeden izlem aralığının uzatılması.',
                    checklist: 'Dren/kanama izlemi · PACU güvenliği', sound: 'alarm'
                },
                oxygen: {
                    title: 'Oksijen ve Hava Yolu',
                    objective: 'Öğrenci, oksijen desteğini SpO₂, solunum sayısı ve hava yolu açıklığı ile birlikte değerlendirir.',
                    why: 'Hipoksemi PACU’da hızlı gelişebilir ve erken müdahale edilmezse ciddi komplikasyona dönüşebilir.',
                    action: 'Oksijen uygulaması, maske/kanül yerleşimi, SpO₂, solunum paterni ve bilinç düzeyi birlikte kontrol edilir.',
                    critical: 'Düşük SpO₂ veya hava yolu sorunu fark edilmeden hastanın izlenmesi.',
                    checklist: 'PACU hava yolu · Oksijen · SpO₂', sound: 'oxygen'
                },
                analgesia: {
                    title: 'Ağrı ve Analjezi',
                    objective: 'Öğrenci, ağrı değerlendirmesi, analjezi uygulaması ve yeniden değerlendirmeyi bakım döngüsü olarak uygular.',
                    why: 'Kontrolsüz ağrı solunum egzersizi, mobilizasyon, uyku ve deliryum riskini olumsuz etkiler.',
                    action: 'Ağrı skoru alınır, isteme uygun analjezi uygulanır ve etki belirlenen sürede yeniden değerlendirilir.',
                    critical: 'Ağrı değerlendirilmeden analjezi verilmesi veya analjezi sonrası yeniden değerlendirme yapılmaması.',
                    checklist: 'Ağrı değerlendirme · Analjezi · Yeniden değerlendirme', sound: 'equipment'
                },
                handoff: {
                    title: 'SBAR Teslim',
                    objective: 'Öğrenci, hasta devrini yapılandırılmış iletişim ve bakım sürekliliği için SBAR formatında yapar.',
                    why: 'Eksik teslim; alerji, ilaç, dren, ağrı, komplikasyon ve özel bakım gereksinimlerinin kaybına yol açar.',
                    action: 'Durum, arka plan, değerlendirme ve öneri kısa ve net biçimde aktarılır; kritik riskler özellikle vurgulanır.',
                    critical: 'Alerji, kanama, dren, ağrı veya vital bozulma bilgisi teslim sırasında aktarılmadan hastanın devredilmesi.',
                    checklist: 'SBAR · PACU/servis teslimi', sound: 'handoff'
                },
                hypothermia: {
                    title: 'Hipotermi Önleme',
                    objective: 'Öğrenci, perioperatif hipotermi riskini sıcaklık izlemi ve ısıtma önlemleriyle yönetir.',
                    why: 'Hipotermi kanama, enfeksiyon, kardiyak stres ve iyileşme gecikmesiyle ilişkilidir.',
                    action: 'Vücut sıcaklığı izlenir, aktif ısıtma planlanır ve transfer boyunca ısı kaybı azaltılır.',
                    critical: 'Hipotermi riski olan hastada sıcaklık izlemi ve ısıtma önlemlerinin atlanması.',
                    checklist: 'Hipotermi önleme · Sıcaklık izlemi', sound: 'equipment'
                },
                neuro: {
                    title: 'Bilinç ve Deliryum İzlemi',
                    objective: 'Öğrenci, bilinç, oryantasyon ve deliryum belirtilerini erken postoperatif izlemle ilişkilendirir.',
                    why: 'Erken deliryum düşme, ajitasyon, tedaviye uyumsuzluk ve bakım yükü açısından kritik bir güvenlik riskidir.',
                    action: 'Bilinç durumu, oryantasyon, ajitasyon, dikkat ve çevresel riskler düzenli değerlendirilir; değişiklik bildirilir.',
                    critical: 'Yeni gelişen konfüzyon veya ajitasyonun ağrı/sedasyon etkisi sanılarak değerlendirilmemesi.',
                    checklist: 'Bilinç izlemi · Deliryum riski · Hasta güvenliği', sound: 'neuro'
                }
            };

            function clinicalLearningAlias(rawKey) {
                const key = String(rawKey || '');
                if (key === 'preop-allergy' || key === 'allergy' || key === 'latex') return 'allergy-risk';
                if (key === 'site' || key === 'surgical-site-mark' || key === 'site-verification' || key === 'consent-site') return 'surgical-site';
                if (key === 'profilaxis' || key === 'prophylaxis' || key === 'antibiotic') return 'antibiotic-prophylaxis';
                if (key === 'timeout' || key === 'light-timeout') return 'time-out';
                if (key === 'count' || key === 'sponge-count' || key === 'instrument-count') return 'count-board';
                if (key === 'label' || key === 'sample' || key === 'specimen-label') return 'specimen';
                if (key === 'pain') return 'analgesia';
                if (key === 'handover' || key === 'transfer') return 'handoff';
                return key;
            }

            function getCriticalClinicalLearning(label, desc, opts) {
                const rawKey = normaliseClinicalKey(label, opts || {});
                const key = clinicalLearningAlias(rawKey);
                const base = CriticalClinicalLearningCatalog[key];
                if (!base) return null;
                return {
                    ...base,
                    action: base.action,
                    critical: base.critical,
                    key
                };
            }

            function enrichClinicalLearning(label, desc, opts) {
                return getCriticalClinicalLearning(label, desc, opts || {});
            }

            function ensureTeachingPanel() {
                const shell = $('#scene-shell');
                if (!shell) return;
                let p = $('#clinical-teaching-panel');
                if (!p) {
                    p = document.createElement('div');
                    p.id = 'clinical-teaching-panel';
                    p.className = 'clinical-teaching-panel collapsed';
                    shell.appendChild(p);
                }
                const meta = RoomTeachingMeta[App.currentRoom] || RoomTeachingMeta.preop;
                p.innerHTML = '<div class="clinical-panel-head"><div class="clinical-panel-title">3D Öğrenme Katmanı</div><button class="clinical-panel-toggle" id="clinical-teaching-toggle" type="button">Aç</button></div>' +
                    '<div class="clinical-teaching-body"><div class="clinical-room-goal"><b>Bu fazın hedefi:</b> ' + escapeClinicalHTML(meta.goal) + '</div>' +
                    '<div class="clinical-zone-list">' + meta.zones.map(z => '<div class="clinical-zone-row"><span class="clinical-zone-dot" style="background:#' + z.color.toString(16).padStart(6,'0') + '"></span><span><b>' + escapeClinicalHTML(z.label) + '</b><br>' + escapeClinicalHTML(z.text) + '</span></div>').join('') + '</div></div>';
                const btn = $('#clinical-teaching-toggle');
                btn.onclick = () => {
                    p.classList.toggle('collapsed');
                    btn.textContent = p.classList.contains('collapsed') ? 'Aç' : 'Kapat';
                };
            }

            const ClinicalAudio = window.ClinicalAudio = {
                enabled: true,
                ambience: true,
                volume: 0.42,
                ctx: null,
                master: null,
                interval: null,
                lastCue: 0,
                unlock() {
                    try {
                        if (!this.ctx) {
                            const AC = window.AudioContext || window.webkitAudioContext;
                            if (!AC) return false;
                            this.ctx = new AC();
                            this.master = this.ctx.createGain();
                            this.master.gain.value = this.volume;
                            this.master.connect(this.ctx.destination);
                        }
                        if (this.ctx.state === 'suspended') this.ctx.resume();
                        return true;
                    } catch(e) { console.warn('Ses motoru başlatılamadı', e); return false; }
                },
                setEnabled(v) {
                    this.enabled = !!v;
                    if (this.enabled) { this.unlock(); this.playCue('ready'); }
                    else this.stopAmbience();
                    this.updatePanel();
                    try { localStorage.setItem('nursekit_audio_enabled_v1', this.enabled ? '1' : '0'); } catch(e){}
                },
                setAmbience(v) {
                    this.ambience = !!v;
                    if (this.ambience && this.enabled) this.startAmbience(); else this.stopAmbience();
                    this.updatePanel();
                    try { localStorage.setItem('nursekit_audio_ambience_v1', this.ambience ? '1' : '0'); } catch(e){}
                },
                setVolume(v) {
                    this.volume = Math.max(0, Math.min(1, Number(v) || 0));
                    if (this.master) this.master.gain.value = this.volume;
                    try { localStorage.setItem('nursekit_audio_volume_v1', String(this.volume)); } catch(e){}
                    this.updatePanel(false);
                },
                osc(freq, dur, type='sine', gain=0.05, delay=0) {
                    if (!this.enabled || !this.unlock() || !this.ctx || !this.master) return;
                    const now = this.ctx.currentTime + delay;
                    const o = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    o.type = type; o.frequency.setValueAtTime(freq, now);
                    g.gain.setValueAtTime(0.0001, now);
                    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + 0.012);
                    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
                    o.connect(g); g.connect(this.master);
                    o.start(now); o.stop(now + dur + 0.03);
                },
                noise(dur=0.25, gain=0.025) {
                    if (!this.enabled || !this.unlock() || !this.ctx || !this.master) return;
                    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
                    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i=0; i<len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i/len);
                    const src = this.ctx.createBufferSource();
                    const g = this.ctx.createGain();
                    const f = this.ctx.createBiquadFilter();
                    f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.8;
                    g.gain.value = gain;
                    src.buffer = buffer; src.connect(f); f.connect(g); g.connect(this.master); src.start();
                },
                playCue(name) {
                    if (!this.enabled) return;
                    const now = Date.now();
                    if (now - this.lastCue < 120 && name !== 'alarm') return;
                    this.lastCue = now;
                    if (name === 'ready') { this.osc(660, .07, 'sine', .045); this.osc(880, .08, 'sine', .035, .08); }
                    else if (name === 'select') this.osc(520, .045, 'triangle', .025);
                    else if (name === 'ok' || name === 'complete') { this.osc(620, .06, 'sine', .038); this.osc(820, .07, 'sine', .032, .07); }
                    else if (name === 'warn') { this.osc(360, .08, 'square', .028); this.osc(360, .08, 'square', .028, .14); }
                    else if (name === 'alarm') { this.osc(880, .10, 'square', .045); this.osc(880, .10, 'square', .045, .18); this.osc(660, .12, 'square', .035, .36); }
                    else if (name === 'monitor') this.osc(720, .055, 'sine', .030);
                    else if (name === 'cpb') { this.osc(120, .10, 'sawtooth', .022); this.osc(180, .08, 'triangle', .014, .09); }
                    else if (name === 'wash') { this.noise(.30, .026); this.osc(1500, .04, 'triangle', .012, .04); }
                    else if (name === 'timeout') { this.osc(440, .10, 'sine', .032); this.osc(660, .12, 'sine', .028, .12); this.osc(880, .14, 'sine', .026, .26); }
                    else if (name === 'count') { this.osc(540, .045, 'triangle', .025); this.osc(540, .045, 'triangle', .025, .08); this.osc(720, .05, 'triangle', .022, .16); }
                    else if (name === 'oxygen') this.osc(300, .18, 'sine', .020);
                    else if (name === 'handoff') { this.osc(500, .06, 'sine', .026); this.osc(700, .06, 'sine', .026, .08); }
                    else this.osc(480, .05, 'triangle', .022);
                },
                cueForTask(task) {
                    if (!task) return;
                    const s = String(task.label || '').toLocaleLowerCase('tr-TR');
                    if (s.includes('el hijyeni') || s.includes('aseptik')) this.playCue('wash');
                    else if (s.includes('time') || s.includes('sign') || s.includes('kontrol listesi')) this.playCue('timeout');
                    else if (s.includes('sayım')) this.playCue('count');
                    else if (s.includes('sbar') || s.includes('teslim')) this.playCue('handoff');
                    else if (s.includes('solunum') || s.includes('spo2') || s.includes('oksijen')) this.playCue('monitor');
                    else this.playCue('complete');
                },
                startAmbience() {
                    this.stopAmbience();
                    if (!this.enabled || !this.unlock()) return;
                    const room = App.currentRoom || 'preop';
                    const run = () => {
                        if (!this.enabled || !this.ambience) return;
                        if (room === 'intraop') this.playCue('cpb');
                        else {
                            const st = (typeof getSceneState === 'function') ? getSceneState() : null;
                            const alarm = room === 'postop' && st && st.criticalMissing && st.criticalMissing.length > 1;
                            this.playCue(alarm ? 'alarm' : 'monitor');
                        }
                    };
                    run();
                    const delay = room === 'intraop' ? 620 : (room === 'postop' ? 1150 : 1800);
                    this.interval = setInterval(run, delay);
                },
                stopAmbience() { if (this.interval) clearInterval(this.interval); this.interval = null; },
                refreshRoom() { if (this.ambience && this.enabled) this.startAmbience(); this.updatePanel(false); },
                updatePanel(full=true) {
                    const p = $('#clinical-audio-panel'); if (!p) return;
                    const toggle = $('#clinical-audio-toggle');
                    const amb = $('#clinical-audio-ambience');
                    const vol = $('#clinical-audio-volume');
                    const level = $('#clinical-audio-level');
                    if (toggle) { toggle.textContent = this.enabled ? 'Ses Açık' : 'Ses Kapalı'; toggle.classList.toggle('off', !this.enabled); }
                    if (amb) { amb.textContent = this.ambience ? 'Ambiyans Açık' : 'Ambiyans Kapalı'; amb.classList.toggle('off', !this.ambience); }
                    if (vol) vol.value = String(Math.round(this.volume * 100));
                    if (level) level.classList.toggle('on', !!this.enabled);
                },
                restore() {
                    try {
                        const v = localStorage.getItem('nursekit_audio_volume_v1');
                        if (v !== null) this.volume = Math.max(0, Math.min(1, Number(v)));
                        // v5.11: Klinik ses öğrenci arayüzünde görünmez; motor varsayılan olarak açık kalır.
                        this.enabled = true;
                        this.ambience = true;
                        localStorage.setItem('nursekit_audio_enabled_v1', '1');
                        localStorage.setItem('nursekit_audio_ambience_v1', '1');
                    } catch(e){
                        this.enabled = true;
                        this.ambience = true;
                    }
                }
            };
            ClinicalAudio.restore();
            (function initMonitorSoundControl(){
                try {
                    ClinicalAudio.monitorSound = localStorage.getItem('nursekit_monitor_sound_v1') !== '0';
                } catch(e) { ClinicalAudio.monitorSound = true; }
                if (!ClinicalAudio.__monitorCuePatched) {
                    const __playCue = ClinicalAudio.playCue.bind(ClinicalAudio);
                    ClinicalAudio.playCue = function(name) {
                        if ((name === 'monitor' || name === 'alarm') && this.monitorSound === false) return;
                        return __playCue(name);
                    };
                    ClinicalAudio.__monitorCuePatched = true;
                }
                ClinicalAudio.setMonitorSound = function(v, silent=false) {
                    this.monitorSound = !!v;
                    try { localStorage.setItem('nursekit_monitor_sound_v1', this.monitorSound ? '1' : '0'); } catch(e) {}
                    if (this.monitorSound) {
                        this.setEnabled(true);
                        if (!silent) { try { this.playCue('monitor'); } catch(e) {} }
                    }
                    try { refreshMonitorSoundToggleObjects?.(); } catch(e) {}
                    if (!silent && typeof showSceneReaction === 'function') {
                        showSceneReaction(this.monitorSound ? 'Monitör sesi açıldı.' : 'Monitör sesi kapatıldı.', this.monitorSound ? 'ok' : 'warn');
                    }
                };
                ClinicalAudio.toggleMonitorSound = function() { this.setMonitorSound(!this.monitorSound); };
                ClinicalAudio.monitorSoundLabel = function() { return this.monitorSound ? 'Monitör Sesi: Açık' : 'Monitör Sesi: Kapalı'; };
            })();

            function isMonitorClinicalObject(obj) {
                const key = String(obj?.opts?.clinicalKey || '').toLocaleLowerCase('tr-TR');
                const label = String(obj?.label || '').toLocaleLowerCase('tr-TR');
                return key.includes('monitor') || label.includes('monitör') || label.includes('monitor');
            }

            function refreshMonitorSoundToggleObjects() {
                (three.monitorSoundToggles || []).forEach(t => {
                    const on = ClinicalAudio.monitorSound !== false;
                    t.mesh.traverse?.(child => {
                        if (!child.material) return;
                        if (child.material.color) child.material.color.setHex(on ? 0x5cc4d6 : 0x7f8a96);
                        if (child.material.emissive) {
                            child.material.emissive.setHex(on ? 0x5cc4d6 : 0xd96371);
                            child.material.emissiveIntensity = on ? 0.36 : 0.14;
                        }
                        if (typeof child.material.opacity === 'number') child.material.opacity = on ? (child.userData?.baseOpacity || child.material.opacity || 0.75) : 0.42;
                    });
                    if (t.mesh.userData) t.mesh.userData.soundOn = on;
                });
            }

            function buildMonitorSoundToggleMesh(x, y, z) {
                const g = groupAt(x, y, z);
                g.name = 'monitor-sound-toggle-object';
                const body = box(0.16, 0.18, 0.10, 0x5cc4d6, 0, 1.26, 0, { emissive:0x5cc4d6, emissiveIntensity:0.30, roughness:0.42 });
                body.userData.baseOpacity = 1;
                g.add(body);
                const cone = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.16, 18), mat(0x5cc4d6, { emissive:0x5cc4d6, emissiveIntensity:0.24, roughness:0.42 }));
                cone.rotation.z = -Math.PI / 2;
                cone.position.set(0.13, 1.26, 0);
                prepMesh(cone); g.add(cone);
                [0.18, 0.28].forEach((r, ix) => {
                    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 8, 32), mat(0x5cc4d6, { transparent:true, opacity:0.55 - ix*0.12, emissive:0x5cc4d6, emissiveIntensity:0.24 }));
                    ring.scale.set(0.38, 1.0, 1.0);
                    ring.rotation.y = Math.PI / 2;
                    ring.position.set(0.22 + ix*0.08, 1.26, 0);
                    ring.userData.baseOpacity = 0.55 - ix*0.12;
                    prepMesh(ring); g.add(ring);
                });
                const hit = new THREE.Mesh(new THREE.SphereGeometry(0.30, 16, 10), new THREE.MeshBasicMaterial({ color:0x5cc4d6, transparent:true, opacity:0.035 }));
                hit.position.set(0.10, 1.26, 0);
                prepMesh(hit); g.add(hit);
                addAnimated(g, 'monitorTogglePulse', { baseY: y, amp: .018, speed: 1.6 });
                return g;
            }

            function addMonitorSoundToggleFor(obj) {
                // Monitör önündeki ayrı ses kontrol objesi kaldırıldı.
                // Ses aç/kapat işlevi popup içindeki küçük düğme üzerinden devam eder.
                return;
            }

            function handleDirectSceneObjectAction(obj) {
                // v5.16: Monitör ses objesi artık doğrudan sesi kesmek yerine popup açar;
                // başlık yanındaki küçük hoparlör düğmesi ile aç/kapat yapılır.
                if (obj?.opts?.directAction === 'toggle-monitor-sound') return false;
                return false;
            }

            function unlockClinicalAudioOnFirstGesture() {
                try {
                    ClinicalAudio.enabled = true;
                    ClinicalAudio.ambience = true;
                    ClinicalAudio.unlock();
                    ClinicalAudio.startAmbience();
                    ClinicalAudio.playCue('ready');
                } catch(e) {}
            }
            document.addEventListener('pointerdown', unlockClinicalAudioOnFirstGesture, { once: true, passive: true });
            document.addEventListener('keydown', unlockClinicalAudioOnFirstGesture, { once: true });

            function ensureClinicalAudioPanel() {
                // v5.11: Ses paneli öğrenci ekranından kaldırıldı; ses motoru arka planda açık kalır.
                ClinicalAudio.enabled = true;
                ClinicalAudio.ambience = true;
                try { ClinicalAudio.startAmbience(); } catch(e) {}
                return;
                const shell = $('#scene-shell');
                if (!shell) return;
                let p = $('#clinical-audio-panel');
                if (!p) {
                    p = document.createElement('div');
                    p.id = 'clinical-audio-panel';
                    p.className = 'clinical-audio-panel collapsed';
                    shell.appendChild(p);
                }
                p.innerHTML = '<div class="clinical-panel-head"><div class="clinical-panel-title"><span class="clinical-audio-level" id="clinical-audio-level"></span>Klinik Ses</div><button class="clinical-panel-toggle" id="clinical-audio-panel-toggle" type="button">Aç</button></div>' +
                    '<div class="clinical-audio-body"><div class="clinical-audio-grid"><button class="clinical-audio-btn" id="clinical-audio-toggle" type="button">Ses Kapalı</button><button class="clinical-audio-btn" id="clinical-audio-ambience" type="button">Ambiyans Kapalı</button><button class="clinical-audio-btn danger" id="clinical-audio-test" type="button">Alarm Test</button></div>' +
                    '<div class="clinical-audio-slider"><span>Ses</span><input id="clinical-audio-volume" type="range" min="0" max="100" value="42"></div>' +
                    '<div class="clinical-audio-note">Sesler sentetik üretilir: monitör bip, KPB pompa ritmi, el hijyeni, sayım, time-out ve kritik uyarı. Tarayıcı ilk kullanıcı tıklamasından sonra sesi başlatır.</div></div>';
                const togglePanel = $('#clinical-audio-panel-toggle');
                togglePanel.onclick = () => { p.classList.toggle('collapsed'); togglePanel.textContent = p.classList.contains('collapsed') ? 'Aç' : 'Kapat'; };
                $('#clinical-audio-toggle').onclick = () => ClinicalAudio.setEnabled(!ClinicalAudio.enabled);
                $('#clinical-audio-ambience').onclick = () => ClinicalAudio.setAmbience(!ClinicalAudio.ambience);
                $('#clinical-audio-test').onclick = () => { ClinicalAudio.setEnabled(true); ClinicalAudio.playCue('alarm'); };
                $('#clinical-audio-volume').oninput = e => ClinicalAudio.setVolume(Number(e.target.value)/100);
                ClinicalAudio.updatePanel();
                if (ClinicalAudio.enabled && ClinicalAudio.ambience) ClinicalAudio.startAmbience();
            }

            function speakClinicalText(text) {
                try {
                    if (!('speechSynthesis' in window)) { showSceneReaction('Bu tarayıcı sesli açıklama desteği vermiyor.', 'warn'); return; }
                    const clean = String(text || '').replace(/<[^>]+>/g, ' ').slice(0, 520);
                    if (!clean.trim()) return;
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(clean);
                    u.lang = 'tr-TR'; u.rate = 0.96; u.pitch = 0.92; u.volume = Math.max(0.25, ClinicalAudio.volume || 0.45);
                    window.speechSynthesis.speak(u);
                } catch(e) { console.warn('Sesli açıklama çalışmadı', e); }
            }

            function createZoneLabel(text, color) {
                const canvas = document.createElement('canvas');
                canvas.width = 512; canvas.height = 96;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,512,96);
                ctx.fillStyle = 'rgba(8,17,31,.78)';
                ctx.strokeStyle = '#' + color.toString(16).padStart(6,'0');
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.roundRect ? ctx.roundRect(8, 12, 496, 68, 12) : ctx.rect(8, 12, 496, 68); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#e8eef5';
                ctx.font = '600 24px Inter, Arial, sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(String(text).slice(0, 32), 256, 47);
                const texture = new THREE.CanvasTexture(canvas);
                const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(2.2, 0.42, 1);
                return sprite;
            }

            function createClinicalZone(zone) {
                if (!three.scene) return;
                const matZone = new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(zone.w, 0.026, zone.d), matZone);
                mesh.position.set(zone.x, 0.012, zone.z);
                mesh.name = 'ClinicalZone_' + zone.label;
                mesh.userData.nonInteractive = true;
                three.scene.add(mesh);
                const label = createZoneLabel(zone.label, zone.color);
                label.position.set(zone.x, 0.16, zone.z - zone.d/2 + 0.18);
                three.scene.add(label);
                three.clinicalZones = three.clinicalZones || [];
                three.clinicalZones.push({ mesh, label, zone });
            }

            function createClinicalZonesForRoom() {
                if (!three.scene) return;
                three.clinicalZones = [];
                const meta = RoomTeachingMeta[App.currentRoom] || RoomTeachingMeta.preop;
                meta.zones.forEach(createClinicalZone);
            }

            function createLearningHotspot(obj) {
                // Öğrenme hotspot halkaları kaldırıldı.
                // Görsel karmaşayı azaltmak için nesneler artık yalnızca kısa kritik etiketlerle gösterilir.
                return;
            }

            function attachClinicalMicroAnimation(obj) {
                try {
                    const key = obj?.opts?.clinicalKey || '';
                    const label = String(obj?.label || '').toLocaleLowerCase('tr-TR');
                    if (key === 'cpb-machine' || label.includes('kalp-akciğer')) {
                        const rotor = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 12, 32), new THREE.MeshStandardMaterial({ color: 0x5cc4d6, emissive: 0x5cc4d6, emissiveIntensity: 0.35, roughness: 0.32 }));
                        rotor.position.set(0, 0.92, 0.41); rotor.rotation.x = Math.PI / 2;
                        obj.mesh.add(rotor); addAnimated(rotor, 'clinicalSpin', { speed: 2.8 });
                    }
                    if (key === 'count-board') {
                        const pulse = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.035, 0.018), new THREE.MeshBasicMaterial({ color: 0xe0a558, transparent: true, opacity: 0.72 }));
                        pulse.position.set(0, 1.0, 0.08);
                        obj.mesh.add(pulse); addAnimated(pulse, 'clinicalScan', { speed: 2.2, amp: .18 });
                    }
                    if (String(key).includes('hand-hygiene')) {
                        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: 0x6f9fd8, transparent: true, opacity: 0.75 }));
                        drop.position.set(0.10, 1.20, 0.06);
                        obj.mesh.add(drop); addAnimated(drop, 'clinicalDrop', { baseY: 1.20, speed: 1.9, amp: .16 });
                    }
                } catch(e) { console.warn('Mikro animasyon eklenemedi', e); }
            }

            function validateObjectPlacement(obj) {
                if (!obj || !obj.opts) return { state: 'none', message: 'Bu nesne için özel hasta güvenliği yerleşim kuralı tanımlı değildir.' };
                const key = obj.opts.clinicalKey;
                const rule = ClinicalPlacementRules[App.currentRoom]?.[key];
                if (!rule) return { state: 'none', message: 'Bu nesne için özel hasta güvenliği yerleşim kuralı tanımlı değildir.' };
                const x = obj.mesh.position.x, z = obj.mesh.position.z;
                const inside = x >= rule.x[0] && x <= rule.x[1] && z >= rule.z[0] && z <= rule.z[1];
                const learn = obj.opts.learning || enrichClinicalLearning(obj.label, obj.desc, obj.opts);
                if (inside) return { state: 'ok', message: 'Klinik yerleşim uygun: ' + rule.zone + '.' };
                return { state: 'danger', message: 'Uygun bölge dışı: ' + rule.zone + '. Risk: ' + (learn.wrong || 'iş akışı ve güvenli erişim bozulabilir.') };
            }

            function appendPlacementValidation() {
                const selectedEl = $('#placement-selected');
                const obj = three.placement?.selected;
                if (!selectedEl || !obj) return;
                const result = validateObjectPlacement(obj);
                const note = document.createElement('div');
                note.className = 'placement-clinical-note ' + (result.state === 'ok' ? 'ok' : (result.state === 'danger' ? 'danger' : ''));
                note.textContent = result.message;
                selectedEl.appendChild(note);
            }

            function buildClinicalLearningCard(obj) {
                const learn = getCriticalClinicalLearning(obj.label, obj.desc, obj.opts || {});
                if (!learn) return null;
                const card = document.createElement('div');
                card.className = 'clinical-learning-card critical-only';
                card.innerHTML = '<div class="cl-title">Klinik Güvenlik Kartı' + (learn.title ? ': ' + escapeClinicalHTML(learn.title) : '') + '</div>' +
                    '<div class="cl-row"><b>Öğrenme hedefi:</b> ' + escapeClinicalHTML(learn.objective) + '</div>' +
                    '<div class="cl-row"><b>Neden önemli?</b> ' + escapeClinicalHTML(learn.why) + '</div>' +
                    '<div class="cl-row"><b>Doğru eylem:</b> ' + escapeClinicalHTML(learn.action) + '</div>' +
                    '<div class="cl-row"><b>Kritik hata:</b> ' + escapeClinicalHTML(learn.critical) + '</div>' +
                    '<div class="cl-row"><b>İlişkili kontrol:</b> ' + escapeClinicalHTML(learn.checklist) + '</div>' +
                    '<div class="clinical-learning-actions"><button type="button" class="cl-speak">Sesli Açıkla</button><button type="button" class="cl-sound">Nesne Sesini Çal</button></div>';
                card.querySelector('.cl-speak').onclick = () => speakClinicalText(obj.label + '. ' + learn.objective + ' ' + learn.why + ' Doğru eylem: ' + learn.action + ' Kritik hata: ' + learn.critical);
                card.querySelector('.cl-sound').onclick = () => { ClinicalAudio.setEnabled(true); ClinicalAudio.playCue(learn.sound || 'equipment'); };
                return card;
            }

            function enhanceObjectPopupWithLearning(obj) {
                const p = $('#obj-popup');
                if (!p || !obj) return;
                const old = p.querySelector('.clinical-learning-card');
                if (old) old.remove();
                const card = buildClinicalLearningCard(obj);
                if (card) p.appendChild(card);
            }

            function updateAssetPanelForLearning() {
                const st = $('#scene-asset-status');
                if (!st) return;
                const meta = RoomTeachingMeta[App.currentRoom] || RoomTeachingMeta.preop;
                st.textContent = '3D sahne artık öğretim amaçlıdır: klinik bölgeler, yalnızca kritik nesnelerde Klinik Güvenlik Kartları, yerleşim doğrulama, sesli açıklama ve olay sesleri aktiftir. ' + meta.goal;
            }

            const __nk56_addObj = addObj;
            addObj = function(mesh, label, desc, opts = {}) {
                const merged = { ...(opts || {}) };
                merged.clinicalKey = normaliseClinicalKey(label, merged);
                const learning = enrichClinicalLearning(label, desc, merged);
                if (learning) merged.learning = merged.learning || learning;
                else merged.noLearningHotspot = true;
                const obj = __nk56_addObj(mesh, label, desc, merged);
                createLearningHotspot(obj);
                attachClinicalMicroAnimation(obj);
                try { addMonitorSoundToggleFor(obj); } catch(e) { console.warn('Monitör ses objesi eklenemedi', e); }
                return obj;
            };

            const __nk56_buildSceneForRoom = buildSceneForRoom;
            buildSceneForRoom = function() {
                const result = __nk56_buildSceneForRoom.apply(this, arguments);
                try {
                    createClinicalZonesForRoom();
                    ensureTeachingPanel();
                    ensureClinicalAudioPanel();
                    updateAssetPanelForLearning();
                    ClinicalAudio.refreshRoom();
                } catch(e) { console.warn('v5.6 öğrenme/ses katmanı sahneye eklenemedi', e); }
                return result;
            };

            const __nk56_animateScene = animateScene;
            animateScene = function() {
                __nk56_animateScene.apply(this, arguments);
                const t = performance.now() * 0.001;
                (three.animated || []).forEach(a => {
                    if (!a || !a.obj) return;
                    if (a.type === 'clinicalSpin') a.obj.rotation.z += 0.035 * (a.speed || 1);
                    else if (a.type === 'clinicalScan') a.obj.position.x = Math.sin(t * (a.speed || 2)) * (a.amp || .12);
                    else if (a.type === 'clinicalDrop') a.obj.position.y = (a.baseY || 1) - Math.abs(Math.sin(t * (a.speed || 2))) * (a.amp || .12);
                    else if (a.type === 'monitorTogglePulse') {
                        a.obj.position.y = (a.baseY || 0) + Math.sin(t * (a.speed || 1.6)) * (a.amp || .015);
                        a.obj.rotation.y += 0.006;
                    }
                });
            };

            const __nk56_showObjPopup = showObjPopup;
            showObjPopup = function(obj, x, y) {
                ClinicalAudio.playCue('select');
                __nk56_showObjPopup.apply(this, arguments);
                try { enhanceObjectPopupWithLearning(obj); } catch(e) { console.warn('Öğrenme kartı eklenemedi', e); }
            };

            const __nk56_updatePlacementPanel = updatePlacementPanel;
            updatePlacementPanel = function(msg) {
                const result = __nk56_updatePlacementPanel.apply(this, arguments);
                try { appendPlacementValidation(); } catch(e) {}
                return result;
            };

            const __nk56_moveSelectedPlacement = moveSelectedPlacement;
            moveSelectedPlacement = function(dt) {
                const moved = __nk56_moveSelectedPlacement.apply(this, arguments);
                if (moved) {
                    try {
                        const obj = three.placement?.selected;
                        const val = validateObjectPlacement(obj);
                        updatePlacementPanel(val.message);
                        if (val.state === 'danger') {
                            const now = Date.now();
                            if (!obj._lastPlacementWarn || now - obj._lastPlacementWarn > 2200) {
                                obj._lastPlacementWarn = now;
                                showSceneReaction(val.message, 'danger');
                            }
                        }
                    } catch(e) {}
                }
                return moved;
            };

            const __nk56_showSceneReaction = showSceneReaction;
            showSceneReaction = function(text, level = 'info') {
                const result = __nk56_showSceneReaction.apply(this, arguments);
                try {
                    if (level === 'danger') ClinicalAudio.playCue('alarm');
                    else if (level === 'warn') ClinicalAudio.playCue('warn');
                    else if (level === 'ok' || level === 'success') ClinicalAudio.playCue('ok');
                } catch(e) {}
                return result;
            };

            const __nk56_executeTaskCompletion = executeTaskCompletion;
            executeTaskCompletion = function(t, phase) {
                const result = __nk56_executeTaskCompletion.apply(this, arguments);
                try { ClinicalAudio.cueForTask(t); ClinicalAudio.refreshRoom(); } catch(e) {}
                return result;
            };

            const __nk56_switchRoom = switchRoom;
            switchRoom = function(rid) {
                const result = __nk56_switchRoom.apply(this, arguments);
                try { ClinicalAudio.refreshRoom(); } catch(e) {}
                return result;
            };

            const __nk56_disposeThree = disposeThree;
            disposeThree = function() {
                const result = __nk56_disposeThree.apply(this, arguments);
                three.clinicalZones = [];
                return result;
            };

            const __nk56_init = init;
            init = function() {
                const result = __nk56_init.apply(this, arguments);
                try { ensureClinicalAudioPanel(); } catch(e) {}
                return result;
            };

        })();



        /* ===================== NurseKit v5.7: Sabit Yerleşim + Gizli Karakter Animasyon Altyapısı ===================== */
        (function nurseKitCharacterMotionPatch(){
            function injectMotionStyles() {
                if (document.getElementById('nk57-motion-style')) return;
                const css = `
                    .placement-panel, #clinical-motion-panel, #nk58-pro-panel, #clinical-audio-panel, .clinical-audio-panel { display: none !important; }
                    .clinical-motion-panel {
                        position: absolute; right: 12px; bottom: 52px;
                        width: min(338px, calc(100% - 24px));
                        background: rgba(7,17,31,.84); border: 1px solid rgba(155,137,196,.40);
                        border-radius: 12px; padding: 10px 11px; backdrop-filter: blur(10px);
                        box-shadow: 0 18px 45px rgba(0,0,0,.32); z-index: 14;
                        color: var(--ink); font-size: 11px;
                    }
                    .clinical-motion-panel.collapsed .clinical-motion-body { display: none; }
                    .clinical-motion-head { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; }
                    .clinical-motion-title { color:#d1c4e9; font-size:10px; text-transform:uppercase; letter-spacing:.75px; font-weight:700; }
                    .clinical-motion-toggle, .clinical-motion-btn {
                        border:1px solid rgba(155,137,196,.45); background:rgba(155,137,196,.12); color:#d1c4e9;
                        border-radius:7px; padding:5px 8px; font-size:10px; cursor:pointer;
                    }
                    .clinical-motion-btn.stop { color: var(--red); border-color: rgba(217,99,113,.45); background: rgba(217,99,113,.08); }
                    .clinical-motion-grid { display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:8px; }
                    .clinical-motion-note { color: var(--ink-mute); line-height:1.38; font-size:10.5px; border-left:3px solid rgba(155,137,196,.55); padding:7px 8px; background:rgba(155,137,196,.07); border-radius:7px; }
                    .clinical-motion-steps { margin-top:8px; display:grid; gap:5px; }
                    .clinical-motion-step { display:grid; grid-template-columns: 18px 1fr; gap:6px; align-items:start; color:var(--ink-mute); }
                    .clinical-motion-step b { color: var(--ink); font-weight:600; }
                    .clinical-motion-step .n { width:17px; height:17px; border-radius:50%; display:grid; place-items:center; background:rgba(155,137,196,.18); color:#d1c4e9; font-family:var(--font-mono); font-size:9px; }
                    @media (max-width:980px){ .clinical-motion-panel { left:12px; right:12px; width:auto; bottom:12px; } }
                `;
                const style = document.createElement('style');
                style.id = 'nk57-motion-style';
                style.textContent = css;
                document.head.appendChild(style);
            }

            const MotionStepText = {
                preop: [
                    'Hemşire lavaboya yürür ve hasta temasından önce el hijyeni yapar.',
                    'Hemşire hasta başına döner; bileklik, onam ve taraf/bölge doğrulama aksını gösterir.',
                    'Hasta yakını bakım çekirdeği dışında kalır; iletişim kontrollü alanda yürütülür.'
                ],
                intraop: [
                    'Ekip ameliyat masası çevresinde durur; time-out için hareket kısa süreli durdurulur.',
                    'Scrub hemşiresi Mayo masasından cerraha alet uzatır; steril akış görünür hale gelir.',
                    'Sirküle hemşire sayım panosu ve numune etiketleme hattını kontrol eder.'
                ],
                postop: [
                    'PACU hemşiresi SBAR panosundan hasta başına geçer.',
                    'Hava yolu, SpO₂, ağrı, dren ve bilinç izlemi başucunda temsil edilir.',
                    'Aile bilgilendirmesi bakım çekirdeği dışında kontrollü alanda gösterilir.'
                ]
            };

            function ensureMotionPanel() { removeMotionPanelsIfAny(); }

            function escapeMotionHTML(s) {
                return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
            }

            function disableLayoutEditing() {
                try { if (three.placement) { three.placement.enabled = false; three.placement.selected = null; three.placement.panelOpen = false; } } catch(e) {}
            }
            function removeMotionPanelsIfAny() {
                try {
                    ['clinical-motion-panel','nk58-pro-panel'].forEach(id => document.getElementById(id)?.remove());
                } catch(e) {}
            }

            function actorKeyFromObj(obj) {
                return obj?.opts?.clinicalKey || obj?.label || '';
            }
            function registerClinicalActor(obj) {
                if (!obj || !obj.mesh) return;
                three.clinicalActors = three.clinicalActors || {};
                const key = actorKeyFromObj(obj);
                if (!key) return;
                three.clinicalActors[key] = obj;
                obj.mesh.userData.baseY = obj.mesh.position.y;
                obj.mesh.userData.baseRotationY = obj.mesh.rotation.y || 0;
            }
            function getActor(key) { return three.clinicalActors?.[key] || null; }
            function getObjByClinicalKey(key) { return (three.objects || []).find(o => o?.opts?.clinicalKey === key) || null; }

            function vec(x, y, z) { return new THREE.Vector3(x, y, z); }
            function ease(p) { p = Math.max(0, Math.min(1, p)); return p < .5 ? 2*p*p : 1 - Math.pow(-2*p + 2, 2)/2; }
            function faceObjectTo(obj, target) {
                if (!obj || !target) return;
                const dx = target.x - obj.mesh.position.x;
                const dz = target.z - obj.mesh.position.z;
                if (Math.abs(dx) + Math.abs(dz) > .001) obj.mesh.rotation.y = Math.atan2(dx, dz);
            }
            function scheduleMotion(event) {
                three.motionEvents = three.motionEvents || [];
                event.elapsed = 0;
                event.done = false;
                three.motionEvents.push(event);
            }
            function clearMotionProps() {
                (three.motionProps || []).forEach(m => { try { if (m.parent) m.parent.remove(m); else three.scene?.remove(m); } catch(e){} });
                three.motionProps = [];
            }
            function addMotionProp(mesh) {
                three.motionProps = three.motionProps || [];
                three.motionProps.push(mesh);
                three.scene?.add(mesh);
                return mesh;
            }
            function stopClinicalMotions(msg) {
                three.motionEvents = [];
                three.motionLast = performance.now();
                clearMotionProps();
                if (msg) showSceneReaction(msg, 'info');
            }

            function pathMove(actor, points, delay, duration, label) {
                if (!actor || !points || points.length < 2) return;
                const worldPoints = points.map(p => vec(p[0], p[1] ?? actor.mesh.position.y, p[2]));
                scheduleMotion({ type:'pathMove', actor, points: worldPoints, delay, duration, label });
            }
            function gesture(actor, kind, delay, duration, target) {
                if (!actor) return;
                scheduleMotion({ type:'gesture', actor, kind, delay, duration, target: target ? vec(target[0], target[1] || 0.9, target[2]) : null });
            }
            function focusRing(x, z, delay, duration, color = 0x5cc4d6, radius = 1.0, label = '') {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.025, 12, 64), new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0 }));
                ring.rotation.x = Math.PI / 2;
                ring.position.set(x, 0.055, z);
                addMotionProp(ring);
                scheduleMotion({ type:'ringPulse', prop:ring, delay, duration, label });
                return ring;
            }
            function floatingLabel(text, x, y, z, delay, duration, color = 0x5cc4d6) {
                const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 96;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'rgba(8,17,31,.82)'; ctx.fillRect(0,0,512,96);
                ctx.strokeStyle = '#'+color.toString(16).padStart(6,'0'); ctx.lineWidth = 3; ctx.strokeRect(2,2,508,92);
                ctx.fillStyle = '#e8eef5'; ctx.font = 'bold 28px Inter, Arial'; ctx.fillText(text, 22, 60);
                const texture = new THREE.CanvasTexture(canvas);
                const material = new THREE.SpriteMaterial({ map:texture, transparent:true, opacity:0 });
                const sprite = new THREE.Sprite(material); sprite.scale.set(2.25, .42, 1); sprite.position.set(x,y,z);
                addMotionProp(sprite); scheduleMotion({ type:'labelFade', prop:sprite, delay, duration }); return sprite;
            }
            function instrumentTransfer(scrub, surgeon, delay, duration) {
                if (!scrub || !surgeon) return;
                const inst = new THREE.Mesh(new THREE.BoxGeometry(.42,.035,.045), new THREE.MeshStandardMaterial({ color:0xe8eef5, metalness:.55, roughness:.23, emissive:0x9ec8d4, emissiveIntensity:.08 }));
                inst.position.copy(scrub.mesh.position).add(vec(-.10, 1.02, .05));
                addMotionProp(inst);
                scheduleMotion({ type:'propMove', prop:inst, from:inst.position.clone(), to: surgeon.mesh.position.clone().add(vec(.05, 1.03, .02)), delay, duration, spin:true });
            }
            function createFootprints(points, color = 0xd1c4e9) {
                if (!points || points.length < 2) return;
                for (let i=0; i<points.length-1; i++) {
                    const a = points[i], b = points[i+1];
                    for (let j=1; j<=4; j++) {
                        const p = j/5;
                        const x = a[0] + (b[0]-a[0])*p;
                        const z = a[2] + (b[2]-a[2])*p;
                        const fp = new THREE.Mesh(new THREE.BoxGeometry(.16,.012,.08), new THREE.MeshBasicMaterial({ color, transparent:true, opacity:.20 }));
                        fp.position.set(x, .034, z); fp.rotation.y = Math.atan2(b[0]-a[0], b[2]-a[2]);
                        addMotionProp(fp); scheduleMotion({ type:'labelFade', prop:fp, delay:i*.2+j*.06, duration:4.0 });
                    }
                }
            }

            function startClinicalMotionSequence(room) {
                stopClinicalMotions();
                disableLayoutEditing();
                ClinicalAudio?.setEnabled?.(true);
                if (room === 'preop') startPreopMotion();
                else if (room === 'intraop') startIntraopMotion();
                else startPostopMotion();
            }
            function startPreopMotion() {
                const nurse = getActor('preop-nurse-3d');
                const relative = getActor('family-relative-3d');
                if (!nurse) return showSceneReaction('Preop hemşiresi sahnede bulunamadı.', 'warn');
                const y = nurse.mesh.position.y;
                const path1 = [[nurse.mesh.position.x,y,nurse.mesh.position.z],[-1.0,y,-2.4],[-5.25,y,-3.62]];
                const path2 = [[-5.25,y,-3.62],[-1.15,y,-2.25],[3.30,y,-1.35]];
                createFootprints(path1.concat(path2.slice(1)), 0x5cc4d6);
                pathMove(nurse, path1, 0.1, 3.0, 'El hijyenine yürüme');
                gesture(nurse, 'wash', 3.2, 2.2, [-5.70,1.0,-3.85]);
                pathMove(nurse, path2, 5.6, 3.2, 'Hasta başına dönüş');
                gesture(nurse, 'checkWrist', 8.9, 2.4, [2.20,1.0,-2.10]);
                focusRing(2.20, -2.10, 8.7, 3.0, 0xe0a558, 1.05, 'Kimlik doğrulama');
                floatingLabel('EL HİJYENİ → KİMLİK/ONAM/TARAF DOĞRULAMA', -1.2, 2.6, -3.35, .35, 5.2, 0x5cc4d6);
                if (relative) { faceObjectTo(relative, vec(2.2,0,-2.1)); gesture(relative, 'waitOutside', 1.0, 8.0, [4.25,1,1.70]); }
                showSceneReaction('Preop animasyon: hemşire önce el hijyeni yapar, sonra hasta başında kimlik-onam-taraf doğrulama zincirini gösterir.', 'info');
                ClinicalAudio?.playCue?.('wash');
                setTimeout(()=>ClinicalAudio?.playCue?.('identity'), 5200);
            }
            function startIntraopMotion() {
                const scrub = getActor('scrub-nurse-3d');
                const scrub2 = getActor('assistant-scrub-nurse-3d');
                const surgeon = getActor('surgeon');
                const circ = getActor('circulating-nurse');
                const perf = getActor('perfusionist');
                const ana = getActor('anaesthesia-team');
                [scrub, scrub2, surgeon, circ, perf, ana].filter(Boolean).forEach(a => faceObjectTo(a, vec(.20,0,0)));
                focusRing(.20, 0.00, .15, 3.2, 0xe0a558, 1.62, 'Time-out');
                floatingLabel('TIME-OUT: ekip durur, hasta/işlem/taraf/risk yüksek sesle doğrulanır', -1.1, 2.65, .78, .25, 3.6, 0xe0a558);
                [scrub, scrub2, surgeon, circ, perf, ana].filter(Boolean).forEach((a,i) => gesture(a, 'timeoutFreeze', .25+i*.08, 3.2, [.20,1,0]));
                if (scrub) gesture(scrub, 'reachMayo', 3.65, 1.2, [.72,1,-.62]);
                if (scrub2) gesture(scrub2, 'timeoutFreeze', 3.55, 1.3, [.35,1,-.55]);
                instrumentTransfer(scrub, surgeon, 4.15, 1.8);
                if (surgeon) gesture(surgeon, 'receiveInstrument', 4.0, 2.2, [.12,1,-.05]);
                if (circ) { pathMove(circ, [[3.92,0,1.82],[2.10,0,0.38],[-0.95,0,1.35],[5.10,0,1.72]], 5.8, 3.2, 'Sayım ve numune hattı'); gesture(circ, 'count', 6.10, 2.6, [-0.95,1.1,1.35]); }
                focusRing(1.02, -0.86, 3.55, 3.0, 0x4cb88a, .72, 'Mayo');
                focusRing(-0.95, 1.35, 5.85, 3.0, 0xd96371, .72, 'Sayım');
                showSceneReaction('İntraop animasyon: ekip time-out için durur; scrub hemşiresi Mayo masasından cerraha alet uzatır; sirküle hemşire periferik hatta sayım ve numune akışını yönetir.', 'info');
                ClinicalAudio?.playCue?.('timeout');
                setTimeout(()=>ClinicalAudio?.playCue?.('sterile'), 4100);
                setTimeout(()=>ClinicalAudio?.playCue?.('count'), 6300);
            }
            function startPostopMotion() {
                const nurse = getActor('pacu-nurse-3d');
                const relative = getActor('family-relative-3d');
                if (!nurse) return showSceneReaction('PACU hemşiresi sahnede bulunamadı.', 'warn');
                const y = nurse.mesh.position.y;
                const path = [[nurse.mesh.position.x,y,nurse.mesh.position.z],[-4.70,y,-1.40],[-2.20,y,-.40],[-.35,y,-.30]];
                createFootprints(path, 0x9b89c4);
                pathMove(nurse, path, .1, 3.5, 'SBARdan başucuna geçiş');
                gesture(nurse, 'sbar', .75, 1.8, [-4.70,1,-1.40]);
                gesture(nurse, 'airwayCheck', 3.8, 2.4, [-.05,1,-.20]);
                focusRing(-.05, -.20, 3.6, 3.0, 0x5cc4d6, 1.12, 'PACU ilk değerlendirme');
                focusRing(1.10, .80, 5.2, 2.2, 0xd96371, .48, 'Dren');
                floatingLabel('SBAR → HAVA YOLU/SpO₂ → AĞRI/BİLİNÇ/DREN', -1.3, 2.55, -1.15, .25, 5.5, 0x9b89c4);
                if (relative) { faceObjectTo(relative, vec(4.25,0,1.70)); gesture(relative, 'familyBrief', 6.2, 3.2, [4.25,1,1.70]); }
                showSceneReaction('Postop animasyon: PACU hemşiresi SBAR bilgisini hasta başı ilk değerlendirmeye çevirir; aile bilgilendirmesi bakım çekirdeği dışında kalır.', 'info');
                ClinicalAudio?.playCue?.('handoff');
                setTimeout(()=>ClinicalAudio?.playCue?.('monitor'), 3800);
            }

            function updateClinicalMotions(dt) {
                const events = three.motionEvents || [];
                if (!events.length) return;
                let alive = [];
                for (const ev of events) {
                    ev.elapsed += dt;
                    if (ev.elapsed < (ev.delay || 0)) { alive.push(ev); continue; }
                    const local = ev.elapsed - (ev.delay || 0);
                    const p = Math.max(0, Math.min(1, local / Math.max(.001, ev.duration || 1)));
                    const ep = ease(p);
                    if (ev.type === 'pathMove') {
                        const actor = ev.actor;
                        const pts = ev.points || [];
                        const totalSegments = pts.length - 1;
                        const raw = ep * totalSegments;
                        const idx = Math.min(totalSegments - 1, Math.floor(raw));
                        const segP = raw - idx;
                        const a = pts[idx], b = pts[idx+1];
                        actor.mesh.position.lerpVectors(a, b, segP);
                        faceObjectTo(actor, b);
                        actor.mesh.position.y = (actor.mesh.userData.baseY || 0) + Math.abs(Math.sin(local * 10)) * .025;
                        actor.mesh.rotation.z = Math.sin(local * 11) * .018;
                    } else if (ev.type === 'faceAt') {
                        if (ev.actor && ev.target) faceObjectTo(ev.actor, ev.target);
                    } else if (ev.type === 'gesture') {
                        const actor = ev.actor;
                        if (ev.target) faceObjectTo(actor, ev.target);
                        const amp = Math.sin(p * Math.PI);
                        actor.mesh.rotation.z = (ev.kind === 'timeoutFreeze') ? 0 : Math.sin(local * 7) * .025 * amp;
                        actor.mesh.scale.y = 1 + amp * ((ev.kind === 'wash' || ev.kind === 'count') ? .035 : .018);
                        if (!ev.prop && ['wash','checkWrist','reachMayo','receiveInstrument','count','sbar','airwayCheck','familyBrief'].includes(ev.kind)) {
                            ev.prop = new THREE.Mesh(new THREE.TorusGeometry(.22,.012,8,32), new THREE.MeshBasicMaterial({ color: ev.kind === 'wash' ? 0x6f9fd8 : 0xd1c4e9, transparent:true, opacity:.55 }));
                            ev.prop.rotation.x = Math.PI / 2;
                            addMotionProp(ev.prop);
                        }
                        if (ev.prop) {
                            const base = actor.mesh.position.clone();
                            ev.prop.position.set(base.x, base.y + 1.05 + amp*.10, base.z + .18);
                            ev.prop.rotation.z += .06;
                            ev.prop.material.opacity = .18 + amp*.48;
                        }
                    } else if (ev.type === 'ringPulse') {
                        ev.prop.material.opacity = Math.sin(p*Math.PI) * .55;
                        const s = 1 + Math.sin(local * 5) * .04;
                        ev.prop.scale.set(s,s,s);
                    } else if (ev.type === 'labelFade') {
                        if (ev.prop.material) ev.prop.material.opacity = Math.sin(p*Math.PI) * .88;
                    } else if (ev.type === 'propMove') {
                        ev.prop.position.lerpVectors(ev.from, ev.to, ep);
                        if (ev.spin) ev.prop.rotation.y += .16;
                        ev.prop.material.opacity = .25 + Math.sin(p*Math.PI)*.75;
                    }
                    if (p < 1) alive.push(ev);
                    else if (ev.actor) { ev.actor.mesh.scale.set(1,1,1); ev.actor.mesh.rotation.z = 0; }
                }
                three.motionEvents = alive;
                if (!alive.length) setTimeout(() => clearMotionProps(), 1400);
            }

            try {
                const __nk57_applySavedPlacement = applySavedPlacement;
                applySavedPlacement = function(obj) {
                    obj.opts = obj.opts || {};
                    obj.opts.placementKey = placementKeyFor(obj);
                    obj.opts.locked = true;
                };
                moveSelectedPlacement = function(){ return false; };
                attachPlacementControls = function() { disableLayoutEditing(); };
                selectPlacementObject = function(obj) { if (obj) { highlightObject(obj); showObjPopup(obj, window.innerWidth/2, window.innerHeight/2); } };
            } catch(e) { console.warn('Yerleşim düzenleme devre dışı bırakılamadı', e); }

            const __nk57_addObj = addObj;
            addObj = function(mesh, label, desc, opts = {}) {
                const obj = __nk57_addObj(mesh, label, desc, opts);
                try { registerClinicalActor(obj); } catch(e) {}
                return obj;
            };

            const __nk57_buildSceneForRoom = buildSceneForRoom;
            buildSceneForRoom = function() {
                disableLayoutEditing();
                three.clinicalActors = {};
                three.motionEvents = [];
                three.motionLast = performance.now();
                clearMotionProps();
                const result = __nk57_buildSceneForRoom.apply(this, arguments);
                try { disableLayoutEditing(); removeMotionPanelsIfAny(); } catch(e) { console.warn('Karakter animasyon arayüzü gizlenemedi', e); }
                return result;
            };

            const __nk57_animateScene = animateScene;
            animateScene = function() {
                __nk57_animateScene.apply(this, arguments);
                try {
                    const now = performance.now();
                    const dt = Math.min(.05, ((now - (three.motionLast || now)) / 1000) || .016);
                    three.motionLast = now;
                    updateClinicalMotions(dt);
                } catch(e) {}
            };

            const __nk57_init = init;
            init = function() {
                const result = __nk57_init.apply(this, arguments);
                try { injectMotionStyles(); disableLayoutEditing(); removeMotionPanelsIfAny(); } catch(e) {}
                return result;
            };

        })();



        /* ===================== NurseKit v5.8: Gizli Rig Hazırlıklı Animasyon Altyapısı ===================== */
        (function nurseKitProfessionalCharacterStudioPatch(){
            const NK58_VERSION = 'v5.8';
            const ActorRoleMap = {
                'preop-nurse-3d': { label: 'Preop hemşiresi', role: 'nurse', height: 1.62, color: 0x1f7f99 },
                'scrub-nurse-3d': { label: 'Scrub hemşiresi', role: 'scrub', height: 1.62, color: 0x1f7f99 },
                'assistant-scrub-nurse-3d': { label: 'Yardımcı scrub hemşiresi', role: 'scrub', height: 1.62, color: 0x2b96b0 },
                'pacu-nurse-3d': { label: 'PACU hemşiresi', role: 'nurse', height: 1.62, color: 0x1f7f99 },
                'circulating-nurse': { label: 'Sirküle hemşire', role: 'circulating', height: 1.66, color: 0x9b89c4 },
                'surgeon': { label: 'Cerrah', role: 'surgeon', height: 1.70, color: 0x6f9fd8 },
                'anaesthesia-team': { label: 'Anestezi ekibi', role: 'anaesthesia', height: 1.68, color: 0x4cb88a },
                'perfusionist': { label: 'Perfüzyonist', role: 'perfusionist', height: 1.68, color: 0xe0a558 },
                'family-relative-3d': { label: 'Hasta yakını', role: 'relative', height: 1.56, color: 0xf2a7b8 }
            };
            const ClipKeywords = {
                idle: ['idle','neutral','stand','breath'],
                walk: ['walk','walking','yuru','run'],
                wash: ['wash','hygiene','hand','scrub'],
                check: ['check','inspect','point','explain'],
                timeout: ['idle','stand','listen','talk'],
                reach: ['reach','grab','take','give','instrument'],
                count: ['count','write','point','check'],
                sbar: ['talk','explain','point','idle'],
                airway: ['check','inspect','lean','point'],
                family: ['talk','explain','gesture']
            };

            function injectProStyles() {
                if (document.getElementById('nk58-pro-style')) return;
                const css = `
                    #clinical-motion-panel { right: 12px !important; bottom: 290px !important; }
                    .nk58-pro-panel {
                        position:absolute; right:12px; bottom:52px; width:min(360px, calc(100% - 24px));
                        background:rgba(7,17,31,.90); border:1px solid rgba(92,196,214,.42); border-radius:13px;
                        padding:10px 11px; z-index:15; color:var(--ink); box-shadow:0 18px 45px rgba(0,0,0,.36);
                        backdrop-filter: blur(10px); font-size:11px;
                    }
                    .nk58-pro-panel.collapsed .nk58-pro-body { display:none; }
                    .nk58-pro-head { display:flex; align-items:center; justify-content:space-between; gap:8px; }
                    .nk58-pro-title { color:var(--teal); font-size:10px; letter-spacing:.8px; text-transform:uppercase; font-weight:700; }
                    .nk58-pro-sub { color:var(--ink-dim); font-size:10px; margin-top:2px; }
                    .nk58-pro-toggle, .nk58-pro-btn, .nk58-pro-label {
                        border:1px solid rgba(92,196,214,.42); background:rgba(92,196,214,.12); color:var(--teal);
                        border-radius:7px; padding:6px 8px; font-size:10px; cursor:pointer; text-align:center;
                    }
                    .nk58-pro-btn.secondary { border-color:var(--line); background:var(--panel-2); color:var(--ink-mute); }
                    .nk58-pro-btn.warn { border-color:rgba(224,165,88,.45); background:rgba(224,165,88,.10); color:var(--amber); }
                    .nk58-pro-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; }
                    .nk58-pro-row { display:grid; grid-template-columns:1fr; gap:5px; margin-top:8px; }
                    .nk58-pro-row select { width:100%; background:var(--panel-2); color:var(--ink); border:1px solid var(--line); border-radius:7px; padding:7px 8px; font-size:11px; }
                    .nk58-pro-note { margin-top:8px; color:var(--ink-mute); font-size:10.5px; line-height:1.38; border-left:3px solid var(--teal-2); padding:7px 8px; background:rgba(92,196,214,.07); border-radius:7px; }
                    .nk58-pro-status { margin-top:8px; color:var(--ink-dim); font-family:var(--font-mono); font-size:10px; line-height:1.35; min-height:28px; }
                    .nk58-chip-row { display:flex; gap:5px; flex-wrap:wrap; margin-top:7px; }
                    .nk58-chip { font-size:9px; padding:3px 7px; border-radius:99px; border:1px solid var(--line); color:var(--ink-mute); background:rgba(20,40,63,.64); }
                    .nk58-chip.ok { border-color:rgba(76,184,138,.45); color:var(--green); background:rgba(76,184,138,.08); }
                    .nk58-cue-card { position:absolute; left:50%; top:90px; transform:translateX(-50%); max-width:min(780px, calc(100% - 36px));
                        background:rgba(8,17,31,.94); border:1px solid rgba(92,196,214,.55); border-left:4px solid var(--teal); border-radius:10px;
                        padding:10px 14px; z-index:18; color:var(--ink); box-shadow:var(--shadow); opacity:0; pointer-events:none; transition:opacity .22s ease, transform .22s ease; }
                    .nk58-cue-card.visible { opacity:1; transform:translateX(-50%) translateY(4px); }
                    .nk58-cue-card .k { color:var(--teal); font-size:10px; text-transform:uppercase; letter-spacing:.8px; margin-bottom:3px; }
                    .nk58-cue-card .t { font-size:13px; line-height:1.45; }
                    .nk58-cue-card .m { margin-top:4px; color:var(--ink-mute); font-size:11px; }
                    @media (max-width:980px){ #clinical-motion-panel { display:none !important; } .nk58-pro-panel { left:12px; right:12px; bottom:12px; width:auto; } }
                `;
                const style = document.createElement('style');
                style.id = 'nk58-pro-style';
                style.textContent = css;
                document.head.appendChild(style);
            }

            function escapeHTML58(s) { return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
            function removeMotionPanelsIfAny() { try { ['clinical-motion-panel','nk58-pro-panel'].forEach(id => document.getElementById(id)?.remove()); } catch(e) {} }
            function actorOptionsHTML() {
                return Object.entries(ActorRoleMap).map(([k,v]) => `<option value="${escapeHTML58(k)}">${escapeHTML58(v.label)}</option>`).join('');
            }
            function ensureCueCard() {
                const shell = document.getElementById('scene-shell');
                if (!shell) return null;
                let card = document.getElementById('nk58-cue-card');
                if (!card) { card = document.createElement('div'); card.id = 'nk58-cue-card'; card.className = 'nk58-cue-card'; shell.appendChild(card); }
                return card;
            }
            function cue(title, text, meta = '') {
                const card = ensureCueCard();
                if (!card) return;
                card.innerHTML = `<div class="k">${escapeHTML58(title)}</div><div class="t">${escapeHTML58(text)}</div>${meta ? `<div class="m">${escapeHTML58(meta)}</div>` : ''}`;
                card.classList.add('visible');
                clearTimeout(card._t);
                card._t = setTimeout(() => card.classList.remove('visible'), 5200);
            }
            function status(msg) {
                const el = document.getElementById('nk58-pro-status');
                if (el) el.textContent = msg;
            }

            function ensureProPanel() { removeMotionPanelsIfAny(); }

            function refreshClipList() {
                const list = document.getElementById('nk58-clip-list');
                if (!list) return;
                const key = document.getElementById('nk58-actor-select')?.value;
                const obj = getActor58(key);
                const clips = obj?.proClips || [];
                if (!clips.length) { list.innerHTML = '<span class="nk58-chip">Klip yok</span><span class="nk58-chip ok">Fallback aktif</span>'; return; }
                list.innerHTML = clips.slice(0, 10).map(c => `<span class="nk58-chip ok">${escapeHTML58(c.name || 'clip')}</span>`).join('');
            }

            function makeStandardMat58(c, opts = {}) { return mat(c, opts); }
            function limbBox58(w, h, d, c, opts = {}) {
                const pivot = new THREE.Group();
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), makeStandardMat58(c, opts));
                mesh.position.y = -h / 2;
                prepMesh(mesh);
                pivot.add(mesh);
                return pivot;
            }
            function eye58(x, y, z, c = 0x26364f) { return box(0.030, 0.038, 0.012, c, x, y, z, { emissive: c, emissiveIntensity: 0.05, roughness: 0.25 }); }
            function buildRiggedFallbackHuman(x, y, z, role = 'nurse', color = 0x5cc4d6, opts = {}) {
                const meta = Object.values(ActorRoleMap).find(v => v.role === role) || {};
                const scrub = opts.color || color || meta.color || 0x5cc4d6;
                const skin = opts.skin || 0xeec7aa;
                const pants = role === 'relative' ? 0x5a4639 : (role === 'surgeon' ? 0x315b76 : 0x29445f);
                const hair = opts.hair || (role === 'relative' ? 0x5a4036 : 0x4b3a35);
                const g = groupAt(x, y, z);
                g.userData.isRiggedFallback = true;
                g.userData.role = role;
                g.userData.baseY = y;
                g.userData.idlePhase = Math.random() * Math.PI * 2;
                const rig = g.userData.rig = {};

                rig.torso = box(0.36, 0.46, 0.22, scrub, 0, 0.95, 0, { roughness: 0.58 });
                g.add(rig.torso);
                rig.waist = box(0.27, 0.12, 0.18, role === 'relative' ? 0xf7e1c9 : 0xeff5f8, 0, 0.69, 0, { roughness: 0.42 });
                g.add(rig.waist);
                rig.neck = cyl(0.045, 0.05, 0.08, skin, 0, 1.205, 0, { seg: 12, roughness: 0.48 });
                g.add(rig.neck);
                rig.headGroup = new THREE.Group(); rig.headGroup.position.set(0, 1.35, 0); g.add(rig.headGroup);
                rig.head = sphere(role === 'relative' ? 0.145 : 0.135, skin, 0, 0, 0, { roughness: 0.50 }); rig.headGroup.add(rig.head);
                rig.hair = sphere(role === 'relative' ? 0.15 : 0.14, hair, 0, 0.045, -0.012, { roughness: 0.74 }); rig.hair.scale.set(1.02, .72, 1); rig.headGroup.add(rig.hair);
                rig.headGroup.add(eye58(-0.052, 0.005, 0.125, 0x405078)); rig.headGroup.add(eye58(0.052, 0.005, 0.125, 0x405078));
                rig.headGroup.add(box(0.12, 0.045, 0.014, 0xe9f4fa, 0, -0.055, 0.129, { roughness: 0.36 }));
                if (role === 'nurse' || role === 'scrub') {
                    rig.badge = box(0.055, 0.070, 0.016, 0xdfe8ee, 0.13, 1.02, 0.121, { roughness: 0.25 }); g.add(rig.badge);
                    rig.badgeDot = box(0.025, 0.025, 0.018, 0x7aa1c5, 0.13, 1.065, 0.132, { roughness: 0.25 }); g.add(rig.badgeDot);
                    if (role === 'nurse') { const bun = sphere(0.075, hair, -0.13, 1.38, -0.06, { roughness: 0.72 }); g.add(bun); }
                }
                if (role === 'surgeon' || role === 'scrub') {
                    rig.cap = sphere(0.145, 0xa4c6d6, 0, 1.405, -0.015, { roughness: 0.66 }); rig.cap.scale.set(1.08,.42,1.02); g.add(rig.cap);
                }

                rig.leftUpperArm = limbBox58(0.09, 0.30, 0.085, scrub, { roughness: 0.60 }); rig.leftUpperArm.position.set(-0.245, 1.13, 0); g.add(rig.leftUpperArm);
                rig.leftForeArm = limbBox58(0.075, 0.25, 0.075, skin, { roughness: 0.48 }); rig.leftForeArm.position.set(0, -0.30, 0); rig.leftUpperArm.add(rig.leftForeArm);
                rig.rightUpperArm = limbBox58(0.09, 0.30, 0.085, scrub, { roughness: 0.60 }); rig.rightUpperArm.position.set(0.245, 1.13, 0); g.add(rig.rightUpperArm);
                rig.rightForeArm = limbBox58(0.075, 0.25, 0.075, skin, { roughness: 0.48 }); rig.rightForeArm.position.set(0, -0.30, 0); rig.rightUpperArm.add(rig.rightForeArm);
                rig.leftLeg = limbBox58(0.105, 0.54, 0.105, pants, { roughness: 0.62 }); rig.leftLeg.position.set(-0.085, 0.61, 0); g.add(rig.leftLeg);
                rig.rightLeg = limbBox58(0.105, 0.54, 0.105, pants, { roughness: 0.62 }); rig.rightLeg.position.set(0.085, 0.61, 0); g.add(rig.rightLeg);
                rig.leftFoot = box(0.14, 0.055, 0.20, role === 'relative' ? 0x2d3138 : 0xf5f6f7, -0.085, 0.045, 0.045, { roughness: 0.65 }); g.add(rig.leftFoot);
                rig.rightFoot = box(0.14, 0.055, 0.20, role === 'relative' ? 0x2d3138 : 0xf5f6f7, 0.085, 0.045, 0.045, { roughness: 0.65 }); g.add(rig.rightFoot);
                setRigPose58(g, 'idle', 0, 0);
                return g;
            }
            function setRigPose58(group, kind = 'idle', t = 0, amp = 1) {
                const r = group?.userData?.rig;
                if (!r) return;
                const A = amp || 1;
                const reset = () => {
                    [r.leftUpperArm, r.rightUpperArm, r.leftForeArm, r.rightForeArm, r.leftLeg, r.rightLeg, r.headGroup].filter(Boolean).forEach(x => { x.rotation.set(0,0,0); });
                    if (r.torso) r.torso.rotation.set(0,0,0);
                    if (r.waist) r.waist.rotation.set(0,0,0);
                };
                reset();
                const sway = Math.sin(t * 2.0 + (group.userData.idlePhase || 0));
                if (kind === 'walk') {
                    const s = Math.sin(t * 8.0) * A;
                    r.leftLeg.rotation.x = s * 0.35; r.rightLeg.rotation.x = -s * 0.35;
                    r.leftUpperArm.rotation.x = -s * 0.28; r.rightUpperArm.rotation.x = s * 0.28;
                    group.position.y = (group.userData.baseY || 0) + Math.abs(Math.sin(t * 8.0)) * 0.022;
                    if (r.headGroup) r.headGroup.rotation.z = Math.sin(t * 8.0) * 0.018;
                } else if (kind === 'wash') {
                    r.leftUpperArm.rotation.x = -0.78; r.rightUpperArm.rotation.x = -0.82;
                    r.leftUpperArm.rotation.z = -0.35 + Math.sin(t * 9) * 0.12; r.rightUpperArm.rotation.z = 0.35 - Math.sin(t * 9) * 0.12;
                    r.leftForeArm.rotation.x = -0.42 + Math.sin(t * 13) * 0.08; r.rightForeArm.rotation.x = -0.42 - Math.sin(t * 13) * 0.08;
                    r.headGroup.rotation.x = 0.10;
                } else if (kind === 'check' || kind === 'point') {
                    r.rightUpperArm.rotation.x = -0.82; r.rightUpperArm.rotation.z = -0.44;
                    r.rightForeArm.rotation.x = -0.34 + Math.sin(t * 4) * 0.04;
                    r.headGroup.rotation.x = 0.08;
                } else if (kind === 'reach' || kind === 'give' || kind === 'receive') {
                    r.rightUpperArm.rotation.x = -1.05; r.rightUpperArm.rotation.z = kind === 'receive' ? 0.38 : -0.38;
                    r.rightForeArm.rotation.x = -0.18 + Math.sin(t*7)*0.04;
                    r.leftUpperArm.rotation.x = -0.16;
                    r.headGroup.rotation.y = kind === 'receive' ? -0.12 : 0.12;
                } else if (kind === 'count' || kind === 'sbar') {
                    r.rightUpperArm.rotation.x = -0.72; r.rightUpperArm.rotation.z = -0.25;
                    r.leftUpperArm.rotation.x = -0.25;
                    r.headGroup.rotation.y = Math.sin(t * 2) * 0.08;
                } else if (kind === 'airway') {
                    r.rightUpperArm.rotation.x = -0.95; r.leftUpperArm.rotation.x = -0.38;
                    r.torso.rotation.x = 0.05; r.headGroup.rotation.x = 0.16;
                } else if (kind === 'family' || kind === 'talk') {
                    r.rightUpperArm.rotation.x = -0.46; r.rightUpperArm.rotation.z = -0.36 + Math.sin(t * 3.2) * 0.12;
                    r.leftUpperArm.rotation.x = -0.20;
                    r.headGroup.rotation.y = Math.sin(t * 1.7) * 0.10;
                } else if (kind === 'timeout') {
                    r.leftUpperArm.rotation.x = -0.18; r.rightUpperArm.rotation.x = -0.18;
                    r.headGroup.rotation.y = Math.sin(t * 1.1) * 0.035;
                } else {
                    group.position.y = (group.userData.baseY || 0) + sway * 0.006;
                    r.headGroup.rotation.y = sway * 0.035;
                    r.leftUpperArm.rotation.x = -0.05 + sway * 0.025;
                    r.rightUpperArm.rotation.x = -0.05 - sway * 0.025;
                }
            }

            const __nk58_oldBuildHuman = buildHuman;
            const __nk58_oldBuildNurse = buildNurseCharacter3D;
            buildHuman = function(x, y, z, role = 'nurse', color = 0x5cc4d6) {
                try { return buildRiggedFallbackHuman(x, y, z, role, color); }
                catch(e) { console.warn('v5.8 rig fallback human failed; reverting', e); return __nk58_oldBuildHuman(x, y, z, role, color); }
            };
            buildNurseCharacter3D = function(x, y, z) {
                try { return buildRiggedFallbackHuman(x, y, z, 'nurse', 0x1f7f99); }
                catch(e) { console.warn('v5.8 rig fallback nurse failed; reverting', e); return __nk58_oldBuildNurse(x, y, z); }
            };

            function getActor58(key) {
                if (!key) return null;
                return (three.objects || []).find(o => o?.opts?.clinicalKey === key) || three.clinicalActors?.[key] || null;
            }
            function objPos58(obj) { return obj?.mesh?.position?.clone?.() || new THREE.Vector3(); }
            function faceTo58(obj, target) {
                if (!obj?.mesh || !target) return;
                const dx = target.x - obj.mesh.position.x, dz = target.z - obj.mesh.position.z;
                if (Math.abs(dx) + Math.abs(dz) > .001) obj.mesh.rotation.y = Math.atan2(dx, dz);
            }
            function ease58(p) { p = Math.max(0, Math.min(1, p)); return p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2; }
            function clearProProps58() {
                (three.proProps || []).forEach(p => { try { three.scene?.remove(p); if (p.geometry) p.geometry.dispose?.(); if (p.material) p.material.dispose?.(); } catch(e){} });
                three.proProps = [];
            }
            function addProProp58(p) { three.proProps = three.proProps || []; three.proProps.push(p); if (three.scene) three.scene.add(p); return p; }
            function ring58(x, z, delay, duration, color, radius, label) {
                const tor = new THREE.Mesh(new THREE.TorusGeometry(radius || .9, .018, 10, 88), new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0 }));
                tor.rotation.x = Math.PI / 2; tor.position.set(x, .035, z); addProProp58(tor);
                schedule58({ type:'ring', prop: tor, delay, duration, color, label });
            }
            function marker58(x, y, z, delay, duration, color) {
                const s = new THREE.Mesh(new THREE.SphereGeometry(.075, 16, 10), new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0 }));
                s.position.set(x,y,z); addProProp58(s); schedule58({ type:'marker', prop:s, delay, duration });
            }
            function instrument58(fromObj, toObj, delay, duration) {
                if (!fromObj || !toObj) return;
                const prop = new THREE.Mesh(new THREE.BoxGeometry(.42,.025,.035), new THREE.MeshStandardMaterial({ color:0xdfe8ee, metalness:.45, roughness:.25, transparent:true, opacity:.2 }));
                addProProp58(prop);
                const f = objPos58(fromObj).add(new THREE.Vector3(.15, 1.05, .04));
                const t = objPos58(toObj).add(new THREE.Vector3(-.10, 1.06, .05));
                schedule58({ type:'propMove', prop, from:f, to:t, delay, duration, spin:true });
            }
            function schedule58(ev) { three.proMotionEvents = three.proMotionEvents || []; ev.elapsed = 0; three.proMotionEvents.push(ev); }
            function eventActor58(ev) { return typeof ev.actor === 'string' ? getActor58(ev.actor) : ev.actor; }
            function move58(actorKey, points, delay, duration, clip='walk') { schedule58({ type:'move', actor:actorKey, points:points.map(p => new THREE.Vector3(p[0], p[1], p[2])), delay, duration, clip }); }
            function gesture58(actorKey, kind, delay, duration, target) { schedule58({ type:'gesture', actor:actorKey, kind, delay, duration, target: target ? new THREE.Vector3(target[0], target[1], target[2]) : null }); }
            function cam58(delay, duration, spherical, lookAt) { schedule58({ type:'camera', delay, duration, fromS:null, toS:spherical, fromL:null, toL:lookAt }); }
            function cue58(delay, title, text, meta) { schedule58({ type:'cue', delay, duration:.1, title, text, meta }); }

            function findClip58(obj, keywords) {
                const clips = obj?.proClips || [];
                if (!clips.length) return null;
                const words = (keywords || []).flatMap(k => ClipKeywords[k] || [k]).map(s => String(s).toLowerCase());
                return clips.find(c => words.some(w => String(c.name || '').toLowerCase().includes(w))) || clips[0];
            }
            function playClip58(obj, keywords, duration = 2.0) {
                if (!obj?.proMixer || !obj?.proClips?.length) return false;
                const clip = findClip58(obj, keywords);
                if (!clip) return false;
                try {
                    if (obj.proActiveAction) obj.proActiveAction.fadeOut?.(.15);
                    const action = obj.proMixer.clipAction(clip);
                    action.reset(); action.enabled = true; action.setEffectiveWeight(1); action.setEffectiveTimeScale(1); action.fadeIn?.(.12); action.play();
                    obj.proActiveAction = action;
                    clearTimeout(obj._proClipTimer);
                    obj._proClipTimer = setTimeout(() => { try { action.fadeOut?.(.18); } catch(e){} }, Math.max(400, duration * 1000));
                    return true;
                } catch(e) { console.warn('GLB clip could not be played', e); return false; }
            }
            function loadGLTF58(url, cb, errCb) {
                if (!THREE.GLTFLoader) { errCb?.(new Error('GLTFLoader bulunamadı.')); return; }
                const loader = new THREE.GLTFLoader();
                loader.load(url, cb, undefined, errCb);
            }
            function normaliseModel58(model, targetHeight = 1.65) {
                try {
                    const box3 = new THREE.Box3().setFromObject(model);
                    const size = new THREE.Vector3(); box3.getSize(size);
                    const h = size.y || 1;
                    const sc = targetHeight / h;
                    model.scale.multiplyScalar(sc);
                    const b2 = new THREE.Box3().setFromObject(model);
                    model.position.y -= b2.min.y;
                } catch(e) {}
            }
            function loadCharacterFile(file, key) {
                if (!file) return;
                const obj = getActor58(key);
                if (!obj) return status('Seçili rol bu fazda sahnede değil. Önce ilgili faza geçin.');
                const url = URL.createObjectURL(file);
                status('Karakter GLB yükleniyor...');
                loadGLTF58(url, gltf => {
                    try {
                        const old = obj.mesh;
                        const model = gltf.scene || gltf.scenes?.[0];
                        if (!model) throw new Error('GLB içinde sahne yok.');
                        const pos = old.position.clone(); const rot = old.rotation.clone();
                        normaliseModel58(model, ActorRoleMap[key]?.height || 1.65);
                        model.position.copy(pos); model.rotation.copy(rot);
                        model.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; if (n.material && 'metalness' in n.material) n.material.metalness = Math.min(n.material.metalness, .25); } });
                        three.scene.remove(old);
                        three.scene.add(model);
                        obj.mesh = model;
                        obj.proMixer = new THREE.AnimationMixer(model);
                        obj.proClips = [...(gltf.animations || [])];
                        three.proMixers = three.proMixers || [];
                        three.proMixers = three.proMixers.filter(m => m.obj !== obj);
                        three.proMixers.push({ obj, mixer: obj.proMixer });
                        if (three.clinicalActors) three.clinicalActors[key] = obj;
                        URL.revokeObjectURL(url);
                        refreshClipList();
                        status(`${ActorRoleMap[key]?.label || key} GLB karaktere bağlandı. Klip: ${obj.proClips.length}.`);
                        cue('GLB karakter bağlandı', `${ActorRoleMap[key]?.label || key} artık gerçek modelle temsil ediliyor.`, 'Klip adları walk/idle/reach gibi ise animasyonlar otomatik eşleşir.');
                    } catch(e) { console.error(e); status('Karakter yükleme hatası: ' + e.message); }
                }, e => { console.error(e); status('GLB okunamadı: ' + (e.message || e)); URL.revokeObjectURL(url); });
            }
            function loadAnimationFile(file, key) {
                if (!file) return;
                const obj = getActor58(key);
                if (!obj) return status('Seçili rol bu fazda sahnede değil.');
                if (!obj.proMixer) obj.proMixer = new THREE.AnimationMixer(obj.mesh);
                const url = URL.createObjectURL(file);
                status('Animasyon GLB yükleniyor...');
                loadGLTF58(url, gltf => {
                    try {
                        obj.proClips = [...(obj.proClips || []), ...(gltf.animations || [])];
                        if (!three.proMixers) three.proMixers = [];
                        if (!three.proMixers.find(m => m.obj === obj)) three.proMixers.push({ obj, mixer: obj.proMixer });
                        URL.revokeObjectURL(url);
                        refreshClipList();
                        status(`${gltf.animations?.length || 0} animasyon klibi eklendi.`);
                    } catch(e) { status('Animasyon yükleme hatası: ' + e.message); }
                }, e => { console.error(e); status('Animasyon GLB okunamadı: ' + (e.message || e)); URL.revokeObjectURL(url); });
            }

            function stop58(message = 'Animasyon durduruldu.') {
                three.proMotionEvents = [];
                clearProProps58();
                (three.objects || []).forEach(o => { if (o?.mesh?.userData?.rig) setRigPose58(o.mesh, 'idle', performance.now()*.001, 1); });
                status(message);
                showSceneReaction?.(message, 'info');
            }
            function setupActorBaselines58() {
                (three.objects || []).forEach(o => {
                    if (!o?.mesh) return;
                    o.mesh.userData.baseY = o.mesh.position.y;
                    o.mesh.userData.proBaseRotY = o.mesh.rotation.y || 0;
                    if (o.opts?.clinicalKey && ActorRoleMap[o.opts.clinicalKey]) {
                        three.clinicalActors = three.clinicalActors || {};
                        three.clinicalActors[o.opts.clinicalKey] = o;
                    }
                });
            }
            function playSequence58(room = 'preop') {
                stop58('Yeni profesyonel akış başlatıldı.');
                setupActorBaselines58();
                const y = 0;
                if (room === 'preop') {
                    cam58(0, 1.2, { theta:.62, phi:1.10, radius:8.1 }, { x:.1,y:1.32,z:-1.6 });
                    cue58(.10, 'Preop klinik akış', 'Önce el hijyeni, sonra hasta başında kimlik–onam–taraf doğrulama. Görsellik değil, doğru güvenlik sırası öğretiliyor.', 'Öğrenci burada davranış sırasını görmeli.');
                    move58('preop-nurse-3d', [[3.35,y,-1.15],[1.25,y,-2.25],[-2.10,y,-3.05],[-5.25,y,-3.62]], .35, 3.3, 'walk');
                    gesture58('preop-nurse-3d', 'wash', 3.8, 2.45, [-5.70,1,-3.85]);
                    move58('preop-nurse-3d', [[-5.25,y,-3.62],[-2.55,y,-2.52],[.85,y,-2.05],[2.15,y,-1.48]], 6.35, 3.4, 'walk');
                    gesture58('preop-nurse-3d', 'check', 9.7, 2.8, [2.2,1.0,-2.10]);
                    gesture58('family-relative-3d', 'family', 1.0, 10.5, [2.2,1.0,-2.1]);
                    ring58(-5.25, -3.62, 3.8, 2.2, 0x6f9fd8, .62, 'El hijyeni');
                    ring58(2.20, -2.10, 9.3, 3.2, 0x5cc4d6, 1.05, 'Kimlik doğrulama');
                    marker58(2.2, 1.35, -2.10, 9.6, 2.8, 0x5cc4d6);
                    window.ClinicalAudio?.playCue?.('wash');
                    setTimeout(()=>window.ClinicalAudio?.playCue?.('identity'), 6300);
                    showSceneReaction('Profesyonel preop akış: el hijyeni → hasta başı doğrulama → aile alanının korunması.', 'info');
                } else if (room === 'intraop') {
                    cam58(0, 1.2, { theta:.50, phi:1.02, radius:8.8 }, { x:1.2,y:1.22,z:.25 });
                    cue58(.10, 'İntraop klinik akış', 'Time-out sırasında ekip durur. Ardından scrub hemşiresi Mayo masasından cerraha alet aktarır; sirküle hemşire sayım ve numune hattını kontrol eder.', 'Steril çekirdek, anestezi ve perfüzyon alanı birlikte okunmalı.');
                    ['scrub-nurse-3d','assistant-scrub-nurse-3d','surgeon','circulating-nurse','perfusionist','anaesthesia-team'].forEach((k,i) => gesture58(k, 'timeout', .35+i*.08, 3.2, [.25,1,.05]));
                    ring58(.20, .15, .35, 3.2, 0xe0a558, 1.7, 'Time-out');
                    gesture58('anaesthesia-team', 'check', 1.2, 2.4, [-3.25,1,0]);
                    ring58(-3.25, 0.0, 1.15, 2.5, 0x6f9fd8, .78, 'Sign-in / airway');
                    marker58(-3.25, 1.46, 0.00, 1.25, 2.0, 0x6f9fd8);
                    gesture58('scrub-nurse-3d', 'reach', 3.8, 1.6, [.72,1,-.62]);
                    gesture58('assistant-scrub-nurse-3d', 'timeout', 3.7, 1.6, [.25,1,-.48]);
                    gesture58('surgeon', 'receive', 4.15, 2.0, [.12,1,.02]);
                    instrument58(getActor58('scrub-nurse-3d'), getActor58('surgeon'), 4.25, 1.55);
                    move58('circulating-nurse', [[4.95,y,1.98],[4.10,y,2.28],[6.60,y,1.45],[6.85,y,2.65]], 5.7, 3.4, 'walk');
                    gesture58('circulating-nurse', 'count', 6.2, 2.9, [4.10,1.20,2.28]);
                    gesture58('perfusionist', 'check', 7.35, 2.3, [4.08,1.0,0.22]);
                    ring58(4.08, .22, 7.25, 2.6, 0x9b89c4, .72, 'KPB güvenlik zonu');
                    marker58(4.08, 1.30, 0.22, 7.35, 2.1, 0x9b89c4);
                    ring58(.72, -.62, 3.9, 2.8, 0x4cb88a, .72, 'Mayo');
                    ring58(-0.95, 1.35, 6.0, 3.0, 0xd96371, .78, 'Sayım');
                    window.ClinicalAudio?.playCue?.('timeout');
                    setTimeout(()=>window.ClinicalAudio?.playCue?.('sterile'), 4200);
                    setTimeout(()=>window.ClinicalAudio?.playCue?.('count'), 6500);
                    showSceneReaction('Profesyonel intraop akış: sign-in/airway → time-out → steril alet transferi → sayım/numune → KPB güvenlik zonu görünürleştirildi.', 'info');
                } else {
                    cam58(0, 1.2, { theta:.36, phi:1.08, radius:8.2 }, { x:-.7,y:1.25,z:-.4 });
                    cue58(.10, 'PACU klinik akış', 'Teslim bilgisi SBAR panosundan hasta başına taşınır; hava yolu, SpO₂, ağrı, bilinç ve dren izlemi aynı ilk değerlendirme zincirinde gösterilir.', 'Amaç: öğrencinin teslim bilgisini başucu değerlendirmeye çevirmesi.');
                    move58('pacu-nurse-3d', [[-2.55,y,1.0],[-4.70,y,-1.40],[-2.20,y,-.40],[-.35,y,-.30]], .35, 3.6, 'walk');
                    gesture58('pacu-nurse-3d', 'sbar', .8, 1.7, [-4.70,1,-1.40]);
                    gesture58('pacu-nurse-3d', 'airway', 4.0, 2.7, [-.05,1,-.20]);
                    gesture58('family-relative-3d', 'family', 6.4, 3.2, [4.25,1,1.70]);
                    ring58(-.05, -.20, 3.8, 3.1, 0x5cc4d6, 1.15, 'PACU ilk değerlendirme');
                    ring58(1.10, .80, 5.25, 2.4, 0xd96371, .52, 'Dren');
                    marker58(-.05, 1.3, -.20, 4.0, 2.6, 0x5cc4d6);
                    window.ClinicalAudio?.playCue?.('handoff');
                    setTimeout(()=>window.ClinicalAudio?.playCue?.('monitor'), 4100);
                    showSceneReaction('Profesyonel PACU akış: SBAR → başucu ilk değerlendirme → aile bilgilendirmesi.', 'info');
                }
            }

            function updateProMotion58(dt) {
                if (three.proMixers) three.proMixers.forEach(m => { try { m.mixer.update(dt); } catch(e){} });
                const t = performance.now() * .001;
                (three.objects || []).forEach(o => {
                    if (o?.mesh?.userData?.isRiggedFallback && !(three.proMotionEvents || []).some(ev => ev.actor === o.opts?.clinicalKey)) setRigPose58(o.mesh, 'idle', t, .8);
                });
                const events = three.proMotionEvents || [];
                if (!events.length) return;
                const alive = [];
                for (const ev of events) {
                    ev.elapsed += dt;
                    if (ev.elapsed < (ev.delay || 0)) { alive.push(ev); continue; }
                    const local = ev.elapsed - (ev.delay || 0);
                    const p = Math.max(0, Math.min(1, local / Math.max(.001, ev.duration || 1)));
                    const ep = ease58(p);
                    if (!ev.started) {
                        ev.started = true;
                        if (ev.type === 'move' || ev.type === 'gesture') {
                            const obj = eventActor58(ev);
                            if (obj) playClip58(obj, [ev.clip || ev.kind || 'idle'], ev.duration || 1.2);
                        }
                        if (ev.type === 'cue') cue(ev.title, ev.text, ev.meta);
                        if (ev.type === 'camera') { ev.fromS = { ...three.spherical }; ev.fromL = { ...three.lookAtTarget }; }
                    }
                    if (ev.type === 'move') {
                        const obj = eventActor58(ev);
                        if (obj?.mesh && ev.points?.length > 1) {
                            const pts = ev.points;
                            const total = pts.length - 1;
                            const raw = ep * total;
                            const idx = Math.min(total - 1, Math.floor(raw));
                            const sp = raw - idx;
                            const a = pts[idx], b = pts[idx+1];
                            obj.mesh.position.lerpVectors(a, b, sp);
                            obj.mesh.userData.baseY = a.y;
                            faceTo58(obj, b);
                            if (obj.mesh.userData?.isRiggedFallback) setRigPose58(obj.mesh, 'walk', local, 1);
                        }
                    } else if (ev.type === 'gesture') {
                        const obj = eventActor58(ev);
                        if (obj?.mesh) {
                            if (ev.target) faceTo58(obj, ev.target);
                            if (obj.mesh.userData?.isRiggedFallback) setRigPose58(obj.mesh, ev.kind, local, Math.sin(p*Math.PI));
                        }
                    } else if (ev.type === 'ring') {
                        ev.prop.material.opacity = Math.sin(p*Math.PI) * .64;
                        const s = 1 + Math.sin(local * 5) * .05;
                        ev.prop.scale.set(s,s,s);
                    } else if (ev.type === 'marker') {
                        ev.prop.material.opacity = Math.sin(p*Math.PI) * .82;
                        ev.prop.scale.setScalar(1 + Math.sin(local * 7) * .18);
                    } else if (ev.type === 'propMove') {
                        ev.prop.position.lerpVectors(ev.from, ev.to, ep);
                        ev.prop.material.opacity = .2 + Math.sin(p*Math.PI) * .75;
                        if (ev.spin) ev.prop.rotation.y += .14;
                    } else if (ev.type === 'camera') {
                        if (ev.fromS && ev.toS) {
                            three.spherical.theta = ev.fromS.theta + (ev.toS.theta - ev.fromS.theta) * ep;
                            three.spherical.phi = ev.fromS.phi + (ev.toS.phi - ev.fromS.phi) * ep;
                            three.spherical.radius = ev.fromS.radius + (ev.toS.radius - ev.fromS.radius) * ep;
                        }
                        if (ev.fromL && ev.toL) {
                            three.lookAtTarget.x = ev.fromL.x + (ev.toL.x - ev.fromL.x) * ep;
                            three.lookAtTarget.y = ev.fromL.y + (ev.toL.y - ev.fromL.y) * ep;
                            three.lookAtTarget.z = ev.fromL.z + (ev.toL.z - ev.fromL.z) * ep;
                        }
                        updateCam();
                    }
                    if (p < 1) alive.push(ev);
                    else if (ev.type === 'move' || ev.type === 'gesture') {
                        const obj = eventActor58(ev); if (obj?.mesh?.userData?.isRiggedFallback) setRigPose58(obj.mesh, 'idle', t, .8);
                    }
                }
                three.proMotionEvents = alive;
                if (!alive.length) setTimeout(() => clearProProps58(), 1500);
            }

            window.NurseKitPro3D = { playSequence: playSequence58, stop: stop58, loadCharacterFile, loadAnimationFile, refreshClipList };

            const __nk58_prevBuildScene = buildSceneForRoom;
            buildSceneForRoom = function() {
                const r = __nk58_prevBuildScene.apply(this, arguments);
                try { setupActorBaselines58(); removeMotionPanelsIfAny(); cue('3D eğitim modu hazır', 'Sahnedeki karakterler artık eğitim odaklı hareket sistemiyle çalışır.'); } catch(e) { console.warn('v5.8 sahne kurulamadı', e); }
                return r;
            };
            const __nk58_prevAnimate = animateScene;
            animateScene = function() {
                __nk58_prevAnimate.apply(this, arguments);
                try {
                    const now = performance.now();
                    const dt = Math.min(.05, ((now - (three.proLast || now)) / 1000) || .016);
                    three.proLast = now;
                    updateProMotion58(dt);
                } catch(e) { }
            };
            const __nk58_prevInit = init;
            init = function() {
                const r = __nk58_prevInit.apply(this, arguments);
                try { injectProStyles(); removeMotionPanelsIfAny(); } catch(e) {}
                return r;
            };
        })();


            /* ===== v5.77 compact score category renderer ===== */
            (function compactScoreCategories577(){
                const shortLabels = {
                    clinicalAssessment: 'Klinik',
                    patientSafety: 'GCKL Durum',
                    communication: 'İletişim',
                    prioritisation: 'Öncelik',
                    surgicalNursingKnowledge: 'Cerrahi Bilgi',
                    nursingDiagnosisPerformance: 'Tanı',
                    clinicalReasoning: 'Akıl Yürütme',
                    checklistPerformance: 'Checklist',
                    countingSafety: 'Sayım',
                    patientCentredCare: 'Hasta Merkezli'
                };
                const pctColour = function(w){
                    return w >= 80 ? 'var(--green)' : (w >= 50 ? 'var(--amber)' : (w > 0 ? '#ffb8a6' : '#8fa2b6'));
                };
                const barColour = function(w){
                    if (typeof nkBarColour === 'function') return nkBarColour(w, true);
                    if (w >= 80) return 'var(--green)';
                    if (w >= 50) return 'var(--amber)';
                    if (w > 0) return 'var(--red)';
                    return 'var(--line-soft)';
                };
                updateScoreStrip = function() {
                    const bar = document.getElementById('score-cats');
                    if (!bar) return;
                    bar.innerHTML = '';
                    Object.keys(SCORE_CATEGORIES || {}).forEach((k, i) => {
                        const cat = (App.scores || {})[k] || { earned: 0, max: 0 };
                        let pctStr = '—';
                        let w = 0;
                        if (cat.max > 0) {
                            w = Math.max(0, Math.min(100, Math.round((cat.earned / cat.max) * 100)));
                            pctStr = w + '%';
                        }
                        const c = document.createElement('div');
                        c.className = `score-cat k${i+1}`;
                        const fullLabel = SCORE_CATEGORIES[k].label;
                        const label = shortLabels[k] || fullLabel;
                        c.innerHTML = `<div class="nm" title="${fullLabel} — ${SCORE_CATEGORIES[k].desc}"><span class="sc-label">${label}</span><span class="sc-val" style="color:${pctColour(w)}">${pctStr}</span></div>
                            <div class="br"><i style="width:${w}%; background:${barColour(w)}; transition: width 0.4s ease, background-color 0.4s ease;"></i></div>`;
                        bar.appendChild(c);
                    });

                    const g = (typeof nkGCKLSummary === 'function') ? nkGCKLSummary() : { pct: 0, totalCode: 0, maxCode: 60 };
                    const st = (typeof window.gcklCriticalSafetyStatus === 'function') ? window.gcklCriticalSafetyStatus() : { hasGap: false };
                    const gW = Math.max(0, Math.min(100, Number(g.pct) || 0));
                    const gCard = document.createElement('div');
                    gCard.className = 'score-cat gckl-secondary';
                    gCard.innerHTML = `<div class="nm" title="GCKL kodlarına göre hesaplanan ayrı uyum göstergesi"><span class="sc-label">GCKL uyumu</span><span class="sc-val" style="color:${pctColour(gW)}">${gW}%</span><span class="code-mini">${g.totalCode || 0}/${g.maxCode || 0}</span></div>
                        <div class="br"><i style="width:${gW}%; background:${barColour(gW)}; transition: width 0.4s ease, background-color 0.4s ease;"></i></div>`;
                    bar.appendChild(gCard);

                    const stripTitle = document.querySelector('.score-panel .score-strip .sl span:first-child');
                    const stripMeta = document.querySelector('.score-panel .score-strip .sl .muted');
                    if (stripTitle) stripTitle.textContent = 'Puan kategorileri';
                    if (stripMeta) stripMeta.textContent = `10 kategori · GCKL ${gW}% · ${st.hasGap ? 'kritik açık' : 'kritik yok'}`;
                };
            })();


            /* ============================================================
               v5.79 FAZ ODAKLI DİYALOG DÜZENİ
               Amaç: Preop sorularının intraop/postop fazlarda tekrar tekrar görünmesini engellemek.
               Klinik olarak tekrar doğrulanması gereken başlıklar ilgili fazlarda yeniden sorulabilir.
               ============================================================ */
            (function applyPhaseAwareDialoguePatch(){
                try {
                    const NK_PHASE_LABELS = {
                        preop: 'Preoperatif',
                        intraop: 'İntraoperatif',
                        postop: 'Postoperatif / PACU'
                    };

                    const NK_DIALOGUE_PHASE_RULES = {
                        // Klinik doğrulama soruları: yalnız ilgili fazlarda görünür; bazıları tekrar sorulabilir.
                        q_id: { phases: ['preop','postop'], repeatReason: 'Kimlik doğrulaması preopta ve postop/PACU tesliminde yeniden yapılabilir.' },
                        q_proc: { phases: ['preop'], repeatReason: 'Planlanan ameliyat hasta ile preopta doğrulanır; intraopta bunun ekip doğrulaması Time-out ile yapılır.' },
                        q_site: { phases: ['preop'], repeatReason: 'Cerrahi taraf/bölge hasta ile preopta doğrulanır; intraopta ekip Time-out doğrulaması kullanılır.' },
                        q_consent: { phases: ['preop'], repeatReason: 'Cerrahi onam preoperatif hazırlık basamağıdır.' },
                        q_wristband_confirm: { phases: ['preop','postop'], repeatReason: 'Bileklik doğrulaması preop hazırlıkta ve postop/PACU tesliminde tekrar edilebilir.' },
                        q_site_mark: { phases: ['preop','intraop'], repeatReason: 'Taraf/alan işaretlemesi preopta kontrol edilir; intraopta Time-out öncesi ekipçe teyit edilebilir.' },

                        // Preoperatif hazırlık ve risk sorgulama.
                        q_allergy: { phases: ['preop'], repeatReason: 'Alerji bilgisi preopta hastadan alınır; intraopta kayıt ve ekip doğrulamasıyla yürütülür.' },
                        q_meds: { phases: ['preop'], repeatReason: 'İlaç öyküsü preoperatif değerlendirme verisidir.' },
                        q_anticoag: { phases: ['preop'], repeatReason: 'Antikoagülan/antiagregan kullanımı preop kanama riski değerlendirmesine aittir.' },
                        q_bleeding: { phases: ['preop'], repeatReason: 'Kanama öyküsü ve kan kaybı riski preopta sorgulanır.' },
                        q_diabetes: { phases: ['preop'], repeatReason: 'Diyabet/kan şekeri gereksinimi preop planlamada belirlenir.' },
                        q_prosthesis: { phases: ['preop'], repeatReason: 'Takı, metal eşya, lens ve protez kontrolü ameliyat öncesi hazırlık basamağıdır.' },
                        q_valuables: { phases: ['preop'], repeatReason: 'Oje, makyaj, lens ve değerli eşya güvenliği preopta tamamlanmalıdır.' },
                        q_fasting: { phases: ['preop'], repeatReason: 'Açlık/NPO durumu ameliyat öncesi doğrulanır.' },

                        // Hasta merkezli değerlendirme: faza göre tekrarlanabilir.
                        q_pain: { phases: ['preop','postop'], repeatReason: 'Ağrı değerlendirmesi preop bazal durum ve postop bakım için tekrar ölçülür.' },
                        q_anx: { phases: ['preop','postop'], repeatReason: 'Kaygı preopta cerrahiye yönelik, postopta iyileşme ve güvenlik algısına yönelik değerlendirilebilir.' },
                        q_info: { phases: ['preop','postop'], repeatReason: 'Bilgilendirme gereksinimi preopta hazırlık, postopta bakım ve taburculuk eğitimi için yeniden değerlendirilir.' },
                        q_mob: { phases: ['preop','postop'], repeatReason: 'Solunum egzersizi ve erken mobilizasyon eğitimi preopta öğretilir, postopta pekiştirilir.' },

                        // m0192: 5 yeni klinik soru
                        q_anesthesia_history: { phases: ['preop'], repeatReason: 'Önceki anestezi öyküsü preoperatif risk değerlendirmesidir; malign hipertermi/PONV/intubasyon güçlüğü ipuçları taşır.' },
                        q_smoking_alcohol: { phases: ['preop'], repeatReason: 'Sigara ve alkol kullanımı yara iyileşmesi, pulmoner risk ve anestezi yönetimini etkiler; preopta sorgulanır.' },
                        q_nausea: { phases: ['postop'], repeatReason: 'Bulantı/kusma (PONV) postop dönemde sık görülür; aspirasyon riski açısından kritik.' },
                        q_breathing: { phases: ['postop'], repeatReason: 'Postop solunum sıkıntısı atelektazi, ağrı veya hava yolu sorununun belirtisi olabilir; PACU\'da sorgulanır.' },
                        q_urinary: { phases: ['postop'], repeatReason: 'İdrar çıkışı renal perfüzyon ve sıvı dengesinin temel göstergesidir; postopta saatlik takip edilir.' },

                        // İntraoperatif ekip iletişimi.
                        q_timeout_confirm: { phases: ['intraop'], repeatReason: 'Time-out yalnız intraoperatif ekip doğrulama basamağıdır.' },
                        q_critical_events: { phases: ['intraop'], repeatReason: 'Beklenen kan kaybı, süre, anestezi ve pozisyon riskleri Time-out sırasında ekipçe konuşulur.' },
                        q_antibiotic_timing: { phases: ['intraop'], repeatReason: 'Profilaksi zamanlaması Time-out sırasında ekip ve kayıt üzerinden doğrulanır.' },

                        // Sign-out ve teslim.
                        q_signout_confirm: { phases: ['postop'], repeatReason: 'Sign-out ve teslim doğrulaması ameliyat bitimi/PACU geçişinde yapılır.' },
                        q_count_verbal: { phases: ['postop'], repeatReason: 'Alet, spanç ve iğne sayımı kapanış ve teslim güvenliğine aittir.' },
                        q_specimen_label: { phases: ['postop'], repeatReason: 'Numune etiketi ameliyat sonrası ekip doğrulamasıyla güvenceye alınır.' },
                        q_postop_recommendations: { phases: ['postop'], repeatReason: 'Cerrah ve anestezi önerileri postop/PACU tesliminde alınır.' },
                        q_postop_destination: { phases: ['postop'], repeatReason: 'Hastanın PACU, servis veya yoğun bakıma teslim planı postop akışa aittir.' }
                    };

                    function nkDialogueUniqueQuestions() {
                        const seen = new Set();
                        return (DIALOG_QUESTIONS || []).filter(q => {
                            if (!q || !q.id || seen.has(q.id)) return false;
                            seen.add(q.id);
                            return true;
                        });
                    }

                    function nkDialogueInferRule(q) {
                        if (!q) return { phases: ['preop'] };
                        if (NK_DIALOGUE_PHASE_RULES[q.id]) return NK_DIALOGUE_PHASE_RULES[q.id];
                        const group = String(q.group || '').toLowerCase();
                        const label = String(q.label || '').toLowerCase();
                        if (group.includes('time out') || label.includes('time-out') || label.includes('time out')) return { phases: ['intraop'] };
                        if (group.includes('sign out') || group.includes('teslim') || group.includes('postoperatif')) return { phases: ['postop'] };
                        if (group.includes('ameliyat hazırlığı') || group.includes('alerji') || group.includes('ilaç') || group.includes('kimlik')) return { phases: ['preop'] };
                        if (group.includes('ağrı') || group.includes('anksiyete') || group.includes('bilgi')) return { phases: ['preop','postop'] };
                        return { phases: ['preop'] };
                    }

                    function nkDialogueIsVisible(q, room) {
                        const rule = nkDialogueInferRule(q);
                        return (rule.phases || ['preop']).includes(room || App.currentRoom || 'preop');
                    }

                    window.nkDialoguePhaseRules = NK_DIALOGUE_PHASE_RULES;
                    window.nkDialogueVisibleQuestionsForPhase = function(room) {
                        return nkDialogueUniqueQuestions().filter(q => nkDialogueIsVisible(q, room));
                    };

                    renderDialogue = function() {
                        const c = document.getElementById('dialogue-questions');
                        if (!c) return;
                        c.innerHTML = '';
                        const room = App.currentRoom || 'preop';
                        const visibleQuestions = window.nkDialogueVisibleQuestionsForPhase(room);
                        // m0182: "Preoperatif diyalog seti" helper bannerı kaldırıldı —
                        // kullanıcı isteği. Doğrudan grup başlıklarıyla soru kartları gösterilir.

                        if (!visibleQuestions.length) {
                            c.appendChild(el('div', 'dq-helper', 'Bu faz için aktif yapılandırılmış diyalog sorusu yok. Görev paneli, GCKL ve klinik olaylar üzerinden devam edin.'));
                        } else {
                            const groups = {};
                            visibleQuestions.forEach(q => { (groups[q.group] = groups[q.group] || []).push(q); });
                            Object.keys(groups).forEach(g => {
                                c.appendChild(el('div', 'dq-group', g));
                                groups[g].forEach(q => {
                                    const asked = Array.isArray(App.askedQuestions) && App.askedQuestions.includes(q.id);
                                    const rule = nkDialogueInferRule(q);
                                    const b = el('button', 'dq-btn' + (asked ? ' asked' : ''));
                                    const repeatTag = (rule.phases || []).length > 1 ? '<span class="dq-mini-tag">fazda tekrar</span>' : '';
                                    b.innerHTML = `<span>${q.label}</span>${repeatTag}`;
                                    b.title = rule.repeatReason || 'Bu soru mevcut faz için uygundur.';
                                    if (!asked) b.onclick = () => askDialogue(q);
                                    c.appendChild(b);
                                });
                            });
                        }

                        const stream = document.getElementById('dialogue-stream-body');
                        if (stream) {
                            const emptyState = stream.querySelector('.dialogue-empty');
                            if (emptyState) emptyState.remove();
                            const hasMessages = !!stream.querySelector('.chat-msg');
                            const empty = stream.querySelector('.dialogue-empty');
                            if (!hasMessages) {
                                if (!empty) {
                                    const state = el('div', 'dialogue-empty');
                                    state.innerHTML = '<div class="de-title">Görüşme henüz başlamadı</div><div class="de-copy">Soldaki faza uygun soru kartlarından birini seçerek görüşmeyi başlat. Sistem; iletişim, hasta merkezli bakım, GCKL kanıtı ve güvenlik farkındalığını izler.</div>';
                                    stream.appendChild(state);
                                }
                            } else if (empty) {
                                empty.remove();
                            }
                        }
                        const status = document.getElementById('ai-status');
                        if (status) {
                            status.textContent = App.aiMode ? '✨ AI Hasta (Gemini LLM): AÇIK' : 'Kural tabanlı yanıt';
                            status.className = 'ai-status ' + (App.aiMode ? 'on' : 'off');
                        }
                    };

                    askDialogue = async function(q) {
                        if (!q || !nkDialogueIsVisible(q, App.currentRoom)) {
                            toast('info', 'Faz dışı soru', 'Bu soru mevcut faz için uygun değil. İlgili faza geçtiğinizde görünür.');
                            renderDialogue();
                            return;
                        }
                        if (!Array.isArray(App.askedQuestions)) App.askedQuestions = [];
                        if (App.askedQuestions.includes(q.id)) return;
                        App.askedQuestions.push(q.id);

                        const stream = document.getElementById('dialogue-stream-body');
                        if (!stream) return;
                        const emptyState = stream.querySelector('.dialogue-empty');
                        if (emptyState) emptyState.remove();

                        const nm = el('div', 'chat-msg nurse');
                        nm.innerHTML = `<div class="who">Hemşire · ${NK_PHASE_LABELS[App.currentRoom] || App.currentRoom}</div>${q.label}`;
                        stream.appendChild(nm);
                        stream.scrollTop = stream.scrollHeight;

                        const pm = el('div', 'chat-msg patient');
                        pm.innerHTML = `<div class="who">${App.currentPatient.name}</div><span class="typing">Yanıtlıyor...</span>`;
                        stream.appendChild(pm);
                        stream.scrollTop = stream.scrollHeight;

                        const reply = await getPatientReply(q.id, q.label);
                        pm.innerHTML = `<div class="who">${App.currentPatient.name}${App.aiMode ? ' ✨ 🔊' : ''}</div>${String(reply || '').replace(/\n/g, '<br>')}`;
                        stream.scrollTop = stream.scrollHeight;

                        if (App.aiMode) playTTS(reply, App.currentPatient.gender);

                        addScore(['communication', 'patientCentredCare'], 4, 0);
                        addPhaseScore(App.currentRoom, 4, 0);
                        try {
                            recordAction('dialogue-question', { id: q.id, label: q.label, phase: App.currentRoom, group: q.group });
                            if (typeof recordGCKLDialogueEvidence === 'function') recordGCKLDialogueEvidence(q.id);
                            if (typeof syncGCKLPatientSafetyScore === 'function') syncGCKLPatientSafetyScore();
                        } catch(e) {}

                        renderDialogue();
                        renderTopbar();
                        updateScoreStrip();
                    };

                    const __nk_phaseDialogue_original_calculateCaseMaximums = calculateCaseMaximums;
                    calculateCaseMaximums = function(patient) {
                        __nk_phaseDialogue_original_calculateCaseMaximums(patient);
                        try {
                            const uniqueCount = nkDialogueUniqueQuestions().length;
                            const oldTotalDialogueMax = uniqueCount * 4;
                            const oldPhaseShare = oldTotalDialogueMax / 3;
                            const phaseCounts = {
                                preop: window.nkDialogueVisibleQuestionsForPhase('preop').length,
                                intraop: window.nkDialogueVisibleQuestionsForPhase('intraop').length,
                                postop: window.nkDialogueVisibleQuestionsForPhase('postop').length
                            };
                            ['preop','intraop','postop'].forEach(room => {
                                if (!App.phaseScores[room]) return;
                                App.phaseScores[room].max = Math.max(0, App.phaseScores[room].max - oldPhaseShare + (phaseCounts[room] * 4));
                            });
                            const newTotalDialogueMax = (phaseCounts.preop + phaseCounts.intraop + phaseCounts.postop) * 4;
                            ['communication','patientCentredCare'].forEach(cat => {
                                if (!App.scores[cat]) return;
                                App.scores[cat].max = Math.max(0, App.scores[cat].max - oldTotalDialogueMax + newTotalDialogueMax);
                            });
                        } catch(e) {}
                    };

                    const style = document.createElement('style');
                    style.textContent = `
                        .dq-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;}
                        .dq-btn span:first-child{min-width:0;}
                        .dq-mini-tag{flex:0 0 auto;font-size:9px;padding:2px 6px;border-radius:999px;border:1px solid rgba(92,196,214,.24);background:rgba(92,196,214,.08);color:var(--teal);text-transform:none;letter-spacing:.1px;}
                        .dq-btn.asked .dq-mini-tag{opacity:.45;color:var(--ink-dim);border-color:rgba(141,175,210,.15);background:rgba(255,255,255,.03);}
                    `;
                    document.head.appendChild(style);
                } catch(e) { console.warn('Phase-aware dialogue patch failed', e); }
            })();


        document.addEventListener('DOMContentLoaded', init);
    

/* v5.142 — Alerji kartı görev/iletişim/marker otomatik senkronu
   Sorun: Alerji kartında 3/3 kanıt tamamlandıktan sonra completeTask, preop-allergy nesnesini
   hâlâ "hasta ile kritik iletişim yapılmadı" gibi okuyordu. Bu yüzden görev kapanmak yerine
   kritik güvenlik ikazı üretiyordu. Bu patch alerji kartı kanıtını, hasta iletişim anahtarını,
   görev listesini ve sahne markerını aynı anda senkronlar. */
(() => {
    try {
        const NK142_ALLERGY_MARKERS = ['preop-allergy', 'allergy'];
        const NK142_GCKL14_IDS = ['gckl_14_allergy_check', 'gckl_14_allergy_check', 'gckl_14_allergy_check', 'gckl_14_allergy_check'];

        function nk142Norm(s) { return String(s || '').toLocaleLowerCase('tr-TR'); }

        function nk142IsAllergyTask(task) {
            if (!task) return false;
            const txt = nk142Norm([task.id, task.label, task.cardKey, (task.keywords || []).join(' '), (task.substeps || []).join(' ')].filter(Boolean).join(' '));
            return task.cardKey === 'preop-allergy'
                || /alerji/.test(txt)
                || /lateks/.test(txt)
                || /allergy/.test(txt);
        }

        function nk142FindAllergyTask() {
            const tasks = App?.currentPatient?.preop?.tasks || [];
            return tasks.find(t => t.cardKey === 'preop-allergy')
                || tasks.find(t => /alerji\s*·\s*alerji riskini doğrula/i.test(t.label || ''))
                || tasks.find(nk142IsAllergyTask)
                || null;
        }

        function nk142CurrentAllergyTaskIds() {
            const tasks = App?.currentPatient?.preop?.tasks || [];
            return tasks.filter(nk142IsAllergyTask).map(t => t.id).filter(Boolean);
        }

        function nk142EnsureAliases() {
            try {
                if (typeof MARKER_COMPLETION_ALIASES !== 'undefined') {
                    MARKER_COMPLETION_ALIASES.allergy = Array.from(new Set([...(MARKER_COMPLETION_ALIASES.allergy || []), 'preop-allergy']));
                    MARKER_COMPLETION_ALIASES['preop-allergy'] = Array.from(new Set([...(MARKER_COMPLETION_ALIASES['preop-allergy'] || []), 'preop-allergy']));
                }
            } catch(e) {}
        }

        function nk142EnsureRules() {
            if (typeof TASK_RULE_ENGINE === 'undefined') return;
            TASK_RULE_ENGINE.tasks = TASK_RULE_ENGINE.tasks || {};
            const dynamicIds = nk142CurrentAllergyTaskIds();
            ['t_allergy', 'ltp_allergy', ...dynamicIds, ...NK142_GCKL14_IDS].filter(Boolean).forEach(taskId => {
                TASK_RULE_ENGINE.tasks[taskId] = {
                    ...(TASK_RULE_ENGINE.tasks[taskId] || {}),
                    phase: 'preop',
                    freeComplete: true,
                    requiresPatientTalk: false,
                    blocksPhaseAdvance: true,
                    talkKey: 'allergy',
                    criticalRuleId: 'ltp_allergy',
                    role: 'Preop hemşiresi',
                    guidelineTag: 'WHO SSC'
                };
            });

            TASK_RULE_ENGINE.objectTalkRules = TASK_RULE_ENGINE.objectTalkRules || {};
            TASK_RULE_ENGINE.objectTalkRules.preop = TASK_RULE_ENGINE.objectTalkRules.preop || {};
            TASK_RULE_ENGINE.objectTalkRules.preop.allergy = TASK_RULE_ENGINE.objectTalkRules.preop.allergy || {};
            const r = TASK_RULE_ENGINE.objectTalkRules.preop.allergy;
            r.freeCompleteForTasks = Array.from(new Set([...(r.freeCompleteForTasks || []), ...dynamicIds, 't_allergy', 'ltp_allergy', ...NK142_GCKL14_IDS]));
            r.freeCompleteForCards = Array.from(new Set([...(r.freeCompleteForCards || []), 'preop-allergy']));

            TASK_RULE_ENGINE.labelRules = TASK_RULE_ENGINE.labelRules || [];
            const exists = TASK_RULE_ENGINE.labelRules.some(rule => String(rule?.match || '') === String(/alerji|lateks|allergy/i));
            if (!exists) {
                TASK_RULE_ENGINE.labelRules.push({
                    phase: 'preop',
                    match: /alerji|lateks|allergy/i,
                    config: {
                        freeComplete: true,
                        requiresPatientTalk: false,
                        blocksPhaseAdvance: true,
                        talkKey: 'allergy',
                        criticalRuleId: 'ltp_allergy',
                        role: 'Preop hemşiresi',
                        guidelineTag: 'WHO SSC'
                    }
                });
            }

            try {
                if (typeof CRITICAL_OBJECT_TO_KEY !== 'undefined') CRITICAL_OBJECT_TO_KEY['preop-allergy'] = 'allergy';
            } catch(e) {}
            nk142EnsureAliases();
        }

        function nk142Evidence(task) {
            if (!task?.id || !window.App) return null;
            App.preopCardEvidence = App.preopCardEvidence || {};
            App.preopCardEvidence[task.id] = App.preopCardEvidence[task.id] || {};
            return App.preopCardEvidence[task.id];
        }

        function nk142AllEvidenceDone(task) {
            if (!task) return false;
            const ev = nk142Evidence(task);
            const total = Math.max(1, Array.isArray(task.substeps) && task.substeps.length ? task.substeps.length : 3);
            return Array.from({ length: total }).every((_, i) => !!ev?.[i]);
        }

        function nk142MarkAllergySafe(source = 'auto') {
            try {
                const bucket = getCommunicationBucket?.('preop');
                if (bucket) bucket.allergy = true;
            } catch(e) {}
            try {
                if (App?.osce?.criticalErrors) {
                    App.osce.criticalErrors.allergy = false;
                    App.osce.criticalErrors.allergyMissed = false;
                }
            } catch(e) {}
            NK142_ALLERGY_MARKERS.forEach(k => {
                try { setMarkerKeyDone?.(k, true); } catch(e) {}
                try { completeMarkerBySourceKey?.(k, false); } catch(e) {}
            });
            try { updateMarkerColors?.(); } catch(e) {}
            try { applyMarkerVisibility?.(); } catch(e) {}
        }

        function nk142CompleteGckl14IfPresent(sourceObj) {
            const tasks = App?.currentPatient?.preop?.tasks || [];
            NK142_GCKL14_IDS.forEach(taskId => {
                const t = tasks.find(x => x.id === taskId);
                if (!t || App.completedTasks?.includes(taskId)) return;
                try {
                    App.__nk136AllowComplete = true;
                    completeTask?.(taskId, sourceObj || { label:'Alerji doğrulaması', opts:{ clinicalKey:'preop-allergy' } });
                } catch(e) {
                    console.warn('v5.142 GCKL-14 alerji görevi senkron hatası', e);
                } finally {
                    App.__nk136AllowComplete = false;
                }
            });
        }

        function nk142SyncAllergy(source = 'auto') {
            if (!window.App || App.currentRoom !== 'preop') return false;
            nk142EnsureRules();
            const task = nk142FindAllergyTask();
            if (!task) return false;
            const completed = !!App.completedTasks?.includes(task.id);
            const evidenceDone = nk142AllEvidenceDone(task);
            if (completed || evidenceDone) {
                nk142MarkAllergySafe(source);
                if (evidenceDone && !completed && !App.__nk142CompletingAllergy) {
                    try {
                        App.__nk142CompletingAllergy = true;
                        App.__nk136AllowComplete = true;
                        completeTask?.(task.id, { label:'Alerji doğrulaması', opts:{ clinicalKey:'preop-allergy' } });
                    } catch(e) {
                        console.warn('v5.142 alerji görev tamamlama senkron hatası', e);
                    } finally {
                        App.__nk136AllowComplete = false;
                        App.__nk142CompletingAllergy = false;
                    }
                }
                try { nk142CompleteGckl14IfPresent({ label:'Alerji doğrulaması', opts:{ clinicalKey:'preop-allergy' } }); } catch(e) {}
            }
            try { gcklBoardSyncMarkerState?.(); } catch(e) {}
            try { syncGCKLPatientSafetyScore?.(); } catch(e) {}
            try { renderRightPanel?.(); } catch(e) {}
            try { updateProgressBar?.(); } catch(e) {}
            try { updateScoreStrip?.(); } catch(e) {}
            try { renderTopbar?.(); } catch(e) {}
            return true;
        }

        window.nk142SyncAllergy = nk142SyncAllergy;
        nk142EnsureRules();

        if (typeof completeTask === 'function' && !completeTask.__nk142AllergySync) {
            const prevCompleteTask = completeTask;
            const wrappedCompleteTask = function(taskId, sourceObj = null) {
                try {
                    const task = App?.currentPatient?.[App.currentRoom]?.tasks?.find(t => t.id === taskId);
                    const sourceClinicalKey = String(sourceObj?.opts?.clinicalKey || '');
                    if (App?.currentRoom === 'preop' && (nk142IsAllergyTask(task) || sourceClinicalKey === 'preop-allergy')) {
                        nk142EnsureRules();
                        if (App.__nk136AllowComplete || nk142AllEvidenceDone(task)) nk142MarkAllergySafe('before-completeTask');
                    }
                } catch(e) {}
                const r = prevCompleteTask.apply(this, arguments);
                try { nk142SyncAllergy('completeTask:' + taskId); } catch(e) { console.warn('v5.142 completeTask sonrası alerji senkron hatası', e); }
                return r;
            };
            wrappedCompleteTask.__nk142AllergySync = true;
            try { completeTask = wrappedCompleteTask; } catch(e) {}
            try { window.completeTask = wrappedCompleteTask; } catch(e) {}
        }

        if (typeof showObjPopup === 'function' && !showObjPopup.__nk142AllergySync) {
            const prevShowObjPopup = showObjPopup;
            const wrappedShowObjPopup = function(obj, x, y) {
                const r = prevShowObjPopup.apply(this, arguments);
                try {
                    if (String(obj?.opts?.clinicalKey || '') === 'preop-allergy') setTimeout(() => nk142SyncAllergy('showObjPopup'), 0);
                } catch(e) {}
                return r;
            };
            wrappedShowObjPopup.__nk142AllergySync = true;
            try { showObjPopup = wrappedShowObjPopup; } catch(e) {}
            try { window.showObjPopup = wrappedShowObjPopup; } catch(e) {}
        }

        document.addEventListener('click', (ev) => {
            try {
                const p = ev.target?.closest?.('#obj-popup');
                if (p && /ALERJİ|Alerji/i.test(p.textContent || '')) setTimeout(() => nk142SyncAllergy('popup-click'), 0);
            } catch(e) {}
        }, true);

        window.addEventListener('load', () => {
            setTimeout(() => { try { nk142SyncAllergy('load'); } catch(e) {} }, 600);
            setTimeout(() => { try { nk142SyncAllergy('load-late'); } catch(e) {} }, 1400);
        });
    } catch(err) {
        console.warn('v5.142 Alerji kart/görev/marker senkron patch uygulanamadı', err);
    }
})();


/* =====================================================================
   NK v9.63 — Inline intraop GCKL task patch
   Adds explicit intraop GCKL task cards inside the main app scope.
   This runs before external/inline GCKL modules, while CASES is still in scope.
   ===================================================================== */
(function nk963PatchIntraopGcklTasks(){
    try {
        if (typeof CASES === 'undefined' || !CASES) return;
        const tasksToAdd = [
            {
                id:'intraop_identity_procedure',
                label:'Confirm identity, procedure, site, and planned operation',
                critical:true, score:0, guideline:'who_ssc', phase:'intraop',
                role:'circulating_nurse', responsibleRole:'Circulating nurse + full team',
                gcklNode:'patientProcedureSite', gcklMapId:'intraopIdentityProcedure',
                gcklItems:['GCKL-10','GCKL-11','GCKL-18'],
                linkedObjects:['patient','patient-wristband','patient-file','ssc-board-intraop','time-out'],
                requiredEvidence:['identity_verbal','procedure_verbal','site_marking_visible'],
                evidenceRule:'All identity/procedure/site evidence must be present before incision.',
                phaseAdvancementImpact:'hardStop', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_team_timeout',
                label:'Perform team time-out before incision',
                critical:true, score:0, guideline:'who_ssc', phase:'intraop',
                role:'team', responsibleRole:'Surgeon, anaesthesia, scrub nurse, circulating nurse',
                gcklNode:'timeOutTeam', gcklMapId:'intraopTeamTimeOut',
                gcklItems:['GCKL-17','GCKL-18','GCKL-19'],
                linkedObjects:['time-out','or-team-figures','surgical-team','anesthesia-machine'],
                requiredEvidence:['team_attention'],
                evidenceRule:'Formal time-out evidence is required before incision.',
                phaseAdvancementImpact:'hardStop', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_allergy_antibiotic',
                label:'Confirm allergy and antibiotic status',
                critical:true, score:0, guideline:'who_ssc', phase:'intraop',
                role:'anaesthesia', responsibleRole:'Anaesthesia team + circulating nurse',
                gcklNode:'antibioticProphylaxis', gcklMapId:'intraopAllergyAntibiotic',
                gcklItems:['GCKL-14','GCKL-20'],
                linkedObjects:['anesthesia-machine','antibiotic-syringe','medication-tray','patient-file'],
                requiredEvidence:['antibiotic_time_verified','allergy_cross_checked'],
                evidenceRule:'Allergy and prophylaxis evidence must both be present.',
                phaseAdvancementImpact:'hardStop', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_anaesthesia_safety',
                label:'Confirm anaesthesia safety readiness',
                critical:false, score:0, guideline:'who_ssc', phase:'intraop',
                role:'anaesthesia', responsibleRole:'Anaesthesia team',
                gcklNode:'anesthesiaSafety', gcklMapId:'intraopAnaesthesiaSafety',
                gcklItems:['GCKL-12','GCKL-13'],
                linkedObjects:['anesthesia-machine','monitor','pulse-oximeter','airway-cart','iv-pump-intraop'],
                requiredEvidence:['airway_secured','spo2_reliable','critical_risks_shared'],
                evidenceRule:'Airway, monitoring, and critical-risk evidence complete the task.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_sterile_field',
                label:'Verify sterile field integrity',
                critical:false, score:0, guideline:'aorn', phase:'intraop',
                role:'scrub', responsibleRole:'Scrub nurse + circulating nurse',
                gcklNode:'sterileFieldAndTraffic', gcklMapId:'intraopSterileField',
                gcklItems:['GCKL-22'],
                linkedObjects:['mayo-stand','mayo-table','sterile-drape','back-table','scrub-nurse'],
                requiredEvidence:['sterile_field_intact','traffic_controlled'],
                evidenceRule:'Sterile field and traffic-control evidence complete the task.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_initial_count',
                label:'Perform initial surgical count',
                critical:true, score:0, guideline:'aorn', phase:'intraop',
                role:'scrub', responsibleRole:'Scrub nurse + circulating nurse',
                gcklNode:'countSafety', gcklMapId:'intraopInitialCount',
                gcklItems:['GCKL-27'],
                linkedObjects:['count-board','scrub-nurse','circulating-nurse','mayo-stand'],
                requiredEvidence:['count_initial'],
                evidenceRule:'Initial instrument/sponge/sharp count evidence is required.',
                phaseAdvancementImpact:'hardStop', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_additional_count',
                label:'Update count when additional materials are introduced',
                critical:false, score:0, guideline:'aorn', phase:'intraop',
                role:'circulating_nurse', responsibleRole:'Circulating nurse + scrub nurse',
                gcklNode:'countSafety', gcklMapId:'intraopAdditionalCount',
                gcklItems:['GCKL-27'],
                linkedObjects:['count-board','circulating-nurse','instrument-tray','mayo-stand'],
                requiredEvidence:['count_additional'],
                evidenceRule:'Additional-material count update evidence completes the task.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_final_count',
                label:'Confirm final count before closure',
                critical:true, score:0, guideline:'aorn', phase:'intraop',
                role:'scrub', responsibleRole:'Scrub nurse + circulating nurse + surgeon',
                gcklNode:'countSafety', gcklMapId:'intraopFinalCount',
                gcklItems:['GCKL-27'],
                linkedObjects:['count-board','closure-stage','scrub-nurse','circulating-nurse'],
                requiredEvidence:['count_final'],
                evidenceRule:'Final count evidence is required before closure/postop advancement.',
                phaseAdvancementImpact:'hardStop', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_specimen_safety',
                label:'Verify specimen labelling and handoff',
                critical:false, score:0, guideline:'aorn', phase:'intraop',
                role:'circulating_nurse', responsibleRole:'Circulating nurse + scrub nurse',
                gcklNode:'specimenAndEquipmentIssue', gcklMapId:'intraopSpecimenSafety',
                gcklItems:['GCKL-28'],
                linkedObjects:['specimen-container','specimen-table','label','circulating-nurse'],
                requiredEvidence:['specimen_labeled'],
                evidenceRule:'Specimen label/handoff evidence completes the task.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_equipment_fire_safety',
                label:'Confirm electrosurgery/suction/fire-safety readiness',
                critical:false, score:0, guideline:'aorn', phase:'intraop',
                role:'circulating_nurse', responsibleRole:'Circulating nurse + surgeon + anaesthesia',
                gcklNode:'equipmentAndFireSafety', gcklMapId:'intraopEquipmentFireSafety',
                gcklItems:['GCKL-21','GCKL-23'],
                linkedObjects:['esu-unit','esu-pad','suction-smoke','anesthesia-machine','antiseptic-bottle'],
                requiredEvidence:['esu_pad_position','antiseptic_dry','fire_triangle_assessed'],
                evidenceRule:'ESU, antiseptic dryness, and fire-triangle evidence complete the task.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_cabg_cpb_safety',
                label:'Confirm CABG/CPB readiness for CABG case',
                critical:false, score:0, guideline:'cardiac', phase:'intraop',
                role:'team', responsibleRole:'Surgeon + anaesthesia + perfusionist + circulating nurse',
                gcklNode:'cabgCpbSafety', gcklMapId:'intraopCABGCPBSafety',
                gcklItems:['GCKL-21','GCKL-24'],
                linkedObjects:['cpb-machine','perfusionist','perfusion-console','surgical-field'],
                requiredEvidence:['cpb_machine_ready','perfusion_team_ready','heparin_act_plan_shared'],
                evidenceRule:'CABG cases require CPB machine, perfusion team, and heparin/ACT plan evidence.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_communication_handoff',
                label:'Confirm closed-loop team communication',
                critical:false, score:0, guideline:'who_ssc', phase:'intraop',
                role:'team', responsibleRole:'Full OR team',
                gcklNode:'teamCommunication', gcklMapId:'intraopCommunicationHandoff',
                gcklItems:['GCKL-17','GCKL-29'],
                linkedObjects:['or-team-figures','time-out','circulating-nurse','surgeon'],
                requiredEvidence:['roles_confirmed','closed_loop_confirmed'],
                evidenceRule:'Role clarity and closed-loop communication evidence complete the task.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            // m0167: 4 eksik GCKL network node için görev kartları (imaging, blood-loss, positioning, sign-out).
            // Network node'lar zaten arka planda mevcuttu; bunlar olmadan IGM panele görünmüyorlardı.
            {
                id:'intraop_imaging_review',
                label:'Verify imaging and critical results displayed',
                critical:false, score:0, guideline:'who_ssc', phase:'intraop',
                role:'circulating_nurse', responsibleRole:'Circulating nurse + surgeon',
                gcklNode:'imagingAndResults', gcklMapId:'intraopImagingReview',
                gcklItems:['GCKL-15'],
                linkedObjects:['monitor','image-viewer','patient-record','surgeon'],
                requiredEvidence:['imaging_displayed'],
                evidenceRule:'Relevant imaging/critical results are visible to the team before incision.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_blood_loss_risk',
                label:'Confirm expected blood loss and blood availability',
                critical:false, score:0, guideline:'who_ssc', phase:'intraop',
                role:'anaesthesia', responsibleRole:'Anaesthesia team + circulating nurse',
                gcklNode:'bloodLossRisk', gcklMapId:'intraopBloodLossRisk',
                gcklItems:['GCKL-16'],
                linkedObjects:['anesthesia-machine','iv-pump-intraop','blood-warmer','rapid-infuser','crossmatch-card'],
                requiredEvidence:['expected_loss_announced','blood_availability_confirmed'],
                evidenceRule:'Expected blood loss and availability of blood products are announced and confirmed.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_positioning_temp',
                label:'Verify safe positioning and active warming',
                critical:false, score:0, guideline:'aorn', phase:'intraop',
                role:'circulating_nurse', responsibleRole:'Circulating nurse + anaesthesia',
                gcklNode:'positioningAndTemperature', gcklMapId:'intraopPositioningTemp',
                gcklItems:[],
                linkedObjects:['op-table','positioning-set','forced-air-warmer','temp-trigger-panel'],
                requiredEvidence:['positioning_safe','active_warming_on'],
                evidenceRule:'Pressure points checked; active warming applied to maintain normothermia.',
                phaseAdvancementImpact:'scoreOnly', freeComplete:false, cardKey:'intraop-gckl'
            },
            {
                id:'intraop_signout_handoff',
                label:'Complete Sign-Out and postoperative handoff',
                critical:true, score:0, guideline:'who_ssc', phase:'intraop',
                role:'team', responsibleRole:'Full OR team',
                gcklNode:'signOutHandoff', gcklMapId:'intraopSignoutHandoff',
                gcklItems:['GCKL-26'],
                linkedObjects:['signout-checklist','time-out','circulating-nurse','surgeon','anesthesia-machine'],
                requiredEvidence:['procedure_announced','count_final_confirmed','specimen_confirmed','equipment_issues_announced','postop_critical_plan'],
                evidenceRule:'Sign-Out: procedure, count, specimen, equipment issues, and postoperative plan are verbally confirmed.',
                phaseAdvancementImpact:'hardStop', freeComplete:false, cardKey:'intraop-gckl'
            }
        ];
        function intraopGcklTaskGroup(t) {
            if (/final_count|specimen|communication_handoff/i.test(t.id || '') || t.gcklNode === 'signOutHandoff') {
                return 'Kapanış / Sign-out Görevleri';
            }
            if (t.critical || t.phaseAdvancementImpact === 'hardStop') {
                return 'Zorunlu Güvenlik Görevleri';
            }
            return 'İntraoperatif Bakım / Risk Yönetimi Görevleri';
        }
        function intraopGcklTaskSubsteps(t) {
            if (t.gcklNode === 'countSafety') {
                return ['count_initial', 'count_additional', 'count_final'].map(function(ev) {
                    return { id: ev, label: ev.replace(/^count_/, 'count ') };
                });
            }
            return (t.requiredEvidence || []).map(function(ev) {
                return { id: ev, label: ev.replace(/^count_/, 'count ').replace(/_/g, ' ') };
            });
        }
        const insertAfterHints = ['t_signout', 'ti_signout_full', 'ti_count', 'oti2_count', 'lti_count'];
        Object.keys(CASES).forEach(function(caseId){
            const c = CASES[caseId];
            const phases = [];
            if (c && c.intraop && Array.isArray(c.intraop.tasks)) phases.push(c.intraop);
            if (c && Array.isArray(c.phases)) c.phases.forEach(function(p){ if (p && /intra/i.test(p.label || '') && Array.isArray(p.tasks)) phases.push(p); });
            phases.forEach(function(phase){
                if (!phase || !Array.isArray(phase.tasks)) return;
                tasksToAdd.forEach(function(t){
                    if (t.id === 'intraop_cabg_cpb_safety') {
                        const caseText = [
                            c.id, c.specialty, c.specialtyLabel, c.surgery, c.shortSurgery,
                            ...(Array.isArray(c.riskTags) ? c.riskTags : [])
                        ].filter(Boolean).join(' ').toLowerCase();
                        if (!/(cabg|koroner|coronary|bypass|greft|graft)/i.test(caseText)) return;
                    }
                    if (phase.tasks.some(function(x){ return x && x.id === t.id; })) return;
                    let idx = -1;
                    for (let i = phase.tasks.length - 1; i >= 0; i--) {
                        const id = String(phase.tasks[i]?.id || '');
                        const label = String(phase.tasks[i]?.label || '');
                        if (insertAfterHints.some(function(h){ return id.indexOf(h) !== -1; }) || /sign-out|sayım|numune/i.test(label)) { idx = i; break; }
                    }
                    const clone = Object.assign({}, t, {
                        group: t.group || intraopGcklTaskGroup(t),
                        taskTitle: t.taskTitle || t.label,
                        taskText: t.taskText || t.evidenceRule || t.label,
                        linkedNode: t.linkedNode || t.gcklNode,
                        linkedClinicalKey: t.linkedClinicalKey || (t.linkedObjects && t.linkedObjects[0]) || null,
                        substeps: t.substeps || intraopGcklTaskSubsteps(t),
                        categories: t.categories || ['patientSafety', 'checklistPerformance'],
                        freeComplete: false
                    });
                    if (idx >= 0) phase.tasks.splice(idx + 1, 0, clone); else phase.tasks.push(clone);
                });
            });
        });
        window.NK_INTRAOP_GCKL_TASKS = tasksToAdd.map(function(t){ return Object.assign({}, t); });
        if (typeof TASK_RULE_ENGINE !== 'undefined') {
            TASK_RULE_ENGINE.tasks = TASK_RULE_ENGINE.tasks || {};
            tasksToAdd.forEach(function(t){
                TASK_RULE_ENGINE.tasks[t.id] = Object.assign({}, TASK_RULE_ENGINE.tasks[t.id] || {}, {
                    phase:'intraop',
                    freeComplete:false,
                    requiresPatientTalk:false,
                    requiresTeamTalk:false,
                    requiresEvidence:true,
                    blocksPhaseAdvance:t.phaseAdvancementImpact === 'hardStop',
                    gcklNode:t.gcklNode,
                    gcklMapId:t.gcklMapId,
                    requiredEvidence:t.requiredEvidence || [],
                    linkedObjects:t.linkedObjects || [],
                    role:t.role || t.responsibleRole || 'team',
                    guidelineTag:t.guideline || 'who_ssc'
                });
            });
        }
        console.info('[NK v9.63] Intraop GCKL tasks patched into CASES.');
    } catch (e) {
        console.warn('[NK v9.63] Intraop GCKL task patch failed', e);
    }
})();
