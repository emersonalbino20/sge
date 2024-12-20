import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SchoolStatistics = () => {
  // Dados de desempenho ao longo do ano
  const performanceData = [
    { month: 'Jan', matematica: 7.5, portugues: 7.8, ciencias: 8.2 },
    { month: 'Fev', matematica: 7.2, portugues: 7.5, ciencias: 7.8 },
    { month: 'Mar', matematica: 7.8, portugues: 7.9, ciencias: 8.0 },
    { month: 'Abr', matematica: 7.4, portugues: 8.1, ciencias: 8.3 },
    { month: 'Mai', matematica: 7.9, portugues: 8.0, ciencias: 8.1 },
    { month: 'Jun', matematica: 8.1, portugues: 8.2, ciencias: 8.4 },
  ];

  // Dados de frequência por série
  const attendanceData = [
    { serie: '1º Ano', presenca: 92 },
    { serie: '2º Ano', presenca: 94 },
    { serie: '3º Ano', presenca: 89 },
    { serie: '4º Ano', presenca: 91 },
    { serie: '5º Ano', presenca: 93 },
  ];

  // Dados de distribuição de notas
  const gradeDistribution = [
    { name: 'Abaixo da Média', value: 15, color: '#ef4444' },
    { name: 'Na Média', value: 45, color: '#f59e0b' },
    { name: 'Acima da Média', value: 40, color: '#22c55e' },
  ];

  // Dados de inadimplência mensal
  const financialData = [
    { month: 'Jan', taxa: 5 },
    { month: 'Fev', taxa: 4 },
    { month: 'Mar', taxa: 6 },
    { month: 'Abr', taxa: 4 },
    { month: 'Mai', taxa: 3 },
    { month: 'Jun', taxa: 5 },
  ];

  return (
    <div className="w-full p-4 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Dashboard de Estatísticas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Desempenho */}
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">
              Desempenho por Disciplina
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="matematica"
                    stroke="#2563eb"
                    name="Matemática"
                  />
                  <Line
                    type="monotone"
                    dataKey="portugues"
                    stroke="#7c3aed"
                    name="Português"
                  />
                  <Line
                    type="monotone"
                    dataKey="ciencias"
                    stroke="#059669"
                    name="Ciências"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Frequência */}
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">
              Frequência por Série
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="serie" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar
                    dataKey="presenca"
                    fill="#3b82f6"
                    name="Taxa de Presença (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Notas */}
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">
              Distribuição de Notas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Inadimplência */}
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">
              Taxa de Inadimplência (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={'month'} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="taxa"
                    stroke="#dc2626"
                    name="Taxa de Inadimplência"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolStatistics;
