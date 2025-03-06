"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Teacher } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { subjectSchema } from "@/lib/formValidationSchemas/subject";
interface CustomSearchableInputProps {
  teachers: Teacher[];
  form: UseFormReturn<z.infer<typeof subjectSchema>>;
  defaultValues?: string[];
}

export default function CustomSearchableInputTeacher({
  teachers,
  form,
  defaultValues
}: CustomSearchableInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (defaultValues && defaultValues.length > 0) {
      setSelectedTeachers(defaultValues);
      form.setValue('teachers', defaultValues);
    } else {
      const formTeachers = form.getValues('teachers');
      if (formTeachers) {
        setSelectedTeachers(Array.isArray(formTeachers) ? formTeachers : []);
      }
    }
  }, [form, defaultValues]);

  useEffect(() => {
    if (Array.isArray(selectedTeachers)) {
      form.setValue('teachers', selectedTeachers);
    }
  }, [selectedTeachers, form]);

  const toggleTeacher = (teacherId: string) => {
    setSelectedTeachers((current) => {
      const currentArray = Array.isArray(current) ? current : [];
      if (currentArray.includes(teacherId)) {
        return currentArray.filter((id) => id !== teacherId);
      } else {
        return [...currentArray, teacherId];
      }
    });
  };

  const removeTeacher = (teacherId: string) => {
    setSelectedTeachers((current) => {
      const currentArray = Array.isArray(current) ? current : [];
      return currentArray.filter((id) => id !== teacherId);
    });
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const displayedTeachers = showAll ? filteredTeachers : filteredTeachers.slice(0, 5);

  return (
    <div className="w-full space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTeachers && selectedTeachers.length > 0
              ? `${selectedTeachers.length} guru dipilih`
              : "Pilih guru..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Cari guru..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Tidak ada guru ditemukan.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {displayedTeachers.map((teacher) => (
                  <CommandItem
                    key={teacher.id}
                    value={`${teacher.first_name} ${teacher.last_name}`}
                    onSelect={() => {
                      toggleTeacher(teacher.id.toString());
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTeachers && selectedTeachers.includes(teacher.id.toString()) 
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {teacher.first_name} {teacher.last_name}
                  </CommandItem>
                ))}
                {!showAll && filteredTeachers.length > 5 && (
                  <CommandItem onSelect={() => setShowAll(true)}>
                    <Button variant="ghost" className="w-full">
                      Tampilkan semua ({filteredTeachers.length} guru)
                    </Button>
                  </CommandItem>
                )}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedTeachers && selectedTeachers.map((teacherId) => {
          const teacher = teachers.find(t => t.id.toString() === teacherId);
          if (!teacher) return null;
          
          return (
            <Badge 
              key={teacher.id}
              variant="secondary"
              className="px-3 py-1 flex items-center gap-1"
            >
              {teacher.first_name} {teacher.last_name}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeTeacher(teacher.id.toString())}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
