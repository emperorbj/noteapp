import { useState } from "react"
import TagInput from "../../components/inputs/TagInput"
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axioInstances";


const AddEditNote = ({noteData, type, onclose, getAllNotes}) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);

    const [error, setError] = useState(null);

    const editNote = async () => {}

    const addNewNote = async () => {

        try{
            const response = await axiosInstance.post("/add-note",{
                title,
                content,
                tags
            });
            if(response.data && response.data.note){
                getAllNotes();
                onclose();
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
    }

    const handleAddNote = () => {
        if(!title){
            setError("Please enter your title")
            return
        }

        if(!content){
            setError("Please enter your content here")
            return
        }

        setError(" ")

        if(type === "edit"){
            editNote()
        }else{
            addNewNote()
        }
    }
    return (
        <div className="relative">

            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500" onClick={onclose}>
                <MdClose className="text-xl text-slate-400"/>
            </button>


            <div className="flex flex-col gap-2">
                <label className="input-label">TITLE</label>
                <input type="text" className="text-2xl text-slate-950 outline" placeholder="go to gym"
                value={title}
                onChange={({target}) => setTitle(target.value)} />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea
                type="text"
                placeholder="content"
                className="text-sm text-slate-950 outline-none 
                bg-slate-50 p-2 rounded"
                rows={10}
                value={content}
                onChange={({target}) => setContent(target.value)}/>
            </div>

            <div className="mt-3">
                <label className="input-label" >TAGS</label>
                <TagInput tags={tags} setTags={setTags}/>
            </div>

            {error && <p className="text-red-600 text-sm pt-4">{error}</p>}

            <button className="primary-btn font-medium mt-5 p-3" onClick={handleAddNote}>
                ADD
            </button>
        </div>
    )
}

export default AddEditNote
