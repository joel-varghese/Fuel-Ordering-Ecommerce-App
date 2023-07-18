import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers/rootReducer';
import { createStore } from 'redux';
import storageSession from 'redux-persist/lib/storage/session'

export default function configureStore(preloadedState) {
	// Middleware: Redux Persist Config
	const persistConfig = {
		// Root
		key: 'root',
		// Storage Method (React Native)
		storage: storageSession,
	};
	// Middleware: Redux Persist Persisted Reducer
	const persistedReducer = persistReducer(persistConfig, rootReducer);
	// Create the store
	const store = createStore(persistedReducer);
	// Middleware: Redux Persist Persister
	const persistor = persistStore(store);
	return { store, persistor };
}
