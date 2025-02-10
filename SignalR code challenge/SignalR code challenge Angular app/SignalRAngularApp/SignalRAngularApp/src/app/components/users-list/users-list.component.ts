import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChatService } from 'app/services/chat.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  imports: [
    TableModule, 
    CommonModule, 
    InputTextModule, 
    TagModule,
    SelectModule, 
    MultiSelectModule, 
    ButtonModule, 
    IconFieldModule, 
    InputIconModule],
})
export class UsersListComponent {
  private readonly chatService: ChatService = inject(ChatService);
  users$ = this.chatService.connectedUsers$;
}