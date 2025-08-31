import { ShieldHalf, Swords, Skull, HandFist, Flame, Gem } from 'lucide-react'
import './App.css'
import Card from './Card'

function App() {
  return (
    <div className="app">
      <h1>Cards App</h1>

      <Card />

      <div className="icon-showcase">
        <h2>Available Icons</h2>
        <div className="icon-grid">
          
          <div className="icon-item">
            <ShieldHalf />
            <span>Ausrüstung</span>
          </div>

          <div className="icon-item">
            <Swords />
            <span>Waffe</span>
          </div>

          <div className="icon-item">
            <Skull />
            <span>Eigenschaft</span>
          </div>

          <div className="icon-item">
            <HandFist />
            <span>Talent</span>
          </div>

          <div className="icon-item">
            <Flame />
            <span>Zauber</span>
          </div>

          <div className="icon-item">
            <Gem />
            <span>Artefakt</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
