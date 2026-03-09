'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageCircle, Users } from 'lucide-react';
import styles from './LiveChat.module.css';

interface ChatMessage {
    id: string;
    scholarId: string;
    senderName: string;
    senderId: string;
    message: string;
    isScholar: boolean;
    timestamp: string;
}

interface LiveChatProps {
    scholarId: string;
    userName: string;
    userId: string;
    isScholar?: boolean;
}

export default function LiveChat({ scholarId, userName, userId, isScholar = false }: LiveChatProps) {
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        // Connect to the live-chat namespace
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        // Strip /api/v1 suffix to get the base server URL for Socket.IO
        const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');

        const socket = io(`${baseUrl}/live-chat`, {
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[LiveChat] Connected to chat server');
            setIsConnected(true);

            // Join the chat room for this scholar's stream
            socket.emit('join-chat', {
                scholarId,
                userName,
                userId,
            });
        });

        socket.on('disconnect', () => {
            console.log('[LiveChat] Disconnected from chat server');
            setIsConnected(false);
        });

        // Receive chat history on join
        socket.on('chat-history', (history: ChatMessage[]) => {
            setMessages(history);
        });

        // Receive new messages
        socket.on('chat-message', (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        // Receive viewer count updates
        socket.on('viewer-count', (data: { count: number }) => {
            setViewerCount(data.count);
        });

        return () => {
            socket.emit('leave-chat', { scholarId });
            socket.disconnect();
        };
    }, [scholarId, userName, userId]);

    const sendMessage = () => {
        if (!newMessage.trim() || !socketRef.current) return;

        socketRef.current.emit('send-message', {
            scholarId,
            senderName: isAnonymous ? 'Anonymous Viewer' : userName,
            senderId: isAnonymous ? `anon-${Date.now()}` : userId,
            message: newMessage.trim(),
            isScholar,
        });

        setNewMessage('');
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={styles.chatContainer}>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
                <div className={styles.chatTitleRow}>
                    <MessageCircle size={18} />
                    <span className={styles.chatTitle}>Live Chat</span>
                </div>
                <div className={styles.viewerBadge}>
                    <Users size={14} />
                    <span>{viewerCount}</span>
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
                {messages.length === 0 && (
                    <div className={styles.emptyChat}>
                        <MessageCircle size={32} />
                        <p>No messages yet. Be the first to say something!</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.messageItem} ${msg.senderId === 'system'
                            ? styles.systemMessage
                            : msg.isScholar
                                ? styles.scholarMessage
                                : msg.senderId === userId
                                    ? styles.ownMessage
                                    : ''
                            }`}
                    >
                        {msg.senderId === 'system' ? (
                            <span className={styles.systemText}>{msg.message}</span>
                        ) : (
                            <>
                                <div className={styles.messageMeta}>
                                    <span className={`${styles.senderName} ${msg.isScholar ? styles.scholarName : ''}`}>
                                        {msg.senderName}
                                        {msg.isScholar && <span className={styles.scholarTag}>Scholar</span>}
                                    </span>
                                    <span className={styles.messageTime}>{formatTime(msg.timestamp)}</span>
                                </div>
                                <p className={styles.messageText}>{msg.message}</p>
                            </>
                        )}
                    </div>
                ))}
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
                        disabled={!isConnected}
                        maxLength={500}
                    />
                    <button
                        onClick={sendMessage}
                        className={styles.sendBtn}
                        disabled={!newMessage.trim() || !isConnected}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
