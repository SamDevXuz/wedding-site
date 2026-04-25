import {
  ref,
  get,
  set,
  push,
  remove,
  onValue,
  type Unsubscribe,
} from "firebase/database";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { db, auth } from "./firebase";

export type WeddingConfig = {
  groomName: string;
  brideName: string;
  weddingDate: string;
  time: string;
  venue: string;
  address: string;
  phone: string;
  mapEmbedUrl: string;
  mapDirectUrl: string;
  message: string;
};

export type Wish = {
  id: string;
  userName: string;
  message: string;
  sticker: string;
  createdAt: number;
};

const CONFIG_REF = "wedding/config";
const WISHES_REF = "wedding/wishes";

export const DEFAULT_CONFIG: WeddingConfig = {
  groomName: "Ravshanbek",
  brideName: "Madinaxon",
  weddingDate: "2025-12-21",
  time: "16:00",
  venue: "Brend Hall",
  address: "Toshkent shahri, Yunusobod tumani",
  phone: "+998 94 970 77 09",
  mapEmbedUrl: "https://yandex.uz/map-widget/v1/org/137312223024/?ll=69.310315%2C41.379257&z=15",
  mapDirectUrl: "https://yandex.com/maps/org/137312223024?si=8rrhkurfevka3dexmmm1b289cw",
  message: "Ushbu muborak nikoh tantanasida Sizning ishtirokingiz quvonchimizga quvonch, baxtimizga baxt qo'shadi.",
};

export async function getWeddingConfig(): Promise<WeddingConfig | null> {
  const snap = await get(ref(db, CONFIG_REF));
  return snap.exists() ? (snap.val() as WeddingConfig) : null;
}

export function subscribeConfig(
  cb: (config: WeddingConfig) => void,
): Unsubscribe {
  try {
    return onValue(ref(db, CONFIG_REF), (snap) => {
      cb(snap.exists() ? (snap.val() as WeddingConfig) : DEFAULT_CONFIG);
    }, () => {
      cb(DEFAULT_CONFIG);
    });
  } catch {
    cb(DEFAULT_CONFIG);
    return () => {};
  }
}

export async function saveWeddingConfig(
  config: WeddingConfig,
): Promise<void> {
  await set(ref(db, CONFIG_REF), config);
}

export async function getWishes(): Promise<Wish[]> {
  const snap = await get(ref(db, WISHES_REF));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, Omit<Wish, "id">>;
  return Object.entries(data)
    .map(([id, w]) => ({ id, ...w }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function subscribeWishes(cb: (wishes: Wish[]) => void): Unsubscribe {
  try {
    return onValue(ref(db, WISHES_REF), (snap) => {
      if (!snap.exists()) {
        cb([]);
        return;
      }
      const data = snap.val() as Record<string, Omit<Wish, "id">>;
      const list = Object.entries(data)
        .map(([id, w]) => ({ id, ...w }))
        .sort((a, b) => b.createdAt - a.createdAt);
      cb(list);
    }, () => {
      cb([]);
    });
  } catch {
    cb([]);
    return () => {};
  }
}

export async function addWish(
  userName: string,
  message: string,
  sticker: string,
): Promise<void> {
  await push(ref(db, WISHES_REF), {
    userName,
    message,
    sticker,
    createdAt: Date.now(),
  });
}

export async function removeWish(id: string): Promise<void> {
  await remove(ref(db, `${WISHES_REF}/${id}`));
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function adminLogout(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(cb: (user: User | null) => void): Unsubscribe {
  try {
    return onAuthStateChanged(auth, cb);
  } catch {
    cb(null);
    return () => {};
  }
}
