
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-pizza-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🍕</span>
                <span className="font-bold text-xl text-pizza-golden">Júlio's Pizza House</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Há mais de 15 anos levando o autêntico sabor da pizza artesanal 
                italiana para seus eventos especiais. Forno a lenha móvel e 
                ingredientes premium em qualquer lugar.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/juliospizzahouse" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pizza-golden transition-colors"
                >
                  <span className="text-2xl">📷</span>
                </a>
                <a 
                  href="https://facebook.com/juliospizzahouse" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pizza-golden transition-colors"
                >
                  <span className="text-2xl">📘</span>
                </a>
                <a 
                  href="https://wa.me/5511999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pizza-golden transition-colors"
                >
                  <span className="text-2xl">📱</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-pizza-golden mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-pizza-golden transition-colors">Início</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-pizza-golden transition-colors">Sobre Nós</a></li>
                <li><a href="#menu" className="text-gray-300 hover:text-pizza-golden transition-colors">Cardápio</a></li>
                <li><a href="#gallery" className="text-gray-300 hover:text-pizza-golden transition-colors">Galeria</a></li>
                <li><a href="#testimonials" className="text-gray-300 hover:text-pizza-golden transition-colors">Depoimentos</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-pizza-golden transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-pizza-golden mb-4">Contato</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>(11) 3333-4444</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>contato@juliospizzahouse.com.br</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>⏰</span>
                  <div>
                    <div>Seg-Sex: 9h às 18h</div>
                    <div>Sáb: 9h às 14h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Júlio's Pizza House. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-pizza-golden text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-pizza-golden text-sm transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
