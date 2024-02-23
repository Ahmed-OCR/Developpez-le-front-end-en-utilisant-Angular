import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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
      tap((value: Olympic[]) => this.olympics$.next(value)), // Met à jour les données olympiques en cas de succès
      catchError(this.handleError), // Gère les erreurs
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur : ${error.status}, message : ${error.message}`;
    }
    console.error(errorMessage);
    // Met à jour les données olympiques avec un tableau vide pour indiquer qu'il y a eu une erreur
    this.olympics$.next([]);
    return throwError(() => errorMessage); // Retourne une erreur observable
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getOlympic(olympics: Olympic[], country: string): Olympic {
    let olympic: Olympic[] = olympics.filter(
      (olympic: Olympic): boolean => olympic.country === country,
    );
    return olympic.length > 0 ? olympic[0] : new Olympic();
  }
}
