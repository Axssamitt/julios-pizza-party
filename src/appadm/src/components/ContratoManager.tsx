
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Eye, Plus } from 'lucide-react';
import { ContratoRecibo } from './ContratoRecibo';
import jsPDF from 'jspdf';

interface Contrato {
  id: string;
  formulario_id: string;
  nome_cliente: string;
  data_evento: string;
  horario: string;
  endereco_evento: string;
  quantidade_adultos: number;
  quantidade_criancas: number;
  valor_total: number;
  observacoes: string | null;
  created_at: string;
  tipo: 'contrato' | 'recibo';
}

export const ContratoManager = () => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [showContratoForm, setShowContratoForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContratos();
  }, []);

  const fetchContratos = async () => {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setContratos(data);
    }
  };

  const downloadPDF = async (contrato: Contrato) => {
    setLoading(true);
    try {
      const pdf = new jsPDF();
      
      // Título
      pdf.setFontSize(20);
      pdf.text(contrato.tipo === 'contrato' ? 'CONTRATO DE SERVIÇOS' : 'RECIBO', 20, 30);
      
      // Dados do cliente
      pdf.setFontSize(12);
      pdf.text(`Cliente: ${contrato.nome_cliente}`, 20, 50);
      pdf.text(`Data do Evento: ${new Date(contrato.data_evento).toLocaleDateString('pt-BR')}`, 20, 60);
      pdf.text(`Horário: ${contrato.horario}`, 20, 70);
      pdf.text(`Local: ${contrato.endereco_evento}`, 20, 80);
      pdf.text(`Adultos: ${contrato.quantidade_adultos}`, 20, 90);
      pdf.text(`Crianças: ${contrato.quantidade_criancas}`, 20, 100);
      pdf.text(`Valor Total: R$ ${contrato.valor_total.toFixed(2)}`, 20, 110);
      
      if (contrato.observacoes) {
        pdf.text(`Observações: ${contrato.observacoes}`, 20, 120);
      }
      
      // Salvar o PDF
      pdf.save(`${contrato.tipo}_${contrato.nome_cliente}_${contrato.id}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contratos e Recibos</h2>
        <Button 
          onClick={() => setShowContratoForm(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="mr-2" size={16} />
          Novo Contrato/Recibo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {contratos.map((contrato) => (
            <Card key={contrato.id} className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{contrato.nome_cliente}</h3>
                    <p className="text-gray-400 text-sm">
                      {contrato.tipo === 'contrato' ? 'Contrato' : 'Recibo'} - {new Date(contrato.data_evento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-orange-400 font-bold">
                    R$ {contrato.valor_total.toFixed(2)}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Horário: {contrato.horario}</p>
                  <p>Adultos: {contrato.quantidade_adultos} | Crianças: {contrato.quantidade_criancas}</p>
                  <p>Local: {contrato.endereco_evento}</p>
                </div>

                <div className="flex justify-between mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedContrato(contrato)}
                    className="border-gray-600"
                  >
                    <Eye className="mr-1" size={14} />
                    Ver Detalhes
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => downloadPDF(contrato)}
                    disabled={loading}
                  >
                    <Download className="mr-1" size={14} />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedContrato && (
          <Card className="bg-gray-800 border-gray-700 sticky top-4">
            <CardHeader>
              <CardTitle className="text-orange-400">
                {selectedContrato.tipo === 'contrato' ? 'Detalhes do Contrato' : 'Detalhes do Recibo'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Cliente</label>
                <p className="text-white">{selectedContrato.nome_cliente}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Data do Evento</label>
                  <p className="text-white">{new Date(selectedContrato.data_evento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Horário</label>
                  <p className="text-white">{selectedContrato.horario}</p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Local do Evento</label>
                <p className="text-white text-justify">{selectedContrato.endereco_evento}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Adultos</label>
                  <p className="text-white">{selectedContrato.quantidade_adultos}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Crianças</label>
                  <p className="text-white">{selectedContrato.quantidade_criancas}</p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Valor Total</label>
                <p className="text-white font-bold text-lg">R$ {selectedContrato.valor_total.toFixed(2)}</p>
              </div>
              {selectedContrato.observacoes && (
                <div>
                  <label className="text-gray-400 text-sm">Observações</label>
                  <p className="text-white text-justify">{selectedContrato.observacoes}</p>
                </div>
              )}
              <div>
                <label className="text-gray-400 text-sm">Data de Criação</label>
                <p className="text-white">{new Date(selectedContrato.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showContratoForm && (
        <ContratoRecibo 
          onClose={() => setShowContratoForm(false)}
          onSave={fetchContratos}
        />
      )}
    </div>
  );
};
