import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SupervisorOption } from '../types';

interface SupervisorComboboxProps {
    supervisors: SupervisorOption[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    error?: string;
}

export function SupervisorCombobox({ supervisors, selectedIds, onChange, error }: SupervisorComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const toggleSupervisor = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(sid => sid !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={cn(
                    "flex min-h-10 w-full flex-wrap gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
                    error && "border-red-400"
                )}>
                    {selectedIds.length > 0 ? (
                        selectedIds.map((id) => {
                            const supervisor = supervisors.find(s => s.id.toString() === id);
                            return (
                                <Badge key={id} variant="secondary" className="gap-1 px-1 py-0 h-6">
                                    {supervisor?.name}
                                    <X 
                                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSupervisor(id);
                                        }}
                                    />
                                </Badge>
                            );
                        })
                    ) : (
                        <span className="text-muted-foreground">Pilih Pembimbing (bisa lebih dari satu)</span>
                    )}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 self-center" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput 
                        placeholder="Cari dosen pembimbing..." 
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>Dosen tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {supervisors.map((s) => (
                                <CommandItem
                                    key={s.id}
                                    value={s.name}
                                    onSelect={() => {
                                        toggleSupervisor(s.id.toString());
                                        setSearch("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedIds.includes(s.id.toString()) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{s.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{s.nidn || 'NIDN tidak tersedia'}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
