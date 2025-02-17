import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5000/chat', {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

  messages$ = new BehaviorSubject<Messages[]>([]);
  connectedUsers$ = new BehaviorSubject<object[]>([]);
  messages: Messages[] = [];
  users: string[] = [];
  loggedUser: string | undefined;
  currentRoom: string | undefined;

  private readonly imageNames = [
    'amyelsner.png',
    'annafali.png',
    'asiyajavayant.png',
    'bernardodominic.png',
    'elwinsharvill.png',
    'ionibowcher.png',
    'ivanmagalhaes.png',
    'onyamalimba.png',
    'stephenshaw.png',
    'xuxuefeng.png'
  ];
  
  constructor() {
    this.startConnection();

    this.connection.on('ReceiveMessage', (user: string, message: string, time: string) => {
      console.log(`${user}: ${message} at ${time}`);
      this.messages = [...this.messages, { user, message, time }];
      this.messages$.next(this.messages);
    });

    this.connection.on('ConnedtedUsers', (users: string[]) => {
      console.log(users);
      //This simply adds an image to the user based on it's index so everyone will see the same image instead of a random one.
      const formatedUsers = users.map((user, index) => {
        return {
          name: user,
          image: this.imageNames[index % this.imageNames.length]
        };
      });
      this.connectedUsers$.next(formatedUsers);
    });
  }

  startConnection(): void {
    from(this.connection.start()).subscribe({
      next: () => console.log('Connection started'),
      error: (error) => {
        if(error?.message?.includes("not in the 'Disconnected' state.")) return;
        console.log('Error while starting connection: ', error);
        console.log('Trying to reconnect now');
        setTimeout(() => this.startConnection(), 5000);
      }
    });
  }

  joinRoom(user: string, room: string): Observable<void> {
    this.loggedUser = user;
    this.currentRoom = room;
    return from(this.connection.invoke('JoinRoom', { user, room }));
  } 

  sendMessage(message: string): Observable<void> {
    return from(this.connection.invoke('SendMessage', message));
  }

  leaveChat(): Observable<void> {
    this.loggedUser = undefined;
    this.currentRoom = undefined;
    return from(this.connection.stop());
  }
}

export interface Messages {
  user: string;
  message: string;
  time: string;
}