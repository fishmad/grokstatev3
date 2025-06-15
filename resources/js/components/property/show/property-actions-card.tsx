import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Edit, Share2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PropertyActionsCardProps {
  isFavorited: boolean;
  isFavoriteProcessing: boolean;
  onToggleFavorite: () => void;
  canEdit: boolean;
  editUrl: string;
  isLoggedIn: boolean;
  loginUrl: string;
}

export default function PropertyActionsCard({ isFavorited, isFavoriteProcessing, onToggleFavorite, canEdit, editUrl, isLoggedIn, loginUrl }: PropertyActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoggedIn ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onToggleFavorite}
            disabled={isFavoriteProcessing}
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" asChild>
            <Link href={loginUrl}>
              <Heart className="mr-2 h-4 w-4" /> Add to Favorites
            </Link>
          </Button>
        )}
        <Button variant="outline" className="w-full">
          <Share2 className="mr-2 h-4 w-4" /> Share Property
        </Button>
        {canEdit && (
          <Button className="w-full mt-2" asChild>
            <Link href={editUrl}>
              <Edit className="mr-2 h-4 w-4" /> Edit Property
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
