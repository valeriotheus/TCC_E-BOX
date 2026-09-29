import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, onValue } from 'firebase/database'
import { db } from './firebase'          // ← CORRIGIDO: db (não database)
import './historico.css'

interface HistoricoItem {
  id: string
  evento: string
  usuario: string
  dataHora: string
  codigo: string
}

export default function Historico() {
  const navigate = useNavigate()
  const [accessList, setAccessList] = useState<HistoricoItem[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const historicoRef = ref(db, '/Historico')

    const unsubscribe = onValue(historicoRef, (snapshot) => {
      const data = snapshot.val()

      if (data) {
        const lista = Object.entries(data).map(([id, valor]: any) => ({
          id,
          evento: valor.evento || 'DESCONHECIDO',
          usuario: valor.usuario || 'Desconhecido',
          dataHora: valor.dataHora || '-',
          codigo: valor.codigo || '-'
        }))

        lista.sort((a, b) => b.id.localeCompare(a.id))
        setAccessList(lista)
      } else {
        setAccessList([])
      }

      setCarregando(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="history-container">

      <div className="bg-circle top-left"></div>
      <div className="bg-circle top-right"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="history-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      <h1 className="main-title">Histórico de Acesso</h1>

      <div className="access-list">

        {carregando && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Carregando...
          </p>
        )}

        {!carregando && accessList.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Nenhum acesso registrado ainda.
          </p>
        )}

        {accessList.map((item) => (
          <div
            className={`access-card ${item.evento === 'ABERTA' ? 'aberta' : 'trancada'}`}
            key={item.id}
          >

            <div className="clock-icon">
              {item.evento === 'ABERTA' ? '🔓' : '🔒'}
            </div>

            <div>
              <h3>
                {item.evento === 'ABERTA' ? 'Porta Aberta' : 'Porta Trancada'}
              </h3>

              <p className="data-hora">
                🕐 {item.dataHora}
              </p>

              <p>
                Código: {item.codigo}
              </p>

              <p>
                Por: {item.usuario}
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}