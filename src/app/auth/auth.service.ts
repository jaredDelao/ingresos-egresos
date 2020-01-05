import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { map, finalize } from "rxjs/operators";

import { User } from "firebase";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((fireUSer: User) => {
      console.log(fireUSer);
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {
        this.router.navigate(["/"]);
      })
      .catch(err => {
        console.error(err);
      });
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.router.navigate(["/"]);
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error en el login", err.message, "error");
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
}
