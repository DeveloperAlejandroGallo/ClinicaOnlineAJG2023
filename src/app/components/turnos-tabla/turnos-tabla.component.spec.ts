import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosTablaComponent } from './turnos-tabla.component';

describe('TurnosTablaComponent', () => {
  let component: TurnosTablaComponent;
  let fixture: ComponentFixture<TurnosTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnosTablaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
