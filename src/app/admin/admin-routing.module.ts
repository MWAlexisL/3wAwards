import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404Component} from '../error404/error404.component';
import {AdminComponent} from './admin.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {TableProjectsComponent} from './table-projects/table-projects.component';
import {TableParamComponent} from './table-param/table-param.component';
import {TableMembersComponent} from './table-members/table-members.component';
import {TableAwardsComponent} from './table-awards/table-awards.component';
import {AwardFormComponent} from './award-form/award-form.component';
import {TableJudgeComponent} from './table-judge/table-judge.component';
import {TableAgencyComponent} from './table-agency/table-agency.component';
import {TableClientComponent} from './table-client/table-client.component';
import {MemberFormComponent} from './member-form/member-form.component';
import {AdminGuard} from '../admin.guard';


const routes: Routes = [
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuard],
    children: [
      {path: '', component: AdminDashboardComponent},
      {path: 'projects', component: TableProjectsComponent},
      {path: 'params', component: TableParamComponent},
      {path: 'members', component: TableMembersComponent},
      {path: 'awards', component: TableAwardsComponent},
      {path: 'add-award', component: AwardFormComponent},
      {path: 'judge', component: TableJudgeComponent},
      {path: 'agency', component: TableAgencyComponent},
      {path: 'client', component: TableClientComponent},
      {path: 'add-member', component: MemberFormComponent},

    ]
  },
  {path: '404', component: Error404Component},
  {path: '**', redirectTo: '404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
