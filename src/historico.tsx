import { useNavigate } from 'react-router-dom'
import './historico.css'

export default function Historico() {

  const navigate = useNavigate()

  const accessList = [
    {
      id: 1,
      date: '23/02',
      code: '000001'
    },
    {
      id: 2,
      date: '23/02',
      code: '000001'
    },
    {
      id: 3,
      date: '23/02',
      code: '000001'
    }
  ]

  return (
    <div className="history-container">

      {/* BOLAS */}
      <div className="bg-circle top-left"></div>
      <div className="bg-circle top-right"></div>
      <div className="bg-circle bottom-right"></div>

      {/* HEADER */}
      <div className="history-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

      </div>

      {/* TITULO */}
      <h1 className="main-title">
        Histórico de Acesso
      </h1>

      {/* ACESSOS */}
      <div className="access-list">

        {accessList.map((item) => (
          <div
            className="access-card"
            key={item.id}
          >

            <div className="clock-icon">
              🕐
            </div>

            <div>

              <h3>
                Acesso: {item.date}
              </h3>

              <p>
                Acesso via código: {item.code}
              </p>

            </div>

          </div>
        ))}

      </div>
      </div>
  )
}