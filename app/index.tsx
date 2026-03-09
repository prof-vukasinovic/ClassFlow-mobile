import { View, Text, ActivityIndicator, Image } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function LancementScreen() {
  const router = useRouter();
  const localImage = require('../assets/images/fleur.png');


  useEffect(() => {
    const preparerApplication = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Erreur pendant le chargement initial :", error);
      } finally {
        router.replace("./home"); 
      }
    };

    preparerApplication();
  }, []);

  return (
    <View style={{ 
        flex: 1, 
        backgroundColor: "#d2ee9d",
        justifyContent: "center", 
        alignItems: "center" 
    }}>
      <Text style={{ 
          fontSize: 40, 
          fontWeight: "bold", 
          color: "#000000", 
          marginBottom: 20 
      }}>
        ClassFlow
      </Text>
      <Image source={localImage} style={{ width: 110, height: 90 }} />
      <ActivityIndicator size="large" color="#ffffff" />
      
      <Text style={{ color: "#000000", marginTop: 15, fontStyle: "italic" }}>
        Chargement des données...
      </Text>
    </View>
  );
}