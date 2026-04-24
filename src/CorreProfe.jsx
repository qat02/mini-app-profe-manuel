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

  const fondos = [
    "/fondo-1.png",
    "/fondo-2.png",
    "/fondo-3.png",
    "/fondo-4.png",
    "/fondo-5.png",
  ];

  const nivelActual = Math.floor(puntos / 200) + 1;
  const fondoActual = fondos[Math.floor((nivelActual - 1) / 2) % fondos.length];

  const catalogos = useMemo(() => [
    { bajo: ["📚","📝","🎒"], alto: ["📄","🔔","📢"] },
    { bajo: ["🐕","🐈","🐓"], alto: ["🦜","🦇","🦅"] },
    { bajo: ["🪑","📦","🪣"], alto: ["🧹","🪜","🧯"] },
    { bajo: ["🚧","🕳️","🌳"], alto: ["🚦","🪧","🚪"] },
    { bajo: ["👨‍💼","👨‍👩‍👧","🧑‍🏫"], alto: ["📋","📌","☁️"] }
  ], []);

  useEffect(() => {
    accionRef.current = accion;
    gameOverRef.current = gameOver;
  }, [accion, gameOver]);

  const crearObstaculo = useCallback((tipo, nivel, xExtra = 0) => {
    const grupo = Math.floor((nivel - 1) / 2) % catalogos.length;
    const lista = catalogos[grupo][tipo];
    const icono = lista[Math.floor(Math.random() * lista.length)];

    return {
      id: idRef.current++,
      tipo,
      icono,
      x: 820 + xExtra
    };
  }, [catalogos]);

  const crearEstrella = () => ({
    id: idRef.current++,
    x: 820,
    nivel: Math.random() > 0.5 ? "alta" : "baja"
  });

  const terminarJuego = () => {
    setPuntos(Math.floor(scoreRef.current));
    setGameOver(true);

    if (scoreRef.current > record) {
      setNuevoRecord(true);
    }
  };

  const reiniciar = () => {
    scoreRef.current = 0;
    bonoRef.current = 0;
    estrellasRef.current = 0;
    estrellasCobradasRef.current = new Set();

    spawnRef.current = 0;
    starRef.current = 0;

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
  };

  const brincar = () => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    setAccion("brincando");
    setTimeout(() => setAccion("normal"), 700);
  };

  const agacharse = () => {
    if (gameOverRef.current) return reiniciar();
    if (accionRef.current !== "normal") return;

    setAccion("agachado");
    setTimeout(() => setAccion("normal"), 500);
  };

  useEffect(() => {
    const tecla = (e) => {
      if (e.key === "ArrowUp") brincar();
      if (e.key === "ArrowDown") agacharse();
    };

    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);

  useEffect(() => {
    let raf;
    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!gameOverRef.current) {
        const nivel = Math.floor(scoreRef.current / 200) + 1;

        const velocidad =
          nivel <= 5 ? 160 + nivel * 30 : 310 + (nivel - 5) * 55;

        const intervalo =
          nivel <= 5
            ? Math.max(2.2 - nivel * 0.05, 1.8)
            : Math.max(1.8 - (nivel - 5) * 0.08, 1.1);

        scoreRef.current += dt * 7;
        setPuntos(Math.floor(scoreRef.current));

        spawnRef.current += dt;
        starRef.current += dt;

        if (spawnRef.current >= intervalo) {
          spawnRef.current = 0;
          const tipo = Math.random() > 0.5 ? "bajo" : "alto";
          setObstaculos(prev => [...prev, crearObstaculo(tipo, nivel)]);
        }

        setObstaculos(prev =>
          prev.map(o => ({ ...o, x: o.x - velocidad * dt }))
              .filter(o => o.x > -80)
        );

        const colision = obstaculos.find(o => o.x < 100 && o.x > 40);

        if (colision) {
          if (
            (colision.tipo === "bajo" && accionRef.current !== "brincando") ||
            (colision.tipo === "alto" && accionRef.current !== "agachado")
          ) {
            terminarJuego();
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [obstaculos, crearObstaculo]);

  const tocarPantalla = (e) => {
    const y = e.clientY || e.touches?.[0]?.clientY;
    if (y < window.innerHeight / 2) brincar();
    else agacharse();
  };

  return (
    <div className="corre-profe-game">

      <h1>🎮 Corre Profe, Corre</h1>

      <div className="corre-profe-marcador">
        <span>Puntos: {puntos}</span>
        <span>Nivel: {nivelActual}</span>
        <span>🏆 Récord: {record}</span>
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

        {obstaculos.map(o => (
          <div
            key={o.id}
            className={`corre-profe-obstaculo ${o.tipo}`}
            style={{ transform: `translateX(${o.x}px)` }}
          >
            {o.icono}
          </div>
        ))}

        {gameOver && (
          <div className="corre-profe-game-over">
            <div className="game-over-profe">
              <img src="/profe-lose.png" alt="lose" />
            </div>

            <div className="game-over-texto">
              <h2>Fin de la jornada</h2>
              <div className="puntaje-final">{puntos}</div>
              <button onClick={reiniciar}>Reiniciar</button>
            </div>
          </div>
        )}

      </div>

      <div className="corre-profe-controles">
        <button onClick={brincar}>⬆️</button>
        <button onClick={agacharse}>⬇️</button>
      </div>

    </div>
  );
}