import { EcomService } from 'src/app/shared/services';
import { Component, Input } from '@angular/core';

import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-prod-accordion',
  templateUrl: './prod-accordion.component.html',
  styleUrls: ['./prod-accordion.component.scss'],
  animations: [
    trigger('contentExpansion', [
      state(
        'expanded',
        style({ height: '*', opacity: 1, visibility: 'visible' })
      ),
      state(
        'collapsed',
        style({ height: '0px', opacity: 0, visibility: 'hidden' })
      ),
      transition(
        'expanded <=> collapsed',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')
      ),
    ]),
  ],
})
export class ProdAccordionComponent {
  @Input() copy: any;
  @Input() lang: any;
  @Input() prodSpecs: any;
  @Input() fullWidth: boolean;

  type: string;

  constructor(public ecomSc: EcomService) {
    this.type = this.ecomSc.isEcom ? 'ecom' : 'local';
  }
}
