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
import { Student } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { parentSchema } from "@/lib/formValidationSchemas/parent";

interface CustomSearchableInputProps {
  students: Student[];
  form: UseFormReturn<z.infer<typeof parentSchema>>;
  defaultValues?: number[];
}

export default function CustomSearchableInputStudent({
  students,
  form,
  defaultValues
}: CustomSearchableInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (defaultValues && defaultValues.length > 0) {
      setSelectedStudents(defaultValues);
      form.setValue('students', defaultValues);
    } else {
      const formStudents = form.getValues('students');
      if (formStudents) {
        setSelectedStudents(Array.isArray(formStudents) ? formStudents : []);
      }
    }
  }, [form, defaultValues]);

  useEffect(() => {
    if (Array.isArray(selectedStudents)) {
      form.setValue('students', selectedStudents);
    }
  }, [selectedStudents, form]);

  const toggleStudent = (studentId: number) => {
    setSelectedStudents((current) => {
      const currentArray = Array.isArray(current) ? current : [];
      if (currentArray.includes(studentId)) {
        return currentArray.filter((id) => id !== studentId);
      } else {
        return [...currentArray, studentId];
      }
    });
  };

  const removeStudent = (studentId: number) => {
    setSelectedStudents((current) => {
      const currentArray = Array.isArray(current) ? current : [];
      return currentArray.filter((id) => id !== studentId);
    });
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

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
            {selectedStudents && selectedStudents.length > 0
              ? `${selectedStudents.length} siswa dipilih`
              : "Pilih siswa..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Cari siswa..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Tidak ada siswa ditemukan.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {filteredStudents.map((student) => (
                  <CommandItem
                    key={student.id}
                    value={`${student.first_name} ${student.last_name}`}
                    onSelect={() => {
                      toggleStudent(student.id);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStudents && selectedStudents.includes(student.id) 
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {student.first_name} {student.last_name}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedStudents && selectedStudents.map((studentId) => {
          const student = students.find(s => s.id === studentId);
          if (!student) return null;
          
          return (
            <Badge 
              key={student.id}
              variant="secondary"
              className="px-3 py-1 flex items-center gap-1"
            >
              {student.first_name} {student.last_name}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeStudent(student.id)}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
