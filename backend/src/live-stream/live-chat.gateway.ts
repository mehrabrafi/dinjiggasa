import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface ChatMessage {
  id: string;
  scholarId: string;
  senderName: string;
  senderId: string;
  message: string;
  isScholar: boolean;
  timestamp: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/live-chat',
})
export class LiveChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Map: scholarId -> Set<clientId> (track viewers per stream)
  private streamViewers: Map<string, Set<string>> = new Map();
  // Map: clientId -> scholarId (reverse lookup for cleanup)
  private clientToStream: Map<string, string> = new Map();
  // Map: scholarId -> ChatMessage[] (in-memory message history per stream, max 100)
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  handleConnection(client: Socket) {
    console.log(`[LiveChat] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const scholarId = this.clientToStream.get(client.id);
    if (scholarId) {
      const viewers = this.streamViewers.get(scholarId);
      if (viewers) {
        viewers.delete(client.id);
        // Broadcast updated viewer count
        this.server.to(`chat:${scholarId}`).emit('viewer-count', {
          count: viewers.size,
        });
      }
      this.clientToStream.delete(client.id);
    }
    console.log(`[LiveChat] Client disconnected: ${client.id}`);
  }

  /** Join a scholar's chat room */
  @SubscribeMessage('join-chat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { scholarId: string; userName: string; userId: string },
  ) {
    const { scholarId, userName } = payload;
    const roomName = `chat:${scholarId}`;

    // Join the Socket.IO room
    client.join(roomName);

    // Track this viewer
    if (!this.streamViewers.has(scholarId)) {
      this.streamViewers.set(scholarId, new Set());
    }
    this.streamViewers.get(scholarId)!.add(client.id);
    this.clientToStream.set(client.id, scholarId);

    // Send chat history to this client
    const history = this.chatHistory.get(scholarId) || [];
    client.emit('chat-history', history);

    // Broadcast updated viewer count to the room
    const viewerCount = this.streamViewers.get(scholarId)!.size;
    this.server.to(roomName).emit('viewer-count', { count: viewerCount });

    console.log(
      `[LiveChat] ${userName} joined chat for scholar ${scholarId} (${viewerCount} viewers)`,
    );

    // Send system message
    const systemMessage: ChatMessage = {
      id: `sys-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      scholarId,
      senderName: 'System',
      senderId: 'system',
      message: `${userName} joined the session`,
      isScholar: false,
      timestamp: new Date(),
    };
    this.server.to(roomName).emit('chat-message', systemMessage);
  }

  /** Leave a scholar's chat room */
  @SubscribeMessage('leave-chat')
  handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { scholarId: string },
  ) {
    const { scholarId } = payload;
    const roomName = `chat:${scholarId}`;

    client.leave(roomName);

    const viewers = this.streamViewers.get(scholarId);
    if (viewers) {
      viewers.delete(client.id);
      this.server.to(roomName).emit('viewer-count', { count: viewers.size });
    }
    this.clientToStream.delete(client.id);
  }

  /** Handle a chat message */
  @SubscribeMessage('send-message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      scholarId: string;
      senderName: string;
      senderId: string;
      message: string;
      isScholar: boolean;
    },
  ) {
    const { scholarId, senderName, senderId, message, isScholar } = payload;
    const roomName = `chat:${scholarId}`;

    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      scholarId,
      senderName,
      senderId,
      message,
      isScholar,
      timestamp: new Date(),
    };

    // Store in chat history (keep last 100 messages)
    if (!this.chatHistory.has(scholarId)) {
      this.chatHistory.set(scholarId, []);
    }
    const history = this.chatHistory.get(scholarId)!;
    history.push(chatMessage);
    if (history.length > 100) {
      history.shift();
    }

    // Broadcast message to all clients in the room
    this.server.to(roomName).emit('chat-message', chatMessage);

    console.log(`[LiveChat] [${scholarId}] ${senderName}: ${message}`);
  }

  /** Clear chat history when scholar goes offline */
  clearChatHistory(scholarId: string) {
    this.chatHistory.delete(scholarId);
    this.streamViewers.delete(scholarId);
    console.log(`[LiveChat] Cleared chat history for scholar ${scholarId}`);
  }
}
