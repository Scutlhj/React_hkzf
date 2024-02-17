import { getUserInfo } from "@/apis/user"
import { useEffect, useState } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import PropTypes from 'prop-types';
const Authen = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isAuthorized, setIsAuthorized] = useState(false);
    useEffect(() => {
        // console.log("Authen")
        const fetchData = async () => {
            try {
                const response = await getUserInfo();
                if (response.status === 200) {
                    setIsAuthorized(true);
                } else {
                    navigate("/login",{replace:true, state:{from:location.pathname}});
                }
            } catch (error) {
                navigate("/login",{replace:true, state:{from:location.pathname}});
            }
        };
        fetchData();
    }, [navigate,location.pathname])
    if (!isAuthorized) return null
    return <>{children}</>
}

Authen.propTypes = {
    children:PropTypes.node
};

export default Authen