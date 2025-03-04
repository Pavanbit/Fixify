import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { ChatProvider } from './contexts/ChatContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import PostJobPage from './pages/PostJobPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <ChatProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route 
                    path="/user-dashboard" 
                    element={
                      <ProtectedRoute userType="user">
                        <UserDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/worker-dashboard" 
                    element={
                      <ProtectedRoute userType="worker">
                        <WorkerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/post-job" 
                    element={
                      <ProtectedRoute userType="user">
                        <PostJobPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/job/:id" 
                    element={<JobDetailsPage />} 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chat/:jobId/:userId" 
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </ChatProvider>
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;