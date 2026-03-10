import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppRole = 'Employee' | 'HR';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly roleSubject = new BehaviorSubject<AppRole>('Employee');
  readonly role$ = this.roleSubject.asObservable();

  get currentRole(): AppRole {
    return this.roleSubject.value;
  }

  setRole(role: AppRole): void {
    this.roleSubject.next(role);
  }

  isHr(): boolean {
    return this.currentRole === 'HR';
  }
}
