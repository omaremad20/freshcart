import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAddressComponent } from './upload-address.component';

describe('UploadAddressComponent', () => {
  let component: UploadAddressComponent;
  let fixture: ComponentFixture<UploadAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
