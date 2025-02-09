import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-chat',
  imports: [
    ToastModule,
    PanelModule,
    AvatarModule,
    ButtonModule,
    AvatarModule,
    InputGroupAddonModule,
    InputGroup,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatComponent {

}
