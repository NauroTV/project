import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { Blur } from '../blur/blur';
import { Brightnesscontrast } from '../brightnesscontrast/brightnesscontrast';
import { Greyscale } from '../greyscale/greyscale';
import { Inverted } from '../inverted/inverted';
import { LayoutComponent } from '../layout/layout.component';
import { Pixelated } from '../pixelated/pixelated';
import { Removecolor } from '../removecolor/removecolor';
import { Sepia } from '../sepia/sepia';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { CdkObserveContent } from "@angular/cdk/observers";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, combineLatest, forkJoin, map, shareReplay, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-bild-filter',
  imports: [
    Blur,
    Brightnesscontrast,
    CommonModule,
    Greyscale,
    Inverted,
    Pixelated,
    Removecolor,
    Sepia,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './bild-filter.html',
  styleUrls: ['./bild-filter.scss','./bild-filter-BETTER.scss'],
})
export class BildFilter {

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

  size$ =  combineLatest([this.isHandset$, this.isTablet$, this.isWeb$]).pipe(map(([isHandset, isTablet, isWeb]) => {
    if (isHandset === true && isTablet === false && isWeb === false) return '--handset'
    else if (isHandset === false && isTablet === true && isWeb === false) return '--tablet'
    else if (isHandset === false && isTablet === false && isWeb === true) return '--web'
    else return ''
  }))

  size = toSignal(this.size$)
  

  protected readonly title = signal('project');
  percentage = viewChild<ElementRef<HTMLDivElement>>("percentage")
  input = viewChild<ElementRef<HTMLInputElement>>("input")
  canvas = viewChild<ElementRef<HTMLCanvasElement>>("canvas")
  file = signal<File | undefined>(undefined)
  fileProgress = signal<number>(0)
  filter = signal("0")
  editedCanvas = viewChild<ElementRef<HTMLCanvasElement>>("bitmap")
  bitmap = signal<ImageBitmap | undefined>(undefined)
  progressionBarRef = viewChild<ElementRef<HTMLDivElement>>("percentage")
  dragDiv = viewChild<ElementRef<HTMLDivElement>>("fileDropZone")
  showCanvas = viewChild<ElementRef<HTMLCanvasElement>>("showCanvas")


  overrideCheckbox = new FormControl<boolean>(false, { nonNullable: true })
  chipControl = new FormControl<string[]>([])
  selected: { [id: number]: boolean } = {};
  chipsControl = new FormControl()
  Checkbox = new FormControl<boolean>(false, { nonNullable: true })
  universalCounterSpeed: number = 0
  brightness: number = 0
  contrast: number = 1
  gsFactor: number = 1
  blurRadius: number = 1
  pixelateRadius: number = 1
  removeColor: string = ""
  isCanvasDrawn = false;
  dragNdrop = document.getElementById("fileDropZone")
  overrideEnabled: number = 0
  // i = 0
  // this.dragNdrop.classList.remove("invisible")

  constructor() {
    this.Checkbox.valueChanges.subscribe(() => {
      if (this.Checkbox.value === false) this.universalCounterSpeed = 0
      if (this.Checkbox.value === true) this.universalCounterSpeed = 1
    })
    this.overrideCheckbox.valueChanges.subscribe(() => {
      if (this.overrideCheckbox.value === true) {
        this.overrideEnabled = 1

      }
      if (this.overrideCheckbox.value === false) this.overrideEnabled = 0
    })
    this.chipControl.valueChanges.subscribe((selected: string[] | null) => {
      if (selected && selected.length > 1) {
        this.overrideCheckbox.setValue(true);
        this.overrideCheckbox.disable({ emitEvent: false });
        const originalCanvas = this.canvas()?.nativeElement
        const canvas = this.editedCanvas()?.nativeElement
        const showCanvas = this.showCanvas()?.nativeElement
        if (!canvas || !originalCanvas) return;
        canvas.height = originalCanvas.height
        canvas.width = originalCanvas.width
        if (this.file() === undefined) return;
        this.universalCounterSpeed = 1
        this.filterNone(canvas, originalCanvas)
        this.universalCounterSpeed = 0
      } else {
        this.overrideCheckbox.enable({ emitEvent: false });
        this.overrideCheckbox.setValue(false);
      }
    })

  }

  onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const canvas = this.canvas()?.nativeElement
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
    const editedCanvas = this.editedCanvas()?.nativeElement
    const dragDrop = this.dragDiv()?.nativeElement
    if (!dragDrop) return;
    dragDrop.style = "opacity: 0;"
    if (!editedCanvas) return;
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
  }

  onDownloadSubmit(event: any) {
    if (this.isCanvasDrawn === false) return;
    else {
      const canvas = this.editedCanvas()?.nativeElement
      if (!canvas) return;
      this.getImageFromCanvas(canvas)
    }
  }

  getImageFromCanvas(canvas: HTMLCanvasElement) {
    const img = canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "output.png"
      a.click();

      URL.revokeObjectURL(url)
    }, "image/png")

  }


  onSubmit(event: any) {
    this.fileProgress.set(0)
    const dragndrop = this.dragDiv()?.nativeElement
    const input = this.input()?.nativeElement
    const originalCanvas = this.canvas()?.nativeElement
    const editedCanvas = this.editedCanvas()?.nativeElement
    const showCanvas = this.showCanvas()?.nativeElement
    const file = this.file

    if (!input || !originalCanvas || !editedCanvas || !dragndrop || this.file() === undefined)
      return;
    if (this.overrideEnabled === 0) {
      editedCanvas.height = originalCanvas.height
      editedCanvas.width = originalCanvas.width
    }
    this.drawCanvasToCanvasFilter(editedCanvas, originalCanvas);

  }


  onFilterSelected(filter: any) {
    this.filter.set(filter.value)

  }


  onFileChanged(event: any) {
    const input = this.input()?.nativeElement
    const canvas = this.canvas()?.nativeElement
    const canvas1 = this.editedCanvas()?.nativeElement

    if (!input || !canvas || !canvas1)
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


  getFactorFromGreyscale(event: any) {
    if (!event) return;
    this.gsFactor = event
  }

  getBrightnessFromBC(event: any) {
    if (!event) return;
    this.brightness = event
  }

  getContrastFromBC(event: any) {
    if (!event) return;
    this.contrast = event
  }

  getRadiusFromBlur(event: any) {
    if (!event) return;
    this.blurRadius = event
  }

  getRadiusFromPixelate(event: any) {
    if (!event) return;
    this.pixelateRadius = event
  }

  getColorFromRC(event: any) {
    if (!event) return;
    this.removeColor = event
  }


  async loadingInvisible() {
    // const length = this.chipControl.value?.length
    // if (!length) return;
    // if (this.i < length) this.i++
    // else {
    const progress = this.percentage()?.nativeElement
    if (!progress) return;
    progress.style = "opacity: 0; transition: opacity 1.5s linear"
    await new Promise(resolve => setTimeout(resolve, 3000))
    this.fileProgress.set(0)
    // this.i = 0
    // }
  }
  async loadingVisible() {
    const progress = this.percentage()?.nativeElement
    if (!progress) return;
    progress.style = "opacity: 1; transition: opacity 0.5s linear"
    await new Promise(resolve => setTimeout(resolve, 3000))
    this.fileProgress.set(0)
  }


  drawCanvasToCanvas(editableCanvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = editableCanvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    const imageData = cty.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    ctx.scale((editableCanvas.width * editableCanvas.height) / (originalCanvas.width * originalCanvas.height), (editableCanvas.width * editableCanvas.height) / (originalCanvas.width * originalCanvas.height))
    ctx.drawImage(originalCanvas, 0, 0)
  }

  async drawCanvasToCanvasFilter(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    // canvas.width = originalCanvas.width;
    // canvas.height = originalCanvas.height;
    this.isCanvasDrawn = true
    if (!this.chipControl.value || this.chipControl.value.includes('0')) this.filterNone(canvas, originalCanvas)
    else {
      if (this.chipControl.value.includes("1")) {
        this.filterGreyscale(canvas, originalCanvas)
        await new Promise(resolve => setTimeout(resolve, (canvas.height * canvas.width) / 75))
      }
      if (this.chipControl.value.includes("2")) {
        this.filterInvert(canvas, originalCanvas)
        await new Promise(resolve => setTimeout(resolve, (canvas.height * canvas.width) / 75))
      }
      if (this.chipControl.value.includes("3")) {
        this.filterSepia(canvas, originalCanvas)
        await new Promise(resolve => setTimeout(resolve, (canvas.height * canvas.width) / 75))
      }
      if (this.chipControl.value.includes("4")) {
        this.filterRemoveColor(canvas, originalCanvas)
        await new Promise(resolve => setTimeout(resolve, (canvas.height * canvas.width) / 75))
      }
      if (this.chipControl.value.includes("5")) {
        this.filterBrightnessContrast(canvas, originalCanvas)

        await new Promise(resolve => setTimeout(resolve, (canvas.height * canvas.width) / 75))
      }
      if (this.chipControl.value.includes("6")) {
        this.filterPixelate(canvas, originalCanvas)
        await new Promise(resolve => setTimeout(resolve, (canvas.height * canvas.width) / 75))
      }
      if (this.chipControl.value.includes("7")) {
        this.filterBlur(canvas, originalCanvas)
        await new Promise(resolve => setTimeout(resolve, (canvas.height * canvas.width) / 75))
      }
      else return;
    }
  }



  async filterNone(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    // canvas.height = originalCanvas.height
    // canvas.width = originalCanvas.width
    this.loadingVisible()
    let total = canvas.width * canvas.height
    let pxCounter = 0
    this.fileProgress.set(0)
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
        if (this.overrideEnabled === 0) {
          const ImageData = cty.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = data[0]
          let G = data[1]
          let B = data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        if (this.overrideEnabled === 1) {
          const ImageData = cty.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = data[0]
          let G = data[1]
          let B = data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 100))
          // this.drawCanvasToCanvas(showCanvas, canvas)
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 100))
    this.loadingInvisible()
  }


  async filterGreyscale(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    this.loadingVisible()
    let total = canvas.width * canvas.height
    let pxCounter = 0
    this.fileProgress.set(0)
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
        if (this.overrideEnabled === 0) {
          const ImageData = cty.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = data[0]
          let G = data[1]
          let B = data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          let average = (R + G + B) / 3 * this.gsFactor
          if (average > 255) average = 255
          ctx.fillStyle = `rgb(${average}, ${average}, ${average})`
          ctx.fillRect(x, y, 1, 1)
        }
        if (this.overrideEnabled === 1) {
          const ImageData = ctx.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = data[0]
          let G = data[1]
          let B = data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          let average = (R + G + B) / 3 * this.gsFactor
          if (average > 255) average = 255
          ctx.fillStyle = `rgb(${average}, ${average}, ${average})`
          ctx.fillRect(x, y, 1, 1)
        }
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 100))
          // this.drawCanvasToCanvas(showCanvas, canvas)
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 100))
    this.loadingInvisible()
  }


  async filterInvert(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    this.loadingVisible()
    let total = canvas.width * canvas.height
    let pxCounter = 0
    this.fileProgress.set(0)
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
        if (this.overrideEnabled === 0) {
          const ImageData = cty.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = 255 - data[0]
          let G = 255 - data[1]
          let B = 255 - data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        if (this.overrideEnabled === 1) {
          const ImageData = ctx.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = 255 - data[0]
          let G = 255 - data[1]
          let B = 255 - data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 100))
          // this.drawCanvasToCanvas(showCanvas, canvas)
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 100))
    this.loadingInvisible()
  }


  async filterSepia(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    this.loadingVisible()
    let total = canvas.width * canvas.height
    let pxCounter = 0
    this.fileProgress.set(0)
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
        if (this.overrideEnabled === 0) {
          const ImageData = cty.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = Math.round(0.393 * data[0] + 0.796 * data[1] + 0.189 * data[2])
          let G = Math.round(0.349 * data[0] + 0.686 * data[1] + 0.168 * data[2])
          let B = Math.round(0.272 * data[0] + 0.534 * data[1] + 0.131 * data[2])
          if (R === undefined || G === undefined || B === undefined) return;
          if (R > 255) R = 255
          if (G > 255) G = 255
          if (B > 255) B = 255
          ctx.fillStyle = `rgb(${R},${G},${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        if (this.overrideEnabled === 1) {
          const ImageData = ctx.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = Math.round(0.393 * data[0] + 0.796 * data[1] + 0.189 * data[2])
          let G = Math.round(0.349 * data[0] + 0.686 * data[1] + 0.168 * data[2])
          let B = Math.round(0.272 * data[0] + 0.534 * data[1] + 0.131 * data[2])
          if (R === undefined || G === undefined || B === undefined) return;
          if (R > 255) R = 255
          if (G > 255) G = 255
          if (B > 255) B = 255
          ctx.fillStyle = `rgb(${R},${G},${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 100))
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 100))
    this.loadingInvisible()
  }


  async filterRemoveColor(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    this.loadingVisible()
    let total = canvas.width * canvas.height
    let pxCounter = 0
    this.fileProgress.set(0)
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
        if (this.overrideEnabled === 0) {
          const ImageData = cty.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = data[0]
          let G = data[1]
          let B = data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          if (this.removeColor === "R" || this.removeColor === "r") ctx.fillStyle = `rgb(0, ${G}, ${B})`
          else if (this.removeColor === "G" || this.removeColor === "g") ctx.fillStyle = `rgb(${R}, 0, ${B})`
          else if (this.removeColor === "B" || this.removeColor === "b") ctx.fillStyle = `rgb(${R}, ${G}, 0)`
          else ctx.fillStyle = `rgb(0, 0, 0)`
          ctx.fillRect(x, y, 1, 1)
        }
        if (this.overrideEnabled === 1) {
          const ImageData = ctx.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = data[0]
          let G = data[1]
          let B = data[2]
          if (R === undefined || G === undefined || B === undefined) return;
          if (this.removeColor === "R" || this.removeColor === "r") ctx.fillStyle = `rgb(0, ${G}, ${B})`
          else if (this.removeColor === "G" || this.removeColor === "g") ctx.fillStyle = `rgb(${R}, 0, ${B})`
          else if (this.removeColor === "B" || this.removeColor === "b") ctx.fillStyle = `rgb(${R}, ${G}, 0)`
          else ctx.fillStyle = `rgb(0, 0, 0)`
          ctx.fillRect(x, y, 1, 1)
        }
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 100))
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 100))
    this.loadingInvisible()
  }

  async filterBlur(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    this.loadingVisible()
    let total = ((canvas.width - this.blurRadius - 1) - this.blurRadius + 1) * ((canvas.height - this.blurRadius - 1) - this.blurRadius + 1)
    let pxCounter = 0
    let resettableCounter = 0
    let R = 0
    let G = 0
    let B = 0
    const visited = new Uint8Array(canvas.width * canvas.height)
    this.fileProgress.set(0)
    for (let x = this.blurRadius; x < originalCanvas.width - this.blurRadius; x++) {
      for (let y = this.blurRadius; y < originalCanvas.height - this.blurRadius; y++) {
        for (let xMaske = x - this.blurRadius; xMaske <= x + this.blurRadius; xMaske++) {
          for (let yMaske = y - this.blurRadius; yMaske <= y + this.blurRadius; yMaske++) {
            if (this.overrideEnabled === 0) {
              const ImageData = cty.getImageData(xMaske, yMaske, 1, 1)
              const data = ImageData.data
              R += data[0]
              G += data[1]
              B += data[2]
              resettableCounter++
              if (xMaske === x + this.blurRadius && yMaske === y + this.blurRadius) {
                R /= resettableCounter
                G /= resettableCounter
                B /= resettableCounter
                for (let xm = -this.blurRadius; xm <= this.blurRadius; xm++) {
                  for (let ym = -this.blurRadius; ym <= this.blurRadius; ym++) {
                    if (x + xm < 0 || y + ym < 0 || x + xm >= canvas.width || y + ym >= canvas.height) continue;
                    const index = (y + ym) * canvas.width + x + xm;
                    if (visited[index] === 0) {
                      visited[index] = 1;
                      pxCounter++
                      if (pxCounter % 500 === 0) {
                        if (this.universalCounterSpeed === 0)
                          await new Promise(resolve => setTimeout(resolve, 0));
                        this.fileProgress.update(() => Math.round(pxCounter / total * 100))

                      }
                    }

                    ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
                    ctx.fillRect(x + xm, y + ym, 1, 1)
                  }
                }
                R = 0; G = 0; B = 0; resettableCounter = 0;
              }
            }
            if (this.overrideEnabled === 1) {
              const ImageData = ctx.getImageData(xMaske, yMaske, 1, 1)
              const data = ImageData.data
              R += data[0]
              G += data[1]
              B += data[2]
              resettableCounter++
              if (xMaske === x + this.blurRadius && yMaske === y + this.blurRadius) {
                R /= resettableCounter
                G /= resettableCounter
                B /= resettableCounter
                for (let xm = -this.blurRadius; xm <= this.blurRadius; xm++) {
                  for (let ym = -this.blurRadius; ym <= this.blurRadius; ym++) {
                    if (x + xm < 0 || y + ym < 0 || x + xm >= canvas.width || y + ym >= canvas.height) continue;
                    const index = (y + ym) * canvas.width + x + xm;
                    if (visited[index] === 0) {
                      visited[index] = 1;
                      pxCounter++
                      if (pxCounter % 500 === 0) {
                        if (this.universalCounterSpeed === 0)
                          await new Promise(resolve => setTimeout(resolve, 0));
                        this.fileProgress.update(() => Math.round(pxCounter / total * 100))

                      }
                    }

                    ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
                    ctx.fillRect(x + xm, y + ym, 1, 1)
                  }
                }
                R = 0; G = 0; B = 0; resettableCounter = 0;
              }
            }
          }
        }
      }
    }
    if (this.fileProgress() > 100) this.fileProgress.set(100)
    this.loadingInvisible()
  }


  // this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
  // let progressBar = this.progressionBarRef()?.nativeElement
  // if (!progressBar) return;
  // progressBar.style.width = this.fileProgress() + "%"

  async filterPixelate(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    this.loadingVisible()
    let total = ((canvas.width - this.blurRadius - 1) - this.blurRadius + 1) * ((canvas.height - this.blurRadius - 1) - this.blurRadius + 1)
    let pxCounter = 0
    let resettableCounter = 0
    let R = 0
    let G = 0
    let B = 0
    const visited = new Uint8Array(canvas.width * canvas.height)
    this.fileProgress.set(0)
    for (let x = 0; x < originalCanvas.width; x += this.pixelateRadius * 2) {
      for (let y = 0; y < originalCanvas.height; y += this.pixelateRadius * 2) {
        for (let xMaske = x - this.pixelateRadius; xMaske <= x + this.pixelateRadius; xMaske++) {
          for (let yMaske = y - this.pixelateRadius; yMaske <= y + this.pixelateRadius; yMaske++) {
            if (this.overrideEnabled === 0) {
              const ImageData = cty.getImageData(x, y, 1, 1)
              const data = ImageData.data
              R += data[0]
              G += data[1]
              B += data[2]
              resettableCounter++
              if (xMaske === x + this.pixelateRadius && yMaske === y + this.pixelateRadius) {
                R /= resettableCounter
                G /= resettableCounter
                B /= resettableCounter
                for (let xm = -this.pixelateRadius; xm <= this.pixelateRadius; xm++) {
                  for (let ym = -this.pixelateRadius; ym <= this.pixelateRadius; ym++) {
                    if (x + xm < 0 || y + ym < 0 || x + xm >= canvas.width || y + ym >= canvas.height) continue;
                    const index = (y + ym) * canvas.width + x + xm;
                    if (visited[index] === 0) {
                      visited[index] = 1;
                      pxCounter++
                      if (pxCounter % 500 === 0) {
                        if (this.universalCounterSpeed === 0)
                          await new Promise(resolve => setTimeout(resolve, 0));
                        this.fileProgress.update(() => Math.round(pxCounter / total * 100))
                      }
                    }

                    ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
                    ctx.fillRect(x + xm, y + ym, 1, 1)
                  }
                }
              }
              R = 0; G = 0; B = 0; resettableCounter = 0;
            }
            if (this.overrideEnabled === 1) {
              const ImageData = ctx.getImageData(x, y, 1, 1)
              const data = ImageData.data
              R += data[0]
              G += data[1]
              B += data[2]
              resettableCounter++
              if (xMaske === x + this.pixelateRadius && yMaske === y + this.pixelateRadius) {
                R /= resettableCounter
                G /= resettableCounter
                B /= resettableCounter
                for (let xm = -this.pixelateRadius; xm <= this.pixelateRadius; xm++) {
                  for (let ym = -this.pixelateRadius; ym <= this.pixelateRadius; ym++) {
                    if (x + xm < 0 || y + ym < 0 || x + xm >= canvas.width || y + ym >= canvas.height) continue;
                    const index = (y + ym) * canvas.width + x + xm;
                    if (visited[index] === 0) {
                      visited[index] = 1;
                      pxCounter++
                      if (pxCounter % 500 === 0) {
                        if (this.universalCounterSpeed === 0)
                          await new Promise(resolve => setTimeout(resolve, 0));
                        this.fileProgress.update(() => Math.round(pxCounter / total * 100))
                      }
                    }

                    ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
                    ctx.fillRect(x + xm, y + ym, 1, 1)
                  }
                }
              }
              R = 0; G = 0; B = 0; resettableCounter = 0;
            }
          }
        }
      }
    }
    if (this.fileProgress() > 100) this.fileProgress.set(100)
    this.loadingInvisible()
  }



  async filterBrightnessContrast(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    const cty = originalCanvas.getContext('2d')
    if (!ctx || !cty) return;
    this.loadingVisible()
    let total = canvas.width * canvas.height
    let pxCounter = 0
    this.fileProgress.set(0)
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
        if (this.overrideEnabled === 0) {
          const ImageData = cty.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = (data[0] - 128) * this.contrast + 128
          R += this.brightness
          let G = (data[1] - 128) * this.contrast + 128
          G += this.brightness
          let B = (data[2] - 128) * this.contrast + 128
          B += this.brightness
          if (R === undefined || G === undefined || B === undefined) return;
          ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        if (this.overrideEnabled === 1) {
          const ImageData = ctx.getImageData(x, y, 1, 1)
          const data = ImageData.data
          let R = (data[0] - 128) * this.contrast + 128
          R += this.brightness
          let G = (data[1] - 128) * this.contrast + 128
          G += this.brightness
          let B = (data[2] - 128) * this.contrast + 128
          B += this.brightness
          if (R === undefined || G === undefined || B === undefined) return;
          ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
          ctx.fillRect(x, y, 1, 1)
        }
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 100))
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 100))
    this.loadingInvisible()
  }
}
