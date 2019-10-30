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
import {MatExpansionModule} from '@angular/material/expansion'

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
    MatFormFieldModule,
    MatExpansionModule
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
    MatFormFieldModule,
    MatExpansionModule
  ]
})
export class MaterialModule { }
