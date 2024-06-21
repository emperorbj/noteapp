import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { validateEmail } from "../../utils/helper"


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if(!validateEmail(email)){
            setError("Pleases enter a valid email")
            return;
        }

        if(!password){
            setError("please enter a valid password")
            return
        }

        setError(" ")
    };

    





    return (
        <>
            <Navbar />

            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={ handleSubmit }>
                        <h4 className="text-2xl mb-2">Login</h4>

                        <input type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-box" />
                        <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-2">
                            <input placeholder={"password"}
                                className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
                                type={isShowPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            {
                                isShowPassword ?  <FaRegEye size={22} 
                                className=" text-primary cursor-pointer"
                                onClick={()=> toggleShowPassword()}/>
                                : <FaRegEyeSlash size={22} 
                                className=" text-primary cursor-pointer"
                                onClick={()=> toggleShowPassword()}/>
                            }
                        </div>

                        {
                            error && <p className="text-red-500 text-md">
                                {error}
                            </p>
                        }


                        <button type="submit" className="primary-btn">Login</button>

                        <p className="text-sm text-center mt-4">Not registered yet?{" "}</p>

                        <Link to="/signup" className="font-medium text-primary underline">
                            Create an account
                        </Link>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
