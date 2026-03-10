import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../../employee.model';

@Pipe({
  name: 'employeeFilter',
  standalone: true
})
export class EmployeeFilterPipe implements PipeTransform {
  transform(employees: Employee[], department: string): Employee[] {
    if (!department || department === 'All') {
      return employees;
    }

    return employees.filter(employee => employee.department === department);
  }
}
