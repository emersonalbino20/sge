import * as React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
  Image,
} from '@react-pdf/renderer';
import IPPUImage from './../assets/images/IPPU.png';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { getCookies } from '@/_cookies/Cookies';

//Logic to generate pdf

// Register fonts for a more professional look
/*Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});*/

const styles = StyleSheet.create({
  page: {
    padding: '20px 30px',
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottom: '2px solid #1a365d',
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerLeft: {
    width: '25%',
  },
  headerCenter: {
    width: '50%',
    textAlign: 'center',
  },
  headerRight: {
    width: '25%',
    textAlign: 'right',
  },
  logo: {
    width: 60,
    height: 60,
  },
  institutionName: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#1a365d',
  },
  mainContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '4px 8px',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  col2: {
    width: '48%',
  },
  col3: {
    width: '31%',
  },
  col4: {
    width: '23%',
  },
  fieldGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: '#4a5568',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    fontWeight: 500,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signature: {
    width: '45%',
  },
  signatureLine: {
    borderTop: '1px solid black',
    marginTop: 40,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
  },
});

const Field = ({ label, value, style = {} }) => (
  <View style={[styles.fieldGroup, style]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const ComprovanteMatricula = ({ dadosAluno, dadosInstituicao }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image style={styles.logo} src={IPPUImage} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.institutionName}>{dadosInstituicao.nome}</Text>
          <Text style={{ fontSize: 10, marginBottom: 4 }}>
            {dadosInstituicao.endereco}
          </Text>
          <Text style={{ fontSize: 10 }}>{dadosInstituicao.contactos}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={{ fontSize: 8 }}>
            Nº: {dadosAluno?.data?.data?.createdBy?.nome}
          </Text>
          <Text style={{ fontSize: 8 }}>
            Data: {new Date().toLocaleDateString('pt-PT')}
          </Text>
          <Text style={{ fontSize: 8 }}>
            Ano Lectivo: {dadosAluno?.data?.data?.pagamento?.anoLectivo?.nome}
          </Text>
        </View>
      </View>

      <Text style={styles.documentTitle}>COMPROVATIVO DE MATRÍCULA</Text>

      {/* Course Information */}
      <View style={[styles.section, { marginTop: 15 }]}>
        <Text style={styles.sectionTitle}>INFORMAÇÕES DO CURSO</Text>
        <View style={styles.grid}>
          <View style={styles.col4}>
            <Field label="CURSO" value={dadosAluno?.data?.data?.curso?.nome} />
          </View>
          <View style={styles.col4}>
            <Field
              label="CLASSE"
              value={dadosAluno?.data?.data?.classe?.nome}
            />
          </View>
          <View style={styles.col4}>
            <Field label="TURMA" value={dadosAluno?.data?.data?.turma?.nome} />
          </View>
          <View style={styles.col4}>
            <Field label="TURNO" value={dadosAluno?.data?.data?.turno?.nome} />
          </View>
          <View style={styles.col4}>
            <Field
              label="FORMA DE PAGAMENTO"
              value={dadosAluno?.data?.data?.pagamento?.metodoPagamento?.nome}
            />
          </View>
        </View>
      </View>

      {/* Student Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DADOS DO ALUNO</Text>
        <View style={styles.grid}>
          <View style={styles.col2}>
            <Field
              label="NOME COMPLETO"
              value={dadosAluno?.data?.data?.aluno?.nomeCompleto}
            />
          </View>
          <View style={styles.col2}>
            <Field
              label="Nº DO BI"
              value={dadosAluno?.data?.data?.aluno?.numeroBi}
            />
          </View>

          <View style={styles.col2}>
            <Field
              label="DATA DE NASCIMENTO"
              value={new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
                .format(new Date(dadosAluno?.data?.data?.aluno?.dataNascimento))
                .replace('.', '')}
            />
          </View>
          <View style={styles.col2}>
            <Field
              label="GÊNERO"
              value={dadosAluno?.data?.data?.aluno?.genero}
            />
          </View>
          <View style={styles.col2}>
            <Field
              label="TELEFONE"
              value={dadosAluno?.data?.data?.aluno?.contacto.telefone}
            />
          </View>
          <View style={styles.col2}>
            <Field
              label="BAIRRO"
              value={dadosAluno?.data?.data?.aluno?.endereco.bairro}
            />
          </View>
          <View style={styles.col2}>
            <Field
              label="NOME DO PAI"
              value={dadosAluno?.data?.data?.aluno?.nomeCompletoPai}
            />
          </View>
          <View style={styles.col3}>
            <Field
              label="RUA"
              value={dadosAluno?.data?.data?.aluno?.endereco.rua}
            />
          </View>
          <View style={styles.col2}>
            <Field
              label="NOME DA MÃE"
              value={dadosAluno?.data?.data?.aluno?.nomeCompletoMae}
            />
          </View>
          <View style={styles.col3}>
            <Field
              label="NÚMERO DA RESIDÊNCIA"
              value={dadosAluno?.data?.data?.aluno?.endereco.numeroCasa}
            />
          </View>
        </View>
      </View>

      {/* Guardian Information 
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DADOS DO RESPONSÁVEL</Text>
        <View style={styles.grid}>
          <View style={styles.col2}>
            <Field
              label="NOME COMPLETO"
              value={dadosAluno.responsavel.nomeCompleto}
            />
          </View>
          <View style={styles.col2}>
            <Field
              label="GRAU DE PARENTESCO"
              value={dadosAluno.responsavel.grauParentesco}
            />
          </View>
          <View style={styles.col3}>
            <Field
              label="TELEFONE"
              value={dadosAluno.responsavel.contacto.telefone}
            />
          </View>
          <View style={styles.col3}>
            <Field
              label="BAIRRO"
              value={dadosAluno.responsavel.endereco.bairro}
            />
          </View>
          <View style={styles.col3}>
            <Field label="RUA" value={dadosAluno.responsavel.endereco.rua} />
          </View>
        </View>
      </View>
      */}
      {/* Footer with signatures */}
      <View style={styles.footer}>
        <Text
          style={{
            fontSize: 8,
            textAlign: 'center',
            marginBottom: 20,
            color: '#666',
          }}
        >
          Este documento é válido para fins de comprovação de vínculo acadêmico.
        </Text>
        <View style={styles.signatures}>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>O Director</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Secretaria Acadêmica</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const dadosInstituicao = {
  nome: 'INSTITUTO POLITÉCNICO PRIVADO ULUMBO',
  endereco: 'Rua Principal, nº 123 - Luanda, Angola',
  contactos: 'Tel: +244 923 456 789 | example@email.com',
};

const dadosAluno = {
  numeroMatricula: 'M2024/0001',
  curso: 'Engenharia de Software',
  classe: '10ª Classe',
  turma: 'A',
  formaPagamento: 'Mensal',
  nomeCompleto: 'João Manuel da Silva',
  nomePai: 'Manuel António da Silva',
  nomeMae: 'Maria José dos Santos',
  numeroBI: '123456789LA042',
  dataNascimento: '15/03/2005',
  genero: 'Masculino',
  endereco: {
    bairro: 'Benfica',
    rua: 'Rua das Acácias, nº 42',
    numeroCasa: 'nº 5',
  },
  contacto: {
    telefone: '+244 923 456 789',
    email: 'joao.silva@email.com',
  },
  responsavel: {
    nomeCompleto: 'Manuel António da Silva',
    grauParentesco: 'Pai',
    endereco: {
      bairro: 'Benfica',
      rua: 'Rua das Acácias, nº 42',
    },
    contacto: {
      telefone: '+244 923 456 789',
      email: 'manuel.silva@email.com',
    },
  },
};

const generatePDF = async () => {
  const blob = await pdf(
    <ComprovanteMatricula
      dadosAluno={dadosAluno}
      dadosInstituicao={dadosInstituicao}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

const PAGE_SIZE = 10;
interface ApiResponse {
  data: ClassStudent[];
  next_cursor: number;
}
//Auxilary Functions

/* Show the message error */
const collectErrorMessages = (obj) => {
  let messages = [];
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      messages = messages.concat(obj[key]);
    } else if (typeof obj[key] === 'object') {
      messages = messages.concat(collectErrorMessages(obj[key]));
    }
  }
  return messages;
};

/* Post */
const auxPostStudent = (data) => {
  return axios.post('http://localhost:8000/api/matriculas/', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const auxPostConfirmEnrollment = (data) => {
  return axios.post(
    `http://localhost:8000/api/alunos/${data.id}/matriculas/confirm`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

const auxPostStudentNote = (data) => {
  return axios.post('http://localhost:8000/api/notas/', data);
};

const auxPostGuardianStudent = (data) => {
  return axios.post(
    `http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`,
    data
  );
};

/* Put */
const auxPutStudent = (data) => {
  return axios.put(`http://localhost:8000/api/alunos/${data.id}`, data);
};

const auxPutStudentNote = (data) => {
  return axios.put(
    `http://localhost:8000/api/alunos/${data.alunoId}/notas`,
    data
  );
};

//Main Functions

//Post
export const usePostStudent = () => {
  const [postError, setResp] = React.useState<string>('');
  const [postLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostStudent,
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
      const blob = await pdf(
        <ComprovanteMatricula
          dadosAluno={response}
          dadosInstituicao={dadosInstituicao}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error?.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(
            `(${count}) ${
              error?.response?.data?.message
                ? error?.response?.data?.message
                : errorMessages[0]
            }`
          );
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postStudent: mutate, postError, postLevel };
};

export const usePostConfirmEnrollment = () => {
  const [postConfirmError, setResp] = React.useState<string>('');
  const [postConfirmLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostConfirmEnrollment,
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
      const blob = await pdf(
        <ComprovanteMatricula
          dadosAluno={response}
          dadosInstituicao={dadosInstituicao}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error?.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(
            `(${count}) ${
              err ? errorMessages[0] : error?.response?.data?.message
            }`
          );
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postConfirmStudent: mutate, postConfirmError, postConfirmLevel };
};

export const usePostStudentNote = () => {
  const [postNoteError, setResp] = React.useState<string>('');
  const [postNoteLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPostStudentNote,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [
          'alunos-com-notas',
          variables?.classeId,
          variables?.turmaId,
          variables?.trimestreId,
          variables?.disciplina,
        ],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(`(${count}) ${errorMessages[0]}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postStudentNote: mutate, postNoteError, postNoteLevel };
};

export const usePostGuardianStudent = () => {
  const [postGuardianStudentError, setResp] = React.useState<string>('');
  const [postGuardianStudentLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostGuardianStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['responsaveisalunos', getCookies('idAluno')],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.response && error.response.data) {
          if (error.response?.data?.message) {
            setResp(`(${count}) ${error.response?.data?.message}`);
            setLevel(2);
          } else {
            const err = error.response?.data?.errors;
            const errorMessages = collectErrorMessages(err);
            setResp(`(${count}) ${errorMessages[0]}`);
            setLevel(2);
          }
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return {
    postGuardianStudent: mutate,
    postGuardianStudentError,
    postGuardianStudentLevel,
  };
};

//Put
export const usePutStudent = () => {
  const [putStudentError, setResp] = React.useState<string>('');
  const [putStudentLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPutStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['alunosportuma', variables?.classeId, variables?.turmaId],
      });
      queryClient.invalidateQueries({
        queryKey: ['alunoId', variables?.id],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(`(${count}) ${errorMessages[0]}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return {
    putStudent: mutate,
    putStudentError,
    putStudentLevel,
  };
};

export const usePutStudentNote = () => {
  const [putNoteError, setResp] = React.useState<string>('');
  const [putNoteLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPutStudentNote,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [
          'alunos-com-notas',
          variables?.classeId,
          variables?.turmaId,
          variables?.trimestreId,
          variables?.disciplina,
        ],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
      console.log(variables);
    },
    onError: (error) => {
      console.log(variables);
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(`(${count}) ${errorMessages[0]}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { putStudentNote: mutate, putNoteError, putNoteLevel };
};

//Get
interface Aluno {
  id: number;
  nomeCompleto: string;
  numeroBi: string;
  dataNascimento: string;
  genero: 'M' | 'F';
}
export const useGetAllStudentsQuery = () => {
  return useInfiniteQuery<ApiResponse>({
    queryKey: ['alunos'],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get('http://localhost:8000/api/alunos', {
        params: {
          cursor: pageParam,
          PAGE_SIZE,
        },
      });
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      // Retorna a última página só se o next_cursor for maior que 1
      return lastPage.next_cursor > 1 ? lastPage.next_cursor : undefined;
    },
    initialPageParam: null,
  });
};

export const useGetIdStudent = (id) => {
  const { data, isFetched } = useQuery({
    queryKey: ['alunoId', id],
    queryFn: () => axios.get(`http://localhost:8000/api/alunos/${id}`),
    enabled: !!id,
  });

  return { data, isFetched };
};

export const useGetIdGuardianStudent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['responsaveisalunos', getCookies('idAluno')],
    queryFn: () =>
      axios.get(
        `http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`
      ),
    enabled: !!getCookies('idAluno'),
  });

  return { data, isLoading, isError };
};

interface ClassStudent {
  id: number;
  nomeCompleto: string;
  numeroBi: string;
  dataNascimento: string;
  genero: 'M' | 'F';
}

export const useGetStudentByClassQuery = (
  classeId: number,
  turmaId: number
) => {
  return useInfiniteQuery<ApiResponse>({
    queryKey: ['alunosporturma', classeId, turmaId],
    queryFn: async ({ pageParam = null }) => {
      const query = turmaId
        ? `http://localhost:8000/api/turmas/${turmaId}/alunos`
        : `http://localhost:8000/api/classes/${classeId}/alunos`;
      const response = await axios.get(query, {
        params: {
          cursor: pageParam,
          PAGE_SIZE,
        },
      });
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      // Retorna a última página só se o next_cursor for maior que 1
      return lastPage.next_cursor > 1 ? lastPage.next_cursor : undefined;
    },
    initialPageParam: null,
  });
};

export const useGetStudentNotesQuery = (alunoId, trimestreId, classeId) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['alunosnotas', alunoId, trimestreId, classeId],
    queryFn: () =>
      axios.get(
        `http://localhost:8000/api/alunos/${alunoId}/notas?trimestreId=${trimestreId}&classeId=${classeId}`
      ),
    enabled: !!alunoId,
  });

  return { data, isLoading, isError };
};

export const useGetStudentHistoryQuery = (alunoId) => {
  const { data } = useQuery({
    queryKey: ['alunohistory', alunoId],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/alunos/${alunoId}/matriculas`),
    enabled: !!alunoId,
  });
  return { data };
};

export const useGetStudentGradesQuery = (alunoId) => {
  const { data } = useQuery({
    queryKey: ['alunogrades', alunoId],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/alunos/${alunoId}/classes`),
    enabled: !!alunoId,
  });
  return { data };
};

export const useGetStudentAtGradeQuery = (alunoId) => {
  const { data } = useQuery({
    queryKey: ['alunoatgrades', alunoId],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/alunos/${alunoId}/classes/actual`),
    enabled: !!alunoId,
  });
  return { data };
};

interface Aluno {
  id: number;
  nome: string;
  // ... outros campos do aluno
}

interface Nota {
  disciplina: string;
  nota: number;
}

// Função para buscar alunos de uma turma
async function fetchAlunos(turmaId: number) {
  const response = await fetch(
    `http://localhost:8000/api/turmas/${turmaId}/alunos`
  );
  if (!response.ok) {
    throw new Error('Erro ao buscar alunos');
  }
  return response.json();
}

// Função para buscar nota de um aluno
async function fetchNotaAluno(
  alunoId: number,
  trimestreId: number,
  classeId: number
) {
  const response = await fetch(
    `http://localhost:8000/api/alunos/${alunoId}/notas?trimestreId=${trimestreId}&classeId=${classeId}`
  );
  if (!response.ok) {
    throw new Error('Erro ao buscar nota');
  }
  return response.json();
}

// Hook principal que combina os dados
export function useAlunosComNotas({
  classeId,
  turmaId,
  trimestreId,
  nomeDisciplina,
}: {
  classeId: number;
  turmaId: number;
  trimestreId: number;
  nomeDisciplina: string;
}) {
  return useQuery({
    queryKey: [
      'alunos-com-notas',
      classeId,
      turmaId,
      trimestreId,
      nomeDisciplina,
    ],
    queryFn: async () => {
      // Primeiro, busca todos os alunos
      const alunosResponse = await fetchAlunos(turmaId);
      const alunos = alunosResponse.data;

      // Depois, busca as notas para cada aluno
      const alunosComNotas = await Promise.all(
        alunos.map(async (aluno) => {
          try {
            const notasResponse = await fetchNotaAluno(
              aluno.id.toString(),
              trimestreId,
              classeId
            );

            const notaDisciplina = notasResponse.data?.find(
              (nota: Nota) => nota.disciplina === nomeDisciplina
            );

            return {
              ...aluno,
              nota: notaDisciplina?.nota ?? null,
              nomeDisciplina,
            };
          } catch (error) {
            return {
              ...aluno,
              nota: null,
              nomeDisciplina,
            };
          }
        })
      );

      return alunosComNotas;
    },
    // Habilita o stale time para evitar requisições desnecessárias
    staleTime: 1000 * 60 * 5, // 5 minutos
    // Habilita o cache time
    gcTime: 1000 * 60 * 15, // 15 minutos
  });
}
