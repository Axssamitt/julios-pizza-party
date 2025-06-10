
import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
  try {
    console.log('Iniciando upload da imagem...', file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erro no upload:', error);
      throw error;
    }

    console.log('Upload realizado com sucesso:', data);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    console.log('URL pública gerada:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return null;
  }
};

export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from('images')
      .remove([fileName]);

    if (error) {
      console.error('Erro ao deletar imagem:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return false;
  }
};

export const formatPhoneBrazil = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formata o telefone brasileiro
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
};

export const numberToWordsBrazilian = (num: number): string => {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const centenas = ['', 'cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (num === 0) return 'zero';
  if (num === 100) return 'cem';

  let resultado = '';
  const inteiro = Math.floor(num);
  const decimal = Math.round((num - inteiro) * 100);

  // Processar parte inteira
  if (inteiro >= 1000) {
    const milhar = Math.floor(inteiro / 1000);
    if (milhar === 1) {
      resultado += 'mil';
    } else {
      resultado += numberToWordsBrazilian(milhar) + ' mil';
    }
    
    const resto = inteiro % 1000;
    if (resto > 0) {
      resultado += ' e ' + numberToWordsBrazilian(resto);
    }
  } else {
    // Centenas
    const c = Math.floor(inteiro / 100);
    const d = Math.floor((inteiro % 100) / 10);
    const u = inteiro % 10;

    if (c > 0) {
      if (inteiro === 100) {
        resultado += 'cem';
      } else {
        resultado += centenas[c];
        if (d > 0 || u > 0) resultado += ' e ';
      }
    }

    // Dezenas e unidades
    if (d === 1 && u > 0) {
      resultado += especiais[u];
    } else {
      if (d > 0) {
        resultado += dezenas[d];
        if (u > 0) resultado += ' e ';
      }
      if (u > 0) {
        resultado += unidades[u];
      }
    }
  }

  // Adicionar "reais"
  if (inteiro === 1) {
    resultado += ' real';
  } else if (inteiro > 1) {
    resultado += ' reais';
  }

  // Processar centavos
  if (decimal > 0) {
    resultado += ' e ';
    if (decimal < 10) {
      resultado += unidades[decimal] + ' centavo';
      if (decimal > 1) resultado += 's';
    } else if (decimal < 20) {
      resultado += especiais[decimal - 10] + ' centavos';
    } else {
      const dCent = Math.floor(decimal / 10);
      const uCent = decimal % 10;
      resultado += dezenas[dCent];
      if (uCent > 0) {
        resultado += ' e ' + unidades[uCent];
      }
      resultado += ' centavos';
    }
  }

  return resultado;
};
