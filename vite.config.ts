import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        open: false, // デバッグ時に自動でブラウザを開かない
        port: 3000, // ここでポート番号を指定します
    },
    build: {
        outDir: 'build', // ビルドの出力先ディレクトリ
    },
    plugins: [react()],
});
