
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface ChatMessage {
  username: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  private socket: Socket = io('http://localhost:3000');

  constructor() {
    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  // SEND MESSAGE TO SERVER
  sendMessage(username: string, text: string): void {

    const message: ChatMessage = {
      username,
      text
    };

    this.socket.emit('chat:send', message);
  }

  // RECEIVE MESSAGE FROM SERVER
  onMessage(): Observable<ChatMessage> {

    return new Observable<ChatMessage>((observer) => {

      const handler = (message: ChatMessage) => {
        observer.next(message);
      };

      this.socket.on('chat:send', handler);

      // Cleanup listener
      return () => {
        this.socket.off('chat:send', handler);
      };

    });
  }
}
