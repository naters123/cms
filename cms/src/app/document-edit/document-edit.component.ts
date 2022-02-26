import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../documents/document.model';
import { DocumentService } from '../documents/document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  
  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    
    this.route.params.subscribe (
      (params: Params) => {
        let id = +params['id'];
        if (id == undefined || id == null) {              
          this.editMode = false
          return
        }
        this.originalDocument = this.documentService.getDocument(id.toString())
      
        if (this.originalDocument == undefined || this.originalDocument == null) {              
          return
        }
        this.editMode = true
        this.document = JSON.parse(JSON.stringify(this.originalDocument))
    });
  }
  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    let newDocument = new Document(value['id'], value['name'], value['description'], value['url'], value['children'])
    if (this.editMode == true) {
      this.documentService.updateDocument(this.originalDocument, newDocument)
    }
     
    else {
      console.log(newDocument)
      this.documentService.addDocument(newDocument)
    }
    this.onCancel();
  }
}
