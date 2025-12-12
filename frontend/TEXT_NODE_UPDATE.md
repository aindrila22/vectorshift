# Text Node Enhancement - Update Summary

## Overview
This update enhances the Text node with two major improvements:
1. **Dynamic Node Resizing**: The Text node now automatically adjusts its width and height based on the text content entered by the user
2. **Dynamic Variable Handles**: The Text node automatically creates input handles for variables detected in the text input (variables defined with double curly brackets like `{{variableName}}`)

## Changes Made

### 1. Dynamic Node Resizing

The Text node now dynamically resizes to improve visibility of the text content.

**Features:**
- **Width Adjustment**: Node width increases/decreases based on text length
  - Minimum width: 200px
  - Maximum width: 500px
  - Uses a hidden measurement element to accurately calculate text width
- **Height Adjustment**: Node height adjusts to fit content optimally
  - Minimum height: 70px
  - Calculates height based on title, label, input field, and padding
  - Reduced gaps and padding for more compact display

**Implementation Details:**
- Uses `useRef` to create a hidden span element for text width measurement
- `useEffect` hook recalculates dimensions whenever `currText` changes
- Dimensions are stored in state and passed to `BaseNode` via the `style` prop

**User Experience:**
- Text remains fully visible as users type
- Node expands gracefully to accommodate longer text
- Node contracts when text is removed
- No manual resizing required

### 2. Dynamic Variable Handle Creation

The Text node now automatically creates input handles for variables defined in double curly brackets.

**Features:**
- **Variable Detection**: Automatically detects valid JavaScript variable names within `{{variableName}}` syntax
  - Valid variable pattern: `{{[a-zA-Z_$][a-zA-Z0-9_$]*}}`
  - Supports standard JavaScript identifier rules
  - Extracts unique variable names (no duplicates)
- **Dynamic Handle Generation**: Creates a target handle on the left side for each detected variable
  - Handles are positioned evenly along the left edge
  - Position calculation: `(index + 1) * 100 / (variableCount + 1)%`
  - Single variable: positioned at 50% (center)
  - Multiple variables: evenly distributed
- **Variable Labels**: Each handle displays a label showing the variable name
  - Labels appear to the left of the node
  - Styled with subtle background and border for readability
  - Non-interactive (pointer events disabled)

**Implementation Details:**
- Uses `useMemo` to extract variables from text using regex pattern matching
- Variable extraction recalculates only when `currText` changes
- Handles array is generated using `useMemo` based on extracted variables
- Each handle includes:
  - `type: 'target'` (input handle)
  - `position: Position.Left`
  - `id: ${id}-${varName}` (unique identifier)
  - `varName` property (for label display)
  - Dynamic `top` style for positioning

**Examples:**
- Input: `"Hello {{name}}"` → Creates 1 handle labeled "name" at 50% position
- Input: `"{{input1}} and {{input2}}"` → Creates 2 handles labeled "input1" and "input2" at ~33% and ~67% positions
- Input: `"{{user}} said {{message}} to {{recipient}}"` → Creates 3 handles evenly distributed

**User Experience:**
- Handles appear/disappear automatically as users add/remove variables
- Clear visual indication of which variables are expected
- Labels help identify which handle corresponds to which variable
- Seamless integration with existing React Flow connection system

## Technical Implementation

### Key React Hooks Used

1. **`useState`**: 
   - `currText`: Current text input value
   - `dimensions`: Current node width and height

2. **`useRef`**: 
   - `measureRef`: Reference to hidden span element for text measurement

3. **`useMemo`**: 
   - `extractVariables`: Extracts unique variable names from text (recomputes on `currText` change)
   - `handles`: Generates handle configurations (recomputes on `extractVariables` change)

4. **`useEffect`**: 
   - Recalculates node dimensions when text changes

### Regex Pattern for Variable Detection

```javascript
/\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g
```

- Matches: `{{variableName}}` format
- Captures: Valid JavaScript identifier
- Validates: Variable name must start with letter, `_`, or `$`
- Allows: Letters, numbers, `_`, and `$` in remaining characters

### Dimension Calculation

**Width:**
```javascript
const calculatedWidth = Math.max(minWidth, Math.min(maxWidth, textWidth + padding));
```

**Height:**
```javascript
const calculatedHeight = Math.max(minHeight, titleHeight + labelHeight + inputHeight + gap + padding);
```

### Handle Positioning

For multiple handles:
```javascript
top: `${((index + 1) * 100) / (variableCount + 1)}%`
```

This distributes handles evenly across the available vertical space.

## Files Changed

### Modified Files
- `frontend/src/nodes/textNode.js`: Complete enhancement with dynamic resizing and variable handle detection

## Benefits

1. **Improved Usability**: Users can see their full text input without manual resizing
2. **Better UX**: Dynamic handles make it clear what inputs the node expects
3. **Automatic Configuration**: No manual handle configuration needed - it's all automatic
4. **Clean Integration**: Works seamlessly with existing React Flow infrastructure
5. **Performance Optimized**: Uses `useMemo` to prevent unnecessary recalculations

## Testing Scenarios

1. **Dynamic Resizing**:
   - Type short text → node stays at minimum size
   - Type long text → node expands to maximum width
   - Delete text → node contracts appropriately
   - Very long text → node caps at maximum width

2. **Variable Detection**:
   - Enter `"{{input}}"` → 1 handle appears
   - Enter `"{{var1}} and {{var2}}"` → 2 handles appear
   - Remove variables → handles disappear
   - Invalid syntax like `"{{123}}"` → ignored (not valid JS identifier)
   - Whitespace in brackets → trimmed correctly

3. **Handle Positioning**:
   - Single variable → handle at center (50%)
   - Two variables → handles at ~33% and ~67%
   - Three variables → handles at ~25%, ~50%, and ~75%

## Future Enhancements (Potential)

- Multi-line text input support (textarea instead of input)
- Height adjustment for multi-line text
- Variable validation/error handling
- Tooltip on handles with variable usage information
- Custom handle colors or styles per variable

