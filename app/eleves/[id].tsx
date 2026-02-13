import {StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState, useEffect } from 'react'; 
import { Link, useLocalSearchParams } from "expo-router";
import {ThemedText} from '../../components/ThemedText';
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";



export default function eleve() {
    const params = useLocalSearchParams(); // useLocalSearchParams récupère tout ce que j'ai passé dans le router.push de EleveService
    const id = params.id; 
    const nom = params.nom;
    const prenom = params.prenom;
    const classe = params.classe;
    const router = useRouter();
    //const remarques = params.remarquesData ? JSON.parse(params.remarquesData as string) : [];

    const [remarques, setRemarques] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRemarques = async () => { // J'ai enfin réussi à créer cette fonction qui va chercher les remarques
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.184:8080/eleves/${id}/remarques`);
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
            <Text style={{fontSize: 20, margin: 10 }}> <Text style={{  fontWeight: 'bold' }}>Nom: </Text> {nom}</Text>
            <Text style={{fontSize: 20, margin: 10 }}> <Text style={{  fontWeight: 'bold' }}>Prénom: </Text> {prenom}</Text>
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
                    </View>
                )}
                ListEmptyComponent={<Text style={{fontStyle:'italic', marginTop:20, marginLeft:20}}>Aucune remarque.</Text>}
            />
            <TouchableOpacity  onPress={() =>router.push({pathname: "/remarques/nouveau", params: { eleveId: id }})}>
            <View style={{backgroundColor: "#4A90E2", // Un beau bleu au lieu du gris
        paddingVertical: 15,      
        paddingHorizontal: 20,
        borderRadius: 10,       
        marginVertical: 50,     
        elevation: 3,       // Petite ommbre
        margin:10,
        alignItems: "center",   // Ca ca centre le texte 
        justifyContent: "center"}}><Text>Ajouter une Remarque</Text></View></TouchableOpacity>
        </View>
      </View>
    );
}