import React, { useState } from 'react';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');

  const openLink = (url) => {
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="app-container">
      {screen === 'home' && (
        <div className="home-screen">
          <img src="/logo512.png" alt="Logo Profe Manuel" className="main-logo" />
          <h1>El Profe Manuel</h1>
          <p className="subtitle">Herramientas escolares, GPTs y recursos para directores y docentes</p>

          <div className="main-buttons">
            <button className="menu-button" onClick={() => setScreen('directores')}>
              Directores
            </button>

            <button className="menu-button" onClick={() => setScreen('docentes')}>
              Docentes
            </button>

            <button className="menu-button" onClick={() => setScreen('recursos')}>
              Recursos y Materiales
            </button>

            <button className="menu-button" onClick={() => setScreen('web')}>
              Profe Manuel Web
            </button>
          </div>
        </div>
      )}

      {screen === 'directores' && (
        <div className="section-screen">
          <button className="back-button" onClick={() => setScreen('home')}>
            ← Volver al inicio
          </button>

          <h2>Directores</h2>
          <p className="section-description">GPTs y herramientas para directivos escolares</p>

          <div className="cards-grid">
            <div className="card" onClick={() => openLink('#')}>
              <h3>DocumentIA</h3>
              <p>Próximamente</p>
            </div>

            <div className="card" onClick={() => openLink('https://chatgpt.com/g/g-68ddeab176ac8191b035788b7075ace6-protocolia-por-el-profe-manuel')}>
              <h3>ProtocolIA</h3>
              <p>Protocolos escolares y rutas de atención</p>
            </div>

            <div className="card" onClick={() => openLink('https://chatgpt.com/g/g-68d4988dac0c8191aab561ddce214c27-pmcia-por-el-profe-manuel')}>
              <h3>PMCIA</h3>
              <p>Proceso de Mejora Continua con IA</p>
            </div>
          </div>
        </div>
      )}

      {screen === 'docentes' && (
        <div className="section-screen">
          <button className="back-button" onClick={() => setScreen('home')}>
            ← Volver al inicio
          </button>

          <h2>Docentes</h2>

          <div className="category-block">
            <h3>GPTs</h3>
            <div className="cards-grid">
              <div className="card" onClick={() => openLink('https://chatgpt.com/g/g-68f2629b029c819181014a27162d44da-programia')}>
                <h3>ProgramIA</h3>
                <p>Herramienta para planeación y programa analítico</p>
              </div>

              <div className="card" onClick={() => openLink('https://chatgpt.com/g/g-691241908c3881918a4bb238304d10fc-proyectia-por-el-profe-manuel')}>
                <h3>ProyectIA</h3>
                <p>Proyectos interdisciplinarios y STEAM</p>
              </div>

              <div className="card" onClick={() => openLink('#')}>
                <h3>Otros</h3>
                <p>Próximamente</p>
              </div>
            </div>
          </div>

          <div className="category-block">
            <h3>Apps de IA</h3>
            <div className="cards-grid">
              <div className="card" onClick={() => openLink('https://notebooklm.google.com/')}>
                <h3>NotebookLM</h3>
                <p>Organización y análisis de documentos</p>
              </div>

              <div className="card" onClick={() => openLink('https://gamma.app/es')}>
                <h3>Gamma</h3>
                <p>Presentaciones con IA</p>
              </div>

              <div className="card" onClick={() => openLink('https://suno.com/create')}>
                <h3>Suno</h3>
                <p>Música y canciones con IA</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'recursos' && (
        <div className="section-screen">
          <button className="back-button" onClick={() => setScreen('home')}>
            ← Volver al inicio
          </button>

          <h2>Recursos y Materiales</h2>

          <div className="cards-grid">
            <div className="card" onClick={() => openLink('https://drive.google.com/file/d/1zA_hlSMTnHJZhcj_o7iNxBqwKvAPKlnF/view?usp=drive_link')}>
              <h3>Kahoot</h3>
              <p>Materiales y recursos descargables</p>
            </div>

            <div className="card" onClick={() => openLink('https://drive.google.com/file/d/1DFun0axYjCxHe0Ze4DXhEbmgUVUrCAoE/view?usp=drive_link')}>
              <h3>Manual de Protocolos</h3>
              <p>Consulta rápida y descarga</p>
            </div>
          </div>
        </div>
      )}

      {screen === 'web' && (
        <div className="section-screen">
          <button className="back-button" onClick={() => setScreen('home')}>
            ← Volver al inicio
          </button>

          <h2>Profe Manuel Web</h2>

          <div className="cards-grid">
            <div className="card" onClick={() => openLink('https://sites.google.com/view/elprofemanuel/p%C3%A1gina-principal')}>
              <h3>Entrar al sitio</h3>
              <p>Página principal del Profe Manuel</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;