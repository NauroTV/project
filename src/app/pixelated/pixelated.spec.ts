import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pixelated } from './pixelated';

describe('Pixelated', () => {
  let component: Pixelated;
  let fixture: ComponentFixture<Pixelated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pixelated]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pixelated);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
