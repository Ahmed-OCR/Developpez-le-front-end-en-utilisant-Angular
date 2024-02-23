import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Participation } from '../../core/models/Participation';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  single: { name: string; value: number }[] = [];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  olympics: Olympic[] = [];

  sub: Subscription = new Subscription();

  constructor(
    private olympicService: OlympicService,
    private route: Router,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.olympicService
        .getOlympics()
        .pipe(
          tap(() => this.loaderService.showLoader()),
          delay(1500), //Simulation durée chargement des données
          tap((olympics: Olympic[]): void => {
            this.olympics = olympics;
            this.calculateTotalMedalsByCountry(olympics);
          }),
          tap(() => this.loaderService.hideLoader()),
        )
        .subscribe(),
    );
  }

  onSelect(data: any): void {
    this.route.navigateByUrl(`details/${data.name}`);
  }

  calculateTotalMedalsByCountry(olympic: Olympic[]): void {
    olympic.forEach((olympic: Olympic): void => {
      const totalMedals: number = olympic.participations.reduce(
        (acc: number, participation: Participation) => {
          return acc + participation.medalsCount;
        },
        0,
      );
      this.single.push({ name: olympic.country, value: totalMedals });
    });
  }

  getNbrJos(): number {
    const yearsSet: Set<number> = new Set();
    // Browse each country
    this.olympics.forEach((olympic: Olympic): void => {
      // Browse each participation by country
      olympic.participations.forEach((participation: Participation): void => {
        yearsSet.add(participation.year);
      });
    });
    return yearsSet.size;
  }

  toolTipFormat(input: any): string {
    //&#129351; => Medal html code
    return `<p>${input.data.name}</p><p>&#129351;${input.data.value}</p>`;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
