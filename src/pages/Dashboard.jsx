import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

function Dashboard() {
const navigate = useNavigate();

useEffect(() => {
if (!auth.currentUser) {
navigate("/login");
}
}, [navigate]);

const handleLogout = async () => {
await signOut(auth);
alert("Logged Out");
navigate("/login");
};

return ( <div> <h1>Dashboard</h1>

```
  <p>
    Logged in as: {auth.currentUser?.email}
  </p>

  <button onClick={handleLogout}>
    Logout
  </button>
</div>


);
}

export default Dashboard;
