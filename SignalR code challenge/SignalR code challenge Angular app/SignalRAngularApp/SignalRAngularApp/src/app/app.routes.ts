import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'join-room',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent)
    },
    {
        path: 'join-room',
        loadComponent: () => import('./components/join-room/join-room.component').then(m => m.JoinRoomComponent)
    },
    {
        path: 'chat-room',
        loadComponent: () => import('./components/chat-room/chat-room.component').then(m => m.ChatComponent),
    },
    {
        path: '**',
        redirectTo: 'join-room',
    },
];
