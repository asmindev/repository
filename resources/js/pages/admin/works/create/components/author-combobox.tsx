import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthorOption } from '../types';

interface AuthorComboboxProps {
    authors: AuthorOption[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function AuthorCombobox({ authors, value, onChange, error }: AuthorComboboxProps) {
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
                        error && "border-red-400"
                    )}
                >
                    {value ? (
                        authors.find((a) => a.id.toString() === value)?.name || value
                    ) : (
                        "Cari atau ketik nama mahasiswa..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput 
                        placeholder="Ketik nama mahasiswa..." 
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty className="p-4 text-center text-xs text-muted-foreground">
                            Tidak ada mahasiswa terdaftar dengan nama ini.
                        </CommandEmpty>

                        <CommandGroup heading="Mahasiswa Terdaftar">
                            {authors.map((a) => (
                                <CommandItem
                                    key={a.id}
                                    value={a.name}
                                    onSelect={() => {
                                        onChange(a.id.toString());
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === a.id.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{a.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{a.nim || 'NIM tidak tersedia'}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <div className="mt-1 border-t border-gray-100 p-1">
                            {search ? (
                                <div 
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                                    onClick={() => {
                                        onChange(search);
                                        setOpen(false);
                                    }}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4 text-indigo-600" />
                                    <span className="flex-1">Gunakan "<strong>{search}</strong>" sebagai mahasiswa baru</span>
                                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                        Baru
                                    </kbd>
                                </div>
                            ) : (
                                <div className="px-2 py-2 text-[10px] text-muted-foreground italic text-center">
                                    Ketik nama untuk mendaftarkan mahasiswa baru...
                                </div>
                            )}
                        </div>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
