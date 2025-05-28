import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContexts';
import Header from './components/layout/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProjectList from './components/projects/ProjectList';
import ProjectDetail from './components/projects/ProjectDetail';
import ProjectForm from './components/projects/ProjectForm';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to='/login' />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/' element={<PrivateRoute><ProjectList /></PrivateRoute>} />
              <Route path='/projects' element={<PrivateRoute><ProjectList /></PrivateRoute>} />
              <Route path='/projects/new' element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
              <Route path='/projects/:id' element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
              <Route path='/projects/:id/edit' element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;