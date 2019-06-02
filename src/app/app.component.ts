import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './core/services/config.service';
import { Logger, LoggerFactoryService } from './core/services/logger-factory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  private logger: Logger;
  constructor(
    private translate: TranslateService,
    private config: ConfigService,
    private loggerFactory: LoggerFactoryService
  ) {
    this.logger = this.loggerFactory.getLogger('AppComponent');
  }
  title = 'angular-seed';

  ngOnInit() {

  }

  configTest() {
    const apiUrl = this.config.instant('apiUrl');
    console.log(apiUrl);

    this.logger.info('test test')
  }

 }
