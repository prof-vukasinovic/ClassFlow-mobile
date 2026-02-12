import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack 
    screenOptions={{
      headerShown: false
    }}
  />; //stack permet d'indiquer le type de navigation utilisé
}
