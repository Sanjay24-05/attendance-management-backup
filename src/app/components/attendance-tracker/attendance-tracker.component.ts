import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Employee } from '../../../employee.model';
import { AttendanceRecord } from '../../../attendance.model';
import { EmployeeService } from '../../services/employee.service';
import { HighlightAbsentDirective } from '../../directives/highlight-absent.directive';

@Component({
  selector: 'app-attendance-tracker',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatSnackBarModule,
    HighlightAbsentDirective
  ],
  templateUrl: './attendance-tracker.component.html',
  styleUrls: ['./attendance-tracker.component.css']
})
export class AttendanceTrackerComponent implements OnInit {
  employees: Employee[] = [];
  todayDate: string = '';
  displayedColumns: string[] = ['name', 'department', 'status', 'action'];
  attendance: Map<number, AttendanceRecord> = new Map();

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.todayDate = this.employeeService.getTodayDateString();
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });

    this.refreshAttendance();
  }

  getAttendanceStatus(employeeId: number): 'Present' | 'Absent' {
    return this.attendance.get(employeeId)?.status || 'Absent';
  }

  markPresent(employeeId: number): void {
    this.updateAttendance(employeeId, 'Present');
  }

  markAbsent(employeeId: number): void {
    this.updateAttendance(employeeId, 'Absent');
  }

  getStatusColor(status: string): string {
    return status === 'Present' ? 'accent' : 'warn';
  }

  private refreshAttendance(): void {
    this.employeeService.getAttendance().subscribe(records => {
      this.attendance.clear();
      records.forEach(record => {
        if (record.date === this.todayDate) {
          this.attendance.set(record.employeeId, record);
        }
      });
    });
  }

  private updateAttendance(employeeId: number, status: 'Present' | 'Absent'): void {
    this.employeeService.saveAttendance(employeeId, status).subscribe(() => {
      this.refreshAttendance();
      this.snackBar.open(`Attendance marked as ${status}`, 'Close', { duration: 2000 });
    });
  }
}
