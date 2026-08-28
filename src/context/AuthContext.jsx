import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

const SUPER_ADMIN_EMAILS = ['nomanaaz10@gmail.com', 'admin@festhub.com', 'nahz@festhub.com'];

const isSuperAdminEmail = (email) => {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore
  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        
        // Listen to live profile changes
        unsubscribeDoc = onSnapshot(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            // Automatically upgrade to superadmin if logged in with superadmin email
            if (isSuperAdminEmail(user.email) && data.role !== 'superadmin') {
              try {
                await setDoc(userRef, { ...data, role: 'superadmin' }, { merge: true });
                setUserProfile({ ...data, role: 'superadmin' });
              } catch (e) {
                setUserProfile(data);
              }
            } else {
              setUserProfile(data);
            }
          } else {
            // First time user registration in Firestore
            const isSuper = isSuperAdminEmail(user.email);
            const initialData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || "Student",
              photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
              role: isSuper ? "superadmin" : "student",
              emailVerified: Boolean(user.emailVerified || user.providerData.some(p => p.providerId === 'google.com')),
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(userRef, initialData);
              setUserProfile(initialData);
            } catch (err) {
              console.warn("Could not save initial user doc:", err);
              setUserProfile(initialData);
            }
          }
          setLoading(false);
        }, (err) => {
          console.warn("Profile snapshot error:", err);
          // Fallback profile if Firestore read is restricted
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Student",
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
            role: isSuperAdminEmail(user.email) ? "superadmin" : "student",
            emailVerified: Boolean(user.emailVerified || user.providerData.some(p => p.providerId === 'google.com')),
            createdAt: new Date().toISOString()
          });
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        if (unsubscribeDoc) unsubscribeDoc();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    const userRef = doc(db, "users", userCredential.user.uid);
    const initialData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName || email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${userCredential.user.uid}`,
      role: isSuperAdminEmail(email) ? "superadmin" : "student",
      emailVerified: false,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(userRef, initialData);
      setUserProfile(initialData);
    } catch (e) {
      console.warn("Signup Firestore save error:", e);
    }
    return userCredential.user;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const initialData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
        role: isSuperAdminEmail(user.email) ? "superadmin" : "student",
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, initialData);
      setUserProfile(initialData);
    } else {
      const data = snap.data();
      if (isSuperAdminEmail(user.email) && data.role !== 'superadmin') {
        await setDoc(userRef, { ...data, role: 'superadmin' }, { merge: true });
        setUserProfile({ ...data, role: 'superadmin' });
      }
    }
    return user;
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Helper flags
  const role = userProfile?.role || "student";
  const isSuperAdmin = role === "superadmin" || isSuperAdminEmail(currentUser?.email);
  const isSubAdmin = isSuperAdmin || role === "subadmin";
  const isStudent = !isSuperAdmin && !isSubAdmin;
  const isEmailVerified = Boolean(currentUser?.emailVerified || currentUser?.providerData?.some(p => p.providerId === 'google.com') || userProfile?.emailVerified);

  const value = {
    currentUser,
    userProfile,
    role,
    isSuperAdmin,
    isSubAdmin,
    isStudent,
    isEmailVerified,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
