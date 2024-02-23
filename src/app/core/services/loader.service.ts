import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  // the auditTime Rxjs operator is to avoid the clipping when loader should be displayed a very short time
  isLoading$: Observable<boolean> = this.isLoading.asObservable();

  constructor() {}

  showLoader(): void {
    this.isLoading.next(true);
  }

  hideLoader(): void {
    this.isLoading.next(false);
  }
}
