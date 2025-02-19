import { Component, inject, OnDestroy } from '@angular/core';
import { UsersListComponent } from 'app/components/users-list/users-list.component';
import { MessagesComponent } from 'app/components/messages/messages.component';
import { ChatService } from 'app/services/chat.service';
import { Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-chat',
  imports: [
    ToastModule,
    PanelModule,
    ButtonModule,
    UsersListComponent,
    MessagesComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatComponent implements OnDestroy {
  router = inject(Router);
  chatService = inject(ChatService);
  primeMessageService = inject(MessageService);
  leaveRoomSound = new Audio('../../../../assets/sounds/discord-leave.mp3');

  ngOnDestroy(): void {
    console.log('chat leaved');
    this.leaveRoomSound.play();
    this.leaveChat();
  }
  
  leaveChat(goHome = false): void {
    this.chatService.leaveChat().subscribe({
      next: () => {
        if(goHome) this.router.navigate(['/'])
      },
      error: (error) => {
        this.primeMessageService.add(
          { 
            severity: 'error', 
            summary: 'Error', 
            detail: 'There was an error trying to leave chat!', 
            life: 3000
          }
        );
        console.error(error);
      }
    });
  }
}
