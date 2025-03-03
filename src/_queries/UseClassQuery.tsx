import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useGetIdClassQuery = (id: number) => {
  const { data, isFetched } = useQuery({
    queryKey: ['turmas', id],
    queryFn: () => axios.get(`http://localhost:8000/api/turmas/${id}`),
    enabled: !!id,
  });

  return { dataClass: data, isFetched };
};
