import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Olympic } from '../../core/models/Olympic';
import { Participation } from '../../core/models/Participation';
import { delay, Subscription } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { tap } from 'rxjs/operators';
import { DetailSerie } from '../../core/models/DetailSerie';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
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

  olympic!: Olympic;
  country: string = '';

  sub: Subscription = new Subscription();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.country = this.route.snapshot.params['name'];

    this.sub.add(
      this.olympicService
        .getOlympics()
        .pipe(
          tap(() => this.loaderService.showLoader()),
          delay(1500), //Simulation durée chargement des données
          tap((olympics: Olympic[]): void => {
            this.olympic = this.olympicService.getOlympic(
              olympics,
              this.country,
            );
          }),
          tap((): void => {
            if (this.olympic && this.olympic.id > 0) this.setChartDatas();
          }),
          tap(() => this.loaderService.hideLoader()),
        )
        .subscribe(),
    );
  }

  getNbrMedals(): number {
    let nbrMedals: number;
    nbrMedals = this.olympic?.participations.reduce(
      (acc: number, participation: Participation) => {
        return acc + participation.medalsCount;
      },
      0,
    );
    return nbrMedals ?? 0;
  }

  getNbrathletes(): number {
    let athleteCount: number;
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
