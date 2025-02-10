import styles from '../styles/Search.module.css';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import debounce from "lodash.debounce";
import { setUserName, axiosRepos } from "../store/reposSlice";
import { ChangeEvent, useCallback } from "react";

const Search: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleSearch = (username: string) => {
        dispatch(setUserName(username));
        if (username.trim() !== '') {
            // Запрашиваем первую страницу репозиториев
            dispatch(axiosRepos({ username, page: 1 }));
          }
        };
      
    //предотвращаем избыточные запросы
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            handleSearch(value);
        }, 500), 
        []
    );

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };
  

    return (
        <div className={styles['search-wrapper']}>
            <input
                className={styles['search-input']}
                type='text'
                placeholder='Введите имя пользователя GitHub'
                onChange={onChange}
                >
            </input>
        </div>
    )
}

export default Search;
