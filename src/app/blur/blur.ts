import { Component, EventEmitter, Output, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blur',
  imports: [ ReactiveFormsModule, FormsModule ],
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
      this.blurRadiusEmitter.emit(this.radiusControl.value)
    })
  }

}
