import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useLogoutUserMutation } from "@/lib/api";


export default function Navigation({ user }) {

  const [logoutUser] = useLogoutUserMutation();

  

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="mb-8 flex flex-col gap-5 rounded-[32px] bg-background/90 p-6 mr-5 ml-5 shadow-sm sm:flex-row sm:items-center sm:justify-between ">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary-foreground">
          Task dashboard
        </p>
        <div>
          
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Solve the Issues
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {user ? (
          <div className="flex ">
            <p className="text-sm font-medium mr-5 mt-1">
              Welcome back, {user.name}
            </p>
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}
