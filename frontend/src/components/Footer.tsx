import React from 'react';
import { motion } from 'framer-motion';

// Glitch Text Component
const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  const [glitchText, setGlitchText] = React.useState(text);

  React.useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
      const shouldGlitch = Math.random() < 0.4;
      
      if (shouldGlitch) {
        const glitched = text
          .split('')
          .map(char => Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
          .join('');
        setGlitchText(glitched);
        
        setTimeout(() => setGlitchText(text), 200);
      }
    }, 1500);

    return () => clearInterval(glitchInterval);
  }, [text]);

  return (
    <p className="text-xs text-white/60 font-mono tracking-widest relative">
      <span className="relative z-10">{glitchText}</span>
      <span className="absolute inset-0 text-blue-500/30 blur-sm animate-pulse">
        {glitchText}
      </span>
    </p>
  );
};

interface ScaryFooterProps {
  companyName?: string;
  links?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ icon: React.ReactNode; href: string; label: string }>;
  onPrivacyClick?: () => void;
  onCookiesClick?: () => void;
}

const ScaryFooter: React.FC<ScaryFooterProps> = ({
  companyName = "Алабуга.TECH",
  links = [
    { label: "Политика обработки и защиты персональных данных", href: "#privacy-policy" },
    { label: "Управление cookies", href: "#cookies" }
  ],
  onPrivacyClick,
  onCookiesClick,
  socialLinks = [
    { 
      icon: (
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2.5} stroke="currentColor" fill="none" viewBox="0 0 48 48" className="w-6 h-6">
          <path d="M 5.4355469 10.957031 C 3.1940971 10.957031 1.4873184 13.161086 2.1054688 15.328125 C 3.7149365 20.976871 6.1008234 26.508318 9.6621094 30.857422 C 13.223395 35.206526 18.039918 38.358951 24.199219 38.984375 C 26.249401 39.19239 28.017578 37.521139 28.017578 35.494141 L 28.017578 31.447266 C 28.017578 31.194748 28.190043 31.015308 28.386719 31.009766 C 28.423139 31.008896 28.452253 31.007813 28.470703 31.007812 C 29.178043 31.007812 30.631501 31.893981 31.908203 33.271484 C 33.184905 34.648988 34.314098 36.354273 34.857422 37.298828 L 34.857422 37.300781 C 35.472179 38.36767 36.617685 39.011719 37.835938 39.011719 L 42.708984 39.011719 C 45.135955 39.013519 46.759978 36.271923 45.572266 34.148438 C 43.707529 30.813171 39.987356 27.514403 38.126953 25.869141 C 41.535533 22.126008 43.795468 18.046772 44.796875 15.341797 C 45.552594 13.298086 43.994375 10.998047 41.796875 10.998047 L 38.318359 10.998047 C 36.806296 10.998047 35.396532 11.734785 34.820312 12.914062 C 32.113082 18.46169 29.699958 20.499254 28 21.966797 L 28 14.439453 C 28 12.561528 26.441788 11.013274 24.570312 11.009766 L 18.478516 11 C 16.538627 10.9976 15.335757 13.393494 16.498047 14.947266 L 17.673828 16.521484 L 17.675781 16.525391 C 17.877299 16.791881 17.984375 17.111197 17.984375 17.439453 L 17.984375 17.441406 L 18.007812 23.71875 C 15.584865 21.163426 12.952504 15.750557 12.158203 13.335938 L 12.158203 13.333984 C 11.694311 11.923494 10.359752 10.971123 8.8867188 10.966797 L 8.8847656 10.966797 L 5.4375 10.957031 L 5.4355469 10.957031 z"/>
        </svg>
      ), 
      href: "http://vk.com/sezalabuga", 
      label: "ВКонтакте" 
    },
    { 
      icon: (
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2.5} stroke="currentColor" fill="none" viewBox="0 0 50 50" className="w-6 h-6">
          <path d="M27.019,3.096 c0.173,14.632,1.952,19.694,19.885,19.89C45.947,12.446,37.559,4.056,27.019,3.096z"/>
          <path d="M27.019,46.904 c10.539-0.96,18.927-9.35,19.885-19.89C28.971,27.21,27.193,32.272,27.019,46.904z"/>
          <path d="M3.096,22.987 c17.879-0.206,19.647-5.272,19.821-19.886C12.407,4.089,4.05,12.468,3.096,22.987z"/>
          <path d="M3.096,27.013 c0.955,10.52,9.311,18.899,19.821,19.886C22.743,32.285,20.975,27.218,3.096,27.013z"/>
        </svg>
      ), 
      href: "https://zen.yandex.ru/id/623327a92c98734ec2e11151", 
      label: "Яндекс Дзен" 
    },
    { 
      icon: (
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={1} stroke="currentColor" fill="none" viewBox="0 0 16 16" className="w-6 h-6">
          <path d="M 15.498047 1.0019531 A 0.50005 0.50005 0 0 0 15.314453 1.0371094 L 0.31445312 7.0371094 A 0.50005 0.50005 0 0 0 0.27734375 7.9472656 L 4.0976562 9.859375 L 5.4902344 13.671875 A 0.50005 0.50005 0 0 0 6.2695312 13.894531 L 8.5078125 12.130859 L 12.199219 14.900391 A 0.50005 0.50005 0 0 0 12.986328 14.613281 L 15.986328 1.6132812 A 0.50005 0.50005 0 0 0 15.498047 1.0019531 z M 14.798828 2.3203125 L 12.185547 13.640625 L 8.8007812 11.101562 A 0.50005 0.50005 0 0 0 8.1914062 11.107422 L 6.6855469 12.294922 L 6.9648438 10.744141 L 11.853516 5.8554688 A 0.50005 0.50005 0 0 0 11.476562 5.0019531 A 0.50005 0.50005 0 0 0 11.251953 5.0664062 L 4.4824219 8.9355469 L 1.7167969 7.5527344 L 14.798828 2.3203125 z"/>
        </svg>
      ), 
      href: "https://t.me/AlabugaOEZ", 
      label: "Telegram" 
    }
  ]
}) => {
  const [glitchText, setGlitchText] = React.useState(companyName);
  const [eyePositions, setEyePositions] = React.useState<Array<{ x: number; y: number }>>([]);

  React.useEffect(() => {
    // Glitch effect for company name
    const glitchInterval = setInterval(() => {
      const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
      const shouldGlitch = Math.random() < 0.3;
      
      if (shouldGlitch) {
        const glitched = companyName
          .split('')
          .map(char => Math.random() < 0.4 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
          .join('');
        setGlitchText(glitched);
        
        setTimeout(() => setGlitchText(companyName), 150);
      }
    }, 2000);

    // Generate random eye positions
    const eyes = Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setEyePositions(eyes);

    return () => clearInterval(glitchInterval);
  }, [companyName]);

  return (
    <motion.footer 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative text-white overflow-hidden border-t border-white/20 backdrop-blur-xl"
      style={{
        background: 'rgba(36, 43, 140, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Red glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent" />
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          {/* Company section with glitch effect */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-500 font-mono tracking-wider filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              {glitchText}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Добро пожаловать в мир инноваций. Мы специализируемся на передовых технологиях, 
              экономическом развитии и создании будущего. Ваши мечты - наша экспертиза.
            </p>
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-4 h-4 animate-bounce text-blue-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span className="text-xs font-mono">ОСНОВАНА В 2005</span>
            </div>
          </div>

          {/* Links section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-500 flex items-center space-x-2">
              <div className="w-5 h-5 text-blue-500">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <span>Конфиденциальность</span>
            </h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  {link.href === '#privacy-policy' && onPrivacyClick ? (
                    <button
                      onClick={() => {
                        console.log('Privacy policy clicked!');
                        onPrivacyClick();
                      }}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:underline decoration-blue-500 underline-offset-4 group flex items-center space-x-2"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </button>
                  ) : link.href === '#cookies' && onCookiesClick ? (
                    <button
                      onClick={() => {
                        console.log('Cookies clicked!');
                        onCookiesClick();
                      }}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:underline decoration-blue-500 underline-offset-4 group flex items-center space-x-2"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:underline decoration-blue-500 underline-offset-4 group flex items-center space-x-2"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-500 flex items-center space-x-2">
              <div className="w-5 h-5 text-blue-500">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span>Контакты</span>
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-blue-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <a 
                  href="https://www.alabuga.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  www.alabuga.ru
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 text-blue-500 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <a 
                  href="https://maps.google.com/maps?q=423601,+Республика+Татарстан,+Елабужский+район,+ул+Ш-2+(ОЭЗ+Алабуга+Тер.),+д.+4/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <div>423601, Республика Татарстан (Татарстан),</div>
                  <div>р-н Елабужский, ул Ш-2 (ОЭЗ Алабуга Тер.), д. 4/1</div>
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-blue-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <a 
                  href="mailto:invest@alabuga.ru"
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  invest@alabuga.ru
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-blue-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <span>+7 (85557) 7-90-03</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider with scary effect */}
        <div className="relative my-4">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Social links */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 flex items-center space-x-2">
              <div className="w-4 h-4 text-blue-500">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span>Следите за нами:</span>
            </span>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <div key={index} className="group relative">
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110 block"
                  >
                    <div className="text-white/80 group-hover:text-[#44d2fa] transition-colors hover:scale-125 duration-200">
                      {social.icon}
                    </div>
                  </a>
                  <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-white/20 bg-transparent py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 text-white">
                    {social.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Developer info with social links */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 font-mono">
              Разработано <span className="text-blue-400 font-bold">No PHP - No problems</span>
            </span>
            <div className="flex space-x-3">
              <div className="group relative">
                <a
                  href="https://github.com/linskay/alabuga"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-full transition-all duration-300 hover:scale-110 block"
                >
                  <div className="text-white/80 group-hover:text-[#44d2fa] transition-colors hover:scale-125 duration-200">
                    <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2.5} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                </a>
                <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-white/20 bg-transparent py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 text-white">
                  GitHub
                </span>
              </div>
              
              <div className="group relative">
                <a
                  href="https://t.me/samtakoy4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="p-2 rounded-full transition-all duration-300 hover:scale-110 block"
                >
                  <div className="text-white/80 group-hover:text-[#44d2fa] transition-colors hover:scale-125 duration-200">
                    <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={1} stroke="currentColor" fill="none" viewBox="0 0 16 16" className="w-6 h-6">
                      <path d="M 15.498047 1.0019531 A 0.50005 0.50005 0 0 0 15.314453 1.0371094 L 0.31445312 7.0371094 A 0.50005 0.50005 0 0 0 0.27734375 7.9472656 L 4.0976562 9.859375 L 5.4902344 13.671875 A 0.50005 0.50005 0 0 0 6.2695312 13.894531 L 8.5078125 12.130859 L 12.199219 14.900391 A 0.50005 0.50005 0 0 0 12.986328 14.613281 L 15.986328 1.6132812 A 0.50005 0.50005 0 0 0 15.498047 1.0019531 z M 14.798828 2.3203125 L 12.185547 13.640625 L 8.8007812 11.101562 A 0.50005 0.50005 0 0 0 8.1914062 11.107422 L 6.6855469 12.294922 L 6.9648438 10.744141 L 11.853516 5.8554688 A 0.50005 0.50005 0 0 0 11.476562 5.0019531 A 0.50005 0.50005 0 0 0 11.251953 5.0664062 L 4.4824219 8.9355469 L 1.7167969 7.5527344 L 14.798828 2.3203125 z"/>
                    </svg>
                  </div>
                </a>
                <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-white/20 bg-transparent py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 text-white">
                  Telegram
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-2 text-center mb-1">
          <p className="text-sm text-gray-400 font-mono">
            © {new Date().getFullYear()} {companyName}. Все права защищены.
          </p>
        </div>

        {/* Glitch message */}
        <div className="text-center">
          <GlitchText text="БУДУЩЕЕ НАЧИНАЕТСЯ ЗДЕСЬ" />
        </div>
      </div>

      {/* Subtle shadow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent pointer-events-none" />
    </motion.footer>
  );
};

export default ScaryFooter;