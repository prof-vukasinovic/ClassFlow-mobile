import { useEffect, useState } from "react";
import { Eleve } from "../constants/Eleve";
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/config";

type Props = {
    classeId: number; // Ca c'est l'argument qu'on reçoit du parent
};

export default function ElevesService({ classeId }: Props) {
  const [eleves, setEleves] = useState<Eleve[]>([]); //Pareil que dans ClasseService
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setLoading(true); // On affiche le chargement pendant qu'on change de classe
    
    console.log("Chargement des élèves pour la classe : " + classeId);

    fetch(`${API_URL}/classrooms/${classeId}/eleves`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
            setEleves(data);
        } else {
            setEleves([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur API :", error); 
        setLoading(false);
      });

  }, [classeId]); // D'habitude c'est des "[]" vide mais la on utilise classeId ce qui signifie que si classeId change (genre id 1 à id 2), React relance le fetch
                  // ce qui permet en gros le fait que l'app soit responsive


  if (loading) return <ActivityIndicator color="blue" />;

  return (
    // J'ai mis une ScrollView pour pouvoir scroller si la liste est longue
    <ScrollView style={{ height: 300 }}> 
      {eleves.map(eleve => (
        <TouchableOpacity
          key={eleve.id} 
          onPress={() => {
              console.log("Clic sur l'élève : " + eleve.nom);
              // Cela va chercher le fichier app/eleve/[id].tsx
              router.push({
        pathname: "/eleves/[id]", 
        params: { id: eleve.id,
                  nom: eleve.nom,      // Hop, on passe le nom
                  prenom: eleve.prenom,
                  //classe: eleve.classe
                  classeId: classeId
         } 
      });
          }}
          style={{
            backgroundColor: "#f5f5f5",
            marginVertical: 5,
            padding: 10,
            borderRadius: 8,
            elevation: 2     //ca c'est pour l'ombrage mais je crois que c'est seulement poiur android.
          }}      //Faudra que je verifis ca plus tard

          
        >
          <Text style={{ fontSize: 16 }}>{eleve.nom} {eleve.prenom}</Text>
        </TouchableOpacity>
      ))}
      
      {eleves.length === 0 && <Text>Aucun élève dans cette classe.</Text>}
    </ScrollView>
  );
}