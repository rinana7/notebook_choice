import { Book } from "@/types";
import { db } from "./firebase"; // 設定ファイルからdbをインポート
import { collection, addDoc, serverTimestamp, orderBy, query, getDocs } from "firebase/firestore";

/**
 * 参考書の名前をFirestoreに保存する
 * @param {string} bookName - 保存したい参考書のタイトル
 */
export const saveBookName = async (bookName: string) => {
  try {
    // 1. "books" という名前のコレクションへの参照を作成
    const booksCollectionRef = collection(db, "books");

    // 2. データを追加 (ドキュメントIDは自動生成されます)
    const docRef = await addDoc(booksCollectionRef, {
      title: bookName,
      createdAt: serverTimestamp(), // 保存した時間を自動記録
    });

    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

/**
 * 参考書の名前（配列）を受け取り、それぞれをドキュメントとして保存する
 * @param {string[]} books - ['数学', '英語', '物理'] のような配列
 */
export const saveMultipleBooks = async (books: Book[]) => {
  const booksCollectionRef = collection(db, "books");

  try {
    // 全ての保存処理をPromise.allで並列実行
    const promises = books.map((book) => {
      return addDoc(booksCollectionRef, {
        title: book.title,
        subject: book.subject,
        createdAt: serverTimestamp(),
      });
    });

    await Promise.all(promises);
    console.log(`${books.length}冊の参考書を保存しました`);
  } catch (error) {
    console.error("Error saving books: ", error);
    throw error;
  }
};

/**
 * "books" コレクションから全てのドキュメントを取得する
 */
export const getAllBooks = async () => {
  try {
    // 1. コレクションへの参照を作成
    // 作成日時(createdAt)の降順（新しい順）で並び替えるクエリ
    const q = query(collection(db, "books"), orderBy("createdAt", "desc"));

    // 2. データを取得
    const querySnapshot = await getDocs(q);

    // 3. データを使いやすい配列形式に変換
    const books = querySnapshot.docs.map(doc => ({
      id: doc.id,         // ドキュメントID
      ...doc.data()       // 保存されている中身（titleなど）
    }));

    return books;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};