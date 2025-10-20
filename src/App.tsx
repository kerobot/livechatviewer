import React, { useState } from 'react';
import './App.css';
import AuthCallback from './components/AuthCallback';
import LiveChat from './components/LiveChat';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { handleCallback } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // シンプルなルーティング処理
  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // popstateイベントでブラウザの戻る/進むをハンドリング
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // 認証コールバックページの表示
  if (currentPath === '/auth/callback') {
    return (
      <div className="App">
        <AuthCallback onAuthSuccess={handleCallback} />
      </div>
    );
  }

  // メインページの表示
  return (
    <div className="App">
      <LiveChat />
    </div>
  );
};

export default App;
