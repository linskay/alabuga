import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RanksDiagram from '../RanksDiagram';
import CosmicOrbits from '../CosmicOrbits';
import ShinyText from '../ShinyText';
import HoloBackground from '../HoloBackground';
import Footer from '../../components/Footer';
import { backend, UserDTO } from '../../api';
import { handleApiError } from '../../utils/errorHandler';
import BranchSelectionModal from '../BranchSelectionModal';
import { useBranchSelection } from '../../hooks/useBranchSelection';
import GooseHint from '../GooseHint';
import { useOneTimeHint } from '../../hooks/useOneTimeHint';
import { combineHint } from '../../constants/gooseHints';

const MapScreen: React.FC = () => {
  const branchesHint = useOneTimeHint('branches', { durationMs: 10000 });
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);

  // Branch selection data
  const { branchData, loading: branchLoading, error: branchError, selectBranch, refetch } = useBranchSelection(user?.id || 0);
  const defaultBranches = ['ANALYTICAL_TECHNICAL', 'HUMANITARIAN_RESEARCH', 'COMMUNICATION_LEADERSHIP'];
  const selectableSet = new Set(defaultBranches);
  const isAssignedOneOfThree = branchData?.currentBranch ? selectableSet.has(branchData.currentBranch) : false;
  // На 1 ранге ветка выбирается только если ещё не назначена (не одна из трёх) и canPromote === true
  const shouldDefaultBranchesForRank1 = false; // больше не форсим 3 ветки, чтобы не ломать правила бэкенда
  const availableBranches = (branchData?.availableBranches && branchData.availableBranches.length > 0)
    ? branchData.availableBranches
    : [];

  // Загружаем данные пользователя
  useEffect(() => {
    const loadUser = async () => {
      try {
        const login = localStorage.getItem('currentLogin');
        if (!login) return;

        const userData = await backend.users.byLogin(login);
        setUser(userData as UserDTO);
      } catch (err) {
        const errorInfo = handleApiError(err);
        setError(errorInfo.message);
      }
    };
    loadUser();
  }, []);

  // Авто-открытие модалки, когда условия выполняются
  useEffect(() => {
    if (shouldShowBranchButton()) {
      setShowBranchModal(true);
    } else {
      setShowBranchModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, branchData]);

  // Проверяем, нужно ли показать модал выбора ветки
  const shouldShowBranchButton = () => {
    console.log('=== DEBUG: shouldShowBranchButton ===');
    console.log('user:', user);
    console.log('branchData:', branchData);
    console.log('user?.rank:', user?.rank);
    console.log('branchData?.availableBranches:', branchData?.availableBranches);
    console.log('branchData?.availableBranches?.length:', branchData?.availableBranches?.length);
    
    if (!user || !branchData) {
      console.log('DEBUG: Missing user or branchData, returning false');
      return false;
    }
    
    // Показываем модалку, если (строго для стартового ранга):
    // 1. user.rank === 1 (Космо-Кадет)
    // 2. Бэкенд разрешает повышение (canPromote === true)
    // 3. Есть доступные ветки для выбора
    // 4. Ветка ещё не выбрана (не одна из трёх)
    const selectable = new Set(['ANALYTICAL_TECHNICAL', 'HUMANITARIAN_RESEARCH', 'COMMUNICATION_LEADERSHIP']);
    const isOneOfThree = branchData.currentBranch && selectable.has(branchData.currentBranch);
    // Модалка появляется, когда пользователь может перейти на 2 ранг (canPromote) на ранге 1
    const shouldShow = (user.rank === 1) && Boolean(branchData.canPromote) &&
           availableBranches.length > 0;
    
    console.log('DEBUG: shouldShow =', shouldShow);
    console.log('DEBUG: user.rank === 1 =', user.rank === 1);
    console.log('DEBUG: canPromote =', branchData.canPromote);
    console.log('DEBUG: availableBranches.length > 0 =', availableBranches.length > 0);
    console.log('DEBUG: currentBranch =', branchData.currentBranch);

    return shouldShow;
  };

  // Обработчик выбора ветки
  const handleSelectBranch = async (branch: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // На ранге 1 сначала повышаем, затем выбираем ветку (бекенд может ограничивать выбор ветки только для 2-4 рангов)
      if (user.rank === 1 && branchData?.canPromote) {
        try {
          const updatedUser = await backend.ranks.promote(user.id);
          // Жёстко перезапросим пользователя
          try {
            const login = localStorage.getItem('currentLogin');
            if (login) {
              const fresh = await backend.users.byLogin(login);
              setUser(fresh as UserDTO);
            } else {
              setUser(updatedUser as UserDTO);
            }
          } catch {
            setUser(updatedUser as UserDTO);
          }
        } catch (e) {
          // Если промоция не прошла до выбора, попробуем сначала выбрать ветку, затем снова промоутнуть
        }
      }

      // Если ветка уже одна из трёх и совпадает с текущей — пропускаем выбор ветки
      const selectable = new Set(['ANALYTICAL_TECHNICAL', 'HUMANITARIAN_RESEARCH', 'COMMUNICATION_LEADERSHIP']);
      const alreadyAssigned = !!(branchData?.currentBranch && selectable.has(branchData.currentBranch));
      const isSameBranch = alreadyAssigned && branchData?.currentBranch === branch;

      let success: boolean = true;
      if (!isSameBranch) {
        // Пытаемся выбрать ветку; если бэкенд запретит (например, уже выбрано ранее), покажем ошибку и продолжим к промоушену
        const res = await selectBranch(branch);
        success = res === true;
        if (success === false) {
        }
      }

      // Если после выбора всё ещё ранг 1 и можно повышать — пробуем повысить
      if ((user.rank === 1 || (user.rank ?? 0) === 1) && (branchData?.canPromote || true)) {
        try {
          const updatedUser2 = await backend.ranks.promote(user.id);
          // Жёстко перезапросим пользователя
          try {
            const login = localStorage.getItem('currentLogin');
            if (login) {
              const fresh = await backend.users.byLogin(login);
              setUser(fresh as UserDTO);
            } else {
              setUser(updatedUser2 as UserDTO);
            }
          } catch {
            setUser(updatedUser2 as UserDTO);
          }
        } catch (e2) {
          const info2 = handleApiError(e2);
          setError(info2.message);
        }
      }

      // Обновим данные по веткам и закроем модалку
      await refetch();
      setShowBranchModal(false);
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-8 relative">
      <HoloBackground />
      <GooseHint
        text={combineHint('branches')}
        visible={branchesHint.visible}
        className="top-20 right-6"
      />

      {/* Branch selection CTA removed; modal opens automatically when доступно */}

      {/* Cosmic Orbits (replaces Competency Map) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative z-10 p-4 md:p-6 mb-0 overflow-visible">
          <h3 className="mb-4">
            <ShinyText text="КАРТА КОМПЕТЕНЦИЙ" speed={6} className="text-xl font-bold text-white tracking-wide" />
          </h3>
          <div className="w-full flex items-center justify-center overflow-visible">
            <CosmicOrbits />
          </div>
        </div>
      </motion.div>

      {/* Connector removed as requested */}

      {/* Ranks Diagram (under branches) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative z-10 p-4 md:p-6 overflow-visible">
          <h3 className="mb-4">
            <ShinyText text="СИСТЕМА РАНГОВ" speed={6} className="text-xl font-bold text-white tracking-wide" />
          </h3>
          <RanksDiagram />
        </div>
      </motion.div>

      {/* Journal removed as requested */}

      {/* Branch Selection Modal */}
      <BranchSelectionModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        onSelectBranch={handleSelectBranch}
        currentRank={user?.rank ?? 0}
        availableBranches={availableBranches}
      />

      {/* Error Display */}
      {(error || branchError) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-red-900/80 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg backdrop-blur-sm z-50"
        >
          {error || branchError}
        </motion.div>
      )}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default MapScreen;
