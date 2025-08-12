import React from 'react';

interface ChatStatusProps {
    isConnected: boolean;
    videoId: string | null;
    messageCount: number;
    pollingInterval: number;
}

const ChatStatus: React.FC<ChatStatusProps> = ({
    isConnected,
    videoId,
    messageCount,
    pollingInterval,
}) => {
    if (!isConnected || !videoId) {
        return null;
    }

    return (
        <div className="status">
            <span className="connected-indicator">🟢</span>
            <span className="status-text">動画ID: {videoId} に接続中...</span>
            <span className="message-count">メッセージ数: {messageCount}</span>
            <span className="polling-info">更新間隔: {pollingInterval / 1000}秒</span>
        </div>
    );
};

export default ChatStatus;
