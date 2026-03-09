import { ThemedText } from "@/components/ThemedText";
import {Alert, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";

export function login(){
    const valider =()=>{
        
    }
    return(
        <View>
            <ThemedText variant= 'header'>
                <ThemedText variant= 'headerTitle'>ClassFlow </ThemedText>
            </ThemedText>
            <Text>Identifiant:</Text>
            <TextInput style={{borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 10,}}/>

            <Text>\n\nMot de passe:</Text>
            <TextInput style={{borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 10,}}/>

            <TouchableOpacity><Text>\n\nConnexion</Text></TouchableOpacity>
        </View>
    );
}