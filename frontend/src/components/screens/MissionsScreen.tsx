import React, { useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import MainButton from '../MainButton';

type StatusId = 'active' | 'available' | 'soon';

interface MissionItem {
  title: string;
  description: string;
  difficulty: string;
  reward: string;
  status: StatusId;
}

const StyledCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 180px);
  justify-content: center;
  gap: 1rem;
  margin: 0 auto;

  @media (min-width: 640px) { grid-template-columns: repeat(2, 180px); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 180px); }
`;

// Декоративная сфера в левом верхнем углу
const rotateXY = keyframes`
  0% { transform: rotateX(0deg) rotateY(0deg); }
  50% { transform: rotateX(90deg) rotateY(180deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
`;

const DecoOrb = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 180px;
  height: 180px;
  opacity: 0.25;
  pointer-events: none;
  filter: blur(1px);
  .ring {
    position: absolute;
    border: 2px solid rgba(0, 234, 255, 0.4);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(0, 234, 255, 0.25);
    animation: ${rotateXY} 12s linear infinite;
  }
  .ring.r1 { width: 180px; height: 180px; top: 0; left: 0; }
  .ring.r2 { width: 140px; height: 140px; top: 20px; left: 20px; animation-duration: 10s; }
  .ring.r3 { width: 100px; height: 100px; top: 40px; left: 40px; animation-duration: 8s; }
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
};

const StyledCard = styled.div`
  .card {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    color: #fff;
    transition: 0.5s;
    cursor: pointer;
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
  .card:hover { transform: translateY(-8px); }
  .card::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0; left: 0;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    border-radius: 1.2em;
  }
  .card::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    filter: blur(30px);
  }
  .card span {
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    background-color: rgba(0,0,0,0.6);
    z-index: 2;
    border-radius: 1em;
  }
  .card span::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 50%; height: 100%;
    background-color: rgba(255,255,255,0.08);
  }
  .card .content {
    position: relative;
    padding: 10px;
    z-index: 10;
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    font-weight: 700;
  }
  .title { font-size: 0.95rem; line-height: 1.3; }
  .desc { font-size: 0.8rem; opacity: 0.85; margin-top: 0.2rem; }
  .meta { margin-top: auto; display: flex; gap: 0.5rem; font-size: 0.75rem; opacity: 0.9; }
`;

const MissionsScreen: React.FC = () => {
  const [status, setStatus] = useState<StatusId>('active');
  const [page, setPage] = useState<number>(1);
  const pageSize = 6; // 3x2 на десктопе

  // Космические миссии (заглушки)
  const missions: MissionItem[] = useMemo(() => ([
    { title: 'Орбитальный манёвр', description: 'Синхронизируй орбиту с луной Титана', difficulty: 'Средний', reward: '700 XP', status: 'active' },
    { title: 'Экспедиция на Европу', description: 'Пробурить лёд и собрать пробы океана', difficulty: 'Продвинутый', reward: '1200 XP', status: 'available' },
    { title: 'Колония на Церере', description: 'Построить модуль связи для колонии', difficulty: 'Средний', reward: '850 XP', status: 'soon' },
    { title: 'Пояс астероидов', description: 'Добыть редкоземельные элементы', difficulty: 'Продвинутый', reward: '1000 XP', status: 'active' },
    { title: 'Станция Лагранжа', description: 'Стабилизировать энергокольцо станции', difficulty: 'Средний', reward: '750 XP', status: 'available' },
    { title: 'Спасательная операция', description: 'Эвакуация экипажа с дрейфующей капсулы', difficulty: 'Эксперт', reward: '1500 XP', status: 'soon' },
    { title: 'Марсианская буря', description: 'Закрепить солнечные панели базы', difficulty: 'Средний', reward: '650 XP', status: 'active' },
    { title: 'Туманность Ориона', description: 'Картографирование газовых облаков', difficulty: 'Начинающий', reward: '500 XP', status: 'available' },
    { title: 'Аномалия у Плутона', description: 'Исследовать гравитационные всплески', difficulty: 'Продвинутый', reward: '1100 XP', status: 'soon' },
  ]), []);

  const filtered = useMemo(() => {
    return missions.filter(m =>
      status === 'active' ? m.status === 'active' :
      status === 'available' ? m.status === 'available' :
      m.status === 'soon'
    );
  }, [missions, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Добиваем до 6 карточек на страницу заглушками, если не хватает
  const placeholders: MissionItem[] = [
    { title: 'Сектор Андромеды', description: 'Скоро новая миссия', difficulty: '—', reward: '—', status: 'soon' },
    { title: 'Станция «Гелиос»', description: 'Готовится операция', difficulty: '—', reward: '—', status: 'soon' },
    { title: 'Туманность Вуали', description: 'Миссия в разработке', difficulty: '—', reward: '—', status: 'soon' },
    { title: 'Море Спокойствия', description: 'Подготовка к высадке', difficulty: '—', reward: '—', status: 'soon' },
    { title: 'Пояс Койпера', description: 'Скоро исследование', difficulty: '—', reward: '—', status: 'soon' },
    { title: 'Кольца Сатурна', description: 'Ожидается задание', difficulty: '—', reward: '—', status: 'soon' },
  ];
  const itemsToRender = pageItems.length >= pageSize
    ? pageItems
    : [...pageItems, ...placeholders.slice(0, pageSize - pageItems.length)];

  const changeStatus = (id: StatusId) => { setStatus(id); setPage(1); };

  return (
    <div className="h-full pb-8 overflow-y-auto max-h-screen relative">
      <DecoOrb>
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
      </DecoOrb>
      {/* Кнопки главных вкладок удалены */}

      {/* Под-вкладки статуса */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap gap-3 mb-8 justify-center"
      >
        <MainButton onClick={() => changeStatus('active')} className={status === 'active' ? '' : 'opacity-70'}>
          Активные
        </MainButton>
        <MainButton onClick={() => changeStatus('available')} className={status === 'available' ? '' : 'opacity-70'}>
          Доступно
        </MainButton>
        <MainButton onClick={() => changeStatus('soon')} className={status === 'soon' ? '' : 'opacity-70'}>
          Будет позже
        </MainButton>
      </motion.div>

      {/* Сетка карточек */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="px-4"
        transition={{ when: 'beforeChildren' }}
      >
        <StyledCardGrid>
          {itemsToRender.map((m, idx) => (
            <motion.div key={`${m.title}-${idx}`} variants={itemVariants}>
              <StyledCard>
                <div className="card" style={{ width: 180 }}>
                  <span />
                  <div className="content">
                    <div className="title">{m.title}</div>
                    <div className="desc">{m.description}</div>
                    <div className="meta">
                      <div>Сложн.: {m.difficulty}</div>
                      <div>Награда: {m.reward}</div>
                    </div>
                  </div>
                </div>
              </StyledCard>
            </motion.div>
          ))}
        </StyledCardGrid>
      </motion.div>

      {/* Пагинация */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <MainButton disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
          Назад
        </MainButton>
        <div className="text-white/80 text-sm min-w-[100px] text-center">Стр. {currentPage} / {totalPages}</div>
        <MainButton disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
          Вперёд
        </MainButton>
      </div>
    </div>
  );
};

export default MissionsScreen;
