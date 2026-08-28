import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { initialAnnouncements } from "../firebase/seeder";

const ANNOUNCEMENTS_COLLECTION = "announcements";

export async function getAllAnnouncements() {
  try {
    const q = query(collection(db, ANNOUNCEMENTS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return initialAnnouncements;
  } catch (error) {
    console.warn("Firestore getAllAnnouncements error, fallback to demo:", error);
    return initialAnnouncements;
  }
}

export async function createAnnouncement(announcementData, user) {
  const id = announcementData.id || `announcement-${Date.now()}`;
  const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  const newAnnouncement = {
    ...announcementData,
    id,
    createdBy: user?.uid || "admin",
    createdAt: new Date().toISOString()
  };
  await setDoc(docRef, newAnnouncement);
  return newAnnouncement;
}

export async function updateAnnouncement(id, data) {
  const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
  return { id, ...data };
}

export async function deleteAnnouncement(id) {
  const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  await deleteDoc(docRef);
  return true;
}
