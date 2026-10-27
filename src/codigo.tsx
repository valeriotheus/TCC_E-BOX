import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push, get } from 'firebase/database' // 🆕 get adicionado
import { auth, db } from './firebase' // 🆕 auth adicionado
import './codigo.css'

function Codigo() {
  const navigate = useNavigate()

  const [codigo, setCodigo] = useState('')
  const [usuario, setUsuario] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const criarCodigo = async () => {
    setMensagem('')

    if (!codigo || !usuario) {
      setMensagem('Preencha todos os campos.')
      return
    }

    if (codigo.length !== 5) {
      setMensagem('O código deve ter 5 números.')
      return
    }

    const user = auth.currentUser
    if (!user) {
      setMensagem('Você precisa estar logado.')
      return
    }

    try {
      setCarregando(true)

      // 🆕 1. Busca o grupoId do usuário logado
      const userRef = ref(db, `/Usuarios/${user.uid}`)
      const userSnap = await get(userRef)
      const grupoId = userSnap.val()?.grupoId

      if (!grupoId) {
        setMensagem('Você precisa estar em um grupo familiar para criar códigos.')
        setCarregando(false)
        return
      }

      // 2. Salva a senha com o grupoId
      const senhasRef = ref(db, '/Senhas')
      await push(senhasRef, {
        senha: codigo,
        user: usuario,
        grupoId: grupoId // 🔑 Salva o vínculo com o grupo
      })

      setMensagem('Código criado com sucesso!')
      setCodigo('')
      setUsuario('')

      setTimeout(() => {
        navigate('/home')
      }, 1000)

    } catch (error) {
      console.error('Erro ao criar código:', error)
      setMensagem('Erro ao criar o código.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="create-container">
      <div className="create-header">
        <div className="logo">
          <span className="e">E</span>-BOX
        </div>
        <div className="header-space"></div>
      </div>

      <div className="create-card">
        <div className="form-icon">🔐</div>
        <h2>Novo Código</h2>
        <p className="form-description">
          Informe os dados abaixo para criar um novo código de acesso.
        </p>

        <div className="input-group">
          <label>Código de acesso</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="Ex: 02568"
            value={codigo}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, '')
              setCodigo(valor)
            }}
          />
          <span className="input-help">Digite exatamente 5 números</span>
        </div>

        <div className="input-group">
          <label>Criado por</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        {mensagem && (
          <div className={mensagem.includes('sucesso') ? 'message success' : 'message error'}>
            {mensagem}
          </div>
        )}

        <button className="save-code-btn" onClick={criarCodigo} disabled={carregando}>
          {carregando ? 'Criando...' : 'Criar Código'}
        </button>

        <button className="cancel-btn" onClick={() => navigate('/home')}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default Codigo