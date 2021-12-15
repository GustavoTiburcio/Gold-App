import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from './api';
import {StatusBar} from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import {useNavigation} from '@react-navigation/native';
import BotaoVermelho from './components/BotaoVermelho';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Print from 'expo-print';
 
export default function AppVendasFinalizadas({ route, navigation }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('Gold');
  const [itensPedidos, setItensPedidos]= useState([]);
  const [dadosPedido, setDadosPedido]= useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(()=>{
    loadApi();
  },[])

  useEffect(()=>{

  },[dadosPedido])

  useEffect(()=>{
    setRefresh(false)
  },[refresh])

  async function loadApi(){
    if(loading) return;

    setLoading(true)

    const response = await api.get(`/pedidos/listarPorCliente?page=${page}&nome=${pesquisa}`)

    const resp = response.data.content;

    const itePed = resp.map((ped) => {
      return { codped: ped.cod, mer: ped.mer, qua: ped.qua, valUni: ped.valUni }
    });
    setItensPedidos([...itensPedidos, ...itePed]);
    const cabPedAux = resp.map((ped) => {
        return { cod: ped.cod, datHor: ped.datHor, raz: ped.raz, valTot: ped.valTot, valFre: ped.valFre, exp: ped.exp, visualizarItens: false }
    });

    const cabPed = cabPedAux
        .map(e => JSON.stringify(e))
        .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
        .map(e => JSON.parse(e));

    setData([...data, ...cabPed])
    console.log(data);
    console.log('itens');
    console.log(itePed);
    setPage(page + 1);
    setLoading(false);
  }

  function novaPesquisa(){
    setPage(0);
    setData([]);
  }

  function currencyFormat(num) {
    return num.toFixed(2);
  }

  function FooterList( Load ){
    if(!Load) return null;
    return(
      <View style={styles.loading}>
      <ActivityIndicator size={25} color="#121212" />
      </View>
    )
  }

  function filtrarItePed(codped){
    const itensfiltrados = itensPedidos.filter(function(items){
      return items.codped == codped;
    });
    console.log('teste itens filtrados');
    console.log(itensfiltrados);
  
    const itens = itensfiltrados.map(item => {
      return ( 
          <View key={item.mer}>
            <Grid>
              <Col size={15}>
                <Row style={styles.cell}>
                  <Text>{item.qua}x</Text>
                </Row>
              </Col>
              <Col size={50}>
                <Row style={styles.cell}>
                  <Text>{item.mer}</Text>
                </Row>
              </Col>
              <Col size={25}>
                <Row style={styles.cell}>
                  <Text>R$ {item.valUni.toFixed(2).replace('.',',')}</Text>
                </Row>
              </Col>
            </Grid>
          </View> 
        )
      });
    return itens;
  }
  
  function ListItem( {data} ){  
  
    const navigation = useNavigation();
    let datVen = data.datHor;

    return(
      <View style={styles.listItem}>
        <Text style={styles.listText}>Cód: {data.cod}</Text>
        <Text style={styles.listText}>Data: {datVen.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</Text>
        <Text style={styles.listText}>Razão social: {data.raz}</Text>
        {data.visualizarItens ? <Text style={{textAlign: 'center', fontSize: 18, color:'#000000', paddingTop: 5, paddingBottom: 10, fontWeight: 'bold'}} >Produtos</Text> : <Text></Text>}
        {data.visualizarItens ? filtrarItePed(data.cod) : null}
        <Text style={styles.ValVenText}>Total: R$ {data.valTot.toFixed(2).replace('.',',')}</Text>
        <View style={{ flexDirection:"row" }}>
              <TouchableOpacity
              style={styles.DetalhesButton}
              activeOpacity={0.5}
              onPress={() => {
                if (data.visualizarItens == false) {
                  data.visualizarItens = true;
                  setRefresh(true);
                } else {
                  data.visualizarItens = false;
                  setRefresh(true);
                }
                }}>
                <Text style={styles.TextButton}> {data.visualizarItens ? '    Fechar' : 'Detalhes(+)'} </Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.DetalhesButton}
              activeOpacity={0.5}
              onPress={() => {createAndPrintPDF(data.cod)}}>
                <Text style={styles.TextButton}> Imprimir </Text>
              </TouchableOpacity>
        </View>
      </View>
    )
  }

  const createAndPrintPDF = async (codped) => {

    const response = await api.get(`pedidos/listarParaImprimir?cod=${codped}`)
    setDadosPedido(response.data)
    console.log('Dados pedido')
    console.log(dadosPedido.Pedidos[0]);

    var PrintItems = dadosPedido.Pedidos[0].itensPedido.map(function(item){
      return `<tr>
      <td style={{ fontSize: "38px" , maxWidth:"145px"}}>
          <b>${item.mer}</b>
      </td>
      <td style={{ fontSize: "38px" , maxWidth:"20px"}} >
          <b>${item.qua}</b>
      </td>
      <td style={{ fontSize: "38px" , maxWidth:"60px" }}>
          <b>${item.valUni.toFixed(2).replace('.',',')}</b>
      </td>
      <td style={{ fontSize: "38px" , maxWidth:"80px" }}>
          <b>${(item.qua * item.valUni).toFixed(2).replace('.',',')}</b>
      </td>
      </tr>`;
  });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pdf Content</title>
          <style>
              body {
                  color: #000000;
              }
              p {
                font-family: "Didot", "Times New Roman";
                font-size: 38px;
                margin: 0;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                text-align: left;
                padding: 8px;
                font-family: "Didot", "Times New Roman";
                font-size: 38px;
              }
              tr:nth-child(even) {
                background-color: #f2f2f2;
                margin-bottom:0px
              }
              div.small{
                
              }
          </style>
      </head>
      <body>
        <div class="small">
        </br>
        </br>
          <p></p>
          <p align="right"><b>Venda ${codped}</b></p>
          </br>
          <p align="center"><b>GOLD CHAVES</b></p>
          </br>
          <p align="center"><b>Av. Brasil, 2796 - Zona 03, Maringá - PR, (44)3227-5493</b></p>
          </br>
          </br>
          <div>
            <p><b>Data: ${dadosPedido.Pedidos[0].dat}</b></p>
            <p><b>Vendedor: </b></p>
            <p><b>Razão Social:</b><b> ${dadosPedido.Pedidos[0].cliente.raz}</b></p>
            <p><b>CPF/CNPJ: ${dadosPedido.Pedidos[0].cliente.cgc}</b><b> Telefone: ${dadosPedido.Pedidos[0].cliente.tel}</b></p>
            <p><b>Email: ${dadosPedido.Pedidos[0].cliente.ema}</b></p>
            <p><b> Endereço: ${dadosPedido.Pedidos[0].cliente.endereco[0].log + ', ' + dadosPedido.Pedidos[0].cliente.endereco[0].num}</b></p>
            <p><b>Bairro: ${dadosPedido.Pedidos[0].cliente.endereco[0].bai}</b><b> Cidade: ${dadosPedido.Pedidos[0].cliente.endereco[0].cid + ' - ' + dadosPedido.Pedidos[0].cliente.endereco[0].uf}</b></p>
          </div>
          <table>
                                  <thead>
                                      <tr>
                                          <th>Descricao</th>
                                          <th>Qtd</th>
                                          <th>Vlr</th>
                                          <th>Total</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                  ${PrintItems}
                                  </tbody>
          </table>
          </div>
          </br>
          <p style="text-align:right"><b>Total geral: R$ ${dadosPedido.Pedidos[0].valPro.toFixed(2).replace('.',',')}</b></p>
      </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ 
        html: htmlContent,
        width: 1000, height: 1500 });
      console.log(uri)
      await Print.printAsync({
          uri:uri
        })
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do cliente"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => {}}
        returnKeyType="go"
        onSubmitEditing={() => {}}
      />
      <Text style={{textAlign: 'center', fontSize: 24, color:'#000000', paddingTop: 10}}>Histórico de vendas</Text>
       <FlatList 
        contentContainerStyle={{marginHorizontal: 20}}
        data={data}
        keyExtractor={item => String(item.cod)}
        renderItem={({ item }) => <ListItem data={item}/>}
        onEndReached={loadApi}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<FooterList load={loading} />}
      />
    </View>
  );
}


 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    backgroundColor: '#F3F3F3',
    padding: 22,
    marginTop: 15,
    borderRadius: 10,
  },
  listText:{
    fontSize: 16,
    color:'#000000'
  },
  ValVenText:{
    fontSize: 16,
    color:'#000000',
    marginLeft: 180,
    fontWeight: 'bold',
  },
  TextButton: {
    fontSize: 14,
    color:'#FFF',
  },
  DetalhesButton: {
    marginTop: 15,
    height:50,
    padding: 15,
    borderRadius: 25,
    borderWidth: 0,
    marginBottom: 15,
    marginHorizontal: 20,
    backgroundColor: '#121212',
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    padding: 10
  }
});