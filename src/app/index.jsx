import { Picker } from "@react-native-picker/picker";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Nota } from "../componentes/Nota";
import NotaEditor from "../componentes/NotaEditor";

export default function App() {

  const db = useSQLiteContext();
  const [notaSelecionada, setNotaSelecionada] = useState({});
  const [notas, setNotas] = useState([]);
  const [categoria, setCategoria] = useState("Todos");
  
  useEffect(() => {
    mostrarNotas();
  }, []);

  const mostrarNotas = async () => {
    setCategoria("Todos");
    try {
      const todasNotas = await db.getAllAsync(` SELECT * FROM notas; `);
      setNotas(todasNotas);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
    };
  };

  const filtrarLista = async (categoriaSelecionada) => {
    setCategoria(categoriaSelecionada);
    if (categoriaSelecionada === "Todos") {
      await mostrarNotas();
    } else {
      try {
        const todasNotas = await db.getAllAsync(
          ` SELECT * FROM notas WHERE categoria = ? ; `,
          [categoriaSelecionada]
        );
        setNotas(todasNotas);
      } catch (error) {
        console.error("Erro ao filtrar notas:", error);
      }
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
              <View style={estilos.pickerContainer}>
                <Picker
                  selectedValue={categoria}
                  style={estilos.picker}
                  itemStyle={estilos.pickerItem}
                  onValueChange={(categoriaSelecionada) => filtrarLista(categoriaSelecionada)}
                >
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#EEEEEE",
    margin: 16,
  },
  picker: {
    height: 32,
    fontSize: 24,
    width: '100%',
    color: 'black', // Text color for selected item
  },
  pickerItem: { // iOS only
    height: 32,
    fontSize: 24,
    color: 'blue',
  },
});
