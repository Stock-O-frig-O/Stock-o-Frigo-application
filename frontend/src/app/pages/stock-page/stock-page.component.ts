// Angular imports
import { Component } from '@angular/core';

// Local imports
import { ListComponent } from '../../components/list/list.component';

@Component({
  selector: 'app-stock-page',
  imports: [ListComponent],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
})
export class StockPageComponent {}
