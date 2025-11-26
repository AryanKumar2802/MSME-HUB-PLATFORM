import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Dashboard from './components/business/Dashboard';
import BusinessProfile from './components/business/BusinessProfile';
import BookRecords from './components/business/BookRecords';

import GSTGuides from './components/guides/GSTGuides';
import MentorList from './components/mentor/MentorList';
import LawyerSection from './components/lawyer/LawyerSection';

import ChatWindow from './components/chat/ChatWindow';
import MentorProfile from './components/mentor/MentorProfile'; // Add this

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/business-profile" element={
                <ProtectedRoute>
                  <BusinessProfile />
                </ProtectedRoute>
              } />

              <Route path="/book-records" element={
                <ProtectedRoute>
                  <BookRecords />
                </ProtectedRoute>
              } />

              <Route path="/gst-guides" element={<GSTGuides />} />

              <Route path="/mentors" element={
                <ProtectedRoute>
                  <MentorList />
                </ProtectedRoute>
              } />

              <Route path="/mentor/:mentorId" element={
                <ProtectedRoute>
                  <MentorProfile />
                </ProtectedRoute>
              } />

              <Route path="/lawyers" element={
                <ProtectedRoute>
                  <LawyerSection />
                </ProtectedRoute>
              } />

              <Route path="/chat/:userId" element={
                <ProtectedRoute>
                  <ChatWindow />
                </ProtectedRoute>
              } />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>

          </main>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

