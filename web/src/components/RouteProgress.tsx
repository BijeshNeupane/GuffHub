// RouteProgress.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

export default function RouteProgress() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    // Let the new page render before finishing the bar
    requestAnimationFrame(() => {
      NProgress.done();
    });
  }, [location.pathname]);

  return null;
}
