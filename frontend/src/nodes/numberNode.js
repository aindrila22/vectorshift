// numberNode.js

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

export const NumberNode = ({ id, data }) => {
  const [number, setNumber] = useState(data?.number || 0);
  const [operation, setOperation] = useState(data?.operation || 'set');

  const handleNumberChange = (e) => {
    setNumber(parseFloat(e.target.value) || 0);
  };

  const handleOperationChange = (value) => {
    setOperation(value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Number"
      handles={handles}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Operation</span>
        <Select value={operation} onValueChange={handleOperationChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="set">Set Value</SelectItem>
            <SelectItem value="add">Add</SelectItem>
            <SelectItem value="multiply">Multiply</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Value</span>
        <input 
          type="number" 
          value={number} 
          onChange={handleNumberChange}
          className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </label>
    </BaseNode>
  );
}

