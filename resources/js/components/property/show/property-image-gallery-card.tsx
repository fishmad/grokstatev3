import { PropertyMedia } from '@/types/property-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getImageUrl } from '@/utils/getImageUrl';

interface PropertyImageGalleryCardProps {
  media: PropertyMedia[];
  title: string;
}

export default function PropertyImageGalleryCard({ media, title }: PropertyImageGalleryCardProps) {
  const images = media.filter((img) => img.collection_name === 'images');
  if (!images.length) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground shadow-lg">
        No Images Available
      </div>
    );
  }
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="w-full rounded-lg overflow-hidden shadow-lg h-[400px] md:h-[500px]"
    >
      {images.map((image, idx) => (
        <SwiperSlide key={image.id || idx}>
          <div className="relative w-full h-full">
            <img
              src={getImageUrl(image.url || image.original_url)}
              alt={image.custom_properties?.caption || `${title} - Image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {image.custom_properties?.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {image.custom_properties.caption}
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
