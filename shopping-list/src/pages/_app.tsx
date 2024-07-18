import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "./layout";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (

    <Layout>
 <div className={GeistSans.className}>
  
  <Component {...pageProps} />

</div>
    </Layout>
   
  );
};

export default api.withTRPC(MyApp);
