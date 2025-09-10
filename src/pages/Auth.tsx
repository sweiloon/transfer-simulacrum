import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, UserPlus, Shield } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { SecurityBadge } from '@/components/SecurityBadge';
import { validatePassword, checkRateLimit } from '@/utils/security';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      console.log('Auth page: User is logged in, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, navigate, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Rate limiting check
      if (!checkRateLimit(formData.email)) {
        toast({
          title: "Too many attempts",
          description: "Please wait 15 minutes before trying again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (isSignIn) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
          navigate('/', { replace: true });
        } else {
          toast({
            title: "Login failed",
            description: result.error,
            variant: "destructive",
          });
        }
      } else {
        // Validation for sign up
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Enhanced password validation
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          toast({
            title: "Password too weak",
            description: passwordValidation.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const result = await register(formData.email, formData.password, formData.name);
        if (result.success) {
          if (result.error) {
            // Email confirmation required
            toast({
              title: "Account created!",
              description: result.error,
              variant: "default",
            });
            // Switch to sign in tab after successful registration
            setIsSignIn(true);
          } else {
            // Direct login (no email confirmation required)
            toast({
              title: "Account created!",
              description: "Your account has been created successfully.",
            });
            navigate('/', { replace: true });
          }
        } else {
          toast({
            title: "Registration failed",
            description: result.error,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (isSignIn) {
      return formData.email && formData.password;
    } else {
      return formData.email && formData.password && formData.name && formData.confirmPassword;
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/3edc9945-5e1e-40ae-841f-46f5588da8fc.png')`,
        }}
      />
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {isSignIn ? 'Sign in to your secure account' : 'Create your secure account'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            🔒 Your data is protected with enterprise-grade encryption
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <Tabs value={isSignIn ? 'signin' : 'signup'} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="signin" 
                  onClick={() => setIsSignIn(true)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  onClick={() => setIsSignIn(false)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value.trim()})}
                    autoComplete="name"
                    required={!isSignIn}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
                    autoComplete="email"
                    required
                  />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    autoComplete={isSignIn ? "current-password" : "new-password"}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {!isSignIn && formData.password && (
                  <PasswordStrengthIndicator 
                    password={formData.password} 
                    className="mt-2"
                  />
                )}
              </div>

              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    autoComplete="new-password"
                    required={!isSignIn}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isSignIn ? "Signing in..." : "Creating account..."}
                  </>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            
            <div className="mt-4 pt-4 border-t border-border/50">
              <SecurityBadge showDetails className="justify-center" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;