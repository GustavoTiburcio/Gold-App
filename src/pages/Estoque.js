import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import api from '../services/api';

export default function Estoque({ route, navigation }) {

  const codbar = route.params?.codbar;
  let teste;
  const [data, setData] = useState({});

  async function getListarEstoque() {
    const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
    setData(response.data)
  }

  useEffect(() => {
    getListarEstoque();
  }, [])

  useEffect(() => {

  }, [data])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoque</Text>
      <View style={styles.tableView}>
        <Grid>
          <Col size={50}>
            <Row style={styles.cell}>
            </Row>
            <Row style={styles.cell}>
              <Text>Categoria 1</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>Categoria 2</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>Categoria 3</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>Categoria 4</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>Categoria 5</Text>
            </Row>
          </Col>
          <Col size={25}>
            <Row style={styles.cell}>
              <Text>Quantidade</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>{data.estest1}</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>{data.estest2}</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>{data.estest3}</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>{data.estest4}</Text>
            </Row>
            <Row style={styles.cell}>
              <Text>{data.estest5}</Text>
            </Row>
          </Col>
        </Grid>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    paddingTop: 10
  },
  tableView: {
    width: '100%',
    height: 300,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

