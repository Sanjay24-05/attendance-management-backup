import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { LeaveRequest } from '../../leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly baseUrl = 'http://localhost:3000/leaveRequests';
  private apiAvailable = true;

  private leaveRequestsStore: LeaveRequest[] = [
    {
      id: 1,
      employeeId: 1,
      fromDate: '2026-02-01',
      toDate: '2026-02-05',
      reason: 'Annual vacation',
      status: 'Pending'
    },
    {
      id: 2,
      employeeId: 3,
      fromDate: '2026-01-25',
      toDate: '2026-01-26',
      reason: 'Medical appointment',
      status: 'Approved'
    },
    {
      id: 3,
      employeeId: 5,
      fromDate: '2026-02-10',
      toDate: '2026-02-12',
      reason: 'Personal leave',
      status: 'Pending'
    }
  ];

  constructor(private http: HttpClient) {}

  getLeaveRequests(): Observable<LeaveRequest[]> {
    if (!this.apiAvailable) {
      return of([...this.leaveRequestsStore]);
    }

    return this.http.get<LeaveRequest[]>(this.baseUrl).pipe(
      map(requests => {
        this.leaveRequestsStore = [...requests];
        return requests;
      }),
      catchError(() => {
        this.apiAvailable = false;
        return of([...this.leaveRequestsStore]);
      })
    );
  }

  addLeaveRequest(request: Omit<LeaveRequest, 'id'>): Observable<LeaveRequest> {
    if (!this.apiAvailable) {
      const maxId = Math.max(...this.leaveRequestsStore.map(entry => entry.id), 0);
      const createdRequest: LeaveRequest = { id: maxId + 1, ...request };
      this.leaveRequestsStore = [...this.leaveRequestsStore, createdRequest];
      return of(createdRequest);
    }

    return this.http.post<LeaveRequest>(this.baseUrl, request).pipe(
      map(createdRequest => {
        this.leaveRequestsStore = [...this.leaveRequestsStore, createdRequest];
        return createdRequest;
      }),
      catchError(() => {
        this.apiAvailable = false;
        const maxId = Math.max(...this.leaveRequestsStore.map(entry => entry.id), 0);
        const createdRequest: LeaveRequest = { id: maxId + 1, ...request };
        this.leaveRequestsStore = [...this.leaveRequestsStore, createdRequest];
        return of(createdRequest);
      })
    );
  }

  updateLeaveRequestStatus(
    id: number,
    status: 'Pending' | 'Approved' | 'Rejected'
  ): Observable<LeaveRequest> {
    if (!this.apiAvailable) {
      const index = this.leaveRequestsStore.findIndex(entry => entry.id === id);
      if (index === -1) {
        return of({
          id,
          employeeId: 0,
          fromDate: '',
          toDate: '',
          reason: '',
          status
        });
      }

      this.leaveRequestsStore[index] = { ...this.leaveRequestsStore[index], status };
      return of({ ...this.leaveRequestsStore[index] });
    }

    return this.http.patch<LeaveRequest>(`${this.baseUrl}/${id}`, { status }).pipe(
      map(updatedRequest => {
        this.leaveRequestsStore = this.leaveRequestsStore.map(entry =>
          entry.id === id ? updatedRequest : entry
        );
        return updatedRequest;
      }),
      catchError(() => {
        this.apiAvailable = false;
        const index = this.leaveRequestsStore.findIndex(entry => entry.id === id);
        if (index === -1) {
          return of({
            id,
            employeeId: 0,
            fromDate: '',
            toDate: '',
            reason: '',
            status
          });
        }

        this.leaveRequestsStore[index] = { ...this.leaveRequestsStore[index], status };
        return of({ ...this.leaveRequestsStore[index] });
      })
    );
  }
}
