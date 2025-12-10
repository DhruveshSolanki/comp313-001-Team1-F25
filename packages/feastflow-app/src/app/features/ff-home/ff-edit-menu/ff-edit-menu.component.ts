import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { AddMenuItem, EditMenuItem, GetAiAllergensSuggestions } from 'src/app/store/menu/menu.actions';
import { ToastService } from 'src/app/services/toast.service';
import { DialogService } from 'src/app/share/ff-dialog/dialog.service';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';

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
  aiAllergens: string[] = [];
  selectedAiAllergens = new Set<string>();

  constructor(private store: Store,
              private sideBarTitleService: SideBarTitleService,
              private toast: ToastService,
              private dialog: DialogService,
              private commonService: CommonHttpRequestService) {
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
        })).subscribe({
          next: () => this.toast.success('Item updated successfully'),
          error: () => this.toast.error('Failed to update item')
        });
      } else {
        // Dispatch an action to create a new menu item
        this.store.dispatch(new AddMenuItem(formData)).subscribe({
          next: () => this.toast.success('Item added successfully'),
          error: () => this.toast.error('Failed to add item')
        });
      }
      this.menuItemForm.reset();
      this.sideBarTitleService.changeRestaurantManagerSideBarTitle('Menu');
    } else {
      console.error('Form is invalid');
    }
  }

  // Toasts are now handled globally via ToastService + ff-toast-container

  // ----- AI allergens dialog -----
  openAiAllergens(tpl: TemplateRef<any>) {
    // Build ingredient list string from form
    const ingList: string[] = (this.ingredients?.controls || []).map(c => String(c.value || ''));

    if (ingList.length === 0) {
      this.toast.error('Please add ingredients first');
      return;
    }

    const payload = { ingredients: ingList };
    // Dispatch action to fetch suggestions via state
    this.store.dispatch(new GetAiAllergensSuggestions(payload)).subscribe({
      next: () => {
        const suggestions = this.store.selectSnapshot((state: any) => state.menu?.aiSuggestions ?? []);
        this.aiAllergens = suggestions;
        this.selectedAiAllergens = new Set<string>();
        this.dialog.open(tpl, { title: 'Suggested Allergens', width: '520px' });
      },
      error: () => {
        this.toast.error('Failed to fetch AI allergens');
      }
    });
  }

  toggleAiAllergen(name: string, checked: boolean) {
    if (checked) this.selectedAiAllergens.add(name);
    else this.selectedAiAllergens.delete(name);
  }

  onAiDialogClear() {
    this.selectedAiAllergens.clear();
  }

  onAiDialogSave() {
    // Add selected allergens into FormArray if not present
    const current = new Set<string>((this.allergens.controls || []).map(c => String(c.value || '')));
    this.selectedAiAllergens.forEach(a => {
      if (!current.has(a)) this.allergens.push(new FormControl(a));
    });
    this.dialog.close();
    this.toast.success('Allergens added');
  }
}
