import { Component, ElementRef, signal, viewChild, ViewChild } from '@angular/core';
import { Blur } from './blur/blur';
import { Brightnesscontrast } from './brightnesscontrast/brightnesscontrast';
import { Greyscale } from './greyscale/greyscale';
import { Inverted } from './inverted/inverted';
import { Pixelated } from './pixelated/pixelated';
import { Removecolor } from './removecolor/removecolor';
import { Sepia } from './sepia/sepia';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}