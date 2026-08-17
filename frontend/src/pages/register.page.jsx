import { useRegisterUserMutation } from "@/lib/api";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearchParams } from "react-router";



function SignupPage() {
 
    const [form , setForm ] = useState({name: "" ,email:"" , password: ""})
    const [errors, setErrors] = useState({name: "" ,email:"" , password: ""})
    const [success , setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");

    const navigate = useNavigate();

    const [registerUser,{isLoading} ] = useRegisterUserMutation();

    const validateuser = () => {
        const validateError = {name: "",email:"", password: ""}
        if(!form.name){
            validateError.name = "Username is required"
        }
        if(!form.email){
            validateError.email = "User email is required"
        }
        if(!form.password){
            validateError.password = "User password is required"
        }
        else if(form.password.length < 8){
            validateError.password = "Password should contains atleast 8 characters"
        }
        setErrors(validateError);
        return !validateError.name && !validateError.password
    }

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateuser()) return;
    try{
         await registerUser({user_name: form.name ,user_email: form.email, user_password: form.password}).unwrap();
         console.log("user Registered!")

         setSuccess(true)
         
         setTimeout(() => navigate(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`, { replace: true }), 4000)

    }catch(error){
        console.log(error)
    }

    
  }


  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-background/90 p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Create account</h1>
        <p className="mb-6 text-sm text-muted-foreground">Enter the mentioned credentials</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Username</label>
            <Input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Please enter a username" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
            <Input name="email" type="text" value={form.email} onChange={handleChange} placeholder="Please enter an email" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Please enter a password" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Registering" : "Register"}
            </Button>
            <a className="text-sm text-muted-foreground hover:underline" href="/login">Already have an account?</a>
          </div>

          {success && (alert("User registered successfully"))}
        </form>
      </div>
    </main>
  );
}

export default SignupPage;
