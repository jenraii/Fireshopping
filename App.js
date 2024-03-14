import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyBkPuo6RQB7SlA240S_1YsD3XY3vpZUF7I",
  authDomain: "fireshopping-984bc.firebaseapp.com",
  databaseURL: "https://fireshopping-984bc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fireshopping-984bc",
  storageBucket: "fireshopping-984bc.appspot.com",
  messagingSenderId: "1016741997091",
  appId: "1:1016741997091:web:f3837424b123e1a06f1f96"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(database, 'products/');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.entries(data).map(([key, value]) => ({ ...value, key }));
        setProducts(productList);
      } else {
        setProducts([]);
      }
    });
  }, []);

  const saveProduct = () => {
    if (product && amount) {
      const productsRef = ref(database, 'products/');
      push(productsRef, { product, amount });
      setProduct('');
      setAmount('');
    }
  };

  const deleteProduct = (productKey) => {
    remove(ref(database, `products/${productKey}`))
      .then(() => {
        const updatedProducts = products.filter((item) => item.key !== productKey);
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

const listSeparator = () => <View style={styles.separator} />;

return (
  <View style={styles.container}>
    <Text style={styles.title}>Ostoslista</Text>
    <View style={styles.inputContainer}>
      <TextInput
        placeholder='Product'
        style={styles.input}
        value={product}
        onChangeText={(text) => setProduct(text)}
      />
      <TextInput
        placeholder='Amount'
        style={styles.input}
        value={amount}
        onChangeText={(text) => setAmount(text)}
        keyboardType="numeric"
      />
      <Button color="green" onPress={saveProduct} title="Lisää" />
    </View>
    <FlatList
      style={styles.list}
      data={products}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.product}, {item.amount}</Text>
          <Button color="red" title="Poista" onPress={() => deleteProduct(item.key)} />
        </View>
      )}
      ItemSeparatorComponent={listSeparator}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'vertical',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  input: {

    marginBottom: 10,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
  },
});