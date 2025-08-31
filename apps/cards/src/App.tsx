import { Heart, Star, Plus, Minus, Home, Settings, User, Mail } from 'lucide-react'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Cards App</h1>
      
      <div className="icon-showcase">
        <h2>Available Icons</h2>
        <div className="icon-grid">
          <div className="icon-item">
            <Heart className="showcase-icon" />
            <span>Heart</span>
          </div>
          <div className="icon-item">
            <Star className="showcase-icon" />
            <span>Star</span>
          </div>
          <div className="icon-item">
            <Plus className="showcase-icon" />
            <span>Plus</span>
          </div>
          <div className="icon-item">
            <Minus className="showcase-icon" />
            <span>Minus</span>
          </div>
          <div className="icon-item">
            <Home className="showcase-icon" />
            <span>Home</span>
          </div>
          <div className="icon-item">
            <Settings className="showcase-icon" />
            <span>Settings</span>
          </div>
          <div className="icon-item">
            <User className="showcase-icon" />
            <span>User</span>
          </div>
          <div className="icon-item">
            <Mail className="showcase-icon" />
            <span>Mail</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
