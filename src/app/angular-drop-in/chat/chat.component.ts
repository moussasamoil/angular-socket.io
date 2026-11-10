
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  ChatServiceService,
  ChatMessage
} from '../chat-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  messages: ChatMessage[] = [];

  username: string = '';
  draft: string = '';

  private messageSubscription?: Subscription;

  constructor(private chat: ChatServiceService) {}

  ngOnInit(): void {

    this.messageSubscription = this.chat.onMessage()
      .subscribe((message: ChatMessage) => {

        console.log('Received message:', message);

        this.messages.push(message);

      });
  }

  send(): void {

    if (!this.username.trim() || !this.draft.trim()) {
      return;
    }

    this.chat.sendMessage(
      this.username.trim(),
      this.draft.trim()
    );

    // Clear message after sending
    this.draft = '';
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
