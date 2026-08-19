import { useState } from "react";
import { useLoginUserMutation } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { socket } from "@/lib/socket";
import { useSearchParams } from "react-router"; 
import { Link } from "react-router";

function LoginPage() {
const [form , setForm] = useState({user_email:"" , user_password: ""})
const [errors, setErrors] = useState({user_email:"" ,user_password:""})
const [loggedin, setLoggedin] = useState(false)

const [searchParams] = useSearchParams();

const redirect = searchParams.get("redirect")

const [loginUser,{isLoading}] = useLoginUserMutation();

const navigate = useNavigate();

const validateUser = () => {

    const newErrors = {user_email: "", user_password:""} 
    if(!form.user_email){
        newErrors.user_email = "User Email Field is empty!"
    }
    if(!form.user_password){
        newErrors.user_password = "Password is Required"
    }
    setErrors(newErrors)
    return !newErrors.user_email && !newErrors.user_password
};

const handleChange  = (e) => {
    setForm({...form, [e.target.name]:e.target.value})
    setErrors({...errors, [e.target.name]:""})
}

const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateUser())
        return;

    try{
         const results = await loginUser(form).unwrap();
         socket.connect();    
         console.log("user loggedin successfully!") 
         setLoggedin(true);
         setTimeout(() => navigate(redirect || "/"), 4000) 
    }catch(error) {
    console.log(error)
    setErrors({
        ...errors,
        form: error?.data?.message ?? "Failed to log in. Try again."
    })
} 
}

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-background/90 p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Sign in</h1>
        <p className="mb-6 text-sm text-muted-foreground">Enter your Email and Password to continue.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
            <Input name="user_email" type="email" value={form.user_email} onChange={handleChange} placeholder="Enter Email" />
            {errors.user_email && (
              <p className="mt-1 text-xs text-red-500">{errors.user_email}</p>
            )}
          </div>
          
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
            <Input name="user_password" type="password" value={form.user_password} onChange={handleChange} placeholder="Enter Password" />
            {errors.user_password && (
              <p className="mt-1 text-xs text-red-500">{errors.user_password}</p>
            )}
          </div>

          {errors.form && (
          <p className="text-sm text-red-500">{errors.form}</p>
          )}

          <a href={`http://localhost:8000/api/auth/google${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}>
            Sign in with Google
          </a>

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Login..." : "Login"}
            </Button>
            <p>
                Don't have an account?{" "}
                <Link to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}>
                    Register
                </Link>
            </p>
          </div>
           {loggedin && (
            <p className="text-sm text-green-600">
              Logged in! Redirecting...
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
