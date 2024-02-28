import { Navigate, useLocation } from "react-router-dom";

const PrivateRoutes = ({ children }: any) => {
    const location = useLocation();
    const allowChildren = true;
    if (allowChildren) {
        return (
            <div>
                {children}
            </div>
        );
    }
    return (
        <Navigate to="/signUp" state={{ from: location }} replace />
    );

};
export default PrivateRoutes;