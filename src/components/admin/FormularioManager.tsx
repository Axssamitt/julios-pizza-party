
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Calendar, User, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { ContratoRecibo } from './ContratoRecibo';

interface FormularioContato {
  id: string;
  nome_completo: string;
  cpf: string;
  telefone: string;
  endereco: string;
  endereco_evento: string;
  data_evento: string;
  horario: string;
  quantidade_adultos: number;
  quantidade_criancas: number | null;
  valor_entrada: number | null;
  valor_total: number | null;
  observacoes: string | null;
  status: string;
  created_at: string;
}

export const FormularioManager = () => {
  const [formularios, setFormularios] = useState<FormularioContato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormulario, setSelectedFormulario] = useState<FormularioContato | null>(null);
  const [showRecibo, setShowRecibo] = useState(false);

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    try {
      const { data, error } = await supabase
        .from('formularios_contato')
        .select('*')
        .order('data_evento', { ascending: true });

      if (error) throw error;
      setFormularios(data || []);
    } catch (error) {
      console.error('Erro ao carregar formulários:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('formularios_contato')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchFormularios();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500';
      case 'confirmado': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      case 'concluido': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Agrupar por data do evento
  const formulariosAgrupados = formularios.reduce((acc, formulario) => {
    // Adicionar 'T00:00:00' para evitar problemas de fuso horário ao criar o objeto Date
    const date = new Date(formulario.data_evento + 'T00:00:00');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const groupKey = `${month}/${year}`;

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(formulario);
    return acc;
  }, {} as Record<string, FormularioContato[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Formulários de Contato</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Formulários de Contato</h2>
        <div className="text-sm text-gray-400">
          Total: {formularios.length} formulários
        </div>
      </div>

      {Object.keys(formulariosAgrupados).length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum formulário encontrado</h3>
            <p className="text-gray-400">Os formulários de contato aparecerão aqui quando forem enviados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(formulariosAgrupados)
            .sort(([keyA], [keyB]) => {
              const [monthA, yearA] = keyA.split('/').map(Number);
              const [monthB, yearB] = keyB.split('/').map(Number);
              const dateA = new Date(yearA, monthA - 1); // Mês é 0-indexado no construtor Date
              const dateB = new Date(yearB, monthB - 1);
              return dateA.getTime() - dateB.getTime();
            })
            .map(([groupKey, formulariosDoMes]) => (
              <div key={groupKey} className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  <h3 className="text-xl font-semibold">
                    Eventos em {groupKey}
                  </h3>
                  <Badge variant="secondary" className="ml-2">
                    {formulariosDoMes.length} evento(s)
                  </Badge>
                </div>
                
                <div className="grid gap-4">
                  {formulariosDoMes.map((formulario) => (
                    <Card key={formulario.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-orange-400" />
                            <div>
                              <CardTitle className="text-white">{formulario.nome_completo}</CardTitle>
                              <p className="text-gray-400 text-sm">CPF: {formulario.cpf}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(formulario.status)} text-white`}>
                            {formulario.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="h-4 w-4 text-orange-400" />
                            <span>{formatTime(formulario.horario)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="h-4 w-4 text-orange-400" />
                            <span className="truncate">{formulario.endereco_evento}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-300">
                            <Users className="h-4 w-4 text-orange-400" />
                            <span>{formulario.quantidade_adultos} adultos, {formulario.quantidade_criancas || 0} crianças</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="h-4 w-4 text-orange-400" />
                            <span>Entrada: {formatCurrency(formulario.valor_entrada)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="h-4 w-4 text-orange-400" />
                            <span>Total: {formatCurrency(formulario.valor_total)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-300">
                            <span className="text-xs">ID: {formulario.id.slice(0, 8)}...</span>
                          </div>
                        </div>

                        {formulario.observacoes && (
                          <div className="bg-gray-700 p-3 rounded">
                            <p className="text-gray-300 text-sm">
                              <strong>Observações:</strong> {formulario.observacoes}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => {
                              setSelectedFormulario(formulario);
                              setShowRecibo(true);
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Ver Contrato
                          </Button>
                          
                          <select
                            value={formulario.status}
                            onChange={(e) => updateStatus(formulario.id, e.target.value)}
                            className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 text-sm"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="cancelado">Cancelado</option>
                            <option value="concluido">Concluído</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {showRecibo && selectedFormulario && (
        <ContratoRecibo
          formulario={selectedFormulario}
          onClose={() => {
            setShowRecibo(false);
            setSelectedFormulario(null);
          }}
        />
      )}
    </div>
  );
};
