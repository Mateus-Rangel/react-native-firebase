import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Modal,
  Portal,
  Switch,
  DataTable,
} from "react-native-paper";
import { PaperSelect } from "react-native-paper-select";
import MaskInput, { Masks } from "react-native-mask-input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard, Text, View, ScrollView, SafeAreaView } from "react-native";
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
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
const getMaterials = async () => {
  const materials = [];
  const querySnapshot = await getDocs(collection(db, "materials"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    materials.push(doc.data());
  });
  return materials;
};

export default function HomeScreen({ navigation }) {
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState({
    value: "",
    list: [
      { _id: "1", value: "unidades" },
      { _id: "2", value: "metros" },
      { _id: "3", value: "kilos" },
      { _id: "4", value: "litros" },
    ],
    selectedList: [],
    error: "",
  });
  const [validade, setValidade] = useState("");
  const [valor, setValor] = useState("");
  const [destino, setDestino] = useState(false);
  const [descDestino, setDescDestino] = useState("");
  const [entities, setEntities] = useState([]);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const [visible, setVisible] = useState(false);
  const [entityAtual, setEntityAtual] = useState({
    codigo: 0,
    descricao: "",
    quantidade: 0,
  });
  const [idAtual, setIDAtual] = useState("");
  const [textPesquisa, setTextPesquisa] = useState("");

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  async function fetchMaterials() {
    getMaterials().then((materials) => {
      console.log(materials);
      setEntities(materials);
    });
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, entities.length);

  const onToggleSwitch = () => setDestino(!destino);

  const filterByDescricao = (textToSearch) => {
    setEntities(
      entities.filter((item) => item.descricao.includes(textToSearch))
    );
  };

  const filterByValidade = () => {
    setEntities(
      entities.filter((entity) => testeValidade(entity.validade) < 60)
    );
  };

  function testeValidade(validade) {
    let date1 = new Date(); //data de hoje
    let date2 = new Date(
      String(validade).split("/")[2],
      String(validade).split("/")[1] - 1,
      String(validade).split("/")[0]
    ); // validade
    // Calculating the time difference
    // of two dates
    let Difference_In_Time = date2.getTime() - date1.getTime();
    // Calculating the no. of days between
    // two dates
    let Difference_In_Days = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );
    console.log(`dif em dias: ` + Difference_In_Days);
    return Difference_In_Days;
  }

  const onAddButtonPress = async () => {
    if (codigo && codigo.length > 0) {
      const data = {
        codigo: codigo,
        descricao: descricao,
        quantidade: quantidade,
        unidade: unidade,
        validade: validade,
        valor: valor,
        destino: destino,
        descDestino: descDestino,
      };

      await addDoc(collection(db, "history"), data)
        .then((_doc) => {
          setCodigo("");
          setDescricao("");
          setQuantidade("");
          setValidade("");
          setValor("");
          setDescDestino("");
          Keyboard.dismiss();
        })
        .then(() => {
          getMaterials().then((materials) => {
            console.log(materials);
            setEntities(materials);
          });
        })
        .catch((error) => {
          alert(error);
        });

      if (idAtual != "") {
        console.log("iremos alterar");
        console.log(data);
        console.log(idAtual);
        await setDoc(doc(db, "materials", idAtual), data)
          .then((_doc) => {
            setCodigo("");
            setDescricao("");
            setQuantidade("");
            setValidade("");
            setValor("");
            setDescDestino("");
            Keyboard.dismiss();
          })
          .then(() => {
            getMaterials().then((materials) => {
              console.log(materials);
              setEntities(materials);
            });
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        console.log("iremos adicionar");
        console.log(data);
        console.log(idAtual);
        await addDoc(collection(db, "materials"), data)
          .then((_doc) => {
            setCodigo("");
            setDescricao("");
            setQuantidade("");
            setValidade("");
            setValor("");
            setDescDestino("");
            Keyboard.dismiss();
          })
          .then(() => {
            getMaterials().then((materials) => {
              console.log(materials);
              setEntities(materials);
            });
          })
          .catch((error) => {
            alert(error);
          });
      }
    }
    setIDAtual("");
    setEntityAtual({ codigo: 0, descricao: "", quantidade: 0 });
  };

  const visualizar = async (entity) => {
    console.log(entity);
    setEntityAtual(entity);

    const q = query(
      collection(db, "materials"),
      where("codigo", "==", entity.codigo),
      where("descricao", "==", entity.descricao),
      where("quantidade", "==", entity.quantidade)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      setIDAtual(doc.id);
    });

    showModal();
  };

  const alterar = (entity) => {
    console.log(entity);
    setCodigo(entity.codigo);
    setDescricao(entity.descricao);
    setQuantidade(entity.quantidade);
    setUnidade(entity.unidade);
    setValidade(entity.validade);
    setValor(entity.valor);
    setDestino(entity.destino);
    setDescDestino(entity.descDestino);
    hideModal();
  };

  const excluir = async (entity) => {
    console.log(entity);
    await addDoc(collection(db, "history"), {
      ...entity,
      status: "item excluido",
    });

    const q = query(
      collection(db, "materials"),
      where("codigo", "==", entity.codigo),
      where("descricao", "==", entity.descricao),
      where("quantidade", "==", entity.quantidade)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id);
      setIDAtual(doc.id);
    });
    await deleteDoc(doc(db, "materials", idAtual))
      .then(() => {
        getMaterials().then((materials) => {
          console.log(materials);
          setEntities(materials);
        });
      })
      .then(() => hideModal());
  };

  const dismiss = () => {
    setIDAtual("");
    hideModal();
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem("userAtual");
      const jsonValue = await AsyncStorage.getItem("userAtual");
      jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log("user atual? " + jsonValue);
      navigation.navigate("Login");
    } catch (e) {
      // remove error
    }
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Button
            mode="contained"
            onPress={() => {
              logOut();
            }}
            style={styles.button}>
            Log out
          </Button>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={dismiss}
              contentContainerStyle={containerStyle}>
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
              <Text>
                Destino: {entityAtual.destino ? "Externo" : "Interno"}
              </Text>
              <Text>Descrição do destino: {entityAtual.descDestino}</Text>
              <Text
                style={
                  testeValidade(entityAtual.validade) <= 0
                    ? { color: "red" }
                    : testeValidade(entityAtual.validade) > 0 && testeValidade(entityAtual.validade) <=60
                    ? { color: "orange" }
                    : { color: "black" }
                }>
                {testeValidade(entityAtual.validade) <= 0
                  ? "Produto vencido"
                  : 

                  testeValidade(entityAtual.validade) > 0 && testeValidade(entityAtual.validade) <=60
                  ? "Produto prestes a vencer dentro de 60 dias"
                  : "Produto na validade"
                  
                  
                  
                  }
              </Text>

              <Button
                mode="contained"
                onPress={() => alterar(entityAtual)}
                style={styles.button}>
                Alterar
              </Button>
              <Button
                mode="contained"
                onPress={() => excluir(entityAtual)}
                style={styles.button}>
                Excluir
              </Button>
            </Modal>
          </Portal>
          <TextInput
            label="Código"
            style={styles.input}
            placeholder="Código"
            onChangeText={(text) => setCodigo(text)}
            value={codigo}
          />
          <TextInput
            style={styles.input}
            label="Descrição"
            placeholder="Descrição"
            onChangeText={(text) => setDescricao(text)}
            value={descricao}
          />
          <TextInput
            style={styles.input}
            label="Quantidade"
            placeholder="Quantidade"
            onChangeText={(text) => setQuantidade(text)}
            value={quantidade}
          />
          <PaperSelect
            hideSearchBox={true}
            style={styles.input}
            label="Unidade"
            value={unidade.value}
            onSelection={(value) =>
              setUnidade({
                ...unidade,
                value: value.text,
                selectedList: value.selectedList,
                error: "",
              })
            }
            arrayList={[...unidade.list]}
            selectedArrayList={[...unidade.selectedList]}
            placeholder="Unidade"
            errorText={unidade.error}></PaperSelect>
          <MaskInput
            style={styles.maskInput}
            label="Validade"
            placeholder="Validade"
            onChangeText={(text) => setValidade(text)}
            mask={Masks.DATE_DDMMYYYY}
            value={validade}
          />
          <MaskInput
            style={styles.maskInput}
            label="Valor"
            placeholder="Valor"
            onChangeText={(text) => setValor(text)}
            mask={Masks.BRL_CURRENCY}
            value={valor}
          />
          <Text>Destino: </Text>
          <View style={styles.viewDestino}>
            <Text>Interno</Text>
            <Switch value={destino} onValueChange={onToggleSwitch} />
            <Text>Externo</Text>
          </View>
          <TextInput
            style={styles.input}
            label="Descrição do destino"
            placeholder="Descrição do destino"
            onChangeText={(text) => setDescDestino(text)}
            value={descDestino}
          />
          <Button
            mode="contained"
            onPress={onAddButtonPress}
            style={styles.button}>
            Salvar
          </Button>
          <View>
            <TextInput
              style={styles.input}
              label="Pesquisar"
              placeholder="Pesquisar um material"
              onChangeText={(text) => setTextPesquisa(text)}
              value={textPesquisa}
            />
            <Button
              mode="contained"
              onPress={() => filterByDescricao(textPesquisa)}
              style={styles.button}>
              Pesquisar por descrição
            </Button>
            <Button
              mode="contained"
              onPress={() => filterByValidade()}
              style={styles.button}>
              Filtar itens a vencer
            </Button>
            <Button
              mode="contained"
              onPress={() => fetchMaterials()}
              style={styles.button}>
              Limpar filtros
            </Button>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Código</DataTable.Title>
              <DataTable.Title>Descrição</DataTable.Title>
              <DataTable.Title>Quantidade</DataTable.Title>
              <DataTable.Title>Ação</DataTable.Title>
            </DataTable.Header>
          </DataTable>
          {entities.slice(from, to).map((entitie) => (
            <DataTable.Row key={entitie.codigo}>
              <DataTable.Cell
                style={
                  testeValidade(entitie.validade) <= 0
                    ? { backgroundColor: "red" }
                    : {}
                }>
                {entitie.codigo}
              </DataTable.Cell>
              <DataTable.Cell
                style={
                  testeValidade(entitie.validade) <= 0
                    ? { backgroundColor: "red" }
                    : {}
                }>
                {entitie.descricao}
              </DataTable.Cell>
              <DataTable.Cell
                style={
                  testeValidade(entitie.validade) <= 0
                    ? { backgroundColor: "red" }
                    : {}
                }>
                {entitie.quantidade}
              </DataTable.Cell>
              <DataTable.Cell
                style={
                  testeValidade(entitie.validade) <= 0
                    ? { backgroundColor: "red" }
                    : {}
                }
                onPress={() => visualizar(entitie)}>
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
          <Button
            mode="contained"
            onPress={() => navigation.navigate("History")}
            style={styles.button}>
            Ir para histórico
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
