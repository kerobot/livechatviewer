# 🎥 Live Chat Viewer

YouTubeライブ配信のチャットをリアルタイムで表示するReact＋Viteアプリケーションです

![Live Chat Viewer](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.1-yellow?style=for-the-badge&logo=vite)
![Status](https://img.shields.io/badge/Status-Active-green?style=for-the-badge)

## ✨ 特徴

- 🚀 **リアルタイムチャット表示** - YouTubeライブ配信のチャットメッセージをリアルタイムで取得・表示
- 🔗 **簡単URL入力** - YouTube URLを入力するだけで動画IDを自動抽出
- 🎨 **美しいUI** - モダンでレスポンシブなデザイン
- ⚡ **自動更新** - APIで指定された間隔でチャットを自動更新
- 🚫 **重複排除** - 重複メッセージの自動除去
- 📱 **レスポンシブ対応** - PC・スマホ・タブレットで最適表示
- 🔄 **自動スクロール** - 新しいメッセージを自動で追跡
- ⚠️ **エラーハンドリング** - 接続エラー時の適切な表示と自動再接続
- ⌨️ **キーボード対応** - Enterキーでの接続機能
- 🔧 **設定可能** - 環境変数でAPIサーバーのURL設定
- 🧩 **モジュラー設計** - 保守しやすいコンポーネント分割構造

## 🛠️ 技術スタック

### フロントエンド
- **React** 19.1.1 - UIライブラリ（カスタムフック活用）
- **TypeScript** 5.9.2 - 型安全性（完全な型付け）
- **Vite** 7.1.1 - ビルドツール（高速開発サーバー）
- **CSS3** - スタイリング（グラデーション・アニメーション対応）

### アーキテクチャ
- **カスタムフック** - ビジネスロジックの分離（`useLiveChat`）
- **コンポーネント分割** - 単一責任原則に基づく設計
- **設定管理** - 環境変数とconfigファイルでの一元管理
- **エラーハンドリング** - 包括的なエラー処理とタイムアウト設定

### API
- **YouTube Live Chat API** - [livechatapi](https://github.com/kerobot/livechatapi)を使用
- **REST API** - HTTP通信でチャットデータを取得
- **ポーリング** - リアルタイム更新のための定期取得

## 📁 プロジェクト構造

```
src/
├── components/           # UIコンポーネント
│   ├── LiveChat.tsx     # メインコンポーネント
│   ├── ChatContainer.tsx # メッセージ表示・スクロール管理
│   ├── ChatMessage.tsx  # 個別メッセージコンポーネント
│   ├── ChatStatus.tsx   # 接続状況表示
│   ├── ConnectionControls.tsx # URL入力・接続制御
│   └── LiveChat.css     # スタイルシート
├── hooks/               # カスタムフック
│   ├── useLiveChat.ts   # メインビジネスロジック
│   └── index.ts         # エクスポート管理
├── config/              # 設定管理
│   └── index.ts         # アプリケーション設定
├── types/               # 型定義
│   └── youtube.ts       # YouTube API型定義
├── utils/               # ユーティリティ
│   └── youtube.ts       # YouTube関連ヘルパー関数
└── vite-env.d.ts       # Vite環境変数型定義
```

## 🚀 クイックスタート

### 前提条件

- **Node.js** 18.0.0 以上
- **npm** または **yarn**
- **Git**

### 1. YouTube Live Chat APIサーバーの準備

このアプリケーションには、YouTube Live Chat APIを中継するバックエンドサーバーが必要です：

```bash
# APIサーバーをクローン
git clone https://github.com/kerobot/livechatapi.git
cd livechatapi

# サーバーを起動 (通常は http://127.0.0.1:8000 で起動)
# 詳細は上記リポジトリのREADMEを参照
```

### 2. 環境変数の設定（オプション）

デフォルトでは `http://127.0.0.1:8000` でAPIサーバーに接続しますが、
異なるURLを使用する場合は環境変数で設定できます：

```bash
# .env.local ファイルを作成（個人設定用・Git除外対象）
VITE_API_BASE_URL=http://localhost:8080

# 本番環境の場合は .env.production
VITE_API_BASE_URL=https://your-api-server.com
```

**利用可能な環境変数：**
- `VITE_API_BASE_URL` - APIサーバーのベースURL（デフォルト: `http://127.0.0.1:8000`）
- `VITE_APP_VERSION` - アプリケーションバージョン（オプション）

### 3. アプリケーションの起動

```bash
# リポジトリのクローン
git clone https://github.com/kerobot/livechatviewer.git
cd livechatviewer

# 依存関係のインストール
npm install

# Vite開発サーバーの起動
npm run dev

# アプリケーションが http://localhost:3000 で起動します
```

### 4. 使用方法

1. **YouTube URLを入力**
   - 対応URL形式：
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - `https://www.youtube.com/live/VIDEO_ID`
     - `https://www.youtube.com/embed/VIDEO_ID`
     - `https://www.youtube.com/shorts/VIDEO_ID`

2. **接続操作**
   - 「接続する」ボタンをクリック
   - または、Enterキーを押下

3. **チャット表示**
   - リアルタイムでメッセージが表示されます
   - 自動スクロールで最新メッセージを追跡
   - メッセージ数とポーリング間隔を表示

4. **切断**
   - 「切断する」ボタンで接続を終了

## 🎯 主要な機能とコンポーネント

### カスタムフック: `useLiveChat`
ビジネスロジックの中核を担うカスタムフック：
- **状態管理**: 接続状態、メッセージ、エラー状態の管理
- **APIポーリング**: 自動メッセージ取得とポーリング間隔の動的調整
- **エラーハンドリング**: 包括的なエラー処理とリカバリー
- **メモリ管理**: コンポーネントアンマウント時の適切なクリーンアップ

### コンポーネント設計
- **`LiveChat`** - メインコンポーネント（プレゼンテーション層）
- **`ConnectionControls`** - URL入力とキーボードイベント処理
- **`ChatStatus`** - 接続状況とメトリクス表示
- **`ChatContainer`** - メッセージリスト管理と自動スクロール
- **`ChatMessage`** - 個別メッセージとアバター画像エラー処理

### 設定管理
- **環境変数**: `VITE_API_BASE_URL`でAPIサーバー設定
- **configファイル**: 一元的な設定管理とデフォルト値
- **型安全**: TypeScriptによる設定値の型チェック

## 📋 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 🔧 開発とデバッグ

### 開発環境設定
開発時は以下の設定がコンソールに表示されます：
- APIベースURL
- 環境（development/production）
- アプリケーションバージョン

### エラー対応
よくある問題と解決方法：

1. **APIサーバー接続エラー**
   ```
   APIサーバーに接続できません。http://127.0.0.1:8000 でサーバーが起動しているか確認してください。
   ```
   → APIサーバーが起動していることを確認

2. **動画が見つからないエラー**
   ```
   指定された動画が見つからないか、ライブ配信中ではありません。
   ```
   → ライブ配信中の動画URLを使用

3. **タイムアウトエラー**
   ```
   APIサーバーへの接続がタイムアウトしました。
   ```
   → ネットワーク接続とAPIサーバー状態を確認

## 📋 利用可能なスクリプト

### `npm run dev`
Vite開発サーバーでアプリケーションを起動します。
[http://localhost:3000](http://localhost:3000) でアクセスできます。

### `npm run build`
本番用のビルドを作成します。
`build`フォルダに最適化されたファイルが生成されます。

### `npm run preview`
本番ビルドの内容をローカルサーバーでプレビューします。

## 🎨 デザイン特徴

### カラーパレット
- **プライマリ**: グラデーション（#667eea → #764ba2）
- **アクセント**: ピンクグラデーション（#ff6b9d → #c44569）
- **背景**: ライトグラデーション（#f5f7fa → #c3cfe2）

### UI/UX機能
- **チャットメッセージ表示**: ユーザーアバター、名前、メッセージ、タイムスタンプ
- **接続管理**: 接続状態、メッセージ数、更新間隔の表示
- **アニメーション**: スライドイン、点滅、ホバーエフェクト
- **レスポンシブデザイン**: 全デバイス対応
- **カスタムスクロールバー**: 美しいスクロール表示

## 🔍 技術仕様

### 依存関係
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/node": "^24.2.0",
    "@types/react": "^19.1.9",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "^5.9.2",
    "vite": "^7.1.1"
  }
}
```

### APIエンドポイント

```
GET {API_BASE_URL}/api/youtube/livechat?video_id={VIDEO_ID}&page_token={PAGE_TOKEN}
```

**設定可能な値:**
- `API_BASE_URL`: 環境変数 `VITE_API_BASE_URL` で設定（デフォルト: `http://127.0.0.1:8000`）

### レスポンス例
```json
{
  "items": [
    {
      "id": "メッセージID",
      "snippet": {
        "displayMessage": "メッセージ内容",
        "publishedAt": "2024-01-01T12:00:00Z",
        "authorChannelId": "チャンネルID"
      },
      "authorDetails": {
        "displayName": "ユーザー名",
        "profileImageUrl": "https://...",
        "channelId": "..."
      }
    }
  ],
  "nextPageToken": "次のページのトークン",
  "pollingIntervalMillis": 5000
}
```

## 🐛 トラブルシューティング

### よくある問題

**Q: チャットが表示されない**
- APIサーバーが起動しているか確認
- YouTube URLが正しいか確認
- ライブ配信中の動画か確認

**Q: 「無効なYouTube URL」エラーが出る**
- URLの形式を確認（上記対応形式を参照）
- 動画IDが11文字の英数字・アンダースコア・ハイフンのみか確認

**Q: ネットワークエラーが発生する**
- APIサーバーのCORS設定を確認
- ファイアウォールの設定を確認
- 環境変数 `VITE_API_BASE_URL` の値を確認

**Q: アプリが起動しない**
- Node.js のバージョンを確認（18.0.0以上）
- `npm install` で依存関係を再インストール
- キャッシュクリア: `npm run build -- --force`

## 🚀 本番環境へのデプロイ

### 環境変数設定
本番環境では以下の環境変数を設定：

```bash
# 本番APIサーバーのURL
VITE_API_BASE_URL=https://your-api-server.com

# アプリケーションバージョン（オプション）
VITE_APP_VERSION=1.0.0
```

### ビルドとデプロイ
```bash
# 本番ビルド
npm run build

# 静的ファイルをWebサーバーにデプロイ
# （Nginx、Apache、Vercel、Netlify等）
```

## 🤝 貢献

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/awesome-feature`)
3. 変更をコミット (`git commit -m 'Add awesome feature'`)
4. ブランチにプッシュ (`git push origin feature/awesome-feature`)
5. プルリクエストを作成
2. 新しいブランチを作成 (`git checkout -b feature/awesome-feature`)
3. 変更をコミット (`git commit -m 'Add awesome feature'`)
4. ブランチにプッシュ (`git push origin feature/awesome-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [YouTube Live Chat API](https://github.com/kerobot/livechatapi) - バックエンドAPIの提供
- [React](https://reactjs.org/) - UIライブラリ  
- [Vite](https://vitejs.dev/) - 高速ビルドツール
- [TypeScript](https://www.typescriptlang.org/) - 型安全性の提供

## 📞 サポート

問題が発生した場合は、[Issues](../../issues)ページで報告してください。

バグ報告の際は以下の情報を含めてください：
- 使用環境（OS、ブラウザ、Node.jsバージョン）
- エラーメッセージ
- 再現手順
- 期待する動作

---

**Made with ❤️ using React + TypeScript + Vite**
