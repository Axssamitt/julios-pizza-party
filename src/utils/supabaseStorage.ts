
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
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

export const numberToWordsBrazilian = (num: number): string => {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (num === 0) return 'zero reais';
  if (num === 100) return 'cem reais';

  const inteiro = Math.floor(num);
  const centavos = Math.round((num - inteiro) * 100);

  let resultado = '';

  if (inteiro >= 1000) {
    const milhares = Math.floor(inteiro / 1000);
    if (milhares === 1) {
      resultado += 'mil';
    } else {
      resultado += convertirCentenas(milhares) + ' mil';
    }
    
    const resto = inteiro % 1000;
    if (resto > 0) {
      resultado += ' e ' + convertirCentenas(resto);
    }
  } else {
    resultado = convertirCentenas(inteiro);
  }

  resultado += inteiro === 1 ? ' real' : ' reais';

  if (centavos > 0) {
    resultado += ' e ' + convertirCentenas(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
  }

  return resultado;

  function convertirCentenas(n: number): string {
    if (n === 0) return '';
    
    let texto = '';
    
    if (n >= 100) {
      const c = Math.floor(n / 100);
      texto += centenas[c];
      n %= 100;
      if (n > 0) texto += ' e ';
    }
    
    if (n >= 20) {
      const d = Math.floor(n / 10);
      texto += dezenas[d];
      n %= 10;
      if (n > 0) texto += ' e ';
    } else if (n >= 10) {
      texto += especiais[n - 10];
      n = 0;
    }
    
    if (n > 0) {
      texto += unidades[n];
    }
    
    return texto;
  }
};
