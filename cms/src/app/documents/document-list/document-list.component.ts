import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document("1","Mario","Super Mario, the mascot of Nintendo","*dummy url*",[]),
    new Document("2","Luigi","Super Mario's brother","*dummy url*",[]),
    new Document("3","Peach","The princess of the Mushroom Kingdom","*dummy url*",[]),
    new Document("4","Yoshi","A friendly green dinosaur","*dummy url*",[]),
    new Document("5","Bowser","The main antagonist of the Mario Bros franchise","*dummy url*",[])
  ];
  constructor() { }

  ngOnInit(): void {
  }
  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
