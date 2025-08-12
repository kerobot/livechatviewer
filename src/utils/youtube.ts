import { config } from '../config';
import type { LiveChatResponse } from '../types/youtube';

/**
 * YouTube URLから動画IDを抽出する関数
 * @param url YouTube URL
 * @returns 動画ID または null
 */
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    // 通常のwatch URL
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    // ライブ配信URL
    /youtube\.com\/live\/([^&\n?#]+)/,
    // 埋め込みURL
    /youtube\.com\/embed\/([^&\n?#]+)/,
    // ショート形式
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * YouTube動画IDの形式をバリデーションする関数
 * @param videoId 動画ID
 * @returns 有効かどうか
 */
export const validateVideoId = (videoId: string): boolean => {
  if (!videoId) return false;
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
};

/**
 * ライブチャットAPIを呼び出す関数
 * @param videoId 動画ID
 * @param pageToken ページトークン（オプション）
 * @returns APIレスポンス
 */
export const fetchLiveChat = async (
  videoId: string,
  pageToken?: string
): Promise<LiveChatResponse> => {
  const baseUrl = `${config.apiBaseUrl}${config.api.liveChat}`;
  const params = new URLSearchParams({ video_id: videoId });

  if (pageToken) {
    params.append('page_token', pageToken);
  }

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // タイムアウト設定（設定ファイルから取得）
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // ステータスコード別のエラーメッセージ
      switch (response.status) {
        case 404:
          throw new Error('指定された動画が見つからないか、ライブ配信中ではありません。');
        case 403:
          throw new Error('APIアクセスが拒否されました。認証を確認してください。');
        case 500:
          throw new Error('サーバーエラーが発生しました。しばらく後に再試行してください。');
        default:
          throw new Error(errorData.detail || `API呼び出しに失敗したよ〜: ${response.status}`);
      }
    }

    const data: LiveChatResponse = await response.json();

    // レスポンスデータの検証
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('無効なAPIレスポンス形式です。');
    }

    return data;

  } catch (error) {
    if (error instanceof Error) {
      // AbortErrorの場合は専用メッセージ
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        throw new Error('APIサーバーへの接続がタイムアウトしました。サーバーが起動しているか確認してください。');
      }
      // TypeError (ネットワークエラー)
      if (error instanceof TypeError) {
        throw new Error(`APIサーバーに接続できません。${config.apiBaseUrl} でサーバーが起動しているか確認してください。`);
      }
      throw error;
    }
    throw new Error('予期しないエラーが発生しました。');
  }
};

/**
 * タイムスタンプを読みやすい形式にフォーマットする
 * @param timestamp ISO 8601形式のタイムスタンプ
 * @returns フォーマットされた時刻文字列
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    return timestamp;
  }
};
