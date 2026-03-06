
import React, { useState, useRef, useCallback } from 'react';
import { Book, GradeLevel } from './types';
import { getCoachAdvice, extractBooksFromImage } from './services/geminiService';
import BookList from './components/BookList';

const SUBJECT_OPTIONS = ['英語', '数学', '国語', '物理', '化学', '生物', '日本史', '世界史', '地理', '公共', '情報'];

const App: React.FC = () => {
  const [targetCollege, setTargetCollege] = useState('');
  const [targetDegree, setTargetDegree] = useState('');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('hs3');
  const [subjectsToImprove, setSubjectsToImprove] = useState<string[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddBook = (title: string, subject: string) => {
    const newBook: Book = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      subject,
    };
    setBooks([...books, newBook]);
  };

  const handleRemoveBook = (id: string) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  const toggleSubjectToImprove = (subject: string) => {
    setSubjectsToImprove(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください。');
      return;
    }

    setScanLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const extracted = await extractBooksFromImage(base64, file.type);
        
        const newBooks: Book[] = extracted.map(b => ({
          id: Math.random().toString(36).substring(2, 9),
          title: b.title,
          subject: b.subject
        }));

        setBooks(prev => [...prev, ...newBooks]);
        setScanLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || '写真の解析中にエラーが発生しました。');
      setScanLoading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (books.length === 0) {
      setError('参考書を少なくとも1冊追加してください。');
      return;
    }
    if (!targetCollege.trim()) {
      setError('志望校を入力してください。');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const advice = await getCoachAdvice(books, targetCollege, targetDegree, gradeLevel, subjectsToImprove);
      setResult(advice);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`min-h-screen pb-20 transition-colors duration-300 ${isDragging ? 'bg-indigo-50' : 'bg-slate-50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <header className="bg-slate-900 text-white py-10 px-4 shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
            Study Optimizer AI
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
            参考書サクリファイス
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto px-4">
            棚に眠る参考書を「捨てる」勇気が、第一志望への最短距離。
            <br className="hidden md:block" />
            AIがあなたを救う唯一の1冊を選び抜きます。
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Goal Settings Section */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-indigo-100 flex items-center justify-center rounded-lg text-lg">🎯</span>
            目標の設定
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">志望校</label>
              <input 
                type="text"
                value={targetCollege}
                onChange={(e) => setTargetCollege(e.target.value)}
                placeholder="例：東京大学、早稲田大学"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">志望学部・学位</label>
              <input 
                type="text"
                value={targetDegree}
                onChange={(e) => setTargetDegree(e.target.value)}
                placeholder="例：工学部、法学、医学"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="block text-sm font-bold text-slate-700">現在の学年</label>
            <div className="flex p-1 bg-slate-100 rounded-xl overflow-hidden max-w-md">
              {[
                { id: 'hs1', label: '高1' },
                { id: 'hs2', label: '高2' },
                { id: 'hs3', label: '高3' },
                { id: 'other', label: '既卒・他' }
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setGradeLevel(level.id as GradeLevel)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    gradeLevel === level.id 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-slate-700">重点的に伸ばしたい教科（複数選択可）</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleSubjectToImprove(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    subjectsToImprove.includes(subject)
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Drag and Drop Zone / Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={scanLoading}
            className={`flex flex-col items-center justify-center gap-3 bg-white border-2 p-6 rounded-2xl transition-all group active:scale-95 disabled:opacity-50 relative overflow-hidden ${
              isDragging ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-200' : 'border-slate-200 hover:border-indigo-400'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
              isDragging ? 'bg-indigo-600 text-white animate-bounce' : 'bg-slate-100 group-hover:bg-indigo-100'
            }`}>
              {scanLoading ? (
                <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : '📸'}
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-800">{isDragging ? 'ここにドロップ' : '写真を選択・ドロップ'}</div>
              <div className="text-sm text-slate-500">{isDragging ? '手を離して解析開始' : '本棚を撮るか、画像をドラッグ'}</div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
              capture="environment"
            />
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading || scanLoading || books.length === 0}
            className={`flex items-center justify-center gap-3 p-6 rounded-2xl text-white font-bold text-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
              loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <span>{loading ? '判定中...' : '運命の1冊を決定'}</span>
            {!loading && <span className="text-2xl">⚡️</span>}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-lg text-lg">📚</span>
            手持ちの参考書リスト
            <span className="ml-auto text-xs font-normal text-slate-400">
              {books.length} 冊
            </span>
          </h2>
          <BookList books={books} onAdd={handleAddBook} onRemove={handleRemoveBook} />
        </section>

        {/* Result Section */}
        {result && (
          <section id="result-section" className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-inner">
                <span className="text-2xl">⚖️</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">AIコーチの断固たる審判</h3>
                <p className="text-slate-400 text-sm">迷いはここで断ち切れ</p>
              </div>
            </div>

            <div className="space-y-2">
              {result.split('\n').map((line, i) => {
                if (line.startsWith('【今やる1冊】')) {
                  return (
                    <div key={i} className="text-center my-4 overflow-hidden">
                      <p className="text-7xl md:text-[12rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] break-words">
                        {line.replace('【今やる1冊】', '').trim()}
                      </p>
                    </div>
                  );
                }
                if (line.startsWith('【理由】')) {
                  return <h4 key={i} className="text-slate-400 font-bold text-sm mt-4 mb-3 border-l-2 border-indigo-500 pl-3">選定理由</h4>;
                }
                if (line.startsWith('【今はやらない】')) {
                  return <h4 key={i} className="text-slate-400 font-bold text-sm mt-8 mb-3 border-l-2 border-red-500 pl-3">今は不要な参考書（サクリファイス）</h4>;
                }
                if (line.trim().startsWith('・')) {
                  return <div key={i} className="flex gap-3 mb-1 ml-1"><span className="text-indigo-500 font-bold">●</span><p className="text-slate-100 leading-relaxed font-medium">{line.substring(1).trim()}</p></div>;
                }
                if (line.trim().startsWith('-')) {
                  return <div key={i} className="flex gap-3 mb-1 ml-1"><span className="text-slate-600 font-bold">○</span><p className="text-slate-400 leading-relaxed text-sm">{line.substring(1).trim()}</p></div>;
                }
                if (line.trim() === '') return null;
                return <p key={i} className="text-slate-100 font-medium mb-1">{line}</p>;
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 text-center">
              <p className="text-indigo-400 text-sm font-bold mb-4 uppercase tracking-widest">Decision Made.</p>
              <p className="text-slate-500 text-sm italic">
                「あれもこれも」は敗北への道。
                <br />
                今選ばれたその1冊に、すべての熱量を注ぎ込め。
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10 text-center text-slate-400 text-xs tracking-widest uppercase">
        <p>&copy; 2024 REFERENCE SACRIFICE - AI JUDGMENT SYSTEM</p>
      </footer>
    </div>
  );
};

export default App;
