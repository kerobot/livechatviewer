import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage, LiveChatMessageItem } from '../types/youtube';
import { extractVideoId, fetchLiveChat, formatTimestamp, validateVideoId } from '../utils/youtube';
import './LiveChat.css';

const LiveChat: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number>(5000);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [messageCount, setMessageCount] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージリストの最下部にスクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 接続処理
  const handleConnect = () => {
    const extractedVideoId = extractVideoId(videoUrl);
    
    if (!extractedVideoId) {
      setError('無効な YouTube URL です。正しい URL を入力してください。');
      return;
    }

    if (!validateVideoId(extractedVideoId)) {
      setError('動画 ID の形式が正しくありません。');
      return;
    }
    
    setVideoId(extractedVideoId);
    setError(null);
    setMessages([]);
    setMessageCount(0);
    setNextPageToken(undefined);
    setIsConnected(true);
    
    // 初回取得
    fetchMessages(extractedVideoId);
    
    // 定期取得を開始
    intervalRef.current = setInterval(() => {
      fetchMessages(extractedVideoId, nextPageToken);
    }, pollingInterval);
  };

  // チャットメッセージ取得
  const fetchMessages = async (id: string, pageToken?: string) => {
    try {
      const response = await fetchLiveChat(id, pageToken);
      
      // レスポンスデータを変換
      const newChatMessages: ChatMessage[] = response.items.map((item: LiveChatMessageItem) => ({
        id: item.id,
        authorName: item.authorDetails.displayName,
        authorPhotoUrl: item.authorDetails.profileImageUrl,
        message: item.snippet.displayMessage,
        timestamp: item.snippet.publishedAt,
        authorChannelId: item.snippet.authorChannelId,
      }));

      // 新しいメッセージのみを追加（重複排除）
      setMessages(prevMessages => {
        const existingIds = new Set(prevMessages.map(msg => msg.id));
        const uniqueNewMessages = newChatMessages.filter(msg => !existingIds.has(msg.id));
        const updatedMessages = [...prevMessages, ...uniqueNewMessages];
        
        // メッセージ数を更新
        setMessageCount(updatedMessages.length);
        
        return updatedMessages;
      });
      
      // ページトークンとポーリング間隔を更新
      setNextPageToken(response.nextPageToken);
      if (response.pollingIntervalMillis && response.pollingIntervalMillis !== pollingInterval) {
        setPollingInterval(response.pollingIntervalMillis);
        
        // インターバルを再設定
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = setInterval(() => {
            fetchMessages(id, response.nextPageToken);
          }, response.pollingIntervalMillis);
        }
      }
      
    } catch (err) {
      console.error('チャット取得エラー:', err);
      const errorMessage = err instanceof Error ? err.message : 'チャットの取得に失敗しました。';
      setError(errorMessage);
    }
  };

  // 切断処理
  const handleDisconnect = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsConnected(false);
    setVideoId(null);
    setMessages([]);
    setMessageCount(0);
    setNextPageToken(undefined);
    setError(null);
  };

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="live-chat">
      <div className="live-chat-header">
        <h1>🎥 Youtube Live Chat Viewer</h1>
        
        <div className="connection-controls">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="YouTube URL を入力してください。"
            className="url-input"
            disabled={isConnected}
          />
          
          {!isConnected ? (
            <button 
              onClick={handleConnect} 
              className="connect-btn"
              disabled={!videoUrl.trim()}
            >
              接続する
            </button>
          ) : (
            <button onClick={handleDisconnect} className="disconnect-btn">
              切断する
            </button>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {isConnected && videoId && (
          <div className="status">
            <span className="connected-indicator">🟢</span>
            <span className="status-text">動画ID: {videoId} に接続中...</span>
            <span className="message-count">メッセージ数: {messageCount}</span>
            <span className="polling-info">更新間隔: {pollingInterval / 1000}秒</span>
          </div>
        )}
      </div>

      <div className="chat-container">
        {messages.length === 0 && isConnected && !error && (
          <div className="no-messages">
            <div className="loading-spinner">⏳</div>
            <p>チャットの受信を待機中...</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <img 
              src={message.authorPhotoUrl} 
              alt={message.authorName}
              className="author-avatar"
              onError={(e) => {
                // 画像読み込みエラーの場合はデフォルト画像を表示
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkZGQiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzk5OSIvPgo8cGF0aCBkPSJNMTAgMzJjMC02IDYtMTAgMTAtMTBzMTAgNCAxMCAxMCIgZmlsbD0iIzk5OSIvPgo8L3N2Zz4K';
              }}
            />
            <div className="message-content">
              <div className="message-header">
                <span className="author-name">{message.authorName}</span>
                <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
              </div>
              <div className="message-text">{message.message}</div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default LiveChat;
