import { Injectable } from '@angular/core';
import { HttpService } from './http/http.service';
import { ActivatedRoute } from '@angular/router';
import { ApiMethod, GetURL, PostURL, DeleteURL, PutURL } from './http/const';


/**
 * Service for handling common HTTP requests throughout the application.
 * 
 * This service is provided in the root injector, making it a singleton.
 * It utilizes the `HttpService` for making HTTP calls and `ActivatedRoute`
 * for accessing route-specific information.
 *
 * @remarks
 * Extend this service with methods to perform common HTTP operations
 * such as GET, POST, PUT, DELETE, etc.
 *
 * @param httpService - The service used to perform HTTP requests.
 * @param route - The current activated route, useful for accessing route parameters.
 */
@Injectable({
  providedIn: 'root'
})
export class CommonHttpRequestService {
  constructor(private httpService: HttpService, private route: ActivatedRoute) { }

  /**
   * Fetches data from a JSON file in the assets/data directory.
   * @param fileName The name of the JSON file (e.g., 'example.json')
   * @returns Observable<any>
   */
  getDataFromAssets(fileName: string) {
    const url = `assets/data/${fileName}`;
    return this.httpService.requestCall(url, ApiMethod.GET, {});
  }

 
  /**
   * Retrieves the restaurant menu by making a GET request to the appropriate API endpoint.
   * @returns An Observable containing the restaurant menu data.
   * @getdatafromassest
   */
  getRestaurantMenu() {
    return this.httpService.requestCall(GetURL.GET_RESTAURANT_MENU, ApiMethod.GET, {});
  }

  /**
   * Adds a new item to the restaurant menu by making a POST request to the appropriate API endpoint.
   * @param item The item to be added to the restaurant menu.
   * @returns An Observable containing the response from the server.
   */
  addRestaurantMenu(item: any) {
    return this.httpService.requestCall(PostURL.POST_RESTAURANT_MENU, ApiMethod.POST, {}, item);
  }

  /**
   * Updates an existing item in the restaurant menu by making a PUT request to the appropriate API endpoint.
   * @param itemId The ID of the item to be updated.
   * @param item The updated item data.
   * @returns An Observable containing the response from the server.
   */
  updateRestaurantMenu(item: any) {
    return this.httpService.requestCall(PutURL.PUT_RESTAURANT_MENU, ApiMethod.PUT, {}, item);
  }

  /**
   * Deletes an item from the restaurant menu by making a POST request to the appropriate API endpoint.
   * @param itemId The ID of the item to be deleted from the restaurant menu.
   * @returns An Observable containing the response from the server.
   */
  deleteRestaurantMenu(itemId: number) {
    return this.httpService.requestCall(DeleteURL.DELETE_RESTAURANT_MENU + `/${itemId}`, ApiMethod.DELETE, {});
  }
}