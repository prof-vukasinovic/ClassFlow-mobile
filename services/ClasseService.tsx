import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
// On importe ton interface
import { Classe } from "../constants/Classe"; 

export default function ClasseService() {

  const [maClasse, setMaClasse] = useState<Classe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- CORRECTION MAJEURE ICI ---
    // 1. On enlève "/eleves" à la fin pour récupérer la Classe entière.
    // 2. On remplace "{id}" par un vrai chiffre, par exemple "1".
    const idDeTest = 1; 

    console.log(`Tentative de récupération de la classe n°${idDeTest}...`);

    fetch(`http://192.168.1.184:8080/classrooms/${idDeTest}`) 
      .then(response => {
          console.log("Statut HTTP:", response.status);
          return response.json();
      }) 
      .then(data => {
        console.log("Données reçues du Backend :", data);
        setMaClasse(data); // Le JSON correspond maintenant à ton interface Classe
        setLoading(false);
      })
      .catch(error => {
          console.error("Erreur:", error);
          setLoading(false);
      });
  }, []);

  if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 50}} />;
  }

  return (
    <View style={{ padding: 50 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Détails de la Classe
      </Text>

      {/* Affichage sécurisé */}
      {maClasse ? (
          <View>
            <Text style={{fontSize: 18}}>ID : {maClasse.id}</Text>
            <Text style={{fontSize: 18, color: 'blue'}}>Nom : {maClasse.nom}</Text>
            
            {/* Petit bonus : afficher le nombre d'élèves si dispo */}
            {/* Attention : Vérifie si 'eleves' est un tableau ou un objet Groupe dans ton interface */}
            {/* <Text>Nombre d'élèves : {Array.isArray(maClasse.eleves) ? maClasse.eleves.length : 'N/A'}</Text> */}
          </View>
      ) : (
          <Text style={{color: 'red'}}>Classe introuvable ou erreur serveur.</Text>
      )}
      
    </View>
  );
}