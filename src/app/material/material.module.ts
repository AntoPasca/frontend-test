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
  MatIconModule,
  MatFormFieldModule
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
    MatIconModule,
    MatFormFieldModule
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
    MatIconModule,
    MatFormFieldModule
  ]
})
export class MaterialModule { }
