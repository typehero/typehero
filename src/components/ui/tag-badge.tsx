import { type TagTypes } from '@prisma/client';
import { Badge } from './badge';

interface Props {
    tagtypes: TagTypes;
}

const COLORS_BY_TAG = {
    GENERICS: 'dark:bg-pink-300 bg-pink-600 dark:group-hover:text-pink-300 group-hover:text-pink-600',
    UNIONS: 'dark:bg-green-300 bg-green-600 dark:group-hover:text-green-300 group-hover:text-green-600',
    TRANSFORMATIONS:
    'dark:bg-yellow-300 bg-yellow-600 dark:group-hover:text-yellow-300 group-hover:text-yellow-600',
};

export function TagBadge({ tagtypes }: Props) {
    return (
        <Badge
            className={`duration-300 group-hover:bg-white dark:group-hover:bg-black/70 ${[tagtypes]}`}
        >
        {tagtypes}
        </Badge>
    );
}