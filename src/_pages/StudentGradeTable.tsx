import { useState } from 'react';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Save, Trash2 } from 'lucide-react';

const StudentGradeTable = () => {
  const [students, setStudents] = useState([
    { id: 1, fullName: 'João Silva', subject: 'Matemática', grade: 85.5 },
    { id: 2, fullName: 'Maria Oliveira', subject: 'Português', grade: 92.1 },
    { id: 3, fullName: 'Pedro Almeida', subject: 'Ciências', grade: 78.3 },
    { id: 4, fullName: 'Ana Cardoso', subject: 'História', grade: 88.7 },
    { id: 5, fullName: 'Lucas Fernandes', subject: 'Geografia', grade: 82.4 },
    { id: 6, fullName: 'Isabela Santos', subject: 'Inglês', grade: null },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  const handleGradeChange = (studentId, newGrade) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, grade: newGrade } : student
      )
    );
  };

  const handleSaveGrade = (studentId) => {
    setEditingStudent(null);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== studentId)
    );
  };

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Student Grade Management</CardTitle>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-4"
          />
          <Button className="mr-2">
            <Search />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-left">ID</th>
                <th className="p-2 border text-left">Nome Completo</th>
                <th className="p-2 border text-left">Disciplina</th>
                <th className="p-2 border text-right">Nota</th>
                <th className="p-2 border text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="p-2 border">{student.id}</td>
                  <td className="p-2 border">{student.fullName}</td>
                  <td className="p-2 border">{student.subject}</td>
                  <td
                    className="p-2 border text-right"
                    style={{
                      backgroundColor:
                        student.grade !== null
                          ? student.grade >= 90
                            ? '#dff0d8'
                            : student.grade >= 80
                            ? '#f2dede'
                            : '#fcf8e3'
                          : 'transparent',
                      color:
                        student.grade !== null
                          ? student.grade >= 90
                            ? '#3c763d'
                            : student.grade >= 80
                            ? '#a94442'
                            : '#8a6d3b'
                          : 'inherit',
                    }}
                  >
                    {editingStudent?.id === student.id ? (
                      <Input
                        type="number"
                        value={student.grade || ''}
                        onChange={(e) =>
                          handleGradeChange(
                            student.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-20 text-right"
                      />
                    ) : student.grade !== null ? (
                      student.grade.toFixed(2)
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {editingStudent?.id === student.id ? (
                      <>
                        <Button
                          className="mr-2"
                          onClick={() => handleSaveGrade(student.id)}
                        >
                          <Save />
                        </Button>
                        <Button
                          className="mr-2"
                          onClick={() => setEditingStudent(student)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="mr-2"
                          onClick={() => setEditingStudent(student)}
                        >
                          <Edit />
                        </Button>
                        {/*
												<Button
													className="mr-2"
													onClick={() => handleDeleteStudent(student.id)}
												>
													<Trash2 />
										</Button>*/}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentGradeTable;
