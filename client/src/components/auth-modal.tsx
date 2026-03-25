import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuthModalProps {
  children: React.ReactNode;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function AuthModal({ children }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginData>({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState<RegisterData>({ 
    email: "", 
    password: "", 
    firstName: "", 
    lastName: "" 
  });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleAppleLogin = () => {
    window.location.href = "/api/auth/apple";
  };

  const handleAdminBypass = async () => {
    try {
      const response = await fetch("/api/auth/admin-bypass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Admin bypass failed or is disabled");
        console.error("Admin bypass failed");
      }
    } catch (error) {
      console.error("Admin bypass error:", error);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsOpen(false);
      setError("");
      window.location.reload(); // Refresh to update auth state
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsOpen(false);
      setError("");
      window.location.reload(); // Refresh to update auth state
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    registerMutation.mutate(registerForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-black border-b border-slate-900 bg-clip-text text-transparent">
            Welcome to PropAnalyzed
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Sign in to access advanced property analytics and investment tools
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-firstName"
                      placeholder="First name"
                      className="pl-10"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-lastName">Last Name</Label>
                  <Input
                    id="register-lastName"
                    placeholder="Last name"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <SiGoogle className="h-5 w-5 text-red-500" />
            <span className="font-medium">Continue with Google</span>
          </Button>
          
          <Button
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-gray-900 text-white py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <SiApple className="h-5 w-5" />
            <span className="font-medium">Continue with Apple</span>
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Development Access</span>
          </div>
        </div>

        <Button
          onClick={handleAdminBypass}
          className="w-full bg-black border-b border-slate-900 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          🔓 Admin Bypass (Development)
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}