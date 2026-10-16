// Import necessary modules and types
import { AgentModel } from '../types/AgentModels';
import { AgentVoice } from '../types/Voices';
import { ToolObject, ToolCallOutput } from '../types/Tools';
import { Tools } from './tools';
import { config, rtcState, agentApi } from '../constants/globals'
import { log, updateStatus } from './utils';

class Agent {
    // Declare the property
    private EPHEMERAL_KEY: string;
    private tools: Tools;
    public state: 'waiting' | 'speaking' | 'listening';

    constructor(
        public instructions: string = "You are a helpful assistant. Please respond to the user's queries.", // Default instructions,
        public model: AgentModel = AgentModel.GPT4oRealtimePreview,
        public voice: AgentVoice = AgentVoice.Ash
    ) {
        this.model = model;
        this.voice = voice;
        this.instructions = instructions;
        this.EPHEMERAL_KEY = '';
        this.tools = new Tools();
        this.state = 'waiting';
    }

    async init() {
        // fetch the session token
        await this.fetchToken();
        // Initialize the peer connection
        rtcState.pc = new RTCPeerConnection();
        log('Created peer connection');
        // Set up to play remote audio from the strean
        rtcState.audioEl = document.createElement('audio');
        rtcState.audioEl.autoplay = true;
        // add event listener to detect when audio is playing
        rtcState.audioEl.onplaying = () => {
            log('Audio is playing');
            // updateStatus('Audio is playing');
            this.setAgentState('speaking');
        }
        rtcState.pc.ontrack = (e) => {
            rtcState.audioEl!.srcObject = e.streams[0];
            this.startSilenceDetector(e.streams[0]); // 👈 Start silence monitoring
        };
        log('Created audio element and set up ontrack event');
        try {
            const ms = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            log('Microphone access granted');
            rtcState.pc.addTrack(ms.getTracks()[0]);
            rtcState.mediaStream = ms;
            log('Added microphone track to peer connection');
        } catch (err: any) {
            log(`❌ Microphone ERROR: ${err.name} - ${err.message}`);
            throw new Error(`Microphone access denied: ${err.message}`);
        }
        // set up data channel for sending and receiving events
        rtcState.dc = rtcState.pc.createDataChannel("oai-events");
        log('Created data channel');
        rtcState.dc.addEventListener("message", (e) => {
            // Realtime server events appear here!
            //log(`Received event: ${e.data}`);
            this.eventsHandler(e.data);
        });
        // start the session using the Session Description Protocol (SDP)
        const offer = await rtcState.pc.createOffer();
        await rtcState.pc.setLocalDescription(offer);
        log('Created offer and set local description');

        // connect to the OpenAI Realtime API
        // updateStatus('Connecting to OpenAI Realtime API...');
        const sdpResponse = await fetch(`${config.openaiBaseUrl}?model=${this.model}`, {
            method: "POST",
            body: offer.sdp,
            headers: {
                Authorization: `Bearer ${this.EPHEMERAL_KEY}`,
                "Content-Type": "application/sdp"
            },
        });
        if (!sdpResponse.ok) {
            // log(`❌ Failed to connect to OpenAI Realtime API: ${sdpResponse.statusText}`);
            throw new Error(`Failed to connect to OpenAI Realtime API: ${sdpResponse.statusText}`);
        }
        const answer: RTCSessionDescriptionInit = {
            type: "answer",
            sdp: await sdpResponse.text(),
        };
        await rtcState.pc.setRemoteDescription(answer);
        // log('Set remote description with OpenAI Realtime API response');
        // update session with instructions and voice
        // Add event listener for data channel open state
        rtcState.dc.addEventListener("open", () => {
            log('Data channel is now open and ready for communication');
            // Now that the channel is open, update the session
            this.updateSession(this.instructions, this.voice, this.tools.getAllToolObjects());
            // trigger the model response
            this.triggerModelResponse();
        });

    }

    async fetchToken() {
        try {
            const response = await agentApi.get(config.sessionEndPoint);

            if (response.status === 200) {
                this.EPHEMERAL_KEY = response.data.client_secret;
                console.log('Fetched session token:', this.EPHEMERAL_KEY);
                log('Fetched session token successfully');
            } else {
                const errorMsg = `Failed to fetch session token: ${response.statusText}`;
                log(errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error) {
            log(`Error fetching session token: ${error}`);
            throw error;
        }
    }

    stopConnection() {
        if (rtcState.pc) {
            rtcState.pc.close();
            rtcState.pc = null;
            log('Closed peer connection');
        }
    
        if (rtcState.mediaStream) {
            rtcState.mediaStream.getTracks().forEach(track => track.stop());
            rtcState.mediaStream = null;
            log('Stopped media stream');
        }
    
        if (rtcState.audioEl) {
            rtcState.audioEl.srcObject = null;
            rtcState.audioEl = null;
        }
    
        rtcState.dc = null;
        updateStatus('Disconnected');
        this.setAgentState('waiting');
    }

    eventsHandler(event: string): void {
        // parse the event and handle it
        const parsedEvent = JSON.parse(event);
        const eventType = parsedEvent.type;
        // Keep track of previous state to detect changes
        const previousState = this.state;
        switch(eventType) {
            case 'response.audio_transcript.done':
                log(`Transcript done: ${parsedEvent.transcript}`);
                break;
            case 'response.function_call_arguments.done':
                log(`Function call arguments done: ${parsedEvent.arguments}`);
                break;
            case 'response.done':
                log(`Response done: ${parsedEvent.response.status}`);
                // check if it contains a function call
                if (parsedEvent.response.output && parsedEvent.response.output.length > 0 && parsedEvent.response.output[0].type === 'function_call') {
                    const toolCallOutput = this.tools.runToolCall(parsedEvent.response.output[0]);
                    log(`Tool call output: ${toolCallOutput.output}`);
                    // send the tool call output back to the server
                    this.sendToolOutput(toolCallOutput);
                }
                //this.state = 'waiting';
                break;
            case 'response.audio.done':
                log(`Audio done: ${parsedEvent.event_id}`);
                // check if it contains a function call
                //this.state = 'waiting';
                break;
            case 'response.created':
                log(`Response created: ${parsedEvent.response.id}`);
                //this.state = 'speaking';
                break;
            case 'input_audio_buffer.speech_started':
                log(`Speech started: ${parsedEvent.audio_buffer}`);
                this.state = 'listening';
                break;
            case 'input_audio_buffer.committed':
                log(`Audio buffer committed: ${parsedEvent.audio_buffer}`);
                this.state = 'waiting';
                break;
            case 'error':
                log(`Error: ${parsedEvent.error.message}`);
                break;
            default:
                //log(`Event type: ${eventType}`);
                break;

        }

        // If state has changed, dispatch a custom event
        if (previousState !== this.state) {
            const stateChangeEvent = new CustomEvent('agentStateChanged', {
                detail: { state: this.state }
            });
            document.dispatchEvent(stateChangeEvent);
            log(`Agent state changed from ${previousState} to ${this.state}`);
        }
    }

    updateSession(instructions: string, voice: AgentVoice, toolsObjects: ToolObject[] = [], toolChoice: string = 'auto' ) {
        console.log('Updating session with tools:', toolsObjects);
        console.log(toolsObjects);
        const sessionUpdate = {
            type: "session.update",
            session: {
                instructions: instructions,
                voice: voice,
                tools: toolsObjects,
                tool_choice: toolChoice
            },
        }
        rtcState.dc?.send(JSON.stringify(sessionUpdate));
        log(`Session updated with instructions: ${instructions} and voice: ${voice}`);
        this.instructions = instructions;
        this.voice = voice;
    }

    sendToolOutput(toolCallOutput: ToolCallOutput) {
        const sessionEvent = {
            type: "conversation.item.create",
            item: toolCallOutput
        }
        rtcState.dc?.send(JSON.stringify(sessionEvent));
        log(`Tool call output sent: ${toolCallOutput.output}`);
        // trigger model response
        this.triggerModelResponse();
    }

    triggerModelResponse() {
        const triggerEvent = {
            "type": "response.create"
        }
        rtcState.dc?.send(JSON.stringify(triggerEvent));
        log(`Triggered model response`);
    }

    setAgentState(state: 'waiting' | 'speaking' | 'listening') {
        const previousState = this.state;
        if (state !== this.state) {
            this.state = state;
            const stateChangeEvent = new CustomEvent('agentStateChanged', {
                detail: { state: this.state }
            });
            document.dispatchEvent(stateChangeEvent);
            log(`Agent state changed from ${previousState} to ${this.state}`);
        }
    }

    private startSilenceDetector(stream: MediaStream) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        source.connect(analyser);
    
        let isSpeaking = false;
        let silenceCounter = 0;
        const silenceThreshold = 0.01; // RMS threshold
        const silenceDurationFrames = 30; // how many frames before calling it silent
    
        const detect = () => {
            analyser.getByteTimeDomainData(dataArray);
            // Normalize and compute RMS
            let sumSquares = 0;
            for (let i = 0; i < bufferLength; i++) {
                const normalized = (dataArray[i] - 128) / 128;
                sumSquares += normalized * normalized;
            }
            const rms = Math.sqrt(sumSquares / bufferLength);
    
            if (rms > silenceThreshold) {
                // Detected speech
                silenceCounter = 0;
                if (!isSpeaking) {
                    isSpeaking = true;
                    this.setAgentState('speaking');
                }
            } else {
                // Possibly silence
                silenceCounter++;
                if (silenceCounter > silenceDurationFrames && isSpeaking) {
                    isSpeaking = false;
                    this.setAgentState('waiting');
                }
            }
    
            requestAnimationFrame(detect);
        };
    
        detect();
    }
}

export default Agent;
