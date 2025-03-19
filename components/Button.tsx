import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
  label: string;
  theme?: "primary"; // Make theme optional
};

export default function Button({ label, theme }: Props) {
  return (
    <View
      style={[
        styles.buttonContainer,
        theme === "primary" && {
          borderWidth: 4,
          borderRadius: 18,
          borderColor: "#ffd33d", // Border color for primary theme
        },
      ]}
    >
      <Pressable
        style={[
          styles.button,
          theme === "primary" ? { backgroundColor: "#ffd33d" } : { backgroundColor: "#fff" }, // Primary button has a different background color
        ]}
        onPress={() => alert("You pressed a button.")}
      >
        <FontAwesome
          name="picture-o"
          size={18}
          color={theme === "primary" ? "#25292e" : "#ffd33d"} // Adjust the icon color based on the theme
          style={styles.buttonIcon}
        />
        <Text style={[styles.buttonLabel, { color: theme === "primary" ? "#25292e" : "#ffd33d" }]}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
