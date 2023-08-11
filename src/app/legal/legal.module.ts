import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsServiceComponent } from './terms-service/terms-service.component';
import { ReturnsComponent } from './returns/returns.component';

export const routes: Routes = [
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-service', component: TermsServiceComponent },
  { path: 'returns-shipping', component: ReturnsComponent },
  { path: 'politica-privacidad', component: PrivacyPolicyComponent },
  { path: 'terminos-condiciones', component: TermsServiceComponent },
  { path: 'devoluciones-envios', component: ReturnsComponent },
];

@NgModule({
  declarations: [
    PrivacyPolicyComponent,
    TermsServiceComponent,
    ReturnsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class LegalModule {}
