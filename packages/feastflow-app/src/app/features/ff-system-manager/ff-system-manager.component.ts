import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { DeleteUser, GetUsers } from 'src/app/store/user/user.actions';
import { UserState } from 'src/app/store/user/user.state';
import { DialogService } from 'src/app/share/ff-dialog/dialog.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ff-system-manager',
  templateUrl: './ff-system-manager.component.html',
  styleUrls: ['./ff-system-manager.component.css']
})
export class FfSystemManagerComponent implements OnInit, OnDestroy {
  sidebarOpen: boolean = false;
  sidebar: boolean = false;

  columns: string[] = ['Id', 'Name', 'Role', 'Status', 'Actions'];
  userData: any[] = [];
  homeTitle!: string;

  // Dialog templates
  @ViewChild('addEmployeeTpl') addEmployeeTpl!: TemplateRef<any>;
  @ViewChild('editEmployeeTpl') editEmployeeTpl!: TemplateRef<any>;
  @ViewChild('deleteConfirmTpl') deleteConfirmTpl!: TemplateRef<any>;

  // Employee form
  employeeForm = new FormGroup({
    staffName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    staffEmail: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    staffPhoneNumber: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl<string>('SERVER', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<string>('ACTIVE', { nonNullable: true, validators: [Validators.required] }),
    staffPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl<string>('', { nonNullable: true })
  });

  constructor(private store: Store,
    private sidebarService: SideBarService,
    private sideBarTitleService: SideBarTitleService,
  public dialog: DialogService,
    private commonService: CommonHttpRequestService,
    private toast: ToastService) { }

  ngOnInit() {

    const homeTitleSubject = this.sideBarTitleService.getFirstSystemManagerSideBarTitle();
    homeTitleSubject.subscribe(title => {
      this.homeTitle = title;
    });

    this.store.dispatch(new GetUsers());

    this.store
      .select(UserState.getState)
      .subscribe(userState => {
        this.userData = userState?.items || [];
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the title subject to prevent memory leaks
    this.sideBarTitleService.getFirstSystemManagerSideBarTitle().unsubscribe();
  }

  noSort = () => 0;

  onSidebarToggle() {
    this.sidebarService.toggleSidebar();
  }

  onHomeTitleChange($event: string) {
    this.homeTitle = $event;
  }


  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onDelete(userId: any) {
    // Open confirm delete dialog
    const ref = this.dialog.open(this.deleteConfirmTpl, { title: 'Delete Employee', width: '420px' });
    ref.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.commonService.deleteStaff(String(userId)).subscribe({
          next: () => {
            this.toast.success('Employee deleted');
            this.store.dispatch(new GetUsers());
          },
          error: () => this.toast.error('Failed to delete employee')
        });
      }
    });
  }

  // Open add employee dialog from filter icon
  openAddEmployeeDialog() {
    this.employeeForm.reset({
      staffName: '',
      staffEmail: '',
      staffPhoneNumber: '',
      role: 'SERVER',
      status: 'ACTIVE',
      staffPassword: '',
      confirmPassword: ''
    });
    // Ensure email is enabled for add
    this.employeeForm.get('staffEmail')?.enable();
    const ref = this.dialog.open(this.addEmployeeTpl, { title: 'Add Employee', width: '540px' });
    ref.afterClosed().subscribe();
  }

  submitAddEmployee() {
    if (this.employeeForm.invalid) {
      this.toast.warning('Please fill all required fields');
      return;
    }
    const payload = this.employeeForm.getRawValue();
    if (payload.staffPassword && payload.staffPassword !== payload.confirmPassword) {
      this.toast.warning('Password and confirm password must match');
      return;
    }
    this.commonService.createStaff(payload).subscribe({
      next: () => {
        this.toast.success('Employee created');
        this.dialog.close();
        this.store.dispatch(new GetUsers());
      },
      error: () => this.toast.error('Failed to create employee')
    });
  }

  // Handle edit emitted from table
  onEdit(item: any) {
    // Pre-fill form with existing values; include password field for UI as requested
    this.employeeForm.reset({
      staffName: item.userName || '',
      staffEmail: item.staffEmail || '',
      staffPhoneNumber: item.staffPhoneNumber || '',
      role: (item.userRole || 'SERVER').toString().toUpperCase(),
      status: (item.userStatus || 'ACTIVE').toString().toUpperCase(),
      staffPassword: '',
      confirmPassword: ''
    });
    // Disable email editing during edit as requested
    this.employeeForm.get('staffEmail')?.disable();
    const ref = this.dialog.open(this.editEmployeeTpl, { title: 'Edit Employee', width: '540px', data: { id: item.userId } });
    ref.afterClosed().subscribe();
  }

  submitEditEmployee(id: string) {
    if (this.employeeForm.invalid) {
      this.toast.warning('Please fill all required fields');
      return;
    }
    const payload = this.employeeForm.getRawValue();
    if (payload.staffPassword) {
      if (payload.staffPassword !== payload.confirmPassword) {
        this.toast.warning('Password and confirm password must match');
        return;
      }
    }
    this.commonService.updateStaff(String(id), payload).subscribe({
      next: () => {
        this.toast.success('Employee updated');
        this.dialog.close();
        this.store.dispatch(new GetUsers());
      },
      error: () => this.toast.error('Failed to update employee')
    });
  }
}
