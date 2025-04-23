import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private _CartService = inject(CartService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  login: boolean = false;
  numOfCartItems!: number;
  numOfCartItemsBehvaiorSubjectObservableId!: Subscription;
  ngOnInit(): void {
    this.isLogin();
    if (this.login === true) {
      this._CartService.getLoggedUserCart().subscribe({
        next: (res) => {
          this.numOfCartItems = res.numOfCartItems;
          this._CartService.numOfCartItems.next(res.numOfCartItems);
          this.numOfCartItemsBehvaiorSubjectObservableId = this._CartService.numOfCartItems.subscribe({
            next: (value) => {
              this.numOfCartItems = value;
            }
          })
        }
      })

    }
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const isDark = localStorage.getItem('theme') === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }
  toggleDarkMode() {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  isLogin(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.login = true;
      } else {
        this.login = false;
      }
    }
  }
  ngOnDestroy(): void {
    this.numOfCartItemsBehvaiorSubjectObservableId?.unsubscribe();
  }

}
