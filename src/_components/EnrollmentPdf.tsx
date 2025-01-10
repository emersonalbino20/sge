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

// Register fonts for a more professional look
Font.register({
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
});

const styles = StyleSheet.create({
  page: {
    padding: '20px 30px',
    fontFamily: 'Inter',
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
          <Text style={{ fontSize: 8 }}>Nº: {dadosAluno.numeroMatricula}</Text>
          <Text style={{ fontSize: 8 }}>
            Data: {new Date().toLocaleDateString('pt-PT')}
          </Text>
        </View>
      </View>

      <Text style={styles.documentTitle}>COMPROVATIVO DE MATRÍCULA</Text>

      {/* Course Information */}
      <View style={[styles.section, { marginTop: 15 }]}>
        <Text style={styles.sectionTitle}>INFORMAÇÕES DO CURSO</Text>
        <View style={styles.grid}>
          <View style={styles.col4}>
            <Field label="CURSO" value={dadosAluno.curso} />
          </View>
          <View style={styles.col4}>
            <Field label="CLASSE" value={dadosAluno.classe} />
          </View>
          <View style={styles.col4}>
            <Field label="TURMA" value={dadosAluno.turma} />
          </View>
          <View style={styles.col4}>
            <Field
              label="FORMA DE PAGAMENTO"
              value={dadosAluno.formaPagamento}
            />
          </View>
        </View>
      </View>

      {/* Student Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DADOS DO ALUNO</Text>
        <View style={styles.grid}>
          <View style={styles.col2}>
            <Field label="NOME COMPLETO" value={dadosAluno.nomeCompleto} />
          </View>
          <View style={styles.col2}>
            <Field label="Nº DO BI" value={dadosAluno.numeroBI} />
          </View>

          <View style={styles.col2}>
            <Field
              label="DATA DE NASCIMENTO"
              value={dadosAluno.dataNascimento}
            />
          </View>
          <View style={styles.col2}>
            <Field label="GÊNERO" value={dadosAluno.genero} />
          </View>
          <View style={styles.col2}>
            <Field label="TELEFONE" value={dadosAluno.contacto.telefone} />
          </View>
          <View style={styles.col2}>
            <Field label="BAIRRO" value={dadosAluno.endereco.bairro} />
          </View>
          <View style={styles.col2}>
            <Field label="NOME DO PAI" value={dadosAluno.nomePai} />
          </View>
          <View style={styles.col3}>
            <Field label="RUA" value={dadosAluno.endereco.rua} />
          </View>
          <View style={styles.col2}>
            <Field label="NOME DA MÃE" value={dadosAluno.nomeMae} />
          </View>
          <View style={styles.col3}>
            <Field
              label="NÚMERO DA RESIDÊNCIA"
              value={dadosAluno.endereco.numeroCasa}
            />
          </View>
        </View>
      </View>

      {/* Guardian Information */}
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

function GeneratePdf() {
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

  return (
    <div className="p-4">
      <button
        onClick={generatePDF}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Gerar Comprovativo de Matrícula
      </button>
    </div>
  );
}

export default GeneratePdf;
