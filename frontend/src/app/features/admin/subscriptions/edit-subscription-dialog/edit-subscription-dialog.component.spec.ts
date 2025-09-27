import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubscriptionDialogComponent } from './edit-subscription-dialog.component';

describe('EditSubscriptionDialogComponent', () => {
  let component: EditSubscriptionDialogComponent;
  let fixture: ComponentFixture<EditSubscriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSubscriptionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSubscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
