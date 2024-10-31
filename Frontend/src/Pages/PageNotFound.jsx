import { useNavigate } from "react-router-dom";
function PageNotFound (){
    const navigate = useNavigate();
    return (
        <>
        <div style={{textAlign : "center"}}>
            <h1>Error 404</h1>
            <h1>Page Not Found</h1>
            <button onClick={()=>navigate("/")} > Back To Home </button>
        </div>
        </>
    )
}

export default PageNotFound;