import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './app/db';
import { AppComponent } from './app/app.component';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [importProvidersFrom(BrowserModule, NgxIndexedDBModule.forRoot(dbConfig)), provideHttpClient(withInterceptorsFromDi())]
}).catch((err) => console.error(err));
