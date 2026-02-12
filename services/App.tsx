import React, { useState, useEffect } from 'react'; //les imports 
import { Text, View, StyleSheet } from 'react-native';


export default function App() { //le main

  const [message, setMessage] = useState("Chargement...");
  //En React, si on change une variable normale, l'écran ne se rafraîchit pas automatiquement
//Du coup, on utilises useState qui crée une variable "spéciale" et qui quand elle change, force l'écran à se redessiner
//message est la variable et setMessage est la fonction pour la modifier
//La chaine "Chargement..." est la valeur de départ

  const fetchMessage = async () => { //fetch est la commande pour faire une requete http (get)
    try {
      console.log("J'envoie la demande..."); //juste un log
      const response = await fetch('http://192.168.1.184:8080/hello'); //donc on envoie une requete a cette adresse ip et ce port
      const text = await response.text(); //conversion en String 
      
      console.log("Réponse reçue : " + text);
      setMessage(text); 
    } catch (error) {
      console.error("Erreur : ", error);
      setMessage("Erreur de connexion");
    }
  };

  useEffect(() => { //En gros, dès que l'appli est lancé, ca lance ce qui est entre accolades
    fetchMessage(); //Ici fetchMessage 
  }, []); // C'est un peu l'équivalent d'un constructeur
  //Les crochets sont utiles pour dire au code de faire tourner qu'une seule foios sinon ca tourne a l'infini

//Le return, le rendu, ce que l'utilisateur va voir
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{message}</Text>
    </View>
  );
}             {/*Juste un appel a container de styles*/}

//Le style
const styles = StyleSheet.create({ //const est en gros un objet. 
  container: { //celui ci contient les styles
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textStyle: {
    fontSize: 24,
    color: 'blue',
  }
});