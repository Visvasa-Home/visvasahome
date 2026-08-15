import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, Search, Home } from 'lucide-react';
import { useAppContext } from '../../core/store/AppContext';
import { Role } from '../../domain/models';

export const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, activeRole, setActiveRole, cartCount } = useAppContext();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const renderNavLinks = () => {
    if (activeRole === 'admin') {
      return (
        <>
          <a href="#dashboard" className="text-foreground hover:text-primary font-medium">Dashboard</a>
          <a href="#users" className="text-foreground hover:text-primary font-medium">Users</a>
          <a href="#services" className="text-foreground hover:text-primary font-medium">Services</a>
        </>
      );
    }
    if (activeRole === 'professional') {
      return (
        <>
          <a href="#hub" className="text-foreground hover:text-primary font-medium">Partner Hub</a>
          <a href="#jobs" className="text-foreground hover:text-primary font-medium">Available Jobs</a>
          <a href="#earnings" className="text-foreground hover:text-primary font-medium">Earnings</a>
        </>
      );
    }
    return (
      <>
        <a href="#services" className="text-foreground hover:text-primary font-medium">Services</a>
        <a href="#amc" className="text-foreground hover:text-primary font-medium">AMC Plans</a>
        <a href="#pro" className="text-foreground hover:text-primary font-medium">Join as Pro</a>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Home className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground tracking-tight">Visvasa Home</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {renderNavLinks()}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="pl-9 pr-4 py-2 rounded-full bg-input-background border-none focus:ring-2 focus:ring-ring outline-none w-64 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-4">
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value as Role)}
              className="bg-transparent border-none text-sm text-muted-foreground focus:outline-none"
            >
              <option value="customer">Customer Mode</option>
              <option value="professional">Pro Mode</option>
              <option value="admin">Admin Mode</option>
            </select>
          </div>

          <button className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors">
            <User className="w-4 h-4" />
            {user ? user.name : 'Sign In'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="relative p-2 text-foreground">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={toggleMenu} className="text-foreground p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-input-background border-none focus:ring-2 focus:ring-ring outline-none"
            />
          </div>
          <nav className="flex flex-col gap-4">
            {renderNavLinks()}
          </nav>
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value as Role)}
              className="w-full p-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
            >
              <option value="customer">Customer Mode</option>
              <option value="professional">Pro Mode</option>
              <option value="admin">Admin Mode</option>
            </select>
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold">
              <User className="w-5 h-5" />
              {user ? user.name : 'Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
