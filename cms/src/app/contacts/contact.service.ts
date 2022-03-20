import { HttpClient, HttpHeaders } from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
   contactSelectedEvent = new EventEmitter<Contact>();
   contactListChangedEvent = new Subject<Contact[]>();
   contacts: Contact[] = [];
   maxContactId: number = 0;

   constructor(private http: HttpClient) {
    //  this.contacts = MOCKCONTACTS
    this.getDatabaseData();
   }
   storeContacts() {
    const con = JSON.stringify(this.contacts);
    this.http
      .put(
        'http://localhost:3000/contacts',
        con
      )
      .subscribe(response => {
        console.log(response);
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  getDatabaseData() {
    this.http
      .get<Contact[]>(
        "http://localhost:3000/contacts"
      )
      .subscribe({
        // complete: () => {  },
        error: (error: any) => {
          console.log(error);
        },
        next: (contacts: any) => {
          this.contacts = contacts.contacts;
          this.maxContactId = this.getMaxId();
          this.contacts = this.contacts.sort(
            (current: Contact, next: Contact) => {
              if (current.name < next.name) {
                return -1;
              } else if (current.name > next.name) {
                return 1;
              } else if (current.name == next.name) {
                return 0;
              }
            }
          );
          this.contactListChangedEvent.next(this.contacts.slice());
        },
      });
  }
   getContacts(): Contact[] {
      this.getDatabaseData();
      return this.contacts.slice();
   }
   getContact(id: string): Contact {
      for (let i = 0; i < this.contacts.length; i++) {
         if (this.contacts[i].id === id) {
            return this.contacts[i];
         }
      }
        return null; 
   }

   deleteContact(contact: Contact) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.storeContacts();
        }
      );
  }
   getMaxId(): number {
      let maxId: number = 0
  
      for (let i:number = 0; i < this.contacts.length; i++) {
        let currentId: number = parseInt(this.contacts[i].id);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
      return maxId;
    }
    addContact(contact: Contact) {
      if (!contact) {
        return;
      }
  
      // make sure id of the new contact is empty
      contact.id = '';
  
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
      // add to database
      this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
        { headers: headers })
        .subscribe(
          (responseData) => {
            // add new contact to contacts
            this.contacts.push(responseData.contact);
            this.storeContacts();
          }
        );
    }
    updateContact(originalContact: Contact, newContact: Contact) {
      if (!originalContact || !newContact) {
        return;
      }
  
      const pos = this.contacts.findIndex(d => d.id === originalContact.id);
  
      if (pos < 0) {
        return;
      }
  
      // set the id of the new Document to the id of the old Document
      newContact.id = originalContact.id;
      // newContact._id = originalContact._id;
  
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
      // update database
      this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
        .subscribe(
          (response: Response) => {
            this.contacts[pos] = newContact;
            this.storeContacts();
          }
        );
    }

}
