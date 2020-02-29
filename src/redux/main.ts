// Imports: Dependencies
import {applyMiddleware, combineReducers, createStore, Store} from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import {createLogger} from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import {composeWithDevTools} from 'redux-devtools-extension';
import {weather} from './weather';

export interface Actions<PROPS> {
  type: string;
  payload: PROPS;
}

interface ReducersAugment {
  weather: weather;
}

// Redux: Root Reducer
const rootReducer = combineReducers({
  weather,
});

// Middleware: Redux Thunk (Async/Await)
const middleware: [any] = [thunk];

// Middleware: Redux Logger (For Development)
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

// Middleware: Redux Persist Config
const persistConfig = {
  // Root?
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['weather'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux: Store
export type State = ReducersAugment;

const store: Store<State> = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware)),
);

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

// Exports
export {middleware, store, persistor, rootReducer};
