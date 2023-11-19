import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpOptions, APIs, ApiResponse } from '../models/_api';
import { login, logout } from '../models/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {

    constructor(private http: HttpClient) {}

    login(data: login['data'], params?: login['params'], options?: HttpOptions): Observable<ApiResponse<import("D:/Desktop/GitHub/api-generator/api/models/user").User>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.post(APIs.AUTH + '/login', data, { params, ...options });
    }

    logout(params?: logout['params'], options?: HttpOptions): Observable<ApiResponse<any>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.get(APIs.AUTH + '/logout', { params, ...options });
    }

}



