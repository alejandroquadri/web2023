import { NgModule, isDevMode } from '@angular/core';
import {
  BrowserModule,
  // BrowserTransferStateModule,
  // HammerModule,
  // HAMMER_GESTURE_CONFIG,
  // HammerGestureConfig,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr, 'es');

import { environment } from '../environments/environment';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/modules/shared.module';
import { LanguageComponent } from './language/language.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent, NavigatorComponent, LanguageComponent],
  imports: [
    // BrowserModule.withServerTransition({ appId: 'quadri-web-new' }),
    BrowserModule,
    // BrowserTransferStateModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule,
    // AngularFireDatabaseModule,
    // AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    // HammerModule, // tambien tuve que cargar en el main.ts
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    // lo de abajo es para que funcionen los gestos de Hammer
    // { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig, deps: [] },
    DecimalPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
