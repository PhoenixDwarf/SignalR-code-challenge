import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { ChatService } from './services/chat.service';


const chatRoomGuard: CanActivateFn = () => {
    const router = inject(Router);
    const chatService = inject(ChatService);
    if (chatService.loggedUser) return true;
    router.navigate(['/login']);
    console.warn('Log in before trying to access the chat room!');
    return false;
};

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'join-room',
        pathMatch: 'full'
    },
    {
        path: 'join-room',
        loadComponent: () => import('./components/join-room/join-room.component').then(m => m.JoinRoomComponent)
    },
    {
        path: 'chat-room',
        loadComponent: () => import('./components/chat-room/chat-room.component').then(m => m.ChatComponent),
        canActivate: [chatRoomGuard]
    },
    {
        path: '**',
        redirectTo: 'join-room',
    },
];
