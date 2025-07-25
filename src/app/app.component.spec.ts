import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './db';

const env = {
    production: false,
    apiKey: '0',
    whenApiKey: '0'
};

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgxIndexedDBModule.forRoot(dbConfig), AppComponent],
            providers: [provideHttpClient(), { provide: environment, useValue: env }]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should have as title where-watch', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('where-watch');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.content span')?.textContent).toContain('WHEREWHEN');
    });
});
