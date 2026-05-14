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
    return markTaskCompleteFromEvidence(entry.taskId, sourceObj || null);
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
      if (window.App && window.App.currentRoom === 'intraop' && rid === 'postop' && window.NK_BYPASS_GATE !== true) {
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
      + '.igm9-node.partial{background:rgba(224,165,88,.08);border-color:rgba(224,165,88,.28)}'
      + '.igm9-node.partial .dot{background:var(--amber,#e2c97e)}'
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
    // countSafety için phase'e göre özel hesap
    if (rawNode.id === 'countSafety' && phase) {
      var evList = nodeReport.evidence || [];
      var key = 'count_' + phase;
      var has = evList.indexOf(key) >= 0;
      if (has) return 'complete';
      if (evList.length > 0) return 'partial';
      return 'pending';
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

        // Eksik evidence sayısı
        var req = raw.requiredEvidence || [];
        var ev = r.evidence || [];
        var missingEv;
        if (n.phase) {
          // countSafety için yalnız ilgili evidence
          var k = 'count_' + n.phase;
          missingEv = ev.indexOf(k) >= 0 ? 0 : 1;
        } else {
          missingEv = req.filter(function (x) { return ev.indexOf(x) === -1; }).length;
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
        // Chip satırı: hard-stop ve eksik evidence
        if (raw.hardStop || missingEv > 0) {
          html += '<div class="igm9-node-chips">';
          if (raw.hardStop) html += '<span class="igm9-node-chip hs">Hard-stop</span>';
          if (missingEv > 0) html += '<span class="igm9-node-chip evmiss">' + missingEv + ' evidence eksik</span>';
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
    panel.querySelectorAll('.igm9-node').forEach(function (el) {
      el.addEventListener('click', function () {
        var ck = el.getAttribute('data-key');
        if (!ck) return;
        try {
          if (typeof window.showObjPopup === 'function') {
            var fakeObj = { opts: { clinicalKey: ck }, clinicalKey: ck };
            window.showObjPopup(fakeObj, 0, 0);
          }
        } catch (e) { console.warn('[IGM9] popup açma hatası', e); }
      });
    });
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
      const stopChip = n.hardStop ? '<span class="igckl-chip crit">HARD-STOP</span>' : '';
      const breachStripe = r.breach
        ? '<div class="igckl-breach-stripe">⛔ Kritik güvenlik bariyer ihlali</div>' : '';
      const prereqWarn = (!r.prereqsMet && r.status === 'pending')
        ? '<div class="igckl-prereq-warn">⛓ Önceki bariyerler tamamlanmadı</div>' : '';

      strip.innerHTML =
        '<div class="igckl-chips">' +
          '<span class="igckl-chip gckl" title="' + n.gckl.replace(/"/g,'&quot;') + '">GCKL</span>' +
          '<span class="igckl-chip cat">' + (IG.getCategories()[n.category]?.label || n.category) + '</span>' +
          '<span class="igckl-chip role">' + (n.role || []).slice(0,2).join('·') + '</span>' +
          '<span class="igckl-chip pts">' + r.earned + '/' + r.max + '</span>' +
          '<span class="igckl-dot ' + statusCls + '"></span>' +
          stopChip +
        '</div>' + prereqWarn + breachStripe;
    });
  }

  // === Chip CSS (mevcut nursekit-styles.css'i bozmadan ekleme) ===
  function injectChipStyles() {
    if (document.getElementById('igckl-chip-styles')) return;
    const s = document.createElement('style');
    s.id = 'igckl-chip-styles';
    s.textContent = `
      .task-item .igckl-strip{margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.08);}
      .task-item .igckl-chips{display:flex;gap:4px;flex-wrap:wrap;align-items:center;font-size:9.5px;font-family:Inter,system-ui,sans-serif;}
      .task-item .igckl-chip{padding:1px 7px;border-radius:99px;background:rgba(92,196,214,.10);border:1px solid rgba(92,196,214,.25);color:#cfe6ed;text-transform:uppercase;letter-spacing:.4px;font-weight:600;font-size:9px;}
      .task-item .igckl-chip.gckl{background:rgba(92,196,214,.18);border-color:rgba(92,196,214,.45);color:#a8e0ec;}
      .task-item .igckl-chip.cat{background:rgba(122,212,163,.10);border-color:rgba(122,212,163,.28);color:#bce6cf;}
      .task-item .igckl-chip.role{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12);color:#c0cfdc;}
      .task-item .igckl-chip.pts{background:rgba(0,0,0,.25);border-color:rgba(255,255,255,.10);color:#5cc4d6;font-family:'JetBrains Mono',monospace;}
      .task-item .igckl-chip.crit{background:rgba(255,107,107,.18);border-color:rgba(255,107,107,.50);color:#ffc8c8;}
      .task-item .igckl-dot{width:8px;height:8px;border-radius:50%;background:#3a4f6b;margin-left:auto;}
      .task-item .igckl-dot.ok{background:#7ad4a3;box-shadow:0 0 0 2px rgba(122,212,163,.22);}
      .task-item .igckl-dot.mid{background:#ffc45d;box-shadow:0 0 0 2px rgba(255,196,93,.22);}
      .task-item .igckl-dot.bad{background:#ff6b6b;box-shadow:0 0 0 2px rgba(255,107,107,.22);}
      .task-item .igckl-dot.pending{background:#4a5e78;}
      .task-item .igckl-prereq-warn{margin-top:5px;padding:3px 7px;font-size:10px;color:#ffe6b5;background:rgba(255,196,93,.08);border:1px solid rgba(255,196,93,.25);border-radius:6px;}
      .task-item .igckl-breach-stripe{margin-top:5px;padding:3px 7px;font-size:10px;color:#ffd5d5;background:rgba(255,107,107,.14);border:1px solid rgba(255,107,107,.40);border-radius:6px;font-weight:600;}
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
