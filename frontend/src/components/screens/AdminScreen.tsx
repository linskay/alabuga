import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PyramidLoader from '../PyramidLoader';
import MainButton from '../MainButton';
import CosmicSwitch from '../CosmicSwitch';
import CardTsup from '../CardTsup';
import { backend, api, UserDTO } from '../../api';
import SystemNotification from '../SystemNotification';
import ShinyText from '../ShinyText';

const AdminScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crew' | 'missions' | 'analytics' | 'shop' | 'artifacts'>('crew');
  const [notif, setNotif] = useState<{ open: boolean; title: string; message?: string; variant?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, title: '' });

  const tabs = [
    { id: 'crew' as const, name: 'ЭКИПАЖ', color: 'from-blue-400 to-cyan-500' },
    { id: 'missions' as const, name: 'ЗАДАНИЯ', color: 'from-orange-400 to-red-500' },
    { id: 'analytics' as const, name: 'АНАЛИТИКА', color: 'from-purple-400 to-violet-500' },
    { id: 'shop' as const, name: 'МАГАЗИН', color: 'from-green-400 to-emerald-500' },
    { id: 'artifacts' as const, name: 'АРТЕФАКТЫ', color: 'from-sky-400 to-indigo-500' }
  ];

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<{value: string, displayName: string}[]>([]);
  const [search, setSearch] = useState<string>('');
  const [sortKey, setSortKey] = useState<'name' | 'email' | 'role' | 'level' | 'createdAt'>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  // Загрузка пользователей из бэкенда
  useEffect(() => {
    (async () => {
      try {
        const [list, rolesResp] = await Promise.all([backend.users.list(), backend.users.roles().catch(() => [])]);
        setRoles(rolesResp || []);
        setUsers((list as any[]).map((u: any) => ({ id: u.id, name: u.firstName || u.login, email: u.email, role: u.role, status: (u.isActive ? 'active' : 'inactive'), lastLogin: u.createdAt || '—', level: u.rank, createdAt: u.createdAt })));
      } catch (e) {
        setNotif({ open: true, title: 'Не удалось загрузить пользователей', variant: 'error' });
      }
    })();
  }, []);

  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const openEditUser = (u: any) => { setEditUser(u); setEditUserOpen(true); };
  const saveEditUser = async () => {
    if (!editUser?.id) return;
    try {
      const updated = await backend.users.update(editUser.id, { email: editUser.email, role: editUser.role, rank: editUser.level, experience: editUser.experience, energy: editUser.energy });
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, email: updated.email, role: updated.role, level: updated.rank } : u));
      setNotif({ open: true, title: 'Пользователь обновлён', variant: 'success' });
      setEditUserOpen(false);
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка обновления', message: e?.message || 'Не удалось обновить пользователя', variant: 'error' });
    }
  };

  const [editMissionOpen, setEditMissionOpen] = useState<any | null>(null);
  const [editMissionData, setEditMissionData] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number; name?: string }>({ open: false });
  const [assignOpen, setAssignOpen] = useState<{ open: boolean; missionId?: number }>({ open: false });
  const [assignEmail, setAssignEmail] = useState<string>('');
  const saveEditMission = async () => {
    if (!editMissionOpen?.id || !editMissionData) return;
    try {
      const updated = await backend.missions.update(editMissionOpen.id, editMissionData);
      setMissions(prev => prev.map(m => m.id === editMissionOpen.id ? updated : m));
      setNotif({ open: true, title: 'Миссия обновлена', variant: 'success' });
      setEditMissionOpen(null);
      setEditMissionData(null);
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка обновления миссии', message: e?.message || 'Не удалось обновить миссию', variant: 'error' });
    }
  };
  const handleDeleteMission = async (id: number) => {
    try {
      await backend.missions.delete(id);
      setMissions(prev => prev.filter(m => m.id !== id));
      setNotif({ open: true, title: 'Миссия удалена', variant: 'success' });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка удаления миссии', message: e?.message || 'Не удалось удалить миссию', variant: 'error' });
    }
  };
  const handleAssign = async () => {
    if (!assignOpen.missionId || !assignEmail) return setNotif({ open: true, title: 'Укажите email', variant: 'warning' });
    try {
      const user = await backend.users.byLogin(assignEmail).catch(async () => {
        // try by email endpoint if exists
        try { return await api.get<any>(`/api/users/email/${encodeURIComponent(assignEmail)}`); } catch { return null; }
      });
      if (!user?.id) throw new Error('Пользователь не найден');
      await backend.users.takeMission(user.id, assignOpen.missionId);
      setNotif({ open: true, title: 'Миссия назначена', message: `Пользователю ${assignEmail}`, variant: 'success' });
      setAssignOpen({ open: false });
      setAssignEmail('');
    } catch (e: any) {
      setNotif({ open: true, title: 'Не удалось назначить миссию', message: e?.message || String(e), variant: 'error' });
    }
  };
  const deleteUser = async (id: number) => {
    try {
      await backend.users.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setNotif({ open: true, title: 'Пользователь удалён', variant: 'success' });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка удаления', message: e?.message || 'Не удалось удалить пользователя', variant: 'error' });
    }
  };

  const [missions, setMissions] = useState<any[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [allCompetencies, setAllCompetencies] = useState<any[]>([]);
  const [artifactToggle, setArtifactToggle] = useState<boolean>(false);
  const [artifactList, setArtifactList] = useState<any[]>([]);
  const [selectedArtifactId, setSelectedArtifactId] = useState<number | null>(null);

  const analytics = [
    { title: 'Активные пользователи', value: '1,247', change: '+12%', color: 'from-green-400 to-emerald-500' },
    { title: 'Завершенные миссии', value: '3,456', change: '+8%', color: 'from-blue-400 to-cyan-500' },
    { title: 'Средний уровень', value: '42', change: '+5%', color: 'from-purple-400 to-violet-500' },
    { title: 'Время в системе', value: '2.4ч', change: '+15%', color: 'from-orange-400 to-red-500' }
  ];

  const [shopItems, setShopItems] = useState([
    { id: 1, name: 'Премиум подписка', price: 1000, currency: '⚡', category: 'subscription', status: 'active', sales: 45 },
    { id: 2, name: 'Ускоритель опыта', price: 50, currency: '⚡', category: 'boost', status: 'active', sales: 127 },
    { id: 3, name: 'Космический костюм', price: 500, currency: '⚡', category: 'cosmetic', status: 'inactive', sales: 23 }
  ]);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<{ name: string; price: number; available: boolean; description?: string }>({ name: '', price: 0, available: true });
  const handleAddProduct = async () => {
    if (!newProduct.name) return setNotif({ open: true, title: 'Введите название товара', variant: 'warning' });
    try {
      const created = await backend.shop.create({ name: newProduct.name, price: newProduct.price, available: newProduct.available, description: newProduct.description });
      setShopItems(prev => [{ id: created.id || Math.max(0, ...prev.map(s => s.id)) + 1, name: created.name || newProduct.name, price: created.price ?? newProduct.price, currency: '⚡', category: 'other', status: created.available ? 'active' : 'inactive', sales: 0 }, ...prev]);
      setNotif({ open: true, title: 'Товар добавлен', variant: 'success' });
      setAddProductOpen(false);
      setNewProduct({ name: '', price: 0, available: true });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка добавления товара', message: e?.message || 'Не удалось добавить товар', variant: 'error' });
    }
  };

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ login: '', email: '', password: '', role: 'USER', experience: 0, energy: 100, rank: 1 });
  const handleAddUser = async () => {
    if (!newUser.login) return setNotif({ open: true, title: 'Заполните логин', variant: 'warning' });
    try {
      const body = { ...newUser, firstName: newUser.login, lastName: 'User' } as any;
      const created = await backend.users.create(body);
      setUsers(prev => [{ id: created.id || Math.max(0, ...prev.map(u => u.id)) + 1, name: created.firstName || newUser.login, email: created.email || newUser.email, role: created.role || 'User', status: 'active', lastLogin: 'только что', level: created.rank ?? 0 }, ...prev]);
      setNotif({ open: true, title: 'Пользователь создан', message: `Создан ${newUser.login}`, variant: 'success' });
      setAddUserOpen(false);
      setNewUser({ login: '', email: '', password: '', role: 'USER', experience: 0, energy: 100, rank: 0 });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка создания', message: e?.message || String(e), variant: 'error' });
    }
  };

  const [createMissionOpen, setCreateMissionOpen] = useState(false);
  const [createMission, setCreateMission] = useState<any>({ name: '', description: '', difficulty: 'EASY', experienceReward: 0, energyReward: 0, isActive: true, requiredCompetencies: '', requiredExperience: 0, requiredRank: 1 });
  const handleCreateMission = async () => {
    if (!createMission.name) return setNotif({ open: true, title: 'Введите название миссии', variant: 'warning' });
    try {
      const created = await backend.missions.create({ ...createMission, branchId: 1, type: createMission.type || 'QUEST' });
      setMissions(prev => [{ id: created.id, name: created.name || createMission.name, description: created.description || createMission.description, difficulty: created.difficulty || createMission.difficulty, isActive: created.isActive ?? true, experienceReward: created.experienceReward ?? createMission.experienceReward }, ...prev]);
      setNotif({ open: true, title: 'Миссия создана', message: `«${createMission.name}» добавлена`, variant: 'success' });
      setCreateMissionOpen(false);
      setCreateMission({ name: '', description: '', difficulty: 'EASY', experienceReward: 0, isActive: true });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка создания миссии', message: e?.message || String(e), variant: 'error' });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoadingMissions(true);
      try {
        const list = await backend.missions.list();
        setMissions(list);
        const [comps, arts] = await Promise.all([
          backend.competencies.list().catch((e) => {
            console.error('Ошибка загрузки компетенций:', e);
            return [];
          }),
          backend.artifacts.list().catch((e) => {
            console.error('Ошибка загрузки артефактов:', e);
            return [];
          })
        ]);
        console.log('Загружены компетенции:', comps);
        console.log('Загружены артефакты:', arts);
        setAllCompetencies(comps || []);
        setArtifactList(arts || []);
      } catch (e) {
        setNotif({ open: true, title: 'Не удалось загрузить миссии', variant: 'error' });
      } finally {
        setLoadingMissions(false);
      }
    };
    load();
  }, []);

  const handleEditShopItem = async (id: number) => {
    const item = shopItems.find(s => s.id === id);
    if (!item) return;
    const newPriceStr = window.prompt(`Новая цена для «${item.name}»:`, String(item.price));
    if (!newPriceStr) return;
    const newPrice = Number(newPriceStr);
    if (Number.isNaN(newPrice)) return alert('Некорректная цена');
    try {
      const updated = await backend.shop.update(id, { price: newPrice });
      setShopItems(prev => prev.map(s => s.id === id ? { ...s, price: updated.price ?? newPrice } : s));
      setNotif({ open: true, title: 'Товар обновлён', message: `${item.name}: новая цена ${newPrice}`, variant: 'success' });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка обновления товара', message: e?.message || String(e), variant: 'error' });
    }
  };

  const filteredSortedUsers = users
    .filter(u => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (String(u.id) || '').includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      switch (sortKey) {
        case 'email': return (a.email || '').localeCompare(b.email || '') * dir;
        case 'role': return (String(a.role) || '').localeCompare(String(b.role) || '') * dir;
        case 'level': return ((a.level ?? 0) - (b.level ?? 0)) * dir;
        case 'createdAt': return (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()) * dir;
        default: return (a.name || '').localeCompare(b.name || '') * dir;
      }
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(v => !v); else { setSortKey(key); setSortAsc(true); }
  };

  const renderCrewTab = () => (
    <div className="space-y-6">
      {/* User Management */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white"><ShinyText text="УПРАВЛЕНИЕ ЭКИПАЖЕМ" className="text-2xl font-bold" /></div>
          <MainButton
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
            onClick={() => setAddUserOpen(true)}
          >
            Добавить пользователя
          </MainButton>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <input className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400" placeholder="Поиск по имени, логину, email" value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <button onClick={() => toggleSort('name')} className={`px-2 py-1 border rounded ${sortKey==='name'?'border-white/50':'border-white/20'}`}>Имя {sortKey==='name'?(sortAsc?'↑':'↓'):''}</button>
            <button onClick={() => toggleSort('email')} className={`px-2 py-1 border rounded ${sortKey==='email'?'border-white/50':'border-white/20'}`}>Email {sortKey==='email'?(sortAsc?'↑':'↓'):''}</button>
            <button onClick={() => toggleSort('role')} className={`px-2 py-1 border rounded ${sortKey==='role'?'border-white/50':'border-white/20'}`}>Роль {sortKey==='role'?(sortAsc?'↑':'↓'):''}</button>
            <button onClick={() => toggleSort('level')} className={`px-2 py-1 border rounded ${sortKey==='level'?'border-white/50':'border-white/20'}`}>Ранг {sortKey==='level'?(sortAsc?'↑':'↓'):''}</button>
            <button onClick={() => toggleSort('createdAt')} className={`px-2 py-1 border rounded ${sortKey==='createdAt'?'border-white/50':'border-white/20'}`}>Первый вход {sortKey==='createdAt'?(sortAsc?'↑':'↓'):''}</button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredSortedUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="text-white font-semibold">{user.name}</h4>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>Ранг {user.level}</span>
                    <span>Первый вход: {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded text-xs ${
                  user.status === 'active' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'
                }`}>
                  {user.status === 'active' ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
                </div>
                <div className={`px-3 py-1 rounded text-xs bg-blue-500/30 text-blue-300`}>
                  {String(user.role)}
                </div>
                <div className="flex space-x-2">
                  <MainButton className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm hover:bg-white/20 transition-all duration-300" onClick={() => openEditUser(user)}>Редактировать</MainButton>
                  <MainButton
                    className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 text-sm hover:bg-red-500/30 transition-all duration-300"
                    onClick={() => setConfirmDelete({ open: true, id: user.id, name: user.name })}
                  >
                    Удалить
                  </MainButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMissionsTab = () => (
    <div className="space-y-6">
      {/* Mission Builder */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white"><ShinyText text="КОНСТРУКТОР МИССИЙ" className="text-2xl font-bold" /></div>
          <MainButton
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-400/25 transition-all duration-300"
            onClick={() => setCreateMissionOpen(true)}
          >
            Создать миссию
          </MainButton>
        </div>
        
        <div className="space-y-4">
          {loadingMissions && <div className="text-gray-300">Загрузка миссий...</div>}
          {missions.map((mission: any, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{mission.name}</h4>
                  <p className="text-gray-400 text-sm mb-2">{mission.description || '—'}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Сложность: {mission.difficulty || '—'}</span>
                    <span>Награда: {mission.experienceReward ?? 0} XP</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-xs ${mission.isActive ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'}`}>
                  {mission.isActive ? 'АКТИВНА' : 'НЕАКТИВНА'}
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm hover:bg-white/20 transition-all duration-300"
                  onClick={() => setEditMissionOpen(mission)}
                >
                  Редактировать
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 text-sm hover:bg-blue-500/30 transition-all duration-300"
                  onClick={() => setAssignOpen({ open: true, missionId: mission.id })}
                >
                  Назначить
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 text-sm hover:bg-red-500/30 transition-all duration-300"
                  onClick={() => handleDeleteMission(mission.id)}
                >
                  Удалить
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Overview with CardTsup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          >
            <CardTsup width="280px" height="200px">
              <div className="text-center p-4">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm mb-2">{stat.title}</div>
                <div className="text-green-400 text-xs">{stat.change} за месяц</div>
              </div>
            </CardTsup>
          </motion.div>
        ))}
      </div>

      {/* Charts with CardTsup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CardTsup width="100%" height="300px">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Активность пользователей
              </h3>
              <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">График активности</span>
              </div>
            </div>
          </CardTsup>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <CardTsup width="100%" height="300px">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Завершение миссий
              </h3>
              <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">График завершений</span>
              </div>
            </div>
          </CardTsup>
        </motion.div>
      </div>
    </div>
  );

  const renderShopTab = () => (
    <div className="space-y-6">
      {/* Shop Management */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white"><ShinyText text="МАГАЗИН" className="text-2xl font-bold" /></div>
          <MainButton className="px-4 py-2" onClick={() => setAddProductOpen(true)}>Добавить товар</MainButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <CardTsup width="100%" height="250px">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">🛍️</div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{item.name}</h4>
                        <div className="text-2xl font-bold text-green-400">
                          {item.price} {item.currency}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Продаж:</span>
                        <span className="text-white">{item.sales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Категория:</span>
                        <span className="text-white capitalize">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className={`px-3 py-1 rounded text-xs text-center ${
                      item.status === 'active' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'
                    }`}>
                      {item.status === 'active' ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs hover:bg-white/20 transition-all duration-300"
                        onClick={() => handleEditShopItem(item.id)}
                      >
                        Редактировать
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 text-xs hover:bg-blue-500/30 transition-all duration-300"
                      >
                        Статистика
                      </motion.button>
                    </div>
                  </div>
                </div>
              </CardTsup>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArtifactsTab = () => (
    <div className="space-y-6">
      {/* Artifacts Management */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white"><ShinyText text="АРТЕФАКТЫ" className="text-2xl font-bold" /></div>
          <MainButton className="px-4 py-2" onClick={async () => {
            const name = window.prompt('Название артефакта:');
            if (!name) return;
            try {
              const created = await backend.artifacts.create({ name });
              setArtifactList(prev => [{ id: created.id, name: created.name, active: created.active }, ...prev]);
              setNotif({ open: true, title: 'Артефакт создан', variant: 'success' });
            } catch (e: any) {
              setNotif({ open: true, title: 'Ошибка создания артефакта', message: e?.message || String(e), variant: 'error' });
            }
          }}>Добавить</MainButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifactList.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <CardTsup width="100%" height="220px">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">🔮</div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{item.name}</h4>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-3">
                        <span>Активен:</span>
                        <CosmicSwitch checked={!!item.active} onChange={async (v: boolean) => {
                          try {
                            const updated = await backend.artifacts.update(item.id, { active: v });
                            setArtifactList(prev => prev.map((a: any) => a.id === item.id ? { ...a, active: updated.active } : a));
                          } catch (e: any) {
                            setNotif({ open: true, title: 'Ошибка статуса артефакта', message: e?.message || String(e), variant: 'error' });
                          }
                        }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs hover:bg-white/20 transition-all duration-300"
                        onClick={async () => {
                          const name = window.prompt('Новое название артефакта:', item.name);
                          if (!name) return;
                          try {
                            const updated = await backend.artifacts.update(item.id, { name });
                            setArtifactList(prev => prev.map((a: any) => a.id === item.id ? { ...a, name: updated.name } : a));
                            setNotif({ open: true, title: 'Артефакт обновлён', variant: 'success' });
                          } catch (e: any) {
                            setNotif({ open: true, title: 'Ошибка обновления артефакта', message: e?.message || String(e), variant: 'error' });
                          }
                        }}
                      >
                        Редактировать
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 text-xs hover:bg-blue-500/30 transition-all duration-300"
                        onClick={async () => {
                          if (!window.confirm('Удалить артефакт?')) return;
                          try {
                            await backend.artifacts.delete(item.id);
                            setArtifactList(prev => prev.filter((a: any) => a.id !== item.id));
                            setNotif({ open: true, title: 'Артефакт удалён', variant: 'success' });
                          } catch (e: any) {
                            setNotif({ open: true, title: 'Ошибка удаления артефакта', message: e?.message || String(e), variant: 'error' });
                          }
                        }}
                      >
                        Удалить
                      </motion.button>
                    </div>
                  </div>
                </div>
              </CardTsup>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full pb-8 overflow-y-auto max-h-screen">

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex space-x-4 mb-8"
      >
        {tabs.map((tab) => (
          <MainButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-gray-400 bg-gray-400/10 shadow-lg shadow-gray-400/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-sm tracking-wider ${
                activeTab === tab.id ? 'text-gray-300' : 'text-white'
              }`}>
                {tab.name}
              </span>
            </div>
          </MainButton>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'crew' && renderCrewTab()}
        {activeTab === 'missions' && renderMissionsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'shop' && renderShopTab && renderShopTab()}
        {activeTab === 'artifacts' && renderArtifactsTab()}
      </motion.div>

      {/* Pyramid Loader Component */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-12 flex justify-end"
      >
        <PyramidLoader />
      </motion.div>

      <SystemNotification
        open={notif.open}
        title={notif.title}
        message={notif.message}
        variant={notif.variant}
        onClose={() => setNotif(prev => ({ ...prev, open: false }))}
        autoCloseMs={2500}
      />

      {/* Confirm delete user */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete({ open: false }) as any} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-red-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(239,68,68,0.25), inset 0 0 30px rgba(239,68,68,0.15)' }} />
            <h3 className="text-xl font-bold text-red-300 mb-2">Удалить пользователя?</h3>
            <p className="text-gray-300">Вы действительно хотите удалить {confirmDelete.name || 'пользователя'}? Это действие необратимо.</p>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setConfirmDelete({ open: false }) as any} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={async () => { await deleteUser(confirmDelete.id as number); setConfirmDelete({ open: false }) as any; }} className="px-4 py-2 rounded-md bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition">Удалить</button>
            </div>
          </div>
        </div>
      )}

      {/* Create mission modal */}
      {createMissionOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCreateMissionOpen(false)} />
          <div className="relative z-[210] w-[90%] max-w-xl rounded-2xl border border-orange-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(249,115,22,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(249,115,22,0.25), inset 0 0 30px rgba(249,115,22,0.15)' }} />
            <h3 className="text-xl font-bold text-orange-300 mb-4">Создать миссию</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm text-white/80 md:col-span-2">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" value={createMission.name} onChange={e => setCreateMission((v: any) => ({ ...v, name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80 md:col-span-2">Описание
                <textarea className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" rows={3} value={createMission.description} onChange={e => setCreateMission((v: any) => ({ ...v, description: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Тип
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={createMission.type || 'QUEST'} onChange={e => setCreateMission((v: any) => ({ ...v, type: e.target.value }))}>
                  <option value="QUEST" className="bg-slate-800 text-white">Квесты</option>
                  <option value="CHALLENGE" className="bg-slate-800 text-white">Рекрутинг</option>
                  <option value="TEST" className="bg-slate-800 text-white">Лекторий</option>
                  <option value="SIMULATION" className="bg-slate-800 text-white">Симулятор</option>
                </select>
              </label>
              <label className="text-sm text-white/80">Сложность
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={createMission.difficulty} onChange={e => setCreateMission((v: any) => ({ ...v, difficulty: e.target.value }))}>
                  <option value="EASY" className="bg-slate-800 text-white">EASY</option>
                  <option value="MEDIUM" className="bg-slate-800 text-white">MEDIUM</option>
                  <option value="HARD" className="bg-slate-800 text-white">HARD</option>
                  <option value="EXTREME" className="bg-slate-800 text-white">EXTREME</option>
                </select>
              </label>
              <label className="text-sm text-white/80">Награда (XP, очки ранга)
                <input type="number" min={0} className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" value={createMission.experienceReward} onChange={e => setCreateMission((v: any) => ({ ...v, experienceReward: Math.max(0, Number(e.target.value)) }))} />
              </label>
              <label className="text-sm text-white/80">Награда (Энергон)
                <input type="number" min={0} className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" value={createMission.energyReward} onChange={e => setCreateMission((v: any) => ({ ...v, energyReward: Math.max(0, Number(e.target.value)) }))} />
              </label>
              <label className="text-sm text-white/80">Требуемый ранг (≥1)
                <div className="relative">
                  <input type="number" min={1} className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" value={createMission.requiredRank} onChange={e => setCreateMission((v: any) => ({ ...v, requiredRank: Math.max(1, Number(e.target.value)) }))} />
                  <button 
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={(e) => {
                      const tooltip = document.createElement('div');
                      tooltip.className = 'fixed z-[300] bg-slate-900/95 border border-blue-400/30 rounded-lg p-4 max-w-md shadow-lg';
                      tooltip.innerHTML = `
                        <div class="text-blue-300 font-bold mb-2">Система рангов (нелинейная)</div>
                        <div class="text-sm text-gray-300 space-y-1">
                          <div><strong>0:</strong> Космо-Кадет (старт)</div>
                          <div><strong>1:</strong> Навигатор Траекторий (Аналитико-Техническая)</div>
                          <div><strong>2:</strong> Аналитик Орбит (Аналитико-Техническая)</div>
                          <div><strong>3:</strong> Архитектор Станции (Аналитико-Техническая)</div>
                          <div><strong>4:</strong> Хронист Галактики (Гуманитарно-Исследовательская)</div>
                          <div><strong>5:</strong> Исследователь Культур (Гуманитарно-Исследовательская)</div>
                          <div><strong>6:</strong> Мастер Лектория (Гуманитарно-Исследовательская)</div>
                          <div><strong>7:</strong> Связист Звёздного Флота (Коммуникационно-Лидерская)</div>
                          <div><strong>8:</strong> Штурман Экипажа (Коммуникационно-Лидерская)</div>
                          <div><strong>9:</strong> Командир Отряда (Коммуникационно-Лидерская)</div>
                          <div><strong>10:</strong> Хранитель Станции «Алабуга.TECH» (финальный)</div>
                        </div>
                        <button onclick="this.parentElement.remove()" class="mt-3 px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-200 rounded text-sm hover:bg-blue-500/30">Закрыть</button>
                      `;
                      document.body.appendChild(tooltip);
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
                      tooltip.style.top = `${rect.top}px`;
                    }}
                  >
                    ?
                  </button>
                </div>
              </label>
              <label className="text-sm text-white/80">Требуемый опыт (≥0)
                <input type="number" min={0} className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" value={createMission.requiredExperience} onChange={e => setCreateMission((v: any) => ({ ...v, requiredExperience: Math.max(0, Number(e.target.value)) }))} />
              </label>
              <label className="text-sm text-white/80 md:col-span-2">Требуемые навыки в компетенциях
                <div className="mt-1 space-y-2">
                  {allCompetencies?.length > 0 ? (
                    allCompetencies.map((c: any) => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-sm text-gray-300 w-32">{c.name}</span>
                        <input 
                          type="number" 
                          min={0} 
                          max={500}
                          className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm" 
                          placeholder="0"
                          onChange={e => setCreateMission((prev: any) => {
                            const points = Math.max(0, Math.min(500, Number(e.target.value)));
                            const list = Array.isArray(prev.requiredCompetencies) ? prev.requiredCompetencies.slice() : [];
                            const idx = list.findIndex((x: any) => x.competencyId === c.id);
                            if (points === 0) { 
                              if (idx >= 0) list.splice(idx, 1); 
                            } else if (idx >= 0) { 
                              list[idx] = { competencyId: c.id, requiredPoints: points };
                            } else { 
                              list.push({ competencyId: c.id, requiredPoints: points });
                            }
                            return { ...prev, requiredCompetencies: list };
                          })} 
                        />
                        <span className="text-xs text-gray-400">очков</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">Компетенции не загружены</div>
                  )}
                </div>
              </label>
              <div className="text-sm text-white/80 flex items-center gap-3">
                <span>Активна</span>
                <CosmicSwitch checked={!!createMission.isActive} onChange={(v: boolean) => setCreateMission((s: any) => ({ ...s, isActive: v }))} />
              </div>
              <div className="text-sm text-white/80 md:col-span-2 flex items-center gap-3">
                <span>Добавить артефакт</span>
                <CosmicSwitch checked={artifactToggle} onChange={(v: boolean) => setArtifactToggle(v)} />
              </div>
              {artifactToggle && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="text-sm text-white/80">Выбрать готовый
                    <select className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" value={selectedArtifactId ?? ''} onChange={e => setSelectedArtifactId(Number(e.target.value) || null)}>
                      <option value="">—</option>
                      {artifactList.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm text-white/80">Или создать новый (имя)
                    <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Название артефакта" onChange={e => setCreateMission((v: any) => ({ ...v, artifactName: e.target.value }))} />
                  </label>
                </div>
              )}
              {allCompetencies?.length > 0 && (
                <div className="md:col-span-2">
                  <div className="text-sm text-white/80 mb-2">Добавить очки в компетенции</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {allCompetencies.slice(0, 6).map((c: any) => (
                      <label key={c.id} className="text-sm text-white/80">
                        {c.name}
                        <input type="number" min={0} className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" onChange={e => setCreateMission((prev: any) => {
                          const points = Math.max(0, Number(e.target.value));
                          const list = Array.isArray(prev.competencyRewards) ? prev.competencyRewards.slice() : [];
                          const idx = list.findIndex((x: any) => x.id === c.id);
                          if (points === 0) { if (idx >= 0) list.splice(idx, 1); }
                          else if (idx >= 0) list[idx] = { id: c.id, points };
                          else list.push({ id: c.id, points });
                          return { ...prev, competencyRewards: list };
                        })} />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setCreateMissionOpen(false)} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleCreateMission} className="px-4 py-2 rounded-md bg-orange-500/20 border border-orange-400/40 text-orange-200 hover:bg-orange-500/30 transition">Создать</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign mission to user by email */}
      {assignOpen.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAssignOpen({ open: false })} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-blue-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(59,130,246,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(59,130,246,0.25), inset 0 0 30px rgba(59,130,246,0.15)' }} />
            <h3 className="text-xl font-bold text-blue-300 mb-4">Назначить миссию</h3>
            <label className="text-sm text-white/80 w-full">Email пользователя
              <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" value={assignEmail} onChange={e => setAssignEmail(e.target.value)} placeholder="user@example.com" />
            </label>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setAssignOpen({ open: false })} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleAssign} className="px-4 py-2 rounded-md bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition">Назначить</button>
            </div>
          </div>
        </div>
      )}

      {addUserOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAddUserOpen(false)} />
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-cyan-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
            <h3 className="text-xl font-bold text-cyan-300 mb-4">Добавить пользователя</h3>
            <div className="grid grid-cols-1 gap-3">
              <input className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400" placeholder="Логин" value={newUser.login} onChange={e => setNewUser(v => ({ ...v, login: e.target.value }))} />
              <input className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400" placeholder="Email" value={newUser.email} onChange={e => setNewUser(v => ({ ...v, email: e.target.value }))} />
              <input className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400" placeholder="Пароль" type="password" value={newUser.password} onChange={e => setNewUser(v => ({ ...v, password: e.target.value }))} />
              <div className="grid grid-cols-3 gap-3">
                <label className="text-sm text-white/80">Ранг (≥1)
                  <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400" placeholder="Ранг" type="number" min={1} value={newUser.rank} onChange={e => setNewUser(v => ({ ...v, rank: Math.max(1, Number(e.target.value)) }))} />
                </label>
                <label className="text-sm text-white/80">Опыт (≥0)
                  <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400" placeholder="Опыт" type="number" min={0} value={newUser.experience} onChange={e => setNewUser(v => ({ ...v, experience: Math.max(0, Number(e.target.value)) }))} />
                </label>
                <label className="text-sm text-white/80">Энергон (≥0)
                  <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400" placeholder="Энергон" type="number" min={0} value={newUser.energy} onChange={e => setNewUser(v => ({ ...v, energy: Math.max(0, Number(e.target.value)) }))} />
                </label>
              </div>
              <label className="text-sm text-white/80">Роль
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={newUser.role} onChange={e => setNewUser(v => ({ ...v, role: e.target.value }))}>
                  {(roles || []).map(r => (
                    <option key={r.value} value={r.value} className="bg-slate-800 text-white">{r.displayName}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setAddUserOpen(false)} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleAddUser} className="px-4 py-2 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 transition">Создать</button>
            </div>
          </div>
        </div>
      )}

      {editUserOpen && editUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditUserOpen(false)} />
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-cyan-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
            <h3 className="text-xl font-bold text-cyan-300 mb-4">Редактировать пользователя</h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm text-white/80">Email
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Email" value={editUser.email} onChange={e => setEditUser((v: any) => ({ ...v, email: e.target.value }))} />
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="text-sm text-white/80">Ранг
                  <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Ранг" type="number" min={1} value={editUser.level ?? 1} onChange={e => setEditUser((v: any) => ({ ...v, level: Math.max(1, Number(e.target.value)) }))} />
                </label>
                <label className="text-sm text-white/80">Опыт
                  <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Опыт" type="number" min={0} value={editUser.experience ?? 0} onChange={e => setEditUser((v: any) => ({ ...v, experience: Math.max(0, Number(e.target.value)) }))} />
                </label>
                <label className="text-sm text-white/80">Энергон
                  <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Энергон" type="number" min={0} value={editUser.energy ?? 0} onChange={e => setEditUser((v: any) => ({ ...v, energy: Math.max(0, Number(e.target.value)) }))} />
                </label>
              </div>
              <label className="text-sm text-white/80">Роль
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={editUser.role} onChange={e => setEditUser((v: any) => ({ ...v, role: e.target.value }))}>
                  {(roles || []).map(r => (
                    <option key={r.value} value={r.value} className="bg-slate-800 text-white">{r.displayName}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setEditUserOpen(false)} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={saveEditUser} className="px-4 py-2 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 transition">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {addProductOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAddProductOpen(false)} />
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-emerald-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(16,185,129,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(16,185,129,0.25), inset 0 0 30px rgba(16,185,129,0.15)' }} />
            <h3 className="text-xl font-bold text-emerald-300 mb-4">Добавить товар</h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm text-white/80">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Название" value={newProduct.name} onChange={e => setNewProduct(v => ({ ...v, name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Цена
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Цена" type="number" value={newProduct.price} onChange={e => setNewProduct(v => ({ ...v, price: Number(e.target.value) }))} />
              </label>
              <label className="text-sm text-white/80">Описание
                <textarea className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Описание" value={newProduct.description || ''} onChange={e => setNewProduct(v => ({ ...v, description: e.target.value }))} />
              </label>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span>Доступен</span>
                <CosmicSwitch checked={!!newProduct.available} onChange={(v: boolean) => setNewProduct((s: any) => ({ ...s, available: v }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setAddProductOpen(false)} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleAddProduct} className="px-4 py-2 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30 transition">Добавить</button>
            </div>
          </div>
        </div>
      )}

      {editMissionOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setEditMissionOpen(null); setEditMissionData(null); }} />
          <div className="relative z-[210] w-[90%] max-w-xl rounded-2xl border border-orange-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(249,115,22,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(249,115,22,0.25), inset 0 0 30px rgba(249,115,22,0.15)' }} />
            <h3 className="text-xl font-bold text-orange-300 mb-4">Редактировать миссию</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm text-white/80 md:col-span-2">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.name || ''} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80 md:col-span-2">Описание
                <textarea className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" rows={3} defaultValue={editMissionOpen?.description || ''} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), description: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Сложность
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.difficulty || ''} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), difficulty: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Награда (XP)
                <input type="number" className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.experienceReward ?? 0} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), experienceReward: Number(e.target.value) }))} />
              </label>
              <label className="text-sm text-white/80">Требуемый ранг
                <input type="number" className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.requiredRank ?? 0} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), requiredRank: Number(e.target.value) }))} />
              </label>
              <label className="text-sm text-white/80">Требуемый опыт
                <input type="number" className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.requiredExperience ?? 0} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), requiredExperience: Number(e.target.value) }))} />
              </label>
              <div className="text-sm text-white/80 flex items-center gap-3">
                <span>Активна</span>
                <CosmicSwitch checked={!!editMissionOpen?.isActive} onChange={(v: boolean) => setEditMissionData((s: any) => ({ ...(s||{}), isActive: v }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => { setEditMissionOpen(null); setEditMissionData(null); }} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={saveEditMission} className="px-4 py-2 rounded-md bg-orange-500/20 border border-orange-400/40 text-orange-200 hover:bg-orange-500/30 transition">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScreen;
 
