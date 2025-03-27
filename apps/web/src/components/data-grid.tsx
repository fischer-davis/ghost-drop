import Upload from "@/components/upload-button.tsx";
import { useTRPC } from "@/utils/trpc.ts";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon, EllipsisVertical, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "SIZE", uid: "size", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = ["name", "size", "createdAt", "actions"];

type File = {
  id: string;
  name: string;
  size: number;
  createdAt: number;
};

type TableColumnKey = keyof File | "actions";

export default function DataGrid() {
  const trpc = useTRPC();
  const { data: files = [], isLoading } = useQuery(
    trpc.file.getUploadedFiles.queryOptions(),
  );
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string> | string>(
    new Set([]),
  );
  const [visibleColumns, _] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof File;
    direction: "ascending" | "descending";
  }>({
    column: "createdAt",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    // @ts-ignore
    let filteredFiles = [...files];

    if (hasSearchFilter) {
      filteredFiles = filteredFiles.filter((file) =>
        file.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredFiles;
  }, [files, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (file: File, columnKey: TableColumnKey) => {
      if (columnKey === "actions") {
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <EllipsisVertical
                    className="text-default-300"
                    width={20}
                    height={20}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="download">
                  <div className="flex items-center gap-2">
                    <DownloadIcon height={16} width={16} />
                    Download
                  </div>
                </DropdownItem>
                <DropdownItem key="delete" className="text-danger">
                  <div className="flex items-center gap-2">
                    <Trash2 height={16} width={16} />
                    Delete
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      }

      const cellValue = file[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-2">
              <div className="text-bold text-small">{cellValue}</div>
            </div>
          );
        case "size":
          return formatFileSize(cellValue as number);
        case "createdAt":
          return new Date(cellValue as number).toLocaleDateString();
        default:
          return cellValue;
      }
    },
    [],
  );

  function formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search..."
            startContent={<Search size={16} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Upload />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {files.length} files
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onRowsPerPageChange, files.length, onSearchChange]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {typeof selectedKeys === "string" ? (
            <>
              {filteredItems.length} of {filteredItems.length} selected
            </>
          ) : (
            <>
              {selectedKeys.size} of {filteredItems.length} selected
            </>
          )}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      aria-label="Files table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "h-[calc(100vh-256px)]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={(keys) => {
        typeof keys === "string"
          ? setSelectedKeys(keys)
          : setSelectedKeys(keys as Set<string>);
      }}
      onSortChange={(descriptor) =>
        setSortDescriptor(descriptor as typeof sortDescriptor)
      }
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        emptyContent={"No files found"}
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as TableColumnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
