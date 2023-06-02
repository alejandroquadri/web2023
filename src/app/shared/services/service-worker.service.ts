// import { Injectable, isDevMode } from '@angular/core';
// import { SwUpdate, VersionEvent } from '@angular/service-worker';

// import { interval } from 'rxjs';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ServiceWorkerService {
//   update$ = new Subject();

//   constructor(private updates: SwUpdate) {
//     if (updates.isEnabled) {
//       interval(1000 * 60).subscribe(() => {
//         updates.checkForUpdate().then(update => {
//           if (update) {
//             this.checkForUpdates();
//             console.log('hay nueva actualizacion');
//           }
//         });
//       });
//     }
//   }

//   public checkForUpdates(): void {
//     if (!isDevMode()) {
//       this.updates.versionUpdates.subscribe((event: VersionEvent) => {
//         if (event.type === 'VERSION_READY') {
//           this.promptUser();
//         }
//         if (event.type === 'VERSION_DETECTED') {
//           console.log('descargando nueva version');
//         }
//         if (event.type === 'VERSION_INSTALLATION_FAILED') {
//           console.log('error instalando nueva version');
//         }
//       });
//     }
//   }

//   promptUser(): void {
//     this.update$.next(true);
//   }

//   updateVersion() {
//     console.log('updating to new version');
//     this.updates.activateUpdate().then(() => document.location.reload());
//   }
// }
