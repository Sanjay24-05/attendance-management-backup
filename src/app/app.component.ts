import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService, AppRole } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidenavOpen = true;
  selectedRole: AppRole = 'Employee';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.selectedRole = this.authService.currentRole;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }

  onRoleChange(role: AppRole): void {
    this.selectedRole = role;
    this.authService.setRole(role);

    const restrictedForEmployee = ['/dashboard', '/employees', '/attendance', '/leave-approval'];
    if (role === 'Employee' && restrictedForEmployee.some(path => this.router.url.startsWith(path))) {
      this.router.navigate(['/leave-request']);
    }
  }

  isHrRole(): boolean {
    return this.selectedRole === 'HR';
  }

  isEmployeeRole(): boolean {
    return this.selectedRole === 'Employee';
  }
}
