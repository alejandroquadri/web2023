import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-specs',
  templateUrl: './specs.component.html',
  styleUrls: ['./specs.component.scss'],
})
export class SpecsComponent implements OnInit {
  @Input() specs: any;

  constructor() {}

  ngOnInit(): void {}
}
