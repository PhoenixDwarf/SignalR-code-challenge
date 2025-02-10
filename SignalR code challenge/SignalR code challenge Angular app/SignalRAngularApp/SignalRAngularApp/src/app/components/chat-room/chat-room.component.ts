import { Component, inject } from '@angular/core';
import { UsersListComponent } from 'app/components/users-list/users-list.component';
import { MessagesComponent } from 'app/components/messages/messages.component';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [
    ToastModule,
    PanelModule,
    ButtonModule,
    UsersListComponent,
    MessagesComponent
  ],
  providers: [MessageService],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatComponent {
  chatName: string = 'General';
  router = inject(Router);
  
  goHome(): void {
    this.router.navigate(['/']);
  }
}
