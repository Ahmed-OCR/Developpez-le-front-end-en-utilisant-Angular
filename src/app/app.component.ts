import { Component, OnInit } from '@angular/core';
import { OlympicService } from './core/services/olympic.service';
import { Observable, of, take } from 'rxjs';
import { Olympic } from './core/models/Olympic';
import { catchError, tap } from 'rxjs/operators';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  protected errorMessage: string | undefined = '';
  olympics!: Olympic[];
  olympics$: Observable<Olympic[]> = of([]);

  constructor(
    private olympicService: OlympicService,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.loadInitialData().pipe(
      take(1),
      tap(() => this.loaderService.showLoader()),
      tap((olympics: Olympic[]) => (this.olympics = olympics)),
      tap(() => this.loaderService.hideLoader()),
      catchError((error: string) => {
        this.errorMessage = error;
        return [];
      }),
    );
  }
}
