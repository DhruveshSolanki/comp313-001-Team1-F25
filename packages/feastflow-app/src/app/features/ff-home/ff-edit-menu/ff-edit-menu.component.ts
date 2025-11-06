import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { AddMenuItem, EditMenuItem } from 'src/app/store/menu/menu.actions';

@Component({
  selector: 'ff-edit-menu',
  templateUrl: './ff-edit-menu.component.html',
  styleUrls: ['./ff-edit-menu.component.css']
})
export class FfEditMenuComponent implements OnInit {

  @Input() isEditable: boolean = false;
  @Input() menuItem: any;
  @Input() categories: any;
  allergen: string = '';
  ingredient: string = '';

  menuItemForm!: FormGroup;

  constructor(private store: Store, private sideBarTitleService: SideBarTitleService) {
    this.menuItemForm = new FormGroup({
      itemName: new FormControl(this.menuItem?.itemName || '', Validators.required),
      category: new FormControl(this.menuItem?.category || '', Validators.required),
      price: new FormControl(this.menuItem?.price || 0, [Validators.required, Validators.min(0)]),
      description: new FormControl(this.menuItem?.description || '', Validators.required),
      allergens: new FormArray(this.menuItem?.allergens.map((warning: any) => new FormControl(warning)) || []),
      ingredients: new FormArray(this.menuItem?.ingredients.map((ingredient: any) => new FormControl(ingredient)) || []),
      newAllergen: new FormControl(''),
      newIngredient: new FormControl('')
    });
  }

  ngOnInit() {
    if (this.isEditable) {
      this.menuItemForm.patchValue({
        itemName: this.menuItem.itemName,
        category: this.menuItem.category,
        price: this.menuItem.price,
        description: this.menuItem.description
      });

      // Reset and repopulate allergyWarnings FormArray
      this.allergens.clear();
      (this.menuItem.allergens || []).forEach((warning: any) => {
        this.allergens.push(new FormControl(warning));
      });

      // Reset and repopulate ingredients FormArray
      this.ingredients.clear();
      (this.menuItem.ingredients || []).forEach((ingredient: any) => {
        this.ingredients.push(new FormControl(ingredient));
      });
    }
  }

  /** Getters for FormArrays */
  get allergens(): FormArray {
    return this.menuItemForm.get('allergens') as FormArray;
  }

  get ingredients(): FormArray {
    return this.menuItemForm.get('ingredients') as FormArray;
  }

  /** Add a warning from the newWarning control */
  addWarning(editMode: boolean = false, index: number | null = null) {
      if (editMode && index !== null) {
        const warning = this.allergens.at(index).value;
        this.menuItemForm.get('newAllergen')?.setValue(warning);
        this.allergens.removeAt(index);
      } else {
        const warning = this.menuItemForm.get('newAllergen')?.value?.trim();
        if (!warning) return; // Prevent adding empty warnings
        this.allergens?.push(new FormControl(warning));
        this.menuItemForm.get('newAllergen')?.reset();
      }
      
  }


  /** Remove a warning by index */
  removeWarning(index: number) {
    this.allergens.removeAt(index);
  }

  /** Add an ingredient from the newIngredient control */
  addIngredient(editMode: boolean = false, index: number | null = null) {
      if (editMode && index !== null) {
        const ingredient = this.ingredients.at(index).value;
        this.menuItemForm.get('newIngredient')?.setValue(ingredient);
      } else {
        const ingredient = this.menuItemForm.get('newIngredient')?.value?.trim();
        this.ingredients.push(new FormControl(ingredient));
        this.menuItemForm.get('newIngredient')?.reset();
      }
      
  }


  /** Remove an ingredient by index */
  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  /** Submit the form */
  submitForm() {
    if (this.menuItemForm.valid) {
      const formData = this.menuItemForm.value;
      if (this.isEditable) {
        // Dispatch an action to update the menu item
        this.store.dispatch(new EditMenuItem({
          itemId: this.menuItem.itemId,
          ...formData
        }));
      } else {
        // Dispatch an action to create a new menu item
        this.store.dispatch(new AddMenuItem(formData));
      }
      this.menuItemForm.reset();
      this.sideBarTitleService.changeRestaurantManagerSideBarTitle('Menu');
    } else {
      console.error('Form is invalid');
    }
  }
}
