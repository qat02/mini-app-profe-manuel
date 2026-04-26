import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./CorreProfe.css";

const RANKING_URL = "https://docs.google.com/spreadsheets/d/1NTe4pZ0pSn5qNa7adKiWgzbLoBGbOEitANGoiisicgE/edit?usp=drive_link";

export default function CorreProfe() {
  const recordGuardado = Number(localStorage.getItem("recordProfe")) || 0;
  const nombreGuardado = localStorage.getItem("recordProfeNombre") || "Sin nombre";

  const [accion, setAccion] = useState("normal");
  const [puntos, setPuntos] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [record, setRecord] = useState(recordGuardado);
  const [nombreRecord, setNombreRecord] = useState(nombreGuardado);
  const [nuevoRecord, setNuevoRecord] = useState(false);
  const [nombreJugador, setNombreJugador] = useState("");
  const [flash, setFlash] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [obstaculos, setObstaculos] = useState([]);
  const [estrellas, setEstrellas] = useState([]);
  const [quincenas, setQuincenas] = useState([]);
  const [plus, setPlus] = useState([]);
  const [estrellasTomadas, setEstrellasTomadas] = useState(0);
  const [bonoTotal, setBonoTotal] = useState(0);
  const [modoSayayin, setModoSayayin] = useState(false);
  const [bgX, setBgX] = useState(0);
  const [altura, setAltura] = useState(18);
  const volandoRef = useRef(false);

  const accionRef = useRef("normal");
  const gameOverRef = useRef(false);
  const modoSayayinRef = useRef(false);
  const scoreRef = useRef(0);
  const bonoRef = useRef(0);
  const estrellasRef = useRef(0);
  const estrellasDesdePoderRef = useRef(0);
  const estrellasCobradasRef = useRef(new Set());

  const spawnRef = useRef(0);
  const starRef = useRef(0);
  const idRef = useRef(1);
  const mensajeDerrotaRef = useRef("");
  const sayayinTimeoutRef = useRef(null);

  const musicaRef = useRef(null);
  const musicaIniciadaRef = useRef(false);
  const auraRef = useRef(null);

  const fondos = ["/fondo-1.png", "/fondo-2.png", "/fondo-3.png", "/fondo-4.png", "/fondo-5.png"];

  const nivelActual = Math.floor(puntos / 200) + 1;
  const fondoActual = fondos[Math.floor((nivelActual - 1) / 2) % fondos.length];
  const musicas = [
  "/fondo-midi1.mp3",
  "/fondo-midi2.mp3",
  "/fondo-midi3.mp3",
  "/fondo-midi4.mp3",
  "/fondo-midi5.mp3",
];

const musicaActual = musicas[Math.floor((nivelActual - 1) / 2) % musicas.length];
  
const abrirRanking = () => {
    window.open(RANKING_URL, "_blank", "noopener,noreferrer");
  };

  const iniciarMusica = useCallback(() => {
    if (!musicaIniciadaRef.current && musicaRef.current) {
      musicaRef.current.volume = 0.2;
      musicaRef.current.play().catch(() => {});
      musicaIniciadaRef.current = true;
    }
  }, []);

  const activarSayayin = useCallback(() => {
  const audio = new Audio("/sayayin.mp3");
  audio.volume = 1;
  audio.playbackRate = 1.1;
  audio.play().catch(() => {});

  const audio2 = new Audio("/sayayin.mp3");
  audio2.volume = 0.6;
  audio2.play().catch(() => {});

  setFlash(true);
  setTimeout(() => setFlash(false), 200);

  if (navigator.vibrate) {
    navigator.vibrate(120);
  }

  setModoSayayin(true);
  modoSayayinRef.current = true;
  setEstrellas([]);

  if (auraRef.current) {
    auraRef.current.pause();
    auraRef.current.currentTime = 0;
  }

  auraRef.current = new Audio("/sayayin-loop.mp3");
  auraRef.current.loop = true;
  auraRef.current.volume = 0.85;
  auraRef.current.play().catch(() => {});

  if (sayayinTimeoutRef.current) {
    clearTimeout(sayayinTimeoutRef.current);
  }

  sayayinTimeoutRef.current = setTimeout(() => {
    setModoSayayin(false);
    modoSayayinRef.current = false;
    starRef.current = 0;

    if (auraRef.current) {
      auraRef.current.pause();
      auraRef.current.currentTime = 0;
    }
  }, 7500);
}, []);

  const playSound = useCallback((type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);

      const tone = (freq, duration, delay = 0, volume = 0.07) => {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = freq;
        oscillator.connect(gainNode);
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
        oscillator.start(audioCtx.currentTime + delay);
        oscillator.stop(audioCtx.currentTime + delay + duration);
      };

      if (type === "jump") tone(520, 0.12);
      if (type === "duck") tone(260, 0.08);
      if (type === "star") {
        tone(780, 0.07);
        tone(1040, 0.08, 0.07);
      }
      if (type === "lose") {
        tone(220, 0.16, 0, 0.09);
        tone(150, 0.25, 0.16, 0.09);
      }
      if (type === "restart") {
        tone(440, 0.07);
        tone(660, 0.07, 0.08);
        tone(880, 0.09, 0.16);
      }
      if (type === "record") {
        tone(660, 0.08);
        tone(880, 0.08, 0.09);
        tone(1100, 0.1, 0.18);
        tone(1320, 0.13, 0.29);
      }

      setTimeout(() => audioCtx.close(), 800);
    } catch {
      console.log("Audio no disponible");
    }
  }, []);

  const catalogos = useMemo(() => [
    {
      bajo: [
        { icono: "📚", derrota: "Te vencieron las planeaciones." },
        { icono: "📝", derrota: "Te vencieron los exámenes." },
        { icono: "🎒", derrota: "Te venció la mochila abandonada." },
      ],
      alto: [
        { icono: "📄", derrota: "Te vencieron los oficios urgentes." },
        { icono: "🔔", derrota: "Te venció la campana escolar." },
        { icono: "📢", derrota: "Te vencieron los avisos." },
      ],
      superior: [
        { icono: "☁️", derrota: "Te venció la carga administrativa." },
        { icono: "📋", derrota: "Te venció el formato urgente." },
        { icono: "📌", derrota: "Te venció el pendiente inesperado." },
      ],
    },
    {
      bajo: [
        { icono: "🐕", derrota: "Te venció el perro del patio." },
        { icono: "🐈", derrota: "Te venció el gato escolar." },
        { icono: "🐓", derrota: "Te venció el gallo madrugador." },
      ],
      alto: [
        { icono: "🦜", derrota: "Te venció el pájaro distraído." },
        { icono: "🦇", derrota: "Te venció el murciélago escolar." },
        { icono: "🦅", derrota: "Te venció el ave del recreo." },
      ],
      superior: [
        { icono: "🐦", derrota: "Te venció el pajarito escolar." },
        { icono: "🕊️", derrota: "Te venció el ave tranquila." },
        { icono: "🪶", derrota: "Te venció la pluma voladora." },
      ],
    },
    {
      bajo: [
        { icono: "🪑", derrota: "Te venció la silla atravesada." },
        { icono: "📦", derrota: "Te venció la caja de material." },
        { icono: "🪣", derrota: "Te venció la cubeta olvidada." },
      ],
      alto: [
        { icono: "🧹", derrota: "Te venció la escoba voladora." },
        { icono: "🪜", derrota: "Te venció la escalera." },
        { icono: "🧯", derrota: "Te venció el extintor." },
      ],
      superior: [
        { icono: "🖼️", derrota: "Te venció el cuadro del aula." },
        { icono: "🧺", derrota: "Te venció la canasta colgante." },
        { icono: "🪧", derrota: "Te venció el letrero urgente." },
      ],
    },
    {
      bajo: [
        { icono: "🚧", derrota: "Te venció la zona de construcción." },
        { icono: "🕳️", derrota: "Te venció el hoyo del camino." },
        { icono: "🌳", derrota: "Te venció el árbol del patio." },
      ],
      alto: [
        { icono: "🚦", derrota: "Te venció el semáforo escolar." },
        { icono: "🪧", derrota: "Te venció el letrero urgente." },
        { icono: "🚪", derrota: "Te venció la puerta inesperada." },
      ],
      superior: [
        { icono: "☁️", derrota: "Te venció la nube administrativa." },
        { icono: "🚁", derrota: "Te venció el helicóptero del recreo." },
        { icono: "🛰️", derrota: "Te venció el satélite escolar." },
      ],
    },
    {
      bajo: [
        { icono: "👨‍💼", derrota: "Te venció el director." },
        { icono: "👨‍👩‍👧", derrota: "Te vencieron los padres de familia." },
        { icono: "🧑‍🏫", derrota: "Te venció el ATP." },
      ],
      alto: [
        { icono: "☁️", derrota: "Te venció la carga administrativa." },
        { icono: "📋", derrota: "Te venció el formato urgente." },
        { icono: "📌", derrota: "Te venció el pendiente inesperado." },
      ],
      superior: [
        { icono: "📊", derrota: "Te vencieron las gráficas." },
        { icono: "💼", derrota: "Te venció el maletín de pendientes." },
        { icono: "🧠", derrota: "Te venció la sobrecarga mental." },
      ],
    },
  ], []);

  useEffect(() => {
    accionRef.current = accion;
  }, [accion]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    modoSayayinRef.current = modoSayayin;
  }, [modoSayayin]);

  useEffect(() => {
  if (musicaRef.current) {
    musicaRef.current.pause();
    musicaRef.current.currentTime = 0;

    if (musicaIniciadaRef.current) {
      musicaRef.current.play().catch(() => {});
    }
  }
}, [musicaActual]);

  useEffect(() => {
  const manejarVisibilidad = () => {
    if (!musicaRef.current) return;

    if (document.hidden) {
      setPausado(true);
      musicaRef.current.pause();
    }
  };

  document.addEventListener("visibilitychange", manejarVisibilidad);

  return () => {
    document.removeEventListener("visibilitychange", manejarVisibilidad);
  };
}, [setPausado]);

  const elegirItem = useCallback((nivel, grupoTipo) => {
    const grupo = Math.floor((nivel - 1) / 2) % catalogos.length;
    const lista = catalogos[grupo][grupoTipo];
    return lista[Math.floor(Math.random() * lista.length)];
  }, [catalogos]);

  const crearObstaculo = useCallback((tipo, nivel, xExtra = 0, requisitoForzado = null) => {
    if (tipo === "doble-brinco") {
      const bajo = elegirItem(nivel, "bajo");
      const alto = elegirItem(nivel, "alto");

      return {
        id: idRef.current++,
        tipo: "doble-brinco",
        derrota: "Te venció el obstáculo doble. Había que brincar.",
        x: 820 + xExtra,
        partes: [
          { linea: "bajo", icono: bajo.icono },
          { linea: "medio", icono: alto.icono },
        ],
      };
    }

    if (tipo === "doble-agacharse") {
      const alto = elegirItem(nivel, "alto");
      const superior = elegirItem(nivel, "superior");

      return {
        id: idRef.current++,
        tipo: "doble-agacharse",
        derrota: "Te venció el obstáculo doble. Había que agacharse.",
        x: 820 + xExtra,
        partes: [
          { linea: "medio", icono: alto.icono },
          { linea: "superior", icono: superior.icono },
        ],
      };
    }

    const item = elegirItem(nivel, tipo);

    return {
      id: idRef.current++,
      tipo,
      requisitoForzado,
      icono: item.icono,
      derrota: item.derrota,
      x: 820 + xExtra,
    };
  }, [elegirItem]);

  const crearCombo = useCallback((nivel) => {
    const separacion = 720;

    const combos = [
      ["bajo", "bajo"],
      ["alto-forzado", "alto-forzado"],
      ["alto-forzado", "bajo"],
      ["bajo", "alto-forzado"],
    ];

    const elegido = combos[Math.floor(Math.random() * combos.length)];

    return elegido.map((tipo, index) => {
      const xExtra = index === 0 ? 0 : separacion;

      if (tipo === "alto-forzado") {
        return crearObstaculo("alto", nivel, xExtra, "agachado");
      }

      return crearObstaculo(tipo, nivel, xExtra);
    });
  }, [crearObstaculo]);

  const crearEstrella = useCallback(() => ({
    id: idRef.current++,
    x: 820,
    nivel: Math.random() > 0.5 ? "alta" : "baja",
  }), []);

  const guardarNuevoRecord = (nombre) => {
    const limpio = nombre.trim() || "Profe anónimo";
    const total = Math.floor(scoreRef.current);

    localStorage.setItem("recordProfe", total);
    localStorage.setItem("recordProfeNombre", limpio);

    setRecord(total);
    setNombreRecord(limpio);
    setNuevoRecord(false);
  };

  const terminarJuego = useCallback((mensaje) => {
    const totalFinal = Math.floor(scoreRef.current);

    mensajeDerrotaRef.current = mensaje;
    setPuntos(totalFinal);
    playSound("lose");

    if (musicaRef.current) {
      musicaRef.current.pause();
    }

    if (sayayinTimeoutRef.current) {
      clearTimeout(sayayinTimeoutRef.current);
    }

    setModoSayayin(false);
    modoSayayinRef.current = false;

    setGameOver(true);

    if (totalFinal > record) {
      playSound("record");
      setNuevoRecord(true);

      setRecord(totalFinal);
    }
  }, [playSound, record]);

  const reiniciar = useCallback((conMusica = false) => {
    playSound("restart");

    if (musicaRef.current) {
  musicaRef.current.currentTime = 0;

  if (conMusica) {
    musicaRef.current.volume = 0.2;
    musicaRef.current.play().catch(() => {});
    musicaIniciadaRef.current = true;
  } else {
    musicaIniciadaRef.current = false;
  }
}

    if (sayayinTimeoutRef.current) {
      clearTimeout(sayayinTimeoutRef.current);
    }

    scoreRef.current = 0;
    bonoRef.current = 0;
    estrellasRef.current = 0;
    estrellasDesdePoderRef.current = 0;
    estrellasCobradasRef.current = new Set();

    spawnRef.current = 0;
    starRef.current = 0;
    mensajeDerrotaRef.current = "";

    setPuntos(0);
    setObstaculos([]);
    setEstrellas([]);
    setQuincenas([]);
    setPlus([]);
    setEstrellasTomadas(0);
    setBonoTotal(0);
    setModoSayayin(false);
    modoSayayinRef.current = false;
    setAccion("normal");
    setGameOver(false);
    setNuevoRecord(false);
    setNombreJugador("");
  }, [playSound]);

  const brincar = useCallback(() => {
  if (gameOverRef.current) return reiniciar(true);

  if (pausado) {
    setPausado(false);

    if (musicaRef.current) {
      musicaRef.current.play().catch(() => {});
    }

    return;
  }

  if (accionRef.current !== "normal") return;

  iniciarMusica();
  playSound("jump");
  setAccion("brincando");
  setTimeout(() => setAccion("normal"), 700);
}, [iniciarMusica, playSound, reiniciar, pausado]);

  const agacharse = useCallback(() => {
  if (gameOverRef.current) return reiniciar();

  if (pausado) {
    setPausado(false);

    if (musicaRef.current) {
      musicaRef.current.play().catch(() => {});
    }

    return;
  }

  if (accionRef.current !== "normal") return;

  iniciarMusica();
  playSound("duck");
  setAccion("agachado");
  setTimeout(() => setAccion("normal"), 500);
}, [iniciarMusica, playSound, reiniciar, pausado]);

  useEffect(() => {
    const tecla = (e) => {
      if (e.key === "ArrowUp") brincar();
      if (e.key === "ArrowDown") agacharse();
    };

    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [brincar, agacharse]);

  useEffect(() => {
    let raf;
    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!gameOverRef.current && !pausado) {
        const nivel = Math.floor(scoreRef.current / 200) + 1;

        const velocidad =
          nivel <= 5
            ? 160 + nivel * 30
            : 360 + (nivel - 5) * 75;
      
      // 🔥 VUELO SAYAYIN
      if (modoSayayinRef.current) {
        setAltura((prev) => {
          if (volandoRef.current) {
            return Math.min(prev + 220 * dt, 220);
         } else {
           return Math.max(prev - 260 * dt, 18);
         }
       });
     }      

        setBgX((prev) => prev - velocidad * dt * 0.5);

        const intervalo =
          nivel <= 5
            ? Math.max(2.2 - nivel * 0.05, 1.8)
            : Math.max(1.75 - (nivel - 5) * 0.075, 1.05);

        const probabilidadDoble =
          nivel < 5 ? 0 : Math.min(0.18 + (nivel - 5) * 0.035, 0.36);

        const probabilidadCombo =
          nivel < 3 ? 0 : nivel < 5 ? 0.35 : Math.min(0.32 + (nivel - 5) * 0.025, 0.50);

        scoreRef.current += dt * 7;
        setPuntos(Math.floor(scoreRef.current));

        spawnRef.current += dt;

        if (!modoSayayinRef.current) {
          starRef.current += dt;
        }

        if (spawnRef.current >= intervalo) {
          spawnRef.current = 0;

          const nuevos = [];
          const azar = Math.random();

          if (nivel >= 5 && azar < probabilidadDoble) {
            const tipoDoble = Math.random() > 0.5 ? "doble-brinco" : "doble-agacharse";
            nuevos.push(crearObstaculo(tipoDoble, nivel));
          } else if (nivel >= 3 && azar < probabilidadDoble + probabilidadCombo) {
            nuevos.push(...crearCombo(nivel));
          } else {
            const tipo1 = Math.random() > 0.5 ? "bajo" : "alto";
            nuevos.push(crearObstaculo(tipo1, nivel));

            if (nivel >= 6 && Math.random() < probabilidadDoble * 0.5) {
              const tipo2 = Math.random() > 0.5 ? "bajo" : "alto";
              const separacionSegura = 720;
              nuevos.push(crearObstaculo(tipo2, nivel, separacionSegura));
            }
          }

          setObstaculos((prev) => [...prev, ...nuevos]);
        }

        if (!modoSayayinRef.current && starRef.current >= 5.6 + Math.random() * 2.4) {
          starRef.current = 0;
          setEstrellas((prev) => [...prev, crearEstrella()]);
        }

        setObstaculos((prev) => {
          const movidos = prev
            .map((o) => ({ ...o, x: o.x - velocidad * dt }))
            .filter((o) => o.x > -90);

          const golpe = movidos.find((o) => o.x < 92 && o.x > 58);

          if (golpe && !modoSayayinRef.current) {
            const accionActual = accionRef.current;

            if (
              (golpe.tipo === "bajo" && accionActual !== "brincando") ||
              (golpe.tipo === "alto" && accionActual === "normal") ||
              (golpe.tipo === "doble-brinco" && accionActual !== "brincando") ||
              (golpe.tipo === "doble-agacharse" && accionActual !== "agachado")
            ) {
              terminarJuego(golpe.derrota);
            }
          }

          return movidos;
        });

        setEstrellas((prev) => {
          const restantes = [];

          prev.forEach((s) => {
            const nuevaX = s.x - velocidad * dt;
            const cerca = nuevaX < 105 && nuevaX > 40;

            const puedeTomarla =
              (s.nivel === "alta" && accionRef.current === "brincando") ||
              (s.nivel === "baja" && accionRef.current !== "brincando");

            if (cerca && puedeTomarla && !estrellasCobradasRef.current.has(s.id)) {
              estrellasCobradasRef.current.add(s.id);
              playSound("star");

              scoreRef.current += 10;
              bonoRef.current += 10;
              estrellasRef.current += 1;
              estrellasDesdePoderRef.current += 1;

              setPuntos(Math.floor(scoreRef.current));
              setEstrellasTomadas(estrellasRef.current);
              setBonoTotal(bonoRef.current);

              setPlus((prevPlus) => [
                ...prevPlus,
                {
                  id: idRef.current++,
                  x: 90,
                  y: s.nivel === "alta" ? 80 : 135,
                },
              ]);

              if (estrellasDesdePoderRef.current >= 6) {
                estrellasDesdePoderRef.current = 0;
                setQuincenas((prevQuincenas) => [
                  ...prevQuincenas,
                  {
                    id: idRef.current++,
                    x: 820,
                  },
                ]);
              }
            } else if (nuevaX > -60 && !estrellasCobradasRef.current.has(s.id)) {
              restantes.push({ ...s, x: nuevaX });
            }
          });

          return restantes;
        });

        setQuincenas((prev) => {
          const restantes = [];

          prev.forEach((q) => {
            const nuevaX = q.x - velocidad * dt;
            const cerca = nuevaX < 92 && nuevaX > 58;
            const tocaBolsa = cerca && accionRef.current === "brincando";
            
            if (tocaBolsa) {
              activarSayayin();
            } else if (nuevaX > -60) {
              restantes.push({ ...q, x: nuevaX });
            }
          });

          return restantes;
        });

        setPlus((prev) =>
          prev.map((p) => ({ ...p, y: p.y - 1.5 })).filter((p) => p.y > 25)
        );
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [crearObstaculo, crearCombo, crearEstrella, playSound, terminarJuego, activarSayayin, pausado]);

  const tocarPantalla = (e) => {
    const y = e.clientY || e.touches?.[0]?.clientY;
    const mitad = window.innerHeight / 2;

    if (y < mitad) brincar();
    else agacharse();
  };

  return (
    <div className="corre-profe-game">
      
     <img 
       src="/banner-profe.png" 
       alt="El Profe vs el Mundo" 
       className="banner-juego" 
    />

      <audio ref={musicaRef} src={musicaActual} loop />

      <div className="corre-profe-marcador">
        <span>Puntos: {puntos}</span>
        <span>Nivel: {Math.floor(puntos / 200) + 1}</span>
        <span>🏆 Récord: {record}</span>
        <span>👤 {nombreRecord}</span>
        <span>⭐ {estrellasTomadas}</span>
        {modoSayayin && <span>🔥 Quincena activa</span>}
      </div>

      <div
        className="corre-profe-escenario"
        onClick={tocarPantalla}
        style={{ 
         backgroundImage: `url(${fondoActual})`,
         backgroundPositionX: `${bgX}px`
       }}
      >

        {flash && <div className="flash-efecto"></div>}
        {modoSayayin && <div className="fondo-sayayin"></div>}

        <div className={`corre-profe-personaje ${accion} ${modoSayayin ? "sayayin-activo" : ""}`}>
          <img
            src={
              modoSayayin
                ? "/sayayin.png"
                : accion === "brincando"
                ? "/profe-brinca.png"
                : accion === "agachado"
                ? "/profe-agacha.png"
                : "/profe-corre.gif"
            }
            alt="Profe"
          />
        </div>

        {obstaculos.map((o) => (
          <div
            key={o.id}
            className={`corre-profe-obstaculo ${o.tipo}`}
            style={{ transform: `translateX(${o.x}px)` }}
          >
            {o.partes ? (
              o.partes.map((parte, index) => (
                <span
                  key={`${o.id}-${parte.linea}-${index}`}
                  className={`obs-parte obs-${parte.linea}`}
                >
                  {parte.icono}
                </span>
              ))
            ) : (
              o.icono
            )}
          </div>
        ))}

        {estrellas.map((s) => (
          <div
            key={s.id}
            className={`corre-profe-estrella ${s.nivel}`}
            style={{ transform: `translateX(${s.x}px)` }}
          >
            ⭐
          </div>
        ))}

        {quincenas.map((q) => (
          <div
            key={q.id}
            className="corre-profe-quincena"
            style={{ transform: `translateX(${q.x}px)` }}
          >
            💰
          </div>
        ))}

        {plus.map((p) => (
          <div
            key={p.id}
            className="corre-profe-plus"
            style={{ left: `${p.x}px`, top: `${p.y}px` }}
          >
            +10 pts
          </div>
        ))}

        {gameOver && (
          <div className="corre-profe-game-over" onClick={(e) => e.stopPropagation()}>
            <div className="game-over-profe">
              <img
                src={nuevoRecord ? "/profe-win.png" : "/profe-lose.png"}
                alt={nuevoRecord ? "Nuevo récord" : "Perdió"}
              />
            </div>

            <div className="game-over-texto">
              <h2>{nuevoRecord ? "¡Nuevo récord!" : "Fin de la jornada"}</h2>
              <div className="puntaje-final">{puntos}</div>
              <p className="texto-puntaje">puntos totales</p>
              <p className="mensaje-derrota">{mensajeDerrotaRef.current}</p>

              <div className="resumen-bono">
                <p>⭐ Estrellas tomadas: {estrellasTomadas}</p>
                <p>🎁 Bono ganado: +{bonoTotal} pts</p>
              </div>

              {nuevoRecord && (
                <div className="nuevo-record-box">
                  <p>Escribe tu nombre:</p>
                  <input
                    value={nombreJugador}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setNombreJugador(e.target.value)}
                    placeholder="Tu nombre"
                    maxLength="18"
                  />
                  <button onClick={() => guardarNuevoRecord(nombreJugador)}>
                    Guardar récord
                  </button>
                </div>
              )}

              <button onClick={abrirRanking}>🏆 Ver ranking</button>

              <button onClick={() => reiniciar(true)}>
                {nuevoRecord ? "Jugar otra vez" : "Reiniciar"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="corre-profe-controles">
        <button onClick={brincar}>⬆️ Brincar</button>
        <button onClick={agacharse}>⬇️ Agacharse</button>
      </div>
    </div>
  );
}