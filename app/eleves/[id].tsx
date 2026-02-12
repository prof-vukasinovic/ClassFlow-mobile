import {StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from 'react'; 
import { Link, useLocalSearchParams } from "expo-router";


export default function eleve() {
    const params = useLocalSearchParams();
    <View>
      <Text style={{backgroundColor: "#ee9d9d", padding: 50,}}>Eleve {params.id}</Text>
    </View>
}