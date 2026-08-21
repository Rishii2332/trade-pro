import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/authService";
function Register(){

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {

    e.preventDefault();

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {

        await authService.register({

            fullName,
            email,
            password,
            phoneNumber,
            address,
            dateOfBirth

        });

        alert("Account Created Successfully");

        navigate("/home");

    } catch (error) {

        alert(error.message);

    }

};
return(

<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 flex justify-center items-center">

<div className="w-[420px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
<h2 className="text-center text-indigo-300 text-sm tracking-widest uppercase">
    Stock Trading Platform
</h2>
<div className="flex justify-center">
    <FaUserCircle className="text-white text-7xl" />
</div>
<h1 className="text-center text-4xl font-bold text-white mt-4">

Create Account

</h1>

<p className="text-center text-gray-300 mt-2">

Create your account to get started

</p>

<form
    onSubmit={handleSubmit}
    className="mt-8 space-y-5"
>

<div className="relative">
    <FaUser className="absolute top-4 left-3 text-gray-400"/>

  <input
    type="text"s
    placeholder="Full Name"
    required
    value={fullName}
    onChange={(e)=>setFullName(e.target.value)}
    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition"
  />
  </div>
<div className="relative">
  

<MdEmail className="absolute top-4 left-3 text-gray-400"/>

<input

type="email"
required
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"

className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition"

/>

</div>

<div className="relative">

<RiLockPasswordFill className="absolute top-4 left-3 text-gray-400"/>

<input

type="password"
required
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Password"

className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition"

/>
</div>
<div className="relative">
  <RiLockPasswordFill className="absolute top-4 left-3 text-gray-400" />

  <input
    type="password"
    placeholder="Confirm Password"
    required
    value={confirmPassword}
    onChange={(e)=>setConfirmPassword(e.target.value)}
    
    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition"
  />
</div>



<button

className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105"

>

Create Account

</button>

</form>

<p className="text-center text-gray-300 mt-6">
Already have an account?
<Link
    to="/"
    className="text-indigo-400 ml-2 hover:text-indigo-300"
>
    Login
</Link>


</p>


</div>

</div>

)

}

export default Register;