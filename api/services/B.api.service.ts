import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { API_A, API_B } from '../endpoints/auth';
import { HttpOptions, APIs, ResponseWrapper } from '../models/_api';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    constructor(private http: HttpClient) {}

    API_A(params?: API_A['params'], options?: HttpOptions): Observable<ApiResponse<any>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.get(APIs.BASE + '/api/a', { params, ...config });
    }

    API_B(data: API_B['data'], params?: API_B['params'], options?: HttpOptions): Observable<ApiResponse<any>> {
        params = new HttpParams({ fromObject: params || {} });
        return this.http.post(APIs.BASE + '/api/b', data, { params, ...config });
    }

}
