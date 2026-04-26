import AuthProvider from "./AuthProvider";
import BusinessProvider from "./BusinessProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <BusinessProvider>{children}</BusinessProvider>
    </AuthProvider>
  );
}