import React, { useCallback } from 'react';

interface ConnectionControlsProps {
    videoUrl: string;
    setVideoUrl: (url: string) => void;
    isConnected: boolean;
    error: string | null;
    onConnect: () => void;
    onDisconnect: () => void;
}

const ConnectionControls: React.FC<ConnectionControlsProps> = ({
    videoUrl,
    setVideoUrl,
    isConnected,
    error,
    onConnect,
    onDisconnect,
}) => {
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isConnected && videoUrl.trim()) {
            onConnect();
        }
    }, [isConnected, videoUrl, onConnect]);

    return (
        <>
            <div className="connection-controls">
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="YouTube URL を入力してください。"
                    className="url-input"
                    disabled={isConnected}
                    autoComplete="off"
                />

                {!isConnected ? (
                    <button
                        onClick={onConnect}
                        className="connect-btn"
                        disabled={!videoUrl.trim()}
                    >
                        接続する
                    </button>
                ) : (
                    <button onClick={onDisconnect} className="disconnect-btn">
                        切断する
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
        </>
    );
};

export default ConnectionControls;
