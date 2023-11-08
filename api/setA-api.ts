import { API_A, API_B } from './setA';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    constructor(private http: HttpClient) {}

    API_A(params?: API_A['params']) {
        const params = new HttpParams().appendAll(params);
        return this.http.get('api/a', params);
    }

    API_B(params?: API_B['params'], data?: API_B['data']) {
        const params = new HttpParams().appendAll(params);
        return this.http.get('api/b', params);
    }

}


