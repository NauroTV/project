import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { map, shareReplay, combineLatest } from 'rxjs';

@Component({
  selector: 'app-bild-edit',
  imports: [MatIconModule, CommonModule, ],
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

  size$ =  combineLatest([this.isHandset$, this.isTablet$, this.isWeb$]).pipe(map(([isHandset, isTablet, isWeb]) => {
    if (isHandset === true && isTablet === false && isWeb === false) return '--handset'
    else if (isHandset === false && isTablet === true && isWeb === false) return '--tablet'
    else if (isHandset === false && isTablet === false && isWeb === true) return '--web'
    else return ''
  }))

  size = toSignal(this.size$)

  input = viewChild<ElementRef<HTMLInputElement>>("input")
  canvas = viewChild<ElementRef<HTMLCanvasElement>>("canvas")
  file = signal<File | undefined>(undefined)
  bitmap = signal<ImageBitmap | undefined>(undefined)



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
  onFileChanged(event: any) {
    const input = this.input()?.nativeElement
    const canvas = this.canvas()?.nativeElement

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
