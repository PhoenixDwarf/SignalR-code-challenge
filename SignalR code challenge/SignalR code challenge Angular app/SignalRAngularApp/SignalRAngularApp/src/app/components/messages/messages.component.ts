import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  messages: Messages[] | null = [];
  inputText = '';
  joinRoomSound = new Audio('../../../../assets/sounds/discord-join.mp3');
  leaveRoomSound = new Audio('../../../../assets/sounds/discord-leave.mp3');
  messageSound = new Audio('../../../../assets/sounds/slack-message.mp3');

  @ViewChild('scrollWindow', {static: true}) scrollWindow!: ElementRef<HTMLDivElement>;

  constructor() {
    this.joinRoomSound.volume = 0.2;
    this.leaveRoomSound.volume = 0.2;
    this.messageSound.volume = 0.2;
  }

  ngOnInit(): void {
    this.messages$ = this.chatService.messages$.subscribe({
      next: messgaes => {
        console.log('MESAGGES', '\n', messgaes);
        const lastMessage = messgaes.slice(-1)[0];
        if(lastMessage.user === 'App') {
          this.primeMessageService.add(
            { 
              severity: 'info', 
              summary: lastMessage.message.includes('joined') ? 'User has joined the group': 'User has left the group', 
              detail: lastMessage.message, 
              life: 3000
            }
          );
          lastMessage.message.includes('joined') ? this.joinRoomSound?.play() : this.leaveRoomSound?.play();
        }
        else if(lastMessage. user !== this.chatService.loggedUser) {
          this.messageSound.play();
        }

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
