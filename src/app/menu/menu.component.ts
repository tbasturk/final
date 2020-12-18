import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public userLoggedIn = false;

  constructor(private dataService: DataService, public router: Router) { }

  loginStatus$: Observable<boolean>;
  ngOnInit(): void {
    this.loginStatus$ = this.dataService.isloggedIn;
  }

  onLogOut() {
    this.dataService.logout();
  }

}
