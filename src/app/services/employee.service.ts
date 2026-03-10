import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { Employee } from '../../employee.model';
import { AttendanceRecord } from '../../attendance.model';

interface AttendanceApiRecord extends AttendanceRecord {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly baseUrl = 'http://localhost:3000';
  private apiAvailable = true;

  private employeesStore: Employee[] = [
    { id: 1, name: 'Alice Johnson', department: 'IT', role: 'Employee' },
    { id: 2, name: 'Bob Smith', department: 'HR', role: 'HR' },
    { id: 3, name: 'Charlie Brown', department: 'Finance', role: 'Employee' },
    { id: 4, name: 'Diana Prince', department: 'IT', role: 'Employee' },
    { id: 5, name: 'Eve Wilson', department: 'Sales', role: 'Employee' }
  ];

  private attendanceStore: AttendanceApiRecord[] = [
    { id: 1, employeeId: 1, date: this.getTodayDateString(), status: 'Present' },
    { id: 2, employeeId: 2, date: this.getTodayDateString(), status: 'Present' },
    { id: 3, employeeId: 3, date: this.getTodayDateString(), status: 'Absent' },
    { id: 4, employeeId: 4, date: this.getTodayDateString(), status: 'Present' },
    { id: 5, employeeId: 5, date: this.getTodayDateString(), status: 'Absent' }
  ];

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    if (!this.apiAvailable) {
      return of([...this.employeesStore]);
    }

    return this.http.get<Employee[]>(`${this.baseUrl}/employees`).pipe(
      map(employees => {
        this.employeesStore = [...employees];
        return employees;
      }),
      catchError(() => {
        this.apiAvailable = false;
        return of([...this.employeesStore]);
      })
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    if (!this.apiAvailable) {
      const employee = this.employeesStore.find(entry => entry.id === id);
      return employee
        ? of({ ...employee })
        : throwError(() => new Error(`Employee with id ${id} not found`));
    }

    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`).pipe(
      catchError(() => {
        this.apiAvailable = false;
        const employee = this.employeesStore.find(entry => entry.id === id);
        return employee
          ? of({ ...employee })
          : throwError(() => new Error(`Employee with id ${id} not found`));
      })
    );
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    if (!this.apiAvailable) {
      const maxId = Math.max(...this.employeesStore.map(entry => entry.id), 0);
      const createdEmployee: Employee = { id: maxId + 1, ...employee };
      this.employeesStore = [...this.employeesStore, createdEmployee];
      return of(createdEmployee);
    }

    return this.http.post<Employee>(`${this.baseUrl}/employees`, employee).pipe(
      map(createdEmployee => {
        this.employeesStore = [...this.employeesStore, createdEmployee];
        return createdEmployee;
      }),
      catchError(() => {
        this.apiAvailable = false;
        const maxId = Math.max(...this.employeesStore.map(entry => entry.id), 0);
        const createdEmployee: Employee = { id: maxId + 1, ...employee };
        this.employeesStore = [...this.employeesStore, createdEmployee];
        return of(createdEmployee);
      })
    );
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    if (!this.apiAvailable) {
      const index = this.employeesStore.findIndex(entry => entry.id === id);
      if (index === -1) {
        return throwError(() => new Error(`Employee with id ${id} not found`));
      }

      this.employeesStore[index] = { ...this.employeesStore[index], ...employee };
      return of({ ...this.employeesStore[index] });
    }

    return this.http.patch<Employee>(`${this.baseUrl}/employees/${id}`, employee).pipe(
      map(updatedEmployee => {
        this.employeesStore = this.employeesStore.map(entry =>
          entry.id === id ? updatedEmployee : entry
        );
        return updatedEmployee;
      }),
      catchError(() => {
        this.apiAvailable = false;
        const index = this.employeesStore.findIndex(entry => entry.id === id);
        if (index === -1) {
          return throwError(() => new Error(`Employee with id ${id} not found`));
        }

        this.employeesStore[index] = { ...this.employeesStore[index], ...employee };
        return of({ ...this.employeesStore[index] });
      })
    );
  }

  deleteEmployee(id: number): Observable<void> {
    if (!this.apiAvailable) {
      this.employeesStore = this.employeesStore.filter(entry => entry.id !== id);
      this.attendanceStore = this.attendanceStore.filter(entry => entry.employeeId !== id);
      return of(void 0);
    }

    return this.http.delete<void>(`${this.baseUrl}/employees/${id}`).pipe(
      map(() => {
        this.employeesStore = this.employeesStore.filter(entry => entry.id !== id);
        this.attendanceStore = this.attendanceStore.filter(entry => entry.employeeId !== id);
      }),
      catchError(() => {
        this.apiAvailable = false;
        this.employeesStore = this.employeesStore.filter(entry => entry.id !== id);
        this.attendanceStore = this.attendanceStore.filter(entry => entry.employeeId !== id);
        return of(void 0);
      })
    );
  }

  getAttendance(): Observable<AttendanceApiRecord[]> {
    if (!this.apiAvailable) {
      return of([...this.attendanceStore]);
    }

    return this.http.get<AttendanceApiRecord[]>(`${this.baseUrl}/attendance`).pipe(
      map(records => {
        this.attendanceStore = [...records];
        return records;
      }),
      catchError(() => {
        this.apiAvailable = false;
        return of([...this.attendanceStore]);
      })
    );
  }

  saveAttendance(employeeId: number, status: 'Present' | 'Absent'): Observable<AttendanceApiRecord> {
    const today = this.getTodayDateString();

    if (!this.apiAvailable) {
      const existing = this.attendanceStore.find(
        entry => entry.employeeId === employeeId && entry.date === today
      );

      if (existing) {
        existing.status = status;
        return of({ ...existing });
      }

      const maxId = Math.max(...this.attendanceStore.map(entry => entry.id), 0);
      const createdRecord: AttendanceApiRecord = {
        id: maxId + 1,
        employeeId,
        date: today,
        status
      };
      this.attendanceStore = [...this.attendanceStore, createdRecord];
      return of(createdRecord);
    }

    return this.getAttendanceByEmployeeAndDate(employeeId, today).pipe(
      switchMap(record => {
        if (record) {
          return this.http.patch<AttendanceApiRecord>(`${this.baseUrl}/attendance/${record.id}`, { status });
        }

        return this.http.post<AttendanceApiRecord>(`${this.baseUrl}/attendance`, {
          employeeId,
          date: today,
          status
        });
      }),
      catchError(() => {
        this.apiAvailable = false;
        return this.saveAttendance(employeeId, status);
      })
    );
  }

  private getAttendanceByEmployeeAndDate(
    employeeId: number,
    date: string
  ): Observable<AttendanceApiRecord | undefined> {
    if (!this.apiAvailable) {
      const record = this.attendanceStore.find(
        entry => entry.employeeId === employeeId && entry.date === date
      );
      return of(record ? { ...record } : undefined);
    }

    return this.http
      .get<AttendanceApiRecord[]>(
        `${this.baseUrl}/attendance?employeeId=${employeeId}&date=${date}`
      )
      .pipe(
        map(records => records[0]),
        catchError(() => {
          this.apiAvailable = false;
          return of(undefined);
        })
      );
  }

  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

}
