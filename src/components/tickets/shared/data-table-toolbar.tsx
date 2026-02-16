import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center gap-4 justify-between flex-col xs:flex-row">
      <Input
        placeholder="Szukaj po tytule..."
        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
        className="sm:max-w-sm w-full"
      />
      <div className="flex items-center gap-4 w-full justify-between xs:w-fit">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Dodaj nowy</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowy ticket</DialogTitle>
              <DialogDescription>Tutaj bedzie formularz do dodania nowego ticket'a</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size={"sm"}>
                  Anuluj
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button size={"sm"} onClick={() => toast("Nowy ticket zostal dodany pomyslne.", { action: { label: "Zamknij", onClick: () => {} } })}>
                  Dodaj
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Kolumny <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
