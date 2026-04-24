import { useEffect, useRef, useState } from "react";
import "./CorreProfe.css";

export default function CorreProfe() {
  const [accion, setAccion] = useState("normal");
  const [puntos, setPuntos] = useState(0);
  const [record, setRecord] = useState(Number(localStorage.getItem("recordProfe")) || 0);
  const [gameOver, setGameOver] = useState(false);
  const [velocidad, setVelocidad] = useState(2200);
  const [obstaculo, setObstaculo] = useState({ icono: "📚", tipo: "bajo", frase: "¡Brincaste las planeaciones!" });

  const fraseRef = useRef("");

  const obstaculos = [
    { icono: "📚", tipo: "bajo", frase: "¡Brincaste las planeaciones!" },
    { icono: "📝", tipo: "bajo", frase: "¡Superaste los exámenes!" },
    { icono: "👨‍💼", tipo: "bajo", frase: "¡Sobreviviste al director!" },
    { icono: "👨‍👩‍👧", tipo: "alto", frase: "¡Recibiste al padre de familia!" },
    { icono: "🧑‍🏫", tipo: "alto", frase: "¡Superaste al ATP!" },
    { icono: "📄", tipo: "alto", frase: "¡Esquivaste los oficios!" },
  ];

  const brincar = () => {
    if (gameOver) return reiniciar();
    if (accion !== "normal") return;
    setAccion("brincando");
    setTimeout(() => setAccion("normal"), 550);
  };

  const agacharse = () => {
    if (gameOver) return reiniciar();
    if (accion !== "normal") return;
    setAccion("agachado");
    setTimeout(() => setAccion("normal"), 550);
  };

  const reiniciar = () => {
    setPuntos(0);
    setVelocidad(2200);
    setGameOver(false);
    setAccion("normal");
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
    }, 300);

    return () => clearInterval(puntosInterval);
  }, [gameOver]);

  useEffect(() => {
    if (puntos > record) {
      setRecord(puntos);
      localStorage.setItem("recordProfe", puntos);
    }

    if (puntos > 0 && puntos % 25 === 0) {
      setVelocidad((v) => Math.max(900, v - 100));
    }
  }, [puntos, record]);

  useEffect(() => {
    if (gameOver) return;

    const cambio = setInterval(() => {
      const nuevo = obstaculos[Math.floor(Math.random() * obstaculos.length)];
      setObstaculo(nuevo);
      fraseRef.current = nuevo.frase;
    }, velocidad);

    return () => clearInterval(cambio);
  }, [velocidad, gameOver]);

  const revisarChoque = () => {
    if (obstaculo.tipo === "bajo" && accion !== "brincando") {
      setGameOver(true);
    }

    if (obstaculo.tipo === "alto" && accion !== "agachado") {
      setGameOver(true);
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

      <div className="corre-profe-escenario">
        <div className={`corre-profe-personaje ${accion}`}>
          {accion === "agachado" ? "🙇‍♂️" : "👨‍🏫"}
        </div>

        {!gameOver && (
          <div
            className={`corre-profe-obstaculo ${obstaculo.tipo}`}
            style={{ animationDuration: `${velocidad}ms` }}
            onAnimationIteration={revisarChoque}
          >
            {obstaculo.icono}
          </div>
        )}

        {gameOver && (
          <div className="corre-profe-game-over">
            <h2>😵 Fin de la jornada</h2>
            <p>{fraseRef.current}</p>
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