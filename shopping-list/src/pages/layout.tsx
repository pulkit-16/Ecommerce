import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div >
       
       
      <nav className="bg-white  py-9 pb-0.5">

      <div className="flex items-center space-x-5 absolute top-1 right-4  text-xs pb-0.5 ">
           
           <span className="text-gray-900 hover:text-gray-700 cursor-pointer">Help</span>
       
        
           <span className="text-gray-900 hover:text-gray-700 cursor-pointer">Orders & Returns</span>
        
         
           <span className="text-gray-900 hover:text-gray-700 cursor-pointer">Hi, John</span>
        
        
        
        
        </div>

        <div className="  mx-8 flex justify-between items-center py-2 ">
        <span className="text-2xl font-bold text-gray-900 ">ECOMMERCE</span>
          <div className="flex items-center ">
            
        
            <ul className="flex    space-x-5   font-bold mr-8 pr-12 ">
              <li>
                
                  <span className="text-gray-900 hover:text-gray-700 cursor-pointer ">Categories</span>
             
              </li>
              <li>
                
                  <span className="text-gray-900 hover:text-gray-700 cursor-pointer">Sale</span>
               
              </li>
              <li>
                
                  <span className="text-gray-900 hover:text-gray-700 cursor-pointer">Clearance</span>
              
              </li>
              <li>
                  <span className="text-gray-900 hover:text-gray-700 cursor-pointer">New stock</span>
                
              </li>
              <li>
                
                  <span className="text-gray-900 hover:text-gray-700 cursor-pointer">Trending</span>
               
              </li>
            </ul>
          </div>
       
         

            <span  className='flex space-x-6'>
            <i className="fa-solid fa-magnifying-glass"></i>

            <i className="fa-solid fa-cart-shopping"></i>
            </span>
        </div>
        <div className="bg-gray-100 py-2">
          <div className="container mx-auto text-center">
           
              <span >
                <span className=" p-2 rounded ">
                <i className="fa-solid fa-angle-left pr-4"></i>
                  Get 10% Off on business sign up</span>
                  <i className="fa-solid fa-angle-right pl-4"></i>
              </span>
           
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
