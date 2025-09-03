import { type ReactNode } from "react";
import { Navigate, Route } from "react-router";


export function ProtectedRoute ({condition, fallback, children}: {condition: boolean; fallback: string; children: ReactNode}) {

  if (condition) {
    return <Route>{children}</Route>
  } else {
    <Route>
      <Navigate to={fallback} />
    </Route>
  }

}
