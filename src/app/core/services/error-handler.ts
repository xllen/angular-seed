import { Injectable, ErrorHandler } from "@angular/core";
import { Logger, LoggerFactoryService } from './logger-factory.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private logger: Logger;
    constructor(
        private loggerFactory: LoggerFactoryService
    ) {
        this.logger = this.loggerFactory.getLogger('GlobalErrorHandler');
    }

    /**
     * 捕获异常
     */
    public handleError(error: any): void {
        this.logger.fatal(error.message);
        this.logger.fatal(error.stack);
    }
}
