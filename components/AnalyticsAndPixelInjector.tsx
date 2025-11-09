"use client";

import React, { useEffect } from 'react';

interface AnalyticsAndPixelInjectorProps {
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
}

const AnalyticsAndPixelInjector: React.FC<AnalyticsAndPixelInjectorProps> = ({
  googleAnalyticsId,
  facebookPixelId,
}) => {
  useEffect(() => {
    // Google Analytics
    if (googleAnalyticsId) {
      const scriptGA = document.createElement('script');
      scriptGA.async = true;
      scriptGA.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(scriptGA);

      const scriptGAConfig = document.createElement('script');
      scriptGAConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}');
      `;
      document.head.appendChild(scriptGAConfig);
    }

    // Facebook Pixel
    if (facebookPixelId) {
      const scriptFB = document.createElement('script');
      scriptFB.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${facebookPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(scriptFB);
    }
  }, [googleAnalyticsId, facebookPixelId]);

  return null; // This component doesn't render anything visible
};

export default AnalyticsAndPixelInjector;
