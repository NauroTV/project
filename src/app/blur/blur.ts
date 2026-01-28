import { Component, EventEmitter, Output, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-blur',
  imports: [ ReactiveFormsModule, FormsModule, MatSliderModule, MatInputModule ],
  templateUrl: './blur.html',
  styleUrl: './blur.css',
})
export class Blur {

  radiusControl = new FormControl<number>(1, {nonNullable:true})
  radiusControlv = this.radiusControl.value

  @Output() blurRadiusEmitter: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();
  
  constructor() 
  {
    this.radiusControl.valueChanges.subscribe(() => {
      if (this.radiusControl.value > 15) this.radiusControlv = 15
      this.blurRadiusEmitter.emit(this.radiusControlv)
    })
  }

}
