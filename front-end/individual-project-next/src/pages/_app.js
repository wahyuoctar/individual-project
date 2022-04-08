import '../styles/globals.css'
import {ChakraProvider} from '@chakra-ui/react'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import rootReducer from '../redux/store'
import Navbar from '../components/Navbar'

const store = createStore(rootReducer)

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    <ChakraProvider>
      <Navbar />
    <Component {...pageProps} />
    </ChakraProvider>
    </Provider>
  ) 
}

export default MyApp
