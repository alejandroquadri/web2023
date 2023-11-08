import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguageComponent } from './language/language.component';
import { DataResolver } from './language/data.resolver';
import { environment } from '../environments/environment';

const LANG = '../';

const routes: Routes = [
  // redirecciones practicas
  { path: 'es/placas', redirectTo: 'es/colecciones/todos', pathMatch: 'full' },
  { path: 'en/tiles', redirectTo: 'en/collections/all', pathMatch: 'full' },
  {
    path: 'es/pisos-elevados',
    redirectTo: 'es/colecciones/pisos-elevados',
    pathMatch: 'full',
  },

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
        path: 'thanks',
        loadChildren: () =>
          import('./thanks/thanks.module').then(m => m.ThanksModule),
      },
      {
        path: 'info',
        loadChildren: () =>
          import('./legal/legal.module').then(m => m.LegalModule),
      },
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
        path: 'checkout-us',
        loadChildren: () =>
          import('./checkout-ecom/checkout-ecom.module').then(
            m => m.CheckoutEcomModule
          ),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then(m => m.BlogModule),
      },
      { path: 'lookbook', pathMatch: 'full', redirectTo: 'inspiracion' },
      {
        path: 'inspiracion',
        loadChildren: () =>
          import('./lookbook/lookbook.module').then(m => m.LookbookModule),
      },
      { path: 'samples', pathMatch: 'full', redirectTo: 'muestras' },
      {
        path: 'muestras',
        loadChildren: () =>
          import('./samples/samples.module').then(m => m.SamplesModule),
      },
      { path: 'collections', redirectTo: 'colecciones' },
      {
        path: 'colecciones',
        loadChildren: () =>
          import('./collections/collections.module').then(
            m => m.CollectionsModule
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  {
    path: 'en',
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
        path: 'thanks',
        loadChildren: () =>
          import('./thanks/thanks.module').then(m => m.ThanksModule),
      },
      {
        path: 'info',
        loadChildren: () =>
          import('./legal/legal.module').then(m => m.LegalModule),
      },
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
        path: 'checkout-us',
        loadChildren: () =>
          import('./checkout-ecom/checkout-ecom.module').then(
            m => m.CheckoutEcomModule
          ),
      },
      {
        path: 'return',
        loadChildren: () =>
          import('./return-page/return-page.module').then(
            m => m.ReturnPageModule
          ),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then(m => m.BlogModule),
      },
      { path: 'inspiracion', pathMatch: 'full', redirectTo: 'lookbook' },
      {
        path: 'lookbook',
        loadChildren: () =>
          import('./lookbook/lookbook.module').then(m => m.LookbookModule),
      },
      { path: 'muestras', pathMatch: 'full', redirectTo: 'samples' },

      {
        path: 'samples',
        loadChildren: () =>
          import('./samples/samples.module').then(m => m.SamplesModule),
      },
      { path: 'colecciones', redirectTo: 'collections' },
      {
        path: 'collections',
        loadChildren: () =>
          import('./collections/collections.module').then(
            m => m.CollectionsModule
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: environment.init.lang,
  },
  // Anything else will route to not found
  { path: '**', redirectTo: 'es/not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
