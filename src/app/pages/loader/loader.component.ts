import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  constructor(private loaderService: LoaderService) {}

  isLoading$: Observable<boolean> = this.loaderService.isLoading$;

  ngOnInit(): void {}
}
