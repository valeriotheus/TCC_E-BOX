import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function Conta() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    alert('Conta criada com sucesso!')
    navigate('/')
  }

  return (
    <div className="app-container">
      <section className="login-card">

        <div className="login-header">
          <h1>E-BOX</h1>
          <br />
          <h3>Criar Conta</h3>
        </div>

        <form onSubmit={handleRegister} className="login-form">

          <div className="input-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Criar Conta
          </button>

        </form>

        <div className="login-footer">
          <button
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Voltar para Login
          </button>
        </div>

      </section>
    </div>
  )
}

export default Conta