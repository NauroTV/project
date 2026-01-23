import { Component, EventEmitter, Output, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-removecolor',
  imports: [ ReactiveFormsModule, FormsModule ],
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
