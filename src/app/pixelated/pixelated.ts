import { Component, EventEmitter, Output, output, signal} from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pixelated',
  imports: [ ReactiveFormsModule, FormsModule ],
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
      this.pixelatedRadiusEmitter.emit(this.radiusControl.value)
    })
  }

}
