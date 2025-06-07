
import React from 'react';
import { Button } from '@/components/ui/button';

const MenuSection = () => {
  const pizzas = [
    {
      name: 'Margherita Especial',
      description: 'Molho de tomate artesanal, mussarela de búfala, manjericão fresco e azeite extravirgem',
      price: 'R$ 35',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      popular: true
    },
    {
      name: 'Quattro Formaggi',
      description: 'Mussarela, gorgonzola, parmesão e provolone com toque de mel',
      price: 'R$ 42',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Calabresa Premium',
      description: 'Calabresa artesanal, cebola roxa, azeitonas pretas e orégano',
      price: 'R$ 38',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Vegetariana Deluxe',
      description: 'Abobrinha, berinjela, pimentão, tomate cereja e rúcula',
      price: 'R$ 40',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Prosciutto e Rúcula',
      description: 'Presunto de Parma, rúcula, tomate cereja e lascas de parmesão',
      price: 'R$ 45',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Napolitana',
      description: 'Molho de tomate, mussarela, anchovas, azeitonas e manjericão',
      price: 'R$ 41',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-pizza-dark mb-6">
              Nosso <span className="text-pizza-red">Cardápio</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Pizzas artesanais feitas com ingredientes frescos e selecionados, 
              assadas no tradicional forno a lenha para garantir o sabor autêntico.
            </p>
          </div>

          {/* Pizza Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {pizzas.map((pizza, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img 
                    src={pizza.image} 
                    alt={pizza.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {pizza.popular && (
                    <div className="absolute top-4 left-4 bg-pizza-red text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mais Pedida
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-pizza-golden text-white px-3 py-1 rounded-full font-bold">
                    {pizza.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-pizza-dark mb-3">{pizza.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{pizza.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pizza-red">{pizza.price}</span>
                    <Button 
                      size="sm" 
                      className="bg-pizza-red hover:bg-pizza-red/90 text-white"
                    >
                      Incluir no Evento
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-pizza-cream p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-pizza-dark mb-4">
              Cardápio Personalizado para Seu Evento
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Podemos adaptar nosso cardápio conforme suas preferências e necessidades. 
              Entre em contato para uma proposta personalizada!
            </p>
            <Button className="bg-pizza-red hover:bg-pizza-red/90 text-white px-8 py-3">
              Solicitar Cardápio Personalizado
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
