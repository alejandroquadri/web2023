import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductGuard implements CanActivate {
  constructor(private router: Router, private productSc: ProductService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = route.paramMap.get('id');
    const subProd = route.paramMap.get('subProd');
    if (
      subProd &&
      this.productSc.subProdUrlArray.includes(subProd) &&
      (id === 'losetas' || id === 'pavers')
    ) {
      return true;
    } else if (
      subProd &&
      !this.productSc.subProdUrlArray.includes(subProd) &&
      (id === 'losetas' || id === 'pavers')
    ) {
      this.router.navigate(['/']);
      return false;
    } else if (this.productSc.productsUrlArray.includes(id)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
