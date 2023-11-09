export interface GET {
    utl: string;
    params?: any;
    response: ResponseWrapper<any>;
}

export interface POST {
    utl: string;
    params?: any;
    data?: any;
    response: ResponseWrapper<any>;
}

export interface ResponseWrapper<T> {
    success: boolean;
    result: T;
    metaData: any;
}
