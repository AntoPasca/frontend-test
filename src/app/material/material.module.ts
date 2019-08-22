import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDividerModule,
  MatTableModule,
  MatGridListModule,
  MatListModule,
  MatIconModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule,
    MatGridListModule,
    MatListModule,
    MatIconModule
  ],
  declarations: [],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule,
    MatGridListModule,
    MatListModule,
    MatIconModule
  ]
})
export class MaterialModule { }
