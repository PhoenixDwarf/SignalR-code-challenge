import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-messages',
  imports: [
    AvatarModule, 
    InputGroup, 
    InputTextModule, 
    InputGroupAddonModule, 
    ButtonModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements AfterViewInit, OnChanges {
  constructor() { }

  @ViewChild('scrollWindow', {static: true}) scrollWindow!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.scrollToBottom();
    console.log('Changes detected:', changes);
  }

  scrollToBottom(): void {
    this.scrollWindow.nativeElement.scrollTo(0, this.scrollWindow.nativeElement.scrollHeight);
  }
}
