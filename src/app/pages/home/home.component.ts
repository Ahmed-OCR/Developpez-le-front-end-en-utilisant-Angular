import { Component, OnInit } from '@angular/core';
import { filter, Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { Color, id, LegendPosition } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts/lib/common/types/scale-type.enum';
import { Router } from '@angular/router';

export var single = [
  {
    name: 'Germany',
    value: 8940000,
  },
  {
    name: 'USA',
    value: 5000000,
  },
  {
    name: 'France',
    value: 7200000,
  },
  {
    name: 'UK',
    value: 6200000,
  },
];
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  single!: any[];
  view: [number, number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  public olympics$: Observable<Olympic[]> = of([]);

  constructor(
    private olympicService: OlympicService,
    private route: Router,
  ) {
    Object.assign(this, { single });
  }

  olympics!: Olympic[];

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }

  onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    console.log(data);
    this.route.navigateByUrl(`details/${data.name}`);
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
