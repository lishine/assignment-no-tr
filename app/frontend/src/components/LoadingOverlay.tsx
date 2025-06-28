import { useState, useEffect } from 'react'

type LoadingOverlayProps = {
    isVisible: boolean
}

export const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => {
    const [isRendered, setIsRendered] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        let timeoutId: number

        if (isVisible) {
            setIsRendered(true)
            timeoutId = setTimeout(() => setIsAnimating(true), 10)
        } else {
            setIsAnimating(false)
            timeoutId = setTimeout(() => setIsRendered(false), 300)
        }

        return () => {
            clearTimeout(timeoutId)
        }
    }, [isVisible])

    if (!isRendered) {
        return null
    }

    return (
        <div className={`loading-overlay ${isAnimating ? 'visible' : ''}`}>
            <div className="loading-spinner"></div>
            <style jsx>{`
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    pointer-events: all;
                    opacity: 0;
                    transition:
                        opacity 0.3s ease-in-out,
                        background-color 0.3s ease-in-out;
                }

                .loading-overlay.visible {
                    opacity: 1;
                    background-color: rgba(0, 0, 0, 0.5);
                }

                .loading-spinner {
                    width: 60px;
                    height: 60px;
                    border: 6px solid #f3f3f3;
                    border-top: 6px solid #007bff;
                    border-radius: 50%;
                    animation:
                        spin 1s linear infinite,
                        scale-in 0.3s ease-out;
                    transform: scale(0.8);
                    transition: transform 0.3s ease-out;
                }

                .loading-overlay.visible .loading-spinner {
                    transform: scale(1);
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg) scale(var(--scale, 0.8));
                    }
                    100% {
                        transform: rotate(360deg) scale(var(--scale, 0.8));
                    }
                }

                .loading-overlay.visible .loading-spinner {
                    --scale: 1;
                }

                @keyframes scale-in {
                    0% {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}
