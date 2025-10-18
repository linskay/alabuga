import React, { useState, useEffect } from 'react';
// import { X, Star, Brain, Users, Zap } from 'lucide-react';

interface BranchSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBranch: (branch: string) => void;
  currentRank: number;
  availableBranches: string[];
}

interface BranchInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirements: string[];
}

const BranchSelectionModal: React.FC<BranchSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectBranch,
  currentRank,
  availableBranches
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const branchInfo: Record<string, BranchInfo> = {
    'ANALYTICAL_TECHNICAL': {
      id: 'ANALYTICAL_TECHNICAL',
      name: 'Кольцо Посланцев',
      description: 'Специализация на технических решениях, анализе данных и системном мышлении',
      icon: <span className="text-2xl">🧠</span>,
      color: 'from-blue-500 to-cyan-500',
      requirements: [
        'Аналитическое мышление',
        'Техническая грамотность',
        'Системный подход к решению задач'
      ]
    },
    'HUMANITARIAN_RESEARCH': {
      id: 'HUMANITARIAN_RESEARCH',
      name: 'Академия Звёздного Флота',
      description: 'Фокус на исследованиях, образовании и развитии человеческого потенциала',
      icon: <span className="text-2xl">⭐</span>,
      color: 'from-purple-500 to-pink-500',
      requirements: [
        'Исследовательские навыки',
        'Коммуникативные способности',
        'Стремление к знаниям'
      ]
    },
    'COMMUNICATION_LEADERSHIP': {
      id: 'COMMUNICATION_LEADERSHIP',
      name: 'Пояс Испытаний',
      description: 'Развитие лидерских качеств, управление командами и межличностные коммуникации',
      icon: <span className="text-2xl">👥</span>,
      color: 'from-green-500 to-emerald-500',
      requirements: [
        'Лидерские качества',
        'Умение работать в команде',
        'Эффективные коммуникации'
      ]
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedBranch(null);
    }
  }, [isOpen]);

  const handleSelectBranch = () => {
    if (selectedBranch) {
      onSelectBranch(selectedBranch);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-3 sm:p-4 md:p-6 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-slate-900/80 backdrop-blur">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Выбор ветки развития</h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">Выберите специализацию для дальнейшего развития. Это решение влияет на ваш путь и доступные возможности.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl sm:text-2xl">✕</button>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-60px)] px-5 sm:px-6 py-5">
          <div className="mb-5">
            <div className="rounded-xl border border-blue-400/30 bg-blue-900/15 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 text-xl">⚡</div>
                <div>
                  <div className="text-blue-300 font-semibold">Важное решение</div>
                  <div className="text-gray-300 text-sm mt-1">Выбор ветки развития определит ваши дальнейшие ранги и доступные возможности. Выбирайте внимательно.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {availableBranches.map((branchId) => {
              const branch = branchInfo[branchId];
              if (!branch) return null;
              const isSelected = selectedBranch === branchId;
              return (
                <button
                  key={branchId}
                  type="button"
                  onClick={() => setSelectedBranch(branchId)}
                  className={`group relative text-left rounded-xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-slate-900 ${
                    isSelected ? 'border-white/40 bg-white/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className={`rounded-t-xl h-1.5 w-full bg-gradient-to-r ${branch.color}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${branch.color} text-white text-2xl`}>{branch.icon}</div>
                      <div className="flex-1">
                        <div className="text-base sm:text-lg font-bold text-white">{branch.name}</div>
                        <div className="mt-1 inline-flex items-center gap-2 text-[11px] sm:text-xs text-gray-300">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">Уровень 2</span>
                          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15">Специализация</span>
                        </div>
                      </div>
                      <div className={`ml-1 h-5 w-5 rounded-full border ${isSelected ? 'bg-white border-white' : 'border-white/40 group-hover:border-white/70'}`} />
                    </div>
                    <div className="text-gray-300 text-sm leading-relaxed mb-4 min-h-[60px]">{branch.description}</div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-200">Требования:</div>
                      <ul className="space-y-1">
                        {branch.requirements.map((req, index) => (
                          <li key={index} className="text-xs text-gray-300 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            <button onClick={onClose} className="w-full sm:w-auto px-5 py-3 rounded-lg border border-white/15 text-white bg-white/5 hover:bg-white/10 transition">Отмена</button>
            <button onClick={handleSelectBranch} disabled={!selectedBranch} className={`w-full sm:w-auto px-5 py-3 rounded-lg transition-all ${selectedBranch ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}>Выбрать ветку</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchSelectionModal;
