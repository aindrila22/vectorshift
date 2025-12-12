// baseNode.js
// Base abstraction for all node types

import { useState } from 'react';
import { Handle } from 'reactflow';
import { useStore } from '../store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

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
  const deleteNode = useStore((state) => state.deleteNode);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteNode(id);
    setShowDeleteDialog(false);
  };

  return (
    <div 
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 flex flex-col group"
      style={{
        width: style.width || 220,
        height: style.height || 'auto',
        minWidth: 200,
        minHeight: style.minHeight || 100,
        ...style
      }}
    >
      {/* Render handles */}
      {handles.map((handle, index) => (
        <Handle
          key={`${handle.id}-${index}`}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            ...handle.style,
            zIndex: 10,
            pointerEvents: 'auto'
          }}
          className="!w-3 !h-3 !border-2 !border-slate-200 dark:!border-slate-700 !bg-slate-600 dark:!bg-slate-400 hover:!scale-125 hover:!border-slate-400 dark:hover:!border-slate-500 hover:!bg-slate-500 dark:hover:!bg-slate-300 transition-all duration-200 !cursor-crosshair"
        />
      ))}
      
      {/* Title section */}
      {title && (
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex-shrink-0 flex items-center justify-between relative">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            {title}
          </span>
          <button
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            title="Delete node"
            aria-label="Delete node"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
      
      {/* Custom content */}
      <div className="flex flex-col gap-3 p-3 flex-shrink-0">
        {children}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Node</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this node? This action cannot be undone and will also remove all connections to this node.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 !text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

