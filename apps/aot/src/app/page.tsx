import { Button } from '@repo/ui/components/button';
import { useToast } from '@repo/ui/components/use-toast';

export default function Home() {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: 'Query limit exceeded!',
      description: 'Usernames are limited to 39 characters.',
      variant: 'destructive',
    });
  };
  return (
    <div>
      <Button onClick={handleClick}>click</Button>
    </div>
  );
}
