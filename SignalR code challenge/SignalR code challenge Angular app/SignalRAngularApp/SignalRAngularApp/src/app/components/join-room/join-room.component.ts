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

  public readonly rooms: Room[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  public readonly profileForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if(!this.profileForm.controls.username.value) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username is required, please enter one.', life: 3000 });
    }
    else if(!this.profileForm.controls.group.value) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Group is required, please select one of the options.', life: 3000 });
    }
    else this.router.navigate(['chat']);
  }
}

interface Room {
  name: string;
  code: string;
}