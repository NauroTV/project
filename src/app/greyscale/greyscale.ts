import { Component, EventEmitter, Output, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-greyscale',
  imports: [ ReactiveFormsModule, FormsModule, MatSliderModule, MatInputModule ],
  templateUrl: './greyscale.html',
  styleUrl: './greyscale.css',
})
export class Greyscale {

  protected readonly title = signal('project');
  setvalue:number = 1
  sliderControl = new FormControl<number>(this.setvalue, {nonNullable:true})
  value = signal<Number>(0)
  text:any = 1
    submit(event: any)
  {
    this.sliderControlv = event
  }
  sliderControlv:any = this.sliderControl.value
  sliderv:any = this.sliderControlv
    

  @Output() brightnessfactorEmitter: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();
  constructor() {
   // this.sliderControl.valueChanges.subscribe((value) => {this.sliderv = value / 10})
    this.sliderControl.valueChanges.subscribe(() => {
      if (this.sliderControl.value > 10) this.sliderControlv = 10
      this.brightnessfactorEmitter.emit(this.sliderControl.value);
    })
   }

  // ngOnInit() {
  //   this.brightnessfactorEmitter.emit(this.sliderControl.value);
  // }
} 
