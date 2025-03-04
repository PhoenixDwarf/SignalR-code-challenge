import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Here the connection to the hub is builded
  // We add skipNegotiation to avoid CORS Policy errors with the backend server

  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl('https://signalr-code-challenge.azurewebsites.net/chat')
  .configureLogging(signalR.LogLevel.Information)
  .build();

  // Observables and properties to hold incomming messages and users from the hub notifications
  // This will help to notify the subscribed components when the server sends a notification 

  messages$ = new BehaviorSubject<Messages[]>([]);
  connectedUsers$ = new BehaviorSubject<object[]>([]);
  messages: Messages[] = [];
  users: string[] = [];

  // On memory properties to hold the user name and room filled in the form
  // Once the app is closed or refresh the user will need to log back in

  loggedUser: string | undefined;
  currentRoom: string | undefined;

  // Array of primeng images to assign them to users 

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
    // Here the startConnection method is called
    // Since this service is injected in the first view component, It will be one of the first constructors to run on app load

    this.startConnection();

    // Registers a handler for incomming messages that will be invoked when the hub method is invoked

    this.connection.on('ReceiveMessage', (user: string, message: string, time: string) => {
      this.messages = [...this.messages, { user, message, time }];
      this.messages$.next(this.messages);
    });

    // Registers a handler for incomming users that will be invoked when the hub method is invoked

    this.connection.on('ConnedtedUsers', (users: string[]) => {
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

  // Method to start connection 
  // If an error os encountered it will try to establish connection after 5 seconds

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

  // Method to invoke hub joinRoom method on the server

  joinRoom(user: string, room: string): Observable<void> {
    this.loggedUser = user;
    this.currentRoom = room;
    return from(this.connection.invoke('JoinRoom', { user, room }));
  } 

  // Method to invoke hub SendMessage method on the server

  sendMessage(message: string): Observable<void> {
    return from(this.connection.invoke('SendMessage', message));
  }

  // Method to stop the connection with the hub
  // This also resets the on memory properties to hold the user and room name

  leaveChat(): Observable<void> {
    this.messages = [];
    this.loggedUser = undefined;
    this.currentRoom = undefined;
    return from(this.connection.stop());
  }
}

// Messages interface
export interface Messages {
  user: string;
  message: string;
  time: string;
}