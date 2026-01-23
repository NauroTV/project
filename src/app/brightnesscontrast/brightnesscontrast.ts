import { Component, EventEmitter, Output, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brightnesscontrast',
  imports: [ ReactiveFormsModule, FormsModule ],
  templateUrl: './brightnesscontrast.html',
  styleUrl: './brightnesscontrast.css',
})
export class Brightnesscontrast {

brightnessControl = new FormControl<number>(0, {nonNullable:true})
contrastControl = new FormControl<number>(1, {nonNullable:true})
contrastControlv = this.contrastControl.value
brightnessControlv = this.brightnessControl.value
// function isnull(sliderControl1 = new FormControl<number | null>(1)): sliderControl1 is null {
//    return (<Fish>pet).swim !== undefined;
// }
 
@Output() brightnessEmitter: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();
@Output () contrastEmitter: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();
constructor()
{
  // this.brightnessControl.valueChanges.subscribe((value) => {
  //   this.brightnessControlv = this.brightnessControl.value
  // })
  // this.contrastControl.valueChanges.subscribe((value) => {
  //   this.contrastControlv = this.contrastControl.value
  // })
  this.brightnessControl.valueChanges.subscribe(() => {
    this.brightnessEmitter.emit(this.brightnessControl.value)
  })
  this.contrastControl.valueChanges.subscribe(() => {
    this.contrastEmitter.emit(this.contrastControl.value)
  })
}
}
