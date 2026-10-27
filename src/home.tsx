import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, onValue, remove } from 'firebase/database'
import { auth, db } from './firebase' // 🆕 auth adicionado
import './home.css'

function Home() {
  const navigate = useNavigate()

  const [mostrarCamera, setMostrarCamera] = useState(false)
  const [senha, setSenha] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  // ============ BUSCAR SENHAS FILTRADAS PELO GRUPO ============
  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      navigate('/')
      return
    }

    // 1. Escuta o usuário logado para descobrir o grupoId dele
    const userRef = ref(db, `/Usuarios/${user.uid}`)
    
    const unsubscribeUser = onValue(userRef, (userSnap) => {
      const grupoId = userSnap.val()?.grupoId

      // Se o usuário não tem grupo, não mostramos nenhuma senha
      if (!grupoId) {
        setSenha([])
        setCarregando(false)
        return
      }

      // 2. Escuta o nó de senhas
      const senhasRef = ref(db, '/Senhas')
      
      const unsubscribeSenhas = onValue(senhasRef, (snapshot) => {
        const data = snapshot.val()

        if (data) {
          const lista = Object.entries(data)
            .map(([id, valor]: any) => ({
              id,
              senha: valor.senha,
              user: valor.user,
              grupoId: valor.grupoId
            }))
            // 🔑 FILTRO: Mostra apenas as senhas do mesmo grupo do usuário
            .filter((item) => item.grupoId === grupoId)
          
          setSenha(lista)
        } else {
          setSenha([])
        }

        setCarregando(false)
      })

      return () => unsubscribeSenhas()
    })

    return () => unsubscribeUser()
  }, [navigate])

  // Apagar código
  const apagarCodigo = async (id: string, senhaTexto: string) => {
    const confirmar = window.confirm(
      `Deseja realmente apagar o código ${senhaTexto}?`
    )

    if (!confirmar) return

    try {
      await remove(ref(db, `/Senhas/${id}`))
      alert('Código apagado com sucesso!')
    } catch (error) {
      console.error('Erro ao apagar código:', error)
      alert('Não foi possível apagar o código.')
    }
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="logo">
          <span className="e">E</span>-BOX
        </div>

        <div className="header-actions">
          <button className="icon-btn" onClick={() => navigate('/historico')}>
            🕒
          </button>
          <button className="icon-btn" onClick={() => navigate('/userpage')}>
            👤
          </button>
        </div>
      </div>

      <br />
      <h1 className="title">Códigos de Acesso</h1>

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
          <div key={item.id} className="code-card">
            <button
              className="delete-btn"
              onClick={() => apagarCodigo(item.id, item.senha)}
              title="Apagar código"
            >
              ❌
            </button>

            <div className="code-number">
              {item.senha}
            </div>

            <div className="code-user">
              Criado por:<br />
              {item.user}
            </div>
          </div>
        ))}
      </div>

      <button className="create-code-btn" onClick={() => navigate('/codigo')}>
        Criar Código de Acesso
      </button>

      <div className="arrow"></div>

      <div className="camera-card">
        <div className="camera-header">
          <span>Câmera ao Vivo</span>
          <span>📹</span>
        </div>

        <div className="camera-box">
          {!mostrarCamera ? (
            <button className="camera-btn" onClick={() => setMostrarCamera(true)}>
              Mostrar Câmera
            </button>
          ) : (
            <img src="/camera.jpg" alt="Câmera" className="camera-image" />
          )}
        </div>
      </div>

      <br />

      <button className="logout" onClick={() => navigate('/')}>
        Sair
      </button>
    </div>
  )
}

export default Home