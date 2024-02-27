import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl: string = './assets/mock/olympic.json';
  private olympics$: BehaviorSubject<Olympic[]> = new BehaviorSubject<
    Olympic[]
  >([]);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((olympics: Olympic[]): void => {
        if (olympics && olympics.length) this.olympics$.next(olympics);
        else this.olympics$.next([]);
      }),
      catchError(
        (error: HttpErrorResponse): Observable<never> =>
          this.handleError(error),
      ),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent)
      errorMessage = `Erreur : ${error.error.message}`; // Erreur côté client
    else
      errorMessage = `Code d'erreur : ${error.status}, message : ${error.message}`; // Erreur côté serveur

    return throwError(() => errorMessage);
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getOlympicsByCountryName(
    selectedCountry: string,
  ): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        return olympics.find(
          (olympic: Olympic): boolean => olympic.country === selectedCountry,
        );
      }),
    );
  }
}
