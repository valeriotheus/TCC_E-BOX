import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom' // Importações para o roteamento
import './App.css'
import Home from './home' // Importando seu arquivo home.tsx

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate()

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log('Login solicitado:', { email, password })
    
    // Agora o botão "Entrar" leva para a rota /home
    navigate('/home') 
  }

  // Criamos uma função que contém exatamente o SEU código original de visual
  const LoginView = () => (
    <div className={`app-container}`}>
      

      <main className="login-wrapper">
        <section className="login-card">
          <div className="login-header">
            <div className="brand-logo"></div>
            <h1>E-BOX</h1>
            <br />
            <h3>Login</h3>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input 
                type="email" 
                id="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <input 
                type="password" 
                id="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a href="#" className="forgot-password">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>

          <div className="login-footer">
            <span>Não tem uma conta?</span>
            <br /><br />
            <button className="btn-secondary">Criar conta no E-BOX</button>
          </div>
        </section>
      </main>
    </div>
  )

  return (
    <Routes>
      {/* Quando o caminho for "/", mostra o seu Login */}
      <Route path="/" element={<LoginView />} />
      
      {/* Quando o caminho for "/home", mostra o componente do arquivo Home.tsx */}
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App