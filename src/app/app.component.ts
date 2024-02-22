import { Component, OnInit } from '@angular/core';
import { OlympicService } from './core/services/olympic.service';
import { take } from 'rxjs';
import { Olympic } from './core/models/Olympic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  protected errorMessage: string | undefined;
  olympics!: Olympic[];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService
      .loadInitialData()
      .pipe(take(1))
      .subscribe({
        next: (olympics: Olympic[]) => (this.olympics = olympics),
        error: (err) => (this.errorMessage = err.message),
      });
  }
}
