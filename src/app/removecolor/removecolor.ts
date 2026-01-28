import { Component, EventEmitter, Output, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';


@Component({
  selector: 'app-removecolor',
  imports: [ ReactiveFormsModule, FormsModule, MatSliderModule, MatInputModule ],
  templateUrl: './removecolor.html',
  styleUrl: './removecolor.css',
})
export class Removecolor {

  colorControl = new FormControl<string>("", {nonNullable:true})
  
  @Output() colorEmitter: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();
  constructor()
  {
    this.colorControl.valueChanges.subscribe(() => {
      this.colorEmitter.emit(this.colorControl.value)
    })
  }

}
