import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
            <TouchableOpacity activeOpacity={.3}>
                <View style={styles.listContainer}>
                    <Image style={styles.avatarImage} source={{ uri: item['builtBy'][0]['avatar'] }} />
                    <View>
                        <Text style={styles.usernameText}>{item.username}</Text>
                        <Text style={styles.RepoText}>{item.repositoryName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <>
            <View style={styles.header}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' }}>Trending</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.rank}
            />
        </>
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
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    usernameText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 3
    },
    RepoText: {
        fontSize: 16,
        fontWeight: '500'
    },
    header: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        elevation: 5
    }
});
export default TrendingRepo;