
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
          Pizzas Artesanais no{' '}
          <span className="text-pizza-golden">Seu Evento</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Leve o <strong>buffet com forno a lenha</strong> para sua festa! 
          Sabor autêntico que transforma qualquer evento em uma experiência inesquecível.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          <Button 
            size="lg" 
            className="bg-pizza-red hover:bg-pizza-red/90 text-white px-8 py-3 text-lg"
          >
            Solicitar Orçamento
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-pizza-red px-8 py-3 text-lg"
          >
            Ver Cardápio
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-pizza-golden">500+</div>
            <div className="text-sm uppercase tracking-wide">Eventos Realizados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pizza-golden">15</div>
            <div className="text-sm uppercase tracking-wide">Anos de Experiência</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pizza-golden">98%</div>
            <div className="text-sm uppercase tracking-wide">Clientes Satisfeitos</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
