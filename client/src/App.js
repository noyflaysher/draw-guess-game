
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Welcome from './pages/Welcome/Welcome';

function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/welcome" />} />
          <Route
            path="/welcome"
            element={<Welcome/>}
          />
          <Route
            path="/game"
            element=""
          />
          <Route
            path="/wait"
            element=""
          />
          <Route
            path="/choose"
            element=""
          />
           <Route
            path="/draw"
            element=""
          />
             <Route
            path="/guess"
            element=""
          />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
