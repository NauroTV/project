import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Removecolor } from './removecolor';

describe('Removecolor', () => {
  let component: Removecolor;
  let fixture: ComponentFixture<Removecolor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Removecolor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Removecolor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
