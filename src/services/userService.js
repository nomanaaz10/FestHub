import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "../firebase/config";

const USERS_COLLECTION = "users";
const REGISTRATIONS_COLLECTION = "registrations";

export async function getAllRegistrations() {
  try {
    const q = query(collection(db, REGISTRATIONS_COLLECTION));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Firestore getAllRegistrations error:", error);
    return [];
  }
}

export async function getAllUsers() {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Firestore getAllUsers error:", error);
    return [];
  }
}

export async function getSubAdmins() {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("role", "==", "subadmin")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Firestore getSubAdmins error:", error);
    return [];
  }
}

export async function findUserByEmail(email) {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("email", "==", email.trim().toLowerCase())
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.warn("Error finding user by email:", error);
    return null;
  }
}

export async function updateUserRole(userId, newRole) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    role: newRole,
    updatedAt: new Date().toISOString()
  });
  return true;
}

export async function getUserRegistrations(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Error getting user registrations:", error);
    return [];
  }
}
