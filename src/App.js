import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const gpts = [
    {
      title: "ProtocolIA",
      description:
        "Genera protocolos escolares, actas de hechos y rutas de atención de forma práctica y rápida.",
      image: "/protocolia.png",
      link: "https://chatgpt.com/g/g-68ddeab176ac8191b035788b7075ace6-protocolia-por-el-profe-manuel",
      active: true,
    },
    {
      title: "PMCIA",
      description:
        "Apoya la construcción y mejora del Proceso de Mejora Continua con ayuda de inteligencia artificial.",
      image: "/pmcia.png",
      link: "https://chatgpt.com/g/g-68d4988dac0c8191aab561ddce214c27-pmcia-por-el-profe-manuel",
      active: true,
    },
    {
      title: "DocumentIA",
      description:
        "Crea, mejora y organiza documentos escolares y educativos de forma sencilla.",
      image: "/documentia.png",
      link: "#",
      active: false,
    },
  ];

  if (loading) {
    return (
      <div className="splash">
        <img src="/logo.png" alt="Logo" className="splash-logo" />
        <h1>El Profe Manuel</h1>
        <p>Cargando herramientas...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <img src="/logo.png" alt="Logo" className="header-logo" />
        <div>
          <h1>Herramientas IA del Profe Manuel</h1>
          <p>Acceso directo a mis GPTs educativos</p>
        </div>
      </header>

      <main className="container">
        {gpts.map((gpt, index) =>
          gpt.active ? (
            <a
              key={index}
              href={gpt.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <img src={gpt.image} alt={gpt.title} className="card-image" />
              <div className="card-body">
                <h2>{gpt.title}</h2>
                <p>{gpt.description}</p>
                <span className="button">Abrir GPT</span>
              </div>
            </a>
          ) : (
            <div key={index} className="card inactive-card">
              <img src={gpt.image} alt={gpt.title} className="card-image" />
              <div className="card-body">
                <h2>{gpt.title}</h2>
                <p>{gpt.description}</p>
                <span className="button disabled">Próximamente</span>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}