// idb.js
import { openDB } from 'idb';

const DB_NAME = 'authDB';
const STORE_NAME = 'authStore';
const KEY = 'loginStatus';

const initDB = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const setLoginStatus = async (status) => {
  const db = await initDB();
  await db.put(STORE_NAME, status, KEY);
};

export const getLoginStatus = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, KEY);
};

export const removeLoginStatus = async () => {
  const db = await initDB();
  await db.delete(STORE_NAME, KEY);
};