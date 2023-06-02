import { LanguageService } from 'src/app/shared/services';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit {
  @Input() pricing: any;
  @Input() refPrices: any;
  @Input() currencySymbol: string;

  constructor(private langSc: LanguageService) {}

  ngOnInit(): void {}

  defLocale() {
    return this.langSc.defLocale();
  }
}
