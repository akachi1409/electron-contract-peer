import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Homepage from './components/Homepage/Homepage';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}