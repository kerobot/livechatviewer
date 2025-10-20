import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../config';
import type { ChatMessage, LiveChatMessageItem, SendMessageRequest, SendMessageResponse } from '../types/youtube';
import { extractVideoId, fetchLiveChat, validateVideoId } from '../utils/youtube';

export const useLiveChat = (accessToken: string | null = null) => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [videoId, setVideoId] = useState<string | null>(null);
    const [liveChatId, setLiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pollingInterval, setPollingInterval] = useState<number>(config.defaultPollingInterval);
    const [messageCount, setMessageCount] = useState<number>(0);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isDummyMode, setIsDummyMode] = useState<boolean>(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const nextPageTokenRef = useRef<string | undefined>(undefined);
    const currentVideoIdRef = useRef<string | null>(null);

    // チャットメッセージ取得
    const fetchMessages = useCallback(async (id: string, pageToken?: string) => {
        try {
            const response = await fetchLiveChat(id, pageToken);

            // liveChatIdを保存（メッセージ送信に使用）
            if (response.items.length > 0 && response.items[0].snippet.liveChatId) {
                setLiveChatId(response.items[0].snippet.liveChatId);
            }

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

                if (uniqueNewMessages.length === 0) {
                    return prevMessages;
                }

                const updatedMessages = [...prevMessages, ...uniqueNewMessages];
                setMessageCount(updatedMessages.length);
                return updatedMessages;
            });

            // nextPageTokenを更新
            nextPageTokenRef.current = response.nextPageToken;

            // ポーリング間隔の更新
            if (response.pollingIntervalMillis && response.pollingIntervalMillis !== pollingInterval) {
                setPollingInterval(prev => {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = setInterval(() => {
                            if (currentVideoIdRef.current) {
                                fetchMessages(currentVideoIdRef.current, nextPageTokenRef.current);
                            }
                        }, response.pollingIntervalMillis);
                    }
                    return response.pollingIntervalMillis;
                });
            }

            setError(null);

        } catch (err) {
            console.error('チャット取得エラー:', err);
            const errorMessage = err instanceof Error ? err.message : 'チャットの取得に失敗しました。';
            setError(errorMessage);

            if (err instanceof Error && err.message.includes('404')) {
                handleDisconnect();
            }
        }
    }, [pollingInterval]);

    // 接続処理
    const handleConnect = useCallback(() => {
        const extractedVideoId = extractVideoId(videoUrl);

        if (!extractedVideoId) {
            setError('無効な YouTube URL です。正しい URL を入力してください。');
            return;
        }

        if (!validateVideoId(extractedVideoId)) {
            setError('動画 ID の形式が正しくありません。');
            return;
        }

        // 既存の接続があれば切断
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // 状態をリセット
        setVideoId(extractedVideoId);
        currentVideoIdRef.current = extractedVideoId;
        setError(null);
        setMessages([]);
        setMessageCount(0);
        nextPageTokenRef.current = undefined;
        setIsConnected(true);

        // 初回取得
        fetchMessages(extractedVideoId);

        // 定期取得を開始
        intervalRef.current = setInterval(() => {
            fetchMessages(extractedVideoId, nextPageTokenRef.current);
        }, pollingInterval);

    }, [videoUrl, pollingInterval, fetchMessages]);

    // 切断処理
    const handleDisconnect = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsConnected(false);
        setVideoId(null);
        currentVideoIdRef.current = null;
        setMessages([]);
        setMessageCount(0);
        nextPageTokenRef.current = undefined;
        setError(null);
    }, []);

    // メッセージ送信機能
    const sendMessage = useCallback(async (message: string): Promise<void> => {
        if (!accessToken) {
            throw new Error('認証が必要だよ！まずログインしてね🔑');
        }

        if (!videoId) {
            throw new Error('動画IDが見つからないよ😢 チャットに接続してからメッセージを送信してね！');
        }

        if (!message.trim()) {
            throw new Error('メッセージを入力してね！');
        }

        setIsSending(true);

        try {
            const requestBody: SendMessageRequest = {
                video_id: videoId,
                message_text: message.trim(),
                access_token: accessToken,
            };

            const response = await fetch(`${config.apiBaseUrl}/api/youtube/livechat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail
                    ? (Array.isArray(errorData.detail)
                        ? errorData.detail.map((e: any) => e.msg).join(', ')
                        : errorData.detail)
                    : 'メッセージの送信に失敗したよ😭';
                throw new Error(errorMessage);
            }

            const data: SendMessageResponse = await response.json();

            // 送信成功！
            console.log('メッセージ送信成功！✨', {
                message_id: data.message_id,
                message_text: data.message_text,
                author_name: data.author_name,
                published_at: data.published_at,
            });

        } catch (err) {
            console.error('メッセージ送信エラー:', err);
            throw err;
        } finally {
            setIsSending(false);
        }
    }, [accessToken, videoId]);

    // ダミーモード用の固定アバター画像（SVGのData URI）
    const dummyAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNDQ0MiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzk5OSIvPgo8cGF0aCBkPSJNMTAgMzJjMC02IDYtMTAgMTAtMTBzMTAgNCAxMCAxMCIgZmlsbD0iIzk5OSIvPgo8L3N2Zz4K';

    // 表示用メッセージ（ダミーモードの場合は名前とアバターを置き換え）
    const displayMessages = isDummyMode
        ? messages.map(msg => ({
            ...msg,
            authorName: '********',
            authorPhotoUrl: dummyAvatar,
        }))
        : messages;

    // クリーンアップ
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        videoUrl,
        setVideoUrl,
        videoId,
        liveChatId,
        messages: displayMessages,
        isConnected,
        error,
        pollingInterval,
        messageCount,
        isSending,
        isDummyMode,
        setIsDummyMode,
        handleConnect,
        handleDisconnect,
        sendMessage,
    };
};
