import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brightnesscontrast } from './brightnesscontrast';

describe('Brightnesscontrast', () => {
  let component: Brightnesscontrast;
  let fixture: ComponentFixture<Brightnesscontrast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brightnesscontrast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brightnesscontrast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
