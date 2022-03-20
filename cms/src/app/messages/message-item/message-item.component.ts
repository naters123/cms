import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;
  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    console.log(this.message)
    const contact: Contact = this.contactService.getContact(this.message.sender);
    if (contact != null) {
      this.messageSender = contact.name;
    } else {
      this.messageSender = "Unknown Sender"
    }
    
  }

}
