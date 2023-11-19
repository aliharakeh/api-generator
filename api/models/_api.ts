import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}

export interface GET<T> {
    url: string;
    params?: any;
    response: ApiResponse<any>;
}

export interface POST<T> {
    url: string;
    params?: any;
    data?: any;
    response: ApiResponse<any>;
}

/** Example: Can be Customized */
export interface ApiResponse<T> {
    result: T;
    metaData: any;
    success: boolean;
}

/** Example: Can be Customized */
export enum APIs {
    AUTH = '/auth',
    USER = '/user',
    APP_V1 = '/app/v1',
    APP_V2 = '/app/v2',
}
