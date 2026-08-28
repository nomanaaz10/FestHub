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
import { initialCompetitions } from "../firebase/seeder";

const COMPETITIONS_COLLECTION = "competitions";
const REGISTRATIONS_COLLECTION = "registrations";
const LIKES_COLLECTION = "likes";
const COMMENTS_COLLECTION = "comments";

export async function getAllCompetitions() {
  try {
    const q = query(collection(db, COMPETITIONS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return initialCompetitions;
  } catch (error) {
    console.warn("Firestore getAllCompetitions error, fallback to demo:", error);
    return initialCompetitions;
  }
}

export async function getCompetitionsByFestId(festId) {
  try {
    const q = query(
      collection(db, COMPETITIONS_COLLECTION), 
      where("festId", "==", festId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return initialCompetitions.filter(c => c.festId === festId);
  } catch (error) {
    console.warn("Firestore getCompetitionsByFestId error, fallback to demo:", error);
    return initialCompetitions.filter(c => c.festId === festId);
  }
}

export async function getCompetitionById(id) {
  try {
    const docRef = doc(db, COMPETITIONS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    const fallback = initialCompetitions.find(c => c.id === id);
    return fallback || null;
  } catch (error) {
    console.warn("Firestore getCompetitionById error, fallback to demo:", error);
    const fallback = initialCompetitions.find(c => c.id === id);
    return fallback || null;
  }
}

export async function createCompetition(compData, user) {
  const compId = compData.id || `comp-${Date.now()}`;
  const docRef = doc(db, COMPETITIONS_COLLECTION, compId);
  const newComp = {
    ...compData,
    id: compId,
    likesCount: 0,
    createdBy: user?.uid || "admin",
    createdAt: new Date().toISOString()
  };
  await setDoc(docRef, newComp);
  return newComp;
}

export async function updateCompetition(id, compData) {
  const docRef = doc(db, COMPETITIONS_COLLECTION, id);
  await updateDoc(docRef, {
    ...compData,
    updatedAt: new Date().toISOString()
  });
  return { id, ...compData };
}

export async function deleteCompetition(id) {
  const docRef = doc(db, COMPETITIONS_COLLECTION, id);
  await deleteDoc(docRef);
  return true;
}

// ----------------- REGISTRATIONS -----------------

export async function registerForCompetition(competition, user, userProfile) {
  if (!user) throw new Error("User must be logged in to register.");
  const regId = `reg_${competition.id}_${user.uid}`;
  const regRef = doc(db, REGISTRATIONS_COLLECTION, regId);

  const regData = {
    id: regId,
    competitionId: competition.id,
    competitionTitle: competition.title,
    festId: competition.festId,
    festTitle: competition.festTitle || "",
    competitionDate: competition.competitionDate || "",
    venue: competition.venue || "",
    userId: user.uid,
    userName: userProfile?.displayName || user.displayName || user.email.split('@')[0],
    userEmail: user.email,
    userPhoto: userProfile?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
    emailVerified: Boolean(userProfile?.emailVerified || user.emailVerified || user.providerData.some(p => p.providerId === 'google.com')),
    registeredAt: new Date().toISOString()
  };

  await setDoc(regRef, regData);
  return regData;
}

export async function unregisterFromCompetition(competitionId, userId) {
  const regId = `reg_${competitionId}_${userId}`;
  const regRef = doc(db, REGISTRATIONS_COLLECTION, regId);
  await deleteDoc(regRef);
  return true;
}

export async function checkUserRegistered(competitionId, userId) {
  if (!userId) return false;
  try {
    const regId = `reg_${competitionId}_${userId}`;
    const regRef = doc(db, REGISTRATIONS_COLLECTION, regId);
    const snap = await getDoc(regRef);
    return snap.exists();
  } catch (e) {
    return false;
  }
}

export async function getCompetitionParticipants(competitionId) {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where("competitionId", "==", competitionId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => d.data());
    }
    // Demo participants if none registered yet
    return [
      {
        id: "demo-p1",
        userName: "Aisha Khan",
        userEmail: "aisha.k@college.edu",
        userPhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=Aisha",
        emailVerified: true,
        registeredAt: "2027-01-15T10:30:00.000Z"
      },
      {
        id: "demo-p2",
        userName: "Rahul Patil",
        userEmail: "rahul.p@college.edu",
        userPhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
        emailVerified: true,
        registeredAt: "2027-01-16T14:20:00.000Z"
      },
      {
        id: "demo-p3",
        userName: "Sneha Joshi",
        userEmail: "sneha.j@college.edu",
        userPhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=Sneha",
        emailVerified: false,
        registeredAt: "2027-01-17T09:15:00.000Z"
      },
      {
        id: "demo-p4",
        userName: "Arjun Sharma",
        userEmail: "arjun.s@college.edu",
        userPhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=Arjun",
        emailVerified: true,
        registeredAt: "2027-01-18T18:45:00.000Z"
      }
    ];
  } catch (error) {
    console.warn("Error getting participants, fallback demo:", error);
    return [];
  }
}

// ----------------- LIKES -----------------

export async function toggleCompetitionLike(competitionId, userId) {
  if (!userId) return false;
  const likeId = `like_comp_${competitionId}_${userId}`;
  const likeRef = doc(db, LIKES_COLLECTION, likeId);
  const compRef = doc(db, COMPETITIONS_COLLECTION, competitionId);

  const likeSnap = await getDoc(likeRef);
  if (likeSnap.exists()) {
    await deleteDoc(likeRef);
    try {
      await updateDoc(compRef, { likesCount: increment(-1) });
    } catch (e) {}
    return false; // unliked
  } else {
    await setDoc(likeRef, {
      id: likeId,
      targetId: competitionId,
      targetType: 'competition',
      userId,
      createdAt: new Date().toISOString()
    });
    try {
      await updateDoc(compRef, { likesCount: increment(1) });
    } catch (e) {}
    return true; // liked
  }
}

export async function checkUserLikedCompetition(competitionId, userId) {
  if (!userId) return false;
  try {
    const likeId = `like_comp_${competitionId}_${userId}`;
    const likeRef = doc(db, LIKES_COLLECTION, likeId);
    const snap = await getDoc(likeRef);
    return snap.exists();
  } catch (e) {
    return false;
  }
}

// ----------------- COMMENTS -----------------

export async function getCompetitionComments(competitionId) {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where("competitionId", "==", competitionId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    // Demo comments
    return [
      {
        id: "demo-c1",
        competitionId,
        userName: "Rahul Patil",
        userPhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul",
        emailVerified: true,
        text: "Really excited for this! Is there any specific dress code for the event?",
        createdAt: "2027-01-16T15:00:00.000Z"
      },
      {
        id: "demo-c2",
        competitionId,
        userName: "Fest Coordinator",
        userPhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=AdminCoord",
        emailVerified: true,
        role: "subadmin",
        text: "Formal or smart casual attire is recommended for stage competitions. Good luck to all participants!",
        createdAt: "2027-01-16T16:30:00.000Z"
      }
    ];
  } catch (error) {
    console.warn("Error getting comments, fallback demo:", error);
    return [];
  }
}

export async function addCompetitionComment(competitionId, text, user, userProfile) {
  if (!user || !text.trim()) throw new Error("Invalid comment submission");
  const commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);

  const commentData = {
    id: commentId,
    competitionId,
    userId: user.uid,
    userName: userProfile?.displayName || user.displayName || user.email.split('@')[0],
    userPhoto: userProfile?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
    emailVerified: Boolean(userProfile?.emailVerified || user.emailVerified || user.providerData.some(p => p.providerId === 'google.com')),
    role: userProfile?.role || 'student',
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  await setDoc(commentRef, commentData);
  return commentData;
}

export async function deleteCompetitionComment(commentId) {
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  await deleteDoc(commentRef);
  return true;
}
