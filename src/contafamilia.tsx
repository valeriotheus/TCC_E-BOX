import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'
import './contafamilia.css'

function ContaFamilia() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [codigoFamilia, setCodigoFamilia] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!')
      return
    }

    if (!codigoFamilia.trim()) {
      alert('Digite o código do grupo familiar!')
      return
    }

    try {
      // Cria a conta no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      /*
        Aqui você poderá salvar os dados do usuário
        no Firestore e vinculá-lo ao grupo familiar usando
        o código informado.

        Exemplo:

        await setDoc(doc(db, 'usuarios', user.uid), {
          nome: nome,
          email: email,
          codigoFamilia: codigoFamilia,
          uid: user.uid
        })
      */

      console.log('Usuário criado:', user.uid)
      console.log('Nome:', nome)
      console.log('Código da família:', codigoFamilia)

      alert('Conta familiar criada com sucesso!')

      navigate('/')
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Este e-mail já está cadastrado!')
      } else if (error.code === 'auth/invalid-email') {
        alert('Digite um e-mail válido!')
      } else if (error.code === 'auth/weak-password') {
        alert('A senha escolhida é muito fraca!')
      } else {
        alert('Erro ao criar conta: ' + error.message)
      }
    }
  }

  return (
    <div className="app-container">
      <section className="login-card">

        <div className="login-header">
          <h1>E-BOX</h1>
          <br />
          <h3>Entrar para um Grupo Familiar</h3>
          <p>
            Crie sua conta para fazer parte de um grupo familiar.
          </p>
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
            <label htmlFor="codigoFamilia">
              Código do Grupo Familiar
            </label>

            <input
              id="codigoFamilia"
              type="text"
              placeholder="Digite o código da família"
              value={codigoFamilia}
              onChange={(e) => setCodigoFamilia(e.target.value)}
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
            <label htmlFor="confirmPassword">
              Confirmar Senha
            </label>

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
            Entrar no Grupo Familiar
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

export default ContaFamilia