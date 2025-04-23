import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ICategories } from '../../core/interfaces/ICategories/icategories';
import { CategoriesService } from '../../core/services/Categories/categories.service';
@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private _CategoriesService = inject(CategoriesService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  categories!: ICategories[]
  cancelCategorie!: Subscription;
  loading: boolean = true;
  ngOnInit(): void {
    this.loading = true;
    this._NgxSpinnerService.show();
    this.cancelCategorie = this._CategoriesService.GetAllCategories().subscribe({
      next: (res) => {
        this.loading = false;
        this._NgxSpinnerService.hide();
        this.categories = res.data;
      },
      error: (err) => {
        this.loading = false;
        this._NgxSpinnerService.hide();
      }
    })
  }
  ngOnDestroy(): void {
    this.cancelCategorie?.unsubscribe();
  }
}
