/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { onAuthStateChanged, auth, syncUserProfile, testConnection } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/LandingPage/HeroSection';
import { ProgramsSection } from './components/LandingPage/ProgramsSection';
import { PartnersSection } from './components/LandingPage/PartnersSection';
import { FAQSection } from './components/LandingPage/FAQSection';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PendingApprovalPage } from './pages/PendingApprovalPage';
import { RejectedPage } from './pages/RejectedPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';

// Public Landing Page restricted to basic overview and About/Contact/FAQ
function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProgramsSection />
        <PartnersSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const { setCurrentUser } = useAppStore();

  useEffect(() => {
    // Validate Firestore connection on boot
    testConnection();

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await syncUserProfile(firebaseUser);
          setCurrentUser(profile);
        } catch (err) {
          console.error('Error syncing user profile on auth state change:', err);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [setCurrentUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<PublicLandingPage />} />

        {/* Common Login Page (No role selection, common to admin and student) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Student Registration Page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Pending Admin Approval Notice */}
        <Route path="/pending-approval" element={<PendingApprovalPage />} />

        {/* Rejected Account Page */}
        <Route path="/rejected" element={<RejectedPage />} />

        {/* Admin Dashboard: laxmikanttalli303@gmail.com */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        {/* Approved Student Portal & Dashboard */}
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
