import { tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, map, catchError, of } from 'rxjs';

import {
  LayoutService,
  ServerDetectService,
  SeoService,
  LanguageService,
} from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { ContactCopy } from '../shared/copy';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild('marker', { static: false }) storeMarker: MapMarker;

  isMobile$: Observable<boolean>;
  apiLoaded$: Observable<boolean>;
  lang: string;
  showMap = false;
  isEcom = environment.init.eCom;

  googleMapsKey = environment.googleMaps.key;
  zoom = this.isEcom ? 10 : 12;
  center: google.maps.LatLngLiteral = {
    lat: -34.6062565425857,
    lng: -58.42448375654149,
  };
  copy = ContactCopy;
  infoContent = '<h5>Quadri</h5><p>Gascon 483<br>C1181 CABA<br>Argentina</p>';

  options: google.maps.MapOptions = {
    zoomControl: true,
    disableDoubleClickZoom: true,
    // scrollwheel: true,
    // maxZoom: 15,
    // minZoom: 8,
  };

  label = {
    color: 'black',
    text: 'Quadri',
  };

  constructor(
    private layoutSc: LayoutService,
    private serverDetSc: ServerDetectService,
    private seoSc: SeoService,
    private langSc: LanguageService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.getMapApi();
  }

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    // no muestro el mapa si esta renderizando, por default es = false
    this.isMobile$ = this.layoutSc.detectMobile();
    this.setSeo();
  }

  getMapApi() {
    if (this.serverDetSc.isBrowserSide()) {
      // this.showMap = true;
      this.apiLoaded$ = this.httpClient
        .jsonp(
          `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsKey}`,
          'callback'
        )
        .pipe(
          map(() => {
            return true;
          }),
          tap(() => {
            setTimeout(() => {
              console.log(this.storeMarker);
              if (this.storeMarker) {
                this.openInfoWindow(this.storeMarker);
              }
            }, 0);
          }),
          catchError((err: any) => {
            console.log('hay un error', err);
            return of(false);
          })
        );
    }
  }

  openInfoWindow(marker: MapMarker) {
    console.log('corro open');
    this.infoWindow.open(marker);
  }

  setSeo() {
    const slug = this.lang === 'es' ? 'contacto' : 'contact';
    const metaTags = {
      title: this.lang === 'es' ? 'Contacto' : 'Contact us',
      // tslint:disable-next-line:max-line-length
      description:
        this.lang === 'es'
          ? 'Nos encantaría saber de vos. Contactanos por muestras, presupuestos o cualquier duda o consulta.'
          : 'We would love to hear from you. Please contact us for samples, quotations or any other information. ',
      // image: this.slidesData[0].img,
      slug: `/${slug}`,
    };

    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(`/${this.lang}/${slug}`);
  }

  submitted() {
    console.log('submit');
  }

  mailTo() {
    return `mailto:${
      this.isEcom ? this.copy.email.eCom : this.copy.email.local
    }`;
  }

  callTo() {
    return `tel:${
      this.isEcom ? this.copy.callPhone.eCom : this.copy.callPhone.local
    }`;
  }
}
