import React, { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLiveChat } from '../hooks/useLiveChat';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import type { ChatInputRef } from './ChatInput';
import ChatStatus from './ChatStatus';
import './LiveChat.css';

const LiveChat: React.FC = () => {
  const chatInputRef = useRef<ChatInputRef>(null);

  const {
    isAuthenticated,
    accessToken,
    isLoading,
    error: authError,
    login,
    logout,
    handleCallback
  } = useAuth();

  const {
    videoUrl,
    setVideoUrl,
    videoId,
    messages,
    isConnected,
    error,
    pollingInterval,
    messageCount,
    isSending,
    handleConnect,
    handleDisconnect,
    sendMessage,
  } = useLiveChat(accessToken);

  // チャットメッセージクリック時のハンドラー
  const handleMessageClick = (message: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.setMessage(message);
    }
  };

  // postMessageイベントリスナーを追加して認証を処理
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // セキュリティチェック
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'auth_success' && event.data.token) {
        handleCallback(event.data.token);
      } else if (event.data.type === 'auth_error') {
        console.error('認証エラー:', event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleCallback]);

  return (
    <div className="live-chat">
      <div className="live-chat-header">
        <h1>🎥 Youtube Live Chat Viewer</h1>

        {/* 認証ボタンと接続コントロールを横並びに */}
        <div className="auth-and-controls">
          {/* 認証ボタン */}
          <div className="auth-button-container">
            {!isAuthenticated ? (
              <button
                onClick={login}
                disabled={isLoading}
                className="auth-button login-button"
              >
                {isLoading ? '認証中...' : 'ログイン 🔐'}
              </button>
            ) : (
              <button
                onClick={logout}
                className="auth-button logout-button"
              >
                ログアウト
              </button>
            )}
          </div>

          {/* 接続コントロール */}
          <div className="connection-controls-inline">
            <input
              type="text"
              className="url-input"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube動画URLを入力..."
              disabled={isConnected}
            />
            {!isConnected ? (
              <button
                className="connect-btn"
                onClick={handleConnect}
                disabled={!videoUrl.trim()}
              >
                接続
              </button>
            ) : (
              <button
                className="disconnect-btn"
                onClick={handleDisconnect}
              >
                切断
              </button>
            )}
          </div>
        </div>

        {/* エラーメッセージ */}
        {(authError || error) && (
          <div className="error-message">
            ⚠️ {authError || error}
          </div>
        )}

        {/* ステータス表示 */}
        <ChatStatus
          isConnected={isConnected}
          videoId={videoId}
          messageCount={messageCount}
          pollingInterval={pollingInterval}
        />
      </div>

      <ChatContainer
        messages={messages}
        isConnected={isConnected}
        error={error}
        onMessageClick={handleMessageClick}
      />

      {/* チャット入力欄（認証済みかつ接続中のみ表示） */}
      {isAuthenticated && isConnected && (
        <ChatInput
          ref={chatInputRef}
          onSend={sendMessage}
          disabled={!isConnected || isSending}
          isSending={isSending}
        />
      )}

      {/* 認証が必要な場合のメッセージ */}
      {!isAuthenticated && isConnected && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderTop: '1px solid #ffc107',
          textAlign: 'center',
          color: '#856404',
        }}>
          💬 チャットを投稿するには、Googleアカウントでログインしてね！
        </div>
      )}
    </div>
  );
};

export default LiveChat;