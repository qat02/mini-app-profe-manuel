import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./CorreProfe.css";

export default function CorreProfe() {
  const recordGuardado = Number(localStorage.getItem("recordProfe")) || 0;
  const nombreGuardado = localStorage.getItem("recordProfeNombre") || "Sin nombre";

  const [accion, setAccion] = useState("normal");
  const [puntos, setPuntos] = useState(0);
  const [record, setRecord] = useState(recordGuardado);
  const [nombreRecord, setNombreRecord] = useState(nombreGuardado);
  const [nuevoRecord, setNuevoRecord] = useState(false);
  const [nombreJugador, setNombreJugador] = useState("");

  const [gameOver, setGameOver] = useState(false);
  const [obstaculos, setObstaculos] = useState([]);
  const [estrellas, setEstrellas] = useState([]);
  const [plus, setPlus] = useState([]);
  const [estrellasTomadas, setEstrellasTomadas] = useState(0);
  const [bonoTotal, setBonoTotal] = useState(0);

  const accionRef = useRef("normal");
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const bonoRef = useRef(0);
  const estrellasRef = useRef(0);
  const estrellasCobradasRef = useRef(new Set());

  const spawnRef = useRef(0);
  const starRef = useRef(0);
  const idRef = useRef(1);
  const mensajeDerrotaRef = useRef("");

<<<<<<< HEAD
  const fondos = [
    "/fondo-1.png",
    "/fondo-2.png",
    "/fondo-3.png",
    "/fondo-4.png",
    "/fondo-5.png",
  ];

  const nivelActual = Math.floor(puntos / 200) + 1;
  const fondoActual = fondos[Math.floor((nivelActual - 1) / 2) % fondos.length];

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
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + delay + duration
        );
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

  const catalogos = useMemo(
    () => [
      {
        bajo: [
          { icono: "📚", derrota: "Te vencieron las planeaciones." },
          { icono: "📝", derrota: "Te vencieron los exámenes." },
          { icono: "🎒", derrota: "Te venció la mochila abandonada." },
        ],
        alto: [
          { icono: "📄", derrota: "Te vencieron los oficios urgentes." },
          { icono: "🔔", derrota: "Te venció la campana escolar." },
          { icono: "📢", derrota: "Te vencieron los avisos de último momento." },
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
      },
      {
        bajo: [
          { icono: "🪑", derrota: "Te venció la silla atravesada." },
          { icono: "📦", derrota: "Te venció la caja de material." },
          { icono: "🪣", derrota: "Te venció la cubeta olvidada." },
        ],
        alto: [
          { icono: "🧹", derrota: "Te venció la escoba voladora." },
          { icono: "🪜", derrota: "Te venció la escalera del mantenimiento." },
          { icono: "🧯", derrota: "Te venció el extintor escolar." },
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
          { icono: "🪧", derrota: "Te venció el letrero de reunión urgente." },
          { icono: "🚪", derrota: "Te venció la puerta inesperada." },
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
      },
    ],
    []
  );

  useEffect(() => {
    accionRef.current = accion;
  }, [accion]);

=======
  const fondos = ["/fondo-1.png", "/fondo-2.png", "/fondo-3.png", "/fondo-4.png", "/fondo-5.png"];

  const nivelActual = Math.floor(puntos / 200) + 1;
  const fondoActual = fondos[Math.floor((nivelActual - 1) / 2) % fondos.length];

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
    },
  ], []);

  useEffect(() => {
    accionRef.current = accion;
  }, [accion]);

>>>>>>> bb3769a (Agrego burbuja flotante del juego)
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

<<<<<<< HEAD
  const crearObstaculo = useCallback(
    (tipo, nivel, xExtra = 0) => {
      const grupo = Math.floor((nivel - 1) / 2) % catalogos.length;
      const lista = catalogos[grupo][tipo];
      const item = lista[Math.floor(Math.random() * lista.length)];

      return {
        id: idRef.current++,
        tipo,
        icono: item.icono,
        derrota: item.derrota,
        x: 820 + xExtra,
      };
    },
    [catalogos]
  );

  const crearEstrella = useCallback(
    () => ({
      id: idRef.current++,
      x: 820,
      nivel: Math.random() > 0.5 ? "alta" : "baja",
    }),
    []
  );
=======
  const crearObstaculo = useCallback((tipo, nivel, xExtra = 0) => {
    const grupo = Math.floor((nivel - 1) / 2) % catalogos.length;
    const lista = catalogos[grupo][tipo];
    const item = lista[Math.floor(Math.random() * lista.length)];

    return {
      id: idRef.current++,
      tipo,
      icono: item.icono,
      derrota: item.derrota,
      x: 820 + xExtra,
    };
  }, [catalogos]);

  const crearEstrella = useCallback(() => ({
    id: idRef.current++,
    x: 820,
    nivel: Math.random() > 0.5 ? "alta" : "baja",
  }), []);
>>>>>>> bb3769a (Agrego burbuja flotante del juego)

  const guardarNuevoRecord = (nombre) => {
    const limpio = nombre.trim() || "Profe anónimo";
    const total = Math.floor(scoreRef.current);

    localStorage.setItem("recordProfe", total);
    localStorage.setItem("recordProfeNombre", limpio);

    setRecord(total);
    setNombreRecord(limpio);
    setNuevoRecord(false);
  };

<<<<<<< HEAD
  const terminarJuego = useCallback(
    (mensaje) => {
      const totalFinal = Math.floor(scoreRef.current);

      mensajeDerrotaRef.current = mensaje;
      setPuntos(totalFinal);
      playSound("lose");
      setGameOver(true);

      if (totalFinal > record) {
        playSound("record");
        setNuevoRecord(true);
      }
    },
    [playSound, record]
  );
=======
  const terminarJuego = useCallback((mensaje) => {
    const totalFinal = Math.floor(scoreRef.current);

    mensajeDerrotaRef.current = mensaje;
    setPuntos(totalFinal);
    playSound("lose");
    setGameOver(true);

    if (totalFinal > record) {
      playSound("record");
      setNuevoRecord(true);
    }
  }, [playSound, record]);
>>>>>>> bb3769a (Agrego burbuja flotante del juego)

  const reiniciar = useCallback(() => {
    playSound("restart");

    scoreRef.current = 0;
    bonoRef.current = 0;
    estrellasRef.current = 0;
    estrellasCobradasRef.current = new Set();

    spawnRef.current = 0;
    starRef.current = 0;
    mensajeDerrotaRef.current = "";

    setPuntos(0);
    setObstaculos([]);
    setEstrellas([]);
    setPlus([]);
    setEstrellasTomadas(0);
    setBonoTotal(0);
    setAccion("normal");
    setGameOver(false);
    setNuevoRecord(false);
    setNombreJugador("");
  }, [playSound]);

  const brincar = useCallback(() => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    playSound("jump");
    setAccion("brincando");
    setTimeout(() => setAccion("normal"), 700);
  }, [playSound, reiniciar]);

  const agacharse = useCallback(() => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    playSound("duck");
    setAccion("agachado");
    setTimeout(() => setAccion("normal"), 500);
  }, [playSound, reiniciar]);

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

      if (!gameOverRef.current) {
        const nivel = Math.floor(scoreRef.current / 200) + 1;

<<<<<<< HEAD
        // Velocidad más progresiva e infinita.
        const velocidad = 155 + nivel * 26;

        // Separación estable para que la dificultad no sea por amontonamiento.
        const intervalo = Math.max(2.25 - nivel * 0.015, 1.65);

        const probabilidadDoble =
          nivel < 6 ? 0 : Math.min((nivel - 5) * 0.01, 0.09);
=======
        const velocidad =
          nivel <= 5
            ? 160 + nivel * 30
            : 310 + (nivel - 5) * 55;

        const intervalo =
          nivel <= 5
            ? Math.max(2.2 - nivel * 0.05, 1.8)
            : Math.max(1.8 - (nivel - 5) * 0.08, 1.1);

        const probabilidadDoble =
          nivel < 5 ? 0 : Math.min((nivel - 4) * 0.05, 0.35);
>>>>>>> bb3769a (Agrego burbuja flotante del juego)

        scoreRef.current += dt * 7;
        setPuntos(Math.floor(scoreRef.current));

        spawnRef.current += dt;
        starRef.current += dt;

        if (spawnRef.current >= intervalo) {
          spawnRef.current = 0;

          const tipo1 = Math.random() > 0.5 ? "bajo" : "alto";
          const nuevos = [crearObstaculo(tipo1, nivel)];

          if (Math.random() < probabilidadDoble) {
            const tipo2 = Math.random() > 0.5 ? "bajo" : "alto";
<<<<<<< HEAD
            nuevos.push(crearObstaculo(tipo2, nivel, 600 + Math.random() * 220));
=======
            nuevos.push(crearObstaculo(tipo2, nivel, 650 + Math.random() * 180));
>>>>>>> bb3769a (Agrego burbuja flotante del juego)
          }

          setObstaculos((prev) => [...prev, ...nuevos]);
        }

        if (starRef.current >= 5.6 + Math.random() * 2.4) {
          starRef.current = 0;
          setEstrellas((prev) => [...prev, crearEstrella()]);
        }

        setObstaculos((prev) => {
          const movidos = prev
            .map((o) => ({ ...o, x: o.x - velocidad * dt }))
            .filter((o) => o.x > -90);

<<<<<<< HEAD
          const golpe = movidos.find((o) => o.x < 95 && o.x > 35);
=======
          const golpe = movidos.find((o) => o.x < 105 && o.x > 40);
>>>>>>> bb3769a (Agrego burbuja flotante del juego)

          if (golpe) {
            const accionActual = accionRef.current;

            if (
              (golpe.tipo === "bajo" && accionActual !== "brincando") ||
              (golpe.tipo === "alto" && accionActual !== "agachado")
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
<<<<<<< HEAD
            const cerca = nuevaX < 95 && nuevaX > 35;
=======
            const cerca = nuevaX < 105 && nuevaX > 40;
>>>>>>> bb3769a (Agrego burbuja flotante del juego)

            const puedeTomarla =
              (s.nivel === "alta" && accionRef.current === "brincando") ||
              (s.nivel === "baja" && accionRef.current !== "brincando");

            if (cerca && puedeTomarla && !estrellasCobradasRef.current.has(s.id)) {
              estrellasCobradasRef.current.add(s.id);
<<<<<<< HEAD

=======
>>>>>>> bb3769a (Agrego burbuja flotante del juego)
              playSound("star");

              scoreRef.current += 10;
              bonoRef.current += 10;
              estrellasRef.current += 1;

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
            } else if (nuevaX > -60 && !estrellasCobradasRef.current.has(s.id)) {
              restantes.push({ ...s, x: nuevaX });
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
  }, [crearObstaculo, crearEstrella, playSound, terminarJuego]);

  const tocarPantalla = (e) => {
    const y = e.clientY || e.touches?.[0]?.clientY;
    const mitad = window.innerHeight / 2;

    if (y < mitad) brincar();
    else agacharse();
  };

  return (
    <div className="corre-profe-game">
      <h1>🎮 Corre Profe, Corre</h1>

      <p className="corre-profe-descripcion">
        Ayuda al profe a sobrevivir a la carga administrativa y su jornada escolar.
      </p>

      <div className="corre-profe-marcador">
        <span>Puntos: {puntos}</span>
        <span>Nivel: {Math.floor(puntos / 200) + 1}</span>
        <span>🏆 Récord: {record}</span>
        <span>👤 {nombreRecord}</span>
        <span>⭐ {estrellasTomadas}</span>
      </div>

      <div
        className="corre-profe-escenario"
        onClick={tocarPantalla}
        style={{ backgroundImage: `url(${fondoActual})` }}
      >
        <div className={`corre-profe-personaje ${accion}`}>
          <img
            src={
              accion === "brincando"
                ? "/profe-brinca.png"
                : accion === "agachado"
                ? "/profe-agacha.png"
                : "/profe-corre.png"
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
            {o.icono}
          </div>
        ))}
<<<<<<< HEAD

        {estrellas.map((s) => (
          <div
            key={s.id}
            className={`corre-profe-estrella ${s.nivel}`}
            style={{ transform: `translateX(${s.x}px)` }}
          >
            ⭐
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
=======
>>>>>>> bb3769a (Agrego burbuja flotante del juego)

        {estrellas.map((s) => (
          <div
            key={s.id}
            className={`corre-profe-estrella ${s.nivel}`}
            style={{ transform: `translateX(${s.x}px)` }}
          >
            ⭐
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

              <button onClick={reiniciar}>
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