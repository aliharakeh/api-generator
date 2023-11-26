import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpOptions, APIs } from '../models/_api';
import { USER_ROLES, USER_NOTIFICATIONS } from '../endpoints/uers';
import { ApiResponse } from 'models/_api';
import { UserRoles } from 'models/user-roles';

@Injectable({
    providedIn: 'root'
})
export class UersApiService {

    constructor(private http: HttpClient) {}

    USER_ROLES(data: USER_ROLES['data'], params?: USER_ROLES['params'], options?: HttpOptions): Observable<ApiResponse<UserRoles>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.post(APIs.USER + '/roles', data, { params, ...options });
    }

    USER_NOTIFICATIONS(params?: USER_NOTIFICATIONS['params'], options?: HttpOptions): Observable<ApiResponse> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.get(APIs.USER + '/notifications', { params, ...options });
    }

}



