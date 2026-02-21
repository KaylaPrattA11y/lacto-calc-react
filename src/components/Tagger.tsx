import React, { useEffect, useRef, useState } from "react";
import { HiPlus, HiX } from "react-icons/hi";
import Input, { type InputProps } from "./Input";

interface TaggerProps extends InputProps {
  onChangeTags?: (tags: Set<string>) => void;
}

export default function Tagger({ onChangeTags, ...inputProps }: TaggerProps) {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [tagsExceeded, setTagsExceeded] = useState(false);
  const maxTags = 5;
  const inputRef = useRef<HTMLInputElement|null>(null);

  // Notify parent component when tags change
  useEffect(() => {
    if (onChangeTags) {
      onChangeTags(tags);
    }
  }, [tags, onChangeTags]);
  
  function handleAddTag() {
    if (!inputValue.trim() || tagsExceeded) return;
    setTags(prev => {
      const newTags = new Set(prev);
      newTags.add(inputValue.trim());
      setTagsExceeded(newTags.size >= maxTags);
      return newTags;
    });
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleDeleteTag(tagToDelete: string) {
    setTags(prev => {
      const newTags = new Set(prev);
      newTags.delete(tagToDelete);
      setTagsExceeded(newTags.size >= maxTags);
      return newTags;
    });
  }
  
  return (
    <div className="tagger">
      <Input 
        ref={inputRef}
        type="text" 
        className="tagger--input" 
        value={inputValue}
        maxLength={20}
        onChange={e => {
          setInputValue(e.target.value);
        }}
        onKeyDown={e => {
          // Detect Enter and comma (desktop + mobile keyboards)
          const isEnter = e.key === 'Enter' || ["Enter", "NumpadEnter"].includes(e.code);
          const isComma = e.key === ',' || e.code === 'Comma';

          if (isEnter || isComma) {
            e.preventDefault();
            handleAddTag();
          }
        }}
        disabled={tagsExceeded}
        {...inputProps} 
        addon={<button aria-label="Add tag" type="button" onClick={handleAddTag} className="tagger--add-button is-primary" disabled={tagsExceeded}><HiPlus /></button>}
        description={`Add up to ${maxTags} tags using Enter, Comma, or by clicking the + (plus) button.`}
      />
      <input type="hidden" value={[...tags]} />
      <ul className="tagger--list">
        {[...tags].map((tag, index) => (
          <li key={index} className="tagger--tag">
            <button type="button" className="tagger--tag-button is-sm" onClick={() => handleDeleteTag(tag)}>{tag} <HiX /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}