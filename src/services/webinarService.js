import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { initialWebinars } from "../firebase/seeder";

const WEBINARS_COLLECTION = "webinars";

export async function getAllWebinars() {
  try {
    const q = query(collection(db, WEBINARS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return initialWebinars;
  } catch (error) {
    console.warn("Firestore getAllWebinars error, fallback to demo:", error);
    return initialWebinars;
  }
}

export async function getWebinarById(id) {
  try {
    const docRef = doc(db, WEBINARS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    const fallback = initialWebinars.find(w => w.id === id);
    return fallback || null;
  } catch (error) {
    console.warn("Firestore getWebinarById error, fallback to demo:", error);
    const fallback = initialWebinars.find(w => w.id === id);
    return fallback || null;
  }
}

export async function createWebinar(webinarData, user) {
  const id = webinarData.id || `webinar-${Date.now()}`;
  const docRef = doc(db, WEBINARS_COLLECTION, id);
  const newWebinar = {
    ...webinarData,
    id,
    createdBy: user?.uid || "admin",
    createdAt: new Date().toISOString()
  };
  await setDoc(docRef, newWebinar);
  return newWebinar;
}

export async function updateWebinar(id, data) {
  const docRef = doc(db, WEBINARS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
  return { id, ...data };
}

export async function deleteWebinar(id) {
  const docRef = doc(db, WEBINARS_COLLECTION, id);
  await deleteDoc(docRef);
  return true;
}
