import React, { useCallback } from 'react';

import HeaderCell from './HeaderCell';
import { CalculatedColumn, ExtractIDKeys } from './common/types';
import { DataGridProps } from './DataGrid';

type SharedDataGridProps<R, K extends ExtractIDKeys<R>> = Pick<DataGridProps<R, K>,
| 'draggableHeaderCell'
| 'rows'
| 'onHeaderDrop'
| 'onSelectedRowsChange'
| 'sortColumn'
| 'sortDirection'
| 'onSort'
> & Required<Pick<DataGridProps<R, K>,
| 'rowKey'
>>;

export interface HeaderRowProps<R, K extends ExtractIDKeys<R>> extends SharedDataGridProps<R, K> {
  height: number;
  width: number;
  lastFrozenColumnIndex: number;
  columns: readonly CalculatedColumn<R>[];
  allRowsSelected: boolean;
  scrollLeft: number | undefined;
  onColumnResize(column: CalculatedColumn<R>, width: number): void;
}

export default function HeaderRow<R, K extends ExtractIDKeys<R>>({
  height,
  width,
  onSelectedRowsChange,
  rowKey,
  rows,
  ...props
}: HeaderRowProps<R, K>) {
  const handleAllRowsSelectionChange = useCallback((checked: boolean) => {
    if (!onSelectedRowsChange) return;

    const newSelectedRows = new Set<R[K]>();
    if (checked) {
      for (const row of rows) {
        newSelectedRows.add(row[rowKey]);
      }
    }

    onSelectedRowsChange(newSelectedRows);
  }, [onSelectedRowsChange, rows, rowKey]);

  return (
    <div
      className="rdg-header-row"
      style={{ width, height, lineHeight: `${height}px` }}
    >
      {props.columns.map(column => {
        return (
          <HeaderCell<R, K>
            key={column.key as string}
            column={column}
            lastFrozenColumnIndex={props.lastFrozenColumnIndex}
            height={height}
            onResize={props.onColumnResize}
            onHeaderDrop={props.onHeaderDrop}
            allRowsSelected={props.allRowsSelected}
            onAllRowsSelectionChange={handleAllRowsSelectionChange}
            draggableHeaderCell={props.draggableHeaderCell}
            onSort={props.onSort}
            sortColumn={props.sortColumn}
            sortDirection={props.sortDirection}
            scrollLeft={column.frozen ? props.scrollLeft : undefined}
          />
        );
      })}
    </div>
  );
}