
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Júlio's Pizza House
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-orange-400">
            Home
          </Link>
          <Link to="/cardapio" className="hover:text-orange-400">
            Cardápio
          </Link>
          <Link to="/admin" className="hover:text-orange-400">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
