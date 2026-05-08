/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import ProfileSetup from './components/ProfileSetup';
import MemberID from './components/MemberID';
import Savings from './components/Savings';
import Messages from './components/Messages';
import AdminDashboard from './components/Admin/Dashboard';
import Verify from './components/Verify';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Member } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch member data
        try {
          const docRef = doc(db, 'members', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMemberData({ id: docSnap.id, ...docSnap.data() } as any);
          }
        } catch (error) {
          console.error("Error fetching member:", error);
        }
      } else {
        setMemberData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        
        <Route
          path="/*"
          element={
            user ? (
              <Layout userRole={memberData?.role}>
                <Routes>
                  <Route path="/" element={<Home member={memberData} />} />
                  <Route path="/setup" element={<ProfileSetup />} />
                  <Route path="/id-card" element={<MemberID member={memberData} />} />
                  <Route path="/savings" element={<Savings member={memberData} />} />
                  <Route path="/messages" element={<Messages member={memberData} />} />
                  <Route path="/profile" element={<ProfileSetup member={memberData} />} />
                  <Route path="/admin" element={memberData?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                  <Route path="/verify" element={<Verify />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

