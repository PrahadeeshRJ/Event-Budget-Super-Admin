import React, { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MultiInputFieldProps {
  placeholder?: string;
  eventId: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({ placeholder, eventId, tags: initialTags, onTagsChange }) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const handleAddTag = async () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      const newTags = [...tags, trimmedValue];
      setTags(newTags);
      setInputValue('');
      onTagsChange(newTags);
    }
  };

  const handleRemoveTag = async (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    onTagsChange(updatedTags);

  };



  return (
    <div className="multi-input-field border border-[#D4D4D8] text-sm rounded h-10 flex items-center gap-2 overflow-x-auto px-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="tag flex items-center gap-2 bg-primary-text_primary text-white px-3 py-1 rounded-[30px] flex-shrink-0"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => handleRemoveTag(index)}
            className="delete-button text-white rounded-full"
          >
            <CircleX size={18} />
          </button>
        </div>
      ))}
      <div className="flex items-center flex-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 h-full border-none outline-none"
        />
        {/* <Button type="button" onClick={handleAddTag}>Add</Button> */}
      </div>
    </div>
  );
};

export default MultiInputField;
