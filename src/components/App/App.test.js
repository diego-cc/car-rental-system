import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";

describe('App.js', () => {
  function renderWithRouter(children, historyConf = {}) {
    const history = createMemoryHistory(historyConf);
    return render(<Router history={history}>{children}</Router>)
  }
  test('something', () => {
    renderWithRouter(<ClientHome />, { initialEntries: ['/'] })
  });
});