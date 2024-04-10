import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyfileComponent } from './verifyfile.component';

describe('VerifyfileComponent', () => {
  let component: VerifyfileComponent;
  let fixture: ComponentFixture<VerifyfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
