/* ===== Inlined from pre-gckl-network.js ===== */
/* =====================================================================
   PRE_GCKL_NETWORK — Preoperatif GCKL Ağ Tabanlı Puanlama Motoru
   Toplam: 100 puan (preop fazı bağımsız)
   - Kritik Güvenlik:    45p (6 düğüm — hardStop)
   - Klinik Hazırlık:    30p (6 düğüm)
   - İletişim/Eğitim:    15p (3 düğüm)
   - Akıl Yürütme Bonus: 10p (gerekçelendirme MCQ)
   ===================================================================== */
(function (global) {
  'use strict';

  // ---------- DÜĞÜM TANIMLARI ----------
  // Her düğümde:
  //   id, label, gcklItem, category (criticalSafety|clinicalPrep|communication),
  //   weight, criticalLevel (hardStop|high|medium|low), prerequisites[], unlocks[],
  //   linkedObjects[], requiredEvidence[], rationaleQuestion, correctAnswer,
  //   wrongAnswers[{text,critical}], criticalErrorIfWrong, scoreImpact{correct,incomplete,wrong,hardStop},
  //   feedback{correct,wrong}, stopBonus (doğru durdurma bonusu)
  const NODES = {
    identity: {
      label: 'Kimlik doğrulama',
      gcklItem: 'GCKL · Doğru hasta / doğru işlem doğrulaması',
      category: 'criticalSafety',
      weight: 8,
      criticalLevel: 'hardStop',
      prerequisites: [],
      unlocks: ['consent', 'site', 'allergy'],
      linkedObjects: ['patient-wristband', 'patient-file', 'preop-gckl-board'],
      requiredEvidence: [
        'Hasta adı–soyadı doğrulandı',
        'MRN/protokol bileklik ile karşılaştırıldı',
        'Dosya ve ameliyat listesi uyumu kontrol edildi'
      ],
      rationaleQuestion: 'Hasta adını söyler ancak bileklik ve dosyadaki MRN uyuşmuyor. İlk yapılması gereken nedir?',
      correctAnswer: 'Transferi durdurur, kimliği bileklik–dosya–ameliyat listesi üzerinden yeniden doğrular ve uyumsuzluğu ekibe bildirir.',
      wrongAnswers: [
        { text: 'Hasta adını söylediği için transferi sürdürür.', critical: true },
        { text: 'Ameliyathane ekibi nasılsa kontrol eder diyerek bekler.', critical: true },
        { text: 'Sadece hasta yakınına sorarak doğrulamayı tamamlar.', critical: true }
      ],
      criticalErrorIfWrong: true,
      scoreImpact: { correct: 8, incomplete: 4, wrong: -8, hardStop: true },
      stopBonus: 2,
      feedback: {
        correct: 'Kimlik bariyeri doğru kuruldu. Yanlış hasta/işlem riski engellendi.',
        wrong: 'Kimlik uyumsuzluğu yanlış hasta/yanlış işlemin tek bariyeri olabilir; sözel doğrulama tek başına yetersizdir.'
      }
    },

    consent: {
      label: 'Cerrahi onam doğrulama',
      gcklItem: 'GCKL · Cerrahi rıza ve planlanan işlem doğrulaması',
      category: 'criticalSafety',
      weight: 7,
      criticalLevel: 'hardStop',
      prerequisites: ['identity'],
      unlocks: ['site'],
      linkedObjects: ['consent-form', 'patient-file'],
      requiredEvidence: [
        'CABG için imzalı onam mevcut',
        'Onamdaki işlem adı plan ile aynı',
        'Onam dosyada erişilebilir'
      ],
      rationaleQuestion: 'Onam formunda işlem adı eksik veya belirsizse ne yapılmalıdır?',
      correctAnswer: 'Transfer durdurulur; cerrahi ekip ve sorumlu hekim bilgilendirilir, onam açıklığa kavuşturulmadan hasta gönderilmez.',
      wrongAnswers: [
        { text: 'CABG planlandığı için formdaki eksik ifade sorun olmaz.', critical: true },
        { text: 'Hasta sözlü razı olduğunu söylediği için yeterlidir.', critical: true },
        { text: 'Eksikliği postop dönemde kayda geçirmek yeterlidir.', critical: true }
      ],
      criticalErrorIfWrong: true,
      scoreImpact: { correct: 7, incomplete: 3, wrong: -7, hardStop: true },
      stopBonus: 2,
      feedback: {
        correct: 'Onam yalnızca imza değil; doğru işlem belgesidir. Bariyer korundu.',
        wrong: 'Belirsiz onamla transfer hukuki ve klinik bariyer ihlalidir.'
      }
    },

    site: {
      label: 'Cerrahi taraf/bölge doğrulama',
      gcklItem: 'GCKL · Doğru cerrahi bölge / prosedür doğrulaması',
      category: 'criticalSafety',
      weight: 7,
      criticalLevel: 'hardStop',
      prerequisites: ['identity', 'consent'],
      unlocks: ['skinPrep'],
      linkedObjects: ['site-mark-card', 'patient-file', 'skin-prep-area'],
      requiredEvidence: [
        'Sternotomi planı doğrulandı',
        'Greft alanı (safen ven) ekstremitesi belirlendi',
        'İşaretleme hasta uyanıkken yapıldı'
      ],
      rationaleQuestion: 'Hasta CABG olacak; safen ven grefti için bacak hazırlığı planlanmış. Hemşire hangi doğrulamayı yapmalıdır?',
      correctAnswer: 'Ana işlem ve greft alanı; cerrahi plan, dosya ve ekip bildirimiyle birlikte doğrulanır; belirsizlik varsa transfer durdurulur.',
      wrongAnswers: [
        { text: 'CABG sternotomi olduğu için ekstremite hazırlığı önemli değildir.', critical: true },
        { text: 'Sadece ana ameliyat adı kontrol edilir.', critical: false },
        { text: 'Greft alanı intraopta belli olur, doğrulamaya gerek yok.', critical: true }
      ],
      criticalErrorIfWrong: true,
      scoreImpact: { correct: 7, incomplete: 3, wrong: -7, hardStop: true },
      stopBonus: 2,
      feedback: {
        correct: 'CABG\'de ana işlem + greft alanı birlikte doğrulanmalıdır.',
        wrong: 'Yanlış taraf cerrahisi önlenebilir ama yıkıcı bir hatadır; greft alanı planın parçasıdır.'
      }
    },

    allergy: {
      label: 'Alerji ve risk bilekliği',
      gcklItem: 'GCKL · Bilinen alerji/risklerin ekipçe bilinmesi',
      category: 'criticalSafety',
      weight: 7,
      criticalLevel: 'hardStop',
      prerequisites: ['identity'],
      unlocks: ['medRecon'],
      linkedObjects: ['allergy-wristband', 'patient-file', 'med-prep-card'],
      requiredEvidence: [
        'İlaç, lateks, antiseptik, kan ürünü reaksiyonu sorgulandı',
        'Hasta beyanı ile dosya kaydı eşleşti',
        'Kırmızı bileklik kontrol edildi'
      ],
      rationaleQuestion: 'Hasta "alerjim yok" diyor ancak dosyada antibiyotik alerjisi kayıtlı. Ne yapılmalıdır?',
      correctAnswer: 'Uyumsuzluk durdurucu güvenlik uyarısı kabul edilir; alerji yeniden doğrulanır ve ekip bilgilendirilir.',
      wrongAnswers: [
        { text: 'Hastanın son beyanı esas alınır, dosya kaydı atlanır.', critical: true },
        { text: 'Antibiyotik ameliyathanede verileceği için preopta işlem yapılmaz.', critical: true },
        { text: 'Alerji bilekliği yoksa risk yok kabul edilir.', critical: true }
      ],
      criticalErrorIfWrong: true,
      scoreImpact: { correct: 7, incomplete: 3, wrong: -7, hardStop: true },
      stopBonus: 2,
      feedback: {
        correct: 'Alerji bilgisi hasta–dosya–bileklik üçlüsünde tutarlı olmalı.',
        wrong: 'Anafilaksi, geç kalınmış uyarının en pahalı sonucudur.'
      }
    },

    labImaging: {
      label: 'NPO, laboratuvar ve görüntüleme',
      gcklItem: 'GCKL · Hastanın ameliyata hazır oluşunun doğrulanması',
      category: 'clinicalPrep',
      weight: 6,
      criticalLevel: 'high',
      prerequisites: ['identity'],
      unlocks: ['crossmatch', 'medRecon'],
      linkedObjects: ['lab-panel', 'patient-file', 'monitor'],
      requiredEvidence: [
        'NPO durumu doğrulandı',
        'EKG, eko/anjiyo raporu erişilebilir',
        'Kan grubu ve son laboratuvar sonuçları görülebilir'
      ],
      rationaleQuestion: 'CABG hastasında anjiyo/eko raporu ve son laboratuvar sonuçları görünmüyor. En doğru yaklaşım nedir?',
      correctAnswer: 'Eksik kritik bilgi nedeniyle transfer durdurulur; sonuçların erişilebilirliği cerrahi/anestezi ekibiyle doğrulanır.',
      wrongAnswers: [
        { text: 'Ameliyat ekibi zaten bilir, transfer edilir.', critical: true },
        { text: 'Hasta stabil görünüyorsa transfer edilir.', critical: false },
        { text: 'Eksik sonuçlar ameliyathanede tamamlanır.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 6, incomplete: 3, wrong: -3, hardStop: false },
      stopBonus: 1,
      feedback: {
        correct: 'Yüksek riskli cerrahide laboratuvar/görüntüleme bilgisi anestezi planının parçasıdır.',
        wrong: 'Eksik kritik veri intraop kararları sakatlar.'
      }
    },

    crossmatch: {
      label: 'Kan hazırlığı / crossmatch',
      gcklItem: 'GCKL · Kan kaybı ve kan ürünü hazırlığının değerlendirilmesi',
      category: 'criticalSafety',
      weight: 8,
      criticalLevel: 'hardStop',
      prerequisites: ['identity', 'labImaging'],
      unlocks: ['transferClose'],
      linkedObjects: ['crossmatch-card', 'blood-prep-panel', 'patient-file'],
      requiredEvidence: [
        'Kan grubu doğrulandı',
        'Crossmatch sonucu mevcut',
        'Hazır eritrosit süspansiyonu / kan ürünü planı netleşti'
      ],
      rationaleQuestion: 'CABG hastasında crossmatch sonucu doğrulanmamış. Hemşirenin kararı ne olmalıdır?',
      correctAnswer: 'Transfer durdurulur; crossmatch ve kan ürünü hazırlığı doğrulanmadan yüksek riskli cerrahiye gönderilmez.',
      wrongAnswers: [
        { text: 'Kan gerekirse intraopta istenir.', critical: true },
        { text: 'CABG planlı olduğu için kan bankası hazırlamıştır varsayılır.', critical: true },
        { text: 'Hasta Hb değeri normalse crossmatch gerekli değildir.', critical: true }
      ],
      criticalErrorIfWrong: true,
      scoreImpact: { correct: 8, incomplete: 4, wrong: -8, hardStop: true },
      stopBonus: 2,
      feedback: {
        correct: 'CABG\'de yüksek kan kaybı riski; crossmatch kapanmadan transfer olmaz.',
        wrong: 'Acil kan ihtiyacında crossmatch beklemesi mortalite riskidir.'
      }
    },

    medRecon: {
      label: 'İlaç uzlaştırma / antikoagülan / glisemik risk',
      gcklItem: 'GCKL · İlaç güvenliği ve perioperatif risk yönetimi',
      category: 'clinicalPrep',
      weight: 6,
      criticalLevel: 'high',
      prerequisites: ['identity', 'allergy'],
      unlocks: ['ivMonitor'],
      linkedObjects: ['med-list', 'medrec-card', 'patient-file'],
      requiredEvidence: [
        'Antikoagülan/antiagregan kullanımı netleşti',
        'Diyabet ilaçları ve insülin yönetimi planlandı',
        'Beta bloker / antihipertansif uzlaştırması yapıldı'
      ],
      rationaleQuestion: 'Hasta aspirin/klopidogrel veya antikoagülan kullandığını söylüyor; ilaç listesinde kayıt belirsiz. Ne yapılmalıdır?',
      correctAnswer: 'İlaç öyküsü hasta, dosya ve hekim orderı ile uzlaştırılır; antikoagülan belirsizliği cerrahi/anestezi ekibine bildirilir.',
      wrongAnswers: [
        { text: 'Hasta ameliyata alındığına göre ilaç yönetimi yapılmıştır.', critical: false },
        { text: 'Sadece son dozu sorup kaydeder, ekibe bildirmez.', critical: true },
        { text: 'Bu yalnız hekimin sorumluluğudur.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 6, incomplete: 3, wrong: -4, hardStop: false },
      stopBonus: 1,
      feedback: {
        correct: 'CABG\'de kanama–tromboz–glisemik denge ilaç öyküsüyle başlar.',
        wrong: 'Belirsiz antikoagülan, postop kanama veya tromboz riskini görünmez kılar.'
      }
    },

    ivMonitor: {
      label: 'IV erişim ve monitörizasyon',
      gcklItem: 'GCKL · Anestezi öncesi güvenli izlem ve erişim',
      category: 'clinicalPrep',
      weight: 5,
      criticalLevel: 'medium',
      prerequisites: ['identity'],
      unlocks: ['transferClose'],
      linkedObjects: ['iv-pump', 'monitor', 'pulse-oximeter', 'patient-bed'],
      requiredEvidence: [
        'IV erişim açık ve uygun çapta',
        'Pulse oksimetre dalga formu güvenilir',
        'Bazal vital bulgular alındı'
      ],
      rationaleQuestion: 'Pulse oksimetre takılı; dalga formu zayıf ve SpO₂ değeri güvenilir görünmüyor. Ne yapılmalıdır?',
      correctAnswer: 'Sensör yerleşimi, perfüzyon ve dalga formu kontrol edilir; güvenilir izlem sağlanmadan transfer tamamlanmaz.',
      wrongAnswers: [
        { text: 'Sayısal değer görünüyorsa yeterlidir.', critical: false },
        { text: 'Monitör ameliyathanede yeniden takılacağı için önemli değildir.', critical: false },
        { text: 'Sadece hasta rengine bakmak yeterlidir.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 5, incomplete: 2, wrong: -2, hardStop: false },
      stopBonus: 1,
      feedback: {
        correct: 'Pulse oksimetre sayı + dalga formu + klinik uyumla yorumlanır.',
        wrong: 'Yanlış SpO₂ yorumu hipoksiyi gizleyebilir.'
      }
    },

    skinPrep: {
      label: 'Cilt hazırlığı / clipper',
      gcklItem: 'GCKL · Cerrahi alan enfeksiyonu (SSI) önleme',
      category: 'clinicalPrep',
      weight: 4,
      criticalLevel: 'medium',
      prerequisites: ['site'],
      unlocks: ['transferClose'],
      linkedObjects: ['clipper', 'skin-prep-card'],
      requiredEvidence: [
        'Cilt bütünlüğü değerlendirildi',
        'Kıl temizliği gerekiyorsa clipper ile yapıldı',
        'Jilet kullanılmadı'
      ],
      rationaleQuestion: 'Ameliyat bölgesinde kıl temizliği gerekli. En uygun yaklaşım nedir?',
      correctAnswer: 'Ameliyata yakın zamanda clipper ile yapılır; jilet kullanılmaz, cilt hasarı kontrol edilir.',
      wrongAnswers: [
        { text: 'Jilet daha hızlı olduğu için tercih edilir.', critical: true },
        { text: 'Önceki gece geniş tıraş yapılır.', critical: false },
        { text: 'Ciltte küçük kesikler önemli değildir.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 4, incomplete: 2, wrong: -2, hardStop: false },
      stopBonus: 0,
      feedback: {
        correct: 'Clipper, mikrotravma ve SSI riskini azaltır.',
        wrong: 'Jilet mikrotravma → mikroorganizma kolonizasyonu → SSI.'
      }
    },

    vte: {
      label: 'VTE ve özel hazırlık',
      gcklItem: 'GCKL · Risk azaltıcı özel hazırlıkların kontrolü',
      category: 'clinicalPrep',
      weight: 4,
      criticalLevel: 'medium',
      prerequisites: ['identity'],
      unlocks: ['transferClose'],
      linkedObjects: ['vte-equipment', 'compression-device'],
      requiredEvidence: [
        'VTE riski skorlandı',
        'Order edilen kompresyon/çorap uygulandı',
        'Kontrendikasyon kontrol edildi'
      ],
      rationaleQuestion: 'CABG hastasında VTE ekipmanı order edilmiş ancak hastaya uygulanmamış. Ne yapılmalıdır?',
      correctAnswer: 'Order ve kontrendikasyon kontrol edilir; uygunsa ekipman uygulanır ve transfer öncesi kayıt altına alınır.',
      wrongAnswers: [
        { text: 'Postop dönemde başlanır.', critical: false },
        { text: 'CABG\'de VTE riski düşük kabul edilir.', critical: false },
        { text: 'Ekipman yoksa kayıt gerekmez.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 4, incomplete: 2, wrong: -1, hardStop: false },
      stopBonus: 0,
      feedback: {
        correct: 'VTE önleme perioperatif zincirin parçası; transfer öncesi kapatılmalı.',
        wrong: 'Geç başlatılan profilaksi pulmoner emboli riskidir.'
      }
    },

    delirium: {
      label: 'Deliryum / kognitif risk',
      gcklItem: 'GCKL · Hasta güvenliği ve postoperatif komplikasyon önleme',
      category: 'clinicalPrep',
      weight: 5,
      criticalLevel: 'medium',
      prerequisites: ['identity'],
      unlocks: ['anxiety'],
      linkedObjects: ['delirium-risk-card', 'glasses-hearing-aid'],
      requiredEvidence: [
        'Yaş, kognitif durum ve uyku öyküsü değerlendirildi',
        'Görme/işitme desteği planlandı',
        'Aile bilgilendirme planı kuruldu'
      ],
      rationaleQuestion: 'Hasta yaşlı, kaygılı ve gece uyumadığını söylüyor. Bu bilgi neden önemlidir?',
      correctAnswer: 'Postoperatif deliryum riski artabilir; oryantasyon, ağrı, uyku, gözlük/işitme desteği ve aile bilgilendirmesi planlanır.',
      wrongAnswers: [
        { text: 'Deliryum yalnız postop dönemde değerlendirilir.', critical: false },
        { text: 'Kaygı cerrahi için normaldir, kayıt gerekmez.', critical: false },
        { text: 'Yaşlılık tek başına önemli değildir.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 5, incomplete: 2, wrong: -2, hardStop: false },
      stopBonus: 1,
      feedback: {
        correct: 'Deliryum önleme preoperatif risk tanılamayla başlar.',
        wrong: 'Postop deliryum mortalite ve hastanede kalış süresini artırır.'
      }
    },

    anxiety: {
      label: 'Anksiyete değerlendirme',
      gcklItem: 'GCKL · Hasta merkezli güvenli bakım ve iş birliği',
      category: 'communication',
      weight: 5,
      criticalLevel: 'low',
      prerequisites: ['identity'],
      unlocks: ['patientEdu'],
      linkedObjects: ['patient-interview-area'],
      requiredEvidence: [
        'Hasta kaygısı sorgulandı',
        'Endişe kaynağı tanımlandı',
        'Aile/refakatçi durumu değerlendirildi'
      ],
      rationaleQuestion: 'Hasta "Ameliyattan sonra uyanamazsam?" diye kaygı ifade ediyor. Hemşire nasıl yanıt vermelidir?',
      correctAnswer: 'Kaygıyı kabul eder, kısa ve doğru bilgi verir; anestezi/cerrahi süreçle ilgili gerçekçi açıklama yapar ve gerektiğinde ekibe bildirir.',
      wrongAnswers: [
        { text: '"Korkacak bir şey yok" diyerek geçiştirir.', critical: false },
        { text: '"Bu soruyu anesteziye sorarsınız" diyerek iletişimi kapatır.', critical: false },
        { text: 'Uzun teknik açıklamalarla hastayı daha fazla yükler.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 5, incomplete: 2, wrong: -1, hardStop: false },
      stopBonus: 0,
      feedback: {
        correct: 'Anksiyete kabulü + gerçekçi bilgi + uygun yönlendirme.',
        wrong: 'Geçiştirme veya yanlış güven verme iş birliğini zayıflatır.'
      }
    },

    patientEdu: {
      label: 'Hasta eğitimi',
      gcklItem: 'GCKL · Anlaşılır bilgi paylaşımı',
      category: 'communication',
      weight: 5,
      criticalLevel: 'low',
      prerequisites: ['anxiety'],
      unlocks: ['teachBack'],
      linkedObjects: ['education-card'],
      requiredEvidence: [
        'Süreç adımları kısa ve anlaşılır anlatıldı',
        'Postop neyle karşılaşacağı söylendi',
        'Soruları yanıtlandı'
      ],
      rationaleQuestion: 'Hastaya cerrahi süreç hakkında bilgi verirken en doğru yaklaşım nedir?',
      correctAnswer: 'Sade dil, anlaşılır adımlar, hastanın endişelerine yönelik özelleştirilmiş bilgi.',
      wrongAnswers: [
        { text: 'Tıbbi terimlerle ayrıntılı brifing verir.', critical: false },
        { text: 'Bilgi vermez; "doktor anlatsın" der.', critical: false },
        { text: 'Sadece broşür uzatır.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 5, incomplete: 2, wrong: -1, hardStop: false },
      stopBonus: 0,
      feedback: {
        correct: 'Hastanın anlama düzeyine göre özelleştirilmiş eğitim.',
        wrong: 'Anlaşılmayan eğitim eğitim değildir.'
      }
    },

    teachBack: {
      label: 'Teach-back / aile bilgilendirme',
      gcklItem: 'GCKL · Anladığını doğrulama',
      category: 'communication',
      weight: 5,
      criticalLevel: 'low',
      prerequisites: ['patientEdu'],
      unlocks: ['transferClose'],
      linkedObjects: ['patient-interview-area', 'family-area'],
      requiredEvidence: [
        'Hasta kendi cümleleriyle özetledi',
        'Yanlış anlaşılan noktalar düzeltildi',
        'Aile/refakatçi bilgilendirildi'
      ],
      rationaleQuestion: 'Verilen bilginin anlaşıldığını nasıl doğrularsınız?',
      correctAnswer: 'Hastanın bilgiyi kendi cümleleriyle anlatmasını ister; eksik/yanlış noktaları düzeltir.',
      wrongAnswers: [
        { text: '"Anladınız mı?" sorusuyla yetinir.', critical: false },
        { text: 'Hasta başını salladığında geçer.', critical: false },
        { text: 'Aileyi sürece dahil etmez.', critical: false }
      ],
      criticalErrorIfWrong: false,
      scoreImpact: { correct: 5, incomplete: 2, wrong: -1, hardStop: false },
      stopBonus: 1,
      feedback: {
        correct: 'Teach-back, "anladım" yanıtının ötesinde gerçek anlamayı gösterir.',
        wrong: 'Doğrulanmamış eğitim yanlış uygulamayı doğurur.'
      }
    },

    transferClose: {
      label: 'Transfer öncesi kapanış kontrolü',
      gcklItem: 'GCKL · Preop güvenli teslim ve ameliyathaneye transfer',
      category: 'criticalSafety',
      weight: 8,
      criticalLevel: 'hardStop',
      // Tüm kritik düğümler kapanmadan tam puan alınamaz
      prerequisites: [
        'identity', 'consent', 'site', 'allergy',
        'labImaging', 'crossmatch', 'medRecon', 'ivMonitor'
      ],
      unlocks: [],
      linkedObjects: ['transfer-control-board', 'patient-bed', 'patient-file', 'preop-gckl-board'],
      requiredEvidence: [
        'Tüm kritik düğümler tamamlandı',
        'Crossmatch + alerji + onam + kimlik son kez doğrulandı',
        'Transfer ekibine teslim bilgisi verildi'
      ],
      rationaleQuestion: 'Transfer öncesi tüm bilgiler tamamlanmadan hasta ameliyathaneye gönderilirse en büyük risk nedir?',
      correctAnswer: 'Yanlış/eksik bilgiyle anestezi ve cerrahi sürecin başlaması; kimlik, onam, alerji, kan hazırlığı veya işlem güvenliği hatası oluşur.',
      wrongAnswers: [
        { text: 'Eksikler ameliyathanede fark edilir.', critical: true },
        { text: 'Transfer gecikmemesi daha önemlidir.', critical: true },
        { text: 'Preop hemşiresi yalnız hastayı hazırlar; son kontrol ekibin sorumluluğudur.', critical: true }
      ],
      criticalErrorIfWrong: true,
      scoreImpact: { correct: 8, incomplete: 2, wrong: -8, hardStop: true },
      stopBonus: 3,
      feedback: {
        correct: 'Kapanış kontrolü güvenli cerrahi zincirinin son bariyeridir.',
        wrong: 'Eksik kapanış = ameliyathaneye taşınan görünmez risk.'
      }
    }
  };

  // Kategori başına toplam puan kontrolü (debug için):
  // criticalSafety: identity8 + consent7 + site7 + allergy7 + crossmatch8 + transferClose8 = 45 ✓
  // clinicalPrep:   labImaging6 + medRecon6 + ivMonitor5 + skinPrep4 + vte4 + delirium5 = 30 ✓
  // communication:  anxiety5 + patientEdu5 + teachBack5 = 15 ✓
  // Toplam baz puan: 90 + 10 (akıl yürütme bonus) = 100

  const REASONING_BONUS_MAX = 10;

  // Kritik düğümler — transfer kilidi listesi
  const CRITICAL_NODES = Object.keys(NODES).filter(id => NODES[id].criticalLevel === 'hardStop');

  // ---------- ÇALIŞMA DURUMU (STATE) ----------
  // Her düğüm için: status (pending|done|wrong|stopped), evidence{}, rationale{answered, correct, optionIndex}
  function freshState() {
    const s = { nodes: {}, reasoningBonus: 0, criticalBarrierBreaches: [] };
    Object.keys(NODES).forEach(id => {
      s.nodes[id] = {
        id,
        status: 'pending',          // pending | done | wrong | stopped (öğrenci durdurma kararı verdi)
        evidenceMet: 0,             // toplanmış kanıt sayısı
        rationale: { answered: false, correct: null, optionIndex: -1 },
        scoreEarned: 0,
        scoreLost: 0,
        flags: []                   // ['hardStop','barrierBreach','correctStop',...]
      };
    });
    return s;
  }

  // ---------- KARŞILIKSIZ AĞ İŞLEMLERİ ----------
  function prereqsMet(state, nodeId) {
    const node = NODES[nodeId];
    if (!node) return false;
    return node.prerequisites.every(pid => {
      const pn = state.nodes[pid];
      return pn && (pn.status === 'done' || pn.status === 'stopped'); // doğru durdurma da prerequisite tamamlar
    });
  }

  // Kritik bariyer ihlali var mı? (kritik düğüm 'wrong' veya 'pending')
  function criticalBreaches(state) {
    return CRITICAL_NODES.filter(id => {
      const n = state.nodes[id];
      return !n || (n.status !== 'done' && n.status !== 'stopped');
    }).map(id => ({ id, label: NODES[id].label, status: state.nodes[id].status }));
  }

  function explicitWrongCriticals(state) {
    return CRITICAL_NODES.filter(id => state.nodes[id] && state.nodes[id].status === 'wrong')
                         .map(id => ({ id, label: NODES[id].label }));
  }

  // ---------- DÜĞÜM KAYIT FONKSİYONLARI ----------
  function markEvidence(state, nodeId, count) {
    const n = state.nodes[nodeId];
    if (!n) return;
    n.evidenceMet = Math.min(NODES[nodeId].requiredEvidence.length, Math.max(n.evidenceMet, count));
  }

  function completeNode(state, nodeId) {
    const n = state.nodes[nodeId];
    const def = NODES[nodeId];
    if (!n || !def) return false;
    if (!prereqsMet(state, nodeId)) {
      // Prerequisite eksik: tam puan yerine "incomplete"
      n.status = 'done';
      n.scoreEarned = def.scoreImpact.incomplete;
      n.flags.push('prereqMissing');
      return true;
    }
    n.status = 'done';
    const evidenceRatio = def.requiredEvidence.length === 0 ? 1
      : (n.evidenceMet / def.requiredEvidence.length);
    if (evidenceRatio >= 1) {
      n.scoreEarned = def.scoreImpact.correct;
    } else if (evidenceRatio >= 0.5) {
      n.scoreEarned = Math.round(def.scoreImpact.correct * 0.7);
      n.flags.push('partialEvidence');
    } else {
      n.scoreEarned = def.scoreImpact.incomplete;
      n.flags.push('partialEvidence');
    }
    return true;
  }

  // Öğrenci süreci doğru bir şekilde durdurursa (hard-stop kararı doğru ise) çağrılır
  function markCorrectStop(state, nodeId) {
    const n = state.nodes[nodeId];
    const def = NODES[nodeId];
    if (!n || !def) return;
    n.status = 'stopped';
    n.scoreEarned = def.scoreImpact.correct + (def.stopBonus || 0);
    n.flags.push('correctStop');
    state.reasoningBonus = Math.min(REASONING_BONUS_MAX, state.reasoningBonus + (def.stopBonus || 0));
  }

  // Gerekçelendirme MCQ cevabı
  function answerRationale(state, nodeId, optionIndex) {
    const n = state.nodes[nodeId];
    const def = NODES[nodeId];
    if (!n || !def) return { ok: false };
    n.rationale.answered = true;
    n.rationale.optionIndex = optionIndex;
    // optionIndex: -1 = doğru cevap (correctAnswer), 0..N = wrongAnswers[i]
    if (optionIndex === -1) {
      n.rationale.correct = true;
      // Doğru cevap → reasoning bonus
      const bonus = def.criticalErrorIfWrong ? 2 : 1;
      state.reasoningBonus = Math.min(REASONING_BONUS_MAX, state.reasoningBonus + bonus);
      // Kritik durdurma sorusuysa stop bonus da eklenir
      if (def.criticalErrorIfWrong) {
        state.reasoningBonus = Math.min(REASONING_BONUS_MAX, state.reasoningBonus + (def.stopBonus || 0));
      }
      return { ok: true, correct: true, bonus, feedback: def.feedback.correct };
    } else {
      const wrong = def.wrongAnswers[optionIndex];
      n.rationale.correct = false;
      const isCriticalWrong = wrong && wrong.critical;
      // Yanlış cevap → düğümü 'wrong' işaretle
      if (def.criticalErrorIfWrong && isCriticalWrong) {
        n.status = 'wrong';
        n.scoreEarned = 0;
        n.scoreLost = Math.abs(def.scoreImpact.wrong);
        n.flags.push('hardStop', 'barrierBreach');
        state.criticalBarrierBreaches.push({
          nodeId, label: def.label, optionIndex, optionText: wrong.text
        });
      } else {
        n.scoreLost = Math.abs(def.scoreImpact.wrong);
      }
      return {
        ok: true, correct: false,
        feedback: def.feedback.wrong,
        critical: isCriticalWrong && def.criticalErrorIfWrong
      };
    }
  }

  // ---------- PUAN HESABI ----------
  function compute(state) {
    let earned = 0, lost = 0;
    const byCategory = { criticalSafety: { earned: 0, max: 45 },
                         clinicalPrep:   { earned: 0, max: 30 },
                         communication:  { earned: 0, max: 15 } };

    Object.keys(NODES).forEach(id => {
      const def = NODES[id];
      const n = state.nodes[id];
      if (!n) return;

      let nodeScore = n.scoreEarned;

      // Downstream cezası: prerequisite eksikse veya 'wrong' ise puan tavanı düşer
      if (n.status === 'done' && !prereqsMet(state, id)) {
        nodeScore = Math.min(nodeScore, def.scoreImpact.incomplete);
      }

      // Transfer kapanışı özel formül: kritik bariyer ihlali varsa max 2/8
      if (id === 'transferClose') {
        const breaches = criticalBreaches(state).filter(b => b.id !== 'transferClose');
        if (breaches.length > 0) {
          nodeScore = Math.min(nodeScore, 2);
          n.flags.push('cappedByBreach');
        }
      }

      earned += nodeScore;
      lost += n.scoreLost;
      if (byCategory[def.category]) byCategory[def.category].earned += nodeScore;
    });

    // Akıl yürütme bonus (10p tavanı)
    const bonus = state.reasoningBonus;

    // Toplam ham puan (negatif olabilir, 0'a clamp edilir)
    let total = Math.max(0, earned - lost + bonus);

    // Kritik bariyer ihlali → faz puanı düşer
    const breaches = explicitWrongCriticals(state);
    if (breaches.length > 0) {
      total = Math.min(total, 49); // bariyer ihlalinde tavan 49 (geçemez)
    }

    return {
      total: Math.round(total),
      earnedBase: earned,
      lost: lost,
      reasoningBonus: bonus,
      byCategory,
      breaches,
      pendingCriticals: criticalBreaches(state).filter(b => b.id !== 'transferClose'),
      canTransfer: canTransfer(state)
    };
  }

  // ---------- TRANSFER KİLİDİ ----------
  function canTransfer(state) {
    const pending = criticalBreaches(state).filter(b => b.id !== 'transferClose');
    const wrongs = explicitWrongCriticals(state);
    return {
      ok: pending.length === 0 && wrongs.length === 0,
      pending,
      wrongs
    };
  }

  // ---------- DEBRIEF RAPORU ----------
  function debrief(state) {
    const r = compute(state);
    const completed = [], missed = [], wrongs = [], correctStops = [];
    Object.keys(NODES).forEach(id => {
      const n = state.nodes[id];
      const def = NODES[id];
      if (n.status === 'done') completed.push({ id, label: def.label, score: n.scoreEarned });
      else if (n.status === 'wrong') wrongs.push({ id, label: def.label });
      else if (n.status === 'stopped') correctStops.push({ id, label: def.label });
      else missed.push({ id, label: def.label, category: def.category });
    });
    return {
      total: r.total, max: 100,
      categories: r.byCategory,
      reasoningBonus: r.reasoningBonus,
      completed, missed, wrongs, correctStops,
      barrierBreaches: state.criticalBarrierBreaches.slice(),
      strong: completed.filter(c => c.score >= NODES[c.id].scoreImpact.correct * 0.9).map(c => c.label),
      risky:  missed.filter(m => NODES[m.id].criticalLevel === 'hardStop').map(m => m.label),
      nextLearningSuggestion: buildNextLearning(state)
    };
  }

  function buildNextLearning(state) {
    const suggestions = [];
    if (state.nodes.crossmatch && state.nodes.crossmatch.status !== 'done') {
      suggestions.push('CABG\'de kan hazırlığı zincirini (kan grubu → crossmatch → ürün hazır) tekrar gözden geçir.');
    }
    if (state.nodes.identity && state.nodes.identity.status === 'wrong') {
      suggestions.push('Kimlik doğrulama: 2 belirteç + bileklik + dosya + ameliyat listesi zinciri.');
    }
    if (state.nodes.delirium && state.nodes.delirium.status !== 'done') {
      suggestions.push('Yaşlı hastada postop deliryum riski preopta tanılanır; oryantasyon planını gözden geçir.');
    }
    if (state.criticalBarrierBreaches.length > 0) {
      suggestions.push('Güvenli cerrahide "transferi durdur" kararı bir hata değil, bir yetkinliktir.');
    }
    return suggestions;
  }

  // ---------- DIŞA AÇILAN API ----------
  global.PRE_GCKL_NETWORK = NODES;
  global.PreopGCKL = {
    NODES,
    CRITICAL_NODES,
    REASONING_BONUS_MAX,
    freshState,
    markEvidence,
    completeNode,
    markCorrectStop,
    answerRationale,
    compute,
    canTransfer,
    debrief,
    prereqsMet,
    criticalBreaches,
    explicitWrongCriticals
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* ===== End inline pre-gckl-network.js ===== */
