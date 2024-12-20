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
		paddingBottom: 80,
	},
	header: {
		flexDirection: 'row',
		marginBottom: 20,
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
		width: 80,
		height: 80,
	},
	institutionName: {
		fontSize: 18,
		fontWeight: 700,
		marginBottom: 4,
	},
	documentTitle: {
		fontSize: 16,
		fontWeight: 600,
		color: '#1a365d',
		textAlign: 'center',
		marginBottom: 15,
	},
	documentDescribe: {
		fontSize: 12,
		fontWeight: 500,
		color: '#000',
		textAlign: 'left',
		marginBottom: 15,
	},
	studentInfo: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 20,
		gap: 15,
	},
	infoItem: {
		width: '30%',
	},
	label: {
		fontSize: 10,
		color: '#4a5568',
		marginBottom: 3,
	},
	value: {
		fontSize: 11,
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
		width: '30%',
	},
	signatureLine: {
		borderTop: '1px solid black',
		marginTop: 40,
		marginBottom: 5,
	},
	signatureText: {
		fontSize: 10,
		textAlign: 'center',
	},
});

const Field = ({ label, value, style = {} }) => (
	<View style={[styles.infoItem, style]}>
		<Text style={styles.label}>{label}</Text>
		<Text style={styles.value}>{value}</Text>
	</View>
);

const EnrollmentConfirmation = ({
	dadosInstituicao,
	dadosAluno,
	enrollmentDate,
}) => (
	<Document>
		<Page size="A4" orientation="landscape" style={styles.page}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Image style={styles.logo} src="/api/placeholder/80/80" />
				</View>
				<View style={[styles.headerCenter, { width: '60%' }]}>
					<Text style={styles.institutionName}>{dadosInstituicao.nome}</Text>
					<Text style={{ fontSize: 12 }}>
						{dadosInstituicao.endereco} | {dadosInstituicao.contactos}
					</Text>
				</View>
				<View style={styles.headerRight}>
					<Text style={{ fontSize: 10 }}>Nº: {dadosAluno.numero}</Text>
					<Text style={{ fontSize: 10 }}>
						Data: {enrollmentDate.toLocaleDateString('pt-PT')}
					</Text>
				</View>
			</View>

			<Text style={styles.documentTitle}>COMPROVATIVO DE MATRÍCULA</Text>
			<Text style={styles.documentDescribe}>
				Confirma-se que o(a) aluno(a) {dadosAluno.nomeCompleto}, com o número{' '}
				{dadosAluno.numero}, matriculou-se na {dadosAluno.classe}, turma{' '}
				{dadosAluno.turma}, sala {dadosAluno.sala}, período Manhã, no ano letivo{' '}
				{dadosAluno.anoLetivo}.
			</Text>

			{/* Student Information */}
			<View style={styles.studentInfo}>
				<Field label="NOME COMPLETO" value={dadosAluno.nomeCompleto} />
				<Field label="CLASSE" value={dadosAluno.classe} />
				<Field label="TURMA" value={dadosAluno.turma} />
				<Field label="SALA" value={dadosAluno.sala} />
				<Field label="ANO LETIVO" value={dadosAluno.anoLetivo} />
				<Field label="NÚMERO" value={dadosAluno.numero} />
				<Field label="CONTATO" value={dadosAluno.contato} />
				<Field label="EMAIL" value={dadosAluno.email} />
				<Field label="FILIAÇÃO" value={dadosAluno.filiacao} />
			</View>

			<View style={styles.footer}>
				<View style={styles.signatures}>
					<View style={styles.signature}>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureText}>O(A) Director(a)</Text>
					</View>
					<View style={styles.signature}>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureText}>
							O(A) Encarregado(a) de Educação
						</Text>
					</View>
					<View style={styles.signature}>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureText}>O(A) Aluno(a)</Text>
					</View>
				</View>
			</View>
		</Page>
	</Document>
);

function GenerateEnrollmentConfirmation() {
	const dadosInstituicao = {
		nome: 'INSTITUTO EXAMPLE',
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
		contato: '+244 923 456 789',
		email: 'ana.silva@email.com',
		filiacao: 'João da Silva e Maria Fernandes',
	};

	const enrollmentDate = new Date();

	const generatePDF = async () => {
		const blob = await pdf(
			<EnrollmentConfirmation
				dadosInstituicao={dadosInstituicao}
				dadosAluno={dadosAluno}
				enrollmentDate={enrollmentDate}
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

export default GenerateEnrollmentConfirmation;
