import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './entrarfamilia.css'

function EntrarFamilia() {
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')

  const entrarNaFamilia = () => {
    if (!codigo.trim()) {
      window.alert('Digite o código da família.')
      return
    }

    window.alert('Código da família enviado!')

    // Redireciona para a página do usuário
    navigate('/UserPage')
  }

  return (
    <div className="user-container">

      {/* HEADER */}
      <div className="user-header">

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

      </div>

      {/* TÍTULO */}
      <div className="profile-card">

        <div className="avatar">
          👨‍👩‍👧‍👦
        </div>

        <h2>Entrar em um Grupo Familiar</h2>

        <p>
          Digite o código da família para entrar.
        </p>

      </div>

      {/* FORMULÁRIO */}
      <div className="card family-card">

        <h3>Código da Família</h3>

        <input
          type="text"
          className="family-input"
          placeholder="Ex: EBX-7K4P9"
          value={codigo}
          maxLength={9}
          onChange={(e) =>
            setCodigo(e.target.value.toUpperCase())
          }
        />

        <button
          type="button"
          className="add-btn"
          onClick={entrarNaFamilia}
        >
          Entrar no Grupo
        </button>

      </div>

    </div>
  )
}

export default EntrarFamilia