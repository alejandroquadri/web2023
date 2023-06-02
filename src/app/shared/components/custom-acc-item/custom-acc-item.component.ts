import { CdkAccordionItem } from '@angular/cdk/accordion';
import { Component, Input, OnInit } from '@angular/core';
import {
  matExpansionAnimations,
  MatExpansionPanelState,
} from '@angular/material/expansion';

@Component({
  selector: 'app-custom-acc-item',
  templateUrl: './custom-acc-item.component.html',
  styleUrls: ['./custom-acc-item.component.scss'],
  animations: [matExpansionAnimations.bodyExpansion],
})
export class CustomAccItemComponent extends CdkAccordionItem implements OnInit {
  @Input() header: string;
  @Input() description: string;
  @Input() body: string;

  ngOnInit(): void {}

  getExpandedState(): MatExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }
}
