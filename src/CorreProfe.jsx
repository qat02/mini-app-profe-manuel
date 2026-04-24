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

  const puntosBaseRef = useRef(0);
  const bonoTotalRef = useRef(0);
  const estrellasTomadasRef = useRef(0);
  const estrellasCobradasRef = useRef(new Set());

  const spawnRef = useRef(0);
  const starRef = useRef(0);
  const idRef = useRef(1);
  const mensajeDerrotaRef = useRef("");

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

  const catalogo = useMemo(
    () => ({
      bajo: [
        { icono: "📚", derrota: "Te vencieron las planeaciones." },
        { icono: "📝", derrota: "Te vencieron los exámenes." },
        { icono: "👨‍💼", derrota: "Te venció el director." },
      ],
      alto: [
        { icono: "👨‍👩‍👧", derrota: "Te vencieron los padres de familia." },
        { icono: "🧑‍🏫", derrota: "Te venció el ATP." },
        { icono: "📄", derrota: "Te vencieron los oficios urgentes." },
      ],
    }),
    []
  );

  useEffect(() => {
    accionRef.current = accion;
  }, [accion]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const obtenerTotal = () => {
    return Math.floor(puntosBaseRef.current) + bonoTotalRef.current;
  };

  const crearObstaculo = useCallback(
    (tipo, xExtra = 0) => {
      const lista = catalogo[tipo];
      const item = lista[Math.floor(Math.random() * lista.length)];

      return {
        id: idRef.current++,
        tipo,
        icono: item.icono,
        derrota: item.derrota,
        x: 820 + xExtra,
      };
    },
    [catalogo]
  );

  const crearEstrella = useCallback(
    () => ({
      id: idRef.current++,
      x: 820,
      nivel: Math.random() > 0.5 ? "alta" : "baja",
    }),
    []
  );

  const guardarNuevoRecord = (nombre) => {
    const limpio = nombre.trim() || "Profe anónimo";
    const total = obtenerTotal();

    localStorage.setItem("recordProfe", total);
    localStorage.setItem("recordProfeNombre", limpio);

    setRecord(total);
    setNombreRecord(limpio);
    setNuevoRecord(false);
  };

  const terminarJuego = useCallback(
    (mensaje) => {
      const totalFinal = Math.floor(puntosBaseRef.current) + bonoTotalRef.current;

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

  const reiniciar = useCallback(() => {
    playSound("restart");

    puntosBaseRef.current = 0;
    bonoTotalRef.current = 0;
    estrellasTomadasRef.current = 0;
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
        const totalActual = Math.floor(puntosBaseRef.current) + bonoTotalRef.current;
        const nivel = Math.floor(totalActual / 200) + 1;

        const velocidad = 150 + nivel * 18;
        const intervalo = Math.max(2.35 - nivel * 0.025, 1.75);
        const probabilidadDoble =
          nivel < 6 ? 0 : Math.min((nivel - 5) * 0.015, 0.12);

        puntosBaseRef.current += dt * 7;
        setPuntos(Math.floor(puntosBaseRef.current) + bonoTotalRef.current);

        spawnRef.current += dt;
        starRef.current += dt;

        if (spawnRef.current >= intervalo) {
          spawnRef.current = 0;

          const tipo1 = Math.random() > 0.5 ? "bajo" : "alto";
          const nuevos = [crearObstaculo(tipo1)];

          if (Math.random() < probabilidadDoble) {
            const tipo2 = Math.random() > 0.5 ? "bajo" : "alto";
            nuevos.push(crearObstaculo(tipo2, 520 + Math.random() * 180));
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

          const golpe = movidos.find((o) => o.x < 95 && o.x > 35);

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
            const cerca = nuevaX < 95 && nuevaX > 35;

            const puedeTomarla =
              (s.nivel === "alta" && accionRef.current === "brincando") ||
              (s.nivel === "baja" && accionRef.current !== "brincando");

            if (cerca && puedeTomarla && !estrellasCobradasRef.current.has(s.id)) {
              estrellasCobradasRef.current.add(s.id);

              playSound("star");

              bonoTotalRef.current += 10;
              estrellasTomadasRef.current += 1;

              const totalActualizado =
                Math.floor(puntosBaseRef.current) + bonoTotalRef.current;

              setPuntos(totalActualizado);
              setEstrellasTomadas(estrellasTomadasRef.current);
              setBonoTotal(bonoTotalRef.current);

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

      <div className="corre-profe-escenario" onClick={tocarPantalla}>
        <div className={`corre-profe-personaje ${accion}`}>
          {accion === "agachado" ? "🙇‍♂️" : "👨‍🏫"}
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

        <div className="touch-zone touch-top">TOCA ARRIBA PARA BRINCAR</div>
        <div className="touch-zone touch-bottom">TOCA ABAJO PARA AGACHARTE</div>

        {gameOver && (
          <div className="corre-profe-game-over" onClick={(e) => e.stopPropagation()}>
            <div className="game-over-profe">{nuevoRecord ? "🎉👨‍🏫" : "🤕👨‍🏫"}</div>

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