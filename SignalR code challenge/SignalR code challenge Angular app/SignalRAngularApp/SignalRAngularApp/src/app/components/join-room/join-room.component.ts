import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ChatService } from 'app/services/chat.service';

@Component({
  selector: 'app-join-room',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent {

  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly chatService: ChatService = inject(ChatService);

  public readonly rooms: Room[] = [
    { name: 'General', code: 'GEN' },
    { name: 'Random', code: 'RAN' },
    { name: 'BrainLMS', code: 'BRA' },
    { name: 'Human Resources', code: 'HR' },
  ];

  public readonly profileForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    group: new FormControl<Room>({name: '', code: ''}, [Validators.required]),
  });

  onSubmit(): void {
    if(!this.profileForm.controls.username.value) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username is required, please enter one.', life: 3000 });
    }
    else if(!this.profileForm.controls.group.value) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Group is required, please select one of the options.', life: 3000 });
    }
    else {
      const {username, group} = this.profileForm.value;
      this.chatService.joinRoom(username!, group?.name!).subscribe({
        next: () => {
          console.log('Joined room successfully');
          this.router.navigate(['chat-room']);
        },
        error: (error) => console.log('Error while joining room: ', error)
      });
    }
  }
}

interface Room {
  name: string;
  code: string;
}