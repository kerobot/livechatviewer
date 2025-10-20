import React, { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '../types/youtube';
import ChatMessage from './ChatMessage';

interface ChatContainerProps {
    messages: ChatMessageType[];
    isConnected: boolean;
    error: string | null;
    onMessageClick?: (message: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
    messages,
    isConnected,
    error,
    onMessageClick,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            {messages.length === 0 && isConnected && !error && (
                <div className="no-messages">
                    <div className="loading-spinner">⏳</div>
                    <p>チャットの受信を待機中...</p>
                </div>
            )}

            {messages.map((message) => (
                <ChatMessage
                    key={message.id}
                    message={message}
                    onClick={onMessageClick}
                />
            ))}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatContainer;
