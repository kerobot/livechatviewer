import { useCallback, useEffect, useState } from 'react';
import { config } from '../config';
import type { AuthResponse } from '../types/youtube';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ローカルストレージからトークンを復元
    useEffect(() => {
        const storedToken = localStorage.getItem('youtube_access_token');
        if (storedToken) {
            setAccessToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);

    // 認証URLを取得して認証フローを開始
    const login = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const callbackUrl = `${window.location.origin}/auth/callback`;
            const response = await fetch(
                `${config.apiBaseUrl}/api/auth/login?callback_url=${encodeURIComponent(callbackUrl)}`
            );

            if (!response.ok) {
                throw new Error('認証URLの取得に失敗したよ😢');
            }

            const data: AuthResponse = await response.json();

            // 新しいウィンドウで認証ページを開く
            const authWindow = window.open(
                data.auth_url,
                'YouTube Authentication',
                'width=600,height=700,left=100,top=100'
            );

            if (!authWindow) {
                throw new Error('ポップアップがブロックされたよ！ポップアップを許可してね😭');
            }

            // ポーリングで認証完了を待つ
            const pollTimer = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(pollTimer);
                    setIsLoading(false);

                    // ウィンドウが閉じられた後、トークンを確認
                    const storedToken = localStorage.getItem('youtube_access_token');
                    if (!storedToken) {
                        setError('認証がキャンセルされたか、失敗したよ😢');
                    }
                }
            }, 500);

        } catch (err) {
            setError(err instanceof Error ? err.message : '認証エラーが発生したよ😭');
            setIsLoading(false);
        }
    }, []);

    // コールバックからトークンを処理
    const handleCallback = useCallback((token: string) => {
        setAccessToken(token);
        setIsAuthenticated(true);
        localStorage.setItem('youtube_access_token', token);
        setError(null);
    }, []);

    // ログアウト
    const logout = useCallback(() => {
        setAccessToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('youtube_access_token');
        setError(null);
    }, []);

    return {
        isAuthenticated,
        accessToken,
        isLoading,
        error,
        login,
        logout,
        handleCallback,
    };
};
