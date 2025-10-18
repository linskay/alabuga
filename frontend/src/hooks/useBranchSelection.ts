import { useState, useEffect } from 'react';
import { backend } from '../api';

interface BranchData {
  availableBranches: string[];
  currentBranch: string;
  canPromote: boolean;
  nextRank: any;
}

export const useBranchSelection = (userId: number) => {
  const [branchData, setBranchData] = useState<BranchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranchData = async () => {
    if (!userId) return;
    
    console.log('=== DEBUG: fetchBranchData ===');
    console.log('userId:', userId);
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('DEBUG: Making API calls...');
      const [availableBranches, currentBranch, canPromote, nextRank] = await Promise.all([
        backend.users.branches.available(userId),
        backend.users.branches.current(userId),
        backend.users.branches.canPromote(userId),
        backend.users.branches.nextRank(userId)
      ]);

      console.log('DEBUG: API responses:');
      console.log('availableBranches:', availableBranches);
      console.log('currentBranch:', currentBranch);
      console.log('canPromote:', canPromote);
      console.log('nextRank:', nextRank);

      setBranchData({
        availableBranches: availableBranches,
        currentBranch: currentBranch,
        canPromote: canPromote,
        nextRank: nextRank
      });
    } catch (err: any) {
      console.error('DEBUG: Error in fetchBranchData:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки данных о ветках');
    } finally {
      setLoading(false);
    }
  };

  const selectBranch = async (branch: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await backend.users.branches.select(userId, branch);
      await fetchBranchData(); // Обновляем данные после выбора
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка выбора ветки');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchData();
  }, [userId]);

  return {
    branchData,
    loading,
    error,
    selectBranch,
    refetch: fetchBranchData
  };
};
