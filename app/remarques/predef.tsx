import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL } from "../../constants/config";

const REMARQUES_PREDEFINIES = [ //Liste des remarque prédéfini. Du coup vous pouvez en ajouter ou les modifier ici ;)
    "Bavardages incessants pendant le cours.",
    "Travail non fait à la maison.",
    "Oubli de matériel récurrent.",
    "Excellente participation aujourd'hui.",
    "Travail sérieux et appliqué."
];

export default function RemarquesPredefinies() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { eleveId } = params;

    const [loading, setLoading] = useState(false);

    const valider = (texteChoisi: string) => { //la fonction prend en parametre un string
        setLoading(true);

        fetch(`${API_URL}/remarques`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                intitule: texteChoisi, // On envoie le texte passé en argument
                eleveId: eleveId 
            })
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Erreur");
        })
        .then(() => { //des que c bon, on revient a la page de l'élève
            setLoading(false);
            router.back(); 
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
            Alert.alert("Erreur", "Impossible d'envoyer la remarque.");
        });
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: 18, color: '#4A90E2', marginRight: 15 }}>{"<--- Retour"}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Remarques</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 50 }} />
            ) : (
                <ScrollView>
                    {REMARQUES_PREDEFINIES.map((remarque, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.boutonRemarque}
                            onPress={() => valider(remarque)} 
                        >
                            <Text style={styles.texteRemarque}>{remarque}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    boutonRemarque: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
        elevation: 1 // Petite ombre sur Android
    },
    texteRemarque: {
        fontSize: 16,
        color: '#333'
    }
});