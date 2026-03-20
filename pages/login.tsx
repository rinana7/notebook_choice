import React, { useState } from 'react';
import { login, signUp } from '../libs/authFunctions'; // 先ほど作った関数
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'login') {
        await login(email, password);
        alert("おかえりなさい！");
      } else {
        await signUp(email, password);
        alert("アカウントを作成しました！");
      }
    } catch (err: any) {
      alert("エラー: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Notebook App</h2>
          <p className="text-gray-500 mt-2">ログインまたは新規登録してください</p>
        </div>

        <form className="space-y-6">
          {/* メールアドレス入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* パスワード入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* ボタンエリア */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={(e) => handleSubmit(e, 'login')}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              ログイン
            </button>
            
            <button
              onClick={(e) => handleSubmit(e, 'signup')}
              disabled={loading}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              新規アカウント作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;