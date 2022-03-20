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
        'http://localhost:3000/documents',
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
        "http://localhost:3000/documents"
      )
      .subscribe({
        // complete: () => {  },
        error: (error: any) => {
          console.log(error);
        },
        next: (documents: any) => {
          this.documents = documents.documents;
          // console.log(this.documents)
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

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.storeDocuments();
        }
      );
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


  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.storeDocuments();
        }
      );
  }


  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers})
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          // this.storeDocuments();
        }
      );
  }
}
