import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './userpage.css'

function User() {
  const navigate = useNavigate()

  const [inGroup, setInGroup] = useState(true)

  const [usuarios, setUsuarios] = useState([
    {
      nome: 'Maria',
      tipo: 'Convidada'
    },
    {
      nome: 'Enzo',
      tipo: 'Convidado'
    }
  ])

  const sairDoGrupo = () => {
    const confirmar = window.confirm(
      'Tem certeza que deseja sair do grupo familiar?'
    )

    if (confirmar) {
      setInGroup(false)
      setUsuarios([])
    }
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
          <button
            type="button"
            className="btn-lock"
          >
            🔓
          </button>

          <button
            type="button"
            className="btn-lock"
          >
            🔒
          </button>
        </div>
      </div>

      {/* GRUPO FAMILIAR */}
      <div className="card family-card">

        <h3>Grupo Familiar</h3>

        {inGroup && (
          <p className="family-code">
            Código da família:{' '}
            <strong>EBX-7K4P9</strong>
          </p>
        )}

        {/* USUÁRIOS */}
        {usuarios.map((usuario) => (
          <div className="user-row" key={usuario.nome}>

            <div className="row-left">

              <div className="mini-avatar">
                👤
              </div>

              <div>
                <strong>{usuario.nome}</strong>
                <p>{usuario.tipo}</p>
              </div>

            </div>

          </div>
        ))}

        {/* BOTÃO DO GRUPO */}
        {inGroup ? (
          <button
            type="button"
            className="leave-btn"
            onClick={sairDoGrupo}
          >
            Sair do Grupo
          </button>
        ) : (
          <button
            type="button"
            className="add-btn"
            onClick={() => navigate('/EntrarFamilia')}
          >
            Entrar em um Grupo Familiar
          </button>
        )}

      </div>

      {/* ADICIONAR USUÁRIO */}
      <div className="card">
        <button
          type="button"
          className="add-btn"
          onClick={() => navigate('/ContaFamilia')}
        >
          Adicionar Usuário
        </button>
      </div>

    </div>
  )
}

export default User