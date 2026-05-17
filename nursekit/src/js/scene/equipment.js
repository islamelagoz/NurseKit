/* ============================================================
   scene/equipment.js — V151/V2 Premium Ekipmanlar + Karakterler
   ------------------------------------------------------------
   Bu modül 3D sahnedeki gelişmiş ekipman build fn'lerini içerir:

     • Duvar / oda donanımı:
         buildHeadwallUnit, buildWallHygieneStation, buildWallClockSimple,
         buildORDoorPortal, buildSterileBoundaryGate, buildIntraopZoneGuides,
         buildIntraopFlowBoard, buildWallIntraopFlowBoard
         buildForcedAirWarmer, buildHandHygieneStation
         buildSupplyCabinet, buildWasteBins

     • Karakterler (stilize anatomik figürler):
         buildAnimeRelative, buildStylizedFace
         buildNurseCharacter3D, buildDoctorCharacter3D
         buildStandingPatient3D, buildRelativeCharacter3D, buildSupportiveTrio3D

     • V151 / V2 premium ameliyat ekipmanları:
         buildMayoStand, buildMayoStandV151
         buildHeartLungMachine, buildPerfusionConsole
         buildHybridOpTableV151
         buildCABGOpTablePatientV1, buildCABGOpTablePatientV2
         buildAnaesthesiaWorkstationV151
         buildESUCartV151, buildESUCartV2
         buildCABGSurgicalPatientFieldV1, buildGraftPrepTableV1
         buildCPBMachineV151
         buildSuctionSmokeUnitV151, buildSuctionSmokeUnitV2, buildSmokeEvacUnit
         buildAirwayCartV151
         buildRapidInfuserV151, buildSpecimenStationV151
         buildWarmingPressureOverlayV151, buildPositioningSetV151
         buildWasteStationV151

     • Preop hazırlık panelleri:
         buildMiniStand, buildModernPatientCardStand, buildNPOCardStand
         buildModernConsentPanel, buildTrayKit, buildPrepSupplyStand
         buildCompressionSet, buildVTEPrepStand, buildClipperPrepStand

     • Postop / PACU donanımı:
         buildUrineBag, buildPCADevice, buildSpirometer, buildPONVSet, buildWalkerAid

   Bağımlılıklar:
     - THREE                              (global)
     - var three, var App                 (scene/engine.js)
     - mat, box, cyl, sphere, prepMesh    (scene/engine.js)
     - groupAt, addObj, addDecor          (scene/engine.js)
     - statusMarker                       (scene/markers.js)
     - buildBed, buildOpTable, buildIV, buildMonitor, ... (scene/patient-body.js)

   Yükleme sırası: scene/engine.js → scene/patient-body.js → scene/equipment.js
                   → core/main-app.js → scene/markers.js
   ============================================================ */

        function buildHeadwallUnit(x, y, z, mode = 'preop') {
            // PREMIUM HEADWALL UNIT v2 — V2 dialect (anodize + brushed alu + LED)
            const g = groupAt(x, y, z);
            // Ana headwall paneli (anodize)
            g.add(box(2.40, 0.42, 0.08, 0x3a4754, 0, 1.34, 0, { metalness: 0.55, roughness: 0.30 }));
            // Üst/alt brushed alu çerçeveler
            g.add(box(2.36, 0.04, 0.10, 0xb6bfc8, 0, 1.555, 0.005, { metalness: 0.70, roughness: 0.22 }));
            g.add(box(2.36, 0.04, 0.10, 0xb6bfc8, 0, 1.125, 0.005, { metalness: 0.70, roughness: 0.22 }));
            // Üst/alt LED accent (turkuaz/mavi)
            g.add(box(2.30, 0.006, 0.014, 0x2dd4bf, 0, 1.582, 0.012, { emissive: 0x2dd4bf, emissiveIntensity: 0.65, transparent: true, opacity: 0.85 }));
            g.add(box(2.30, 0.006, 0.014, 0x4d9ef0, 0, 1.098, 0.012, { emissive: 0x4d9ef0, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            // 8 medikal gaz/elektrik portu (renk kodlu)
            [-0.88,-0.62,-0.36,-0.10,0.16,0.42,0.68,0.94].forEach((xx,i) => {
                const colors = [0x4cb88a, 0xfbbf24, 0x4d9ef0, 0xb6bfc8];
                const col = colors[i % 4];
                g.add(box(0.13, 0.13, 0.028, 0x222a33, xx, 1.34, 0.045, { metalness: 0.55, roughness: 0.30 }));
                g.add(cyl(0.034, 0.034, 0.018, col, xx, 1.34, 0.060, { seg: 18, emissive: col, emissiveIntensity: 0.85 }));
                g.add(cyl(0.022, 0.022, 0.020, 0x0a0e14, xx, 1.34, 0.066, { seg: 14, roughness: 0.65 }));
                g.add(cyl(0.030, 0.030, 0.030, 0xb6bfc8, xx, 1.22, 0.060, { seg: 14, metalness: 0.78, roughness: 0.16 }));
                g.add(cyl(0.005, 0.005, 0.004, 0x4cb88a, xx, 1.22, 0.078, { seg: 10, emissive: 0x4cb88a, emissiveIntensity: 0.95 }));
            });
            // Sol kol askısı (krom)
            g.add(box(0.06, 0.68, 0.06, 0xb6bfc8, -0.94, 1.92, 0.02, { metalness: 0.78, roughness: 0.14 }));
            g.add(box(0.62, 0.06, 0.05, 0xb6bfc8, -0.66, 2.20, 0.02, { metalness: 0.78, roughness: 0.14 }));
            // Üst durum ekranı (cam)
            g.add(box(0.50, 0.30, 0.012, 0x0a0e14, -0.32, 2.06, 0.054, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.46, 0.26, 0.001, mode === 'postop' ? 0x4cb88a : 0x2dd4bf, -0.32, 2.06, 0.061, { emissive: mode === 'postop' ? 0x4cb88a : 0x2dd4bf, emissiveIntensity: 0.65 }));
            [0.04, 0, -0.04].forEach((dy, i) => {
                const colors = [0xfafdff, 0xfbbf24, 0x4d9ef0];
                g.add(box(0.30, 0.014, 0.0015, colors[i], -0.32, 2.06 + dy, 0.063, { emissive: colors[i], emissiveIntensity: 0.75 }));
            });
            g.add(box(0.20, 0.014, 0.005, 0x2dd4bf, -0.32, 2.20, 0.058, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            // Çağrı butonu paneli (sağ üst)
            g.add(box(0.18, 0.30, 0.024, 0x222a33, 0.94, 2.00, 0.054, { metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.024, 0.024, 0.012, 0xe04646, 0.94, 2.06, 0.068, { seg: 18, emissive: 0xe04646, emissiveIntensity: 0.85 }));
            g.add(cyl(0.024, 0.024, 0.012, 0x4cb88a, 0.94, 1.94, 0.068, { seg: 18, emissive: 0x4cb88a, emissiveIntensity: 0.85 }));
            return g;
        }


        function buildAnimeRelative(x, y, z, palette = 0xf2a7b8) {
            const g = groupAt(x, y, z);
            // oversized anime head
            const head = sphere(0.18, 0xf0c8aa, 0, 1.18, 0, { roughness: 0.52 });
            g.add(head);
            const hair = sphere(0.19, 0x5a4639, 0, 1.24, -0.02, { roughness: 0.70 });
            hair.scale.set(1.02, 0.85, 1.02); g.add(hair);
            // eyes
            g.add(box(0.045, 0.065, 0.015, 0xffffff, -0.055, 1.19, 0.16, { roughness: 0.25 }));
            g.add(box(0.045, 0.065, 0.015, 0xffffff, 0.055, 1.19, 0.16, { roughness: 0.25 }));
            g.add(box(0.018, 0.030, 0.016, 0x3f4f8a, -0.055, 1.18, 0.17, { emissive: 0x3f4f8a, emissiveIntensity: 0.08 }));
            g.add(box(0.018, 0.030, 0.016, 0x3f4f8a, 0.055, 1.18, 0.17, { emissive: 0x3f4f8a, emissiveIntensity: 0.08 }));
            // body
            g.add(box(0.28, 0.38, 0.20, palette, 0, 0.78, 0, { roughness: 0.58 }));
            g.add(box(0.18, 0.10, 0.16, 0xffffff, 0, 0.58, 0, { roughness: 0.34 }));
            // arms
            g.add(box(0.08, 0.28, 0.08, palette, -0.20, 0.80, 0, { roughness: 0.58 }));
            g.add(box(0.08, 0.28, 0.08, palette, 0.20, 0.80, 0, { roughness: 0.58 }));
            g.add(box(0.06, 0.14, 0.06, 0xf0c8aa, -0.20, 0.58, 0, { roughness: 0.50 }));
            g.add(box(0.06, 0.14, 0.06, 0xf0c8aa, 0.20, 0.58, 0, { roughness: 0.50 }));
            // skirt/legs/shoes
            g.add(box(0.24, 0.12, 0.18, 0xc77f9d, 0, 0.44, 0, { roughness: 0.60 }));
            g.add(box(0.08, 0.34, 0.08, 0x3a4151, -0.06, 0.20, 0, { roughness: 0.64 }));
            g.add(box(0.08, 0.34, 0.08, 0x3a4151, 0.06, 0.20, 0, { roughness: 0.64 }));
            g.add(box(0.11, 0.05, 0.16, 0x2d3138, -0.06, 0.02, 0.03, { roughness: 0.72 }));
            g.add(box(0.11, 0.05, 0.16, 0x2d3138, 0.06, 0.02, 0.03, { roughness: 0.72 }));
            addAnimated(g, 'float', { baseY: y, amp: 0.010, speed: 0.9 });
            return g;
        }


        function buildStylizedFace(x, y, z, opts = {}) {
            // PREMIUM STYLIZED FACE v6.7
            // Sphere-based anatomik yüz: kaş, kirpik, göz parlaklığı, yanak,
            // çene gölgesi, burun, kulak — buildHuman/Doctor ile uyumlu.
            const g = groupAt(x, y, z);
            const skin = opts.skin || 0xeec7aa;
            const skinShade = opts.skinShade || 0xd4a78a;
            const skinHighlight = opts.skinHighlight || 0xf5d4b8;
            const eye = opts.eye || 0x4d5f86;
            const hairColor = opts.hair || 0x513d33;
            const eyebrow = 0x3b2820;
            
            // Ana baş (sphere - hafif uzun)
            const head = sphere(0.115, skin, 0, 0, 0, { roughness: 0.36 });
            head.scale.set(0.92, 1.05, 1.0);
            g.add(head);
            
            // Saç başlığı (sphere — başın üstünü saran)
            const hairCap = sphere(0.130, hairColor, 0, 0.040, -0.012, { roughness: 0.74 });
            hairCap.scale.set(1.04, 0.78, 1.04);
            g.add(hairCap);
            
            // Yanak yumuşaklığı + pembelik
            g.add(sphere(0.030, skinHighlight, -0.072, -0.020, 0.045, { roughness: 0.40 }));
            g.add(sphere(0.030, skinHighlight, 0.072, -0.020, 0.045, { roughness: 0.40 }));
            g.add(sphere(0.018, 0xf5b8a0, -0.082, -0.030, 0.075, { 
                roughness: 0.46, transparent: true, opacity: 0.55 
            }));
            g.add(sphere(0.018, 0xf5b8a0, 0.082, -0.030, 0.075, { 
                roughness: 0.46, transparent: true, opacity: 0.55 
            }));
            
            // Çene gölgesi
            g.add(sphere(0.026, skinShade, 0, -0.095, 0.060, { roughness: 0.42 }));
            g.add(cyl(0.038, 0.040, 0.020, skinShade, 0, -0.115, 0.020, { 
                seg: 16, roughness: 0.50 
            }));
            
            // Burun (ufak çıkıntı)
            g.add(sphere(0.020, skin, 0, 0.010, 0.108, { roughness: 0.42 }));
            g.add(sphere(0.013, skinHighlight, 0, 0.005, 0.118, { roughness: 0.36 }));
            
            // Kulaklar
            g.add(sphere(0.022, skin, -0.108, 0.005, 0.020, { roughness: 0.42 }));
            g.add(sphere(0.022, skin, 0.108, 0.005, 0.020, { roughness: 0.42 }));
            g.add(sphere(0.012, skinShade, -0.110, 0.002, 0.022, { roughness: 0.50 }));
            g.add(sphere(0.012, skinShade, 0.110, 0.002, 0.022, { roughness: 0.50 }));
            
            // Kaş — belirgin
            g.add(box(0.044, 0.010, 0.012, eyebrow, -0.040, 0.038, 0.108, { roughness: 0.56 }));
            g.add(box(0.044, 0.010, 0.012, eyebrow, 0.040, 0.038, 0.108, { roughness: 0.56 }));
            g.add(box(0.014, 0.012, 0.014, 0x1f1410, -0.020, 0.038, 0.110, { roughness: 0.56 }));
            g.add(box(0.014, 0.012, 0.014, 0x1f1410, 0.020, 0.038, 0.110, { roughness: 0.56 }));
            
            // Göz çukuru
            g.add(sphere(0.022, skinShade, -0.040, 0.018, 0.108, { roughness: 0.46 }));
            g.add(sphere(0.022, skinShade, 0.040, 0.018, 0.108, { roughness: 0.46 }));
            
            // Göz akı
            g.add(sphere(0.014, 0xfafaf2, -0.040, 0.018, 0.115, { roughness: 0.20 }));
            g.add(sphere(0.014, 0xfafaf2, 0.040, 0.018, 0.115, { roughness: 0.20 }));
            
            // Iris + pupil + parlaklık
            g.add(sphere(0.008, eye, -0.040, 0.018, 0.123, { 
                roughness: 0.18, emissive: eye, emissiveIntensity: 0.06 
            }));
            g.add(sphere(0.008, eye, 0.040, 0.018, 0.123, { 
                roughness: 0.18, emissive: eye, emissiveIntensity: 0.06 
            }));
            g.add(sphere(0.0040, 0x0a0a0a, -0.040, 0.018, 0.128, {}));
            g.add(sphere(0.0040, 0x0a0a0a, 0.040, 0.018, 0.128, {}));
            // Catchlight (canlı göz)
            g.add(sphere(0.0024, 0xffffff, -0.038, 0.021, 0.131, { 
                emissive: 0xffffff, emissiveIntensity: 0.40 
            }));
            g.add(sphere(0.0024, 0xffffff, 0.042, 0.021, 0.131, { 
                emissive: 0xffffff, emissiveIntensity: 0.40 
            }));
            
            // Kirpikler
            [-0.012, 0, 0.012].forEach(dx => {
                g.add(box(0.004, 0.005, 0.003, 0x1a0a08, -0.040 + dx, 0.030, 0.116, { 
                    roughness: 0.66 
                }));
                g.add(box(0.004, 0.005, 0.003, 0x1a0a08, 0.040 + dx, 0.030, 0.116, { 
                    roughness: 0.66 
                }));
            });
            
            return g;
        }

        function buildNurseCharacter3D(x, y, z) {
            // PREMIUM SCRUB NURSE v6.1
            // Premium kalite scrub hemşiresi modeli — daha detaylı baş yapısı,
            // boyun anatomisi, omuz hatları, scrub formu detayları, eldivenler,
            // maske, bone, kimlik kartı ve modern OR ayakkabıları.
            const g = groupAt(x, y, z);
            const scrub = 0x1f7f99;       // Klasik medikal scrub turkuazı
            const scrubDeep = 0x186475;   // Gölge tonu
            const skin = 0xeec7aa;
            const skinShade = 0xdaab8e;
            const hair = 0x4a3528;
            
            // === BAŞ — Doktorla birebir aynı manuel yapı ===
            const skinHighlight = 0xfcdcc0;
            const eyebrow = 0x3b2820;
            
            // Boyun
            g.add(cyl(0.052, 0.048, 0.10, skin, 0, 1.20, 0, { seg: 18, roughness: 0.42 }));
            g.add(cyl(0.054, 0.054, 0.020, skinShade, 0, 1.15, 0, { seg: 18, roughness: 0.50 }));
            
            // Baş
            const head = sphere(0.118, skin, 0, 1.34, 0, { roughness: 0.36 });
            head.scale.set(0.92, 1.05, 1.0);
            g.add(head);
            // Yanak highlights
            g.add(sphere(0.030, skinHighlight, -0.075, 1.32, 0.045, { roughness: 0.40 }));
            g.add(sphere(0.030, skinHighlight, 0.075, 1.32, 0.045, { roughness: 0.40 }));
            // Çene gölgesi
            g.add(sphere(0.025, skinShade, 0, 1.245, 0.060, { roughness: 0.42 }));
            // Kulaklar
            g.add(sphere(0.022, skin, -0.108, 1.345, 0.020, { roughness: 0.42 }));
            g.add(sphere(0.022, skin, 0.108, 1.345, 0.020, { roughness: 0.42 }));
            
            // === BONE (cerrahi başlık) — Cerrahla aynı YEŞİL ton ===
            const sBoneColor = 0x3f6d4b;   // Cerrahi yeşil (cerrahla birebir)
            const sBoneShade = 0x2a4a35;   // Koyu yeşil kontur
            // Ana bone
            const bone = sphere(0.135, sBoneColor, 0, 1.40, -0.01, { roughness: 0.62 });
            bone.scale.set(1.04, 0.78, 1.04);
            g.add(bone);
            // Alın bandı
            g.add(box(0.22, 0.014, 0.020, sBoneShade, 0, 1.36, 0.090, { roughness: 0.50 }));
            // Bone arka düğüm
            g.add(sphere(0.020, sBoneShade, 0, 1.40, -0.110, { roughness: 0.52 }));
            // Bone yan kulak çevresi ipleri
            g.add(cyl(0.004, 0.004, 0.06, sBoneShade, -0.10, 1.36, -0.04, { seg: 8 }));
            g.add(cyl(0.004, 0.004, 0.06, sBoneShade, 0.10, 1.36, -0.04, { seg: 8 }));
            
            // === YÜZ — KAŞ + GÖZ (Doktorla birebir aynı) ===
            g.add(box(0.040, 0.010, 0.012, eyebrow, -0.040, 1.388, 0.108, { roughness: 0.56 }));
            g.add(box(0.040, 0.010, 0.012, eyebrow, 0.040, 1.388, 0.108, { roughness: 0.56 }));
            g.add(sphere(0.022, skinShade, -0.040, 1.368, 0.108, { roughness: 0.46 }));
            g.add(sphere(0.022, skinShade, 0.040, 1.368, 0.108, { roughness: 0.46 }));
            g.add(sphere(0.014, 0xfafaf2, -0.040, 1.368, 0.116, { roughness: 0.30 }));
            g.add(sphere(0.014, 0xfafaf2, 0.040, 1.368, 0.116, { roughness: 0.30 }));
            g.add(sphere(0.008, 0x4c587f, -0.040, 1.368, 0.124, { roughness: 0.22 }));
            g.add(sphere(0.008, 0x4c587f, 0.040, 1.368, 0.124, { roughness: 0.22 }));
            g.add(sphere(0.004, 0x0a0a0a, -0.040, 1.368, 0.129, {}));
            g.add(sphere(0.004, 0x0a0a0a, 0.040, 1.368, 0.129, {}));
            
            // === CERRAHI MASKE — Cerrahla birebir aynı (beyaz, premium) ===
            const maskColor = 0xeff5f8;    // Beyaz cerrahi maske (cerrahla aynı)
            const maskShade = 0xb7c6cd;    // Açık gri kontur (cerrahla aynı)
            
            // Ana maske gövdesi (cerrahla birebir geometri)
            const mask = box(0.16, 0.13, 0.024, maskColor, 0, 1.300, 0.108, { roughness: 0.46 });
            g.add(mask);
            // Yan yumuşaklık
            g.add(sphere(0.040, maskColor, -0.078, 1.300, 0.082, { roughness: 0.46 }));
            g.add(sphere(0.040, maskColor, 0.078, 1.300, 0.082, { roughness: 0.46 }));
            // 3 yatay kıvrım çizgisi
            g.add(box(0.16, 0.005, 0.026, maskShade, 0, 1.328, 0.110, { roughness: 0.56 }));
            g.add(box(0.16, 0.005, 0.026, maskShade, 0, 1.302, 0.110, { roughness: 0.56 }));
            g.add(box(0.16, 0.005, 0.026, maskShade, 0, 1.276, 0.110, { roughness: 0.56 }));
            // Burun teli (metalik)
            g.add(box(0.062, 0.006, 0.018, 0x9ba9b5, 0, 1.346, 0.118, { 
                metalness: 0.40, roughness: 0.28 
            }));
            
            // Maske kulak ipleri (kavisli — cerrahla aynı)
            const lEarLoop = new THREE.Mesh(
                new THREE.TorusGeometry(0.045, 0.003, 6, 14, Math.PI * 0.85),
                mat(maskShade, { roughness: 0.40 })
            );
            lEarLoop.rotation.y = Math.PI / 2;
            lEarLoop.position.set(-0.10, 1.32, 0.04);
            prepMesh(lEarLoop); g.add(lEarLoop);
            
            const rEarLoop = new THREE.Mesh(
                new THREE.TorusGeometry(0.045, 0.003, 6, 14, Math.PI * 0.85),
                mat(maskShade, { roughness: 0.40 })
            );
            rEarLoop.rotation.y = -Math.PI / 2;
            rEarLoop.position.set(0.10, 1.32, 0.04);
            prepMesh(rEarLoop); g.add(rEarLoop);
            
            // === ÜST BEDEN: TURKUAZ SCRUB FORMU (alt katman) ===
            g.add(box(0.40, 0.12, 0.26, scrub, 0, 1.10, 0, { roughness: 0.58 }));
            g.add(box(0.36, 0.36, 0.24, scrub, 0, 0.92, 0, { roughness: 0.58 }));
            g.add(box(0.10, 0.18, 0.08, scrubDeep, -0.18, 1.04, -0.06, { roughness: 0.62 }));
            g.add(box(0.10, 0.18, 0.08, scrubDeep, 0.18, 1.04, -0.06, { roughness: 0.62 }));
            
            // === YEŞİL STERİL CERRAHİ ÖNLÜK (üst katman — scrub gown) ===
            // Modern OR scrub hemşiresi de cerrah gibi steril yeşil önlük giyer
            const gownGreen = 0x5a8f68;        // Cerrahi yeşil (cerrahla aynı)
            const gownGreenDeep = 0x3f6d4b;
            const gownGreenEdge = 0x2a4a35;
            
            // Önlük üst gövdesi (scrubun üzerinde)
            g.add(box(0.42, 0.36, 0.27, gownGreen, 0, 0.92, 0.005, { roughness: 0.60 }));
            // Önlük omuz (yuvarlak sphere)
            const lShoulderG = sphere(0.094, gownGreen, -0.20, 1.06, 0.005, { roughness: 0.60 });
            lShoulderG.scale.set(1.0, 0.85, 1.05);
            g.add(lShoulderG);
            const rShoulderG = sphere(0.094, gownGreen, 0.20, 1.06, 0.005, { roughness: 0.60 });
            rShoulderG.scale.set(1.0, 0.85, 1.05);
            g.add(rShoulderG);
            
            // Önlük orta dikey kıvrım (kıvrım çizgisi)
            g.add(box(0.012, 0.30, 0.008, gownGreenDeep, 0, 0.92, 0.140, { roughness: 0.66 }));
            // Yan kıvrım çizgileri
            g.add(box(0.008, 0.26, 0.008, gownGreenDeep, -0.16, 0.92, 0.135, { roughness: 0.66 }));
            g.add(box(0.008, 0.26, 0.008, gownGreenDeep, 0.16, 0.92, 0.135, { roughness: 0.66 }));
            // Önlük etek (bel altında)
            g.add(box(0.40, 0.18, 0.27, gownGreen, 0, 0.62, 0.005, { roughness: 0.60 }));
            // Etek alt kenar dikiş
            g.add(box(0.42, 0.014, 0.28, gownGreenEdge, 0, 0.53, 0.005, { roughness: 0.66 }));
            // Bel kemer çizgisi
            g.add(box(0.42, 0.014, 0.28, gownGreenDeep, 0, 0.71, 0.005, { roughness: 0.66 }));
            // Yaka çevresi (omuzları yumuşatan, koyu)
            g.add(box(0.32, 0.06, 0.24, gownGreenDeep, 0, 1.13, 0.005, { roughness: 0.62 }));
            // Yaka dikiş kenarı
            g.add(box(0.34, 0.012, 0.25, gownGreenEdge, 0, 1.10, 0.005, { roughness: 0.66 }));
            
            // Steril PVC koruma katmanı (saydam mavi - kanama önleme)
            g.add(box(0.40, 0.32, 0.014, 0x6f9fd8, 0, 0.84, 0.150, { 
                transparent: true, opacity: 0.22, roughness: 0.32 
            }));
            
            // === V-YAKA (önlük altında scrub gömlek görünür kısım) ===
            g.add(box(0.10, 0.10, 0.020, scrub, 0, 1.06, 0.130, { roughness: 0.36 }));
            g.add(box(0.014, 0.10, 0.012, gownGreenDeep, -0.05, 1.04, 0.140, { roughness: 0.60 }));
            g.add(box(0.014, 0.10, 0.012, gownGreenDeep, 0.05, 1.04, 0.140, { roughness: 0.60 }));
            
            // === SCRUB ÖNLÜK CEPLERİ (önlük üzerinde — yeşil tonda) ===
            // (Eski mavi cepler kaldırıldı, yeşil ile değiştirildi)
            
            // === KİMLİK KARTI (göğüs üstü, cordon ile asılı) ===
            // Cordon (boyun ipi)
            g.add(cyl(0.004, 0.004, 0.20, 0x2a3540, 0.10, 1.10, 0.10, { seg: 8 }));
            // Kimlik kartı (beyaz, küçük dikdörtgen)
            g.add(box(0.06, 0.085, 0.008, 0xf5f8fa, 0.10, 0.98, 0.13, { roughness: 0.42 }));
            // Kart üzerinde mavi şerit (kurumsal renk)
            g.add(box(0.06, 0.018, 0.010, 0x4a6584, 0.10, 1.01, 0.135, { 
                emissive: 0x4a6584, emissiveIntensity: 0.18 
            }));
            // Kart üzerinde küçük foto temsili
            g.add(box(0.025, 0.030, 0.012, skin, 0.10, 0.99, 0.137, { roughness: 0.42 }));
            
            // === SOL KOL — Yeşil cerrahi önlük + krem steril eldiven (cerrahla aynı) ===
            const sGown = gownGreen;
            const sGownDeep = gownGreenDeep;
            const sGloveColor = 0xf0deb4;  // Krem steril eldiven (cerrahla aynı)
            const lArmX = -0.235;
            // Üst kol (yeşil önlük kolu)
            g.add(box(0.092, 0.30, 0.092, sGown, lArmX, 0.92, 0, { roughness: 0.60 }));
            // Dirsek (koyu yeşil)
            g.add(sphere(0.054, sGownDeep, lArmX, 0.76, 0, { roughness: 0.58 }));
            // Önkol (yeşil önlük)
            g.add(box(0.084, 0.24, 0.084, sGown, lArmX, 0.62, 0, { roughness: 0.60 }));
            // Steril manşet (koyu yeşil bant)
            g.add(cyl(0.050, 0.050, 0.05, sGownDeep, lArmX, 0.49, 0, { seg: 16, roughness: 0.58 }));
            // Sol eldiven (krem steril)
            g.add(box(0.078, 0.090, 0.078, sGloveColor, lArmX, 0.42, 0, { 
                roughness: 0.34, transparent: true, opacity: 0.92 
            }));
            // Parmaklar
            [-0.024, -0.008, 0.008, 0.024].forEach(dx => {
                g.add(cyl(0.0085, 0.0075, 0.06, sGloveColor, lArmX + dx, 0.34, 0.005, { 
                    seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
                }));
            });
            // Başparmak
            g.add(cyl(0.010, 0.009, 0.045, sGloveColor, lArmX - 0.040, 0.39, 0.012, { 
                seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
            }));
            
            // === SAĞ KOL — Mayo masasına uzanmış (cerrahla aynı duruş, yeşil önlük + krem eldiven) ===
            const rArmX = 0.235;
            g.add(box(0.092, 0.30, 0.092, sGown, rArmX, 0.92, 0.02, { roughness: 0.60 }));
            g.add(sphere(0.056, sGownDeep, rArmX, 0.76, 0.06, { roughness: 0.58 }));
            g.add(box(0.084, 0.24, 0.084, sGown, rArmX, 0.62, 0.10, { roughness: 0.60 }));
            // Steril manşet
            g.add(cyl(0.052, 0.052, 0.05, sGownDeep, rArmX, 0.49, 0.14, { seg: 16, roughness: 0.58 }));
            // Sağ eldiven
            g.add(box(0.082, 0.090, 0.080, sGloveColor, rArmX, 0.42, 0.16, { 
                roughness: 0.34, transparent: true, opacity: 0.92 
            }));
            // Parmaklar
            [-0.024, -0.008, 0.008, 0.024].forEach(dx => {
                g.add(cyl(0.0085, 0.0075, 0.06, sGloveColor, rArmX + dx, 0.34, 0.18, { 
                    seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
                }));
            });
            g.add(cyl(0.010, 0.009, 0.045, sGloveColor, rArmX + 0.040, 0.39, 0.18, { 
                seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
            }));
            
            // === ALT BEDEN (scrub pantolon) ===
            // Sol bacak
            g.add(box(0.11, 0.50, 0.11, scrub, -0.08, 0.36, 0, { roughness: 0.62 }));
            g.add(box(0.105, 0.18, 0.105, scrubDeep, -0.08, 0.18, 0, { roughness: 0.64 }));
            // Sağ bacak
            g.add(box(0.11, 0.50, 0.11, scrub, 0.08, 0.36, 0, { roughness: 0.62 }));
            g.add(box(0.105, 0.18, 0.105, scrubDeep, 0.08, 0.18, 0, { roughness: 0.64 }));
            
            // === MODERN OR AYAKKABILARI (Crocs tarzı medikal ayakkabı) ===
            // Sol
            g.add(box(0.14, 0.06, 0.20, 0xf5f6f7, -0.08, 0.04, 0.04, { roughness: 0.55 }));
            // Sol topuk yastığı
            g.add(box(0.14, 0.014, 0.06, 0x4cd6c4, -0.08, 0.078, 0.04, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.10 
            }));
            // Sağ
            g.add(box(0.14, 0.06, 0.20, 0xf5f6f7, 0.08, 0.04, 0.04, { roughness: 0.55 }));
            g.add(box(0.14, 0.014, 0.06, 0x4cd6c4, 0.08, 0.078, 0.04, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.10 
            }));
            
            addAnimated(g, 'float', { baseY: y, amp: 0.010, speed: 0.80 });
            return g;
        }

        function buildDoctorCharacter3D(x, y, z, palette = 0x5a8f68) {
            // PREMIUM SURGEON v6.7 — CLEAN REBUILD
            // Tüm parçalar mantıklı x/y/z konumlarda hizalı.
            // Sol kol: vücudun yanında düz aşağı sarkık (rest position).
            // Sağ kol: hafif ileri uzanmış (operatif duruş) — sadece konum ofseti, rotation YOK.
            // Premium: anatomik proporsiyonlar, tam yüz, cerrahi maske, bone, loupe gözlük,
            // steril önlük + manşet + steril eldiven, modern OR ayakkabı.
            const g = groupAt(x, y, z);
            
            // === RENK PALETİ ===
            const gown = palette;
            const gownDeep = 0x3f6d4b;
            const gownEdge = 0x2a4a35;
            const skin = 0xecc5a6;
            const skinShade = 0xd4a78a;
            const skinHighlight = 0xf2d4b8;
            const eyebrow = 0x3b2820;
            const boneColor = 0x3f6d4b;
            const boneDeep = 0x2a4a35;
            const maskColor = 0xeff5f8;
            const maskShade = 0xb7c6cd;
            const gloveColor = 0xf0deb4;
            const scrubInner = 0x1f7f99;
            const scrubPant = 0x1f7f99;
            const scrubPantDeep = 0x186475;
            
            // === BACAKLAR + AYAKKABILAR ===
            g.add(box(0.105, 0.50, 0.105, scrubPant, -0.080, 0.34, 0, { roughness: 0.62 }));
            g.add(sphere(0.058, scrubPantDeep, -0.080, 0.20, 0, { roughness: 0.64 }));
            g.add(box(0.098, 0.20, 0.098, scrubPant, -0.080, 0.12, 0, { roughness: 0.62 }));
            g.add(box(0.105, 0.50, 0.105, scrubPant, 0.080, 0.34, 0, { roughness: 0.62 }));
            g.add(sphere(0.058, scrubPantDeep, 0.080, 0.20, 0, { roughness: 0.64 }));
            g.add(box(0.098, 0.20, 0.098, scrubPant, 0.080, 0.12, 0, { roughness: 0.62 }));
            
            g.add(box(0.13, 0.06, 0.20, 0xeff5f8, -0.080, 0.040, 0.04, { roughness: 0.55 }));
            g.add(box(0.13, 0.014, 0.06, 0x4cd6c4, -0.080, 0.075, 0.04, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.10 
            }));
            g.add(box(0.090, 0.020, 0.060, 0xb7c6cd, -0.080, 0.060, 0.10, { roughness: 0.45 }));
            g.add(box(0.13, 0.06, 0.20, 0xeff5f8, 0.080, 0.040, 0.04, { roughness: 0.55 }));
            g.add(box(0.13, 0.014, 0.06, 0x4cd6c4, 0.080, 0.075, 0.04, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.10 
            }));
            g.add(box(0.090, 0.020, 0.060, 0xb7c6cd, 0.080, 0.060, 0.10, { roughness: 0.45 }));
            
            // === GÖVDE ===
            g.add(box(0.36, 0.18, 0.26, gown, 0, 0.62, 0, { roughness: 0.60 }));
            g.add(box(0.38, 0.014, 0.27, gownEdge, 0, 0.53, 0, { roughness: 0.66 }));
            g.add(box(0.32, 0.10, 0.22, gown, 0, 0.74, 0, { roughness: 0.62 }));
            g.add(box(0.34, 0.014, 0.23, gownDeep, 0, 0.70, 0, { roughness: 0.66 }));
            g.add(box(0.38, 0.32, 0.24, gown, 0, 0.94, 0, { roughness: 0.60 }));
            g.add(box(0.012, 0.28, 0.008, gownDeep, 0, 0.92, 0.124, { roughness: 0.66 }));
            g.add(box(0.008, 0.24, 0.008, gownDeep, -0.16, 0.92, 0.118, { roughness: 0.66 }));
            g.add(box(0.008, 0.24, 0.008, gownDeep, 0.16, 0.92, 0.118, { roughness: 0.66 }));
            
            // Steril PVC koruma katmanı (saydam mavi)
            g.add(box(0.36, 0.30, 0.014, 0x6f9fd8, 0, 0.84, 0.130, { 
                transparent: true, opacity: 0.22, roughness: 0.32 
            }));
            
            // === YAKA ===
            g.add(box(0.30, 0.06, 0.22, gownDeep, 0, 1.13, 0, { roughness: 0.62 }));
            g.add(box(0.32, 0.012, 0.23, gownEdge, 0, 1.10, 0, { roughness: 0.66 }));
            g.add(box(0.10, 0.10, 0.020, scrubInner, 0, 1.08, 0.115, { roughness: 0.36 }));
            g.add(box(0.014, 0.10, 0.012, gownDeep, -0.05, 1.06, 0.122, { roughness: 0.60 }));
            g.add(box(0.014, 0.10, 0.012, gownDeep, 0.05, 1.06, 0.122, { roughness: 0.60 }));
            
            // === OMUZLAR ===
            const lShoulder = sphere(0.092, gown, -0.20, 1.06, 0, { roughness: 0.60 });
            lShoulder.scale.set(1.0, 0.85, 1.05);
            g.add(lShoulder);
            const rShoulder = sphere(0.092, gown, 0.20, 1.06, 0, { roughness: 0.60 });
            rShoulder.scale.set(1.0, 0.85, 1.05);
            g.add(rShoulder);
            
            // === SOL KOL — DÜZ AŞAĞI SARKIK (rotation YOK, hepsi aynı x ekseninde) ===
            const lArmX = -0.235;
            g.add(box(0.092, 0.30, 0.092, gown, lArmX, 0.92, 0, { roughness: 0.60 }));
            g.add(sphere(0.054, gownDeep, lArmX, 0.76, 0, { roughness: 0.58 }));
            g.add(box(0.084, 0.24, 0.084, gown, lArmX, 0.62, 0, { roughness: 0.60 }));
            g.add(cyl(0.050, 0.050, 0.05, gownDeep, lArmX, 0.49, 0, { 
                seg: 16, roughness: 0.58 
            }));
            g.add(box(0.078, 0.090, 0.078, gloveColor, lArmX, 0.42, 0, { 
                roughness: 0.34, transparent: true, opacity: 0.92 
            }));
            [-0.024, -0.008, 0.008, 0.024].forEach(dx => {
                g.add(cyl(0.0085, 0.0075, 0.06, gloveColor, lArmX + dx, 0.34, 0.005, { 
                    seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
                }));
            });
            g.add(cyl(0.010, 0.009, 0.045, gloveColor, lArmX - 0.040, 0.39, 0.012, { 
                seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
            }));
            
            // === SAĞ KOL — Operatif duruş (rotation YOK, sadece z ofseti ile öne) ===
            const rArmX = 0.235;
            g.add(box(0.092, 0.30, 0.092, gown, rArmX, 0.92, 0.02, { roughness: 0.60 }));
            g.add(sphere(0.056, gownDeep, rArmX, 0.76, 0.06, { roughness: 0.58 }));
            g.add(box(0.084, 0.24, 0.084, gown, rArmX, 0.62, 0.10, { roughness: 0.60 }));
            g.add(cyl(0.052, 0.052, 0.05, gownDeep, rArmX, 0.49, 0.14, { 
                seg: 16, roughness: 0.58 
            }));
            g.add(box(0.082, 0.090, 0.080, gloveColor, rArmX, 0.42, 0.16, { 
                roughness: 0.34, transparent: true, opacity: 0.92 
            }));
            [-0.024, -0.008, 0.008, 0.024].forEach(dx => {
                g.add(cyl(0.0085, 0.0075, 0.06, gloveColor, rArmX + dx, 0.34, 0.18, { 
                    seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
                }));
            });
            g.add(cyl(0.010, 0.009, 0.045, gloveColor, rArmX + 0.040, 0.39, 0.18, { 
                seg: 10, transparent: true, opacity: 0.92, roughness: 0.34 
            }));
            
            // === BOYUN ===
            g.add(cyl(0.052, 0.048, 0.10, skin, 0, 1.20, 0, { 
                seg: 18, roughness: 0.42 
            }));
            g.add(cyl(0.054, 0.054, 0.020, skinShade, 0, 1.15, 0, { 
                seg: 18, roughness: 0.50 
            }));
            
            // === BAŞ ===
            const head = sphere(0.118, skin, 0, 1.34, 0, { roughness: 0.36 });
            head.scale.set(0.92, 1.05, 1.0);
            g.add(head);
            g.add(sphere(0.030, skinHighlight, -0.075, 1.32, 0.045, { roughness: 0.40 }));
            g.add(sphere(0.030, skinHighlight, 0.075, 1.32, 0.045, { roughness: 0.40 }));
            g.add(sphere(0.025, skinShade, 0, 1.245, 0.060, { roughness: 0.42 }));
            g.add(sphere(0.022, skin, -0.108, 1.345, 0.020, { roughness: 0.42 }));
            g.add(sphere(0.022, skin, 0.108, 1.345, 0.020, { roughness: 0.42 }));
            
            // === BONE (cerrahi başlık) ===
            const bone = sphere(0.135, boneColor, 0, 1.40, -0.01, { roughness: 0.62 });
            bone.scale.set(1.04, 0.78, 1.04);
            g.add(bone);
            g.add(box(0.22, 0.014, 0.020, boneDeep, 0, 1.36, 0.090, { roughness: 0.50 }));
            g.add(sphere(0.020, boneDeep, 0, 1.40, -0.110, { roughness: 0.52 }));
            g.add(cyl(0.004, 0.004, 0.06, boneDeep, -0.10, 1.36, -0.04, { seg: 8 }));
            g.add(cyl(0.004, 0.004, 0.06, boneDeep, 0.10, 1.36, -0.04, { seg: 8 }));
            
            // === YÜZ — KAŞ + GÖZ ===
            g.add(box(0.040, 0.010, 0.012, eyebrow, -0.040, 1.388, 0.108, { roughness: 0.56 }));
            g.add(box(0.040, 0.010, 0.012, eyebrow, 0.040, 1.388, 0.108, { roughness: 0.56 }));
            g.add(sphere(0.022, skinShade, -0.040, 1.368, 0.108, { roughness: 0.46 }));
            g.add(sphere(0.022, skinShade, 0.040, 1.368, 0.108, { roughness: 0.46 }));
            g.add(sphere(0.014, 0xfafaf2, -0.040, 1.368, 0.116, { roughness: 0.30 }));
            g.add(sphere(0.014, 0xfafaf2, 0.040, 1.368, 0.116, { roughness: 0.30 }));
            g.add(sphere(0.008, 0x44557a, -0.040, 1.368, 0.124, { roughness: 0.22 }));
            g.add(sphere(0.008, 0x44557a, 0.040, 1.368, 0.124, { roughness: 0.22 }));
            g.add(sphere(0.004, 0x0a0a0a, -0.040, 1.368, 0.129, {}));
            g.add(sphere(0.004, 0x0a0a0a, 0.040, 1.368, 0.129, {}));
            
            // === CERRAHI MASKE — BURUN VE AĞZI KAPSIYOR ===
            const mask = box(0.16, 0.13, 0.024, maskColor, 0, 1.300, 0.108, { 
                roughness: 0.46 
            });
            g.add(mask);
            g.add(sphere(0.040, maskColor, -0.078, 1.300, 0.082, { roughness: 0.46 }));
            g.add(sphere(0.040, maskColor, 0.078, 1.300, 0.082, { roughness: 0.46 }));
            g.add(box(0.16, 0.005, 0.026, maskShade, 0, 1.328, 0.110, { roughness: 0.56 }));
            g.add(box(0.16, 0.005, 0.026, maskShade, 0, 1.302, 0.110, { roughness: 0.56 }));
            g.add(box(0.16, 0.005, 0.026, maskShade, 0, 1.276, 0.110, { roughness: 0.56 }));
            g.add(box(0.062, 0.006, 0.018, 0x9ba9b5, 0, 1.346, 0.118, { 
                metalness: 0.40, roughness: 0.28 
            }));
            
            // Maske kulak ipleri (kavisli)
            const lEarLoop = new THREE.Mesh(
                new THREE.TorusGeometry(0.045, 0.003, 6, 14, Math.PI * 0.85),
                mat(maskShade, { roughness: 0.40 })
            );
            lEarLoop.rotation.y = Math.PI / 2;
            lEarLoop.position.set(-0.10, 1.32, 0.04);
            prepMesh(lEarLoop);
            g.add(lEarLoop);
            
            const rEarLoop = new THREE.Mesh(
                new THREE.TorusGeometry(0.045, 0.003, 6, 14, Math.PI * 0.85),
                mat(maskShade, { roughness: 0.40 })
            );
            rEarLoop.rotation.y = -Math.PI / 2;
            rEarLoop.position.set(0.10, 1.32, 0.04);
            prepMesh(rEarLoop);
            g.add(rEarLoop);
            
            // === LOUPE GÖZLÜK ===
            g.add(box(0.13, 0.012, 0.010, 0x1a2230, 0, 1.388, 0.120, { 
                roughness: 0.30, metalness: 0.30 
            }));
            g.add(box(0.020, 0.008, 0.008, 0x1a2230, 0, 1.388, 0.124, { roughness: 0.30 }));
            
            const lLens = new THREE.Mesh(
                new THREE.TorusGeometry(0.020, 0.003, 6, 18),
                mat(0x1a2230, { metalness: 0.30, roughness: 0.30 })
            );
            lLens.position.set(-0.040, 1.388, 0.124);
            prepMesh(lLens); g.add(lLens);
            
            const rLens = new THREE.Mesh(
                new THREE.TorusGeometry(0.020, 0.003, 6, 18),
                mat(0x1a2230, { metalness: 0.30, roughness: 0.30 })
            );
            rLens.position.set(0.040, 1.388, 0.124);
            prepMesh(rLens); g.add(rLens);
            
            g.add(cyl(0.018, 0.018, 0.004, 0x88c4d0, -0.040, 1.388, 0.126, { 
                seg: 14, transparent: true, opacity: 0.35, metalness: 0.30 
            }));
            g.add(cyl(0.018, 0.018, 0.004, 0x88c4d0, 0.040, 1.388, 0.126, { 
                seg: 14, transparent: true, opacity: 0.35, metalness: 0.30 
            }));
            g.add(cyl(0.010, 0.010, 0.014, 0x2a3540, -0.040, 1.388, 0.132, { 
                seg: 12, metalness: 0.40, roughness: 0.20 
            }));
            g.add(cyl(0.010, 0.010, 0.014, 0x2a3540, 0.040, 1.388, 0.132, { 
                seg: 12, metalness: 0.40, roughness: 0.20 
            }));
            g.add(box(0.005, 0.008, 0.10, 0x1a2230, -0.064, 1.388, 0.07, { roughness: 0.30 }));
            g.add(box(0.005, 0.008, 0.10, 0x1a2230, 0.064, 1.388, 0.07, { roughness: 0.30 }));
            
            addAnimated(g, 'float', { baseY: y, amp: 0.008, speed: 0.65 });
            return g;
        }

        function buildStandingPatient3D(x, y, z) {
            const g = groupAt(x, y, z);
            const skin = 0xf0c8ac;
            g.add(buildStylizedFace(0, 1.30, 0, { skin, eye: 0x524f7f, hair: 0x3f312d }));
            // hair sides
            g.add(box(0.10, 0.28, 0.10, 0x3f312d, -0.10, 1.26, -0.01, { roughness: 0.70 }));
            g.add(box(0.10, 0.28, 0.10, 0x3f312d, 0.10, 1.26, -0.01, { roughness: 0.70 }));
            // gown body
            const gown = box(0.34, 0.46, 0.22, 0xe7ebf6, 0, 0.92, 0, { roughness: 0.48 });
            g.add(gown);
            const skirt = box(0.42, 0.48, 0.24, 0xe7ebf6, 0, 0.58, 0, { roughness: 0.50 });
            g.add(skirt);
            for (let i=-1;i<=1;i++) g.add(box(0.012,0.012,0.012,0xc6d1ec,i*0.08,0.88,0.12,{roughness:0.2}));
            // hands clasped in front
            g.add(box(0.08, 0.25, 0.08, skin, -0.10, 0.82, 0, { roughness: 0.46 }));
            g.add(box(0.08, 0.25, 0.08, skin, 0.10, 0.82, 0, { roughness: 0.46 }));
            const handL = box(0.06, 0.10, 0.06, skin, -0.03, 0.66, 0.10, { roughness: 0.42 });
            const handR = box(0.06, 0.10, 0.06, skin, 0.03, 0.66, 0.10, { roughness: 0.42 });
            g.add(handL); g.add(handR);
            // lower legs and slippers
            g.add(box(0.07, 0.24, 0.07, skin, -0.05, 0.20, 0, { roughness: 0.46 }));
            g.add(box(0.07, 0.24, 0.07, skin, 0.05, 0.20, 0, { roughness: 0.46 }));
            g.add(box(0.12, 0.04, 0.18, 0xdce3ef, -0.05, 0.03, 0.03, { roughness: 0.52 }));
            g.add(box(0.12, 0.04, 0.18, 0xdce3ef, 0.05, 0.03, 0.03, { roughness: 0.52 }));
            addAnimated(g, 'float', { baseY: y, amp: 0.008, speed: 0.92 });
            return g;
        }

        function buildRelativeCharacter3D(x, y, z) {
            const g = groupAt(x, y, z);
            const skin = 0xefc8ac;
            g.add(buildStylizedFace(0, 1.34, 0, { skin, eye: 0x4a4f74, hair: 0x352b29 }));
            // tousled hair volume
            g.add(box(0.14, 0.10, 0.12, 0x352b29, 0.09, 1.48, 0.0, { roughness: 0.74 }));
            // sweatshirt
            g.add(box(0.38, 0.44, 0.24, 0xd8cabd, 0, 0.94, 0, { roughness: 0.66 }));
            g.add(box(0.12, 0.34, 0.10, 0xd8cabd, -0.25, 0.94, 0, { roughness: 0.66 }));
            g.add(box(0.12, 0.34, 0.10, 0xd8cabd, 0.25, 0.94, 0, { roughness: 0.66 }));
            g.add(box(0.07, 0.18, 0.07, skin, -0.25, 0.70, 0, { roughness: 0.46 }));
            g.add(box(0.07, 0.18, 0.07, skin, 0.25, 0.70, 0, { roughness: 0.46 }));
            // pants and shoes
            g.add(box(0.10, 0.52, 0.10, 0x3c4251, -0.07, 0.34, 0, { roughness: 0.62 }));
            g.add(box(0.10, 0.52, 0.10, 0x3c4251, 0.07, 0.34, 0, { roughness: 0.62 }));
            g.add(box(0.14, 0.05, 0.18, 0xf3f2ef, -0.07, 0.05, 0.03, { roughness: 0.64 }));
            g.add(box(0.14, 0.05, 0.18, 0xf3f2ef, 0.07, 0.05, 0.03, { roughness: 0.64 }));
            addAnimated(g, 'float', { baseY: y, amp: 0.009, speed: 0.76 });
            return g;
        }

        function buildSupportiveTrio3D(x, y, z) {
            const g = groupAt(x, y, z);
            const nurse = buildNurseCharacter3D(-0.55, 0, 0);
            const patient = buildStandingPatient3D(0.00, 0, 0.02);
            const relative = buildRelativeCharacter3D(0.58, 0, 0.01);
            relative.rotation.y = -0.18;
            patient.rotation.y = 0.05;
            nurse.rotation.y = 0.20;
            g.add(nurse); g.add(patient); g.add(relative);
            return g;
        }


        function buildHandHygieneStation(x, y, z) {
            // PREMIUM HAND HYGIENE STATION v2 — touchless dispenser + LED
            const g = groupAt(x, y, z);
            // Anodize taban
            g.add(box(0.54, 0.06, 0.40, 0x222a33, 0, 0.03, 0, { metalness: 0.55, roughness: 0.32 }));
            // Üst LED accent
            g.add(box(0.50, 0.005, 0.38, 0x2dd4bf, 0, 0.063, 0, { emissive: 0x2dd4bf, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            // Direk (brushed alu)
            g.add(cyl(0.024, 0.024, 1.10, 0xb6bfc8, 0, 0.58, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));
            // Dispenser kasası (anodize gri)
            g.add(box(0.36, 0.40, 0.18, 0x3a4754, 0, 1.18, 0, { metalness: 0.55, roughness: 0.30 }));
            // Brushed alu ön panel
            g.add(box(0.34, 0.38, 0.005, 0xb6bfc8, 0, 1.18, 0.092, { metalness: 0.70, roughness: 0.22 }));
            // 2 dispenser butonu (turkuaz/yeşil — alkol/sabun)
            g.add(box(0.12, 0.10, 0.024, 0x0a0e14, -0.08, 1.28, 0.105, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.10, 0.08, 0.001, 0x2dd4bf, -0.08, 1.28, 0.118, { emissive: 0x2dd4bf, emissiveIntensity: 0.75 }));
            g.add(box(0.12, 0.10, 0.024, 0x0a0e14, 0.08, 1.28, 0.105, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.10, 0.08, 0.001, 0x4cb88a, 0.08, 1.28, 0.118, { emissive: 0x4cb88a, emissiveIntensity: 0.75 }));
            // Sensor LED'leri (üst — touchless gösterge)
            g.add(cyl(0.005, 0.005, 0.004, 0x4cb88a, -0.08, 1.36, 0.108, { seg: 8, emissive: 0x4cb88a, emissiveIntensity: 0.95 }));
            g.add(cyl(0.005, 0.005, 0.004, 0x4cb88a, 0.08, 1.36, 0.108, { seg: 8, emissive: 0x4cb88a, emissiveIntensity: 0.95 }));
            // Çıkış nozzle alanları (alt)
            g.add(box(0.07, 0.16, 0.020, 0x222a33, -0.08, 1.06, 0.094, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.07, 0.16, 0.020, 0x222a33, 0.08, 1.06, 0.094, { metalness: 0.55, roughness: 0.30 }));
            // Üst marka şeridi (turkuaz LED)
            g.add(box(0.20, 0.012, 0.005, 0x2dd4bf, 0, 1.42, 0.094, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            // Atık çöpü (kırmızı — biyo)
            g.add(box(0.20, 0.10, 0.14, 0xe04646, 0.26, 0.14, 0, { metalness: 0.10, roughness: 0.45, emissive: 0xe04646, emissiveIntensity: 0.20, transparent: true, opacity: 0.85 }));
            g.add(box(0.18, 0.005, 0.12, 0xfafdff, 0.26, 0.196, 0, { emissive: 0xfafdff, emissiveIntensity: 0.55 }));
            return g;
        }

        function buildSupplyCabinet(x, y, z) {
            // ============================================================
            // ULTRA-PREMIUM SUPPLY CABINET v2.0
            // ESU V2 / Anestezi V2 / KPB V2 / Airway V2 ile aynı premium dilde.
            // Cam kapılı modern medikal dolap: 4 raf + LED iç aydınlatma
            // + iç stok görselleri (kutular, ampul tepsileri, sarf malzemeleri)
            // + üst kontrol paneli (sıcaklık gösterimli — narkotik için)
            // ============================================================
            const g = groupAt(x, y, z);
            const anodGray = 0x3a4754;
            const anodDark = 0x222a33;
            const brushAlu = 0xb6bfc8;
            const accentTeal = 0x2dd4bf;
            const accentBlue = 0x4d9ef0;
            const accentRed = 0xe04646;
            const accentYellow = 0xfbbf24;
            const accentGreen = 0x4cb88a;
            const accentPurple = 0x9c5cd9;
            const screenDark = 0x0a0e14;
            const glassClear = 0xc7dbe6;

            // ============================================================
            // ALT TABAN (kompakt — duvara dayalı dolap için ayak)
            // ============================================================
            // 4 alt ayak (krom)
            [-0.40, 0.40].forEach(xx => [-0.20, 0.20].forEach(zz => {
                g.add(cyl(0.022, 0.022, 0.060, brushAlu, xx, 0.030, zz,
                    { seg: 14, metalness: 0.78, roughness: 0.16 }));
                // Alt yastık
                g.add(cyl(0.026, 0.026, 0.008, anodDark, xx, 0.005, zz,
                    { seg: 14, metalness: 0.40, roughness: 0.50 }));
            }));
            // Alt taban (anodize)
            g.add(box(0.92, 0.040, 0.52, anodDark, 0, 0.080, 0,
                { metalness: 0.55, roughness: 0.32 }));
            // Üst LED accent
            g.add(box(0.88, 0.005, 0.50, accentTeal, 0, 0.103, 0,
                { emissive: accentTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // ANA DOLAP GÖVDESİ (anodize alu kasa — yüksek)
            // ============================================================
            // Ana kasa
            g.add(box(0.92, 1.78, 0.50, anodGray, 0, 1.00, 0,
                { metalness: 0.55, roughness: 0.30 }));
            // Yan ventilasyon (sol kenar)
            for (let i = 0; i < 5; i++) {
                g.add(box(0.001, 0.20, 0.005, anodDark, -0.466, 1.20 - i * 0.20, 0,
                    { metalness: 0.30, roughness: 0.50 }));
            }
            // Yan ventilasyon (sağ kenar)
            for (let i = 0; i < 5; i++) {
                g.add(box(0.001, 0.20, 0.005, anodDark, 0.466, 1.20 - i * 0.20, 0,
                    { metalness: 0.30, roughness: 0.50 }));
            }
            // Yan turkuaz LED status şeritleri (her iki yan)
            [-0.465, 0.465].forEach(side => {
                g.add(box(0.001, 1.40, 0.008, accentTeal, side, 1.00, 0.10,
                    { emissive: accentTeal, emissiveIntensity: 0.55,
                      transparent: true, opacity: 0.85 }));
            });

            // ============================================================
            // CAM KAPI (büyük, brushed alu çerçeveli)
            // ============================================================
            // Çerçeve (kalın brushed metal)
            g.add(box(0.86, 1.66, 0.012, brushAlu, 0, 1.00, 0.255,
                { metalness: 0.70, roughness: 0.22 }));
            // Cam (şeffaf — içeriyi gösterir)
            g.add(box(0.78, 1.58, 0.006, glassClear, 0, 1.00, 0.262,
                { metalness: 0.04, roughness: 0.10,
                  emissive: 0x88c9e0, emissiveIntensity: 0.10,
                  transparent: true, opacity: 0.30 }));
            // Cam kenar reflection accent (üst+alt LED)
            g.add(box(0.78, 0.004, 0.001, accentTeal, 0, 1.78, 0.265,
                { emissive: accentTeal, emissiveIntensity: 0.85 }));
            g.add(box(0.78, 0.004, 0.001, accentTeal, 0, 0.22, 0.265,
                { emissive: accentTeal, emissiveIntensity: 0.85 }));
            // Cam kapı kolu (sağ orta — krom dikey çubuk)
            g.add(cyl(0.012, 0.012, 0.30, brushAlu, 0.36, 1.00, 0.270,
                { seg: 14, metalness: 0.78, roughness: 0.14 }));
            g.add(cyl(0.018, 0.018, 0.014, anodGray, 0.36, 1.16, 0.270,
                { seg: 14, metalness: 0.55, roughness: 0.25 }));
            g.add(cyl(0.018, 0.018, 0.014, anodGray, 0.36, 0.84, 0.270,
                { seg: 14, metalness: 0.55, roughness: 0.25 }));

            // ============================================================
            // İÇ RAFLAR (4 cam raf — yatay alu çerçeveli)
            // ============================================================
            const shelfYs = [0.40, 0.78, 1.16, 1.54];
            shelfYs.forEach(yy => {
                // Cam raf
                g.add(box(0.78, 0.012, 0.42, glassClear, 0, yy, 0,
                    { metalness: 0.04, roughness: 0.20,
                      emissive: 0x88c9e0, emissiveIntensity: 0.08,
                      transparent: true, opacity: 0.40 }));
                // Raf alt brushed alu çerçeve
                g.add(box(0.80, 0.008, 0.44, brushAlu, 0, yy - 0.010, 0,
                    { metalness: 0.70, roughness: 0.22 }));
                // Raf altı LED aydınlatma şeridi (turkuaz — modern dolap stili)
                g.add(box(0.74, 0.004, 0.006, accentTeal, 0, yy - 0.018, 0,
                    { emissive: accentTeal, emissiveIntensity: 0.85 }));
            });

            // ============================================================
            // İÇ STOK GÖRSELLERİ (her rafta farklı malzemeler)
            // ============================================================
            // RAF 4 (üst) — IV solüsyon torbaları (3 adet, saydam)
            [-0.24, 0, 0.24].forEach((xx, i) => {
                g.add(box(0.10, 0.18, 0.06, glassClear, xx, 1.66, 0,
                    { metalness: 0.04, roughness: 0.30,
                      emissive: 0x88c9e0, emissiveIntensity: 0.20,
                      transparent: true, opacity: 0.55 }));
                // Etiket (renk kodlu — laktatlı/SF/dekstroz)
                const labelColors = [accentBlue, accentGreen, accentYellow];
                g.add(box(0.06, 0.014, 0.005, labelColors[i], xx, 1.65, 0.032,
                    { emissive: labelColors[i], emissiveIntensity: 0.65 }));
            });

            // RAF 3 — Ampul tepsileri (renk kodlu kutular)
            [-0.30, -0.10, 0.10, 0.30].forEach((xx, i) => {
                const colors = [accentRed, accentYellow, accentGreen, accentBlue];
                g.add(box(0.16, 0.10, 0.32, anodDark, xx, 1.28, 0,
                    { metalness: 0.55, roughness: 0.30 }));
                // Üstte renk kodlu LED şerit
                g.add(box(0.14, 0.008, 0.30, colors[i], xx, 1.335, 0,
                    { emissive: colors[i], emissiveIntensity: 0.75 }));
                // İçinde mini ampuller (görsel — 3 sıra silindir)
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 3; col++) {
                        g.add(cyl(0.010, 0.010, 0.05, glassClear,
                            xx + (col - 1) * 0.030, 1.295,
                            -0.07 + row * 0.07,
                            { seg: 8, metalness: 0.04, roughness: 0.20,
                              emissive: 0x88c9e0, emissiveIntensity: 0.15,
                              transparent: true, opacity: 0.65 }));
                    }
                }
            });

            // RAF 2 — Steril paket / sargılar (beyaz kutular + renk şerit)
            [-0.28, -0.08, 0.12, 0.30].forEach((xx, i) => {
                const colors = [accentTeal, accentBlue, accentGreen, accentTeal];
                g.add(box(0.16, 0.14, 0.36, 0xfafdff, xx, 0.90, 0,
                    { metalness: 0.04, roughness: 0.50 }));
                g.add(box(0.14, 0.010, 0.34, colors[i], xx, 0.97, 0,
                    { emissive: colors[i], emissiveIntensity: 0.65 }));
                // Etiket (siyah çizgi)
                g.add(box(0.06, 0.008, 0.005, anodDark, xx, 0.92, 0.180,
                    { metalness: 0.30 }));
            });

            // RAF 1 (alt) — Eldiven kutuları + kit'ler (renk kodlu)
            [-0.30, -0.10, 0.10, 0.30].forEach((xx, i) => {
                const colors = [accentBlue, accentPurple, accentYellow, accentRed];
                g.add(box(0.18, 0.16, 0.38, colors[i], xx, 0.50, 0,
                    { metalness: 0.10, roughness: 0.45,
                      emissive: colors[i], emissiveIntensity: 0.20,
                      transparent: true, opacity: 0.85 }));
                // Üstte beyaz şerit
                g.add(box(0.16, 0.010, 0.36, 0xfafdff, xx, 0.585, 0,
                    { emissive: 0xfafdff, emissiveIntensity: 0.55 }));
            });

            // ============================================================
            // ÜST KONTROL PANELİ (dolap üstü — sıcaklık + kilit ekran)
            // ============================================================
            // Panel kasası
            g.add(box(0.84, 0.14, 0.20, anodDark, 0, 1.97, 0.10,
                { metalness: 0.55, roughness: 0.30 }));
            // Üst aksent
            g.add(box(0.80, 0.005, 0.18, accentTeal, 0, 2.044, 0.10,
                { emissive: accentTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // === SICAKLIK EKRANI (cam — kontrollü ortam göstergesi) ===
            g.add(box(0.30, 0.10, 0.012, screenDark, -0.20, 1.97, 0.205,
                { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.26, 0.06, 0.001, 0x0d1820, -0.20, 1.97, 0.213,
                { emissive: 0x103040, emissiveIntensity: 0.50 }));
            // "22.0°C" — yeşil LED (normal aralık)
            g.add(box(0.16, 0.034, 0.0015, accentGreen, -0.20, 1.97, 0.215,
                { emissive: accentGreen, emissiveIntensity: 0.95 }));
            // Üst başlık
            g.add(box(0.10, 0.010, 0.0015, accentTeal, -0.20, 2.005, 0.215,
                { emissive: accentTeal, emissiveIntensity: 0.85 }));

            // === KİLİT/ACCESS PANELİ (PIN pad simülasyonu) ===
            g.add(box(0.20, 0.10, 0.012, screenDark, 0.20, 1.97, 0.205,
                { metalness: 0.20, roughness: 0.10 }));
            // 3x4 keypad ızgarası (mini LED'ler)
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 3; col++) {
                    g.add(box(0.014, 0.014, 0.0015, brushAlu,
                        0.16 + col * 0.020, 1.998 - row * 0.020, 0.213,
                        { metalness: 0.65, roughness: 0.22 }));
                }
            }
            // Kilit durumu LED (sağ üst — yeşil = kilitli, sarı = giriş)
            g.add(cyl(0.008, 0.008, 0.005, accentGreen, 0.36, 2.020, 0.213,
                { seg: 12, emissive: accentGreen, emissiveIntensity: 0.95 }));

            // ============================================================
            // ALARM TOWER (üst-orta — 3 katlı LED kule)
            // ============================================================
            g.add(cyl(0.014, 0.014, 0.020, screenDark, 0, 2.06, -0.16,
                { seg: 16, roughness: 0.40 }));
            g.add(cyl(0.022, 0.022, 0.022, accentGreen, 0, 2.085, -0.16,
                { seg: 18, emissive: accentGreen, emissiveIntensity: 0.85 }));
            g.add(cyl(0.022, 0.022, 0.022, accentYellow, 0, 2.110, -0.16,
                { seg: 18, emissive: accentYellow, emissiveIntensity: 0.30 }));
            g.add(cyl(0.022, 0.022, 0.022, accentRed, 0, 2.135, -0.16,
                { seg: 18, emissive: accentRed, emissiveIntensity: 0.20 }));

            // ============================================================
            // ALT BÖLME — ÇEKMECELER (narkotik kilit altında)
            // ============================================================
            // 2 çekmece alt kısımda (ana raflar üstünde, ana kasa içinde değil — kontrol panelinin altında)
            // Aslında dolap zaten 4 raf + cam kapılı; alt minimal değişiklik gereksiz.
            // Ön cam kapı altında modern detay olarak iki yatay LED accent şerit ekleyelim:
            g.add(box(0.78, 0.005, 0.001, accentBlue, 0, 0.20, 0.265,
                { emissive: accentBlue, emissiveIntensity: 0.65 }));
            g.add(box(0.78, 0.005, 0.001, accentBlue, 0, 1.78, 0.265,
                { emissive: accentBlue, emissiveIntensity: 0.65 }));

            return g;
        }

        function buildWasteBins(x, y, z) {
            const g = groupAt(x, y, z);
            const a = cyl(0.16, 0.14, 0.42, 0xf2d54c, -0.22, 0.21, 0, { seg: 20, roughness: 0.42 });
            const b = cyl(0.16, 0.14, 0.42, 0x4cb88a, 0.22, 0.21, 0, { seg: 20, roughness: 0.42 });
            g.add(a); g.add(b);
            g.add(box(0.18, 0.03, 0.18, 0xe9edf0, -0.22, 0.44, 0, { roughness: 0.30 }));
            g.add(box(0.18, 0.03, 0.18, 0xe9edf0, 0.22, 0.44, 0, { roughness: 0.30 }));
            return g;
        }


        // Eski basic buildDoctorCharacter3D kaldırıldı (v6.1) — premium versiyonu yukarıda tanımlanıyor.

        function buildMayoStand(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(cyl(0.022, 0.022, 1.05, 0x93a6b4, 0, 0.52, 0, { seg: 12, metalness: 0.25, roughness: 0.30 }));
            const top = box(0.72, 0.05, 0.42, 0xf0f3f6, 0, 1.05, 0, { roughness: 0.26, metalness: 0.15 });
            g.add(top);
            g.add(box(0.20, 0.03, 0.08, 0x6a8593, -0.16, 1.09, -0.04, { roughness: 0.18 }));
            g.add(box(0.16, 0.025, 0.06, 0x9db7c5, 0.08, 1.09, 0.08, { roughness: 0.18 }));
            g.add(box(0.12, 0.02, 0.04, 0xdfe8ee, 0.22, 1.09, -0.10, { roughness: 0.18 }));
            g.add(box(0.34, 0.04, 0.34, 0x5d6b76, 0, 0.03, 0, { roughness: 0.56 }));
            return g;
        }

        function buildHeartLungMachine(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(box(0.96, 1.48, 0.68, 0x31475a, 0, 0.74, 0, { roughness: 0.40 }));
            g.add(box(0.54, 0.28, 0.04, 0x0f161f, 0, 1.28, 0.36, { roughness: 0.22 }));
            g.add(box(0.46, 0.18, 0.015, 0x4cd6c4, 0, 1.30, 0.39, { emissive: 0x4cd6c4, emissiveIntensity: 0.32 }));
            [-0.23,0.0,0.23].forEach(xx => {
                const p = cyl(0.11, 0.11, 0.12, 0xd9e1e8, xx, 0.90, 0.30, { seg: 20, roughness: 0.30, metalness: 0.12 });
                p.rotation.x = Math.PI/2; g.add(p);
            });
            g.add(box(0.56, 0.12, 0.18, 0x4f6373, 0, 0.48, 0.22, { roughness: 0.34 }));
            g.add(cyl(0.012,0.012,0.60,0xa8d4df,-0.18,1.02,-0.10,{seg:10,transparent:true,opacity:0.60,metalness:0.08}));
            g.add(cyl(0.012,0.012,0.72,0xa8d4df,0.12,0.96,-0.14,{seg:10,transparent:true,opacity:0.60,metalness:0.08}));
            [-0.30,0.30].forEach(xx => [-0.20,0.20].forEach(zz => {
                const wheel = cyl(0.05,0.05,0.03,0x4c5761,xx,0.03,zz,{seg:12,roughness:0.56});
                wheel.rotation.z = Math.PI/2; g.add(wheel);
            }));
            return g;
        }

        function buildPerfusionConsole(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(box(0.70, 1.18, 0.42, 0x405362, 0, 0.59, 0, { roughness: 0.38 }));
            g.add(box(0.42, 0.18, 0.03, 0x0f161f, 0, 1.02, 0.22, { roughness: 0.22 }));
            g.add(box(0.34, 0.10, 0.012, 0x6f9fd8, 0, 1.03, 0.24, { emissive: 0x6f9fd8, emissiveIntensity: 0.25 }));
            [-0.20,0.20].forEach(xx => [-0.14,0.14].forEach(zz => {
                const wheel = cyl(0.04,0.04,0.03,0x4c5761,xx,0.03,zz,{seg:12,roughness:0.56});
                wheel.rotation.z = Math.PI/2; g.add(wheel);
            }));
            return g;
        }


        /* v5.151 — İntraoperatif obje modernizasyon paketi
           Amaç: ekipmanları daha klinik okunabilir, modern ve CABG/hibrit OR bağlamına uygun hale getirmek.
           Bu blok görev mantığını değiştirmez; yalnızca 3D nesne görünümünü ve sahne okunabilirliğini güçlendirir. */
        function buildHybridOpTableV151(x, y, z) {
            // PREMIUM HYBRID OPERATING TABLE v7.7
            // Maquet Magnus / Steris 5085 SRT / Mizuho OSI Trios tarzı modern
            // hibrit ameliyat masası. Premium detaylar:
            //   - Hidrolik kolon (yüksek, dijital ekranlı)
            //   - Karbon fiber masa yüzeyi (siyah parlak)
            //   - 4 segmentli eklemli platform (baş/sırt/oturma/bacak)
            //   - Premium yan rayları + accessory clip pozisyonları
            //   - Aktif ısıtma jel pedi (entegre — düşük profil)
            //   - Hasta üzerinde steril drape (turkuaz mavi cerrahi alan)
            //   - Cerrahi alan vurgusu (sarı)
            //   - Kol tahtaları + sinir koruma pedleri
            //   - Kontrol pendantı (ayrı sarkıtılı dokunmatik panel)
            //   - Kablo yönetim kanalı
            //   - 4 anti-static gizli tekerlek
            const g = groupAt(x, y, z);
            
            // ===========================================================
            // ALT TABAN PLATFORMU (zemine sabit gizli kaide)
            // ===========================================================
            // Ana taban (geniş, sağlam görünüm)
            g.add(box(1.00, 0.10, 0.80, 0x1a2230, 0, 0.05, 0, { 
                metalness: 0.20, roughness: 0.36 
            }));
            // Üst accent şerit (turkuaz)
            g.add(box(0.92, 0.014, 0.80, 0x4cd6c4, 0, 0.107, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.34 
            }));
            
            // ===========================================================
            // HİDROLİK KOLON (premium - dijital ekranlı silindirik gövde)
            // ===========================================================
            // Ana kolon (silindirik premium)
            g.add(cyl(0.22, 0.22, 0.74, 0x2a3540, 0, 0.46, 0, { 
                seg: 32, metalness: 0.32, roughness: 0.20 
            }));
            // İç krom halkalar (3 kademe — premium hidrolik görünüm)
            [0.20, 0.46, 0.72].forEach(yy => {
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(0.225, 0.012, 8, 32),
                    mat(0xc7d3dc, { metalness: 0.65, roughness: 0.18 })
                );
                ring.rotation.x = Math.PI / 2;
                ring.position.set(0, yy, 0);
                prepMesh(ring); g.add(ring);
            });
            
            // Kolon üstünde dijital ekran (pozisyon değerleri)
            g.add(box(0.30, 0.16, 0.020, 0x0e1821, 0, 0.66, 0.225, { 
                roughness: 0.20, emissive: 0x0a1418, emissiveIntensity: 0.10 
            }));
            // Aktif ekran (turkuaz)
            g.add(box(0.26, 0.12, 0.022, 0x2aaec1, 0, 0.66, 0.234, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.45 
            }));
            // 3 değer satırı (yatay bantlar)
            [-0.030, 0, 0.030].forEach((dy, i) => {
                g.add(box(0.18, 0.014, 0.024, [0xfff8d4, 0x4cb88a, 0xe0a558][i], 
                    0, 0.66 + dy, 0.236, { 
                    emissive: [0xfff8d4, 0x4cb88a, 0xe0a558][i], emissiveIntensity: 0.45 
                }));
            });
            
            // Ana güç LED (yeşil aktif gösterge)
            g.add(cyl(0.020, 0.020, 0.014, 0x4cb88a, 0, 0.42, 0.225, { 
                seg: 14, emissive: 0x4cb88a, emissiveIntensity: 0.65 
            }));
            // Acil durma butonu (kırmızı mantar)
            g.add(cyl(0.026, 0.026, 0.018, 0xd96371, 0, 0.32, 0.225, { 
                seg: 16, emissive: 0xd96371, emissiveIntensity: 0.45 
            }));
            
            // ===========================================================
            // ÜST KOLON BAĞLANTISI (kavisli geçiş)
            // ===========================================================
            g.add(cyl(0.32, 0.32, 0.10, 0x2a3540, 0, 0.85, 0, { 
                seg: 32, metalness: 0.32, roughness: 0.22 
            }));
            // Geçiş accent halkası
            const topJointRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.32, 0.014, 10, 32),
                mat(0x4cd6c4, { emissive: 0x4cd6c4, emissiveIntensity: 0.40 })
            );
            topJointRing.rotation.x = Math.PI / 2;
            topJointRing.position.set(0, 0.91, 0);
            prepMesh(topJointRing); g.add(topJointRing);
            
            // ===========================================================
            // ANA MASA YÜZEYİ (4 segmentli karbon fiber tablet)
            // ===========================================================
            // Alt premium çelik tabaka (taşıyıcı)
            g.add(box(2.56, 0.06, 0.92, 0x4a5e72, 0, 0.96, 0, { 
                metalness: 0.45, roughness: 0.22 
            }));
            
            // === BAŞ SEGMENTİ (sol uç - hafif yükseltilmiş) ===
            // Karbon fiber yüzey
            g.add(box(0.62, 0.04, 0.84, 0x0e1821, -0.92, 1.012, 0, { 
                metalness: 0.18, roughness: 0.16 
            }));
            // Üst jel ped
            g.add(box(0.56, 0.022, 0.76, 0x6da9b7, -0.92, 1.043, 0, { 
                roughness: 0.30, transparent: true, opacity: 0.92 
            }));
            
            // === SIRT SEGMENTİ (orta-sol — ana operatif alan) ===
            g.add(box(0.92, 0.04, 0.84, 0x0e1821, -0.16, 1.012, 0, { 
                metalness: 0.18, roughness: 0.16 
            }));
            g.add(box(0.86, 0.022, 0.76, 0x6da9b7, -0.16, 1.043, 0, { 
                roughness: 0.30, transparent: true, opacity: 0.92 
            }));
            
            // === OTURMA SEGMENTİ (orta-sağ) ===
            g.add(box(0.50, 0.04, 0.84, 0x0e1821, 0.55, 1.012, 0, { 
                metalness: 0.18, roughness: 0.16 
            }));
            g.add(box(0.46, 0.022, 0.76, 0x6da9b7, 0.55, 1.043, 0, { 
                roughness: 0.30, transparent: true, opacity: 0.92 
            }));
            
            // === BACAK SEGMENTİ (sağ uç) ===
            g.add(box(0.50, 0.04, 0.84, 0x0e1821, 1.05, 1.012, 0, { 
                metalness: 0.18, roughness: 0.16 
            }));
            g.add(box(0.46, 0.022, 0.76, 0x6da9b7, 1.05, 1.043, 0, { 
                roughness: 0.30, transparent: true, opacity: 0.92 
            }));
            
            // Segment ayrım çizgileri (4 menteşe görünümü)
            [-0.61, 0.30, 0.80].forEach(xx => {
                g.add(box(0.012, 0.04, 0.92, 0x6f8798, xx, 1.012, 0, { 
                    metalness: 0.45, roughness: 0.20 
                }));
                // Menteşe vidaları (yan)
                [-0.40, 0.40].forEach(zz => {
                    g.add(cyl(0.008, 0.008, 0.014, 0x6f8798, xx, 1.020, zz, { 
                        seg: 10, metalness: 0.55 
                    }));
                });
            });
            
            // ===========================================================
            // YAN ACCESSORY RAILLAR (premium - eklenti yuvalarıyla)
            // ===========================================================
            [-0.50, 0.50].forEach(zz => {
                // Ana ray (uzun gri çubuk)
                g.add(box(2.40, 0.046, 0.046, 0xb8c4cf, 0, 1.07, zz, { 
                    metalness: 0.45, roughness: 0.18 
                }));
                // 5 accessory clip noktası (eklenti tutturma yerleri)
                [-1.00, -0.40, 0.00, 0.40, 1.00].forEach(xx => {
                    g.add(cyl(0.020, 0.020, 0.060, 0x4cd6c4, xx, 1.07, zz, { 
                        seg: 12, emissive: 0x4cd6c4, emissiveIntensity: 0.30 
                    }));
                });
                // Ray altı destek noktaları (3 yer)
                [-0.84, 0, 0.84].forEach(xx => {
                    g.add(cyl(0.014, 0.014, 0.080, 0x9fb0bc, xx, 1.022, zz, { 
                        seg: 10, metalness: 0.40, roughness: 0.20 
                    }));
                });
            });
            
            // ===========================================================
            // BAŞ EMNİYET KOLU (sol uç çıkıntı)
            // ===========================================================
            g.add(box(0.05, 0.18, 0.46, 0x6f8798, -1.30, 1.10, 0, { 
                metalness: 0.45, roughness: 0.22 
            }));
            
            // ===========================================================
            // KOL TAHTALARI + sinir koruma pedleri (her iki yan)
            // ===========================================================
            [-0.86, 0.86].forEach(zz => {
                // Kol tahtası gövdesi
                g.add(box(0.86, 0.05, 0.24, 0xdde6ed, -0.24, 1.03, zz, { 
                    metalness: 0.14, roughness: 0.34 
                }));
                // Üst yumuşak sinir koruma pedi (jel — krem)
                g.add(box(0.78, 0.028, 0.18, 0xeac8a0, -0.24, 1.072, zz, { 
                    roughness: 0.48 
                }));
                // Kemer/strap (turkuaz)
                g.add(box(0.20, 0.014, 0.18, 0x4cd6c4, -0.10, 1.092, zz, { 
                    emissive: 0x4cd6c4, emissiveIntensity: 0.20, roughness: 0.30 
                }));
                // Kemer tokası
                g.add(box(0.040, 0.016, 0.030, 0x9ba9b5, -0.04, 1.094, zz, { 
                    metalness: 0.50, roughness: 0.22 
                }));
            });
            
            // ===========================================================
            // HASTA (detaylı buildPatient + cerrahi drape)
            // ===========================================================
            const patient = buildPatient(0, 0.83, 0, { gown: 0x8fb2c5 });
            g.add(patient);
            
            // ===========================================================
            // CERRAHI DRAPE (steril yeşil cerrahi alan)
            // ===========================================================
            // Ana drape (büyük yeşil-mavi steril alan)
            g.add(box(1.62, 0.045, 0.76, 0x6fa3b8, 0.08, 1.18, 0, { 
                transparent: true, opacity: 0.66, roughness: 0.72 
            }));
            // Üst drape katmanı (beyaz-açık mavi)
            g.add(box(0.78, 0.050, 0.48, 0xe8eef5, 0.14, 1.205, 0, { 
                transparent: true, opacity: 0.88, roughness: 0.64 
            }));
            // Cerrahi pencere (sarı vurgu - aktif kesi alanı)
            g.add(box(0.46, 0.052, 0.22, 0xe0a558, 0.14, 1.23, 0, { 
                transparent: true, opacity: 0.20, 
                emissive: 0xe0a558, emissiveIntensity: 0.08 
            }));
            // Drape kenarı (çevreleyen turkuaz LED kontur — steril sınır)
            [-0.40, 0.40].forEach(zz => {
                g.add(box(1.62, 0.018, 0.014, 0x4cd6c4, 0.08, 1.205, zz, { 
                    emissive: 0x4cd6c4, emissiveIntensity: 0.25 
                }));
            });
            
            // ===========================================================
            // KONTROL PENDANTı (sarkıtılı dokunmatik kontrol — ayrı kol)
            // ===========================================================
            // Esnek kol (silindir)
            g.add(cyl(0.012, 0.012, 0.40, 0x6f8798, 1.30, 1.20, 0.34, { 
                seg: 12, metalness: 0.40, roughness: 0.22 
            }));
            // Pendant kasası
            g.add(box(0.16, 0.18, 0.030, 0x1a2230, 1.30, 1.05, 0.42, { 
                roughness: 0.20, metalness: 0.18 
            }));
            // Aktif ekran
            g.add(box(0.13, 0.14, 0.020, 0x2aaec1, 1.30, 1.05, 0.436, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.50 
            }));
            // 4 yön kontrolü (mini LED)
            [[0, 0.045], [0, -0.045], [0.030, 0], [-0.030, 0]].forEach(([dx, dy]) => {
                g.add(box(0.014, 0.014, 0.012, 0x4cd6c4, 1.30 + dx, 1.05 + dy, 0.442, { 
                    emissive: 0x4cd6c4, emissiveIntensity: 0.55 
                }));
            });
            
            // ===========================================================
            // KABLO YÖNETİM HATTI (turkuaz + kırmızı tüpler — masa altından)
            // ===========================================================
            [-0.30, 0.28].forEach((xx, i) => {
                const tube = cyl(0.012, 0.012, 1.10, i ? 0xa8d4df : 0xd96371, xx, 1.06, -0.62, { 
                    seg: 8, transparent: true, opacity: 0.62, roughness: 0.34 
                });
                tube.rotation.z = Math.PI / 2.9;
                g.add(tube);
            });
            // Kablo organizör halkalar (3 yerde)
            [-0.40, 0, 0.40].forEach(xx => {
                const cableRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.030, 0.005, 6, 14),
                    mat(0x9fb0bc, { metalness: 0.40, roughness: 0.24 })
                );
                cableRing.rotation.x = Math.PI / 2;
                cableRing.position.set(xx, 1.04, -0.55);
                prepMesh(cableRing);
                g.add(cableRing);
            });
            
            return g;
        }

        function buildCABGOpTablePatientV1(x, y, z) {
            // ============================================================
            // CABG OP-TABLE + PATIENT INTEGRATED COMPOSITION v1.0
            // ------------------------------------------------------------
            // Tek entegre obje: hibrit ameliyat masası + supin CABG hastası
            // + steril mavi cerrahi drape + sternotomi penceresi + Finochietto
            // retractor + KPB aortik/venöz/kardiopleji kanül hatları + baş ucu
            // ETT/anestezi devresi + minimal monitör kabloları.
            //
            // Tasarım hedefi: kullanıcı sahneye baktığında "genel hasta üzerine
            // mavi örtü atılmış" hissi yerine doğrudan "CABG için hazırlanmış
            // hasta + cerrahi saha" hissi alır. Drape blok değil; kalınlığı,
            // kenar hemi, hafif kıvrımları olan mat medikal tekstil.
            //
            // Eksen referansı (lokal):
            //   - x: -1.30 baş ucu, +1.30 ayak ucu
            //   - y:  0.00 zemin,  ~1.05 masa yüzeyi,  ~1.18 drape üstü
            //   - z: -0.50 sağ yan,  +0.50 sol yan (KPB tarafı)
            // ============================================================
            const g = groupAt(x, y, z);

            // ============================================================
            // [A] HİBRİT AMELİYAT MASASI — taban + kolon + segmentli yüzey
            // (buildHybridOpTableV151 ile aynı dil; kolun üzerinde aynı raylar)
            // ============================================================
            // Taban
            g.add(box(1.00, 0.10, 0.80, 0x1a2230, 0, 0.05, 0, { metalness: 0.20, roughness: 0.36 }));
            g.add(box(0.92, 0.014, 0.80, 0x4cd6c4, 0, 0.107, 0, { emissive: 0x4cd6c4, emissiveIntensity: 0.30 }));

            // Hidrolik kolon
            g.add(cyl(0.22, 0.22, 0.74, 0x2a3540, 0, 0.46, 0, { seg: 32, metalness: 0.32, roughness: 0.20 }));
            [0.20, 0.46, 0.72].forEach(yy => {
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(0.225, 0.012, 8, 32),
                    mat(0xc7d3dc, { metalness: 0.65, roughness: 0.18 })
                );
                ring.rotation.x = Math.PI / 2;
                ring.position.set(0, yy, 0);
                prepMesh(ring); g.add(ring);
            });
            // Kolon dijital ekran
            g.add(box(0.30, 0.16, 0.020, 0x0e1821, 0, 0.66, 0.225, { roughness: 0.20 }));
            g.add(box(0.26, 0.12, 0.022, 0x2aaec1, 0, 0.66, 0.234, { emissive: 0x4cd6c4, emissiveIntensity: 0.40 }));
            // CABG göstergesi — kırmızı "BYPASS" LED
            g.add(box(0.08, 0.022, 0.024, 0xd96371, -0.06, 0.62, 0.236, { emissive: 0xd96371, emissiveIntensity: 0.55 }));
            g.add(box(0.08, 0.022, 0.024, 0xfff8d4, 0.06, 0.62, 0.236, { emissive: 0xfff8d4, emissiveIntensity: 0.40 }));
            g.add(cyl(0.020, 0.020, 0.014, 0x4cb88a, 0, 0.42, 0.225, { seg: 14, emissive: 0x4cb88a, emissiveIntensity: 0.55 }));

            // Üst kolon bağlantısı
            g.add(cyl(0.32, 0.32, 0.10, 0x2a3540, 0, 0.85, 0, { seg: 32, metalness: 0.32, roughness: 0.22 }));

            // Ana taşıyıcı tablet
            g.add(box(2.56, 0.06, 0.92, 0x4a5e72, 0, 0.96, 0, { metalness: 0.45, roughness: 0.22 }));

            // 4 segmentli karbon-fiber yüzey + jel pedler
            const seg = (cx, w) => {
                g.add(box(w, 0.04, 0.84, 0x0e1821, cx, 1.012, 0, { metalness: 0.18, roughness: 0.16 }));
                g.add(box(w - 0.06, 0.022, 0.76, 0x6da9b7, cx, 1.043, 0, { roughness: 0.30, transparent: true, opacity: 0.92 }));
            };
            seg(-0.92, 0.62); // baş
            seg(-0.16, 0.92); // sırt (CABG operatif alan)
            seg(0.55, 0.50);  // oturma
            seg(1.05, 0.50);  // bacak

            // Segment menteşe çizgileri
            [-0.61, 0.30, 0.80].forEach(xx => {
                g.add(box(0.012, 0.04, 0.92, 0x6f8798, xx, 1.012, 0, { metalness: 0.45, roughness: 0.20 }));
            });

            // Yan accessory raylar (her iki yan)
            [-0.50, 0.50].forEach(zz => {
                g.add(box(2.40, 0.046, 0.046, 0xb8c4cf, 0, 1.07, zz, { metalness: 0.45, roughness: 0.18 }));
                [-1.00, -0.40, 0.00, 0.40, 1.00].forEach(xx => {
                    g.add(cyl(0.020, 0.020, 0.060, 0x4cd6c4, xx, 1.07, zz, { seg: 12, emissive: 0x4cd6c4, emissiveIntensity: 0.28 }));
                });
            });

            // Baş emniyet kolu
            g.add(box(0.05, 0.18, 0.46, 0x6f8798, -1.30, 1.10, 0, { metalness: 0.45, roughness: 0.22 }));

            // Kontrol pendantı (sağ ayak ucunda)
            g.add(cyl(0.012, 0.012, 0.40, 0x6f8798, 1.30, 1.20, 0.34, { seg: 12, metalness: 0.40, roughness: 0.22 }));
            g.add(box(0.16, 0.18, 0.030, 0x1a2230, 1.30, 1.05, 0.42, { roughness: 0.20 }));
            g.add(box(0.13, 0.14, 0.020, 0x2aaec1, 1.30, 1.05, 0.436, { emissive: 0x4cd6c4, emissiveIntensity: 0.45 }));

            // Kol tahtaları (her iki yan, hafif abdüksiyonda)
            [-0.86, 0.86].forEach(zz => {
                g.add(box(0.86, 0.05, 0.24, 0xdde6ed, -0.24, 1.03, zz, { metalness: 0.14, roughness: 0.34 }));
                g.add(box(0.78, 0.028, 0.18, 0xeac8a0, -0.24, 1.072, zz, { roughness: 0.48 }));
                // Kemer
                g.add(box(0.20, 0.014, 0.18, 0x4cd6c4, -0.10, 1.092, zz, { emissive: 0x4cd6c4, emissiveIntensity: 0.18, roughness: 0.30 }));
            });

            // ============================================================
            // [B] CABG HASTASI — supin pozisyon, sadece baş + kollar görünür
            // (gövde + bacaklar drape altında kalacak)
            // ============================================================
            // BAŞ — masanın baş ucunda, hafif geri kaykılı (anestezi access)
            // Ten rengi
            const skin = 0xe7c2a0;
            const skinShadow = 0xc69a78;
            const headY = 1.10;
            // Saç kepi (mavi cerrahi bone)
            g.add(cyl(0.115, 0.110, 0.165, 0x4a7eb8, -1.04, headY + 0.01, 0, {
                seg: 24, metalness: 0.05, roughness: 0.85
            }));
            // Yüz (oval — küre, hafif scale)
            const face = new THREE.Mesh(
                new THREE.SphereGeometry(0.115, 28, 22),
                mat(skin, { roughness: 0.62 })
            );
            face.scale.set(1.0, 1.05, 0.95);
            face.position.set(-1.04, headY, 0);
            prepMesh(face); g.add(face);
            // Çene altı gölge
            g.add(cyl(0.075, 0.090, 0.05, skinShadow, -1.04, headY - 0.10, 0, {
                seg: 18, roughness: 0.70
            }));
            // Cerrahi bone şeridi
            g.add(box(0.21, 0.018, 0.20, 0x2c5d8e, -1.04, headY + 0.085, 0, { roughness: 0.80 }));

            // Boyun
            g.add(cyl(0.060, 0.072, 0.10, skin, -0.93, headY - 0.06, 0, {
                seg: 18, roughness: 0.62
            }));

            // KOLLAR — kol tahtası üstünde, hafif fleksiyon (CABG için klasik)
            [-0.86, 0.86].forEach(zz => {
                // Üst kol (omuz → dirsek)
                const upper = cyl(0.062, 0.058, 0.40, skin, -0.55, 1.105, zz, {
                    seg: 16, roughness: 0.62
                });
                upper.rotation.z = Math.PI / 2;
                g.add(upper);
                // Önkol
                const fore = cyl(0.052, 0.046, 0.34, skin, -0.10, 1.105, zz, {
                    seg: 16, roughness: 0.62
                });
                fore.rotation.z = Math.PI / 2;
                g.add(fore);
                // El (yumruk)
                g.add(new THREE.Mesh(
                    new THREE.SphereGeometry(0.055, 16, 12),
                    mat(skin, { roughness: 0.62 })
                )).position.set(0.10, 1.105, zz);
                // Arteriyel/IV kateter sargısı (sadece bir kolda — sol radial art)
                if (zz > 0) {
                    g.add(box(0.06, 0.010, 0.08, 0xfff8d4, 0.06, 1.118, zz, { roughness: 0.50 }));
                    // Arter hattı (ince kırmızı)
                    const aLine = cyl(0.006, 0.006, 0.32, 0xd96371, 0.20, 1.10, zz + 0.04, {
                        seg: 8, roughness: 0.40
                    });
                    aLine.rotation.z = Math.PI / 2.4;
                    g.add(aLine);
                }
            });

            // ============================================================
            // [C] STERIL MAVİ CERRAHI DRAPE — gövdeyi+bacakları örtüyor
            // Drape kalın, kenar hemli, hafif kıvrımlı (blok değil)
            // ============================================================
            const drapeBlue = 0x2c5d8e;       // medikal mavi (CABG drape)
            const drapeBlueLite = 0x4a7eb8;
            const drapeY = 1.18;              // hasta gövdesi üstü (eski drape seviyesi ile aynı)

            // Ana drape gövdesi (boyundan ayağa)
            // Birden fazla katman halinde: kalınlık + tekstil hissi
            // 1. Alt taşıyıcı tabaka (koyu mavi)
            g.add(box(2.10, 0.030, 0.78, drapeBlue, 0.00, drapeY, 0, {
                roughness: 0.85, metalness: 0.02
            }));
            // 2. Üst tabaka (hafif daha açık — ışık altında tekstil hissi)
            g.add(box(2.06, 0.022, 0.76, drapeBlueLite, 0.00, drapeY + 0.026, 0, {
                roughness: 0.78, metalness: 0.02
            }));

            // Drape kenar hemi (4 yan — kalınlığı belli eden bant)
            // Sol/sağ uzun kenarlar (z eksenli)
            [-0.39, 0.39].forEach(zz => {
                g.add(box(2.10, 0.046, 0.022, 0x1f4470, 0.00, drapeY + 0.014, zz, {
                    roughness: 0.80
                }));
            });
            // Baş ve ayak uçları
            [-1.05, 1.05].forEach(xx => {
                g.add(box(0.022, 0.046, 0.78, 0x1f4470, xx, drapeY + 0.014, 0, {
                    roughness: 0.80
                }));
            });

            // Drape kıvrımları — yan kenarlardan aşağı doğru sarkıt
            // (hasta gövdesinin kenarından masa yan rayına doğru hafif düşüş)
            [-0.36, 0.36].forEach(zz => {
                // 3 nokta sarkma (baş, orta, ayak) — hafif aşağı düşmüş prizmalar
                [-0.70, 0.10, 0.80].forEach(xx => {
                    const fold = box(0.18, 0.042, 0.08, drapeBlue, xx, drapeY - 0.010, zz + Math.sign(zz) * 0.04, {
                        roughness: 0.86
                    });
                    fold.rotation.x = Math.sign(zz) * 0.18; // hafif eğim
                    g.add(fold);
                });
            });

            // Drape üst yüzey kıvrım gölgeleri (göğüs çevresi yumuşak rölyef)
            // — hasta gövdesinin altında olduğunu hissettirir
            [-0.28, 0.28].forEach(zz => {
                g.add(box(1.20, 0.010, 0.10, 0x1f4470, -0.10, drapeY + 0.038, zz, {
                    roughness: 0.85, transparent: true, opacity: 0.55
                }));
            });

            // Baş ucu drape barrier (anestezi screen) — yüksek dikey perde
            // Anestezistin sterilden ayrıldığı klasik "ether screen"
            g.add(box(0.030, 0.46, 0.78, drapeBlue, -0.78, drapeY + 0.26, 0, {
                roughness: 0.84
            }));
            // Üst kenar takviyesi
            g.add(box(0.040, 0.022, 0.80, 0x1f4470, -0.78, drapeY + 0.48, 0, {
                roughness: 0.80
            }));

            // ============================================================
            // [D] STERNOTOMI PENCERESİ — drape ortasında dikdörtgen açıklık
            // ============================================================
            // Drape'in göğüs orta hattındaki kesisi: drape üstüne fenestre
            // çerçevesi + içinde açık doku (ten rengi alan + sternal retraktör)
            const stWinX = -0.16;       // göğüs merkezi (sırt segmenti)
            const stWinY = drapeY + 0.025;  // drape üst yüzeyi üzerinde
            const stWinW = 0.34;        // x — sternotomi uzunluğu
            const stWinD = 0.18;        // z — açıklık genişliği

            // Fenestre çerçevesi (4 kenar — açık mavi steril sınır)
            // üst (z+)
            g.add(box(stWinW + 0.04, 0.012, 0.020, 0xa8c8e0, stWinX, stWinY + 0.005, +stWinD / 2 + 0.010, {
                emissive: 0xa8c8e0, emissiveIntensity: 0.10, roughness: 0.50
            }));
            // alt (z-)
            g.add(box(stWinW + 0.04, 0.012, 0.020, 0xa8c8e0, stWinX, stWinY + 0.005, -stWinD / 2 - 0.010, {
                emissive: 0xa8c8e0, emissiveIntensity: 0.10, roughness: 0.50
            }));
            // sol (x-)
            g.add(box(0.020, 0.012, stWinD + 0.040, 0xa8c8e0, stWinX - stWinW / 2 - 0.010, stWinY + 0.005, 0, {
                emissive: 0xa8c8e0, emissiveIntensity: 0.10, roughness: 0.50
            }));
            // sağ (x+)
            g.add(box(0.020, 0.012, stWinD + 0.040, 0xa8c8e0, stWinX + stWinW / 2 + 0.010, stWinY + 0.005, 0, {
                emissive: 0xa8c8e0, emissiveIntensity: 0.10, roughness: 0.50
            }));

            // Açık doku alanı (drape kesisinin içi — koyu kırmızı/bordo, sakin)
            // Klinik vurgu: kanlı/parlak değil; mat, doku/yağ rengi
            g.add(box(stWinW - 0.02, 0.008, stWinD - 0.02, 0x8a3a48, stWinX, stWinY - 0.006, 0, {
                roughness: 0.78
            }));
            // Sternum kenarları (iki taraflı kemik kenarı — soluk krem)
            [-1, 1].forEach(s => {
                g.add(box(stWinW - 0.04, 0.014, 0.018, 0xeac8a0, stWinX, stWinY - 0.002, s * (stWinD / 2 - 0.022), {
                    roughness: 0.62
                }));
            });

            // ============================================================
            // [E] FINOCHIETTO RETRACTOR — düşük profil satin/brushed metal
            // ============================================================
            const retY = stWinY + 0.012;
            // Yatay ana çubuk (rack — z ekseninde sternum üzerinden geçer)
            g.add(box(0.020, 0.014, stWinD + 0.06, 0xc7d3dc, stWinX, retY + 0.010, 0, {
                metalness: 0.70, roughness: 0.30
            }));
            // Crank (sap) — çubuğun sol ucunda
            g.add(cyl(0.014, 0.014, 0.06, 0xc7d3dc, stWinX, retY + 0.020, -stWinD / 2 - 0.06, {
                seg: 12, metalness: 0.72, roughness: 0.28
            }));
            g.add(box(0.040, 0.012, 0.014, 0xc7d3dc, stWinX, retY + 0.020, -stWinD / 2 - 0.10, {
                metalness: 0.72, roughness: 0.28
            }));
            // İki retraktör bıçağı (yan ayırıcı) — sternumu sağ/sol açar
            [-1, 1].forEach(s => {
                // Bıçak gövdesi
                g.add(box(stWinW - 0.06, 0.030, 0.014, 0xb8c4cf, stWinX, retY, s * (stWinD / 2 - 0.030), {
                    metalness: 0.68, roughness: 0.30
                }));
                // Bıçağın alt dişleri (sternum içine giren)
                g.add(box(stWinW - 0.10, 0.020, 0.010, 0xa8b4bf, stWinX, retY - 0.018, s * (stWinD / 2 - 0.030), {
                    metalness: 0.65, roughness: 0.32
                }));
            });

            // ============================================================
            // [F] KPB KANÜL HATLARI — aortik (kırmızı) + venöz (mavi-bordo)
            //     + kardiopleji (sarı). Drape'ten KPB tarafına (z+) çıkar.
            // ============================================================
            // Hatlar göğüs kesisinin sağ üst köşesinden çıkıp masa kenarından
            // KPB'ye (z = +1.0+ tarafı) gidiyormuş gibi.
            const lineStartX = stWinX + 0.06;
            const lineStartY = stWinY + 0.010;
            const lineStartZ = +stWinD / 2 + 0.020;

            // Aortik kanül (parlak kırmızı, kalın)
            const aoLine = cyl(0.018, 0.018, 0.62, 0xd14b5c, lineStartX + 0.10, lineStartY + 0.02, lineStartZ + 0.30, {
                seg: 12, roughness: 0.40, metalness: 0.10, emissive: 0xd14b5c, emissiveIntensity: 0.10
            });
            aoLine.rotation.x = Math.PI / 2;
            aoLine.rotation.z = -0.18;
            g.add(aoLine);
            // Aortik kanül konektörü (kesi kenarında)
            g.add(cyl(0.022, 0.022, 0.04, 0xfff8d4, lineStartX, lineStartY + 0.008, lineStartZ - 0.005, {
                seg: 12, metalness: 0.50, roughness: 0.30
            }));

            // Venöz kanül (koyu bordo-mor, daha kalın)
            const veLine = cyl(0.022, 0.022, 0.62, 0x6e3344, lineStartX - 0.05, lineStartY + 0.02, lineStartZ + 0.30, {
                seg: 12, roughness: 0.45
            });
            veLine.rotation.x = Math.PI / 2;
            veLine.rotation.z = 0.04;
            g.add(veLine);
            g.add(cyl(0.026, 0.026, 0.04, 0xfff8d4, lineStartX - 0.07, lineStartY + 0.008, lineStartZ - 0.005, {
                seg: 12, metalness: 0.50, roughness: 0.30
            }));

            // Kardiopleji hattı (sarı-altın, ince)
            const cpLine = cyl(0.010, 0.010, 0.58, 0xe0a558, lineStartX + 0.16, lineStartY + 0.020, lineStartZ + 0.28, {
                seg: 10, roughness: 0.40, emissive: 0xe0a558, emissiveIntensity: 0.20
            });
            cpLine.rotation.x = Math.PI / 2;
            cpLine.rotation.z = -0.30;
            g.add(cpLine);

            // Hat organizör klempi (drape kenarında)
            g.add(box(0.10, 0.020, 0.030, 0x9fb0bc, lineStartX + 0.04, lineStartY + 0.025, lineStartZ + 0.04, {
                metalness: 0.50, roughness: 0.28
            }));

            // ============================================================
            // [G] BAŞ UCU — ETT + ANESTEZI DEVRESİ + MİNİMAL MONİTÖR
            // ============================================================
            // ETT (endotrakeal tüp) — ağızdan çıkan kısa beyaz tüp
            g.add(cyl(0.014, 0.014, 0.10, 0xf5f5f5, -1.04, headY - 0.04, 0.040, {
                seg: 10, roughness: 0.45
            }));
            // ETT sabitleme (bant — beyaz/krem)
            g.add(box(0.080, 0.010, 0.060, 0xeac8a0, -1.04, headY - 0.06, 0.020, { roughness: 0.55 }));

            // Anestezi devresi (Y-piece + 2 bükümlü hortum) — baş ucundan z+ tarafa
            const yPiece = box(0.040, 0.030, 0.030, 0xa8b4bf, -1.04, headY - 0.06, 0.090, {
                metalness: 0.20, roughness: 0.30
            });
            g.add(yPiece);
            // İki paralel hortum (mavi-gri, hafif diyagonal)
            [-0.030, +0.030].forEach((dz, i) => {
                const hose = cyl(0.020, 0.020, 0.50, [0x6b8a9e, 0xb0c0cc][i], -1.16, headY + 0.08, 0.140 + dz, {
                    seg: 10, roughness: 0.55
                });
                hose.rotation.z = Math.PI / 2.6;
                g.add(hose);
                // Spiral halka detay (3 yer)
                [0, 1, 2].forEach(k => {
                    const ring = new THREE.Mesh(
                        new THREE.TorusGeometry(0.022, 0.003, 6, 14),
                        mat([0x4a6b80, 0x9aabb8][i], { roughness: 0.50 })
                    );
                    ring.rotation.y = Math.PI / 2;
                    ring.position.set(-1.10 - k * 0.10, headY + 0.04 + k * 0.05, 0.140 + dz);
                    prepMesh(ring); g.add(ring);
                });
            });

            // Pulse oksimetre kablosu (mavi, kola — sağ taraf)
            const spo2 = cyl(0.005, 0.005, 0.40, 0x4a7eb8, -0.20, 1.12, -0.86, {
                seg: 8, roughness: 0.40
            });
            spo2.rotation.z = Math.PI / 2.8;
            g.add(spo2);

            // 3 EKG kablosu (drape kenarından — kırmızı/sarı/yeşil minimal)
            [
                { col: 0xd96371, dx: 0.10 },
                { col: 0xe0a558, dx: 0.18 },
                { col: 0x4cb88a, dx: 0.26 }
            ].forEach(({ col, dx }) => {
                const c = cyl(0.004, 0.004, 0.34, col, -0.50 + dx, drapeY + 0.040, -0.36, {
                    seg: 6, roughness: 0.40
                });
                c.rotation.x = Math.PI / 2;
                c.rotation.z = 0.10;
                g.add(c);
            });

            return g;
        }

        function buildCABGOpTablePatientV2(x, y, z) {
            // ============================================================
            // CABG OP-TABLE + PATIENT INTEGRATED COMPOSITION v2.0
            // Premium hibrit kardiyak OR table + supin hasta + mat medikal
            // drape + sternotomi + KPB hatları + anestezi airway bağlantısı
            // + entegre instrument surface — tek kompozisyon.
            // ============================================================
            const root = new THREE.Group();
            root.name = 'CABGOpTablePatientV2';
            root.position.set(x, y, z);
            // Yatay konumlama + 180° çevrim: baş ucu anestezi (x-) tarafına,
            // ayak ucu KPB (x+) tarafına gelecek şekilde döndürüldü.
            // (-π/2 yatay yapardı, +π ile baş/ayak tersine döndü → +π/2)
            root.rotation.y = Math.PI / 2;

            function makeMat(color, opts = {}) {
                return new THREE.MeshStandardMaterial({
                    color,
                    roughness: opts.roughness ?? 0.45,
                    metalness: opts.metalness ?? 0.10,
                    emissive: opts.emissive ?? 0x000000,
                    emissiveIntensity: opts.emissiveIntensity ?? 0
                });
            }

            const M = {
                tableDark: makeMat(0x1b2330, { roughness: 0.36, metalness: 0.28 }),
                tableGraphite: makeMat(0x2f3a45, { roughness: 0.38, metalness: 0.30 }),
                carbon: makeMat(0x111820, { roughness: 0.24, metalness: 0.18 }),
                steel: makeMat(0xb6bec6, { roughness: 0.24, metalness: 0.72 }),
                brushed: makeMat(0xd0d6dc, { roughness: 0.28, metalness: 0.66 }),
                pad: makeMat(0x172635, { roughness: 0.52, metalness: 0.04 }),
                skin: makeMat(0xd1a17b, { roughness: 0.58, metalness: 0.02 }),
                skinDark: makeMat(0xb78362, { roughness: 0.62, metalness: 0.02 }),
                drape: makeMat(0x1f6f95, { roughness: 0.82, metalness: 0.00 }),
                drapeDark: makeMat(0x15536f, { roughness: 0.86, metalness: 0.00 }),
                drapeLight: makeMat(0x2d8db8, { roughness: 0.80, metalness: 0.00 }),
                tubeRed: makeMat(0x9d2f2f, { roughness: 0.42, metalness: 0.05 }),
                tubeBlue: makeMat(0x1e5f9f, { roughness: 0.42, metalness: 0.05 }),
                tubeDark: makeMat(0x26333e, { roughness: 0.48, metalness: 0.05 }),
                tubeClear: makeMat(0xbfd8e8, { roughness: 0.28, metalness: 0.02, emissive: 0x09283a, emissiveIntensity: 0.03 }),
                blackSoft: makeMat(0x121820, { roughness: 0.66, metalness: 0.02 }),
                whiteTape: makeMat(0xe7edf2, { roughness: 0.62, metalness: 0.00 })
            };

            function meshAt(geometry, material, px, py, pz, sx = 1, sy = 1, sz = 1) {
                const m = new THREE.Mesh(geometry, material);
                m.position.set(px, py, pz);
                m.scale.set(sx, sy, sz);
                m.castShadow = true; m.receiveShadow = true;
                return m;
            }
            function bx(w, h, d, material, px, py, pz) {
                return meshAt(new THREE.BoxGeometry(w, h, d), material, px, py, pz);
            }
            function cy(r1, r2, h, material, px, py, pz, seg = 24) {
                return meshAt(new THREE.CylinderGeometry(r1, r2, h, seg), material, px, py, pz);
            }
            function ellipsoid(rx, ry, rz, material, px, py, pz, seg = 32) {
                return meshAt(new THREE.SphereGeometry(1, seg, seg), material, px, py, pz, rx, ry, rz);
            }
            function rodBetween(a, b, radius, material, seg = 18) {
                const dir = new THREE.Vector3().subVectors(b, a);
                const len = dir.length();
                const rod = new THREE.Mesh(
                    new THREE.CylinderGeometry(radius, radius, len, seg),
                    material
                );
                rod.position.copy(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5));
                rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
                rod.castShadow = true; rod.receiveShadow = true;
                return rod;
            }
            function tubeFrom(points, radius, material, seg = 24) {
                const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
                const geo = new THREE.TubeGeometry(curve, seg, radius, 10, false);
                const t = new THREE.Mesh(geo, material);
                t.castShadow = true; t.receiveShadow = true;
                return t;
            }
            function addFold(x1, x2, zPos, yPos, material, radius = 0.008) {
                const a = new THREE.Vector3(x1, yPos, zPos);
                const b = new THREE.Vector3(x2, yPos + 0.006, zPos + 0.02);
                root.add(rodBetween(a, b, radius, material, 12));
            }

            // 1) Premium operating table
            root.add(bx(1.28, 0.10, 0.86, M.tableDark, 0.00, 0.05, 0.05));
            root.add(bx(1.06, 0.045, 0.68, M.steel, 0.00, 0.125, 0.05));
            root.add(bx(0.42, 0.56, 0.36, M.tableGraphite, 0.00, 0.42, 0.05));
            root.add(bx(0.34, 0.42, 0.28, M.steel, 0.00, 0.48, 0.05));
            for (let i = 0; i < 5; i++) {
                root.add(bx(0.50, 0.025, 0.42, M.blackSoft, 0.00, 0.19 + i * 0.045, 0.05));
            }
            root.add(bx(1.08, 0.075, 2.30, M.carbon, 0.00, 0.78, 0.00));
            root.add(bx(1.02, 0.050, 0.55, M.pad, 0.00, 0.835, -0.82));
            root.add(bx(1.02, 0.050, 0.72, M.pad, 0.00, 0.835, -0.25));
            root.add(bx(1.02, 0.050, 0.55, M.pad, 0.00, 0.835, 0.42));
            root.add(bx(1.02, 0.050, 0.40, M.pad, 0.00, 0.835, 0.92));
            root.add(bx(0.035, 0.045, 2.22, M.brushed, -0.58, 0.87, 0.02));
            root.add(bx(0.035, 0.045, 2.22, M.brushed, 0.58, 0.87, 0.02));
            [-0.58, 0.58].forEach(xx => {
                [-0.78, -0.42, 0.00, 0.42, 0.78].forEach(zz => {
                    root.add(bx(0.060, 0.055, 0.070, M.steel, xx, 0.91, zz));
                });
            });
            root.add(bx(0.42, 0.055, 0.95, M.carbon, -0.88, 0.82, -0.28));
            root.add(bx(0.42, 0.055, 0.95, M.carbon, 0.88, 0.82, -0.28));
            root.add(bx(0.36, 0.040, 0.78, M.pad, -0.88, 0.865, -0.28));
            root.add(bx(0.36, 0.040, 0.78, M.pad, 0.88, 0.865, -0.28));

            // 2) ULTRA PREMIUM PATIENT v3 — anatomik (eni daraltıldı, eklemler belirgin,
            //    saphenous ven hattı, ayrıntılı el/ayak, parmaklar, saphen vein harvest site)

            // Saphenous mat (yeşilimsi)
            const M_sapheVein = makeMat(0x2a4d3c, { roughness: 0.42, metalness: 0.05 });
            const M_iodine = makeMat(0x6b3a1f, { roughness: 0.55, metalness: 0.02 });

            // Drape altı doğal vücut hacmi — DAHA DAR (eni 0.40 → 0.30)
            root.add(ellipsoid(0.30, 0.15, 0.50, M.drapeDark, 0.00, 0.940, -0.32));   // göğüs/üst abdomen
            root.add(ellipsoid(0.28, 0.12, 0.42, M.drapeDark, 0.00, 0.925, 0.18));    // alt abdomen
            root.add(ellipsoid(0.26, 0.11, 0.40, M.drapeDark, 0.00, 0.915, 0.58));    // pelvis
            // Uyluklar (drape, ama sağ bacak saphen alanı için açık — ileride göreceğiz)
            root.add(ellipsoid(0.13, 0.10, 0.42, M.drapeDark, -0.16, 0.905, 0.95));   // sol uyluk (drape)
            root.add(ellipsoid(0.11, 0.08, 0.30, M.drapeDark, -0.16, 0.895, 1.30));   // sol diz altı (drape)

            // KAFA + BOYUN — anatomik
            root.add(bx(0.36, 0.060, 0.30, M.pad, 0.00, 0.865, -1.18));               // kafa pad
            // Boyun (kas hatları)
            root.add(cy(0.072, 0.080, 0.090, M.skin, 0.00, 0.948, -0.99, 18));
            // Sternocleidomastoid kasları (ince çift hat)
            [-0.040, 0.040].forEach(dx => {
                root.add(ellipsoid(0.018, 0.030, 0.060, M.skinDark, dx, 0.965, -1.00));
            });
            // Çene/mandibula
            root.add(ellipsoid(0.105, 0.058, 0.092, M.skinDark, 0.00, 0.954, -1.05));
            // Kafatası (oksiput → frontal) — daha doğal oval
            root.add(ellipsoid(0.130, 0.118, 0.158, M.skin, 0.00, 1.008, -1.17));
            // Saç çizgisi gölgesi
            root.add(ellipsoid(0.122, 0.020, 0.060, M.skinDark, 0.00, 1.105, -1.10));
            // Cerrahi bone (mavi steril)
            root.add(ellipsoid(0.140, 0.064, 0.122, M.drapeLight, 0.00, 1.078, -1.18));
            // Bone alt kenarı
            root.add(bx(0.230, 0.018, 0.020, M.drape, 0.00, 1.020, -1.30));
            // Burun (anatomik)
            root.add(ellipsoid(0.020, 0.024, 0.046, M.skin, 0.00, 1.000, -1.31));
            root.add(ellipsoid(0.014, 0.010, 0.012, M.skinDark, 0.00, 0.985, -1.34)); // burun delikleri gölge
            // Göz çukurları
            [-0.042, 0.042].forEach(dx => {
                root.add(ellipsoid(0.024, 0.012, 0.014, M.blackSoft, dx, 1.022, -1.282));
                // Kaş
                root.add(bx(0.045, 0.008, 0.010, M.skinDark, dx, 1.040, -1.288));
            });
            // Dudaklar
            root.add(ellipsoid(0.038, 0.008, 0.018, M.skinDark, 0.00, 0.972, -1.30));
            // Yanak elmacık
            [-0.078, 0.078].forEach(dx => {
                root.add(ellipsoid(0.032, 0.024, 0.048, M.skinDark, dx, 0.992, -1.22));
            });
            // ETT bantı
            root.add(bx(0.210, 0.014, 0.058, M.whiteTape, 0.00, 0.985, -1.27));
            // Kulaklar
            [-0.130, 0.130].forEach(dx => {
                root.add(ellipsoid(0.012, 0.030, 0.022, M.skin, dx, 1.010, -1.18));
            });

            // KOLLAR — ULTRA detaylı (omuz → biceps/triceps → dirsek → önkol → bilek → el → 5 parmak)
            [-1, 1].forEach(side => {
                const sx = side * 0.62;  // DAHA DAR (0.88 → 0.62)
                // Omuz (deltoid kasları belirgin)
                root.add(ellipsoid(0.105, 0.090, 0.110, M.skin, sx, 0.970, -0.62));
                // Deltoid alt sınırı (kas hattı)
                root.add(ellipsoid(0.080, 0.025, 0.050, M.skinDark, sx, 0.920, -0.55));
                // Üst kol — biceps (üst) ve triceps (alt) ayrımı
                root.add(ellipsoid(0.072, 0.060, 0.22, M.skin, sx, 0.955, -0.36));      // biceps
                root.add(ellipsoid(0.062, 0.045, 0.20, M.skinDark, sx, 0.895, -0.36));  // triceps gölge
                // Dirsek — anatomik (olecranon belirgin)
                root.add(ellipsoid(0.068, 0.062, 0.080, M.skinDark, sx, 0.930, -0.14));
                root.add(ellipsoid(0.025, 0.025, 0.030, M.skin, sx, 0.960, -0.13));     // olecranon highlight
                // Önkol (radius/ulna) — koni şeklinde (dirsek kalın, bilek ince)
                root.add(ellipsoid(0.062, 0.050, 0.21, M.skin, sx, 0.928, 0.06));
                root.add(ellipsoid(0.035, 0.025, 0.18, M.skinDark, sx + 0.020 * side, 0.905, 0.07)); // ulna gölge
                // Bilek (radial pulse noktası)
                root.add(ellipsoid(0.054, 0.040, 0.040, M.skinDark, sx, 0.928, 0.22));
                // El (avuç içi düz, parmaklar uzanmış)
                root.add(ellipsoid(0.068, 0.030, 0.075, M.skin, sx, 0.928, 0.30));
                // 5 parmak — ayrı küçük silindirler
                for (let f = 0; f < 5; f++) {
                    const fingX = sx + (f - 2) * 0.014;
                    const fingLen = (f === 0) ? 0.045 : (f === 2 ? 0.075 : (f === 1 || f === 3 ? 0.068 : 0.055));
                    const finger = cy(0.0085, 0.0075, fingLen, M.skin, fingX, 0.940, 0.36 + fingLen / 2 - 0.005, 8);
                    finger.rotation.x = Math.PI / 2;
                    finger.position.z = 0.36 + fingLen / 2;
                    root.add(finger);
                    // Tırnak ucu
                    root.add(ellipsoid(0.005, 0.003, 0.006, M.whiteTape, fingX, 0.946, 0.36 + fingLen + 0.002));
                }
                // Premium kol fiksasyon strap (siyah + buckle)
                root.add(bx(0.24, 0.045, 0.095, M.blackSoft, sx, 0.955, -0.42));
                root.add(bx(0.060, 0.014, 0.040, M.steel, sx + 0.080 * side, 0.980, -0.42));
                // Bilek IV/arteriyel hat (sadece sağ — radial art line)
                if (side > 0) {
                    root.add(bx(0.085, 0.014, 0.058, M.whiteTape, sx, 0.962, 0.18));
                    // IV kanül noktası (mavi flaster)
                    root.add(bx(0.030, 0.012, 0.020, M.tubeBlue, sx + 0.020, 0.965, 0.20));
                }
                // Pulse oksimetre klipsi (sadece sağ işaret parmağı)
                if (side > 0) {
                    root.add(bx(0.018, 0.020, 0.030, M.tubeRed, sx + 0.014, 0.946, 0.42));
                }
            });

            // SAĞ BACAK — SAPHENOUS VEIN HARVEST SITE (uyluk açık, antiseptik boyalı, ven hattı belirgin)
            // Sağ uyluk cilt (drape AÇIK — ven harvest için)
            root.add(ellipsoid(0.13, 0.085, 0.42, M.skin, 0.16, 0.918, 0.95));
            // Antiseptik (povidon-iyot — kahverengi/turuncu) tüm bacak boyunca
            root.add(ellipsoid(0.115, 0.018, 0.40, M_iodine, 0.16, 0.985, 0.95));
            root.add(ellipsoid(0.10, 0.018, 0.30, M_iodine, 0.16, 0.975, 1.32));
            // Diz (patella belirgin)
            root.add(ellipsoid(0.110, 0.085, 0.090, M.skinDark, 0.16, 0.910, 1.18));
            root.add(ellipsoid(0.040, 0.030, 0.045, M.skin, 0.16, 0.945, 1.18));   // patella highlight
            // Baldır (gastroknemius kasları belirgin)
            root.add(ellipsoid(0.110, 0.080, 0.32, M.skin, 0.16, 0.900, 1.34));
            // Kas hatları
            root.add(ellipsoid(0.045, 0.025, 0.18, M.skinDark, 0.13, 0.940, 1.30));  // medial gastroknemius
            root.add(ellipsoid(0.045, 0.025, 0.18, M.skinDark, 0.19, 0.940, 1.30));  // lateral gastroknemius
            // Ayak bileği
            root.add(ellipsoid(0.075, 0.060, 0.060, M.skinDark, 0.16, 0.890, 1.66));
            // Ayak
            root.add(ellipsoid(0.080, 0.045, 0.130, M.skin, 0.16, 0.890, 1.78));
            // Ayak parmakları (5 adet)
            for (let f = 0; f < 5; f++) {
                const fx = 0.16 + (f - 2) * 0.018;
                root.add(ellipsoid(0.012, 0.010, 0.022, M.skin, fx, 0.900, 1.90));
            }

            // SAPHENOUS VEIN — uzun mavi-yeşil hat (medial uyluk → diz medial → medial baldır → ayak bileği)
            root.add(tubeFrom([
                [0.08, 0.992, 0.55],   // proximal (kasık altı)
                [0.10, 0.998, 0.75],
                [0.12, 1.000, 0.95],   // mid uyluk
                [0.13, 1.000, 1.15],   // diz medial
                [0.13, 0.992, 1.32],   // baldır üst medial
                [0.14, 0.985, 1.50],   // baldır mid
                [0.15, 0.978, 1.66],   // medial malleol
                [0.16, 0.972, 1.78]    // ayak (saphen ven sonu)
            ], 0.008, M_sapheVein, 60));

            // Saphen vein harvest insizyon hattı (uzun ince kesik — mor/koyu kırmızı)
            root.add(tubeFrom([
                [0.09, 1.005, 0.60],
                [0.11, 1.012, 0.85],
                [0.13, 1.014, 1.10],
                [0.13, 1.010, 1.32],
                [0.14, 1.000, 1.55]
            ], 0.004, M.tubeRed, 50));

            // Saphen ekibi için ek drape kenarı (sağ bacak çevresinde steril sınır)
            root.add(bx(0.020, 0.025, 1.30, M.drapeLight, 0.04, 0.998, 1.10));   // medial sınır
            root.add(bx(0.020, 0.025, 1.30, M.drapeLight, 0.28, 0.998, 1.10));   // lateral sınır
            root.add(bx(0.260, 0.025, 0.020, M.drapeLight, 0.16, 0.998, 0.46));  // proksimal sınır

            // 3) Sterile drape
            root.add(bx(1.28, 0.040, 1.96, M.drape, 0.00, 1.000, 0.10));
            root.add(bx(1.36, 0.035, 0.88, M.drape, 0.00, 0.985, 0.92));
            root.add(bx(1.08, 0.035, 0.38, M.drape, 0.00, 0.992, -0.86));
            root.add(bx(0.040, 0.40, 1.80, M.drapeDark, -0.68, 0.775, 0.22));
            root.add(bx(0.040, 0.40, 1.80, M.drapeDark, 0.68, 0.775, 0.22));
            root.add(bx(1.22, 0.36, 0.040, M.drapeDark, 0.00, 0.775, 1.34));
            addFold(-0.48, 0.44, -0.58, 1.032, M.drapeLight, 0.006);
            addFold(-0.54, 0.50, -0.08, 1.030, M.drapeLight, 0.006);
            addFold(-0.50, 0.45, 0.44, 1.026, M.drapeDark, 0.006);
            addFold(-0.46, 0.40, 0.86, 1.020, M.drapeDark, 0.006);
            addFold(-0.32, 0.32, 1.18, 1.012, M.drapeLight, 0.006);

            // 4) Sternotomy operative field
            root.add(ellipsoid(0.245, 0.012, 0.230, M.skin, 0.00, 1.048, -0.43, 32));
            root.add(bx(0.62, 0.018, 0.055, M.drapeLight, 0.00, 1.062, -0.68));
            root.add(bx(0.62, 0.018, 0.055, M.drapeLight, 0.00, 1.062, -0.18));
            root.add(bx(0.055, 0.018, 0.48, M.drapeLight, -0.33, 1.062, -0.43));
            root.add(bx(0.055, 0.018, 0.48, M.drapeLight, 0.33, 1.062, -0.43));
            root.add(bx(0.055, 0.040, 0.42, M.brushed, -0.155, 1.092, -0.43));
            root.add(bx(0.055, 0.040, 0.42, M.brushed, 0.155, 1.092, -0.43));
            root.add(bx(0.37, 0.035, 0.040, M.brushed, 0.00, 1.100, -0.61));
            root.add(bx(0.37, 0.035, 0.040, M.brushed, 0.00, 1.100, -0.25));
            [-0.155, 0.155].forEach(xx => {
                [-0.58, -0.43, -0.28].forEach(zz => {
                    root.add(bx(0.078, 0.035, 0.030, M.steel, xx, 1.125, zz));
                });
            });
            root.add(bx(0.13, 0.018, 0.08, M.whiteTape, -0.37, 1.075, -0.25));
            root.add(bx(0.11, 0.014, 0.07, M.whiteTape, -0.43, 1.080, -0.35));
            root.add(rodBetween(
                new THREE.Vector3(0.38, 1.080, -0.21),
                new THREE.Vector3(0.58, 1.070, -0.05),
                0.010, M.steel, 12
            ));

            // 5) PREMIUM CLINICAL CONNECTIONS — kablolar/hatlar gerçek cihazlara gider
            // Hedefler (local koordinatta — root rotation.y=+π/2):
            //   KPB makinesi:    z=+3.98, x=+0.30  (world +x ekseni)
            //   Anestezi cihazı: z=-3.95, x=+0.10  (world -x, baş ucu ötesi)
            //   Monitör (entegre): z=-2.49, x=-0.04
            //   ESU:             z=+1.95, x=-1.45

            // ----- KPB hatları (sternotomiden → KPB makinesine) -----
            // Aortik kanül (parlak kırmızı, kalın)
            root.add(tubeFrom([
                [0.10, 1.110, -0.36], [0.20, 1.060, -0.10], [0.28, 1.000, 0.40],
                [0.30, 0.940, 1.20], [0.30, 0.880, 2.20], [0.30, 0.840, 3.30], [0.30, 0.820, 3.95]
            ], 0.018, M.tubeRed, 60));
            // Venöz kanül (koyu mavi/bordo, daha kalın)
            root.add(tubeFrom([
                [-0.05, 1.105, -0.50], [0.05, 1.055, -0.20], [0.18, 0.995, 0.35],
                [0.24, 0.935, 1.20], [0.26, 0.875, 2.20], [0.28, 0.835, 3.30], [0.28, 0.815, 3.95]
            ], 0.022, M.tubeBlue, 60));
            // Kardiopleji (sarı/altın, ince)
            root.add(tubeFrom([
                [0.18, 1.090, -0.50], [0.22, 1.030, -0.15], [0.28, 0.970, 0.35],
                [0.32, 0.910, 1.20], [0.34, 0.860, 2.20], [0.34, 0.830, 3.30], [0.34, 0.815, 3.95]
            ], 0.010, M.tubeDark, 50));
            // Kanül konektörleri (kesi kenarında — krom)
            root.add(cy(0.026, 0.026, 0.055, M.steel, 0.10, 1.115, -0.36, 16));
            root.add(cy(0.026, 0.026, 0.055, M.steel, -0.05, 1.115, -0.50, 16));
            // Hat organizör klempi (drape kenarında)
            root.add(bx(0.10, 0.020, 0.030, M.steel, 0.20, 1.040, 0.20));

            // ----- ESKİ Anestezi devresi (üstten/havadan z- yönünde anestezi cihazına)
            //       KALDIRILDI — yerine alttan/yer rotalı yeni bağlantılar kullanılıyor
            //       (bkz. PatientAnesthesiaConnections, buildIntraopCABG içinde). -----

            // ----- Monitör hatları — EKG ped'leri kalır, KABLOLAR yeni alt-rota
            //       sistemine devredildi (PatientAnesthesiaConnections içinde). -----
            // EKG ped'leri (drape üstü beyaz) — fiziksel elektrotlar kalır
            [[-0.18, -0.64], [0.18, -0.62], [0.00, -0.30]].forEach(([xx, zz]) => {
                root.add(ellipsoid(0.035, 0.006, 0.022, M.whiteTape, xx, 1.076, zz, 16));
            });
            // ESKİ HAVA-ROTALI EKG KABLOLARI (z=-2.49 entegre monitör hedefine) KALDIRILDI.
            // ESKİ HAVA-ROTALI PULSE OKSİMETRE KABLOSU KALDIRILDI.
            // Yeni kablolar yer-rotalı olarak yan duvar inletinden cihaza giriyor.

            // ----- ESKİ Bilek hatları (üstten z- yönüne uzanan IV/arteriyel) KALDIRILDI -----
            //       Mavi IV (sol bilek → anestezi) ve kırmızı arteriyel hat (sağ bilek → monitör)
            //       yeni alt-rota bağlantı sistemiyle (PatientAnesthesiaConnections) çakıştığı için
            //       sahneden kaldırıldı.

            // ----- Koter (ESU) kablosu — operatif sahadan ESU cihazına -----
            // Kalem kablosu (mavi) cerrahi alandan ESU'ya (z=+1.95, x=-1.45)
            root.add(tubeFrom([
                [-0.40, 1.110, -0.20], [-0.55, 1.060, 0.10], [-0.85, 1.000, 0.50],
                [-1.15, 0.950, 1.10], [-1.35, 0.910, 1.55], [-1.45, 0.890, 1.95]
            ], 0.008, M.tubeBlue, 40));
            // REM hasta plakası (sağ uyluk drape altı simgesi) → ESU
            root.add(bx(0.16, 0.010, 0.10, M.drapeLight, 0.20, 0.945, 0.95));
            root.add(tubeFrom([
                [0.20, 0.945, 0.95], [-0.20, 0.920, 1.30], [-0.70, 0.900, 1.60],
                [-1.20, 0.890, 1.85], [-1.45, 0.890, 1.95]
            ], 0.007, M.tubeDark, 36));

            // 6) Integrated instrument surface
            root.add(bx(0.64, 0.05, 0.44, M.brushed, 0.92, 0.84, 0.88));
            root.add(bx(0.60, 0.026, 0.40, M.drapeDark, 0.92, 0.885, 0.88));
            for (let i = 0; i < 5; i++) {
                root.add(rodBetween(
                    new THREE.Vector3(0.70 + i * 0.10, 0.915, 0.78),
                    new THREE.Vector3(0.74 + i * 0.10, 0.915, 1.02),
                    0.006, M.steel, 12
                ));
            }
            root.add(cy(0.055, 0.045, 0.035, M.steel, 1.13, 0.92, 0.78, 24));
            root.add(cy(0.055, 0.045, 0.035, M.steel, 1.26, 0.92, 0.80, 24));
            root.add(bx(0.16, 0.030, 0.11, M.whiteTape, 1.18, 0.915, 1.02));

            root.traverse(obj => {
                if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }
            });
            return root;
        }

        function buildAnaesthesiaWorkstationV151(x, y, z) {
            // ULTRA-PREMIUM ANAESTHESIA WORKSTATION v8.3
            // GE Aisys CS² / Dräger Perseus A500 / Mindray A9 referanslı modern
            // entegre anestezi platformu + büyük hemodinami monitörü.
            //
            // Premium yenilikler:
            //   - Aero-form kavisli base (köşeli kutu yerine)
            //   - Çift dokunmatik üst ekran (vaporizör + akış)
            //   - Ayrı premium boom monitörü (sağ yan, yüksek)
            //   - 3 vaporizör (Sevo/Des/Iso renkli + LED)
            //   - Premium kontrol paneli (fizik buton + dokunmatik)
            //   - Solunum devresi (transparan tüpler)
            //   - 4 katmanlı premium ilaç çekmeceleri
            //   - O₂ silindiri (yeşil tepelik)
            //   - 4 anti-static tekerlek (krom hub + kilit pedal)
            //   - Boydan boya turkuaz LED accent şeridleri
            const g = groupAt(x, y, z);
            // === +60° rotasyon — cihaz hasta başına 60°'lik açıyla yönelir ===
            // Three.js Y-axis: pozitif değer CCW (üstten bakış). Cihaz orijinal
            // halinde yüzü +z'ye bakar; +60° ile yüzü hastaya doğru (+x ağırlıklı) döner.
            g.rotation.y = Math.PI / 3;
            const chromeMat = { metalness: 0.55, roughness: 0.18 };
            const matteCarbon = { metalness: 0.20, roughness: 0.42 };
            const glossWhite = { metalness: 0.30, roughness: 0.14 };
            
            // ===========================================================
            // ALT TABAN + TEKERLEKLER
            // ===========================================================
            // Ana taban (krom + siyah)
            g.add(box(1.20, 0.10, 0.74, 0x1a2230, 0, 0.05, 0, { 
                metalness: 0.20, roughness: 0.40 
            }));
            // Üst accent şeridi
            g.add(box(1.12, 0.014, 0.74, 0x4cd6c4, 0, 0.107, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.34 
            }));
            // 4 premium tekerlek
            [-0.50, 0.50].forEach(xx => [-0.30, 0.30].forEach(zz => {
                const w = cyl(0.054, 0.054, 0.038, 0x1a2230, xx, 0.054, zz, { 
                    seg: 16, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
                const hub = cyl(0.026, 0.026, 0.042, 0xc7d3dc, xx, 0.054, zz, { 
                    seg: 14, metalness: 0.65, roughness: 0.16 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
                // Kilit pedal LED
                g.add(cyl(0.010, 0.010, 0.012, 0x4cb88a, xx, 0.054, 
                    zz + (zz > 0 ? 0.060 : -0.060), { 
                    seg: 10, emissive: 0x4cb88a, emissiveIntensity: 0.55 
                }));
            }));
            
            // ===========================================================
            // ANA GÖVDE (aero-form kavisli, premium)
            // ===========================================================
            // Alt geniş kasa (modern beyaz)
            g.add(box(1.16, 0.42, 0.68, 0xeef3f7, 0, 0.31, 0, { 
                metalness: 0.20, roughness: 0.20 
            }));
            // Alt accent (turkuaz boylu boyunca)
            g.add(box(1.10, 0.014, 0.68, 0x4cd6c4, 0, 0.520, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.32 
            }));
            // Üst gövde (siyah-mavi premium)
            g.add(box(1.16, 0.74, 0.68, 0x1c2c3a, 0, 0.91, 0, { 
                metalness: 0.18, roughness: 0.32 
            }));
            // Üst accent
            g.add(box(1.10, 0.014, 0.68, 0x4cd6c4, 0, 1.286, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.40 
            }));
            // Yan ventilasyon ızgarası (sol)
            g.add(box(0.020, 0.50, 0.40, 0x0e1821, -0.586, 0.91, 0, { 
                roughness: 0.40 
            }));
            [0.74, 0.84, 0.94, 1.04, 1.14].forEach(yy => {
                g.add(box(0.024, 0.012, 0.36, 0x2a3540, -0.586, yy, 0, { roughness: 0.38 }));
            });
            
            // ===========================================================
            // ÜST ÇİFT EKRAN (premium dokunmatik)
            // ===========================================================
            // SOL EKRAN — Vaporizör + gaz değerleri
            g.add(box(0.46, 0.34, 0.030, 0x0a1418, -0.26, 1.18, 0.355, { 
                roughness: 0.16, emissive: 0x0a1418, emissiveIntensity: 0.08 
            }));
            // Aktif ekran (turkuaz)
            g.add(box(0.42, 0.30, 0.018, 0x2aaec1, -0.26, 1.18, 0.371, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.50 
            }));
            // Vaporizör 3 LED bantları (Sevo yeşil / Des sarı / Iso kırmızı)
            [-0.10, -0.030, 0.040, 0.110].forEach((yy, i) => {
                if (i < 3) {
                    g.add(box(0.34, 0.022, 0.018, [0x4cb88a, 0xe0a558, 0xd96371][i], 
                        -0.26, 1.18 + yy, 0.376, { 
                        emissive: [0x4cb88a, 0xe0a558, 0xd96371][i], emissiveIntensity: 0.45 
                    }));
                }
            });
            // Vaporizör değer numaraları (mini LED bloklar)
            g.add(box(0.10, 0.030, 0.014, 0xfafdff, -0.36, 1.230, 0.378, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            
            // SAĞ EKRAN — Akış ölçer + ventilatör grafiği
            g.add(box(0.46, 0.34, 0.030, 0x0a1418, 0.26, 1.18, 0.355, { 
                roughness: 0.16, emissive: 0x0a1418, emissiveIntensity: 0.08 
            }));
            g.add(box(0.42, 0.30, 0.018, 0x6f9fd8, 0.26, 1.18, 0.371, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.50 
            }));
            // Ventilatör dalga grafiği (zikzak görünümü)
            [-0.08, -0.04, 0, 0.04, 0.08].forEach((dx, i) => {
                const dy = (i % 2 === 0) ? 0.040 : -0.020;
                g.add(box(0.020, 0.014, 0.014, 0xfff8d4, 
                    0.26 + dx, 1.18 + dy, 0.376, { 
                    emissive: 0xfff8d4, emissiveIntensity: 0.65 
                }));
            });
            
            // ===========================================================
            // 3 VAPORIZÖR (alt sıra — Sevo/Des/Iso)
            // ===========================================================
            [-0.34, 0, 0.34].forEach((xx, i) => {
                const colors = [0x4cb88a, 0xe0a558, 0xd96371];
                const labels = ['Sevo', 'Des', 'Iso'];
                // Kasası (silindirik)
                g.add(cyl(0.060, 0.060, 0.20, 0x4a5e72, xx, 0.74, 0.32, { 
                    seg: 18, metalness: 0.40, roughness: 0.22 
                }));
                // Üst aktif renk band
                g.add(cyl(0.062, 0.062, 0.020, colors[i], xx, 0.84, 0.32, { 
                    seg: 18, emissive: colors[i], emissiveIntensity: 0.55 
                }));
                // Yan etiket
                g.add(box(0.04, 0.06, 0.014, colors[i], xx, 0.74, 0.380, { 
                    emissive: colors[i], emissiveIntensity: 0.40 
                }));
                // Yoğunluk göstergesi (mini ekran)
                g.add(box(0.030, 0.020, 0.014, 0xfafdff, xx, 0.78, 0.380, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.30 
                }));
            });
            
            // ===========================================================
            // BOOM MONİTÖRÜ v4 — Mafsal-1 SOL-arka köşeye taşındı (karşı köşe)
            // Boom kolu mafsal-1'den karşı yöne (sağa) açılır, monitör cihazın
            // sağ-arka tarafında durur.
            // ===========================================================
            // Boom dikey segment (cihazın SOL-üst-arka köşesinden yukarı uzanır)
            g.add(cyl(0.026, 0.026, 0.50, 0x6f8798, -0.50, 1.50, -0.28, { 
                seg: 16, metalness: 0.55, roughness: 0.18 
            }));
            // Üst flanş (kolonun tepesinde dekoratif kelepçe)
            g.add(cyl(0.034, 0.034, 0.018, 0xc7d3dc, -0.50, 1.76, -0.28, { 
                seg: 18, metalness: 0.78, roughness: 0.14 
            }));
            // ----- MENTEŞE 1 (cihaz tarafı eklem — sol-arka, yüksek pivot) -----
            g.add(sphere(0.054, 0x707b86, -0.50, 1.66, -0.28, { 
                metalness: 0.62, roughness: 0.34 
            }));
            const _hinge1Ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.052, 0.0034, 10, 28),
                new THREE.MeshStandardMaterial({ color: 0x9aa6b2, metalness: 0.78, roughness: 0.20 })
            );
            _hinge1Ring.position.set(-0.50, 1.66, -0.28);
            _hinge1Ring.rotation.x = Math.PI / 2;
            _hinge1Ring.castShadow = true; _hinge1Ring.receiveShadow = true;
            g.add(_hinge1Ring);
            // Mafsal accent ikinci halka
            const _hinge1Ring2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.060, 0.0024, 8, 24),
                new THREE.MeshStandardMaterial({ color: 0x4cd6c4, emissive: 0x4cd6c4, emissiveIntensity: 0.45 })
            );
            _hinge1Ring2.position.set(-0.50, 1.62, -0.28);
            _hinge1Ring2.rotation.x = Math.PI / 2;
            _hinge1Ring2.castShadow = true; _hinge1Ring2.receiveShadow = true;
            g.add(_hinge1Ring2);
            
            // ===== DÖNEN GRUP: uzun yatay kol + mafsal-2 + monitör =====
            // Pivot mafsal-1 (sol-üst-arka). 180° rotasyon — boom mafsal-1'den
            // KARŞI tarafa (sola/dışa) açılır; monitör cihazın sol-dışında durur.
            const _boomGrp = new THREE.Group();
            _boomGrp.position.set(-0.50, 1.66, -0.28);
            _boomGrp.rotation.y = Math.PI;   // 180° → boom karşı tarafa açılır
            g.add(_boomGrp);

            // UZUN yatay kol KISALTILDI (1.00 → 0.40 birim) — monitör hastaya yaklaşır
            // Ek olarak hafif Z ofseti ile öne (hasta tarafına) eğim verildi
            const _boomArm = new THREE.Mesh(
                new THREE.BoxGeometry(0.40, 0.040, 0.040),
                new THREE.MeshStandardMaterial({ color: 0xb8c4cf, metalness: 0.65, roughness: 0.16 })
            );
            _boomArm.position.set(0.20, 0, -0.20);   // grup içinde, açılı (öne doğru)
            _boomArm.rotation.y = -Math.PI / 4;       // 45° hasta tarafına açılı
            _boomArm.castShadow = true; _boomArm.receiveShadow = true;
            _boomGrp.add(_boomArm);
            // Boom kolu LED accent
            const _boomLED = new THREE.Mesh(
                new THREE.BoxGeometry(0.36, 0.006, 0.012),
                new THREE.MeshStandardMaterial({ color: 0x4cd6c4, emissive: 0x4cd6c4, emissiveIntensity: 0.55 })
            );
            _boomLED.position.set(0.20, 0.024, -0.20);
            _boomLED.rotation.y = -Math.PI / 4;
            _boomGrp.add(_boomLED);

            // İkinci segment (mafsal-2 hastaya yakın konumda)
            const _hinge2Ball = new THREE.Mesh(
                new THREE.SphereGeometry(0.050, 18, 14),
                new THREE.MeshStandardMaterial({ color: 0x707b86, metalness: 0.62, roughness: 0.34 })
            );
            _hinge2Ball.position.set(0.40, 0, -0.40);   // grup içinde, açılı uçta
            _hinge2Ball.castShadow = true; _hinge2Ball.receiveShadow = true;
            _boomGrp.add(_hinge2Ball);
            
            const _hinge2Ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.048, 0.0030, 10, 26),
                new THREE.MeshStandardMaterial({ color: 0x9aa6b2, metalness: 0.78, roughness: 0.20 })
            );
            _hinge2Ring.position.set(0.40, 0, -0.40);
            _hinge2Ring.rotation.x = Math.PI / 2;
            _hinge2Ring.castShadow = true; _hinge2Ring.receiveShadow = true;
            _boomGrp.add(_hinge2Ring);
            // Glow accent
            const _hinge2Ring2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.056, 0.0022, 8, 22),
                new THREE.MeshStandardMaterial({ color: 0x4cd6c4, emissive: 0x4cd6c4, emissiveIntensity: 0.45 })
            );
            _hinge2Ring2.position.set(0.40, -0.04, -0.40);
            _hinge2Ring2.rotation.x = Math.PI / 2;
            _boomGrp.add(_hinge2Ring2);
            
            // ===== MONİTÖR — _boomGrp içinde, mafsal-2 noktasından sarkar =====
            // Cihaz +60° + boom 180° + monitör rotasyonu = ekran hastaya/teknisyene yönelir.
            // Monitörü mafsal-2 ile aynı konumda tut.
            const _monitorGrp = new THREE.Group();
            _monitorGrp.position.set(0.40, 0, -0.40);
            _monitorGrp.rotation.y = -Math.PI / 4;     // -45° → ekran hasta/teknisyene bakar
            _boomGrp.add(_monitorGrp);

            // Çerçeve (büyütüldü ve premium)
            const _frame = new THREE.Mesh(
                new THREE.BoxGeometry(0.034, 0.54, 0.72),
                new THREE.MeshStandardMaterial({ color: 0x0a1218, roughness: 0.20, metalness: 0.30 })
            );
            _frame.position.set(-0.02, -0.18, 0);
            _frame.castShadow = true; _frame.receiveShadow = true;
            _monitorGrp.add(_frame);
            // Çerçeve etrafı brushed accent
            const _frameAccent = new THREE.Mesh(
                new THREE.BoxGeometry(0.028, 0.50, 0.68),
                new THREE.MeshStandardMaterial({ color: 0x4a5e72, metalness: 0.55, roughness: 0.25 })
            );
            _frameAccent.position.set(-0.025, -0.18, 0);
            _frameAccent.castShadow = true; _frameAccent.receiveShadow = true;
            _monitorGrp.add(_frameAccent);

            // Aktif ekran (premium dark teal)
            const _screen = new THREE.Mesh(
                new THREE.BoxGeometry(0.018, 0.46, 0.64),
                new THREE.MeshStandardMaterial({ color: 0x103040, emissive: 0x4cd6c4, emissiveIntensity: 0.45, roughness: 0.10 })
            );
            _screen.position.set(-0.040, -0.18, 0);
            _screen.castShadow = true; _screen.receiveShadow = true;
            _monitorGrp.add(_screen);

            // EKG dalga (yeşil)
            const _ekgWave = new THREE.Mesh(
                new THREE.BoxGeometry(0.022, 0.012, 0.52),
                new THREE.MeshStandardMaterial({ color: 0x4cb88a, emissive: 0x4cb88a, emissiveIntensity: 0.75 })
            );
            _ekgWave.position.set(-0.042, -0.02, 0);
            _ekgWave.castShadow = true; _ekgWave.receiveShadow = true;
            _monitorGrp.add(_ekgWave);
            // EKG zikzak
            [-0.20, -0.10, 0, 0.10, 0.20].forEach((dz, i) => {
                const dy = (i % 2 === 0) ? 0.030 : -0.018;
                const _zigzag = new THREE.Mesh(
                    new THREE.BoxGeometry(0.020, 0.014, 0.014),
                    new THREE.MeshStandardMaterial({ color: 0x4cb88a, emissive: 0x4cb88a, emissiveIntensity: 0.85 })
                );
                _zigzag.position.set(-0.042, -0.02 + dy, dz);
                _monitorGrp.add(_zigzag);
            });

            // SpO2 dalga (kırmızı)
            const _spo2Wave = new THREE.Mesh(
                new THREE.BoxGeometry(0.022, 0.012, 0.52),
                new THREE.MeshStandardMaterial({ color: 0xd96371, emissive: 0xd96371, emissiveIntensity: 0.65 })
            );
            _spo2Wave.position.set(-0.042, -0.14, 0);
            _spo2Wave.castShadow = true; _spo2Wave.receiveShadow = true;
            _monitorGrp.add(_spo2Wave);

            // Arteriyel basınç dalga (sarı)
            const _bpWave = new THREE.Mesh(
                new THREE.BoxGeometry(0.022, 0.012, 0.52),
                new THREE.MeshStandardMaterial({ color: 0xe0a558, emissive: 0xe0a558, emissiveIntensity: 0.65 })
            );
            _bpWave.position.set(-0.042, -0.26, 0);
            _bpWave.castShadow = true; _bpWave.receiveShadow = true;
            _monitorGrp.add(_bpWave);

            // CO2 dalga (mavi - kapnografi)
            const _co2Wave = new THREE.Mesh(
                new THREE.BoxGeometry(0.022, 0.012, 0.52),
                new THREE.MeshStandardMaterial({ color: 0x6f9fd8, emissive: 0x6f9fd8, emissiveIntensity: 0.65 })
            );
            _co2Wave.position.set(-0.042, -0.38, 0);
            _co2Wave.castShadow = true; _co2Wave.receiveShadow = true;
            _monitorGrp.add(_co2Wave);

            // Sağ köşe: rakam panelleri (HR / SpO2 / BP / TEMP)
            const _hrVal = new THREE.Mesh(
                new THREE.BoxGeometry(0.024, 0.06, 0.12),
                new THREE.MeshStandardMaterial({ color: 0x4cb88a, emissive: 0x4cb88a, emissiveIntensity: 0.85 })
            );
            _hrVal.position.set(-0.044, -0.02, 0.26);
            _monitorGrp.add(_hrVal);
            const _spo2Val = new THREE.Mesh(
                new THREE.BoxGeometry(0.024, 0.05, 0.12),
                new THREE.MeshStandardMaterial({ color: 0xd96371, emissive: 0xd96371, emissiveIntensity: 0.75 })
            );
            _spo2Val.position.set(-0.044, -0.14, 0.26);
            _monitorGrp.add(_spo2Val);
            const _bpVal = new THREE.Mesh(
                new THREE.BoxGeometry(0.024, 0.05, 0.12),
                new THREE.MeshStandardMaterial({ color: 0xe0a558, emissive: 0xe0a558, emissiveIntensity: 0.75 })
            );
            _bpVal.position.set(-0.044, -0.26, 0.26);
            _monitorGrp.add(_bpVal);
            const _tempVal = new THREE.Mesh(
                new THREE.BoxGeometry(0.024, 0.04, 0.12),
                new THREE.MeshStandardMaterial({ color: 0x6f9fd8, emissive: 0x6f9fd8, emissiveIntensity: 0.75 })
            );
            _tempVal.position.set(-0.044, -0.38, 0.26);
            _monitorGrp.add(_tempVal);

            // Üst marka şeridi (PHILIPS / GE / Mindray etc. — beyaz LED şerit)
            const _brand = new THREE.Mesh(
                new THREE.BoxGeometry(0.026, 0.018, 0.16),
                new THREE.MeshStandardMaterial({ color: 0xfafdff, emissive: 0xfafdff, emissiveIntensity: 0.55 })
            );
            _brand.position.set(-0.046, 0.18, -0.22);
            _monitorGrp.add(_brand);

            // Alt dokunmatik kontrol şeridi
            const _touchBar = new THREE.Mesh(
                new THREE.BoxGeometry(0.044, 0.04, 0.60),
                new THREE.MeshStandardMaterial({ color: 0x1a2230, metalness: 0.20, roughness: 0.40 })
            );
            _touchBar.position.set(-0.030, -0.50, 0);
            _monitorGrp.add(_touchBar);
            const _touchActive = new THREE.Mesh(
                new THREE.BoxGeometry(0.024, 0.020, 0.50),
                new THREE.MeshStandardMaterial({ color: 0x2aaec1, emissive: 0x4cd6c4, emissiveIntensity: 0.65 })
            );
            _touchActive.position.set(-0.044, -0.50, 0);
            _monitorGrp.add(_touchActive);
            
            // ===========================================================
            // PREMIUM KONTROL PANELİ (orta ön yüz)
            // ===========================================================
            // Ana panel kasası
            g.add(box(0.80, 0.18, 0.024, 0x0e1821, 0, 0.70, 0.345, { 
                roughness: 0.20, metalness: 0.18 
            }));
            // Aktif dokunmatik bölüm
            g.add(box(0.50, 0.13, 0.020, 0x2aaec1, -0.10, 0.70, 0.359, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.45 
            }));
            // Fizik kontrol butonları (3 adet)
            [-0.32, -0.26, -0.20].forEach((xx, i) => {
                g.add(cyl(0.020, 0.020, 0.014, [0x4cb88a, 0xe0a558, 0xd96371][i], 
                    xx, 0.70, 0.359, { 
                    seg: 14, emissive: [0x4cb88a, 0xe0a558, 0xd96371][i], emissiveIntensity: 0.55 
                }));
            });
            // Acil durma butonu (kırmızı mantar)
            g.add(cyl(0.024, 0.024, 0.018, 0xd96371, 0.30, 0.70, 0.362, { 
                seg: 16, emissive: 0xd96371, emissiveIntensity: 0.50 
            }));
            
            // ===========================================================
            // 4 İLAÇ ÇEKMECELERİ (renk kodlu LED)
            // ===========================================================
            [0.20, 0.32, 0.44, 0.56].forEach((yy, idx) => {
                const colors = [0xd96371, 0xe0a558, 0x4cb88a, 0x6f9fd8];
                // Çekmece ön yüzü
                g.add(box(0.78, 0.090, 0.020, 0xeef3f7, 0, yy, 0.345, { 
                    metalness: 0.18, roughness: 0.30 
                }));
                // LED accent şerit
                g.add(box(0.74, 0.012, 0.014, colors[idx], 0, yy, 0.357, { 
                    emissive: colors[idx], emissiveIntensity: 0.50 
                }));
                // Çekmece kulpu
                g.add(box(0.18, 0.014, 0.014, 0x4a5e72, 0, yy, 0.358, { 
                    metalness: 0.40, roughness: 0.20 
                }));
                // Etiket
                g.add(box(0.10, 0.030, 0.012, 0xfafdff, -0.30, yy, 0.357, { roughness: 0.30 }));
            });
            
            // ===========================================================
            // GAZ SİLİNDİRLERİ (sol yan - O₂ yeşil tepelik)
            // ===========================================================
            // O₂ silindiri
            g.add(cyl(0.080, 0.080, 0.50, 0xeef3f7, -0.50, 0.32, 0.20, { 
                seg: 22, metalness: 0.30, roughness: 0.22 
            }));
            // Üst tepelik (yeşil = O₂)
            g.add(cyl(0.082, 0.082, 0.040, 0x4cb88a, -0.50, 0.580, 0.20, { 
                seg: 22, emissive: 0x4cb88a, emissiveIntensity: 0.55 
            }));
            // Vana
            g.add(cyl(0.024, 0.024, 0.030, 0x6f8798, -0.50, 0.620, 0.20, { 
                seg: 14, metalness: 0.50, roughness: 0.20 
            }));
            // Etiket
            g.add(box(0.05, 0.10, 0.014, 0xfafdff, -0.50, 0.40, 0.295, { roughness: 0.55 }));
            // O2 yazısı (yeşil)
            g.add(box(0.030, 0.026, 0.014, 0x4cb88a, -0.50, 0.40, 0.302, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.45 
            }));
            
            // N₂O silindiri (mavi tepelik)
            g.add(cyl(0.060, 0.060, 0.40, 0xeef3f7, -0.50, 0.28, -0.20, { 
                seg: 18, metalness: 0.30, roughness: 0.22 
            }));
            g.add(cyl(0.062, 0.062, 0.030, 0x6f9fd8, -0.50, 0.490, -0.20, { 
                seg: 18, emissive: 0x6f9fd8, emissiveIntensity: 0.55 
            }));
            
            // ===========================================================
            // SOLUNUM DEVRESİ (transparan tüpler — modern Y-set)
            // ===========================================================
            // Tüp 1 (sağ yan dışından)
            const breathTube = cyl(0.018, 0.018, 0.50, 0xa8d4df, 0.50, 1.00, 0.34, { 
                seg: 14, transparent: true, opacity: 0.55, roughness: 0.30 
            });
            breathTube.rotation.z = -0.30;
            g.add(breathTube);
            // Tüp 2 (alt çıkış)
            const breathTube2 = cyl(0.018, 0.018, 0.40, 0xa8d4df, 0.55, 0.80, 0.32, { 
                seg: 14, transparent: true, opacity: 0.55, roughness: 0.30 
            });
            breathTube2.rotation.z = 0.50;
            g.add(breathTube2);
            
            // Y bağlantısı (3 yollu)
            g.add(sphere(0.025, 0x4a5e72, 0.58, 0.95, 0.34, { 
                metalness: 0.45, roughness: 0.20 
            }));

            // ===========================================================
            // PREMIUM MODERNIZASYON KATMANI v9.8
            // Estetik yenilemeler — geometri değişmez, sadece üst katman.
            // ===========================================================

            // ---- Yan logo paneli (sağ yan, modern minimal "ANEST" etiketi) ----
            // Cihaz +60° döndüğü için "yan" görünür kısmı sağ-arka olur
            g.add(box(0.014, 0.10, 0.18, 0x0a1418, 0.586, 0.62, -0.18, { 
                metalness: 0.30, roughness: 0.20 
            }));
            g.add(box(0.018, 0.040, 0.10, 0x4cd6c4, 0.586, 0.64, -0.18, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.55 
            }));

            // ---- Alt taban perimetric LED accent şeritleri ----
            // Ön kenar boyunca turkuaz LED şerit
            g.add(box(1.10, 0.008, 0.014, 0x4cd6c4, 0, 0.105, 0.337, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.65 
            }));
            // Arka kenar boyunca turkuaz LED şerit
            g.add(box(1.10, 0.008, 0.014, 0x4cd6c4, 0, 0.105, -0.337, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.45 
            }));
            // Sol yan LED accent (cihaz dönünce daha görünür olan kenar)
            g.add(box(0.014, 0.008, 0.66, 0x4cd6c4, -0.586, 0.105, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.55 
            }));

            // ---- Üst tepelik chrome bar (premium accent) ----
            g.add(box(1.04, 0.024, 0.040, 0xc7d3dc, 0, 1.412, 0.30, { 
                metalness: 0.70, roughness: 0.14 
            }));
            g.add(box(1.04, 0.024, 0.040, 0xc7d3dc, 0, 1.412, -0.30, { 
                metalness: 0.70, roughness: 0.14 
            }));

            // ---- Status LED kümesi (sağ üst köşe, sistem durumu) ----
            // Power (yeşil), Network (mavi), Alarm (sarı), Service (kırmızı)
            [
                { c: 0x4cb88a, dx:  0.42 },  // Power
                { c: 0x6f9fd8, dx:  0.46 },  // Network
                { c: 0xe0a558, dx:  0.50 },  // Alarm
                { c: 0xd96371, dx:  0.54 }   // Service
            ].forEach(s => {
                g.add(cyl(0.0070, 0.0070, 0.006, s.c, s.dx, 1.405, 0.342, {
                    seg: 12, emissive: s.c, emissiveIntensity: 0.75
                }));
            });

            // ---- USB-C / data port modülü (orta üst, modern interface) ----
            g.add(box(0.10, 0.06, 0.014, 0x0a1418, -0.05, 1.05, 0.354, {
                metalness: 0.30, roughness: 0.30
            }));
            // 3 USB-C port LED'i
            [-0.030, 0, 0.030].forEach(dx => {
                g.add(box(0.016, 0.004, 0.006, 0x4cd6c4, -0.05 + dx, 1.05, 0.362, {
                    emissive: 0x4cd6c4, emissiveIntensity: 0.55
                }));
            });

            // ---- E-stop (acil durdurma) — kırmızı mantar buton, sağ ön ----
            g.add(cyl(0.034, 0.034, 0.030, 0xd96371, 0.42, 1.05, 0.345, {
                seg: 18, emissive: 0xd96371, emissiveIntensity: 0.45,
                metalness: 0.20, roughness: 0.40
            }));
            // E-stop sarı uyarı halkası
            g.add(cyl(0.040, 0.040, 0.008, 0xe0a558, 0.42, 1.034, 0.345, {
                seg: 22, emissive: 0xe0a558, emissiveIntensity: 0.55
            }));

            // ---- Ön panel marka şeridi (brushed metal + turkuaz LED) ----
            g.add(box(0.30, 0.020, 0.014, 0xa7b7c4, 0, 0.620, 0.343, {
                metalness: 0.65, roughness: 0.18
            }));
            g.add(box(0.10, 0.008, 0.014, 0x4cd6c4, 0, 0.620, 0.350, {
                emissive: 0x4cd6c4, emissiveIntensity: 0.60
            }));

            // ---- Wireless/Bluetooth indicator (üst sol, mavi pulse LED) ----
            g.add(cyl(0.010, 0.010, 0.006, 0x6f9fd8, -0.42, 1.405, 0.342, {
                seg: 14, emissive: 0x6f9fd8, emissiveIntensity: 0.65
            }));

            // ---- Vakum/Vacuum portu (sağ alt yan, klinik gerçekçilik) ----
            g.add(cyl(0.018, 0.018, 0.014, 0x2e3944, 0.55, 0.40, 0.343, {
                seg: 14, metalness: 0.30, roughness: 0.40
            }));
            g.add(cyl(0.012, 0.012, 0.008, 0x0a1418, 0.55, 0.40, 0.349, {
                seg: 12, roughness: 0.50
            }));

            // ---- HASTA BAĞLANTI INLET PANELİ (sol yan duvar, hortumların girdiği yer) ----
            // Hortumların cihaza girdiği görsel pano: 6 renk kodlu port + paslanmaz çerçeve
            // Cihaz gerçek sol duvarı local x=-0.58 (gövde genişliği 1.16 birim)
            // Çerçeve plaka (-x yönünde dışa bakar)
            g.add(box(0.014, 0.18, 0.20, 0x0a1418, -0.587, 0.22, 0, {
                metalness: 0.30, roughness: 0.30
            }));
            // Brushed metal arka plaka
            g.add(box(0.012, 0.16, 0.18, 0x4a5e72, -0.589, 0.22, 0, {
                metalness: 0.55, roughness: 0.25
            }));
            // 6 inlet port (renk kodlu) — hortum uçlarının girdiği delikler
            [
                { c: 0x6f9fd8, dy:  0.06, dz: -0.06, r: 0.020 },  // Insp port (büyük)
                { c: 0x4a5e72, dy: -0.02, dz: -0.06, r: 0.020 },  // Exp port (büyük)
                { c: 0x6f9fd8, dy:  0.06, dz:  0.04, r: 0.010 },  // SpO2 port
                { c: 0x2e3944, dy: -0.02, dz:  0.05, r: 0.013 },  // NIBP port
                { c: 0x4cb88a, dy:  0.06, dz:  0.00, r: 0.014 },  // EKG hub (yeşil)
                { c: 0xeae8df, dy: -0.06, dz: -0.02, r: 0.010 }   // Temp port (krem)
            ].forEach(p => {
                // Port deliği (koyu iç)
                g.add(cyl(p.r, p.r, 0.008, 0x0a1418, -0.591, 0.22 + p.dy, p.dz, {
                    seg: 16, roughness: 0.65
                }));
                // Port halkası (renk kodlu kenar)
                const _ring = new THREE.Mesh(
                    new THREE.TorusGeometry(p.r + 0.003, 0.0022, 6, 18),
                    new THREE.MeshStandardMaterial({
                        color: p.c, emissive: p.c, emissiveIntensity: 0.55,
                        metalness: 0.50, roughness: 0.30
                    })
                );
                _ring.position.set(-0.589, 0.22 + p.dy, p.dz);
                _ring.rotation.y = Math.PI / 2;
                _ring.castShadow = true; _ring.receiveShadow = true;
                g.add(_ring);
            });
            // "PATIENT CONNECT" etiketi (üstte küçük turkuaz LED şerit)
            g.add(box(0.016, 0.012, 0.10, 0x4cd6c4, -0.591, 0.32, 0, {
                emissive: 0x4cd6c4, emissiveIntensity: 0.60
            }));

            // ---- Gaz outlet portları (üst-arka panel, renk kodlu medikal gaz) ----
            // O2 (beyaz/yeşil), N2O (mavi), Air (siyah/sarı), Vacuum (sarı)
            [
                { c: 0x4cb88a, dx: -0.28 },  // O2 yeşil
                { c: 0x6f9fd8, dx: -0.20 },  // N2O mavi
                { c: 0xe0a558, dx: -0.12 },  // Air sarı
                { c: 0xfafdff, dx: -0.04 }   // Vac beyaz
            ].forEach(p => {
                g.add(cyl(0.012, 0.012, 0.014, p.c, p.dx, 1.20, -0.337, {
                    seg: 12, emissive: p.c, emissiveIntensity: 0.30,
                    metalness: 0.40, roughness: 0.30
                }));
            });

            // ---- UTILITY INLET PANEL (arka panel, alt — pendant kablolarının girdiği yer) ----
            // Pendant'tan inen 6 kablo (O2, Air, Vacuum, AGSS, Power, Data) burada cihaza giriyor.
            // Çerçeve plaka (-z yönünde dışa bakar)
            g.add(box(0.32, 0.20, 0.014, 0x0a1418, 0.05, 0.32, -0.343, {
                metalness: 0.30, roughness: 0.30
            }));
            // Brushed metal arka plaka
            g.add(box(0.30, 0.18, 0.012, 0x4a5e72, 0.05, 0.32, -0.341, {
                metalness: 0.55, roughness: 0.25
            }));
            // 6 utility port (renk kodlu) — pendant kablolarının girdiği delikler
            [
                { c: 0x4cb88a, dx: -0.07, dy:  0.04, r: 0.014 },  // O2 yeşil
                { c: 0x6f9fd8, dx: -0.02, dy:  0.04, r: 0.014 },  // Air mavi
                { c: 0xe0a558, dx:  0.03, dy:  0.04, r: 0.014 },  // Vacuum sarı
                { c: 0x9c5cd9, dx:  0.08, dy:  0.04, r: 0.014 },  // AGSS mor
                { c: 0x2e3944, dx: -0.05, dy: -0.04, r: 0.012 },  // Power gri
                { c: 0x2e3944, dx:  0.05, dy: -0.04, r: 0.010 }   // Data gri
            ].forEach(p => {
                // Port deliği (koyu iç)
                g.add(cyl(p.r, p.r, 0.008, 0x0a1418, p.dx + 0.05, 0.32 + p.dy, -0.347, {
                    seg: 16, roughness: 0.65
                }));
                // Port halkası (renk kodlu)
                const _ring = new THREE.Mesh(
                    new THREE.TorusGeometry(p.r + 0.003, 0.0022, 6, 18),
                    new THREE.MeshStandardMaterial({
                        color: p.c, emissive: p.c, emissiveIntensity: 0.55,
                        metalness: 0.50, roughness: 0.30
                    })
                );
                _ring.position.set(p.dx + 0.05, 0.32 + p.dy, -0.345);
                _ring.rotation.y = Math.PI / 2;
                _ring.castShadow = true; _ring.receiveShadow = true;
                g.add(_ring);
            });
            // "UTILITY" etiketi (üstte küçük turkuaz LED şerit)
            g.add(box(0.10, 0.012, 0.006, 0x4cd6c4, 0.05, 0.43, -0.347, {
                emissive: 0x4cd6c4, emissiveIntensity: 0.60
            }));

            // ===========================================================
            // ANATOMİK MODERNİZASYON v9.13 — klinik gerçekçilik artırıcılar
            // ===========================================================

            // ---- TOP-MOUNT REZERVUARLAR (üst tepelik — emiş + gaz analiz şişesi) ----
            // Sol üst: vakum/emiş şeffaf rezervuar (gerçek anestezi cihazlarında bulunur)
            g.add(cyl(0.060, 0.060, 0.16, 0xc7dbe6, -0.32, 1.40, 0.18, {
                seg: 22, metalness: 0.04, roughness: 0.20,
                emissive: 0x88c9e0, emissiveIntensity: 0.06
            }));
            // İçinde sıvı seviye göstergesi (sarımsı sıvı simülasyonu)
            g.add(cyl(0.052, 0.052, 0.06, 0xe0a558, -0.32, 1.36, 0.18, {
                seg: 20, emissive: 0xe0a558, emissiveIntensity: 0.20,
                metalness: 0.10, roughness: 0.30
            }));
            // Üst kapak (krom)
            g.add(cyl(0.064, 0.064, 0.014, 0xc7d3dc, -0.32, 1.49, 0.18, {
                seg: 22, metalness: 0.78, roughness: 0.16
            }));
            // Çıkış borusu
            g.add(cyl(0.012, 0.012, 0.08, 0x6f8798, -0.32, 1.32, 0.10, {
                seg: 14, metalness: 0.55, roughness: 0.20
            }));

            // Sağ üst: Gaz analiz odası (sampling chamber, küçük cam silindir)
            g.add(cyl(0.040, 0.040, 0.12, 0xc7dbe6, 0.32, 1.42, 0.18, {
                seg: 20, metalness: 0.04, roughness: 0.20,
                emissive: 0x88c9e0, emissiveIntensity: 0.05
            }));
            // Aktif gaz örnek LED (içeride yanıp sönen gösterge)
            g.add(cyl(0.030, 0.030, 0.04, 0x4cd6c4, 0.32, 1.40, 0.18, {
                seg: 18, emissive: 0x4cd6c4, emissiveIntensity: 0.60
            }));
            // Üst kapak
            g.add(cyl(0.044, 0.044, 0.012, 0xc7d3dc, 0.32, 1.49, 0.18, {
                seg: 22, metalness: 0.78, roughness: 0.16
            }));

            // ---- BREATHING BAG (Y-piece altında asılı reservuar bag, klinik) ----
            // Anestezi devresi reservuar bag'i (siyah lateks görünümü)
            const _bag = new THREE.Mesh(
                new THREE.SphereGeometry(0.075, 18, 14),
                new THREE.MeshStandardMaterial({ color: 0x1a2230, roughness: 0.60, metalness: 0.04 })
            );
            _bag.position.set(0.55, 0.78, 0.34);
            _bag.scale.set(1.0, 1.4, 1.0);  // hafif uzun (reservoir bag formu)
            _bag.castShadow = true; _bag.receiveShadow = true;
            g.add(_bag);
            // Bag konnektörü (krom)
            g.add(cyl(0.015, 0.015, 0.04, 0xc7d3dc, 0.55, 0.92, 0.34, {
                seg: 14, metalness: 0.78, roughness: 0.16
            }));

            // ---- INTEGRATED SUCTION (cihazın sol-altında entegre emiş ünitesi) ----
            // Emiş regülatör paneli (analog gauge görünümü)
            g.add(cyl(0.038, 0.038, 0.020, 0x0e1821, -0.46, 0.70, 0.345, {
                seg: 22, metalness: 0.30, roughness: 0.30
            }));
            // Gauge yüzü
            g.add(cyl(0.030, 0.030, 0.006, 0xfafdff, -0.46, 0.70, 0.358, {
                seg: 20, emissive: 0xfafdff, emissiveIntensity: 0.30
            }));
            // İğne (kırmızı)
            g.add(box(0.004, 0.020, 0.003, 0xd96371, -0.46, 0.71, 0.362, {
                emissive: 0xd96371, emissiveIntensity: 0.65
            }));
            // Etiket: "VACUUM" (alt LED)
            g.add(box(0.04, 0.008, 0.004, 0x4cd6c4, -0.46, 0.66, 0.360, {
                emissive: 0x4cd6c4, emissiveIntensity: 0.50
            }));

            // ---- PREMIUM HANDLE BAR (cihazın üstünde tutma çubuğu — push handle) ----
            // Modern anestezi cihazlarında hep bulunur, manevra için
            g.add(cyl(0.018, 0.018, 0.40, 0xc7d3dc, -0.20, 1.46, 0.34, {
                seg: 16, metalness: 0.78, roughness: 0.14
            }));
            // Sol kelepçe (montaj noktası)
            g.add(cyl(0.024, 0.024, 0.030, 0x4a5e72, -0.40, 1.46, 0.34, {
                seg: 18, metalness: 0.55, roughness: 0.25
            }));
            // Sağ kelepçe
            g.add(cyl(0.024, 0.024, 0.030, 0x4a5e72, 0.00, 1.46, 0.34, {
                seg: 18, metalness: 0.55, roughness: 0.25
            }));
            // Kabarık tutma yastığı (silikon — siyah)
            g.add(cyl(0.022, 0.022, 0.34, 0x1a2230, -0.20, 1.46, 0.34, {
                seg: 16, roughness: 0.80, metalness: 0.04
            }));

            // ---- BREATHING CIRCUIT HOLDER (sağ yanda devre asma kancası) ----
            // Vertikal direk
            g.add(cyl(0.012, 0.012, 0.22, 0xc7d3dc, 0.55, 1.16, -0.10, {
                seg: 14, metalness: 0.78, roughness: 0.16
            }));
            // Üstte yatay kanca (asılan devre buraya gelir)
            g.add(cyl(0.012, 0.012, 0.10, 0xc7d3dc, 0.50, 1.27, -0.10, {
                seg: 14, metalness: 0.78, roughness: 0.16
            }));
            // Kanca ucu küre
            g.add(sphere(0.014, 0xc7d3dc, 0.45, 1.27, -0.10, {
                metalness: 0.80, roughness: 0.16
            }));

            // ---- BACK-PANEL HEAT EXHAUST (arka soğutma ızgarası) ----
            // Cihaz +60° döndüğü için arka panel z-negatif yöne bakıyor
            // Modern anestezi cihazlarında elektronik soğutma için ızgara olur
            g.add(box(0.50, 0.30, 0.014, 0x0e1821, 0.05, 1.05, -0.345, {
                roughness: 0.40, metalness: 0.20
            }));
            // 8 yatay havalandırma şeridi
            for (let i = 0; i < 8; i++) {
                g.add(box(0.46, 0.012, 0.004, 0x2a3540, 0.05, 0.94 + i * 0.030, -0.350, {
                    roughness: 0.40
                }));
            }
            // Soğutma fan göstergesi (mavi — aktif airflow)
            g.add(cyl(0.020, 0.020, 0.004, 0x4cd6c4, 0.30, 1.20, -0.350, {
                seg: 14, emissive: 0x4cd6c4, emissiveIntensity: 0.55, metalness: 0.30
            }));

            // ---- ALARM TOWER LIGHT (üst tepelik kırmızı/sarı/yeşil 3-katlı kule) ----
            // Modern medical cihazlarda alarm seviyesi için tower light bulunur
            g.add(cyl(0.014, 0.014, 0.020, 0x0e1821, 0.42, 1.41, -0.18, {
                seg: 16, roughness: 0.40
            }));
            // Yeşil katman (alttaki - normal durum aktif)
            g.add(cyl(0.022, 0.022, 0.022, 0x4cb88a, 0.42, 1.435, -0.18, {
                seg: 18, emissive: 0x4cb88a, emissiveIntensity: 0.85
            }));
            // Sarı katman (orta - uyarı)
            g.add(cyl(0.022, 0.022, 0.022, 0xe0a558, 0.42, 1.460, -0.18, {
                seg: 18, emissive: 0xe0a558, emissiveIntensity: 0.30
            }));
            // Kırmızı katman (üst - kritik alarm)
            g.add(cyl(0.022, 0.022, 0.022, 0xd96371, 0.42, 1.485, -0.18, {
                seg: 18, emissive: 0xd96371, emissiveIntensity: 0.20
            }));
            // Tepe konik kapak
            g.add(cyl(0.022, 0.005, 0.014, 0x0e1821, 0.42, 1.503, -0.18, {
                seg: 18, roughness: 0.40
            }));

            // ---- INTEGRATED CABLE MANAGEMENT TROUGH (sol-arka köşe, kablo organize kanalı) ----
            // Cihaz sol kenarında dikey alüminyum kablo kanalı
            g.add(box(0.040, 0.46, 0.018, 0x4a5e72, -0.594, 0.82, -0.20, {
                metalness: 0.55, roughness: 0.25
            }));
            // Kanalı kapayan cam panel (şeffaf)
            g.add(box(0.044, 0.46, 0.022, 0xc7dbe6, -0.598, 0.82, -0.20, {
                metalness: 0.04, roughness: 0.20,
                emissive: 0x88c9e0, emissiveIntensity: 0.04
            }));

            // ---- SHARPS BIN (atık kutusu, sol alt önde — kırmızı klinik görünüm) ----
            g.add(box(0.10, 0.14, 0.10, 0xd96371, -0.50, 0.21, 0.30, {
                metalness: 0.20, roughness: 0.40,
                emissive: 0xd96371, emissiveIntensity: 0.10
            }));
            // Üst kapak slot
            g.add(box(0.080, 0.012, 0.010, 0x0a1418, -0.50, 0.282, 0.34, {
                roughness: 0.50
            }));
            // Sharps simgesi (beyaz LED dikdörtgen)
            g.add(box(0.020, 0.010, 0.004, 0xfafdff, -0.50, 0.21, 0.355, {
                emissive: 0xfafdff, emissiveIntensity: 0.50
            }));

            return g;
        }


        function buildMayoStandV151(x, y, z) {
            // PREMIUM OVER-TABLE MAYO STAND v9.7
            // Gerçek cerrahi Mayo standı: tek offset kolon (scrub tarafında),
            // C-form düşük profilli stabil taban, ameliyat sahasına uzanan
            // satin paslanmaz çelik cantilever tepsi.
            // 
            // Materyal dili tavan lambasıyla uyumlu:
            //   - mat medikal beyaz, satin metal, fırçalanmış metal,
            //   - grafit teknik detay, parlak chrome veya neon yok.
            const g = groupAt(x, y, z);
            
            // === LOKAL PREMIUM MATERYAL PALETTE ===
            // Tavan lambasıyla aynı kalite seviyesinde
            const satinSteelMat = { metalness: 0.55, roughness: 0.30 };
            const brushedMetalMat = { metalness: 0.62, roughness: 0.26 };
            const graphiteMat = { metalness: 0.32, roughness: 0.50 };
            const matteSteelMat = { metalness: 0.48, roughness: 0.40 };
            
            // ==========================================================
            // C-FORM DÜŞÜK PROFİLLİ TABAN (5-yıldız değil!)
            // Scrub tarafında — kolon ile masa arasında stabilite
            // ==========================================================
            // Ana C-form taban (z eksenine uzun, x'te dar)
            // Kolon konumu z=-0.10 (Mayo grup orijinine göre arka)
            // Taban C-form: z=-0.30 → z=+0.10 arası uzun + x±0.20 yan kenarlar
            
            // Arka uzun ayak (Mayo'nun arka tarafı — daha stabil)
            g.add(box(0.40, 0.034, 0.040, 0x9aa6b2, 0, 0.022, -0.30, { 
                ...matteSteelMat 
            }));
            // Sol yan ayak (z=-0.30 → +0.10 arası uzun)
            g.add(box(0.040, 0.034, 0.42, 0x9aa6b2, -0.18, 0.022, -0.10, { 
                ...matteSteelMat 
            }));
            // Sağ yan ayak (Mayo cantilever tarafı — daha kısa, stabilite)
            g.add(box(0.040, 0.034, 0.42, 0x9aa6b2, 0.18, 0.022, -0.10, { 
                ...matteSteelMat 
            }));
            // Ön uç (kapatma — minimal)
            g.add(box(0.40, 0.034, 0.040, 0x9aa6b2, 0, 0.022, 0.10, { 
                ...matteSteelMat 
            }));
            
            // 4 küçük taban tampon (anti-static silikon ayak)
            [-0.18, 0.18].forEach(xx => [-0.30, 0.10].forEach(zz => {
                g.add(cyl(0.030, 0.034, 0.020, 0x2a3540, xx, 0.012, zz, { 
                    seg: 14, ...graphiteMat 
                }));
                // Anti-slip alt cap
                g.add(cyl(0.034, 0.034, 0.005, 0x1a2230, xx, 0.0025, zz, { 
                    seg: 12, roughness: 0.65 
                }));
            }));
            
            // Taban krom kapak (üst yüzey)
            g.add(box(0.36, 0.012, 0.36, 0xb8c1ca, 0, 0.044, -0.10, { 
                ...brushedMetalMat 
            }));
            
            // ==========================================================
            // TEK OFFSET KOLON (scrub tarafında - z=-0.10)
            // Yükseklik ayar mafsallı 2 segment
            // ==========================================================
            // Alt kalın kolon (paslanmaz çelik mat)
            g.add(cyl(0.034, 0.038, 0.50, 0x9aa6b2, 0, 0.30, -0.10, { 
                seg: 18, ...satinSteelMat 
            }));
            // Yükseklik ayar mafsalı (orta - premium detail)
            g.add(cyl(0.044, 0.044, 0.030, 0x4f5965, 0, 0.560, -0.10, { 
                seg: 22, ...graphiteMat 
            }));
            // Mafsal halka detayı (medikal mühendislik)
            const adjustRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.046, 0.0035, 6, 24),
                mat(0xb8c1ca, { ...brushedMetalMat })
            );
            adjustRing.rotation.x = Math.PI / 2;
            adjustRing.position.set(0, 0.560, -0.10);
            prepMesh(adjustRing); g.add(adjustRing);
            
            // Üst ince kolon
            g.add(cyl(0.026, 0.026, 0.46, 0xb8c1ca, 0, 0.808, -0.10, { 
                seg: 16, ...satinSteelMat 
            }));
            
            // ==========================================================
            // CANTILEVER ARM (kolondan +z yönüne uzanır)
            // ==========================================================
            // Üst yatay kol (kolondan masaya doğru uzanan arm)
            g.add(box(0.040, 0.034, 0.42, 0x9aa6b2, 0, 1.038, 0.06, { 
                ...satinSteelMat 
            }));
            // Cantilever üst eklem topu (kolon ucu)
            g.add(sphere(0.030, 0x707b86, 0, 1.038, -0.10, { ...graphiteMat }));
            // Tray bağlantı manşonu (cantilever ucunda)
            g.add(box(0.20, 0.030, 0.040, 0xb8c1ca, 0, 1.043, 0.22, { 
                ...brushedMetalMat 
            }));
            
            // ==========================================================
            // PASLANMAZ ÇELİK TRAY (cantilever — masaya doğru uzanan)
            // Tepsi merkezi z=+0.06 — masaya cantilever uzantı
            // Tepsi shallow rectangular tray + rolled rim
            // ==========================================================
            const TRAY_Y = 1.085;
            const TRAY_Z = 0.06;
            
            // Ana tray gövdesi (geniş satin paslanmaz)
            g.add(box(0.92, 0.020, 0.56, 0xc7d0d8, 0, TRAY_Y, TRAY_Z, { 
                metalness: 0.58, roughness: 0.32 
            }));
            // Tray üst yüzey (mat satin steel — premium)
            g.add(box(0.88, 0.012, 0.52, 0xd0d8df, 0, TRAY_Y + 0.016, TRAY_Z, { 
                metalness: 0.45, roughness: 0.26 
            }));
            
            // ROLLED RIM (yükseltilmiş ince kenarlar — gerçek Mayo tray özelliği)
            // Uzun kenar — ön
            g.add(box(0.92, 0.018, 0.012, 0xb8c1ca, 0, TRAY_Y + 0.018, TRAY_Z + 0.276, { 
                ...brushedMetalMat 
            }));
            // Uzun kenar — arka
            g.add(box(0.92, 0.018, 0.012, 0xb8c1ca, 0, TRAY_Y + 0.018, TRAY_Z - 0.276, { 
                ...brushedMetalMat 
            }));
            // Kısa kenar — sol
            g.add(box(0.012, 0.018, 0.55, 0xb8c1ca, -0.466, TRAY_Y + 0.018, TRAY_Z, { 
                ...brushedMetalMat 
            }));
            // Kısa kenar — sağ
            g.add(box(0.012, 0.018, 0.55, 0xb8c1ca, 0.466, TRAY_Y + 0.018, TRAY_Z, { 
                ...brushedMetalMat 
            }));
            
            // 4 köşe yumuşatma (rolled tarz)
            [-0.466, 0.466].forEach(xx => [TRAY_Z - 0.276, TRAY_Z + 0.276].forEach(zz => {
                g.add(cyl(0.012, 0.012, 0.018, 0xb8c1ca, xx, TRAY_Y + 0.018, zz, { 
                    seg: 12, ...brushedMetalMat 
                }));
            }));
            
            // ==========================================================
            // PREMIUM STERİL DRAPE — TÜM TEPSİYİ KAPLAR (modern Mayo)
            // Mavi cerrahi drape, kenarlardan sarkma, kıvrımlar
            // ==========================================================
            const drapeBlue = 0x1f6f95;
            const drapeBlueDark = 0x15536f;
            const drapeBlueLight = 0x2d8db8;

            // Ana drape örtü (üst yüzey — tüm tray)
            g.add(box(0.94, 0.012, 0.58, drapeBlue, 0, TRAY_Y + 0.030, TRAY_Z, {
                roughness: 0.82, metalness: 0.00
            }));
            // Drape kenar sarkmaları (4 kenar — premium katlanmış)
            g.add(box(0.94, 0.090, 0.014, drapeBlue, 0, TRAY_Y - 0.012, TRAY_Z + 0.295, { roughness: 0.82 }));
            g.add(box(0.94, 0.090, 0.014, drapeBlue, 0, TRAY_Y - 0.012, TRAY_Z - 0.295, { roughness: 0.82 }));
            g.add(box(0.014, 0.090, 0.60, drapeBlue, 0.475, TRAY_Y - 0.012, TRAY_Z, { roughness: 0.82 }));
            g.add(box(0.014, 0.090, 0.60, drapeBlue, -0.475, TRAY_Y - 0.012, TRAY_Z, { roughness: 0.82 }));
            // Drape kenar dikiş çizgisi
            g.add(box(0.94, 0.004, 0.014, drapeBlueDark, 0, TRAY_Y - 0.054, TRAY_Z + 0.295, { roughness: 0.78 }));
            g.add(box(0.94, 0.004, 0.014, drapeBlueDark, 0, TRAY_Y - 0.054, TRAY_Z - 0.295, { roughness: 0.78 }));
            // Drape kıvrım vurguları (premium detay — 3 paralel)
            g.add(box(0.86, 0.005, 0.018, drapeBlueLight, 0, TRAY_Y + 0.038, TRAY_Z + 0.18, { roughness: 0.78 }));
            g.add(box(0.86, 0.005, 0.018, drapeBlueDark, 0, TRAY_Y + 0.038, TRAY_Z + 0.06, { roughness: 0.78 }));
            g.add(box(0.86, 0.005, 0.018, drapeBlueLight, 0, TRAY_Y + 0.038, TRAY_Z - 0.10, { roughness: 0.78 }));
            g.add(box(0.86, 0.005, 0.018, drapeBlueDark, 0, TRAY_Y + 0.038, TRAY_Z - 0.22, { roughness: 0.78 }));
            // Köşe katlanması
            for (let i = 0; i < 4; i++) {
                const cx = (i % 2 === 0 ? -1 : 1) * 0.45;
                const cz = TRAY_Z + (i < 2 ? 0.27 : -0.27);
                g.add(box(0.060, 0.014, 0.030, drapeBlueDark, cx, TRAY_Y + 0.034, cz, { roughness: 0.80 }));
            }

            // ==========================================================
            // ENSTRÜMANLAR — MODERN PREMIUM SET (drape üstü)
            // 4 zon: tutucu / kesici / penset / sütur+gazlı bez
            // ==========================================================
            const INSTR_Y = TRAY_Y + 0.040;
            // Premium krom alet rengi
            const cromInstr = 0xd0d8df;
            const cromShade = 0xa8b0b8;
            const handleColor = 0x1c2630;
            const handleAccent = 0x4a5e72;

            // Zon ayraç (4 zon — drape üstü ince koyu mavi şeritler)
            [-0.24, -0.04, 0.16].forEach(zx => {
                g.add(box(0.005, 0.004, 0.36, drapeBlueDark, zx, INSTR_Y - 0.014, TRAY_Z, { roughness: 0.78 }));
            });

            // ===== ZON 1 (sol): 4 KLEMP (Mosquito + Crile — paralel, premium) =====
            for (let i = 0; i < 4; i++) {
                const cx = -0.36;
                const cz = TRAY_Z - 0.18 + i * 0.085;
                // Klemp gövdesi (uzun ince krom)
                g.add(box(0.18, 0.008, 0.012, cromInstr, cx, INSTR_Y, cz, { metalness: 0.62, roughness: 0.26 }));
                // Eklem pivotu (altın detay)
                g.add(cyl(0.006, 0.006, 0.010, 0xc89a4a, cx + 0.005, INSTR_Y + 0.006, cz, { seg: 10, metalness: 0.55, roughness: 0.30 }));
                // İki halka sapı
                const ringGeo = new THREE.TorusGeometry(0.014, 0.003, 6, 16);
                const r1 = new THREE.Mesh(ringGeo, mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
                r1.rotation.x = Math.PI / 2;
                r1.position.set(cx - 0.092, INSTR_Y + 0.004, cz - 0.012);
                prepMesh(r1); g.add(r1);
                const r2 = new THREE.Mesh(ringGeo, mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
                r2.rotation.x = Math.PI / 2;
                r2.position.set(cx - 0.092, INSTR_Y + 0.004, cz + 0.012);
                prepMesh(r2); g.add(r2);
                // Dişli (ratchet) detay
                g.add(box(0.012, 0.004, 0.006, cromShade, cx - 0.068, INSTR_Y + 0.004, cz, { metalness: 0.55, roughness: 0.30 }));
                // Kavisli uç
                g.add(cyl(0.0035, 0.0020, 0.024, cromInstr, cx + 0.103, INSTR_Y + 0.001, cz, { seg: 8, metalness: 0.65, roughness: 0.22 }));
            }

            // ===== ZON 2 (sol-orta): MAYO MAKAS + METZENBAUM MAKAS =====
            // Mayo makas (kalın, küt uçlu)
            const mz1 = -0.14;
            g.add(box(0.16, 0.008, 0.010, cromInstr, mz1, INSTR_Y, TRAY_Z + 0.10, { metalness: 0.62, roughness: 0.26 }));
            g.add(cyl(0.006, 0.006, 0.010, 0xc89a4a, mz1 + 0.005, INSTR_Y + 0.006, TRAY_Z + 0.10, { seg: 10, metalness: 0.55, roughness: 0.30 }));
            const mzR1 = new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.003, 6, 16), mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
            mzR1.rotation.x = Math.PI / 2; mzR1.position.set(mz1 - 0.082, INSTR_Y + 0.004, TRAY_Z + 0.088); prepMesh(mzR1); g.add(mzR1);
            const mzR2 = new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.003, 6, 16), mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
            mzR2.rotation.x = Math.PI / 2; mzR2.position.set(mz1 - 0.082, INSTR_Y + 0.004, TRAY_Z + 0.112); prepMesh(mzR2); g.add(mzR2);
            // Makas keskin uç (X şekli)
            g.add(box(0.026, 0.004, 0.005, cromInstr, mz1 + 0.094, INSTR_Y + 0.001, TRAY_Z + 0.097, { metalness: 0.70, roughness: 0.20 }));
            g.add(box(0.026, 0.004, 0.005, cromInstr, mz1 + 0.094, INSTR_Y + 0.001, TRAY_Z + 0.103, { metalness: 0.70, roughness: 0.20 }));

            // Metzenbaum (ince, uzun)
            const mz2 = -0.14;
            g.add(box(0.18, 0.006, 0.008, cromInstr, mz2, INSTR_Y, TRAY_Z - 0.04, { metalness: 0.62, roughness: 0.26 }));
            g.add(cyl(0.006, 0.006, 0.010, 0xc89a4a, mz2 + 0.010, INSTR_Y + 0.005, TRAY_Z - 0.04, { seg: 10, metalness: 0.55 }));
            const mtR1 = new THREE.Mesh(new THREE.TorusGeometry(0.013, 0.0025, 6, 16), mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
            mtR1.rotation.x = Math.PI / 2; mtR1.position.set(mz2 - 0.092, INSTR_Y + 0.003, TRAY_Z - 0.052); prepMesh(mtR1); g.add(mtR1);
            const mtR2 = new THREE.Mesh(new THREE.TorusGeometry(0.013, 0.0025, 6, 16), mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
            mtR2.rotation.x = Math.PI / 2; mtR2.position.set(mz2 - 0.092, INSTR_Y + 0.003, TRAY_Z - 0.028); prepMesh(mtR2); g.add(mtR2);
            // İnce uç
            g.add(cyl(0.0030, 0.0015, 0.030, cromInstr, mz2 + 0.105, INSTR_Y + 0.001, TRAY_Z - 0.04, { seg: 8, metalness: 0.70, roughness: 0.20 }));

            // ===== ZON 3 (orta-sağ): PENSETLER (DeBakey + Adson) + İĞNE TUTUCU =====
            // DeBakey penset (uzun, ince)
            const px1 = 0.06;
            const t1 = box(0.008, 0.005, 0.18, cromInstr, px1, INSTR_Y, TRAY_Z + 0.10, { metalness: 0.62, roughness: 0.26 });
            t1.rotation.y = 0.03; g.add(t1);
            const t2 = box(0.008, 0.005, 0.18, cromInstr, px1 + 0.012, INSTR_Y, TRAY_Z + 0.10, { metalness: 0.62, roughness: 0.26 });
            t2.rotation.y = -0.03; g.add(t2);
            g.add(box(0.020, 0.008, 0.012, cromShade, px1 + 0.006, INSTR_Y + 0.002, TRAY_Z + 0.012, { metalness: 0.55 }));
            // DeBakey çentikli uç
            g.add(box(0.014, 0.003, 0.005, cromInstr, px1 + 0.006, INSTR_Y + 0.001, TRAY_Z + 0.190, { metalness: 0.70 }));

            // Adson penset (kısa, çapraz)
            const px2 = 0.06;
            const at1 = box(0.008, 0.005, 0.12, cromInstr, px2, INSTR_Y, TRAY_Z - 0.06, { metalness: 0.62, roughness: 0.26 });
            at1.rotation.y = 0.04; g.add(at1);
            const at2 = box(0.008, 0.005, 0.12, cromInstr, px2 + 0.010, INSTR_Y, TRAY_Z - 0.06, { metalness: 0.62, roughness: 0.26 });
            at2.rotation.y = -0.04; g.add(at2);
            g.add(box(0.018, 0.008, 0.012, cromShade, px2 + 0.005, INSTR_Y + 0.002, TRAY_Z - 0.118, { metalness: 0.55 }));

            // İğne tutucu (Mayo-Hegar — kısa, kalın gövdeli)
            const ny = 0.06;
            g.add(box(0.16, 0.008, 0.012, cromInstr, ny, INSTR_Y, TRAY_Z - 0.20, { metalness: 0.62, roughness: 0.26 }));
            g.add(cyl(0.006, 0.006, 0.010, 0xc89a4a, ny + 0.005, INSTR_Y + 0.006, TRAY_Z - 0.20, { seg: 10, metalness: 0.55 }));
            const nR1 = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 6, 16), mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
            nR1.rotation.x = Math.PI / 2; nR1.position.set(ny - 0.082, INSTR_Y + 0.004, TRAY_Z - 0.212); prepMesh(nR1); g.add(nR1);
            const nR2 = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 6, 16), mat(cromInstr, { metalness: 0.62, roughness: 0.26 }));
            nR2.rotation.x = Math.PI / 2; nR2.position.set(ny - 0.082, INSTR_Y + 0.004, TRAY_Z - 0.188); prepMesh(nR2); g.add(nR2);
            // İğne ucunda eğimli iğne
            const needle = new THREE.Mesh(
                new THREE.TorusGeometry(0.012, 0.0012, 4, 12, Math.PI),
                mat(cromInstr, { metalness: 0.78, roughness: 0.18 })
            );
            needle.rotation.x = Math.PI / 2; needle.position.set(ny + 0.094, INSTR_Y + 0.006, TRAY_Z - 0.20);
            prepMesh(needle); g.add(needle);

            // ===== ZON 4 (sağ): SKALPEL + 3 ASPİRATÖR + GAZLI BEZ STACK + SUTÜR PAKETLERİ =====
            // Skalpel #10 (gövde + blade)
            const sk1 = 0.32;
            g.add(box(0.10, 0.012, 0.014, handleColor, sk1, INSTR_Y, TRAY_Z + 0.16, { metalness: 0.20, roughness: 0.50 }));
            g.add(box(0.10, 0.001, 0.014, 0xc89a4a, sk1, INSTR_Y + 0.007, TRAY_Z + 0.16, { metalness: 0.55, roughness: 0.30 }));  // gold şerit
            g.add(box(0.030, 0.005, 0.012, cromInstr, sk1 + 0.072, INSTR_Y + 0.001, TRAY_Z + 0.16, { metalness: 0.72, roughness: 0.18 }));  // blade

            // Skalpel #15 (ikinci, daha küçük)
            const sk2 = 0.32;
            g.add(box(0.09, 0.010, 0.012, handleColor, sk2, INSTR_Y, TRAY_Z + 0.10, { metalness: 0.20, roughness: 0.50 }));
            g.add(box(0.024, 0.004, 0.010, cromInstr, sk2 + 0.064, INSTR_Y + 0.001, TRAY_Z + 0.10, { metalness: 0.72, roughness: 0.18 }));

            // Yankauer aspiratör (eğri ucu — krom)
            const ya = 0.32;
            const yankBody = cyl(0.008, 0.008, 0.16, cromInstr, ya, INSTR_Y + 0.005, TRAY_Z + 0.02, { seg: 12, metalness: 0.62, roughness: 0.22 });
            yankBody.rotation.z = Math.PI / 2;
            g.add(yankBody);
            // Yankauer eğri ucu (ellipsoid)
            g.add(cyl(0.012, 0.008, 0.030, cromInstr, ya + 0.090, INSTR_Y + 0.012, TRAY_Z + 0.02, { seg: 12, metalness: 0.62, roughness: 0.22 }));

            // Gazlı bez yığını (3 katlı, beyaz + mavi marker iplik)
            for (let i = 0; i < 3; i++) {
                g.add(box(0.094, 0.012, 0.094, 0xfafdff, sk1, INSTR_Y - 0.010 + i * 0.012, TRAY_Z - 0.10, { roughness: 0.78 }));
            }
            // Mavi radioopaque iplik
            g.add(box(0.094, 0.002, 0.005, drapeBlueLight, sk1, INSTR_Y + 0.030, TRAY_Z - 0.10, {
                emissive: drapeBlueLight, emissiveIntensity: 0.20, transparent: true, opacity: 0.65
            }));

            // Sutür paketleri (renk kodlu — 3 paket dik)
            [-0.20, -0.18, -0.16].forEach((dx, i) => {
                const colors = [0x9d2f2f, 0x4f7d68, 0xc89a4a];
                g.add(box(0.060, 0.014, 0.040, colors[i], sk1 + 0.10, INSTR_Y, TRAY_Z + dx, { roughness: 0.55 }));
                // Etiket beyaz
                g.add(box(0.040, 0.001, 0.022, 0xfafdff, sk1 + 0.10, INSTR_Y + 0.008, TRAY_Z + dx, { roughness: 0.50 }));
            });

            // Steril dolu havlu rulosu (tepsi köşesinde)
            const towel = cyl(0.030, 0.030, 0.10, 0xfafdff, 0.40, INSTR_Y + 0.020, TRAY_Z - 0.20, { seg: 16, roughness: 0.78 });
            towel.rotation.z = Math.PI / 2;
            g.add(towel);
            // Havlu mavi şerit
            const towelBand = cyl(0.0305, 0.0305, 0.012, drapeBlue, 0.40, INSTR_Y + 0.020, TRAY_Z - 0.20, { seg: 16, roughness: 0.80 });
            towelBand.rotation.z = Math.PI / 2;
            g.add(towelBand);

            // ===== AKTİF TESLİM / SAYIM KONTROL ŞERİDİ =====
            // Mayo masası artık sadece dekor değil: scrub hemşiresinin anlık alet teslim,
            // geri alma ve sayım kontrol alanı olarak okunur. Renkler düşük opaklıkta;
            // neon etkisi vermeden zon mantığı gösterir.
            g.add(box(0.82, 0.004, 0.030, 0xe0a558, 0, INSTR_Y + 0.010, TRAY_Z + 0.245, {
                emissive: 0xe0a558, emissiveIntensity: 0.10, transparent: true, opacity: 0.55, roughness: 0.70
            }));
            g.add(box(0.18, 0.006, 0.050, 0x4cb88a, -0.34, INSTR_Y + 0.014, TRAY_Z + 0.240, {
                emissive: 0x4cb88a, emissiveIntensity: 0.08, transparent: true, opacity: 0.52, roughness: 0.72
            }));
            g.add(box(0.18, 0.006, 0.050, 0xd96371, 0.34, INSTR_Y + 0.014, TRAY_Z + 0.240, {
                emissive: 0xd96371, emissiveIntensity: 0.06, transparent: true, opacity: 0.42, roughness: 0.72
            }));

            // Mini sayım klipsleri: spanç / iğne / bistüri ucu hızlı kontrol slotları.
            [-0.04, 0.00, 0.04].forEach((dx, i) => {
                const colors = [0xfafdff, 0xc7d0d8, 0x9aa6b2];
                g.add(box(0.026, 0.010, 0.038, colors[i], -0.02 + dx, INSTR_Y + 0.018, TRAY_Z + 0.245, {
                    metalness: i === 0 ? 0.05 : 0.45, roughness: i === 0 ? 0.72 : 0.30
                }));
            });
            
            return g;
        }

        function buildESUCartV151(x, y, z) {
            // ULTRA-PREMIUM ESU CART v9.0
            // Erbe VIO 3 / Medtronic ForceTriad referanslı.
            // Standalone mobil elektrokoter kulesi — koyu cam ekran,
            // grafit-beyaz gövde, premium kontrol arayüzü.
            const g = groupAt(x, y, z);
            const chromeMat = { metalness: 0.50, roughness: 0.18 };
            const matteCarbon = { metalness: 0.18, roughness: 0.45 };
            const glossWhite = { metalness: 0.22, roughness: 0.20 };
            
            // ==========================================================
            // ALT TABAN + 4 KİLİTLİ TEKERLEK
            // ==========================================================
            g.add(box(0.56, 0.06, 0.46, 0x2a3540, 0, 0.030, 0, { 
                metalness: 0.30, roughness: 0.40 
            }));
            // Alt aksent
            g.add(box(0.54, 0.006, 0.46, 0x88e0d4, 0, 0.064, 0, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.18, transparent: true, opacity: 0.55 
            }));
            
            [-0.22, 0.22].forEach(xx => [-0.18, 0.18].forEach(zz => {
                g.add(box(0.026, 0.040, 0.026, 0x4a5e72, xx, 0.044, zz, { 
                    metalness: 0.40, roughness: 0.24 
                }));
                const w = cyl(0.040, 0.040, 0.028, 0x1a2230, xx, 0.022, zz, { 
                    seg: 14, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
                const hub = cyl(0.020, 0.020, 0.032, 0xb8c4cf, xx, 0.022, zz, { 
                    seg: 12, metalness: 0.55, roughness: 0.18 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
                g.add(box(0.014, 0.008, 0.018, 0x4cb88a, xx, 0.022, 
                    zz + (zz > 0 ? 0.030 : -0.030), { 
                    emissive: 0x4cb88a, emissiveIntensity: 0.40 
                }));
            }));
            
            // ==========================================================
            // ANA GÖVDE (3 katmanlı premium tower)
            // ==========================================================
            // Alt depolama (grafit)
            g.add(box(0.46, 0.30, 0.40, 0x4a5e72, 0, 0.21, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            // Orta gövde (beyaz - premium)
            g.add(box(0.46, 0.42, 0.40, 0xeef3f7, 0, 0.57, 0, { ...glossWhite }));
            // Ara aksent çizgisi (krom + LED)
            g.add(box(0.47, 0.014, 0.41, 0x6f8798, 0, 0.367, 0, { 
                metalness: 0.50, roughness: 0.20 
            }));
            g.add(box(0.46, 0.004, 0.40, 0x88e0d4, 0, 0.376, 0, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.20, transparent: true, opacity: 0.55 
            }));
            // Üst panel kasası (siyah - ekran arkalığı)
            g.add(box(0.46, 0.32, 0.40, 0x1c2c3a, 0, 0.94, 0, { 
                metalness: 0.20, roughness: 0.32 
            }));
            // Üst kapak
            g.add(box(0.48, 0.024, 0.42, 0x2a3540, 0, 1.110, 0, { 
                metalness: 0.40, roughness: 0.24 
            }));
            // Üst aksent
            g.add(box(0.46, 0.004, 0.40, 0x88e0d4, 0, 1.105, 0, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.22, transparent: true, opacity: 0.55 
            }));
            
            // ==========================================================
            // ÖNE EĞİMLİ DOKUNMATIK EKRAN (premium koyu cam)
            // ==========================================================
            // Eğik ekran kasası (ergonomik)
            const screenFrame = box(0.42, 0.30, 0.030, 0x0e1821, 0, 0.94, 0.215, { 
                roughness: 0.16, metalness: 0.20 
            });
            screenFrame.rotation.x = -0.16;
            g.add(screenFrame);
            // Aktif koyu cam ekran
            const screen = box(0.38, 0.26, 0.020, 0x1a2940, 0, 0.94, 0.230, { 
                roughness: 0.12, metalness: 0.30 
            });
            screen.rotation.x = -0.16;
            g.add(screen);
            // Üst başlık şeridi
            const screenTopBar = box(0.34, 0.018, 0.014, 0x4a7c8a, 0, 1.060, 0.243, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.45 
            });
            screenTopBar.rotation.x = -0.16;
            g.add(screenTopBar);
            
            // CUT/COAG/BIPOLAR mod segmentleri (ekranda - 3 yatay bant, düşük opak)
            const modes = [
                { y: 0.985, color: 0xe0a558, label: 'CUT' },
                { y: 0.940, color: 0x6f9fd8, label: 'COAG' },
                { y: 0.895, color: 0x4cb88a, label: 'BIPOLAR' }
            ];
            modes.forEach(({ y: yy, color }) => {
                // Mod barı
                const bar = box(0.30, 0.030, 0.014, color, 0, yy, 0.245, { 
                    emissive: color, emissiveIntensity: 0.32, 
                    transparent: true, opacity: 0.72 
                });
                bar.rotation.x = -0.16;
                g.add(bar);
                // Sol seçim göstergesi (yeşil)
                const indicator = cyl(0.008, 0.008, 0.010, 0x4cb88a, -0.16, yy, 0.247, { 
                    seg: 10, emissive: 0x4cb88a, emissiveIntensity: 0.55 
                });
                indicator.rotation.x = Math.PI / 2 - 0.16;
                g.add(indicator);
                // Sağ değer (beyaz)
                const value = box(0.05, 0.014, 0.014, 0xfafdff, 0.13, yy, 0.246, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.30 
                });
                value.rotation.x = -0.16;
                g.add(value);
            });
            // Alt başlık (hasta info)
            const patientBar = box(0.30, 0.020, 0.014, 0xfafdff, 0, 0.835, 0.244, { 
                roughness: 0.30 
            });
            patientBar.rotation.x = -0.16;
            g.add(patientBar);
            
            // ==========================================================
            // 3 NET KONTROL DÜĞMESİ (CUT/COAG/BIPOLAR fizik)
            // Orta gövde önyüzü
            // ==========================================================
            [-0.13, 0, 0.13].forEach((dx, i) => {
                const colors = [0xe0a558, 0x6f9fd8, 0x4cb88a];
                // Knob halka çerçevesi (krom)
                g.add(cyl(0.030, 0.030, 0.014, 0xb8c4cf, dx, 0.700, 0.205, { 
                    seg: 16, metalness: 0.55, roughness: 0.18 
                }));
                // Renk kodlu üst kapak
                g.add(cyl(0.024, 0.024, 0.014, colors[i], dx, 0.708, 0.205, { 
                    seg: 14, emissive: colors[i], emissiveIntensity: 0.32, 
                    transparent: true, opacity: 0.78 
                }));
                // Knob işareti (üst çizgi)
                g.add(box(0.014, 0.004, 0.005, 0xfafdff, dx, 0.722, 0.207, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.35 
                }));
                // Alt etiket (CUT/COAG/BIP)
                g.add(box(0.040, 0.014, 0.012, colors[i], dx, 0.660, 0.207, { 
                    emissive: colors[i], emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.65 
                }));
            });
            
            // ==========================================================
            // REM YEŞİL ONAY LED + ETİKET
            // ==========================================================
            // REM kasası (sol)
            g.add(box(0.10, 0.06, 0.018, 0x0e1821, -0.18, 0.580, 0.205, { 
                roughness: 0.18 
            }));
            // Yeşil onay LED (büyük)
            g.add(cyl(0.014, 0.014, 0.012, 0x4cb88a, -0.180, 0.580, 0.218, { 
                seg: 14, emissive: 0x4cb88a, emissiveIntensity: 0.60 
            }));
            // "REM OK" etiketi
            g.add(box(0.060, 0.012, 0.014, 0x4cb88a, -0.180, 0.555, 0.215, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.40, 
                transparent: true, opacity: 0.80 
            }));
            // REM kart yan plug (sol kenar)
            g.add(box(0.030, 0.030, 0.020, 0x4a5e72, -0.241, 0.580, 0.10, { 
                metalness: 0.45, roughness: 0.22 
            }));
            
            // ==========================================================
            // KIRMIZI ACİL DURDURMA (küçük, sağda)
            // ==========================================================
            // Çerçeve
            g.add(cyl(0.022, 0.022, 0.014, 0xb8c4cf, 0.18, 0.580, 0.205, { 
                seg: 14, metalness: 0.55, roughness: 0.18 
            }));
            // Kırmızı buton
            g.add(cyl(0.018, 0.018, 0.014, 0xd96371, 0.18, 0.586, 0.207, { 
                seg: 14, emissive: 0xd96371, emissiveIntensity: 0.50 
            }));
            // E-stop yazı şeridi (alt)
            g.add(box(0.040, 0.012, 0.014, 0xd96371, 0.18, 0.555, 0.213, { 
                emissive: 0xd96371, emissiveIntensity: 0.35, 
                transparent: true, opacity: 0.80 
            }));
            
            // ==========================================================
            // YANGIN ÜÇGENİ UYARI KARTI (üst sağ - okunabilir)
            // ==========================================================
            // Kart kasası
            g.add(box(0.08, 0.08, 0.014, 0xfafdff, 0.155, 1.020, 0.205, { 
                roughness: 0.28 
            }));
            // Üçgen sarı uyarı
            g.add(box(0.054, 0.046, 0.014, 0xe0a558, 0.155, 1.030, 0.213, { 
                emissive: 0xe0a558, emissiveIntensity: 0.40, 
                transparent: true, opacity: 0.85 
            }));
            // Ünlem işareti (siyah)
            g.add(box(0.005, 0.024, 0.005, 0x1a2230, 0.155, 1.030, 0.220, { 
                roughness: 0.30 
            }));
            g.add(box(0.005, 0.005, 0.005, 0x1a2230, 0.155, 1.012, 0.220, { 
                roughness: 0.30 
            }));
            // "ESU SAFETY" etiketi (alt)
            g.add(box(0.06, 0.010, 0.014, 0x1a2230, 0.155, 0.985, 0.213, { 
                roughness: 0.30 
            }));
            
            // ==========================================================
            // AKTİF ELEKTROD KALEMİ (sol üst tutucu + MAVİ KABLO)
            // ==========================================================
            // Kalem tutucu kasası (sol üst)
            g.add(box(0.060, 0.04, 0.080, 0x2a3540, -0.221, 1.000, -0.04, { 
                roughness: 0.30 
            }));
            // Kalem (silindirik beyaz - eğimli yatay)
            const pen = cyl(0.012, 0.014, 0.14, 0xeef3f7, -0.295, 1.020, -0.04, { 
                seg: 12, ...glossWhite 
            });
            pen.rotation.z = Math.PI / 2;
            pen.rotation.y = 0.3;
            g.add(pen);
            // Kalem ucu (mavi metalik)
            g.add(cyl(0.008, 0.012, 0.024, 0x4a7c8a, -0.380, 1.020, -0.04, { 
                seg: 10, metalness: 0.45 
            }));
            // Kablo (mavi - yatay düzenli güzergah)
            const cable1 = cyl(0.006, 0.006, 0.55, 0x4a7c8a, -0.30, 0.85, -0.04, { 
                seg: 8, transparent: true, opacity: 0.85 
            });
            cable1.rotation.z = Math.PI / 2.6;
            g.add(cable1);
            // Kablo dönüş halkası (klinik düzen)
            const cableLoop = new THREE.Mesh(
                new THREE.TorusGeometry(0.040, 0.005, 6, 18),
                mat(0x4a7c8a, { transparent: true, opacity: 0.78 })
            );
            cableLoop.rotation.x = Math.PI / 3;
            cableLoop.position.set(-0.32, 0.62, -0.02);
            prepMesh(cableLoop); g.add(cableLoop);
            
            // ==========================================================
            // BİPOLAR PENS KABLOSU (siyah - ayrı çıkış)
            // ==========================================================
            const bipPen = cyl(0.012, 0.014, 0.10, 0xeef3f7, -0.221, 1.000, 0.06, { 
                seg: 12, ...glossWhite 
            });
            bipPen.rotation.z = Math.PI / 2;
            g.add(bipPen);
            const cable2 = cyl(0.005, 0.005, 0.30, 0x2a3540, -0.30, 0.92, 0.06, { 
                seg: 8, transparent: true, opacity: 0.85 
            });
            cable2.rotation.z = Math.PI / 2.8;
            g.add(cable2);
            
            // ==========================================================
            // AYAK PEDALI (önde - belirgin)
            // ==========================================================
            // Pedal kasası (zemine yakın - cihaz önü)
            g.add(box(0.22, 0.044, 0.16, 0x1a2230, 0.32, 0.024, 0.30, { 
                metalness: 0.25, roughness: 0.40 
            }));
            // Pedal yüzeyi 2 bölge
            g.add(box(0.090, 0.014, 0.13, 0xe0a558, 0.275, 0.048, 0.30, { 
                emissive: 0xe0a558, emissiveIntensity: 0.30, transparent: true, opacity: 0.70 
            }));
            g.add(box(0.090, 0.014, 0.13, 0x6f9fd8, 0.365, 0.048, 0.30, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.30, transparent: true, opacity: 0.70 
            }));
            // Pedal label çizgileri
            g.add(box(0.040, 0.005, 0.014, 0xfafdff, 0.275, 0.058, 0.36, { 
                emissive: 0xfafdff, emissiveIntensity: 0.35 
            }));
            g.add(box(0.040, 0.005, 0.014, 0xfafdff, 0.365, 0.058, 0.36, { 
                emissive: 0xfafdff, emissiveIntensity: 0.35 
            }));
            // Pedal kablosu (cihaza dönen kontrollü)
            const pedalCable = cyl(0.008, 0.008, 0.40, 0x2a3540, 0.20, 0.06, 0.18, { 
                seg: 8, transparent: true, opacity: 0.78 
            });
            pedalCable.rotation.z = -1.0;
            pedalCable.rotation.x = -0.4;
            g.add(pedalCable);
            
            // ==========================================================
            // ÜST TUTAMAÇ (mobilite)
            // ==========================================================
            // Direkler
            g.add(cyl(0.012, 0.012, 0.18, 0x4a5e72, -0.13, 1.20, -0.16, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            g.add(cyl(0.012, 0.012, 0.18, 0x4a5e72, 0.13, 1.20, -0.16, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            // Yatay tutamaç (krom)
            const handle = cyl(0.014, 0.014, 0.30, 0xb8c4cf, 0, 1.28, -0.16, { 
                seg: 12, metalness: 0.55, roughness: 0.18 
            });
            handle.rotation.z = Math.PI / 2;
            g.add(handle);
            
            return g;
        }

        function buildCABGSurgicalPatientFieldV1(x, y, z) {
            // CABG SURGICAL PATIENT FIELD v3.0 — INTEGRATED 5-LAYER ARCHITECTURE
            //
            // 5 katmanlı tek bütünleşik kompozisyon:
            //   1. Base body silhouette  → anatomik supin gövde (sphere-scale ellipsoid)
            //   2. Positioning/support  → jel pedler + kol tahtaları + topuk
            //   3. Sterile drape         → opaque medikal mavi örtü; vücut formuna oturur
            //   4. CABG operative field → sternotomi + Finochietto + gauze + enstrüman
            //   5. Clinical connections → KPB kanül hatları + ETT + EKG + A-line
            //
            // Eksen: x = baş(-)→ayak(+), z = sol(-)/sağ(+), y = yükseklik
            // Kurulum: y=0.86 (jel ped üstü); LOKAL y=0 → masa/hasta üst yüzeyi.
            // Hasta SUPİN, baş -x'te, ayak +x'te. Tüm form drape altında kalır.
            const g = groupAt(x, y, z);

            // === MATERYAL PALETİ ===
            const drapeMat       = { metalness: 0.05, roughness: 0.86 }; // ana medikal tekstil
            const drapeLightMat  = { metalness: 0.06, roughness: 0.80 }; // üst aydınlatma katmanı
            const drapeFoldMat   = { metalness: 0.03, roughness: 0.90 }; // kıvrım/gölge
            const satinSteelMat  = { metalness: 0.55, roughness: 0.30 };
            const brushedSteelMat= { metalness: 0.62, roughness: 0.26 };
            const graphiteMat    = { metalness: 0.32, roughness: 0.50 };
            const tubeMat        = { metalness: 0.18, roughness: 0.42 };
            const skinMat        = { metalness: 0.04, roughness: 0.62 };
            const gauzeMat       = { metalness: 0.02, roughness: 0.92 };
            const gelPadMat      = { metalness: 0.04, roughness: 0.42, transparent: true, opacity: 0.92 };

            // Drape paleti — mat medikal mavi/turkuaz (neon değil)
            const DRAPE_BLUE  = 0x3f6f7d;
            const DRAPE_LIGHT = 0x5a8a98;
            const DRAPE_DEEP  = 0x2f5763;
            const BODY_FORM   = 0x335a66;  // drape ile uyumlu derin mavi (siluet altı)
            const SKIN_TONE   = 0xc7926d;
            const SKIN_DEEP   = 0xa57452;
            const GEL_PAD     = 0xd0c4b8;

            // ==========================================================
            // LAYER 1 — BASE BODY SILHOUETTE
            // Anatomik supin gövde: ellipsoid göğüs domu, daralan bel,
            // pelvis, yumuşak uyluk, diz kabarıklığı, baldır.
            // Sphere-scale ile tek anatomik kütle hissi (toy block değil).
            // ==========================================================

            // GÖĞÜS DOMU (ellipsoid — sphere scale)
            const chestDome = sphere(0.22, BODY_FORM, -0.22, 0.030, 0,
                { ...drapeMat, w: 28, h: 18 });
            chestDome.scale.set(1.45, 0.55, 1.05);  // uzun-baş/ayak, alçak, geniş yan
            g.add(chestDome);
            // Göğüs üst yumuşatıcı katman (sternum üstü hafif tepe)
            const chestTop = sphere(0.16, BODY_FORM, -0.18, 0.080, 0,
                { ...drapeMat, w: 24, h: 14 });
            chestTop.scale.set(1.30, 0.45, 0.95);
            g.add(chestTop);

            // BEL DARALMASI (göğüs ile pelvis arası — ellipsoid ince)
            const waist = sphere(0.18, BODY_FORM, 0.16, 0.020, 0,
                { ...drapeMat, w: 24, h: 14 });
            waist.scale.set(1.55, 0.45, 0.85);
            g.add(waist);
            // Karın dolgunluğu
            const belly = sphere(0.13, BODY_FORM, 0.20, 0.060, 0,
                { ...drapeMat, w: 22, h: 14 });
            belly.scale.set(1.30, 0.50, 0.95);
            g.add(belly);

            // PELVİS (geniş, alçak)
            const pelvis = sphere(0.18, BODY_FORM, 0.52, 0.018, 0,
                { ...drapeMat, w: 22, h: 14 });
            pelvis.scale.set(1.20, 0.40, 0.95);
            g.add(pelvis);

            // UYLUKLAR (iki bacak — ellipsoid)
            const thighL = sphere(0.10, BODY_FORM, 0.82, 0.018, 0.11,
                { ...drapeMat, w: 20, h: 12 });
            thighL.scale.set(1.80, 0.45, 1.00);
            g.add(thighL);
            const thighR = sphere(0.10, BODY_FORM, 0.82, 0.018, -0.11,
                { ...drapeMat, w: 20, h: 12 });
            thighR.scale.set(1.80, 0.45, 1.00);
            g.add(thighR);

            // DİZ (hafif tepe)
            const kneeL = sphere(0.07, BODY_FORM, 1.06, 0.034, 0.11,
                { ...drapeMat, w: 18, h: 12 });
            kneeL.scale.set(1.10, 0.55, 1.00);
            g.add(kneeL);
            const kneeR = sphere(0.07, BODY_FORM, 1.06, 0.034, -0.11,
                { ...drapeMat, w: 18, h: 12 });
            kneeR.scale.set(1.10, 0.55, 1.00);
            g.add(kneeR);

            // BALDIR (diz-altı, ellipsoid uzun)
            const calfL = sphere(0.08, BODY_FORM, 1.22, 0.020, 0.11,
                { ...drapeMat, w: 18, h: 12 });
            calfL.scale.set(1.50, 0.40, 0.90);
            g.add(calfL);
            const calfR = sphere(0.08, BODY_FORM, 1.22, 0.020, -0.11,
                { ...drapeMat, w: 18, h: 12 });
            calfR.scale.set(1.50, 0.40, 0.90);
            g.add(calfR);

            // OMUZ HATTI (üst gövde başlangıcı — drape altı dolgu)
            const shoulderL = sphere(0.10, BODY_FORM, -0.42, 0.046, 0.20,
                { ...drapeMat, w: 18, h: 12 });
            shoulderL.scale.set(1.10, 0.55, 1.00);
            g.add(shoulderL);
            const shoulderR = sphere(0.10, BODY_FORM, -0.42, 0.046, -0.20,
                { ...drapeMat, w: 18, h: 12 });
            shoulderR.scale.set(1.10, 0.55, 1.00);
            g.add(shoulderR);

            // ==========================================================
            // LAYER 2 — POSITIONING / SUPPORT
            // Jel pedler, kol tahtası destekleri, topuk; hasta ile entegre.
            // ==========================================================
            // Sakral jel ped (pelvis altı — hafif görünür)
            g.add(box(0.34, 0.020, 0.34, GEL_PAD, 0.50, -0.012, 0, gelPadMat));
            // Topuk koruma pedleri (ayak ucunda, drape ucundan görünür)
            const heelL = sphere(0.055, GEL_PAD, 1.36, 0.012, 0.11, { ...gelPadMat, w: 16, h: 12 });
            heelL.scale.set(1.10, 0.65, 1.10);
            g.add(heelL);
            const heelR = sphere(0.055, GEL_PAD, 1.36, 0.012, -0.11, { ...gelPadMat, w: 16, h: 12 });
            heelR.scale.set(1.10, 0.65, 1.10);
            g.add(heelR);
            // Dirsek/önkol jel destekleri (kol tahtaları üzerinde)
            const armPadL = sphere(0.07, GEL_PAD, -0.30, 0.005, 0.86, { ...gelPadMat, w: 16, h: 10 });
            armPadL.scale.set(2.20, 0.40, 0.90);
            g.add(armPadL);
            const armPadR = sphere(0.07, GEL_PAD, -0.30, 0.005, -0.86, { ...gelPadMat, w: 16, h: 10 });
            armPadR.scale.set(2.20, 0.40, 0.90);
            g.add(armPadR);
            // Kol siluet (önkol — drape altı dolgu)
            const forearmL = sphere(0.06, BODY_FORM, -0.28, 0.020, 0.86,
                { ...drapeMat, w: 16, h: 10 });
            forearmL.scale.set(2.40, 0.45, 0.90);
            g.add(forearmL);
            const forearmR = sphere(0.06, BODY_FORM, -0.28, 0.020, -0.86,
                { ...drapeMat, w: 16, h: 10 });
            forearmR.scale.set(2.40, 0.45, 0.90);
            g.add(forearmR);

            // ==========================================================
            // LAYER 3 — STERILE DRAPE
            // Vücut formuna oturan katmanlı tekstil; sternotomi penceresi açık.
            // Drape gövde domuna paralel hafif kabaran tepe + yan sarkıt + ayak
            // ucu kapanışı + baş ucu anestezi perdesi.
            // ==========================================================

            // ANA DRAPE GÖVDESİ — vücut domuna oturan ellipsoid (göğüs üstü)
            const drapeMain = sphere(0.30, DRAPE_BLUE, -0.10, 0.060, 0,
                { ...drapeMat, w: 32, h: 18 });
            drapeMain.scale.set(2.20, 0.45, 1.20);
            g.add(drapeMain);
            // Drape üst aydınlık katman (göğüs+karın orta hat — hafif highlight)
            const drapeHi = sphere(0.22, DRAPE_LIGHT, 0.00, 0.094, 0,
                { ...drapeLightMat, w: 28, h: 16 });
            drapeHi.scale.set(2.30, 0.30, 1.00);
            g.add(drapeHi);
            // Pelvis-uyluk drape (alt vücut)
            const drapeLower = sphere(0.24, DRAPE_BLUE, 0.86, 0.038, 0,
                { ...drapeMat, w: 28, h: 16 });
            drapeLower.scale.set(2.30, 0.45, 1.10);
            g.add(drapeLower);
            const drapeLowerHi = sphere(0.18, DRAPE_LIGHT, 0.86, 0.066, 0,
                { ...drapeLightMat, w: 24, h: 14 });
            drapeLowerHi.scale.set(2.50, 0.30, 0.95);
            g.add(drapeLowerHi);
            // Diz-baldır drape (alt katman)
            const drapeShin = sphere(0.18, DRAPE_BLUE, 1.22, 0.034, 0,
                { ...drapeMat, w: 24, h: 14 });
            drapeShin.scale.set(1.20, 0.45, 1.10);
            g.add(drapeShin);

            // DRAPE KONTUR KIVRIMLARI — vücut domu üstünde anatomik nervürler
            // (göğüs, bel, karın, pelvis, uyluk, diz hatlarını okutur)
            const drapeContours = [
                { x: -0.36, w: 0.014, d: 0.46, y: 0.106 },
                { x: -0.20, w: 0.014, d: 0.52, y: 0.114 },
                { x: -0.04, w: 0.014, d: 0.50, y: 0.110 },
                { x:  0.14, w: 0.014, d: 0.46, y: 0.102 },
                { x:  0.32, w: 0.014, d: 0.42, y: 0.098 },
                { x:  0.52, w: 0.014, d: 0.40, y: 0.082 },
                { x:  0.72, w: 0.014, d: 0.32, y: 0.072 },
                { x:  0.92, w: 0.014, d: 0.30, y: 0.072 },
                { x:  1.10, w: 0.014, d: 0.30, y: 0.068 }
            ];
            drapeContours.forEach(c => {
                g.add(box(c.w, 0.006, c.d, DRAPE_DEEP, c.x, c.y, 0, drapeFoldMat));
            });

            // YAN SARKIT (ön/arka — masa kenarına iniş, eğimli tekstil)
            const drapeSideF = box(2.10, 0.30, 0.010, DRAPE_BLUE, 0.30, -0.040, 0.34, drapeMat);
            drapeSideF.rotation.x = -0.07;
            g.add(drapeSideF);
            const drapeSideB = box(2.10, 0.30, 0.010, DRAPE_BLUE, 0.30, -0.040, -0.34, drapeMat);
            drapeSideB.rotation.x = 0.07;
            g.add(drapeSideB);
            // Sarkıt iç gölge
            const drapeShadeF = box(2.04, 0.28, 0.006, DRAPE_DEEP, 0.30, -0.040, 0.332, drapeFoldMat);
            drapeShadeF.rotation.x = -0.07;
            g.add(drapeShadeF);
            const drapeShadeB = box(2.04, 0.28, 0.006, DRAPE_DEEP, 0.30, -0.040, -0.332, drapeFoldMat);
            drapeShadeB.rotation.x = 0.07;
            g.add(drapeShadeB);
            // Sarkıt üst kenar takviye bandı (drape kalınlık hissi)
            g.add(box(2.10, 0.012, 0.014, DRAPE_DEEP, 0.30, 0.090, 0.328, drapeFoldMat));
            g.add(box(2.10, 0.012, 0.014, DRAPE_DEEP, 0.30, 0.090, -0.328, drapeFoldMat));

            // AYAK UCU KAPANIŞI (hafif eğimli)
            const drapeFoot = box(0.012, 0.22, 0.60, DRAPE_BLUE, 1.30, -0.020, 0, drapeMat);
            drapeFoot.rotation.z = -0.10;
            g.add(drapeFoot);
            const drapeFootShade = box(0.008, 0.20, 0.58, DRAPE_DEEP, 1.305, -0.020, 0, drapeFoldMat);
            drapeFootShade.rotation.z = -0.10;
            g.add(drapeFootShade);

            // BAŞ UCU SINIRI (drape kenarı — anestezi tarafı)
            g.add(box(0.014, 0.022, 0.62, DRAPE_DEEP, -0.66, 0.090, 0, drapeFoldMat));
            g.add(box(0.020, 0.014, 0.62, DRAPE_BLUE, -0.65, 0.100, 0, drapeMat));

            // ANESTEZİ PERDESİ (dik perde — hasta başı ile sahayı ayırır)
            g.add(cyl(0.006, 0.006, 0.24, 0xb8c1ca, -0.62, 0.220,  0.28, { seg: 10, ...brushedSteelMat }));
            g.add(cyl(0.006, 0.006, 0.24, 0xb8c1ca, -0.62, 0.220, -0.28, { seg: 10, ...brushedSteelMat }));
            const drapeBar = cyl(0.005, 0.005, 0.56, 0xb8c1ca, -0.62, 0.336, 0, { seg: 10, ...brushedSteelMat });
            drapeBar.rotation.x = Math.PI / 2;
            g.add(drapeBar);
            g.add(box(0.014, 0.22, 0.54, DRAPE_BLUE,  -0.61, 0.220, 0, drapeMat));
            g.add(box(0.010, 0.20, 0.50, DRAPE_LIGHT, -0.605, 0.220, 0, drapeLightMat));
            // Perde alt kenar (drape ile birleşim)
            g.add(box(0.020, 0.012, 0.56, DRAPE_DEEP, -0.61, 0.108, 0, drapeFoldMat));

            // KOL TAHTASI DRAPE'LARI (her iki kol — gövdeye köprü)
            // Lokal kol pozisyonu: x≈-0.30, z=±0.86
            g.add(box(0.86, 0.014, 0.24, DRAPE_BLUE,  -0.30, 0.046,  0.86, drapeMat));
            g.add(box(0.82, 0.010, 0.22, DRAPE_LIGHT, -0.30, 0.054,  0.86, drapeLightMat));
            g.add(box(0.86, 0.014, 0.24, DRAPE_BLUE,  -0.30, 0.046, -0.86, drapeMat));
            g.add(box(0.82, 0.010, 0.22, DRAPE_LIGHT, -0.30, 0.054, -0.86, drapeLightMat));
            // Gövde-kol drape köprüsü
            g.add(box(0.46, 0.012, 0.32, DRAPE_BLUE, -0.30, 0.044,  0.50, drapeMat));
            g.add(box(0.46, 0.012, 0.32, DRAPE_BLUE, -0.30, 0.044, -0.50, drapeMat));
            // Köprü gölgesi
            g.add(box(0.46, 0.005, 0.30, DRAPE_DEEP, -0.30, 0.052,  0.50, drapeFoldMat));
            g.add(box(0.46, 0.005, 0.30, DRAPE_DEEP, -0.30, 0.052, -0.50, drapeFoldMat));

            // STERNOTOMI PENCERE SINIR ŞERİDİ (yapışkan kenar)
            g.add(box(0.46, 0.005, 0.006, 0xd7e2e8, 0.14, 0.122,  0.135, drapeLightMat));
            g.add(box(0.46, 0.005, 0.006, 0xd7e2e8, 0.14, 0.122, -0.135, drapeLightMat));
            g.add(box(0.006, 0.005, 0.27, 0xd7e2e8, -0.09, 0.122, 0, drapeLightMat));
            g.add(box(0.006, 0.005, 0.27, 0xd7e2e8,  0.37, 0.122, 0, drapeLightMat));

            // ==========================================================
            // LAYER 4 — CABG OPERATIVE FIELD
            // Sternotomi penceresi + Finochietto retractor + gauze + enstrüman.
            // Drape üst yüzeyi y≈0.114; pencere ve aletler bunun üstünde.
            // ==========================================================
            // Pencere arkası (cilt tonu — drape açıklığında görünür)
            g.add(box(0.16, 0.005, 0.30, SKIN_TONE, 0.05, 0.128, 0, skinMat));
            // İç gölge (sternum derinliği hissi)
            g.add(box(0.10, 0.004, 0.26, SKIN_DEEP, 0.05, 0.131, 0, skinMat));
            // İnce skin-line kesi izi (anatomik çizgi)
            g.add(box(0.004, 0.005, 0.24, 0x6e3a36, 0.05, 0.134, 0, { metalness: 0.04, roughness: 0.62 }));

            // Pencere kenar trim (krom çerçeve)
            g.add(box(0.18, 0.006, 0.008, 0x9aa6b0, 0.05, 0.132,  0.155, brushedSteelMat));
            g.add(box(0.18, 0.006, 0.008, 0x9aa6b0, 0.05, 0.132, -0.155, brushedSteelMat));
            g.add(box(0.008, 0.006, 0.32, 0x9aa6b0, -0.034, 0.132, 0, brushedSteelMat));
            g.add(box(0.008, 0.006, 0.32, 0x9aa6b0,  0.134, 0.132, 0, brushedSteelMat));

            // Steril gauze packing (pencere kenarları)
            for (let i = 0; i < 4; i++) {
                const zz = -0.12 + i * 0.08;
                g.add(box(0.020, 0.008, 0.030, 0xf3f6f8, -0.005, 0.138, zz, gauzeMat));
                g.add(box(0.020, 0.008, 0.030, 0xf3f6f8,  0.105, 0.138, zz, gauzeMat));
            }

            // FINOCHIETTO STERNAL RETRACTOR (düşük profilli — satin steel)
            g.add(box(0.012, 0.020, 0.36, 0xc7d0d8, 0.05, 0.154, 0, satinSteelMat));
            g.add(box(0.010, 0.008, 0.34, 0x6e7884, 0.05, 0.140, 0, graphiteMat));
            // Blade bağlantı çubukları
            g.add(box(0.10, 0.006, 0.012, 0xc7d0d8, 0.00, 0.156,  0.10, brushedSteelMat));
            g.add(box(0.10, 0.006, 0.012, 0xc7d0d8, 0.10, 0.156,  0.10, brushedSteelMat));
            g.add(box(0.10, 0.006, 0.012, 0xc7d0d8, 0.00, 0.156, -0.10, brushedSteelMat));
            g.add(box(0.10, 0.006, 0.012, 0xc7d0d8, 0.10, 0.156, -0.10, brushedSteelMat));
            // Açıcı bladeler
            g.add(box(0.09, 0.022, 0.005, 0xb8c1ca, 0.05, 0.166,  0.117, satinSteelMat));
            g.add(box(0.09, 0.022, 0.005, 0xb8c1ca, 0.05, 0.166, -0.117, satinSteelMat));
            // Kremayer rayı
            g.add(box(0.18, 0.004, 0.006, 0x8a96a0, 0.05, 0.148, 0.06, satinSteelMat));
            // Crank şaftı + sap
            const crankShaft = cyl(0.005, 0.005, 0.10, 0xb8c1ca, -0.05, 0.158, 0.06, { seg: 10, ...brushedSteelMat });
            crankShaft.rotation.z = Math.PI / 2;
            g.add(crankShaft);
            g.add(cyl(0.012, 0.012, 0.014, 0x4f5965, -0.105, 0.158, 0.06, { seg: 12, ...graphiteMat }));
            g.add(cyl(0.014, 0.014, 0.006, 0x9aa6b0, -0.115, 0.158, 0.06, { seg: 12, ...satinSteelMat }));

            // YANKAUER SUCTION (ince eğimli, sahanın sağ kenarı)
            const yank = cyl(0.005, 0.007, 0.16, 0xb8c1ca, 0.20, 0.148, 0.07, { seg: 10, ...brushedSteelMat });
            yank.rotation.z = -0.18;
            yank.rotation.y = -0.25;
            g.add(yank);
            g.add(sphere(0.008, 0xc7d0d8, 0.27, 0.156, 0.05, brushedSteelMat));
            const suctionLine = cyl(0.005, 0.005, 0.42, 0x4f5965, 0.40, 0.134, 0.18, {
                seg: 8, ...tubeMat, transparent: true, opacity: 0.78
            });
            suctionLine.rotation.z = Math.PI / 2;
            suctionLine.rotation.y = -0.35;
            g.add(suctionLine);

            // KOTER KALEMİ (sahanın sol köşesi)
            const coterPen = cyl(0.006, 0.006, 0.10, 0xeef3f7, -0.04, 0.148, -0.07, {
                seg: 10, metalness: 0.20, roughness: 0.30
            });
            coterPen.rotation.z = 0.20;
            coterPen.rotation.y = 0.30;
            g.add(coterPen);
            g.add(cyl(0.0028, 0.0028, 0.022, 0x9aa6b0, 0.02, 0.148, -0.085, { seg: 8, ...brushedSteelMat }));
            const coterLine = cyl(0.0045, 0.0045, 0.40, 0x3a4452, -0.18, 0.134, -0.20, {
                seg: 8, ...tubeMat, transparent: true, opacity: 0.80
            });
            coterLine.rotation.z = Math.PI / 2;
            coterLine.rotation.y = 0.30;
            g.add(coterLine);

            // Steril gaze yığını ve ince kardiyak enstrümanlar (drape üzeri)
            for (let i = 0; i < 3; i++) {
                g.add(box(0.044, 0.006, 0.044, 0xf3f6f8, 0.32, 0.130 + i * 0.006, -0.18, gauzeMat));
            }
            for (let i = 0; i < 2; i++) {
                g.add(box(0.14, 0.004, 0.006, 0xc7d0d8, 0.26, 0.134, 0.20 - i * 0.024, brushedSteelMat));
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(0.012, 0.0035, 6, 14),
                    mat(0xb8c1ca, satinSteelMat)
                );
                ring.position.set(0.19, 0.136, 0.20 - i * 0.024);
                ring.rotation.y = Math.PI / 2;
                prepMesh(ring);
                g.add(ring);
            }

            // ==========================================================
            // LAYER 5 — CLINICAL CONNECTIONS
            // KPB kanülleri (aortik/venöz/kardiopleji) → +x KPB yönü
            // ETT + anestezi devresi → -x baş ucu
            // EKG omuz hattı + A-line sol bilek
            // ==========================================================
            function buildClinicalTube(points, radius, color, opts) {
                const curve = new THREE.CatmullRomCurve3(
                    points.map(p => new THREE.Vector3(p[0], p[1], p[2])),
                    false, 'catmullrom', 0.5
                );
                const geo = new THREE.TubeGeometry(curve, 24, radius, 10, false);
                const mesh = new THREE.Mesh(geo, mat(color, opts));
                prepMesh(mesh);
                return mesh;
            }
            // Aortik kanül (kırmızı — oksjenli) → KPB'ye
            g.add(buildClinicalTube(
                [
                    [0.10, 0.140,  0.04],
                    [0.22, 0.154,  0.06],
                    [0.40, 0.144,  0.08],
                    [0.65, 0.128,  0.10],
                    [0.95, 0.112,  0.14]
                ],
                0.012, 0xa84a52, { ...tubeMat, transparent: true, opacity: 0.92 }
            ));
            g.add(cyl(0.010, 0.012, 0.034, 0xa84a52, 0.10, 0.142, 0.045, { seg: 12, ...tubeMat }));
            g.add(box(0.020, 0.012, 0.018, 0xc7d0d8, 0.50, 0.140, 0.09, brushedSteelMat));
            g.add(box(0.018, 0.008, 0.014, 0x6e7884, 0.50, 0.146, 0.09, graphiteMat));

            // Venöz kanül (koyu mavi — kalın çap)
            g.add(buildClinicalTube(
                [
                    [0.10, 0.138, -0.04],
                    [0.22, 0.150, -0.06],
                    [0.40, 0.142, -0.10],
                    [0.65, 0.126, -0.14],
                    [0.95, 0.110, -0.18]
                ],
                0.016, 0x3a5874, { ...tubeMat, transparent: true, opacity: 0.92 }
            ));
            g.add(cyl(0.014, 0.016, 0.034, 0x3a5874, 0.10, 0.138, -0.05, { seg: 12, ...tubeMat }));
            g.add(box(0.020, 0.012, 0.018, 0xc7d0d8, 0.50, 0.138, -0.10, brushedSteelMat));
            g.add(box(0.018, 0.008, 0.014, 0x6e7884, 0.50, 0.144, -0.10, graphiteMat));

            // Kardiopleji hattı (ince — retractor sağından çıkış)
            g.add(buildClinicalTube(
                [
                    [0.05, 0.166,  0.00],
                    [0.18, 0.156,  0.02],
                    [0.40, 0.134,  0.00],
                    [0.65, 0.122, -0.02],
                    [0.95, 0.110, -0.04]
                ],
                0.007, 0xb89858, { ...tubeMat, transparent: true, opacity: 0.86 }
            ));

            // ETT + anestezi devresi (baş ucu — drape DIŞINDA, y≈0.060)
            const ett = cyl(0.007, 0.007, 0.10, 0xeaf6f8, -0.85, 0.060, 0, {
                seg: 10, transparent: true, opacity: 0.72, roughness: 0.22
            });
            ett.rotation.z = 0.20;
            g.add(ett);
            g.add(cyl(0.012, 0.012, 0.018, 0xfafdff, -0.92, 0.066, 0, { seg: 12, roughness: 0.30 }));
            g.add(cyl(0.014, 0.010, 0.010, 0x9aa6b0, -0.93, 0.066, 0, { seg: 12, ...brushedSteelMat }));

            // Anestezi devresi — baş ucundan -x'e dönen yumuşak hat
            g.add(buildClinicalTube(
                [
                    [-0.94, 0.066, 0],
                    [-1.05, 0.072, 0.02],
                    [-1.18, 0.080, 0.06],
                    [-1.30, 0.090, 0.10]
                ],
                0.018, 0x8a96a2, { ...tubeMat, transparent: true, opacity: 0.86 }
            ));
            // Reinforcement halkaları (tüp eksenine paralel)
            const ringPositions = [
                { p: [-1.00, 0.069, 0.008], rotZ: 0.28 },
                { p: [-1.10, 0.075, 0.030], rotZ: 0.36 },
                { p: [-1.20, 0.082, 0.060], rotZ: 0.46 },
                { p: [-1.27, 0.088, 0.085], rotZ: 0.54 }
            ];
            ringPositions.forEach(rp => {
                const ring = cyl(0.020, 0.020, 0.004, 0x4f5965, rp.p[0], rp.p[1], rp.p[2], {
                    seg: 12, ...graphiteMat
                });
                ring.rotation.z = Math.PI / 2 + rp.rotZ;
                g.add(ring);
            });

            // EKG elektrotları (drape sınırı x=-0.66 dışında, omuz hattı)
            const ekgPositions = [
                { x: -0.72, z:  0.22, c: 0x9c4a4f },
                { x: -0.72, z: -0.22, c: 0x4a8a6d },
                { x: -0.78, z:  0.10, c: 0x3a5874 }
            ];
            ekgPositions.forEach(p => {
                g.add(cyl(0.012, 0.012, 0.005, 0xf3f6f8, p.x, 0.052, p.z, { seg: 12, roughness: 0.55 }));
                g.add(cyl(0.006, 0.006, 0.005, p.c, p.x, 0.057, p.z, {
                    seg: 10, roughness: 0.50, metalness: 0.08
                }));
                const wire = cyl(0.0022, 0.0022, 0.30, p.c, p.x - 0.16, 0.054, p.z, {
                    seg: 6, ...tubeMat, transparent: true, opacity: 0.70
                });
                wire.rotation.z = Math.PI / 2;
                wire.rotation.y = (p.z > 0 ? -1 : 1) * 0.18;
                g.add(wire);
            });

            // A-LINE (radial — sol bilek, kol drape üstü y≈0.060)
            g.add(cyl(0.008, 0.008, 0.014, 0xfafdff, -0.20, 0.072, 0.45, { seg: 12, roughness: 0.30 }));
            g.add(cyl(0.010, 0.006, 0.006, 0x9aa6b0, -0.20, 0.080, 0.45, { seg: 12, ...brushedSteelMat }));
            g.add(buildClinicalTube(
                [
                    [-0.20, 0.074, 0.45],
                    [-0.36, 0.070, 0.50],
                    [-0.55, 0.066, 0.52],
                    [-0.72, 0.062, 0.50]
                ],
                0.0028, 0xb46270, { ...tubeMat, transparent: true, opacity: 0.78 }
            ));

            return g;
        }

        function buildGraftPrepTableV1(x, y, z) {
            // ============================================================
            // PREMIUM GRAFT PREPARATION TABLE v1.0 (CABG-özel back table)
            // Saphenous ven / radial arter / IMA greft hazırlama masası:
            //   - Paslanmaz çelik 4 ayaklı taban + ayar pedalı
            //   - 2-katmanlı raf (alt: yardımcı/extra steril havlular)
            //   - Üstte mavi steril drape örtü (premium katlanmış)
            //   - Soğuk salin tas (saline ile dolu — graft saklamak için)
            //   - Greft (saphen ven) — yıkanmış, küçük halka
            //   - Heparin solüsyonu şişesi
            //   - Distansiyon şırıngası (greft test için)
            //   - Bulldog klemp setleri (ven uçlarını kapat)
            //   - Kalibrasyon mils probu
            //   - Steril havlu yığını
            //   - Kontrol etiketi
            // ============================================================
            const g = groupAt(x, y, z);

            // Renk paleti (cerrahi steril dünya — Mayo ile uyumlu)
            const steel = 0xc8ced4;        // Satin paslanmaz çelik
            const steelDeep = 0x8a929a;
            const graphite = 0x2a3540;
            const drape = 0x1f6f95;        // Steril mavi drape (hasta drapesi ile uyumlu)
            const drapeDark = 0x15536f;
            const drapeLight = 0x2d8db8;
            const saline = 0xc8e0ec;       // Soğuk salin (parlak)
            const veinGreen = 0x2a4d3c;    // Saphen ven (anatomik)
            const veinHighlight = 0x4f7d68;
            const towelWhite = 0xe7edf2;
            const heparinAmber = 0xc89a4a;
            const heparinCap = 0x9b6b1f;

            // === 1) TABAN — 4 ayaklı paslanmaz çelik base + tekerlek ===
            // Merkez kolon
            g.add(cyl(0.045, 0.045, 0.78, steel, 0, 0.39, 0, { seg: 20, roughness: 0.30, metalness: 0.62 }));
            // Kolon pedalı (kilit)
            g.add(cyl(0.060, 0.055, 0.020, graphite, 0, 0.06, 0, { seg: 18, roughness: 0.40 }));
            // 4 yıldız ayak (X şeklinde)
            for (let i = 0; i < 4; i++) {
                const ang = (i * Math.PI) / 2 + Math.PI / 4;
                const ex = Math.cos(ang) * 0.30;
                const ez = Math.sin(ang) * 0.30;
                // Ayak çubuğu
                const legA = new THREE.Vector3(0, 0.055, 0);
                const legB = new THREE.Vector3(ex, 0.055, ez);
                const legGeom = new THREE.CylinderGeometry(0.018, 0.014, 0.30, 12);
                const leg = new THREE.Mesh(legGeom, mat(steel, { roughness: 0.30, metalness: 0.62 }));
                leg.position.copy(legA.clone().add(legB).multiplyScalar(0.5));
                leg.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3().subVectors(legB, legA).normalize()
                );
                prepMesh(leg);
                g.add(leg);
                // Tekerlek
                g.add(cyl(0.034, 0.034, 0.022, graphite, ex, 0.030, ez, { seg: 14, roughness: 0.50 }));
                g.add(cyl(0.018, 0.018, 0.030, steelDeep, ex, 0.040, ez, { seg: 12, metalness: 0.55 }));
            }

            // === 2) MASA TABLASI — 2 katmanlı (alt raf + üst tabla) ===
            // Alt raf
            g.add(box(0.78, 0.020, 0.50, steel, 0, 0.42, 0, { roughness: 0.30, metalness: 0.55 }));
            // Alt rafta yedek steril havlu yığını
            g.add(box(0.18, 0.040, 0.16, towelWhite, -0.22, 0.450, 0, { roughness: 0.62 }));
            g.add(box(0.18, 0.012, 0.16, drapeLight, -0.22, 0.476, 0, { roughness: 0.66 }));
            g.add(box(0.20, 0.030, 0.14, towelWhite, 0.18, 0.445, 0.08, { roughness: 0.62 }));

            // Üst tabla (ana çalışma yüzeyi)
            g.add(box(0.86, 0.030, 0.56, steel, 0, 0.78, 0, { roughness: 0.28, metalness: 0.60 }));
            // Tabla kenar dikişi (graphite)
            g.add(box(0.88, 0.014, 0.58, graphite, 0, 0.795, 0, { roughness: 0.50 }));

            // === 3) STERİL DRAPE ÖRTÜ — mavi, premium katlanmış ===
            // Ana drape örtü (üst tablayı kaplar, kenardan sarkar)
            g.add(box(0.92, 0.014, 0.62, drape, 0, 0.802, 0, { roughness: 0.82 }));
            // Drape kenar sarkmaları (4 kenar)
            g.add(box(0.92, 0.10, 0.014, drape, 0, 0.755, 0.31, { roughness: 0.82 }));
            g.add(box(0.92, 0.10, 0.014, drape, 0, 0.755, -0.31, { roughness: 0.82 }));
            g.add(box(0.014, 0.10, 0.62, drape, 0.46, 0.755, 0, { roughness: 0.82 }));
            g.add(box(0.014, 0.10, 0.62, drape, -0.46, 0.755, 0, { roughness: 0.82 }));
            // Drape kıvrım vurgu çizgileri (premium detay)
            g.add(box(0.86, 0.006, 0.020, drapeLight, 0, 0.810, 0.18, { roughness: 0.78 }));
            g.add(box(0.86, 0.006, 0.020, drapeLight, 0, 0.810, -0.10, { roughness: 0.78 }));
            g.add(box(0.86, 0.006, 0.020, drapeDark, 0, 0.810, 0.04, { roughness: 0.78 }));

            // === 4) SOĞUK SALİN TAS — graft saklama ===
            // Tas dış kabuğu (paslanmaz çelik kase)
            g.add(cyl(0.110, 0.090, 0.060, steel, -0.20, 0.840, 0.08, { seg: 28, roughness: 0.26, metalness: 0.62 }));
            // Tas iç boşluk (tabla rengi gizleniyor — daha koyu)
            g.add(cyl(0.100, 0.082, 0.014, steelDeep, -0.20, 0.866, 0.08, { seg: 28, roughness: 0.32 }));
            // Salin yüzeyi (parlak su)
            g.add(cyl(0.098, 0.098, 0.002, saline, -0.20, 0.872, 0.08, { 
                seg: 28, transparent: true, opacity: 0.78, roughness: 0.10, metalness: 0.12 
            }));
            // Salin yansıma highlight
            g.add(cyl(0.060, 0.060, 0.001, 0xffffff, -0.215, 0.873, 0.06, { 
                seg: 24, transparent: true, opacity: 0.30 
            }));

            // === 5) GREFT (Saphen ven) — tasta kıvrılmış halka ===
            // Ven halkası (torus — soğuk salin içinde)
            const veinTorus = new THREE.Mesh(
                new THREE.TorusGeometry(0.055, 0.005, 8, 32),
                mat(veinGreen, { roughness: 0.45 })
            );
            veinTorus.rotation.x = Math.PI / 2;
            veinTorus.position.set(-0.20, 0.870, 0.08);
            prepMesh(veinTorus);
            g.add(veinTorus);
            // Ven highlight (canlılık)
            const veinHl = new THREE.Mesh(
                new THREE.TorusGeometry(0.055, 0.002, 6, 24, Math.PI),
                mat(veinHighlight, { roughness: 0.40 })
            );
            veinHl.rotation.x = Math.PI / 2;
            veinHl.position.set(-0.20, 0.873, 0.08);
            prepMesh(veinHl);
            g.add(veinHl);
            // Ven uçlarında bulldog klempler (2 küçük metalik klemp)
            g.add(box(0.022, 0.010, 0.038, steelDeep, -0.145, 0.876, 0.08, { metalness: 0.65, roughness: 0.28 }));
            g.add(box(0.022, 0.010, 0.038, steelDeep, -0.255, 0.876, 0.08, { metalness: 0.65, roughness: 0.28 }));

            // === 6) HEPARİN SOLÜSYON ŞİŞESİ (kahverengi cam) ===
            // Şişe gövdesi
            g.add(cyl(0.026, 0.026, 0.075, heparinAmber, -0.06, 0.855, 0.18, { 
                seg: 18, transparent: true, opacity: 0.75, roughness: 0.20, metalness: 0.10 
            }));
            // Sıvı (içeride — koyu)
            g.add(cyl(0.022, 0.022, 0.050, 0x8e6228, -0.06, 0.845, 0.18, { 
                seg: 16, transparent: true, opacity: 0.85, roughness: 0.30 
            }));
            // Şişe kapağı
            g.add(cyl(0.018, 0.020, 0.014, heparinCap, -0.06, 0.900, 0.18, { seg: 14, metalness: 0.55, roughness: 0.30 }));
            // Etiket (beyaz dikdörtgen)
            g.add(box(0.040, 0.030, 0.001, towelWhite, -0.060, 0.860, 0.205, { roughness: 0.42 }));

            // === 7) DİSTANSIYON ŞIRINGASI (greft test/yıkama) ===
            // Şırınga gövdesi (cam saydam)
            const syrBody = cyl(0.014, 0.014, 0.18, 0xeef4f8, 0.06, 0.825, 0.16, { 
                seg: 14, transparent: true, opacity: 0.55, roughness: 0.18 
            });
            syrBody.rotation.z = Math.PI / 6;
            g.add(syrBody);
            // Şırınga pistonu (mavi)
            const syrPiston = cyl(0.010, 0.010, 0.060, drape, 0.130, 0.875, 0.16, { 
                seg: 12, roughness: 0.55 
            });
            syrPiston.rotation.z = Math.PI / 6;
            g.add(syrPiston);
            // Piston başlığı
            g.add(box(0.030, 0.012, 0.030, drapeDark, 0.155, 0.892, 0.16, { roughness: 0.60 }));
            // İğne ucu (luer)
            g.add(cyl(0.005, 0.005, 0.018, steel, -0.020, 0.776, 0.16, { 
                seg: 10, metalness: 0.70, roughness: 0.22 
            }));
            // Şırınga grade çizgileri (3 ince çizgi)
            for (let i = 0; i < 5; i++) {
                const t = -0.06 + i * 0.030;
                const ring = cyl(0.0145, 0.0145, 0.0008, graphite, 0.06 + t * 0.866, 0.825 + t * 0.5, 0.16, { 
                    seg: 12, roughness: 0.50 
                });
                ring.rotation.z = Math.PI / 6;
                g.add(ring);
            }

            // === 8) MİL/CALIBRATION PROB SETİ (greft kalibrasyonu için) ===
            // Set tutucu (küçük graphite blok)
            g.add(box(0.090, 0.018, 0.060, graphite, 0.18, 0.821, -0.10, { roughness: 0.50 }));
            // 3 farklı kalibrasyon probu (1.5/2/2.5/3 mm)
            [-0.030, -0.010, 0.010, 0.030].forEach((dx, idx) => {
                const r = 0.0035 + idx * 0.0008;
                g.add(cyl(r, r, 0.080, steel, 0.18 + dx, 0.870, -0.10, { 
                    seg: 10, metalness: 0.78, roughness: 0.18 
                }));
                // Mil sap (renk kod halkası)
                const codeColor = [0x9d2f2f, 0xc89a4a, 0x4f7d68, 0x1e5f9f][idx];
                g.add(cyl(r + 0.002, r + 0.002, 0.012, codeColor, 0.18 + dx, 0.838, -0.10, { 
                    seg: 10, roughness: 0.45 
                }));
            });

            // === 9) BULLDOG KLEMP SETİ (ven uçları için ek klempler) ===
            // Klemp tepsi
            g.add(box(0.14, 0.010, 0.080, steelDeep, 0.30, 0.820, 0.06, { roughness: 0.40, metalness: 0.50 }));
            // 4 küçük klemp (üst üste dizilmiş)
            for (let i = 0; i < 4; i++) {
                const ox = 0.260 + i * 0.024;
                g.add(box(0.018, 0.008, 0.030, steelDeep, ox, 0.832, 0.06, { metalness: 0.65, roughness: 0.28 }));
                g.add(box(0.004, 0.012, 0.022, graphite, ox, 0.840, 0.06, { roughness: 0.40 }));
            }

            // === 10) STERİL HAVLU YIĞINI (üst tablada — graft kurutma için) ===
            // 3 katlı havlu yığını
            g.add(box(0.18, 0.014, 0.12, towelWhite, 0.22, 0.824, -0.18, { roughness: 0.62 }));
            g.add(box(0.18, 0.010, 0.12, drapeLight, 0.22, 0.834, -0.18, { roughness: 0.66 }));
            g.add(box(0.18, 0.014, 0.12, towelWhite, 0.22, 0.844, -0.18, { roughness: 0.62 }));
            // Havlu kıvrımları
            g.add(box(0.18, 0.002, 0.005, drapeDark, 0.22, 0.852, -0.18, { roughness: 0.70 }));

            // === 11) ETİKET (steril/ID) ===
            g.add(box(0.080, 0.001, 0.040, towelWhite, -0.36, 0.820, 0.22, { roughness: 0.50 }));
            // Etiket üstü mavi şerit
            g.add(box(0.080, 0.001, 0.010, drape, -0.36, 0.821, 0.234, { roughness: 0.55 }));

            // === 12) BACK TABLE REZERV / STERİL STOK ZONU ===
            // Mayo masası aktif teslim alanı olarak kalır; bu bölüm yedek set, sutür,
            // ekstra gaz ve graft hazırlama materyallerini düzenli tutan back-table mantığını görünür kılar.
            g.add(box(0.34, 0.006, 0.150, 0x0f3346, -0.30, 0.824, -0.155, {
                emissive: 0x1f6f95, emissiveIntensity: 0.05, transparent: true, opacity: 0.36, roughness: 0.78
            }));
            // Steril paket kasetleri
            for (let i = 0; i < 4; i++) {
                g.add(box(0.070, 0.014, 0.050, towelWhite, -0.420 + i * 0.075, 0.836, -0.155, { roughness: 0.62 }));
                g.add(box(0.052, 0.002, 0.010, [drapeLight, heparinAmber, veinHighlight, steelDeep][i], -0.420 + i * 0.075, 0.844, -0.132, {
                    emissive: [drapeLight, heparinAmber, veinHighlight, steelDeep][i], emissiveIntensity: 0.08, roughness: 0.58
                }));
            }
            // Sutür rack: numaralı paketler için dikey küçük kaset
            g.add(box(0.060, 0.018, 0.210, graphite, 0.385, 0.825, -0.050, { roughness: 0.48, metalness: 0.18 }));
            [-0.120, -0.080, -0.040, 0.000, 0.040].forEach((zz, i) => {
                const colors = [0x9d2f2f, 0xc89a4a, 0x4f7d68, 0x1e5f9f, 0x7b58a6];
                g.add(box(0.046, 0.010, 0.024, colors[i], 0.385, 0.842, zz, {
                    roughness: 0.52, emissive: colors[i], emissiveIntensity: 0.08
                }));
                g.add(box(0.032, 0.001, 0.012, towelWhite, 0.385, 0.849, zz, { roughness: 0.50 }));
            });
            // Alet kaseti / yedek mikro-klemp alanı
            g.add(box(0.150, 0.012, 0.070, steelDeep, 0.090, 0.824, -0.245, { roughness: 0.36, metalness: 0.55 }));
            [0, 1, 2].forEach(i => {
                g.add(box(0.032, 0.006, 0.010, steel, 0.045 + i * 0.040, 0.836, -0.245, { roughness: 0.24, metalness: 0.70 }));
            });

            // === 13) PARALEL OPERATİF ALAN + IMA/SAFEN DİSEKSİYON ÖĞRETİMİ ===
            // Back table operatif alana paralel iki görünür kondüit zonuyla ayrılır.
            // Bu alan ayrı OSCE değildir; GCKL görev puanlamasına bağlı görsel öğrenme objesidir.
            g.add(box(0.42, 0.003, 0.14, 0xc16f68, -0.09, 0.815, -0.265, {
                transparent: true, opacity: 0.22, roughness: 0.72, emissive: 0xc16f68, emissiveIntensity: 0.07
            }));
            g.add(box(0.42, 0.003, 0.14, 0x4f7d68, -0.09, 0.815, -0.105, {
                transparent: true, opacity: 0.24, roughness: 0.72, emissive: 0x4f7d68, emissiveIntensity: 0.07
            }));
            // Operatif alana paralel hizayı gösteren ince steril sınır çizgileri.
            g.add(box(0.46, 0.002, 0.006, towelWhite, -0.09, 0.818, -0.185, { roughness: 0.58 }));
            g.add(box(0.006, 0.002, 0.310, towelWhite, -0.315, 0.818, -0.185, { roughness: 0.58 }));
            // IMA ve SAFEN etiket şeritleri.
            g.add(box(0.100, 0.004, 0.024, 0xc16f68, -0.36, 0.821, -0.265, {
                emissive: 0xc16f68, emissiveIntensity: 0.13, roughness: 0.45
            }));
            g.add(box(0.110, 0.004, 0.026, 0x4f7d68, -0.36, 0.821, -0.105, {
                emissive: 0x4f7d68, emissiveIntensity: 0.13, roughness: 0.45
            }));
            // IMA pedikülü: ince, daha düz ve arteriyel tonda; pedikül dokusu yarı saydam.
            const imaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.25, 0.838, -0.265),
                new THREE.Vector3(-0.12, 0.846, -0.252),
                new THREE.Vector3( 0.02, 0.836, -0.277),
                new THREE.Vector3( 0.17, 0.846, -0.255)
            ]);
            const imaPedicle = new THREE.Mesh(
                new THREE.TubeGeometry(imaCurve, 36, 0.011, 8, false),
                mat(0xe9d6b6, { roughness: 0.70, transparent: true, opacity: 0.48 })
            );
            prepMesh(imaPedicle); g.add(imaPedicle);
            const imaTube = new THREE.Mesh(
                new THREE.TubeGeometry(imaCurve, 42, 0.0052, 8, false),
                mat(0xc98983, { roughness: 0.40 })
            );
            prepMesh(imaTube); g.add(imaTube);
            [-0.18, -0.04, 0.10].forEach((xx, idx) => {
                g.add(box(0.010, 0.006, 0.018, idx % 2 === 0 ? steelDeep : heparinCap, xx, 0.849, -0.255 + (idx % 2 ? 0.016 : -0.014), {
                    metalness: 0.58, roughness: 0.26
                }));
            });
            // Safen segmenti: hafif kıvrımlı, heparinli salin dışı kalite kontrol hattında görünür.
            const saphCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.24, 0.836, -0.105),
                new THREE.Vector3(-0.10, 0.848, -0.080),
                new THREE.Vector3( 0.04, 0.832, -0.130),
                new THREE.Vector3( 0.20, 0.844, -0.098)
            ]);
            const saphTube = new THREE.Mesh(
                new THREE.TubeGeometry(saphCurve, 42, 0.0075, 8, false),
                mat(veinGreen, { roughness: 0.44 })
            );
            prepMesh(saphTube); g.add(saphTube);
            const saphHighlight = new THREE.Mesh(
                new THREE.TubeGeometry(saphCurve, 22, 0.0035, 6, false),
                mat(veinHighlight, { roughness: 0.38 })
            );
            prepMesh(saphHighlight); g.add(saphHighlight);
            // Safen uç oryantasyonu ve yan dal klipsleri.
            g.add(box(0.018, 0.008, 0.022, steelDeep, -0.24, 0.844, -0.105, { metalness: 0.62, roughness: 0.24 }));
            g.add(box(0.018, 0.008, 0.022, steelDeep,  0.20, 0.846, -0.098, { metalness: 0.62, roughness: 0.24 }));
            [-0.15, -0.02, 0.10].forEach((xx, idx) => {
                g.add(box(0.010, 0.006, 0.018, idx % 2 === 0 ? steelDeep : heparinCap, xx, 0.849, -0.105 + (idx % 2 ? 0.020 : -0.016), {
                    metalness: 0.58, roughness: 0.26
                }));
            });
            // Nazik distansiyon / aşırı basınçtan kaçınma hatırlatıcı şırınga çizgisi.
            const distLine = new THREE.Mesh(
                new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0.04, 0.850, 0.16),
                    new THREE.Vector3(0.00, 0.856, 0.05),
                    new THREE.Vector3(-0.06, 0.850, -0.10)
                ]), 18, 0.002, 6, false),
                mat(0xc8e0ec, { transparent: true, opacity: 0.72, roughness: 0.30 })
            );
            prepMesh(distLine); g.add(distLine);
            // GCKL kalite kartı: ayrı sınav değil, görev puanlaması bağlantısı.
            g.add(box(0.19, 0.003, 0.110, towelWhite, 0.30, 0.819, 0.20, { roughness: 0.54 }));
            g.add(box(0.19, 0.003, 0.014, drape, 0.30, 0.821, 0.236, { roughness: 0.50 }));
            [0xc16f68, 0x4f7d68, 0xe0a558, 0x5cc4d6].forEach((cc, i) => {
                g.add(cyl(0.008, 0.008, 0.003, cc, 0.232 + i * 0.042, 0.823, 0.184, {
                    seg: 12, emissive: cc, emissiveIntensity: 0.10, roughness: 0.40
                }));
            });

            return g;
        }

        function buildCPBMachineV151(x, y, z) {
            // ULTRA-PREMIUM CPB MACHINE v8.5
            // Maquet HL30 / LivaNova S5 / Stockert SCPC referanslı modern
            // entegre kalp-akciğer makinesi (extracorporeal circulation system).
            // 
            // Premium detaylar:
            //   - 3 katmanlı platform (alt taban + ana gövde + üst konsol)
            //   - 4 modüler pompa kafası (renkli + rotor animasyonlu)
            //   - Membran oksjenatör (transparan + kabarcık görselleri)
            //   - Sert kabuk venöz rezervuar (2 sıvı seviyesi göstergeli)
            //   - Isı değiştirici (sıcak kırmızı + soğuk mavi bağlantı)
            //   - Çift premium ekran + 3. yardımcı gaz analiz ekranı
            //   - Boom kolu yan kontrol modülü
            //   - 6 sensör + vana portu
            //   - Renkli tüp seti (arteriyel/venöz/kardiopleji)
            //   - 4 anti-static tekerlek + kilit pedal LED
            const g = groupAt(x, y, z);
            const chromeMat = { metalness: 0.55, roughness: 0.18 };
            const matteCarbon = { metalness: 0.20, roughness: 0.42 };
            const glossWhite = { metalness: 0.30, roughness: 0.14 };
            
            // ===========================================================
            // ALT TABAN PLATFORMU (geniş, krom çerçeveli)
            // ===========================================================
            // Ana taban (siyah-mavi premium)
            g.add(box(1.30, 0.10, 0.78, 0x1a2230, 0, 0.05, 0, { 
                metalness: 0.20, roughness: 0.40 
            }));
            // Üst aksent şeridi (turkuaz LED)
            g.add(box(1.22, 0.014, 0.78, 0x4cd6c4, 0, 0.107, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.36 
            }));
            // Yan accent şeridi (uzun kenarlar)
            [-0.39, 0.39].forEach(zz => {
                g.add(box(1.30, 0.014, 0.012, 0x88e0d4, 0, 0.107, zz, { 
                    emissive: 0x88e0d4, emissiveIntensity: 0.30 
                }));
            });
            
            // ===========================================================
            // 4 PREMIUM TEKERLEK + kilit pedal LED
            // ===========================================================
            [-0.55, 0.55].forEach(xx => [-0.32, 0.32].forEach(zz => {
                // Tekerlek
                const w = cyl(0.058, 0.058, 0.038, 0x1a2230, xx, 0.058, zz, { 
                    seg: 16, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
                // Krom hub
                const hub = cyl(0.028, 0.028, 0.042, 0xc7d3dc, xx, 0.058, zz, { 
                    seg: 14, metalness: 0.65, roughness: 0.16 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
                // Kilit pedal LED (yeşil = açık)
                g.add(cyl(0.012, 0.012, 0.014, 0x4cb88a, xx, 0.058, 
                    zz + (zz > 0 ? 0.066 : -0.066), { 
                    seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.55 
                }));
            }));
            
            // ===========================================================
            // ANA GÖVDE (premium 2 katmanlı)
            // ===========================================================
            // Alt geniş kasa (beyaz-krem premium)
            g.add(box(1.24, 0.42, 0.70, 0xeef3f7, 0, 0.32, 0, { 
                metalness: 0.20, roughness: 0.20 
            }));
            // Alt kasa accent şeridi
            g.add(box(1.18, 0.014, 0.70, 0x4cd6c4, 0, 0.535, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.34 
            }));
            // Üst gövde (siyah-mavi premium)
            g.add(box(1.24, 0.50, 0.70, 0x1c2c3a, 0, 0.79, 0, { 
                metalness: 0.18, roughness: 0.32 
            }));
            // Üst gövde accent
            g.add(box(1.18, 0.014, 0.70, 0x4cd6c4, 0, 1.045, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.40 
            }));
            // Sol marka logosu (premium badge)
            g.add(box(0.060, 0.040, 0.018, 0x4cd6c4, -0.55, 0.79, 0.358, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.50 
            }));
            // Yan ventilasyon (sağ)
            g.add(box(0.020, 0.32, 0.36, 0x0e1821, 0.626, 0.79, 0, { 
                roughness: 0.40 
            }));
            [0.66, 0.74, 0.82, 0.90, 0.98].forEach(yy => {
                g.add(box(0.024, 0.012, 0.32, 0x2a3540, 0.626, yy, 0, { roughness: 0.38 }));
            });
            
            // ===========================================================
            // ÜST KONSOL (perfüzyonist arayüzü — geniş premium pano)
            // ===========================================================
            // Konsol kasası (yatay düz pano)
            g.add(box(1.16, 0.46, 0.18, 0x0e1821, 0, 1.27, 0, { 
                roughness: 0.20, metalness: 0.20 
            }));
            // Konsol üst aksent
            g.add(box(1.12, 0.014, 0.18, 0x4cd6c4, 0, 1.495, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.45 
            }));
            
            // ===========================================================
            // ÇİFT PREMIUM EKRAN (üst konsol)
            // ===========================================================
            // SOL EKRAN — Hemodinami / akış değerleri
            g.add(box(0.50, 0.32, 0.030, 0x0a1418, -0.32, 1.27, 0.095, { 
                roughness: 0.16, emissive: 0x0a1418, emissiveIntensity: 0.08 
            }));
            // Aktif ekran
            g.add(box(0.46, 0.28, 0.020, 0x2aaec1, -0.32, 1.27, 0.111, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.50 
            }));
            // Akış grafiği (3 dalga - arteriyel/venöz/kardiopleji)
            [-0.080, -0.020, 0.040].forEach((dy, i) => {
                const colors = [0xd96371, 0x6f9fd8, 0x4cb88a];
                g.add(box(0.40, 0.014, 0.014, colors[i], -0.32, 1.27 + dy, 0.118, { 
                    emissive: colors[i], emissiveIntensity: 0.55 
                }));
                // Mini değer kutuları
                g.add(box(0.05, 0.030, 0.014, 0xfafdff, -0.50, 1.27 + dy, 0.118, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.40 
                }));
            });
            // Üst başlık şeridi
            g.add(box(0.40, 0.020, 0.014, 0xfff8d4, -0.32, 1.385, 0.118, { 
                emissive: 0xfff8d4, emissiveIntensity: 0.40 
            }));
            
            // SAĞ EKRAN — Pompa kontrol parametreleri  
            g.add(box(0.50, 0.32, 0.030, 0x0a1418, 0.18, 1.27, 0.095, { 
                roughness: 0.16, emissive: 0x0a1418, emissiveIntensity: 0.08 
            }));
            g.add(box(0.46, 0.28, 0.020, 0x6f9fd8, 0.18, 1.27, 0.111, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.50 
            }));
            // 4 pompa hızı bar göstergesi (0-100 dolu)
            [-0.140, -0.046, 0.046, 0.140].forEach((dx, i) => {
                const heights = [0.18, 0.14, 0.16, 0.10];
                g.add(box(0.030, heights[i], 0.014, [0xd96371, 0x4cb88a, 0xe0a558, 0x6f9fd8][i], 
                    0.18 + dx, 1.20 + heights[i]/2 - 0.09, 0.118, { 
                    emissive: [0xd96371, 0x4cb88a, 0xe0a558, 0x6f9fd8][i], 
                    emissiveIntensity: 0.55 
                }));
            });
            
            // 3. YARDIMCI EKRAN (gaz analizi - sağ uçta küçük dik)
            g.add(box(0.20, 0.30, 0.030, 0x0a1418, 0.50, 1.27, 0.095, { 
                roughness: 0.18 
            }));
            g.add(box(0.16, 0.26, 0.020, 0x4cb88a, 0.50, 1.27, 0.111, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.45 
            }));
            // pH/PaO2/PaCO2 değer satırları
            [-0.080, -0.020, 0.040, 0.090].forEach((dy, i) => {
                g.add(box(0.10, 0.014, 0.014, 0xfafdff, 0.50, 1.27 + dy, 0.118, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.40 
                }));
            });
            
            // ===========================================================
            // 4 PREMIUM POMPA KAFASI (animasyonlu rotor)
            // ===========================================================
            const pumpY = 0.78;
            [-0.40, -0.13, 0.14, 0.41].forEach((dx, i) => {
                const colors = [0xd96371, 0x4cb88a, 0xe0a558, 0x6f9fd8];
                const labels = ['ART', 'VEN', 'CARD', 'AUX'];
                
                // Pompa silindirik kasası (büyük)
                g.add(cyl(0.090, 0.090, 0.20, 0x4a5e72, dx, pumpY, 0.30, { 
                    seg: 24, metalness: 0.40, roughness: 0.22 
                }));
                // Üst kapak (renk kodlu)
                g.add(cyl(0.094, 0.094, 0.020, colors[i], dx, pumpY + 0.110, 0.30, { 
                    seg: 24, emissive: colors[i], emissiveIntensity: 0.55 
                }));
                // Pompa rotor (animasyonlu)
                const rotor = cyl(0.070, 0.070, 0.024, 0xfafdff, dx, pumpY + 0.124, 0.30, { 
                    seg: 18, roughness: 0.30, metalness: 0.35 
                });
                g.add(rotor);
                addAnimated(rotor, 'clinicalSpin', { speed: 1.6 + i * 0.15 });
                // Rotor merkez vidası
                g.add(cyl(0.014, 0.014, 0.030, 0x6f8798, dx, pumpY + 0.130, 0.30, { 
                    seg: 12, metalness: 0.65 
                }));
                // Yan etiket
                g.add(box(0.050, 0.080, 0.014, colors[i], dx, pumpY, 0.395, { 
                    emissive: colors[i], emissiveIntensity: 0.40 
                }));
                // Aktif LED (alt)
                g.add(cyl(0.010, 0.010, 0.010, 0x4cb88a, dx, pumpY - 0.08, 0.395, { 
                    seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.65 
                }));
                // Hız değer ekranı (mini)
                g.add(box(0.040, 0.030, 0.014, 0x0e1821, dx, pumpY + 0.06, 0.395, { 
                    roughness: 0.20 
                }));
                g.add(box(0.034, 0.022, 0.014, 0xfafdff, dx, pumpY + 0.06, 0.402, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.30 
                }));
            });
            
            // ===========================================================
            // MEMBRAN OKSJENATÖR (transparan silindir + kabarcık görseli)
            // ===========================================================
            // Ana oksjenatör gövdesi (transparan)
            g.add(cyl(0.10, 0.10, 0.32, 0xa8d4df, -0.55, 0.50, -0.20, { 
                seg: 28, transparent: true, opacity: 0.55, roughness: 0.20 
            }));
            // İç membran (orta - daha az transparan)
            g.add(cyl(0.080, 0.080, 0.30, 0xc4e6ed, -0.55, 0.50, -0.20, { 
                seg: 22, transparent: true, opacity: 0.40, roughness: 0.18 
            }));
            // Üst kapak (krom)
            g.add(cyl(0.105, 0.105, 0.020, 0x6f8798, -0.55, 0.670, -0.20, { 
                seg: 24, metalness: 0.55, roughness: 0.18 
            }));
            // Alt kapak
            g.add(cyl(0.105, 0.105, 0.020, 0x6f8798, -0.55, 0.330, -0.20, { 
                seg: 24, metalness: 0.55, roughness: 0.18 
            }));
            // Kabarcıklar (3 küçük sphere - oksijenizasyon görseli)
            [0.40, 0.50, 0.60].forEach((yy, i) => {
                g.add(sphere(0.014 + i * 0.003, 0xfafdff, -0.55, yy, -0.165, { 
                    transparent: true, opacity: 0.65, emissive: 0xfafdff, emissiveIntensity: 0.30 
                }));
            });
            // Yan etiket "OXYGENATOR"
            g.add(box(0.040, 0.030, 0.014, 0x4cb88a, -0.55, 0.65, -0.10, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.50 
            }));
            
            // ===========================================================
            // SERT KABUK VENÖZ REZERVUAR (sıvı seviyesi göstergeli)
            // ===========================================================
            // Ana rezervuar kasası
            g.add(box(0.24, 0.40, 0.22, 0xa8d4df, -0.34, 0.52, -0.20, { 
                transparent: true, opacity: 0.55, roughness: 0.22 
            }));
            // Sıvı seviyesi (mavi - venöz kan rengi)
            g.add(box(0.20, 0.22, 0.18, 0x4a7099, -0.34, 0.42, -0.20, { 
                transparent: true, opacity: 0.78 
            }));
            // Hava boşluğu (üst - şeffaf)
            g.add(box(0.20, 0.10, 0.18, 0xeaf6f8, -0.34, 0.62, -0.20, { 
                transparent: true, opacity: 0.30 
            }));
            // Sıvı seviyesi göstergesi (yan dik bar)
            g.add(box(0.014, 0.30, 0.014, 0x0e1821, -0.222, 0.52, -0.15, { 
                roughness: 0.20 
            }));
            // Seviye LED'leri (5 nokta - aktif olanlar yanar)
            [0.40, 0.46, 0.52, 0.58, 0.64].forEach((yy, i) => {
                const lit = i < 3;
                g.add(box(0.020, 0.014, 0.012, lit ? 0x4cb88a : 0x2a3540, 
                    -0.222, yy, -0.135, { 
                    emissive: lit ? 0x4cb88a : 0x000000, 
                    emissiveIntensity: lit ? 0.55 : 0 
                }));
            });
            // Üst kapak
            g.add(box(0.26, 0.020, 0.24, 0x6f8798, -0.34, 0.730, -0.20, { 
                metalness: 0.50, roughness: 0.20 
            }));
            // Etiket
            g.add(box(0.040, 0.030, 0.014, 0x6f9fd8, -0.34, 0.72, -0.05, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.45 
            }));
            
            // ===========================================================
            // ISI DEĞİŞTİRİCİ (sıcak/soğuk modül - sağ yan)
            // ===========================================================
            // Ana ısı değiştirici gövdesi
            g.add(box(0.18, 0.30, 0.20, 0x4a5e72, 0.30, 0.46, -0.20, { 
                metalness: 0.35, roughness: 0.22 
            }));
            // Sıcak bağlantı (kırmızı LED + tüp)
            g.add(cyl(0.014, 0.014, 0.10, 0xd96371, 0.30, 0.55, -0.10, { 
                seg: 12, emissive: 0xd96371, emissiveIntensity: 0.55 
            }));
            // Soğuk bağlantı (mavi LED + tüp)
            g.add(cyl(0.014, 0.014, 0.10, 0x6f9fd8, 0.30, 0.40, -0.10, { 
                seg: 12, emissive: 0x6f9fd8, emissiveIntensity: 0.55 
            }));
            // Sıcaklık dijital ekranı
            g.add(box(0.10, 0.040, 0.014, 0x0e1821, 0.30, 0.60, -0.099, { 
                roughness: 0.20 
            }));
            g.add(box(0.080, 0.025, 0.014, 0xfff8d4, 0.30, 0.60, -0.092, { 
                emissive: 0xfff8d4, emissiveIntensity: 0.45 
            }));
            // Etiket "HX"
            g.add(box(0.030, 0.024, 0.014, 0xe0a558, 0.30, 0.30, -0.099, { 
                emissive: 0xe0a558, emissiveIntensity: 0.45 
            }));
            
            // ===========================================================
            // RENKLİ TÜP SETİ (arteriyel/venöz/kardiopleji bağlantıları)
            // ===========================================================
            // Arteriyel tüp (kırmızı - oksjenatörden çıkış → hastaya)
            const artTube = cyl(0.018, 0.018, 0.55, 0xd96371, -0.50, 0.85, 0.10, { 
                seg: 14, transparent: true, opacity: 0.78, roughness: 0.25 
            });
            artTube.rotation.z = -0.40;
            g.add(artTube);
            
            // Venöz tüp (mavi - hastadan rezervuara)
            const venTube = cyl(0.020, 0.020, 0.50, 0x4a7099, -0.20, 0.85, 0.05, { 
                seg: 14, transparent: true, opacity: 0.78, roughness: 0.25 
            });
            venTube.rotation.z = -0.30;
            g.add(venTube);
            
            // Kardiopleji tüp (yeşil)
            const cardTube = cyl(0.014, 0.014, 0.42, 0x4cb88a, 0.10, 0.78, 0.10, { 
                seg: 12, transparent: true, opacity: 0.72, roughness: 0.25 
            });
            cardTube.rotation.z = -0.20;
            g.add(cardTube);
            
            // ===========================================================
            // ÖN PERFÜZYONIST KONTROL PANELİ (alt ön yüz)
            // ===========================================================
            // Ana panel kasası
            g.add(box(0.94, 0.20, 0.024, 0x0e1821, 0, 0.36, 0.345, { 
                roughness: 0.20, metalness: 0.18 
            }));
            // Aktif dokunmatik bölüm
            g.add(box(0.50, 0.14, 0.020, 0x2aaec1, -0.10, 0.36, 0.359, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.40 
            }));
            // 4 fizik knobu (renkli)
            [-0.40, -0.32, -0.24, -0.16].forEach((dx, i) => {
                const colors = [0xd96371, 0x4cb88a, 0xe0a558, 0x6f9fd8];
                g.add(cyl(0.024, 0.024, 0.018, colors[i], dx, 0.40, 0.359, { 
                    seg: 14, emissive: colors[i], emissiveIntensity: 0.45 
                }));
                // Knob işareti
                g.add(box(0.014, 0.005, 0.005, 0xfafdff, dx, 0.420, 0.362, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.30 
                }));
            });
            // 3 slider (akış kontrolü)
            [-0.40, -0.32, -0.24].forEach((dx, i) => {
                g.add(box(0.060, 0.012, 0.014, 0x4a5e72, dx, 0.30, 0.359, { roughness: 0.30 }));
                g.add(cyl(0.010, 0.010, 0.014, 0x4cd6c4, dx, 0.30, 0.366, { 
                    seg: 12, emissive: 0x4cd6c4, emissiveIntensity: 0.55 
                }));
            });
            // Acil durma mantar butonu (büyük kırmızı)
            g.add(cyl(0.038, 0.038, 0.022, 0xd96371, 0.36, 0.36, 0.355, { 
                seg: 16, emissive: 0xd96371, emissiveIntensity: 0.55 
            }));
            // Acil durma yazısı
            g.add(box(0.10, 0.014, 0.014, 0xfafdff, 0.36, 0.30, 0.362, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            
            // ===========================================================
            // BOOM KOLU (sağ yan - kontrol modülü uzantısı)
            // ===========================================================
            // Boom mafsalı
            g.add(sphere(0.034, 0xa7b7c4, 0.62, 1.30, 0.20, { ...chromeMat }));
            // Boom kolu (sağa uzanır)
            g.add(box(0.32, 0.030, 0.030, 0xb8c4cf, 0.78, 1.30, 0.20, chromeMat));
            // Boom ucu mafsal
            g.add(sphere(0.030, 0xa7b7c4, 0.94, 1.30, 0.20, { ...chromeMat }));
            // Yan kontrol panel (boom ucunda)
            g.add(box(0.24, 0.16, 0.030, 0x0e1821, 0.96, 1.18, 0.20, { 
                roughness: 0.20, metalness: 0.20 
            }));
            // Aktif ekran
            g.add(box(0.20, 0.13, 0.020, 0x2aaec1, 0.96, 1.18, 0.216, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.45 
            }));
            // 3 mini buton
            [-0.060, 0, 0.060].forEach((dx, i) => {
                g.add(cyl(0.012, 0.012, 0.012, [0x4cb88a, 0xe0a558, 0xd96371][i], 
                    0.96 + dx, 1.10, 0.222, { 
                    seg: 12, emissive: [0x4cb88a, 0xe0a558, 0xd96371][i], 
                    emissiveIntensity: 0.55 
                }));
            });
            
            // ===========================================================
            // SENSÖR + VANA PORTLARI (alt yan - 6 adet)
            // ===========================================================
            [-0.45, -0.30, -0.15, 0, 0.15, 0.30].forEach((dx, i) => {
                // Port kasası
                g.add(cyl(0.014, 0.014, 0.020, 0x6f8798, dx, 0.20, 0.358, { 
                    seg: 12, metalness: 0.50, roughness: 0.20 
                }));
                // Port LED (sırayla farklı renkler)
                const colors = [0xd96371, 0x6f9fd8, 0x4cb88a, 0xe0a558, 0x4cd6c4, 0xfff8d4];
                g.add(cyl(0.008, 0.008, 0.008, colors[i], dx, 0.20, 0.366, { 
                    seg: 10, emissive: colors[i], emissiveIntensity: 0.55 
                }));
            });
            
            return g;
        }

        function buildSuctionSmokeUnitV151(x, y, z) {
            // ULTRA-PREMIUM SUCTION + SMOKE EVAC TOWER v9.0
            // Buffalo Filter ViroSafe / Stryker Neptune referanslı.
            // Modern güçlü modüler kule — HEPA üst filtre, 2 büyük şeffaf
            // kavanoz, ayrı çapta hortumlar, dijital kontrol paneli.
            const g = groupAt(x, y, z);
            const chromeMat = { metalness: 0.50, roughness: 0.18 };
            const matteCarbon = { metalness: 0.18, roughness: 0.45 };
            const glossWhite = { metalness: 0.22, roughness: 0.22 };
            
            // ==========================================================
            // ALT TABAN + 4 KİLİTLİ TEKERLEK
            // ==========================================================
            g.add(box(0.56, 0.06, 0.50, 0x2a3540, 0, 0.030, 0, { 
                metalness: 0.30, roughness: 0.40 
            }));
            g.add(box(0.54, 0.006, 0.50, 0x88e0d4, 0, 0.064, 0, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.18, transparent: true, opacity: 0.55 
            }));
            
            [-0.22, 0.22].forEach(xx => [-0.20, 0.20].forEach(zz => {
                g.add(box(0.026, 0.040, 0.026, 0x4a5e72, xx, 0.044, zz, { 
                    metalness: 0.40, roughness: 0.24 
                }));
                const w = cyl(0.040, 0.040, 0.028, 0x1a2230, xx, 0.022, zz, { 
                    seg: 14, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
                const hub = cyl(0.020, 0.020, 0.032, 0xb8c4cf, xx, 0.022, zz, { 
                    seg: 12, metalness: 0.55, roughness: 0.18 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
                g.add(box(0.014, 0.008, 0.018, 0x4cb88a, xx, 0.022, 
                    zz + (zz > 0 ? 0.030 : -0.030), { 
                    emissive: 0x4cb88a, emissiveIntensity: 0.40 
                }));
            }));
            
            // ==========================================================
            // ALT MODÜL: Pompa + güç (zeminden 0.06 → 0.40)
            // ==========================================================
            g.add(box(0.46, 0.34, 0.42, 0xc7d0d8, 0, 0.24, 0, { ...glossWhite }));
            // Yan grafit panel (sol)
            g.add(box(0.014, 0.32, 0.40, 0x2a3540, -0.224, 0.24, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            // Yan grafit panel (sağ)
            g.add(box(0.014, 0.32, 0.40, 0x2a3540, 0.224, 0.24, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            
            // Ön havalandırma ızgarası
            [0.16, 0.22, 0.28, 0.34].forEach(yy => {
                g.add(box(0.36, 0.014, 0.010, 0x4a5e72, 0, yy, 0.211, { roughness: 0.36 }));
            });
            // Yeşil aktif vakum LED
            g.add(cyl(0.014, 0.014, 0.008, 0x4cb88a, -0.18, 0.380, 0.214, { 
                seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.55 
            }));
            // VAC label (yeşil yanında)
            g.add(box(0.040, 0.010, 0.012, 0x4cb88a, -0.13, 0.380, 0.214, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.30, transparent: true, opacity: 0.70 
            }));
            
            // ==========================================================
            // ORTA MODÜL: 2 BÜYÜK ŞEFFAF KAVANOZ (0.40 → 0.92)
            // ==========================================================
            // Montaj rafı
            g.add(box(0.46, 0.030, 0.42, 0xb8c4cf, 0, 0.420, 0, { 
                metalness: 0.40, roughness: 0.24 
            }));
            // Arka koruma kasası (gri grafit)
            g.add(box(0.46, 0.50, 0.10, 0xc7d0d8, 0, 0.690, -0.16, { ...glossWhite }));
            
            // 2 BÜYÜK KAVANOZ
            [-0.13, 0.13].forEach(dx => {
                // Cam kavanoz (büyük, premium)
                g.add(cyl(0.085, 0.085, 0.42, 0xeaf6f8, dx, 0.660, 0.04, { 
                    seg: 28, transparent: true, opacity: 0.42, roughness: 0.12, metalness: 0.20 
                }));
                // İç kırmızı sıvı seviyesi (yarı transparan, klinik)
                g.add(cyl(0.078, 0.078, 0.18, 0xa84a52, dx, 0.540, 0.04, { 
                    seg: 24, transparent: true, opacity: 0.62, roughness: 0.32 
                }));
                // Sıvı üst yüzeyi (highlight)
                g.add(cyl(0.076, 0.076, 0.005, 0xc46070, dx, 0.632, 0.04, { 
                    seg: 24, transparent: true, opacity: 0.78, 
                    emissive: 0xc46070, emissiveIntensity: 0.20 
                }));
                // Üst kapak (krom premium)
                g.add(cyl(0.090, 0.090, 0.022, 0x6f8798, dx, 0.880, 0.04, { 
                    seg: 24, metalness: 0.55, roughness: 0.18 
                }));
                // Üst kapak halkası
                const lidRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.087, 0.005, 6, 24),
                    mat(0xc7d3dc, { metalness: 0.65, roughness: 0.16 })
                );
                lidRing.rotation.x = Math.PI / 2;
                lidRing.position.set(dx, 0.892, 0.04);
                prepMesh(lidRing); g.add(lidRing);
                // Çıkış portu
                g.add(cyl(0.014, 0.014, 0.024, 0x2a3540, dx, 0.905, 0.04, { 
                    seg: 12, metalness: 0.40 
                }));
                // Alt kapak
                g.add(cyl(0.090, 0.090, 0.022, 0x6f8798, dx, 0.440, 0.04, { 
                    seg: 24, metalness: 0.55, roughness: 0.18 
                }));
                // Yan ölçek (hacim göstergesi)
                g.add(box(0.005, 0.30, 0.014, 0xfafdff, dx + 0.082, 0.620, 0.040, { 
                    roughness: 0.30 
                }));
                // 5 ölçek tikleri
                [0.500, 0.580, 0.660, 0.740, 0.820].forEach(yy => {
                    g.add(box(0.012, 0.003, 0.014, 0x2a3540, dx + 0.080, yy, 0.040, { 
                        roughness: 0.30 
                    }));
                });
            });
            
            // ==========================================================
            // ÜST MODÜL: HEPA/ULPA FİLTRE + EKRANLAR (0.92 → 1.30)
            // ==========================================================
            g.add(box(0.46, 0.34, 0.42, 0xc7d0d8, 0, 1.090, 0, { ...glossWhite }));
            // Yan grafit (sol+sağ)
            g.add(box(0.014, 0.32, 0.40, 0x2a3540, -0.224, 1.090, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            g.add(box(0.014, 0.32, 0.40, 0x2a3540, 0.224, 1.090, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            // Üst kapak
            g.add(box(0.48, 0.024, 0.44, 0x4a5e72, 0, 1.272, 0, { 
                metalness: 0.40, roughness: 0.24 
            }));
            // Üst aksent
            g.add(box(0.46, 0.004, 0.42, 0x88e0d4, 0, 1.270, 0, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.22, transparent: true, opacity: 0.55 
            }));
            
            // HEPA/ULPA filtre kartuşu (üstten görünür silindirik kompakt)
            g.add(cyl(0.110, 0.110, 0.20, 0xeef3f7, 0, 1.190, 0, { 
                seg: 24, ...glossWhite 
            }));
            // Kartuş üst kapağı (çıkarılabilir görünüm)
            g.add(cyl(0.114, 0.114, 0.012, 0x4a5e72, 0, 1.296, 0, { 
                seg: 24, metalness: 0.40, roughness: 0.24 
            }));
            // Kartuş kapak halkası
            const cartRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.110, 0.005, 6, 24),
                mat(0x6f8798, { metalness: 0.55, roughness: 0.18 })
            );
            cartRing.rotation.x = Math.PI / 2;
            cartRing.position.set(0, 1.302, 0);
            prepMesh(cartRing); g.add(cartRing);
            // Sarı filtre durum LED
            g.add(cyl(0.012, 0.012, 0.012, 0xe0a558, -0.06, 1.200, 0.115, { 
                seg: 12, emissive: 0xe0a558, emissiveIntensity: 0.55 
            }));
            // "FILTER" etiketi
            g.add(box(0.040, 0.014, 0.014, 0xfafdff, 0.04, 1.200, 0.115, { 
                roughness: 0.30 
            }));
            
            // ===== DİJİTAL KONTROL PANELİ ÖN YÜZ =====
            // Ana panel kasası (siyah cam)
            g.add(box(0.40, 0.20, 0.024, 0x0e1821, 0, 1.090, 0.215, { 
                roughness: 0.18, metalness: 0.20 
            }));
            // Aktif ekran arka plan (medikal mavi-koyu)
            g.add(box(0.36, 0.16, 0.018, 0x1a2940, 0, 1.090, 0.230, { 
                roughness: 0.16 
            }));
            // Üst başlık şeridi
            g.add(box(0.32, 0.014, 0.014, 0x4a7c8a, 0, 1.150, 0.240, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.40 
            }));
            
            // VAC dijital değer (sol)
            g.add(box(0.10, 0.040, 0.014, 0x0e1821, -0.10, 1.110, 0.241, { 
                roughness: 0.18 
            }));
            g.add(box(0.080, 0.024, 0.014, 0x4cb88a, -0.10, 1.110, 0.246, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.50 
            }));
            // VAC label
            g.add(box(0.040, 0.010, 0.014, 0xfafdff, -0.10, 1.150, 0.243, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            
            // SMOKE dijital değer (sağ)
            g.add(box(0.10, 0.040, 0.014, 0x0e1821, 0.10, 1.110, 0.241, { 
                roughness: 0.18 
            }));
            g.add(box(0.080, 0.024, 0.014, 0xeaf6f8, 0.10, 1.110, 0.246, { 
                emissive: 0xeaf6f8, emissiveIntensity: 0.40 
            }));
            // SMOKE label
            g.add(box(0.040, 0.010, 0.014, 0xfafdff, 0.10, 1.150, 0.243, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            
            // FILTER OK rozeti (alt orta - yeşil)
            g.add(box(0.080, 0.020, 0.014, 0x4cb88a, 0, 1.030, 0.243, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.45, 
                transparent: true, opacity: 0.85 
            }));
            // Kırmızı alarm LED (sağ üst köşe)
            g.add(cyl(0.010, 0.010, 0.010, 0xd96371, 0.16, 1.150, 0.243, { 
                seg: 10, emissive: 0xd96371, emissiveIntensity: 0.40 
            }));
            
            // ===== ANALOG VAKUM MANOMETRESİ (yan, sol) =====
            // Kadran arka
            g.add(cyl(0.044, 0.044, 0.014, 0xfafdff, -0.20, 1.020, -0.10, { 
                seg: 18, roughness: 0.30 
            }));
            // Kadran kenar (krom)
            const gauge = new THREE.Mesh(
                new THREE.TorusGeometry(0.045, 0.005, 6, 22),
                mat(0x4a5e72, { metalness: 0.55, roughness: 0.20 })
            );
            gauge.rotation.y = Math.PI / 2;
            gauge.position.set(-0.213, 1.020, -0.10);
            prepMesh(gauge); g.add(gauge);
            // Kadran iç (siyah çizgiler)
            [-0.6, -0.3, 0, 0.3, 0.6].forEach(angle => {
                const tickX = Math.cos(angle) * 0.030;
                const tickY = Math.sin(angle) * 0.030;
                g.add(box(0.005, 0.005, 0.014, 0x2a3540, -0.207, 1.020 + tickY, -0.10 + tickX, { 
                    roughness: 0.30 
                }));
            });
            // Manometre iğnesi
            const needle = box(0.030, 0.003, 0.005, 0xd96371, -0.207, 1.020, -0.085, { 
                emissive: 0xd96371, emissiveIntensity: 0.45 
            });
            needle.rotation.y = Math.PI / 2;
            needle.rotation.z = -0.4;
            g.add(needle);
            
            // ==========================================================
            // 3 KONTROL DÜĞMESİ (Vakum/Smoke/Auto)
            // ==========================================================
            [-0.10, 0, 0.10].forEach((dx, i) => {
                const colors = [0x4cb88a, 0xeaf6f8, 0xe0a558];
                // Knob halka çerçevesi
                g.add(cyl(0.020, 0.020, 0.012, 0xb8c4cf, dx, 0.970, 0.215, { 
                    seg: 14, metalness: 0.55, roughness: 0.18 
                }));
                // Renk kodlu üst kapak
                g.add(cyl(0.016, 0.016, 0.014, colors[i], dx, 0.978, 0.218, { 
                    seg: 12, emissive: colors[i], emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.80 
                }));
                // Knob işareti
                g.add(box(0.010, 0.003, 0.004, 0xfafdff, dx, 0.988, 0.220, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.30 
                }));
                // Etiket çizgisi (alt)
                g.add(box(0.022, 0.005, 0.014, colors[i], dx, 0.945, 0.218, { 
                    emissive: colors[i], emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.65 
                }));
            });
            
            // ==========================================================
            // KÜÇÜK ACİL DURMA (sağ alt panel)
            // ==========================================================
            g.add(cyl(0.018, 0.018, 0.012, 0xd96371, 0.16, 0.970, 0.215, { 
                seg: 12, emissive: 0xd96371, emissiveIntensity: 0.45 
            }));
            
            // ==========================================================
            // 2 AYRI ÇAPTA HORTUM (klinik düzen)
            // ==========================================================
            // İnce mavi vakum hortumu (kavanoz 1'den)
            const vacHose = cyl(0.012, 0.012, 0.55, 0x4a7c8a, -0.13, 0.50, 0.18, { 
                seg: 10, transparent: true, opacity: 0.78, roughness: 0.30 
            });
            vacHose.rotation.z = -1.0;
            vacHose.rotation.x = 0.4;
            g.add(vacHose);
            // Vakum hortum çıkış portu (kavanoz altından)
            g.add(cyl(0.014, 0.014, 0.014, 0x6f8798, -0.13, 0.430, 0.10, { 
                seg: 12, metalness: 0.45 
            }));
            
            // Kalın gri smoke evac hortumu (kavanoz 2'den)
            const smokeHose = cyl(0.022, 0.022, 0.65, 0x4a5e72, 0.13, 0.50, 0.20, { 
                seg: 12, transparent: true, opacity: 0.78, roughness: 0.36 
            });
            smokeHose.rotation.z = -0.9;
            smokeHose.rotation.x = 0.3;
            g.add(smokeHose);
            // Smoke hortum çıkış portu
            g.add(cyl(0.024, 0.024, 0.014, 0x6f8798, 0.13, 0.430, 0.10, { 
                seg: 12, metalness: 0.45 
            }));
            // Smoke hortum kenar takviye halkalar (3 yer - klinik gerçeklik)
            [0.2, 0.4, 0.55].forEach(t => {
                const ring = cyl(0.026, 0.026, 0.008, 0x2a3540, 
                    0.13 + Math.cos(0.9) * t * 0.4, 
                    0.50 + Math.sin(-0.9) * t * 0.4 + Math.sin(0.3) * t * 0.05, 
                    0.20 + t * 0.18, { seg: 12, roughness: 0.42 });
                g.add(ring);
            });
            
            // ==========================================================
            // ÜST TUTAMAÇ
            // ==========================================================
            g.add(cyl(0.012, 0.012, 0.20, 0x4a5e72, -0.13, 1.36, -0.18, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            g.add(cyl(0.012, 0.012, 0.20, 0x4a5e72, 0.13, 1.36, -0.18, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            const handle = cyl(0.014, 0.014, 0.30, 0xb8c4cf, 0, 1.44, -0.18, { 
                seg: 12, metalness: 0.55, roughness: 0.18 
            });
            handle.rotation.z = Math.PI / 2;
            g.add(handle);
            
            return g;
        }


        // ============================================================
        // VALLEYLAB™ FT10 ENERGY PLATFORM (Medtronic — 2025 altın standardı)
        // 3-touchscreen iconic design + LigaSure Vessel Sealing entegre
        // ValleyLab Exchange remote update + Smart connector LED reader
        // ============================================================
        function buildESUCartV2(x, y, z) {
            const g = groupAt(x, y, z);

            // === Tasarım paleti — Essenz V3 ile uyumlu beyaz/açık gri Avrupa premium ===
            const _white       = 0xeef2f5;
            const _grayMid     = 0xb5bdc4;
            const _dark        = 0x2a3744;
            const _chrome      = 0xc8ced4;
            const _ledTeal     = 0x14b8a6;
            const _ledBlue     = 0x4d9ef0;
            const _ledGreen    = 0x4cb88a;
            const _ledRed      = 0xe04646;
            const _ledYellow   = 0xfbbf24;
            const _ledOrange   = 0xf59e0b;
            const _screen      = 0x0a0e14;
            // Medtronic kurumsal renk — ana cihaz brand strip için
            const _medtronicBlue = 0x0066cc;

            // ============================================================
            // ALT KART (mobil cart — Valleylab FT900 cart referansı)
            // ============================================================
            // 4 castor (premium, 100mm)
            [-0.28, 0.28].forEach(xx => [-0.20, 0.20].forEach(zz => {
                const wh = cyl(0.054, 0.054, 0.038, 0x12161c, xx, 0.054, zz,
                    { seg: 18, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                const hub = cyl(0.024, 0.024, 0.042, _chrome, xx, 0.054, zz,
                    { seg: 14, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
                // Frenli yeşil LED (kilit göstergesi)
                g.add(cyl(0.005, 0.005, 0.004, _ledGreen, xx, 0.054, zz + (zz > 0 ? 0.054 : -0.054),
                    { seg: 8, emissive: _ledGreen, emissiveIntensity: 0.85 }));
            }));

            // Cart alt platform
            g.add(box(0.66, 0.060, 0.50, _dark, 0, 0.118, 0,
                { metalness: 0.50, roughness: 0.32 }));
            // Üst krom kenar
            g.add(box(0.66, 0.005, 0.50, _chrome, 0, 0.151, 0,
                { metalness: 0.78, roughness: 0.18 }));
            // Perimetric LED accent (turkuaz)
            g.add(box(0.62, 0.003, 0.46, _ledTeal, 0, 0.155, 0,
                { emissive: _ledTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // ALT GÖVDE — DOLAP (foot pedal storage + accessory drawer)
            // ============================================================
            g.add(box(0.62, 0.42, 0.46, _white, 0, 0.36, 0,
                { metalness: 0.20, roughness: 0.34 }));
            // Yan krom kenarlar
            [-0.31, 0.31].forEach(side => {
                g.add(box(0.005, 0.40, 0.44, _chrome, side, 0.36, 0,
                    { metalness: 0.78, roughness: 0.18 }));
            });
            // Çekmece ön yüzü
            g.add(box(0.58, 0.18, 0.005, _white, 0, 0.46, 0.232,
                { metalness: 0.20, roughness: 0.34 }));
            // Çekmece kulp barı (krom yatay)
            g.add(box(0.46, 0.014, 0.014, _chrome, 0, 0.46, 0.240,
                { metalness: 0.78, roughness: 0.18 }));
            // Üst krom çizgi (çekmece sınırı)
            g.add(box(0.58, 0.003, 0.005, _chrome, 0, 0.555, 0.235,
                { metalness: 0.78, roughness: 0.18 }));

            // ============================================================
            // FT10 ANA ÜNİTE GÖVDESİ (cart üstü — 3 dokunmatik ekran iconic)
            // Boyut referansı: 18"W × 10"H × 20"D
            // ============================================================
            // Ana ünite kasası
            g.add(box(0.62, 0.34, 0.50, _dark, 0, 0.74, 0,
                { metalness: 0.45, roughness: 0.30 }));
            // Üst beyaz/krom kapak (Valleylab clean top design)
            g.add(box(0.62, 0.005, 0.50, _white, 0, 0.913, 0,
                { metalness: 0.20, roughness: 0.40 }));
            // Üst krom kenar
            g.add(box(0.64, 0.005, 0.50, _chrome, 0, 0.918, 0,
                { metalness: 0.78, roughness: 0.18 }));

            // Ön yüz LED accent şeridi (turkuaz — Valleylab status bar)
            g.add(box(0.58, 0.005, 0.005, _ledTeal, 0, 0.91, 0.252,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));

            // === MEDTRONIC BRAND STRIP (alt-ön — kurumsal mavi LED) ===
            g.add(box(0.36, 0.014, 0.005, _medtronicBlue, 0, 0.59, 0.252,
                { emissive: _medtronicBlue, emissiveIntensity: 0.85 }));

            // ============================================================
            // 3 DOKUNMATİK EKRAN (FT10 iconic — Cut / Coag / Bipolar+LigaSure)
            // ============================================================
            const screens = [
                { x: -0.20, label: 'CUT',       primary: _ledYellow, accent: _ledOrange },
                { x:  0.00, label: 'COAG',      primary: _ledBlue,   accent: _ledTeal   },
                { x:  0.20, label: 'BIPOLAR',   primary: _ledGreen,  accent: _ledTeal   }
            ];

            screens.forEach((s, i) => {
                // Ekran kasası (krom çerçeve)
                g.add(box(0.16, 0.20, 0.020, _chrome, s.x, 0.78, 0.255,
                    { metalness: 0.78, roughness: 0.18 }));
                // Cam dokunmatik ekran
                g.add(box(0.14, 0.18, 0.012, _screen, s.x, 0.78, 0.265,
                    { metalness: 0.20, roughness: 0.10 }));
                // Aktif ekran arka plan
                g.add(box(0.135, 0.175, 0.001, 0x0d1820, s.x, 0.78, 0.272,
                    { emissive: 0x0d1820, emissiveIntensity: 0.50 }));

                // Üst başlık şeridi (mod adı — ana renk)
                g.add(box(0.12, 0.020, 0.0015, s.primary, s.x, 0.85, 0.273,
                    { emissive: s.primary, emissiveIntensity: 0.95 }));

                // Büyük güç değeri (orta — beyaz LED)
                g.add(box(0.10, 0.040, 0.0015, s.primary, s.x, 0.79, 0.273,
                    { emissive: s.primary, emissiveIntensity: 0.95 }));

                // Mini watt bar (alt — 8 segment renk gradient)
                for (let j = 0; j < 8; j++) {
                    const intensity = 0.40 + (j / 8) * 0.55;
                    const color = j < 5 ? s.accent : s.primary;
                    g.add(box(0.012, 0.012, 0.0015, color, s.x - 0.05 + j * 0.014, 0.74, 0.273,
                        { emissive: color, emissiveIntensity: intensity }));
                }

                // +/- arrow buttons (alt-sol ve alt-sağ)
                g.add(box(0.014, 0.014, 0.0015, _ledTeal, s.x - 0.05, 0.715, 0.273,
                    { emissive: _ledTeal, emissiveIntensity: 0.85 }));
                g.add(box(0.014, 0.014, 0.0015, _ledTeal, s.x + 0.05, 0.715, 0.273,
                    { emissive: _ledTeal, emissiveIntensity: 0.85 }));
            });

            // === Ekranlar arası dikey ayırıcı krom çubuklar ===
            [-0.10, 0.10].forEach(dx => {
                g.add(box(0.005, 0.20, 0.022, _chrome, dx, 0.78, 0.256,
                    { metalness: 0.78, roughness: 0.16 }));
            });

            // ============================================================
            // SMART CONNECTOR PORT PANEL (FT10 LED illuminated readers)
            // Alt-ön panel — 5 renk kodlu kablo girişi
            // ============================================================
            g.add(box(0.58, 0.060, 0.005, _dark, 0, 0.66, 0.252,
                { metalness: 0.45, roughness: 0.30 }));

            const connectors = [
                { c: _ledYellow, l: 'M1' },     // Monopolar 1
                { c: _ledOrange, l: 'M2' },     // Monopolar 2
                { c: _ledBlue,   l: 'BP' },     // Bipolar
                { c: _ledGreen,  l: 'LS' },     // LigaSure
                { c: _ledRed,    l: 'NE' }      // Neutral electrode
            ];
            connectors.forEach((c, i) => {
                const dx = -0.22 + i * 0.11;
                // Smart connector kasası (krom)
                g.add(cyl(0.022, 0.022, 0.012, _chrome, dx, 0.66, 0.258,
                    { seg: 18, metalness: 0.78, roughness: 0.16 }));
                // İç renk LED (Smart connector LED reader)
                g.add(cyl(0.016, 0.016, 0.014, c.c, dx, 0.66, 0.265,
                    { seg: 14, emissive: c.c, emissiveIntensity: 0.95 }));
                // Etiket altta (mini renk dot)
                g.add(box(0.014, 0.008, 0.005, c.c, dx, 0.625, 0.258,
                    { emissive: c.c, emissiveIntensity: 0.85 }));
            });

            // ============================================================
            // PHYSICAL ROTARY ENCODER (sağ — Valleylab dial knob)
            // Her FT10'da var — sterile cover ile alandan kontrol
            // ============================================================
            g.add(cyl(0.030, 0.030, 0.020, _chrome, 0.27, 0.78, 0.258,
                { seg: 22, metalness: 0.78, roughness: 0.18 }));
            g.add(cyl(0.022, 0.022, 0.024, _dark, 0.27, 0.78, 0.270,
                { seg: 18, metalness: 0.45, roughness: 0.40 }));

            // ============================================================
            // EMERGENCY OFF (sol — kırmızı mantar buton)
            // ============================================================
            g.add(cyl(0.026, 0.026, 0.008, _ledYellow, -0.27, 0.78, 0.258,
                { seg: 22, emissive: _ledYellow, emissiveIntensity: 0.55 }));
            g.add(cyl(0.020, 0.020, 0.020, _ledRed, -0.27, 0.79, 0.265,
                { seg: 18, emissive: _ledRed, emissiveIntensity: 0.85,
                  metalness: 0.20, roughness: 0.40 }));

            // ============================================================
            // FOOT PEDAL (yan — sterile field foot control)
            // ============================================================
            g.add(box(0.18, 0.040, 0.14, _dark, 0.40, 0.040, 0.40,
                { metalness: 0.40, roughness: 0.40 }));
            // 2 pedal accent (sarı CUT + mavi COAG)
            g.add(box(0.06, 0.014, 0.10, _ledYellow, 0.36, 0.062, 0.40,
                { emissive: _ledYellow, emissiveIntensity: 0.65 }));
            g.add(box(0.06, 0.014, 0.10, _ledBlue, 0.44, 0.062, 0.40,
                { emissive: _ledBlue, emissiveIntensity: 0.65 }));
            // Pedal kablosu (anchor)
            g.add(cyl(0.006, 0.006, 0.36, _dark, 0.40, 0.10, 0.20,
                { seg: 8, roughness: 0.85 }));

            // ============================================================
            // ACTIVE ELECTRODE PEN HOLDER (üstte — koter kalemi tutucu)
            // ============================================================
            g.add(box(0.040, 0.020, 0.18, _dark, 0.30, 0.93, 0.18,
                { metalness: 0.45, roughness: 0.30 }));
            // Kalem (mavi gövde, krom uç)
            g.add(cyl(0.012, 0.012, 0.20, _ledBlue, 0.30, 0.97, 0.18,
                { seg: 14, metalness: 0.30, roughness: 0.40 }));
            g.add(cyl(0.014, 0.014, 0.022, _chrome, 0.30, 0.875, 0.18,
                { seg: 14, metalness: 0.78, roughness: 0.18 }));
            // Kalem kablosu (mavi spiral kıvrım — basit gösterim)
            g.add(cyl(0.005, 0.005, 0.40, _ledBlue, 0.30, 1.00, 0.30,
                { seg: 8, roughness: 0.85 }));

            // ============================================================
            // REM HASTA PLAKASI (yeşil onay LED — return electrode monitor)
            // Cart yan yüzünde küçük gösterge
            // ============================================================
            g.add(box(0.060, 0.040, 0.005, _dark, -0.32, 0.78, 0.10,
                { metalness: 0.45, roughness: 0.30 }));
            // Yeşil REM aktif LED
            g.add(box(0.040, 0.020, 0.005, _ledGreen, -0.32, 0.78, 0.103,
                { emissive: _ledGreen, emissiveIntensity: 0.95 }));

            // ============================================================
            // SAĞ-ÜST: ValleyLab marka şeridi (turkuaz LED)
            // ============================================================
            g.add(box(0.16, 0.012, 0.005, _ledTeal, -0.20, 0.94, 0.252,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));

            return g;
        }

        // ============================================================
        // STRYKER NEPTUNE 3 ROVER (en gelişmiş cerrahi aspirasyon)
        // Closed waste system + Smart docking + 30L tank
        // High-VAC + Low-VAC çift mod
        // ============================================================
        function buildSuctionSmokeUnitV2(x, y, z) {
            const g = groupAt(x, y, z);

            const _white       = 0xeef2f5;
            const _grayMid     = 0xb5bdc4;
            const _dark        = 0x2a3744;
            const _chrome      = 0xc8ced4;
            const _ledTeal     = 0x14b8a6;
            const _ledBlue     = 0x4d9ef0;
            const _ledGreen    = 0x4cb88a;
            const _ledRed      = 0xe04646;
            const _ledYellow   = 0xfbbf24;
            const _ledOrange   = 0xf59e0b;
            const _screen      = 0x0a0e14;
            const _strykerYellow = 0xffd700;   // Stryker kurumsal sarı
            const _waste       = 0x6b1a1a;     // Atık sıvı kırmızısı (koyu)

            // ============================================================
            // ALT TABAN — 4 castor (Rover karakteristik, taşınabilir)
            // ============================================================
            [-0.20, 0.20].forEach(xx => [-0.18, 0.18].forEach(zz => {
                const wh = cyl(0.060, 0.060, 0.040, 0x12161c, xx, 0.060, zz,
                    { seg: 20, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                const hub = cyl(0.026, 0.026, 0.044, _chrome, xx, 0.060, zz,
                    { seg: 14, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
                // Frenli yeşil LED
                g.add(cyl(0.005, 0.005, 0.004, _ledGreen, xx, 0.060, zz + (zz > 0 ? 0.060 : -0.060),
                    { seg: 8, emissive: _ledGreen, emissiveIntensity: 0.85 }));
            }));

            // Alt taban (Rover compact)
            g.add(box(0.50, 0.080, 0.46, _dark, 0, 0.140, 0,
                { metalness: 0.50, roughness: 0.32 }));
            g.add(box(0.50, 0.005, 0.46, _chrome, 0, 0.182, 0,
                { metalness: 0.78, roughness: 0.18 }));
            // LED accent
            g.add(box(0.46, 0.003, 0.42, _ledTeal, 0, 0.186, 0,
                { emissive: _ledTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // ANA GÖVDE — dikey kule (Rover signature tower)
            // ============================================================
            g.add(box(0.46, 1.60, 0.42, _white, 0, 0.98, 0,
                { metalness: 0.20, roughness: 0.34 }));
            // Yan krom kenarlar
            [-0.232, 0.232].forEach(side => {
                g.add(box(0.005, 1.58, 0.40, _chrome, side, 0.98, 0,
                    { metalness: 0.78, roughness: 0.18 }));
            });
            // Üst krom kenar
            g.add(box(0.46, 0.005, 0.42, _chrome, 0, 1.788, 0,
                { metalness: 0.78, roughness: 0.18 }));
            // Üst LED status bar (turkuaz)
            g.add(box(0.36, 0.005, 0.005, _ledTeal, 0, 1.792, 0.212,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));

            // === STRYKER BRAND STRIP (üst-ön — sarı kurumsal LED) ===
            g.add(box(0.20, 0.018, 0.005, _strykerYellow, 0, 1.74, 0.214,
                { emissive: _strykerYellow, emissiveIntensity: 0.95 }));

            // ============================================================
            // ÜST DOKUNMATİK EKRAN (kontrol paneli)
            // ============================================================
            g.add(box(0.40, 0.20, 0.014, _dark, 0, 1.58, 0.214,
                { metalness: 0.45, roughness: 0.30 }));
            g.add(box(0.36, 0.18, 0.012, _screen, 0, 1.58, 0.222,
                { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.34, 0.16, 0.001, 0x0d1820, 0, 1.58, 0.229,
                { emissive: 0x0d1820, emissiveIntensity: 0.50 }));
            // Üst başlık (turkuaz "NEPTUNE 3")
            g.add(box(0.30, 0.018, 0.0015, _ledTeal, 0, 1.650, 0.230,
                { emissive: _ledTeal, emissiveIntensity: 0.95 }));

            // 2 büyük vakum göstergesi (HIGH-VAC + LOW-VAC çift mod)
            [-0.080, 0.080].forEach((dx, i) => {
                const cs = [_ledRed, _ledOrange];
                const labels = ['HIGH', 'LOW'];
                // Mini gösterge arka plan
                g.add(box(0.130, 0.06, 0.0015, 0x081820, dx, 1.58, 0.230,
                    { emissive: 0x081820, emissiveIntensity: 0.40 }));
                // Sol accent çubuk
                g.add(box(0.005, 0.05, 0.0015, cs[i], dx - 0.060, 1.58, 0.232,
                    { emissive: cs[i], emissiveIntensity: 0.95 }));
                // Büyük rakam (vakum mmHg)
                g.add(box(0.090, 0.024, 0.0015, cs[i], dx, 1.58, 0.232,
                    { emissive: cs[i], emissiveIntensity: 0.95 }));
                // Mini vakum bar (10 segment)
                for (let j = 0; j < 10; j++) {
                    const intensity = 0.40 + (j / 10) * 0.55;
                    g.add(box(0.008, 0.008, 0.0015, cs[i], dx - 0.040 + j * 0.010, 1.555, 0.232,
                        { emissive: cs[i], emissiveIntensity: intensity }));
                }
            });

            // === Alt ekran şeridi (4 mode buton — Suction/Smoke/Auto/Standby) ===
            const modes = [
                { c: _ledRed,    l: 'SUC' },
                { c: _ledTeal,   l: 'SMK' },
                { c: _ledGreen,  l: 'AUTO'},
                { c: _ledBlue,   l: 'STBY'}
            ];
            modes.forEach((m, i) => {
                const dx = -0.12 + i * 0.08;
                g.add(box(0.060, 0.030, 0.0015, 0x182838, dx, 1.510, 0.230,
                    { emissive: 0x182838, emissiveIntensity: 0.50 }));
                g.add(box(0.012, 0.012, 0.0015, m.c, dx, 1.510, 0.232,
                    { emissive: m.c, emissiveIntensity: 0.95 }));
            });

            // ============================================================
            // 30L ATIK HAZNESİ (Neptune 3 closed waste system iconic)
            // Şeffaf akrilik dış kabuk + iç kırmızı atık sıvı seviye göstergesi
            // ============================================================
            // Şeffaf hazne (büyük, ana dikkat çeken eleman)
            g.add(cyl(0.16, 0.16, 0.50, 0xc7dbe6, 0, 1.10, 0.10,
                { seg: 26, metalness: 0.04, roughness: 0.20,
                  emissive: 0x88c9e0, emissiveIntensity: 0.06,
                  transparent: true, opacity: 0.50 }));
            // İç atık sıvı (yarı dolu — koyu kırmızı)
            g.add(cyl(0.150, 0.150, 0.30, _waste, 0, 0.95, 0.10,
                { seg: 24, emissive: _waste, emissiveIntensity: 0.20,
                  metalness: 0.10, roughness: 0.40 }));
            // Üst krom kapak (closed system seal)
            g.add(cyl(0.170, 0.170, 0.020, _chrome, 0, 1.360, 0.10,
                { seg: 26, metalness: 0.78, roughness: 0.16 }));
            // Alt krom taban (docking station bağlantısı)
            g.add(cyl(0.172, 0.172, 0.020, _chrome, 0, 0.860, 0.10,
                { seg: 26, metalness: 0.78, roughness: 0.16 }));

            // === Hacim sensorü (yan dikey LED skala — 0-30L) ===
            for (let j = 0; j < 6; j++) {
                const ly = 0.90 + j * 0.085;
                const filled = j < 4;
                const c = filled ? (j > 3 ? _ledRed : _ledYellow) : _ledGreen;
                const intensity = filled ? 0.95 : 0.40;
                g.add(box(0.005, 0.040, 0.014, c, 0.155, ly, 0.10,
                    { emissive: c, emissiveIntensity: intensity }));
            }

            // === Hazne etiketi (kırmızı LED "BIOHAZARD") ===
            g.add(box(0.080, 0.020, 0.005, _ledRed, 0, 0.95, 0.265,
                { emissive: _ledRed, emissiveIntensity: 0.95 }));
            g.add(box(0.040, 0.014, 0.001, 0xfafdff, 0, 0.95, 0.268,
                { emissive: 0xfafdff, emissiveIntensity: 0.85 }));

            // ============================================================
            // 2 SUCTION KAVANOZU (yan — Rover bypass collection — opsiyonel)
            // Daha küçük, antibakteriyel mavi sıvı seviye gösterimi
            // ============================================================
            [-0.18, 0.18].forEach(dx => {
                // Cam kavanoz
                g.add(cyl(0.040, 0.040, 0.18, 0xc7dbe6, dx, 1.50, 0.05,
                    { seg: 18, metalness: 0.04, roughness: 0.20,
                      emissive: 0x88c9e0, emissiveIntensity: 0.06,
                      transparent: true, opacity: 0.55 }));
                // İç sıvı (yarı dolu — koyu kırmızı)
                g.add(cyl(0.034, 0.034, 0.10, _waste, dx, 1.46, 0.05,
                    { seg: 16, emissive: _waste, emissiveIntensity: 0.18 }));
                // Üst krom kapak
                g.add(cyl(0.044, 0.044, 0.012, _chrome, dx, 1.596, 0.05,
                    { seg: 18, metalness: 0.78, roughness: 0.16 }));
            });

            // ============================================================
            // VACUUM HORTUMU (kalın, esnek, gri — ön çıkış)
            // ============================================================
            // Bağlantı portu (alt-ön — krom)
            g.add(cyl(0.022, 0.022, 0.018, _chrome, 0, 0.78, 0.215,
                { seg: 18, metalness: 0.78, roughness: 0.16 }));
            // Hortum (gri, kalın, düz uzanır)
            g.add(cyl(0.018, 0.018, 0.50, _grayMid, 0, 0.60, 0.40,
                { seg: 16, roughness: 0.85, metalness: 0.04 }));
            g.add(cyl(0.018, 0.018, 0.30, _grayMid, 0.15, 0.40, 0.40,
                { seg: 16, roughness: 0.85, metalness: 0.04 }));
            // Hortum etiketi (kırmızı — SUCTION)
            g.add(box(0.030, 0.014, 0.005, _ledRed, 0, 0.83, 0.220,
                { emissive: _ledRed, emissiveIntensity: 0.85 }));

            // ============================================================
            // SMART DOCKING STATION (Neptune 3 iconic — alt-arka)
            // Otomatik bağlantı portu + LED ring
            // ============================================================
            g.add(box(0.42, 0.040, 0.10, _dark, 0, 0.235, -0.16,
                { metalness: 0.55, roughness: 0.30 }));
            // Docking LED halkası (turkuaz aktif)
            g.add(box(0.36, 0.005, 0.005, _ledTeal, 0, 0.260, -0.110,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));

            // ============================================================
            // PUSH HANDLE (üst-arka — manevra)
            // ============================================================
            g.add(cyl(0.014, 0.014, 0.36, _chrome, 0, 1.85, -0.18,
                { seg: 14, metalness: 0.78, roughness: 0.14 }));
            g.add(cyl(0.018, 0.018, 0.020, _dark, -0.18, 1.85, -0.18,
                { seg: 16, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.018, 0.018, 0.020, _dark, 0.18, 1.85, -0.18,
                { seg: 16, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.016, 0.016, 0.32, _dark, 0, 1.85, -0.18,
                { seg: 12, roughness: 0.85 }));

            // ============================================================
            // EMERGENCY OFF (sağ-üst köşe)
            // ============================================================
            g.add(cyl(0.024, 0.024, 0.010, _ledYellow, 0.180, 1.62, 0.215,
                { seg: 18, emissive: _ledYellow, emissiveIntensity: 0.55 }));
            g.add(cyl(0.018, 0.018, 0.018, _ledRed, 0.180, 1.625, 0.225,
                { seg: 16, emissive: _ledRed, emissiveIntensity: 0.85,
                  metalness: 0.20, roughness: 0.40 }));

            return g;
        }

        // ============================================================
        // MEGADYNE MEGA VAC PLUS (Ethicon — duman tahliye sistemi)
        // ULPA filter %99.999 efficiency · AORN compliant
        // Otomatik aktivasyon (ESU ile sync) · Sessiz çalışma
        // ============================================================
        function buildSmokeEvacUnit(x, y, z) {
            const g = groupAt(x, y, z);

            // === Tasarım paleti — ESU + Neptune 3 ile uyumlu ===
            const _white       = 0xeef2f5;
            const _grayMid     = 0xb5bdc4;
            const _dark        = 0x2a3744;
            const _chrome      = 0xc8ced4;
            const _ledTeal     = 0x14b8a6;
            const _ledBlue     = 0x4d9ef0;
            const _ledGreen    = 0x4cb88a;
            const _ledRed      = 0xe04646;
            const _ledYellow   = 0xfbbf24;
            const _ledOrange   = 0xf59e0b;
            const _ledPurple   = 0x9c5cd9;
            const _screen      = 0x0a0e14;
            // Ethicon kurumsal mor — ana brand strip
            const _ethiconPurple = 0x8b00ff;

            // ============================================================
            // ALT TABAN — Compact 4 castor (Mega Vac karakteristik kompakt)
            // ============================================================
            [-0.16, 0.16].forEach(xx => [-0.14, 0.14].forEach(zz => {
                const wh = cyl(0.046, 0.046, 0.034, 0x12161c, xx, 0.046, zz,
                    { seg: 16, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                const hub = cyl(0.020, 0.020, 0.038, _chrome, xx, 0.046, zz,
                    { seg: 12, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
                // Frenli yeşil LED
                g.add(cyl(0.004, 0.004, 0.003, _ledGreen, xx, 0.046, zz + (zz > 0 ? 0.046 : -0.046),
                    { seg: 8, emissive: _ledGreen, emissiveIntensity: 0.85 }));
            }));

            // Alt taban
            g.add(box(0.40, 0.060, 0.36, _dark, 0, 0.110, 0,
                { metalness: 0.50, roughness: 0.32 }));
            g.add(box(0.40, 0.005, 0.36, _chrome, 0, 0.143, 0,
                { metalness: 0.78, roughness: 0.18 }));
            g.add(box(0.36, 0.003, 0.32, _ledTeal, 0, 0.147, 0,
                { emissive: _ledTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // ANA GÖVDE — dikey kompakt kule (Mega Vac iconic)
            // Daha küçük profil (smoke evac ESU yanında durur)
            // ============================================================
            g.add(box(0.36, 0.80, 0.32, _white, 0, 0.55, 0,
                { metalness: 0.20, roughness: 0.34 }));
            // Yan krom kenarlar
            [-0.182, 0.182].forEach(side => {
                g.add(box(0.005, 0.78, 0.30, _chrome, side, 0.55, 0,
                    { metalness: 0.78, roughness: 0.18 }));
            });
            // Üst krom kenar
            g.add(box(0.36, 0.005, 0.32, _chrome, 0, 0.953, 0,
                { metalness: 0.78, roughness: 0.18 }));
            // Üst LED status bar (turkuaz)
            g.add(box(0.28, 0.004, 0.005, _ledTeal, 0, 0.957, 0.162,
                { emissive: _ledTeal, emissiveIntensity: 0.85 }));

            // === ETHICON BRAND STRIP (üst-ön — mor kurumsal LED) ===
            g.add(box(0.18, 0.014, 0.005, _ethiconPurple, 0, 0.92, 0.164,
                { emissive: _ethiconPurple, emissiveIntensity: 0.95 }));

            // ============================================================
            // ÜST KONTROL EKRANI (kompakt — Mega Vac dokunmatik)
            // ============================================================
            g.add(box(0.30, 0.16, 0.014, _dark, 0, 0.78, 0.164,
                { metalness: 0.45, roughness: 0.30 }));
            g.add(box(0.26, 0.14, 0.012, _screen, 0, 0.78, 0.172,
                { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.24, 0.12, 0.001, 0x0d1820, 0, 0.78, 0.179,
                { emissive: 0x0d1820, emissiveIntensity: 0.50 }));

            // Üst başlık (mor "MEGA VAC")
            g.add(box(0.20, 0.014, 0.0015, _ethiconPurple, 0, 0.832, 0.180,
                { emissive: _ethiconPurple, emissiveIntensity: 0.95 }));

            // === Ana flow göstergesi (ortada — turkuaz büyük rakam) ===
            // 3 fan hız seviyesi (Low/Med/High)
            g.add(box(0.18, 0.040, 0.0015, _ledTeal, 0, 0.795, 0.181,
                { emissive: _ledTeal, emissiveIntensity: 0.95 }));

            // === Mini fan hız bar (alt — 10 segment) ===
            for (let j = 0; j < 10; j++) {
                const intensity = 0.40 + (j / 10) * 0.55;
                const c = j < 7 ? _ledTeal : _ledOrange;
                g.add(box(0.014, 0.008, 0.0015, c, -0.075 + j * 0.0165, 0.745, 0.181,
                    { emissive: c, emissiveIntensity: intensity }));
            }

            // === Mode butonları (Auto/Manual/Standby) ===
            const smModes = [
                { c: _ledGreen,  l: 'AUTO' },
                { c: _ledYellow, l: 'MAN'  },
                { c: _ledBlue,   l: 'STBY' }
            ];
            smModes.forEach((m, i) => {
                const dx = -0.060 + i * 0.060;
                g.add(box(0.044, 0.024, 0.0015, 0x182838, dx, 0.715, 0.181,
                    { emissive: 0x182838, emissiveIntensity: 0.50 }));
                g.add(box(0.010, 0.010, 0.0015, m.c, dx, 0.715, 0.183,
                    { emissive: m.c, emissiveIntensity: 0.95 }));
            });

            // ============================================================
            // ULPA FİLTRE GÖSTERGESİ (orta — şeffaf cam pencere)
            // %99.999 efficiency — filter durumu gözlemlenebilir
            // ============================================================
            // Cam pencere arka (şeffaf)
            g.add(box(0.22, 0.18, 0.005, 0xc7dbe6, 0, 0.55, 0.162,
                { metalness: 0.04, roughness: 0.18,
                  emissive: 0x88c9e0, emissiveIntensity: 0.10,
                  transparent: true, opacity: 0.40 }));
            // Filtre gövdesi (içeride — beyaz örgü)
            g.add(box(0.18, 0.14, 0.005, 0xfafdff, 0, 0.55, 0.158,
                { roughness: 0.55, metalness: 0.04 }));
            // Filtre yüzeyinde mini örgü pattern (3 yatay şerit)
            [-0.030, 0, 0.030].forEach(dy => {
                g.add(box(0.16, 0.005, 0.005, _grayMid, 0, 0.55 + dy, 0.161,
                    { metalness: 0.20, roughness: 0.40 }));
            });
            // Filtre durum LED — yeşil (temiz) / sarı (orta) / kırmızı (değiştirme)
            // Şu an temiz (yeşil)
            g.add(cyl(0.008, 0.008, 0.005, _ledGreen, 0.090, 0.62, 0.165,
                { seg: 10, emissive: _ledGreen, emissiveIntensity: 0.95 }));
            // ULPA etiketi
            g.add(box(0.060, 0.014, 0.005, _ledOrange, 0, 0.46, 0.164,
                { emissive: _ledOrange, emissiveIntensity: 0.85 }));

            // ============================================================
            // GENİŞ ÇAPLI DUMAN HORTUMU (sağ-üst — kalın, beyaz)
            // Mega Vac karakteristik 7/8" hortum (büyük çap)
            // ============================================================
            // Bağlantı portu (krom, geniş)
            g.add(cyl(0.034, 0.034, 0.020, _chrome, 0.13, 0.91, 0.160,
                { seg: 18, metalness: 0.78, roughness: 0.16 }));
            // İç renk LED (turkuaz aktif)
            g.add(cyl(0.026, 0.026, 0.014, _ledTeal, 0.13, 0.92, 0.166,
                { seg: 14, emissive: _ledTeal, emissiveIntensity: 0.85 }));
            // === DUMAN HORTUMU ===
            // Eski yüksek/boşta görünen hortum segmentleri kaldırıldı.
            // Gerçek bağlantı, sahne düzeyinde Mega Vac portundan zemine inip hastaya uzanan
            // tek sürekli hat olarak addSuctionSmokeHoses() içinde çizilir. Böylece cihaz içine
            // gömülü, hasta hizasını kaçıran veya boşa çıkan ikinci bir smoke hose oluşmaz.

            // Hortum etiketi (mor — SMOKE)
            g.add(box(0.030, 0.014, 0.005, _ethiconPurple, 0.13, 0.86, 0.165,
                { emissive: _ethiconPurple, emissiveIntensity: 0.85 }));

            // ============================================================
            // FAN HAVA ÇIKIŞI (alt-arka — temiz hava ızgarası)
            // ============================================================
            // Izgara çerçeve
            g.add(box(0.24, 0.10, 0.005, _dark, 0, 0.30, -0.162,
                { metalness: 0.45, roughness: 0.30 }));
            // 5 yatay fan slat
            for (let j = 0; j < 5; j++) {
                g.add(box(0.22, 0.012, 0.005, _grayMid, 0, 0.260 + j * 0.020, -0.165,
                    { metalness: 0.40, roughness: 0.34 }));
            }

            // ============================================================
            // ESU SYNC LED (ön — otomatik aktivasyon göstergesi)
            // Mega Vac otomatik mode'da ESU ile sync olduğunda yanar
            // ============================================================
            g.add(box(0.040, 0.012, 0.005, _ethiconPurple, 0.10, 0.66, 0.164,
                { emissive: _ethiconPurple, emissiveIntensity: 0.85 }));
            // SYNC LED yanında küçük ESU sembolü (sarı şimşek)
            g.add(box(0.014, 0.020, 0.005, _ledYellow, 0.06, 0.66, 0.164,
                { emissive: _ledYellow, emissiveIntensity: 0.95 }));

            // ============================================================
            // PUSH HANDLE (üst — kompakt manevra)
            // ============================================================
            g.add(cyl(0.012, 0.012, 0.30, _chrome, 0, 1.04, -0.14,
                { seg: 14, metalness: 0.78, roughness: 0.14 }));
            g.add(cyl(0.014, 0.014, 0.018, _dark, -0.15, 1.04, -0.14,
                { seg: 14, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.014, 0.014, 0.018, _dark, 0.15, 1.04, -0.14,
                { seg: 14, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.013, 0.013, 0.26, _dark, 0, 1.04, -0.14,
                { seg: 12, roughness: 0.85 }));

            // ============================================================
            // POWER BUTTON (sağ-alt — krom dairesel)
            // ============================================================
            g.add(cyl(0.018, 0.018, 0.008, _chrome, 0.13, 0.40, 0.164,
                { seg: 16, metalness: 0.78, roughness: 0.18 }));
            g.add(cyl(0.012, 0.012, 0.012, _ledGreen, 0.13, 0.405, 0.170,
                { seg: 12, emissive: _ledGreen, emissiveIntensity: 0.95 }));

            // ============================================================
            // ETİKET PLAKASI (üst-ön — kırmızı LED kasası "MEGA VAC PLUS")
            // Cihaz tanıtım etiketi — preop monitör tarzı
            // ============================================================
            // Anodize koyu arka plaka
            g.add(box(0.24, 0.040, 0.005, _dark, 0, 0.985, 0.164,
                { metalness: 0.55, roughness: 0.30 }));
            // Kırmızı LED ana etiket bandı (parlak okunur kırmızı)
            g.add(box(0.22, 0.030, 0.0015, _ledRed, 0, 0.985, 0.168,
                { emissive: _ledRed, emissiveIntensity: 0.95 }));
            // Sol-sağ brushed alu accent (kenar süslemesi)
            g.add(box(0.005, 0.026, 0.005, _chrome, -0.108, 0.985, 0.168,
                { metalness: 0.78, roughness: 0.16 }));
            g.add(box(0.005, 0.026, 0.005, _chrome, 0.108, 0.985, 0.168,
                { metalness: 0.78, roughness: 0.16 }));

            // ============================================================
            // SYNC PORT — yalnızca cihaz üzerindeki aktif bağlantı göstergesi
            // ============================================================
            // Eski görsel sync kablosu sahnede ESU portuna tam oturmadığı için kaldırıldı.
            // Boşta kalan kablo hissi vermemek adına burada sadece soket/LED bırakıldı.
            g.add(cyl(0.012, 0.012, 0.014, _chrome, -0.180, 0.55, -0.10,
                { seg: 14, metalness: 0.78, roughness: 0.16 }));
            g.add(cyl(0.010, 0.010, 0.012, _ethiconPurple, -0.180, 0.55, -0.106,
                { seg: 12, emissive: _ethiconPurple, emissiveIntensity: 0.95 }));

            // ============================================================
            // POWER GİRİŞİ — boşta kablo yok
            // ============================================================
            // Eski zemine düşen AC kablosu/fiş kaldırıldı. Sahnede gerçek bir priz
            // veya duvar beslemesi modellenmediği için bu kablo boşta kalıyordu.
            g.add(box(0.040, 0.030, 0.012, 0x12161c, 0, 0.20, -0.165,
                { metalness: 0.30, roughness: 0.55 }));
            g.add(box(0.028, 0.022, 0.005, _chrome, 0, 0.20, -0.172,
                { metalness: 0.78, roughness: 0.16 }));

            return g;
        }

        function buildAirwayCartV151(x, y, z) {
            // ULTRA-PREMIUM AIRWAY/MEDICATION WORKSTATION + BLOOD WARMER v9.0
            // 
            // İKİ ZON yapı korunur (sol marker airway-cart + sağ marker blood-warmer):
            //   SOL MODÜL  (x = -0.32 obje uzayında): Airway/İlaç workstation
            //   SAĞ MODÜL  (x = +0.32 obje uzayında): Kan/Sıvı Isıtıcı
            //   Ortada menteşe sistemi (mafsal + LED bağlantı)
            //
            // Sol modülde net 2 ZON:
            //   - ZON A (üst): Airway tepsisi + ekipman slotları + video laringoskop ekranı
            //   - ZON B (alt): Renk kodlu ilaç çekmeceleri + barkod doğrulama paneli + sharps
            //
            // Premium materyal: mat medikal beyaz, grafit gövde, koyu cam ekran,
            // fırçalanmış metal detaylar, düşük opaklıkta LED.
            const g = groupAt(x, y, z);
            const chromeMat = { metalness: 0.50, roughness: 0.18 };
            const matteCarbon = { metalness: 0.18, roughness: 0.45 };
            const glossWhite = { metalness: 0.22, roughness: 0.20 };
            
            // ============================================================
            // SOL MODÜL: AIRWAY/İLAÇ WORKSTATION (x merkez = -0.32)
            // ============================================================
            const SX = -0.32; // Sol modül merkez x
            
            // ===== ALT TABAN + 4 KİLİTLİ TEKERLEK =====
            g.add(box(0.62, 0.06, 0.50, 0x2a3540, SX, 0.030, 0, { 
                metalness: 0.30, roughness: 0.40 
            }));
            // Düşük opak aksent
            g.add(box(0.60, 0.006, 0.50, 0x88e0d4, SX, 0.064, 0, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.18, transparent: true, opacity: 0.55 
            }));
            
            [-0.25, 0.25].forEach(dx => [-0.20, 0.20].forEach(zz => {
                const xx = SX + dx;
                g.add(box(0.026, 0.040, 0.026, 0x4a5e72, xx, 0.044, zz, { 
                    metalness: 0.40, roughness: 0.24 
                }));
                const w = cyl(0.040, 0.040, 0.028, 0x1a2230, xx, 0.022, zz, { 
                    seg: 14, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
                const hub = cyl(0.020, 0.020, 0.032, 0xb8c4cf, xx, 0.022, zz, { 
                    seg: 12, metalness: 0.55, roughness: 0.18 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
                g.add(box(0.014, 0.008, 0.018, 0x4cb88a, xx, 0.022, 
                    zz + (zz > 0 ? 0.030 : -0.030), { 
                    emissive: 0x4cb88a, emissiveIntensity: 0.40 
                }));
            }));
            
            // ===== ZON B: ANA GÖVDE — İLAÇ ÇEKMECELERİ (alt) =====
            // Ana gövde (premium beyaz)
            g.add(box(0.58, 0.66, 0.46, 0xeef3f7, SX, 0.39, 0, { ...glossWhite }));
            // Yan grafit aksent (sol)
            g.add(box(0.014, 0.64, 0.46, 0x2a3540, SX - 0.290, 0.39, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            // Yan grafit aksent (sağ — orta menteşe yönüne)
            g.add(box(0.014, 0.64, 0.46, 0x2a3540, SX + 0.290, 0.39, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            
            // 4 RENK KODLU İLAÇ ÇEKMECESİ
            // Sırasıyla: İndüksiyon (mavi) / Acil (kırmızı) / Vazopresör (sarı) /
            //           Antiemetik-Analjezik (yeşil)
            const drawerColors = [0x6f9fd8, 0xa84a52, 0xc89030, 0x4cb88a];
            const drawerLabels = ['İND', 'ACİL', 'VAZO', 'ANT'];
            const drawerYs = [0.68, 0.55, 0.42, 0.29];
            drawerYs.forEach((yy, i) => {
                // Çekmece ön yüzü (premium beyaz)
                g.add(box(0.54, 0.10, 0.020, 0xfafdff, SX, yy, 0.231, { 
                    metalness: 0.20, roughness: 0.22 
                }));
                // Renk kodlu sol şerit (düşük opak)
                g.add(box(0.020, 0.090, 0.014, drawerColors[i], 
                    SX - 0.255, yy, 0.241, { 
                    emissive: drawerColors[i], emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.78 
                }));
                // Çekmece kulpu (ortada — ergonomik)
                g.add(box(0.16, 0.014, 0.014, 0x4a5e72, SX, yy - 0.020, 0.244, { 
                    metalness: 0.45, roughness: 0.20 
                }));
                // Etiket beyaz alanı
                g.add(box(0.080, 0.020, 0.012, 0xeef3f7, SX + 0.18, yy, 0.244, { 
                    roughness: 0.30 
                }));
                // Etiket renk kodu (üst çizgi)
                g.add(box(0.060, 0.005, 0.014, drawerColors[i], 
                    SX + 0.18, yy + 0.014, 0.247, { 
                    emissive: drawerColors[i], emissiveIntensity: 0.40 
                }));
            });
            
            // ===== KİLİTLİ NARKOTİK ÇEKMECESİ (en alt — küçük, ayrı temsil) =====
            g.add(box(0.54, 0.08, 0.020, 0x4a5e72, SX, 0.16, 0.231, { 
                metalness: 0.40, roughness: 0.28 
            }));
            // Kilit göstergesi (kırmızı küçük LED)
            g.add(cyl(0.010, 0.010, 0.012, 0xd96371, SX - 0.22, 0.160, 0.244, { 
                seg: 10, emissive: 0xd96371, emissiveIntensity: 0.50 
            }));
            // "CONTROLLED" yazı şeridi
            g.add(box(0.10, 0.014, 0.014, 0xd96371, SX, 0.160, 0.244, { 
                emissive: 0xd96371, emissiveIntensity: 0.30, 
                transparent: true, opacity: 0.70 
            }));
            // Kilit ikonu (ortada — krom)
            g.add(box(0.014, 0.018, 0.012, 0xb8c4cf, SX + 0.18, 0.160, 0.244, { 
                metalness: 0.55, roughness: 0.18 
            }));
            
            // ===== ZON A: ÜST AIRWAY TEPSİSİ (bel hizası — y=0.74-0.85) =====
            // Tepsi taşıyıcı yüzey (premium beyaz)
            g.add(box(0.60, 0.020, 0.48, 0xfafdff, SX, 0.730, 0, { 
                metalness: 0.30, roughness: 0.18 
            }));
            // Krom çerçeve (uzun kenarlar)
            g.add(box(0.62, 0.018, 0.020, 0x6f8798, SX, 0.732, 0.238, { 
                metalness: 0.55, roughness: 0.18 
            }));
            g.add(box(0.62, 0.018, 0.020, 0x6f8798, SX, 0.732, -0.238, { 
                metalness: 0.55, roughness: 0.18 
            }));
            
            // ===== AIRWAY EKİPMAN SLOTLARI (organize sıralı) =====
            // Slot ayırıcı çizgileri (alüminyum bantlar - tepsi üstünde)
            // Tepsi yarısını 5 slota böler
            
            // SLOT 1: LARİNGOSKOP SAPI + 3 BLADE
            // Sap (silindirik krom)
            const laryngoHandle = cyl(0.018, 0.020, 0.12, 0x4a5e72, SX - 0.22, 0.755, 0.10, { 
                seg: 14, metalness: 0.55, roughness: 0.20 
            });
            laryngoHandle.rotation.z = Math.PI / 2;
            g.add(laryngoHandle);
            // 3 farklı boy blade (krom, açılı)
            [0, 1, 2].forEach(i => {
                const blade = box(0.10 + i * 0.014, 0.014, 0.020, 0xb8c4cf, 
                    SX - 0.16 + i * 0.04, 0.752, 0.16 - i * 0.020, { 
                    metalness: 0.65, roughness: 0.18 
                });
                blade.rotation.y = 0.3 + i * 0.1;
                g.add(blade);
                // Blade kıvrımı (curve)
                g.add(box(0.020, 0.012, 0.014, 0xb8c4cf, 
                    SX - 0.10 + i * 0.04, 0.752, 0.13 - i * 0.020, { 
                    metalness: 0.65, roughness: 0.18 
                }));
            });
            // Slot 1 etiket ("LARYNGO")
            g.add(box(0.12, 0.005, 0.014, 0x4a7c8a, SX - 0.18, 0.742, 0.220, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.30, 
                transparent: true, opacity: 0.65 
            }));
            
            // SLOT 2: ENDOTRAKEAL TÜPLER (3 farklı boy)
            // Tüp 1 (büyük - mavi cuff)
            g.add(cyl(0.008, 0.008, 0.18, 0xeaf6f8, SX - 0.04, 0.748, 0.10, { 
                seg: 10, transparent: true, opacity: 0.78, roughness: 0.22 
            }));
            g.add(sphere(0.012, 0x6f9fd8, SX - 0.04, 0.748, 0.190, { 
                transparent: true, opacity: 0.65, emissive: 0x6f9fd8, emissiveIntensity: 0.20 
            }));
            // Tüp 2 (orta)
            g.add(cyl(0.007, 0.007, 0.16, 0xeaf6f8, SX - 0.02, 0.748, 0.10, { 
                seg: 10, transparent: true, opacity: 0.78, roughness: 0.22 
            }));
            g.add(sphere(0.010, 0x6f9fd8, SX - 0.02, 0.748, 0.180, { 
                transparent: true, opacity: 0.65 
            }));
            // Tüp 3 (küçük - pediatrik)
            g.add(cyl(0.006, 0.006, 0.14, 0xeaf6f8, 0 + SX, 0.748, 0.10, { 
                seg: 10, transparent: true, opacity: 0.78, roughness: 0.22 
            }));
            g.add(sphere(0.008, 0x6f9fd8, 0 + SX, 0.748, 0.170, { 
                transparent: true, opacity: 0.65 
            }));
            // Slot 2 etiket
            g.add(box(0.060, 0.005, 0.014, 0x6f9fd8, SX - 0.02, 0.742, 0.220, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.30, 
                transparent: true, opacity: 0.65 
            }));
            
            // SLOT 3: LMA / SUPRAGLOTTİK AIRWAY
            // LMA gövdesi (yumuşak silikon görünümlü)
            g.add(box(0.10, 0.014, 0.040, 0xefe5d0, SX + 0.06, 0.748, 0.06, { 
                roughness: 0.55 
            }));
            // LMA cuff (oval şişme bölge)
            g.add(sphere(0.024, 0xefe5d0, SX + 0.105, 0.752, 0.06, { 
                roughness: 0.55, transparent: true, opacity: 0.92 
            }));
            // LMA bağlantı tüpü
            g.add(cyl(0.008, 0.008, 0.10, 0xeaf6f8, SX + 0.020, 0.748, 0.06, { 
                seg: 10, transparent: true, opacity: 0.78 
            }));
            
            // SLOT 4: BOUGIE / STYLET (uzun ince çubuklar)
            // Bougie (uzun sarı)
            g.add(cyl(0.004, 0.004, 0.20, 0xc89030, SX + 0.06, 0.748, -0.06, { 
                seg: 8, roughness: 0.40 
            }));
            // Stylet (mavi)
            g.add(cyl(0.003, 0.003, 0.18, 0x6f9fd8, SX + 0.06, 0.748, -0.10, { 
                seg: 8, roughness: 0.30 
            }));
            
            // SLOT 5: ORAL + NAZAL AIRWAY
            // Oral airway (kavisli yeşil/sarı)
            g.add(box(0.06, 0.014, 0.020, 0xc89030, SX + 0.18, 0.748, -0.10, { 
                roughness: 0.45 
            }));
            // Oral airway kıvrımı
            g.add(sphere(0.014, 0xc89030, SX + 0.20, 0.748, -0.116, { 
                roughness: 0.45 
            }));
            // Nazal airway (saydam)
            g.add(cyl(0.005, 0.005, 0.08, 0xa8d4df, SX + 0.20, 0.748, -0.04, { 
                seg: 10, transparent: true, opacity: 0.65 
            }));
            
            // ===== ENJEKTÖR + CUFF ŞİŞİRME EKİPMANI (alt yan) =====
            // 5 enjektör (yatay sıralı - etiketli)
            const syringeColors = [0x6f9fd8, 0xa84a52, 0xc89030, 0x4cb88a, 0xeef3f7];
            [0, 1, 2, 3, 4].forEach(i => {
                const sx_pos = SX - 0.18 + i * 0.07;
                // Enjektör gövde (saydam silindir)
                g.add(cyl(0.008, 0.008, 0.080, 0xeaf6f8, sx_pos, 0.752, -0.16, { 
                    seg: 10, transparent: true, opacity: 0.55, roughness: 0.18 
                }));
                // Enjektör pistonu
                g.add(cyl(0.010, 0.010, 0.014, 0xfafdff, sx_pos, 0.760, -0.20, { 
                    seg: 10, roughness: 0.30 
                }));
                // Etiket (renk kodlu)
                g.add(box(0.020, 0.014, 0.014, syringeColors[i], 
                    sx_pos, 0.752, -0.13, { 
                    emissive: syringeColors[i], emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.70 
                }));
            });
            
            // Cuff şişirme şırıngası (10cc - belirgin)
            g.add(cyl(0.012, 0.012, 0.10, 0xeaf6f8, SX + 0.22, 0.752, -0.16, { 
                seg: 12, transparent: true, opacity: 0.55, roughness: 0.18 
            }));
            g.add(cyl(0.014, 0.014, 0.018, 0xfafdff, SX + 0.22, 0.760, -0.21, { 
                seg: 12, roughness: 0.30 
            }));
            
            // ===== KÜÇÜK ASPİRASYON BAĞLANTI UCU (sağ alt köşe) =====
            g.add(cyl(0.008, 0.012, 0.030, 0x4a5e72, SX + 0.24, 0.745, 0.20, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            // Aspirasyon ucu (Yankauer benzeri - krom uçlu)
            g.add(cyl(0.005, 0.008, 0.060, 0xb8c4cf, SX + 0.22, 0.752, 0.20, { 
                seg: 10, metalness: 0.55, roughness: 0.18 
            }));
            
            // ============================================================
            // ÜST DİKEY KONTROL EKRAN PANELİ (premium koyu cam)
            // ============================================================
            // Direk
            g.add(cyl(0.014, 0.014, 0.30, 0x4a5e72, SX - 0.20, 0.890, -0.20, { 
                seg: 12, metalness: 0.45, roughness: 0.22 
            }));
            // Pano kasası (orta)
            g.add(box(0.46, 0.24, 0.024, 0x0e1821, SX + 0.04, 1.020, -0.20, { 
                roughness: 0.20, metalness: 0.20 
            }));
            // Krom çerçeve
            g.add(box(0.476, 0.018, 0.020, 0x6f8798, SX + 0.04, 1.150, -0.20, { 
                metalness: 0.55, roughness: 0.18 
            }));
            g.add(box(0.476, 0.018, 0.020, 0x6f8798, SX + 0.04, 0.890, -0.20, { 
                metalness: 0.55, roughness: 0.18 
            }));
            // Aktif ekran (medikal mavi-koyu cam)
            g.add(box(0.42, 0.20, 0.018, 0x1a2940, SX + 0.04, 1.020, -0.190, { 
                roughness: 0.16 
            }));
            // Üst başlık LED şeridi
            g.add(box(0.36, 0.014, 0.014, 0x4a7c8a, SX + 0.04, 1.115, -0.182, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.40 
            }));
            
            // 3 STATUS GÖSTERGESİ (AIRWAY READY / DIFFICULT AIRWAY / MED CHECK)
            // AIRWAY READY (yeşil - aktif onay)
            g.add(cyl(0.012, 0.012, 0.012, 0x4cb88a, SX - 0.14, 1.080, -0.180, { 
                seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.55 
            }));
            g.add(box(0.18, 0.020, 0.014, 0x4cb88a, SX + 0.04, 1.080, -0.180, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.32, 
                transparent: true, opacity: 0.65 
            }));
            // Beyaz değer kutu
            g.add(box(0.05, 0.014, 0.014, 0xfafdff, SX + 0.16, 1.080, -0.182, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            
            // DIFFICULT AIRWAY (sarı uyarı)
            g.add(cyl(0.012, 0.012, 0.012, 0xc89030, SX - 0.14, 1.020, -0.180, { 
                seg: 12, emissive: 0xc89030, emissiveIntensity: 0.55 
            }));
            g.add(box(0.18, 0.020, 0.014, 0xc89030, SX + 0.04, 1.020, -0.180, { 
                emissive: 0xc89030, emissiveIntensity: 0.32, 
                transparent: true, opacity: 0.65 
            }));
            g.add(box(0.05, 0.014, 0.014, 0xfafdff, SX + 0.16, 1.020, -0.182, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            
            // MED CHECK (yeşil onay)
            g.add(cyl(0.012, 0.012, 0.012, 0x4cb88a, SX - 0.14, 0.960, -0.180, { 
                seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.55 
            }));
            g.add(box(0.18, 0.020, 0.014, 0x4cb88a, SX + 0.04, 0.960, -0.180, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.32, 
                transparent: true, opacity: 0.65 
            }));
            g.add(box(0.05, 0.014, 0.014, 0xfafdff, SX + 0.16, 0.960, -0.182, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            
            // Alt onay rozeti (✓ — başarılı durum)
            g.add(box(0.080, 0.020, 0.014, 0x4cb88a, SX + 0.04, 0.910, -0.180, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.45 
            }));
            
            // ============================================================
            // VİDEO LARİNGOSKOP EKRANI (üst sağ — küçük dik monitör)
            // ============================================================
            // Mini direk
            g.add(cyl(0.010, 0.010, 0.18, 0x4a5e72, SX + 0.20, 0.840, 0.18, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            // Monitör kasası (siyah)
            g.add(box(0.16, 0.12, 0.020, 0x0e1821, SX + 0.20, 0.940, 0.18, { 
                roughness: 0.18, metalness: 0.20 
            }));
            // Aktif ekran (cam mavi)
            g.add(box(0.14, 0.10, 0.014, 0x1a2940, SX + 0.20, 0.940, 0.190, { 
                roughness: 0.16 
            }));
            // Video laringoskop görüntü (orta - airway anatomik vurgu)
            g.add(box(0.10, 0.06, 0.014, 0x6f9fd8, SX + 0.20, 0.940, 0.196, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.40, 
                transparent: true, opacity: 0.70 
            }));
            // Crosshair işareti (siyah +)
            g.add(box(0.020, 0.003, 0.014, 0xfafdff, SX + 0.20, 0.940, 0.198, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            g.add(box(0.003, 0.020, 0.014, 0xfafdff, SX + 0.20, 0.940, 0.198, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            // "VIDEO LARYNGO" alt etiket
            g.add(box(0.060, 0.012, 0.014, 0x4a7c8a, SX + 0.20, 0.876, 0.190, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.30, 
                transparent: true, opacity: 0.70 
            }));
            
            // ============================================================
            // MİNİ BARKOD/İLAÇ DOĞRULAMA PANELİ (sol yan ön - alt)
            // ============================================================
            // Pano kasası
            g.add(box(0.10, 0.16, 0.020, 0x0e1821, SX - 0.22, 0.450, 0.245, { 
                roughness: 0.20 
            }));
            // Aktif ekran
            g.add(box(0.085, 0.13, 0.014, 0x1a2940, SX - 0.22, 0.450, 0.255, { 
                roughness: 0.16 
            }));
            // Barkod tarayıcı LED (mavi - aktif)
            g.add(box(0.05, 0.014, 0.014, 0x4a7c8a, SX - 0.22, 0.500, 0.260, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.50 
            }));
            // 5 doğrulama satırı LED (5 R: right patient/drug/dose/route/time)
            [0.470, 0.450, 0.430, 0.410, 0.390].forEach(yy => {
                g.add(cyl(0.005, 0.005, 0.008, 0x4cb88a, SX - 0.245, yy, 0.260, { 
                    seg: 8, emissive: 0x4cb88a, emissiveIntensity: 0.55 
                }));
                g.add(box(0.040, 0.008, 0.014, 0xfafdff, SX - 0.21, yy, 0.260, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.25 
                }));
            });
            
            // ============================================================
            // KESİCİ-DELİCİ ATIK (sharps container - sağ alt yan)
            // ============================================================
            // Sarı sharps konteyneri
            g.add(box(0.10, 0.12, 0.10, 0xc89030, SX + 0.22, 0.430, 0.24, { 
                roughness: 0.42 
            }));
            // Üst kapak (giriş slotu)
            g.add(box(0.10, 0.018, 0.10, 0xa07330, SX + 0.22, 0.500, 0.24, { 
                roughness: 0.40 
            }));
            // Slot deliği (siyah)
            g.add(box(0.06, 0.014, 0.024, 0x1a2230, SX + 0.22, 0.510, 0.24, { 
                roughness: 0.30 
            }));
            // Biohazard sembol
            g.add(box(0.040, 0.040, 0.012, 0xa84a52, SX + 0.22, 0.450, 0.295, { 
                emissive: 0xa84a52, emissiveIntensity: 0.30, 
                transparent: true, opacity: 0.85 
            }));
            // İç siyah daire
            g.add(cyl(0.012, 0.012, 0.008, 0x1a2230, SX + 0.22, 0.450, 0.302, { 
                seg: 12, roughness: 0.30 
            }));
            // "SHARPS" etiketi
            g.add(box(0.05, 0.012, 0.014, 0xfafdff, SX + 0.22, 0.388, 0.295, { 
                roughness: 0.30 
            }));
            
            // ============================================================
            // ÜST TUTAMAÇ (mobilite)
            // ============================================================
            g.add(cyl(0.012, 0.012, 0.16, 0x4a5e72, SX - 0.18, 0.760, -0.21, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            g.add(cyl(0.012, 0.012, 0.16, 0x4a5e72, SX + 0.10, 0.760, -0.21, { 
                seg: 10, metalness: 0.45, roughness: 0.22 
            }));
            
            // ============================================================
            // MENTEŞE SİSTEMİ (orta — sol modül ile sağ modülü bağlar)
            // ============================================================
            // Üst mafsal silindiri
            g.add(cyl(0.030, 0.030, 0.10, 0x6f8798, 0, 0.80, 0, { 
                seg: 16, metalness: 0.55, roughness: 0.20 
            }));
            // Alt mafsal silindiri
            g.add(cyl(0.030, 0.030, 0.10, 0x6f8798, 0, 0.30, 0, { 
                seg: 16, metalness: 0.55, roughness: 0.20 
            }));
            // Bağlantı LED (yeşil - aktif menteşe)
            g.add(cyl(0.014, 0.014, 0.012, 0x4cb88a, 0, 0.55, 0.040, { 
                seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.55 
            }));
            
            // ============================================================
            // SAĞ MODÜL: KAN/SIVI ISITICI (x merkez = +0.32) - korunur
            // ============================================================
            const RX = 0.32;
            
            // Alt taban + tekerlekler
            g.add(box(0.50, 0.06, 0.46, 0x2a3540, RX, 0.030, 0, { 
                metalness: 0.30, roughness: 0.40 
            }));
            [-0.20, 0.20].forEach(dx => [-0.18, 0.18].forEach(zz => {
                const xx = RX + dx;
                g.add(box(0.022, 0.040, 0.022, 0x4a5e72, xx, 0.044, zz, { 
                    metalness: 0.40, roughness: 0.24 
                }));
                const w = cyl(0.036, 0.036, 0.024, 0x1a2230, xx, 0.022, zz, { 
                    seg: 12, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
            }));
            
            // Ana gövde (premium)
            g.add(box(0.46, 0.92, 0.42, 0xeef3f7, RX, 0.52, 0, { ...glossWhite }));
            // Yan grafit aksent
            g.add(box(0.014, 0.90, 0.42, 0x2a3540, RX + 0.230, 0.52, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            
            // Üst kasa kapak
            g.add(box(0.48, 0.020, 0.44, 0x4a5e72, RX, 0.990, 0, { 
                metalness: 0.40, roughness: 0.24 
            }));
            
            // Kontrol ekranı
            g.add(box(0.32, 0.18, 0.024, 0x0e1821, RX, 0.85, 0.211, { 
                roughness: 0.20 
            }));
            // Aktif ekran
            g.add(box(0.28, 0.14, 0.018, 0x1a2940, RX, 0.85, 0.222, { 
                roughness: 0.16 
            }));
            // 38°C aktif sıcaklık değer (sarı)
            g.add(box(0.18, 0.030, 0.014, 0xc89030, RX, 0.85, 0.230, { 
                emissive: 0xc89030, emissiveIntensity: 0.50 
            }));
            // Termal trend bar (yatay - kırmızı)
            g.add(box(0.20, 0.010, 0.014, 0xa84a52, RX, 0.815, 0.230, { 
                emissive: 0xa84a52, emissiveIntensity: 0.45 
            }));
            // Sıcaklık ayar +/- (2 buton)
            g.add(cyl(0.012, 0.012, 0.014, 0x4cb88a, RX - 0.10, 0.78, 0.218, { 
                seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.50 
            }));
            g.add(cyl(0.012, 0.012, 0.014, 0xa84a52, RX + 0.10, 0.78, 0.218, { 
                seg: 12, emissive: 0xa84a52, emissiveIntensity: 0.50 
            }));
            
            // Akış sensörü (orta)
            g.add(box(0.10, 0.06, 0.020, 0xeaf6f8, RX, 0.70, 0.211, { 
                transparent: true, opacity: 0.62, roughness: 0.20 
            }));
            
            // IV direği (kanca + 2 torba)
            g.add(cyl(0.018, 0.018, 0.50, 0xb8c4cf, RX, 1.25, -0.16, { 
                seg: 14, metalness: 0.50, roughness: 0.20 
            }));
            // Kanca
            g.add(cyl(0.020, 0.020, 0.014, 0x6f8798, RX, 1.50, -0.16, { 
                seg: 14, metalness: 0.55 
            }));
            
            // Kan torbası (kırmızı)
            g.add(box(0.10, 0.18, 0.040, 0xa84a52, RX - 0.06, 1.40, -0.16, { 
                roughness: 0.42, transparent: true, opacity: 0.85 
            }));
            // Kan torbası etiketi
            g.add(box(0.060, 0.020, 0.012, 0xfafdff, RX - 0.06, 1.42, -0.140, { 
                roughness: 0.30 
            }));
            
            // SF torbası (saydam)
            g.add(box(0.10, 0.18, 0.040, 0xeaf6f8, RX + 0.06, 1.40, -0.16, { 
                transparent: true, opacity: 0.62, roughness: 0.32 
            }));
            // SF etiketi
            g.add(box(0.060, 0.020, 0.012, 0xfafdff, RX + 0.06, 1.42, -0.140, { 
                roughness: 0.30 
            }));
            g.add(box(0.040, 0.005, 0.014, 0x6f9fd8, RX + 0.06, 1.430, -0.134, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.30 
            }));
            
            // 2 IV hattı (mavi tüpler aşağıya)
            const iv1 = cyl(0.005, 0.005, 0.50, 0xa84a52, RX - 0.06, 1.20, -0.10, { 
                seg: 8, transparent: true, opacity: 0.62 
            });
            iv1.rotation.x = -0.3;
            g.add(iv1);
            const iv2 = cyl(0.005, 0.005, 0.50, 0x6f9fd8, RX + 0.06, 1.20, -0.10, { 
                seg: 8, transparent: true, opacity: 0.62 
            });
            iv2.rotation.x = -0.3;
            g.add(iv2);
            
            // IV pompası (orta üst)
            g.add(box(0.16, 0.10, 0.040, 0x2a3540, RX, 1.10, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            // Pompa LED
            g.add(box(0.10, 0.012, 0.014, 0x4cb88a, RX, 1.10, 0.022, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.50 
            }));
            
            return g;
        }

        function buildRapidInfuserV151(x, y, z) {
            // Eski ayrı kan/sıvı ısıtıcı artık entegre Airway+Warmer modülünün
            // parçası (menteşe ile bağlı). Bu fonksiyon geriye dönük uyumluluk
            // için boş bir grup döndürür.
            return groupAt(x, y, z);
        }

        function buildSpecimenStationV151(x, y, z) {
            // ULTRA-PREMIUM SPECIMEN VERIFICATION WORKSTATION v9.0
            // Sirküle hemşire için ergonomik bel hizası tezgâh.
            // Mayo Clinic / modern hibrit OR standardı.
            // 
            // Mimari:
            //   - Yerden 0.85m yüksek çalışma yüzeyi (bel hizası ergonomi)
            //   - 4 sabit ayak + ayar pedalı (mobilite gerekirse)
            //   - 4 renk kodlu numune kabı + altta etiket alanı + üst raf
            //   - Modern barkod/QR yazıcı (rulo + ekran)
            //   - Dikey LED dokunmatik doğrulama paneli
            //   - Soğuk transport kutusu (yan bölme)
            //   - Biohazard kovacığı (ayrı bölme)
            //   - Alt depolama çekmecesi
            //   - Premium materyal: grafit + beyaz + koyu cam
            const g = groupAt(x, y, z);
            const chromeMat = { metalness: 0.45, roughness: 0.22 };
            const matteCarbon = { metalness: 0.18, roughness: 0.45 };
            const glossWhite = { metalness: 0.20, roughness: 0.22 };
            
            // ==========================================================
            // ALT TABAN + 4 AYAK + 4 KİLİTLİ TEKERLEK
            // ==========================================================
            // Ana taban (premium grafit)
            g.add(box(1.10, 0.06, 0.66, 0x2a3540, 0, 0.030, 0, { 
                metalness: 0.30, roughness: 0.40 
            }));
            // Aksent şerit (düşük opak)
            g.add(box(1.06, 0.006, 0.66, 0x88e0d4, 0, 0.064, 0, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.20, transparent: true, opacity: 0.55 
            }));
            // 4 caster
            [-0.48, 0.48].forEach(xx => [-0.28, 0.28].forEach(zz => {
                // Çatal
                g.add(box(0.026, 0.040, 0.026, 0x4a5e72, xx, 0.044, zz, { 
                    metalness: 0.40, roughness: 0.24 
                }));
                // Tekerlek
                const w = cyl(0.040, 0.040, 0.028, 0x1a2230, xx, 0.022, zz, { 
                    seg: 14, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
                // Krom hub
                const hub = cyl(0.020, 0.020, 0.032, 0xb8c4cf, xx, 0.022, zz, { 
                    seg: 12, metalness: 0.55, roughness: 0.18 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
                // Kilit pedal
                g.add(box(0.014, 0.008, 0.018, 0x4cb88a, xx, 0.022, 
                    zz + (zz > 0 ? 0.030 : -0.030), { 
                    emissive: 0x4cb88a, emissiveIntensity: 0.40 
                }));
            }));
            
            // ==========================================================
            // ANA GÖVDE - Alt depolama (zeminden 0.06 → 0.66)
            // ==========================================================
            g.add(box(1.04, 0.60, 0.60, 0xc7d0d8, 0, 0.36, 0, { ...glossWhite }));
            // Yan grafit panel (sol uzun kenar)
            g.add(box(0.014, 0.58, 0.60, 0x2a3540, -0.520, 0.36, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            // Sağ aksent
            g.add(box(0.014, 0.58, 0.60, 0x2a3540, 0.520, 0.36, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            
            // 2 çekmece ön yüzü
            [-0.20, 0.20].forEach((xx, i) => {
                // Çekmece
                g.add(box(0.42, 0.16, 0.020, 0xeef3f7, xx, 0.50, 0.301, { 
                    metalness: 0.18, roughness: 0.26 
                }));
                // Çekmece kulpu
                g.add(box(0.16, 0.014, 0.014, 0x4a5e72, xx, 0.50, 0.314, { 
                    metalness: 0.45, roughness: 0.20 
                }));
                // Renk kodlu etiket (yan)
                g.add(box(0.040, 0.020, 0.014, [0x4cb88a, 0x6f9fd8][i], 
                    xx - 0.18, 0.50, 0.314, { 
                    emissive: [0x4cb88a, 0x6f9fd8][i], emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.70 
                }));
            });
            // Alt çekmece (geniş)
            g.add(box(0.86, 0.16, 0.020, 0xeef3f7, 0, 0.30, 0.301, { 
                metalness: 0.18, roughness: 0.26 
            }));
            g.add(box(0.18, 0.014, 0.014, 0x4a5e72, 0, 0.30, 0.314, { 
                metalness: 0.45, roughness: 0.20 
            }));
            // Çekmece kategori etiketi
            g.add(box(0.060, 0.018, 0.014, 0xeef3f7, -0.36, 0.30, 0.314, { roughness: 0.30 }));
            g.add(box(0.040, 0.005, 0.014, 0x4a7c8a, -0.36, 0.302, 0.318, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.30 
            }));
            
            // ==========================================================
            // BEL HİZASI ÇALIŞMA YÜZEYİ (y=0.69 — ergonomik)
            // ==========================================================
            // Ana yüzey (premium beyaz steril)
            g.add(box(1.08, 0.030, 0.64, 0xfafdff, 0, 0.685, 0, { 
                metalness: 0.30, roughness: 0.18 
            }));
            // Krom kenar (uzun kenarlar)
            g.add(box(1.10, 0.020, 0.018, 0x6f8798, 0, 0.690, 0.318, { 
                metalness: 0.55, roughness: 0.18 
            }));
            g.add(box(1.10, 0.020, 0.018, 0x6f8798, 0, 0.690, -0.318, { 
                metalness: 0.55, roughness: 0.18 
            }));
            // Üst yüzey hafif highlight (cam fitil görünüm)
            g.add(box(0.96, 0.005, 0.56, 0xeaf6f8, 0, 0.703, 0, { 
                transparent: true, opacity: 0.30, roughness: 0.10, metalness: 0.20 
            }));
            
            // ==========================================================
            // 4 RENK KODLU NUMUNE KABI (kontrollü sırada — ergonomik)
            // Sıra: FORMALİN → FROZEN → KÜLTÜR → SİTOLOJİ
            // Daha büyük, ergonomik kullanım için
            // ==========================================================
            const containerY = 0.78;
            const labelY = 0.704;
            
            // FORMALİN (mor) - x=-0.36
            (function() {
                const dx = -0.36, color = 0x9b6fb8, name = 'FORM';
                // Cam kavanoz (büyük, görünür)
                g.add(cyl(0.060, 0.060, 0.16, 0xeaf6f8, dx, containerY, 0.05, { 
                    seg: 22, transparent: true, opacity: 0.50, roughness: 0.14, metalness: 0.18 
                }));
                // Saydam içerik (formalin sıvısı)
                g.add(cyl(0.055, 0.055, 0.10, color, dx, containerY - 0.020, 0.05, { 
                    seg: 20, transparent: true, opacity: 0.45 
                }));
                // Üst kapak (renk kodlu - belirgin)
                g.add(cyl(0.066, 0.066, 0.018, color, dx, containerY + 0.090, 0.05, { 
                    seg: 22, emissive: color, emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.85 
                }));
                // Krom kapak halkası
                const lidRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.062, 0.005, 6, 22),
                    mat(0xb8c4cf, { metalness: 0.55, roughness: 0.18 })
                );
                lidRing.rotation.x = Math.PI / 2;
                lidRing.position.set(dx, containerY + 0.099, 0.05);
                prepMesh(lidRing); g.add(lidRing);
                // Alt etiket alanı (tezgah üstünde renk kodlu plaka)
                g.add(box(0.10, 0.014, 0.10, color, dx, labelY + 0.006, 0.05, { 
                    emissive: color, emissiveIntensity: 0.20, transparent: true, opacity: 0.55 
                }));
                // Ön etiket (üzerine yazı çizgisi)
                g.add(box(0.080, 0.022, 0.014, 0xfafdff, dx, containerY - 0.010, 0.115, { 
                    roughness: 0.30 
                }));
                g.add(box(0.060, 0.005, 0.014, color, dx, containerY - 0.010, 0.122, { 
                    emissive: color, emissiveIntensity: 0.40 
                }));
            })();
            
            // FROZEN (mavi) - x=-0.12
            (function() {
                const dx = -0.12, color = 0x6f9fd8;
                g.add(cyl(0.060, 0.060, 0.16, 0xeaf6f8, dx, containerY, 0.05, { 
                    seg: 22, transparent: true, opacity: 0.50, roughness: 0.14, metalness: 0.18 
                }));
                g.add(cyl(0.055, 0.055, 0.10, color, dx, containerY - 0.020, 0.05, { 
                    seg: 20, transparent: true, opacity: 0.45 
                }));
                g.add(cyl(0.066, 0.066, 0.018, color, dx, containerY + 0.090, 0.05, { 
                    seg: 22, emissive: color, emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.85 
                }));
                const lidRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.062, 0.005, 6, 22),
                    mat(0xb8c4cf, { metalness: 0.55, roughness: 0.18 })
                );
                lidRing.rotation.x = Math.PI / 2;
                lidRing.position.set(dx, containerY + 0.099, 0.05);
                prepMesh(lidRing); g.add(lidRing);
                g.add(box(0.10, 0.014, 0.10, color, dx, labelY + 0.006, 0.05, { 
                    emissive: color, emissiveIntensity: 0.20, transparent: true, opacity: 0.55 
                }));
                g.add(box(0.080, 0.022, 0.014, 0xfafdff, dx, containerY - 0.010, 0.115, { 
                    roughness: 0.30 
                }));
                g.add(box(0.060, 0.005, 0.014, color, dx, containerY - 0.010, 0.122, { 
                    emissive: color, emissiveIntensity: 0.40 
                }));
                // Frozen için kar tanesi simgesi
                g.add(box(0.014, 0.014, 0.005, 0xfafdff, dx, containerY + 0.030, 0.115, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.40 
                }));
            })();
            
            // KÜLTÜR (yeşil) - x=+0.12
            (function() {
                const dx = 0.12, color = 0x4cb88a;
                g.add(cyl(0.060, 0.060, 0.16, 0xeaf6f8, dx, containerY, 0.05, { 
                    seg: 22, transparent: true, opacity: 0.50, roughness: 0.14, metalness: 0.18 
                }));
                g.add(cyl(0.055, 0.055, 0.10, color, dx, containerY - 0.020, 0.05, { 
                    seg: 20, transparent: true, opacity: 0.45 
                }));
                g.add(cyl(0.066, 0.066, 0.018, color, dx, containerY + 0.090, 0.05, { 
                    seg: 22, emissive: color, emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.85 
                }));
                const lidRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.062, 0.005, 6, 22),
                    mat(0xb8c4cf, { metalness: 0.55, roughness: 0.18 })
                );
                lidRing.rotation.x = Math.PI / 2;
                lidRing.position.set(dx, containerY + 0.099, 0.05);
                prepMesh(lidRing); g.add(lidRing);
                g.add(box(0.10, 0.014, 0.10, color, dx, labelY + 0.006, 0.05, { 
                    emissive: color, emissiveIntensity: 0.20, transparent: true, opacity: 0.55 
                }));
                g.add(box(0.080, 0.022, 0.014, 0xfafdff, dx, containerY - 0.010, 0.115, { 
                    roughness: 0.30 
                }));
                g.add(box(0.060, 0.005, 0.014, color, dx, containerY - 0.010, 0.122, { 
                    emissive: color, emissiveIntensity: 0.40 
                }));
            })();
            
            // SİTOLOJİ (sarı) - x=+0.36
            (function() {
                const dx = 0.36, color = 0xe0a558;
                g.add(cyl(0.060, 0.060, 0.16, 0xeaf6f8, dx, containerY, 0.05, { 
                    seg: 22, transparent: true, opacity: 0.50, roughness: 0.14, metalness: 0.18 
                }));
                g.add(cyl(0.055, 0.055, 0.10, color, dx, containerY - 0.020, 0.05, { 
                    seg: 20, transparent: true, opacity: 0.45 
                }));
                g.add(cyl(0.066, 0.066, 0.018, color, dx, containerY + 0.090, 0.05, { 
                    seg: 22, emissive: color, emissiveIntensity: 0.30, 
                    transparent: true, opacity: 0.85 
                }));
                const lidRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.062, 0.005, 6, 22),
                    mat(0xb8c4cf, { metalness: 0.55, roughness: 0.18 })
                );
                lidRing.rotation.x = Math.PI / 2;
                lidRing.position.set(dx, containerY + 0.099, 0.05);
                prepMesh(lidRing); g.add(lidRing);
                g.add(box(0.10, 0.014, 0.10, color, dx, labelY + 0.006, 0.05, { 
                    emissive: color, emissiveIntensity: 0.20, transparent: true, opacity: 0.55 
                }));
                g.add(box(0.080, 0.022, 0.014, 0xfafdff, dx, containerY - 0.010, 0.115, { 
                    roughness: 0.30 
                }));
                g.add(box(0.060, 0.005, 0.014, color, dx, containerY - 0.010, 0.122, { 
                    emissive: color, emissiveIntensity: 0.40 
                }));
            })();
            
            // ==========================================================
            // BARKOD/QR ETİKET YAZICI (sol arka köşede)
            // ==========================================================
            // Yazıcı kasası (modern siyah)
            g.add(box(0.20, 0.18, 0.18, 0x2a3540, -0.38, 0.790, -0.18, { 
                ...matteCarbon 
            }));
            // Üst kapak
            g.add(box(0.21, 0.020, 0.19, 0x4a5e72, -0.38, 0.890, -0.18, { 
                metalness: 0.40, roughness: 0.24 
            }));
            // Etiket rulosu (üstten görünür silindirik)
            g.add(cyl(0.030, 0.030, 0.10, 0xfafdff, -0.38, 0.910, -0.18, { 
                seg: 16, roughness: 0.25 
            }));
            // Rulo merkezi
            g.add(cyl(0.010, 0.010, 0.110, 0x4a5e72, -0.38, 0.910, -0.18, { 
                seg: 10, metalness: 0.45 
            }));
            // Yazıcı çıkış slotu (önde)
            g.add(box(0.12, 0.010, 0.014, 0x1a2230, -0.38, 0.730, -0.094, { 
                roughness: 0.20 
            }));
            // Çıkmakta olan barkod etiketi
            g.add(box(0.080, 0.005, 0.024, 0xfafdff, -0.38, 0.725, -0.080, { 
                roughness: 0.30 
            }));
            // Barkod çizgileri
            [-0.024, -0.014, -0.005, 0.005, 0.014, 0.024].forEach(dx => {
                g.add(box(0.001, 0.005, 0.018, 0x1a2230, -0.38 + dx, 0.725, -0.078, { 
                    roughness: 0.40 
                }));
            });
            // Yazıcı dijital ekranı
            g.add(box(0.10, 0.040, 0.014, 0x0e1821, -0.38, 0.820, -0.094, { roughness: 0.18 }));
            g.add(box(0.080, 0.025, 0.014, 0x4a7c8a, -0.38, 0.820, -0.087, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.40 
            }));
            // Yazıcı durum LED (yeşil = hazır)
            g.add(cyl(0.010, 0.010, 0.008, 0x4cb88a, -0.31, 0.760, -0.094, { 
                seg: 10, emissive: 0x4cb88a, emissiveIntensity: 0.55 
            }));
            
            // ==========================================================
            // DİKEY DOĞRULAMA PANELİ (orta arka — büyük dokunmatik)
            // ==========================================================
            // Pano direği
            g.add(cyl(0.014, 0.014, 0.20, 0x4a5e72, 0, 0.800, -0.28, { 
                seg: 12, metalness: 0.45, roughness: 0.22 
            }));
            // Pano kasası (premium ekran)
            g.add(box(0.36, 0.26, 0.024, 0x0e1821, 0, 0.940, -0.275, { 
                roughness: 0.20, metalness: 0.20 
            }));
            // Çerçeve (krom)
            g.add(box(0.376, 0.018, 0.020, 0x6f8798, 0, 1.080, -0.275, { 
                metalness: 0.55, roughness: 0.18 
            }));
            g.add(box(0.376, 0.018, 0.020, 0x6f8798, 0, 0.800, -0.275, { 
                metalness: 0.55, roughness: 0.18 
            }));
            // Aktif ekran (medikal mavi-koyu cam)
            g.add(box(0.32, 0.22, 0.018, 0x1a2940, 0, 0.940, -0.265, { 
                roughness: 0.16 
            }));
            // Üst başlık şeridi (LED)
            g.add(box(0.28, 0.014, 0.014, 0x4a7c8a, 0, 1.040, -0.260, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.40 
            }));
            
            // 3 doğrulama satırı: HASTA, BÖLGE, ETİKET
            ['Hasta', 'Bölge', 'Etiket'].forEach((label, i) => {
                const yy = 0.985 - i * 0.038;
                // Yeşil onay LED
                g.add(cyl(0.010, 0.010, 0.014, 0x4cb88a, -0.10, yy, -0.258, { 
                    seg: 10, emissive: 0x4cb88a, emissiveIntensity: 0.60 
                }));
                // Etiket çizgisi
                g.add(box(0.16, 0.018, 0.014, 0x4cb88a, 0.04, yy, -0.258, { 
                    emissive: 0x4cb88a, emissiveIntensity: 0.32, transparent: true, opacity: 0.65 
                }));
                // Beyaz değer kutu
                g.add(box(0.08, 0.014, 0.014, 0xfafdff, 0.10, yy, -0.260, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.20 
                }));
            });
            // Alt onay barkodu (✓ - başarı rozeti)
            g.add(box(0.08, 0.024, 0.014, 0x4cb88a, 0, 0.840, -0.258, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.50 
            }));
            // Onay yazı çizgisi
            g.add(box(0.05, 0.005, 0.014, 0xfafdff, 0, 0.842, -0.252, { 
                emissive: 0xfafdff, emissiveIntensity: 0.40 
            }));
            
            // ==========================================================
            // SOĞUK TRANSPORT KUTUSU (sağ uç - ayrı bölme)
            // ==========================================================
            // Kutu gövdesi (mavi soğuk)
            g.add(box(0.22, 0.20, 0.22, 0xb0d0e0, 0.42, 0.800, 0.18, { 
                roughness: 0.32, transparent: true, opacity: 0.92 
            }));
            // Kapak (krom-mavi)
            g.add(box(0.23, 0.020, 0.23, 0x4a7c8a, 0.42, 0.910, 0.18, { 
                metalness: 0.30, roughness: 0.26 
            }));
            // Kapak kulpu
            g.add(box(0.10, 0.014, 0.014, 0x6f8798, 0.42, 0.928, 0.18, { 
                metalness: 0.50, roughness: 0.20 
            }));
            // Sıcaklık dijital ekranı (ön)
            g.add(box(0.060, 0.024, 0.014, 0x0e1821, 0.42, 0.860, 0.295, { 
                roughness: 0.18 
            }));
            g.add(box(0.045, 0.012, 0.014, 0x6f9fd8, 0.42, 0.860, 0.302, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.50 
            }));
            // Kar tanesi simgesi
            g.add(box(0.014, 0.018, 0.005, 0xfafdff, 0.42, 0.900, 0.295, { 
                emissive: 0xfafdff, emissiveIntensity: 0.30 
            }));
            // "COLD" etiketi
            g.add(box(0.06, 0.018, 0.014, 0xfafdff, 0.42, 0.760, 0.295, { 
                roughness: 0.30 
            }));
            g.add(box(0.04, 0.005, 0.014, 0x4a7c8a, 0.42, 0.762, 0.302, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.40 
            }));
            
            // ==========================================================
            // BIOHAZARD MİNİ KOVA (sol uç - ayrı bölme, alt kademe)
            // ==========================================================
            // Kovaki gövdesi (kırmızı-amber)
            g.add(cyl(0.080, 0.090, 0.20, 0xc89030, -0.40, 0.770, 0.18, { 
                seg: 18, roughness: 0.36 
            }));
            // Üst kapak (basmalı)
            g.add(cyl(0.092, 0.092, 0.020, 0xa07330, -0.40, 0.880, 0.18, { 
                seg: 18, metalness: 0.20, roughness: 0.40 
            }));
            // Kapak deliği (üst)
            g.add(cyl(0.040, 0.040, 0.014, 0x1a2230, -0.40, 0.892, 0.18, { 
                seg: 14, roughness: 0.40 
            }));
            // Biohazard sembolü (önyüz)
            g.add(box(0.060, 0.060, 0.012, 0xa84a52, -0.40, 0.810, 0.265, { 
                emissive: 0xa84a52, emissiveIntensity: 0.30, 
                transparent: true, opacity: 0.88 
            }));
            // Sembol içi (siyah daire göstergesi)
            g.add(cyl(0.020, 0.020, 0.010, 0x1a2230, -0.40, 0.810, 0.272, { 
                seg: 12, roughness: 0.30 
            }));
            // "BIO" etiketi
            g.add(box(0.05, 0.014, 0.014, 0xfafdff, -0.40, 0.700, 0.265, { 
                roughness: 0.30 
            }));
            
            // ==========================================================
            // ZEMİN İZOLASYON HALKASI (düşük opak amber)
            // ==========================================================
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.62, 0.008, 6, 36),
                mat(0xe0a558, { 
                    emissive: 0xe0a558, emissiveIntensity: 0.16, 
                    roughness: 0.40, transparent: true, opacity: 0.45 
                })
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.set(0, 0.010, 0);
            ring.scale.set(1.0, 1.0, 0.55);
            prepMesh(ring);
            g.add(ring);
            
            return g;
        }

        function buildWarmingPressureOverlayV151(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(box(1.18, 0.060, 0.70, 0xdad2bb, 0, 0, 0, { transparent:true, opacity:0.55, emissive:0xe0a558, emissiveIntensity:0.07, roughness:0.70 }));
            g.add(box(1.04, 0.018, 0.58, 0xf4e8c9, 0, 0.044, 0, { transparent:true, opacity:0.32, emissive:0xe0a558, emissiveIntensity:0.05 }));
            [-0.36, 0.36].forEach(xx => g.add(box(0.24,0.035,0.18,0xc7d0d8,xx,0.068,0.30,{roughness:0.62})));
            g.add(box(0.34,0.035,0.12,0xc7d0d8,-0.40,0.068,-0.30,{roughness:0.62}));
            g.add(box(0.34,0.035,0.12,0xc7d0d8,0.40,0.068,-0.30,{roughness:0.62}));
            return g;
        }

        function buildPositioningSetV151(x, y, z) {
            // PREMIUM POSITIONING & PRESSURE SUPPORT STATION v8.6
            // 4 raflı dikey hastane ekipman dolabı.
            // Modern, düzenli, eğitimsel — basınç yaralanması ve sinir basısı
            // önleme görsel olarak anlaşılır.
            const g = groupAt(x, y, z);
            const glossWhite = { metalness: 0.20, roughness: 0.22 };
            
            // ===== ALT TABAN + 4 CASTER =====
            g.add(box(0.46, 0.06, 0.34, 0x2a3540, 0, 0.030, 0, { 
                metalness: 0.25, roughness: 0.42 
            }));
            [-0.18, 0.18].forEach(xx => [-0.13, 0.13].forEach(zz => {
                const w = cyl(0.034, 0.034, 0.024, 0x1a2230, xx, 0.020, zz, { 
                    seg: 14, roughness: 0.55 
                });
                w.rotation.z = Math.PI / 2;
                g.add(w);
                const hub = cyl(0.016, 0.016, 0.028, 0xb8c4cf, xx, 0.020, zz, { 
                    seg: 12, metalness: 0.55, roughness: 0.18 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
            }));
            
            // ===== ANA DOLAP GÖVDESİ (4 raflı, dikey) =====
            // Dış çerçeve (krom kenar)
            g.add(box(0.46, 1.80, 0.36, 0xc7d0d8, 0, 0.96, 0, { ...glossWhite }));
            // Üst kapak
            g.add(box(0.48, 0.020, 0.38, 0xb8c4cf, 0, 1.870, 0, { 
                metalness: 0.40, roughness: 0.20 
            }));
            // Yan grafit aksent (sol)
            g.add(box(0.014, 1.78, 0.36, 0x2a3540, -0.224, 0.96, 0, { 
                metalness: 0.30, roughness: 0.32 
            }));
            // Düşük aksent şerit
            g.add(box(0.45, 0.006, 0.014, 0x88e0d4, 0, 1.860, 0.181, { 
                emissive: 0x88e0d4, emissiveIntensity: 0.22, transparent: true, opacity: 0.65 
            }));
            
            // ===== 4 RAF AYRIMI =====
            // Raf 1 (en üst - 1.70): Baş/oksipital jel halkalar
            // Raf 2 (1.30): Topuk koruyucular
            // Raf 3 (0.90): Kol tahtaları + dirsek/sinir koruma pedleri
            // Raf 4 (0.50): Lateral pozisyon kemerleri
            
            const shelfYs = [1.70, 1.30, 0.90, 0.50];
            shelfYs.forEach(yy => {
                // Raf zemin
                g.add(box(0.42, 0.014, 0.34, 0xeef3f7, 0, yy - 0.180, 0, { 
                    metalness: 0.25, roughness: 0.22 
                }));
                // Raf ön kenar (ince çıkıntı)
                g.add(box(0.43, 0.010, 0.014, 0x6f8798, 0, yy - 0.180, 0.171, { 
                    metalness: 0.45, roughness: 0.20 
                }));
            });
            
            // ===== RAF 1: BAŞ/OKSİPİTAL JEL HALKALAR (üst) =====
            // 2 jel halka (açık mavi-yeşil - yumuşak materyal)
            const ring1 = new THREE.Mesh(
                new THREE.TorusGeometry(0.060, 0.018, 8, 18),
                mat(0xb0d8d4, { roughness: 0.55, transparent: true, opacity: 0.85 })
            );
            ring1.rotation.x = Math.PI / 2;
            ring1.position.set(-0.10, 1.546, 0.04);
            prepMesh(ring1); g.add(ring1);
            const ring2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.060, 0.018, 8, 18),
                mat(0xa0c8d4, { roughness: 0.55, transparent: true, opacity: 0.85 })
            );
            ring2.rotation.x = Math.PI / 2;
            ring2.position.set(0.10, 1.546, 0.04);
            prepMesh(ring2); g.add(ring2);
            // Etiket "JEL HALKA"
            g.add(box(0.10, 0.014, 0.012, 0x4cb88a, 0, 1.690, 0.182, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.30, transparent: true, opacity: 0.75 
            }));
            
            // ===== RAF 2: TOPUK KORUYUCU FOAMLAR =====
            // 4 foam küp (krem renk - foam materyal)
            [-0.13, -0.04, 0.05, 0.13].forEach(dx => {
                g.add(box(0.07, 0.10, 0.12, 0xefe5d0, dx, 1.180, 0.04, { 
                    roughness: 0.78 
                }));
                // Üst yumuşak gölge
                g.add(box(0.065, 0.010, 0.115, 0xe0d4be, dx, 1.235, 0.04, { 
                    roughness: 0.82 
                }));
            });
            // Etiket "TOPUK FOAM"
            g.add(box(0.12, 0.014, 0.012, 0xefe5d0, 0, 1.290, 0.182, { 
                emissive: 0xefe5d0, emissiveIntensity: 0.20, transparent: true, opacity: 0.75 
            }));
            
            // ===== RAF 3: KOL TAHTALARI + SİNİR KORUMA PEDLERİ =====
            // Kol tahtası (uzun ince beyaz)
            g.add(box(0.36, 0.030, 0.080, 0xeef3f7, 0, 0.770, 0.04, { 
                metalness: 0.16, roughness: 0.30 
            }));
            // Üst sinir koruma pedi (jel - krem)
            g.add(box(0.32, 0.014, 0.070, 0xefe5d0, 0, 0.792, 0.04, { 
                roughness: 0.65 
            }));
            // 2 dirsek pedi (yan - jel halkalar)
            const elbow1 = cyl(0.026, 0.026, 0.030, 0xb0d8d4, -0.14, 0.770, -0.10, { 
                seg: 14, roughness: 0.55, transparent: true, opacity: 0.85 
            });
            g.add(elbow1);
            const elbow2 = cyl(0.026, 0.026, 0.030, 0xb0d8d4, 0.14, 0.770, -0.10, { 
                seg: 14, roughness: 0.55, transparent: true, opacity: 0.85 
            });
            g.add(elbow2);
            // Etiket "KOL+SİNİR"
            g.add(box(0.12, 0.014, 0.012, 0xb0d8d4, 0, 0.890, 0.182, { 
                emissive: 0xb0d8d4, emissiveIntensity: 0.20, transparent: true, opacity: 0.75 
            }));
            
            // ===== RAF 4: LATERAL POZİSYON KEMERLERİ =====
            // 3 kemer şeridi (rolled kemer - mavi/kırmızı/sarı kontrollü)
            // Mavi kemer (rolled)
            g.add(cyl(0.038, 0.038, 0.16, 0x4a7c8a, -0.10, 0.370, 0.04, { 
                seg: 16, roughness: 0.55 
            }));
            // Kırmızı kemer
            g.add(cyl(0.038, 0.038, 0.16, 0xa84a52, 0, 0.370, 0.04, { 
                seg: 16, roughness: 0.55 
            }));
            // Sarı kemer
            g.add(cyl(0.038, 0.038, 0.16, 0xc89030, 0.10, 0.370, 0.04, { 
                seg: 16, roughness: 0.55 
            }));
            // Tokalar (yan)
            [-0.10, 0, 0.10].forEach(dx => {
                g.add(box(0.014, 0.014, 0.020, 0x9ba9b5, dx, 0.370, 0.130, { 
                    metalness: 0.50, roughness: 0.22 
                }));
            });
            // Etiket "POZİSYON KEMER"
            g.add(box(0.13, 0.014, 0.012, 0xc89030, 0, 0.490, 0.182, { 
                emissive: 0xc89030, emissiveIntensity: 0.20, transparent: true, opacity: 0.70 
            }));
            
            // ===== BRADEN RİSK PANELİ (üst - profesyonel) =====
            // Pano kasası
            g.add(box(0.40, 0.16, 0.020, 0x0e1821, 0, 1.92, 0.181, { roughness: 0.20 }));
            // Aktif ekran
            g.add(box(0.36, 0.13, 0.014, 0x1a2940, 0, 1.92, 0.190, { roughness: 0.18 }));
            // Üst başlık (Braden Risk)
            g.add(box(0.30, 0.014, 0.014, 0x4a7c8a, 0, 1.965, 0.196, { 
                emissive: 0x4a7c8a, emissiveIntensity: 0.40 
            }));
            // 3 risk kartı: kırmızı/sarı/yeşil
            [-0.10, 0, 0.10].forEach((dx, i) => {
                const colors = [0x4cb88a, 0xc89030, 0xa84a52];  // yeşil/sarı/kırmızı
                // Kart kasası
                g.add(box(0.080, 0.060, 0.014, colors[i], dx, 1.910, 0.196, { 
                    emissive: colors[i], emissiveIntensity: 0.30, transparent: true, opacity: 0.78 
                }));
                // Mini değer
                g.add(box(0.040, 0.014, 0.014, 0xfafdff, dx, 1.910, 0.202, { 
                    emissive: 0xfafdff, emissiveIntensity: 0.30 
                }));
            });
            // Mini dijital ekran (alt)
            g.add(box(0.18, 0.020, 0.014, 0x0e1821, 0, 1.870, 0.196, { roughness: 0.18 }));
            g.add(box(0.16, 0.012, 0.014, 0xfafdff, 0, 1.870, 0.200, { 
                emissive: 0xfafdff, emissiveIntensity: 0.40 
            }));
            
            // ===== ALT KAPAK KAPAK / KOL =====
            g.add(box(0.040, 0.014, 0.10, 0x4a5e72, 0.20, 0.18, 0.180, { 
                metalness: 0.45, roughness: 0.22 
            }));
            
            return g;
        }

        function buildWasteStationV151(x, y, z) {
            const g = groupAt(x, y, z);
            const wasteShadeColor = (hex, delta = -35) => {
                const r = Math.max(0, Math.min(255, ((hex >> 16) & 0xff) + delta));
                const g2 = Math.max(0, Math.min(255, ((hex >> 8) & 0xff) + delta));
                const b = Math.max(0, Math.min(255, (hex & 0xff) + delta));
                return (r << 16) | (g2 << 8) | b;
            };
            // Four colour-coded OR waste bins — revised to look genuinely 3D, not flat icons.
            // The reference colour language is kept, but the bodies, lids and wheels now have stronger volume.

            g.add(box(1.46, 0.035, 0.46, 0x5f7382, 0, 0.35, 0, { roughness: 0.38, metalness: 0.10 }));
            g.add(box(1.40, 0.018, 0.38, 0xe8eef4, 0, 0.39, 0, { roughness: 0.82 }));
            g.add(box(1.32, 0.014, 0.016, 0xbfcbd4, 0, 0.42, 0.18, { roughness: 0.26, metalness: 0.20 }));

            const bins = [
                { x: -0.51, c: 0xd93a3a, lid: 0xff4a4a, label: 0xffffff, zOff: -0.005 },
                { x: -0.17, c: 0x3fbd4a, lid: 0x57d960, label: 0xffffff, zOff:  0.010 },
                { x:  0.17, c: 0xf0c53a, lid: 0xffda55, label: 0xffffff, zOff:  0.010 },
                { x:  0.51, c: 0x2879d8, lid: 0x3d95f0, label: 0xffffff, zOff: -0.005 }
            ];

            bins.forEach((b) => {
                const x0 = b.x;
                const z0 = b.zOff;
                const dark = wasteShadeColor(b.c, -35);
                const deeper = wasteShadeColor(dark, -30);

                // rear spine / body support to create depth
                g.add(box(0.20, 0.52, 0.055, dark, x0, 0.73, -0.11 + z0, { roughness: 0.40, metalness: 0.02 }));

                // tapered body built in stacked sections
                g.add(box(0.205, 0.15, 0.22, b.c, x0, 0.53, 0.00 + z0, { roughness: 0.48, metalness: 0.03 }));
                g.add(box(0.230, 0.17, 0.24, b.c, x0, 0.68, 0.00 + z0, { roughness: 0.46, metalness: 0.03 }));
                g.add(box(0.255, 0.19, 0.26, b.c, x0, 0.85, -0.002 + z0, { roughness: 0.44, metalness: 0.03 }));

                // front face pushed forward to give the bin a clear front plane
                g.add(box(0.195, 0.40, 0.022, b.c, x0, 0.71, 0.146 + z0, { roughness: 0.42, metalness: 0.02 }));

                // side ribs and base shadow band
                g.add(box(0.016, 0.43, 0.20, dark, x0 - 0.100, 0.71, 0.012 + z0, { roughness: 0.42, metalness: 0.02 }));
                g.add(box(0.016, 0.43, 0.20, dark, x0 + 0.100, 0.71, 0.012 + z0, { roughness: 0.42, metalness: 0.02 }));
                g.add(box(0.22, 0.030, 0.23, deeper, x0, 0.45, 0.00 + z0, { roughness: 0.60, metalness: 0.02, transparent: true, opacity: 0.32 }));

                // lid assembly — thicker and stepped for volume
                g.add(box(0.30, 0.045, 0.29, b.lid, x0, 0.985, 0.00 + z0, { roughness: 0.34, metalness: 0.03 }));
                g.add(box(0.315, 0.030, 0.315, b.lid, x0, 1.025, -0.004 + z0, { roughness: 0.32, metalness: 0.03 }));
                g.add(box(0.29, 0.040, 0.34, b.lid, x0, 1.07, -0.010 + z0, { roughness: 0.30, metalness: 0.03 }));
                g.add(box(0.22, 0.016, 0.18, b.lid, x0, 1.096, -0.005 + z0, { roughness: 0.24, metalness: 0.02 }));

                // rear handle assembly
                g.add(box(0.15, 0.018, 0.012, 0x2e3944, x0, 1.165, -0.14 + z0, { roughness: 0.34, metalness: 0.24 }));
                [-0.065, 0.065].forEach(dx => {
                    const h1 = cyl(0.008, 0.008, 0.08, 0x2e3944, x0 + dx, 1.135, -0.13 + z0, { seg: 8, roughness: 0.34, metalness: 0.24 });
                    h1.rotation.x = Math.PI / 2;
                    g.add(h1);
                });

                // front grooves / panel lines
                g.add(box(0.016, 0.16, 0.010, dark, x0 - 0.030, 0.82, 0.158 + z0, { roughness: 0.44, metalness: 0.02 }));
                g.add(box(0.016, 0.16, 0.010, dark, x0 + 0.030, 0.82, 0.158 + z0, { roughness: 0.44, metalness: 0.02 }));

                // quick front symbol cue
                g.add(box(0.105, 0.015, 0.010, b.label, x0, 0.62, 0.158 + z0, { roughness: 0.40 }));
                g.add(box(0.015, 0.090, 0.010, b.label, x0 - 0.045, 0.62, 0.159 + z0, { roughness: 0.40 }));
                g.add(box(0.015, 0.090, 0.010, b.label, x0 + 0.045, 0.62, 0.159 + z0, { roughness: 0.40 }));

                // axle and paired wheels
                g.add(box(0.18, 0.016, 0.016, 0x6c7883, x0, 0.29, -0.126 + z0, { roughness: 0.32, metalness: 0.20 }));
                [-0.080, 0.080].forEach(dx => {
                    const w = cyl(0.044, 0.044, 0.030, 0x20262d, x0 + dx, 0.29, -0.145 + z0, { seg: 16, roughness: 0.60, metalness: 0.04 });
                    w.rotation.z = Math.PI / 2;
                    g.add(w);
                    const hub = cyl(0.018, 0.018, 0.034, 0x9aa7b3, x0 + dx, 0.29, -0.145 + z0, { seg: 12, roughness: 0.24, metalness: 0.38 });
                    hub.rotation.z = Math.PI / 2;
                    g.add(hub);
                });
            });
            return g;
        }

        function buildMiniStand(x, y, z, accent = 0x2dd4bf, body = 0xb6bfc8) {
            // PREMIUM MINI STAND v2 — sterilizasyon tepsili sehpa
            const g = groupAt(x, y, z);
            // Anodize alt taban
            g.add(box(0.26, 0.034, 0.26, 0x222a33, 0, 0.034, 0, { metalness: 0.55, roughness: 0.32 }));
            // Brushed alu direk
            g.add(cyl(0.022, 0.022, 0.76, 0xb6bfc8, 0, 0.40, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));
            // Üst tepsi (brushed alu)
            g.add(box(0.36, 0.020, 0.28, body, 0, 0.93, 0, { metalness: 0.70, roughness: 0.22 }));
            // Tepsi alt anodize çerçeve
            g.add(box(0.38, 0.012, 0.30, 0x222a33, 0, 0.918, 0, { metalness: 0.55, roughness: 0.30 }));
            // Tepsi içi koyu fon
            g.add(box(0.32, 0.005, 0.24, 0x3a4754, 0, 0.943, 0, { metalness: 0.55, roughness: 0.32 }));
            // Üst ön LED accent (turkuaz şerit)
            g.add(box(0.30, 0.005, 0.005, accent, 0, 0.945, 0.118, { emissive: accent, emissiveIntensity: 0.85 }));
            // 2 yatay raf (anodize gri)
            g.add(box(0.24, 0.012, 0.20, 0x3a4754, 0, 0.78, 0, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.24, 0.012, 0.20, 0x3a4754, 0, 0.62, 0, { metalness: 0.55, roughness: 0.30 }));
            // Raf altı LED'ler (mini turkuaz)
            g.add(box(0.20, 0.003, 0.005, 0x2dd4bf, 0, 0.776, 0.105, { emissive: 0x2dd4bf, emissiveIntensity: 0.65 }));
            g.add(box(0.20, 0.003, 0.005, 0x2dd4bf, 0, 0.616, 0.105, { emissive: 0x2dd4bf, emissiveIntensity: 0.65 }));
            return g;
        }


        function buildModernPatientCardStand(x, y, z, accent = 0x2dd4bf, body = 0x3a4754, accent2 = 0x4cb88a) {
            // PREMIUM PATIENT CARD STAND v2 — V2 dialect
            // Cam dokunmatik tablet stilinde — modern hospital information board
            const g = groupAt(x, y, z);
            // === ALT TABAN — anodize 5-yıldız (ESU V2 stilinde, kompakt versiyon) ===
            for (let i = 0; i < 5; i++) {
                const ang = (i * Math.PI * 2) / 5;
                const ex = Math.cos(ang) * 0.18;
                const ez = Math.sin(ang) * 0.18;
                const legA = new THREE.Vector3(0, 0.030, 0);
                const legB = new THREE.Vector3(ex, 0.030, ez);
                const len = legA.distanceTo(legB);
                const leg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.014, 0.010, 0.20, 10),
                    mat(0x3a4754, { metalness: 0.55, roughness: 0.30 })
                );
                leg.position.copy(legA.clone().add(legB).multiplyScalar(0.5));
                leg.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3().subVectors(legB, legA).normalize()
                );
                leg.castShadow = true; leg.receiveShadow = true;
                g.add(leg);
                // Mini ayak ucu
                g.add(cyl(0.018, 0.018, 0.014, 0x222a33, ex, 0.012, ez, { seg: 12, metalness: 0.40, roughness: 0.50 }));
            }
            // Merkez göbek
            g.add(cyl(0.034, 0.034, 0.020, 0x222a33, 0, 0.040, 0, { seg: 18, metalness: 0.55, roughness: 0.32 }));
            // Turkuaz LED status halka (taban)
            const _baseRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.036, 0.0024, 6, 22),
                mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 0.65, transparent: true, opacity: 0.85 })
            );
            _baseRing.rotation.x = Math.PI / 2;
            _baseRing.position.set(0, 0.054, 0);
            _baseRing.castShadow = true; _baseRing.receiveShadow = true;
            g.add(_baseRing);

            // === DİREK + AYAR MAFSALI ===
            g.add(cyl(0.022, 0.022, 0.74, 0x3a4754, 0, 0.43, 0, { seg: 18, metalness: 0.55, roughness: 0.30 }));
            // Yükseklik ayar mafsalı (orta)
            g.add(cyl(0.030, 0.030, 0.018, 0x222a33, 0, 0.62, 0, { seg: 18, metalness: 0.45, roughness: 0.40 }));
            const _adjRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.032, 0.0024, 6, 20),
                mat(0xb6bfc8, { metalness: 0.62, roughness: 0.22 })
            );
            _adjRing.rotation.x = Math.PI / 2;
            _adjRing.position.set(0, 0.62, 0);
            g.add(_adjRing);
            // Üst ince kolon (brushed)
            g.add(cyl(0.020, 0.020, 0.06, 0xb6bfc8, 0, 0.81, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));

            // === ARKA PLAKA — anodize panel ===
            g.add(box(0.46, 0.56, 0.022, body, 0, 1.00, 0, { metalness: 0.55, roughness: 0.30 }));
            // Üst LED accent (turkuaz şerit)
            g.add(box(0.42, 0.005, 0.014, 0x2dd4bf, 0, 1.275, 0.014, { emissive: 0x2dd4bf, emissiveIntensity: 0.65, transparent: true, opacity: 0.85 }));
            // Alt LED accent
            g.add(box(0.42, 0.005, 0.014, 0x4d9ef0, 0, 0.725, 0.014, { emissive: 0x4d9ef0, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            // Yan dikey LED accent (sol/sağ)
            [-0.219, 0.219].forEach(side => {
                g.add(box(0.005, 0.50, 0.012, 0x2dd4bf, side, 1.00, 0.014, { emissive: 0x2dd4bf, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            });
            // Brushed alu çerçeve
            g.add(box(0.42, 0.50, 0.005, 0xb6bfc8, 0, 1.00, 0.020, { metalness: 0.70, roughness: 0.22 }));

            // === CAM DOKUNMATİK EKRAN — dashboard ===
            g.add(box(0.40, 0.48, 0.012, 0x0a0e14, 0, 1.00, 0.026, { metalness: 0.20, roughness: 0.10 }));
            // Aktif ekran arka plan
            g.add(box(0.38, 0.46, 0.001, 0x0d1820, 0, 1.00, 0.034, { emissive: 0x103040, emissiveIntensity: 0.50 }));

            // === EKRAN İÇERİĞİ ===
            // Üst başlık şeridi (kart accent renkte — kategori göstergesi)
            g.add(box(0.34, 0.030, 0.0015, accent, 0, 1.20, 0.036, { emissive: accent, emissiveIntensity: 0.85 }));
            // Kategori ikon LED'i (sol üst)
            g.add(cyl(0.014, 0.014, 0.004, accent2, -0.13, 1.20, 0.038, { seg: 14, emissive: accent2, emissiveIntensity: 0.95 }));
            // Sağ üst durum LED'i (yeşil aktif)
            g.add(cyl(0.010, 0.010, 0.004, 0x4cb88a, 0.13, 1.20, 0.038, { seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.95 }));
            // Hasta bilgisi 4 satır (beyaz/sarı/turuncu — bilgi seviyeleri)
            const lineColors = [0xfafdff, 0xfafdff, 0xfbbf24, 0xe04646];
            [0.10, 0.04, -0.04, -0.12].forEach((dy, i) => {
                g.add(box(0.32, 0.014, 0.0015, lineColors[i], 0, 1.00 + dy, 0.036, { emissive: lineColors[i], emissiveIntensity: 0.65 }));
                // Sol satır işareti (renk dot)
                g.add(cyl(0.005, 0.005, 0.003, lineColors[i], -0.18, 1.00 + dy, 0.038, { seg: 8, emissive: lineColors[i], emissiveIntensity: 0.95 }));
            });
            // Alt aksiyon barı (mavi LED — "TAMAMLANDI" gibi)
            g.add(box(0.30, 0.022, 0.0015, 0x4d9ef0, 0, 0.82, 0.036, { emissive: 0x4d9ef0, emissiveIntensity: 0.85 }));
            // Sol-sağ mini buton göstergeleri
            g.add(box(0.05, 0.022, 0.0015, accent, -0.12, 0.82, 0.038, { emissive: accent, emissiveIntensity: 0.85 }));
            g.add(box(0.05, 0.022, 0.0015, accent2, 0.12, 0.82, 0.038, { emissive: accent2, emissiveIntensity: 0.85 }));

            return g;
        }

        function buildNPOCardStand(x, y, z) {
            // PREMIUM NPO + LAB CARD STAND v2 — açlık + tetkik doğrulama dashboard
            // Kırmızı uyarı şeridi (NPO STATUS) + sol turkuaz + sağ yeşil onay LED'i
            const g = groupAt(x, y, z);
            // === 5-yıldız anodize taban ===
            for (let i = 0; i < 5; i++) {
                const ang = (i * Math.PI * 2) / 5;
                const ex = Math.cos(ang) * 0.18;
                const ez = Math.sin(ang) * 0.18;
                const legA = new THREE.Vector3(0, 0.030, 0);
                const legB = new THREE.Vector3(ex, 0.030, ez);
                const leg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.014, 0.010, 0.20, 10),
                    mat(0x3a4754, { metalness: 0.55, roughness: 0.30 })
                );
                leg.position.copy(legA.clone().add(legB).multiplyScalar(0.5));
                leg.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3().subVectors(legB, legA).normalize()
                );
                leg.castShadow = true; leg.receiveShadow = true;
                g.add(leg);
                g.add(cyl(0.018, 0.018, 0.014, 0x222a33, ex, 0.012, ez, { seg: 12, metalness: 0.40, roughness: 0.50 }));
            }
            g.add(cyl(0.034, 0.034, 0.020, 0x222a33, 0, 0.040, 0, { seg: 18, metalness: 0.55, roughness: 0.32 }));
            // Kırmızı LED status halka (NPO uyarı kategorisi)
            const _baseRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.036, 0.0024, 6, 22),
                mat(0xe04646, { emissive: 0xe04646, emissiveIntensity: 0.85, transparent: true, opacity: 0.85 })
            );
            _baseRing.rotation.x = Math.PI / 2;
            _baseRing.position.set(0, 0.054, 0);
            g.add(_baseRing);

            // === Direk + ayar mafsalı ===
            g.add(cyl(0.024, 0.024, 0.78, 0x3a4754, 0, 0.45, 0, { seg: 18, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.030, 0.030, 0.018, 0x222a33, 0, 0.66, 0, { seg: 18, metalness: 0.45, roughness: 0.40 }));
            const _adjRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.032, 0.0024, 6, 20),
                mat(0xb6bfc8, { metalness: 0.62, roughness: 0.22 })
            );
            _adjRing.rotation.x = Math.PI / 2;
            _adjRing.position.set(0, 0.66, 0);
            g.add(_adjRing);
            g.add(cyl(0.022, 0.022, 0.06, 0xb6bfc8, 0, 0.85, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));

            // === Arka plaka (anodize) — biraz daha geniş (NPO + lab kompakt) ===
            g.add(box(0.52, 0.62, 0.022, 0x3a4754, 0, 1.04, 0, { metalness: 0.55, roughness: 0.30 }));
            // Üst kırmızı LED accent (NPO uyarı vurgusu — diğer kartlarda turkuaz)
            g.add(box(0.48, 0.005, 0.014, 0xe04646, 0, 1.345, 0.014, { emissive: 0xe04646, emissiveIntensity: 0.85, transparent: true, opacity: 0.85 }));
            // Alt mavi LED accent
            g.add(box(0.48, 0.005, 0.014, 0x4d9ef0, 0, 0.735, 0.014, { emissive: 0x4d9ef0, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            // Yan dikey LED accent (sol/sağ — turkuaz)
            [-0.249, 0.249].forEach(side => {
                g.add(box(0.005, 0.56, 0.012, 0x2dd4bf, side, 1.04, 0.014, { emissive: 0x2dd4bf, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            });
            // Brushed alu çerçeve
            g.add(box(0.48, 0.56, 0.005, 0xb6bfc8, 0, 1.04, 0.020, { metalness: 0.70, roughness: 0.22 }));

            // === Cam ekran ===
            g.add(box(0.46, 0.54, 0.012, 0x0a0e14, 0, 1.04, 0.026, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.44, 0.52, 0.001, 0x0d1820, 0, 1.04, 0.034, { emissive: 0x103040, emissiveIntensity: 0.50 }));

            // === Üst başlık şeridi — KIRMIZI "NPO" uyarısı (büyük, alarm) ===
            g.add(box(0.40, 0.034, 0.0015, 0xe04646, 0, 1.27, 0.036, { emissive: 0xe04646, emissiveIntensity: 0.95 }));
            // Sol uyarı ikonu (üçgen sarı)
            g.add(cyl(0.014, 0.014, 0.004, 0xfbbf24, -0.16, 1.27, 0.038, { seg: 14, emissive: 0xfbbf24, emissiveIntensity: 0.95 }));
            // Sağ saat ikonu (turkuaz — açlık süresi göstergesi)
            g.add(cyl(0.014, 0.014, 0.004, 0x2dd4bf, 0.16, 1.27, 0.038, { seg: 14, emissive: 0x2dd4bf, emissiveIntensity: 0.95 }));

            // === İçerik — 5 satır lab/açlık sonucu (renk kodlu) ===
            const lineColors = [
                { c: 0xfafdff, label: 'Açlık süresi: 8 saat' },
                { c: 0x4cb88a, label: 'Hb: 13.2 g/dL ✓' },
                { c: 0x4cb88a, label: 'INR: 1.0 ✓' },
                { c: 0xfbbf24, label: 'K+: 4.6 mmol/L (sınırda)' },
                { c: 0xfafdff, label: 'EKG: NSR' }
            ];
            [0.14, 0.06, -0.02, -0.10, -0.18].forEach((dy, i) => {
                g.add(box(0.36, 0.014, 0.0015, lineColors[i].c, 0, 1.04 + dy, 0.036, { emissive: lineColors[i].c, emissiveIntensity: 0.65 }));
                g.add(cyl(0.005, 0.005, 0.003, lineColors[i].c, -0.20, 1.04 + dy, 0.038, { seg: 8, emissive: lineColors[i].c, emissiveIntensity: 0.95 }));
            });

            // === Alt durum bar — turkuaz (sol) + yeşil (sağ) onay LED'leri ===
            g.add(box(0.36, 0.022, 0.0015, 0x4d9ef0, 0, 0.84, 0.036, { emissive: 0x4d9ef0, emissiveIntensity: 0.85 }));
            g.add(box(0.06, 0.022, 0.0015, 0x2dd4bf, -0.14, 0.84, 0.038, { emissive: 0x2dd4bf, emissiveIntensity: 0.95 }));
            g.add(box(0.06, 0.022, 0.0015, 0x4cb88a, 0.14, 0.84, 0.038, { emissive: 0x4cb88a, emissiveIntensity: 0.95 }));

            return g;
        }

        function buildModernConsentPanel(x, y, z) {
            // PREMIUM CONSENT PANEL v2 — onam paneli, daha büyük dashboard
            // v9.28: Panel artık kullanıcıya doğru bakar (eski rotation.y = π kaldırıldı).
            const g = groupAt(x, y, z);
            // 5-yıldız taban
            for (let i = 0; i < 5; i++) {
                const ang = (i * Math.PI * 2) / 5;
                const ex = Math.cos(ang) * 0.20;
                const ez = Math.sin(ang) * 0.20;
                const legA = new THREE.Vector3(0, 0.030, 0);
                const legB = new THREE.Vector3(ex, 0.030, ez);
                const leg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.016, 0.012, 0.22, 10),
                    mat(0x3a4754, { metalness: 0.55, roughness: 0.30 })
                );
                leg.position.copy(legA.clone().add(legB).multiplyScalar(0.5));
                leg.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3().subVectors(legB, legA).normalize()
                );
                leg.castShadow = true; leg.receiveShadow = true;
                g.add(leg);
                g.add(cyl(0.020, 0.020, 0.014, 0x222a33, ex, 0.012, ez, { seg: 12, metalness: 0.40, roughness: 0.50 }));
            }
            g.add(cyl(0.038, 0.038, 0.020, 0x222a33, 0, 0.040, 0, { seg: 18, metalness: 0.55, roughness: 0.32 }));
            // LED status halka
            const _baseRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.040, 0.0028, 6, 22),
                mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 0.65, transparent: true, opacity: 0.85 })
            );
            _baseRing.rotation.x = Math.PI / 2;
            _baseRing.position.set(0, 0.054, 0);
            g.add(_baseRing);
            // Direk
            g.add(cyl(0.026, 0.026, 0.84, 0x3a4754, 0, 0.48, 0, { seg: 18, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.034, 0.034, 0.020, 0x222a33, 0, 0.70, 0, { seg: 18, metalness: 0.45, roughness: 0.40 }));
            g.add(cyl(0.024, 0.024, 0.06, 0xb6bfc8, 0, 0.92, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));

            // Arka plaka (consent ekranı — daha büyük)
            g.add(box(0.60, 0.72, 0.022, 0x3a4754, 0, 1.08, 0, { metalness: 0.55, roughness: 0.30 }));
            // Üst+alt+yan LED accent şeritleri
            g.add(box(0.56, 0.005, 0.014, 0x2dd4bf, 0, 1.435, 0.014, { emissive: 0x2dd4bf, emissiveIntensity: 0.65, transparent: true, opacity: 0.85 }));
            g.add(box(0.56, 0.005, 0.014, 0x4d9ef0, 0, 0.725, 0.014, { emissive: 0x4d9ef0, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            [-0.289, 0.289].forEach(side => {
                g.add(box(0.005, 0.66, 0.012, 0x2dd4bf, side, 1.08, 0.014, { emissive: 0x2dd4bf, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            });
            // Brushed alu çerçeve
            g.add(box(0.56, 0.66, 0.005, 0xb6bfc8, 0, 1.08, 0.020, { metalness: 0.70, roughness: 0.22 }));
            // Cam ekran
            g.add(box(0.54, 0.64, 0.012, 0x0a0e14, 0, 1.08, 0.026, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.52, 0.62, 0.001, 0x0d1820, 0, 1.08, 0.034, { emissive: 0x103040, emissiveIntensity: 0.50 }));
            // ÜST BAŞLIK ŞERİDİ — turkuaz "ONAM"
            g.add(box(0.46, 0.034, 0.0015, 0x2dd4bf, 0, 1.36, 0.036, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            // Sol-sağ ikonlar (sarı uyarı + yeşil onay)
            g.add(cyl(0.018, 0.018, 0.004, 0xfbbf24, -0.20, 1.36, 0.038, { seg: 16, emissive: 0xfbbf24, emissiveIntensity: 0.85 }));
            g.add(cyl(0.018, 0.018, 0.004, 0x4cb88a, 0.20, 1.36, 0.038, { seg: 16, emissive: 0x4cb88a, emissiveIntensity: 0.85 }));
            // Onam metni 5 satır (alternating beyaz/turuncu)
            const lineColors = [0xfafdff, 0xfafdff, 0xfbbf24, 0xfafdff, 0x4cb88a];
            [0.18, 0.10, 0.02, -0.06, -0.14].forEach((dy, i) => {
                g.add(box(0.42, 0.014, 0.0015, lineColors[i], 0, 1.08 + dy, 0.036, { emissive: lineColors[i], emissiveIntensity: 0.65 }));
                g.add(cyl(0.005, 0.005, 0.003, lineColors[i], -0.23, 1.08 + dy, 0.038, { seg: 8, emissive: lineColors[i], emissiveIntensity: 0.95 }));
            });
            // İmza alanı (alt — turkuaz LED kutu)
            g.add(box(0.40, 0.060, 0.0015, 0x4d9ef0, 0, 0.86, 0.036, { emissive: 0x4d9ef0, emissiveIntensity: 0.65 }));
            g.add(box(0.36, 0.040, 0.001, 0x0a0e14, 0, 0.86, 0.038, { emissive: 0x0a0e14, emissiveIntensity: 0.20 }));
            // İmza çizgisi (turkuaz)
            g.add(box(0.30, 0.004, 0.001, 0x2dd4bf, 0, 0.84, 0.040, { emissive: 0x2dd4bf, emissiveIntensity: 0.95 }));
            return g;
        }

        function buildTrayKit(x, y, z, accent = 0x2dd4bf, tray = 0xb6bfc8) {
            // PREMIUM TRAY KIT v2 — V2 dialect, anodize tepsi + brushed alu kenar
            const g = groupAt(x, y, z);
            // Ana tepsi (brushed alu — gerçek sterilizasyon tepsisi)
            g.add(box(0.44, 0.04, 0.28, tray, 0, 0.06, 0, { metalness: 0.70, roughness: 0.22 }));
            // Tepsi alt anodize çerçeve
            g.add(box(0.46, 0.012, 0.30, 0x222a33, 0, 0.038, 0, { metalness: 0.55, roughness: 0.30 }));
            // Tepsi içi (koyu fon — aletleri öne çıkar)
            g.add(box(0.40, 0.005, 0.24, 0x3a4754, 0, 0.082, 0, { metalness: 0.55, roughness: 0.32 }));
            // Renk kodlu LED kenar (sterilizasyon durumu)
            g.add(box(0.42, 0.003, 0.005, accent, 0, 0.084, 0.118, { emissive: accent, emissiveIntensity: 0.85 }));
            // Aletler — krom/anodize görsel
            // Skalpel (krom + sarı tutamak)
            g.add(box(0.14, 0.010, 0.012, 0xb6bfc8, -0.10, 0.090, 0.04, { metalness: 0.78, roughness: 0.16 }));
            g.add(box(0.05, 0.014, 0.018, 0xfbbf24, -0.14, 0.094, 0.04, { metalness: 0.30, roughness: 0.40, emissive: 0xfbbf24, emissiveIntensity: 0.20 }));
            // Forseps (gri-krom kombo)
            g.add(box(0.10, 0.012, 0.020, 0x222a33, 0.10, 0.092, -0.02, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.08, 0.005, 0.024, 0xb6bfc8, 0.10, 0.099, -0.02, { metalness: 0.78, roughness: 0.16 }));
            // Gauze paketi (steril beyaz + mavi şerit)
            g.add(box(0.08, 0.030, 0.10, 0xfafdff, 0.00, 0.092, 0.06, { metalness: 0.04, roughness: 0.55 }));
            g.add(box(0.06, 0.005, 0.06, 0x4d9ef0, 0.00, 0.110, 0.06, { emissive: 0x4d9ef0, emissiveIntensity: 0.55 }));
            return g;
        }


        function buildPrepSupplyStand(x, y, z) {
            // PREMIUM PREP SUPPLY STAND v2 — hazırlık malzemeleri sehpası
            const g = groupAt(x, y, z);
            // 5-yıldız taban (kompakt)
            for (let i = 0; i < 5; i++) {
                const ang = (i * Math.PI * 2) / 5;
                const ex = Math.cos(ang) * 0.18;
                const ez = Math.sin(ang) * 0.18;
                const legA = new THREE.Vector3(0, 0.030, 0);
                const legB = new THREE.Vector3(ex, 0.030, ez);
                const leg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.014, 0.010, 0.20, 10),
                    mat(0x3a4754, { metalness: 0.55, roughness: 0.30 })
                );
                leg.position.copy(legA.clone().add(legB).multiplyScalar(0.5));
                leg.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3().subVectors(legB, legA).normalize()
                );
                leg.castShadow = true; leg.receiveShadow = true;
                g.add(leg);
                g.add(cyl(0.018, 0.018, 0.014, 0x222a33, ex, 0.012, ez, { seg: 12, metalness: 0.40, roughness: 0.50 }));
            }
            g.add(cyl(0.034, 0.034, 0.020, 0x222a33, 0, 0.040, 0, { seg: 18, metalness: 0.55, roughness: 0.32 }));
            // Direk (anodize)
            g.add(cyl(0.022, 0.022, 0.74, 0x3a4754, 0, 0.43, 0, { seg: 18, metalness: 0.55, roughness: 0.30 }));
            g.add(cyl(0.020, 0.020, 0.06, 0xb6bfc8, 0, 0.81, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));
            // Üst tepsi (anodize gri çekirdek + brushed alu üst kapak)
            g.add(box(0.40, 0.025, 0.30, 0x222a33, 0, 0.870, 0, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.38, 0.005, 0.28, 0xb6bfc8, 0, 0.886, 0, { metalness: 0.70, roughness: 0.22 }));
            // Tepsi altı LED accent (turkuaz şerit — sterilizasyon durumu)
            g.add(box(0.36, 0.003, 0.005, 0x2dd4bf, 0, 0.857, 0.118, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            // === MALZEMELER (renk kodlu kit kutuları) ===
            // 1) Antiseptik şişe (turkuaz cap — chlorhexidine simülasyonu)
            g.add(cyl(0.034, 0.034, 0.16, 0xc7dbe6, -0.10, 0.97, 0.02, { seg: 16, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));
            // İçinde antiseptik (mor — chlorhexidine 2%)
            g.add(cyl(0.028, 0.028, 0.10, 0x9c5cd9, -0.10, 0.94, 0.02, { seg: 14, emissive: 0x9c5cd9, emissiveIntensity: 0.30, transparent: true, opacity: 0.85 }));
            // Üst kapak (turkuaz)
            g.add(cyl(0.036, 0.036, 0.014, 0x2dd4bf, -0.10, 1.054, 0.02, { seg: 14, emissive: 0x2dd4bf, emissiveIntensity: 0.55 }));
            // Etiket (mor LED)
            g.add(box(0.040, 0.012, 0.005, 0x9c5cd9, -0.10, 0.96, 0.054, { emissive: 0x9c5cd9, emissiveIntensity: 0.65 }));
            // 2) Steril gauze paketi (beyaz + mavi şerit)
            g.add(box(0.10, 0.10, 0.06, 0xfafdff, 0.10, 0.94, 0.02, { metalness: 0.04, roughness: 0.55 }));
            g.add(box(0.08, 0.005, 0.04, 0x4d9ef0, 0.10, 0.99, 0.02, { emissive: 0x4d9ef0, emissiveIntensity: 0.65 }));
            // 3) Eldiven kutusu (sarı)
            g.add(box(0.10, 0.06, 0.10, 0xfbbf24, -0.10, 0.92, -0.10, { metalness: 0.10, roughness: 0.45, emissive: 0xfbbf24, emissiveIntensity: 0.20 }));
            g.add(box(0.08, 0.005, 0.08, 0xfafdff, -0.10, 0.953, -0.10, { emissive: 0xfafdff, emissiveIntensity: 0.55 }));
            // 4) Steril drape paketi (yeşil)
            g.add(box(0.10, 0.06, 0.10, 0x4cb88a, 0.10, 0.92, -0.10, { metalness: 0.10, roughness: 0.45, emissive: 0x4cb88a, emissiveIntensity: 0.20 }));
            g.add(box(0.08, 0.005, 0.08, 0xfafdff, 0.10, 0.953, -0.10, { emissive: 0xfafdff, emissiveIntensity: 0.55 }));
            // Üst marka LED (turkuaz)
            g.add(box(0.10, 0.005, 0.005, 0x2dd4bf, 0, 1.07, 0.118, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            return g;
        }

        function buildCompressionSet(x, y, z) {
            // PREMIUM IPC COMPRESSION SET v2 — sıralı pnömatik kompresyon
            const g = groupAt(x, y, z);
            // Sol bacak kompresyon manşeti (anodize gri kaplama)
            g.add(box(0.28, 0.06, 0.18, 0x3a4754, -0.12, 0.05, 0, { metalness: 0.30, roughness: 0.45 }));
            // Brushed alu üst kapak
            g.add(box(0.26, 0.005, 0.16, 0xb6bfc8, -0.12, 0.083, 0, { metalness: 0.70, roughness: 0.22 }));
            // İç pnömatik hacim (anodize koyu)
            g.add(box(0.24, 0.04, 0.14, 0x222a33, -0.12, 0.08, 0, { metalness: 0.55, roughness: 0.30 }));
            // Üst LED accent (mavi — DVT profilaksi simülasyonu)
            g.add(box(0.20, 0.005, 0.005, 0x4d9ef0, -0.12, 0.087, 0.082, { emissive: 0x4d9ef0, emissiveIntensity: 0.85 }));
            // Velkro şerit (anodize)
            g.add(box(0.04, 0.014, 0.16, 0x222a33, -0.06, 0.07, 0, { metalness: 0.55, roughness: 0.45 }));
            // Hava giriş portu (krom)
            g.add(cyl(0.012, 0.012, 0.018, 0xb6bfc8, -0.18, 0.085, 0.04, { seg: 12, metalness: 0.78, roughness: 0.16 }));

            // Sağ bacak kompresyon manşeti (aynı yapı)
            g.add(box(0.28, 0.06, 0.18, 0x3a4754, 0.12, 0.05, 0, { metalness: 0.30, roughness: 0.45 }));
            g.add(box(0.26, 0.005, 0.16, 0xb6bfc8, 0.12, 0.083, 0, { metalness: 0.70, roughness: 0.22 }));
            g.add(box(0.24, 0.04, 0.14, 0x222a33, 0.12, 0.08, 0, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.20, 0.005, 0.005, 0x4d9ef0, 0.12, 0.087, 0.082, { emissive: 0x4d9ef0, emissiveIntensity: 0.85 }));
            g.add(box(0.04, 0.014, 0.16, 0x222a33, 0.06, 0.07, 0, { metalness: 0.55, roughness: 0.45 }));
            g.add(cyl(0.012, 0.012, 0.018, 0xb6bfc8, 0.18, 0.085, 0.04, { seg: 12, metalness: 0.78, roughness: 0.16 }));

            // Hava hortumları (saydam silikon — pompa bağlantısı, iki manşet → pompa)
            g.add(cyl(0.006, 0.006, 0.20, 0xc7dbe6, -0.18, 0.085, 0.18, { seg: 8, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));
            g.add(cyl(0.006, 0.006, 0.20, 0xc7dbe6, 0.18, 0.085, 0.18, { seg: 8, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));

            // Pompa kasası (anodize gri — iki manşet arasında)
            g.add(box(0.16, 0.10, 0.08, 0x3a4754, 0, 0.06, 0.30, { metalness: 0.55, roughness: 0.30 }));
            // Pompa cam ekranı
            g.add(box(0.14, 0.06, 0.012, 0x0a0e14, 0, 0.08, 0.342, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.10, 0.030, 0.001, 0x4d9ef0, 0, 0.08, 0.349, { emissive: 0x4d9ef0, emissiveIntensity: 0.85 }));
            // Pompa LED status (yeşil aktif)
            g.add(cyl(0.005, 0.005, 0.004, 0x4cb88a, 0.05, 0.115, 0.342, { seg: 8, emissive: 0x4cb88a, emissiveIntensity: 0.95 }));

            // Etiket plakaları altta (sol/sağ)
            g.add(box(0.040, 0.012, 0.005, 0x4d9ef0, -0.12, 0.025, 0.082, { emissive: 0x4d9ef0, emissiveIntensity: 0.65 }));
            g.add(box(0.040, 0.012, 0.005, 0x4d9ef0, 0.12, 0.025, 0.082, { emissive: 0x4d9ef0, emissiveIntensity: 0.65 }));
            return g;
        }

        function buildVTEPrepStand(x, y, z) {
            // PREMIUM VTE PROPHYLAXIS STAND v2 — antikoagülan + IPC kit
            const g = buildMiniStand(x, y, z, 0x4d9ef0, 0xb6bfc8);
            // Üst tepsi koyu fon (ek katman)
            g.add(box(0.28, 0.005, 0.20, 0x222a33, 0, 0.948, 0.02, { metalness: 0.55, roughness: 0.30 }));
            // 2 enoksaparin pre-filled syringe (mavi etiket — anodize gri kasa)
            [-0.08, 0.08].forEach(xx => {
                // Şırınga gövdesi (saydam cam silindir)
                g.add(cyl(0.014, 0.014, 0.16, 0xc7dbe6, xx, 0.97, 0.00, { seg: 12, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));
                // İçinde sıvı (mavi — antikoagülan simülasyonu)
                g.add(cyl(0.010, 0.010, 0.10, 0x4d9ef0, xx, 0.95, 0.00, { seg: 10, emissive: 0x4d9ef0, emissiveIntensity: 0.40, transparent: true, opacity: 0.85 }));
                // Üst piston (anodize gri)
                g.add(cyl(0.018, 0.018, 0.024, 0x3a4754, xx, 1.062, 0.00, { seg: 12, metalness: 0.55, roughness: 0.30 }));
                // Mini iğne (krom)
                g.add(cyl(0.003, 0.003, 0.024, 0xb6bfc8, xx, 0.882, 0.00, { seg: 6, metalness: 0.78, roughness: 0.16 }));
                // Etiket LED (mavi)
                g.add(box(0.018, 0.014, 0.005, 0x4d9ef0, xx, 0.96, 0.020, { emissive: 0x4d9ef0, emissiveIntensity: 0.85 }));
            });
            // Mini IPC kontrol modülü (anodize kasa)
            g.add(box(0.10, 0.06, 0.06, 0x3a4754, 0, 0.96, -0.04, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.08, 0.005, 0.04, 0xb6bfc8, 0, 0.993, -0.04, { metalness: 0.70, roughness: 0.22 }));
            // Cam mini ekran
            g.add(box(0.06, 0.024, 0.008, 0x0a0e14, 0, 0.978, -0.008, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.040, 0.010, 0.0015, 0x4cb88a, 0, 0.978, -0.004, { emissive: 0x4cb88a, emissiveIntensity: 0.85 }));
            // Üst marka LED (turkuaz)
            g.add(box(0.06, 0.005, 0.005, 0x2dd4bf, 0, 1.005, -0.04, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            // Yan etiket (mavi LED — VTE/DVT profilaksi)
            g.add(box(0.040, 0.012, 0.005, 0x4d9ef0, 0, 0.92, 0.118, { emissive: 0x4d9ef0, emissiveIntensity: 0.85 }));
            return g;
        }

        function buildClipperPrepStand(x, y, z) {
            // PREMIUM SURGICAL CLIPPER STAND v2 — kıl traşı seti (mor accent)
            const g = buildMiniStand(x, y, z, 0x9c5cd9, 0xb6bfc8);
            g.add(box(0.28, 0.005, 0.20, 0x222a33, 0, 0.948, 0.02, { metalness: 0.55, roughness: 0.30 }));
            // Klipper ana kasası (anodize gri ergonomik gövde)
            g.add(box(0.14, 0.040, 0.05, 0x3a4754, -0.03, 0.97, 0.01, { metalness: 0.55, roughness: 0.30 }));
            // Brushed alu üst kapak
            g.add(box(0.13, 0.005, 0.046, 0xb6bfc8, -0.03, 0.992, 0.01, { metalness: 0.70, roughness: 0.22 }));
            // Klipper başı (anodize koyu — bıçak başlığı)
            g.add(box(0.05, 0.024, 0.05, 0x222a33, 0.05, 0.978, 0.01, { metalness: 0.55, roughness: 0.30 }));
            // Bıçak yüzü (krom — paralel ince çizgiler)
            g.add(box(0.04, 0.005, 0.024, 0xb6bfc8, 0.06, 0.992, 0.01, { metalness: 0.78, roughness: 0.16 }));
            // 3 bıçak çizgisi LED (gri-koyu)
            [0.054, 0.062, 0.070].forEach(xx => {
                g.add(box(0.005, 0.001, 0.020, 0x222a33, xx, 0.995, 0.01, { metalness: 0.55, roughness: 0.30 }));
            });
            // Şarj LED (mor — power on)
            g.add(cyl(0.005, 0.005, 0.004, 0x9c5cd9, -0.06, 0.992, 0.04, { seg: 8, emissive: 0x9c5cd9, emissiveIntensity: 0.95 }));
            // Buton (mor LED — açma/kapama)
            g.add(box(0.014, 0.010, 0.014, 0x222a33, -0.03, 0.997, 0.030, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.010, 0.001, 0.010, 0x9c5cd9, -0.03, 1.003, 0.032, { emissive: 0x9c5cd9, emissiveIntensity: 0.85 }));
            // Yedek bıçak başlığı (anodize blister paket — sağ kenar)
            g.add(cyl(0.024, 0.024, 0.10, 0xc7dbe6, 0.10, 0.96, 0.02, { seg: 12, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));
            // İçinde mini bıçak (krom)
            g.add(cyl(0.014, 0.014, 0.06, 0xb6bfc8, 0.10, 0.95, 0.02, { seg: 10, metalness: 0.78, roughness: 0.16 }));
            // Etiket (mor LED)
            g.add(box(0.020, 0.010, 0.005, 0x9c5cd9, 0.10, 0.91, 0.04, { emissive: 0x9c5cd9, emissiveIntensity: 0.85 }));
            // Şarj dock (anodize — sol kenar)
            g.add(box(0.06, 0.020, 0.06, 0x222a33, -0.10, 0.962, -0.02, { metalness: 0.55, roughness: 0.30 }));
            // Dock LED (yeşil = şarj oluyor)
            g.add(cyl(0.005, 0.005, 0.004, 0x4cb88a, -0.10, 0.974, 0.005, { seg: 8, emissive: 0x4cb88a, emissiveIntensity: 0.95 }));
            // Üst marka LED (turkuaz)
            g.add(box(0.06, 0.005, 0.005, 0x2dd4bf, 0, 1.005, 0.118, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            return g;
        }

        function buildUrineBag(x, y, z) {
            // PREMIUM Bardex® I.C. tarzı urometer + drenaj torbası
            const g = groupAt(x, y, z);
            // Yatak kenarı asma kancası (krom — Bard tarzı J-kanca)
            g.add(cyl(0.012, 0.012, 0.04, 0xb6bfc8, 0, 0.92, 0, { seg: 12, metalness: 0.88, roughness: 0.12 }));
            g.add(cyl(0.018, 0.018, 0.008, 0xb6bfc8, 0, 0.95, 0, { seg: 14, metalness: 0.88, roughness: 0.12 }));
            // Urometer (saatlik ölçüm haznesi) — ÜST: küçük şeffaf silindir + sarı sıvı
            g.add(cyl(0.05, 0.05, 0.18, 0xeaf3f8, 0, 0.80, 0, { seg: 20, transparent: true, opacity: 0.32, metalness: 0.04, roughness: 0.20 }));
            g.add(cyl(0.045, 0.045, 0.10, 0xfbbf24, 0, 0.78, 0, { seg: 18, transparent: true, opacity: 0.72, emissive: 0xfbbf24, emissiveIntensity: 0.30 }));
            // Urometer üst başlığı + LED accent
            g.add(cyl(0.055, 0.055, 0.015, 0x222a33, 0, 0.90, 0, { seg: 18, metalness: 0.55, roughness: 0.28 }));
            g.add(cyl(0.045, 0.045, 0.002, 0x2dd4bf, 0, 0.908, 0, { seg: 16, emissive: 0x2dd4bf, emissiveIntensity: 0.95 }));
            // Hacim ölçek çizgileri (urometer yan yüzünde 50/100/150 ml)
            [0.75, 0.78, 0.81].forEach(yy => {
                g.add(box(0.004, 0.002, 0.005, 0x2dd4bf, 0.045, yy, 0.005, { emissive: 0x2dd4bf, emissiveIntensity: 0.90 }));
            });
            // Anti-reflux valv (urometer ↔ alt torba bağlantısı)
            g.add(cyl(0.020, 0.012, 0.04, 0x3a4754, 0, 0.69, 0, { seg: 14, metalness: 0.55, roughness: 0.28 }));
            // Ana drenaj torbası (2000ml — saydam PVC, sarı sıvı)
            g.add(box(0.26, 0.34, 0.07, 0xeaf3f8, 0, 0.50, 0, { transparent: true, opacity: 0.36, metalness: 0.04, roughness: 0.28 }));
            // İç sıvı (sarımsı idrar — yarı dolu)
            g.add(box(0.24, 0.20, 0.06, 0xfbbf24, 0, 0.46, 0, { transparent: true, opacity: 0.70, emissive: 0xfbbf24, emissiveIntensity: 0.28 }));
            // Bardex marka şeridi + LED accent
            g.add(box(0.20, 0.022, 0.005, 0x222a33, 0, 0.65, 0.038, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.16, 0.006, 0.005, 0x2dd4bf, 0, 0.66, 0.040, { emissive: 0x2dd4bf, emissiveIntensity: 0.90 }));
            // Ölçek bandı (200/500/1000/1500/2000 ml LED markları)
            [0.40, 0.46, 0.52, 0.58, 0.62].forEach(yy => {
                g.add(box(0.006, 0.003, 0.005, 0x2dd4bf, -0.12, yy, 0.038, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            });
            // Drenaj çıkış valvi (alt — krom + turkuaz LED tag)
            g.add(cyl(0.022, 0.022, 0.026, 0xb6bfc8, 0, 0.32, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));
            g.add(cyl(0.025, 0.025, 0.005, 0x2dd4bf, 0, 0.30, 0, { seg: 14, emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            return g;
        }

        function buildPCADevice(x, y, z) {
            // PREMIUM BD Alaris PCA Module / CADD-Solis VIP referansı
            const g = groupAt(x, y, z);
            // Ana kasa (anodize koyu gri — BD tarzı)
            g.add(box(0.28, 0.42, 0.18, 0x2a3340, 0, 0.32, 0, { metalness: 0.62, roughness: 0.26 }));
            // Brushed alu ön panel
            g.add(box(0.26, 0.40, 0.005, 0xb6bfc8, 0, 0.32, 0.092, { metalness: 0.74, roughness: 0.20 }));
            // Üst marka şeridi (BD turkuaz LED accent)
            g.add(box(0.22, 0.012, 0.012, 0x2dd4bf, 0, 0.515, 0.094, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            // Cam dokunmatik renkli LCD (büyük)
            g.add(box(0.22, 0.16, 0.012, 0x0a0e14, 0, 0.42, 0.100, { metalness: 0.22, roughness: 0.10 }));
            g.add(box(0.20, 0.14, 0.001, 0x1a3050, 0, 0.42, 0.107, { emissive: 0x4d9ef0, emissiveIntensity: 0.55 }));
            // LCD'de büyük doz değer şeridi
            g.add(box(0.14, 0.030, 0.0015, 0x4cb88a, 0, 0.44, 0.109, { emissive: 0x4cb88a, emissiveIntensity: 1.00 }));
            // Üst progress bar (turkuaz)
            g.add(box(0.12, 0.008, 0.0015, 0x2dd4bf, 0, 0.485, 0.109, { emissive: 0x2dd4bf, emissiveIntensity: 0.90 }));
            // Alt durum şeridi (sarı dose-due)
            g.add(box(0.10, 0.008, 0.0015, 0xfbbf24, 0, 0.385, 0.109, { emissive: 0xfbbf24, emissiveIntensity: 0.85 }));
            // 4 fizik tuş — START/STOP/BOLUS/MENU (renk kodlu)
            const btnColors = [0x4cb88a, 0xe04646, 0x4d9ef0, 0xfbbf24];
            [-0.08, -0.027, 0.027, 0.08].forEach((dx, i) => {
                g.add(cyl(0.012, 0.012, 0.014, 0x222a33, dx, 0.245, 0.092, { seg: 14, metalness: 0.55, roughness: 0.30 }));
                g.add(cyl(0.009, 0.009, 0.016, btnColors[i], dx, 0.245, 0.098, { seg: 12, emissive: btnColors[i], emissiveIntensity: 0.90 }));
            });
            // Hasta tetik butonu (kablolu, büyük yuvarlak mavi — Bolus button)
            g.add(cyl(0.038, 0.038, 0.022, 0x4d9ef0, 0.15, 0.16, 0.095, { seg: 22, emissive: 0x4d9ef0, emissiveIntensity: 0.95, metalness: 0.20, roughness: 0.30 }));
            g.add(cyl(0.044, 0.044, 0.006, 0x222a33, 0.15, 0.150, 0.092, { seg: 22, metalness: 0.55, roughness: 0.30 }));
            // Kablo (spiral siyah, gerçekçi)
            g.add(cyl(0.005, 0.005, 0.20, 0x1a2230, 0.15, 0.05, 0.06, { seg: 8, metalness: 0.30, roughness: 0.50 }));
            // Üst tutma kolu (BD Alaris karakteristik)
            g.add(box(0.20, 0.020, 0.04, 0x222a33, 0, 0.555, 0, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.20, 0.005, 0.05, 0x2dd4bf, 0, 0.557, 0.030, { emissive: 0x2dd4bf, emissiveIntensity: 0.65 }));
            // IV hat (yandan çıkan saydam silikon set)
            g.add(cyl(0.011, 0.011, 0.42, 0xc7dbe6, -0.14, 0.18, 0.00, { seg: 12, transparent: true, opacity: 0.60, emissive: 0x88c9e0, emissiveIntensity: 0.15 }));
            // İlaç şişesi (bağlı — Morfin/Fentanyl etiketi)
            g.add(cyl(0.022, 0.022, 0.10, 0xc7dbe6, 0.14, 0.50, 0, { seg: 14, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.15 }));
            g.add(box(0.030, 0.026, 0.002, 0xe04646, 0.14, 0.50, 0.022, { emissive: 0xe04646, emissiveIntensity: 0.80 }));
            return g;
        }

        function buildSpirometer(x, y, z) {
            // PREMIUM Hudson RCI Voldyne 5000 referans incentive spirometer
            const g = groupAt(x, y, z);
            // Anodize taban + brushed alu plaket
            g.add(box(0.32, 0.030, 0.16, 0x2a3340, 0, 0.015, 0, { metalness: 0.60, roughness: 0.28 }));
            g.add(box(0.30, 0.005, 0.14, 0xb6bfc8, 0, 0.033, 0, { metalness: 0.74, roughness: 0.20 }));
            // Ana hacim silindiri (büyük şeffaf — 5000ml haznesi)
            g.add(cyl(0.060, 0.060, 0.32, 0xeaf3f8, -0.04, 0.20, 0, { seg: 28, transparent: true, opacity: 0.36, metalness: 0.06, roughness: 0.18 }));
            // İç piston (akış göstergesi — yeşil LED)
            g.add(cyl(0.052, 0.052, 0.040, 0x4cb88a, -0.04, 0.18, 0, { seg: 24, emissive: 0x4cb88a, emissiveIntensity: 0.85, transparent: true, opacity: 0.85 }));
            // Hacim ölçek kademeleri (500/1500/2500/3500/4500 ml — turkuaz LED markları)
            [0.10, 0.16, 0.22, 0.28, 0.33].forEach(yy => {
                g.add(box(0.012, 0.003, 0.005, 0x2dd4bf, 0.06, yy, 0.062, { emissive: 0x2dd4bf, emissiveIntensity: 0.90 }));
            });
            // Hedef seviye indikatörü (kayar sarı LED bayrak)
            g.add(box(0.072, 0.005, 0.018, 0xfbbf24, -0.04, 0.26, 0.062, { emissive: 0xfbbf24, emissiveIntensity: 0.95 }));
            // Akış hızı göstergesi (yan silindir — küçük)
            g.add(cyl(0.022, 0.022, 0.18, 0xeaf3f8, 0.05, 0.14, 0, { seg: 18, transparent: true, opacity: 0.36, metalness: 0.06, roughness: 0.18 }));
            g.add(sphere(0.018, 0xfbbf24, 0.05, 0.16, 0, { emissive: 0xfbbf24, emissiveIntensity: 0.90 }));
            // Üfleme tüpü (saydam silikon — eğri)
            g.add(cyl(0.015, 0.015, 0.18, 0xc7dbe6, 0.12, 0.20, 0, { seg: 12, transparent: true, opacity: 0.60, emissive: 0x88c9e0, emissiveIntensity: 0.18 }));
            // Ağızlık (turkuaz silikon — Hudson tarzı)
            g.add(cyl(0.020, 0.016, 0.024, 0x2dd4bf, 0.20, 0.20, 0, { seg: 14, emissive: 0x2dd4bf, emissiveIntensity: 0.60, metalness: 0.20, roughness: 0.30 }));
            // Etiket (kırmızı RX şeridi)
            g.add(box(0.08, 0.010, 0.005, 0xe04646, -0.10, 0.37, 0, { emissive: 0xe04646, emissiveIntensity: 0.80 }));
            return g;
        }

        function buildPONVSet(x, y, z) {
            // PREMIUM Emesis bag (NormoSafe tarzı) + Antiemetik ilaç paneli
            const g = groupAt(x, y, z);
            // Emesis bag — şeffaf plastik, üst kalın bant, ölçek baskılı
            g.add(box(0.16, 0.26, 0.08, 0xeaf3f8, 0, 0.13, 0, { transparent: true, opacity: 0.42, metalness: 0.04, roughness: 0.24 }));
            // Üst sert plastik kelepçesi (yatak korkuluğuna kanca)
            g.add(box(0.18, 0.024, 0.06, 0x2a3340, 0, 0.275, 0, { metalness: 0.55, roughness: 0.28 }));
            // Kanca (krom)
            g.add(cyl(0.005, 0.005, 0.030, 0xb6bfc8, 0.085, 0.300, 0, { seg: 8, metalness: 0.88, roughness: 0.12 }));
            // İç bir miktar mide içeriği (sarı-yeşil tinted, %20)
            g.add(box(0.14, 0.06, 0.07, 0x9aaa5a, 0, 0.05, 0, { transparent: true, opacity: 0.55, emissive: 0x9aaa5a, emissiveIntensity: 0.15 }));
            // Ölçek bandı LED (50/200/500/1000 ml)
            [0.05, 0.10, 0.17, 0.22].forEach(yy => {
                g.add(box(0.005, 0.003, 0.005, 0x2dd4bf, 0.078, yy, 0.042, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            });
            // Marka şeridi (turkuaz LED accent)
            g.add(box(0.12, 0.008, 0.005, 0x2dd4bf, 0, 0.255, 0.042, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));

            // Antiemetik ilaç blister paketi (yanda) — Ondansetron 4mg
            g.add(box(0.14, 0.20, 0.026, 0x2a3340, 0.20, 0.11, 0, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.12, 0.18, 0.005, 0xb6bfc8, 0.20, 0.11, 0.016, { metalness: 0.74, roughness: 0.20 }));
            // İlaç ön etiket (kırmızı RX kategorisi)
            g.add(box(0.10, 0.045, 0.001, 0xe04646, 0.20, 0.155, 0.020, { emissive: 0xe04646, emissiveIntensity: 0.90 }));
            // Doz texti LED (yeşil 4mg)
            g.add(box(0.06, 0.012, 0.0015, 0x4cb88a, 0.20, 0.155, 0.022, { emissive: 0x4cb88a, emissiveIntensity: 0.95 }));
            // 6 mini ilaç ampul kapsülü (saydam — Ondansetron şeridi)
            for (let i = 0; i < 6; i++) {
                const dx = -0.04 + (i % 3) * 0.04;
                const dy = (i < 3 ? 0.085 : 0.045);
                g.add(cyl(0.009, 0.009, 0.022, 0xc7dbe6, 0.20 + dx, dy, 0.020, { seg: 10, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.20 }));
            }
            return g;
        }


        function buildWalkerAid(x, y, z) {
            // PREMIUM WALKER AID v2 — postop mobilizasyon walker (4 ayak + tutamak)
            const g = groupAt(x, y, z);
            // 4 ayak (brushed alu)
            [-0.14, 0.14].forEach(xx => {
                g.add(cyl(0.014, 0.014, 0.82, 0xb6bfc8, xx, 0.41, 0.12, { seg: 12, metalness: 0.78, roughness: 0.16 }));
                g.add(cyl(0.014, 0.014, 0.82, 0xb6bfc8, xx, 0.41, -0.12, { seg: 12, metalness: 0.78, roughness: 0.16 }));
                // Lastik ayak ucu (anodize koyu)
                g.add(cyl(0.020, 0.020, 0.024, 0x222a33, xx, 0.012, 0.12, { seg: 12, metalness: 0.30, roughness: 0.55 }));
                g.add(cyl(0.020, 0.020, 0.024, 0x222a33, xx, 0.012, -0.12, { seg: 12, metalness: 0.30, roughness: 0.55 }));
            });
            // Üst yatay tutamaçlar (anodize gri çekirdek + brushed alu kaplama)
            g.add(box(0.36, 0.020, 0.024, 0x3a4754, 0, 0.80, 0.12, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.36, 0.020, 0.024, 0x3a4754, 0, 0.80, -0.12, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.36, 0.005, 0.024, 0xb6bfc8, 0, 0.815, 0.12, { metalness: 0.70, roughness: 0.22 }));
            g.add(box(0.36, 0.005, 0.024, 0xb6bfc8, 0, 0.815, -0.12, { metalness: 0.70, roughness: 0.22 }));
            // Orta destek çubuğu (kavisli — anodize)
            g.add(box(0.30, 0.020, 0.24, 0x3a4754, 0, 0.58, 0, { metalness: 0.55, roughness: 0.30 }));
            // Üst LED accent (turkuaz şerit — yan görüş)
            g.add(box(0.34, 0.003, 0.005, 0x2dd4bf, 0, 0.825, 0.132, { emissive: 0x2dd4bf, emissiveIntensity: 0.65 }));
            g.add(box(0.34, 0.003, 0.005, 0x2dd4bf, 0, 0.825, -0.132, { emissive: 0x2dd4bf, emissiveIntensity: 0.65 }));
            return g;
        }

function buildPreop() {
            const idTask = taskByKeywords(['kimlik', 'onam', 'bölge', 'taraf', 'cerrahi doğrulama']);
            const allergyTask = taskByKeywords(['alerji', 'lateks', 'ilaç hassasiyeti']);
            const npoTask = taskByKeywords(['açlık', 'npo', 'laboratuvar', 'tetkik']);
            const prepTask = taskByKeywords(['hazırlık', 'protez', 'değerli', 'makyaj', 'önlük', 'takı', 'oje']);
            const bloodTask = taskByKeywords(['kan', 'crossmatch', 'kan grubu']);
            const medTask = taskByKeywords(['ilaç', 'antikoagülan', 'ilaç uzlaştırma']);
            const ivTask = taskByKeywords(['iv', 'damar yolu', 'erişim']);
            const transferTask = taskByKeywords(['transfer', 'teslim']);
            const deliriumTask = taskByKeywords(['deliryum', 'kognitif', 'oryantasyon']);
            const anxietyTask = taskByKeywords(['anksiyete', 'kaygı']);
            const vteTask = taskByKeywords(['vte', 'profilaksi', 'tromboemboli']);
            const skinTask = taskByKeywords(['cilt', 'clipper', 'tıraş', 'tiras']);
            const tempTask = taskByKeywords(['ısı', 'sıcaklık', 'aktif ısıtma']);
            const eduTask = taskByKeywords(['solunum', 'mobilizasyon', 'eğitim']);

            // Preop patient stays in bed; family zone and nursing zone are kept separate.
            // Preop hasta yatağı 270° döndürüldü — yatak başı ilk yönün tam tersinde (eski ayak yönü)
            addObj((function(){ const _bed = buildBed(2.20, 0, -2.10, 0x224461); _bed.rotation.y = -Math.PI/2; return _bed; })(), 'Hasta Yatağı', 'Preop hasta yatakta yatar pozisyondadır. Yatak baş ucu kullanıcı tercihine göre yeniden yönlendirildi; iki taraflı erişim korunmuştur.', { taskId: idTask?.id, severity: 'danger', clinicalKey: 'identity' });
            addObj(buildHeadwallUnit(2.15, 0, -4.65, 'preop'), 'Başucu Medikal Paneli', 'Başucu paneli yatağın baş ucuna hizalanmıştır; oksijen/vakum, elektrik ve monitör bağlantıları bu aks üzerindedir.', { taskId: tempTask?.id, clinicalKey: 'headwall' });
            addObj(buildMonitor(4.55, 0, -2.55, 'Preop Monitör'), 'Preop Monitör', 'Monitör baş uca yakın sağ tarafta; hemşire aynı anda hem hastayı hem ekranı izleyebilir.', { taskId: tempTask?.id, clinicalKey: 'baseline-vitals' });
            addObj(buildIV(0.15, 0, -2.15), 'IV Standı ve Damar Yolu', 'IV ekipmanı yatağın karşı tarafında, transferi engellemeyecek biçimde konumlandırılmıştır.', { taskId: ivTask?.id, clinicalKey: 'iv-access' });
            addObj(buildNurseCharacter3D(3.35, 0, -1.15), 'Preop Hemşiresi 3D', 'Preoperatif hemşire yatak yanında; kimlik doğrulama, eğitim, vital izlem ve hazırlık kontrolünü burada yürütür.', { taskId: eduTask?.id, clinicalKey: 'preop-nurse-3d' });
            addObj(buildRelativeCharacter3D(5.10, 0, 0.70), 'Hasta Yakını 3D', 'Hasta yakını bakım çekirdeğinin dışında, iletişim ve destek için kontrollü alanda bekler.', { taskId: eduTask?.id, clinicalKey: 'family-relative-3d' });

            addObj(buildHandHygieneStation(-5.70, 0, -3.85), 'El Hijyeni İstasyonu', 'Odaya girişe yakın ve hasta temasından önce görünür konumlandırılmıştır.', { taskId: prepTask?.id, clinicalKey: 'hand-hygiene' });
            addObj(buildSupplyCabinet(-5.55, 0, 1.85), 'Hazırlık / Malzeme Dolabı', 'Hazırlık malzemeleri bakım alanının dışında, lavaboya yakın fakat hasta çevresini sıkıştırmayacak kenarda tutulur.', { taskId: prepTask?.id, clinicalKey: 'prep-storage' });

            addObj(buildModernConsentPanel(5.60, 0, 3.45), 'Onam / Dosya Paneli', 'Bu panel sağ ön hatta modern bir lider kart olarak yeniden tasarlandı. Cerrahi onam ve dosya uyumunun görünür biçimde doğrulanmasını temsil eder; kimlik doğrulaması hasta ile, taraf/bölge doğrulaması ise işaretleme ile birlikte ayrıca tamamlanır.', { taskId: idTask?.id, clinicalKey: 'consent-site', severity: 'danger' });

            addObj(buildPrepSupplyStand(-5.21, 0, 2.35), 'Hasta Hazırlık Kutusu', 'Hasta hazırlık kutusu sol arka hatta cilt ve NPO arasına taşındı. Takı, protez, oje/makyaj ve kıyafet kontrolüne yönelik hazırlık malzemeleri preop hazırlık şeridi içinde diğer hazırlık öğeleriyle birlikte gruplandı.', { taskId: prepTask?.id, clinicalKey: 'prep' });
            // === ÖN HAT KARTLARI — 6 KART, SİMETRİK YERLEŞİM (x: -3.75 → +3.75, z=1.05) ===
            // Anksiyete VTE arka hattına, NPO Cilt arka hattına taşındığı için ön hat 6 karta düştü.
            addObj(buildModernPatientCardStand(-2.97, 0, 2.35, 0xd96371, 0xe8edf2, 0xe0a558), 'Kan Hazırlığı / Crossmatch Etiketi', 'Kan grubu, crossmatch ve kan hazırlığı doğrulaması daha modern bir hasta kartı standında görünür hâle getirildi.', { taskId: bloodTask?.id, clinicalKey: 'preop-crossmatch' });
            addObj(buildModernPatientCardStand(-2.23, 0, 2.35, 0xd96371, 0xe8edf2, 0x5cc4d6), 'Alerji / Risk Bilekliği', 'Alerji ve düşme riski bileklikleri daha modern ve görünür bir hasta kartı standına taşındı; öğrenci risk bilgisini daha net fark eder.', { taskId: allergyTask?.id, clinicalKey: 'preop-allergy' });
            addObj(buildModernPatientCardStand(-1.49, 0, 2.35, 0x5cc4d6, 0xe8edf2, 0x4cb88a), 'İlaç Uzlaştırma Kartı', 'Kullanılan ilaçlar, antikoagülanlar ve cerrahi sabahı alınan ilaçlar daha modern bir hasta kartı standında gösterilir.', { taskId: medTask?.id, clinicalKey: 'preop-medrec' });
            addObj(buildModernPatientCardStand(0.75, 0, 2.35, 0xe0a558, 0xe8edf2, 0x5cc4d6), 'Cerrahi Bölge İşaretleme Kalemi', 'Bu nesne taraf/bölge doğrulamasını temsil eder. Modern hasta kartı görünümünde yeniden düzenlendi; öğrenci planlanan tarafı hastaya sorar ve işaretleme, onam ve dosya ile eşleştirerek doğrular.', { taskId: idTask?.id, clinicalKey: 'preop-site-marker' });
            // Not: Eski Deliryum slotu (x=2.25) kasıtlı boş bırakıldı; deliryum/kognitif risk kartı sol arka hatta NPO yanına taşındı (klinik mantık: bilişsel hazırlık + lab/açlık birlikte).
            addObj(buildModernPatientCardStand(-0.74, 0, 2.35, 0x4cb88a, 0xe8edf2, 0x5cc4d6), 'Transfer Güvenlik Kartı', 'Transfer öncesi kimlik, dosya, damar yolu ve güvenli hasta teslimini hatırlatan son kontrol kartı modern hasta kartı görünümüne taşındı.', { taskId: transferTask?.id, clinicalKey: 'preop-transfer' });

            // === ARKA HAT KARTLARI — SAĞ (VTE + Anksiyete) ve SOL (Cilt + NPO + Deliryum) ===
            addObj(buildVTEPrepStand(-4.46, 0, 2.35), 'VTE Profilaksi Seti', 'VTE profilaksi materyali onam panelinin arka hattına taşındı. Böylece çekirdek preop kartların ön hattını bozmadan görünür ve düzenli bir ikinci hat oluşturur.', { taskId: vteTask?.id, clinicalKey: 'preop-vte' });
            addObj(buildModernPatientCardStand(4.40, 0, 2.20, 0x9b89c4, 0xe8edf2, 0x5cc4d6), 'Preop Anksiyete Kartı', 'Kaygı değerlendirmesi ve preoperatif destek soruları VTE setinin yanındaki sağ arka hatta yerleştirildi. Psikososyal hazırlık ve fiziksel hazırlık (VTE) bir arada görünür.', { taskId: anxietyTask?.id, clinicalKey: 'preop-anxiety' });
            addObj(buildClipperPrepStand(-5.95, 0, 2.35), 'Cilt Hazırlığı / Clipper Seti', 'Clipper ve cilt hazırlığı materyali GCKL panosunun arka hattına taşındı. Böylece ön güvenlik hattını kalabalıklaştırmadan görünür, düzenli ve öğretici bir konum kazanır.', { taskId: skinTask?.id, clinicalKey: 'preop-clipper' });
            addObj(buildNPOCardStand(-3.72, 0, 2.35), 'NPO ve Tetkik Formu', 'NPO ve tetkik doğrulama nesnesi sol arka hatta cilt hazırlığı setinin yanına taşındı; modern V2 dashboard olarak yeniden tasarlandı. Açlık süresi, lab sonuçları (Hb/INR/K+/EKG) ve onaylar tek panelde özetlenir.', { taskId: npoTask?.id, clinicalKey: 'npo-labs' });
            addObj(buildModernPatientCardStand(0.00, 0, 2.35, 0x9b89c4, 0xe8edf2, 0x4cb88a), 'Deliryum / Kognitif Risk Kartı', 'İleri yaş, duyusal kayıp, önceki deliryum ve bilişsel risklerin hızlı taraması NPO ve tetkik formunun yanına taşındı. Lab/açlık (fiziksel hazırlık) ve kognitif risk (mental hazırlık) bir arada doğrulanır.', { taskId: deliriumTask?.id, clinicalKey: 'preop-delirium' });

            addObj(buildChecklistBoard(-5.95, 0, 3.65), 'GCKL Panosu', 'Preop çekirdek güvenlik ilerlemesini gösterir. Pano sadece izler; görevler faz listesinden tamamlanır.', { taskId: idTask?.id, clinicalKey: 'ssc-board-preop' });

            // Kısa görünen adlar sadece kritik hasta güvenliği noktalarında tutulur.
            statusMarker(2.20, 1.28, -2.10, idTask, 'Kimlik', { role:'preop', priority:'critical', clinicalKey:'identity', shortLabel:'Kimlik' });
            statusMarker(5.60, 1.35, 3.45, idTask, 'Onam',   { role:'preop', priority:'critical', clinicalKey:'consent', shortLabel:'Onam' });
            statusMarker(-2.23, 1.20, 2.35, allergyTask, 'Alerji', { role:'preop', priority:'critical', clinicalKey:'preop-allergy', shortLabel:'Alerji' });
            statusMarker(0.75, 1.20, 2.35, idTask, 'Taraf',   { role:'preop', priority:'critical', clinicalKey:'preop-site-marker', shortLabel:'Taraf' });
            statusMarker(-1.49, 1.20, 2.35, medTask, 'İlaç', { role:'preop', priority:'critical', clinicalKey:'preop-medrec', shortLabel:'İlaç' });
            statusMarker(-2.97, 1.20, 2.35, bloodTask, 'KAN', { role:'preop', priority:'critical', clinicalKey:'preop-crossmatch', shortLabel:'KAN' });
            statusMarker(-4.46, 1.20, 2.35, vteTask, 'VTE', { role:'preop', priority:'active', clinicalKey:'preop-vte', shortLabel:'VTE', showLabel:true });
            statusMarker(-5.95, 1.20, 2.35, skinTask, 'Cilt', { role:'preop', priority:'active', clinicalKey:'preop-clipper', shortLabel:'Cilt', showLabel:true });
            statusMarker(4.40, 1.36, 2.20, anxietyTask, 'Anksiyete', { role:'preop', priority:'active', clinicalKey:'preop-anxiety', shortLabel:'Anksiyete', showLabel:true });
            statusMarker(0.00, 1.36, 2.35, deliriumTask, 'Deliryum', { role:'preop', priority:'active', clinicalKey:'preop-delirium', shortLabel:'Deliryum', showLabel:true });
            statusMarker(-0.74, 1.20, 2.35, transferTask, 'Transfer', { role:'preop', priority:'critical', clinicalKey:'preop-transfer', shortLabel:'Transfer' });
            statusMarker(0.15, 1.58, -2.15, ivTask, 'IV', { role:'preop', priority:'critical', clinicalKey:'iv-access', shortLabel:'IV' });
            statusMarker(-5.95, 1.54, 3.65, idTask, 'GCKL', { role:'preop', priority:'critical', clinicalKey:'ssc-board-preop', shortLabel:'GCKL' });
            statusMarker(-5.21, 1.28, 2.35, prepTask, 'Hazırlık', { role:'preop', priority:'active', clinicalKey:'prep', shortLabel:'Hazırlık', showLabel:true });
            statusMarker(-3.72, 1.36, 2.35, npoTask, 'NPO', { role:'preop', priority:'critical', clinicalKey:'npo-labs', shortLabel:'NPO' });
        }


        function buildIntraopZoneGuides() {
            // v9.6 RAFINE STERILE ZONE - premium klinik dil
            // Ucuz neon strip yerine düşük opaklık zone overlay + ince kontur
            const g = groupAt(0, 0.018, 0);
            const zone = (w, d, c, x, z, opacity = 0.06) => {
                // Çok daha düşük opaklık + emissive azaltıldı
                const m = box(w, 0.010, d, c, x, 0, z, { 
                    transparent: true, opacity, roughness: 0.94, 
                    emissive: c, emissiveIntensity: 0.008 
                });
                m.receiveShadow = false;
                g.add(m);
            };
            const strip = (w, d, c, x, z, opacity = 0.22) => {
                // Çok daha ince ve daha az emissive — minimalist sınır konturu
                const m = box(w, 0.012, d, c, x, 0.010, z, { 
                    transparent: true, opacity, roughness: 0.78, 
                    emissive: c, emissiveIntensity: 0.020 
                });
                m.receiveShadow = false;
                g.add(m);
            };
            // ==========================================================
            // STERIL CORE - ana cerrahi alan (en belirgin ama yumuşak)
            // ==========================================================
            zone(4.65, 3.35, 0x5cc4d6, 0.28, 0.05, 0.075);
            
            // ==========================================================
            // NON-STERILE BÖLGELER (anestezi, perfüzyon, sirkülasyon)
            // — daha yumuşak, ayrımı sezgisel ama agresif değil
            // ==========================================================
            zone(3.35, 4.25, 0x6f9fd8, -3.25, -0.20, 0.045);   // anaesthesia
            zone(3.65, 3.85, 0x9b89c4, 3.70, -0.05, 0.045);    // perfusion
            zone(13.20, 1.16, 0xe0a558, 0.00, 2.55, 0.040);    // circulating
            zone(3.00, 1.35, 0x4cb88a, 5.25, 1.72, 0.038);     // specimen
            zone(2.70, 1.35, 0xd96371, -5.95, 3.90, 0.038);    // entry traffic
            
            // ==========================================================
            // STERIL SINIR KONTURU - ince premium çizgi (kalın değil!)
            // 0.045 → 0.024 (yarıdan az) + opacity 0.42 → 0.22
            // ==========================================================
            strip(4.80, 0.024, 0x5cc4d6, 0.28, -1.66, 0.22);
            strip(4.80, 0.024, 0x5cc4d6, 0.28, 1.76, 0.22);
            strip(0.024, 3.45, 0x5cc4d6, -2.14, 0.05, 0.22);
            strip(0.024, 3.45, 0x5cc4d6, 2.70, 0.05, 0.22);
            
            // ==========================================================
            // KÖŞE ACCENT - 4 köşede ince L şekilli gösterge (premium)
            // — ucuz tam çevre çizgi yerine sadece köşelerde sezgisel ipucu
            // ==========================================================
            const cornerStripes = [
                // Sol arka köşe
                { w: 0.30, d: 0.024, x: -2.04, z: -1.66 },
                { w: 0.024, d: 0.30, x: -2.14, z: -1.56 },
                // Sağ arka köşe
                { w: 0.30, d: 0.024, x: 2.60, z: -1.66 },
                { w: 0.024, d: 0.30, x: 2.70, z: -1.56 },
                // Sol ön köşe
                { w: 0.30, d: 0.024, x: -2.04, z: 1.76 },
                { w: 0.024, d: 0.30, x: -2.14, z: 1.66 },
                // Sağ ön köşe
                { w: 0.30, d: 0.024, x: 2.60, z: 1.76 },
                { w: 0.024, d: 0.30, x: 2.70, z: 1.66 }
            ];
            cornerStripes.forEach(s => {
                const m = box(s.w, 0.014, s.d, 0x5cc4d6, s.x, 0.014, s.z, { 
                    transparent: true, opacity: 0.42, roughness: 0.70, 
                    emissive: 0x5cc4d6, emissiveIntensity: 0.045 
                });
                m.receiveShadow = false;
                g.add(m);
            });
            
            // ==========================================================
            // SİRKÜLASYON YOLU OK İŞARETLERİ - daha ince, daha az müdahaleci
            // ==========================================================
            [-2.8, -0.7, 1.4, 3.5].forEach((xx, idx) => {
                const a = box(0.50, 0.014, 0.06, 0xe0a558, xx, 0.018, 2.55 + (idx % 2) * 0.18, { 
                    transparent: true, opacity: 0.22, emissive: 0xe0a558, emissiveIntensity: 0.025 
                });
                g.add(a);
                const head = cyl(0.07, 0.07, 0.030, 0xe0a558, xx + 0.32, 0.020, 2.55 + (idx % 2) * 0.18, { 
                    seg: 3, transparent: true, opacity: 0.24, emissive: 0xe0a558, emissiveIntensity: 0.025 
                });
                head.rotation.z = Math.PI / 2;
                g.add(head);
            });
            return g;
        }

        function buildIntraopFlowBoard(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(box(0.08, 1.42, 1.86, 0x253544, 0, 0.94, 0, { roughness: 0.62, metalness: 0.08 }));
            g.add(box(0.085, 1.28, 1.70, 0x0d1b2e, 0.006, 0.96, 0, { roughness: 0.18, emissive: 0x102c3d, emissiveIntensity: 0.16 }));
            g.add(box(0.090, 0.16, 1.58, 0x5cc4d6, 0.012, 1.52, 0, { roughness: 0.22, emissive: 0x5cc4d6, emissiveIntensity: 0.22 }));
            const rows = [
                { z: -0.60, c: 0x6f9fd8 },
                { z: -0.30, c: 0xe0a558 },
                { z:  0.00, c: 0x5cc4d6 },
                { z:  0.30, c: 0xd96371 },
                { z:  0.60, c: 0x4cb88a }
            ];
            rows.forEach((r, idx) => {
                g.add(box(0.092, 0.11, 1.36, 0x203246, 0.016, 1.27 - idx * 0.18, r.z * 0.06, { roughness: 0.32 }));
                g.add(box(0.096, 0.10, 0.18, r.c, 0.020, 1.27 - idx * 0.18, -0.68, { emissive: r.c, emissiveIntensity: 0.20, roughness: 0.20 }));
                g.add(box(0.096, 0.035, 0.78, 0xdbe7ef, 0.022, 1.27 - idx * 0.18, -0.12, { roughness: 0.82 }));
                g.add(box(0.096, 0.035, 0.34, r.c, 0.023, 1.27 - idx * 0.18, 0.48, { emissive: r.c, emissiveIntensity: 0.12, roughness: 0.22 }));
            });
            g.add(cyl(0.025, 0.025, 0.76, 0x9fb0bc, 0, 0.38, -0.72, { seg: 10, roughness: 0.30, metalness: 0.18 }));
            g.add(cyl(0.025, 0.025, 0.76, 0x9fb0bc, 0, 0.38, 0.72, { seg: 10, roughness: 0.30, metalness: 0.18 }));
            g.add(box(0.54, 0.04, 1.52, 0x627280, 0, 0.04, 0, { roughness: 0.55 }));
            return g;
        }

        function buildWallIntraopFlowBoard(x, y, z) {
            const g = groupAt(x, y, z);
            // Wall-mounted flow board: no floor legs/base, mounted flush to the left wall safety zone.
            g.add(box(0.06, 1.44, 1.88, 0x253544, 0, 1.02, 0, { roughness: 0.58, metalness: 0.08 }));
            g.add(box(0.065, 1.30, 1.72, 0x0d1b2e, 0.006, 1.02, 0, { roughness: 0.18, emissive: 0x102c3d, emissiveIntensity: 0.16 }));
            g.add(box(0.070, 0.16, 1.60, 0x5cc4d6, 0.012, 1.60, 0, { roughness: 0.22, emissive: 0x5cc4d6, emissiveIntensity: 0.22 }));
            const rows = [
                { z: -0.60, c: 0x6f9fd8 },
                { z: -0.30, c: 0xe0a558 },
                { z:  0.00, c: 0x5cc4d6 },
                { z:  0.30, c: 0xd96371 },
                { z:  0.60, c: 0x4cb88a }
            ];
            rows.forEach((r, idx) => {
                const yy = 1.34 - idx * 0.18;
                g.add(box(0.074, 0.11, 1.38, 0x203246, 0.016, yy, r.z * 0.06, { roughness: 0.32 }));
                g.add(box(0.078, 0.10, 0.18, r.c, 0.020, yy, -0.68, { emissive: r.c, emissiveIntensity: 0.20, roughness: 0.20 }));
                g.add(box(0.078, 0.035, 0.78, 0xdbe7ef, 0.022, yy, -0.12, { roughness: 0.82 }));
                g.add(box(0.078, 0.035, 0.34, r.c, 0.023, yy, 0.48, { emissive: r.c, emissiveIntensity: 0.12, roughness: 0.22 }));
            });
            // wall mounts
            g.add(box(0.08, 0.18, 0.18, 0x90a3b2, -0.05, 1.52, -0.64, { roughness: 0.36, metalness: 0.18 }));
            g.add(box(0.08, 0.18, 0.18, 0x90a3b2, -0.05, 1.52, 0.64, { roughness: 0.36, metalness: 0.18 }));
            g.add(box(0.08, 0.18, 0.18, 0x90a3b2, -0.05, 0.54, -0.64, { roughness: 0.36, metalness: 0.18 }));
            g.add(box(0.08, 0.18, 0.18, 0x90a3b2, -0.05, 0.54, 0.64, { roughness: 0.36, metalness: 0.18 }));
            return g;
        }

        function buildSterileBoundaryGate(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(box(0.12, 0.92, 0.06, 0xdfe7ee, -0.48, 0.46, 0, { roughness: 0.48, metalness: 0.10 }));
            g.add(box(0.12, 0.92, 0.06, 0xdfe7ee, 0.48, 0.46, 0, { roughness: 0.48, metalness: 0.10 }));
            g.add(box(1.06, 0.10, 0.06, 0x5cc4d6, 0, 0.94, 0, { emissive: 0x5cc4d6, emissiveIntensity: 0.18, roughness: 0.28 }));
            g.add(box(0.70, 0.052, 0.05, 0xe8eef5, 0, 0.73, 0.01, { roughness: 0.82 }));
            g.add(box(0.50, 0.035, 0.05, 0xd96371, 0, 0.58, 0.012, { emissive: 0xd96371, emissiveIntensity: 0.08, roughness: 0.42 }));
            g.add(box(0.62, 0.035, 0.05, 0xe0a558, 0, 0.45, 0.012, { emissive: 0xe0a558, emissiveIntensity: 0.08, roughness: 0.42 }));
            return g;
        }


        function buildORDoorPortal(x, y, z) {
            const g = groupAt(x, y, z);
            // Sağ duvarda ameliyathane giriş kapısı — düşük profilli, sahneyi boğmaz.
            g.add(box(0.08, 2.52, 1.92, 0xcfd8df, 0, 1.26, 0, { roughness: 0.40, metalness: 0.16 }));
            g.add(box(0.10, 2.36, 0.88, 0xe6edf2, 0.012, 1.22, -0.47, { roughness: 0.72 }));
            g.add(box(0.10, 2.36, 0.88, 0xe6edf2, 0.012, 1.22,  0.47, { roughness: 0.72 }));
            // Gözlem pencereleri
            g.add(box(0.012, 0.52, 0.22, 0x182532, 0.056, 1.48, -0.47, { roughness: 0.12, emissive: 0x1d3d54, emissiveIntensity: 0.10 }));
            g.add(box(0.012, 0.52, 0.22, 0x182532, 0.056, 1.48,  0.47, { roughness: 0.12, emissive: 0x1d3d54, emissiveIntensity: 0.10 }));
            // Çarpma koruma barları
            g.add(box(0.016, 0.12, 0.52, 0x8b98a5, 0.054, 1.04, -0.47, { roughness: 0.26, metalness: 0.28 }));
            g.add(box(0.016, 0.12, 0.52, 0x8b98a5, 0.054, 1.04,  0.47, { roughness: 0.26, metalness: 0.28 }));
            // Üst erişim paneli + durum LED'i
            g.add(box(0.03, 0.20, 0.16, 0x314453, 0.06, 1.98, -0.82, { roughness: 0.34 }));
            g.add(cyl(0.016, 0.016, 0.018, 0x4cb88a, 0.062, 1.97, -0.82, { seg: 10, emissive: 0x4cb88a, emissiveIntensity: 0.75 }));
            return g;
        }

        function buildWallHygieneStation(x, y, z) {
            const g = groupAt(x, y, z);
            // Duvar hijyen noktası: el antiseptiği + eldiven kutusu
            g.add(box(0.06, 0.78, 0.44, 0xecf1f4, 0, 1.18, 0, { roughness: 0.82 }));
            g.add(box(0.08, 0.24, 0.18, 0xf8fbfd, 0.03, 1.34, -0.10, { roughness: 0.64 }));
            g.add(box(0.06, 0.12, 0.08, 0x5cc4d6, 0.046, 1.26, -0.10, { roughness: 0.24, emissive: 0x5cc4d6, emissiveIntensity: 0.16 }));
            g.add(cyl(0.008, 0.008, 0.06, 0xb8c4cf, 0.058, 1.18, -0.10, { seg: 10, roughness: 0.28, metalness: 0.20 }));
            g.add(box(0.07, 0.18, 0.22, 0xdfe7ee, 0.032, 1.58, 0.12, { roughness: 0.56 }));
            g.add(box(0.03, 0.03, 0.17, 0x9cc6e8, 0.054, 1.58, 0.12, { roughness: 0.40 }));
            return g;
        }

        function buildWallClockSimple(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(cyl(0.18, 0.18, 0.04, 0xf2f5f8, 0, 2.24, 0, { seg: 24, roughness: 0.28, metalness: 0.10 }));
            g.add(cyl(0.16, 0.16, 0.012, 0xffffff, 0.022, 2.24, 0, { seg: 24, roughness: 0.88 }));
            g.add(box(0.006, 0.10, 0.008, 0x2a3540, 0.028, 2.27, 0, { roughness: 0.30 }));
            g.add(box(0.006, 0.07, 0.008, 0x2a3540, 0.055, 2.22, 0, { roughness: 0.30 }));
            return g;
        }


        function buildForcedAirWarmer(x, y, z) {
            // GENERIC FORCED-AIR WARMING UNIT v9.46
            // CABG için alt vücut aktif ısıtma: cihaz + zemin hattı + şişkin battaniye.
            const g = groupAt(x, y, z);
            const body = 0xf2f6f8;
            const trim = 0xb8c4cf;
            const dark = 0x24313d;
            const glass = 0x9ed8ef;
            const green = 0x4cb88a;
            const amber = 0xe0a558;
            const blue = 0x8ccfe6;

            // Mobil ünite gövdesi
            g.add(box(0.42, 0.52, 0.32, body, 0, 0.31, 0, { roughness: 0.52, metalness: 0.10 }));
            g.add(box(0.44, 0.050, 0.34, 0xd8e1e8, 0, 0.58, 0, { roughness: 0.36, metalness: 0.24 }));
            g.add(box(0.38, 0.030, 0.30, 0xcbd5dd, 0, 0.075, 0, { roughness: 0.48, metalness: 0.18 }));

            // Ekran ve sıcaklık bilgisi
            g.add(box(0.25, 0.12, 0.014, dark, 0, 0.47, 0.171, { roughness: 0.22 }));
            g.add(box(0.20, 0.070, 0.008, 0x12372e, 0, 0.47, 0.180, { emissive: green, emissiveIntensity: 0.30, roughness: 0.22 }));
            g.add(box(0.090, 0.016, 0.010, green, 0.00, 0.47, 0.187, { emissive: green, emissiveIntensity: 0.35, roughness: 0.24 }));
            // 32 / 38 / 43°C mod LEDleri — orta aktif
            [-0.105, 0.0, 0.105].forEach((xx, i) => {
                const c = i === 1 ? green : (i === 0 ? 0x6f9fd8 : amber);
                g.add(cyl(0.012, 0.012, 0.008, c, xx, 0.385, 0.178, { seg: 12, emissive: c, emissiveIntensity: i === 1 ? 0.42 : 0.18, roughness: 0.30 }));
            });

            // Filtre kapağı, outlet ve küçük WARM etiketi
            g.add(box(0.020, 0.28, 0.20, 0xd6e0e6, -0.224, 0.32, 0, { roughness: 0.60 }));
            [0.22,0.28,0.34,0.40].forEach(yy => g.add(box(0.024, 0.012, 0.16, 0xaebbc5, -0.236, yy, 0, { roughness: 0.45 })));
            const outlet = cyl(0.055, 0.055, 0.065, trim, 0.225, 0.34, 0.075, { seg: 22, metalness: 0.38, roughness: 0.24 });
            outlet.rotation.z = Math.PI / 2; g.add(outlet);
            g.add(box(0.16, 0.026, 0.010, 0x5cc4d6, 0, 0.205, 0.176, { emissive: 0x5cc4d6, emissiveIntensity: 0.18, roughness: 0.34 }));

            // 4 tekerlek
            [-0.15, 0.15].forEach(xx => [-0.11, 0.11].forEach(zz => {
                const wh = cyl(0.034, 0.034, 0.028, 0x111820, xx, 0.035, zz, { seg: 14, roughness: 0.64 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                const hub = cyl(0.015, 0.015, 0.030, trim, xx, 0.035, zz, { seg: 10, roughness: 0.22, metalness: 0.45 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
            }));

            // Cihazdan masa altına ve alt vücut battaniyesine giden hortum
            const hosePts = [
                [0.23, 0.34, 0.075],
                [0.48, 0.22, -0.18],
                [0.92, 0.055, -0.62],
                [1.48, 0.040, -1.06],
                [2.12, 0.040, -1.40],
                [2.72, 0.180, -1.63],
                [3.12, 0.760, -1.76],
                [3.30, 1.135, -1.82]
            ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
            const hoseCurve = new THREE.CatmullRomCurve3(hosePts, false, 'catmullrom', 0.20);
            const hoseMat = new THREE.MeshStandardMaterial({
                color: glass, transparent: true, opacity: 0.60,
                roughness: 0.48, metalness: 0.04,
                emissive: 0x76c6df, emissiveIntensity: 0.08
            });
            const hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 90, 0.030, 14, false), hoseMat);
            hose.castShadow = true; hose.receiveShadow = true; g.add(hose);
            // Spiral halkalar — az sayıda, kablo kalabalığı yaratmadan
            [[0.92,0.055,-0.62],[1.48,0.040,-1.06],[2.12,0.040,-1.40],[2.72,0.180,-1.63],[3.12,0.760,-1.76]].forEach((p) => {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(0.033, 0.003, 6, 14), mat(0x74b8cf, { roughness: 0.40 }));
                ring.position.set(p[0], p[1], p[2]);
                ring.rotation.y = Math.PI / 2;
                ring.castShadow = true; ring.receiveShadow = true; g.add(ring);
            });

            // Alt vücut forced-air battaniyesi — sternotomi penceresinin altında, drape üzerinde.
            g.add(box(0.92, 0.035, 0.68, blue, 3.30, 1.230, -1.82, {
                transparent: true, opacity: 0.56, roughness: 0.62,
                emissive: 0x70c6e0, emissiveIntensity: 0.10
            }));
            // Şişkin hücre etkisi
            [-0.30, 0, 0.30].forEach(dx => {
                g.add(box(0.18, 0.018, 0.60, 0xb8e5f1, 3.30 + dx, 1.256, -1.82, {
                    transparent: true, opacity: 0.38, roughness: 0.66,
                    emissive: 0x8dd4e9, emissiveIntensity: 0.05
                }));
            });
            g.add(box(0.22, 0.020, 0.12, 0x5cc4d6, 2.86, 1.250, -1.82, { transparent: true, opacity: 0.44, emissive: 0x5cc4d6, emissiveIntensity: 0.12 }));
            return g;
        }

function buildIntraop() {
            const signIn = taskByKeywords(['sign-in', 'alerji', 'anestezi']);
            const timeout = taskByKeywords(['time-out', 'ekip tanıtımı', 'kimlik/işlem']);
            const sterile = taskByKeywords(['steril', 'antibiyotik']);
            const count = taskByKeywords(['sayım', 'spanç', 'iğne', 'alet']);
            const specimen = taskByKeywords(['numune', 'etiket']);
            const warming = taskByKeywords(['ısıtma', 'basınç', 'koruma']);
            const criticalAlarm = !taskDone(signIn) || !taskDone(timeout);

            addDecor(buildIntraopZoneGuides());

            // OR altyapısı — steril çekirdek girişi ve periferik atık akışı
            addDecor((function(){ const _gate = buildSterileBoundaryGate(3.90, 0, 2.05); _gate.rotation.y = -Math.PI / 3; return _gate; })());
            addObj((function(){ const _iv = buildIV(-2.25, 0, -1.05); _iv.rotation.y = Math.PI / 10; return _iv; })(), 'A2 · IV Pompa ve Sıvı Standı', 'Baş uçta anestezi alanına bağlı IV pompa ve sıvı standı; ilaç/sıvı akışı anestezi ekibi tarafından erişilebilir ama dolaşım hattını kapatmayacak periferik hatta tutulur.', { taskId: signIn?.id, clinicalKey: 'iv-pump-intraop' });
            addObj((function(){ const _ws = buildWasteStationV151(8.08, 0, 0.45); _ws.rotation.y = -Math.PI / 2; return _ws; })(), 'C4 · Atık ve Kesici-Delici İstasyonu', 'Sirküle hattında konumlanan dört renkli tekerlekli atık ayrıştırma istasyonu; kırmızı tıbbi atık, sarı kesici-delici, mavi temiz/geri dönüşüm destek akışı ve yeşil genel atık birbirinden ayrılır. Öğrenme hedefi: steril çekirdekten çıkan kirli materyal temiz alana geri dönmemeli; kesici-delici güvenliği, kontaminasyon önleme ve sayım süreci birlikte yönetilmelidir. Yanlış kutuya atım veya açık kesici-delici bırakılması yaralanma ve enfeksiyon riski olarak değerlendirilir.', { taskId: count?.id, clinicalKey: 'waste-station' });
            addDecor((function(){ const _fb = buildWallIntraopFlowBoard(-8.62, 0, 4.60); _fb.rotation.y = Math.PI / 2; return _fb; })());
            addDecor((function(){ const _door = buildORDoorPortal(8.88, 0, 3.55); _door.rotation.y = Math.PI / 2; return _door; })());
            addDecor((function(){ const _hy = buildWallHygieneStation(8.82, 0, 1.85); _hy.rotation.y = Math.PI / 2; return _hy; })());
            addDecor(buildWallClockSimple(0.15, 0, 5.38));

            // Revised cardiac / hybrid OR layout: head-end anesthesia, sterile core around the chest, perfusion on the patient's left side, and circulating flow kept outside the sterile core.
            addObj(buildHybridOpTableV151(0.10, 0, 0.00), 'H1 · Ameliyat Masası ve Hasta', 'Ameliyat masası merkezi aksa yerleştirildi. Baş uç anesteziye açık, göğüs çevresi steril çekirdek, lateral alanlar ise dolaşım ve perfüzyon için ayrıldı. Hasta üzerinde alt vücut forced-air ısıtma battaniyesi ayrı ısıtma ünitesinden beslenir; basınç yaralanması koruma pedleri (topuk, dirsek, sakrum) masaya entegre edilmiştir. Görevler: time-out, normotermi (>36°C) sürdürülmesi, basınç noktalarının her 30 dk değerlendirilmesi.', { taskId: timeout?.id, clinicalKey: 'time-out', severity: 'danger' });
            addObj(buildSurgicalLight(0.10, 0, 0.00), 'H2 · Cerrahi Lamba', 'Soğuk LED cerrahi lamba sternotomi penceresini gölgesiz aydınlatır; iki başlık time-out sonrası kesi alanına hafif içe/aşağı odaklanmış kabul edilir. Eğitim görevi: lamba yalnızca ışık kaynağı değildir; doğru hasta, doğru işlem, doğru taraf/saha ve ekip sessizleşmesi sağlanmadan cerrahi kesiye geçilmemelidir.', { taskId: timeout?.id, clinicalKey: 'light-timeout' });
            addObj(buildAnaesthesiaWorkstationV2(-3.85, 0, -0.10), 'A1 · Anestezi İstasyonu', 'Baş uçta konumlanan entegre anestezi platformu; havayolu, ventilasyon, monitörizasyon, ilaç ve gaz güvenliği aynı klinik düğümde toplanır. Sign-in sırasında alerji, aspirasyon riski, beklenen kan kaybı, zor hava yolu ekipmanı, pulse oksimetre ve anestezi güvenlik kontrolü ekipçe teyit edilmelidir. Hortum/kablo hattı cerrahi görüşü ve steril çekirdeği kapatmadan hasta başına ulaşır.', { taskId: signIn?.id, clinicalKey: 'signin', severity: 'danger' });
                        addObj(buildDoctorCharacter3D(0.34, 0, 0.82, 0x5a8f68), 'S1 · Cerrah', 'Cerrah yardımcı scrub hemşiresinin tam karşısına ilerletildi; operatif saha hizasında ve hasta merkezine yakın konumlandırıldı.', { taskId: timeout?.id, clinicalKey: 'surgeon' });
            addObj(buildNurseCharacter3D(-0.18, 0, -0.52), 'S2 · Scrub Hemşiresi', 'Premium scrub hemşiresi (cerrahi bone, maske, V-yaka scrub formu, mavi lateks eldivenler, kimlik kartı). Mayo masası hemşirenin solunda, kullanıcının ekranında sağ tarafta konumlandırıldı; steril alet akışı, sayım çift doğrulama, alet teslim/iade, steril alan koruma ve sahaya alet temini gibi tüm scrub görevlerini tek başına yürütür (yardımcı scrub kaldırıldığı için sorumluluklar bu role aktarıldı).', { taskId: count?.id, clinicalKey: 'scrub-nurse-3d' });
            addObj(buildMayoStandV151(0.42, 0, -1.02), 'S3 · Mayo Masası', 'Premium over-table Mayo stand — scrub hemşiresinin steril cerrahi sahaya yakın anlık alet erişim istasyonu. Satin paslanmaz çelik tray, offset taşıyıcı kolon, düşük profilli C-form stabil taban ve düzenli steril enstrüman yerleşimi (klempler, makas, penset, skalpel, gazlı bez) içerir. Scrub hemşiresi alet teslimi, geri alma ve steril alan bütünlüğünü bu istasyondan yönetir.', { taskId: sterile?.id, clinicalKey: 'mayo-stand', severity: 'danger' });
            addObj(buildCPBMachineV2(4.08, 0, -0.30), 'K1 · Kalp-Akciğer Platformu (KPB)', 'Modern entegre KPB platformu — pompa modülü, oksjenatör, rezervuar, ısı değiştirici ve perfüzyonist konsolu (çift ekran + operatör paneli) tek compact gövdede toplandı. Hibrit OR\'larda yer kazandırır, perfüzyonistin tüm parametrelere ve acil durma butonuna tek noktadan erişimini sağlar.', { taskId: timeout?.id, clinicalKey: 'cpb-machine' });
            addObj(buildHuman(5.20, 0, 0.55, 'perfusion', 0x6f9fd8), 'K2 · Perfüzyonist', 'Perfüzyonist KPB makinesi ve konsol hattında, cerrahi ekibe yakın ama steril çekirdeğin dışında konumlanır. Eğitim görevi: pompa akımı, ACT/heparin-protamin süreci, gaz değişimi, venöz dönüş, rezervuar seviyesi ve ısı yönetimi cerrah–anestezi–perfüzyonist arasında sürekli sözel iletişimle izlenir.', { taskId: timeout?.id, clinicalKey: 'perfusionist' });
            const cabgAuditPanel = buildCABGDeviceAuditPanelV1(-5.60, 0, 4.95);
            cabgAuditPanel.rotation.y = 0.10;
            addObj(cabgAuditPanel, 'K3 · CABG Cihaz Denetim Paneli', 'CABG cihaz denetim paneli; sign-in ve time-out sırasında anestezi, KPB/perfüzyon, ESU, duman tahliye, aspirasyon, aktif ısıtma, sayım, numune ve atık güvenliği için hızlı ekip kontrolünü temsil eder. Amaç cihaz varlığını değil, cihazın doğru görevle ve doğru rolle kullanılmasını doğrulamaktır: anestezi hava yolu/kan kaybı, perfüzyon ACT–pompa–ısı, scrub steril alet/graft, sirküle sayım–numune–atık hattını sözel olarak paylaşır.', { taskId: timeout?.id, clinicalKey: 'cabg-device-audit', severity: 'warn' });
            addObj(buildHuman(-1.72, 0, 0.82, 'anaesthesia', 0x6f9fd8), 'A5 · Anestezi Ekibi', 'Anestezi ekibi baş uçta hasta başına daha yakın konumlandırıldı; sign-in, hava yolu güvenliği, indüksiyon desteği ve sürekli izlem bu çekirdek üzerinde toplanır.', { taskId: signIn?.id, clinicalKey: 'anaesthesia-team' });
            addObj(buildHuman(7.10, 0, 1.65, 'circulating', 0x9b89c4), 'C1 · Sirküle Hemşire', 'Sirküle hemşire steril çekirdeğin dışında, sayım panosu, numune hattı ve atık akışını aynı anda görebilecek merkezi bir periferik akış noktasına alındı.', { taskId: count?.id, clinicalKey: 'circulating-nurse' });
            addObj(buildPortableCArm(-4.10, 0, -2.85), '16 · Skopi / Portable Röntgen Cihazı', 'Portable skopi (C-kol) ameliyat sahasına gerektiğinde görüntüleme desteği verecek şekilde, ancak ana dolaşım yolunu ve steril çekirdeği kapatmayacak kenar hatta park edilmiştir.', { taskId: timeout?.id, clinicalKey: 'portable-carm' });
            addObj(buildRadiationSafetySet(-4.95, 0, -2.70), '17 · Radyasyon Güvenliği Seti', 'Kurşun önlük, tiroid koruyucu ve radyasyon uyarı alanı portable skopi ile birlikte konumlandırıldı; görüntüleme sırasında personel korunmasını öğretir.', { taskId: timeout?.id, clinicalKey: 'radiation-safety' });
            addObj(buildESUCartV2(2.05, 0, 1.45), 'E1 · Elektrokoter (ESU) ve Hasta Plakası', 'Elektrokoter platformu; Cut/Coag/Bipolar modları, hasta plakası durum LED’i, aktif elektrod kalemi, pedal ve kablo hattı ile birlikte okunur. Eğitim görevi: hasta plakası uygun bölgede olmalı, metal/takı ve cilt hazırlığı kontrol edilmeli, oksijen–yanıcı antiseptik–koter yangın üçgeni time-out sırasında sözel olarak paylaşılmalıdır. Pedal ve kablolar steril alanı kesmeden, takılma riski yaratmayacak zeminden ilerler.', { taskId: timeout?.id, clinicalKey: 'esu-unit' });
            addObj(buildSuctionSmokeUnitV2(2.55, 0, -0.60), 'E2 · Aspirasyon (Kapalı Sistem)', 'Kapalı aspirasyon sistemi; kan/sıvı takibi, vakum gücü, atık haznesi ve kontaminasyon kontrolünü tek noktada toplar. CABG’de aspirasyon hattı drenaj/göğüs tüpü izlemiyle karıştırılmamalı; cerrahi sahadan gelen sıvı miktarı, kanama şüphesi ve kapalı sistem güvenliği birlikte değerlendirilmelidir. Hortum hattı steril alanı veya yürüyüş yolunu kesmemelidir.', { taskId: timeout?.id, clinicalKey: 'suction-smoke' });
            addObj(buildSmokeEvacUnit(2.55, 0, 0.85), 'E3 · Cerrahi Duman Tahliye', 'Cerrahi duman tahliye sistemi; ESU ile senkronize çalışır, ULPA filtre durumunu ve aktif çekişi görünür kılar. Eğitim görevi: koter kullanılacaksa duman tahliye hattı açık olmalı, filtre durumu kontrol edilmeli ve hortum ucu duman kaynağına yakın tutulmalıdır. Cihaz kapalıysa ekip duman maruziyeti, görüş azalması ve solunum irritasyonu riskiyle karşılaşır.', { taskId: timeout?.id, clinicalKey: 'smoke-evac' });
            addObj(buildAirwayCartV151(-5.20, 0, 1.22), 'A3 · Anestezi Airway/İlaç Modülü', 'Entegre airway ve kan/sıvı ısıtıcı platformu — sol modül: 3 katmanlı ilaç çekmeceleri (renk kodlu LED — kırmızı acil/sarı kontrol/yeşil ek), laringoskop bıçağı, endotrakeal tüpler, ambu/BVM. Sağ modül menteşe ile bağlı kan/sıvı ısıtıcı (38°C aktif gösterge, kan torbası + SF torbası, 2 IV hattı). İki ayrı etikette gösterilir; menteşe LED yeşil = aktif bağlantı.', { taskId: signIn?.id, clinicalKey: 'airway-cart' });
                        addObj((function(){ const _sp = buildSpecimenStationV151(7.90, 0, 1.65); _sp.rotation.y = -Math.PI/2; return _sp; })(), 'C3 · Numune Bölümü', 'CABG’de rutin patoloji numunesi zorunlu değildir; bu istasyon “varsa doğru numune” güvenliğini öğretir. Hasta adı/MRN, örnek türü, tarih-saat, cerrahi saha ve sirküle hemşire doğrulaması barkod/etiket üzerinde eşleşmelidir. Numune odadan çıkmadan önce cerrah–scrub–sirküle arasında sesli teyit yapılır; eksik veya yanlış etikette gönderim durdurulur.', { taskId: specimen?.id, clinicalKey: 'specimen', severity: 'danger' });
            addObj((function(){ const _ps = buildPositioningSetV151(-7.90, 0, 2.50); _ps.rotation.y = Math.PI/2; return _ps; })(), 'C5 · Pozisyonlama ve Basınç Destekleri', 'Supin CABG hastası için jel baş halkası, kol tahtası, dirsek/topuk koruyucu, sakral destek ve sinir basısı önleme pedleri tek istasyonda gösterilir. Eğitim görevi: uzun cerrahi süresi, hipotermi ve diyabet basınç yaralanması riskini artırır; pozisyonlama yalnız raf kontrolü değil, hastanın üzerinde uygulanan koruma ve 30 dakikalık yeniden değerlendirme mantığıdır.', { taskId: warming?.id, clinicalKey: 'positioning-set' });
            addObj(buildChecklistBoard(-6.90, 0, 5.05), 'R1 · GCKL Panosu', 'Güvenli Cerrahi Kontrol Listesi panosu; sol ön güvenlik lideri olarak sign-in, time-out ve sign-out adımlarını görünür kılar. Profilaksi, sayım ve numune güvenliği bu panodaki toplu GCKL görevleri içinde izlenir.', { taskId: timeout?.id, clinicalKey: 'ssc-board-intraop' });

            statusMarker(-3.00, 1.90, -0.05, signIn,  'Sign-in',     { role:'anaesthesia', priority:'critical', clinicalKey:'signin', shortLabel:'Sign-in' });
            statusMarker(0.10, 1.78, 0.00,   timeout, 'Time-out',    { role:'team',        priority:'critical', clinicalKey:'time-out', shortLabel:'Time-out' });
            statusMarker(0.42, 1.42, -1.20,  sterile, 'Mayo', { role:'scrub',       priority:'critical', clinicalKey:'mayo-stand', shortLabel:'Steril Alet' });
            statusMarker(0.10, 1.30, 0.00, timeout, 'Hasta/Masa', { role:'team', priority:'critical', clinicalKey:'time-out', shortLabel:'Hasta/Masa' });
            statusMarker(0.10, 3.20, 0.00, timeout, 'Lamba', { role:'team', priority:'active', clinicalKey:'light-timeout', shortLabel:'Lamba' });
            statusMarker(-3.85, 1.68, -0.10, signIn, 'Anestezi Cihazı', { role:'anaesthesia', priority:'active', clinicalKey:'signin', shortLabel:'Anestezi' });
                        statusMarker(0.34, 1.70, 0.82, timeout, 'S1 · Cerrah', { role:'team', priority:'active', clinicalKey:'surgeon', shortLabel:'Cerrah' });
            statusMarker(-0.18, 1.70, -0.52, count, 'Scrub', { role:'scrub', priority:'active', clinicalKey:'scrub-nurse-3d', shortLabel:'Scrub' });
            statusMarker(4.08, 1.42, 0.22, timeout, 'KPB', { role:'team', priority:'active', clinicalKey:'cpb-machine', shortLabel:'KPB' });
            statusMarker(5.20, 1.58, 0.55, timeout, 'K2 · Perfüzyonist', { role:'team', priority:'active', clinicalKey:'perfusionist', shortLabel:'Perfüzyonist' });
            statusMarker(-5.60, 1.45, 4.95, timeout, 'CABG Cihaz Denetim', { role:'team', priority:'active', clinicalKey:'cabg-device-audit', shortLabel:'Cihaz' });
            statusMarker(7.10, 1.58, 1.65, count, 'Sirküle', { role:'circulating', priority:'active', clinicalKey:'circulating-nurse', shortLabel:'Sirküle' });
            statusMarker(-4.10, 1.45, -2.85, timeout, 'Skopi', { role:'team', priority:'active', clinicalKey:'portable-carm', shortLabel:'Skopi' });
            statusMarker(-4.95, 1.05, -2.70, timeout, 'Radyasyon', { role:'team', priority:'active', clinicalKey:'radiation-safety', shortLabel:'Radyasyon' });
            statusMarker(2.05, 1.30, 1.45, timeout, 'Koter (ESU)', { role:'team', priority:'active', clinicalKey:'esu-unit', shortLabel:'Koter' });
            statusMarker(2.55, 1.55, -0.60, timeout, 'Aspirasyon', { role:'team', priority:'active', clinicalKey:'suction-smoke', shortLabel:'Aspirasyon' });
            statusMarker(2.55, 1.10, 0.85, timeout, 'Duman Tahliye', { role:'team', priority:'active', clinicalKey:'smoke-evac', shortLabel:'Duman' });
            statusMarker(-5.52, 1.28, 1.22, signIn, 'Airway/İlaç', { role:'anaesthesia', priority:'active', clinicalKey:'airway-cart', shortLabel:'Airway' });
            statusMarker(-4.88, 1.28, 1.22, signIn, 'Kan/Sıvı Isıtıcı', { role:'anaesthesia', priority:'active', clinicalKey:'blood-warmer', shortLabel:'Kan Isıt.' });
            statusMarker(-7.90, 1.56, 2.50, warming, 'Pozisyon', { role:'team', priority:'active', clinicalKey:'positioning-set', shortLabel:'Pozisyon' });
            statusMarker(-6.90, 1.54, 5.05,  timeout, 'GCKL', { role:'team', priority:'critical', clinicalKey:'ssc-board-intraop', shortLabel:'GCKL' });
            statusMarker(7.90, 1.62, 1.65,   specimen,'Numune Bölümü',      { role:'circulating', priority:'critical',   clinicalKey:'specimen', shortLabel:'Numune' });
            statusMarker(-2.25, 1.50, -1.05, signIn, 'IV Pompa', { role:'anaesthesia', priority:'active', clinicalKey:'iv-pump-intraop', shortLabel:'IV' });
            statusMarker(8.08, 1.50, 0.45, count, 'Atık/Sharps', { role:'circulating', priority:'active', clinicalKey:'waste-station', shortLabel:'Atık' });
        }

