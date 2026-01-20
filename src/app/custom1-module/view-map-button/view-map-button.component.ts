import { Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ViewMapComponent } from '../../view-map/view-map.component';

@Component({
  selector: 'view-map-button',
  templateUrl: './view-map-button.component.html',
  styleUrls: ['./view-map-button.component.scss']
})
export class ViewMapButtonComponent implements OnInit, OnChanges {
  @Input() parentCtrl: any;
  @ViewChild('viewMap') viewMap?: ViewMapComponent;

  constructor(private injector: Injector, private elementRef: ElementRef) {}

  ngOnInit() {
    if (!this.parentCtrl) {
      this.parentCtrl = this.injector.get('parentCtrl' as any, null);
    }

    if (!this.parentCtrl) {
      this.parentCtrl = (this.elementRef.nativeElement as any)?.parentCtrl ?? null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentCtrl']?.currentValue) {
      this.parentCtrl = changes['parentCtrl'].currentValue;
    }
  }

  openMap() {
    if (!this.parentCtrl) {
      this.parentCtrl = this.injector.get('parentCtrl' as any, null);
    }

    if (!this.parentCtrl) {
      this.parentCtrl = (this.elementRef.nativeElement as any)?.parentCtrl ?? null;
    }

    if (this.viewMap) {
      this.viewMap.parentCtrl = this.parentCtrl;
    }

    this.viewMap?.openFloorplan();
  }
}
