'use client';

import { useState } from 'react';
import { User } from '@/types/types';
import { motion } from 'framer-motion';

export default function ProfileModal({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(user); 

  if (!user) return null; 

  const filteredEntries = Object.entries(user).filter(
    ([key]) => !['password', 'id', 'createdat'].includes(key.toLowerCase())
  );

  const handleChange = (key: string, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      setIsOpen(false);
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      console.log('There was an error updating your profile.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-b-2xl transition-all duration-300"
      >
        Complete the profile
      </button>

      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-gray-900 text-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Profile Details</h2>
            <ul className="space-y-3">
              {filteredEntries.map(([key, value]) => (
                <li key={key} className="flex justify-between border-b border-gray-700 pb-1">
                  <span className="capitalize text-gray-400">{key}: </span>
                  <input
                    type="text"
                    value={editedUser[key as keyof User] || value}  
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="bg-transparent text-white  focus:outline-none w-full ml-2"
                  />
                </li>
              ))}

            </ul>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-lg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
