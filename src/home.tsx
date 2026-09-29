import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, onValue, remove } from 'firebase/database'
import { db } from './firebase'
import './home.css'

function Home() {
  const navigate = useNavigate()

  const [mostrarCamera, setMostrarCamera] = useState(false)
  const [senha, setSenha] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  // Escutar dados em tempo real do Firebase
  useEffect(() => {
    const senhasRef = ref(db, '/Senhas')

    const unsubscribe = onValue(senhasRef, (snapshot) => {
      const data = snapshot.val()

      if (data) {
        // Firebase retorna objeto, converter para array com IDs
        const lista = Object.entries(data).map(([id, valor]: any) => ({
          id,
          senha: valor.senha,
          user: valor.user
        }))
        setSenha(lista)
      } else {
        setSenha([])
      }

      setCarregando(false)
    })

    return () => unsubscribe()
  }, [])

  // Apagar código
  const apagarCodigo = async (id: string, senhaTexto: string) => {
    const confirmar = window.confirm(
      `Deseja realmente apagar o código ${senhaTexto}?`
    )

    if (!confirmar) return

    try {
      await remove(ref(db, `/Senhas/${id}`))
      // O onValue atualiza a lista automaticamente
      alert('Código apagado com sucesso!')
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

        {carregando && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Carregando...
          </p>
        )}

        {!carregando && senha.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Nenhum código cadastrado ainda.
          </p>
        )}

        {senha.map((item) => (

          <div
            key={item.id}
            className="code-card"
          >

            {/* LIXEIRA */}
            <button
              className="delete-btn"
              onClick={() => apagarCodigo(item.id, item.senha)}
              title="Apagar código"
            >
              ❌
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