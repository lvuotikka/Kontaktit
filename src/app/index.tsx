import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';

interface ContactItem {
  id: string;
  name: string;
  phoneNumber?: string;
}

export default function Index() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  const getContacts = async () => {
    try {
      // Haetaan luvat asynkronisesti
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        // Haetaan yhteystiedot asynkronisesti
        const { data } = await Contacts.getContactsAsync({
          fields: ['phoneNumbers'],
        });

        if (data && data.length > 0) {
          const formattedData: ContactItem[] = data.map((contact) => ({
            id: contact.id,
            name: contact.name || 'Ei nimeä',
            phoneNumber:
              contact.phoneNumbers && contact.phoneNumbers.length > 0
                ? contact.phoneNumbers[0].number
                : 'Ei numeroa',
          }));

          setContacts(formattedData);
        } else {
          Alert.alert('Huomio', 'Ei yhteystietoja laitteella.');
        }
      } else {
        Alert.alert('Virhe', 'Lupaa yhteystietojen lukemiseen ei myönnetty.');
      }
    } catch (error) {
      Alert.alert('Virhe haussa', String(error));
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} {item.phoneNumber}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Ei ladattuja yhteystietoja</Text>
        }
      />

      <View style={styles.buttonContainer}>
        <Button title="Get Contacts" onPress={getContacts} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  item: {
    paddingVertical: 6,
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  buttonContainer: {
    marginBottom: 20,
  },
});