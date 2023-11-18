export interface GET<T> {
    url: string;
    params?: any;
    response: ResponseWrapper<any>;
}

export interface POST<T> {
    url: string;
    params?: any;
    data?: any;
    response: ResponseWrapper<any>;
}

export interface ResponseWrapper<T> {
    success: boolean;
    result: T;
    metaData: any;
}

export enum APIs {
    BASE = '/api/base',
    SERVICE_A = '/api/serviceA'
}
