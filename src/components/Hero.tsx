
import React, { useState, useEffect } from 'react';
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
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 z-10">
        <div className="text-center text-white">
          {config?.visivel_nome_empresa && config?.nome_empresa && (
            <p className="text-lg md:text-xl mb-4 text-orange-300">
              {config.nome_empresa}
            </p>
          )}
          
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {config?.titulo_hero || 'As Melhores Pizzas de Londrina'}
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {config?.subtitulo_hero || 'Sabor autêntico que vai até você. Pizzas artesanais feitas com ingredientes frescos e muito amor.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {config?.visivel_endereco && config?.endereco && (
              <div className="flex items-center gap-2 text-gray-300">
                <span>📍</span>
                <span>{config.endereco}</span>
              </div>
            )}
            
            {config?.visivel_telefone && config?.telefone && (
              <div className="flex items-center gap-2 text-gray-300">
                <span>📞</span>
                <a href={`tel:${config.telefone}`} className="hover:text-orange-400 transition-colors">
                  {config.telefone}
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-6">
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
          
          <div className="mt-12">
            <a 
              href="#pizzas" 
              className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Ver Cardápio
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <HeroCarousel />
    </section>
  );
};
