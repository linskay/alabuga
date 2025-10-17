import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedStars from '../components/AnimatedStars';
import Loader from '../components/Loader';

interface CookiesPageProps {
  onBack?: () => void;
}

const CookiesPage: React.FC<CookiesPageProps> = ({ onBack }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Проверяем, загружены ли все ресурсы
    const checkIfLoaded = () => {
      if (document.readyState === 'complete') {
        setShowLoader(false);
        setIsLoaded(true);
      }
    };

    // Если страница уже загружена
    if (document.readyState === 'complete') {
      setShowLoader(false);
      setIsLoaded(true);
    } else {
      // Слушаем событие загрузки
      window.addEventListener('load', checkIfLoaded);
      
      // Fallback таймер на случай, если событие load не сработает
      const fallbackTimer = setTimeout(() => {
        setShowLoader(false);
        setIsLoaded(true);
      }, 1000);

      return () => {
        window.removeEventListener('load', checkIfLoaded);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  const handleMenuToggle = () => {
    // Handle menu toggle if needed
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-cosmic" style={{ cursor: 'default' }}>
      {/* Loader */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Stars */}
      <AnimatedStars />
      
      <Header onMenuToggle={handleMenuToggle} showBackButton={true} onBack={onBack} />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 pt-20 pb-8 max-h-screen overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-white"
          >
            <h1 className="text-3xl font-bold mb-6 text-center">
              СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ В ВИДЕ COOKIE-ФАЙЛОВ
            </h1>
            
            <div className="text-sm leading-relaxed space-y-4">
              <p className="mb-6">
                На основании статей 9, 11 Федерального закона от 27 июля 2006 г. № 152-ФЗ «О персональных данных», свободно, своей волей и в своём интересе даю конкретное, информированное и сознательное согласие Акционерному обществу «Особая экономическая зона промышленно-производственного типа «Алабуга», юридический адрес: 423601, Республика Татарстан (Татарстан), район Елабужский, улица Ш-2 (ОЭЗ Алабуга тёр.), д. 4/1 (далее — Оператор) на автоматизированную обработку своих персональных данных, включая сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, обезличивание, блокирование, уничтожение персональных данных, их проверку в целях идентификации пользователей сайта https://alabuga.ru/ru, предоставление доступа к функционалу сайта, персонализацию предоставляемых сервисов и услуг сайта, проведение исследований, направленных на улучшение качества продуктов и сервисов сайта, и/или создание новых продуктов и сервисов сайта.
              </p>

              <p className="mb-4">
                Настоящее согласие даётся мной для обработки персональных данных — файлов cookies, содержащих технические данные о моём устройстве, в т.ч. аналитические cookie — данные, необходимые для анализа посещаемости сайта, поведения пользователя при использовании сайта:
              </p>

              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-sm">
                  <li>• IP адрес;</li>
                  <li>• идентификатор пользователя, присваиваемый сайтом;</li>
                  <li>• страна пользователя;</li>
                  <li>• регион пользователя;</li>
                  <li>• браузер пользователя;</li>
                  <li>• операционная система пользователя;</li>
                  <li>• дата и время посещения сайта;</li>
                  <li>• источник перехода (UTM метка);</li>
                  <li>• значение UTM меток от source до content;</li>
                  <li>• уникальный идентификатор, присваиваемый сторонним интернет-сервисом;</li>
                  <li>• посещённые страницы;</li>
                  <li>• количество посещений страниц;</li>
                  <li>• информация о перемещении по страницам сайта (в т.ч. запись движения мыши, нажатий на ссылки и элементы сайта);</li>
                  <li>• длительность пользовательской сессии, точки входа (сторонние сайты, с которых пользователь по ссылке);</li>
                  <li>• точки выхода (ссылки на сайте, по которым пользователь переходит).</li>
                </ul>
              </div>

              <p className="mb-4">
                Настоящее согласие вступает в силу с момента моего перехода на сайт Оператора и действует до момента окончания пользования сайтом Оператора либо до дня отзыва согласия с правом Оператора продолжить обработку Персональных данных в установленных законодательством случаях.
              </p>

              <p className="mb-4">
                Субъект персональных данных вправе отозвать данное согласие на обработку своих персональных данных, уведомив об этом Оператора письменно или путём направления электронного документа, подписанного электронной подписью в соответствии с условиями законодательства Российской Федерации.
              </p>

              <p className="mb-6">
                В случае отзыва субъектом персональных данных согласия на обработку своих персональных данных Оператор обязан прекратить их обработку или обеспечить прекращение такой обработки (если обработка персональных данных осуществляется другим лицом, действующим по поручению Оператора) и в случае, если сохранение персональных данных более не требуется для целей обработки персональных данных, уничтожить персональные данные или обеспечить их уничтожение (если обработка персональных данных осуществляется другим лицом, действующим по поручению Оператора) в срок, не превышающий тридцати дней с даты поступления указанного отзыва. В случае отсутствия возможности уничтожения персональных данных в течение указанного срока Оператор осуществляет блокирование таких персональных данных или обеспечивает их блокирование (если обработка персональных данных осуществляется другим лицом, действующим по поручению Оператора) и обеспечивает уничтожение персональных данных в срок не более чем шесть месяцев.
              </p>

            </div>
          </motion.div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default CookiesPage;
