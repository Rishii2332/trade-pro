import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { account } from "../appwrite/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/authService";
import { useEffect } from "react";

function Login(){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    useEffect(() => {
    const checkUser = async () => {
        try {
            const user = await authService.getCurrentUser();

            if (user) {
                navigate("/home");
            }
        } catch (error) {
            console.log("No active session");
        }
    };

    checkUser();
}, [navigate]);

    const handleLogin = async (e) => {

    e.preventDefault();

    try {

        await authService.login(

            email,

            password

        );

        navigate("/home");

    } catch (error) {
    console.error(error);
    alert(error.message);
}

};
return(

<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 flex justify-center items-center">

<div className="w-[420px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">

<div className="flex justify-center">

<FaUserCircle className="text-white text-7xl"/>

</div>

<h1 className="text-center text-4xl font-bold text-white mt-4">

Welcome Back

</h1>

<p className="text-center text-gray-300 mt-2">

Login to continue

</p>

<form onSubmit={handleLogin}
className="mt-8 space-y-5">

<div className="relative">

<MdEmail className="absolute top-4 left-3 text-gray-400"/>

<input

type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"

className="w-full pl-10 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none border border-white/20"

/>

</div>

<div className="relative">

<RiLockPasswordFill className="absolute top-4 left-3 text-gray-400"/>

<input

type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Password"

className="w-full pl-10 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none border border-white/20"

/>

</div>

<button

className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-bold p-3 rounded-xl"

>

Login

</button>

</form>

<p className="text-center text-gray-300 mt-6">

Don't have an account?

<Link

to="/register"

className="text-indigo-400 ml-2"

>

Register

</Link>

</p>

</div>

</div>

)

}

export default Login;