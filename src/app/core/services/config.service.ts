import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, share, map, catchError } from 'rxjs/operators';

export interface Configuration {
    [configName: string]: string;
}

/**
 * 获取配置文件中的值
 */
@Injectable()
export class ConfigService {
    private url: string;
    private isRetrieved = false;
    private configuration: Configuration;
    constructor(
        private http: HttpClient
    ) {

    }

    // 异步获取配置
    public get(key: string): Observable<string>;
    public get(key: string[]): Observable<Configuration>;
    public get(key): any {
        return this.load().pipe(
            map( (config) => {
                if (key && typeof key  === 'string') {
                    return this.readConfig(config, key);
                } else if (key && key instanceof Array) {
                    return this.readConfigs(config, key);
                }
            })
        );
    }
    
    // 同步获取配置
    public instant(key: string): string;
    public instant(key: string[]): Configuration;
    public instant(key): any { 
        if (key && typeof key === 'string') {
            return this.readConfig(this.configuration, key);
        } else if (key instanceof Array) {
        return this.readConfigs(this.configuration, key);
        }
    }

    public setConfigFileUrl(url: string): void {
        this.url = url;
      }

    public load():Observable<Configuration> {
        if (this.checkConfig()) {
            return this.retrieveConfig();
        } else {
            return of(this.configuration)
        }
    }

    private retrieveConfig(): Observable<Configuration> {
        return this.http.get<Configuration>(this.url).pipe(
            catchError((response: HttpErrorResponse) => {
                return of({});
            }),
            tap((res) => {
                this.configuration = res;
                this.isRetrieved = true;
            }),
            share()
        );
    }

    private checkConfig(): boolean {
        return typeof this.configuration === 'undefined' && !this.isRetrieved;
    }

    private readConfig(config: Configuration, key: string): string {
        let result = '';
        if (config && key) {
          const value = config[key];
          result = value || '';
        }
        return result;
    }

    private readConfigs(config: Configuration, keys: string[]): Configuration {
        const result: Configuration = {};
        if (config && keys && keys instanceof Array && keys.length > 0) {
            keys.forEach(key => (result[key] = this.readConfig(config, key)));
        }
        return result;
    }
}
