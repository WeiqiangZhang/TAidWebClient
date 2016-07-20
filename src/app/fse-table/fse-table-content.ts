import {Column, SortOrder} from "./shared/column";

export interface FSETPropertyMap<T> {
  [dispName: string]: {
    setter: (v: string, o: T) => void,
    getter: (o: T) => string
  };
}
/*
* Model for the contents of the FSE table.
* Rows contain the list of T's to display, and cols specifies the displayed
* property.
*/
export class FSETContent<T>{
  private _cols: { [dispName: string]: Column<T> };
  private _rows: T[];
  private filtered_rows: T[];

  constructor(
    // Maps a display name of a column to a property within T.
    propertyMap: FSETPropertyMap<T>,
    // List of T's being displayed.
    rows: T[]
  ){
    this.initColumns(propertyMap);
    if (Object.keys(this._cols).length === 0){
      throw new Error(
        "Can not create FSETable content with no displayed properties.");
    }
    this._rows = rows;
    this.filtered_rows = this._rows.slice(0);
  }

  public add(row: T, index:number = 0){
    this._rows.splice(index, 0, row);
  }

  public remove(index:number = -1){
    return this._rows.splice(index, 1);
  }

  public applyFilter(filter: (o: T) => boolean){
    this.filtered_rows = this._rows.filter(filter);
  }

  public removeFilter(){
    this.filtered_rows = this._rows.slice(0);
  }

  public applyFilterAll(val: string){
    this.applyFilter((o: T) => {
      for (let col of this.columns)
        if (col.getter(o).toLowerCase().indexOf(val.toLowerCase()) >= 0)
          return true;
      return false;
    });
  }

  /*
  * For each column that is shown, do the specified func.
  */
  private forShownColumns(func: (col: Column<T>) => void){
    for (let dispName in this._cols){
      let col = this._cols[dispName]
      if (col.show) func(col);
    }
  }

  // Initialize the column hashmap according to the specified mapping.
  private initColumns(pMap: FSETPropertyMap<T>)
  {
    this._cols = {};
    for (let dispName in pMap){
      this._cols[dispName] =
        new Column<T>(dispName, pMap[dispName].setter, pMap[dispName].getter);
    }
  }

  /*
  * Return list of displayed columns
  */
  get columns(): Column<T>[] {
    let ret: Column<T>[] = [];
    this.forShownColumns(col => ret.push(col));
    return ret;
  }

  get width(): number {
    let ret = 0;
    this.forShownColumns(() => ret += 1);
    return ret;
  }

  get rows(): T[]{
    return this.filtered_rows;
  }

  get height(){
    return this.filtered_rows.length;
  }

  /*
  * Sort according to the given column, in the specified direction.
  */
  sort(c: string, order: SortOrder){
    let col: Column<T> = this._cols[c];
    switch (order) {
      case SortOrder.ASC:
        this.filtered_rows.sort((a, b) => sort(
          col.getter(a).toLowerCase(), col.getter(b).toLowerCase()));
        break;
      case SortOrder.DEC:
        this.filtered_rows.sort((a, b) => -1*sort(
          col.getter(a).toLowerCase(), col.getter(b).toLowerCase()));
        break;
    }
  }
}

function sort(a: string, b: string){
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
