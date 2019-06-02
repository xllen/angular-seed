import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private translate: TranslateService,
    private config: ConfigService
  ) {
  }
  title = 'angular-seed';

  ngOnInit() {

  }

  configTest() {
    const apiUrl = this.config.instant('apiUrl');
    console.log(apiUrl);
  }
 }
