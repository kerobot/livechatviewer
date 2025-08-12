import React from 'react';
import { useLiveChat } from '../hooks/useLiveChat';
import ChatContainer from './ChatContainer';
import ChatStatus from './ChatStatus';
import ConnectionControls from './ConnectionControls';
import './LiveChat.css';

const LiveChat: React.FC = () => {
  const {
    videoUrl,
    setVideoUrl,
    videoId,
    messages,
    isConnected,
    error,
    pollingInterval,
    messageCount,
    handleConnect,
    handleDisconnect,
  } = useLiveChat();

  return (
    <div className="live-chat">
      <div className="live-chat-header">
        <h1>🎥 Youtube Live Chat Viewer</h1>

        <ConnectionControls
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          isConnected={isConnected}
          error={error}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

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
      />
    </div>
  );
};

export default LiveChat;