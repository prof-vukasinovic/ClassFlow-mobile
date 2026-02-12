import { useEffect, useState } from "react";
import {Eleve} from "../constants/Eleve";
import {Text, View} from "react-native"

export default function ElevesService() {
  const [eleves, setEleves] = useState<Eleve[]>([]);

  useEffect(() => {
    fetch("http://192.168.1.184:8080/classrooms/1/eleves") //récu^ère les données
      .then(response => response.json())  //transforme en json
      .then(data => {
        setEleves(data); //set Eleves avec data
      })
      .catch(error => {
        console.error("Erreur API :", error); 
      });
  }, []);

  return (
    <>
{eleves.map(eleve => (
  <View 
    key={eleve.id} 
    style={{
      backgroundColor: "#f5f5f5",
      marginVertical: 8,
      padding: 15,
      borderRadius: 10,
      shadowColor: "#000",  //Les 4 finales sont des propiétés pour les ombres des cases 
      shadowOpacity: 0.1,  
      shadowRadius: 4,
      elevation: 3
    }}
  >
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
      {eleve.nom} {eleve.prenom}
    </Text>

    {/*<Text style={{ fontSize: 14, color: "#555" }}>
      ID : {eleve.id}
    </Text>*/}
  </View>
))}
    </>//on récupère les id pour diferencier les eleves et on ecrit id , nom...
  );
}