import React from 'react';
import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 flex flex-col">
      {/* Logo or Top section */}
      <div className="flex items-center mb-8">
      </div>

      {/* Menu Section */}
      <div className="mb-8">
        <div className="text-gray-500 text-sm mb-4">Menu</div>
        <nav className="space-y-4">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-600 bg-purple-100 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                : "flex items-center text-gray-600 hover:text-blue-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            }
          >
            <span className="ml-3">Home</span>
          </NavLink>

          <NavLink
            to="/emploi"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-600 bg-purple-100 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                : "flex items-center text-gray-600 hover:text-blue-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            }
          >
            <span className="ml-3">Add Time Table</span>
          </NavLink>
          <NavLink
            to="/Edittable"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-600 bg-purple-100 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                : "flex items-center text-gray-600 hover:text-blue-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            }
          >
            <span className="ml-3">Time Tables</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout Section */}
      <div className="mt-auto pt-40">
        <NavLink
          to="/LoginAdmin"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-600 bg-purple-100 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              : "flex items-center text-gray-600 hover:text-blue-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
          }
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
