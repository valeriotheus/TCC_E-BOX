import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, set } from 'firebase/database'
import { db } from './firebase'
import './home.css'

function Home() {
  const navigate = useNavigate()

  const [mostrarCamera, setMostrarCamera] = useState(false)

  const [senha, setSenha] = useState([
    { senha: '00001', user: 'José' },
    { senha: '02568', user: 'José' },
    { senha: '89558', user: 'José' }
  ])

  // Envia os códigos iniciais para o Firebase
  useEffect(() => {
    const senhasRef = ref(db, '/Senhas')
    set(senhasRef, senha)
  }, [])

  // Apagar código
  const apagarCodigo = async (index: number) => {
    const confirmar = window.confirm(
      `Deseja realmente apagar o código ${senha[index].senha}?`
    )

    if (!confirmar) {
      return
    }

    try {
      const novoArray = senha.filter((_, i) => i !== index)

      await set(ref(db, '/Senhas'), novoArray)

      setSenha(novoArray)

    } catch (error) {
      console.error('Erro ao apagar código:', error)
      alert('Não foi possível apagar o código.')
    }
  }

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
      <h1 className="title">
        Códigos de Acesso
      </h1>

      {/* LISTA DE CÓDIGOS */}
      <div className="codes-list">

        {senha.map((item, index) => (

          <div
            key={index}
            className="code-card"
          >

            {/* LIXEIRA */}
            <button
              className="delete-btn"
              onClick={() => apagarCodigo(index)}
              title="Apagar código"
            >
              🗑️
            </button>

            {/* CÓDIGO */}
            <div className="code-number">
              {item.senha}
            </div>

            {/* USUÁRIO */}
            <div className="code-user">
              Criado por:<br />
              {item.user}
            </div>

          </div>

        ))}

      </div>

      <button
  className="create-code-btn"
  onClick={() => navigate('/codigo')}
>
  Criar Código de Acesso
</button>

      {/* SETA */}
      <div className="arrow">
      </div>

      {/* CARD DA CÂMERA */}
      <div className="camera-card">

        <div className="camera-header">
          <span>Câmera ao Vivo</span>
          <span>📹</span>
        </div>

        <div className="camera-box">

          {!mostrarCamera ? (

            <button
              className="camera-btn"
              onClick={() => setMostrarCamera(true)}
            >
              Mostrar Câmera
            </button>

          ) : (

            <img
              src="/camera.jpg"
              alt="Câmera"
              className="camera-image"
            />

          )}

        </div>

      </div>

      <br />

      {/* SAIR */}
      <button
        className="logout"
        onClick={() => navigate('/')}
      >
        Sair
      </button>

    </div>
  )
}

export default Home