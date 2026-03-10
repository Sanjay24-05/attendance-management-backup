import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LeaveRequest } from '../../../leave.model';
import { Employee } from '../../../employee.model';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css']
})
export class LeaveApprovalComponent implements OnInit {
  approvalForm: FormGroup;
  leaveRequests: LeaveRequest[] = [];
  employees: Employee[] = [];
  employeeNameById = new Map<number, string>();
  displayedColumns: string[] = ['id', 'employeeName', 'fromDate', 'toDate', 'reason', 'status', 'actions'];
  pendingCount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private snackBar: MatSnackBar
  ) {
    this.approvalForm = this.formBuilder.group({
      requestId: [null, Validators.required],
      status: ['Approved', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadLeaveRequests();
  }

  getEmployeeName(employeeId: number | string): string {
    const normalizedId = Number(employeeId);
    return this.employeeNameById.get(normalizedId) || 'Unknown';
  }

  approveRequest(id: number): void {
    this.updateRequestStatus(id, 'Approved');
  }

  rejectRequest(id: number): void {
    this.updateRequestStatus(id, 'Rejected');
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

  isPending(status: string): boolean {
    return status === 'Pending';
  }

  onApprovalSubmit(): void {
    if (this.approvalForm.invalid) {
      this.approvalForm.markAllAsTouched();
      return;
    }

    const requestId = this.approvalForm.value.requestId as number;
    const status = this.approvalForm.value.status as 'Approved' | 'Rejected';
    this.updateRequestStatus(requestId, status);
  }

  private loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.employeeNameById.clear();
      this.employees.forEach(employee => {
        this.employeeNameById.set(Number(employee.id), employee.name);
      });
    });
  }

  private loadLeaveRequests(): void {
    this.leaveService.getLeaveRequests().subscribe(requests => {
      this.leaveRequests = requests;
      this.pendingCount = requests.filter(r => r.status === 'Pending').length;
    });
  }

  private updateRequestStatus(id: number, status: 'Approved' | 'Rejected'): void {
    this.leaveService.updateLeaveRequestStatus(id, status).subscribe(() => {
      this.loadLeaveRequests();
      this.approvalForm.reset({ status: 'Approved' });
      this.snackBar.open(
        status === 'Approved' ? 'Leave request approved' : 'Leave request rejected',
        'Close',
        { duration: 2500 }
      );
    });
  }
}
