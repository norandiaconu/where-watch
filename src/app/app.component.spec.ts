import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    let fixture: ComponentFixture<AppComponent>;
    let app: AppComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgxIndexedDBModule.forRoot(dbConfig), AppComponent],
            providers: [provideHttpClient(), { provide: environment, useValue: env }]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should have as title where-watch', () => {
        expect(app.title).toEqual('where-watch');
    });

    it('should render title', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.content span')?.textContent).toContain('WHEREWHEN');
    });

    it('should be empty', () => {
        const obj = {};
        const empty = app['isEmpty'](obj);
        expect(empty).toBeTruthy();
    });

    it('should not be empty', () => {
        const obj = {
            us: {}
        };
        const empty = app['isEmpty'](obj);
        expect(empty).toBeFalsy();
    });
});
