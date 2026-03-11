import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-lean-library-fullrecord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lean-library-fullrecord.component.html',
  styleUrl: './lean-library-fullrecord.component.scss'
})
export class LeanLibraryFullrecordComponent implements OnInit, OnDestroy {
  readonly reportText = 'Report a Problem';
  readonly reportBaseUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSdZsd1JeeXVzGuTISckueJmSgxZBKIYvqswTV2O7UiIdi8eHw/viewform';
  reportUrl = '';
  showWidget = true;
  private readonly lockKey = '__reportProblemWidgetOwner__';
  private readonly instanceId = `rpw-${Math.random().toString(36).slice(2, 10)}`;
  private domObserver: MutationObserver | null = null;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.showWidget = this.claimRenderLock();
    if (!this.showWidget) {
      return;
    }
    this.reportUrl = this.buildReportUrl();
    this.positionAboveDetails();
    this.startPositionObserver();
  }

  ngOnDestroy(): void {
    this.domObserver?.disconnect();
    this.domObserver = null;

    const w = window as unknown as Record<string, string | undefined>;
    if (w[this.lockKey] === this.instanceId) {
      delete w[this.lockKey];
    }
  }

  private claimRenderLock(): boolean {
    const w = window as unknown as Record<string, string | undefined>;
    if (!w[this.lockKey]) {
      w[this.lockKey] = this.instanceId;
      return true;
    }
    if (!document.getElementById('referrerLink')) {
      w[this.lockKey] = this.instanceId;
      return true;
    }
    return w[this.lockKey] === this.instanceId;
  }

  private startPositionObserver(): void {
    this.domObserver = new MutationObserver(() => {
      this.positionAboveDetails();
    });
    this.domObserver.observe(document.body, { childList: true, subtree: true });
  }

  private positionAboveDetails(): void {
    const host = this.elementRef.nativeElement;
    const detailsAnchor = this.findDetailsAnchor();
    if (!host || !detailsAnchor) {
      return;
    }

    if (host.nextElementSibling === detailsAnchor) {
      return;
    }

    detailsAnchor.parentElement?.insertBefore(host, detailsAnchor);
  }

  private findDetailsAnchor(): HTMLElement | null {
    const selectors = [
      '[id="brief.results.tabs.details"]',
      'prm-full-view-details',
      'prm-full-view-details-section',
      'section[id*="details"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (element) {
        return element;
      }
    }

    const detailsHeading = Array.from(document.querySelectorAll('h2, h3')).find((el) =>
      (el.textContent || '').trim().toLowerCase() === 'details'
    ) as HTMLElement | undefined;

    return detailsHeading ?? null;
  }

  private buildReportUrl(): string {
    const title = this.getTitle();
    const recordId = this.getRecordId();
    const identifier = this.getIdentifier();
    const titleUrl = window.location.href;
    const browser = this.getBrowser();
    const platform = this.getPlatform();

    const params = new URLSearchParams({
      usp: 'sf_link',
      'entry.1707736170': title,
      'entry.516025303': recordId,
      'entry.433063085': identifier,
      'entry.1363950030': titleUrl,
      'entry.202619964': browser,
      'entry.1445429082': platform
    });

    return `${this.reportBaseUrl}?${params.toString()}`;
  }

  private getRecordId(): string {
    const fromUrl = new URLSearchParams(window.location.search).get('docid');
    if (fromUrl) {
      return fromUrl;
    }

    const href = window.location.href;
    const almaMatch = href.match(/(alma\d+)/i);
    if (almaMatch?.[1]) {
      return almaMatch[1];
    }
    return '';
  }

  private getTitle(): string {
    const heading =
      (document.querySelector('h1') as HTMLElement | null)?.innerText?.trim() ||
      (document.querySelector('prm-full-view h2') as HTMLElement | null)?.innerText?.trim();
    if (heading) {
      return heading.replace(/\s+/g, ' ');
    }

    const pageTitle = (document.title || '').replace(/\s+/g, ' ').trim();
    return pageTitle;
  }

  private getIdentifier(): string {
    const textBlocks = Array.from(
      document.querySelectorAll('prm-full-view-details-section, prm-full-view, main, body')
    )
      .map((el) => (el as HTMLElement).innerText || '')
      .join('\n');
    const match = textBlocks.match(/Identifier\s*[:\n]\s*([^\n]+)/i);
    return match?.[1]?.trim() || '';
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    let name = 'Unknown';
    let version = '';

    if (/Edg\//.test(ua)) {
      name = 'Edge';
      version = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
    } else if (/OPR\//.test(ua)) {
      name = 'Opera';
      version = ua.match(/OPR\/([\d.]+)/)?.[1] || '';
    } else if (/Chrome\//.test(ua)) {
      name = 'Chrome';
      version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
    } else if (/Firefox\//.test(ua)) {
      name = 'Firefox';
      version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
    } else if (/Version\/([\d.]+).*Safari/.test(ua)) {
      name = 'Safari';
      version = ua.match(/Version\/([\d.]+)/)?.[1] || '';
    }

    return version ? `${name} v${version}` : name;
  }

  private getPlatform(): string {
    const ua = navigator.userAgent;
    if (/Windows NT/.test(ua)) {
      return 'Windows';
    }
    if (/Mac OS X/.test(ua)) {
      return 'Mac OS X';
    }
    if (/Android/.test(ua)) {
      return 'Android';
    }
    if (/iPhone|iPad|iPod/.test(ua)) {
      return 'iOS';
    }
    if (/Linux/.test(ua)) {
      return 'Linux';
    }
    return 'Unknown';
  }
}
