import Script from "next/script";
import { GTM_ID, HUBSPOT } from "@/lib/site";

/**
 * GTM (which loads GA4 + Google Ads) and HubSpot tracking, same IDs as the live site.
 * Opt-in: only renders when NEXT_PUBLIC_ENABLE_ANALYTICS=1 (set it on the production deploy only),
 * so local, preview and staging builds never send hits to the client's real accounts.
 * lazyOnload keeps both off the critical path.
 */
export function Analytics() {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "1") return null;
  return (
    <>
      <Script id="gtm" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <Script id="hs-script-loader" strategy="lazyOnload" src={`https://js-${HUBSPOT.region}.hs-scripts.com/${HUBSPOT.portalId}.js`} />
    </>
  );
}
