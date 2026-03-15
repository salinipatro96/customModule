import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, Injector, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-search-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-error-message.component.html',
  styleUrl: './search-error-message.component.scss'
})
export class SearchErrorMessageComponent implements OnInit {
  @Input() parentCtrl: any;

  constructor(
    private injector: Injector,
    private elementRef: ElementRef,
    @Optional() @Inject('parentCtrl') private injectedParentCtrl: any
  ) {}

  ngOnInit(): void {
    this.parentCtrl =
      this.parentCtrl ||
      this.injectedParentCtrl ||
      this.injector.get('parentCtrl' as any, null) ||
      (this.elementRef.nativeElement as any)?.parentCtrl ||
      null;

    this.hideNativeSearchErrorBlock();
  }

  private hideNativeSearchErrorBlock(): void {
    const host = this.elementRef.nativeElement as HTMLElement;
    const wrapper = host.closest('ng-component');
    const nativeBlock = wrapper?.previousElementSibling as HTMLElement | null;

    if (nativeBlock?.tagName.toLowerCase().includes('search-error')) {
      nativeBlock.style.display = 'none';
    }
  }
}
