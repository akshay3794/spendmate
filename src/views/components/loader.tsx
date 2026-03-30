import { View, ActivityIndicator } from "react-native";
import React from "react";
import ReactNativeModal from "react-native-modal";

type Props = {
  show: boolean;
};
const Loader = ({ show }: Props) => {
  return (
    <ReactNativeModal
      isVisible={show}
      hasBackdrop={true}
      onBackdropPress={() => {}}
      onBackButtonPress={() => {}}
      style={{ margin: 0 }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} color={"#eee"} />
      </View>
    </ReactNativeModal>
  );
};

export default Loader;
