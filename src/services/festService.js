import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  increment 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { initialFests } from "../firebase/seeder";

const FESTS_COLLECTION = "fests";
const LIKES_COLLECTION = "likes";

export async function getAllFests() {
  try {
    const q = query(collection(db, FESTS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return initialFests;
  } catch (error) {
    console.warn("Firestore getAllFests error, using demo fallback:", error);
    return initialFests;
  }
}

export async function getFestById(id) {
  try {
    const docRef = doc(db, FESTS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    const fallback = initialFests.find(f => f.id === id);
    return fallback || null;
  } catch (error) {
    console.warn("Firestore getFestById error, using demo fallback:", error);
    const fallback = initialFests.find(f => f.id === id);
    return fallback || null;
  }
}

export async function createFest(festData, user) {
  const festId = festData.id || `fest-${Date.now()}`;
  const docRef = doc(db, FESTS_COLLECTION, festId);
  const newFest = {
    ...festData,
    id: festId,
    likesCount: 0,
    createdBy: user?.uid || "admin",
    createdByName: user?.displayName || user?.email?.split('@')[0] || "Organizer",
    createdAt: new Date().toISOString()
  };
  await setDoc(docRef, newFest);
  return newFest;
}

export async function updateFest(id, festData) {
  const docRef = doc(db, FESTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...festData,
    updatedAt: new Date().toISOString()
  });
  return { id, ...festData };
}

export async function deleteFest(id) {
  const docRef = doc(db, FESTS_COLLECTION, id);
  await deleteDoc(docRef);
  return true;
}

export async function toggleFestLike(festId, userId) {
  if (!userId) return false;
  const likeId = `like_fest_${festId}_${userId}`;
  const likeRef = doc(db, LIKES_COLLECTION, likeId);
  const festRef = doc(db, FESTS_COLLECTION, festId);

  const likeSnap = await getDoc(likeRef);
  if (likeSnap.exists()) {
    await deleteDoc(likeRef);
    try {
      await updateDoc(festRef, { likesCount: increment(-1) });
    } catch (e) {}
    return false; // unliked
  } else {
    await setDoc(likeRef, {
      id: likeId,
      targetId: festId,
      targetType: 'fest',
      userId,
      createdAt: new Date().toISOString()
    });
    try {
      await updateDoc(festRef, { likesCount: increment(1) });
    } catch (e) {}
    return true; // liked
  }
}

export async function checkUserLikedFest(festId, userId) {
  if (!userId) return false;
  try {
    const likeId = `like_fest_${festId}_${userId}`;
    const likeRef = doc(db, LIKES_COLLECTION, likeId);
    const snap = await getDoc(likeRef);
    return snap.exists();
  } catch (e) {
    return false;
  }
}
