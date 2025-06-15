import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { formatPropertyPrice } from '@/utils/formatPropertyPrice';

interface PropertyHeaderCardProps {
  title: string;
  status: string;
  address: string;
  price: string;
  statusLabel: string;
}

export default function PropertyHeaderCard({ title, status, address, price, statusLabel }: PropertyHeaderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          <Badge variant={status === 'sold' || status === 'rented' ? 'destructive' : 'default'} className="text-lg whitespace-nowrap">
            {statusLabel}
          </Badge>
        </div>
        <div className="flex items-center text-muted-foreground mt-2">
          <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{address}</span>
        </div>
        <p className="text-3xl font-bold text-primary mt-2">{price}</p>
      </CardHeader>
    </Card>
  );
}
