import {GET, POST} from './utils';

export interface API_A extends GET {
    url: 'api/a';
    params: {
        id: number;
    };
}

export interface API_B extends POST {
    url: 'api/b';
    params: {
        id: number;
    };
    data: {
        b: number;
    };
}
