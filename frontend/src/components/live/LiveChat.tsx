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
    const isConnected = useConnectionState() === ConnectionState.Connected;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [newMessage, setNewMessage] = useState('');

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
            const metadata = JSON.stringify({
                isScholar,
                senderName: userName,
                senderId: userId
            });
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
            } catch (e) {}
        }
        return {
            text: str,
            isScholar: false,
            senderName: (msg as any).from?.name || (msg as any).participant?.name || 'Anonymous',
            senderId: (msg as any).from?.identity || (msg as any).participant?.identity || 'unknown'
        };
    };

    return (
        <div className={styles.chatWrapper}>
            {/* Connection Status */}
            {!isConnected && (
                <div className={styles.connectionStatus}>
                    <div className={styles.miniSpinner}></div>
                    Connecting...
                </div>
            )}

            {/* Messages */}
            <div className={styles.messagesContainer}>
                {chatMessages.length === 0 && (
                    <div className={styles.emptyChat}>
                        <MessageCircle size={32} />
                        <p>No messages yet.</p>
                    </div>
                )}
                {chatMessages.map((msg, idx) => {
                    const decoded = decodeMessage(msg);
                    const isVip = idx % 3 === 0; // Mock VIP logic for visual appeal as in mockup
                    return (
                        <div key={msg.id} className={styles.messageItem}>
                            <div className={styles.messageContentWrapper}>
                                <div className={styles.avatar}>
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${decoded.senderName}&background=f1f5f9&color=64748b&bold=true`} 
                                        alt={decoded.senderName} 
                                    />
                                </div>
                                <div className={styles.messageBody}>
                                    <div className={styles.senderHeader}>
                                        <span className={styles.senderName}>{decoded.senderName}</span>
                                        {isVip && <span className={styles.vipBadge}>VIP</span>}
                                    </div>
                                    <div className={styles.messageBubble}>
                                        {decoded.text}
                                    </div>
                                    <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Container (Floating at bottom of sidebar) */}
            <div className={styles.miniInputContainer}>
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Send a message..."
                    className={styles.chatInput}
                    disabled={!isConnected || isSending}
                />
                <button onClick={sendMessage} className={styles.sendBtn} disabled={!newMessage.trim() || !isConnected}>
                    <Send size={16} />
                </button>
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
    } catch (e) {}

    return (
        <div className={styles.chatWrapper}>
            <div className={styles.connectionStatus}>
                <div className={styles.miniSpinner}></div>
                Connecting to stream...
            </div>
            <div className={styles.messagesContainer}>
                <div className={styles.emptyChat}>
                    <MessageCircle size={32} />
                    <p>Connecting to live chat...</p>
                </div>
            </div>
        </div>
    );
}
