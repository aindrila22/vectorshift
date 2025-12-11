// baseNode.js
// Base abstraction for all node types

import { Handle, Position } from 'reactflow';

/**
 * BaseNode - A reusable base component for all node types
 * 
 * @param {string} id - The unique identifier for the node
 * @param {object} data - The node's data object
 * @param {string} title - The title/header text for the node
 * @param {array} handles - Array of handle configurations
 *   Each handle config: { type: 'source'|'target', position: Position, id: string, style?: object }
 * @param {ReactNode} children - Custom content to render inside the node
 * @param {object} style - Optional custom styles to override defaults
 */
export const BaseNode = ({ id, data, title, handles = [], children, style = {} }) => {
  const defaultStyle = {
    width: 200,
    height: 80,
    border: '1px solid black',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    ...style
  };

  return (
    <div style={defaultStyle}>
      {/* Render handles */}
      {handles.map((handle, index) => (
        <Handle
          key={`${handle.id}-${index}`}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style || {}}
        />
      ))}
      
      {/* Title section */}
      {title && (
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          <span>{title}</span>
        </div>
      )}
      
      {/* Custom content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {children}
      </div>
    </div>
  );
};

