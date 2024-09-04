import { z } from "zod";
 const NUMERO_BI_REGEX = /^\d{9}[A-Z]{2}\d{3}$/;
 const FULL_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

 export  const nomeCompletoZod = z.string({
    required_error: 'campo obrigatório',
    invalid_type_error: 'O nome deve ser uma string.',}
 ).min(6, {message:'o campo não pode conter menos de 4 letras'}).trim().max(100, {
    message: 'Limite de caracteres excedeu.',
  }).regex(FULL_NAME_REGEX, {message:'o campo só pode conter letras'})

 export const dataNascimentoZod = z
      .string({
        required_error: 'campo obrigatório',
        })

export const anoLectivo = z
.string({
  required_error: 'O nome do ano lectivo é obrigatório.',
  invalid_type_error: 'O id do ano lectivo deve ser número.',
})
.trim()
.min(4, {
  message: 'O nome do ano lectivo deve possuir no mínimo 4 caracteres.',
})
.max(10, {
  message: 'O nome do ano lectivo deve possuir no máximo 10 caracteres.',
})
.regex(/^\d{4}-\d{4}$/, {
  message: 'o nome do ano lectivo deve seguir o padrão 9999-9999.',
})
export const inicio = z
    .string({
      required_error: 'O inicio do ano lectivo é obrigatório.',
      invalid_type_error: 'O inicio do ano lectivo é obrigatório.',
    })
    .trim()
    .date('O inicio deve ser uma data válida.')
export const termino = z
    .string({
      required_error: 'O termino do ano lectivo é obrigatório.',
      invalid_type_error: 'O termino do ano lectivo é obrigatório.',
    })
    .trim()
    .date('O termino deve ser uma data válida.')
      
export const generoZod = z.enum(['M', 'F'], { message: 'campo obrigatório.' })

export const numeroBiZod = z
        .string({
        required_error: 'campo obrigatório.',
        invalid_type_error: 'O número de BI deve ser uma string.',
        })
        .trim()
        .length(14, { message: 'o número de BI deve possuir 14 caracteres.' })
        .regex(NUMERO_BI_REGEX, {
        message: 'número de BI inválido.',
        })

export const bairroZod = z
    .string({
      required_error: 'O nome do bairro é obrigatório.',
      invalid_type_error: 'O nome do bairro deve ser uma string.',
    })
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9.,;'"-\s]{2,29}$/, {
      message:
        'O nome do bairro deve possuir entre 3 e 30 caracteres, começar com uma letra e incluir apenas caracteres especiais necessários.',
    })
  export const ruaZod = z
    .string({
      required_error: 'campo obrigatório.',
      invalid_type_error: 'o nome da rua deve incluir caracteres alfa númericos.',
    })
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9.,;'"()\s-]{2,49}$/, {
      message:
        'nome de rua inválido, inclua letras e números.',
    })
export const  numeroCasaZod = z
    .number({
      required_error: 'campo inválido.',
    })
    .int({ message: 'o número da casa inválido, retira o vírgulas.' })
    .max(99999, { message: 'o número da casa máximo valido é 99999.' })
    .min(1, "o número da casa deve ser maior do que 0")
    export const telefoneZod = z
    .string({
      required_error: 'O número de telefone é obrigatório.',
      invalid_type_error: 'O número de telefone deve ser uma string.',
    })
    .trim()
    .regex(/99|9[1-5]\d{7}$/gm, {
      message: 'O número de telefone é inválido.',
    })
 export const emailZod = z.string({
      invalid_type_error: 'O endereço de email deve ser uma string.',
    })
    .trim()
    .email({ message: 'o endereço de email é inválido.' })
    .optional()

    const CURSO_NOME_REGEX =
  /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 '’\-]{2,49}$/;
   export const nomeCursoZod = z
    .string({
      required_error: 'campo obrigatório.',
      invalid_type_error: 'o nome do curso deve ser uma string.',
    })
    .trim()
    .regex(CURSO_NOME_REGEX, {
      message:
        'o nome deve possui entre 3 e 50 caracteres, começar com uma letras.',
    })

     const DESCRICAO_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;'"-]{10,500}$/;
    export const descricaoZod = z
    .string({
      required_error: 'campo obrigatório.',
      invalid_type_error: 'a descrição do curso deve ser uma string.',
    })
    .trim()
    .regex(DESCRICAO_REGEX, {
      message:
        'a descrição do curso deve conter apenas letras, números, espaços e pontuação básica, com comprimento entre 10 e 500 caracteres.',
    })

    export const classe = z.enum(['10ª', '11ª', '12ª', '13ª'], {
      message: 'São permitidas apenas classes do ensino médio (10ª-13ª).',
    })

    export const anoLectivoId = z
      .number({
        required_error: 'O id do ano lectivo é obrigatório.',
        invalid_type_error: 'O id do ano lectivo deve ser número.',
      })
      .int({ message: 'O id do ano lectivo deve ser inteiro.' })
      .positive({ message: 'O id do ano lectivo deve ser positivo.' })

    export const cursoId = z
      .number({
        required_error: 'O id é obrigatório.',
        invalid_type_error: 'O id de curso deve ser número.',
      })
      .int({ message: 'O id deve ser inteiro.' })
      .positive({ message: 'O id deve ser positivo.' })

    export const custoMatricula = z
      .number({
        required_error: 'O valor da matrícula é obrigatório.',
        invalid_type_error: 'O valor da matrícula deve ser número.',
      })
      .positive({ message: 'O valor da matrícula deve ser positivo.' })

    export const duracaoZod = z
    .number({
      required_error: 'campo obrigatória.',
      invalid_type_error: 'a duração do curso deve ser um número.',
    })
    .int({
      message: 'a duração do curso deve ser um número inteiro.',
    })
    .min(1, {
      message: 'a duração do curso deve ser de pelo menos 1 ano.',
    })
    .max(10, {
      message: 'A duração do curso deve ser no máximo 10 anos.',
    })

    export const sala = z
    .string({
      required_error: 'Campo obrigatório.',
      invalid_type_error: 'O nome deve ser válido.',
    })
    .trim()
    .min(1, {
      message: 'O nome deve possuir no mínimo 1 caracteres.',
    })
    .max(30, {
      message: 'O nome deve possuir no máximo 30 caracteres.',
    })

    export const capacidade = z
    .number({
      required_error: 'A capacidade é obrigatória.',
      invalid_type_error: 'A capacidade deve ser número.',
    })
    .int({ message: 'A capacidade deve ser inteiro.' })
    .min(10, { message: 'A capacidade minima é 10.' })
    .max(70, { message: 'A capacidade maxima é 70' })

  export const localizacao = z
    .string({
      required_error: 'A localização é obrigatório.',
      invalid_type_error: 'A localização deve ser um arguento válido.',
    })
    .trim()
    .min(10, {
      message: 'A localização deve possuir no mínimo 10 caracteres.',
    })
    .max(255, {
      message: 'A localização deve possuir no máximo 255 caracteres.',
    })

    export const inicioturno = z
    .string({
      required_error: 'O inicio é obrigatório.',
      invalid_type_error: 'O inicio deve ser string.',
    })
    .time({ precision: 0, message: 'O inicio deve ser válido (HH:mm:ss)' })
  
  export const terminoturno = z
    .string({
      required_error: 'O termino é obrigatório.',
      invalid_type_error: 'O termino deve ser string.',
    })
    .time({ precision: 0, message: 'O termino deve ser válido (HH:mm:ss)' })
    
    export const methodPay = z
    .string({
      required_error: 'O nome do metodo de pagamento é obrigatório.',
      invalid_type_error: 'O nome do metodo de pagamento deve ser string.',
    })
    .trim()
    .min(1, {
      message:
        'O nome do metodo de pagamento deve possuir no mínimo 1 caracteres.',
    })
    .max(50, {
      message:
        'O nome do metodo de pagamento deve possuir no máximo 50 caracteres.',
    })

    export const idZod = z
    .number({
      required_error: 'campo obrigatória.',
      invalid_type_error: 'o ID do aluno deve ser um número.',
    })
    .int({
      message: 'o ID do aluno deve ser um número inteiro.',
    })
    .min(1, {
      message: 'o ID do aluno deve ser maior do que 1 e deve ser válido.',
    })