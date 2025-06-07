
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Orçamento enviado com sucesso!",
      description: "Entraremos em contato em até 2 horas.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      guestCount: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-pizza-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Solicite seu <span className="text-pizza-golden">Orçamento</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Preencha o formulário e receba uma proposta personalizada para seu evento. 
              Respondemos em até 2 horas!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold text-pizza-dark mb-6">Formulário de Orçamento</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pizza-red focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pizza-red focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone/WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pizza-red focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Evento *</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pizza-red focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="aniversario">Aniversário</option>
                      <option value="casamento">Casamento</option>
                      <option value="corporativo">Evento Corporativo</option>
                      <option value="formatura">Formatura</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data do Evento</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pizza-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Número de Convidados</label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pizza-red focus:border-transparent"
                      placeholder="Ex: 50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem Adicional</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pizza-red focus:border-transparent"
                    placeholder="Conte-nos mais sobre seu evento, preferências especiais, local, etc."
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-pizza-red hover:bg-pizza-red/90 text-white py-3 text-lg"
                >
                  Solicitar Orçamento Gratuito
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-pizza-golden mb-6">Entre em Contato</h3>
                <p className="text-gray-300 mb-8">
                  Nossa equipe está pronta para atender você e tornar seu evento inesquecível. 
                  Entre em contato pelos canais abaixo:
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-pizza-red p-3 rounded-lg">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-pizza-golden mb-1">WhatsApp</h4>
                    <p className="text-gray-300 mb-2">(11) 99999-9999</p>
                    <a 
                      href="https://wa.me/5511999999999" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pizza-golden hover:text-pizza-golden/80 underline"
                    >
                      Enviar mensagem
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-pizza-red p-3 rounded-lg">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-pizza-golden mb-1">Telefone</h4>
                    <p className="text-gray-300 mb-2">(11) 3333-4444</p>
                    <a 
                      href="tel:+551133334444"
                      className="text-pizza-golden hover:text-pizza-golden/80 underline"
                    >
                      Ligar agora
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-pizza-red p-3 rounded-lg">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-pizza-golden mb-1">Email</h4>
                    <p className="text-gray-300 mb-2">contato@juliospizzahouse.com.br</p>
                    <a 
                      href="mailto:contato@juliospizzahouse.com.br"
                      className="text-pizza-golden hover:text-pizza-golden/80 underline"
                    >
                      Enviar email
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-pizza-red p-3 rounded-lg">
                    <span className="text-xl">⏰</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-pizza-golden mb-1">Horário de Atendimento</h4>
                    <p className="text-gray-300">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-gray-300">Sábado: 9h às 14h</p>
                    <p className="text-gray-300">WhatsApp: 24h</p>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-pizza-red/20 p-6 rounded-lg">
                <h4 className="font-bold text-pizza-golden mb-4">Nossas Garantias</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>✅ Resposta em até 2 horas</li>
                  <li>✅ Orçamento gratuito e sem compromisso</li>
                  <li>✅ Visita técnica sem custo</li>
                  <li>✅ Flexibilidade de pagamento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
