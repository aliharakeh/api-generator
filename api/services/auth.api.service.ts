import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions, APIs, ApiResponse } from '../models/_api';
import { login, logout } from '../endpoints/auth';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {

    constructor(private http: HttpClient) {}

    login(data: login['data'], params?: login['params'], options?: HttpOptions): Observable<ApiResponse<User>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.post<ApiResponse<User>>(APIs.AUTH + '/login', data, { params, ...options });
    }

    logout(params?: logout['params'], options?: HttpOptions): Observable<ApiResponse<any>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.get<ApiResponse<any>>(APIs.AUTH + '/logout', { params, ...options });
    }

}



