import { Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService, Messages } from 'app/services/chat.service';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-messages',
  imports: [
    AvatarModule, 
    InputGroup, 
    InputTextModule, 
    InputGroupAddonModule, 
    ButtonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  chatService = inject(ChatService);
  primeMessageService = inject(MessageService);
  messages$!: Subscription;
  inputText = '';

  @ViewChild('scrollWindow', {static: true}) scrollWindow!: ElementRef<HTMLDivElement>;
  @Input() messages: Messages[] | null = [];

  constructor() { }

  ngOnInit(): void {
    this.messages$ = this.chatService.messages$.subscribe({
      next: messgaes => {
        console.log(messgaes);
        this.messages = messgaes;
        this.scrollToBottom();
      }
    });
  }

  ngOnDestroy(): void {
    this.messages$?.unsubscribe();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.scrollWindow.nativeElement.scrollTo(0, this.scrollWindow.nativeElement.scrollHeight);
    },
    100) 
  }

  sendMessage() {
    if(!this.inputText?.trim().length) {
      this.inputText = '';
      return;
    }
    this.chatService.sendMessage(this.inputText.trim()).subscribe({
      next: () => this.inputText = '',
      error: (error) => {
        this.primeMessageService.add(
          { 
            severity: 'error', 
            summary: 'Error', 
            detail: 'There was an error trying to send the message!', 
            life: 3000
          }
        );
        console.error(error);
      }
    });
  }
}
