import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  
  constructor(
       private contactService: ContactService,
       private router: Router,
       private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe (
      (params: Params) => {
        let id = +params['id'];
        if (id == undefined || id == null) {              
          this.editMode = false
          return
        }
        this.originalContact = this.contactService.getContact(id.toString())
      
        if (this.originalContact == undefined || this.originalContact == null) {              
          return
        }
        this.editMode = true
        this.contact = JSON.parse(JSON.stringify(this.originalContact))
        if (this.contact.group) {
          // https://stackoverflow.com/questions/5113374/javascript-check-if-variable-exists-is-defined-initialized
          // if (typeof this.contact.group !== 'undefined') {
            this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group))
          }
      });
  }
  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    let newContact = new Contact(value['id'], value['name'], value['email'], value['phone'], value['imageUrl'], this.groupContacts)
    if (this.editMode == true) {
      this.contactService.updateContact(this.originalContact, newContact)
    }
     
    else {
      console.log(newContact)
      this.contactService.addContact(newContact)
    }
    this.onCancel();
  }
 
  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
      return;
    }
    this.groupContacts.push(selectedContact);
  }
  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
       return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
       if (newContact.id === this.groupContacts[i].id) {
         return true;
      }
    }
    return false;
 }
}
