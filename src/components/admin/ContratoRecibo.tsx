
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
  tipo?: 'recibo' | 'contrato';
}

export const ContratoRecibo = ({ formulario, onClose, tipo = 'recibo' }: ContratoReciboProps) => {
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

  if (tipo === 'recibo') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="bg-white max-w-md w-full print:max-h-none print:overflow-visible">
          <CardContent className="p-0">
            {/* Recibo no formato da imagem */}
            <div className="border-2 border-black rounded-lg p-6 bg-white text-black">
              <div className="text-center mb-4">
                <div className="border border-black inline-block px-4 py-1 mb-2">
                  <span className="font-bold text-lg">RECIBO</span>
                  <span className="ml-4">Nº</span>
                  <span className="ml-8">51 VALOR</span>
                  <span className="ml-8 font-bold">{formatCurrency(formulario.valor_entrada)}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex">
                  <span className="w-20">RECEBI(EMOS) DE</span>
                  <div className="flex-1 border-b border-black ml-2">{formulario.nome_completo}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex">
                  <span className="w-20">A QUANTIA DE</span>
                  <div className="flex-1 border-b border-black ml-2">{formatCurrency(formulario.valor_entrada)}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex">
                  <span className="w-20">CORRESPONDENTE A</span>
                  <div className="flex-1 border-b border-black ml-2">ENTRADA DO EVENTO A SER REALIZADO NA DATA DE {formatDate(formulario.data_evento)}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex">
                  <span className="w-20">E PARA CLAREZA FIRMO(AMOS) O PRESENTE</span>
                  <div className="flex-1 border-b border-black ml-2"></div>
                </div>
              </div>

              <div className="text-right mb-6">
                <div>LONDRINA, {new Date().toLocaleDateString('pt-BR')}</div>
              </div>

              <div className="text-center mb-4">
                <div className="font-bold text-xl">JULIO'S PIZZA HOUSE</div>
              </div>

              <div className="text-center">
                <div className="border-t border-black pt-2 mt-8 inline-block px-16">
                  Assinatura
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-center gap-4 mt-4 p-4 print:hidden">
              <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                Imprimir Recibo
              </Button>
              <Button onClick={onClose} variant="outline">
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>

        <style jsx global>{`
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
  }

  // Contrato conforme imagem anexa
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold mb-2">CONTRATO</h1>
            <h2 className="text-lg font-bold">JULIO'S PIZZA HOUSE</h2>
          </div>

          <div className="mb-4">
            <p><strong>CONTRATANTE:</strong> {formulario.nome_completo.toUpperCase()}, CPF nº {formulario.cpf}, residente e domiciliado à {formulario.endereco}.</p>
          </div>

          <div className="mb-4">
            <p><strong>CONTRATADA:</strong> JULIO'S PIZZA HOUSE, com sede em Londrina, na Rua Alzira Postali Gewrher, nº 119, Bairro Jardim Catuai, CEP: 86086-230, Londrina - Paraná, inscrita no CPF sob o nº 034.988.389-03, neste ato representada por Júlio Cesar Fermino.</p>
          </div>

          <div className="mb-4">
            <p>As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Buffet, que se regerá pelas cláusulas seguintes e pelas condições de preço, forma e termo de pagamento descritas no presente.</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold">DO OBJETO DO CONTRATO</h3>
            <p><strong>Cláusula 1ª:</strong> O objeto do presente contrato é a prestação pela CONTRATADA à CONTRATANTE do serviço de rodízio de pizza para evento que se realizará no endereço {formulario.endereco_evento}, conforme as especificações seguintes: Data: {formatDate(formulario.data_evento)}, horário: {formatTime(formulario.horario)}, total de convidados {formulario.quantidade_adultos + (formulario.quantidade_criancas || 0)} pessoas.</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold">O EVENTO</h3>
            <p><strong>Cláusula 2ª:</strong> O evento para qual se realizará no contratação do serviço de Rodízio de Pizza, é o evento de confraternização marcado para {formatDate(formulario.data_evento)} às {formatTime(formulario.horario)}, com {formulario.quantidade_adultos} adultos e {formulario.quantidade_criancas || 0} crianças (5 a 9 anos), totalizando {formulario.quantidade_adultos + (formulario.quantidade_criancas || 0)} pessoas. Endereço: {formulario.endereco_evento}. O evento realizado será no horário e local indicado na cláusula 1ª, devendo o horário ser respeitado pela CONTRATANTE, sob pena de cancelamento do presente contrato.</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold">OBRIGAÇÕES DA CONTRATANTE</h3>
            <p><strong>Cláusula 3ª:</strong> A CONTRATANTE deverá fornecer à CONTRATADA todas as informações necessárias à realização adequada do serviço de rodízio de pizza, devendo especificar os detalhes do evento. Necessário que o local seja ventilado e que tenha tomada 220V para funcionamento do equipamento de pizzas.</p>
            <p><strong>Cláusula 4ª:</strong> A CONTRATANTE deverá efetuar o pagamento na forma e condições estabelecidas na cláusula 5ª.</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold">OBRIGAÇÕES DA CONTRATADA</h3>
            <p><strong>Cláusula 5ª:</strong> É dever da CONTRATADA executar um serviço de rodízio pizza de acordo com as especificações previamente combinadas entre as partes, qualidade alimentar e garantir que será prestado um serviço conforme os padrões da CONTRATADA. A CONTRATADA será obrigada a fornecer no mínimo 01 pizzaiolo e 01 garçom para servir os convidados da festa.</p>
            <p><strong>Obs.:</strong> O excedente de horário será cobrado 30000 (trinta mil) reais a cada meia hora ultrapassada.</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold">VALORES E FORMA DE PAGAMENTO</h3>
            <p><strong>Cláusula 6ª:</strong> A CONTRATADA obterá um serviço de rodízio pizza de acordo com as especificações oferecidas, sendo estabelecido o preço total de {formatCurrency(formulario.valor_total)} para o presente contrato. Sendo pago 40% de entrada no valor de {formatCurrency(formulario.valor_entrada)} e o restante no valor de {formatCurrency((formulario.valor_total || 0) - (formulario.valor_entrada || 0))} no dia do evento.</p>
            <p><strong>Cláusula 7ª:</strong> A CONTRATADA compromete-se a executar o cardápio conforme nas CONTRATANTE, cujas especificações incluem: 01 fornelho a ser servido, proporcionalmente em documento anexo ao presente</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold">CANCELAMENTO</h3>
            <p><strong>Cláusula 8ª:</strong> A CONTRATADA fornecerá pelo menos 1 pizzaiolo e 1 garçom para servir os convidados da mesa.</p>
          </div>

          <div className="text-center">
            <p>Página 1</p>
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

      <style jsx global>{`
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
