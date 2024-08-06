import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [loading, setLoading] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "admin") {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        }
      }
      setLoading(false);
    };

    checkUserRole();
  }, [user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user && authorized ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
