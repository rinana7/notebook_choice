
import React, { useState } from 'react';
import { Book } from '../types';

interface BookListProps {
  books: Book[];
  onAdd: (title: string, subject: string) => void;
  onRemove: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onAdd, onRemove }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('英語');

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim(), subject);
      setTitle('');
    }
  };

  const subjects = ['英語', '数学', '国語', '物理', '化学', '生物', '日本史', '世界史', '地理', '公共・倫理・政経', '情報', 'その他'];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-2">参考書の追加</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：青チャート、ターゲット1900"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
          />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shrink-0"
          >
            追加
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {books.length === 0 ? (
          <p className="text-center text-slate-400 py-8 border-2 border-dashed border-slate-200 rounded-xl">
            手持ちの参考書を追加してください
          </p>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg group hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                  {book.subject}
                </span>
                <span className="text-slate-700 font-medium">{book.title}</span>
              </div>
              <button
                onClick={() => onRemove(book.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                aria-label="削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;
