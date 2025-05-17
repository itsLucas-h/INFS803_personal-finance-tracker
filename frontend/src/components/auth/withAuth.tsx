import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login");
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    if (isAuthenticated === null) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
