import { useState, useEffect } from 'react';

type InputSearchableParentProps = {
  label: string;
  name: string;
  defaultValue?: string;
  register: any;
  error?: any;
  parents?: Array<{id: number, name: string, surname: string}>;
}

export default function InputSearchableParent({
  label,
  name,
  defaultValue,
  register,
  error,
  parents
}: InputSearchableParentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      const defaultParent = parents?.find(p => p.id.toString() === defaultValue);
      if (defaultParent) {
        setSearchTerm(`${defaultParent.name} ${defaultParent.surname}`);
      }
    }
  }, [defaultValue, parents]);

  const filteredParents = parents?.filter(parent => 
    (parent.name + ' ' + parent.surname)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          placeholder="Search parent..."
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
          defaultValue={defaultValue}
        />
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredParents?.map((parent) => (
              <div
                key={parent.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  register(name).onChange({target: {value: parent.id.toString()}});
                  setSearchTerm(`${parent.name} ${parent.surname}`);
                  setIsOpen(false);
                }}
              >
                {parent.name} {parent.surname}
              </div>
            ))}
            {filteredParents?.length === 0 && (
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
