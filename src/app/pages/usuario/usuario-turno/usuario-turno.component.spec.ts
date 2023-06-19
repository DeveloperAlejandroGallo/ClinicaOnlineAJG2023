import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioTurnoComponent } from './usuario-turno.component';

describe('UsuarioTurnoComponent', () => {
  let component: UsuarioTurnoComponent;
  let fixture: ComponentFixture<UsuarioTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioTurnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
