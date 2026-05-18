
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PokemonDetail } from './pages/PokemonDetail';
import { ComparePage } from './pages/ComparePage';
import { FavoritesPage } from './pages/FavoritePages';
import Layout from './layout/Layout';

function App() {

  return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route path="/pokemon/:nameOrId" element={<PokemonDetail />} />
				<Route path="/favorites" element={<FavoritesPage />} />
				<Route path="/compare" element={<ComparePage />} />
			</Route>
		</Routes>
  );
}

export default App;