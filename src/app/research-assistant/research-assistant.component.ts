import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-research-assistant',
  templateUrl: './research-assistant.component.html',
  styleUrls: ['./research-assistant.component.scss']
})
export class ResearchAssistantComponent implements OnInit, OnDestroy {
  private mutationObserver: MutationObserver | null = null;
  private readonly targetUrl = 'https://umb.libguides.com/c.php?g=1479566';

  constructor() {}

  ngOnInit(): void {
    this.setupMutationObserver();
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver(() => {
      this.overrideResearchAssistantLinks();
    });

    const targetNode = document.querySelector('header, nav, prm-topbar') || document.body;

    this.mutationObserver.observe(targetNode, {
      childList: true,
      subtree: true
});
  }

  private overrideResearchAssistantLinks(): void {
    const aiLinks = document.querySelectorAll(
      'a[aria-label="Research Assistant"]:not(.feedback-link)'
    );

    aiLinks.forEach((link: Element) => {
      const htmlElement = link as HTMLAnchorElement;

      if (!htmlElement.hasAttribute('data-ai-override-done')) {
        htmlElement.href = this.targetUrl;
        htmlElement.removeAttribute('target');
        htmlElement.removeAttribute('ui-state');
        htmlElement.removeAttribute('ui-state-params');
        htmlElement.removeAttribute('ui-state-opts');

        htmlElement.addEventListener(
          'click',
          (e: Event) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.location.href = this.targetUrl;
          },
          true
        );

        htmlElement.setAttribute('data-ai-override-done', 'true');
      }
    });
  }
}
