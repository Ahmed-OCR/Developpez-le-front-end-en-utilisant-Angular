import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Olympic } from '../../core/models/Olympic';
import { Participation } from '../../core/models/Participation';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { tap } from 'rxjs/operators';

export var multi: {
  name: string;
  series: { name: string; value: number }[];
}[];

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  multi: { name: string; series: { name: string; value: number }[] }[] = [];
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
  olympic: Olympic[] = [];
  country: string = '';

  series: { name: string; value: number }[] = [];
  sub: Subscription = new Subscription();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    multi = [];
    this.country = this.route.snapshot.params['name'];

    this.olympics$ = this.olympicService.getOlympics();
    this.sub.add(
      this.olympics$
        .pipe(
          tap(
            (olympic: Olympic[]) =>
              (this.olympic = olympic.filter(
                (olympic: Olympic): boolean => olympic.country === this.country,
              )),
          ),
          tap(() => this.setChartDatas()),
        )
        .subscribe(),
    );
  }

  getNbrMedals(): number {
    let nbrMedals: number;
    nbrMedals = this.olympic[0].participations.reduce(
      (acc: number, participation: Participation) => {
        return acc + participation.medalsCount;
      },
      0,
    );
    return nbrMedals;
  }

  getNbrathletes(): number {
    let athleteCount: number;
    athleteCount = this.olympic[0].participations.reduce(
      (acc: number, participation: Participation) => {
        return acc + participation.athleteCount;
      },
      0,
    );
    return athleteCount;
  }

  getNbrJos(): number {
    return this.olympic[0]?.participations.length ?? 0;
  }

  setChartDatas(): void {
    this.olympic.forEach((olympic: Olympic): void => {
      olympic.participations.forEach((participation: Participation): void => {
        this.series.push({
          name: participation.year.toString(),
          value: participation.medalsCount,
        });
      });
    });
    multi.push({ name: 'Medals', series: this.series });
    Object.assign(this, { multi });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
