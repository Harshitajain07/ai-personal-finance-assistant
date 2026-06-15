import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

function Dashboard() {
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged Out");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;