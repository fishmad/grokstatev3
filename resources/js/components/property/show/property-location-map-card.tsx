import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEffect, useRef } from 'react';

interface PropertyLocationMapCardProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export default function PropertyLocationMapCard({ latitude, longitude, title }: PropertyLocationMapCardProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (typeof window === 'undefined') return;
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}`;
      script.async = true;
      script.onload = () => renderMap();
      document.body.appendChild(script);
    } else {
      renderMap();
    }
    function renderMap() {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        disableDefaultUI: true,
      });
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: title || '',
      });
    }
    // eslint-disable-next-line
  }, [latitude, longitude]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-64 rounded" style={{ minHeight: 256, border: '1px solid #e5e7eb' }} />
        <div className="text-xs text-muted-foreground mt-2">Location is based on the most accurate pin set by the owner. If unavailable, map is centered on Australia.</div>
      </CardContent>
    </Card>
  );
}
