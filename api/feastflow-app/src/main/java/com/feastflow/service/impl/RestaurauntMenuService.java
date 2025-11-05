package com.feastflow.service.impl;

import com.feastflow.model.RestaurantMenu;
import com.feastflow.repository.IRestaurantMenuRepository;
import com.feastflow.service.IRestaurantMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RestaurauntMenuService implements IRestaurantMenuService {

	@Autowired
	private IRestaurantMenuRepository restaurantMenuRepository;

	/**
	 * @param menuItem Menu item to save
	 * @return Saved menu item
	 */
	@Override
	public RestaurantMenu saveMenuItem(RestaurantMenu menuItem) {
		return restaurantMenuRepository.save(menuItem);
	}

	/**
	 * @return All menu items
	 */
	@Override
	public List<RestaurantMenu> getAllMenuItems() {
		return restaurantMenuRepository.findAll();
	}

	/**
	 * @param id Menu item ID
	 * @return Menu item wrapped in Optional
	 */
	@Override
	public Optional<RestaurantMenu> getMenuItemById(String id) {
		return restaurantMenuRepository.findById(id);
	}

	/**
	 * @param id          Menu item ID
	 * @param updatedItem Updated menu item data
	 * @return Updated menu item
	 */
	@Override
	public RestaurantMenu updateMenuItem(String id, RestaurantMenu updatedItem) {
		return restaurantMenuRepository.findById(id).map(existing -> {
			// Keep the existing id. Update other fields.
			existing.setItemName(updatedItem.getItemName());
			existing.setCategory(updatedItem.getCategory());
			existing.setPrice(updatedItem.getPrice());
			existing.setDescription(updatedItem.getDescription());
			existing.setAllergens(updatedItem.getAllergens());
			existing.setIngredients(updatedItem.getIngredients());
			return restaurantMenuRepository.save(existing);
		}).orElseThrow(() -> new RuntimeException("Menu item not found with id " + id));
	}

	/**
	 * @param id Menu item ID
	 * @return Deleted menu item
	 */
	@Override
	public RestaurantMenu deleteMenuItem(String id) {
		RestaurantMenu menuItem = restaurantMenuRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Menu item not found with id " + id));
		restaurantMenuRepository.deleteById(id);
		return menuItem;
	}
}
