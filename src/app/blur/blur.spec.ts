import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Blur } from './blur';

describe('Blur', () => {
  let component: Blur;
  let fixture: ComponentFixture<Blur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Blur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Blur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
