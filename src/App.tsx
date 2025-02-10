import React from 'react';
import { RepoList } from './components/RepoList'
import Search from './components/Search'

const App: React.FC = () => {
  return (
    <div className ='container'>
      <div className ='title'>GitHub Репозитории</div>
      <Search />
      <RepoList />
    </div>
  )
}

export default App