import React, { useEffect, useState } from 'react';

const useScaleLayout = () => {
  const [windowSize, setWindowSize] = useState<number>();

  useEffect(() => {
          const handleResize = () => {
              setWindowSize(window.innerWidth);
          };
  
          window.addEventListener("resize", handleResize);
  
          handleResize();
  
          return () => {
              window.removeEventListener("resize", handleResize);
          };
      }, [])
  useEffect(() => {
    if (windowSize < 1024) {
      (document.body.style as any).zoom = 'unset';
      document.documentElement.style.setProperty('--100vh', `100vh`);
      return;
    }
    (document.body.style as any).zoom = `${windowSize / 1920}`;
    document.documentElement.style.setProperty(
      '--100vh',
      `calc(100vh/(${windowSize / 1920}))`
    );
    document.documentElement.style.setProperty(
      '--80vh',
      `calc(80vh/(${windowSize / 1920}))`
    );
  }, [windowSize]);
};

export default useScaleLayout;