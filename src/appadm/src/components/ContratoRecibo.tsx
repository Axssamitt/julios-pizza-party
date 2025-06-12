
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContratoReciboProps {
  onClose: () => void;
  onSave: () => void;
}

interface Formulario {
  id: string;
  nome_completo: string;
  data_evento: string;
  horario: string;
  endereco_evento: string;
  quantidade_adultos: number;
  quantidade_criancas: number;
}

export const ContratoRecibo = ({ onClose, onSave }: ContratoReciboProps) => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [selectedFormulario, setSelectedFormulario] = useState<string>('');
  const [tipo, setTipo] = useState<'contrato' | 'recibo'>('contrato');
  const [valorTotal, setValorTotal] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    const { data, error } = await supabase
      .from('formularios_contato')
      .select('id, nome_completo, data_evento, horario, endereco_evento, quantidade_adultos, quantidade_criancas')
      .eq('status', 'confirmado')
      .order('data_evento', { ascending: true });

    if (!error && data) {
      setFormularios(data);
    }
  };

  const handleSave = async () => {
    if (!selectedFormulario || !valorTotal) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formulario = formularios.find(f => f.id === selectedFormulario);
    
    if (!formulario) return;

    try {
      const { error } = await supabase
        .from('contratos')
        .insert({
          formulario_id: selectedFormulario,
          nome_cliente: formulario.nome_completo,
          data_evento: formulario.data_evento,
          horario: formulario.horario,
          endereco_evento: formulario.endereco_evento,
          quantidade_adultos: formulario.quantidade_adultos,
          quantidade_criancas: formulario.quantidade_criancas,
          valor_total: parseFloat(valorTotal),
          observacoes: observacoes || null,
          tipo: tipo
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${tipo === 'contrato' ? 'Contrato' : 'Recibo'} criado com sucesso!`,
      });

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-orange-400">Novo Contrato/Recibo</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Tipo</label>
              <Select value={tipo} onValueChange={(value: 'contrato' | 'recibo') => setTipo(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contrato">Contrato</SelectItem>
                  <SelectItem value="recibo">Recibo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Valor Total (R$)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Selecionar Orçamento Confirmado</label>
            <Select value={selectedFormulario} onValueChange={setSelectedFormulario}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Selecione um orçamento..." />
              </SelectTrigger>
              <SelectContent>
                {formularios.map((formulario) => (
                  <SelectItem key={formulario.id} value={formulario.id}>
                    {formulario.nome_completo} - {new Date(formulario.data_evento).toLocaleDateString('pt-BR')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFormulario && (
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-white font-semibold mb-2">Dados do Evento:</h4>
              {(() => {
                const formulario = formularios.find(f => f.id === selectedFormulario);
                return formulario ? (
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Cliente: {formulario.nome_completo}</p>
                    <p>Data: {new Date(formulario.data_evento).toLocaleDateString('pt-BR')} às {formulario.horario}</p>
                    <p>Local: {formulario.endereco_evento}</p>
                    <p>Pessoas: {formulario.quantidade_adultos} adultos, {formulario.quantidade_criancas} crianças</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm">Observações</label>
            <Textarea
              placeholder="Observações adicionais..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
