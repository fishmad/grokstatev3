import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { User } from '@/types';

interface AgentInfoCardProps {
  owner: User;
  getInitials: (name: string) => string;
}

export default function AgentInfoCard({ owner, getInitials }: AgentInfoCardProps) {
  if (!owner) return null;
  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
          <AvatarImage src={owner.avatar || undefined} alt={owner.name} />
          <AvatarFallback className="text-3xl">{getInitials(owner.name)}</AvatarFallback>
        </Avatar>
        <CardTitle>{owner.name}</CardTitle>
        <CardDescription>Property Owner / Agent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" asChild>
          <a href={`mailto:${owner.email}`}>
            <Mail className="mr-2 h-4 w-4" /> Contact Owner
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
