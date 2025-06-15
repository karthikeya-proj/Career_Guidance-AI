class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-US';

  // Supported languages for career guidance
  private supportedLanguages = {
    'en-US': 'English (US)',
    'en-IN': 'English (India)',
    'hi-IN': 'Hindi',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'bn-IN': 'Bengali',
    'mr-IN': 'Marathi',
    'gu-IN': 'Gujarati',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'pa-IN': 'Punjabi',
    'ur-IN': 'Urdu'
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = this.currentLanguage;
    }
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async speak(text: string, language?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language-appropriate voice
      const voices = this.synthesis.getVoices();
      const targetLang = language || this.currentLanguage;
      
      let voice = voices.find(v => v.lang === targetLang);
      if (!voice) {
        // Fallback to language family
        const langFamily = targetLang.split('-')[0];
        voice = voices.find(v => v.lang.startsWith(langFamily));
      }
      
      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = targetLang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Detect language from text (basic implementation)
  detectLanguage(text: string): string {
    // Simple language detection based on character patterns
    const hindiPattern = /[\u0900-\u097F]/;
    const tamilPattern = /[\u0B80-\u0BFF]/;
    const teluguPattern = /[\u0C00-\u0C7F]/;
    const bengaliPattern = /[\u0980-\u09FF]/;
    const marathiPattern = /[\u0900-\u097F]/;
    const gujaratiPattern = /[\u0A80-\u0AFF]/;
    const kannadaPattern = /[\u0C80-\u0CFF]/;
    const malayalamPattern = /[\u0D00-\u0D7F]/;
    const punjabiPattern = /[\u0A00-\u0A7F]/;
    const urduPattern = /[\u0600-\u06FF]/;

    if (hindiPattern.test(text)) return 'hi-IN';
    if (tamilPattern.test(text)) return 'ta-IN';
    if (teluguPattern.test(text)) return 'te-IN';
    if (bengaliPattern.test(text)) return 'bn-IN';
    if (gujaratiPattern.test(text)) return 'gu-IN';
    if (kannadaPattern.test(text)) return 'kn-IN';
    if (malayalamPattern.test(text)) return 'ml-IN';
    if (punjabiPattern.test(text)) return 'pa-IN';
    if (urduPattern.test(text)) return 'ur-IN';

    return 'en-US'; // Default to English
  }
}

export const speechService = new SpeechService();