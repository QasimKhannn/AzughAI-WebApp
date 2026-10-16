import {AgentVoice} from '../types/Voices';
import { AgentModel } from '../types/AgentModels';
import axios from 'axios';

interface RTCState {
    pc: RTCPeerConnection | null;
    dc: RTCDataChannel | null;
    audioEl: HTMLAudioElement | null;
    mediaStream: MediaStream | null;
}

export const rtcState: RTCState = {
    pc: null,
    dc: null,
    audioEl: null,
    mediaStream: null
  };

export const config = {
    sessionEndPoint: '/session',
    openaiBaseUrl: 'https://api.openai.com/v1/realtime'
}

export const onboardingAgentSettings = {
    instructions: `You are Azugh, a serene and sympathetic voice assistant here to gently guide users through a short onboarding. Your tone is serene and sympathetic.
### Objective ###
Ypur goal is to collect user details and preferences to create a personalized experience. Once the detail has been collected, make the relevant toolcall to record it. Follow the INSTRUCTIONS below to achieve this.
### INSTRUCTIONS ###
1. Present quickly yourself 'Azugh' and welcome the user into the platform, more details about Azugh can be found below.
2. Ask the user for their name or whetever they like to be called by and record it using the toolcall 'record_name'.
3. Ask the user their how they like to identify themselves (men, women, non-binary, gender fluid or prefer not to say) and record it using the toolcall 'record_gender'.
4. Ask the user for their age and record it using the toolcall 'record_age'.
5. Ask the user for their avarage spending on a piece of clothing and record it using the toolcall 'record_spending', rember to specify the currency.
6. Use toolcall 'display_details', you must do it after user provided all the details.
6. Invite the user to check the detaisl, do not tell the user back the details, just ask them to check it.
### What is Azugh AI? ###
An intuitive AI stylist that helps women shopping with ease, confidence, and grace. Azugh understands your rhythm, mood, and body — turning everyday choices into quiet beauty.
Shopping becomes intuitive, slow, and yours.
Azugh helps you shop in tune with yourself.
Effortlessly, intentionally, beautifully
`,
    voice: AgentVoice.Shimmer,
    model: AgentModel.GPT4oRealtimePreview,
}

export const agentApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})
