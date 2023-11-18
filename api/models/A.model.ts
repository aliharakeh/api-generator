import { GET, POST, ResponseWrapper, APIs } from './_base.model';

export interface API_A extends GET<APIs.BASE> {
    url: 'api/a';
    params: {
        id: number;
    };
    response: ResponseWrapper<any>;
}

export interface API_B extends POST<APIs.BASE> {
    url: 'api/b';
    params: {
        id: number;
    };
    data: {
        b: number;
    };
    response: ResponseWrapper<any>;
}
