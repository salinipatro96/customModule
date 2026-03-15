import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-research-assistant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research-assistant.component.html',
  styleUrls: ['./research-assistant.component.scss']
})
export class ResearchAssistantComponent implements OnInit, OnDestroy {
  private mutationObserver: MutationObserver | null = null;
  private readonly targetUrl = 'https://umb.libguides.com/c.php?g=1479566';
  private readonly customUiStyleId = 'umb-custom-ui-style';

  constructor() {}

  ngOnInit(): void {
    this.ensureCustomUiStyles();
    this.decorateAiModeButton();
    this.decorateIliadAccountLink();
    this.enhanceLandingPageSearchInput();
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
      this.decorateAiModeButton();
      this.decorateIliadAccountLink();
      this.enhanceLandingPageSearchInput();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
});
  }

  shouldShow(): boolean {
    const path = window.location?.pathname ?? '';
    const href = window.location?.href ?? '';
    return path.includes('/nde/researchAssistant') || href.includes('/nde/researchAssistant');
  }

  private overrideResearchAssistantLinks(): void {
    const aiLinks = document.querySelectorAll(
      'a[aria-label="Research Assistant"], a'
    );

    aiLinks.forEach((link: Element) => {
      const htmlElement = link as HTMLAnchorElement;
      const text = (htmlElement.textContent || '').trim();

      if (htmlElement.classList.contains('feedback-link')) {
        return;
      }

      if (htmlElement.getAttribute('aria-label') !== 'Research Assistant' && text !== 'Research Assistant') {
        return;
      }

      if (!htmlElement.hasAttribute('data-ai-override-done')) {
        const target = this.targetUrl;
        htmlElement.href = target;
        htmlElement.removeAttribute('target');
        htmlElement.removeAttribute('ui-state');
        htmlElement.removeAttribute('ui-state-params');
        htmlElement.removeAttribute('ui-state-opts');

        htmlElement.addEventListener(
          'click',
          (e: Event) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.location.href = target;
          },
          true
        );

        htmlElement.setAttribute('data-ai-override-done', 'true');
      }
    });
  }

  private decorateAiModeButton(): void {
    const aiModeLabels = Array.from(document.querySelectorAll('span.hide-sm')).filter(
      (element) => (element.textContent || '').trim() === 'AI Mode'
    );

    aiModeLabels.forEach((label) => {
      const trigger = label.closest('button, a, .mdc-button, .mat-mdc-button-base');
      this.removeAiModeSearchIcon(label, trigger);

      if (label.querySelector('.umb-ai-mode-icon')) {
        return;
      }

      const icon = document.createElement('span');
      icon.className = 'umb-ai-mode-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = `
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 2.8 13.4 7l4.2 1.4-4.2 1.4L12 14l-1.4-4.2L6.4 8.4 10.6 7 12 2.8Z"></path>
          <path d="M18.5 8.7 19.2 10.8l2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z"></path>
          <path d="M7.2 13.4 8.2 16.3l2.9 1-2.9 1-1 2.9-1-2.9-2.9-1 2.9-1 1-2.9Z"></path>
        </svg>
      `;
      label.prepend(icon);
    });
  }

  private removeAiModeSearchIcon(label: Element, trigger: Element | null): void {
    if (!trigger) {
      return;
    }

    const candidateSelectors = [
      '.mdc-button__icon',
      '.mat-mdc-button-persistent-ripple + span mat-icon',
      '.mat-mdc-button-persistent-ripple + mat-icon',
      'mat-icon',
      '.mat-icon',
      'prm-icon',
      'svg',
      '.search-icon',
      '[iconname="search"]',
      '[data-icon="search"]',
      '.uxf-icon-search'
    ];

    trigger.querySelectorAll(candidateSelectors.join(', ')).forEach((icon) => {
      if (icon.contains(label) || icon.classList.contains('umb-ai-mode-icon')) {
        return;
      }

      const text = (icon.textContent || '').trim().toLowerCase();
      const ariaLabel = (icon.getAttribute('aria-label') || '').trim().toLowerCase();
      const iconName = (
        icon.getAttribute('iconname') ||
        icon.getAttribute('data-icon') ||
        icon.getAttribute('name') ||
        ''
      )
        .trim()
        .toLowerCase();
      const classes = Array.from(icon.classList).join(' ').toLowerCase();

      if (
        text === 'search' ||
        ariaLabel === 'search' ||
        iconName === 'search' ||
        classes.includes('search') ||
        this.isAiModeLeadingIcon(icon, label, trigger)
      ) {
        icon.remove();
      }
    });
  }

  private isAiModeLeadingIcon(icon: Element, label: Element, trigger: Element): boolean {
    if (!trigger.contains(label) || !trigger.contains(icon)) {
      return false;
    }

    const labelWrapper = label.closest('.mdc-button__label') || label.parentElement;
    if (!labelWrapper) {
      return false;
    }

    const children = Array.from(trigger.children);
    const labelIndex = children.findIndex((child) => child === labelWrapper || child.contains(labelWrapper));
    const iconIndex = children.findIndex((child) => child === icon || child.contains(icon));

    return iconIndex !== -1 && labelIndex !== -1 && iconIndex < labelIndex;
  }

  private decorateIliadAccountLink(): void {
    const accountLinks = Array.from(
      document.querySelectorAll('h2[data-qa="account-overview-opening"] a[href*="illiad"], h2.overview-opening a[href*="illiad"]')
    ) as HTMLAnchorElement[];

    accountLinks.forEach((link) => {
      link.classList.add('umb-illiad-button');
      link.setAttribute('role', 'button');
      link.style.display = 'inline-flex';
      link.style.alignItems = 'center';
      link.style.justifyContent = 'center';
      link.style.marginLeft = '0.28rem';
      link.style.padding = '0.12rem 0.62rem';
      link.style.border = '1px solid #005b96';
      link.style.borderRadius = '999px';
      link.style.background = '#eef6fc';
      link.style.color = '#005b96';
      link.style.fontWeight = '700';
      link.style.fontSize = '0.88em';
      link.style.lineHeight = '1.1';
      link.style.textDecoration = 'none';
      link.style.verticalAlign = 'middle';
      link.style.transform = 'translateY(-0.03em)';
    });
  }

  private ensureCustomUiStyles(): void {
    if (document.getElementById(this.customUiStyleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = this.customUiStyleId;
    style.textContent = `
      .umb-ai-mode-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.35rem;
        color: #ffffff;
        line-height: 1;
        transform: translateY(-0.02em);
      }

      .umb-ai-mode-icon svg {
        width: 0.95em;
        height: 0.95em;
        fill: #ffffff;
        stroke: #000000;
        stroke-width: 0.7;
        paint-order: stroke fill;
      }

      .umb-illiad-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 0.28rem;
        padding: 0.12rem 0.62rem;
        border: 1px solid #005b96;
        border-radius: 999px;
        background: #eef6fc;
        color: #005b96 !important;
        font-weight: 700;
        font-size: 0.88em;
        line-height: 1.1;
        text-decoration: none !important;
        vertical-align: middle;
        transform: translateY(-0.03em);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        transition: background-color 0.2s ease, border-color 0.2s ease;
      }

      .umb-illiad-button:hover,
      .umb-illiad-button:focus {
        background: #dcecf8;
        border-color: #00446f;
        color: #00446f !important;
        text-decoration: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  private enhanceLandingPageSearchInput(): void {
    const input = document.querySelector(
      '.landing-page-search-bar-wrapper #main-search-bar'
    ) as HTMLInputElement | null;

    if (!input || input.dataset['multilineEnhanced'] === 'true') {
      return;
    }

    const container = input.parentElement;
    if (!container) {
      return;
    }

    input.dataset['multilineEnhanced'] = 'true';
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;
    input.style.position = 'absolute';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    input.style.inset = '0';
    input.style.zIndex = '-1';

    const textarea = document.createElement('textarea');
    textarea.className = `${input.className} umb-multiline-search-input`;
    textarea.id = `${input.id}-multiline`;
    textarea.rows = 1;
    textarea.placeholder = input.placeholder;
    textarea.setAttribute('aria-label', input.getAttribute('aria-label') || 'Search field');
    textarea.value = input.value;

    const syncToInput = () => {
      if (input.value === textarea.value) {
        this.resizeLandingTextarea(textarea);
        return;
      }

      input.value = textarea.value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      this.resizeLandingTextarea(textarea);
    };

    textarea.addEventListener('input', syncToInput);
    textarea.addEventListener('focus', () => input.dispatchEvent(new Event('focus', { bubbles: true })));
    textarea.addEventListener('blur', () => input.dispatchEvent(new Event('blur', { bubbles: true })));
    input.addEventListener('input', () => {
      if (textarea.value !== input.value) {
        textarea.value = input.value;
        this.resizeLandingTextarea(textarea);
      }
    });

    container.insertBefore(textarea, input.nextSibling);
    this.resizeLandingTextarea(textarea);
  }

  private resizeLandingTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }
}
