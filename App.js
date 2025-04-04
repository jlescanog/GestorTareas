// App.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  // Estado para almacenar las tareas
  const [tareas, setTareas] = useState([]);
  
  // Estado para la tarea actual que se está editando o creando
  const [tareaActual, setTareaActual] = useState({
    id: '',
    titulo: '',
    descripcion: '',
    fechaVencimiento: new Date(),
    prioridad: 'Media' // Valores posibles: 'Alta', 'Media', 'Baja'
  });
  
  // Estados para controlar la visibilidad de modales
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  
  // Cargar tareas al iniciar la aplicación
  useEffect(() => {
    cargarTareas();
  }, []);

  // Función para cargar tareas desde el almacenamiento local
  const cargarTareas = async () => {
    try {
      const tareasGuardadas = await AsyncStorage.getItem('tareas');
      if (tareasGuardadas !== null) {
        const tareasParseadas = JSON.parse(tareasGuardadas);
        // Convertir las fechas de string a objetos Date
        const tareasConFechas = tareasParseadas.map(tarea => ({
          ...tarea,
          fechaVencimiento: new Date(tarea.fechaVencimiento)
        }));
        setTareas(tareasConFechas);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  // Función para guardar tareas en el almacenamiento local
  const guardarTareas = async (nuevasTareas) => {
    try {
      await AsyncStorage.setItem('tareas', JSON.stringify(nuevasTareas));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  };

  // Manejar el cambio de fecha en el DatePicker
  const cambiarFecha = (event, selectedDate) => {
    setMostrarDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTareaActual({ ...tareaActual, fechaVencimiento: selectedDate });
    }
  };

  // Función para agregar o editar una tarea
  const guardarTarea = () => {
    if (!tareaActual.titulo.trim()) {
      Alert.alert('Error', 'El título de la tarea es obligatorio');
      return;
    }

    if (modoEdicion) {
      // Actualizar tarea existente
      const nuevasTareas = tareas.map(tarea => 
        tarea.id === tareaActual.id ? tareaActual : tarea
      );
      setTareas(nuevasTareas);
      guardarTareas(nuevasTareas);
    } else {
      // Crear nueva tarea con ID único
      const nuevaTarea = {
        ...tareaActual,
        id: Date.now().toString()
      };
      const nuevasTareas = [...tareas, nuevaTarea];
      setTareas(nuevasTareas);
      guardarTareas(nuevasTareas);
    }

    cerrarModal();
  };

  // Función para eliminar una tarea
  const eliminarTarea = (id) => {
    Alert.alert(
      "Eliminar tarea",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          onPress: () => {
            const nuevasTareas = tareas.filter(tarea => tarea.id !== id);
            setTareas(nuevasTareas);
            guardarTareas(nuevasTareas);
          },
          style: "destructive"
        }
      ]
    );
  };

  // Función para abrir el modal en modo creación
  const abrirModalCreacion = () => {
    setTareaActual({
      id: '',
      titulo: '',
      descripcion: '',
      fechaVencimiento: new Date(),
      prioridad: 'Media'
    });
    setModoEdicion(false);
    setModalVisible(true);
  };

  // Función para abrir el modal en modo edición
  const abrirModalEdicion = (tarea) => {
    setTareaActual({...tarea});
    setModoEdicion(true);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // Función para obtener el color según la prioridad
  const colorPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return '#ff6b6b';
      case 'Media': return '#feca57';
      case 'Baja': return '#1dd1a1';
      default: return '#feca57';
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Renderizar cada tarea en la lista
  const renderTarea = ({ item }) => (
    <View style={[styles.tarea, {borderLeftColor: colorPrioridad(item.prioridad)}]}>
      <View style={styles.tareaHeader}>
        <Text style={styles.tareaTitulo}>{item.titulo}</Text>
        <View style={styles.tareaAcciones}>
          <TouchableOpacity onPress={() => abrirModalEdicion(item)} style={styles.botonAccion}>
            <Ionicons name="pencil" size={22} color="#4b7bec" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => eliminarTarea(item.id)} style={styles.botonAccion}>
            <Ionicons name="trash" size={22} color="#eb4d4b" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.tareaDescripcion}>{item.descripcion}</Text>
      
      <View style={styles.tareaFooter}>
        <View style={styles.etiquetaPrioridad}>
          <Text style={styles.textoPrioridad}>{item.prioridad}</Text>
        </View>
        <Text style={styles.tareaFecha}>
          Vence: {formatearFecha(new Date(item.fechaVencimiento))}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis Tareas</Text>
        <TouchableOpacity 
          style={styles.botonAgregar}
          onPress={abrirModalCreacion}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {tareas.length > 0 ? (
        <FlatList
          data={tareas}
          renderItem={renderTarea}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listado}
        />
      ) : (
        <View style={styles.mensajeVacio}>
          <Text style={styles.textoVacio}>No hay tareas pendientes</Text>
          <Text style={styles.subtextoVacio}>Pulsa el botón + para agregar una tarea</Text>
        </View>
      )}

      {/* Modal para crear/editar tarea */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitulo}>
              {modoEdicion ? 'Editar Tarea' : 'Nueva Tarea'}
            </Text>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.label}>Título*</Text>
              <TextInput
                style={styles.input}
                placeholder="Título de la tarea"
                value={tareaActual.titulo}
                onChangeText={text => setTareaActual({...tareaActual, titulo: text})}
              />
              
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción de la tarea"
                value={tareaActual.descripcion}
                onChangeText={text => setTareaActual({...tareaActual, descripcion: text})}
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.label}>Fecha de vencimiento</Text>
              <TouchableOpacity 
                style={styles.inputFecha}
                onPress={() => setMostrarDatePicker(true)}
              >
                <Text>{formatearFecha(tareaActual.fechaVencimiento)}</Text>
              </TouchableOpacity>
              
              {mostrarDatePicker && (
                <DateTimePicker
                  value={tareaActual.fechaVencimiento}
                  mode="date"
                  display="default"
                  onChange={cambiarFecha}
                />
              )}
              
              <Text style={styles.label}>Prioridad</Text>
              <View style={styles.prioridadContainer}>
                {['Baja', 'Media', 'Alta'].map(prioridad => (
                  <TouchableOpacity 
                    key={prioridad}
                    style={[
                      styles.botonPrioridad,
                      {backgroundColor: colorPrioridad(prioridad)},
                      tareaActual.prioridad === prioridad && styles.prioridadSeleccionada
                    ]}
                    onPress={() => setTareaActual({...tareaActual, prioridad})}
                  >
                    <Text style={styles.textoPrioridadBoton}>{prioridad}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.botonesModal}>
              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={cerrarModal}
              >
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonGuardar]}
                onPress={guardarTarea}
              >
                <Text style={[styles.textoBoton, {color: 'white'}]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4b7bec',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  botonAgregar: {
    width: 44,
    height: 44,
    backgroundColor: '#3867d6',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  listado: {
    padding: 16,
  },
  mensajeVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoVacio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a4b0be',
    marginBottom: 8,
  },
  subtextoVacio: {
    fontSize: 14,
    color: '#a4b0be',
  },
  tarea: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tareaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  tareaAcciones: {
    flexDirection: 'row',
  },
  botonAccion: {
    marginLeft: 12,
  },
  tareaDescripcion: {
    fontSize: 14,
    color: '#57606f',
    marginBottom: 12,
  },
  tareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etiquetaPrioridad: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#f1f2f6',
  },
  textoPrioridad: {
    fontSize: 12,
    fontWeight: '500',
  },
  tareaFecha: {
    fontSize: 12,
    color: '#57606f',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#2f3542',
  },
  input: {
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputFecha: {
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  prioridadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  botonPrioridad: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  prioridadSeleccionada: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  textoPrioridadBoton: {
    color: 'white',
    fontWeight: '500',
  },
  botonesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  boton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  botonCancelar: {
    backgroundColor: '#f1f2f6',
  },
  botonGuardar: {
    backgroundColor: '#4b7bec',
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: '500',
  }
});
