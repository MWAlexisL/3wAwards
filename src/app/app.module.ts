import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {BootstrapModule} from './bootstrap.module';
import {AuthService} from './auth.service';
import {AuthInterceptor} from './auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from './app.component';
import {RestangularModule} from 'ngx-restangular';
import {RestangularConfigFactory} from '../backend/services/RestangularConfigFactory';
import {
  AgenciesService,
  AwardsService,
  CategoriesService,
  ClientsService,
  CreditsService,
  ImagesService,
  MembersService,
  ProjectRatingMembersService,
  ProjectsService,
  RatingsService,
  TagsService,
  TypeAgenciesService,
  TypeTagsService,
  TargetsService,
  SiteTypesService
} from '../backend/services';
import {GlobalsService} from './globals.service';
import {FormService} from '../backend/forms';
import {RouterModule} from '@angular/router';
import {FrontModule} from './front/front.module';

export function createRestangularConfigFactory(RestangularProvider) {
  if (localStorage.getItem('user_token') !== null) {
    RestangularProvider.setDefaultHeaders({'Authorization': 'Bearer ' + localStorage.getItem('user_token')});
  }
  return RestangularConfigFactory(RestangularProvider, {baseUrl: 'http://127.0.0.1:8000'});
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BootstrapModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RestangularModule.forRoot([], createRestangularConfigFactory),
    RouterModule,
    FrontModule,
    AppRoutingModule
  ],
  providers: [
    AgenciesService,
    AwardsService,
    CategoriesService,
    ClientsService,
    CreditsService,
    ImagesService,
    MembersService,
    FormService,
    ProjectRatingMembersService,
    ProjectsService,
    RatingsService,
    TagsService,
    TargetsService,
    SiteTypesService,
    TypeAgenciesService,
    TypeTagsService,
    AuthService,
    GlobalsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
