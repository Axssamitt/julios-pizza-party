
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, FileText } from 'lucide-react';
import { FormularioManager } from '@/components/FormularioManager';
import { ContratoManager } from '@/components/ContratoManager';

interface AdminUser {
  id: string;
  email: string;
  nome: string;
}

const Dashboard = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = localStorage.getItem('admin_user');
    if (adminData) {
      try {
        const user = JSON.parse(adminData);
        setAdminUser(user);
      } catch (error) {
        console.error('Erro ao recuperar dados do admin:', error);
        localStorage.removeItem('admin_user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    navigate('/login');
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
              <img 
                src="https://storage.googleapis.com/wzukusers/user-34847409/images/5cf9a50e698b6eDiLZd7/logoo_d200.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Júlio's Pizza House - Painel Admin</h1>
              <p className="text-gray-400 text-sm">{adminUser.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="mr-2" size={16} />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs defaultValue="orcamentos" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700 grid grid-cols-2 gap-1">
            <TabsTrigger value="orcamentos" className="data-[state=active]:bg-orange-600">
              <Users className="mr-2" size={16} />
              Orçamentos
            </TabsTrigger>
            <TabsTrigger value="contratos" className="data-[state=active]:bg-orange-600">
              <FileText className="mr-2" size={16} />
              Contratos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orcamentos">
            <FormularioManager />
          </TabsContent>

          <TabsContent value="contratos">
            <ContratoManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
