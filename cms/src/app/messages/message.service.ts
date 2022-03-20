import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        'http://localhost:3000/messages',
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
        "http://localhost:3000/messages"
      )
      .subscribe({
        // complete: () => {  },
        error: (error: any) => {
          console.log(error);
        },
        next: (messages: any) => {
          this.messages = messages.messages;
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
    if (!message) {
      return;
    }

    // make sure id of the new message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ smessage: string, message: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.messages.push(responseData.message);
          this.storeMessages();
        }
      );
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
