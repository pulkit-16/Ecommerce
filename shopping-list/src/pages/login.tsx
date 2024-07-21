import { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const[showPassword,setShowPassword] = useState(false);

  const router = useRouter();
  const loginMutation = api.user.login.useMutation({
    onSuccess: (data) => {
      setSuccessMessage("Login successful!");
      setErrorMessage("");
      // Optionally, you can handle the token, e.g., save it in local storage
      document.cookie = `token=${data.token}; path=/`; // Set token in cookies
      localStorage.setItem("token", data.token);
      router.push("/categories");
    },
    onError: (error) => {
      setSuccessMessage("");
      if (error.message === "Please verify your email to log in") {
        setErrorMessage("You need to verify your email before logging in.");
        setTimeout(() => {
          router.push(`/register?email=${email}&step=2`);
        }, 2000);
      } else {
        setErrorMessage(`Login error: ${error.message}`);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
    //  router.push("/categories");
    } catch (error) {
      // Error handling will be managed by onError in loginMutation
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };



  return (
    <div className="min-h-screen flex items-center justify-center  py px-4 ">
      <div className="max-w-md w-full space-y-8 box-border py-8 px-5 border-2 rounded-xl ">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">Login</h1>
          <h2 className="mt-6 text-center text-xl font-bold text-gray-900">
            Welcome back to ECOMMERCE
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The next gen business marketplace
          </p>
        </div>
        <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-p px-5">
            <div>
              <label>Email</label>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="py-5">
              <label>Password</label>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border
                 border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
               </div> 
            </div>
            <div className="py-6">
            <button
              type="submit"
              className=" w-full flex justify-center py-2 px-8 border border-transparent
               text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
      
          </div>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
        
        </form>

        <div >
          <hr className="border-gray-300" />
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-black hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>


      </div>
    </div>
  );


 };

export default Login;
