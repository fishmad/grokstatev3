import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BedDouble, Bath, CarFront, Ruler } from 'lucide-react';
import type { Property, DetailedPropertyFeatures } from '@/types/property-types';

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}
const DetailItem = ({ icon: Icon, label, value }: DetailItemProps) => (
  <div className="flex items-start">
    <Icon className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

interface PropertyDetailsCardProps {
  property: Property;
}

export default function PropertyDetailsCard({ property }: PropertyDetailsCardProps) {
  // Prefer propertyFeature, fallback to direct fields for legacy support
  const features: DetailedPropertyFeatures | null = property.propertyFeature || null;
  const bedrooms = features?.bedrooms ?? property.bedrooms ?? null;
  const bathrooms = features?.bathrooms ?? property.bathrooms ?? null;
  const garageSpaces = features?.garageSpaces ?? property.garage_spaces ?? null;
  const carSpaces = features?.carSpaces ?? property.car_spaces ?? null;
  const parkingSpaces = features?.parkingSpaces ?? property.parking_spaces ?? null;
  const areaSqft = features?.floorArea ?? null;
  const plotSqft = features?.landArea ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 text-sm">
        {bedrooms !== null && bedrooms !== undefined && <DetailItem icon={BedDouble} label="Bedrooms" value={bedrooms} />}
        {bathrooms !== null && bathrooms !== undefined && <DetailItem icon={Bath} label="Bathrooms" value={bathrooms} />}
        {garageSpaces !== null && garageSpaces !== undefined && <DetailItem icon={CarFront} label="Garages" value={garageSpaces === 0 ? 'None' : garageSpaces} />}
        {carSpaces !== null && carSpaces !== undefined && <DetailItem icon={CarFront} label="Car Spaces" value={carSpaces === 0 ? 'None' : carSpaces} />}
        {parkingSpaces !== null && parkingSpaces !== undefined && <DetailItem icon={CarFront} label="Parking Spaces" value={parkingSpaces === 0 ? 'None' : parkingSpaces} />}
        {areaSqft !== null && areaSqft !== undefined && <DetailItem icon={Ruler} label="Area" value={`${areaSqft} sqft`} />}
        {plotSqft !== null && plotSqft !== undefined && <DetailItem icon={Ruler} label="Plot Size" value={`${plotSqft} sqft`} />}
      </CardContent>
    </Card>
  );
}
