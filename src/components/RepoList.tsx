import styles from '../styles/RepoList.module.css';
import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RepoCard } from './RepoCard';
import { axiosRepos } from '../store/reposSlice';
import { AppDispatch, RootState } from '../store/store';



export const RepoList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { repos, status, error, username, page, hasMore } = useSelector(
        (state: RootState) => state.repos
    );

    // Используем ref для наблюдения за последним элементом списка
    const observer = useRef<IntersectionObserver | null>(null);
    const lastRepoElementRef = useCallback(
        (node: HTMLDivElement | null) => {
        if (status === 'loading') return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && username.trim() !== '') {
            dispatch(axiosRepos({ username, page }));
            }
        });

        if (node) observer.current.observe(node);
        },
        [status, hasMore, username, page, dispatch]
    );

    return (
        <div className={styles['repos']}>
        {repos.map((repo, index) => {
          if (repos.length === index + 1) {
            return (
              <div ref={lastRepoElementRef} key={repo.id}>
                <RepoCard repo={repo} />
              </div>
            );
          } else {
            return <RepoCard key={repo.id} repo={repo} />;
          }
        })}
  
        {status === 'loading' && <div className={styles['loading-indicator']}></div>}
        {error && <div className={styles['error']}>{error}</div>}
        {repos.length === 0 && status !== 'loading' && !error && username }
      </div>
    );
  };

