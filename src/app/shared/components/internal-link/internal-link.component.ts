import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-internal-link',
  templateUrl: './internal-link.component.html',
  styleUrls: ['./internal-link.component.scss'],
})
export class InternalLinkComponent implements OnInit {
  @Input() intRoutes: Array<{ name: string; route: string }>;

  constructor() {}

  ngOnInit(): void {}
}
