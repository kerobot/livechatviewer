/**
 * アプリケーション設定
 */
export const config = {
    /**
     * APIサーバーのベースURL
     * 環境変数 VITE_API_BASE_URL から取得
     * デフォルトは開発用のローカルサーバー
     */
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',

    /**
     * APIエンドポイント
     */
    api: {
        liveChat: '/api/youtube/livechat',
        authLogin: '/api/auth/login',
        authCallback: '/api/auth/callback',
        chatSend: '/api/youtube/livechat/message',
    },

    /**
     * デフォルトのポーリング間隔（ミリ秒）
     */
    defaultPollingInterval: 5000,

    /**
     * APIタイムアウト時間（ミリ秒）
     */
    apiTimeout: 10000,

    /**
     * 環境判定
     */
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,

    /**
     * バージョン情報
     */
    version: import.meta.env.VITE_APP_VERSION || '0.1.0',
} as const;

/**
 * 設定値をログ出力（開発環境のみ）
 */
if (config.isDevelopment) {
    console.log('🔧 App Configuration:', {
        apiBaseUrl: config.apiBaseUrl,
        environment: config.isDevelopment ? 'development' : 'production',
        version: config.version,
    });
}
