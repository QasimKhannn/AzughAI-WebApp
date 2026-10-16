import { useCallback, useRef, useEffect } from 'react';
import { useVoiceStore } from '../store/voiceStore';
import { voiceService } from '../service/voiceService';

/**
 * Hook to manage WebRTC voice sessions with OpenAI Realtime API
 */
export const useVoice = () => {
    const {
        threadId,
        connectionState,
        isPaused,
        setConnectionState,
        setListening,
        setPlaying,
        addTranscript,
        setError,
    } = useVoiceStore();

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const threadIdRef = useRef<string | null>(null);

    // Keep threadId ref in sync
    useEffect(() => {
        threadIdRef.current = threadId;
    }, [threadId]);

    /**
     * Disconnect from the realtime session
     */
    const disconnect = useCallback(() => {
        // Close data channel
        if (dataChannelRef.current) {
            dataChannelRef.current.close();
            dataChannelRef.current = null;
        }

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Stop local audio stream
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        // Clean up audio element
        if (audioElementRef.current) {
            audioElementRef.current.srcObject = null;
            audioElementRef.current = null;
        }

        setConnectionState('idle');
        setListening(false);
        setPlaying(false);
    }, [setConnectionState, setListening, setPlaying]);

    /**
     * Handle incoming realtime events from OpenAI
     */
    const handleRealtimeEvent = useCallback(async (event: Record<string, unknown>) => {
        const currentThreadId = threadIdRef.current;
        
        switch (event.type) {
            case 'response.created':
            case 'response.output_item.added':
                // Agent is about to speak - set playing state
                setPlaying(true);
                setListening(false);
                break;

            case 'response.audio.delta':
                // Agent is actively speaking audio
                setPlaying(true);
                setListening(false);
                break;

            case 'response.audio.done':
            case 'response.done':
                // Agent finished speaking
                setPlaying(false);
                setListening(true);
                break;

            case 'response.audio_transcript.done':
                // Agent finished speaking - save transcript
                if (event.transcript && currentThreadId) {
                    addTranscript({
                        role: 'agent',
                        content: event.transcript as string,
                        timestamp: Date.now(),
                    });
                    // Save to thread
                    try {
                        await voiceService.saveVoiceMessage(currentThreadId, event.transcript as string, 'agent');
                    } catch (error) {
                        console.error('Failed to save agent message:', error);
                    }
                }
                setPlaying(false);
                setListening(true);
                break;

            case 'conversation.item.input_audio_transcription.completed':
                // User finished speaking - save transcript
                if (event.transcript && currentThreadId) {
                    addTranscript({
                        role: 'user',
                        content: event.transcript as string,
                        timestamp: Date.now(),
                    });
                    // Save to thread
                    try {
                        await voiceService.saveVoiceMessage(currentThreadId, event.transcript as string, 'user');
                    } catch (error) {
                        console.error('Failed to save user message:', error);
                    }
                }
                break;

            case 'input_audio_buffer.speech_started':
                // User started speaking - interrupt agent if playing
                setListening(true);
                setPlaying(false);
                break;

            case 'input_audio_buffer.speech_stopped':
                // User stopped speaking - waiting for agent response
                setListening(false);
                break;

            case 'error':
                console.error('Realtime API error:', event.error);
                setError((event.error as { message?: string })?.message || 'Unknown error');
                break;
        }
    }, [addTranscript, setPlaying, setListening, setError]);

    /**
     * Connect to the OpenAI Realtime API via WebRTC
     */
    const connect = useCallback(async () => {
        if (!threadId) {
            setError('No thread ID provided');
            return;
        }

        try {
            setConnectionState('connecting');

            // Get ephemeral token from backend
            const { clientSecret } = await voiceService.getRealtimeToken(threadId);

            if (!clientSecret) {
                throw new Error('Failed to get client secret');
            }

            // Create peer connection
            const pc = new RTCPeerConnection();
            peerConnectionRef.current = pc;

            // Set up audio element for playback
            const audioEl = document.createElement('audio');
            audioEl.autoplay = true;
            audioElementRef.current = audioEl;

            // Handle incoming audio track
            pc.ontrack = (event) => {
                audioEl.srcObject = event.streams[0];
                setPlaying(true);
            };

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            
            // Add audio track to peer connection
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            // Create data channel for events
            const dc = pc.createDataChannel('oai-events');
            dataChannelRef.current = dc;

            dc.onopen = () => {
                setConnectionState('connected');
                setListening(true);
            };

            dc.onmessage = async (event) => {
                const message = JSON.parse(event.data);
                await handleRealtimeEvent(message);
            };

            dc.onerror = (error) => {
                console.error('Data channel error:', error);
                setError('Connection error');
            };

            dc.onclose = () => {
                setConnectionState('idle');
                setListening(false);
                setPlaying(false);
            };

            // Create and set local description
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Send offer to OpenAI and get answer
            const response = await fetch(
                'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${clientSecret}`,
                        'Content-Type': 'application/sdp',
                    },
                    body: offer.sdp,
                }
            );

            if (!response.ok) {
                throw new Error(`WebRTC connection failed: ${response.status}`);
            }

            const answerSdp = await response.text();
            await pc.setRemoteDescription({
                type: 'answer',
                sdp: answerSdp,
            });

        } catch (error) {
            console.error('Voice connection error:', error);
            setError(error instanceof Error ? error.message : 'Connection failed');
            disconnect();
        }
    }, [threadId, setConnectionState, setListening, setPlaying, setError, handleRealtimeEvent, disconnect]);

    /**
     * Interrupt the current response
     */
    const interrupt = useCallback(() => {
        if (dataChannelRef.current?.readyState === 'open') {
            dataChannelRef.current.send(JSON.stringify({
                type: 'response.cancel',
            }));
        }
        setPlaying(false);
        setListening(true);
    }, [setPlaying, setListening]);

    /**
     * Toggle microphone mute
     */
    const toggleMute = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setListening(audioTrack.enabled);
            }
        }
    }, [setListening]);

    // Handle pause state changes
    useEffect(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !isPaused;
            }
        }
    }, [isPaused]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        connect,
        disconnect,
        interrupt,
        toggleMute,
        connectionState,
        isConnected: connectionState === 'connected',
    };
};
