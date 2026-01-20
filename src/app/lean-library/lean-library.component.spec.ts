import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeanLibraryComponent } from './lean-library.component';

describe('LeanLibraryComponent', () => {
  let component: LeanLibraryComponent;
  let fixture: ComponentFixture<LeanLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeanLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeanLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
