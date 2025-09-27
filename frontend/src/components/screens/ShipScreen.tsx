import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ShinyText from '../ShinyText';
import MainButton from '../MainButton';
import { backend, ArtifactDTO } from '../../api';

const StyledFlip = styled.div`
  .container { width: 240px; height: 294px; perspective: 900px; }
  .card { height: 100%; width: 100%; position: relative; transition: transform 1200ms; transform-style: preserve-3d; border-radius: 2rem; }
  .container:hover > .card { cursor: pointer; transform: rotateY(180deg) rotateZ(180deg); }
  .front, .back { height: 100%; width: 100%; border-radius: 2rem; position: absolute; backface-visibility: hidden; color: #e6f7ff; display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 0 14px 2px rgba(0, 174, 239, 0.35); background: linear-gradient(-135deg, #0a1b2a, #016a8a); }
  .back { transform: rotateY(180deg) rotateZ(180deg); }
  .front-heading, .back-heading { font-size: 18px; font-weight: 700; letter-spacing: .5px; }
`;

const StyledGlow = styled.div`
  .card { position: relative; width: 190px; height: 254px; background: linear-gradient(137deg, rgba(0,174,239,1) 0%, rgba(0,212,255,1) 100%); transition: 0.3s ease; border-radius: 30px; filter: drop-shadow(0 0 30px rgba(0, 174, 239, 0.45)); }
  .card::after { content: ''; background-color: #0b1320; position: absolute; z-index: 1; transition: 0.3s ease; height: 98%; width: 98%; top: 1%; left: 1%; border-radius: 28px; }
  .card:hover { filter: drop-shadow(0 0 30px rgba(0, 174, 239, 0.9)); }
`;

const ShipScreen: React.FC = () => {
  const [pageCosmo, setPageCosmo] = useState(1);
  const [pageArte, setPageArte] = useState(1);
  const pageSize = 6; // 3x2

  const cosmoCards = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ id: i+1, title: `Космокарта #${i+1}` })), []);
  const [artefacts, setArtefacts] = useState<{ id: number; name?: string }[]>(
    Array.from({ length: 18 }, (_, i) => ({ id: i+1 }))
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await backend.artifacts.active();
        if (!mounted) return;
        const mapped = data.map((a: ArtifactDTO) => ({ id: a.id, name: a.name }));
        if (mapped.length) setArtefacts(mapped);
      } catch (e: any) {
        setError(e?.message || 'Не удалось загрузить артефакты');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const totalCosmo = Math.max(1, Math.ceil(cosmoCards.length / pageSize));
  const totalArte = Math.max(1, Math.ceil(artefacts.length / pageSize));
  const cosmoPageItems = cosmoCards.slice((pageCosmo-1)*pageSize, pageCosmo*pageSize);
  const artePageItems = artefacts.slice((pageArte-1)*pageSize, pageArte*pageSize);

  return (
    <div className="h-full pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Подзаголовок */}
        <div className="mt-6 mb-6">
          <h2 className="text-center">
            <ShinyText text="КОЛЛЕКЦИЯ КОСМОКАРТ" speed={6} />
          </h2>
        </div>

        {/* Космокарты: 3 в ряд + пагинация */}
        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 justify-items-center">
          {cosmoPageItems.map((c) => (
            <StyledFlip key={c.id}>
              <div className="container">
                <div className="card">
                  <div className="front">
                    <p className="front-heading">{c.title}</p>
                    <p>Секреты галактики</p>
                  </div>
                  <div className="back">
                    <p className="back-heading">{c.title}</p>
                    <p>Редкая космокарта</p>
                  </div>
                </div>
              </div>
            </StyledFlip>
          ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center space-x-4">
          <MainButton
            onClick={() => setPageCosmo(p => Math.max(1, p - 1))}
            disabled={pageCosmo === 1}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            ← Назад
          </MainButton>
          <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            Страница {pageCosmo} из {totalCosmo}
          </span>
          <MainButton
            onClick={() => setPageCosmo(p => Math.min(totalCosmo, p + 1))}
            disabled={pageCosmo === totalCosmo}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Вперёд →
          </MainButton>
        </div>

        {/* Коллекция артефактов */}
        <div className="mt-12 mb-6 text-center">
          <ShinyText text="КОЛЛЕКЦИЯ АРТЕФАКТОВ" speed={6} />
        </div>
        <div className="mx-auto" style={{ maxWidth: '660px' }}>
          {error && (
            <div className="mb-4 text-sm text-red-300 text-center">{error} — показаны демонстрационные данные</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 justify-items-center">
            {artePageItems.map((a) => (
              <StyledGlow key={a.id}>
                <div className="card" title={a.name || `Артефакт #${a.id}`} />
              </StyledGlow>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center space-x-4">
          <MainButton
            onClick={() => setPageArte(p => Math.max(1, p - 1))}
            disabled={pageArte === 1}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            ← Назад
          </MainButton>
          <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            Страница {pageArte} из {totalArte}
          </span>
          <MainButton
            onClick={() => setPageArte(p => Math.min(totalArte, p + 1))}
            disabled={pageArte === totalArte}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Вперёд →
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default ShipScreen;
