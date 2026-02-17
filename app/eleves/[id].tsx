import {StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from "react-native";
import React, { useState, useEffect } from 'react'; 
import { Link, useLocalSearchParams } from "expo-router";
import {ThemedText} from '../../components/ThemedText';
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../constants/config";


export default function eleve() {
    const params = useLocalSearchParams(); // useLocalSearchParams récupère tout ce que j'ai passé dans le router.push de EleveService
    const id = params.id; 
    const nom = params.nom;
    const prenom = params.prenom;
    const classeId = params.classeId;
    const router = useRouter();
    //const remarques = params.remarquesData ? JSON.parse(params.remarquesData as string) : [];

    const [remarques, setRemarques] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supprimerRemarque = (remarqueId: number) => { //C'est la fonction pour supprimer une remarque
        Alert.alert(                       //Je donne remarqueId au code pour qu'il sache quel remarque sup
            "Suppression",   //Petite fenêyte pour etre sure
            "Etes-vous sûr de vouloir supprimer cette remarque ?",
            [
                { text: "Annuler", style: "cancel" },     //littéralemnt les boutons  
                { text: "Supprimer", style: "destructive",
                    onPress: () => {
                        fetch(`${API_URL}/remarques/${remarqueId}`, {
                            method: "DELETE",
                        })
                        .then(res => {
                            if (res.ok) { //on verifie si le http est bon
                                setRemarques(prevRemarques => prevRemarques.filter(r => r.id !== remarqueId));
                            } else { //si c'est pas bon, on renvoie une erreur
                                Alert.alert("Erreur", "Impossible de supprimer");
                            }
                        })
                        .catch(err => console.error(err));
                    }
                }
            ]
        );
    };

const supprimerEleve = () => { 
        console.log("Le bouton a été cliqué !");
        console.log("ID de l'eleve :", id, "| ID de la classe :", classeId); //on verif si le code a bien recu les infos
        if (!classeId) {
            console.log("classeId est introuvable donc la suppression va échouer.");
            Alert.alert("Erreur Technique", "L'ID de la classe est manquant dans les paramètres.");
            return; // On arrête la fonction ici
        }

        Alert.alert(        
            "Suppression",
            "Es-tu sûr de vouloir supprimer cet élève de la base de données ?",
            [
                { text: "Annuler", style: "cancel", onPress: () => console.log("Annulation cliquée") },
                { text: "Supprimer", style: "destructive",
                    onPress: () => {
                      const urlComplete = `${API_URL}/classrooms/${classeId}/eleves/${id}`;
                      console.log(" URL envoyée au serveur :", urlComplete);
                        fetch(urlComplete, {
                            method: "DELETE",
                        })
                        .then(res => {
                            //console.log("Le serveur a répondu avec le statut HTTP :", res.status);
                            if (res.ok) { 
                                console.log("L'élève est supprimé !");
                                Alert.alert("Succès", "L'élève a bien été supprimé.", [
                                    { text: "OK", onPress: () => router.push("/") } 
                                ]);
                            } else {
                                console.log("La suppression a été refusée.");
                                Alert.alert("Erreur", "Code " + res.status );
                            }
                        })
                        .catch(err => {
                            console.log("Le fetch a planté ");
                            console.error(err);
                        });
                    }
                }
            ]
        );
    };

    const fetchRemarques = async () => { // J'ai enfin réussi à créer cette fonction qui va chercher les remarques
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/eleves/${id}/remarques`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setRemarques(data);
            }
        } catch (error) {
            console.error("Erreur chargement remarques:", error);
        } finally {
            setLoading(false);
        }
    };

const nouvelleRemarque = () => { 
        Alert.alert(        
            "Nouvelle remarque",
            "Quel type de remarque souhaitez-vous ajouter ?",
            [
                { 
                    text: "Annuler", 
                    style: "cancel"
                },
                { 
                    text: "Prédéfinie", 
                    onPress: () => {
                        console.log("Remarque pred");
                        router.push({
                            pathname: "/remarques/predef", 
                            params: { eleveId: id }
                        });
                      } 
                },
                { 
                    text: "Libre",
                    onPress: () => {
                        router.push({
                            pathname: "/remarques/nouveau", 
                            params: { eleveId: id }
                        });
                    }
                }
            ]
        );
    };

  useFocusEffect(  // Cette fonction se relance à chaque fois que la page redevient visible
    useCallback(() => {
        fetchRemarques(); 
    }, [id])
);

    return(
      <View style={{ flex: 1 , backgroundColor:"#d2ee9d"}}>
        <ThemedText variant= 'header'>
          <ThemedText variant= 'headerTitle'>ClassFlow</ThemedText>
        </ThemedText>

        <View style={{ flex: 1 , backgroundColor:"#ffffff", margin: 10, borderRadius: 10}}>
          <TouchableOpacity  onPress={() =>router.back()}><Text style={{margin: 10, fontWeight: 'bold', fontSize: 20}}> {"<---"} Retour</Text></TouchableOpacity>
            <Text style={{fontSize: 20, margin: 10 }}><Text style={{  fontWeight: 'bold' }}>Nom:</Text>{nom}</Text>
            <Text style={{fontSize: 20, margin: 10 }}><Text style={{  fontWeight: 'bold' }}>Prénom:</Text>{prenom}</Text>
            {/*<Text> Classe: {classe}</Text>*/}
            <Text style = {{margin:10, fontSize: 20, fontWeight: 'bold', marginTop:10}}>Liste des Remarques:</Text>
            <FlatList
                data={remarques}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{
                        margin: 10,
                        backgroundColor: '#f9f9f9', 
                        padding: 10, 
                        marginVertical: 5, 
                        borderRadius: 5,
                        borderLeftWidth: 4,
                        borderLeftColor: '#ee9d9d'
                    }}>
                        <Text>{item.intitule}</Text>
                        <TouchableOpacity onPress={()=>supprimerRemarque(item.id)}>
                          <Ionicons name="trash-outline" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={{fontStyle:'italic', marginTop:20, marginLeft:20}}>Aucune remarque.</Text>}
            />

              {/*() => router.push({pathname: "/remarques/nouveau", params: { eleveId: id }})*/}
              <TouchableOpacity onPress={nouvelleRemarque}>
                <View style={{
                    backgroundColor: "#4A90E2", 
                    paddingVertical: 15,      
                    paddingHorizontal: 20,
                    borderRadius: 10,       
                    marginVertical: 50,     
                    elevation: 3,       
                    marginHorizontal: 10,
                    alignItems: "center",   
                    justifyContent: "center"
                }}><Text>Ajouter une Remarque</Text></View></TouchableOpacity>
            
        
        {/*<TouchableOpacity onPress={supprimerEleve}>
            <View style={{backgroundColor: "#f13c1c", 
        paddingVertical: 15,      
        paddingHorizontal: 20,
        borderRadius: 10,       
        marginBottom: 50,     
        elevation: 3,       // Petite ommbre
        margin:10,
        alignItems: "center",   // Ca ca centre le texte 
        justifyContent: "center"}}><Text>Supprimer l'élève</Text></View></TouchableOpacity>*/}
        </View>
      </View>
    );
}