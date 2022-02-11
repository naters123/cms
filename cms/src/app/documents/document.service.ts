import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documents: Document[] = [];
  constructor() {
    this.documents = MOCKDOCUMENTS;
   }
   getDocument(id: string) {
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].id === id) {
         return this.documents[i];
      }
   }
     return null; 
   }
   getDocuments() {
    return this.documents.slice();
   }
   deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
  }
}
