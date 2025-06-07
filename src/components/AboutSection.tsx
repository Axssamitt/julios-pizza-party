
import React from 'react';

const AboutSection = () => {
  const features = [
    {
      icon: '🔥',
      title: 'Forno a Lenha Móvel',
      description: 'Levamos nosso forno artesanal até o seu evento, assando pizzas fresquinhas na hora.'
    },
    {
      icon: '👨‍🍳',
      title: 'Chefs Especializados',
      description: 'Nossa equipe tem mais de 15 anos de experiência em gastronomia italiana.'
    },
    {
      icon: '🎯',
      title: 'Personalização Total',
      description: 'Adaptamos o cardápio e serviço conforme o perfil do seu evento e convidados.'
    },
    {
      icon: '⏰',
      title: 'Pontualidade',
      description: 'Chegamos sempre no horário combinado, com tudo preparado para começar.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-pizza-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-pizza-dark mb-6">
              Sobre a <span className="text-pizza-red">Júlio's Pizza House</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Há mais de 15 anos, transformamos eventos em experiências gastronômicas únicas. 
              Somos especializados em buffet de pizzas artesanais com forno a lenha móvel, 
              levando o autêntico sabor italiano até você.
            </p>
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-pizza-dark mb-6">Nossa História</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Tudo começou com a paixão do Júlio pela culinária italiana autêntica. 
                Após anos aperfeiçoando receitas tradicionais, ele decidiu levar essa experiência 
                diretamente aos eventos, criando momentos inesquecíveis.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Hoje, nossa empresa é referência em buffet de pizzas artesanais, 
                atendendo desde pequenos aniversários até grandes eventos corporativos, 
                sempre mantendo o mesmo cuidado e qualidade que nos tornaram conhecidos.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pizza-red">500+</div>
                  <div className="text-sm text-gray-600">Eventos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pizza-red">15</div>
                  <div className="text-sm text-gray-600">Anos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pizza-red">98%</div>
                  <div className="text-sm text-gray-600">Satisfação</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Júlio preparando pizza no forno a lenha"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-pizza-red text-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm">Anos de tradição</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group hover:-translate-y-2 transition-transform"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-pizza-dark mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
