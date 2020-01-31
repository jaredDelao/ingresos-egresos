import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor(private afDB: AngularFirestore, public authService: AuthService,
    private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubscription = this.store.select('auth')
      .pipe(
        filter(d => d.user !== null)
      )
      .subscribe((auth) => this.ingresoEgresoItems(auth.user.uid));
  }

  // get elementos ingresos egresos
  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubscription = this.afDB.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(docData => {
          return docData.map((doc) => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            }
          });
        })
      )
      .subscribe((collection: IngresoEgreso[]) => {
        this.store.dispatch(new SetItemsAction(collection));
      })
  }

  cancelarSubscriptions() {
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.ingresoEgresoListenerSubscription.unsubscribe();
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {

    const user = this.authService.getUsuario();

    return this.afDB.doc(`${user.uid}/ingresos-egresos`)
      .collection('items').add({ ...ingresoEgreso })
  }

  borrarIngresoEgreso(uid: string) {
    const user = this.authService.getUsuario();

    return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`)
        .delete();
  }

}
