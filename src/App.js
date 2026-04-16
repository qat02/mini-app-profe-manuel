import React, { useState } from 'react';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');

  const openLink = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  const getHeaderClass = () => {
    switch (screen) {
      case 'directores':
        return 'header-directores';
      case 'docentes':
        return 'header-docentes';
      case 'iaapps':
        return 'header-iaapps';
      case 'recursos':
        return 'header-recursos';
      default:
        return 'header-home';
    }
  };

  const getHeaderContent = () => {
    switch (screen) {
      case 'directores':
        return {
          gif: '/section-directores.gif',
          title: 'Directores',
          description: 'GPTs y herramientas pensadas para el trabajo directivo escolar.',
        };
      case 'docentes':
        return {
          gif: '/section-docentes.gif',
          title: 'Docentes',
          description: 'Recursos y GPTs útiles para la práctica diaria en el aula.',
        };
      case 'iaapps':
        return {
          gif: '/section-iaapps.gif',
          title: 'IA Apps',
          description: 'Aplicaciones de inteligencia artificial útiles para crear, organizar y producir.',
        };
      case 'recursos':
        return {
          gif: '/section-recursos.gif',
          title: 'Recursos',
          description: 'Materiales, documentos y apoyos listos para consultar o descargar.',
        };
      default:
        return {
          gif: '',
          title: '',
          description: '',
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="app-shell">
      <div className="social-float-group">
        <a
          href="https://www.facebook.com/ElProfeManuell/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float facebook-btn"
          aria-label="Facebook"
        >
          f
        </a>

        <a
          href="https://www.tiktok.com/@profemanuell?_r=1&_t=ZS-95atMTkUkbI"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float tiktok-btn"
          aria-label="TikTok"
        >
          ♪
        </a>

        <a
          href="https://sites.google.com/view/elprofemanuel/p%C3%A1gina-principal"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float web-btn"
          aria-label="Página web"
        >
          🌐
        </a>
      </div>

      <div className={`top-header ${getHeaderClass()}`}>
        {screen === 'home' ? (
          <>
            <img src="/logo512.png" alt="Logo Profe Manuel" className="top-logo top-logo-home" />
            <p className="home-mini-description">
              Aquí encontrarás herramientas, recursos y apoyos útiles para directores y docentes.
            </p>
          </>
        ) : (
          <>
            <img
              src={headerContent.gif}
              alt={headerContent.title}
              className="section-header-gif"
            />
            <h1 className="top-title">{headerContent.title}</h1>
            <p className="top-subtitle">{headerContent.description}</p>
          </>
        )}
      </div>

      <main className="main-content">
        {screen === 'home' && (
          <div className="home-grid">
            <div className="section-card blue" onClick={() => setScreen('directores')}>
              <img src="/directores.png" alt="Directores" className="section-card-image" />
              <h3>Directores</h3>
            </div>

            <div className="section-card green" onClick={() => setScreen('docentes')}>
              <img src="/docentes.png" alt="Docentes" className="section-card-image" />
              <h3>Docentes</h3>
            </div>

            <div className="section-card purple" onClick={() => setScreen('iaapps')}>
              <img src="/appsIA.png" alt="IA Apps" className="section-card-image" />
              <h3>IA Apps</h3>
            </div>

            <div className="section-card orange" onClick={() => setScreen('recursos')}>
              <img src="/recursos.png" alt="Recursos" className="section-card-image" />
              <h3>Recursos</h3>
            </div>

            <div className="section-card gray disabled-card">
              <img src="/otros.png" alt="Próximamente" className="section-card-image" />
              <h3>Próximamente</h3>
            </div>
          </div>
        )}

        {screen === 'directores' && (
          <div className="cards-grid">
            <div className="card" onClick={() => openLink('#')}>
              <img src="/documentia.png" alt="DocumentIA" className="card-image" />
              <h3>DocumentIA</h3>
              <p>Próximamente.</p>
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
              <p>Protocolos escolares y rutas de atención.</p>
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
              <p>Proceso de Mejora Continua con inteligencia artificial.</p>
            </div>

            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://drive.google.com/drive/folders/1eqaJUokhLa4AIuYXFncjPsS-lcVHEShs?usp=drive_link'
                )
              }
            >
              <img src="/12temascte.png" alt="12 Temas del CTE" className="card-image" />
              <h3>12 Temas del CTE</h3>
              <p>Carpeta con materiales y recursos de los 12 temas del CTE.</p>
            </div>
          </div>
        )}

        {screen === 'docentes' && (
          <div className="cards-grid">
            <div
              className="card"
              onClick={() =>
                openLink('https://chatgpt.com/g/g-68f2629b029c819181014a27162d44da-programia')
              }
            >
              <img src="/programia.png" alt="ProgramIA" className="card-image" />
              <h3>ProgramIA</h3>
              <p>Planeación y programa analítico.</p>
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
              <p>Proyectos interdisciplinarios y STEAM.</p>
            </div>

            <div className="card" onClick={() => openLink('#')}>
              <img src="/otros.png" alt="Otros" className="card-image" />
              <h3>Otros</h3>
              <p>Próximamente.</p>
            </div>
          </div>
        )}

        {screen === 'iaapps' && (
          <div className="cards-grid">
            <div className="card" onClick={() => openLink('https://notebooklm.google.com/')}>
              <img src="/notebooklm.png" alt="NotebookLM" className="card-image" />
              <h3>NotebookLM</h3>
              <p>Organización y análisis de documentos.</p>
            </div>

            <div className="card" onClick={() => openLink('https://gamma.app/es')}>
              <img src="/gamma.png" alt="Gamma" className="card-image" />
              <h3>Gamma</h3>
              <p>Presentaciones con IA.</p>
            </div>

            <div className="card" onClick={() => openLink('https://suno.com/create')}>
              <img src="/suno.png" alt="Suno" className="card-image" />
              <h3>Suno</h3>
              <p>Música y canciones con IA.</p>
            </div>
          </div>
        )}

        {screen === 'recursos' && (
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
              <p>Materiales y recursos descargables.</p>
            </div>

            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://drive.google.com/file/d/1DFun0axYjCxHe0Ze4DXhEbmgUVUrCAoE/view?usp=drive_link'
                )
              }
            >
              <img
                src="/manual de protocolos.png"
                alt="Manual de Protocolos"
                className="card-image"
              />
              <h3>Manual de Protocolos</h3>
              <p>Consulta rápida y descarga.</p>
            </div>

            <div
              className="card"
              onClick={() =>
                openLink(
                  'https://drive.google.com/drive/folders/1eqaJUokhLa4AIuYXFncjPsS-lcVHEShs?usp=drive_link'
                )
              }
            >
              <img src="/12temascte.png" alt="12 Temas del CTE" className="card-image" />
              <h3>12 Temas del CTE</h3>
              <p>Carpeta con materiales y recursos de los 12 temas del CTE.</p>
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button
          className={screen === 'directores' ? 'nav-item active nav-directores' : 'nav-item'}
          onClick={() => setScreen('directores')}
        >
          <img src="/nav-directores.gif" alt="Directores" className="nav-icon-img" />
          <small>Directores</small>
        </button>

        <button
          className={screen === 'docentes' ? 'nav-item active nav-docentes' : 'nav-item'}
          onClick={() => setScreen('docentes')}
        >
          <img src="/nav-docentes.gif" alt="Docentes" className="nav-icon-img" />
          <small>Docentes</small>
        </button>

        <button
          className={screen === 'home' ? 'nav-item active nav-home home-nav' : 'nav-item home-nav'}
          onClick={() => setScreen('home')}
        >
          <img src="/nav-home.gif" alt="Home" className="nav-icon-img" />
          <small>Home</small>
        </button>

        <button
          className={screen === 'iaapps' ? 'nav-item active nav-iaapps' : 'nav-item'}
          onClick={() => setScreen('iaapps')}
        >
          <img src="/nav-iaapps.gif" alt="IA Apps" className="nav-icon-img" />
          <small>IA Apps</small>
        </button>

        <button
          className={screen === 'recursos' ? 'nav-item active nav-recursos' : 'nav-item'}
          onClick={() => setScreen('recursos')}
        >
          <img src="/nav-recursos.gif" alt="Recursos" className="nav-icon-img" />
          <small>Recursos</small>
        </button>
      </nav>
    </div>
  );
}

export default App;