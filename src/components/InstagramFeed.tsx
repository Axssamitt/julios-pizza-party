import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Heart, MessageCircle, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface InstagramPost {
  id: string;
  titulo: string;
  descricao?: string;
  url_imagem: string;
  url_post?: string;
  curtidas?: number;
  comentarios?: number;
  ativo: boolean;
  created_at: string;
}

export const InstagramFeed = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts do Instagram:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const handlePostClick = (post: InstagramPost) => {
    if (post.url_post) {
      window.open(post.url_post, '_blank');
    }
  };

  return (
    <section id="instagram" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Instagram className="text-pink-500 mr-4" size={40} />
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                @juliospizzahouse
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Acompanhe nosso dia a dia e descubra as novidades mais saborosas do nosso Instagram!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 animate-pulse">
                <div className="w-full h-64 bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.url_imagem} 
                    alt={post.titulo}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-pink-500 text-white">
                      <Instagram size={12} className="mr-1" />
                      Post
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-4 text-white">
                      <div className="flex items-center">
                        <Heart size={20} className="mr-1" />
                        <span className="text-sm">{post.curtidas || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={20} className="mr-1" />
                        <span className="text-sm">{post.comentarios || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-white font-medium mb-2">{post.titulo}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {post.descricao}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {formatDate(post.created_at)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-pink-400 transition-colors">
                        <Heart size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhuma postagem encontrada</p>
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            onClick={() => window.open('https://instagram.com/juliospizzahouse', '_blank')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center mx-auto"
          >
            <Instagram className="mr-2" size={20} />
            Seguir no Instagram
          </button>
        </div>
      </div>
    </section>
  );
};
