import React, { useState } from 'react';

const TagView = ({ node, onUpdate, path = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(node.name);

  const handleDataChange = (e) => {
    onUpdate(path, { ...node, data: e.target.value });
  };

  const handleAddChild = () => {
    const newChild = { name: 'New Child', data: 'Data' };
    
    if (node.data !== undefined) {
      const updatedNode = {
        name: node.name,
        children: [newChild]
      };
      onUpdate(path, updatedNode);
    } else {
      const updatedNode = {
        ...node,
        children: [...(node.children || []), newChild]
      };
      onUpdate(path, updatedNode);
    }
  };

  const handleChildUpdate = (childIndex, updatedChild) => {
    const newChildren = [...node.children];
    newChildren[childIndex] = updatedChild;
    onUpdate(path, { ...node, children: newChildren });
  };

  const handleNameClick = () => {
    setIsEditingName(true);
    setEditedName(node.name);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      onUpdate(path, { ...node, name: editedName });
      setIsEditingName(false);
    } else if (e.key === 'Escape') {
      setEditedName(node.name);
      setIsEditingName(false);
    }
  };

  const handleNameBlur = () => {
    onUpdate(path, { ...node, name: editedName });
    setIsEditingName(false);
  };

  return (
    <div className="tag-container border-2 border-gray-300 rounded-lg mb-3 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="tag-header flex items-center bg-blue-500 text-white px-3 py-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="collapse-btn w-6 h-6 flex items-center justify-center mr-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold transition-colors"
        >
          {isCollapsed ? '>' : 'v'}
        </button>
        
        {isEditingName ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleNameKeyDown}
            onBlur={handleNameBlur}
            className="flex-1 px-2 py-1 text-black rounded text-sm font-medium"
            autoFocus
          />
        ) : (
          <span
            onClick={handleNameClick}
            className="tag-name flex-1 font-semibold cursor-pointer hover:underline"
            title="Click to edit name"
          >
            {node.name}
          </span>
        )}
        
        <button
          onClick={handleAddChild}
          className="add-child-btn ml-2 px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm font-medium transition-colors"
        >
          Add Child
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="tag-content p-3">
          {node.children && node.children.length > 0 ? (
            <div className="children-container pl-4 border-l-2 border-gray-200">
              {node.children.map((child, index) => (
                <TagView
                  key={index}
                  node={child}
                  onUpdate={(childPath, updatedChild) => {
                    if (childPath.length === 0) {
                      handleChildUpdate(index, updatedChild);
                    } else {
                      const [nextIndex, ...rest] = childPath;
                      const newChildren = [...node.children];
                      newChildren[nextIndex] = updateNestedChild(newChildren[nextIndex], rest, updatedChild);
                      onUpdate(path, { ...node, children: newChildren });
                    }
                  }}
                  path={[index]}
                />
              ))}
            </div>
          ) : node.data !== undefined ? (
            <div className="data-container">
              <label className="block text-sm font-medium text-gray-600 mb-1">Data:</label>
              <input
                type="text"
                value={node.data}
                onChange={handleDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter data..."
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const updateNestedChild = (node, path, updatedChild) => {
  if (path.length === 0) {
    return updatedChild;
  }
  const [index, ...rest] = path;
  const newChildren = [...node.children];
  newChildren[index] = updateNestedChild(newChildren[index], rest, updatedChild);
  return { ...node, children: newChildren };
};

export default TagView;
