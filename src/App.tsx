import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <header>
        <h1><Link to="/">Tooooools</Link></h1>
        <nav>
          <Link to="/effects">Effects</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <div className="main">
        <Outlet />
      </div>
      <footer className="footer">
        <p>
          Tooooools, created by <a href="https://pivosoki.com" target="_blank" rel="noopener noreferrer">Daniil Sukhovskoy</a>.
          Free for personal and commercial use. Attribution appreciated.
        </p>
        <p>&copy;Tooooools 2026</p>
      </footer>
    </div>
  )
}

export default App