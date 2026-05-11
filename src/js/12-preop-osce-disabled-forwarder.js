(function () {
  // OSCE preop kısmını devre dışı bırak (ağ modeli yönetiyor)
  try {
    document.body.classList.remove('osce-legacy-on');
    document.body.classList.add('osce-preop-disabled');
  } catch (e) {}

  // completeTask'ı sar — preop fazında PreopGCKL'e tag forward et
  function tryWrap() {
    if (typeof window.completeTask !== 'function') { setTimeout(tryWrap, 600); return; }
    if (window.completeTask.__preopGcklWrapped) return;
    const orig = window.completeTask;
    const wrapped = function (taskId, sourceObj) {
      const result = orig.apply(this, arguments);
      try {
        if (window.App && window.App.currentRoom === 'preop' && window.preopGcklOnTaskComplete) {
          // taskId genelde t_* tag taşıyor; doğrudan ilet
          window.preopGcklOnTaskComplete(taskId);
          // Görevin tag listesini de iletmeye çalış
          const t = (window.App.currentPatient?.tasks || []).find(x => x && x.id === taskId);
          if (t && Array.isArray(t.tags)) t.tags.forEach(tag => window.preopGcklOnTaskComplete(tag));
        }
      } catch (e) { console.warn('[PRE-GCKL] task forward error', e); }
      return result;
    };
    wrapped.__preopGcklWrapped = true;
    try { window.completeTask = wrapped; } catch (e) {}
    try { completeTask = wrapped; } catch (e) {}
  }
  tryWrap();

  // Mevcut MCQ rationale modal'ı yakala — sonuç PreopGCKL'e iletilsin
  // Sayfa içinde "msvActions" / "selectMSVOption" benzeri global handler aranır
  function hookRationaleAnswers() {
    if (typeof window.handleMSVOptionSelect === 'function' && !window.handleMSVOptionSelect.__pgWrap) {
      const o = window.handleMSVOptionSelect;
      const w = function (qId, optIdx, isCorrect) {
        try {
          // taskId'den nodeId'ye ulaşmaya gerek yok — qId genelde task tag'i taşıyor
          if (window.preopGcklAnswerRationale && window.App?.currentRoom === 'preop') {
            // optIdx -> network optionIndex (-1 doğru)
            const nodeId = (window.PreopGCKL && Object.keys(window.PreopGCKL.NODES)
              .find(id => qId && qId.toLowerCase().includes(id.toLowerCase()))) || null;
            if (nodeId) window.preopGcklAnswerRationale(nodeId, isCorrect ? -1 : optIdx);
          }
        } catch (e) {}
        return o.apply(this, arguments);
      };
      w.__pgWrap = true;
      window.handleMSVOptionSelect = w;
    }
    setTimeout(hookRationaleAnswers, 1500);
  }
  hookRationaleAnswers();

  // Faz değişiminde panel yenile
  if (typeof window.advancePhase === 'function' && !window.advancePhase.__pgWrap) {
    const o = window.advancePhase;
    const w = function () {
      const r = o.apply(this, arguments);
      try { if (window.preopGcklCompute) window.preopGcklCompute(); } catch (e) {}
      return r;
    };
    w.__pgWrap = true;
    window.advancePhase = w;
  }

  console.log('[PRE-GCKL] 100p Ağ tabanlı preop puanlama aktif. window.preopGcklCompute() ile durum görülebilir.');
})();
