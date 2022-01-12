import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAPI } from './common/common';
import ErrorPage from './errorPage';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const TrendingRepo = () => {
    const [repoArray, setRepoArray] = useState([])
    const [showErrorPage, setShowErrorPage] = useState(false)
    const [loading, setLoading] = useState(false)
    const getData = () => {
        setLoading(true)
        getAPI(
            'https://gh-trending-api.herokuapp.com/repositories',
            async (data) => {
                await AsyncStorage.setItem('repoData', JSON.stringify(data))
                setRepoArray(data)
                setLoading(false)
            },
            async (error) => {
                setLoading(false)
                console.log('error')
                let n = JSON.parse(await AsyncStorage.getItem('repoData'))
                if (n) {
                    setRepoArray(n)
                } else {
                    setShowErrorPage(true)
                }
            }
        )
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <>
            {
                showErrorPage ?
                    <ErrorPage />
                    : <RenderFlatList loading={loading} getData={getData} data={repoArray} />
            }
        </>
    )
}
const LoadingList = () => {
    return (
        <SkeletonPlaceholder>
            {Array.apply(null, { length: 15 }).map((x, i) =>
                <View style={styles.listContainer}>
                    <View style={styles.avatarImage} >
                    </View>
                    <View>
                        <View style={[styles.usernameText,styles.skUsername]}></View>
                        <View style={[styles.RepoText,styles.skRepo]}></View>
                    </View>
                </View>
            )}
        </SkeletonPlaceholder >
    )
}
const RenderFlatList = ({ data, getData, loading }) => {
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
            {loading
                ? <LoadingList />
                :
                <FlatList
                    refreshing={loading}
                    onRefresh={() => { getData() }}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.rank}
                />
            }
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
        fontWeight: '500',
        color: 'black'
    },
    header: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        elevation: 5
    },
    skUsername: {
        width: 100,
        height: 10,
        borderRadius: 4,
        marginBottom: 10
    },
    skRepo: {
        width: 250,
        height: 10,
        borderRadius: 4
    }
});
export default TrendingRepo;