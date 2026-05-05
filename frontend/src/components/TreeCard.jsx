import React, { useState } from 'react';
import TagView from './TagView';

const TreeCard = ({ tree, onUpdate, onExport, onDelete, isNew = false }) => {
  const [showExport, setShowExport] = useState(false);
  const [exportedJson, setExportedJson] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanTree = (node) => {
    const cleaned = { name: node.name };
    if (node.children && node.children.length > 0) {
      cleaned.children = node.children.map(cleanTree);
    } else if (node.data !== undefined) {
      cleaned.data = node.data;
    }
    return cleaned;
  };

  const handleExport = async () => {
    const cleaned = cleanTree(tree.tree);
    const jsonString = JSON.stringify(cleaned, null, 2);
    setExportedJson(jsonString);
    setShowExport(true);
    
    await onExport(tree.id, cleaned);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(exportedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTreeUpdate = (path, updatedNode) => {
    onUpdate(tree.id, updatedNode);
  };

  return (
    <div className="tree-card bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-md">
      <div className="tree-header flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Tree #{tree.id || 'New'}
            {isNew && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded">Unsaved</span>}
          </h3>
          {tree.created_at && (
            <p className="text-sm text-gray-500">
              Created: {new Date(tree.created_at).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="export-btn px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Export
          </button>
          {tree.id && !isNew && (
            <button
              onClick={() => onDelete(tree.id)}
              className="delete-btn px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <TagView
        node={tree.tree}
        onUpdate={handleTreeUpdate}
        path={[]}
      />

      {showExport && (
        <div className="export-output mt-4 border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b border-gray-300">
            <h4 className="font-semibold text-gray-700">Exported JSON:</h4>
            <div className="flex gap-2">
              <button
                onClick={handleCopyJson}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
              <button
                onClick={() => setShowExport(false)}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm font-medium transition-colors"
              >
                Hide
              </button>
            </div>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm max-h-96 overflow-y-auto">
            {exportedJson}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TreeCard;
