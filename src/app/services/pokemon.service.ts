import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private url: string = environment.apiUrl + 'pokemon/';
  private _pokemons: any[] = [];
  private _pokemonsTemp: any[] = [];
  private _page = 0;
  private _size = 150;
  private _next: string = '';

  constructor(private http: HttpClient) {
  }

  get page(): any {
    return this._page;
  }

  set page(p) {
    this._page = p;
  }

  get size(): any {
    return this._size;
  }

  set size(p) {
    this._size = p;
  }

  get pokemons(): any[] {
    return this._pokemons;
  }

  get pokemonsTemp(): any[] {
    return this._pokemonsTemp;
  }

  set pokemonsTemp(list) {
    this._pokemonsTemp = [];
    this._pokemonsTemp = list;
  }

  get next(): string {
    return this._next;
  }

  set next(next: string) {
    this._next = next;
  }

  getType(pokemon: any): string {
    return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';
  }

  get(name: string): Observable<any> {
    const url = `${this.url}${name}`;
    return this.http.get<any>(url);
  }

  getNext(): Observable<any> {
    const url = this.next === '' ? `${this.url}?limit=150` : this.next;
    return this.http.get<any>(url);
  }

  getEvolution(id: number): Observable<any> {
    const url = `${environment.apiUrl}evolution-chain/${id}`;
    return this.http.get<any>(url);
  }

  getSpecies(name: string): Observable<any> {
    const url = `${environment.apiUrl}pokemon-species/${name}`;
    return this.http.get<any>(url);
  }
}
