import * as React from 'react';
import { useState } from 'react'
import {
  Search,
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  Building2,
  ClipboardList,
  FilterX,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../components/ui/select";

const ConsultasAcademicas = () => {
  const [anoLetivo, setAnoLetivo] = useState('2024');
  const [turma, setTurma] = useState('');
  const [disciplina, setDisciplina] = useState('');

  const resetFilters = () => {
    setAnoLetivo('2024');
    setTurma('');
    setDisciplina('');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consultas Acadêmicas
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="professores" className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <TabsTrigger value="professores" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Professores
              </TabsTrigger>
              <TabsTrigger value="matriculas" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Matrículas
              </TabsTrigger>
              <TabsTrigger value="turmas" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Turmas
              </TabsTrigger>
              <TabsTrigger value="horarios" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Horários
              </TabsTrigger>
            </TabsList>

            {/* Filtros Comuns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <Select value={anoLetivo} onValueChange={setAnoLetivo}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano Letivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>

              <Select value={turma} onValueChange={setTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10A">10ª A</SelectItem>
                  <SelectItem value="10B">10ª B</SelectItem>
                  <SelectItem value="11A">11ª A</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Select value={disciplina} onValueChange={setDisciplina}>
                  <SelectTrigger>
                    <SelectValue placeholder="Disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                  </SelectContent>
                </Select>
                
                <button
                  onClick={resetFilters}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                  title="Limpar filtros"
                >
                  <FilterX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo das Tabs */}
            <TabsContent value="professores" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consulta de Professores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <BookOpen className="h-5 w-5" />
                        Professores por Disciplina
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Visualizar todos os professores que lecionam uma disciplina específica
                      </p>
                    </button>

                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <Building2 className="h-5 w-5" />
                        Professores por Turma
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Consultar professores designados para cada turma
                      </p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="matriculas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Matrículas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="h-5 w-5" />
                        Matrículas por Ano Letivo
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Visualizar matrículas de anos anteriores
                      </p>
                    </button>

                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <Users className="h-5 w-5" />
                        Matrículas por Turma
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Consultar alunos matriculados em cada turma
                      </p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="turmas">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações de Turmas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <Users className="h-5 w-5" />
                        Alunos por Turma
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Lista completa de alunos em cada turma
                      </p>
                    </button>

                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <BookOpen className="h-5 w-5" />
                        Grade Curricular
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Disciplinas lecionadas em cada turma
                      </p>
                    </button>

                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <GraduationCap className="h-5 w-5" />
                        Corpo Docente
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Professores designados para a turma
                      </p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="horarios">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consulta de Horários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <Users className="h-5 w-5" />
                        Horário por Turma
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Visualizar grade horária de cada turma
                      </p>
                    </button>

                    <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <GraduationCap className="h-5 w-5" />
                        Horário dos Professores
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Consultar horário de aulas por professor
                      </p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultasAcademicas;