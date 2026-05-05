import React, { useState, useEffect } from 'react';
import TreeCard from './components/TreeCard';
import { getAllTrees, createTree, updateTree, deleteTree } from './api';

const defaultTree = {
  name: 'root',
  children: [
    {
      name: 'child1',
      children: [
        { name: 'child1-child1', data: 'c1-c1 Hello' },
        { name: 'child1-child2', data: 'c1-c2 JS' }
      ]
    },
    { name: 'child2', data: 'c2 World' }
  ]
};

function App() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const data = await getAllTrees();
      if (data.trees && data.trees.length > 0) {
        setTrees(data.trees);
      } else {
        setTrees([{
          id: null,
          tree: defaultTree,
          created_at: null,
          updated_at: null,
          isNew: true
        }]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch trees:', err);
      setError('Failed to connect to backend. Showing default tree.');
      setTrees([{
        id: null,
        tree: defaultTree,
        created_at: null,
        updated_at: null,
        isNew: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTreeUpdate = (treeId, updatedTreeData) => {
    setTrees(prevTrees => 
      prevTrees.map(t => 
        t.id === treeId ? { ...t, tree: updatedTreeData } : t
      )
    );
  };

  const handleExport = async (treeId, cleanedTree) => {
    try {
      if (treeId === null) {
        const response = await createTree(cleanedTree);
        setTrees(prevTrees => 
          prevTrees.map(t => 
            t.id === null ? { ...response, isNew: false } : t
          )
        );
        showNotification('Tree saved successfully!');
      } else {
        await updateTree(treeId, cleanedTree);
        showNotification('Tree updated successfully!');
      }
    } catch (err) {
      console.error('Failed to save tree:', err);
      showNotification('Failed to save tree. Backend may be offline.', 'error');
    }
  };

  const handleDelete = async (treeId) => {
    if (!confirm('Are you sure you want to delete this tree?')) return;
    
    try {
      await deleteTree(treeId);
      setTrees(prevTrees => prevTrees.filter(t => t.id !== treeId));
      showNotification('Tree deleted successfully!');
      
      if (trees.length === 1) {
        setTrees([{
          id: null,
          tree: defaultTree,
          created_at: null,
          updated_at: null,
          isNew: true
        }]);
      }
    } catch (err) {
      console.error('Failed to delete tree:', err);
      showNotification('Failed to delete tree.', 'error');
    }
  };

  const handleAddNewTree = () => {
    setTrees(prevTrees => [
      {
        id: null,
        tree: { ...defaultTree },
        created_at: null,
        updated_at: null,
        isNew: true
      },
      ...prevTrees
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Nested Tags Tree
          </h1>
          <p className="text-gray-600">
            AIMonk Full Stack Assignment - Interactive Tree Hierarchy Manager
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all ${
            notification.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleAddNewTree}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md"
          >
            + Add New Tree
          </button>
          <button
            onClick={fetchTrees}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trees...</p>
          </div>
        ) : (
          /* Tree Cards */
          <div className="trees-container">
            {trees.map((tree, index) => (
              <TreeCard
                key={tree.id || `new-${index}`}
                tree={tree}
                onUpdate={handleTreeUpdate}
                onExport={handleExport}
                onDelete={handleDelete}
                isNew={tree.isNew}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React, FastAPI, and SQLite</p>
          <p className="mt-1">Click on tag names to edit them. Press Enter to save.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
