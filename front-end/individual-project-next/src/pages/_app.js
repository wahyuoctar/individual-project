import '../styles/globals.css'
import {ChakraProvider} from '@chakra-ui/react'
import {Provider} from 'react-redux'
import store from '../redux/store'
import Navbar from '../components/Navbar'
import AuthProvider from '../components/AuthProvider'
import NetworkMessageWrapper from '../components/NetworkMessageWrapper/NetworkMessageWrapper'


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    <ChakraProvider>
      <NetworkMessageWrapper>
      <AuthProvider>
      <Navbar />
    <Component {...pageProps} />
      </AuthProvider>
      </NetworkMessageWrapper>
    </ChakraProvider>
    </Provider>
  ) 
}

export default MyApp
