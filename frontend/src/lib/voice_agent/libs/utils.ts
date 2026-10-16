//import {dom} from '../app/dom'

export function log(message: string): void {
    // const logEntry = document.createElement('div');
    // logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    // dom.logsEl.appendChild(logEntry);
    // dom.logsElParent.scrollTop = dom.logsElParent.scrollHeight;
    console.log(`${new Date().toLocaleTimeString()} - ${message}`);
}

export function updateStatus(message: string): void {
    // dom.statusEl.textContent = `Status: ${message}`;
    log(`Status: ${message}`);
}

export function setupConnectionLogging(pc: RTCPeerConnection): void {
    pc.addEventListener('connectionstatechange', () => {
        log(`Connection state: ${pc.connectionState}`);
    });

    pc.addEventListener('iceconnectionstatechange', () => {
        log(`ICE connection state: ${pc.iceConnectionState}`);
    });

    pc.addEventListener('signalingstatechange', () => {
        log(`Signaling state: ${pc.signalingState}`);
    });

    pc.addEventListener('icecandidateerror', (e) => {
        log(`ICE candidate error: ${e.errorText}`);
    });
}

export async function testMic() {
    try {
        log('Testing microphone access...');

        // Check if mediaDevices exists
        if (!navigator.mediaDevices) {
            log('ERROR: navigator.mediaDevices not available in this browser');
            return;
        }

        // Try to access the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        log('✅ Microphone access GRANTED');

        // Create a temporary audio meter to show the microphone is working
        const audioContext = new (window.AudioContext || window.AudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);

        // Stop the stream after 3 seconds
        setTimeout(() => {
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
            log('Microphone test completed and released');
        }, 3000);

    } catch (err: any) {
        log(`❌ Microphone ERROR: ${err.name} - ${err.message}`);

        // More helpful error messages
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            log('Permission denied - Please check your browser settings and allow microphone access');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            log('No microphone found - Please check your hardware connection');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            log('Cannot access microphone - It may be in use by another application');
        } else if (err.name === 'OverconstrainedError') {
            log('Cannot satisfy requested audio constraints - Try different settings');
        } else if (err.name === 'TypeError') {
            log('Invalid constraints specified');
        }
    }
}