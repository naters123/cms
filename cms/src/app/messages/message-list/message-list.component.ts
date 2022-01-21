import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message("2", "subject", "The grades for the assignment have been posted", "Bro. Jackson"),
    new Message("3", "a subject", "When is assignment 3 due", "Steve Johnson"),
    new Message("4", "3rd subject", "Assignment 3 is due on Saturday at 11:30 PM", "Bro. Jackson")
  ]
  constructor() { }

  ngOnInit(): void {
  }
  
  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
