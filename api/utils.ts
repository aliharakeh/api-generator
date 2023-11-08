export interface GET {
    utl: string;
    params?: any;
}

export interface POST extends GET {
    data?: any;
}
