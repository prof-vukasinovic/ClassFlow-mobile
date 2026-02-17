import {Alert, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from 'react'; 
import { Link } from "expo-router";
import {ThemedText} from '../components/ThemedText';
//import {Header} from '../components/Header';
import EleveService from '../services/EleveService';
import ClasseService from '../services/ClasseService';
import { SafeAreaFrameContext, SafeAreaView } from "react-native-safe-area-context";
import { Image } from 'react-native';

export default function Index() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const localImage = require('../assets/images/fleur.png');

  let tap = 0;
  const EasterEgg1 = () =>{
    tap++;
    if (tap===7){
      Alert.alert("Easter Egg", "Ceci est le premier Easter Egg de l'équipe ClassFlow. Essaye d'en trouver d'autres.");
      tap=0;
    }

  }

  return (
    // Sans flex, la boîte ne fait que la taille de son contenu et coupe le reste
    <View style={{ flex: 1 , backgroundColor:"#d2ee9d"}}>
              {/*Ca c'est le header, j'ai mis du temps a le faire*/}
      <ThemedText variant= 'header'>
        <ThemedText variant= 'headerTitle'>ClassFlow </ThemedText>
        <TouchableOpacity onPress={EasterEgg1}><Image source={localImage} style={{ width: 50, height: 34 }} /></TouchableOpacity>
      </ThemedText>

      <View style={{ flex: 1 , backgroundColor:"#ffffff", margin: 10, borderRadius: 10}}>
      {/*
      {/*La boite hello world*
      <View style={styles.container}>
        <Text style={{backgroundColor: "#ee9d9d", padding: 50,}}>Hello World !</Text>
        
        {/* Ajoute un peu de marge pour séparer les liens du carré rose *
        <View style={{ marginTop: 20 }}> 
            <Link href="/Spring"><Text>Vers le Spring</Text></Link>
        </View>
        
        <View style={{ marginTop: 10 }}>
            <Link href={{pathname: "/eleves/[id]", params: {id: 3}}}><Text>Eleve id n°3</Text></Link>
        </View>
      </View>
        */}
      <ClasseService idActuel={selectedId} onChangement={(nouvelId) => setSelectedId(nouvelId)} />

          <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 10, marginLeft: 5}}> 
            Liste des élèves de la classe: 
          </Text>
          <EleveService classeId={selectedId} />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});
