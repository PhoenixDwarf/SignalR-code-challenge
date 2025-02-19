import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ChatService } from 'app/services/chat.service';

import { TableModule } from 'primeng/table';
import { tap } from 'rxjs';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  imports: [
    TableModule,
    CommonModule
  ],
})
export class UsersListComponent {
  private readonly chatService: ChatService = inject(ChatService);
  users$ = this.chatService.connectedUsers$.pipe(
    tap( users => {
      console.table(users);
    })
  );
}