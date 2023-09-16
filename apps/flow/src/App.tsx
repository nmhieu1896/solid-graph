import { Route, Routes } from '@solidjs/router';
import Board from '_@pages/Board';
import Home from '_@pages/Home';
import { type Component } from 'solid-js';

const App: Component = () => {
  return (
    <Routes>
      <Route path="/:id" component={Board} />
      <Route path="/" component={Home} />
    </Routes>
  );
};

export default App;
