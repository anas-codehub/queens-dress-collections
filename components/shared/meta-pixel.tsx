"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function trackEvent(
  event: string,
  data?: Record<string, any>,
  eventId?: string,
) {
  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("track", event, data, { eventID: eventId });
    } else {
      window.fbq("track", event, data);
    }
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  // Track PageView on route change only.
  // The first PageView is fired by the init script below,
  // so we skip it here to avoid counting it twice.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
