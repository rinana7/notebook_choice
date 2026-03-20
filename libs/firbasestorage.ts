// 作成した設定ファイルから import する
import { storage } from "./firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file: File, path: string) => {
  // すでに初期化済みの storage を使う
  const storageRef = ref(storage, path);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};