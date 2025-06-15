interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

class OllamaService {
  private baseUrl: string;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.baseUrl = 'http://localhost:11434';
    
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (error) {
      console.error('Ollama connection check failed:', error);
      return false;
    }
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      const isConnected = await this.checkConnection();
      
      if (!isConnected) {
        return this.getOfflineResponse(prompt);
      }

      const systemPrompt = `You are an expert career guidance counselor. Your role is to provide personalized, actionable career advice to students. 

Guidelines:
- Provide specific, practical advice tailored to the student's interests and skills
- Suggest relevant career paths, educational requirements, and next steps
- Be encouraging and supportive while being realistic
- Ask clarifying questions to better understand their situation
- Include information about emerging career opportunities
- Consider both traditional and modern career paths
- Respond in the same language as the student's question

${context ? `Previous conversation context: ${context}` : ''}

Student's question: ${prompt}`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: systemPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response.trim();
      
    } catch (error) {
      console.error('Error generating response:', error);
      return this.getOfflineResponse(prompt);
    }
  }

  private getOfflineResponse(prompt: string): string {
    const offlineResponses = [
      "I'm currently offline, but I can still provide some general career guidance. Could you tell me more about your interests and skills? When I'm back online, I'll be able to give you more detailed and personalized advice.",
      "While I'm in offline mode, I can suggest exploring your interests through online resources, speaking with professionals in fields that interest you, and considering your natural strengths. What subjects or activities do you enjoy most?",
      "I'm working in offline mode right now. In the meantime, I recommend researching career assessments, talking to career counselors at your school, and exploring internship opportunities. What specific career areas are you curious about?",
    ];
    
    return offlineResponses[Math.floor(Math.random() * offlineResponses.length)];
  }

  isServiceOnline(): boolean {
    return this.isOnline;
  }
}

export const ollamaService = new OllamaService();