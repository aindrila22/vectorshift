// draggableNode.js

import { 
  ArrowDownToLine, 
  Brain, 
  ArrowUpFromLine, 
  Type, 
  Hash, 
  GitBranch, 
  ArrowRightLeft, 
  GitMerge, 
  SplitSquareHorizontal 
} from 'lucide-react';

const iconMap = {
  customInput: ArrowDownToLine,
  llm: Brain,
  customOutput: ArrowUpFromLine,
  text: Type,
  number: Hash,
  conditional: GitBranch,
  transform: ArrowRightLeft,
  merge: GitMerge,
  split: SplitSquareHorizontal,
};

export const DraggableNode = ({ type, label }) => {
    const Icon = iconMap[type] || Type;
    
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.currentTarget.classList.add('opacity-50', 'scale-95');
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const onDragEnd = (event) => {
      event.currentTarget.classList.remove('opacity-50', 'scale-95');
    };
  
    return (
      <div
        className="group cursor-grab active:cursor-grabbing min-w-[100px] h-12 px-3 flex items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 select-none"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={onDragEnd}
        draggable
        title={label}
      >
          <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
          <span className="text-xs font-medium group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">{label}</span>
      </div>
    );
  };
  