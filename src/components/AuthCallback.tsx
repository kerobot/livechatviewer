import { useEffect } from 'react';

interface AuthCallbackProps {
    onAuthSuccess: (token: string) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ onAuthSuccess }) => {
    useEffect(() => {
        // URLパラメータからアクセストークンを取得
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            console.error('認証エラー:', error);
            // エラーを親ウィンドウに通知
            if (window.opener) {
                window.opener.postMessage(
                    { type: 'auth_error', error: error },
                    window.location.origin
                );
                window.close();
            } else {
                alert(`認証エラー: ${error}`);
                window.location.href = '/';
            }
            return;
        }

        if (accessToken) {
            // トークンを親ウィンドウに渡す（ポップアップの場合）
            if (window.opener) {
                window.opener.postMessage(
                    { type: 'auth_success', token: accessToken },
                    window.location.origin
                );
                window.close();
            } else {
                // 通常のリダイレクトの場合
                onAuthSuccess(accessToken);
                window.location.href = '/';
            }
        } else if (code) {
            // codeパラメータがある場合（バックエンドでトークン交換が必要）
            console.error('認証コードが返されたけど、アクセストークンへの変換が必要だよ🤔');
            if (window.opener) {
                window.close();
            } else {
                window.location.href = '/';
            }
        } else {
            console.error('認証パラメータが見つからないよ😢');
            if (window.opener) {
                window.close();
            } else {
                window.location.href = '/';
            }
        }
    }, [onAuthSuccess]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif',
        }}>
            <h2>🔐 認証処理中...</h2>
            <p>このウィンドウは自動的に閉じるよ～✨</p>
            <div style={{
                marginTop: '20px',
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default AuthCallback;
