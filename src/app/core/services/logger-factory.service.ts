import { Injectable } from "@angular/core";
import { JL } from 'jsnlog';
import { environment } from 'src/environments/environment';

declare var electron: electron;

export interface Logger {
    /**
     * 追踪信息（发布模式不会记录）
     * @param logObject - 日志对象
     */
    trace(logObject: any): void;

    /**
     * 调试信息（发布模式不会记录）
     * @param logObject - 日志对象
     */
    debug(logObject: any): void;

    /**
     * 普通信息
     * @param logObject - 日志对象
     */
    info(logObject: any): void;

    /**
     * 警告
     * @param logObject - 日志对象
     */
    warn(logObject: any): void;

    /**
     * 错误
     * @param logObject - 日志对象
     */
    error(logObject: any): void;

    /**
     * 严重错误
     * @param logObject - 日志对象
     */
    fatal(logObject: any): void;
}

class MockLogger implements Logger {
    trace(logObject: any): void {}
    debug(logObject: any): void {}
    info(logObject: any): void {}
    warn(logObject: any): void {}
    error(logObject: any): void {}
    fatal(logObject: any): void {}
}

class MainProcessAppender implements JL.JSNLogAppender {
    private logger: Logger;
    constructor() {
        if (this.isElectron()) {
            this.logger = electron.remote.getGlobal('logger');
        } else {
            this.logger = new MockLogger();
        }
    }
    setOptions(options: JL.JSNLogAjaxAppenderOptions): JL.JSNLogAppender {
        return this;
    }

    public log(level: string, msg: string, callback: () => void, levelNbr: number, message: string, loggerName: string): void {
        this.logger[level](`[${loggerName}] ${message}`);
    }

    public isElectron() {
        return window && window['process'] && window['process']['type'] === 'renderer';
    }
}

@Injectable()
export class LoggerFactoryService {
    private appenders: JL.JSNLogAppender[] = [];

    public setConfig(logSvrUrl: string): void {
        JL.setOptions({
            requestId: 'angular-seed',
            enabled: true
        });

        const consoleAppender = JL.createConsoleAppender('consoleAppender');
        this.appenders.push(consoleAppender);

        const minProcessAppender = new MainProcessAppender();
        this.appenders.push(minProcessAppender);

        if (environment.production && logSvrUrl) {
            const ajaxAppender = JL.createAjaxAppender('ajaxAppender');
            ajaxAppender.setOptions({
                url: logSvrUrl
            });
            this.appenders.push(ajaxAppender);
        }

        JL().setOptions({
            appenders: this.appenders
        });
    }

    getLogger(categoryName: string = 'app'): Logger {
        return JL(categoryName);
    }
}