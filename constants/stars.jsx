import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

const StarRating = ({ rating, size = 20, color = "#FFD700" }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Ionicons key={i} name="star" size={size} color={color} />);
    } else if (rating >= i - 0.5) {
      stars.push(
        <Ionicons key={i} name="star-half" size={size} color={color} />
      );
    } else {
      stars.push(
        <Ionicons key={i} name="star-outline" size={size} color={color} />
      );
    }
  }

  return <View style={{ flexDirection: "row", gap: 5 }}>{stars}</View>;
};

export default StarRating;
