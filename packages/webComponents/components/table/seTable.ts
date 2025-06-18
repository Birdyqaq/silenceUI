import {
    css
}

    from 'lit';

export const tableStyles = css`
:host {
    display: block;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    border: var(--border-style, 1px solid #ddd);
    /* Use CSS variable */
}

th.sortable:hover {
    cursor: pointer;
}

/* Style for the table header */
thead th {
    background-color: #f2f2f2;
    /* Background color for the header */
    color: #333;
    font-weight: bold;
}

tbody tr {
    border-bottom: var(--row-line);
}

td {
    border-right: var(--column-line);
}

td:last-child {
    border-right: none;
    /* Remove right border for the last cell */
}
`;