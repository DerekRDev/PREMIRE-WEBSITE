/**
 * Service to interact with ElevenLabs Text-to-Speech API
 */
import { VoiceConfig } from '@/core/ai/AIAssistantTypes';

// Enum for default voices
export enum ElevenLabsVoice {
  RACHEL = 'pNInz6obpgDQGcFmaJgB', // Female
  DREW = 'jsCqWAovK2LkecY7zXl4', // Male
  CHARLIE = '5QR8Y3uMmkTOJAK5KjGB', // Male
  BELLA = 'EXAVITQu4vr4xnSDxMaL', // Female
  EMILY = 'LcfcDJNUP1GQjkzn1xUU', // Female
  ADAM = 'sodDMvLFHucTyzmXmH2I', // Male
  JOSH = 'TxGEqnHWrfWFTfGW9XjX', // Male
  ELLI = 'MF3mGyEYCl7XYWbV9V6O', // Female
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string = 'https://api.elevenlabs.io/v1';
  private defaultVoiceId: string = ElevenLabsVoice.RACHEL;
  private audioCache: Map<string, ArrayBuffer> = new Map();
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(text: string, voiceConfig?: Partial<VoiceConfig>): Promise<ArrayBuffer> {
    // Check cache first
    const cacheKey = `${text}_${voiceConfig?.voiceId || this.defaultVoiceId}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }
    
    // Prepare voice settings
    const voice = voiceConfig?.voiceId || this.defaultVoiceId;
    const settings = {
      stability: voiceConfig?.stability ?? 0.5,
      similarity_boost: voiceConfig?.similarity_boost ?? 0.75,
      style: voiceConfig?.style ?? 0,
      use_speaker_boost: voiceConfig?.use_speaker_boost ?? true,
    };
    
    // Make API call
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voice}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: settings,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
      }
      
      // Get audio as ArrayBuffer
      const audioData = await response.arrayBuffer();
      
      // Cache the result
      this.audioCache.set(cacheKey, audioData);
      
      return audioData;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw error;
    }
  }
  
  /**
   * Play audio from ArrayBuffer
   */
  playAudio(audioData: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log('Audio playback is not available in server-side rendering');
          resolve();
          return;
        }
        
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Convert ArrayBuffer to AudioBuffer
        audioContext.decodeAudioData(audioData, (buffer) => {
          // Create buffer source
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          
          // Connect to audio output
          source.connect(audioContext.destination);
          
          // Handle completion
          source.onended = () => {
            resolve();
          };
          
          // Start playback
          source.start(0);
        }, reject);
      } catch (error) {
        console.error('Error playing audio:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
      }
      
      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }
  
  /**
   * Speak text and return a Promise that resolves when audio finishes playing
   */
  async speak(text: string, voiceConfig?: Partial<VoiceConfig>): Promise<void> {
    if (!text) return Promise.resolve();
    
    try {
      // Convert text to speech
      const audioData = await this.textToSpeech(text, voiceConfig);
      
      // Play the audio
      return await this.playAudio(audioData);
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }
  
  /**
   * Generate audio for a workflow
   * This is useful for preloading audio files
   */
  async generateWorkflowAudio(
    workflowTexts: { stepId: string; text: string }[],
    voiceConfig?: Partial<VoiceConfig>
  ): Promise<Map<string, ArrayBuffer>> {
    const results = new Map<string, ArrayBuffer>();
    
    for (const { stepId, text } of workflowTexts) {
      try {
        const audioData = await this.textToSpeech(text, voiceConfig);
        results.set(stepId, audioData);
      } catch (error) {
        console.error(`Error generating audio for step ${stepId}:`, error);
      }
    }
    
    return results;
  }
  
  /**
   * Clear the audio cache
   */
  clearCache(): void {
    this.audioCache.clear();
  }
}

// Create a singleton instance
let instance: ElevenLabsService | null = null;

/**
 * Initialize the ElevenLabs service with API key
 */
export const initElevenLabsService = (apiKey: string): ElevenLabsService => {
  instance = new ElevenLabsService(apiKey);
  return instance;
};

/**
 * Get the ElevenLabs service instance
 */
export const getElevenLabsService = (): ElevenLabsService => {
  if (!instance) {
    // For development, use a placeholder API key
    // In production, this should be loaded from environment variables
    const devApiKey = process.env.ELEVEN_LABS_API_KEY || 'YOUR_ELEVEN_LABS_API_KEY';
    instance = new ElevenLabsService(devApiKey);
  }
  return instance;
};