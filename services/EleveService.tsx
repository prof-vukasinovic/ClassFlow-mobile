import { useEffect, useState } from "react";
import { Eleve } from "../constants/Eleve";
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { API_URL } from "../constants/config";
import {Notif} from "../components/notif"
import Dropdown from "@/components/DevoirDeroulant";
import { useIsFocused } from "@react-navigation/native";

type Props = {
    classeId: number; // Ca c'est l'argument qu'on reçoit du parent
    devoirChoisi: string | null;
};

export default function ElevesService({ classeId, devoirChoisi }: Props) {
  const [eleves, setEleves] = useState<Eleve[]>([]); //Pareil que dans ClasseService
  const [loading, setLoading] = useState(true);
  const [dernierTireId, setDernierTireId] = useState<number | null>(null);
  const { NotifVue, NotifBav, NotifDevoir } = Notif();
  const [compteRemarques, setCompteRemarques] = useState<Record<number, number>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isFocused = useIsFocused();

  const router = useRouter();

useEffect(() => {
      //si on est sur une autre page (comme l'ajout de remarque), on coupe tout.
      if (!isFocused) return;

      setLoading(true); 
      console.log("Chargement des élèves et des remarques pour la classe : " + classeId);

      //petite astuce lol: On crée un "timestamp" (l'heure exacte en millisecondes).
      // En l'ajoutant à l'URL, le téléphone croit que c'est une nouvelle adresse et ignore son cache
      const t = new Date().getTime(); //merci internet

Promise.all([
          // 1. On récupère les élèves de la classe
          fetch(`${API_URL}/classrooms/${classeId}/eleves?t=${t}`).then(res => res.json()),
          
          // 2. LA MODIFICATION EST ICI : On récupère TOUTES les remarques du serveur sans aucun filtre de classe !
          fetch(`${API_URL}/remarques?t=${t}`).then(res => res.json())
      ])
      .then(([elevesData, toutesLesRemarques]) => {
          if (Array.isArray(elevesData)) {
              setEleves(elevesData);
          } else {
              setEleves([]);
          }

          if (Array.isArray(toutesLesRemarques)) {
              const compte: Record<number, number> = {};
              // On parcourt absolument toutes les remarques du serveur
              toutesLesRemarques.forEach((remarque: any) => {
                  if (remarque.eleveId) {
                      // On ajoute +1 au compteur de l'élève, peu importe si c'est un bavardage, un devoir ou une remarque libre !
                      compte[remarque.eleveId] = (compte[remarque.eleveId] || 0) + 1;
                  }
              });
              setCompteRemarques(compte);
          }
          setLoading(false);
      })

  }, [classeId, refreshTrigger, isFocused]); // D'habitude c'est des "[]" vide mais la on utilise classeId ce qui signifie que si classeId change (genre id 1 à id 2), React relance le fetch
                  // ce qui permet en gros le fait que l'app soit responsive
                  // ici on déclenche le code quand la classe change, au clic sur un bouton (refreshTrigger) ou quand l'écran redevient visible (isFocused)


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
        // setLoading(true); 

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
            setRefreshTrigger(prev => prev + 1);
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
            setRefreshTrigger(prev => prev + 1);
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
              // le router va chercher le fichier app/eleve/[id].tsx
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
            <View style={{flexDirection: "row", alignItems: "center"}}>

            {/* Si l'élève a des remarques on affiche une pastille */}
            {compteRemarques[eleve.id] > 0 && (
                <View style={{
                    // en gros, rouge si 3 remarques ou plus et Orange sinon
                    backgroundColor: compteRemarques[eleve.id] >= 3 ? "#f90c0c" : "#ff9c3a",
                    borderRadius: 12,
                    minWidth: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 0,
                    paddingHorizontal: 6,
                    padding: 0,
                    marginRight: 2
                }}>
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                        {compteRemarques[eleve.id]}
                    </Text>
                </View>
            )}

            <Text style={{ fontSize: 16, marginRight: 4 }}>{eleve.nom} {eleve.prenom}</Text>
            
          </View>
            <TouchableOpacity onPress={() => {Bavard(eleve.id), NotifBav(eleve.prenom)}} style={{borderWidth:1, borderRadius: 10, padding: 2, backgroundColor: '#dff2ff'}}><Text style={{color:'#245576', fontSize: 13}}>Bavardage</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {Devoirs(eleve.id), NotifDevoir(eleve.prenom)}} style={{borderWidth:1, borderRadius: 10, padding: 2, backgroundColor: '#fff5df'}}><Text style={{color:'#c98f12', fontSize: 13}}>Devoir non faits</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>

      ))}
      
      {eleves.length === 0 && <Text>Aucun élève dans cette classe.</Text>}
    </ScrollView>
      <View style={{marginTop: 60}}>{NotifVue}</View>
    </View>
  );
}