import { Component, OnInit } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Participation } from '../../core/models/Participation';
import { LoaderService } from '../../core/services/loader.service';
import { SingleSerie } from '../../core/models/SingleSerie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  single: SingleSerie[] = [];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  protected errorMessage: string | undefined = '';
  olympics: Olympic[] = [];
  olympics$: Observable<Olympic[]> = of([]);

  constructor(
    private olympicService: OlympicService,
    private route: Router,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      tap(() => this.loaderService.showLoader()),
      delay(1000), //Simulation durée chargement des données
      tap((olympics: Olympic[]): void => {
        this.olympics = olympics;
        this.calculateTotalMedalsByCountry(olympics);
      }),
      tap(() => this.loaderService.hideLoader()),
      catchError((error: string) => {
        this.errorMessage = error;
        return [];
      }),
    );
  }

  onSelect(data: SingleSerie): void {
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

  toolTipFormat(input: { data: SingleSerie }): string {
    //&#129351; => Medal html code
    return `<p>${input.data.name}</p><p>&#129351;${input.data.value}</p>`;
  }
}
