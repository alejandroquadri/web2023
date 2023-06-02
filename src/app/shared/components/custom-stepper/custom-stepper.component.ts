import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss'],
  /* ANGULAR: This custom stepper provides itself as CdkStepper so that it can be recognized
  / by other components. */
  /* ME: WTF why do you have to make this so complicated */
  providers: [{ provide: CdkStepper, useExisting: CustomStepperComponent }],
})
export class CustomStepperComponent extends CdkStepper implements OnInit {
  @Input() type: 'primary' | 'secondary';

  ngOnInit(): void {}

  onClick(index: number): void {
    this.selectedIndex = index;
  }
}
