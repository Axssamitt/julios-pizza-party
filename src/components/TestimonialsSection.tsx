
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Maria Silva',
      event: 'Casamento',
      rating: 5,
      text: 'Simplesmente perfeito! As pizzas estavam deliciosas e o atendimento foi impecável. Nossos convidados não paravam de elogiar. Recomendo de olhos fechados!',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'João Santos',
      event: 'Evento Corporativo',
      rating: 5,
      text: 'Contratamos para um evento da empresa e foi um sucesso total. A equipe é muito profissional e as pizzas são realmente artesanais. Voltaremos a contratar!',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Ana Costa',
      event: 'Aniversário 15 anos',
      rating: 5,
      text: 'A festa da minha filha ficou inesquecível! O forno a lenha foi uma atração à parte e as pizzas estavam maravilhosas. Muito obrigada!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Roberto Lima',
      event: 'Festa de Família',
      rating: 5,
      text: 'Qualidade excepcional! Desde o primeiro contato até a execução do evento, tudo foi perfeito. As crianças adoraram ver as pizzas sendo feitas.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-xl ${index < rating ? 'text-pizza-golden' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-pizza-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-pizza-dark mb-6">
              O que nossos <span className="text-pizza-red">clientes</span> dizem
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              A satisfação dos nossos clientes é nossa maior recompensa. 
              Veja o que eles falam sobre nossos serviços.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Quote Icon */}
                <div className="text-pizza-red text-4xl mb-4 opacity-20">
                  "
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Client Info */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-pizza-dark">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-pizza-red mb-2">500+</div>
              <div className="text-gray-600">Eventos Realizados</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-pizza-red mb-2">98%</div>
              <div className="text-gray-600">Satisfação</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-pizza-red mb-2">15</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-pizza-red mb-2">24h</div>
              <div className="text-gray-600">Resposta Garantida</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
