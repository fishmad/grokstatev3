import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

interface PropertyFeaturesCardProps {
  title: string;
  features: string[];
}

export default function PropertyFeaturesCard({ title, features }: PropertyFeaturesCardProps) {
  if (!features || !features.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm">
              <CheckSquare className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
