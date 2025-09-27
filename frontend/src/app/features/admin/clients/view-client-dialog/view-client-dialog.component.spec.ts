import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientDialogComponent } from './view-client-dialog.component';

describe('ViewClientDialogComponent', () => {
  let component: ViewClientDialogComponent;
  let fixture: ComponentFixture<ViewClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
