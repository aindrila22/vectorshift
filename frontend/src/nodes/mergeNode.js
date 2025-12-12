// mergeNode.js

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

export const MergeNode = ({ id, data }) => {
  const [mergeStrategy, setMergeStrategy] = useState(data?.mergeStrategy || 'concat');

  const handleStrategyChange = (value) => {
    setMergeStrategy(value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input1`,
      style: { top: '25%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input2`,
      style: { top: '50%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input3`,
      style: { top: '75%' }
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
      title="Merge"
      handles={handles}
      style={{ minHeight: 100 }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Strategy</span>
        <Select value={mergeStrategy} onValueChange={handleStrategyChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concat">Concatenate</SelectItem>
            <SelectItem value="sum">Sum</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="join">Join</SelectItem>
          </SelectContent>
        </Select>
      </label>
    </BaseNode>
  );
}

