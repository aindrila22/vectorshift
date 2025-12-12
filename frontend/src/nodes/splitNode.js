// splitNode.js

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

export const SplitNode = ({ id, data }) => {
  const [splitBy, setSplitBy] = useState(data?.splitBy || 'newline');
  const [maxOutputs, setMaxOutputs] = useState(data?.maxOutputs || 3);

  const handleSplitByChange = (value) => {
    setSplitBy(value);
  };

  const handleMaxOutputsChange = (e) => {
    setMaxOutputs(parseInt(e.target.value) || 1);
  };

  // Dynamically generate handles based on maxOutputs
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
    },
    ...Array.from({ length: Math.min(maxOutputs, 5) }, (_, i) => ({
      type: 'source',
      position: Position.Right,
      id: `${id}-output${i + 1}`,
      style: { top: `${((i + 1) * 100) / (Math.min(maxOutputs, 5) + 1)}%` }
    }))
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Split"
      handles={handles}
      style={{ minHeight: Math.max(120, maxOutputs * 20 + 80) }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Split By</span>
        <Select value={splitBy} onValueChange={handleSplitByChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newline">Newline</SelectItem>
            <SelectItem value="comma">Comma</SelectItem>
            <SelectItem value="space">Space</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Max Outputs</span>
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={maxOutputs} 
          onChange={handleMaxOutputsChange}
          className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </label>
    </BaseNode>
  );
}

