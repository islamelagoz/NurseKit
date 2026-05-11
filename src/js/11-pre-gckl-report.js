/* ===== Inlined from pre-gckl-report.js ===== */
/* =====================================================================
   PRE_GCKL Report Injection — Rapor ekranında ağ çıktısı + 100/100/100 + final ortalama
   ===================================================================== */
(function () {
  'use strict';

  function wrapRenderReport() {
    if (typeof window.renderReport !== 'function') {
      return setTimeout(wrapRenderReport, 300);
    }
    if (window.__preopGcklReportInstalled) return;
    window.__preopGcklReportInstalled = true;

    const original = window.renderReport;
    window.renderReport = function () {
      try { original.apply(this, arguments); } catch (e) { console.warn('renderReport error', e); }
      try { injectNetworkAndPhase100Block(); } catch (e) { console.warn('PRE-GCKL report injection failed', e); }
    };
  }

  function ensureStyles() {
    if (document.getElementById('pre-gckl-report-styles')) return;
    const css = `
      .pgnet-block{background:var(--navy-1,#0e1a2c);border:1px solid var(--teal-3,#2d6c80);border-radius:10px;padding:18px;margin:16px 0;color:var(--ink-1,#e6eef7);font-family:'Inter',system-ui,sans-serif;}
      .pgnet-block h3{margin:0 0 12px;font-size:15px;color:var(--teal-1,#5cc4d6);letter-spacing:.4px;}
      .pgnet-block h4{margin:14px 0 8px;font-size:13px;color:var(--ink-2,#a9bfd2);font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
      .pgnet-phase-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:6px 0 14px;}
      .pgnet-phase-card{background:var(--navy-2,#0a1428);border:1px solid var(--teal-3,#2d6c80);border-radius:8px;padding:12px;text-align:center;}
      .pgnet-phase-card.final{border-color:#7ad4a3;background:rgba(122,212,163,.08);}
      .pgnet-phase-card .v{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:var(--ink-1,#e6eef7);}
      .pgnet-phase-card .v small{font-size:13px;color:var(--ink-3,#7e93aa);font-weight:500;}
      .pgnet-phase-card .l{font-size:11px;color:var(--ink-3,#7e93aa);text-transform:uppercase;letter-spacing:.6px;margin-top:4px;}
      .pgnet-cat-row{display:grid;grid-template-columns:160px 1fr 70px;gap:10px;align-items:center;padding:6px 0;font-size:12px;}
      .pgnet-cat-row .lbl{color:var(--ink-2,#a9bfd2);}
      .pgnet-cat-row .bar{height:6px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;}
      .pgnet-cat-row .bar>i{display:block;height:100%;background:linear-gradient(90deg,#5cc4d6,#7ad4a3);}
      .pgnet-cat-row .pts{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--ink-2,#a9bfd2);text-align:right;}
      .pgnet-nodes{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px;margin-top:8px;}
      .pgnet-node{display:grid;grid-template-columns:10px 1fr auto;gap:8px;align-items:center;padding:5px 8px;border-radius:6px;background:rgba(255,255,255,.025);font-size:11.5px;}
      .pgnet-node.done{background:rgba(122,212,163,.10);}
      .pgnet-node.wrong{background:rgba(255,107,107,.12);}
      .pgnet-node.stopped{background:rgba(255,196,93,.12);}
      .pgnet-node.pending{opacity:.55;}
      .pgnet-node .dot{width:8px;height:8px;border-radius:50%;background:#3a4f6b;}
      .pgnet-node.done .dot{background:#7ad4a3;}
      .pgnet-node.wrong .dot{background:#ff6b6b;}
      .pgnet-node.stopped .dot{background:#ffc45d;}
      .pgnet-node .pts{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--ink-3,#7e93aa);}
      .pgnet-warn{background:rgba(255,107,107,.10);border:1px solid rgba(255,107,107,.4);padding:10px 12px;border-radius:8px;font-size:12px;color:#ffd5d5;margin-top:10px;}
      .pgnet-warn.pending{background:rgba(255,196,93,.10);border-color:rgba(255,196,93,.35);color:#ffe2a8;}
    `;
    const style = document.createElement('style');
    style.id = 'pre-gckl-report-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectNetworkAndPhase100Block() {
    ensureStyles();
    const report = document.querySelector('#report-screen .report-doc');
    if (!report) return;

    // Eski blok varsa kaldır
    const old = document.getElementById('pgnet-report-block');
    if (old) old.remove();

    const final = window.PhaseScores100 ? window.PhaseScores100.compute() : null;
    const PG = window.PreopGCKL;
    const STATE = window.__preopGcklState;
    if (!final || !PG || !STATE) return;

    const r = PG.compute(STATE);

    const cats = [
      { key: 'criticalSafety', label: 'Kritik Güvenlik' },
      { key: 'clinicalPrep',   label: 'Klinik Hazırlık' },
      { key: 'communication',  label: 'İletişim & Eğitim' }
    ];

    let catHtml = '';
    cats.forEach(c => {
      const cd = r.byCategory[c.key] || { earned: 0, max: 0 };
      const pct = cd.max > 0 ? Math.round((cd.earned / cd.max) * 100) : 0;
      catHtml += `<div class="pgnet-cat-row">
        <span class="lbl">${c.label}</span>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="pts">${cd.earned} / ${cd.max}</span>
      </div>`;
    });

    let nodesHtml = '';
    Object.keys(PG.NODES).forEach(id => {
      const def = PG.NODES[id];
      const n = STATE.nodes[id];
      const klass = ['pgnet-node', n.status].join(' ');
      nodesHtml += `<div class="${klass}">
        <span class="dot"></span>
        <span class="lbl">${def.label}</span>
        <span class="pts">${n.scoreEarned}/${def.weight}</span>
      </div>`;
    });

    let warnHtml = '';
    if (r.breaches.length > 0) {
      warnHtml = `<div class="pgnet-warn"><b>⛔ Güvenli cerrahi bariyer ihlali:</b> ${r.breaches.map(b => b.label).join(', ')} — preop skoru ${r.cap ? `${r.cap} ile sınırlandı` : 'etkilendi'}.</div>`;
    } else if (r.pendingCriticals.length > 0) {
      warnHtml = `<div class="pgnet-warn pending"><b>⚠ Tamamlanmamış kritik düğümler:</b> ${r.pendingCriticals.map(b => b.label).join(', ')}.</div>`;
    }

    const block = document.createElement('div');
    block.id = 'pgnet-report-block';
    block.className = 'osce-report-block pgnet-block';
    block.innerHTML = `
      <h3>Faz Bazlı Puanlama (her faz 100 üzerinden)</h3>
      <div class="pgnet-phase-grid">
        <div class="pgnet-phase-card"><div class="v">${final.preop}<small> / 100</small></div><div class="l">Preop</div></div>
        <div class="pgnet-phase-card"><div class="v">${final.intraop}<small> / 100</small></div><div class="l">Intraop</div></div>
        <div class="pgnet-phase-card"><div class="v">${final.postop}<small> / 100</small></div><div class="l">Postop</div></div>
        <div class="pgnet-phase-card final"><div class="v">${final.final}<small> / 100</small></div><div class="l">Final Ortalama</div></div>
      </div>

      <h4>Preop GCKL Ağ Çıktısı</h4>
      ${catHtml}
      <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--ink-3,#7e93aa);margin-top:6px;">
        <span>Akıl yürütme bonusu: +${r.reasoningBonus} / 10</span>
        <span>Kazanılan: ${r.earnedBase} · Kaybedilen: ${r.lost}${r.cap ? ` · Tavan: ${r.cap}` : ''}</span>
      </div>

      <h4>Düğüm Durumları</h4>
      <div class="pgnet-nodes">${nodesHtml}</div>

      ${warnHtml}
    `;
    report.appendChild(block);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wrapRenderReport);
  } else {
    wrapRenderReport();
  }
})();

/* ===== End inline pre-gckl-report.js ===== */
