import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Department } from '@/types/department';

interface DepartmentComboboxProps {
    departments: Pick<Department, 'id' | 'name'>[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function DepartmentCombobox({ departments, value, onChange, error }: DepartmentComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal",
                        !value && "text-muted-foreground",
                        error && "border-destructive"
                    )}
                >
                    {value ? (
                        departments.find((d) => d.id.toString() === value)?.name
                    ) : (
                        "Pilih Departemen / Prodi"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput 
                        placeholder="Cari prodi..." 
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>Departemen tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {departments.map((d) => (
                                <CommandItem
                                    key={d.id}
                                    value={d.name}
                                    onSelect={() => {
                                        onChange(d.id.toString());
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === d.id.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {d.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
