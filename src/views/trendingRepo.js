import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAPI } from './common/common';
import ErrorPage from './errorPage';
const TrendingRepo = () => {
    const [repoArray, setRepoArray] = useState([])
    const [showErrorPage, setShowErrorPage] = useState(false)
    useEffect(() => {
        getAPI(
            'https://gh-trending-api.herokuapp.com/repositories',
            async (data) => {
                await AsyncStorage.setItem('repoData', JSON.stringify(data))
                setRepoArray(data)
            },
            async (error) => {
                console.log('error')
                let n = JSON.parse(await AsyncStorage.getItem('repoData'))
                if (n) {
                    setRepoArray(n)
                } else {
                    setShowErrorPage(true)
                }
            }
        )
    }, [])
    return (
        <>
            {
                showErrorPage ?
                    <ErrorPage />
                    : <RenderFlatList data={repoArray} />
            }
        </>
    )
}
const RenderFlatList = ({ data }) => {
    const renderItem = ({ item }) => {
        return (
            <>
                <View style={styles.listContainer}>
                    <Image style={styles.avatarImage} source={{ uri: item['builtBy'][0]['avatar'] }} />
                    <View>
                        <Text style={{ color: 'black' }}>{item.repositoryName}</Text>
                    </View>
                </View>
            </>
        )
    }
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.rank}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    listContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    }
});
export default TrendingRepo;