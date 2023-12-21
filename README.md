# Api Generator

This tool automatically generates API request functions from TypeScript interface definitions. It allows you to define APIs in a clean way using TypeScript interfaces, and handles details like query parameter encoding and request creation for you.

## Features
- Define APIs cleanly through TypeScript interfaces, specifying the types of each parameter.
- Automatically generate request functions from the API interfaces you provide.
- Automatically handle query parameters, encoding them into the required query URL format.
- More easily navigate your APIs to understand the inputs each one needs and the outputs it provides.


**Note: This tool only supports angular services for now.**

## How to Start

### 1) Customize your API Urls & Response

open `_api.ts` in the `api/models` folder and update it with your basic response interface and your api service
endpoints.

```ts
export interface ApiResponse<T> {
    result: T;
    metaData: any;
    success: boolean;
}

export enum APIs {
    AUTH = '/auth',
    USER = '/user',
    APP_V1 = '/app/v1',
    APP_V2 = '/app/v2',
}
```

### 2) Add you API Models
add your api models in the `models` folder in the formal of `<model>.ts`

```ts
// user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
```

```ts
// user-roles.ts
export interface UserRoles {
    roleId: number;
    roles: string[];
}
```

### 3) Add your APIs Endpoints
add your apis in the `endpoints` folder.

```ts
// users.ts
import { ApiResponse, APIs, GET, POST } from '../models/_api';
import { UserRoles } from '../models/user-roles';

export interface USER_ROLES extends POST<APIs.USER> {
    endpoint: 'roles';
    data: {
        id: number;
    };
    response: ApiResponse<UserRoles>;
}

export interface USER_NOTIFICATIONS extends GET<APIs.USER> {
    endpoint: 'notifications';
    response: ApiResponse<string[]>
}
```

```ts
// auth.ts
import { ApiResponse, APIs, GET, POST } from '../models/_api';
import { User } from '../models/user';

export interface login extends POST<APIs.AUTH> {
    endpoint: 'login';
    data: {
        username: string;
        password: string;
    };
    response: ApiResponse<User>;
}

export interface logout extends GET<APIs.AUTH> {
    endpoint: 'logout';
    // no params
    // response is ApiResponse<any> by default
}
```

### 3) Run the tool
Run the `generateApi()` function to generate your api services.

# Result
```ts
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
```

```ts
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
```
