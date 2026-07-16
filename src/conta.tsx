import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth' // Importa o método do Firebase
import { auth } from './firebase' // Importa a instância que você configurou acima
import './App.css'

function Conta() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Transformamos em uma função assíncrona para lidar com a requisição
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    try {
      // Chama o método do Firebase para registrar o usuário
      await createUserWithEmailAndPassword(auth, email, password)
      
      alert('Conta criada com sucesso!')
      navigate('/')
    } catch (error: any) {
      // Trata erros comuns, como e-mail já cadastrado ou senha fraca
      alert('Erro ao criar conta: ' + error.message)
    }
  }

  return (
    <div className="app-container">
      {/* O restante do seu HTML permanece exatamente igual */}
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
