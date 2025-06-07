
import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = '5511999999999';
  const message = 'Olá! Gostaria de solicitar um orçamento para meu evento.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Entrar em contato via WhatsApp"
    >
      <div className="flex items-center">
        <span className="text-2xl">📱</span>
        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          WhatsApp
        </span>
      </div>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
    </a>
  );
};

export default WhatsAppButton;
