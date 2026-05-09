import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/Homepage';
import WorksPage from './pages/Works/WorksPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/"              element={<HomePage />} />
          <Route path="/works/:type"   element={<WorksPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;