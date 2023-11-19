import { HttpParams, HttpClient, HttpHandler, HttpBackend } from '@angular/common/http';
import '@angular/compiler';

const params = new HttpParams({
    fromObject: {
        a: 1,
        b: 'steringd',
        c: [1, 2, 3, 4, 5, 6, 6, 6]
    }
});

console.log(params.toString());

const client = new HttpClient({} as any);
client.get('url', {

})
