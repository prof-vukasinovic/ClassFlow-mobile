import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { Classe } from "../constants/Classe";
import { API_URL } from "../constants/config";

type Props = {     //en gros un Prop ca sert transmettres des donnees et des fonctions entre composants (parent/enfant)
  idActuel: number;   //Ici, idActuel est l'id qui est sélect et au changement, on prend l'id décidé
  onChangement: (id: number) => void; //onChangement est un listener sur un id et est de type void
};

export default function ClasseService({ idActuel, onChangement }: Props) { //la fonction prend un objet Props en argument qui a ces attributs
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true); // C'est des etats avec leur variables et leur setteer

  useEffect(() => {    //Je suis pas sur mais je crois que c'ets un peu l'équivalent du constructeur
    let isMounted = true;  //comme on va jouer avec des éléments qui ont beosins de temps, j'ai beosin de ca pour empecher l'app de crash
    fetch(`${API_URL}/classrooms`) //Le fetch pour récupérer l'adresse du spring
      .then(response => response.json())
      .then(data => {
        if(isMounted) {
             const liste = Array.isArray(data) ? data : (data.content || []);
             setClasses(liste);    //on remplit la liste
             setLoading(false); // On a fini de charger
        }
      })
      .catch(err => {
          console.error(err);
          if(isMounted) setLoading(false);
      });
      
    return () => { isMounted = false; }; //on remet a false pour pas que ca crash
  }, []);

  if (loading) return <ActivityIndicator color="green" />; //cercle de chargement(c'est stylé je trouve)
  if (classes.length === 0) return <Text>Aucune classe disponible.</Text>;


  
  return (
<View style={{ 
        backgroundColor: 'white',
        borderRadius: 10, // On met des bords arrondis pour tout le monde, c'est plus joli :)
        marginVertical: 10,
        overflow: 'hidden', // Ca, ca permet de bien garder la roulette à l'intérieur de la boîte
        ...(Platform.OS === 'android' && {
            borderWidth: 1, 
            borderColor: '#ccc', 
        })
    }}>
      {/* @ts-ignore */}
      <Picker
        selectedValue={idActuel} 
        onValueChange={(itemValue) => {
             const nouvelId = Number(itemValue);
             if (!isNaN(nouvelId) && nouvelId !== idActuel) {
                 onChangement(nouvelId);
             }
        }}
        style={Platform.OS === 'ios' ? { height: 150, width: '100%' } : { width: '100%' }}
        itemStyle={Platform.OS === 'ios' ? { fontSize: 20, color: 'black' } : {}}
      >
        {classes.map((c) => (
            <Picker.Item 
                key={c.id} 
                label={c.nom} 
                value={c.id} 
                color={Platform.OS === 'android' ? 'black' : undefined} 
            />
        ))}
      </Picker>
    </View>
  );
}