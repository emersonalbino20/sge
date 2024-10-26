import * as React from "react";
import './App.css';
import AppRoutes from './_routes/AppRoutes';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


function App(){
  return   <QueryClientProvider client={queryClient}>
              <AppRoutes/>
          </QueryClientProvider>
}



export default App;