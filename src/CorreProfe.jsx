import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./CorreProfe.css";

export default function CorreProfe() {
  const [accion, setAccion] = useState("normal");
  const [puntos, setPuntos] = useState(0);
  const [record, setRecord] = useState(Number(localStorage.getItem("recordProfe")) || 0);
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

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "jump") {
        oscillator.frequency.value = 520;
        gainNode.gain.value = 0.08;
      }

      if (type === "star") {
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.1;
      }

      if (type === "lose") {
        oscillator.frequency.value = 180;
        gainNode.gain.value = 0.12;
      }

      oscillator.type = "sine";
      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, type === "lose" ? 400 : 120);
    } catch (error) {
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

  useEffect(() => {
    if (puntos > record) {
      setRecord(puntos);
      localStorage.setItem("recordProfe", puntos);
    }
  }, [puntos, record]);

  const crearObstaculo = useCallback(
    (tipo, xExtra = 0) => {
      const lista = catalogo[tipo];
      const item = lista[Math.floor(Math.random() * lista.length)];

      return {
        id: idRef.current++,
        tipo,
        icono: item.icono,
        derrota: item.derrota,
        x: 650 + xExtra,
      };
    },
    [catalogo]
  );

  const crearEstrella = () => ({
    id: idRef.current++,
    x: 650,
    nivel: Math.random() > 0.5 ? "alta" : "baja",
  });

  const brincar = useCallback(() => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    playSound("jump");
    setAccion("brincando");
    setTimeout(() => setAccion("normal"), 680);
  }, []);

  const agacharse = useCallback(() => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    setAccion("agachado");
    setTimeout(() => setAccion("normal"), 520);
  }, []);

  function reiniciar() {
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
  }

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

        const velocidad = Math.min(170 + tiempoRef.current * 8, 430);
        const intervalo = Math.max(1.45 - tiempoRef.current * 0.015, 0.72);
        const probabilidadDoble = Math.min(tiempoRef.current / 90, 0.42);

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
            nuevos.push(crearObstaculo(tipo2, 135 + Math.random() * 70));
          }

          setObstaculos((prev) => [...prev, ...nuevos]);
        }

        if (starRef.current >= 4.8 + Math.random() * 2) {
          starRef.current = 0;
          setEstrellas((prev) => [...prev, crearEstrella()]);
        }

        setObstaculos((prev) => {
          const movidos = prev
            .map((o) => ({ ...o, x: o.x - velocidad * dt }))
            .filter((o) => o.x > -80);

          const golpe = movidos.find((o) => o.x < 95 && o.x > 35);

          if (golpe) {
            const accionActual = accionRef.current;

            if (golpe.tipo === "bajo" && accionActual !== "brincando") {
              mensajeDerrotaRef.current = golpe.derrota;
              playSound("lose");
              setGameOver(true);
            }

            if (golpe.tipo === "alto" && accionActual !== "agachado") {
              mensajeDerrotaRef.current = golpe.derrota;
              playSound("lose");
              setGameOver(true);
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
  }, [crearObstaculo]);

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
        <span>Récord: {record}</span>
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
            <h2>😵 Fin de la jornada</h2>
            <div className="puntaje-final">{puntos}</div>
            <p className="texto-puntaje">puntos totales</p>
            <p className="mensaje-derrota">{mensajeDerrotaRef.current}</p>

            <div className="resumen-bono">
              <p>⭐ Estrellas tomadas: {estrellasTomadas}</p>
              <p>🎁 Bono ganado: +{bonoTotal} pts</p>
            </div>

            <button onClick={reiniciar}>Reiniciar</button>
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