"use client";

import { DataTable } from "@web/components/data-table";
import { Button } from "@web/components/ui/button";
import { Checkbox } from "@web/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import { Icons } from "@web/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import { downloadFile } from "@web/lib/utils";
import { api } from "@web/trpc/trpc";
import { formatFileSize } from "@web/utils/formatFileSize";
import { MoreHorizontal } from "lucide-react";
import React from "react";

const DataView = () => {
  const { data = [] } = api.file.getUploadedFiles.useQuery();
  const deleteFilesMutation = api.file.deleteFiles.useMutation();
  const utils = api.useUtils();

  const deleteFiles = async (files: string[]) => {
    debugger;
    await deleteFilesMutation.mutateAsync(files);
    await utils.file.invalidate();
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "filename",
      header: "Filename",
      enableSorting: true,
    },
    {
      accessorKey: "uploadedAt",
      header: "Uploaded At",
      cell: ({ row }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        new Date(row.original.uploadedAt || "").toLocaleString(),
      enableSorting: true,
    },
    {
      accessorKey: "fileSize",
      header: "File Size",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      cell: ({ row }) => formatFileSize(row.original.fileSize),
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <div className="hidden space-x-2 sm:flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        downloadFile(row.original.filePath);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Icons.download />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                onClick={async () => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  await deleteFiles([row.original.id]);
                }}
                variant="destructive"
              >
                <Icons.trash />
              </Button>
            </div>

            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      downloadFile(row.original.filePath);
                    }}
                  >
                    <Icons.download />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      await deleteFiles([row.original.id]);
                    }}
                  >
                    <Icons.trash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      },
    },
  ];

  return <DataTable data={data} columns={columns} deleteFiles={deleteFiles} />;
};

export default DataView;
