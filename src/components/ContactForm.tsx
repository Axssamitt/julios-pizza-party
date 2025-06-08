
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Config {
  whatsapp_numero: string;
  whatsapp_mensagem: string;
}

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    endereco: '',
    endereco_evento: '',
    data_evento: '',
    horario: '',
    quantidade_adultos: '',
    quantidade_criancas: '',
    telefone: '',
    observacoes: ''
  });
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor')
        .in('chave', ['whatsapp_numero', 'whatsapp_mensagem']);
      
      if (error) throw error;
      
      const configObj = data.reduce((acc, item) => {
        acc[item.chave as keyof Config] = item.valor;
        return acc;
      }, {} as Config);
      
      setConfig(configObj);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const formatarMensagemWhatsApp = () => {
    if (!config) return '';

    const mensagem = `${config.whatsapp_mensagem}

*DADOS DO CLIENTE:*
Nome: ${formData.nome_completo}
CPF: ${formData.cpf}
Telefone: ${formData.telefone}
Endereço: ${formData.endereco}

*DADOS DO EVENTO:*
Data: ${new Date(formData.data_evento).toLocaleDateString('pt-BR')}
Horário: ${formData.horario}
Local: ${formData.endereco_evento}
Adultos: ${formData.quantidade_adultos}
Crianças: ${formData.quantidade_criancas}

${formData.observacoes ? `*OBSERVAÇÕES:*\n${formData.observacoes}` : ''}`;

    return encodeURIComponent(mensagem);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Salvar no banco de dados
      const { error } = await supabase
        .from('formularios_contato')
        .insert({
          ...formData,
          quantidade_adultos: parseInt(formData.quantidade_adultos),
          quantidade_criancas: parseInt(formData.quantidade_criancas) || 0
        });

      if (error) throw error;

      // Redirecionar para WhatsApp
      if (config?.whatsapp_numero) {
        const mensagem = formatarMensagemWhatsApp();
        const whatsappUrl = `https://wa.me/${config.whatsapp_numero}?text=${mensagem}`;
        window.open(whatsappUrl, '_blank');
      }

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso! Você será redirecionado para o WhatsApp.",
      });

      // Limpar formulário
      setFormData({
        nome_completo: '',
        cpf: '',
        endereco: '',
        endereco_evento: '',
        data_evento: '',
        horario: '',
        quantidade_adultos: '',
        quantidade_criancas: '',
        telefone: '',
        observacoes: ''
      });

    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-900 py-16" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Solicite seu Orçamento
            </h2>
            <p className="text-gray-400 text-lg">
              Preencha o formulário e receba um orçamento personalizado via WhatsApp
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Dados do Evento</CardTitle>
              <CardDescription className="text-gray-400">
                Preencha todas as informações para um orçamento preciso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      name="nome_completo"
                      value={formData.nome_completo}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CPF *
                    </label>
                    <Input
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Endereço Residencial *
                  </label>
                  <Input
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Endereço do Evento *
                  </label>
                  <Input
                    name="endereco_evento"
                    value={formData.endereco_evento}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Local onde será realizado o evento"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="inline mr-2" size={16} />
                      Data do Evento *
                    </label>
                    <Input
                      type="date"
                      name="data_evento"
                      value={formData.data_evento}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Clock className="inline mr-2" size={16} />
                      Horário *
                    </label>
                    <Input
                      type="time"
                      name="horario"
                      value={formData.horario}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Users className="inline mr-2" size={16} />
                      Quantidade de Adultos *
                    </label>
                    <Input
                      type="number"
                      name="quantidade_adultos"
                      value={formData.quantidade_adultos}
                      onChange={handleChange}
                      required
                      min="1"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Número de adultos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Users className="inline mr-2" size={16} />
                      Crianças (5-9 anos)
                    </label>
                    <Input
                      type="number"
                      name="quantidade_criancas"
                      value={formData.quantidade_criancas}
                      onChange={handleChange}
                      min="0"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Número de crianças"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone *
                  </label>
                  <Input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="(43) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Observações
                  </label>
                  <Textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Informações adicionais sobre o evento"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
