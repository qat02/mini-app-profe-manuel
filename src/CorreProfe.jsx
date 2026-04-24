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
  const puntosRef = useRef(0);
  const tiempoRef = useRef(0);
  const spawnRef = useRef(0);
  const starRef = useRef(0);
  const idRef = useRef(1);
  const mensajeDerrotaRef = useRef("");

  const playSound = (type) => {
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
      if (type === "duck") tone(260, 0.1);
      if (type === "star") {
        tone(780, 0.08);
        tone(1040, 0.1, 0.08);
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
  };

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

  const crearObstaculo = useCallback(
    (tipo, xExtra = 0) => {
      const lista = catalogo[tipo];
      const item = lista[Math.floor(Math.random() * lista.length)];

      return {
        id: idRef.current++,
        tipo,
        icono: item.icono,
        derrota: item.derrota,
        x: 740 + xExtra,
      };
    },
    [catalogo]
  );

  const crearEstrella = () => ({
    id: idRef.current++,
    x: 740,
    nivel: Math.random() > 0.5 ? "alta" : "baja",
  });

  const guardarNuevoRecord = (nombre) => {
    const limpio = nombre.trim() || "Profe anónimo";
    localStorage.setItem("recordProfe", puntos);
    localStorage.setItem("recordProfeNombre", limpio);
    setRecord(puntos);
    setNombreRecord(limpio);
    setNuevoRecord(false);
  };

  const reiniciar = useCallback(() => {
    playSound("restart");

    puntosRef.current = 0;
    tiempoRef.current = 0;
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
  }, []);

  const brincar = useCallback(() => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    playSound("jump");
    setAccion("brincando");
    setTimeout(() => setAccion("normal"), 720);
  }, [reiniciar]);

  const agacharse = useCallback(() => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    playSound("duck");
    setAccion("agachado");
    setTimeout(() => setAccion("normal"), 620);
  }, [reiniciar]);

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
        tiempoRef.current += dt;

        // La dificultad sube principalmente por velocidad, no por obstáculos amontonados.
        const velocidad = Math.min(145 + tiempoRef.current * 7.8, 430);

        // Obstáculos más separados para que se pueda avanzar.
        const intervalo = Math.max(2.1 - tiempoRef.current * 0.006, 1.35);

        // Dobles solo después de un rato y con poca probabilidad.
        const probabilidadDoble =
          tiempoRef.current < 35 ? 0 : Math.min((tiempoRef.current - 35) / 180, 0.18);

        puntosRef.current += dt * 7;
        setPuntos(Math.floor(puntosRef.current));

        spawnRef.current += dt;
        starRef.current += dt;

        if (spawnRef.current >= intervalo) {
          spawnRef.current = 0;

          const tipo1 = Math.random() > 0.5 ? "bajo" : "alto";
          const nuevos = [crearObstaculo(tipo1)];

          if (Math.random() < probabilidadDoble) {
            const tipo2 = Math.random() > 0.5 ? "bajo" : "alto";
            nuevos.push(crearObstaculo(tipo2, 300 + Math.random() * 120));
          }

          setObstaculos((prev) => [...prev, ...nuevos]);
        }

        if (starRef.current >= 5.6 + Math.random() * 2.6) {
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

            if (golpe.tipo === "bajo" && accionActual !== "brincando") {
              mensajeDerrotaRef.current = golpe.derrota;
              playSound("lose");
              setGameOver(true);

              if (Math.floor(puntosRef.current) > record) {
                playSound("record");
                setNuevoRecord(true);
              }
            }

            if (golpe.tipo === "alto" && accionActual !== "agachado") {
              mensajeDerrotaRef.current = golpe.derrota;
              playSound("lose");
              setGameOver(true);

              if (Math.floor(puntosRef.current) > record) {
                playSound("record");
                setNuevoRecord(true);
              }
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

            if (cerca && puedeTomarla) {
              playSound("star");
              puntosRef.current += 50;
              setPuntos(Math.floor(puntosRef.current));
              setEstrellasTomadas((v) => v + 1);
              setBonoTotal((v) => v + 50);

              setPlus((prevPlus) => [
                ...prevPlus,
                {
                  id: idRef.current++,
                  x: 90,
                  y: s.nivel === "alta" ? 80 : 135,
                },
              ]);
            } else if (nuevaX > -60) {
              restantes.push({ ...s, x: nuevaX });
            }
          });

          return restantes;
        });

        setPlus((prev) =>
          prev
            .map((p) => ({ ...p, y: p.y - 1.5 }))
            .filter((p) => p.y > 25)
        );
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [crearObstaculo, record]);

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
            +50 pts
          </div>
        ))}

        <div className="touch-zone touch-top">TOCA ARRIBA PARA BRINCAR</div>
        <div className="touch-zone touch-bottom">TOCA ABAJO PARA AGACHARTE</div>

        {gameOver && (
          <div className="corre-profe-game-over">
            <div className="game-over-profe">
              {nuevoRecord ? "🎉👨‍🏫" : "🤕👨‍🏫"}
            </div>

            <div className="game-over-texto">
              <h2>{nuevoRecord ? "¡Nuevo récord!" : "😵 Fin de la jornada"}</h2>
              <div className="puntaje-final">{puntos}</div>
              <p className="texto-puntaje">puntos totales</p>
              <p className="mensaje-derrota">{mensajeDerrotaRef.current}</p>

              <div className="resumen-bono">
                <p>⭐ Estrellas tomadas: {estrellasTomadas}</p>
                <p>🎁 Bono ganado: +{bonoTotal} pts</p>
              </div>

              {nuevoRecord && (
                <div className="nuevo-record-box">
                  <p>Escribe tu nombre para guardar el récord:</p>
                  <input
                    value={nombreJugador}
                    onChange={(e) => setNombreJugador(e.target.value)}
                    placeholder="Tu nombre"
                    maxLength="18"
                  />
                  <button onClick={() => guardarNuevoRecord(nombreJugador)}>
                    Guardar récord
                  </button>
                </div>
              )}

              {!nuevoRecord && <button onClick={reiniciar}>Reiniciar</button>}
              {nuevoRecord && <button onClick={reiniciar}>Jugar otra vez</button>}
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