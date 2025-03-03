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

// Register fonts
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
    marginBottom: 10,
    borderBottom: '2px solid #1a365d',
    paddingBottom: 8,
    alignItems: 'center',
  },
  headerLeft: {
    width: '20%',
  },
  headerCenter: {
    width: '60%',
    textAlign: 'center',
  },
  headerRight: {
    width: '20%',
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
    textAlign: 'center',
    marginBottom: 10,
  },
  documentDescribe: {
    fontSize: 12,
    fontWeight: 500,
    color: '#000',
    textAlign: 'left',
    marginBottom: 5,
  },
  studentInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 10,
  },
  infoItem: {
    width: '23%',
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
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1a365d',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a365d',
    color: 'white',
    padding: 6,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 6,
  },
  disciplinasCol: {
    width: '50%',
  },
  notasCol: {
    width: '50%',
    textAlign: 'center',
  },
  comportamentoSection: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1a365d',
    padding: 8,
    height: 80,
  },
  comportamentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  comportamentoItem: {
    width: '30%',
  },
  mediaBox: {
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1a365d',
    alignSelf: 'flex-end',
    width: '150px',
    height: 50,
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
    width: '30%',
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

const ComportamentoField = ({ label, value, rating }) => (
  <View style={styles.comportamentoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[styles.value, { color: rating >= 3 ? '#22c55e' : '#ef4444' }]}
    >
      {value}
    </Text>
  </View>
);

const BoletimNotas = ({
  dadosAluno,
  dadosInstituicao,
  notas,
  comportamento,
}) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>
      {/* Header */}
      <View style={[styles.header, { marginBottom: 10 }]}>
        <View style={styles.headerLeft}>
          <Image style={styles.logo} src={IPPUImage} />
        </View>
        <View style={[styles.headerCenter, { width: '60%' }]}>
          <Text style={styles.institutionName}>{dadosInstituicao.nome}</Text>
          <Text style={{ fontSize: 10 }}>
            {dadosInstituicao.endereco} | {dadosInstituicao.contactos}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={{ fontSize: 8 }}>Nº: {dadosAluno.numero}</Text>
          <Text style={{ fontSize: 8 }}>
            Data: {new Date().toLocaleDateString('pt-PT')}
          </Text>
        </View>
      </View>

      <Text style={styles.documentTitle}>BOLETIM DE NOTAS E AVALIAÇÃO</Text>
      <Text style={styles.studentInfo}>
        O(A) aluno(a) {dadosAluno.nomeCompleto}, no ano lectivo{' '}
        {dadosAluno.anoLetivo}, da {dadosAluno.classe}, nº {dadosAluno.numero},
        turma {dadosAluno.turma}, sala {dadosAluno.sala}, período Manhã, vimos
        através deste informar o aproveitamento que obteve:
      </Text>
      {/* Student Information 
			<View style={styles.studentInfo}>
				<Field label="NOME COMPLETO" value={dadosAluno.nomeCompleto} />
				<Field label="CLASSE" value={dadosAluno.classe} />
				<Field label="TURMA" value={dadosAluno.turma} />
				<Field label="SALA" value={dadosAluno.sala} />
			</View>*/}

      {/* Grades Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.disciplinasCol}>DISCIPLINAS</Text>
          <Text style={styles.notasCol}>NOTA</Text>
        </View>

        {notas.map((nota, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.disciplinasCol}>{nota.disciplina}</Text>
            <Text
              style={[
                styles.notasCol,
                { color: nota.valor >= 10 ? '#22c55e' : '#ef4444' },
              ]}
            >
              {nota.valor}
            </Text>
          </View>
        ))}
      </View>

      {/* Behavioral Assessment */}
      <View style={[styles.comportamentoSection, { height: 80 }]}>
        <Text
          style={[
            styles.label,
            { marginBottom: 5, fontSize: 10, fontWeight: 700 },
          ]}
        >
          AVALIAÇÃO COMPORTAMENTAL
        </Text>
        <View style={styles.comportamentoGrid}>
          <ComportamentoField
            label="Comportamento"
            value={comportamento.comportamentoGeral}
            rating={comportamento.comportamentoRating}
          />
          <ComportamentoField
            label="Pontualidade"
            value={comportamento.pontualidade}
            rating={comportamento.pontualidadeRating}
          />
          <ComportamentoField
            label="Assiduidade"
            value={comportamento.assiduidade}
            rating={comportamento.assiduidadeRating}
          />
        </View>
      </View>

      {/* Media Box */}
      <View style={[styles.mediaBox, { height: 50 }]}>
        <Text style={[styles.label, { marginBottom: 3 }]}>
          MÉDIA TRIMESTRAL
        </Text>
        <Text
          style={[
            styles.value,
            {
              fontSize: 12,
              color: dadosAluno.mediaTrimestral >= 10 ? '#22c55e' : '#ef4444',
            },
          ]}
        >
          {dadosAluno.mediaTrimestral.toFixed(1)} valores
        </Text>
      </View>
      {/* Footer with signatures */}
      <View style={styles.footer}>
        <View style={styles.signatures}>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>O(A) Professor(a)</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>O(A) Director(a) de Turma</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              O(A) Encarregado(a) de Educação
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

function GenerateBoletim() {
  const dadosInstituicao = {
    nome: 'INSTITUTO POLITÉCNICO PRIVADO ULUMBO',
    endereco: 'Rua Principal, nº 123 - Luanda, Angola',
    contactos: 'Tel: +244 923 456 789 | example@email.com',
  };

  const dadosAluno = {
    numero: 'A2024/0001',
    nomeCompleto: 'Ana Maria da Silva',
    classe: '9ª Classe',
    turma: 'B',
    sala: '11',
    anoLetivo: '2024',
    mediaTrimestral: 14.5,
  };

  const notas = [
    {
      disciplina: 'Língua Portuguesa',
      valor: 15,
    },
    {
      disciplina: 'Matemática',
      valor: 17,
    },
    {
      disciplina: 'Física',
      valor: 13,
    },
    {
      disciplina: 'Química',
      valor: 14,
    },
    {
      disciplina: 'Biologia',
      valor: 16,
    },
    {
      disciplina: 'História',
      valor: 8,
    },
    {
      disciplina: 'Bilógia',
      valor: 10,
    },
    {
      disciplina: 'Educação Física',
      valor: 14,
    },
    {
      disciplina: 'Geografia',
      valor: 12,
    },
    {
      disciplina: 'Inglês',
      valor: 13,
    },
  ];

  const comportamento = {
    comportamentoGeral: 'Muito Bom',
    comportamentoRating: 4,
    pontualidade: 'Excelente',
    pontualidadeRating: 5,
    assiduidade: 'Muito Bom',
    assiduidadeRating: 4,
  };

  const generatePDF = async () => {
    const blob = await pdf(
      <BoletimNotas
        dadosAluno={dadosAluno}
        dadosInstituicao={dadosInstituicao}
        notas={notas}
        comportamento={comportamento}
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
        Gerar Boletim de Notas
      </button>
    </div>
  );
}

export default GenerateBoletim;
