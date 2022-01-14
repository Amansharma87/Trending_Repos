import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
const ErrorPage = ({ getData, setShowErrorPage }) => {
    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>Trending</Text>
            </View>
            <View style={styles.container}>
                <Image style={{ width: 300, height: 200 }} source={require('../assets/no_signal.jpg')} />
                <Text style={styles.wentwrong}>Something went wrong...</Text>
                <Text style={{ marginTop: 10 }}>An alien is probably blocking your signal.</Text>
                <View style={styles.buttonContainer} >
                    <TouchableOpacity onPress={() => { setShowErrorPage(false); getData() }} style={styles.greenButton}>
                        <Text style={styles.buttonText}>RETRY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    headerText: {
        fontSize: 18,
        fontWeight: '700',
        color: 'black'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    , header: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        elevation: 5
    },
    greenButton: {
        borderColor: 'green',
        justifyContent: "center",
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 4,
        backgroundColor: 'white',
        elevation: 2
    },
    wentwrong: {
        fontWeight: '700',
        fontSize: 18,
        marginTop: 10,
        color: 'black'
    },
    buttonText: {
        fontWeight: '500',
        color: 'green',
        fontSize: 16
    },
    buttonContainer: {
        paddingHorizontal: 20,
        width: '100%',
        marginTop: 100
    }
});
export default ErrorPage;