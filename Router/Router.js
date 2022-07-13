import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ListProdutos from '../src/pages/ListProdutos';
import Carrinho from '../src/pages/Carrinho';
import ListaCarrinho from '../src/pages/ListaCarrinho';
import VendasFinalizadas from '../src/pages/VendasFinalizadas';
import Clientes from '../src/pages/Clientes';
import Estoque from '../src/pages/Estoque';
import CadastroCliente from '../src/pages/CadastroCliente';
import SignIn from '../src/pages/Login';
import Welcome from '../src/pages/TelaInicial';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Router() {
  return (
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
      <Tab.Screen name="Produtos" component={ListProdutos} />
      <Tab.Screen name="Carrinho" component={Carrinho} />
      <Tab.Screen name="Histórico" component={VendasFinalizadas} />
    </Tab.Navigator>
  )
}

export default function () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListProdutos"
          component={Router}
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
          name="Carrinho"
          component={Carrinho}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="VendasFinalizadas"
          component={VendasFinalizadas}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Clientes"
          component={Clientes}
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
          name="CadastroCliente"
          component={CadastroCliente}
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
          name="Estoque"
          component={Estoque}
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