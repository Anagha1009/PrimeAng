import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlService } from 'src/app/services/bl.service';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
})
export class CreditNoteComponent implements OnInit {
  creditList: any[] = [];
  constructor(private _router: Router, private blService: BlService) {}

  ngOnInit(): void {}
}
