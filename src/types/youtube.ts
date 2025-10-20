// YouTube APIのレスポンス型定義
export interface AuthorDetails {
  channelId: string;
  displayName: string;
  profileImageUrl: string;
  isVerified: boolean;
}

export interface MessageSnippet {
  type: string;
  liveChatId: string;
  authorChannelId: string;
  publishedAt: string;
  hasDisplayContent: boolean;
  displayMessage: string;
}

export interface LiveChatMessageItem {
  kind: string;
  etag: string;
  id: string;
  snippet: MessageSnippet;
  authorDetails: AuthorDetails;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface LiveChatResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  pollingIntervalMillis: number;
  pageInfo: PageInfo;
  items: LiveChatMessageItem[];
}

// フロントエンド用の簡略化されたメッセージ型
export interface ChatMessage {
  id: string;
  authorName: string;
  authorPhotoUrl: string;
  message: string;
  timestamp: string;
  authorChannelId: string;
}

// 認証関連の型定義
export interface AuthResponse {
  auth_url: string;
  state: string;
}

export interface AuthCallbackParams {
  code?: string;
  state?: string;
  access_token?: string;
}

export interface SendMessageRequest {
  video_id: string;
  message_text: string;
  access_token: string;
}

export interface SendMessageResponse {
  message_id: string;
  message_text: string;
  author_name: string;
  published_at: string;
  success?: boolean;
}
