import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push } from 'firebase/database'
import { db } from './firebase'
import './codigo.css'

function Codigo() {
  const navigate = useNavigate()

  const [codigo, setCodigo] = useState('')
  const [usuario, setUsuario] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const criarCodigo = async () => {
    setMensagem('')

    // Verifica se os campos foram preenchidos
    if (!codigo || !usuario) {
      setMensagem('Preencha todos os campos.')
      return
    }

    // Verifica se o código possui 5 números
    if (codigo.length !== 5) {
      setMensagem('O código deve ter 5 números.')
      return
    }

    try {
      setCarregando(true)

      // Referência para /Senhas no Firebase
      const senhasRef = ref(db, '/Senhas')

      // Adiciona o novo código
      await push(senhasRef, {
        senha: codigo,
        user: usuario
      })

      setMensagem('Código criado com sucesso!')

      // Limpa os campos
      setCodigo('')
      setUsuario('')

      // Volta para Home depois de 1 segundo
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

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="create-header">

        <div className="logo">
          <span className="e">E</span>-BOX
        </div>

        <div className="header-space"></div>

      </div>


        {/* ========================= */}
        {/* CARD */}
        {/* ========================= */}

        <div className="create-card">

          {/* ÍCONE */}

          <div className="form-icon">
            🔐
          </div>


          {/* TÍTULO DO CARD */}

          <h2>
            Novo Código
          </h2>


          {/* DESCRIÇÃO */}

          <p className="form-description">
            Informe os dados abaixo para criar um novo código de acesso.
          </p>


          {/* ========================= */}
          {/* CÓDIGO */}
          {/* ========================= */}

          <div className="input-group">

            <label>
              Código de acesso
            </label>

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

            <span className="input-help">
              Digite exatamente 5 números
            </span>

          </div>


          {/* ========================= */}
          {/* USUÁRIO */}
          {/* ========================= */}

          <div className="input-group">

            <label>
              Criado por
            </label>

            <input
              type="text"
              placeholder="Digite seu nome"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

          </div>


          {/* ========================= */}
          {/* MENSAGEM */}
          {/* ========================= */}

          {mensagem && (
            <div
              className={
                mensagem.includes('sucesso')
                  ? 'message success'
                  : 'message error'
              }
            >
              {mensagem}
            </div>
          )}


          {/* ========================= */}
          {/* BOTÃO CRIAR */}
          {/* ========================= */}

          <button
            className="save-code-btn"
            onClick={criarCodigo}
            disabled={carregando}
          >
            {carregando
              ? 'Criando...'
              : 'Criar Código'}
          </button>


          {/* ========================= */}
          {/* CANCELAR */}
          {/* ========================= */}

          <button
            className="cancel-btn"
            onClick={() => navigate('/home')}
          >
            Cancelar
          </button>

        </div>

      </div>
  )
}

export default Codigo