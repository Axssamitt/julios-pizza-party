
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface ContratoReciboProps {
  formulario: FormularioContato;
  onClose: () => void;
}

export const ContratoRecibo = ({ formulario, onClose }: ContratoReciboProps) => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible">
        <CardContent className="p-8">
          {/* Cabeçalho */}
          <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">JÚLIO'S PIZZA HOUSE</h1>
            <p className="text-lg text-gray-600">CNPJ: 00.000.000/0001-00</p>
            <p className="text-gray-600">Londrina - PR | (43) 99126-7766</p>
            <p className="text-gray-600">juliospizzahouse@gmail.com</p>
          </div>

          {/* Título do Documento */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 bg-gray-100 py-3 px-6 rounded">
              CONTRATO DE PRESTAÇÃO DE SERVIÇOS - RODÍZIO DE PIZZAS
            </h2>
          </div>

          {/* Dados do Cliente */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              DADOS DO CONTRATANTE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-justify">
              <div>
                <p><strong>Nome:</strong> {formulario.nome_completo}</p>
                <p><strong>CPF:</strong> {formulario.cpf}</p>
                <p><strong>Telefone:</strong> {formulario.telefone}</p>
              </div>
              <div>
                <p><strong>Endereço:</strong> {formulario.endereco}</p>
              </div>
            </div>
          </div>

          {/* Dados do Evento */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              DADOS DO EVENTO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-justify">
              <div>
                <p><strong>Data do Evento:</strong> {formatDate(formulario.data_evento)}</p>
                <p><strong>Horário:</strong> {formatTime(formulario.horario)}</p>
                <p><strong>Local:</strong> {formulario.endereco_evento}</p>
              </div>
              <div>
                <p><strong>Quantidade de Adultos:</strong> {formulario.quantidade_adultos}</p>
                <p><strong>Quantidade de Crianças:</strong> {formulario.quantidade_criancas || 0}</p>
                <p><strong>Total de Participantes:</strong> {formulario.quantidade_adultos + (formulario.quantidade_criancas || 0)}</p>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              VALORES DO SERVIÇO
            </h3>
            <div className="bg-gray-50 p-6 rounded text-justify">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Valor de Entrada:</strong> {formatCurrency(formulario.valor_entrada)}</p>
                  <p><strong>Valor Total:</strong> {formatCurrency(formulario.valor_total)}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> <span className="capitalize font-semibold">{formulario.status}</span></p>
                  <p><strong>Data do Contrato:</strong> {formatDate(formulario.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {formulario.observacoes && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                OBSERVAÇÕES
              </h3>
              <p className="bg-gray-50 p-4 rounded text-justify">{formulario.observacoes}</p>
            </div>
          )}

          {/* Termos e Condições */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              TERMOS E CONDIÇÕES
            </h3>
            <div className="text-sm text-gray-700 space-y-2 text-justify">
              <p>• O serviço inclui rodízio de pizzas salgadas e doces durante o período contratado.</p>
              <p>• O pagamento deverá ser realizado conforme acordado entre as partes.</p>
              <p>• Cancelamentos devem ser comunicados com antecedência mínima de 24 horas.</p>
              <p>• A empresa se compromete a fornecer serviço de qualidade e pontualidade.</p>
              <p>• Este contrato é válido apenas para a data e local especificados.</p>
            </div>
          </div>

          {/* Assinaturas */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-12">
                  <p className="font-bold">CONTRATANTE</p>
                  <p className="text-sm">{formulario.nome_completo}</p>
                  <p className="text-sm">CPF: {formulario.cpf}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-12">
                  <p className="font-bold">CONTRATADO</p>
                  <p className="text-sm">Júlio's Pizza House</p>
                  <p className="text-sm">CNPJ: 00.000.000/0001-00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
            <p>Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-center gap-4 mt-8 print:hidden">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              Imprimir Contrato
            </Button>
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:max-h-none {
            max-height: none !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .fixed {
            position: static !important;
          }
          .bg-black {
            background: white !important;
          }
          .bg-opacity-50 {
            background-opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
