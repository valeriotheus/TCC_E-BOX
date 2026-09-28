import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './userpage.css'

function User() {
  const navigate = useNavigate()

  const [inGroup, setInGroup] = useState(true)

  const [codigoFamilia, setCodigoFamilia] = useState('EBX-7K4P9')

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

  // Gera um código para o grupo familiar
  const gerarCodigoFamilia = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numeros = '0123456789'

    let codigo = ''

    for (let i = 0; i < 3; i++) {
      codigo += letras.charAt(
        Math.floor(Math.random() * letras.length)
      )
    }

    codigo += '-'

    for (let i = 0; i < 4; i++) {
      const caracteres = letras + numeros

      codigo += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      )
    }

    return codigo
  }

  // Criar grupo familiar
  const criarGrupo = () => {
    const confirmar = window.confirm(
      'Deseja criar um novo grupo familiar?'
    )

    if (confirmar) {
      const novoCodigo = gerarCodigoFamilia()

      setCodigoFamilia(novoCodigo)
      setInGroup(true)

      setUsuarios([])

      window.alert(
        `Grupo familiar criado com sucesso!\n\nCódigo da família: ${novoCodigo}`
      )
    }
  }

  // Sair do grupo
  const sairDoGrupo = () => {
    const confirmar = window.confirm(
      'Tem certeza que deseja sair do grupo familiar?'
    )

    if (confirmar) {
      setInGroup(false)
      setUsuarios([])
    }
  }

  // Remover usuário
  const removerUsuario = (nome: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja remover ${nome} do grupo familiar?`
    )

    if (confirmar) {
      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter(
          (usuario) => usuario.nome !== nome
        )
      )
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

        {inGroup ? (
          <>
            {/* CÓDIGO DA FAMÍLIA */}
            <p className="family-code">
              Código da família:{' '}
              <strong>{codigoFamilia}</strong>
            </p>

            {/* USUÁRIOS */}
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <div
                  className="user-row"
                  key={usuario.nome}
                >

                  <div className="row-left">

                    <div className="mini-avatar">
                      👤
                    </div>

                    <div>
                      <strong>{usuario.nome}</strong>

                      <p>{usuario.tipo}</p>
                    </div>

                  </div>

                  {/* REMOVER */}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removerUsuario(usuario.nome)
                    }
                  >
                    Remover
                  </button>

                </div>
              ))
            ) : (
              <div className="empty-family">
                <div className="empty-family-icon">
                  👨‍👩‍👧
                </div>

                <p>
                  Nenhum outro membro está no grupo.
                </p>

                <span>
                  Compartilhe o código da família para
                  convidar pessoas.
                </span>
              </div>
            )}

            {/* SAIR */}
            <button
              type="button"
              className="leave-btn"
              onClick={sairDoGrupo}
            >
              Sair do Grupo
            </button>
          </>
        ) : (
          <>
            {/* GRUPO NÃO EXISTE */}
            <div className="no-family">

              <div className="no-family-icon">
                👨‍👩‍👧‍👦
              </div>

              <h4>
                Você não está em um Grupo Familiar
              </h4>

              <p>
                Crie seu próprio grupo ou entre em um
                grupo existente usando um código.
              </p>

            </div>

            {/* CRIAR GRUPO */}
            <button
              type="button"
              className="create-family-btn"
              onClick={criarGrupo}
            >
              + Criar Grupo Familiar
            </button>

            {/* ENTRAR NO GRUPO */}
            <button
              type="button"
              className="add-btn"
              onClick={() =>
                navigate('/EntrarFamilia')
              }
            >
              Entrar em um Grupo Familiar
            </button>
          </>
        )}

      </div>

      {/* SAIR */}
      <button
        className="logout"
        onClick={() => navigate('/')}
      >
        Sair da Conta
      </button>

    </div>
  )
}

export default User
