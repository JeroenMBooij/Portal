import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from './common/modules/material.module';
import { ReactiveModule } from './common/modules/reactive.module';

import { MainButtonComponent } from './components/input/main-button/main-button.component';
import { ThemeSwitchComponent } from './components/input/theme-switch/theme-switch.component';
import { LanguageSwitchComponent } from './components/input/language-switch/language-switch.component';
import { HomeComponent } from './pages/home/home.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { ThreeTextComponent } from './components/three.js/three-text/three-text.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ThreeScrollComponent } from './components/three.js/three-scroll/three-scroll.component';



@NgModule({
  declarations: [
    AppComponent,
    MainButtonComponent,
    ThemeSwitchComponent,
    LanguageSwitchComponent,
    HomeComponent,
    OverviewComponent,
    ThreeTextComponent,
    ProjectsComponent,
    ThreeScrollComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    NgScrollbarModule,
    MaterialModule,
    ReactiveModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }


export function HttpLoaderFactory (http: HttpClient): TranslateHttpLoader
{
    if(environment.production)
        return new TranslateHttpLoader(http, '/Portal/assets/i18n/');
    else
        return new TranslateHttpLoader(http);
}