import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutEmailComponent } from './put-email.component';

describe('PutEmailComponent', () => {
  let component: PutEmailComponent;
  let fixture: ComponentFixture<PutEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PutEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PutEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
