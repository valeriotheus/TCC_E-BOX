import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, onValue, remove } from 'firebase/database'
import { auth, db } from './firebase'
import './home.css'

function Home() {
  const navigate = useNavigate()

  const [mostrarCamera, setMostrarCamera] = useState(false)
  const [senha, setSenha] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  // ✅ IP com a porta 81 para o stream de vídeo
  const ipCamera = '10.214.94.174:81' 

  // ============ BUSCAR SENHAS FILTRADAS PELO GRUPO ============
  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      navigate('/')
      return
    }

    const userRef = ref(db, `/Usuarios/${user.uid}`)
    const unsubscribeUser = onValue(userRef, (userSnap) => {
      const grupoId = userSnap.val()?.grupoId
      if (!grupoId) {
        setSenha([])
        setCarregando(false)
        return
      }

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

  const apagarCodigo = async (id: string, senhaTexto: string) => {
    const confirmar = window.confirm(`Deseja realmente apagar o código ${senhaTexto}?`)
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
        <div className="logo"><span className="e">E</span>-BOX</div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => navigate('/historico')}>🕒</button>
          <button className="icon-btn" onClick={() => navigate('/userpage')}>👤</button>
        </div>
      </div>

      <br />
      <h1 className="title">Códigos de Acesso</h1>

      <div className="codes-list">
        {carregando && <p style={{ textAlign: 'center', color: '#888' }}>Carregando...</p>}
        {!carregando && senha.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>Nenhum código cadastrado ainda.</p>
        )}
        {senha.map((item) => (
          <div key={item.id} className="code-card">
            <button className="delete-btn" onClick={() => apagarCodigo(item.id, item.senha)} title="Apagar código">❌</button>
            <div className="code-number">{item.senha}</div>
            <div className="code-user">Criado por:<br />{item.user}</div>
          </div>
        ))}
      </div>

      <button className="create-code-btn" onClick={() => navigate('/codigo')}>Criar Código de Acesso</button>
      <div className="arrow"></div>

      {/* CARD DA CÂMERA (VÍDEO CONTÍNUO) */}
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
            // 🆕 Usando iframe em vez de img para o stream funcionar no Android
            <iframe 
              src={`http://${ipCamera}/stream`} 
              className="camera-image"
              style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
              title="Câmera ao Vivo"
              onError={() => {
                alert("Não foi possível carregar o vídeo. Verifique se o celular está na rede Wi-Fi (M6) e se o IP está correto.");
                setMostrarCamera(false);
              }}
            />
          )}
        </div>
      </div>

      <br />
      <button className="logout" onClick={() => navigate('/')}>Sair</button>
    </div>
  )
}

export default Home