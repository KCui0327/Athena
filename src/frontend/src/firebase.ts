import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const validateFirebaseConfig = () => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
  const missingKeys = requiredKeys.filter(
    (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
  );

  if (missingKeys.length > 0) {
    console.error(`Missing required Firebase configuration: ${missingKeys.join(", ")}`);
    throw new Error("Invalid Firebase configuration");
  }
};

validateFirebaseConfig();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const createUserInBackend = async (userId: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append("user_id", userId);

    const response = await fetch("http://localhost:8000/create-user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Backend error:", errorText);
    }
  } catch (error) {
    console.error("Error calling backend:", error);
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    await createUserInBackend(uid);
    return result;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const uid = result.user.uid;
    await createUserInBackend(uid);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onUserAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
