import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioHistoriaClinicaComponent } from './usuario-historia-clinica.component';

describe('UsuarioHistoriaClinicaComponent', () => {
  let component: UsuarioHistoriaClinicaComponent;
  let fixture: ComponentFixture<UsuarioHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioHistoriaClinicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
