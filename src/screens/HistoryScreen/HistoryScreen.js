import React, { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import { TextInput, Button, Modal, Portal, Switch } from "react-native-paper";
import {
  Keyboard,
  Text,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import styles from "./styles";
import { db } from "../../firebase/configFirebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const getHistoryMaterials = async () => {
  const historyMaterials = [];
  const querySnapshot = await getDocs(collection(db, "history"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    historyMaterials.push(doc.data());
  });
  return historyMaterials;
};

export default function HistoryScreen(props) {
  const [entities, setEntities] = useState([]);
  const [entityAtual, setEntityAtual] = useState({
    codigo: 0,
    descricao: "",
    quantidade: 0,
  });
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const [textPesquisa, setTextPesquisa] = useState("");

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, entities.length);

  const pesquisar = () => {
    return entities.filter((item) => item.descricao.includes(textPesquisa));
  };

  const filteredMaterials = pesquisar(textPesquisa);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    async function fetchMaterials() {
      getHistoryMaterials().then((materials) => {
        console.log(materials);
        setEntities(materials);
      });
    }
    fetchMaterials();
  }, []);

  const visualizar = async (entity) => {
    console.log(entity);
    setEntityAtual(entity);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text>History Screen</Text>

          <Text>Código: {entityAtual.codigo}</Text>
          <Text>Descrição: {entityAtual.descricao}</Text>
          <Text>Quantidade: {entityAtual.quantidade}</Text>
          <Text>Unidade: {entityAtual.unidade?.value}</Text>
          <Text>Validade: {entityAtual.validade}</Text>
          <Text>Valor unitário: {entityAtual.valor}</Text>
          <Text>
            Valor total:{" "}
            {`R$ ${String(
              parseFloat(
                parseFloat(
                  String(entityAtual.valor)
                    .replace("R$ ", "")
                    .replace(".", "")
                    .replace(",", ".")
                ) * parseFloat(entityAtual.quantidade)
              ).toFixed(2)
            ).replace(".", ",")}`}
          </Text>
          <Text>Destino: {entityAtual.destino ? "Externo" : "Interno"}</Text>
          <Text>Descrição do destino: {entityAtual.descDestino}</Text>
          <Text
            style={entityAtual?.status ? { color: "red" } : { color: "black" }}>
            Estatus: {entityAtual?.status ? entityAtual.status : "Ativo"}
          </Text>
          <View>
            <TextInput
              style={styles.input}
              label="Pesquisar"
              placeholder="Pesquisar um material"
              onChangeText={(text) => setTextPesquisa(text)}
              value={textPesquisa}
            />
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Código</DataTable.Title>
              <DataTable.Title>Descrição</DataTable.Title>
              <DataTable.Title>Quantidade</DataTable.Title>
              <DataTable.Title>Ação</DataTable.Title>
            </DataTable.Header>
          </DataTable>
          {filteredMaterials.slice(from, to).map((entitie, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{entitie.codigo}</DataTable.Cell>
              <DataTable.Cell>{entitie.descricao}</DataTable.Cell>
              <DataTable.Cell>{entitie.quantidade}</DataTable.Cell>
              <DataTable.Cell onPress={() => visualizar(entitie)}>
                Visualizar
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(entities.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${entities.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows per page"}
            dropdownItemRippleColor="#20A64B"
            selectPageDropdownRippleColor="#20A64B"
            paginationControlRippleColor="#20A64B"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
