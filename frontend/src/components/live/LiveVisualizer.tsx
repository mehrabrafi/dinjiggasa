'use client';

import React, { useEffect, useRef } from 'react';
import styles from './LiveVisualizer.module.css';

interface LiveVisualizerProps {
    stream: MediaStream | null;
}

const LiveVisualizer: React.FC<LiveVisualizerProps> = ({ stream }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!stream) return;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Ensure AudioContext resumes on user interaction (needed for browser autoplays)
        if (audioContext.state === 'suspended') {
            const resume = () => {
                audioContext.resume();
                console.log('[LiveVisualizer] AudioContext resumed');
                window.removeEventListener('mousedown', resume);
                window.removeEventListener('keydown', resume);
            };
            window.addEventListener('mousedown', resume);
            window.addEventListener('keydown', resume);
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        analyserRef.current = analyser;
        audioContextRef.current = audioContext;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let phase = 0;

        const draw = () => {
            if (!canvasRef.current || !analyserRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            analyserRef.current.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            const volume = average / 255;

            // Phase animation speed depends on volume
            phase += 0.05 + (volume * 0.1);

            // 1. Layered Background Waves
            const drawWave = (color: string, amplitude: number, frequency: number, offset: number, lineWidth: number) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';

                const effectiveAmplitude = (volume > 0.05 ? volume : 0.05) * amplitude;

                for (let x = 0; x <= width; x += 2) {
                    // Normalize x to -1 to 1 for the bell curve mask
                    const normX = (x / width) * 2 - 1;
                    const mask = Math.pow(Math.cos(normX * Math.PI / 2), 2); // Bell curve mask
                    
                    const y = height / 2 + 
                        Math.sin(x * frequency + phase + offset) * 
                        effectiveAmplitude * mask;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            };

            drawWave('rgba(16, 185, 129, 0.15)', 80, 0.015, 0, 2);
            drawWave('rgba(20, 184, 166, 0.25)', 60, 0.02, 2, 2);
            drawWave('rgba(13, 148, 136, 0.35)', 40, 0.025, 4, 3);

            // 2. Symmetrical Modern Bars
            const barWidth = 4;
            const barGap = 6;
            const barCount = Math.floor((width * 0.8) / (barWidth + barGap)) / 2;
            const centerX = width / 2;

            for (let i = 0; i < barCount; i++) {
                // Map bar index to frequency bin, using lower frequencies for better visibility
                const index = Math.floor((i / barCount) * (bufferLength * 0.5));
                const value = dataArray[index];
                const percent = value / 255;
                
                // Height with breathing animation
                const breathing = Math.sin(phase * 0.5 + i * 0.1) * 2;
                const barHeight = Math.max(6, (percent * height * 0.8) + breathing);
                
                const opacity = 0.6 + (percent * 0.4);
                
                // Gradient for each bar
                const barY = (height - barHeight) / 2;
                const gradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
                gradient.addColorStop(0, `rgba(0, 109, 91, ${opacity})`);
                gradient.addColorStop(0.5, `rgba(16, 185, 129, ${opacity})`);
                gradient.addColorStop(1, `rgba(0, 109, 91, ${opacity})`);
                
                ctx.fillStyle = gradient;
                
                // Right side
                const rx = centerX + (i * (barWidth + barGap));
                ctx.beginPath();
                ctx.roundRect(rx, barY, barWidth, barHeight, 4);
                ctx.fill();

                // Left side
                const lx = centerX - (i * (barWidth + barGap)) - barWidth;
                ctx.beginPath();
                ctx.roundRect(lx, barY, barWidth, barHeight, 4);
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
            window.removeEventListener('mousedown', () => {});
            window.removeEventListener('keydown', () => {});
        };
    }, [stream]);

    return (
        <div className={styles.visualizerContainer}>
            <canvas 
                ref={canvasRef} 
                width={1000} 
                height={120} 
                className={styles.canvas} 
            />
        </div>
    );
};

export default LiveVisualizer;
