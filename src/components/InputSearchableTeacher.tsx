import { useState, useEffect } from 'react';

type InputSearchableTeacherProps = {
  label: string;
  name: string;
  defaultValue?: Array<{id: string, username: string, name: string, surname: string, email: string}>;
  register: any;
  error?: any;
  teachers?: Array<{id: string, name: string, surname: string}>;
}

export default function InputSearchableTeacher({
  label,
  name,
  defaultValue,
  register,
  error,
  teachers
}: InputSearchableTeacherProps) {
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) {
      const teacherIds = defaultValue.map(teacher => teacher.id);
      setSelectedTeachers(teacherIds);
      setSearchTerm('');
    }
  }, [defaultValue]);

  const filteredTeachers = teachers?.filter(teacher => 
    !selectedTeachers.includes(teacher.id) && 
    (teacher.name + ' ' + teacher.surname)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleTeacherSelect = (teacher: {id: string, name: string, surname: string}) => {
    const newSelectedTeachers = [...selectedTeachers, teacher.id];
    setSelectedTeachers(newSelectedTeachers);
    register(name).onChange({target: {value: newSelectedTeachers}});
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleTeacherRemove = (teacherId: string) => {
    const newSelectedTeachers = selectedTeachers.filter(id => id !== teacherId);
    setSelectedTeachers(newSelectedTeachers);
    register(name).onChange({target: {value: newSelectedTeachers}});
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          placeholder="Search teacher..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <input
          type="hidden"
          {...register(name)}
          value={selectedTeachers}
        />
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredTeachers?.map((teacher) => (
              <div
                key={teacher.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleTeacherSelect(teacher)}
              >
                {teacher.name} {teacher.surname}
              </div>
            ))}
            {filteredTeachers?.length === 0 && (
              <div className="p-2 text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>
      
      {selectedTeachers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {teachers?.filter(t => selectedTeachers.includes(t.id)).map(teacher => (
            <div 
              key={teacher.id}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-2"
            >
              <span>{teacher.name} {teacher.surname}</span>
              <button
                type="button"
                onClick={() => handleTeacherRemove(teacher.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
}
