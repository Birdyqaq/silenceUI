// useSortableColumns.ts
interface Column {
    label: string;
    sortable: boolean;
}

export function useSortableColumns(columns: Column[]) {
    let sortedColumns = [...columns];

    const sortColumn = (index: number) => {
        sortedColumns = [...sortedColumns];
        sortedColumns[index].sortable = !sortedColumns[index].sortable;
    };

    return { sortedColumns, sortColumn };
}