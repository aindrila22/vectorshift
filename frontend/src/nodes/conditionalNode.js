// conditionalNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'equals');
  const [value, setValue] = useState(data?.value || '');

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
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
      style={{ backgroundColor: '#fff3e0', height: 100 }}
    >
      <label>
        Condition:
        <select value={condition} onChange={handleConditionChange}>
          <option value="equals">Equals</option>
          <option value="greater">Greater Than</option>
          <option value="less">Less Than</option>
          <option value="contains">Contains</option>
        </select>
      </label>
      <label>
        Value:
        <input 
          type="text" 
          value={value} 
          onChange={handleValueChange} 
        />
      </label>
    </BaseNode>
  );
}

