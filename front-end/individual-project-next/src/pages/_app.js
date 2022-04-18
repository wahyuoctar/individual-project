import '../styles/globals.css'
import {ChakraProvider} from '@chakra-ui/react'
import {Provider} from 'react-redux'
import store from '../redux/store'
import Navbar from '../components/Navbar'
import AuthProvider from '../components/AuthProvider'


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    <ChakraProvider>
      <AuthProvider>
      <Navbar />
    <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
    </Provider>
  ) 
}

export default MyApp
