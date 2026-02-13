import {StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState, useEffect } from 'react'; 
import { Link, useLocalSearchParams } from "expo-router";
import {ThemedText} from '../../components/ThemedText';
import { useRouter } from "expo-router";



export default function eleve() {
    const params = useLocalSearchParams(); // useLocalSearchParams récupère tout ce que j'ai passé dans le router.push de EleveService
    const id = params.id; 
    const nom = params.nom;
    const prenom = params.prenom;
    const classe = params.classe;
    const router = useRouter();
    const remarques = params.remarquesData ? JSON.parse(params.remarquesData as string) : [];

    return(
      <View style={{ flex: 1 , backgroundColor:"#d2ee9d"}}>
        <ThemedText variant= 'header'>
          <ThemedText variant= 'headerTitle'>ClassFlow</ThemedText>
        </ThemedText>

        <View style={{ flex: 1 , backgroundColor:"#ffffff", margin: 10, borderRadius: 10}}>
          <TouchableOpacity  onPress={() =>router.push({pathname: "/"})}><Text style={{margin: 10, fontWeight: 'bold', fontSize: 20}}> {"<---"} Retour</Text></TouchableOpacity>
            <Text style={{fontSize: 20, margin: 10 }}> <Text style={{  fontWeight: 'bold' }}>Nom: </Text> {nom}</Text>
            <Text style={{fontSize: 20, margin: 10 }}> <Text style={{  fontWeight: 'bold' }}>Prénom: </Text> {prenom}</Text>
            {/*<Text> Classe: {classe}</Text>*/}
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
                        <Text>Liste des Remarques:</Text>
                        <Text>{item.intitule}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={{fontStyle:'italic', marginTop:20, marginLeft:20}}>Aucune remarque.</Text>}
            />
        </View>
      </View>
    );
}