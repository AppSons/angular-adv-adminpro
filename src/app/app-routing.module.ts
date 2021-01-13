import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PageRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  
  imports: [
    RouterModule.forRoot( routes ),
    PageRoutingModule,
    AuthRoutingModule
  ], 
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
