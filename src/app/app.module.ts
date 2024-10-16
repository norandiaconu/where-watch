import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './db';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, HttpClientModule, NgxIndexedDBModule.forRoot(dbConfig)],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
