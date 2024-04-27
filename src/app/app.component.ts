import { Component, OnInit } from '@angular/core';
import { z } from 'zod';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Select, Store } from '@ngxs/store';
import { AddLogin } from './login.actions';
import { Observable } from 'rxjs';
import { LoginState } from './login.state';

interface LoginResponse {
  data: {
    token: string
  }
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
  }
}
const ZodApiResponse = z.array(z.object({
  title: z.string(),
  year: z.optional(z.number()),
  firstAirYear: z.optional(z.number()),
  streamingInfo: z.object({
    us: z.optional(z.object({
      hbo: z.optional(z.array(z.object({
        type: z.string()
      }))),
      hulu: z.optional(z.array(z.object({
        type: z.string()
      }))),
      peacock: z.optional(z.array(z.object({
        type: z.string()
      }))),
      apple: z.optional(z.array(z.object({
        type: z.string()
      }))),
      prime: z.optional(z.array(z.object({
        type: z.string()
      }))),
      netflix: z.optional(z.array(z.object({
        type: z.string()
      })))
    }))
  })
}));
type ZodApiResponse = z.infer<typeof ZodApiResponse>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(LoginState.getLogin) login$?: Observable<string>;
  title = 'where-watch';
  results: ZodApiResponse = [];
  httpOptions = {
    headers: {
      Authorization: ""
    }
  };
  date: string = "";
  chosen = "";
  whenResults: SearchData[] = [];
  future = false;

  constructor(private readonly http: HttpClient, private readonly store: Store) {}

  ngOnInit(): void {
    if (this.httpOptions.headers.Authorization === "") {
      this.login$?.subscribe(response => {
        this.httpOptions.headers.Authorization = response;
      });
    }
  }

  async search(inputTitle: string): Promise<ZodApiResponse> {
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
    this.date = "";
    this.chosen = "";
    this.whenResults = [];
    this.results = result.result;
    return ZodApiResponse.parse(this.results);
  }

  checkWhere(locations: any): string[] {
    let where: string[] = [];
    Object.entries(locations).forEach((location: any) => {
      location[1].forEach((type: { type: string; }) => {
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
      });
    });
    return where;
  }

  login(): void {
    this.http.post<LoginResponse>("https://api4.thetvdb.com/v4/login", { apikey: environment.whenApiKey }).subscribe(response => {
      this.store.dispatch(new AddLogin(response.data.token));
      this.httpOptions.headers.Authorization = "Bearer " + response.data.token;
    });
  }

  searchWhen(searchTerm: string) {
    this.date = "";
    this.chosen = "";
    this.http
      .get<SearchResponse>("https://api4.thetvdb.com/v4/search?query=" + searchTerm + "&type=series&language=eng&limit=10", this.httpOptions)
      .subscribe(searchResponse => {
        this.results = [];
        this.whenResults = [];
        searchResponse.data.forEach(result => {
          this.whenResults.push(result);
        });
      });
  }

  lastAiring(searchData: SearchData): void {
    this.http.get<ResultData>("https://api4.thetvdb.com/v4/series/" + searchData.tvdb_id, this.httpOptions).subscribe(resultData => {
      this.chosen = "When to watch " + searchData.name + ":";
      this.date = resultData.data.lastAired;
      const today = new Date();
      this.future = Date.parse(this.date) > Date.parse(today.toString());
    });
  }

  isEmpty(obj: Object): boolean {
    return (obj && (Object.keys(obj).length === 0));
  }
}
