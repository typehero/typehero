import { useSearchParams } from 'next/navigation';

export const useGetQueryString = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  return params.toString();
};
