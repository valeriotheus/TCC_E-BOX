import { useNavigate } from 'react-router-dom'
import './home.css'

function Home() {
  const navigate = useNavigate()

  const senha = [
    { senha: '000001', user: 'José' },
    { senha: '025654', user: 'José' },
    { senha: '895566', user: 'José' }
  ]

  return (
    <div className="home-container">

      {/* TOPO */}
      <div className="home-header">
        <div className="logo">
          <span className="e">E</span>-BOX
        </div>

        <div className="header-actions">

          <button
            className="icon-btn"
            onClick={() => navigate('/historico')}
          >
            🕒
          </button>

          {/* 👇 AQUI A CORREÇÃO */}
          <button
            className="icon-btn"
            onClick={() => navigate('/userpage')}
          >
            👤
          </button>

        </div>
      </div>

      <br />

      {/* TÍTULO */}
      <h1 className="title">Códigos de Acesso</h1>

      {/* LISTA */}
      <div className="codes-list">
        {senha.map((item, index) => (
          <div key={index} className="code-card">
            <div className="code-left">😴</div>

            <div className="code-number">
              {item.senha}
            </div>

            <div className="code-user">
              Criado por:<br />{item.user}
            </div>
          </div>
        ))}
      </div>

      {/* SETA */}
      <div className="arrow">⌄</div>

      {/* CÂMERA */}
      <div className="camera-card">
        <div className="camera-header">
          <span>Câmera ao Vivo</span>
          <span>↗</span>
        </div>

        <div className="camera-box">
          📷
        </div>
      </div>

      <br />

      {/* SAIR */}
      <button className="logout" onClick={() => navigate('/')}>
        Sair
      </button>

    </div>
  )
}

export default Home