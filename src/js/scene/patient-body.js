/* ============================================================
   scene/patient-body.js — Hasta Gövdesi + Temel Cerrahi Ekipman
   ------------------------------------------------------------
   Bu modül 3D sahnedeki ana statik nesneleri (mesh build fn'leri) içerir:

     • Hasta gövdesi (anatomik):
         buildPatient — sırtüstü, anatomik gövde + yüz detayları + battaniye

     • Yatak / pozisyonlama / temel donanım:
         buildBed, buildOpTable, buildAnaesth, buildTrolley
         buildChair, buildIV, buildDrain

     • Görüntüleme / izlem:
         buildMonitor, buildSurgicalLight, buildSurgicalLightModernPetalV2

     • İnsan figürleri (hemşire/doktor/hasta):
         buildHuman (rol bazlı)

     • Aşama-spesifik temel objeler:
         buildCountBoard, buildSpecimenCup
         buildPortableCArm, buildESUCart, buildSuctionSmokeUnit
         buildRadiationSafetySet
         buildLaparoscopicTower, buildCO2Tank, buildSecondaryLapMonitor
         buildSurgicalMicroscope, buildCraniotomeDrill, buildNeuronavigationSystem
         buildRapidTransfuser, buildRSIMedicationTray
         buildSharpsTray, buildAirwayCart, buildBloodWarmer
         buildPositioningSet, buildFireRiskBoard, buildTrafficSign
         buildChecklistBoard

   Bağımlılıklar:
     - THREE                              (global)
     - var three, var App                 (scene/engine.js)
     - mat, box, cyl, sphere, prepMesh    (scene/engine.js — geometri helper'ları)
     - groupAt, addObj, addDecor, addAnimated (scene/engine.js)
     - statusMarker                       (scene/markers.js)

   Yükleme sırası: scene/engine.js → core/main-app.js → scene/markers.js
                   → scene/patient-body.js
   (markers.js'ten sonra, çünkü buildBed/buildOpTable vb. statusMarker çağırır)
   ============================================================ */

        function buildPatient(x, y, z, opts = {}) {
            // PREMIUM ANATOMIC SUPINE PATIENT v8.2
            // Gerçek insan anatomisi — sırtüstü yatay yatan, yüzü YUKARI bakar.
            // Tüm yüz detayları (gözler, burun, ağız) +Y yüzeyinde,
            // saç -Y'de (yastığa gömülü).
            //
            // Anatomik proporsiyonlar (gerçek insan oranları):
            //   - Toplam boy ~2.0m (X ekseninde)
            //   - Kafa: 1/8 oran (~0.25m)
            //   - Torso: 3/8 oran (~0.75m)
            //   - Bacaklar: 4/8 oran (~1.0m)
            //   - Omuz genişliği: 0.50m
            //   - Bel daralması anatomik
            const g = groupAt(x, y, z);
            const skin = opts.skin || 0xe2bc98;
            const skinShade = opts.skinShade || 0xc89a76;
            const skinHighlight = opts.skinHighlight || 0xefcfa8;
            const skinDeep = 0xa67e5e;
            const gown = opts.gown || 0x8faebe;
            const gownDeep = opts.gownDeep || 0x6f8897;
            const gownLight = 0xa8c4d4;
            const sheet = 0xeaf1f7;
            const blanket = opts.blanket || 0xc4d8e5;
            const blanketShade = 0xa8c0d0;
            const hairTone = opts.hair || 0x4a3528;
            const hairShade = 0x2e1f15;
            const lipColor = 0xc88878;
            const lipShade = 0xa66058;
            const eyebrowColor = 0x3b2820;
            const eyeColor = 0x44557a;
            
            const Y_BASE = 0.18;       // Vücut zemini (sırt yatakta)
            const Y_BODY_TOP = 0.30;   // Vücut üstü
            const Y_FACE = 0.34;       // Yüz yüzeyi (en üst nokta)
            
            // ============================================================
            // KAFA — Sırtüstü yatay, yüzü YUKARI bakıyor
            // ============================================================
            // Kafanın arka kısmı (yastığa gömülü - daha alçak)
            // Y_FACE = yüz tepesi, Y_BODY_TOP - 0.04 = ense altı
            const HEAD_X = -0.95;
            const HEAD_Y = Y_BODY_TOP;  // Kafa merkezi
            
            // Ana kafa (oval — anatomik insan kafası proporsiyonu)
            const head = sphere(0.105, skin, HEAD_X, HEAD_Y, 0, { roughness: 0.36 });
            head.scale.set(1.20, 1.10, 1.0);  // X-ekseni boyunca uzun (alın+yüz+çene)
            g.add(head);
            
            // Boyun (kafayı omuzlara bağlar)
            g.add(cyl(0.058, 0.062, 0.10, skin, -0.78, Y_BODY_TOP - 0.030, 0, { 
                seg: 18, roughness: 0.42 
            }));
            // Boyun gölgesi (alt taraf - karanlık)
            g.add(cyl(0.060, 0.060, 0.020, skinShade, -0.78, Y_BODY_TOP - 0.080, 0, { 
                seg: 18, roughness: 0.50 
            }));
            
            // SAÇ (kafanın -Y tarafı — yastığa gömülü, az görünür)
            // Saç kafanın üst-arka kısmında
            const hairBack = sphere(0.115, hairTone, HEAD_X - 0.04, HEAD_Y - 0.020, 0, { 
                roughness: 0.78 
            });
            hairBack.scale.set(1.05, 0.92, 1.05);
            g.add(hairBack);
            // Saç tepesi (üst yan — alın hizasında daha az)
            const hairTop = sphere(0.075, hairTone, HEAD_X - 0.06, HEAD_Y + 0.040, 0, { 
                roughness: 0.78 
            });
            hairTop.scale.set(0.95, 0.55, 1.10);
            g.add(hairTop);
            // Yan saç tutamları (yastığa serpilen)
            g.add(sphere(0.030, hairTone, HEAD_X - 0.02, HEAD_Y + 0.005, 0.085, { roughness: 0.78 }));
            g.add(sphere(0.030, hairTone, HEAD_X - 0.02, HEAD_Y + 0.005, -0.085, { roughness: 0.78 }));
            // Saç çıkıntıları (anatomik dağılım)
            g.add(sphere(0.020, hairShade, HEAD_X + 0.02, HEAD_Y + 0.054, 0.040, { roughness: 0.80 }));
            g.add(sphere(0.020, hairShade, HEAD_X + 0.02, HEAD_Y + 0.054, -0.040, { roughness: 0.80 }));
            
            // KULAKLAR (kafanın iki yanında)
            // Sol kulak
            g.add(sphere(0.018, skin, HEAD_X, HEAD_Y + 0.005, 0.092, { roughness: 0.42 }));
            g.add(sphere(0.010, skinShade, HEAD_X, HEAD_Y + 0.002, 0.094, { roughness: 0.50 }));
            // Sağ kulak
            g.add(sphere(0.018, skin, HEAD_X, HEAD_Y + 0.005, -0.092, { roughness: 0.42 }));
            g.add(sphere(0.010, skinShade, HEAD_X, HEAD_Y + 0.002, -0.094, { roughness: 0.50 }));
            
            // YÜZ DETAYLARI — Hepsi +Y yüzeyinde (yukarı bakar)
            // ============================================================
            // ALİN (kafanın üst kısmı - +Y)
            g.add(sphere(0.044, skinHighlight, HEAD_X - 0.040, Y_FACE - 0.005, 0, { 
                roughness: 0.36 
            }));
            
            // KAŞLAR (alın altı, yüzeyde)
            g.add(box(0.036, 0.012, 0.012, eyebrowColor, HEAD_X - 0.020, Y_FACE, 0.030, { 
                roughness: 0.56 
            }));
            g.add(box(0.036, 0.012, 0.012, eyebrowColor, HEAD_X - 0.020, Y_FACE, -0.030, { 
                roughness: 0.56 
            }));
            // Kaş iç ucu (daha koyu)
            g.add(box(0.014, 0.012, 0.012, hairShade, HEAD_X - 0.005, Y_FACE, 0.020, { 
                roughness: 0.56 
            }));
            g.add(box(0.014, 0.012, 0.012, hairShade, HEAD_X - 0.005, Y_FACE, -0.020, { 
                roughness: 0.56 
            }));
            
            // GÖZ ÇUKURLARI (kapaklar - sphere gölgesi)
            g.add(sphere(0.022, skinShade, HEAD_X - 0.005, Y_FACE - 0.015, 0.030, { 
                roughness: 0.46 
            }));
            g.add(sphere(0.022, skinShade, HEAD_X - 0.005, Y_FACE - 0.015, -0.030, { 
                roughness: 0.46 
            }));
            
            // GÖZLER KAPALI (anestezi/dinlenme — kavisli kapalı çizgi)
            // Üst göz kapağı
            g.add(box(0.026, 0.005, 0.008, skinShade, HEAD_X - 0.002, Y_FACE - 0.003, 0.030, { 
                roughness: 0.50 
            }));
            g.add(box(0.026, 0.005, 0.008, skinShade, HEAD_X - 0.002, Y_FACE - 0.003, -0.030, { 
                roughness: 0.50 
            }));
            // Kapalı kirpik çizgisi (siyah ince çizgi)
            g.add(box(0.024, 0.003, 0.006, eyebrowColor, HEAD_X - 0.002, Y_FACE - 0.005, 0.030, { 
                roughness: 0.66 
            }));
            g.add(box(0.024, 0.003, 0.006, eyebrowColor, HEAD_X - 0.002, Y_FACE - 0.005, -0.030, { 
                roughness: 0.66 
            }));
            
            // BURUN (yüzün en yüksek noktası — +Y'de çıkıntı)
            // Burun köprüsü
            g.add(sphere(0.014, skin, HEAD_X + 0.020, Y_FACE + 0.005, 0, { roughness: 0.40 }));
            // Burun ucu (en yüksek nokta)
            g.add(sphere(0.018, skin, HEAD_X + 0.045, Y_FACE + 0.012, 0, { roughness: 0.40 }));
            // Burun ucu highlight (parlaklık)
            g.add(sphere(0.010, skinHighlight, HEAD_X + 0.050, Y_FACE + 0.018, 0, { roughness: 0.34 }));
            // Burun delikleri (alt — küçük gölge)
            g.add(sphere(0.005, skinDeep, HEAD_X + 0.058, Y_FACE - 0.005, 0.012, { roughness: 0.50 }));
            g.add(sphere(0.005, skinDeep, HEAD_X + 0.058, Y_FACE - 0.005, -0.012, { roughness: 0.50 }));
            
            // YANAKLAR (burnun yanı, dolgun)
            g.add(sphere(0.030, skinHighlight, HEAD_X + 0.020, Y_FACE - 0.020, 0.060, { 
                roughness: 0.42 
            }));
            g.add(sphere(0.030, skinHighlight, HEAD_X + 0.020, Y_FACE - 0.020, -0.060, { 
                roughness: 0.42 
            }));
            // Yanak hafif pembelik (allık — gerçekçi)
            g.add(sphere(0.018, 0xf0a89a, HEAD_X + 0.010, Y_FACE - 0.030, 0.075, { 
                roughness: 0.46, transparent: true, opacity: 0.55 
            }));
            g.add(sphere(0.018, 0xf0a89a, HEAD_X + 0.010, Y_FACE - 0.030, -0.075, { 
                roughness: 0.46, transparent: true, opacity: 0.55 
            }));
            
            // AĞIZ + DUDAKLAR (anatomik üst-alt dudak)
            // Üst dudak (M şekli için 2 tepe + ortada vadi)
            g.add(box(0.030, 0.008, 0.008, lipShade, HEAD_X + 0.078, Y_FACE - 0.038, 0, { 
                roughness: 0.40 
            }));
            // Üst dudak ucu (M şekli)
            g.add(sphere(0.005, lipColor, HEAD_X + 0.078, Y_FACE - 0.034, 0.010, { roughness: 0.36 }));
            g.add(sphere(0.005, lipColor, HEAD_X + 0.078, Y_FACE - 0.034, -0.010, { roughness: 0.36 }));
            // Alt dudak (dolgun - sphere)
            g.add(sphere(0.018, lipColor, HEAD_X + 0.082, Y_FACE - 0.050, 0, { roughness: 0.36 }));
            // Dudak highlight (parlaklık)
            g.add(box(0.014, 0.004, 0.005, 0xf2c8b5, HEAD_X + 0.082, Y_FACE - 0.046, 0, { 
                roughness: 0.30, emissive: 0xf2c8b5, emissiveIntensity: 0.10 
            }));
            
            // ÇENE (yüzün alt sınırı)
            g.add(sphere(0.024, skin, HEAD_X + 0.075, Y_FACE - 0.075, 0, { roughness: 0.42 }));
            // Çene altı gölgesi
            g.add(cyl(0.030, 0.034, 0.014, skinShade, HEAD_X + 0.072, Y_FACE - 0.092, 0, { 
                seg: 16, roughness: 0.50 
            }));
            
            // ============================================================
            // GÖVDE — Anatomik göğüs/karın/leğen
            // ============================================================
            // Omuzlar (yumuşak yuvarlak küre)
            g.add(sphere(0.085, gownDeep, -0.68, Y_BODY_TOP - 0.060, 0.220, { roughness: 0.56 }));
            g.add(sphere(0.085, gownDeep, -0.68, Y_BODY_TOP - 0.060, -0.220, { roughness: 0.56 }));
            // Trapez kası (omuz arkası)
            g.add(box(0.18, 0.08, 0.50, gownDeep, -0.70, Y_BODY_TOP - 0.020, 0, { roughness: 0.58 }));
            
            // Göğüs (üst gövde - geniş)
            g.add(box(0.36, 0.16, 0.48, gown, -0.50, Y_BASE + 0.090, 0, { roughness: 0.56 }));
            // Göğüs üst yumuşaklığı (kıvrımlı önlük)
            g.add(box(0.32, 0.05, 0.42, gownLight, -0.50, Y_BASE + 0.180, 0, { 
                roughness: 0.56 
            }));
            
            // Nefes alan göğüs (animasyonlu)
            const breathArea = box(0.26, 0.04, 0.36, gownLight, -0.50, Y_BASE + 0.205, 0, { 
                roughness: 0.46, transparent: true, opacity: 0.95 
            });
            g.add(breathArea);
            addAnimated(breathArea, 'breath', { phase: Math.random() });
            
            // Göğüs kemiği vurgu (sternum çizgisi)
            g.add(box(0.30, 0.018, 0.014, gownDeep, -0.50, Y_BASE + 0.222, 0, { 
                roughness: 0.62 
            }));
            
            // BEL DARALMASI (anatomik insan oranları)
            g.add(box(0.28, 0.13, 0.40, gown, -0.20, Y_BASE + 0.080, 0, { roughness: 0.58 }));
            // Bel üst yüzeyi
            g.add(box(0.24, 0.04, 0.34, gownLight, -0.20, Y_BASE + 0.155, 0, { 
                roughness: 0.50 
            }));
            // Karın yumuşaklığı (göbek)
            g.add(sphere(0.038, gownLight, -0.10, Y_BASE + 0.180, 0, { 
                roughness: 0.50, transparent: true, opacity: 0.85 
            }));
            
            // LEĞEN / KALÇA (geniş)
            g.add(box(0.32, 0.12, 0.42, gownDeep, 0.10, Y_BASE + 0.070, 0, { roughness: 0.58 }));
            // Leğen üst (kalça çıkıntıları)
            g.add(sphere(0.040, gownDeep, 0.14, Y_BASE + 0.135, 0.180, { roughness: 0.60 }));
            g.add(sphere(0.040, gownDeep, 0.14, Y_BASE + 0.135, -0.180, { roughness: 0.60 }));
            
            // ============================================================
            // KOLLAR — Vücudun yanına paralel, anatomik mafsallı
            // ============================================================
            // SOL KOL (z = +0.28) — DELTOID + BICEPS
            // Deltoid (omuz başı)
            g.add(sphere(0.060, gown, -0.62, Y_BASE + 0.090, 0.270, { roughness: 0.56 }));
            // Üst kol (biseps - anatomik şişkin)
            g.add(box(0.26, 0.090, 0.085, gown, -0.50, Y_BASE + 0.080, 0.290, { roughness: 0.54 }));
            // Üst kol biseps tepesi
            g.add(sphere(0.052, gownLight, -0.50, Y_BASE + 0.130, 0.290, { 
                roughness: 0.50, transparent: true, opacity: 0.92 
            }));
            // Dirsek mafsalı
            g.add(sphere(0.048, skin, -0.34, Y_BASE + 0.075, 0.300, { roughness: 0.42 }));
            // Ön kol (radius+ulna)
            g.add(box(0.26, 0.080, 0.078, skin, -0.20, Y_BASE + 0.075, 0.310, { roughness: 0.42 }));
            // Ön kol kası tepesi
            g.add(sphere(0.040, skinHighlight, -0.20, Y_BASE + 0.115, 0.310, { 
                roughness: 0.40, transparent: true, opacity: 0.85 
            }));
            // Bilek
            g.add(sphere(0.040, skin, -0.06, Y_BASE + 0.075, 0.315, { roughness: 0.42 }));
            // EL — Avuç + 5 parmak (anatomik)
            // Avuç
            g.add(box(0.090, 0.060, 0.080, skin, 0.020, Y_BASE + 0.075, 0.315, { roughness: 0.40 }));
            // Avuç üst (parmak başlangıçları)
            g.add(box(0.080, 0.030, 0.080, skinHighlight, 0.020, Y_BASE + 0.110, 0.315, { 
                roughness: 0.42 
            }));
            // 4 parmak (anatomik - işaret/orta/yüzük/serçe)
            [-0.024, -0.008, 0.008, 0.024].forEach((dz, i) => {
                // Parmak boğumları (3 boğum görünüm)
                const lengths = [0.060, 0.066, 0.062, 0.054]; // her parmak farklı
                g.add(box(0.018, 0.020, 0.014, skin, 
                    0.060 + lengths[i] * 0.5, Y_BASE + 0.105, 0.315 + dz, { 
                    roughness: 0.42 
                }));
                // Parmak ucu (tırnak)
                g.add(box(0.008, 0.010, 0.012, skinHighlight, 
                    0.062 + lengths[i], Y_BASE + 0.105, 0.315 + dz, { 
                    roughness: 0.34 
                }));
            });
            // Başparmak (yandan, kısa, anatomik açıyla)
            g.add(box(0.024, 0.020, 0.014, skin, 0.060, Y_BASE + 0.075, 0.270, { 
                roughness: 0.42 
            }));
            g.add(sphere(0.012, skinHighlight, 0.078, Y_BASE + 0.075, 0.255, { roughness: 0.40 }));
            // Hastane kimlik bandı (sol bilek)
            g.add(box(0.030, 0.022, 0.090, 0xfafdff, -0.06, Y_BASE + 0.100, 0.315, { 
                roughness: 0.30 
            }));
            // Bant turkuaz şerit
            g.add(box(0.030, 0.012, 0.060, 0x4cd6c4, -0.06, 0.292, 0.315, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.40, roughness: 0.20 
            }));
            
            // SAĞ KOL (z = -0.28) — Aynı yapı simetrik
            g.add(sphere(0.060, gown, -0.62, Y_BASE + 0.090, -0.270, { roughness: 0.56 }));
            g.add(box(0.26, 0.090, 0.085, gown, -0.50, Y_BASE + 0.080, -0.290, { roughness: 0.54 }));
            g.add(sphere(0.052, gownLight, -0.50, Y_BASE + 0.130, -0.290, { 
                roughness: 0.50, transparent: true, opacity: 0.92 
            }));
            g.add(sphere(0.048, skin, -0.34, Y_BASE + 0.075, -0.300, { roughness: 0.42 }));
            g.add(box(0.26, 0.080, 0.078, skin, -0.20, Y_BASE + 0.075, -0.310, { roughness: 0.42 }));
            g.add(sphere(0.040, skinHighlight, -0.20, Y_BASE + 0.115, -0.310, { 
                roughness: 0.40, transparent: true, opacity: 0.85 
            }));
            g.add(sphere(0.040, skin, -0.06, Y_BASE + 0.075, -0.315, { roughness: 0.42 }));
            g.add(box(0.090, 0.060, 0.080, skin, 0.020, Y_BASE + 0.075, -0.315, { roughness: 0.40 }));
            g.add(box(0.080, 0.030, 0.080, skinHighlight, 0.020, Y_BASE + 0.110, -0.315, { 
                roughness: 0.42 
            }));
            [-0.024, -0.008, 0.008, 0.024].forEach((dz, i) => {
                const lengths = [0.054, 0.062, 0.066, 0.060];
                g.add(box(0.018, 0.020, 0.014, skin, 
                    0.060 + lengths[i] * 0.5, Y_BASE + 0.105, -0.315 + dz, { 
                    roughness: 0.42 
                }));
                g.add(box(0.008, 0.010, 0.012, skinHighlight, 
                    0.062 + lengths[i], Y_BASE + 0.105, -0.315 + dz, { 
                    roughness: 0.34 
                }));
            });
            g.add(box(0.024, 0.020, 0.014, skin, 0.060, Y_BASE + 0.075, -0.270, { 
                roughness: 0.42 
            }));
            g.add(sphere(0.012, skinHighlight, 0.078, Y_BASE + 0.075, -0.255, { roughness: 0.40 }));
            
            // IV setup (sağ bilek - kırmızı/mavi)
            g.add(box(0.040, 0.018, 0.040, 0xb7c6cd, -0.04, Y_BASE + 0.105, -0.315, { 
                roughness: 0.30 
            }));
            // IV iğne giriş yeri (kırmızı nokta)
            g.add(sphere(0.006, 0xd96371, -0.04, Y_BASE + 0.115, -0.315, { 
                emissive: 0xd96371, emissiveIntensity: 0.55 
            }));
            // IV tüpü (mavi - bileğe uzanır)
            g.add(box(0.30, 0.008, 0.010, 0x6f9fd8, 0.10, Y_BASE + 0.118, -0.345, { 
                roughness: 0.18, transparent: true, opacity: 0.85 
            }));
            
            // Pulse oksimetre (sol işaret parmağı - kırmızı LED)
            g.add(box(0.014, 0.024, 0.020, 0xd96371, 0.110, Y_BASE + 0.118, 0.299, { 
                emissive: 0xd96371, emissiveIntensity: 0.65 
            }));
            // Oksimetre kabel
            g.add(box(0.18, 0.005, 0.005, 0x4a5e72, 0.020, Y_BASE + 0.118, 0.270, { 
                roughness: 0.30 
            }));
            
            // ============================================================
            // BACAKLAR — Anatomik proporsiyonlar
            // ============================================================
            // SOL BACAK (z = +0.13)
            // Uyluk (vastus + quadriceps)
            g.add(box(0.36, 0.110, 0.110, gownDeep, 0.42, Y_BASE + 0.075, 0.130, { roughness: 0.58 }));
            // Uyluk üst (quadriceps tepesi)
            g.add(box(0.30, 0.060, 0.090, gownLight, 0.42, Y_BASE + 0.140, 0.130, { 
                roughness: 0.55, transparent: true, opacity: 0.85 
            }));
            // Diz mafsalı (patella)
            g.add(sphere(0.058, skin, 0.62, Y_BASE + 0.080, 0.130, { roughness: 0.44 }));
            // Diz tatlısı highlight
            g.add(sphere(0.030, skinHighlight, 0.62, Y_BASE + 0.110, 0.130, { roughness: 0.40 }));
            // Baldır (gastrocnemius - battaniye altı)
            g.add(box(0.36, 0.092, 0.094, blanket, 0.82, Y_BASE + 0.070, 0.130, { 
                roughness: 0.62, transparent: true, opacity: 0.92 
            }));
            // Baldır üstü (battaniye konturu)
            g.add(box(0.30, 0.030, 0.080, blanketShade, 0.82, Y_BASE + 0.115, 0.130, { 
                roughness: 0.66 
            }));
            // Bilek (anatomik)
            g.add(sphere(0.040, skin, 1.02, Y_BASE + 0.060, 0.130, { roughness: 0.42 }));
            // Ayak (yukarı bakar — yatay yatan için)
            g.add(box(0.090, 0.062, 0.110, skin, 1.08, Y_BASE + 0.092, 0.130, { 
                roughness: 0.40 
            }));
            // Ayak parmakları (5 küçük)
            [-0.030, -0.015, 0, 0.015, 0.030].forEach((dz, i) => {
                const sz = [0.012, 0.014, 0.014, 0.012, 0.010][i];
                g.add(box(0.022, 0.024, sz, skin, 1.135, Y_BASE + 0.108, 0.130 + dz, { 
                    roughness: 0.42 
                }));
            });
            
            // SAĞ BACAK (z = -0.13) — simetrik
            g.add(box(0.36, 0.110, 0.110, gownDeep, 0.42, Y_BASE + 0.075, -0.130, { roughness: 0.58 }));
            g.add(box(0.30, 0.060, 0.090, gownLight, 0.42, Y_BASE + 0.140, -0.130, { 
                roughness: 0.55, transparent: true, opacity: 0.85 
            }));
            g.add(sphere(0.058, skin, 0.62, Y_BASE + 0.080, -0.130, { roughness: 0.44 }));
            g.add(sphere(0.030, skinHighlight, 0.62, Y_BASE + 0.110, -0.130, { roughness: 0.40 }));
            g.add(box(0.36, 0.092, 0.094, blanket, 0.82, Y_BASE + 0.070, -0.130, { 
                roughness: 0.62, transparent: true, opacity: 0.92 
            }));
            g.add(box(0.30, 0.030, 0.080, blanketShade, 0.82, Y_BASE + 0.115, -0.130, { 
                roughness: 0.66 
            }));
            g.add(sphere(0.040, skin, 1.02, Y_BASE + 0.060, -0.130, { roughness: 0.42 }));
            g.add(box(0.090, 0.062, 0.110, skin, 1.08, Y_BASE + 0.092, -0.130, { 
                roughness: 0.40 
            }));
            [-0.030, -0.015, 0, 0.015, 0.030].forEach((dz, i) => {
                const sz = [0.012, 0.014, 0.014, 0.012, 0.010][i];
                g.add(box(0.022, 0.024, sz, skin, 1.135, Y_BASE + 0.108, -0.130 + dz, { 
                    roughness: 0.42 
                }));
            });
            
            // ============================================================
            // BATTANİYE — Karın → ayak ucuna kadar
            // ============================================================
            // Ana battaniye katmanı
            g.add(box(1.10, 0.018, 0.50, blanket, 0.42, Y_BASE + 0.165, 0, { 
                roughness: 0.62, transparent: true, opacity: 0.85 
            }));
            // Battaniye üst kıvrımı (göğüs hizasında - hastayla katlanmış)
            g.add(box(0.10, 0.025, 0.50, blanketShade, -0.08, Y_BASE + 0.180, 0, { 
                roughness: 0.66 
            }));
            // Battaniye yan kenar dikiş (turkuaz LED)
            g.add(box(1.10, 0.005, 0.012, 0x4cd6c4, 0.42, Y_BASE + 0.180, 0.250, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.18 
            }));
            g.add(box(1.10, 0.005, 0.012, 0x4cd6c4, 0.42, Y_BASE + 0.180, -0.250, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.18 
            }));
            // Battaniye desen (anatomik dalgalanma — ayak çıkıntısı)
            g.add(box(0.16, 0.020, 0.16, blanketShade, 1.06, Y_BASE + 0.175, 0.130, { 
                roughness: 0.66 
            }));
            g.add(box(0.16, 0.020, 0.16, blanketShade, 1.06, Y_BASE + 0.175, -0.130, { 
                roughness: 0.66 
            }));
            
            // ============================================================
            // KLİNİK İZLEM ELEKTROTLARI (göğüs üstünde 3 EKG ped)
            // ============================================================
            // 3 EKG elektrod (RA, LA, V — tipik 3 lead)
            g.add(cyl(0.014, 0.014, 0.005, 0xfafdff, -0.45, Y_BASE + 0.232, 0.18, { 
                seg: 12, roughness: 0.30 
            }));
            g.add(cyl(0.008, 0.008, 0.008, 0xd96371, -0.45, Y_BASE + 0.236, 0.18, { 
                seg: 10, emissive: 0xd96371, emissiveIntensity: 0.40 
            }));
            g.add(cyl(0.014, 0.014, 0.005, 0xfafdff, -0.45, Y_BASE + 0.232, -0.18, { 
                seg: 12, roughness: 0.30 
            }));
            g.add(cyl(0.008, 0.008, 0.008, 0x4cb88a, -0.45, Y_BASE + 0.236, -0.18, { 
                seg: 10, emissive: 0x4cb88a, emissiveIntensity: 0.40 
            }));
            g.add(cyl(0.014, 0.014, 0.005, 0xfafdff, -0.50, Y_BASE + 0.232, 0, { 
                seg: 12, roughness: 0.30 
            }));
            g.add(cyl(0.008, 0.008, 0.008, 0x6f9fd8, -0.50, Y_BASE + 0.236, 0, { 
                seg: 10, emissive: 0x6f9fd8, emissiveIntensity: 0.40 
            }));
            
            // ============================================================
            // MASKE (postop için — yüzde, anestezi sonrası)
            // ============================================================
            if (opts.mask) {
                const maskColor = 0x88c4d4;
                const maskShade = 0x4a7c8a;
                // Ana maske (yüze paralel, +Y'de)
                g.add(box(0.12, 0.020, 0.10, maskColor, HEAD_X + 0.040, Y_FACE + 0.005, 0, { 
                    roughness: 0.46 
                }));
                // Yan kavisleri
                g.add(sphere(0.034, maskColor, HEAD_X + 0.030, Y_FACE - 0.020, 0.060, { 
                    roughness: 0.46 
                }));
                g.add(sphere(0.034, maskColor, HEAD_X + 0.030, Y_FACE - 0.020, -0.060, { 
                    roughness: 0.46 
                }));
                // Burun teli
                g.add(box(0.040, 0.014, 0.010, 0x9ba9b5, HEAD_X + 0.020, Y_FACE + 0.020, 0, { 
                    metalness: 0.45 
                }));
                // Maske kenar konturu
                [0.030, 0, -0.030].forEach(zz => {
                    g.add(box(0.120, 0.005, 0.012, maskShade, HEAD_X + 0.040, Y_FACE + 0.005, zz, { 
                        roughness: 0.50 
                    }));
                });
                // Maske oksijen tüpü
                g.add(cyl(0.012, 0.012, 0.30, 0x9bd7dd, HEAD_X + 0.18, Y_FACE - 0.020, 0.080, { 
                    seg: 12, transparent: true, opacity: 0.62 
                }));
            }
            
            return g;
        }

        function buildBed(x, y, z, c) { 
            // PREMIUM HOSPITAL BED v7.7
            // Hill-Rom Centrella Smart+ / Stryker InTouch tarzı modern elektrikli
            // hastane yatağı. Premium detaylar:
            //   - Hidrolik motor gövdesi (alt mekanik bölüm)
            //   - Eklemli baş ve ayak kısımları (yükseltilebilir görünüm)
            //   - Dijital kontrol paneli (yan kenarda — hemşire tarafı)
            //   - Hasta için yan kontrol (ışık/çağrı/TV)
            //   - Yan korkuluklar (ABS plastik, ergonomik)
            //   - Ayak ucunda bilgi ekranı (durum + son ölçümler)
            //   - Entegre IV direği (sol baş tarafı)
            //   - Premium yastık + battaniye dokusu
            //   - 4 anti-static tekerlek (kilit göstergeli)
            //   - Cilt tonuna uyumlu yastık
            const g = groupAt(x, y, z);
            
            // ===========================================================
            // ALT GÖVDE — Hidrolik kolon ve motor kasası
            // ===========================================================
            // Ana motor gövdesi (siyah-gri kombinasyon)
            g.add(box(1.50, 0.22, 0.62, 0x2a3540, 0, 0.32, 0, { 
                metalness: 0.14, roughness: 0.40 
            }));
            // Üst accent şerit (turkuaz LED)
            g.add(box(1.46, 0.014, 0.62, 0x4cd6c4, 0, 0.43, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.34 
            }));
            // Motor servis paneli
            g.add(box(0.40, 0.10, 0.020, 0x4a5e72, 0, 0.34, 0.315, { roughness: 0.30 }));
            g.add(box(0.06, 0.030, 0.014, 0x4cb88a, -0.15, 0.34, 0.325, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.55 
            }));
            g.add(box(0.06, 0.030, 0.014, 0xe0a558, 0.15, 0.34, 0.325, { 
                emissive: 0xe0a558, emissiveIntensity: 0.50 
            }));
            
            // ===========================================================
            // ALT İSKELET (yan kollar - hidrolik kontrol kolu)
            // ===========================================================
            g.add(box(2.40, 0.08, 1.04, 0xb8c4cf, 0, 0.50, 0, { 
                metalness: 0.30, roughness: 0.22 
            }));
            // Alt accent kenar
            g.add(box(2.42, 0.010, 1.06, 0x4cd6c4, 0, 0.546, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.30 
            }));
            
            // ===========================================================
            // YATAK YÜZEYİ (3 segmentli - baş/orta/ayak yükseltilebilir)
            // ===========================================================
            // Ana yatak çerçevesi
            g.add(box(2.32, 0.045, 0.96, 0xdde6ed, 0, 0.59, 0, { 
                metalness: 0.16, roughness: 0.30 
            }));
            
            // BAŞ KISMI (yükseltilmiş 30°)
            // Bu segment hafif yukarıda - hasta yastıklı yatar
            g.add(box(0.74, 0.10, 0.92, 0xf3f7fb, -0.78, 0.66, 0, { 
                roughness: 0.42 
            }));
            // Baş üst kavis (yükseltilmiş geçiş)
            g.add(box(0.20, 0.06, 0.92, 0xeaf0f6, -0.42, 0.68, 0, { roughness: 0.42 }));
            
            // ORTA KISIM (orta düz)
            g.add(box(0.96, 0.10, 0.92, 0xf3f7fb, -0.04, 0.65, 0, { roughness: 0.42 }));
            
            // AYAK KISMI (hafif aşağıda)
            g.add(box(0.74, 0.10, 0.92, 0xf3f7fb, 0.78, 0.64, 0, { roughness: 0.42 }));
            
            // ===========================================================
            // ÇARŞAF + BATTANİYE (premium katmanlı)
            // ===========================================================
            // Beyaz alt çarşaf
            g.add(box(2.20, 0.020, 0.88, 0xfafdff, 0, 0.715, 0, { roughness: 0.55 }));
            // Hafif mavi battaniye (üst, ayak tarafına doğru)
            g.add(box(1.40, 0.025, 0.86, 0xc4d8e5, 0.42, 0.728, 0, { 
                roughness: 0.62, transparent: true, opacity: 0.96 
            }));
            // Battaniye katlama
            g.add(box(0.20, 0.030, 0.86, 0xb0c8d8, -0.30, 0.738, 0, { 
                roughness: 0.66 
            }));
            
            // YASTIK (premium, kabarık)
            g.add(box(0.50, 0.13, 0.66, 0xfdfdfd, -0.74, 0.745, 0, { 
                roughness: 0.50 
            }));
            // Yastık üst gölgesi
            g.add(box(0.46, 0.020, 0.62, 0xeaf0f6, -0.74, 0.815, 0, { roughness: 0.55 }));
            // Yastık katlama yan
            g.add(box(0.06, 0.10, 0.66, 0xeaf0f6, -0.96, 0.745, 0, { roughness: 0.56 }));
            
            // ===========================================================
            // BAŞ TAHTASI (premium yüksek - dijital ekran içerir)
            // ===========================================================
            // Ana baş tahtası
            g.add(box(0.10, 0.92, 1.10, 0xf1f5f8, -1.16, 1.05, 0, { 
                roughness: 0.34, metalness: 0.10 
            }));
            // Üst aksesuar şerit (turkuaz)
            g.add(box(0.12, 0.014, 1.10, 0x4cd6c4, -1.16, 1.50, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.40 
            }));
            // Hasta bilgi tutucu (kart slot)
            g.add(box(0.020, 0.30, 0.46, 0x0e1821, -1.106, 1.20, 0, { 
                roughness: 0.20, emissive: 0x0a1418, emissiveIntensity: 0.10 
            }));
            // Hasta adı LED satırı (yeşil)
            g.add(box(0.022, 0.040, 0.36, 0x4cb88a, -1.094, 1.32, 0, { 
                emissive: 0x4cb88a, emissiveIntensity: 0.50 
            }));
            // Oda no LED
            g.add(box(0.022, 0.025, 0.20, 0xe0a558, -1.094, 1.26, 0, { 
                emissive: 0xe0a558, emissiveIntensity: 0.50 
            }));
            
            // ===========================================================
            // AYAK TAHTASI (premium - bilgi ekranı içerir)
            // ===========================================================
            g.add(box(0.10, 0.62, 1.10, 0xf1f5f8, 1.16, 0.81, 0, { 
                roughness: 0.34, metalness: 0.10 
            }));
            // Bilgi ekranı (durum + ölçümler)
            g.add(box(0.020, 0.30, 0.46, 0x0e1821, 1.106, 0.85, 0, { 
                roughness: 0.20, emissive: 0x0a1418, emissiveIntensity: 0.10 
            }));
            // Ana sağlık LED (turkuaz - tüm sistemler aktif)
            g.add(box(0.022, 0.18, 0.36, 0x4cd6c4, 1.094, 0.88, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.45 
            }));
            // Mini durum 3 LED
            [-0.10, 0, 0.10].forEach((zz, i) => {
                g.add(box(0.024, 0.020, 0.030, [0x4cb88a, 0xe0a558, 0xd96371][i], 
                    1.094, 0.78, zz, { 
                    emissive: [0x4cb88a, 0xe0a558, 0xd96371][i], emissiveIntensity: 0.50 
                }));
            });
            // Ayak tahtası üst accent
            g.add(box(0.12, 0.012, 1.10, 0x4cd6c4, 1.16, 1.12, 0, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.40 
            }));
            
            // ===========================================================
            // DIJITAL KONTROL PANELİ (yan, hemşire tarafı)
            // ===========================================================
            // Pano tutucu kol
            g.add(cyl(0.024, 0.024, 0.30, 0x6f8798, 1.04, 0.90, 0.55, { 
                seg: 14, metalness: 0.40, roughness: 0.22 
            }));
            // Ana dokunmatik panel
            g.add(box(0.18, 0.22, 0.024, 0x1a2230, 1.04, 1.06, 0.62, { 
                roughness: 0.22, metalness: 0.18 
            }));
            // Aktif ekran (turkuaz)
            g.add(box(0.14, 0.16, 0.020, 0x2aaec1, 1.04, 1.06, 0.633, { 
                emissive: 0x4cd6c4, emissiveIntensity: 0.50 
            }));
            // Buton 4 LED
            [-0.04, -0.013, 0.013, 0.04].forEach((dy, i) => {
                g.add(box(0.020, 0.016, 0.014, [0x4cb88a, 0xe0a558, 0xd96371, 0x6f9fd8][i], 
                    1.04, 0.93 + dy, 0.633, { 
                    emissive: [0x4cb88a, 0xe0a558, 0xd96371, 0x6f9fd8][i], 
                    emissiveIntensity: 0.55 
                }));
            });
            
            // ===========================================================
            // YAN KORKULUKLAR (eklemli, modern ABS plastik)
            // ===========================================================
            [-0.48, 0.48].forEach(zz => {
                // Korkuluk gövdesi (büyük tek parça yumuşak köşeli)
                g.add(box(1.20, 0.32, 0.040, 0xeef3f7, -0.24, 0.92, zz, { 
                    roughness: 0.32, metalness: 0.08 
                }));
                // Korkuluk üst grip (siyah ergonomik)
                g.add(box(1.14, 0.034, 0.050, 0x2a3540, -0.24, 1.06, zz, { 
                    roughness: 0.46 
                }));
                // Hasta tarafı kontrol pad'i (TV/ışık/çağrı butonları)
                g.add(box(0.28, 0.16, 0.014, 0x1a2230, -0.50, 0.92, zz + (zz > 0 ? 0.024 : -0.024), { 
                    roughness: 0.20 
                }));
                // 3 buton ışıkları
                [-0.08, 0, 0.08].forEach((dx, i) => {
                    g.add(cyl(0.012, 0.012, 0.008, [0x4cd6c4, 0xe0a558, 0xd96371][i], 
                        -0.50 + dx, 0.92, zz + (zz > 0 ? 0.030 : -0.030), { 
                        seg: 12, emissive: [0x4cd6c4, 0xe0a558, 0xd96371][i], 
                        emissiveIntensity: 0.55 
                    }));
                });
            });
            
            // ===========================================================
            // ENTEGRE IV DİREĞİ (sol baş tarafı)
            // ===========================================================
            // Direk
            g.add(cyl(0.022, 0.022, 1.40, 0xa4b1bb, -1.20, 1.20, -0.42, { 
                seg: 14, metalness: 0.30, roughness: 0.22 
            }));
            // Üst kanca
            g.add(cyl(0.030, 0.030, 0.020, 0x6f8798, -1.20, 1.90, -0.42, { 
                seg: 14, metalness: 0.45, roughness: 0.22 
            }));
            // SF torbası (transparan)
            g.add(box(0.13, 0.20, 0.054, 0xe8eef5, -1.20, 1.78, -0.42, { 
                roughness: 0.42, transparent: true, opacity: 0.78 
            }));
            // SF etiketi
            g.add(box(0.10, 0.030, 0.012, 0xecf3f8, -1.20, 1.83, -0.39, { roughness: 0.78 }));
            g.add(box(0.08, 0.012, 0.014, 0x6f9fd8, -1.20, 1.84, -0.385, { 
                emissive: 0x6f9fd8, emissiveIntensity: 0.30 
            }));
            // IV hattı (mavi tüp aşağı)
            const iv = cyl(0.006, 0.006, 0.86, 0x6f9fd8, -1.10, 1.30, -0.36, { 
                seg: 8, transparent: true, opacity: 0.70 
            });
            iv.rotation.z = -0.30;
            g.add(iv);
            
            // ===========================================================
            // 4 PREMIUM TEKERLEK (kilit göstergeli)
            // ===========================================================
            [-1.00, 1.00].forEach(xx => [-0.44, 0.44].forEach(zz => {
                // Tekerlek bileşim kolu
                g.add(cyl(0.030, 0.030, 0.18, 0xb8c4cf, xx, 0.30, zz, { 
                    seg: 14, metalness: 0.35, roughness: 0.24 
                }));
                // Tekerlek
                const wheel = cyl(0.084, 0.084, 0.054, 0x1a2230, xx, 0.10, zz, { 
                    seg: 18, roughness: 0.55 
                });
                wheel.rotation.z = Math.PI / 2;
                g.add(wheel);
                // Tekerlek hub (krom)
                const hub = cyl(0.048, 0.048, 0.060, 0xc7d3dc, xx, 0.10, zz, { 
                    seg: 16, metalness: 0.60, roughness: 0.18 
                });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
                // Kilit pedal (yeşil = açık, kırmızı = kilitli)
                g.add(cyl(0.012, 0.012, 0.014, 0x4cb88a, xx, 0.10, zz + (zz > 0 ? 0.090 : -0.090), { 
                    seg: 12, emissive: 0x4cb88a, emissiveIntensity: 0.55 
                }));
            }));
            
            // ===========================================================
            // HASTA (mevcut detaylı buildPatient)
            // ===========================================================
            g.add(buildPatient(0, 0.54, 0, { gown: 0x88aac0, mask: App.currentRoom === 'postop' }));
            
            return g; 
        }

        function buildMonitor(x, y, z, label = 'Hasta Monitörü', opts = {}) {
            // ============================================================
            // ULTRA-PREMIUM PATIENT MONITOR v2.0
            // Philips IntelliVue MX / GE CARESCAPE B650 / Mindray BeneVision
            // referanslı klinik multi-parametre monitör.
            // 
            // Dashboard içeriği:
            //  - 4 kanal dalga formu (EKG II / Pleth SpO2 / Resp / ART)
            //  - Sağ kolonda 4 büyük vital değer kutusu (HR/SpO2/NIBP/Temp/RR)
            //  - Üst başlık (hasta + tarih) + alarm bandı
            //  - Alt fizik buton şeridi + encoder + alarm sessizleştirme
            //  - Yan port paneli (5 renk kodlu kablo girişi)
            //  - Alarm tower + ana açma/kapama LED'i
            //  - V2 dialect: anodize gri + brushed alu + cam ekran + LED accent
            // ============================================================
            const g = groupAt(x, y, z);
            const anodGray  = 0x3a4754;
            const anodDark  = 0x222a33;
            const brushAlu  = 0xb6bfc8;
            const accentTeal = 0x2dd4bf;
            const accentBlue = 0x4d9ef0;
            const accentRed = 0xe04646;
            const accentYellow = 0xfbbf24;
            const accentGreen = 0x4cb88a;
            const screenDark = 0x0a0e14;
            const isAlarm = !!opts.alarm;

            // ============================================================
            // 4 PREMIUM TEKERLEK + ALT TABAN (anodize)
            // ============================================================
            [-0.16, 0.16].forEach(xx => [-0.16, 0.16].forEach(zz => {
                const wh = cyl(0.052, 0.052, 0.034, 0x12161c, xx, 0.052, zz,
                    { seg: 18, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2; g.add(wh);
                const hub = cyl(0.024, 0.024, 0.038, brushAlu, xx, 0.052, zz,
                    { seg: 14, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
                // Mini kilit pedal LED (yeşil — frenli)
                g.add(cyl(0.005, 0.005, 0.004, accentGreen, xx, 0.052, zz + (zz > 0 ? 0.054 : -0.054),
                    { seg: 8, emissive: accentGreen, emissiveIntensity: 0.85 }));
            }));
            // Ana taban (anodize koyu)
            g.add(box(0.44, 0.060, 0.44, anodDark, 0, 0.110, 0,
                { metalness: 0.55, roughness: 0.32 }));
            // Üst LED accent (turkuaz — perimetric)
            g.add(box(0.40, 0.005, 0.40, accentTeal, 0, 0.143, 0,
                { emissive: accentTeal, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));

            // ============================================================
            // DİREK + YÜKSEKLİK AYAR MAFSALI
            // ============================================================
            g.add(cyl(0.030, 0.030, 1.10, anodGray, 0, 0.69, 0,
                { seg: 18, metalness: 0.55, roughness: 0.30 }));
            // Yükseklik ayar mafsalı (orta)
            g.add(cyl(0.040, 0.040, 0.022, anodDark, 0, 0.78, 0,
                { seg: 18, metalness: 0.45, roughness: 0.40 }));
            const _adjRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.042, 0.0030, 6, 24),
                mat(brushAlu, { metalness: 0.62, roughness: 0.22 })
            );
            _adjRing.rotation.x = Math.PI / 2;
            _adjRing.position.set(0, 0.78, 0);
            g.add(_adjRing);

            // ============================================================
            // VESA MONTAJ KOLU (üst — monitör arkasına)
            // ============================================================
            g.add(box(0.18, 0.12, 0.18, anodGray, 0, 1.18, -0.06,
                { metalness: 0.55, roughness: 0.30 }));
            // Brushed alu accent halka
            g.add(box(0.20, 0.005, 0.20, brushAlu, 0, 1.246, -0.06,
                { metalness: 0.70, roughness: 0.22 }));

            // ============================================================
            // MONITÖR KASASI — anodize çerçeve, brushed alu kenar
            // ============================================================
            // Ana kasa (büyük, tablet stili)
            g.add(box(0.78, 0.54, 0.10, anodGray, 0, 1.36, 0,
                { metalness: 0.55, roughness: 0.30 }));
            // Brushed alu kenar accent (üst+alt+yan)
            g.add(box(0.76, 0.005, 0.10, brushAlu, 0, 1.638, 0,
                { metalness: 0.70, roughness: 0.22 }));
            g.add(box(0.76, 0.005, 0.10, brushAlu, 0, 1.082, 0,
                { metalness: 0.70, roughness: 0.22 }));
            // Üst+alt LED accent şeritleri
            g.add(box(0.72, 0.004, 0.012, accentTeal, 0, 1.643, 0.044,
                { emissive: accentTeal, emissiveIntensity: 0.65,
                  transparent: true, opacity: 0.85 }));
            g.add(box(0.72, 0.004, 0.012, accentBlue, 0, 1.077, 0.044,
                { emissive: accentBlue, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));
            // Yan dikey LED accent (sol/sağ — turkuaz)
            [-0.388, 0.388].forEach(side => {
                g.add(box(0.005, 0.50, 0.012, accentTeal, side, 1.36, 0.044,
                    { emissive: accentTeal, emissiveIntensity: 0.55,
                      transparent: true, opacity: 0.85 }));
            });

            // ============================================================
            // CAM EKRAN — tüm yüzey parlak siyah cam
            // ============================================================
            g.add(box(0.74, 0.50, 0.012, screenDark, 0, 1.36, 0.052,
                { metalness: 0.20, roughness: 0.10 }));
            // Aktif ekran arka plan (koyu mavi-siyah)
            g.add(box(0.72, 0.48, 0.001, 0x081018, 0, 1.36, 0.060,
                { emissive: 0x103040, emissiveIntensity: 0.55 }));

            // ============================================================
            // EKRAN İÇERİĞİ — modern multi-parametre dashboard
            // ============================================================
            // === ÜST BAŞLIK ÇUBUĞU (hasta bilgisi + tarih) ===
            // Sol başlık (hasta adı + ID — beyaz LED)
            g.add(box(0.20, 0.022, 0.0015, 0xfafdff, -0.24, 1.585, 0.063,
                { emissive: 0xfafdff, emissiveIntensity: 0.85 }));
            // Sağ tarih/saat (turkuaz LED)
            g.add(box(0.14, 0.022, 0.0015, accentTeal, 0.24, 1.585, 0.063,
                { emissive: accentTeal, emissiveIntensity: 0.85 }));
            // Orta alarm durumu (alarm yoksa yeşil "STABLE", alarm varsa kırmızı "ALARM")
            const headerColor = isAlarm ? accentRed : accentGreen;
            g.add(box(0.10, 0.022, 0.0015, headerColor, 0, 1.585, 0.063,
                { emissive: headerColor, emissiveIntensity: 0.95 }));

            // === SOL ALAN: 4 KANAL DALGA FORMU ===
            // Dalga arka planları (4 yatay şerit) + dalga formları (renk kodlu)
            const waveChannels = [
                { y: 1.49, color: accentGreen,  label: 'EKG II',  amp: 0.025, freq: 5 },   // Yeşil EKG
                { y: 1.40, color: accentBlue,   label: 'Pleth',   amp: 0.018, freq: 4 },   // Mavi SpO2
                { y: 1.31, color: accentYellow, label: 'Resp',    amp: 0.020, freq: 2 },   // Sarı solunum
                { y: 1.22, color: accentRed,    label: 'ART',     amp: 0.028, freq: 5 }    // Kırmızı arteriyel
            ];

            waveChannels.forEach(ch => {
                // Kanal arka plan (siyah dikdörtgen)
                g.add(box(0.42, 0.07, 0.0015, 0x040810, -0.16, ch.y, 0.061,
                    { emissive: 0x081020, emissiveIntensity: 0.30 }));
                // Sol kanal etiketi (renk kodlu LED kutu)
                g.add(box(0.022, 0.040, 0.0015, ch.color, -0.36, ch.y, 0.063,
                    { emissive: ch.color, emissiveIntensity: 0.95 }));
                // Dalga örnekleme — 16 mini segment (sinüs şeklinde)
                const points = 16;
                for (let i = 0; i < points; i++) {
                    const t = i / points;
                    const dx = -0.32 + t * 0.36;
                    const dy = Math.sin(t * Math.PI * 2 * ch.freq) * ch.amp;
                    // Mini dalga noktası
                    g.add(box(0.005, 0.005, 0.0015, ch.color, dx, ch.y + dy, 0.063,
                        { emissive: ch.color, emissiveIntensity: 0.95 }));
                }
                // Kanal sağ ucu — sayısal değer mini şeridi
                g.add(box(0.030, 0.022, 0.0015, ch.color, 0.07, ch.y, 0.063,
                    { emissive: ch.color, emissiveIntensity: 0.85 }));
            });

            // === SAĞ ALAN: BÜYÜK VITAL DEĞER KUTULARI ===
            // 4 kutu (HR yeşil / SpO2 mavi / NIBP turuncu / Temp turkuaz)
            const vitalBoxes = [
                { y: 1.49, color: accentGreen,  bg: 0x0a2a18 },   // HR
                { y: 1.40, color: accentBlue,   bg: 0x0a1828 },   // SpO2
                { y: 1.31, color: accentYellow, bg: 0x2a2008 },   // NIBP
                { y: 1.22, color: accentTeal,   bg: 0x082828 }    // Temp/RR
            ];

            vitalBoxes.forEach(v => {
                // Kutu arka plan (renk koyu tonu)
                g.add(box(0.20, 0.07, 0.0015, v.bg, 0.24, v.y, 0.061,
                    { emissive: v.bg, emissiveIntensity: 0.55 }));
                // Sol kenar accent çubuğu (renk vurgu)
                g.add(box(0.005, 0.06, 0.0015, v.color, 0.155, v.y, 0.063,
                    { emissive: v.color, emissiveIntensity: 0.95 }));
                // Büyük rakam alanı (renk kodlu LED — değer simülasyonu)
                g.add(box(0.10, 0.034, 0.0015, v.color, 0.22, v.y + 0.005, 0.063,
                    { emissive: v.color, emissiveIntensity: 0.95 }));
                // Mini birim göstergesi (sağ-alt — beyaz)
                g.add(box(0.030, 0.010, 0.0015, 0xfafdff, 0.30, v.y - 0.020, 0.063,
                    { emissive: 0xfafdff, emissiveIntensity: 0.65 }));
            });

            // === ALT BAR: TREND + ALARM LIMITS ===
            // Mini trend grafik (alt sol — turkuaz nokta dizisi)
            for (let i = 0; i < 12; i++) {
                const dx = -0.32 + i * 0.030;
                const dy = 1.16 + Math.sin(i * 0.6) * 0.012;
                g.add(box(0.004, 0.004, 0.0015, accentTeal, dx, dy, 0.063,
                    { emissive: accentTeal, emissiveIntensity: 0.85 }));
            }
            // Alarm limit göstergeleri (4 mini kutu — sağ alt)
            [0.20, 0.25, 0.30, 0.35].forEach((dx, i) => {
                const colors = [accentGreen, accentYellow, accentRed, accentTeal];
                g.add(box(0.024, 0.014, 0.0015, colors[i], dx, 1.16, 0.063,
                    { emissive: colors[i], emissiveIntensity: 0.85 }));
            });

            // === ALARM AKTİF DURUMU (alarm varsa büyük kırmızı flaş) ===
            if (isAlarm) {
                // Tüm ekran üstüne kırmızı uyarı bandı (üst başlık üstünde)
                const alarmBar = box(0.70, 0.020, 0.0015, accentRed, 0, 1.610, 0.064,
                    { emissive: accentRed, emissiveIntensity: 0.95 });
                g.add(alarmBar);
                // Pulse animasyonu — yanıp sönen uyarı
                addAnimated(alarmBar, 'pulse', { speed: 5.2, base: 0.40, amp: 0.95 });
            }

            // ============================================================
            // SAĞ YAN PORT PANELİ (5 renk kodlu kablo girişi)
            // ============================================================
            // Panel arka plaka (anodize)
            g.add(box(0.060, 0.40, 0.10, anodDark, 0.420, 1.36, 0.00,
                { metalness: 0.55, roughness: 0.30 }));
            // Üst LED accent
            g.add(box(0.005, 0.36, 0.012, accentTeal, 0.452, 1.36, 0.044,
                { emissive: accentTeal, emissiveIntensity: 0.65 }));
            // 5 kablo girişi — renk kodlu (EKG kırmızı/sarı/yeşil + SpO2 mavi + Temp turkuaz)
            const portColors = [accentRed, accentYellow, accentGreen, accentBlue, accentTeal];
            const portLabels = ['ECG-RA', 'ECG-LA', 'ECG-LL', 'SpO2', 'Temp'];
            portColors.forEach((c, i) => {
                const yy = 1.50 - i * 0.075;
                // Port kasası (krom)
                g.add(cyl(0.014, 0.014, 0.014, brushAlu, 0.430, yy, 0.04,
                    { seg: 14, metalness: 0.78, roughness: 0.16 }));
                // İç renk LED
                g.add(cyl(0.010, 0.010, 0.012, c, 0.430, yy, 0.046,
                    { seg: 12, emissive: c, emissiveIntensity: 0.95 }));
                // Etiket altı (mini renk dot)
                g.add(box(0.018, 0.008, 0.005, c, 0.430, yy - 0.024, 0.046,
                    { emissive: c, emissiveIntensity: 0.85 }));
            });

            // ============================================================
            // ALT FİZİK BUTON ŞERİDİ + ENCODER + ALARM SESSİZ
            // ============================================================
            // Buton paneli (anodize alt çerçeve)
            g.add(box(0.74, 0.06, 0.012, anodDark, 0, 1.10, 0.052,
                { metalness: 0.55, roughness: 0.30 }));
            // 6 fizik buton (renk kodlu)
            const btnColors = [accentGreen, accentYellow, accentTeal, accentBlue, 0xfafdff, accentRed];
            btnColors.forEach((c, i) => {
                const dx = -0.30 + i * 0.080;
                // Buton kasası
                g.add(cyl(0.018, 0.018, 0.012, anodGray, dx, 1.10, 0.060,
                    { seg: 14, metalness: 0.55, roughness: 0.30 }));
                // İç LED
                g.add(cyl(0.012, 0.012, 0.014, c, dx, 1.10, 0.064,
                    { seg: 12, emissive: c, emissiveIntensity: 0.85 }));
            });
            // Encoder döner buton (sağda — büyük)
            g.add(cyl(0.030, 0.030, 0.018, brushAlu, 0.28, 1.10, 0.060,
                { seg: 18, metalness: 0.62, roughness: 0.22 }));
            g.add(cyl(0.022, 0.022, 0.022, anodDark, 0.28, 1.10, 0.066,
                { seg: 16, metalness: 0.45, roughness: 0.40 }));
            // Alarm sessizleştirme butonu (sol uçta — kırmızı, mantar şeklinde)
            g.add(cyl(0.024, 0.024, 0.014, accentRed, -0.34, 1.10, 0.060,
                { seg: 18, emissive: accentRed, emissiveIntensity: 0.85,
                  metalness: 0.20, roughness: 0.40 }));

            // ============================================================
            // ÜST MONİTÖR ALARM TOWER (3 LED kule — sol üst köşe)
            // ============================================================
            g.add(cyl(0.014, 0.014, 0.018, screenDark, -0.36, 1.685, 0,
                { seg: 16, roughness: 0.40 }));
            const towerGreen = isAlarm ? 0.20 : 0.85;
            const towerYellow = isAlarm ? 0.40 : 0.30;
            const towerRed = isAlarm ? 0.95 : 0.20;
            g.add(cyl(0.022, 0.022, 0.020, accentGreen, -0.36, 1.708, 0,
                { seg: 18, emissive: accentGreen, emissiveIntensity: towerGreen }));
            g.add(cyl(0.022, 0.022, 0.020, accentYellow, -0.36, 1.730, 0,
                { seg: 18, emissive: accentYellow, emissiveIntensity: towerYellow }));
            const towerRedLed = cyl(0.022, 0.022, 0.020, accentRed, -0.36, 1.752, 0,
                { seg: 18, emissive: accentRed, emissiveIntensity: towerRed });
            g.add(towerRedLed);
            if (isAlarm) {
                addAnimated(towerRedLed, 'pulse', { speed: 5.2, base: 0.50, amp: 1.20 });
            }

            // ============================================================
            // ÜST MARKA / ETİKET ŞERİDİ (kırmızı LED — cihaz kategorisi etiketi)
            // ============================================================
            // Etiket arka plakası (anodize koyu)
            g.add(box(0.20, 0.030, 0.005, anodDark, 0, 1.685, 0.054,
                { metalness: 0.55, roughness: 0.30 }));
            // Kırmızı LED etiket bandı (label parametresinin görsel temsili)
            g.add(box(0.18, 0.022, 0.0015, accentRed, 0, 1.685, 0.058,
                { emissive: accentRed, emissiveIntensity: 0.95 }));
            // Sağ ve sol mini brushed alu accent (etiket kenar süslemesi)
            g.add(box(0.005, 0.018, 0.005, brushAlu, -0.092, 1.685, 0.058,
                { metalness: 0.78, roughness: 0.16 }));
            g.add(box(0.005, 0.018, 0.005, brushAlu, 0.092, 1.685, 0.058,
                { metalness: 0.78, roughness: 0.16 }));

            // ============================================================
            // ALARM YOKKEN: Standart yeşil "MONITORING ACTIVE" LED yanıyor
            // ============================================================
            if (!isAlarm) {
                const activeLed = cyl(0.008, 0.008, 0.005, accentGreen, 0.34, 1.685, 0.054,
                    { seg: 12, emissive: accentGreen, emissiveIntensity: 0.95 });
                g.add(activeLed);
                addAnimated(activeLed, 'pulse', { speed: 1.6, base: 0.65, amp: 0.40 });
            } else {
                // Alarm — büyük kırmızı uyarı küresi sağ üst (eski davranışı koru)
                const red = sphere(0.028, accentRed, 0.34, 1.685, 0.054,
                    { emissive: accentRed, emissiveIntensity: 1.20 });
                g.add(red); addAnimated(red, 'alarm', {});
            }

            return g;
        }

        function buildIV(x, y, z) {
            // PREMIUM IV POLE + PUMP v2 — V2 dialect
            const g = groupAt(x, y, z);
            // Anodize alt taban
            g.add(box(0.42, 0.04, 0.42, 0x222a33, 0, 0.02, 0, { metalness: 0.55, roughness: 0.32 }));
            // Üst LED accent
            g.add(box(0.40, 0.005, 0.40, 0x2dd4bf, 0, 0.043, 0, { emissive: 0x2dd4bf, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }));
            // 4 tekerlek (krom hub)
            [-0.15, 0.15].forEach(xx => [-0.15, 0.15].forEach(zz => {
                const wheel = cyl(0.04, 0.04, 0.03, 0x12161c, xx, 0.03, zz, { seg: 14, metalness: 0.30, roughness: 0.55 });
                wheel.rotation.z = Math.PI / 2; g.add(wheel);
                const hub = cyl(0.020, 0.020, 0.034, 0xb6bfc8, xx, 0.03, zz, { seg: 12, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2; g.add(hub);
            }));
            // Direk (brushed alu)
            g.add(cyl(0.022, 0.022, 1.85, 0xb6bfc8, 0, 0.93, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));
            // Üst askı çubuğu
            const topBar = cyl(0.014, 0.014, 0.50, 0xb6bfc8, 0, 1.82, 0, { seg: 12, metalness: 0.78, roughness: 0.16 });
            topBar.rotation.z = Math.PI / 2; g.add(topBar);
            // IV pompa kasası (anodize gri)
            g.add(box(0.28, 0.18, 0.16, 0x3a4754, 0.14, 1.18, 0.06, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.26, 0.16, 0.005, 0xb6bfc8, 0.14, 1.18, 0.142, { metalness: 0.70, roughness: 0.22 }));
            // Pompa cam ekran
            g.add(box(0.20, 0.10, 0.012, 0x0a0e14, 0.14, 1.20, 0.150, { metalness: 0.20, roughness: 0.10 }));
            g.add(box(0.18, 0.08, 0.001, 0x103040, 0.14, 1.20, 0.157, { emissive: 0x2dd4bf, emissiveIntensity: 0.45 }));
            g.add(box(0.10, 0.024, 0.0015, 0x4cb88a, 0.14, 1.20, 0.159, { emissive: 0x4cb88a, emissiveIntensity: 0.95 }));
            // Üst LED accent (turkuaz)
            g.add(box(0.24, 0.004, 0.005, 0x2dd4bf, 0.14, 1.275, 0.144, { emissive: 0x2dd4bf, emissiveIntensity: 0.85 }));
            // 2 askı kanca (krom)
            g.add(cyl(0.005, 0.005, 0.020, 0xb6bfc8, -0.15, 1.815, 0, { seg: 8, metalness: 0.78, roughness: 0.16 }));
            g.add(cyl(0.005, 0.005, 0.020, 0xb6bfc8, 0.14, 1.815, 0, { seg: 8, metalness: 0.78, roughness: 0.16 }));
            // 2 IV torbası (saydam — biri SF mavi etiketli, biri kan kırmızı etiketli)
            g.add(box(0.18, 0.34, 0.05, 0xc7dbe6, -0.15, 1.62, 0.00, { transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.20, metalness: 0.04, roughness: 0.30 }));
            g.add(box(0.12, 0.014, 0.005, 0x4d9ef0, -0.15, 1.74, 0.030, { emissive: 0x4d9ef0, emissiveIntensity: 0.65 }));
            g.add(box(0.15, 0.28, 0.05, 0xe04646, 0.14, 1.58, 0.00, { transparent: true, opacity: 0.75, emissive: 0xe04646, emissiveIntensity: 0.30, metalness: 0.10, roughness: 0.40 }));
            g.add(box(0.10, 0.014, 0.005, 0xfafdff, 0.14, 1.69, 0.030, { emissive: 0xfafdff, emissiveIntensity: 0.65 }));
            // Damla odası + hortum
            g.add(cyl(0.018, 0.018, 0.12, 0xc7dbe6, -0.15, 1.34, 0.02, { seg: 10, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));
            g.add(cyl(0.008, 0.008, 0.88, 0xc7dbe6, -0.08, 1.05, 0.02, { seg: 8, transparent: true, opacity: 0.55, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));
            return g;
        }

        function buildChair(x, y, z) {
            // PREMIUM HOSPITAL CHAIR v2 — refakatçi/ekip oturma koltuğu
            const g = groupAt(x, y, z);
            // Anodize alt iskelet
            g.add(box(0.74, 0.020, 0.74, 0x222a33, 0, 0.310, 0, { metalness: 0.55, roughness: 0.32 }));
            // Oturma minderi (anodize gri + brushed alu kenar)
            g.add(box(0.72, 0.18, 0.72, 0x3a4754, 0, 0.42, 0, { metalness: 0.50, roughness: 0.34 }));
            g.add(box(0.74, 0.005, 0.74, 0xb6bfc8, 0, 0.515, 0, { metalness: 0.70, roughness: 0.22 }));
            // Sırt minderi (anodize)
            g.add(box(0.70, 0.70, 0.16, 0x3a4754, 0, 0.95, -0.28, { metalness: 0.50, roughness: 0.34 }));
            // Sırt üst brushed accent
            g.add(box(0.66, 0.040, 0.012, 0xb6bfc8, 0, 1.28, -0.226, { metalness: 0.70, roughness: 0.22 }));
            // Sırt LED accent (turkuaz şerit)
            g.add(box(0.60, 0.005, 0.014, 0x2dd4bf, 0, 1.298, -0.220, { emissive: 0x2dd4bf, emissiveIntensity: 0.65 }));
            // Sol/sağ kolçaklar (anodize + brushed alu üst)
            g.add(box(0.10, 0.42, 0.72, 0x222a33, -0.40, 0.62, 0, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.10, 0.42, 0.72, 0x222a33, 0.40, 0.62, 0, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.10, 0.012, 0.72, 0xb6bfc8, -0.40, 0.838, 0, { metalness: 0.70, roughness: 0.22 }));
            g.add(box(0.10, 0.012, 0.72, 0xb6bfc8, 0.40, 0.838, 0, { metalness: 0.70, roughness: 0.22 }));
            // Yan masa (sağ kolçak üstüne yerleşik)
            g.add(box(0.56, 0.040, 0.28, 0x3a4754, -0.08, 0.78, 0.48, { metalness: 0.55, roughness: 0.30 }));
            g.add(box(0.54, 0.005, 0.26, 0xb6bfc8, -0.08, 0.802, 0.48, { metalness: 0.70, roughness: 0.22 }));
            // Direk + ayak (krom)
            g.add(cyl(0.026, 0.026, 0.72, 0xb6bfc8, -0.36, 0.36, 0.48, { seg: 14, metalness: 0.78, roughness: 0.16 }));
            const foot = cyl(0.05, 0.05, 0.04, 0x222a33, -0.36, 0.02, 0.48, { seg: 14, roughness: 0.55, metalness: 0.40 });
            foot.rotation.z = Math.PI / 2;
            g.add(foot);
            return g;
        }

        function buildHuman(x, y, z, role = 'nurse', color = 0x5cc4d6) {
            // PREMIUM ROLE-SPECIFIC OR PERSONNEL v6.6
            // Role-specific premium NPC builder. Tek kişi/figür için
            // anatomik detaylar, role-uygun kıyafet/ekipman, doğal duruş.
            //
            // Roles:
            //   - 'circulating': Sirküle hemşire (mor scrub, kayıt panosu, kalem)
            //   - 'anaesthesia': Anestezi teknisyeni (mavi scrub, stetoskop, tablet)
            //   - 'perfusion':   Perfüzyonist (gri-mavi scrub, gözlük)
            //   - 'scrub':       Scrub hemşire (turkuaz scrub - default)
            //   - 'team' / diğer: Genel personel
            //   - 'relative':    Hasta yakını (sivil kıyafet)
            const g = groupAt(x, y, z);
            const scrub = color;
            const isRelative = role.includes('relative');
            const isCirculating = role.includes('circulating');
            const isAnaesthesia = role.includes('anaesthesia') || role.includes('anesthesia');
            const isPerfusion = role.includes('perfusion');
            const isScrub = role.includes('scrub');
            
            // Renk paleti
            const scrubDeep = darkerColor(scrub);
            const skin = 0xe8c39e;
            const skinShade = 0xd1a98a;
            const skinHighlight = 0xf0d2ad;
            const pants = isRelative ? 0x5a4639 : 0x29445f;
            const pantsDeep = isRelative ? 0x3f2f24 : 0x1c2f44;
            const eyebrow = 0x3b2820;
            const hairColor = isRelative ? 0x6b4f3a : (isCirculating ? 0x4a3528 : 0x3f2e26);
            
            function darkerColor(c) {
                const r = (c >> 16) & 0xff;
                const g = (c >> 8) & 0xff;
                const b = c & 0xff;
                return ((Math.max(0, r-35) << 16) | (Math.max(0, g-35) << 8) | Math.max(0, b-35));
            }
            
            // ============================================================
            // BAŞ + BOYUN
            // ============================================================
            // Boyun
            g.add(cyl(0.052, 0.048, 0.10, skin, 0, 1.20, 0, { 
                seg: 18, roughness: 0.42 
            }));
            // Boyun gölgesi
            g.add(cyl(0.054, 0.054, 0.018, skinShade, 0, 1.16, 0, { 
                seg: 18, roughness: 0.50 
            }));
            
            // Ana baş (sphere)
            const head = sphere(0.115, skin, 0, 1.34, 0, { roughness: 0.36 });
            head.scale.set(0.92, 1.05, 1.0);
            g.add(head);
            
            // Yanak yumuşaklığı (büyük + ekstra blush)
            g.add(sphere(0.030, skinHighlight, -0.072, 1.32, 0.045, { roughness: 0.40 }));
            g.add(sphere(0.030, skinHighlight, 0.072, 1.32, 0.045, { roughness: 0.40 }));
            // Yanaklarda hafif pembelik
            g.add(sphere(0.018, 0xf5b8a0, -0.082, 1.31, 0.075, { 
                roughness: 0.46, transparent: true, opacity: 0.55 
            }));
            g.add(sphere(0.018, 0xf5b8a0, 0.082, 1.31, 0.075, { 
                roughness: 0.46, transparent: true, opacity: 0.55 
            }));
            
            // Çene gölgesi (alt yüz - yumuşak)
            g.add(sphere(0.026, skinShade, 0, 1.245, 0.060, { roughness: 0.42 }));
            // Çene altı (yumuşak gölge)
            g.add(cyl(0.038, 0.040, 0.020, skinShade, 0, 1.225, 0.020, { 
                seg: 16, roughness: 0.50 
            }));
            
            // Burun (ufak çıkıntı - maskenin altında ama tepesi görünür)
            g.add(sphere(0.020, skin, 0, 1.350, 0.108, { roughness: 0.42 }));
            // Burun ucu (highlight)
            g.add(sphere(0.013, skinHighlight, 0, 1.345, 0.118, { roughness: 0.36 }));
            
            // Kulaklar (yan, küçük)
            g.add(sphere(0.022, skin, -0.108, 1.345, 0.020, { roughness: 0.42 }));
            g.add(sphere(0.022, skin, 0.108, 1.345, 0.020, { roughness: 0.42 }));
            // Kulak iç gölgesi
            g.add(sphere(0.012, skinShade, -0.110, 1.342, 0.022, { roughness: 0.50 }));
            g.add(sphere(0.012, skinShade, 0.110, 1.342, 0.022, { roughness: 0.50 }));
            
            // ============================================================
            // BONE (cerrahi başlık) — relative hariç herkeste, BÜYÜK ve BELİRGİN
            // ============================================================
            if (!isRelative) {
                // Bone rengi role'e göre (canlı, kontrastlı)
                let boneColor = 0x186475; // varsayılan
                let boneShade = 0x0a3f4a;
                if (isCirculating) { boneColor = 0x7d5ba8; boneShade = 0x4a3470; }   // mor
                else if (isAnaesthesia) { boneColor = 0x2e6db0; boneShade = 0x18497a; }  // koyu mavi
                else if (isPerfusion) { boneColor = 0x3f5a78; boneShade = 0x243a52; }    // gri-mavi
                else if (isScrub) { boneColor = 0x1f8aa3; boneShade = 0x0a4d5e; }   // turkuaz
                
                // Ana bone (sphere — başın üstünü saran, BÜYÜK)
                const bone = sphere(0.140, boneColor, 0, 1.405, -0.010, { roughness: 0.62 });
                bone.scale.set(1.06, 0.82, 1.06);
                g.add(bone);
                
                // Bone üst tepesi (highlight - daha açık)
                g.add(sphere(0.105, boneColor, 0, 1.435, -0.005, { roughness: 0.55 }));
                
                // Alın bandı (KALIN, KOYU - belirgin)
                g.add(box(0.24, 0.020, 0.026, boneShade, 0, 1.358, 0.094, { 
                    roughness: 0.50 
                }));
                
                // Bone arka düğüm (büyük, görünür)
                g.add(sphere(0.024, boneShade, 0, 1.405, -0.118, { 
                    roughness: 0.52 
                }));
                
                // Saç hafif görünür (bone altından — yan)
                g.add(sphere(0.030, hairColor, -0.108, 1.30, 0.020, { roughness: 0.74 }));
                g.add(sphere(0.030, hairColor, 0.108, 1.30, 0.020, { roughness: 0.74 }));
                
            } else {
                // Relative — saç görünür
                const hair = sphere(0.128, hairColor, 0, 1.38, -0.012, { roughness: 0.74 });
                hair.scale.set(1.02, 0.80, 1.0);
                g.add(hair);
                g.add(box(0.10, 0.28, 0.10, hairColor, -0.10, 1.30, -0.01, { roughness: 0.70 }));
                g.add(box(0.10, 0.28, 0.10, hairColor, 0.10, 1.30, -0.01, { roughness: 0.70 }));
            }
            
            // ============================================================
            // KAŞ + GÖZ (maskenin üstünde görünür) — premium, kirpikli
            // ============================================================
            // Kaş — daha belirgin
            g.add(box(0.044, 0.010, 0.012, eyebrow, -0.040, 1.378, 0.108, { 
                roughness: 0.56 
            }));
            g.add(box(0.044, 0.010, 0.012, eyebrow, 0.040, 1.378, 0.108, { 
                roughness: 0.56 
            }));
            // Kaş iç ucu (daha koyu)
            g.add(box(0.014, 0.012, 0.014, 0x1f1410, -0.020, 1.378, 0.110, { 
                roughness: 0.56 
            }));
            g.add(box(0.014, 0.012, 0.014, 0x1f1410, 0.020, 1.378, 0.110, { 
                roughness: 0.56 
            }));
            
            // Göz çukuru (daha derin gölge)
            g.add(sphere(0.022, skinShade, -0.040, 1.358, 0.108, { roughness: 0.46 }));
            g.add(sphere(0.022, skinShade, 0.040, 1.358, 0.108, { roughness: 0.46 }));
            
            // Göz akı (daha büyük + parlaklık)
            g.add(sphere(0.014, 0xfafaf2, -0.040, 1.358, 0.115, { roughness: 0.20 }));
            g.add(sphere(0.014, 0xfafaf2, 0.040, 1.358, 0.115, { roughness: 0.20 }));
            
            // Iris + pupil (daha belirgin)
            const eyeColor = isCirculating ? 0x4c587f : (isAnaesthesia ? 0x44557a : 0x3a4d3f);
            g.add(sphere(0.008, eyeColor, -0.040, 1.358, 0.123, { roughness: 0.18 }));
            g.add(sphere(0.008, eyeColor, 0.040, 1.358, 0.123, { roughness: 0.18 }));
            g.add(sphere(0.0040, 0x0a0a0a, -0.040, 1.358, 0.128, {}));
            g.add(sphere(0.0040, 0x0a0a0a, 0.040, 1.358, 0.128, {}));
            // Göz parlaklığı (catchlight - canlı göz)
            g.add(sphere(0.0024, 0xffffff, -0.038, 1.361, 0.131, { 
                emissive: 0xffffff, emissiveIntensity: 0.40 
            }));
            g.add(sphere(0.0024, 0xffffff, 0.042, 1.361, 0.131, { 
                emissive: 0xffffff, emissiveIntensity: 0.40 
            }));
            
            // Üst kirpikler (3 ince çizgi her gözün üstünde)
            [-0.012, 0, 0.012].forEach(dx => {
                g.add(box(0.004, 0.005, 0.003, 0x1a0a08, -0.040 + dx, 1.370, 0.116, { 
                    roughness: 0.66 
                }));
                g.add(box(0.004, 0.005, 0.003, 0x1a0a08, 0.040 + dx, 1.370, 0.116, { 
                    roughness: 0.66 
                }));
            });
            
            // ============================================================
            // PERFUSIONIST: GÖZLÜK (cihaz okumak için)
            // ============================================================
            if (isPerfusion) {
                // Çerçeve
                g.add(box(0.12, 0.010, 0.008, 0x1a2230, 0, 1.358, 0.118, { 
                    roughness: 0.30, metalness: 0.30 
                }));
                // Köprü
                g.add(box(0.020, 0.006, 0.008, 0x1a2230, 0, 1.358, 0.122, { 
                    roughness: 0.30 
                }));
                // 2 lens halkası
                const ll = new THREE.Mesh(
                    new THREE.TorusGeometry(0.022, 0.003, 6, 18),
                    mat(0x1a2230, { metalness: 0.30, roughness: 0.30 })
                );
                ll.position.set(-0.040, 1.358, 0.122);
                prepMesh(ll); g.add(ll);
                const rl = new THREE.Mesh(
                    new THREE.TorusGeometry(0.022, 0.003, 6, 18),
                    mat(0x1a2230, { metalness: 0.30, roughness: 0.30 })
                );
                rl.position.set(0.040, 1.358, 0.122);
                prepMesh(rl); g.add(rl);
                // Lens cam (saydam)
                g.add(cyl(0.020, 0.020, 0.004, 0xb7e6f0, -0.040, 1.358, 0.124, { 
                    seg: 14, transparent: true, opacity: 0.30 
                }));
                g.add(cyl(0.020, 0.020, 0.004, 0xb7e6f0, 0.040, 1.358, 0.124, { 
                    seg: 14, transparent: true, opacity: 0.30 
                }));
                // Saplar
                g.add(box(0.005, 0.008, 0.10, 0x1a2230, -0.062, 1.358, 0.07, { 
                    roughness: 0.30 
                }));
                g.add(box(0.005, 0.008, 0.10, 0x1a2230, 0.062, 1.358, 0.07, { 
                    roughness: 0.30 
                }));
            }
            
            // ============================================================
            // CERRAHI MASKE — kavisli, KALIN, BELİRGİN turkuaz (premium)
            // ============================================================
            if (!isRelative) {
                // Maske rengi belirgin turkuaz (gerçek cerrahi maske)
                const maskColor = isAnaesthesia ? 0x9bc4d4 : 0xa8cdd8;
                const maskShade = 0x4a7c8a;  // Koyu kontur
                const maskHighlight = 0xc8dde4;
                
                // Ana maske gövdesi (KALIN — daha hacimli)
                const mask = box(0.18, 0.15, 0.040, maskColor, 0, 1.290, 0.110, { 
                    roughness: 0.50 
                });
                g.add(mask);
                
                // Burun çevresi çıkıntısı (orta - belirgin öne çıkık dome)
                g.add(sphere(0.042, maskColor, 0, 1.325, 0.130, { roughness: 0.50 }));
                
                // Yan yumuşaklık (yanaklara saran — büyük)
                g.add(sphere(0.052, maskColor, -0.082, 1.290, 0.085, { roughness: 0.50 }));
                g.add(sphere(0.052, maskColor, 0.082, 1.290, 0.085, { roughness: 0.50 }));
                
                // Çene altı kavisi (büyük, çeneyi tam saran)
                g.add(sphere(0.045, maskColor, 0, 1.245, 0.105, { roughness: 0.50 }));
                
                // KOYU KONTUR ÇİZGİLERİ (maskeyi belirgin yapan kenarlar)
                // Üst kenar (alın altı)
                g.add(box(0.18, 0.008, 0.044, maskShade, 0, 1.350, 0.115, { 
                    roughness: 0.40 
                }));
                // Alt kenar (çene altı)
                g.add(box(0.16, 0.008, 0.044, maskShade, 0, 1.220, 0.110, { 
                    roughness: 0.40 
                }));
                // Sol kenar
                g.add(box(0.008, 0.13, 0.044, maskShade, -0.090, 1.290, 0.115, { 
                    roughness: 0.40 
                }));
                // Sağ kenar
                g.add(box(0.008, 0.13, 0.044, maskShade, 0.090, 1.290, 0.115, { 
                    roughness: 0.40 
                }));
                
                // 3 yatay KIVRIM ÇİZGİSİ (modern N95 — daha kalın koyu)
                g.add(box(0.17, 0.008, 0.044, maskShade, 0, 1.328, 0.118, { 
                    roughness: 0.50 
                }));
                g.add(box(0.17, 0.008, 0.044, maskShade, 0, 1.298, 0.118, { 
                    roughness: 0.50 
                }));
                g.add(box(0.17, 0.008, 0.044, maskShade, 0, 1.268, 0.118, { 
                    roughness: 0.50 
                }));
                
                // Burun teli (üstte metalik şerit — KALIN)
                g.add(box(0.080, 0.012, 0.024, 0x6a7884, 0, 1.348, 0.128, { 
                    metalness: 0.55, roughness: 0.22 
                }));
                
                // Maske kulak ipleri (kalın, koyu — belirgin)
                const lEar = new THREE.Mesh(
                    new THREE.TorusGeometry(0.052, 0.005, 6, 14, Math.PI * 0.85),
                    mat(maskShade, { roughness: 0.40 })
                );
                lEar.rotation.y = Math.PI / 2;
                lEar.position.set(-0.105, 1.310, 0.045);
                prepMesh(lEar); g.add(lEar);
                
                const rEar = new THREE.Mesh(
                    new THREE.TorusGeometry(0.052, 0.005, 6, 14, Math.PI * 0.85),
                    mat(maskShade, { roughness: 0.40 })
                );
                rEar.rotation.y = -Math.PI / 2;
                rEar.position.set(0.105, 1.310, 0.045);
                prepMesh(rEar); g.add(rEar);
                
            } else {
                // Relative — maske yok, ağız + dudak
                g.add(box(0.030, 0.005, 0.012, 0xaa6f68, 0, 1.290, 0.118, {
                    roughness: 0.56
                }));
                g.add(box(0.024, 0.004, 0.010, 0x8a4f48, 0, 1.295, 0.118, {
                    roughness: 0.56
                }));
            }
            
            // ============================================================
            // ÜST BEDEN — SCRUB FORMU (anatomik)
            // ============================================================
            // Yaka çevresi
            g.add(box(0.32, 0.06, 0.22, scrubDeep, 0, 1.13, 0, { roughness: 0.62 }));
            
            // Omuzlar (yuvarlak)
            const lShoulder = sphere(0.090, scrub, -0.18, 1.07, 0, { roughness: 0.60 });
            lShoulder.scale.set(1.0, 0.85, 1.05);
            g.add(lShoulder);
            const rShoulder = sphere(0.090, scrub, 0.18, 1.07, 0, { roughness: 0.60 });
            rShoulder.scale.set(1.0, 0.85, 1.05);
            g.add(rShoulder);
            
            // Üst gövde
            g.add(box(0.36, 0.32, 0.24, scrub, 0, 0.94, 0, { roughness: 0.60 }));
            
            // Göğüs orta düşey çizgi (kıyafet kıvrımı)
            g.add(box(0.010, 0.26, 0.008, scrubDeep, 0, 0.94, 0.124, { roughness: 0.66 }));
            
            // Bel daralma
            g.add(box(0.32, 0.08, 0.22, scrub, 0, 0.74, 0, { roughness: 0.62 }));
            // Bel kemer çizgisi
            g.add(box(0.34, 0.012, 0.23, scrubDeep, 0, 0.71, 0, { roughness: 0.66 }));
            
            // V-yaka (relative hariç)
            if (!isRelative) {
                const vNeckColor = isCirculating ? 0xf2e4f5 : (isAnaesthesia ? 0xeff5f8 : 0xeff5f8);
                g.add(box(0.10, 0.08, 0.020, vNeckColor, 0, 1.10, 0.115, { 
                    roughness: 0.36 
                }));
                // V kenar
                g.add(box(0.014, 0.10, 0.012, scrubDeep, -0.05, 1.07, 0.122, { 
                    roughness: 0.60 
                }));
                g.add(box(0.014, 0.10, 0.012, scrubDeep, 0.05, 1.07, 0.122, { 
                    roughness: 0.60 
                }));
                
                // 2 cep
                g.add(box(0.10, 0.10, 0.012, scrubDeep, -0.10, 0.78, 0.130, { 
                    roughness: 0.55 
                }));
                g.add(box(0.10, 0.10, 0.012, scrubDeep, 0.10, 0.78, 0.130, { 
                    roughness: 0.55 
                }));
                
                // Kimlik kartı (göğüs üstü)
                g.add(cyl(0.004, 0.004, 0.16, 0x2a3540, 0.10, 1.05, 0.115, { seg: 8 }));
                g.add(box(0.06, 0.080, 0.008, 0xf5f8fa, 0.10, 0.97, 0.130, { 
                    roughness: 0.42 
                }));
                // Kart üst şerit
                g.add(box(0.06, 0.018, 0.010, scrub, 0.10, 1.000, 0.135, { 
                    emissive: scrub, emissiveIntensity: 0.18 
                }));
                // Foto temsili
                g.add(box(0.025, 0.030, 0.012, skin, 0.10, 0.98, 0.137, { 
                    roughness: 0.42 
                }));
            }
            
            // ============================================================
            // ROL'E ÖZGÜ EKİPMAN
            // ============================================================
            
            // SİRKÜLE: Tablet/kayıt panosu (sol elinde tutuyor — koltuk altında)
            if (isCirculating) {
                // Pano (siyah dikdörtgen)
                g.add(box(0.16, 0.20, 0.012, 0x1a2230, -0.30, 0.86, 0.10, { 
                    roughness: 0.30 
                }));
                // Üzerinde beyaz kağıt
                g.add(box(0.13, 0.16, 0.014, 0xecf3f8, -0.30, 0.88, 0.107, { 
                    roughness: 0.78 
                }));
                // Kalem (panonun yanında)
                g.add(cyl(0.006, 0.006, 0.10, 0xd96371, -0.36, 0.96, 0.112, { 
                    seg: 8, roughness: 0.30 
                }));
            }
            
            // ANESTEZİ TEKNİSYENİ: Stetoskop (boyunda asılı)
            if (isAnaesthesia) {
                // Stetoskop boyun kısmı (siyah kavisli tüp)
                const stethL = new THREE.Mesh(
                    new THREE.TorusGeometry(0.10, 0.008, 6, 18, Math.PI * 0.95),
                    mat(0x1a2230, { roughness: 0.40 })
                );
                stethL.rotation.x = Math.PI / 2;
                stethL.rotation.z = Math.PI * 0.02;
                stethL.position.set(-0.05, 1.10, 0.075);
                prepMesh(stethL); g.add(stethL);
                
                const stethR = new THREE.Mesh(
                    new THREE.TorusGeometry(0.10, 0.008, 6, 18, Math.PI * 0.95),
                    mat(0x1a2230, { roughness: 0.40 })
                );
                stethR.rotation.x = Math.PI / 2;
                stethR.rotation.z = -Math.PI * 0.02;
                stethR.position.set(0.05, 1.10, 0.075);
                prepMesh(stethR); g.add(stethR);
                
                // Stetoskop diafragma (göğüs üstünde)
                g.add(cyl(0.030, 0.030, 0.012, 0xc7d0d8, 0, 0.92, 0.130, { 
                    seg: 18, metalness: 0.40, roughness: 0.20 
                }));
                g.add(cyl(0.022, 0.022, 0.005, 0x405362, 0, 0.927, 0.132, { 
                    seg: 14, roughness: 0.30 
                }));
                // Tüpün diyaframa giden alt kısmı
                g.add(cyl(0.005, 0.005, 0.18, 0x1a2230, 0, 1.02, 0.130, { 
                    seg: 8, roughness: 0.40 
                }));
            }
            
            // PERFÜZYONİST: Tablet (kontrol değerleri okuma)
            if (isPerfusion) {
                // Sağ elde tablet
                g.add(box(0.14, 0.18, 0.012, 0x1a2230, 0.30, 0.85, 0.12, { 
                    roughness: 0.20, metalness: 0.18 
                }));
                // Tablet ekranı (turkuaz aktif)
                g.add(box(0.11, 0.14, 0.014, 0x5cc4d6, 0.30, 0.85, 0.127, { 
                    emissive: 0x5cc4d6, emissiveIntensity: 0.42 
                }));
            }
            
            // ============================================================
            // KOLLAR — anatomik, doğal duruş, NORMAL POZ (rotasyonsuz)
            // ============================================================
            
            // SOL KOL: Yanında düz aşağı sarkmış (rest position)
            // Üst kol (omuzdan dirseğe)
            g.add(box(0.090, 0.30, 0.090, scrub, -0.235, 0.92, 0, { roughness: 0.60 }));
            // Dirsek
            g.add(sphere(0.052, scrubDeep, -0.235, 0.76, 0, { roughness: 0.58 }));
            // Ön kol
            g.add(box(0.080, 0.24, 0.080, scrub, -0.235, 0.62, 0, { roughness: 0.60 }));
            // Manşet
            g.add(cyl(0.048, 0.048, 0.04, scrubDeep, -0.235, 0.49, 0, { 
                seg: 16, roughness: 0.58 
            }));
            // El (cilt ya da eldiven)
            const handColor = isScrub ? 0x6f9fd8 : skin;
            const handOpacity = isScrub ? 0.85 : 1.0;
            g.add(box(0.075, 0.10, 0.075, handColor, -0.235, 0.42, 0, { 
                roughness: 0.40, transparent: isScrub, opacity: handOpacity 
            }));
            // 4 parmak
            [-0.022, -0.007, 0.008, 0.022].forEach(dx => {
                g.add(cyl(0.008, 0.007, 0.05, handColor, -0.235 + dx, 0.35, 0, { 
                    seg: 10, roughness: 0.40, transparent: isScrub, opacity: handOpacity 
                }));
            });
            
            // SAĞ KOL: Hafifçe yana, doğal aşağı sarkık (sağ el rolü gereği aktif)
            // Sirküle: pano taşıyor → sağ kol biraz öne
            // Anestezi: stetoskop kullanıyor → sağ kol hafif öne
            // Perfüzyon: tablet tutuyor → sağ kol orta
            // Normal: aşağı sarkık
            
            const rArmFwd = (isCirculating || isAnaesthesia || isPerfusion) ? 0.06 : 0;
            
            // Üst kol (omuzdan dirseğe)
            g.add(box(0.090, 0.30, 0.090, scrub, 0.235, 0.92, rArmFwd, { roughness: 0.60 }));
            // Dirsek
            g.add(sphere(0.052, scrubDeep, 0.235, 0.76, rArmFwd, { roughness: 0.58 }));
            // Ön kol
            g.add(box(0.080, 0.24, 0.080, scrub, 0.235, 0.62, rArmFwd, { roughness: 0.60 }));
            // Manşet
            g.add(cyl(0.048, 0.048, 0.04, scrubDeep, 0.235, 0.49, rArmFwd, { 
                seg: 16, roughness: 0.58 
            }));
            // El
            g.add(box(0.075, 0.10, 0.075, handColor, 0.235, 0.42, rArmFwd, { 
                roughness: 0.40, transparent: isScrub, opacity: handOpacity 
            }));
            // 4 parmak
            [-0.022, -0.007, 0.008, 0.022].forEach(dx => {
                g.add(cyl(0.008, 0.007, 0.05, handColor, 0.235 + dx, 0.35, rArmFwd, { 
                    seg: 10, roughness: 0.40, transparent: isScrub, opacity: handOpacity 
                }));
            });
            
            // ============================================================
            // ALT BEDEN — pantolon
            // ============================================================
            // Sol bacak
            g.add(box(0.105, 0.50, 0.105, pants, -0.080, 0.34, 0, { roughness: 0.62 }));
            // Sol diz
            g.add(sphere(0.058, pantsDeep, -0.080, 0.20, 0, { roughness: 0.64 }));
            // Sol baldır
            g.add(box(0.098, 0.20, 0.098, pants, -0.080, 0.12, 0, { roughness: 0.62 }));
            
            // Sağ bacak
            g.add(box(0.105, 0.50, 0.105, pants, 0.080, 0.34, 0, { roughness: 0.62 }));
            g.add(sphere(0.058, pantsDeep, 0.080, 0.20, 0, { roughness: 0.64 }));
            g.add(box(0.098, 0.20, 0.098, pants, 0.080, 0.12, 0, { roughness: 0.62 }));
            
            // ============================================================
            // OR AYAKKABILARI (relative hariç beyaz medikal)
            // ============================================================
            const shoeColor = isRelative ? 0x2c3137 : 0xeff5f8;
            const shoeAccent = isRelative ? 0x1a1f25 : 0x4cd6c4;
            
            // Sol
            g.add(box(0.13, 0.06, 0.20, shoeColor, -0.080, 0.04, 0.04, { 
                roughness: 0.55 
            }));
            // Topuk yastığı (medikal personel için turkuaz)
            if (!isRelative) {
                g.add(box(0.13, 0.014, 0.06, shoeAccent, -0.080, 0.078, 0.04, { 
                    emissive: shoeAccent, emissiveIntensity: 0.10 
                }));
                // Bağcık deliği
                g.add(box(0.090, 0.020, 0.060, 0xb7c6cd, -0.080, 0.060, 0.10, { 
                    roughness: 0.45 
                }));
            }
            
            // Sağ
            g.add(box(0.13, 0.06, 0.20, shoeColor, 0.080, 0.04, 0.04, { 
                roughness: 0.55 
            }));
            if (!isRelative) {
                g.add(box(0.13, 0.014, 0.06, shoeAccent, 0.080, 0.078, 0.04, { 
                    emissive: shoeAccent, emissiveIntensity: 0.10 
                }));
                g.add(box(0.090, 0.020, 0.060, 0xb7c6cd, 0.080, 0.060, 0.10, { 
                    roughness: 0.45 
                }));
            }
            
            addAnimated(g, 'float', { baseY: y, amp: 0.008, speed: 0.78 });
            return g;
        }

        function buildOpTable(x, y, z) { 
            const g = groupAt(x, y, z);
            g.add(box(2.35, 0.11, 0.86, 0x516575, 0, 0.85, 0, { metalness: 0.20, roughness: 0.45 }));
            g.add(box(0.22, 0.85, 0.42, 0x2d3a48, 0, 0.42, 0, { metalness: 0.15 }));
            g.add(buildPatient(0, 0.71, 0, { gown: 0x8fb2c5 }));
            g.add(box(2.0, 0.04, 0.05, 0x94a8b8, 0.05, 1.08, -0.51, { metalness: 0.4 }));
            return g; 
        }
        function buildSurgicalLight(x, y, z) {
            // PREMIUM SURGICAL LIGHT v9.5 - REFINED LARGER PETAL DESIGN
            // %20 daha büyük + rafine petal geometri + premium hub/handle
            // + güçlü articulated arms + sofistike ceiling mount.
            const g = groupAt(x, y, z);
            const rig = buildSurgicalLightModernPetalV2();
            // Tavan kalibrasyonu (NurseKit ROOM_H = 4.20)
            // Lambadaki büyütme nedeniyle başlıklar biraz daha aşağıda kalsın
            // ama cerrahi alanı doğru aydınlatsın.
            rig.position.y = 3.95;
            g.add(rig);
            return g;
        }

        function buildSurgicalLightModernPetalV2() {
            const rig = new THREE.Group();
            rig.name = 'SurgicalLightModernPetalV2_v95';
            
            // -----------------------------
            // PREMIUM SOPHISTICATED PALETTE v9.38
            // "Yakışıklı" rötuş: monoton anodize yerine 6 katmanlı renk hiyerarşisi
            // Maquet PowerLED 700 / Trumpf TruLight iLED / Stryker Visum referansı
            // - Petal kabukları: pearl grey (cila benzeri yansıma, soğuk inci tonu)
            // - Hub krom kenar: champagne chrome (Maquet'in karakteristik altın-krom accent)
            // - Mafsal eklemleri: gunmetal blue (lüks, derin)
            // - Lens iç halka: rose-gold (modern dental accent — opsiyonel sıcak vurgu)
            // - LED glow: aqua-teal (canlı, daha parlak emissive)
            // - Kontrol kolu: deep navy + chrome tip
            // -----------------------------
            // Yeni renk paleti
            const _pearlGrey      = 0x6b7e8e;   // İnci-gri (petal kabuğu)
            const _champagneChrome = 0xc4b89a;   // Şampanya altın-krom (hub kenar)
            const _gunmetalBlue   = 0x2a3a4e;   // Gunmetal mavi (mafsal)
            const _roseGold       = 0xb87b65;   // Rose-gold (lens halka)
            const _aquaTeal       = 0x14e8d4;   // Aqua-teal (LED glow)
            const _deepNavy       = 0x1d2a3d;   // Derin lacivert (kontrol kolu)

            // Ana gövde — PEARL GREY (cila benzeri inci tonu, eski monoton anodize yerine)
            const bodyMat = new THREE.MeshStandardMaterial({
                color: _pearlGrey,
                roughness: 0.22,        // Daha cilalı (eski 0.30)
                metalness: 0.62         // Daha metalik (eski 0.55)
            });
            
            // Trim/kenar accent — CHAMPAGNE CHROME (Maquet karakteristik altın-krom)
            const trimMat = new THREE.MeshStandardMaterial({
                color: _champagneChrome,
                roughness: 0.18,
                metalness: 0.78
            });
            
            // Mafsal eklemleri — GUNMETAL BLUE (lüks derin ton)
            const jointMat = new THREE.MeshStandardMaterial({
                color: _gunmetalBlue,
                roughness: 0.30,
                metalness: 0.65
            });
            
            // İç reflektör — BEYAZ (klinik ışık yüzü, dokunulmadı)
            const innerMat = new THREE.MeshStandardMaterial({
                color: 0xfdfefe,
                roughness: 0.26,
                metalness: 0.08
            });
            
            // LED LENS — beyaz parlak (klinik ışık emissive, dokunulmadı)
            const lensMat = new THREE.MeshStandardMaterial({
                color: 0xf5fbff,
                emissive: 0xeaf7ff,
                emissiveIntensity: 0.55,
                roughness: 0.14,
                metalness: 0.06
            });
            
            // Koyu accent (kontrol kolu, kasalar) — DEEP NAVY (eski anodDark yerine)
            const darkMat = new THREE.MeshStandardMaterial({
                color: _deepNavy,
                roughness: 0.40,
                metalness: 0.55
            });
            
            // Premium chrome accent (mafsal halkaları, vidalar) — ŞAMPANYA KROM
            const accentMat = new THREE.MeshStandardMaterial({
                color: _champagneChrome,
                roughness: 0.16,
                metalness: 0.82
            });

            // LED GLOW — AQUA-TEAL (canlı, premium emissive)
            const ledAccentMat = new THREE.MeshStandardMaterial({
                color: _aquaTeal,
                emissive: _aquaTeal,
                emissiveIntensity: 0.34,        // Klinik LED accent — düşük yoğunluk
                metalness: 0.20,
                roughness: 0.16,
                transparent: true,
                opacity: 0.30
            });
            
            // -----------------------------
            // Helpers (lokal scope)
            // -----------------------------
            function createRodBetween(a, b, radius, material) {
                const dir = new THREE.Vector3().subVectors(b, a);
                const len = dir.length();
                
                const mesh = new THREE.Mesh(
                    new THREE.CylinderGeometry(radius, radius, len, 22),
                    material
                );
                
                const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
                mesh.position.copy(mid);
                mesh.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    dir.clone().normalize()
                );
                
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                return mesh;
            }
            
            function createJoint(radius) {
                if (radius === undefined) radius = 0.062;
                const jg = new THREE.Group();
                
                // Ana eklem topu
                const joint = new THREE.Mesh(
                    new THREE.SphereGeometry(radius, 28, 28),
                    jointMat
                );
                joint.castShadow = true;
                joint.receiveShadow = true;
                jg.add(joint);
                
                // Eklem etrafı rafine halka (medikal mühendislik)
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(radius * 0.96, radius * 0.06, 8, 24),
                    accentMat
                );
                ring.rotation.x = Math.PI / 2;
                jg.add(ring);

                // === V2 LED GLOW halka (turkuaz — cihazlarla uyum) ===
                const ledGlow = new THREE.Mesh(
                    new THREE.TorusGeometry(radius * 1.08, radius * 0.03, 8, 24),
                    ledAccentMat
                );
                ledGlow.rotation.x = Math.PI / 2;
                jg.add(ledGlow);
                
                return jg;
            }
            
            function createPetalModule() {
                const pg = new THREE.Group();
                
                // Outer petal shell — rafine oval
                const shell = new THREE.Mesh(
                    new THREE.SphereGeometry(0.135, 32, 32),
                    bodyMat
                );
                shell.scale.set(1.65, 0.88, 0.32);
                shell.position.set(0.145, 0, 0);
                shell.castShadow = true;
                shell.receiveShadow = true;
                pg.add(shell);
                
                // Inner light surface (daha rafine, daha dolu)
                const inner = new THREE.Mesh(
                    new THREE.SphereGeometry(0.118, 28, 28),
                    innerMat
                );
                inner.scale.set(1.42, 0.74, 0.16);
                inner.position.set(0.145, 0, 0.030);
                inner.castShadow = true;
                inner.receiveShadow = true;
                pg.add(inner);
                
                // Petal kenar trim — ince premium çerçeve
                const trim = new THREE.Mesh(
                    new THREE.TorusGeometry(0.14, 0.005, 6, 28),
                    trimMat
                );
                trim.scale.set(1.42, 0.74, 1.0);
                trim.position.set(0.145, 0, 0.040);
                pg.add(trim);
                
                // Petal base collar (modernize edildi)
                const collar = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.040, 0.054, 0.034, 22),
                    trimMat
                );
                collar.rotation.z = Math.PI / 2;
                collar.position.set(-0.018, 0, 0);
                collar.castShadow = true;
                collar.receiveShadow = true;
                pg.add(collar);
                
                // Collar accent halka
                const collarRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.046, 0.003, 6, 18),
                    accentMat
                );
                collarRing.rotation.y = Math.PI / 2;
                collarRing.position.set(-0.001, 0, 0);
                pg.add(collarRing);
                
                // LED lensler — daha rafine 14 LED düzeni
                // (öncekinden daha düzenli, artmış sayıda)
                const ledPoints = [
                    [0.040, -0.060], [0.090, -0.060], [0.140, -0.060], [0.190, -0.060],
                    [0.020, -0.020], [0.070, -0.020], [0.120, -0.020], [0.170, -0.020], [0.220, -0.020],
                    [0.040, 0.020], [0.090, 0.020], [0.140, 0.020], [0.190, 0.020],
                    [0.080, 0.060], [0.140, 0.060]
                ];
                
                ledPoints.forEach(function(pt) {
                    // LED çerçeve halkası (krom - rafine)
                    const frame = new THREE.Mesh(
                        new THREE.TorusGeometry(0.0125, 0.0014, 4, 12),
                        accentMat
                    );
                    frame.rotation.x = Math.PI / 2;
                    frame.position.set(pt[0], pt[1], 0.060);
                    pg.add(frame);
                    
                    // LED lens (soğuk-nötr)
                    const led = new THREE.Mesh(
                        new THREE.SphereGeometry(0.0118, 14, 14),
                        lensMat
                    );
                    led.scale.set(1, 1, 0.55);
                    led.position.set(pt[0], pt[1], 0.062);
                    pg.add(led);
                });
                
                return pg;
            }
            
            function createPetalLampHead() {
                const head = new THREE.Group();
                
                // ===== CENTRAL HUB - daha premium 3 katmanlı =====
                // Ana hub (geniş) — %20 büyütüldü
                const hub = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.115, 0.145, 0.072, 32),
                    trimMat
                );
                hub.rotation.x = Math.PI / 2;
                hub.castShadow = true;
                hub.receiveShadow = true;
                head.add(hub);
                
                // Hub orta katman (satin metal)
                const hubMid = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.085, 0.092, 0.038, 28),
                    accentMat
                );
                hubMid.rotation.x = Math.PI / 2;
                hubMid.position.z = 0.022;
                head.add(hubMid);

                // === V2 LED ACCENT HALKA (hub etrafı — turkuaz, cihazlarla uyum) ===
                const hubLedRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.118, 0.0042, 10, 36),
                    ledAccentMat
                );
                hubLedRing.position.z = 0.005;
                hubLedRing.castShadow = false;
                hubLedRing.receiveShadow = false;
                head.add(hubLedRing);
                // İkinci halka (premium dual-LED)
                const hubLedRing2 = new THREE.Mesh(
                    new THREE.TorusGeometry(0.135, 0.0030, 8, 32),
                    ledAccentMat
                );
                hubLedRing2.position.z = -0.030;
                head.add(hubLedRing2);
                
                // Hub iç dark cap (mekanik detay)
                const hubCap = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.062, 0.072, 0.058, 28),
                    darkMat
                );
                hubCap.rotation.x = Math.PI / 2;
                hubCap.position.z = 0.030;
                head.add(hubCap);
                
                // Hub ön çıkıntı (zarif krom merkez)
                const hubFront = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.040, 0.045, 0.024, 24),
                    trimMat
                );
                hubFront.rotation.x = Math.PI / 2;
                hubFront.position.z = 0.060;
                head.add(hubFront);
                
                // Hub merkez LED (aktif gösterge)
                const hubCenterLed = new THREE.Mesh(
                    new THREE.SphereGeometry(0.014, 12, 12),
                    lensMat
                );
                hubCenterLed.position.z = 0.075;
                head.add(hubCenterLed);
                
                // ===== 7 PETAL — biraz daha geniş radius =====
                const petalCount = 7;
                const radius = 0.235; // v9.5 mikro rötuş — petaller daha bütünleşik
                
                for (let i = 0; i < petalCount; i++) {
                    const petal = createPetalModule();
                    const a = (Math.PI * 2 / petalCount) * i;
                    
                    petal.position.set(
                        Math.cos(a) * radius,
                        Math.sin(a) * radius,
                        0
                    );
                    petal.rotation.z = a;
                    head.add(petal);
                }
                
                // ===== STERİL HANDLE — daha şık premium 5 katmanlı =====
                // Handle bağlantı diski (krom)
                const handleBase = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.028, 0.028, 0.012, 22),
                    trimMat
                );
                handleBase.rotation.x = Math.PI / 2;
                handleBase.position.set(0, 0, 0.094);
                head.add(handleBase);
                
                // Handle ana çubuk (ince zarif krom)
                const handle = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.020, 0.020, 0.20, 22),
                    trimMat
                );
                handle.rotation.x = Math.PI / 2;
                handle.position.set(0, 0, 0.205);
                handle.castShadow = true;
                handle.receiveShadow = true;
                head.add(handle);
                
                // Handle ergonomik orta grip (siyah lastik tutuş)
                const handleGrip = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.024, 0.024, 0.10, 24),
                    darkMat
                );
                handleGrip.rotation.x = Math.PI / 2;
                handleGrip.position.set(0, 0, 0.225);
                handleGrip.castShadow = true;
                handleGrip.receiveShadow = true;
                head.add(handleGrip);
                
                // Grip dik şerit vurguları (4 yan)
                for (let i = 0; i < 4; i++) {
                    const a = (Math.PI / 2) * i;
                    const stripe = new THREE.Mesh(
                        new THREE.BoxGeometry(0.0024, 0.060, 0.0048),
                        accentMat
                    );
                    stripe.position.set(
                        Math.cos(a) * 0.024,
                        Math.sin(a) * 0.024,
                        0.225
                    );
                    stripe.rotation.z = a;
                    head.add(stripe);
                }
                
                // Handle uç (premium krom küre)
                const handleTip = new THREE.Mesh(
                    new THREE.SphereGeometry(0.026, 22, 22),
                    accentMat
                );
                handleTip.position.set(0, 0, 0.290);
                head.add(handleTip);
                
                // ===== ARKA TAŞIYICI BACKPLATE (v9.5 mikro rötuş) =====
                // Petalleri arkadan birleştiren geniş ince plate
                // — başlık birleşik modüler LED başlık olarak okunur
                const rearDisc = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.36, 0.36, 0.014, 40),
                    bodyMat
                );
                rearDisc.rotation.x = Math.PI / 2;
                rearDisc.position.z = -0.018;
                head.add(rearDisc);
                
                // Backplate dış rim ring (ince premium çerçeve)
                const rearRimOuter = new THREE.Mesh(
                    new THREE.TorusGeometry(0.36, 0.005, 6, 44),
                    accentMat
                );
                rearRimOuter.rotation.x = Math.PI / 2;
                rearRimOuter.position.z = -0.011;
                head.add(rearRimOuter);
                
                // Backplate iç rim ring (petal merkezleri etrafında)
                const rearRimInner = new THREE.Mesh(
                    new THREE.TorusGeometry(0.235, 0.003, 5, 36),
                    trimMat
                );
                rearRimInner.rotation.x = Math.PI / 2;
                rearRimInner.position.z = -0.008;
                head.add(rearRimInner);
                
                // Arka karbon detay halka (premium mekanik vurgu)
                const rearAccent = new THREE.Mesh(
                    new THREE.TorusGeometry(0.30, 0.0025, 4, 32),
                    darkMat
                );
                rearAccent.rotation.x = Math.PI / 2;
                rearAccent.position.z = -0.012;
                head.add(rearAccent);
                
                // Lamp face orientation
                head.rotation.x = Math.PI / 2;
                
                return head;
            }
            
            function createLampArm(side) {
                const ag = new THREE.Group();
                
                // Kollar — biraz daha güçlü ama zarif geometri
                // Pozisyonlar büyütülmüş başlık için ayarlandı
                const p0 = new THREE.Vector3(0, -0.18, 0);
                const p1 = new THREE.Vector3(side * 1.00, -0.18, 0);
                const p2 = new THREE.Vector3(side * 1.22, -0.46, 0);
                const p3 = new THREE.Vector3(side * 1.22, -1.04, 0);
                const p4 = new THREE.Vector3(side * 0.78, -1.26, side * 0.02);
                
                // Ana kollar (4 segment - biraz daha kalın)
                ag.add(createRodBetween(p0, p1, 0.044, bodyMat));
                ag.add(createRodBetween(p1, p2, 0.041, bodyMat));
                ag.add(createRodBetween(p2, p3, 0.046, bodyMat));
                ag.add(createRodBetween(p3, p4, 0.036, bodyMat));
                
                // İkincil destek çubuğu (premium articulated)
                const s1 = new THREE.Vector3(side * 0.82, -0.18, 0);
                const s2 = new THREE.Vector3(side * 1.10, -0.45, 0);
                ag.add(createRodBetween(s1, s2, 0.020, trimMat));
                
                // Ek üçüncü destek (alt segment için)
                const t1 = new THREE.Vector3(side * 1.22, -0.78, 0);
                const t2 = new THREE.Vector3(side * 1.10, -0.92, 0);
                ag.add(createRodBetween(t1, t2, 0.014, accentMat));
                
                // Eklem topları (4 mafsal — biraz büyütüldü)
                const jointPoints = [p1, p2, p3, p4];
                jointPoints.forEach(function(p, i) {
                    const j = createJoint(i === 3 ? 0.056 : 0.062);
                    j.position.copy(p);
                    ag.add(j);
                });
                
                // Dikey iniş manşonu (biraz uzatıldı)
                const sleeve = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.054, 0.054, 0.30, 22),
                    trimMat
                );
                sleeve.position.copy(p3.clone().lerp(p4, 0.20));
                sleeve.castShadow = true;
                sleeve.receiveShadow = true;
                ag.add(sleeve);
                
                // Manşon detay halka (medikal mühendislik)
                const sleeveRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.056, 0.004, 6, 22),
                    accentMat
                );
                sleeveRing.rotation.x = Math.PI / 2;
                sleeveRing.position.copy(p3.clone().lerp(p4, 0.20));
                ag.add(sleeveRing);
                
                // Petal başlık
                const head = createPetalLampHead();
                head.position.copy(p4);
                head.rotation.z = side === -1 ? -0.12 : 0.12;
                head.rotation.y = side === -1 ? 0.06 : -0.06;
                head.rotation.x = Math.PI / 2 + 0.32;
                ag.add(head);
                
                return ag;
            }
            
            // -----------------------------
            // CEILING MOUNT — daha güçlü premium
            // -----------------------------
            // Ana ceiling base (geniş, premium)
            const ceilingBase = new THREE.Mesh(
                new THREE.CylinderGeometry(0.30, 0.38, 0.13, 40),
                bodyMat
            );
            ceilingBase.castShadow = true;
            ceilingBase.receiveShadow = true;
            rig.add(ceilingBase);
            
            // Ceiling base trim (üst zarif halka)
            const ceilingTrimTop = new THREE.Mesh(
                new THREE.TorusGeometry(0.31, 0.012, 10, 52),
                trimMat
            );
            ceilingTrimTop.rotation.x = Math.PI / 2;
            ceilingTrimTop.position.y = -0.052;
            rig.add(ceilingTrimTop);
            
            // Alt rafine halka (premium detay)
            const ceilingTrimBot = new THREE.Mesh(
                new THREE.TorusGeometry(0.32, 0.006, 8, 48),
                accentMat
            );
            ceilingTrimBot.rotation.x = Math.PI / 2;
            ceilingTrimBot.position.y = -0.078;
            rig.add(ceilingTrimBot);
            
            // Ana taşıyıcı kolon (daha rafine)
            const centerColumn = new THREE.Mesh(
                new THREE.CylinderGeometry(0.072, 0.090, 0.28, 28),
                trimMat
            );
            centerColumn.position.y = -0.20;
            centerColumn.castShadow = true;
            centerColumn.receiveShadow = true;
            rig.add(centerColumn);
            
            // Kolon orta detay halkası
            const columnRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.082, 0.004, 6, 28),
                accentMat
            );
            columnRing.rotation.x = Math.PI / 2;
            columnRing.position.y = -0.20;
            rig.add(columnRing);
            
            // Alt hub (genişletildi, daha güçlü)
            const lowerHub = new THREE.Mesh(
                new THREE.CylinderGeometry(0.118, 0.140, 0.068, 28),
                bodyMat
            );
            lowerHub.position.y = -0.36;
            lowerHub.castShadow = true;
            lowerHub.receiveShadow = true;
            rig.add(lowerHub);
            
            // Alt hub merkez disk (mekanik detay - kolların çıkış noktası)
            const lowerHubInner = new THREE.Mesh(
                new THREE.CylinderGeometry(0.090, 0.105, 0.040, 26),
                darkMat
            );
            lowerHubInner.position.y = -0.378;
            rig.add(lowerHubInner);
            
            // Alt hub aktif sistem LED (yeşil küçük gösterge)
            const systemLed = new THREE.Mesh(
                new THREE.SphereGeometry(0.006, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: 0x4cb88a,
                    emissive: 0x4cb88a,
                    emissiveIntensity: 0.55
                })
            );
            systemLed.position.set(0.090, -0.378, 0);
            rig.add(systemLed);
            
            // İki ayrı çok eklemli taşıyıcı kol
            rig.add(createLampArm(-1));
            rig.add(createLampArm(1));
            
            // Tüm meshlerde shadow flag'leri
            rig.traverse(function(obj) {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });
            
            return rig;
        }

        function buildAnaesth(x, y, z) { 
            const g = groupAt(x, y, z); 
            g.add(box(0.82, 1.34, 0.58, 0x36495e, 0, 0.68, 0, { roughness: 0.42 }));
            g.add(box(0.58, 0.24, 0.05, 0x101820, 0, 1.12, 0.31));
            const scr = box(0.48, 0.15, 0.015, 0x5cc4d6, 0, 1.12, 0.345, { emissive: 0x5cc4d6, emissiveIntensity: 0.38 }); g.add(scr); addAnimated(scr,'pulse',{speed:2.1,base:.22,amp:.25});
            g.add(box(0.22,0.18,0.12,-0x1,0,0,0));
            g.children.pop();
            g.add(box(0.18, 0.16, 0.14, 0x4d5d6b, -0.22, 0.78, 0.32, { roughness:0.36 }));
            g.add(box(0.18, 0.16, 0.14, 0x4d5d6b, 0.02, 0.78, 0.32, { roughness:0.36 }));
            g.add(box(0.18, 0.16, 0.14, 0x4d5d6b, 0.26, 0.78, 0.32, { roughness:0.36 }));
            g.add(cyl(0.12,0.12,0.38,0x607d90,-0.26,1.46,0,{seg:18,metalness:.2,roughness:.42}));
            g.add(cyl(0.12,0.12,0.38,0x607d90,0.26,1.46,0,{seg:18,metalness:.2,roughness:.42}));
            g.add(cyl(0.018,0.018,0.52,0xb8c7d3,0.34,1.18,-0.06,{seg:10,metalness:.28,roughness:.28}));
            g.add(cyl(0.016,0.016,0.42,0xb8c7d3,0.22,1.02,-0.10,{seg:10,metalness:.28,roughness:.28}));
            [-0.26,0.26].forEach(xx => [-0.18,0.18].forEach(zz => {
                const wheel = cyl(0.04,0.04,0.03,0x4b5560,xx,0.03,zz,{seg:12,roughness:.56});
                wheel.rotation.z=Math.PI/2; g.add(wheel);
            }));
            return g; 
        }
        function buildTrolley(x, y, z) { 
            const g = groupAt(x, y, z);
            g.add(box(1.08, 0.045, 0.64, 0xe8eef5, 0, 0.92, 0, { metalness: 0.35, roughness: 0.28 }));
            g.add(box(1.08, 0.04, 0.64, 0xe8eef5, 0, 0.48, 0, { metalness: 0.35, roughness: 0.28 }));
            [-0.48,0.48].forEach(xx => [-0.26,0.26].forEach(zz => {
                g.add(cyl(0.02,0.02,0.92,0x92a4b4,xx,0.46,zz,{seg:10,metalness:.35,roughness:.28}));
                const wheel = cyl(0.04,0.04,0.03,0x4b5560,xx,0.03,zz,{seg:12,roughness:.56});
                wheel.rotation.z=Math.PI/2; g.add(wheel);
            }));
            for (let i=-2;i<=2;i++) g.add(box(0.12,0.025,0.42,0x506070,i*0.18,0.98,0,{metalness:.45,roughness:.2}));
            // instrument packs
            g.add(box(0.30,0.05,0.18,0xcfe9ef,-0.24,1.01,-0.14,{roughness:.36}));
            g.add(box(0.26,0.04,0.16,0xd9f1f4,0.05,1.00,0.10,{roughness:.36}));
            g.add(box(0.18,0.04,0.18,0xf0f3f6,0.28,1.00,-0.04,{roughness:.38}));
            g.add(box(0.82, 0.025, 0.50, 0x5cc4d6, 0, 1.005, 0, { transparent: true, opacity: 0.08, emissive: 0x5cc4d6, emissiveIntensity: 0.05 }));
            return g; 
        }
        function buildDrain(x, y, z) {
            // PREMIUM SURGICAL DRAIN v2 — Jackson-Pratt / Hemovac stili
            const g = groupAt(x, y, z);
            // Drenaj tüpü (saydam silikon)
            const tube = cyl(0.012, 0.012, 1.05, 0xc7dbe6, 0, 0.58, 0, { transparent: true, opacity: 0.55, seg: 10, emissive: 0x88c9e0, emissiveIntensity: 0.10 });
            g.add(tube);
            // Toplama haznesi (kırmızı sıvı + cam)
            g.add(sphere(0.13, 0xc7dbe6, 0, 0.18, 0, { transparent: true, opacity: 0.40, emissive: 0x88c9e0, emissiveIntensity: 0.10 }));
            // İç kan sıvısı (kırmızı, %60 dolu)
            g.add(sphere(0.10, 0xe04646, 0, 0.16, 0, { metalness: 0.10, roughness: 0.40, emissive: 0xe04646, emissiveIntensity: 0.30, transparent: true, opacity: 0.85 }));
            // Üst krom konnektör + valf
            g.add(cyl(0.018, 0.018, 0.024, 0xb6bfc8, 0, 0.30, 0, { seg: 14, metalness: 0.78, roughness: 0.16 }));
            g.add(cyl(0.024, 0.024, 0.014, 0x222a33, 0, 0.26, 0, { seg: 14, metalness: 0.55, roughness: 0.30 }));
            // Hacim ölçek (yan dikey LED şerit — kırmızı seviye göstergesi)
            g.add(box(0.005, 0.10, 0.005, 0xe04646, 0.10, 0.18, 0, { emissive: 0xe04646, emissiveIntensity: 0.85 }));
            // Etiket plakası (turkuaz LED)
            g.add(box(0.040, 0.012, 0.005, 0x2dd4bf, 0, 0.10, 0.13, { emissive: 0x2dd4bf, emissiveIntensity: 0.65 }));
            return g;
        }

        function buildCountBoard(x, y, z) {
            const g = groupAt(x, y, z);
            // Mobile count verification station with wide base, wheels and side ledge.
            g.add(box(0.84, 0.06, 0.42, 0x5a6f82, 0, 0.52, 0, { metalness: 0.20, roughness: 0.38 }));
            g.add(box(0.74, 0.03, 0.32, 0xe9eef3, 0, 0.57, 0, { roughness: 0.78 }));
            [-0.28,0.28].forEach(xx => [-0.14,0.14].forEach(zz => {
                g.add(cyl(0.026, 0.026, 0.48, 0xa6b6c3, xx, 0.26, zz, { seg: 12, metalness: 0.32, roughness: 0.28 }));
                const w = cyl(0.042,0.042,0.03,0x4f5963,xx,0.04,zz,{seg:12,roughness:0.56}); w.rotation.z=Math.PI/2; g.add(w);
            }));
            g.add(box(1.10, 0.80, 0.06, 0xe8edf1, 0, 1.02, 0, { metalness: 0.16, roughness: 0.30 }));
            g.add(box(0.98, 0.68, 0.024, 0x0c1620, 0, 1.02, 0.024, { roughness: 0.12, emissive: 0x102131, emissiveIntensity: 0.22 }));
            g.add(box(0.92, 0.10, 0.012, 0x17384a, 0, 1.30, 0.040, { emissive: 0x2aaec1, emissiveIntensity: 0.18, roughness: 0.22 }));
            g.add(box(0.24, 0.058, 0.014, 0x2aaec1, -0.32, 1.30, 0.044, { emissive: 0x59d5df, emissiveIntensity: 0.30, roughness: 0.18 }));
            g.add(box(0.18, 0.042, 0.014, 0x24485d, 0.36, 1.30, 0.044, { roughness: 0.18 }));
            [1.12, 0.94, 0.76].forEach(yy => g.add(box(0.88, 0.007, 0.008, 0x41566a, 0, yy, 0.040, { roughness: 0.22 })));
            [-0.22, 0.08, 0.34].forEach(xx => g.add(box(0.006, 0.44, 0.008, 0x32485b, xx, 0.90, 0.040, { roughness: 0.22 })));
            [1.03, 0.86, 0.69].forEach((yy, i) => {
                const colors = [0x58c49a, 0xe0a558, 0x58c49a];
                g.add(sphere(0.028, colors[i], -0.40, yy, 0.048, { emissive: colors[i], emissiveIntensity: 0.36 }));
                g.add(box(0.19, 0.044, 0.012, 0xeef3f7, -0.22, yy, 0.045, { roughness: 0.82 }));
                g.add(box(0.19, 0.044, 0.012, 0xd9e4ec, 0.04, yy, 0.045, { roughness: 0.72 }));
                g.add(box(0.18, 0.044, 0.012, 0x163041, 0.31, yy, 0.045, { roughness: 0.12, emissive: 0x163041, emissiveIntensity: 0.12 }));
            });
            g.add(box(0.24, 0.058, 0.012, 0x1f3443, -0.24, 0.58, 0.044, { roughness: 0.14 }));
            g.add(box(0.24, 0.058, 0.012, 0x1f3443, 0.06, 0.58, 0.044, { roughness: 0.14 }));
            g.add(box(0.22, 0.058, 0.012, 0x58c49a, 0.34, 0.58, 0.044, { emissive: 0x58c49a, emissiveIntensity: 0.20, roughness: 0.18 }));
            g.add(box(0.18, 0.26, 0.02, 0xeff4f7, 0.64, 0.98, 0.02, { roughness: 0.72 }));
            g.add(box(0.14, 0.02, 0.014, 0x9fb8c8, 0.64, 1.08, 0.04, { roughness: 0.22 }));
            return g;
        }

        function buildSpecimenCup(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(cyl(0.12,0.10,0.20,0xe8eef5,0,0.12,0,{transparent:true,opacity:.55,seg:20}));
            g.add(box(0.28,0.055,0.15,0xe0a558,0,0.26,0,{roughness:.45}));
            g.add(box(0.22,0.055,0.01,0x08111f,0,0.26,0.083,{emissive:0x222222,emissiveIntensity:.05}));
            return g;
        }

        function buildPortableCArm(x, y, z) {
            const g = groupAt(x, y, z);
            g.add(box(0.78, 0.20, 0.56, 0x4b6378, 0, 0.28, 0, { roughness: 0.42 }));
            g.add(box(0.54, 0.16, 0.42, 0x567085, 0.02, 0.48, 0, { roughness: 0.38 }));
            g.add(box(0.40, 0.15, 0.03, 0x101820, 0.02, 0.52, 0.24, { roughness: 0.18 }));
            g.add(box(0.30, 0.09, 0.015, 0xb9dedf, 0.02, 0.52, 0.265, { emissive: 0x9ad7da, emissiveIntensity: 0.22 }));
            const mast = cyl(0.05, 0.05, 1.05, 0xa7b7c4, 0.20, 0.82, 0, { seg: 16, metalness: 0.28, roughness: 0.30 });
            g.add(mast);
            const armCenterX = -0.05;
            const armCenterY = 1.18;
            const armCenterZ = 0;
            const ringMat = mat(0xe8eef5, { metalness: 0.34, roughness: 0.22, emissive: 0xd6ecf2, emissiveIntensity: 0.10 });
            const outer = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.055, 18, 48, Math.PI * 1.25), ringMat);
            outer.rotation.z = Math.PI / 2;
            outer.position.set(armCenterX, armCenterY, armCenterZ);
            prepMesh(outer); g.add(outer);
            const detector = box(0.24, 0.20, 0.06, 0xdfe9f0, armCenterX - 0.34, armCenterY + 0.15, 0, { metalness: 0.20, roughness: 0.28 });
            const tube = box(0.20, 0.20, 0.20, 0x53697d, armCenterX + 0.33, armCenterY + 0.15, 0, { metalness: 0.18, roughness: 0.36 });
            g.add(detector); g.add(tube);
            g.add(cyl(0.03, 0.03, 0.60, 0x9aabb8, 0.12, 1.06, 0, { seg: 12, metalness: 0.26, roughness: 0.30 }));
            [-0.24,0.24].forEach(xx => [-0.18,0.18].forEach(zz => {
                const wheel = cyl(0.045,0.045,0.03,0x4b5560,xx,0.03,zz,{seg:12,roughness:.56});
                wheel.rotation.z = Math.PI/2; g.add(wheel);
            }));
            return g;
        }

        function buildESUCart(x, y, z) {
            const g = groupAt(x,y,z);
            g.add(box(0.54,0.12,0.40,0x5a7084,0,0.82,0,{roughness:.32}));
            g.add(box(0.46,0.20,0.34,0xe5edf3,0,1.10,0,{metalness:.12,roughness:.28}));
            g.add(box(0.24,0.08,0.015,0x0e1821,0,1.16,0.17,{roughness:.14}));
            g.add(box(0.18,0.05,0.01,0xb7f2ff,0,1.16,0.19,{emissive:0x84dbe5,emissiveIntensity:.30}));
            [-0.18,0.18].forEach(xx=>[-0.13,0.13].forEach(zz=>{ const w=cyl(0.04,0.04,0.03,0x4f5963,xx,0.04,zz,{seg:12}); w.rotation.z=Math.PI/2; g.add(w);}));
            const cable = new THREE.Mesh(new THREE.TorusGeometry(0.18,0.012,8,30,Math.PI*0.8), mat(0x566c7b,{roughness:.45}));
            cable.rotation.x = Math.PI/2; cable.rotation.z = Math.PI*0.15; cable.position.set(0.10,0.72,0.12); prepMesh(cable); g.add(cable);
            g.add(box(0.16,0.015,0.11,0xd9c59a,0.28,0.14,0.15,{roughness:.65}));
            return g;
        }

        function buildSuctionSmokeUnit(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(box(0.46,0.12,0.34,0x506476,0,0.86,0,{roughness:.35}));
            g.add(box(0.38,0.28,0.28,0xe6edf4,0,1.12,0,{metalness:.10,roughness:.26}));
            g.add(box(0.22,0.07,0.012,0x0f1821,0,1.21,0.145,{}));
            g.add(box(0.14,0.04,0.008,0xc9f0f2,0,1.21,0.16,{emissive:0x8ad8dc,emissiveIntensity:.26}));
            const hose = new THREE.Mesh(new THREE.TorusKnotGeometry(0.14,0.015,48,8,2,3), mat(0xa3b0b8,{roughness:.52}));
            hose.scale.set(1.0,1.5,0.55); hose.rotation.x = Math.PI/2; hose.position.set(0.12,1.18,0.10); prepMesh(hose); g.add(hose);
            g.add(cyl(0.05,0.05,0.42,0xa2b2bd,0.14,1.42,0.06,{seg:12}));
            [-0.15,0.15].forEach(xx=>[-0.10,0.10].forEach(zz=>{ const w=cyl(0.035,0.035,0.03,0x4f5963,xx,0.04,zz,{seg:12}); w.rotation.z=Math.PI/2; g.add(w);}));
            return g;
        }

        function buildRadiationSafetySet(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(cyl(0.03,0.03,1.55,0xadb8c5,-0.22,0.78,0,{seg:12}));
            g.add(box(0.34,0.58,0.05,0x556d7e,-0.22,1.08,0,{roughness:.38}));
            g.add(box(0.15,0.12,0.04,0x7a8793,-0.22,1.42,0,{roughness:.40}));
            g.add(box(0.09,0.16,0.03,0x556d7e,-0.22,1.25,0.08,{roughness:.36}));
            g.add(box(0.24,0.32,0.03,0x2e3439,0.25,0.78,0,{roughness:.36}));
            g.add(box(0.18,0.22,0.01,0xffeb7a,0.25,0.82,0.018,{emissive:0xe8c94d,emissiveIntensity:.22}));
            return g;
        }

        /* ===================== İO-4: Laparoskopi build fonksiyonları =====================
         * buildLaparoscopicTower: kamera kontrol ünitesi + ışık kaynağı + insüflator
         *                         + kayıt cihazı + üstte primer cerrah monitörü.
         *                         Standart laparoskopi kulesi yerleşimi (4-5 modül + ekran).
         * buildCO2Tank:           Yeşil CO₂ tüpü (Türkiye'de tıbbi gaz renk kodu = yeşil değil
         *                         beyaz; ancak laparoskopik insüflasyon tüpleri klinik pratikte
         *                         genellikle gri/beyaz arası bir renk olur — burada "CO₂"
         *                         etiketli, koyu açık-gri tonu kullandım, yanıltıcı renk yok).
         *                         Üstte regülatör + manometre.
         * buildSecondaryLapMonitor: head-end yakını duvar montajlı ikinci ekran (anestezi ekibi
         *                         + asistan görüş hattı için). Boom kolu yok; düz duvar ekranı.
         */
        function buildLaparoscopicTower(x,y,z) {
            const g = groupAt(x,y,z);
            // Tabanlı tekerlekli kart
            g.add(box(0.62,0.10,0.50,0x3b4754,0,0.12,0,{roughness:.36}));
            // 4 raflı dikey strüktür (her raf bir modül)
            // Raf 1 (en alt): Kayıt cihazı / DVR
            g.add(box(0.56,0.18,0.44,0xdde4ec,0,0.30,0,{metalness:.10,roughness:.26}));
            g.add(box(0.40,0.04,0.012,0x0a121b,0,0.30,0.225,{}));
            g.add(box(0.10,0.025,0.008,0x2dd4bf,-0.18,0.30,0.232,{emissive:0x1ea48c,emissiveIntensity:.34}));
            // Raf 2: İnsüflator (CO₂ akış göstergesi)
            g.add(box(0.56,0.16,0.44,0xe6ecf3,0,0.50,0,{metalness:.10,roughness:.26}));
            g.add(box(0.34,0.10,0.012,0x0a121b,0,0.50,0.225,{}));
            g.add(box(0.14,0.06,0.008,0x60a5fa,-0.08,0.50,0.232,{emissive:0x3b82f6,emissiveIntensity:.40}));
            g.add(cyl(0.018,0.018,0.05,0xb8c2cc,0.20,0.50,0.225,{seg:12}));
            // Raf 3: Işık kaynağı (Xenon/LED)
            g.add(box(0.56,0.16,0.44,0xdde4ec,0,0.70,0,{metalness:.10,roughness:.26}));
            g.add(box(0.10,0.10,0.018,0xfff7c2,-0.18,0.70,0.225,{emissive:0xfde047,emissiveIntensity:.55}));
            g.add(box(0.20,0.04,0.012,0x0a121b,0.04,0.70,0.225,{}));
            // Raf 4: Kamera kontrol ünitesi (CCU)
            g.add(box(0.56,0.16,0.44,0xe6ecf3,0,0.90,0,{metalness:.10,roughness:.26}));
            g.add(box(0.16,0.08,0.012,0x0a121b,-0.10,0.90,0.225,{}));
            g.add(box(0.10,0.03,0.008,0xf472b6,-0.10,0.92,0.232,{emissive:0xec4899,emissiveIntensity:.32}));
            // Üstte primer cerrah monitörü (büyük, geniş ekran)
            g.add(box(0.66,0.42,0.04,0x12181f,0,1.30,0,{roughness:.18}));
            g.add(box(0.60,0.36,0.01,0x9ad7da,0,1.30,0.022,{emissive:0x5fc7cd,emissiveIntensity:.36}));
            // Monitör askı kolu
            g.add(cyl(0.02,0.02,0.18,0x6f7c8a,0,1.10,0,{seg:12}));
            // Yan kablo demeti (insüflasyon hortumu + kamera kablosu)
            const hose = new THREE.Mesh(new THREE.TorusGeometry(0.16,0.014,8,28,Math.PI*0.9), mat(0x9aa7b3,{roughness:.50}));
            hose.rotation.x = Math.PI/2; hose.rotation.z = Math.PI*0.20; hose.position.set(0.22,0.42,0.18); prepMesh(hose); g.add(hose);
            // Tekerlekler
            [-0.22,0.22].forEach(xx=>[-0.18,0.18].forEach(zz=>{ const w=cyl(0.045,0.045,0.03,0x4b5560,xx,0.04,zz,{seg:12}); w.rotation.z=Math.PI/2; g.add(w);}));
            return g;
        }

        function buildCO2Tank(x,y,z) {
            const g = groupAt(x,y,z);
            // Tüp gövde (gri-beyaz, klinik tıbbi gaz tüp tonu)
            g.add(cyl(0.13,0.13,1.05,0xc8ccd0,0,0.55,0,{seg:20,metalness:.18,roughness:.32}));
            // Tüp tabanı (siyah halka)
            g.add(cyl(0.135,0.135,0.04,0x232a32,0,0.04,0,{seg:20,roughness:.50}));
            // Üst dome (omuz)
            g.add(cyl(0.13,0.08,0.10,0xc8ccd0,0,1.13,0,{seg:20,metalness:.20,roughness:.30}));
            // Boyun
            g.add(cyl(0.04,0.04,0.06,0x9aa3ac,0,1.21,0,{seg:14,metalness:.28,roughness:.26}));
            // Vana gövdesi (pirinç)
            g.add(box(0.10,0.07,0.10,0xb89968,0,1.27,0,{metalness:.42,roughness:.34}));
            // Vana volanı
            g.add(cyl(0.045,0.045,0.02,0x6e2e2e,0.04,1.31,0,{seg:14}));
            // Manometre (yuvarlak gösterge)
            g.add(cyl(0.05,0.05,0.018,0x1a1f24,-0.08,1.27,0.04,{seg:18,roughness:.30}));
            g.add(cyl(0.04,0.04,0.005,0xf5f5f5,-0.08,1.27,0.052,{seg:18}));
            // CO₂ etiket panosu (yeşil değil, beyaz/sarı klinik etiket)
            g.add(box(0.16,0.08,0.005,0xfafafa,0,0.90,0.131,{roughness:.30}));
            g.add(box(0.10,0.04,0.002,0x1a1f24,0,0.90,0.134,{}));
            // Ön çıkış basınç hortumu (kuleye giden)
            const out = new THREE.Mesh(new THREE.TorusGeometry(0.10,0.010,8,24,Math.PI*0.6), mat(0x4b5560,{roughness:.55}));
            out.rotation.x = Math.PI/2; out.rotation.z = -Math.PI*0.25; out.position.set(0.12,1.25,0.04); prepMesh(out); g.add(out);
            // Zincir bağlama (duvar/tekerlekli arabaya sabitleme — emniyet)
            g.add(box(0.30,0.012,0.012,0xa0a0a0,0,0.78,0.13,{metalness:.50,roughness:.40}));
            return g;
        }

        function buildSecondaryLapMonitor(x,y,z) {
            const g = groupAt(x,y,z);
            // Duvar bağlantı plakası
            g.add(box(0.16,0.16,0.03,0x556272,0,0,-0.04,{roughness:.40}));
            // Kısa askı kolu
            g.add(box(0.06,0.06,0.16,0x6f7c8a,0,0,0.06,{roughness:.32}));
            // Monitör çerçeve (siyah)
            g.add(box(0.58,0.36,0.04,0x12181f,0,0,0.16,{roughness:.18}));
            // Ekran (canlı görüntü emissive)
            g.add(box(0.52,0.30,0.01,0x9ad7da,0,0,0.18,{emissive:0x5fc7cd,emissiveIntensity:.34}));
            // Logo / etiket bandı
            g.add(box(0.10,0.025,0.005,0xfafafa,0,-0.16,0.183,{}));
            return g;
        }
        /* ===================== /İO-4 build fonksiyonları ===================== */

        /* ===================== İO-5: Trauma/Nöro build fonksiyonları =====================
         * Beş yeni 3D model:
         *   buildSurgicalMicroscope: Boom kollu çift okülerli cerrahi mikroskop (Zeiss Pentero tipi).
         *                            Tavandan boom kolu, çift okülerli baş, asistan tüpü, kontrol pedalı.
         *   buildCraniotomeDrill:    Yüksek hızlı kraniyotom kartı + el aletleri (turlar, perforator).
         *   buildNeuronavigationSystem: Sterotaktik nöronavigasyon kulesi, optik kamera direği,
         *                            referans çerçeve göstergesi (büyük, görünür ekran).
         *   buildRapidTransfuser:    Belmont/Level-1 tipi hızlı kan/sıvı transfüzörü, ısıtıcılı.
         *   buildRSIMedicationTray:  Hızlı sekansiyel intübasyon ilaç tepsisi (etomidat, rocuronium,
         *                            fentanyl, atropin) — anestezi tarafında, hazır vaziyette.
         */
        function buildSurgicalMicroscope(x,y,z) {
            const g = groupAt(x,y,z);
            // Tavan boom kolu (yatay, hastaya doğru uzanır)
            g.add(box(0.12,0.12,1.40,0x3b4754,0,2.30,-0.40,{roughness:.32}));
            // Boom dirseği (dik mafsal)
            g.add(cyl(0.08,0.08,0.16,0x53697d,0,2.22,0.30,{seg:14,metalness:.28,roughness:.30}));
            // Boom alt kolu (eğimli, mikroskop başına bağlanır)
            g.add(box(0.10,0.10,0.65,0x4b5560,0,2.00,0.30,{roughness:.34}));
            // Optik blok (çift göz başlığı + asistan tüpü)
            g.add(box(0.32,0.18,0.28,0xe8edf3,0,1.55,0.30,{metalness:.22,roughness:.26}));
            g.add(box(0.10,0.10,0.18,0xe8edf3,-0.20,1.55,0.30,{metalness:.22,roughness:.26}));
            // Çift okülerler (yan yana siyah silindir)
            g.add(cyl(0.038,0.038,0.10,0x12181f,-0.06,1.40,0.30,{seg:14,roughness:.18}));
            g.add(cyl(0.038,0.038,0.10,0x12181f,0.06,1.40,0.30,{seg:14,roughness:.18}));
            // Asistan tüpü (yan)
            g.add(cyl(0.034,0.034,0.18,0x12181f,0.22,1.55,0.40,{seg:14,roughness:.20}));
            // Objektif (alt, hastaya bakan)
            g.add(cyl(0.06,0.05,0.12,0x4b5560,0,1.40,0.42,{seg:18,metalness:.34,roughness:.22}));
            // Aydınlatma fiber kablo (esnek)
            const fiber = new THREE.Mesh(new THREE.TorusGeometry(0.18,0.014,8,28,Math.PI*0.7), mat(0xa3b0b8,{roughness:.50}));
            fiber.rotation.x = Math.PI/2; fiber.rotation.z = Math.PI*0.30; fiber.position.set(0.18,1.75,0.30); prepMesh(fiber); g.add(fiber);
            // Kontrol pedalı (yer seviyesinde, cerrahın ayağı altında)
            g.add(box(0.28,0.08,0.20,0x3b4754,0.25,0.04,0.50,{roughness:.40}));
            g.add(box(0.10,0.04,0.10,0x60a5fa,0.30,0.08,0.55,{emissive:0x3b82f6,emissiveIntensity:.35}));
            // LED ışık halkası (objektif çevresi)
            g.add(cyl(0.07,0.07,0.012,0xfff7c2,0,1.34,0.42,{seg:24,emissive:0xfde047,emissiveIntensity:.50}));
            return g;
        }

        function buildCraniotomeDrill(x,y,z) {
            const g = groupAt(x,y,z);
            // Kart (tekerlekli, kompakt)
            g.add(box(0.48,0.10,0.36,0x3b4754,0,0.10,0,{roughness:.34}));
            // Üst panel
            g.add(box(0.42,0.16,0.30,0xe6ecf3,0,0.26,0,{metalness:.10,roughness:.26}));
            g.add(box(0.20,0.06,0.012,0x0a121b,0,0.26,0.155,{}));
            g.add(box(0.10,0.03,0.008,0x10b981,-0.06,0.27,0.162,{emissive:0x059669,emissiveIntensity:.36}));
            // El aleti standı (kraniyotom + perforator için askılar)
            g.add(box(0.36,0.12,0.04,0xc7cdd5,0,0.40,0,{roughness:.32}));
            // Kraniyotom el aleti (yüksek hızlı tur — tabanca tipi)
            g.add(box(0.18,0.05,0.05,0xd4d8df,0,0.46,0.04,{metalness:.30,roughness:.22}));
            g.add(cyl(0.018,0.018,0.10,0x9aa7b3,0.10,0.46,0.04,{seg:12,metalness:.40,roughness:.20}));
            g.add(cyl(0.012,0.012,0.04,0xc0c0c0,0.16,0.46,0.04,{seg:12,metalness:.62,roughness:.16}));
            // Perforator (ikinci el aleti)
            g.add(box(0.16,0.045,0.045,0xd4d8df,0,0.46,-0.04,{metalness:.30,roughness:.22}));
            g.add(cyl(0.016,0.016,0.08,0x9aa7b3,0.09,0.46,-0.04,{seg:12,metalness:.40,roughness:.20}));
            // Kablo demeti
            const cable = new THREE.Mesh(new THREE.TorusGeometry(0.10,0.010,8,24,Math.PI*0.8), mat(0x4b5560,{roughness:.55}));
            cable.rotation.x = Math.PI/2; cable.position.set(-0.12,0.34,0.10); prepMesh(cable); g.add(cable);
            // Tekerlekler
            [-0.18,0.18].forEach(xx=>[-0.14,0.14].forEach(zz=>{ const w=cyl(0.038,0.038,0.025,0x4b5560,xx,0.04,zz,{seg:12}); w.rotation.z=Math.PI/2; g.add(w);}));
            return g;
        }

        function buildNeuronavigationSystem(x,y,z) {
            const g = groupAt(x,y,z);
            // Tabanlı kart
            g.add(box(0.58,0.12,0.46,0x3b4754,0,0.14,0,{roughness:.34}));
            // Kule gövde (CPU çekmeceleri)
            g.add(box(0.50,0.50,0.40,0xdde4ec,0,0.46,0,{metalness:.10,roughness:.26}));
            g.add(box(0.30,0.04,0.012,0x0a121b,0,0.32,0.205,{}));
            g.add(box(0.30,0.04,0.012,0x0a121b,0,0.46,0.205,{}));
            g.add(box(0.30,0.04,0.012,0x0a121b,0,0.60,0.205,{}));
            // Üstte büyük navigasyon ekranı (anatomik harita gösterir)
            g.add(box(0.74,0.50,0.04,0x12181f,0,1.00,0,{roughness:.18}));
            g.add(box(0.68,0.44,0.01,0xa78bfa,0,1.00,0.022,{emissive:0x8b5cf6,emissiveIntensity:.40}));
            // Optik kamera direği (yan, uzun)
            g.add(cyl(0.025,0.025,1.30,0x556272,0.40,0.94,0,{seg:14,metalness:.30,roughness:.28}));
            // Optik kamera başı (çift sensörlü)
            g.add(box(0.20,0.10,0.06,0x12181f,0.40,1.62,0,{roughness:.20}));
            g.add(cyl(0.022,0.022,0.018,0xff5e5e,0.36,1.62,0.034,{seg:14,emissive:0xee2222,emissiveIntensity:.50}));
            g.add(cyl(0.022,0.022,0.018,0xff5e5e,0.44,1.62,0.034,{seg:14,emissive:0xee2222,emissiveIntensity:.50}));
            // Tekerlekler
            [-0.22,0.22].forEach(xx=>[-0.18,0.18].forEach(zz=>{ const w=cyl(0.045,0.045,0.03,0x4b5560,xx,0.04,zz,{seg:12}); w.rotation.z=Math.PI/2; g.add(w);}));
            return g;
        }

        function buildRapidTransfuser(x,y,z) {
            const g = groupAt(x,y,z);
            // Tabanlı tekerlekli kart
            g.add(box(0.50,0.10,0.42,0x60788a,0,0.10,0,{roughness:.34}));
            // Ana ünite
            g.add(box(0.44,0.32,0.36,0xe8edf3,0,0.40,0,{metalness:.10,roughness:.26}));
            g.add(box(0.24,0.10,0.012,0x0a121b,0,0.40,0.185,{}));
            // Sıcaklık göstergesi (kırmızı = aktif ısıtma)
            g.add(box(0.10,0.04,0.008,0xff8a4c,-0.10,0.42,0.192,{emissive:0xea580c,emissiveIntensity:.45}));
            // Akış hızı göstergesi
            g.add(box(0.06,0.03,0.006,0x60a5fa,0.08,0.42,0.192,{emissive:0x3b82f6,emissiveIntensity:.40}));
            // Hortum bobinleri (üstte iki adet)
            g.add(cyl(0.06,0.06,0.04,0xa3b0b8,-0.10,0.62,0,{seg:14,metalness:.20,roughness:.32}));
            g.add(cyl(0.06,0.06,0.04,0xa3b0b8,0.10,0.62,0,{seg:14,metalness:.20,roughness:.32}));
            // IV sıvı askısı (yüksek)
            g.add(cyl(0.018,0.018,0.95,0x9aa7b3,0.20,0.96,0,{seg:12,metalness:.30,roughness:.24}));
            // Kanca
            g.add(box(0.04,0.04,0.012,0x9aa7b3,0.20,1.42,0,{metalness:.30,roughness:.24}));
            // Kan ürünü torbası (kırmızımsı)
            g.add(box(0.10,0.18,0.04,0xa01818,0.20,1.30,0,{roughness:.50}));
            // Tekerlekler
            [-0.18,0.18].forEach(xx=>[-0.16,0.16].forEach(zz=>{ const w=cyl(0.045,0.045,0.03,0x4b5560,xx,0.04,zz,{seg:12}); w.rotation.z=Math.PI/2; g.add(w);}));
            return g;
        }

        function buildRSIMedicationTray(x,y,z) {
            const g = groupAt(x,y,z);
            // Tepsi (geniş, paslanmaz)
            g.add(box(0.42,0.025,0.28,0xc0c8d0,0,0,0,{metalness:.50,roughness:.22}));
            // Tepsi kenarları
            g.add(box(0.42,0.04,0.012,0xa3b0b8,0,0.02,0.135,{metalness:.45,roughness:.25}));
            g.add(box(0.42,0.04,0.012,0xa3b0b8,0,0.02,-0.135,{metalness:.45,roughness:.25}));
            g.add(box(0.012,0.04,0.28,0xa3b0b8,0.205,0.02,0,{metalness:.45,roughness:.25}));
            g.add(box(0.012,0.04,0.28,0xa3b0b8,-0.205,0.02,0,{metalness:.45,roughness:.25}));
            // 4 ilaç şırıngası (renk kodlu — RSI ilaçları)
            // Etomidat (sarı)
            g.add(cyl(0.014,0.014,0.10,0xfde047,-0.14,0.04,0.05,{seg:12,roughness:.30}));
            g.add(box(0.04,0.012,0.020,0xfafafa,-0.14,0.05,0.05,{}));
            // Rocuronium (turuncu — kas gevşetici, kritik renk kod)
            g.add(cyl(0.014,0.014,0.10,0xfb923c,-0.04,0.04,0.05,{seg:12,roughness:.30}));
            g.add(box(0.04,0.012,0.020,0xfafafa,-0.04,0.05,0.05,{}));
            // Fentanyl (mavi — opioid)
            g.add(cyl(0.014,0.014,0.10,0x60a5fa,0.06,0.04,0.05,{seg:12,roughness:.30}));
            g.add(box(0.04,0.012,0.020,0xfafafa,0.06,0.05,0.05,{}));
            // Atropin (kırmızı — vagolitik)
            g.add(cyl(0.014,0.014,0.10,0xef4444,0.16,0.04,0.05,{seg:12,roughness:.30}));
            g.add(box(0.04,0.012,0.020,0xfafafa,0.16,0.05,0.05,{}));
            // İlaç ampul kutuları (üst sırada, hazır)
            g.add(box(0.10,0.04,0.06,0xfff7e2,-0.12,0.04,-0.07,{roughness:.40}));
            g.add(box(0.10,0.04,0.06,0xfff0d4,0,0.04,-0.07,{roughness:.40}));
            g.add(box(0.10,0.04,0.06,0xe2f0ff,0.12,0.04,-0.07,{roughness:.40}));
            // RSI etiket
            g.add(box(0.10,0.025,0.002,0xef4444,0,0.04,0.115,{emissive:0xb91c1c,emissiveIntensity:.30}));
            return g;
        }
        /* ===================== /İO-5 build fonksiyonları ===================== */

        function buildSharpsTray(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(box(0.26,0.04,0.16,0xb9d8ee,0,0,0,{roughness:.28}));
            g.add(box(0.18,0.01,0.02,0xbcbcbc,-0.03,0.03,0.00,{metalness:.65,roughness:.18}));
            g.add(box(0.06,0.01,0.01,0xd8d8d8,0.06,0.03,-0.04,{metalness:.65,roughness:.18}));
            return g;
        }

        function buildAirwayCart(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(box(0.52,0.14,0.38,0x60788a,0,0.20,0,{roughness:.34}));
            [0.55,0.95,1.35].forEach(yy=>g.add(box(0.44,0.22,0.32,0xe8eef4,0,yy,0,{metalness:.08,roughness:.24})));
            g.add(box(0.18,0.08,0.012,0x09121a,0,1.45,0.17,{}));
            g.add(cyl(0.10,0.10,0.26,0x365a6d,0.32,1.18,0.02,{seg:20}));
            g.add(cyl(0.08,0.08,0.22,0x40687d,0.44,1.02,0.02,{seg:20}));
            g.add(cyl(0.05,0.05,0.20,0x6da9b7,0.23,1.04,0.15,{seg:18}));
            [-0.18,0.18].forEach(xx=>[-0.12,0.12].forEach(zz=>{ const w=cyl(0.035,0.035,0.03,0x4f5963,xx,0.04,zz,{seg:12}); w.rotation.z=Math.PI/2; g.add(w);}));
            return g;
        }

        function buildBloodWarmer(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(box(0.46,0.14,0.32,0x5a7080,0,0.24,0,{roughness:.34}));
            g.add(box(0.34,0.28,0.24,0xe8edf3,0,0.55,0,{metalness:.08,roughness:.24}));
            g.add(box(0.14,0.06,0.012,0x0f1821,0,0.61,0.126,{}));
            g.add(box(0.09,0.04,0.008,0xf6c56e,0,0.61,0.138,{emissive:0xe0a558,emissiveIntensity:.30}));
            g.add(cyl(0.02,0.02,1.10,0xa4b1bb,0.22,0.80,0,{seg:10}));
            g.add(box(0.10,0.18,0.05,0xb13d4d,0.25,1.48,0,{roughness:.42}));
            g.add(cyl(0.07,0.07,0.22,0xd1d8dd,-0.18,0.50,0,{seg:20}));
            return g;
        }

        function buildPositioningSet(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(box(0.28,0.10,0.18,0x90a8bc,-0.18,0.06,0,{roughness:.58}));
            g.add(box(0.22,0.07,0.14,0xc7d0d8,0.16,0.05,0.10,{roughness:.66}));
            g.add(box(0.22,0.07,0.14,0xc7d0d8,0.16,0.05,-0.10,{roughness:.66}));
            g.add(box(0.38,0.03,0.22,0xdad2bb,0.00,0.02,0,{roughness:.70}));
            return g;
        }

        function buildFireRiskBoard(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(box(0.26,0.52,0.04,0x2c3137,0,0.68,0,{roughness:.38}));
            g.add(box(0.22,0.48,0.01,0xf4f1e7,0,0.68,0.026,{roughness:.76}));
            g.add(cyl(0.02,0.02,1.05,0xaab6bf,0,-0.00,0,{seg:10}));
            g.add(box(0.05,0.10,0.01,0xd96371,-0.06,0.82,0.03,{emissive:0xd96371,emissiveIntensity:.12}));
            g.add(box(0.05,0.10,0.01,0x6f9fd8,0.00,0.82,0.03,{emissive:0x6f9fd8,emissiveIntensity:.12}));
            g.add(box(0.05,0.10,0.01,0xe0a558,0.06,0.82,0.03,{emissive:0xe0a558,emissiveIntensity:.12}));
            return g;
        }

        function buildTrafficSign(x,y,z) {
            const g = groupAt(x,y,z);
            g.add(box(0.48,0.06,0.32,0x5a6f82,0,0.03,0,{roughness:.40}));
            g.add(cyl(0.022,0.022,1.18,0xaab6bf,0,0.60,0,{seg:10,metalness:0.22,roughness:0.30}));
            g.add(box(0.42,0.20,0.03,0x243442,0,1.16,0,{roughness:.34}));
            g.add(box(0.36,0.14,0.01,0x9ad7da,0,1.16,0.022,{emissive:0x84dbe5,emissiveIntensity:.18}));
            g.add(box(0.30,0.10,0.028,0x2a3b4d,0,0.88,0,{roughness:.34}));
            g.add(box(0.24,0.06,0.010,0xe0a558,0,0.88,0.018,{emissive:0xe0a558,emissiveIntensity:.12}));
            return g;
        }

        function buildChecklistBoard(x,y,z) {
            // ============================================================
            // ULTRA-PREMIUM GCKL PANOSU v2.0
            // Dijital safety dashboard — modern OR'larda standart hale gelen
            // büyük dokunmatik panel formatında. ESU/Anestezi/KPB V2 ile aynı
            // premium materyal dilini kullanır.
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
            const screenDark = 0x0a0e14;

            // ============================================================
            // ALT TABAN — 4 ayaklı premium stand
            // ============================================================
            // Beş yıldız taban (ESU V2 stilinde — 5 ayak)
            for (let i = 0; i < 5; i++) {
                const ang = (i * Math.PI * 2) / 5;
                const ex = Math.cos(ang) * 0.26;
                const ez = Math.sin(ang) * 0.26;
                const legA = new THREE.Vector3(0, 0.04, 0);
                const legB = new THREE.Vector3(ex, 0.04, ez);
                const legGeo = new THREE.CylinderGeometry(0.020, 0.014, 0.30, 12);
                const leg = new THREE.Mesh(legGeo, mat(anodGray, { metalness: 0.55, roughness: 0.30 }));
                leg.position.copy(legA.clone().add(legB).multiplyScalar(0.5));
                leg.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3().subVectors(legB, legA).normalize()
                );
                leg.castShadow = true; leg.receiveShadow = true;
                g.add(leg);
                // Tekerlek
                const wh = cyl(0.030, 0.030, 0.024, 0x12161c, ex, 0.018, ez,
                    { seg: 16, metalness: 0.30, roughness: 0.55 });
                wh.rotation.z = Math.PI / 2;
                g.add(wh);
                const hub = cyl(0.016, 0.016, 0.028, brushAlu, ex, 0.018, ez,
                    { seg: 12, metalness: 0.65, roughness: 0.18 });
                hub.rotation.z = Math.PI / 2;
                g.add(hub);
            }
            // Merkez göbek
            g.add(cyl(0.050, 0.050, 0.024, anodDark, 0, 0.052, 0,
                { seg: 22, metalness: 0.55, roughness: 0.32 }));
            // Turkuaz status LED halka
            const _baseRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.052, 0.0034, 8, 28),
                mat(accentTeal, { emissive: accentTeal, emissiveIntensity: 0.55,
                                  transparent: true, opacity: 0.85 })
            );
            _baseRing.rotation.x = Math.PI / 2;
            _baseRing.position.set(0, 0.067, 0);
            _baseRing.castShadow = true; _baseRing.receiveShadow = true;
            g.add(_baseRing);

            // ============================================================
            // DİREK + YÜKSEKLİK AYAR MAFSALI
            // ============================================================
            // Ana kolon (anodize)
            g.add(cyl(0.034, 0.030, 0.78, anodGray, 0, 0.45, 0,
                { seg: 22, metalness: 0.55, roughness: 0.30 }));
            // Yükseklik ayar mafsalı (ortada)
            g.add(cyl(0.044, 0.044, 0.024, anodDark, 0, 0.62, 0,
                { seg: 22, metalness: 0.45, roughness: 0.40 }));
            const _adjRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.046, 0.0034, 6, 24),
                mat(brushAlu, { metalness: 0.62, roughness: 0.22 })
            );
            _adjRing.rotation.x = Math.PI / 2;
            _adjRing.position.set(0, 0.62, 0);
            _adjRing.castShadow = true; _adjRing.receiveShadow = true;
            g.add(_adjRing);
            // Üst kolon (ince brushed)
            g.add(cyl(0.028, 0.028, 0.06, brushAlu, 0, 0.86, 0,
                { seg: 18, metalness: 0.62, roughness: 0.22 }));

            // ============================================================
            // ARKA PLAKA — panel arkası (anodize alu)
            // ============================================================
            // Ana plaka (büyük, dikey)
            g.add(box(0.62, 0.86, 0.022, anodGray, 0, 1.34, 0,
                { metalness: 0.55, roughness: 0.30 }));
            // Üst aksent şeridi (turkuaz LED)
            g.add(box(0.58, 0.006, 0.024, accentTeal, 0, 1.755, 0.014,
                { emissive: accentTeal, emissiveIntensity: 0.65,
                  transparent: true, opacity: 0.85 }));
            // Alt aksent şeridi (mavi LED)
            g.add(box(0.58, 0.006, 0.024, accentBlue, 0, 0.925, 0.014,
                { emissive: accentBlue, emissiveIntensity: 0.55,
                  transparent: true, opacity: 0.85 }));
            // Yan dikey LED accent (sol+sağ)
            [-0.299, 0.299].forEach(side => {
                g.add(box(0.005, 0.78, 0.014, accentTeal, side, 1.34, 0.014,
                    { emissive: accentTeal, emissiveIntensity: 0.55,
                      transparent: true, opacity: 0.85 }));
            });
            // Brushed alu çerçeve (panelin etrafında)
            g.add(box(0.58, 0.78, 0.005, brushAlu, 0, 1.34, 0.020,
                { metalness: 0.70, roughness: 0.22 }));

            // ============================================================
            // CAM DOKUNMATİK EKRAN (büyük — dashboard)
            // ============================================================
            // Cam çerçeve (parlak siyah)
            g.add(box(0.54, 0.74, 0.012, screenDark, 0, 1.34, 0.026,
                { metalness: 0.20, roughness: 0.10 }));
            // Aktif ekran arka plan (koyu mavi-siyah)
            g.add(box(0.50, 0.70, 0.001, 0x0d1820, 0, 1.34, 0.034,
                { emissive: 0x103040, emissiveIntensity: 0.40 }));

            // ============================================================
            // EKRAN İÇERİĞİ — GCKL faz başlıkları + checklist
            // ============================================================
            // ÜST BAŞLIK BARI (turkuaz aktif şerit + "GCKL")
            g.add(box(0.46, 0.040, 0.0015, accentTeal, 0, 1.66, 0.036,
                { emissive: accentTeal, emissiveIntensity: 0.85 }));
            // Başlık beyaz şerit (büyük)
            g.add(box(0.20, 0.022, 0.0015, 0xfafdff, -0.10, 1.66, 0.038,
                { emissive: 0xfafdff, emissiveIntensity: 0.95 }));
            // Faz göstergesi (3 dot — Sign-in / Time-out / Sign-out)
            [-0.10, 0.00, 0.10].forEach((dx, i) => {
                const colors = [accentGreen, accentYellow, accentBlue];
                g.add(cyl(0.008, 0.008, 0.004, colors[i], 0.10 + dx, 1.66, 0.038,
                    { seg: 12, emissive: colors[i], emissiveIntensity: 0.95 }));
            });

            // === SIGN-IN BÖLÜMÜ (üst bölme — yeşil tamamlandı tonları) ===
            // Bölme başlığı (yeşil şerit)
            g.add(box(0.46, 0.018, 0.0015, accentGreen, 0, 1.585, 0.036,
                { emissive: accentGreen, emissiveIntensity: 0.85 }));
            // 4 madde göstergesi (yeşil = tamamlandı checkbox)
            [0, 1, 2, 3].forEach(i => {
                const yy = 1.55 - i * 0.040;
                // Checkbox kare
                g.add(box(0.018, 0.018, 0.0015, accentGreen, -0.20, yy, 0.036,
                    { emissive: accentGreen, emissiveIntensity: 0.95 }));
                // Madde satırı (beyaz çizgi)
                g.add(box(0.32, 0.008, 0.0015, 0xfafdff, -0.02, yy, 0.036,
                    { emissive: 0xfafdff, emissiveIntensity: 0.55 }));
                // Sağ tarafta yüzde göstergesi (mini bar)
                g.add(box(0.040, 0.012, 0.0015, accentGreen, 0.18, yy, 0.036,
                    { emissive: accentGreen, emissiveIntensity: 0.75 }));
            });

            // === TIME-OUT BÖLÜMÜ (orta — sarı aktif tonları) ===
            // Bölme başlığı
            g.add(box(0.46, 0.018, 0.0015, accentYellow, 0, 1.36, 0.036,
                { emissive: accentYellow, emissiveIntensity: 0.85 }));
            // 4 madde — bazı tamamlandı (yeşil) bazı aktif (sarı)
            [0, 1, 2, 3].forEach(i => {
                const yy = 1.32 - i * 0.040;
                const completed = i < 2;
                const c = completed ? accentGreen : accentYellow;
                g.add(box(0.018, 0.018, 0.0015, c, -0.20, yy, 0.036,
                    { emissive: c, emissiveIntensity: 0.95 }));
                g.add(box(0.32, 0.008, 0.0015, 0xfafdff, -0.02, yy, 0.036,
                    { emissive: 0xfafdff, emissiveIntensity: 0.55 }));
                g.add(box(0.040, 0.012, 0.0015, c, 0.18, yy, 0.036,
                    { emissive: c, emissiveIntensity: 0.75 }));
            });

            // === SIGN-OUT BÖLÜMÜ (alt — mavi/gri bekleyen tonları) ===
            g.add(box(0.46, 0.018, 0.0015, accentBlue, 0, 1.13, 0.036,
                { emissive: accentBlue, emissiveIntensity: 0.65 }));
            [0, 1, 2].forEach(i => {
                const yy = 1.09 - i * 0.040;
                // Boş checkbox (sadece çerçeve — gri)
                g.add(box(0.018, 0.018, 0.0015, anodGray, -0.20, yy, 0.036,
                    { metalness: 0.30, roughness: 0.40 }));
                // Madde satırı (donuk beyaz)
                g.add(box(0.32, 0.006, 0.0015, brushAlu, -0.02, yy, 0.036,
                    { emissive: brushAlu, emissiveIntensity: 0.30 }));
            });

            // === ALT İLERLEME ÇUBUĞU (overall progress — büyük yatay bar) ===
            // Çerçeve
            g.add(box(0.46, 0.026, 0.0015, anodDark, 0, 0.99, 0.036,
                { metalness: 0.30, roughness: 0.40 }));
            // Dolu kısım (~70% - turkuaz)
            g.add(box(0.32, 0.020, 0.0015, accentTeal, -0.07, 0.99, 0.038,
                { emissive: accentTeal, emissiveIntensity: 0.95 }));
            // Yüzde rakamı (sağda — büyük beyaz LED)
            g.add(box(0.040, 0.022, 0.0015, 0xfafdff, 0.20, 0.99, 0.038,
                { emissive: 0xfafdff, emissiveIntensity: 0.85 }));

            // ============================================================
            // YAN KONTROL DİKEY ŞERİT (sağ kenarda — mini buton kolonu)
            // ============================================================
            // 4 fizik buton (yan tarafta — phase change butonları)
            [
                { c: accentGreen,  yy: 1.62 },
                { c: accentYellow, yy: 1.50 },
                { c: accentBlue,   yy: 1.38 },
                { c: accentRed,    yy: 1.26 }
            ].forEach(b => {
                g.add(cyl(0.014, 0.014, 0.014, anodDark, 0.295, b.yy, 0.018,
                    { seg: 14, metalness: 0.55, roughness: 0.30 }));
                g.add(cyl(0.010, 0.010, 0.016, b.c, 0.295, b.yy, 0.024,
                    { seg: 12, emissive: b.c, emissiveIntensity: 0.85 }));
            });
            // Encoder döner buton (alt — büyük)
            g.add(cyl(0.024, 0.024, 0.018, brushAlu, 0.295, 1.10, 0.018,
                { seg: 18, metalness: 0.62, roughness: 0.22 }));
            g.add(cyl(0.018, 0.018, 0.022, anodDark, 0.295, 1.10, 0.024,
                { seg: 16, metalness: 0.45, roughness: 0.40 }));

            // ============================================================
            // ÜST ALARM TOWER — GCKL kritik faz uyarı LED'leri
            // ============================================================
            // Kasa
            g.add(cyl(0.014, 0.014, 0.020, screenDark, 0.24, 1.80, 0.018,
                { seg: 16, roughness: 0.40 }));
            g.add(cyl(0.022, 0.022, 0.022, accentGreen, 0.24, 1.825, 0.018,
                { seg: 18, emissive: accentGreen, emissiveIntensity: 0.85 }));
            g.add(cyl(0.022, 0.022, 0.022, accentYellow, 0.24, 1.850, 0.018,
                { seg: 18, emissive: accentYellow, emissiveIntensity: 0.30 }));
            g.add(cyl(0.022, 0.022, 0.022, accentRed, 0.24, 1.875, 0.018,
                { seg: 18, emissive: accentRed, emissiveIntensity: 0.20 }));

            // ============================================================
            // SOL ÜST KÖŞE — KAMERA / RFID OKUYUCU MODÜLÜ
            // ============================================================
            // RFID okuyucu plakası (modern hospital tablet stilinde)
            g.add(box(0.080, 0.060, 0.014, anodDark, -0.24, 1.80, 0.018,
                { metalness: 0.55, roughness: 0.30 }));
            // RFID logo LED (mavi dalga simülasyonu)
            g.add(box(0.040, 0.030, 0.0015, accentBlue, -0.24, 1.80, 0.026,
                { emissive: accentBlue, emissiveIntensity: 0.85 }));

            // ============================================================
            // MARKA ŞERİDİ (üst-orta arka plaka — turkuaz LED)
            // ============================================================
            g.add(box(0.10, 0.014, 0.005, accentTeal, 0, 1.74, 0.018,
                { emissive: accentTeal, emissiveIntensity: 0.85 }));

            return g;
        }

        
