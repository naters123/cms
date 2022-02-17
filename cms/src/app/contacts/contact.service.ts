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

   constructor() {
      this.contacts = MOCKCONTACTS;
      this.maxContactId = this.getMaxId();
   }
   getContacts(): Contact[] {
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
      if (contact == undefined || contact == null) {
         return;
      }
     
       let pos: number = this.contacts.indexOf(contact)
       if (pos < 0) {
         return
       }
     
       this.contacts.splice(pos, 1)
       let contactsListClone: Contact[] = this.contacts.slice()
       this.contactListChangedEvent.next(contactsListClone)
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
    addContact(newContact: Contact) {
      if (newContact == undefined || newContact == null) {
        return;
      }
      
      this.maxContactId++
      newContact.id = String(this.maxContactId)
      this.contacts.push(newContact);
      let contactsListClone: Contact[] = this.contacts.slice()
      this.contactListChangedEvent.next(contactsListClone)
    }
    updateContact(originalContact: Contact, newContact: Contact) {
      if (originalContact == undefined || originalContact == null) {
        return;
      }
      if (newContact == undefined || newContact == null) {
        return;
      }
  
      let pos: number = this.contacts.indexOf(originalContact)
      if (pos < 0) {
        return
      }
  
      newContact.id = originalContact.id
      this.contacts[pos] = newContact
      let contactsListClone: Contact[] = this.contacts.slice()
      this.contactListChangedEvent.next(contactsListClone)
    }

}
