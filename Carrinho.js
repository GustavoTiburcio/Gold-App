/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import BotaoVermelho from './components/BotaoVermelho';
import { buscarItensCarrinhoNoBanco, limparItensCarrinhoNoBanco, deletarItenCarrinhoNoBanco, buscarCodVenBanco } from './controle/CarrinhoStorage';
import { openDatabase } from 'react-native-sqlite-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { postPedido } from './services/requisicaoInserePedido';

const Carrinho = ({ route, navigation }) => {
    const [itensCarrinho, setItensCarrinho] = useState();
    const [valorBruto, setValorBruto] = useState(0);
    const isFocused = useIsFocused();
    const [nomeCliente, setNomeCliente] = useState();
    const [codigoVendedor, setCodigoVendedor] = useState();
    async function deleteClick(mer) {
        if (mer != null) {
            await deletarItenCarrinhoNoBanco(mer);
            buscarItens();
        }
    }
    async function buscarItens() {
        await buscarItensCarrinhoNoBanco().then(resultado => {
            if ((resultado != null) && (resultado !== [])) {
                const setValorBrutoInicial = () => resultado.reduce(
                    (valorAnterior, item) =>
                        valorAnterior + (item.valor * item.quantidade),
                    0,
                );
                setValorBruto(setValorBrutoInicial);
            }
            setItensCarrinho(resultado);
        });
        await buscarCodVenBanco().then(resultado => setCodigoVendedor(resultado));
    }

    useEffect(() => {
        // enviaPedido();
        navigation.addListener('focus', () => {
            buscarItens();
        });
    }, [navigation]);
    function enviaPedido() {
        const ite = itensCarrinho.map((iten) => {
            return '/' + iten.codmer + ',' + iten.quantidade + ',' + iten.valor;
        });
        postPedido('/' + nomeCliente + '/' + codigoVendedor + ite).then(resultado => {
            if (resultado != "erro ao salvar pedido") {
                limparItensCarrinhoNoBanco().then(resultado => {
                    //salvarSqlLite();
                    setItensCarrinho(null);
                    setValorBruto(0);
                    navigation.navigate('ListaSecao');
                });
            } else { Alert.alert("falhou ao salvar, tente novamente"); }
        });
    }


    function salvarApi() {
        const pedido = {
            cod: 1,
            dathor: new Date(),
            appuser: {
                id: 1
            },
            itensPedido: itensCarrinho
        }
    }
    function salvarSqlLite() {

        let codped = 0;
        var db = openDatabase({ name: 'VendaDatabase.db' });
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_pedido'",
                [],
                function (tx, res) {
                    if (res.rows.length > 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_pedido', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_pedido(pedido_id INTEGER PRIMARY KEY AUTOINCREMENT, pedido_codcli INTEGER)',
                            []
                        );
                        txn.executeSql('DROP TABLE IF EXISTS table_itenPedido', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_itenPedido(itenPedido_id INTEGER PRIMARY KEY AUTOINCREMENT, itenPedido_codped INTEGER, itenPedido_codmer INTEGER, itenPedido_qua INTEGER, itenPedido_valuni VARCHAR(20),itenPedido_mer VARCHAR(20))',
                            []
                        );
                    }
                }
            );
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO table_pedido (pedido_codcli) VALUES (?)',
                    ['1'],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Success You are Registered Successfully');
                        } else console.log('Registration Failed');
                    },
                );
            });
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT max(pedido_id) pedido_id FROM table_pedido  ', [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            let res = results.rows.item(0);
                            codped = res.pedido_id;
                        } else {
                            console.log('No user found');
                        }
                    },
                );
            });
            itensCarrinho.map((itemCar) => {
                db.transaction(function (tx) {
                    tx.executeSql(
                        'INSERT INTO table_itenPedido (itenPedido_codped, itenPedido_codmer, itenPedido_qua, itenPedido_valuni, itenPedido_mer) VALUES (?,?,?,?,?)',
                        [codped, itemCar.codmer, itemCar.quantidade, itemCar.valor, itemCar.item],
                        (tx, results) => {
                            if (results.rowsAffected > 0) {
                                console.log('Success You are Registered Successfully');
                            } else console.log('Registration Failed');
                        },
                    );
                });
            });
        });
    }

    return (
        <View id={"pai"}>
            <ScrollView style={styles.scrollContainer}>
                {itensCarrinho != null ?
                    <View id={"itens"}>
                        {itensCarrinho.map((itemCar, key) => {
                            return (
                                <View key={key} style={styles.container}>
                                    <View style={styles.itenWiew}>

                                        <Text style={styles.textItem}>{itemCar.item}</Text>

                                        <TouchableOpacity onPress={() => deleteClick(itemCar)} style={styles.deleteButton}>
                                            <Ionicons
                                                name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                                                size={23}
                                                color="red"
                                            />
                                        </TouchableOpacity>
                                    </View >

                                    <View style={styles.itenWiew}>

                                        <Text style={styles.textQuantidade}>{itemCar.quantidade}</Text>
                                        <Text style={styles.valorItem}>R$ {Number.parseFloat(itemCar.valor).toFixed(2)}</Text>
                                        <Text style={styles.valorTotalItem}>R$ {Number.parseFloat(itemCar.valor * itemCar.quantidade).toFixed(2)}</Text>
                                    </View>
                                </View>
                            )
                        })}
                        <View flexDirection="row">
                            <Text style={styles.textValorPedido}> Valor Total: </Text>
                            <Text style={styles.valorTotalPedido}>R$ {valorBruto.toFixed(2)}</Text>
                        </View>
                        <View flexDirection="row">
                            <Text style={styles.textCliente}> Cliente: </Text>
                            <TextInput style={styles.textinput} color="black" placeholder='Nome Cliente ...' onChangeText={value => setNomeCliente(value)} ></TextInput>
                        </View>

                        <BotaoVermelho
                            text={`Finalizar Pedido`}
                            onPress={() => enviaPedido()}></BotaoVermelho>
                    </View>
                    : <View>
                        <Text style={styles.textCarinhoVazio}>Carrinho Vazio ... </Text>
                    </View>
                }
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: 'space-between',

    },
    itenWiew: {
        flexDirection: 'row',
    },
    textItem: {
        width: '85%',
        padding: 1,
        fontSize: 20,
        color: "#666666",
        fontWeight: "bold",
        textAlignVertical: "center",
        alignSelf: "center",
        alignItems: 'flex-start',
    },
    textQuantidade: {
        width: '30%',
        padding: 1,
        fontSize: 17,
        color: "#666666",
        fontWeight: "bold",
        textAlignVertical: "center",
        alignSelf: "flex-start",
        alignItems: 'flex-start',
    },
    valorItem: {
        fontSize: 17,
        color: "#666666",
        fontWeight: "bold",
        borderRadius: 40,
        padding: 3,
        textAlign: "right",
        alignSelf: "center",
        width: '30%',
        alignItems: 'center',

    },

    valorTotalItem: {
        fontSize: 17,
        color: "#666666",
        fontWeight: "bold",
        borderRadius: 40,
        padding: 3,
        textAlign: "right",
        alignSelf: "flex-end",
        width: '40%',
        alignItems: 'flex-end',

    },
    textCliente: {
        width: '20%',
        fontSize: 20,
        color: "#666666",
        fontWeight: "bold",
        alignSelf: "flex-start",
        alignItems: 'flex-start',
    },
    textinput: {
        width: '80%',
        fontSize: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        textAlignVertical: "center",
        alignSelf: "center",
        alignItems: "flex-end"
    },
    textValorPedido: {
        paddingTop: 11,
        width: '50%',
        fontSize: 20,
        color: "#666666",
        fontWeight: "bold",
        alignSelf: "flex-start",
        alignItems: 'flex-start',
    },

    valorTotalPedido: {
        fontSize: 17,
        color: "#666666",
        fontWeight: "bold",
        borderRadius: 40,
        padding: 3,
        textAlign: "right",
        alignSelf: "flex-end",
        width: '48%',
        alignItems: 'flex-end',

    },

    semItem: {
        padding: 40,
        fontSize: 20,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#004400",
    },
    deleteButton: {
        marginRight: 1,
        paddingLeft: 20,
        alignSelf: "center",
        alignItems: 'flex-end',

    },
    textCarinhoVazio: {
        paddingTop: 20,
        width: '100%',
        fontSize: 20,
        color: "#666666",
        fontWeight: "bold",
        alignSelf: "center",
        alignItems: "center",
        textAlign: "center"
    },
});
export default Carrinho;