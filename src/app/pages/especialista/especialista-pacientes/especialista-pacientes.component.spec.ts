import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaPacientesComponent } from './especialista-pacientes.component';

describe('EspecialistaPacientesComponent', () => {
  let component: EspecialistaPacientesComponent;
  let fixture: ComponentFixture<EspecialistaPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspecialistaPacientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecialistaPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
