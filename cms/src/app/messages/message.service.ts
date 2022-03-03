import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number = 0;

  constructor(private http: HttpClient) { 
    this.getDatabaseData()
  }

  storeMessages() {
    const docs = JSON.stringify(this.messages);
    this.http
      .put(
        'https://documents-e2f7e-default-rtdb.firebaseio.com/messages.json',
        docs
      )
      .subscribe(response => {
        console.log(response);
        this.messageChangedEvent.next(this.messages.slice());
      });
  }

  getDatabaseData() {
    this.http
      .get<Message[]>(
        "https://documents-e2f7e-default-rtdb.firebaseio.com/messages.json"
      )
      .subscribe({
        // complete: () => {  },
        error: (error: any) => {
          console.log(error);
        },
        next: (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          // this.messages = this.messages.sort(
          //   (current: Message, next: Message) => {
          //     if (current.name < next.name) {
          //       return -1;
          //     } else if (current.name > next.name) {
          //       return 1;
          //     } else if (current.name == next.name) {
          //       return 0;
          //     }
          //   }
          // );
          this.messageChangedEvent.next(this.messages.slice());
        },
      });
  }
  getMessages(): Message[] {
    return this.messages.slice();
  }
  getMessage(id: string): Message {
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].id === id) {
        return this.messages[i];
      }
    }
    return null; 
   }
   addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages()
   }
   getMaxId(): number {
    let maxId: number = 0;

    for (let i: number = 0; i < this.messages.length; i++) {
      let currentId: number = parseInt(this.messages[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
