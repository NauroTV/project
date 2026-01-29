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
import { initializeApp } from "firebase/app";

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
firebaseConfig = {
  apiKey: "AIzaSyDCd4qH19N-VEHadaS6OxCwcapg-ypS3BQ",
  authDomain: "angular-image-editing.firebaseapp.com",
  projectId: "angular-image-editing",
  storageBucket: "angular-image-editing.firebasestorage.app",
  messagingSenderId: "82862280049",
  appId: "1:82862280049:web:654375df85c80985e37ad0"
};

// Initialize Firebase
app = initializeApp(this.firebaseConfig);
}