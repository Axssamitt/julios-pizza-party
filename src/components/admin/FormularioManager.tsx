
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ContratoRecibo } from './ContratoRecibo';
import { Eye, Trash2, FileText, Receipt, Users, Calendar, Search, Filter } from 'lucide-react';
import { formatPhoneBrazil } from '@/utils/supabaseStorage';

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

interface FormularioGrouped {
  [monthYear: string]: FormularioContato[];
}

export const FormularioManager = () => {
  const [formularios, setFormularios] = useState<FormularioContato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormulario, setSelectedFormulario] = useState<FormularioContato | null>(null);
  const [documentType, setDocumentType] = useState<'recibo' | 'contrato'>('recibo');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    try {
      const { data, error } = await supabase
        .from('formularios_contato')
        .select('*')
        .order('created_at', { ascending: false });

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
      
      setFormularios(prev => 
        prev.map(form => 
          form.id === id ? { ...form, status: newStatus } : form
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const deleteFormulario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este formulário?')) return;

    try {
      const { error } = await supabase
        .from('formularios_contato')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFormularios(prev => prev.filter(form => form.id !== id));
    } catch (error) {
      console.error('Erro ao excluir formulário:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: 'Pendente', variant: 'default' as const, className: 'bg-orange-500 text-white' },
      confirmado: { label: 'Confirmado', variant: 'default' as const, className: 'bg-green-600 text-white' },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const, className: 'bg-red-600 text-white' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    return {
      pendente: formularios.filter(f => f.status === 'pendente').length,
      confirmado: formularios.filter(f => f.status === 'confirmado').length,
      cancelado: formularios.filter(f => f.status === 'cancelado').length
    };
  };

  const filterFormularios = () => {
    return formularios.filter(form => {
      const matchesSearch = !searchTerm || 
        form.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.cpf.includes(searchTerm);
      
      const matchesDate = !dateFilter || 
        form.data_evento.includes(dateFilter) ||
        new Date(form.data_evento).toLocaleDateString('pt-BR').includes(dateFilter);
      
      return matchesSearch && matchesDate;
    });
  };

  const groupFormulariosByMonth = (formularios: FormularioContato[]): FormularioGrouped => {
    return formularios.reduce((groups, form) => {
      const date = new Date(form.data_evento);
      const monthYear = date.toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      
      groups[monthYear].push(form);
      return groups;
    }, {} as FormularioGrouped);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const filteredFormularios = filterFormularios();
  const groupedFormularios = groupFormulariosByMonth(filteredFormularios);

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Formulários de Contato</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Pendente: {statusCounts.pendente}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-sm text-gray-300">Confirmado: {statusCounts.confirmado}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-sm text-gray-300">Cancelado: {statusCounts.cancelado}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de pesquisa */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Pesquisar por nome ou CPF</label>
              <Input
                placeholder="Digite o nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Filtrar por data</label>
              <Input
                placeholder="DD/MM/AAAA ou MM/AAAA"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista agrupada por mês/ano */}
      {Object.entries(groupedFormularios).map(([monthYear, forms]) => (
        <Card key={monthYear} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white capitalize flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {monthYear}
              <Badge variant="outline" className="ml-2 text-gray-300">
                {forms.length} evento(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {forms.map((formulario) => (
              <div key={formulario.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{formulario.nome_completo}</h3>
                      {getStatusBadge(formulario.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">CPF:</span>
                        <span>{formulario.cpf}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(formulario.data_evento)} às {formatTime(formulario.horario)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{formulario.quantidade_adultos} adultos, {formulario.quantidade_criancas || 0} crianças</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">📞</span>
                        <span>{formatPhoneBrazil(formulario.telefone)}</span>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                        <span className="font-medium">📍</span>
                        <span className="truncate">{formulario.endereco_evento}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateStatus(formulario.id, 'confirmado')}
                      disabled={formulario.status === 'confirmado'}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Confirmar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(formulario.id, 'cancelado')}
                      disabled={formulario.status === 'cancelado'}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      Cancelar
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFormulario(formulario);
                        setDocumentType('recibo');
                      }}
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      Recibo
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFormulario(formulario);
                        setDocumentType('contrato');
                      }}
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Contrato
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteFormulario(formulario.id)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {filteredFormularios.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <p className="text-gray-400">Nenhum formulário encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}

      {selectedFormulario && (
        <ContratoRecibo
          formulario={selectedFormulario}
          tipo={documentType}
          onClose={() => setSelectedFormulario(null)}
        />
      )}
    </div>
  );
};
