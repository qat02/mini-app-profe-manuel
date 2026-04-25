import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import CorreProfe from './CorreProfe';

function App() {
  const [screen, setScreen] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const imagesToPreload = [
      '/section-directores.gif',
      '/section-docentes.gif',
      '/section-iaapps.gif',
      '/section-juego.gif',
      '/section-recursos.gif',
      '/nav-directores.gif',
      '/nav-docentes.gif',
      '/nav-home.gif',
      '/nav-iaapps.gif',
      '/nav-recursos.gif',
      '/logo512.png',
      '/directores.png',
      '/docentes.png',
      '/appsIA.png',
      '/recursos.png',
      '/otros.png',
      '/documentia.png',
      '/protocolia.png',
      '/pmcia.png',
      '/programia.png',
      '/proyectia.png',
      '/notebooklm.png',
      '/gamma.png',
      '/suno.png',
      '/kahoot.png',
      '/manual de protocolos.png',
      '/12temascte.png',
      '/icono-juego.png',
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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
      case 'juego':
        return 'header-juegos';
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
      case 'juego':
        return {
          gif: '/section-juego.gif',
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

  const getCardClass = () => {
    switch (screen) {
      case 'directores':
        return 'card-directores';
      case 'docentes':
        return 'card-docentes';
      case 'iaapps':
        return 'card-iaapps';
      case 'recursos':
        return 'card-recursos';
      case 'juegos':
        return 'card-juegos';  
      default:
        return '';
    }
  };

  const searchItems = useMemo(
    () => [
      {
        title: 'Directores',
        description: 'Gestión escolar y organización directiva.',
        image: '/directores.png',
        action: () => setScreen('directores'),
      },
      {
        title: 'Docentes',
        description: 'Planeación, apoyo y recursos para el aula.',
        image: '/docentes.png',
        action: () => setScreen('docentes'),
      },
      {
        title: 'IA Apps',
        description: 'Apps útiles para crear, organizar y producir.',
        image: '/appsIA.png',
        action: () => setScreen('iaapps'),
      },
      {
        title: 'Recursos',
        description: 'Materiales, documentos y apoyos listos.',
        image: '/recursos.png',
        action: () => setScreen('recursos'),
      },
      {
        title: 'Mini Juegos',
        description: 'Diviértete superando los retos.',
        image: '/icono-juego.png',
        action: () => setScreen('juego'),
      },
      {
        title: 'ProtocolIA',
        description: 'Protocolos escolares y rutas de atención.',
        image: '/protocolia.png',
        action: () =>
          openLink(
            'https://chatgpt.com/g/g-68ddeab176ac8191b035788b7075ace6-protocolia-por-el-profe-manuel'
          ),
      },
      {
        title: 'PMCIA',
        description: 'Proceso de Mejora Continua con inteligencia artificial.',
        image: '/pmcia.png',
        action: () =>
          openLink(
            'https://chatgpt.com/g/g-68d4988dac0c8191aab561ddce214c27-pmcia-por-el-profe-manuel'
          ),
      },
      {
        title: 'Ruta de Actividades',
        description: 'GPT para organizar actividades y dar seguimiento al trabajo.',
        image: '/pmcia.png',
        action: () =>
          openLink(
            'https://chatgpt.com/g/g-68d4988dac0c8191aab561ddce214c27-pmcia-por-el-profe-manuel'
          ),
      },
      {
        title: 'ProgramIA',
        description: 'Planeación y programa analítico.',
        image: '/programia.png',
        action: () =>
          openLink('https://chatgpt.com/g/g-68f2629b029c819181014a27162d44da-programia'),
      },
      {
        title: 'ProyectIA',
        description: 'Proyectos interdisciplinarios y STEAM.',
        image: '/proyectia.png',
        action: () =>
          openLink(
            'https://chatgpt.com/g/g-691241908c3881918a4bb238304d10fc-proyectia-por-el-profe-manuel'
          ),
      },
      {
        title: 'DocumentIA',
        description: 'Actas, exhortos y documentos escolares.',
        image: '/documentia.png',
        action: () =>
          openLink(
            'https://chatgpt.com/g/g-69e3bdd04f8081919a1b6ba9af0c41de-documentia-por-el-profe-manuel'
          ),
      },
      {
        title: 'NotebookLM',
        description: 'Organización y análisis de documentos.',
        image: '/notebooklm.png',
        action: () => openLink('https://notebooklm.google.com/'),
      },
      {
        title: 'Gamma',
        description: 'Presentaciones con IA.',
        image: '/gamma.png',
        action: () => openLink('https://gamma.app/es'),
      },
      {
        title: 'Suno',
        description: 'Música y canciones con IA.',
        image: '/suno.png',
        action: () => openLink('https://suno.com/create'),
      },
      {
        title: 'Kahoot',
        description: 'Materiales y recursos descargables.',
        image: '/kahoot.png',
        action: () =>
          openLink(
            'https://drive.google.com/file/d/1zA_hlSMTnHJZhcj_o7iNxBqwKvAPKlnF/view?usp=drive_link'
          ),
      },
      {
        title: 'Manual de Protocolos',
        description: 'Consulta rápida y descarga.',
        image: '/manual de protocolos.png',
        action: () =>
          openLink(
            'https://drive.google.com/file/d/1DFun0axYjCxHe0Ze4DXhEbmgUVUrCAoE/view?usp=drive_link'
          ),
      },
      {
        title: '12 Temas del CTE',
        description: 'Carpeta con materiales y recursos del CTE.',
        image: '/12temascte.png',
        action: () =>
          openLink(
            'https://drive.google.com/drive/folders/1eqaJUokhLa4AIuYXFncjPsS-lcVHEShs?usp=drive_link'
          ),
      },
    ],
    []
  );

  const filteredSearchItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );
  }, [searchItems, searchTerm]);

  return (
    <div className="app-shell">
      <div className="page-glow"></div>

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

      {screen !== 'juego' && (
        <button
          className="game-bubble"
          onClick={() => setScreen('juego')}
          aria-label="Abrir Corre Profe Corre"
        >
          <img src="/icono-juego.png" alt="Juego" />
        </button>
      )}

      <a
        href="https://m.me/ElProfeManuell"
        target="_blank"
        rel="noopener noreferrer"
        className="messenger-bubble"
        aria-label="Mandar mensaje por Facebook"
      >
        <span className="messenger-bubble-icon">✉</span>
        <span className="messenger-bubble-text">Manda mensaje</span>
      </a>

      <div className={`top-header ${getHeaderClass()} fade-up`}>
        {screen === 'home' ? (
          <>
            <img src="/logo512.png" alt="Logo Profe Manuel" className="top-logo top-logo-home" />

            <div className="search-bar-wrapper">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar recurso, app o herramienta"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
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

      <main className="main-content fade-up">
        {screen === 'home' && (
          <>
            {searchTerm.trim() !== '' ? (
              <div className="cards-grid compact-grid search-results-grid">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map((item, index) => (
                    <div key={index} className="card card-home-search" onClick={item.action}>
                      <img src={item.image} alt={item.title} className="card-image" />
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No encontré coincidencias con esa búsqueda.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="home-grid">
                <div className="section-card blue" onClick={() => setScreen('directores')}>
                  <img src="/directores.png" alt="Directores" className="section-card-image" />
                  <div className="section-card-body">
                    <h3>Directores</h3>
                    <p>Gestión escolar y organización directiva.</p>
                  </div>
                </div>

                <div className="section-card green" onClick={() => setScreen('docentes')}>
                  <img src="/docentes.png" alt="Docentes" className="section-card-image" />
                  <div className="section-card-body">
                    <h3>Docentes</h3>
                    <p>Planeación, apoyo y recursos para el aula.</p>
                  </div>
                </div>

                <div className="section-card purple" onClick={() => setScreen('iaapps')}>
                  <img src="/appsIA.png" alt="IA Apps" className="section-card-image" />
                  <div className="section-card-body">
                    <h3>IA Apps</h3>
                    <p>Apps útiles para crear, organizar y producir.</p>
                  </div>
                </div>

                <div className="section-card orange" onClick={() => setScreen('recursos')}>
                  <img src="/recursos.png" alt="Recursos" className="section-card-image" />
                  <div className="section-card-body">
                    <h3>Recursos</h3>
                    <p>Materiales, documentos y apoyos listos.</p>
                  </div>
                </div>

                <div className="section-card green" onClick={() => setScreen('juego')}>
                  <img src="/icono-juego.png" alt="Corre Profe Corre" className="section-card-image" />
                  <div className="section-card-body">
                    <h3>Mini Juegos</h3>
                    <p>Diviértete superando los retos.</p>
                  </div>
                </div>

                <div className="section-card gray disabled-card">
                  <img src="/otros.png" alt="Próximamente" className="section-card-image" />
                  <div className="section-card-body">
                    <h3>Próximamente</h3>
                    <p>Más herramientas y materiales en camino.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {screen === 'directores' && (
          <div className="cards-grid compact-grid">
            <div
              className={`card ${getCardClass()}`}
              onClick={() =>
                openLink(
                  'https://chatgpt.com/g/g-69e3bdd04f8081919a1b6ba9af0c41de-documentia-por-el-profe-manuel'
                )
              }
            >
              <img src="/documentia.png" alt="DocumentIA" className="card-image" />
              <h3>DocumentIA</h3>
              <p>Actas, exhortos y documentos escolares.</p>
            </div>

            <div
              className={`card ${getCardClass()}`}
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
              className={`card ${getCardClass()}`}
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
              className={`card ${getCardClass()}`}
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
              className={`card ${getCardClass()}`}
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
          <div className="cards-grid compact-grid">
            <div
              className={`card ${getCardClass()}`}
              onClick={() =>
                openLink('https://chatgpt.com/g/g-68f2629b029c819181014a27162d44da-programia')
              }
            >
              <img src="/programia.png" alt="ProgramIA" className="card-image" />
              <h3>ProgramIA</h3>
              <p>Planeación y programa analítico.</p>
            </div>

            <div
              className={`card ${getCardClass()}`}
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

            <div
              className={`card ${getCardClass()}`}
              onClick={() =>
                openLink(
                  'https://chatgpt.com/g/g-68d4988dac0c8191aab561ddce214c27-pmcia-por-el-profe-manuel'
                )
              }
            >
              <img src="/pmcia.png" alt="Ruta de Actividades" className="card-image" />
              <h3>Ruta de Actividades</h3>
              <p>GPT para organizar actividades y dar seguimiento al trabajo.</p>
            </div>

            <div
              className={`card ${getCardClass()}`}
              onClick={() =>
                openLink(
                  'https://chatgpt.com/g/g-69e3bdd04f8081919a1b6ba9af0c41de-documentia-por-el-profe-manuel'
                )
              }
            >
              <img src="/documentia.png" alt="DocumentIA" className="card-image" />
              <h3>DocumentIA</h3>
              <p>GPT para realizar solicitudes, acta de reunión, citatorios, exhortos, acta de hechos y más.</p>
            </div>

            <div className={`card ${getCardClass()}`} onClick={() => openLink('#')}>
              <img src="/otros.png" alt="Otros" className="card-image" />
              <h3>Otros</h3>
              <p>Próximamente.</p>
            </div>
          </div>
        )}

        {screen === 'iaapps' && (
          <div className="cards-grid compact-grid">
            <div
              className={`card ${getCardClass()}`}
              onClick={() => openLink('https://notebooklm.google.com/')}
            >
              <img src="/notebooklm.png" alt="NotebookLM" className="card-image" />
              <h3>NotebookLM</h3>
              <p>Organización y análisis de documentos.</p>
            </div>

            <div
              className={`card ${getCardClass()}`}
              onClick={() => openLink('https://gamma.app/es')}
            >
              <img src="/gamma.png" alt="Gamma" className="card-image" />
              <h3>Gamma</h3>
              <p>Presentaciones con IA.</p>
            </div>

            <div
              className={`card ${getCardClass()}`}
              onClick={() => openLink('https://suno.com/create')}
            >
              <img src="/suno.png" alt="Suno" className="card-image" />
              <h3>Suno</h3>
              <p>Música y canciones con IA.</p>
            </div>
          </div>
        )}

        {screen === 'recursos' && (
          <div className="cards-grid compact-grid">
            <div
              className={`card ${getCardClass()}`}
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
              className={`card ${getCardClass()}`}
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
              className={`card ${getCardClass()}`}
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

        {screen === 'juego' && <CorreProfe />}
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