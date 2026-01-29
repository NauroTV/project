import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { map, shareReplay, combineLatest } from 'rxjs';
import { CdkAriaLive } from "../../../node_modules/@angular/cdk/types/_a11y-module-chunk";
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-bild-edit',
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, FormsModule, MatSliderModule, MatInputModule, MatButtonToggleModule, MatChipsModule],
  templateUrl: './bild-edit.html',
  styleUrl: './bild-edit.scss',
})
export class BildEdit {

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(

      map(result => result.matches),
      shareReplay()
    );
  isTablet$ = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(

      map(result => result.matches),
      shareReplay()
    );
  isWeb$ = this.breakpointObserver.observe(Breakpoints.Web)
    .pipe(

      map(result => result.matches),
      shareReplay()
    );

  size$ = combineLatest([this.isHandset$, this.isTablet$, this.isWeb$]).pipe(map(([isHandset, isTablet, isWeb]) => {
    if (isHandset === true && isTablet === false && isWeb === false) return '--handset'
    else if (isHandset === false && isTablet === true && isWeb === false) return '--tablet'
    else if (isHandset === false && isTablet === false && isWeb === true) return '--web'
    else return ''
  }))

  size = toSignal(this.size$)



  input = viewChild<ElementRef<HTMLInputElement>>("input")
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>("canvas")
  file = signal<File | undefined>(undefined)
  bitmap = signal<ImageBitmap | undefined>(undefined)
  ctx = this.canvasRef()?.nativeElement.getContext('2d')
  canvas = this.canvasRef()?.nativeElement

  color = new FormControl<string | CanvasGradient | CanvasPattern>("#ff0000", { nonNullable: true })
  strokeWidth = new FormControl<number>(5, { nonNullable: true })
  chipControl = new FormControl<string>("", { nonNullable: true })
  strokeWidthv: number = this.strokeWidth.value
  isDrawing: boolean = false
  counter = 0
  x = 0
  y = 0

  constructor() {
    this.strokeWidth.valueChanges.subscribe(() => {
      if (this.strokeWidth.value > 100) this.strokeWidthv = 100
    })
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }


  onMouseDown(event: MouseEvent) {

    this.counter++
    if (this.chipControl.value.includes("1")) {
      if (!this.canvas || !this.ctx) return;
      this.isDrawing = true
      this.ctx.beginPath()
      this.ctx.strokeStyle = `${this.color.value}`
      this.ctx.lineWidth = this.strokeWidth.value
      this.ctx.lineJoin = 'round'
      this.ctx.lineCap = 'round'
      this.ctx.moveTo(event.offsetX, event.offsetY)
      this.counter = 0
    }
    else if (this.chipControl.value.includes("2")) {
      if (!this.ctx) return;
      if (this.counter === 1) {
        this.x = event.offsetX
        this.y = event.offsetY
      }
      if (this.counter === 2) {
        this.ctx.fillStyle = `${this.color.value}`
        this.ctx.fillRect(this.x, this.y, -(this.x - event.offsetX), -(this.y - event.offsetY))
        this.counter = 0
      }
    }
    else if (this.chipControl.value.includes("3")) {
      if (!this.ctx) return;
      if (this.counter === 1) {
        this.x = event.offsetX
        this.y = event.offsetY
      }
      if (this.counter === 2) {
        this.ctx.strokeStyle = `${this.color.value}`
        this.ctx.lineWidth = this.strokeWidth.value
        this.ctx.strokeRect(this.x, this.y, -(this.x - event.offsetX), -(this.y - event.offsetY))
        this.counter = 0
      }
    }
    else if (this.chipControl.value.includes("4")) {
      if (!this.ctx) return;
      if (this.counter === 1) {
        this.x = event.offsetX
        this.y = event.offsetY
      }
      if (this.counter === 2) {
        this.ctx.beginPath()
        this.ctx.fillStyle = `${this.color.value}`
        this.ctx.lineWidth = this.strokeWidth.value
        const xMitte = (this.x + event.offsetX) / 2
        const yMitte = (this.y + event.offsetY) / 2
        this.ctx.ellipse(xMitte, yMitte, Math.abs(this.x - xMitte), Math.abs(this.y - yMitte), 0, 0, 2 * Math.PI)
        this.ctx.fill()
        this.ctx.closePath()
        this.counter = 0
      }
    }
    else if (this.chipControl.value.includes("5")) {
      if (!this.ctx) return;
      if (this.counter === 1) {
        this.x = event.offsetX
        this.y = event.offsetY
      }
      if (this.counter === 2) {
        this.ctx.beginPath()
        this.ctx.strokeStyle = `${this.color.value}`
        this.ctx.lineWidth = this.strokeWidth.value
        const xMitte = (this.x + event.offsetX) / 2
        const yMitte = (this.y + event.offsetY) / 2
        this.ctx.ellipse(xMitte, yMitte, Math.abs(this.x - xMitte), Math.abs(this.y - yMitte), 0, 0, 2 * Math.PI)
        this.ctx.stroke()
        this.ctx.closePath()
        this.counter = 0
      }
    }
    else return;
  }
  onMouseMove(event: MouseEvent) {
    if (this.chipControl.value.includes("1")) {
      if (!this.isDrawing || !this.ctx) return;
      this.ctx.lineTo(event.offsetX, event.offsetY)
      this.ctx.stroke()
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.chipControl.value.includes("1")) {
      if (!this.canvas || !this.ctx) return;
      this.isDrawing = false
      this.ctx.closePath()
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const canvas = this.canvasRef()?.nativeElement
    if (!event.dataTransfer?.files.length || !canvas) return;
    if (event.dataTransfer.files.length === 1) {
      const file = event.dataTransfer.files[0];
      this.file.set(file);
      this.drawImageToCanvas(file, canvas)

    }

  }

  onDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
  }


  drawImageToCanvas(file: File, canvas: HTMLCanvasElement) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      if (event.target && typeof event.target.result === 'string') {
        img.src = event.target.result;
      }
    }
    reader.readAsDataURL(file);
    if (!this.canvas) return;
    this.canvas.style = "z-index: 6;"
  }
  onFileChanged(event: any) {
    const input = this.input()?.nativeElement
    const canvas = this.canvasRef()?.nativeElement

    if (!input || !canvas)
      return;

    if (input.files?.length === 1) {
      const file = input.files[0]
      this.drawImageToCanvas(file, canvas)
      createImageBitmap(file).then((bitmap) => {
        this.bitmap.set(bitmap)
      })

      this.file.set(file)
    }
  }
}
