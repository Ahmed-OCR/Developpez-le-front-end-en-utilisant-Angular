import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Olympic } from '../../core/models/Olympic';
import { Participation } from '../../core/models/Participation';
import { delay, Observable } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { tap } from 'rxjs/operators';
import { DetailSerie } from '../../core/models/DetailSerie';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  multi: { name: string; series: DetailSerie[] }[] = [];
  // options
  legend: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Years';
  yAxisLabel: string = 'Medals';
  timeline: boolean = true;

  olympic!: Olympic | undefined;
  selectedCountry: string = '';

  olympic$!: Observable<Olympic | undefined>;

  constructor(
    private olympicService: OlympicService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.selectedCountry = this.activatedRoute.snapshot.params['name'];
    this.olympic$ = this.olympicService
      .getOlympicsByCountryName(this.selectedCountry)
      .pipe(
        tap(() => this.loaderService.showLoader()),
        delay(1000), //Simulation durée chargement des données
        tap((olympic: Olympic | undefined) => (this.olympic = olympic)),
        tap((): void => {
          if (this.olympic !== undefined) this.setChartDatas();
          else this.route.navigateByUrl(`not-found`);
        }),
        tap(() => this.loaderService.hideLoader()),
      );
  }

  getNbrMedals(): number {
    let nbrMedals: number | undefined;
    nbrMedals = this.olympic?.participations.reduce(
      (acc: number, participation: Participation) => {
        return acc + participation.medalsCount;
      },
      0,
    );
    return nbrMedals ?? 0;
  }

  getNbrathletes(): number {
    let athleteCount: number | undefined;
    athleteCount = this.olympic?.participations.reduce(
      (acc: number, participation: Participation) => {
        return acc + participation.athleteCount;
      },
      0,
    );
    return athleteCount ?? 0;
  }

  getNbrJos(): number {
    return this.olympic?.participations.length ?? 0;
  }

  setChartDatas(): void {
    const series: DetailSerie[] =
      this.olympic?.participations.map(
        (participation: Participation): DetailSerie => ({
          name: participation.year.toString(),
          value: participation.medalsCount,
        }),
      ) || [];
    this.multi = [{ name: 'Medals', series }];
  }
}
