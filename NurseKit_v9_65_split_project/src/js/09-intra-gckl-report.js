/* ===== Inlined from intra-gckl-report.js ===== */
/* =====================================================================
   INTRA_GCKL Report Injection — Aşama 3.5
   Intraop debrief bloğunu rapor ekranına ekler.
   Tek kaynak: IntraopGCKL.compute() snapshot.
   Preop/postop raporlarına dokunmaz.
   ===================================================================== */
(function () {
  'use strict';

  var CATEGORY_LABELS = {
    timeOutVerify: 'Time-out & Doğrulama',
    anesthesiaBlood: 'Anestezi & Kan Yönetimi',
    sterileEquipment: 'Steril / Cihaz / Pozisyon',
    countSpecimen: 'Sayım / Numune / Ekipman',
    signOut: 'Sign-out & Teslim',
    criticalSafety: 'Time-out & Doğrulama',
    clinicalPrep: 'Steril / Cihaz / Pozisyon',
    communication: 'Sign-out & Teslim',
    reasoningBonus: 'Gerekçelendirme Bonusu'
  };

  var NODE_GROUP = {
    timeOutTeam: 'incision', patientProcedureSite: 'incision',
    imagingAndResults: 'incision', antibioticProphylaxis: 'incision',
    anesthesiaSafety: 'incision', bloodLossRisk: 'incision',
    equipmentAndFireSafety: 'incision', sterileFieldAndTraffic: 'incision',
    positioningAndTemperature: 'incision',
    countSafety: 'both',
    specimenAndEquipmentIssue: 'closure', signOutHandoff: 'closure'
  };

  function wrap() {
    if (typeof window.renderReport !== 'function') return setTimeout(wrap, 300);
    if (window.__intraGcklReportInstalled) return;
    window.__intraGcklReportInstalled = true;
    var orig = window.renderReport;
    window.renderReport = function () {
      try { orig.apply(this, arguments); } catch (e) { console.warn('renderReport err', e); }
      try { inject(); } catch (e) { console.warn('INTRA-GCKL report inj fail', e); }
    };
  }

  function ensureCss() {
    if (document.getElementById('intra-gckl-report-styles')) return;
    var s = document.createElement('style');
    s.id = 'intra-gckl-report-styles';
    s.textContent = ''
      + '.igcklr-block{margin-top:18px;background:#0a1218;border:1px solid #1b3949;border-radius:10px;padding:14px;color:#cfe7ee;font-size:13px}'
      + '.igcklr-block.breach{border-color:#7a2330;box-shadow:0 0 0 1px #7a2330 inset}'
      + '.igcklr-block h3{margin:0 0 10px;font-size:15px;color:#e7f6fa;border-bottom:1px solid #18313e;padding-bottom:6px}'
      + '.igcklr-score{display:flex;align-items:baseline;gap:10px;margin-bottom:12px}'
      + '.igcklr-score .num{font-size:32px;font-weight:700;color:#7fe2a3}'
      + '.igcklr-score.breach .num{color:#f0a0aa}'
      + '.igcklr-score .max{color:#8fb3bf;font-size:14px}'
      + '.igcklr-breach{background:rgba(192,57,43,.10);border-left:3px solid #c0392b;padding:8px 10px;border-radius:4px;margin:8px 0;color:#f0b5b0;font-size:12.2px}'
      + '.igcklr-stop{background:rgba(63,196,128,.10);border-left:3px solid #3fc480;padding:8px 10px;border-radius:4px;margin:8px 0;color:#a0e6bd;font-size:12.2px}'
      + '.igcklr-cats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}'
      + '.igcklr-cat{background:#0e1f2a;border:1px solid #16384a;border-radius:5px;padding:7px 9px}'
      + '.igcklr-cat-name{font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:#6fa6b6;font-weight:700}'
      + '.igcklr-cat-val{font-size:14px;color:#cfe7ee;font-weight:600;margin-top:2px}'
      + '.igcklr-cat-bar{height:4px;background:#0a1822;border-radius:3px;margin-top:4px;overflow:hidden}'
      + '.igcklr-cat-bar-fill{height:100%;background:linear-gradient(90deg,#1a8f73,#52d4af)}'
      + '.igcklr-section{margin-top:12px}'
      + '.igcklr-section-title{font-size:11px;text-transform:uppercase;letter-spacing:.7px;color:#6fa6b6;font-weight:700;margin-bottom:5px}'
      + '.igcklr-list{margin:0;padding-left:18px;color:#9ed1de;font-size:12px;line-height:1.5}'
      + '.igcklr-list li{margin:2px 0}'
      + '.igcklr-list li.bad{color:#f0a0aa}'
      + '.igcklr-list li.good{color:#a0e6bd}'
      + '.igcklr-list li.warn{color:#e2c97e}'
      + '.igcklr-empty{color:#6fa6b6;font-style:italic;font-size:11.5px}'
      + '.igcklr-barriers{display:flex;gap:10px;margin-top:10px}'
      + '.igcklr-barrier{flex:1;background:#0e1f2a;border:1px solid #16384a;border-radius:5px;padding:8px 10px}'
      + '.igcklr-barrier .h{font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:#6fa6b6;font-weight:700;margin-bottom:4px}'
      + '.igcklr-barrier .v{font-size:13px;color:#cfe7ee;font-weight:600}'
      + '.igcklr-barrier.ok .v{color:#7fe2a3}'
      + '.igcklr-barrier.bad .v{color:#f0a0aa}';
    document.head.appendChild(s);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ADIM 7: Eksik evidence için klinik anlam haritası (öğrenciye geri bildirim için)
  var EVIDENCE_MEANING = {
    team_attention:               'Time-out ekip dikkatini toplama bariyeri tamamlanmadı.',
    identity_verbal:              'Hasta kimliği sözel doğrulaması yapılmadı.',
    procedure_verbal:             'İşlem adı sözel olarak ekipçe doğrulanmadı.',
    site_marking_visible:         'Cerrahi taraf/bölge işareti görsel doğrulaması yapılmadı.',
    imaging_displayed:            'Gerekli görüntüleme ekipçe erişilebilir kılınmadı.',
    antibiotic_time_verified:     'Antibiyotik profilaksi zamanı doğrulanmadı (≤60 dk içinde verilmeli).',
    allergy_cross_checked:        'Alerji çapraz kontrolü yapılmadı; uyumsuz antibiyotik riski.',
    airway_secured:               'Havayolu güvenliği doğrulanmadı.',
    spo2_reliable:                'SpO₂ dalga formu güvenilirliği değerlendirilmedi.',
    critical_risks_shared:        'Anestezi kritik riskleri ekipçe paylaşılmadı.',
    expected_loss_announced:      'Beklenen kan kaybı ekipçe konuşulmadı.',
    blood_availability_confirmed: 'Kan/kan ürünü hazırlığı doğrulanmadı.',
    esu_pad_position:             'ESU hasta plakası pozisyonu kontrol edilmedi (yanık riski).',
    antiseptic_dry:               'Antiseptik kuruma doğrulanmadı; ıslak alanda ESU yangın riskidir.',
    fire_triangle_assessed:       'Yangın üçgeni (O₂+yakıt+ateş) değerlendirilmedi.',
    sterile_field_intact:         'Steril alan bütünlüğü doğrulanmadı.',
    traffic_controlled:           'Oda trafiği kontrol edilmedi; SSI ve dikkat dağınıklığı riski.',
    positioning_safe:             'Hasta pozisyonu ve bası noktaları doğrulanmadı.',
    active_warming_on:            'Aktif ısıtma doğrulanmadı; hipotermi riski.',
    count_initial:                'Başlangıç sayımı yapılmadı; RSI riski.',
    count_final:                  'Kapanış sayımı doğrulanmadı; sign-out güvenli kabul edilemez.',
    specimen_labeled:             'Numune etiketi hasta bilgisiyle çapraz doğrulanmadı.',
    equipment_issues_reported:    'Ekipman sorunu durumu kayıt altına alınmadı.',
    procedure_announced:          'Yapılan işlem sign-out sırasında ekipçe doğrulanmadı.',
    count_final_confirmed:        'Kapanış sayımı sign-out sırasında onaylanmadı.',
    specimen_confirmed:           'Numune durumu sign-out sırasında doğrulanmadı.',
    equipment_issues_announced:   'Ekipman sorunu sign-out sırasında paylaşılmadı.',
    postop_critical_plan:         'Postop kritik bakım planı aktarılmadan transfer güvenli değildir.'
  };

  function evMeaning(ev) {
    return EVIDENCE_MEANING[ev] || ('Eksik evidence: ' + ev);
  }

  function inject() {
    ensureCss();
    var report = document.querySelector('#report-screen .report-doc');
    if (!report) return;
    var ig = window.IntraopGCKL;
    if (!ig || !ig.compute) return;
    var prev = document.getElementById('igcklr-report-block');
    if (prev) prev.remove();

    var snap = ig.compute();
    if (!snap || !snap.nodes) return;

    // ADIM 7 DÜZELTMESİ: doğru node-definition kaynağı
    var defs = (ig.getAll && ig.getAll()) || ig._NODES || ig.NODES || {};
    // ADIM 7 DÜZELTMESİ: hard-stop'u doğru field'dan oku
    var breach = !!(snap.breaches && snap.breaches.length > 0);
    var total = snap.total != null ? snap.total : 0;
    if (breach) total = Math.min(total, 49);

    // kategori toplamları
    var cats = { timeOutVerify: { e: 0, m: 0 }, anesthesiaBlood: { e: 0, m: 0 }, sterileEquipment: { e: 0, m: 0 }, countSpecimen: { e: 0, m: 0 }, signOut: { e: 0, m: 0 }, reasoningBonus: { e: snap.reasoningBonus || 0, m: 10 } };
    var CAT_MAP = {
      timeOutTeam: 'timeOutVerify', patientProcedureSite: 'timeOutVerify', imagingAndResults: 'timeOutVerify', antibioticProphylaxis: 'timeOutVerify',
      anesthesiaSafety: 'anesthesiaBlood', bloodLossRisk: 'anesthesiaBlood',
      equipmentAndFireSafety: 'sterileEquipment', sterileFieldAndTraffic: 'sterileEquipment', positioningAndTemperature: 'sterileEquipment',
      countSafety: 'countSpecimen', specimenAndEquipmentIssue: 'countSpecimen',
      signOutHandoff: 'signOut'
    };
    var completed = [], missing = [], breaches = [], stops = [], wrongMcq = [], missingEv = [], signoutGaps = [];
    var incisionMissing = [], closureMissing = [];

    Object.keys(snap.nodes).forEach(function (id) {
      var st = snap.nodes[id] || {};
      var def = defs[id] || {};
      var max = (def.scoreImpact && def.scoreImpact.correct) || def.weight || def.max || 0;
      var earned = st.earned != null ? st.earned : (st.scoreEarned || 0);
      var cat = CAT_MAP[id];
      if (cat && cats[cat]) { cats[cat].e += earned; cats[cat].m += max; }

      var lbl = def.label || st.label || id;
      var status = st.status || 'pending';

      // ADIM 7 DÜZELTMESİ: bariyer ihlali → compute() nodeReport'taki 'breach' field'i
      if (st.breach || status === 'wrong') breaches.push(lbl);

      // ADIM 7 DÜZELTMESİ: doğru durdurma → raw node'un stoppedCorrectly field'inden
      var rawNode = (ig.getNode && ig.getNode(id)) || null;
      if (rawNode && rawNode.stoppedCorrectly) stops.push(lbl);

      if (status === 'complete') completed.push(lbl);
      else missing.push(lbl + ' (' + earned + '/' + max + ')');

      // ADIM 7 DÜZELTMESİ: eksik evidence — evidence array, object değil
      var req = def.requiredEvidence || [];
      var evList = Array.isArray(st.evidence) ? st.evidence : Object.keys(st.evidence || {});
      var ev = [];
      for (var i = 0; i < req.length; i++) if (evList.indexOf(req[i]) === -1) ev.push(req[i]);
      if (ev.length) missingEv.push({ id: id, label: lbl, ev: ev });

      // ADIM 7 DÜZELTMESİ: yanlış MCQ — compute() rationale object'inden
      if (st.rationale && st.rationale.answered && st.rationale.correct === false) {
        wrongMcq.push(lbl);
      }

      // bariyer grupları
      var grp = NODE_GROUP[id];
      if ((grp === 'incision' || grp === 'both') && status !== 'complete') incisionMissing.push(lbl);
      if ((grp === 'closure' || grp === 'both') && status !== 'complete') closureMissing.push(lbl);

      // sign-out evidence gaps
      if (id === 'signOutHandoff') {
        for (var k = 0; k < req.length; k++) {
          if (evList.indexOf(req[k]) === -1) signoutGaps.push(req[k]);
        }
      }
    });

    // strong / weak alanlar
    var strong = [], weak = [];
    Object.keys(cats).forEach(function (k) {
      if (!cats[k].m) return;
      var pct = cats[k].e / cats[k].m;
      if (pct >= 0.85) strong.push(CATEGORY_LABELS[k] || k);
      else if (pct < 0.5) weak.push(CATEGORY_LABELS[k] || k);
    });

    // ----- HTML
    var html = '';
    html += '<div class="igcklr-score' + (breach ? ' breach' : '') + '"><span class="num">' + total + '</span><span class="max">/ 100 — Intraop Score</span></div>';

    if (breach) html += '<div class="igcklr-breach"><b>Kritik güvenlik bariyer ihlali</b><br>İntraop skoru 49/100 tavanına düşürüldü. İhlaller: ' + esc(breaches.join(', ')) + '</div>';
    if (stops.length) html += '<div class="igcklr-stop"><b>Doğru durdurma kararı (+' + stops.length + ' bonus)</b><br>' + esc(stops.join(', ')) + ' — öğrenci güvenli olmayan durumda süreci durdurdu.</div>';

    // kategori grid
    html += '<div class="igcklr-cats">';
    Object.keys(cats).forEach(function (k) {
      var c = cats[k]; if (!c.m) return;
      var p = Math.round((c.e / c.m) * 100);
      html += '<div class="igcklr-cat"><div class="igcklr-cat-name">' + esc(CATEGORY_LABELS[k] || k) + '</div>';
      html += '<div class="igcklr-cat-val">' + c.e + ' / ' + c.m + '</div>';
      html += '<div class="igcklr-cat-bar"><div class="igcklr-cat-bar-fill" style="width:' + p + '%"></div></div></div>';
    });
    html += '</div>';

    // bariyer kümeleri
    var incOk = incisionMissing.length === 0;
    var cloOk = closureMissing.length === 0;
    html += '<div class="igcklr-barriers">';
    html += '<div class="igcklr-barrier ' + (incOk ? 'ok' : 'bad') + '"><div class="h">Kesi öncesi güvenlik bariyerleri</div>';
    html += '<div class="v">' + (incOk ? 'Tam ✓' : (incisionMissing.length + ' eksik')) + '</div></div>';
    html += '<div class="igcklr-barrier ' + (cloOk ? 'ok' : 'bad') + '"><div class="h">Kapanış / Sign-out bariyerleri</div>';
    html += '<div class="v">' + (cloOk ? 'Tam ✓' : (closureMissing.length + ' eksik')) + '</div></div>';
    html += '</div>';

    function listBlock(title, items, cls) {
      if (!items || !items.length) return '<div class="igcklr-section"><div class="igcklr-section-title">' + title + '</div><div class="igcklr-empty">Yok.</div></div>';
      var h = '<div class="igcklr-section"><div class="igcklr-section-title">' + title + '</div><ul class="igcklr-list">';
      for (var i = 0; i < items.length; i++) h += '<li class="' + (cls || '') + '">' + esc(items[i]) + '</li>';
      return h + '</ul></div>';
    }

    html += listBlock('Tamamlanan intraop GCKL node\'ları (' + completed.length + ')', completed, 'good');
    html += listBlock('Eksik intraop GCKL node\'ları (' + missing.length + ')', missing, 'warn');
    html += listBlock('Kritik bariyer ihlalleri', breaches, 'bad');
    html += listBlock('Doğru durdurma kararları', stops, 'good');
    html += listBlock('Yanlış gerekçelendirme cevapları', wrongMcq, 'bad');

    // ADIM 7: eksik evidence raporu — her bir evidence için klinik anlam dahil
    if (missingEv.length) {
      var evItems = [];
      missingEv.forEach(function (m) {
        m.ev.forEach(function (ek) {
          evItems.push(m.label + ' / ' + ek + ' — ' + evMeaning(ek));
        });
      });
      html += listBlock('Eksik evidence adımları (klinik anlamlarıyla)', evItems, 'warn');
    } else {
      html += listBlock('Eksik evidence adımları (klinik anlamlarıyla)', [], '');
    }

    if (signoutGaps.length) {
      var sgItems = signoutGaps.map(function (g) { return g + ' — ' + evMeaning(g); });
      html += listBlock('Sign-out / teslim eksikleri', sgItems, 'bad');
    }

    html += listBlock('Güçlü alanlar', strong, 'good');
    html += listBlock('Geliştirilmesi gereken alanlar', weak, 'warn');

    // ADIM 7: "Bir sonraki denemede neyi düzeltmeli" otomatik öneri bloğu
    var suggestions = [];
    if (breach) {
      suggestions.push('Kritik güvenlik bariyer ihlali yapıldı — bir sonraki denemede hard-stop tetikleyen kart MCQ\'larını dikkatle oku ve klinik karar verme süresine yatırım yap.');
    }
    if (!snap.canCloseSignout || !snap.canCloseSignout.ok) {
      suggestions.push('Sign-out / kapanış bariyerleri eksik kapatıldı — kapanış sayımı, numune doğrulama ve postop kritik bakım planı her zaman beş evidence olarak tamamlanmalı.');
    }
    if (!snap.canStartIncision || !snap.canStartIncision.ok) {
      suggestions.push('Kesi öncesi bariyerler eksik geçildi — kesi başlamadan time-out, hasta/işlem/bölge doğrulaması, antibiyotik profilaksi ve cihaz güvenliği tamamlanmalı.');
    }
    if (wrongMcq.length > 2) {
      suggestions.push('Birden fazla MCQ yanlış cevaplandı — klinik karar sorularına daha fazla zaman ayır; yanlış seçenekler genelde gerçek hata desenlerini temsil eder.');
    }
    if (missingEv.length > 5) {
      suggestions.push('Çok sayıda evidence adımı atlandı — kartları açtığında alt adım butonlarını sırayla tamamla; her buton ayrı bir güvenlik bariyerini doğrular.');
    }
    if (stops.length === 0 && breach) {
      suggestions.push('Güvenli olmayan durumda süreci durdurma kararı vermedin — kart üzerindeki "Süreci durduruyorum" butonu klinik karar gücünü gösterir ve +2 bonus verir.');
    }
    if (suggestions.length === 0 && total >= 85) {
      suggestions.push('Genel performans yüksek; varsa kalan eksik evidence adımlarını ve klinik gerekçelendirme bonusunu hedefle.');
    }
    html += listBlock('Bir sonraki denemede neyi düzeltmeli', suggestions, suggestions.length ? 'warn' : 'good');

    // ADIM 7: kesi öncesi & sign-out durum cümlesi (spec madde 7 ve 8)
    var statusLineInc = incOk
      ? 'Kesi öncesi güvenlik bariyerleri tamamlandı.'
      : 'Kesi öncesi güvenlik bariyerleri eksik (' + incisionMissing.length + ' bariyer): ' + incisionMissing.join(', ') + '.';
    var statusLineClo = cloOk
      ? 'Kapanış ve sign-out bariyerleri tamamlandı.'
      : 'Kapanış ve sign-out bariyerleri eksik (' + closureMissing.length + ' bariyer): ' + closureMissing.join(', ') + '.';
    html += '<div class="igcklr-section"><div class="igcklr-section-title">Bariyer Özet Cümleleri</div>'
         +  '<ul class="igcklr-list">'
         +  '<li class="' + (incOk ? 'good' : 'warn') + '">' + esc(statusLineInc) + '</li>'
         +  '<li class="' + (cloOk ? 'good' : 'warn') + '">' + esc(statusLineClo) + '</li>'
         +  '</ul></div>';

    var block = document.createElement('div');
    block.id = 'igcklr-report-block';
    block.className = 'igcklr-block' + (breach ? ' breach' : '');
    block.innerHTML = '<h3>Intraoperatif GCKL Debrief</h3>' + html;
    report.appendChild(block);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wrap);
  else wrap();

  window.IntraopGcklReport = { inject: inject };
})();

/* ===== End inline intra-gckl-report.js ===== */
