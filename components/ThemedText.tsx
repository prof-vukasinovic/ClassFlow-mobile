import { TextProps, Text, StyleSheet } from "react-native"


const styles = StyleSheet.create({
    header:{
        padding: 22 , backgroundColor: "#d2ee9d"
    },
    headerTitle:{
        fontSize: 24, fontWeight: 'bold'
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

