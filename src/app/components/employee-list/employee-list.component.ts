import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Employee } from '../../../employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormDialogComponent } from '../../dialogs/employee-form-dialog/employee-form-dialog.component';
import { EmployeeFilterPipe } from '../../pipes/employee-filter.pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    EmployeeFilterPipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  departments: string[] = ['All'];
  selectedDepartment = 'All';
  displayedColumns: string[] = ['id', 'name', 'department', 'role', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.addEmployee(result).subscribe(() => {
          this.loadEmployees();
          this.snackBar.open('Employee added successfully', 'Close', { duration: 2500 });
        });
      }
    });
  }

  openEditDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      width: '400px',
      data: { isEdit: true, employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.updateEmployee(employee.id, result).subscribe(() => {
          this.loadEmployees();
          this.snackBar.open('Employee updated successfully', 'Close', { duration: 2500 });
        });
      }
    });
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
        this.snackBar.open('Employee deleted', 'Close', { duration: 2500 });
      });
    }
  }

  viewEmployee(id: number): void {
    this.router.navigate(['/employees', id]);
  }

  private loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.departments = ['All', ...new Set(employees.map(employee => employee.department))];
    });
  }
}
