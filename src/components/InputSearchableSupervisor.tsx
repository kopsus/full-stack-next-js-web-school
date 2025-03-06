import { useState, useEffect } from 'react';

type InputSearchableSupervisorProps = {
  label: string;
  name: string; 
  defaultValue?: string;
  register: any;
  error?: any;
  supervisors?: Array<{id: string, name: string, surname: string}>;
}

export default function InputSearchableSupervisor({
  label,
  name,
  defaultValue,
  register,
  error,
  supervisors
}: InputSearchableSupervisorProps) {
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(defaultValue || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      const defaultSupervisor = supervisors?.find(s => s.id === defaultValue);
      if (defaultSupervisor) {
        setSearchTerm(`${defaultSupervisor.name} ${defaultSupervisor.surname}`);
        setSelectedSupervisor(defaultValue);
      }
    }
  }, [defaultValue, supervisors]);

  const filteredSupervisors = supervisors?.filter(supervisor => 
    (supervisor.name + ' ' + supervisor.surname)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSupervisorSelect = (supervisor: {id: string, name: string, surname: string}) => {
    setSelectedSupervisor(supervisor.id);
    register(name).onChange({target: {value: supervisor.id}});
    setSearchTerm(`${supervisor.name} ${supervisor.surname}`);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          placeholder="Search supervisor..."
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
          value={selectedSupervisor || ''}
        />
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredSupervisors?.map((supervisor) => (
              <div
                key={supervisor.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSupervisorSelect(supervisor)}
              >
                {supervisor.name} {supervisor.surname}
              </div>
            ))}
            {filteredSupervisors?.length === 0 && (
              <div className="p-2 text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
}

