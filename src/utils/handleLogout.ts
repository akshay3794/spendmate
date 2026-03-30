import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useHandleLogout = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.setItem("loggedIn", JSON.stringify(false));
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        })
      );
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return handleLogout;
};
