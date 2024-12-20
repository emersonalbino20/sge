interface Aluno {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
}

interface ApiResponse {
  data: Aluno[];
  next_cursor: number;
}

// hooks/useAlunosPaginados.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

const PAGE_SIZE = 10;

export const useAlunosPaginados = () => {
  return useInfiniteQuery<ApiResponse>({
    queryKey: ['alunoss'],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get(
        'http://localhost:8000/api/professores',
        {
          params: {
            cursor: pageParam,
          },
        }
      );
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      // Se next_cursor for 0, significa que não há mais páginas
      return lastPage.next_cursor || undefined;
    },
    initialPageParam: null,
  });
};
