import * as React from 'react';
import { useAlunosPaginados } from './tanstackex';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function implePagin() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useAlunosPaginados();
  console.log(data);

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro ao carregar alunos: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const alunos = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {alunos.map((aluno) => (
          <div key={aluno.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-medium">
              {aluno.id}
              {aluno.nomeCompleto}
            </h3>
            <p className="text-sm text-gray-600">
              Data de Nascimento:{' '}
              {new Date(aluno.dataNascimento).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Carregando mais...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  );
}
