import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverZoom]'
})
export class HoverZoomDirective {
  private originalWidth!: string;
  private originalHeight!: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {

  }

  @HostListener('mouseenter')


  onMouseEnter() {
    this.originalWidth = this.elementRef.nativeElement.style.width;
    this.originalHeight = this.elementRef.nativeElement.style.height;
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', '50%');
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', '50%');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', this.originalWidth);
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.originalHeight);
  }
}
