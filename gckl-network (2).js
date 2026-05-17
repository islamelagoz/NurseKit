/* ===== Inlined from intra-gckl-bootstrap.js ===== */
/* =====================================================================
   INTRA_GCKL — Bootstrap / UI / Hook Layer
   intra-gckl-network.js'i NurseKit ana akışına bağlar.
   Preop bootstrap'ın intraop muadili — aynı sözleşmeleri kullanır.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.IntraopGCKL) { console.warn('[INTRA-GCKL] Network modülü yüklenmedi.'); return; }

  const IG = window.IntraopGCKL;

  function ensureAppAlias() {
    try {
      if (!window.App && typeof App !== 'undefined') window.App = App;
    } catch(e) {}
    return window.App || null;
  }

  // ADIM 9: lokal esc — harita HTML'inde kullanılır
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // === GÖREV TAG → NODE/EVIDENCE HARİTASI ===
  // Mevcut t_* tag'lerini intraop GCKL düğümlerine köprüler.
  // Bazı tag'ler birden fazla node'a (örn. equipment+antiseptic) ya da
  // tek node içinde belirli evidence'a (count_initial/final) gider.
  const LEGACY_TAG_MAP = {
    // GCKL ana akışı
    't_timeout':                { node: 'timeOutTeam' },
    'intraop_team_timeout':     { node: 'timeOutTeam', evidence: 'team_attention' },
    't_site_procedure_verify':  { node: 'patientProcedureSite' },
    'intraop_identity_procedure': { node: 'patientProcedureSite' },
    't_imaging_intraop':        { node: 'imagingAndResults' },
    't_antibiotic':             { node: 'antibioticProphylaxis' },
    'intraop_allergy_antibiotic': { node: 'antibioticProphylaxis' },
    't_anesthesia_assist':      { node: 'anesthesiaSafety' },
    'intraop_anaesthesia_safety': { node: 'anesthesiaSafety' },
    't_fluid_blood':            { node: 'bloodLossRisk' },
    't_equipment':              { node: 'equipmentAndFireSafety', evidence: 'esu_pad_position' },
    't_antiseptic':             { node: 'equipmentAndFireSafety', evidence: 'antiseptic_dry' },
    'intraop_equipment_fire_safety': { node: 'equipmentAndFireSafety' },
    't_sterile_field':          { node: 'sterileFieldAndTraffic' },
    'intraop_sterile_field':    { node: 'sterileFieldAndTraffic' },
    't_position':               { node: 'positioningAndTemperature', evidence: 'positioning_safe' },
    't_temp':                   { node: 'positioningAndTemperature', evidence: 'active_warming_on' },
    't_count_initial':          { node: 'countSafety',    evidence: 'count_initial' },
    't_count_additional':       { node: 'countSafety',    evidence: 'count_additional' },
    't_count_final':            { node: 'countSafety',    evidence: 'count_final' },
    'intraop_initial_count':    { node: 'countSafety',    evidence: 'count_initial' },
    'intraop_additional_count': { node: 'countSafety',    evidence: 'count_additional' },
    'intraop_final_count':      { node: 'countSafety',    evidence: 'count_final' },
    't_specimen':               { node: 'specimenAndEquipmentIssue' },
    'intraop_specimen_safety':  { node: 'specimenAndEquipmentIssue', evidence: 'specimen_labeled' },
    't_signout':                { node: 'signOutHandoff' },
    't_cabg_cpb_ready':         { node: 'cabgCpbSafety' },
    'intraop_cabg_cpb_safety':  { node: 'cabgCpbSafety' },
    't_team_communication':     { node: 'teamCommunication' },
    'intraop_communication_handoff': { node: 'teamCommunication' }
  };

  function mapEntryForTask(taskId) {
    if (IG.getMapEntryByTask) return IG.getMapEntryByTask(taskId) || null;
    return null;
  }

  function mapForTag(tag) {
    const entry = mapEntryForTask(tag);
    if (entry) return { node: entry.nodeId, evidenceList: (entry.requiredEvidence || []).slice(), entry: entry };
    return LEGACY_TAG_MAP[tag] || null;
  }
  try { window.intraGcklLegacyTagMap = LEGACY_TAG_MAP; } catch(e) {}

  // === Kategori köprüsü (App.scores delta-push) ===
  // intraop ağ kategorileri → mevcut SCORE_CATEGORIES (varsa) ya da App.scoreCats
  const NODE_TO_APP_CATEGORIES = {
    timeoutVerification:  ['patientSafety', 'checklistPerformance', 'communication'],
    anesthesiaBlood:      ['clinicalAssessment', 'surgicalNursingKnowledge', 'patientSafety'],
    sterileEquipPosition: ['patientSafety', 'clinicalAssessment', 'surgicalNursingKnowledge'],
    countSpecimen:        ['patientSafety', 'checklistPerformance'],
    signOutHandover:      ['communication', 'checklistPerformance', 'patientSafety'],
    reasoningBonus:       ['clinicalReasoning']
  };
  const LEGACY_NODE_TO_APP_CATEGORIES = {
    timeoutVerification:  ['guvenlik', 'bilgi'],
    anesthesiaBlood:      ['klinik', 'guvenlik'],
    sterileEquipPosition: ['guvenlik', 'klinik'],
    countSpecimen:        ['guvenlik', 'oncelik'],
    signOutHandover:      ['iletisim', 'guvenlik'],
    reasoningBonus:       ['oncelik']
  };

  // Senkron edilen son delta
  const SYNCED = {};
  Object.keys(IG.getAll()).forEach(id => { SYNCED[id] = { earned: 0, lost: 0, bonus: 0 }; });

  function addAppScore(cats, dE, dL, dB, legacyCats) {
    if (!window.App) return;
    // NurseKit'in mevcut scoreCats yapısı
    if (window.App.scoreCats) {
      (legacyCats || []).forEach(c => {
        if (typeof window.App.scoreCats[c] === 'number') {
          window.App.scoreCats[c] += dE - dL + (dB || 0);
          window.App.scoreCatsTotal[c] = window.App.scoreCatsTotal[c] || 0;
          if (dE > 0)  window.App.scoreCatsTotal[c] += dE;
        }
      });
    }
    // Modern App.scores varsa onu da besle
    if (window.App.scores && typeof window.addScore === 'function') {
      const modernCats = cats.filter(c => window.App.scores[c]);
      if (modernCats.length) {
        if (dE !== 0) window.addScore(modernCats, dE, 0);
        if (dL > 0)   window.addScore(modernCats, -dL, 0);
        if (dB)       window.addScore(modernCats, dB, 0);
      }
    }
  }

  function pushDelta(nodeId) {
    const n = IG.getNode(nodeId);
    if (!n) return;
    const earned = (typeof n.scoreEarned === 'number') ? n.scoreEarned : 0;
    const lost   = n.scoreLost || 0;
    const bonus  = n.bonusEarned || 0;
    const cats = NODE_TO_APP_CATEGORIES[n.category] || ['patientSafety'];
    const legacyCats = LEGACY_NODE_TO_APP_CATEGORIES[n.category] || ['guvenlik'];
    const dE = earned - SYNCED[nodeId].earned;
    const dL = lost   - SYNCED[nodeId].lost;
    const dB = bonus  - SYNCED[nodeId].bonus;
    addAppScore(cats, dE, dL, dB, legacyCats);
    SYNCED[nodeId].earned = earned;
    SYNCED[nodeId].lost   = lost;
    SYNCED[nodeId].bonus  = bonus;
  }

  function syncAll() {
    // Önce compute → scoreEarned alanlarını günceller
    IG.compute();
    Object.keys(IG.getAll()).forEach(pushDelta);
  }

  function currentIntraopTasks() {
    return (window.App && window.App.currentPatient && window.App.currentPatient.intraop && window.App.currentPatient.intraop.tasks) || [];
  }

  function taskIsComplete(taskId) {
    return !!(window.App && Array.isArray(window.App.completedTasks) && window.App.completedTasks.indexOf(taskId) >= 0);
  }

  function markTaskCompleteFromEvidence(taskId, sourceObj) {
    if (!taskId || !window.App) return false;
    window.App.completedTasks = window.App.completedTasks || [];
    if (window.App.completedTasks.indexOf(taskId) < 0) window.App.completedTasks.push(taskId);
    try { if (window.NurseKitSM && window.NurseKitSM.shadowComplete) window.NurseKitSM.shadowComplete(taskId, sourceObj || null); } catch(e) {}
    return true;
  }
  function markTaskCompleteSilent(taskId, sourceObj) {
    return markTaskCompleteFromEvidence(taskId, sourceObj);
  }

  function addGlobalGcklEvidence(entry, sourceLabel) {
    if (!entry || !Array.isArray(entry.gcklItems)) return;
    entry.gcklItems.forEach(function (itemId) {
      try {
        if (typeof window.addGCKLEvidence === 'function') {
          window.addGCKLEvidence(itemId, {
            source: 'intraop-gckl',
            id: entry.id,
            taskId: entry.taskId,
            label: sourceLabel || entry.taskLabel || entry.label || entry.id
          });
        }
      } catch(e) {}
    });
  }

  function entryEvidenceMet(entry) {
    const node = entry && IG.getNode(entry.nodeId);
    if (!node) return false;
    return (entry.requiredEvidence || []).every(function (ev) {
      return !!node.evidenceCollected[ev];
    });
  }

  function completeEntryTask(entry, sourceObj) {
    if (!entry || !entry.taskId) return false;
    if (!entryEvidenceMet(entry)) return false;
    addGlobalGcklEvidence(entry, entry.taskLabel);
    if (taskIsComplete(entry.taskId)) return true;
    const task = currentIntraopTasks().find(function (t) { return t.id === entry.taskId; });
    if (!task) return false;
    if (typeof window.completeTask !== 'function') return false;
    try {
      return !!window.completeTask(entry.taskId, sourceObj || {
        label: entry.taskLabel,
        opts: {
          clinicalKey: (entry.linkedObjects || [])[0] || entry.id,
          taskId: entry.taskId,
          nodeId: entry.nodeId
        }
      });
    } catch(e) {
      return false;
    }
  }

  function markEntryEvidence(entry) {
    if (!entry) return false;
    (entry.requiredEvidence || []).forEach(function (ev) { IG.markEvidence(entry.nodeId, ev); });
    return true;
  }

  function refreshAllIntraopViews(reason) {
    try { syncAll(); } catch(e) {}
    try { refreshMap(); } catch(e) {}
    try { if (typeof window.gcklBoardSyncMarkerState === 'function') window.gcklBoardSyncMarkerState(); } catch(e) {}
    try { if (typeof window.updateProgressBar === 'function') window.updateProgressBar(); } catch(e) {}
    try { if (typeof window.updateScoreStrip === 'function') window.updateScoreStrip(); } catch(e) {}
    try { if (window.IntraopGcklReport && typeof window.IntraopGcklReport.inject === 'function') window.IntraopGcklReport.inject(); } catch(e) {}
  }

  // === Toastlar ===
  function toast(kind, title, body, pts) {
    const colors = kind === 'ok'
      ? 'background:linear-gradient(135deg,#2c8a5a,#1a5a3c);color:#c8ffc8'
      : 'background:linear-gradient(135deg,#c8323a,#7a1a1f);color:#ffc8c8';
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:130px;right:20px;z-index:99999;color:#fff;padding:12px 16px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.5);font:600 13px Inter,sans-serif;border:1px solid rgba(255,255,255,.2);max-width:320px;' + colors.split(';color:')[0];
    const accent = kind === 'ok' ? '#c8ffc8' : '#ffc8c8';
    t.innerHTML =
      '<div style="font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">' +
      (kind === 'ok' ? '✓ ' : '⛔ ') + title + '</div>' +
      '<div>' + body + '</div>' +
      (pts != null ? '<div style="margin-top:6px;font-family:JetBrains Mono,monospace;font-size:14px;color:' + accent + '">' +
        (pts >= 0 ? '+' + pts : pts) + ' puan</div>' : '');
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 3200);
    setTimeout(() => t.remove(), 3800);
  }

  // === PUBLIC API ===
  window.intraGcklOnTaskComplete = function (tag) {
    const m = mapForTag(tag);
    if (!m) return null;
    if (m.entry) {
      completeEntryTask(m.entry, null);
    } else if (m.evidenceList && m.evidenceList.length) {
      m.evidenceList.forEach(function (ev) { IG.completeNode(m.node, ev); });
    } else {
      IG.completeNode(m.node, m.evidence);
    }
    pushDelta(m.node);
    refreshAllIntraopViews('task:' + tag);
    return { node: m.node, evidence: m.evidence || m.evidenceList || null, evidenceComplete: m.entry ? entryEvidenceMet(m.entry) : true };
  };

  window.intraGcklOnEvidence = function (nodeId, evidenceKey, sourceObj) {
    if (!nodeId || !evidenceKey) return null;
    IG.markEvidence(nodeId, evidenceKey);
    const entries = IG.getMapEntriesByNodeEvidence
      ? IG.getMapEntriesByNodeEvidence(nodeId, evidenceKey)
      : [];
    entries.forEach(function (entry) { completeEntryTask(entry, sourceObj || null); });
    pushDelta(nodeId);
    refreshAllIntraopViews('evidence:' + evidenceKey);
    return { node: nodeId, evidence: evidenceKey, entries: entries.map(function (e) { return e.id; }) };
  };

  window.intraGcklAnswerRationale = function (nodeId, optionIndex) {
    const r = IG.answerRationale(nodeId, optionIndex);
    if (!r) return null;
    pushDelta(nodeId);
    const n = IG.getNode(nodeId);
    if (r.correct) {
      toast('ok', 'Doğru klinik karar', n.label, r.bonusDelta);
    } else {
      const msg = r.barrierBreach
        ? (n.label + ' — Kritik güvenlik bariyer ihlali')
        : (n.label + ' — Eksik/yanlış klinik karar');
      toast('bad', 'Yanlış klinik karar', msg, r.scoreDelta);
    }
    refreshAllIntraopViews('rationale:' + nodeId);
    return r;
  };

  window.intraGcklMarkStop = function (nodeId) {
    const r = IG.markCorrectStop(nodeId);
    pushDelta(nodeId);
    refreshAllIntraopViews('stop:' + nodeId);
    return r;
  };

  window.intraGcklCompute   = function () { return IG.compute(); };
  window.intraGcklSyncAll   = syncAll;
  window.intraGcklMap       = function () { return IG.getMap ? IG.getMap() : []; };
  window.intraGcklReset     = function () { IG.reset(); Object.keys(SYNCED).forEach(k => SYNCED[k] = { earned:0, lost:0, bonus:0 }); refreshMap(); };

  // === FAZ KİLİDİ ===
  // Mevcut getPhaseAdvanceBlocker sarılır — sadece intraop fazını etkiler
  function installPhaseBlockerHook() {
    if (typeof window.getPhaseAdvanceBlocker !== 'function') {
      // NurseKit'te bu adda fonksiyon yoksa advancePhase'i sar
      installAdvanceWrapper();
      return;
    }
    if (window.__intraGcklBlockerInstalled) return;
    window.__intraGcklBlockerInstalled = true;
    const original = window.getPhaseAdvanceBlocker;
    window.getPhaseAdvanceBlocker = function (phaseName) {
      if (phaseName === 'intraop') {
        const close = IG.canAdvancePostop ? IG.canAdvancePostop() : IG.canCloseSignout();
        if (!close.ok) {
          return {
            source: 'gckl',
            blocked: true,
            severity: 'pendingCritical',
            title: '⚠ Sign-out / kapanış bariyerleri eksik',
            message: 'Şu kritik bariyerler tamamlanmadan postopa geçilemez: ' +
              close.missing.map(m => m.label).join(', '),
            rule: {
              key: 'intraopGcklHardStop',
              title: 'Intraop GCKL hard-stop eksik',
              description: 'Postopa gecis icin su intraop hard-stop maddeleri tamamlanmali: ' +
                close.missing.map(m => m.label).join(', '),
              gcklId: 'INTRAOP-GCKL'
            },
            details: close
          };
        }
      }
      return original.apply(this, arguments);
    };
    try { getPhaseAdvanceBlocker = window.getPhaseAdvanceBlocker; } catch(e) {}
  }

  function installAdvanceWrapper() {
    if (typeof window.getPhaseAdvanceBlocker === 'function') return;
    if (typeof window.advancePhase !== 'function') {
      setTimeout(installAdvanceWrapper, 500);
      return;
    }
    if (window.__intraGcklAdvanceWrapped) return;
    window.__intraGcklAdvanceWrapped = true;
    const original = window.advancePhase;
    window.advancePhase = function () {
      if (window.App && window.App.currentRoom === 'intraop') {
        const close = IG.canAdvancePostop ? IG.canAdvancePostop() : IG.canCloseSignout();
        if (!close.ok) {
          const msg = 'Sign-out / kapanış için eksik bariyerler:\n• ' +
            close.missing.map(m => m.label).join('\n• ');
          if (typeof window.toast === 'function') {
            window.toast('error', '⚠ Postop geçişi kilitli', msg);
          } else {
            alert(msg);
          }
          return;
        }
      }
      return original.apply(this, arguments);
    };
    try { advancePhase = window.advancePhase; } catch(e) {}
  }

  function installSwitchRoomWrapper() {
    if (typeof window.switchRoom !== 'function') {
      setTimeout(installSwitchRoomWrapper, 500);
      return;
    }
    if (window.__intraGcklSwitchWrapped) return;
    window.__intraGcklSwitchWrapped = true;
    const original = window.switchRoom;
    window.switchRoom = function (rid) {
      if (window.App && window.App.currentRoom === 'intraop' && rid === 'postop' && window.NK_BYPASS_GATE !== true && !window.App.tempPostopUnlock) {
        const blocker = (typeof window.getPhaseAdvanceBlocker === 'function')
          ? window.getPhaseAdvanceBlocker('intraop')
          : null;
        const close = blocker ? null : (IG.canAdvancePostop ? IG.canAdvancePostop() : IG.canCloseSignout());
        if (blocker || (close && !close.ok)) {
          const msg = 'Postopa gecis icin eksik intraop GCKL hard-stop: ' +
            (blocker && blocker.details && blocker.details.missing
              ? blocker.details.missing.map(m => m.label).join(', ')
              : close.missing.map(m => m.label).join(', '));
          try { if (typeof window.showSceneReaction === 'function') window.showSceneReaction(msg, 'warn'); } catch(e) {}
          try { if (typeof window.toast === 'function') window.toast('error', 'Postop gecisi kilitli', msg); } catch(e) {}
          return;
        }
      }
      const result = original.apply(this, arguments);
      if (rid === 'intraop') setTimeout(function () { refreshAllIntraopViews('switchRoom:intraop'); }, 0);
      return result;
    };
    try { switchRoom = window.switchRoom; } catch(e) {}
  }

  // === completeTask SARMASI ===
  // Mevcut completeTask'a hook ekler — her görev tamamlandığında tag → node akar.
  function installCompleteTaskHook() {
    if (typeof window.completeTask !== 'function') {
      setTimeout(installCompleteTaskHook, 500);
      return;
    }
    if (window.__intraGcklCompleteWrapped) return;
    window.__intraGcklCompleteWrapped = true;
    const original = window.completeTask;
    window.completeTask = function (taskId) {
      const m = (window.App && window.App.currentRoom === 'intraop') ? mapForTag(taskId) : null;
      if (m && m.entry && !entryEvidenceMet(m.entry)) {
        const node = IG.getNode(m.entry.nodeId);
        const missing = (m.entry.requiredEvidence || []).filter(function (ev) {
          return !node || !node.evidenceCollected[ev];
        });
        const msg = 'Bu intraop GCKL gorevi evidence tamamlanmadan kapatilamaz: ' + missing.join(', ');
        try { if (typeof window.showSceneReaction === 'function') window.showSceneReaction(msg, 'warn'); } catch(e) {}
        try { if (typeof window.toast === 'function') window.toast('error', 'Evidence eksik', msg); } catch(e) {}
        refreshAllIntraopViews('blockedCompleteTask:' + taskId);
        return false;
      }
      const result = original.apply(this, arguments);
      // Sadece intraop fazında ve harita tag'i varsa
      if (window.App && window.App.currentRoom === 'intraop') {
        if (m) {
          if (m.entry) {
            completeEntryTask(m.entry, arguments[1] || null);
          } else if (m.evidenceList && m.evidenceList.length) {
            m.evidenceList.forEach(function (ev) { IG.completeNode(m.node, ev); });
          } else {
            IG.completeNode(m.node, m.evidence);
          }
          pushDelta(m.node);
          refreshAllIntraopViews('completeTask:' + taskId);
        }
      }
      return result;
    };
    try { completeTask = window.completeTask; } catch(e) {}
  }

  // === İNTRAOP GCKL HARİTASI === ADIM 9
  // Preop NK955 GCKL Haritası ile aynı yerleşim ve görsel dil:
  // task-list içine, role-card'dan sonra yerleştirilir.
  // Tek state kaynağı: IntraopGCKL.compute()
  function ensureMapStyles() {
    if (document.getElementById('igm9-styles')) return;
    var st = document.createElement('style');
    st.id = 'igm9-styles';
    st.textContent = ''
      + '.igm9{border:1px solid rgba(92,196,214,.22);background:linear-gradient(180deg,rgba(10,28,48,.96),rgba(8,22,40,.94));border-radius:18px;padding:12px 12px 13px;margin-bottom:12px;box-shadow:0 12px 28px rgba(0,0,0,.16)}'
      + '.igm9-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}'
      + '.igm9-title{font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--teal,#5cc4d6)}'
      + '.igm9-sub{font-size:10.5px;color:var(--ink-mute,#7aabb8);line-height:1.35;margin-top:3px}'
      + '.igm9-progress{font-family:var(--font-mono,monospace);font-size:11px;color:var(--ink,#e8eef2);border:1px solid rgba(255,255,255,.10);border-radius:999px;padding:5px 8px;background:rgba(255,255,255,.035);white-space:nowrap}'
      + '.igm9-progress.breach{color:#f0a0aa;border-color:rgba(217,99,113,.40);background:rgba(217,99,113,.10)}'
      + '.igm9-summary{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-bottom:9px}'
      + '.igm9-pill{display:flex;align-items:center;justify-content:space-between;gap:5px;font-size:9.8px;color:var(--ink-mute,#7aabb8);background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:999px;padding:4px 9px;line-height:1.2}'
      + '.igm9-pill b{color:var(--ink,#cfe7ee);font-weight:720;font-size:10.5px}'
      + '.igm9-pill.ok{border-color:rgba(76,184,138,.32);background:rgba(76,184,138,.07);color:var(--green,#7fe2a3)}'
      + '.igm9-pill.warn{border-color:rgba(224,165,88,.32);background:rgba(224,165,88,.07);color:var(--amber,#e2c97e)}'
      + '.igm9-pill.bad{border-color:rgba(217,99,113,.36);background:rgba(217,99,113,.08);color:#f0a0aa}'
      + '.igm9-section-title{font-size:10px;color:var(--ink-mute,#7aabb8);letter-spacing:.08em;text-transform:uppercase;font-weight:820;margin:9px 0 6px;display:flex;justify-content:space-between;align-items:center;gap:6px}'
      + '.igm9-section-title .sec-count{font-family:var(--font-mono,monospace);font-size:9.5px;color:var(--ink-mute,#7aabb8);font-weight:720;letter-spacing:0;text-transform:none}'
      + '.igm9-grid{display:grid;gap:5px}'
      + '.igm9-node{border:1px solid rgba(255,255,255,.075);background:rgba(255,255,255,.030);border-radius:11px;padding:7px 9px;display:grid;grid-template-columns:10px 1fr auto;gap:8px;cursor:pointer;transition:.16s ease;align-items:center}'
      + '.igm9-node:hover{border-color:rgba(92,196,214,.32);background:rgba(92,196,214,.07);transform:translateY(-1px)}'
      + '.igm9-node .dot{width:9px;height:9px;border-radius:50%;background:#3a4f6b}'
      + '.igm9-node .lbl{font-size:10.5px;color:var(--ink,#dbe6f1);line-height:1.28;font-weight:620}'
      + '.igm9-node .sub{font-size:9.5px;color:var(--ink-mute,#7aabb8);font-weight:500;margin-top:1px;line-height:1.3}'
      + '.igm9-node .pts{font-family:var(--font-mono,monospace);font-size:9.5px;color:var(--ink-mute,#7aabb8);font-weight:720;white-space:nowrap}'
      + '.igm9-node.complete{background:rgba(76,184,138,.10);border-color:rgba(76,184,138,.30)}'
      + '.igm9-node.complete .dot{background:var(--green,#7fe2a3)}'
      + '.igm9-node.complete .lbl{color:var(--green,#a0e6bd)}'
      + '.igm9-node.wrong,.igm9-node.breach{background:rgba(217,99,113,.10);border-color:rgba(217,99,113,.38)}'
      + '.igm9-node.wrong .dot,.igm9-node.breach .dot{background:#f0a0aa}'
      + '.igm9-node.wrong .lbl,.igm9-node.breach .lbl{color:#f0a0aa}'
      + '.igm9-node.locked{opacity:.65}'
      + '.igm9-node.locked .lbl::before{content:"🔒 ";font-size:9px;margin-right:2px}'
      + '.igm9-node.crit .lbl::before{content:"⚠ ";color:#ff8c5a;font-weight:720;margin-right:2px}'
      + '.igm9-node.crit.complete .lbl::before{content:"";margin-right:0}'
      + '.igm9-node-chips{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px;grid-column:2 / span 2}'
      + '.igm9-node-chip{font-size:8.8px;border:1px solid rgba(92,196,214,.22);border-radius:999px;padding:2px 6px;color:var(--teal,#5cc4d6);background:rgba(92,196,214,.07);line-height:1;font-weight:680}'
      + '.igm9-node-chip.hs{color:#f0a0aa;border-color:rgba(217,99,113,.32);background:rgba(217,99,113,.07)}'
      + '.igm9-node-chip.evmiss{color:var(--amber,#e2c97e);border-color:rgba(224,165,88,.30);background:rgba(224,165,88,.08)}'
      + '.igm9-node-chip.progress{color:#a0e6bd;border-color:rgba(76,184,138,.42);background:rgba(76,184,138,.14);font-weight:720}'
      + '.igm9-node.partial{background:rgba(224,165,88,.14);border-color:rgba(224,165,88,.46);box-shadow:inset 0 0 0 1px rgba(224,165,88,.18)}'
      + '.igm9-node.partial .dot{background:var(--amber,#e2c97e);box-shadow:0 0 0 3px rgba(224,165,88,.22)}'
      + '.igm9-node.partial .lbl{color:#f0d29a}'
      + '.igm9-locked-banner{background:linear-gradient(135deg,rgba(224,165,88,.14),rgba(217,99,113,.12));border:1px solid rgba(224,165,88,.42);border-left:3px solid #e0a558;border-radius:10px;padding:10px 12px;margin:0 0 10px;color:#f0d29a;font-size:12px;line-height:1.45}'
      + '.igm9-locked-banner .igm9-locked-title{font-weight:720;font-size:13px;color:#ffd29a;margin-bottom:4px;letter-spacing:.01em}'
      + '.igm9-locked-banner .igm9-locked-sub{font-size:11.5px;color:#e2c97e;margin-bottom:4px;font-weight:600}'
      + '.igm9-locked-banner .igm9-locked-list{margin:0 0 6px 0;padding-left:18px;list-style:disc}'
      + '.igm9-locked-banner .igm9-locked-list li{margin:1px 0;color:#f0d29a}'
      + '.igm9-locked-banner .igm9-locked-hint{font-size:10.5px;color:rgba(240,210,154,.78);font-style:italic;margin-top:2px}'
      + '.igm9-locked-disabled{opacity:.42;cursor:not-allowed !important;filter:grayscale(.5);pointer-events:none}'
      + '.igm9-cluster-status{font-size:10.2px;line-height:1.4;padding:6px 9px;border-radius:10px;margin-top:6px;background:rgba(255,255,255,.020);border:1px solid rgba(255,255,255,.06);color:var(--ink-mute,#7aabb8)}'
      + '.igm9-cluster-status.ok{background:rgba(76,184,138,.06);border-color:rgba(76,184,138,.22);color:var(--green,#7fe2a3)}'
      + '.igm9-cluster-status.warn{background:rgba(224,165,88,.07);border-color:rgba(224,165,88,.24);color:var(--amber,#e2c97e)}'
      + '.igm9-cluster-status.bad{background:rgba(217,99,113,.07);border-color:rgba(217,99,113,.26);color:#f0a0aa}'
      + '.igm9-breach-banner{margin-top:9px;padding:9px 10px;border-radius:12px;background:rgba(217,99,113,.10);border:1px solid rgba(217,99,113,.40);color:#f0b5b0;font-size:10.5px;line-height:1.42}'
      + '.igm9-breach-banner b{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:.075em;color:#ffd0d0;margin-bottom:3px;font-weight:820}'
      + '.igm9-postop{margin-top:8px;padding:8px 10px;border-radius:12px;font-size:10.5px;line-height:1.4}'
      + '.igm9-postop.ok{background:rgba(76,184,138,.08);border:1px solid rgba(76,184,138,.30);color:var(--green,#7fe2a3)}'
      + '.igm9-postop.locked{background:rgba(217,99,113,.08);border:1px solid rgba(217,99,113,.36);color:#f0b5b0}'
      + '.igm9-postop b{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.075em;margin-bottom:2px;font-weight:820}';
    document.head.appendChild(st);
  }

  // Node → primary clinicalKey eşleştirmesi (tıklama davranışı için)
  var NODE_PRIMARY_KEY = {
    timeOutTeam:               'time-out',
    patientProcedureSite:      'patient-wristband',
    imagingAndResults:         'imaging-monitor',
    antibioticProphylaxis:     'antibiotic-syringe',
    anesthesiaSafety:          'anesthesia-machine',
    bloodLossRisk:             'blood-bags',
    equipmentAndFireSafety:    'esu-unit',
    sterileFieldAndTraffic:    'mayo-stand',
    positioningAndTemperature: 'forced-air-warmer',
    countSafety:               'count-board',
    specimenAndEquipmentIssue: 'specimen-container',
    signOutHandoff:            'signout-checklist',
    cabgCpbSafety:             'cpb-machine',
    teamCommunication:         'or-team-figures'
  };

  function ensureMapPanel() {
    ensureMapStyles();
    var panel = document.getElementById('igm9-panel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'igm9-panel';
    panel.className = 'igm9';
    return panel;
  }

  // İki ana bariyer kümesi — spec ADIM 9 ile birebir
  var CLUSTERS = [
    {
      id: 'incision',
      label: 'KESİ ÖNCESİ GÜVENLİK BARİYERLERİ',
      // countSafety burada 'initial' aşamasıyla
      nodes: [
        { id: 'timeOutTeam',              phase: null },
        { id: 'patientProcedureSite',     phase: null },
        { id: 'imagingAndResults',        phase: null },
        { id: 'antibioticProphylaxis',    phase: null },
        { id: 'anesthesiaSafety',         phase: null },
        { id: 'bloodLossRisk',            phase: null },
        { id: 'equipmentAndFireSafety',   phase: null },
        { id: 'sterileFieldAndTraffic',   phase: null },
        { id: 'positioningAndTemperature',phase: null },
        { id: 'countSafety',              phase: 'initial' },
        { id: 'countSafety',              phase: 'additional' },
        { id: 'cabgCpbSafety',            phase: null },
        { id: 'teamCommunication',        phase: null }
      ]
    },
    {
      id: 'closure',
      label: 'KAPANIŞ / SIGN-OUT BARİYERLERİ',
      nodes: [
        { id: 'countSafety',              phase: 'final' },
        { id: 'specimenAndEquipmentIssue',phase: null },
        { id: 'signOutHandoff',           phase: null }
      ]
    }
  ];

  function nodeStatusForCluster(nodeReport, rawNode, phase) {
    // countSafety: her phase node'u (initial/additional/final) SADECE kendi
    // evidence'ını dinler. Aksi halde tek tıkla diğer 2 phase node'u da
    // "partial" renge boyanır (BUG #1 — toplu renk değişimi).
    if (rawNode.id === 'countSafety' && phase) {
      var evList = nodeReport.evidence || [];
      var key = 'count_' + phase;
      return evList.indexOf(key) >= 0 ? 'complete' : 'pending';
    }
    return nodeReport.status || 'pending';
  }

  function clusterStatus(cluster, data) {
    var statuses = cluster.nodes.map(function (n) {
      var raw = IG.getNode(n.id);
      var r = data.nodes[n.id] || {};
      return { id: n.id, phase: n.phase, status: nodeStatusForCluster(r, raw, n.phase), breach: r.breach, raw: raw };
    });
    var anyBreach = statuses.some(function (s) { return s.breach; });
    var allComplete = statuses.every(function (s) { return s.status === 'complete'; });
    var anyMissing = statuses.some(function (s) { return s.status !== 'complete' && s.status !== 'partial'; });
    return {
      anyBreach: anyBreach,
      allComplete: allComplete,
      anyMissing: anyMissing,
      complete: statuses.filter(function (s) { return s.status === 'complete'; }).length,
      total: statuses.length,
      missingLabels: statuses.filter(function (s) { return s.status !== 'complete'; })
        .map(function (s) {
          var lab = s.raw.label || s.id;
          if (s.phase) {
            var phaseLabel = s.phase === 'initial' ? 'baslangic' : (s.phase === 'additional' ? 'ek materyal' : 'kapanis');
            lab += ' (' + phaseLabel + ')';
          }
          return lab;
        })
    };
  }

  function refreshMap() {
    var inIntra = window.App && window.App.currentRoom === 'intraop';
    var panel = ensureMapPanel();

    // Yerleştirme: task-list içine, role-card varsa hemen ardına
    var list = document.getElementById('task-list');
    if (!list || !inIntra) {
      if (panel.parentNode) panel.parentNode.removeChild(panel);
      return;
    }
    if (panel.parentNode !== list) {
      var roleCard = list.querySelector('.phase-role-card');
      if (roleCard && roleCard.parentNode === list) {
        roleCard.insertAdjacentElement('afterend', panel);
      } else {
        list.insertBefore(panel, list.firstChild);
      }
    }

    var data = IG.compute();
    var breach = data.breaches && data.breaches.length > 0;
    var completedCount = Object.keys(data.nodes).filter(function (id) { return data.nodes[id].status === 'complete'; }).length;
    var totalNodes = Object.keys(data.nodes).length;
    var stops = Object.keys(data.nodes).filter(function (id) {
      var raw = IG.getNode(id);
      return raw && raw.stoppedCorrectly;
    }).length;

    var html = '';

    // BAŞLIK + PROGRESS
    html += '<div class="igm9-head">';
    html += '<div><div class="igm9-title">İntraop GCKL Haritası</div>';
    html += '<div class="igm9-sub">Kesi öncesi ve kapanış güvenlik bariyerleri — IntraopGCKL.compute() ile canlı.</div></div>';
    html += '<div class="igm9-progress' + (breach ? ' breach' : '') + '">' + data.total + '/100</div>';
    html += '</div>';

    // SKOR ÖZETİ (4 pill)
    html += '<div class="igm9-summary">';
    html += '<div class="igm9-pill ' + (breach ? 'bad' : (completedCount === totalNodes ? 'ok' : '')) + '">Tamamlanan <b>' + completedCount + '/' + totalNodes + '</b></div>';
    html += '<div class="igm9-pill ' + (breach ? 'bad' : 'ok') + '">Kritik ihlal <b>' + (breach ? 'VAR' : 'yok') + '</b></div>';
    html += '<div class="igm9-pill ' + (stops > 0 ? 'ok' : '') + '">Stop bonus <b>+' + (data.reasoningBonus || 0) + '</b></div>';
    var postopGate = data.canAdvancePostop || data.canCloseSignout || {};
    var postopOk = postopGate.ok && !breach;
    html += '<div class="igm9-pill ' + (postopOk ? 'ok' : 'bad') + '">Postop <b>' + (postopOk ? 'açık' : 'kilitli') + '</b></div>';
    html += '</div>';

    // CLUSTER'LAR
    CLUSTERS.forEach(function (cl) {
      var cs = clusterStatus(cl, data);
      html += '<div class="igm9-section-title"><span>' + cl.label + '</span>';
      html += '<span class="sec-count">' + cs.complete + '/' + cs.total + '</span></div>';
      html += '<div class="igm9-grid">';
      cl.nodes.forEach(function (n) {
        var raw = IG.getNode(n.id);
        var r = data.nodes[n.id] || {};
        var status = nodeStatusForCluster(r, raw, n.phase);
        var cls = 'igm9-node ' + status;
        if (r.breach) cls += ' breach';
        if (raw.hardStop) cls += ' crit';
        if (!r.prereqsMet) cls += ' locked';

        // Eksik / tamamlanan evidence sayısı (BUG #2: "X/Y alt-doğrulama" rozeti)
        var req = raw.requiredEvidence || [];
        var ev = r.evidence || [];
        var missingEv, doneEv, totalEv;
        if (n.phase) {
          // countSafety için yalnız ilgili evidence (her phase node'u tek alt-step)
          var k = 'count_' + n.phase;
          doneEv = ev.indexOf(k) >= 0 ? 1 : 0;
          totalEv = 1;
          missingEv = totalEv - doneEv;
        } else {
          totalEv = req.length;
          doneEv = req.filter(function (x) { return ev.indexOf(x) !== -1; }).length;
          missingEv = totalEv - doneEv;
        }
        // Çoklu alt-step görevlerde "yarım tamamlanmış" durumunu görsel olarak vurgula —
        // backend status 'complete' değilse ve en az 1 ama hepsi değil ise partial.
        if (doneEv > 0 && doneEv < totalEv && !/\b(complete|partial)\b/.test(cls)) {
          cls += ' partial';
        }

        var primaryKey = NODE_PRIMARY_KEY[n.id] || '';
        var dataAttrs = 'data-node="' + esc(n.id) + '" data-key="' + esc(primaryKey) + '"';
        if (n.phase) dataAttrs += ' data-phase="' + esc(n.phase) + '"';

        // Label + sub
        var lblText = raw.label || n.id;
        if (n.phase) {
          var phaseLabel = n.phase === 'initial' ? 'baslangic' : (n.phase === 'additional' ? 'ek materyal' : 'kapanis');
          lblText += ' (' + phaseLabel + ')';
        }

        var ptsText = (r.earned != null ? r.earned : 0) + '/' + (raw.max || 0);

        html += '<div class="' + cls + '" ' + dataAttrs + ' tabindex="0" role="button">';
        html += '<span class="dot"></span>';
        html += '<div><span class="lbl">' + esc(lblText) + '</span>';
        html += '<div class="sub">' + esc((raw.gckl || '').substring(0, 60)) + (raw.gckl && raw.gckl.length > 60 ? '…' : '') + '</div></div>';
        html += '<span class="pts">' + ptsText + '</span>';
        // Chip satırı: hard-stop ve alt-doğrulama ilerlemesi
        var showProgressChip = totalEv > 1 && doneEv < totalEv; // tek alt-step varsa anlamsız
        if (raw.hardStop || showProgressChip || missingEv > 0) {
          html += '<div class="igm9-node-chips">';
          if (raw.hardStop) html += '<span class="igm9-node-chip hs">Hard-stop</span>';
          if (showProgressChip) {
            // Çoklu alt-step → "X/Y alt-doğrulama" net göster
            var chipCls = doneEv > 0 ? 'progress' : 'evmiss';
            html += '<span class="igm9-node-chip ' + chipCls + '">' + doneEv + '/' + totalEv + ' alt-doğrulama</span>';
          } else if (missingEv > 0) {
            // Tek alt-step → eski mesaj
            html += '<span class="igm9-node-chip evmiss">' + missingEv + ' evidence eksik</span>';
          }
          html += '</div>';
        }
        html += '</div>';
      });
      html += '</div>';

      // CLUSTER ÖZETİ
      var statusText, statusCls;
      if (cs.anyBreach) {
        statusText = cl.id === 'incision'
          ? 'Kesi öncesi bariyerlerde kritik ihlal var.'
          : 'Kapanış / sign-out bariyerlerinde kritik ihlal var.';
        statusCls = 'bad';
      } else if (cs.allComplete) {
        statusText = cl.id === 'incision'
          ? 'Kesi öncesi bariyerler tamamlandı.'
          : 'Kapanış ve sign-out bariyerleri tamamlandı.';
        statusCls = 'ok';
      } else {
        statusText = (cl.id === 'incision' ? 'Kesi öncesi eksik bariyerler: ' : 'Kapanış eksik bariyerler: ')
          + cs.missingLabels.slice(0, 4).join(', ')
          + (cs.missingLabels.length > 4 ? ', …' : '');
        statusCls = 'warn';
      }
      html += '<div class="igm9-cluster-status ' + statusCls + '">' + esc(statusText) + '</div>';
    });

    // HARD-STOP BANNER
    if (breach) {
      html += '<div class="igm9-breach-banner">';
      html += '<b>⛔ Kritik güvenlik bariyer ihlali</b>';
      html += 'İntraop skoru ' + data.barrierCap + '/100 tavanına düşürüldü ve postop geçiş kilitlendi. İhlaller: ';
      html += esc(data.breaches.map(function (b) { return b.label; }).join(', '));
      html += '</div>';
    }

    // POSTOP GEÇİŞ DURUMU
    var postopClose = postopGate || { ok: false, missing: [] };
    if (postopOk) {
      html += '<div class="igm9-postop ok"><b>Postop geçiş durumu</b>Postop geçiş güvenli. Kapanış ve sign-out bariyerleri tamamlandı.</div>';
    } else {
      var miss = postopClose.missing.slice(0, 3).map(function (m) { return m.label || m.id; }).join(', ');
      var msg = 'Postop geçiş kilitli';
      if (breach) msg += ' (kritik bariyer ihlali nedeniyle)';
      else if (miss) msg += '. Eksik: ' + miss + (postopClose.missing.length > 3 ? ', …' : '');
      html += '<div class="igm9-postop locked"><b>Postop geçiş durumu</b>' + esc(msg) + '.</div>';
    }

    panel.innerHTML = html;

    // Node click handler — paralel erişim (locked dahil tüm node'lar tıklanabilir)
    // BUG #3: locked node'da popup açılmaya devam ediyor, ama üstte uyarı bandı
    // gösteriyor ve action butonlarını disable ediyoruz.
    panel.querySelectorAll('.igm9-node').forEach(function (el) {
      el.addEventListener('click', function () {
        var ck = el.getAttribute('data-key');
        var nodeId = el.getAttribute('data-node');
        if (!ck) return;

        // Locked durumu hesapla
        var raw = nodeId ? IG.getNode(nodeId) : null;
        var report = (IG.compute().nodes || {})[nodeId];
        var isLocked = report && report.prereqsMet === false;

        try {
          if (typeof window.showObjPopup === 'function') {
            var fakeObj = { opts: { clinicalKey: ck }, clinicalKey: ck };
            window.showObjPopup(fakeObj, 0, 0);

            // Popup açıldıktan sonra locked banner + disabled buttons enjekte et
            if (isLocked && raw && Array.isArray(raw.prerequisites)) {
              applyLockedPopupGuard(raw.prerequisites);
            }
          }
        } catch (e) { console.warn('[IGM9] popup açma hatası', e); }
      });
    });
  }

  // BUG #3: Locked node popup'ı açıldığında üstte uyarı bandı göster ve
  // tüm action butonlarını disable et — kullanıcı görevin ne istediğini
  // okuyabilir ama tıklayarak ilerleme kaydedemez.
  function applyLockedPopupGuard(prerequisites) {
    // Popup birden fazla DOM container'da render olabilir (#obj-popup veya .popup).
    // Birkaç tick sonra DOM'a ulaşmak için kısa bir gecikme.
    setTimeout(function () {
      var popup = document.getElementById('obj-popup')
               || document.querySelector('.popup[style*="block"], .popup.open, .popup.show, [class*="popup"][style*="block"]');
      if (!popup) return;
      // Banner zaten varsa duplicate ekleme
      if (popup.querySelector('.igm9-locked-banner')) return;

      // Prerequisite ID'lerini insan okunabilir etiketlere çevir
      var labels = (prerequisites || []).map(function (p) {
        var parts = String(p).split(':');
        var pid = parts[0];
        var phase = parts[1];
        var rn = IG.getNode(pid);
        var lbl = rn ? (rn.label || pid) : pid;
        if (phase) {
          var phaseLabel = phase === 'initial' ? 'başlangıç'
                          : phase === 'additional' ? 'ek materyal'
                          : phase === 'final' ? 'kapanış'
                          : phase;
          lbl += ' (' + phaseLabel + ')';
        }
        // Bu prereq zaten tamamlandıysa listeden düş
        var d = (IG.compute().nodes || {})[pid];
        if (!d) return lbl;
        if (phase) {
          var key = 'count_' + phase;
          if ((d.evidence || []).indexOf(key) >= 0) return null;
        } else if (d.status === 'complete') {
          return null;
        }
        return lbl;
      }).filter(Boolean);

      if (!labels.length) return; // güvenlik: tüm prereq aslında tamam — popup serbest

      // Banner enjekte et — popup'ın en üstüne
      var banner = document.createElement('div');
      banner.className = 'igm9-locked-banner';
      banner.innerHTML =
        '<div class="igm9-locked-title">🔒 Bu görev şimdilik kilitli</div>'
      + '<div class="igm9-locked-sub">Önce şu önkoşulları tamamla:</div>'
      + '<ul class="igm9-locked-list">'
      +   labels.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('')
      + '</ul>'
      + '<div class="igm9-locked-hint">İçerikleri inceleyebilirsin, ancak doğrulama butonları önkoşullar tamamlanana dek devre dışıdır.</div>';
      popup.insertBefore(banner, popup.firstChild);

      // Action butonlarını disable et (yalnız popup içinde — kapatma butonuna dokunma)
      var actionBtns = popup.querySelectorAll('button:not(.close):not([data-action="close"]):not([data-action="dismiss"])');
      actionBtns.forEach(function (b) {
        // 'X' kapatma butonunu yanlışlıkla disable etmemek için içerik kontrolü
        var txt = (b.textContent || '').trim();
        if (txt === '×' || txt === 'x' || txt === '✕' || /kapat|close|×/i.test(b.getAttribute('aria-label') || '')) return;
        b.disabled = true;
        b.classList.add('igm9-locked-disabled');
        b.setAttribute('aria-disabled', 'true');
      });
    }, 30);
  }

  // === renderRightPanel SARMASI (chip enjeksiyonu) ===
  // Mevcut renderRightPanel'i bozmadan sonradan görev kartlarına chip ekler.
  function installRightPanelHook() {
    if (typeof window.renderRightPanel !== 'function') {
      setTimeout(installRightPanelHook, 500);
      return;
    }
    if (window.__intraGcklPanelWrapped) return;
    window.__intraGcklPanelWrapped = true;
    const original = window.renderRightPanel;
    window.renderRightPanel = function () {
      const r = original.apply(this, arguments);
      try { injectChipsAndMap(); } catch (e) { console.warn('[INTRA-GCKL] chip enjeksiyon hatası', e); }
      return r;
    };
    try { renderRightPanel = window.renderRightPanel; } catch(e) {}
  }

  function injectChipsAndMap() {
    refreshMap();
    if (!window.App || window.App.currentRoom !== 'intraop') return;

    // task-list öğelerine chip ekle
    const list = document.querySelector('#task-list');
    if (!list) return;
    const phase = window.App.currentPatient && window.App.currentPatient.intraop;
    if (!phase) return;

    const taskItems = list.querySelectorAll('.task-item');
    [].forEach.call(taskItems, (item, i) => {
      const t = phase.tasks[i];
      if (!t) return;
      const m = mapForTag(t.id);
      if (!m) return;
      const n = IG.getNode(m.node);
      const data = IG.compute();
      const r = data.nodes[m.node];

      // Mevcut chip alanını bul/oluştur
      let strip = item.querySelector('.igckl-strip');
      if (!strip) {
        strip = document.createElement('div');
        strip.className = 'igckl-strip';
        item.appendChild(strip);
      }
      const statusCls = r.status === 'complete' ? 'ok'
                      : r.status === 'partial'  ? 'mid'
                      : r.status === 'wrong'    ? 'bad' : 'pending';
      const breachStripe = r.breach
        ? '<div class="igckl-breach-stripe">⛔ Kritik güvenlik bariyer ihlali</div>' : '';
      const prereqWarn = (!r.prereqsMet && r.status === 'pending')
        ? '<div class="igckl-prereq-warn">⛓ Önceki bariyerler tamamlanmadı</div>' : '';

      // Sade görünüm (preop sağ panel paritesi): chip strip kaldırıldı.
      // Sadece kritik uyarılar (HARD-STOP, prereq, breach) görünür kalır.
      const stopBadge = n.hardStop && r.status !== 'complete'
        ? '<span class="igckl-hardstop-badge">HARD-STOP</span>' : '';

      strip.innerHTML = stopBadge + prereqWarn + breachStripe;

      // Durum tonu task-item'a yansısın (preop critical-pending paritesi)
      item.classList.toggle('igckl-state-ok',  statusCls === 'ok');
      item.classList.toggle('igckl-state-mid', statusCls === 'mid');
      item.classList.toggle('igckl-state-bad', statusCls === 'bad' || !!r.breach);
    });

    // Görev bölümlerini preop-task-section paritesinde sar (idempotent)
    wrapIntraopSections(list, phase);
  }

  // === Intraop Substep Checklist enjekte et ===
  // Her intraop task-item'ın .task-main'ine substep listesi ekler. Substep
  // metinleri statiktir (görev tanımından gelir); tamamlanma durumu node'un
  // evidenceCollected'ında bulunan kanıt sayısına orantılı olarak işaretlenir
  // (substeps ↔ evidence_keys 1:1 değil — orantısal görselleştirme).
  function injectIntraopSubsteps(list, phase) {
    if (!list || !phase) return;
    const tasks = phase.tasks || [];
    const items = list.querySelectorAll('.task-item');
    const completed = (window.App && Array.isArray(App.completedTasks)) ? App.completedTasks : [];

    let idx = 0;
    items.forEach((item) => {
      const t = tasks[idx++];
      if (!t) return;
      // Idempotent: aynı re-render içinde önceden eklenmişse atla
      if (item.querySelector(':scope > .task-main > .intra-step-list')) return;

      const subs = Array.isArray(t.substeps) ? t.substeps : [];
      if (!subs.length) return;

      const main = item.querySelector(':scope > .task-main');
      if (!main) return;

      // İlerleme: kanıt durumundan orantısal substep tamamlanma sayısı
      let stepDoneCount = 0;
      const taskDone = completed.indexOf(t.id) >= 0;
      if (taskDone) {
        stepDoneCount = subs.length;
      } else {
        try {
          const node = window.IntraopGCKL && window.IntraopGCKL.getNode(t.linkedNode || t.gcklNode);
          const evidence = (node && node.evidenceCollected) || {};
          const required = (node && node.requiredEvidence) || [];
          const totalEv = required.length || subs.length;
          const doneEv = required.length
            ? required.filter(k => !!evidence[k]).length
            : Object.keys(evidence).filter(k => !!evidence[k]).length;
          const ratio = totalEv ? doneEv / totalEv : 0;
          stepDoneCount = Math.round(ratio * subs.length);
          if (doneEv > 0 && stepDoneCount === 0) stepDoneCount = 1;
        } catch (e) {}
      }

      const stepList = document.createElement('div');
      stepList.className = 'intra-step-list';
      subs.forEach((s, i) => {
        const isDone = i < stepDoneCount;
        const label = typeof s === 'string' ? s : (s && (s.label || s.text || s.title || s.id)) || '—';
        const row = document.createElement('div');
        row.className = 'intra-step' + (isDone ? ' done' : '');
        const ic = document.createElement('span');
        ic.className = 'intra-step-icon';
        ic.textContent = isDone ? '✓' : '○';
        const tx = document.createElement('span');
        tx.className = 'intra-step-text';
        tx.textContent = label;
        row.appendChild(ic);
        row.appendChild(tx);
        stepList.appendChild(row);
      });
      main.appendChild(stepList);
    });
  }

  // === Bölüm Sarmalama: task-group-title + ardışık task-item'ları
  // bir .intra-task-section kartı içine al ve baş kısmına title + sayım pill'i koy.
  // Aynı isimli gruplar tek section'da birleştirilir (preop dilince).
  function wrapIntraopSections(list, phase) {
    if (!list) return;
    const titles = list.querySelectorAll(':scope > .task-group-title');
    if (!titles.length) return;

    // groupName -> { section, body, total, done, hasCritical }
    const sections = new Map();
    const completed = (window.App && App.completedTasks) || [];
    const phaseTasks = (phase && phase.tasks) || [];

    titles.forEach((titleEl) => {
      if (titleEl.closest && titleEl.closest('.intra-task-section')) return;
      const groupName = (titleEl.textContent || '').trim();
      if (!groupName) return;

      // Bu başlığın task-item'larını topla
      const collected = [];
      let cursor = titleEl.nextElementSibling;
      while (cursor) {
        if (cursor.classList && cursor.classList.contains('task-group-title')) break;
        if (cursor.classList && cursor.classList.contains('intra-task-section')) break;
        if (cursor.classList && cursor.classList.contains('task-item')) collected.push(cursor);
        cursor = cursor.nextElementSibling;
      }

      let entry = sections.get(groupName);
      if (!entry) {
        // İlk görünüm — bu noktada section'ı kur ve listeye yerleştir
        const groupTasks = phaseTasks.filter(t => (t.group || '').trim() === groupName);
        const total = groupTasks.length;
        const done = groupTasks.filter(t => completed.indexOf(t.id) >= 0).length;
        const hasCritical = groupTasks.some(t => !!t.critical);

        const low = groupName.toLocaleLowerCase('tr-TR');
        let theme = 'care';
        if (/(güvenlik|zorunlu|kritik|sign[\-\s]?in|time[\-\s]?out)/.test(low) || hasCritical) theme = 'safety';
        if (/(kapanış|sign[\-\s]?out|devir|teslim|transfer)/.test(low)) theme = 'closing';

        const section = document.createElement('div');
        section.className = 'intra-task-section ' + theme;
        const head = document.createElement('div');
        head.className = 'intra-task-section-head';
        const titleNode = document.createElement('div');
        titleNode.className = 'intra-task-section-title';
        titleNode.textContent = groupName;
        const countNode = document.createElement('div');
        countNode.className = 'intra-task-section-count';
        countNode.textContent = done + '/' + (total || 0);
        head.appendChild(titleNode);
        head.appendChild(countNode);
        section.appendChild(head);

        titleEl.parentNode.insertBefore(section, titleEl);
        entry = { section, total, done };
        sections.set(groupName, entry);
      }

      // Bu başlığı kaldır ve collected item'ları entry.section'a ekle
      titleEl.parentNode.removeChild(titleEl);
      collected.forEach(node => entry.section.appendChild(node));
    });

    // Grup başlığı olmadan kalan orphan task-item'ları (örn. GCKL-10..28)
    // ortak bir "GCKL Madde Görevleri" section'ına topla.
    const orphans = list.querySelectorAll(':scope > .task-item');
    if (orphans.length) {
      const completed2 = (window.App && App.completedTasks) || [];
      let title = 'GCKL Madde Görevleri';
      let isAllGckl = true;
      orphans.forEach(o => {
        const lbl = (o.querySelector('.task-main .lbl') || {}).textContent || '';
        if (!/^GCKL[-\s]?\d+/i.test(lbl.trim())) isAllGckl = false;
      });
      if (!isAllGckl) title = 'Diğer Görevler';

      let total = orphans.length;
      let done = 0;
      let hasCritical = false;
      orphans.forEach(o => {
        if (o.classList.contains('done')) done++;
        if (o.classList.contains('critical-pending')) hasCritical = true;
      });

      const section = document.createElement('div');
      section.className = 'intra-task-section ' + (hasCritical ? 'safety' : 'care');
      const head = document.createElement('div');
      head.className = 'intra-task-section-head';
      const titleNode = document.createElement('div');
      titleNode.className = 'intra-task-section-title';
      titleNode.textContent = title;
      const countNode = document.createElement('div');
      countNode.className = 'intra-task-section-count';
      countNode.textContent = done + '/' + total;
      head.appendChild(titleNode);
      head.appendChild(countNode);
      section.appendChild(head);

      const first = orphans[0];
      first.parentNode.insertBefore(section, first);
      orphans.forEach(node => section.appendChild(node));
    }
  }

  // === Chip CSS (mevcut nursekit-styles.css'i bozmadan ekleme) ===
  function injectChipStyles() {
    if (document.getElementById('igckl-chip-styles')) return;
    const s = document.createElement('style');
    s.id = 'igckl-chip-styles';
    s.textContent = `
      /* İntraop ek bilgi şeridi — yalnızca kritik uyarılar (HARD-STOP, prereq, breach) */
      .task-item .igckl-strip{grid-column:1 / -1;margin-top:7px;display:flex;flex-direction:column;gap:6px;border:0;padding:0;}
      .task-item .igckl-strip:empty{display:none;}
      .task-item .igckl-hardstop-badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:999px;background:rgba(217,99,113,.14);border:1px solid rgba(217,99,113,.45);color:var(--rose,#d96371);text-transform:uppercase;letter-spacing:.5px;font-weight:800;font-size:9.5px;line-height:1.4;white-space:nowrap;align-self:flex-start;}
      /* Bariyer / ihlal uyarıları — preop note-card paritesi */
      .task-item .igckl-prereq-warn,.task-item .igckl-breach-stripe{display:flex;align-items:center;gap:6px;width:100%;box-sizing:border-box;padding:6px 10px;font-size:10.5px;line-height:1.4;border-radius:8px;letter-spacing:.15px;white-space:normal;font-weight:500;}
      .task-item .igckl-prereq-warn{color:var(--amber,#e0a558);background:rgba(224,165,88,.07);border:1px solid rgba(224,165,88,.32);}
      .task-item .igckl-breach-stripe{color:var(--rose,#d96371);background:rgba(217,99,113,.10);border:1px solid rgba(217,99,113,.45);font-weight:600;}

      /* Durum tonu (preop critical-pending paritesi — task-item sol şerit) */
      .task-item.igckl-state-bad{border-left:3px solid var(--rose,#d96371);}

      /* === Intraop Görev Bölümleri (preop-task-section birebir paritesi) === */
      .intra-task-section{margin:10px 0 12px;padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.025);display:grid;gap:7px;}
      .intra-task-section.safety{border-color:rgba(217,99,113,.24);background:linear-gradient(180deg,rgba(217,99,113,.045),rgba(255,255,255,.018));}
      .intra-task-section.care{border-color:rgba(92,196,214,.18);background:linear-gradient(180deg,rgba(92,196,214,.035),rgba(255,255,255,.015));}
      .intra-task-section.closing{border-color:rgba(217,99,113,.24);background:linear-gradient(180deg,rgba(217,99,113,.045),rgba(255,255,255,.018));}
      .intra-task-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 8px;}
      .intra-task-section-title{font-size:12px;font-weight:850;letter-spacing:.01em;color:var(--ink,#e8eef5);text-transform:none;line-height:1.25;}
      .intra-task-section-count{font-size:10px;font-weight:750;color:var(--ink-mute,#a4b4c7);padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10);white-space:nowrap;}
      /* Section içindeki task-item'lar — kart-içi-kart hissi yapmaması için sade arka plan */
      .intra-task-section .task-item{box-shadow:none;}

      /* === Substep Checklist (preop nk-step-list paritesi) === */
      .task-item .intra-step-list{display:grid;gap:5px;margin-top:8px;padding-top:8px;border-top:1px dashed rgba(255,255,255,.08);}
      .task-item .intra-step{font-size:11px;color:var(--ink-mute,#a4b4c7);display:flex;gap:8px;align-items:flex-start;line-height:1.45;}
      .task-item .intra-step.done{color:var(--green,#4cb88a);}
      .task-item .intra-step-icon{flex-shrink:0;width:14px;height:14px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;line-height:1;}
      .task-item .intra-step.done .intra-step-icon{color:var(--green,#4cb88a);}
      .task-item .intra-step-text{flex:1;min-width:0;overflow-wrap:anywhere;}
    `;
    document.head.appendChild(s);
  }

  // === INIT ===
  function init() {
    ensureAppAlias();
    injectChipStyles();
    installPhaseBlockerHook();
    installSwitchRoomWrapper();
    installCompleteTaskHook();
    installRightPanelHook();
    syncAll();
    refreshMap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ===== End inline intra-gckl-bootstrap.js ===== */
