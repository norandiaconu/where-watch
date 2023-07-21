import { Component } from '@angular/core';
import { z } from 'zod';
import { environment } from 'src/environments/environment';

const ZodApiResponse = z.array(z.object({
  title: z.string(),
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
export class AppComponent {
  title = 'where-watch';
  results: ZodApiResponse = [];

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
    console.log("results", result.result);
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

  isEmpty(obj: Object): boolean {
    return (obj && (Object.keys(obj).length === 0));
  }
}
