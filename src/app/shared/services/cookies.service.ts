import { DateFnsService } from './date-fns.service';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  regLandingPage = '/[[(.*?)]]/'; // encuentra todo los que este entre [[ ]]
  regReferrer = '/((.*?))/'; // encuentra lo que esta entre ( )
  regCamp1 = '/[[^[[](.*?)]/'; // encuentr los que esta entre [ ] pero no [[ ]]
  regcomp2 = '/cr:[(.*?)]/'; // encuentra todo los que siga cr:[ hasta ]. Incluye los terminos de

  constructor(private cookieSc: CookieService, private dateSc: DateFnsService) {
    // this.getCookieObj();
  }

  setCookie(name, obj: string, path?: string) {
    const days = 30;
    return this.cookieSc.set(
      name,
      obj,
      days * 24 * 60 * 60 * 1000,
      path,
      undefined,
      true,
      'Strict'
    );
  }

  getCookie(name) {
    return this.cookieSc.get(name);
  }

  getAllCookies() {
    return this.cookieSc.getAll();
  }

  deleteCookie(name: string, path?: string) {
    this.cookieSc.delete(name, path);
  }

  getCookieObj() {
    const reff = this.cookieSc.get('__reff');
    const googleCookie = this.cookieSc.get('_ga');
    const cookieObj = {
      visits: this.parseCookie(reff),
      gaid: googleCookie,
    };
    return cookieObj;
  }

  parseCookie(cookie: string) {
    const array = cookie.split('|');
    const cookieArray = new Array();
    array.forEach(visit => {
      const splitFirst = visit.split('&');
      const refDetails = splitFirst[0];

      if (splitFirst[1]) {
        const timeDetails = splitFirst[1].replace(/\./g, '&').split('&');
        const visitObj = {
          // visitStart: moment(new Date(Number(timeDetails[0]))).format(),
          // lastAction: moment(new Date(Number(timeDetails[1]))).format(),
          visitStart: this.dateSc.getFormatedDate(
            new Date(Number(timeDetails[0]))
          ),
          lastAction: this.dateSc.getFormatedDate(
            new Date(Number(timeDetails[1]))
          ),
          pagesViewed: Number(timeDetails[2]),
          landingPage: this.parseLandingPage(refDetails),
          ...this.parseReferral(refDetails),
        };
        cookieArray.push(visitObj);
      }
    });
    return cookieArray;
  }

  parseLandingPage(visit: string): string | null {
    const match = visit.match(/\[\[(.*?)\]\]/g)![0];
    return match ? match.substr(2, match.length - 4) : null;
  }

  parseReferral(visit: string) {
    const start = visit.search(']]') + 2;
    const referral = visit.substr(start);
    const refObj: any = {
      referral,
    };
    if (referral.search('campaign') !== -1) {
      if (referral.search('cr:') !== -1) {
        refObj.referral = this.parseCampaign(referral, 'cr:');
      } else {
        refObj.referral = this.parseCampaign(referral, 'c:');
      }
      refObj.source = this.parseCampaign(referral, 's:');
      refObj.medium = this.parseCampaign(referral, 'm:');
    }
    return refObj;
  }

  parseCampaign(campaign: string, type: string): string {
    const regex = RegExp(type + '\\[(.*?)\\]');
    const match = campaign.match(regex);
    return match![1];
  }
}

// testCookie = '[[quadri.com.ar/]](direct)&1583590263606.1583590771233.2|[[quadri.com.ar/productos/losetas/]]campaign::cr:[EAIaIQobChMIlvq_i8iI6AIVkorICh090wUrEAAYASAAEgKpv_D_BwE]m:[paid]s:[adwords]&1583590263606.1583590980839.3|[[quadri.com.ar/productos/losetas/rusticato]]ar.pinterest.com&1583590263606.1583592541310.5|[[quadri.com.ar/]](direct)&1583605916275.1583606738746.11';
