import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Nota } from "../src/componentes/Nota";
import NotaEditor from "../src/componentes/NotaEditor";
import { criarTabela, filtrarPorCategoria, listarNotas } from "../src/servicos/SQLite";

export default function App() {

  const [notaSelecionada, setNotaSelecionada] = useState({});
  const [notas, setNotas] = useState([]);
  const [categoria, setCategoria] = useState("Todos");

  useEffect(() => {
    criarTabela();
    mostrarNotas();
  }, []);

  async function mostrarNotas() {
    const todasNotas = await listarNotas();
    setNotas(todasNotas);
    console.log(todasNotas);
  };

  async function filtrarLista(categoriaSelecionada) {
    setCategoria(categoriaSelecionada);
    if (categoriaSelecionada === "Todos") {
      await mostrarNotas();
    } else {
      setNotas(await filtrarPorCategoria(categoriaSelecionada));
    };
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={estilos.container}>
        <FlatList
          data={notas}
          renderItem={(nota) => <Nota {...nota} setNotaSelecionada={setNotaSelecionada} />}
          keyExtractor={nota => nota.id}
          ListHeaderComponent={() => {
            return (
              <View style={estilos.picker}>
                <Picker selectedValue={categoria} onValueChange={(categoriaSelecionada) => filtrarLista(categoriaSelecionada)}>
                  <Picker.Item label="Todos" value="Todos" />
                  <Picker.Item label="Pessoal" value="Pessoal" />
                  <Picker.Item label="Trabalho" value="Trabalho" />
                  <Picker.Item label="Outros" value="Outros" />
                </Picker>
              </View>
            )
          }} />
        <NotaEditor mostrarNotas={mostrarNotas} notaSelecionada={notaSelecionada} setNotaSelecionada={setNotaSelecionada} />
        <StatusBar />
      </SafeAreaView>
    </SafeAreaProvider>
  )
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#EEEEEE",
    margin: 16,
  }
});
