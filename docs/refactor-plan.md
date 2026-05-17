# NurseKit Refactor Plan

## Current state

The original app was a large single-file HTML application containing CSS, JavaScript, patient/case data, task lists, GCKL/checklist logic, scoring, phase progression, dialogue logic, and Three.js/3D scene code.

## This package

This package performs a **mechanical split only**:

- Primary CSS moved to `src/styles/nursekit.css`.
- Existing inline JavaScript blocks moved to ordered external files under `src/js/`.
- External CDN scripts were preserved.
- Script order was preserved.
- The large main application script is still one file (`src/js/02-main-app.js`) because splitting it semantically without a dependency map would be unsafe.

## Next refactor sequence

1. Confirm mechanical split works in browser.
2. Extract patient/case data.
3. Extract task list data by phase.
4. Extract GCKL data by phase.
5. Extract object-task-GCKL maps.
6. Extract scene core.
7. Extract phase-specific 3D scenes.
8. Extract scoring and phase gate logic.

## Rule

Do not do semantic refactors until this mechanical split passes the smoke checklist.
