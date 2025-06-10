
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
