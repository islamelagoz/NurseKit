/* =====================================================================
 * INTRA_POPUPS v2 — Preop NK136 mimari paritesi (tam spec uygulaması)
 * v9.65 — Aşama 4 (genişletilmiş şema, validator dahil)
 *
 * Amaç: intraop 3D nesnelerinin her birini, preop NK136_POPUPS yapısının
 * tam muadili olan nesne-spesifik kart tanımına bağlamak.
 *
 * Kapsam (Dr. İslam spec'i):
 *  - 28 mantıksal kart, 21 zorunlu alan
 *  - Evidence key'leri INTRAOP_GCKL_NETWORK ile birebir uyumlu
 *  - Tek kaynak: IntraopGCKL.compute() (popup, harita, panel, skor, debrief)
 *  - Hard-stop / conditional / stop bonus mantığı
 *  - validateIntraPopups() console.table raporu
 *  - Tek renderIntraProtocolCard fonksiyonu
 *
 * Kanıt:
 *  - WHO Surgical Safety Checklist v2.0 (2009)
 *  - AORN Guidelines for Perioperative Practice 2024
 *  - Joint Commission Universal Protocol
 * ================================================================== */
(function () {
  'use strict';

  // =================================================================
  //  GERÇEK NODE EVIDENCE KEYS (INTRAOP_GCKL_NETWORK uyumlu)
  //  Aşağıdaki evidence key'leri ağ tanımlarından çıkarılmıştır;
  //  buton tanımları bu key'lere %100 uyumlu olmalı yoksa
  //  markEvidence sessizce başarısız olur.
  // =================================================================
  const NODE_EV = {
    timeOutTeam:                ['team_attention'],
    patientProcedureSite:       ['identity_verbal', 'procedure_verbal', 'site_marking_visible'],
    imagingAndResults:          ['imaging_displayed'],
    antibioticProphylaxis:      ['antibiotic_time_verified', 'allergy_cross_checked'],
    anesthesiaSafety:           ['airway_secured', 'spo2_reliable', 'critical_risks_shared'],
    bloodLossRisk:              ['expected_loss_announced', 'blood_availability_confirmed'],
    equipmentAndFireSafety:     ['esu_pad_position', 'antiseptic_dry', 'fire_triangle_assessed'],
    sterileFieldAndTraffic:     ['sterile_field_intact', 'traffic_controlled'],
    positioningAndTemperature:  ['positioning_safe', 'active_warming_on'],
    countSafety:                ['count_initial', 'count_additional', 'count_final'],
    specimenAndEquipmentIssue:  ['specimen_labeled', 'equipment_issues_reported'],
    signOutHandoff:             ['procedure_announced', 'count_final_confirmed', 'specimen_confirmed', 'equipment_issues_announced', 'postop_critical_plan'],
    cabgCpbSafety:              ['cpb_machine_ready', 'perfusion_team_ready', 'heparin_act_plan_shared'],
    teamCommunication:          ['roles_confirmed', 'closed_loop_confirmed']
  };

  const NODE_SCORE = {
    timeOutTeam: 5, patientProcedureSite: 6, imagingAndResults: 4, antibioticProphylaxis: 5,
    anesthesiaSafety: 10, bloodLossRisk: 10, equipmentAndFireSafety: 8,
    sterileFieldAndTraffic: 6, positioningAndTemperature: 6, countSafety: 12,
    specimenAndEquipmentIssue: 8, signOutHandoff: 10, cabgCpbSafety: 5, teamCommunication: 5
  };

  const NODE_HARDSTOP = {
    timeOutTeam: 'conditional', patientProcedureSite: true, imagingAndResults: false,
    antibioticProphylaxis: 'conditional', anesthesiaSafety: false, bloodLossRisk: false,
    equipmentAndFireSafety: 'conditional', sterileFieldAndTraffic: false,
    positioningAndTemperature: 'conditional', countSafety: true,
    specimenAndEquipmentIssue: false, signOutHandoff: true,
    cabgCpbSafety: false, teamCommunication: false
  };

  // =================================================================
  //  28 MANTIKSAL KART — tam genişletilmiş şema
  //  Her clinicalKey ana kart adına alias olabilir (KEY_ALIAS).
  // =================================================================
  const CARDS = {

    /* ====== A) TIME-OUT / EKİP KATILIMI (timeOutTeam) ====== */

    'time-out': {
      node: 'timeOutTeam', taskTag: 't_timeout',
      title: 'TIME-OUT VE EKİP KATILIMI',
      subtitle: 'Kesi öncesi tüm ekibin dikkatini ortak güvenlik doğrulamasına toplar.',
      chips: ['Time-out', 'WHO SSC', 'Ekip katılımı'],
      category: 'timeoutVerification',
      role: 'Sirküle hemşire time-out\'u başlatır; cerrah, anestezi, scrub ve sirküle ekip aktif katılır.',
      gcklItem: 'Ekip üyeleri kendini tanıtır; görev ve roller netleşir.',
      desc: 'Time-out yalnız kayıt için yapılan formal bir işlem değildir. Cerrahi başlamadan önce ekip hasta, işlem, bölge ve kritik riskleri aynı anda doğrular.',
      linkedTask: 'Time-out görevini başlat ve ekip katılımını doğrula.',
      warning: 'Ekip katılımı olmadan time-out yapılmış gibi işaretlenirse yanlış hasta/işlem/bölge riski artar.',
      failureMode: 'Ekibin dikkati dağınıkken veya bazı ekip üyeleri katılmadan time-out\'u tamamlanmış kabul etmek.',
      successCriteria: 'Ekip durur, roller netleşir, time-out yüksek sesle yürütülür ve kayıt altına alınır.',
      prerequisites: [],
      buttons: [
        { ev: 'team_attention', label: 'Ekip dikkatini topladım' }
      ],
      checklist: [
        { ev: 'team_attention', label: 'Ekip dikkatini topladım' },
        { ev: 'team_attention', label: 'Ekip üyeleri ad/rol ile doğrulandı' },
        { ev: 'team_attention', label: 'Dikkat dağıtıcılar durduruldu' }
      ],
      hardStop: true,
      severity: 'danger',
      clinicalEvidence: {
        source: 'WHO Surgical Safety Checklist (Time-Out); AORN Guidelines for Team Communication 2024.',
        note: 'Time-out ekibin aktif sözel katılımı sağlanmadan tamamlanmış sayılmaz; dikkat dağınıklığında önce tekrar yaptırma, sonra hard-stop.'
      },
      gcklMapping: {
        node: 'timeOutTeam', taskTag: 't_timeout',
        clinicalKey: 'time-out', gcklItem: 'Ekip üyeleri kendini tanıtır; görev ve roller netleşir.',
        scoreWeight: 5, hardStop: true
      },
      microScenario: {
        title: 'Dağınık ekipte time-out',
        scenarioText: 'Cerrah "biliyoruz, başlayalım" diyor; anestezi ekibi monitörle meşgul, scrub hemşire sayımı tamamlamaya çalışıyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrah hazırsa time-out kısa geçilebilir.',
          'Time-out durdurulur; tüm ekibin dikkati toplanır ve doğrulama ekipçe yapılır.',
          'Sirküle hemşire tek başına okuyup kayda geçebilir.',
          'Time-out kesi sonrası tamamlanabilir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Time-out sözel bariyerdir; tüm ekibin senkron dikkati olmadan yapılmış sayılmaz.',
        wrongFeedback: 'Yanlış. Time-out atlanması yanlış hasta/işlem/bölge riskini doğurur.'
      },
      aiHintPrompt: 'Bu hasta için time-out sırasında özellikle hangi noktalar vurgulanmalı? GCKL odaklı kal, KPB/CABG tekniğine girme.'
    },

    'or-team-figures': {
      node: 'teamCommunication', taskTag: 'intraop_communication_handoff',
      title: 'EKİP KATILIMI VE ROL NETLİĞİ',
      subtitle: 'Güvenli cerrahi, ekip üyelerinin aktif katılımıyla başlar.',
      chips: ['Ekip', 'Rol netliği', 'WHO SSC'],
      category: 'timeoutVerification',
      role: 'Tüm ekip. Sirküle hemşire koordinasyonu sağlar.',
      gcklItem: 'Kapali dongu iletisim ve rol netligi.',
      desc: 'Ameliyat başlamadan önce ekip üyelerinin kim olduğu, görev rolü ve kritik sorumlulukları açık olmalıdır.',
      linkedTask: 'Kapali dongu ekip iletisimini ve rol netligini dogrula.',
      warning: 'Rol belirsizliği acil durumda iletişim gecikmesine yol açar.',
      failureMode: 'Ekip üyelerinin aktif katılımı olmadan time-out\'un tamamlanması.',
      successCriteria: 'Cerrah, anestezi, scrub, sirküle ve ilgili personel time-out\'a aktif katılır.',
      prerequisites: [],
      buttons: [
        { ev: 'roles_confirmed', label: 'Ekip uyeleri ad ve rolle tanitildi' },
        { ev: 'closed_loop_confirmed', label: 'Kapali dongu iletisim dogrulandi' }
      ],
      checklist: [
        { ev: 'roles_confirmed', label: 'Cerrah ve anestezi ekibi katildi' },
        { ev: 'roles_confirmed', label: 'Scrub ve sirkule rolu netlesti' },
        { ev: 'closed_loop_confirmed', label: 'Ekip iletisimi kapali dongu ile kuruldu' }
      ],
      hardStop: false,
      severity: 'info',
      clinicalEvidence: {
        source: 'WHO Surgical Safety Checklist; AORN Team Communication 2024.',
        note: 'Rol netliği acil ekip yanıtı için ön koşuldur.'
      },
      gcklMapping: {
        node: 'teamCommunication', taskTag: 'intraop_communication_handoff',
        clinicalKey: 'or-team-figures', gcklItem: 'Kapali dongu iletisim ve rol netligi.',
        scoreWeight: 5, hardStop: false
      },
      microScenario: {
        title: 'Yeni ekip üyesi',
        scenarioText: 'Yeni bir ekip üyesi ameliyathaneye girdi ancak time-out sırasında tanıtılmadı.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Süreci aksatmamak için göz ardı edilir.',
          'Time-out akışı durdurulur, ekip üyesi ve rolü netleştirilir.',
          'Kayıt eksik olarak işaretlenir, kesi başlatılır.',
          'Postop dönemde tanıtım yapılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Rol netliği acil yanıt için kritiktir.',
        wrongFeedback: 'Yanlış. Tanıtım atlanırsa ekip iletişimi kopar.'
      },
      aiHintPrompt: 'Bu işlem için ekip katılımı odaklı 1 cümle ipucu.'
    },

    /* ====== B) HASTA / İŞLEM / BÖLGE (patientProcedureSite) ====== */

    'patient-wristband': {
      node: 'patientProcedureSite', taskTag: 't_site_procedure_verify',
      title: 'HASTA KİMLİĞİ DOĞRULAMA',
      subtitle: 'Doğru hasta doğrulaması intraop güvenlik bariyerinin temelidir.',
      chips: ['Kimlik', 'Hard-stop', 'WHO SSC'],
      category: 'timeoutVerification',
      role: 'Sirküle hemşire ve tüm ekip.',
      gcklItem: 'Doğru hasta, doğru işlem, doğru bölge sözlü olarak doğrulanır.',
      desc: 'Hasta bilekliği, dosya ve ameliyat planı time-out sırasında ekipçe doğrulanmalıdır.',
      linkedTask: 'Hasta / işlem / cerrahi bölge doğrulama.',
      warning: 'Kimlik uyuşmazlığına rağmen cerrahi başlatılırsa yanlış hasta cerrahisi riski oluşur.',
      failureMode: 'Bileklik–dosya–ameliyat listesi uyumsuzluğunu gözden kaçırmak.',
      successCriteria: 'Hasta kimliği, işlem ve dosya bilgisi uyumludur; ekipçe onaylanır.',
      prerequisites: ['timeOutTeam'],
      buttons: [
        { ev: 'identity_verbal', label: 'Hasta kimliğini sözel doğrula' }
      ],
      checklist: [
        { ev: 'identity_verbal',     label: 'Hasta kimliği doğrulandı' },
        { ev: 'procedure_verbal',    label: 'Dosya ve ameliyat listesi uyumu kontrol edildi' },
        { ev: 'site_marking_visible',label: 'Time-out sırasında sözlü doğrulama yapıldı' }
      ],
      hardStop: true,
      severity: 'danger',
      clinicalEvidence: {
        source: 'WHO SSC; Joint Commission Universal Protocol; AORN Patient Identification 2024.',
        note: 'Yanlış hasta cerrahisi sentinel olaydır; kimlik uyumsuzluğu hard-stop\'tur.'
      },
      gcklMapping: {
        node: 'patientProcedureSite', taskTag: 't_site_procedure_verify',
        clinicalKey: 'patient-wristband', gcklItem: 'Doğru hasta doğrulaması.',
        scoreWeight: 6, hardStop: true
      },
      microScenario: {
        title: 'MRN uyumsuzluğu',
        scenarioText: 'Bileklik MRN bilgisi dosya ile uyuşmuyor; cerrah "fark etmez, hasta doğru" diyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrah haklıdır, kesi başlatılır.',
          'Cerrahi başlatılmaz; kimlik uyumsuzluğu çözülene kadar süreç durdurulur.',
          'Bileklik düzeltilir, kesi devam eder.',
          'Kayıt eksik olarak işaretlenir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Kimlik uyumsuzluğu hard-stop\'tur; cerrah baskısı bunu geçersiz kılmaz.',
        wrongFeedback: 'Yanlış. Yanlış hasta cerrahisi geri dönüşsüz sentinel olaydır.'
      },
      aiHintPrompt: 'Bu hasta için kimlik doğrulama sırasında öğrenci hemşireye 1 hatırlatma.'
    },

    'consent-form': {
      node: 'patientProcedureSite', taskTag: 't_site_procedure_verify',
      title: 'İŞLEM VE ONAM DOĞRULAMA',
      subtitle: 'Planlanan işlem time-out sırasında ekipçe doğrulanmalıdır.',
      chips: ['Onam', 'İşlem', 'Hard-stop'],
      category: 'timeoutVerification',
      role: 'Sirküle hemşire, cerrah ve anestezi ekibi.',
      gcklItem: 'Doğru işlem doğrulaması.',
      desc: 'Cerrahi işlem adı, onam, dosya ve ameliyat planı tutarlı olmalıdır.',
      linkedTask: 'Hasta / işlem / cerrahi bölge doğrulama.',
      warning: 'İşlem belirsizliği giderilmeden cerrahi başlatmak güvenli cerrahi bariyer ihlalidir.',
      failureMode: 'Onam veya işlem adı belirsizken "nasıl olsa ekip biliyor" diyerek devam etmek.',
      successCriteria: 'İşlem adı, onam ve cerrahi plan uyumludur.',
      prerequisites: ['timeOutTeam'],
      buttons: [
        { ev: 'procedure_verbal', label: 'İşlemi ekiple sözel doğrula' }
      ],
      checklist: [
        { ev: 'identity_verbal',     label: 'Onam kontrol edildi' },
        { ev: 'procedure_verbal',    label: 'İşlem adı ekipçe doğrulandı' },
        { ev: 'site_marking_visible',label: 'Dosya–plan uyumu sağlandı' }
      ],
      hardStop: true,
      severity: 'danger',
      clinicalEvidence: {
        source: 'WHO SSC; Joint Commission Universal Protocol.',
        note: 'Onam ve işlem uyumsuzluğu hard-stop\'tur.'
      },
      gcklMapping: {
        node: 'patientProcedureSite', taskTag: 't_site_procedure_verify',
        clinicalKey: 'consent-form', gcklItem: 'Doğru işlem doğrulaması.',
        scoreWeight: 6, hardStop: true
      },
      microScenario: {
        title: 'Onam uyumsuzluğu',
        scenarioText: 'Onamda işlem adı eksik; ameliyat listesinde farklı ifade var.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrahi başlatılır, onam sonra düzeltilir.',
          'Cerrahi başlatılmaz; cerrah ve sorumlu ekip ile işlem doğrulanır.',
          'Hasta yakını imzalar, sürdürülür.',
          'Anestezi ekibi karar versin.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Onam uyumsuzluğu çözülmeden kesiye geçilmez.',
        wrongFeedback: 'Yanlış. Eksik onam etik ve hukuki ihlaldir.'
      },
      aiHintPrompt: 'Bu işlemin onam metniyle uyumu için 1 önemli kontrol noktası.'
    },

    'site-marking': {
      node: 'patientProcedureSite', taskTag: 't_site_procedure_verify',
      title: 'CERRAHİ BÖLGE VE TARAF DOĞRULAMA',
      subtitle: 'Cerrahi alan doğrulanmadan kesi güvenli değildir.',
      chips: ['Taraf', 'Bölge', 'Hard-stop'],
      category: 'timeoutVerification',
      role: 'Cerrah, sirküle hemşire ve tüm ekip.',
      gcklItem: 'Doğru bölge/taraf doğrulaması.',
      desc: 'Cerrahi bölge, taraf ve işlem time-out sırasında görünür veya doğrulanabilir olmalıdır.',
      linkedTask: 'Hasta / işlem / cerrahi bölge doğrulama.',
      warning: 'Bölge/taraf belirsizken cerrahi başlatmak yanlış taraf/yanlış işlem riskidir.',
      failureMode: 'İşaret steril örtü altında kaldığı halde doğrulama tamamlanmış saymak.',
      successCriteria: 'Cerrahi alan/taraf ekipçe doğrulanır ve belirsizlik yoktur.',
      prerequisites: ['timeOutTeam'],
      buttons: [
        { ev: 'site_marking_visible', label: 'Taraf/bölge işaretini görsel doğrula' }
      ],
      checklist: [
        { ev: 'identity_verbal',      label: 'Cerrahi bölge doğrulandı' },
        { ev: 'procedure_verbal',     label: 'Taraf/alan işareti kontrol edildi' },
        { ev: 'site_marking_visible', label: 'Belirsizlik varsa süreç durduruldu' }
      ],
      hardStop: true,
      severity: 'danger',
      clinicalEvidence: {
        source: 'WHO SSC; Joint Commission Universal Protocol Step 2 (Site Marking).',
        note: 'Taraf/bölge belirsizliği yanlış taraf cerrahisi için en yaygın sebeptir.'
      },
      gcklMapping: {
        node: 'patientProcedureSite', taskTag: 't_site_procedure_verify',
        clinicalKey: 'site-marking', gcklItem: 'Doğru bölge/taraf doğrulaması.',
        scoreWeight: 6, hardStop: true
      },
      microScenario: {
        title: 'Örtü altında kalan işaret',
        scenarioText: 'Taraf işareti örtü altında kalmış ve ekip doğrulayamadı; cerrah hatırladığını söylüyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrahın hafızası yeterlidir, kesiye geçilir.',
          'Cerrahi başlatılmaz; örtü kaldırılır veya cerrahi plan ekipçe yeniden doğrulanır.',
          'Tahminen başlatılır.',
          'İşaret postop kontrol edilir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Görsel doğrulama yapılmadan kesi başlatılmaz.',
        wrongFeedback: 'Yanlış. Hafızaya güvenmek yanlış taraf cerrahisi için bilinen risk faktörüdür.'
      },
      aiHintPrompt: 'Bu hasta için bölge/taraf doğrulama önerisi.'
    },

    /* ====== C) GÖRÜNTÜLEME / KRİTİK SONUÇ (imagingAndResults) ====== */

    'imaging-monitor': {
      node: 'imagingAndResults', taskTag: 't_imaging_intraop',
      title: 'GÖRÜNTÜLEME GÖRÜNÜRLÜĞÜ',
      subtitle: 'Gerekli görüntüleme ekipçe erişilebilir olmalıdır.',
      chips: ['Görüntüleme', 'PACS'],
      category: 'imagingAndResults',
      role: 'Cerrah, sirküle hemşire ve anestezi ekibi.',
      gcklItem: 'Gerekli görüntüleme ve kritik sonuçlar hazır mı?',
      desc: 'Gerekli görüntüleme cerrahi ekip tarafından görülebilir ve doğrulanabilir olmalıdır.',
      linkedTask: 'Görüntüleme ve kritik sonuçların görünürlüğü.',
      warning: 'Kritik görüntüleme olmadan cerrahi plan belirsiz kalabilir.',
      failureMode: '"Cerrah daha önce gördü" diyerek görüntüleme erişimini önemsememek.',
      successCriteria: 'Görüntüleme erişilebilir, doğru hastaya ait ve ekipçe kontrol edilmiştir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'imaging_displayed', label: 'Görüntülemeyi ekrana al / doğrula' }
      ],
      checklist: [
        { ev: 'imaging_displayed', label: 'Görüntüleme açıldı' },
        { ev: 'imaging_displayed', label: 'Hasta ile görüntüleme eşleşmesi doğrulandı' },
        { ev: 'imaging_displayed', label: 'Cerrahi ekip erişimi onayladı' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'WHO SSC (Time-Out: imaging if applicable); AORN Imaging in OR 2024.',
        note: 'Görüntülemenin doğru hastaya ait olduğu doğrulanmalı.'
      },
      gcklMapping: {
        node: 'imagingAndResults', taskTag: 't_imaging_intraop',
        clinicalKey: 'imaging-monitor', gcklItem: 'Görüntüleme görünürlüğü.',
        scoreWeight: 4, hardStop: false
      },
      microScenario: {
        title: 'PACS erişim sorunu',
        scenarioText: 'PACS açılmıyor ve görüntüleme erişilemiyor; cerrah "ezbere biliyorum" diyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrahın belleği yeterlidir, başlatılır.',
          'Erişim sağlanır; doğru hasta/görüntüleme doğrulanmadan kesi başlatılmaz.',
          'Telefondan eski görüntü gösterilir.',
          'Postop dönemde görüntüleme istenir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Görsel doğrulama olmadan plan eksiktir.',
        wrongFeedback: 'Yanlış. Bellek doğrulama yerine geçmez.'
      },
      aiHintPrompt: 'Bu hasta için intraop görüntüleme erişimi önerisi.'
    },

    'lab-panel': {
      node: 'imagingAndResults', taskTag: 't_imaging_intraop',
      title: 'KRİTİK SONUÇ GÖRÜNÜRLÜĞÜ',
      subtitle: 'Kritik laboratuvar ve klinik sonuçlar ekipçe bilinmelidir.',
      chips: ['Lab', 'Kritik sonuç', 'Hb/Koag'],
      category: 'imagingAndResults',
      role: 'Sirküle hemşire, anestezi ekibi, cerrah.',
      gcklItem: 'Kritik sonuçlar hazır mı?',
      desc: 'Hb, koagülasyon, kan grubu ve hasta riskleri gibi kritik sonuçlar cerrahi başlamadan görünür olmalıdır.',
      linkedTask: 'Görüntüleme ve kritik sonuçların görünürlüğü.',
      warning: 'Kritik sonuç yokken yüksek riskli cerrahiye başlamak planlama hatasına yol açar.',
      failureMode: '"Preopta bakılmıştır" varsayımıyla intraop doğrulamayı atlamak.',
      successCriteria: 'Sonuçlar erişilebilir, güncel ve doğru hastaya aittir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'imaging_displayed', label: 'Kritik laboratuvar sonuçlarını ekiplе gözden geçir' }
      ],
      checklist: [
        { ev: 'imaging_displayed', label: 'Kritik sonuçlar açıldı' },
        { ev: 'imaging_displayed', label: 'Hasta eşleşmesi doğrulandı' },
        { ev: 'imaging_displayed', label: 'Ekip sonucu gördü' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'WHO SSC (Sign-In: critical concerns); AORN Imaging/Results 2024.',
        note: 'Hb, INR/aPTT, kan grubu cerrahi başlamadan ekipçe görülmeli.'
      },
      gcklMapping: {
        node: 'imagingAndResults', taskTag: 't_imaging_intraop',
        clinicalKey: 'lab-panel', gcklItem: 'Kritik sonuç görünürlüğü.',
        scoreWeight: 4, hardStop: false
      },
      microScenario: {
        title: 'Eksik lab sonucu',
        scenarioText: 'Hb ve koagülasyon sonucu görünmüyor; cerrah "geçen hafta normaldi" diyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Geçen haftaki değer yeterli.',
          'Güncel sonuçlar erişilebilir hale getirilir; ekipçe değerlendirilir.',
          'Cerrahi başlatılır, sonuç gelince güncellenir.',
          'Postop dönemde takip yeterli.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Güncel kritik sonuç olmadan plan eksiktir.',
        wrongFeedback: 'Yanlış. Eski sonuca güvenmek karar hatası riskidir.'
      },
      aiHintPrompt: 'Bu hasta için kritik lab sonucu önceliği.'
    },

    /* ====== D) ANTİBİYOTİK / ALERJİ (antibioticProphylaxis) ====== */

    'antibiotic-syringe': {
      node: 'antibioticProphylaxis', taskTag: 't_antibiotic',
      title: 'ANTİBİYOTİK PROFİLAKSİSİ',
      subtitle: 'Profilaksi zamanı ve alerji uyumu doğrulanmalıdır.',
      chips: ['Antibiyotik', 'WHO SSC', 'Hard-stop (cond.)'],
      category: 'antibioticProphylaxis',
      role: 'Anestezi ekibi ve sirküle hemşire.',
      gcklItem: 'Antibiyotik profilaksisi son 60 dakika içinde verildi mi?',
      desc: 'Antibiyotik adı, zamanlaması ve alerji uyumu time-out sırasında net olmalıdır.',
      linkedTask: 'Antibiyotik profilaksisini doğrula.',
      warning: 'Antibiyotik zamanı veya alerji uyumu belirsizken cerrahi başlatmak enfeksiyon ve ilaç reaksiyonu riskini artırır.',
      failureMode: '"Rutin verilir" varsayımıyla zaman ve alerji kontrolünü atlamak.',
      successCriteria: 'İlaç, zaman, doz ve alerji uyumu doğrulanır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'antibiotic_time_verified', label: 'Profilaksi zamanını sor / doğrula' }
      ],
      checklist: [
        { ev: 'antibiotic_time_verified', label: 'Antibiyotik zamanı doğrulandı' },
        { ev: 'allergy_cross_checked',    label: 'Alerji uyumu kontrol edildi' },
        { ev: 'antibiotic_time_verified', label: 'Kayıt doğrulandı' }
      ],
      hardStop: 'conditional',
      severity: 'warning',
      clinicalEvidence: {
        source: 'WHO SSC (Time-Out: antibiotic prophylaxis ≤60 min); CDC SSI Prevention 2017.',
        note: 'Kritik alerji belirsizliği hard-stop\'a yükseltilir.'
      },
      gcklMapping: {
        node: 'antibioticProphylaxis', taskTag: 't_antibiotic',
        clinicalKey: 'antibiotic-syringe', gcklItem: 'Antibiyotik profilaksi zamanı.',
        scoreWeight: 5, hardStop: 'conditional'
      },
      microScenario: {
        title: 'Belirsiz profilaksi kaydı',
        scenarioText: 'Antibiyotik verildiği söyleniyor ancak kayıt ve zaman belirsiz.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Verildiği söylendiği için yeterli.',
          'Kayıt ve anestezi bilgisi kontrol edilir; belirsizlik giderilmeden time-out tamamlanmış sayılmaz.',
          'Yedek doz hızla verilir.',
          'Kesi sonrası verilir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Zaman ve kayıt doğrulanmadan profilaksi tamamlanmış sayılmaz.',
        wrongFeedback: 'Yanlış. Belirsiz zaman SSI riskini artırır.'
      },
      aiHintPrompt: 'Bu hasta için antibiyotik profilaksi zamanlaması önerisi.'
    },

    'allergy-band': {
      node: 'antibioticProphylaxis', taskTag: 't_antibiotic',
      title: 'ALERJİ VE ANTİBİYOTİK UYUMU',
      subtitle: 'Alerji bilgisi profilaksi kararının parçasıdır.',
      chips: ['Alerji', 'Hard-stop'],
      category: 'antibioticProphylaxis',
      role: 'Anestezi ekibi, sirküle hemşire.',
      gcklItem: 'Bilinen alerji var mı? Profilaksi uyumlu mu?',
      desc: 'İlaç alerjisi, profilaksi ve anestezi güvenliği için time-out sırasında görünür olmalıdır.',
      linkedTask: 'Antibiyotik ve alerji doğrulaması.',
      warning: 'Kayıtlı alerjiye rağmen uyumsuz antibiyotik uygulanması ciddi reaksiyona yol açabilir.',
      failureMode: 'Alerji bilekliği/dosya uyumsuzluğunu sorgulamamak.',
      successCriteria: 'Alerji, ilaç ve order uyumu doğrulanır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'allergy_cross_checked', label: 'Alerji çapraz kontrolünü yap' }
      ],
      checklist: [
        { ev: 'allergy_cross_checked',    label: 'Alerji bilgisi doğrulandı' },
        { ev: 'antibiotic_time_verified', label: 'Antibiyotik uyumu kontrol edildi' },
        { ev: 'allergy_cross_checked',    label: 'Belirsizlik ekibe bildirildi' }
      ],
      hardStop: 'conditional',
      severity: 'danger',
      clinicalEvidence: {
        source: 'WHO SSC; AORN Medication Safety 2024.',
        note: 'Penisilin/sefalosporin çapraz alerji ciddidir; belirsizlik hard-stop.'
      },
      gcklMapping: {
        node: 'antibioticProphylaxis', taskTag: 't_antibiotic',
        clinicalKey: 'allergy-band', gcklItem: 'Alerji çapraz kontrolü.',
        scoreWeight: 5, hardStop: 'conditional'
      },
      microScenario: {
        title: 'Penisilin alerjili hasta',
        scenarioText: 'Hasta penisilin alerjili; profilaksi orderı belirsiz.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Sefalosporin verilir, alerji blanker.',
          'İlaç uygulanmadan alerji ve order uyumu anestezi/cerrahi ekiple netleştirilir.',
          'Antihistaminik hazırlanır, doz verilir.',
          'Antibiyotik atlanır, profilaksi yapılmaz.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Alerji belirsizliğinde profilaksi durdurulur ve netleştirilir.',
        wrongFeedback: 'Yanlış. Çapraz alerji riski varken körlemesine ilaç uygulanmaz.'
      },
      aiHintPrompt: 'Bu hastanın alerjisi için profilaksi alternatifi önerisi.'
    },

    /* ====== E) ANESTEZİ GÜVENLİĞİ (anesthesiaSafety) ====== */

    'anesthesia-machine': {
      node: 'anesthesiaSafety', taskTag: 't_anesthesia_assist',
      title: 'ANESTEZİ GÜVENLİK KONTROLÜ',
      subtitle: 'Airway, ventilasyon ve monitörizasyon güvenli olmalıdır.',
      chips: ['Anestezi', 'Sign-in', 'WHO SSC'],
      category: 'anesthesiaSafety',
      role: 'Anestezi ekibi; sirküle hemşire ekip iletişimini destekler.',
      gcklItem: 'Anestezi güvenlik kontrolü tamamlandı mı?',
      desc: 'Anestezi cihazı, airway planı ve monitörizasyon cerrahi başlamadan kontrol edilmelidir.',
      linkedTask: 'Anestezi güvenliğine yardım et.',
      warning: 'Güvenilir izlem ve airway planı olmadan cerrahi başlamak intraop riskleri artırır.',
      failureMode: 'Anestezi hazırlığı tamamlanmadan kesi sürecine geçmek.',
      successCriteria: 'Airway, ventilasyon, monitör ve alarm güvenliği doğrulanır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'airway_secured', label: 'Havayolu güvenliğini doğrula' }
      ],
      checklist: [
        { ev: 'airway_secured',        label: 'Airway planı doğrulandı' },
        { ev: 'spo2_reliable',         label: 'Anestezi cihazı hazır' },
        { ev: 'critical_risks_shared', label: 'Monitör/alarm kontrol edildi' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'WHO SSC (Sign-In); ASA Standards for Basic Anesthetic Monitoring.',
        note: 'Cihaz, monitör, airway planı sign-in\'in temel adımlarıdır.'
      },
      gcklMapping: {
        node: 'anesthesiaSafety', taskTag: 't_anesthesia_assist',
        clinicalKey: 'anesthesia-machine', gcklItem: 'Anestezi güvenlik kontrolü.',
        scoreWeight: 10, hardStop: false
      },
      microScenario: {
        title: 'Alarm limitleri ayarlanmamış',
        scenarioText: 'Anestezi ekibi monitör alarm limitlerini ayarlamamış; cerrah hızlanmak istiyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Hız önemli, alarm sonra ayarlanır.',
          'Alarm ve izlem güvenilir hale getirilmeden cerrahi başlatılmaz.',
          'Default değerler yeterli.',
          'Sirküle hemşire alarm ayarlar.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Güvenilir izlem olmadan kesiye geçilmez.',
        wrongFeedback: 'Yanlış. Default alarm hasta-spesifik değildir.'
      },
      aiHintPrompt: 'Bu hasta için anestezi izlem önceliği.'
    },

    'pulse-oximeter': {
      node: 'anesthesiaSafety', taskTag: 't_anesthesia_assist',
      title: 'SpO₂ VE MONİTÖR GÜVENİLİRLİĞİ',
      subtitle: 'Sadece sayısal değer değil, dalga formu da güvenilir olmalıdır.',
      chips: ['SpO₂', 'Dalga formu', 'İzlem'],
      category: 'anesthesiaSafety',
      role: 'Anestezi ekibi; sirküle hemşire güvenlik kontrolünü izler.',
      gcklItem: 'Pulse oksimetre ve izlem hazır mı?',
      desc: 'Monitör verisi klinikle uyumlu ve dalga formu güvenilir olmalıdır.',
      linkedTask: 'Anestezi izlem güvenliğini doğrula.',
      warning: 'Güvenilmez SpO₂ veya monitör verisiyle cerrahiye başlamak hipoksi/hemodinami sorunlarını geciktirir.',
      failureMode: 'Sayısal değer görünüyor diye dalga formunu değerlendirmemek.',
      successCriteria: 'Sensör, dalga formu, alarm ve klinik uyum doğrulanır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'spo2_reliable', label: 'SpO₂ dalga formu güvenilirliğini kontrol et' }
      ],
      checklist: [
        { ev: 'spo2_reliable',         label: 'SpO₂ dalga formu güvenilir' },
        { ev: 'critical_risks_shared', label: 'Monitör alarmı aktif' },
        { ev: 'airway_secured',        label: 'Klinik uyum değerlendirildi' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'WHO SSC; ASA Standards for Basic Anesthetic Monitoring.',
        note: 'Dalga formu güvenilirliği SpO₂ sayısının doğruluğunun ön koşuludur.'
      },
      gcklMapping: {
        node: 'anesthesiaSafety', taskTag: 't_anesthesia_assist',
        clinicalKey: 'pulse-oximeter', gcklItem: 'SpO₂ güvenilirliği.',
        scoreWeight: 10, hardStop: false
      },
      microScenario: {
        title: 'Sayı normal, dalga formu zayıf',
        scenarioText: 'SpO₂ 98 görünüyor ama dalga formu zayıf, perfüzyon belirsiz.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Sayı normal olduğu için yeterli.',
          'Sensör/perfüzyon/dalga formu doğrulanır; güvenilir izlem sağlanır.',
          'Alarm sustur, cerrahi devam.',
          'Postop dönemde yeniden bakılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Güvenilmez dalga formu sayıyı geçersiz kılar.',
        wrongFeedback: 'Yanlış. Hipoksi sayıdan önce dalga formunda fark edilir.'
      },
      aiHintPrompt: 'Bu hasta için SpO₂ izleminde dikkat noktası.'
    },

    'airway-cart': {
      node: 'anesthesiaSafety', taskTag: 't_anesthesia_assist',
      title: 'AIRWAY VE KRİTİK İZLEM HAZIRLIĞI',
      subtitle: 'Airway riski ve kritik izlem ekipçe paylaşılmalıdır.',
      chips: ['Airway', 'A-line', 'Risk paylaşımı'],
      category: 'anesthesiaSafety',
      role: 'Anestezi ekibi; sirküle hemşire gerekli ekipmanı erişilebilir tutar.',
      gcklItem: 'Anestezi güvenlik kontrolü.',
      desc: 'Zor airway, invaziv izlem veya özel anestezi riski time-out sırasında ekipçe bilinmelidir.',
      linkedTask: 'Anestezi güvenlik hazırlığını doğrula.',
      warning: 'Kritik airway/izlem riski paylaşılmazsa acil durumda ekip hazırlıksız kalır.',
      failureMode: 'Airway riskini yalnız anestezi notunda bırakmak, ekipçe paylaşmamak.',
      successCriteria: 'Airway planı, yedek ekipman ve kritik izlem durumu ekipçe bilinir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'critical_risks_shared', label: 'Anestezi kritik risklerini ekiple paylaş' }
      ],
      checklist: [
        { ev: 'airway_secured',        label: 'Airway planı biliniyor' },
        { ev: 'spo2_reliable',         label: 'Yedek ekipman hazır' },
        { ev: 'critical_risks_shared', label: 'Kritik izlem durumu paylaşıldı' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'ASA Difficult Airway Algorithm; AORN Anesthesia Care 2024.',
        note: 'Zor airway öyküsü time-out\'ta sözel paylaşım gerektirir.'
      },
      gcklMapping: {
        node: 'anesthesiaSafety', taskTag: 't_anesthesia_assist',
        clinicalKey: 'airway-cart', gcklItem: 'Airway hazırlığı ve risk paylaşımı.',
        scoreWeight: 10, hardStop: false
      },
      microScenario: {
        title: 'Paylaşılmamış airway riski',
        scenarioText: 'Airway zorluğu bekleniyor ancak ekip bilgilendirilmemiş; anestezi "biz hallederiz" diyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Anestezi tek başına yönetir.',
          'Risk time-out sırasında ekipçe paylaşılır ve ekipman hazır edilir.',
          'Postop dönemde paylaşılır.',
          'Sadece sirküle bilir yeterli.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Kritik risk ekipçe paylaşılmadan başlatılmaz.',
        wrongFeedback: 'Yanlış. Eksik ekip iletişimi krizi yönetilemez hale getirir.'
      },
      aiHintPrompt: 'Bu hasta için airway risk paylaşımı önerisi.'
    },

    /* ====== F) KAN KAYBI (bloodLossRisk) ====== */

    'blood-bags': {
      node: 'bloodLossRisk', taskTag: 't_fluid_blood',
      title: 'KAN HAZIRLIĞI VE KAN KAYBI RİSKİ',
      subtitle: 'Beklenen kan kaybı ekipçe konuşulmalıdır.',
      chips: ['Kan kaybı', 'Crossmatch'],
      category: 'bloodLossRisk',
      role: 'Anestezi ekibi, cerrah, sirküle hemşire.',
      gcklItem: 'Beklenen kan kaybı nedir? Kan hazırlığı var mı?',
      desc: 'Kan kaybı riski, kan/kan ürünü hazırlığı ve ekip planı cerrahi başlamadan netleşmelidir.',
      linkedTask: 'Sıvı, kan ve kan kaybı hazırlığını doğrula.',
      warning: 'Yüksek kan kaybı riski varken hazırlığın belirsiz kalması gecikmiş müdahaleye yol açar.',
      failureMode: '"Kan gerekirse intraopta istenir" varsayımıyla hazırlığı sorgulamamak.',
      successCriteria: 'Beklenen kan kaybı, kan hazırlığı ve ekip planı paylaşılır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'expected_loss_announced',     label: 'Beklenen kan kaybını ekiple konuş' }
      ],
      checklist: [
        { ev: 'expected_loss_announced',      label: 'Kan kaybı riski konuşuldu' },
        { ev: 'blood_availability_confirmed', label: 'Kan/kan ürünü hazırlığı doğrulandı' },
        { ev: 'expected_loss_announced',      label: 'Ekip planı netleşti' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'WHO SSC (Sign-In: blood loss); AORN Hemostasis 2024.',
        note: '>500 mL erişkin / >7 mL/kg pediatrik kayıp beklenen durumda kan ürünü hazır olmalı.'
      },
      gcklMapping: {
        node: 'bloodLossRisk', taskTag: 't_fluid_blood',
        clinicalKey: 'blood-bags', gcklItem: 'Kan hazırlığı.',
        scoreWeight: 10, hardStop: false
      },
      microScenario: {
        title: 'Belirsiz crossmatch',
        scenarioText: 'Kan kaybı riski yüksek ama crossmatch/kan hazırlığı belirsiz.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrahi başlatılır, kan gelir.',
          'Kan hazırlığı ve ekip planı netleşmeden cerrahi başlatılmaz.',
          'Sadece IV sıvı yeterli.',
          'Postop dönemde transfüzyon yapılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Kan kaybı krizinde gecikme geri dönüşsüzdür.',
        wrongFeedback: 'Yanlış. Hazır olmayan kan kritik dakikalarda elde değildir.'
      },
      aiHintPrompt: 'Bu hasta için kan hazırlığı önerisi.'
    },

    'rapid-infuser': {
      node: 'bloodLossRisk', taskTag: 't_fluid_blood',
      title: 'KAN KAYBI PLANI',
      subtitle: 'Kan kaybı riski sadece anestezinin değil, tüm ekibin bilgisidir.',
      chips: ['Hızlı infüzör', 'Plan'],
      category: 'bloodLossRisk',
      role: 'Anestezi ekibi, cerrah, sirküle hemşire.',
      gcklItem: 'Beklenen kan kaybı ve hazırlık.',
      desc: 'Yüksek kan kaybı olasılığı varsa damar yolu, kan ürünü, ısıtma ve ekip iletişimi planlanmalıdır.',
      linkedTask: 'Kan kaybı ve sıvı yönetimi hazırlığını doğrula.',
      warning: 'Kan kaybı beklenmesine rağmen ekip planının konuşulmaması.',
      failureMode: 'Kan kaybı yönetimini sadece olay olunca ele almak.',
      successCriteria: 'Kan kaybı riski, hazırlık ve görev paylaşımı nettir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'expected_loss_announced', label: 'Beklenen kan kaybını ekiple konuş' }
      ],
      checklist: [
        { ev: 'expected_loss_announced',      label: 'Beklenen kan kaybı paylaşıldı' },
        { ev: 'blood_availability_confirmed', label: 'Hazırlık seviyesi doğrulandı' },
        { ev: 'expected_loss_announced',      label: 'Acil plan konuşuldu' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Hemostasis 2024; ASA Practice Guidelines for Perioperative Blood Management.',
        note: 'Hızlı infüzör erişimi ekip iletişimi içinde olmalı.'
      },
      gcklMapping: {
        node: 'bloodLossRisk', taskTag: 't_fluid_blood',
        clinicalKey: 'rapid-infuser', gcklItem: 'Hızlı infüzör hazırlığı.',
        scoreWeight: 10, hardStop: false
      },
      microScenario: {
        title: 'Konuşulmamış kan kaybı planı',
        scenarioText: 'Cerrah yüksek kan kaybı bekliyor ama ekip planı konuşulmadı.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrah tek başına yönetir.',
          'Kan kaybı planı time-out kapsamında ekipçe netleştirilir.',
          'Sadece anestezi bilir yeterli.',
          'Plan duruma göre yapılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Plan paylaşımı krizi öngörülebilir kılar.',
        wrongFeedback: 'Yanlış. Eksik plan gecikmiş yanıt demektir.'
      },
      aiHintPrompt: 'Bu hasta için kan kaybı plan paylaşımı önerisi.'
    },

    'cell-saver': {
      node: 'bloodLossRisk', taskTag: 't_fluid_blood',
      title: 'CELL SAVER / KAN KORUMA HAZIRLIĞI',
      subtitle: 'Kan kaybı riski yüksekse kan koruma seçenekleri ekipçe bilinmelidir.',
      chips: ['Cell saver', 'Kan koruma'],
      category: 'bloodLossRisk',
      role: 'Anestezi ekibi, sirküle hemşire, ilgili teknik ekip.',
      gcklItem: 'Beklenen kan kaybı ve hazırlık.',
      desc: 'Cell saver burada teknik bypass eğitimi için değil, kan kaybı hazırlığına örnek olarak kullanılır.',
      linkedTask: 'Kan kaybı hazırlığını doğrula.',
      warning: 'Kan kaybı riski yüksekken mevcut kan koruma hazırlığını ekiple paylaşmamak.',
      failureMode: 'Cihaz sahnede var ama hazırlık/bağlantı durumu ekipçe doğrulanmamış.',
      successCriteria: 'Kan kaybı riski ve ilgili hazırlık ekipçe konuşulmuştur.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'blood_availability_confirmed', label: 'Kan koruma hazırlığını doğrula' }
      ],
      checklist: [
        { ev: 'blood_availability_confirmed', label: 'Kan koruma hazırlığı konuşuldu' },
        { ev: 'expected_loss_announced',      label: 'Ekip rolü netleşti' },
        { ev: 'blood_availability_confirmed', label: 'Gerekli bağlantılar doğrulandı' }
      ],
      hardStop: false,
      severity: 'info',
      clinicalEvidence: {
        source: 'STS/SCA/AmSECT Blood Conservation 2021.',
        note: 'Cell saver yüksek kan kaybı beklenen vakalarda kan ürünü ihtiyacını azaltır.'
      },
      gcklMapping: {
        node: 'bloodLossRisk', taskTag: 't_fluid_blood',
        clinicalKey: 'cell-saver', gcklItem: 'Kan koruma hazırlığı.',
        scoreWeight: 10, hardStop: false
      },
      microScenario: {
        title: 'Hazırlık durumu belirsiz',
        scenarioText: 'Cell saver cihazı sahnede var ama kimse hazır olup olmadığını bilmiyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cihaz oradaysa hazır demektir.',
          'Hazırlık durumu ve kullanım planı ekipçe doğrulanır.',
          'Gerektiğinde teknisyen çağrılır.',
          'Plan postop yapılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Cihaz varlığı hazır olmak değildir.',
        wrongFeedback: 'Yanlış. Kritik anda bağlantı eksiği bulunursa cihaz işe yaramaz.'
      },
      aiHintPrompt: 'Bu hasta için cell saver kullanım önerisi (KPB tekniğine girme).'
    },

    'cpb-machine': {
      node: 'cabgCpbSafety', taskTag: 'intraop_cabg_cpb_safety',
      title: 'CABG / CPB HAZIRLIK GUVENLIGI',
      subtitle: 'CABG aktifse perfuzyon ve KPB hazirligi ekipce dogrulanir.',
      chips: ['CABG', 'CPB', 'Perfuzyon'],
      category: 'cabgCpbSafety',
      role: 'Cerrah, anestezi, perfuzyonist ve sirkule hemsire.',
      gcklItem: 'CABG olgusunda kardiyopulmoner bypass hazirligi.',
      desc: 'CPB makinesi, perfuzyon ekibi ve heparin/ACT plani paylasilmadan CABG guvenli kabul edilmez.',
      linkedTask: 'CABG/CPB hazirligini dogrula.',
      warning: 'KPB hazirligi ekipce dogrulanmadan CABG akisina gecmek gecikme ve kritik guvenlik riski olusturur.',
      failureMode: 'CPB cihazinin sahnede olmasini hazirlik dogrulamasi sanmak.',
      successCriteria: 'CPB makinesi hazir, perfuzyon ekibi hazir ve heparin/ACT plani ekipce paylasilmistir.',
      prerequisites: ['patientProcedureSite', 'timeOutTeam'],
      buttons: [
        { ev: 'cpb_machine_ready', label: 'CPB makinesi hazirligini dogrula' },
        { ev: 'perfusion_team_ready', label: 'Perfuzyon ekibi hazirligini dogrula' },
        { ev: 'heparin_act_plan_shared', label: 'Heparin / ACT planini ekipce paylas' }
      ],
      checklist: [
        { ev: 'cpb_machine_ready', label: 'CPB makinesi ve hatlar hazir' },
        { ev: 'perfusion_team_ready', label: 'Perfuzyonist ve ekip rol paylasimi tamam' },
        { ev: 'heparin_act_plan_shared', label: 'Heparin / ACT plani paylasildi' }
      ],
      hardStop: false,
      severity: 'danger',
      clinicalEvidence: {
        source: 'WHO SSC cardiac adaptation; CABG team readiness practice.',
        note: 'CABG icin perfuzyon ve antikoagulasyon plani ekip time-out akisi ile birlikte netlestirilir.'
      },
      gcklMapping: {
        node: 'cabgCpbSafety', taskTag: 'intraop_cabg_cpb_safety',
        clinicalKey: 'cpb-machine', gcklItem: 'CABG/CPB hazirligi.',
        scoreWeight: 5, hardStop: false
      },
      microScenario: {
        title: 'CPB hazirligi belirsiz',
        scenarioText: 'CABG olgusunda CPB cihazı sahnede ama heparin/ACT plani sesli paylasilmadi.',
        questionText: 'Ne yapilmali?',
        options: [
          'Cihaz varsa hazir kabul edilir.',
          'Cerrah, anestezi ve perfuzyonist CPB ve heparin/ACT planini ekipce dogrular.',
          'Plan sadece perfuzyonist tarafindan bilinse yeterlidir.',
          'Postop kayda eklenir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Dogru. CABG guvenligi ekip paylasimli hazirlik gerektirir.',
        wrongFeedback: 'Yanlis. CPB varligi, ekipce dogrulanmis hazirlik anlamina gelmez.'
      },
      aiHintPrompt: 'Bu CABG vakasi icin CPB hazirligi odakli 1 cumle ipucu.'
    },

    /* ====== G) CİHAZ / YANGIN / DUMAN (equipmentAndFireSafety) ====== */

    'esu-unit': {
      node: 'equipmentAndFireSafety', taskTag: 't_equipment',
      title: 'ESU / KOTER GÜVENLİĞİ',
      subtitle: 'Koter kullanımı yangın ve hasta yanığı riskiyle birlikte değerlendirilir.',
      chips: ['ESU', 'Yangın üçgeni', 'Hard-stop (cond.)'],
      category: 'equipmentAndFireSafety',
      role: 'Sirküle hemşire, scrub hemşiresi, cerrah.',
      gcklItem: 'Cihaz güvenliği ve yangın riski.',
      desc: 'ESU cihazı, hasta plakası, güç ayarı ve yangın üçgeni kontrol edilmeden güvenli kabul edilmez.',
      linkedTask: 'Cihaz ve ESU güvenliğini doğrula.',
      warning: 'Antiseptik kurumadan veya oksijen birikimi varken ESU kullanmak yangın riskidir.',
      failureMode: 'ESU\'yu düşük güçte kullanarak güvenli sanmak.',
      successCriteria: 'ESU plakası, kuruluk, oksijen ve duman tahliye hazırdır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'esu_pad_position',      label: 'ESU nötral elektrot pozisyonunu doğrula' }
      ],
      checklist: [
        { ev: 'esu_pad_position',      label: 'ESU plakası doğrulandı' },
        { ev: 'antiseptic_dry',        label: 'Cihaz ayarı kontrol edildi' },
        { ev: 'fire_triangle_assessed',label: 'Yangın riski değerlendirildi' }
      ],
      hardStop: 'conditional',
      severity: 'danger',
      clinicalEvidence: {
        source: 'AORN Electrosurgical Safety 2024; ECRI Surgical Fires Top-10 Hazard; APSF Fire Prevention.',
        note: 'Yangın riski oluşmuşsa hard-stop\'a yükseltilir.'
      },
      gcklMapping: {
        node: 'equipmentAndFireSafety', taskTag: 't_equipment',
        clinicalKey: 'esu-unit', gcklItem: 'ESU güvenliği.',
        scoreWeight: 8, hardStop: 'conditional'
      },
      microScenario: {
        title: 'Islak antiseptik üzerinde koter',
        scenarioText: 'Antiseptik kurumadan koter isteniyor; cerrah aceleci.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Düşük güçte koter güvenli.',
          'Koter kullanımı durdurulur; kuruma ve güvenlik sağlanır.',
          'Bez ile silinir, koter başlatılır.',
          'O₂ kapatılır, koter güvenli.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Yangın üçgeni (O₂+yakıt+ateş) kurulduğunda yangın saniyeler içinde oluşur.',
        wrongFeedback: 'Yanlış. Düşük güç yangını engellemez.'
      },
      aiHintPrompt: 'Bu hasta için ESU yangın riski önerisi.'
    },

    'esu-pad': {
      node: 'equipmentAndFireSafety', taskTag: 't_equipment',
      title: 'ESU HASTA PLAKASI KONTROLÜ',
      subtitle: 'Yanık riskini önlemek için dönüş elektrodu güvenli yerleştirilmelidir.',
      chips: ['Plaka', 'Yanık', 'Temas'],
      category: 'equipmentAndFireSafety',
      role: 'Sirküle hemşire.',
      gcklItem: 'Cihaz güvenliği.',
      desc: 'Hasta plakası uygun alana, kuru ve tam temas edecek şekilde yerleştirilmelidir.',
      linkedTask: 'ESU hasta plakası güvenliğini doğrula.',
      warning: 'Plaka temasının yetersiz olması yanık riski oluşturur.',
      failureMode: 'Plaka yerleşimini kayıt varsayımıyla kontrol etmemek.',
      successCriteria: 'Plaka yeri, temas ve kablo bağlantısı doğrulanır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'esu_pad_position', label: 'ESU plaka pozisyonunu doğrula' }
      ],
      checklist: [
        { ev: 'esu_pad_position',      label: 'Plaka pozisyonu kontrol edildi' },
        { ev: 'esu_pad_position',      label: 'Temas güvenli' },
        { ev: 'fire_triangle_assessed',label: 'Kablo bağlantısı doğrulandı' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Electrosurgical Safety 2024.',
        note: 'REM/Patient Return Electrode LED durumu cihaz tarafından izlenir.'
      },
      gcklMapping: {
        node: 'equipmentAndFireSafety', taskTag: 't_equipment',
        clinicalKey: 'esu-pad', gcklItem: 'ESU plaka güvenliği.',
        scoreWeight: 8, hardStop: false
      },
      microScenario: {
        title: 'Şüpheli plaka teması',
        scenarioText: 'Plaka kablosu gergin ve temas alanı şüpheli.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Kayıt tam, sürdürülür.',
          'Koter kullanılmadan plaka yerleşimi düzeltilir.',
          'Daha düşük güçte kullanılır.',
          'Plaka çıkarılır, bipolar kullanılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Şüpheli temas yanık riskidir.',
        wrongFeedback: 'Yanlış. Düşük güç yanığı engellemez; temas alanı belirleyicidir.'
      },
      aiHintPrompt: 'Bu hasta için plaka yerleşimi önerisi.'
    },

    'antiseptic-bottle': {
      node: 'equipmentAndFireSafety', taskTag: 't_antiseptic',
      title: 'ANTİSEPTİK KURUMA VE YANGIN GÜVENLİĞİ',
      subtitle: 'Alkol bazlı antiseptik tam kurumadan ESU kullanılmamalıdır.',
      chips: ['Antiseptik', 'Yangın', 'Hard-stop'],
      category: 'equipmentAndFireSafety',
      role: 'Sirküle hemşire, scrub hemşiresi, cerrah.',
      gcklItem: 'Yangın ve cihaz güvenliği.',
      desc: 'Prep kuruluğu, oksijen birikimi ve ESU kullanımı birlikte değerlendirilmelidir.',
      linkedTask: 'Antiseptik kuruma güvenliğini doğrula.',
      warning: 'Islak antiseptik alan üzerinde ESU kullanmak yangın riskidir.',
      failureMode: 'Cerrah acele ettiği için kuruma süresini beklememek.',
      successCriteria: 'Antiseptik kurumuş, oksijen birikimi azaltılmış ve ESU güvenli.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'antiseptic_dry', label: 'Antiseptiğin kuruduğunu bekle / doğrula' }
      ],
      checklist: [
        { ev: 'antiseptic_dry',        label: 'Antiseptik kuruma doğrulandı' },
        { ev: 'fire_triangle_assessed',label: 'Oksijen riski değerlendirildi' },
        { ev: 'esu_pad_position',      label: 'ESU kullanımı güvenli kabul edildi' }
      ],
      hardStop: true,
      severity: 'danger',
      clinicalEvidence: {
        source: 'AORN Surgical Fire Prevention 2024; ECRI; APSF Fire Algorithm.',
        note: 'Alkol bazlı prep için min. 3 dk kuruma; saç vb. için daha uzun.'
      },
      gcklMapping: {
        node: 'equipmentAndFireSafety', taskTag: 't_antiseptic',
        clinicalKey: 'antiseptic-bottle', gcklItem: 'Antiseptik kuruma.',
        scoreWeight: 8, hardStop: true
      },
      microScenario: {
        title: 'Nemli alan üzerinde koter talebi',
        scenarioText: 'Prep alanı nemli görünürken koter isteniyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrah hazır, koter verilir.',
          'Koter durdurulur; alanın kuruması ve güvenlik koşulları sağlanır.',
          'Bez ile silinip koter başlatılır.',
          'Düşük güçte kullanılabilir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Hard-stop: ıslak antiseptik + O₂ + koter yangın üçgenidir.',
        wrongFeedback: 'Yanlış. Yangın saniyeler içinde oluşur.'
      },
      aiHintPrompt: 'Bu hasta için antiseptik kuruma süresi önerisi.'
    },

    'smoke-evac': {
      node: 'equipmentAndFireSafety', taskTag: 't_equipment',
      title: 'DUMAN TAHLİYE VE ASPİRASYON GÜVENLİĞİ',
      subtitle: 'Cerrahi duman ve aspirasyon hattı ekip güvenliğinin parçasıdır.',
      chips: ['Duman tahliye', 'ULPA'],
      category: 'equipmentAndFireSafety',
      role: 'Sirküle hemşire ve scrub hemşiresi.',
      gcklItem: 'Cihaz ve çevresel güvenlik.',
      desc: 'Duman tahliye ve aspirasyon hattı cerrahi başlamadan hazır olmalıdır.',
      linkedTask: 'Duman tahliye / aspirasyon hazırlığını doğrula.',
      warning: 'Duman tahliye olmadan enerji cihazı kullanımı ekip maruziyetini artırır.',
      failureMode: 'Aspirasyon çalışıyor diye duman tahliyeyi gereksiz görmek.',
      successCriteria: 'Duman tahliye, aspirasyon ve filtre bağlantısı hazırdır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'fire_triangle_assessed', label: 'Yangın üçgenini ve duman tahliyeyi değerlendir' }
      ],
      checklist: [
        { ev: 'fire_triangle_assessed', label: 'Duman tahliye hazır' },
        { ev: 'fire_triangle_assessed', label: 'Aspirasyon hattı çalışıyor' },
        { ev: 'antiseptic_dry',         label: 'Filtre/bağlantı kontrol edildi' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Surgical Smoke Safety 2024; NIOSH HC11.',
        note: 'Cerrahi duman HPV-DNA ve kanserojen partikül içerir.'
      },
      gcklMapping: {
        node: 'equipmentAndFireSafety', taskTag: 't_equipment',
        clinicalKey: 'smoke-evac', gcklItem: 'Duman tahliye güvenliği.',
        scoreWeight: 8, hardStop: false
      },
      microScenario: {
        title: 'Kapalı duman tahliye',
        scenarioText: 'Koter kullanılacak ama duman tahliye kapalı.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Aspirasyon yeterli.',
          'Duman tahliye aktif hale getirilir; ekip güvenliği sağlanır.',
          'Maske takmak yeterli.',
          'Postop dönemde havalandırılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Aspirasyon duman tahliye yerine geçmez.',
        wrongFeedback: 'Yanlış. Kronik maruziyet ekip sağlığı için risktir.'
      },
      aiHintPrompt: 'Bu işlem için duman maruziyet önerisi.'
    },

    'suction-smoke': {
      node: 'equipmentAndFireSafety', taskTag: 't_equipment',
      title: 'ASPİRASYON HATTI GÜVENLİĞİ',
      subtitle: 'Aspirasyon hattı kan kaybı izleminin parçasıdır.',
      chips: ['Aspirasyon', 'Kan kaybı izlemi'],
      category: 'equipmentAndFireSafety',
      role: 'Sirküle hemşire ve scrub hemşiresi.',
      gcklItem: 'Aspirasyon hattı hazır mı?',
      desc: 'Kapalı sistem aspirasyon kan kaybı miktarının görünür olmasını sağlar; biohazard atık güvenliğini sürdürür.',
      linkedTask: 'Aspirasyon hattını doğrula.',
      warning: 'Aspirasyon hacminin sözel bildirilmemesi kan kaybı yanılgısına yol açar.',
      failureMode: 'Hacim sayımını ekibe sözel olarak iletmeyerek izlemi kişiselleştirmek.',
      successCriteria: 'Aspirasyon hattı çalışır, hacim ekibe bildirilir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'fire_triangle_assessed', label: 'Aspirasyon ve yangın üçgenini koordine et' }
      ],
      checklist: [
        { ev: 'fire_triangle_assessed', label: 'Aspirasyon hattı çalışıyor' },
        { ev: 'fire_triangle_assessed', label: 'Hacim sözel bildirildi' },
        { ev: 'antiseptic_dry',         label: 'Biohazard atık güvenliği sağlandı' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Surgical Smoke Safety 2024; OSHA Bloodborne Pathogens Standard.',
        note: 'Aspirasyon hacmi kan kaybı tahmininin parçasıdır.'
      },
      gcklMapping: {
        node: 'equipmentAndFireSafety', taskTag: 't_equipment',
        clinicalKey: 'suction-smoke', gcklItem: 'Aspirasyon güvenliği.',
        scoreWeight: 8, hardStop: false
      },
      microScenario: {
        title: 'Sözel bildirilmemiş aspirasyon hacmi',
        scenarioText: 'Cerrahi 90 dakikadır sürüyor; aspirasyon kabı yarıdan fazla dolmuş. Scrub hemşire hacmi gözlemledi ama anesteziye sözel bildirmedi. Anestezi kayıtta kan kaybını "minimal" olarak işaretlemeye devam ediyor.',
        questionText: 'Sirküle hemşirenin doğru yaklaşımı nedir?',
        options: [
          'Anestezi kendi izlemini yapıyor; hemşirenin müdahalesi gerekmez.',
          'Aspirasyon hacmi sözel olarak ekibe bildirilir ve kan kaybı tahmini birlikte güncellenir.',
          'Sayım kapanışta toplandığında bildirilir.',
          'Sadece sirküle hemşire kendi kayıt formuna not düşer.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Kan kaybı tahmini ekip kararıdır; aspirasyon hacmi sözel bildirilmeden anestezi izlemi eksik bilgiyle çalışır. Sözel paylaşım GCKL ilkelerinin temelidir.',
        wrongFeedback: 'Yanlış. Aspirasyon hacminin gizli kalması anesteziyi yanıltır; düşük tahmin edilen kan kaybı geç müdahaleye yol açar. Kan kaybı izlemi tek bir kişinin sorumluluğu değildir.'
      },
      aiHintPrompt: 'Bu hasta için aspirasyon hacim raporlama sıklığı.'
    },

    'fire-risk': {
      node: 'equipmentAndFireSafety', taskTag: 't_equipment',
      title: 'YANGIN RİSKİ DEĞERLENDİRMESİ',
      subtitle: 'Oksijen, yakıt ve enerji kaynağı birlikte değerlendirilmelidir.',
      chips: ['Yangın üçgeni', 'O₂', 'Hard-stop (cond.)'],
      category: 'equipmentAndFireSafety',
      role: 'Tüm ekip; sirküle hemşire hatırlatıcı rol oynar.',
      gcklItem: 'Cihaz ve yangın güvenliği.',
      desc: 'Yangın üçgeni intraop güvenlik kontrolünün açık parçası olmalıdır.',
      linkedTask: 'Yangın riskini değerlendir.',
      warning: 'Oksijen birikimi ve alkol bazlı prep varken enerji cihazı kullanmak.',
      failureMode: 'Yangın riskini yalnız anestezi veya cerrah sorumluluğu sanmak.',
      successCriteria: 'Oksijen, yakıt ve enerji kaynakları ekipçe değerlendirilmiştir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'fire_triangle_assessed', label: 'Yangın üçgenini değerlendir (O₂–ateş–yakıt)' }
      ],
      checklist: [
        { ev: 'fire_triangle_assessed', label: 'Oksijen riski konuşuldu' },
        { ev: 'antiseptic_dry',         label: 'Yakıt/prep kuruluğu değerlendirildi' },
        { ev: 'esu_pad_position',       label: 'Enerji cihazı güvenli kabul edildi' }
      ],
      hardStop: 'conditional',
      severity: 'danger',
      clinicalEvidence: {
        source: 'AORN Surgical Fire Prevention 2024; ECRI; APSF Fire Algorithm.',
        note: 'Üst gövde/yüz cerrahisinde O₂ akışı + alkol bazlı prep + ESU özellikle yüksek risk.'
      },
      gcklMapping: {
        node: 'equipmentAndFireSafety', taskTag: 't_equipment',
        clinicalKey: 'fire-risk', gcklItem: 'Yangın üçgeni değerlendirmesi.',
        scoreWeight: 8, hardStop: 'conditional'
      },
      microScenario: {
        title: 'Yüksek O₂ + ESU',
        scenarioText: 'Yüz/üst gövdeye yakın alanda oksijen akışı yüksek ve ESU isteniyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Düşük güçte ESU güvenli.',
          'Yangın riski azaltılmadan enerji cihazı kullanılmaz; O₂, drape ve ESU koordine edilir.',
          'O₂ tamamen kapatılır.',
          'Kesi öncesi 1 dakika beklenir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Yangın üçgeninin tüm bileşenleri birlikte ele alınmalı.',
        wrongFeedback: 'Yanlış. Tek bileşen düzeltmek yangın riskini ortadan kaldırmaz.'
      },
      aiHintPrompt: 'Bu hasta için yangın riski azaltma önerisi.'
    },

    /* ====== H) STERİL ALAN / TRAFİK (sterileFieldAndTraffic) ====== */

    'mayo-stand': {
      node: 'sterileFieldAndTraffic', taskTag: 't_sterile_field',
      title: 'MAYO MASASI VE STERİL ALAN GÜVENLİĞİ',
      subtitle: 'Steril alan düzeni, kontaminasyon riskini azaltır.',
      chips: ['Mayo', 'Steril alan'],
      category: 'sterileFieldAndTraffic',
      role: 'Scrub hemşiresi; sirküle hemşire çevresel kontrol sağlar.',
      gcklItem: 'Steril alan bütünlüğü.',
      desc: 'Mayo masası, steril sınır içinde düzenli, görünür ve kontaminasyon riskinden uzak tutulmalıdır.',
      linkedTask: 'Steril alan ve oda trafiği kontrolü.',
      warning: 'Steril alan ihlali fark edilmeden işlem sürdürülürse enfeksiyon riski artar.',
      failureMode: 'Mayo masasının steril sınır ihlalini görmezden gelmek.',
      successCriteria: 'Steril alan sınırları korunur, aletler güvenli düzenlenir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'sterile_field_intact', label: 'Mayo steril bütünlüğünü kontrol et' }
      ],
      checklist: [
        { ev: 'sterile_field_intact', label: 'Mayo steril sınırda' },
        { ev: 'sterile_field_intact', label: 'Kontaminasyon riski yok' },
        { ev: 'traffic_controlled',   label: 'Alet düzeni güvenli' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Sterile Technique 2024; CDC SSI Prevention 2017.',
        note: 'Steril alan ihlali SSI için doğrudan risk faktörüdür.'
      },
      gcklMapping: {
        node: 'sterileFieldAndTraffic', taskTag: 't_sterile_field',
        clinicalKey: 'mayo-stand', gcklItem: 'Mayo steril güvenliği.',
        scoreWeight: 6, hardStop: false
      },
      microScenario: {
        title: 'Steril sınır ihlali şüphesi',
        scenarioText: 'Mayo masası steril olmayan yüzeye çok yaklaştı.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Dokunulmadıysa sorun yok.',
          'Steril alan değerlendirilir; gerekirse yeniden düzenleme yapılır.',
          'Sirküle hemşire üfler, devam edilir.',
          'Postop antibiyotik artırılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Şüpheli kontaminasyon ihlal olarak ele alınır.',
        wrongFeedback: 'Yanlış. SSI önleme şüpheye yer bırakmaz.'
      },
      aiHintPrompt: 'Bu işlem için Mayo düzeni önerisi.'
    },

    'back-table': {
      node: 'sterileFieldAndTraffic', taskTag: 't_sterile_field',
      title: 'BACK TABLE VE STERİL ÖRTÜ ALANI',
      subtitle: 'Steril alanın bütünlüğü sürekli korunmalıdır.',
      chips: ['Back table', 'Steril örtü'],
      category: 'sterileFieldAndTraffic',
      role: 'Scrub hemşiresi ve sirküle hemşire.',
      gcklItem: 'Steril alan bütünlüğü.',
      desc: 'Back table ve steril örtü sınırları ekip tarafından görülebilir ve korunabilir olmalıdır.',
      linkedTask: 'Steril alan bütünlüğünü doğrula.',
      warning: 'Kontaminasyon şüphesi varken steril alanı güvenli kabul etmek.',
      failureMode: '"Dokunuldu ama önemli değildir" diyerek alanı sürdürmek.',
      successCriteria: 'Steril alan ihlali yoktur; varsa düzeltilmiştir.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'sterile_field_intact', label: 'Steril örtü bütünlüğünü kontrol et' }
      ],
      checklist: [
        { ev: 'sterile_field_intact', label: 'Steril örtü bütünlüğü kontrol edildi' },
        { ev: 'sterile_field_intact', label: 'Back table güvenli' },
        { ev: 'traffic_controlled',   label: 'Kontaminasyon yok' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Sterile Technique 2024.',
        note: 'Şüpheli ihlal yenilenmiş steril alanla sonuçlanmalıdır.'
      },
      gcklMapping: {
        node: 'sterileFieldAndTraffic', taskTag: 't_sterile_field',
        clinicalKey: 'back-table', gcklItem: 'Back table güvenliği.',
        scoreWeight: 6, hardStop: false
      },
      microScenario: {
        title: 'Örtü alt sınırı teması',
        scenarioText: 'Steril örtünün alt sınırına temas oldu; ekip bilinmiyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Görmezden gelinir.',
          'Kontaminasyon riski değerlendirilir; gerekiyorsa alan yenilenir.',
          'Sadece alt sınır izole edilir.',
          'Postop kontrol yeterli.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Şüpheli alan ihlal kabul edilmelidir.',
        wrongFeedback: 'Yanlış. Görmezden gelmek SSI riskini doğurur.'
      },
      aiHintPrompt: 'Bu işlem için steril alan önceliği.'
    },

    'or-door': {
      node: 'sterileFieldAndTraffic', taskTag: 't_sterile_field',
      title: 'ODA TRAFİĞİ VE STERİL ÇEVRE',
      subtitle: 'Gereksiz trafik steril güvenliği ve ekip odağını bozar.',
      chips: ['Trafik', 'Kapı', 'Odak'],
      category: 'sterileFieldAndTraffic',
      role: 'Sirküle hemşire.',
      gcklItem: 'Steril alan ve çevresel güvenlik.',
      desc: 'Kapı açılmaları, gereksiz giriş-çıkış ve steril alana yaklaşma kontrol edilmelidir.',
      linkedTask: 'Steril alan ve oda trafiğini kontrol et.',
      warning: 'Gereksiz trafik kontaminasyon ve dikkat dağınıklığı riskini artırır.',
      failureMode: 'Oda trafiğini "normal yoğunluk" kabul etmek.',
      successCriteria: 'Trafik sınırlanır, gerekli hareketler güvenli yapılır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'traffic_controlled', label: 'Oda trafiğini sınırlandır' }
      ],
      checklist: [
        { ev: 'traffic_controlled',   label: 'Oda trafiği değerlendirildi' },
        { ev: 'traffic_controlled',   label: 'Gereksiz giriş çıkış azaltıldı' },
        { ev: 'sterile_field_intact', label: 'Steril sınır korundu' }
      ],
      hardStop: false,
      severity: 'info',
      clinicalEvidence: {
        source: 'AORN Sterile Technique 2024 (Traffic Patterns).',
        note: 'Yüksek trafik OR\'da partikül sayısını ve SSI riskini artırır.'
      },
      gcklMapping: {
        node: 'sterileFieldAndTraffic', taskTag: 't_sterile_field',
        clinicalKey: 'or-door', gcklItem: 'Oda trafiği güvenliği.',
        scoreWeight: 6, hardStop: false
      },
      microScenario: {
        title: 'Sık kapı açılması',
        scenarioText: 'Kapı sık açılıyor ve ekip dikkati dağılıyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Normal yoğunluk, devam edilir.',
          'Oda trafiği sınırlanır; ekip güvenliği korunur.',
          'Kapı kilitlenir.',
          'Tamamı görmezden gelinir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Trafik kontrolü hem sterilite hem ekip odağı için önemli.',
        wrongFeedback: 'Yanlış. Yüksek trafik SSI ve hata riskini artırır.'
      },
      aiHintPrompt: 'Bu işlem için trafik kontrolü önerisi.'
    },

    /* ====== I) POZİSYON / ISI (positioningAndTemperature) ====== */

    'or-table': {
      node: 'positioningAndTemperature', taskTag: 't_position',
      title: 'POZİSYON VE BASI NOKTASI GÜVENLİĞİ',
      subtitle: 'Pozisyonlama, bası yaralanması ve sinir hasarını önleme bariyeridir.',
      chips: ['Pozisyon', 'Bası', 'Sinir koruma'],
      category: 'positioningAndTemperature',
      role: 'Sirküle hemşire, anestezi ekibi ve cerrahi ekip.',
      gcklItem: 'Hasta pozisyonu ve güvenliği.',
      desc: 'Hasta pozisyonu, ekstremite desteği, bası noktaları ve güvenli masa yerleşimi kontrol edilmelidir.',
      linkedTask: 'Pozisyon güvenliğini doğrula.',
      warning: 'Bası noktaları korunmadan uzun cerrahiye başlamak bası yaralanması riskini artırır.',
      failureMode: 'Pozisyonu bir kez verip cerrahi boyunca tekrar değerlendirmemek.',
      successCriteria: 'Pozisyon, pedleme ve bası noktaları doğrulanır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'positioning_safe', label: 'Pozisyon ve bası noktalarını doğrula' }
      ],
      checklist: [
        { ev: 'positioning_safe',  label: 'Pozisyon güvenli' },
        { ev: 'positioning_safe',  label: 'Bası noktaları korundu' },
        { ev: 'active_warming_on', label: 'Ekstremite desteği kontrol edildi' }
      ],
      hardStop: false,
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Positioning the Patient 2024; APSF Positioning Recommendations.',
        note: 'Uzun cerrahide pozisyon her 30 dk değerlendirilmeli.'
      },
      gcklMapping: {
        node: 'positioningAndTemperature', taskTag: 't_position',
        clinicalKey: 'or-table', gcklItem: 'Pozisyon güvenliği.',
        scoreWeight: 6, hardStop: false
      },
      microScenario: {
        title: 'Bası altında kol',
        scenarioText: 'Kol desteği gergin ve dirsek bası altında.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrahi süresince devam edilir.',
          'Pozisyon düzeltilir ve bası noktası korunur.',
          'Postop dönemde değerlendirilir.',
          'Sadece kayda alınır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Sinir hasarı önlenebilir komplikasyondur.',
        wrongFeedback: 'Yanlış. Postop ulnar nöropati pozisyon hatasıyla ilişkilidir.'
      },
      aiHintPrompt: 'Bu hasta için pozisyon önerisi.'
    },

    'forced-air-warmer': {
      node: 'positioningAndTemperature', taskTag: 't_temp',
      title: 'AKTİF ISITMA VE NORMOTERMİ',
      subtitle: 'Hipotermi önleme intraop hasta güvenliğinin parçasıdır.',
      chips: ['Aktif ısıtma', 'Normotermi'],
      category: 'positioningAndTemperature',
      role: 'Sirküle hemşire ve anestezi ekibi.',
      gcklItem: 'Hasta ısısı ve hipotermi önleme.',
      desc: 'Aktif ısıtma cihazı, sıcaklık trendi ve hastanın termal korunması ekipçe izlenmelidir.',
      linkedTask: 'Sıcaklık ve aktif ısıtma güvenliğini doğrula.',
      warning: 'T <35°C\'ye rağmen ısıtma ve ekip eskalasyonu yapılmazsa komplikasyon riski artar.',
      failureMode: 'Hipotermiyi postopta düzeltilir diye ertelemek.',
      successCriteria: 'Aktif ısıtma çalışır, sıcaklık trendi izlenir, düşüşte ekip müdahale eder.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'active_warming_on', label: 'Aktif ısıtmayı başlat / kontrol et' }
      ],
      checklist: [
        { ev: 'active_warming_on', label: 'Aktif ısıtma açık' },
        { ev: 'active_warming_on', label: 'Sıcaklık trendi izlendi' },
        { ev: 'positioning_safe',  label: 'Hipotermi riski değerlendirildi' }
      ],
      hardStop: 'conditional',
      severity: 'warning',
      clinicalEvidence: {
        source: 'AORN Prevention of Unplanned Hypothermia 2024; NICE CG65.',
        note: 'İnadvertan hipotermi koagülopati, SSI ve kardiyak iskemiyle ilişkilidir.'
      },
      gcklMapping: {
        node: 'positioningAndTemperature', taskTag: 't_temp',
        clinicalKey: 'forced-air-warmer', gcklItem: 'Aktif ısıtma.',
        scoreWeight: 6, hardStop: 'conditional'
      },
      microScenario: {
        title: 'Sıcaklık düşüşü',
        scenarioText: 'Sıcaklık 35.8°C\'ye düşüyor; anestezi "hala kabul edilebilir" diyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Postop ısıtma yeterli.',
          'Aktif ısıtma, ısıtılmış sıvılar ve sıcaklık trendi anesteziyle birlikte değerlendirilir.',
          'Oda ısısı artırılır, beklenir.',
          'Battaniye eklenir, sayım yeterli.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. <36°C amber eşik; aktif müdahale gerekir.',
        wrongFeedback: 'Yanlış. Pasif önlemler düşüşü durdurmaz.'
      },
      aiHintPrompt: 'Bu hasta için normotermi önerisi.'
    },

    'temp-trigger-panel': {
      node: 'positioningAndTemperature', taskTag: 't_temp',
      title: 'SICAKLIK TETİK UYARISI',
      subtitle: 'Sıcaklık düşüşü karar desteğiyle izlenmelidir.',
      chips: ['Sıcaklık', 'Tetik eşik', 'Hard-stop (cond.)'],
      category: 'positioningAndTemperature',
      role: 'Anestezi ekibi ve sirküle hemşire.',
      gcklItem: 'Hipotermi önleme ve hasta güvenliği.',
      desc: 'T <36°C amber, T <35°C kırmızı kritik uyarı olarak değerlendirilir.',
      linkedTask: 'Sıcaklık tetik uyarısını değerlendir.',
      warning: 'T <35°C kritik uyarıya rağmen müdahale etmeden devam etmek.',
      failureMode: 'Isı düşüşünü normal kabul etmek ve kayıtla yetinmek.',
      successCriteria: 'Uyarı seviyesi doğru yorumlanır, ekip bilgilendirilir, ısıtma müdahalesi başlar.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'active_warming_on', label: 'Aktif ısıtmayı başlat / kontrol et' }
      ],
      checklist: [
        { ev: 'active_warming_on', label: 'Sıcaklık seviyesi yorumlandı' },
        { ev: 'active_warming_on', label: 'Isıtma müdahalesi başlatıldı' },
        { ev: 'positioning_safe',  label: 'Ekip bilgilendirildi' }
      ],
      hardStop: 'conditional',
      severity: 'danger',
      clinicalEvidence: {
        source: 'AORN Hypothermia Prevention 2024; NICE CG65; ASA Guidelines.',
        note: 'T<35°C ve müdahale yoksa hard-stop\'a yükseltilir.'
      },
      gcklMapping: {
        node: 'positioningAndTemperature', taskTag: 't_temp',
        clinicalKey: 'temp-trigger-panel', gcklItem: 'Sıcaklık tetik uyarısı.',
        scoreWeight: 6, hardStop: 'conditional'
      },
      microScenario: {
        title: 'Kırmızı sıcaklık uyarısı',
        scenarioText: 'T 34.9°C ve kırmızı uyarı var; ekip henüz reaksiyon vermedi.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Sınırda kabul edilir, izlenmeye devam.',
          'Kritik hipotermi olarak ele alınır; aktif ısıtma ve ekip eskalasyonu yapılır.',
          'Sadece battaniye eklenir.',
          'Postop ısıtma yeterli.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. <35°C kritik eşiktir; aktif müdahale gerekir.',
        wrongFeedback: 'Yanlış. Pasif önlem yetersizdir.'
      },
      aiHintPrompt: 'Bu hasta için sıcaklık eşik yönetimi önerisi.'
    },

    /* ====== J) SAYIM (countSafety) ====== */

    'count-board': {
      node: 'countSafety', taskTag: 't_count_initial',
      title: 'ALET, SPANÇ VE İĞNE SAYIMI',
      subtitle: 'Sayım güvenliği kapanış öncesi en güçlü bariyerlerden biridir.',
      chips: ['Sayım', 'AORN üçlü', 'Hard-stop'],
      category: 'countSafety',
      role: 'Scrub hemşiresi ve sirküle hemşire.',
      gcklItem: 'Sayım doğru mu?',
      desc: 'Başlangıç ve kapanış sayımları ayrı ayrı, sesli ve kayıtlı doğrulanmalıdır.',
      linkedTask: 'Başlangıç ve kapanış sayımını doğrula.',
      warning: 'Sayım tutarsızlığı çözülmeden kavite kapatılırsa retained surgical item (RSI) riski oluşur.',
      failureMode: 'Scrub hemşire emin değilken kayıt tam diye kapatmaya izin vermek.',
      successCriteria: 'Başlangıç sayımı ve kapanış sayımı doğrulanır; tutarsızlık yoktur.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'count_initial', label: 'Acilis sayimini yap (cift hemsire)' },
        { ev: 'count_additional', label: 'Eklenen materyal sayimini guncelle' },
        { ev: 'count_final', label: 'Kapanis sayimini dogrula' }
      ],
      checklist: [
        { ev: 'count_initial', label: 'Baslangic sayimi tamamlandi' },
        { ev: 'count_additional', label: 'Ek materyal veya personel degisim sayimi guncellendi' },
        { ev: 'count_final',   label: 'Kapanis sayimi tamamlandi' },
        { ev: 'count_final',   label: 'Tutarsizlik yok' }
      ],
      hardStop: true,
      severity: 'danger',
      clinicalEvidence: {
        source: 'AORN Prevention of Retained Surgical Items 2024; Joint Commission Sentinel Event Policy.',
        note: 'RSI sentinel olaydır; sayım uyumsuzluğunda kavite kapatılmaz.'
      },
      gcklMapping: {
        node: 'countSafety', taskTag: 'intraop_initial_count+intraop_additional_count+intraop_final_count',
        clinicalKey: 'count-board', gcklItem: 'Alet/spanç/iğne sayımı.',
        scoreWeight: 12, hardStop: true
      },
      microScenario: {
        title: 'Kapanışta eksik spanç',
        scenarioText: 'Kapanışta bir spanç eksik görünüyor; cerrah "kavitede yok, hızla kapatalım" diyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Cerrah haklıdır, kapatılır.',
          'Kapanış durdurulur; sayım tekrar yapılır; bulunmazsa intraoperatif radyografi istenir.',
          'Sayım tekrarı yeterli, radyografi gereksiz.',
          'Postop dönemde kontrol edilir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. AORN protokolü: arama→ek sayım→radyografi.',
        wrongFeedback: 'Yanlış. RSI sentinel olaydır; cerrah baskısı sayımı geçersiz kılmaz.'
      },
      aiHintPrompt: 'Bu işlem için sayım önceliği.'
    },

    /* ====== K) NUMUNE / EKİPMAN (specimenAndEquipmentIssue) ====== */

    'specimen-container': {
      node: 'specimenAndEquipmentIssue', taskTag: 't_specimen',
      title: 'NUMUNE ETİKETLEME VE EKİPMAN SORUNU',
      subtitle: 'Numune etiketi hasta bilgisiyle çapraz doğrulanmalıdır.',
      chips: ['Numune', 'Etiket', 'Ekipman'],
      category: 'specimenAndEquipmentIssue',
      role: 'Sirküle hemşire ve scrub hemşiresi.',
      gcklItem: 'Numune etiketi ve ekipman sorunu.',
      desc: 'Her numune hasta kimliği, taraf ve doku adı ile çift kontrolle etiketlenir; ekipman sorunu kayıt altına alınır.',
      linkedTask: 'Numune etiketlemesini ve ekipman sorunlarını doğrula.',
      warning: 'Yanlış etiketlenmiş numune yanlış tanı ve yanlış cerrahi karara yol açar.',
      failureMode: 'Etiketlemeyi "sonra yaparız" diyerek ertelemek.',
      successCriteria: 'Numune etiketi hasta bilgisiyle eşleşir; ekipman sorunu kayıtlıdır.',
      prerequisites: ['patientProcedureSite'],
      buttons: [
        { ev: 'specimen_labeled', label: 'Numune etiketini hasta bilgisiyle doğrula' }
      ],
      checklist: [
        { ev: 'specimen_labeled',          label: 'Numune durumu doğrulandı' },
        { ev: 'specimen_labeled',          label: 'Etiket çift kontrol edildi' },
        { ev: 'equipment_issues_reported', label: 'Ekipman sorunu kaydedildi' }
      ],
      hardStop: false,
      severity: 'danger',
      clinicalEvidence: {
        source: 'AORN Specimen Management 2024; CAP Lab Accreditation.',
        note: 'Numune karışması sentinel olay sınıfındadır.'
      },
      gcklMapping: {
        node: 'specimenAndEquipmentIssue', taskTag: 't_specimen',
        clinicalKey: 'specimen-container', gcklItem: 'Numune etiketleme.',
        scoreWeight: 8, hardStop: false
      },
      microScenario: {
        title: 'Etiket uyumsuzluğu',
        scenarioText: 'Etiket hasta bilgisiyle uyumsuz görünüyor.',
        questionText: 'Ne yapılmalı?',
        options: [
          'Patoloji formuna güvenilir.',
          'Numune patolojiye gönderilmez; etiket çift doğrulama ile düzeltilir.',
          'Sadece tarih düzeltilir.',
          'Postop dönemde değerlendirilir.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Numune karışması sentinel olaydır.',
        wrongFeedback: 'Yanlış. Uyumsuz etiket yanlış tanı riskidir.'
      },
      aiHintPrompt: 'Bu işlem için numune etiketleme önceliği.'
    },

    /* ====== L) SIGN-OUT (signOutHandoff) ====== */

    'signout-checklist': {
      node: 'signOutHandoff', taskTag: 't_signout',
      title: 'NUMUNE, EKİPMAN VE SIGN-OUT',
      subtitle: 'Hasta odadan çıkmadan önce işlem, sayım, numune, ekipman ve postop planı doğrulanmalıdır.',
      chips: ['Sign-out', 'Postop plan', 'Hard-stop'],
      category: 'signOutHandoff',
      role: 'Sirküle hemşire, scrub hemşiresi, cerrah, anestezi ekibi.',
      gcklItem: 'Sign-out: işlem, sayım, numune, ekipman sorunu ve kritik bakım planı.',
      desc: 'Sign-out yalnız sayım değil; yapılan işlem, numune, ekipman sorunu ve postop kritik bakım gereksinimlerinin ekipçe kapanışıdır.',
      linkedTask: 'Sign-out ve güvenli teslimi tamamla.',
      warning: 'Sign-out yapılmadan transfer, kritik bilginin postop ekibe aktarılmamasına yol açar.',
      failureMode: 'Sayım tamam diye sign-out\'u tamamlanmış kabul etmek.',
      successCriteria: 'İşlem, sayım, numune/ekipman durumu ve postop plan ekipçe paylaşılır.',
      prerequisites: ['countSafety'],
      buttons: [
        { ev: 'procedure_announced', label: 'Yapılan işlemi sesli olarak doğrula' }
      ],
      checklist: [
        { ev: 'procedure_announced',        label: 'Yapılan işlem doğrulandı' },
        { ev: 'count_final_confirmed',      label: 'Sayım sonucu doğrulandı' },
        { ev: 'specimen_confirmed',         label: 'Numune durumu paylaşıldı' },
        { ev: 'equipment_issues_announced', label: 'Ekipman sorunu paylaşıldı' },
        { ev: 'postop_critical_plan',       label: 'Postop kritik bakım planı aktarıldı' }
      ],
      hardStop: true,
      severity: 'danger',
      clinicalEvidence: {
        source: 'WHO SSC (Sign-Out); AORN Handoff Communication 2024; Joint Commission NPSG.',
        note: 'Eksik handoff postop komplikasyonların öncül faktörüdür.'
      },
      gcklMapping: {
        node: 'signOutHandoff', taskTag: 't_signout',
        clinicalKey: 'signout-checklist', gcklItem: 'Sign-out ve handoff.',
        scoreWeight: 10, hardStop: true
      },
      microScenario: {
        title: 'Eksik postop plan',
        scenarioText: 'Sayım doğru ama postop kritik bakım planı aktarılmadan transfer planlanıyor.',
        questionText: 'Sign-out tamam mı?',
        options: [
          'Sayım tamam, yeterli.',
          'Hayır. Postop kritik gereksinimler aktarılmadan sign-out tamamlanmış sayılmaz.',
          'Anestezi kısa not yazar yeterli.',
          'PACU\'da paylaşılır.'
        ],
        correctIndex: 1,
        correctFeedback: 'Doğru. Sign-out tüm bileşenler tamamlanmadan kapanmaz.',
        wrongFeedback: 'Yanlış. Eksik handoff postop sentinel olay öncülüdür.'
      },
      aiHintPrompt: 'Bu hasta için sign-out kritik öğeleri.'
    }
  };

  // =================================================================
  //  CLINICAL KEY ALIAS HARİTASI
  //  Sahnede kullanılan / spec'te tanımlı alternatif key'leri
  //  yukarıdaki ana kart adlarına eşle.
  // =================================================================
  const KEY_ALIAS = {
    // timeOutTeam
    'timeout-board': 'time-out',
    'surgical-team': 'or-team-figures',
    'surgeon': 'or-team-figures',
    'light-timeout': 'time-out',
    'signin': 'anesthesia-machine',         // sign-in ankoru anestezi cihazına bağlanır

    // patientProcedureSite
    'surgical-field': 'site-marking',

    // imagingAndResults
    'pacs': 'imaging-monitor',
    'result-board': 'lab-panel',

    // antibioticProphylaxis
    'medication-tray': 'antibiotic-syringe',

    // anesthesiaSafety
    'monitor': 'pulse-oximeter',
    'aline-panel': 'airway-cart',
    'anaesthesia-team': 'anesthesia-machine',

    // bloodLossRisk
    'transfusion-panel': 'blood-bags',
    'blood-loss-board': 'rapid-infuser',
    'cabg-anaesthesia-module': 'blood-bags',  // CABG paneli kan kaybı içerikli
    'iv-pump-intraop': 'rapid-infuser',
    'perfusionist': 'cpb-machine',
    'perfusion-console': 'cpb-machine',
    'cpb-phase-board': 'cpb-machine',

    // equipmentAndFireSafety
    'electrocautery': 'esu-unit',
    'esu-footswitch': 'esu-unit',
    'return-electrode': 'esu-pad',
    'cpb-machine': 'cpb-machine',

    // sterileFieldAndTraffic
    'mayo-table': 'mayo-stand',
    'sterile-drape': 'back-table',
    'traffic-control': 'or-door',
    'scrub-nurse': 'mayo-stand',
    'scrub-nurse-3d': 'mayo-stand',
    'graft-prep-table': 'back-table',

    // positioningAndTemperature
    'positioning-set': 'or-table',
    'warming-blanket': 'forced-air-warmer',
    'cabg-temp-trigger': 'temp-trigger-panel',

    // countSafety
    'instrument-tray': 'count-board',
    'sponge': 'count-board',
    'sharps-tray': 'count-board',
    'waste-station': 'count-board',
    'circulating-nurse': 'count-board',

    // specimenAndEquipmentIssue
    'specimen': 'specimen-container',
    'label': 'specimen-container',
    'equipment-incident-log': 'specimen-container',
    'specimen-table': 'specimen-container',

    // signOutHandoff
    'handoff-card': 'signout-checklist',
    'transfer-stretcher': 'signout-checklist',
    'icu-card': 'signout-checklist',
    'postop-plan': 'signout-checklist',

    // ADIM 4: Sahnede var olan ama önceden eşleşmemiş intraop objeler
    // (klinik en yakın eşleşme ilkesiyle mevcut kartlara yönlendirildi —
    //  yeni içerik üretilmedi, ek kart yazılmadı)
    'cabg-device-audit': 'esu-unit',     // CABG cihaz denetimi → ESU/koter güvenlik kartı (cihaz güvenliği ailesi)
    'portable-carm': 'imaging-monitor',  // Taşınabilir C-arm → görüntüleme görünürlüğü kartı
    'radiation-safety': 'imaging-monitor' // Radyasyon güvenliği → görüntüleme bağlamı (C-arm sonucu)
  };

  // =================================================================
  //  resolveCard — clinicalKey'den karta erişim (alias destekli)
  // =================================================================
  function resolveCard(clinicalKey) {
    if (!clinicalKey) return null;
    var k = String(clinicalKey);
    if (CARDS[k]) return CARDS[k];
    var aliased = KEY_ALIAS[k];
    if (aliased && CARDS[aliased]) return CARDS[aliased];
    return null;
  }

  // =================================================================
  //  VALIDATOR — spec madde 1-13
  // =================================================================
  // =================================================================
  //  VALIDATOR — ADIM 2 (güçlendirilmiş)
  //  Spec madde 1-13 + checklist.ev + taskTag + console.table çıktıları.
  // =================================================================

  // Network ile birebir uyumlu taskTag → node kataloğu
  // (HTML içindeki TAG_MAP IIFE-kapalı olduğu için yerel kopya tutuyoruz)
  var NODE_TAGS = {
    timeOutTeam:               ['t_timeout', 'intraop_team_timeout'],
    patientProcedureSite:      ['t_site_procedure_verify', 'intraop_identity_procedure'],
    imagingAndResults:         ['t_imaging_intraop'],
    antibioticProphylaxis:     ['t_antibiotic', 'intraop_allergy_antibiotic'],
    anesthesiaSafety:          ['t_anesthesia_assist', 'intraop_anaesthesia_safety'],
    bloodLossRisk:             ['t_fluid_blood'],
    equipmentAndFireSafety:    ['t_equipment', 't_antiseptic', 'intraop_equipment_fire_safety'],
    sterileFieldAndTraffic:    ['t_sterile_field', 'intraop_sterile_field'],
    positioningAndTemperature: ['t_position', 't_temp'],
    countSafety:               ['t_count_initial', 't_count_additional', 't_count_final', 'intraop_initial_count', 'intraop_additional_count', 'intraop_final_count'],
    specimenAndEquipmentIssue: ['t_specimen', 'intraop_specimen_safety'],
    signOutHandoff:            ['t_signout'],
    cabgCpbSafety:             ['t_cabg_cpb_ready', 'intraop_cabg_cpb_safety'],
    teamCommunication:         ['t_team_communication', 'intraop_communication_handoff']
  };

  function validateIntraPopups() {
    var report = {
      validCards: [], missingFields: [], invalidNode: [], invalidEvidence: [],
      invalidTaskTag: [],
      duplicateClinicalKey: [], unmappedSceneObjects: [], unusedPopupDefinitions: [],
      invalidScoreWeight: [], invalidHardStopSeverity: [], invalidMcqOptions: [],
      gcklMappingMismatch: [],
      // Per-card özet (console.table için)
      cardSummary: []
    };

    var REQUIRED = ['node','taskTag','title','subtitle','chips','category','role','gcklItem',
                    'desc','linkedTask','warning','failureMode','successCriteria','prerequisites',
                    'buttons','checklist','hardStop','severity','clinicalEvidence','gcklMapping',
                    'aiHintPrompt'];
    var VALID_NODES = Object.keys(NODE_EV);

    Object.keys(CARDS).forEach(function (key) {
      var c = CARDS[key];

      // ── 1. node geçerli mi
      if (VALID_NODES.indexOf(c.node) < 0) {
        report.invalidNode.push({ clinicalKey: key, node: c.node });
      }

      var validEvs = NODE_EV[c.node] || [];

      // ── 2. buttons.ev requiredEvidence içinde mi (her buton ayrı kayıt)
      (c.buttons || []).forEach(function (b, idx) {
        if (validEvs.indexOf(b.ev) < 0) {
          report.invalidEvidence.push({
            clinicalKey: key, where: 'buttons[' + idx + ']',
            ev: b.ev, validEvs: validEvs.join(', ')
          });
        }
      });

      // ── 3. checklist.ev requiredEvidence içinde mi (eklenen — adım 2)
      (c.checklist || []).forEach(function (b, idx) {
        if (validEvs.indexOf(b.ev) < 0) {
          report.invalidEvidence.push({
            clinicalKey: key, where: 'checklist[' + idx + ']',
            ev: b.ev, validEvs: validEvs.join(', ')
          });
        }
      });

      // ── 4. taskTag node için tanımlı mı (eklenen — adım 2)
      var validTags = NODE_TAGS[c.node] || [];
      if (typeof c.taskTag === 'string' && c.taskTag.indexOf('+') < 0) {
        if (validTags.indexOf(c.taskTag) < 0) {
          report.invalidTaskTag.push({
            clinicalKey: key, taskTag: c.taskTag, node: c.node, validTags: validTags.join(', ')
          });
        }
      }

      // ── 5-6. MCQ doğrulama
      if (c.microScenario) {
        var sc = c.microScenario;
        if (!sc.options || sc.options.length !== 4) {
          report.invalidMcqOptions.push({
            clinicalKey: key, reason: 'options sayısı !== 4',
            actual: sc.options ? sc.options.length : 0
          });
        }
        if (typeof sc.correctIndex !== 'number' || sc.correctIndex < 0 || sc.correctIndex > 3) {
          report.invalidMcqOptions.push({
            clinicalKey: key, reason: 'correctIndex 0-3 dışında',
            actual: sc.correctIndex
          });
        }
      }

      // ── 7. hardStop true ise severity danger olmalı
      if (c.hardStop === true && c.severity !== 'danger') {
        report.invalidHardStopSeverity.push({
          clinicalKey: key, hardStop: c.hardStop, severity: c.severity
        });
      }

      // ── 8. gcklMapping.node kart node'u ile aynı mı
      if (c.gcklMapping && c.gcklMapping.node !== c.node) {
        report.gcklMappingMismatch.push({
          clinicalKey: key, cardNode: c.node, mapNode: c.gcklMapping.node
        });
      }

      // ── 11. zorunlu alanlar
      var missing = REQUIRED.filter(function (f) { return c[f] == null; });
      if (missing.length) {
        report.missingFields.push({ clinicalKey: key, missing: missing.join(', ') });
      } else {
        report.validCards.push(key);
      }

      // Per-card özet satırı (console.table)
      var btnEvs = (c.buttons || []).map(function (b) { return b.ev; }).join(',');
      var clEvs  = (c.checklist || []).map(function (b) { return b.ev; });
      var clUnique = [];
      clEvs.forEach(function (e) { if (clUnique.indexOf(e) < 0) clUnique.push(e); });
      var allEvs = btnEvs.split(',').concat(clEvs);
      var anyBad = allEvs.some(function (e) { return e && validEvs.indexOf(e) < 0; });
      report.cardSummary.push({
        '#':           report.cardSummary.length + 1,
        'clinicalKey': key,
        'node':        c.node,
        'taskTag':     c.taskTag,
        'buttons.ev':  btnEvs,
        'checklist.ev': clUnique.join(','),
        'network ev':  validEvs.join(','),
        'hardStop':    String(c.hardStop),
        'severity':    c.severity,
        'durum':       anyBad ? '❌ uyumsuz' : '✓'
      });
    });

    // ── 10. duplicate clinicalKey (alias üzerinden farklı node'a düşme)
    var seen = {};
    Object.keys(CARDS).forEach(function (k) { seen[k] = CARDS[k].node; });
    Object.keys(KEY_ALIAS).forEach(function (k) {
      var target = KEY_ALIAS[k];
      var node = CARDS[target] && CARDS[target].node;
      if (seen[k] && seen[k] !== node) {
        report.duplicateClinicalKey.push({
          clinicalKey: k, node1: seen[k], node2: node
        });
      } else {
        seen[k] = node;
      }
    });

    // ── 12. Sahnede var, kartta yok
    if (typeof window !== 'undefined' && Array.isArray(window.objects)) {
      try {
        window.objects.forEach(function (o) {
          var ck = o && o.opts && o.opts.clinicalKey;
          if (!ck) return;
          if (!resolveCard(ck)
              && !/^ssc-board/.test(ck)
              && !/^pacu-|^postop-|^family-|^analgesia|^drain|^oxygen|^headwall|^documentation|^neuro|^mobilisation|^handoff$/.test(ck)) {
            report.unmappedSceneObjects.push({ clinicalKey: ck });
          }
        });
      } catch (e) {}
    }

    // ── 13. Kartta var, sahnede kullanılmıyor
    var usedKeys = {};
    if (typeof window !== 'undefined' && Array.isArray(window.objects)) {
      try {
        window.objects.forEach(function (o) {
          var ck = o && o.opts && o.opts.clinicalKey;
          if (ck) {
            var card = resolveCard(ck);
            if (card) {
              Object.keys(CARDS).forEach(function (cKey) {
                if (CARDS[cKey] === card) usedKeys[cKey] = true;
              });
            }
          }
        });
        Object.keys(CARDS).forEach(function (cKey) {
          if (!usedKeys[cKey]) report.unusedPopupDefinitions.push({ clinicalKey: cKey, node: CARDS[cKey].node });
        });
      } catch (e) {}
    }

    // ── Console raporu (console.table odaklı)
    try {
      console.groupCollapsed('%c[INTRA_POPUPS v2] Validator raporu (Adım 2)',
        'color:#86dac6;font-weight:600;font-size:12px');

      console.log('%cToplam kart: ' + Object.keys(CARDS).length +
                  ' | Geçerli (eksik alan yok): ' + report.validCards.length +
                  ' | Uyumsuz: ' + report.invalidEvidence.length,
                  'color:#9ed1de');

      // Ana per-card özet tablosu
      if (console.table) console.table(report.cardSummary,
        ['#','clinicalKey','node','taskTag','buttons.ev','checklist.ev','hardStop','durum']);

      // Hata blokları (sadece varsa)
      if (report.invalidEvidence.length) {
        console.warn('▸ INVALID EVIDENCE (buttons.ev veya checklist.ev network ile uyumsuz):');
        if (console.table) console.table(report.invalidEvidence);
      }
      if (report.invalidTaskTag.length) {
        console.warn('▸ INVALID TASKTAG:');
        if (console.table) console.table(report.invalidTaskTag);
      }
      if (report.invalidNode.length) {
        console.warn('▸ INVALID NODE:');
        if (console.table) console.table(report.invalidNode);
      }
      if (report.missingFields.length) {
        console.warn('▸ MISSING FIELDS:');
        if (console.table) console.table(report.missingFields);
      }
      if (report.invalidMcqOptions.length) {
        console.warn('▸ INVALID MCQ:');
        if (console.table) console.table(report.invalidMcqOptions);
      }
      if (report.invalidHardStopSeverity.length) {
        console.warn('▸ HARDSTOP/SEVERITY UYUMSUZ:');
        if (console.table) console.table(report.invalidHardStopSeverity);
      }
      if (report.gcklMappingMismatch.length) {
        console.warn('▸ gcklMapping NODE UYUMSUZ:');
        if (console.table) console.table(report.gcklMappingMismatch);
      }
      if (report.duplicateClinicalKey.length) {
        console.warn('▸ DUPLICATE clinicalKey:');
        if (console.table) console.table(report.duplicateClinicalKey);
      }
      if (report.unmappedSceneObjects.length) {
        console.warn('▸ SAHNEDE VAR, KARTTA YOK:');
        if (console.table) console.table(report.unmappedSceneObjects);
      }
      if (report.unusedPopupDefinitions.length) {
        console.info('▸ KARTTA VAR, SAHNEDE KULLANILMIYOR:');
        if (console.table) console.table(report.unusedPopupDefinitions);
      }

      // Toplu durum özeti
      var totalIssues = report.invalidEvidence.length + report.invalidTaskTag.length +
                        report.invalidNode.length + report.missingFields.length +
                        report.invalidMcqOptions.length + report.invalidHardStopSeverity.length +
                        report.gcklMappingMismatch.length + report.duplicateClinicalKey.length;
      if (totalIssues === 0) {
        console.log('%c✓ Tüm 30 kart network ile %100 uyumlu — kritik sorun bulunamadı',
          'color:#7fe2a3;font-weight:600');
      } else {
        console.warn('%c⚠ Toplam ' + totalIssues + ' kritik sorun bulundu — düzeltme gerekli',
          'color:#f0a0aa;font-weight:600');
      }

      console.groupEnd();
    } catch (e) {
      console.warn('[INTRA_POPUPS] Validator console output err:', e);
    }
    return report;
  }

  function validateIntraopParity() {
    var net = window.IntraopGCKL || null;
    var map = net && typeof net.getMap === 'function' ? net.getMap() : [];
    var nodes = net && typeof net.getAll === 'function' ? net.getAll() : {};
    var rows = [];
    var report = {
      missingCardNode: [],
      invalidCardEvidence: [],
      invalidTaskMapping: [],
      orphanMapEntries: [],
      hardStopWithoutGate: [],
      duplicateRendererClinicalKeys: [],
      legacyOnlyMappings: [],
      cardSummary: rows
    };

    Object.keys(CARDS).forEach(function (clinicalKey) {
      var card = CARDS[clinicalKey];
      var node = nodes[card.node];
      if (!node) report.missingCardNode.push({ clinicalKey: clinicalKey, node: card.node });
      var validEv = node ? (node.requiredEvidence || []) : (NODE_EV[card.node] || []);
      var cardEv = [];
      (card.buttons || []).forEach(function (b) { if (b && b.ev) cardEv.push(b.ev); });
      (card.checklist || []).forEach(function (b) { if (b && b.ev) cardEv.push(b.ev); });
      cardEv.forEach(function (ev) {
        if (validEv.indexOf(ev) < 0) {
          report.invalidCardEvidence.push({ clinicalKey: clinicalKey, node: card.node, ev: ev, validEvidence: validEv.join(',') });
        }
      });
      rows.push({
        clinicalKey: clinicalKey,
        node: card.node,
        taskTag: card.taskTag || '',
        evidence: cardEv.filter(function (ev, i, a) { return a.indexOf(ev) === i; }).join(','),
        validNode: !!node,
        status: node && cardEv.every(function (ev) { return validEv.indexOf(ev) >= 0; }) ? 'ok' : 'check'
      });
    });

    map.forEach(function (entry) {
      var node = nodes[entry.nodeId];
      if (!node) report.orphanMapEntries.push({ mapId: entry.id, nodeId: entry.nodeId, reason: 'node missing' });
      var req = node ? (node.requiredEvidence || []) : [];
      (entry.requiredEvidence || []).forEach(function (ev) {
        if (req.indexOf(ev) < 0) {
          report.invalidTaskMapping.push({ mapId: entry.id, taskId: entry.taskId, nodeId: entry.nodeId, ev: ev, validEvidence: req.join(',') });
        }
      });
      if (entry.hardStop && entry.phaseAdvancementImpact !== 'blocksPostop') {
        report.hardStopWithoutGate.push({ mapId: entry.id, taskId: entry.taskId, nodeId: entry.nodeId, impact: entry.phaseAdvancementImpact });
      }
    });

    Object.keys(nodes).forEach(function (nodeId) {
      var node = nodes[nodeId];
      if (!node || !node.hardStop) return;
      var covered = map.some(function (entry) {
        return entry.nodeId === nodeId && (entry.hardStop || entry.phaseAdvancementImpact === 'blocksPostop');
      });
      if (!covered) report.hardStopWithoutGate.push({ nodeId: nodeId, reason: 'hard-stop node has no blocking map entry' });
    });

    if (window.intraGcklLegacyTagMap) {
      var nodeTags = (typeof LEGACY_NODE_TAGS !== 'undefined' && LEGACY_NODE_TAGS) || NODE_TAGS || {};
      Object.keys(nodeTags).forEach(function (nodeId) {
        var tags = nodeTags[nodeId] || [];
        tags.forEach(function (tag) {
          var covered = map.some(function (entry) {
            return entry.taskId === tag || (entry.legacyTaskTags || []).indexOf(tag) >= 0;
          });
          if (!covered && !window.intraGcklLegacyTagMap[tag]) {
            report.legacyOnlyMappings.push({ nodeId: nodeId, taskTag: tag });
          }
        });
      });
    }

    if (window.renderIntraopGcklNodePopup && !window.__intraGcklPopupFallbackDelegates) {
      Object.keys(CARDS).forEach(function (clinicalKey) {
        report.duplicateRendererClinicalKeys.push({ clinicalKey: clinicalKey, primary: 'renderIntraProtocolCard', fallback: 'renderIntraopGcklNodePopup' });
      });
    }

    try {
      console.groupCollapsed('%c[INTRAOP PARITY] GCKL/card/task validation', 'color:#86dac6;font-weight:700');
      if (console.table) console.table(rows);
      ['missingCardNode','invalidCardEvidence','invalidTaskMapping','orphanMapEntries','hardStopWithoutGate','duplicateRendererClinicalKeys','legacyOnlyMappings'].forEach(function (key) {
        if (report[key].length) {
          console.warn(key + ':');
          if (console.table) console.table(report[key]);
        }
      });
      console.log('summary', {
        cards: Object.keys(CARDS).length,
        mapEntries: map.length,
        missing: report.missingCardNode.length,
        invalidEvidence: report.invalidCardEvidence.length,
        invalidTaskMapping: report.invalidTaskMapping.length,
        duplicateRenderers: report.duplicateRendererClinicalKeys.length
      });
      console.groupEnd();
    } catch (e) {
      console.warn('[INTRAOP PARITY] console report failed', e);
    }
    return report;
  }

  // =================================================================
  //  CSS — ADIM 8: Preop NK136 kart diliyle görsel uyumlanma
  //  - kompakt fontlar (NK136: 12-15px paleti)
  //  - teal tema (var(--teal), var(--ink), var(--ink-mute) kullanılır)
  //  - yumuşak border-radius (11-14px)
  //  - kritik hata kutusu kırmızı sol-bordürlü
  //  - mikro senaryo ayrı teal kutu
  //  - GCKL haritalama grid tablo
  //  - tamamlanmış buton net yeşil
  //  - scrollbar teal ince
  // =================================================================
  function ensureCss() {
    if (document.getElementById('intra-popups-v2-css')) return;
    var s = document.createElement('style');
    s.id = 'intra-popups-v2-css';
    s.textContent = [
      /* ── Kart konteyner ── */
      '#obj-popup.ipv2-host{width:min(390px,calc(100vw - 32px))!important;max-width:calc(100vw - 32px)!important;overflow:hidden!important}',
      '.ipv2,.ipv2 *{box-sizing:border-box;max-width:100%}',
      '.ipv2{font-family:inherit;color:var(--ink,#e8eef2);background:linear-gradient(180deg,rgba(10,24,38,.98),rgba(12,27,42,.98));border:1px solid rgba(92,196,214,.42);border-radius:12px;width:100%;min-width:0;max-height:min(68vh,560px);display:flex;flex-direction:column;box-shadow:0 14px 38px rgba(0,0,0,.43);overflow:hidden;font-size:11.5px;line-height:1.36}',
      '.ipv2.hs-true{border-color:rgba(217,99,113,.55);box-shadow:0 0 0 1px rgba(217,99,113,.28) inset,0 18px 50px rgba(0,0,0,.45)}',
      '.ipv2.hs-cond{border-color:rgba(224,165,88,.50)}',
      '.ipv2.breach{border-color:rgba(217,99,113,.80);box-shadow:0 0 0 2px rgba(217,99,113,.30) inset,0 18px 50px rgba(0,0,0,.45)}',

      /* ── Header (Başlık + Alt başlık + Açıklama + Chip satırı) ── */
      '.ipv2-h{padding:10px 12px 8px;border-bottom:1px solid rgba(92,196,214,.16);background:linear-gradient(180deg,rgba(16,40,58,.50),rgba(11,24,38,.10));position:relative}',
      '.ipv2-cls{position:absolute;top:8px;right:11px;cursor:pointer;color:var(--ink-mute,#7aabb8);font-size:18px;font-weight:600;line-height:1;user-select:none}',
      '.ipv2-cls:hover{color:var(--ink,#e8eef2)}',
      '.ipv2-t{font-size:12.8px;line-height:1.2;letter-spacing:.035em;color:var(--teal,#5cc4d6);font-weight:820;padding-right:22px;text-transform:uppercase;margin:0}',
      '.ipv2-st{margin-top:3px;color:var(--ink-mute,#86b1be);font-size:11px;line-height:1.34;font-weight:600}',
      '.ipv2-d{margin-top:5px;color:var(--ink,#d8e6ec);font-size:11.1px;line-height:1.38;font-weight:500;overflow-wrap:anywhere}',
      '.ipv2-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px;align-items:center}',
      '.ipv2-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;background:rgba(92,196,214,.10);border:1px solid rgba(92,196,214,.24);color:var(--teal,#5cc4d6);font-size:9.8px;font-weight:720;letter-spacing:.02em;line-height:1;white-space:nowrap}',
      '.ipv2-chip.gckl{background:rgba(63,196,128,.10);border-color:rgba(63,196,128,.28);color:var(--green,#7fe2a3)}',
      '.ipv2-chip.hs{background:rgba(217,99,113,.13);border-color:rgba(217,99,113,.36);color:#f0a0aa}',
      '.ipv2-chip.s-pending,.ipv2-chip.s-partial{background:rgba(224,165,88,.10);border-color:rgba(224,165,88,.30);color:var(--amber,#e2c97e)}',
      '.ipv2-chip.s-complete{background:rgba(63,196,128,.12);border-color:rgba(63,196,128,.38);color:var(--green,#7fe2a3)}',
      '.ipv2-chip.s-wrong,.ipv2-chip.s-breach{background:rgba(217,99,113,.13);border-color:rgba(217,99,113,.40);color:#f0a0aa}',
      '.ipv2-chip.score{background:rgba(63,196,128,.10);border-color:rgba(63,196,128,.30);color:var(--green,#7fe2a3)}',

      /* ── Body & scroll ── */
      '.ipv2-b{padding:9px 12px 11px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;flex:1;scrollbar-width:thin;scrollbar-color:rgba(92,196,214,.50) rgba(255,255,255,.05)}',
      '.ipv2-b::-webkit-scrollbar{width:8px}',
      '.ipv2-b::-webkit-scrollbar-track{background:rgba(255,255,255,.045);border-radius:999px}',
      '.ipv2-b::-webkit-scrollbar-thumb{background:rgba(92,196,214,.46);border-radius:999px;border:2px solid rgba(10,24,38,.95)}',
      '.ipv2-b::-webkit-scrollbar-thumb:hover{background:rgba(92,196,214,.70)}',

      /* ── Progress bar ── */
      '.ipv2-prog{display:flex;align-items:center;gap:8px;margin:0 0 8px}',
      '.ipv2-prog-bar{flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:999px;overflow:hidden}',
      '.ipv2-prog-fill{height:100%;background:linear-gradient(90deg,#1a8f73,var(--green,#52d4af));transition:width .25s;border-radius:999px}',
      '.ipv2-prog-txt{font-size:10px;color:var(--ink-mute,#7aabb8);font-weight:720;min-width:48px;text-align:right;white-space:nowrap}',

      /* ── Bölüm başlığı + section konteynerı ── */
      '.ipv2-sec{margin:8px 0 0}',
      '.ipv2-sec-t{font-size:9.8px;text-transform:uppercase;letter-spacing:.075em;color:var(--ink-mute,#7aabb8);font-weight:820;margin-bottom:5px}',
      '.ipv2-secondary{margin-top:8px;border:1px solid rgba(92,196,214,.14);border-radius:10px;background:rgba(255,255,255,.018);overflow:hidden}',
      '.ipv2-secondary summary{cursor:pointer;list-style:none;padding:7px 9px;font-size:9.8px;text-transform:uppercase;letter-spacing:.075em;color:var(--teal,#86dac6);font-weight:820}',
      '.ipv2-secondary summary::-webkit-details-marker{display:none}',
      '.ipv2-secondary[open] summary{border-bottom:1px solid rgba(92,196,214,.14)}',
      '.ipv2-secondary-body{padding:8px 9px}',

      /* ── Rol (teal kutu) ── */
      '.ipv2-role{background:rgba(92,196,214,.07);border:1px solid rgba(92,196,214,.20);border-radius:10px;padding:7px 9px;font-size:11.2px;color:var(--ink,#cfe7ee);line-height:1.38;overflow-wrap:anywhere}',

      /* ── Linked task & GCKL maddesi (dashed teal) ── */
      '.ipv2-link{background:rgba(92,196,214,.05);border:1px dashed rgba(92,196,214,.28);padding:7px 9px;border-radius:10px;font-size:10.8px;color:var(--ink,#9ed1de);line-height:1.38;overflow-wrap:anywhere}',

      /* ── KRİTİK HATA bölümü (kırmızı sol-bordürlü kutu) ── */
      '.ipv2-warn{padding:7px 9px;border-radius:10px;font-size:10.9px;line-height:1.38;border-left:3px solid var(--amber,#e0a558);background:rgba(224,165,88,.08);color:var(--ink,#e0dca0);margin-bottom:5px;overflow-wrap:anywhere}',
      '.ipv2-warn.hs{border-left-color:var(--rose,#d96371);background:rgba(217,99,113,.10);color:#f0b5b0}',
      '.ipv2-warn b{display:block;margin-bottom:3px;font-size:9.8px;letter-spacing:.075em;text-transform:uppercase;color:inherit}',
      '.ipv2-fail{padding:7px 10px;border-radius:11px;font-size:11px;background:rgba(217,99,113,.06);border-left:3px solid rgba(217,99,113,.55);color:#e0a8b3;margin-top:4px;line-height:1.4;overflow-wrap:anywhere}',
      '.ipv2-succ{padding:7px 10px;border-radius:11px;font-size:11px;background:rgba(63,196,128,.06);border-left:3px solid var(--green,#3fc480);color:var(--green,#7fe2a3);margin-top:4px;line-height:1.4;overflow-wrap:anywhere}',
      '.ipv2-fail b,.ipv2-succ b{display:inline;margin-right:3px;font-size:10px;text-transform:none;letter-spacing:.02em}',

      /* ── Prerequisite (ön koşul) ── */
      '.ipv2-prereq{padding:7px 10px;border-radius:11px;font-size:10.8px;background:rgba(224,165,88,.08);border:1px dashed rgba(224,165,88,.30);color:var(--amber,#e2c97e);margin-bottom:7px;line-height:1.4}',
      '.ipv2-prereq.ok{background:rgba(63,196,128,.07);border-color:rgba(63,196,128,.32);color:var(--green,#7fe2a3)}',

      /* ── Klinik not / kanıt ── */
      '.ipv2-evid{font-size:10.5px;color:var(--ink-mute,#7aabb8);margin-top:7px;padding:7px 10px;background:rgba(255,255,255,.025);border-radius:11px;border-left:2px solid rgba(92,196,214,.32);line-height:1.46;overflow-wrap:anywhere}',
      '.ipv2-evid b{color:var(--teal,#86dac6);display:block;font-size:9.5px;text-transform:uppercase;letter-spacing:.075em;margin-bottom:3px;font-weight:820}',
      '.ipv2-evid div{margin-top:2px}',

      /* ── Butonlar (NK136 buton dili) ── */
      '.ipv2-actions{display:grid;grid-template-columns:1fr;gap:5px;margin-top:5px}',
      '.ipv2-btn{display:block;width:100%;padding:7px 9px;background:rgba(92,196,214,.11);border:1px solid rgba(92,196,214,.35);border-radius:10px;color:var(--teal,#5cc4d6);cursor:pointer;font-size:11.2px;font-weight:760;text-align:left;line-height:1.25;transition:background .15s ease,border-color .15s ease,transform .15s ease;font-family:inherit;letter-spacing:.01em;white-space:normal;overflow-wrap:break-word;word-wrap:break-word;hyphens:auto}',
      '.ipv2-btn:hover:not([disabled]){background:rgba(92,196,214,.16);transform:translateY(-1px)}',
      '.ipv2-btn[disabled]{cursor:not-allowed;opacity:.50}',
      '.ipv2-btn.primary{border-color:rgba(217,99,113,.55);background:rgba(217,99,113,.15);color:#ffd7df}',
      '.ipv2-btn.primary:hover:not([disabled]){background:rgba(217,99,113,.22)}',
      '.ipv2-btn.done{border-color:rgba(76,184,138,.50);background:rgba(76,184,138,.14);color:var(--green,#7fe2a3);cursor:default}',
      '.ipv2-btn.done:before{content:"✓ ";font-weight:820;color:var(--green,#3fc480)}',
      '.ipv2-btn.mcq{border-color:rgba(168,127,224,.42);background:rgba(168,127,224,.10);color:#d4bbf0}',
      '.ipv2-btn.mcq:hover:not([disabled]){background:rgba(168,127,224,.16)}',
      '.ipv2-btn.hint{border-color:rgba(204,226,154,.35);background:rgba(204,226,154,.07);color:#cce29a}',
      '.ipv2-btn.hint:hover:not([disabled]){background:rgba(204,226,154,.12)}',
      '.ipv2-btn.stop{background:rgba(217,99,113,.18);border:1px solid rgba(217,99,113,.55);color:#fbd5d5;font-weight:820;margin-top:8px;text-align:center;letter-spacing:.02em}',
      '.ipv2-btn.stop:hover:not([disabled]){background:rgba(217,99,113,.28)}',

      /* ── Mikro senaryo kutusu (ayrı teal kutu) ── */
      '.ipv2-mcq-modal{position:fixed;inset:0;z-index:10050;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(2,8,13,.42)}',
      '.ipv2-mcq-panel{width:min(420px,calc(100vw - 32px));max-height:min(78vh,620px);overflow:auto;background:linear-gradient(180deg,rgba(10,24,38,.99),rgba(12,27,42,.99));border:1px solid rgba(92,196,214,.38);border-radius:12px;box-shadow:0 22px 60px rgba(0,0,0,.52);padding:12px;color:var(--ink,#e8eef2)}',
      '.ipv2-mcq-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px}',
      '.ipv2-mcq-panel-title{font-size:12.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--teal,#5cc4d6);font-weight:820;line-height:1.22}',
      '.ipv2-mcq-close{border:0;background:transparent;color:var(--ink-mute,#7aabb8);font-size:20px;line-height:1;cursor:pointer;padding:0 2px}',
      '.ipv2-mcq{background:rgba(92,196,214,.05);border:1px solid rgba(92,196,214,.22);border-radius:12px;padding:9px 10px;margin-top:5px}',
      '.ipv2-mcq-q{font-size:11.5px;color:var(--ink,#e7f6fa);font-weight:680;margin-bottom:7px;line-height:1.4}',
      '.ipv2-mcq-q b{display:inline-block;font-size:9.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--teal,#5cc4d6);font-weight:820;margin-right:4px;vertical-align:baseline}',
      '.ipv2-mcq-opt{display:block;width:100%;padding:7px 9px;margin:3px 0;background:rgba(255,255,255,.025);border:1px solid rgba(92,196,214,.18);border-radius:10px;color:var(--ink,#cfe7ee);cursor:pointer;font-size:11px;text-align:left;font-family:inherit;line-height:1.36;transition:all .15s;white-space:normal;overflow-wrap:break-word;word-wrap:break-word}',
      '.ipv2-mcq-opt:hover:not([disabled]){background:rgba(92,196,214,.07);border-color:rgba(92,196,214,.34)}',
      '.ipv2-mcq-opt.correct{background:rgba(63,196,128,.10);border-color:rgba(63,196,128,.45);color:#a0e6bd}',
      '.ipv2-mcq-opt.wrong{background:rgba(217,99,113,.10);border-color:rgba(217,99,113,.45);color:#f0a0aa}',
      '.ipv2-mcq-fb{margin-top:7px;padding:7px 9px;border-radius:10px;font-size:11px;line-height:1.42}',
      '.ipv2-mcq-fb.correct{background:rgba(63,196,128,.08);color:#a0e6bd;border-left:3px solid rgba(63,196,128,.55)}',
      '.ipv2-mcq-fb.wrong{background:rgba(217,99,113,.08);color:#f0a0aa;border-left:3px solid rgba(217,99,113,.55)}',

      /* ── AI ipucu kutusu ── */
      '.ipv2-ai{font-size:10.8px;margin-top:7px;color:#cce29a;padding:7px 10px;background:rgba(204,226,154,.07);border-left:3px solid rgba(204,226,154,.35);border-radius:11px;line-height:1.42}',

      /* ── GCKL HARİTALAMA — kompakt tablo gibi grid ── */
      '.ipv2-map{font-size:10.2px;color:var(--ink-mute,#7aabb8);margin-top:0;padding:0;background:transparent;border:0;border-radius:0;line-height:1.45;display:block}',
      '.ipv2-map-t{display:block;font-size:9.5px;text-transform:uppercase;letter-spacing:.075em;color:var(--teal,#86dac6);font-weight:820;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(92,196,214,.16)}',
      '.ipv2-map-grid{display:grid;grid-template-columns:minmax(92px,auto) minmax(0,1fr);gap:3px 9px}',
      '.ipv2-map-grid b{color:var(--ink-mute,#7aabb8);font-size:9.6px;text-transform:uppercase;letter-spacing:.045em;font-weight:720;align-self:start}',
      '.ipv2-map-grid span{color:var(--ink,#cfe7ee);font-size:10.6px;font-weight:600;min-width:0;overflow-wrap:anywhere;word-break:normal}',
      '.ipv2-map-grid span.hs-strict{color:#f0a0aa;font-weight:720}',
      '.ipv2-map-grid span.hs-cond{color:var(--amber,#e2c97e);font-weight:720}',
      '.ipv2-map-grid span.hs-none{color:var(--green,#7fe2a3);font-weight:600}',
      /* ── ADIM 11: Mobil / küçük ekran (spec madde 9) ── */
      '@media (max-width:640px){',
      '  #obj-popup.ipv2-host{width:calc(100vw - 18px)!important;max-width:calc(100vw - 18px)!important}',
      '  .ipv2{width:100%;max-width:none;max-height:min(82dvh,calc(100dvh - 80px));border-radius:14px 14px 0 0;font-size:11.5px}',
      '  .ipv2-h{padding:10px 12px 8px}',
      '  .ipv2-t{font-size:13px;padding-right:24px}',
      '  .ipv2-b{padding:10px 12px 12px}',
      '  .ipv2-btn{padding:9px 10px;font-size:11.5px}',
      '  .ipv2-mcq-opt{padding:8px 10px;font-size:11.5px}',
      '  .ipv2-cls{font-size:20px;top:9px;right:13px;padding:2px 6px}',
      '  .ipv2-map-grid{grid-template-columns:auto 1fr;gap:3px 7px}',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

  // =================================================================
  //  Yardımcılar
  // =================================================================
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }
  function getNet() {
    return (typeof window !== 'undefined' && window.IntraopGCKL) || null;
  }
  function getNodeSnap(nodeId) {
    var net = getNet();
    if (!net || typeof net.compute !== 'function') return null;
    try {
      var snap = net.compute();
      if (!snap || !snap.nodes) return null;
      return snap.nodes[nodeId] || null;
    } catch (e) { return null; }
  }
  function statusLabel(s) {
    return ({ pending:'Bekliyor', partial:'Kısmi', complete:'Tamamlandı',
              wrong:'Hatalı karar', breach:'Bariyer ihlali' })[s] || 'Bekliyor';
  }
  function prereqState(card) {
    if (!card.prerequisites || !card.prerequisites.length) return { ok: true, missing: [] };
    var missing = [];
    card.prerequisites.forEach(function (pNode) {
      // prerequisites artık doğrudan node adı
      var snap = getNodeSnap(pNode);
      if (!snap || snap.status !== 'complete') {
        missing.push(pNode);
      }
    });
    return { ok: missing.length === 0, missing: missing };
  }

  function evidenceLabelFor(card, ev) {
    var sources = [];
    if (card && Array.isArray(card.buttons)) sources = sources.concat(card.buttons);
    if (card && Array.isArray(card.checklist)) sources = sources.concat(card.checklist);
    for (var i = 0; i < sources.length; i++) {
      if (sources[i] && sources[i].ev === ev && sources[i].label) return sources[i].label;
    }
    return String(ev || '').replace(/_/g, ' ');
  }

  function cleanupIntraopPopupHost(host, keepPosition) {
    if (!host) return;
    host.classList.remove('ipv2-host', 'intraop-node-host', 'side-right', 'side-left');
    host.removeAttribute('data-intra-popups-v2');
    host.style.width = '';
    host.style.maxWidth = '';
    host.style.overflow = '';
    if (!keepPosition) {
      host.style.left = '';
      host.style.top = '';
      try { delete host.__intraPopupAnchor; } catch (e) { host.__intraPopupAnchor = null; }
    }
  }

  function closeIntraProtocolCard(host) {
    cleanupIntraopPopupHost(host, false);
    if (host) {
      host.classList.remove('visible');
      host.style.display = 'none';
    }
  }

  function normalizePopupClientPoint(shellRect, x, y) {
    var anchor = (window.__intraV2PopupAnchor && typeof window.__intraV2PopupAnchor.x === 'number')
      ? window.__intraV2PopupAnchor
      : null;
    var px = (typeof x === 'number') ? x : (anchor ? anchor.x : shellRect.left + shellRect.width / 2);
    var py = (typeof y === 'number') ? y : (anchor ? anchor.y : shellRect.top + Math.min(180, shellRect.height / 2));

    // Bazı eski çağrılar x/y değerini zaten scene-shell lokal koordinatı olarak verebiliyor.
    if ((px >= 0 && px <= shellRect.width && py >= 0 && py <= shellRect.height) &&
        (px < shellRect.left || px > shellRect.right || py < shellRect.top || py > shellRect.bottom)) {
      px = shellRect.left + px;
      py = shellRect.top + py;
    }
    return { x: px, y: py };
  }

  function positionPopupNearPoint(host, x, y, preferredWidth) {
    if (!host) return;
    var shell = document.getElementById('scene-shell');
    if (!shell) return;
    var sh = shell.getBoundingClientRect();
    host.classList.remove('side-right', 'side-left');

    var width = Math.min(preferredWidth || 390, Math.max(260, sh.width - 24));
    if (window.innerWidth <= 920) {
      host.style.left = '';
      host.style.top = '';
      window.__intraV2PopupAnchor = normalizePopupClientPoint(sh, x, y);
      return;
    }

    var pt = normalizePopupClientPoint(sh, x, y);
    var localX = pt.x - sh.left;
    var localY = pt.y - sh.top;
    var pad = 12;
    var gap = 14;
    var openRight = true;
    var left = localX + gap;
    var top = localY - 12;

    if (left + width > sh.width - pad) {
      left = localX - width - gap;
      openRight = false;
    }
    if (left < pad) {
      left = Math.max(pad, Math.min(sh.width - width - pad, localX + gap));
      openRight = left >= localX;
    }
    left = Math.max(pad, Math.min(sh.width - width - pad, left));

    var measuredH = host.scrollHeight || host.offsetHeight || 360;
    var estH = Math.min(Math.max(220, measuredH), Math.max(220, sh.height - pad * 2));
    if (top + estH > sh.height - pad) top = sh.height - estH - pad;
    if (top < pad) top = pad;

    host.style.left = Math.round(left) + 'px';
    host.style.top = Math.round(top) + 'px';
    host.classList.add(openRight ? 'side-right' : 'side-left');
    window.__intraV2PopupAnchor = { x: pt.x, y: pt.y };
    host.__intraPopupAnchor = window.__intraV2PopupAnchor;
  }

  function openIntraopMcqPanel(card, nodeId) {
    ensureCss();
    var sc = card && card.microScenario;
    if (!sc) return;
    var old = document.getElementById('intraop-mcq-modal');
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var snap = getNodeSnap(nodeId);
    var answered = !!(snap && typeof snap.rationaleAnswer === 'number');
    var correctIndex = sc.correctIndex;
    var html = '';
    html += '<div class="ipv2-mcq-panel" role="dialog" aria-modal="true">';
    html += '<div class="ipv2-mcq-panel-head">';
    html += '<div class="ipv2-mcq-panel-title">' + esc(sc.title || 'Mikro senaryo + karar sorusu') + '</div>';
    html += '<button class="ipv2-mcq-close" type="button" data-close-mcq="1">×</button>';
    html += '</div>';
    html += '<div class="ipv2-mcq">';
    html += '<div class="ipv2-mcq-q"><b>Senaryo:</b> ' + esc(sc.scenarioText || '') + '<br><b>Soru:</b> ' + esc(sc.questionText || '') + '</div>';
    (sc.options || []).forEach(function (opt, idx) {
      var cls = '';
      if (answered) {
        if (idx === correctIndex) cls = ' correct';
        else if (idx === snap.rationaleAnswer) cls = ' wrong';
      }
      html += '<button class="ipv2-mcq-opt' + cls + '" data-mcq-option="' + idx + '"' + (answered ? ' disabled' : '') + '>' + esc(opt) + '</button>';
    });
    if (answered) {
      var ok = snap.rationaleAnswer === correctIndex;
      html += '<div class="ipv2-mcq-fb ' + (ok ? 'correct' : 'wrong') + '">' + esc(ok ? sc.correctFeedback : sc.wrongFeedback) + '</div>';
    } else {
      html += '<div class="ipv2-mcq-fb" data-mcq-feedback style="display:none"></div>';
    }
    html += '</div></div>';

    var modal = document.createElement('div');
    modal.id = 'intraop-mcq-modal';
    modal.className = 'ipv2-mcq-modal';
    modal.innerHTML = html;
    modal.onclick = function (ev) {
      var close = ev.target && ev.target.closest && ev.target.closest('[data-close-mcq]');
      if (close || ev.target === modal) {
        modal.remove();
        return;
      }
      var optBtn = ev.target && ev.target.closest && ev.target.closest('[data-mcq-option]');
      if (!optBtn || optBtn.disabled) return;
      var idx = +optBtn.dataset.mcqOption;
      var result = null;
      if (typeof window.intraGcklAnswerRationale === 'function') {
        result = window.intraGcklAnswerRationale(nodeId, idx);
      } else {
        var net = getNet();
        if (net && typeof net.answerRationale === 'function') result = net.answerRationale(nodeId, idx);
      }
      refreshIntraopGcklViews('mcq:option' + idx);
      var ok = result && typeof result.ok === 'boolean' ? result.ok : idx === correctIndex;
      modal.querySelectorAll('[data-mcq-option]').forEach(function (b) {
        b.disabled = true;
        var bi = +b.dataset.mcqOption;
        if (bi === correctIndex) b.classList.add('correct');
        else if (bi === idx && !ok) b.classList.add('wrong');
      });
      var fb = modal.querySelector('[data-mcq-feedback]');
      if (fb) {
        fb.style.display = 'block';
        fb.className = 'ipv2-mcq-fb ' + (ok ? 'correct' : 'wrong');
        fb.textContent = ok ? (sc.correctFeedback || 'Doğru karar.') : (sc.wrongFeedback || 'Yanlış karar; güvenlik bariyeri ihlali oluştu.');
      }
    };
    document.body.appendChild(modal);
  }

  // =================================================================
  //  ADIM 3: refreshIntraopGcklViews(reason)
  //  Evidence/MCQ/stop sonrası tek state kaynağından (IntraopGCKL.compute)
  //  tüm intraop görünümlerini senkronize eder. Her hedef ayrı try/catch
  //  bloğunda — biri eksik veya hata verse diğerleri yine güncellenir.
  //
  //  Hedefler:
  //    1. renderRightPanel        — sağ görev paneli (intraop görev listesi)
  //    2. updateProgressBar       — üst faz progress
  //    3. updateScoreStrip        — skor şeridi
  //    4. gcklBoardSyncMarkerState — GCKL pano marker'ları
  //    5. IntraopGcklReport.inject — debrief rapor injektörü
  //
  //  reason: 'evidence' | 'mcq' | 'stop' | 'init' | '...'  (log/diagnostik için)
  // =================================================================
  function refreshIntraopGcklViews(reason) {
    var label = '[REFRESH] ' + (reason || 'unknown');
    var ok = 0, skipped = 0, failed = 0;

    // 1. Sağ görev paneli
    try {
      if (typeof window.renderRightPanel === 'function') {
        window.renderRightPanel();
        ok++;
      } else if (typeof renderRightPanel === 'function') {
        renderRightPanel();
        ok++;
      } else { skipped++; }
    } catch (e) { failed++; console.warn(label + ' renderRightPanel err', e); }

    // 2. Progress bar
    try {
      if (typeof window.updateProgressBar === 'function') {
        window.updateProgressBar();
        ok++;
      } else if (typeof updateProgressBar === 'function') {
        updateProgressBar();
        ok++;
      } else { skipped++; }
    } catch (e) { failed++; console.warn(label + ' updateProgressBar err', e); }

    // 3. Skor şeridi
    try {
      if (typeof window.updateScoreStrip === 'function') {
        window.updateScoreStrip();
        ok++;
      } else if (typeof updateScoreStrip === 'function') {
        updateScoreStrip();
        ok++;
      } else { skipped++; }
    } catch (e) { failed++; console.warn(label + ' updateScoreStrip err', e); }

    // 4. GCKL pano marker senkron
    try {
      if (typeof window.gcklBoardSyncMarkerState === 'function') {
        window.gcklBoardSyncMarkerState();
        ok++;
      } else if (typeof gcklBoardSyncMarkerState === 'function') {
        gcklBoardSyncMarkerState();
        ok++;
      } else { skipped++; }
    } catch (e) { failed++; console.warn(label + ' gcklBoardSyncMarkerState err', e); }

    // 5. Debrief rapor injektörü (varsa)
    try {
      if (window.IntraopGcklReport && typeof window.IntraopGcklReport.inject === 'function') {
        window.IntraopGcklReport.inject();
        ok++;
      } else { skipped++; }
    } catch (e) { failed++; console.warn(label + ' IntraopGcklReport.inject err', e); }

    console.log('%c' + label + ' tamamlandı — ok:%d skipped:%d failed:%d',
      'color:#86dac6', ok, skipped, failed);
  }
  // Window'a expose (debugging + diğer modüller çağırabilsin)
  try { if (typeof window !== 'undefined') window.refreshIntraopGcklViews = refreshIntraopGcklViews; } catch (e) {}

  // =================================================================
  //  TEK ORTAK RENDER FONKSİYONU
  //  Spec madde: "renderIntraProtocolCard tek ortak şablon olacak."
  // =================================================================
  function renderIntraProtocolCard(card, clinicalKey, obj, x, y) {
    ensureCss();
    var host = document.getElementById('obj-popup');
    if (!host) return false;

    var nodeId = card.node;
    var snap = getNodeSnap(nodeId);
    var status = (snap && snap.status) || 'pending';
    var breach = !!(snap && snap.barrierBreach);
    var rawEv = (snap && (snap.evidenceCollected || snap.evidenceMap || snap.evidence)) || {};
    var evState = Array.isArray(rawEv)
      ? rawEv.reduce(function (acc, key) { acc[key] = true; return acc; }, {})
      : rawEv;

    var net = getNet();
    var nodeDef = net && typeof net.getNode === 'function' ? net.getNode(nodeId) : null;
    var requiredEvs = (nodeDef && Array.isArray(nodeDef.requiredEvidence) && nodeDef.requiredEvidence.length)
      ? nodeDef.requiredEvidence.slice()
      : (NODE_EV[nodeId] || []).slice();
    var doneCount = requiredEvs.reduce(function (a, e) { return a + (evState[e] ? 1 : 0); }, 0);
    var pct = requiredEvs.length ? Math.round(doneCount / requiredEvs.length * 100) : 0;

    var maxScore = NODE_SCORE[nodeId] || 0;
    var earned = (snap && snap.scoreEarned) || 0;

    var prereq = prereqState(card);

    var hsClass = (card.hardStop === true) ? 'hs-true' : (card.hardStop === 'conditional' ? 'hs-cond' : '');

    var h = '';
    h += '<div class="ipv2 ' + hsClass + (breach ? ' breach' : '') + '">';

    // ── HEADER ──
    h += '<div class="ipv2-h">';
    h += '<span class="ipv2-cls oclose">×</span>';
    h += '<div class="ipv2-t">' + esc(card.title) + '</div>';
    if (card.subtitle) h += '<div class="ipv2-st">' + esc(card.subtitle) + '</div>';
    if (card.desc)     h += '<div class="ipv2-d">'  + esc(card.desc)     + '</div>';
    h += '<div class="ipv2-chips">';
    (card.chips || []).forEach(function (c) {
      var cls = 'ipv2-chip' + (/hard/i.test(c) ? ' hs' : (/who|gckl|aorn/i.test(c) ? ' gckl' : ''));
      h += '<span class="' + cls + '">' + esc(c) + '</span>';
    });
    h += '<span class="ipv2-chip s-' + (breach ? 'breach' : status) + '">' + esc(statusLabel(breach ? 'breach' : status)) + '</span>';
    if (maxScore) h += '<span class="ipv2-chip score">' + earned + '/' + maxScore + ' puan</span>';
    if (card.hardStop === true) h += '<span class="ipv2-chip hs">HARD-STOP</span>';
    else if (card.hardStop === 'conditional') h += '<span class="ipv2-chip hs">HARD-STOP (cond.)</span>';
    h += '</div></div>';

    // ── BODY ──
    h += '<div class="ipv2-b">';

    // Progress
    if (requiredEvs.length) {
      h += '<div class="ipv2-prog">';
      h += '<div class="ipv2-prog-bar"><div class="ipv2-prog-fill" style="width:' + pct + '%"></div></div>';
      h += '<div class="ipv2-prog-txt">' + doneCount + '/' + requiredEvs.length + '</div>';
      h += '</div>';
    }

    // Prerequisites
    if (card.prerequisites && card.prerequisites.length) {
      h += '<div class="ipv2-prereq' + (prereq.ok ? ' ok' : '') + '">';
      h += '<b>Ön koşul:</b> ' + (prereq.ok ? 'Önceki güvenlik adımları tamamlandı.' :
                                              'Önce tamamlanmalı: ' + esc(prereq.missing.join(', ')));
      h += '</div>';
    }

    if (requiredEvs.length) {
      h += '<div class="ipv2-sec"><div class="ipv2-sec-t">Evidence Checklist</div>';
      h += '<div class="ipv2-actions">';
      requiredEvs.forEach(function (evKey) {
        var done = !!evState[evKey];
        var cls = 'ipv2-btn' + (done ? ' done' : '');
        var disabled = (!prereq.ok || done);
        var label = evidenceLabelFor(card, evKey);
        h += '<button class="' + cls + '" data-ev="' + esc(evKey) + '"' + (disabled ? ' disabled' : '') + '>' +
          esc(done ? ('Doğrulandı · ' + label) : label) + '</button>';
      });
      h += '</div></div>';
    }

    // Rol
    h += '<div class="ipv2-sec"><div class="ipv2-sec-t">Rol / Görev Sorumluluğu</div>';
    h += '<div class="ipv2-role">' + esc(card.role) + '</div></div>';

    // GCKL maddesi
    if (card.gcklItem) {
      h += '<div class="ipv2-sec"><div class="ipv2-sec-t">GCKL Maddesi</div>';
      h += '<div class="ipv2-link">' + esc(card.gcklItem) + '</div></div>';
    }

    // Bağlı görev
    if (card.linkedTask) {
      h += '<div class="ipv2-sec"><div class="ipv2-sec-t">Bağlı Öğrenme Görevi</div>';
      h += '<div class="ipv2-link">' + esc(card.linkedTask) + '</div></div>';
    }

    // KRİTİK HATA (warning + failureMode + successCriteria)
    h += '<div class="ipv2-sec"><div class="ipv2-sec-t">Kritik Hata Riski</div>';
    h += '<div class="ipv2-warn' + (card.hardStop === true ? ' hs' : '') + '">';
    h += '<b>' + (card.hardStop === true ? 'Hard-Stop' : (card.hardStop === 'conditional' ? 'Hard-Stop (koşullu)' : 'Dikkat')) + '</b>';
    h += esc(card.warning);
    h += '</div>';
    if (card.failureMode)     h += '<div class="ipv2-fail"><b>Başarısızlık deseni:</b> ' + esc(card.failureMode) + '</div>';
    if (card.successCriteria) h += '<div class="ipv2-succ"><b>Başarı kriteri:</b> ' + esc(card.successCriteria) + '</div>';
    h += '</div>';

    // MCQ + hint butonları
    var hasMcq = !!card.microScenario;
    h += '<div class="ipv2-sec"><div class="ipv2-actions">';
    if (hasMcq) {
      h += '<button class="ipv2-btn mcq" data-mcq-toggle="1">🎭  Mikro senaryo + karar sorusu</button>';
    }
    h += '<button class="ipv2-btn hint" data-hint="1">✨  Hastaya özel klinik ipucu al</button>';
    h += '</div></div>';

    // Stop bonus butonu (hard-stop kartlar, henüz tamamlanmamış)
    if ((card.hardStop === true || card.hardStop === 'conditional') && snap && !snap.stopAwarded && status !== 'complete') {
      h += '<button class="ipv2-btn stop" data-stop="1">⛔ Güvenli olmadığı için SÜRECİ DURDURUYORUM (stop bonus +2)</button>';
    }

    // AI sonuç kutusu
    h += '<div class="ipv2-ai" id="ipv2-ai-' + esc(nodeId) + '" style="display:none"></div>';

    // Klinik Not / Kanıt Gerekçesi
    if (card.clinicalEvidence) {
      h += '<details class="ipv2-secondary"><summary>Klinik Not / Kanıt Gerekçesi</summary><div class="ipv2-secondary-body"><div class="ipv2-evid">';
      h += '<b>Klinik Not / Kanıt Gerekçesi</b>';
      h += '<div><b>Kaynak:</b> ' + esc(card.clinicalEvidence.source || '—') + '</div>';
      if (card.clinicalEvidence.note) h += '<div style="margin-top:3px">' + esc(card.clinicalEvidence.note) + '</div>';
      h += '</div></div></details>';
    }

    // GCKL HARİTALAMA — ADIM 8: kompakt tablo (grid) gösterim
    if (card.gcklMapping) {
      var m = card.gcklMapping;
      var hsLabel, hsClass;
      if (m.hardStop === true) { hsLabel = 'Evet (kesin)'; hsClass = 'hs-strict'; }
      else if (m.hardStop === 'conditional') { hsLabel = 'Koşullu'; hsClass = 'hs-cond'; }
      else { hsLabel = 'Hayır'; hsClass = 'hs-none'; }

      h += '<details class="ipv2-secondary"><summary>GCKL Haritalama</summary><div class="ipv2-secondary-body"><div class="ipv2-map">';
      h += '<div class="ipv2-map-grid">';
      h += '<b>Node</b><span>' + esc(m.node || '—') + '</span>';
      h += '<b>Task tag</b><span>' + esc(m.taskTag || '—') + '</span>';
      h += '<b>clinicalKey</b><span>' + esc(clinicalKey || '—') + '</span>';
      h += '<b>GCKL maddesi</b><span>' + esc(m.gcklItem || '—') + '</span>';
      h += '<b>Puan ağırlığı</b><span>' + (m.scoreWeight || 0) + '</span>';
      h += '<b>Hard-stop</b><span class="' + hsClass + '">' + esc(hsLabel) + '</span>';
      h += '</div></div></div></details>';
    }

    h += '</div>'; // body
    h += '</div>'; // card

    host.innerHTML = h;
    host.style.display = 'block';
    cleanupIntraopPopupHost(host, true);
    host.classList.add('ipv2-host');
    host.setAttribute('data-intra-popups-v2', '1');
    host.style.width = 'min(390px, calc(100vw - 32px))';
    host.style.maxWidth = 'calc(100vw - 32px)';
    host.style.overflow = 'hidden';
    host.classList.add('visible');
    positionPopupNearPoint(host, x, y, 390);

    // Event delegation
    host.onclick = function (ev) {
      var t = ev.target;
      if (!t) return;

      if (t.classList && (t.classList.contains('oclose') || t.classList.contains('ipv2-cls'))) {
        closeIntraProtocolCard(host);
        return;
      }

      var btn = t.closest && t.closest('[data-ev],[data-stop],[data-mcq-toggle],[data-hint]');
      if (!btn) return;

      var net = getNet();
      if (!net) return;

      if (btn.dataset.ev && net.markEvidence) {
        if (!prereq.ok) {
          alert('Önce tamamlanması gereken adımlar var:\n• ' + prereq.missing.join('\n• '));
          return;
        }
        if (typeof window.intraGcklOnEvidence === 'function') {
          window.intraGcklOnEvidence(nodeId, btn.dataset.ev, obj || { opts: { clinicalKey: clinicalKey } });
        } else {
          net.markEvidence(nodeId, btn.dataset.ev);
        }
        try { showSceneReaction && showSceneReaction(card.title + ': adım kaydedildi.', 'ok'); } catch(e) {}
        refreshIntraopGcklViews('evidence:' + btn.dataset.ev);
        renderIntraProtocolCard(card, clinicalKey, obj, null, null);
        return;
      }

      if (btn.dataset.mcqToggle) {
        openIntraopMcqPanel(card, nodeId);
        return;
      }

      if (btn.dataset.hint) {
        var aiBox = host.querySelector('.ipv2-ai');
        if (!aiBox) return;
        aiBox.style.display = 'block';
        aiBox.textContent = '✨ Analiz ediliyor...';
        var prompt = card.aiHintPrompt || ('Klinik kart: ' + card.title + '. 1 cümle ipucu ver.');
        if (typeof callGeminiAPI === 'function') {
          try {
            var pat = (typeof App !== 'undefined' && App.currentPatient) || {};
            var full = 'Hasta: ' + (pat.name || '?') + ' (' + (pat.surgery || '?') + '). ' + prompt + ' Türkçe, öğrenci hemşireye uygun, 1-2 cümle, GCKL odaklı.';
            callGeminiAPI(full).then(function (r) { aiBox.innerHTML = '<b>✨ İpucu:</b> ' + r; })
                               .catch(function () { aiBox.textContent = '✨ İpucu alınamadı.'; });
          } catch (e) { aiBox.textContent = '✨ İpucu alınamadı.'; }
        } else {
          aiBox.innerHTML = '<b>✨ İpucu:</b> ' + esc(card.warning || card.role || card.desc || '');
        }
        return;
      }

      if (btn.dataset.stop && net.markCorrectStop) {
        net.markCorrectStop(nodeId);
        try { showSceneReaction && showSceneReaction(card.title + ': güvenli durdurma kararı (+2 bonus).', 'ok'); } catch(e) {}
        refreshIntraopGcklViews('stop:' + nodeId);
        renderIntraProtocolCard(card, clinicalKey, obj, null, null);
        return;
      }
    };

    return true;
  }

  // =================================================================
  //  PUBLIC API
  // =================================================================
  window.INTRA_POPUPS = CARDS;
  window.INTRA_POPUPS_ALIAS = KEY_ALIAS;
  window.resolveIntraCard = resolveCard;
  window.renderIntraProtocolCard = renderIntraProtocolCard;
  window.cleanupIntraopPopupHost = cleanupIntraopPopupHost;
  window.positionPopupNearPoint = positionPopupNearPoint;
  window.openIntraopMcqPanel = openIntraopMcqPanel;
  window.validateIntraPopups = validateIntraPopups;
  window.validateIntraopParity = validateIntraopParity;
  window.IntraPopups = window.IntraPopups || {};
  window.IntraPopups.resolveIntraCard = resolveCard;
  window.IntraPopups.renderIntraProtocolCard = renderIntraProtocolCard;
  window.IntraPopups.cleanupPopupHost = cleanupIntraopPopupHost;
  window.IntraPopups.positionPopupNearPoint = positionPopupNearPoint;
  window.IntraPopups.openMcqPanel = openIntraopMcqPanel;
  window.IntraPopups.validateIntraPopups = validateIntraPopups;
  window.IntraPopups.validateIntraopParity = validateIntraopParity;
  window.__INTRA_POPUPS_V2_ACTIVE = true;

  // =================================================================
  //  showObjPopup hook — ADIM 1: AÇIK YÖNLENDİRME
  //  Mimari sözleşme:
  //    INTRA_POPUPS      = kart içeriği (içerik kaynağı)
  //    IntraopGCKL       = state / evidence / MCQ / puan motoru
  //    showObjPopup      = yalnız yönlendirici (router)
  //    renderIntraProtocolCard      = ana intraop kart şablonu (primary)
  //    renderIntraopGcklNodePopup   = sadece fallback (v2 kart yoksa)
  //
  //  İki kurulum yapılır:
  //   (1) installHook       — DOMContentLoaded sonrası v2 inner wrapper
  //   (2) installOutermost  — +3 sn sonra v2'yi zincirin EN DIŞINA taşır
  //  Böylece nk136/nk139/nk141/nk955 sırası ne olursa olsun, intraop için
  //  ilk karar v2'de verilir.
  // =================================================================
  function installHook() {
    if (typeof window.showObjPopup !== 'function') return false;
    if (window.__INTRA_POPUPS_V2_HOOK) return true;
    var prev = window.showObjPopup;
    window.showObjPopup = function (obj, x, y) {
      try {
        var room = (window.App && window.App.currentRoom) || '';
        var ck = (obj && obj.opts && obj.opts.clinicalKey) || (obj && obj.clinicalKey) || '';
        if (room === 'intraop' && ck && !/^ssc-board/.test(ck)) {
          var card = resolveCard(ck);
          if (card) {
            console.log('[ROUTER] intraop %s → resolveIntraCard ✓ → renderIntraProtocolCard (inner)', ck);
            if (renderIntraProtocolCard(card, ck, obj, x, y)) {
              try { var hi = document.getElementById('obj-popup'); if (hi) hi.setAttribute('data-intra-popups-v2', '1'); } catch (e) {}
              return;
            }
            console.warn('[ROUTER] renderIntraProtocolCard false döndü (inner) — fallback zincirine geçiliyor', ck);
          } else {
            console.warn('[ROUTER] intraop %s → resolveIntraCard ✗ → legacy fallback (inner)', ck);
          }
        }
      } catch (e) {
        console.warn('[INTRA_POPUPS] inner hook err', e);
      }
      try { cleanupIntraopPopupHost(document.getElementById('obj-popup'), false); } catch (e) {}
      return prev.apply(this, arguments);
    };
    window.__INTRA_POPUPS_V2_HOOK = true;
    window.showObjPopup.__intraPopupsV2 = true;
    console.log('[INTRA_POPUPS] v2 INNER hook kuruldu — kart sayısı:', Object.keys(CARDS).length, 'alias:', Object.keys(KEY_ALIAS).length);
    return true;
  }

  // İkinci kurulum: nk136/nk139/nk141/nk955 sarılıp bittikten sonra v2'yi
  // zincirin EN DIŞINA (outermost) taşır. Bu intraop yönlendirmesinin
  // wrapper sırasına bağımlı olmadan tek karar noktasında kalmasını garanti eder.
  function installOutermost() {
    if (typeof window.showObjPopup !== 'function') return;
    if (window.showObjPopup.__INTRA_POPUPS_V2_OUTER) return;
    var inner = window.showObjPopup;
    window.showObjPopup = function (obj, x, y) {
      try {
        var room = (window.App && window.App.currentRoom) || '';
        var ck = (obj && obj.opts && obj.opts.clinicalKey) || (obj && obj.clinicalKey) || '';
        if (room === 'intraop' && ck && !/^ssc-board/.test(ck)) {
          var card = resolveCard(ck);
          if (card) {
            console.log('[ROUTER] intraop %s → resolveIntraCard ✓ → renderIntraProtocolCard (OUTERMOST)', ck);
            if (renderIntraProtocolCard(card, ck, obj, x, y)) {
              try {
                var host = document.getElementById('obj-popup');
                if (host) host.setAttribute('data-intra-popups-v2', '1');
              } catch (e) {}
              return; // ZİNCİR SONLANIR — eski intra-gckl hook çalışmaz
            }
            console.warn('[ROUTER] renderIntraProtocolCard false döndü (outer) — fallback', ck);
          } else {
            console.warn('[ROUTER] intraop %s → resolveIntraCard ✗ → legacy fallback (outer)', ck);
          }
        }
      } catch (e) { console.warn('[INTRA_POPUPS] outer hook err', e); }
      // v2 sahibi değil → zincirin altına bırak (fallback path)
      try {
        cleanupIntraopPopupHost(document.getElementById('obj-popup'), false);
      } catch (e) {}
      return inner.apply(this, arguments);
    };
    window.showObjPopup.__INTRA_POPUPS_V2_OUTER = true;
    window.showObjPopup.__intraPopupsV2 = true;
    console.log('[INTRA_POPUPS] v2 OUTERMOST kuruldu — zincirin en dışı (artık intraop router)');
  }

  function waitAndInstall() {
    if (installHook()) {
      setTimeout(function () { try { validateIntraPopups(); } catch (e) {} }, 1500);
      setTimeout(installOutermost, 3000);
      return;
    }
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (installHook() || tries > 60) {
        clearInterval(iv);
        if (window.__INTRA_POPUPS_V2_HOOK) {
          setTimeout(function () { try { validateIntraPopups(); } catch (e) {} }, 1500);
          setTimeout(installOutermost, 3000);
        }
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitAndInstall);
  } else {
    waitAndInstall();
  }

})();
/* ===== End INTRA_POPUPS v2 patch ===== */
