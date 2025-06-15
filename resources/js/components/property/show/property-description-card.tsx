import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PropertyDescriptionCardProps {
  description?: string | null;
}

export default function PropertyDescriptionCard({ description }: PropertyDescriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        <p>{description ?? 'No description provided.'}</p>
      </CardContent>
    </Card>
  );
}
