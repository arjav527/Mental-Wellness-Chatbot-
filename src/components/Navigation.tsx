import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, TrendingUp, Users, Music, Menu, X, LogOut, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/doctors", label: "Doctors", icon: Users },
    { path: "/relax", label: "Relax", icon: Music },
    { path: "/emergency", label: "Emergency", icon: AlertCircle },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius)] shadow-[var(--shadow-glass)] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                      "hover:bg-primary/10 hover:scale-105",
                      isActive && "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-3 backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full shadow-[var(--shadow-glass)]"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full w-64 z-40 backdrop-blur-xl bg-[var(--glass-bg)] border-r border-[var(--glass-border)] shadow-[var(--shadow-glass)] transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full pt-20 px-4">
            <div className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                      "hover:bg-primary/10",
                      isActive && "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-border pt-4 pb-6 space-y-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Navigation;