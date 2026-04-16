import React, { useState } from 'react';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');

  const openLink = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="app-container">
      {screen === 'home' && (
        <div className="home-screen">
          <img src="/logo512.png" alt="Logo Profe Manuel" className="main-logo" />
          <h1>El Profe Manuel</h1>
          <p className="subtitle">
            Herramientas escolares con IA, GPTs y recursos para directores y docentes
          </p>

          <div className="main-buttons">
            <div className="menu-card" onClick={() => setScreen('directores')}>
              <img src="/directores.png" alt="Directores" className="menu-card-image" />
              <h3>Directores</h3>
            </div>

            <div className="menu-card" onClick={() => setScreen('docentes')}>
              <img src="/docentes.png" alt="Docentes" className="menu-card-image" />
              <h3>Docentes</h3>
            </div>

            <div className="menu-card" onClick={() => setScreen('iaapps')}>
              <img src="/appsIA.png" alt="IA Apps" className="menu-card-image" />
              <h3>IA Apps</h3>
            </div>

            <div className="menu-card" onClick={() => setScreen('recursos')}>
              <img src="/recursos.png" alt="Recursos y Materiales" className="menu-card-image" />
              <h3>Recursos y Materiales</h3>
            </div>

            <div className="menu-card" onClick={() => setScreen('web')}>
              <img src="/web.png" alt="Profe Manuel Web" className="menu-card-image" />
              <h3>Profe Manuel Web</h3>
            </div>
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
              <img src="/documentia.png" alt="DocumentIA" className="card-image" />
              <h3>DocumentIA</h3>
              <p>Próximamente</p>
            </div>

            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://chatgpt.com/g/g-68ddeab176ac8191b035788b7075ace6-protocolia-por-el-profe-manuel'
                )
              }
            >
              <img src="/protocolia.png" alt="ProtocolIA" className="card-image" />
              <h3>ProtocolIA</h3>
              <p>Protocolos escolares y rutas de actuación</p>
            </div>

            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://chatgpt.com/g/g-68d4988dac0c8191aab561ddce214c27-pmcia-por-el-profe-manuel'
                )
              }
            >
              <img src="/pmcia.png" alt="PMCIA" className="card-image" />
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
          <p className="section-description">GPTs para el trabajo docente</p>

          <div className="cards-grid">
            <div
              className="card"
              onClick={() =>
                openLink('https://chatgpt.com/g/g-68f2629b029c819181014a27162d44da-programia')
              }
            >
              <img src="/programia.png" alt="ProgramIA" className="card-image" />
              <h3>ProgramIA</h3>
              <p>Herramienta para el desarollo del Programa Analítico con IA</p>
            </div>

            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://chatgpt.com/g/g-691241908c3881918a4bb238304d10fc-proyectia-por-el-profe-manuel'
                )
              }
            >
              <img src="/proyectia.png" alt="ProyectIA" className="card-image" />
              <h3>ProyectIA</h3>
              <p>Generador para la Planeación por Proyectos con IA</p>
            </div>

            <div className="card" onClick={() => openLink('#')}>
              <img src="/otros.png" alt="Otros" className="card-image" />
              <h3>Otros</h3>
              <p>Próximamente</p>
            </div>
          </div>
        </div>
      )}

      {screen === 'iaapps' && (
        <div className="section-screen">
          <button className="back-button" onClick={() => setScreen('home')}>
            ← Volver al inicio
          </button>

          <h2>IA Apps</h2>
          <p className="section-description">Aplicaciones útiles con inteligencia artificial</p>

          <div className="cards-grid">
            <div className="card" onClick={() => openLink('https://notebooklm.google.com/')}>
              <img src="/notebooklm.png" alt="NotebookLM" className="card-image" />
              <h3>NotebookLM</h3>
              <p>Generador de video, presentaciones e infografías con IA</p>
            </div>

            <div className="card" onClick={() => openLink('https://gamma.app/es')}>
              <img src="/gamma.png" alt="Gamma" className="card-image" />
              <h3>Gamma</h3>
              <p>Generador de presentaciones con IA</p>
            </div>

            <div className="card" onClick={() => openLink('https://suno.com/create')}>
              <img src="/suno.png" alt="Suno" className="card-image" />
              <h3>Suno</h3>
              <p>Generador de música y canciones con IA</p>
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
          <p className="section-description">Materiales didácticos y recursos de apoyo para el docente</p>

          <div className="cards-grid">
            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://drive.google.com/file/d/1zA_hlSMTnHJZhcj_o7iNxBqwKvAPKlnF/view?usp=drive_link'
                )
              }
            >
              <img src="/kahoot.png" alt="Kahoot" className="card-image" />
              <h3>Kahoot</h3>
              <p>Quizzes divertidos para comprobar aprendizajes</p>
            </div>

            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://drive.google.com/file/d/1DFun0axYjCxHe0Ze4DXhEbmgUVUrCAoE/view?usp=drive_link'
                )
              }
            >
              <img src="/manual de protocolos.png" alt="Manual de Protocolos" className="card-image" />
              <h3>Manual de Protocolos</h3>
              <p>Rutas de Actuación</p>
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
          <p className="section-description">Acceso al sitio principal del Profe Manuel</p>

          <div className="cards-grid one-card">
            <div
              className="card"
              onClick={() =>
                openLink('https://sites.google.com/view/elprofemanuel/p%C3%A1gina-principal')
              }
            >
              <img src="/web.png" alt="Profe Manuel Web" className="card-image" />
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