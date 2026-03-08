import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { spawn, ChildProcess } from 'child_process';
import { ConfigService } from '@nestjs/config';
import { LiveStreamService } from './live-stream.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/live-stream',
})
export class LiveStreamGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private ffmpegProcesses: Map<string, ChildProcess> = new Map();

    constructor(
        private configService: ConfigService,
        private liveStreamService: LiveStreamService,
    ) { }

    handleDisconnect(client: Socket) {
        this.stopStream(client.id);
        // Clean up live status by client ID
        this.liveStreamService.goOfflineByClientId(client.id);
    }

    @SubscribeMessage('start-stream')
    startStream(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { streamKey: string },
    ) {
        const streamKey = payload.streamKey;
        if (!streamKey) {
            client.emit('stream-error', { message: 'Stream key is required' });
            return;
        }

        const rtmpUrl = `rtmp://89.167.127.36/live/${streamKey}`;

        // FFmpeg command to read buffer from stdin and output to RTMP
        const ffmpegArgs = [
            '-i', '-', // Read from stdin
            '-c:v', 'libx264', // Video codec
            '-preset', 'ultrafast', // Speed over quality for live streaming
            '-tune', 'zerolatency', // Minimal latency
            '-maxrate', '2500k', // Max bitrate
            '-bufsize', '5000k',
            '-pix_fmt', 'yuv420p',
            '-g', '50', // Keyframe interval (assuming 25fps)
            '-c:a', 'aac', // Audio codec
            '-b:a', '128k', // Audio bitrate
            '-ar', '44100', // Audio sample rate
            '-f', 'flv', // Output format RTMP expects flv
            rtmpUrl,
        ];

        const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

        ffmpegProcess.on('close', (code, signal) => {
            console.log(`FFmpeg process for ${client.id} closed with code ${code} and signal ${signal}`);
            this.ffmpegProcesses.delete(client.id);
            // Mark scholar as offline when ffmpeg process ends
            this.liveStreamService.goOfflineByClientId(client.id);
            client.emit('stream-stopped');
        });

        ffmpegProcess.stdin.on('error', (e) => {
            console.log('FFmpeg STDIN Error', e);
        });

        ffmpegProcess.stderr.on('data', (data) => {
            // Optional: Log ffmpeg output if needed for debugging
            // console.log(`FFmpeg STDERR: ${data.toString()}`);
        });

        this.ffmpegProcesses.set(client.id, ffmpegProcess);

        // Mark this scholar as live
        this.liveStreamService.goLive(streamKey, client.id);

        console.log(`Stream started for client ${client.id} to ${rtmpUrl}`);
        client.emit('stream-started');
    }

    @SubscribeMessage('binary-stream')
    handleBinaryStream(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: Buffer,
    ) {
        const ffmpegProcess = this.ffmpegProcesses.get(client.id);
        if (ffmpegProcess && ffmpegProcess.stdin?.writable) {
            ffmpegProcess.stdin.write(data);
        }
    }

    @SubscribeMessage('stop-stream')
    stopStream(@ConnectedSocket() client: Socket | string) {
        const clientId = typeof client === 'string' ? client : client.id;
        const ffmpegProcess = this.ffmpegProcesses.get(clientId);

        if (ffmpegProcess) {
            // Send end to cleanly close stdin, allowing FFmpeg to process the final chunks
            ffmpegProcess.stdin?.end();
            this.ffmpegProcesses.delete(clientId);
            // Mark scholar as offline
            this.liveStreamService.goOfflineByClientId(clientId);
            console.log(`Stream stopped for client ${clientId}`);
        }
    }
}
