import { Injectable } from '@nestjs/common';
import { ChatRequestDto } from './dto/chat-request.dto';

@Injectable()
export class AiChatService {
  async sendMessage(body: ChatRequestDto) {
    return {
      reply: `Assistant received: ${body.message}`,
      model: 'gemini-openai-compatible',
    };
  }
}
