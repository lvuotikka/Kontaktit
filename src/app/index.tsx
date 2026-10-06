import React, { useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Contacts from 'expo-contacts';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export default function Index() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access contacts was denied');
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    const contactList = data
      .filter(
        (contact) =>
          contact.phoneNumbers &&
          contact.phoneNumbers.length > 0
      )
      .map((contact) => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phoneNumbers![0].number || '',
      }));

    setContacts(contactList);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contact}>
            <Text>
              {item.name} {item.phone}
            </Text>
          </View>
        )}
      />

      <Button
        title="GET CONTACTS"
        onPress={getContacts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },

  contact: {
    marginBottom: 10,
  },
});