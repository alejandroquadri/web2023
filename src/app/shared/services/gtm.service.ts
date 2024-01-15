import { Injectable } from '@angular/core';
import { WindowReferenceService } from './window-reference.service';

export interface DataLayerObj {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: any;
  ['gtm.elementId']?: string;
  ['gtm.elementClasses']?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GtmService {
  private window;

  constructor(private _windowRef: WindowReferenceService) {
    this.window = _windowRef.nativeWindow; // intialise the window to what we get from our window service
  }

  /* 
  GTM lo unico que hace es sumar eventos al objeto global dataLayer.
  acá esta el tutorial https://itbusinesshub.com/blog/integrate-google-tag-manager-in-angular-app/
  Para que GTM detecte eventos lo unico que hay que hacer es un push de un objeto nuevo al objeto datalayer.
  es mejor hacerlo de esta forma y no dejando que GTM detecte solo por la siguiente razon
  Event Bubbling: In Single Page Applications (SPAs) like Angular, the actual elements you see on the page might be dynamically generated or destroyed. If the element you're trying to track isn't present at the time GTM is initialized, the trigger might not work. You might need to ensure that the GTM trigger is set up to listen for clicks on a parent element and then use conditions to filter out the specific clicks you want to track. 
  */

  private pushToGTM(obj: DataLayerObj) {
    if (obj) this.window.dataLayer.push(obj);
  }

  gtmClick(id) {
    const gtmObj = {
      event: 'gtm.click',
      ['gtm.elementId']: id,
    };
    this.pushToGTM(gtmObj);
  }

  // las siguientes funciones no las estoy usando pero las dejo para muestra por si las llego a necesitar en un futuro
  logPageView(url: string) {
    const gtmObj = {
      event: 'content-view',
      pageName: url,
    };
    this.pushToGTM(gtmObj);
  }

  logEvent(event: string, category: string, action: string, label: string) {
    const gtmObj = {
      event: event,
      category: category,
      action: action,
      label: label,
    };
    this.pushToGTM(gtmObj);
  }
}
