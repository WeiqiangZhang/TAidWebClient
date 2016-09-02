import {Component, Input} from '@angular/core';

import {Column} from '../shared/column';

@Component({
  moduleId: module.id,
  selector: 'col-selector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['column-selector.component.css']
})
/**
* Column display toggle dropdown for the FSET.
*/
export class ColumnSelectorComponent {
  @Input() columns: Column<any>[];
}
