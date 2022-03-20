import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender: string = "Nate Ricks";
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') messageInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }
  onSendMessage() {
    const ingSubject = this.subjectInputRef.nativeElement.value;
    const ingmessage = this.messageInputRef.nativeElement.value;
    const newMessage = new Message("19", ingSubject, ingmessage, 'ObjectId("62324797d6cdd9b868dc4492")');
    console.log(newMessage)
    this.messageService.addMessage(newMessage);
  }
  onClear() {
    this.subjectInputRef.nativeElement.value = "";
    this.messageInputRef.nativeElement.value = "";
  }

}
