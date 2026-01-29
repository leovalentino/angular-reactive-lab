import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TableRow {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  joinDate: string;
}

@Component({
  selector: 'app-heavy-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <h3>Heavy Table Component (500 rows)</h3>
      <p>This table displays 500 rows of dummy data to simulate a heavy UI component.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.email }}</td>
              <td>{{ row.department }}</td>
              <td>{{ row.salary | currency }}</td>
              <td>{{ row.joinDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Table loaded at: {{ loadTime }}</p>
    </div>
  `,
  styles: [`
    .table-container {
      border: 2px solid #2ecc71;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      background-color: #f8f9fa;
    }
    .table-wrapper {
      max-height: 400px;
      overflow-y: auto;
      margin: 20px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #2c3e50;
      color: white;
      position: sticky;
      top: 0;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover {
      background-color: #e8f4fc;
    }
  `]
})
export class HeavyTableComponent implements OnInit {
  data: TableRow[] = [];
  loadTime = new Date().toLocaleTimeString();

  ngOnInit() {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const firstNames = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
    for (let i = 1; i <= 500; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      
      this.data.push({
        id: i,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department,
        salary: 40000 + Math.floor(Math.random() * 100000),
        joinDate: new Date(2018 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          .toISOString().split('T')[0]
      });
    }
    
    console.log(`HeavyTableComponent loaded ${this.data.length} rows`);
  }
}
