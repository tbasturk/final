import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private router: Router) { }

  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  checkLoginStatus(): boolean {
    return false;
  }

  get isloggedIn() {
    return this.loginStatus.asObservable();
  }

  login(x) {
    //ch
    this.http.post('http://161.35.59.8:3000/api/login', x)
    .subscribe((res: any) => {
      console.log('test');
      if (res && res.success) {
        localStorage.setItem('access', res.token);
        this.loginStatus.next(true);
        this.router.navigate(['/dashboard']);
      }
    }, (error: any) => {
      console.log(error);
      document.getElementById('message').innerHTML = error.error.err;
      document.getElementById('message').style.visibility = 'visible';
    });


  }

  logout() {
    localStorage.removeItem('access');
    this.loginStatus.next(false);
    this.router.navigate(['/login']);


  }


}
