# NurseKit Split Manifest

Tek HTML giriş: `index.html`
Tüm JavaScript modülleri `src/js/` altında, rol bazlı klasörlere ayrılmıştır.
CSS: `src/styles/nursekit.css`

## Klasör yapısı

```
src/
├── styles/
│   └── nursekit.css
└── js/
    ├── core/                  → çekirdek (shim + ana uygulama)
    │   ├── console-shim.js
    │   └── main-app.js        ⚠ ~27.5k satır — sahne sonrası geri kalanı parçalanacak
    ├── scene/                 → 3D motor (TAMAMI modülerleşti) ✅
    │   ├── engine.js          ✓ 1/5: state + init/dispose + kamera + render loop + helper'lar + placement + room shell
    │   ├── markers.js         ✓ 2/5: görev ipuçları + marker tamamlama + GCKL pano senkronu + sprite/etiket + rol odağı
    │   ├── patient-body.js    ✓ 3/5: buildPatient + yatak/masa/monitör/IV + buildHuman + temel cerrahi ekipman
    │   ├── equipment.js       ✓ 4/5: V151/V2 premium ekipmanlar + duvar donanımı + karakterler + preop/postop panelleri + buildIntraop monolit
    │   └── intraop-builds.js  ✓ 5/5: surgicalSceneProfile + CABG/Ortho/Lap/Trauma + V2 ekipmanlar + dispatcher wrapper
    ├── phases/
    │   ├── preop/             → Preoperatif faz
    │   │   ├── gckl-network.js
    │   │   ├── gckl-bootstrap.js
    │   │   ├── gckl-report.js
    │   │   └── osce-disabled.js
    │   └── intraop/           → İntraoperatif faz
    │       ├── gckl-network.js
    │       ├── gckl-bootstrap.js
    │       ├── gckl-popup.js
    │       ├── popups.js
    │       └── gckl-report.js
    ├── scoring/               → Faz puanları (100/100/100, ortalama)
    │   └── phase-scores.js
    └── patches/               → Son aşamada çalışan küçük yamalar
        ├── gckl-board-sync.js
        └── gckl10-tasklist.js
```

## Yükleme sırası (kritik)

`index.html` `<head>`'inde:

1. `core/console-shim.js` — three.js'ten **önce** yüklenmek zorunda

`index.html` `</body>`'den önce, yukarıdan aşağıya:

1. `scene/engine.js`              ← main-app'ten **ÖNCE** (patch'ler parse anında `addObj`'i monkey-patch'liyor)
2. `scene/patient-body.js`        ← main-app'ten **ÖNCE** (patch'ler parse anında `buildHuman`'ı monkey-patch'liyor)
3. `scene/equipment.js`           ← main-app'ten **ÖNCE** (patch'ler parse anında `buildNurseCharacter3D`'ü monkey-patch'liyor; ayrıca `buildIntraop` burada tanımlı)
4. `scene/intraop-builds.js`      ← main-app'ten **ÖNCE**, equipment.js'TEN **SONRA** (dispatcher `buildIntraop`'u parse anında yakalıyor)
5. `core/main-app.js`
6. `scene/markers.js`             ← main-app'ten **SONRA** (GCKL/task helper'larına referans veriyor)
7. `phases/preop/gckl-network.js`
3. `phases/preop/gckl-bootstrap.js`
4. `phases/intraop/gckl-network.js`
5. `phases/intraop/gckl-bootstrap.js`
6. `phases/intraop/gckl-popup.js`
7. `phases/intraop/popups.js`
8. `phases/intraop/gckl-report.js`
9. `scoring/phase-scores.js`
10. `phases/preop/gckl-report.js`
11. `phases/preop/osce-disabled.js`
12. `patches/gckl-board-sync.js`
13. `patches/gckl10-tasklist.js`

## Sonraki adımlar

3D sahne parçalama planı:
## Sonraki adımlar

**3D sahne parçalama tamamlandı** ✅ — 5/5 aşama bitti.

Kalan işler (isteğe bağlı, bugün için zorunlu değil):
- `core/main-app.js` içinde kalan — yaklaşık 13k satır:
  - OSCE-PHDYÖ + GCKL veri tanımları ve skorlama
  - Vaka tanımları (CASES)
  - App state + screen state machine
  - UI render fonksiyonları (topbar, panels, dialogue, report)
  - Ses + dialog + AI tutor motoru
  - Patch IIFE'leri (v5.6, v5.7, v5.8, v9.x)
- Mantıksal bölme önerisi:
  - `data/cases.js` — vaka tanımları
  - `data/osce-gckl.js` — madde/kriter veri satırları
  - `ui/screens.js`, `ui/panels.js`, `ui/dialogue.js`, `ui/report.js`
  - `state/state-machine.js`
  - `audio/audio-engine.js`
- `styles/nursekit.css` büyürse `base/`, `components/`, `screens/` alt klasörlerine bölülebilir.
