import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Participation } from '../../core/models/Participation';

export var single: { name: string; value: number }[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  single: { name: string; value: number }[] = [];
  // view: [number, number] = [700, 400];
  // options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  public olympics$: Observable<Olympic[]> = of([]);

  constructor(
    private olympicService: OlympicService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.olympicService
      .getOlympics()
      .pipe(
        tap((olympic: Olympic[]): void => {
          const countriesData: Olympic[] = JSON.parse(JSON.stringify(olympic));
          this.calculateTotalMedalsByCountry(countriesData);
        }),
      )
      .subscribe();
  }

  onSelect(data: any): void {
    console.log(data);
    this.route.navigateByUrl(`details/${data.name}`);
  }

  // onActivate(data: any): void {
  //   console.log('Activate', JSON.parse(JSON.stringify(data)));
  // }
  //
  // onDeactivate(data: any): void {
  //   console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  // }

  calculateTotalMedalsByCountry(olympic: Olympic[]): void {
    olympic.forEach((country: Olympic): void => {
      const totalMedals: number = country.participations.reduce(
        (acc: number, participation: Participation) => {
          return acc + participation.medalsCount;
        },
        0,
      );

      const totalathlete: number = country.participations.reduce(
        (acc: number, participation: Participation) => {
          return acc + participation.athleteCount;
        },
        0,
      );

      single.push({ name: country.country, value: totalMedals });
      Object.assign(this, { single });
    });
  }
}
