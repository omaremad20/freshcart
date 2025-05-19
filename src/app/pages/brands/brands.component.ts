import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Daum } from '../../core/interfaces/IBrands/brands';
import { BrandsService } from '../../core/services/brands/brands.service';
@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {
  private _BrandsService = inject(BrandsService);
  private _NgxSpinnerService = inject(NgxSpinnerService)
  brands!: Daum[];
  loading: boolean = true;
  cancelBrands!: Subscription;
  ngOnInit(): void {
    this.loading = true
    this._NgxSpinnerService.show();
    this.cancelBrands = this._BrandsService.GetAllBrands().subscribe({
      next: (res) => {
        console.log(res);

        this.loading = false;
        this._NgxSpinnerService.hide();
        this.brands = res.data;
      },
      error: (err) => {
        this.loading = false;
        this._NgxSpinnerService.hide();
      }
    })
  }
  ngOnDestroy(): void {
    this.cancelBrands?.unsubscribe();
  }
}
