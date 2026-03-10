import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { AttendanceTrackerComponent } from './components/attendance-tracker/attendance-tracker.component';
import { LeaveRequestComponent } from './components/leave-request/leave-request.component';
import { LeaveApprovalComponent } from './components/leave-approval/leave-approval.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'leave-request', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['HR'] }
  },
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [roleGuard],
    data: { roles: ['HR'] }
  },
  {
    path: 'employees/:id',
    component: EmployeeDetailComponent,
    canActivate: [roleGuard],
    data: { roles: ['HR'] }
  },
  {
    path: 'attendance',
    component: AttendanceTrackerComponent,
    canActivate: [roleGuard],
    data: { roles: ['HR'] }
  },
  {
    path: 'leave-request',
    component: LeaveRequestComponent,
    canActivate: [roleGuard],
    data: { roles: ['Employee', 'HR'] }
  },
  {
    path: 'leave-approval',
    component: LeaveApprovalComponent,
    canActivate: [roleGuard],
    data: { roles: ['HR'] }
  }
];

