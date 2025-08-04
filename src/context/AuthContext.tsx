"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { 
  onIdTokenChanged, 
  User, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AppUser } from "@/lib/types";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signUp: (email: string, pass: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => { throw new Error('signIn not implemented') },
  signUp: async () => { throw new Error('signUp not implemented') },
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        document.cookie = `firebaseIdToken=${token}; path=/; max-age=3600`;

        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userData.role || 'police',
          });
        } else {
           // This might happen for users created before the roles system was in place
           // Or if the doc creation failed during signup.
           // Defaulting to 'police' role.
          const newUserDoc = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'police',
          };
          await setDoc(userDocRef, newUserDoc);
          setUser(newUserDoc);
        }

      } else {
        setUser(null);
        document.cookie = 'firebaseIdToken=; path=/; max-age=-1';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const { user: firebaseUser } = userCredential;
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: 'police', // Default role
      });
    }
    return userCredential;
  };
  
  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
