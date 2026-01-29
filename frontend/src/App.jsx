import './App.css';
import Game from './pages/Game';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </Router>
  );
}


export default App
