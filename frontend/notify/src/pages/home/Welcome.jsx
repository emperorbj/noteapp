import { Link } from "react-router-dom"

const Welcome = () => {
    return (
        <div className="w-full h-[100vh] flex items-center justify-center">
            <div className=" w-80 h-30 flex items-center">
                <h1> WELCOME TO MY NOTES</h1>
                <Link to="/login">
                <button className="bg-primary  px-1 py-2 rounded-md w-40 text-white">get started here</button>
                </Link>
            </div>
        </div>
    )
}

export default Welcome
