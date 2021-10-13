import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  loading: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(private pokemonService: PokemonService) { }

  get page(): any {
    return this.pokemonService.page;
  }
  get size(): any {
    return this.pokemonService.size;
  }

  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  get pokemonsTemp(): any[] {
    return this.pokemonService.pokemonsTemp;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.loadData();
    }
    this.getData({ pageIndex: this.page, pageSize: this.size });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  loadData(): void {
    this.loading = true;
    this.subscription = this.pokemonService.getNext().subscribe(response => {
      this.pokemonService.next = response.next;
      const details = response.results.map((i: any) => this.pokemonService.get(i.name));
      this.subscription = concat(...details).subscribe((response: any) => {
        this.pokemonService.pokemons.push(response);
        this.pokemonService.pokemonsTemp.push(response);
      });
    }, error => console.log('Error Occurred:', error), () => this.loading = false);
  }

  getData(obj: any) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    this.pokemonService.page = obj.pageIndex;
    this.pokemonService.size = obj.pageSize;
    const data = this.pokemons.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.pokemonService.pokemonsTemp = data;
  }
}
