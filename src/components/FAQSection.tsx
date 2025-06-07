
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQSection = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Vocês fornecem toda a estrutura para o evento?',
      answer: 'Sim! Levamos tudo o que é necessário: forno a lenha móvel, utensílios, ingredientes frescos, uniforme da equipe e material de limpeza. Você só precisa garantir um espaço ventilado e uma tomada 220V.'
    },
    {
      question: 'Qual é o número mínimo e máximo de pessoas?',
      answer: 'Atendemos eventos a partir de 30 pessoas. Para eventos maiores, podemos levar mais de um forno e equipe adicional. Já atendemos eventos com mais de 500 pessoas!'
    },
    {
      question: 'Quanto tempo leva para preparar as pizzas?',
      answer: 'Cada pizza fica pronta entre 3-5 minutos no forno a lenha. Conseguimos produzir cerca de 15-20 pizzas por hora por forno, garantindo que sempre tenham pizzas fresquinhas saindo.'
    },
    {
      question: 'Posso personalizar o cardápio?',
      answer: 'Claro! Adaptamos o cardápio conforme suas preferências e restrições alimentares dos convidados. Oferecemos opções vegetarianas, veganas e sem glúten mediante solicitação.'
    },
    {
      question: 'Vocês atendem em que regiões?',
      answer: 'Atendemos toda a região metropolitana. Para eventos fora da nossa área de cobertura principal, consulte-nos sobre taxa de deslocamento.'
    },
    {
      question: 'Como funciona o pagamento?',
      answer: 'Trabalhamos com 50% de entrada para confirmar a data e 50% no dia do evento. Aceitamos cartão, PIX e transferência bancária.'
    },
    {
      question: 'E se chover no dia do evento ao ar livre?',
      answer: 'Nosso forno funciona perfeitamente com chuva! Apenas precisamos de um local coberto (tenda, garagem, área gourmet) que seja ventilado para o funcionamento seguro.'
    },
    {
      question: 'Vocês têm seguro para os eventos?',
      answer: 'Sim, possuímos seguro de responsabilidade civil e todos os nossos equipamentos são certificados. Sua tranquilidade é nossa prioridade.'
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-pizza-dark mb-6">
              Perguntas <span className="text-pizza-red">Frequentes</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Esclarecemos as principais dúvidas sobre nossos serviços. 
              Não encontrou sua pergunta? Entre em contato conosco!
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="font-semibold text-pizza-dark pr-4">{faq.question}</span>
                  <Plus 
                    className={`w-5 h-5 text-pizza-red transition-transform duration-200 flex-shrink-0 ${
                      openQuestion === index ? 'rotate-45' : ''
                    }`} 
                  />
                </button>
                
                {openQuestion === index && (
                  <div className="px-6 pb-4 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-pizza-cream p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-pizza-dark mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-700 mb-6">
              Nossa equipe está pronta para esclarecer todas as suas questões e 
              ajudar você a planejar o evento perfeito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <span className="mr-2">📱</span>
                WhatsApp
              </a>
              <a 
                href="tel:+5511999999999"
                className="inline-flex items-center justify-center bg-pizza-red hover:bg-pizza-red/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <span className="mr-2">📞</span>
                Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
