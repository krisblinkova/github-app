import axios from 'axios'

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const PREFIX = import.meta.env.VITE_PREFIX

export interface Repo {
    id: number;
    name: string;
    description?: string;
    html_url: string;
    stargazers_count: number;
    updated_at: string;
}


export interface ReposState {
    repos: Repo[];
    status: 'idle' | 'loading' | 'failed';
    page: number;
    username: string;
    error: string | null;
    hasMore: boolean;
    
}

const initialState: ReposState = {
    repos: [],
    status: 'idle',
    page: 1,
    username: '',
    error: null,
    hasMore: true,
};

const PER_PAGE = 20;

export const axiosRepos = createAsyncThunk(
    '/users/{username}/repos',
        async ( params: { username: string, page: number }) => {
            try {
                const response = await axios.get(`${PREFIX}/users/${params.username}/repos`, {
                params: {
                  page: params.page,
                  per_page: PER_PAGE, 
                },
        });
            return response.data;
            } catch(e) {
                if (axios.isAxiosError(e)) {
                    throw new Error(e.response?.data.message || 'Ошибка запроса');
                }
                throw new Error('Неизвестная ошибка');
            }

        });


export const reposSlice = createSlice({
    name: 'repos',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
            state.page = 1;
            state.repos = [];
            state.hasMore = true;
            state.error = null;
        },
        clearRepos: (state) => {
            state.repos = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null; 
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(axiosRepos.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(axiosRepos.fulfilled, (state, action) => {
                state.status = 'idle';
                if (action.payload.length < PER_PAGE) {
                    state.hasMore = false;
            }
                // Если это первая страница — заменяем, иначе добавляем к имеющимся
                if (state.page === 1) {
                    state.repos = action.payload;
                } else {
                    //фильтруем репозитории, которые уже есть в списке
                    const newRepos = action.payload.filter(
                        (repo: { id: number; }) => !state.repos.some(existing => existing.id === repo.id) 
                    );
                    state.repos = [...state.repos, ...newRepos];
                }
                state.page += 1;
                })
                
            .addCase(axiosRepos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Произошла ошибка при загрузке данных";
            });
    },

});

export const { setUserName, clearRepos} = reposSlice.actions;
export default reposSlice.reducer;
