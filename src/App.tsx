import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'
import './App.css'
import Home from './home'
import UserPage from './userpage'
import Historico from './historico'
import Conta from './conta'
import Codigo from './codigo'
import ContaFamilia from './contafamilia'
import EntrarFamilia from './entrarfamilia'

function LoginView({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  goToConta
}: {
  email: string
  password: string
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  handleLogin: (e: React.FormEvent) => void
  goToConta: () => void
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
          <button
            className="btn-secondary"
            onClick={goToConta}
          >
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

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    // Valida o e-mail e senha diretamente no Firebase Auth
    await signInWithEmailAndPassword(auth, email, password)
    
    // Limpa os campos do formulário
    setEmail('')
    setPassword('')
    
    // Redireciona para a home apenas se a validação der certo
    navigate('/home')
  } catch (error) {
    console.error("Erro na validação do login:", error)
    alert("E-mail ou senha incorretos. Por favor, tente novamente.")
  }
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
            goToConta={() => navigate('/conta')}
          />
        }
      />

      <Route path="/home" element={<Home />} />
      <Route path="/codigo" element={<Codigo />} />
      <Route path="/userpage" element={<UserPage />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/contafamilia" element={<ContaFamilia />} />
      <Route path="/entrarfamilia" element={<EntrarFamilia />} />

    </Routes>
  )
}

export default App