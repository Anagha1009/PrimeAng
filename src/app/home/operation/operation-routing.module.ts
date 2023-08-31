import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/@core/services/auth.guard';
import { ForgotPwdComponent } from 'src/app/auth/forgot-pwd/forgot-pwd.component';
import { Role } from 'src/app/models/login';
import { CroListComponent } from './cro-list/cro-list.component';
import { DoDetailsComponent } from './do-details/do-details.component';
import { DoListComponent } from './do-list/do-list.component';
import { ExcRateListComponent } from './exc-rate-list/exc-rate-list.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { LoadListComponent } from './load-list/load-list.component';
import { ManifestListComponent } from './manifest-list/manifest-list.component';
import { MergeBlComponent } from './merge-bl/merge-bl.component';
import { NewBlComponent } from './new-bl/new-bl.component';
import { NewCroComponent } from './new-cro/new-cro.component';
import { NewDo2Component } from './new-do2/new-do2.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { SurrenderedListComponent } from './surrendered-list/surrendered-list.component';
import { TdrListComponent } from './tdr-list/tdr-list.component';
import { TdrComponent } from './tdr/tdr.component';
import { NewInvoice2Component } from './new-invoice2/new-invoice2.component';
import { InvoiceList2Component } from './invoice-list2/invoice-list2.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { NewCreditNoteComponent } from './new-credit-note/new-credit-note.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { NewReceiptComponent } from './new-receipt/new-receipt.component';
import { VendorBillsComponent } from './vendor-bills/vendor-bills.component';
import { NewVendorBillComponent } from './new-vendor-bill/new-vendor-bill.component';
import { ReceiptsComponent } from './receipts/receipts.component';

const routes: Routes = [
  {
    path: 'cro-list',
    component: CroListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'do-details',
    component: DoDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'do-list',
    component: DoListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'load-list',
    component: LoadListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'manifest-list',
    component: ManifestListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-bl',
    component: NewBlComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'merge-bl',
    component: MergeBlComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-cro',
    component: NewCroComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-cro/:BOOKING_NO',
    component: NewCroComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-do',
    component: NewDo2Component,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-tdr',
    component: TdrComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'tdr-list',
    component: TdrListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'exc-rate-list',
    component: ExcRateListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'change-password',
    component: ForgotPwdComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent, Role.Depot] },
  },
  {
    path: 'surrendered-list',
    component: SurrenderedListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-invoice',
    component: NewInvoice2Component,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'invoice-list/:BL_NO',
    component: InvoiceList2Component,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'credit-note',
    component: CreditNoteComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-credit-note',
    component: NewCreditNoteComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'receipt-list',
    component: ReceiptListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'receipts',
    component: ReceiptsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-receipt',
    component: NewReceiptComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'vendor-bills',
    component: VendorBillsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-vendor-bill',
    component: NewVendorBillComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
