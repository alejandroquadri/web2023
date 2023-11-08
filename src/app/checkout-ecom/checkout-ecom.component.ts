import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  Stripe,
  StripeAddressElement,
  StripeElements,
  StripeElementsOptionsClientSecret,
  StripeEmbeddedCheckout,
  StripeLinkAuthenticationElement,
  StripePaymentElement,
  loadStripe,
} from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_MN5DN6aYZWhTmOqTCHKrYmR500YEONxdKi', {
//   locale: 'en',
// });

import {
  EcomService,
  LanguageService,
  ServerDetectService,
  StripeService,
} from 'src/app/shared/services';
import {
  CartItem,
  StripeCustomerData,
  StripeItem,
} from 'src/app/shared/interfaces';
import { Cart, CheckoutEcomCopy } from 'src/app/shared/copy';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout-ecom',
  templateUrl: './checkout-ecom.component.html',
  styleUrls: ['./checkout-ecom.component.scss'],
})
export class CheckoutEcomComponent implements OnInit, AfterViewInit, OnDestroy {
  // copy = CheckoutEcomCopy;
  copy = Cart;
  lang: string;
  stripe: Stripe | null;
  // elements: StripeElements;
  // linkAuth: StripeLinkAuthenticationElement;
  // address: StripeAddressElement;
  // payment: StripePaymentElement;
  checkout: StripeEmbeddedCheckout;
  sessionId: string;
  shouldDestroyCheckout = true;
  env = environment.stripe;

  constructor(
    private stripeSc: StripeService,
    private router: Router,
    private langSc: LanguageService,
    private ecomSc: EcomService,
    private serverDetSc: ServerDetectService
  ) {}

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    if (this.serverDetSc.isBrowserSide()) {
      this.ecomSc.setCart();
    }
    this.initStripe();
  }

  ngOnDestroy(): void {
    console.log('saliendo');
    if (this.checkout && this.shouldDestroyCheckout) {
      console.log('saliendo y destruyo checkout');
      this.checkout.destroy();
    }
  }

  ngAfterViewInit(): void {}

  get cart() {
    return this.ecomSc.cart as CartItem[];
  }

  get cartObj() {
    return this.ecomSc.qObj;
  }

  async initStripe() {
    if (this.cart.length > 0) {
      this.stripe = await loadStripe(this.env.test_key, {
        locale: this.lang as 'es' | 'en',
      });
      if (this.stripe) {
        console.log('pasa stripe ');
        console.log(this.cartObj);

        const sesObj: any = await this.getCheckoutSession();
        console.log(sesObj);
        this.sessionId = sesObj.sessionId;
        this.checkout = await this.stripe.initEmbeddedCheckout({
          clientSecret: sesObj.clientSecret,
          onComplete: this.onComplete,
        });

        // Mount Checkout
        this.checkout.mount('#checkout');
      }
    }
  }

  getCheckoutSession() {
    const items: Array<any> = [];
    this.cart.forEach(item => {
      items.push({
        code: item.product.codigo,
        quantity: item.boxes,
        name: item.product.descripcion,
        unit_price: item.product.precioCajaEcom!,
        description: `${item.boxes} ${this.copy.boxes[this.lang]}`,
        picture_url: item.imageUrl,
      });
    });
    return firstValueFrom(this.stripeSc.embeddedFormCheckout(items));
  }

  onComplete = async () => {
    console.log('pago completo');
    this.shouldDestroyCheckout = false;
    this.checkout.destroy();
    this.router.navigate([`/${this.lang}/return`], {
      queryParams: { session_id: this.sessionId },
    });
    this.ecomSc.emptyCart();
  };
}

// async initStripeElements() {
//   if (this.serverDetSc.isBrowserSide() && this.cart.length === 0) {
//     await this.ecomSc.setCart();
//   }
//   if (this.cart.length > 0) {
//     this.stripe = await loadStripe(this.env.test_key, {
//       locale: this.lang as 'es' | 'en',
//     });
//     if (this.stripe) {
//       console.log('pasa stripe ');
//       console.log(this.cartObj);
//       // const { clientSecret } = await firstValueFrom(
//       //   this.stripeSc.createPaymentIntent(this.cartObj!.subTotal)
//       // );
//       // console.log('pasa payment intent', clientSecret);
//       const options: StripeElementsOptionsClientSecret = {
//         // Fully customizable with appearance API.
//         // clientSecret,
//         appearance: { theme: 'stripe' },
//       };
//       this.elements = this.stripe.elements(options);
//       // this.linkAuth = this.buildLinkAuth();
//       // this.payment = await this.buildPayment();
//       this.address = this.buildAddress();
//       // this.linkAuth.mount('#link-auth-element');
//       // this.payment.mount('#payment-element');
//       this.address.mount('#address-element');
//     }
//   }
// }

// buildLinkAuth() {
//   return this.elements.create('linkAuthentication');
// }

// buildAddress() {
//   return this.elements.create('address', {
//     mode: 'shipping',
//     allowedCountries: ['US'],
//     blockPoBox: true,
//     fields: {
//       phone: 'always',
//     },
//     validation: {
//       phone: {
//         required: 'always',
//       },
//     },
//     // locale: 'en',
//   });
// }

// async buildPayment() {
//   return this.elements.create('payment', {
//     layout: 'tabs',
//   });
// }

// async toPayment() {
//   const addressElement = this.elements.getElement('address');
//   const { complete, value } = await addressElement!.getValue();

//   if (complete) {
//     console.log(complete, value);
//     // Allow user to proceed to the next step
//     // Optionally, use value to store the address details
//     this.strippedCheckout(value);
//   }
// }

// strippedCheckout(customerData: StripeCustomerData) {
//   // todo
//   const items: Array<StripeItem> = [];
//   this.cart.forEach(item => {
//     items.push({
//       code: item.product.codigo,
//       quantity: item.boxes,
//       name: item.product.descripcion,
//       unit_price: item.product.precioCajaEcom!,
//       description: `${item.boxes} boxes`,
//       picture_url: item.imageUrl,
//     });
//   });
//   firstValueFrom(this.stripeSc.mixedCheckout(items, customerData)).then(
//     (res: any) => {
//       console.log(res);
//       window.location.href = res.url;
//       // this.ecomSc.emptyCart();
//     }
//   );
// }
