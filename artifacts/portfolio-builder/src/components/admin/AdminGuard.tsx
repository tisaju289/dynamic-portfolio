import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return <>{children}</>;
};

export default AdminGuard;
