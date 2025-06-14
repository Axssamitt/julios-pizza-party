
import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface CarouselImage {
  id: string;
  url_imagem: string;
  titulo: string;
}

interface HeroCarouselProps {
  images?: CarouselImage[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ images = [] }) => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(images);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false }) as any]
  );

  useEffect(() => {
    if (images.length === 0) {
      // Carregar imagens do carrossel do banco de dados
      const fetchCarouselImages = async () => {
        try {
          const { data, error } = await supabase
            .from('carousel_images')
            .select('*')
            .eq('ativo', true)
            .order('ordem');
          
          if (data && !error) {
            setCarouselImages(data);
          }
        } catch (error) {
          console.error('Erro ao carregar imagens do carrossel:', error);
        }
      };

      fetchCarouselImages();
    }
  }, [images]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!carouselImages || carouselImages.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {carouselImages.map((image) => (
            <div key={image.id} className="embla__slide flex-[0_0_100%] min-w-0 relative">
              <img
                src={image.url_imagem}
                alt={image.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {image.titulo}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {carouselImages.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
