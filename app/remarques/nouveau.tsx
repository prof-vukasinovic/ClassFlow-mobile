// Fichier: app/remarques/nouveau.tsx
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from '../../components/ThemedText';
import { API_URL } from "../../constants/config";

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

        fetch(`${API_URL}/remarques`, {
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
            {/*Alert.alert("For Sure!", "Je crois que la remarque a été ajoutée ", [
                { text: "OK", onPress: () => router.back() }
            ]);*/}
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
            
            <Text style={{ fontSize: 22, marginTop: 20, marginBottom:10, fontWeight: 'bold' }}>Nouvelle remarque</Text>

            <TextInput
                style={styles.input}
                multiline={true}
                placeholder="Écrire ici..."
                value={texte}
                onChangeText={setTexte}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => router.back()} style={styles.btn}>
                    <Text>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={valider} 
                    disabled={loading || !texte}
                    style={[styles.btn, { backgroundColor: "#ddd" }]}
                >
                    {loading ? <ActivityIndicator color="black"/> : <Text>Valider</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
        textAlignVertical: "top"
    },
    btn: {
        borderWidth: 1,
        padding: 10,
        minWidth: 80,
        alignItems: 'center',
        marginBottom: 30,
    }
});