import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './home'
import UserPage from './userpage'
import Historico from './historico' // 🔥 ADICIONADO

function LoginView({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin
}: {
  email: string
  password: string
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  handleLogin: (e: React.FormEvent) => void
}) {
  return (
    <div className="app-container">
      <section className="login-card">

        <div className="login-header">
          <h1>E-BOX</h1>
          <br />
          <h3>Login</h3>
        </div>

        <form onSubmit={handleLogin} className="login-form">

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

          <button type="submit" className="btn-login">
            Entrar
          </button>

        </form>

        <div className="login-footer">
          <span>Não tem uma conta?</span>
          <br /><br />
          <button className="btn-secondary">
            Criar conta no E-BOX
          </button>
        </div>

      </section>
    </div>
  )
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <Routes>

      <Route
        path="/"
        element={
          <LoginView
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        }
      />

      <Route path="/home" element={<Home />} />
      <Route path="/userpage" element={<UserPage />} />

      {/* 🔥 SÓ ISSO FOI ADICIONADO */}
      <Route path="/historico" element={<Historico />} />

    </Routes>
  )
}

export default App