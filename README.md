# Api Generator

This is small tool to generate different types of api request calls automatically through an api interface described
through typscript interfaces.

## It allows for the followings

- Define your apis in a clean way through ts interfaces and what types each paramerter has.
- Automatically generates the request functions for you from the api interfaces you provided.
- Automatically handles query params and convert them into the required query url
- Easier way to navigate you apis and know what each one needs and what the result it provides.

**Note: This tool only supports angular services for now.**

## How to Start

### 1) Customize you models

open `_api.ts` in the `api/models` folder and update it with your basic response interface and you api service
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

### 2) Add you apis

add your apis in the models folder next to the _api.ts in the formal of <name>.model.ts

```ts
import { GET, POST, ApiResponse, APIs } from './_base.model';

/** Example Model - Import your own model from your app */
interface User {
    // ...
}

export interface LOGIN extends POST<APIs.AUTH> {
    endpoint: 'login';
    data: {
        username: string;
        password: string;
    };
    response: ApiResponse<User>;
}

export interface LOGIN extends POST<APIs.AUTH> {
    endpoint: 'login';
    data: {
        username: string;
        password: string;
    };
    response: ApiResponse<User>;
}

export interface LOGOUT extends GET<APIs.AUTH> {
    endpoint: 'logout';
}
```

### 3) Run the tool

the tool will generate the request calls for you where you can import and use them in you app.
