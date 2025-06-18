// useSortableColumns.ts
interface Column {
    label: string;
    sortable: boolean;
}

export function useSortableColumns(columns: Column[]) {
    let sortedColumns = [...columns];

    const sortColumn = (index: number) => {
        sortedColumns = [...sortedColumns];
        // 简单的排序逻辑，可以根据需要进行扩展
        sortedColumns[index].sortable = !sortedColumns[index].sortable;
    };

    return { sortedColumns, sortColumn };
}