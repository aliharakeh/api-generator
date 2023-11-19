import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpOptions, APIs, ApiResponse } from '../models/_api';
import { USER_ROLES, USER_NOTIFICATIONS } from '../models/uers';

@Injectable({
    providedIn: 'root'
})
export class UersApiService {

    constructor(private http: HttpClient) {}

    USER_ROLES(data: USER_ROLES['data'], params?: USER_ROLES['params'], options?: HttpOptions): Observable<ApiResponse<import("D:/Desktop/GitHub/api-generator/api/models/user-roles").UserRoles>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.post(APIs.USER + '/roles', data, { params, ...options });
    }

    USER_NOTIFICATIONS(params?: USER_NOTIFICATIONS['params'], options?: HttpOptions): Observable<ApiResponse<string[]>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.get(APIs.USER + '/notifications', { params, ...options });
    }

}



