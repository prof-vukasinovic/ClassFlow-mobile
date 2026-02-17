import { TextProps, Text, StyleSheet } from "react-native"


const styles = StyleSheet.create({
    header:{
        padding: 0 , backgroundColor: "#d2ee9d", marginTop:35, marginLeft:20
    },
    headerTitle:{
        fontSize: 25, fontWeight: 'bold'
    },
    
    body3:{
        fontSize: 10, lineHeight:16
    }
})

type Props = TextProps &{
    variant?: keyof typeof styles,    //Je croois que le ? signifie que c'est oprionnel
    color?: string

}

export function ThemedText({variant, color, ...rest}:Props){
    return <Text style={styles[variant ?? 'body3']} {...rest}/>

}

