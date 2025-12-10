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

    //AUTH ENDPOINTS
    POST_LOGIN = '/api/v1/auth/login',
    POST_REGISTER = '/api/v1/auth/register',
    POST_LOGOUT = '/api/v1/auth/logout',
    POST_REFRESH = '/api/v1/auth/refresh'
    ,
    // CART ENDPOINTS
    POST_CART_ADD_ITEM = '/api/v1/cart/me/items',
    // AI Allergens suggestion
    POST_AI_ALLERGENS_SUGGEST = '/predict',
    // STAFF
    POST_STAFF = '/api/v1/staff'
}

// Enum for GET endpoint URLs (add your GET endpoints here)
export enum GetURL {
    // Example: FETCH_USERS = '/api/users'
    GET_RESTAURANT_MENU = '/api/v1/restaurantmenu',
    // CART
    GET_MY_CART = '/api/v1/cart/me',
    // ORDERS
    GET_MY_ORDERS = '/api/v1/orders/mine',
    GET_ORDERS = '/api/v1/orders',
    // STAFF
    GET_STAFF = '/api/v1/staff'
}

// Enum for PUT endpoint URLs (add your PUT endpoints here)
export enum PutURL {
    // Example: UPDATE_USER = '/api/user/update'
    PUT_RESTAURANT_MENU = '/api/v1/restaurantmenu',
    // CART
    PUT_CART_UPDATE_ITEM = '/api/v1/cart/me/items',
    // ORDERS
    PUT_ORDER_ITEM_STATUS = '/api/v1/orders',
    // STAFF
    PUT_STAFF = '/api/v1/staff',
    PUT_STAFF_STATUS = '/api/v1/staff'
}

// Enum for DELETE endpoint URLs (add your DELETE endpoints here)
export enum DeleteURL {
    // Example: REMOVE_USER = '/api/user/remove'
    DELETE_RESTAURANT_MENU = '/api/v1/restaurantmenu',
    // CART
    DELETE_CART_ITEM = '/api/v1/cart/me/items',
    DELETE_CART_CLEAR = '/api/v1/cart/me',
    // STAFF
    DELETE_STAFF = '/api/v1/staff'
}
