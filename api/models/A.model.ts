import { GET, POST, ResponseWrapper } from './_base.model';

export interface API_A extends GET {
    url: 'api/a';
    params: {
        id: number;
    };
    response: ResponseWrapper<any>;
}

export interface API_B extends POST {
    url: 'api/b';
    params: {
        id: number;
    };
    data: {
        b: number;
    };
    response: ResponseWrapper<any>;
}
