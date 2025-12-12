// inputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (value) => {
    setInputType(value);
  };

  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-value`
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      handles={handles}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Name</span>
        <input 
          type="text" 
          value={currName} 
          onChange={handleNameChange}
          className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Type</span>
        <Select value={inputType} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Text">Text</SelectItem>
            <SelectItem value="File">File</SelectItem>
          </SelectContent>
        </Select>
      </label>
    </BaseNode>
  );
}
