import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { BookingListComponent } from './booking-list/booking-list.component';
import { ErDetailsComponent } from './er-details/er-details.component';
import { ErListComponent } from './er-list/er-list.component';
import { NewErComponent } from './new-er/new-er.component';
import { SplitBookingComponent } from './split-booking/split-booking.component';
import { ErList2Component } from './er-list2/er-list2.component';
@NgModule({
  declarations: [
    BookingListComponent,
    ErDetailsComponent,
    ErListComponent,
    NewErComponent,
    SplitBookingComponent,
    ErList2Component
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    HttpClientModule,
    TranslateModule,
    DataTablesModule
  ]
})
export class BookingModule { }
