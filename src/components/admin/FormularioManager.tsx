
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, Clock, MapPin, Phone, User, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FormularioContato {
  id: string;
  nome_completo: string;
  telefone: string;
  cpf: string;
  endereco: string;
  data_evento: string;
  endereco_evento: string;
  horario: string;
  quantidade_adultos: number;
  quantidade_criancas: number | null;
  valor_total: number | null;
  valor_entrada: number | null;
  observacoes: string | null;
  status: string;
  created_at: string;
}

interface FormulariosPorData {
  [data: string]: FormularioContato[];
}

export const FormularioManager = () => {
  const [formularios, setFormularios] = useState<FormularioContato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    try {
      const { data, error } = await supabase
        .from('formularios_contato')
        .select('*')
        .order('data_evento', { ascending: false });

      if (error) throw error;
      setFormularios(data || []);
    } catch (error) {
      console.error('Erro ao carregar formulários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar formulários por data do evento
  const formulariosPorData: FormulariosPorData = formularios.reduce((acc, formulario) => {
    const dataEvento = formulario.data_evento;
    if (!acc[dataEvento]) {
      acc[dataEvento] = [];
    }
    acc[dataEvento].push(formulario);
    return acc;
  }, {} as FormulariosPorData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500';
      case 'cancelado':
        return 'bg-red-500';
      case 'pendente':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Formulários de Contato</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orçamentos por Data</h2>
        <Badge variant="outline" className="text-sm">
          Total: {formularios.length} orçamentos
        </Badge>
      </div>

      {Object.keys(formulariosPorData).length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">Nenhum formulário de contato encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(formulariosPorData)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([dataEvento, formulariosDaData]) => (
            <div key={dataEvento} className="space-y-4">
              <h3 className="text-xl font-bold text-orange-400 flex items-center">
                <Calendar className="mr-2" size={20} />
                {formatDate(dataEvento)}
                <Badge variant="outline" className="ml-2">
                  {formulariosDaData.length} orçamento{formulariosDaData.length !== 1 ? 's' : ''}
                </Badge>
              </h3>
              
              <div className="grid gap-4">
                {formulariosDaData.map((formulario) => (
                  <Card key={formulario.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white flex items-center">
                          <User className="mr-2" size={20} />
                          {formulario.nome_completo}
                        </CardTitle>
                        <Badge className={getStatusColor(formulario.status)}>
                          {formulario.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        Solicitação feita em {format(parseISO(formulario.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-300">
                            <Phone className="mr-2" size={16} />
                            {formulario.telefone}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <FileText className="mr-2" size={16} />
                            CPF: {formulario.cpf}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <MapPin className="mr-2" size={16} />
                            {formulario.endereco}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-300">
                            <Clock className="mr-2" size={16} />
                            {formulario.horario}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <MapPin className="mr-2" size={16} />
                            Local: {formulario.endereco_evento}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <Users className="mr-2" size={16} />
                            {formulario.quantidade_adultos} adultos
                            {formulario.quantidade_criancas && formulario.quantidade_criancas > 0 && 
                              `, ${formulario.quantidade_criancas} crianças`
                            }
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {formulario.valor_total && (
                            <div className="text-sm text-gray-300">
                              <strong>Valor Total:</strong> {formatCurrency(formulario.valor_total)}
                            </div>
                          )}
                          {formulario.valor_entrada && (
                            <div className="text-sm text-gray-300">
                              <strong>Entrada:</strong> {formatCurrency(formulario.valor_entrada)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {formulario.observacoes && (
                        <div className="mt-4 p-3 bg-gray-900 rounded">
                          <strong className="text-white text-sm">Observações:</strong>
                          <p className="text-gray-300 text-sm mt-1">{formulario.observacoes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
