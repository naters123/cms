import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number = 0;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
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
    if (document == undefined || document == null) {
      return;
    }
  
    let pos: number = this.documents.indexOf(document)
    if (pos < 0) {
      return
    }
  
    this.documents.splice(pos, 1)
    let documentsListClone: Document[] = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone)
  }
  
  getMaxId(): number {
    let maxId: number = 0

    for (let i:number = 0; i < this.documents.length; i++) {
      let currentId: number = parseInt(this.documents[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument == undefined || newDocument == null) {
      return;
    }
    
    this.maxDocumentId++
    newDocument.id = String(this.maxDocumentId)
    this.documents.push(newDocument);
    let documentsListClone: Document[] = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone)
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == undefined || originalDocument == null) {
      return;
    }
    if (newDocument == undefined || newDocument == null) {
      return;
    }

    let pos: number = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return
    }

    newDocument.id = originalDocument.id
    this.documents[pos] = newDocument
    let documentsListClone: Document[] = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone)
  }
  
}
