import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

function useInitializeUser() {
  const { user, checkAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) getCartItems();
  }, [user, getCartItems]);

  return { user, checkingAuth: useUserStore().checkingAuth };
}

export default useInitializeUser;
