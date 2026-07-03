import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <header>
        <h1><Link to="/">Designstack</Link></h1>
        <nav>
          <Link to="/effects">Effects</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </header>
      <div className="main">
        <Outlet />
      </div>
      <footer className="footer">
        <p>&copy;Designstack 2026</p>
      </footer>
    </div>
  )
}

export default App