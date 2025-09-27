import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientDialogComponent } from './add-client-dialog.component';

describe('AddClientDialogComponent', () => {
  let component: AddClientDialogComponent;
  let fixture: ComponentFixture<AddClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
