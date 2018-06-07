import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './front/home/home.component';
import {AgencyProfileComponent} from './front/agency-profile/agency-profile.component';
import {ClientProfileComponent} from './front/client-profile/client-profile.component';
import {MemberProfileComponent} from './front/member-profile/member-profile.component';
import {ProjectProfileComponent} from './front/project-profile/project-profile.component';
import {ProjectFormComponent} from './front/project-form/project-form.component';
import {AddAgencyComponent} from './front/add-agency/add-agency.component';
import {ProjectFormVoteComponent} from './front/project-form-vote/project-form-vote.component';
import {UpdateProjectFormComponent} from './front/update-project-form/update-project-form.component';
import {SearchResultComponent} from './front/search-result/search-result.component';


const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'admin', component: AdminPageComponent},
    {path: 'agency/:id', component: AgencyProfileComponent},
    {path: 'client/:id', component: ClientProfileComponent},
    {path: 'project/:id', component: ProjectProfileComponent},
    {path: 'updateProject/:id', component: UpdateProjectFormComponent},
    {path: 'project/:id/vote', component: ProjectFormVoteComponent},
    {path: 'profile', component: MemberProfileComponent},
    {path: 'project', component: ProjectFormComponent},
    {path: 'addAgency', component: AddAgencyComponent},
    {path: 'search/:searchValue', component: SearchResultComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
