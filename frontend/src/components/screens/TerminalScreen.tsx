import React, { useEffect, useState } from 'react';
import MainButton from '../MainButton';
import styled, { keyframes } from 'styled-components';
import CircularLoader from '../CircularLoader';
import { backend, ShopItemDTO } from '../../api';

// Фоновое размещение нашей сферической анимации (CircularLoader)
const LoaderBg = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  opacity: 0.18;
  pointer-events: none;
  transform: scale(0.9);
`;

const rocketFly = keyframes`
  0% { transform: translate(-10%, -10%) rotate(-15deg); opacity: 0.6; }
  50% { transform: translate(60%, 20%) rotate(0deg); opacity: 0.9; }
  100% { transform: translate(120%, -10%) rotate(15deg); opacity: 0.6; }
`;

const Rocket = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 18px;
  height: 18px;
  animation: ${rocketFly} 5s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.7));
`;

const TerminalScreen: React.FC = () => {
  const [tab, setTab] = useState<'nexus' | 'history'>('nexus');
  const [page, setPage] = useState<number>(1);
  const pageSize = 6; // 3x2 на странице

  const [items, setItems] = useState<{ title: string; desc: string }[]>([
    { title: 'Квантовый модуль', desc: 'Ускоряет навигацию по гиперпространству' },
    { title: 'Ядро сингулярности', desc: 'Стабилизирует энергосети корабля' },
    { title: 'Двигатель «Гидра»', desc: 'Повышает маневренность на орбите' },
    { title: 'Щит «Атлас»', desc: 'Поглощает микрометеоритные удары' },
    { title: 'Сканер «Нептун»', desc: 'Выявляет аномалии на дальних дистанциях' },
    { title: 'Дрон «Церера»', desc: 'Автоматизирует добычу ресурсов' },
    { title: 'Маяк «Гелиос»', desc: 'Передаёт сигналы через ионосферу' },
    { title: 'Контур «Персей»', desc: 'Снижает турбулентность в штормах' },
    { title: 'Иниціатор «Орфей»', desc: 'Запускает автономные протоколы' },
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await backend.shop.available();
        if (!mounted) return;
        const mapped = data.map((d: ShopItemDTO) => ({ title: d.name, desc: d.description || '' }));
        if (mapped.length) setItems(mapped);
      } catch (e: any) {
        setError(e?.message || 'Не удалось загрузить товары');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="h-full pb-8 overflow-y-auto max-h-screen relative">
      <LoaderBg>
        <CircularLoader />
      </LoaderBg>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <MainButton onClick={() => setTab('nexus')} className={tab === 'nexus' ? '' : 'opacity-70'}>
          Нексус
        </MainButton>
        <MainButton onClick={() => setTab('history')} className={tab === 'history' ? '' : 'opacity-70'}>
          История
        </MainButton>
      </div>

      {tab === 'nexus' && (
        <div className="px-4">
          {error && (
            <div className="mb-4 text-sm text-red-300">{error} — показаны демонстрационные данные</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {pageItems.map((it, i) => (
              <div key={i} className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1 w-full max-w-[340px]">
                <div className="text-white rounded-2xl border border-white/10 shadow-2xl relative backdrop-blur-xl overflow-hidden hover:border-white/25 hover:shadow-white/5 w-full">
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <div style={{ background: 'linear-gradient(135deg, rgba(0,174,239,0.05), rgba(0,174,239,0.12))' }} className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700" style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.2), transparent 60%)' }}></div>
                    <div className="absolute top-10 left-10 w-16 h-16 rounded-full blur-xl" style={{ backgroundColor: 'rgba(0,174,239,0.15)' }}></div>
                    <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full blur-lg" style={{ backgroundColor: 'rgba(0,174,239,0.12)' }}></div>
                    <div className="absolute inset-0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.15), transparent)' }}></div>
                  </div>
                  <div className="p-6 relative z-10 text-center" style={{ background: 'linear-gradient(135deg, #031521, #061a27)' }}>
                    <Rocket>
                      <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fill="#ffffff" d="M12 2c3.5 0 6 2.5 6 2.5s-.3 3.2-2.1 5c-.5.5-1 .9-1.6 1.2l-.8 2c-.2.6-.7 1-1.3 1.2l-2 .7c-.3.1-.6.1-.8-.1l-1.9-1.9c-.2-.2-.2-.5-.1-.8l.7-2c.2-.6.6-1.1 1.2-1.3l2-.8c.3-.6.7-1.1 1.2-1.6C14.8 4.8 18 4.5 18 4.5S15.5 2 12 2zm-6.6 9.9l2.7.7-.7 2.1-2.7-.7.7-2.1zM6 16l2 2-3 1 1-3z"/>
                      </svg>
                    </Rocket>
                    <h3 className="mb-2 text-2xl font-bold" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(200,240,255,0.95))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                      {it.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(200,240,255,0.85)' }}>{it.desc}</p>
                    <div className="mt-6 w-1/3 h-0.5 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.8), transparent)' }}></div>
                  </div>
                </div>
              </div>
          ))}
        </div>
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
      )}

      {tab === 'history' && (
        <div className="px-4">
          <div className="overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl" style={{ border: '1px solid rgba(0,174,239,0.25)', background: 'linear-gradient(135deg, #031521, #061a27)' }}>
            <div className="h-12 flex items-center px-4" style={{ background: 'linear-gradient(90deg, rgba(0,174,239,0.25), rgba(0,174,239,0.12), transparent)' }}>
              <span className="font-semibold" style={{ color: 'rgba(200,240,255,0.95)' }}>История операций</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(0,174,239,0.12)' }}>
              {[
                { action: 'Активация модуля', detail: 'Квантовый модуль', time: '02:14' },
                { action: 'Обновление ядра', detail: 'Ядро сингулярности', time: '02:09' },
                { action: 'Калибровка щита', detail: 'Атлас', time: '01:58' },
                { action: 'Диагностика двигателя', detail: 'Гидра', time: '01:41' },
                { action: 'Запуск дрона', detail: 'Церера', time: '01:10' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 px-4 py-3 transition-colors" style={{ color: 'rgba(200,240,255,0.9)' }}>
                  <div className="font-medium">{row.action}</div>
                  <div style={{ color: 'rgba(200,240,255,0.75)' }}>{row.detail}</div>
                  <div className="text-right" style={{ color: 'rgba(200,240,255,0.85)' }}>{row.time}</div>
                </div>
              ))}
            </div>
            <div className="h-1 animate-pulse" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.45), transparent)' }} />
              </div>
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
