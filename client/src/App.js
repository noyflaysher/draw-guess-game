import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Welcome from './pages/Welcome/Welcome';
import Game from './components/Game/Game';

function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route path="/" element={<Welcome/>} />
          <Route
            path="/game"
            element={<Game/>}
          />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
