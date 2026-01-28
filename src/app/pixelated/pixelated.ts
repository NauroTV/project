import { Component, EventEmitter, Output, output, signal} from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';


@Component({
  selector: 'app-pixelated',
  imports: [ ReactiveFormsModule, FormsModule, MatSliderModule, MatInputModule ],
  templateUrl: './pixelated.html',
  styleUrl: './pixelated.css',
})
export class Pixelated {

  radiusControl = new FormControl<number>(1, {nonNullable:true})
  radiusControlv = this.radiusControl.value

  @Output() pixelatedRadiusEmitter: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();
  
  constructor() 
  {
    this.radiusControl.valueChanges.subscribe(() => {
      if (this.radiusControl.value > 15) this.radiusControlv = 15
      this.pixelatedRadiusEmitter.emit(this.radiusControlv)
    })
  }

}
