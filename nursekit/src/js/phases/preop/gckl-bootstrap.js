/* ===== Inlined from pre-gckl-bootstrap.js ===== */
/* =====================================================================
   PRE_GCKL — Bootstrap / UI / Hook Layer
   pre-gckl-network.js'i NurseKit ana akışına bağlar.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.PreopGCKL) { console.warn('[PRE-GCKL] Network modülü yüklenmedi.'); return; }

  const PG = window.PreopGCKL;
  const STATE = PG.freshState();
  window.__preopGcklState = STATE;

  // Görev tag → düğüm haritası (mevcut t_* tag sistemine köprü)
  const TAG_TO_NODE = {
    't_id': 'identity',
    't_consent': 'consent',
    't_surgery_verify': 'consent',
    't_site_mark': 'site',
    't_allergy': 'allergy',
    't_npo': 'labImaging',
    't_lab_review': 'labImaging',
    't_imaging_review': 'labImaging',
    't_blood': 'crossmatch',
    't_crossmatch': 'crossmatch',
    't_med_recon': 'medRecon',
    't_anticoag': 'medRecon',
    't_iv': 'ivMonitor',
    't_vitals': 'ivMonitor',
    't_monitor': 'ivMonitor',
    't_skin_prep': 'skinPrep',
    't_clipper': 'skinPrep',
    't_vte_prep': 'vte',
    't_delirium': 'delirium',
    't_anxiety': 'anxiety',
    't_education': 'patientEdu',
    't_teach_back': 'teachBack',
    't_signin': 'transferClose',
    't_transfer': 'transferClose',
    't_preop_close': 'transferClose'
  };

  function nodeForTag(tag) { return TAG_TO_NODE[tag] || null; }

  // Ağ kategorisi → mevcut SCORE_CATEGORIES eşlemesi
  const NODE_TO_APP_CATEGORIES = {
    criticalSafety: ['patientSafety', 'checklistPerformance'],
    clinicalPrep:   ['clinicalAssessment', 'surgicalNursingKnowledge'],
    communication:  ['communication', 'patientCentredCare']
  };

  // Düğüm bazında en son senkronlanan delta
  const SYNCED = {};
  Object.keys(PG.NODES).forEach(id => { SYNCED[id] = { earned: 0, lost: 0 }; });

  function pushDeltaToAppScores(nodeId, newEarned, newLost) {
    if (!window.App || !window.App.scores || typeof window.addScore !== 'function') return;
    const def = PG.NODES[nodeId];
    const cats = NODE_TO_APP_CATEGORIES[def.category] || ['patientSafety'];
    const dE = newEarned - SYNCED[nodeId].earned;
    const dL = newLost - SYNCED[nodeId].lost;
    if (dE !== 0) window.addScore(cats, dE, 0);
    if (dL > 0)  window.addScore(cats, -dL, 0);
    // clinicalReasoning'e bonus akışı
    if (dE > 0 && def.criticalErrorIfWrong) {
      try { window.addScore(['clinicalReasoning'], Math.min(2, dE), 0); } catch(e) {}
    }
    if (dL > 0 && def.criticalErrorIfWrong) {
      try { window.addScore(['clinicalReasoning'], -Math.min(2, dL), 0); } catch(e) {}
    }
    SYNCED[nodeId].earned = newEarned;
    SYNCED[nodeId].lost = newLost;
  }

  function syncAllToAppScores() {
    Object.keys(PG.NODES).forEach(id => {
      const n = STATE.nodes[id];
      if (!n) return;
      pushDeltaToAppScores(id, n.scoreEarned, n.scoreLost);
    });
  }

  // Yanlış cevap toast
  function showWrongToast(text, points) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:80px;right:20px;z-index:99999;background:linear-gradient(135deg,#c8323a,#7a1a1f);color:#fff;padding:12px 16px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.5);font:600 13px Inter,sans-serif;border:1px solid rgba(255,255,255,.2);max-width:320px;animation:pgWrongIn .3s ease';
    t.innerHTML = `<div style="font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">⛔ Yanlış klinik karar</div><div>${text}</div><div style="margin-top:6px;font-family:JetBrains Mono,monospace;font-size:14px;color:#ffc8c8">${points} puan</div>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 3500);
    setTimeout(() => t.remove(), 4200);
  }
  function showCorrectToast(text, points) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:80px;right:20px;z-index:99999;background:linear-gradient(135deg,#2c8a5a,#1a5a3c);color:#fff;padding:12px 16px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.5);font:600 13px Inter,sans-serif;border:1px solid rgba(255,255,255,.2);max-width:320px;';
    t.innerHTML = `<div style="font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">✓ Doğru klinik karar</div><div>${text}</div><div style="margin-top:6px;font-family:JetBrains Mono,monospace;font-size:14px;color:#c8ffc8">+${points} puan</div>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 3000);
    setTimeout(() => t.remove(), 3700);
  }

  // === Görev tamamlandığında çağrılacak public API ===
  window.preopGcklOnTaskComplete = function (tag) {
    const id = nodeForTag(tag);
    if (!id) return;
    const node = PG.NODES[id];
    if (!node) return;
    // Her görev en az 1 evidence sayar
    const cur = STATE.nodes[id].evidenceMet;
    PG.markEvidence(STATE, id, cur + 1);
    // Tüm evidence toplandıysa veya rationale answered ise complete et
    if (STATE.nodes[id].evidenceMet >= node.requiredEvidence.length) {
      if (STATE.nodes[id].status === 'pending') PG.completeNode(STATE, id);
    }
    pushDeltaToAppScores(id, STATE.nodes[id].scoreEarned, STATE.nodes[id].scoreLost);
    refreshUI();
  };

  window.preopGcklAnswerRationale = function (nodeId, optionIndex) {
    const r = PG.answerRationale(STATE, nodeId, optionIndex);
    if (r.correct && STATE.nodes[nodeId].status === 'pending') {
      PG.completeNode(STATE, nodeId);
    }
    pushDeltaToAppScores(nodeId, STATE.nodes[nodeId].scoreEarned, STATE.nodes[nodeId].scoreLost);
    const def = PG.NODES[nodeId];
    if (r.correct) {
      showCorrectToast(def.label, def.scoreImpact.correct);
    } else {
      const lostPts = -(def.scoreImpact.wrong || 0);
      const msg = r.barrierBreach
        ? `${def.label} — Kritik güvenlik bariyer ihlali. Transfer kilitlendi.`
        : `${def.label} — Eksik/yanlış klinik karar.`;
      showWrongToast(msg, lostPts);
    }
    refreshUI();
    return r;
  };

  window.preopGcklMarkStop = function (nodeId) {
    PG.markCorrectStop(STATE, nodeId);
    pushDeltaToAppScores(nodeId, STATE.nodes[nodeId].scoreEarned, STATE.nodes[nodeId].scoreLost);
    refreshUI();
  };

  window.preopGcklSyncAllToAppScores = syncAllToAppScores;

  window.preopGcklCompute = function () { return PG.compute(STATE); };
  window.preopGcklDebrief = function () { return PG.debrief(STATE); };
  window.preopGcklReset = function () {
    Object.assign(STATE, PG.freshState());
    refreshUI();
  };

  // ---------- TRANSFER KİLİDİ HOOK ----------
  // Mevcut getPhaseAdvanceBlocker'ı sarar
  function installPhaseBlockerHook() {
    if (typeof window.getPhaseAdvanceBlocker !== 'function') {
      setTimeout(installPhaseBlockerHook, 500);
      return;
    }
    if (window.__preopGcklBlockerInstalled) return;
    window.__preopGcklBlockerInstalled = true;

    const original = window.getPhaseAdvanceBlocker;
    window.getPhaseAdvanceBlocker = function (phaseName) {
      if (phaseName === 'preop' || phaseName === undefined) {
        const transfer = PG.canTransfer(STATE);
        if (!transfer.ok) {
          const breachList = transfer.wrongs.map(w => w.label).join(', ');
          const pendingList = transfer.pending.map(p => p.label).join(', ');
          return {
            source: 'pre-gckl-network',
            blocked: true,
            severity: transfer.wrongs.length > 0 ? 'barrierBreach' : 'pendingCritical',
            title: transfer.wrongs.length > 0
              ? '⛔ Güvenli cerrahi bariyer ihlali'
              : '⚠ Kritik düğümler eksik',
            message: transfer.wrongs.length > 0
              ? `Şu kritik düğümlerde yanlış karar verildi: ${breachList}. Transfer kilitli.`
              : `Transfer için şu kritik düğümler henüz tamamlanmadı: ${pendingList}.`,
            details: { wrongs: transfer.wrongs, pending: transfer.pending }
          };
        }
      }
      return original.apply(this, arguments);
    };
  }
  installPhaseBlockerHook();

  // ---------- PUAN PANELİ UI (devre dışı — rapor ekranında gösterilir) ----------
  function refreshUI() { /* no-op: floating panel kaldırıldı, çıktı rapor ekranında */ }
  function _disabledEnsurePanel() {
    let panel = document.getElementById('pre-gckl-panel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'pre-gckl-panel';
    panel.innerHTML = `
      <style>
        #pre-gckl-panel{position:fixed;right:14px;bottom:14px;width:340px;max-height:78vh;
          z-index:9998;font-family:'Inter',system-ui,sans-serif;color:#e6eef7;
          background:linear-gradient(180deg,rgba(10,22,40,.97),rgba(8,18,34,.97));
          border:1px solid rgba(92,196,214,.35);border-radius:14px;
          box-shadow:0 18px 40px rgba(0,0,0,.55);overflow:hidden;display:flex;flex-direction:column;
          backdrop-filter:blur(8px);transition:opacity .25s;}
        #pre-gckl-panel.collapsed{height:46px;max-height:46px;}
        #pre-gckl-panel.hidden{display:none;}
        #pre-gckl-panel header{display:flex;justify-content:space-between;align-items:center;
          padding:10px 12px;background:rgba(92,196,214,.10);border-bottom:1px solid rgba(92,196,214,.20);
          cursor:pointer;user-select:none;}
        #pre-gckl-panel header h4{margin:0;font-size:13px;font-weight:600;letter-spacing:.3px;}
        #pre-gckl-panel header .pgs-total{font-family:'JetBrains Mono',monospace;font-size:13px;
          color:#5cc4d6;font-weight:700;}
        #pre-gckl-panel .pgs-body{padding:10px 12px;overflow-y:auto;flex:1;}
        #pre-gckl-panel .pgs-cat{margin-bottom:9px;}
        #pre-gckl-panel .pgs-cat-head{display:flex;justify-content:space-between;font-size:10.5px;
          color:#a9bfd2;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px;}
        #pre-gckl-panel .pgs-cat-bar{height:5px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;}
        #pre-gckl-panel .pgs-cat-bar > i{display:block;height:100%;background:linear-gradient(90deg,#5cc4d6,#7ad4a3);transition:width .3s;}
        #pre-gckl-panel .pgs-node{display:grid;grid-template-columns:14px 1fr auto;gap:8px;align-items:center;
          padding:6px 8px;margin:3px 0;border-radius:8px;font-size:11.5px;background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.04);}
        #pre-gckl-panel .pgs-node.done{background:rgba(122,212,163,.10);border-color:rgba(122,212,163,.25);}
        #pre-gckl-panel .pgs-node.wrong{background:rgba(255,107,107,.12);border-color:rgba(255,107,107,.35);}
        #pre-gckl-panel .pgs-node.stopped{background:rgba(255,196,93,.12);border-color:rgba(255,196,93,.35);}
        #pre-gckl-panel .pgs-node .dot{width:9px;height:9px;border-radius:50%;background:#3a4f6b;}
        #pre-gckl-panel .pgs-node.done .dot{background:#7ad4a3;}
        #pre-gckl-panel .pgs-node.wrong .dot{background:#ff6b6b;}
        #pre-gckl-panel .pgs-node.stopped .dot{background:#ffc45d;}
        #pre-gckl-panel .pgs-node .lbl{font-weight:500;color:#dbe6f1;}
        #pre-gckl-panel .pgs-node .pts{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#a9bfd2;}
        #pre-gckl-panel .pgs-node.crit .lbl::before{content:"⚠ ";color:#ff8c5a;font-weight:700;}
        #pre-gckl-panel .pgs-warn{background:rgba(255,107,107,.12);border:1px solid rgba(255,107,107,.4);
          padding:7px 9px;border-radius:8px;font-size:11px;margin-top:8px;color:#ffd5d5;}
        #pre-gckl-panel .pgs-bonus{font-size:10.5px;color:#a9bfd2;margin-top:6px;text-align:right;
          font-family:'JetBrains Mono',monospace;}
      </style>
      <header data-toggle="1">
        <h4>📋 Preop GCKL Ağ Puanlaması</h4>
        <span class="pgs-total" id="pgs-total">0 / 100</span>
      </header>
      <div class="pgs-body" id="pgs-body"></div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('header').addEventListener('click', () => {
      panel.classList.toggle('collapsed');
    });
    return panel;
  }

  // Eski periyodik refresh kaldırıldı — App.scores'a delta push edildiği için UI'a gerek yok.
  function init() {
    // Skor delta'larını mevcut App.scores sistemine bağla (preop yüklendiğinde tek sefer)
    try { syncAllToAppScores(); } catch (e) { /* App henüz hazır değilse sessiz geç */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ===== End inline pre-gckl-bootstrap.js ===== */
