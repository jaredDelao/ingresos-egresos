import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { map, finalize } from "rxjs/operators";

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class AuthService {

  userSubscription: Subscription = new Subscription();
  usuario: User;

  constructor(private afAuth: AngularFireAuth, private router: Router,
    private store: Store<AppState>, private afDB: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fireUSer: firebase.User) => {
      console.log(fireUSer);
      if (fireUSer) {
        this.userSubscription = this.afDB.doc(`${fireUSer.uid}/usuario`).valueChanges()
          .subscribe((usuarioObj: any) => {
            const newUser = new User(usuarioObj);
            this.store.dispatch(new SetUserAction(newUser));
            this.usuario = newUser;
          })
      } else {
        // this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {
        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email
        };

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.router.navigate(["/"]);
          })

        this.store.dispatch(new DesactivarLoadingAction());
      })
      .catch(err => {
        console.error(err);
      });
  }

  login(email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction())

    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.store.dispatch(new DesactivarLoadingAction())
        this.router.navigate(["/"]);
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error en el login", err.message, "error");
        this.store.dispatch(new DesactivarLoadingAction())
      });
  }

  logout(): void {
    this.router.navigate(["/login"]);
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map(fireUSer => {
        if (fireUSer == null) {
          this.router.navigate(['/login'])
        }
        return fireUSer != null
      }))
  }

  getUsuario() {
    return { ...this.usuario };
  }
}
