import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
})
export class CreditNoteComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}

  createCreditNote() {
    this._router.navigateByUrl('/home/operations/new-credit-note');
  }
}
