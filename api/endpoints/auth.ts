import { ApiResponse, APIs, GET, POST } from '../models/_api';
import { User } from '../models/user';


export interface LOGIN extends POST<APIs.AUTH> {
    endpoint: 'login';
    data: {
        username: string;
        password: string;
    };
    response: ApiResponse<User>;
}

export interface LOGOUT extends GET<APIs.AUTH> {
    endpoint: 'logout';
    // no params
    // response is ApiResponse<any> by default
}
