// llmNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-system`,
      style: { top: `${100/3}%` }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: `${200/3}%` }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      handles={handles}
    >
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Large Language Model
      </div>
    </BaseNode>
  );
}
