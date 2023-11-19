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
