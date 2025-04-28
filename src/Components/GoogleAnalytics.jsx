import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

const GoogleAnalytics = ({ analytics, tag }) => {
  useEffect(() => {
    // Create and inject the noscript iframe
    const noscript = document.createElement("noscript");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${tag}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.appendChild(noscript);

    // Cleanup function to remove the iframe on component unmount
    return () => {
      document.body.removeChild(noscript);
    };
  }, [tag]);

  return (
    <>
      {analytics && tag && (
        <Helmet>
          {/* Google Tag Manager */}
          <script type="text/javascript">
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${tag}');
            `}
          </script>

          {/* Google Analytics */}
          <script type="text/javascript">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analytics}');
            `}
          </script>
        </Helmet>
      )}
      {/* <script
        src="https://www.google.com/recaptcha/api.js?render=6LeBO30pAAAAALXfC5oAKUATKjhA_ErnmPW5N2Ut"
        async
        defer
      ></script> */}
    </>
  );
};

export default GoogleAnalytics;
