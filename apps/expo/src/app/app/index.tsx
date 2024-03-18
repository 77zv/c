import { View, Text, Button } from 'react-native'
import React from 'react'
import { useSession } from '~/contexts/SessionsContext'

const Home = () => {

    const session = useSession();

    const onSubmit = async () => {
        await session.signOut();
    }

  return (
    <View>
      <Text>Welcome to the homepage</Text>
      <Button title={"Sign Out"} onPress={onSubmit}/>
    </View>
  )
}

export default Home