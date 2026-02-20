import { useState } from "react";
import { View, Text } from "react-native";

export function Notif() {
  const [message, setMessage] = useState<string | null>(null);
  const [couleur, setCouleur] = useState<string>("#245576");
  const [fond, setFond] = useState<string>("#dff2ff");

  const NotifBav = (prenom: string) => {
    setCouleur("#245576"); 
    setFond("#dff2ff");
    setMessage(`Bavardage ajouté à ${prenom}`);
    setTimeout(() => setMessage(null), 2000);
  };

  const NotifDevoir = (prenom: string) => {
    setCouleur("#c98f12"); 
    setFond("#fff5df");
    setMessage(`Oubli de devoir noté pour ${prenom}`);
    setTimeout(() => setMessage(null), 2000);
  };

  // CORRECTION ICI : Ce n'est plus une fonction () =>, mais directement le résultat visuel !
  const NotifVue = message ? (
      <View
        style={{
          backgroundColor: fond, 
          padding: 10,
          margin: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: couleur,
        }}
      >
        <Text style={{ color: couleur, fontWeight: 'bold', textAlign: 'center' }}>{message}</Text>
      </View>
    ) : null;

  // On renvoie la vue pré-calculée
  return { NotifVue, NotifBav, NotifDevoir };
}