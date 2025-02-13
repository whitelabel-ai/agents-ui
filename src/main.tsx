import { FC, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MainRouter from './router/MainRouter.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.Context.tsx';

type ProviderProps = {
  children: ReactNode;
};

type ProviderComponent = FC<ProviderProps>;

const composeProviders = (...providers: ProviderComponent[]): FC<ProviderProps> => ({ children }) => providers.reduceRight(
  (child, Provider) => <Provider>{child}</Provider>,
  children,
);

const Providers = composeProviders(AuthProvider)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <MainRouter />
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
