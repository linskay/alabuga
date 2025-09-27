import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PyramidLoader from '../PyramidLoader';
import MainButton from '../MainButton';
import NeonSwitch from '../NeonSwitch';
import CardTsup from '../CardTsup';
import { backend, api, UserDTO } from '../../api';
import SystemNotification from '../SystemNotification';
import ShinyText from '../ShinyText';
import Energon from '../Energon';

const AdminScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crew' | 'missions' | 'analytics' | 'shop' | 'artifacts'>('crew');
  const [notif, setNotif] = useState<{ open: boolean; title: string; message?: string; variant?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, title: '' });

  // Универсальная функция для обработки ошибок
  const getErrorMessage = (e: any): string => {
    if (e?.response?.data?.message) {
      // Ошибка от бекенда с полем message
      return e.response.data.message;
    } else if (e?.message) {
      // Ошибка JavaScript
      return e.message;
    } else if (typeof e === 'string') {
      // Строковая ошибка
      return e;
    }
    return 'Неизвестная ошибка';
  };

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
  const [sortKey, setSortKey] = useState<'name' | 'email' | 'role' | 'level' | 'createdAt' | 'isActive'>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  
  // Mission search and sort states
  const [missionSearch, setMissionSearch] = useState<string>('');
  const [missionSortKey, setMissionSortKey] = useState<'name' | 'createdAt' | 'difficulty' | 'isActive'>('name');
  const [missionSortAsc, setMissionSortAsc] = useState<boolean>(true);
  
  // Shop search and sort states
  const [shopSearch, setShopSearch] = useState<string>('');
  const [shopSortKey, setShopSortKey] = useState<'name' | 'price' | 'status'>('name');
  const [shopSortAsc, setShopSortAsc] = useState<boolean>(true);
  
  // Artifact search and sort states
  const [artifactSearch, setArtifactSearch] = useState<string>('');
  const [artifactSortKey, setArtifactSortKey] = useState<'name' | 'rarity' | 'createdAt' | 'isActive'>('name');
  const [artifactSortAsc, setArtifactSortAsc] = useState<boolean>(true);
  // Загрузка пользователей из бэкенда
  useEffect(() => {
    (async () => {
      try {
        const [list, rolesResp, shopItemsResp] = await Promise.all([
          backend.users.list(), 
          backend.users.roles().catch(() => []),
          backend.shop.list().catch(() => [])
        ]);
        setRoles(rolesResp || []);
        setUsers((list as any[]).map((u: any) => ({ id: u.id, name: u.firstName || u.login, email: u.email, role: u.role, status: (u.isActive ? 'active' : 'inactive'), lastLogin: u.createdAt || '—', level: u.rank, createdAt: u.createdAt })));
        setShopItems(shopItemsResp || []);
      } catch (e) {
        setNotif({ open: true, title: 'Не удалось загрузить данные', variant: 'error' });
      }
    })();
  }, []);

  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [userBranches, setUserBranches] = useState<any[]>([]);
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [showUserMissions, setShowUserMissions] = useState(false);
  const [confirmCompleteMission, setConfirmCompleteMission] = useState<{ open: boolean; missionId?: number; missionName?: string; title?: string; message?: string }>({ open: false });
  const [confirmRemoveMission, setConfirmRemoveMission] = useState<{ open: boolean; missionId?: number; missionName?: string; title?: string; message?: string }>({ open: false });
  // Функции для получения сообщений подтверждения с бекенда
  const openDeleteUserConfirm = async (user: any) => {
    try {
      const confirmation = await backend.messages.deleteUser(user.id);
      setConfirmDelete({ 
        open: true, 
        id: user.id, 
        name: user.name,
        title: confirmation.title,
        message: confirmation.message
      });
    } catch (e: any) {
      console.warn('Не удалось получить сообщение подтверждения:', e?.message);
      setConfirmDelete({ 
        open: true, 
        id: user.id, 
        name: user.name,
        title: 'Удаление пользователя',
        message: `Вы уверены, что хотите удалить пользователя «${user.name}»? Это действие нельзя отменить.`
      });
    }
  };

  const openDeleteArtifactConfirm = async (artifact: any) => {
    try {
      const confirmation = await backend.messages.deleteArtifact(artifact.id);
      setConfirmDeleteArtifact({ 
        open: true, 
        id: artifact.id, 
        name: artifact.name,
        title: confirmation.title,
        message: confirmation.message
      });
    } catch (e: any) {
      console.warn('Не удалось получить сообщение подтверждения:', e?.message);
      setConfirmDeleteArtifact({ 
        open: true, 
        id: artifact.id, 
        name: artifact.name,
        title: 'Удаление артефакта',
        message: `Вы уверены, что хотите удалить артефакт «${artifact.name}»? Это действие нельзя отменить.`
      });
    }
  };

  const openDeleteMissionConfirm = async (mission: any) => {
    try {
      const confirmation = await backend.messages.deleteMission(mission.id);
      setConfirmDeleteMission({ 
        open: true, 
        id: mission.id, 
        name: mission.name,
        title: confirmation.title,
        message: confirmation.message
      });
    } catch (e: any) {
      console.warn('Не удалось получить сообщение подтверждения:', e?.message);
      setConfirmDeleteMission({ 
        open: true, 
        id: mission.id, 
        name: mission.name,
        title: 'Удаление миссии',
        message: `Вы уверены, что хотите удалить миссию «${mission.name}»? Это действие нельзя отменить.`
      });
    }
  };

  const openCompleteMissionConfirm = async (mission: any) => {
    try {
      const confirmation = await backend.messages.completeMission(mission.missionId);
      setConfirmCompleteMission({ 
        open: true, 
        missionId: mission.missionId, 
        missionName: mission.missionName,
        title: confirmation.title,
        message: confirmation.message
      });
    } catch (e: any) {
      console.warn('Не удалось получить сообщение подтверждения:', e?.message);
      setConfirmCompleteMission({ 
        open: true, 
        missionId: mission.missionId, 
        missionName: mission.missionName,
        title: 'Выполнение миссии',
        message: `Вы действительно хотите пометить миссию «${mission.missionName}» как выполненную?`
      });
    }
  };

  const openRemoveMissionConfirm = async (mission: any, user: any) => {
    try {
      const confirmation = await backend.messages.removeMission(user.id, mission.missionId);
      setConfirmRemoveMission({ 
        open: true, 
        missionId: mission.missionId, 
        missionName: mission.missionName,
        title: confirmation.title,
        message: confirmation.message
      });
    } catch (e: any) {
      console.warn('Не удалось получить сообщение подтверждения:', e?.message);
      setConfirmRemoveMission({ 
        open: true, 
        missionId: mission.missionId, 
        missionName: mission.missionName,
        title: 'Удаление миссии у пользователя',
        message: `Вы уверены, что хотите удалить миссию «${mission.missionName}» у пользователя «${user.firstName} ${user.lastName}»? Это действие нельзя отменить.`
      });
    }
  };

  const openEditUser = async (u: any) => { 
    setEditUser(u); 
    setEditUserOpen(true);
    setShowUserMissions(false);
    
    // Загружаем ветки и миссии пользователя
    try {
      const [branches, missions] = await Promise.all([
        backend.branches.list().catch(() => []),
        backend.users.missions(u.id).catch(() => [])
      ]);
      setUserBranches(branches || []);
      setUserMissions(missions || []);
    } catch (e) {
      console.error('Ошибка загрузки данных пользователя:', e);
    }
  };
  const saveEditUser = async () => {
    if (!editUser?.id) return;
    try {
      const updated = await backend.users.update(editUser.id, { 
        email: editUser.email, 
        role: editUser.role, 
        rank: editUser.level, 
        experience: editUser.experience, 
        energy: editUser.energy,
        branchId: editUser.branchId
      });
      setUsers(prev => prev.map(u => u.id === editUser.id ? { 
        ...u, 
        email: updated.email, 
        role: updated.role, 
        level: updated.rank,
        branchId: updated.branchId
      } : u));
      setNotif({ open: true, title: 'Пользователь обновлён', message: 'Пользователь успешно обновлён', variant: 'success' });
      setEditUserOpen(false);
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка обновления', message: 'Не удалось обновить пользователя', variant: 'error' });
    }
  };

  // Функции для управления миссиями пользователя
  const markMissionCompleted = (missionId: number, missionName: string) => {
    // Находим миссию для получения данных
    const mission = userMissions.find(m => m.missionId === missionId);
    if (mission) {
      openCompleteMissionConfirm(mission);
    }
  };

  const confirmCompleteMissionAction = async () => {
    if (!confirmCompleteMission.missionId || !editUser?.id) return;
    try {
      // Используем missionId из UserMission, а не id самой UserMission
      const userMission = userMissions.find(m => m.id === confirmCompleteMission.missionId);
      if (!userMission) {
        setNotif({ open: true, title: 'Ошибка', message: 'Миссия не найдена', variant: 'error' });
        return;
      }
      
      await backend.users.completeMission(editUser.id, userMission.missionId);
      setUserMissions(prev => prev.map(m => 
        m.id === confirmCompleteMission.missionId ? { ...m, status: 'COMPLETED' } : m
      ));
      setNotif({ open: true, title: 'Миссия отмечена как выполненная', message: 'Миссия успешно отмечена как выполненная', variant: 'success' });
      setConfirmCompleteMission({ open: false });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка', message: getErrorMessage(e), variant: 'error' });
    }
  };

  const removeUserMission = (missionId: number, missionName: string) => {
    // Находим миссию для получения данных
    const mission = userMissions.find(m => m.missionId === missionId);
    if (mission && editUser) {
      openRemoveMissionConfirm(mission, editUser);
    }
  };

  const confirmRemoveMissionAction = async () => {
    if (!confirmRemoveMission.missionId || !editUser?.id) return;
    try {
      const userMission = userMissions.find(m => m.id === confirmRemoveMission.missionId);
      if (!userMission) {
        setNotif({ open: true, title: 'Ошибка', message: 'Миссия не найдена', variant: 'error' });
        return;
      }
      
      await backend.users.removeMission(editUser.id, userMission.missionId);
      setUserMissions(prev => prev.filter(m => m.id !== confirmRemoveMission.missionId));
      setNotif({ open: true, title: 'Миссия удалена у пользователя', message: 'Миссия успешно удалена у пользователя', variant: 'success' });
      setConfirmRemoveMission({ open: false });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка', message: getErrorMessage(e), variant: 'error' });
    }
  };

  const [editMissionOpen, setEditMissionOpen] = useState<any | null>(null);
  const [editMissionData, setEditMissionData] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number; name?: string; title?: string; message?: string }>({ open: false });
  const [confirmDeleteArtifact, setConfirmDeleteArtifact] = useState<{ open: boolean; id?: number; name?: string; title?: string; message?: string }>({ open: false });
  const [confirmDeleteMission, setConfirmDeleteMission] = useState<{ open: boolean; id?: number; name?: string; title?: string; message?: string }>({ open: false });
  const [assignOpen, setAssignOpen] = useState<{ open: boolean; missionId?: number }>({ open: false });
  const [assignEmail, setAssignEmail] = useState<string>('');
  const [assignUserSearch, setAssignUserSearch] = useState<string>('');
  const [assignUserResults, setAssignUserResults] = useState<any[]>([]);
  const [assignUserSelected, setAssignUserSelected] = useState<any>(null);
  const saveEditMission = async () => {
    if (!editMissionOpen?.id || !editMissionData) return;
    try {
      const updated = await backend.missions.update(editMissionOpen.id, editMissionData);
      setMissions(prev => prev.map(m => m.id === editMissionOpen.id ? updated : m));
      setNotif({ open: true, title: 'Миссия обновлена', message: 'Миссия успешно обновлена', variant: 'success' });
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
      setNotif({ open: true, title: 'Миссия удалена', message: 'Миссия успешно удалена', variant: 'success' });
      setConfirmDeleteMission({ open: false });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка удаления миссии', message: e?.message || 'Не удалось удалить миссию', variant: 'error' });
    }
  };
  const searchUsers = async (query: string) => {
    if (!query.trim()) return setAssignUserResults([]);
    try {
      const filtered = users.filter(u => 
        (u.name || '').toLowerCase().includes(query.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(query.toLowerCase()) ||
        (u.login || '').toLowerCase().includes(query.toLowerCase())
      );
      setAssignUserResults(filtered.slice(0, 5));
    } catch (e) {
      setAssignUserResults([]);
    }
  };

  const searchArtifactUsers = async (query: string) => {
    if (!query.trim()) return setAssignArtifactUserResults([]);
    try {
      const filtered = users.filter(u => 
        (u.name || '').toLowerCase().includes(query.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(query.toLowerCase()) ||
        (u.login || '').toLowerCase().includes(query.toLowerCase())
      );
      setAssignArtifactUserResults(filtered.slice(0, 5));
    } catch (e) {
      setAssignArtifactUserResults([]);
    }
  };

  const handleAssign = async () => {
    if (!assignOpen.missionId || !assignUserSelected) return setNotif({ open: true, title: 'Выберите пользователя', variant: 'warning' });
    try {
      await backend.users.takeMission(assignUserSelected.id, assignOpen.missionId);
      setNotif({ open: true, title: 'Миссия назначена', message: `Пользователю ${assignUserSelected.name || assignUserSelected.email}`, variant: 'success' });
      setAssignOpen({ open: false });
      setAssignUserSearch('');
      setAssignUserResults([]);
      setAssignUserSelected(null);
    } catch (e: any) {
      setNotif({ open: true, title: 'Не удалось назначить миссию', message: getErrorMessage(e), variant: 'error' });
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
  
  // Artifact modals
  const [addArtifactOpen, setAddArtifactOpen] = useState<boolean>(false);
  const [editArtifactOpen, setEditArtifactOpen] = useState<any>(null);
  const [newArtifact, setNewArtifact] = useState<any>({ name: '', shortDescription: '', imageUrl: '', rarity: 'COMMON', isActive: true });
  const [editArtifact, setEditArtifact] = useState<any>(null);
  
  // Artifact assignment
  const [assignArtifactOpen, setAssignArtifactOpen] = useState<any>(null);
  const [assignArtifactEmail, setAssignArtifactEmail] = useState<string>('');
  const [assignArtifactUserSearch, setAssignArtifactUserSearch] = useState<string>('');
  const [assignArtifactUserResults, setAssignArtifactUserResults] = useState<any[]>([]);
  const [assignArtifactUserSelected, setAssignArtifactUserSelected] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMissionPage, setCurrentMissionPage] = useState(1);
  const [currentArtifactPage, setCurrentArtifactPage] = useState(1);
  const [currentShopPage, setCurrentShopPage] = useState(1);
  const itemsPerPage = 10;

  const analytics = [
    { title: 'Активные пользователи', value: '1,247', change: '+12%', color: 'from-green-400 to-emerald-500' },
    { title: 'Завершенные миссии', value: '3,456', change: '+8%', color: 'from-blue-400 to-cyan-500' },
    { title: 'Средний уровень', value: '42', change: '+5%', color: 'from-purple-400 to-violet-500' },
    { title: 'Время в системе', value: '2.4ч', change: '+15%', color: 'from-orange-400 to-red-500' }
  ];

  const [shopItems, setShopItems] = useState<any[]>([]);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState<any>(null);
  const [newProduct, setNewProduct] = useState<{ name: string; price: number; available: boolean; description?: string; imageUrl?: string }>({ name: '', price: 0, available: true, imageUrl: '' });
  const [editProduct, setEditProduct] = useState<any>(null);
  const handleAddProduct = async () => {
    try {
      const created = await backend.shop.create({ name: newProduct.name, price: newProduct.price, available: newProduct.available, description: newProduct.description });
      setShopItems(prev => [{ id: created.id || Math.max(0, ...prev.map(s => s.id)) + 1, name: created.name || newProduct.name, price: created.price ?? newProduct.price, currency: 'energon', status: created.available ? 'active' : 'inactive', sales: 0 }, ...prev]);
      setNotif({ open: true, title: 'Товар добавлен', variant: 'success' });
      setAddProductOpen(false);
      setNewProduct({ name: '', price: 0, available: true, description: '', imageUrl: '' });
    } catch (e: any) {
      // Обработка ошибок валидации от бекенда
      if (e?.response?.data?.title && e?.response?.data?.message) {
        setNotif({ open: true, title: e.response.data.title, message: e.response.data.message, variant: 'error' });
      } else {
        setNotif({ open: true, title: 'Ошибка добавления товара', message: e?.message || 'Не удалось добавить товар', variant: 'error' });
      }
    }
  };

  const handleAddArtifact = async () => {
    try {
      const created = await backend.artifacts.create(newArtifact);
      setArtifactList(prev => [created, ...prev]);
      setNotif({ open: true, title: 'Артефакт создан', variant: 'success' });
      setAddArtifactOpen(false);
      setNewArtifact({ name: '', shortDescription: '', imageUrl: '', rarity: 'COMMON', isActive: true });
    } catch (e: any) {
      // Обработка ошибок валидации от бекенда
      if (e?.response?.data?.title && e?.response?.data?.message) {
        setNotif({ open: true, title: e.response.data.title, message: e.response.data.message, variant: 'error' });
      } else {
        setNotif({ open: true, title: 'Ошибка создания артефакта', message: getErrorMessage(e), variant: 'error' });
      }
    }
  };

  const handleEditArtifact = async () => {
    if (!editArtifact || !editArtifactOpen) return;
    try {
      const updated = await backend.artifacts.update(editArtifactOpen.id, editArtifact);
      setArtifactList(prev => prev.map(a => a.id === editArtifactOpen.id ? updated : a));
      setNotif({ open: true, title: 'Артефакт обновлён', variant: 'success' });
      setEditArtifactOpen(null);
      setEditArtifact(null);
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка обновления артефакта', message: getErrorMessage(e), variant: 'error' });
    }
  };

  const handleDeleteArtifact = async (id: number) => {
    try {
      await backend.artifacts.delete(id);
      setArtifactList(prev => prev.filter(a => a.id !== id));
      setNotif({ open: true, title: 'Артефакт удалён', variant: 'success' });
      setConfirmDeleteArtifact({ open: false });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка удаления артефакта', message: getErrorMessage(e), variant: 'error' });
    }
  };

  const handleAssignArtifact = async () => {
    try {
      // Здесь должен быть API для назначения артефакта пользователю
      // await backend.artifacts.assign(assignArtifactOpen.id, assignArtifactUserSelected.id);
      setNotif({ open: true, title: 'Артефакт назначен', message: `Пользователю ${assignArtifactUserSelected.name || assignArtifactUserSelected.email}`, variant: 'success' });
      setAssignArtifactOpen(null);
      setAssignArtifactUserSearch('');
      setAssignArtifactUserResults([]);
      setAssignArtifactUserSelected(null);
    } catch (e: any) {
      // Обработка ошибок валидации от бекенда
      if (e?.response?.data?.title && e?.response?.data?.message) {
        setNotif({ open: true, title: e.response.data.title, message: e.response.data.message, variant: 'error' });
      } else {
        setNotif({ open: true, title: 'Ошибка назначения артефакта', message: getErrorMessage(e), variant: 'error' });
      }
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct || !editProductOpen) return;
    try {
      const updated = await backend.shop.update(editProductOpen.id, editProduct);
      setShopItems(prev => prev.map(p => p.id === editProductOpen.id ? { ...p, ...updated } : p));
      setNotif({ open: true, title: 'Товар обновлён', variant: 'success' });
      setEditProductOpen(null);
      setEditProduct(null);
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка обновления товара', message: getErrorMessage(e), variant: 'error' });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await backend.shop.delete(id);
      setShopItems(prev => prev.filter(s => s.id !== id));
      setNotif({ open: true, title: 'Товар удалён', variant: 'success' });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка удаления товара', message: getErrorMessage(e), variant: 'error' });
    }
  };

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ login: '', email: '', password: '', role: 'USER', experience: 0, energy: 100, rank: 1 });
  const handleAddUser = async () => {
    try {
      const body = { ...newUser, firstName: newUser.login, lastName: 'User' } as any;
      const created = await backend.users.create(body);
      setUsers(prev => [{ id: created.id || Math.max(0, ...prev.map(u => u.id)) + 1, name: created.firstName || newUser.login, email: created.email || newUser.email, role: created.role || 'User', status: 'active', lastLogin: 'только что', level: created.rank ?? 0 }, ...prev]);
      setNotif({ open: true, title: 'Пользователь создан', message: `Создан ${newUser.login}`, variant: 'success' });
      setAddUserOpen(false);
      setNewUser({ login: '', email: '', password: '', role: 'USER', experience: 0, energy: 100, rank: 0 });
    } catch (e: any) {
      // Обработка ошибок валидации от бекенда
      if (e?.response?.data?.title && e?.response?.data?.message) {
        setNotif({ open: true, title: e.response.data.title, message: e.response.data.message, variant: 'error' });
      } else {
        setNotif({ open: true, title: 'Ошибка создания', message: getErrorMessage(e), variant: 'error' });
      }
    }
  };

  const [createMissionOpen, setCreateMissionOpen] = useState(false);
  const [createMission, setCreateMission] = useState<any>({ name: '', description: '', difficulty: 'EASY', experienceReward: 0, energyReward: 0, isActive: true, requiredCompetencies: '', requiredExperience: 0, requiredRank: 1 });
  const handleCreateMission = async () => {
    if (!createMission.name) return setNotif({ open: true, title: 'Введите название миссии', variant: 'warning' });
    try {
      const body = {
        ...createMission,
        branchId: 1,
        type: createMission.type || 'QUEST',
        energyReward: createMission.energyReward || 50,
        requiredCompetencies: JSON.stringify(createMission.requiredCompetencies || [])
      };
      const created = await backend.missions.create(body);
      setMissions(prev => [{ id: created.id, name: created.name || createMission.name, description: created.description || createMission.description, difficulty: created.difficulty || createMission.difficulty, isActive: created.isActive ?? true, experienceReward: created.experienceReward ?? createMission.experienceReward }, ...prev]);
      setNotif({ open: true, title: 'Миссия создана', message: `«${createMission.name}» добавлена`, variant: 'success' });
      setCreateMissionOpen(false);
      setCreateMission({ name: '', description: '', type: 'QUEST', difficulty: 'EASY', experienceReward: 0, energyReward: 50, requiredRank: 1, requiredExperience: 0, requiredCompetencies: [], competencyRewards: [], isActive: true, artifactName: '' });
    } catch (e: any) {
      setNotif({ open: true, title: 'Ошибка создания миссии', message: getErrorMessage(e), variant: 'error' });
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
      setNotif({ open: true, title: 'Ошибка обновления товара', message: getErrorMessage(e), variant: 'error' });
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
        case 'isActive': return ((a.isActive ? 1 : 0) - (b.isActive ? 1 : 0)) * dir;
        default: return (a.name || '').localeCompare(b.name || '') * dir;
      }
    });

  const filteredSortedMissions = missions
    .filter(m => {
      const q = missionSearch.trim().toLowerCase();
      if (!q) return true;
      return (m.name || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const dir = missionSortAsc ? 1 : -1;
      switch (missionSortKey) {
        case 'name': return ((a.name || '').localeCompare(b.name || '')) * dir;
        case 'createdAt': return (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()) * dir;
        case 'difficulty': return ((a.difficulty || '').localeCompare(b.difficulty || '')) * dir;
        case 'isActive': return ((a.isActive ? 1 : 0) - (b.isActive ? 1 : 0)) * dir;
        default: return (a.name || '').localeCompare(b.name || '') * dir;
      }
    });

  const filteredSortedShopItems = shopItems
    .filter(item => {
      const q = shopSearch.trim().toLowerCase();
      if (!q) return true;
      return (item.name || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const dir = shopSortAsc ? 1 : -1;
      switch (shopSortKey) {
        case 'name': return ((a.name || '').localeCompare(b.name || '')) * dir;
        case 'price': return ((a.price || 0) - (b.price || 0)) * dir;
        case 'status': return ((a.status === 'active' ? 1 : 0) - (b.status === 'active' ? 1 : 0)) * dir;
        default: return (a.name || '').localeCompare(b.name || '') * dir;
      }
    });

  const filteredSortedArtifacts = artifactList
    .filter(artifact => {
      const q = artifactSearch.trim().toLowerCase();
      if (!q) return true;
      return (artifact.name || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const dir = artifactSortAsc ? 1 : -1;
      switch (artifactSortKey) {
        case 'name': return ((a.name || '').localeCompare(b.name || '')) * dir;
        case 'rarity': return ((a.rarity || '').localeCompare(b.rarity || '')) * dir;
        case 'createdAt': return (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()) * dir;
        case 'isActive': return ((a.isActive ? 1 : 0) - (b.isActive ? 1 : 0)) * dir;
        default: return (a.name || '').localeCompare(b.name || '') * dir;
      }
    });

  // Pagination functions
  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSortedUsers.slice(startIndex, endIndex);
  };

  const getPaginatedMissions = () => {
    const startIndex = (currentMissionPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSortedMissions.slice(startIndex, endIndex);
  };

  const getPaginatedShopItems = () => {
    const startIndex = (currentShopPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSortedShopItems.slice(startIndex, endIndex);
  };

  const getPaginatedArtifacts = () => {
    const startIndex = (currentArtifactPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSortedArtifacts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredSortedUsers.length / itemsPerPage);
  const totalMissionPages = Math.ceil(filteredSortedMissions.length / itemsPerPage);
  const totalArtifactPages = Math.ceil(filteredSortedArtifacts.length / itemsPerPage);
  const totalShopPages = Math.ceil(filteredSortedShopItems.length / itemsPerPage);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(v => !v); else { setSortKey(key); setSortAsc(true); }
  };

  const toggleMissionSort = (key: typeof missionSortKey) => {
    if (missionSortKey === key) setMissionSortAsc(v => !v); else { setMissionSortKey(key); setMissionSortAsc(true); }
  };

  const toggleShopSort = (key: typeof shopSortKey) => {
    if (shopSortKey === key) setShopSortAsc(v => !v); else { setShopSortKey(key); setShopSortAsc(true); }
  };

  const toggleArtifactSort = (key: typeof artifactSortKey) => {
    if (artifactSortKey === key) setArtifactSortAsc(v => !v); else { setArtifactSortKey(key); setArtifactSortAsc(true); }
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
            <button onClick={() => toggleSort('isActive')} className={`px-2 py-1 border rounded ${sortKey==='isActive'?'border-white/50':'border-white/20'}`}>Статус {sortKey==='isActive'?(sortAsc?'↑':'↓'):''}</button>
          </div>
        </div>
        
        <div className="space-y-4">
          {getPaginatedUsers().map((user: any, index: number) => (
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
                    onClick={() => openDeleteUserConfirm(user)}
                  >
                    Удалить
                  </MainButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <MainButton
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              ← Назад
            </MainButton>
            <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              Страница {currentPage} из {totalPages}
            </span>
            <MainButton
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Вперёд →
            </MainButton>
          </div>
        )}
      </div>
    </div>
  );

  const renderMissionsTab = () => (
    <div className="space-y-6">
      {/* Mission Builder */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white"><ShinyText text="КОНСТРУКТОР МИССИЙ" className="text-2xl font-bold" /></div>
          <div className="flex gap-3">
            <MainButton
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
              onClick={() => setNotif({ open: true, title: 'Статистика миссий', message: 'Функция в разработке', variant: 'info' })}
            >
              Статистика
            </MainButton>
          <MainButton
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-400/25 transition-all duration-300"
              onClick={() => setCreateMissionOpen(true)}
          >
            Создать миссию
          </MainButton>
          </div>
        </div>
        
        {/* Search and Sort */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Поиск миссий по названию..."
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400"
              value={missionSearch}
              onChange={e => setMissionSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleMissionSort('name')}
              className={`px-3 py-1 rounded text-sm transition ${
                missionSortKey === 'name' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Название {missionSortKey === 'name' && (missionSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleMissionSort('createdAt')}
              className={`px-3 py-1 rounded text-sm transition ${
                missionSortKey === 'createdAt' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Дата создания {missionSortKey === 'createdAt' && (missionSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleMissionSort('difficulty')}
              className={`px-3 py-1 rounded text-sm transition ${
                missionSortKey === 'difficulty' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Сложность {missionSortKey === 'difficulty' && (missionSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleMissionSort('isActive')}
              className={`px-3 py-1 rounded text-sm transition ${
                missionSortKey === 'isActive' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Статус {missionSortKey === 'isActive' && (missionSortAsc ? '↑' : '↓')}
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {loadingMissions && <div className="text-gray-300">Загрузка миссий...</div>}
          {getPaginatedMissions().map((mission: any, index) => (
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
                  onClick={() => openDeleteMissionConfirm(mission)}
                >
                  Удалить
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination */}
        {missions.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <MainButton
              onClick={() => setCurrentMissionPage(prev => Math.max(1, prev - 1))}
              disabled={currentMissionPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              ← Назад
            </MainButton>
            <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              Страница {currentMissionPage} из {totalMissionPages}
            </span>
            <MainButton
              onClick={() => setCurrentMissionPage(prev => Math.min(totalMissionPages, prev + 1))}
              disabled={currentMissionPage === totalMissionPages}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Вперёд →
            </MainButton>
          </div>
        )}
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
        
        {/* Search and Sort */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Поиск товаров по названию..."
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400"
              value={shopSearch}
              onChange={e => setShopSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleShopSort('name')}
              className={`px-3 py-1 rounded text-sm transition ${
                shopSortKey === 'name' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Название {shopSortKey === 'name' && (shopSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleShopSort('price')}
              className={`px-3 py-1 rounded text-sm transition ${
                shopSortKey === 'price' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Стоимость {shopSortKey === 'price' && (shopSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleShopSort('status')}
              className={`px-3 py-1 rounded text-sm transition ${
                shopSortKey === 'status' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Статус {shopSortKey === 'status' && (shopSortAsc ? '↑' : '↓')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getPaginatedShopItems().map((item, index) => (
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
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-lg truncate" title={item.name}>{item.name}</h4>
                        <div className="text-2xl font-bold text-green-400 flex items-center gap-1">
                          {item.price} <Energon size={20} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Продаж:</span>
                        <span className="text-white">{item.sales}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Статус:</span>
                        <NeonSwitch 
                          checked={item.status === 'active'} 
                          onChange={async (v: boolean) => {
                            try {
                              const updated = await backend.shop.update(item.id, { available: v });
                              setShopItems(prev => prev.map(s => s.id === item.id ? { ...s, status: v ? 'active' : 'inactive' } : s));
                            } catch (e: any) {
                              setNotif({ open: true, title: 'Ошибка обновления статуса', message: getErrorMessage(e), variant: 'error' });
                            }
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className={`px-3 py-1 rounded text-xs text-center ${
                      item.status === 'active' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'
                    }`}>
                      {item.status === 'active' ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-1 py-1 bg-white/10 border border-white/20 rounded text-white text-xs hover:bg-white/20 transition-all duration-300"
                        onClick={() => {
                          setEditProductOpen(item);
                          setEditProduct({ name: item.name, price: item.price, available: item.status === 'active', description: (item as any).description || '', imageUrl: (item as any).imageUrl || '' });
                        }}
                      >
                        Редактировать
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-1 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 text-xs hover:bg-blue-500/30 transition-all duration-300"
                        onClick={() => setNotif({ open: true, title: 'Статистика', message: 'Функция в разработке', variant: 'info' })}
                      >
                        Статистика
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-1 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 text-xs hover:bg-red-500/30 transition-all duration-300"
                        onClick={() => handleDeleteProduct(item.id)}
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
        
        {/* Pagination */}
        {shopItems.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <MainButton
              onClick={() => setCurrentShopPage(prev => Math.max(1, prev - 1))}
              disabled={currentShopPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              ← Назад
            </MainButton>
            <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              Страница {currentShopPage} из {totalShopPages}
            </span>
            <MainButton
              onClick={() => setCurrentShopPage(prev => Math.min(totalShopPages, prev + 1))}
              disabled={currentShopPage === totalShopPages}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Вперёд →
            </MainButton>
          </div>
        )}
      </div>
    </div>
  );

  const renderArtifactsTab = () => (
    <div className="space-y-6">
      {/* Artifacts Management */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white"><ShinyText text="АРТЕФАКТЫ" className="text-2xl font-bold" /></div>
          <MainButton className="px-4 py-2" onClick={() => setAddArtifactOpen(true)}>Добавить</MainButton>
        </div>
        
        {/* Search and Sort */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Поиск артефактов по названию..."
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400"
              value={artifactSearch}
              onChange={e => setArtifactSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleArtifactSort('name')}
              className={`px-3 py-1 rounded text-sm transition ${
                artifactSortKey === 'name' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Название {artifactSortKey === 'name' && (artifactSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleArtifactSort('rarity')}
              className={`px-3 py-1 rounded text-sm transition ${
                artifactSortKey === 'rarity' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Редкость {artifactSortKey === 'rarity' && (artifactSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleArtifactSort('createdAt')}
              className={`px-3 py-1 rounded text-sm transition ${
                artifactSortKey === 'createdAt' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Дата создания {artifactSortKey === 'createdAt' && (artifactSortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleArtifactSort('isActive')}
              className={`px-3 py-1 rounded text-sm transition ${
                artifactSortKey === 'isActive' 
                  ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Статус {artifactSortKey === 'isActive' && (artifactSortAsc ? '↑' : '↓')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getPaginatedArtifacts().map((item: any, index: number) => (
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
                        <NeonSwitch checked={!!item.isActive} onChange={async (v: boolean) => {
                          try {
                            const updated = await backend.artifacts.update(item.id, { isActive: v });
                            setArtifactList(prev => prev.map((a: any) => a.id === item.id ? { ...a, isActive: updated.isActive } : a));
                          } catch (e: any) {
                            setNotif({ open: true, title: 'Ошибка статуса артефакта', message: getErrorMessage(e), variant: 'error' });
                          }
                        }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs hover:bg-white/20 transition-all duration-300"
                        onClick={() => {
                          setEditArtifactOpen(item);
                          setEditArtifact({ name: item.name, shortDescription: item.shortDescription || '', imageUrl: item.imageUrl || '', rarity: item.rarity || 'COMMON', isActive: item.isActive });
                        }}
                      >
                        Редактировать
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded text-green-300 text-xs hover:bg-green-500/30 transition-all duration-300"
                        onClick={() => setAssignArtifactOpen(item)}
                      >
                        Назначить
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="col-span-2 px-2 py-1 bg-red-500/30 border border-red-400/50 rounded text-red-200 text-xs hover:bg-red-500/40 transition-all duration-300 font-medium"
                        onClick={() => openDeleteArtifactConfirm(item)}
                      >
                        Деактивировать
                      </motion.button>
                    </div>
                  </div>
                </div>
              </CardTsup>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination */}
        {artifactList.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <MainButton
              onClick={() => setCurrentArtifactPage(prev => Math.max(1, prev - 1))}
              disabled={currentArtifactPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              ← Назад
            </MainButton>
            <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              Страница {currentArtifactPage} из {totalArtifactPages}
            </span>
            <MainButton
              onClick={() => setCurrentArtifactPage(prev => Math.min(totalArtifactPages, prev + 1))}
              disabled={currentArtifactPage === totalArtifactPages}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Вперёд →
            </MainButton>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full pb-8">

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center space-x-4 mb-8"
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
        className="max-w-5xl mx-auto"
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
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-red-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(239,68,68,0.25), inset 0 0 30px rgba(239,68,68,0.15)' }} />
            <h3 className="text-xl font-bold text-red-300 mb-2">{confirmDelete.title || 'Удалить пользователя?'}</h3>
            <p className="text-gray-300">{confirmDelete.message || `Вы действительно хотите удалить ${confirmDelete.name || 'пользователя'}? Это действие необратимо.`}</p>
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
          <div className="relative z-[210] w-[90%] max-w-xl rounded-2xl border border-orange-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(249,115,22,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(249,115,22,0.25), inset 0 0 30px rgba(249,115,22,0.15)' }} />
            <h3 className="text-xl font-bold text-orange-300 mb-4">Создать миссию</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-x-hidden hide-scrollbar">
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
              <label className="text-sm text-white/80 flex items-center gap-2">
                Требуемый ранг
                <div className="relative group">
                  <span className="text-blue-400 cursor-help">?</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[500px] bg-slate-900/95 border border-blue-400/30 rounded-lg p-4 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[200] pointer-events-none shadow-2xl">
                    <div className="space-y-2">
                      <div className="font-semibold text-blue-300">Система рангов:</div>
                      <div><span className="text-yellow-300">1</span> - Космо-Кадет (старт)</div>
                      <div><span className="text-yellow-300">2</span> - Навигатор Траекторий, Аналитик Орбит, Архитектор Станции (Аналитико-Техническая)</div>
                      <div><span className="text-yellow-300">3</span> - Хронист Галактики, Исследователь Культур, Мастер Лектория (Гуманитарно-Исследовательская)</div>
                      <div><span className="text-yellow-300">4</span> - Связист Звёздного Флота, Штурман Экипажа, Командир Отряда (Коммуникационно-Лидерская)</div>
                      <div><span className="text-yellow-300">5</span> - Хранитель Станции «Алабуга.TECH» (финальный)</div>
                    </div>
                  </div>
                </div>
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={createMission.requiredRank || 1} onChange={e => setCreateMission((v: any) => ({ ...v, requiredRank: Number(e.target.value) }))}>
                  <option value={1} className="bg-slate-800 text-white">1</option>
                  <option value={2} className="bg-slate-800 text-white">2</option>
                  <option value={3} className="bg-slate-800 text-white">3</option>
                  <option value={4} className="bg-slate-800 text-white">4</option>
                  <option value={5} className="bg-slate-800 text-white">5</option>
                </select>
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
                <NeonSwitch checked={!!createMission.isActive} onChange={(v: boolean) => setCreateMission((s: any) => ({ ...s, isActive: v }))} />
              </div>
              <div className="text-sm text-white/80 md:col-span-2 flex items-center gap-3">
                <span>Добавить артефакт</span>
                <NeonSwitch checked={artifactToggle} onChange={(v: boolean) => setArtifactToggle(v)} />
              </div>
              {artifactToggle && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="text-sm text-white/80">Выбрать готовый
                    <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={selectedArtifactId ?? ''} onChange={e => setSelectedArtifactId(Number(e.target.value) || null)}>
                      <option value="" className="bg-slate-800 text-white">—</option>
                      {artifactList.map((a: any) => (
                        <option key={a.id} value={a.id} className="bg-slate-800 text-white">{a.name}</option>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {allCompetencies.map((c: any) => (
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

      {/* Assign mission to user */}
      {assignOpen.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAssignOpen({ open: false })} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-blue-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto hide-scrollbar shadow-[0_0_30px_rgba(59,130,246,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(59,130,246,0.25), inset 0 0 30px rgba(59,130,246,0.15)' }} />
            <h3 className="text-xl font-bold text-blue-300 mb-4">Назначить миссию</h3>
            <div className="space-y-4">
              <label className="text-sm text-white/80 w-full">Поиск пользователя
                <input 
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" 
                  value={assignUserSearch} 
                  onChange={e => {
                    setAssignUserSearch(e.target.value);
                    searchUsers(e.target.value);
                  }} 
                  placeholder="Имя, логин или email" 
                />
              </label>
              
              {assignUserResults.length > 0 && (
                <div className="max-h-40 hide-scrollbar">
                  {assignUserResults.map(user => (
                    <div 
                      key={user.id}
                      className={`p-2 rounded cursor-pointer transition ${assignUserSelected?.id === user.id ? 'bg-blue-500/20 border border-blue-400/40' : 'bg-white/5 hover:bg-white/10'}`}
                      onClick={() => setAssignUserSelected(user)}
                    >
                      <div className="text-white font-medium">{user.name || user.login}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {assignUserSelected && (
                <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded">
                  <div className="text-blue-300 font-medium">Выбран: {assignUserSelected.name || assignUserSelected.login}</div>
                  <div className="text-blue-200 text-sm">{assignUserSelected.email}</div>
                </div>
              )}
            </div>
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
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-cyan-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
            <h3 className="text-xl font-bold text-cyan-300 mb-4">Добавить пользователя</h3>
            <div className="grid grid-cols-1 gap-3 overflow-x-hidden">
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
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-cyan-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
            <h3 className="text-xl font-bold text-cyan-300 mb-4">Редактировать пользователя</h3>
            <div className="grid grid-cols-1 gap-3 overflow-x-hidden">
              <label className="text-sm text-white/80">Email
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Email" value={editUser.email} onChange={e => setEditUser((v: any) => ({ ...v, email: e.target.value }))} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-white/80">Ранг
                  <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={editUser.level ?? 1} onChange={e => setEditUser((v: any) => ({ ...v, level: Number(e.target.value) }))}>
                    <option value={1} className="bg-slate-800 text-white">1 - Космо-кадет</option>
                    <option value={2} className="bg-slate-800 text-white">2 - Аналитик орбит</option>
                    <option value={3} className="bg-slate-800 text-white">2 - Архитектор станций</option>
                    <option value={4} className="bg-slate-800 text-white">2 - Навигатор</option>
                    <option value={5} className="bg-slate-800 text-white">3 - Специалист</option>
                    <option value={6} className="bg-slate-800 text-white">3 - Координатор</option>
                    <option value={7} className="bg-slate-800 text-white">3 - Оператор</option>
                    <option value={8} className="bg-slate-800 text-white">4 - Мастер</option>
                    <option value={9} className="bg-slate-800 text-white">4 - Эксперт</option>
                    <option value={10} className="bg-slate-800 text-white">4 - Лидер</option>
                    <option value={11} className="bg-slate-800 text-white">5 - Командор</option>
                  </select>
                </label>
                <label className="text-sm text-white/80">Ветка
                  <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={editUser.branchId ?? 1} onChange={e => setEditUser((v: any) => ({ ...v, branchId: Number(e.target.value) }))}>
                    {userBranches.map(branch => (
                      <option key={branch.id} value={branch.id} className="bg-slate-800 text-white">{branch.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
            
            {/* Управление миссиями пользователя */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-cyan-300">Миссии пользователя</h4>
                <button 
                  onClick={() => setShowUserMissions(!showUserMissions)}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 rounded hover:bg-blue-500/30 transition"
                >
                  {showUserMissions ? 'Скрыть' : 'Показать'} миссии
                </button>
              </div>
              
              {showUserMissions && (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {userMissions.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">У пользователя нет назначенных миссий</p>
                  ) : (
                    userMissions.map(mission => (
                      <div key={mission.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="text-white font-medium">{mission.missionName || mission.name}</h5>
                            <p className="text-gray-400 text-sm">{mission.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                mission.status === 'COMPLETED' 
                                  ? 'bg-green-500/30 text-green-300' 
                                  : mission.status === 'IN_PROGRESS'
                                  ? 'bg-yellow-500/30 text-yellow-300'
                                  : mission.status === 'FAILED'
                                  ? 'bg-red-500/30 text-red-300'
                                  : 'bg-gray-500/30 text-gray-400'
                              }`}>
                                {mission.status === 'COMPLETED' ? 'Выполнена' : 
                                 mission.status === 'IN_PROGRESS' ? 'В процессе' : 
                                 mission.status === 'FAILED' ? 'Провалена' : 'Назначена'}
                              </span>
                              <span className="text-xs text-gray-500">
                                Сложность: {mission.difficulty}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {mission.status === 'COMPLETED' && (
                              <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded text-xs">
                                Выполнено
                              </span>
                            )}
                            {mission.status === 'IN_PROGRESS' && (
                              <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 rounded text-xs">
                                Активные
                              </span>
                            )}
                            {mission.status === 'NOT_STARTED' && (
                              <span className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded text-xs">
                                Доступно
                              </span>
                            )}
                            {mission.status !== 'COMPLETED' && (
                              <button
                                onClick={() => markMissionCompleted(mission.id, mission.missionName || mission.name)}
                                className="px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded text-xs hover:bg-green-500/30 transition"
                              >
                                Выполнена
                              </button>
                            )}
                            <button
                              onClick={() => removeUserMission(mission.id, mission.missionName || mission.name)}
                              className="px-2 py-1 bg-red-500/20 border border-red-400/30 text-red-300 rounded text-xs hover:bg-red-500/30 transition"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
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
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-emerald-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(16,185,129,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(16,185,129,0.25), inset 0 0 30px rgba(16,185,129,0.15)' }} />
            <h3 className="text-xl font-bold text-emerald-300 mb-4">Добавить товар</h3>
            <div className="grid grid-cols-1 gap-3 overflow-x-hidden">
              <label className="text-sm text-white/80">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Название" value={newProduct.name} onChange={e => setNewProduct(v => ({ ...v, name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Цена (минимум 1)
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Цена" type="number" min="1" value={newProduct.price} onChange={e => setNewProduct(v => ({ ...v, price: Math.max(1, Number(e.target.value)) }))} />
              </label>
              <label className="text-sm text-white/80">Описание
                <textarea className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Описание" value={newProduct.description || ''} onChange={e => setNewProduct(v => ({ ...v, description: e.target.value }))} />
              </label>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span>Доступен</span>
                <NeonSwitch checked={!!newProduct.available} onChange={(v: boolean) => setNewProduct((s: any) => ({ ...s, available: v }))} />
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
          <div className="relative z-[210] w-[90%] max-w-xl rounded-2xl border border-orange-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(249,115,22,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(249,115,22,0.25), inset 0 0 30px rgba(249,115,22,0.15)' }} />
            <h3 className="text-xl font-bold text-orange-300 mb-4">Редактировать миссию</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-x-hidden hide-scrollbar">
              <label className="text-sm text-white/80 md:col-span-2">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.name || ''} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80 md:col-span-2">Описание
                <textarea className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" rows={3} defaultValue={editMissionOpen?.description || ''} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), description: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Сложность
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" defaultValue={editMissionOpen?.difficulty || 'EASY'} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), difficulty: e.target.value }))}>
                  <option value="EASY" className="bg-slate-800 text-white">EASY</option>
                  <option value="MEDIUM" className="bg-slate-800 text-white">MEDIUM</option>
                  <option value="HARD" className="bg-slate-800 text-white">HARD</option>
                  <option value="EXTREME" className="bg-slate-800 text-white">EXTREME</option>
                </select>
              </label>
              <label className="text-sm text-white/80">Награда (XP)
                <input type="number" className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.experienceReward ?? 0} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), experienceReward: Number(e.target.value) }))} />
              </label>
              <label className="text-sm text-white/80 flex items-center gap-2">
                Требуемый ранг
                <div className="relative group">
                  <span className="text-blue-400 cursor-help">?</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[500px] bg-slate-900/95 border border-blue-400/30 rounded-lg p-4 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[200] pointer-events-none shadow-2xl">
                    <div className="space-y-2">
                      <div className="font-semibold text-blue-300">Система рангов:</div>
                      <div><span className="text-yellow-300">1</span> - Космо-Кадет (старт)</div>
                      <div><span className="text-yellow-300">2</span> - Навигатор Траекторий, Аналитик Орбит, Архитектор Станции (Аналитико-Техническая)</div>
                      <div><span className="text-yellow-300">3</span> - Хронист Галактики, Исследователь Культур, Мастер Лектория (Гуманитарно-Исследовательская)</div>
                      <div><span className="text-yellow-300">4</span> - Связист Звёздного Флота, Штурман Экипажа, Командир Отряда (Коммуникационно-Лидерская)</div>
                      <div><span className="text-yellow-300">5</span> - Хранитель Станции «Алабуга.TECH» (финальный)</div>
                    </div>
                  </div>
                </div>
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" defaultValue={editMissionOpen?.requiredRank ?? 1} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), requiredRank: Number(e.target.value) }))}>
                  <option value={1} className="bg-slate-800 text-white">1</option>
                  <option value={2} className="bg-slate-800 text-white">2</option>
                  <option value={3} className="bg-slate-800 text-white">3</option>
                  <option value={4} className="bg-slate-800 text-white">4</option>
                  <option value={5} className="bg-slate-800 text-white">5</option>
                </select>
              </label>
              <label className="text-sm text-white/80">Требуемый опыт
                <input type="number" className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" defaultValue={editMissionOpen?.requiredExperience ?? 0} onChange={e => setEditMissionData((v: any) => ({ ...(v||{}), requiredExperience: Number(e.target.value) }))} />
              </label>
              <div className="text-sm text-white/80 flex items-center gap-3">
                <span>Активна</span>
                <NeonSwitch checked={!!(editMissionData?.isActive ?? editMissionOpen?.isActive)} onChange={(v: boolean) => setEditMissionData((s: any) => ({ ...(s||{}), isActive: v }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => { setEditMissionOpen(null); setEditMissionData(null); }} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={saveEditMission} className="px-4 py-2 rounded-md bg-orange-500/20 border border-orange-400/40 text-orange-200 hover:bg-orange-500/30 transition">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Artifact Modal */}
      {addArtifactOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAddArtifactOpen(false)} />
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-purple-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(168,85,247,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(168,85,247,0.25), inset 0 0 30px rgba(168,85,247,0.15)' }} />
            <h3 className="text-xl font-bold text-purple-300 mb-4">Добавить артефакт</h3>
            <div className="grid grid-cols-1 gap-3 overflow-x-hidden">
              <label className="text-sm text-white/80">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Название артефакта" value={newArtifact.name} onChange={e => setNewArtifact((v: any) => ({ ...v, name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Краткое описание
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Краткое описание" value={newArtifact.shortDescription} onChange={e => setNewArtifact((v: any) => ({ ...v, shortDescription: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">URL изображения
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="https://example.com/image.jpg" value={newArtifact.imageUrl} onChange={e => setNewArtifact((v: any) => ({ ...v, imageUrl: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Редкость
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={newArtifact.rarity} onChange={e => setNewArtifact((v: any) => ({ ...v, rarity: e.target.value }))}>
                  <option value="COMMON" className="bg-slate-800 text-white">Обычный</option>
                  <option value="RARE" className="bg-slate-800 text-white">Редкий</option>
                  <option value="EPIC" className="bg-slate-800 text-white">Эпический</option>
                  <option value="LEGENDARY" className="bg-slate-800 text-white">Легендарный</option>
                </select>
              </label>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span>Активен</span>
                <NeonSwitch checked={!!newArtifact.isActive} onChange={(v: boolean) => setNewArtifact((s: any) => ({ ...s, isActive: v }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setAddArtifactOpen(false)} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleAddArtifact} className="px-4 py-2 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-200 hover:bg-purple-500/30 transition">Создать</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Artifact Modal */}
      {editArtifactOpen && editArtifact && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setEditArtifactOpen(null); setEditArtifact(null); }} />
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-purple-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(168,85,247,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(168,85,247,0.25), inset 0 0 30px rgba(168,85,247,0.15)' }} />
            <h3 className="text-xl font-bold text-purple-300 mb-4">Редактировать артефакт</h3>
            <div className="grid grid-cols-1 gap-3 overflow-x-hidden">
              <label className="text-sm text-white/80">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Название артефакта" value={editArtifact.name} onChange={e => setEditArtifact((v: any) => ({ ...v, name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Краткое описание
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Краткое описание" value={editArtifact.shortDescription} onChange={e => setEditArtifact((v: any) => ({ ...v, shortDescription: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">URL изображения
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="https://example.com/image.jpg" value={editArtifact.imageUrl} onChange={e => setEditArtifact((v: any) => ({ ...v, imageUrl: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Редкость
                <select className="mt-1 w-full bg-slate-800/90 border border-white/20 rounded px-3 py-2 text-white hover:bg-slate-700/90 focus:bg-slate-700/90 focus:border-blue-400/50 transition-colors" value={editArtifact.rarity} onChange={e => setEditArtifact((v: any) => ({ ...v, rarity: e.target.value }))}>
                  <option value="COMMON" className="bg-slate-800 text-white">Обычный</option>
                  <option value="RARE" className="bg-slate-800 text-white">Редкий</option>
                  <option value="EPIC" className="bg-slate-800 text-white">Эпический</option>
                  <option value="LEGENDARY" className="bg-slate-800 text-white">Легендарный</option>
                </select>
              </label>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span>Активен</span>
                <NeonSwitch checked={!!editArtifact.isActive} onChange={(v: boolean) => setEditArtifact((s: any) => ({ ...s, isActive: v }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => { setEditArtifactOpen(null); setEditArtifact(null); }} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleEditArtifact} className="px-4 py-2 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-200 hover:bg-purple-500/30 transition">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProductOpen && editProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setEditProductOpen(null); setEditProduct(null); }} />
          <div className="relative z-[210] w-[90%] max-w-lg rounded-2xl border border-emerald-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(16,185,129,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(16,185,129,0.25), inset 0 0 30px rgba(16,185,129,0.15)' }} />
            <h3 className="text-xl font-bold text-emerald-300 mb-4">Редактировать товар</h3>
            <div className="grid grid-cols-1 gap-3 overflow-x-hidden">
              <label className="text-sm text-white/80">Название
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Название" value={editProduct.name} onChange={e => setEditProduct((v: any) => ({ ...v, name: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">Цена
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Цена" type="number" value={editProduct.price} onChange={e => setEditProduct((v: any) => ({ ...v, price: Number(e.target.value) }))} />
              </label>
              <label className="text-sm text-white/80">Описание
                <textarea className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Описание" value={editProduct.description || ''} onChange={e => setEditProduct((v: any) => ({ ...v, description: e.target.value }))} />
              </label>
              <label className="text-sm text-white/80">URL изображения
                <input className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="https://example.com/image.jpg" value={editProduct.imageUrl || ''} onChange={e => setEditProduct((v: any) => ({ ...v, imageUrl: e.target.value }))} />
              </label>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span>Доступен</span>
                <NeonSwitch checked={!!editProduct.available} onChange={(v: boolean) => setEditProduct((s: any) => ({ ...s, available: v }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => { setEditProductOpen(null); setEditProduct(null); }} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleEditProduct} className="px-4 py-2 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30 transition">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Artifact Modal */}
      {assignArtifactOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setAssignArtifactOpen(null); setAssignArtifactUserSearch(''); setAssignArtifactUserResults([]); setAssignArtifactUserSelected(null); }} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-green-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-y-auto hide-scrollbar shadow-[0_0_30px_rgba(34,197,94,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,197,94,0.25), inset 0 0 30px rgba(34,197,94,0.15)' }} />
            <h3 className="text-xl font-bold text-green-300 mb-4">Назначить артефакт</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 mb-2">Артефакт: <span className="text-green-300 font-semibold">{assignArtifactOpen.name}</span></p>
                <p className="text-white/60 text-sm">{assignArtifactOpen.shortDescription || '—'}</p>
              </div>
              <label className="text-sm text-white/80">Поиск пользователя
                <input 
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" 
                  value={assignArtifactUserSearch} 
                  onChange={e => {
                    setAssignArtifactUserSearch(e.target.value);
                    searchArtifactUsers(e.target.value);
                  }} 
                  placeholder="Имя, логин или email" 
                />
              </label>
              
              {assignArtifactUserResults.length > 0 && (
                <div className="max-h-40 hide-scrollbar">
                  {assignArtifactUserResults.map(user => (
                    <div 
                      key={user.id}
                      className={`p-2 rounded cursor-pointer transition ${assignArtifactUserSelected?.id === user.id ? 'bg-green-500/20 border border-green-400/40' : 'bg-white/5 hover:bg-white/10'}`}
                      onClick={() => setAssignArtifactUserSelected(user)}
                    >
                      <div className="text-white font-medium">{user.name || user.login}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {assignArtifactUserSelected && (
                <div className="p-3 bg-green-500/10 border border-green-400/30 rounded">
                  <div className="text-green-300 font-medium">Выбран: {assignArtifactUserSelected.name || assignArtifactUserSelected.login}</div>
                  <div className="text-green-200 text-sm">{assignArtifactUserSelected.email}</div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => { setAssignArtifactOpen(null); setAssignArtifactUserSearch(''); setAssignArtifactUserResults([]); setAssignArtifactUserSelected(null); }} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={handleAssignArtifact} className="px-4 py-2 rounded-md bg-green-500/20 border border-green-400/40 text-green-200 hover:bg-green-500/30 transition">Назначить</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Artifact Modal */}
      {confirmDeleteArtifact.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDeleteArtifact({ open: false })} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-red-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(239,68,68,0.25), inset 0 0 30px rgba(239,68,68,0.15)' }} />
            <h3 className="text-xl font-bold text-red-300 mb-4">{confirmDeleteArtifact.title || 'Подтверждение удаления'}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 mb-2">{confirmDeleteArtifact.message || `Вы уверены, что хотите деактивировать артефакт «${confirmDeleteArtifact.name}»?`}</p>
              </div>
              <div className="bg-red-500/10 border border-red-400/30 rounded p-3">
                <p className="text-red-200 text-sm">⚠️ Артефакт станет неактивным. Пользователи сохранят свои артефакты, но новые назначения будут невозможны.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setConfirmDeleteArtifact({ open: false })} 
                className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition"
              >
                Отмена
              </button>
              <button 
                onClick={() => confirmDeleteArtifact.id && handleDeleteArtifact(confirmDeleteArtifact.id)} 
                className="px-4 py-2 rounded-md bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition"
              >
                Деактивировать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Mission Modal */}
      {confirmDeleteMission.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDeleteMission({ open: false })} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-red-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(239,68,68,0.25), inset 0 0 30px rgba(239,68,68,0.15)' }} />
            <h3 className="text-xl font-bold text-red-300 mb-4">{confirmDeleteMission.title || 'Подтверждение удаления'}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 mb-2">{confirmDeleteMission.message || `Вы уверены, что хотите удалить миссию «${confirmDeleteMission.name}»?`}</p>
              </div>
              <div className="bg-red-500/10 border border-red-400/30 rounded p-3">
                <p className="text-red-200 text-sm">⚠️ Это действие нельзя отменить. Миссия будет удалена навсегда.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setConfirmDeleteMission({ open: false })} 
                className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition"
              >
                Отмена
              </button>
              <button 
                onClick={() => confirmDeleteMission.id && handleDeleteMission(confirmDeleteMission.id)} 
                className="px-4 py-2 rounded-md bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка подтверждения выполнения миссии */}
      {confirmCompleteMission.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmCompleteMission({ open: false })} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-green-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(34,197,94,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,197,94,0.25), inset 0 0 30px rgba(34,197,94,0.15)' }} />
            <h3 className="text-xl font-bold text-green-300 mb-4">{confirmCompleteMission.title || 'Подтверждение выполнения'}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 mb-2">{confirmCompleteMission.message || `Вы действительно хотите пометить миссию «${confirmCompleteMission.missionName}» как выполненную?`}</p>
              </div>
              <div className="bg-green-500/10 border border-green-400/30 rounded p-3">
                <p className="text-green-200 text-sm">✅ Пользователь получит награды за выполнение миссии.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setConfirmCompleteMission({ open: false })} 
                className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition"
              >
                Отмена
              </button>
              <button 
                onClick={confirmCompleteMissionAction} 
                className="px-4 py-2 rounded-md bg-green-500/20 border border-green-400/40 text-green-200 hover:bg-green-500/30 transition"
              >
                Выполнена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка подтверждения удаления миссии */}
      {confirmRemoveMission.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmRemoveMission({ open: false })} />
          <div className="relative z-[210] w-[90%] max-w-md rounded-2xl border border-red-400/30 bg-slate-900/80 p-6 max-h-[80vh] overflow-x-hidden hide-scrollbar shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(239,68,68,0.25), inset 0 0 30px rgba(239,68,68,0.15)' }} />
            <h3 className="text-xl font-bold text-red-300 mb-4">{confirmRemoveMission.title || 'Подтверждение удаления'}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 mb-2">{confirmRemoveMission.message || `Вы действительно хотите удалить миссию «${confirmRemoveMission.missionName}» у пользователя?`}</p>
              </div>
              <div className="bg-red-500/10 border border-red-400/30 rounded p-3">
                <p className="text-red-200 text-sm">⚠️ Миссия будет удалена у пользователя. Это действие нельзя отменить.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setConfirmRemoveMission({ open: false })} 
                className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition"
              >
                Отмена
              </button>
              <button 
                onClick={confirmRemoveMissionAction} 
                className="px-4 py-2 rounded-md bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScreen;
 
