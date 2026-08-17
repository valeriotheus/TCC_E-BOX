import { useNavigate } from 'react-router-dom'
import './userpage.css'

function User() {
  const navigate = useNavigate()

  return (
    <div className="user-container">

      {/* HEADER */}
      <div className="user-header">

        {/* BOTÃO VOLTAR */}
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        
      </div>

      {/* PERFIL */}
      <div className="profile-card">
        <div className="avatar">👤</div>
        <h2>José</h2>
        <p>Administrador</p>
      </div>

      {/* LIBERAR ACESSO */}
      <div className="card">
        <h3>Liberar Acesso</h3>

        <div className="access-buttons">
          <button className="btn-lock">🔓</button>
          <button className="btn-lock">🔒</button>
        </div>
      </div>

      {/* GRUPO FAMILIAR */}
      <div className="card">
        <h3>Grupo Familiar</h3>

        <div className="user-row">
          <div className="row-left">
            <div className="mini-avatar">👤</div>

            <div>
              <strong>Maria</strong>
              <p>Convidada</p>
            </div>
          </div>

          <span className="lock">🔒</span>
        </div>

        <div className="user-row">
          <div className="row-left">
            <div className="mini-avatar">👤</div>

            <div>
              <strong>Enzo</strong>
              <p>Convidado</p>
            </div>
          </div>

          <span className="lock">🔒</span>
        </div>
      </div>

      {/* BOTÃO ADICIONAR USUÁRIO */}
      <div className="card">
        <button
          className="add-btn"
          onClick={() => navigate('/conta')}
        >
          Adicionar Usuário
        </button>
      </div>

    </div>
  )
}

export default User