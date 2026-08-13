'use client';

import Link from 'next/link';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  getRowHref?: (row: T) => string | undefined;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = 'No records found.',
  getRowHref,
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.map((row, index) => {
              const rowId = String(row.id ?? row._id ?? index);
              const href = getRowHref?.(row);
              const clickable = Boolean(href || onRowClick);

              const cells = columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-sm text-zinc-700 ${col.className ?? ''}`}>
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '—')}
                </td>
              ));

              if (href) {
                return (
                  <tr key={rowId} className="transition-colors hover:bg-orange-50/40">
                    {cells.map((cell, cellIndex) => (
                      <td key={columns[cellIndex].key} className="p-0">
                        <Link href={href} className="block px-4 py-3 text-sm text-zinc-700">
                          {cell.props.children}
                        </Link>
                      </td>
                    ))}
                  </tr>
                );
              }

              return (
                <tr
                  key={rowId}
                  className={clickable ? 'cursor-pointer transition-colors hover:bg-orange-50/40' : ''}
                  onClick={() => onRowClick?.(row)}
                >
                  {cells}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
