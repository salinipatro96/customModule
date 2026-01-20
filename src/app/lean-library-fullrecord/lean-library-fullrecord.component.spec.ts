import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeanLibraryFullrecordComponent } from './lean-library-fullrecord.component';

describe('LeanLibraryFullrecordComponent', () => {
  let component: LeanLibraryFullrecordComponent;
  let fixture: ComponentFixture<LeanLibraryFullrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeanLibraryFullrecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeanLibraryFullrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
