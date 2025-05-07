import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() itemsPerPage = 25;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getRangeStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  
  getRangeEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }  
}
