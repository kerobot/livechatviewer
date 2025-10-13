import type { FormEvent } from 'react';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    disabled?: boolean;
    isSending?: boolean;
}

export interface ChatInputRef {
    setMessage: (text: string) => void;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSend, disabled = false, isSending = false }, ref) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    // 親コンポーネントからメッセージをセットできるようにする
    useImperativeHandle(ref, () => ({
        setMessage: (text: string) => {
            setMessage(text);
        }
    }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!message.trim() || isSending || disabled) return;

        setError(null);

        try {
            await onSend(message);
            setMessage('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'メッセージの送信に失敗したよ😢';
            setError(errorMessage);
            console.error('送信失敗:', err);
        }
    };

    return (
        <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={disabled ? '接続してからメッセージを送信してね...' : 'メッセージを入力...'}
                        disabled={disabled || isSending}
                        className="chat-input"
                        maxLength={200}
                    />
                    <button
                        type="submit"
                        disabled={disabled || isSending || !message.trim()}
                        className="chat-send-button"
                    >
                        {isSending ? '送信中...' : '送信 📤'}
                    </button>
                </div>
                {error && (
                    <div className="chat-input-error">
                        ⚠️ {error}
                    </div>
                )}
                <div className="chat-input-info">
                    {message.length}/200
                </div>
            </form>
        </div>
    );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
