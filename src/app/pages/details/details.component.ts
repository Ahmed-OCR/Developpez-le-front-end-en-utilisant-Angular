import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Olympic } from '../../core/models/Olympic';
import { Participation } from '../../core/models/Participation';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { tap } from 'rxjs/operators';
import { DetailSerie } from '../../core/models/DetailSerie';

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

  olympics$: Observable<Olympic[]> = of([]);
  olympic!: Olympic;
  country: string = '';

  sub: Subscription = new Subscription();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.country = this.route.snapshot.params['name'];

    this.olympics$ = this.olympicService.getOlympics();
    this.sub.add(
      this.olympics$
        .pipe(
          tap((): void => {
            this.olympic = this.olympicService.getOlympic(this.country);
          }),
          tap((): void => {
            if (this.olympic && this.olympic.id > 0) this.setChartDatas();
          }),
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
