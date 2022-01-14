import React, { useEffect, useState,useRef } from 'react';
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity,Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAPI } from './common/common';
import ErrorPage from './errorPage';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider
  } from 'react-native-popup-menu';
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
        <MenuProvider>
            {
                showErrorPage ?
                    <ErrorPage getData={getData} setShowErrorPage={setShowErrorPage} />
                    : <RenderFlatList loading={loading} getData={getData} data={repoArray} />
            }
        </MenuProvider>
        </>
    )
}
const RenderFlatList = ({ data, getData, loading }) => {
    const [open,setOpen]=useState(false)
    const [expanded,setExpanded]=useState({})
    const handleCollapse = (rank) => {
        setOpen(!open);
        let n = expanded;
        if (n[rank]) {
            n[rank] = false;
        } else {
            n[rank] = true;
        }
        setExpanded(n)
    }
    const renderItem = ({ item }) => {
        const height=expanded[item['rank']]?'auto':0;
        return (
            
            <TouchableOpacity onPress={() => { handleCollapse(item['rank']) }} activeOpacity={.3}>
                <View style={[styles.listContainer, { alignItems: height == 'auto' ? 'flex-start' : 'center' }]}>
                    <Image style={styles.avatarImage} source={{ uri: item['builtBy'][0]['avatar'] }} />
                    <View>
                        <Text style={styles.usernameText}>{item.username}</Text>
                        <Text style={styles.RepoText}>{item.repositoryName}</Text>
                        <View style={{ height: height, paddingRight: 100,opacity:height==0?0:1 }}>
                            <Text style={styles.usernameText}>{item.description}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center',marginRight:item.language?20:0 }}>
                                    {item.language ?<View style={[styles.languageCircle,{backgroundColor: item.languageColor}]}>
                                    </View>:null}
                                    <Text>{item.language}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center',marginRight:20 }}>
                                    <Image style={{ width: 12, height: 12, marginRight: 5 }} source={{ uri: 'https://res.cloudinary.com/dzkartmuf/image/upload/v1642103841/star_1_hyujtk.png' }} />
                                    <Text>{item.totalStars}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center',marginRight:20  }}>
                                    <Image style={{ width: 12, height: 12, marginRight: 5 }} source={{ uri: 'https://res.cloudinary.com/dzkartmuf/image/upload/v1642103841/connection_fofrqp.png' }} />
                                    <Text>{item.totalStars}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    useEffect(()=>{
      setOpen(false)
      setExpanded({})
    },data)
    return (
        <>  
        
            <View style={[styles.header, { flexDirection: 'row',elevation:0 }]}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' }}>Trending</Text>
                    <Menu style={{position:'absolute',right:0,paddingBottom:20}}>
                        <MenuTrigger>
                                <Image style={{ width: 22, height: 20,position: 'absolute', right: 10 }} source={require('../assets/dots.png')} />
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{elevation:5,padding:10}}>
                            <MenuOption onSelect={() => {}} text='Home' customStyles={{optionText:styles.optionStyle}} />
                            <MenuOption onSelect={() => {}} text='Stared Repositories' customStyles={{optionText:styles.optionStyle}}/>
                            <MenuOption onSelect={() => {}} text='Language Headers' customStyles={{optionText:[styles.optionStyle,{marginBottom:0}]}}/>
                        </MenuOptions>
                    </Menu>
                
            </View>
            {loading
                ? <LoadingList />
                :
                <FlatList
                    refreshing={loading}
                    onRefresh={() => { getData() }}
                    data={data}
                    extraData={open}
                    renderItem={renderItem}
                    keyExtractor={item => item.rank}
                />
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
                    <View style={{width:'80%'}}>
                        <View style={[styles.usernameText,styles.skUsername]}></View>
                        <View style={[styles.RepoText,styles.skRepo]}></View>
                    </View>
                </View>
            )}
        </SkeletonPlaceholder >
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
        borderBottomWidth: .5,
        borderTopWidth:.5,
        borderBottomColor: 'lightgrey',
        borderTopColor:'lightgrey'
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
        width: '40%',
        height: 10,
        borderRadius: 4,
        marginBottom: 15
    },
    skRepo: {
        width: 'auto',
        height: 10,
        borderRadius: 4
    },
    optionStyle:{
        fontSize:16,
        color:'black',
        marginBottom:5
    },
    languageCircle: {
        borderRadius: 16,
        width: 10,
        height: 10,
        marginRight: 5
    }
});
export default TrendingRepo;