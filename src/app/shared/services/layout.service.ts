import { Injectable } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xsmall'],
    [Breakpoints.Small, 'small'],
    [Breakpoints.Medium, 'medium'],
    [Breakpoints.Large, 'large'],
    [Breakpoints.XLarge, 'xlarge'],
  ]);

  currentScreenSize: string;

  constructor(private layout: BreakpointObserver) {}

  detectMobile(): Observable<boolean> {
    return this.layout
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(map((result: BreakpointState) => result.matches));
  }

  detectTablet(): Observable<boolean> {
    return this.layout
      .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape])
      .pipe(map((result: BreakpointState) => result.matches));
  }

  detectXl(): Observable<boolean> {
    return this.layout
      .observe([Breakpoints.XLarge])
      .pipe(map((result: BreakpointState) => result.matches));
  }

  detectL(): Observable<boolean> {
    return this.layout
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map((result: BreakpointState) => result.matches));
  }

  detectScreenSize() {
    return this.layout
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map((result: BreakpointState) => {
          let currentSize;
          for (const query of Object.keys(result.breakpoints)) {
            if (result.breakpoints[query]) {
              currentSize = this.displayNameMap.get(query) ?? 'Unknown';
            }
          }
          return currentSize;
        })
      );
  }
}
