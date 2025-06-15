import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Property, PropertyMedia } from '@/types/property-types';
import { formatPropertyPrice } from '@/utils/formatPropertyPrice';
import { getImageUrl } from '@/utils/getImageUrl';

interface RelatedPropertyCardProps {
  property: Property;
  seoUrlsEnabled: boolean;
  generatePropertyUrl: (property: Property, seoUrlsEnabled: boolean) => string;
}

export default function RelatedPropertyCard({ property, seoUrlsEnabled, generatePropertyUrl }: RelatedPropertyCardProps) {
  const relMedia: PropertyMedia[] = property.media || [];
  const relImage = relMedia.find((img: PropertyMedia) => img.collection_name === 'images');
  const relImageUrl = relImage ? getImageUrl(relImage.url || relImage.original_url) : 'https://via.placeholder.com/400x300?text=No+Image';
  const relPropShowUrl = generatePropertyUrl(property, seoUrlsEnabled);
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0 relative">
        <img 
          src={relImageUrl}
          alt={property.title ?? ''}
          className="aspect-[16/10] w-full rounded-t-lg object-cover"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-md mb-1 hover:text-primary transition-colors">
          <Link href={relPropShowUrl}>{property.title}</Link>
        </CardTitle>
        <p className="text-md font-semibold text-primary">{formatPropertyPrice(property)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={relPropShowUrl}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
