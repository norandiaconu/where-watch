import { Component, inject } from '@angular/core';
import { z } from 'zod';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, of, tap } from 'rxjs';
import { NgTemplateOutlet, NgClass } from '@angular/common';

interface LoginResponse {
    data: {
        token: string;
    };
}
interface SearchResponse {
    data: SearchData[];
}
interface SearchData {
    name: string;
    tvdb_id: string;
}
interface ResultData {
    data: {
        lastAired: string;
    };
}
const ZodApiResponse = z.array(
    z.object({
        title: z.string(),
        year: z.optional(z.number()),
        firstAirYear: z.optional(z.number()),
        streamingInfo: z.object({
            us: z.optional(
                z.object({
                    hbo: z.optional(
                        z.array(
                            z.object({
                                type: z.string()
                            })
                        )
                    ),
                    hulu: z.optional(
                        z.array(
                            z.object({
                                type: z.string()
                            })
                        )
                    ),
                    peacock: z.optional(
                        z.array(
                            z.object({
                                type: z.string()
                            })
                        )
                    ),
                    apple: z.optional(
                        z.array(
                            z.object({
                                type: z.string()
                            })
                        )
                    ),
                    prime: z.optional(
                        z.array(
                            z.object({
                                type: z.string()
                            })
                        )
                    ),
                    netflix: z.optional(
                        z.array(
                            z.object({
                                type: z.string()
                            })
                        )
                    ),
                    paramount: z.optional(
                        z.array(
                            z.object({
                                type: z.string()
                            })
                        )
                    )
                })
            )
        })
    })
);
type ZodApiResponse = z.infer<typeof ZodApiResponse>;
interface Entry {
    id: number;
    token: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [NgTemplateOutlet, NgClass]
})
export class AppComponent {
    protected results: ZodApiResponse = [];
    protected httpOptions = {
        headers: {
            Authorization: ''
        }
    };
    public title = 'where-watch';
    protected date = '';
    protected chosen = '';
    protected whenResults: SearchData[] = [];
    protected future = false;

    private readonly http = inject(HttpClient);
    private readonly db = inject(NgxIndexedDBService);

    constructor() {
        this.db.getAll<Entry>('login').subscribe((entries: Entry[]) => {
            this.httpOptions.headers.Authorization = entries[0]?.token;
        });
    }

    protected async search(inputTitle: string): Promise<ZodApiResponse> {
        const url = `https://streaming-availability.p.rapidapi.com/v2/search/title?title=${inputTitle}&country=us`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': environment.apiKey,
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };
        const response = await fetch(url, options);
        const result = await response.json();
        this.date = '';
        this.chosen = '';
        this.whenResults = [];
        this.results = result.result;
        return ZodApiResponse.parse(this.results);
    }

    protected checkWhere(locations: any): string[] {
        const where: string[] = [];
        Object.entries(locations).forEach((location: any) => {
            location[1].forEach((type: { type: string }) => {
                if (location[0] === 'hbo' && type.type === 'subscription') {
                    where.push(location[0]);
                }
                if (location[0] === 'hulu' && type.type === 'subscription') {
                    where.push(location[0]);
                }
                if (location[0] === 'peacock' && type.type === 'subscription') {
                    where.push(location[0]);
                }
                if (location[0] === 'apple' && type.type === 'subscription') {
                    where.push(location[0]);
                }
                if (location[0] === 'prime' && type.type === 'subscription') {
                    where.push(location[0]);
                }
                if (location[0] === 'netflix' && type.type === 'subscription') {
                    where.push(location[0]);
                }
                if (location[0] === 'paramount' && type.type === 'subscription') {
                    where.push(location[0]);
                }
            });
        });
        return where;
    }

    protected login(): void {
        this.http
            .post<LoginResponse>('https://api4.thetvdb.com/v4/login', {
                apikey: environment.whenApiKey
            })
            .subscribe((response) => {
                this.db
                    .update('login', {
                        id: 0,
                        token: response.data.token
                    })
                    .subscribe();
                this.httpOptions.headers.Authorization = 'Bearer ' + response.data.token;
            });
    }

    protected searchWhen(searchTerm: string) {
        this.date = '';
        this.chosen = '';
        this.http
            .get<SearchResponse>(
                'https://api4.thetvdb.com/v4/search?query=' + searchTerm + '&type=series&language=eng&limit=10',
                this.httpOptions
            )
            .pipe(
                catchError((err) => of(err)),
                tap((searchResponse) => {
                    this.results = [];
                    this.whenResults = [];
                    if (searchResponse.status === 'success') {
                        searchResponse.data.forEach((result: SearchData) => {
                            this.whenResults.push(result);
                        });
                    } else {
                        this.httpOptions.headers.Authorization = '';
                        this.db
                            .update('login', {
                                id: 0,
                                token: ''
                            })
                            .subscribe();
                    }
                })
            )
            .subscribe();
    }

    protected lastAiring(searchData: SearchData): void {
        this.http.get<ResultData>('https://api4.thetvdb.com/v4/series/' + searchData.tvdb_id, this.httpOptions).subscribe((resultData) => {
            this.chosen = 'When to watch ' + searchData.name + ':';
            this.date = resultData.data.lastAired;
            const today = new Date();
            this.future = Date.parse(this.date) > Date.parse(today.toString());
        });
    }

    protected isEmpty(obj: object): boolean {
        return obj && Object.keys(obj).length === 0;
    }
}
