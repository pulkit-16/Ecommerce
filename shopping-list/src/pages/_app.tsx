import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "./layout";
import { useRouter } from "next/router";
import { useEffect } from "react";



const MyApp: AppType = ({ Component, pageProps }) => {

  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      router.push('/login');
    }
  }, [router]);

  return (

    <Layout>
 <div className={GeistSans.className}>
  
  <Component {...pageProps} />

</div>
    </Layout>
   
  );
};

export default api.withTRPC(MyApp);
