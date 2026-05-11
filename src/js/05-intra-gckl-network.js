/* ===== Inlined from intra-gckl-network.js ===== */
/* ============================================================================
 * INTRA_GCKL_NETWORK — Intraoperatif GCKL Bağımlılık & Puanlama Ağı
 * ----------------------------------------------------------------------------
 * Hedef: WHO Güvenli Cerrahi Kontrol Listesi'nin (GCKL) intraop bölümünü
 *        bağımsız bir ağ olarak puanlamak. CABG/KPB teknik detayları ana
 *        ağa girmez — yalnız rationale metinlerinde örnek olarak geçer.
 *
 * Mimari preop ağıyla birebir uyumlu:
 *   IntraopGCKL.compute()              → {total, earnedBase, lost, bonus, ...}
 *   IntraopGCKL.completeNode(id, ev?)  → görev tag'i akarsa çağrılır
 *   IntraopGCKL.markEvidence(id, key)  → çok parçalı düğümler için (countSafety)
 *   IntraopGCKL.answerRationale(id,i)  → MCQ cevabı (4 şıklı)
 *   IntraopGCKL.markCorrectStop(id)    → doğru durdurma kararı → bonus
 *   IntraopGCKL.canStartIncision()     → patientProcedureSite, antibiotic vb.
 *   IntraopGCKL.canCloseSignout()      → countSafety final, signOut bariyerleri
 *   IntraopGCKL.getNode(id) / getAll() → veri erişimi
 *   IntraopGCKL.reset()
 *
 * Bağımlılık modeli (preop'taki paralel bariyer mantığıyla aynı):
 *   - INCISION kümesi: time-out + 9 paralel bariyer + sayım-başlangıç
 *     Hepsi tamamlanmadan kesi başlamaz (canStartIncision).
 *   - CLOSE kümesi: sayım-kapanış + specimen + signOut
 *     Hepsi tamamlanmadan sign-out kapanmaz (canCloseSignout).
 *   - signOutHandoff upstream tüm hard-stop'lara mantıken bağımlıdır.
 * ========================================================================== */

(function (global) {
  'use strict';

  /* --------------------------------------------------------------------------
   * KATEGORİ TANIMLARI (App.scores köprüsü için)
   * Her düğüm bir veya iki kategoriye katkı verir; preop'taki gibi delta-push
   * çalışır (bootstrap aşaması).
   * ------------------------------------------------------------------------ */
  var CATEGORIES = {
    timeoutVerification:  { label: 'Time-out & Doğrulama',        max: 20 },
    anesthesiaBlood:      { label: 'Anestezi & Kan Yönetimi',     max: 20 },
    sterileEquipPosition: { label: 'Steril / Cihaz / Pozisyon',   max: 20 },
    countSpecimen:        { label: 'Sayım / Numune / Ekipman',    max: 20 },
    signOutHandover:      { label: 'Sign-out & Teslim',           max: 10 },
    reasoningBonus:       { label: 'Akıl Yürütme Bonusu',         max: 10 }
  };

  /* --------------------------------------------------------------------------
   * BARIYER KÜMELERİ — bağımlılık ağı paralel, lineer DEĞİL
   * ------------------------------------------------------------------------ */
  var INCISION_BARRIERS = [
    'timeOutTeam',
    'patientProcedureSite',
    'imagingAndResults',
    'antibioticProphylaxis',
    'anesthesiaSafety',
    'bloodLossRisk',
    'equipmentAndFireSafety',
    'sterileFieldAndTraffic',
    'positioningAndTemperature',
    'countSafety:initial'
  ];

  var CLOSE_BARRIERS = [
    'countSafety:final',
    'specimenAndEquipmentIssue',
    'signOutHandoff'
  ];

  /* --------------------------------------------------------------------------
   * DÜĞÜM TANIMLARI
   * ------------------------------------------------------------------------ */
  function def(o) {
    return Object.assign({
      status: 'pending',              // pending | complete | wrong | partial
      evidenceCollected: {},          // {evidenceKey: true}
      rationaleAnswered: false,
      rationaleCorrect: null,         // true | false | null
      stoppedCorrectly: false,
      scoreEarned: 0,
      scoreLost: 0,
      bonusEarned: 0,
      barrierBreach: false            // hard-stop ihlali
    }, o);
  }

  var NODES = {

    // ── 1. TIME-OUT BAŞLATMA ─────────────────────────────────────────────────
    timeOutTeam: def({
      id: 'timeOutTeam',
      label: 'Time-out: Ekip Tanışması ve Dikkat Toplama',
      gckl: 'Ekip üyeleri kendini adı/rolü ile tanıtır; time-out için tüm ekip dikkatini toplar.',
      category: 'timeoutVerification',
      role: ['surgeon', 'anesthesia', 'circulating', 'scrub'],
      max: 5,
      criticality: 'medium-high',
      hardStop: false,
      prerequisites: [],
      unlocks: ['patientProcedureSite'],
      taskTags: ['t_timeout'],
      linkedObjects: ['or-team-figures', 'or-room'],
      requiredEvidence: ['team_attention'],
      rationale: {
        prompt: 'Time-out başlatıldı, ancak bir cerrahi tekniker prep tepsisini hazırlamaya devam ediyor, anestezi teknisyeni telefondan kayıt giriyor. Doğru yaklaşım hangisidir?',
        options: [
          { text: 'Süreci aksatmamak için time-out hızla tamamlanır; hazırlıklara devam edilir.',
            correct: false, criticalIfChosen: false,
            why: 'Time-out bölünmüş dikkatle yapılırsa bariyer işlevini kaybeder; bu, kontrol listesini ritüele indirger.' },
          { text: 'Time-out durdurulur, herkes elindeki işi bırakır, ekibin tam dikkatiyle baştan başlatılır.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL bir “sözel bariyer”dir; tüm ekibin senkron dikkati olmadan yapılmış sayılmaz.' },
          { text: 'Cerrah yüksek sesle başlar; konuşmayan ekip üyeleri katılmış sayılır.',
            correct: false, criticalIfChosen: false,
            why: 'Sessiz katılım onay değildir; aktif sözel doğrulama gerekir.' },
          { text: 'Time-out cerrah ve anestezi arasında yapılır; hemşireler kendi işlerine bakar.',
            correct: false, criticalIfChosen: true,
            why: 'Sayım ve cihaz güvenliği bilgisi hemşirededir; eksik ekip = eksik bariyer.' }
        ]
      },
      scoreImpact: { correct: 5, incomplete: 2, wrong: -3, hardStop: false, stopBonus: 1 }
    }),

    // ── 2. HASTA / İŞLEM / BÖLGE DOĞRULAMA (ayrı kart) ───────────────────────
    patientProcedureSite: def({
      id: 'patientProcedureSite',
      label: 'Hasta / İşlem / Cerrahi Bölge Doğrulama',
      gckl: 'Doğru hasta, doğru işlem, doğru bölge sözlü olarak doğrulanır ve işaretleme görünür kontrol edilir.',
      category: 'timeoutVerification',
      role: ['surgeon', 'anesthesia', 'circulating'],
      max: 6,
      criticality: 'hard-stop',
      hardStop: true,
      prerequisites: ['timeOutTeam'],
      unlocks: ['imagingAndResults', 'antibioticProphylaxis', 'anesthesiaSafety',
                'bloodLossRisk', 'equipmentAndFireSafety',
                'sterileFieldAndTraffic', 'positioningAndTemperature'],
      taskTags: ['t_site_procedure_verify'],
      linkedObjects: ['patient-wristband', 'consent-form', 'site-marking', 'or-table'],
      requiredEvidence: ['identity_verbal', 'procedure_verbal', 'site_marking_visible'],
      rationale: {
        prompt: 'Time-out sırasında cerrahi bölge işareti drape altında kalmış, konsent formunda taraf yazılmamış. Cerrah “ben biliyorum” diyor. Doğru tutum hangisidir?',
        options: [
          { text: 'Cerrahın klinik bilgisine güvenilir, drape açılmadan ilerlenir.',
            correct: false, criticalIfChosen: true,
            why: 'Yanlış-taraf cerrahisi “neverevent”; otorite baskısıyla atlanmaz. Hard-stop ihlali.' },
          { text: 'Cerrahi başlatılmaz; drape açılır, işaret doğrulanır, konsent eksiği düzeltilir.',
            correct: true, criticalIfChosen: false,
            why: 'Hasta, işlem ve bölge sözlü + görsel doğrulanmadan kesi açılmaz.' },
          { text: 'Konsent eksiği postopa bırakılır; cerrahi başlatılır.',
            correct: false, criticalIfChosen: true,
            why: 'Konsent eksikliği geriye dönük tamamlanmaz; yasal ve etik ihlal.' },
          { text: 'Sirküle hemşire doğrular, cerrah ve anestezi onaylamadan ilerlenir.',
            correct: false, criticalIfChosen: false,
            why: 'Tek kişilik doğrulama yeterli değil; tüm ekip senkron sözel onay vermelidir.' }
        ]
      },
      scoreImpact: { correct: 6, incomplete: 2, wrong: -8, hardStop: true, stopBonus: 2 }
    }),

    // ── 3. GÖRÜNTÜLEME VE KRİTİK SONUÇLAR ────────────────────────────────────
    imagingAndResults: def({
      id: 'imagingAndResults',
      label: 'Görüntüleme ve Kritik Sonuçların Görünürlüğü',
      gckl: 'Gerekli görüntüleme ve kritik laboratuvar/klinik sonuçlar ameliyathanede görünür ve erişilebilirdir.',
      category: 'timeoutVerification',
      role: ['surgeon', 'circulating'],
      max: 4,
      criticality: 'medium',
      hardStop: false,
      prerequisites: ['patientProcedureSite'],
      unlocks: [],
      taskTags: ['t_imaging_intraop'],
      linkedObjects: ['imaging-monitor', 'pacs-station'],
      requiredEvidence: ['imaging_displayed'],
      rationale: {
        prompt: 'Cerrahi planlama için gerekli BT görüntüleri PACS sisteminde açılamıyor. Cerrah “memorize ettim, başlayalım” diyor. Doğru tutum?',
        options: [
          { text: 'Memorize cerrahi yeterli sayılır; kesi açılır.',
            correct: false, criticalIfChosen: false,
            why: 'Bellekten cerrahi planlama güvenli bariyer değil; intraop karar değişebilir.' },
          { text: 'IT çağrılır, görüntüler ekrana getirilene kadar kesi açılmaz.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: kritik görüntüler “görünür” olmalı. Erişilemeyen görüntü = yok sayılan görüntü.' },
          { text: 'Yedek tablet getirilir; kişisel cihazlardan görüntü açılır.',
            correct: false, criticalIfChosen: false,
            why: 'Onaylı olmayan cihazlar versiyon/hasta karışıklığı riski taşır.' },
          { text: 'Cerrahi başlatılır, görüntüler gelene kadar bekleme yapılmaz.',
            correct: false, criticalIfChosen: false,
            why: 'Görüntü-rehberli planlama atlanırsa intraop sürpriz riski artar.' }
        ]
      },
      scoreImpact: { correct: 4, incomplete: 1, wrong: -2, hardStop: false, stopBonus: 1 }
    }),

    // ── 4. ANTİBİYOTİK PROFİLAKSİSİ ──────────────────────────────────────────
    antibioticProphylaxis: def({
      id: 'antibioticProphylaxis',
      label: 'Antibiyotik Profilaksisi Doğrulaması',
      gckl: 'Profilaktik antibiyotik kesiden önceki 60 dakika içinde verilmiş, doz ve alerji uyumu kayıt altındadır.',
      category: 'timeoutVerification',
      role: ['anesthesia', 'circulating'],
      max: 5,
      criticality: 'hard-stop',
      hardStop: true,
      prerequisites: ['patientProcedureSite'],
      unlocks: [],
      taskTags: ['t_antibiotic'],
      linkedObjects: ['antibiotic-syringe', 'anesthesia-cart', 'allergy-band'],
      requiredEvidence: ['antibiotic_time_verified', 'allergy_cross_checked'],
      rationale: {
        prompt: 'Sefazolin verildiği söyleniyor ama kayıt yok. Hastanın penisilin alerjisi olabilir, dosya net değil. Time-out aşamasında doğru tutum?',
        options: [
          { text: 'Antibiyotik verildi varsayılır, cerrahi başlatılır.',
            correct: false, criticalIfChosen: true,
            why: 'Kayıt yok = verilmemiş kabul edilir. Anafilaksi riski + SSI riski iki yönlü tehlike.' },
          { text: 'Cerrahi başlatılmaz; kayıt, alerji öyküsü ve doz teyit edilir; gerekirse antibiyotik tekrar planlanır.',
            correct: true, criticalIfChosen: false,
            why: 'Profilaksi doğrulanmadan kesi açılmaz; alerji belirsizliği time-out tamamlanmasını engeller.' },
          { text: 'Alerji öyküsü olmadan sefazolin yenilenir; sonra ilerlenir.',
            correct: false, criticalIfChosen: true,
            why: 'Alerji belirsizken antibiyotik tekrarı anafilaksiye neden olabilir; önce öykü.' },
          { text: 'Kesi sonrası antibiyotik verilir; profilaksi gecikmesi kabul edilir.',
            correct: false, criticalIfChosen: false,
            why: 'Profilaksi kesiden önceki 60 dk penceresinde etkilidir; sonrası tedavi olur, profilaksi değil.' }
        ]
      },
      scoreImpact: { correct: 5, incomplete: 1, wrong: -5, hardStop: true, stopBonus: 2 }
    }),

    // ── 5. ANESTEZİ GÜVENLİĞİ ────────────────────────────────────────────────
    anesthesiaSafety: def({
      id: 'anesthesiaSafety',
      label: 'Anestezi Güvenliği ve İzlem',
      gckl: 'Airway, pulse oksimetre, monitör, damar yolu ve hasta-spesifik kritik anestezi riskleri ekipçe paylaşılır.',
      category: 'anesthesiaBlood',
      role: ['anesthesia', 'circulating'],
      max: 10,
      criticality: 'medium-high',
      hardStop: false,
      prerequisites: ['patientProcedureSite'],
      unlocks: [],
      taskTags: ['t_anesthesia_assist'],
      linkedObjects: ['anesthesia-machine', 'pulse-oximeter', 'monitor', 'iv-line'],
      requiredEvidence: ['airway_secured', 'spo2_reliable', 'critical_risks_shared'],
      rationale: {
        prompt: 'Pulse oksimetre 92% gösteriyor, dalga formu düzensiz; hasta soğuk ve periferik nabız zayıf. Cerrahi başlamak üzere. Doğru tutum?',
        options: [
          { text: 'SpO₂ değerine güvenilir; cerrahi başlatılır.',
            correct: false, criticalIfChosen: true,
            why: 'Güvenilmez dalga formu = güvenilmez SpO₂; periferik hipoperfüzyon sensörü yanıltır.' },
          { text: 'Sensör yeri/perfüzyon değerlendirilir, ısıtma uygulanır, dalga formu güvenilir hale gelene kadar kesi geciktirilir.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: pulse oksimetre “fonksiyonel ve güvenilir” olmalı. Güvenilmez izlem = izlem yok sayılır.' },
          { text: 'Cerrahi başlatılır, anestezi “problem olursa müdahale eder”.',
            correct: false, criticalIfChosen: false,
            why: 'Reaktif yönetim güvenli değil; proaktif izlem GCKL şartıdır.' },
          { text: 'SpO₂ klipsi başka parmağa takılır; başka adım atılmaz.',
            correct: false, criticalIfChosen: false,
            why: 'Sensör yeri yardımcı olabilir ama tek başına yeterli değil; perfüzyon ve dalga formu da kontrol edilmelidir.' }
        ]
      },
      scoreImpact: { correct: 10, incomplete: 4, wrong: -4, hardStop: false, stopBonus: 1 }
    }),

    // ── 6. KAN KAYBI RİSKİ VE HAZIRLIK ───────────────────────────────────────
    bloodLossRisk: def({
      id: 'bloodLossRisk',
      label: 'Beklenen Kan Kaybı ve Kan Hazırlığı',
      gckl: 'Beklenen kan kaybı, kan/kan ürünü hazırlığı, geniş damar yolu ve transfüzyon planı ekipçe paylaşılır.',
      category: 'anesthesiaBlood',
      role: ['surgeon', 'anesthesia', 'circulating'],
      max: 10,
      criticality: 'medium-high',
      hardStop: false,
      prerequisites: ['patientProcedureSite'],
      unlocks: [],
      taskTags: ['t_fluid_blood'],
      linkedObjects: ['blood-bags', 'iv-line', 'rapid-infuser'],
      // (CABG örneği rationale içinde: cell saver, TXA, crossmatch hatırlatması)
      requiredEvidence: ['expected_loss_announced', 'blood_availability_confirmed'],
      rationale: {
        prompt: '>500 mL kan kaybı beklenen bir vakada cerrah “muhtemelen gerekmez” diyor, crossmatch durumu belirsiz. Doğru tutum?',
        options: [
          { text: 'Crossmatch belirsizken cerrahi başlatılır; gerekirse acil istenir.',
            correct: false, criticalIfChosen: true,
            why: 'Acil crossmatch dakikalar alır; >500 mL beklentide hazırlık kesi öncesi yapılır. (CABG örneği: cell saver/TXA hazırlığı.)' },
          { text: 'Kan ürünü erişilebilirliği teyit edilir, crossmatch tamamlanır, ekip transfüzyon eşiğini paylaşır; sonra başlanır.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: kan kaybı riski varsa hazırlık ve plan ekipçe açıkça paylaşılır.' },
          { text: 'Anestezi tek başına kan istemini takip eder; cerrahi ekibi bilgilendirilmez.',
            correct: false, criticalIfChosen: false,
            why: 'GCKL paylaşılan zihinsel model gerektirir; tek noktada bilgi = bariyer açığı.' },
          { text: 'Hasta yakını kan vermeye hazır olduğu için hazırlık atlanır.',
            correct: false, criticalIfChosen: true,
            why: 'Aile bağışı zaman alır, test sürecinden geçmelidir; hazırlık değil son çare.' }
        ]
      },
      scoreImpact: { correct: 10, incomplete: 4, wrong: -5, hardStop: false, stopBonus: 1 }
    }),

    // ── 7. CİHAZ VE YANGIN GÜVENLİĞİ ─────────────────────────────────────────
    equipmentAndFireSafety: def({
      id: 'equipmentAndFireSafety',
      label: 'Cihaz, ESU ve Yangın Güvenliği',
      gckl: 'ESU plakası, prep kuruluğu, oksijen birikimi, duman tahliye ve aspirasyon kontrol edilir; yangın üçgeni değerlendirilir.',
      category: 'sterileEquipPosition',
      role: ['surgeon', 'scrub', 'circulating'],
      max: 8,
      criticality: 'hard-stop',
      hardStop: true,
      prerequisites: ['patientProcedureSite'],
      unlocks: [],
      taskTags: ['t_equipment', 't_antiseptic'],
      linkedObjects: ['esu-unit', 'antiseptic-bottle', 'smoke-evacuator', 'oxygen-source'],
      requiredEvidence: ['esu_pad_position', 'antiseptic_dry', 'fire_triangle_assessed'],
      rationale: {
        prompt: 'Alkol bazlı antiseptik henüz kurumamış. Cerrah “zaman kaybetmeyelim” diyerek ESU ile insizyon istiyor. Doğru tutum?',
        options: [
          { text: 'ESU düşük güçle kullanılır; kuruma için ek süre verilmez.',
            correct: false, criticalIfChosen: true,
            why: 'Yangın üçgeni: yakıt (alkol) + ısı (ESU) + oksijen → alev. Hard-stop ihlali.' },
          { text: 'ESU/kesi durdurulur; antiseptik tamamen kuruyana kadar beklenir, ekip yangın riski açısından bilgilendirilir.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: yangın riski azaltılmadan termal cihaz kullanılmaz. Kuru prep zorunludur.' },
          { text: 'Bipolar yerine monopolar tercih edilir; kuruma beklenmez.',
            correct: false, criticalIfChosen: true,
            why: 'Cihaz tipi değişikliği yakıtı ortadan kaldırmaz; risk devam eder.' },
          { text: 'Drape ile alan kapatılır; alkol altta kalsa da risk azalmış sayılır.',
            correct: false, criticalIfChosen: true,
            why: 'Drape altında biriken alkol buharı yangın riskini artırır, azaltmaz.' }
        ]
      },
      scoreImpact: { correct: 8, incomplete: 3, wrong: -6, hardStop: true, stopBonus: 2 }
    }),

    // ── 8. STERİL ALAN VE ODA TRAFİĞİ ────────────────────────────────────────
    sterileFieldAndTraffic: def({
      id: 'sterileFieldAndTraffic',
      label: 'Steril Alan Bütünlüğü ve Oda Trafiği',
      gckl: 'Steril alan, Mayo/back table, kapı trafiği ve kontaminasyon riski sürekli kontrol edilir.',
      category: 'sterileEquipPosition',
      role: ['scrub', 'circulating'],
      max: 6,
      criticality: 'medium',
      hardStop: false,
      prerequisites: ['patientProcedureSite'],
      unlocks: [],
      taskTags: ['t_sterile_field'],
      linkedObjects: ['mayo-table', 'back-table', 'sterile-drape', 'or-door'],
      requiredEvidence: ['sterile_field_intact', 'traffic_controlled'],
      rationale: {
        prompt: 'Steril giysili bir asistan dolaşan hemşirenin omzuna sürtünerek geçti, gown sırt bölgesi temas etti. Doğru tutum?',
        options: [
          { text: 'Sırt zaten steril alanın dışı sayılır; bir şey yapılmaz.',
            correct: false, criticalIfChosen: false,
            why: 'Sırt evet, ama dirsek-omuz arası belirsiz; temas süresi ve yeri değerlendirilmelidir.' },
          { text: 'Asistanın gown durumu değerlendirilir; gerekirse gown değiştirilir, ekip bilgilendirilir.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: kontaminasyon şüphesi → değerlendirme + iletişim. Şüphe = ihlal kabul edilir.' },
          { text: 'Cerrahi durdurulup hasta yeniden prep edilir.',
            correct: false, criticalIfChosen: false,
            why: "Aşırı reaksiyon; hasta steril alanı değil, asistanın gown'u değerlendirilmeli." },
          { text: 'Sirküle hemşire kararı kendisi alır, cerrahı bilgilendirmez.',
            correct: false, criticalIfChosen: false,
            why: "Ekip senkron bilgi paylaşmalı; tek başına karar GCKL'e aykırı." }
        ]
      },
      scoreImpact: { correct: 6, incomplete: 2, wrong: -3, hardStop: false, stopBonus: 1 }
    }),

    // ── 9. POZİSYON VE SICAKLIK YÖNETİMİ ─────────────────────────────────────
    positioningAndTemperature: def({
      id: 'positioningAndTemperature',
      label: 'Pozisyon, Bası Yaralanması ve Hipotermi Önleme',
      gckl: 'Hasta pozisyonu, bası noktaları, sinir koruma, aktif ısıtma ve çekirdek sıcaklık izlemi doğrulanır.',
      category: 'sterileEquipPosition',
      role: ['anesthesia', 'circulating', 'scrub'],
      max: 6,
      criticality: 'medium',
      hardStop: false,
      prerequisites: ['patientProcedureSite'],
      unlocks: [],
      taskTags: ['t_position', 't_temp'],
      linkedObjects: ['or-table', 'warming-blanket', 'pressure-points', 'arm-board'],
      requiredEvidence: ['positioning_safe', 'active_warming_on'],
      rationale: {
        prompt: 'Hasta sıcaklığı 35.8°C, periferik aktif ısıtma yok, oda 19°C. Cerrahi başlamak üzere. Doğru tutum?',
        options: [
          { text: 'Hipotermi sınırı 35.0°C; 35.8 normal kabul edilir.',
            correct: false, criticalIfChosen: false,
            why: 'Perioperatif hipotermi <36°C olarak tanımlanır; SSI, koagülopati ve uzamış uyanma riski artar.' },
          { text: 'Aktif ısıtma (forced-air) başlatılır, oda sıcaklığı ayarlanır, çekirdek sıcaklık izlemi sürdürülür.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: hipotermi önleme bir bariyerdir; pasif ısıtma yetmez.' },
          { text: 'Sıcak serum infüzyonu yeterli sayılır.',
            correct: false, criticalIfChosen: false,
            why: 'Yardımcı önlem ama tek başına yeterli değil; konvektif ısıtma önceliklidir.' },
          { text: 'Pozisyon zaten doğru, sıcaklık postopa bırakılır.',
            correct: false, criticalIfChosen: false,
            why: 'İntraop hipotermi başladığında geri çevirmek zordur; önleme intraop bariyeridir.' }
        ]
      },
      scoreImpact: { correct: 6, incomplete: 2, wrong: -3, hardStop: false, stopBonus: 1 }
    }),

    // ── 10. SAYIM GÜVENLİĞİ (2 evidence: başlangıç + kapanış) ────────────────
    countSafety: def({
      id: 'countSafety',
      label: 'Sayım Güvenliği (Başlangıç + Kapanış)',
      gckl: 'Alet, spanç ve iğne sayımı kesi öncesi ve kapanış öncesi ekipçe sesli ve kayıtlı doğrulanır.',
      category: 'countSpecimen',
      role: ['scrub', 'circulating'],
      max: 12,
      criticality: 'hard-stop',
      hardStop: true,
      prerequisites: ['patientProcedureSite'],     // başlangıç için
      // final evidence kapanış kümesinin parçası — canCloseSignout kontrol eder
      unlocks: ['specimenAndEquipmentIssue', 'signOutHandoff'],
      taskTags: ['t_count_initial', 't_count_final'],
      taskEvidenceMap: {                            // hangi tag hangi evidence'a karşılık
        't_count_initial': 'count_initial',
        't_count_final': 'count_final'
      },
      linkedObjects: ['count-board', 'instrument-tray', 'sponge-pack', 'needle-counter'],
      requiredEvidence: ['count_initial', 'count_final'],
      evidenceScore: { count_initial: 5, count_final: 7 },  // toplam 12
      rationale: {
        prompt: 'Kapanış sayımında spanç sayısı 1 eksik. Cerrah “muhtemelen çöpe gitti, kapatın” diyor. Scrub hemşire emin değil. Doğru tutum?',
        options: [
          { text: 'Cerrahın talimatı izlenir; kapatma başlar.',
            correct: false, criticalIfChosen: true,
            why: 'Retained surgical item = never event. Sayım tutarsızsa kapatma yapılmaz, otorite baskısı geçersizdir.' },
          { text: 'Kapanış durdurulur; sayım tekrar yapılır; bulunamazsa görüntüleme istenir, ekip bilgilendirilir, kayıt tutulur.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: sayım tutarsızlığı kapanışın hard-stop bariyerini açar.' },
          { text: 'Çöp aranır; bulunmazsa kapatılır, postop görüntüleme planlanır.',
            correct: false, criticalIfChosen: true,
            why: 'Postop görüntüleme alternatif değil; intraop görüntüleme + kayıt zorunludur.' },
          { text: 'Sayım %95 tamamsa kabul edilebilir.',
            correct: false, criticalIfChosen: true,
            why: 'Sayım ikili sistemdir: tam ya da değil. Tolerans yoktur.' }
        ]
      },
      scoreImpact: { correct: 12, incomplete: 5, wrong: -8, hardStop: true, stopBonus: 2 }
    }),

    // ── 11. NUMUNE VE EKİPMAN SORUNU ─────────────────────────────────────────
    specimenAndEquipmentIssue: def({
      id: 'specimenAndEquipmentIssue',
      label: 'Numune Etiketleme ve Ekipman Sorunu Bildirimi',
      gckl: 'Numune adı, hasta bilgisi, etiketleme; ekipman sorunu, arıza ve kayıt ekipçe doğrulanır.',
      category: 'countSpecimen',
      role: ['scrub', 'circulating'],
      max: 8,
      criticality: 'medium',
      hardStop: false,
      prerequisites: ['countSafety:initial'],
      unlocks: ['signOutHandoff'],
      taskTags: ['t_specimen'],
      linkedObjects: ['specimen-container', 'specimen-label', 'equipment-log'],
      requiredEvidence: ['specimen_labeled', 'equipment_issues_reported'],
      rationale: {
        prompt: 'Patoloji numunesinin etiketinde hasta soyadı yanlış yazılmış, kap üzerindeki barkod başka hastaya ait. Doğru tutum?',
        options: [
          { text: 'Kabı patolojiye göndermek için cerrah ile doğrulanır; yola çıkarılır.',
            correct: false, criticalIfChosen: true,
            why: 'Yanlış etiketli numune = yanlış tanı, yanlış tedavi. Sözlü doğrulama yetmez.' },
          { text: 'Numune çıkışı durdurulur; hasta-örnek eşleşmesi düzeltilir, kayıt yenilenir, ekip bilgilendirilir.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: numune etiketleme sözlü doğrulamayla yapılır; uyumsuzluk bariyer ihlalidir.' },
          { text: 'Sirküle hemşire etiketi tek başına düzeltir, cerrahı bilgilendirmez.',
            correct: false, criticalIfChosen: false,
            why: 'Numune sorumluluğu paylaşılır; tek noktadan düzeltme iz bırakmaz.' },
          { text: 'Etiket sorunu patolojide düzeltilebilir; gönderilir.',
            correct: false, criticalIfChosen: true,
            why: 'Numune odadan ayrıldığında zincir kırılır; düzeltme kaynağında yapılmalıdır.' }
        ]
      },
      scoreImpact: { correct: 8, incomplete: 3, wrong: -4, hardStop: false, stopBonus: 1 }
    }),

    // ── 12. SIGN-OUT VE GÜVENLİ TESLİM ───────────────────────────────────────
    signOutHandoff: def({
      id: 'signOutHandoff',
      label: 'Sign-out ve Postop Güvenli Teslim',
      gckl: 'Yapılan işlem, sayım, numune, ekipman sorunu ve postop kritik bakım planı ekipçe sözlü doğrulanır.',
      category: 'signOutHandover',
      role: ['surgeon', 'anesthesia', 'circulating', 'scrub'],
      max: 10,
      criticality: 'hard-stop',
      hardStop: true,
      prerequisites: ['countSafety:final', 'specimenAndEquipmentIssue'],
      unlocks: [],
      taskTags: ['t_signout'],
      linkedObjects: ['signout-checklist', 'transfer-stretcher', 'icu-handoff-card'],
      requiredEvidence: ['procedure_announced', 'count_final_confirmed',
                         'specimen_confirmed', 'equipment_issues_announced',
                         'postop_critical_plan'],
      rationale: {
        prompt: 'Sayım tam, numune etiketli. Anestezi “postop ekstübasyon erken planlanıyor, ek bilgi gerekmez” diyerek transferi başlatmak istiyor. Sign-out tamamlanmış sayılır mı?',
        options: [
          { text: 'Evet, ana maddeler tamam; postop bilgi anestezi hekimine bırakılır.',
            correct: false, criticalIfChosen: true,
            why: 'Sign-out postop kritik bakım planını da KAPSAR; anestezi tek başına aktaramaz, ekipçe doğrulanır.' },
          { text: 'Hayır. Sign-out, postop kritik bakım gereksinimlerini (inotrop, drenaj, ağrı, antikoagülasyon, izlem hedefleri) açıkça içermeli; transfer ondan sonra yapılır.',
            correct: true, criticalIfChosen: false,
            why: 'GCKL: sign-out devamlılık bariyeridir; eksik teslim postop dönemde olumsuz olay riskini artırır.' },
          { text: "Postop bilgiler ICU'da hemşireden hemşireye aktarılır, OR'da konuşulmaz.",
            correct: false, criticalIfChosen: true,
            why: 'OR ekibi → transfer ekibi → ICU şeklinde kapalı döngü iletişim gerekir.' },
          { text: 'Sign-out yazılı not ile yapılır; sözlü tekrar gerekmez.',
            correct: false, criticalIfChosen: false,
            why: 'GCKL sözlü-yazılı çift kanal gerektirir; yalnız yazı bariyer değildir.' }
        ]
      },
      scoreImpact: { correct: 10, incomplete: 3, wrong: -7, hardStop: true, stopBonus: 2 }
    })
  };

  /* --------------------------------------------------------------------------
   * HESAPLAMA
   * ------------------------------------------------------------------------ */
  function computeNodeEarned(node) {
    if (node.status === 'wrong') return 0;
    if (node.id === 'countSafety') {
      // evidence-bazlı puanlama (toplam max 12)
      var e = 0;
      if (node.evidenceCollected.count_initial) e += node.evidenceScore.count_initial;
      if (node.evidenceCollected.count_final)   e += node.evidenceScore.count_final;
      return e;
    }
    if (node.status === 'complete') return node.scoreImpact.correct;
    if (node.status === 'partial')  return node.scoreImpact.incomplete;
    return 0;
  }

  function nodePrereqsMet(node) {
    if (!node.prerequisites || !node.prerequisites.length) return true;
    return node.prerequisites.every(function (p) {
      if (p.indexOf(':') !== -1) {
        var parts = p.split(':');
        var n = NODES[parts[0]];
        return !!(n && n.evidenceCollected[ 'count_' + parts[1] ]);
      }
      var dep = NODES[p];
      return !!(dep && (dep.status === 'complete' || dep.status === 'partial'));
    });
  }

  function compute() {
    var earnedBase = 0, lost = 0, bonus = 0;
    var byCategory = {};
    Object.keys(CATEGORIES).forEach(function (k) {
      byCategory[k] = { earned: 0, max: CATEGORIES[k].max, label: CATEGORIES[k].label };
    });

    var breaches = [];
    var missingCritical = [];
    var nodeReport = {};

    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id];
      var e = computeNodeEarned(n);
      n.scoreEarned = e;
      earnedBase += e;
      lost += n.scoreLost;
      bonus += n.bonusEarned;
      if (byCategory[n.category]) byCategory[n.category].earned += e;
      if (n.barrierBreach) breaches.push({ id: id, label: n.label });
      if (n.hardStop && n.status !== 'complete' && n.status !== 'partial') {
        missingCritical.push({ id: id, label: n.label });
      }
      nodeReport[id] = {
        id: id, label: n.label, status: n.status,
        earned: e, max: n.max, lost: n.scoreLost,
        prereqsMet: nodePrereqsMet(n),
        evidence: Object.keys(n.evidenceCollected),
        rationale: n.rationaleAnswered
          ? { answered: true, correct: n.rationaleCorrect }
          : { answered: false },
        breach: n.barrierBreach
      };
    });

    // Reasoning bonus tavanı 10
    if (bonus > CATEGORIES.reasoningBonus.max) bonus = CATEGORIES.reasoningBonus.max;
    byCategory.reasoningBonus.earned = bonus;

    var total = earnedBase - lost + bonus;
    if (total < 0) total = 0;

    // Bariyer ihlali varsa max 49 (faz geçemez)
    var barrierCap = breaches.length > 0 ? 49 : 100;
    if (total > barrierCap) total = barrierCap;
    if (total > 100) total = 100;

    return {
      total: Math.round(total),
      earnedBase: earnedBase,
      lost: lost,
      reasoningBonus: bonus,
      barrierCap: barrierCap,
      byCategory: byCategory,
      breaches: breaches,
      missingCritical: missingCritical,
      nodes: nodeReport,
      canStartIncision: canStartIncision(),
      canCloseSignout: canCloseSignout()
    };
  }

  /* --------------------------------------------------------------------------
   * GÖREV BAĞLAMA: tag → node tamamlama
   * Bootstrap aşamasında window.IntraopGCKL.completeNode çağrılır.
   * ------------------------------------------------------------------------ */
  function completeNode(nodeId, evidenceKey) {
    var n = NODES[nodeId];
    if (!n) return false;
    if (evidenceKey) {
      n.evidenceCollected[evidenceKey] = true;
      // tüm requiredEvidence toplandıysa status complete
      var allEv = (n.requiredEvidence || []).every(function (k) {
        return !!n.evidenceCollected[k];
      });
      n.status = allEv ? 'complete' : 'partial';
    } else {
      // evidence belirtilmedi → otomatik tüm required'ı işaretle
      (n.requiredEvidence || []).forEach(function (k) { n.evidenceCollected[k] = true; });
      n.status = 'complete';
    }
    return true;
  }

  function markEvidence(nodeId, evidenceKey) {
    return completeNode(nodeId, evidenceKey);
  }

  /* --------------------------------------------------------------------------
   * MCQ — gerekçelendirme cevabı
   * ------------------------------------------------------------------------ */
  function answerRationale(nodeId, optionIndex) {
    var n = NODES[nodeId];
    if (!n || !n.rationale) return null;
    var opt = n.rationale.options[optionIndex];
    if (!opt) return null;

    n.rationaleAnswered = true;
    n.rationaleCorrect = !!opt.correct;

    var result = {
      nodeId: nodeId, correct: !!opt.correct,
      criticalIfChosen: !!opt.criticalIfChosen,
      why: opt.why, scoreDelta: 0, bonusDelta: 0,
      barrierBreach: false, lostDelta: 0
    };

    if (opt.correct) {
      // Doğru gerekçelendirme: bonus +1 (max 10)
      var b = 1;
      n.bonusEarned += b;
      result.bonusDelta = b;
    } else {
      // Yanlış gerekçelendirme: puan kaybı
      var loss = Math.abs(n.scoreImpact.wrong);
      // criticalIfChosen ise düğüm wrong'a düşer + bariyer ihlali (hard-stop'sa)
      if (opt.criticalIfChosen) {
        n.status = 'wrong';
        if (n.hardStop) {
          n.barrierBreach = true;
          result.barrierBreach = true;
        }
      }
      n.scoreLost += loss;
      result.lostDelta = loss;
      result.scoreDelta = -loss;
    }
    return result;
  }

  /* --------------------------------------------------------------------------
   * DOĞRU DURDURMA BONUSU
   * ------------------------------------------------------------------------ */
  function markCorrectStop(nodeId) {
    var n = NODES[nodeId];
    if (!n) return false;
    if (n.stoppedCorrectly) return false; // çift saymayı önle
    n.stoppedCorrectly = true;
    var b = n.scoreImpact.stopBonus || 1;
    n.bonusEarned += b;
    return { nodeId: nodeId, bonusDelta: b };
  }

  /* --------------------------------------------------------------------------
   * AKIŞ KİLİDİ
   * ------------------------------------------------------------------------ */
  function canStartIncision() {
    var missing = [];
    INCISION_BARRIERS.forEach(function (key) {
      if (key.indexOf(':') !== -1) {
        var parts = key.split(':');
        var n = NODES[parts[0]];
        if (!n.evidenceCollected['count_' + parts[1]]) {
          missing.push({ id: parts[0], evidence: 'count_' + parts[1], label: n.label + ' (başlangıç)' });
        }
      } else {
        var node = NODES[key];
        if (node.status !== 'complete' && node.status !== 'partial') {
          missing.push({ id: key, label: node.label });
        }
        if (node.barrierBreach) {
          missing.push({ id: key, label: node.label + ' (bariyer ihlali)' });
        }
      }
    });
    return { ok: missing.length === 0, missing: missing };
  }

  function canCloseSignout() {
    var missing = [];
    CLOSE_BARRIERS.forEach(function (key) {
      if (key.indexOf(':') !== -1) {
        var parts = key.split(':');
        var n = NODES[parts[0]];
        if (!n.evidenceCollected['count_' + parts[1]]) {
          missing.push({ id: parts[0], evidence: 'count_' + parts[1], label: n.label + ' (kapanış)' });
        }
      } else {
        var node = NODES[key];
        // ADIM 6 DÜZELTMESİ (Spec madde 8):
        // signOutHandoff için 'partial' yetmez — tüm requiredEvidence şart.
        // Kart üzerinde tek evidence işaretlemekle sign-out tamamlanmış sayılmamalı.
        if (key === 'signOutHandoff') {
          var reqEvs = node.requiredEvidence || [];
          var missingEvs = reqEvs.filter(function (ev) { return !node.evidenceCollected[ev]; });
          if (missingEvs.length > 0) {
            missing.push({
              id: key,
              label: node.label + ' (eksik evidence: ' + missingEvs.join(', ') + ')'
            });
          }
        } else if (node.status !== 'complete' && node.status !== 'partial') {
          missing.push({ id: key, label: node.label });
        }
        if (node.barrierBreach) {
          missing.push({ id: key, label: node.label + ' (bariyer ihlali)' });
        }
      }
    });
    return { ok: missing.length === 0, missing: missing };
  }

  /* --------------------------------------------------------------------------
   * RESET
   * ------------------------------------------------------------------------ */
  function reset() {
    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id];
      n.status = 'pending';
      n.evidenceCollected = {};
      n.rationaleAnswered = false;
      n.rationaleCorrect = null;
      n.stoppedCorrectly = false;
      n.scoreEarned = 0;
      n.scoreLost = 0;
      n.bonusEarned = 0;
      n.barrierBreach = false;
    });
  }

  /* --------------------------------------------------------------------------
   * GETTER'LAR
   * ------------------------------------------------------------------------ */
  function getNode(id) { return NODES[id] || null; }
  function getAll()    { return NODES; }
  function getCategories() { return CATEGORIES; }
  function getBarriers() { return { incision: INCISION_BARRIERS.slice(), close: CLOSE_BARRIERS.slice() }; }

  /* --------------------------------------------------------------------------
   * PUBLIC API
   * ------------------------------------------------------------------------ */
  global.IntraopGCKL = {
    compute:          compute,
    completeNode:     completeNode,
    markEvidence:     markEvidence,
    answerRationale:  answerRationale,
    markCorrectStop:  markCorrectStop,
    canStartIncision: canStartIncision,
    canCloseSignout:  canCloseSignout,
    getNode:          getNode,
    getAll:           getAll,
    getCategories:    getCategories,
    getBarriers:      getBarriers,
    reset:            reset,
    _NODES:           NODES,
    _version:         '1.0.0-intraop-gckl'
  };

})(typeof window !== 'undefined' ? window : globalThis);

/* ===== End inline intra-gckl-network.js ===== */
