import { Component, ElementRef, signal, viewChild, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Blur } from './blur/blur';
import { Brightnesscontrast } from './brightnesscontrast/brightnesscontrast';
import { Greyscale } from './greyscale/greyscale';
import { Inverted } from './inverted/inverted';
import { Pixelated } from './pixelated/pixelated';
import { Removecolor } from './removecolor/removecolor';
import { Sepia } from './sepia/sepia';
import { NonNullableFormBuilder } from '@angular/forms';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { count } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Blur, Brightnesscontrast, Greyscale, Inverted, Pixelated, Removecolor, Sepia, ReactiveFormsModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('project');
  input = viewChild<ElementRef<HTMLInputElement>>("input")
  canvas = viewChild<ElementRef<HTMLCanvasElement>>("canvas")
  file = signal<File | undefined>(undefined)
  fileProgress = signal<number>(0)
  filter = signal("0")
  editedCanvas = viewChild<ElementRef<HTMLCanvasElement>>("bitmap")
  bitmap = signal<ImageBitmap | undefined>(undefined)
  progressionBarRef = viewChild<ElementRef<HTMLDivElement>>("percentage")


  Checkbox = new FormControl<boolean>(false, { nonNullable: true })
  universalCounterSpeed: number = 0
  brightness: number = 0
  contrast: number = 1
  gsFactor: number = 1
  blurRadius: number = 1
  pixelateRadius: number = 1
  removeColor: string = ""


  constructor() {
    this.Checkbox.valueChanges.subscribe(() => {
      if (this.Checkbox.value === false) this.universalCounterSpeed = 0
      if (this.Checkbox.value === true) this.universalCounterSpeed = 1
    })
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
  }


  onSubmit(event: any) {
    const input = this.input()?.nativeElement
    const originalCanvas = this.canvas()?.nativeElement
    const editedCanvas = this.editedCanvas()?.nativeElement
    if (!input || !originalCanvas || !editedCanvas)
      return;

    if (input.files?.length === 1) {
      const file = input.files[0]
      this.drawCanvasToCanvas(editedCanvas, originalCanvas)

    }
  }


  onFilterSelected(filter: any) {
    this.filter.set(filter.target.value)
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


  drawCanvasToCanvas(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;
    if (this.filter() === "0") return;
    else if (this.filter() === "1") {
      this.filterGreyscale(canvas, originalCanvas)
    }
    else if (this.filter() === "2") {
      this.filterInvert(canvas, originalCanvas)
    }
    else if (this.filter() === "3") {
      this.filterSepia(canvas, originalCanvas)
    }
    else if (this.filter() === "4") {
      this.filterRemoveColor(canvas, originalCanvas)
    }
    else if (this.filter() === "5") {
      this.filterBlur(canvas, originalCanvas)
    }
    else if (this.filter() === "6") {
      this.filterPixelate(canvas, originalCanvas)
    }
    else if (this.filter() === "7") {
      this.filterBrightnessContrast(canvas, originalCanvas)
    }
    else return;
  };


  async filterGreyscale(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const cty = originalCanvas.getContext('2d')
    if (!cty) return;
    let total = canvas.width * canvas.height
    let pxCounter = 0
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
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
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
          let progressBar = this.progressionBarRef()?.nativeElement
          if (!progressBar) return;
          progressBar.style.width = this.fileProgress() + "%"
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
    let progressBar = this.progressionBarRef()?.nativeElement
    if (!progressBar) return;
    progressBar.style.width = this.fileProgress() + "%"
  }


  async filterInvert(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const cty = originalCanvas.getContext('2d')
    if (!cty) return;
    let total = canvas.width * canvas.height
    let pxCounter = 0
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
        const ImageData = cty.getImageData(x, y, 1, 1)
        const data = ImageData.data
        let R = 255 - data[0]
        let G = 255 - data[1]
        let B = 255 - data[2]
        if (R === undefined || G === undefined || B === undefined) return;
        ctx.fillStyle = `rgb(${R}, ${G}, ${B})`
        ctx.fillRect(x, y, 1, 1)
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
          let progressBar = this.progressionBarRef()?.nativeElement
          if (!progressBar) return;
          progressBar.style.width = this.fileProgress() + "%"
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
    let progressBar = this.progressionBarRef()?.nativeElement
    if (!progressBar) return;
    progressBar.style.width = this.fileProgress() + "%"
  }


  async filterSepia(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const cty = originalCanvas.getContext('2d')
    if (!cty) return;
    let total = canvas.width * canvas.height
    let pxCounter = 0
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
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
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
          let progressBar = this.progressionBarRef()?.nativeElement
          if (!progressBar) return;
          progressBar.style.width = this.fileProgress() + "%"
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
    let progressBar = this.progressionBarRef()?.nativeElement
    if (!progressBar) return;
    progressBar.style.width = this.fileProgress() + "%"
  }


  async filterRemoveColor(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const cty = originalCanvas.getContext('2d')
    if (!cty) return;
    let total = canvas.width * canvas.height
    let pxCounter = 0
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
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
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
          let progressBar = this.progressionBarRef()?.nativeElement
          if (!progressBar) return;
          progressBar.style.width = this.fileProgress() + "%"
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
    let progressBar = this.progressionBarRef()?.nativeElement
    if (!progressBar) return;
    progressBar.style.width = this.fileProgress() + "%"
  }

  async filterBlur(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const cty = originalCanvas.getContext('2d')
    if (!cty) return;
    let total = ((canvas.width - this.blurRadius - 1) - this.blurRadius + 1) * ((canvas.height - this.blurRadius - 1) - this.blurRadius + 1)
    let pxCounter = 0
    let resettableCounter = 0
    let R = 0
    let G = 0
    let B = 0
    const visited = new Uint8Array(canvas.width * canvas.height)
    for (let x = this.blurRadius; x < originalCanvas.width - this.blurRadius; x++) {
      for (let y = this.blurRadius; y < originalCanvas.height - this.blurRadius; y++) {
        for (let xMaske = x - this.blurRadius; xMaske <= x + this.blurRadius; xMaske++) {
          for (let yMaske = y - this.blurRadius; yMaske <= y + this.blurRadius; yMaske++) {
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
                      this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
                      let progressBar = this.progressionBarRef()?.nativeElement
                      if (!progressBar) return;
                      if (this.fileProgress() > 100) this.fileProgress.set(100)
                      progressBar.style.width = this.fileProgress() + "%"
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
    console.log(pxCounter)
  }

  // this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
  // let progressBar = this.progressionBarRef()?.nativeElement
  // if (!progressBar) return;
  // progressBar.style.width = this.fileProgress() + "%"

  async filterPixelate(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const cty = originalCanvas.getContext('2d')
    if (!cty) return;
    let total = ((canvas.width - this.blurRadius - 1) - this.blurRadius + 1) * ((canvas.height - this.blurRadius - 1) - this.blurRadius + 1)
    let pxCounter = 0
    let resettableCounter = 0
    let R = 0
    let G = 0
    let B = 0
    const visited = new Uint8Array(canvas.width * canvas.height)
    for (let x = 0; x < originalCanvas.width; x += this.pixelateRadius * 2) {
      for (let y = 0; y < originalCanvas.height; y += this.pixelateRadius * 2) {
        for (let xMaske = x - this.pixelateRadius; xMaske <= x + this.pixelateRadius; xMaske++) {
          for (let yMaske = y - this.pixelateRadius; yMaske <= y + this.pixelateRadius; yMaske++) {
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
                      this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
                      let progressBar = this.progressionBarRef()?.nativeElement
                      if (!progressBar) return;
                      if (this.fileProgress() > 100) this.fileProgress.set(100)
                      progressBar.style.width = this.fileProgress() + "%"
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
    console.log(pxCounter)
  }



  async filterBrightnessContrast(canvas: HTMLCanvasElement, originalCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    const cty = originalCanvas.getContext('2d')
    if (!cty) return;
    let total = canvas.width * canvas.height
    let pxCounter = 0
    for (let x = 0; x < originalCanvas.width; x++) {
      for (let y = 0; y < originalCanvas.height; y++) {
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
        pxCounter++
        if (pxCounter % 500 === 0) {
          if (this.universalCounterSpeed === 0)
            await new Promise(resolve => setTimeout(resolve, 0));
          this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
          let progressBar = this.progressionBarRef()?.nativeElement
          if (!progressBar) return;
          progressBar.style.width = this.fileProgress() + "%"
        }
      }
    }
    this.fileProgress.update(() => Math.round(pxCounter / total * 10000) / 100)
    let progressBar = this.progressionBarRef()?.nativeElement
    if (!progressBar) return;
    progressBar.style.width = this.fileProgress() + "%"
  }
}