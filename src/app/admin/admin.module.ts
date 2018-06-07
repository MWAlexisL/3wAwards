import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared.module';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin.component';
import {AdminMenuComponent} from './admin-menu/admin-menu.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminMenuComponent
  ]
})
export class AdminModule {
}
