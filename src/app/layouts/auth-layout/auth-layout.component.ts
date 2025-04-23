import { Router, RouterOutlet } from '@angular/router';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  private _PLATFORM_ID = inject(PLATFORM_ID)

  constructor(private router: Router) {
    // if(isPlatformBrowser(this._PLATFORM_ID)) {
    //   const userToken = sessionStorage.getItem('userToken');
    //   if (!userToken) {
    //     this.router.navigate(['/Login']);
    //   } else {
    //     this.router.navigate(['/Home']);
    //   }
    // }
  }
}
