import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalEmployees: number = 0;
  presentCount: number = 0;
  absentCount: number = 0;
  pendingLeaves: number = 0;
  presentPercentage: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.totalEmployees = employees.length;
      this.updateAttendanceSummary();
    });

    this.employeeService.getAttendance().subscribe(() => {
      this.updateAttendanceSummary();
    });

    this.leaveService.getLeaveRequests().subscribe(requests => {
      this.pendingLeaves = requests.filter(request => request.status === 'Pending').length;
    });
  }

  private updateAttendanceSummary(): void {
    const todayDate = this.getTodayDate();
    this.employeeService.getAttendance().subscribe(records => {
      const todayAttendance = records.filter(record => record.date === todayDate);
      this.presentCount = todayAttendance.filter(record => record.status === 'Present').length;
      this.absentCount = todayAttendance.filter(record => record.status === 'Absent').length;
      this.presentPercentage =
        this.totalEmployees > 0 ? Math.round((this.presentCount / this.totalEmployees) * 100) : 0;
    });
  }

  getTodayDate(): string {
    return this.employeeService.getTodayDateString();
  }
}
