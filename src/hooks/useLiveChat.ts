import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../config';
import type { ChatMessage, LiveChatMessageItem } from '../types/youtube';
import { extractVideoId, fetchLiveChat, validateVideoId } from '../utils/youtube';

export const useLiveChat = () => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [videoId, setVideoId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pollingInterval, setPollingInterval] = useState<number>(config.defaultPollingInterval);
    const [messageCount, setMessageCount] = useState<number>(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const nextPageTokenRef = useRef<string | undefined>(undefined);
    const currentVideoIdRef = useRef<string | null>(null);

    // チャットメッセージ取得
    const fetchMessages = useCallback(async (id: string, pageToken?: string) => {
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
        messages,
        isConnected,
        error,
        pollingInterval,
        messageCount,
        handleConnect,
        handleDisconnect,
    };
};
