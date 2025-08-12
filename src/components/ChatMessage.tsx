import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types/youtube';
import { formatTimestamp } from '../utils/youtube';

interface ChatMessageProps {
    message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkZGQiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzk5OSIvPgo8cGF0aCBkPSJNMTAgMzJjMC02IDYtMTAgMTAtMTBzMTAgNCAxMCAxMCIgZmlsbD0iIzk5OSIvPgo8L3N2Zz4K';

        if (target.src !== defaultAvatar) {
            target.src = defaultAvatar;
        }
    };

    return (
        <div className="chat-message">
            <img
                src={message.authorPhotoUrl}
                alt={message.authorName}
                className="author-avatar"
                onError={handleImageError}
            />
            <div className="message-content">
                <div className="message-header">
                    <span className="author-name">{message.authorName}</span>
                    <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                </div>
                <div className="message-text">{message.message}</div>
            </div>
        </div>
    );
};

export default ChatMessage;
