/* ===== Inlined from phase-scores.js ===== */
/* =====================================================================
   PHASE SCORES 100 — Her faz bağımsız 100p, final = ortalama
   ===================================================================== */
(function () {
  'use strict';

  const PS = {
    preop:   { score: 0, max: 100, categories: {}, criticalErrors: [], source: 'network' },
    intraop: { score: 0, max: 100, categories: {}, criticalErrors: [], source: 'legacy'  },
    postop:  { score: 0, max: 100, categories: {}, criticalErrors: [], source: 'legacy'  }
  };

  function computePreop() {
    if (!window.PreopGCKL || !window.__preopGcklState) return null;
    const r = window.PreopGCKL.compute(window.__preopGcklState);
    return {
      score: r.total,
      max: 100,
      categories: r.byCategory,
      criticalErrors: r.breaches.map(b => ({ id: b.id, label: b.label })),
      pendingCriticals: r.pendingCriticals.map(b => ({ id: b.id, label: b.label })),
      reasoningBonus: r.reasoningBonus,
      earnedBase: r.earnedBase,
      lost: r.lost,
      cap: r.cap || null
    };
  }



  function computeIntraop() {
    if (!window.IntraopGCKL || typeof window.IntraopGCKL.compute !== 'function') return null;
    const r = window.IntraopGCKL.compute();
    const criticals = (r.breaches || []).map(b => ({ id: b.id, label: b.label }));
    const pending = (r.missingCritical || []).map(b => ({ id: b.id, label: b.label }));
    return {
      score: r.total,
      max: 100,
      categories: r.byCategory || {},
      criticalErrors: criticals,
      pendingCriticals: pending,
      reasoningBonus: r.reasoningBonus || 0,
      earnedBase: r.earnedBase || 0,
      lost: r.lost || 0,
      cap: r.barrierCap && r.barrierCap < 100 ? r.barrierCap : null,
      source: 'network'
    };
  }

  function computeLegacy(phase) {
    if (!window.App || !window.App.phaseScores || !window.App.phaseScores[phase]) {
      return { score: 0, max: 100, categories: {}, criticalErrors: [], source: 'legacy' };
    }
    const ps = window.App.phaseScores[phase];
    const pct = ps.max > 0 ? Math.max(0, Math.min(100, Math.round((ps.earned / ps.max) * 100))) : 0;
    return { score: pct, max: 100, categories: {}, criticalErrors: [], source: 'legacy', rawEarned: ps.earned, rawMax: ps.max };
  }

  function recompute() {
    const pre = computePreop();
    if (pre) Object.assign(PS.preop, pre, { source: 'network' });
    const intra = computeIntraop();
    if (intra) Object.assign(PS.intraop, intra);
    else Object.assign(PS.intraop, computeLegacy('intraop'));
    Object.assign(PS.postop,  computeLegacy('postop'));
    return PS;
  }

  function computeFinal() {
    recompute();
    const pre = PS.preop.score || 0;
    const intra = PS.intraop.score || 0;
    const post = PS.postop.score || 0;
    return {
      preop: pre,
      intraop: intra,
      postop: post,
      final: Math.round((pre + intra + post) / 3),
      phases: PS
    };
  }

  window.PhaseScores100 = {
    state: PS,
    recompute: recompute,
    compute: computeFinal,
    computePreop: computePreop,
    computeIntraop: computeIntraop,
    computeLegacy: computeLegacy
  };
})();

/* ===== End inline phase-scores.js ===== */
