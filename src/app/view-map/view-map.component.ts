import { Component, ElementRef, HostListener, Input, Injector, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-view-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.scss']
})
export class ViewMapComponent implements OnInit, OnChanges {
  @Input() parentCtrl: any;
  @Input() showButton = true;
  @ViewChild('modalRoot') modalRoot?: ElementRef<HTMLDivElement>;

  private isModalInBody = false;

  showModal = false;
  isGuideView = false;

  floorplanImages: string[] = [];
  currentImageIndex = 0;

  zoomLevel = 1;
  minZoom = 0.8;
  maxZoom = 3;

  dragging = false;
  imgPosition: Point = { x: 0, y: 0 };
  startPosition: Point = { x: 0, y: 0 };

  readonly guideImageSrc =
    '/discovery/custom/01MA_UMB-01MA_UMB/img/call_number_guide.png';

  constructor(private injector: Injector, private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (!this.parentCtrl) {
      this.parentCtrl = this.injector.get<any>('parentCtrl' as any, null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentCtrl']?.currentValue) {
      this.parentCtrl = changes['parentCtrl'].currentValue;
    }
  }

  /* ---------------- VISIBILITY ---------------- */

  shouldShowMap(): boolean {
    const section =
      this.parentCtrl?.item?.subLocation ||
      this.parentCtrl?.availability?.subLocation ||
      this.parentCtrl?.currLoc?.location?.subLocation ||
      this.parentCtrl?.currLoc?.location?.collectionTranslation;

    return Boolean(this.parentCtrl);
  }

  /* ---------------- CLICK ---------------- */

  openFloorplan(): void {
    if (!this.parentCtrl) {
      this.parentCtrl = this.injector.get<any>('parentCtrl' as any, null);
    }

    const callNumber = this.getCallNumber();
    const section = this.getSection();

    this.floorplanImages = this.getFloorplanImages(callNumber, section);
    this.isGuideView = !this.floorplanImages.length;
    this.currentImageIndex = 0;

    this.zoomLevel = 1;
    this.imgPosition = { x: 0, y: 0 };
    this.showModal = true;
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.moveModalToBody(), 0);
  }

  closeFloorplan(): void {
    this.showModal = false;
    this.dragging = false;
    document.body.style.overflow = '';
    this.removeModalFromBody();
  }

  /* ---------------- IMAGE ---------------- */

  get activeImage(): string | null {
    if (this.isGuideView) return this.guideImageSrc;
    return this.floorplanImages[this.currentImageIndex] ?? null;
  }

  toggleView(): void {
    if (this.isGuideView) {
      // Switch from guide to first floor plan
      this.isGuideView = false;
      this.currentImageIndex = 0;
      return;
    }

    // Cycle through floor plans
    if (this.currentImageIndex < this.floorplanImages.length - 1) {
      this.currentImageIndex++;
    } else {
      // After last floor plan, switch to guide view
      this.isGuideView = true;
      this.currentImageIndex = 0;
    }
  }

  showGuide(): void {
    this.isGuideView = true;
    this.currentImageIndex = 0;
  }

  /* ---------------- ZOOM + DRAG ---------------- */

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 0.2, this.maxZoom);
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 0.2, this.minZoom);
    if (this.zoomLevel === 1) {
      this.imgPosition = { x: 0, y: 0 };
    }
  }

  startDrag(event: MouseEvent): void {
    if (this.zoomLevel <= 1) return;

    this.dragging = true;
    this.startPosition = {
      x: event.clientX - this.imgPosition.x,
      y: event.clientY - this.imgPosition.y
    };
  }

  onDrag(event: MouseEvent): void {
    if (!this.dragging) return;

    this.imgPosition = {
      x: event.clientX - this.startPosition.x,
      y: event.clientY - this.startPosition.y
    };
  }

  stopDrag(): void {
    this.dragging = false;
  }

  handleOverlayClick(): void {
    this.closeFloorplan();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showModal) {
      this.closeFloorplan();
    }
  }

  /* ---------------- DATA ---------------- */

  private getCallNumber(): string {
    return (
      this.parentCtrl?.item?.callNumber ||
      this.parentCtrl?.availability?.callNumber ||
      this.parentCtrl?.currLoc?.location?.callNumber ||
      ''
    );
  }

  private getSection(): string {
    const section =
      this.parentCtrl?.item?.subLocation ||
      this.parentCtrl?.availability?.subLocation ||
      this.parentCtrl?.currLoc?.location?.subLocation ||
      this.parentCtrl?.currLoc?.location?.collectionTranslation ||
      this.findSectionInObject(this.parentCtrl?.availability) ||
      this.findSectionInObject(this.parentCtrl?.item) ||
      this.findSectionFromDom() ||
      '';

    return section;
  }

  private getCallClass(callNumber: string): string {
    return callNumber.slice(0, 2).toUpperCase();
  }

  /* ---------------- FLOOR LOGIC ---------------- */

  private getFloorplanImages(callNumber: string, section: string): string[] {
    if (!section || section === 'No Data Found') {
      return [];
    }

    const normalizedSection = section.toLowerCase();
    const floorMatch = normalizedSection.match(/(\d+)(st|nd|rd|th)\s*floor/);
    const floorNumber = floorMatch ? Number(floorMatch[1]) : null;

    if (floorNumber === 4) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/4th_floor_call_numbers.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/4th_floor_map.png'
      ];
    }

    if (floorNumber === 5) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/5th_floor_call_numbers.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/5th_floor_map.png'
      ];
    }

    if (floorNumber === 6) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/6th_floor_call_numbers_bw.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/6th_floor_map.png'
      ];
    }

    if (floorNumber === 8) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/8th_floor_call_numbers_bw.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/8th_floor_map.png'
      ];
    }

    if (floorNumber === 9) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/9th_floor_call_numbers_bw.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/9th_floor_map.png'
      ];
    }

    if (
      normalizedSection.includes('4th floor') ||
      normalizedSection.includes('curriculum reference') ||
      (normalizedSection.includes('curriculum') && normalizedSection.includes('reference')) ||
      normalizedSection.includes('curriculum') ||
      normalizedSection.includes('reference')
    ) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/4th_floor_call_numbers.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/4th_floor_map.png'
      ];
    }

    if (normalizedSection.includes('wellness')) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/5th_floor_call_numbers.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/5th_floor_map.png'
      ];
    }

    if (normalizedSection.includes('periodicals')) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/6th_floor_call_numbers_bw.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/6th_floor_map.png'
      ];
    }

    if (normalizedSection.includes('oversize')) {
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/9th_floor_call_numbers_bw.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/9th_floor_map.png'
      ];
    }

    if (normalizedSection.includes('main stacks')) {
      const callClass = this.getCallClass(callNumber);

      // 8th floor
      if (/^(A|B|C|D|E|F|G|H|J|K|L|M|N|NC)$/.test(callClass)) {
        return [
          '/discovery/custom/01MA_UMB-01MA_UMB/img/8th_floor_call_numbers_bw.png',
          '/discovery/custom/01MA_UMB-01MA_UMB/img/8th_floor_map.png'
        ];
      }

      // 9th floor
      return [
        '/discovery/custom/01MA_UMB-01MA_UMB/img/9th_floor_call_numbers_bw.png',
        '/discovery/custom/01MA_UMB-01MA_UMB/img/9th_floor_map.png'
      ];
    }

    return [];
  }

  private moveModalToBody(): void {
    if (!this.modalRoot?.nativeElement || this.isModalInBody) {
      return;
    }

    document.body.appendChild(this.modalRoot.nativeElement);
    this.isModalInBody = true;
  }

  private removeModalFromBody(): void {
    if (!this.modalRoot?.nativeElement || !this.isModalInBody) {
      return;
    }

    document.body.removeChild(this.modalRoot.nativeElement);
    this.isModalInBody = false;
  }

  private findSectionInObject(source: unknown): string {
    if (!source || typeof source !== 'object') {
      return '';
    }

    const pattern = /(floor|curriculum|reference|wellness|periodicals|oversize|main stacks)/i;
    let bestMatch = '';
    let bestScore = 0;
    const seen = new Set<unknown>();
    const queue: unknown[] = [source];

    while (queue.length) {
      const current = queue.shift();
      if (!current || typeof current !== 'object' || seen.has(current)) {
        continue;
      }

      seen.add(current);
      const values = Object.values(current as Record<string, unknown>);

      for (const value of values) {
        if (typeof value === 'string' && pattern.test(value)) {
          const score = this.scoreSectionMatch(value);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = value;
          }
        }
        if (value && typeof value === 'object') {
          queue.push(value);
        }
      }
    }

    return bestMatch;
  }

  private scoreSectionMatch(value: string): number {
    const normalized = value.toLowerCase();
    let score = 0;

    if (normalized.includes('4th floor')) score += 5;
    if (normalized.includes('curriculum')) score += 4;
    if (normalized.includes('reference')) score += 4;
    if (normalized.includes('5th floor')) score += 3;
    if (normalized.includes('6th floor')) score += 3;
    if (normalized.includes('9th floor')) score += 3;
    if (normalized.includes('periodicals')) score += 3;
    if (normalized.includes('oversize')) score += 2;
    if (normalized.includes('main stacks')) score += 1;

    return score;
  }

  private findSectionFromDom(): string {
    const host = this.elementRef.nativeElement as HTMLElement | null;
    if (!host) {
      return '';
    }

    const root =
      host.closest('nde-record-availability') ||
      host.closest('nde-physical-availability-line') ||
      document;

    const button =
      root.querySelector('button.available-at-button') ||
      root.querySelector('button[aria-label*="Check holdings at"]');

    const text = button?.textContent?.trim();
    if (text) {
      return text;
    }

    const fallback =
      root.querySelector('.availability-status') ||
      root.querySelector('.availability-line');

    return fallback?.textContent?.trim() || '';
  }
}
