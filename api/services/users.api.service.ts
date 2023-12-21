import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions, APIs, ApiResponse } from '../models/_api';
import { USER_ROLES, USER_NOTIFICATIONS } from '../endpoints/users';
import { UserRoles } from '../models/user-roles';

@Injectable({
    providedIn: 'root'
})
export class UsersApiService {

    constructor(private http: HttpClient) {}

    USER_ROLES(data: USER_ROLES['data'], params?: USER_ROLES['params'], options?: HttpOptions): Observable<ApiResponse<UserRoles<string>>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.post<ApiResponse<UserRoles<string>>>(APIs.USER + '/roles', data, { params, ...options });
    }

    USER_NOTIFICATIONS(params?: USER_NOTIFICATIONS['params'], options?: HttpOptions): Observable<ApiResponse<string[]>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.get<ApiResponse<string[]>>(APIs.USER + '/notifications', { params, ...options });
    }

}



