# NurseKit Refactor Rules

This repository contains an educational perioperative nursing simulator. The original single-file HTML is the working baseline.

## Non-negotiable rules

- Do not rewrite the whole application.
- Do not change clinical content unless explicitly requested.
- Do not rename task IDs, GCKL IDs, patient IDs, object IDs, function names, scoring keys, CSS classes, or DOM IDs unless explicitly requested.
- Do not remove existing functionality.
- Do not modernise the UI unless the task specifically asks for UI changes.
- Do not touch Three.js or 3D scene code during CSS/data/task/GCKL refactors.
- Do not touch task/GCKL logic during CSS extraction.
- Do not change JavaScript execution order unless explicitly requested.
- Keep each pull request small and focused.

## Refactor order

1. Mechanical split: CSS and existing inline scripts externalised.
2. Patient/case data extraction.
3. Task list data extraction by phase.
4. GCKL data extraction by phase.
5. Object-task-GCKL mapping extraction.
6. Scene core extraction.
7. Phase-specific 3D scene extraction.
8. Scoring and phase gate extraction.
