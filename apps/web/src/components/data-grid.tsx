import { useProgress } from "@/stores/useProgress.ts";
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
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import * as tus from "tus-js-client";

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "SIZE", uid: "size", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

// Sample data matching our schema
export const files = [
  {
    id: "file_1",
    name: "document.pdf",
    size: 1024000,
    createdAt: new Date("2024-01-01").getTime(),
  },
  {
    id: "file_2",
    name: "image.jpg",
    size: 2048000,
    createdAt: new Date("2024-01-02").getTime(),
  },
  {
    id: "file_3",
    name: "data.csv",
    size: 512000,
    createdAt: new Date("2024-01-03").getTime(),
  },
  {
    id: "file_4",
    name: "video.mp4",
    size: 10240000,
    createdAt: new Date("2024-01-04").getTime(),
  },
  {
    id: "file_5",
    name: "audio.mp3",
    size: 10240000,
    createdAt: new Date("2024-01-05").getTime(),
  },
  {
    id: "file_6",
    name: "presentation.pptx",
    size: 5120000,
    createdAt: new Date("2024-01-06").getTime(),
  },
  {
    id: "file_7",
    name: "spreadsheet.xlsx",
    size: 1536000,
    createdAt: new Date("2024-01-07").getTime(),
  },
  {
    id: "file_8",
    name: "code.js",
    size: 256000,
    createdAt: new Date("2024-01-08").getTime(),
  },
  {
    id: "file_9",
    name: "notes.txt",
    size: 102400,
    createdAt: new Date("2024-01-09").getTime(),
  },
  {
    id: "file_10",
    name: "design.psd",
    size: 15360000,
    createdAt: new Date("2024-01-10").getTime(),
  },
  {
    id: "file_11",
    name: "report.docx",
    size: 2048000,
    createdAt: new Date("2024-01-11").getTime(),
  },
  {
    id: "file_12",
    name: "backup.zip",
    size: 20480000,
    createdAt: new Date("2024-01-12").getTime(),
  },
  {
    id: "file_13",
    name: "logo.svg",
    size: 51200,
    createdAt: new Date("2024-01-13").getTime(),
  },
  {
    id: "file_14",
    name: "config.json",
    size: 25600,
    createdAt: new Date("2024-01-14").getTime(),
  },
  {
    id: "file_15",
    name: "styles.css",
    size: 153600,
    createdAt: new Date("2024-01-15").getTime(),
  },
  {
    id: "file_16",
    name: "database.sql",
    size: 5120000,
    createdAt: new Date("2024-01-16").getTime(),
  },
  {
    id: "file_17",
    name: "animation.gif",
    size: 3072000,
    createdAt: new Date("2024-01-17").getTime(),
  },
  {
    id: "file_18",
    name: "template.html",
    size: 102400,
    createdAt: new Date("2024-01-18").getTime(),
  },
  {
    id: "file_19",
    name: "manifest.xml",
    size: 51200,
    createdAt: new Date("2024-01-19").getTime(),
  },
  {
    id: "file_20",
    name: "screenshot.png",
    size: 1024000,
    createdAt: new Date("2024-01-20").getTime(),
  },
  {
    id: "file_21",
    name: "invoice.pdf",
    size: 512000,
    createdAt: new Date("2024-01-21").getTime(),
  },
  {
    id: "file_22",
    name: "meeting.mp4",
    size: 51200000,
    createdAt: new Date("2024-01-22").getTime(),
  },
  {
    id: "file_23",
    name: "podcast.mp3",
    size: 15360000,
    createdAt: new Date("2024-01-23").getTime(),
  },
  {
    id: "file_24",
    name: "diagram.drawio",
    size: 256000,
    createdAt: new Date("2024-01-24").getTime(),
  },
  {
    id: "file_25",
    name: "script.py",
    size: 153600,
    createdAt: new Date("2024-01-25").getTime(),
  },
  {
    id: "file_26",
    name: "requirements.txt",
    size: 25600,
    createdAt: new Date("2024-01-26").getTime(),
  },
  {
    id: "file_27",
    name: "mockup.sketch",
    size: 10240000,
    createdAt: new Date("2024-01-27").getTime(),
  },
  {
    id: "file_28",
    name: "changelog.md",
    size: 76800,
    createdAt: new Date("2024-01-28").getTime(),
  },
  {
    id: "file_29",
    name: "package.json",
    size: 51200,
    createdAt: new Date("2024-01-29").getTime(),
  },
  {
    id: "file_30",
    name: "index.tsx",
    size: 204800,
    createdAt: new Date("2024-01-30").getTime(),
  },
  {
    id: "file_31",
    name: "banner.jpg",
    size: 2048000,
    createdAt: new Date("2024-01-31").getTime(),
  },
  {
    id: "file_32",
    name: "survey.csv",
    size: 512000,
    createdAt: new Date("2024-02-01").getTime(),
  },
  {
    id: "file_33",
    name: "proposal.docx",
    size: 1536000,
    createdAt: new Date("2024-02-02").getTime(),
  },
  {
    id: "file_34",
    name: "analytics.xlsx",
    size: 1024000,
    createdAt: new Date("2024-02-03").getTime(),
  },
  {
    id: "file_35",
    name: "demo.webm",
    size: 30720000,
    createdAt: new Date("2024-02-04").getTime(),
  },
  {
    id: "file_36",
    name: "icons.ttf",
    size: 512000,
    createdAt: new Date("2024-02-05").getTime(),
  },
  {
    id: "file_37",
    name: "backup.sql",
    size: 10240000,
    createdAt: new Date("2024-02-06").getTime(),
  },
  {
    id: "file_38",
    name: "chart.svg",
    size: 102400,
    createdAt: new Date("2024-02-07").getTime(),
  },
  {
    id: "file_39",
    name: "settings.yaml",
    size: 51200,
    createdAt: new Date("2024-02-08").getTime(),
  },
  {
    id: "file_40",
    name: "layout.css",
    size: 204800,
    createdAt: new Date("2024-02-09").getTime(),
  },
  {
    id: "file_41",
    name: "report.pdf",
    size: 3072000,
    createdAt: new Date("2024-02-10").getTime(),
  },
  {
    id: "file_42",
    name: "background.png",
    size: 5120000,
    createdAt: new Date("2024-02-11").getTime(),
  },
  {
    id: "file_43",
    name: "contract.docx",
    size: 1024000,
    createdAt: new Date("2024-02-12").getTime(),
  },
  {
    id: "file_44",
    name: "metrics.json",
    size: 76800,
    createdAt: new Date("2024-02-13").getTime(),
  },
  {
    id: "file_45",
    name: "styles.scss",
    size: 153600,
    createdAt: new Date("2024-02-14").getTime(),
  },
  {
    id: "file_46",
    name: "avatar.jpg",
    size: 512000,
    createdAt: new Date("2024-02-15").getTime(),
  },
  {
    id: "file_47",
    name: "data.xml",
    size: 102400,
    createdAt: new Date("2024-02-16").getTime(),
  },
  {
    id: "file_48",
    name: "main.js",
    size: 256000,
    createdAt: new Date("2024-02-17").getTime(),
  },
  {
    id: "file_49",
    name: "readme.md",
    size: 51200,
    createdAt: new Date("2024-02-18").getTime(),
  },
  {
    id: "file_50",
    name: "docker-compose.yml",
    size: 25600,
    createdAt: new Date("2024-02-19").getTime(),
  },
  {
    id: "file_51",
    name: "schema.graphql",
    size: 102400,
    createdAt: new Date("2024-02-20").getTime(),
  },
  {
    id: "file_52",
    name: "robots.txt",
    size: 12800,
    createdAt: new Date("2024-02-21").getTime(),
  },
  {
    id: "file_53",
    name: "sitemap.xml",
    size: 204800,
    createdAt: new Date("2024-02-22").getTime(),
  },
  {
    id: "file_54",
    name: "favicon.ico",
    size: 25600,
    createdAt: new Date("2024-02-23").getTime(),
  },
  {
    id: "file_55",
    name: "webpack.config.js",
    size: 76800,
    createdAt: new Date("2024-02-24").getTime(),
  },
];

export function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({
  size = 24,
  width = size,
  height = size,
  ...props
}: {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height}
      role="presentation"
      viewBox="0 0 24 24"
      width={width}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};

export const VerticalDotsIcon = ({
  size = 24,
  width = size,
  height = size,
  ...props
}: {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height}
      role="presentation"
      viewBox="0 0 24 24"
      width={width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SearchIcon = (props: { [key: string]: any }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({
  strokeWidth = 1.5,
  ...otherProps
}: {
  strokeWidth?: number;
  [key: string]: any;
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

const INITIAL_VISIBLE_COLUMNS = ["name", "size", "createdAt", "actions"];

type File = {
  id: string;
  name: string;
  size: number;
  createdAt: number;
};

type TableColumnKey = keyof File | "actions";

export default function DataGrid() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { setProgress, setUploading } = useProgress();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string> | string>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
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
                  <VerticalDotsIcon
                    className="text-default-300"
                    width={20}
                    height={20}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="download">Download</DropdownItem>
                <DropdownItem key="rename">Rename</DropdownItem>
                <DropdownItem key="delete" className="text-danger">
                  Delete
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

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // Create a new tus upload
    const upload = new tus.Upload(file, {
      endpoint: "http://localhost:3015/files",
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      onBeforeRequest: function () {
        setUploading(true);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
        setProgress(Number(percentage));
      },
      onSuccess: function () {
        setUploading(false);
        setProgress(0);
        queryClient.invalidateQueries({
          queryKey: trpc.file.getUploadedFiles.queryKey(),
        });
      },
    });

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      console.log("upload");

      // Start the upload
      upload.start();
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by filename..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setVisibleColumns(keys as Set<string>)
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <VisuallyHidden>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleUpload}
              />
            </VisuallyHidden>
            <Button
              color="primary"
              endContent={<PlusIcon width={20} height={20} />}
              onClick={handleClick}
            >
              Upload File
            </Button>
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
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    files.length,
    onSearchChange,
  ]);

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
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
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
      <TableBody emptyContent={"No files found"} items={sortedItems}>
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
