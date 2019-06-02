import { Optional, SkipSelf, NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ConfigService } from './services/config.service';
import { StartUpService } from './services/startup.service';
import { LoggerFactoryService } from './services/logger-factory.service';
import { GlobalErrorHandler } from './services/error-handler';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function StartUpServiceFactory(startUp: StartUpService) {
    return () => startUp.load('./assets/config.json')
                .catch(error => console.error(error));
}

@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    exports: [
        TranslateModule
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
        ConfigService,
        StartUpService,
        LoggerFactoryService,
        {
            provide: APP_INITIALIZER,
            useFactory: StartUpServiceFactory,
            deps: [StartUpService],
            multi: true
        }
    ]
})

export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded, Import it in the AppModule only');
        }
    }
}