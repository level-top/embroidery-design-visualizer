import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DesignsPage from './pages/DesignsPage';
import ModelsPage from './pages/ModelsPage';
import ProjectsPage from './pages/ProjectsPage';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="designs" element={<DesignsPage />} />
            <Route path="models" element={<ModelsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="editor/:projectId?" element={<EditorPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;