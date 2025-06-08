
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Edit, Trash2, Calendar, Clock, Users, Phone, MapPin, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Formulario {
  id: string;
  nome_completo: string;
  cpf: string;
  endereco: string;
  endereco_evento: string;
  data_evento: string;
  horario: string;
  quantidade_adultos: number;
  quantidade_criancas: number;
  telefone: string;
  observacoes: string | null;
  status: string;
  created_at: string;
}

interface FormulariosPorMes {
  [key: string]: Formulario[];
}

export const FormularioManager = () => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [formulariosPorMes, setFormulariosPorMes] = useState<FormulariosPorMes>({});
  const [selectedFormulario, setSelectedFormulario] = useState<Formulario | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Formulario>>({});
  const [mesesExpandidos, setMesesExpandidos] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchFormularios();
  }, []);

  useEffect(() => {
    agruparPorMes();
  }, [formularios]);

  const fetchFormularios = async () => {
    const { data, error } = await supabase
      .from('formularios_contato')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFormularios(data);
    }
  };

  const agruparPorMes = () => {
    const grupos: FormulariosPorMes = {};
    
    formularios.forEach(formulario => {
      const data = new Date(formulario.created_at);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      const nomeGrupo = data.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
      
      if (!grupos[nomeGrupo]) {
        grupos[nomeGrupo] = [];
      }
      grupos[nomeGrupo].push(formulario);
    });

    setFormulariosPorMes(grupos);
    
    // Expandir o mês atual por padrão
    const mesAtual = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    setMesesExpandidos(prev => ({ ...prev, [mesAtual]: true }));
  };

  const toggleMes = (mes: string) => {
    setMesesExpandidos(prev => ({
      ...prev,
      [mes]: !prev[mes]
    }));
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('formularios_contato')
      .update({ status })
      .eq('id', id);

    if (!error) {
      fetchFormularios();
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });
    }
  };

  const handleEdit = (formulario: Formulario) => {
    setEditingId(formulario.id);
    setEditData(formulario);
  };

  const handleUpdate = async () => {
    if (!editingId || !editData) return;

    try {
      const { error } = await supabase
        .from('formularios_contato')
        .update(editData)
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Formulário atualizado com sucesso!",
      });
      
      setEditingId(null);
      setEditData({});
      fetchFormularios();
    } catch (error) {
      console.error('Erro ao atualizar formulário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o formulário.",
        variant: "destructive",
      });
    }
  };

  const deleteFormulario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este formulário?')) return;

    const { error } = await supabase
      .from('formularios_contato')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchFormularios();
      setSelectedFormulario(null);
      toast({
        title: "Sucesso",
        description: "Formulário excluído com sucesso!",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-600';
      case 'confirmado': return 'bg-green-600';
      case 'cancelado': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const contarPorStatus = (formularios: Formulario[]) => {
    return {
      pendente: formularios.filter(f => f.status === 'pendente').length,
      confirmado: formularios.filter(f => f.status === 'confirmado').length,
      cancelado: formularios.filter(f => f.status === 'cancelado').length
    };
  };

  const statusGeral = contarPorStatus(formularios);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Formulários de Contato</h2>
        <div className="flex space-x-2">
          <Badge className="bg-yellow-600">Pendente: {statusGeral.pendente}</Badge>
          <Badge className="bg-green-600">Confirmado: {statusGeral.confirmado}</Badge>
          <Badge className="bg-red-600">Cancelado: {statusGeral.cancelado}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {Object.entries(formulariosPorMes).map(([mes, formulariosMes]) => {
            const statusMes = contarPorStatus(formulariosMes);
            return (
              <Card key={mes} className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-700/50 transition-colors"
                  onClick={() => toggleMes(mes)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-orange-400 capitalize">{mes}</CardTitle>
                      <div className="flex space-x-2 mt-2">
                        <Badge className="bg-yellow-600 text-xs">P: {statusMes.pendente}</Badge>
                        <Badge className="bg-green-600 text-xs">C: {statusMes.confirmado}</Badge>
                        <Badge className="bg-red-600 text-xs">X: {statusMes.cancelado}</Badge>
                      </div>
                    </div>
                    {mesesExpandidos[mes] ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </CardHeader>
                
                {mesesExpandidos[mes] && (
                  <CardContent className="space-y-4 pt-0">
                    {formulariosMes.map((formulario) => (
                      <Card key={formulario.id} className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          {editingId === formulario.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                  value={editData.nome_completo || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, nome_completo: e.target.value }))}
                                  placeholder="Nome completo"
                                  className="bg-gray-600/50 border-gray-500 text-white"
                                />
                                <Input
                                  value={editData.cpf || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, cpf: e.target.value }))}
                                  placeholder="CPF"
                                  className="bg-gray-600/50 border-gray-500 text-white"
                                />
                              </div>
                              <Input
                                value={editData.endereco || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, endereco: e.target.value }))}
                                placeholder="Endereço"
                                className="bg-gray-600/50 border-gray-500 text-white"
                              />
                              <Input
                                value={editData.endereco_evento || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, endereco_evento: e.target.value }))}
                                placeholder="Endereço do evento"
                                className="bg-gray-600/50 border-gray-500 text-white"
                              />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Input
                                  type="date"
                                  value={editData.data_evento || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, data_evento: e.target.value }))}
                                  className="bg-gray-600/50 border-gray-500 text-white"
                                />
                                <Input
                                  type="time"
                                  value={editData.horario || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, horario: e.target.value }))}
                                  className="bg-gray-600/50 border-gray-500 text-white"
                                />
                                <Input
                                  value={editData.telefone || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, telefone: e.target.value }))}
                                  placeholder="Telefone"
                                  className="bg-gray-600/50 border-gray-500 text-white"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                  type="number"
                                  value={editData.quantidade_adultos || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, quantidade_adultos: parseInt(e.target.value) }))}
                                  placeholder="Adultos"
                                  className="bg-gray-600/50 border-gray-500 text-white"
                                />
                                <Input
                                  type="number"
                                  value={editData.quantidade_criancas || ''}
                                  onChange={(e) => setEditData(prev => ({ ...prev, quantidade_criancas: parseInt(e.target.value) }))}
                                  placeholder="Crianças"
                                  className="bg-gray-600/50 border-gray-500 text-white"
                                />
                              </div>
                              <Textarea
                                value={editData.observacoes || ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, observacoes: e.target.value }))}
                                placeholder="Observações"
                                className="bg-gray-600/50 border-gray-500 text-white"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={handleUpdate}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="mr-1" size={14} />
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                  className="border-gray-600"
                                >
                                  <X className="mr-1" size={14} />
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-white">{formulario.nome_completo}</h3>
                                  <p className="text-gray-400 text-sm">CPF: {formulario.cpf}</p>
                                </div>
                                <Badge className={getStatusColor(formulario.status)}>
                                  {formulario.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-300">
                                  <Calendar className="mr-2" size={14} />
                                  {formatDate(formulario.data_evento)} às {formatTime(formulario.horario)}
                                </div>
                                <div className="flex items-center text-gray-300">
                                  <Users className="mr-2" size={14} />
                                  {formulario.quantidade_adultos} adultos, {formulario.quantidade_criancas} crianças
                                </div>
                                <div className="flex items-center text-gray-300">
                                  <Phone className="mr-2" size={14} />
                                  {formulario.telefone}
                                </div>
                                <div className="flex items-center text-gray-300">
                                  <MapPin className="mr-2" size={14} />
                                  {formulario.endereco_evento}
                                </div>
                              </div>

                              <div className="flex justify-between mt-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateStatus(formulario.id, 'confirmado')}
                                    className="border-green-600 text-green-400 hover:bg-green-600"
                                    disabled={formulario.status === 'confirmado'}
                                  >
                                    Confirmar
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateStatus(formulario.id, 'cancelado')}
                                    className="border-red-600 text-red-400 hover:bg-red-600"
                                    disabled={formulario.status === 'cancelado'}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedFormulario(formulario)}
                                    className="border-gray-600"
                                  >
                                    <Eye className="mr-1" size={14} />
                                    Ver
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEdit(formulario)}
                                    className="border-blue-600 text-blue-400 hover:bg-blue-600"
                                  >
                                    <Edit className="mr-1" size={14} />
                                    Editar
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => deleteFormulario(formulario.id)}
                                  >
                                    <Trash2 className="mr-1" size={14} />
                                    Excluir
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {selectedFormulario && (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 sticky top-4">
            <CardHeader>
              <CardTitle className="text-orange-400">Detalhes do Formulário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Nome Completo</label>
                <p className="text-white">{selectedFormulario.nome_completo}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">CPF</label>
                <p className="text-white">{selectedFormulario.cpf}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Endereço Residencial</label>
                <p className="text-white">{selectedFormulario.endereco}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Endereço do Evento</label>
                <p className="text-white">{selectedFormulario.endereco_evento}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Data do Evento</label>
                  <p className="text-white">{formatDate(selectedFormulario.data_evento)}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Horário</label>
                  <p className="text-white">{formatTime(selectedFormulario.horario)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Adultos</label>
                  <p className="text-white">{selectedFormulario.quantidade_adultos}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Crianças (5-9 anos)</label>
                  <p className="text-white">{selectedFormulario.quantidade_criancas}</p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Telefone</label>
                <p className="text-white">{selectedFormulario.telefone}</p>
              </div>
              {selectedFormulario.observacoes && (
                <div>
                  <label className="text-gray-400 text-sm">Observações</label>
                  <p className="text-white">{selectedFormulario.observacoes}</p>
                </div>
              )}
              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <p className="text-white">
                  <Badge className={getStatusColor(selectedFormulario.status)}>
                    {selectedFormulario.status}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Data de Criação</label>
                <p className="text-white">{formatDate(selectedFormulario.created_at)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
