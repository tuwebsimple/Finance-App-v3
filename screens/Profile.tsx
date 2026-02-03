import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { UserProfile } from '../types';

const COLORS = [
  { bg: 'bg-pink-500', text: 'text-pink-500', name: 'Rosa' },
  { bg: 'bg-blue-500', text: 'text-blue-500', name: 'Azul' },
  { bg: 'bg-purple-500', text: 'text-purple-500', name: 'Morado' },
  { bg: 'bg-green-500', text: 'text-green-500', name: 'Verde' },
  { bg: 'bg-orange-500', text: 'text-orange-500', name: 'Naranja' },
  { bg: 'bg-indigo-500', text: 'text-indigo-500', name: 'Índigo' },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await StorageService.getUsers();
      setUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleUpdateUser = (index: number, field: keyof UserProfile, value: string) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    
    // If updating color, also update text color automatically for simplicity if picking from palette
    if (field === 'color') {
        const selectedColor = COLORS.find(c => c.bg === value);
        if (selectedColor) {
            newUsers[index].textColor = selectedColor.text;
        }
    }
    
    setUsers(newUsers);
  };

  const handleSave = async () => {
    setSaving(true);
    await StorageService.saveUsers(users);
    setSaving(false);
    // Show feedback or just stay
    alert("¡Cambios guardados exitosamente!");
  };

  const handleLogout = () => {
      navigate('/');
  };

  if (loading) return null;

  return (
    <div className="pb-32 pt-8 px-5 min-h-screen relative">
       {/* Background */}
       <div className="fixed top-[-10%] right-[20%] w-[400px] h-[400px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-[-1]"></div>
       <div className="fixed bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-[-1]"></div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
          <p className="text-sm text-gray-500">Configuración de usuarios</p>
        </div>
      </header>

      <div className="space-y-6">
        {/* User Cards */}
        {users.map((user, index) => (
            <div key={user.id} className="glass-panel p-6 rounded-[2rem] border border-white/60 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 ${user.color} opacity-10 rounded-bl-[4rem]`}></div>
                
                <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4">Usuario {index + 1}</h3>
                
                <div className="flex gap-4 items-center mb-6">
                    <div className={`w-16 h-16 rounded-full ${user.color} flex items-center justify-center text-white shadow-lg`}>
                        <span className="text-2xl font-bold">{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-400 mb-1 block">Nombre</label>
                        <input 
                            type="text" 
                            value={user.name}
                            onChange={(e) => handleUpdateUser(index, 'name', e.target.value)}
                            className="w-full bg-white/50 border border-white/40 rounded-xl px-4 py-2 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">Color de Identidad</label>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                        {COLORS.map((c) => (
                            <button
                                key={c.bg}
                                onClick={() => handleUpdateUser(index, 'color', c.bg)}
                                className={`w-10 h-10 rounded-full ${c.bg} flex-shrink-0 transition-transform ${user.color === c.bg ? 'ring-4 ring-white shadow-lg scale-110' : 'opacity-40 hover:opacity-100'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        ))}

        {/* Save Button */}
        <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
        >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
            {!saving && <span className="material-icons-round">save</span>}
        </button>

        <div className="h-px bg-gray-200 w-full my-6"></div>

        {/* Settings / Logout */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/60">
             <button className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                         <span className="material-icons-round">cloud_download</span>
                    </div>
                    <span className="font-bold text-gray-700">Exportar Datos (CSV)</span>
                </div>
                <span className="material-icons-round text-gray-400">chevron_right</span>
             </button>
             
             <button onClick={handleLogout} className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-100 transition-colors">
                         <span className="material-icons-round">logout</span>
                    </div>
                    <span className="font-bold text-red-600">Cerrar Sesión</span>
                </div>
             </button>
        </div>

        <div className="text-center text-xs text-gray-400 font-medium pb-8">
            Versión 1.0.2 • Finanzas Pro
        </div>
      </div>
    </div>
  );
};

export default Profile;