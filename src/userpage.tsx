import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, set, get, onValue, remove, update } from 'firebase/database'
import { auth, db } from './firebase'
import './userpage.css'

interface Membro {
  uid: string
  nome: string
  tipo: string
  isVoce: boolean
}

function User() {
  const navigate = useNavigate()

  const [inGroup, setInGroup] = useState(false)
  const [codigoFamilia, setCodigoFamilia] = useState('')
  const [usuarios, setUsuarios] = useState<Membro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [nomeUsuario, setNomeUsuario] = useState('Usuário')
  const [codigoInput, setCodigoInput] = useState('')
  const [statusPorta, setStatusPorta] = useState('TRANCADA')

  // ============ ESCUTAR DADOS EM TEMPO REAL E NOTIFICAÇÕES ============
  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      navigate('/')
      return
    }

    setNomeUsuario(user.displayName || user.email?.split('@')[0] || 'Usuário')

    // 🔔 1. Pede permissão para enviar notificações no navegador
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }

    // 🔔 2. Escuta o status da porta e dispara a notificação
    let statusAnterior = 'TRANCADA'
    const statusRef = ref(db, '/E-box(esp)/Status')
    
    const unsubscribeStatus = onValue(statusRef, (snap) => {
      if (snap.exists()) {
        const novoStatus = snap.val()
        setStatusPorta(novoStatus)

        // Se o status mudou e temos permissão, mostra a notificação
        if (novoStatus !== statusAnterior) {
          if (Notification.permission === 'granted') {
            const titulo = novoStatus === 'ABERTA' ? '🔓 Porta Aberta!' : '🔒 Porta Trancada!'
            const corpo = `A E-BOX mudou o status para ${novoStatus}.`
            
            new Notification(titulo, { body: corpo })
          }
          statusAnterior = novoStatus
        }
      }
    })

    // 3. Escuta o grupoId do usuário atual
    const userRef = ref(db, `/Usuarios/${user.uid}`)
    
    const unsubscribeUser = onValue(userRef, (userSnap) => {
      const userData = userSnap.val()
      const grupoId = userData?.grupoId

      if (!grupoId) {
        setInGroup(false)
        setCodigoFamilia('')
        setUsuarios([])
        setCarregando(false)
        return
      }

      setCodigoFamilia(grupoId)
      setInGroup(true)

      // 4. Escuta TODOS os usuários para achar quem tem o mesmo grupoId
      const usuariosRef = ref(db, '/Usuarios')
      
      const unsubscribeUsuarios = onValue(usuariosRef, (snapshot) => {
        const todos = snapshot.val() || {}
        
        const membros: Membro[] = Object.entries(todos)
          .filter(([_, dados]: any) => dados.grupoId === grupoId)
          .map(([uid, dados]: any) => ({
            uid,
            nome: dados.nome || 'Usuário',
            tipo: uid === user.uid ? 'Você' : 'Membro',
            isVoce: uid === user.uid
          }))

        setUsuarios(membros)
        setCarregando(false)
      })

      return () => unsubscribeUsuarios()
    })

    return () => {
      unsubscribeUser()
      unsubscribeStatus()
    }
  }, [navigate])

  // ============ GERAR CÓDIGO ============
  const gerarCodigoFamilia = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numeros = '0123456789'

    let codigo = ''
    for (let i = 0; i < 3; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length))
    }
    codigo += '-'
    for (let i = 0; i < 4; i++) {
      const caracteres = letras + numeros
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return codigo
  }

  // ============ CRIAR GRUPO ============
  const criarGrupo = async () => {
    const user = auth.currentUser
    if (!user) return

    const confirmar = window.confirm('Deseja criar um novo grupo familiar?')
    if (!confirmar) return

    try {
      const novoCodigo = gerarCodigoFamilia()

      await set(ref(db, `/Grupos/${novoCodigo}`), {
        adminUid: user.uid,
        criadoEm: new Date().toLocaleString('pt-BR')
      })

      await update(ref(db, `/Usuarios/${user.uid}`), {
        nome: nomeUsuario,
        grupoId: novoCodigo
      })

      alert(`Grupo criado!\n\nCódigo: ${novoCodigo}\n\nCompartilhe com sua família.`)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao criar grupo.')
    }
  }

  // ============ ENTRAR EM GRUPO EXISTENTE ============
  const entrarNoGrupo = async () => {
    const user = auth.currentUser
    if (!user) return

    const codigoLimpo = codigoInput.trim().toUpperCase()

    if (!codigoLimpo) {
      alert('Digite um código válido!')
      return
    }

    try {
      const grupoRef = ref(db, `/Grupos/${codigoLimpo}`)
      const snapshot = await get(grupoRef)

      if (!snapshot.exists()) {
        alert('Código não encontrado! Verifique e tente novamente.')
        return
      }

      await update(ref(db, `/Usuarios/${user.uid}`), {
        nome: nomeUsuario,
        grupoId: codigoLimpo
      })

      setCodigoInput('')
      alert('Você entrou no grupo com sucesso!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao entrar no grupo.')
    }
  }

  // ============ SAIR DO GRUPO ============
  const sairDoGrupo = async () => {
    const user = auth.currentUser
    if (!user) return

    const confirmar = window.confirm(
      'Tem certeza que deseja sair do grupo familiar?'
    )
    if (!confirmar) return

    try {
      const grupoRef = ref(db, `/Grupos/${codigoFamilia}`)
      const snapshot = await get(grupoRef)
      const grupo = snapshot.val()

      if (grupo?.adminUid === user.uid) {
        const deletar = window.confirm(
          'Você é o admin. Deseja DELETAR o grupo para todos os membros?'
        )

        if (deletar) {
          const usuariosSnap = await get(ref(db, '/Usuarios'))
          const usuarios = usuariosSnap.val() || {}

          for (const [uid, dados] of Object.entries(usuarios) as any) {
            if (dados.grupoId === codigoFamilia) {
              await remove(ref(db, `/Usuarios/${uid}/grupoId`))
            }
          }

          await remove(grupoRef)
          alert('Grupo deletado para todos!')
        } else {
          return
        }
      } else {
        await remove(ref(db, `/Usuarios/${user.uid}/grupoId`))
        alert('Você saiu do grupo!')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao sair do grupo.')
    }
  }

  // ============ REMOVER MEMBRO (SÓ ADMIN) ============
  const removerUsuario = async (uid: string, nome: string) => {
    const user = auth.currentUser
    if (!user) return

    const confirmar = window.confirm(`Remover ${nome} do grupo?`)
    if (!confirmar) return

    try {
      const grupoSnap = await get(ref(db, `/Grupos/${codigoFamilia}`))
      const grupo = grupoSnap.val()

      if (grupo?.adminUid !== user.uid) {
        alert('Apenas o admin pode remover membros!')
        return
      }

      await remove(ref(db, `/Usuarios/${uid}/grupoId`))
      alert(`${nome} foi removido!`)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // ============ CONTROLAR PORTA ============
  const controlarPorta = async (acao: 'ABRIR' | 'FECHAR') => {
    const confirmar = window.confirm(
      `Deseja realmente ${acao === 'ABRIR' ? 'ABRIR' : 'FECHAR'} a porta?`
    )
    if (!confirmar) return

    try {
      await set(ref(db, '/E-box(esp)/Comando'), acao)
      alert(`Comando de ${acao} enviado!`)
    } catch (error) {
      console.error('Erro ao controlar porta:', error)
      alert('Erro ao enviar o comando.')
    }
  }

  if (carregando) {
    return <div className="user-container">Carregando...</div>
  }

  return (
    <div className="user-container">

      {/* HEADER */}
      <div className="user-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      {/* PERFIL */}
      <div className="profile-card">
        <div className="avatar">👤</div>
        <h2>{nomeUsuario}</h2>
        <p>{inGroup ? 'Membro do grupo' : 'Sem grupo'}</p>
      </div>

      {/* LIBERAR ACESSO */}
      <div className="card">
        <h3>Liberar Acesso</h3>
        
        <p style={{ textAlign: 'center', marginBottom: '15px', color: statusPorta === 'ABERTA' ? 'green' : 'red', fontWeight: 'bold' }}>
          Status atual: {statusPorta}
        </p>

        <div className="access-buttons">
          <button 
            type="button" 
            className="btn-lock" 
            onClick={() => controlarPorta('ABRIR')}
            style={{ opacity: statusPorta === 'ABERTA' ? 0.5 : 1 }}
          >
            🔓
          </button>
          
          <button 
            type="button" 
            className="btn-lock" 
            onClick={() => controlarPorta('FECHAR')}
            style={{ opacity: statusPorta === 'TRANCADA' ? 0.5 : 1 }}
          >
            🔒
          </button>
        </div>
      </div>

      {/* GRUPO FAMILIAR */}
      <div className="card family-card">
        <h3>Grupo Familiar</h3>

        {inGroup ? (
          <>
            <p className="family-code">
              Código da família: <strong>{codigoFamilia}</strong>
            </p>

            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <div className="user-row" key={usuario.uid}>
                  <div className="row-left">
                    <div className="mini-avatar">👤</div>
                    <div>
                      <strong>{usuario.nome} {usuario.isVoce && '(você)'}</strong>
                      <p>{usuario.tipo}</p>
                    </div>
                  </div>

                  {!usuario.isVoce && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removerUsuario(usuario.uid, usuario.nome)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-family">
                <div className="empty-family-icon">👨‍👩‍👧</div>
                <p>Nenhum outro membro ainda.</p>
                <span>Compartilhe o código para convidar.</span>
              </div>
            )}

            <button type="button" className="leave-btn" onClick={sairDoGrupo}>
              Sair do Grupo
            </button>
          </>
        ) : (
          <>
            <div className="no-family">
              <div className="no-family-icon">👨‍👩‍👧‍👦</div>
              <h4>Você não está em um Grupo Familiar</h4>
              <p>Crie seu próprio grupo ou entre com um código.</p>
            </div>

            <button
              type="button"
              className="create-family-btn"
              onClick={criarGrupo}
            >
              + Criar Grupo Familiar
            </button>

            <div className="input-group" style={{ marginTop: 16 }}>
              <input
                type="text"
                placeholder="Digite o código (ex: EBX-7K4P9)"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                maxLength={9}
              />
              <button
                type="button"
                className="add-btn"
                onClick={entrarNoGrupo}
              >
                Entrar em um Grupo Familiar
              </button>
            </div>
          </>
        )}

      </div>

      {/* SAIR */}
      <button className="logout" onClick={() => navigate('/')}>
        Sair da Conta
      </button>

    </div>
  )
}

export default User