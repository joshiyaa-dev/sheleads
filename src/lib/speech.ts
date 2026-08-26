/**
 * Voice search and voice-to-apply using Web Speech API.
 * All processing is local — audio is never recorded or transmitted.
 */

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function isVoiceSupported(): boolean {
  return !!SpeechRecognition;
}

export interface VoiceResult {
  transcript: string;
  confidence: number;
}

/** Start a one-shot voice search session. Resolves with the transcript. */
export function voiceSearch(timeoutMs = 8000): Promise<VoiceResult> {
  return new Promise((resolve, reject) => {
    if (!SpeechRecognition) return reject(new Error('Speech Recognition not supported'));
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const timer = setTimeout(() => { recognition.abort(); reject(new Error('Voice timeout')); }, timeoutMs);

    recognition.onresult = (event: any) => {
      clearTimeout(timer);
      const result = event.results[0];
      resolve({
        transcript: result[0].transcript,
        confidence: result[0].confidence,
      });
    };
    recognition.onerror = (e: any) => { clearTimeout(timer); reject(new Error(e.error)); };
    recognition.onend = () => clearTimeout(timer);
    recognition.start();
  });
}

/** Speak text aloud using SpeechSynthesis. */
export function speak(text: string): void {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

/** Voice command parser — extracts intent from transcript. */
export function parseVoiceCommand(transcript: string): { intent: string; query: string } {
  const lower = transcript.toLowerCase();
  if (lower.startsWith('search') || lower.startsWith('find') || lower.startsWith('look for')) {
    const query = lower.replace(/^(search|find|look for)\s+/, '');
    return { intent: 'search', query };
  }
  if (lower.startsWith('apply to') || lower.startsWith('apply for')) {
    const query = lower.replace(/^(apply to|apply for)\s+/, '');
    return { intent: 'apply', query };
  }
  if (lower.includes('save') || lower.includes('bookmark')) {
    return { intent: 'save', query: lower.replace(/.*(save|bookmark)\s+/, '') };
  }
  return { intent: 'search', query: lower };
}
