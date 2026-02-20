import { useEffect, useState } from "react";
import { Eleve } from "../constants/Eleve";
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL } from "../constants/config";
import {Notif} from "../components/notif"
import Dropdown from "@/components/DevoirDeroulant";

type Props = {
    classeId: number; // Ca c'est l'argument qu'on reçoit du parent
    devoirChoisi: string | null;
};

export default function ElevesService({ classeId, devoirChoisi }: Props) {
  const [eleves, setEleves] = useState<Eleve[]>([]); //Pareil que dans ClasseService
  const [loading, setLoading] = useState(true);
  const [dernierTireId, setDernierTireId] = useState<number | null>(null);
  const { NotifVue, NotifBav, NotifDevoir } = Notif();
  
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

  const tirerAuSort = () => {
      if (eleves.length === 0) {
          Alert.alert("Oups !", "Il n'y a aucun élève dans cette classe.");
          return;
      }
      let lHeureuxElu;
      if (eleves.length > 1) {
          let indexAleatoire;
          do {
              indexAleatoire = Math.floor(Math.random() * eleves.length);
              lHeureuxElu = eleves[indexAleatoire];
          } while (lHeureuxElu.id === dernierTireId);
      } else {
          lHeureuxElu = eleves[0];
      }
      setDernierTireId(lHeureuxElu.id);
      Alert.alert(
          "Tirage au sort", 
          `\nL'élève tiré est : ${lHeureuxElu.prenom} ${lHeureuxElu.nom}`,
          [{ text: "OK", style: "default" }]
      );
  };

  const Bavard = (idDeLeleve: number) => { 
        // setLoading(true); // Retiré pour éviter que la liste clignote

        fetch(`${API_URL}/bavardages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                intitule: "Bavardages",
                eleveId: idDeLeleve, 
                classRoomId: classeId 
            })
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Erreur lors de l'envoi");
        })
        .then(() => { 
            console.log("Bavardage ajouté avec succès");
            //Alert.alert("Noté", "Le bavardage a bien été ajouté.");
        })
        .catch(err => {
            console.error(err);
            Alert.alert("Erreur", "Impossible d'envoyer la remarque bavardage.");
        });
    };

    const Devoirs = (idDeLeleve: number) => { 
        if (!devoirChoisi) {
            Alert.alert("Attention", "Veuillez d'abord choisir un devoir dans le menu déroulant en haut.");
            return;
        }
        fetch(`${API_URL}/devoirs-non-faits`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                intitule: devoirChoisi,
                eleveId: idDeLeleve, 
                classRoomId: classeId 
            })
        })
        .then(async res => {
            if (res.ok) return res.json();
            //throw new Error("Erreur lors de l'envoi");
            const textError = await res.text();
            throw new Error(`Statut ${res.status}: ${textError}`);
        })
        .then(() => { 
            console.log("Bavardage ajouté avec succès");
            //Alert.alert("Noté", "Le bavardage a bien été ajouté.");
        })
        .catch(err => {
            console.error(err);
            Alert.alert("Erreur", "Impossible d'envoyer la remarque bavardage.");
        });
    };

  return (
    <View>
    <TouchableOpacity onPress={tirerAuSort} style={{margin:10, marginLeft:90, borderRadius:9, borderWidth: 1, marginRight:115, padding:2, backgroundColor: '#d2ee9d'}}><Text>Tirer élève au hasard</Text></TouchableOpacity>
    {/*J'ai mis une ScrollView pour pouvoir scroller si la liste est longue*/}
    <ScrollView style={{ height: 300, marginLeft:5, marginRight: 5}}> 
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
          <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
            <Text style={{ fontSize: 16 }}>{eleve.nom} {eleve.prenom}</Text>
            <TouchableOpacity onPress={() => {Bavard(eleve.id), NotifBav(eleve.prenom)}} style={{borderWidth:1, borderRadius: 10, padding: 2, backgroundColor: '#dff2ff'}}><Text style={{color:'#245576'}}>Bavardage</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {Devoirs(eleve.id), NotifDevoir(eleve.prenom)}} style={{borderWidth:1, borderRadius: 10, padding: 2, backgroundColor: '#fff5df'}}><Text style={{color:'#c98f12'}}>Devoir non faits</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>

      ))}
      
      {eleves.length === 0 && <Text>Aucun élève dans cette classe.</Text>}
    </ScrollView>
      <View style={{marginTop: 60}}>{NotifVue}</View>
    </View>
  );
}