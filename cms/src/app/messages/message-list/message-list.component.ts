import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = []
  constructor(private messageService: MessageService, private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getDatabaseData()
    this.messages = this.messageService.getMessages();
    this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    )
    
  }
  
  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
