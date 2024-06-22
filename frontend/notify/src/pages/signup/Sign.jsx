import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axioInstances"

const Sign = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword)
    }
    const handleSignUp = async(e) => {
        e.preventDefault();

        if(!name){
            setError("Enter your valid name");
            return
        }

        if(!validateEmail(email)){
            setError("Enter your valid email");
            return
        }

        if(!password){
            setError("Enter your password correctly")
            return
        }

        setError(" ")

               // login API Call

            try{
                // handle login
                const response = await axiosInstance.post("/account",{
                    fullName: name,
                    email: email,
                    password: password,
                });
                // handle successful registration

                if(response.data && response.data.error) {
                    setError(response.data.message)
                    return
                }



                if(response.data && response.data.accessToken){
                    localStorage.setItem("token", response.data.accessToken)
                    navigate("/dashboard")
                }
            }
    
            catch(error){
                // handle login error
                if(error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                }
                else{
                    setError("An unexpected error occurred. Please try again")
                }
            }
    };
    return (
        <>
            <Navbar />

            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl mb-2">SignUp</h4>

                        <input type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-box"
                        />

                        <input type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-box"
                        />

                        <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-2">
                            <input placeholder={"password"}
                                className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
                                type={isShowPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            {
                                isShowPassword ? <FaRegEye size={22}
                                    className=" text-primary cursor-pointer"
                                    onClick={() => toggleShowPassword()} />
                                    : <FaRegEyeSlash size={22}
                                        className=" text-primary cursor-pointer"
                                        onClick={() => toggleShowPassword()} />
                            }
                        </div>
                        
                        {
                            error && <p className="text-red-500 text-md">
                                {error}
                            </p>
                        }


                        <button type="submit" className="primary-btn">Create Account</button>

                        <p className="text-sm text-center mt-4">Already have an account?</p>

                        <Link to="/login" className="font-medium text-primary underline">
                            Login
                        </Link>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Sign
