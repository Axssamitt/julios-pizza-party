
import React, { useState, useEffect } from 'react';
import { MapPin, Utensils } from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';
import { supabase } from '@/integrations/supabase/client';

interface HomeConfig {
  titulo_hero: string;
  subtitulo_hero: string;
  nome_empresa: string | null;
  endereco: string | null;
  telefone: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  visivel_nome_empresa: boolean | null;
  visivel_endereco: boolean | null;
  visivel_telefone: boolean | null;
  visivel_facebook: boolean | null;
  visivel_instagram: boolean | null;
}

export const Hero = () => {
  const [config, setConfig] = useState<HomeConfig | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('home_config')
        .select('*')
        .single();

      if (error) throw error;
      setConfig(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Logo Principal */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <img 
                src="/lovable-uploads/b04f55da-ed47-4b77-bf34-8b7b23d12107.png" 
                alt="Júlio's Pizza House" 
                className="w-48 h-48 md:w-64 md:h-64 object-cover"
              />
            </div>

            {config?.visivel_nome_empresa && config?.nome_empresa && (
              <p className="text-lg md:text-xl mb-4 text-orange-300">
                {config.nome_empresa}
              </p>
            )}
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                {config?.titulo_hero || 'As Melhores Pizzas de Londrina'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl">
              {config?.subtitulo_hero || 'Sabor autêntico que vai até você. Pizzas artesanais feitas com ingredientes frescos e muito amor.'}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {config?.visivel_endereco && config?.endereco && (
                <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <MapPin className="text-orange-400" size={24} />
                  <span className="text-gray-300">{config.endereco}</span>
                </div>
              )}
              <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <Utensils className="text-orange-400" size={24} />
                <span className="text-gray-300">Buffet para Eventos</span>
              </div>
            </div>

            {/* Contact Info */}
            {config?.visivel_telefone && config?.telefone && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-300 mb-6">
                <span>📞</span>
                <a href={`tel:${config.telefone}`} className="hover:text-orange-400 transition-colors">
                  {config.telefone}
                </a>
              </div>
            )}

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start gap-6 mb-8">
              {config?.visivel_facebook && config?.facebook_url && (
                <a 
                  href={config.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-orange-400 transition-colors text-2xl"
                  aria-label="Facebook"
                >
                  📘
                </a>
              )}
              
              {config?.visivel_instagram && config?.instagram_url && (
                <a 
                  href={config.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-orange-400 transition-colors text-2xl"
                  aria-label="Instagram"
                >
                  📷
                </a>
              )}
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <a 
                href="#pizzas" 
                className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Ver Cardápio
              </a>
            </div>
          </div>

          {/* Hero Carousel */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto lg:max-w-full">
              <HeroCarousel />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
