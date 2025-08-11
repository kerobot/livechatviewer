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
- ⚠️ **エラーハンドリング** - 接続エラー時の適切な表示

## 🛠️ 技術スタック

### フロントエンド
- **React** 19.1.1 - UIライブラリ
- **TypeScript** 5.9.2 - 型安全性
- **CSS3** - スタイリング（グラデーション・アニメーション対応）

### API
- **YouTube Live Chat API** - [livechatapi](https://github.com/kerobot/livechatapi)を使用
- **REST API** - HTTP通信でチャットデータを取得

## 🚀 使い方

### 1. APIサーバーの起動

まず、YouTube Live Chat APIサーバーを起動してください：

```bash
# APIサーバーのリポジトリをクローン
git clone https://github.com/kerobot/livechatapi.git
cd livechatapi

# サーバーを起動 (通常は http://127.0.0.1:8000 で起動)
# 詳細は上記リポジトリのREADMEを参照
```

### 2. アプリケーションの起動

```bash
# 依存関係のインストール
npm install

# Vite開発サーバーの起動
npm run dev

# アプリケーションが [http://localhost:3000](http://localhost:3000) で起動します。
```

### 3. チャット表示の開始

1. YouTube URLを入力欄にペースト
   - 対応URL形式：
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - `https://www.youtube.com/live/VIDEO_ID`
     - `https://www.youtube.com/embed/VIDEO_ID`
     - `https://www.youtube.com/shorts/VIDEO_ID`

2. 「接続する！」ボタンをクリック

3. リアルタイムでチャットメッセージが表示されます🎉

## 📁 プロジェクト構成

```
src/
├── components/
│   ├── LiveChat.tsx      # メインのライブチャットコンポーネント
│   └── LiveChat.css      # スタイルシート
├── types/
│   └── youtube.ts        # YouTube API関連の型定義
├── utils/
│   └── youtube.ts        # YouTube URL解析・API呼び出し
├── App.tsx               # アプリケーションのルート
├── App.css              # アプリケーション全体のスタイル
├── index.tsx            # エントリーポイント
└── index.css            # グローバルスタイル
```

## 🔧 主要機能

### チャットメッセージ表示
- ユーザーアバター画像
- ユーザー名
- メッセージ内容
- タイムスタンプ（日本時間）

### 接続管理
- 接続状態の表示
- メッセージ数カウンター
- 更新間隔の表示
- エラー状態の適切な表示

### UI/UX
- ホバーエフェクト
- スムーズアニメーション
- カスタムスクロールバー
- レスポンシブデザイン

## 🎨 デザイン

### カラーパレット
- **プライマリ**: グラデーション（#667eea → #764ba2）
- **アクセント**: ピンクグラデーション（#ff6b9d → #c44569）
- **背景**: ライトグラデーション（#f5f7fa → #c3cfe2）

### アニメーション
- メッセージ表示時のスライドイン
- 接続インジケーターの点滅
- ホバー時の浮き上がり効果

## 📋 利用可能なスクリプト

### `npm run dev`
Vite開発サーバーでアプリケーションを起動します。
[http://localhost:3000](http://localhost:3000) でアクセスできます。

### `npm run build`
本番用のビルドを作成します。
`build`フォルダに最適化されたファイルが生成されます。

### `npm run preview`
本番ビルドの内容をローカルサーバーでプレビューします。

### `npm test`
テストランナーを起動します。

## 🔍 APIエンドポイント

```
GET http://127.0.0.1:8000/api/youtube/livechat?video_id={VIDEO_ID}&page_token={PAGE_TOKEN}
```

### レスポンス例
```json
{
  "kind": "youtube#liveChatMessageListResponse",
  "etag": "...",
  "nextPageToken": "...",
  "pollingIntervalMillis": 5000,
  "pageInfo": {
    "totalResults": 50,
    "resultsPerPage": 50
  },
  "items": [
    {
      "id": "message_id",
      "snippet": {
        "type": "textMessageEvent",
        "publishedAt": "2024-01-01T12:00:00Z",
        "displayMessage": "Hello World!"
      },
      "authorDetails": {
        "displayName": "ユーザー名",
        "profileImageUrl": "https://...",
        "channelId": "..."
      }
    }
  ]
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

## 🤝 貢献

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/awesome-feature`)
3. 変更をコミット (`git commit -m 'Add awesome feature'`)
4. ブランチにプッシュ (`git push origin feature/awesome-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [YouTube Live Chat API](https://github.com/kerobot/livechatapi) - バックエンドAPIの提供
- [React](https://reactjs.org/) - UIライブラリ

## 📞 サポート

問題が発生した場合は、[Issues](../../issues)ページで報告してください。

---

**Made with ❤️ and React**
