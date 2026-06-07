import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-erp-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './erp-finance.html',
  styleUrls: ['./erp-finance.scss']
})
export class ErpFinanceComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Placeholder: initialize charts or state here
  }
}
