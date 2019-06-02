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
    this.translate.use('zh-CN');
    this.config.setConfigFileUrl('./../assets/config.json');
  }
  title = 'angular-seed';

  ngOnInit() {
    this.config.load().subscribe(() => {});
  }

  configTest() {
    const apiUrl = this.config.instant('apiUrl');
    console.log(apiUrl);
    window.open(apiUrl);
  }
 }
