import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighLigth]'
})
export class HighLigthDirective {

  constructor(private el: ElementRef) {
    // this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @Input() appHighligth = '';

  @HostListener('mouseenter') onMouseEnter(){
    this.highligth(this.appHighligth || 'aquamarine');

  }

  @HostListener('mouseleave') onMouseLeave(){
    this.highligth('');
  }

  highligth(color: string){
    this.el.nativeElement.style.backgroundColor = color;
  }

}
