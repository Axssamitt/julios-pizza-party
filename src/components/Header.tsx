
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'INÍCIO', href: '/', type: 'route' },
    { label: 'SOBRE NÓS', href: '#about', type: 'anchor' },
    { label: 'CARDÁPIO', href: '/cardapio', type: 'route' },
    { label: 'INSTAGRAM', href: '#instagram', type: 'anchor' },
    { label: 'CONTATO', href: '#contact', type: 'anchor' },
    { label: 'ADMIN', href: '/auth', type: 'route' }
  ];

  const handleMenuClick = (href: string, type: string) => {
    setIsMenuOpen(false);
    if (type === 'anchor') {
      // Se não estamos na página inicial, vamos para ela primeiro
      if (window.location.pathname !== '/') {
        navigate('/');
        // Aguarda um pouco para a página carregar antes de fazer o scroll
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Se já estamos na página inicial, faz o scroll diretamente
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (type === 'route') {
      navigate(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-orange-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img 
                src="/lovable-uploads/b04f55da-ed47-4b77-bf34-8b7b23d12107.png" 
                alt="Júlio's Pizza House Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Júlio's Pizza House
              </h1>
              <p className="text-orange-400 text-sm">O sabor vai até você</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item.href, item.type)}
                className={`text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium ${
                  item.label === 'ADMIN' ? 'bg-orange-500/20 px-3 py-1 rounded-md border border-orange-500/50' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:text-orange-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuClick(item.href, item.type)}
                  className={`text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium text-left ${
                    item.label === 'ADMIN' ? 'bg-orange-500/20 px-3 py-2 rounded-md border border-orange-500/50 text-center' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
