import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LeaveRequest } from '../../../leave.model';
import { Employee } from '../../../employee.model';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  leaveForm: FormGroup;
  employees: Employee[] = [];
  leaveRequests: LeaveRequest[] = [];
  displayedColumns: string[] = ['employeeId', 'employeeName', 'fromDate', 'toDate', 'reason', 'status'];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly leaveService: LeaveService,
    private readonly snackBar: MatSnackBar
  ) {
    this.leaveForm = this.formBuilder.group({
      employeeId: [null, Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadLeaveRequests();
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const { employeeId, fromDate, toDate, reason } = this.leaveForm.value;
    if (new Date(fromDate) > new Date(toDate)) {
      this.snackBar.open('From date cannot be after to date', 'Close', { duration: 2500 });
      return;
    }

    this.leaveService
      .addLeaveRequest({
        employeeId,
        fromDate,
        toDate,
        reason,
        status: 'Pending'
      })
      .subscribe(() => {
        this.loadLeaveRequests();
        this.leaveForm.reset();
        this.snackBar.open('Leave request submitted', 'Close', { duration: 2500 });
      });
  }

  getEmployeeName(employeeId: number): string {
    return this.employees.find(e => e.id === employeeId)?.name || 'Unknown';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved':
        return 'accent';
      case 'Rejected':
        return 'warn';
      default:
        return '';
    }
  }

  private loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  private loadLeaveRequests(): void {
    this.leaveService.getLeaveRequests().subscribe(requests => {
      this.leaveRequests = requests;
    });
  }
}
