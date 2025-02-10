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

  messages$ = new BehaviorSubject<string[]>([]);
  connectedUsers$ = new BehaviorSubject<object[]>([]);

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
    });

    this.connection.on('ConnedtedUsers', (users: string[]) => {
      console.log(users);
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
        console.log('Error while starting connection: ', error);
        console.log('Trying to reconnect now');
        setTimeout(() => this.startConnection(), 5000);
      }
    });
  }

  joinRoom(user: string, room: string): Observable<void> {
    return from(this.connection.invoke('JoinRoom', { user, room }));
  } 

  sendMessage(message: string): Observable<void> {
    return from(this.connection.invoke('SendMessage', message));
  }

  leaveChat(): Observable<void> {
    return from(this.connection.stop());
  }
}
