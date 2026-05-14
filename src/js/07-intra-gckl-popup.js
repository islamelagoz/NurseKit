/* ===== Inlined from intra-gckl-popup.js ===== */
/* ============================================================
 * intra-gckl-popup.js  —  Aşama 3
 * 3D nesne tıklamasını INTRAOP_GCKL_NETWORK node popup'una bağlar.
 * Preop kart mantığının birebir intraop muadili.
 * ============================================================ */
(function () {
  'use strict';

  // ----- clinicalKey → nodeId (spec) -----
  var K2N = {
    'timeout-board': 'timeOutTeam',
    'or-team-figures': 'teamCommunication',
    'surgical-team': 'teamCommunication',
    'patient-wristband': 'patientProcedureSite',
    'site-marking': 'patientProcedureSite',
    'consent-form': 'patientProcedureSite',
    'surgical-field': 'patientProcedureSite',
    'imaging-monitor': 'imagingAndResults',
    'pacs': 'imagingAndResults',
    'lab-panel': 'imagingAndResults',
    'result-board': 'imagingAndResults',
    'antibiotic-syringe': 'antibioticProphylaxis',
    'allergy-band': 'antibioticProphylaxis',
    'medication-tray': 'antibioticProphylaxis',
    'anesthesia-machine': 'anesthesiaSafety',
    'airway-cart': 'anesthesiaSafety',
    'pulse-oximeter': 'anesthesiaSafety',
    'monitor': 'anesthesiaSafety',
    'aline-panel': 'anesthesiaSafety',
    'blood-bags': 'bloodLossRisk',
    'rapid-infuser': 'bloodLossRisk',
    'transfusion-panel': 'bloodLossRisk',
    'blood-loss-board': 'bloodLossRisk',
    'cell-saver': 'bloodLossRisk',
    'cpb-machine': 'cabgCpbSafety',
    'perfusionist': 'cabgCpbSafety',
    'perfusion-console': 'cabgCpbSafety',
    'cpb-phase-board': 'cabgCpbSafety',
    'esu-unit': 'equipmentAndFireSafety',
    'electrocautery': 'equipmentAndFireSafety',
    'antiseptic-bottle': 'equipmentAndFireSafety',
    'smoke-evac': 'equipmentAndFireSafety',
    'suction-smoke': 'equipmentAndFireSafety',
    'fire-risk': 'equipmentAndFireSafety',
    'mayo-table': 'sterileFieldAndTraffic',
    'sterile-drape': 'sterileFieldAndTraffic',
    'back-table': 'sterileFieldAndTraffic',
    'or-door': 'sterileFieldAndTraffic',
    'traffic-control': 'sterileFieldAndTraffic',
    'scrub-nurse': 'sterileFieldAndTraffic',
    'or-table': 'positioningAndTemperature',
    'positioning-set': 'positioningAndTemperature',
    'warming-blanket': 'positioningAndTemperature',
    'forced-air-warmer': 'positioningAndTemperature',
    'temp-trigger-panel': 'positioningAndTemperature',
    'count-board': 'countSafety',
    'instrument-tray': 'countSafety',
    'sponge': 'countSafety',
    'sharps-tray': 'countSafety',
    'mayo-stand': 'countSafety',
    'specimen-container': 'specimenAndEquipmentIssue',
    'label': 'specimenAndEquipmentIssue',
    'equipment-incident-log': 'specimenAndEquipmentIssue',
    'specimen-table': 'specimenAndEquipmentIssue',
    'signout-checklist': 'signOutHandoff',
    'handoff-card': 'signOutHandoff',
    'transfer-stretcher': 'signOutHandoff',
    'icu-card': 'signOutHandoff',
    'postop-plan': 'signOutHandoff'
  };

  // ----- Evidence butonları için komut-tonu fallback etiketleri -----
  var EVIDENCE_LABELS = {
    timeOutTeam: { team_attention: 'Ekip dikkatini topla / time-out başlat', members_introduced: 'Ekip üyelerini ad/rolle tanıt', distractions_paused: 'Cihaz/iletişim kesintilerini durdur' },
    patientProcedureSite: { identity: 'Hastaya sor / kimliği doğrula', procedure: 'Cerrahi onamı kontrol et', site_marking: 'Taraf işareti ve dosya uyumunu kontrol et' },
    imagingAndResults: { imaging_displayed: 'Görüntülemeyi ekrana al / doğrula', results_reviewed: 'Kritik laboratuvar sonuçlarını ekiplе gözden geçir' },
    antibioticProphylaxis: { antibiotic_time: 'Profilaksi zamanını sor / doğrula', allergy_cross: 'Alerji çapraz kontrolünü yap', dose_appropriate: 'Doz/kilo uygunluğunu değerlendir' },
    anesthesiaSafety: { airway: 'Havayolu güvenliğini doğrula', spo2_reliable: 'SpO₂ dalga formunu güvenilirliğini kontrol et', risks: 'Anestezi kritik risklerini ekiple paylaş' },
    bloodLossRisk: { expected_loss: 'Beklenen kan kaybını ekiple konuş', blood_available: 'Kan/komponеnt hazırlığını doğrula', iv_access: 'Büyük-kalibre IV/hızlı infüzörü kontrol et' },
    equipmentAndFireSafety: { esu_pad_position: 'ESU nötral elektrot pozisyonunu doğrula', antiseptic_dry: 'Antiseptik kurumasını bekle / doğrula', fire_triangle: 'Yangın üçgenini değerlendir (O₂-ateş-yakıt)' },
    sterileFieldAndTraffic: { sterile_field_intact: 'Steril alan bütünlüğünü kontrol et', traffic: 'Oda trafiğini sınırlandır' },
    positioningAndTemperature: { positioning_safe: 'Pozisyon ve bası noktalarını doğrula', active_warming_on: 'Aktif ısıtmayı başlat / kontrol et' },
    countSafety: { count_initial: 'Açılış sayarımını yap (çift hemşire)', count_final: 'Kapanış sayarımını yap (çift hemşire)' },
    specimenAndEquipmentIssue: { specimen_labeled: 'Numune etiketini hasta bilgisiyle doğrula', equipment_issues: 'Ekipman sorununu kayıt altına al' },
    signOutHandoff: { procedure: 'Yapılan işlemi sesli olarak doğrula', count_final: 'Sayarım sonucunu doğrula', specimen: 'Numuneyi doğrula', equipment: 'Ekipman sorununu paylaş', postop_plan: 'Postop kritik bakım planını aktar' }
  };

  function getIntraopNodeByClinicalKey(k) {
    if (!k) return null;
    return K2N[String(k).toLowerCase()] || null;
  }

  // ----- CSS (preop dilinde) -----
  var CSS = '\
#obj-popup.intraop-node-host{width:min(520px,calc(100vw - 30px))!important;max-width:calc(100vw - 30px)!important;overflow:hidden!important}\
.intraop-node-popup,.intraop-node-popup *{box-sizing:border-box;max-width:100%}\
.intraop-node-popup{font-family:inherit;color:#cfe7ee;background:linear-gradient(180deg,#0a1218 0%,#0d1820 100%);border:1px solid #1b3949;border-radius:10px;padding:0;width:100%;min-width:0;max-height:78vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.55);overflow:hidden;font-size:13px;line-height:1.42}\
.intraop-node-popup.hardstop{border-color:#7a2330;box-shadow:0 0 0 1px #7a2330 inset,0 8px 32px rgba(0,0,0,.55)}\
.intraop-node-popup.breach{border-color:#c0392b;box-shadow:0 0 0 2px #c0392b inset}\
.intraop-node-header{padding:12px 14px 10px;border-bottom:1px solid #18313e;background:linear-gradient(180deg,#102230 0%,#0b1822 100%)}\
.intraop-node-title{font-size:14.5px;font-weight:700;color:#e7f6fa;letter-spacing:.2px;overflow-wrap:anywhere}\
.intraop-node-desc{margin-top:4px;color:#8fb3bf;font-size:11.8px;overflow-wrap:anywhere}\
.intraop-node-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}\
.intraop-node-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:11px;background:#13303d;border:1px solid #1f4a5c;color:#9ed1de;font-size:10.5px;font-weight:600;letter-spacing:.2px}\
.intraop-node-chip.cat{background:#0e2a3a;border-color:#1d4658}\
.intraop-node-chip.gckl{background:#0d2e2a;border-color:#1d5a4d;color:#86dac6}\
.intraop-node-chip.role{background:#1f1f2e;border-color:#3a3a55;color:#bcb6df}\
.intraop-node-chip.score{background:#102f1d;border-color:#1f5a35;color:#8de2a8}\
.intraop-node-chip.status-pending{background:#2b2310;border-color:#5a4818;color:#e2c97e}\
.intraop-node-chip.status-complete{background:#0e3320;border-color:#1c6841;color:#7fe2a3}\
.intraop-node-chip.status-partial{background:#2b2310;border-color:#5a4818;color:#e2c97e}\
.intraop-node-chip.status-wrong,.intraop-node-chip.status-breach{background:#3b1216;border-color:#7e2632;color:#f0a0aa}\
.intraop-node-chip.hardstop{background:#3b1216;border-color:#7e2632;color:#f0a0aa}\
.intraop-node-scroll{padding:12px 14px;overflow-y:auto;overflow-x:hidden;flex:1;scrollbar-width:thin;scrollbar-color:#1f4a5c #0a1218}\
.intraop-node-scroll::-webkit-scrollbar{width:7px}\
.intraop-node-scroll::-webkit-scrollbar-thumb{background:#1f4a5c;border-radius:4px}\
.intraop-node-progress{display:flex;align-items:center;gap:8px;margin:0 0 10px}\
.intraop-node-progress-bar{flex:1;height:6px;background:#0e2230;border-radius:4px;overflow:hidden;border:1px solid #16384a}\
.intraop-node-progress-fill{height:100%;background:linear-gradient(90deg,#1a8f73,#52d4af);transition:width .25s}\
.intraop-node-progress-text{font-size:11px;color:#9ed1de;font-weight:600;min-width:42px;text-align:right}\
.intraop-node-section{margin:10px 0 8px}\
.intraop-node-section-title{font-size:10.5px;text-transform:uppercase;letter-spacing:.8px;color:#6fa6b6;font-weight:700;margin-bottom:5px}\
.intraop-node-role-box{background:#0e1f2a;border-left:3px solid #2a6275;padding:7px 10px;border-radius:4px;font-size:12px;color:#bfdde6;overflow-wrap:anywhere}\
.intraop-node-task-link{background:#0e2230;border:1px dashed #2a4c5c;padding:7px 10px;border-radius:5px;font-size:11.5px;color:#9ed1de;overflow-wrap:anywhere}\
.intraop-node-task-link b{color:#cfe7ee}\
.intraop-node-risk{padding:8px 10px;border-radius:5px;font-size:11.8px;line-height:1.45;border-left:3px solid #c0bd2b;overflow-wrap:anywhere}\
.intraop-node-risk.warning{background:rgba(192,189,43,.08);border-left-color:#c0bd2b;color:#e0dca0}\
.intraop-node-risk.hardstop{background:rgba(192,57,43,.10);border-left-color:#c0392b;color:#f0b5b0}\
.intraop-node-risk b{display:block;margin-bottom:2px;font-size:11px;letter-spacing:.4px;text-transform:uppercase}\
.intraop-node-actions{display:flex;flex-direction:column;gap:5px}\
.intraop-node-action-btn{display:block;width:100%;padding:11px 14px;background:linear-gradient(180deg,#16526b 0%,#0f3d52 100%);border:1px solid #2c6378;border-radius:7px;color:#e7f6fa;cursor:pointer;font-size:13px;font-weight:600;text-align:left;transition:all .15s;font-family:inherit;letter-spacing:.2px;white-space:normal;overflow-wrap:anywhere}\
.intraop-node-action-btn:hover{background:linear-gradient(180deg,#1d6985,#155067);border-color:#3a829c;box-shadow:0 2px 8px rgba(45,135,170,.25)}\
.intraop-node-action-btn.primary{background:linear-gradient(180deg,#6b2247,#481730);border-color:#8e2f5f;color:#f6c8dc}\
.intraop-node-action-btn.primary:hover{background:linear-gradient(180deg,#82295a,#5a1d3d);border-color:#a83a72}\
.intraop-node-action-btn.done{background:linear-gradient(180deg,#0e3320,#0a2818);border-color:#1c6841;color:#7fe2a3;cursor:default}\
.intraop-node-action-btn.done:before{content:"✓  ";color:#3fc480;font-weight:700}\
.intraop-node-action-btn.mcq{background:linear-gradient(180deg,#3a2754,#27193b);border-color:#5a3d80;color:#d4bbf0}\
.intraop-node-action-btn.mcq:hover{background:linear-gradient(180deg,#4a3268,#321f4e);border-color:#7a55a8}\
.intraop-node-action-btn.hint{background:linear-gradient(180deg,#2a3a14,#1c280c);border-color:#4c6420;color:#cce29a}\
.intraop-node-action-btn.hint:hover{background:linear-gradient(180deg,#36491b,#243314);border-color:#658528}\
.intraop-node-mcq{background:#0e1f2a;border:1px solid #1c3a4a;border-radius:6px;padding:9px 10px}\
.intraop-node-mcq-q{font-size:12.2px;color:#e7f6fa;font-weight:600;margin-bottom:6px;line-height:1.42}\
.intraop-node-mcq-opt{display:block;width:100%;padding:7px 9px;margin:3px 0;background:#0a1822;border:1px solid #1f4a5c;border-radius:4px;color:#cfe7ee;cursor:pointer;font-size:11.8px;text-align:left;font-family:inherit;transition:all .15s;white-space:normal;overflow-wrap:anywhere}\
.intraop-node-mcq-opt:hover{background:#13303d;border-color:#2c6378}\
.intraop-node-mcq-opt.correct{background:#0e3320;border-color:#1c6841;color:#a0e6bd}\
.intraop-node-mcq-opt.wrong{background:#3b1216;border-color:#7e2632;color:#f0a0aa}\
.intraop-node-mcq-opt:disabled{cursor:default}\
.intraop-node-mcq-feedback{margin-top:6px;padding:6px 8px;border-radius:4px;font-size:11.5px;line-height:1.4}\
.intraop-node-mcq-feedback.correct{background:rgba(63,196,128,.10);color:#a0e6bd}\
.intraop-node-mcq-feedback.wrong{background:rgba(192,57,43,.10);color:#f0b5b0}\
.intraop-node-map{background:#091621;border:1px solid #14323f;border-radius:5px;padding:8px 10px;font-size:11px;color:#8fb3bf;display:grid;grid-template-columns:minmax(92px,auto) minmax(0,1fr);gap:3px 10px;overflow:hidden}\
.intraop-node-map dt{color:#6fa6b6;font-weight:600;text-transform:uppercase;letter-spacing:.5px;font-size:9.5px;align-self:center}\
.intraop-node-map dd{margin:0;color:#cfe7ee;font-size:11px;min-width:0;overflow-wrap:anywhere;word-break:normal}\
.intraop-node-stop-btn{margin-top:8px;padding:6px 10px;background:#0e2230;border:1px dashed #c0392b;border-radius:5px;color:#f0a0aa;cursor:pointer;font-size:11.5px;font-family:inherit;width:100%}\
.intraop-node-stop-btn:hover{background:#2a1418}\
';

  function ensureCss() {
    if (document.getElementById('intraop-popup-styles')) return;
    var s = document.createElement('style');
    s.id = 'intraop-popup-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ----- node verisini ağdan al -----
  function getNet() {
    return (typeof window !== 'undefined' && window.IntraopGCKL) || null;
  }
  function getNodeData(id) {
    var net = getNet();
    if (!net) return null;
    var snap = net.compute && net.compute();
    if (!snap || !snap.nodes) return null;
    var defs = net.getDefinitions ? net.getDefinitions() : (net.NODES || {});
    return { def: defs[id] || {}, state: snap.nodes[id] || {}, snap: snap };
  }

  // ----- chip / progress helpers -----
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function statusLabel(st) {
    return ({
      pending: 'Bekliyor',
      partial: 'Devam ediyor',
      complete: 'Tamamlandı',
      wrong: 'Kritik ihlal',
      breach: 'Kritik ihlal',
      locked: 'Kilitli'
    })[st] || st || 'Bekliyor';
  }

  function categoryLabel(c) {
    return ({
      criticalSafety: 'Time-out & Doğrulama',
      clinicalPrep: 'Klinik / Cihaz',
      communication: 'Sign-out & Teslim',
      timeOutVerify: 'Time-out & Doğrulama',
      anesthesiaBlood: 'Anestezi & Kan',
      sterileEquipment: 'Steril / Cihaz / Pozisyon',
      countSpecimen: 'Sayım / Numune',
      signOut: 'Sign-out & Teslim'
    })[c] || c || '—';
  }

  function buildRoleText(def) {
    var r = def.role || def.responsibleRoles || def.roles || [];
    if (typeof r === 'string') return r;
    if (Array.isArray(r) && r.length) return r.join(' · ');
    return 'Tüm cerrahi ekip ortak sorumlu — sirküle / scrub / anestezi koordinasyonu.';
  }

  function buildLinkedTask(def, id) {
    var t = def.linkedTasks || def.taskTags || [];
    if (typeof t === 'string') t = [t];
    var labels = ({
      timeOutTeam: 'Time-out ekip katılımını doğrula.',
      patientProcedureSite: 'Hasta / işlem / cerrahi bölgeyi doğrula.',
      imagingAndResults: 'Görüntüleme ve kritik sonuçların görünürlüğünü doğrula.',
      antibioticProphylaxis: 'Profilaksi zamanı ve alerjiyi doğrula.',
      anesthesiaSafety: 'Anestezi güvenliği ve izlemi doğrula.',
      bloodLossRisk: 'Kan kaybı riskini ve kan hazırlığını doğrula.',
      equipmentAndFireSafety: 'ESU, antiseptik ve yangın güvenliğini doğrula.',
      sterileFieldAndTraffic: 'Steril alan bütünlüğü ve oda trafiğini doğrula.',
      positioningAndTemperature: 'Pozisyon güvenliği ve aktif ısıtmayı doğrula.',
      countSafety: 'Spons / alet / iğne sayımını doğrula.',
      specimenAndEquipmentIssue: 'Numune etiketi ve ekipman sorununu doğrula.',
      signOutHandoff: 'Sign-out ve güvenli teslimi tamamla.'
    });
    return '<b>Görev:</b> ' + escapeHtml(labels[id] || (def.label || id)) +
      (t.length ? '<br><span style="color:#6fa6b6;font-size:10.5px">Tag: ' + escapeHtml(t.join(' + ')) + '</span>' : '');
  }

  // ----- renderer -----
  function renderIntraopGcklNodePopup(nodeId, obj, x, y) {
    var clinicalKey = (obj && obj.opts && obj.opts.clinicalKey) || (obj && obj.clinicalKey) || '';
    if (clinicalKey && window.IntraPopups && typeof window.IntraPopups.resolveIntraCard === 'function' &&
        typeof window.IntraPopups.renderIntraProtocolCard === 'function') {
      var primaryCard = window.IntraPopups.resolveIntraCard(clinicalKey);
      if (primaryCard) {
        window.__intraGcklPopupFallbackDelegates = true;
        return window.IntraPopups.renderIntraProtocolCard(primaryCard, clinicalKey, obj, x, y);
      }
    }
    window.__intraGcklPopupFallbackDelegates = true;
    ensureCss();
    var nd = getNodeData(nodeId);
    if (!nd || !nd.def) {
      console.warn('[INTRA-GCKL] Node data yok:', nodeId);
      return false;
    }
    var def = nd.def, st = nd.state;
    var host = document.getElementById('obj-popup');
    if (!host) return false;
    host.classList.remove('ipv2-host');
    host.classList.add('intraop-node-host');
    host.style.width = 'min(520px, calc(100vw - 30px))';
    host.style.maxWidth = 'calc(100vw - 30px)';
    host.style.overflow = 'hidden';

    var status = st.status || 'pending';
    var breach = !!(st.barrierBreach || nd.snap.barrierBreach);
    var hardStop = !!def.hardStop;
    var requiredEv = def.requiredEvidence || [];
    var rawEv = st.evidenceCollected || st.evidenceMap || st.evidence || {};
    var evState = Array.isArray(rawEv)
      ? rawEv.reduce(function (acc, key) { acc[key] = true; return acc; }, {})
      : rawEv;
    var doneCount = 0;
    for (var i = 0; i < requiredEv.length; i++) if (evState[requiredEv[i]]) doneCount++;
    var pct = requiredEv.length ? Math.round(doneCount / requiredEv.length * 100) : 0;

    var maxScore = (def.scoreImpact && def.scoreImpact.correct) || def.weight || def.max || 0;
    var earned = st.scoreEarned || 0;

    // header
    var html = '<div class="intraop-node-popup' + (hardStop ? ' hardstop' : '') + (breach ? ' breach' : '') + '">';
    html += '<div class="intraop-node-header">';
    html += '<div class="intraop-node-title">' + escapeHtml(def.label || nodeId) + '</div>';
    if (def.gcklItem) html += '<div class="intraop-node-desc">' + escapeHtml(def.gcklItem) + '</div>';
    html += '<div class="intraop-node-chips">';
    html += '<span class="intraop-node-chip cat">' + escapeHtml(categoryLabel(def.category)) + '</span>';
    html += '<span class="intraop-node-chip gckl">WHO SSC</span>';
    html += '<span class="intraop-node-chip role">' + escapeHtml((def.role && def.role[0]) || 'Ekip') + '</span>';
    html += '<span class="intraop-node-chip score">' + earned + '/' + maxScore + ' puan</span>';
    html += '<span class="intraop-node-chip status-' + (breach ? 'breach' : status) + '">' + escapeHtml(statusLabel(breach ? 'breach' : status)) + '</span>';
    if (hardStop) html += '<span class="intraop-node-chip hardstop">HARD-STOP</span>';
    html += '</div></div>';

    // scroll body
    html += '<div class="intraop-node-scroll">';

    // progress
    if (requiredEv.length) {
      html += '<div class="intraop-node-progress">';
      html += '<div class="intraop-node-progress-bar"><div class="intraop-node-progress-fill" style="width:' + pct + '%"></div></div>';
      html += '<div class="intraop-node-progress-text">' + doneCount + '/' + requiredEv.length + '</div>';
      html += '</div>';
    }

    // role
    html += '<div class="intraop-node-section"><div class="intraop-node-section-title">Rol / Sorumluluk</div>';
    html += '<div class="intraop-node-role-box">' + escapeHtml(buildRoleText(def)) + '</div></div>';

    // linked task
    html += '<div class="intraop-node-section"><div class="intraop-node-section-title">Bağlı Öğrenme Görevi</div>';
    html += '<div class="intraop-node-task-link">' + buildLinkedTask(def, nodeId) + '</div></div>';

    // risk box
    var riskText = def.criticalIfMissing || def.feedbackText || def.criticalRisk || '';
    if (hardStop && !riskText) riskText = 'Bu adım atlanırsa kritik güvenlik bariyer ihlali oluşur ve faz geçişi kilitlenir.';
    if (riskText) {
      html += '<div class="intraop-node-section"><div class="intraop-node-section-title">Kritik Hata Riski</div>';
      html += '<div class="intraop-node-risk ' + (hardStop ? 'hardstop' : 'warning') + '">';
      html += '<b>' + (hardStop ? 'Hard-Stop' : 'Dikkat') + '</b>' + escapeHtml(riskText);
      html += '</div></div>';
    }

    // evidence action buttons (preop dilinde — komut tonu)
    if (requiredEv.length) {
      html += '<div class="intraop-node-section"><div class="intraop-node-section-title">Doğrulama / Sorgulama Adımları</div>';
      html += '<div class="intraop-node-actions">';
      var evLabels = (def.evidenceLabels || {});
      var fbLabels = (EVIDENCE_LABELS[nodeId] || {});
      var firstActiveSet = false;
      for (var j = 0; j < requiredEv.length; j++) {
        var ek = requiredEv[j];
        var done = !!evState[ek];
        var lbl = evLabels[ek] || fbLabels[ek] || ek.replace(/_/g, ' ');
        var cls = 'intraop-node-action-btn';
        if (done) cls += ' done';
        else if (!firstActiveSet) { cls += ' primary'; firstActiveSet = true; }
        html += '<button class="' + cls + '" data-ev="' + escapeHtml(ek) + '"' + (done ? ' disabled' : '') + '>' + escapeHtml(lbl) + '</button>';
      }
      html += '</div></div>';
    }

    // MCQ trigger butonu + hint butonu (preop dilinde)
    var hasMcq = !!(def.rationaleQuestion && def.options && def.options.length);
    var mcqAnswered = hasMcq && (typeof st.rationaleAnswer === 'number');
    html += '<div class="intraop-node-section"><div class="intraop-node-actions">';
    if (hasMcq && !mcqAnswered) {
      html += '<button class="intraop-node-action-btn mcq" data-mcq-toggle="1">🎭  Mikro senaryo + karar sorusu</button>';
    }
    html += '<button class="intraop-node-action-btn hint" data-hint="1">✨  Hastaya özel klinik ipucu al</button>';
    html += '</div></div>';

    // MCQ inline (cevaplanmışsa otomatik açık, cevaplanmamışsa kart içinde açılabilir)
    if (hasMcq) {
      var answered = mcqAnswered;
      var correctIdx = (typeof def.correctOption === 'number') ? def.correctOption : (def.correctAnswer != null ? def.correctAnswer : -1);
      html += '<div class="intraop-node-section"><div class="intraop-node-section-title">Mikro Karar Senaryosu</div>';
      html += '<div class="intraop-node-mcq">';
      html += '<div class="intraop-node-mcq-q">' + escapeHtml(def.rationaleQuestion) + '</div>';
      for (var k = 0; k < def.options.length; k++) {
        var opt = def.options[k];
        var optText = (typeof opt === 'string') ? opt : (opt.text || '');
        var cls = '';
        if (answered) {
          if (k === correctIdx) cls = ' correct';
          else if (k === st.rationaleAnswer) cls = ' wrong';
        }
        html += '<button class="intraop-node-mcq-opt' + cls + '" data-mcq="' + k + '"' + (answered ? ' disabled' : '') + '>' + escapeHtml(optText) + '</button>';
      }
      if (answered) {
        var ok = (st.rationaleAnswer === correctIdx);
        var fb = ok ? (def.feedbackCorrect || 'Doğru — güvenli klinik karar.') : (def.feedbackWrong || def.feedbackText || 'Yanlış karar; güvenli olmayan klinik seçim.');
        html += '<div class="intraop-node-mcq-feedback ' + (ok ? 'correct' : 'wrong') + '">' + escapeHtml(fb) + '</div>';
      }
      html += '</div></div>';
    }

    // stop bonus button (kritik node, henüz cevaplanmamış)
    if (hardStop && !st.stopAwarded && status !== 'complete') {
      html += '<button class="intraop-node-stop-btn" data-stop="1">⛔ Güvenli olmadığı için SÜRECİ DURDURUYORUM (stop bonus)</button>';
    }

    // GCKL haritalama
    html += '<div class="intraop-node-section"><div class="intraop-node-section-title">GCKL Haritalama</div>';
    html += '<dl class="intraop-node-map">';
    html += '<dt>GCKL</dt><dd>' + escapeHtml(def.gcklItem || def.label || '—') + '</dd>';
    html += '<dt>Node</dt><dd>' + escapeHtml(nodeId) + '</dd>';
    var tagList = def.linkedTasks || def.taskTags || [];
    if (typeof tagList === 'string') tagList = [tagList];
    html += '<dt>Görev tag</dt><dd>' + escapeHtml(tagList.join(' + ') || '—') + '</dd>';
    html += '<dt>3D nesne</dt><dd>' + escapeHtml(clinicalKey || (def.linkedObjects || []).join(', ') || '—') + '</dd>';
    html += '<dt>Puan</dt><dd>' + earned + ' / ' + maxScore + '</dd>';
    html += '<dt>Hard-stop</dt><dd>' + (hardStop ? 'Evet' : 'Hayır') + '</dd>';
    html += '</dl></div>';

    html += '</div>'; // scroll
    html += '</div>'; // popup

    host.innerHTML = html;
    host.style.display = 'block';

    // konum
    if (typeof x === 'number' && typeof y === 'number') {
      var w = 420, h = 480;
      var px = Math.min(Math.max(10, x + 14), window.innerWidth - w - 10);
      var py = Math.min(Math.max(10, y + 14), window.innerHeight - h - 10);
      host.style.left = px + 'px';
      host.style.top = py + 'px';
    }

    // event delegation
    host.onclick = function (e) {
      var t = e.target.closest('[data-ev],[data-mcq],[data-stop]');
      if (!t) return;
      var net = getNet();
      if (!net) return;
      if (t.dataset.ev && net.markEvidence) {
        if (typeof window.intraGcklOnEvidence === 'function') {
          window.intraGcklOnEvidence(nodeId, t.dataset.ev, obj || { opts: { clinicalKey: clinicalKey } });
        } else {
          net.markEvidence(nodeId, t.dataset.ev);
        }
        renderIntraopGcklNodePopup(nodeId, obj, null, null);
      } else if (t.dataset.mcq != null && net.answerRationale) {
        net.answerRationale(nodeId, +t.dataset.mcq);
        renderIntraopGcklNodePopup(nodeId, obj, null, null);
      } else if (t.dataset.mcqToggle) {
        var box = host.querySelector('.intraop-node-mcq');
        if (box) box.scrollIntoView({block: 'nearest', behavior: 'smooth'});
      } else if (t.dataset.hint) {
        var hint = (def.clinicalHint || def.feedbackText || 'Bu adım için klinik ipucu: ' + (def.gcklItem || def.label || ''));
        if (window.showClinicalHint) window.showClinicalHint(nodeId, hint);
        else alert('✨ ' + hint);
      } else if (t.dataset.stop && net.markCorrectStop) {
        net.markCorrectStop(nodeId);
        renderIntraopGcklNodePopup(nodeId, obj, null, null);
      }
    };

    return true;
  }

  // ----- showObjPopup hook -----
  function installHook() {
    if (typeof window.showObjPopup !== 'function') {
      // henüz tanımlı değil — bir sonraki frame'de dene
      return false;
    }
    if (window.__intraGcklPopupHooked) return true;
    var orig = window.showObjPopup;
    window.showObjPopup = function (obj, x, y) {
      try {
        var room = (window.App && window.App.currentRoom) || '';
        var key = (obj && obj.opts && obj.opts.clinicalKey) || (obj && obj.clinicalKey) || '';
        // === ADIM 1 mimarisi: v2 önceliği (defansif kontrol) ===
        // v2 INTRA_POPUPS bu key için kart sahibi ise eski yol devreye girmez.
        // Normalde v2 wrapper'ı bu wrapper'ın üstündedir ve buraya zaten ulaşılmaz;
        // bu kontrol wrapper sırası bozulursa veya v2 yüklenememişse devreye girer.
        if (typeof window.resolveIntraCard === 'function' && window.resolveIntraCard(key)) {
          return orig.apply(this, arguments); // v2 sahip — alt zincire bırak, popup açma
        }
        var nodeId = getIntraopNodeByClinicalKey(key);
        if (room === 'intraop' && nodeId) {
          console.log('[ROUTER] intraop %s → legacy renderIntraopGcklNodePopup (FALLBACK)', key);
          if (renderIntraopGcklNodePopup(nodeId, obj, x, y)) return;
        } else if (room === 'intraop' && key) {
          console.warn('[INTRA-GCKL] Unmapped intraop clinicalKey:', key);
        }
      } catch (err) {
        console.warn('[INTRA-GCKL] popup hook err', err);
      }
      return orig.apply(this, arguments);
    };
    window.__intraGcklPopupHooked = true;
    console.log('[INTRA-GCKL] showObjPopup hook kuruldu (fallback rol — v2 birincil).');
    return true;
  }

  // showObjPopup wrapper'lardan sonra kurulması için biraz geç
  function waitAndInstall() {
    if (installHook()) return;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (installHook() || tries > 40) clearInterval(iv);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitAndInstall);
  } else {
    waitAndInstall();
  }

  // export
  window.IntraopGcklPopup = {
    render: renderIntraopGcklNodePopup,
    nodeForKey: getIntraopNodeByClinicalKey,
    map: K2N
  };
  window.__intraGcklPopupFallbackDelegates = true;
  window.getIntraopNodeByClinicalKey = getIntraopNodeByClinicalKey;
  window.renderIntraopGcklNodePopup = renderIntraopGcklNodePopup;
})();

/* ===== End inline intra-gckl-popup.js ===== */
