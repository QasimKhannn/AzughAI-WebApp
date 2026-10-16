export type VoiceConnectionState = 'idle' | 'connecting' | 'connected' | 'error' ;

export interface VoiceTranscript {
    role: 'user' | 'agent';
    content: string;
    timestamp: number;
}

export interface VoiceSessionConfig {
    threadId: string;
    clientSecret: string;
    sessionId: string;
}
