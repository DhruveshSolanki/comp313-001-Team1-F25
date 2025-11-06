// Enum for supported HTTP methods used in API requests
export enum ApiMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

// Enum for POST endpoint URLs (add your POST endpoints here)
export enum PostURL {
    // Example: CREATE_USER = '/api/user/create'
    POST_RESTAURANT_MENU = '/api/v1/restaurantmenu',
}

// Enum for GET endpoint URLs (add your GET endpoints here)
export enum GetURL {
    // Example: FETCH_USERS = '/api/users'
    GET_RESTAURANT_MENU = '/api/v1/restaurantmenu'
}

// Enum for PUT endpoint URLs (add your PUT endpoints here)
export enum PutURL {
    // Example: UPDATE_USER = '/api/user/update'
    PUT_RESTAURANT_MENU = '/api/v1/restaurantmenu'
}

// Enum for DELETE endpoint URLs (add your DELETE endpoints here)
export enum DeleteURL {
    // Example: REMOVE_USER = '/api/user/remove'
    DELETE_RESTAURANT_MENU = '/api/v1/restaurantmenu'
}
