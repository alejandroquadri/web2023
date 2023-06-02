import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguageComponent } from './language/language.component';
import { DataResolver } from './language/data.resolver';

const routes: Routes = [
  // redirecciones practicas
  { path: 'es/placas', redirectTo: 'es/colecciones/todos', pathMatch: 'full' },
  { path: 'en/tiles', redirectTo: 'en/collections/all', pathMatch: 'full' },
  {
    path: 'es/pisos-elevados',
    redirectTo: 'es/colecciones/pisos-elevados',
    pathMatch: 'full',
  },
  // { path: 'raised-floors', redirectTo: 'en/raised-floors', pathMatch: 'full' },
  // { path: 'losetas', redirectTo: 'es/losetas', pathMatch: 'full' },
  // { path: 'pavers', redirectTo: 'en/pavers', pathMatch: 'full' },
  // { path: 'contacto', pathMatch: 'full', redirectTo: 'es/contacto' },
  // { path: 'contact', pathMatch: 'full', redirectTo: 'en/contact' },
  // { path: 'consultas', pathMatch: 'full', redirectTo: 'es/contacto' },
  // { path: 'queries', pathMatch: 'full', redirectTo: 'en/contacto' },
  // { path: 'quote', pathMatch: 'full', redirectTo: 'es/quote' },

  // // redirecciones de web vieja
  { path: 'mosaicos', redirectTo: 'es/colecciones/todos', pathMatch: 'full' },

  {
    path: 'es',
    component: LanguageComponent,
    resolve: { lookbook: DataResolver },
    children: [
      {
        path: 'not-found',
        loadChildren: () =>
          import('./not-found/not-found.module').then(m => m.NotFoundModule),
      },
      { path: '404', redirectTo: 'not-found', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () =>
          import('./landing/landing.module').then(m => m.LandingModule),
      },
      { path: 'contact', pathMatch: 'full', redirectTo: 'contacto' },
      {
        path: 'contacto',
        loadChildren: () =>
          import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./checkout/checkout.module').then(m => m.CheckoutModule),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then(m => m.BlogModule),
      },
      // {
      //   path: 'quote',
      //   loadChildren: () =>
      //     import('./quoter/quoter.module').then(m => m.QuoterModule),
      // },
      { path: 'lookbook', pathMatch: 'full', redirectTo: 'inspiracion' },
      {
        path: 'inspiracion',
        loadChildren: () =>
          import('./lookbook/lookbook.module').then(m => m.LookbookModule),
      },
      { path: 'collections', redirectTo: 'colecciones' },
      {
        path: 'colecciones',
        loadChildren: () =>
          import('./collections/collections.module').then(
            m => m.CollectionsModule
          ),
      },
      // {
      //   path: ':id',
      //   canActivate: [NotFoundGuard],
      //   loadChildren: () =>
      //     import('./product/product.module').then(m => m.ProductModule),
      // },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  {
    path: 'en',
    component: LanguageComponent,
    children: [
      {
        path: 'not-found',
        loadChildren: () =>
          import('./not-found/not-found.module').then(m => m.NotFoundModule),
      },
      { path: '404', redirectTo: 'not-found', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () =>
          import('./landing/landing.module').then(m => m.LandingModule),
      },
      { path: 'contacto', pathMatch: 'full', redirectTo: 'contact' },
      {
        path: 'contact',
        loadChildren: () =>
          import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./checkout/checkout.module').then(m => m.CheckoutModule),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then(m => m.BlogModule),
      },
      // {
      //   path: 'quote',
      //   loadChildren: () =>
      //     import('./quoter/quoter.module').then(m => m.QuoterModule),
      // },
      { path: 'inspiracion', pathMatch: 'full', redirectTo: 'lookbook' },
      {
        path: 'lookbook',
        loadChildren: () =>
          import('./lookbook/lookbook.module').then(m => m.LookbookModule),
      },
      { path: 'colecciones', redirectTo: 'collections' },
      {
        path: 'collections',
        loadChildren: () =>
          import('./collections/collections.module').then(
            m => m.CollectionsModule
          ),
      },
      // {
      //   path: ':id',
      //   canActivate: [NotFoundGuard],
      //   loadChildren: () =>
      //     import('./product/product.module').then(m => m.ProductModule),
      // },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'es',
  },
  // Anything else will route to not found
  { path: '**', redirectTo: 'es/not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // initialNavigation: 'enabled',
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
