import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchAssistantComponent } from './research-assistant.component';

describe('ResearchAssistantComponent', () => {
  let component: ResearchAssistantComponent;
  let fixture: ComponentFixture<ResearchAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResearchAssistantComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResearchAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should override research assistant links on init', () => {
    const mockLink = document.createElement('a');
    mockLink.setAttribute('aria-label', 'Research Assistant');
    document.body.appendChild(mockLink);

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockLink.getAttribute('data-ai-override-done')).toBe('true');

    document.body.removeChild(mockLink);
  });
});
