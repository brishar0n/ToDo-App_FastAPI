import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    try {
      await logInWithEmailAndPassword(email, password);
      console.log("You're logged in!");
      navigate("/landing");
    } catch (error) {
      // Set the error message state based on the error code
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setSnackbarMessage("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setSnackbarMessage("Invalid email address.");
      } else {
        setSnackbarMessage("An error occurred:", error);
      }
      setOpenSnackbar(true);
      setFormData({ email: "", password: "" });
    }
  };     

  return (
    <div className='bg-stone-50 w-96 mt-28 p-5 rounded-xl shadow-2xl justify-items-center'>
        <h3 className="font-semibold font-sans tracking-widest text-xl flex justify-center">Login</h3>
        <form className='mt-4'>
          <div>
            <label htmlFor="email-address">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              type="email"                                    
              required                                                                                
              placeholder="Email Address"
              onChange={handleChange}
              className='border rounded-md mt-2 mb-2 p-2 w-full'
            />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>
              <input
                id="password"
                name="password"
                value={formData.password}
                type="password"                                    
                required                                                                                
                placeholder="Password"
                onChange={handleChange}
                className='border rounded-md mt-2 mb-2 p-2 w-full'
              />
          </div>

          <div>
            <button type="submit" onClick={handleLogin} className="w-full bg-lime-900 mt-4 hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Login
            </button>

            <button onClick={signInWithGoogle} className="w-full bg-transparent mt-4 hover:bg-gray-200 text-gray-800 py-2 px-4 border-4 border-gray-300 rounded focus:shadow-outline flex items-center justify-center">
            Login with Google
            <span className="ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
            </span> 
          </button>

          </div>  
        </form>

        <p className="text-sm mt-5 flex justify-center items-center">
          No account yet?&nbsp;
          <Link to="/" className='text-blue-600 font-semibold hover:underline'>
            Register here.
          </Link>
        </p>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
          }}
        >
          <SnackbarContent
            style={{
            backgroundColor: '#f44336',
            color: '#fff',
            }}
            message={snackbarMessage}
          />
        </Snackbar>
    </div>
  )
};

export default Login;