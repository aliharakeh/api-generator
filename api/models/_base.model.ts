export interface GET {
    url: string;
    params?: any;
    response: ResponseWrapper<any>;
}

export interface POST {
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
