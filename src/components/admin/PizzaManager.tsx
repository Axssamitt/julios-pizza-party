
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, X, Upload, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Pizza {
  id: string;
  nome: string;
  ingredientes: string;
  imagem_url: string | null;
  ativo: boolean;
  ordem: number;
  tipo: string;
}

interface ImagemSalva {
  name: string;
  url: string;
}

export const PizzaManager = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPizza, setNewPizza] = useState({
    nome: '',
    ingredientes: '',
    imagem_url: '',
    tipo: 'salgada'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagensSalvas, setImagensSalvas] = useState<ImagemSalva[]>([]);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [editingImageField, setEditingImageField] = useState<'new' | string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPizzas();
    fetchImagensSalvas();
  }, []);

  const fetchPizzas = async () => {
    const { data, error } = await supabase
      .from('pizzas')
      .select('*')
      .order('ordem', { ascending: true });

    if (!error && data) {
      setPizzas(data);
    }
  };

  const fetchImagensSalvas = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .list('pizzas', { limit: 100 });

      if (!error && data) {
        const urls = data.map(file => ({
          name: file.name,
          url: `https://tsztjcrhlsurtfeqvinb.supabase.co/storage/v1/object/public/images/pizzas/${file.name}`
        }));
        setImagensSalvas(urls);
      }
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `pizzas/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      fetchImagensSalvas(); // Atualizar lista de imagens
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPizza.nome || !newPizza.ingredientes) return;

    const { error } = await supabase
      .from('pizzas')
      .insert([{
        ...newPizza,
        imagem_url: newPizza.imagem_url || null,
        ordem: pizzas.length
      }]);

    if (!error) {
      setNewPizza({ nome: '', ingredientes: '', imagem_url: '', tipo: 'salgada' });
      setShowAddForm(false);
      fetchPizzas();
      toast({
        title: "Sucesso",
        description: "Pizza adicionada com sucesso!",
      });
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Pizza>) => {
    const { error } = await supabase
      .from('pizzas')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchPizzas();
      toast({
        title: "Sucesso",
        description: "Pizza atualizada com sucesso!",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pizza?')) return;

    const { error } = await supabase
      .from('pizzas')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchPizzas();
      toast({
        title: "Sucesso",
        description: "Pizza removida com sucesso!",
      });
    }
  };

  const selectImage = (url: string) => {
    if (editingImageField === 'new') {
      setNewPizza({ ...newPizza, imagem_url: url });
    } else if (editingImageField) {
      // Para edição de pizza existente
      const pizza = pizzas.find(p => p.id === editingImageField);
      if (pizza) {
        handleUpdate(editingImageField, { ...pizza, imagem_url: url });
      }
    }
    setShowImageGallery(false);
    setEditingImageField(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Pizzas</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2" size={16} />
          Adicionar Pizza
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Nova Pizza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nome da pizza"
              value={newPizza.nome}
              onChange={(e) => setNewPizza({ ...newPizza, nome: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Textarea
              placeholder="Ingredientes"
              value={newPizza.ingredientes}
              onChange={(e) => setNewPizza({ ...newPizza, ingredientes: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Select value={newPizza.tipo} onValueChange={(value) => setNewPizza({ ...newPizza, tipo: value })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="salgada">Salgada</SelectItem>
                <SelectItem value="doce">Doce</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleFileUpload(file);
                      if (url) {
                        setNewPizza({ ...newPizza, imagem_url: url });
                      }
                    }
                  }}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  onClick={() => {
                    setEditingImageField('new');
                    setShowImageGallery(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Image className="mr-2" size={16} />
                  Galeria
                </Button>
              </div>
              <Input
                placeholder="Ou cole a URL da imagem"
                value={newPizza.imagem_url}
                onChange={(e) => setNewPizza({ ...newPizza, imagem_url: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            {newPizza.imagem_url && (
              <img 
                src={newPizza.imagem_url} 
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            )}
            
            <div className="flex space-x-2">
              <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2" size={16} />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-gray-600 text-gray-300"
              >
                <X className="mr-2" size={16} />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Galeria de Imagens */}
      {showImageGallery && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Selecionar Imagem</CardTitle>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowImageGallery(false);
                  setEditingImageField(null);
                }}
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto">
              {imagensSalvas.map((imagem, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => selectImage(imagem.url)}
                >
                  <img
                    src={imagem.url}
                    alt={imagem.name}
                    className="w-full h-20 object-cover rounded border-2 border-transparent hover:border-orange-500"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <Card key={pizza.id} className="bg-gray-800 border-gray-700">
            <div className="relative">
              <img 
                src={pizza.imagem_url || 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop'} 
                alt={pizza.nome}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {!pizza.ativo && (
                <div className="absolute inset-0 bg-red-600/50 flex items-center justify-center rounded-t-lg">
                  <span className="text-white font-bold">INATIVO</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {pizza.tipo === 'doce' ? 'Doce' : 'Salgada'}
              </div>
            </div>
            <CardContent className="p-4">
              {editingId === pizza.id ? (
                <EditPizzaForm 
                  pizza={pizza} 
                  onSave={(updates) => handleUpdate(pizza.id, updates)}
                  onCancel={() => setEditingId(null)}
                  onSelectImage={() => {
                    setEditingImageField(pizza.id);
                    setShowImageGallery(true);
                  }}
                  uploadHandler={handleFileUpload}
                  uploading={uploading}
                />
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{pizza.nome}</h3>
                  <p className="text-gray-400 text-sm mb-4">{pizza.ingredientes}</p>
                  <div className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingId(pizza.id)}
                      className="border-gray-600"
                    >
                      <Edit className="mr-1" size={14} />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(pizza.id)}
                    >
                      <Trash2 className="mr-1" size={14} />
                      Excluir
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EditPizzaForm = ({ 
  pizza,
  onSave,
  onCancel,
  onSelectImage,
  uploadHandler,
  uploading
}: {
  pizza: Pizza;
  onSave: (updates: Partial<Pizza>) => void;
  onCancel: () => void;
  onSelectImage: () => void;
  uploadHandler: (file: File) => Promise<string | null>;
  uploading: boolean;
}) => {
  const [formData, setFormData] = useState({
    nome: pizza.nome,
    ingredientes: pizza.ingredientes,
    imagem_url: pizza.imagem_url || '',
    ativo: pizza.ativo,
    tipo: pizza.tipo || 'salgada'
  });

  return (
    <div className="space-y-3">
      <Input
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white text-sm"
      />
      <Textarea
        value={formData.ingredientes}
        onChange={(e) => setFormData({ ...formData, ingredientes: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white text-sm"
        rows={3}
      />
      <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          <SelectItem value="salgada">Salgada</SelectItem>
          <SelectItem value="doce">Doce</SelectItem>
        </SelectContent>
      </Select>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = await uploadHandler(file);
                if (url) {
                  setFormData({ ...formData, imagem_url: url });
                }
              }
            }}
            className="bg-gray-700 border-gray-600 text-white text-sm"
            disabled={uploading}
          />
          <Button
            type="button"
            onClick={onSelectImage}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Image className="mr-1" size={12} />
            Galeria
          </Button>
        </div>
        <Input
          value={formData.imagem_url}
          onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white text-sm"
          placeholder="URL da imagem"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.ativo}
          onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
          className="rounded"
        />
        <label className="text-white text-sm">Ativo</label>
      </div>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          onClick={() => onSave(formData)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="mr-1" size={14} />
          Salvar
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-600"
        >
          <X className="mr-1" size={14} />
          Cancelar
        </Button>
      </div>
    </div>
  );
};
