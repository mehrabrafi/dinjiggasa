'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, MessageCircle, Users } from 'lucide-react';
import { useChat, useParticipants, useConnectionState, ChatMessage as LiveKitChatMessage, useMaybeRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import styles from './LiveChat.module.css';



interface LiveChatProps {
    scholarId: string;
    userName: string;
    userId: string;
    isScholar?: boolean;
}

import { useLiveKitRoom } from '@livekit/components-react';

function ChatInterface({ scholarId, userName, userId, isScholar }: LiveChatProps) {
    const { send, chatMessages, isSending } = useChat();
    const participants = useParticipants();
    const viewerCount = Math.max(0, participants.length - 1); // Exclude the scholar
    const isConnected = useConnectionState() === ConnectionState.Connected;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, scrollToBottom]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !isConnected) return;

        try {
            // Include metadata so we can render scholar/anonymous tags correctly
            const metadata = JSON.stringify({
                isScholar,
                senderName: isAnonymous ? 'Anonymous Viewer' : userName,
                senderId: isAnonymous ? `anon-${Date.now()}` : userId
            });

            // Send actual message, appending metadata string so we can parse it on receive
            // Note: In a real app we'd attach metadata properly to the track/participant, 
            // but useChat primarily sends the string. We'll prefix metadata for custom decoding
            const payload = `[META:${metadata}]${newMessage.trim()}`;
            await send(payload);
            setNewMessage('');
            inputRef.current?.focus();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to decode messages with our custom metadata
    const decodeMessage = (msg: LiveKitChatMessage) => {
        const str = msg.message;
        const metaMatch = str.match(/^\[META:(.*?)\](.*)$/);

        if (metaMatch) {
            try {
                const meta = JSON.parse(metaMatch[1]);
                return {
                    text: metaMatch[2],
                    isScholar: meta.isScholar,
                    senderName: meta.senderName,
                    senderId: meta.senderId
                };
            } catch (e) {
                // Fallback if parse fails
            }
        }

        // Fallback for standard messages (like from LiveKit dashboard)
        return {
            text: str,
            isScholar: false,
            senderName: 'Anonymous',
            senderId: 'unknown'
        };
    };

    return (
        <div className={styles.chatContainer}>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
                <div className={styles.chatTitleRow}>
                    <MessageCircle size={18} className={styles.chatIcon} />
                    <span className={styles.chatTitle}>Live Chat</span>
                    <div className={styles.statusDotHeader}></div>
                </div>
            </div>

            {/* Connection Status */}
            {!isConnected && (
                <div className={styles.connectionStatus}>
                    <div className={styles.miniSpinner}></div>
                    Connecting to chat...
                </div>
            )}

            {/* Messages */}
            <div className={styles.messagesContainer}>
                {chatMessages.length === 0 && (
                    <div className={styles.emptyChat}>
                        <MessageCircle size={32} />
                        <p>No messages yet. Be the first to say something!</p>
                    </div>
                )}
                {chatMessages.map((msg) => {
                    const decoded = decodeMessage(msg);
                    return (
                        <div
                            key={msg.id}
                            className={`${styles.messageItem} ${decoded.senderId === 'system'
                                ? styles.systemMessage
                                : ''
                                }`}
                        >
                            {decoded.senderId === 'system' ? (
                                <span className={styles.systemText}>{decoded.text}</span>
                            ) : (
                                <div className={styles.messageContentWrapper}>
                                    <div className={styles.avatar}>
                                        {decoded.senderName.charAt(0)}
                                    </div>
                                    <div className={styles.messageBody}>
                                        <div className={styles.senderName}>{decoded.senderName}</div>
                                        <div className={`${styles.messageBubble} ${decoded.isScholar ? styles.isScholarBubble : ''}`}>
                                            {decoded.text}
                                        </div>
                                        <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputArea}>
                {!isScholar && (
                    <div className={styles.anonymousToggle}>
                        <label>
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                disabled={!isConnected}
                            />
                            <span>Ask Anonymously</span>
                        </label>
                    </div>
                )}
                <div className={styles.inputContainer}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isScholar ? "Reply to viewers..." : (isAnonymous ? "Ask anonymously..." : "Type your message...")}
                        className={styles.chatInput}
                        disabled={!isConnected || isSending}
                        maxLength={500}
                    />
                    <button
                        onClick={sendMessage}
                        className={styles.sendBtn}
                        disabled={!newMessage.trim() || !isConnected || isSending}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LiveChat(props: LiveChatProps) {
    try {
        const roomContext = useMaybeRoomContext();
        if (roomContext) {
            return <ChatInterface {...props} />;
        }
    } catch (e) {
        // Fallthrough if it fails for any reason
    }

    // If we're not inside a LiveKitRoom context yet (e.g., token loading), 
    // render a disabled chat UI
    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <div className={styles.chatTitleRow}>
                    <MessageCircle size={18} className={styles.chatIcon} />
                    <span className={styles.chatTitle}>Live Chat</span>
                    <div className={styles.statusDotHeader}></div>
                </div>
            </div>

            <div className={styles.connectionStatus}>
                <div className={styles.miniSpinner}></div>
                Waiting for live stream to start...
            </div>

            <div className={styles.messagesContainer}>
                <div className={styles.emptyChat}>
                    <MessageCircle size={32} />
                    <p>Chat will be available once the live stream starts.</p>
                </div>
            </div>

            <div className={styles.inputArea}>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Waiting for connection..."
                        className={styles.chatInput}
                        disabled={true}
                    />
                    <button className={styles.sendBtn} disabled={true}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
