import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
  const navigate = useNavigate();
  const [userName] = useState('Administrador');

    function gerarDadosAleatorios(): void {
        console.log('Gerando dados aleatórios...');
        // Add your implementation here
    }

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-name">E-BOX</span>
        </div>
        <div className="nav-user">
          <span>Olá, <strong>{userName}</strong></span>
          <br />
          <br />
          <button onClick={() => navigate('/')} className="btn-logout">Sair</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Códigos de Acesso</h1>
        </header>
        <br />
    <section className="action-section">
          <div className="action-card">
            <h3>Ações Rápidas</h3>
            <div className="button-group">
              <button className="btn-primary-ebox" onClick={gerarDadosAleatorios}>
                🔄 Atualizar Dados
              </button>
              <button className="btn-secondary-ebox">📊 Relatórios</button>
            </div>
          </div>
        </section>
        <br />
        <section className="action-section">
          <div className="action-card">
            <h3>Camera</h3>
            <div className="button-group">
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;