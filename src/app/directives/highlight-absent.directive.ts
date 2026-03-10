import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightAbsent]',
  standalone: true
})
export class HighlightAbsentDirective implements OnChanges {
  @Input() appHighlightAbsent: 'Present' | 'Absent' = 'Present';

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    if (this.appHighlightAbsent === 'Absent') {
      this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', '#ffebee');
      return;
    }

    this.renderer.removeStyle(this.elementRef.nativeElement, 'backgroundColor');
  }
}
