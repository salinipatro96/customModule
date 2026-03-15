import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, Injector, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-no-search-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-search-result.component.html',
  styleUrl: './no-search-result.component.scss'
})
export class NoSearchResultComponent implements OnInit {
  @Input() parentCtrl: any;
  @Input() hostComponent: any;

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

    this.hideNativeNoResultsBlock();
  }

  get searchTerm(): string {
    const directTerm = this.parentCtrl?.term || this.hostComponent?.term;
    if (directTerm) {
      return String(directTerm).trim();
    }

    const fromQuery = new URLSearchParams(window.location.search).get('query');
    if (!fromQuery) {
      return '';
    }

    const parts = fromQuery.split(',');
    return decodeURIComponent(parts[parts.length - 1] || fromQuery).trim();
  }

  get encodedSearchTerm(): string {
    return encodeURIComponent(this.searchTerm);
  }

  get pciSetting(): string {
    return String(this.parentCtrl?.searchStateService?.searchObject?.pcAvailability || '');
  }

  isJournal(): boolean {
    return window.location.href.includes('/jsearch?');
  }

  isSearch(): boolean {
    return window.location.href.includes('/search?');
  }

  isNewspaper(): boolean {
    return window.location.href.includes('/npsearch?');
  }

  get includeOutsideSubscriptionsLink(): string {
    if (this.isNewspaper()) {
      return `${this.basePath}/npsearch?vid=${this.vid}&query=any,contains,${this.encodedSearchTerm}&search_scope=all&offset=0&pcAvailability=true${this.langParam}`;
    }

    if (this.isJournal()) {
      return `${this.basePath}/search?vid=${this.vid}&query=any,contains,${this.encodedSearchTerm}&tab=Everything&search_scope=MyInst_and_CI&facet=rtype,include,journals${this.langParam}&offset=0`;
    }

    return `${this.basePath}/search?vid=${this.vid}&query=any,contains,${this.encodedSearchTerm}&tab=Everything&search_scope=MyInst_and_CI${this.langParam}&offset=0&pcAvailability=true`;
  }

  get healeyResourcesLink(): string {
    return `${this.basePath}/search?tab=Everything&search_scope=MyInst_and_CI&sortby=rank&vid=${this.vid}&query=any,contains,${this.encodedSearchTerm}${this.langParam}&mode=advanced`;
  }

  get courseReservesLink(): string {
    return `${this.basePath}/search?tab=CourseReserves&search_scope=CourseReserves&sortby=rank&vid=${this.vid}&query=any,contains,${this.encodedSearchTerm}${this.langParam}&mode=advanced`;
  }

  get worldCatScopeLink(): string {
    return `${this.basePath}/search?tab=Worldcat&search_scope=Worldcat&sortby=rank&vid=${this.vid}&query=any,contains,${this.encodedSearchTerm}${this.langParam}&mode=advanced`;
  }

  get newspaperSearchLink(): string {
    return `${this.basePath}/npsearch?vid=${this.vid}&query=any,contains,${this.encodedSearchTerm}&search_scope=all&offset=0${this.langParam}`;
  }

  get googleScholarLink(): string {
    return `https://scholar.google.com/scholar?hl=en&q=${this.encodedSearchTerm}`;
  }

  get worldCatLink(): string {
    return `https://umassboston.on.worldcat.org/search?databaseList=&queryString=${this.encodedSearchTerm}&clusterResults=true`;
  }

  private get basePath(): string {
    return '/nde';
  }

  private get vid(): string {
    return new URLSearchParams(window.location.search).get('vid') || '01MA_UMB:UMB';
  }

  private get langParam(): string {
    const lang = new URLSearchParams(window.location.search).get('lang');
    return lang ? `&lang=${encodeURIComponent(lang)}` : '';
  }

  private hideNativeNoResultsBlock(): void {
    const host = this.elementRef.nativeElement as HTMLElement;
    const wrapper = host.closest('ng-component');
    const nativeBlock = wrapper?.previousElementSibling as HTMLElement | null;

    if (nativeBlock?.tagName.toLowerCase() === 'nde-search-no-results') {
      nativeBlock.style.display = 'none';
    }
  }
}
