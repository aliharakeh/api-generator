import { API_A, API_B } from './setA';


@Injectable({
    providedIn: 'root'
})
export class APIService {

    constructor(private http: HttpClient) {}

    API_A(params?: API_A['params'], config?: HttpConfig): Observable<ResponseWrapper<any>> {
        params = new HttpParams().appendAll(params || {});
        return this.http.get('api/a', { params, ...config });
    }

    API_B(data: API_B['data'], params?: API_B['params'], config?: HttpConfig): Observable<ResponseWrapper<any>> {
        params = new HttpParams().appendAll(params || {});
        return this.http.post('api/b', data, { params, ...config });
    }

}



