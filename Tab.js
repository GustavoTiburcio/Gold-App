import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppListProdutos from './AppListProdutos';
import Carrinho from './Carrinho';
import ListaCarrinho from './ListaCarrinho';
import AppVendasFinalizadas from './AppVendasFinalizadas';
import AppLogin from './AppLogin';
import AppClientes from './AppClientes';
import AppEstoque from './AppEstoque';
import AppCadastroCliente from './AppCadastroCliente';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs({route}){
  return(
    <Tab.Navigator
    tabBarOptions={{
      style: {
          elevation: 0,
          shadowOpacity: 0,
          height: 64,
      },
      tabStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
      },
      labelStyle: {
          fontSize: 13,
          marginLeft: 16
      },
      inactiveBackgroundColor: '#fafafc',
      activeBackgroundColor: '#ebebf5',
      inactiveTintColor: '#c1bccc',
      activeTintColor: '#32264d'
    }}
    >
      <Tab.Screen name="Produtos" component = {AppListProdutos} />
      <Tab.Screen name="Carrinho" component = {Carrinho} />
      <Tab.Screen name="Histórico" component = {AppVendasFinalizadas} />
    </Tab.Navigator>
  )
}

export default function App() {

    // const getData = async () => {
    //   let login;
    // try {
    //       const jsonValue = await AsyncStorage.getItem('@login_data')
    //       console.log('LOGIN DATA')
    //       console.log(jsonValue)
    //       jsonValue != null ? login = JSON.parse(jsonValue) : null;
    //       return 'Bem vindo' + login.username
    // } catch(e) {
    //       console.log('Erro ao ler login')
    //       console.log(e)
    //     }
    // }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppLogin">
        <Stack.Screen 
        name="AppListProdutos" 
        component={Tabs}
        options={{
          title: 'Bem-Vindo',
          headerStyle: {
            backgroundColor: '#121212',
            padding: 40,
          },
          headerTintColor: '#FFF'
        }}
        />
        <Stack.Screen 
        name="ListaCarrinho" 
        component={ListaCarrinho} 
        options={{
          title: 'Inserir item',
          headerStyle: {
            backgroundColor: '#121212',
            padding: 40,
          },
          headerTintColor: '#FFF'
        }}
        />
        <Stack.Screen
        name="AppLogin" 
        component={AppLogin} 
        options={{
          headerShown: false
        }} 
        />
        <Stack.Screen 
        name="Carrinho" 
        component={Carrinho}
        options={{
          headerShown: false
        }}  
        />
        <Stack.Screen 
        name="AppVendasFinalizadas" 
        component={AppVendasFinalizadas} 
        options={{
          headerShown: false
        }} 
        />
        <Stack.Screen 
        name="AppClientes" 
        component={AppClientes}
        options={{
          title: 'Selecionar Cliente',
          headerStyle: {
            backgroundColor: '#121212',
            padding: 40,
          },
          headerTintColor: '#FFF'
        }}
        />
        <Stack.Screen 
        name="AppCadastroCliente" 
        component={AppCadastroCliente}
        options={{
          title: 'Cadastro Novo Cliente',
          headerStyle: {
            backgroundColor: '#121212',
            padding: 40,
          },
          headerTintColor: '#FFF'
        }}
        />
        <Stack.Screen 
        name="AppEstoque" 
        component={AppEstoque}
        options={{
          title: 'Estoque',
          headerStyle: {
            backgroundColor: '#121212',
            padding: 40,
          },
          headerTintColor: '#FFF'
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}