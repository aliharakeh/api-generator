import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpOptions, APIs } from '../models/_api';
import { login, logout } from '../endpoints/auth';
import { ApiResponse } from '/api/models/_api';
import { User } from '/api/models/user';
import { UserRoles } from '/api/models/user-roles';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {

    constructor(private http: HttpClient) {}

    login(data: login['data'], params?: login['params'], options?: HttpOptions): Observable<ApiResponse<User>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.post(APIs.AUTH + '/login', data, { params, ...options });
    }

    logout(params?: logout['params'], options?: HttpOptions): Observable<ApiResponse<any>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.get(APIs.AUTH + '/logout', { params, ...options });
    }

}



