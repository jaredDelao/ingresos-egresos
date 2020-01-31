import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { IngresoEgresoState } from '../ingreso-egreso.reducer';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>, public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
      .subscribe((ingresosEgresos: IngresoEgresoState) => {
        this.items = ingresosEgresos.items;
      })
  }


  borrarItem(item) {
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
        .then(() => Swal.fire('Eliminado', item.description, "success"))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
