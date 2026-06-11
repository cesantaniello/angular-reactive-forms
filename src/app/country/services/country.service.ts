import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay } from 'rxjs';
import { Country } from '../interfaces/country.interfaces';

@Injectable({providedIn: 'root'})

export class CountryService {
  // La API de restcountries.com fue deprecada (todas las versiones devuelven
  // error y el certificado está expirado). Usamos el dataset original sobre el
  // que se construyó restcountries (mledoze/countries) servido por jsDelivr.
  // Tiene la misma estructura: name.common, cca3, borders, region.
  private dataUrl = 'https://cdn.jsdelivr.net/gh/mledoze/countries@master/countries.json';
  private http = inject(HttpClient);

  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  // Se descarga una sola vez y se comparte entre todas las llamadas.
  private countries$ = this.http.get<Country[]>(this.dataUrl).pipe(
    shareReplay(1)
  );

  get regions(): string[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);
    return this.countries$.pipe(
      map((countries) => countries.filter((country) => country.region === region))
    );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<Country> {
    return this.countries$.pipe(
      map((countries) => countries.find((country) => country.cca3 === alphaCode)!)
    );
  }

  getCountryBordersByCodes(countryCodes: string[]): Observable<Country[]> {
    if (!countryCodes || countryCodes.length === 0) return of([]);

    return this.countries$.pipe(
      map((countries) =>
        countries.filter((country) => countryCodes.includes(country.cca3)))
    );
  }
}
