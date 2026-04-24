import { useEffect, useMemo, useRef, useState } from "react";
import "./CorreProfe.css";

export default function CorreProfe() {
  const [accion, setAccion] = useState("normal");
  const [puntos, setPuntos] = useState(0);
  const [record, setRecord] = useState(Number(localStorage.getItem("recordProfe")) || 0);
  const [gameOver, setGameOver] = useState(false);
  const [velocidad, setVelocidad] = useState(2600);
  const [obstaculo, setObstaculo] = useState({
    icono: "📚",
    tipo: "bajo",
    derrota: "Te vencieron las planeaciones.",
  });

  const personajeRef = useRef(null);
  const obstaculoRef = useRef(null);
  const animacionRef = useRef(null);
  const mensajeDerrotaRef = useRef("");

  const obstaculos = useMemo(
    () => [
      { icono: "📚", tipo: "bajo", derrota: "Te vencieron las planeaciones." },
      { icono: "📝", tipo: "bajo", derrota: "Te vencieron los exámenes sin revisar." },
      { icono: "👨‍💼", tipo: "bajo", derrota: "Te venció el director." },
      { icono: "👨‍👩‍👧", tipo: "alto", derrota: "Te vencieron los padres de familia." },
      { icono: "🧑‍🏫", tipo: "alto", derrota: "Te venció el ATP." },
      { icono: "📄", tipo: "alto", derrota: "Te vencieron los oficios urgentes." },
    ],
    []
  );

  const brincar = () => {
    if (gameOver) return reiniciar();
    if (accion !== "normal") return;

    setAccion("brincando");
    setTimeout(() => setAccion("normal"), 650);
  };

  const agacharse = () => {
    if (gameOver) return reiniciar();
    if (accion !== "normal") return;

    setAccion("agachado");
    setTimeout(() => setAccion("normal"), 500);
  };

  const reiniciar = () => {
    setPuntos(0);
    setVelocidad(2600);
    setGameOver(false);
    setAccion("normal");
    mensajeDerrotaRef.current = "";
  };

  const cambiarObstaculo = () => {
    const nuevo = obstaculos[Math.floor(Math.random() * obstaculos.length)];
    setObstaculo(nuevo);
    mensajeDerrotaRef.current = nuevo.derrota;
  };

  useEffect(() => {
    const tecla = (e) => {
      if (e.key === "ArrowUp") brincar();
      if (e.key === "ArrowDown") agacharse();
    };

    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });

  useEffect(() => {
    if (gameOver) return;

    const puntosInterval = setInterval(() => {
      setPuntos((p) => p + 1);
    }, 250);

    return () => clearInterval(puntosInterval);
  }, [gameOver]);

  useEffect(() => {
    if (puntos > record) {
      setRecord(puntos);
      localStorage.setItem("recordProfe", puntos);
    }

    if (puntos > 0 && puntos % 35 === 0) {
      setVelocidad((v) => Math.max(1300, v - 120));
    }
  }, [puntos, record]);

  useEffect(() => {
    if (gameOver) return;

    const revisarColision = () => {
      const personaje = personajeRef.current;
      const obstaculoActual = obstaculoRef.current;

      if (!personaje || !obstaculoActual) {
        animacionRef.current = requestAnimationFrame(revisarColision);
        return;
      }

      const p = personaje.getBoundingClientRect();
      const o = obstaculoActual.getBoundingClientRect();

      // Margen de perdón: hace que la colisión no sea tan estricta.
      const margenHorizontal = 18;
      const margenVertical = 14;

      const chocan =
        p.right - margenHorizontal > o.left + margenHorizontal &&
        p.left + margenHorizontal < o.right - margenHorizontal &&
        p.bottom - margenVertical > o.top + margenVertical &&
        p.top + margenVertical < o.bottom - margenVertical;

      if (chocan) {
        setGameOver(true);
        return;
      }

      animacionRef.current = requestAnimationFrame(revisarColision);
    };

    animacionRef.current = requestAnimationFrame(revisarColision);

    return () => cancelAnimationFrame(animacionRef.current);
  }, [gameOver, obstaculo]);

  const tocarPantalla = (e) => {
    const mitad = window.innerHeight / 2;
    const y = e.clientY || e.touches?.[0]?.clientY;

    if (y < mitad) {
      brincar();
    } else {
      agacharse();
    }
  };

  return (
    <div className="corre-profe-game">
      <h1>🎮 Corre Profe, Corre</h1>

      <p className="corre-profe-descripcion">
        Ayuda al profe a sobrevivir a la carga administrativa y su jornada escolar.
      </p>

      <div className="corre-profe-marcador">
        <span>Puntos: {puntos}</span>
        <span>Mejor jornada docente: {record}</span>
      </div>

      <div className="corre-profe-escenario" onClick={tocarPantalla}>
        <div ref={personajeRef} className={`corre-profe-personaje ${accion}`}>
          {accion === "agachado" ? "🙇‍♂️" : "👨‍🏫"}
        </div>

        {!gameOver && (
          <div
            key={`${obstaculo.icono}-${velocidad}`}
            ref={obstaculoRef}
            className={`corre-profe-obstaculo ${obstaculo.tipo}`}
            style={{ animationDuration: `${velocidad}ms` }}
            onAnimationIteration={cambiarObstaculo}
          >
            {obstaculo.icono}
          </div>
        )}

        <div className="touch-zone touch-top">TOCA ARRIBA PARA BRINCAR</div>
        <div className="touch-zone touch-bottom">TOCA ABAJO PARA AGACHARTE</div>

        {gameOver && (
          <div className="corre-profe-game-over">
            <h2>😵 Fin de la jornada</h2>
            <div className="puntaje-final">{puntos}</div>
            <p className="texto-puntaje">puntos logrados</p>
            <p className="mensaje-derrota">{mensajeDerrotaRef.current}</p>
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