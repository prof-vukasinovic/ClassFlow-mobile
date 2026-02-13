// Fichier: app/remarques/nouveau.tsx
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from '../../components/ThemedText';

export default function NouvelleRemarque() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // On récupère les infos de l'élève pour savoir à qui on écrit
    const { eleveId, nom, prenom } = params;

    const [texte, setTexte] = useState("");
    const [loading, setLoading] = useState(false);

    const valider = () => {
        if (texte.trim() === "") return;

        setLoading(true);

        fetch("http://192.168.1.184:8080/remarques", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                intitule: texte,
                eleveId: eleveId 
            })
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Erreur");
        })
        .then(() => {
            setLoading(false);
            // Une fois fini, on retourne en arrière
            // (Note: La liste précédente ne se mettra pas à jour automatiquement sans configuration avancée, 
            // mais la donnée est bien en base)
            Alert.alert("Succès", "Remarque ajoutée !", [
                { text: "OK", onPress: () => router.back() }
            ]);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
            Alert.alert("Erreur", "Impossible d'envoyer la remarque.");
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#ffffff", padding: 20 }}>
            {/* Header simple */}
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, color: "gray", marginTop:20 }}>Nouvelle remarque</Text>
            </View>

            <TextInput
                style={styles.inputGeant}
                multiline={true} // Permet d'écrire sur plusieurs lignes
                textAlignVertical="top" // Le texte commence en haut
                placeholder="Écrivez votre observation ici..."
                autoFocus={true} // Le clavier s'ouvre direct (en vrai on peut l"enleverje pe,se)
                value={texte}
                onChangeText={setTexte}
            />

            <View style={styles.boutonsContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.btnAnnuler}>
                    <Text style={{ color: "gray" }}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={valider} 
                    style={[styles.btnValider, { opacity: texte ? 1 : 0.5 }]}
                    disabled={!texte || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Valider</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputGeant: {
        flex: 1, // Prend toute la place dispo au milieu
        fontSize: 18,
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginBottom: 20,
    },
    boutonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    btnAnnuler: {
        padding: 15,
    },
    btnValider: {
        backgroundColor: "#4A90E2",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30, // Bouton arrondi
        elevation: 5
    }
});