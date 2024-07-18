import { useState } from "react";
import { api } from "../utils/api";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import Link from "next/link";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


 const [successMessage, setSuccessMessage] = useState("");
 const [errorMessage, setErrorMessage] = useState("");
 const router = useRouter();

 const registerMutation = api.user.register.useMutation({
   onSuccess: () => {
     setSuccessMessage("User registered successfully!");
     router.push(`/verifyOtp?email=${email}`);
     setErrorMessage("");
     setName("");
     setEmail("");
     setPassword("");
   },
   onError: (error) => {
     setSuccessMessage("");
     setErrorMessage(`Registration error: ${error.message}`);
   }
 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ name, email, password });
    
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center   px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 box-border h-200  py-8 px-5 border-2 rounded-xl ">
        <div>
          <h2 className="mt-3 text-center text-3xl font-bold  text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px py-5 px-5">
            <div>
              <label>Name</label>
              <label htmlFor="name" className="sr-only ">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="py-5">
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
            <div>
              <label>Password</label>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="pt-9">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-8 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
          </div>
        </form>

        <div >
          
          <p className="text-center text-sm text-gray-600">
            Have an account?{" "}
            <Link href="/login" className="text-black hover:text-indigo-500">
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
