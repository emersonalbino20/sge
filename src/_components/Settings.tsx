import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Mail,
  Palette,
  Shield,
  User,
  Building,
  Calendar,
  FileCog,
  Printer,
  Globe,
} from 'lucide-react';
import Header from './Header';

const Settings = () => {
  return (
    <>
      <section className="m-0 w-screen h-screen  bg-gray-50">
        <Header />
        <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-blue-700">
              Configurações do Sistema
            </h1>
            <p className="text-gray-500">
              Gerencie suas preferências e configurações do sistema
            </p>
          </div>

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger
                value="personal"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Preferências Pessoais
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Notificações
              </TabsTrigger>
              <TabsTrigger
                value="school"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Dados da Escola
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Sistema
              </TabsTrigger>
            </TabsList>

            {/* Preferências Pessoais */}
            <TabsContent value="personal">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Interface e Aparência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Tema Escuro</div>
                        <div className="text-sm text-gray-500">
                          Ative o modo escuro do sistema
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Idioma do Sistema</label>
                      <Select defaultValue="pt-BR">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">
                            Português (Brasil)
                          </SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Segurança
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium">
                        Autenticação em Duas Etapas
                      </label>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Aumenta a segurança da sua conta
                        </div>
                        <Switch />
                      </div>
                    </div>
                    <Button variant="outline">Alterar Senha</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notificações */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Preferências de Notificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Notificações por E-mail</div>
                      <div className="text-sm text-gray-500">
                        Receba atualizações importantes por email
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium">Tipos de Notificação</h3>
                    <div className="flex items-center justify-between">
                      <div>Novas mensagens</div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Atualizações do sistema</div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Alertas financeiros</div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Ocorrências disciplinares</div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dados da Escola */}
            <TabsContent value="school">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Informações da Instituição
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium">Nome da Escola</label>
                      <Input defaultValue="Escola Modelo" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">CNPJ</label>
                      <Input defaultValue="00.000.000/0001-00" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Endereço</label>
                      <Input defaultValue="Rua da Escola, 123" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Telefone</label>
                      <Input defaultValue="(11) 1234-5678" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Calendário e Horários
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium">Fuso Horário</label>
                      <Select defaultValue="america-sp">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america-sp">
                            América/São Paulo
                          </SelectItem>
                          <SelectItem value="america-rj">
                            América/Rio de Janeiro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Formato de Data</label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sistema */}
            <TabsContent value="system">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCog className="w-5 h-5" />
                      Configurações do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Backup Automático</div>
                        <div className="text-sm text-gray-500">
                          Realiza backup diário dos dados
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Log de Atividades</div>
                        <div className="text-sm text-gray-500">
                          Registra ações importantes do sistema
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Retenção de Logs</label>
                      <Select defaultValue="90">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Printer className="w-5 h-5" />
                      Relatórios e Impressões
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium">
                        Formato Padrão de Exportação
                      </label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Cabeçalho Personalizado
                        </div>
                        <div className="text-sm text-gray-500">
                          Inclui logo da escola nos relatórios
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default Settings;
