import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { API_URL } from "../constants/config"; // ⚠️ Vérifie que le chemin est bon !

export default function Dropdown({ onSelect }: { onSelect: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState([
    "Autre..."
  ]);

  const [customValue, setCustomValue] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/devoirs-non-faits`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const tousLesDevoirs = data.map((remarque: any) => remarque.intitule);
          const devoirsUniques = Array.from(new Set(tousLesDevoirs));
          setOptions([...devoirsUniques, "Autre..."]);
        }
      })
      .catch(err => console.error("Erreur de chargement de l'historique des devoirs :", err));
  }, []); 

  const handleSelect = (opt: string) => {
    if (opt === "Autre...") {
      setAddingCustom(true);
    } else {
      setSelected(opt);
      onSelect(opt);
      setOpen(false);
    }
  };

  const addCustomOption = () => {
    if (customValue.trim() === "") return;
    setOptions([...options.slice(0, -1), customValue, "Autre..."]);
    setSelected(customValue);
    onSelect(customValue);
    setCustomValue("");
    setAddingCustom(false);
    setOpen(false);
  };

  return (
    <View style={{ margin: 10 }}>
      <TouchableOpacity
        onPress={() => {
          setOpen(!open);
          setAddingCustom(false);
        }}
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        <Text>{selected || "Choisir un devoir"}</Text>
      </TouchableOpacity>
      {open && !addingCustom && (
        <View
          style={{
            marginTop: 5,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: "#fff",
            overflow: "hidden",
            maxHeight: 250, // Permet de scroller si la liste devient très longue au fil de l'année
          }}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => handleSelect(opt)}
              style={{
                padding: 12,
                backgroundColor: selected === opt ? "#dff2ff" : "#fff",
              }}
            >
              <Text style={{ color: selected === opt ? "#245576" : "#000" }}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {open && addingCustom && (
        <View
          style={{
            marginTop: 5,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: "#fff",
            padding: 10,
          }}
        >
          <Text style={{ marginBottom: 5 }}>Nouveau devoir :</Text>

          <TextInput
            value={customValue}
            onChangeText={setCustomValue}
            placeholder="Ex: Devoir Maison n°3"
            style={{
              borderWidth: 1,
              borderRadius: 6,
              padding: 8,
              marginBottom: 10,
            }}
          />

          <TouchableOpacity
            onPress={addCustomOption}
            style={{
              backgroundColor: "#dff2ff",
              padding: 10,
              borderRadius: 6,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#245576", fontWeight: "bold" }}>Sélectionner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAddingCustom(false)}
            style={{ marginTop: 10, alignItems: "center" }}
          >
            <Text style={{ color: "red" }}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}