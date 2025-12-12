// conditionalNode.js

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

export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'equals');
  const [value, setValue] = useState(data?.value || '');

  const handleConditionChange = (value) => {
    setCondition(value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
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
      id: `${id}-true`,
      style: { top: '30%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-false`,
      style: { top: '70%' }
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Conditional"
      handles={handles}
      style={{ minHeight: 120 }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Condition</span>
        <Select value={condition} onValueChange={handleConditionChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="greater">Greater Than</SelectItem>
            <SelectItem value="less">Less Than</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Value</span>
        <input 
          type="text" 
          value={value} 
          onChange={handleValueChange}
          className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </label>
    </BaseNode>
  );
}

