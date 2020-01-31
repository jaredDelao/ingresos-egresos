import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  form: FormGroup;
  tipo = 'ingreso';
  loading: Subscription = new Subscription();
  cargando: boolean;

  constructor(public ingresoEgresoService: IngresoEgresoService, 
              private store: Store<AppState>) { }

  ngOnInit() {
    this.form = new FormGroup({
      'description': new FormControl('', [Validators.required]),
      'monto': new FormControl(0, [Validators.min(1)]),
    });

    this.loading = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    })
  }

  ngOnDestroy() {
    this.loading.unsubscribe();
  }

  crearIngresoEgreso() {
    const action = new ActivarLoadingAction();
    this.store.dispatch(action);

    const ingresoEgreso = new IngresoEgreso({ ...this.form.value, tipo: this.tipo });
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        const action2 = new DesactivarLoadingAction();
        this.store.dispatch(action2)
        Swal.fire('Creado', ingresoEgreso.description, 'success')
        this.form.reset({
          monto: 0
        });
      })
  }

}
