import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoutes = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  console.log(user);
  const location = useLocation();
  if (loading)
    return (
      <div className="flex justify-center items-center mt-72">
        {/* <RotatingLines
              visible={true}
              height="50"
              width="50"
              strokeColor="#3b82f6"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
            /> */}

        <div className="w-full h-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      </div>
    );

  if (!user) {
    return <Navigate state={location.pathname} to="/login" replace={true} />;
  } else return <div>{children}</div>;
};

export default PrivateRoutes;
