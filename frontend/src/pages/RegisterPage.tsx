import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Shield } from 'lucide-react';

const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
  { value: 'customer', label: 'Customer', icon: <ShoppingBag className="h-6 w-6" /> },
  { value: 'shopkeeper', label: 'Shopkeeper', icon: <Store className="h-6 w-6" /> },
  { value: 'admin', label: 'Admin', icon: <Shield className="h-6 w-6" /> },
];

export default function RegisterPage() {
  const { register } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    register(email.trim(), name.trim(), role);
    toast.success(`Account created! Welcome, ${name.trim()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary font-heading text-xl font-bold text-primary-foreground mb-4">
            SG
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">SmartGroc</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-lg">
          <h2 className="font-heading text-xl font-semibold mb-6 text-card-foreground">Sign Up</h2>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                  role === r.value
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {r.icon}
                <span className="text-xs font-semibold">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
