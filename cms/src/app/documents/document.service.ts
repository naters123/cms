import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { map, Subject, tap } from "rxjs";
import { Document } from "./document.model";
import { Observable } from "rxjs";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number = 0;

  constructor(private http: HttpClient) {
    this.getDatabaseData();
  }
  
  storeDocuments() {
    const docs = JSON.stringify(this.documents);
    this.http
      .put(
        'https://documents-e2f7e-default-rtdb.firebaseio.com/documents.json',
        docs
      )
      .subscribe(response => {
        console.log(response);
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  getDatabaseData() {
    this.http
      .get<Document[]>(
        "https://documents-e2f7e-default-rtdb.firebaseio.com/documents.json"
      )
      .subscribe({
        // complete: () => {  },
        error: (error: any) => {
          console.log(error);
        },
        next: (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents = this.documents.sort(
            (current: Document, next: Document) => {
              if (current.name < next.name) {
                return -1;
              } else if (current.name > next.name) {
                return 1;
              } else if (current.name == next.name) {
                return 0;
              }
            }
          );
          this.documentListChangedEvent.next(this.documents.slice());
        },
      });
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

    let pos: number = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    let documentsListClone: Document[] = this.documents.slice();
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId: number = 0;

    for (let i: number = 0; i < this.documents.length; i++) {
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

    this.maxDocumentId++;
    newDocument.id = String(this.maxDocumentId);
    this.documents.push(newDocument);
    let documentsListClone: Document[] = this.documents.slice();
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == undefined || originalDocument == null) {
      return;
    }
    if (newDocument == undefined || newDocument == null) {
      return;
    }

    let pos: number = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone: Document[] = this.documents.slice();
    this.storeDocuments();
  }
}
