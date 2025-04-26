import { useSpaceController } from '@/controllers';
import { useQuery } from '@tanstack/react-query';

export const useSpaceQueries = () => {
  const { fetchSpaces, fetchSpaceById, fetchSharedSpace } =
    useSpaceController();

  const fetchSpacesQuery = useQuery({
    queryKey: ['spaces'],
    queryFn: fetchSpaces,
  });

  const fetchSpaceByIdQuery = (spaceId: string) =>
    useQuery({
      queryKey: ['space', spaceId],
      queryFn: () => fetchSpaceById(spaceId),
    });

  const fetchSharedSpaceQuery = (spaceId: string) =>
    useQuery({
      queryKey: ['sharedSpace', spaceId],
      queryFn: () => fetchSharedSpace(spaceId),
    });

  return { fetchSpacesQuery, fetchSpaceByIdQuery, fetchSharedSpaceQuery };
};
