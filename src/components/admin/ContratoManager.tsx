
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download } from 'lucide-react';

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

interface Config {
  chave: string;
  valor: string;
}

export const ContratoManager = () => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [selectedFormulario, setSelectedFormulario] = useState<Formulario | null>(null);
  const [contratoGerado, setContratoGerado] = useState<string>('');
  const [reciboGerado, setReciboGerado] = useState<string>('');
  const [configs, setConfigs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFormularios();
    fetchConfigs();
  }, []);

  const fetchFormularios = async () => {
    const { data, error } = await supabase
      .from('formularios_contato')
      .select('*')
      .eq('status', 'confirmado')
      .order('data_evento', { ascending: true });

    if (!error && data) {
      setFormularios(data);
    }
  };

  const fetchConfigs = async () => {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('chave, valor')
      .eq('ativo', true);

    if (!error && data) {
      const configMap = data.reduce((acc: Record<string, string>, config: Config) => {
        acc[config.chave] = config.valor;
        return acc;
      }, {});
      setConfigs(configMap);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const calcularValorTotal = (adultos: number, criancas: number) => {
    const valorAdulto = parseFloat(configs.valor_adulto || '55.00');
    const valorCrianca = parseFloat(configs.valor_crianca || '27.00');
    return (adultos * valorAdulto) + (criancas * valorCrianca);
  };

  const calcularEntrada = (valorTotal: number) => {
    const percentualEntrada = parseFloat(configs.percentual_entrada || '40') / 100;
    return valorTotal * percentualEntrada;
  };

  const gerarContrato = (formulario: Formulario) => {
    const valorTotal = calcularValorTotal(formulario.quantidade_adultos, formulario.quantidade_criancas);
    const entrada = calcularEntrada(valorTotal);
    const restante = valorTotal - entrada;
    const valorAdulto = parseFloat(configs.valor_adulto || '55.00');
    const valorCrianca = parseFloat(configs.valor_crianca || '27.00');
    const percentualEntrada = parseFloat(configs.percentual_entrada || '40');
    
    const contrato = `══════════════════════════════════════════════════════════
                     JULIO'S PIZZA HOUSE
                    CONTRATO DE PRESTAÇÃO DE SERVIÇOS
══════════════════════════════════════════════════════════

CONTRATANTE: ${formulario.nome_completo.toUpperCase()}
CPF: ${formulario.cpf}
Endereço: ${formulario.endereco.toUpperCase()}

CONTRATADA: JULIO'S PIZZA HOUSE
Endereço: Rua Alzira Postali Gewrher, nº 119
Bairro: Jardim Catuai, CEP: 86086-230
Londrina - Paraná
CPF: 034.988.389-03
Responsável: Sr. Júlio Cesar Fermino

──────────────────────────────────────────────────────────

OBJETO DO CONTRATO

O presente contrato tem por objeto a prestação de serviços 
de rodízio de pizza para evento que se realizará em:

Data: ${formatDate(formulario.data_evento)}
Horário: ${formatTime(formulario.horario)} às ${String(parseInt(formulario.horario.split(':')[0]) + 3).padStart(2, '0')}:${formulario.horario.split(':')[1]}
Local: ${formulario.endereco_evento.toUpperCase()}

──────────────────────────────────────────────────────────

DETALHES DO EVENTO

Número de pessoas confirmadas:
• Adultos: ${formulario.quantidade_adultos} pessoas
• Crianças (5-9 anos): ${formulario.quantidade_criancas} pessoas
• Total: ${formulario.quantidade_adultos + formulario.quantidade_criancas} pessoas

──────────────────────────────────────────────────────────

OBRIGAÇÕES DA CONTRATANTE

A CONTRATANTE deverá:
• Fornecer todas as informações necessárias
• Efetuar o pagamento conforme estabelecido
• Disponibilizar local ventilado e tomada 220V

──────────────────────────────────────────────────────────

OBRIGAÇÕES DA CONTRATADA

A CONTRATADA se compromete a:
• Fornecer rodízio de pizza de alta qualidade
• Disponibilizar pelo menos 1 pizzaiolo e 1 garçom
• Manter funcionários uniformizados
• Preparar quantidade suficiente para até 10% a mais

OBSERVAÇÃO: Excedente de horário será cobrado 
R$ 300,00 a cada meia hora ultrapassada.

──────────────────────────────────────────────────────────

VALORES E FORMA DE PAGAMENTO

Valor por pessoa:
• Adultos: R$ ${valorAdulto.toFixed(2).replace('.', ',')} cada
• Crianças: R$ ${valorCrianca.toFixed(2).replace('.', ',')} cada

VALOR TOTAL DO SERVIÇO: R$ ${valorTotal.toFixed(2).replace('.', ',')}

Forma de pagamento:
• Entrada (${percentualEntrada}%): R$ ${entrada.toFixed(2).replace('.', ',')}
  (Depositar na Caixa Econômica - Ag: 1479 - Conta: 00028090-5)
• Restante: R$ ${restante.toFixed(2).replace('.', ',')}
  (A ser pago no dia do evento em dinheiro)

──────────────────────────────────────────────────────────

CANCELAMENTO

O contrato pode ser rescindido por qualquer parte com 
comunicação formal até 10 dias antes do evento, com 
devolução da entrada. Cancelamento após pagamento da 
entrada: valor será creditado para futura contratação 
em até 30 dias.

──────────────────────────────────────────────────────────

LONDRINA, ${new Date().toLocaleDateString('pt-BR')}


_________________________________    _________________________________
        CONTRATANTE                           CONTRATADA
    ${formulario.nome_completo}              Júlio Cesar Fermino
      CPF: ${formulario.cpf}                 CPF: 034.988.389-03

══════════════════════════════════════════════════════════`;

    setContratoGerado(contrato);
  };

  const gerarRecibo = (formulario: Formulario) => {
    const valorTotal = calcularValorTotal(formulario.quantidade_adultos, formulario.quantidade_criancas);
    const entrada = calcularEntrada(valorTotal);
    const percentualEntrada = parseFloat(configs.percentual_entrada || '40');
    
    const recibo = `══════════════════════════════════════════════════════════
                     JULIO'S PIZZA HOUSE
                        RECIBO DE ENTRADA
══════════════════════════════════════════════════════════

RECIBO Nº: ${formulario.id.substring(0, 8).toUpperCase()}

Recebemos de: ${formulario.nome_completo}
CPF: ${formulario.cpf}
Endereço: ${formulario.endereco}

A importância de: R$ ${entrada.toFixed(2).replace('.', ',')}
(${numberToWords(entrada)} reais)

──────────────────────────────────────────────────────────

REFERENTE A:
Entrada para contratação de serviço de rodízio de pizza

DETALHES DO EVENTO:
• Data: ${formatDate(formulario.data_evento)}
• Horário: ${formatTime(formulario.horario)}
• Local: ${formulario.endereco_evento}
• Pessoas: ${formulario.quantidade_adultos} adultos${formulario.quantidade_criancas > 0 ? ` e ${formulario.quantidade_criancas} crianças` : ''}

──────────────────────────────────────────────────────────

RESUMO FINANCEIRO:
• Valor total do serviço: R$ ${valorTotal.toFixed(2).replace('.', ',')}
• Entrada (${percentualEntrada}%): R$ ${entrada.toFixed(2).replace('.', ',')}
• Saldo restante: R$ ${(valorTotal - entrada).toFixed(2).replace('.', ',')}
  (a ser pago no dia do evento)

──────────────────────────────────────────────────────────

Data de emissão: ${new Date().toLocaleDateString('pt-BR')}

_________________________________
Júlio Cesar Fermino
CPF: 034.988.389-03
Júlio's Pizza House

══════════════════════════════════════════════════════════`;

    setReciboGerado(recibo);
  };

  const numberToWords = (num: number): string => {
    const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
    
    const intPart = Math.floor(num);
    
    if (intPart === 0) return 'zero';
    if (intPart === 100) return 'cem';
    
    let result = '';
    
    if (intPart >= 100) {
      result += hundreds[Math.floor(intPart / 100)];
      if (intPart % 100 !== 0) result += ' e ';
    }
    
    const remainder = intPart % 100;
    if (remainder >= 20) {
      result += tens[Math.floor(remainder / 10)];
      if (remainder % 10 !== 0) result += ' e ' + units[remainder % 10];
    } else if (remainder >= 10) {
      result += teens[remainder - 10];
    } else if (remainder > 0) {
      result += units[remainder];
    }
    
    return result;
  };

  const downloadDocument = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Geração de Contratos e Recibos</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-400">Eventos Confirmados</h3>
          {formularios.map((formulario) => (
            <Card key={formulario.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{formulario.nome_completo}</h4>
                    <p className="text-gray-400 text-sm">Data: {formatDate(formulario.data_evento)} às {formatTime(formulario.horario)}</p>
                    <p className="text-gray-400 text-sm">
                      {formulario.quantidade_adultos} adultos, {formulario.quantidade_criancas} crianças
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold">
                      R$ {calcularValorTotal(formulario.quantidade_adultos, formulario.quantidade_criancas).toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-gray-400 text-sm">Total</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedFormulario(formulario);
                      gerarContrato(formulario);
                      setReciboGerado('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="mr-1" size={14} />
                    Gerar Contrato
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedFormulario(formulario);
                      gerarRecibo(formulario);
                      setContratoGerado('');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FileText className="mr-1" size={14} />
                    Gerar Recibo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(contratoGerado || reciboGerado) && (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 sticky top-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-orange-400">
                  {contratoGerado ? 'Contrato Gerado' : 'Recibo Gerado'}
                </CardTitle>
                <Button 
                  size="sm"
                  onClick={() => downloadDocument(
                    contratoGerado || reciboGerado,
                    `${contratoGerado ? 'contrato' : 'recibo'}_${selectedFormulario?.nome_completo.replace(/\s+/g, '_')}.txt`
                  )}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Download className="mr-1" size={14} />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-4 rounded text-xs whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                {contratoGerado || reciboGerado}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
