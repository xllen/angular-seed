import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class StartUpService {
    private readonly supportLangs = ['zh-CN', 'en-EN'];
    private readonly defaultLang = 'zh-CN';
    constructor(
        private config: ConfigService,
        private translate: TranslateService,
    ){}

    /**
     * 应用启动前，读取配置文件及设置相关服务
     * @param url 配置文件路径
     */
    public load(url?: string): Promise<any> {
        return new Promise( (resolve, reject) => {
            this.config.setConfigFileUrl(url);
            this.config.load().subscribe(() => {
                //设置语言
                let lang = this.config.instant('lang');

                if (!lang && this.isNotSupportLang(lang)) {
                    lang = this.defaultLang;
                }
                this.translate.use(lang);
                resolve();
            }, (err: HttpErrorResponse) => {
                reject();
            });

            
        });
    }

    private isNotSupportLang(lang: string) {
        return !this.supportLangs.includes(lang);
    }
}