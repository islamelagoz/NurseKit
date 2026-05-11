# NurseKit Split Manifest

Source: `NurseKit_v9_65_STEP13_FINAL_REGRESSION.html`  
Source size: 2,951,839 bytes  
Source lines: 43,055  

## Files created

- `index.html` — split application entry point.
- `NurseKit_v9_65_STEP13_FINAL_REGRESSION.html` — split version using the original filename.
- `backups/NurseKit_v9_65_STEP13_FINAL_REGRESSION.original.html` — untouched original backup.
- `src/styles/nursekit.css` — primary CSS block.
- `src/js/*.js` — existing inline scripts externalised in original order.

## JavaScript files

1. `src/js/01-console-shim.js` — original line 10, 956 bytes
2. `src/js/02-main-app.js` — original line 1281, 2,258,741 bytes
3. `src/js/03-pre-gckl-network.js` — original line 31632, 32,845 bytes
4. `src/js/04-pre-gckl-bootstrap.js` — original line 32089, 12,718 bytes
5. `src/js/05-intra-gckl-network.js` — original line 32257, 40,848 bytes
6. `src/js/06-intra-gckl-bootstrap.js` — original line 32749, 32,335 bytes
7. `src/js/07-intra-gckl-popup.js` — original line 33280, 26,930 bytes
8. `src/js/08-intra-popups.js` — original line 33649, 130,472 bytes
9. `src/js/09-intra-gckl-report.js` — original line 35978, 18,310 bytes
10. `src/js/10-phase-scores.js` — original line 36404, 3,244 bytes
11. `src/js/11-pre-gckl-report.js` — original line 36473, 7,500 bytes
12. `src/js/12-preop-osce-disabled-forwarder.js` — original line 36645, 3,003 bytes
13. `src/js/13-gckl-board-sync-load.js` — original line 36672, 96 bytes
14. `src/js/14-gckl10-tasklist-patch.js` — original line 36673, 142,374 bytes

## Important limitation

This is a mechanical split, not a full semantic architecture refactor. The next safe step is patient/case data extraction after browser smoke testing.
