import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">SHA Claims Fixer</h1>
          <p className="text-muted-foreground mt-2">
            Remote SHA Claims Management for Private Hospitals
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
